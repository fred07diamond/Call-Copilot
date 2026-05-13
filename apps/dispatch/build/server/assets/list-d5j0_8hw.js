import { o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { i as parseArgs, t as fail } from "./utils-Dd6V9pzd.js";
import { c as resourceListAccessible, n as ensurePersonalDefaults, s as resourceList, t as SHARED_OWNER } from "./store-DnS7XzPK.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/resources/list.js
/**
* Core script: resource-list
*
* List resources stored in the SQL resource store.
*
* Usage:
*   pnpm action resource-list [--prefix <path>] [--scope personal|shared|all] [--format json|text]
*/
async function resourceListScript(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action resource-list [options]

Options:
  --prefix <path>              Filter by path prefix
  --scope personal|shared|all  Scope to list (default: all)
  --format json|text           Output format (default: text)
  --help                       Show this help message`);
		return;
	}
	const prefix = parsed.prefix;
	const scope = parsed.scope ?? "all";
	const format = parsed.format ?? "text";
	const owner = getRequestUserEmail() ?? process.env.AGENT_USER_EMAIL;
	if (!owner) fail("resource-list requires an authenticated user (request context or AGENT_USER_EMAIL env var).");
	if (scope !== "shared") await ensurePersonalDefaults(owner);
	let resources;
	if (scope === "personal") resources = await resourceList(owner, prefix);
	else if (scope === "shared") resources = await resourceList(SHARED_OWNER, prefix);
	else resources = await resourceListAccessible(owner, prefix);
	if (format === "json") {
		console.log(JSON.stringify(resources, null, 2));
		return;
	}
	if (resources.length === 0) {
		console.log("No resources found.");
		return;
	}
	console.log(`Resources: ${resources.length}\n`);
	for (const r of resources) {
		const ownerLabel = r.owner === "__shared__" ? "[shared]" : `[${r.owner}]`;
		const sizeLabel = r.size != null ? ` (${r.size} bytes)` : "";
		console.log(`  ${r.path}  ${ownerLabel}${sizeLabel}  ${r.mimeType}`);
	}
}
//#endregion
export { resourceListScript as default };
