import { o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { i as parseArgs, t as fail } from "./utils-Dd6V9pzd.js";
import { d as resourcePut, o as resourceGetByPath } from "./store--irHLonY.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/resources/save-memory.js
/**
* Core script: save-memory
*
* Create or update a structured memory entry and its index.
* Stores memory as a resource at `memory/<name>.md` (personal scope)
* and maintains a `memory/MEMORY.md` index.
*/
var VALID_TYPES = [
	"user",
	"feedback",
	"project",
	"reference"
];
var EMPTY_INDEX = `# Memory Index
`;
async function saveMemoryScript(args) {
	const parsed = parseArgs(args);
	const name = parsed.name;
	if (!name) fail("--name is required (e.g. 'coding-style', 'project-alpha')");
	const type = parsed.type;
	if (!type || !VALID_TYPES.includes(type)) fail(`--type is required. Must be one of: ${VALID_TYPES.join(", ")}`);
	const description = parsed.description;
	if (!description) fail("--description is required (one-line summary)");
	const content = parsed.content;
	if (!content) fail("--content is required");
	const owner = getRequestUserEmail() ?? process.env.AGENT_USER_EMAIL;
	if (!owner) fail("save-memory requires an authenticated user (request context or AGENT_USER_EMAIL env var).");
	const memoryPath = `memory/${name}.md`;
	const indexPath = "memory/MEMORY.md";
	await resourcePut(owner, memoryPath, `---
type: ${type}
description: ${description}
updated: ${(/* @__PURE__ */ new Date()).toISOString().slice(0, 10)}
---

${content}`, "text/markdown");
	let index;
	try {
		index = (await resourceGetByPath(owner, indexPath))?.content ?? EMPTY_INDEX;
	} catch {
		index = EMPTY_INDEX;
	}
	const lines = index.split("\n");
	const entryLine = `- [${name}](${name}.md) — ${description}`;
	const entryPrefix = `- [${name}]`;
	let found = false;
	const updatedLines = lines.map((line) => {
		if (line.startsWith(entryPrefix)) {
			found = true;
			return entryLine;
		}
		return line;
	});
	if (!found) updatedLines.push(entryLine);
	const updatedIndex = updatedLines.join("\n").trimEnd() + "\n";
	const lineCount = updatedIndex.split("\n").length;
	if (lineCount > 200) console.log(`Warning: Memory index has ${lineCount} lines (recommended: <200). Consider consolidating or removing old memories.`);
	await resourcePut(owner, indexPath, updatedIndex, "text/markdown");
	console.log(`Saved memory "${name}" (${type}): ${description}`);
}
//#endregion
export { saveMemoryScript as default };
