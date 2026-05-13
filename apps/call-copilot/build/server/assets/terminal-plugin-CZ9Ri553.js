import { r as __exportAll } from "./chunk-D3zDcpJC.js";
import { i as defineEventHandler } from "./node-DxyfkX8_.js";
import { a as markDefaultPluginProvided, i as getH3App } from "./framework-request-handler-DiyxDN2M.js";
import { createRequire } from "node:module";
import * as fs$1 from "node:fs";
import * as path from "node:path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/shared/runtime.js
/**
* Runtime detection utilities.
*
* Detect whether the code is running in Node.js, Cloudflare Workers,
* Deno, or another edge runtime. Used to gracefully skip Node-only
* features (filesystem, PTY, file watching) on edge runtimes.
*/
/** True when running in a full Node.js environment (not CF Workers, not Deno). */
function isNodeRuntime() {
	return typeof process !== "undefined" && typeof process.versions?.node === "string" && !("__cf_env" in globalThis) && !("Deno" in globalThis);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/terminal/terminal-plugin.js
/**
* Nitro Plugin — Agent Terminal
*
* Starts a PTY WebSocket server alongside the app so the <AgentTerminal />
* component can connect to a real CLI. Mounts a discovery endpoint at
* /_agent-native/agent-terminal-info for the client component.
*
* Skips activation when running inside a frame (FRAME_PORT is set).
*/
var terminal_plugin_exports = /* @__PURE__ */ __exportAll({
	createTerminalPlugin: () => createTerminalPlugin,
	defaultTerminalPlugin: () => defaultTerminalPlugin
});
(function fixSpawnHelperPermissions() {
	if (!isNodeRuntime()) return;
	try {
		const ptyPkg = createRequire(import.meta.url).resolve("node-pty/package.json");
		const ptyDir = path.dirname(ptyPkg);
		const helper = path.join(ptyDir, "prebuilds", `${process.platform}-${process.arch}`, "spawn-helper");
		if (fs$1.existsSync(helper)) {
			if (!(fs$1.statSync(helper).mode & 64)) {
				fs$1.chmodSync(helper, 493);
				console.log(`[terminal] Fixed non-executable node-pty spawn-helper at ${helper}`);
			}
		}
	} catch (err) {
		const code = err?.code;
		if (code === "MODULE_NOT_FOUND" || code === "ERR_MODULE_NOT_FOUND") return;
		console.warn("[terminal] Could not verify node-pty spawn-helper permissions:", err.message);
	}
})();
var _ptyMissingLogged = false;
var _disabledLogged = false;
var _frameDetectedLogged = false;
function createTerminalPlugin(options = {}) {
	return async (nitroApp) => {
		markDefaultPluginProvided(nitroApp, "terminal");
		if (!isNodeRuntime()) return;
		getH3App(nitroApp).use("/_agent-native/available-clis", defineEventHandler(async () => {
			try {
				const { CLI_REGISTRY, commandExists } = await import("./cli-registry-DvafFycT.js");
				const results = [];
				for (const [cmd, entry] of Object.entries(CLI_REGISTRY)) results.push({
					command: cmd,
					label: entry.label,
					available: await commandExists(cmd)
				});
				return results;
			} catch {
				return [];
			}
		}));
		if (process.env.FRAME_PORT) {
			if (!_frameDetectedLogged) {
				console.log("[terminal] Frame detected, skipping embedded terminal");
				_frameDetectedLogged = true;
			}
			return;
		}
		const isProd = process.env.NODE_ENV === "production";
		if (!(options.enabledInProduction ?? (process.env.AGENT_TERMINAL_ENABLED === "true" || !isProd))) {
			if (!_disabledLogged) {
				console.log("[terminal] Disabled in production (set AGENT_TERMINAL_ENABLED=true to enable)");
				_disabledLogged = true;
			}
			getH3App(nitroApp).use("/_agent-native/agent-terminal-info", defineEventHandler(() => ({ available: false })));
			return;
		}
		if (isProd && !options.authCheck) {
			console.error("[terminal] FATAL: authCheck is required when enabling the terminal in production. Pass an authCheck function to createTerminalPlugin().");
			getH3App(nitroApp).use("/_agent-native/agent-terminal-info", defineEventHandler(() => ({
				available: false,
				error: "Terminal requires authCheck in production"
			})));
			return;
		}
		if (process.env.__AGENT_TERMINAL_RUNNING === "true") {
			const existingPort = process.env.AGENT_TERMINAL_PORT;
			console.log(`[terminal] PTY server already running on port ${existingPort}, skipping`);
			getH3App(nitroApp).use("/_agent-native/agent-terminal-info", defineEventHandler(() => ({
				available: true,
				wsPort: existingPort ? parseInt(existingPort, 10) : 0,
				command: options.command || process.env.AGENT_CLI_COMMAND || "builder"
			})));
			return;
		}
		const command = options.command || process.env.AGENT_CLI_COMMAND || "builder";
		const port = options.port ?? (process.env.AGENT_TERMINAL_PORT ? parseInt(process.env.AGENT_TERMINAL_PORT, 10) : 0);
		process.env.__AGENT_TERMINAL_RUNNING = "true";
		try {
			const { createPtyWebSocketServer } = await import("./pty-server-CtHYNCUr.js");
			const result = await createPtyWebSocketServer({
				appDir: process.cwd(),
				command,
				port,
				authCheck: isProd ? options.authCheck : void 0,
				logPrefix: "[terminal]"
			});
			process.env.AGENT_TERMINAL_PORT = String(result.port);
			getH3App(nitroApp).use("/_agent-native/agent-terminal-info", defineEventHandler(() => ({
				available: true,
				wsPort: result.port,
				command
			})));
			const cleanup = () => result.close();
			process.once("SIGTERM", cleanup);
			process.once("SIGINT", cleanup);
			process.once("exit", cleanup);
			if (process.env.DEBUG) console.log(`[terminal] Agent terminal ready (command: ${command}, port: ${result.port})`);
		} catch (err) {
			delete process.env.__AGENT_TERMINAL_RUNNING;
			const code = err?.code;
			const missingPty = code === "ERR_MODULE_NOT_FOUND" || code === "MODULE_NOT_FOUND";
			if (missingPty) {
				if (!_ptyMissingLogged && (process.env.DEBUG || process.env.AGENT_TERMINAL_DEBUG === "1")) {
					console.log("[terminal] node-pty not installed — embedded terminal disabled. Install with `pnpm add node-pty` to enable.");
					_ptyMissingLogged = true;
				}
			} else {
				console.error("[terminal] Failed to start PTY server:", err);
				console.error("[terminal] If node-pty is installed but PTY fails to spawn, try `pnpm rebuild node-pty` (common after switching Node versions via fnm/nvm).");
			}
			getH3App(nitroApp).use("/_agent-native/agent-terminal-info", defineEventHandler(() => ({
				available: false,
				error: missingPty ? "node-pty not installed" : "PTY server failed"
			})));
		}
	};
}
/** Pre-configured terminal plugin with defaults */
var defaultTerminalPlugin = createTerminalPlugin();
//#endregion
export { defaultTerminalPlugin as n, terminal_plugin_exports as r, createTerminalPlugin as t };
