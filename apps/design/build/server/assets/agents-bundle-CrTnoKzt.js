import fs from "node:fs";
import path from "node:path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/agents-bundle.js
/**
* Agents bundle — loads AGENTS.md and .agents/skills/ from the template.
*
* This is the single source of truth the framework's agent uses to mirror what
* Claude Code / Codex / any other agent would see when running locally in the
* repo. The filesystem is the canonical source; this module is just a loader
* that works both in dev (direct fs read) and production (content bundled at
* build time via the `virtual:agents-bundle` Vite plugin).
*
* Resolution order inside `loadAgentsBundle()`:
*   1. Virtual module (`virtual:agents-bundle`) — inlined at build time by the
*      framework's Vite plugin. This is the ONLY path that works on edge
*      runtimes (Cloudflare Workers) where `readFileSync` doesn't exist.
*   2. Filesystem fallback — `process.cwd()/AGENTS.md` +
*      `process.cwd()/.agents/skills/`. Only reliable in local dev and Node
*      production (`agent-native start`); not on Netlify/Vercel/CF at runtime.
*   3. Empty bundle — everything silently returns empty strings.
*
* Result is cached in module scope so it's only computed once per cold start.
*/
var EMPTY = {
	agentsMd: "",
	workspaceAgentsMd: "",
	skills: {}
};
var cached = null;
/**
* Parse the YAML frontmatter at the top of a skill file.
* Only pulls out `name` and `description` — deliberately simple, no YAML lib.
* Handles:
*   - Inline: `description: Some text`
*   - Folded scalar: `description: >-\n  multi\n  line` → "multi line"
*   - Literal scalar: `description: |\n  multi\n  line` → "multi\nline"
*/
function parseSkillFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]+?)\r?\n---/);
	if (!match) return {};
	const lines = match[1].split(/\r?\n/);
	const result = {};
	for (let i = 0; i < lines.length; i++) {
		const keyMatch = lines[i].match(/^([a-zA-Z_][a-zA-Z0-9_-]*):\s*(.*)$/);
		if (!keyMatch) continue;
		const [, key, valueRaw] = keyMatch;
		const trimmed = valueRaw.trim();
		const isFolded = trimmed === ">" || trimmed === ">-";
		const isLiteral = trimmed === "|" || trimmed === "|-";
		let value;
		if (isFolded || isLiteral) {
			const block = [];
			let j = i + 1;
			while (j < lines.length) {
				const next = lines[j];
				if (next.length === 0) {
					block.push("");
					j++;
					continue;
				}
				if (!/^\s/.test(next)) break;
				block.push(next.replace(/^\s+/, ""));
				j++;
			}
			while (block.length > 0 && block[block.length - 1] === "") block.pop();
			value = isFolded ? block.filter((l) => l !== "").join(" ") : block.join("\n");
			i = j - 1;
		} else value = trimmed;
		if (key === "name" && value) result.name = value;
		else if (key === "description" && value) result.description = value;
	}
	return result;
}
/**
* Read one skills directory into a `Record<string, Skill>`. Extracted so
* both the template and workspace-core paths can reuse it. `dirPrefix` is
* the display path that will be reported to the agent (e.g.
* `.agents/skills/<name>` for templates, or
* `<workspace-shared-package>/.agents/skills/<name>` for the workspace layer).
*/
function readSkillsDir(skillsDir, rootForRelative, out, skipExistingNames) {
	if (!fs.existsSync(skillsDir)) return;
	const entries = fs.readdirSync(skillsDir, { withFileTypes: true });
	for (const entry of entries) {
		if (!entry.isDirectory() && !entry.isSymbolicLink()) continue;
		const skillDirAbs = path.join(skillsDir, entry.name);
		const skillFile = path.join(skillDirAbs, "SKILL.md");
		try {
			const realSkillFile = fs.realpathSync(skillFile);
			if (!fs.existsSync(realSkillFile)) continue;
			const content = fs.readFileSync(realSkillFile, "utf-8");
			const meta = parseSkillFrontmatter(content);
			const name = meta.name ?? entry.name;
			if (skipExistingNames && out[name]) continue;
			const extraFiles = [];
			try {
				const walk = (subdir, prefix) => {
					for (const e of fs.readdirSync(subdir, { withFileTypes: true })) {
						const abs = path.join(subdir, e.name);
						const rel = prefix ? `${prefix}/${e.name}` : e.name;
						if (e.isDirectory() || e.isSymbolicLink()) try {
							if (fs.statSync(abs).isDirectory()) walk(abs, rel);
						} catch {}
						else if (e.isFile() && e.name !== "SKILL.md") extraFiles.push(rel);
					}
				};
				walk(skillDirAbs, "");
			} catch {}
			extraFiles.sort();
			out[name] = {
				meta: {
					name,
					description: meta.description ?? ""
				},
				content,
				dir: path.relative(rootForRelative, skillDirAbs).replace(/\\/g, "/"),
				extraFiles
			};
		} catch {}
	}
}
/**
* Read AGENTS.md + all skills directly from the filesystem rooted at `cwd`.
* Optionally also reads a workspace-core's AGENTS.md and skills directory
* and merges them in (template wins on name collisions). Used by both the
* Vite plugin (at build time) and the runtime fallback (in dev / Node prod).
*
* Synchronous — the Vite plugin's load hook calls it inline during the build.
*/
function readAgentsBundleFromFs(cwd, workspaceSource = null) {
	let agentsMd = "";
	try {
		const agentsMdPath = path.join(cwd, "AGENTS.md");
		if (fs.existsSync(agentsMdPath)) agentsMd = fs.readFileSync(agentsMdPath, "utf-8");
	} catch {}
	let workspaceAgentsMd = "";
	if (workspaceSource?.agentsMdPath) try {
		if (fs.existsSync(workspaceSource.agentsMdPath)) workspaceAgentsMd = fs.readFileSync(workspaceSource.agentsMdPath, "utf-8");
	} catch {}
	const skills = {};
	try {
		readSkillsDir(path.join(cwd, ".agents", "skills"), cwd, skills, false);
	} catch {}
	if (workspaceSource?.skillsDir) try {
		readSkillsDir(workspaceSource.skillsDir, workspaceSource.rootDir, skills, true);
	} catch {}
	return {
		agentsMd,
		workspaceAgentsMd,
		skills
	};
}
/**
* Load the agents bundle. Returns a cached result on subsequent calls.
* Tries the virtual module first (works everywhere, including edge), then
* falls back to filesystem reads from `process.cwd()` — which, when a
* workspace core is present, also merges in the workspace core's skills
* and AGENTS.md.
*/
async function loadAgentsBundle() {
	if (cached) return cached;
	try {
		const mod = await import("./_virtual_agents-bundle-D7sMMuSZ.js");
		if (mod && mod.default) {
			cached = mod.default;
			return cached;
		}
	} catch {}
	try {
		let workspaceSource = null;
		try {
			const { getWorkspaceCoreExports } = await import("./workspace-core-AUI1Zx6N.js");
			const ws = await getWorkspaceCoreExports(process.cwd());
			if (ws) workspaceSource = {
				skillsDir: ws.skillsDir,
				agentsMdPath: ws.agentsMdPath,
				rootDir: ws.packageDir
			};
		} catch {}
		cached = readAgentsBundleFromFs(process.cwd(), workspaceSource);
		return cached;
	} catch {
		cached = EMPTY;
		return cached;
	}
}
/**
* Generate the `<skills>` block to inject into the system prompt.
*
* Skills are folders at `.agents/skills/<name>/` containing a `SKILL.md` entry
* file plus any number of supporting files (additional markdown, examples,
* images, scripts). This block lists what's available and how to read them.
*
* In dev mode the agent has shell access and reads skills via `cat` — exactly
* like running `claude` locally in the repo. In production mode the agent has
* no shell; templates that need skill content at runtime should inline the
* critical parts directly in `AGENTS.md`.
*/
function generateSkillsPromptBlock(bundle) {
	const entries = Object.values(bundle.skills);
	if (entries.length === 0) return "";
	return `<skills>
The following skills live in the repo at \`.agents/skills/<name>/\`. Each skill is a folder containing a \`SKILL.md\` entry file and sometimes supporting files. Read a skill BEFORE starting a task it applies to.

To read a skill in dev mode (when you have shell access):
  \`shell(command="cat .agents/skills/<name>/SKILL.md")\`
  \`shell(command="ls .agents/skills/<name>/")\` to see all files in the folder

Available skills:
${entries.map((s) => {
		const extras = s.extraFiles.length > 0 ? ` (also contains: ${s.extraFiles.join(", ")})` : "";
		return `- \`${s.meta.name}\` at \`${s.dir}/\` — ${s.meta.description || "(no description)"}${extras}`;
	}).join("\n")}
</skills>`;
}
//#endregion
export { generateSkillsPromptBlock, loadAgentsBundle };
