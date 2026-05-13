import { o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
import { i as parseArgs, t as fail } from "./utils-DGqsMmdl.js";
import { d as resourcePut, t as SHARED_OWNER } from "./store-BptwquUa.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/resources/write.js
/**
* Core script: resource-write
*
* Write (create or update) a resource in the SQL store.
*
* Usage:
*   pnpm action resource-write --path <path> --content <content> [--scope personal|shared] [--mime <mime-type>]
*/
var EXTENSION_MIME_MAP = {
	".md": "text/markdown",
	".ts": "text/typescript",
	".tsx": "text/typescript",
	".js": "text/javascript",
	".jsx": "text/javascript",
	".json": "application/json",
	".html": "text/html",
	".css": "text/css",
	".yaml": "text/yaml",
	".yml": "text/yaml",
	".xml": "application/xml",
	".svg": "image/svg+xml",
	".txt": "text/plain",
	".csv": "text/csv",
	".sql": "text/sql",
	".sh": "text/x-shellscript",
	".py": "text/x-python",
	".toml": "text/toml"
};
function inferMimeType(filePath) {
	const dotIndex = filePath.lastIndexOf(".");
	if (dotIndex === -1) return "text/plain";
	return EXTENSION_MIME_MAP[filePath.slice(dotIndex).toLowerCase()] ?? "text/plain";
}
async function resourceWriteScript(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action resource-write --path <path> --content <content> [options]

Options:
  --path <path>            Resource path (required)
  --content <content>      Content to write (required)
  --scope personal|shared  Scope to write to (default: personal)
  --mime <mime-type>       MIME type (default: inferred from extension)
  --help                   Show this help message`);
		return;
	}
	const resourcePath = parsed.path;
	if (!resourcePath) fail("--path is required. Example: --path notes/todo.md");
	const content = parsed.content;
	if (content === void 0 || content === null) fail("--content is required.");
	const scope = parsed.scope ?? "personal";
	const mimeType = parsed.mime ?? inferMimeType(resourcePath);
	let owner;
	if (scope === "shared") owner = SHARED_OWNER;
	else {
		const personalOwner = getRequestUserEmail() ?? process.env.AGENT_USER_EMAIL;
		if (!personalOwner) fail("resource-write --scope=personal requires an authenticated user (request context or AGENT_USER_EMAIL env var).");
		owner = personalOwner;
	}
	const resource = await resourcePut(owner, resourcePath, content, mimeType);
	console.log(`Wrote resource: ${resource.path} (${resource.size} bytes)`);
}
//#endregion
export { resourceWriteScript as default };
