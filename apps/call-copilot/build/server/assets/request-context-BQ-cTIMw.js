import { r as __exportAll } from "./chunk-D3zDcpJC.js";
import { AsyncLocalStorage } from "node:async_hooks";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/request-context.js
/**
* Per-request context using AsyncLocalStorage.
*
* Replaces the unsafe pattern of mutating `process.env.AGENT_USER_EMAIL` /
* `process.env.AGENT_ORG_ID` on every request. On Node.js (Netlify, self-hosted)
* concurrent requests would overwrite each other's env vars. AsyncLocalStorage
* gives each async call-chain its own isolated context.
*
* Supported on all deployment targets:
* - Node.js (native)
* - Cloudflare Workers (via nodejs_compat flag)
* - Deno Deploy (via node:async_hooks compat)
*
* For CLI scripts that run outside a request context, the getters fall back to
* process.env so existing `AGENT_USER_EMAIL=x pnpm action foo` invocations
* continue to work.
*/
var request_context_exports = /* @__PURE__ */ __exportAll({
	addRequestContextObserver: () => addRequestContextObserver,
	ensureRequestRunContext: () => ensureRequestRunContext,
	getIntegrationRequestContext: () => getIntegrationRequestContext,
	getRequestOrgId: () => getRequestOrgId,
	getRequestRunContext: () => getRequestRunContext,
	getRequestUserEmail: () => getRequestUserEmail,
	isIntegrationCallerRequest: () => isIntegrationCallerRequest,
	runWithRequestContext: () => runWithRequestContext
});
var GLOBAL_KEY = "__agentNativeRequestContextAls";
var OBSERVERS_KEY = "__agentNativeRequestContextObservers";
var globalRef = globalThis;
if (!globalRef[GLOBAL_KEY]) globalRef[GLOBAL_KEY] = new AsyncLocalStorage();
if (!globalRef[OBSERVERS_KEY]) globalRef[OBSERVERS_KEY] = [];
var als = globalRef[GLOBAL_KEY];
var observers = globalRef[OBSERVERS_KEY];
/**
* Register a callback fired every time `runWithRequestContext` enters a new
* scope. The hook runs INSIDE the AsyncLocalStorage scope, so observability
* helpers that read the current isolation scope (e.g. Sentry) attach to the
* right per-request context.
*
* Returned function unregisters the observer. Observers must never throw —
* any error is swallowed so a misbehaving observer can't break the request
* path.
*/
function addRequestContextObserver(observer) {
	observers.push(observer);
	return () => {
		const i = observers.indexOf(observer);
		if (i !== -1) observers.splice(i, 1);
	};
}
/**
* Run a callback within a per-request context. The context is available to all
* async operations spawned from `fn` via `getRequestUserEmail()` / `getRequestOrgId()`.
*
* Any registered `addRequestContextObserver` callbacks fire inside the new
* scope before `fn` runs, so observability code can pin user/org info onto
* isolation-scoped backends (Sentry, OpenTelemetry, etc.).
*/
function runWithRequestContext(ctx, fn) {
	return als.run(ctx, () => {
		if (observers.length > 0) for (const obs of observers) try {
			obs(ctx);
		} catch {}
		return fn();
	});
}
/**
* Get the current request's user email.
*
* - If a request context exists (HTTP/A2A path), returns its `userEmail` —
*   even when that value is `undefined`. The env fallback MUST NOT fire here:
*   a stale process-wide `AGENT_USER_EMAIL` from a CLI run or previous bug
*   would leak into an unauthenticated A2A/API call (e.g. unsigned or API-key
*   modes where `runWithRequestContext({ userEmail: undefined })` is used).
* - Only when there is NO request context (CLI scripts) do we fall back to
*   `process.env.AGENT_USER_EMAIL`.
*/
function getRequestUserEmail() {
	const store = als.getStore();
	if (store !== void 0) return store.userEmail;
	return process.env.AGENT_USER_EMAIL;
}
/**
* Get the current request's org ID.
*
* Same store-aware semantics as `getRequestUserEmail()` — env fallback is
* CLI-only, so a request that explicitly has no org doesn't inherit a stale
* `process.env.AGENT_ORG_ID` from a prior request on the same Lambda instance.
*/
function getRequestOrgId() {
	const store = als.getStore();
	if (store !== void 0) return store.orgId;
	return process.env.AGENT_ORG_ID;
}
/**
* Returns true when this request is on an integration-platform path (Slack,
* Telegram, etc.) — i.e. we're inside the integration plugin's processor
* function and the platform's deliver-by deadline plus the host's function
* timeout are the binding budget. Non-integration callers (CLI, normal
* agent chat) should treat this as `false`.
*/
function isIntegrationCallerRequest() {
	return als.getStore()?.isIntegrationCaller === true;
}
function getIntegrationRequestContext() {
	return als.getStore()?.integration;
}
/**
* Get the active request's mutable agent-run state. Returns `undefined` when
* called outside an agent run (e.g. before `prepareRun` or in a non-agent
* code path). Callers must tolerate the field absence; use the helper
* `requireRequestRunContext()` if missing context is a programming error.
*/
function getRequestRunContext() {
	const store = als.getStore();
	if (!store) return void 0;
	return store.run;
}
/**
* Ensure a `RequestRunContext` exists on the active request store and
* return it. Used by the agent-chat handler to attach run state once it
* starts processing a chat request. Returns `undefined` if there is no
* active request store (caller should not be invoking this outside ALS).
*/
function ensureRequestRunContext() {
	const store = als.getStore();
	if (!store) return void 0;
	if (!store.run) store.run = {};
	return store.run;
}
//#endregion
export { getRequestRunContext as a, request_context_exports as c, getRequestOrgId as i, runWithRequestContext as l, ensureRequestRunContext as n, getRequestUserEmail as o, getIntegrationRequestContext as r, isIntegrationCallerRequest as s, addRequestContextObserver as t };
