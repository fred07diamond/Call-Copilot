import { b as setResponseStatus, c as getMethod, i as defineEventHandler, l as getQuery, s as getHeader, y as setResponseHeader } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-Ccy2ZQ_2.js";
import { E as readCorsAllowedOrigins, T as getAllowedCorsOrigin$1 } from "./auth-CFPsfhIY.js";
import { l as runWithRequestContext } from "./request-context-BQ-cTIMw.js";
import { o as recordChange } from "./poll-CmmCwjfY.js";
import { i as getH3App } from "./framework-request-handler-DiyxDN2M.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/action-routes.js
/**
* Auto-mount actions as HTTP endpoints under /_agent-native/actions/:name.
*
* Actions are exposed as POST by default. Use `http: { method: "GET" }` in
* defineAction to expose as GET. Use `http: false` to mark as agent-only.
*/
var ROUTE_PREFIX = "/_agent-native/actions";
/**
* Read the caller's IANA timezone from the `x-user-timezone` header. The core
* client sends this on every action request so server-side "today" fallbacks
* can honor the user's local day.
*/
function readTimezoneHeader(event) {
	try {
		const raw = getHeader(event, "x-user-timezone");
		if (!raw || typeof raw !== "string") return void 0;
		const trimmed = raw.trim();
		return trimmed.length > 0 && trimmed.length < 64 ? trimmed : void 0;
	} catch {
		return;
	}
}
function getAllowedCorsOrigin(origin) {
	return getAllowedCorsOrigin$1(origin, {
		allowedOrigins: readCorsAllowedOrigins(),
		allowLocalhostWhenNoAllowlist: true
	});
}
function handleOptionsRequest(event) {
	const origin = getHeader(event, "origin");
	const allowedOrigin = getAllowedCorsOrigin(typeof origin === "string" ? origin : void 0);
	if (origin && !allowedOrigin) {
		setResponseStatus(event, 403);
		return "";
	}
	if (allowedOrigin) {
		setResponseHeader(event, "Access-Control-Allow-Origin", allowedOrigin);
		setResponseHeader(event, "Vary", "Origin");
		setResponseHeader(event, "Access-Control-Allow-Credentials", "true");
		setResponseHeader(event, "Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS");
		setResponseHeader(event, "Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,X-Request-Source,X-Agent-Native-CSRF,X-Agent-Native-Tool-Bridge,X-Agent-Native-Tool-Id");
	}
	setResponseStatus(event, 204);
	return "";
}
/**
* Mount discovered actions as HTTP endpoints.
*
* Only actions from `autoDiscoverActions` (template actions) are mounted.
* Built-in actions (resource-*, chat-*, shell, etc.) are NOT passed here.
*/
function mountActionRoutes(nitroApp, actions, options) {
	const mounted = [];
	for (const [name, entry] of Object.entries(actions)) {
		if (entry.http === false) continue;
		const method = entry.http?.method ?? "POST";
		const routePath = `${ROUTE_PREFIX}/${entry.http?.path ?? name}`;
		getH3App(nitroApp).use(routePath, defineEventHandler(async (event) => {
			const reqMethod = getMethod(event);
			const effectiveMethod = reqMethod === "HEAD" && method === "GET" ? "GET" : reqMethod;
			if (reqMethod === "OPTIONS") return handleOptionsRequest(event);
			setResponseHeader(event, "Cache-Control", "no-store");
			if (effectiveMethod !== method) {
				setResponseStatus(event, 405);
				return { error: `Method not allowed. Use ${method}.` };
			}
			if (getHeader(event, "x-agent-native-tool-bridge") === "1" && entry.toolCallable === false) {
				setResponseStatus(event, 403);
				return { error: `Action '${name}' is not callable from tools.` };
			}
			const userEmail = options?.getOwnerFromEvent ? await options.getOwnerFromEvent(event) : void 0;
			return runWithRequestContext({
				userEmail,
				userName: options?.getUserNameFromEvent ? await options.getUserNameFromEvent(event) : void 0,
				orgId: options?.resolveOrgId ? await options.resolveOrgId(event) ?? void 0 : void 0,
				timezone: readTimezoneHeader(event)
			}, async () => {
				let params;
				try {
					if (method === "GET") {
						const webReq = event.req;
						if (webReq?.url) {
							const url = new URL(webReq.url);
							params = Object.fromEntries(url.searchParams);
						} else params = getQuery(event);
					} else {
						const webReq = event.req;
						if (webReq && typeof webReq.json === "function") params = await webReq.json().catch(() => null) ?? {};
						else params = await readBody(event) ?? {};
					}
				} catch {
					params = {};
				}
				try {
					const result = await entry.run(params);
					if (!(typeof entry.readOnly === "boolean" ? entry.readOnly : method === "GET")) try {
						recordChange({
							source: "action",
							type: "change",
							key: name,
							owner: userEmail
						});
					} catch {}
					if (typeof result === "string") try {
						return JSON.parse(result);
					} catch {
						return result;
					}
					return result;
				} catch (err) {
					const msg = err?.message ?? String(err);
					setResponseStatus(event, msg.startsWith("Invalid action parameters") ? 400 : typeof err?.statusCode === "number" ? err.statusCode : 500);
					return { error: msg };
				}
			});
		}));
		mounted.push(`${method} ${routePath}`);
	}
	if (mounted.length > 0 && process.env.DEBUG) console.log(`[action-routes] Mounted ${mounted.length} action route(s): ${mounted.join(", ")}`);
}
//#endregion
export { mountActionRoutes as t };
