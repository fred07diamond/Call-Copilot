import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { a as require_jsx_runtime, o as require_react, t as agentNativePath } from "./api-path-duCTki3J.js";
import { i as isTrustedFrameMessage, n as getFrameOrigin } from "./frame-D7E2fR2G.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/client/terminal/AgentTerminal.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var cssInjected = false;
function injectXtermCss() {
	if (cssInjected || typeof document === "undefined") return;
	cssInjected = true;
	const style = document.createElement("style");
	style.textContent = `
    .xterm { position: relative; user-select: none; }
    .xterm.focus, .xterm:focus { outline: none; }
    .xterm .xterm-helpers { position: absolute; top: 0; z-index: 5; }
    .xterm .xterm-helper-textarea {
      padding: 0; border: 0; margin: 0;
      position: absolute; opacity: 0; left: -9999em; top: 0;
      width: 0; height: 0; z-index: -5;
      white-space: nowrap; overflow: hidden; resize: none;
    }
    .xterm .composition-view { display: none; position: absolute; white-space: nowrap; z-index: 1; }
    .xterm .composition-view.active { display: block; }
    .xterm .xterm-viewport {
      background-color: #000; overflow-y: scroll;
      cursor: default; position: absolute; right: 0; left: 0; top: 0; bottom: 0;
    }
    .xterm .xterm-screen { position: relative; }
    .xterm .xterm-screen canvas { position: absolute; left: 0; top: 0; }
    .xterm .xterm-scroll-area { visibility: hidden; }
    .xterm-char-measure-element {
      display: inline-block; visibility: hidden; position: absolute; top: 0; left: -9999em;
      line-height: normal;
    }
    .xterm.enable-mouse-events { cursor: default; }
    .xterm.xterm-cursor-pointer, .xterm .xterm-cursor-pointer { cursor: pointer; }
    .xterm.column-select.focus { cursor: crosshair; }
    .xterm .xterm-accessibility:not(.debug),
    .xterm .xterm-message { position: absolute; left: 0; top: 0; bottom: 0; right: 0; z-index: 10; color: transparent; pointer-events: none; }
    .xterm .xterm-accessibility-tree:not(.debug) *::selection { color: transparent; }
    .xterm .xterm-accessibility-tree { user-select: text; white-space: pre; }
    .xterm .live-region { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
    .xterm .xterm-dim { opacity: 0.5; }
    .xterm .xterm-underline-1 { text-decoration: underline; }
    .xterm .xterm-underline-2 { text-decoration: double underline; }
    .xterm .xterm-underline-3 { text-decoration: wavy underline; }
    .xterm .xterm-underline-4 { text-decoration: dotted underline; }
    .xterm .xterm-underline-5 { text-decoration: dashed underline; }
    .xterm .xterm-overline { text-decoration: overline; }
    .xterm .xterm-strikethrough { text-decoration: line-through; }
    .xterm .xterm-screen .xterm-decoration-container .xterm-decoration { z-index: 6; position: absolute; }
    .xterm .xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer { z-index: 7; }
    .xterm .xterm-decoration-overview-ruler { z-index: 8; position: absolute; top: 0; right: 0; pointer-events: none; }
    .xterm .xterm-decoration-top { z-index: 2; position: relative; }
  `;
	document.head.appendChild(style);
}
var DEFAULT_THEME = {
	background: "#111",
	foreground: "#e0e0e0",
	cursor: "#58a6ff",
	selectionBackground: "#264f78",
	black: "#484f58",
	red: "#ff7b72",
	green: "#3fb950",
	yellow: "#d29922",
	blue: "#58a6ff",
	magenta: "#bc8cff",
	cyan: "#39d353",
	white: "#b1bac4"
};
function formatWebSocketHostname(hostname) {
	return hostname.includes(":") && !hostname.startsWith("[") ? `[${hostname}]` : hostname;
}
function AgentTerminal({ command, flags, wsUrl: wsUrlProp, hideInFrame = true, theme, fontSize = 12, className, style, onConnectionChange, onAgentRunningChange }) {
	const termRef = (0, import_react.useRef)(null);
	const [connected, setConnected] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [inFrame, setInFrame] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (!hideInFrame) return;
		const check = () => {
			if (getFrameOrigin()) setInFrame(true);
		};
		check();
		const timer = setTimeout(check, 500);
		return () => clearTimeout(timer);
	}, [hideInFrame]);
	(0, import_react.useEffect)(() => {
		onConnectionChange?.(connected);
	}, [connected, onConnectionChange]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (hideInFrame && inFrame) return;
		const container = termRef.current;
		if (!container) return;
		let disposed = false;
		let ws = null;
		let cleanupMessageHandler = null;
		async function init() {
			const [{ Terminal }, { FitAddon }, { WebLinksAddon }] = await Promise.all([
				import("./xterm-BDUfxQ4K.js"),
				import("./addon-fit-Bto6OMzO.js"),
				import("./addon-web-links-Bd4udEIk.js")
			]);
			if (disposed || !container) return;
			injectXtermCss();
			const term = new Terminal({
				cursorBlink: true,
				fontSize,
				fontFamily: "'SF Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace",
				theme: {
					...DEFAULT_THEME,
					...theme
				}
			});
			const fitAddon = new FitAddon();
			const webLinksAddon = new WebLinksAddon((_event, uri) => {
				window.open(uri, "_blank", "noopener");
			});
			term.loadAddon(fitAddon);
			term.loadAddon(webLinksAddon);
			term.open(container);
			let fitPending = false;
			function fitAndResize() {
				if (fitPending) return;
				fitPending = true;
				requestAnimationFrame(() => {
					fitPending = false;
					if (disposed || !container.isConnected || container.clientWidth <= 0 || container.clientHeight <= 0) return;
					try {
						fitAddon.fit();
						sendResize();
					} catch {}
				});
			}
			fitAndResize();
			const initialFitTimers = [setTimeout(fitAndResize, 50), setTimeout(fitAndResize, 250)];
			const handleVisibilityOrFocus = () => fitAndResize();
			window.addEventListener("focus", handleVisibilityOrFocus);
			document.addEventListener("visibilitychange", handleVisibilityOrFocus);
			const resizeObserver = new ResizeObserver(() => {
				fitAndResize();
			});
			resizeObserver.observe(container);
			let terminalDisposed = false;
			function disposeTerminal() {
				if (terminalDisposed) return;
				terminalDisposed = true;
				initialFitTimers.forEach(clearTimeout);
				window.removeEventListener("focus", handleVisibilityOrFocus);
				document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
				resizeObserver.disconnect();
				term.dispose();
			}
			let wsUrl = wsUrlProp;
			let resolvedCommand = command;
			if (!wsUrl) try {
				const info = await (await fetch(agentNativePath("/_agent-native/agent-terminal-info"))).json();
				if (!info.available) {
					setError(info.error || "Agent terminal not available");
					disposeTerminal();
					return;
				}
				wsUrl = `${location.protocol === "https:" ? "wss:" : "ws:"}//${formatWebSocketHostname(location.hostname)}:${info.wsPort}/ws`;
				if (!resolvedCommand && info.command) resolvedCommand = info.command;
			} catch (err) {
				setError("Failed to discover terminal server");
				disposeTerminal();
				return;
			}
			const qs = new URLSearchParams();
			if (resolvedCommand) qs.set("command", resolvedCommand);
			if (flags) qs.set("flags", flags);
			const qsStr = qs.toString();
			const fullWsUrl = qsStr ? `${wsUrl}?${qsStr}` : wsUrl;
			term.write(`\x1b[2m[terminal] Starting ${resolvedCommand || "CLI"}...\x1b[0m\r\n`);
			let agentRunning = false;
			let idleTimer = null;
			let connectionId = 0;
			function sendResize() {
				if (ws && ws.readyState === WebSocket.OPEN && term) ws.send(JSON.stringify({
					type: "resize",
					cols: term.cols,
					rows: term.rows
				}));
			}
			function notifyAgentRunning(running) {
				onAgentRunningChange?.(running);
				window.dispatchEvent(new CustomEvent("agentNative.chatRunning", { detail: { isRunning: running } }));
			}
			function connect(url) {
				const thisId = ++connectionId;
				if (ws) {
					ws.close();
					ws = null;
				}
				const socket = new WebSocket(url);
				socket.binaryType = "arraybuffer";
				ws = socket;
				socket.onopen = () => {
					setConnected(true);
					setError(null);
					socket.send(JSON.stringify({
						type: "resize",
						cols: term.cols,
						rows: term.rows
					}));
				};
				socket.onmessage = (event) => {
					const data = event.data instanceof ArrayBuffer ? new TextDecoder().decode(event.data) : event.data;
					try {
						const msg = JSON.parse(data);
						if (msg.type === "setup-status") {
							if (msg.status === "not-found" || msg.status === "failed") {
								setError(msg.message);
								connectionId++;
							}
							return;
						}
					} catch {}
					setError(null);
					term.write(data);
					if (data.includes("❯") || data.includes("\x1B[?25h")) {
						if (idleTimer) clearTimeout(idleTimer);
						idleTimer = setTimeout(() => {
							if (agentRunning) {
								agentRunning = false;
								notifyAgentRunning(false);
							}
						}, 600);
					} else if (agentRunning) {
						if (idleTimer) clearTimeout(idleTimer);
					}
				};
				socket.onclose = () => {
					setConnected(false);
					if (connectionId === thisId && !disposed) {
						term.write("\r\n\x1B[31m[terminal] Connection closed. Reconnecting in 3s...\x1B[0m\r\n");
						setTimeout(() => {
							if (connectionId === thisId && !disposed) connect(url);
						}, 3e3);
					}
				};
				socket.onerror = () => socket.close();
			}
			term.onData((data) => {
				if (ws && ws.readyState === WebSocket.OPEN) ws.send(data);
			});
			const messageHandler = (event) => {
				if (!isTrustedFrameMessage(event)) return;
				if (event.data?.type === "agentNative.submitChat") {
					const message = event.data.data?.message;
					if (message && ws && ws.readyState === WebSocket.OPEN) {
						ws.send(message + "\r");
						agentRunning = true;
						notifyAgentRunning(true);
					}
				}
			};
			window.addEventListener("message", messageHandler);
			cleanupMessageHandler = () => window.removeEventListener("message", messageHandler);
			connect(fullWsUrl);
			return () => {
				disposed = true;
				connectionId++;
				if (idleTimer) clearTimeout(idleTimer);
				disposeTerminal();
				if (ws) {
					ws.close();
					ws = null;
				}
			};
		}
		let cleanup;
		init().then((fn) => {
			cleanup = fn;
		});
		return () => {
			disposed = true;
			cleanup?.();
			cleanupMessageHandler?.();
		};
	}, [
		hideInFrame,
		inFrame,
		command,
		flags,
		wsUrlProp
	]);
	if (hideInFrame && inFrame) return null;
	const terminalBackground = theme?.background ?? DEFAULT_THEME.background;
	return (0, import_jsx_runtime.jsx)("div", {
		ref: termRef,
		className,
		style: {
			width: "100%",
			height: "100%",
			padding: "4px 12px",
			position: "relative",
			...style,
			background: terminalBackground,
			backgroundColor: terminalBackground
		},
		children: error && (0, import_jsx_runtime.jsx)("div", {
			style: {
				position: "absolute",
				inset: 0,
				display: "flex",
				alignItems: "center",
				justifyContent: "center",
				backgroundColor: "#111",
				color: "#ff7b72",
				fontSize: "13px",
				fontFamily: "monospace",
				padding: "20px",
				textAlign: "center",
				zIndex: 1
			},
			children: error
		})
	});
}
//#endregion
export { AgentTerminal as t };
