import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { a as require_react, t as agentNativePath } from "./api-path-Cj855NR1.js";
import { L as createReactComponent } from "./tooltip-Cpb41AAh.js";
import { i as isTrustedFrameMessage, n as getFrameOrigin, t as getCallbackOrigin } from "./frame-D-xkJ0S_.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/builder-frame.js
function normalizeOrigin(value) {
	if (typeof value !== "string" || !value.trim()) return null;
	try {
		return new URL(value).origin;
	} catch {
		return null;
	}
}
function ancestorOrigin() {
	if (typeof window === "undefined") return null;
	const first = window.location.ancestorOrigins?.[0];
	const fromAncestor = normalizeOrigin(first);
	if (fromAncestor) return fromAncestor;
	return normalizeOrigin(document.referrer);
}
function isStrictBuilderHost(origin) {
	if (!origin) return false;
	try {
		const hostname = new URL(origin).hostname.toLowerCase();
		return hostname === "builder.io" || hostname.endsWith(".builder.io") || hostname === "builder.my" || hostname.endsWith(".builder.my");
	} catch {
		return false;
	}
}
function isBuilderLikeOrigin(origin) {
	if (!origin) return false;
	if (isStrictBuilderHost(origin)) return true;
	try {
		const hostname = new URL(origin).hostname.toLowerCase();
		return hostname === "localhost" || hostname === "127.0.0.1";
	} catch {
		return false;
	}
}
function hasBuilderPreviewParams() {
	if (typeof window === "undefined") return false;
	const params = new URLSearchParams(window.location.search);
	return params.has("builder.space") || params.has("builder.preview") || params.has("builder.frameEditing") || params.has("builder.user.permissions") || params.has("builder.user.role.name") || params.has("__builder_editing__");
}
/**
* For *.builder.io / *.builder.my the parent origin alone is sufficient — those
* are Builder-owned hosts and any iframe they load is by definition a Builder
* editor session. For localhost we still require the legacy `?builder.*` query
* params, because "parent is localhost" can mean anything in dev. The params
* check existed historically as a belt-and-suspenders signal, but Builder's
* Interact mode tunnels straight to the iframe URL without appending them, so
* requiring them everywhere caused `isInBuilderFrame()` to return false for
* real Builder editor sessions and `HomeChatPanel` submissions silently fell
* through to `agentNative.submitChat` (which Builder ignores).
*/
function getBuilderParentOrigin() {
	const frameOrigin = getFrameOrigin();
	if (frameOrigin) {
		if (isStrictBuilderHost(frameOrigin)) return frameOrigin;
		if (isBuilderLikeOrigin(frameOrigin) && hasBuilderPreviewParams()) return frameOrigin;
	}
	const origin = ancestorOrigin();
	if (origin) {
		if (isStrictBuilderHost(origin)) return origin;
		if (isBuilderLikeOrigin(origin) && hasBuilderPreviewParams()) return origin;
	}
	return null;
}
function isInBuilderFrame() {
	if (typeof window === "undefined") return false;
	if (getBuilderParentOrigin() !== null) return true;
	return hasBuilderPreviewParams();
}
function isTrustedBuilderMessage(event) {
	if (typeof window === "undefined") return false;
	const origin = getBuilderParentOrigin();
	if (!origin) return false;
	return event.origin === origin && event.source === window.parent;
}
function sendToBuilderChat(opts) {
	if (typeof window === "undefined" || !opts.message?.trim()) return false;
	const target = window.parent !== window ? window.parent : window;
	const targetOrigin = getBuilderParentOrigin() ?? "*";
	const payload = {
		type: "builder.submitChat",
		data: {
			message: opts.message,
			context: opts.context,
			submit: opts.submit
		}
	};
	target.postMessage(payload, targetOrigin);
	try {
		console.log("BUILDER_PARENT_MESSAGE:" + JSON.stringify({
			message: payload,
			targetOrigin
		}));
	} catch {}
	return true;
}
var BUILD_APP_OR_AGENT_RE = /\b(?:build|create|make|scaffold|generate)\b[^.!?\n]*?\b(?:agent[-\s]native\s+)?(?:workspace\s+)?(?:app|agent)\b/i;
/**
* Returns true if `text` looks like a "build me an app/agent" request that
* should hand off to the code-writing agent (Builder, local code agent, etc.)
* rather than be answered by the embedded app's domain agent.
*
* Conservative: requires both an imperative build verb AND an explicit
* "app" / "agent" target word in the same sentence. "Build me a tool",
* "build a recurring job", "create a destination" do not match — they
* don't end in "app"/"agent" so they stay on the local agent. "Build me
* an email app" / "create me an email agent" do match — the target
* word is "app" / "agent", not "email".
*/
function isBuildAppOrAgentRequest(text) {
	const t = (text ?? "").trim();
	if (!t) return false;
	return BUILD_APP_OR_AGENT_RE.test(t);
}
/**
* If the user typed a "build me an app/agent" prompt while running inside
* the Builder.io webview/iframe, hand the prompt up to the parent Builder
* chat via `builder.submitChat`. Returns true when delegated.
*
* Why: Builder is the code-writing agent. When a workspace app (Dispatch,
* Mail, etc.) is mounted inside Builder's webview and the user asks the
* embedded chat to "build an app", the user almost certainly means the
* already-open Builder chat session — not a separate Builder agent run
* spawned through `start-workspace-app-creation`.
*/
function tryDelegateBuildRequestToBuilder(text) {
	if (!isInBuilderFrame()) return false;
	if (!isBuildAppOrAgentRequest(text)) return false;
	return sendToBuilderChat({
		message: (text ?? "").trim(),
		submit: true
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/agent-chat.js
/**
* Agent Chat Bridge (browser)
*
* Sends structured messages to the agent chat from UI interactions.
* Messages are sent via postMessage to the parent window (or self if top-level).
* Builder frames are special: code requests go to Builder, but content prompts
* stay inside the embedded app so its own AgentSidebar can receive them.
*/
var AGENT_CHAT_MESSAGE_TYPE = "agentNative.submitChat";
/**
* Listen for chatRunning messages from the frame (postMessage)
* and re-dispatch as a CustomEvent so hooks like useAgentChatGenerating() work.
*/
if (typeof window !== "undefined") window.addEventListener("message", (event) => {
	if (!isTrustedFrameMessage(event) && !isTrustedBuilderMessage(event)) return;
	if (event.data?.type === "agentNative.chatRunning" || event.data?.type === "builder.chatRunning") window.dispatchEvent(new CustomEvent("agentNative.chatRunning", { detail: event.data.detail ?? event.data.data }));
});
/** Generate a unique tab ID */
function generateTabId() {
	return `chat-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
/**
* Send a message to the agent chat via postMessage.
*/
/**
* Send a message to the agent chat via postMessage.
* Returns the stable tabId for tracking this chat run.
*/
function sendToAgentChat(opts) {
	const tabId = opts.tabId ?? generateTabId();
	const isCodeRequest = opts.type === "code" || opts.requiresCode === true;
	if (isCodeRequest && isInBuilderFrame()) {
		sendToBuilderChat({
			message: opts.message,
			context: opts.context,
			submit: opts.submit
		});
		return tabId;
	}
	const payload = {
		type: AGENT_CHAT_MESSAGE_TYPE,
		data: {
			...opts,
			tabId
		}
	};
	const targetSelf = !isCodeRequest && isInBuilderFrame();
	const target = targetSelf ? window : window.parent !== window ? window.parent : window;
	const targetOrigin = targetSelf ? window.location.origin : getFrameOrigin() || window.location.origin;
	target.postMessage(payload, targetOrigin);
	if (opts.openSidebar !== false && !opts.background) {
		window.dispatchEvent(new CustomEvent("agent-panel:set-mode", { detail: { mode: "chat" } }));
		window.dispatchEvent(new CustomEvent("agent-panel:open"));
	}
	return tabId;
}
var IconChevronDown = createReactComponent("outline", "chevron-down", "ChevronDown", [["path", {
	"d": "M6 9l6 6l6 -6",
	"key": "svg-0"
}]]);
var IconChevronRight = createReactComponent("outline", "chevron-right", "ChevronRight", [["path", {
	"d": "M9 6l6 6l-6 6",
	"key": "svg-0"
}]]);
var IconLoader2 = createReactComponent("outline", "loader-2", "Loader2", [["path", {
	"d": "M12 3a9 9 0 1 0 9 9",
	"key": "svg-0"
}]]);
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/useBuilderStatus.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Fetches Builder connection status from /_agent-native/builder/status.
* Re-fetches on window focus to detect post-redirect state changes.
*/
function useBuilderStatus() {
	const [status, setStatus] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const fetchStatus = (0, import_react.useCallback)(async () => {
		try {
			const res = await fetch(agentNativePath("/_agent-native/builder/status"));
			if (!res.ok) {
				setStatus(null);
				return;
			}
			setStatus(await res.json());
		} catch {
			setStatus(null);
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchStatus();
		function onFocus() {
			fetchStatus();
		}
		function onVisibility() {
			if (document.visibilityState === "visible") fetchStatus();
		}
		window.addEventListener("focus", onFocus);
		document.addEventListener("visibilitychange", onVisibility);
		window.addEventListener("agent-engine:configured-changed", fetchStatus);
		return () => {
			window.removeEventListener("focus", onFocus);
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("agent-engine:configured-changed", fetchStatus);
		};
	}, [fetchStatus]);
	return {
		status,
		loading,
		refetch: fetchStatus
	};
}
var POLL_INTERVAL_MS = 2e3;
var POLL_TIMEOUT_MS = 300 * 1e3;
function notifyAgentEngineConfiguredChanged(source) {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("agent-engine:configured-changed", { detail: { source } }));
}
function useBuilderConnectFlow(opts = {}) {
	const { popupUrl, onConnected } = opts;
	const [configured, setConfigured] = (0, import_react.useState)(false);
	const [envManaged, setEnvManaged] = (0, import_react.useState)(false);
	const [builderEnabled, setBuilderEnabled] = (0, import_react.useState)(false);
	const [orgName, setOrgName] = (0, import_react.useState)(null);
	const [connecting, setConnecting] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const [hasFetchedStatus, setHasFetchedStatus] = (0, import_react.useState)(false);
	const [statusConnectUrl, setStatusConnectUrl] = (0, import_react.useState)(null);
	const statusConnectUrlAtRef = (0, import_react.useRef)(null);
	const pollRef = (0, import_react.useRef)(null);
	const mountedRef = (0, import_react.useRef)(true);
	const notifiedConnectedRef = (0, import_react.useRef)(false);
	const onConnectedRef = (0, import_react.useRef)(onConnected);
	onConnectedRef.current = onConnected;
	const stopPoll = (0, import_react.useCallback)(() => {
		if (pollRef.current) {
			clearInterval(pollRef.current);
			pollRef.current = null;
		}
	}, []);
	const fetchStatus = (0, import_react.useCallback)(async () => {
		const origin = getCallbackOrigin() || window.location.origin;
		try {
			const r = await fetch(new URL(agentNativePath("/_agent-native/builder/status"), origin).href);
			if (!r.ok) return null;
			return await r.json();
		} catch {
			return null;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		let cancelled = false;
		const refresh = async () => {
			const s = await fetchStatus();
			if (cancelled || !mountedRef.current) return;
			setHasFetchedStatus(true);
			if (!s) return;
			setConfigured(!!s.configured);
			setEnvManaged(!!s.envManaged);
			setBuilderEnabled(!!s.builderEnabled);
			setStatusConnectUrl(s.connectUrl ?? null);
			statusConnectUrlAtRef.current = s.connectUrl ? Date.now() : null;
			const org = s.orgName ?? null;
			setOrgName(org);
			if (s.configured && !notifiedConnectedRef.current) {
				notifiedConnectedRef.current = true;
				notifyAgentEngineConfiguredChanged("builder-status");
				try {
					await onConnectedRef.current?.({ orgName: org });
				} catch {}
			} else if (!s.configured) notifiedConnectedRef.current = false;
		};
		refresh();
		const onVisible = () => {
			if (document.visibilityState === "visible") refresh();
		};
		window.addEventListener("focus", refresh);
		document.addEventListener("visibilitychange", onVisible);
		window.addEventListener("agent-engine:configured-changed", refresh);
		return () => {
			cancelled = true;
			mountedRef.current = false;
			window.removeEventListener("focus", refresh);
			document.removeEventListener("visibilitychange", onVisible);
			window.removeEventListener("agent-engine:configured-changed", refresh);
			stopPoll();
		};
	}, [fetchStatus, stopPoll]);
	const start = (0, import_react.useCallback)(() => {
		stopPoll();
		setConnecting(true);
		setError(null);
		const origin = getCallbackOrigin() || window.location.origin;
		const STATUS_CONNECT_URL_TTL_MS = 540 * 1e3;
		const cachedAt = statusConnectUrlAtRef.current;
		const url = (typeof cachedAt === "number" && Date.now() - cachedAt < STATUS_CONNECT_URL_TTL_MS ? statusConnectUrl : null) ?? popupUrl ?? new URL(agentNativePath("/_agent-native/builder/connect"), origin).href;
		try {
			if (!window.open(url, "_blank", "noopener,noreferrer")) {
				if (/AgentNativeDesktop/i.test(navigator.userAgent || "")) {
					window.location.href = url;
					return;
				}
				setError("Popup blocked. Allow popups, then click Connect Builder again.");
			}
		} catch {
			setError("Couldn't open Builder. Allow popups and try again.");
		}
		const started = Date.now();
		pollRef.current = setInterval(async () => {
			const s = await fetchStatus();
			if (!mountedRef.current) {
				stopPoll();
				return;
			}
			if (s?.configured) {
				stopPoll();
				setConfigured(true);
				setEnvManaged(!!s.envManaged);
				setBuilderEnabled(!!s.builderEnabled);
				setStatusConnectUrl(s.connectUrl ?? null);
				statusConnectUrlAtRef.current = s.connectUrl ? Date.now() : null;
				const org = s.orgName ?? null;
				setOrgName(org);
				setConnecting(false);
				notifiedConnectedRef.current = true;
				notifyAgentEngineConfiguredChanged("builder-connect");
				try {
					await onConnectedRef.current?.({ orgName: org });
				} catch {}
			} else if (s?.connectError?.message) {
				stopPoll();
				setConnecting(false);
				setError(`Couldn't save Builder credentials: ${s.connectError.message}. Try again or contact support.`);
			} else if (Date.now() - started > POLL_TIMEOUT_MS) {
				stopPoll();
				setConnecting(false);
				setError("Didn't hear back from Builder in 5 minutes. Allow popups and try again.");
			}
		}, POLL_INTERVAL_MS);
	}, [
		fetchStatus,
		popupUrl,
		statusConnectUrl,
		stopPoll
	]);
	(0, import_react.useEffect)(() => {
		let channel = null;
		const handleError = (message) => {
			stopPoll();
			setConnecting(false);
			setError(`Couldn't save Builder credentials: ${message}.`);
		};
		try {
			channel = new BroadcastChannel(`builder-connect:${window.location.host}`);
			channel.onmessage = (e) => {
				const data = e.data;
				if (data?.type !== "builder-connect-error") return;
				if (typeof data.message !== "string" || !data.message) return;
				handleError(data.message);
			};
		} catch {}
		const handler = (e) => {
			if (e.origin !== window.location.origin) return;
			const data = e.data;
			if (data?.type !== "builder-connect-error") return;
			if (typeof data.message !== "string" || !data.message) return;
			handleError(data.message);
		};
		window.addEventListener("message", handler);
		return () => {
			channel?.close();
			window.removeEventListener("message", handler);
		};
	}, [stopPoll]);
	return {
		configured,
		envManaged,
		builderEnabled,
		orgName,
		connecting,
		error,
		hasFetchedStatus,
		start
	};
}
//#endregion
export { IconChevronDown as a, isInBuilderFrame as c, IconChevronRight as i, tryDelegateBuildRequestToBuilder as l, useBuilderStatus as n, generateTabId as o, IconLoader2 as r, sendToAgentChat as s, useBuilderConnectFlow as t };
