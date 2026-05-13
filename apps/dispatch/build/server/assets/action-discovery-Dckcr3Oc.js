import { r as __exportAll } from "./chunk-D3zDcpJC.js";
import path from "node:path";
import { AsyncLocalStorage } from "node:async_hooks";
import { fileURLToPath } from "node:url";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/cli-capture.js
/**
* Capture stdout/stderr/console output from CLI-style action handlers
* without globally swapping `console.log` / `process.stdout.write` /
* `process.exit` per-call.
*
* The previous pattern (save → swap → restore in finally) corrupts the
* globals when two CLI tool calls run concurrently — request B saves the
* already-swapped function, then both finally-blocks restore in interleaved
* order, leaving an arbitrary capture function permanently installed and
* silently swallowing all subsequent server logs.
*
* This module installs the global interceptors ONCE at module load. Each
* call dispatches to either the captured logs (when an AsyncLocalStorage
* store is active) or the original implementation. The wrappers are
* idempotent and safe under any number of concurrent runs.
*/
var captureStore = new AsyncLocalStorage();
/** Sentinel thrown when an action calls `process.exit(...)`. */
var ExitIntercepted = class extends Error {
	code;
	constructor(code) {
		super(`process.exit(${code})`);
		this.code = code;
	}
};
var installed = false;
function installInterceptorsOnce() {
	if (installed) return;
	installed = true;
	const origLog = console.log.bind(console);
	const origError = console.error.bind(console);
	const origStdoutWrite = process.stdout.write.bind(process.stdout);
	const origExit = process.exit.bind(process);
	console.log = (...args) => {
		const store = captureStore.getStore();
		if (store) {
			store.logs.push(args.map((a) => String(a)).join(" "));
			return;
		}
		origLog(...args);
	};
	console.error = (...args) => {
		const store = captureStore.getStore();
		if (store) {
			store.logs.push(args.map((a) => String(a)).join(" "));
			return;
		}
		origError(...args);
	};
	process.stdout.write = ((chunk, ...rest) => {
		const store = captureStore.getStore();
		if (store) {
			if (typeof chunk === "string") store.logs.push(chunk);
			else if (chunk && typeof chunk.toString === "function") store.logs.push(chunk.toString());
			const cb = rest.find((r) => typeof r === "function");
			if (cb) cb(null);
			return true;
		}
		return origStdoutWrite(chunk, ...rest);
	});
	process.exit = ((code) => {
		if (captureStore.getStore()) throw new ExitIntercepted(code ?? 0);
		return origExit(code);
	});
}
/**
* Run `fn` with a fresh capture buffer. All console.log / console.error /
* process.stdout.write calls inside `fn` (including async descendants)
* append to the buffer instead of going to the server's stdout/stderr.
* Returns the joined logs (or `"(no output)"` if nothing was captured).
*
* `process.exit(code)` inside `fn` throws `ExitIntercepted` internally; it
* is caught here so the captured output (including any final logs the
* action wrote before exiting) is preserved.
*/
async function captureCliOutput(fn, options = {}) {
	installInterceptorsOnce();
	const store = { logs: [] };
	const swallowErrors = options.swallowErrors !== false;
	try {
		await captureStore.run(store, fn);
	} catch (err) {
		if (err instanceof ExitIntercepted) {} else if (swallowErrors) {
			const msg = err?.message ?? String(err);
			store.logs.push(`Error: ${msg}`);
		} else throw err;
	}
	return store.logs.join("\n") || "(no output)";
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/action-discovery.js
var action_discovery_exports = /* @__PURE__ */ __exportAll({
	autoDiscoverActions: () => autoDiscoverActions,
	loadActionsFromStaticRegistry: () => loadActionsFromStaticRegistry,
	mergeCoreSharingActions: () => mergeCoreSharingActions
});
var _fs;
async function getFs() {
	if (!_fs) _fs = await import("node:fs");
	return _fs;
}
/** Files to skip during auto-discovery (no extension). */
var SKIP_FILES = new Set([
	"helpers",
	"run",
	"db-connect",
	"db-status",
	"registry"
]);
/**
* Global registry of actions contributed by published packages
* (e.g. `@agent-native/dispatch`). Populated by `registerPackageActions()`
* which the package calls from import side effects, then merged into
* `autoDiscoverActions` after the template's local `actions/` directory.
*
* Ordering: template `actions/` files always win on name collision so
* consumers can override a packaged action by dropping a same-named file
* in their own `actions/` dir.
*/
var packageActionRegistry = {};
/** Internal — used by `autoDiscoverActions`. Returns a shallow copy. */
function getPackageActions() {
	return { ...packageActionRegistry };
}
/**
* Split a string into shell-like tokens, handling double and single quotes.
* `--title "My Page" --content ""` → `["--title", "My Page", "--content", ""]`
*/
function splitShellArgs(input) {
	const tokens = [];
	let current = "";
	let inDouble = false;
	let inSingle = false;
	let wasQuoted = false;
	for (let i = 0; i < input.length; i++) {
		const ch = input[i];
		if (ch === "\"" && !inSingle) {
			inDouble = !inDouble;
			wasQuoted = true;
			continue;
		}
		if (ch === "'" && !inDouble) {
			inSingle = !inSingle;
			wasQuoted = true;
			continue;
		}
		if ((ch === " " || ch === "	") && !inDouble && !inSingle) {
			if (current.length > 0 || wasQuoted) tokens.push(current);
			current = "";
			wasQuoted = false;
			continue;
		}
		current += ch;
	}
	if (current.length > 0 || wasQuoted) tokens.push(current);
	return tokens;
}
/**
* Wrap a CLI-style action (that writes to console.log) as an ActionEntry
* by capturing stdout/stderr and intercepting process.exit. Uses the
* shared AsyncLocalStorage-backed capture so concurrent invocations do
* not corrupt the global `console.log` / `process.stdout.write` /
* `process.exit` pointers (see `cli-capture.ts`).
*/
function wrapDefaultExport(name, defaultFn) {
	return {
		tool: {
			description: `Run the "${name}" action. Pass arguments as key-value pairs.`,
			parameters: {
				type: "object",
				properties: { args: {
					type: "string",
					description: "Space-separated CLI arguments (e.g. '--id abc --title Hello')"
				} }
			}
		},
		run: async (args) => {
			const cliArgs = [];
			if (args.args && Object.keys(args).length === 1) cliArgs.push(...splitShellArgs(args.args));
			else for (const [k, v] of Object.entries(args)) cliArgs.push(`--${k}`, v);
			return captureCliOutput(() => defaultFn(cliArgs));
		}
	};
}
function preserveActionFlags(entry) {
	const out = {};
	if (typeof entry.readOnly === "boolean") out.readOnly = entry.readOnly;
	if (typeof entry.parallelSafe === "boolean") out.parallelSafe = entry.parallelSafe;
	if (typeof entry.toolCallable === "boolean") out.toolCallable = entry.toolCallable;
	return out;
}
/**
* Resolve the actions directory from the caller's context.
*
* @param from - Either an `import.meta.url` (file:// URL from a plugin file),
*   an absolute directory path, or "auto" to use `process.cwd() + "/actions"`.
*   When an import.meta.url is provided, the actions directory is resolved as
*   `../../actions/` relative to the caller (typically `server/plugins/agent-chat.ts`).
*   If the resolved directory doesn't exist, falls back to `../../scripts/` for
*   backwards compatibility, then to `process.cwd() + "/actions"`.
*/
async function resolveActionsDir(from) {
	const fs = await getFs();
	const exists = (p) => {
		try {
			return fs.existsSync(p);
		} catch {
			return false;
		}
	};
	if (!from) {
		const cwdActions = path.join(process.cwd(), "actions");
		if (exists(cwdActions)) return cwdActions;
		return path.join(process.cwd(), "scripts");
	}
	if (from.startsWith("file://") || from.startsWith("file:///")) {
		const callerPath = fileURLToPath(from);
		const callerDir = path.dirname(callerPath);
		const actionsResolved = path.resolve(callerDir, "../../actions");
		if (exists(actionsResolved)) return actionsResolved;
		const scriptsResolved = path.resolve(callerDir, "../../scripts");
		if (exists(scriptsResolved)) return scriptsResolved;
		const cwdActions = path.join(process.cwd(), "actions");
		if (exists(cwdActions)) return cwdActions;
		return path.join(process.cwd(), "scripts");
	}
	if (from === "auto") {
		const cwdActions = path.join(process.cwd(), "actions");
		if (exists(cwdActions)) return cwdActions;
		return path.join(process.cwd(), "scripts");
	}
	return path.resolve(from);
}
/**
* Load actions from a single directory into the given registry. Shared by
* both the template-actions discovery path and the workspace-core actions
* layer. When `skipExisting` is true, an entry with the same name that's
* already in the registry is left untouched (template-wins on collision).
*/
async function loadActionsIntoRegistry(actionsDir, registry, skipExisting) {
	let files;
	try {
		const fs = await getFs();
		if (!fs.existsSync(actionsDir)) return;
		files = fs.readdirSync(actionsDir);
	} catch {
		return;
	}
	const actionFiles = files.filter((f) => {
		if (!f.endsWith(".ts") && !f.endsWith(".js")) return false;
		const name = f.replace(/\.(ts|js)$/, "");
		if (name.startsWith("_")) return false;
		if (SKIP_FILES.has(name)) return false;
		return true;
	});
	for (const file of actionFiles) {
		const name = file.replace(/\.(ts|js)$/, "");
		if (skipExisting && registry[name]) continue;
		const filePath = path.join(actionsDir, file);
		try {
			const mod = await import(
				/* @vite-ignore */
				filePath
);
			if (mod.tool && typeof mod.run === "function") registry[name] = {
				tool: mod.tool,
				run: mod.run,
				...mod.http !== void 0 ? { http: mod.http } : {},
				...preserveActionFlags(mod)
			};
			else if (mod.default && typeof mod.default === "object" && mod.default.tool && typeof mod.default.run === "function") registry[name] = {
				tool: mod.default.tool,
				run: mod.default.run,
				...mod.default.http !== void 0 ? { http: mod.default.http } : {},
				...preserveActionFlags(mod.default)
			};
			else if (typeof mod.default === "function") registry[name] = wrapDefaultExport(name, mod.default);
		} catch {}
	}
}
/**
* Normalize a pre-bundled static action registry (name → raw module) into
* the `Record<string, ActionEntry>` shape the agent-chat plugin expects.
*
* Used by `autoDiscoverActions` when `.generated/actions-registry.ts` is
* present so that Nitro-bundled serverless functions (Netlify, Vercel,
* AWS-Lambda) can serve `/_agent-native/actions/*` routes without relying
* on a filesystem scan that doesn't work in bundled output.
*/
function loadActionsFromStaticRegistry(modules) {
	const registry = {};
	for (const [name, raw] of Object.entries(modules)) {
		const mod = raw;
		if (!mod) continue;
		if (mod.tool && typeof mod.run === "function") {
			registry[name] = {
				tool: mod.tool,
				run: mod.run,
				...mod.http !== void 0 ? { http: mod.http } : {},
				...preserveActionFlags(mod)
			};
			continue;
		}
		const def = mod.default;
		if (def && typeof def === "object" && def.tool && typeof def.run === "function") {
			registry[name] = {
				tool: def.tool,
				run: def.run,
				...def.http !== void 0 ? { http: def.http } : {},
				...preserveActionFlags(def)
			};
			continue;
		}
		if (typeof def === "function") registry[name] = wrapDefaultExport(name, def);
	}
	return registry;
}
/**
* Auto-discover actions from a directory.
*
* Merges in any actions from the enterprise workspace core (if present in
* the ancestor chain). Template actions take precedence over workspace-core
* actions on name collision, so an app can override an enterprise-wide
* action by dropping a same-named file under its own `actions/`.
*
* Note: this helper uses a filesystem scan, which works in dev and in
* non-bundled Node deployments. In bundled serverless functions (Nitro's
* netlify / vercel / aws-lambda presets) the `actions/` directory is not
* on disk at runtime; templates should pass the static registry generated
* by the Vite plugin to `createAgentChatPlugin({ actions })` instead, so
* the bundler sees static imports and pulls every action into the bundle.
*
* @param from - The caller's `import.meta.url` or an absolute path to the
*   actions directory.
* @returns A record mapping action names to ActionEntry objects, suitable for
*   passing to `createAgentChatPlugin({ actions })`.
*/
async function autoDiscoverActions(from) {
	const actionsDir = await resolveActionsDir(from);
	const registry = {};
	try {
		await loadActionsIntoRegistry(actionsDir, registry, false);
	} catch (err) {
		console.warn(`[autoDiscoverActions] Could not read actions directory: ${actionsDir} — ${err?.message}`);
	}
	if (Object.keys(registry).length === 0 && from) try {
		let registryPath;
		if (from.startsWith("file://") || from.startsWith("file:///")) {
			const callerDir = path.dirname(fileURLToPath(from));
			registryPath = path.resolve(callerDir, "../../.generated/actions-registry.js");
		} else registryPath = path.resolve(from, "../.generated/actions-registry.js");
		const mod = await import(
			/* @vite-ignore */
			registryPath
);
		const staticEntries = loadActionsFromStaticRegistry(mod.default || mod);
		Object.assign(registry, staticEntries);
		if (Object.keys(staticEntries).length > 0) console.log(`[autoDiscoverActions] Filesystem scan found 0 actions — loaded ${Object.keys(staticEntries).length} from .generated/actions-registry.ts instead. Consider switching to loadActionsFromStaticRegistry(actionsRegistry) for production reliability.`);
	} catch {}
	if (Object.keys(registry).length === 0) console.warn("[autoDiscoverActions] WARNING: No template actions found! The agent will have no template-specific tools. If in production, switch from autoDiscoverActions to loadActionsFromStaticRegistry. See: https://docs.agent-native.com/actions#static-registry");
	for (const [name, entry] of Object.entries(getPackageActions())) {
		if (registry[name]) continue;
		registry[name] = entry;
	}
	try {
		const { getWorkspaceCoreExports } = await import("./workspace-core-AUI1Zx6N.js");
		const ws = await getWorkspaceCoreExports(process.cwd());
		if (ws && ws.actionsDir) await loadActionsIntoRegistry(ws.actionsDir, registry, true);
	} catch {}
	try {
		await mergeCoreSharingActions(registry);
	} catch {}
	return registry;
}
async function mergeCoreSharingActions(registry) {
	const entries = [
		["share-resource", () => import("./share-resource-KprQjJYa.js")],
		["unshare-resource", () => import("./unshare-resource-pkWJauq2.js")],
		["list-resource-shares", () => import("./list-resource-shares-CVlmWhFJ.js")],
		["set-resource-visibility", () => import("./set-resource-visibility-BGpAvxeZ.js")]
	];
	for (const [name, loader] of entries) {
		if (registry[name]) continue;
		try {
			const def = (await loader()).default;
			if (def && def.tool && typeof def.run === "function") registry[name] = {
				tool: def.tool,
				run: def.run,
				...def.http !== void 0 ? { http: def.http } : {},
				...def.readOnly === true ? { readOnly: true } : {},
				...def.parallelSafe === true ? { parallelSafe: true } : {}
			};
		} catch {}
	}
}
//#endregion
export { captureCliOutput as a, mergeCoreSharingActions as i, autoDiscoverActions as n, loadActionsFromStaticRegistry as r, action_discovery_exports as t };
