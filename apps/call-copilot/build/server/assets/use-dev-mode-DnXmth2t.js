import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { o as require_react, t as agentNativePath } from "./api-path-duCTki3J.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/client/use-dev-mode.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
var cached = null;
var fetchPromise = null;
var listeners = /* @__PURE__ */ new Set();
function notifyListeners(state) {
	cached = state;
	listeners.forEach((fn) => fn(state));
}
function isLocalhostHostname() {
	if (typeof window === "undefined") return false;
	const h = window.location.hostname;
	return h === "localhost" || h === "127.0.0.1" || h === "::1";
}
function fetchDevMode(apiBase) {
	if (!fetchPromise) fetchPromise = fetch(`${apiBase}/mode`).then((res) => {
		if (!res.ok) throw new Error(`${res.status}`);
		return res.json();
	}).then((data) => {
		cached = data;
		return cached;
	}).catch(() => {
		cached = isLocalhostHostname() ? {
			devMode: true,
			canToggle: true
		} : {
			devMode: false,
			canToggle: false
		};
		fetchPromise = null;
		return cached;
	});
	return fetchPromise;
}
/**
* Returns whether the app is running in dev mode and whether mode can be toggled.
* Fetches /_agent-native/agent-chat/mode on first call, then stays in sync via setDevMode.
*/
function useDevMode(apiBase = agentNativePath("/_agent-native/agent-chat")) {
	const [state, setState] = (0, import_react.useState)(cached ?? {
		devMode: false,
		canToggle: false
	});
	const [isLoading, setIsLoading] = (0, import_react.useState)(cached === null);
	(0, import_react.useEffect)(() => {
		listeners.add(setState);
		return () => {
			listeners.delete(setState);
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (cached !== null) {
			setState(cached);
			setIsLoading(false);
			return;
		}
		fetchDevMode(apiBase).then((val) => {
			setState(val);
			setIsLoading(false);
		});
	}, [apiBase]);
	const setDevMode = (0, import_react.useCallback)(async (devMode) => {
		notifyListeners({
			devMode,
			canToggle: true
		});
		const res = await fetch(`${apiBase}/mode`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ devMode })
		});
		if (res.ok) notifyListeners(await res.json());
	}, [apiBase]);
	return {
		isDevMode: state.devMode,
		canToggle: state.canToggle,
		isLoading,
		setDevMode
	};
}
//#endregion
export { useDevMode as t };
