import { r as __exportAll } from "./chunk-D3zDcpJC.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/resources/metadata.js
var metadata_exports = /* @__PURE__ */ __exportAll({
	LEGACY_REMOTE_AGENT_RESOURCE_PREFIX: () => LEGACY_REMOTE_AGENT_RESOURCE_PREFIX,
	REMOTE_AGENT_RESOURCE_PREFIX: () => REMOTE_AGENT_RESOURCE_PREFIX,
	REMOTE_AGENT_RESOURCE_PREFIXES: () => REMOTE_AGENT_RESOURCE_PREFIXES,
	frontmatterFieldsToObject: () => frontmatterFieldsToObject,
	getFrontmatterValue: () => getFrontmatterValue,
	getRemoteAgentIdFromPath: () => getRemoteAgentIdFromPath,
	getResourceKind: () => getResourceKind,
	getSkillNameFromPath: () => getSkillNameFromPath,
	isCustomAgentPath: () => isCustomAgentPath,
	isJobPath: () => isJobPath,
	isRemoteAgentPath: () => isRemoteAgentPath,
	isSkillPath: () => isSkillPath,
	parseCustomAgentProfile: () => parseCustomAgentProfile,
	parseFrontmatter: () => parseFrontmatter,
	parseRemoteAgentManifest: () => parseRemoteAgentManifest,
	parseSkillMetadata: () => parseSkillMetadata,
	remoteAgentResourcePath: () => remoteAgentResourcePath,
	serializeFrontmatter: () => serializeFrontmatter
});
var REMOTE_AGENT_RESOURCE_PREFIX = "remote-agents/";
var LEGACY_REMOTE_AGENT_RESOURCE_PREFIX = "agents/";
var REMOTE_AGENT_RESOURCE_PREFIXES = [REMOTE_AGENT_RESOURCE_PREFIX, LEGACY_REMOTE_AGENT_RESOURCE_PREFIX];
function normalizeFrontmatterValue(value) {
	const trimmed = value.trim();
	if (trimmed.startsWith("\"") && trimmed.endsWith("\"") || trimmed.startsWith("'") && trimmed.endsWith("'")) return trimmed.slice(1, -1);
	return trimmed;
}
function parseFrontmatter(content) {
	const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/);
	if (!match) return null;
	const raw = match[0];
	const yamlBlock = match[1];
	const fields = [];
	const lines = yamlBlock.split("\n");
	let i = 0;
	while (i < lines.length) {
		const kvMatch = lines[i].match(/^(\w[\w-]*):\s*(.*)/);
		if (!kvMatch) {
			i++;
			continue;
		}
		const key = kvMatch[1];
		let value = kvMatch[2].trim();
		if (value === ">-" || value === ">" || value === "|" || value === "|-") {
			const multiLines = [];
			i++;
			while (i < lines.length && /^\s+/.test(lines[i])) {
				multiLines.push(lines[i].trim());
				i++;
			}
			value = multiLines.join(" ");
		} else i++;
		fields.push({
			key,
			value: normalizeFrontmatterValue(value)
		});
	}
	return {
		raw,
		body: content.slice(raw.length),
		fields
	};
}
function serializeFrontmatter(fields) {
	return `---\n${fields.map(({ key, value }) => {
		if (key === "description" && value.length > 60) {
			const words = value.split(" ");
			const wrapped = [];
			let line = "";
			for (const word of words) if (line && line.length + word.length + 1 > 72) {
				wrapped.push(`  ${line}`);
				line = word;
			} else line = line ? `${line} ${word}` : word;
			if (line) wrapped.push(`  ${line}`);
			return `${key}: >-\n${wrapped.join("\n")}`;
		}
		return `${key}: ${value.includes(":") || value.startsWith("[") || value.startsWith("{") ? JSON.stringify(value) : value}`;
	}).join("\n")}\n---\n`;
}
function getFrontmatterValue(frontmatter, key) {
	return frontmatter?.fields.find((field) => field.key === key)?.value;
}
function frontmatterFieldsToObject(frontmatter) {
	return Object.fromEntries(frontmatter?.fields.map((f) => [f.key, f.value]) ?? []);
}
function isSkillPath(path) {
	return path.startsWith("skills/") && path.endsWith(".md");
}
function getSkillNameFromPath(path) {
	const relative = path.replace(/^\.agents\/skills\//, "").replace(/^skills\//, "");
	if (relative.endsWith("/SKILL.md")) return relative.replace(/\/SKILL\.md$/, "").split("/").pop() || relative;
	return relative.split("/").pop()?.replace(/\.md$/, "") || path;
}
function isJobPath(path) {
	return path.startsWith("jobs/") && path.endsWith(".md");
}
function isCustomAgentPath(path) {
	return path.startsWith("agents/") && path.endsWith(".md");
}
function isRemoteAgentPath(path) {
	return path.endsWith(".json") && REMOTE_AGENT_RESOURCE_PREFIXES.some((prefix) => path.startsWith(prefix));
}
function getRemoteAgentIdFromPath(path) {
	const prefix = REMOTE_AGENT_RESOURCE_PREFIXES.find((candidate) => path.startsWith(candidate));
	return (prefix ? path.slice(prefix.length) : path).replace(/\.json$/, "");
}
function remoteAgentResourcePath(id) {
	return `${REMOTE_AGENT_RESOURCE_PREFIX}${id}.json`;
}
function getResourceKind(path) {
	if (isSkillPath(path)) return "skill";
	if (isJobPath(path)) return "job";
	if (isCustomAgentPath(path)) return "agent";
	if (isRemoteAgentPath(path)) return "remote-agent";
	return "file";
}
function parseSkillMetadata(content, path) {
	if (!isSkillPath(path)) return null;
	const frontmatter = parseFrontmatter(content);
	return {
		name: getFrontmatterValue(frontmatter, "name") || getSkillNameFromPath(path),
		description: getFrontmatterValue(frontmatter, "description")
	};
}
function parseCustomAgentProfile(content, path) {
	if (!isCustomAgentPath(path)) return null;
	const frontmatter = parseFrontmatter(content);
	const values = frontmatterFieldsToObject(frontmatter);
	const id = path.replace(/^agents\//, "").replace(/\.md$/, "");
	return {
		id,
		path,
		name: values.name || id,
		description: values.description,
		model: values.model && values.model !== "inherit" ? values.model : void 0,
		tools: values.tools || void 0,
		color: values.color || void 0,
		delegateDefault: values["delegate-default"] === "true",
		instructions: (frontmatter?.body ?? content).trim()
	};
}
function parseRemoteAgentManifest(content, path) {
	if (!isRemoteAgentPath(path)) return null;
	try {
		const data = JSON.parse(content);
		const id = data.id || getRemoteAgentIdFromPath(path);
		if (!data.url) return null;
		return {
			id,
			path,
			name: data.name || id,
			description: data.description || "",
			url: data.url,
			color: data.color || "#6B7280"
		};
	} catch {
		return null;
	}
}
//#endregion
export { isCustomAgentPath as a, metadata_exports as c, parseRemoteAgentManifest as d, parseSkillMetadata as f, getSkillNameFromPath as i, parseCustomAgentProfile as l, serializeFrontmatter as m, getRemoteAgentIdFromPath as n, isRemoteAgentPath as o, remoteAgentResourcePath as p, getResourceKind as r, isSkillPath as s, getFrontmatterValue as t, parseFrontmatter as u };
