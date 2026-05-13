import { o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { i as parseArgs, t as fail } from "./utils-Dd6V9pzd.js";
import { d as resourcePut, i as resourceDeleteByPath, o as resourceGetByPath } from "./store--irHLonY.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/resources/delete-memory.js
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
