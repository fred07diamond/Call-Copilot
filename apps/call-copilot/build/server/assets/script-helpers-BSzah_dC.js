import { a as appStatePut, i as appStateList, r as appStateGet } from "./store-COxLCbTD.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/application-state/script-helpers.js
/**
* Application state helpers for use in scripts and actions.
*
* The session ID determines which user's application state is read/written.
* Resolution order:
*   1. Per-request context (AsyncLocalStorage) — set by the HTTP handler
*   2. AGENT_USER_EMAIL env var — CLI scripts only
*
* The per-request context is critical in multi-user deployments: the env var
* is process-global and gets overwritten by concurrent requests, so it cannot
* reliably identify the caller. Only CLI scripts (single-user, no HTTP
* context) should fall through to the env var.
*/
/**
* Resolve session ID for the current caller.
*
* In an HTTP/action context, uses the per-request user email from
* AsyncLocalStorage so concurrent users don't collide. In a CLI context
* (no request), falls back to AGENT_USER_EMAIL. Throws when neither is
* present — application state must be scoped to a real identity.
*/
async function resolveSessionId() {
	try {
		const { getRequestUserEmail } = await import("./request-context-BQ-cTIMw.js").then((n) => n.c);
		const ctxEmail = getRequestUserEmail();
		if (ctxEmail) return ctxEmail;
	} catch {}
	const email = process.env.AGENT_USER_EMAIL;
	if (email) return email;
	throw new Error("Application state access requires an authenticated request context or AGENT_USER_EMAIL env var");
}
async function readAppState(key) {
	return appStateGet(await resolveSessionId(), key);
}
async function writeAppState(key, value) {
	return appStatePut(await resolveSessionId(), key, value, { requestSource: "agent" });
}
async function listAppState(prefix) {
	return appStateList(await resolveSessionId(), prefix);
}
//#endregion
export { readAppState as n, writeAppState as r, listAppState as t };
