import { b as setResponseStatus, c as getMethod, i as defineEventHandler, u as getRequestHeader } from "./node-DxyfkX8_.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/csrf.js
/**
* Defense-in-depth CSRF check for framework state-changing routes.
*
* Threat model: action endpoints (`/_agent-native/actions/*`), extension
* endpoints (`/_agent-native/extensions/*` and the legacy
* `/_agent-native/tools/*` alias), and a handful of other state-changing
* `/_agent-native/*` routes use the better-auth session cookie, which is
* configured with `SameSite=None; Secure; Partitioned` so the iframe editor
* (and other cross-site embeds) can authenticate. `SameSite=None` means the
* browser ships the session cookie on top-level form POSTs from any origin —
* which is exactly the precondition for classic cross-site request forgery.
*
* The browser still gates "non-simple" requests behind a CORS preflight, so
* an attacker who has to send `Content-Type: application/json` is forced
* through OPTIONS, which our CORS middleware (`create-server.ts`) rejects
* for disallowed origins. But the simple-request bypass (`Content-Type:
* text/plain` on a `<form enctype="text/plain">` POST, or `multipart/form-data`)
* never preflights — the browser delivers it cross-origin with cookies.
*
* Mitigation: this middleware rejects any state-changing
* (`POST/PUT/PATCH/DELETE`) request to `/_agent-native/*` that
*
*   1. carries the auth-cookie pattern (any cookie at all is a heuristic
*      good-enough proxy — we don't want to deny anonymous fetches), AND
*   2. is NOT clearly same-origin / first-party. We trust:
*      - `Sec-Fetch-Site: same-origin` (sent by every modern browser on
*        same-origin fetch — Chrome/Firefox/Safari/Edge all support it).
*      - `X-Agent-Native-CSRF` custom header. Custom headers force a
*        preflight, so an attacker can't add one cross-origin.
*      - `Content-Type: application/json` request body. Same logic — JSON
*        Content-Type is a non-simple request that triggers preflight.
*
* Why the existing CORS check isn't enough: a simple-request POST never
* preflights, so the browser sends it through and only blocks the *response*
* from being readable cross-origin. The state change (delete-account, write
* SQL, etc.) happens server-side regardless. We need a server-side check that
* proves first-party intent before running the action.
*
* Opt-out marker: a handful of routes legitimately accept cross-origin POSTs
* — webhook endpoints (Slack, Telegram, email), the public A2A endpoint
* (`/_agent-native/a2a`), the integrations process-task self-fire, and so on.
* Those are listed in `CSRF_ALLOWLIST_PREFIXES` below; if you add a new
* cross-origin-callable route, add it there.
*/
/**
* Path prefixes (relative to the framework prefix `/_agent-native`) that are
* allowed to receive cross-origin state-changing POSTs without first-party
* markers. These are signed/authenticated through other mechanisms (HMAC,
* JWT, internal token) so they don't need cookie-based CSRF protection.
*/
var CSRF_ALLOWLIST_PREFIXES = [
	"/integrations/",
	"/a2a",
	"/auth/",
	"/billing/webhook",
	"/share/",
	"/oauth/",
	"/builder/callback"
];
var STATE_CHANGING_METHODS = new Set([
	"POST",
	"PUT",
	"PATCH",
	"DELETE"
]);
/**
* Decide whether a request is "first-party enough" to trust as not-CSRF.
* Any of the following make a request non-CSRF:
*
*   - `Sec-Fetch-Site: same-origin` (or `none` for top-level navigations
*     to our own pages — but state-changing methods don't ship `none`).
*   - `X-Agent-Native-CSRF` header (any value, even "1"). This is a custom
*     header so the browser forces a preflight cross-origin, which our
*     CORS layer rejects for disallowed origins.
*   - `Content-Type: application/json` (case-insensitive). JSON content
*     type is a non-simple request that triggers preflight.
*
* We accept ANY of these — the goal is "did the request come through a
* channel the browser would have preflighted", not a strict-mode token.
*/
function looksFirstParty(event) {
	const sfs = getRequestHeader(event, "sec-fetch-site");
	if (sfs === "same-origin" || sfs === "same-site" || sfs === "none") return true;
	if (getRequestHeader(event, "x-agent-native-csrf")) return true;
	const contentType = getRequestHeader(event, "content-type");
	if (contentType && typeof contentType === "string" && contentType.toLowerCase().includes("application/json")) return true;
	return false;
}
/**
* Returns true when the request carries any cookie. We use "has any cookie"
* as a coarse heuristic for "the browser is going to attach the session
* cookie" — anonymous tools (curl, server-to-server) typically don't send
* cookies, so they bypass this check entirely.
*/
function requestHasCookies(event) {
	const cookie = getRequestHeader(event, "cookie");
	return typeof cookie === "string" && cookie.trim().length > 0;
}
/**
* Path passed in is the full request URL pathname (e.g. `/_agent-native/actions/foo`).
* `frameworkPrefix` should be the framework route prefix without trailing slash,
* e.g. `/_agent-native`.
*/
function isOnAllowlist(pathname, frameworkPrefix) {
	if (!pathname.startsWith(frameworkPrefix)) return false;
	const sub = pathname.slice(frameworkPrefix.length);
	for (const allowed of CSRF_ALLOWLIST_PREFIXES) if (sub.startsWith(allowed)) return true;
	return false;
}
/**
* Create the framework CSRF middleware.
*
* Mount this BEFORE any state-changing route handler. The middleware
*   - lets every non-state-changing method through (GET/HEAD/OPTIONS).
*   - lets requests without cookies through (anonymous/server tools).
*   - lets allowlisted paths through (webhooks, A2A, OAuth callbacks).
*   - lets first-party-shaped requests through (custom header, JSON
*     Content-Type, or `Sec-Fetch-Site: same-origin`).
*   - rejects everything else with 403.
*/
function createCsrfMiddleware(frameworkPrefix = "/_agent-native") {
	return defineEventHandler((event) => {
		const method = getMethod(event);
		if (!STATE_CHANGING_METHODS.has(method)) return void 0;
		const pathname = event.url?.pathname ?? "";
		if (!pathname.startsWith(frameworkPrefix)) return void 0;
		if (isOnAllowlist(pathname, frameworkPrefix)) return void 0;
		if (!requestHasCookies(event)) return void 0;
		if (looksFirstParty(event)) return void 0;
		setResponseStatus(event, 403);
		return { error: "CSRF check failed: state-changing requests must include a same-origin marker. Set Content-Type: application/json or X-Agent-Native-CSRF: 1." };
	});
}
//#endregion
export { createCsrfMiddleware };
