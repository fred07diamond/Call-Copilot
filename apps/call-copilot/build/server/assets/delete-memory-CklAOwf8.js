import { o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
import { i as parseArgs, t as fail } from "./utils-DGqsMmdl.js";
import { d as resourcePut, i as resourceDeleteByPath, o as resourceGetByPath } from "./store-BptwquUa.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/resources/delete-memory.js
/**
* Core script: delete-memory
*
* Delete a memory entry and remove it from the index.
*/
async function deleteMemoryScript(args) {
	const name = parseArgs(args).name;
	if (!name) fail("--name is required (e.g. 'coding-style')");
	const owner = getRequestUserEmail() ?? process.env.AGENT_USER_EMAIL;
	if (!owner) fail("delete-memory requires an authenticated user (request context or AGENT_USER_EMAIL env var).");
	const memoryPath = `memory/${name}.md`;
	const indexPath = "memory/MEMORY.md";
	let deleted = false;
	try {
		await resourceDeleteByPath(owner, memoryPath);
		deleted = true;
	} catch {}
	try {
		const existing = await resourceGetByPath(owner, indexPath);
		if (existing?.content) {
			const entryPrefix = `- [${name}]`;
			const lines = existing.content.split("\n");
			const filtered = lines.filter((line) => !line.startsWith(entryPrefix));
			if (filtered.length !== lines.length) {
				await resourcePut(owner, indexPath, filtered.join("\n").trimEnd() + "\n", "text/markdown");
				deleted = true;
			}
		}
	} catch {}
	if (deleted) console.log(`Deleted memory "${name}".`);
	else console.log(`Memory "${name}" not found.`);
}
//#endregion
export { deleteMemoryScript as default };
