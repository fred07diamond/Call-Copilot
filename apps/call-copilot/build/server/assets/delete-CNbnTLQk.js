import { o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
import { i as parseArgs, t as fail } from "./utils-DGqsMmdl.js";
import { i as resourceDeleteByPath, t as SHARED_OWNER } from "./store-BptwquUa.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/resources/delete.js
/**
* Core script: resource-delete
*
* Delete a resource from the SQL store.
*
* Usage:
*   pnpm action resource-delete --path <path> [--scope personal|shared]
*/
async function resourceDeleteScript(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action resource-delete --path <path> [options]

Options:
  --path <path>            Resource path (required)
  --scope personal|shared  Scope to delete from (default: personal)
  --help                   Show this help message`);
		return;
	}
	const resourcePath = parsed.path;
	if (!resourcePath) fail("--path is required. Example: --path notes/todo.md");
	const scope = parsed.scope ?? "personal";
	let owner;
	if (scope === "shared") owner = SHARED_OWNER;
	else {
		const personalOwner = getRequestUserEmail() ?? process.env.AGENT_USER_EMAIL;
		if (!personalOwner) fail("resource-delete --scope=personal requires an authenticated user (request context or AGENT_USER_EMAIL env var).");
		owner = personalOwner;
	}
	if (await resourceDeleteByPath(owner, resourcePath)) console.log(`Deleted resource: ${resourcePath}`);
	else console.log(`Resource not found: ${resourcePath}`);
}
//#endregion
export { resourceDeleteScript as default };
