import { createHmac, timingSafeEqual } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/app-base-path.js
function normalizeAppBasePath(value) {
	if (!value || value === "/") return "";
	const trimmed = value.trim();
	if (!trimmed || trimmed === "/") return "";
	const normalized = trimmed.replace(/^\/+/, "").replace(/\/+$/, "");
	return normalized ? `/${normalized}` : "";
}
function getConfiguredAppBasePath() {
	return normalizeAppBasePath(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH);
}
function withConfiguredAppBasePath(baseUrl) {
	const basePath = getConfiguredAppBasePath();
	const trimmed = baseUrl.replace(/\/$/, "");
	if (!basePath) return trimmed;
	try {
		const pathname = normalizeAppBasePath(new URL(trimmed).pathname);
		if (pathname === basePath || pathname.startsWith(`${basePath}/`)) return trimmed;
	} catch {}
	if (trimmed.endsWith(basePath) || trimmed.includes(`${basePath}/`)) return trimmed;
	return `${trimmed}${basePath}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/integrations/internal-token.js
/**
* Internal HMAC tokens for the webhook → processor handoff.
*
* The webhook handler enqueues an inbound message into SQL and then dispatches
* a fresh HTTP POST to /_agent-native/integrations/process-task on the same
* deployment. That endpoint must trust the dispatcher without going through
* normal auth (no session cookie, no user). We use a short-lived HMAC token
* over `taskId:timestamp`, signed with the same A2A_SECRET that the rest of
* the framework uses for inter-app identity.
*
* The processor must reject tokens older than `MAX_AGE_MS` to limit replay,
* and the comparison is timing-safe.
*/
var MAX_AGE_MS = 300 * 1e3;
/**
* Allow tokens stamped slightly in the future (clock-skew between dispatcher
* and verifier) — but no more. Without this small tolerance the verifier
* would reject tokens issued on the very same instant due to floating-point
* timestamp drift. With Math.abs() (the previous bug) any future-stamped
* token of any age was accepted, which combined with rotation lag turned
* into a replay window.
*/
var FUTURE_SKEW_TOLERANCE_MS = 60 * 1e3;
function getSecret() {
	const secret = process.env.A2A_SECRET;
	if (!secret) throw new Error("A2A_SECRET is required for the integration webhook → processor handoff. Set A2A_SECRET as an environment variable on this deployment.");
	return secret;
}
function hmacHex(secret, payload) {
	return createHmac("sha256", secret).update(payload).digest("hex");
}
function safeEqual(a, b) {
	if (a.length !== b.length) return false;
	try {
		return timingSafeEqual(Buffer.from(a, "utf8"), Buffer.from(b, "utf8"));
	} catch {
		return false;
	}
}
/**
* Sign an internal token for a given task id. Format: `<timestamp>.<sig>`,
* where sig = HMAC_SHA256(A2A_SECRET, taskId + ":" + timestamp). Tokens are
* short-lived (5 minutes) and bound to a specific task id, so even if a
* token leaks it can only re-trigger that one task's processor.
*/
function signInternalToken(taskId) {
	const secret = getSecret();
	const ts = Date.now();
	return `${ts}.${hmacHex(secret, `${taskId}:${ts}`)}`;
}
/**
* Verify an internal token against a task id. Returns true if the token is
* authentic, unexpired, and bound to this task id.
*/
function verifyInternalToken(taskId, token) {
	if (!token) return false;
	const dot = token.indexOf(".");
	if (dot <= 0) return false;
	const tsRaw = token.slice(0, dot);
	const sig = token.slice(dot + 1);
	const ts = Number(tsRaw);
	if (!Number.isFinite(ts)) return false;
	const now = Date.now();
	if (now - ts > MAX_AGE_MS) return false;
	if (ts - now > FUTURE_SKEW_TOLERANCE_MS) return false;
	let expected;
	try {
		expected = hmacHex(getSecret(), `${taskId}:${ts}`);
	} catch {
		return false;
	}
	return safeEqual(sig, expected);
}
/**
* Pull a Bearer token from an Authorization header value.
* Returns null if the header is missing or malformed.
*/
function extractBearerToken(authHeader) {
	if (!authHeader) return null;
	const m = authHeader.match(/^Bearer\s+(.+)$/i);
	return m ? m[1].trim() : null;
}
//#endregion
export { normalizeAppBasePath as a, getConfiguredAppBasePath as i, signInternalToken as n, withConfiguredAppBasePath as o, verifyInternalToken as r, extractBearerToken as t };
