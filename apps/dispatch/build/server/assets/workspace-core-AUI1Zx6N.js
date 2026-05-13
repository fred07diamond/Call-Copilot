import path from "path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/deploy/workspace-core.js
/**
* Workspace-core discovery.
*
* An enterprise can sit many agent-native apps in one monorepo alongside a
* private workspace shared package that can provide shared plugins, skills,
* actions, and AGENTS.md. Apps inherit everything from
* the shared package without writing any boilerplate — this is the
* middle layer of the three-layer inheritance model:
*
*   1. app local           (highest priority — app's own server/plugins/, actions/, etc.)
*   2. workspace core      (middle — packages/shared/ in the enterprise monorepo)
*   3. @agent-native/core  (lowest — framework defaults)
*
* Discovery works by walking up from the build cwd looking for a package.json
* that declares `"agent-native": { "workspaceCore": "@company/shared" }`.
* The declared package is then resolved through the monorepo's node_modules,
* and its directory structure is probed for the standard layout:
*
*   packages/shared/
*     package.json
*     src/server/index.ts  (exports <slot>Plugin for any slot it wants to provide)
*     actions/             (shared agent-callable actions)
*     .agents/skills/      (shared skills)
*     AGENTS.md            (enterprise-wide agent instructions)
*     src/client/         (optional shared React code)
*/
var _fs;
async function getFs() {
	if (!_fs) _fs = await import("node:fs");
	return _fs;
}
var cache;
/**
* Walk up from startDir looking for a directory whose package.json has an
* `agent-native.workspaceCore` field. Returns both the root dir and the
* declared package name, or null if there's no workspace core in the tree.
*/
async function findWorkspaceRoot(startDir) {
	const fs = await getFs();
	let dir = path.resolve(startDir);
	for (let i = 0; i < 20; i++) {
		const pkgPath = path.join(dir, "package.json");
		if (fs.existsSync(pkgPath)) try {
			const declared = JSON.parse(fs.readFileSync(pkgPath, "utf-8"))?.["agent-native"]?.workspaceCore;
			if (typeof declared === "string" && declared.length > 0) return {
				workspaceRoot: dir,
				packageName: declared
			};
		} catch {}
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return null;
}
/**
* Resolve a workspace package name to its directory inside the monorepo.
* Tries in order:
*   1. <workspaceRoot>/node_modules/<packageName>/package.json (pnpm symlink)
*   2. For each dir under <workspaceRoot>/packages/*, read its package.json
*      and match on `name`.
*   3. For each dir under <workspaceRoot>/packages/*\/*, same match.
*
* The pnpm symlink approach is fastest when deps are installed; the direct
* scan is a fallback for pre-install scenarios (e.g. running tests before
* the first `pnpm install` in a scaffolded workspace).
*/
async function resolvePackageDir(workspaceRoot, packageName) {
	const fs = await getFs();
	const nmCandidate = path.join(workspaceRoot, "node_modules", packageName);
	if (fs.existsSync(path.join(nmCandidate, "package.json"))) return nmCandidate;
	const packagesDir = path.join(workspaceRoot, "packages");
	const candidates = [];
	if (fs.existsSync(packagesDir)) for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
		if (!entry.isDirectory()) continue;
		candidates.push(path.join(packagesDir, entry.name));
	}
	if (fs.existsSync(packagesDir)) for (const entry of fs.readdirSync(packagesDir, { withFileTypes: true })) {
		if (!entry.isDirectory() || !entry.name.startsWith("@")) continue;
		const scopeDir = path.join(packagesDir, entry.name);
		for (const sub of fs.readdirSync(scopeDir, { withFileTypes: true })) {
			if (!sub.isDirectory()) continue;
			candidates.push(path.join(scopeDir, sub.name));
		}
	}
	for (const candidate of candidates) {
		const pkgPath = path.join(candidate, "package.json");
		if (!fs.existsSync(pkgPath)) continue;
		try {
			if (JSON.parse(fs.readFileSync(pkgPath, "utf-8"))?.name === packageName) return candidate;
		} catch {}
	}
	return null;
}
/**
* Probe a workspace core package directory to discover which plugin slots it
* exports. We read its package.json `exports` field + peek at
* `src/server/index.ts` (or dist/server/index.js) looking for exports of the
* form `<slot>Plugin` — the same convention the core server index uses.
*/
async function discoverPluginExports(packageDir) {
	const fs = await getFs();
	const out = {};
	const candidates = [
		path.join(packageDir, "src", "server", "index.ts"),
		path.join(packageDir, "dist", "server", "index.js"),
		path.join(packageDir, "src", "server.ts"),
		path.join(packageDir, "dist", "server.js")
	];
	let source = "";
	for (const c of candidates) if (fs.existsSync(c)) try {
		source = fs.readFileSync(c, "utf-8");
		break;
	} catch {}
	if (!source) return out;
	for (const [slot, names] of Object.entries({
		"agent-chat": ["agentChatPlugin"],
		auth: ["authPlugin"],
		"core-routes": ["coreRoutesPlugin"],
		integrations: ["integrationsPlugin"],
		org: ["orgPlugin"],
		resources: ["resourcesPlugin"],
		sentry: ["sentryPlugin"],
		terminal: ["terminalPlugin"]
	})) for (const name of names) if ([
		new RegExp(`export\\s+const\\s+${name}\\b`, "m"),
		new RegExp(`export\\s+(?:async\\s+)?function\\s+${name}\\b`, "m"),
		new RegExp(`export\\s*\\{[^}]*?\\b${name}\\b[^}]*?\\}`, "m")
	].some((re) => re.test(source))) {
		out[slot] = name;
		break;
	}
	return out;
}
/**
* Main entry point. Discovers the workspace core for the given cwd (defaults
* to process.cwd()) and returns its layout. Returns null if there's no
* workspace core in the ancestor chain. Result is cached per-cwd so repeated
* calls during a single build are cheap.
*/
async function getWorkspaceCoreExports(cwd = process.cwd()) {
	if (cache && cache.cwd === cwd) return cache.result;
	const fs = await getFs();
	const rootInfo = await findWorkspaceRoot(cwd);
	if (!rootInfo) {
		cache = {
			cwd,
			result: null
		};
		return null;
	}
	const packageDir = await resolvePackageDir(rootInfo.workspaceRoot, rootInfo.packageName);
	if (!packageDir) {
		cache = {
			cwd,
			result: null
		};
		return null;
	}
	const plugins = await discoverPluginExports(packageDir);
	const actionsDir = path.join(packageDir, "actions");
	const skillsDir = [path.join(packageDir, ".agents", "skills"), path.join(packageDir, "skills")].find((candidate) => fs.existsSync(candidate)) ?? null;
	const agentsMdPath = path.join(packageDir, "AGENTS.md");
	const result = {
		workspaceRoot: rootInfo.workspaceRoot,
		packageName: rootInfo.packageName,
		packageDir,
		plugins,
		actionsDir: fs.existsSync(actionsDir) ? actionsDir : null,
		skillsDir,
		agentsMdPath: fs.existsSync(agentsMdPath) ? agentsMdPath : null
	};
	cache = {
		cwd,
		result
	};
	return result;
}
//#endregion
export { getWorkspaceCoreExports };
