import { o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
import { i as parseArgs, t as fail } from "./utils-DGqsMmdl.js";
import { n as ensurePersonalDefaults, o as resourceGetByPath, t as SHARED_OWNER } from "./store-BptwquUa.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/resources/read.js
/**
* Core script: resource-read
*
* Read a resource and output its content to stdout.
*
* Usage:
*   pnpm action resource-read --path <path> [--scope personal|shared]
*/
async function resourceReadScript(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action resource-read --path <path> [options]

Options:
  --path <path>            Resource path (required)
  --scope personal|shared  Scope to read from (default: personal, falls back to shared)
  --help                   Show this help message`);
		return;
	}
	const resourcePath = parsed.path;
	if (!resourcePath) fail("--path is required. Example: --path LEARNINGS.md");
	const scope = parsed.scope;
	const owner = getRequestUserEmail() ?? process.env.AGENT_USER_EMAIL;
	if (!owner) fail("resource-read requires an authenticated user (request context or AGENT_USER_EMAIL env var).");
	if (scope !== "shared") await ensurePersonalDefaults(owner);
	if (scope === "shared") {
		const resource = await resourceGetByPath(SHARED_OWNER, resourcePath);
		if (!resource) {
			console.log(`Resource not found: ${resourcePath} (scope: shared). You can create it with resource-write.`);
			return;
		}
		process.stdout.write(resource.content);
		return;
	}
	const personal = await resourceGetByPath(owner, resourcePath);
	if (personal) {
		process.stdout.write(personal.content);
		return;
	}
	if (scope === "personal") {
		console.log(`Resource not found: ${resourcePath} (scope: personal). You can create it with resource-write.`);
		return;
	}
	const shared = await resourceGetByPath(SHARED_OWNER, resourcePath);
	if (shared) {
		process.stdout.write(shared.content);
		return;
	}
	console.log(`Resource not found: ${resourcePath}. You can create it with resource-write.`);
}
//#endregion
export { resourceReadScript as default };
