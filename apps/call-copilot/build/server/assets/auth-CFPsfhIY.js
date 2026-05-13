import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { _ as sendRedirect, a as deleteCookie, b as setResponseStatus, c as getMethod$1, d as getRequestIP, i as defineEventHandler, l as getQuery, o as getCookie, s as getHeader, v as setCookie, y as setResponseHeader } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-Ccy2ZQ_2.js";
import { a as getDialect, i as getDbExec, n as getDatabaseAuthToken, o as intType, p as retryOnDdlRace, r as getDatabaseUrl, u as isPostgres } from "./client-BpA2t7pN.js";
import { A as isTest, C as shouldPublishLog, D as getEnvVar, E as getBooleanEnvVar, O as isDevelopment, S as logger, T as env, _ as ValidationError$1, a as generateId$1, b as defineErrorCodes, c as ATTR_HOOK_TYPE, d as getAuthTables, f as createRandomStringGenerator, g as BetterCallError, h as APIError$1, i as initGetFieldName, k as isProduction, l as ATTR_OPERATION_ID, m as BetterAuthError, o as withSpan, p as APIError, r as initGetModelName, s as ATTR_CONTEXT, t as whereOperators, u as safeJSONParse, v as kAPIErrorHeaderSymbol, w as ENV, x as createLogger, y as BASE_ERROR_CODES } from "./adapter-DUzvP-Oo.js";
import { a as createRemoteJWKSet, c as SignJWT, d as exportJWK, f as importJWK, i as decodeProtectedHeader, l as jwtDecrypt, m as encode, n as generateKeyPair, o as calculateJwkThumbprint, p as JWTExpired, r as decodeJwt, s as EncryptJWT, u as jwtVerify } from "./webapi-BRtoFKCk.js";
import { At as boolean, En as optional, Et as array, G as ZodOptional, Ht as email, Nn as record, Rn as string, Rt as date, Tn as object, Tt as any, W as ZodObject, Xn as union, Zn as unknown, an as ipv6, fn as looseObject, in as ipv4, ir as xor, on as json, wn as number, yt as _enum } from "./schemas-DWUnC6a7.js";
import { i as string$1, t as boolean$1 } from "./coerce-Br3I0PwZ.js";
import { t as zod_exports } from "./zod-CO-DViWO.js";
import { _ as ATTR_HTTP_ROUTE, g as ATTR_HTTP_RESPONSE_STATUS_CODE, i as ATTR_DB_COLLECTION_NAME } from "./esm-BRtP_ori.js";
import { n as getKyselyDatabaseType, t as createKyselyAdapter } from "./dist-qN9M9VQl.js";
import { n as sql } from "./compiled-query-DU3pDMqo.js";
import { i as renderEmail, o as isEmailConfigured, r as emailStrong, s as sendEmail, t as getAppProductionUrl } from "./app-url-Dc-f-V03.js";
import { t as TEMPLATES } from "./templates-meta-BhSdp3UW.js";
import { n as getUserSetting, r as putUserSetting } from "./user-settings-DsisKP7R.js";
import { r as saveOAuthTokens } from "./store-DIsMo4GX.js";
import { c as text, h as boolean$2, n as pgTable, o as timestamp } from "./table-C1uGOHxK.js";
import { i as integer, n as sqliteTable, r as text$1 } from "./table-CK5By4Er.js";
import { t as captureAuthError } from "./sentry-C8OMWYvW.js";
import crypto$1, { randomBytes, scrypt } from "node:crypto";
import fs from "node:fs";
import nodePath from "node:path";
import fsPromises from "node:fs/promises";
import os from "node:os";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/cors-origins.js
var LOCALHOST_ORIGIN_RE = /^https?:\/\/(localhost|127\.0\.0\.1|tauri\.localhost)(:\d+)?$/;
var NATIVE_APP_ORIGIN_RE = /^(tauri:\/\/(localhost|tauri\.localhost)|https?:\/\/tauri\.localhost(:\d+)?)$/;
function readCorsAllowedOrigins() {
	return (process.env.CORS_ALLOWED_ORIGINS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
}
function isTrustedNativeAppOrigin(origin) {
	return NATIVE_APP_ORIGIN_RE.test(origin);
}
function isLocalhostOrigin(origin) {
	return LOCALHOST_ORIGIN_RE.test(origin);
}
function getAllowedCorsOrigin(origin, options = {}) {
	if (!origin) return null;
	if (isTrustedNativeAppOrigin(origin)) return origin;
	const allowedOrigins = options.allowedOrigins ?? readCorsAllowedOrigins();
	if (allowedOrigins.length > 0) return allowedOrigins.includes(origin) ? origin : null;
	if (options.allowAnyOriginWhenNoAllowlist) return origin;
	if (options.allowLocalhostWhenNoAllowlist !== false) return isLocalhostOrigin(origin) ? origin : null;
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/wildcard.mjs
/**
* Escapes a character if it has a special meaning in regular expressions
* and returns the character as is if it doesn't
*/
function escapeRegExpChar(char) {
	if (char === "-" || char === "^" || char === "$" || char === "+" || char === "." || char === "(" || char === ")" || char === "|" || char === "[" || char === "]" || char === "{" || char === "}" || char === "*" || char === "?" || char === "\\") return `\\${char}`;
	else return char;
}
/**
* Escapes all characters in a given string that have a special meaning in regular expressions
*/
function escapeRegExpString(str) {
	let result = "";
	for (let i = 0; i < str.length; i++) result += escapeRegExpChar(str[i]);
	return result;
}
/**
* Transforms one or more glob patterns into a RegExp pattern
*/
function transform(pattern, separator = true) {
	if (Array.isArray(pattern)) return `(?:${pattern.map((p) => `^${transform(p, separator)}$`).join("|")})`;
	let separatorSplitter = "";
	let separatorMatcher = "";
	let wildcard = ".";
	if (separator === true) {
		separatorSplitter = "/";
		separatorMatcher = "[/\\\\]";
		wildcard = "[^/\\\\]";
	} else if (separator) {
		separatorSplitter = separator;
		separatorMatcher = escapeRegExpString(separatorSplitter);
		if (separatorMatcher.length > 1) {
			separatorMatcher = `(?:${separatorMatcher})`;
			wildcard = `((?!${separatorMatcher}).)`;
		} else wildcard = `[^${separatorMatcher}]`;
	}
	const requiredSeparator = separator ? `${separatorMatcher}+?` : "";
	const optionalSeparator = separator ? `${separatorMatcher}*?` : "";
	const segments = separator ? pattern.split(separatorSplitter) : [pattern];
	let result = "";
	for (let s = 0; s < segments.length; s++) {
		const segment = segments[s];
		const nextSegment = segments[s + 1];
		let currentSeparator = "";
		if (!segment && s > 0) continue;
		if (separator) if (s === segments.length - 1) currentSeparator = optionalSeparator;
		else if (nextSegment !== "**") currentSeparator = requiredSeparator;
		else currentSeparator = "";
		if (separator && segment === "**") {
			if (currentSeparator) {
				result += s === 0 ? "" : currentSeparator;
				result += `(?:${wildcard}*?${currentSeparator})*?`;
			}
			continue;
		}
		for (let c = 0; c < segment.length; c++) {
			const char = segment[c];
			if (char === "\\") {
				if (c < segment.length - 1) {
					result += escapeRegExpChar(segment[c + 1]);
					c++;
				}
			} else if (char === "?") result += wildcard;
			else if (char === "*") result += `${wildcard}*?`;
			else result += escapeRegExpChar(char);
		}
		result += currentSeparator;
	}
	return result;
}
function isMatch(regexp, sample) {
	if (typeof sample !== "string") throw new TypeError(`Sample must be a string, but ${typeof sample} given`);
	return regexp.test(sample);
}
/**
* Compiles one or more glob patterns into a RegExp and returns an isMatch function.
* The isMatch function takes a sample string as its only argument and returns `true`
* if the string matches the pattern(s).
*
* ```js
* wildcardMatch('src/*.js')('src/index.js') //=> true
* ```
*
* ```js
* const isMatch = wildcardMatch('*.example.com', '.')
* isMatch('foo.example.com') //=> true
* isMatch('foo.bar.com') //=> false
* ```
*/
function wildcardMatch(pattern, options) {
	if (typeof pattern !== "string" && !Array.isArray(pattern)) throw new TypeError(`The first argument must be a single pattern string or an array of patterns, but ${typeof pattern} given`);
	if (typeof options === "string" || typeof options === "boolean") options = { separator: options };
	if (arguments.length === 2 && !(typeof options === "undefined" || typeof options === "object" && options !== null && !Array.isArray(options))) throw new TypeError(`The second argument must be an options object or a string/boolean separator, but ${typeof options} given`);
	options = options || {};
	if (options.separator === "\\") throw new Error("\\ is not a valid separator because it is used for escaping. Try setting the separator to `true` instead");
	const regexpPattern = transform(pattern, options.separator);
	const regexp = new RegExp(`^${regexpPattern}$`, options.flags);
	const fn = isMatch.bind(null, regexp);
	fn.options = options;
	fn.pattern = pattern;
	fn.regexp = regexp;
	return fn;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/url.mjs
/**
* Minimal loopback check for dev scheme inference only. Reachable from
* `client/config.ts` via `getBaseURL`, so we MUST NOT import the full
* `@better-auth/core/utils/host` classifier here: its `utils/ip` dependency
* on zod would leak into the client bundle (see `e2e/smoke/test/vite.spec.ts`).
*
* Server-side SSRF/loopback checks (oauth redirect matching, trusted-origin
* resolution, electron fetch gate) continue to use the authoritative
* `isLoopbackHost` from `@better-auth/core/utils/host`. This helper's only
* job is picking `http` vs `https` for dev ergonomics.
*/
function isLoopbackForDevScheme(host) {
	const hostname = host.replace(/:\d+$/, "").replace(/^\[|\]$/g, "").toLowerCase();
	return hostname === "localhost" || hostname.endsWith(".localhost") || hostname === "::1" || hostname.startsWith("127.");
}
function checkHasPath(url) {
	try {
		return (new URL(url).pathname.replace(/\/+$/, "") || "/") !== "/";
	} catch {
		throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`);
	}
}
function assertHasProtocol(url) {
	try {
		const parsedUrl = new URL(url);
		if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") throw new BetterAuthError(`Invalid base URL: ${url}. URL must include 'http://' or 'https://'`);
	} catch (error) {
		if (error instanceof BetterAuthError) throw error;
		throw new BetterAuthError(`Invalid base URL: ${url}. Please provide a valid base URL.`, { cause: error });
	}
}
function withPath(url, path = "/api/auth") {
	assertHasProtocol(url);
	if (checkHasPath(url)) return url;
	const trimmedUrl = url.replace(/\/+$/, "");
	if (!path || path === "/") return trimmedUrl;
	path = path.startsWith("/") ? path : `/${path}`;
	return `${trimmedUrl}${path}`;
}
function validateProxyHeader(header, type) {
	if (!header || header.trim() === "") return false;
	if (type === "proto") return header === "http" || header === "https";
	if (type === "host") {
		if ([
			/\.\./,
			/\0/,
			/[\s]/,
			/^[.]/,
			/[<>'"]/,
			/javascript:/i,
			/file:/i,
			/data:/i
		].some((pattern) => pattern.test(header))) return false;
		return /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*(:[0-9]{1,5})?$/.test(header) || /^(\d{1,3}\.){3}\d{1,3}(:[0-9]{1,5})?$/.test(header) || /^\[[0-9a-fA-F:]+\](:[0-9]{1,5})?$/.test(header) || /^localhost(:[0-9]{1,5})?$/i.test(header);
	}
	return false;
}
function getBaseURL(url, path, request, loadEnv, trustedProxyHeaders) {
	if (url) return withPath(url, path);
	if (loadEnv !== false) {
		const fromEnv = env.BETTER_AUTH_URL || env.NEXT_PUBLIC_BETTER_AUTH_URL || env.PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_BETTER_AUTH_URL || env.NUXT_PUBLIC_AUTH_URL || (env.BASE_URL !== "/" ? env.BASE_URL : void 0);
		if (fromEnv) return withPath(fromEnv, path);
	}
	const fromRequest = request?.headers.get("x-forwarded-host");
	const fromRequestProto = request?.headers.get("x-forwarded-proto");
	if (fromRequest && fromRequestProto && trustedProxyHeaders) {
		if (validateProxyHeader(fromRequestProto, "proto") && validateProxyHeader(fromRequest, "host")) try {
			return withPath(`${fromRequestProto}://${fromRequest}`, path);
		} catch (_error) {}
	}
	if (request) {
		const url = getOrigin$1(request.url);
		if (!url) throw new BetterAuthError("Could not get origin from request. Please provide a valid base URL.");
		return withPath(url, path);
	}
	if (typeof window !== "undefined" && window.location) return withPath(window.location.origin, path);
}
function getOrigin$1(url) {
	try {
		const parsedUrl = new URL(url);
		return parsedUrl.origin === "null" ? null : parsedUrl.origin;
	} catch {
		return null;
	}
}
function getProtocol(url) {
	try {
		return new URL(url).protocol;
	} catch {
		return null;
	}
}
function getHost(url) {
	try {
		return new URL(url).host;
	} catch {
		return null;
	}
}
/**
* Checks if the baseURL config is a dynamic config object
*/
function isDynamicBaseURLConfig(config) {
	return typeof config === "object" && config !== null && "allowedHosts" in config && Array.isArray(config.allowedHosts);
}
/**
* Check if a value is a `Request`
* - `instanceof`: works for native Request instances
* - `toString`: handles where instanceof check fails but the object is still a
*   valid Request (e.g. cross-realm, polyfills). Paired with a shape check so
*   an object that only spoofs `Symbol.toStringTag` without the real shape is
*   rejected before downstream code tries to read `.headers` / `.url`.
*
* @param value The value to check
* @returns `true` if the value is a Request instance
*/
function isRequestLike(value) {
	if (value instanceof Request) return true;
	if (typeof value !== "object" || value === null || Object.prototype.toString.call(value) !== "[object Request]") return false;
	const v = value;
	return typeof v.url === "string" && typeof v.headers === "object" && v.headers !== null && typeof v.headers.get === "function";
}
/**
* Extracts the host from a `Request` or `Headers`.
* Honors `x-forwarded-host` only when `trustedProxyHeaders` is enabled,
* then falls back to the `host` header and finally the request URL.
*/
function getHostFromSource(source, trustedProxyHeaders) {
	const headers = isRequestLike(source) ? source.headers : source;
	if (trustedProxyHeaders) {
		const forwardedHost = headers.get("x-forwarded-host");
		if (forwardedHost && validateProxyHeader(forwardedHost, "host")) return forwardedHost;
	}
	const host = headers.get("host");
	if (host && validateProxyHeader(host, "host")) return host;
	if (isRequestLike(source)) try {
		return new URL(source.url).host;
	} catch {
		return null;
	}
	return null;
}
/**
* Extracts the protocol from a `Request` or `Headers`.
* Honors `x-forwarded-proto` only when `trustedProxyHeaders` is enabled,
* then falls back to the request URL, then to "https".
*/
function getProtocolFromSource(source, configProtocol, trustedProxyHeaders) {
	if (configProtocol === "http" || configProtocol === "https") return configProtocol;
	const headers = isRequestLike(source) ? source.headers : source;
	if (trustedProxyHeaders) {
		const forwardedProto = headers.get("x-forwarded-proto");
		if (forwardedProto && validateProxyHeader(forwardedProto, "proto")) return forwardedProto;
	}
	if (isRequestLike(source)) try {
		const url = new URL(source.url);
		if (url.protocol === "http:" || url.protocol === "https:") return url.protocol.slice(0, -1);
	} catch {}
	const host = getHostFromSource(source, trustedProxyHeaders);
	if (host && isLoopbackForDevScheme(host)) return "http";
	return "https";
}
/**
* Matches a hostname against a host pattern.
* Supports wildcard patterns like `*.vercel.app` or `preview-*.myapp.com`.
*
* @param host The hostname to test (e.g., "myapp.com", "preview-123.vercel.app")
* @param pattern The host pattern (e.g., "myapp.com", "*.vercel.app")
* @returns {boolean} true if the host matches the pattern, false otherwise.
*
* @example
* ```ts
* matchesHostPattern("myapp.com", "myapp.com") // true
* matchesHostPattern("preview-123.vercel.app", "*.vercel.app") // true
* matchesHostPattern("preview-123.myapp.com", "preview-*.myapp.com") // true
* matchesHostPattern("evil.com", "myapp.com") // false
* ```
*/
var matchesHostPattern = (host, pattern) => {
	if (!host || !pattern) return false;
	const normalizedHost = host.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
	const normalizedPattern = pattern.replace(/^https?:\/\//, "").split("/")[0].toLowerCase();
	if (normalizedPattern.includes("*") || normalizedPattern.includes("?")) return wildcardMatch(normalizedPattern)(normalizedHost);
	return normalizedHost.toLowerCase() === normalizedPattern.toLowerCase();
};
/**
* Resolves the base URL from a dynamic config based on the incoming request.
* Validates the derived host against the allowedHosts allowlist.
*
* @param config The dynamic base URL config
* @param request The incoming request
* @param basePath The base path to append
* @returns The resolved base URL with path
* @throws BetterAuthError if host is not in allowedHosts and no fallback is set
*/
function resolveDynamicBaseURL(config, source, basePath, trustedProxyHeaders) {
	const host = getHostFromSource(source, trustedProxyHeaders);
	if (!host) {
		if (config.fallback) return withPath(config.fallback, basePath);
		throw new BetterAuthError("Could not determine host from request headers. Please provide a fallback URL in your baseURL config.");
	}
	if (config.allowedHosts.some((pattern) => matchesHostPattern(host, pattern))) return withPath(`${getProtocolFromSource(source, config.protocol, trustedProxyHeaders)}://${host}`, basePath);
	if (config.fallback) return withPath(config.fallback, basePath);
	throw new BetterAuthError(`Host "${host}" is not in the allowed hosts list. Allowed hosts: ${config.allowedHosts.join(", ")}. Add this host to your allowedHosts config or provide a fallback URL.`);
}
/**
* Resolves the base URL from any config type (static string or dynamic object).
* This is the main entry point for base URL resolution.
*
* @param config The base URL config (string or object)
* @param basePath The base path to append
* @param request Optional request for dynamic resolution
* @param loadEnv Whether to load from environment variables
* @param trustedProxyHeaders Whether to trust proxy headers (for legacy behavior)
* @returns The resolved base URL with path
*/
function resolveBaseURL(config, basePath, source, loadEnv, trustedProxyHeaders) {
	if (isDynamicBaseURLConfig(config)) {
		if (source) return resolveDynamicBaseURL(config, source, basePath, trustedProxyHeaders);
		if (config.fallback) return withPath(config.fallback, basePath);
		return getBaseURL(void 0, basePath, void 0, loadEnv, trustedProxyHeaders);
	}
	const request = isRequestLike(source) ? source : void 0;
	if (typeof config === "string") return getBaseURL(config, basePath, request, loadEnv, trustedProxyHeaders);
	return getBaseURL(void 0, basePath, request, loadEnv, trustedProxyHeaders);
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/crypto/random.mjs
var generateRandomString = createRandomStringGenerator("a-z", "0-9", "A-Z", "-_");
//#endregion
//#region ../../node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/utils.js
/**
* Checks if something is Uint8Array. Be careful: nodejs Buffer will return true.
* @param a - value to test
* @returns `true` when the value is a Uint8Array-compatible view.
* @example
* Check whether a value is a Uint8Array-compatible view.
* ```ts
* isBytes(new Uint8Array([1, 2, 3]));
* ```
*/
function isBytes$1(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
/**
* Asserts something is a non-negative integer.
* @param n - number to validate
* @param title - label included in thrown errors
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a non-negative integer option.
* ```ts
* anumber(32, 'length');
* ```
*/
function anumber$1(n, title = "") {
	if (typeof n !== "number") {
		const prefix = title && `"${title}" `;
		throw new TypeError(`${prefix}expected number, got ${typeof n}`);
	}
	if (!Number.isSafeInteger(n) || n < 0) {
		const prefix = title && `"${title}" `;
		throw new RangeError(`${prefix}expected integer >= 0, got ${n}`);
	}
}
/**
* Asserts something is Uint8Array.
* @param value - value to validate
* @param length - optional exact length constraint
* @param title - label included in thrown errors
* @returns The validated byte array.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate that a value is a byte array.
* ```ts
* abytes(new Uint8Array([1, 2, 3]));
* ```
*/
function abytes$1(value, length, title = "") {
	const bytes = isBytes$1(value);
	const len = value?.length;
	const needsLen = length !== void 0;
	if (!bytes || needsLen && len !== length) {
		const prefix = title && `"${title}" `;
		const ofLen = needsLen ? ` of length ${length}` : "";
		const got = bytes ? `length=${len}` : `type=${typeof value}`;
		const message = prefix + "expected Uint8Array" + ofLen + ", got " + got;
		if (!bytes) throw new TypeError(message);
		throw new RangeError(message);
	}
	return value;
}
/**
* Asserts something is a wrapped hash constructor.
* @param h - hash constructor to validate
* @throws On wrong argument types or invalid hash wrapper shape. {@link TypeError}
* @throws On invalid hash metadata ranges or values. {@link RangeError}
* @throws If the hash metadata allows empty outputs or block sizes. {@link Error}
* @example
* Validate a callable hash wrapper.
* ```ts
* import { ahash } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* ahash(sha256);
* ```
*/
function ahash(h) {
	if (typeof h !== "function" || typeof h.create !== "function") throw new TypeError("Hash must wrapped by utils.createHasher");
	anumber$1(h.outputLen);
	anumber$1(h.blockLen);
	if (h.outputLen < 1) throw new Error("\"outputLen\" must be >= 1");
	if (h.blockLen < 1) throw new Error("\"blockLen\" must be >= 1");
}
/**
* Asserts a hash instance has not been destroyed or finished.
* @param instance - hash instance to validate
* @param checkFinished - whether to reject finalized instances
* @throws If the hash instance has already been destroyed or finalized. {@link Error}
* @example
* Validate that a hash instance is still usable.
* ```ts
* import { aexists } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const hash = sha256.create();
* aexists(hash);
* ```
*/
function aexists$1(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/**
* Asserts output is a sufficiently-sized byte array.
* @param out - destination buffer
* @param instance - hash instance providing output length
* Oversized buffers are allowed; downstream code only promises to fill the first `outputLen` bytes.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validate a caller-provided digest buffer.
* ```ts
* import { aoutput } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const hash = sha256.create();
* aoutput(new Uint8Array(hash.outputLen), hash);
* ```
*/
function aoutput$1(out, instance) {
	abytes$1(out, void 0, "digestInto() output");
	const min = instance.outputLen;
	if (out.length < min) throw new RangeError("\"digestInto() output\" expected to be of length >=" + min);
}
/**
* Zeroizes typed arrays in place. Warning: JS provides no guarantees.
* @param arrays - arrays to overwrite with zeros
* @example
* Zeroize sensitive buffers in place.
* ```ts
* clean(new Uint8Array([1, 2, 3]));
* ```
*/
function clean$1(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/**
* Creates a DataView for byte-level manipulation.
* @param arr - source typed array
* @returns DataView over the same buffer region.
* @example
* Create a DataView over an existing buffer.
* ```ts
* createView(new Uint8Array(4));
* ```
*/
function createView$1(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/**
* Rotate-right operation for uint32 values.
* @param word - source word
* @param shift - shift amount in bits
* @returns Rotated word.
* @example
* Rotate a 32-bit word to the right.
* ```ts
* rotr(0x12345678, 8);
* ```
*/
function rotr(word, shift) {
	return word << 32 - shift | word >>> shift;
}
new Uint8Array(new Uint32Array([287454020]).buffer)[0];
typeof Uint8Array.from([]).toHex === "function" && Uint8Array.fromHex;
/**
* Creates a callable hash function from a stateful class constructor.
* @param hashCons - hash constructor or factory
* @param info - optional metadata such as DER OID
* @returns Frozen callable hash wrapper with `.create()`.
*   Wrapper construction eagerly calls `hashCons(undefined)` once to read
*   `outputLen` / `blockLen`, so constructor side effects happen at module
*   init time.
* @example
* Wrap a stateful hash constructor into a callable helper.
* ```ts
* import { createHasher } from '@noble/hashes/utils.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* const wrapped = createHasher(sha256.create, { oid: sha256.oid });
* wrapped(new Uint8Array([1]));
* ```
*/
function createHasher(hashCons, info = {}) {
	const hashC = (msg, opts) => hashCons(opts).update(msg).digest();
	const tmp = hashCons(void 0);
	hashC.outputLen = tmp.outputLen;
	hashC.blockLen = tmp.blockLen;
	hashC.canXOF = tmp.canXOF;
	hashC.create = (opts) => hashCons(opts);
	Object.assign(hashC, info);
	return Object.freeze(hashC);
}
/**
* Creates OID metadata for NIST hashes with prefix `06 09 60 86 48 01 65 03 04 02`.
* @param suffix - final OID byte for the selected hash.
*   The helper accepts any byte even though only the documented NIST hash
*   suffixes are meaningful downstream.
* @returns Object containing the DER-encoded OID.
* @example
* Build OID metadata for a NIST hash.
* ```ts
* oidNist(0x01);
* ```
*/
var oidNist = (suffix) => ({ oid: Uint8Array.from([
	6,
	9,
	96,
	134,
	72,
	1,
	101,
	3,
	4,
	2,
	suffix
]) });
//#endregion
//#region ../../node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/hmac.js
/**
* HMAC: RFC2104 message authentication code.
* @module
*/
/**
* Internal class for HMAC.
* Accepts any byte key, although RFC 2104 §3 recommends keys at least
* `HashLen` bytes long.
*/
var _HMAC = class {
	oHash;
	iHash;
	blockLen;
	outputLen;
	canXOF = false;
	finished = false;
	destroyed = false;
	constructor(hash, key) {
		ahash(hash);
		abytes$1(key, void 0, "key");
		this.iHash = hash.create();
		if (typeof this.iHash.update !== "function") throw new Error("Expected instance of class which extends utils.Hash");
		this.blockLen = this.iHash.blockLen;
		this.outputLen = this.iHash.outputLen;
		const blockLen = this.blockLen;
		const pad = new Uint8Array(blockLen);
		pad.set(key.length > blockLen ? hash.create().update(key).digest() : key);
		for (let i = 0; i < pad.length; i++) pad[i] ^= 54;
		this.iHash.update(pad);
		this.oHash = hash.create();
		for (let i = 0; i < pad.length; i++) pad[i] ^= 106;
		this.oHash.update(pad);
		clean$1(pad);
	}
	update(buf) {
		aexists$1(this);
		this.iHash.update(buf);
		return this;
	}
	digestInto(out) {
		aexists$1(this);
		aoutput$1(out, this);
		this.finished = true;
		const buf = out.subarray(0, this.outputLen);
		this.iHash.digestInto(buf);
		this.oHash.update(buf);
		this.oHash.digestInto(buf);
		this.destroy();
	}
	digest() {
		const out = new Uint8Array(this.oHash.outputLen);
		this.digestInto(out);
		return out;
	}
	_cloneInto(to) {
		to ||= Object.create(Object.getPrototypeOf(this), {});
		const { oHash, iHash, finished, destroyed, blockLen, outputLen } = this;
		to = to;
		to.finished = finished;
		to.destroyed = destroyed;
		to.blockLen = blockLen;
		to.outputLen = outputLen;
		to.oHash = oHash._cloneInto(to.oHash);
		to.iHash = iHash._cloneInto(to.iHash);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
	destroy() {
		this.destroyed = true;
		this.oHash.destroy();
		this.iHash.destroy();
	}
};
var hmac = /* @__PURE__ */ (() => {
	const hmac_ = ((hash, key, message) => new _HMAC(hash, key).update(message).digest());
	hmac_.create = (hash, key) => new _HMAC(hash, key);
	return hmac_;
})();
//#endregion
//#region ../../node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/hkdf.js
/**
* HKDF (RFC 5869): extract + expand in one step.
* See {@link https://soatok.blog/2021/11/17/understanding-hkdf/}.
* @module
*/
/**
* HKDF-extract from spec. Less important part. `HKDF-Extract(IKM, salt) -> PRK`
* Arguments position differs from spec (IKM is first one, since it is not optional)
* Local validation only checks `hash`; `ikm` / `salt` byte validation is delegated to `hmac()`.
* @param hash - hash function that would be used (e.g. sha256)
* @param ikm - input keying material, the initial key
* @param salt - optional salt value (a non-secret random value)
* @returns Pseudorandom key derived from input keying material.
* @example
* Run the HKDF extract step.
* ```ts
* import { extract } from '@noble/hashes/hkdf.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* extract(sha256, new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]));
* ```
*/
function extract(hash, ikm, salt) {
	ahash(hash);
	if (salt === void 0) salt = new Uint8Array(hash.outputLen);
	return hmac(hash, salt, ikm);
}
var HKDF_COUNTER = /* @__PURE__ */ Uint8Array.of(0);
var EMPTY_BUFFER = /* @__PURE__ */ Uint8Array.of();
/**
* HKDF-expand from the spec. The most important part. `HKDF-Expand(PRK, info, L) -> OKM`
* @param hash - hash function that would be used (e.g. sha256)
* @param prk - a pseudorandom key of at least HashLen octets
*   (usually, the output from the extract step)
* @param info - optional context and application specific information (can be a zero-length string)
* @param length - length of output keying material in bytes.
*   RFC 5869 §2.3 allows `0..255*HashLen`, so `0` returns an empty OKM.
* @returns Output keying material with the requested length.
* @throws If the requested output length exceeds the HKDF limit
*   for the selected hash. {@link Error}
* @example
* Run the HKDF expand step.
* ```ts
* import { expand } from '@noble/hashes/hkdf.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* expand(sha256, new Uint8Array(32), new Uint8Array([1, 2, 3]), 16);
* ```
*/
function expand(hash, prk, info, length = 32) {
	ahash(hash);
	anumber$1(length, "length");
	abytes$1(prk, void 0, "prk");
	const olen = hash.outputLen;
	if (prk.length < olen) throw new Error("\"prk\" must be at least HashLen octets");
	if (length > 255 * olen) throw new Error("Length must be <= 255*HashLen");
	const blocks = Math.ceil(length / olen);
	if (info === void 0) info = EMPTY_BUFFER;
	else abytes$1(info, void 0, "info");
	const okm = new Uint8Array(blocks * olen);
	const HMAC = hmac.create(hash, prk);
	const HMACTmp = HMAC._cloneInto();
	const T = new Uint8Array(HMAC.outputLen);
	for (let counter = 0; counter < blocks; counter++) {
		HKDF_COUNTER[0] = counter + 1;
		HMACTmp.update(counter === 0 ? EMPTY_BUFFER : T).update(info).update(HKDF_COUNTER).digestInto(T);
		okm.set(T, olen * counter);
		HMAC._cloneInto(HMACTmp);
	}
	HMAC.destroy();
	HMACTmp.destroy();
	clean$1(T, HKDF_COUNTER);
	return okm.slice(0, length);
}
/**
* HKDF (RFC 5869): derive keys from an initial input.
* Combines hkdf_extract + hkdf_expand in one step
* @param hash - hash function that would be used (e.g. sha256)
* @param ikm - input keying material, the initial key
* @param salt - optional salt value (a non-secret random value)
* @param info - optional context and application specific information bytes
* @param length - length of output keying material in bytes.
*   RFC 5869 §2.3 allows `0..255*HashLen`, so `0` returns an empty OKM.
* @returns Output keying material derived from the input key.
* @throws If the requested output length exceeds the HKDF limit
*   for the selected hash. {@link Error}
* @example
* HKDF (RFC 5869): derive keys from an initial input.
* ```ts
* import { hkdf } from '@noble/hashes/hkdf.js';
* import { sha256 } from '@noble/hashes/sha2.js';
* import { randomBytes, utf8ToBytes } from '@noble/hashes/utils.js';
* const inputKey = randomBytes(32);
* const salt = randomBytes(32);
* const info = utf8ToBytes('application-key');
* const okm = hkdf(sha256, inputKey, salt, info, 32);
* ```
*/
var hkdf = (hash, ikm, salt, info, length) => expand(hash, extract(hash, ikm, salt), info, length);
//#endregion
//#region ../../node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/_md.js
/**
* Internal Merkle-Damgard hash utils.
* @module
*/
/**
* Shared 32-bit conditional boolean primitive reused by SHA-256, SHA-1, and MD5 `F`.
* Returns bits from `b` when `a` is set, otherwise from `c`.
* The XOR form is equivalent to MD5's `F(X,Y,Z) = XY v not(X)Z` because the masked terms never
* set the same bit.
* @param a - selector word
* @param b - word chosen when selector bit is set
* @param c - word chosen when selector bit is clear
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit choice primitive.
* ```ts
* Chi(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Chi(a, b, c) {
	return a & b ^ ~a & c;
}
/**
* Shared 32-bit majority primitive reused by SHA-256 and SHA-1.
* Returns bits shared by at least two inputs.
* @param a - first input word
* @param b - second input word
* @param c - third input word
* @returns Mixed 32-bit word.
* @example
* Combine three words with the shared 32-bit majority primitive.
* ```ts
* Maj(0xffffffff, 0x12345678, 0x87654321);
* ```
*/
function Maj(a, b, c) {
	return a & b ^ a & c ^ b & c;
}
/**
* Merkle-Damgard hash construction base class.
* Could be used to create MD5, RIPEMD, SHA1, SHA2.
* Accepts only byte-aligned `Uint8Array` input, even when the underlying spec describes bit
* strings with partial-byte tails.
* @param blockLen - internal block size in bytes
* @param outputLen - digest size in bytes
* @param padOffset - trailing length field size in bytes
* @param isLE - whether length and state words are encoded in little-endian
* @example
* Use a concrete subclass to get the shared Merkle-Damgard update/digest flow.
* ```ts
* import { _SHA1 } from '@noble/hashes/legacy.js';
* const hash = new _SHA1();
* hash.update(new Uint8Array([97, 98, 99]));
* hash.digest();
* ```
*/
var HashMD = class {
	blockLen;
	outputLen;
	canXOF = false;
	padOffset;
	isLE;
	buffer;
	view;
	finished = false;
	length = 0;
	pos = 0;
	destroyed = false;
	constructor(blockLen, outputLen, padOffset, isLE) {
		this.blockLen = blockLen;
		this.outputLen = outputLen;
		this.padOffset = padOffset;
		this.isLE = isLE;
		this.buffer = new Uint8Array(blockLen);
		this.view = createView$1(this.buffer);
	}
	update(data) {
		aexists$1(this);
		abytes$1(data);
		const { view, buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				const dataView = createView$1(data);
				for (; blockLen <= len - pos; pos += blockLen) this.process(dataView, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(view, 0);
				this.pos = 0;
			}
		}
		this.length += data.length;
		this.roundClean();
		return this;
	}
	digestInto(out) {
		aexists$1(this);
		aoutput$1(out, this);
		this.finished = true;
		const { buffer, view, blockLen, isLE } = this;
		let { pos } = this;
		buffer[pos++] = 128;
		clean$1(this.buffer.subarray(pos));
		if (this.padOffset > blockLen - pos) {
			this.process(view, 0);
			pos = 0;
		}
		for (let i = pos; i < blockLen; i++) buffer[i] = 0;
		view.setBigUint64(blockLen - 8, BigInt(this.length * 8), isLE);
		this.process(view, 0);
		const oview = createView$1(out);
		const len = this.outputLen;
		if (len % 4) throw new Error("_sha2: outputLen must be aligned to 32bit");
		const outLen = len / 4;
		const state = this.get();
		if (outLen > state.length) throw new Error("_sha2: outputLen bigger than state");
		for (let i = 0; i < outLen; i++) oview.setUint32(4 * i, state[i], isLE);
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
	_cloneInto(to) {
		to ||= new this.constructor();
		to.set(...this.get());
		const { blockLen, buffer, length, finished, destroyed, pos } = this;
		to.destroyed = destroyed;
		to.finished = finished;
		to.length = length;
		to.pos = pos;
		if (length % blockLen) to.buffer.set(buffer);
		return to;
	}
	clone() {
		return this._cloneInto();
	}
};
/**
* Initial SHA-2 state: fractional parts of square roots of first 16 primes 2..53.
* Check out `test/misc/sha2-gen-iv.js` for recomputation guide.
*/
/** Initial SHA256 state from RFC 6234 §6.1: the first 32 bits of the fractional parts of the
* square roots of the first eight prime numbers. Exported as a shared table; callers must treat
* it as read-only because constructors copy words from it by index. */
var SHA256_IV = /* @__PURE__ */ Uint32Array.from([
	1779033703,
	3144134277,
	1013904242,
	2773480762,
	1359893119,
	2600822924,
	528734635,
	1541459225
]);
//#endregion
//#region ../../node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/_u64.js
var U32_MASK64 = /* @__PURE__ */ BigInt(2 ** 32 - 1);
var _32n = /* @__PURE__ */ BigInt(32);
function fromBig(n, le = false) {
	if (le) return {
		h: Number(n & U32_MASK64),
		l: Number(n >> _32n & U32_MASK64)
	};
	return {
		h: Number(n >> _32n & U32_MASK64) | 0,
		l: Number(n & U32_MASK64) | 0
	};
}
function split(lst, le = false) {
	const len = lst.length;
	let Ah = new Uint32Array(len);
	let Al = new Uint32Array(len);
	for (let i = 0; i < len; i++) {
		const { h, l } = fromBig(lst[i], le);
		[Ah[i], Al[i]] = [h, l];
	}
	return [Ah, Al];
}
//#endregion
//#region ../../node_modules/.pnpm/@noble+hashes@2.2.0/node_modules/@noble/hashes/sha2.js
/**
* SHA2 hash function. A.k.a. sha256, sha384, sha512, sha512_224, sha512_256.
* SHA256 is the fastest hash implementable in JS, even faster than Blake3.
* Check out {@link https://www.rfc-editor.org/rfc/rfc4634 | RFC 4634} and
* {@link https://nvlpubs.nist.gov/nistpubs/FIPS/NIST.FIPS.180-4.pdf | FIPS 180-4}.
* @module
*/
/**
* SHA-224 / SHA-256 round constants from RFC 6234 §5.1: the first 32 bits
* of the cube roots of the first 64 primes (2..311).
*/
var SHA256_K = /* @__PURE__ */ Uint32Array.from([
	1116352408,
	1899447441,
	3049323471,
	3921009573,
	961987163,
	1508970993,
	2453635748,
	2870763221,
	3624381080,
	310598401,
	607225278,
	1426881987,
	1925078388,
	2162078206,
	2614888103,
	3248222580,
	3835390401,
	4022224774,
	264347078,
	604807628,
	770255983,
	1249150122,
	1555081692,
	1996064986,
	2554220882,
	2821834349,
	2952996808,
	3210313671,
	3336571891,
	3584528711,
	113926993,
	338241895,
	666307205,
	773529912,
	1294757372,
	1396182291,
	1695183700,
	1986661051,
	2177026350,
	2456956037,
	2730485921,
	2820302411,
	3259730800,
	3345764771,
	3516065817,
	3600352804,
	4094571909,
	275423344,
	430227734,
	506948616,
	659060556,
	883997877,
	958139571,
	1322822218,
	1537002063,
	1747873779,
	1955562222,
	2024104815,
	2227730452,
	2361852424,
	2428436474,
	2756734187,
	3204031479,
	3329325298
]);
/** Reusable SHA-224 / SHA-256 message schedule buffer `W_t` from RFC 6234 §6.2 step 1. */
var SHA256_W = /* @__PURE__ */ new Uint32Array(64);
/** Internal SHA-224 / SHA-256 compression engine from RFC 6234 §6.2. */
var SHA2_32B = class extends HashMD {
	constructor(outputLen) {
		super(64, outputLen, 8, false);
	}
	get() {
		const { A, B, C, D, E, F, G, H } = this;
		return [
			A,
			B,
			C,
			D,
			E,
			F,
			G,
			H
		];
	}
	set(A, B, C, D, E, F, G, H) {
		this.A = A | 0;
		this.B = B | 0;
		this.C = C | 0;
		this.D = D | 0;
		this.E = E | 0;
		this.F = F | 0;
		this.G = G | 0;
		this.H = H | 0;
	}
	process(view, offset) {
		for (let i = 0; i < 16; i++, offset += 4) SHA256_W[i] = view.getUint32(offset, false);
		for (let i = 16; i < 64; i++) {
			const W15 = SHA256_W[i - 15];
			const W2 = SHA256_W[i - 2];
			const s0 = rotr(W15, 7) ^ rotr(W15, 18) ^ W15 >>> 3;
			SHA256_W[i] = (rotr(W2, 17) ^ rotr(W2, 19) ^ W2 >>> 10) + SHA256_W[i - 7] + s0 + SHA256_W[i - 16] | 0;
		}
		let { A, B, C, D, E, F, G, H } = this;
		for (let i = 0; i < 64; i++) {
			const sigma1 = rotr(E, 6) ^ rotr(E, 11) ^ rotr(E, 25);
			const T1 = H + sigma1 + Chi(E, F, G) + SHA256_K[i] + SHA256_W[i] | 0;
			const T2 = (rotr(A, 2) ^ rotr(A, 13) ^ rotr(A, 22)) + Maj(A, B, C) | 0;
			H = G;
			G = F;
			F = E;
			E = D + T1 | 0;
			D = C;
			C = B;
			B = A;
			A = T1 + T2 | 0;
		}
		A = A + this.A | 0;
		B = B + this.B | 0;
		C = C + this.C | 0;
		D = D + this.D | 0;
		E = E + this.E | 0;
		F = F + this.F | 0;
		G = G + this.G | 0;
		H = H + this.H | 0;
		this.set(A, B, C, D, E, F, G, H);
	}
	roundClean() {
		clean$1(SHA256_W);
	}
	destroy() {
		this.destroyed = true;
		this.set(0, 0, 0, 0, 0, 0, 0, 0);
		clean$1(this.buffer);
	}
};
/** Internal SHA-256 hash class grounded in RFC 6234 §6.2. */
var _SHA256 = class extends SHA2_32B {
	A = SHA256_IV[0] | 0;
	B = SHA256_IV[1] | 0;
	C = SHA256_IV[2] | 0;
	D = SHA256_IV[3] | 0;
	E = SHA256_IV[4] | 0;
	F = SHA256_IV[5] | 0;
	G = SHA256_IV[6] | 0;
	H = SHA256_IV[7] | 0;
	constructor() {
		super(32);
	}
};
var K512 = split([
	"0x428a2f98d728ae22",
	"0x7137449123ef65cd",
	"0xb5c0fbcfec4d3b2f",
	"0xe9b5dba58189dbbc",
	"0x3956c25bf348b538",
	"0x59f111f1b605d019",
	"0x923f82a4af194f9b",
	"0xab1c5ed5da6d8118",
	"0xd807aa98a3030242",
	"0x12835b0145706fbe",
	"0x243185be4ee4b28c",
	"0x550c7dc3d5ffb4e2",
	"0x72be5d74f27b896f",
	"0x80deb1fe3b1696b1",
	"0x9bdc06a725c71235",
	"0xc19bf174cf692694",
	"0xe49b69c19ef14ad2",
	"0xefbe4786384f25e3",
	"0x0fc19dc68b8cd5b5",
	"0x240ca1cc77ac9c65",
	"0x2de92c6f592b0275",
	"0x4a7484aa6ea6e483",
	"0x5cb0a9dcbd41fbd4",
	"0x76f988da831153b5",
	"0x983e5152ee66dfab",
	"0xa831c66d2db43210",
	"0xb00327c898fb213f",
	"0xbf597fc7beef0ee4",
	"0xc6e00bf33da88fc2",
	"0xd5a79147930aa725",
	"0x06ca6351e003826f",
	"0x142929670a0e6e70",
	"0x27b70a8546d22ffc",
	"0x2e1b21385c26c926",
	"0x4d2c6dfc5ac42aed",
	"0x53380d139d95b3df",
	"0x650a73548baf63de",
	"0x766a0abb3c77b2a8",
	"0x81c2c92e47edaee6",
	"0x92722c851482353b",
	"0xa2bfe8a14cf10364",
	"0xa81a664bbc423001",
	"0xc24b8b70d0f89791",
	"0xc76c51a30654be30",
	"0xd192e819d6ef5218",
	"0xd69906245565a910",
	"0xf40e35855771202a",
	"0x106aa07032bbd1b8",
	"0x19a4c116b8d2d0c8",
	"0x1e376c085141ab53",
	"0x2748774cdf8eeb99",
	"0x34b0bcb5e19b48a8",
	"0x391c0cb3c5c95a63",
	"0x4ed8aa4ae3418acb",
	"0x5b9cca4f7763e373",
	"0x682e6ff3d6b2b8a3",
	"0x748f82ee5defb2fc",
	"0x78a5636f43172f60",
	"0x84c87814a1f0ab72",
	"0x8cc702081a6439ec",
	"0x90befffa23631e28",
	"0xa4506cebde82bde9",
	"0xbef9a3f7b2c67915",
	"0xc67178f2e372532b",
	"0xca273eceea26619c",
	"0xd186b8c721c0c207",
	"0xeada7dd6cde0eb1e",
	"0xf57d4f7fee6ed178",
	"0x06f067aa72176fba",
	"0x0a637dc5a2c898a6",
	"0x113f9804bef90dae",
	"0x1b710b35131c471b",
	"0x28db77f523047d84",
	"0x32caab7b40c72493",
	"0x3c9ebe0a15c9bebc",
	"0x431d67c49c100d4c",
	"0x4cc5d4becb3e42b6",
	"0x597f299cfc657e2a",
	"0x5fcb6fab3ad6faec",
	"0x6c44198c4a475817"
].map((n) => BigInt(n)));
K512[0];
K512[1];
/**
* SHA2-256 hash function from RFC 4634. In JS it's the fastest: even faster than Blake3. Some info:
*
* - Trying 2^128 hashes would get 50% chance of collision, using birthday attack.
* - BTC network is doing 2^70 hashes/sec (2^95 hashes/year) as per 2025.
* - Each sha256 hash is executing 2^18 bit operations.
* - Good 2024 ASICs can do 200Th/sec with 3500 watts of power, corresponding to 2^36 hashes/joule.
* @param msg - message bytes to hash
* @returns Digest bytes.
* @example
* Hash a message with SHA2-256.
* ```ts
* sha256(new Uint8Array([97, 98, 99]));
* ```
*/
var sha256 = /* @__PURE__ */ createHasher(() => new _SHA256(), /* @__PURE__ */ oidNist(1));
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/crypto/jwt.mjs
async function signJWT$1(payload, secret, expiresIn = 3600) {
	return await new SignJWT(payload).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime(Math.floor(Date.now() / 1e3) + expiresIn).sign(new TextEncoder().encode(secret));
}
async function verifyJWT$1(token, secret) {
	try {
		return (await jwtVerify(token, new TextEncoder().encode(secret))).payload;
	} catch {
		return null;
	}
}
var info = new Uint8Array([
	66,
	101,
	116,
	116,
	101,
	114,
	65,
	117,
	116,
	104,
	46,
	106,
	115,
	32,
	71,
	101,
	110,
	101,
	114,
	97,
	116,
	101,
	100,
	32,
	69,
	110,
	99,
	114,
	121,
	112,
	116,
	105,
	111,
	110,
	32,
	75,
	101,
	121
]);
var now = () => Date.now() / 1e3 | 0;
var alg = "dir";
var enc = "A256CBC-HS512";
function deriveEncryptionSecret(secret, salt) {
	return hkdf(sha256, new TextEncoder().encode(secret), new TextEncoder().encode(salt), info, 64);
}
function getCurrentSecret(secret) {
	if (typeof secret === "string") return secret;
	const value = secret.keys.get(secret.currentVersion);
	if (!value) throw new Error(`Secret version ${secret.currentVersion} not found in keys`);
	return value;
}
function getAllSecrets(secret) {
	if (typeof secret === "string") return [{
		version: 0,
		value: secret
	}];
	const result = [];
	for (const [version, value] of secret.keys) result.push({
		version,
		value
	});
	if (secret.legacySecret && !result.some((s) => s.value === secret.legacySecret)) result.push({
		version: -1,
		value: secret.legacySecret
	});
	return result;
}
async function symmetricEncodeJWT(payload, secret, salt, expiresIn = 3600) {
	const encryptionSecret = deriveEncryptionSecret(getCurrentSecret(secret), salt);
	const thumbprint = await calculateJwkThumbprint({
		kty: "oct",
		k: encode(encryptionSecret)
	}, "sha256");
	return await new EncryptJWT(payload).setProtectedHeader({
		alg,
		enc,
		kid: thumbprint
	}).setIssuedAt().setExpirationTime(now() + expiresIn).setJti(crypto.randomUUID()).encrypt(encryptionSecret);
}
var jwtDecryptOpts = {
	clockTolerance: 15,
	keyManagementAlgorithms: [alg],
	contentEncryptionAlgorithms: [enc, "A256GCM"]
};
async function symmetricDecodeJWT(token, secret, salt) {
	if (!token) return null;
	let hasKid = false;
	try {
		hasKid = decodeProtectedHeader(token).kid !== void 0;
	} catch {
		return null;
	}
	try {
		const secrets = getAllSecrets(secret);
		const { payload } = await jwtDecrypt(token, async (protectedHeader) => {
			const kid = protectedHeader.kid;
			if (kid !== void 0) {
				for (const s of secrets) {
					const encryptionSecret = deriveEncryptionSecret(s.value, salt);
					if (kid === await calculateJwkThumbprint({
						kty: "oct",
						k: encode(encryptionSecret)
					}, "sha256")) return encryptionSecret;
				}
				throw new Error("no matching decryption secret");
			}
			if (secrets.length === 1) return deriveEncryptionSecret(secrets[0].value, salt);
			return deriveEncryptionSecret(secrets[0].value, salt);
		}, jwtDecryptOpts);
		return payload;
	} catch {
		if (hasKid) return null;
		const secrets = getAllSecrets(secret);
		if (secrets.length <= 1) return null;
		for (let i = 1; i < secrets.length; i++) try {
			const s = secrets[i];
			const { payload } = await jwtDecrypt(token, deriveEncryptionSecret(s.value, salt), jwtDecryptOpts);
			return payload;
		} catch {
			continue;
		}
		return null;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/password.node.mjs
var config = {
	N: 16384,
	r: 16,
	p: 1,
	dkLen: 64
};
function generateKey(password, salt) {
	return new Promise((resolve, reject) => {
		scrypt(password.normalize("NFKC"), salt, config.dkLen, {
			N: config.N,
			r: config.r,
			p: config.p,
			maxmem: 128 * config.N * config.r * 2
		}, (err, key) => {
			if (err) reject(err);
			else resolve(key);
		});
	});
}
async function hashPassword(password) {
	const salt = randomBytes(16).toString("hex");
	return `${salt}:${(await generateKey(password, salt)).toString("hex")}`;
}
async function verifyPassword$2(hash, password) {
	const [salt, key] = hash.split(":");
	if (!salt || !key) throw new Error("Invalid password hash");
	return (await generateKey(password, salt)).toString("hex") === key;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/crypto/password.mjs
/**
* `@better-auth/utils/password` uses the "node" export condition in package.json
* to automatically pick the right implementation:
*   - Node.js / Bun / Deno → `node:crypto scrypt` (libuv thread pool, non-blocking)
*   - Unsupported runtimes → `@noble/hashes scrypt` (pure JS fallback)
*/
var hashPassword$1 = hashPassword;
var verifyPassword$1 = async ({ hash, password }) => {
	return verifyPassword$2(hash, password);
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/index.mjs
function getWebcryptoSubtle() {
	const cr = typeof globalThis !== "undefined" && globalThis.crypto;
	if (cr && typeof cr.subtle === "object" && cr.subtle != null) return cr.subtle;
	throw new Error("crypto.subtle must be defined");
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/base64.mjs
function getAlphabet(urlSafe) {
	return urlSafe ? "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_" : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
}
function base64Encode(data, alphabet, padding) {
	let result = "";
	let buffer = 0;
	let shift = 0;
	for (const byte of data) {
		buffer = buffer << 8 | byte;
		shift += 8;
		while (shift >= 6) {
			shift -= 6;
			result += alphabet[buffer >> shift & 63];
		}
	}
	if (shift > 0) result += alphabet[buffer << 6 - shift & 63];
	if (padding) {
		const padCount = (4 - result.length % 4) % 4;
		result += "=".repeat(padCount);
	}
	return result;
}
function base64Decode(data, alphabet) {
	const decodeMap = /* @__PURE__ */ new Map();
	for (let i = 0; i < alphabet.length; i++) decodeMap.set(alphabet[i], i);
	const result = [];
	let buffer = 0;
	let bitsCollected = 0;
	for (const char of data) {
		if (char === "=") break;
		const value = decodeMap.get(char);
		if (value === void 0) throw new Error(`Invalid Base64 character: ${char}`);
		buffer = buffer << 6 | value;
		bitsCollected += 6;
		if (bitsCollected >= 8) {
			bitsCollected -= 8;
			result.push(buffer >> bitsCollected & 255);
		}
	}
	return Uint8Array.from(result);
}
var base64 = {
	encode(data, options = {}) {
		const alphabet = getAlphabet(false);
		return base64Encode(typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data), alphabet, options.padding ?? true);
	},
	decode(data) {
		if (typeof data !== "string") data = new TextDecoder().decode(data);
		const alphabet = getAlphabet(data.includes("-") || data.includes("_"));
		return base64Decode(data, alphabet);
	}
};
var base64Url = {
	encode(data, options = {}) {
		const alphabet = getAlphabet(true);
		return base64Encode(typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data), alphabet, options.padding ?? true);
	},
	decode(data) {
		return base64Decode(data, getAlphabet(data.includes("-") || data.includes("_")));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/hash.mjs
function createHash$1(algorithm, encoding) {
	return { digest: async (input) => {
		const encoder = new TextEncoder();
		const data = typeof input === "string" ? encoder.encode(input) : input;
		const hashBuffer = await getWebcryptoSubtle().digest(algorithm, data);
		if (encoding === "hex") return Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, "0")).join("");
		if (encoding === "base64" || encoding === "base64url" || encoding === "base64urlnopad") {
			if (encoding.includes("url")) return base64Url.encode(hashBuffer, { padding: encoding !== "base64urlnopad" });
			return base64.encode(hashBuffer);
		}
		return hashBuffer;
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/@noble+ciphers@2.2.0/node_modules/@noble/ciphers/utils.js
/**
* Utilities for hex, bytes, CSPRNG.
* @module
*/
/*! noble-ciphers - MIT License (c) 2023 Paul Miller (paulmillr.com) */
/**
* Checks if something is Uint8Array. Be careful: nodejs Buffer will return true.
* @param a - Value to inspect.
* @returns `true` when the value is a Uint8Array view, including Node's `Buffer`.
* @example
* Guards a value before treating it as raw key material.
*
* ```ts
* isBytes(new Uint8Array());
* ```
*/
function isBytes(a) {
	return a instanceof Uint8Array || ArrayBuffer.isView(a) && a.constructor.name === "Uint8Array" && "BYTES_PER_ELEMENT" in a && a.BYTES_PER_ELEMENT === 1;
}
/**
* Asserts something is boolean.
* @param b - Value to validate.
* @throws On wrong argument types. {@link TypeError}
* @example
* Validates a boolean option before branching on it.
*
* ```ts
* abool(true);
* ```
*/
function abool(b) {
	if (typeof b !== "boolean") throw new TypeError(`boolean expected, not ${b}`);
}
/**
* Asserts something is a non-negative safe integer.
* @param n - Value to validate.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Validates a non-negative length or counter.
*
* ```ts
* anumber(1);
* ```
*/
function anumber(n) {
	if (typeof n !== "number") throw new TypeError("number expected, got " + typeof n);
	if (!Number.isSafeInteger(n) || n < 0) throw new RangeError("positive integer expected, got " + n);
}
/**
* Asserts something is Uint8Array.
* @param value - Value to validate.
* @param length - Expected byte length.
* @param title - Optional label used in error messages.
* @returns The validated byte array.
* On Node, `Buffer` is accepted too because it is a Uint8Array view.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument lengths. {@link RangeError}
* @example
* Validates a fixed-length nonce or key buffer.
*
* ```ts
* abytes(new Uint8Array([1, 2]), 2);
* ```
*/
function abytes(value, length, title = "") {
	const bytes = isBytes(value);
	const len = value?.length;
	const needsLen = length !== void 0;
	if (!bytes || needsLen && len !== length) {
		const prefix = title && `"${title}" `;
		const ofLen = needsLen ? ` of length ${length}` : "";
		const got = bytes ? `length=${len}` : `type=${typeof value}`;
		const message = prefix + "expected Uint8Array" + ofLen + ", got " + got;
		if (!bytes) throw new TypeError(message);
		throw new RangeError(message);
	}
	return value;
}
/**
* Asserts a hash- or MAC-like instance has not been destroyed or finished.
* @param instance - Stateful instance to validate.
* @param checkFinished - Whether to reject finished instances.
* When `false`, only `destroyed` is checked.
* @throws If the hash instance has already been destroyed or finalized. {@link Error}
* @example
* Guards against calling `update()` or `digest()` on a finished hash.
*
* ```ts
* aexists({ destroyed: false, finished: false });
* ```
*/
function aexists(instance, checkFinished = true) {
	if (instance.destroyed) throw new Error("Hash instance has been destroyed");
	if (checkFinished && instance.finished) throw new Error("Hash#digest() has already been called");
}
/**
* Asserts output is a properly-sized byte array.
* @param out - Output buffer to validate.
* @param instance - Hash-like instance providing `outputLen`.
* This is the relaxed `digestInto()`-style contract: output must be at least `outputLen`,
* unlike one-shot cipher helpers elsewhere in the repo that often require exact lengths.
* @throws On wrong argument types. {@link TypeError}
* @param onlyAligned - Whether `out` must be 4-byte aligned for zero-allocation word views.
* @throws On wrong output buffer lengths. {@link RangeError}
* @throws On wrong output buffer alignment. {@link Error}
* @example
* Verifies that a caller-provided output buffer is large enough.
*
* ```ts
* aoutput(new Uint8Array(16), { outputLen: 16 });
* ```
*/
function aoutput(out, instance, onlyAligned = false) {
	abytes(out, void 0, "output");
	const min = instance.outputLen;
	if (out.length < min) throw new RangeError("digestInto() expects output buffer of length at least " + min);
	if (onlyAligned && !isAligned32(out)) throw new Error("invalid output, must be aligned");
}
/**
* Casts a typed-array view to Uint32Array.
* @param arr - Typed-array view to reinterpret.
* @returns Uint32Array view over the same bytes. Callers are expected to provide a
* 4-byte-aligned offset; trailing `1..3` bytes are silently dropped.
* @example
* Views a byte buffer as 32-bit words for block processing.
*
* ```ts
* u32(new Uint8Array(4));
* ```
*/
function u32(arr) {
	return new Uint32Array(arr.buffer, arr.byteOffset, Math.floor(arr.byteLength / 4));
}
/**
* Zeroizes typed arrays in place.
* Warning: JS provides no guarantees.
* @param arrays - Arrays to wipe.
* @example
* Wipes a temporary key buffer after use.
*
* ```ts
* const bytes = new Uint8Array([1]);
* clean(bytes);
* ```
*/
function clean(...arrays) {
	for (let i = 0; i < arrays.length; i++) arrays[i].fill(0);
}
/**
* Creates a DataView for byte-level manipulation.
* @param arr - Typed-array view to wrap.
* @returns DataView over the same bytes.
* @example
* Creates an endian-aware view for length encoding.
*
* ```ts
* createView(new Uint8Array(4));
* ```
*/
function createView(arr) {
	return new DataView(arr.buffer, arr.byteOffset, arr.byteLength);
}
/**
* Whether the current platform is little-endian.
* Most are; some IBM systems are not.
*/
var isLE = new Uint8Array(new Uint32Array([287454020]).buffer)[0] === 68;
/**
* Reverses byte order of one 32-bit word.
* @param word - Unsigned 32-bit word to swap.
* @returns The same word with bytes reversed.
* @example
* Swaps a big-endian word into little-endian byte order.
*
* ```ts
* byteSwap(0x11223344);
* ```
*/
var byteSwap = (word) => word << 24 & 4278190080 | word << 8 & 16711680 | word >>> 8 & 65280 | word >>> 24 & 255;
/**
* Normalizes one 32-bit word to the little-endian representation expected by cipher cores.
* @param n - Unsigned 32-bit word to normalize.
* @returns Little-endian normalized word on big-endian hosts, else the input word unchanged.
* @example
* Normalizes a host-endian word before passing it into an ARX/AES core.
*
* ```ts
* swap8IfBE(0x11223344);
* ```
*/
var swap8IfBE = isLE ? (n) => n : (n) => byteSwap(n) >>> 0;
/**
* Byte-swaps every word of a Uint32Array in place.
* @param arr - Uint32Array whose words should be swapped.
* @returns The same array after in-place byte swapping.
* @example
* Swaps every 32-bit word in a word-view buffer.
*
* ```ts
* byteSwap32(new Uint32Array([0x11223344]));
* ```
*/
var byteSwap32 = (arr) => {
	for (let i = 0; i < arr.length; i++) arr[i] = byteSwap(arr[i]);
	return arr;
};
/**
* Normalizes a Uint32Array view to the little-endian representation expected by cipher cores.
* @param u - Word view to normalize in place.
* @returns Little-endian normalized word view.
* @example
* Normalizes a word-view buffer before block processing.
*
* ```ts
* swap32IfBE(new Uint32Array([0x11223344]));
* ```
*/
var swap32IfBE = isLE ? (u) => u : byteSwap32;
var hasHexBuiltin = typeof Uint8Array.from([]).toHex === "function" && typeof Uint8Array.fromHex === "function";
var hexes = /* @__PURE__ */ Array.from({ length: 256 }, (_, i) => i.toString(16).padStart(2, "0"));
/**
* Convert byte array to hex string. Uses built-in function, when available.
* @param bytes - Bytes to encode.
* @returns Lowercase hexadecimal string.
* @throws On wrong argument types. {@link TypeError}
* @example
* Formats ciphertext bytes for logs or test vectors.
*
* ```ts
* bytesToHex(Uint8Array.from([0xca, 0xfe, 0x01, 0x23])); // 'cafe0123'
* ```
*/
function bytesToHex(bytes) {
	abytes(bytes);
	if (hasHexBuiltin) return bytes.toHex();
	let hex = "";
	for (let i = 0; i < bytes.length; i++) hex += hexes[bytes[i]];
	return hex;
}
var asciis = {
	_0: 48,
	_9: 57,
	A: 65,
	F: 70,
	a: 97,
	f: 102
};
function asciiToBase16(ch) {
	if (ch >= asciis._0 && ch <= asciis._9) return ch - asciis._0;
	if (ch >= asciis.A && ch <= asciis.F) return ch - (asciis.A - 10);
	if (ch >= asciis.a && ch <= asciis.f) return ch - (asciis.a - 10);
}
/**
* Convert hex string to byte array. Uses built-in function, when available.
* @param hex - Hexadecimal string to decode.
* @returns Decoded bytes.
* @throws On wrong argument types. {@link TypeError}
* @throws On malformed hexadecimal input. {@link RangeError}
* @example
* Parses a hex test vector into bytes.
*
* ```ts
* hexToBytes('cafe0123'); // Uint8Array.from([0xca, 0xfe, 0x01, 0x23])
* ```
*/
function hexToBytes(hex) {
	if (typeof hex !== "string") throw new TypeError("hex string expected, got " + typeof hex);
	if (hasHexBuiltin) try {
		return Uint8Array.fromHex(hex);
	} catch (error) {
		if (error instanceof SyntaxError) throw new RangeError(error.message);
		throw error;
	}
	const hl = hex.length;
	const al = hl / 2;
	if (hl % 2) throw new RangeError("hex string expected, got unpadded hex of length " + hl);
	const array = new Uint8Array(al);
	for (let ai = 0, hi = 0; ai < al; ai++, hi += 2) {
		const n1 = asciiToBase16(hex.charCodeAt(hi));
		const n2 = asciiToBase16(hex.charCodeAt(hi + 1));
		if (n1 === void 0 || n2 === void 0) {
			const char = hex[hi] + hex[hi + 1];
			throw new RangeError("hex string expected, got non-hex character \"" + char + "\" at index " + hi);
		}
		array[ai] = n1 * 16 + n2;
	}
	return array;
}
/**
* Converts string to bytes using UTF8 encoding.
* @param str - String to encode.
* @returns UTF-8 bytes in a detached fresh Uint8Array copy.
* @throws On wrong argument types. {@link TypeError}
* @example
* Encodes application text before encryption or MACing.
*
* ```ts
* utf8ToBytes('abc'); // new Uint8Array([97, 98, 99])
* ```
*/
function utf8ToBytes(str) {
	if (typeof str !== "string") throw new TypeError("string expected");
	return new Uint8Array(new TextEncoder().encode(str));
}
/**
* Checks if two U8A use same underlying buffer and overlaps.
* This is invalid and can corrupt data.
* @param a - First byte view.
* @param b - Second byte view.
* @returns `true` when the views overlap in memory.
* @example
* Detects whether two slices alias the same backing buffer.
*
* ```ts
* overlapBytes(new Uint8Array(4), new Uint8Array(4));
* ```
*/
function overlapBytes(a, b) {
	if (!a.byteLength || !b.byteLength) return false;
	return a.buffer === b.buffer && a.byteOffset < b.byteOffset + b.byteLength && b.byteOffset < a.byteOffset + a.byteLength;
}
/**
* Copies several Uint8Arrays into one.
* @param arrays - Byte arrays to concatenate.
* @returns Combined byte array.
* @throws On wrong argument types inside the byte-array list. {@link TypeError}
* @example
* Builds a `nonce || ciphertext` style buffer.
*
* ```ts
* concatBytes(new Uint8Array([1]), new Uint8Array([2]));
* ```
*/
function concatBytes(...arrays) {
	let sum = 0;
	for (let i = 0; i < arrays.length; i++) {
		const a = arrays[i];
		abytes(a);
		sum += a.length;
	}
	const res = new Uint8Array(sum);
	for (let i = 0, pad = 0; i < arrays.length; i++) {
		const a = arrays[i];
		res.set(a, pad);
		pad += a.length;
	}
	return res;
}
/**
* Merges user options into defaults.
* @param defaults - Default option values.
* @param opts - User-provided overrides.
* @returns Combined options object.
* The merge mutates `defaults` in place and returns the same object.
* @throws If options are missing or not an object. {@link Error}
* @example
* Applies user overrides to the default cipher options.
*
* ```ts
* checkOpts({ rounds: 20 }, { rounds: 8 });
* ```
*/
function checkOpts(defaults, opts) {
	if (opts == null || typeof opts !== "object") throw new Error("options must be defined");
	return Object.assign(defaults, opts);
}
/**
* Compares two byte arrays in kinda constant time once lengths already match.
* @param a - First byte array.
* @param b - Second byte array.
* @returns `true` when the arrays contain the same bytes. Different lengths still return early.
* @example
* Compares an expected authentication tag with the received one.
*
* ```ts
* equalBytes(new Uint8Array([1]), new Uint8Array([1]));
* ```
*/
function equalBytes(a, b) {
	if (a.length !== b.length) return false;
	let diff = 0;
	for (let i = 0; i < a.length; i++) diff |= a[i] ^ b[i];
	return diff === 0;
}
/**
* Wraps a keyed MAC constructor into a one-shot helper with `.create()`.
* @param keyLen - Valid probe-key length used to read static metadata once.
* The probe key is only used for `outputLen` / `blockLen`, so callers with several valid key sizes
* can pass any representative size as long as those values stay fixed.
* @param macCons - Keyed MAC constructor or factory.
* @param fromMsg - Optional adapter that derives extra constructor args from the one-shot message.
* @returns Callable MAC helper with `.create()`.
*/
function wrapMacConstructor(keyLen, macCons, fromMsg) {
	const mac = macCons;
	const getArgs = fromMsg || (() => []);
	const macC = (msg, key) => mac(key, ...getArgs(msg)).update(msg).digest();
	const tmp = mac(new Uint8Array(keyLen), ...getArgs(new Uint8Array(0)));
	macC.outputLen = tmp.outputLen;
	macC.blockLen = tmp.blockLen;
	macC.create = (key, ...args) => mac(key, ...args);
	return macC;
}
/**
* Wraps a cipher: validates args, ensures encrypt() can only be called once.
* Used internally by the exported cipher constructors.
* Output-buffer support is inferred from the wrapped `encrypt` / `decrypt`
* arity (`fn.length === 2`), and tag-bearing constructors are expected to use
* `args[1]` for optional AAD.
* @__NO_SIDE_EFFECTS__
* @param params - Static cipher metadata. See {@link CipherParams}.
* @param constructor - Cipher constructor.
* @returns Wrapped constructor with validation.
*/
var wrapCipher = (params, constructor) => {
	function wrappedCipher(key, ...args) {
		abytes(key, void 0, "key");
		if (params.nonceLength !== void 0) {
			const nonce = args[0];
			abytes(nonce, params.varSizeNonce ? void 0 : params.nonceLength, "nonce");
		}
		const tagl = params.tagLength;
		if (tagl && args[1] !== void 0) abytes(args[1], void 0, "AAD");
		const cipher = constructor(key, ...args);
		const checkOutput = (fnLength, output) => {
			if (output !== void 0) {
				if (fnLength !== 2) throw new Error("cipher output not supported");
				abytes(output, void 0, "output");
			}
		};
		let called = false;
		return {
			encrypt(data, output) {
				if (called) throw new Error("cannot encrypt() twice with same key + nonce");
				called = true;
				abytes(data);
				checkOutput(cipher.encrypt.length, output);
				return cipher.encrypt(data, output);
			},
			decrypt(data, output) {
				abytes(data);
				if (tagl && data.length < tagl) throw new Error("\"ciphertext\" expected length bigger than tagLength=" + tagl);
				checkOutput(cipher.decrypt.length, output);
				return cipher.decrypt(data, output);
			}
		};
	}
	Object.assign(wrappedCipher, params);
	return wrappedCipher;
};
/**
* By default, returns u8a of length.
* When out is available, it checks it for validity and uses it.
* @param expectedLength - Required output length.
* @param out - Optional destination buffer.
* @param onlyAligned - Whether `out` must be 4-byte aligned.
* @returns Output buffer ready for writing.
* @throws On wrong argument types. {@link TypeError}
* @throws If the provided output buffer has the wrong size or alignment. {@link Error}
* @example
* Reuses a caller-provided output buffer when lengths match.
*
* ```ts
* getOutput(16, new Uint8Array(16));
* ```
*/
function getOutput(expectedLength, out, onlyAligned = true) {
	if (out === void 0) return new Uint8Array(expectedLength);
	abytes(out, void 0, "output");
	if (out.length !== expectedLength) throw new Error("\"output\" expected Uint8Array of length " + expectedLength + ", got: " + out.length);
	if (onlyAligned && !isAligned32(out)) throw new Error("invalid output, must be aligned");
	return out;
}
/**
* Encodes data and AAD bit lengths into a 16-byte buffer.
* @param dataLength - Data length in bits.
* @param aadLength - AAD length in bits.
* The serialized block is still `aadLength || dataLength`, matching GCM/Poly1305
* conventions even though the helper parameter order is `(dataLength, aadLength)`.
* @param isLE - Whether to encode lengths as little-endian.
* @returns 16-byte length block.
* @throws On wrong argument types passed to the endian validator. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @example
* Builds the length block appended by GCM and Poly1305.
*
* ```ts
* u64Lengths(16, 8, true);
* ```
*/
function u64Lengths(dataLength, aadLength, isLE) {
	anumber(dataLength);
	anumber(aadLength);
	abool(isLE);
	const num = new Uint8Array(16);
	const view = createView(num);
	view.setBigUint64(0, BigInt(aadLength), isLE);
	view.setBigUint64(8, BigInt(dataLength), isLE);
	return num;
}
/**
* Checks whether a byte array is aligned to a 4-byte offset.
* @param bytes - Byte array to inspect.
* @returns `true` when the view is 4-byte aligned.
* @example
* Checks whether a buffer can be safely viewed as Uint32Array.
*
* ```ts
* isAligned32(new Uint8Array(4));
* ```
*/
function isAligned32(bytes) {
	return bytes.byteOffset % 4 === 0;
}
/**
* Copies bytes into a new Uint8Array.
* @param bytes - Bytes to copy.
* @returns Copied byte array.
* @throws On wrong argument types. {@link TypeError}
* @example
* Copies input into an aligned Uint8Array before block processing.
*
* ```ts
* copyBytes(new Uint8Array([1, 2]));
* ```
*/
function copyBytes(bytes) {
	return Uint8Array.from(abytes(bytes));
}
/**
* Cryptographically secure PRNG.
* Uses internal OS-level `crypto.getRandomValues`.
* @param bytesLength - Number of bytes to produce.
* Validation is delegated to `Uint8Array(bytesLength)` and `getRandomValues`, so
* non-integers, negative lengths, and oversize requests surface backend/runtime errors.
* @returns Random byte array.
* @throws On wrong argument types. {@link TypeError}
* @throws On wrong argument ranges or values. {@link RangeError}
* @throws If the runtime does not expose `crypto.getRandomValues`. {@link Error}
* @example
* Generates a fresh nonce or key.
*
* ```ts
* randomBytes(16);
* ```
*/
function randomBytes$1(bytesLength = 32) {
	anumber(bytesLength);
	const cr = typeof globalThis === "object" ? globalThis.crypto : null;
	if (typeof cr?.getRandomValues !== "function") throw new Error("crypto.getRandomValues must be defined");
	return cr.getRandomValues(new Uint8Array(bytesLength));
}
/**
* Uses CSPRNG for nonce, nonce injected in ciphertext.
* For `encrypt`, a `nonceBytes`-length buffer is fetched from CSPRNG and
* prepended to encrypted ciphertext. For `decrypt`, first `nonceBytes` of ciphertext
* are treated as nonce. The wrapper always allocates a fresh `nonce || ciphertext`
* buffer on encrypt and intentionally does not support caller-provided destination buffers.
* Too-short decrypt inputs are split into short/empty nonce views and then delegated
* to the wrapped cipher instead of being rejected here first.
*
* NOTE: Under the same key, using random nonces (e.g. `managedNonce`) with AES-GCM and ChaCha
* should be limited to `2**23` (8M) messages to get a collision chance of
* `2**-50`. Stretching to `2**32` (4B) messages would raise that chance to
* `2**-33`, still negligible but creeping up.
* @param fn - Cipher constructor that expects a nonce.
* @param randomBytes_ - Random-byte source used for nonce generation.
* @returns Cipher constructor that prepends the nonce to ciphertext.
* @throws On wrong argument types. {@link TypeError}
* @throws On invalid nonce lengths observed at wrapper construction or use. {@link RangeError}
* @example
* Prepends a fresh random nonce to every ciphertext.
*
* ```ts
* import { gcm } from '@noble/ciphers/aes.js';
* import { managedNonce, randomBytes } from '@noble/ciphers/utils.js';
* const wrapped = managedNonce(gcm);
* const key = randomBytes(16);
* const ciphertext = wrapped(key).encrypt(new Uint8Array([1, 2, 3]));
* wrapped(key).decrypt(ciphertext);
* ```
*/
function managedNonce(fn, randomBytes_ = randomBytes$1) {
	const { nonceLength } = fn;
	anumber(nonceLength);
	const addNonce = (nonce, ciphertext, plaintext) => {
		const out = concatBytes(nonce, ciphertext);
		if (!overlapBytes(plaintext, ciphertext)) ciphertext.fill(0);
		return out;
	};
	const res = ((key, ...args) => ({
		encrypt(plaintext) {
			abytes(plaintext);
			const nonce = randomBytes_(nonceLength);
			const encrypted = fn(key, nonce, ...args).encrypt(plaintext);
			if (encrypted instanceof Promise) return encrypted.then((ct) => addNonce(nonce, ct, plaintext));
			return addNonce(nonce, encrypted, plaintext);
		},
		decrypt(ciphertext) {
			abytes(ciphertext);
			const nonce = ciphertext.subarray(0, nonceLength);
			const decrypted = ciphertext.subarray(nonceLength);
			return fn(key, nonce, ...args).decrypt(decrypted);
		}
	}));
	if ("blockSize" in fn) res.blockSize = fn.blockSize;
	if ("tagLength" in fn) res.tagLength = fn.tagLength;
	return res;
}
//#endregion
//#region ../../node_modules/.pnpm/@noble+ciphers@2.2.0/node_modules/@noble/ciphers/_arx.js
/**
* Basic utils for ARX (add-rotate-xor) salsa and chacha ciphers.

RFC8439 requires multi-step cipher stream, where
authKey starts with counter: 0, actual msg with counter: 1.

For this, we need a way to re-use nonce / counter:

const counter = new Uint8Array(4);
chacha(..., counter, ...); // counter is now 1
chacha(..., counter, ...); // counter is now 2

This is complicated:

- 32-bit counters are enough, no need for 64-bit: max ArrayBuffer size in JS is 4GB
- Original papers don't allow mutating counters
- Counter overflow is undefined [^1]
- Idea A: allow providing (nonce | counter) instead of just nonce, re-use it
- Caveat: Cannot be re-used through all cases:
- * chacha has (counter | nonce)
- * xchacha has (nonce16 | counter | nonce16)
- Idea B: separate nonce / counter and provide separate API for counter re-use
- Caveat: there are different counter sizes depending on an algorithm.
- salsa & chacha also differ in structures of key & sigma:
salsa20:      s[0] | k(4) | s[1] | nonce(2) | cnt(2) | s[2] | k(4) | s[3]
chacha:       s(4) | k(8) | cnt(1) | nonce(3)
chacha20orig: s(4) | k(8) | cnt(2) | nonce(2)
- Idea C: helper method such as `setSalsaState(key, nonce, sigma, data)`
- Caveat: we can't re-use counter array

xchacha uses the subkey and remaining 8 byte nonce with ChaCha20 as normal
(prefixed by 4 NUL bytes, since RFC8439 specifies a 12-byte nonce).
Counter overflow is undefined; see {@link https://mailarchive.ietf.org/arch/msg/cfrg/gsOnTJzcbgG6OqD8Sc0GO5aR_tU/ | the CFRG thread}.
Current noble policy is strict non-wrap for the shared 32-bit counter path:
exported ARX ciphers reject initial `0xffffffff` and stop before any implicit
wrap back to zero.
See {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha#appendix-A.2 | the XChaCha appendix} for the extended-nonce construction.

* @module
*/
var encodeStr = (str) => Uint8Array.from(str.split(""), (c) => c.charCodeAt(0));
var sigma16_32 = swap32IfBE(u32(encodeStr("expand 16-byte k")));
var sigma32_32 = swap32IfBE(u32(encodeStr("expand 32-byte k")));
/**
* Rotates a 32-bit word left.
* @param a - Input word.
* @param b - Rotation count in bits.
* @returns Rotated 32-bit word.
* @example
* Moves the top byte of `0x12345678` into the low byte position.
* ```ts
* rotl(0x12345678, 8);
* ```
*/
function rotl(a, b) {
	return a << b | a >>> 32 - b;
}
var BLOCK_LEN = 64;
var BLOCK_LEN32 = 16;
var MAX_COUNTER = 2 ** 32 - 1;
var U32_EMPTY = /* @__PURE__ */ Uint32Array.of();
function runCipher(core, sigma, key, nonce, data, output, counter, rounds) {
	const len = data.length;
	const block = new Uint8Array(BLOCK_LEN);
	const b32 = u32(block);
	const isAligned = isLE && isAligned32(data) && isAligned32(output);
	const d32 = isAligned ? u32(data) : U32_EMPTY;
	const o32 = isAligned ? u32(output) : U32_EMPTY;
	if (!isLE) {
		for (let pos = 0; pos < len; counter++) {
			core(sigma, key, nonce, b32, counter, rounds);
			swap32IfBE(b32);
			if (counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
			const take = Math.min(BLOCK_LEN, len - pos);
			for (let j = 0, posj; j < take; j++) {
				posj = pos + j;
				output[posj] = data[posj] ^ block[j];
			}
			pos += take;
		}
		return;
	}
	for (let pos = 0; pos < len; counter++) {
		core(sigma, key, nonce, b32, counter, rounds);
		if (counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
		const take = Math.min(BLOCK_LEN, len - pos);
		if (isAligned && take === BLOCK_LEN) {
			const pos32 = pos / 4;
			if (pos % 4 !== 0) throw new Error("arx: invalid block position");
			for (let j = 0, posj; j < BLOCK_LEN32; j++) {
				posj = pos32 + j;
				o32[posj] = d32[posj] ^ b32[j];
			}
			pos += BLOCK_LEN;
			continue;
		}
		for (let j = 0, posj; j < take; j++) {
			posj = pos + j;
			output[posj] = data[posj] ^ block[j];
		}
		pos += take;
	}
}
/**
* Creates an ARX stream cipher from a 32-bit core permutation.
* Used internally to build the exported Salsa and ChaCha stream ciphers.
* @param core - Core function that fills one keystream block.
* @param opts - Cipher layout and nonce-extension options. See {@link CipherOpts}.
* @returns Stream cipher function over byte arrays.
* @throws If the core callback, key size, counter, or output sizing is invalid. {@link Error}
*/
function createCipher(core, opts) {
	const { allowShortKeys, extendNonceFn, counterLength, counterRight, rounds } = checkOpts({
		allowShortKeys: false,
		counterLength: 8,
		counterRight: false,
		rounds: 20
	}, opts);
	if (typeof core !== "function") throw new Error("core must be a function");
	anumber(counterLength);
	anumber(rounds);
	abool(counterRight);
	abool(allowShortKeys);
	return (key, nonce, data, output, counter = 0) => {
		abytes(key, void 0, "key");
		abytes(nonce, void 0, "nonce");
		abytes(data, void 0, "data");
		const len = data.length;
		output = getOutput(len, output, false);
		anumber(counter);
		if (counter < 0 || counter >= MAX_COUNTER) throw new Error("arx: counter overflow");
		const toClean = [];
		let l = key.length;
		let k;
		let sigma;
		if (l === 32) {
			toClean.push(k = copyBytes(key));
			sigma = sigma32_32;
		} else if (l === 16 && allowShortKeys) {
			k = new Uint8Array(32);
			k.set(key);
			k.set(key, 16);
			sigma = sigma16_32;
			toClean.push(k);
		} else {
			abytes(key, 32, "arx key");
			throw new Error("invalid key size");
		}
		if (!isLE || !isAligned32(nonce)) toClean.push(nonce = copyBytes(nonce));
		let k32 = u32(k);
		if (extendNonceFn) {
			if (nonce.length !== 24) throw new Error(`arx: extended nonce must be 24 bytes`);
			const n16 = nonce.subarray(0, 16);
			if (isLE) extendNonceFn(sigma, k32, u32(n16), k32);
			else {
				const sigmaRaw = swap32IfBE(Uint32Array.from(sigma));
				extendNonceFn(sigmaRaw, k32, u32(n16), k32);
				clean(sigmaRaw);
				swap32IfBE(k32);
			}
			nonce = nonce.subarray(16);
		} else if (!isLE) swap32IfBE(k32);
		const nonceNcLen = 16 - counterLength;
		if (nonceNcLen !== nonce.length) throw new Error(`arx: nonce must be ${nonceNcLen} or 16 bytes`);
		if (nonceNcLen !== 12) {
			const nc = new Uint8Array(12);
			nc.set(nonce, counterRight ? 0 : 12 - nonce.length);
			nonce = nc;
			toClean.push(nonce);
		}
		const n32 = swap32IfBE(u32(nonce));
		try {
			runCipher(core, sigma, k32, n32, data, output, counter, rounds);
			return output;
		} finally {
			clean(...toClean);
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@noble+ciphers@2.2.0/node_modules/@noble/ciphers/_poly1305.js
/**
* Poly1305 ({@link https://cr.yp.to/mac/poly1305-20050329.pdf | PDF},
* {@link https://en.wikipedia.org/wiki/Poly1305 | wiki})
* is a fast and parallel secret-key message-authentication code suitable for
* a wide variety of applications. It was standardized in
* {@link https://www.rfc-editor.org/rfc/rfc8439 | RFC 8439} and is now used in TLS 1.3.
*
* Polynomial MACs are not perfect for every situation:
* they lack Random Key Robustness: the MAC can be forged, and can't be used in PAKE schemes.
* See {@link https://keymaterial.net/2020/09/07/invisible-salamanders-in-aes-gcm-siv/ | the invisible salamanders attack writeup}.
* To combat invisible salamanders, `hash(key)` can be included in ciphertext,
* however, this would violate ciphertext indistinguishability:
* an attacker would know which key was used - so `HKDF(key, i)`
* could be used instead.
*
* Check out the {@link https://cr.yp.to/mac.html | original website}.
* Based on public-domain {@link https://github.com/floodyberry/poly1305-donna | poly1305-donna}.
* @module
*/
function u8to16(a, i) {
	return a[i++] & 255 | (a[i++] & 255) << 8;
}
/**
* Incremental Poly1305 MAC state.
* Prefer `poly1305()` for one-shot use.
* @param key - 32-byte Poly1305 one-time key.
* @example
* Feeds one chunk into an incremental Poly1305 state with a fresh one-time key.
*
* ```ts
* import { Poly1305 } from '@noble/ciphers/_poly1305.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* const mac = new Poly1305(key);
* mac.update(new Uint8Array([1, 2, 3]));
* mac.digest();
* ```
*/
var Poly1305 = class {
	blockLen = 16;
	outputLen = 16;
	buffer = new Uint8Array(16);
	r = new Uint16Array(10);
	h = new Uint16Array(10);
	pad = new Uint16Array(8);
	pos = 0;
	finished = false;
	destroyed = false;
	constructor(key) {
		key = copyBytes(abytes(key, 32, "key"));
		const t0 = u8to16(key, 0);
		const t1 = u8to16(key, 2);
		const t2 = u8to16(key, 4);
		const t3 = u8to16(key, 6);
		const t4 = u8to16(key, 8);
		const t5 = u8to16(key, 10);
		const t6 = u8to16(key, 12);
		const t7 = u8to16(key, 14);
		this.r[0] = t0 & 8191;
		this.r[1] = (t0 >>> 13 | t1 << 3) & 8191;
		this.r[2] = (t1 >>> 10 | t2 << 6) & 7939;
		this.r[3] = (t2 >>> 7 | t3 << 9) & 8191;
		this.r[4] = (t3 >>> 4 | t4 << 12) & 255;
		this.r[5] = t4 >>> 1 & 8190;
		this.r[6] = (t4 >>> 14 | t5 << 2) & 8191;
		this.r[7] = (t5 >>> 11 | t6 << 5) & 8065;
		this.r[8] = (t6 >>> 8 | t7 << 8) & 8191;
		this.r[9] = t7 >>> 5 & 127;
		for (let i = 0; i < 8; i++) this.pad[i] = u8to16(key, 16 + 2 * i);
	}
	process(data, offset, isLast = false) {
		const hibit = isLast ? 0 : 2048;
		const { h, r } = this;
		const r0 = r[0];
		const r1 = r[1];
		const r2 = r[2];
		const r3 = r[3];
		const r4 = r[4];
		const r5 = r[5];
		const r6 = r[6];
		const r7 = r[7];
		const r8 = r[8];
		const r9 = r[9];
		const t0 = u8to16(data, offset + 0);
		const t1 = u8to16(data, offset + 2);
		const t2 = u8to16(data, offset + 4);
		const t3 = u8to16(data, offset + 6);
		const t4 = u8to16(data, offset + 8);
		const t5 = u8to16(data, offset + 10);
		const t6 = u8to16(data, offset + 12);
		const t7 = u8to16(data, offset + 14);
		let h0 = h[0] + (t0 & 8191);
		let h1 = h[1] + ((t0 >>> 13 | t1 << 3) & 8191);
		let h2 = h[2] + ((t1 >>> 10 | t2 << 6) & 8191);
		let h3 = h[3] + ((t2 >>> 7 | t3 << 9) & 8191);
		let h4 = h[4] + ((t3 >>> 4 | t4 << 12) & 8191);
		let h5 = h[5] + (t4 >>> 1 & 8191);
		let h6 = h[6] + ((t4 >>> 14 | t5 << 2) & 8191);
		let h7 = h[7] + ((t5 >>> 11 | t6 << 5) & 8191);
		let h8 = h[8] + ((t6 >>> 8 | t7 << 8) & 8191);
		let h9 = h[9] + (t7 >>> 5 | hibit);
		let c = 0;
		let d0 = c + h0 * r0 + h1 * (5 * r9) + h2 * (5 * r8) + h3 * (5 * r7) + h4 * (5 * r6);
		c = d0 >>> 13;
		d0 &= 8191;
		d0 += h5 * (5 * r5) + h6 * (5 * r4) + h7 * (5 * r3) + h8 * (5 * r2) + h9 * (5 * r1);
		c += d0 >>> 13;
		d0 &= 8191;
		let d1 = c + h0 * r1 + h1 * r0 + h2 * (5 * r9) + h3 * (5 * r8) + h4 * (5 * r7);
		c = d1 >>> 13;
		d1 &= 8191;
		d1 += h5 * (5 * r6) + h6 * (5 * r5) + h7 * (5 * r4) + h8 * (5 * r3) + h9 * (5 * r2);
		c += d1 >>> 13;
		d1 &= 8191;
		let d2 = c + h0 * r2 + h1 * r1 + h2 * r0 + h3 * (5 * r9) + h4 * (5 * r8);
		c = d2 >>> 13;
		d2 &= 8191;
		d2 += h5 * (5 * r7) + h6 * (5 * r6) + h7 * (5 * r5) + h8 * (5 * r4) + h9 * (5 * r3);
		c += d2 >>> 13;
		d2 &= 8191;
		let d3 = c + h0 * r3 + h1 * r2 + h2 * r1 + h3 * r0 + h4 * (5 * r9);
		c = d3 >>> 13;
		d3 &= 8191;
		d3 += h5 * (5 * r8) + h6 * (5 * r7) + h7 * (5 * r6) + h8 * (5 * r5) + h9 * (5 * r4);
		c += d3 >>> 13;
		d3 &= 8191;
		let d4 = c + h0 * r4 + h1 * r3 + h2 * r2 + h3 * r1 + h4 * r0;
		c = d4 >>> 13;
		d4 &= 8191;
		d4 += h5 * (5 * r9) + h6 * (5 * r8) + h7 * (5 * r7) + h8 * (5 * r6) + h9 * (5 * r5);
		c += d4 >>> 13;
		d4 &= 8191;
		let d5 = c + h0 * r5 + h1 * r4 + h2 * r3 + h3 * r2 + h4 * r1;
		c = d5 >>> 13;
		d5 &= 8191;
		d5 += h5 * r0 + h6 * (5 * r9) + h7 * (5 * r8) + h8 * (5 * r7) + h9 * (5 * r6);
		c += d5 >>> 13;
		d5 &= 8191;
		let d6 = c + h0 * r6 + h1 * r5 + h2 * r4 + h3 * r3 + h4 * r2;
		c = d6 >>> 13;
		d6 &= 8191;
		d6 += h5 * r1 + h6 * r0 + h7 * (5 * r9) + h8 * (5 * r8) + h9 * (5 * r7);
		c += d6 >>> 13;
		d6 &= 8191;
		let d7 = c + h0 * r7 + h1 * r6 + h2 * r5 + h3 * r4 + h4 * r3;
		c = d7 >>> 13;
		d7 &= 8191;
		d7 += h5 * r2 + h6 * r1 + h7 * r0 + h8 * (5 * r9) + h9 * (5 * r8);
		c += d7 >>> 13;
		d7 &= 8191;
		let d8 = c + h0 * r8 + h1 * r7 + h2 * r6 + h3 * r5 + h4 * r4;
		c = d8 >>> 13;
		d8 &= 8191;
		d8 += h5 * r3 + h6 * r2 + h7 * r1 + h8 * r0 + h9 * (5 * r9);
		c += d8 >>> 13;
		d8 &= 8191;
		let d9 = c + h0 * r9 + h1 * r8 + h2 * r7 + h3 * r6 + h4 * r5;
		c = d9 >>> 13;
		d9 &= 8191;
		d9 += h5 * r4 + h6 * r3 + h7 * r2 + h8 * r1 + h9 * r0;
		c += d9 >>> 13;
		d9 &= 8191;
		c = (c << 2) + c | 0;
		c = c + d0 | 0;
		d0 = c & 8191;
		c = c >>> 13;
		d1 += c;
		h[0] = d0;
		h[1] = d1;
		h[2] = d2;
		h[3] = d3;
		h[4] = d4;
		h[5] = d5;
		h[6] = d6;
		h[7] = d7;
		h[8] = d8;
		h[9] = d9;
	}
	finalize() {
		const { h, pad } = this;
		const g = new Uint16Array(10);
		let c = h[1] >>> 13;
		h[1] &= 8191;
		for (let i = 2; i < 10; i++) {
			h[i] += c;
			c = h[i] >>> 13;
			h[i] &= 8191;
		}
		h[0] += c * 5;
		c = h[0] >>> 13;
		h[0] &= 8191;
		h[1] += c;
		c = h[1] >>> 13;
		h[1] &= 8191;
		h[2] += c;
		g[0] = h[0] + 5;
		c = g[0] >>> 13;
		g[0] &= 8191;
		for (let i = 1; i < 10; i++) {
			g[i] = h[i] + c;
			c = g[i] >>> 13;
			g[i] &= 8191;
		}
		g[9] -= 8192;
		let mask = (c ^ 1) - 1;
		for (let i = 0; i < 10; i++) g[i] &= mask;
		mask = ~mask;
		for (let i = 0; i < 10; i++) h[i] = h[i] & mask | g[i];
		h[0] = (h[0] | h[1] << 13) & 65535;
		h[1] = (h[1] >>> 3 | h[2] << 10) & 65535;
		h[2] = (h[2] >>> 6 | h[3] << 7) & 65535;
		h[3] = (h[3] >>> 9 | h[4] << 4) & 65535;
		h[4] = (h[4] >>> 12 | h[5] << 1 | h[6] << 14) & 65535;
		h[5] = (h[6] >>> 2 | h[7] << 11) & 65535;
		h[6] = (h[7] >>> 5 | h[8] << 8) & 65535;
		h[7] = (h[8] >>> 8 | h[9] << 5) & 65535;
		let f = h[0] + pad[0];
		h[0] = f & 65535;
		for (let i = 1; i < 8; i++) {
			f = (h[i] + pad[i] | 0) + (f >>> 16) | 0;
			h[i] = f & 65535;
		}
		clean(g);
	}
	update(data) {
		aexists(this);
		abytes(data);
		data = copyBytes(data);
		const { buffer, blockLen } = this;
		const len = data.length;
		for (let pos = 0; pos < len;) {
			const take = Math.min(blockLen - this.pos, len - pos);
			if (take === blockLen) {
				for (; blockLen <= len - pos; pos += blockLen) this.process(data, pos);
				continue;
			}
			buffer.set(data.subarray(pos, pos + take), this.pos);
			this.pos += take;
			pos += take;
			if (this.pos === blockLen) {
				this.process(buffer, 0, false);
				this.pos = 0;
			}
		}
		return this;
	}
	destroy() {
		this.destroyed = true;
		clean(this.h, this.r, this.buffer, this.pad);
	}
	digestInto(out) {
		aexists(this);
		aoutput(out, this);
		this.finished = true;
		const { buffer, h } = this;
		let { pos } = this;
		if (pos) {
			buffer[pos++] = 1;
			for (; pos < 16; pos++) buffer[pos] = 0;
			this.process(buffer, 0, true);
		}
		this.finalize();
		let opos = 0;
		for (let i = 0; i < 8; i++) {
			out[opos++] = h[i] >>> 0;
			out[opos++] = h[i] >>> 8;
		}
	}
	digest() {
		const { buffer, outputLen } = this;
		this.digestInto(buffer);
		const res = buffer.slice(0, outputLen);
		this.destroy();
		return res;
	}
};
/**
* Poly1305 MAC from RFC 8439.
* @param msg - Message bytes to authenticate.
* @param key - 32-byte Poly1305 one-time key.
* @returns 16-byte authentication tag.
* @example
* Authenticates one message with a one-shot Poly1305 call and a fresh key.
*
* ```ts
* import { poly1305 } from '@noble/ciphers/_poly1305.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* poly1305(new Uint8Array(), key);
* ```
*/
var poly1305 = /* @__PURE__ */ wrapMacConstructor(32, (key) => new Poly1305(key));
//#endregion
//#region ../../node_modules/.pnpm/@noble+ciphers@2.2.0/node_modules/@noble/ciphers/chacha.js
/**
* ChaCha stream cipher, released
* in 2008. Developed after Salsa20, ChaCha aims to increase diffusion per round.
* It was standardized in
* {@link https://www.rfc-editor.org/rfc/rfc8439 | RFC 8439} and
* is now used in TLS 1.3.
*
* {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha | XChaCha20}
* extended-nonce variant is also provided. Similar to XSalsa, it's safe to use with
* randomly-generated nonces.
*
* Check out
* {@link http://cr.yp.to/chacha/chacha-20080128.pdf | PDF},
* {@link https://en.wikipedia.org/wiki/Salsa20 | wiki}, and
* {@link https://cr.yp.to/chacha.html | website}.
*
* @module
*/
/** RFC 8439 §2.3 block core for `state = constants | key | counter | nonce`. */
function chachaCore(s, k, n, out, cnt, rounds = 20) {
	let y00 = s[0], y01 = s[1], y02 = s[2], y03 = s[3], y04 = k[0], y05 = k[1], y06 = k[2], y07 = k[3], y08 = k[4], y09 = k[5], y10 = k[6], y11 = k[7], y12 = cnt, y13 = n[0], y14 = n[1], y15 = n[2];
	let x00 = y00, x01 = y01, x02 = y02, x03 = y03, x04 = y04, x05 = y05, x06 = y06, x07 = y07, x08 = y08, x09 = y09, x10 = y10, x11 = y11, x12 = y12, x13 = y13, x14 = y14, x15 = y15;
	for (let r = 0; r < rounds; r += 2) {
		x00 = x00 + x04 | 0;
		x12 = rotl(x12 ^ x00, 16);
		x08 = x08 + x12 | 0;
		x04 = rotl(x04 ^ x08, 12);
		x00 = x00 + x04 | 0;
		x12 = rotl(x12 ^ x00, 8);
		x08 = x08 + x12 | 0;
		x04 = rotl(x04 ^ x08, 7);
		x01 = x01 + x05 | 0;
		x13 = rotl(x13 ^ x01, 16);
		x09 = x09 + x13 | 0;
		x05 = rotl(x05 ^ x09, 12);
		x01 = x01 + x05 | 0;
		x13 = rotl(x13 ^ x01, 8);
		x09 = x09 + x13 | 0;
		x05 = rotl(x05 ^ x09, 7);
		x02 = x02 + x06 | 0;
		x14 = rotl(x14 ^ x02, 16);
		x10 = x10 + x14 | 0;
		x06 = rotl(x06 ^ x10, 12);
		x02 = x02 + x06 | 0;
		x14 = rotl(x14 ^ x02, 8);
		x10 = x10 + x14 | 0;
		x06 = rotl(x06 ^ x10, 7);
		x03 = x03 + x07 | 0;
		x15 = rotl(x15 ^ x03, 16);
		x11 = x11 + x15 | 0;
		x07 = rotl(x07 ^ x11, 12);
		x03 = x03 + x07 | 0;
		x15 = rotl(x15 ^ x03, 8);
		x11 = x11 + x15 | 0;
		x07 = rotl(x07 ^ x11, 7);
		x00 = x00 + x05 | 0;
		x15 = rotl(x15 ^ x00, 16);
		x10 = x10 + x15 | 0;
		x05 = rotl(x05 ^ x10, 12);
		x00 = x00 + x05 | 0;
		x15 = rotl(x15 ^ x00, 8);
		x10 = x10 + x15 | 0;
		x05 = rotl(x05 ^ x10, 7);
		x01 = x01 + x06 | 0;
		x12 = rotl(x12 ^ x01, 16);
		x11 = x11 + x12 | 0;
		x06 = rotl(x06 ^ x11, 12);
		x01 = x01 + x06 | 0;
		x12 = rotl(x12 ^ x01, 8);
		x11 = x11 + x12 | 0;
		x06 = rotl(x06 ^ x11, 7);
		x02 = x02 + x07 | 0;
		x13 = rotl(x13 ^ x02, 16);
		x08 = x08 + x13 | 0;
		x07 = rotl(x07 ^ x08, 12);
		x02 = x02 + x07 | 0;
		x13 = rotl(x13 ^ x02, 8);
		x08 = x08 + x13 | 0;
		x07 = rotl(x07 ^ x08, 7);
		x03 = x03 + x04 | 0;
		x14 = rotl(x14 ^ x03, 16);
		x09 = x09 + x14 | 0;
		x04 = rotl(x04 ^ x09, 12);
		x03 = x03 + x04 | 0;
		x14 = rotl(x14 ^ x03, 8);
		x09 = x09 + x14 | 0;
		x04 = rotl(x04 ^ x09, 7);
	}
	let oi = 0;
	out[oi++] = y00 + x00 | 0;
	out[oi++] = y01 + x01 | 0;
	out[oi++] = y02 + x02 | 0;
	out[oi++] = y03 + x03 | 0;
	out[oi++] = y04 + x04 | 0;
	out[oi++] = y05 + x05 | 0;
	out[oi++] = y06 + x06 | 0;
	out[oi++] = y07 + x07 | 0;
	out[oi++] = y08 + x08 | 0;
	out[oi++] = y09 + x09 | 0;
	out[oi++] = y10 + x10 | 0;
	out[oi++] = y11 + x11 | 0;
	out[oi++] = y12 + x12 | 0;
	out[oi++] = y13 + x13 | 0;
	out[oi++] = y14 + x14 | 0;
	out[oi++] = y15 + x15 | 0;
}
/**
* hchacha hashes key and nonce into key' and nonce' for xchacha20.
* Algorithmically identical to `hchacha_small`, but this exported path
* normalizes word order on big-endian hosts.
* Need to find a way to merge it with `chachaCore` without 25% performance hit.
* @param s - Sigma constants as 32-bit words.
* @param k - Key words.
* @param i - Nonce-prefix words.
* @param out - Output buffer for the derived subkey.
* @example
* Derives the XChaCha subkey from sigma, key, and nonce-prefix words.
*
* ```ts
* const sigma = new Uint32Array(4);
* const key = new Uint32Array(8);
* const nonce = new Uint32Array(4);
* const out = new Uint32Array(8);
* hchacha(sigma, key, nonce, out);
* ```
*/
function hchacha(s, k, i, out) {
	let x00 = swap8IfBE(s[0]), x01 = swap8IfBE(s[1]), x02 = swap8IfBE(s[2]), x03 = swap8IfBE(s[3]), x04 = swap8IfBE(k[0]), x05 = swap8IfBE(k[1]), x06 = swap8IfBE(k[2]), x07 = swap8IfBE(k[3]), x08 = swap8IfBE(k[4]), x09 = swap8IfBE(k[5]), x10 = swap8IfBE(k[6]), x11 = swap8IfBE(k[7]), x12 = swap8IfBE(i[0]), x13 = swap8IfBE(i[1]), x14 = swap8IfBE(i[2]), x15 = swap8IfBE(i[3]);
	for (let r = 0; r < 20; r += 2) {
		x00 = x00 + x04 | 0;
		x12 = rotl(x12 ^ x00, 16);
		x08 = x08 + x12 | 0;
		x04 = rotl(x04 ^ x08, 12);
		x00 = x00 + x04 | 0;
		x12 = rotl(x12 ^ x00, 8);
		x08 = x08 + x12 | 0;
		x04 = rotl(x04 ^ x08, 7);
		x01 = x01 + x05 | 0;
		x13 = rotl(x13 ^ x01, 16);
		x09 = x09 + x13 | 0;
		x05 = rotl(x05 ^ x09, 12);
		x01 = x01 + x05 | 0;
		x13 = rotl(x13 ^ x01, 8);
		x09 = x09 + x13 | 0;
		x05 = rotl(x05 ^ x09, 7);
		x02 = x02 + x06 | 0;
		x14 = rotl(x14 ^ x02, 16);
		x10 = x10 + x14 | 0;
		x06 = rotl(x06 ^ x10, 12);
		x02 = x02 + x06 | 0;
		x14 = rotl(x14 ^ x02, 8);
		x10 = x10 + x14 | 0;
		x06 = rotl(x06 ^ x10, 7);
		x03 = x03 + x07 | 0;
		x15 = rotl(x15 ^ x03, 16);
		x11 = x11 + x15 | 0;
		x07 = rotl(x07 ^ x11, 12);
		x03 = x03 + x07 | 0;
		x15 = rotl(x15 ^ x03, 8);
		x11 = x11 + x15 | 0;
		x07 = rotl(x07 ^ x11, 7);
		x00 = x00 + x05 | 0;
		x15 = rotl(x15 ^ x00, 16);
		x10 = x10 + x15 | 0;
		x05 = rotl(x05 ^ x10, 12);
		x00 = x00 + x05 | 0;
		x15 = rotl(x15 ^ x00, 8);
		x10 = x10 + x15 | 0;
		x05 = rotl(x05 ^ x10, 7);
		x01 = x01 + x06 | 0;
		x12 = rotl(x12 ^ x01, 16);
		x11 = x11 + x12 | 0;
		x06 = rotl(x06 ^ x11, 12);
		x01 = x01 + x06 | 0;
		x12 = rotl(x12 ^ x01, 8);
		x11 = x11 + x12 | 0;
		x06 = rotl(x06 ^ x11, 7);
		x02 = x02 + x07 | 0;
		x13 = rotl(x13 ^ x02, 16);
		x08 = x08 + x13 | 0;
		x07 = rotl(x07 ^ x08, 12);
		x02 = x02 + x07 | 0;
		x13 = rotl(x13 ^ x02, 8);
		x08 = x08 + x13 | 0;
		x07 = rotl(x07 ^ x08, 7);
		x03 = x03 + x04 | 0;
		x14 = rotl(x14 ^ x03, 16);
		x09 = x09 + x14 | 0;
		x04 = rotl(x04 ^ x09, 12);
		x03 = x03 + x04 | 0;
		x14 = rotl(x14 ^ x03, 8);
		x09 = x09 + x14 | 0;
		x04 = rotl(x04 ^ x09, 7);
	}
	let oi = 0;
	out[oi++] = x00;
	out[oi++] = x01;
	out[oi++] = x02;
	out[oi++] = x03;
	out[oi++] = x12;
	out[oi++] = x13;
	out[oi++] = x14;
	out[oi++] = x15;
	swap32IfBE(out);
}
/**
* XChaCha eXtended-nonce ChaCha. With 24-byte nonce, it's safe to make it random (CSPRNG).
* See {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha | the IRTF draft}.
* The nonce/counter layout still reserves 8 counter bytes internally, but the shared public
* `counter` argument follows noble's strict non-wrapping 32-bit policy. See `src/_arx.ts`
* near `MAX_COUNTER` for the full counter-policy rationale.
* @param key - 32-byte key.
* @param nonce - 24-byte extended nonce.
* @param data - Input bytes to xor with the keystream.
* @param output - Optional destination buffer.
* @param counter - Initial block counter.
* @returns Encrypted or decrypted bytes.
* @example
* Encrypts bytes with XChaCha20 using a fresh key and random 24-byte nonce.
*
* ```ts
* import { xchacha20 } from '@noble/ciphers/chacha.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* const nonce = randomBytes(24);
* xchacha20(key, nonce, new Uint8Array(4));
* ```
*/
var xchacha20 = /* @__PURE__ */ createCipher(chachaCore, {
	counterRight: false,
	counterLength: 8,
	extendNonceFn: hchacha,
	allowShortKeys: false
});
var ZEROS16 = /* @__PURE__ */ new Uint8Array(16);
var updatePadded = (h, msg) => {
	h.update(msg);
	const leftover = msg.length % 16;
	if (leftover) h.update(ZEROS16.subarray(leftover));
};
var ZEROS32 = /* @__PURE__ */ new Uint8Array(32);
function computeTag(fn, key, nonce, ciphertext, AAD) {
	if (AAD !== void 0) abytes(AAD, void 0, "AAD");
	const authKey = fn(key, nonce, ZEROS32);
	const lengths = u64Lengths(ciphertext.length, AAD ? AAD.length : 0, true);
	const h = poly1305.create(authKey);
	if (AAD) updatePadded(h, AAD);
	updatePadded(h, ciphertext);
	h.update(lengths);
	const res = h.digest();
	clean(authKey, lengths);
	return res;
}
/**
* AEAD algorithm from RFC 8439.
* Salsa20 and chacha (RFC 8439) use poly1305 differently.
* We could have composed them, but it's hard because of authKey:
* In salsa20, authKey changes position in salsa stream.
* In chacha, authKey can't be computed inside computeTag, it modifies the counter.
*/
var _poly1305_aead = (xorStream) => (key, nonce, AAD) => {
	const tagLength = 16;
	return {
		encrypt(plaintext, output) {
			const plength = plaintext.length;
			output = getOutput(plength + tagLength, output, false);
			output.set(plaintext);
			const oPlain = output.subarray(0, -tagLength);
			xorStream(key, nonce, oPlain, oPlain, 1);
			const tag = computeTag(xorStream, key, nonce, oPlain, AAD);
			output.set(tag, plength);
			clean(tag);
			return output;
		},
		decrypt(ciphertext, output) {
			output = getOutput(ciphertext.length - tagLength, output, false);
			const data = ciphertext.subarray(0, -tagLength);
			const passedTag = ciphertext.subarray(-tagLength);
			const tag = computeTag(xorStream, key, nonce, data, AAD);
			if (!equalBytes(passedTag, tag)) {
				clean(tag);
				throw new Error("invalid tag");
			}
			output.set(ciphertext.subarray(0, -tagLength));
			xorStream(key, nonce, output, output, 1);
			clean(tag);
			return output;
		}
	};
};
/**
* XChaCha20-Poly1305 extended-nonce chacha.
*
* Can be safely used with random nonces (CSPRNG).
* See {@link https://datatracker.ietf.org/doc/html/draft-irtf-cfrg-xchacha | the IRTF draft}.
* @param key - 32-byte key.
* @param nonce - 24-byte nonce.
* @param AAD - Additional authenticated data.
* @returns AEAD cipher instance.
* @example
* Encrypts and authenticates plaintext with a fresh key and random 24-byte nonce.
*
* ```ts
* import { xchacha20poly1305 } from '@noble/ciphers/chacha.js';
* import { randomBytes } from '@noble/ciphers/utils.js';
* const key = randomBytes(32);
* const nonce = randomBytes(24);
* const cipher = xchacha20poly1305(key, nonce);
* cipher.encrypt(new Uint8Array([1, 2, 3]));
* ```
*/
var xchacha20poly1305 = /* @__PURE__ */ wrapCipher({
	blockSize: 64,
	nonceLength: 24,
	tagLength: 16
}, /* @__PURE__ */ _poly1305_aead(xchacha20));
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/crypto/index.mjs
var ENVELOPE_PREFIX = "$ba$";
function parseEnvelope(data) {
	if (!data.startsWith(ENVELOPE_PREFIX)) return null;
	const firstSep = 4;
	const secondSep = data.indexOf("$", firstSep);
	if (secondSep === -1) return null;
	const version = parseInt(data.slice(firstSep, secondSep), 10);
	if (!Number.isInteger(version) || version < 0) return null;
	return {
		version,
		ciphertext: data.slice(secondSep + 1)
	};
}
function formatEnvelope(version, ciphertext) {
	return `${ENVELOPE_PREFIX}${version}$${ciphertext}`;
}
async function rawEncrypt(secret, data) {
	const keyAsBytes = await createHash$1("SHA-256").digest(secret);
	const dataAsBytes = utf8ToBytes(data);
	return bytesToHex(managedNonce(xchacha20poly1305)(new Uint8Array(keyAsBytes)).encrypt(dataAsBytes));
}
async function rawDecrypt(secret, hex) {
	const keyAsBytes = await createHash$1("SHA-256").digest(secret);
	const dataAsBytes = hexToBytes(hex);
	const chacha = managedNonce(xchacha20poly1305)(new Uint8Array(keyAsBytes));
	return new TextDecoder().decode(chacha.decrypt(dataAsBytes));
}
var symmetricEncrypt = async ({ key, data }) => {
	if (typeof key === "string") return rawEncrypt(key, data);
	const secret = key.keys.get(key.currentVersion);
	if (!secret) throw new Error(`Secret version ${key.currentVersion} not found in keys`);
	const ciphertext = await rawEncrypt(secret, data);
	return formatEnvelope(key.currentVersion, ciphertext);
};
var symmetricDecrypt = async ({ key, data }) => {
	if (typeof key === "string") return rawDecrypt(key, data);
	const envelope = parseEnvelope(data);
	if (envelope) {
		const secret = key.keys.get(envelope.version);
		if (!secret) throw new Error(`Secret version ${envelope.version} not found in keys (key may have been retired)`);
		return rawDecrypt(secret, envelope.ciphertext);
	}
	if (key.legacySecret) return rawDecrypt(key.legacySecret, data);
	throw new Error("Cannot decrypt legacy bare-hex payload: no legacy secret available. Set BETTER_AUTH_SECRET for backwards compatibility.");
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/utils/db.mjs
/**
* Filters output data by removing fields with the `returned: false` attribute.
* This ensures sensitive fields are not exposed in API responses.
*/
function filterOutputFields(data, additionalFields) {
	if (!data || !additionalFields) return data;
	const returnFiltered = Object.entries(additionalFields).filter(([, { returned }]) => returned === false).map(([key]) => key);
	return Object.entries(structuredClone(data)).filter(([key]) => !returnFiltered.includes(key)).reduce((acc, [key, value]) => ({
		...acc,
		[key]: value
	}), {});
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/schema.mjs
var cache = /* @__PURE__ */ new WeakMap();
function getFields(options, modelName, mode) {
	const cacheKey = `${modelName}:${mode}`;
	if (!cache.has(options)) cache.set(options, /* @__PURE__ */ new Map());
	const tableCache = cache.get(options);
	if (tableCache.has(cacheKey)) return tableCache.get(cacheKey);
	const coreSchema = mode === "output" ? getAuthTables(options)[modelName]?.fields ?? {} : {};
	const additionalFields = modelName === "user" || modelName === "session" || modelName === "account" ? options[modelName]?.additionalFields : void 0;
	let schema = {
		...coreSchema,
		...additionalFields ?? {}
	};
	for (const plugin of options.plugins || []) if (plugin.schema && plugin.schema[modelName]) schema = {
		...schema,
		...plugin.schema[modelName].fields
	};
	tableCache.set(cacheKey, schema);
	return schema;
}
function parseUserOutput(options, user) {
	return filterOutputFields(user, getFields(options, "user", "output"));
}
function parseSessionOutput(options, session) {
	return filterOutputFields(session, getFields(options, "session", "output"));
}
function parseAccountOutput(options, account) {
	const { accessToken: _accessToken, refreshToken: _refreshToken, idToken: _idToken, accessTokenExpiresAt: _accessTokenExpiresAt, refreshTokenExpiresAt: _refreshTokenExpiresAt, password: _password, ...rest } = filterOutputFields(account, getFields(options, "account", "output"));
	return rest;
}
function parseInputData(data, schema) {
	const action = schema.action || "create";
	const fields = schema.fields;
	const parsedData = Object.create(null);
	for (const key in fields) {
		if (key in data) {
			if (fields[key].input === false) {
				if (fields[key].defaultValue !== void 0) {
					if (action !== "update") {
						parsedData[key] = fields[key].defaultValue;
						continue;
					}
				}
				if (data[key]) throw APIError.from("BAD_REQUEST", {
					...BASE_ERROR_CODES.FIELD_NOT_ALLOWED,
					message: `${key} is not allowed to be set`
				});
				continue;
			}
			if (fields[key].validator?.input && data[key] !== void 0) {
				const result = fields[key].validator.input["~standard"].validate(data[key]);
				if (result instanceof Promise) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.ASYNC_VALIDATION_NOT_SUPPORTED);
				if ("issues" in result && result.issues) throw APIError.from("BAD_REQUEST", {
					...BASE_ERROR_CODES.VALIDATION_ERROR,
					message: result.issues[0]?.message || "Validation Error"
				});
				parsedData[key] = result.value;
				continue;
			}
			if (fields[key].transform?.input && data[key] !== void 0) {
				parsedData[key] = fields[key].transform?.input(data[key]);
				continue;
			}
			parsedData[key] = data[key];
			continue;
		}
		if (fields[key].defaultValue !== void 0 && action === "create") {
			if (typeof fields[key].defaultValue === "function") {
				parsedData[key] = fields[key].defaultValue();
				continue;
			}
			parsedData[key] = fields[key].defaultValue;
			continue;
		}
		if (fields[key].required && action === "create") throw APIError.from("BAD_REQUEST", {
			...BASE_ERROR_CODES.MISSING_FIELD,
			message: `${key} is required`
		});
	}
	return parsedData;
}
function parseUserInput(options, user = {}, action) {
	return parseInputData(user, {
		fields: getFields(options, "user", "input"),
		action
	});
}
function parseSessionInput(options, session, action) {
	return parseInputData(session, {
		fields: getFields(options, "session", "input"),
		action
	});
}
function getSessionDefaultFields(options) {
	const fields = getFields(options, "session", "input");
	const defaults = {};
	for (const key in fields) if (fields[key].defaultValue !== void 0) defaults[key] = typeof fields[key].defaultValue === "function" ? fields[key].defaultValue() : fields[key].defaultValue;
	return defaults;
}
function mergeSchema(schema, newSchema) {
	if (!newSchema) return schema;
	for (const table in newSchema) {
		const newModelName = newSchema[table]?.modelName;
		if (newModelName) schema[table].modelName = newModelName;
		for (const field in schema[table].fields) {
			const newField = newSchema[table]?.fields?.[field];
			if (!newField) continue;
			schema[table].fields[field].fieldName = newField;
		}
	}
	return schema;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/date.mjs
var getDate = (span, unit = "ms") => {
	return new Date(Date.now() + (unit === "sec" ? span * 1e3 : span));
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/is-promise.mjs
function isPromise(obj) {
	return !!obj && (typeof obj === "object" || typeof obj === "function") && typeof obj.then === "function";
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/time.mjs
var SEC = 1e3;
var MIN = SEC * 60;
var HOUR = MIN * 60;
var DAY = HOUR * 24;
var WEEK = DAY * 7;
var MONTH = DAY * 30;
var YEAR = DAY * 365.25;
var REGEX = /^(\+|\-)? ?(\d+|\d+\.\d+) ?(seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|months?|mo|years?|yrs?|y)(?: (ago|from now))?$/i;
function parse(value) {
	const match = REGEX.exec(value);
	if (!match || match[4] && match[1]) throw new TypeError(`Invalid time string format: "${value}". Use formats like "7d", "30m", "1 hour", etc.`);
	const n = parseFloat(match[2]);
	const unit = match[3].toLowerCase();
	let result;
	switch (unit) {
		case "years":
		case "year":
		case "yrs":
		case "yr":
		case "y":
			result = n * YEAR;
			break;
		case "months":
		case "month":
		case "mo":
			result = n * MONTH;
			break;
		case "weeks":
		case "week":
		case "w":
			result = n * WEEK;
			break;
		case "days":
		case "day":
		case "d":
			result = n * DAY;
			break;
		case "hours":
		case "hour":
		case "hrs":
		case "hr":
		case "h":
			result = n * HOUR;
			break;
		case "minutes":
		case "minute":
		case "mins":
		case "min":
		case "m":
			result = n * MIN;
			break;
		case "seconds":
		case "second":
		case "secs":
		case "sec":
		case "s":
			result = n * SEC;
			break;
		default: throw new TypeError(`Unknown time unit: "${unit}"`);
	}
	if (match[1] === "-" || match[4] === "ago") return -result;
	return result;
}
/**
* Parse a time string and return the value in seconds.
*
* @param value - A time string like "7d", "30m", "1 hour", "2 hours ago"
* @returns The parsed value in seconds (rounded)
* @throws TypeError if the string format is invalid
*
* @example
* sec("1d")          // 86400
* sec("2 hours")     // 7200
* sec("-30s")        // -30
* sec("2 hours ago") // -7200
*/
function sec(value) {
	return Math.round(parse(value) / 1e3);
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/cookies/cookie-utils.mjs
function tryDecode$2(str) {
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}
var SECURE_COOKIE_PREFIX = "__Secure-";
/**
* Split a comma-joined `Set-Cookie` header string into individual cookies.
*/
function splitSetCookieHeader(setCookie) {
	if (!setCookie) return [];
	const result = [];
	let start = 0;
	let i = 0;
	while (i < setCookie.length) {
		if (setCookie[i] === ",") {
			let j = i + 1;
			while (j < setCookie.length && setCookie[j] === " ") j++;
			while (j < setCookie.length && setCookie[j] !== "=" && setCookie[j] !== ";" && setCookie[j] !== ",") j++;
			if (j < setCookie.length && setCookie[j] === "=") {
				const part = setCookie.slice(start, i).trim();
				if (part) result.push(part);
				start = i + 1;
				while (start < setCookie.length && setCookie[start] === " ") start++;
				i = start;
				continue;
			}
		}
		i++;
	}
	const last = setCookie.slice(start).trim();
	if (last) result.push(last);
	return result;
}
function parseSetCookieHeader(setCookie) {
	const cookies = /* @__PURE__ */ new Map();
	splitSetCookieHeader(setCookie).forEach((cookieString) => {
		const [nameValue, ...attributes] = cookieString.split(";").map((part) => part.trim());
		const [name, ...valueParts] = (nameValue || "").split("=");
		const value = valueParts.join("=");
		if (!name || value === void 0) return;
		const attrObj = { value: value.includes("%") ? tryDecode$2(value) : value };
		attributes.forEach((attribute) => {
			const [attrName, ...attrValueParts] = attribute.split("=");
			const attrValue = attrValueParts.join("=");
			const normalizedAttrName = attrName.trim().toLowerCase();
			switch (normalizedAttrName) {
				case "max-age":
					attrObj["max-age"] = attrValue ? parseInt(attrValue.trim(), 10) : void 0;
					break;
				case "expires":
					attrObj.expires = attrValue ? new Date(attrValue.trim()) : void 0;
					break;
				case "domain":
					attrObj.domain = attrValue ? attrValue.trim() : void 0;
					break;
				case "path":
					attrObj.path = attrValue ? attrValue.trim() : void 0;
					break;
				case "secure":
					attrObj.secure = true;
					break;
				case "httponly":
					attrObj.httponly = true;
					break;
				case "samesite":
					attrObj.samesite = attrValue ? attrValue.trim().toLowerCase() : void 0;
					break;
				case "partitioned":
					attrObj.partitioned = true;
					break;
				default:
					attrObj[normalizedAttrName] = attrValue ? attrValue.trim() : true;
					break;
			}
		});
		cookies.set(name, attrObj);
	});
	return cookies;
}
/**
* Add or replace a cookie in the request `Cookie` header.
*
* Cookie pairs are joined with `; `, but `headers.append("cookie", ...)`
* joins with `, ` in some runtimes (e.g. Deno, Cloudflare Workers) and
* breaks downstream cookie parsing. This builds the header value via
* parse-mutate-serialize.
*/
function setRequestCookie(headers, name, value) {
	const cookieMap = /* @__PURE__ */ new Map();
	for (const pair of (headers.get("cookie") || "").split(";")) {
		const trimmed = pair.trim();
		const eq = trimmed.indexOf("=");
		if (eq > 0) cookieMap.set(trimmed.slice(0, eq), trimmed.slice(eq + 1));
	}
	cookieMap.set(name, value);
	headers.set("cookie", Array.from(cookieMap, ([k, v]) => `${k}=${v}`).join("; "));
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/cookies/session-store.mjs
var ALLOWED_COOKIE_SIZE = 4096;
var ESTIMATED_EMPTY_COOKIE_SIZE = 200;
var CHUNK_SIZE = ALLOWED_COOKIE_SIZE - ESTIMATED_EMPTY_COOKIE_SIZE;
/**
* Parse cookies from the request headers
*/
function parseCookiesFromContext(ctx) {
	const cookieHeader = ctx.headers?.get("cookie");
	if (!cookieHeader) return {};
	const cookies = {};
	const pairs = cookieHeader.split("; ");
	for (const pair of pairs) {
		const [name, ...valueParts] = pair.split("=");
		if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
	}
	return cookies;
}
/**
* Extract the chunk index from a cookie name
*/
function getChunkIndex(cookieName) {
	const parts = cookieName.split(".");
	const lastPart = parts[parts.length - 1];
	const index = parseInt(lastPart || "0", 10);
	return isNaN(index) ? 0 : index;
}
/**
* Read all existing chunks from cookies
*/
function readExistingChunks(cookieName, ctx) {
	const chunks = {};
	const cookies = parseCookiesFromContext(ctx);
	for (const [name, value] of Object.entries(cookies)) if (name.startsWith(cookieName)) chunks[name] = value;
	return chunks;
}
/**
* Get the full session data by joining all chunks
*/
function joinChunks(chunks) {
	return Object.keys(chunks).sort((a, b) => {
		return getChunkIndex(a) - getChunkIndex(b);
	}).map((key) => chunks[key]).join("");
}
/**
* Split a cookie value into chunks if needed
*/
function chunkCookie(storeName, cookie, chunks, logger) {
	const chunkCount = Math.ceil(cookie.value.length / CHUNK_SIZE);
	if (chunkCount === 1) {
		chunks[cookie.name] = cookie.value;
		return [cookie];
	}
	const cookies = [];
	for (let i = 0; i < chunkCount; i++) {
		const name = `${cookie.name}.${i}`;
		const start = i * CHUNK_SIZE;
		const value = cookie.value.substring(start, start + CHUNK_SIZE);
		cookies.push({
			...cookie,
			name,
			value
		});
		chunks[name] = value;
	}
	logger.debug(`CHUNKING_${storeName.toUpperCase()}_COOKIE`, {
		message: `${storeName} cookie exceeds allowed ${ALLOWED_COOKIE_SIZE} bytes.`,
		emptyCookieSize: ESTIMATED_EMPTY_COOKIE_SIZE,
		valueSize: cookie.value.length,
		chunkCount,
		chunks: cookies.map((c) => c.value.length + ESTIMATED_EMPTY_COOKIE_SIZE)
	});
	return cookies;
}
/**
* Get all cookies that should be cleaned (removed)
*/
function getCleanCookies(chunks, cookieOptions) {
	const cleanedChunks = {};
	for (const name in chunks) cleanedChunks[name] = {
		name,
		value: "",
		attributes: {
			...cookieOptions,
			maxAge: 0
		}
	};
	return cleanedChunks;
}
/**
* Create a session store for handling cookie chunking.
* When session data exceeds 4KB, it automatically splits it into multiple cookies.
*
* Based on next-auth's SessionStore implementation.
* @see https://github.com/nextauthjs/next-auth/blob/27b2519b84b8eb9cf053775dea29d577d2aa0098/packages/next-auth/src/core/lib/cookie.ts
*/
var storeFactory = (storeName) => (cookieName, cookieOptions, ctx) => {
	const chunks = readExistingChunks(cookieName, ctx);
	const logger = ctx.context.logger;
	return {
		getValue() {
			return joinChunks(chunks);
		},
		hasChunks() {
			return Object.keys(chunks).length > 0;
		},
		chunk(value, options) {
			const cleanedChunks = getCleanCookies(chunks, cookieOptions);
			for (const name in chunks) delete chunks[name];
			const cookies = cleanedChunks;
			const chunked = chunkCookie(storeName, {
				name: cookieName,
				value,
				attributes: {
					...cookieOptions,
					...options
				}
			}, chunks, logger);
			for (const chunk of chunked) cookies[chunk.name] = chunk;
			return Object.values(cookies);
		},
		clean() {
			const cleanedChunks = getCleanCookies(chunks, cookieOptions);
			for (const name in chunks) delete chunks[name];
			return Object.values(cleanedChunks);
		},
		setCookies(cookies) {
			for (const cookie of cookies) ctx.setCookie(cookie.name, cookie.value, cookie.attributes);
		}
	};
};
var createSessionStore = storeFactory("Session");
var createAccountStore = storeFactory("Account");
function getChunkedCookie(ctx, cookieName) {
	const value = ctx.getCookie(cookieName);
	if (value) return value;
	const chunks = [];
	const cookieHeader = ctx.headers?.get("cookie");
	if (!cookieHeader) return null;
	const cookies = {};
	const pairs = cookieHeader.split("; ");
	for (const pair of pairs) {
		const [name, ...valueParts] = pair.split("=");
		if (name && valueParts.length > 0) cookies[name] = valueParts.join("=");
	}
	for (const [name, val] of Object.entries(cookies)) if (name.startsWith(cookieName + ".")) {
		const indexStr = name.split(".").at(-1);
		const index = parseInt(indexStr || "0", 10);
		if (!isNaN(index)) chunks.push({
			index,
			value: val
		});
	}
	if (chunks.length > 0) {
		chunks.sort((a, b) => a.index - b.index);
		return chunks.map((c) => c.value).join("");
	}
	return null;
}
async function setAccountCookie(c, accountData) {
	const accountDataCookie = c.context.authCookies.accountData;
	const options = {
		maxAge: 300,
		...accountDataCookie.attributes
	};
	const data = await symmetricEncodeJWT(accountData, c.context.secretConfig, "better-auth-account", options.maxAge);
	if (data.length > ALLOWED_COOKIE_SIZE) {
		const accountStore = createAccountStore(accountDataCookie.name, options, c);
		const cookies = accountStore.chunk(data, options);
		accountStore.setCookies(cookies);
	} else {
		const accountStore = createAccountStore(accountDataCookie.name, options, c);
		if (accountStore.hasChunks()) {
			const cleanCookies = accountStore.clean();
			accountStore.setCookies(cleanCookies);
		}
		c.setCookie(accountDataCookie.name, data, options);
	}
}
async function getAccountCookie(c) {
	const accountCookie = getChunkedCookie(c, c.context.authCookies.accountData.name);
	if (accountCookie) {
		const accountData = safeJSONParse(await symmetricDecodeJWT(accountCookie, c.context.secretConfig, "better-auth-account"));
		if (accountData) return accountData;
	}
	return null;
}
var getSessionQuerySchema = optional(object({
	disableCookieCache: boolean$1().meta({ description: "Disable cookie cache and fetch session from database" }).optional(),
	disableRefresh: boolean$1().meta({ description: "Disable session refresh. Useful for checking session status, without updating the session" }).optional()
}));
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/binary.mjs
var decoders = /* @__PURE__ */ new Map();
var binary = {
	decode: (data, encoding = "utf-8") => {
		if (!decoders.has(encoding)) decoders.set(encoding, new TextDecoder(encoding));
		return decoders.get(encoding).decode(data);
	},
	encode: new TextEncoder().encode
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/hex.mjs
var hexadecimal = "0123456789abcdef";
var hex = {
	encode: (data) => {
		if (typeof data === "string") data = new TextEncoder().encode(data);
		if (data.byteLength === 0) return "";
		const buffer = new Uint8Array(data);
		let result = "";
		for (const byte of buffer) result += byte.toString(16).padStart(2, "0");
		return result;
	},
	decode: (data) => {
		if (!data) return "";
		if (typeof data === "string") {
			if (data.length % 2 !== 0) throw new Error("Invalid hexadecimal string");
			if (!new RegExp(`^[${hexadecimal}]+$`).test(data)) throw new Error("Invalid hexadecimal string");
			const result = new Uint8Array(data.length / 2);
			for (let i = 0; i < data.length; i += 2) result[i / 2] = parseInt(data.slice(i, i + 2), 16);
			return new TextDecoder().decode(result);
		}
		return new TextDecoder().decode(data);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+utils@0.4.0/node_modules/@better-auth/utils/dist/hmac.mjs
var createHMAC = (algorithm = "SHA-256", encoding = "none") => {
	const hmac = {
		importKey: async (key, keyUsage) => {
			return getWebcryptoSubtle().importKey("raw", typeof key === "string" ? new TextEncoder().encode(key) : key, {
				name: "HMAC",
				hash: { name: algorithm }
			}, false, [keyUsage]);
		},
		sign: async (hmacKey, data) => {
			if (typeof hmacKey === "string") hmacKey = await hmac.importKey(hmacKey, "sign");
			const signature = await getWebcryptoSubtle().sign("HMAC", hmacKey, typeof data === "string" ? new TextEncoder().encode(data) : data);
			if (encoding === "hex") return hex.encode(signature);
			if (encoding === "base64" || encoding === "base64url" || encoding === "base64urlnopad") return base64Url.encode(signature, { padding: encoding !== "base64urlnopad" });
			return signature;
		},
		verify: async (hmacKey, data, signature) => {
			if (typeof hmacKey === "string") hmacKey = await hmac.importKey(hmacKey, "verify");
			if (encoding === "hex") signature = hex.decode(signature);
			if (encoding === "base64" || encoding === "base64url" || encoding === "base64urlnopad") signature = await base64.decode(signature);
			return getWebcryptoSubtle().verify("HMAC", hmacKey, typeof signature === "string" ? new TextEncoder().encode(signature) : signature, typeof data === "string" ? new TextEncoder().encode(data) : data);
		}
	};
	return hmac;
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/cookies/index.mjs
function createCookieGetter(options) {
	const baseURLString = typeof options.baseURL === "string" ? options.baseURL : void 0;
	const dynamicProtocol = typeof options.baseURL === "object" && options.baseURL !== null ? options.baseURL.protocol : void 0;
	const secureCookiePrefix = (options.advanced?.useSecureCookies !== void 0 ? options.advanced?.useSecureCookies : dynamicProtocol === "https" ? true : dynamicProtocol === "http" ? false : baseURLString ? baseURLString.startsWith("https://") : isProduction) ? SECURE_COOKIE_PREFIX : "";
	const crossSubdomainEnabled = !!options.advanced?.crossSubDomainCookies?.enabled;
	const domain = crossSubdomainEnabled ? options.advanced?.crossSubDomainCookies?.domain || (baseURLString ? new URL(baseURLString).hostname : void 0) : void 0;
	if (crossSubdomainEnabled && !domain && !isDynamicBaseURLConfig(options.baseURL)) throw new BetterAuthError("baseURL is required when crossSubdomainCookies are enabled.");
	function createCookie(cookieName, overrideAttributes = {}) {
		const prefix = options.advanced?.cookiePrefix || "better-auth";
		const name = options.advanced?.cookies?.[cookieName]?.name || `${prefix}.${cookieName}`;
		const attributes = options.advanced?.cookies?.[cookieName]?.attributes ?? {};
		return {
			name: `${secureCookiePrefix}${name}`,
			attributes: {
				secure: !!secureCookiePrefix,
				sameSite: "lax",
				path: "/",
				httpOnly: true,
				...crossSubdomainEnabled ? { domain } : {},
				...options.advanced?.defaultCookieAttributes,
				...overrideAttributes,
				...attributes
			}
		};
	}
	return createCookie;
}
function getCookies(options) {
	const createCookie = createCookieGetter(options);
	const sessionToken = createCookie("session_token", { maxAge: options.session?.expiresIn || sec("7d") });
	const sessionData = createCookie("session_data", { maxAge: options.session?.cookieCache?.maxAge || 300 });
	const accountData = createCookie("account_data", { maxAge: options.session?.cookieCache?.maxAge || 300 });
	const dontRememberToken = createCookie("dont_remember");
	return {
		sessionToken: {
			name: sessionToken.name,
			attributes: sessionToken.attributes
		},
		sessionData: {
			name: sessionData.name,
			attributes: sessionData.attributes
		},
		dontRememberToken: {
			name: dontRememberToken.name,
			attributes: dontRememberToken.attributes
		},
		accountData: {
			name: accountData.name,
			attributes: accountData.attributes
		}
	};
}
async function setCookieCache(ctx, session, dontRememberMe) {
	if (!ctx.context.options.session?.cookieCache?.enabled) return;
	const filteredSession = filterOutputFields(session.session, ctx.context.options.session?.additionalFields);
	const filteredUser = parseUserOutput(ctx.context.options, session.user);
	const versionConfig = ctx.context.options.session?.cookieCache?.version;
	let version = "1";
	if (versionConfig) {
		if (typeof versionConfig === "string") version = versionConfig;
		else if (typeof versionConfig === "function") {
			const result = versionConfig(session.session, session.user);
			version = isPromise(result) ? await result : result;
		}
	}
	const sessionData = {
		session: filteredSession,
		user: filteredUser,
		updatedAt: Date.now(),
		version
	};
	const options = {
		...ctx.context.authCookies.sessionData.attributes,
		maxAge: dontRememberMe ? void 0 : ctx.context.authCookies.sessionData.attributes.maxAge
	};
	const expiresAtDate = getDate(options.maxAge || 60, "sec").getTime();
	const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
	let data;
	if (strategy === "jwe") data = await symmetricEncodeJWT(sessionData, ctx.context.secretConfig, "better-auth-session", options.maxAge || 300);
	else if (strategy === "jwt") data = await signJWT$1(sessionData, ctx.context.secret, options.maxAge || 300);
	else data = base64Url.encode(JSON.stringify({
		session: sessionData,
		expiresAt: expiresAtDate,
		signature: await createHMAC("SHA-256", "base64urlnopad").sign(ctx.context.secret, JSON.stringify({
			...sessionData,
			expiresAt: expiresAtDate
		}))
	}), { padding: false });
	if (data.length > 4093) {
		const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, options, ctx);
		const cookies = sessionStore.chunk(data, options);
		sessionStore.setCookies(cookies);
	} else {
		const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, options, ctx);
		if (sessionStore.hasChunks()) {
			const cleanCookies = sessionStore.clean();
			sessionStore.setCookies(cleanCookies);
		}
		ctx.setCookie(ctx.context.authCookies.sessionData.name, data, options);
	}
	if (ctx.context.options.account?.storeAccountCookie) {
		const accountData = await getAccountCookie(ctx);
		if (accountData) await setAccountCookie(ctx, accountData);
	}
}
async function setSessionCookie(ctx, session, dontRememberMe, overrides) {
	const dontRememberMeCookie = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
	dontRememberMe = dontRememberMe !== void 0 ? dontRememberMe : !!dontRememberMeCookie;
	const options = ctx.context.authCookies.sessionToken.attributes;
	const maxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
	await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session.session.token, ctx.context.secret, {
		...options,
		maxAge,
		...overrides
	});
	if (dontRememberMe) await ctx.setSignedCookie(ctx.context.authCookies.dontRememberToken.name, "true", ctx.context.secret, ctx.context.authCookies.dontRememberToken.attributes);
	await setCookieCache(ctx, session, dontRememberMe);
	ctx.context.setNewSession(session);
}
/**
* Expires a cookie by setting `maxAge: 0` while preserving its attributes
*/
function expireCookie(ctx, cookie) {
	ctx.setCookie(cookie.name, "", {
		...cookie.attributes,
		maxAge: 0
	});
}
function deleteSessionCookie(ctx, skipDontRememberMe) {
	expireCookie(ctx, ctx.context.authCookies.sessionToken);
	expireCookie(ctx, ctx.context.authCookies.sessionData);
	if (ctx.context.options.account?.storeAccountCookie) {
		expireCookie(ctx, ctx.context.authCookies.accountData);
		const accountStore = createAccountStore(ctx.context.authCookies.accountData.name, ctx.context.authCookies.accountData.attributes, ctx);
		const cleanCookies = accountStore.clean();
		accountStore.setCookies(cleanCookies);
	}
	if (ctx.context.oauthConfig.storeStateStrategy === "cookie") expireCookie(ctx, ctx.context.createAuthCookie("oauth_state"));
	const sessionStore = createSessionStore(ctx.context.authCookies.sessionData.name, ctx.context.authCookies.sessionData.attributes, ctx);
	const cleanCookies = sessionStore.clean();
	sessionStore.setCookies(cleanCookies);
	if (!skipDontRememberMe) expireCookie(ctx, ctx.context.authCookies.dontRememberToken);
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/state.mjs
var stateDataSchema = looseObject({
	callbackURL: string(),
	codeVerifier: string(),
	errorURL: string().optional(),
	newUserURL: string().optional(),
	expiresAt: number(),
	oauthState: string().optional(),
	link: object({
		email: string(),
		userId: string$1()
	}).optional(),
	requestSignUp: boolean().optional()
});
var StateError = class extends BetterAuthError {
	code;
	details;
	constructor(message, options) {
		super(message, options);
		this.code = options.code;
		this.details = options.details;
	}
};
async function generateGenericState(c, stateData, settings) {
	const state = generateRandomString(32);
	if (c.context.oauthConfig.storeStateStrategy === "cookie") {
		const payload = {
			...stateData,
			oauthState: state
		};
		const encryptedData = await symmetricEncrypt({
			key: c.context.secretConfig,
			data: JSON.stringify(payload)
		});
		const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "oauth_state", { maxAge: 600 });
		c.setCookie(stateCookie.name, encryptedData, stateCookie.attributes);
		return {
			state,
			codeVerifier: stateData.codeVerifier
		};
	}
	const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "state", { maxAge: 300 });
	await c.setSignedCookie(stateCookie.name, state, c.context.secret, stateCookie.attributes);
	const expiresAt = /* @__PURE__ */ new Date();
	expiresAt.setMinutes(expiresAt.getMinutes() + 10);
	if (!await c.context.internalAdapter.createVerificationValue({
		value: JSON.stringify({
			...stateData,
			oauthState: state
		}),
		identifier: state,
		expiresAt
	})) throw new StateError("Unable to create verification. Make sure the database adapter is properly working and there is a verification table in the database", { code: "state_generation_error" });
	return {
		state,
		codeVerifier: stateData.codeVerifier
	};
}
async function parseGenericState(c, state, settings) {
	const storeStateStrategy = c.context.oauthConfig.storeStateStrategy;
	let parsedData;
	if (storeStateStrategy === "cookie") {
		const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "oauth_state");
		const encryptedData = c.getCookie(stateCookie.name);
		if (!encryptedData) throw new StateError("State mismatch: auth state cookie not found", {
			code: "state_mismatch",
			details: { state }
		});
		try {
			const decryptedData = await symmetricDecrypt({
				key: c.context.secretConfig,
				data: encryptedData
			});
			parsedData = stateDataSchema.parse(JSON.parse(decryptedData));
		} catch (error) {
			throw new StateError("State invalid: Failed to decrypt or parse auth state", {
				code: "state_invalid",
				details: { state },
				cause: error
			});
		}
		if (!parsedData.oauthState || parsedData.oauthState !== state) throw new StateError("State mismatch: OAuth state parameter does not match stored state", {
			code: "state_security_mismatch",
			details: { state }
		});
		expireCookie(c, stateCookie);
	} else {
		const data = await c.context.internalAdapter.findVerificationValue(state);
		if (!data) throw new StateError("State mismatch: verification not found", {
			code: "state_mismatch",
			details: { state }
		});
		parsedData = stateDataSchema.parse(JSON.parse(data.value));
		if (parsedData.oauthState !== void 0 && parsedData.oauthState !== state) throw new StateError("State mismatch: OAuth state parameter does not match stored state", {
			code: "state_security_mismatch",
			details: { state }
		});
		const stateCookie = c.context.createAuthCookie(settings?.cookieName ?? "state");
		const stateCookieValue = await c.getSignedCookie(stateCookie.name, c.context.secret);
		if (!(settings?.skipStateCookieCheck ?? c.context.oauthConfig.skipStateCookieCheck) && (!stateCookieValue || stateCookieValue !== state)) throw new StateError("State mismatch: State not persisted correctly", {
			code: "state_security_mismatch",
			details: { state }
		});
		expireCookie(c, stateCookie);
		await c.context.internalAdapter.deleteVerificationByIdentifier(state);
	}
	if (parsedData.expiresAt < Date.now()) throw new StateError("Invalid state: request expired", {
		code: "state_mismatch",
		details: { expiresAt: parsedData.expiresAt }
	});
	return parsedData;
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/context/global.mjs
var symbol = Symbol.for("better-auth:global");
var bind = null;
var __context = {};
var __betterAuthVersion = "1.6.10";
/**
* We store context instance in the globalThis.
*
* The reason we do this is that some bundlers, web framework, or package managers might
* create multiple copies of BetterAuth in the same process intentionally or unintentionally.
*
* For example, yarn v1, Next.js, SSR, Vite...
*
* @internal
*/
function __getBetterAuthGlobal() {
	if (!globalThis[symbol]) {
		globalThis[symbol] = {
			version: __betterAuthVersion,
			epoch: 1,
			context: __context
		};
		bind = globalThis[symbol];
	}
	bind = globalThis[symbol];
	if (bind.version !== __betterAuthVersion) {
		bind.version = __betterAuthVersion;
		bind.epoch++;
	}
	return globalThis[symbol];
}
function getBetterAuthVersion() {
	return __getBetterAuthGlobal().version;
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/async_hooks/index.mjs
var AsyncLocalStoragePromise = import(
	/* @vite-ignore */
	/* webpackIgnore: true */
	"node:async_hooks"
).then((mod) => mod.AsyncLocalStorage).catch((err) => {
	if ("AsyncLocalStorage" in globalThis) return globalThis.AsyncLocalStorage;
	if (typeof window !== "undefined") return null;
	console.warn("[better-auth] Warning: AsyncLocalStorage is not available in this environment. Some features may not work as expected.");
	console.warn("[better-auth] Please read more about this warning at https://better-auth.com/docs/installation#mount-handler");
	console.warn("[better-auth] If you are using Cloudflare Workers, please see: https://developers.cloudflare.com/workers/configuration/compatibility-flags/#nodejs-compatibility-flag");
	throw err;
});
async function getAsyncLocalStorage() {
	const mod = await AsyncLocalStoragePromise;
	if (mod === null) throw new Error("getAsyncLocalStorage is only available in server code");
	else return mod;
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/context/endpoint-context.mjs
var ensureAsyncStorage$2 = async () => {
	const betterAuthGlobal = __getBetterAuthGlobal();
	if (!betterAuthGlobal.context.endpointContextAsyncStorage) {
		const AsyncLocalStorage = await getAsyncLocalStorage();
		betterAuthGlobal.context.endpointContextAsyncStorage = new AsyncLocalStorage();
	}
	return betterAuthGlobal.context.endpointContextAsyncStorage;
};
async function getCurrentAuthContext() {
	const context = (await ensureAsyncStorage$2()).getStore();
	if (!context) throw new Error("No auth context found. Please make sure you are calling this function within a `runWithEndpointContext` callback.");
	return context;
}
async function runWithEndpointContext(context, fn) {
	return (await ensureAsyncStorage$2()).run(context, fn);
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/context/request-state.mjs
var ensureAsyncStorage$1 = async () => {
	const betterAuthGlobal = __getBetterAuthGlobal();
	if (!betterAuthGlobal.context.requestStateAsyncStorage) {
		const AsyncLocalStorage = await getAsyncLocalStorage();
		betterAuthGlobal.context.requestStateAsyncStorage = new AsyncLocalStorage();
	}
	return betterAuthGlobal.context.requestStateAsyncStorage;
};
async function hasRequestState() {
	return (await ensureAsyncStorage$1()).getStore() !== void 0;
}
async function getCurrentRequestState() {
	const store = (await ensureAsyncStorage$1()).getStore();
	if (!store) throw new Error("No request state found. Please make sure you are calling this function within a `runWithRequestState` callback.");
	return store;
}
async function runWithRequestState(store, fn) {
	return (await ensureAsyncStorage$1()).run(store, fn);
}
function defineRequestState(initFn) {
	const ref = Object.freeze({});
	return {
		get ref() {
			return ref;
		},
		async get() {
			const store = await getCurrentRequestState();
			if (!store.has(ref)) {
				const initialValue = await initFn();
				store.set(ref, initialValue);
				return initialValue;
			}
			return store.get(ref);
		},
		async set(value) {
			(await getCurrentRequestState()).set(ref, value);
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/context/transaction.mjs
var ensureAsyncStorage = async () => {
	const betterAuthGlobal = __getBetterAuthGlobal();
	if (!betterAuthGlobal.context.adapterAsyncStorage) {
		const AsyncLocalStorage = await getAsyncLocalStorage();
		betterAuthGlobal.context.adapterAsyncStorage = new AsyncLocalStorage();
	}
	return betterAuthGlobal.context.adapterAsyncStorage;
};
var getCurrentAdapter = async (fallback) => {
	return ensureAsyncStorage().then((als) => {
		return als.getStore()?.adapter || fallback;
	}).catch(() => {
		return fallback;
	});
};
var runWithAdapter = async (adapter, fn) => {
	let called = false;
	return ensureAsyncStorage().then(async (als) => {
		called = true;
		const pendingHooks = [];
		let result;
		let error;
		let hasError = false;
		try {
			result = await als.run({
				adapter,
				pendingHooks
			}, fn);
		} catch (err) {
			error = err;
			hasError = true;
		}
		for (const hook of pendingHooks) await hook();
		if (hasError) throw error;
		return result;
	}).catch((err) => {
		if (!called) return fn();
		throw err;
	});
};
var runWithTransaction = async (adapter, fn) => {
	let called = true;
	return ensureAsyncStorage().then(async (als) => {
		called = true;
		const pendingHooks = [];
		let result;
		let error;
		let hasError = false;
		try {
			result = await adapter.transaction(async (trx) => {
				return als.run({
					adapter: trx,
					pendingHooks
				}, fn);
			});
		} catch (e) {
			hasError = true;
			error = e;
		}
		for (const hook of pendingHooks) await hook();
		if (hasError) throw error;
		return result;
	}).catch((err) => {
		if (!called) return fn();
		throw err;
	});
};
/**
* Queue a hook to be executed after the current transaction commits.
* If not in a transaction, the hook will execute immediately.
*/
var queueAfterTransactionHook = async (hook) => {
	return ensureAsyncStorage().then((als) => {
		const store = als.getStore();
		if (store) store.pendingHooks.push(hook);
		else return hook();
	}).catch(() => {
		return hook();
	});
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/state/oauth.mjs
var { get: getOAuthState, set: setOAuthState } = defineRequestState(() => null);
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/oauth2/state.mjs
async function generateState(c, link, additionalData) {
	const callbackURL = c.body?.callbackURL || c.context.options.baseURL;
	if (!callbackURL) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.CALLBACK_URL_REQUIRED);
	const codeVerifier = generateRandomString(128);
	const stateData = {
		...additionalData ? additionalData : {},
		callbackURL,
		codeVerifier,
		errorURL: c.body?.errorCallbackURL,
		newUserURL: c.body?.newUserCallbackURL,
		link,
		expiresAt: Date.now() + 600 * 1e3,
		requestSignUp: c.body?.requestSignUp
	};
	await setOAuthState(stateData);
	try {
		return generateGenericState(c, stateData);
	} catch (error) {
		c.context.logger.error("Failed to create verification", error);
		throw new APIError("INTERNAL_SERVER_ERROR", {
			message: "Unable to create verification",
			cause: error
		});
	}
}
async function parseState(c) {
	const state = c.query.state || c.body?.state;
	const errorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
	let parsedData;
	try {
		parsedData = await parseGenericState(c, state);
	} catch (error) {
		c.context.logger.error("Failed to parse state", error);
		if (error instanceof StateError && error.code === "state_security_mismatch") throw c.redirect(`${errorURL}?error=state_mismatch`);
		throw c.redirect(`${errorURL}?error=please_restart_the_process`);
	}
	if (!parsedData.errorURL) parsedData.errorURL = errorURL;
	if (parsedData) await setOAuthState(parsedData);
	return parsedData;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/hide-metadata.mjs
var HIDE_METADATA = { scope: "server" };
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/utils.mjs
var jsonContentTypeRegex = /^application\/([a-z0-9.+-]*\+)?json/i;
async function getBody$1(request, allowedMediaTypes) {
	const contentType = request.headers.get("content-type") || "";
	const normalizedContentType = contentType.toLowerCase();
	if (!request.body) return;
	if (allowedMediaTypes && allowedMediaTypes.length > 0) {
		if (!allowedMediaTypes.some((allowed) => {
			const normalizedContentTypeBase = normalizedContentType.split(";")[0].trim();
			const normalizedAllowed = allowed.toLowerCase().trim();
			return normalizedContentTypeBase === normalizedAllowed || normalizedContentTypeBase.includes(normalizedAllowed);
		})) {
			if (!normalizedContentType) throw new APIError$1(415, {
				message: `Content-Type is required. Allowed types: ${allowedMediaTypes.join(", ")}`,
				code: "UNSUPPORTED_MEDIA_TYPE"
			});
			throw new APIError$1(415, {
				message: `Content-Type "${contentType}" is not allowed. Allowed types: ${allowedMediaTypes.join(", ")}`,
				code: "UNSUPPORTED_MEDIA_TYPE"
			});
		}
	}
	if (jsonContentTypeRegex.test(normalizedContentType)) return await request.json();
	if (normalizedContentType.includes("application/x-www-form-urlencoded")) {
		const formData = await request.formData();
		const result = {};
		formData.forEach((value, key) => {
			result[key] = value.toString();
		});
		return result;
	}
	if (normalizedContentType.includes("multipart/form-data")) {
		const formData = await request.formData();
		const result = {};
		formData.forEach((value, key) => {
			result[key] = value;
		});
		return result;
	}
	if (normalizedContentType.includes("text/plain")) return await request.text();
	if (normalizedContentType.includes("application/octet-stream")) return await request.arrayBuffer();
	if (normalizedContentType.includes("application/pdf") || normalizedContentType.includes("image/") || normalizedContentType.includes("video/")) return await request.blob();
	if (normalizedContentType.includes("application/stream") || request.body instanceof ReadableStream) return request.body;
	return await request.text();
}
function isAPIError$1(error) {
	return error instanceof APIError$1 || error?.name === "APIError";
}
function tryDecode$1(str) {
	try {
		return str.includes("%") ? decodeURIComponent(str) : str;
	} catch {
		return str;
	}
}
async function tryCatch(promise) {
	try {
		return {
			data: await promise,
			error: null
		};
	} catch (error) {
		return {
			data: null,
			error
		};
	}
}
/**
* Check if an object is a `Request`
* - `instanceof`: works for native Request instances
* - `toString`: handles where instanceof check fails but the object is still a valid Request
*/
function isRequest(obj) {
	return obj instanceof Request || Object.prototype.toString.call(obj) === "[object Request]";
}
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/to-response.mjs
function isJSONSerializable$1(value) {
	if (value === void 0) return false;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
	if (t !== "object") return false;
	if (Array.isArray(value)) return true;
	if (value.buffer) return false;
	return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
function safeStringify(obj, replacer, space) {
	let id = 0;
	const seen = /* @__PURE__ */ new WeakMap();
	const safeReplacer = (key, value) => {
		if (typeof value === "bigint") return value.toString();
		if (typeof value === "object" && value !== null) {
			if (seen.has(value)) return `[Circular ref-${seen.get(value)}]`;
			seen.set(value, id++);
		}
		if (replacer) return replacer(key, value);
		return value;
	};
	return JSON.stringify(obj, safeReplacer, space);
}
function isJSONResponse(value) {
	if (!value || typeof value !== "object") return false;
	return "_flag" in value && value._flag === "json";
}
/**
* Headers that MUST be stripped when building an HTTP response from
* arbitrary header input. These are request-only, hop-by-hop, or
* transport-managed headers that cause protocol violations when present
* on responses (e.g. Content-Length mismatch → net::ERR_CONTENT_LENGTH_MISMATCH).
*
* Sources:
*   - RFC 9110 §10.1   (Request Context Fields)
*   - RFC 9110 §7.6.1  (Connection / hop-by-hop)
*   - RFC 9110 §11.6-7 (Authentication credentials)
*   - RFC 9110 §12.5   (Content negotiation)
*   - RFC 9110 §13.1   (Conditional request headers)
*   - RFC 9110 §14.2   (Range requests)
*   - RFC 6265 §5.4    (Cookie)
*   - RFC 6454         (Origin)
*/
var REQUEST_ONLY_HEADERS = new Set([
	"host",
	"user-agent",
	"referer",
	"from",
	"expect",
	"authorization",
	"proxy-authorization",
	"cookie",
	"origin",
	"accept-charset",
	"accept-encoding",
	"accept-language",
	"if-match",
	"if-none-match",
	"if-modified-since",
	"if-unmodified-since",
	"if-range",
	"range",
	"max-forwards",
	"connection",
	"keep-alive",
	"transfer-encoding",
	"te",
	"upgrade",
	"trailer",
	"proxy-connection",
	"content-length"
]);
function stripRequestOnlyHeaders(headers) {
	for (const name of REQUEST_ONLY_HEADERS) headers.delete(name);
}
function toResponse(data, init) {
	if (data instanceof Response) {
		if (init?.headers) {
			const safeHeaders = new Headers(init.headers);
			stripRequestOnlyHeaders(safeHeaders);
			safeHeaders.forEach((value, key) => {
				data.headers.set(key, value);
			});
		}
		return data;
	}
	if (isJSONResponse(data)) {
		const body = data.body;
		const routerResponse = data.routerResponse;
		if (routerResponse instanceof Response) return routerResponse;
		const headers = new Headers();
		if (routerResponse?.headers) {
			const headers = new Headers(routerResponse.headers);
			for (const [key, value] of headers.entries()) headers.set(key, value);
		}
		if (data.headers) for (const [key, value] of new Headers(data.headers).entries()) headers.set(key, value);
		if (init?.headers) {
			const safeHeaders = new Headers(init.headers);
			stripRequestOnlyHeaders(safeHeaders);
			for (const [key, value] of safeHeaders.entries()) headers.set(key, value);
		}
		headers.set("Content-Type", "application/json");
		return new Response(JSON.stringify(body), {
			...routerResponse,
			headers,
			status: data.status ?? init?.status ?? routerResponse?.status,
			statusText: init?.statusText ?? routerResponse?.statusText
		});
	}
	if (isAPIError$1(data)) return toResponse(data.body, {
		status: init?.status ?? data.statusCode,
		statusText: data.status.toString(),
		headers: init?.headers || data.headers
	});
	let body = data;
	const headers = new Headers(init?.headers);
	stripRequestOnlyHeaders(headers);
	if (!data) {
		if (data === null) body = JSON.stringify(null);
		headers.set("content-type", "application/json");
	} else if (typeof data === "string") {
		body = data;
		headers.set("Content-Type", "text/plain");
	} else if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) {
		body = data;
		headers.set("Content-Type", "application/octet-stream");
	} else if (data instanceof Blob) {
		body = data;
		headers.set("Content-Type", data.type || "application/octet-stream");
	} else if (data instanceof FormData) body = data;
	else if (data instanceof URLSearchParams) {
		body = data;
		headers.set("Content-Type", "application/x-www-form-urlencoded");
	} else if (data instanceof ReadableStream) {
		body = data;
		headers.set("Content-Type", "application/octet-stream");
	} else if (isJSONSerializable$1(data)) {
		body = safeStringify(data);
		headers.set("Content-Type", "application/json");
	}
	return new Response(body, {
		...init,
		headers
	});
}
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/crypto.mjs
var algorithm = {
	name: "HMAC",
	hash: "SHA-256"
};
var getCryptoKey = async (secret) => {
	const secretBuf = typeof secret === "string" ? new TextEncoder().encode(secret) : secret;
	return await getWebcryptoSubtle().importKey("raw", secretBuf, algorithm, false, ["sign", "verify"]);
};
var verifySignature = async (base64Signature, value, secret) => {
	try {
		const signatureBinStr = atob(base64Signature);
		const signature = new Uint8Array(signatureBinStr.length);
		for (let i = 0, len = signatureBinStr.length; i < len; i++) signature[i] = signatureBinStr.charCodeAt(i);
		return await getWebcryptoSubtle().verify(algorithm, secret, signature, new TextEncoder().encode(value));
	} catch (e) {
		return false;
	}
};
var makeSignature = async (value, secret) => {
	const key = await getCryptoKey(secret);
	const signature = await getWebcryptoSubtle().sign(algorithm.name, key, new TextEncoder().encode(value));
	return btoa(String.fromCharCode(...new Uint8Array(signature)));
};
var signCookieValue = async (value, secret) => {
	const signature = await makeSignature(value, secret);
	value = `${value}.${signature}`;
	value = encodeURIComponent(value);
	return value;
};
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/cookies.mjs
var getCookieKey = (key, prefix) => {
	let finalKey = key;
	if (prefix) if (prefix === "secure") finalKey = "__Secure-" + key;
	else if (prefix === "host") finalKey = "__Host-" + key;
	else return;
	return finalKey;
};
/**
* Parse an HTTP Cookie header string and returning an object of all cookie
* name-value pairs.
*
* Inspired by https://github.com/unjs/cookie-es/blob/main/src/cookie/parse.ts
*
* @param str the string representing a `Cookie` header value
*/
function parseCookies(str) {
	if (typeof str !== "string") throw new TypeError("argument str must be a string");
	const cookies = /* @__PURE__ */ new Map();
	let index = 0;
	while (index < str.length) {
		const eqIdx = str.indexOf("=", index);
		if (eqIdx === -1) break;
		let endIdx = str.indexOf(";", index);
		if (endIdx === -1) endIdx = str.length;
		else if (endIdx < eqIdx) {
			index = str.lastIndexOf(";", eqIdx - 1) + 1;
			continue;
		}
		const key = str.slice(index, eqIdx).trim();
		if (!cookies.has(key)) {
			let val = str.slice(eqIdx + 1, endIdx).trim();
			if (val.codePointAt(0) === 34) val = val.slice(1, -1);
			cookies.set(key, tryDecode$1(val));
		}
		index = endIdx + 1;
	}
	return cookies;
}
var _serialize = (key, value, opt = {}) => {
	let cookie;
	if (opt?.prefix === "secure") cookie = `${`__Secure-${key}`}=${value}`;
	else if (opt?.prefix === "host") cookie = `${`__Host-${key}`}=${value}`;
	else cookie = `${key}=${value}`;
	if (key.startsWith("__Secure-") && !opt.secure) opt.secure = true;
	if (key.startsWith("__Host-")) {
		if (!opt.secure) opt.secure = true;
		if (opt.path !== "/") opt.path = "/";
		if (opt.domain) opt.domain = void 0;
	}
	if (opt && typeof opt.maxAge === "number" && opt.maxAge >= 0) {
		if (opt.maxAge > 3456e4) throw new Error("Cookies Max-Age SHOULD NOT be greater than 400 days (34560000 seconds) in duration.");
		cookie += `; Max-Age=${Math.floor(opt.maxAge)}`;
	}
	if (opt.domain && opt.prefix !== "host") cookie += `; Domain=${opt.domain}`;
	if (opt.path) cookie += `; Path=${opt.path}`;
	if (opt.expires) {
		if (opt.expires.getTime() - Date.now() > 3456e7) throw new Error("Cookies Expires SHOULD NOT be greater than 400 days (34560000 seconds) in the future.");
		cookie += `; Expires=${opt.expires.toUTCString()}`;
	}
	if (opt.httpOnly) cookie += "; HttpOnly";
	if (opt.secure) cookie += "; Secure";
	if (opt.sameSite) cookie += `; SameSite=${opt.sameSite.charAt(0).toUpperCase() + opt.sameSite.slice(1)}`;
	if (opt.partitioned) {
		if (!opt.secure) opt.secure = true;
		cookie += "; Partitioned";
	}
	return cookie;
};
var serializeCookie = (key, value, opt) => {
	value = encodeURIComponent(value);
	return _serialize(key, value, opt);
};
var serializeSignedCookie = async (key, value, secret, opt) => {
	value = await signCookieValue(value, secret);
	return _serialize(key, value, opt);
};
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/validator.mjs
/**
* Runs validation on body and query
* @returns error and data object
*/
async function runValidation(options, context = {}) {
	let request = {
		body: context.body,
		query: context.query
	};
	if (options.body) {
		const result = await options.body["~standard"].validate(context.body);
		if (result.issues) return {
			data: null,
			error: fromError(result.issues, "body")
		};
		request.body = result.value;
	}
	if (options.query) {
		const result = await options.query["~standard"].validate(context.query);
		if (result.issues) return {
			data: null,
			error: fromError(result.issues, "query")
		};
		request.query = result.value;
	}
	if (options.requireHeaders && !context.headers) return {
		data: null,
		error: {
			message: "Headers is required",
			issues: []
		}
	};
	if (options.requireRequest && !context.request) return {
		data: null,
		error: {
			message: "Request is required",
			issues: []
		}
	};
	return {
		data: request,
		error: null
	};
}
function fromError(error, validating) {
	return {
		message: error.map((e) => {
			return `[${e.path?.length ? `${validating}.` + e.path.map((x) => typeof x === "object" ? x.key : x).join(".") : validating}] ${e.message}`;
		}).join("; "),
		issues: error
	};
}
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/context.mjs
var createInternalContext = async (context, { options, path }) => {
	const headers = new Headers();
	let responseStatus = void 0;
	const { data, error } = await runValidation(options, context);
	if (error) throw new ValidationError$1(error.message, error.issues);
	const requestHeaders = "headers" in context ? context.headers instanceof Headers ? context.headers : new Headers(context.headers) : "request" in context && isRequest(context.request) ? context.request.headers : null;
	const requestCookies = requestHeaders?.get("cookie");
	const parsedCookies = requestCookies ? parseCookies(requestCookies) : void 0;
	const internalContext = {
		...context,
		body: data.body,
		query: data.query,
		path: context.path || path || "virtual:",
		context: "context" in context && context.context ? context.context : {},
		returned: void 0,
		headers: context?.headers,
		request: context?.request,
		params: "params" in context ? context.params : void 0,
		method: context.method ?? (Array.isArray(options.method) ? options.method[0] : options.method === "*" ? "GET" : options.method),
		setHeader: (key, value) => {
			headers.set(key, value);
		},
		getHeader: (key) => {
			if (!requestHeaders) return null;
			return requestHeaders.get(key);
		},
		getCookie: (key, prefix) => {
			const finalKey = getCookieKey(key, prefix);
			if (!finalKey) return null;
			return parsedCookies?.get(finalKey) || null;
		},
		getSignedCookie: async (key, secret, prefix) => {
			const finalKey = getCookieKey(key, prefix);
			if (!finalKey) return null;
			const value = parsedCookies?.get(finalKey);
			if (!value) return null;
			const signatureStartPos = value.lastIndexOf(".");
			if (signatureStartPos < 1) return null;
			const signedValue = value.substring(0, signatureStartPos);
			const signature = value.substring(signatureStartPos + 1);
			if (signature.length !== 44 || !signature.endsWith("=")) return null;
			return await verifySignature(signature, signedValue, await getCryptoKey(secret)) ? signedValue : false;
		},
		setCookie: (key, value, options) => {
			const cookie = serializeCookie(key, value, options);
			headers.append("set-cookie", cookie);
			return cookie;
		},
		setSignedCookie: async (key, value, secret, options) => {
			const cookie = await serializeSignedCookie(key, value, secret, options);
			headers.append("set-cookie", cookie);
			return cookie;
		},
		redirect: (url) => {
			headers.set("location", url);
			return new APIError$1("FOUND", void 0, headers);
		},
		error: (status, body, headers) => {
			return new APIError$1(status, body, headers);
		},
		setStatus: (status) => {
			responseStatus = status;
		},
		json: (json, routerResponse) => {
			if (!context.asResponse) return json;
			return {
				body: routerResponse?.body || json,
				routerResponse,
				_flag: "json"
			};
		},
		responseHeaders: headers,
		get responseStatus() {
			return responseStatus;
		}
	};
	for (const middleware of options.use || []) {
		const response = await middleware({
			...internalContext,
			returnHeaders: true,
			asResponse: false
		});
		if (response.response) Object.assign(internalContext.context, response.response);
		/**
		* Apply headers from the middleware to the endpoint headers
		*/
		if (response.headers) response.headers.forEach((value, key) => {
			internalContext.responseHeaders.set(key, value);
		});
	}
	return internalContext;
};
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/endpoint.mjs
function createEndpoint(pathOrOptions, handlerOrOptions, handlerOrNever) {
	const path = typeof pathOrOptions === "string" ? pathOrOptions : void 0;
	const options = typeof handlerOrOptions === "object" ? handlerOrOptions : pathOrOptions;
	const handler = typeof handlerOrOptions === "function" ? handlerOrOptions : handlerOrNever;
	if ((options.method === "GET" || options.method === "HEAD") && options.body) throw new BetterCallError("Body is not allowed with GET or HEAD methods");
	if (path && /\/{2,}/.test(path)) throw new BetterCallError("Path cannot contain consecutive slashes");
	const internalHandler = async (...inputCtx) => {
		const context = inputCtx[0] || {};
		const { data: internalContext, error: validationError } = await tryCatch(createInternalContext(context, {
			options,
			path
		}));
		if (validationError) {
			if (!(validationError instanceof ValidationError$1)) throw validationError;
			if (options.onValidationError) await options.onValidationError({
				message: validationError.message,
				issues: validationError.issues
			});
			throw new APIError$1(400, {
				message: validationError.message,
				code: "VALIDATION_ERROR"
			});
		}
		const response = await handler(internalContext).catch(async (e) => {
			if (isAPIError$1(e)) {
				const onAPIError = options.onAPIError;
				if (onAPIError) await onAPIError(e);
				if (context.asResponse) return e;
			}
			throw e;
		});
		const headers = internalContext.responseHeaders;
		const status = internalContext.responseStatus;
		return context.asResponse ? toResponse(response, {
			headers,
			status
		}) : context.returnHeaders ? context.returnStatus ? {
			headers,
			response,
			status
		} : {
			headers,
			response
		} : context.returnStatus ? {
			response,
			status
		} : response;
	};
	internalHandler.options = options;
	internalHandler.path = path;
	return internalHandler;
}
createEndpoint.create = (opts) => {
	return (path, options, handler) => {
		return createEndpoint(path, {
			...options,
			use: [...options?.use || [], ...opts?.use || []]
		}, handler);
	};
};
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/middleware.mjs
function createMiddleware(optionsOrHandler, handler) {
	const internalHandler = async (inputCtx) => {
		const context = inputCtx;
		const _handler = typeof optionsOrHandler === "function" ? optionsOrHandler : handler;
		const internalContext = await createInternalContext(context, {
			options: typeof optionsOrHandler === "function" ? {} : optionsOrHandler,
			path: "/"
		});
		if (!_handler) throw new Error("handler must be defined");
		try {
			const response = await _handler(internalContext);
			const headers = internalContext.responseHeaders;
			return context.returnHeaders ? {
				headers,
				response
			} : response;
		} catch (e) {
			if (isAPIError$1(e)) Object.defineProperty(e, kAPIErrorHeaderSymbol, {
				enumerable: false,
				configurable: true,
				get() {
					return internalContext.responseHeaders;
				}
			});
			throw e;
		}
	};
	internalHandler.options = typeof optionsOrHandler === "function" ? {} : optionsOrHandler;
	return internalHandler;
}
createMiddleware.create = (opts) => {
	function fn(optionsOrHandler, handler) {
		if (typeof optionsOrHandler === "function") return createMiddleware({ use: opts?.use }, optionsOrHandler);
		if (!handler) throw new Error("Middleware handler is required");
		return createMiddleware({
			...optionsOrHandler,
			method: "*",
			use: [...opts?.use || [], ...optionsOrHandler.use || []]
		}, handler);
	}
	return fn;
};
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/openapi.mjs
var paths = {};
function getTypeFromZodType(zodType) {
	switch (zodType.constructor.name) {
		case "ZodString": return "string";
		case "ZodNumber": return "number";
		case "ZodBoolean": return "boolean";
		case "ZodObject": return "object";
		case "ZodArray": return "array";
		default: return "string";
	}
}
function getParameters(options) {
	const parameters = [];
	if (options.metadata?.openapi?.parameters) {
		parameters.push(...options.metadata.openapi.parameters);
		return parameters;
	}
	if (options.query instanceof ZodObject) Object.entries(options.query.shape).forEach(([key, value]) => {
		if (value instanceof ZodObject) parameters.push({
			name: key,
			in: "query",
			schema: {
				type: getTypeFromZodType(value),
				..."minLength" in value && value.minLength ? { minLength: value.minLength } : {},
				description: value.description
			}
		});
	});
	return parameters;
}
function getRequestBody(options) {
	if (options.metadata?.openapi?.requestBody) return options.metadata.openapi.requestBody;
	if (!options.body) return void 0;
	if (options.body instanceof ZodObject || options.body instanceof ZodOptional) {
		const shape = options.body.shape;
		if (!shape) return void 0;
		const properties = {};
		const required = [];
		Object.entries(shape).forEach(([key, value]) => {
			if (value instanceof ZodObject) {
				properties[key] = {
					type: getTypeFromZodType(value),
					description: value.description
				};
				if (!(value instanceof ZodOptional)) required.push(key);
			}
		});
		return {
			required: options.body instanceof ZodOptional ? false : options.body ? true : false,
			content: { "application/json": { schema: {
				type: "object",
				properties,
				required
			} } }
		};
	}
}
function getResponse(responses) {
	return {
		"400": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } },
				required: ["message"]
			} } },
			description: "Bad Request. Usually due to missing parameters, or invalid parameters."
		},
		"401": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } },
				required: ["message"]
			} } },
			description: "Unauthorized. Due to missing or invalid authentication."
		},
		"403": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Forbidden. You do not have permission to access this resource or to perform this action."
		},
		"404": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Not Found. The requested resource was not found."
		},
		"429": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Too Many Requests. You have exceeded the rate limit. Try again later."
		},
		"500": {
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: { type: "string" } }
			} } },
			description: "Internal Server Error. This is a problem with the server that you cannot fix."
		},
		...responses
	};
}
async function generator(endpoints, config) {
	const components = { schemas: {} };
	Object.entries(endpoints).forEach(([_, value]) => {
		const options = value.options;
		if (!value.path || options.metadata?.SERVER_ONLY) return;
		if (options.method === "GET") paths[value.path] = { get: {
			tags: ["Default", ...options.metadata?.openapi?.tags || []],
			description: options.metadata?.openapi?.description,
			operationId: options.metadata?.openapi?.operationId,
			security: [{ bearerAuth: [] }],
			parameters: getParameters(options),
			responses: getResponse(options.metadata?.openapi?.responses)
		} };
		if (options.method === "POST") {
			const body = getRequestBody(options);
			paths[value.path] = { post: {
				tags: ["Default", ...options.metadata?.openapi?.tags || []],
				description: options.metadata?.openapi?.description,
				operationId: options.metadata?.openapi?.operationId,
				security: [{ bearerAuth: [] }],
				parameters: getParameters(options),
				...body ? { requestBody: body } : { requestBody: { content: { "application/json": { schema: {
					type: "object",
					properties: {}
				} } } } },
				responses: getResponse(options.metadata?.openapi?.responses)
			} };
		}
	});
	return {
		openapi: "3.1.1",
		info: {
			title: "Better Auth",
			description: "API Reference for your Better Auth Instance",
			version: "1.1.0"
		},
		components,
		security: [{ apiKeyCookie: [] }],
		servers: [{ url: config?.url }],
		tags: [{
			name: "Default",
			description: "Default endpoints that are included with Better Auth by default. These endpoints are not part of any plugin."
		}],
		paths
	};
}
var getHTML = (apiReference, config) => `<!doctype html>
<html>
  <head>
    <title>Scalar API Reference</title>
    <meta charset="utf-8" />
    <meta
      name="viewport"
      content="width=device-width, initial-scale=1" />
  </head>
  <body>
    <script
      id="api-reference"
      type="application/json">
    ${JSON.stringify(apiReference)}
    <\/script>
	 <script>
      var configuration = {
	  	favicon: ${config?.logo ? `data:image/svg+xml;utf8,${encodeURIComponent(config.logo)}` : void 0} ,
	   	theme: ${config?.theme || "saturn"},
        metaData: {
			title: ${config?.title || "Open API Reference"},
			description: ${config?.description || "Better Call Open API"},
		}
      }
      document.getElementById('api-reference').dataset.configuration =
        JSON.stringify(configuration)
    <\/script>
	  <script src="https://cdn.jsdelivr.net/npm/@scalar/api-reference"><\/script>
  </body>
</html>`;
//#endregion
//#region ../../node_modules/.pnpm/rou3@0.7.12/node_modules/rou3/dist/index.mjs
var NullProtoObj = /* @__PURE__ */ (() => {
	const e = function() {};
	return e.prototype = Object.create(null), Object.freeze(e.prototype), e;
})();
/**
* Create a new router context.
*/
function createRouter() {
	return {
		root: { key: "" },
		static: new NullProtoObj()
	};
}
function splitPath(path) {
	const [_, ...s] = path.split("/");
	return s[s.length - 1] === "" ? s.slice(0, -1) : s;
}
function getMatchParams(segments, paramsMap) {
	const params = new NullProtoObj();
	for (const [index, name] of paramsMap) {
		const segment = index < 0 ? segments.slice(-(index + 1)).join("/") : segments[index];
		if (typeof name === "string") params[name] = segment;
		else {
			const match = segment.match(name);
			if (match) for (const key in match.groups) params[key] = match.groups[key];
		}
	}
	return params;
}
/**
* Add a route to the router context.
*/
function addRoute(ctx, method = "", path, data) {
	method = method.toUpperCase();
	if (path.charCodeAt(0) !== 47) path = `/${path}`;
	path = path.replace(/\\:/g, "%3A");
	const segments = splitPath(path);
	let node = ctx.root;
	let _unnamedParamIndex = 0;
	const paramsMap = [];
	const paramsRegexp = [];
	for (let i = 0; i < segments.length; i++) {
		let segment = segments[i];
		if (segment.startsWith("**")) {
			if (!node.wildcard) node.wildcard = { key: "**" };
			node = node.wildcard;
			paramsMap.push([
				-(i + 1),
				segment.split(":")[1] || "_",
				segment.length === 2
			]);
			break;
		}
		if (segment === "*" || segment.includes(":")) {
			if (!node.param) node.param = { key: "*" };
			node = node.param;
			if (segment === "*") paramsMap.push([
				i,
				`_${_unnamedParamIndex++}`,
				true
			]);
			else if (segment.includes(":", 1)) {
				const regexp = getParamRegexp(segment);
				paramsRegexp[i] = regexp;
				node.hasRegexParam = true;
				paramsMap.push([
					i,
					regexp,
					false
				]);
			} else paramsMap.push([
				i,
				segment.slice(1),
				false
			]);
			continue;
		}
		if (segment === "\\*") segment = segments[i] = "*";
		else if (segment === "\\*\\*") segment = segments[i] = "**";
		const child = node.static?.[segment];
		if (child) node = child;
		else {
			const staticNode = { key: segment };
			if (!node.static) node.static = new NullProtoObj();
			node.static[segment] = staticNode;
			node = staticNode;
		}
	}
	const hasParams = paramsMap.length > 0;
	if (!node.methods) node.methods = new NullProtoObj();
	node.methods[method] ??= [];
	node.methods[method].push({
		data: data || null,
		paramsRegexp,
		paramsMap: hasParams ? paramsMap : void 0
	});
	if (!hasParams) ctx.static["/" + segments.join("/")] = node;
}
function getParamRegexp(segment) {
	const regex = segment.replace(/:(\w+)/g, (_, id) => `(?<${id}>[^/]+)`).replace(/\./g, "\\.");
	return /* @__PURE__ */ new RegExp(`^${regex}$`);
}
/**
* Find a route by path.
*/
function findRoute(ctx, method = "", path, opts) {
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const staticNode = ctx.static[path];
	if (staticNode && staticNode.methods) {
		const staticMatch = staticNode.methods[method] || staticNode.methods[""];
		if (staticMatch !== void 0) return staticMatch[0];
	}
	const segments = splitPath(path);
	const match = _lookupTree(ctx, ctx.root, method, segments, 0)?.[0];
	if (match === void 0) return;
	if (opts?.params === false) return match;
	return {
		data: match.data,
		params: match.paramsMap ? getMatchParams(segments, match.paramsMap) : void 0
	};
}
function _lookupTree(ctx, node, method, segments, index) {
	if (index === segments.length) {
		if (node.methods) {
			const match = node.methods[method] || node.methods[""];
			if (match) return match;
		}
		if (node.param && node.param.methods) {
			const match = node.param.methods[method] || node.param.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) return match;
			}
		}
		if (node.wildcard && node.wildcard.methods) {
			const match = node.wildcard.methods[method] || node.wildcard.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) return match;
			}
		}
		return;
	}
	const segment = segments[index];
	if (node.static) {
		const staticChild = node.static[segment];
		if (staticChild) {
			const match = _lookupTree(ctx, staticChild, method, segments, index + 1);
			if (match) return match;
		}
	}
	if (node.param) {
		const match = _lookupTree(ctx, node.param, method, segments, index + 1);
		if (match) {
			if (node.param.hasRegexParam) {
				const exactMatch = match.find((m) => m.paramsRegexp[index]?.test(segment)) || match.find((m) => !m.paramsRegexp[index]);
				return exactMatch ? [exactMatch] : void 0;
			}
			return match;
		}
	}
	if (node.wildcard && node.wildcard.methods) return node.wildcard.methods[method] || node.wildcard.methods[""];
}
/**
* Find all route patterns that match the given path.
*/
function findAllRoutes(ctx, method = "", path, opts) {
	if (path.charCodeAt(path.length - 1) === 47) path = path.slice(0, -1);
	const segments = splitPath(path);
	const matches = _findAll(ctx, ctx.root, method, segments, 0);
	if (opts?.params === false) return matches;
	return matches.map((m) => {
		return {
			data: m.data,
			params: m.paramsMap ? getMatchParams(segments, m.paramsMap) : void 0
		};
	});
}
function _findAll(ctx, node, method, segments, index, matches = []) {
	const segment = segments[index];
	if (node.wildcard && node.wildcard.methods) {
		const match = node.wildcard.methods[method] || node.wildcard.methods[""];
		if (match) matches.push(...match);
	}
	if (node.param) {
		_findAll(ctx, node.param, method, segments, index + 1, matches);
		if (index === segments.length && node.param.methods) {
			const match = node.param.methods[method] || node.param.methods[""];
			if (match) {
				const pMap = match[0].paramsMap;
				if (pMap?.[pMap?.length - 1]?.[2]) matches.push(...match);
			}
		}
	}
	const staticChild = node.static?.[segment];
	if (staticChild) _findAll(ctx, staticChild, method, segments, index + 1, matches);
	if (index === segments.length && node.methods) {
		const match = node.methods[method] || node.methods[""];
		if (match) matches.push(...match);
	}
	return matches;
}
//#endregion
//#region ../../node_modules/.pnpm/better-call@1.3.5_zod@4.4.3/node_modules/better-call/dist/router.mjs
var createRouter$1 = (endpoints, config) => {
	if (!config?.openapi?.disabled) {
		const openapi = {
			path: "/api/reference",
			...config?.openapi
		};
		endpoints["openapi"] = createEndpoint(openapi.path, { method: "GET" }, async (c) => {
			const schema = await generator(endpoints);
			return new Response(getHTML(schema, openapi.scalar), { headers: { "Content-Type": "text/html" } });
		});
	}
	const router = createRouter();
	const middlewareRouter = createRouter();
	for (const endpoint of Object.values(endpoints)) {
		if (!endpoint.options || !endpoint.path) continue;
		if (endpoint.options?.metadata?.SERVER_ONLY) continue;
		const methods = Array.isArray(endpoint.options?.method) ? endpoint.options.method : [endpoint.options?.method];
		for (const method of methods) addRoute(router, method, endpoint.path, endpoint);
	}
	if (config?.routerMiddleware?.length) for (const { path, middleware } of config.routerMiddleware) addRoute(middlewareRouter, "*", path, middleware);
	const processRequest = async (request) => {
		const url = new URL(request.url);
		const pathname = url.pathname;
		const path = config?.basePath && config.basePath !== "/" ? pathname.split(config.basePath).reduce((acc, curr, index) => {
			if (index !== 0) if (index > 1) acc.push(`${config.basePath}${curr}`);
			else acc.push(curr);
			return acc;
		}, []).join("") : url.pathname;
		if (!path?.length) return new Response(null, {
			status: 404,
			statusText: "Not Found"
		});
		if (/\/{2,}/.test(path)) return new Response(null, {
			status: 404,
			statusText: "Not Found"
		});
		const route = findRoute(router, request.method, path);
		if (path.endsWith("/") !== route?.data?.path?.endsWith("/") && !config?.skipTrailingSlashes) return new Response(null, {
			status: 404,
			statusText: "Not Found"
		});
		if (!route?.data) return new Response(null, {
			status: 404,
			statusText: "Not Found"
		});
		const query = {};
		url.searchParams.forEach((value, key) => {
			if (key in query) if (Array.isArray(query[key])) query[key].push(value);
			else query[key] = [query[key], value];
			else query[key] = value;
		});
		const handler = route.data;
		try {
			const allowedMediaTypes = handler.options.metadata?.allowedMediaTypes || config?.allowedMediaTypes;
			const context = {
				path,
				method: request.method,
				headers: request.headers,
				params: route.params ? JSON.parse(JSON.stringify(route.params)) : {},
				request,
				body: handler.options.disableBody ? void 0 : await getBody$1(handler.options.cloneRequest ? request.clone() : request, allowedMediaTypes),
				query,
				_flag: "router",
				asResponse: true,
				context: config?.routerContext
			};
			const middlewareRoutes = findAllRoutes(middlewareRouter, "*", path);
			if (middlewareRoutes?.length) for (const { data: middleware, params } of middlewareRoutes) {
				const res = await middleware({
					...context,
					params,
					asResponse: false
				});
				if (res instanceof Response) return res;
			}
			return await handler(context);
		} catch (error) {
			if (config?.onError) try {
				const errorResponse = await config.onError(error, request);
				if (errorResponse instanceof Response) return toResponse(errorResponse);
			} catch (error) {
				if (isAPIError$1(error)) return toResponse(error);
				throw error;
			}
			if (config?.throwError) throw error;
			if (isAPIError$1(error)) return toResponse(error);
			console.error(`# SERVER_ERROR: `, error);
			return new Response(null, {
				status: 500,
				statusText: "Internal Server Error"
			});
		}
	};
	return {
		handler: async (request) => {
			const onReq = await config?.onRequest?.(request);
			if (onReq instanceof Response) return onReq;
			const req = isRequest(onReq) ? onReq : request;
			const res = await processRequest(req);
			const onRes = await config?.onResponse?.(res, req);
			if (onRes instanceof Response) return onRes;
			return res;
		},
		endpoints
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/utils/is-api-error.mjs
function isAPIError(error) {
	return error instanceof APIError$1 || error instanceof APIError || error?.name === "APIError";
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/api/index.mjs
/**
* Better-call's createEndpoint re-throws APIError without exposing the headers
* accumulated on ctx.responseHeaders (e.g. Set-Cookie from deleteSessionCookie
* before throw). Attach them to the error via kAPIErrorHeaderSymbol — matching
* better-call's createMiddleware contract so the outer pipeline can merge them
* into the response.
*/
function attachResponseHeadersToAPIError(responseHeaders, e) {
	if (!isAPIError(e) || !responseHeaders) return;
	Object.defineProperty(e, kAPIErrorHeaderSymbol, {
		enumerable: false,
		configurable: true,
		value: responseHeaders,
		writable: false
	});
}
var optionsMiddleware = createMiddleware(async () => {
	/**
	* This will be passed on the instance of
	* the context. Used to infer the type
	* here.
	*/
	return {};
});
var createAuthMiddleware = createMiddleware.create({ use: [optionsMiddleware, createMiddleware(async () => {
	return {};
})] });
var use = [optionsMiddleware];
function createAuthEndpoint(pathOrOptions, handlerOrOptions, handlerOrNever) {
	const path = typeof pathOrOptions === "string" ? pathOrOptions : void 0;
	const options = typeof handlerOrOptions === "object" ? handlerOrOptions : pathOrOptions;
	const handler = typeof handlerOrOptions === "function" ? handlerOrOptions : handlerOrNever;
	const wrapped = async (ctx) => {
		const runtimeCtx = ctx;
		try {
			return await runWithEndpointContext(ctx, () => handler(ctx));
		} catch (e) {
			attachResponseHeadersToAPIError(runtimeCtx.responseHeaders, e);
			throw e;
		}
	};
	if (path) return createEndpoint(path, {
		...options,
		use: [...options?.use || [], ...use]
	}, wrapped);
	return createEndpoint({
		...options,
		use: [...options?.use || [], ...use]
	}, wrapped);
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/auth/trusted-origins.mjs
/**
* Matches the given url against an origin or origin pattern
* See "options.trustedOrigins" for details of supported patterns
*
* @param url The url to test
* @param pattern The origin pattern
* @param [settings] Specify supported pattern matching settings
* @returns {boolean} true if the URL matches the origin pattern, false otherwise.
*/
var matchesOriginPattern = (url, pattern, settings) => {
	if (url.startsWith("/")) {
		if (settings?.allowRelativePaths) return url.startsWith("/") && /^\/(?!\/|\\|%2f|%5c)[\w\-.\+/@]*(?:\?[\w\-.\+/=&%@]*)?$/.test(url);
		return false;
	}
	if (pattern.includes("*") || pattern.includes("?")) {
		if (pattern.includes("://")) return wildcardMatch(pattern)(getOrigin$1(url) || url);
		const host = getHost(url);
		if (!host) return false;
		return wildcardMatch(pattern)(host);
	}
	const protocol = getProtocol(url);
	return protocol === "http:" || protocol === "https:" || !protocol ? pattern === getOrigin$1(url) : url.startsWith(pattern);
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/utils/url.mjs
/**
* Normalizes a request pathname by removing the basePath prefix and trailing slashes.
* This is useful for matching paths against configured path lists.
*
* @param requestUrl - The full request URL
* @param basePath - The base path of the auth API (e.g., "/api/auth")
* @returns The normalized path without basePath prefix or trailing slashes,
*          or "/" if URL parsing fails
*
* @example
* normalizePathname("http://localhost:3000/api/auth/sso/saml2/callback/provider1", "/api/auth")
* // Returns: "/sso/saml2/callback/provider1"
*
* normalizePathname("http://localhost:3000/sso/saml2/callback/provider1/", "/")
* // Returns: "/sso/saml2/callback/provider1"
*/
function normalizePathname(requestUrl, basePath) {
	let pathname;
	try {
		pathname = new URL(requestUrl).pathname.replace(/\/+$/, "") || "/";
	} catch {
		return "/";
	}
	if (basePath === "/" || basePath === "") return pathname;
	if (pathname === basePath) return "/";
	if (pathname.startsWith(basePath + "/")) return pathname.slice(basePath.length).replace(/\/+$/, "") || "/";
	return pathname;
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/utils/deprecate.mjs
/**
* Wraps a function to log a deprecation warning at once.
*/
function deprecate(fn, message, logger) {
	let warned = false;
	return function(...args) {
		if (!warned) {
			(logger?.warn ?? console.warn)(`[Deprecation] ${message}`);
			warned = true;
		}
		return fn.apply(this, args);
	};
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/middlewares/origin-check.mjs
/**
* Checks if CSRF should be skipped for backward compatibility.
* Previously, disableOriginCheck also disabled CSRF checks.
* This maintains that behavior when disableCSRFCheck isn't explicitly set.
* Only triggers for skipOriginCheck === true, not for path arrays.
*/
function shouldSkipCSRFForBackwardCompat(ctx) {
	return ctx.context.skipOriginCheck === true && ctx.context.options.advanced?.disableCSRFCheck === void 0;
}
/**
* Checks if the origin check should be skipped for the current request.
* Handles both boolean (skip all) and array (skip specific paths) configurations.
*/
function shouldSkipOriginCheck(ctx) {
	const skipOriginCheck = ctx.context.skipOriginCheck;
	if (skipOriginCheck === true) return true;
	if (Array.isArray(skipOriginCheck) && ctx.request) try {
		const basePath = new URL(ctx.context.baseURL).pathname;
		const currentPath = normalizePathname(ctx.request.url, basePath);
		return skipOriginCheck.some((skipPath) => currentPath.startsWith(skipPath));
	} catch {}
	return false;
}
/**
* Logs deprecation warning for users relying on coupled behavior.
* Only logs if user explicitly set disableOriginCheck (not test environment default).
*/
var logBackwardCompatWarning = deprecate(function logBackwardCompatWarning() {}, "disableOriginCheck: true currently also disables CSRF checks. In a future version, disableOriginCheck will ONLY disable URL validation. To keep CSRF disabled, add disableCSRFCheck: true to your config.");
/**
* A middleware to validate callbackURL and origin against trustedOrigins.
* Also handles CSRF protection using Fetch Metadata for first-login scenarios.
*/
var originCheckMiddleware = createAuthMiddleware(async (ctx) => {
	if (ctx.request?.method === "GET" || ctx.request?.method === "OPTIONS" || ctx.request?.method === "HEAD" || !ctx.request) return;
	await validateOrigin(ctx);
	if (shouldSkipOriginCheck(ctx)) return;
	const { body, query } = ctx;
	const callbackURL = body?.callbackURL || query?.callbackURL;
	const redirectURL = body?.redirectTo;
	const errorCallbackURL = body?.errorCallbackURL;
	const newUserCallbackURL = body?.newUserCallbackURL;
	const validateURL = (url, label) => {
		if (!url) return;
		if (!ctx.context.isTrustedOrigin(url, { allowRelativePaths: label !== "origin" })) {
			ctx.context.logger.error(`Invalid ${label}: ${url}`);
			ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config\n`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
			if (label === "origin") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ORIGIN);
			if (label === "callbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_CALLBACK_URL);
			if (label === "redirectURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_REDIRECT_URL);
			if (label === "errorCallbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ERROR_CALLBACK_URL);
			if (label === "newUserCallbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_NEW_USER_CALLBACK_URL);
			throw APIError.fromStatus("FORBIDDEN", { message: `Invalid ${label}` });
		}
	};
	callbackURL && validateURL(callbackURL, "callbackURL");
	redirectURL && validateURL(redirectURL, "redirectURL");
	errorCallbackURL && validateURL(errorCallbackURL, "errorCallbackURL");
	newUserCallbackURL && validateURL(newUserCallbackURL, "newUserCallbackURL");
});
var originCheck = (getValue) => createAuthMiddleware(async (ctx) => {
	if (!ctx.request) return;
	if (shouldSkipOriginCheck(ctx)) return;
	const callbackURL = getValue(ctx);
	const validateURL = (url, label) => {
		if (!url) return;
		if (!ctx.context.isTrustedOrigin(url, { allowRelativePaths: label !== "origin" })) {
			ctx.context.logger.error(`Invalid ${label}: ${url}`);
			ctx.context.logger.info(`If it's a valid URL, please add ${url} to trustedOrigins in your auth config\n`, `Current list of trustedOrigins: ${ctx.context.trustedOrigins}`);
			if (label === "origin") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ORIGIN);
			if (label === "callbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_CALLBACK_URL);
			if (label === "redirectURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_REDIRECT_URL);
			if (label === "errorCallbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ERROR_CALLBACK_URL);
			if (label === "newUserCallbackURL") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_NEW_USER_CALLBACK_URL);
			throw APIError.fromStatus("FORBIDDEN", { message: `Invalid ${label}` });
		}
	};
	const callbacks = Array.isArray(callbackURL) ? callbackURL : [callbackURL];
	for (const url of callbacks) validateURL(url, "callbackURL");
});
/**
* Validates origin header against trusted origins.
* @param ctx - The endpoint context
* @param forceValidate - If true, always validate origin regardless of cookies/skip flags
*/
async function validateOrigin(ctx, forceValidate = false) {
	const headers = ctx.request?.headers;
	if (!headers || !ctx.request) return;
	const originHeader = headers.get("origin") || headers.get("referer") || "";
	const useCookies = headers.has("cookie");
	if (ctx.context.skipCSRFCheck) return;
	if (shouldSkipCSRFForBackwardCompat(ctx)) {
		ctx.context.options.advanced?.disableOriginCheck === true && logBackwardCompatWarning();
		return;
	}
	if (shouldSkipOriginCheck(ctx)) return;
	if (!(forceValidate || useCookies)) return;
	if (!originHeader || originHeader === "null") throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.MISSING_OR_NULL_ORIGIN);
	const trustedOrigins = Array.isArray(ctx.context.options.trustedOrigins) ? ctx.context.trustedOrigins : [...ctx.context.trustedOrigins, ...(await ctx.context.options.trustedOrigins?.(ctx.request))?.filter((v) => Boolean(v)) || []];
	if (!trustedOrigins.some((origin) => matchesOriginPattern(originHeader, origin))) {
		ctx.context.logger.error(`Invalid origin: ${originHeader}`);
		ctx.context.logger.info(`If it's a valid URL, please add ${originHeader} to trustedOrigins in your auth config\n`, `Current list of trustedOrigins: ${trustedOrigins}`);
		throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.INVALID_ORIGIN);
	}
}
/**
* Middleware for CSRF protection using Fetch Metadata headers.
* This prevents cross-site navigation login attacks while supporting progressive enhancement.
*/
var formCsrfMiddleware = createAuthMiddleware(async (ctx) => {
	if (!ctx.request) return;
	await validateFormCsrf(ctx);
});
/**
* Validates CSRF protection for first-login scenarios using Fetch Metadata headers.
* This prevents cross-site form submission attacks while supporting progressive enhancement.
*/
async function validateFormCsrf(ctx) {
	const req = ctx.request;
	if (!req) return;
	if (ctx.context.skipCSRFCheck) return;
	if (shouldSkipCSRFForBackwardCompat(ctx)) return;
	const headers = req.headers;
	if (headers.has("cookie")) return await validateOrigin(ctx);
	const site = headers.get("Sec-Fetch-Site");
	const mode = headers.get("Sec-Fetch-Mode");
	const dest = headers.get("Sec-Fetch-Dest");
	if (Boolean(site && site.trim() || mode && mode.trim() || dest && dest.trim())) {
		if (site === "cross-site" && mode === "navigate") {
			ctx.context.logger.error("Blocked cross-site navigation login attempt (CSRF protection)", {
				secFetchSite: site,
				secFetchMode: mode,
				secFetchDest: dest
			});
			throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.CROSS_SITE_NAVIGATION_LOGIN_BLOCKED);
		}
		return await validateOrigin(ctx, true);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/utils/ip.mjs
/**
* Checks if an IP is valid IPv4 or IPv6
*/
function isValidIP(ip) {
	return ipv4().safeParse(ip).success || ipv6().safeParse(ip).success;
}
/**
* Checks if an IP is IPv6
*/
function isIPv6(ip) {
	return ipv6().safeParse(ip).success;
}
/**
* Converts IPv4-mapped IPv6 address to IPv4
* e.g., "::ffff:192.0.2.1" -> "192.0.2.1"
*/
function extractIPv4FromMapped(ipv6) {
	const lower = ipv6.toLowerCase();
	if (lower.startsWith("::ffff:")) {
		const ipv4Part = lower.substring(7);
		if (ipv4().safeParse(ipv4Part).success) return ipv4Part;
	}
	const parts = ipv6.split(":");
	if (parts.length === 7 && parts[5]?.toLowerCase() === "ffff") {
		const ipv4Part = parts[6];
		if (ipv4Part && ipv4().safeParse(ipv4Part).success) return ipv4Part;
	}
	if (lower.includes("::ffff:") || lower.includes(":ffff:")) {
		const groups = expandIPv6(ipv6);
		if (groups.length === 8 && groups[0] === "0000" && groups[1] === "0000" && groups[2] === "0000" && groups[3] === "0000" && groups[4] === "0000" && groups[5] === "ffff" && groups[6] && groups[7]) return `${Number.parseInt(groups[6].substring(0, 2), 16)}.${Number.parseInt(groups[6].substring(2, 4), 16)}.${Number.parseInt(groups[7].substring(0, 2), 16)}.${Number.parseInt(groups[7].substring(2, 4), 16)}`;
	}
	return null;
}
/**
* Expands a compressed IPv6 address to full form
* e.g., "2001:db8::1" -> ["2001", "0db8", "0000", "0000", "0000", "0000", "0000", "0001"]
*/
function expandIPv6(ipv6) {
	if (ipv6.includes("::")) {
		const sides = ipv6.split("::");
		const left = sides[0] ? sides[0].split(":") : [];
		const right = sides[1] ? sides[1].split(":") : [];
		const missingGroups = 8 - left.length - right.length;
		const zeros = Array(missingGroups).fill("0000");
		const paddedLeft = left.map((g) => g.padStart(4, "0"));
		const paddedRight = right.map((g) => g.padStart(4, "0"));
		return [
			...paddedLeft,
			...zeros,
			...paddedRight
		];
	}
	return ipv6.split(":").map((g) => g.padStart(4, "0"));
}
/**
* Normalizes an IPv6 address to canonical form
* e.g., "2001:DB8::1" -> "2001:0db8:0000:0000:0000:0000:0000:0001"
*/
function normalizeIPv6(ipv6, subnetPrefix) {
	const groups = expandIPv6(ipv6);
	if (subnetPrefix && subnetPrefix < 128) {
		let bitsRemaining = subnetPrefix;
		return groups.map((group) => {
			if (bitsRemaining <= 0) return "0000";
			if (bitsRemaining >= 16) {
				bitsRemaining -= 16;
				return group;
			}
			const masked = Number.parseInt(group, 16) & (65535 << 16 - bitsRemaining & 65535);
			bitsRemaining = 0;
			return masked.toString(16).padStart(4, "0");
		}).join(":").toLowerCase();
	}
	return groups.join(":").toLowerCase();
}
/**
* Normalizes an IP address (IPv4 or IPv6) for consistent rate limiting.
*
* @param ip - The IP address to normalize
* @param options - Normalization options
* @returns Normalized IP address
*
* @example
* normalizeIP("2001:DB8::1")
* // -> "2001:0db8:0000:0000:0000:0000:0000:0000"
*
* @example
* normalizeIP("::ffff:192.0.2.1")
* // -> "192.0.2.1" (converted to IPv4)
*
* @example
* normalizeIP("2001:db8::1", { ipv6Subnet: 64 })
* // -> "2001:0db8:0000:0000:0000:0000:0000:0000" (subnet /64)
*/
function normalizeIP(ip, options = {}) {
	if (ipv4().safeParse(ip).success) return ip.toLowerCase();
	if (!isIPv6(ip)) return ip.toLowerCase();
	const ipv4$1 = extractIPv4FromMapped(ip);
	if (ipv4$1) return ipv4$1.toLowerCase();
	return normalizeIPv6(ip, options.ipv6Subnet || 64);
}
/**
* Creates a rate limit key from IP and path
* Uses a separator to prevent collision attacks
*
* @param ip - The IP address (should be normalized)
* @param path - The request path
* @returns Rate limit key
*/
function createRateLimitKey(ip, path) {
	return `${ip}|${path}`;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/get-request-ip.mjs
var LOCALHOST_IP = "127.0.0.1";
function getIp(req, options) {
	if (options.advanced?.ipAddress?.disableIpTracking) return null;
	const headers = "headers" in req ? req.headers : req;
	const ipHeaders = options.advanced?.ipAddress?.ipAddressHeaders || ["x-forwarded-for"];
	for (const key of ipHeaders) {
		const value = "get" in headers ? headers.get(key) : headers[key];
		if (typeof value === "string") {
			const ip = value.split(",")[0].trim();
			if (isValidIP(ip)) return normalizeIP(ip, { ipv6Subnet: options.advanced?.ipAddress?.ipv6Subnet });
		}
	}
	if (isTest() || isDevelopment()) return LOCALHOST_IP;
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/rate-limiter/index.mjs
var memory = /* @__PURE__ */ new Map();
function shouldRateLimit(max, window, rateLimitData) {
	const now = Date.now();
	const windowInMs = window * 1e3;
	return now - rateLimitData.lastRequest < windowInMs && rateLimitData.count >= max;
}
function rateLimitResponse(retryAfter) {
	return new Response(JSON.stringify({ message: "Too many requests. Please try again later." }), {
		status: 429,
		statusText: "Too Many Requests",
		headers: { "X-Retry-After": retryAfter.toString() }
	});
}
function getRetryAfter(lastRequest, window) {
	const now = Date.now();
	const windowInMs = window * 1e3;
	return Math.ceil((lastRequest + windowInMs - now) / 1e3);
}
function createDatabaseStorageWrapper(ctx) {
	const model = "rateLimit";
	const db = ctx.adapter;
	return {
		get: async (key) => {
			const data = (await db.findMany({
				model,
				where: [{
					field: "key",
					value: key
				}]
			}))[0];
			if (typeof data?.lastRequest === "bigint") data.lastRequest = Number(data.lastRequest);
			return data;
		},
		set: async (key, value, _update) => {
			try {
				if (_update) await db.updateMany({
					model,
					where: [{
						field: "key",
						value: key
					}],
					update: {
						count: value.count,
						lastRequest: value.lastRequest
					}
				});
				else await db.create({
					model,
					data: {
						key,
						count: value.count,
						lastRequest: value.lastRequest
					}
				});
			} catch (e) {
				ctx.logger.error("Error setting rate limit", e);
			}
		}
	};
}
function getRateLimitStorage(ctx, rateLimitSettings) {
	if (ctx.options.rateLimit?.customStorage) return ctx.options.rateLimit.customStorage;
	const storage = ctx.rateLimit.storage;
	if (storage === "secondary-storage") return {
		get: async (key) => {
			const data = await ctx.options.secondaryStorage?.get(key);
			return data ? safeJSONParse(data) : null;
		},
		set: async (key, value, _update) => {
			const ttl = rateLimitSettings?.window ?? ctx.options.rateLimit?.window ?? 10;
			await ctx.options.secondaryStorage?.set?.(key, JSON.stringify(value), ttl);
		}
	};
	else if (storage === "memory") return {
		async get(key) {
			const entry = memory.get(key);
			if (!entry) return null;
			if (Date.now() >= entry.expiresAt) {
				memory.delete(key);
				return null;
			}
			return entry.data;
		},
		async set(key, value, _update) {
			const ttl = rateLimitSettings?.window ?? ctx.options.rateLimit?.window ?? 10;
			const expiresAt = Date.now() + ttl * 1e3;
			memory.set(key, {
				data: value,
				expiresAt
			});
		}
	};
	return createDatabaseStorageWrapper(ctx);
}
var ipWarningLogged = false;
async function resolveRateLimitConfig(req, ctx) {
	const basePath = new URL(ctx.baseURL).pathname;
	const path = normalizePathname(req.url, basePath);
	let currentWindow = ctx.rateLimit.window;
	let currentMax = ctx.rateLimit.max;
	const ip = getIp(req, ctx.options);
	if (!ip) {
		if (!ipWarningLogged) {
			ctx.logger.warn("Rate limiting skipped: could not determine client IP address. Ensure your runtime forwards a trusted client IP header and configure `advanced.ipAddress.ipAddressHeaders` if needed.");
			ipWarningLogged = true;
		}
		return null;
	}
	const key = createRateLimitKey(ip, path);
	const specialRule = getDefaultSpecialRules().find((rule) => rule.pathMatcher(path));
	if (specialRule) {
		currentWindow = specialRule.window;
		currentMax = specialRule.max;
	}
	for (const plugin of ctx.options.plugins || []) if (plugin.rateLimit) {
		const matchedRule = plugin.rateLimit.find((rule) => rule.pathMatcher(path));
		if (matchedRule) {
			currentWindow = matchedRule.window;
			currentMax = matchedRule.max;
			break;
		}
	}
	if (ctx.rateLimit.customRules) {
		const _path = Object.keys(ctx.rateLimit.customRules).find((p) => {
			if (p.includes("*")) return wildcardMatch(p)(path);
			return p === path;
		});
		if (_path) {
			const customRule = ctx.rateLimit.customRules[_path];
			const resolved = typeof customRule === "function" ? await customRule(req, {
				window: currentWindow,
				max: currentMax
			}) : customRule;
			if (resolved) {
				currentWindow = resolved.window;
				currentMax = resolved.max;
			}
			if (resolved === false) return null;
		}
	}
	return {
		key,
		currentWindow,
		currentMax
	};
}
async function onRequestRateLimit(req, ctx) {
	if (!ctx.rateLimit.enabled) return;
	const config = await resolveRateLimitConfig(req, ctx);
	if (!config) return;
	const { key, currentWindow, currentMax } = config;
	const data = await getRateLimitStorage(ctx, { window: currentWindow }).get(key);
	if (data && shouldRateLimit(currentMax, currentWindow, data)) return rateLimitResponse(getRetryAfter(data.lastRequest, currentWindow));
}
async function onResponseRateLimit(req, ctx) {
	if (!ctx.rateLimit.enabled) return;
	const config = await resolveRateLimitConfig(req, ctx);
	if (!config) return;
	const { key, currentWindow } = config;
	const storage = getRateLimitStorage(ctx, { window: currentWindow });
	const data = await storage.get(key);
	const now = Date.now();
	if (!data) await storage.set(key, {
		key,
		count: 1,
		lastRequest: now
	});
	else if (now - data.lastRequest > currentWindow * 1e3) await storage.set(key, {
		...data,
		count: 1,
		lastRequest: now
	}, true);
	else await storage.set(key, {
		...data,
		count: data.count + 1,
		lastRequest: now
	}, true);
}
function getDefaultSpecialRules() {
	return [{
		pathMatcher(path) {
			return path.startsWith("/sign-in") || path.startsWith("/sign-up") || path.startsWith("/change-password") || path.startsWith("/change-email");
		},
		window: 10,
		max: 3
	}, {
		pathMatcher(path) {
			return path === "/request-password-reset" || path === "/send-verification-email" || path.startsWith("/forget-password") || path === "/email-otp/send-verification-otp" || path === "/email-otp/request-password-reset";
		},
		window: 60,
		max: 3
	}];
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/state/should-session-refresh.mjs
/**
* State for skipping session refresh
*
* In some cases, such as when using server-side rendering (SSR) or when dealing with
* certain types of requests, it may be necessary to skip session refresh to prevent
* potential inconsistencies between the session data in the database and the session
* data stored in cookies.
*/
var { get: getShouldSkipSessionRefresh, set: setShouldSkipSessionRefresh } = defineRequestState(() => false);
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/session.mjs
var getSession$1 = () => createAuthEndpoint("/get-session", {
	method: ["GET", "POST"],
	operationId: "getSession",
	query: getSessionQuerySchema,
	requireHeaders: true,
	metadata: { openapi: {
		operationId: "getSession",
		description: "Get the current session",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: ["object", "null"],
				properties: {
					session: { $ref: "#/components/schemas/Session" },
					user: { $ref: "#/components/schemas/User" }
				},
				required: ["session", "user"]
			} } }
		} }
	} }
}, async (ctx) => {
	const deferSessionRefresh = ctx.context.options.session?.deferSessionRefresh;
	const isPostRequest = ctx.method === "POST";
	if (isPostRequest && !deferSessionRefresh) throw APIError.from("METHOD_NOT_ALLOWED", BASE_ERROR_CODES.METHOD_NOT_ALLOWED_DEFER_SESSION_REQUIRED);
	try {
		const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
		if (!sessionCookieToken) return null;
		const sessionDataCookie = getChunkedCookie(ctx, ctx.context.authCookies.sessionData.name);
		let sessionDataPayload = null;
		if (sessionDataCookie) {
			const strategy = ctx.context.options.session?.cookieCache?.strategy || "compact";
			if (strategy === "jwe") {
				const payload = await symmetricDecodeJWT(sessionDataCookie, ctx.context.secretConfig, "better-auth-session");
				if (payload && payload.session && payload.user) sessionDataPayload = {
					session: {
						session: payload.session,
						user: payload.user,
						updatedAt: payload.updatedAt,
						version: payload.version
					},
					expiresAt: payload.exp ? payload.exp * 1e3 : Date.now()
				};
				else {
					expireCookie(ctx, ctx.context.authCookies.sessionData);
					return ctx.json(null);
				}
			} else if (strategy === "jwt") {
				const payload = await verifyJWT$1(sessionDataCookie, ctx.context.secret);
				if (payload && payload.session && payload.user) sessionDataPayload = {
					session: {
						session: payload.session,
						user: payload.user,
						updatedAt: payload.updatedAt,
						version: payload.version
					},
					expiresAt: payload.exp ? payload.exp * 1e3 : Date.now()
				};
				else {
					expireCookie(ctx, ctx.context.authCookies.sessionData);
					return ctx.json(null);
				}
			} else {
				const parsed = safeJSONParse(binary.decode(base64Url.decode(sessionDataCookie)));
				if (parsed) if (await createHMAC("SHA-256", "base64urlnopad").verify(ctx.context.secret, JSON.stringify({
					...parsed.session,
					expiresAt: parsed.expiresAt
				}), parsed.signature)) sessionDataPayload = parsed;
				else {
					expireCookie(ctx, ctx.context.authCookies.sessionData);
					return ctx.json(null);
				}
			}
		}
		const dontRememberMe = await ctx.getSignedCookie(ctx.context.authCookies.dontRememberToken.name, ctx.context.secret);
		/**
		* If session data is present in the cookie, check if it should be used or refreshed
		*/
		if (sessionDataPayload?.session && ctx.context.options.session?.cookieCache?.enabled && !ctx.query?.disableCookieCache) {
			const session = sessionDataPayload.session;
			const versionConfig = ctx.context.options.session?.cookieCache?.version;
			let expectedVersion = "1";
			if (versionConfig) {
				if (typeof versionConfig === "string") expectedVersion = versionConfig;
				else if (typeof versionConfig === "function") {
					const result = versionConfig(session.session, session.user);
					expectedVersion = result instanceof Promise ? await result : result;
				}
			}
			if ((session.version || "1") !== expectedVersion) expireCookie(ctx, ctx.context.authCookies.sessionData);
			else {
				const cachedSessionExpiresAt = new Date(session.session.expiresAt);
				if (sessionDataPayload.expiresAt < Date.now() || cachedSessionExpiresAt < /* @__PURE__ */ new Date()) expireCookie(ctx, ctx.context.authCookies.sessionData);
				else {
					const cookieRefreshCache = ctx.context.sessionConfig.cookieRefreshCache;
					if (cookieRefreshCache === false) {
						ctx.context.session = session;
						const parsedSession = parseSessionOutput(ctx.context.options, {
							...session.session,
							expiresAt: new Date(session.session.expiresAt),
							createdAt: new Date(session.session.createdAt),
							updatedAt: new Date(session.session.updatedAt)
						});
						const parsedUser = parseUserOutput(ctx.context.options, {
							...session.user,
							createdAt: new Date(session.user.createdAt),
							updatedAt: new Date(session.user.updatedAt)
						});
						return ctx.json({
							session: parsedSession,
							user: parsedUser
						});
					}
					const timeUntilExpiry = sessionDataPayload.expiresAt - Date.now();
					const updateAge = cookieRefreshCache.updateAge * 1e3;
					const shouldSkipSessionRefresh = await getShouldSkipSessionRefresh();
					if (timeUntilExpiry < updateAge && !shouldSkipSessionRefresh) {
						const newExpiresAt = getDate(ctx.context.options.session?.cookieCache?.maxAge || 300, "sec");
						const refreshedSession = {
							session: {
								...session.session,
								expiresAt: newExpiresAt
							},
							user: session.user,
							updatedAt: Date.now()
						};
						await setCookieCache(ctx, refreshedSession, false);
						const sessionTokenOptions = ctx.context.authCookies.sessionToken.attributes;
						const sessionTokenMaxAge = dontRememberMe ? void 0 : ctx.context.sessionConfig.expiresIn;
						await ctx.setSignedCookie(ctx.context.authCookies.sessionToken.name, session.session.token, ctx.context.secret, {
							...sessionTokenOptions,
							maxAge: sessionTokenMaxAge
						});
						const parsedRefreshedSession = parseSessionOutput(ctx.context.options, {
							...refreshedSession.session,
							expiresAt: new Date(refreshedSession.session.expiresAt),
							createdAt: new Date(refreshedSession.session.createdAt),
							updatedAt: new Date(refreshedSession.session.updatedAt)
						});
						const parsedRefreshedUser = parseUserOutput(ctx.context.options, {
							...refreshedSession.user,
							createdAt: new Date(refreshedSession.user.createdAt),
							updatedAt: new Date(refreshedSession.user.updatedAt)
						});
						ctx.context.session = {
							session: parsedRefreshedSession,
							user: parsedRefreshedUser
						};
						return ctx.json({
							session: parsedRefreshedSession,
							user: parsedRefreshedUser
						});
					}
					const parsedSession = parseSessionOutput(ctx.context.options, {
						...session.session,
						expiresAt: new Date(session.session.expiresAt),
						createdAt: new Date(session.session.createdAt),
						updatedAt: new Date(session.session.updatedAt)
					});
					const parsedUser = parseUserOutput(ctx.context.options, {
						...session.user,
						createdAt: new Date(session.user.createdAt),
						updatedAt: new Date(session.user.updatedAt)
					});
					ctx.context.session = {
						session: parsedSession,
						user: parsedUser
					};
					return ctx.json({
						session: parsedSession,
						user: parsedUser
					});
				}
			}
		}
		const session = await ctx.context.internalAdapter.findSession(sessionCookieToken);
		ctx.context.session = session;
		if (!session || session.session.expiresAt < /* @__PURE__ */ new Date()) {
			deleteSessionCookie(ctx);
			if (session) {
				/**
				* if session expired clean up the session
				* Only delete on POST when deferSessionRefresh is enabled
				*/
				if (!deferSessionRefresh || isPostRequest) await ctx.context.internalAdapter.deleteSession(session.session.token);
			}
			return ctx.json(null);
		}
		/**
		* We don't need to update the session if the user doesn't want to be remembered
		* or if the session refresh is disabled
		*/
		if (dontRememberMe || ctx.query?.disableRefresh) {
			const parsedSession = parseSessionOutput(ctx.context.options, session.session);
			const parsedUser = parseUserOutput(ctx.context.options, session.user);
			return ctx.json({
				session: parsedSession,
				user: parsedUser
			});
		}
		const expiresIn = ctx.context.sessionConfig.expiresIn;
		const updateAge = ctx.context.sessionConfig.updateAge;
		const shouldBeUpdated = session.session.expiresAt.valueOf() - expiresIn * 1e3 + updateAge * 1e3 <= Date.now();
		const disableRefresh = ctx.query?.disableRefresh || ctx.context.options.session?.disableSessionRefresh;
		const shouldSkipSessionRefresh = await getShouldSkipSessionRefresh();
		const needsRefresh = shouldBeUpdated && !disableRefresh && !shouldSkipSessionRefresh;
		/**
		* When deferSessionRefresh is enabled and this is a GET request,
		* return the session without performing writes, but include needsRefresh flag
		*/
		if (deferSessionRefresh && !isPostRequest) {
			await setCookieCache(ctx, session, !!dontRememberMe);
			const parsedSession = parseSessionOutput(ctx.context.options, session.session);
			const parsedUser = parseUserOutput(ctx.context.options, session.user);
			return ctx.json({
				session: parsedSession,
				user: parsedUser,
				needsRefresh
			});
		}
		if (needsRefresh) {
			const updatedSession = await ctx.context.internalAdapter.updateSession(session.session.token, {
				expiresAt: getDate(ctx.context.sessionConfig.expiresIn, "sec"),
				updatedAt: /* @__PURE__ */ new Date()
			});
			if (!updatedSession) {
				/**
				* Handle case where session update fails (e.g., concurrent deletion)
				*/
				deleteSessionCookie(ctx);
				throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_GET_SESSION);
			}
			const maxAge = (updatedSession.expiresAt.valueOf() - Date.now()) / 1e3;
			await setSessionCookie(ctx, {
				session: updatedSession,
				user: session.user
			}, false, { maxAge });
			const parsedUpdatedSession = parseSessionOutput(ctx.context.options, updatedSession);
			const parsedUser = parseUserOutput(ctx.context.options, session.user);
			return ctx.json({
				session: parsedUpdatedSession,
				user: parsedUser
			});
		}
		await setCookieCache(ctx, session, !!dontRememberMe);
		const parsedSession = parseSessionOutput(ctx.context.options, session.session);
		const parsedUser = parseUserOutput(ctx.context.options, session.user);
		return ctx.json({
			session: parsedSession,
			user: parsedUser
		});
	} catch (error) {
		if (isAPIError(error)) throw error;
		ctx.context.logger.error("INTERNAL_SERVER_ERROR", error);
		throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_GET_SESSION);
	}
});
var getSessionFromCtx = async (ctx, config) => {
	if (ctx.context.session) return ctx.context.session;
	const session = await getSession$1()({
		...ctx,
		method: "GET",
		asResponse: false,
		headers: ctx.headers,
		returnHeaders: false,
		returnStatus: false,
		query: {
			...config,
			...ctx.query
		}
	}).catch((e) => {
		return null;
	});
	ctx.context.session = session;
	return session;
};
/**
* The middleware forces the endpoint to require a valid session.
*/
var sessionMiddleware = createAuthMiddleware(async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	if (!session?.session) throw APIError.from("UNAUTHORIZED", {
		message: "Unauthorized",
		code: "UNAUTHORIZED"
	});
	return { session };
});
/**
* This middleware forces the endpoint to require a valid session and ignores cookie cache.
* This should be used for sensitive operations like password changes, account deletion, etc.
* to ensure that revoked sessions cannot be used even if they're still cached in cookies.
*/
var sensitiveSessionMiddleware = createAuthMiddleware(async (ctx) => {
	const session = await getSessionFromCtx(ctx, { disableCookieCache: true });
	if (!session?.session) throw APIError.from("UNAUTHORIZED", {
		message: "Unauthorized",
		code: "UNAUTHORIZED"
	});
	return { session };
});
/**
* This middleware allows you to call the endpoint on the client if session is valid.
* However, if called on the server, no session is required.
*/
var requestOnlySessionMiddleware = createAuthMiddleware(async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	if (!session?.session && (ctx.request || ctx.headers)) throw APIError.from("UNAUTHORIZED", {
		message: "Unauthorized",
		code: "UNAUTHORIZED"
	});
	return { session };
});
/**
* This middleware forces the endpoint to require a valid session,
* as well as making sure the session is fresh before proceeding.
*
* Session freshness check will be skipped if the session config's freshAge
* is set to 0
*/
var freshSessionMiddleware = createAuthMiddleware(async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	if (!session?.session) throw APIError.from("UNAUTHORIZED", {
		message: "Unauthorized",
		code: "UNAUTHORIZED"
	});
	if (ctx.context.sessionConfig.freshAge !== 0) {
		const createdAt = new Date(session.session.createdAt).getTime();
		const freshAge = ctx.context.sessionConfig.freshAge * 1e3;
		if (Date.now() - createdAt >= freshAge) throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.SESSION_NOT_FRESH);
	}
	return { session };
});
/**
* user active sessions list
*/
var listSessions = () => createAuthEndpoint("/list-sessions", {
	method: "GET",
	operationId: "listUserSessions",
	use: [sessionMiddleware],
	requireHeaders: true,
	metadata: { openapi: {
		operationId: "listUserSessions",
		description: "List all active sessions for the user",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "array",
				items: { $ref: "#/components/schemas/Session" }
			} } }
		} }
	} }
}, async (ctx) => {
	try {
		const activeSessions = (await ctx.context.internalAdapter.listSessions(ctx.context.session.user.id, { onlyActiveSessions: true })).filter((session) => {
			return session.expiresAt > /* @__PURE__ */ new Date();
		});
		return ctx.json(activeSessions.map((session) => parseSessionOutput(ctx.context.options, session)));
	} catch (e) {
		ctx.context.logger.error(e);
		throw ctx.error("INTERNAL_SERVER_ERROR");
	}
});
/**
* revoke a single session
*/
var revokeSession = createAuthEndpoint("/revoke-session", {
	method: "POST",
	body: object({ token: string().meta({ description: "The token to revoke" }) }),
	use: [sensitiveSessionMiddleware],
	requireHeaders: true,
	metadata: { openapi: {
		description: "Revoke a single session",
		requestBody: { content: { "application/json": { schema: {
			type: "object",
			properties: { token: {
				type: "string",
				description: "The token to revoke"
			} },
			required: ["token"]
		} } } },
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { status: {
					type: "boolean",
					description: "Indicates if the session was revoked successfully"
				} },
				required: ["status"]
			} } }
		} }
	} }
}, async (ctx) => {
	const token = ctx.body.token;
	if ((await ctx.context.internalAdapter.findSession(token))?.session.userId === ctx.context.session.user.id) try {
		await ctx.context.internalAdapter.deleteSession(token);
	} catch (error) {
		ctx.context.logger.error(error && typeof error === "object" && "name" in error ? error.name : "", error);
		throw APIError.from("INTERNAL_SERVER_ERROR", {
			message: "Internal Server Error",
			code: "INTERNAL_SERVER_ERROR"
		});
	}
	return ctx.json({ status: true });
});
/**
* revoke all user sessions
*/
var revokeSessions = createAuthEndpoint("/revoke-sessions", {
	method: "POST",
	use: [sensitiveSessionMiddleware],
	requireHeaders: true,
	metadata: { openapi: {
		description: "Revoke all sessions for the user",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { status: {
					type: "boolean",
					description: "Indicates if all sessions were revoked successfully"
				} },
				required: ["status"]
			} } }
		} }
	} }
}, async (ctx) => {
	try {
		await ctx.context.internalAdapter.deleteSessions(ctx.context.session.user.id);
	} catch (error) {
		ctx.context.logger.error(error && typeof error === "object" && "name" in error ? error.name : "", error);
		throw APIError.from("INTERNAL_SERVER_ERROR", {
			message: "Internal Server Error",
			code: "INTERNAL_SERVER_ERROR"
		});
	}
	return ctx.json({ status: true });
});
var revokeOtherSessions = createAuthEndpoint("/revoke-other-sessions", {
	method: "POST",
	requireHeaders: true,
	use: [sensitiveSessionMiddleware],
	metadata: { openapi: {
		description: "Revoke all other sessions for the user except the current one",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { status: {
					type: "boolean",
					description: "Indicates if all other sessions were revoked successfully"
				} },
				required: ["status"]
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	if (!session.user) throw APIError.from("UNAUTHORIZED", {
		message: "Unauthorized",
		code: "UNAUTHORIZED"
	});
	const otherSessions = (await ctx.context.internalAdapter.listSessions(session.user.id)).filter((session) => {
		return session.expiresAt > /* @__PURE__ */ new Date();
	}).filter((session) => session.token !== ctx.context.session.session.token);
	await Promise.all(otherSessions.map((session) => ctx.context.internalAdapter.deleteSession(session.token)));
	return ctx.json({ status: true });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/verification-token-storage.mjs
var defaultKeyHasher = async (identifier) => {
	const hash = await createHash$1("SHA-256").digest(new TextEncoder().encode(identifier));
	return base64Url.encode(new Uint8Array(hash), { padding: false });
};
async function processIdentifier(identifier, option) {
	if (!option || option === "plain") return identifier;
	if (option === "hashed") return defaultKeyHasher(identifier);
	if (typeof option === "object" && "hash" in option) return option.hash(identifier);
	return identifier;
}
function getStorageOption(identifier, config) {
	if (!config) return;
	if (typeof config === "object" && "default" in config) {
		if (config.overrides) {
			for (const [prefix, option] of Object.entries(config.overrides)) if (identifier.startsWith(prefix)) return option;
		}
		return config.default;
	}
	return config;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/with-hooks.mjs
function getWithHooks(adapter, ctx) {
	const hooksEntries = ctx.hooks;
	async function createWithHooks(data, model, customCreateFn) {
		const context = await getCurrentAuthContext().catch(() => null);
		let actualData = data;
		for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.create?.before;
			if (toRun) {
				const result = await withSpan(`db create.before ${model}`, {
					[ATTR_HOOK_TYPE]: "create.before",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(actualData, context));
				if (result === false) return null;
				if (typeof result === "object" && "data" in result) actualData = {
					...actualData,
					...result.data
				};
			}
		}
		let created = null;
		if (!customCreateFn || customCreateFn.executeMainFn) created = await (await getCurrentAdapter(adapter)).create({
			model,
			data: actualData,
			forceAllowId: true
		});
		if (customCreateFn?.fn) created = await customCreateFn.fn(created ?? actualData);
		for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.create?.after;
			if (toRun) await queueAfterTransactionHook(async () => {
				await withSpan(`db create.after ${model}`, {
					[ATTR_HOOK_TYPE]: "create.after",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(created, context));
			});
		}
		return created;
	}
	async function updateWithHooks(data, where, model, customUpdateFn) {
		const context = await getCurrentAuthContext().catch(() => null);
		let actualData = data;
		for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.update?.before;
			if (toRun) {
				const result = await withSpan(`db update.before ${model}`, {
					[ATTR_HOOK_TYPE]: "update.before",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(data, context));
				if (result === false) return null;
				if (typeof result === "object" && "data" in result) actualData = {
					...actualData,
					...result.data
				};
			}
		}
		const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
		const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await getCurrentAdapter(adapter)).update({
			model,
			update: actualData,
			where
		}) : customUpdated;
		for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.update?.after;
			if (toRun) await queueAfterTransactionHook(async () => {
				await withSpan(`db update.after ${model}`, {
					[ATTR_HOOK_TYPE]: "update.after",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(updated, context));
			});
		}
		return updated;
	}
	async function updateManyWithHooks(data, where, model, customUpdateFn) {
		const context = await getCurrentAuthContext().catch(() => null);
		let actualData = data;
		for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.update?.before;
			if (toRun) {
				const result = await withSpan(`db updateMany.before ${model}`, {
					[ATTR_HOOK_TYPE]: "updateMany.before",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(data, context));
				if (result === false) return null;
				if (typeof result === "object" && "data" in result) actualData = {
					...actualData,
					...result.data
				};
			}
		}
		const customUpdated = customUpdateFn ? await customUpdateFn.fn(actualData) : null;
		const updated = !customUpdateFn || customUpdateFn.executeMainFn ? await (await getCurrentAdapter(adapter)).updateMany({
			model,
			update: actualData,
			where
		}) : customUpdated;
		for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.update?.after;
			if (toRun) await queueAfterTransactionHook(async () => {
				await withSpan(`db updateMany.after ${model}`, {
					[ATTR_HOOK_TYPE]: "updateMany.after",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(updated, context));
			});
		}
		return updated;
	}
	async function deleteWithHooks(where, model, customDeleteFn) {
		const context = await getCurrentAuthContext().catch(() => null);
		let entityToDelete = null;
		try {
			entityToDelete = (await (await getCurrentAdapter(adapter)).findMany({
				model,
				where,
				limit: 1
			}))[0] || null;
		} catch {}
		if (entityToDelete) for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.delete?.before;
			if (toRun) {
				if (await withSpan(`db delete.before ${model}`, {
					["better_auth.hook.type"]: "delete.before",
					["db.collection.name"]: model,
					["better_auth.context"]: source
				}, () => toRun(entityToDelete, context)) === false) return null;
			}
		}
		const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
		const deleted = (!customDeleteFn || customDeleteFn.executeMainFn) && entityToDelete ? await (await getCurrentAdapter(adapter)).delete({
			model,
			where
		}) : customDeleted;
		if (entityToDelete) for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.delete?.after;
			if (toRun) await queueAfterTransactionHook(async () => {
				await withSpan(`db delete.after ${model}`, {
					[ATTR_HOOK_TYPE]: "delete.after",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(entityToDelete, context));
			});
		}
		return deleted;
	}
	async function deleteManyWithHooks(where, model, customDeleteFn) {
		const context = await getCurrentAuthContext().catch(() => null);
		let entitiesToDelete = [];
		try {
			entitiesToDelete = await (await getCurrentAdapter(adapter)).findMany({
				model,
				where
			});
		} catch {}
		for (const entity of entitiesToDelete) for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.delete?.before;
			if (toRun) {
				if (await withSpan(`db delete.before ${model}`, {
					["better_auth.hook.type"]: "delete.before",
					["db.collection.name"]: model,
					["better_auth.context"]: source
				}, () => toRun(entity, context)) === false) return null;
			}
		}
		const customDeleted = customDeleteFn ? await customDeleteFn.fn(where) : null;
		const deleted = !customDeleteFn || customDeleteFn.executeMainFn ? await (await getCurrentAdapter(adapter)).deleteMany({
			model,
			where
		}) : customDeleted;
		for (const entity of entitiesToDelete) for (const { source, hooks } of hooksEntries) {
			const toRun = hooks[model]?.delete?.after;
			if (toRun) await queueAfterTransactionHook(async () => {
				await withSpan(`db delete.after ${model}`, {
					[ATTR_HOOK_TYPE]: "delete.after",
					[ATTR_DB_COLLECTION_NAME]: model,
					[ATTR_CONTEXT]: source
				}, () => toRun(entity, context));
			});
		}
		return deleted;
	}
	return {
		createWithHooks,
		updateWithHooks,
		updateManyWithHooks,
		deleteWithHooks,
		deleteManyWithHooks
	};
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/internal-adapter.mjs
function getTTLSeconds(expiresAt, now = Date.now()) {
	const expiresMs = typeof expiresAt === "number" ? expiresAt : expiresAt.getTime();
	return Math.max(Math.floor((expiresMs - now) / 1e3), 0);
}
var createInternalAdapter = (adapter, ctx) => {
	const logger = ctx.logger;
	const options = ctx.options;
	const secondaryStorage = options.secondaryStorage;
	const sessionExpiration = options.session?.expiresIn || 3600 * 24 * 7;
	const { createWithHooks, updateWithHooks, updateManyWithHooks, deleteWithHooks, deleteManyWithHooks } = getWithHooks(adapter, ctx);
	async function refreshUserSessions(user) {
		if (!secondaryStorage) return;
		const listRaw = await secondaryStorage.get(`active-sessions-${user.id}`);
		if (!listRaw) return;
		const now = Date.now();
		const validSessions = (safeJSONParse(listRaw) || []).filter((s) => s.expiresAt > now);
		await Promise.all(validSessions.map(async ({ token }) => {
			const cached = await secondaryStorage.get(token);
			if (!cached) return;
			const parsed = safeJSONParse(cached);
			if (!parsed) return;
			const sessionTTL = getTTLSeconds(parsed.session.expiresAt, now);
			await secondaryStorage.set(token, JSON.stringify({
				session: parsed.session,
				user
			}), Math.floor(sessionTTL));
		}));
	}
	return {
		createOAuthUser: async (user, account) => {
			return runWithTransaction(adapter, async () => {
				const createdUser = await createWithHooks({
					createdAt: /* @__PURE__ */ new Date(),
					updatedAt: /* @__PURE__ */ new Date(),
					...user,
					email: user.email?.toLowerCase()
				}, "user", void 0);
				return {
					user: createdUser,
					account: await createWithHooks({
						...account,
						userId: createdUser.id,
						createdAt: /* @__PURE__ */ new Date(),
						updatedAt: /* @__PURE__ */ new Date()
					}, "account", void 0)
				};
			});
		},
		createUser: async (user) => {
			return await createWithHooks({
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date(),
				...user,
				email: user.email?.toLowerCase()
			}, "user", void 0);
		},
		createAccount: async (account) => {
			return await createWithHooks({
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date(),
				...account
			}, "account", void 0);
		},
		listSessions: async (userId, options) => {
			if (secondaryStorage) {
				const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
				if (!currentList) return [];
				const list = safeJSONParse(currentList) || [];
				const now = Date.now();
				const seenTokens = /* @__PURE__ */ new Set();
				const sessions = [];
				for (const { token, expiresAt } of list) {
					if (expiresAt <= now || seenTokens.has(token)) continue;
					seenTokens.add(token);
					const data = await secondaryStorage.get(token);
					if (!data) continue;
					try {
						const parsed = typeof data === "string" ? JSON.parse(data) : data;
						if (!parsed?.session) continue;
						sessions.push(parseSessionOutput(ctx.options, {
							...parsed.session,
							expiresAt: new Date(parsed.session.expiresAt)
						}));
					} catch {
						continue;
					}
				}
				return sessions;
			}
			return await (await getCurrentAdapter(adapter)).findMany({
				model: "session",
				where: [{
					field: "userId",
					value: userId
				}, ...options?.onlyActiveSessions ? [{
					field: "expiresAt",
					value: /* @__PURE__ */ new Date(),
					operator: "gt"
				}] : []]
			});
		},
		listUsers: async (limit, offset, sortBy, where) => {
			return await (await getCurrentAdapter(adapter)).findMany({
				model: "user",
				limit,
				offset,
				sortBy,
				where
			});
		},
		countTotalUsers: async (where) => {
			const total = await (await getCurrentAdapter(adapter)).count({
				model: "user",
				where
			});
			if (typeof total === "string") return parseInt(total);
			return total;
		},
		deleteUser: async (userId) => {
			if (!secondaryStorage || options.session?.storeSessionInDatabase) await deleteManyWithHooks([{
				field: "userId",
				value: userId
			}], "session", void 0);
			await deleteManyWithHooks([{
				field: "userId",
				value: userId
			}], "account", void 0);
			await deleteWithHooks([{
				field: "id",
				value: userId
			}], "user", void 0);
		},
		createSession: async (userId, dontRememberMe, override, overrideAll) => {
			const headers = await (async () => {
				const ctx = await getCurrentAuthContext().catch(() => null);
				return ctx?.headers || ctx?.request?.headers;
			})();
			const storeInDb = options.session?.storeSessionInDatabase;
			const { id: _, ...rest } = override || {};
			let sessionId;
			if (secondaryStorage && !storeInDb) {
				const generatedId = ctx.generateId({ model: "session" });
				sessionId = generatedId !== false ? generatedId : generateId$1();
			}
			const defaultAdditionalFields = getSessionDefaultFields(options);
			const data = {
				...sessionId ? { id: sessionId } : {},
				ipAddress: headers ? getIp(headers, options) || "" : "",
				userAgent: headers?.get("user-agent") || "",
				...rest,
				expiresAt: dontRememberMe ? getDate(3600 * 24, "sec") : getDate(sessionExpiration, "sec"),
				userId,
				token: generateId$1(32),
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date(),
				...defaultAdditionalFields,
				...overrideAll ? rest : {}
			};
			return await createWithHooks(data, "session", secondaryStorage ? {
				fn: async (sessionData) => {
					/**
					* store the session token for the user
					* so we can retrieve it later for listing sessions
					*/
					const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
					let list = [];
					const now = Date.now();
					if (currentList) {
						list = safeJSONParse(currentList) || [];
						list = list.filter((session) => session.expiresAt > now && session.token !== data.token);
					}
					const sorted = [...list, {
						token: data.token,
						expiresAt: data.expiresAt.getTime()
					}].sort((a, b) => a.expiresAt - b.expiresAt);
					const furthestSessionTTL = getTTLSeconds(sorted.at(-1)?.expiresAt ?? data.expiresAt.getTime(), now);
					if (furthestSessionTTL > 0) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(sorted), furthestSessionTTL);
					const user = await (await getCurrentAdapter(adapter)).findOne({
						model: "user",
						where: [{
							field: "id",
							value: userId
						}]
					});
					const sessionTTL = getTTLSeconds(data.expiresAt, now);
					if (sessionTTL > 0) await secondaryStorage.set(data.token, JSON.stringify({
						session: sessionData,
						user
					}), sessionTTL);
					return sessionData;
				},
				executeMainFn: storeInDb
			} : void 0);
		},
		findSession: async (token) => {
			if (secondaryStorage) {
				const sessionStringified = await secondaryStorage.get(token);
				if (!sessionStringified && (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase)) return null;
				if (sessionStringified) {
					const s = safeJSONParse(sessionStringified);
					if (!s) return null;
					return {
						session: parseSessionOutput(ctx.options, {
							...s.session,
							expiresAt: new Date(s.session.expiresAt),
							createdAt: new Date(s.session.createdAt),
							updatedAt: new Date(s.session.updatedAt)
						}),
						user: parseUserOutput(ctx.options, {
							...s.user,
							createdAt: new Date(s.user.createdAt),
							updatedAt: new Date(s.user.updatedAt)
						})
					};
				}
			}
			const result = await (await getCurrentAdapter(adapter)).findOne({
				model: "session",
				where: [{
					value: token,
					field: "token"
				}],
				join: { user: true }
			});
			if (!result) return null;
			const { user, ...session } = result;
			if (!user) return null;
			return {
				session: parseSessionOutput(ctx.options, session),
				user: parseUserOutput(ctx.options, user)
			};
		},
		findSessions: async (sessionTokens, options) => {
			if (secondaryStorage) {
				const sessions = [];
				for (const sessionToken of sessionTokens) {
					const sessionStringified = await secondaryStorage.get(sessionToken);
					if (sessionStringified) try {
						const s = typeof sessionStringified === "string" ? JSON.parse(sessionStringified) : sessionStringified;
						if (!s) return [];
						const expiresAt = new Date(s.session.expiresAt);
						if (options?.onlyActiveSessions && expiresAt <= /* @__PURE__ */ new Date()) continue;
						const session = {
							session: {
								...s.session,
								expiresAt: new Date(s.session.expiresAt)
							},
							user: {
								...s.user,
								createdAt: new Date(s.user.createdAt),
								updatedAt: new Date(s.user.updatedAt)
							}
						};
						sessions.push(session);
					} catch {
						continue;
					}
				}
				return sessions;
			}
			const sessions = await (await getCurrentAdapter(adapter)).findMany({
				model: "session",
				where: [{
					field: "token",
					value: sessionTokens,
					operator: "in"
				}, ...options?.onlyActiveSessions ? [{
					field: "expiresAt",
					value: /* @__PURE__ */ new Date(),
					operator: "gt"
				}] : []],
				join: { user: true }
			});
			if (!sessions.length) return [];
			if (sessions.some((session) => !session.user)) return [];
			return sessions.map((_session) => {
				const { user, ...session } = _session;
				return {
					session,
					user
				};
			});
		},
		updateSession: async (sessionToken, session) => {
			return await updateWithHooks(session, [{
				field: "token",
				value: sessionToken
			}], "session", secondaryStorage ? {
				async fn(data) {
					const currentSession = await secondaryStorage.get(sessionToken);
					if (!currentSession) return null;
					const parsedSession = safeJSONParse(currentSession);
					if (!parsedSession) return null;
					const mergedSession = {
						...parsedSession.session,
						...data,
						expiresAt: new Date(data.expiresAt ?? parsedSession.session.expiresAt),
						createdAt: new Date(parsedSession.session.createdAt),
						updatedAt: new Date(data.updatedAt ?? parsedSession.session.updatedAt)
					};
					const updatedSession = parseSessionOutput(ctx.options, mergedSession);
					const now = Date.now();
					const expiresMs = new Date(updatedSession.expiresAt).getTime();
					const sessionTTL = getTTLSeconds(expiresMs, now);
					if (sessionTTL > 0) {
						await secondaryStorage.set(sessionToken, JSON.stringify({
							session: updatedSession,
							user: parsedSession.user
						}), sessionTTL);
						const listKey = `active-sessions-${updatedSession.userId}`;
						const listRaw = await secondaryStorage.get(listKey);
						const sorted = (listRaw ? safeJSONParse(listRaw) || [] : []).filter((s) => s.token !== sessionToken && s.expiresAt > now).concat([{
							token: sessionToken,
							expiresAt: expiresMs
						}]).sort((a, b) => a.expiresAt - b.expiresAt);
						const furthestSessionExp = sorted.at(-1)?.expiresAt;
						if (furthestSessionExp && furthestSessionExp > now) await secondaryStorage.set(listKey, JSON.stringify(sorted), getTTLSeconds(furthestSessionExp, now));
						else await secondaryStorage.delete(listKey);
					}
					return updatedSession;
				},
				executeMainFn: options.session?.storeSessionInDatabase
			} : void 0);
		},
		deleteSession: async (token) => {
			if (secondaryStorage) {
				const data = await secondaryStorage.get(token);
				if (data) {
					const { session } = safeJSONParse(data) ?? {};
					if (!session) {
						logger.error("Session not found in secondary storage");
						return;
					}
					const userId = session.userId;
					const currentList = await secondaryStorage.get(`active-sessions-${userId}`);
					if (currentList) {
						const list = safeJSONParse(currentList) || [];
						const now = Date.now();
						const filtered = list.filter((session) => session.expiresAt > now && session.token !== token);
						const furthestSessionExp = filtered.sort((a, b) => a.expiresAt - b.expiresAt).at(-1)?.expiresAt;
						if (filtered.length > 0 && furthestSessionExp && furthestSessionExp > Date.now()) await secondaryStorage.set(`active-sessions-${userId}`, JSON.stringify(filtered), getTTLSeconds(furthestSessionExp, now));
						else await secondaryStorage.delete(`active-sessions-${userId}`);
					} else logger.error("Active sessions list not found in secondary storage");
				}
				await secondaryStorage.delete(token);
				if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) return;
			}
			await deleteWithHooks([{
				field: "token",
				value: token
			}], "session", void 0);
		},
		deleteAccounts: async (userId) => {
			await deleteManyWithHooks([{
				field: "userId",
				value: userId
			}], "account", void 0);
		},
		deleteAccount: async (id) => {
			await deleteWithHooks([{
				field: "id",
				value: id
			}], "account", void 0);
		},
		deleteSessions: async (userIdOrSessionTokens) => {
			if (secondaryStorage) {
				if (typeof userIdOrSessionTokens === "string") {
					const activeSession = await secondaryStorage.get(`active-sessions-${userIdOrSessionTokens}`);
					const sessions = activeSession ? safeJSONParse(activeSession) : [];
					if (!sessions) return;
					for (const session of sessions) await secondaryStorage.delete(session.token);
					await secondaryStorage.delete(`active-sessions-${userIdOrSessionTokens}`);
				} else for (const sessionToken of userIdOrSessionTokens) if (await secondaryStorage.get(sessionToken)) await secondaryStorage.delete(sessionToken);
				if (!options.session?.storeSessionInDatabase || ctx.options.session?.preserveSessionInDatabase) return;
			}
			await deleteManyWithHooks([{
				field: Array.isArray(userIdOrSessionTokens) ? "token" : "userId",
				value: userIdOrSessionTokens,
				operator: Array.isArray(userIdOrSessionTokens) ? "in" : void 0
			}], "session", void 0);
		},
		findOAuthUser: async (email, accountId, providerId) => {
			const account = await (await getCurrentAdapter(adapter)).findOne({
				model: "account",
				where: [{
					value: accountId,
					field: "accountId"
				}, {
					value: providerId,
					field: "providerId"
				}],
				join: { user: true }
			});
			if (account) if (account.user) return {
				user: account.user,
				linkedAccount: account,
				accounts: [account]
			};
			else {
				const user = await (await getCurrentAdapter(adapter)).findOne({
					model: "user",
					where: [{
						value: email.toLowerCase(),
						field: "email"
					}]
				});
				if (user) return {
					user,
					linkedAccount: account,
					accounts: [account]
				};
				return null;
			}
			else {
				const user = await (await getCurrentAdapter(adapter)).findOne({
					model: "user",
					where: [{
						value: email.toLowerCase(),
						field: "email"
					}]
				});
				if (user) return {
					user,
					linkedAccount: null,
					accounts: await (await getCurrentAdapter(adapter)).findMany({
						model: "account",
						where: [{
							value: user.id,
							field: "userId"
						}]
					}) || []
				};
				else return null;
			}
		},
		findUserByEmail: async (email, options) => {
			const result = await (await getCurrentAdapter(adapter)).findOne({
				model: "user",
				where: [{
					value: email.toLowerCase(),
					field: "email"
				}],
				join: { ...options?.includeAccounts ? { account: true } : {} }
			});
			if (!result) return null;
			const { account: accounts, ...user } = result;
			return {
				user,
				accounts: accounts ?? []
			};
		},
		findUserById: async (userId) => {
			if (!userId) return null;
			return await (await getCurrentAdapter(adapter)).findOne({
				model: "user",
				where: [{
					field: "id",
					value: userId
				}]
			});
		},
		linkAccount: async (account) => {
			return await createWithHooks({
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date(),
				...account
			}, "account", void 0);
		},
		updateUser: async (userId, data) => {
			const user = await updateWithHooks({
				...data,
				...data.email ? { email: data.email.toLowerCase() } : {}
			}, [{
				field: "id",
				value: userId
			}], "user", void 0);
			await refreshUserSessions(user);
			return user;
		},
		updateUserByEmail: async (email, data) => {
			const user = await updateWithHooks({
				...data,
				...data.email ? { email: data.email.toLowerCase() } : {}
			}, [{
				field: "email",
				value: email.toLowerCase()
			}], "user", void 0);
			await refreshUserSessions(user);
			return user;
		},
		updatePassword: async (userId, password) => {
			await updateManyWithHooks({ password }, [{
				field: "userId",
				value: userId
			}, {
				field: "providerId",
				value: "credential"
			}], "account", void 0);
		},
		findAccounts: async (userId) => {
			return await (await getCurrentAdapter(adapter)).findMany({
				model: "account",
				where: [{
					field: "userId",
					value: userId
				}]
			});
		},
		findAccount: async (accountId) => {
			return await (await getCurrentAdapter(adapter)).findOne({
				model: "account",
				where: [{
					field: "accountId",
					value: accountId
				}]
			});
		},
		findAccountByProviderId: async (accountId, providerId) => {
			return await (await getCurrentAdapter(adapter)).findOne({
				model: "account",
				where: [{
					field: "accountId",
					value: accountId
				}, {
					field: "providerId",
					value: providerId
				}]
			});
		},
		findAccountByUserId: async (userId) => {
			return await (await getCurrentAdapter(adapter)).findMany({
				model: "account",
				where: [{
					field: "userId",
					value: userId
				}]
			});
		},
		updateAccount: async (id, data) => {
			return await updateWithHooks(data, [{
				field: "id",
				value: id
			}], "account", void 0);
		},
		createVerificationValue: async (data) => {
			const storageOption = getStorageOption(data.identifier, options.verification?.storeIdentifier);
			const storedIdentifier = await processIdentifier(data.identifier, storageOption);
			return await createWithHooks({
				createdAt: /* @__PURE__ */ new Date(),
				updatedAt: /* @__PURE__ */ new Date(),
				...data,
				identifier: storedIdentifier
			}, "verification", secondaryStorage ? {
				async fn(verificationData) {
					const ttl = getTTLSeconds(verificationData.expiresAt);
					if (ttl > 0) await secondaryStorage.set(`verification:${storedIdentifier}`, JSON.stringify(verificationData), ttl);
					return verificationData;
				},
				executeMainFn: options.verification?.storeInDatabase
			} : void 0);
		},
		findVerificationValue: async (identifier) => {
			const storageOption = getStorageOption(identifier, options.verification?.storeIdentifier);
			const storedIdentifier = await processIdentifier(identifier, storageOption);
			if (secondaryStorage) {
				const cached = await secondaryStorage.get(`verification:${storedIdentifier}`);
				if (cached) {
					const parsed = safeJSONParse(cached);
					if (parsed) return parsed;
				}
				if (storageOption && storageOption !== "plain") {
					const plainCached = await secondaryStorage.get(`verification:${identifier}`);
					if (plainCached) {
						const parsed = safeJSONParse(plainCached);
						if (parsed) return parsed;
					}
				}
				if (!options.verification?.storeInDatabase) return null;
			}
			const currentAdapter = await getCurrentAdapter(adapter);
			async function findByIdentifier(id) {
				return currentAdapter.findMany({
					model: "verification",
					where: [{
						field: "identifier",
						value: id
					}],
					sortBy: {
						field: "createdAt",
						direction: "desc"
					},
					limit: 1
				});
			}
			let verification = await findByIdentifier(storedIdentifier);
			if (!verification.length && storageOption && storageOption !== "plain") verification = await findByIdentifier(identifier);
			if (!options.verification?.disableCleanup) await deleteManyWithHooks([{
				field: "expiresAt",
				value: /* @__PURE__ */ new Date(),
				operator: "lt"
			}], "verification", void 0);
			return verification[0] || null;
		},
		deleteVerificationByIdentifier: async (identifier) => {
			const storedIdentifier = await processIdentifier(identifier, getStorageOption(identifier, options.verification?.storeIdentifier));
			if (secondaryStorage) await secondaryStorage.delete(`verification:${storedIdentifier}`);
			if (!secondaryStorage || options.verification?.storeInDatabase) await deleteWithHooks([{
				field: "identifier",
				value: storedIdentifier
			}], "verification", void 0);
		},
		updateVerificationByIdentifier: async (identifier, data) => {
			const storedIdentifier = await processIdentifier(identifier, getStorageOption(identifier, options.verification?.storeIdentifier));
			if (secondaryStorage) {
				const cached = await secondaryStorage.get(`verification:${storedIdentifier}`);
				if (cached) {
					const parsed = safeJSONParse(cached);
					if (parsed) {
						const updated = {
							...parsed,
							...data
						};
						const expiresAt = updated.expiresAt ?? parsed.expiresAt;
						const ttl = getTTLSeconds(expiresAt instanceof Date ? expiresAt : new Date(expiresAt));
						if (ttl > 0) await secondaryStorage.set(`verification:${storedIdentifier}`, JSON.stringify(updated), ttl);
						if (!options.verification?.storeInDatabase) return updated;
					}
				}
			}
			if (!secondaryStorage || options.verification?.storeInDatabase) return await updateWithHooks(data, [{
				field: "identifier",
				value: storedIdentifier
			}], "verification", void 0);
			return data;
		},
		refreshUserSessions
	};
};
//#endregion
//#region ../../node_modules/.pnpm/defu@6.1.7/node_modules/defu/dist/defu.mjs
function isPlainObject(value) {
	if (value === null || typeof value !== "object") return false;
	const prototype = Object.getPrototypeOf(value);
	if (prototype !== null && prototype !== Object.prototype && Object.getPrototypeOf(prototype) !== null) return false;
	if (Symbol.iterator in value) return false;
	if (Symbol.toStringTag in value) return Object.prototype.toString.call(value) === "[object Module]";
	return true;
}
function _defu(baseObject, defaults, namespace = ".", merger) {
	if (!isPlainObject(defaults)) return _defu(baseObject, {}, namespace, merger);
	const object = { ...defaults };
	for (const key of Object.keys(baseObject)) {
		if (key === "__proto__" || key === "constructor") continue;
		const value = baseObject[key];
		if (value === null || value === void 0) continue;
		if (merger && merger(object, key, value, namespace)) continue;
		if (Array.isArray(value) && Array.isArray(object[key])) object[key] = [...value, ...object[key]];
		else if (isPlainObject(value) && isPlainObject(object[key])) object[key] = _defu(value, object[key], (namespace ? `${namespace}.` : "") + key.toString(), merger);
		else object[key] = value;
	}
	return object;
}
function createDefu(merger) {
	return (...arguments_) => arguments_.reduce((p, c) => _defu(p, c, "", merger), {});
}
var defu = createDefu();
createDefu((object, key, currentValue) => {
	if (object[key] !== void 0 && typeof currentValue === "function") {
		object[key] = currentValue(object[key]);
		return true;
	}
});
createDefu((object, key, currentValue) => {
	if (Array.isArray(object[key]) && typeof currentValue === "function") {
		object[key] = currentValue(object[key]);
		return true;
	}
});
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/utils/host.mjs
/**
* Cloud provider instance metadata service FQDNs. These resolve to link-local
* IPs (usually `169.254.169.254`) inside their respective clouds and are
* prime SSRF targets.
*
* The IPs themselves are already caught by the `linkLocal` kind; this set
* only exists for the FQDN form that a naive server-side fetch might resolve
* via its own resolver.
*/
var CLOUD_METADATA_HOSTS = new Set([
	"metadata.google.internal",
	"metadata.goog",
	"metadata",
	"instance-data",
	"instance-data.ec2.internal"
]);
/** Strip `[...]` if the entire input is bracketed (IPv6 literal form). */
function stripBrackets(host) {
	if (host.length >= 2 && host.startsWith("[") && host.endsWith("]")) return host.slice(1, -1);
	return host;
}
/**
* Strip trailing `:port` from host-with-port strings.
*
* - Bracketed IPv6 with port: `[::1]:8080` → `[::1]`
* - IPv4/FQDN with port: `127.0.0.1:3000` / `example.com:443` → base form
* - Bare IPv6: `::1` / `fe80::1` → unchanged (multiple colons means no port)
*/
function stripPort(host) {
	if (host.startsWith("[")) {
		const end = host.indexOf("]");
		if (end === -1) return host;
		return host.slice(0, end + 1);
	}
	const firstColon = host.indexOf(":");
	if (firstColon === -1) return host;
	if (host.indexOf(":", firstColon + 1) !== -1) return host;
	return host.slice(0, firstColon);
}
/** Strip IPv6 zone identifier: `fe80::1%eth0` → `fe80::1`. */
function stripZoneId(host) {
	const zone = host.indexOf("%");
	if (zone === -1) return host;
	return host.slice(0, zone);
}
/**
* Strip trailing dots (RFC 1034 absolute DNS form): `localhost.` → `localhost`.
* Without this, `metadata.google.internal.` would fall through to `public` and
* bypass the cloud-metadata / `.localhost` checks, since WHATWG URL parsing
* preserves the trailing dot in `url.hostname`.
*/
function stripTrailingDot(host) {
	return host.replace(/\.+$/, "");
}
/** Fast dotted-decimal shape check. Does NOT validate octet bounds. */
function looksLikeIPv4(host) {
	return /^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(host);
}
/** Pack a validated dotted-decimal IPv4 into a 32-bit unsigned integer. */
function ipv4ToUint32(ip) {
	const parts = ip.split(".");
	return (Number(parts[0]) << 24 | Number(parts[1]) << 16 | Number(parts[2]) << 8 | Number(parts[3])) >>> 0;
}
/** Check whether a 32-bit value matches `prefix/length` (both unsigned). */
function inIPv4Range(value, prefix, length) {
	if (length === 0) return true;
	const mask = length === 32 ? 4294967295 : -1 << 32 - length >>> 0;
	return (value & mask) === (prefix & mask);
}
function classifyIPv4(ip) {
	if (ip === "0.0.0.0") return "unspecified";
	if (ip === "255.255.255.255") return "broadcast";
	const n = ipv4ToUint32(ip);
	if (inIPv4Range(n, ipv4ToUint32("127.0.0.0"), 8)) return "loopback";
	if (inIPv4Range(n, ipv4ToUint32("10.0.0.0"), 8)) return "private";
	if (inIPv4Range(n, ipv4ToUint32("172.16.0.0"), 12)) return "private";
	if (inIPv4Range(n, ipv4ToUint32("192.168.0.0"), 16)) return "private";
	if (inIPv4Range(n, ipv4ToUint32("169.254.0.0"), 16)) return "linkLocal";
	if (inIPv4Range(n, ipv4ToUint32("100.64.0.0"), 10)) return "sharedAddressSpace";
	if (inIPv4Range(n, ipv4ToUint32("192.0.2.0"), 24)) return "documentation";
	if (inIPv4Range(n, ipv4ToUint32("198.51.100.0"), 24)) return "documentation";
	if (inIPv4Range(n, ipv4ToUint32("203.0.113.0"), 24)) return "documentation";
	if (inIPv4Range(n, ipv4ToUint32("198.18.0.0"), 15)) return "benchmarking";
	if (inIPv4Range(n, ipv4ToUint32("224.0.0.0"), 4)) return "multicast";
	if (inIPv4Range(n, ipv4ToUint32("0.0.0.0"), 8)) return "reserved";
	if (inIPv4Range(n, ipv4ToUint32("192.0.0.0"), 24)) return "reserved";
	if (inIPv4Range(n, ipv4ToUint32("240.0.0.0"), 4)) return "reserved";
	return "public";
}
/**
* Extract an IPv4 address embedded in an expanded IPv6 literal.
*
* Used to recurse into tunnel/translation forms (6to4, NAT64, Teredo) so a
* private destination cannot be smuggled behind a syntactically-public IPv6
* literal. `startGroup` is the index of the first of two 16-bit groups in the
* expanded form (`0000:0000:...`). With `xor: true`, the 32-bit value is XORed
* with `0xffffffff` before decoding (Teredo obfuscates the client IPv4 this
* way).
*/
function extractEmbeddedIPv4(expanded, startGroup, options = {}) {
	const offset = startGroup * 5;
	const g1 = Number.parseInt(expanded.slice(offset, offset + 4), 16);
	const g2 = Number.parseInt(expanded.slice(offset + 5, offset + 9), 16);
	if (!Number.isFinite(g1) || !Number.isFinite(g2)) return null;
	let combined = (g1 << 16 | g2) >>> 0;
	if (options.xor) combined = (combined ^ 4294967295) >>> 0;
	return `${combined >>> 24 & 255}.${combined >>> 16 & 255}.${combined >>> 8 & 255}.${combined & 255}`;
}
/**
* Classify an expanded, full-form, lowercase IPv6 address (no IPv4-mapped
* input — those are unmapped to IPv4 before reaching here).
*
* 6to4 (`2002::/16`), NAT64 (`64:ff9b::/96`) and Teredo (`2001:0000::/32`)
* embed an IPv4 that can route to private/loopback space. If the embedded
* IPv4 classifies as non-`public`, return `reserved` — blocks SSRF without
* advertising the address as a loopback literal for RFC 8252 §7.3 matching.
*/
function classifyIPv6(expanded) {
	if (expanded === "0000:0000:0000:0000:0000:0000:0000:0000") return "unspecified";
	if (expanded === "0000:0000:0000:0000:0000:0000:0000:0001") return "loopback";
	const firstByte = Number.parseInt(expanded.slice(0, 2), 16);
	const secondByte = Number.parseInt(expanded.slice(2, 4), 16);
	if (firstByte === 255) return "multicast";
	if (firstByte === 254 && (secondByte & 192) === 128) return "linkLocal";
	if ((firstByte & 254) === 252) return "private";
	if (expanded.startsWith("2001:0db8:")) return "documentation";
	if (expanded.startsWith("2002:")) {
		const embedded = extractEmbeddedIPv4(expanded, 1);
		if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
		return "public";
	}
	if (expanded.startsWith("0064:ff9b:0000:0000:0000:0000:")) {
		const embedded = extractEmbeddedIPv4(expanded, 6);
		if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
		return "reserved";
	}
	if (expanded.startsWith("2001:0000:")) {
		const embedded = extractEmbeddedIPv4(expanded, 6, { xor: true });
		if (embedded && classifyIPv4(embedded) !== "public") return "reserved";
		return "reserved";
	}
	if (expanded.startsWith("0100:0000:0000:0000:")) return "reserved";
	return "public";
}
/**
* Classify a host string according to RFC 6890 / RFC 6761.
*
* Accepts inputs in any of these shapes and normalizes before classifying:
*
*   - Bare IPv4: `127.0.0.1`
*   - Bare IPv6: `::1`, `fe80::1%eth0`
*   - Bracketed IPv6: `[::1]`
*   - Host with port: `localhost:3000`, `127.0.0.1:443`, `[::1]:8080`
*   - FQDN: `example.com`, `tenant.localhost`
*   - IPv4-mapped IPv6: `::ffff:192.0.2.1` (reported as `literal: "ipv4"`)
*
* Invalid or non-resolvable FQDNs are returned as `{ kind: "public", literal: "fqdn" }`
* — this function never throws. Callers that need structural validation must
* combine this with a URL/hostname validator upstream.
*
* @example
* classifyHost("127.0.0.1")
* // { kind: "loopback", literal: "ipv4", canonical: "127.0.0.1" }
*
* @example
* classifyHost("[::1]:8080")
* // { kind: "loopback", literal: "ipv6", canonical: "0000:0000:...:0001" }
*
* @example
* classifyHost("::ffff:192.0.2.1")
* // { kind: "documentation", literal: "ipv4", canonical: "192.0.2.1" }
*
* @example
* classifyHost("tenant-a.localhost")
* // { kind: "localhost", literal: "fqdn", canonical: "tenant-a.localhost" }
*/
function classifyHost(host) {
	const lowered = stripTrailingDot(stripZoneId(stripBrackets(stripPort(host.trim())))).toLowerCase();
	if (lowered === "") return {
		kind: "reserved",
		literal: "fqdn",
		canonical: ""
	};
	if (!isValidIP(lowered)) {
		if (lowered === "localhost" || lowered.endsWith(".localhost")) return {
			kind: "localhost",
			literal: "fqdn",
			canonical: lowered
		};
		if (CLOUD_METADATA_HOSTS.has(lowered)) return {
			kind: "cloudMetadata",
			literal: "fqdn",
			canonical: lowered
		};
		return {
			kind: "public",
			literal: "fqdn",
			canonical: lowered
		};
	}
	if (looksLikeIPv4(lowered)) return {
		kind: classifyIPv4(lowered),
		literal: "ipv4",
		canonical: lowered
	};
	const canonical = normalizeIP(lowered, { ipv6Subnet: 128 });
	if (looksLikeIPv4(canonical)) return {
		kind: classifyIPv4(canonical),
		literal: "ipv4",
		canonical
	};
	return {
		kind: classifyIPv6(canonical),
		literal: "ipv6",
		canonical
	};
}
/**
* Permissive loopback check for developer-ergonomics code paths.
*
* Returns true for IPv4 `127.0.0.0/8`, IPv6 `::1`, the literal name `localhost`,
* and any RFC 6761 `.localhost` subdomain (`tenant.localhost`, `app.localhost`).
*
* Use this for things like: allowing HTTP for dev servers, skipping Secure
* cookie requirements, browser-trust heuristics. Do NOT use this for OAuth
* redirect URI matching — use {@link isLoopbackIP} there.
*
* @example
* isLoopbackHost("localhost")         // true
* isLoopbackHost("tenant.localhost")  // true  (RFC 6761)
* isLoopbackHost("127.0.0.1")         // true
* isLoopbackHost("0.0.0.0")           // false (unspecified, NOT loopback)
*/
function isLoopbackHost$1(host) {
	const kind = classifyHost(host).kind;
	return kind === "loopback" || kind === "localhost";
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/context/helpers.mjs
async function runPluginInit(context) {
	let options = context.options;
	const plugins = options.plugins || [];
	const pluginTrustedOrigins = [];
	const dbHooks = [];
	for (const plugin of plugins) if (plugin.init) {
		const initPromise = plugin.init(context);
		let result;
		if (isPromise(initPromise)) result = await initPromise;
		else result = initPromise;
		if (typeof result === "object") {
			if (result.options) {
				const { databaseHooks, trustedOrigins, ...restOpts } = result.options;
				if (databaseHooks) dbHooks.push({
					source: `plugin:${plugin.id}`,
					hooks: databaseHooks
				});
				if (trustedOrigins) pluginTrustedOrigins.push(trustedOrigins);
				options = defu(options, restOpts);
			}
			if (result.context) Object.assign(context, result.context);
		}
	}
	if (pluginTrustedOrigins.length > 0) {
		const allSources = [...options.trustedOrigins ? [options.trustedOrigins] : [], ...pluginTrustedOrigins];
		const staticOrigins = allSources.filter(Array.isArray).flat();
		const dynamicOrigins = allSources.filter((s) => typeof s === "function");
		if (dynamicOrigins.length > 0) options.trustedOrigins = async (request) => {
			const resolved = await Promise.all(dynamicOrigins.map((fn) => fn(request)));
			return [...staticOrigins, ...resolved.flat()].filter((v) => typeof v === "string" && v !== "");
		};
		else options.trustedOrigins = staticOrigins;
	}
	if (options.databaseHooks) dbHooks.push({
		source: "user",
		hooks: options.databaseHooks
	});
	context.internalAdapter = createInternalAdapter(context.adapter, {
		options,
		logger: context.logger,
		hooks: dbHooks,
		generateId: context.generateId
	});
	context.options = options;
}
function getInternalPlugins(options) {
	const plugins = [];
	if (options.advanced?.crossSubDomainCookies?.enabled) {}
	return plugins;
}
async function getTrustedOrigins(options, request) {
	const trustedOrigins = [];
	if (isDynamicBaseURLConfig(options.baseURL)) {
		const allowedHosts = options.baseURL.allowedHosts;
		for (const host of allowedHosts) if (!host.includes("://")) {
			trustedOrigins.push(`https://${host}`);
			if (isLoopbackHost$1(host)) trustedOrigins.push(`http://${host}`);
		} else trustedOrigins.push(host);
		if (options.baseURL.fallback) try {
			trustedOrigins.push(new URL(options.baseURL.fallback).origin);
		} catch {}
	} else {
		const baseURL = getBaseURL(typeof options.baseURL === "string" ? options.baseURL : void 0, options.basePath, request);
		if (baseURL) trustedOrigins.push(new URL(baseURL).origin);
	}
	if (options.trustedOrigins) {
		if (Array.isArray(options.trustedOrigins)) trustedOrigins.push(...options.trustedOrigins);
		if (typeof options.trustedOrigins === "function") {
			const validOrigins = await options.trustedOrigins(request);
			trustedOrigins.push(...validOrigins);
		}
	}
	const envTrustedOrigins = env.BETTER_AUTH_TRUSTED_ORIGINS;
	if (envTrustedOrigins) trustedOrigins.push(...envTrustedOrigins.split(","));
	return trustedOrigins.filter((v) => Boolean(v));
}
/**
* Picks a `Request`-like or `Headers` value from a direct `auth.api` call.
* Headers are only accepted when they carry a host: without one, host
* resolution would fall back to `null` and the caller should use `fallback`
* or pass a `Request` instead.
*/
function pickSource(input) {
	if (isRequestLike(input?.request)) return input.request;
	if (!input?.headers) return void 0;
	const headers = input.headers instanceof Headers ? input.headers : new Headers(input.headers);
	if (!headers.has("host") && !headers.has("x-forwarded-host")) return;
	return headers;
}
/**
* Returns the effective `trustedProxyHeaders` value for dynamic `baseURL`
* resolution. When the user hasn't set `advanced.trustedProxyHeaders`,
* proxy headers (`x-forwarded-host` / `x-forwarded-proto`) are trusted by
* default so deployments behind a reverse proxy work without extra config.
*/
function resolveDynamicTrustedProxyHeaders(options) {
	return options.advanced?.trustedProxyHeaders ?? true;
}
/**
* Per-request clone with `baseURL`, `trustedOrigins`, `trustedProviders`
* and cookies rehydrated for the resolved host. Throws `BetterAuthError`
* when the URL cannot be resolved; callers on the direct-API path convert
* this to `APIError`.
*/
async function resolveRequestContext(ctx, source, trustedProxyHeaders) {
	const dynamicBaseURLConfig = ctx.options.baseURL;
	const baseURL = resolveBaseURL(dynamicBaseURLConfig, ctx.options.basePath || "/api/auth", source, void 0, trustedProxyHeaders);
	if (!baseURL) throw new BetterAuthError("Could not resolve base URL from request. Check your allowedHosts config.");
	const resolved = Object.create(Object.getPrototypeOf(ctx), Object.getOwnPropertyDescriptors(ctx));
	resolved.baseURL = baseURL;
	resolved.options = {
		...ctx.options,
		baseURL: getOrigin$1(baseURL) || void 0
	};
	const trustedOriginOptions = {
		...resolved.options,
		baseURL: dynamicBaseURLConfig
	};
	const needsRequest = typeof ctx.options.trustedOrigins === "function" || typeof ctx.options.account?.accountLinking?.trustedProviders === "function";
	let callbackRequest;
	if (needsRequest) if (isRequestLike(source)) callbackRequest = source;
	else if (source) callbackRequest = new Request(baseURL, { headers: source });
	else callbackRequest = void 0;
	else callbackRequest = void 0;
	resolved.trustedOrigins = await getTrustedOrigins(trustedOriginOptions, callbackRequest);
	resolved.trustedProviders = await getTrustedProviders(resolved.options, callbackRequest);
	if (ctx.options.advanced?.crossSubDomainCookies?.enabled) {
		resolved.authCookies = getCookies(resolved.options);
		resolved.createAuthCookie = createCookieGetter(resolved.options);
	}
	return resolved;
}
async function getAwaitableValue(arr, item) {
	if (!arr) return void 0;
	for (const val of arr) {
		const value = typeof val === "function" ? await val() : val;
		if (value[item.field ?? "id"] === item.value) return value;
	}
}
async function getTrustedProviders(options, request) {
	const trustedProviders = options.account?.accountLinking?.trustedProviders;
	if (!trustedProviders) return [];
	if (Array.isArray(trustedProviders)) return trustedProviders.filter((v) => Boolean(v));
	return (await trustedProviders(request) ?? []).filter((v) => Boolean(v));
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/oauth2/errors.mjs
var HANDLING_DOCS_URL = "https://www.better-auth.com/docs/concepts/oauth#handling-providers-without-email";
/**
* Build the logger message shown when an OAuth provider does not return an
* email address. Kept in one place so every rejection site points users at
* the same workaround docs.
*/
function missingEmailLogMessage(providerId, options) {
	return `${options?.source === "generic" ? `Generic OAuth provider "${providerId}"` : `Provider "${providerId}"`} did not return an email${options?.source === "id_token" ? " in the id token" : ""}. Either request the provider's email scope, or synthesize one via \`mapProfileToUser\`. See ${HANDLING_DOCS_URL}`;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/oauth2/utils.mjs
/**
* Check if a string looks like encrypted data
*/
function isLikelyEncrypted(token) {
	if (token.startsWith("$ba$")) return true;
	return token.length % 2 === 0 && /^[0-9a-f]+$/i.test(token);
}
function decryptOAuthToken(token, ctx) {
	if (!token) return token;
	if (ctx.options.account?.encryptOAuthTokens) {
		if (!isLikelyEncrypted(token)) return token;
		return symmetricDecrypt({
			key: ctx.secretConfig,
			data: token
		});
	}
	return token;
}
function setTokenUtil(token, ctx) {
	if (ctx.options.account?.encryptOAuthTokens && token) return symmetricEncrypt({
		key: ctx.secretConfig,
		data: token
	});
	return token;
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/oauth2/utils.mjs
function getOAuth2Tokens(data) {
	const getDate = (seconds) => {
		return new Date((/* @__PURE__ */ new Date()).getTime() + seconds * 1e3);
	};
	return {
		tokenType: data.token_type,
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		accessTokenExpiresAt: data.expires_in ? getDate(data.expires_in) : void 0,
		refreshTokenExpiresAt: data.refresh_token_expires_in ? getDate(data.refresh_token_expires_in) : void 0,
		scopes: data?.scope ? typeof data.scope === "string" ? data.scope.split(" ") : data.scope : [],
		idToken: data.id_token,
		raw: data
	};
}
/**
* Return the provider's primary Client ID: the single string, or the entry at
* array index 0 for the cross-platform form used by ID token audience
* verification. Index 0 is the designated primary and pairs with
* `clientSecret` for the authorization code flow; later array entries are
* only used as additional accepted audiences. Returns `undefined` when the
* primary value is missing or an empty string.
*/
function getPrimaryClientId(clientId) {
	const value = Array.isArray(clientId) ? clientId[0] : clientId;
	return typeof value === "string" && value.length > 0 ? value : void 0;
}
async function generateCodeChallenge(codeVerifier) {
	const data = new TextEncoder().encode(codeVerifier);
	const hash = await crypto.subtle.digest("SHA-256", data);
	return base64Url.encode(new Uint8Array(hash), { padding: false });
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/oauth2/create-authorization-url.mjs
async function createAuthorizationURL({ id, options, authorizationEndpoint, state, codeVerifier, scopes, claims, redirectURI, duration, prompt, accessType, responseType, display, loginHint, hd, responseMode, additionalParams, scopeJoiner }) {
	options = typeof options === "function" ? await options() : options;
	const url = new URL(options.authorizationEndpoint || authorizationEndpoint);
	url.searchParams.set("response_type", responseType || "code");
	const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
	url.searchParams.set("client_id", primaryClientId);
	url.searchParams.set("state", state);
	if (scopes) url.searchParams.set("scope", scopes.join(scopeJoiner || " "));
	url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
	duration && url.searchParams.set("duration", duration);
	display && url.searchParams.set("display", display);
	loginHint && url.searchParams.set("login_hint", loginHint);
	prompt && url.searchParams.set("prompt", prompt);
	hd && url.searchParams.set("hd", hd);
	accessType && url.searchParams.set("access_type", accessType);
	responseMode && url.searchParams.set("response_mode", responseMode);
	if (codeVerifier) {
		const codeChallenge = await generateCodeChallenge(codeVerifier);
		url.searchParams.set("code_challenge_method", "S256");
		url.searchParams.set("code_challenge", codeChallenge);
	}
	if (claims) {
		const claimsObj = claims.reduce((acc, claim) => {
			acc[claim] = null;
			return acc;
		}, {});
		url.searchParams.set("claims", JSON.stringify({ id_token: {
			email: null,
			email_verified: null,
			...claimsObj
		} }));
	}
	if (additionalParams) Object.entries(additionalParams).forEach(([key, value]) => {
		url.searchParams.set(key, value);
	});
	return url;
}
//#endregion
//#region ../../node_modules/.pnpm/@better-fetch+fetch@1.1.21/node_modules/@better-fetch/fetch/dist/index.js
var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, {
	enumerable: true,
	configurable: true,
	writable: true,
	value
}) : obj[key] = value;
var __spreadValues = (a, b) => {
	for (var prop in b || (b = {})) if (__hasOwnProp.call(b, prop)) __defNormalProp(a, prop, b[prop]);
	if (__getOwnPropSymbols) {
		for (var prop of __getOwnPropSymbols(b)) if (__propIsEnum.call(b, prop)) __defNormalProp(a, prop, b[prop]);
	}
	return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var BetterFetchError = class extends Error {
	constructor(status, statusText, error) {
		super(statusText || status.toString(), { cause: error });
		this.status = status;
		this.statusText = statusText;
		this.error = error;
		Error.captureStackTrace(this, this.constructor);
	}
};
var initializePlugins = async (url, options) => {
	var _a, _b, _c, _d, _e, _f;
	let opts = options || {};
	const hooks = {
		onRequest: [options == null ? void 0 : options.onRequest],
		onResponse: [options == null ? void 0 : options.onResponse],
		onSuccess: [options == null ? void 0 : options.onSuccess],
		onError: [options == null ? void 0 : options.onError],
		onRetry: [options == null ? void 0 : options.onRetry]
	};
	if (!options || !(options == null ? void 0 : options.plugins)) return {
		url,
		options: opts,
		hooks
	};
	for (const plugin of (options == null ? void 0 : options.plugins) || []) {
		if (plugin.init) {
			const pluginRes = await ((_a = plugin.init) == null ? void 0 : _a.call(plugin, url.toString(), options));
			opts = pluginRes.options || opts;
			url = pluginRes.url;
		}
		hooks.onRequest.push((_b = plugin.hooks) == null ? void 0 : _b.onRequest);
		hooks.onResponse.push((_c = plugin.hooks) == null ? void 0 : _c.onResponse);
		hooks.onSuccess.push((_d = plugin.hooks) == null ? void 0 : _d.onSuccess);
		hooks.onError.push((_e = plugin.hooks) == null ? void 0 : _e.onError);
		hooks.onRetry.push((_f = plugin.hooks) == null ? void 0 : _f.onRetry);
	}
	return {
		url,
		options: opts,
		hooks
	};
};
var LinearRetryStrategy = class {
	constructor(options) {
		this.options = options;
	}
	shouldAttemptRetry(attempt, response) {
		if (this.options.shouldRetry) return Promise.resolve(attempt < this.options.attempts && this.options.shouldRetry(response));
		return Promise.resolve(attempt < this.options.attempts);
	}
	getDelay() {
		return this.options.delay;
	}
};
var ExponentialRetryStrategy = class {
	constructor(options) {
		this.options = options;
	}
	shouldAttemptRetry(attempt, response) {
		if (this.options.shouldRetry) return Promise.resolve(attempt < this.options.attempts && this.options.shouldRetry(response));
		return Promise.resolve(attempt < this.options.attempts);
	}
	getDelay(attempt) {
		return Math.min(this.options.maxDelay, this.options.baseDelay * 2 ** attempt);
	}
};
function createRetryStrategy(options) {
	if (typeof options === "number") return new LinearRetryStrategy({
		type: "linear",
		attempts: options,
		delay: 1e3
	});
	switch (options.type) {
		case "linear": return new LinearRetryStrategy(options);
		case "exponential": return new ExponentialRetryStrategy(options);
		default: throw new Error("Invalid retry strategy");
	}
}
var getAuthHeader = async (options) => {
	const headers = {};
	const getValue = async (value) => typeof value === "function" ? await value() : value;
	if (options == null ? void 0 : options.auth) {
		if (options.auth.type === "Bearer") {
			const token = await getValue(options.auth.token);
			if (!token) return headers;
			headers["authorization"] = `Bearer ${token}`;
		} else if (options.auth.type === "Basic") {
			const [username, password] = await Promise.all([getValue(options.auth.username), getValue(options.auth.password)]);
			if (!username || !password) return headers;
			headers["authorization"] = `Basic ${btoa(`${username}:${password}`)}`;
		} else if (options.auth.type === "Custom") {
			const [prefix, value] = await Promise.all([getValue(options.auth.prefix), getValue(options.auth.value)]);
			if (!value) return headers;
			headers["authorization"] = `${prefix != null ? prefix : ""} ${value}`;
		}
	}
	return headers;
};
var JSON_RE = /^application\/(?:[\w!#$%&*.^`~-]*\+)?json(;.+)?$/i;
function detectResponseType(request) {
	const _contentType = request.headers.get("content-type");
	const textTypes = /* @__PURE__ */ new Set([
		"image/svg",
		"application/xml",
		"application/xhtml",
		"application/html"
	]);
	if (!_contentType) return "json";
	const contentType = _contentType.split(";").shift() || "";
	if (JSON_RE.test(contentType)) return "json";
	if (textTypes.has(contentType) || contentType.startsWith("text/")) return "text";
	return "blob";
}
function isJSONParsable(value) {
	try {
		JSON.parse(value);
		return true;
	} catch (error) {
		return false;
	}
}
function isJSONSerializable(value) {
	if (value === void 0) return false;
	const t = typeof value;
	if (t === "string" || t === "number" || t === "boolean" || t === null) return true;
	if (t !== "object") return false;
	if (Array.isArray(value)) return true;
	if (value.buffer) return false;
	return value.constructor && value.constructor.name === "Object" || typeof value.toJSON === "function";
}
function jsonParse(text) {
	try {
		return JSON.parse(text);
	} catch (error) {
		return text;
	}
}
function isFunction(value) {
	return typeof value === "function";
}
function getFetch(options) {
	if (options == null ? void 0 : options.customFetchImpl) return options.customFetchImpl;
	if (typeof globalThis !== "undefined" && isFunction(globalThis.fetch)) return globalThis.fetch;
	if (typeof window !== "undefined" && isFunction(window.fetch)) return window.fetch;
	throw new Error("No fetch implementation found");
}
async function getHeaders(opts) {
	const headers = new Headers(opts == null ? void 0 : opts.headers);
	const authHeader = await getAuthHeader(opts);
	for (const [key, value] of Object.entries(authHeader || {})) headers.set(key, value);
	if (!headers.has("content-type")) {
		const t = detectContentType(opts == null ? void 0 : opts.body);
		if (t) headers.set("content-type", t);
	}
	return headers;
}
function detectContentType(body) {
	if (isJSONSerializable(body)) return "application/json";
	return null;
}
function getBody(options) {
	if (!(options == null ? void 0 : options.body)) return null;
	const headers = new Headers(options == null ? void 0 : options.headers);
	if (isJSONSerializable(options.body) && !headers.has("content-type")) {
		for (const [key, value] of Object.entries(options == null ? void 0 : options.body)) if (value instanceof Date) options.body[key] = value.toISOString();
		return JSON.stringify(options.body);
	}
	if (headers.has("content-type") && headers.get("content-type") === "application/x-www-form-urlencoded") {
		if (isJSONSerializable(options.body)) return new URLSearchParams(options.body).toString();
		return options.body;
	}
	return options.body;
}
function getMethod(url, options) {
	var _a;
	if (options == null ? void 0 : options.method) return options.method.toUpperCase();
	if (url.startsWith("@")) {
		const pMethod = (_a = url.split("@")[1]) == null ? void 0 : _a.split("/")[0];
		if (!methods.includes(pMethod)) return (options == null ? void 0 : options.body) ? "POST" : "GET";
		return pMethod.toUpperCase();
	}
	return (options == null ? void 0 : options.body) ? "POST" : "GET";
}
function getTimeout(options, controller) {
	let abortTimeout;
	if (!(options == null ? void 0 : options.signal) && (options == null ? void 0 : options.timeout)) abortTimeout = setTimeout(() => controller == null ? void 0 : controller.abort(), options == null ? void 0 : options.timeout);
	return {
		abortTimeout,
		clearTimeout: () => {
			if (abortTimeout) clearTimeout(abortTimeout);
		}
	};
}
var ValidationError = class _ValidationError extends Error {
	constructor(issues, message) {
		super(message || JSON.stringify(issues, null, 2));
		this.issues = issues;
		Object.setPrototypeOf(this, _ValidationError.prototype);
	}
};
async function parseStandardSchema(schema, input) {
	const result = await schema["~standard"].validate(input);
	if (result.issues) throw new ValidationError(result.issues);
	return result.value;
}
var methods = [
	"get",
	"post",
	"put",
	"patch",
	"delete"
];
function getURL2(url, option) {
	const { baseURL, params, query } = option || {
		query: {},
		params: {},
		baseURL: ""
	};
	let basePath = url.startsWith("http") ? url.split("/").slice(0, 3).join("/") : baseURL || "";
	if (url.startsWith("@")) {
		const m = url.toString().split("@")[1].split("/")[0];
		if (methods.includes(m)) url = url.replace(`@${m}/`, "/");
	}
	if (!basePath.endsWith("/")) basePath += "/";
	let [path, urlQuery] = url.replace(basePath, "").split("?");
	const queryParams = new URLSearchParams(urlQuery);
	for (const [key, value] of Object.entries(query || {})) {
		if (value == null) continue;
		let serializedValue;
		if (typeof value === "string") serializedValue = value;
		else if (Array.isArray(value)) {
			for (const val of value) queryParams.append(key, val);
			continue;
		} else serializedValue = JSON.stringify(value);
		queryParams.set(key, serializedValue);
	}
	if (params) if (Array.isArray(params)) {
		const paramPaths = path.split("/").filter((p) => p.startsWith(":"));
		for (const [index, key] of paramPaths.entries()) {
			const value = params[index];
			path = path.replace(key, value);
		}
	} else for (const [key, value] of Object.entries(params)) path = path.replace(`:${key}`, String(value));
	path = path.split("/").map(encodeURIComponent).join("/");
	if (path.startsWith("/")) path = path.slice(1);
	let queryParamString = queryParams.toString();
	queryParamString = queryParamString.length > 0 ? `?${queryParamString}`.replace(/\+/g, "%20") : "";
	if (!basePath.startsWith("http")) return `${basePath}${path}${queryParamString}`;
	return new URL(`${path}${queryParamString}`, basePath);
}
var betterFetch = async (url, options) => {
	var _a, _b, _c, _d, _e, _f, _g, _h;
	const { hooks, url: __url, options: opts } = await initializePlugins(url, options);
	const fetch = getFetch(opts);
	const controller = new AbortController();
	const signal = (_a = opts.signal) != null ? _a : controller.signal;
	const _url = getURL2(__url, opts);
	const body = getBody(opts);
	const headers = await getHeaders(opts);
	const method = getMethod(__url, opts);
	let context = __spreadProps(__spreadValues({}, opts), {
		url: _url,
		headers,
		body,
		method,
		signal
	});
	for (const onRequest of hooks.onRequest) if (onRequest) {
		const res = await onRequest(context);
		if (typeof res === "object" && res !== null) context = res;
	}
	if ("pipeTo" in context && typeof context.pipeTo === "function" || typeof ((_b = options == null ? void 0 : options.body) == null ? void 0 : _b.pipe) === "function") {
		if (!("duplex" in context)) context.duplex = "half";
	}
	const { clearTimeout: clearTimeout2 } = getTimeout(opts, controller);
	let response = await fetch(context.url, context);
	clearTimeout2();
	const responseContext = {
		response,
		request: context
	};
	for (const onResponse of hooks.onResponse) if (onResponse) {
		const r = await onResponse(__spreadProps(__spreadValues({}, responseContext), { response: ((_c = options == null ? void 0 : options.hookOptions) == null ? void 0 : _c.cloneResponse) ? response.clone() : response }));
		if (r instanceof Response) response = r;
		else if (typeof r === "object" && r !== null) response = r.response;
	}
	if (response.ok) {
		if (!(context.method !== "HEAD")) return {
			data: "",
			error: null
		};
		const responseType = detectResponseType(response);
		const successContext = {
			data: null,
			response,
			request: context
		};
		if (responseType === "json" || responseType === "text") {
			const text = await response.text();
			successContext.data = await ((_d = context.jsonParser) != null ? _d : jsonParse)(text);
		} else successContext.data = await response[responseType]();
		if (context == null ? void 0 : context.output) {
			if (context.output && !context.disableValidation) successContext.data = await parseStandardSchema(context.output, successContext.data);
		}
		for (const onSuccess of hooks.onSuccess) if (onSuccess) await onSuccess(__spreadProps(__spreadValues({}, successContext), { response: ((_e = options == null ? void 0 : options.hookOptions) == null ? void 0 : _e.cloneResponse) ? response.clone() : response }));
		if (options == null ? void 0 : options.throw) return successContext.data;
		return {
			data: successContext.data,
			error: null
		};
	}
	const parser = (_f = options == null ? void 0 : options.jsonParser) != null ? _f : jsonParse;
	const responseText = await response.text();
	const isJSONResponse = isJSONParsable(responseText);
	const errorObject = isJSONResponse ? await parser(responseText) : null;
	const errorContext = {
		response,
		responseText,
		request: context,
		error: __spreadProps(__spreadValues({}, errorObject), {
			status: response.status,
			statusText: response.statusText
		})
	};
	for (const onError of hooks.onError) if (onError) await onError(__spreadProps(__spreadValues({}, errorContext), { response: ((_g = options == null ? void 0 : options.hookOptions) == null ? void 0 : _g.cloneResponse) ? response.clone() : response }));
	if (options == null ? void 0 : options.retry) {
		const retryStrategy = createRetryStrategy(options.retry);
		const _retryAttempt = (_h = options.retryAttempt) != null ? _h : 0;
		if (await retryStrategy.shouldAttemptRetry(_retryAttempt, response)) {
			for (const onRetry of hooks.onRetry) if (onRetry) await onRetry(responseContext);
			const delay = retryStrategy.getDelay(_retryAttempt);
			await new Promise((resolve) => setTimeout(resolve, delay));
			return await betterFetch(url, __spreadProps(__spreadValues({}, options), { retryAttempt: _retryAttempt + 1 }));
		}
	}
	if (options == null ? void 0 : options.throw) throw new BetterFetchError(response.status, response.statusText, isJSONResponse ? errorObject : responseText);
	return {
		data: null,
		error: __spreadProps(__spreadValues({}, errorObject), {
			status: response.status,
			statusText: response.statusText
		})
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/oauth2/refresh-access-token.mjs
/**
* @deprecated use async'd refreshAccessTokenRequest instead
*/
function createRefreshAccessTokenRequest({ refreshToken, options, authentication, extraParams, resource }) {
	const body = new URLSearchParams();
	const headers = {
		"content-type": "application/x-www-form-urlencoded",
		accept: "application/json"
	};
	body.set("grant_type", "refresh_token");
	body.set("refresh_token", refreshToken);
	if (authentication === "basic") {
		const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
		if (primaryClientId) headers["authorization"] = "Basic " + base64.encode(`${primaryClientId}:${options.clientSecret ?? ""}`);
		else headers["authorization"] = "Basic " + base64.encode(`:${options.clientSecret ?? ""}`);
	} else {
		const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
		body.set("client_id", primaryClientId);
		if (options.clientSecret) body.set("client_secret", options.clientSecret);
	}
	if (resource) if (typeof resource === "string") body.append("resource", resource);
	else for (const _resource of resource) body.append("resource", _resource);
	if (extraParams) for (const [key, value] of Object.entries(extraParams)) body.set(key, value);
	return {
		body,
		headers
	};
}
async function refreshAccessToken({ refreshToken, options, tokenEndpoint, authentication, extraParams }) {
	const { body, headers } = await createRefreshAccessTokenRequest({
		refreshToken,
		options,
		authentication,
		extraParams
	});
	const { data, error } = await betterFetch(tokenEndpoint, {
		method: "POST",
		body,
		headers
	});
	if (error) throw error;
	const tokens = {
		accessToken: data.access_token,
		refreshToken: data.refresh_token,
		tokenType: data.token_type,
		scopes: data.scope?.split(" "),
		idToken: data.id_token
	};
	if (data.expires_in) tokens.accessTokenExpiresAt = new Date((/* @__PURE__ */ new Date()).getTime() + data.expires_in * 1e3);
	if (data.refresh_token_expires_in) tokens.refreshTokenExpiresAt = new Date((/* @__PURE__ */ new Date()).getTime() + data.refresh_token_expires_in * 1e3);
	return tokens;
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/oauth2/validate-authorization-code.mjs
async function authorizationCodeRequest({ code, codeVerifier, redirectURI, options, authentication, deviceId, headers, additionalParams = {}, resource }) {
	options = typeof options === "function" ? await options() : options;
	return createAuthorizationCodeRequest({
		code,
		codeVerifier,
		redirectURI,
		options,
		authentication,
		deviceId,
		headers,
		additionalParams,
		resource
	});
}
/**
* @deprecated use async'd authorizationCodeRequest instead
*/
function createAuthorizationCodeRequest({ code, codeVerifier, redirectURI, options, authentication, deviceId, headers, additionalParams = {}, resource }) {
	const body = new URLSearchParams();
	const requestHeaders = {
		"content-type": "application/x-www-form-urlencoded",
		accept: "application/json",
		...headers
	};
	body.set("grant_type", "authorization_code");
	body.set("code", code);
	codeVerifier && body.set("code_verifier", codeVerifier);
	options.clientKey && body.set("client_key", options.clientKey);
	deviceId && body.set("device_id", deviceId);
	body.set("redirect_uri", options.redirectURI || redirectURI);
	if (resource) if (typeof resource === "string") body.append("resource", resource);
	else for (const _resource of resource) body.append("resource", _resource);
	if (authentication === "basic") {
		const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
		requestHeaders["authorization"] = `Basic ${base64.encode(`${primaryClientId}:${options.clientSecret ?? ""}`)}`;
	} else {
		const primaryClientId = Array.isArray(options.clientId) ? options.clientId[0] : options.clientId;
		body.set("client_id", primaryClientId);
		if (options.clientSecret) body.set("client_secret", options.clientSecret);
	}
	for (const [key, value] of Object.entries(additionalParams)) if (!body.has(key)) body.append(key, value);
	return {
		body,
		headers: requestHeaders
	};
}
async function validateAuthorizationCode({ code, codeVerifier, redirectURI, options, tokenEndpoint, authentication, deviceId, headers, additionalParams = {}, resource }) {
	const { body, headers: requestHeaders } = await authorizationCodeRequest({
		code,
		codeVerifier,
		redirectURI,
		options,
		authentication,
		deviceId,
		headers,
		additionalParams,
		resource
	});
	const { data, error } = await betterFetch(tokenEndpoint, {
		method: "POST",
		body,
		headers: requestHeaders
	});
	if (error) throw error;
	return getOAuth2Tokens(data);
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/apple.mjs
var apple = (options) => {
	const tokenEndpoint = "https://appleid.apple.com/auth/token";
	return {
		id: "apple",
		name: "Apple",
		async createAuthorizationURL({ state, scopes, redirectURI }) {
			if (!getPrimaryClientId(options.clientId) || !options.clientSecret) {
				logger.error("Client ID and client secret are required for Apple. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			const _scope = options.disableDefaultScope ? [] : ["email", "name"];
			if (options.scope) _scope.push(...options.scope);
			if (scopes) _scope.push(...scopes);
			return await createAuthorizationURL({
				id: "apple",
				options,
				authorizationEndpoint: "https://appleid.apple.com/auth/authorize",
				scopes: _scope,
				state,
				redirectURI,
				responseMode: "form_post",
				responseType: "code id_token"
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		async verifyIdToken(token, nonce) {
			if (options.disableIdTokenSignIn) return false;
			if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
			try {
				const { kid, alg: jwtAlg } = decodeProtectedHeader(token);
				if (!kid || !jwtAlg) return false;
				const { payload: jwtClaims } = await jwtVerify(token, await getApplePublicKey(kid), {
					algorithms: [jwtAlg],
					issuer: "https://appleid.apple.com",
					audience: options.audience && options.audience.length ? options.audience : options.appBundleIdentifier ? options.appBundleIdentifier : options.clientId,
					maxTokenAge: "1h"
				});
				["email_verified", "is_private_email"].forEach((field) => {
					if (jwtClaims[field] !== void 0) jwtClaims[field] = Boolean(jwtClaims[field]);
				});
				if (nonce && jwtClaims.nonce !== nonce) return false;
				return !!jwtClaims;
			} catch {
				return false;
			}
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options,
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const profile = decodeJwt(token.idToken);
			if (!profile) return null;
			let name;
			if (token.user?.name) name = `${token.user.name.firstName || ""} ${token.user.name.lastName || ""}`.trim();
			else name = profile.name || "";
			const emailVerified = typeof profile.email_verified === "boolean" ? profile.email_verified : profile.email_verified === "true";
			const enrichedProfile = {
				...profile,
				name
			};
			const userMap = await options.mapProfileToUser?.(enrichedProfile);
			return {
				user: {
					id: profile.sub,
					name: enrichedProfile.name,
					emailVerified,
					email: profile.email,
					...userMap
				},
				data: enrichedProfile
			};
		},
		options
	};
};
var getApplePublicKey = async (kid) => {
	const { data } = await betterFetch(`https://appleid.apple.com/auth/keys`);
	if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
	const jwk = data.keys.find((key) => key.kid === kid);
	if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
	return await importJWK(jwk, jwk.alg);
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/atlassian.mjs
var atlassian = (options) => {
	const tokenEndpoint = "https://auth.atlassian.com/oauth/token";
	return {
		id: "atlassian",
		name: "Atlassian",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Secret are required for Atlassian");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Atlassian");
			const _scopes = options.disableDefaultScope ? [] : ["read:jira-user", "offline_access"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "atlassian",
				options,
				authorizationEndpoint: "https://auth.atlassian.com/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				additionalParams: { audience: "api.atlassian.com" },
				prompt: options.prompt
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.accessToken) return null;
			try {
				const { data: profile } = await betterFetch("https://api.atlassian.com/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (!profile) return null;
				const userMap = await options.mapProfileToUser?.(profile);
				return {
					user: {
						id: profile.account_id,
						name: profile.name,
						email: profile.email,
						image: profile.picture,
						emailVerified: false,
						...userMap
					},
					data: profile
				};
			} catch (error) {
				logger.error("Failed to fetch user info from Figma:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/cognito.mjs
var cognito = (options) => {
	if (!options.domain || !options.region || !options.userPoolId) {
		logger.error("Domain, region and userPoolId are required for Amazon Cognito. Make sure to provide them in the options.");
		throw new BetterAuthError("DOMAIN_AND_REGION_REQUIRED");
	}
	const cleanDomain = options.domain.replace(/^https?:\/\//, "");
	const authorizationEndpoint = `https://${cleanDomain}/oauth2/authorize`;
	const tokenEndpoint = `https://${cleanDomain}/oauth2/token`;
	const userInfoEndpoint = `https://${cleanDomain}/oauth2/userinfo`;
	return {
		id: "cognito",
		name: "Cognito",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			if (!getPrimaryClientId(options.clientId)) {
				logger.error("ClientId is required for Amazon Cognito. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (options.requireClientSecret && !options.clientSecret) {
				logger.error("Client Secret is required when requireClientSecret is true. Make sure to provide it in the options.");
				throw new BetterAuthError("CLIENT_SECRET_REQUIRED");
			}
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			const url = await createAuthorizationURL({
				id: "cognito",
				options: { ...options },
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt
			});
			const scopeValue = url.searchParams.get("scope");
			if (scopeValue) {
				url.searchParams.delete("scope");
				const encodedScope = encodeURIComponent(scopeValue);
				const urlString = url.toString();
				const separator = urlString.includes("?") ? "&" : "?";
				return new URL(`${urlString}${separator}scope=${encodedScope}`);
			}
			return url;
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async verifyIdToken(token, nonce) {
			if (options.disableIdTokenSignIn) return false;
			if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
			try {
				const { kid, alg: jwtAlg } = decodeProtectedHeader(token);
				if (!kid || !jwtAlg) return false;
				const publicKey = await getCognitoPublicKey(kid, options.region, options.userPoolId);
				const expectedIssuer = `https://cognito-idp.${options.region}.amazonaws.com/${options.userPoolId}`;
				const { payload: jwtClaims } = await jwtVerify(token, publicKey, {
					algorithms: [jwtAlg],
					issuer: expectedIssuer,
					audience: options.clientId,
					maxTokenAge: "1h"
				});
				if (nonce && jwtClaims.nonce !== nonce) return false;
				return true;
			} catch (error) {
				logger.error("Failed to verify ID token:", error);
				return false;
			}
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (token.idToken) try {
				const profile = decodeJwt(token.idToken);
				if (!profile) return null;
				const name = profile.name || profile.given_name || profile.username || "";
				const enrichedProfile = {
					...profile,
					name
				};
				const userMap = await options.mapProfileToUser?.(enrichedProfile);
				return {
					user: {
						id: profile.sub,
						name: enrichedProfile.name,
						email: profile.email,
						image: profile.picture,
						emailVerified: profile.email_verified,
						...userMap
					},
					data: enrichedProfile
				};
			} catch (error) {
				logger.error("Failed to decode ID token:", error);
			}
			if (token.accessToken) try {
				const { data: userInfo } = await betterFetch(userInfoEndpoint, { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (userInfo) {
					const userMap = await options.mapProfileToUser?.(userInfo);
					return {
						user: {
							id: userInfo.sub,
							name: userInfo.name || userInfo.given_name || userInfo.username || "",
							email: userInfo.email,
							image: userInfo.picture,
							emailVerified: userInfo.email_verified,
							...userMap
						},
						data: userInfo
					};
				}
			} catch (error) {
				logger.error("Failed to fetch user info from Cognito:", error);
			}
			return null;
		},
		options
	};
};
var getCognitoPublicKey = async (kid, region, userPoolId) => {
	const COGNITO_JWKS_URI = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
	try {
		const { data } = await betterFetch(COGNITO_JWKS_URI);
		if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
		const jwk = data.keys.find((key) => key.kid === kid);
		if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
		return await importJWK(jwk, jwk.alg);
	} catch (error) {
		logger.error("Failed to fetch Cognito public key:", error);
		throw error;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/discord.mjs
var discord = (options) => {
	const tokenEndpoint = "https://discord.com/api/oauth2/token";
	return {
		id: "discord",
		name: "Discord",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["identify", "email"];
			if (scopes) _scopes.push(...scopes);
			if (options.scope) _scopes.push(...options.scope);
			const permissionsParam = _scopes.includes("bot") && options.permissions !== void 0 ? `&permissions=${options.permissions}` : "";
			return new URL(`https://discord.com/api/oauth2/authorize?scope=${_scopes.join("+")}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(options.redirectURI || redirectURI)}&state=${state}&prompt=${options.prompt || "none"}${permissionsParam}`);
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://discord.com/api/users/@me", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			if (profile.avatar === null) profile.image_url = `https://cdn.discordapp.com/embed/avatars/${profile.discriminator === "0" ? Number(BigInt(profile.id) >> BigInt(22)) % 6 : parseInt(profile.discriminator) % 5}.png`;
			else {
				const format = profile.avatar.startsWith("a_") ? "gif" : "png";
				profile.image_url = `https://cdn.discordapp.com/avatars/${profile.id}/${profile.avatar}.${format}`;
			}
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.global_name || profile.username || "",
					email: profile.email,
					emailVerified: profile.verified,
					image: profile.image_url,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/dropbox.mjs
var dropbox = (options) => {
	const tokenEndpoint = "https://api.dropboxapi.com/oauth2/token";
	return {
		id: "dropbox",
		name: "Dropbox",
		createAuthorizationURL: async ({ state, scopes, codeVerifier, redirectURI }) => {
			const _scopes = options.disableDefaultScope ? [] : ["account_info.read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			const additionalParams = {};
			if (options.accessType) additionalParams.token_access_type = options.accessType;
			return await createAuthorizationURL({
				id: "dropbox",
				options,
				authorizationEndpoint: "https://www.dropbox.com/oauth2/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				codeVerifier,
				additionalParams
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return await validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.dropboxapi.com/2/users/get_current_account", {
				method: "POST",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.account_id,
					name: profile.name?.display_name,
					email: profile.email,
					emailVerified: profile.email_verified || false,
					image: profile.profile_photo_url,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/facebook.mjs
var facebook = (options) => {
	return {
		id: "facebook",
		name: "Facebook",
		async createAuthorizationURL({ state, scopes, redirectURI, loginHint }) {
			if (!getPrimaryClientId(options.clientId) || !options.clientSecret) {
				logger.error("Client ID and client secret are required for Facebook. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			const _scopes = options.disableDefaultScope ? [] : ["email", "public_profile"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "facebook",
				options,
				authorizationEndpoint: "https://www.facebook.com/v24.0/dialog/oauth",
				scopes: _scopes,
				state,
				redirectURI,
				loginHint,
				additionalParams: options.configId ? { config_id: options.configId } : {}
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint: "https://graph.facebook.com/v24.0/oauth/access_token"
			});
		},
		async verifyIdToken(token, nonce) {
			if (options.disableIdTokenSignIn) return false;
			if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
			if (token.split(".").length === 3) try {
				const { payload: jwtClaims } = await jwtVerify(token, createRemoteJWKSet(new URL("https://limited.facebook.com/.well-known/oauth/openid/jwks/")), {
					algorithms: ["RS256"],
					audience: options.clientId,
					issuer: "https://www.facebook.com"
				});
				if (nonce && jwtClaims.nonce !== nonce) return false;
				return !!jwtClaims;
			} catch {
				return false;
			}
			return true;
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint: "https://graph.facebook.com/v24.0/oauth/access_token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (token.idToken && token.idToken.split(".").length === 3) {
				const profile = decodeJwt(token.idToken);
				const user = {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					picture: { data: {
						url: profile.picture,
						height: 100,
						width: 100,
						is_silhouette: false
					} }
				};
				const userMap = await options.mapProfileToUser?.({
					...user,
					email_verified: false
				});
				return {
					user: {
						...user,
						emailVerified: false,
						...userMap
					},
					data: profile
				};
			}
			const { data: profile, error } = await betterFetch("https://graph.facebook.com/me?fields=" + [
				"id",
				"name",
				"email",
				"picture",
				...options?.fields || []
			].join(","), { auth: {
				type: "Bearer",
				token: token.accessToken
			} });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.name,
					email: profile.email,
					image: profile.picture.data.url,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/figma.mjs
var figma = (options) => {
	const tokenEndpoint = "https://api.figma.com/v1/oauth/token";
	return {
		id: "figma",
		name: "Figma",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret are required for Figma. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Figma");
			const _scopes = options.disableDefaultScope ? [] : ["current_user:read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "figma",
				options,
				authorizationEndpoint: "https://www.figma.com/oauth",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint,
				authentication: "basic"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint,
				authentication: "basic"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			try {
				const { data: profile } = await betterFetch("https://api.figma.com/v1/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (!profile) {
					logger.error("Failed to fetch user from Figma");
					return null;
				}
				const userMap = await options.mapProfileToUser?.(profile);
				return {
					user: {
						id: profile.id,
						name: profile.handle,
						email: profile.email,
						image: profile.img_url,
						emailVerified: false,
						...userMap
					},
					data: profile
				};
			} catch (error) {
				logger.error("Failed to fetch user info from Figma:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/github.mjs
var github = (options) => {
	const tokenEndpoint = "https://github.com/login/oauth/access_token";
	return {
		id: "github",
		name: "GitHub",
		createAuthorizationURL({ state, scopes, loginHint, codeVerifier, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["read:user", "user:email"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "github",
				options,
				authorizationEndpoint: "https://github.com/login/oauth/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				loginHint,
				prompt: options.prompt
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			const { body, headers: requestHeaders } = createAuthorizationCodeRequest({
				code,
				codeVerifier,
				redirectURI,
				options
			});
			const { data, error } = await betterFetch(tokenEndpoint, {
				method: "POST",
				body,
				headers: requestHeaders
			});
			if (error) {
				logger.error("GitHub OAuth token exchange failed:", error);
				return null;
			}
			if ("error" in data) {
				logger.error("GitHub OAuth token exchange failed:", data);
				return null;
			}
			return getOAuth2Tokens(data);
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.github.com/user", { headers: {
				"User-Agent": "better-auth",
				authorization: `Bearer ${token.accessToken}`
			} });
			if (error) return null;
			const { data: emails } = await betterFetch("https://api.github.com/user/emails", { headers: {
				Authorization: `Bearer ${token.accessToken}`,
				"User-Agent": "better-auth"
			} });
			if (!profile.email && emails) profile.email = (emails.find((e) => e.primary) ?? emails[0])?.email;
			const emailVerified = emails?.find((e) => e.email === profile.email)?.verified ?? false;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.name || profile.login || "",
					email: profile.email,
					image: profile.avatar_url,
					emailVerified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/gitlab.mjs
var cleanDoubleSlashes = (input = "") => {
	return input.split("://").map((str) => str.replace(/\/{2,}/g, "/")).join("://");
};
var issuerToEndpoints = (issuer) => {
	const baseUrl = issuer || "https://gitlab.com";
	return {
		authorizationEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/authorize`),
		tokenEndpoint: cleanDoubleSlashes(`${baseUrl}/oauth/token`),
		userinfoEndpoint: cleanDoubleSlashes(`${baseUrl}/api/v4/user`)
	};
};
var gitlab = (options) => {
	const { authorizationEndpoint, tokenEndpoint, userinfoEndpoint } = issuerToEndpoints(options.issuer);
	const issuerId = "gitlab";
	return {
		id: issuerId,
		name: "Gitlab",
		createAuthorizationURL: async ({ state, scopes, codeVerifier, loginHint, redirectURI }) => {
			const _scopes = options.disableDefaultScope ? [] : ["read_user"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: issuerId,
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				redirectURI,
				codeVerifier,
				loginHint
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI, codeVerifier }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				codeVerifier,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch(userinfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error || profile.state !== "active" || profile.locked) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.name ?? profile.username ?? "",
					email: profile.email,
					image: profile.avatar_url,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/google.mjs
var google = (options) => {
	return {
		id: "google",
		name: "Google",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint, display }) {
			if (!getPrimaryClientId(options.clientId) || !options.clientSecret) {
				logger.error("Client Id and Client Secret is required for Google. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Google");
			const _scopes = options.disableDefaultScope ? [] : [
				"email",
				"profile",
				"openid"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "google",
				options,
				authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt,
				accessType: options.accessType,
				display: display || options.display,
				loginHint,
				hd: options.hd,
				additionalParams: { include_granted_scopes: "true" }
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint: "https://oauth2.googleapis.com/token"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint: "https://oauth2.googleapis.com/token"
			});
		},
		async verifyIdToken(token, nonce) {
			if (options.disableIdTokenSignIn) return false;
			if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
			try {
				const { kid, alg: jwtAlg } = decodeProtectedHeader(token);
				if (!kid || !jwtAlg) return false;
				const { payload: jwtClaims } = await jwtVerify(token, await getGooglePublicKey(kid), {
					algorithms: [jwtAlg],
					issuer: ["https://accounts.google.com", "accounts.google.com"],
					audience: options.clientId,
					maxTokenAge: "1h"
				});
				if (nonce && jwtClaims.nonce !== nonce) return false;
				return true;
			} catch {
				return false;
			}
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const user = decodeJwt(token.idToken);
			const userMap = await options.mapProfileToUser?.(user);
			return {
				user: {
					id: user.sub,
					name: user.name,
					email: user.email,
					image: user.picture,
					emailVerified: user.email_verified,
					...userMap
				},
				data: user
			};
		},
		options
	};
};
var getGooglePublicKey = async (kid) => {
	const { data } = await betterFetch("https://www.googleapis.com/oauth2/v3/certs");
	if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
	const jwk = data.keys.find((key) => key.kid === kid);
	if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
	return await importJWK(jwk, jwk.alg);
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/huggingface.mjs
var huggingface = (options) => {
	const tokenEndpoint = "https://huggingface.co/oauth/token";
	return {
		id: "huggingface",
		name: "Hugging Face",
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "huggingface",
				options,
				authorizationEndpoint: "https://huggingface.co/oauth/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://huggingface.co/oauth/userinfo", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.sub,
					name: profile.name || profile.preferred_username || "",
					email: profile.email,
					image: profile.picture,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/kakao.mjs
var kakao = (options) => {
	const tokenEndpoint = "https://kauth.kakao.com/oauth/token";
	return {
		id: "kakao",
		name: "Kakao",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"account_email",
				"profile_image",
				"profile_nickname"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "kakao",
				options,
				authorizationEndpoint: "https://kauth.kakao.com/oauth/authorize",
				scopes: _scopes,
				state,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://kapi.kakao.com/v2/user/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			const account = profile.kakao_account || {};
			const kakaoProfile = account.profile || {};
			return {
				user: {
					id: String(profile.id),
					name: kakaoProfile.nickname || account.name || "",
					email: account.email,
					image: kakaoProfile.profile_image_url || kakaoProfile.thumbnail_image_url,
					emailVerified: !!account.is_email_valid && !!account.is_email_verified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/kick.mjs
var kick = (options) => {
	return {
		id: "kick",
		name: "Kick",
		createAuthorizationURL({ state, scopes, redirectURI, codeVerifier }) {
			const _scopes = options.disableDefaultScope ? [] : ["user:read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "kick",
				redirectURI,
				options,
				authorizationEndpoint: "https://id.kick.com/oauth/authorize",
				scopes: _scopes,
				codeVerifier,
				state
			});
		},
		async validateAuthorizationCode({ code, redirectURI, codeVerifier }) {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint: "https://id.kick.com/oauth/token",
				codeVerifier
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint: "https://id.kick.com/oauth/token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data, error } = await betterFetch("https://api.kick.com/public/v1/users", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const profile = data.data[0];
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.user_id,
					name: profile.name,
					email: profile.email,
					image: profile.profile_picture,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/line.mjs
/**
* LINE Login v2.1
* - Authorization endpoint: https://access.line.me/oauth2/v2.1/authorize
* - Token endpoint: https://api.line.me/oauth2/v2.1/token
* - UserInfo endpoint: https://api.line.me/oauth2/v2.1/userinfo
* - Verify ID token: https://api.line.me/oauth2/v2.1/verify
*
* Docs: https://developers.line.biz/en/reference/line-login/#issue-access-token
*/
var line = (options) => {
	const authorizationEndpoint = "https://access.line.me/oauth2/v2.1/authorize";
	const tokenEndpoint = "https://api.line.me/oauth2/v2.1/token";
	const userInfoEndpoint = "https://api.line.me/oauth2/v2.1/userinfo";
	const verifyIdTokenEndpoint = "https://api.line.me/oauth2/v2.1/verify";
	return {
		id: "line",
		name: "LINE",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "line",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				loginHint
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async verifyIdToken(token, nonce) {
			if (options.disableIdTokenSignIn) return false;
			if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
			const body = new URLSearchParams();
			body.set("id_token", token);
			body.set("client_id", options.clientId);
			if (nonce) body.set("nonce", nonce);
			const { data, error } = await betterFetch(verifyIdTokenEndpoint, {
				method: "POST",
				headers: { "content-type": "application/x-www-form-urlencoded" },
				body
			});
			if (error || !data) return false;
			if (data.aud !== options.clientId) return false;
			if (data.nonce && data.nonce !== nonce) return false;
			return true;
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			let profile = null;
			if (token.idToken) try {
				profile = decodeJwt(token.idToken);
			} catch {}
			if (!profile) {
				const { data } = await betterFetch(userInfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
				profile = data || null;
			}
			if (!profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			const id = profile.sub || profile.userId;
			const name = profile.name || profile.displayName || "";
			const image = profile.picture || profile.pictureUrl || void 0;
			return {
				user: {
					id,
					name,
					email: profile.email,
					image,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/linear.mjs
var linear = (options) => {
	const tokenEndpoint = "https://api.linear.app/oauth/token";
	return {
		id: "linear",
		name: "Linear",
		createAuthorizationURL({ state, scopes, loginHint, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["read"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "linear",
				options,
				authorizationEndpoint: "https://linear.app/oauth/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				loginHint
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.linear.app/graphql", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token.accessToken}`
				},
				body: JSON.stringify({ query: `
							query {
								viewer {
									id
									name
									email
									avatarUrl
									active
									createdAt
									updatedAt
								}
							}
						` })
			});
			if (error || !profile?.data?.viewer) return null;
			const userData = profile.data.viewer;
			const userMap = await options.mapProfileToUser?.(userData);
			return {
				user: {
					id: profile.data.viewer.id,
					name: profile.data.viewer.name,
					email: profile.data.viewer.email,
					image: profile.data.viewer.avatarUrl,
					emailVerified: false,
					...userMap
				},
				data: userData
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/linkedin.mjs
var linkedin = (options) => {
	const authorizationEndpoint = "https://www.linkedin.com/oauth/v2/authorization";
	const tokenEndpoint = "https://www.linkedin.com/oauth/v2/accessToken";
	return {
		id: "linkedin",
		name: "Linkedin",
		createAuthorizationURL: async ({ state, scopes, redirectURI, loginHint }) => {
			const _scopes = options.disableDefaultScope ? [] : [
				"profile",
				"email",
				"openid"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "linkedin",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				loginHint,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return await validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.linkedin.com/v2/userinfo", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					emailVerified: profile.email_verified ?? false,
					image: profile.picture,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/microsoft-entra-id.mjs
var microsoft = (options) => {
	const tenant = options.tenantId || "common";
	const authority = options.authority || "https://login.microsoftonline.com";
	const authorizationEndpoint = `${authority}/${tenant}/oauth2/v2.0/authorize`;
	const tokenEndpoint = `${authority}/${tenant}/oauth2/v2.0/token`;
	return {
		id: "microsoft",
		name: "Microsoft EntraID",
		createAuthorizationURL(data) {
			if (!getPrimaryClientId(options.clientId)) {
				logger.error("Client Id is required for Microsoft Entra ID. Make sure to provide it in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			const scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email",
				"User.Read",
				"offline_access"
			];
			if (options.scope) scopes.push(...options.scope);
			if (data.scopes) scopes.push(...data.scopes);
			return createAuthorizationURL({
				id: "microsoft",
				options,
				authorizationEndpoint,
				state: data.state,
				codeVerifier: data.codeVerifier,
				scopes,
				redirectURI: data.redirectURI,
				prompt: options.prompt,
				loginHint: data.loginHint
			});
		},
		validateAuthorizationCode({ code, codeVerifier, redirectURI }) {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		async verifyIdToken(token, nonce) {
			if (options.disableIdTokenSignIn) return false;
			if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
			try {
				const { kid, alg: jwtAlg } = decodeProtectedHeader(token);
				if (!kid || !jwtAlg) return false;
				const publicKey = await getMicrosoftPublicKey(kid, tenant, authority);
				const verifyOptions = {
					algorithms: [jwtAlg],
					audience: options.clientId,
					maxTokenAge: "1h"
				};
				/**
				* Issuer varies per user's tenant for multi-tenant endpoints, so only validate for specific tenants.
				* @see https://learn.microsoft.com/en-us/entra/identity-platform/v2-protocols#endpoints
				*/
				if (tenant !== "common" && tenant !== "organizations" && tenant !== "consumers") verifyOptions.issuer = `${authority}/${tenant}/v2.0`;
				const { payload: jwtClaims } = await jwtVerify(token, publicKey, verifyOptions);
				if (nonce && jwtClaims.nonce !== nonce) return false;
				return true;
			} catch (error) {
				logger.error("Failed to verify ID token:", error);
				return false;
			}
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const user = decodeJwt(token.idToken);
			const profilePhotoSize = options.profilePhotoSize || 48;
			await betterFetch(`https://graph.microsoft.com/v1.0/me/photos/${profilePhotoSize}x${profilePhotoSize}/$value`, {
				headers: { Authorization: `Bearer ${token.accessToken}` },
				async onResponse(context) {
					if (options.disableProfilePhoto || !context.response.ok) return;
					try {
						const pictureBuffer = await context.response.clone().arrayBuffer();
						user.picture = `data:image/jpeg;base64, ${base64.encode(pictureBuffer)}`;
					} catch (e) {
						logger.error(e && typeof e === "object" && "name" in e ? e.name : "", e);
					}
				}
			});
			const userMap = await options.mapProfileToUser?.(user);
			const emailVerified = user.email_verified !== void 0 ? user.email_verified : user.email && (user.verified_primary_email?.includes(user.email) || user.verified_secondary_email?.includes(user.email)) ? true : false;
			return {
				user: {
					id: user.sub,
					name: user.name,
					email: user.email,
					image: user.picture,
					emailVerified,
					...userMap
				},
				data: user
			};
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			const scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email",
				"User.Read",
				"offline_access"
			];
			if (options.scope) scopes.push(...options.scope);
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				extraParams: { scope: scopes.join(" ") },
				tokenEndpoint
			});
		},
		options
	};
};
var getMicrosoftPublicKey = async (kid, tenant, authority) => {
	const { data } = await betterFetch(`${authority}/${tenant}/discovery/v2.0/keys`);
	if (!data?.keys) throw new APIError("BAD_REQUEST", { message: "Keys not found" });
	const jwk = data.keys.find((key) => key.kid === kid);
	if (!jwk) throw new Error(`JWK with kid ${kid} not found`);
	return await importJWK(jwk, jwk.alg);
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/naver.mjs
var naver = (options) => {
	const tokenEndpoint = "https://nid.naver.com/oauth2.0/token";
	return {
		id: "naver",
		name: "Naver",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["profile", "email"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "naver",
				options,
				authorizationEndpoint: "https://nid.naver.com/oauth2.0/authorize",
				scopes: _scopes,
				state,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://openapi.naver.com/v1/nid/me", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile || profile.resultcode !== "00") return null;
			const userMap = await options.mapProfileToUser?.(profile);
			const res = profile.response || {};
			return {
				user: {
					id: res.id,
					name: res.name || res.nickname || "",
					email: res.email,
					image: res.profile_image,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/notion.mjs
var notion = (options) => {
	const tokenEndpoint = "https://api.notion.com/v1/oauth/token";
	return {
		id: "notion",
		name: "Notion",
		createAuthorizationURL({ state, scopes, loginHint, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : [];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "notion",
				options,
				authorizationEndpoint: "https://api.notion.com/v1/oauth/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				loginHint,
				additionalParams: { owner: "user" }
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint,
				authentication: "basic"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.notion.com/v1/users/me", { headers: {
				Authorization: `Bearer ${token.accessToken}`,
				"Notion-Version": "2022-06-28"
			} });
			if (error || !profile) return null;
			const userProfile = profile.bot?.owner?.user;
			if (!userProfile) return null;
			const userMap = await options.mapProfileToUser?.(userProfile);
			return {
				user: {
					id: userProfile.id,
					name: userProfile.name || "",
					email: userProfile.person?.email || null,
					image: userProfile.avatar_url,
					emailVerified: false,
					...userMap
				},
				data: userProfile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/paybin.mjs
var paybin = (options) => {
	const issuer = options.issuer || "https://idp.paybin.io";
	const authorizationEndpoint = `${issuer}/oauth2/authorize`;
	const tokenEndpoint = `${issuer}/oauth2/token`;
	return {
		id: "paybin",
		name: "Paybin",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI, loginHint }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret is required for Paybin. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Paybin");
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"email",
				"profile"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return await createAuthorizationURL({
				id: "paybin",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt,
				loginHint
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.idToken) return null;
			const user = decodeJwt(token.idToken);
			const userMap = await options.mapProfileToUser?.(user);
			return {
				user: {
					id: user.sub,
					name: user.name || user.preferred_username || "",
					email: user.email,
					image: user.picture,
					emailVerified: user.email_verified || false,
					...userMap
				},
				data: user
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/paypal.mjs
var paypal = (options) => {
	const isSandbox = (options.environment || "sandbox") === "sandbox";
	const authorizationEndpoint = isSandbox ? "https://www.sandbox.paypal.com/signin/authorize" : "https://www.paypal.com/signin/authorize";
	const tokenEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/oauth2/token" : "https://api-m.paypal.com/v1/oauth2/token";
	const userInfoEndpoint = isSandbox ? "https://api-m.sandbox.paypal.com/v1/identity/oauth2/userinfo" : "https://api-m.paypal.com/v1/identity/oauth2/userinfo";
	return {
		id: "paypal",
		name: "PayPal",
		async createAuthorizationURL({ state, codeVerifier, redirectURI }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret is required for PayPal. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			return await createAuthorizationURL({
				id: "paypal",
				options,
				authorizationEndpoint,
				scopes: [],
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			/**
			* PayPal requires Basic Auth for token exchange
			**/
			const credentials = base64.encode(`${options.clientId}:${options.clientSecret}`);
			try {
				const response = await betterFetch(tokenEndpoint, {
					method: "POST",
					headers: {
						Authorization: `Basic ${credentials}`,
						Accept: "application/json",
						"Accept-Language": "en_US",
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: new URLSearchParams({
						grant_type: "authorization_code",
						code,
						redirect_uri: redirectURI
					}).toString()
				});
				if (!response.data) throw new BetterAuthError("FAILED_TO_GET_ACCESS_TOKEN");
				const data = response.data;
				return {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					accessTokenExpiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1e3) : void 0,
					idToken: data.id_token
				};
			} catch (error) {
				logger.error("PayPal token exchange failed:", error);
				throw new BetterAuthError("FAILED_TO_GET_ACCESS_TOKEN");
			}
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			const credentials = base64.encode(`${options.clientId}:${options.clientSecret}`);
			try {
				const response = await betterFetch(tokenEndpoint, {
					method: "POST",
					headers: {
						Authorization: `Basic ${credentials}`,
						Accept: "application/json",
						"Accept-Language": "en_US",
						"Content-Type": "application/x-www-form-urlencoded"
					},
					body: new URLSearchParams({
						grant_type: "refresh_token",
						refresh_token: refreshToken
					}).toString()
				});
				if (!response.data) throw new BetterAuthError("FAILED_TO_REFRESH_ACCESS_TOKEN");
				const data = response.data;
				return {
					accessToken: data.access_token,
					refreshToken: data.refresh_token,
					accessTokenExpiresAt: data.expires_in ? new Date(Date.now() + data.expires_in * 1e3) : void 0
				};
			} catch (error) {
				logger.error("PayPal token refresh failed:", error);
				throw new BetterAuthError("FAILED_TO_REFRESH_ACCESS_TOKEN");
			}
		},
		async verifyIdToken(token, nonce) {
			if (options.disableIdTokenSignIn) return false;
			if (options.verifyIdToken) return options.verifyIdToken(token, nonce);
			try {
				return !!decodeJwt(token).sub;
			} catch (error) {
				logger.error("Failed to verify PayPal ID token:", error);
				return false;
			}
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			if (!token.accessToken) {
				logger.error("Access token is required to fetch PayPal user info");
				return null;
			}
			try {
				const response = await betterFetch(`${userInfoEndpoint}?schema=paypalv1.1`, { headers: {
					Authorization: `Bearer ${token.accessToken}`,
					Accept: "application/json"
				} });
				if (!response.data) {
					logger.error("Failed to fetch user info from PayPal");
					return null;
				}
				const userInfo = response.data;
				const userMap = await options.mapProfileToUser?.(userInfo);
				return {
					user: {
						id: userInfo.user_id,
						name: userInfo.name,
						email: userInfo.email,
						image: userInfo.picture,
						emailVerified: userInfo.email_verified,
						...userMap
					},
					data: userInfo
				};
			} catch (error) {
				logger.error("Failed to fetch user info from PayPal:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/polar.mjs
var polar = (options) => {
	const tokenEndpoint = "https://api.polar.sh/v1/oauth2/token";
	return {
		id: "polar",
		name: "Polar",
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "polar",
				options,
				authorizationEndpoint: "https://polar.sh/oauth2/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI,
				prompt: options.prompt
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.polar.sh/v1/oauth2/userinfo", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.public_name || profile.username || "",
					email: profile.email,
					image: profile.avatar_url,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/railway.mjs
var authorizationEndpoint = "https://backboard.railway.com/oauth/auth";
var tokenEndpoint = "https://backboard.railway.com/oauth/token";
var userinfoEndpoint = "https://backboard.railway.com/oauth/me";
var railway = (options) => {
	return {
		id: "railway",
		name: "Railway",
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"email",
				"profile"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "railway",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint,
				authentication: "basic"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint,
				authentication: "basic"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch(userinfoEndpoint, { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.sub,
					name: profile.name,
					email: profile.email,
					image: profile.picture,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/reddit.mjs
var reddit = (options) => {
	return {
		id: "reddit",
		name: "Reddit",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["identity"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "reddit",
				options,
				authorizationEndpoint: "https://www.reddit.com/api/v1/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				duration: options.duration
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			const body = new URLSearchParams({
				grant_type: "authorization_code",
				code,
				redirect_uri: options.redirectURI || redirectURI
			});
			const { data, error } = await betterFetch("https://www.reddit.com/api/v1/access_token", {
				method: "POST",
				headers: {
					"content-type": "application/x-www-form-urlencoded",
					accept: "text/plain",
					"user-agent": "better-auth",
					Authorization: `Basic ${base64.encode(`${options.clientId}:${options.clientSecret}`)}`
				},
				body: body.toString()
			});
			if (error) throw error;
			return getOAuth2Tokens(data);
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				authentication: "basic",
				tokenEndpoint: "https://www.reddit.com/api/v1/access_token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://oauth.reddit.com/api/v1/me", { headers: {
				Authorization: `Bearer ${token.accessToken}`,
				"User-Agent": "better-auth"
			} });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.name,
					email: profile.oauth_client_id,
					emailVerified: profile.has_verified_email,
					image: profile.icon_img?.split("?")[0],
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/roblox.mjs
var roblox = (options) => {
	const tokenEndpoint = "https://apis.roblox.com/oauth/v1/token";
	return {
		id: "roblox",
		name: "Roblox",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["openid", "profile"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return new URL(`https://apis.roblox.com/oauth/v1/authorize?scope=${_scopes.join("+")}&response_type=code&client_id=${options.clientId}&redirect_uri=${encodeURIComponent(options.redirectURI || redirectURI)}&state=${state}&prompt=${options.prompt || "select_account consent"}`);
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI: options.redirectURI || redirectURI,
				options,
				tokenEndpoint,
				authentication: "post"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://apis.roblox.com/oauth/v1/userinfo", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.sub,
					name: profile.nickname || profile.preferred_username || "",
					image: profile.picture,
					email: profile.preferred_username || null,
					emailVerified: false,
					...userMap
				},
				data: { ...profile }
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/salesforce.mjs
var salesforce = (options) => {
	const isSandbox = (options.environment ?? "production") === "sandbox";
	const authorizationEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/authorize` : isSandbox ? "https://test.salesforce.com/services/oauth2/authorize" : "https://login.salesforce.com/services/oauth2/authorize";
	const tokenEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/token` : isSandbox ? "https://test.salesforce.com/services/oauth2/token" : "https://login.salesforce.com/services/oauth2/token";
	const userInfoEndpoint = options.loginUrl ? `https://${options.loginUrl}/services/oauth2/userinfo` : isSandbox ? "https://test.salesforce.com/services/oauth2/userinfo" : "https://login.salesforce.com/services/oauth2/userinfo";
	return {
		id: "salesforce",
		name: "Salesforce",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			if (!options.clientId || !options.clientSecret) {
				logger.error("Client Id and Client Secret are required for Salesforce. Make sure to provide them in the options.");
				throw new BetterAuthError("CLIENT_ID_AND_SECRET_REQUIRED");
			}
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Salesforce");
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"email",
				"profile"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "salesforce",
				options,
				authorizationEndpoint,
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI: options.redirectURI || redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI: options.redirectURI || redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			try {
				const { data: user } = await betterFetch(userInfoEndpoint, { headers: { Authorization: `Bearer ${token.accessToken}` } });
				if (!user) {
					logger.error("Failed to fetch user info from Salesforce");
					return null;
				}
				const userMap = await options.mapProfileToUser?.(user);
				return {
					user: {
						id: user.user_id,
						name: user.name,
						email: user.email,
						image: user.photos?.picture || user.photos?.thumbnail,
						emailVerified: user.email_verified ?? false,
						...userMap
					},
					data: user
				};
			} catch (error) {
				logger.error("Failed to fetch user info from Salesforce:", error);
				return null;
			}
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/slack.mjs
var slack = (options) => {
	const tokenEndpoint = "https://slack.com/api/openid.connect.token";
	return {
		id: "slack",
		name: "Slack",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : [
				"openid",
				"profile",
				"email"
			];
			if (scopes) _scopes.push(...scopes);
			if (options.scope) _scopes.push(...options.scope);
			const url = new URL("https://slack.com/openid/connect/authorize");
			url.searchParams.set("scope", _scopes.join(" "));
			url.searchParams.set("response_type", "code");
			url.searchParams.set("client_id", options.clientId);
			url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
			url.searchParams.set("state", state);
			return url;
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://slack.com/api/openid.connect.userInfo", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile["https://slack.com/user_id"],
					name: profile.name || "",
					email: profile.email,
					emailVerified: profile.email_verified,
					image: profile.picture || profile["https://slack.com/user_image_512"],
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/spotify.mjs
var spotify = (options) => {
	const tokenEndpoint = "https://accounts.spotify.com/api/token";
	return {
		id: "spotify",
		name: "Spotify",
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["user-read-email"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "spotify",
				options,
				authorizationEndpoint: "https://accounts.spotify.com/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.spotify.com/v1/me", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.display_name,
					email: profile.email,
					image: profile.images[0]?.url,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/tiktok.mjs
var tiktok = (options) => {
	const tokenEndpoint = "https://open.tiktokapis.com/v2/oauth/token/";
	return {
		id: "tiktok",
		name: "TikTok",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["user.info.profile"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return new URL(`https://www.tiktok.com/v2/auth/authorize?scope=${_scopes.join(",")}&response_type=code&client_key=${options.clientKey}&redirect_uri=${encodeURIComponent(options.redirectURI || redirectURI)}&state=${state}`);
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI: options.redirectURI || redirectURI,
				options: {
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: { clientSecret: options.clientSecret },
				tokenEndpoint,
				authentication: "post",
				extraParams: { client_key: options.clientKey }
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch(`https://open.tiktokapis.com/v2/user/info/?fields=${[
				"open_id",
				"avatar_large_url",
				"display_name",
				"username"
			].join(",")}`, { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			return {
				user: {
					email: profile.data.user.email || profile.data.user.username,
					id: profile.data.user.open_id,
					name: profile.data.user.display_name || profile.data.user.username || "",
					image: profile.data.user.avatar_large_url,
					emailVerified: false
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/twitch.mjs
var twitch = (options) => {
	const tokenEndpoint = "https://id.twitch.tv/oauth2/token";
	return {
		id: "twitch",
		name: "Twitch",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["user:read:email", "openid"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "twitch",
				redirectURI,
				options,
				authorizationEndpoint: "https://id.twitch.tv/oauth2/authorize",
				scopes: _scopes,
				state,
				claims: options.claims || [
					"email",
					"email_verified",
					"preferred_username",
					"picture"
				]
			});
		},
		validateAuthorizationCode: async ({ code, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const idToken = token.idToken;
			if (!idToken) {
				logger.error("No idToken found in token");
				return null;
			}
			const profile = decodeJwt(idToken);
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.sub,
					name: profile.preferred_username,
					email: profile.email,
					image: profile.picture,
					emailVerified: profile.email_verified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/twitter.mjs
var twitter = (options) => {
	const tokenEndpoint = "https://api.x.com/2/oauth2/token";
	return {
		id: "twitter",
		name: "Twitter",
		createAuthorizationURL(data) {
			const _scopes = options.disableDefaultScope ? [] : [
				"users.read",
				"tweet.read",
				"offline.access",
				"users.email"
			];
			if (options.scope) _scopes.push(...options.scope);
			if (data.scopes) _scopes.push(...data.scopes);
			return createAuthorizationURL({
				id: "twitter",
				options,
				authorizationEndpoint: "https://x.com/i/oauth2/authorize",
				scopes: _scopes,
				state: data.state,
				codeVerifier: data.codeVerifier,
				redirectURI: data.redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				authentication: "basic",
				redirectURI,
				options,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				authentication: "basic",
				tokenEndpoint
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error: profileError } = await betterFetch("https://api.x.com/2/users/me?user.fields=profile_image_url", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			if (profileError) return null;
			const { data: emailData, error: emailError } = await betterFetch("https://api.x.com/2/users/me?user.fields=confirmed_email", {
				method: "GET",
				headers: { Authorization: `Bearer ${token.accessToken}` }
			});
			let emailVerified = false;
			if (!emailError && emailData?.data?.confirmed_email) {
				profile.data.email = emailData.data.confirmed_email;
				emailVerified = true;
			}
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.data.id,
					name: profile.data.name,
					email: profile.data.email || profile.data.username || null,
					image: profile.data.profile_image_url,
					emailVerified,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/vercel.mjs
var vercel = (options) => {
	return {
		id: "vercel",
		name: "Vercel",
		createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			if (!codeVerifier) throw new BetterAuthError("codeVerifier is required for Vercel");
			let _scopes = void 0;
			if (options.scope !== void 0 || scopes !== void 0) {
				_scopes = [];
				if (options.scope) _scopes.push(...options.scope);
				if (scopes) _scopes.push(...scopes);
			}
			return createAuthorizationURL({
				id: "vercel",
				options,
				authorizationEndpoint: "https://vercel.com/oauth/authorize",
				scopes: _scopes,
				state,
				codeVerifier,
				redirectURI
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI,
				options,
				tokenEndpoint: "https://api.vercel.com/login/oauth/token"
			});
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.vercel.com/login/oauth/userinfo", { headers: { Authorization: `Bearer ${token.accessToken}` } });
			if (error || !profile) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.sub,
					name: profile.name ?? profile.preferred_username ?? "",
					email: profile.email,
					image: profile.picture,
					emailVerified: profile.email_verified ?? false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/vk.mjs
var vk = (options) => {
	const tokenEndpoint = "https://id.vk.com/oauth2/auth";
	return {
		id: "vk",
		name: "VK",
		async createAuthorizationURL({ state, scopes, codeVerifier, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["email", "phone"];
			if (options.scope) _scopes.push(...options.scope);
			if (scopes) _scopes.push(...scopes);
			return createAuthorizationURL({
				id: "vk",
				options,
				authorizationEndpoint: "https://id.vk.com/authorize",
				scopes: _scopes,
				state,
				redirectURI,
				codeVerifier
			});
		},
		validateAuthorizationCode: async ({ code, codeVerifier, redirectURI, deviceId }) => {
			return validateAuthorizationCode({
				code,
				codeVerifier,
				redirectURI: options.redirectURI || redirectURI,
				options,
				deviceId,
				tokenEndpoint
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			return refreshAccessToken({
				refreshToken,
				options: {
					clientId: options.clientId,
					clientKey: options.clientKey,
					clientSecret: options.clientSecret
				},
				tokenEndpoint
			});
		},
		async getUserInfo(data) {
			if (options.getUserInfo) return options.getUserInfo(data);
			if (!data.accessToken) return null;
			const formBody = new URLSearchParams({
				access_token: data.accessToken,
				client_id: options.clientId
			}).toString();
			const { data: profile, error } = await betterFetch("https://id.vk.com/oauth2/user_info", {
				method: "POST",
				headers: { "Content-Type": "application/x-www-form-urlencoded" },
				body: formBody
			});
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			if (!profile.user.email && !userMap?.email) return null;
			return {
				user: {
					id: profile.user.user_id,
					first_name: profile.user.first_name,
					last_name: profile.user.last_name,
					email: profile.user.email,
					image: profile.user.avatar,
					emailVerified: false,
					birthday: profile.user.birthday,
					sex: profile.user.sex,
					name: `${profile.user.first_name} ${profile.user.last_name}`,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/wechat.mjs
var wechat = (options) => {
	return {
		id: "wechat",
		name: "WeChat",
		createAuthorizationURL({ state, scopes, redirectURI }) {
			const _scopes = options.disableDefaultScope ? [] : ["snsapi_login"];
			options.scope && _scopes.push(...options.scope);
			scopes && _scopes.push(...scopes);
			const url = new URL("https://open.weixin.qq.com/connect/qrconnect");
			url.searchParams.set("scope", _scopes.join(","));
			url.searchParams.set("response_type", "code");
			url.searchParams.set("appid", options.clientId);
			url.searchParams.set("redirect_uri", options.redirectURI || redirectURI);
			url.searchParams.set("state", state);
			url.searchParams.set("lang", options.lang || "cn");
			url.hash = "wechat_redirect";
			return url;
		},
		validateAuthorizationCode: async ({ code }) => {
			const { data: tokenData, error } = await betterFetch("https://api.weixin.qq.com/sns/oauth2/access_token?" + new URLSearchParams({
				appid: options.clientId,
				secret: options.clientSecret,
				code,
				grant_type: "authorization_code"
			}).toString(), { method: "GET" });
			if (error || !tokenData || tokenData.errcode) throw new Error(`Failed to validate authorization code: ${tokenData?.errmsg || error?.message || "Unknown error"}`);
			return {
				tokenType: "Bearer",
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1e3),
				scopes: tokenData.scope.split(","),
				openid: tokenData.openid,
				unionid: tokenData.unionid
			};
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => {
			const { data: tokenData, error } = await betterFetch("https://api.weixin.qq.com/sns/oauth2/refresh_token?" + new URLSearchParams({
				appid: options.clientId,
				grant_type: "refresh_token",
				refresh_token: refreshToken
			}).toString(), { method: "GET" });
			if (error || !tokenData || tokenData.errcode) throw new Error(`Failed to refresh access token: ${tokenData?.errmsg || error?.message || "Unknown error"}`);
			return {
				tokenType: "Bearer",
				accessToken: tokenData.access_token,
				refreshToken: tokenData.refresh_token,
				accessTokenExpiresAt: new Date(Date.now() + tokenData.expires_in * 1e3),
				scopes: tokenData.scope.split(",")
			};
		},
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const openid = token.openid;
			if (!openid) return null;
			const { data: profile, error } = await betterFetch("https://api.weixin.qq.com/sns/userinfo?" + new URLSearchParams({
				access_token: token.accessToken || "",
				openid,
				lang: "zh_CN"
			}).toString(), { method: "GET" });
			if (error || !profile || profile.errcode) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.unionid || profile.openid || openid,
					name: profile.nickname,
					email: profile.email || null,
					image: profile.headimgurl,
					emailVerified: false,
					...userMap
				},
				data: profile
			};
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/zoom.mjs
var zoom = (userOptions) => {
	const options = {
		pkce: true,
		...userOptions
	};
	return {
		id: "zoom",
		name: "Zoom",
		createAuthorizationURL: async ({ state, redirectURI, codeVerifier }) => {
			const params = new URLSearchParams({
				response_type: "code",
				redirect_uri: options.redirectURI ? options.redirectURI : redirectURI,
				client_id: options.clientId,
				state
			});
			if (options.pkce) {
				const codeChallenge = await generateCodeChallenge(codeVerifier);
				params.set("code_challenge_method", "S256");
				params.set("code_challenge", codeChallenge);
			}
			const url = new URL("https://zoom.us/oauth/authorize");
			url.search = params.toString();
			return url;
		},
		validateAuthorizationCode: async ({ code, redirectURI, codeVerifier }) => {
			return validateAuthorizationCode({
				code,
				redirectURI: options.redirectURI || redirectURI,
				codeVerifier,
				options,
				tokenEndpoint: "https://zoom.us/oauth/token",
				authentication: "post"
			});
		},
		refreshAccessToken: options.refreshAccessToken ? options.refreshAccessToken : async (refreshToken) => refreshAccessToken({
			refreshToken,
			options: {
				clientId: options.clientId,
				clientKey: options.clientKey,
				clientSecret: options.clientSecret
			},
			tokenEndpoint: "https://zoom.us/oauth/token"
		}),
		async getUserInfo(token) {
			if (options.getUserInfo) return options.getUserInfo(token);
			const { data: profile, error } = await betterFetch("https://api.zoom.us/v2/users/me", { headers: { authorization: `Bearer ${token.accessToken}` } });
			if (error) return null;
			const userMap = await options.mapProfileToUser?.(profile);
			return {
				user: {
					id: profile.id,
					name: profile.display_name,
					image: profile.pic_url,
					email: profile.email,
					emailVerified: Boolean(profile.verified),
					...userMap
				},
				data: { ...profile }
			};
		}
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better-fetch+fetch@1.1.21_@opentelem_4c1dd9b54d8cd18a40f092c0c0fd4d72/node_modules/@better-auth/core/dist/social-providers/index.mjs
var socialProviders = {
	apple,
	atlassian,
	cognito,
	discord,
	facebook,
	figma,
	github,
	microsoft,
	google,
	huggingface,
	slack,
	spotify,
	twitch,
	twitter,
	dropbox,
	kick,
	linear,
	linkedin,
	gitlab,
	tiktok,
	reddit,
	roblox,
	salesforce,
	vk,
	zoom,
	notion,
	kakao,
	naver,
	line,
	paybin,
	paypal,
	polar,
	railway,
	vercel,
	wechat
};
var SocialProviderListEnum = _enum(Object.keys(socialProviders)).or(string());
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/account.mjs
var listUserAccounts = createAuthEndpoint("/list-accounts", {
	method: "GET",
	use: [sessionMiddleware],
	metadata: { openapi: {
		operationId: "listUserAccounts",
		description: "List all accounts linked to the user",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "array",
				items: {
					type: "object",
					properties: {
						id: { type: "string" },
						providerId: { type: "string" },
						createdAt: {
							type: "string",
							format: "date-time"
						},
						updatedAt: {
							type: "string",
							format: "date-time"
						},
						accountId: { type: "string" },
						userId: { type: "string" },
						scopes: {
							type: "array",
							items: { type: "string" }
						}
					},
					required: [
						"id",
						"providerId",
						"createdAt",
						"updatedAt",
						"accountId",
						"userId",
						"scopes"
					]
				}
			} } }
		} }
	} }
}, async (c) => {
	const session = c.context.session;
	const accounts = await c.context.internalAdapter.findAccounts(session.user.id);
	return c.json(accounts.map((a) => {
		const { scope, ...parsed } = parseAccountOutput(c.context.options, a);
		return {
			...parsed,
			scopes: scope?.split(",") || []
		};
	}));
});
var linkSocialAccount = createAuthEndpoint("/link-social", {
	method: "POST",
	requireHeaders: true,
	body: object({
		callbackURL: string().meta({ description: "The URL to redirect to after the user has signed in" }).optional(),
		provider: SocialProviderListEnum,
		idToken: object({
			token: string(),
			nonce: string().optional(),
			accessToken: string().optional(),
			refreshToken: string().optional(),
			scopes: array(string()).optional()
		}).optional(),
		requestSignUp: boolean().optional(),
		scopes: array(string()).meta({ description: "Additional scopes to request from the provider" }).optional(),
		errorCallbackURL: string().meta({ description: "The URL to redirect to if there is an error during the link process" }).optional(),
		disableRedirect: boolean().meta({ description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself" }).optional(),
		additionalData: record(string(), any()).optional()
	}),
	use: [sessionMiddleware],
	metadata: { openapi: {
		description: "Link a social account to the user",
		operationId: "linkSocialAccount",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					url: {
						type: "string",
						description: "The authorization URL to redirect the user to"
					},
					redirect: {
						type: "boolean",
						description: "Indicates if the user should be redirected to the authorization URL"
					},
					status: { type: "boolean" }
				},
				required: ["redirect"]
			} } }
		} }
	} }
}, async (c) => {
	const session = c.context.session;
	const provider = await getAwaitableValue(c.context.socialProviders, { value: c.body.provider });
	if (!provider) {
		c.context.logger.error("Provider not found. Make sure to add the provider in your auth config", { provider: c.body.provider });
		throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.PROVIDER_NOT_FOUND);
	}
	if (c.body.idToken) {
		if (!provider.verifyIdToken) {
			c.context.logger.error("Provider does not support id token verification", { provider: c.body.provider });
			throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.ID_TOKEN_NOT_SUPPORTED);
		}
		const { token, nonce } = c.body.idToken;
		if (!await provider.verifyIdToken(token, nonce)) {
			c.context.logger.error("Invalid id token", { provider: c.body.provider });
			throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_TOKEN);
		}
		const linkingUserInfo = await provider.getUserInfo({
			idToken: token,
			accessToken: c.body.idToken.accessToken,
			refreshToken: c.body.idToken.refreshToken
		});
		if (!linkingUserInfo || !linkingUserInfo?.user) {
			c.context.logger.error("Failed to get user info", { provider: c.body.provider });
			throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO);
		}
		const linkingUserId = String(linkingUserInfo.user.id);
		if (!linkingUserInfo.user.email) {
			c.context.logger.error(missingEmailLogMessage(c.body.provider, { source: "id_token" }), { provider: c.body.provider });
			throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.USER_EMAIL_NOT_FOUND);
		}
		if ((await c.context.internalAdapter.findAccounts(session.user.id)).find((a) => a.providerId === provider.id && a.accountId === linkingUserId)) return c.json({
			url: "",
			status: true,
			redirect: false
		});
		if (!c.context.trustedProviders.includes(provider.id) && !linkingUserInfo.user.emailVerified || c.context.options.account?.accountLinking?.enabled === false) throw APIError.from("UNAUTHORIZED", {
			message: "Account not linked - linking not allowed",
			code: "LINKING_NOT_ALLOWED"
		});
		if (linkingUserInfo.user.email?.toLowerCase() !== session.user.email.toLowerCase() && c.context.options.account?.accountLinking?.allowDifferentEmails !== true) throw APIError.from("UNAUTHORIZED", {
			message: "Account not linked - different emails not allowed",
			code: "LINKING_DIFFERENT_EMAILS_NOT_ALLOWED"
		});
		try {
			await c.context.internalAdapter.createAccount({
				userId: session.user.id,
				providerId: provider.id,
				accountId: linkingUserId,
				accessToken: c.body.idToken.accessToken,
				idToken: token,
				refreshToken: c.body.idToken.refreshToken,
				scope: c.body.idToken.scopes?.join(",")
			});
		} catch (_e) {
			throw APIError.from("EXPECTATION_FAILED", {
				message: "Account not linked - unable to create account",
				code: "LINKING_FAILED"
			});
		}
		if (c.context.options.account?.accountLinking?.updateUserInfoOnLink === true) try {
			await c.context.internalAdapter.updateUser(session.user.id, {
				name: linkingUserInfo.user?.name,
				image: linkingUserInfo.user?.image
			});
		} catch (e) {
			console.warn("Could not update user - " + e.toString());
		}
		return c.json({
			url: "",
			status: true,
			redirect: false
		});
	}
	const state = await generateState(c, {
		userId: session.user.id,
		email: session.user.email
	}, c.body.additionalData);
	const url = await provider.createAuthorizationURL({
		state: state.state,
		codeVerifier: state.codeVerifier,
		redirectURI: `${c.context.baseURL}/callback/${provider.id}`,
		scopes: c.body.scopes
	});
	if (!c.body.disableRedirect) c.setHeader("Location", url.toString());
	return c.json({
		url: url.toString(),
		redirect: !c.body.disableRedirect
	});
});
var unlinkAccount = createAuthEndpoint("/unlink-account", {
	method: "POST",
	body: object({
		providerId: string(),
		accountId: string().optional()
	}),
	use: [freshSessionMiddleware],
	metadata: { openapi: {
		description: "Unlink an account",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { status: { type: "boolean" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const { providerId, accountId } = ctx.body;
	const accounts = await ctx.context.internalAdapter.findAccounts(ctx.context.session.user.id);
	if (accounts.length === 1 && !ctx.context.options.account?.accountLinking?.allowUnlinkingAll) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.FAILED_TO_UNLINK_LAST_ACCOUNT);
	const accountExist = accounts.find((account) => accountId ? account.accountId === accountId && account.providerId === providerId : account.providerId === providerId);
	if (!accountExist) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
	await ctx.context.internalAdapter.deleteAccount(accountExist.id);
	return ctx.json({ status: true });
});
var getAccessToken = createAuthEndpoint("/get-access-token", {
	method: "POST",
	body: object({
		providerId: string().meta({ description: "The provider ID for the OAuth provider" }),
		accountId: string().meta({ description: "The account ID associated with the refresh token" }).optional(),
		userId: string().meta({ description: "The user ID associated with the account" }).optional()
	}),
	metadata: { openapi: {
		description: "Get a valid access token, doing a refresh if needed",
		responses: {
			200: {
				description: "A Valid access token",
				content: { "application/json": { schema: {
					type: "object",
					properties: {
						tokenType: { type: "string" },
						idToken: { type: "string" },
						accessToken: { type: "string" },
						accessTokenExpiresAt: {
							type: "string",
							format: "date-time"
						}
					}
				} } }
			},
			400: { description: "Invalid refresh token or provider configuration" }
		}
	} }
}, async (ctx) => {
	const { providerId, accountId, userId } = ctx.body || {};
	const req = ctx.request;
	const session = await getSessionFromCtx(ctx);
	if (req && !session) throw ctx.error("UNAUTHORIZED");
	const resolvedUserId = session?.user?.id || userId;
	if (!resolvedUserId) throw ctx.error("UNAUTHORIZED");
	const provider = await getAwaitableValue(ctx.context.socialProviders, { value: providerId });
	if (!provider) throw APIError.from("BAD_REQUEST", {
		message: `Provider ${providerId} is not supported.`,
		code: "PROVIDER_NOT_SUPPORTED"
	});
	const accountData = await getAccountCookie(ctx);
	let account = void 0;
	if (accountData && accountData.userId === resolvedUserId && providerId === accountData.providerId && (!accountId || accountData.accountId === accountId)) account = accountData;
	else account = (await ctx.context.internalAdapter.findAccounts(resolvedUserId)).find((acc) => accountId ? acc.accountId === accountId && acc.providerId === providerId : acc.providerId === providerId);
	if (!account) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
	try {
		let newTokens = null;
		const accessTokenExpired = account.accessTokenExpiresAt && new Date(account.accessTokenExpiresAt).getTime() - Date.now() < 5e3;
		if (account.refreshToken && accessTokenExpired && provider.refreshAccessToken) {
			const refreshToken = await decryptOAuthToken(account.refreshToken, ctx.context);
			newTokens = await provider.refreshAccessToken(refreshToken);
			const updatedData = {
				accessToken: await setTokenUtil(newTokens?.accessToken, ctx.context),
				accessTokenExpiresAt: newTokens?.accessTokenExpiresAt,
				refreshToken: newTokens?.refreshToken ? await setTokenUtil(newTokens.refreshToken, ctx.context) : account.refreshToken,
				refreshTokenExpiresAt: newTokens?.refreshTokenExpiresAt ?? account.refreshTokenExpiresAt,
				idToken: newTokens?.idToken || account.idToken
			};
			let updatedAccount = null;
			if (account.id) updatedAccount = await ctx.context.internalAdapter.updateAccount(account.id, updatedData);
			if (ctx.context.options.account?.storeAccountCookie) await setAccountCookie(ctx, {
				...account,
				...updatedAccount ?? updatedData
			});
		}
		const accessTokenExpiresAt = (() => {
			if (newTokens?.accessTokenExpiresAt) {
				if (typeof newTokens.accessTokenExpiresAt === "string") return new Date(newTokens.accessTokenExpiresAt);
				return newTokens.accessTokenExpiresAt;
			}
			if (account.accessTokenExpiresAt) {
				if (typeof account.accessTokenExpiresAt === "string") return new Date(account.accessTokenExpiresAt);
				return account.accessTokenExpiresAt;
			}
		})();
		const tokens = {
			accessToken: newTokens?.accessToken ?? await decryptOAuthToken(account.accessToken ?? "", ctx.context),
			accessTokenExpiresAt,
			scopes: account.scope?.split(",") ?? [],
			idToken: newTokens?.idToken ?? account.idToken ?? void 0
		};
		return ctx.json(tokens);
	} catch (_error) {
		throw APIError.from("BAD_REQUEST", {
			message: "Failed to get a valid access token",
			code: "FAILED_TO_GET_ACCESS_TOKEN"
		});
	}
});
var refreshToken = createAuthEndpoint("/refresh-token", {
	method: "POST",
	body: object({
		providerId: string().meta({ description: "The provider ID for the OAuth provider" }),
		accountId: string().meta({ description: "The account ID associated with the refresh token" }).optional(),
		userId: string().meta({ description: "The user ID associated with the account" }).optional()
	}),
	metadata: { openapi: {
		description: "Refresh the access token using a refresh token",
		responses: {
			200: {
				description: "Access token refreshed successfully",
				content: { "application/json": { schema: {
					type: "object",
					properties: {
						tokenType: { type: "string" },
						idToken: { type: "string" },
						accessToken: { type: "string" },
						refreshToken: { type: "string" },
						accessTokenExpiresAt: {
							type: "string",
							format: "date-time"
						},
						refreshTokenExpiresAt: {
							type: "string",
							format: "date-time"
						}
					}
				} } }
			},
			400: { description: "Invalid refresh token or provider configuration" }
		}
	} }
}, async (ctx) => {
	const { providerId, accountId, userId } = ctx.body;
	const req = ctx.request;
	const session = await getSessionFromCtx(ctx);
	if (req && !session) throw ctx.error("UNAUTHORIZED");
	const resolvedUserId = session?.user?.id || userId;
	if (!resolvedUserId) throw APIError.from("BAD_REQUEST", {
		message: `Either userId or session is required`,
		code: "USER_ID_OR_SESSION_REQUIRED"
	});
	const provider = await getAwaitableValue(ctx.context.socialProviders, { value: providerId });
	if (!provider) throw APIError.from("BAD_REQUEST", {
		message: `Provider ${providerId} is not supported.`,
		code: "PROVIDER_NOT_SUPPORTED"
	});
	if (!provider.refreshAccessToken) throw APIError.from("BAD_REQUEST", {
		message: `Provider ${providerId} does not support token refreshing.`,
		code: "TOKEN_REFRESH_NOT_SUPPORTED"
	});
	let account = void 0;
	const accountData = await getAccountCookie(ctx);
	if (accountData && accountData.userId === resolvedUserId && (!providerId || providerId === accountData?.providerId)) account = accountData;
	else account = (await ctx.context.internalAdapter.findAccounts(resolvedUserId)).find((acc) => accountId ? acc.accountId === accountId && acc.providerId === providerId : acc.providerId === providerId);
	if (!account) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
	let refreshToken = void 0;
	if (accountData && providerId === accountData.providerId) refreshToken = accountData.refreshToken ?? void 0;
	else refreshToken = account.refreshToken ?? void 0;
	if (!refreshToken) throw APIError.from("BAD_REQUEST", {
		message: "Refresh token not found",
		code: "REFRESH_TOKEN_NOT_FOUND"
	});
	try {
		const decryptedRefreshToken = await decryptOAuthToken(refreshToken, ctx.context);
		const tokens = await provider.refreshAccessToken(decryptedRefreshToken);
		const resolvedRefreshToken = tokens.refreshToken ? await setTokenUtil(tokens.refreshToken, ctx.context) : refreshToken;
		const resolvedRefreshTokenExpiresAt = tokens.refreshTokenExpiresAt ?? account.refreshTokenExpiresAt;
		if (account.id) {
			const updateData = {
				...account || {},
				accessToken: await setTokenUtil(tokens.accessToken, ctx.context),
				refreshToken: resolvedRefreshToken,
				accessTokenExpiresAt: tokens.accessTokenExpiresAt,
				refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
				scope: tokens.scopes?.join(",") || account.scope,
				idToken: tokens.idToken || account.idToken
			};
			await ctx.context.internalAdapter.updateAccount(account.id, updateData);
		}
		if (accountData && providerId === accountData.providerId && ctx.context.options.account?.storeAccountCookie) await setAccountCookie(ctx, {
			...accountData,
			accessToken: await setTokenUtil(tokens.accessToken, ctx.context),
			refreshToken: resolvedRefreshToken,
			accessTokenExpiresAt: tokens.accessTokenExpiresAt,
			refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
			scope: tokens.scopes?.join(",") || accountData.scope,
			idToken: tokens.idToken || accountData.idToken
		});
		return ctx.json({
			accessToken: tokens.accessToken,
			refreshToken: tokens.refreshToken ?? decryptedRefreshToken,
			accessTokenExpiresAt: tokens.accessTokenExpiresAt,
			refreshTokenExpiresAt: resolvedRefreshTokenExpiresAt,
			scope: tokens.scopes?.join(",") || account.scope,
			idToken: tokens.idToken || account.idToken,
			providerId: account.providerId,
			accountId: account.accountId
		});
	} catch (_error) {
		throw APIError.from("BAD_REQUEST", {
			message: "Failed to refresh access token",
			code: "FAILED_TO_REFRESH_ACCESS_TOKEN"
		});
	}
});
var accountInfoQuerySchema = optional(object({ accountId: string().meta({ description: "The provider given account id for which to get the account info" }).optional() }));
var accountInfo = createAuthEndpoint("/account-info", {
	method: "GET",
	use: [sessionMiddleware],
	metadata: { openapi: {
		description: "Get the account info provided by the provider",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					user: {
						type: "object",
						properties: {
							id: { type: "string" },
							name: { type: "string" },
							email: { type: "string" },
							image: { type: "string" },
							emailVerified: { type: "boolean" }
						},
						required: ["id", "emailVerified"]
					},
					data: {
						type: "object",
						properties: {},
						additionalProperties: true
					}
				},
				required: ["user", "data"],
				additionalProperties: false
			} } }
		} }
	} },
	query: accountInfoQuerySchema
}, async (ctx) => {
	const providedAccountId = ctx.query?.accountId;
	let account = void 0;
	if (!providedAccountId) {
		if (ctx.context.options.account?.storeAccountCookie) {
			const accountData = await getAccountCookie(ctx);
			if (accountData) account = accountData;
		}
	} else {
		const accountData = await ctx.context.internalAdapter.findAccount(providedAccountId);
		if (accountData) account = accountData;
	}
	if (!account || account.userId !== ctx.context.session.user.id) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.ACCOUNT_NOT_FOUND);
	const provider = await getAwaitableValue(ctx.context.socialProviders, { value: account.providerId });
	if (!provider) throw APIError.from("INTERNAL_SERVER_ERROR", {
		message: `Provider account provider is ${account.providerId} but it is not configured`,
		code: "PROVIDER_NOT_CONFIGURED"
	});
	const tokens = await getAccessToken({
		...ctx,
		method: "POST",
		body: {
			accountId: account.accountId,
			providerId: account.providerId
		},
		returnHeaders: false,
		returnStatus: false
	});
	if (!tokens.accessToken) throw APIError.from("BAD_REQUEST", {
		message: "Access token not found",
		code: "ACCESS_TOKEN_NOT_FOUND"
	});
	const info = await provider.getUserInfo({
		...tokens,
		accessToken: tokens.accessToken
	});
	return ctx.json(info);
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/email-verification.mjs
async function createEmailVerificationToken(secret, email, updateTo, expiresIn = 3600, extraPayload) {
	return await signJWT$1({
		email: email.toLowerCase(),
		updateTo: updateTo?.toLowerCase(),
		...extraPayload
	}, secret, expiresIn);
}
/**
* A function to send a verification email to the user
*/
async function sendVerificationEmailFn(ctx, user) {
	if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
		ctx.context.logger.error("Verification email isn't enabled.");
		throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.VERIFICATION_EMAIL_NOT_ENABLED);
	}
	const token = await createEmailVerificationToken(ctx.context.secret, user.email, void 0, ctx.context.options.emailVerification?.expiresIn);
	const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
	const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
	await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
		user,
		url,
		token
	}, ctx.request));
}
var sendVerificationEmail = createAuthEndpoint("/send-verification-email", {
	method: "POST",
	operationId: "sendVerificationEmail",
	body: object({
		email: email().meta({ description: "The email to send the verification email to" }),
		callbackURL: string().meta({ description: "The URL to use for email verification callback" }).optional()
	}),
	metadata: { openapi: {
		operationId: "sendVerificationEmail",
		description: "Send a verification email to the user",
		requestBody: { content: { "application/json": { schema: {
			type: "object",
			properties: {
				email: {
					type: "string",
					description: "The email to send the verification email to",
					example: "user@example.com"
				},
				callbackURL: {
					type: "string",
					description: "The URL to use for email verification callback",
					example: "https://example.com/callback",
					nullable: true
				}
			},
			required: ["email"]
		} } } },
		responses: {
			"200": {
				description: "Success",
				content: { "application/json": { schema: {
					type: "object",
					properties: { status: {
						type: "boolean",
						description: "Indicates if the email was sent successfully",
						example: true
					} }
				} } }
			},
			"400": {
				description: "Bad Request",
				content: { "application/json": { schema: {
					type: "object",
					properties: { message: {
						type: "string",
						description: "Error message",
						example: "Verification email isn't enabled"
					} }
				} } }
			}
		}
	} }
}, async (ctx) => {
	if (!ctx.context.options.emailVerification?.sendVerificationEmail) {
		ctx.context.logger.error("Verification email isn't enabled.");
		throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.VERIFICATION_EMAIL_NOT_ENABLED);
	}
	const { email } = ctx.body;
	const session = await getSessionFromCtx(ctx);
	if (!session) {
		const user = await ctx.context.internalAdapter.findUserByEmail(email);
		if (!user || user.user.emailVerified) {
			await createEmailVerificationToken(ctx.context.secret, email, void 0, ctx.context.options.emailVerification?.expiresIn);
			return ctx.json({ status: true });
		}
		await sendVerificationEmailFn(ctx, user.user);
		return ctx.json({ status: true });
	}
	if (session?.user.email.toLowerCase() !== email.toLowerCase()) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.EMAIL_MISMATCH);
	if (session?.user.emailVerified) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.EMAIL_ALREADY_VERIFIED);
	await sendVerificationEmailFn(ctx, session.user);
	return ctx.json({ status: true });
});
var verifyEmail = createAuthEndpoint("/verify-email", {
	method: "GET",
	operationId: "verifyEmail",
	query: object({
		token: string().meta({ description: "The token to verify the email" }),
		callbackURL: string().meta({ description: "The URL to redirect to after email verification" }).optional()
	}),
	use: [originCheck((ctx) => ctx.query.callbackURL)],
	metadata: { openapi: {
		description: "Verify the email of the user",
		parameters: [{
			name: "token",
			in: "query",
			description: "The token to verify the email",
			required: true,
			schema: { type: "string" }
		}, {
			name: "callbackURL",
			in: "query",
			description: "The URL to redirect to after email verification",
			required: false,
			schema: { type: "string" }
		}],
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					user: {
						type: "object",
						$ref: "#/components/schemas/User"
					},
					status: {
						type: "boolean",
						description: "Indicates if the email was verified successfully"
					}
				},
				required: ["user", "status"]
			} } }
		} }
	} }
}, async (ctx) => {
	function redirectOnError(error) {
		if (ctx.query.callbackURL) {
			if (ctx.query.callbackURL.includes("?")) throw ctx.redirect(`${ctx.query.callbackURL}&error=${error.code}`);
			throw ctx.redirect(`${ctx.query.callbackURL}?error=${error.code}`);
		}
		throw APIError.from("UNAUTHORIZED", error);
	}
	const { token } = ctx.query;
	let jwt;
	try {
		jwt = await jwtVerify(token, new TextEncoder().encode(ctx.context.secret), { algorithms: ["HS256"] });
	} catch (e) {
		if (e instanceof JWTExpired) return redirectOnError(BASE_ERROR_CODES.TOKEN_EXPIRED);
		return redirectOnError(BASE_ERROR_CODES.INVALID_TOKEN);
	}
	const parsed = object({
		email: email(),
		updateTo: string().optional(),
		requestType: string().optional()
	}).parse(jwt.payload);
	const user = await ctx.context.internalAdapter.findUserByEmail(parsed.email);
	if (!user) return redirectOnError(BASE_ERROR_CODES.USER_NOT_FOUND);
	if (parsed.updateTo) {
		const session = await getSessionFromCtx(ctx);
		if (session && session.user.email !== parsed.email) return redirectOnError(BASE_ERROR_CODES.INVALID_USER);
		switch (parsed.requestType) {
			case "change-email-confirmation": {
				const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.email, parsed.updateTo, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-verification" });
				const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
				const url = `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`;
				if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
					user: {
						...user.user,
						email: parsed.updateTo
					},
					url,
					token: newToken
				}, ctx.request));
				if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
				return ctx.json({ status: true });
			}
			case "change-email-verification": {
				let activeSession = session;
				if (!activeSession) {
					const newSession = await ctx.context.internalAdapter.createSession(user.user.id);
					if (!newSession) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
					activeSession = {
						session: newSession,
						user: user.user
					};
				}
				const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
					email: parsed.updateTo,
					emailVerified: true
				});
				if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser, ctx.request);
				await setSessionCookie(ctx, {
					session: activeSession.session,
					user: {
						...activeSession.user,
						email: parsed.updateTo,
						emailVerified: true
					}
				});
				if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
				return ctx.json({
					status: true,
					user: parseUserOutput(ctx.context.options, updatedUser)
				});
			}
			default: {
				let activeSession = session;
				if (!activeSession) {
					const newSession = await ctx.context.internalAdapter.createSession(user.user.id);
					if (!newSession) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
					activeSession = {
						session: newSession,
						user: user.user
					};
				}
				const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, {
					email: parsed.updateTo,
					emailVerified: false
				});
				const newToken = await createEmailVerificationToken(ctx.context.secret, parsed.updateTo);
				const updateCallbackURL = ctx.query.callbackURL ? encodeURIComponent(ctx.query.callbackURL) : encodeURIComponent("/");
				if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
					user: updatedUser,
					url: `${ctx.context.baseURL}/verify-email?token=${newToken}&callbackURL=${updateCallbackURL}`,
					token: newToken
				}, ctx.request));
				await setSessionCookie(ctx, {
					session: activeSession.session,
					user: {
						...activeSession.user,
						email: parsed.updateTo,
						emailVerified: false
					}
				});
				if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
				return ctx.json({
					status: true,
					user: parseUserOutput(ctx.context.options, updatedUser)
				});
			}
		}
	}
	if (user.user.emailVerified) {
		if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
		return ctx.json({
			status: true,
			user: null
		});
	}
	if (ctx.context.options.emailVerification?.beforeEmailVerification) await ctx.context.options.emailVerification.beforeEmailVerification(user.user, ctx.request);
	const updatedUser = await ctx.context.internalAdapter.updateUserByEmail(parsed.email, { emailVerified: true });
	if (ctx.context.options.emailVerification?.afterEmailVerification) await ctx.context.options.emailVerification.afterEmailVerification(updatedUser, ctx.request);
	if (ctx.context.options.emailVerification?.autoSignInAfterVerification) {
		const currentSession = await getSessionFromCtx(ctx);
		if (!currentSession || currentSession.user.email !== parsed.email) {
			const session = await ctx.context.internalAdapter.createSession(user.user.id);
			if (!session) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
			await setSessionCookie(ctx, {
				session,
				user: {
					...user.user,
					emailVerified: true
				}
			});
		} else await setSessionCookie(ctx, {
			session: currentSession.session,
			user: {
				...currentSession.user,
				emailVerified: true
			}
		});
	}
	if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL);
	return ctx.json({
		status: true,
		user: null
	});
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/oauth2/link-account.mjs
async function handleOAuthUserInfo(c, opts) {
	const { userInfo, account, callbackURL, disableSignUp, overrideUserInfo } = opts;
	const dbUser = await c.context.internalAdapter.findOAuthUser(userInfo.email.toLowerCase(), account.accountId, account.providerId).catch((e) => {
		logger.error("Better auth was unable to query your database.\nError: ", e);
		const errorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
		throw c.redirect(`${errorURL}?error=internal_server_error`);
	});
	let user = dbUser?.user;
	const isRegister = !user;
	if (dbUser) {
		const linkedAccount = dbUser.linkedAccount ?? dbUser.accounts.find((acc) => acc.providerId === account.providerId && acc.accountId === account.accountId);
		if (!linkedAccount) {
			const accountLinking = c.context.options.account?.accountLinking;
			if (!(opts.isTrustedProvider || c.context.trustedProviders.includes(account.providerId)) && !userInfo.emailVerified || accountLinking?.enabled === false || accountLinking?.disableImplicitLinking === true) {
				if (isDevelopment()) logger.warn(`User already exist but account isn't linked to ${account.providerId}. To read more about how account linking works in Better Auth see https://www.better-auth.com/docs/concepts/users-accounts#account-linking.`);
				return {
					error: "account not linked",
					data: null
				};
			}
			try {
				await c.context.internalAdapter.linkAccount({
					providerId: account.providerId,
					accountId: userInfo.id.toString(),
					userId: dbUser.user.id,
					accessToken: await setTokenUtil(account.accessToken, c.context),
					refreshToken: await setTokenUtil(account.refreshToken, c.context),
					idToken: account.idToken,
					accessTokenExpiresAt: account.accessTokenExpiresAt,
					refreshTokenExpiresAt: account.refreshTokenExpiresAt,
					scope: account.scope
				});
			} catch (e) {
				logger.error("Unable to link account", e);
				return {
					error: "unable to link account",
					data: null
				};
			}
			if (userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c.context.internalAdapter.updateUser(dbUser.user.id, { emailVerified: true });
		} else {
			const freshTokens = c.context.options.account?.updateAccountOnSignIn !== false ? Object.fromEntries(Object.entries({
				idToken: account.idToken,
				accessToken: await setTokenUtil(account.accessToken, c.context),
				refreshToken: await setTokenUtil(account.refreshToken, c.context),
				accessTokenExpiresAt: account.accessTokenExpiresAt,
				refreshTokenExpiresAt: account.refreshTokenExpiresAt,
				scope: account.scope
			}).filter(([_, value]) => value !== void 0)) : {};
			if (c.context.options.account?.storeAccountCookie) await setAccountCookie(c, {
				...linkedAccount,
				...freshTokens
			});
			if (Object.keys(freshTokens).length > 0) await c.context.internalAdapter.updateAccount(linkedAccount.id, freshTokens);
			if (userInfo.emailVerified && !dbUser.user.emailVerified && userInfo.email.toLowerCase() === dbUser.user.email) await c.context.internalAdapter.updateUser(dbUser.user.id, { emailVerified: true });
		}
		if (overrideUserInfo) {
			const { id: _, ...restUserInfo } = userInfo;
			user = await c.context.internalAdapter.updateUser(dbUser.user.id, {
				...restUserInfo,
				email: userInfo.email.toLowerCase(),
				emailVerified: userInfo.email.toLowerCase() === dbUser.user.email ? dbUser.user.emailVerified || userInfo.emailVerified : userInfo.emailVerified
			});
		}
	} else {
		if (disableSignUp) return {
			error: "signup disabled",
			data: null,
			isRegister: false
		};
		try {
			const { id: _, ...restUserInfo } = userInfo;
			const accountData = {
				accessToken: await setTokenUtil(account.accessToken, c.context),
				refreshToken: await setTokenUtil(account.refreshToken, c.context),
				idToken: account.idToken,
				accessTokenExpiresAt: account.accessTokenExpiresAt,
				refreshTokenExpiresAt: account.refreshTokenExpiresAt,
				scope: account.scope,
				providerId: account.providerId,
				accountId: userInfo.id.toString()
			};
			const { user: createdUser, account: createdAccount } = await c.context.internalAdapter.createOAuthUser({
				...restUserInfo,
				email: userInfo.email.toLowerCase()
			}, accountData);
			user = createdUser;
			if (c.context.options.account?.storeAccountCookie) await setAccountCookie(c, createdAccount);
			if (!userInfo.emailVerified && user && c.context.options.emailVerification?.sendOnSignUp && c.context.options.emailVerification?.sendVerificationEmail) {
				const token = await createEmailVerificationToken(c.context.secret, user.email, void 0, c.context.options.emailVerification?.expiresIn);
				const url = `${c.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
				await c.context.runInBackgroundOrAwait(c.context.options.emailVerification.sendVerificationEmail({
					user,
					url,
					token
				}, c.request));
			}
		} catch (e) {
			logger.error(e);
			if (isAPIError(e)) return {
				error: e.message,
				data: null,
				isRegister: false
			};
			return {
				error: "unable to create user",
				data: null,
				isRegister: false
			};
		}
	}
	if (!user) return {
		error: "unable to create user",
		data: null,
		isRegister: false
	};
	const session = await c.context.internalAdapter.createSession(user.id);
	if (!session) return {
		error: "unable to create session",
		data: null,
		isRegister: false
	};
	return {
		data: {
			session,
			user
		},
		error: null,
		isRegister
	};
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/callback.mjs
var schema$1 = object({
	code: string().optional(),
	error: string().optional(),
	device_id: string().optional(),
	error_description: string().optional(),
	state: string().optional(),
	user: string().optional()
});
var callbackOAuth = createAuthEndpoint("/callback/:id", {
	method: ["GET", "POST"],
	operationId: "handleOAuthCallback",
	body: schema$1.optional(),
	query: schema$1.optional(),
	metadata: {
		...HIDE_METADATA,
		allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"]
	}
}, async (c) => {
	let queryOrBody;
	const defaultErrorURL = c.context.options.onAPIError?.errorURL || `${c.context.baseURL}/error`;
	if (c.method === "POST") {
		const postData = c.body ? schema$1.parse(c.body) : {};
		const queryData = c.query ? schema$1.parse(c.query) : {};
		const mergedData = schema$1.parse({
			...postData,
			...queryData
		});
		const params = new URLSearchParams();
		for (const [key, value] of Object.entries(mergedData)) if (value !== void 0 && value !== null) params.set(key, String(value));
		const redirectURL = `${c.context.baseURL}/callback/${c.params.id}?${params.toString()}`;
		throw c.redirect(redirectURL);
	}
	try {
		if (c.method === "GET") queryOrBody = schema$1.parse(c.query);
		else if (c.method === "POST") queryOrBody = schema$1.parse(c.body);
		else throw new Error("Unsupported method");
	} catch (e) {
		c.context.logger.error("INVALID_CALLBACK_REQUEST", e);
		throw c.redirect(`${defaultErrorURL}?error=invalid_callback_request`);
	}
	const { code, error, state, error_description, device_id, user: userData } = queryOrBody;
	if (!state) {
		c.context.logger.error("State not found", error);
		const url = `${defaultErrorURL}${defaultErrorURL.includes("?") ? "&" : "?"}state=state_not_found`;
		throw c.redirect(url);
	}
	const { codeVerifier, callbackURL, link, errorURL, newUserURL, requestSignUp } = await parseState(c);
	function redirectOnError(error, description) {
		const baseURL = errorURL ?? defaultErrorURL;
		const params = new URLSearchParams({ error });
		if (description) params.set("error_description", description);
		const url = `${baseURL}${baseURL.includes("?") ? "&" : "?"}${params.toString()}`;
		throw c.redirect(url);
	}
	if (error) redirectOnError(error, error_description);
	if (!code) {
		c.context.logger.error("Code not found");
		throw redirectOnError("no_code");
	}
	const provider = await getAwaitableValue(c.context.socialProviders, { value: c.params.id });
	if (!provider) {
		c.context.logger.error("Oauth provider with id", c.params.id, "not found");
		throw redirectOnError("oauth_provider_not_found");
	}
	let tokens;
	try {
		tokens = await provider.validateAuthorizationCode({
			code,
			codeVerifier,
			deviceId: device_id,
			redirectURI: `${c.context.baseURL}/callback/${provider.id}`
		});
	} catch (e) {
		c.context.logger.error("", e);
		throw redirectOnError("invalid_code");
	}
	if (!tokens) throw redirectOnError("invalid_code");
	const parsedUserData = userData ? safeJSONParse(userData) : null;
	const userInfo = await provider.getUserInfo({
		...tokens,
		user: parsedUserData ?? void 0
	}).then((res) => res?.user);
	if (!userInfo || userInfo.id === void 0 || userInfo.id === null) {
		c.context.logger.error("Unable to get user info");
		return redirectOnError("unable_to_get_user_info");
	}
	const providerAccountId = String(userInfo.id);
	if (!callbackURL) {
		c.context.logger.error("No callback URL found");
		throw redirectOnError("no_callback_url");
	}
	if (link) {
		if (!c.context.trustedProviders.includes(provider.id) && !userInfo.emailVerified || c.context.options.account?.accountLinking?.enabled === false) {
			c.context.logger.error("Unable to link account - untrusted provider");
			return redirectOnError("unable_to_link_account");
		}
		if (userInfo.email?.toLowerCase() !== link.email.toLowerCase() && c.context.options.account?.accountLinking?.allowDifferentEmails !== true) return redirectOnError("email_doesn't_match");
		const existingAccount = await c.context.internalAdapter.findAccountByProviderId(providerAccountId, provider.id);
		if (existingAccount) {
			if (existingAccount.userId.toString() !== link.userId.toString()) return redirectOnError("account_already_linked_to_different_user");
			const updateData = Object.fromEntries(Object.entries({
				accessToken: await setTokenUtil(tokens.accessToken, c.context),
				refreshToken: await setTokenUtil(tokens.refreshToken, c.context),
				idToken: tokens.idToken,
				accessTokenExpiresAt: tokens.accessTokenExpiresAt,
				refreshTokenExpiresAt: tokens.refreshTokenExpiresAt,
				scope: tokens.scopes?.join(",")
			}).filter(([_, value]) => value !== void 0));
			await c.context.internalAdapter.updateAccount(existingAccount.id, updateData);
		} else if (!await c.context.internalAdapter.createAccount({
			userId: link.userId,
			providerId: provider.id,
			accountId: providerAccountId,
			...tokens,
			accessToken: await setTokenUtil(tokens.accessToken, c.context),
			refreshToken: await setTokenUtil(tokens.refreshToken, c.context),
			scope: tokens.scopes?.join(",")
		})) return redirectOnError("unable_to_link_account");
		let toRedirectTo;
		try {
			toRedirectTo = callbackURL.toString();
		} catch {
			toRedirectTo = callbackURL;
		}
		throw c.redirect(toRedirectTo);
	}
	if (!userInfo.email) {
		c.context.logger.error(missingEmailLogMessage(provider.id));
		return redirectOnError("email_not_found");
	}
	const accountData = {
		providerId: provider.id,
		accountId: providerAccountId,
		...tokens,
		scope: tokens.scopes?.join(",")
	};
	const result = await handleOAuthUserInfo(c, {
		userInfo: {
			...userInfo,
			id: providerAccountId,
			email: userInfo.email,
			name: userInfo.name || ""
		},
		account: accountData,
		callbackURL,
		disableSignUp: provider.disableImplicitSignUp && !requestSignUp || provider.options?.disableSignUp,
		overrideUserInfo: provider.options?.overrideUserInfoOnSignIn
	});
	if (result.error) {
		c.context.logger.error(result.error.split(" ").join("_"));
		return redirectOnError(result.error.split(" ").join("_"));
	}
	const { session, user } = result.data;
	await setSessionCookie(c, {
		session,
		user
	});
	let toRedirectTo;
	try {
		toRedirectTo = (result.isRegister ? newUserURL || callbackURL : callbackURL).toString();
	} catch {
		toRedirectTo = result.isRegister ? newUserURL || callbackURL : callbackURL;
	}
	throw c.redirect(toRedirectTo);
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/error.mjs
function sanitize(input) {
	return input.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;").replace(/&(?!amp;|lt;|gt;|quot;|#39;|#x[0-9a-fA-F]+;|#[0-9]+;)/g, "&amp;");
}
var html = (options, code = "Unknown", description = null) => {
	const custom = options.onAPIError?.customizeDefaultErrorPage;
	return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Error</title>
    <style>
      * {
        box-sizing: border-box;
      }
      body {
        font-family: ${custom?.font?.defaultFamily || "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif"};
        background: ${custom?.colors?.background || "var(--background)"};
        color: var(--foreground);
        margin: 0;
      }
      :root,
      :host {
        --spacing: 0.25rem;
        --container-md: 28rem;
        --text-sm: ${custom?.size?.textSm || "0.875rem"};
        --text-sm--line-height: calc(1.25 / 0.875);
        --text-2xl: ${custom?.size?.text2xl || "1.5rem"};
        --text-2xl--line-height: calc(2 / 1.5);
        --text-4xl: ${custom?.size?.text4xl || "2.25rem"};
        --text-4xl--line-height: calc(2.5 / 2.25);
        --text-6xl: ${custom?.size?.text6xl || "3rem"};
        --text-6xl--line-height: 1;
        --font-weight-medium: 500;
        --font-weight-semibold: 600;
        --font-weight-bold: 700;
        --default-transition-duration: 150ms;
        --default-transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
        --radius: ${custom?.size?.radiusSm || "0.625rem"};
        --default-mono-font-family: ${custom?.font?.monoFamily || "var(--font-geist-mono)"};
        --primary: ${custom?.colors?.primary || "black"};
        --primary-foreground: ${custom?.colors?.primaryForeground || "white"};
        --background: ${custom?.colors?.background || "white"};
        --foreground: ${custom?.colors?.foreground || "oklch(0.271 0 0)"};
        --border: ${custom?.colors?.border || "oklch(0.89 0 0)"};
        --destructive: ${custom?.colors?.destructive || "oklch(0.55 0.15 25.723)"};
        --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.545 0 0)"};
        --corner-border: ${custom?.colors?.cornerBorder || "#404040"};
      }

      button, .btn {
        cursor: pointer;
        background: none;
        border: none;
        color: inherit;
        font: inherit;
        transition: all var(--default-transition-duration)
          var(--default-transition-timing-function);
      }
      button:hover, .btn:hover {
        opacity: 0.8;
      }

      @media (prefers-color-scheme: dark) {
        :root,
        :host {
          --primary: ${custom?.colors?.primary || "white"};
          --primary-foreground: ${custom?.colors?.primaryForeground || "black"};
          --background: ${custom?.colors?.background || "oklch(0.15 0 0)"};
          --foreground: ${custom?.colors?.foreground || "oklch(0.98 0 0)"};
          --border: ${custom?.colors?.border || "oklch(0.27 0 0)"};
          --destructive: ${custom?.colors?.destructive || "oklch(0.65 0.15 25.723)"};
          --muted-foreground: ${custom?.colors?.mutedForeground || "oklch(0.65 0 0)"};
          --corner-border: ${custom?.colors?.cornerBorder || "#a0a0a0"};
        }
      }
      @media (max-width: 640px) {
        :root, :host {
          --text-6xl: 2.5rem;
          --text-2xl: 1.25rem;
          --text-sm: 0.8125rem;
        }
      }
      @media (max-width: 480px) {
        :root, :host {
          --text-6xl: 2rem;
          --text-2xl: 1.125rem;
        }
      }
    </style>
  </head>
  <body style="width: 100vw; min-height: 100vh; overflow-x: hidden; overflow-y: auto;">
    <div
        style="
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1.5rem;
            position: relative;
            width: 100%;
            min-height: 100vh;
            padding: 1rem;
        "
        >
${custom?.disableBackgroundGrid ? "" : `
      <div
        style="
          position: absolute;
          inset: 0;
          background-image: linear-gradient(to right, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px),
            linear-gradient(to bottom, ${custom?.colors?.gridColor || "var(--border)"} 1px, transparent 1px);
          background-size: 40px 40px;
          opacity: 0.6;
          pointer-events: none;
          width: 100vw;
          height: 100vh;
        "
      ></div>
      <div
        style="
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${custom?.colors?.background || "var(--background)"};
          mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          -webkit-mask-image: radial-gradient(ellipse at center, transparent 20%, black);
          pointer-events: none;
        "
      ></div>
`}

<div
  style="
    position: relative;
    z-index: 10;
    border: 2px solid var(--border);
    background: ${custom?.colors?.cardBackground || "var(--background)"};
    padding: 1.5rem;
    max-width: 42rem;
    width: 100%;
  "
>
    ${custom?.disableCornerDecorations ? "" : `
        <!-- Corner decorations -->
        <div
          style="
            position: absolute;
            top: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            top: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-top: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>
  
        <div
          style="
            position: absolute;
            bottom: -2px;
            left: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-left: 4px solid var(--corner-border);
          "
        ></div>
        <div
          style="
            position: absolute;
            bottom: -2px;
            right: -2px;
            width: 2rem;
            height: 2rem;
            border-bottom: 4px solid var(--corner-border);
            border-right: 4px solid var(--corner-border);
          "
        ></div>`}

        <div style="text-align: center; margin-bottom: 1.5rem;">
          <div style="margin-bottom: 1.5rem;">
            <div
              style="
                display: inline-block;
                border: 2px solid ${custom?.disableTitleBorder ? "transparent" : custom?.colors?.titleBorder || "var(--destructive)"};
                padding: 0.375rem 1rem;
              "
            >
              <h1
                style="
                  font-size: var(--text-6xl);
                  font-weight: var(--font-weight-semibold);
                  color: ${custom?.colors?.titleColor || "var(--foreground)"};
                  letter-spacing: -0.02em;
                  margin: 0;
                "
              >
                ERROR
              </h1>
            </div>
            <div
              style="
                height: 2px;
                background-color: var(--border);
                width: calc(100% + 3rem);
                margin-left: -1.5rem;
                margin-top: 1.5rem;
              "
            ></div>
          </div>

          <h2
            style="
              font-size: var(--text-2xl);
              font-weight: var(--font-weight-semibold);
              color: var(--foreground);
              margin: 0 0 1rem;
            "
          >
            Something went wrong
          </h2>

          <div
            style="
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                border: 2px solid var(--border);
                background-color: var(--muted);
                padding: 0.375rem 0.75rem;
                margin: 0 0 1rem;
                flex-wrap: wrap;
                justify-content: center;
            "
            >
            <span
                style="
                font-size: 0.75rem;
                color: var(--muted-foreground);
                font-weight: var(--font-weight-semibold);
                "
            >
                CODE:
            </span>
            <span
                style="
                font-size: var(--text-sm);
                font-family: var(--default-mono-font-family, monospace);
                color: var(--foreground);
                word-break: break-all;
                "
            >
                ${sanitize(code)}
            </span>
            </div>

          <p
            style="
              color: var(--muted-foreground);
              max-width: 28rem;
              margin: 0 auto;
              font-size: var(--text-sm);
              line-height: 1.5;
              text-wrap: pretty;
            "
          >
            ${!description ? `We encountered an unexpected error. Please try again or return to the home page. If you're a developer, you can find <a href='https://better-auth.com/docs/reference/errors/${encodeURIComponent(code)}' target='_blank' rel="noopener noreferrer" style='color: var(--foreground); text-decoration: underline;'>more information about the error</a>.` : description}
          </p>
        </div>

        <div
          style="
            display: flex;
            gap: 0.75rem;
            margin-top: 1.5rem;
            justify-content: center;
            flex-wrap: wrap;
          "
        >
          <a
            href="/"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: var(--primary);
                color: var(--primary-foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Go Home
            </div>
          </a>
          <a
            href="https://better-auth.com/docs/reference/errors/${encodeURIComponent(code)}?askai=${encodeURIComponent(`What does the error code ${code} mean?`)}"
            target="_blank"
            rel="noopener noreferrer"
            style="
              text-decoration: none;
            "
          >
            <div
              style="
                border: 2px solid var(--border);
                background: transparent;
                color: var(--foreground);
                padding: 0.5rem 1rem;
                border-radius: 0;
                white-space: nowrap;
              "
              class="btn"
            >
              Ask AI
            </div>
          </a>
        </div>
      </div>
    </div>
  </body>
</html>`;
};
var error = createAuthEndpoint("/error", {
	method: "GET",
	metadata: {
		...HIDE_METADATA,
		openapi: {
			description: "Displays an error page",
			responses: { "200": {
				description: "Success",
				content: { "text/html": { schema: {
					type: "string",
					description: "The HTML content of the error page"
				} } }
			} }
		}
	}
}, async (c) => {
	const url = new URL(c.request?.url || "");
	const unsanitizedCode = url.searchParams.get("error") || "UNKNOWN";
	const unsanitizedDescription = url.searchParams.get("error_description") || null;
	const safeCode = /^[\'A-Za-z0-9_-]+$/.test(unsanitizedCode || "") ? unsanitizedCode : "UNKNOWN";
	const safeDescription = unsanitizedDescription ? sanitize(unsanitizedDescription) : null;
	const queryParams = new URLSearchParams();
	queryParams.set("error", safeCode);
	if (unsanitizedDescription) queryParams.set("error_description", unsanitizedDescription);
	const options = c.context.options;
	const errorURL = options.onAPIError?.errorURL;
	if (errorURL) return new Response(null, {
		status: 302,
		headers: { Location: `${errorURL}${errorURL.includes("?") ? "&" : "?"}${queryParams.toString()}` }
	});
	if (isProduction && !options.onAPIError?.customizeDefaultErrorPage) return new Response(null, {
		status: 302,
		headers: { Location: `/?${queryParams.toString()}` }
	});
	return new Response(html(c.context.options, safeCode, safeDescription), { headers: { "Content-Type": "text/html" } });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/ok.mjs
var ok = createAuthEndpoint("/ok", {
	method: "GET",
	metadata: {
		...HIDE_METADATA,
		openapi: {
			description: "Check if the API is working",
			responses: { "200": {
				description: "API is working",
				content: { "application/json": { schema: {
					type: "object",
					properties: { ok: {
						type: "boolean",
						description: "Indicates if the API is working"
					} },
					required: ["ok"]
				} } }
			} }
		}
	}
}, async (ctx) => {
	return ctx.json({ ok: true });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/password.mjs
async function validatePassword(ctx, data) {
	const credentialAccount = (await ctx.context.internalAdapter.findAccounts(data.userId))?.find((account) => account.providerId === "credential");
	const currentPassword = credentialAccount?.password;
	if (!credentialAccount || !currentPassword) return false;
	return await ctx.context.password.verify({
		hash: currentPassword,
		password: data.password
	});
}
async function checkPassword(userId, c) {
	const credentialAccount = (await c.context.internalAdapter.findAccounts(userId))?.find((account) => account.providerId === "credential");
	const currentPassword = credentialAccount?.password;
	const password = c.body.password;
	if (!credentialAccount || !currentPassword || !password) {
		if (password) await c.context.password.hash(password);
		throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
	}
	if (!await c.context.password.verify({
		hash: currentPassword,
		password
	})) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
	return true;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/password.mjs
function redirectError(ctx, callbackURL, query) {
	const url = callbackURL ? new URL(callbackURL, ctx.baseURL) : new URL(`${ctx.baseURL}/error`);
	if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
	return url.href;
}
function redirectCallback(ctx, callbackURL, query) {
	const url = new URL(callbackURL, ctx.baseURL);
	if (query) Object.entries(query).forEach(([k, v]) => url.searchParams.set(k, v));
	return url.href;
}
var requestPasswordReset = createAuthEndpoint("/request-password-reset", {
	method: "POST",
	body: object({
		email: email().meta({ description: "The email address of the user to send a password reset email to" }),
		redirectTo: string().meta({ description: "The URL to redirect the user to reset their password. If the token isn't valid or expired, it'll be redirected with a query parameter `?error=INVALID_TOKEN`. If the token is valid, it'll be redirected with a query parameter `?token=VALID_TOKEN" }).optional()
	}),
	metadata: { openapi: {
		operationId: "requestPasswordReset",
		description: "Send a password reset email to the user",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					status: { type: "boolean" },
					message: { type: "string" }
				}
			} } }
		} }
	} },
	use: [originCheck((ctx) => ctx.body.redirectTo)]
}, async (ctx) => {
	if (!ctx.context.options.emailAndPassword?.sendResetPassword) {
		ctx.context.logger.error("Reset password isn't enabled.Please pass an emailAndPassword.sendResetPassword function in your auth config!");
		throw APIError.from("BAD_REQUEST", {
			message: "Reset password isn't enabled",
			code: "RESET_PASSWORD_DISABLED"
		});
	}
	const { email, redirectTo } = ctx.body;
	const user = await ctx.context.internalAdapter.findUserByEmail(email, { includeAccounts: true });
	if (!user) {
		/**
		* We simulate the verification token generation and the database lookup
		* to mitigate timing attacks.
		*/
		generateId$1(24);
		await ctx.context.internalAdapter.findVerificationValue("dummy-verification-token");
		ctx.context.logger.error("Reset Password: User not found", { email });
		return ctx.json({
			status: true,
			message: "If this email exists in our system, check your email for the reset link"
		});
	}
	const expiresAt = getDate(ctx.context.options.emailAndPassword.resetPasswordTokenExpiresIn || 3600 * 1, "sec");
	const verificationToken = generateId$1(24);
	await ctx.context.internalAdapter.createVerificationValue({
		value: user.user.id,
		identifier: `reset-password:${verificationToken}`,
		expiresAt
	});
	const callbackURL = redirectTo ? encodeURIComponent(redirectTo) : "";
	const url = `${ctx.context.baseURL}/reset-password/${verificationToken}?callbackURL=${callbackURL}`;
	await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailAndPassword.sendResetPassword({
		user: user.user,
		url,
		token: verificationToken
	}, ctx.request));
	return ctx.json({
		status: true,
		message: "If this email exists in our system, check your email for the reset link"
	});
});
var requestPasswordResetCallback = createAuthEndpoint("/reset-password/:token", {
	method: "GET",
	operationId: "resetPasswordCallback",
	query: object({ callbackURL: string().meta({ description: "The URL to redirect the user to reset their password" }) }),
	use: [originCheck((ctx) => ctx.query.callbackURL)],
	metadata: { openapi: {
		operationId: "resetPasswordCallback",
		description: "Redirects the user to the callback URL with the token",
		parameters: [{
			name: "token",
			in: "path",
			required: true,
			description: "The token to reset the password",
			schema: { type: "string" }
		}, {
			name: "callbackURL",
			in: "query",
			required: true,
			description: "The URL to redirect the user to reset their password",
			schema: { type: "string" }
		}],
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { token: { type: "string" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const { token } = ctx.params;
	const { callbackURL } = ctx.query;
	if (!token || !callbackURL) throw ctx.redirect(redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" }));
	const verification = await ctx.context.internalAdapter.findVerificationValue(`reset-password:${token}`);
	if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) throw ctx.redirect(redirectError(ctx.context, callbackURL, { error: "INVALID_TOKEN" }));
	throw ctx.redirect(redirectCallback(ctx.context, callbackURL, { token }));
});
var resetPassword = createAuthEndpoint("/reset-password", {
	method: "POST",
	operationId: "resetPassword",
	query: object({ token: string().optional() }).optional(),
	body: object({
		newPassword: string().meta({ description: "The new password to set" }),
		token: string().meta({ description: "The token to reset the password" }).optional()
	}),
	metadata: { openapi: {
		operationId: "resetPassword",
		description: "Reset the password for a user",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { status: { type: "boolean" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const token = ctx.body.token || ctx.query?.token;
	if (!token) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_TOKEN);
	const { newPassword } = ctx.body;
	const minLength = ctx.context.password?.config.minPasswordLength;
	const maxLength = ctx.context.password?.config.maxPasswordLength;
	if (newPassword.length < minLength) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
	if (newPassword.length > maxLength) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
	const id = `reset-password:${token}`;
	const verification = await ctx.context.internalAdapter.findVerificationValue(id);
	if (!verification || verification.expiresAt < /* @__PURE__ */ new Date()) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_TOKEN);
	const userId = verification.value;
	const hashedPassword = await ctx.context.password.hash(newPassword);
	if (!(await ctx.context.internalAdapter.findAccounts(userId)).find((ac) => ac.providerId === "credential")) await ctx.context.internalAdapter.createAccount({
		userId,
		providerId: "credential",
		password: hashedPassword,
		accountId: userId
	});
	else await ctx.context.internalAdapter.updatePassword(userId, hashedPassword);
	await ctx.context.internalAdapter.deleteVerificationByIdentifier(id);
	if (ctx.context.options.emailAndPassword?.onPasswordReset) {
		const user = await ctx.context.internalAdapter.findUserById(userId);
		if (user) await ctx.context.options.emailAndPassword.onPasswordReset({ user }, ctx.request);
	}
	if (ctx.context.options.emailAndPassword?.revokeSessionsOnPasswordReset) await ctx.context.internalAdapter.deleteSessions(userId);
	return ctx.json({ status: true });
});
var verifyPassword = createAuthEndpoint("/verify-password", {
	method: "POST",
	body: object({ password: string().meta({ description: "The password to verify" }) }),
	metadata: {
		scope: "server",
		openapi: {
			operationId: "verifyPassword",
			description: "Verify the current user's password",
			responses: { "200": {
				description: "Success",
				content: { "application/json": { schema: {
					type: "object",
					properties: { status: { type: "boolean" } }
				} } }
			} }
		}
	},
	use: [sensitiveSessionMiddleware]
}, async (ctx) => {
	const { password } = ctx.body;
	const session = ctx.context.session;
	if (!await validatePassword(ctx, {
		password,
		userId: session.user.id
	})) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
	return ctx.json({ status: true });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/sign-in.mjs
var socialSignInBodySchema = object({
	callbackURL: string().meta({ description: "Callback URL to redirect to after the user has signed in" }).optional(),
	newUserCallbackURL: string().optional(),
	errorCallbackURL: string().meta({ description: "Callback URL to redirect to if an error happens" }).optional(),
	provider: SocialProviderListEnum,
	disableRedirect: boolean().meta({ description: "Disable automatic redirection to the provider. Useful for handling the redirection yourself" }).optional(),
	idToken: optional(object({
		token: string().meta({ description: "ID token from the provider" }),
		nonce: string().meta({ description: "Nonce used to generate the token" }).optional(),
		accessToken: string().meta({ description: "Access token from the provider" }).optional(),
		refreshToken: string().meta({ description: "Refresh token from the provider" }).optional(),
		expiresAt: number().meta({ description: "Expiry date of the token" }).optional(),
		user: object({
			name: object({
				firstName: string().optional(),
				lastName: string().optional()
			}).optional(),
			email: string().optional()
		}).meta({ description: "The user object from the provider. Only available for some providers like Apple." }).optional()
	})),
	scopes: array(string()).meta({ description: "Array of scopes to request from the provider. This will override the default scopes passed." }).optional(),
	requestSignUp: boolean().meta({ description: "Explicitly request sign-up. Useful when disableImplicitSignUp is true for this provider" }).optional(),
	loginHint: string().meta({ description: "The login hint to use for the authorization code request" }).optional(),
	additionalData: record(string(), any()).optional().meta({ description: "Additional data to be passed through the OAuth flow" })
});
var signInSocial = () => createAuthEndpoint("/sign-in/social", {
	method: "POST",
	operationId: "socialSignIn",
	body: socialSignInBodySchema,
	metadata: {
		$Infer: {
			body: {},
			returned: {}
		},
		openapi: {
			description: "Sign in with a social provider",
			operationId: "socialSignIn",
			responses: { "200": {
				description: "Success - Returns session details (idToken branch) or an authorize URL (redirect branch)",
				content: { "application/json": { schema: {
					type: "object",
					description: "Returns session details when idToken is provided, or an authorize URL otherwise",
					properties: {
						token: { type: "string" },
						user: {
							type: "object",
							$ref: "#/components/schemas/User"
						},
						url: { type: "string" },
						redirect: { type: "boolean" }
					},
					required: ["redirect"]
				} } }
			} }
		}
	}
}, async (c) => {
	const provider = await getAwaitableValue(c.context.socialProviders, { value: c.body.provider });
	if (!provider) {
		c.context.logger.error("Provider not found. Make sure to add the provider in your auth config", { provider: c.body.provider });
		throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.PROVIDER_NOT_FOUND);
	}
	if (c.body.idToken) {
		if (!provider.verifyIdToken) {
			c.context.logger.error("Provider does not support id token verification", { provider: c.body.provider });
			throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.ID_TOKEN_NOT_SUPPORTED);
		}
		const { token, nonce } = c.body.idToken;
		if (!await provider.verifyIdToken(token, nonce)) {
			c.context.logger.error("Invalid id token", { provider: c.body.provider });
			throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_TOKEN);
		}
		const userInfo = await provider.getUserInfo({
			idToken: token,
			accessToken: c.body.idToken.accessToken,
			refreshToken: c.body.idToken.refreshToken,
			user: c.body.idToken.user
		});
		if (!userInfo || !userInfo?.user) {
			c.context.logger.error("Failed to get user info", { provider: c.body.provider });
			throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO);
		}
		if (!userInfo.user.email) {
			c.context.logger.error(missingEmailLogMessage(c.body.provider, { source: "id_token" }), { provider: c.body.provider });
			throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.USER_EMAIL_NOT_FOUND);
		}
		const data = await handleOAuthUserInfo(c, {
			userInfo: {
				...userInfo.user,
				email: userInfo.user.email,
				id: String(userInfo.user.id),
				name: userInfo.user.name || "",
				image: userInfo.user.image,
				emailVerified: userInfo.user.emailVerified || false
			},
			account: {
				providerId: provider.id,
				accountId: String(userInfo.user.id),
				accessToken: c.body.idToken.accessToken
			},
			callbackURL: c.body.callbackURL,
			disableSignUp: provider.disableImplicitSignUp && !c.body.requestSignUp || provider.disableSignUp
		});
		if (data.error) throw APIError.from("UNAUTHORIZED", {
			message: data.error,
			code: "OAUTH_LINK_ERROR"
		});
		await setSessionCookie(c, data.data);
		return c.json({
			redirect: false,
			token: data.data.session.token,
			url: void 0,
			user: parseUserOutput(c.context.options, data.data.user)
		});
	}
	const { codeVerifier, state } = await generateState(c, void 0, c.body.additionalData);
	const url = await provider.createAuthorizationURL({
		state,
		codeVerifier,
		redirectURI: `${c.context.baseURL}/callback/${provider.id}`,
		scopes: c.body.scopes,
		loginHint: c.body.loginHint
	});
	if (!c.body.disableRedirect) c.setHeader("Location", url.toString());
	return c.json({
		url: url.toString(),
		redirect: !c.body.disableRedirect
	});
});
var signInEmail = () => createAuthEndpoint("/sign-in/email", {
	method: "POST",
	operationId: "signInEmail",
	use: [formCsrfMiddleware],
	body: object({
		email: string().meta({ description: "Email of the user" }),
		password: string().meta({ description: "Password of the user" }),
		callbackURL: string().meta({ description: "Callback URL to use as a redirect for email verification" }).optional(),
		rememberMe: boolean().meta({ description: "If this is false, the session will not be remembered. Default is `true`." }).default(true).optional()
	}),
	metadata: {
		allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"],
		$Infer: {
			body: {},
			returned: {}
		},
		openapi: {
			operationId: "signInEmail",
			description: "Sign in with email and password",
			responses: { "200": {
				description: "Success - Returns either session details or redirect URL",
				content: { "application/json": { schema: {
					type: "object",
					description: "Session response when idToken is provided",
					properties: {
						redirect: {
							type: "boolean",
							enum: [false]
						},
						token: {
							type: "string",
							description: "Session token"
						},
						url: {
							type: "string",
							nullable: true
						},
						user: {
							type: "object",
							$ref: "#/components/schemas/User"
						}
					},
					required: [
						"redirect",
						"token",
						"user"
					]
				} } }
			} }
		}
	}
}, async (ctx) => {
	if (!ctx.context.options?.emailAndPassword?.enabled) {
		ctx.context.logger.error("Email and password is not enabled. Make sure to enable it in the options on you `auth.ts` file. Check `https://better-auth.com/docs/authentication/email-password` for more!");
		throw APIError.from("BAD_REQUEST", {
			code: "EMAIL_PASSWORD_DISABLED",
			message: "Email and password is not enabled"
		});
	}
	const { email: email$3, password } = ctx.body;
	if (!email().safeParse(email$3).success) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_EMAIL);
	const user = await ctx.context.internalAdapter.findUserByEmail(email$3, { includeAccounts: true });
	if (!user) {
		await ctx.context.password.hash(password);
		ctx.context.logger.error("User not found", { email: email$3 });
		throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
	}
	const credentialAccount = user.accounts.find((a) => a.providerId === "credential");
	if (!credentialAccount) {
		await ctx.context.password.hash(password);
		ctx.context.logger.error("Credential account not found", { email: email$3 });
		throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
	}
	const currentPassword = credentialAccount?.password;
	if (!currentPassword) {
		await ctx.context.password.hash(password);
		ctx.context.logger.error("Password not found", { email: email$3 });
		throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
	}
	if (!await ctx.context.password.verify({
		hash: currentPassword,
		password
	})) {
		ctx.context.logger.error("Invalid password");
		throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.INVALID_EMAIL_OR_PASSWORD);
	}
	if (ctx.context.options?.emailAndPassword?.requireEmailVerification && !user.user.emailVerified) {
		if (!ctx.context.options?.emailVerification?.sendVerificationEmail) throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.EMAIL_NOT_VERIFIED);
		if (ctx.context.options?.emailVerification?.sendOnSignIn) {
			const token = await createEmailVerificationToken(ctx.context.secret, user.user.email, void 0, ctx.context.options.emailVerification?.expiresIn);
			const callbackURL = ctx.body.callbackURL ? encodeURIComponent(ctx.body.callbackURL) : encodeURIComponent("/");
			const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
			await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
				user: user.user,
				url,
				token
			}, ctx.request));
		}
		throw APIError.from("FORBIDDEN", BASE_ERROR_CODES.EMAIL_NOT_VERIFIED);
	}
	const session = await ctx.context.internalAdapter.createSession(user.user.id, ctx.body.rememberMe === false);
	if (!session) {
		ctx.context.logger.error("Failed to create session");
		throw APIError.from("UNAUTHORIZED", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
	}
	await setSessionCookie(ctx, {
		session,
		user: user.user
	}, ctx.body.rememberMe === false);
	if (ctx.body.callbackURL) ctx.setHeader("Location", ctx.body.callbackURL);
	return ctx.json({
		redirect: !!ctx.body.callbackURL,
		token: session.token,
		url: ctx.body.callbackURL,
		user: parseUserOutput(ctx.context.options, user.user)
	});
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/sign-out.mjs
var signOut = createAuthEndpoint("/sign-out", {
	method: "POST",
	operationId: "signOut",
	requireHeaders: true,
	metadata: { openapi: {
		operationId: "signOut",
		description: "Sign out the current user",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { success: { type: "boolean" } }
			} } }
		} }
	} }
}, async (ctx) => {
	const sessionCookieToken = await ctx.getSignedCookie(ctx.context.authCookies.sessionToken.name, ctx.context.secret);
	if (sessionCookieToken) try {
		await ctx.context.internalAdapter.deleteSession(sessionCookieToken);
	} catch (e) {
		ctx.context.logger.error("Failed to delete session from database", e);
	}
	deleteSessionCookie(ctx);
	return ctx.json({ success: true });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/sign-up.mjs
var signUpEmailBodySchema = object({
	name: string(),
	email: email(),
	password: string().nonempty(),
	image: string().optional(),
	callbackURL: string().optional(),
	rememberMe: boolean().optional()
}).and(record(string(), any()));
var signUpEmail = () => createAuthEndpoint("/sign-up/email", {
	method: "POST",
	operationId: "signUpWithEmailAndPassword",
	use: [formCsrfMiddleware],
	body: signUpEmailBodySchema,
	metadata: {
		allowedMediaTypes: ["application/x-www-form-urlencoded", "application/json"],
		$Infer: {
			body: {},
			returned: {}
		},
		openapi: {
			operationId: "signUpWithEmailAndPassword",
			description: "Sign up a user using email and password",
			requestBody: { content: { "application/json": { schema: {
				type: "object",
				properties: {
					name: {
						type: "string",
						description: "The name of the user"
					},
					email: {
						type: "string",
						description: "The email of the user"
					},
					password: {
						type: "string",
						description: "The password of the user"
					},
					image: {
						type: "string",
						description: "The profile image URL of the user"
					},
					callbackURL: {
						type: "string",
						description: "The URL to use for email verification callback"
					},
					rememberMe: {
						type: "boolean",
						description: "If this is false, the session will not be remembered. Default is `true`."
					}
				},
				required: [
					"name",
					"email",
					"password"
				]
			} } } },
			responses: {
				"200": {
					description: "Successfully created user",
					content: { "application/json": { schema: {
						type: "object",
						properties: {
							token: {
								type: "string",
								nullable: true,
								description: "Authentication token for the session"
							},
							user: {
								type: "object",
								properties: {
									id: {
										type: "string",
										description: "The unique identifier of the user"
									},
									email: {
										type: "string",
										format: "email",
										description: "The email address of the user"
									},
									name: {
										type: "string",
										description: "The name of the user"
									},
									image: {
										type: "string",
										format: "uri",
										nullable: true,
										description: "The profile image URL of the user"
									},
									emailVerified: {
										type: "boolean",
										description: "Whether the email has been verified"
									},
									createdAt: {
										type: "string",
										format: "date-time",
										description: "When the user was created"
									},
									updatedAt: {
										type: "string",
										format: "date-time",
										description: "When the user was last updated"
									}
								},
								required: [
									"id",
									"email",
									"name",
									"emailVerified",
									"createdAt",
									"updatedAt"
								]
							}
						},
						required: ["user"]
					} } }
				},
				"422": {
					description: "Unprocessable Entity. User already exists or failed to create user.",
					content: { "application/json": { schema: {
						type: "object",
						properties: { message: { type: "string" } }
					} } }
				}
			}
		}
	}
}, async (ctx) => {
	return runWithTransaction(ctx.context.adapter, async () => {
		if (!ctx.context.options.emailAndPassword?.enabled || ctx.context.options.emailAndPassword?.disableSignUp) throw APIError.from("BAD_REQUEST", {
			message: "Email and password sign up is not enabled",
			code: "EMAIL_PASSWORD_SIGN_UP_DISABLED"
		});
		const body = ctx.body;
		const { name, email: email$2, password, image, callbackURL: _callbackURL, rememberMe, ...rest } = body;
		if (!email().safeParse(email$2).success) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_EMAIL);
		if (!password || typeof password !== "string") throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
		const minPasswordLength = ctx.context.password.config.minPasswordLength;
		if (password.length < minPasswordLength) {
			ctx.context.logger.error("Password is too short");
			throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
		}
		const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
		if (password.length > maxPasswordLength) {
			ctx.context.logger.error("Password is too long");
			throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
		}
		const shouldReturnGenericDuplicateResponse = ctx.context.options.emailAndPassword.requireEmailVerification || ctx.context.options.emailAndPassword.autoSignIn === false;
		const shouldSkipAutoSignIn = ctx.context.options.emailAndPassword.autoSignIn === false || shouldReturnGenericDuplicateResponse;
		const additionalUserFields = parseUserInput(ctx.context.options, rest, "create");
		const normalizedEmail = email$2.toLowerCase();
		const dbUser = await ctx.context.internalAdapter.findUserByEmail(normalizedEmail);
		if (dbUser?.user) {
			ctx.context.logger.info(`Sign-up attempt for existing email: ${email$2}`);
			if (shouldReturnGenericDuplicateResponse) {
				/**
				* Hash the password to reduce timing differences
				* between existing and non-existing emails.
				*/
				await ctx.context.password.hash(password);
				if (ctx.context.options.emailAndPassword?.onExistingUserSignUp) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailAndPassword.onExistingUserSignUp({ user: dbUser.user }, ctx.request));
				const now = /* @__PURE__ */ new Date();
				const generatedId = ctx.context.generateId({ model: "user" }) || generateId$1();
				const coreFields = {
					name,
					email: normalizedEmail,
					emailVerified: false,
					image: image || null,
					createdAt: now,
					updatedAt: now
				};
				const customSyntheticUser = ctx.context.options.emailAndPassword?.customSyntheticUser;
				let syntheticUser;
				if (customSyntheticUser) {
					const additionalFieldKeys = Object.keys(ctx.context.options.user?.additionalFields ?? {});
					const additionalFields = {};
					for (const key of additionalFieldKeys) if (key in additionalUserFields) additionalFields[key] = additionalUserFields[key];
					syntheticUser = customSyntheticUser({
						coreFields,
						additionalFields,
						id: generatedId
					});
				} else syntheticUser = {
					...coreFields,
					...additionalUserFields,
					id: generatedId
				};
				return ctx.json({
					token: null,
					user: parseUserOutput(ctx.context.options, syntheticUser)
				});
			}
			throw APIError.from("UNPROCESSABLE_ENTITY", BASE_ERROR_CODES.USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL);
		}
		/**
		* Hash the password
		*
		* This is done prior to creating the user
		* to ensure that any plugin that
		* may break the hashing should break
		* before the user is created.
		*/
		const hash = await ctx.context.password.hash(password);
		let createdUser;
		try {
			createdUser = await ctx.context.internalAdapter.createUser({
				email: normalizedEmail,
				name,
				image,
				...additionalUserFields,
				emailVerified: false
			});
			if (!createdUser) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.FAILED_TO_CREATE_USER);
		} catch (e) {
			if (isDevelopment()) ctx.context.logger.error("Failed to create user", e);
			if (isAPIError(e)) throw e;
			ctx.context.logger?.error("Failed to create user", e);
			throw APIError.from("UNPROCESSABLE_ENTITY", BASE_ERROR_CODES.FAILED_TO_CREATE_USER);
		}
		if (!createdUser) throw APIError.from("UNPROCESSABLE_ENTITY", BASE_ERROR_CODES.FAILED_TO_CREATE_USER);
		await ctx.context.internalAdapter.linkAccount({
			userId: createdUser.id,
			providerId: "credential",
			accountId: createdUser.id,
			password: hash
		});
		if (ctx.context.options.emailVerification?.sendOnSignUp ?? ctx.context.options.emailAndPassword.requireEmailVerification) {
			const token = await createEmailVerificationToken(ctx.context.secret, createdUser.email, void 0, ctx.context.options.emailVerification?.expiresIn);
			const callbackURL = body.callbackURL ? encodeURIComponent(body.callbackURL) : encodeURIComponent("/");
			const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${callbackURL}`;
			if (ctx.context.options.emailVerification?.sendVerificationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.options.emailVerification.sendVerificationEmail({
				user: createdUser,
				url,
				token
			}, ctx.request));
		}
		if (shouldSkipAutoSignIn) return ctx.json({
			token: null,
			user: parseUserOutput(ctx.context.options, createdUser)
		});
		const session = await ctx.context.internalAdapter.createSession(createdUser.id, rememberMe === false);
		if (!session) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.FAILED_TO_CREATE_SESSION);
		await setSessionCookie(ctx, {
			session,
			user: createdUser
		}, rememberMe === false);
		return ctx.json({
			token: session.token,
			user: parseUserOutput(ctx.context.options, createdUser)
		});
	});
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/update-session.mjs
var updateSessionBodySchema = record(string().meta({ description: "Field name must be a string" }), any());
var updateSession = () => createAuthEndpoint("/update-session", {
	method: "POST",
	operationId: "updateSession",
	body: updateSessionBodySchema,
	use: [sessionMiddleware],
	metadata: {
		$Infer: { body: {} },
		openapi: {
			operationId: "updateSession",
			description: "Update the current session",
			responses: { "200": {
				description: "Success",
				content: { "application/json": { schema: {
					type: "object",
					properties: { session: {
						type: "object",
						$ref: "#/components/schemas/Session"
					} }
				} } }
			} }
		}
	}
}, async (ctx) => {
	const body = ctx.body;
	if (typeof body !== "object" || Array.isArray(body)) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.BODY_MUST_BE_AN_OBJECT);
	const session = ctx.context.session;
	const additionalFields = parseSessionInput(ctx.context.options, body, "update");
	if (Object.keys(additionalFields).length === 0) throw APIError.fromStatus("BAD_REQUEST", { message: "No fields to update" });
	const newSession = await ctx.context.internalAdapter.updateSession(session.session.token, {
		...additionalFields,
		updatedAt: /* @__PURE__ */ new Date()
	}) ?? {
		...session.session,
		...additionalFields,
		updatedAt: /* @__PURE__ */ new Date()
	};
	await setSessionCookie(ctx, {
		session: newSession,
		user: session.user
	});
	return ctx.json({ session: parseSessionOutput(ctx.context.options, newSession) });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/routes/update-user.mjs
var updateUserBodySchema = record(string().meta({ description: "Field name must be a string" }), any());
var updateUser = () => createAuthEndpoint("/update-user", {
	method: "POST",
	operationId: "updateUser",
	body: updateUserBodySchema,
	use: [sessionMiddleware],
	metadata: {
		$Infer: { body: {} },
		openapi: {
			operationId: "updateUser",
			description: "Update the current user",
			requestBody: { content: { "application/json": { schema: {
				type: "object",
				properties: {
					name: {
						type: "string",
						description: "The name of the user"
					},
					image: {
						type: "string",
						description: "The image of the user",
						nullable: true
					}
				}
			} } } },
			responses: { "200": {
				description: "Success",
				content: { "application/json": { schema: {
					type: "object",
					properties: { user: {
						type: "object",
						$ref: "#/components/schemas/User"
					} }
				} } }
			} }
		}
	}
}, async (ctx) => {
	const body = ctx.body;
	if (typeof body !== "object" || Array.isArray(body)) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.BODY_MUST_BE_AN_OBJECT);
	if (body.email) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.EMAIL_CAN_NOT_BE_UPDATED);
	const { name, image, ...rest } = body;
	const session = ctx.context.session;
	const additionalFields = parseUserInput(ctx.context.options, rest, "update");
	if (image === void 0 && name === void 0 && Object.keys(additionalFields).length === 0) throw APIError.fromStatus("BAD_REQUEST", { message: "No fields to update" });
	const updatedUser = await ctx.context.internalAdapter.updateUser(session.user.id, {
		name,
		image,
		...additionalFields
	}) ?? {
		...session.user,
		...name !== void 0 && { name },
		...image !== void 0 && { image },
		...additionalFields
	};
	/**
	* Update the session cookie with the new user data
	*/
	await setSessionCookie(ctx, {
		session: session.session,
		user: updatedUser
	});
	return ctx.json({ status: true });
});
var changePassword = createAuthEndpoint("/change-password", {
	method: "POST",
	operationId: "changePassword",
	body: object({
		newPassword: string().meta({ description: "The new password to set" }),
		currentPassword: string().meta({ description: "The current password is required" }),
		revokeOtherSessions: boolean().meta({ description: "Must be a boolean value" }).optional()
	}),
	use: [sensitiveSessionMiddleware],
	metadata: { openapi: {
		operationId: "changePassword",
		description: "Change the password of the user",
		responses: { "200": {
			description: "Password successfully changed",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					token: {
						type: "string",
						nullable: true,
						description: "New session token if other sessions were revoked"
					},
					user: {
						type: "object",
						properties: {
							id: {
								type: "string",
								description: "The unique identifier of the user"
							},
							email: {
								type: "string",
								format: "email",
								description: "The email address of the user"
							},
							name: {
								type: "string",
								description: "The name of the user"
							},
							image: {
								type: "string",
								format: "uri",
								nullable: true,
								description: "The profile image URL of the user"
							},
							emailVerified: {
								type: "boolean",
								description: "Whether the email has been verified"
							},
							createdAt: {
								type: "string",
								format: "date-time",
								description: "When the user was created"
							},
							updatedAt: {
								type: "string",
								format: "date-time",
								description: "When the user was last updated"
							}
						},
						required: [
							"id",
							"email",
							"name",
							"emailVerified",
							"createdAt",
							"updatedAt"
						]
					}
				},
				required: ["user"]
			} } }
		} }
	} }
}, async (ctx) => {
	const { newPassword, currentPassword, revokeOtherSessions } = ctx.body;
	const session = ctx.context.session;
	const minPasswordLength = ctx.context.password.config.minPasswordLength;
	if (newPassword.length < minPasswordLength) {
		ctx.context.logger.error("Password is too short");
		throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
	}
	const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
	if (newPassword.length > maxPasswordLength) {
		ctx.context.logger.error("Password is too long");
		throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
	}
	const account = (await ctx.context.internalAdapter.findAccounts(session.user.id)).find((account) => account.providerId === "credential" && account.password);
	if (!account || !account.password) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND);
	const passwordHash = await ctx.context.password.hash(newPassword);
	if (!await ctx.context.password.verify({
		hash: account.password,
		password: currentPassword
	})) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
	await ctx.context.internalAdapter.updateAccount(account.id, { password: passwordHash });
	let token = null;
	if (revokeOtherSessions) {
		await ctx.context.internalAdapter.deleteSessions(session.user.id);
		const newSession = await ctx.context.internalAdapter.createSession(session.user.id);
		if (!newSession) throw APIError.from("INTERNAL_SERVER_ERROR", BASE_ERROR_CODES.FAILED_TO_GET_SESSION);
		await setSessionCookie(ctx, {
			session: newSession,
			user: session.user
		});
		token = newSession.token;
	}
	return ctx.json({
		token,
		user: parseUserOutput(ctx.context.options, session.user)
	});
});
var setPassword = createAuthEndpoint({
	method: "POST",
	body: object({ newPassword: string().meta({ description: "The new password to set is required" }) }),
	use: [sensitiveSessionMiddleware]
}, async (ctx) => {
	const { newPassword } = ctx.body;
	const session = ctx.context.session;
	const minPasswordLength = ctx.context.password.config.minPasswordLength;
	if (newPassword.length < minPasswordLength) {
		ctx.context.logger.error("Password is too short");
		throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_SHORT);
	}
	const maxPasswordLength = ctx.context.password.config.maxPasswordLength;
	if (newPassword.length > maxPasswordLength) {
		ctx.context.logger.error("Password is too long");
		throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_TOO_LONG);
	}
	const account = (await ctx.context.internalAdapter.findAccounts(session.user.id)).find((account) => account.providerId === "credential" && account.password);
	const passwordHash = await ctx.context.password.hash(newPassword);
	if (!account) {
		await ctx.context.internalAdapter.linkAccount({
			userId: session.user.id,
			providerId: "credential",
			accountId: session.user.id,
			password: passwordHash
		});
		return ctx.json({ status: true });
	}
	throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.PASSWORD_ALREADY_SET);
});
var deleteUser = createAuthEndpoint("/delete-user", {
	method: "POST",
	use: [sensitiveSessionMiddleware],
	body: object({
		callbackURL: string().meta({ description: "The callback URL to redirect to after the user is deleted" }).optional(),
		password: string().meta({ description: "The password of the user is required to delete the user" }).optional(),
		token: string().meta({ description: "The token to delete the user is required" }).optional()
	}),
	metadata: { openapi: {
		operationId: "deleteUser",
		description: "Delete the user",
		requestBody: { content: { "application/json": { schema: {
			type: "object",
			properties: {
				callbackURL: {
					type: "string",
					description: "The callback URL to redirect to after the user is deleted"
				},
				password: {
					type: "string",
					description: "The user's password. Required if session is not fresh"
				},
				token: {
					type: "string",
					description: "The deletion verification token"
				}
			}
		} } } },
		responses: { "200": {
			description: "User deletion processed successfully",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					success: {
						type: "boolean",
						description: "Indicates if the operation was successful"
					},
					message: {
						type: "string",
						enum: ["User deleted", "Verification email sent"],
						description: "Status message of the deletion process"
					}
				},
				required: ["success", "message"]
			} } }
		} }
	} }
}, async (ctx) => {
	if (!ctx.context.options.user?.deleteUser?.enabled) {
		ctx.context.logger.error("Delete user is disabled. Enable it in the options");
		throw APIError.fromStatus("NOT_FOUND");
	}
	const session = ctx.context.session;
	if (ctx.body.password) {
		const account = (await ctx.context.internalAdapter.findAccounts(session.user.id)).find((account) => account.providerId === "credential" && account.password);
		if (!account || !account.password) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.CREDENTIAL_ACCOUNT_NOT_FOUND);
		if (!await ctx.context.password.verify({
			hash: account.password,
			password: ctx.body.password
		})) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_PASSWORD);
	}
	if (ctx.body.token) {
		await deleteUserCallback({
			...ctx,
			query: { token: ctx.body.token }
		});
		return ctx.json({
			success: true,
			message: "User deleted"
		});
	}
	if (ctx.context.options.user.deleteUser?.sendDeleteAccountVerification) {
		const token = generateRandomString(32, "0-9", "a-z");
		await ctx.context.internalAdapter.createVerificationValue({
			value: session.user.id,
			identifier: `delete-account-${token}`,
			expiresAt: new Date(Date.now() + (ctx.context.options.user.deleteUser?.deleteTokenExpiresIn || 3600 * 24) * 1e3)
		});
		const url = `${ctx.context.baseURL}/delete-user/callback?token=${token}&callbackURL=${encodeURIComponent(ctx.body.callbackURL || "/")}`;
		await ctx.context.runInBackgroundOrAwait(ctx.context.options.user.deleteUser.sendDeleteAccountVerification({
			user: session.user,
			url,
			token
		}, ctx.request));
		return ctx.json({
			success: true,
			message: "Verification email sent"
		});
	}
	if (!ctx.body.password && ctx.context.sessionConfig.freshAge !== 0) {
		const createdAt = new Date(session.session.createdAt).getTime();
		const freshAge = ctx.context.sessionConfig.freshAge * 1e3;
		if (Date.now() - createdAt >= freshAge) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.SESSION_EXPIRED);
	}
	const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
	if (beforeDelete) await beforeDelete(session.user, ctx.request);
	await ctx.context.internalAdapter.deleteUser(session.user.id);
	await ctx.context.internalAdapter.deleteSessions(session.user.id);
	deleteSessionCookie(ctx);
	const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
	if (afterDelete) await afterDelete(session.user, ctx.request);
	return ctx.json({
		success: true,
		message: "User deleted"
	});
});
var deleteUserCallback = createAuthEndpoint("/delete-user/callback", {
	method: "GET",
	query: object({
		token: string().meta({ description: "The token to verify the deletion request" }),
		callbackURL: string().meta({ description: "The URL to redirect to after deletion" }).optional()
	}),
	use: [originCheck((ctx) => ctx.query.callbackURL)],
	metadata: { openapi: {
		description: "Callback to complete user deletion with verification token",
		responses: { "200": {
			description: "User successfully deleted",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					success: {
						type: "boolean",
						description: "Indicates if the deletion was successful"
					},
					message: {
						type: "string",
						enum: ["User deleted"],
						description: "Confirmation message"
					}
				},
				required: ["success", "message"]
			} } }
		} }
	} }
}, async (ctx) => {
	if (!ctx.context.options.user?.deleteUser?.enabled) {
		ctx.context.logger.error("Delete user is disabled. Enable it in the options");
		throw APIError.from("NOT_FOUND", {
			message: "Not found",
			code: "NOT_FOUND"
		});
	}
	const session = await getSessionFromCtx(ctx);
	if (!session) throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.FAILED_TO_GET_USER_INFO);
	const token = await ctx.context.internalAdapter.findVerificationValue(`delete-account-${ctx.query.token}`);
	if (!token || token.expiresAt < /* @__PURE__ */ new Date()) throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.INVALID_TOKEN);
	if (token.value !== session.user.id) throw APIError.from("NOT_FOUND", BASE_ERROR_CODES.INVALID_TOKEN);
	const beforeDelete = ctx.context.options.user.deleteUser?.beforeDelete;
	if (beforeDelete) await beforeDelete(session.user, ctx.request);
	await ctx.context.internalAdapter.deleteUser(session.user.id);
	await ctx.context.internalAdapter.deleteSessions(session.user.id);
	await ctx.context.internalAdapter.deleteAccounts(session.user.id);
	await ctx.context.internalAdapter.deleteVerificationByIdentifier(`delete-account-${ctx.query.token}`);
	deleteSessionCookie(ctx);
	const afterDelete = ctx.context.options.user.deleteUser?.afterDelete;
	if (afterDelete) await afterDelete(session.user, ctx.request);
	if (ctx.query.callbackURL) throw ctx.redirect(ctx.query.callbackURL || "/");
	return ctx.json({
		success: true,
		message: "User deleted"
	});
});
var changeEmail = createAuthEndpoint("/change-email", {
	method: "POST",
	body: object({
		newEmail: email().meta({ description: "The new email address to set must be a valid email address" }),
		callbackURL: string().meta({ description: "The URL to redirect to after email verification" }).optional()
	}),
	use: [sensitiveSessionMiddleware],
	metadata: { openapi: {
		operationId: "changeEmail",
		responses: { "200": {
			description: "Email change request processed successfully",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					user: {
						type: "object",
						$ref: "#/components/schemas/User"
					},
					status: {
						type: "boolean",
						description: "Indicates if the request was successful"
					},
					message: {
						type: "string",
						enum: ["Email updated", "Verification email sent"],
						description: "Status message of the email change process",
						nullable: true
					}
				},
				required: ["status"]
			} } }
		} }
	} }
}, async (ctx) => {
	if (!ctx.context.options.user?.changeEmail?.enabled) {
		ctx.context.logger.error("Change email is disabled.");
		throw APIError.fromStatus("BAD_REQUEST", { message: "Change email is disabled" });
	}
	const newEmail = ctx.body.newEmail.toLowerCase();
	if (newEmail === ctx.context.session.user.email) {
		ctx.context.logger.error("Email is the same");
		throw APIError.fromStatus("BAD_REQUEST", { message: "Email is the same" });
	}
	/**
	* Early config check: ensure at least one email-change flow is
	* available for the current session state. Without this, an
	* existing-email lookup would return 200 while a non-existing
	* email would later throw 400, leaking email existence.
	*/
	const canUpdateWithoutVerification = ctx.context.session.user.emailVerified !== true && ctx.context.options.user.changeEmail.updateEmailWithoutVerification;
	const canSendConfirmation = ctx.context.session.user.emailVerified && ctx.context.options.user.changeEmail.sendChangeEmailConfirmation;
	const canSendVerification = ctx.context.options.emailVerification?.sendVerificationEmail;
	if (!canUpdateWithoutVerification && !canSendConfirmation && !canSendVerification) {
		ctx.context.logger.error("Verification email isn't enabled.");
		throw APIError.fromStatus("BAD_REQUEST", { message: "Verification email isn't enabled" });
	}
	if (await ctx.context.internalAdapter.findUserByEmail(newEmail)) {
		await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn);
		ctx.context.logger.info("Change email attempt for existing email");
		return ctx.json({ status: true });
	}
	/**
	* If the email is not verified, we can update the email if the option is enabled
	*/
	if (canUpdateWithoutVerification) {
		await ctx.context.internalAdapter.updateUserByEmail(ctx.context.session.user.email, { email: newEmail });
		await setSessionCookie(ctx, {
			session: ctx.context.session.session,
			user: {
				...ctx.context.session.user,
				email: newEmail
			}
		});
		if (canSendVerification) {
			const token = await createEmailVerificationToken(ctx.context.secret, newEmail, void 0, ctx.context.options.emailVerification?.expiresIn);
			const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
			await ctx.context.runInBackgroundOrAwait(canSendVerification({
				user: {
					...ctx.context.session.user,
					email: newEmail
				},
				url,
				token
			}, ctx.request));
		}
		return ctx.json({ status: true });
	}
	/**
	* If the email is verified, we need to send a verification email
	*/
	if (canSendConfirmation) {
		const token = await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-confirmation" });
		const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
		await ctx.context.runInBackgroundOrAwait(canSendConfirmation({
			user: ctx.context.session.user,
			newEmail,
			url,
			token
		}, ctx.request));
		return ctx.json({ status: true });
	}
	if (!canSendVerification) {
		ctx.context.logger.error("Verification email isn't enabled.");
		throw APIError.fromStatus("BAD_REQUEST", { message: "Verification email isn't enabled" });
	}
	const token = await createEmailVerificationToken(ctx.context.secret, ctx.context.session.user.email, newEmail, ctx.context.options.emailVerification?.expiresIn, { requestType: "change-email-verification" });
	const url = `${ctx.context.baseURL}/verify-email?token=${token}&callbackURL=${ctx.body.callbackURL || "/"}`;
	await ctx.context.runInBackgroundOrAwait(canSendVerification({
		user: {
			...ctx.context.session.user,
			email: newEmail
		},
		url,
		token
	}, ctx.request));
	return ctx.json({ status: true });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/to-auth-endpoints.mjs
var defuReplaceArrays = createDefu((obj, key, value) => {
	if (Array.isArray(obj[key]) && Array.isArray(value)) {
		obj[key] = value;
		return true;
	}
});
var hooksSourceWeakMap = /* @__PURE__ */ new WeakMap();
function getOperationId(endpoint, key) {
	if (!endpoint?.options) return key;
	const opts = endpoint.options;
	return opts.operationId ?? opts.metadata?.openapi?.operationId ?? key;
}
/**
* Resolves the per-call `AuthContext` for endpoints with a dynamic `baseURL`.
*
* - `rawCtx.baseURL` already set: HTTP handler rehydrated upstream; return as-is.
* - Direct `auth.api` call with a source or a configured `fallback`: resolve here.
* - Neither: throw `APIError` with a helpful message. Leaving `baseURL = ""`
*   would let plugins build `new URL("")` and crash cryptically downstream.
*/
async function resolveDynamicContext(rawCtx, input) {
	if (rawCtx.baseURL) return rawCtx;
	const source = pickSource(input);
	const config = rawCtx.options.baseURL;
	const hasFallback = isDynamicBaseURLConfig(config) && Boolean(config.fallback);
	if (source === void 0 && !hasFallback) throw new APIError("INTERNAL_SERVER_ERROR", { message: "Dynamic baseURL could not be resolved for this direct auth.api call. Pass `headers: request.headers` (or `request`) to the call, or add `fallback` to your baseURL config." });
	try {
		return await resolveRequestContext(rawCtx, source, resolveDynamicTrustedProxyHeaders(rawCtx.options));
	} catch (err) {
		if (err instanceof BetterAuthError) throw new APIError("INTERNAL_SERVER_ERROR", { message: err.message });
		throw err;
	}
}
function toAuthEndpoints(endpoints, ctx) {
	const api = {};
	for (const [key, endpoint] of Object.entries(endpoints)) {
		api[key] = async (context) => {
			const operationId = getOperationId(endpoint, key);
			const endpointMethod = endpoint?.options?.method;
			const defaultMethod = Array.isArray(endpointMethod) ? endpointMethod[0] : endpointMethod;
			const run = async () => {
				const rawContext = await ctx;
				const methodName = context?.method ?? context?.request?.method ?? defaultMethod ?? "?";
				const route = endpoint.path ?? "/:virtual";
				const authContext = isDynamicBaseURLConfig(rawContext.options.baseURL) ? await resolveDynamicContext(rawContext, context) : rawContext;
				let internalContext = {
					...context,
					context: {
						...authContext,
						returned: void 0,
						responseHeaders: void 0,
						session: null
					},
					path: endpoint.path,
					headers: context?.headers ? new Headers(context?.headers) : void 0
				};
				const hasRequest = isRequestLike(context?.request);
				const shouldReturnResponse = context?.asResponse ?? hasRequest;
				return withSpan(`${methodName} ${route}`, {
					[ATTR_HTTP_ROUTE]: route,
					[ATTR_OPERATION_ID]: operationId
				}, async () => runWithEndpointContext(internalContext, async () => {
					const { beforeHooks, afterHooks } = getHooks(authContext);
					const before = await runBeforeHooks(internalContext, beforeHooks, endpoint, operationId);
					/**
					* If `before.context` is returned, it should
					* get merged with the original context
					*/
					if ("context" in before && before.context && typeof before.context === "object") {
						const { headers, ...rest } = before.context;
						/**
						* Headers should be merged differently
						* so the hook doesn't override the whole
						* header
						*/
						if (headers) headers.forEach((value, key) => {
							internalContext.headers.set(key, value);
						});
						internalContext = defuReplaceArrays(rest, internalContext);
					} else if (before) return shouldReturnResponse ? toResponse(before, { headers: context?.headers }) : context?.returnHeaders ? {
						headers: context?.headers,
						response: before
					} : before;
					internalContext.asResponse = false;
					internalContext.returnHeaders = true;
					internalContext.returnStatus = true;
					const result = await runWithEndpointContext(internalContext, () => withSpan(`handler ${route}`, {
						[ATTR_HTTP_ROUTE]: route,
						[ATTR_OPERATION_ID]: operationId
					}, () => endpoint(internalContext))).catch((e) => {
						if (isAPIError(e)) {
							/**
							* API Errors from response are caught
							* and returned to hooks.
							*
							* Headers come from two sources that must both
							* survive:
							* - `kAPIErrorHeaderSymbol`: ctx.responseHeaders
							*   accumulated via c.setCookie / c.setHeader
							*   before the throw.
							* - `e.headers`: explicit headers on the APIError
							*   (e.g. `location` from c.redirect).
							*
							* Start from the accumulated ctx headers, then
							* apply e.headers on top — appending `set-cookie`
							* and setting others — so explicit APIError
							* headers override while cookies accumulate.
							*/
							const ctxHeaders = e[kAPIErrorHeaderSymbol];
							/**
							* `c.redirect()` (and similar APIError throws) reuse
							* `ctx.responseHeaders` as `e.headers`, so when both sources
							* reference the same Headers, iterating both duplicates every
							* `set-cookie`. Skip the `errHeaders` copy in that case.
							*/
							const errHeaders = e.headers && e.headers !== ctxHeaders ? new Headers(e.headers) : null;
							let headers = null;
							if (ctxHeaders || errHeaders) {
								headers = new Headers();
								ctxHeaders?.forEach((value, key) => {
									headers.append(key, value);
								});
								errHeaders?.forEach((value, key) => {
									if (key.toLowerCase() === "set-cookie") headers.append(key, value);
									else headers.set(key, value);
								});
							}
							return {
								response: e,
								status: e.statusCode,
								headers
							};
						}
						throw e;
					});
					if (result && result instanceof Response) return result;
					internalContext.context.returned = result.response;
					internalContext.context.responseHeaders = result.headers;
					const after = await runAfterHooks(internalContext, afterHooks, endpoint, operationId);
					if (after.response) result.response = after.response;
					if (isAPIError(result.response) && shouldPublishLog(authContext.logger.level, "debug")) result.response.stack = result.response.errorStack;
					if (isAPIError(result.response) && !shouldReturnResponse) {
						/**
						* Non-response path: we re-throw the raw APIError
						* to callers of `auth.api.*`. `result.headers`
						* holds the merged ctx + explicit headers (see
						* catch block above) — rewrite
						* `kAPIErrorHeaderSymbol` with the merged set so
						* downstream pipelines (e.g. better-call's
						* response builder, or an outer hook catch) see
						* the same headers we'd have written on the
						* response.
						*/
						if (result.headers) Object.defineProperty(result.response, kAPIErrorHeaderSymbol, {
							enumerable: false,
							configurable: true,
							writable: false,
							value: result.headers
						});
						throw result.response;
					}
					return shouldReturnResponse ? toResponse(result.response, {
						headers: result.headers,
						status: result.status
					}) : context?.returnHeaders ? context?.returnStatus ? {
						headers: result.headers,
						response: result.response,
						status: result.status
					} : {
						headers: result.headers,
						response: result.response
					} : context?.returnStatus ? {
						response: result.response,
						status: result.status
					} : result.response;
				}));
			};
			if (await hasRequestState()) return run();
			else return runWithRequestState(/* @__PURE__ */ new WeakMap(), run);
		};
		api[key].path = endpoint.path;
		api[key].options = endpoint.options;
	}
	return api;
}
async function runBeforeHooks(context, hooks, endpoint, operationId) {
	let modifiedContext = {};
	for (const hook of hooks) {
		let matched = false;
		try {
			matched = hook.matcher(context);
		} catch (error) {
			const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
			context.context.logger.error(`An error occurred during ${hookSource} hook matcher execution:`, error);
			throw new APIError("INTERNAL_SERVER_ERROR", { message: `An error occurred during hook matcher execution. Check the logs for more details.` });
		}
		if (matched) {
			const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
			const route = endpoint.path ?? "/:virtual";
			const result = await withSpan(`hook before ${route} ${hookSource}`, {
				[ATTR_HOOK_TYPE]: "before",
				[ATTR_HTTP_ROUTE]: route,
				[ATTR_CONTEXT]: hookSource,
				[ATTR_OPERATION_ID]: operationId
			}, () => hook.handler({
				...context,
				returnHeaders: false
			})).catch((e) => {
				if (isAPIError(e) && shouldPublishLog(context.context.logger.level, "debug")) e.stack = e.errorStack;
				throw e;
			});
			if (result && typeof result === "object") {
				if ("context" in result && typeof result.context === "object") {
					const { headers, ...rest } = result.context;
					if (headers instanceof Headers) if (modifiedContext.headers) headers.forEach((value, key) => {
						modifiedContext.headers?.set(key, value);
					});
					else modifiedContext.headers = headers;
					modifiedContext = defuReplaceArrays(rest, modifiedContext);
					continue;
				}
				return result;
			}
		}
	}
	return { context: modifiedContext };
}
async function runAfterHooks(context, hooks, endpoint, operationId) {
	for (const hook of hooks) if (hook.matcher(context)) {
		const hookSource = hooksSourceWeakMap.get(hook.handler) ?? "unknown";
		const route = endpoint.path ?? "/:virtual";
		const result = await withSpan(`hook after ${route} ${hookSource}`, {
			[ATTR_HOOK_TYPE]: "after",
			[ATTR_HTTP_ROUTE]: route,
			[ATTR_CONTEXT]: hookSource,
			[ATTR_OPERATION_ID]: operationId
		}, () => hook.handler(context)).catch((e) => {
			if (isAPIError(e)) {
				const headers = e[kAPIErrorHeaderSymbol];
				if (shouldPublishLog(context.context.logger.level, "debug")) e.stack = e.errorStack;
				return {
					response: e,
					headers: headers ? headers : e.headers ? new Headers(e.headers) : null
				};
			}
			throw e;
		});
		if (result.headers) result.headers.forEach((value, key) => {
			if (!context.context.responseHeaders) context.context.responseHeaders = new Headers({ [key]: value });
			else if (key.toLowerCase() === "set-cookie") context.context.responseHeaders.append(key, value);
			else context.context.responseHeaders.set(key, value);
		});
		if (result.response) context.context.returned = result.response;
	}
	return {
		response: context.context.returned,
		headers: context.context.responseHeaders
	};
}
function getHooks(authContext) {
	const plugins = authContext.options.plugins || [];
	const beforeHooks = [];
	const afterHooks = [];
	const beforeHookHandler = authContext.options.hooks?.before;
	if (beforeHookHandler) {
		hooksSourceWeakMap.set(beforeHookHandler, "user");
		beforeHooks.push({
			matcher: () => true,
			handler: beforeHookHandler
		});
	}
	const afterHookHandler = authContext.options.hooks?.after;
	if (afterHookHandler) {
		hooksSourceWeakMap.set(afterHookHandler, "user");
		afterHooks.push({
			matcher: () => true,
			handler: afterHookHandler
		});
	}
	const pluginBeforeHooks = plugins.flatMap((plugin) => (plugin.hooks?.before ?? []).map((h) => {
		hooksSourceWeakMap.set(h.handler, `plugin:${plugin.id}`);
		return h;
	}));
	const pluginAfterHooks = plugins.flatMap((plugin) => (plugin.hooks?.after ?? []).map((h) => {
		hooksSourceWeakMap.set(h.handler, `plugin:${plugin.id}`);
		return h;
	}));
	/**
	* Add plugin added hooks at last
	*/
	if (pluginBeforeHooks.length) beforeHooks.push(...pluginBeforeHooks);
	if (pluginAfterHooks.length) afterHooks.push(...pluginAfterHooks);
	return {
		beforeHooks,
		afterHooks
	};
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/api/index.mjs
function checkEndpointConflicts(options, logger) {
	const endpointRegistry = /* @__PURE__ */ new Map();
	options.plugins?.forEach((plugin) => {
		if (plugin.endpoints) {
			for (const [key, endpoint] of Object.entries(plugin.endpoints)) if (endpoint && "path" in endpoint && typeof endpoint.path === "string") {
				const path = endpoint.path;
				let methods = [];
				if (endpoint.options && "method" in endpoint.options) {
					if (Array.isArray(endpoint.options.method)) methods = endpoint.options.method;
					else if (typeof endpoint.options.method === "string") methods = [endpoint.options.method];
				}
				if (methods.length === 0) methods = ["*"];
				if (!endpointRegistry.has(path)) endpointRegistry.set(path, []);
				endpointRegistry.get(path).push({
					pluginId: plugin.id,
					endpointKey: key,
					methods
				});
			}
		}
	});
	const conflicts = [];
	for (const [path, entries] of endpointRegistry.entries()) if (entries.length > 1) {
		const methodMap = /* @__PURE__ */ new Map();
		let hasConflict = false;
		for (const entry of entries) for (const method of entry.methods) {
			if (!methodMap.has(method)) methodMap.set(method, []);
			methodMap.get(method).push(entry.pluginId);
			if (methodMap.get(method).length > 1) hasConflict = true;
			if (method === "*" && entries.length > 1) hasConflict = true;
			else if (method !== "*" && methodMap.has("*")) hasConflict = true;
		}
		if (hasConflict) {
			const uniquePlugins = [...new Set(entries.map((e) => e.pluginId))];
			const conflictingMethods = [];
			for (const [method, plugins] of methodMap.entries()) if (plugins.length > 1 || method === "*" && entries.length > 1 || method !== "*" && methodMap.has("*")) conflictingMethods.push(method);
			conflicts.push({
				path,
				plugins: uniquePlugins,
				conflictingMethods
			});
		}
	}
	if (conflicts.length > 0) {
		const conflictMessages = conflicts.map((conflict) => `  - "${conflict.path}" [${conflict.conflictingMethods.join(", ")}] used by plugins: ${conflict.plugins.join(", ")}`).join("\n");
		logger.error(`Endpoint path conflicts detected! Multiple plugins are trying to use the same endpoint paths with conflicting HTTP methods:
${conflictMessages}

To resolve this, you can:
	1. Use only one of the conflicting plugins
	2. Configure the plugins to use different paths (if supported)
	3. Ensure plugins use different HTTP methods for the same path
`);
	}
}
function getEndpoints(ctx, options) {
	const pluginEndpoints = options.plugins?.reduce((acc, plugin) => {
		return {
			...acc,
			...plugin.endpoints
		};
	}, {}) ?? {};
	const middlewares = options.plugins?.map((plugin) => plugin.middlewares?.map((m) => {
		const middleware = (async (context) => {
			const authContext = await ctx;
			return withSpan(`middleware ${m.path} ${plugin.id}`, {
				["better_auth.hook.type"]: "middleware",
				["http.route"]: m.path,
				["better_auth.context"]: `plugin:${plugin.id}`
			}, () => m.middleware({
				...context,
				context: {
					...authContext,
					...context.context
				}
			}));
		});
		middleware.options = m.middleware.options;
		return {
			path: m.path,
			middleware
		};
	})).filter((plugin) => plugin !== void 0).flat() || [];
	return {
		api: toAuthEndpoints({
			signInSocial: signInSocial(),
			callbackOAuth,
			getSession: getSession$1(),
			signOut,
			signUpEmail: signUpEmail(),
			signInEmail: signInEmail(),
			resetPassword,
			verifyPassword,
			verifyEmail,
			sendVerificationEmail,
			changeEmail,
			changePassword,
			setPassword,
			updateSession: updateSession(),
			updateUser: updateUser(),
			deleteUser,
			requestPasswordReset,
			requestPasswordResetCallback,
			listSessions: listSessions(),
			revokeSession,
			revokeSessions,
			revokeOtherSessions,
			linkSocialAccount,
			listUserAccounts,
			deleteUserCallback,
			unlinkAccount,
			refreshToken,
			getAccessToken,
			accountInfo,
			...pluginEndpoints,
			ok,
			error
		}, ctx),
		middlewares
	};
}
var router = (ctx, options) => {
	const { api, middlewares } = getEndpoints(ctx, options);
	const basePath = new URL(ctx.baseURL).pathname;
	return createRouter$1(api, {
		routerContext: ctx,
		openapi: { disabled: true },
		basePath,
		routerMiddleware: [{
			path: "/**",
			middleware: originCheckMiddleware
		}, ...middlewares],
		allowedMediaTypes: ["application/json"],
		skipTrailingSlashes: options.advanced?.skipTrailingSlashes ?? false,
		async onRequest(req) {
			const disabledPaths = ctx.options.disabledPaths || [];
			const normalizedPath = normalizePathname(req.url, basePath);
			if (disabledPaths.includes(normalizedPath)) return new Response("Not Found", { status: 404 });
			let currentRequest = req;
			for (const plugin of ctx.options.plugins || []) if (plugin.onRequest) {
				const response = await withSpan(`onRequest ${plugin.id}`, {
					[ATTR_HOOK_TYPE]: "onRequest",
					[ATTR_CONTEXT]: `plugin:${plugin.id}`
				}, () => plugin.onRequest(currentRequest, ctx));
				if (response && "response" in response) return response.response;
				if (response && "request" in response) currentRequest = response.request;
			}
			const rateLimitResponse = await onRequestRateLimit(currentRequest, ctx);
			if (rateLimitResponse) return rateLimitResponse;
			return currentRequest;
		},
		async onResponse(res, req) {
			await onResponseRateLimit(req, ctx);
			for (const plugin of ctx.options.plugins || []) if (plugin.onResponse) {
				const response = await withSpan(`onResponse ${plugin.id}`, {
					[ATTR_HOOK_TYPE]: "onResponse",
					[ATTR_CONTEXT]: `plugin:${plugin.id}`,
					[ATTR_HTTP_RESPONSE_STATUS_CODE]: res.status
				}, () => plugin.onResponse(res, ctx));
				if (response) return response.response;
			}
			return res;
		},
		onError(e) {
			if (isAPIError(e) && e.status === "FOUND") return;
			if (options.onAPIError?.throw) throw e;
			if (options.onAPIError?.onError) {
				options.onAPIError.onError(e, ctx);
				return;
			}
			const optLogLevel = options.logger?.level;
			const log = optLogLevel === "error" || optLogLevel === "warn" || optLogLevel === "debug" ? logger : void 0;
			if (options.logger?.disabled !== true) {
				if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
					if (e.message.includes("no column") || e.message.includes("column") || e.message.includes("relation") || e.message.includes("table") || e.message.includes("does not exist")) {
						ctx.logger?.error(e.message);
						return;
					}
				}
				if (isAPIError(e)) {
					if (e.status === "INTERNAL_SERVER_ERROR") ctx.logger.error(e.status, e);
					log?.error(e.message);
				} else ctx.logger?.error(e && typeof e === "object" && "name" in e ? e.name : "", e);
			}
		}
	});
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/adapter-base.mjs
async function getBaseAdapter(options, handleDirectDatabase) {
	let adapter;
	if (!options.database) {
		const tables = getAuthTables(options);
		const memoryDB = Object.keys(tables).reduce((acc, key) => {
			acc[key] = [];
			return acc;
		}, {});
		const { memoryAdapter } = await import("./dist-GtpUJocl.js");
		adapter = memoryAdapter(memoryDB)(options);
	} else if (typeof options.database === "function") adapter = options.database(options);
	else adapter = await handleDirectDatabase(options);
	if (!adapter.transaction) {
		logger.warn("Adapter does not correctly implement transaction function, patching it automatically. Please update your adapter implementation.");
		adapter.transaction = async (cb) => {
			return cb(adapter);
		};
	}
	return adapter;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/adapter-kysely.mjs
async function getAdapter(options) {
	return getBaseAdapter(options, async (opts) => {
		const { createKyselyAdapter } = await import("./kysely-adapter-Dx9fpE7f.js");
		const { kysely, databaseType, transaction } = await createKyselyAdapter(opts);
		if (!kysely) throw new BetterAuthError("Failed to initialize database adapter");
		const { kyselyAdapter } = await import("./kysely-adapter-Dx9fpE7f.js");
		return kyselyAdapter(kysely, {
			type: databaseType || "sqlite",
			debugLogs: opts.database && "debugLogs" in opts.database ? opts.database.debugLogs : false,
			transaction
		})(opts);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/get-schema.mjs
function getSchema(config) {
	const tables = getAuthTables(config);
	const schema = {};
	for (const key in tables) {
		const table = tables[key];
		const fields = table.fields;
		const actualFields = {};
		Object.entries(fields).forEach(([key, field]) => {
			actualFields[field.fieldName || key] = field;
			if (field.references) {
				const refTable = tables[field.references.model];
				if (refTable) actualFields[field.fieldName || key].references = {
					...field.references,
					model: refTable.modelName,
					field: field.references.field
				};
			}
		});
		if (schema[table.modelName]) {
			schema[table.modelName].fields = {
				...schema[table.modelName].fields,
				...actualFields
			};
			continue;
		}
		schema[table.modelName] = {
			fields: actualFields,
			order: table.order || Infinity
		};
	}
	return schema;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/get-migration.mjs
var map = {
	postgres: {
		string: [
			"character varying",
			"varchar",
			"text",
			"uuid"
		],
		number: [
			"int4",
			"integer",
			"bigint",
			"smallint",
			"numeric",
			"real",
			"double precision"
		],
		boolean: ["bool", "boolean"],
		date: [
			"timestamptz",
			"timestamp",
			"date"
		],
		json: ["json", "jsonb"]
	},
	mysql: {
		string: [
			"varchar",
			"text",
			"uuid"
		],
		number: [
			"integer",
			"int",
			"bigint",
			"smallint",
			"decimal",
			"float",
			"double"
		],
		boolean: ["boolean", "tinyint"],
		date: [
			"timestamp",
			"datetime",
			"date"
		],
		json: ["json"]
	},
	sqlite: {
		string: ["TEXT"],
		number: ["INTEGER", "REAL"],
		boolean: ["INTEGER", "BOOLEAN"],
		date: ["DATE", "INTEGER"],
		json: ["TEXT"]
	},
	mssql: {
		string: [
			"varchar",
			"nvarchar",
			"uniqueidentifier"
		],
		number: [
			"int",
			"bigint",
			"smallint",
			"decimal",
			"float",
			"double"
		],
		boolean: ["bit", "smallint"],
		date: [
			"datetime2",
			"date",
			"datetime"
		],
		json: ["varchar", "nvarchar"]
	}
};
function matchType(columnDataType, fieldType, dbType) {
	function normalize(type) {
		return type.toLowerCase().split("(")[0].trim();
	}
	if (fieldType === "string[]" || fieldType === "number[]") return columnDataType.toLowerCase().includes("json");
	const types = map[dbType];
	return (Array.isArray(fieldType) ? types["string"].map((t) => t.toLowerCase()) : types[fieldType].map((t) => t.toLowerCase())).includes(normalize(columnDataType));
}
/**
* Get the current PostgreSQL schema (search_path) for the database connection
* Returns the first schema in the search_path, defaulting to 'public' if not found
*/
async function getPostgresSchema(db) {
	try {
		const result = await sql`SHOW search_path`.execute(db);
		const searchPath = result.rows[0]?.search_path ?? result.rows[0]?.searchPath;
		if (searchPath) return searchPath.split(",").map((s) => s.trim()).map((s) => s.replace(/^["']|["']$/g, "")).filter((s) => !s.startsWith("$") && !s.startsWith("\\$"))[0] || "public";
	} catch {}
	return "public";
}
async function getMigrations(config) {
	const betterAuthSchema = getSchema(config);
	const logger = createLogger(config.logger);
	let { kysely: db, databaseType: dbType } = await createKyselyAdapter(config);
	if (!dbType) {
		logger.warn("Could not determine database type, defaulting to sqlite. Please provide a type in the database options to avoid this.");
		dbType = "sqlite";
	}
	if (!db) {
		logger.error("Only kysely adapter is supported for migrations. You can use `generate` command to generate the schema, if you're using a different adapter.");
		process.exit(1);
	}
	let currentSchema = "public";
	if (dbType === "postgres") {
		currentSchema = await getPostgresSchema(db);
		logger.debug(`PostgreSQL migration: Using schema '${currentSchema}' (from search_path)`);
		try {
			const schemaCheck = await sql`
				SELECT schema_name
				FROM information_schema.schemata
				WHERE schema_name = ${currentSchema}
			`.execute(db);
			if (!(schemaCheck.rows[0]?.schema_name ?? schemaCheck.rows[0]?.schemaName)) logger.warn(`Schema '${currentSchema}' does not exist. Tables will be inspected from available schemas. Consider creating the schema first or checking your database configuration.`);
		} catch (error) {
			logger.debug(`Could not verify schema existence: ${error instanceof Error ? error.message : String(error)}`);
		}
	}
	const allTableMetadata = await db.introspection.getTables();
	let tableMetadata = allTableMetadata;
	if (dbType === "postgres") try {
		const tablesInSchema = await sql`
				SELECT table_name
				FROM information_schema.tables
				WHERE table_schema = ${currentSchema}
				AND table_type = 'BASE TABLE'
			`.execute(db);
		const tableNamesInSchema = new Set(tablesInSchema.rows.map((row) => row.table_name ?? row.tableName));
		tableMetadata = allTableMetadata.filter((table) => table.schema === currentSchema && tableNamesInSchema.has(table.name));
		logger.debug(`Found ${tableMetadata.length} table(s) in schema '${currentSchema}': ${tableMetadata.map((t) => t.name).join(", ") || "(none)"}`);
	} catch (error) {
		logger.warn(`Could not filter tables by schema. Using all discovered tables. Error: ${error instanceof Error ? error.message : String(error)}`);
	}
	const toBeCreated = [];
	const toBeAdded = [];
	for (const [key, value] of Object.entries(betterAuthSchema)) {
		const table = tableMetadata.find((t) => t.name === key);
		if (!table) {
			const tIndex = toBeCreated.findIndex((t) => t.table === key);
			const tableData = {
				table: key,
				fields: value.fields,
				order: value.order || Infinity
			};
			const insertIndex = toBeCreated.findIndex((t) => (t.order || Infinity) > tableData.order);
			if (insertIndex === -1) if (tIndex === -1) toBeCreated.push(tableData);
			else toBeCreated[tIndex].fields = {
				...toBeCreated[tIndex].fields,
				...value.fields
			};
			else toBeCreated.splice(insertIndex, 0, tableData);
			continue;
		}
		const toBeAddedFields = {};
		for (const [fieldName, field] of Object.entries(value.fields)) {
			const column = table.columns.find((c) => c.name === fieldName);
			if (!column) {
				toBeAddedFields[fieldName] = field;
				continue;
			}
			if (matchType(column.dataType, field.type, dbType)) continue;
			else logger.warn(`Field ${fieldName} in table ${key} has a different type in the database. Expected ${field.type} but got ${column.dataType}.`);
		}
		if (Object.keys(toBeAddedFields).length > 0) toBeAdded.push({
			table: key,
			fields: toBeAddedFields,
			order: value.order || Infinity
		});
	}
	const migrations = [];
	const useUUIDs = config.advanced?.database?.generateId === "uuid";
	const useNumberId = config.advanced?.database?.generateId === "serial";
	function getType(field, fieldName) {
		const type = field.type;
		const provider = dbType || "sqlite";
		const typeMap = {
			string: {
				sqlite: "text",
				postgres: "text",
				mysql: field.unique ? "varchar(255)" : field.references ? "varchar(36)" : field.sortable ? "varchar(255)" : field.index ? "varchar(255)" : "text",
				mssql: field.unique || field.sortable ? "varchar(255)" : field.references ? "varchar(36)" : "varchar(8000)"
			},
			boolean: {
				sqlite: "integer",
				postgres: "boolean",
				mysql: "boolean",
				mssql: "smallint"
			},
			number: {
				sqlite: field.bigint ? "bigint" : "integer",
				postgres: field.bigint ? "bigint" : "integer",
				mysql: field.bigint ? "bigint" : "integer",
				mssql: field.bigint ? "bigint" : "integer"
			},
			date: {
				sqlite: "date",
				postgres: "timestamptz",
				mysql: "timestamp(3)",
				mssql: sql`datetime2(3)`
			},
			json: {
				sqlite: "text",
				postgres: "jsonb",
				mysql: "json",
				mssql: "varchar(8000)"
			},
			id: {
				postgres: useNumberId ? sql`integer GENERATED BY DEFAULT AS IDENTITY` : useUUIDs ? "uuid" : "text",
				mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				sqlite: useNumberId ? "integer" : "text"
			},
			foreignKeyId: {
				postgres: useNumberId ? "integer" : useUUIDs ? "uuid" : "text",
				mysql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				mssql: useNumberId ? "integer" : useUUIDs ? "varchar(36)" : "varchar(36)",
				sqlite: useNumberId ? "integer" : "text"
			},
			"string[]": {
				sqlite: "text",
				postgres: "jsonb",
				mysql: "json",
				mssql: "varchar(8000)"
			},
			"number[]": {
				sqlite: "text",
				postgres: "jsonb",
				mysql: "json",
				mssql: "varchar(8000)"
			}
		};
		if (fieldName === "id" || field.references?.field === "id") {
			if (fieldName === "id") return typeMap.id[provider];
			return typeMap.foreignKeyId[provider];
		}
		if (Array.isArray(type)) return "text";
		if (!(type in typeMap)) throw new Error(`Unsupported field type '${String(type)}' for field '${fieldName}'. Allowed types are: string, number, boolean, date, string[], number[]. If you need to store structured data, store it as a JSON string (type: "string") or split it into primitive fields. See https://better-auth.com/docs/advanced/schema#additional-fields`);
		return typeMap[type][provider];
	}
	const getModelName = initGetModelName({
		schema: getAuthTables(config),
		usePlural: false
	});
	const getFieldName = initGetFieldName({
		schema: getAuthTables(config),
		usePlural: false
	});
	function getReferencePath(model, field) {
		try {
			return `${getModelName(model)}.${getFieldName({
				model,
				field
			})}`;
		} catch {
			return `${model}.${field}`;
		}
	}
	if (toBeAdded.length) for (const table of toBeAdded) for (const [fieldName, field] of Object.entries(table.fields)) {
		const type = getType(field, fieldName);
		const builder = db.schema.alterTable(table.table);
		if (field.index) {
			const indexName = `${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`;
			const indexBuilder = db.schema.createIndex(indexName).on(table.table).columns([fieldName]);
			migrations.push(field.unique ? indexBuilder.unique() : indexBuilder);
		}
		const built = builder.addColumn(fieldName, type, (col) => {
			col = field.required !== false ? col.notNull() : col;
			if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
			if (field.unique) col = col.unique();
			if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql`CURRENT_TIMESTAMP(3)`);
			else col = col.defaultTo(sql`CURRENT_TIMESTAMP`);
			return col;
		});
		migrations.push(built);
	}
	const toBeIndexed = [];
	if (toBeCreated.length) for (const table of toBeCreated) {
		const idType = getType({ type: useNumberId ? "number" : "string" }, "id");
		let dbT = db.schema.createTable(table.table).addColumn("id", idType, (col) => {
			if (useNumberId) {
				if (dbType === "postgres") return col.primaryKey().notNull();
				else if (dbType === "sqlite") return col.primaryKey().notNull();
				else if (dbType === "mssql") return col.identity().primaryKey().notNull();
				return col.autoIncrement().primaryKey().notNull();
			}
			if (useUUIDs) {
				if (dbType === "postgres") return col.primaryKey().defaultTo(sql`pg_catalog.gen_random_uuid()`).notNull();
				return col.primaryKey().notNull();
			}
			return col.primaryKey().notNull();
		});
		for (const [fieldName, field] of Object.entries(table.fields)) {
			const type = getType(field, fieldName);
			dbT = dbT.addColumn(fieldName, type, (col) => {
				col = field.required !== false ? col.notNull() : col;
				if (field.references) col = col.references(getReferencePath(field.references.model, field.references.field)).onDelete(field.references.onDelete || "cascade");
				if (field.unique) col = col.unique();
				if (field.type === "date" && typeof field.defaultValue === "function" && (dbType === "postgres" || dbType === "mysql" || dbType === "mssql")) if (dbType === "mysql") col = col.defaultTo(sql`CURRENT_TIMESTAMP(3)`);
				else col = col.defaultTo(sql`CURRENT_TIMESTAMP`);
				return col;
			});
			if (field.index) {
				const builder = db.schema.createIndex(`${table.table}_${fieldName}_${field.unique ? "uidx" : "idx"}`).on(table.table).columns([fieldName]);
				toBeIndexed.push(field.unique ? builder.unique() : builder);
			}
		}
		migrations.push(dbT);
	}
	if (toBeIndexed.length) for (const index of toBeIndexed) migrations.push(index);
	async function runMigrations() {
		for (const migration of migrations) await migration.execute();
	}
	async function compileMigrations() {
		return migrations.map((m) => m.compile().sql).join(";\n\n") + ";";
	}
	return {
		toBeCreated,
		toBeAdded,
		runMigrations,
		compileMigrations
	};
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/constants.mjs
var DEFAULT_SECRET = "better-auth-secret-12345678901234567890";
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/context/secret-utils.mjs
/**
* Estimates the entropy of a string in bits.
* This is a simple approximation that helps detect low-entropy secrets.
*/
function estimateEntropy$1(str) {
	const unique = new Set(str).size;
	if (unique === 0) return 0;
	return Math.log2(Math.pow(unique, str.length));
}
function parseSecretsEnv(envValue) {
	if (!envValue) return null;
	return envValue.split(",").map((entry) => {
		entry = entry.trim();
		const colonIdx = entry.indexOf(":");
		if (colonIdx === -1) throw new BetterAuthError(`Invalid BETTER_AUTH_SECRETS entry: "${entry}". Expected format: "<version>:<secret>"`);
		const version = parseInt(entry.slice(0, colonIdx), 10);
		if (!Number.isInteger(version) || version < 0) throw new BetterAuthError(`Invalid version in BETTER_AUTH_SECRETS: "${entry.slice(0, colonIdx)}". Version must be a non-negative integer.`);
		const value = entry.slice(colonIdx + 1).trim();
		if (!value) throw new BetterAuthError(`Empty secret value for version ${version} in BETTER_AUTH_SECRETS.`);
		return {
			version,
			value
		};
	});
}
function validateSecretsArray(secrets, logger) {
	if (secrets.length === 0) throw new BetterAuthError("`secrets` array must contain at least one entry.");
	const seen = /* @__PURE__ */ new Set();
	for (const s of secrets) {
		const version = parseInt(String(s.version), 10);
		if (!Number.isInteger(version) || version < 0 || String(version) !== String(s.version).trim()) throw new BetterAuthError(`Invalid version ${s.version} in \`secrets\`. Version must be a non-negative integer.`);
		if (!s.value) throw new BetterAuthError(`Empty secret value for version ${version} in \`secrets\`.`);
		if (seen.has(version)) throw new BetterAuthError(`Duplicate version ${version} in \`secrets\`. Each version must be unique.`);
		seen.add(version);
	}
	const current = secrets[0];
	if (current.value.length < 32) logger.warn(`[better-auth] Warning: the current secret (version ${current.version}) should be at least 32 characters long for adequate security.`);
	if (estimateEntropy$1(current.value) < 120) logger.warn("[better-auth] Warning: the current secret appears low-entropy. Use a randomly generated secret for production.");
}
function buildSecretConfig(secrets, legacySecret) {
	const keys = /* @__PURE__ */ new Map();
	for (const s of secrets) keys.set(parseInt(String(s.version), 10), s.value);
	return {
		keys,
		currentVersion: parseInt(String(secrets[0].version), 10),
		legacySecret: legacySecret && legacySecret !== "better-auth-secret-12345678901234567890" ? legacySecret : void 0
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@better-auth+telemetry@1.6.10_@better-auth+core@1.6.10_@better-auth+utils@0.4.0_@better_8bcd094fe43b6e97310e27b7b20e714f/node_modules/@better-auth/telemetry/dist/node.mjs
async function getTelemetryAuthConfig(options, context) {
	return {
		database: context?.database,
		adapter: context?.adapter,
		emailVerification: {
			sendVerificationEmail: !!options.emailVerification?.sendVerificationEmail,
			sendOnSignUp: !!options.emailVerification?.sendOnSignUp,
			sendOnSignIn: !!options.emailVerification?.sendOnSignIn,
			autoSignInAfterVerification: !!options.emailVerification?.autoSignInAfterVerification,
			expiresIn: options.emailVerification?.expiresIn,
			beforeEmailVerification: !!options.emailVerification?.beforeEmailVerification,
			afterEmailVerification: !!options.emailVerification?.afterEmailVerification
		},
		emailAndPassword: {
			enabled: !!options.emailAndPassword?.enabled,
			disableSignUp: !!options.emailAndPassword?.disableSignUp,
			requireEmailVerification: !!options.emailAndPassword?.requireEmailVerification,
			maxPasswordLength: options.emailAndPassword?.maxPasswordLength,
			minPasswordLength: options.emailAndPassword?.minPasswordLength,
			sendResetPassword: !!options.emailAndPassword?.sendResetPassword,
			resetPasswordTokenExpiresIn: options.emailAndPassword?.resetPasswordTokenExpiresIn,
			onPasswordReset: !!options.emailAndPassword?.onPasswordReset,
			password: {
				hash: !!options.emailAndPassword?.password?.hash,
				verify: !!options.emailAndPassword?.password?.verify
			},
			autoSignIn: !!options.emailAndPassword?.autoSignIn,
			revokeSessionsOnPasswordReset: !!options.emailAndPassword?.revokeSessionsOnPasswordReset
		},
		socialProviders: await Promise.all(Object.keys(options.socialProviders || {}).map(async (key) => {
			const p = options.socialProviders?.[key];
			if (!p) return {};
			const provider = typeof p === "function" ? await p() : p;
			return {
				id: key,
				mapProfileToUser: !!provider.mapProfileToUser,
				disableDefaultScope: !!provider.disableDefaultScope,
				disableIdTokenSignIn: !!provider.disableIdTokenSignIn,
				disableImplicitSignUp: provider.disableImplicitSignUp,
				disableSignUp: provider.disableSignUp,
				getUserInfo: !!provider.getUserInfo,
				overrideUserInfoOnSignIn: !!provider.overrideUserInfoOnSignIn,
				prompt: provider.prompt,
				verifyIdToken: !!provider.verifyIdToken,
				scope: provider.scope,
				refreshAccessToken: !!provider.refreshAccessToken
			};
		})),
		plugins: options.plugins?.map((p) => p.id.toString()),
		user: {
			modelName: options.user?.modelName,
			fields: options.user?.fields,
			additionalFields: options.user?.additionalFields,
			changeEmail: {
				enabled: options.user?.changeEmail?.enabled,
				sendChangeEmailConfirmation: !!options.user?.changeEmail?.sendChangeEmailConfirmation
			}
		},
		verification: {
			modelName: options.verification?.modelName,
			disableCleanup: options.verification?.disableCleanup,
			fields: options.verification?.fields
		},
		session: {
			modelName: options.session?.modelName,
			additionalFields: options.session?.additionalFields,
			cookieCache: {
				enabled: options.session?.cookieCache?.enabled,
				maxAge: options.session?.cookieCache?.maxAge,
				strategy: options.session?.cookieCache?.strategy
			},
			disableSessionRefresh: options.session?.disableSessionRefresh,
			expiresIn: options.session?.expiresIn,
			fields: options.session?.fields,
			freshAge: options.session?.freshAge,
			preserveSessionInDatabase: options.session?.preserveSessionInDatabase,
			storeSessionInDatabase: options.session?.storeSessionInDatabase,
			updateAge: options.session?.updateAge
		},
		account: {
			modelName: options.account?.modelName,
			fields: options.account?.fields,
			encryptOAuthTokens: options.account?.encryptOAuthTokens,
			updateAccountOnSignIn: options.account?.updateAccountOnSignIn,
			accountLinking: {
				enabled: options.account?.accountLinking?.enabled,
				trustedProviders: options.account?.accountLinking?.trustedProviders,
				updateUserInfoOnLink: options.account?.accountLinking?.updateUserInfoOnLink,
				allowUnlinkingAll: options.account?.accountLinking?.allowUnlinkingAll
			}
		},
		hooks: {
			after: !!options.hooks?.after,
			before: !!options.hooks?.before
		},
		secondaryStorage: !!options.secondaryStorage,
		advanced: {
			cookiePrefix: !!options.advanced?.cookiePrefix,
			cookies: !!options.advanced?.cookies,
			crossSubDomainCookies: {
				domain: !!options.advanced?.crossSubDomainCookies?.domain,
				enabled: options.advanced?.crossSubDomainCookies?.enabled,
				additionalCookies: options.advanced?.crossSubDomainCookies?.additionalCookies
			},
			database: {
				generateId: options.advanced?.database?.generateId,
				defaultFindManyLimit: options.advanced?.database?.defaultFindManyLimit
			},
			useSecureCookies: options.advanced?.useSecureCookies,
			ipAddress: {
				disableIpTracking: options.advanced?.ipAddress?.disableIpTracking,
				ipAddressHeaders: options.advanced?.ipAddress?.ipAddressHeaders
			},
			disableCSRFCheck: options.advanced?.disableCSRFCheck,
			cookieAttributes: {
				expires: options.advanced?.defaultCookieAttributes?.expires,
				secure: options.advanced?.defaultCookieAttributes?.secure,
				sameSite: options.advanced?.defaultCookieAttributes?.sameSite,
				domain: !!options.advanced?.defaultCookieAttributes?.domain,
				path: options.advanced?.defaultCookieAttributes?.path,
				httpOnly: options.advanced?.defaultCookieAttributes?.httpOnly
			}
		},
		trustedOrigins: options.trustedOrigins?.length,
		rateLimit: {
			storage: options.rateLimit?.storage,
			modelName: options.rateLimit?.modelName,
			window: options.rateLimit?.window,
			customStorage: !!options.rateLimit?.customStorage,
			enabled: options.rateLimit?.enabled,
			max: options.rateLimit?.max
		},
		onAPIError: {
			errorURL: options.onAPIError?.errorURL,
			onError: !!options.onAPIError?.onError,
			throw: options.onAPIError?.throw
		},
		logger: {
			disabled: options.logger?.disabled,
			level: options.logger?.level,
			log: !!options.logger?.log
		},
		databaseHooks: {
			user: {
				create: {
					after: !!options.databaseHooks?.user?.create?.after,
					before: !!options.databaseHooks?.user?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.user?.update?.after,
					before: !!options.databaseHooks?.user?.update?.before
				}
			},
			session: {
				create: {
					after: !!options.databaseHooks?.session?.create?.after,
					before: !!options.databaseHooks?.session?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.session?.update?.after,
					before: !!options.databaseHooks?.session?.update?.before
				}
			},
			account: {
				create: {
					after: !!options.databaseHooks?.account?.create?.after,
					before: !!options.databaseHooks?.account?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.account?.update?.after,
					before: !!options.databaseHooks?.account?.update?.before
				}
			},
			verification: {
				create: {
					after: !!options.databaseHooks?.verification?.create?.after,
					before: !!options.databaseHooks?.verification?.create?.before
				},
				update: {
					after: !!options.databaseHooks?.verification?.update?.after,
					before: !!options.databaseHooks?.verification?.update?.before
				}
			}
		}
	};
}
function detectPackageManager() {
	const userAgent = env.npm_config_user_agent;
	if (!userAgent) return;
	const pmSpec = userAgent.split(" ")[0];
	const separatorPos = pmSpec.lastIndexOf("/");
	const name = pmSpec.substring(0, separatorPos);
	return {
		name: name === "npminstall" ? "cnpm" : name,
		version: pmSpec.substring(separatorPos + 1)
	};
}
function isCI() {
	return env.CI !== "false" && ("BUILD_ID" in env || "BUILD_NUMBER" in env || "CI" in env || "CI_APP_ID" in env || "CI_BUILD_ID" in env || "CI_BUILD_NUMBER" in env || "CI_NAME" in env || "CONTINUOUS_INTEGRATION" in env || "RUN_ID" in env);
}
function detectRuntime() {
	if (typeof Deno !== "undefined") return {
		name: "deno",
		version: Deno?.version?.deno ?? null
	};
	if (typeof Bun !== "undefined") return {
		name: "bun",
		version: Bun?.version ?? null
	};
	if (typeof process !== "undefined" && process?.versions?.node) return {
		name: "node",
		version: process.versions.node ?? null
	};
	return {
		name: "edge",
		version: null
	};
}
function detectEnvironment() {
	return getEnvVar("NODE_ENV") === "production" ? "production" : isCI() ? "ci" : isTest() ? "test" : "development";
}
async function hashToBase64(data) {
	const buffer = await createHash$1("SHA-256").digest(data);
	return base64.encode(buffer);
}
var generateId = (size) => {
	return createRandomStringGenerator("a-z", "A-Z", "0-9")(size || 32);
};
var packageJSONCache;
async function readRootPackageJson() {
	if (packageJSONCache) return packageJSONCache;
	try {
		const cwd = process.cwd();
		if (!cwd) return void 0;
		const raw = await fsPromises.readFile(nodePath.join(cwd, "package.json"), "utf-8");
		packageJSONCache = JSON.parse(raw);
		return packageJSONCache;
	} catch {}
}
async function getPackageVersion(pkg) {
	if (packageJSONCache) return packageJSONCache.dependencies?.[pkg] || packageJSONCache.devDependencies?.[pkg] || packageJSONCache.peerDependencies?.[pkg];
	try {
		const cwd = process.cwd();
		if (!cwd) throw new Error("no-cwd");
		const pkgJsonPath = nodePath.join(cwd, "node_modules", pkg, "package.json");
		const raw = await fsPromises.readFile(pkgJsonPath, "utf-8");
		return JSON.parse(raw).version || await getVersionFromLocalPackageJson(pkg) || void 0;
	} catch {}
	return getVersionFromLocalPackageJson(pkg);
}
async function getVersionFromLocalPackageJson(pkg) {
	const json = await readRootPackageJson();
	if (!json) return void 0;
	return {
		...json.dependencies,
		...json.devDependencies,
		...json.peerDependencies
	}[pkg];
}
async function getNameFromLocalPackageJson() {
	return (await readRootPackageJson())?.name;
}
async function detectSystemInfo() {
	try {
		const cpus = os.cpus();
		return {
			deploymentVendor: getVendor(),
			systemPlatform: os.platform(),
			systemRelease: os.release(),
			systemArchitecture: os.arch(),
			cpuCount: cpus.length,
			cpuModel: cpus.length ? cpus[0].model : null,
			cpuSpeed: cpus.length ? cpus[0].speed : null,
			memory: os.totalmem(),
			isWSL: await isWsl(),
			isDocker: await isDocker(),
			isTTY: process.stdout ? process.stdout.isTTY : null
		};
	} catch {
		return {
			systemPlatform: null,
			systemRelease: null,
			systemArchitecture: null,
			cpuCount: null,
			cpuModel: null,
			cpuSpeed: null,
			memory: null,
			isWSL: null,
			isDocker: null,
			isTTY: null
		};
	}
}
function getVendor() {
	const env = process.env;
	const hasAny = (...keys) => keys.some((k) => Boolean(env[k]));
	if (hasAny("CF_PAGES", "CF_PAGES_URL", "CF_ACCOUNT_ID") || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers") return "cloudflare";
	if (hasAny("VERCEL", "VERCEL_URL", "VERCEL_ENV")) return "vercel";
	if (hasAny("NETLIFY", "NETLIFY_URL")) return "netlify";
	if (hasAny("RENDER", "RENDER_URL", "RENDER_INTERNAL_HOSTNAME", "RENDER_SERVICE_ID")) return "render";
	if (hasAny("AWS_LAMBDA_FUNCTION_NAME", "AWS_EXECUTION_ENV", "LAMBDA_TASK_ROOT")) return "aws";
	if (hasAny("GOOGLE_CLOUD_FUNCTION_NAME", "GOOGLE_CLOUD_PROJECT", "GCP_PROJECT", "K_SERVICE")) return "gcp";
	if (hasAny("AZURE_FUNCTION_NAME", "FUNCTIONS_WORKER_RUNTIME", "WEBSITE_INSTANCE_ID", "WEBSITE_SITE_NAME")) return "azure";
	if (hasAny("DENO_DEPLOYMENT_ID", "DENO_REGION")) return "deno-deploy";
	if (hasAny("FLY_APP_NAME", "FLY_REGION", "FLY_ALLOC_ID")) return "fly-io";
	if (hasAny("RAILWAY_STATIC_URL", "RAILWAY_ENVIRONMENT_NAME")) return "railway";
	if (hasAny("DYNO", "HEROKU_APP_NAME")) return "heroku";
	if (hasAny("DO_DEPLOYMENT_ID", "DO_APP_NAME", "DIGITALOCEAN")) return "digitalocean";
	if (hasAny("KOYEB", "KOYEB_DEPLOYMENT_ID", "KOYEB_APP_NAME")) return "koyeb";
	return null;
}
var isDockerCached;
async function hasDockerEnv() {
	try {
		fs.statSync("/.dockerenv");
		return true;
	} catch {
		return false;
	}
}
async function hasDockerCGroup() {
	try {
		return fs.readFileSync("/proc/self/cgroup", "utf8").includes("docker");
	} catch {
		return false;
	}
}
async function isDocker() {
	if (isDockerCached === void 0) isDockerCached = await hasDockerEnv() || await hasDockerCGroup();
	return isDockerCached;
}
var isInsideContainerCached;
var hasContainerEnv = async () => {
	try {
		fs.statSync("/run/.containerenv");
		return true;
	} catch {
		return false;
	}
};
async function isInsideContainer() {
	if (isInsideContainerCached === void 0) isInsideContainerCached = await hasContainerEnv() || await isDocker();
	return isInsideContainerCached;
}
async function isWsl() {
	try {
		if (process.platform !== "linux") return false;
		if (os.release().toLowerCase().includes("microsoft")) {
			if (await isInsideContainer()) return false;
			return true;
		}
		return fs.readFileSync("/proc/version", "utf8").toLowerCase().includes("microsoft") ? !await isInsideContainer() : false;
	} catch {
		return false;
	}
}
var projectIdCached = null;
async function getProjectId(baseUrl) {
	if (projectIdCached) return projectIdCached;
	const projectName = await getNameFromLocalPackageJson();
	if (projectName) {
		projectIdCached = await hashToBase64(baseUrl ? baseUrl + projectName : projectName);
		return projectIdCached;
	}
	if (baseUrl) {
		projectIdCached = await hashToBase64(baseUrl);
		return projectIdCached;
	}
	projectIdCached = generateId(32);
	return projectIdCached;
}
async function detectDatabaseNode() {
	for (const [pkg, name] of Object.entries({
		pg: "postgresql",
		mysql: "mysql",
		mariadb: "mariadb",
		sqlite3: "sqlite",
		"better-sqlite3": "sqlite",
		"@prisma/client": "prisma",
		mongoose: "mongodb",
		mongodb: "mongodb",
		"drizzle-orm": "drizzle"
	})) {
		const version = await getPackageVersion(pkg);
		if (version) return {
			name,
			version
		};
	}
}
async function detectFrameworkNode() {
	for (const [pkg, name] of Object.entries({
		next: "next",
		nuxt: "nuxt",
		"react-router": "react-router",
		astro: "astro",
		"@sveltejs/kit": "sveltekit",
		"solid-start": "solid-start",
		"tanstack-start": "tanstack-start",
		hono: "hono",
		express: "express",
		elysia: "elysia",
		expo: "expo"
	})) {
		const version = await getPackageVersion(pkg);
		if (version) return {
			name,
			version
		};
	}
}
var noop = async function noop() {};
async function createTelemetry(options, context) {
	const debugEnabled = options.telemetry?.debug || getBooleanEnvVar("BETTER_AUTH_TELEMETRY_DEBUG", false);
	const telemetryEndpoint = ENV.BETTER_AUTH_TELEMETRY_ENDPOINT;
	if (!telemetryEndpoint && !context?.customTrack) return { publish: noop };
	const track = async (event) => {
		if (context?.customTrack) await context.customTrack(event).catch(logger.error);
		else if (telemetryEndpoint) if (debugEnabled) logger.info("telemetry event", JSON.stringify(event, null, 2));
		else await betterFetch(telemetryEndpoint, {
			method: "POST",
			body: event
		}).catch(logger.error);
	};
	const isEnabled = async () => {
		const telemetryEnabled = options.telemetry?.enabled !== void 0 ? options.telemetry.enabled : false;
		return (getBooleanEnvVar("BETTER_AUTH_TELEMETRY", false) || telemetryEnabled) && (context?.skipTestCheck || !isTest());
	};
	const enabled = await isEnabled();
	let anonymousId;
	if (enabled) {
		anonymousId = await getProjectId(typeof options.baseURL === "string" ? options.baseURL : void 0);
		track({
			type: "init",
			payload: {
				config: await getTelemetryAuthConfig(options, context),
				runtime: detectRuntime(),
				database: await detectDatabaseNode(),
				framework: await detectFrameworkNode(),
				environment: detectEnvironment(),
				systemInfo: await detectSystemInfo(),
				packageManager: detectPackageManager()
			},
			anonymousId
		});
	}
	return { publish: async (event) => {
		if (!enabled) return;
		if (!anonymousId) anonymousId = await getProjectId(typeof options.baseURL === "string" ? options.baseURL : void 0);
		await track({
			type: event.type,
			payload: event.payload,
			anonymousId
		});
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/context/create-context.mjs
/**
* Estimates the entropy of a string in bits.
* This is a simple approximation that helps detect low-entropy secrets.
*/
function estimateEntropy(str) {
	const unique = new Set(str).size;
	if (unique === 0) return 0;
	return Math.log2(Math.pow(unique, str.length));
}
/**
* Validates that the secret meets minimum security requirements.
* Throws BetterAuthError if the secret is invalid.
* Skips validation for DEFAULT_SECRET in test environments only.
* Only throws for DEFAULT_SECRET in production environment.
*/
function validateSecret(secret, logger) {
	const isDefaultSecret = secret === DEFAULT_SECRET;
	if (isTest()) return;
	if (isDefaultSecret && isProduction) throw new BetterAuthError("You are using the default secret. Please set `BETTER_AUTH_SECRET` in your environment variables or pass `secret` in your auth config.");
	if (!secret) throw new BetterAuthError("BETTER_AUTH_SECRET is missing. Set it in your environment or pass `secret` to betterAuth({ secret }).");
	if (secret.length < 32) logger.warn(`[better-auth] Warning: your BETTER_AUTH_SECRET should be at least 32 characters long for adequate security. Generate one with \`npx auth secret\` or \`openssl rand -base64 32\`.`);
	if (estimateEntropy(secret) < 120) logger.warn("[better-auth] Warning: your BETTER_AUTH_SECRET appears low-entropy. Use a randomly generated secret for production.");
}
async function createAuthContext(adapter, options, getDatabaseType) {
	if (!options.database) options = defu(options, {
		session: { cookieCache: {
			enabled: true,
			strategy: "jwe",
			refreshCache: true,
			maxAge: options.session?.expiresIn || 3600 * 24 * 7
		} },
		account: {
			storeStateStrategy: "cookie",
			storeAccountCookie: true
		}
	});
	const plugins = options.plugins || [];
	const internalPlugins = getInternalPlugins(options);
	const logger = createLogger(options.logger);
	const isDynamicConfig = isDynamicBaseURLConfig(options.baseURL);
	if (isDynamicBaseURLConfig(options.baseURL)) {
		const { allowedHosts } = options.baseURL;
		if (!allowedHosts || allowedHosts.length === 0) throw new BetterAuthError("baseURL.allowedHosts cannot be empty. Provide at least one allowed host pattern (e.g., [\"myapp.com\", \"*.vercel.app\"]).");
	}
	const baseURL = isDynamicConfig ? void 0 : getBaseURL(typeof options.baseURL === "string" ? options.baseURL : void 0, options.basePath);
	if (!baseURL && !isDynamicConfig) logger.warn(`[better-auth] Base URL could not be determined. Please set a valid base URL using the baseURL config option or the BETTER_AUTH_URL environment variable. Without this, callbacks and redirects may not work correctly.`);
	if (adapter.id === "memory" && options.advanced?.database?.generateId === false) logger.error(`[better-auth] Misconfiguration detected.
You are using the memory DB with generateId: false.
This will cause no id to be generated for any model.
Most of the features of Better Auth will not work correctly.`);
	const secretsArray = options.secrets ?? parseSecretsEnv(env.BETTER_AUTH_SECRETS);
	const legacySecret = options.secret || env.BETTER_AUTH_SECRET || env.AUTH_SECRET || "";
	let secret;
	let secretConfig;
	if (secretsArray) {
		validateSecretsArray(secretsArray, logger);
		secret = secretsArray[0].value;
		secretConfig = buildSecretConfig(secretsArray, legacySecret);
	} else {
		secret = legacySecret || "better-auth-secret-12345678901234567890";
		validateSecret(secret, logger);
		secretConfig = secret;
	}
	options = {
		...options,
		secret,
		baseURL: isDynamicConfig ? options.baseURL : baseURL ? new URL(baseURL).origin : "",
		basePath: options.basePath || "/api/auth",
		plugins: plugins.concat(internalPlugins)
	};
	checkEndpointConflicts(options, logger);
	const cookies = getCookies(options);
	const tables = getAuthTables(options);
	const providers = (await Promise.all(Object.entries(options.socialProviders || {}).map(async ([key, originalConfig]) => {
		const config = typeof originalConfig === "function" ? await originalConfig() : originalConfig;
		if (config == null) return null;
		if (config.enabled === false) return null;
		if (!config.clientId) logger.warn(`Social provider ${key} is missing clientId or clientSecret`);
		const provider = socialProviders[key](config);
		provider.disableImplicitSignUp = config.disableImplicitSignUp;
		return provider;
	}))).filter((x) => x !== null);
	const generateIdFunc = ({ model, size }) => {
		if (typeof options.advanced?.generateId === "function") return options.advanced.generateId({
			model,
			size
		});
		const dbGenerateId = options?.advanced?.database?.generateId;
		if (typeof dbGenerateId === "function") return dbGenerateId({
			model,
			size
		});
		if (dbGenerateId === "uuid") return crypto.randomUUID();
		if (dbGenerateId === "serial" || dbGenerateId === false) return false;
		return generateId$1(size);
	};
	const { publish } = await createTelemetry(options, {
		adapter: adapter.id,
		database: typeof options.database === "function" ? "adapter" : getDatabaseType(options.database)
	});
	const pluginIds = new Set(options.plugins.map((p) => p.id));
	const getPluginFn = (id) => options.plugins.find((p) => p.id === id) ?? null;
	const hasPluginFn = (id) => pluginIds.has(id);
	const trustedOrigins = await getTrustedOrigins(options);
	const trustedProviders = await getTrustedProviders(options);
	const ctx = {
		appName: options.appName || "Better Auth",
		baseURL: baseURL || "",
		version: getBetterAuthVersion(),
		socialProviders: providers,
		options,
		oauthConfig: {
			storeStateStrategy: options.account?.storeStateStrategy || (options.database ? "database" : "cookie"),
			skipStateCookieCheck: !!options.account?.skipStateCookieCheck
		},
		tables,
		trustedOrigins,
		trustedProviders,
		isTrustedOrigin(url, settings) {
			return this.trustedOrigins.some((origin) => matchesOriginPattern(url, origin, settings));
		},
		sessionConfig: {
			updateAge: options.session?.updateAge !== void 0 ? options.session.updateAge : 1440 * 60,
			expiresIn: options.session?.expiresIn || 3600 * 24 * 7,
			freshAge: options.session?.freshAge === void 0 ? 3600 * 24 : options.session.freshAge,
			cookieRefreshCache: (() => {
				const refreshCache = options.session?.cookieCache?.refreshCache;
				const maxAge = options.session?.cookieCache?.maxAge || 300;
				if ((!!options.database || !!options.secondaryStorage) && refreshCache) {
					logger.warn("[better-auth] `session.cookieCache.refreshCache` is enabled while `database` or `secondaryStorage` is configured. `refreshCache` is meant for stateless (DB-less) setups. Disabling `refreshCache` — remove it from your config to silence this warning.");
					return false;
				}
				if (refreshCache === false || refreshCache === void 0) return false;
				if (refreshCache === true) return {
					enabled: true,
					updateAge: Math.floor(maxAge * .2)
				};
				return {
					enabled: true,
					updateAge: refreshCache.updateAge !== void 0 ? refreshCache.updateAge : Math.floor(maxAge * .2)
				};
			})()
		},
		secret,
		secretConfig,
		rateLimit: {
			...options.rateLimit,
			enabled: options.rateLimit?.enabled ?? isProduction,
			window: options.rateLimit?.window || 10,
			max: options.rateLimit?.max || 100,
			storage: options.rateLimit?.storage || (options.secondaryStorage ? "secondary-storage" : "memory")
		},
		authCookies: cookies,
		logger,
		generateId: generateIdFunc,
		session: null,
		secondaryStorage: options.secondaryStorage,
		password: {
			hash: options.emailAndPassword?.password?.hash || hashPassword$1,
			verify: options.emailAndPassword?.password?.verify || verifyPassword$1,
			config: {
				minPasswordLength: options.emailAndPassword?.minPasswordLength || 8,
				maxPasswordLength: options.emailAndPassword?.maxPasswordLength || 128
			},
			checkPassword
		},
		setNewSession(session) {
			this.newSession = session;
		},
		newSession: null,
		adapter,
		internalAdapter: createInternalAdapter(adapter, {
			options,
			logger,
			hooks: options.databaseHooks ? [{
				source: "user",
				hooks: options.databaseHooks
			}] : [],
			generateId: generateIdFunc
		}),
		createAuthCookie: createCookieGetter(options),
		async runMigrations() {
			throw new BetterAuthError("runMigrations will be set by the specific init implementation");
		},
		publishTelemetry: publish,
		skipCSRFCheck: !!options.advanced?.disableCSRFCheck,
		skipOriginCheck: options.advanced?.disableOriginCheck !== void 0 ? options.advanced.disableOriginCheck : isTest() ? true : false,
		runInBackground: options.advanced?.backgroundTasks?.handler ?? ((p) => {
			p.catch(() => {});
		}),
		async runInBackgroundOrAwait(promise) {
			try {
				if (options.advanced?.backgroundTasks?.handler) {
					if (promise instanceof Promise) options.advanced.backgroundTasks.handler(promise.catch((e) => {
						logger.error("Failed to run background task:", e);
					}));
				} else await promise;
			} catch (e) {
				logger.error("Failed to run background task:", e);
			}
		},
		getPlugin: getPluginFn,
		hasPlugin: hasPluginFn
	};
	const initOrPromise = runPluginInit(ctx);
	if (isPromise(initOrPromise)) await initOrPromise;
	return ctx;
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/context/init.mjs
var init = async (options) => {
	const adapter = await getAdapter(options);
	const getDatabaseType = (database) => getKyselyDatabaseType(database) || "unknown";
	const ctx = await createAuthContext(adapter, options, getDatabaseType);
	ctx.runMigrations = async function() {
		if (!options.database || "updateMany" in options.database) throw new BetterAuthError("Database is not provided or it's an adapter. Migrations are only supported with a database instance.");
		const { runMigrations } = await getMigrations(options);
		await runMigrations();
	};
	return ctx;
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/auth/base.mjs
var createBetterAuth = (options, initFn) => {
	const authContext = initFn(options);
	const { api } = getEndpoints(authContext, options);
	return {
		handler: async (request) => {
			const ctx = await authContext;
			const basePath = ctx.options.basePath || "/api/auth";
			let handlerCtx;
			if (isDynamicBaseURLConfig(options.baseURL)) handlerCtx = await resolveRequestContext(ctx, request, resolveDynamicTrustedProxyHeaders(ctx.options));
			else {
				handlerCtx = ctx;
				if (!ctx.options.baseURL) {
					const baseURL = getBaseURL(void 0, basePath, request, void 0, ctx.options.advanced?.trustedProxyHeaders);
					if (baseURL) {
						ctx.baseURL = baseURL;
						ctx.options.baseURL = getOrigin$1(ctx.baseURL) || void 0;
					} else throw new BetterAuthError("Could not get base URL from request. Please provide a valid base URL.");
				}
				handlerCtx.trustedOrigins = await getTrustedOrigins(ctx.options, request);
				handlerCtx.trustedProviders = await getTrustedProviders(ctx.options, request);
			}
			const { handler } = router(handlerCtx, options);
			return runWithAdapter(handlerCtx.adapter, () => handler(request));
		},
		api,
		options,
		$context: authContext,
		$ERROR_CODES: {
			...options.plugins?.reduce((acc, plugin) => {
				if (plugin.$ERROR_CODES) return {
					...acc,
					...plugin.$ERROR_CODES
				};
				return acc;
			}, {}),
			...BASE_ERROR_CODES
		}
	};
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/auth/full.mjs
/**
* Better Auth initializer for full mode (with Kysely)
*
* @example
* ```ts
* import { betterAuth } from "better-auth";
*
* const auth = betterAuth({
* 	database: new PostgresDialect({ connection: process.env.DATABASE_URL }),
* });
* ```
*
* For minimal mode (without Kysely), import from `better-auth/minimal` instead
* @example
* ```ts
* import { betterAuth } from "better-auth/minimal";
*
* const auth = betterAuth({
*	  database: drizzleAdapter(db, { provider: "pg" }),
* });
*/
var betterAuth = (options) => {
	return createBetterAuth(options, init);
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/client/parser.mjs
var PROTO_POLLUTION_PATTERNS = {
	proto: /"(?:_|\\u0{2}5[Ff]){2}(?:p|\\u0{2}70)(?:r|\\u0{2}72)(?:o|\\u0{2}6[Ff])(?:t|\\u0{2}74)(?:o|\\u0{2}6[Ff])(?:_|\\u0{2}5[Ff]){2}"\s*:/,
	constructor: /"(?:c|\\u0063)(?:o|\\u006[Ff])(?:n|\\u006[Ee])(?:s|\\u0073)(?:t|\\u0074)(?:r|\\u0072)(?:u|\\u0075)(?:c|\\u0063)(?:t|\\u0074)(?:o|\\u006[Ff])(?:r|\\u0072)"\s*:/,
	protoShort: /"__proto__"\s*:/,
	constructorShort: /"constructor"\s*:/
};
var JSON_SIGNATURE = /^\s*["[{]|^\s*-?\d{1,16}(\.\d{1,17})?([Ee][+-]?\d+)?\s*$/;
var SPECIAL_VALUES = {
	true: true,
	false: false,
	null: null,
	undefined: void 0,
	nan: NaN,
	infinity: Number.POSITIVE_INFINITY,
	"-infinity": Number.NEGATIVE_INFINITY
};
var ISO_DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2})(?:\.(\d{1,7}))?(?:Z|([+-])(\d{2}):(\d{2}))$/;
function isValidDate(date) {
	return date instanceof Date && !isNaN(date.getTime());
}
function parseISODate(value) {
	const match = ISO_DATE_REGEX.exec(value);
	if (!match) return null;
	const [, year, month, day, hour, minute, second, ms, offsetSign, offsetHour, offsetMinute] = match;
	const date = new Date(Date.UTC(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10), parseInt(hour, 10), parseInt(minute, 10), parseInt(second, 10), ms ? parseInt(ms.padEnd(3, "0"), 10) : 0));
	if (offsetSign) {
		const offset = (parseInt(offsetHour, 10) * 60 + parseInt(offsetMinute, 10)) * (offsetSign === "+" ? -1 : 1);
		date.setUTCMinutes(date.getUTCMinutes() + offset);
	}
	return isValidDate(date) ? date : null;
}
function betterJSONParse(value, options = {}) {
	const { strict = false, warnings = false, reviver, parseDates = true } = options;
	if (typeof value !== "string") return value;
	const trimmed = value.trim();
	if (trimmed.length > 0 && trimmed[0] === "\"" && trimmed.endsWith("\"") && !trimmed.slice(1, -1).includes("\"")) return trimmed.slice(1, -1);
	const lowerValue = trimmed.toLowerCase();
	if (lowerValue.length <= 9 && lowerValue in SPECIAL_VALUES) return SPECIAL_VALUES[lowerValue];
	if (!JSON_SIGNATURE.test(trimmed)) {
		if (strict) throw new SyntaxError("[better-json] Invalid JSON");
		return value;
	}
	if (Object.entries(PROTO_POLLUTION_PATTERNS).some(([key, pattern]) => {
		const matches = pattern.test(trimmed);
		if (matches && warnings) console.warn(`[better-json] Detected potential prototype pollution attempt using ${key} pattern`);
		return matches;
	}) && strict) throw new Error("[better-json] Potential prototype pollution attempt detected");
	try {
		const secureReviver = (key, value) => {
			if (key === "__proto__" || key === "constructor" && value && typeof value === "object" && "prototype" in value) {
				if (warnings) console.warn(`[better-json] Dropping "${key}" key to prevent prototype pollution`);
				return;
			}
			if (parseDates && typeof value === "string") {
				const date = parseISODate(value);
				if (date) return date;
			}
			return reviver ? reviver(key, value) : value;
		};
		return JSON.parse(trimmed, secureReviver);
	} catch (error) {
		if (strict) throw error;
		return value;
	}
}
function parseJSON(value, options = { strict: true }) {
	return betterJSONParse(value, options);
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/adapter.mjs
var getOrgAdapter = (context, options) => {
	const baseAdapter = context.adapter;
	const orgAdditionalFields = options?.schema?.organization?.additionalFields;
	const memberAdditionalFields = options?.schema?.member?.additionalFields;
	const invitationAdditionalFields = options?.schema?.invitation?.additionalFields;
	const teamAdditionalFields = options?.schema?.team?.additionalFields;
	return {
		findOrganizationBySlug: async (slug) => {
			return filterOutputFields(await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "organization",
				where: [{
					field: "slug",
					value: slug
				}]
			}), orgAdditionalFields);
		},
		createOrganization: async (data) => {
			const organization = await (await getCurrentAdapter(baseAdapter)).create({
				model: "organization",
				data: {
					...data.organization,
					metadata: data.organization.metadata ? JSON.stringify(data.organization.metadata) : void 0
				},
				forceAllowId: true
			});
			return filterOutputFields({
				...organization,
				metadata: organization.metadata && typeof organization.metadata === "string" ? JSON.parse(organization.metadata) : void 0
			}, orgAdditionalFields);
		},
		findMemberByEmail: async (data) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			const user = await adapter.findOne({
				model: "user",
				where: [{
					field: "email",
					value: data.email.toLowerCase()
				}]
			});
			if (!user) return null;
			const member = await adapter.findOne({
				model: "member",
				where: [{
					field: "organizationId",
					value: data.organizationId
				}, {
					field: "userId",
					value: user.id
				}]
			});
			if (!member) return null;
			return {
				...member,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image
				}
			};
		},
		listMembers: async (data) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			const members = await Promise.all([adapter.findMany({
				model: "member",
				where: [{
					field: "organizationId",
					value: data.organizationId
				}, ...data.filter?.field ? [{
					field: data.filter?.field,
					value: data.filter?.value,
					...data.filter.operator ? { operator: data.filter.operator } : {}
				}] : []],
				limit: data.limit || (typeof options?.membershipLimit === "number" ? options.membershipLimit : 100) || 100,
				offset: data.offset || 0,
				sortBy: data.sortBy ? {
					field: data.sortBy,
					direction: data.sortOrder || "asc"
				} : void 0
			}), adapter.count({
				model: "member",
				where: [{
					field: "organizationId",
					value: data.organizationId
				}, ...data.filter?.field ? [{
					field: data.filter?.field,
					value: data.filter?.value,
					...data.filter.operator ? { operator: data.filter.operator } : {}
				}] : []]
			})]);
			const users = await adapter.findMany({
				model: "user",
				where: [{
					field: "id",
					value: members[0].map((member) => member.userId),
					operator: "in"
				}]
			});
			return {
				members: members[0].map((member) => {
					const user = users.find((user) => user.id === member.userId);
					if (!user) throw new BetterAuthError("Unexpected error: User not found for member");
					return {
						...member,
						user: {
							id: user.id,
							name: user.name,
							email: user.email,
							image: user.image
						}
					};
				}),
				total: members[1]
			};
		},
		findMemberByOrgId: async (data) => {
			const result = await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "member",
				where: [{
					field: "userId",
					value: data.userId
				}, {
					field: "organizationId",
					value: data.organizationId
				}],
				join: { user: true }
			});
			if (!result || !result.user) return null;
			const { user, ...member } = result;
			return {
				...member,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image
				}
			};
		},
		findMemberById: async (memberId) => {
			const result = await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "member",
				where: [{
					field: "id",
					value: memberId
				}],
				join: { user: true }
			});
			if (!result) return null;
			const { user, ...member } = result;
			return {
				...member,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					image: user.image
				}
			};
		},
		createMember: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).create({
				model: "member",
				data: {
					...data,
					createdAt: /* @__PURE__ */ new Date()
				}
			});
		},
		updateMember: async (memberId, role) => {
			return await (await getCurrentAdapter(baseAdapter)).update({
				model: "member",
				where: [{
					field: "id",
					value: memberId
				}],
				update: { role }
			});
		},
		deleteMember: async ({ memberId, organizationId, userId: _userId }) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			let userId;
			if (!_userId) {
				const member = await adapter.findOne({
					model: "member",
					where: [{
						field: "id",
						value: memberId
					}]
				});
				if (!member) throw new BetterAuthError("Member not found");
				userId = member.userId;
			} else userId = _userId;
			const member = await adapter.delete({
				model: "member",
				where: [{
					field: "id",
					value: memberId
				}]
			});
			if (options?.teams?.enabled) {
				const teams = await adapter.findMany({
					model: "team",
					where: [{
						field: "organizationId",
						value: organizationId
					}]
				});
				await Promise.all(teams.map((team) => adapter.deleteMany({
					model: "teamMember",
					where: [{
						field: "teamId",
						value: team.id
					}, {
						field: "userId",
						value: userId
					}]
				})));
			}
			return member;
		},
		updateOrganization: async (organizationId, data) => {
			const organization = await (await getCurrentAdapter(baseAdapter)).update({
				model: "organization",
				where: [{
					field: "id",
					value: organizationId
				}],
				update: {
					...data,
					metadata: typeof data.metadata === "object" ? JSON.stringify(data.metadata) : data.metadata
				}
			});
			if (!organization) return null;
			return filterOutputFields({
				...organization,
				metadata: organization.metadata ? parseJSON(organization.metadata) : void 0
			}, orgAdditionalFields);
		},
		deleteOrganization: async (organizationId) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			await adapter.deleteMany({
				model: "member",
				where: [{
					field: "organizationId",
					value: organizationId
				}]
			});
			await adapter.deleteMany({
				model: "invitation",
				where: [{
					field: "organizationId",
					value: organizationId
				}]
			});
			await adapter.delete({
				model: "organization",
				where: [{
					field: "id",
					value: organizationId
				}]
			});
			return organizationId;
		},
		setActiveOrganization: async (sessionToken, organizationId, ctx) => {
			return await context.internalAdapter.updateSession(sessionToken, { activeOrganizationId: organizationId });
		},
		findOrganizationById: async (organizationId) => {
			return filterOutputFields(await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "organization",
				where: [{
					field: "id",
					value: organizationId
				}]
			}), orgAdditionalFields);
		},
		checkMembership: async ({ userId, organizationId }) => {
			return await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "member",
				where: [{
					field: "userId",
					value: userId
				}, {
					field: "organizationId",
					value: organizationId
				}]
			});
		},
		findFullOrganization: async ({ organizationId, isSlug, includeTeams, membersLimit }) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			const result = await adapter.findOne({
				model: "organization",
				where: [{
					field: isSlug ? "slug" : "id",
					value: organizationId
				}],
				join: {
					invitation: true,
					member: membersLimit ? { limit: membersLimit } : true,
					...includeTeams ? { team: true } : {}
				}
			});
			if (!result) return null;
			const { invitation: invitations, member: members, team: teams, ...org } = result;
			const userIds = members.map((member) => member.userId);
			const users = userIds.length > 0 ? await adapter.findMany({
				model: "user",
				where: [{
					field: "id",
					value: userIds,
					operator: "in"
				}],
				limit: (typeof options?.membershipLimit === "number" ? options.membershipLimit : 100) || 100
			}) : [];
			const userMap = new Map(users.map((user) => [user.id, user]));
			const membersWithUsers = members.map((member) => {
				const user = userMap.get(member.userId);
				if (!user) throw new BetterAuthError("Unexpected error: User not found for member");
				return {
					...filterOutputFields(member, memberAdditionalFields),
					user: {
						id: user.id,
						name: user.name,
						email: user.email,
						image: user.image
					}
				};
			});
			const filteredOrg = filterOutputFields(org, orgAdditionalFields);
			const filteredInvitations = invitations.map((inv) => filterOutputFields(inv, invitationAdditionalFields));
			const filteredTeams = teams?.map((team) => filterOutputFields(team, teamAdditionalFields));
			return {
				...filteredOrg,
				invitations: filteredInvitations,
				members: membersWithUsers,
				teams: filteredTeams
			};
		},
		listOrganizations: async (userId) => {
			const result = await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "member",
				where: [{
					field: "userId",
					value: userId
				}],
				join: { organization: true }
			});
			if (!result || result.length === 0) return [];
			return result.map((member) => filterOutputFields(member.organization, orgAdditionalFields));
		},
		createTeam: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).create({
				model: "team",
				data,
				forceAllowId: true
			});
		},
		findTeamById: async ({ teamId, organizationId, includeTeamMembers }) => {
			const result = await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "team",
				where: [{
					field: "id",
					value: teamId
				}, ...organizationId ? [{
					field: "organizationId",
					value: organizationId
				}] : []],
				join: { ...includeTeamMembers ? { teamMember: true } : {} }
			});
			if (!result) return null;
			const { teamMember, ...team } = result;
			return {
				...team,
				...includeTeamMembers ? { members: teamMember } : {}
			};
		},
		updateTeam: async (teamId, data) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			if ("id" in data) data.id = void 0;
			return await adapter.update({
				model: "team",
				where: [{
					field: "id",
					value: teamId
				}],
				update: { ...data }
			});
		},
		deleteTeam: async (teamId) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			await adapter.deleteMany({
				model: "teamMember",
				where: [{
					field: "teamId",
					value: teamId
				}]
			});
			return await adapter.delete({
				model: "team",
				where: [{
					field: "id",
					value: teamId
				}]
			});
		},
		listTeams: async (organizationId) => {
			return await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "team",
				where: [{
					field: "organizationId",
					value: organizationId
				}]
			});
		},
		createTeamInvitation: async ({ email, role, teamId, organizationId, inviterId, expiresIn = 1e3 * 60 * 60 * 48 }) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			const expiresAt = getDate(expiresIn);
			return await adapter.create({
				model: "invitation",
				data: {
					email,
					role,
					organizationId,
					teamId,
					inviterId,
					status: "pending",
					expiresAt
				}
			});
		},
		setActiveTeam: async (sessionToken, teamId, ctx) => {
			return await context.internalAdapter.updateSession(sessionToken, { activeTeamId: teamId });
		},
		listTeamMembers: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "teamMember",
				where: [{
					field: "teamId",
					value: data.teamId
				}]
			});
		},
		countTeamMembers: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).count({
				model: "teamMember",
				where: [{
					field: "teamId",
					value: data.teamId
				}]
			});
		},
		countMembers: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).count({
				model: "member",
				where: [{
					field: "organizationId",
					value: data.organizationId
				}]
			});
		},
		listTeamsByUser: async (data) => {
			return (await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "teamMember",
				where: [{
					field: "userId",
					value: data.userId
				}],
				join: { team: true }
			})).map((result) => result.team);
		},
		findTeamMember: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "teamMember",
				where: [{
					field: "teamId",
					value: data.teamId
				}, {
					field: "userId",
					value: data.userId
				}]
			});
		},
		findOrCreateTeamMember: async (data) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			const member = await adapter.findOne({
				model: "teamMember",
				where: [{
					field: "teamId",
					value: data.teamId
				}, {
					field: "userId",
					value: data.userId
				}]
			});
			if (member) return member;
			return await adapter.create({
				model: "teamMember",
				data: {
					teamId: data.teamId,
					userId: data.userId,
					createdAt: /* @__PURE__ */ new Date()
				}
			});
		},
		removeTeamMember: async (data) => {
			await (await getCurrentAdapter(baseAdapter)).deleteMany({
				model: "teamMember",
				where: [{
					field: "teamId",
					value: data.teamId
				}, {
					field: "userId",
					value: data.userId
				}]
			});
		},
		findInvitationsByTeamId: async (teamId) => {
			return await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "invitation",
				where: [{
					field: "teamId",
					value: teamId
				}]
			});
		},
		listUserInvitations: async (email) => {
			return (await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "invitation",
				where: [{
					field: "email",
					value: email.toLowerCase()
				}],
				join: { organization: true }
			})).filter(Boolean).map(({ organization, ...inv }) => ({
				...inv,
				organizationName: organization?.name
			}));
		},
		createInvitation: async ({ invitation, user }) => {
			const adapter = await getCurrentAdapter(baseAdapter);
			const expiresAt = getDate(options?.invitationExpiresIn || 3600 * 48, "sec");
			return await adapter.create({
				model: "invitation",
				data: {
					status: "pending",
					expiresAt,
					createdAt: /* @__PURE__ */ new Date(),
					inviterId: user.id,
					...invitation,
					teamId: invitation.teamIds.length > 0 ? invitation.teamIds.join(",") : null
				},
				forceAllowId: true
			});
		},
		findInvitationById: async (id) => {
			return await (await getCurrentAdapter(baseAdapter)).findOne({
				model: "invitation",
				where: [{
					field: "id",
					value: id
				}]
			});
		},
		findPendingInvitation: async (data) => {
			return (await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "invitation",
				where: [
					{
						field: "email",
						value: data.email.toLowerCase()
					},
					{
						field: "organizationId",
						value: data.organizationId
					},
					{
						field: "status",
						value: "pending"
					}
				]
			})).filter((invite) => new Date(invite.expiresAt) > /* @__PURE__ */ new Date());
		},
		findPendingInvitations: async (data) => {
			return (await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "invitation",
				where: [{
					field: "organizationId",
					value: data.organizationId
				}, {
					field: "status",
					value: "pending"
				}]
			})).filter((invite) => new Date(invite.expiresAt) > /* @__PURE__ */ new Date());
		},
		listInvitations: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).findMany({
				model: "invitation",
				where: [{
					field: "organizationId",
					value: data.organizationId
				}]
			});
		},
		updateInvitation: async (data) => {
			return await (await getCurrentAdapter(baseAdapter)).update({
				model: "invitation",
				where: [{
					field: "id",
					value: data.invitationId
				}],
				update: { status: data.status }
			});
		}
	};
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/access/access.mjs
function role(statements) {
	return {
		authorize(request, connector = "AND") {
			let success = false;
			for (const [requestedResource, requestedActions] of Object.entries(request)) {
				const allowedActions = statements[requestedResource];
				if (!allowedActions) return {
					success: false,
					error: `You are not allowed to access resource: ${requestedResource}`
				};
				if (Array.isArray(requestedActions)) success = requestedActions.every((requestedAction) => allowedActions.includes(requestedAction));
				else if (typeof requestedActions === "object") {
					const actions = requestedActions;
					if (actions.connector === "OR") success = actions.actions.some((requestedAction) => allowedActions.includes(requestedAction));
					else success = actions.actions.every((requestedAction) => allowedActions.includes(requestedAction));
				} else throw new BetterAuthError("Invalid access control request");
				if (success && connector === "OR") return { success };
				if (!success && connector === "AND") return {
					success: false,
					error: `unauthorized to access resource "${requestedResource}"`
				};
			}
			if (success) return { success };
			return {
				success: false,
				error: "Not authorized"
			};
		},
		statements
	};
}
function createAccessControl(s) {
	return {
		newRole(statements) {
			return role(statements);
		},
		statements: s
	};
}
var defaultAc = createAccessControl({
	organization: ["update", "delete"],
	member: [
		"create",
		"update",
		"delete"
	],
	invitation: ["create", "cancel"],
	team: [
		"create",
		"update",
		"delete"
	],
	ac: [
		"create",
		"read",
		"update",
		"delete"
	]
});
var defaultRoles$1 = {
	admin: defaultAc.newRole({
		organization: ["update"],
		invitation: ["create", "cancel"],
		member: [
			"create",
			"update",
			"delete"
		],
		team: [
			"create",
			"update",
			"delete"
		],
		ac: [
			"create",
			"read",
			"update",
			"delete"
		]
	}),
	owner: defaultAc.newRole({
		organization: ["update", "delete"],
		member: [
			"create",
			"update",
			"delete"
		],
		invitation: ["create", "cancel"],
		team: [
			"create",
			"update",
			"delete"
		],
		ac: [
			"create",
			"read",
			"update",
			"delete"
		]
	}),
	member: defaultAc.newRole({
		organization: [],
		member: [],
		invitation: [],
		team: [],
		ac: ["read"]
	})
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/permission.mjs
var hasPermissionFn = (input, acRoles) => {
	if (!input.permissions) return false;
	const roles = input.role.split(",");
	const creatorRole = input.options.creatorRole || "owner";
	const isCreator = roles.includes(creatorRole);
	const allowCreatorsAllPermissions = input.allowCreatorAllPermissions || false;
	if (isCreator && allowCreatorsAllPermissions) return true;
	for (const role of roles) if ((acRoles[role]?.authorize(input.permissions))?.success) return true;
	return false;
};
var cacheAllRoles = /* @__PURE__ */ new Map();
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/has-permission.mjs
var hasPermission = async (input, ctx) => {
	let acRoles = { ...input.options.roles || defaultRoles$1 };
	if (ctx && input.organizationId && input.options.dynamicAccessControl?.enabled && input.options.ac && !input.useMemoryCache) {
		const roles = await ctx.context.adapter.findMany({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: input.organizationId
			}]
		});
		for (const { role, permission: permissionsString } of roles) {
			const result = record(string(), array(string())).safeParse(JSON.parse(permissionsString));
			if (!result.success) {
				ctx.context.logger.error("[hasPermission] Invalid permissions for role " + role, { permissions: JSON.parse(permissionsString) });
				throw new APIError("INTERNAL_SERVER_ERROR", { message: "Invalid permissions for role " + role });
			}
			const merged = { ...acRoles[role]?.statements };
			for (const [key, actions] of Object.entries(result.data)) merged[key] = [...new Set([...merged[key] ?? [], ...actions])];
			acRoles[role] = input.options.ac.newRole(merged);
		}
	}
	if (input.useMemoryCache) acRoles = cacheAllRoles.get(input.organizationId) || acRoles;
	cacheAllRoles.set(input.organizationId, acRoles);
	return hasPermissionFn(input, acRoles);
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/version.mjs
var PACKAGE_VERSION = "1.6.10";
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/error-codes.mjs
var ORGANIZATION_ERROR_CODES = defineErrorCodes({
	YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION: "You are not allowed to create a new organization",
	YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS: "You have reached the maximum number of organizations",
	ORGANIZATION_ALREADY_EXISTS: "Organization already exists",
	ORGANIZATION_SLUG_ALREADY_TAKEN: "Organization slug already taken",
	ORGANIZATION_NOT_FOUND: "Organization not found",
	USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION: "User is not a member of the organization",
	YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION: "You are not allowed to update this organization",
	YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION: "You are not allowed to delete this organization",
	NO_ACTIVE_ORGANIZATION: "No active organization",
	USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION: "User is already a member of this organization",
	MEMBER_NOT_FOUND: "Member not found",
	ROLE_NOT_FOUND: "Role not found",
	YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM: "You are not allowed to create a new team",
	TEAM_ALREADY_EXISTS: "Team already exists",
	TEAM_NOT_FOUND: "Team not found",
	YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER: "You cannot leave the organization as the only owner",
	YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER: "You cannot leave the organization without an owner",
	YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER: "You are not allowed to delete this member",
	YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION: "You are not allowed to invite users to this organization",
	USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION: "User is already invited to this organization",
	INVITATION_NOT_FOUND: "Invitation not found",
	YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION: "You are not the recipient of the invitation",
	EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION: "Email verification required before accepting or rejecting invitation",
	YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION: "You are not allowed to cancel this invitation",
	INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION: "Inviter is no longer a member of the organization",
	YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE: "You are not allowed to invite a user with this role",
	FAILED_TO_RETRIEVE_INVITATION: "Failed to retrieve invitation",
	YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS: "You have reached the maximum number of teams",
	UNABLE_TO_REMOVE_LAST_TEAM: "Unable to remove last team",
	YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER: "You are not allowed to update this member",
	ORGANIZATION_MEMBERSHIP_LIMIT_REACHED: "Organization membership limit reached",
	YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to create teams in this organization",
	YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION: "You are not allowed to delete teams in this organization",
	YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM: "You are not allowed to update this team",
	YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM: "You are not allowed to delete this team",
	INVITATION_LIMIT_REACHED: "Invitation limit reached",
	TEAM_MEMBER_LIMIT_REACHED: "Team member limit reached",
	USER_IS_NOT_A_MEMBER_OF_THE_TEAM: "User is not a member of the team",
	YOU_CAN_NOT_ACCESS_THE_MEMBERS_OF_THIS_TEAM: "You are not allowed to list the members of this team",
	YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM: "You do not have an active team",
	YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER: "You are not allowed to create a new member",
	YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER: "You are not allowed to remove a team member",
	YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION: "You are not allowed to access this organization as an owner",
	YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION: "You are not a member of this organization",
	MISSING_AC_INSTANCE: "Dynamic Access Control requires a pre-defined ac instance on the server auth plugin. Read server logs for more information",
	YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE: "You must be in an organization to create a role",
	YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE: "You are not allowed to create a role",
	YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE: "You are not allowed to update a role",
	YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE: "You are not allowed to delete a role",
	YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE: "You are not allowed to read a role",
	YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE: "You are not allowed to list a role",
	YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE: "You are not allowed to get a role",
	TOO_MANY_ROLES: "This organization has too many roles",
	INVALID_RESOURCE: "The provided permission includes an invalid resource",
	ROLE_NAME_IS_ALREADY_TAKEN: "That role name is already taken",
	CANNOT_DELETE_A_PRE_DEFINED_ROLE: "Cannot delete a pre-defined role",
	ROLE_IS_ASSIGNED_TO_MEMBERS: "Cannot delete a role that is assigned to members. Please reassign the members to a different role first"
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/utils/shim.mjs
var shimContext = (originalObject, newContext) => {
	const shimmedObj = {};
	for (const [key, value] of Object.entries(originalObject)) {
		shimmedObj[key] = (ctx) => {
			return value({
				...ctx,
				context: {
					...newContext,
					...ctx.context
				}
			});
		};
		shimmedObj[key].path = value.path;
		shimmedObj[key].method = value.method;
		shimmedObj[key].options = value.options;
		shimmedObj[key].headers = value.headers;
	}
	return shimmedObj;
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/call.mjs
var orgMiddleware = createAuthMiddleware(async () => {
	return {};
});
/**
* The middleware forces the endpoint to require a valid session by utilizing the `sessionMiddleware`.
* It also appends additional types to the session type regarding organizations.
*/
var orgSessionMiddleware = createAuthMiddleware({ use: [sessionMiddleware] }, async (ctx) => {
	return { session: ctx.context.session };
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/db/to-zod.mjs
function toZodSchema({ fields, isClientSide }) {
	return object(Object.keys(fields).reduce((acc, key) => {
		const field = fields[key];
		if (!field) return acc;
		if (isClientSide && field.input === false) return acc;
		let schema;
		if (field.type === "json") schema = json ? json() : any();
		else if (field.type === "string[]" || field.type === "number[]") schema = array(field.type === "string[]" ? string() : number());
		else if (Array.isArray(field.type)) schema = any();
		else schema = zod_exports[field.type]();
		if (field?.required === false) schema = schema.optional();
		if (!isClientSide && field?.returned === false) return acc;
		return {
			...acc,
			[key]: schema
		};
	}, {}));
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/routes/crud-access-control.mjs
var normalizeRoleName = (role) => role.toLowerCase();
var DEFAULT_MAXIMUM_ROLES_PER_ORGANIZATION = Number.POSITIVE_INFINITY;
var getAdditionalFields = (options, shouldBePartial = false) => {
	const additionalFields = options?.schema?.organizationRole?.additionalFields || {};
	if (shouldBePartial) for (const key in additionalFields) additionalFields[key].required = false;
	return {
		additionalFieldsSchema: toZodSchema({
			fields: additionalFields,
			isClientSide: true
		}),
		$AdditionalFields: {},
		$ReturnAdditionalFields: {}
	};
};
var baseCreateOrgRoleSchema = object({
	organizationId: string().optional().meta({ description: "The id of the organization to create the role in. If not provided, the user's active organization will be used." }),
	role: string().meta({ description: "The name of the role to create" }),
	permission: record(string(), array(string())).meta({ description: "The permission to assign to the role" })
});
var createOrgRole = (options) => {
	const { additionalFieldsSchema, $AdditionalFields, $ReturnAdditionalFields } = getAdditionalFields(options, false);
	return createAuthEndpoint("/organization/create-role", {
		method: "POST",
		body: baseCreateOrgRoleSchema.safeExtend({ additionalFields: object({ ...additionalFieldsSchema.shape }).optional() }),
		metadata: { $Infer: { body: {} } },
		requireHeaders: true,
		use: [orgSessionMiddleware]
	}, async (ctx) => {
		const { session, user } = ctx.context.session;
		let roleName = ctx.body.role;
		const permission = ctx.body.permission;
		const additionalFields = ctx.body.additionalFields;
		const ac = options.ac;
		if (!ac) {
			ctx.context.logger.error(`[Dynamic Access Control] The organization plugin is missing a pre-defined ac instance.`, `\nPlease refer to the documentation here: https://better-auth.com/docs/plugins/organization#dynamic-access-control`);
			throw APIError.from("NOT_IMPLEMENTED", ORGANIZATION_ERROR_CODES.MISSING_AC_INSTANCE);
		}
		const organizationId = ctx.body.organizationId ?? session.activeOrganizationId;
		if (!organizationId) {
			ctx.context.logger.error(`[Dynamic Access Control] The session is missing an active organization id to create a role. Either set an active org id, or pass an organizationId in the request body.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.YOU_MUST_BE_IN_AN_ORGANIZATION_TO_CREATE_A_ROLE);
		}
		roleName = normalizeRoleName(roleName);
		await checkIfRoleNameIsTakenByPreDefinedRole({
			role: roleName,
			organizationId,
			options,
			ctx
		});
		const member = await ctx.context.adapter.findOne({
			model: "member",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, {
				field: "userId",
				value: user.id,
				operator: "eq",
				connector: "AND"
			}]
		});
		if (!member) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not a member of the organization to create a role.`, {
				userId: user.id,
				organizationId
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
		}
		if (!await hasPermission({
			options,
			organizationId,
			permissions: { ac: ["create"] },
			role: member.role
		}, ctx)) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not permitted to create a role. If this is unexpected, please make sure the role associated to that member has the "ac" resource with the "create" permission.`, {
				userId: user.id,
				organizationId,
				role: member.role
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE);
		}
		const maximumRolesPerOrganization = typeof options.dynamicAccessControl?.maximumRolesPerOrganization === "function" ? await options.dynamicAccessControl.maximumRolesPerOrganization(organizationId) : options.dynamicAccessControl?.maximumRolesPerOrganization ?? DEFAULT_MAXIMUM_ROLES_PER_ORGANIZATION;
		const rolesInDB = await ctx.context.adapter.count({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}]
		});
		if (rolesInDB >= maximumRolesPerOrganization) {
			ctx.context.logger.error(`[Dynamic Access Control] Failed to create a new role, the organization has too many roles. Maximum allowed roles is ${maximumRolesPerOrganization}.`, {
				organizationId,
				maximumRolesPerOrganization,
				rolesInDB
			});
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TOO_MANY_ROLES);
		}
		await checkForInvalidResources({
			ac,
			ctx,
			permission
		});
		await checkIfMemberHasPermission({
			ctx,
			member,
			options,
			organizationId,
			permissionRequired: permission,
			user,
			action: "create"
		});
		await checkIfRoleNameIsTakenByRoleInDB({
			ctx,
			organizationId,
			role: roleName
		});
		const newRole = ac.newRole(permission);
		const data = {
			...await ctx.context.adapter.create({
				model: "organizationRole",
				data: {
					createdAt: /* @__PURE__ */ new Date(),
					organizationId,
					permission: JSON.stringify(permission),
					role: roleName,
					...additionalFields
				}
			}),
			permission
		};
		return ctx.json({
			success: true,
			roleData: data,
			statements: newRole.statements
		});
	});
};
var deleteOrgRoleBodySchema = object({ organizationId: string().optional().meta({ description: "The id of the organization to create the role in. If not provided, the user's active organization will be used." }) }).and(union([object({ roleName: string().nonempty().meta({ description: "The name of the role to delete" }) }), object({ roleId: string().nonempty().meta({ description: "The id of the role to delete" }) })]));
var deleteOrgRole = (options) => {
	return createAuthEndpoint("/organization/delete-role", {
		method: "POST",
		body: deleteOrgRoleBodySchema,
		requireHeaders: true,
		use: [orgSessionMiddleware],
		metadata: { $Infer: { body: {} } }
	}, async (ctx) => {
		const { session, user } = ctx.context.session;
		const organizationId = ctx.body.organizationId ?? session.activeOrganizationId;
		if (!organizationId) {
			ctx.context.logger.error(`[Dynamic Access Control] The session is missing an active organization id to delete a role. Either set an active org id, or pass an organizationId in the request body.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		}
		const member = await ctx.context.adapter.findOne({
			model: "member",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, {
				field: "userId",
				value: user.id,
				operator: "eq",
				connector: "AND"
			}]
		});
		if (!member) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not a member of the organization to delete a role.`, {
				userId: user.id,
				organizationId
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
		}
		if (!await hasPermission({
			options,
			organizationId,
			permissions: { ac: ["delete"] },
			role: member.role
		}, ctx)) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not permitted to delete a role. If this is unexpected, please make sure the role associated to that member has the "ac" resource with the "delete" permission.`, {
				userId: user.id,
				organizationId,
				role: member.role
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE);
		}
		if (ctx.body.roleName) {
			const roleName = ctx.body.roleName;
			const defaultRoles = options.roles ? Object.keys(options.roles) : [
				"owner",
				"admin",
				"member"
			];
			if (defaultRoles.includes(roleName)) {
				ctx.context.logger.error(`[Dynamic Access Control] Cannot delete a pre-defined role.`, {
					roleName,
					organizationId,
					defaultRoles
				});
				throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.CANNOT_DELETE_A_PRE_DEFINED_ROLE);
			}
		}
		let condition;
		if (ctx.body.roleName) condition = {
			field: "role",
			value: ctx.body.roleName,
			operator: "eq",
			connector: "AND"
		};
		else if (ctx.body.roleId) condition = {
			field: "id",
			value: ctx.body.roleId,
			operator: "eq",
			connector: "AND"
		};
		else {
			ctx.context.logger.error(`[Dynamic Access Control] The role name/id is not provided in the request body.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND);
		}
		const existingRoleInDB = await ctx.context.adapter.findOne({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, condition]
		});
		if (!existingRoleInDB) {
			ctx.context.logger.error(`[Dynamic Access Control] The role name/id does not exist in the database.`, {
				..."roleName" in ctx.body ? { roleName: ctx.body.roleName } : { roleId: ctx.body.roleId },
				organizationId
			});
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND);
		}
		existingRoleInDB.permission = JSON.parse(existingRoleInDB.permission);
		const roleToDelete = existingRoleInDB.role;
		if ((await ctx.context.adapter.findMany({
			model: "member",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, {
				field: "role",
				value: roleToDelete,
				operator: "contains"
			}]
		})).find((member) => {
			return member.role.split(",").map((r) => r.trim()).includes(roleToDelete);
		})) {
			ctx.context.logger.error(`[Dynamic Access Control] Cannot delete a role that is assigned to members.`, {
				role: existingRoleInDB.role,
				organizationId
			});
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_IS_ASSIGNED_TO_MEMBERS);
		}
		await ctx.context.adapter.delete({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, condition]
		});
		return ctx.json({ success: true });
	});
};
var listOrgRolesQuerySchema = object({ organizationId: string().optional().meta({ description: "The id of the organization to list roles for. If not provided, the user's active organization will be used." }) }).optional();
var listOrgRoles = (options) => {
	const { $ReturnAdditionalFields } = getAdditionalFields(options, false);
	return createAuthEndpoint("/organization/list-roles", {
		method: "GET",
		requireHeaders: true,
		use: [orgSessionMiddleware],
		query: listOrgRolesQuerySchema
	}, async (ctx) => {
		const { session, user } = ctx.context.session;
		const organizationId = ctx.query?.organizationId ?? session.activeOrganizationId;
		if (!organizationId) {
			ctx.context.logger.error(`[Dynamic Access Control] The session is missing an active organization id to list roles. Either set an active org id, or pass an organizationId in the request query.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		}
		const member = await ctx.context.adapter.findOne({
			model: "member",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, {
				field: "userId",
				value: user.id,
				operator: "eq",
				connector: "AND"
			}]
		});
		if (!member) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not a member of the organization to list roles.`, {
				userId: user.id,
				organizationId
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
		}
		if (!await hasPermission({
			options,
			organizationId,
			permissions: { ac: ["read"] },
			role: member.role
		}, ctx)) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not permitted to list roles.`, {
				userId: user.id,
				organizationId,
				role: member.role
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE);
		}
		let roles = await ctx.context.adapter.findMany({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}]
		});
		roles = roles.map((x) => ({
			...x,
			permission: JSON.parse(x.permission)
		}));
		return ctx.json(roles);
	});
};
var getOrgRoleQuerySchema = object({ organizationId: string().optional().meta({ description: "The id of the organization to read a role for. If not provided, the user's active organization will be used." }) }).and(union([object({ roleName: string().nonempty().meta({ description: "The name of the role to read" }) }), object({ roleId: string().nonempty().meta({ description: "The id of the role to read" }) })])).optional();
var getOrgRole = (options) => {
	const { $ReturnAdditionalFields } = getAdditionalFields(options, false);
	return createAuthEndpoint("/organization/get-role", {
		method: "GET",
		requireHeaders: true,
		use: [orgSessionMiddleware],
		query: getOrgRoleQuerySchema,
		metadata: { $Infer: { query: {} } }
	}, async (ctx) => {
		const { session, user } = ctx.context.session;
		const organizationId = ctx.query?.organizationId ?? session.activeOrganizationId;
		if (!organizationId) {
			ctx.context.logger.error(`[Dynamic Access Control] The session is missing an active organization id to read a role. Either set an active org id, or pass an organizationId in the request query.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		}
		const member = await ctx.context.adapter.findOne({
			model: "member",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, {
				field: "userId",
				value: user.id,
				operator: "eq",
				connector: "AND"
			}]
		});
		if (!member) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not a member of the organization to read a role.`, {
				userId: user.id,
				organizationId
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
		}
		if (!await hasPermission({
			options,
			organizationId,
			permissions: { ac: ["read"] },
			role: member.role
		}, ctx)) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not permitted to read a role.`, {
				userId: user.id,
				organizationId,
				role: member.role
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE);
		}
		let condition;
		if (ctx.query.roleName) condition = {
			field: "role",
			value: ctx.query.roleName,
			operator: "eq",
			connector: "AND"
		};
		else if (ctx.query.roleId) condition = {
			field: "id",
			value: ctx.query.roleId,
			operator: "eq",
			connector: "AND"
		};
		else {
			ctx.context.logger.error(`[Dynamic Access Control] The role name/id is not provided in the request query.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND);
		}
		const role = await ctx.context.adapter.findOne({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, condition]
		});
		if (!role) {
			ctx.context.logger.error(`[Dynamic Access Control] The role name/id does not exist in the database.`, {
				..."roleName" in ctx.query ? { roleName: ctx.query.roleName } : { roleId: ctx.query.roleId },
				organizationId
			});
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND);
		}
		role.permission = JSON.parse(role.permission);
		return ctx.json(role);
	});
};
var roleNameOrIdSchema = union([object({ roleName: string().nonempty().meta({ description: "The name of the role to update" }) }), object({ roleId: string().nonempty().meta({ description: "The id of the role to update" }) })]);
var updateOrgRole = (options) => {
	const { additionalFieldsSchema, $AdditionalFields, $ReturnAdditionalFields } = getAdditionalFields(options, true);
	return createAuthEndpoint("/organization/update-role", {
		method: "POST",
		body: object({
			organizationId: string().optional().meta({ description: "The id of the organization to update the role in. If not provided, the user's active organization will be used." }),
			data: object({
				permission: record(string(), array(string())).optional().meta({ description: "The permission to update the role with" }),
				roleName: string().optional().meta({ description: "The name of the role to update" }),
				...additionalFieldsSchema.shape
			})
		}).and(roleNameOrIdSchema),
		metadata: { $Infer: { body: {} } },
		requireHeaders: true,
		use: [orgSessionMiddleware]
	}, async (ctx) => {
		const { session, user } = ctx.context.session;
		const ac = options.ac;
		if (!ac) {
			ctx.context.logger.error(`[Dynamic Access Control] The organization plugin is missing a pre-defined ac instance.`, `\nPlease refer to the documentation here: https://better-auth.com/docs/plugins/organization#dynamic-access-control`);
			throw APIError.from("NOT_IMPLEMENTED", ORGANIZATION_ERROR_CODES.MISSING_AC_INSTANCE);
		}
		const organizationId = ctx.body.organizationId ?? session.activeOrganizationId;
		if (!organizationId) {
			ctx.context.logger.error(`[Dynamic Access Control] The session is missing an active organization id to update a role. Either set an active org id, or pass an organizationId in the request body.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		}
		const member = await ctx.context.adapter.findOne({
			model: "member",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, {
				field: "userId",
				value: user.id,
				operator: "eq",
				connector: "AND"
			}]
		});
		if (!member) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not a member of the organization to update a role.`, {
				userId: user.id,
				organizationId
			});
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
		}
		if (!await hasPermission({
			options,
			organizationId,
			role: member.role,
			permissions: { ac: ["update"] }
		}, ctx)) {
			ctx.context.logger.error(`[Dynamic Access Control] The user is not permitted to update a role.`);
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE);
		}
		let condition;
		if (ctx.body.roleName) condition = {
			field: "role",
			value: ctx.body.roleName,
			operator: "eq",
			connector: "AND"
		};
		else if (ctx.body.roleId) condition = {
			field: "id",
			value: ctx.body.roleId,
			operator: "eq",
			connector: "AND"
		};
		else {
			ctx.context.logger.error(`[Dynamic Access Control] The role name/id is not provided in the request body.`);
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND);
		}
		const role = await ctx.context.adapter.findOne({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, condition]
		});
		if (!role) {
			ctx.context.logger.error(`[Dynamic Access Control] The role name/id does not exist in the database.`, {
				..."roleName" in ctx.body ? { roleName: ctx.body.roleName } : { roleId: ctx.body.roleId },
				organizationId
			});
			throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND);
		}
		role.permission = role.permission ? JSON.parse(role.permission) : void 0;
		const { permission: _, roleName: __, ...additionalFields } = ctx.body.data;
		const updateData = { ...additionalFields };
		if (ctx.body.data.permission) {
			const newPermission = ctx.body.data.permission;
			await checkForInvalidResources({
				ac,
				ctx,
				permission: newPermission
			});
			await checkIfMemberHasPermission({
				ctx,
				member,
				options,
				organizationId,
				permissionRequired: newPermission,
				user,
				action: "update"
			});
			updateData.permission = newPermission;
		}
		if (ctx.body.data.roleName) {
			let newRoleName = ctx.body.data.roleName;
			newRoleName = normalizeRoleName(newRoleName);
			await checkIfRoleNameIsTakenByPreDefinedRole({
				role: newRoleName,
				organizationId,
				options,
				ctx
			});
			await checkIfRoleNameIsTakenByRoleInDB({
				role: newRoleName,
				organizationId,
				ctx
			});
			updateData.role = newRoleName;
		}
		const update = {
			...updateData,
			...updateData.permission ? { permission: JSON.stringify(updateData.permission) } : {}
		};
		await ctx.context.adapter.update({
			model: "organizationRole",
			where: [{
				field: "organizationId",
				value: organizationId,
				operator: "eq",
				connector: "AND"
			}, condition],
			update
		});
		return ctx.json({
			success: true,
			roleData: {
				...role,
				...update,
				permission: updateData.permission || role.permission || null
			}
		});
	});
};
async function checkForInvalidResources({ ac, ctx, permission }) {
	const validResources = Object.keys(ac.statements);
	const providedResources = Object.keys(permission);
	if (providedResources.some((r) => !validResources.includes(r))) {
		ctx.context.logger.error(`[Dynamic Access Control] The provided permission includes an invalid resource.`, {
			providedResources,
			validResources
		});
		throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.INVALID_RESOURCE);
	}
}
async function checkIfMemberHasPermission({ ctx, permissionRequired: permission, options, organizationId, member, user, action }) {
	const hasNecessaryPermissions = [];
	const permissionEntries = Object.entries(permission);
	for await (const [resource, permissions] of permissionEntries) for await (const perm of permissions) hasNecessaryPermissions.push({
		resource: { [resource]: [perm] },
		hasPermission: await hasPermission({
			options,
			organizationId,
			permissions: { [resource]: [perm] },
			useMemoryCache: true,
			role: member.role
		}, ctx)
	});
	const missingPermissions = hasNecessaryPermissions.filter((x) => x.hasPermission === false).map((x) => {
		const key = Object.keys(x.resource)[0];
		return `${key}:${x.resource[key][0]}`;
	});
	if (missingPermissions.length > 0) {
		ctx.context.logger.error(`[Dynamic Access Control] The user is missing permissions necessary to ${action} a role with those set of permissions.\n`, {
			userId: user.id,
			organizationId,
			role: member.role,
			missingPermissions
		});
		let error;
		if (action === "create") error = ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_ROLE;
		else if (action === "update") error = ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_A_ROLE;
		else if (action === "delete") error = ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_A_ROLE;
		else if (action === "read") error = ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_READ_A_ROLE;
		else if (action === "list") error = ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_LIST_A_ROLE;
		else error = ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_GET_A_ROLE;
		throw APIError.fromStatus("FORBIDDEN", {
			message: error.message,
			code: error.code,
			missingPermissions
		});
	}
}
async function checkIfRoleNameIsTakenByPreDefinedRole({ options, organizationId, role, ctx }) {
	const defaultRoles = options.roles ? Object.keys(options.roles) : [
		"owner",
		"admin",
		"member"
	];
	if (defaultRoles.includes(role)) {
		ctx.context.logger.error(`[Dynamic Access Control] The role name "${role}" is already taken by a pre-defined role.`, {
			role,
			organizationId,
			defaultRoles
		});
		throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NAME_IS_ALREADY_TAKEN);
	}
}
async function checkIfRoleNameIsTakenByRoleInDB({ organizationId, role, ctx }) {
	if (await ctx.context.adapter.findOne({
		model: "organizationRole",
		where: [{
			field: "organizationId",
			value: organizationId,
			operator: "eq",
			connector: "AND"
		}, {
			field: "role",
			value: role,
			operator: "eq",
			connector: "AND"
		}]
	})) {
		ctx.context.logger.error(`[Dynamic Access Control] The role name "${role}" is already taken by a role in the database.`, {
			role,
			organizationId
		});
		throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ROLE_NAME_IS_ALREADY_TAKEN);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/routes/crud-invites.mjs
var baseInvitationSchema = object({
	email: string().meta({ description: "The email address of the user to invite" }),
	role: union([string().meta({ description: "The role to assign to the user" }), array(string().meta({ description: "The roles to assign to the user" }))]).meta({ description: "The role(s) to assign to the user. It can be `admin`, `member`, owner. Eg: \"member\"" }),
	organizationId: string().meta({ description: "The organization ID to invite the user to" }).optional(),
	resend: boolean().meta({ description: "Resend the invitation email, if the user is already invited. Eg: true" }).optional(),
	teamId: union([string().meta({ description: "The team ID to invite the user to" }).optional(), array(string()).meta({ description: "The team IDs to invite the user to" }).optional()])
});
var createInvitation = (option) => {
	const additionalFieldsSchema = toZodSchema({
		fields: option?.schema?.invitation?.additionalFields || {},
		isClientSide: true
	});
	return createAuthEndpoint("/organization/invite-member", {
		method: "POST",
		requireHeaders: true,
		use: [orgMiddleware, orgSessionMiddleware],
		body: object({
			...baseInvitationSchema.shape,
			...additionalFieldsSchema.shape
		}),
		metadata: {
			$Infer: { body: {} },
			openapi: {
				operationId: "createOrganizationInvitation",
				description: "Create an invitation to an organization",
				responses: { "200": {
					description: "Success",
					content: { "application/json": { schema: {
						type: "object",
						properties: {
							id: { type: "string" },
							email: { type: "string" },
							role: { type: "string" },
							organizationId: { type: "string" },
							inviterId: { type: "string" },
							status: { type: "string" },
							expiresAt: { type: "string" },
							createdAt: { type: "string" }
						},
						required: [
							"id",
							"email",
							"role",
							"organizationId",
							"inviterId",
							"status",
							"expiresAt",
							"createdAt"
						]
					} } }
				} }
			}
		}
	}, async (ctx) => {
		const session = ctx.context.session;
		const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
		if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		const email$1 = ctx.body.email.toLowerCase();
		if (!email().safeParse(email$1).success) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.INVALID_EMAIL);
		const adapter = getOrgAdapter(ctx.context, option);
		const member = await adapter.findMemberByOrgId({
			userId: session.user.id,
			organizationId
		});
		if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
		if (!await hasPermission({
			role: member.role,
			options: ctx.context.orgOptions,
			permissions: { invitation: ["create"] },
			organizationId
		}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION);
		const creatorRole = ctx.context.orgOptions.creatorRole || "owner";
		const roles = parseRoles(ctx.body.role);
		const rolesArray = roles.split(",").map((r) => r.trim()).filter(Boolean);
		const defaults = Object.keys(defaultRoles$1);
		const customRoles = Object.keys(ctx.context.orgOptions.roles || {});
		const validStaticRoles = new Set([...defaults, ...customRoles]);
		const unknownRoles = rolesArray.filter((role) => !validStaticRoles.has(role));
		if (unknownRoles.length > 0) if (ctx.context.orgOptions.dynamicAccessControl?.enabled) {
			const foundRoleNames = (await ctx.context.adapter.findMany({
				model: "organizationRole",
				where: [{
					field: "organizationId",
					value: organizationId
				}, {
					field: "role",
					value: unknownRoles,
					operator: "in"
				}]
			})).map((r) => r.role);
			const stillInvalid = unknownRoles.filter((r) => !foundRoleNames.includes(r));
			if (stillInvalid.length > 0) throw new APIError("BAD_REQUEST", { message: `${ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND}: ${stillInvalid.join(", ")}` });
		} else throw new APIError("BAD_REQUEST", { message: `${ORGANIZATION_ERROR_CODES.ROLE_NOT_FOUND}: ${unknownRoles.join(", ")}` });
		if (!member.role.split(",").map((r) => r.trim()).includes(creatorRole) && roles.split(",").includes(creatorRole)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_INVITE_USER_WITH_THIS_ROLE);
		if (await adapter.findMemberByEmail({
			email: email$1,
			organizationId
		})) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION);
		const alreadyInvited = await adapter.findPendingInvitation({
			email: email$1,
			organizationId
		});
		if (alreadyInvited.length && !ctx.body.resend && !ctx.context.orgOptions.cancelPendingInvitationsOnReInvite) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_ALREADY_INVITED_TO_THIS_ORGANIZATION);
		const organization = await adapter.findOrganizationById(organizationId);
		if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		if (alreadyInvited.length && ctx.body.resend) {
			const existingInvitation = alreadyInvited[0];
			const newExpiresAt = getDate(ctx.context.orgOptions.invitationExpiresIn || 3600 * 48, "sec");
			await ctx.context.adapter.update({
				model: "invitation",
				where: [{
					field: "id",
					value: existingInvitation.id
				}],
				update: { expiresAt: newExpiresAt }
			});
			const updatedInvitation = {
				...existingInvitation,
				expiresAt: newExpiresAt
			};
			if (ctx.context.orgOptions.sendInvitationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.orgOptions.sendInvitationEmail({
				id: updatedInvitation.id,
				role: updatedInvitation.role,
				email: updatedInvitation.email.toLowerCase(),
				organization,
				inviter: {
					...member,
					user: session.user
				},
				invitation: updatedInvitation
			}, ctx.request));
			return ctx.json(updatedInvitation);
		}
		if (alreadyInvited.length && ctx.context.orgOptions.cancelPendingInvitationsOnReInvite) await adapter.updateInvitation({
			invitationId: alreadyInvited[0].id,
			status: "canceled"
		});
		const invitationLimit = typeof ctx.context.orgOptions.invitationLimit === "function" ? await ctx.context.orgOptions.invitationLimit({
			user: session.user,
			organization,
			member
		}, ctx.context) : ctx.context.orgOptions.invitationLimit ?? 100;
		if ((await adapter.findPendingInvitations({ organizationId })).length >= invitationLimit) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.INVITATION_LIMIT_REACHED);
		if (ctx.context.orgOptions.teams && ctx.context.orgOptions.teams.enabled && typeof ctx.context.orgOptions.teams.maximumMembersPerTeam !== "undefined" && "teamId" in ctx.body && ctx.body.teamId) {
			const teamIds = typeof ctx.body.teamId === "string" ? [ctx.body.teamId] : ctx.body.teamId;
			for (const teamId of teamIds) {
				const team = await adapter.findTeamById({
					teamId,
					organizationId,
					includeTeamMembers: true
				});
				if (!team) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TEAM_NOT_FOUND);
				const maximumMembersPerTeam = typeof ctx.context.orgOptions.teams.maximumMembersPerTeam === "function" ? await ctx.context.orgOptions.teams.maximumMembersPerTeam({
					teamId,
					session,
					organizationId
				}) : ctx.context.orgOptions.teams.maximumMembersPerTeam;
				if (team.members.length >= maximumMembersPerTeam) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.TEAM_MEMBER_LIMIT_REACHED);
			}
		}
		const teamIds = "teamId" in ctx.body ? typeof ctx.body.teamId === "string" ? [ctx.body.teamId] : ctx.body.teamId ?? [] : [];
		const { email: _, role: __, organizationId: ___, resend: ____, ...additionalFields } = ctx.body;
		let invitationData = {
			role: roles,
			email: email$1,
			organizationId,
			teamIds,
			...additionalFields ? additionalFields : {}
		};
		if (option?.organizationHooks?.beforeCreateInvitation) {
			const response = await option?.organizationHooks.beforeCreateInvitation({
				invitation: {
					...invitationData,
					inviterId: session.user.id,
					teamId: teamIds.length > 0 ? teamIds[0] : void 0
				},
				inviter: session.user,
				organization
			});
			if (response && typeof response === "object" && "data" in response) invitationData = {
				...invitationData,
				...response.data
			};
		}
		const invitation = await adapter.createInvitation({
			invitation: invitationData,
			user: session.user
		});
		if (ctx.context.orgOptions.sendInvitationEmail) await ctx.context.runInBackgroundOrAwait(ctx.context.orgOptions.sendInvitationEmail({
			id: invitation.id,
			role: invitation.role,
			email: invitation.email.toLowerCase(),
			organization,
			inviter: {
				...member,
				user: session.user
			},
			invitation
		}, ctx.request));
		if (option?.organizationHooks?.afterCreateInvitation) await option?.organizationHooks.afterCreateInvitation({
			invitation,
			inviter: session.user,
			organization
		});
		return ctx.json(invitation);
	});
};
var acceptInvitationBodySchema = object({ invitationId: string().meta({ description: "The ID of the invitation to accept" }) });
var acceptInvitation = (options) => createAuthEndpoint("/organization/accept-invitation", {
	method: "POST",
	body: acceptInvitationBodySchema,
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware],
	metadata: { openapi: {
		description: "Accept an invitation to an organization",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					invitation: { type: "object" },
					member: { type: "object" }
				}
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	const adapter = getOrgAdapter(ctx.context, options);
	const invitation = await adapter.findInvitationById(ctx.body.invitationId);
	if (!invitation || invitation.expiresAt < /* @__PURE__ */ new Date() || invitation.status !== "pending") throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.INVITATION_NOT_FOUND);
	if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION);
	if (ctx.context.orgOptions.requireEmailVerificationOnInvitation && !session.user.emailVerified) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION);
	const membershipLimit = ctx.context.orgOptions?.membershipLimit || 100;
	const membersCount = await adapter.countMembers({ organizationId: invitation.organizationId });
	const organization = await adapter.findOrganizationById(invitation.organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	if (membersCount >= (typeof membershipLimit === "number" ? membershipLimit : await membershipLimit(session.user, organization))) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.ORGANIZATION_MEMBERSHIP_LIMIT_REACHED);
	if (options?.organizationHooks?.beforeAcceptInvitation) await options?.organizationHooks.beforeAcceptInvitation({
		invitation,
		user: session.user,
		organization
	});
	const acceptedI = await adapter.updateInvitation({
		invitationId: ctx.body.invitationId,
		status: "accepted"
	});
	if (!acceptedI) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.FAILED_TO_RETRIEVE_INVITATION);
	if (ctx.context.orgOptions.teams && ctx.context.orgOptions.teams.enabled && "teamId" in acceptedI && acceptedI.teamId) {
		const teamIds = acceptedI.teamId.split(",");
		const onlyOne = teamIds.length === 1;
		for (const teamId of teamIds) {
			await adapter.findOrCreateTeamMember({
				teamId,
				userId: session.user.id
			});
			if (typeof ctx.context.orgOptions.teams.maximumMembersPerTeam !== "undefined") {
				if (await adapter.countTeamMembers({ teamId }) >= (typeof ctx.context.orgOptions.teams.maximumMembersPerTeam === "function" ? await ctx.context.orgOptions.teams.maximumMembersPerTeam({
					teamId,
					session,
					organizationId: invitation.organizationId
				}) : ctx.context.orgOptions.teams.maximumMembersPerTeam)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.TEAM_MEMBER_LIMIT_REACHED);
			}
		}
		if (onlyOne) {
			const teamId = teamIds[0];
			await setSessionCookie(ctx, {
				session: await adapter.setActiveTeam(session.session.token, teamId, ctx),
				user: session.user
			});
		}
	}
	const member = await adapter.createMember({
		organizationId: invitation.organizationId,
		userId: session.user.id,
		role: invitation.role,
		createdAt: /* @__PURE__ */ new Date()
	});
	await adapter.setActiveOrganization(session.session.token, invitation.organizationId, ctx);
	if (options?.organizationHooks?.afterAcceptInvitation) await options?.organizationHooks.afterAcceptInvitation({
		invitation: acceptedI,
		member,
		user: session.user,
		organization
	});
	return ctx.json({
		invitation: acceptedI,
		member
	});
});
var rejectInvitationBodySchema = object({ invitationId: string().meta({ description: "The ID of the invitation to reject" }) });
var rejectInvitation = (options) => createAuthEndpoint("/organization/reject-invitation", {
	method: "POST",
	body: rejectInvitationBodySchema,
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware],
	metadata: { openapi: {
		description: "Reject an invitation to an organization",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					invitation: { type: "object" },
					member: {
						type: "object",
						nullable: true
					}
				}
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
	const invitation = await adapter.findInvitationById(ctx.body.invitationId);
	if (!invitation || invitation.status !== "pending") throw APIError.from("BAD_REQUEST", {
		message: "Invitation not found!",
		code: "INVITATION_NOT_FOUND"
	});
	if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION);
	if (ctx.context.orgOptions.requireEmailVerificationOnInvitation && !session.user.emailVerified) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.EMAIL_VERIFICATION_REQUIRED_BEFORE_ACCEPTING_OR_REJECTING_INVITATION);
	const organization = await adapter.findOrganizationById(invitation.organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	if (options?.organizationHooks?.beforeRejectInvitation) await options?.organizationHooks.beforeRejectInvitation({
		invitation,
		user: session.user,
		organization
	});
	const rejectedI = await adapter.updateInvitation({
		invitationId: ctx.body.invitationId,
		status: "rejected"
	});
	if (options?.organizationHooks?.afterRejectInvitation) await options?.organizationHooks.afterRejectInvitation({
		invitation: rejectedI || invitation,
		user: session.user,
		organization
	});
	return ctx.json({
		invitation: rejectedI,
		member: null
	});
});
var cancelInvitationBodySchema = object({ invitationId: string().meta({ description: "The ID of the invitation to cancel" }) });
var cancelInvitation = (options) => createAuthEndpoint("/organization/cancel-invitation", {
	method: "POST",
	body: cancelInvitationBodySchema,
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware],
	openapi: {
		operationId: "cancelOrganizationInvitation",
		description: "Cancel an invitation to an organization",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { invitation: { type: "object" } }
			} } }
		} }
	}
}, async (ctx) => {
	const session = ctx.context.session;
	const adapter = getOrgAdapter(ctx.context, options);
	const invitation = await adapter.findInvitationById(ctx.body.invitationId);
	if (!invitation) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.INVITATION_NOT_FOUND);
	const member = await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId: invitation.organizationId
	});
	if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	if (!await hasPermission({
		role: member.role,
		options: ctx.context.orgOptions,
		permissions: { invitation: ["cancel"] },
		organizationId: invitation.organizationId
	}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CANCEL_THIS_INVITATION);
	const organization = await adapter.findOrganizationById(invitation.organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	if (options?.organizationHooks?.beforeCancelInvitation) await options?.organizationHooks.beforeCancelInvitation({
		invitation,
		cancelledBy: session.user,
		organization
	});
	const canceledI = await adapter.updateInvitation({
		invitationId: ctx.body.invitationId,
		status: "canceled"
	});
	if (options?.organizationHooks?.afterCancelInvitation) await options?.organizationHooks.afterCancelInvitation({
		invitation: canceledI || invitation,
		cancelledBy: session.user,
		organization
	});
	return ctx.json(canceledI);
});
var getInvitationQuerySchema = object({ id: string().meta({ description: "The ID of the invitation to get" }) });
var getInvitation = (options) => createAuthEndpoint("/organization/get-invitation", {
	method: "GET",
	use: [orgMiddleware],
	requireHeaders: true,
	query: getInvitationQuerySchema,
	metadata: { openapi: {
		description: "Get an invitation by ID",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					id: { type: "string" },
					email: { type: "string" },
					role: { type: "string" },
					organizationId: { type: "string" },
					inviterId: { type: "string" },
					status: { type: "string" },
					expiresAt: { type: "string" },
					organizationName: { type: "string" },
					organizationSlug: { type: "string" },
					inviterEmail: { type: "string" }
				},
				required: [
					"id",
					"email",
					"role",
					"organizationId",
					"inviterId",
					"status",
					"expiresAt",
					"organizationName",
					"organizationSlug",
					"inviterEmail"
				]
			} } }
		} }
	} }
}, async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	if (!session) throw APIError.fromStatus("UNAUTHORIZED", { message: "Not authenticated" });
	const adapter = getOrgAdapter(ctx.context, options);
	const invitation = await adapter.findInvitationById(ctx.query.id);
	if (!invitation || invitation.status !== "pending" || invitation.expiresAt < /* @__PURE__ */ new Date()) throw APIError.fromStatus("BAD_REQUEST", { message: "Invitation not found!" });
	if (invitation.email.toLowerCase() !== session.user.email.toLowerCase()) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_THE_RECIPIENT_OF_THE_INVITATION);
	const organization = await adapter.findOrganizationById(invitation.organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	const member = await adapter.findMemberByOrgId({
		userId: invitation.inviterId,
		organizationId: invitation.organizationId
	});
	if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.INVITER_IS_NO_LONGER_A_MEMBER_OF_THE_ORGANIZATION);
	return ctx.json({
		...invitation,
		organizationName: organization.name,
		organizationSlug: organization.slug,
		inviterEmail: member.user.email
	});
});
var listInvitationQuerySchema = object({ organizationId: string().meta({ description: "The ID of the organization to list invitations for" }).optional() }).optional();
var listInvitations = (options) => createAuthEndpoint("/organization/list-invitations", {
	method: "GET",
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware],
	query: listInvitationQuerySchema
}, async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	if (!session) throw APIError.fromStatus("UNAUTHORIZED", { message: "Not authenticated" });
	const orgId = ctx.query?.organizationId || session.session.activeOrganizationId;
	if (!orgId) throw APIError.fromStatus("BAD_REQUEST", { message: "Organization ID is required" });
	const adapter = getOrgAdapter(ctx.context, options);
	if (!await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId: orgId
	})) throw APIError.fromStatus("FORBIDDEN", { message: "You are not a member of this organization" });
	const invitations = await adapter.listInvitations({ organizationId: orgId });
	return ctx.json(invitations);
});
/**
* List all invitations a user has received
*/
var listUserInvitations = (options) => createAuthEndpoint("/organization/list-user-invitations", {
	method: "GET",
	use: [orgMiddleware],
	query: object({ email: string().meta({ description: "The email of the user to list invitations for. This only works for server side API calls." }).optional() }).optional(),
	metadata: { openapi: {
		description: "List all invitations a user has received",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "array",
				items: {
					type: "object",
					properties: {
						id: { type: "string" },
						email: { type: "string" },
						role: { type: "string" },
						organizationId: { type: "string" },
						organizationName: { type: "string" },
						inviterId: {
							type: "string",
							description: "The ID of the user who created the invitation"
						},
						teamId: {
							type: "string",
							description: "The ID of the team associated with the invitation",
							nullable: true
						},
						status: { type: "string" },
						expiresAt: { type: "string" },
						createdAt: { type: "string" }
					},
					required: [
						"id",
						"email",
						"role",
						"organizationId",
						"organizationName",
						"inviterId",
						"status",
						"expiresAt",
						"createdAt"
					]
				}
			} } }
		} }
	} }
}, async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	if (ctx.request && ctx.query?.email) throw APIError.fromStatus("BAD_REQUEST", { message: "User email cannot be passed for client side API calls." });
	const userEmail = session?.user.email || ctx.query?.email;
	if (!userEmail) throw APIError.fromStatus("BAD_REQUEST", { message: "Missing session headers, or email query parameter." });
	const pendingInvitations = (await getOrgAdapter(ctx.context, options).listUserInvitations(userEmail)).filter((inv) => inv.status === "pending");
	return ctx.json(pendingInvitations);
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/routes/crud-members.mjs
var baseMemberSchema = object({
	userId: string$1().meta({ description: "The user Id which represents the user to be added as a member. If `null` is provided, then it's expected to provide session headers. Eg: \"user-id\"" }),
	role: union([string(), array(string())]).meta({ description: "The role(s) to assign to the new member. Eg: [\"admin\", \"sale\"]" }),
	organizationId: string().meta({ description: "An optional organization ID to pass. If not provided, will default to the user's active organization. Eg: \"org-id\"" }).optional(),
	teamId: string().meta({ description: "An optional team ID to add the member to. Eg: \"team-id\"" }).optional()
});
var addMember = (option) => {
	const additionalFieldsSchema = toZodSchema({
		fields: option?.schema?.member?.additionalFields || {},
		isClientSide: true
	});
	return createAuthEndpoint({
		method: "POST",
		body: object({
			...baseMemberSchema.shape,
			...additionalFieldsSchema.shape
		}),
		use: [orgMiddleware],
		metadata: {
			$Infer: { body: {} },
			openapi: {
				operationId: "addOrganizationMember",
				description: "Add a member to an organization"
			}
		}
	}, async (ctx) => {
		const session = ctx.body.userId ? await getSessionFromCtx(ctx).catch((e) => null) : null;
		const orgId = ctx.body.organizationId || session?.session.activeOrganizationId;
		if (!orgId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		const teamId = "teamId" in ctx.body ? ctx.body.teamId : void 0;
		if (teamId && !ctx.context.orgOptions.teams?.enabled) {
			ctx.context.logger.error("Teams are not enabled");
			throw APIError.fromStatus("BAD_REQUEST", { message: "Teams are not enabled" });
		}
		const adapter = getOrgAdapter(ctx.context, option);
		const user = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
		if (!user) throw APIError.from("BAD_REQUEST", BASE_ERROR_CODES.USER_NOT_FOUND);
		if (await adapter.findMemberByEmail({
			email: user.email,
			organizationId: orgId
		})) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_ALREADY_A_MEMBER_OF_THIS_ORGANIZATION);
		if (teamId) {
			const team = await adapter.findTeamById({
				teamId,
				organizationId: orgId
			});
			if (!team || team.organizationId !== orgId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TEAM_NOT_FOUND);
		}
		const membershipLimit = ctx.context.orgOptions?.membershipLimit || 100;
		const count = await adapter.countMembers({ organizationId: orgId });
		const organization = await adapter.findOrganizationById(orgId);
		if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		if (count >= (typeof membershipLimit === "number" ? membershipLimit : await membershipLimit(user, organization))) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.ORGANIZATION_MEMBERSHIP_LIMIT_REACHED);
		const { role: _, userId: __, organizationId: ___, ...additionalFields } = ctx.body;
		let memberData = {
			organizationId: orgId,
			userId: user.id,
			role: parseRoles(ctx.body.role),
			createdAt: /* @__PURE__ */ new Date(),
			...additionalFields ? additionalFields : {}
		};
		if (option?.organizationHooks?.beforeAddMember) {
			const response = await option?.organizationHooks.beforeAddMember({
				member: {
					userId: user.id,
					organizationId: orgId,
					role: parseRoles(ctx.body.role),
					...additionalFields
				},
				user,
				organization
			});
			if (response && typeof response === "object" && "data" in response) memberData = {
				...memberData,
				...response.data
			};
		}
		const createdMember = await adapter.createMember(memberData);
		if (teamId) await adapter.findOrCreateTeamMember({
			userId: user.id,
			teamId
		});
		if (option?.organizationHooks?.afterAddMember) await option?.organizationHooks.afterAddMember({
			member: createdMember,
			user,
			organization
		});
		return ctx.json(createdMember);
	});
};
var removeMemberBodySchema = object({
	memberIdOrEmail: string().meta({ description: "The ID or email of the member to remove" }),
	organizationId: string().meta({ description: "The ID of the organization to remove the member from. If not provided, the active organization will be used. Eg: \"org-id\"" }).optional()
});
var removeMember = (options) => createAuthEndpoint("/organization/remove-member", {
	method: "POST",
	body: removeMemberBodySchema,
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware],
	metadata: { openapi: {
		description: "Remove a member from an organization",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: { member: {
					type: "object",
					properties: {
						id: { type: "string" },
						userId: { type: "string" },
						organizationId: { type: "string" },
						role: { type: "string" }
					},
					required: [
						"id",
						"userId",
						"organizationId",
						"role"
					]
				} },
				required: ["member"]
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const adapter = getOrgAdapter(ctx.context, options);
	const member = await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId
	});
	if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	let toBeRemovedMember = null;
	if (ctx.body.memberIdOrEmail.includes("@")) toBeRemovedMember = await adapter.findMemberByEmail({
		email: ctx.body.memberIdOrEmail,
		organizationId
	});
	else {
		const result = await adapter.findMemberById(ctx.body.memberIdOrEmail);
		if (!result) toBeRemovedMember = null;
		else {
			const { user: _user, ...member } = result;
			toBeRemovedMember = member;
		}
	}
	if (!toBeRemovedMember) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	const roles = toBeRemovedMember.role.split(",");
	const creatorRole = ctx.context.orgOptions?.creatorRole || "owner";
	if (roles.includes(creatorRole)) {
		if (!member.role.split(",").map((r) => r.trim()).includes(creatorRole)) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER);
		const { members } = await adapter.listMembers({ organizationId });
		if (members.filter((member) => {
			return member.role.split(",").includes(creatorRole);
		}).length <= 1) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER);
	}
	if (!await hasPermission({
		role: member.role,
		options: ctx.context.orgOptions,
		permissions: { member: ["delete"] },
		organizationId
	}, ctx)) throw APIError.from("UNAUTHORIZED", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_MEMBER);
	if (toBeRemovedMember?.organizationId !== organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	const organization = await adapter.findOrganizationById(organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	const userBeingRemoved = await ctx.context.internalAdapter.findUserById(toBeRemovedMember.userId);
	if (!userBeingRemoved) throw APIError.fromStatus("BAD_REQUEST", { message: "User not found" });
	if (options?.organizationHooks?.beforeRemoveMember) await options?.organizationHooks.beforeRemoveMember({
		member: toBeRemovedMember,
		user: userBeingRemoved,
		organization
	});
	await adapter.deleteMember({
		memberId: toBeRemovedMember.id,
		organizationId,
		userId: toBeRemovedMember.userId
	});
	if (session.user.id === toBeRemovedMember.userId && session.session.activeOrganizationId === toBeRemovedMember.organizationId) await adapter.setActiveOrganization(session.session.token, null, ctx);
	if (options?.organizationHooks?.afterRemoveMember) await options?.organizationHooks.afterRemoveMember({
		member: toBeRemovedMember,
		user: userBeingRemoved,
		organization
	});
	return ctx.json({ member: toBeRemovedMember });
});
var updateMemberRoleBodySchema = object({
	role: union([string(), array(string())]).meta({ description: "The new role to be applied. This can be a string or array of strings representing the roles. Eg: [\"admin\", \"sale\"]" }),
	memberId: string().meta({ description: "The member id to apply the role update to. Eg: \"member-id\"" }),
	organizationId: string().meta({ description: "An optional organization ID which the member is a part of to apply the role update. If not provided, you must provide session headers to get the active organization. Eg: \"organization-id\"" }).optional()
});
var updateMemberRole = (option) => createAuthEndpoint("/organization/update-member-role", {
	method: "POST",
	body: updateMemberRoleBodySchema,
	use: [orgMiddleware, orgSessionMiddleware],
	requireHeaders: true,
	metadata: {
		$Infer: { body: {} },
		openapi: {
			operationId: "updateOrganizationMemberRole",
			description: "Update the role of a member in an organization",
			responses: { "200": {
				description: "Success",
				content: { "application/json": { schema: {
					type: "object",
					properties: { member: {
						type: "object",
						properties: {
							id: { type: "string" },
							userId: { type: "string" },
							organizationId: { type: "string" },
							role: { type: "string" }
						},
						required: [
							"id",
							"userId",
							"organizationId",
							"role"
						]
					} },
					required: ["member"]
				} } }
			} }
		}
	}
}, async (ctx) => {
	const session = ctx.context.session;
	if (!ctx.body.role) throw APIError.fromStatus("BAD_REQUEST");
	const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
	const roleToSet = Array.isArray(ctx.body.role) ? ctx.body.role : ctx.body.role ? [ctx.body.role] : [];
	const member = await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId
	});
	if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	const toBeUpdatedMember = member.id !== ctx.body.memberId ? await adapter.findMemberById(ctx.body.memberId) : member;
	if (!toBeUpdatedMember) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	if (!(toBeUpdatedMember.organizationId === organizationId)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER);
	const creatorRole = ctx.context.orgOptions?.creatorRole || "owner";
	const updatingMemberRoles = member.role.split(",");
	const isUpdatingCreator = toBeUpdatedMember.role.split(",").includes(creatorRole);
	const updaterIsCreator = updatingMemberRoles.includes(creatorRole);
	const isSettingCreatorRole = roleToSet.includes(creatorRole);
	const memberIsUpdatingThemselves = member.id === toBeUpdatedMember.id;
	if (isUpdatingCreator && !updaterIsCreator || isSettingCreatorRole && !updaterIsCreator) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER);
	if (updaterIsCreator && memberIsUpdatingThemselves) {
		if ((await ctx.context.adapter.findMany({
			model: "member",
			where: [{
				field: "organizationId",
				value: organizationId
			}]
		})).filter((member) => {
			return member.role.split(",").includes(creatorRole);
		}).length <= 1 && !isSettingCreatorRole) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.YOU_CANNOT_LEAVE_THE_ORGANIZATION_WITHOUT_AN_OWNER);
	}
	if (!await hasPermission({
		role: member.role,
		options: ctx.context.orgOptions,
		permissions: { member: ["update"] },
		allowCreatorAllPermissions: true,
		organizationId
	}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_MEMBER);
	const organization = await adapter.findOrganizationById(organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	const userBeingUpdated = await ctx.context.internalAdapter.findUserById(toBeUpdatedMember.userId);
	if (!userBeingUpdated) throw APIError.fromStatus("BAD_REQUEST", { message: "User not found" });
	const previousRole = toBeUpdatedMember.role;
	const newRole = parseRoles(ctx.body.role);
	if (option?.organizationHooks?.beforeUpdateMemberRole) {
		const response = await option?.organizationHooks.beforeUpdateMemberRole({
			member: toBeUpdatedMember,
			newRole,
			user: userBeingUpdated,
			organization
		});
		if (response && typeof response === "object" && "data" in response) {
			const updatedMember = await adapter.updateMember(ctx.body.memberId, response.data.role || newRole);
			if (!updatedMember) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
			if (option?.organizationHooks?.afterUpdateMemberRole) await option?.organizationHooks.afterUpdateMemberRole({
				member: updatedMember,
				previousRole,
				user: userBeingUpdated,
				organization
			});
			return ctx.json(updatedMember);
		}
	}
	const updatedMember = await adapter.updateMember(ctx.body.memberId, newRole);
	if (!updatedMember) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	if (option?.organizationHooks?.afterUpdateMemberRole) await option?.organizationHooks.afterUpdateMemberRole({
		member: updatedMember,
		previousRole,
		user: userBeingUpdated,
		organization
	});
	return ctx.json(updatedMember);
});
var getActiveMember = (options) => createAuthEndpoint("/organization/get-active-member", {
	method: "GET",
	use: [orgMiddleware, orgSessionMiddleware],
	requireHeaders: true,
	metadata: { openapi: {
		description: "Get the member details of the active organization",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				properties: {
					id: { type: "string" },
					userId: { type: "string" },
					organizationId: { type: "string" },
					role: { type: "string" }
				},
				required: [
					"id",
					"userId",
					"organizationId",
					"role"
				]
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	const organizationId = session.session.activeOrganizationId;
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const member = await getOrgAdapter(ctx.context, options).findMemberByOrgId({
		userId: session.user.id,
		organizationId
	});
	if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	return ctx.json(member);
});
var leaveOrganizationBodySchema = object({ organizationId: string().meta({ description: "The organization Id for the member to leave. Eg: \"organization-id\"" }) });
var leaveOrganization = (options) => createAuthEndpoint("/organization/leave", {
	method: "POST",
	body: leaveOrganizationBodySchema,
	requireHeaders: true,
	use: [sessionMiddleware, orgMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	const adapter = getOrgAdapter(ctx.context, options);
	const member = await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId: ctx.body.organizationId
	});
	if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.MEMBER_NOT_FOUND);
	const creatorRole = ctx.context.orgOptions?.creatorRole || "owner";
	if (member.role.split(",").includes(creatorRole)) {
		if ((await ctx.context.adapter.findMany({
			model: "member",
			where: [{
				field: "organizationId",
				value: ctx.body.organizationId
			}]
		})).filter((member) => member.role.split(",").includes(creatorRole)).length <= 1) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.YOU_CANNOT_LEAVE_THE_ORGANIZATION_AS_THE_ONLY_OWNER);
	}
	await adapter.deleteMember({
		memberId: member.id,
		organizationId: ctx.body.organizationId,
		userId: session.user.id
	});
	if (session.session.activeOrganizationId === ctx.body.organizationId) await adapter.setActiveOrganization(session.session.token, null, ctx);
	return ctx.json(member);
});
var listMembers = (options) => createAuthEndpoint("/organization/list-members", {
	method: "GET",
	query: object({
		limit: string().meta({ description: "The number of users to return" }).or(number()).optional(),
		offset: string().meta({ description: "The offset to start from" }).or(number()).optional(),
		sortBy: string().meta({ description: "The field to sort by" }).optional(),
		sortDirection: _enum(["asc", "desc"]).meta({ description: "The direction to sort by" }).optional(),
		filterField: string().meta({ description: "The field to filter by" }).optional(),
		filterValue: string().meta({ description: "The value to filter by" }).or(number()).or(boolean()).or(array(string())).or(array(number())).optional(),
		filterOperator: _enum(whereOperators).meta({ description: "The operator to use for the filter" }).optional(),
		organizationId: string().meta({ description: "The organization ID to list members for. If not provided, will default to the user's active organization. Eg: \"organization-id\"" }).optional(),
		organizationSlug: string().meta({ description: "The organization slug to list members for. If not provided, will default to the user's active organization. Eg: \"organization-slug\"" }).optional()
	}).optional(),
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	let organizationId = ctx.query?.organizationId || session.session.activeOrganizationId;
	const adapter = getOrgAdapter(ctx.context, options);
	if (ctx.query?.organizationSlug) {
		const organization = await adapter.findOrganizationBySlug(ctx.query?.organizationSlug);
		if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		organizationId = organization.id;
	}
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	if (!await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId
	})) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
	const { members, total } = await adapter.listMembers({
		organizationId,
		limit: ctx.query?.limit ? Number(ctx.query.limit) : void 0,
		offset: ctx.query?.offset ? Number(ctx.query.offset) : void 0,
		sortBy: ctx.query?.sortBy,
		sortOrder: ctx.query?.sortDirection,
		filter: ctx.query?.filterField ? {
			field: ctx.query?.filterField,
			operator: ctx.query.filterOperator,
			value: ctx.query.filterValue
		} : void 0
	});
	return ctx.json({
		members,
		total
	});
});
var getActiveMemberRoleQuerySchema = object({
	userId: string().meta({ description: "The user ID to get the role for. If not provided, will default to the current user's" }).optional(),
	organizationId: string().meta({ description: "The organization ID to list members for. If not provided, will default to the user's active organization. Eg: \"organization-id\"" }).optional(),
	organizationSlug: string().meta({ description: "The organization slug to list members for. If not provided, will default to the user's active organization. Eg: \"organization-slug\"" }).optional()
}).optional();
var getActiveMemberRole = (options) => createAuthEndpoint("/organization/get-active-member-role", {
	method: "GET",
	query: getActiveMemberRoleQuerySchema,
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	let organizationId = ctx.query?.organizationId || session.session.activeOrganizationId;
	const adapter = getOrgAdapter(ctx.context, options);
	if (ctx.query?.organizationSlug) {
		const organization = await adapter.findOrganizationBySlug(ctx.query?.organizationSlug);
		if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		organizationId = organization.id;
	}
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const isMember = await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId
	});
	if (!isMember) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
	if (!ctx.query?.userId) return ctx.json({ role: isMember.role });
	const userIdToGetRole = ctx.query?.userId;
	const member = await adapter.findMemberByOrgId({
		userId: userIdToGetRole,
		organizationId
	});
	if (!member) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_A_MEMBER_OF_THIS_ORGANIZATION);
	return ctx.json({ role: member?.role });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/routes/crud-org.mjs
var baseOrganizationSchema = object({
	name: string().min(1).meta({ description: "The name of the organization" }),
	slug: string().min(1).meta({ description: "The slug of the organization" }),
	userId: string$1().meta({ description: "The user id of the organization creator. If not provided, the current user will be used. Should only be used by admins or when called by the server. server-only. Eg: \"user-id\"" }).optional(),
	logo: string().meta({ description: "The logo of the organization" }).optional(),
	metadata: record(string(), any()).meta({ description: "The metadata of the organization" }).optional(),
	keepCurrentActiveOrganization: boolean().meta({ description: "Whether to keep the current active organization active after creating a new one. Eg: true" }).optional()
});
var createOrganization = (options) => {
	const additionalFieldsSchema = toZodSchema({
		fields: options?.schema?.organization?.additionalFields || {},
		isClientSide: true
	});
	return createAuthEndpoint("/organization/create", {
		method: "POST",
		body: object({
			...baseOrganizationSchema.shape,
			...additionalFieldsSchema.shape
		}),
		use: [orgMiddleware],
		metadata: {
			$Infer: { body: {} },
			openapi: {
				description: "Create an organization",
				responses: { "200": {
					description: "Success",
					content: { "application/json": { schema: {
						type: "object",
						description: "The organization that was created",
						$ref: "#/components/schemas/Organization"
					} } }
				} }
			}
		}
	}, async (ctx) => {
		const session = await getSessionFromCtx(ctx);
		if (!session && (ctx.request || ctx.headers)) throw APIError.fromStatus("UNAUTHORIZED");
		let user = session?.user || null;
		if (!user) {
			if (!ctx.body.userId) throw APIError.fromStatus("UNAUTHORIZED");
			user = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
		}
		if (!user) throw APIError.fromStatus("UNAUTHORIZED");
		const options = ctx.context.orgOptions;
		const canCreateOrg = typeof options?.allowUserToCreateOrganization === "function" ? await options.allowUserToCreateOrganization(user) : options?.allowUserToCreateOrganization === void 0 ? true : options.allowUserToCreateOrganization;
		const isSystemAction = !session && ctx.body.userId;
		if (!canCreateOrg && !isSystemAction) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_ORGANIZATION);
		const adapter = getOrgAdapter(ctx.context, options);
		const userOrganizations = await adapter.listOrganizations(user.id);
		if (typeof options.organizationLimit === "number" ? userOrganizations.length >= options.organizationLimit : typeof options.organizationLimit === "function" ? await options.organizationLimit(user) : false) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_ORGANIZATIONS);
		if (await adapter.findOrganizationBySlug(ctx.body.slug)) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_ALREADY_EXISTS);
		let { keepCurrentActiveOrganization: _, userId: __, ...orgData } = ctx.body;
		if (options?.organizationHooks?.beforeCreateOrganization) {
			const response = await options?.organizationHooks.beforeCreateOrganization({
				organization: orgData,
				user
			});
			if (response && typeof response === "object" && "data" in response) orgData = {
				...ctx.body,
				...response.data
			};
		}
		const organization = await adapter.createOrganization({ organization: {
			...orgData,
			createdAt: /* @__PURE__ */ new Date()
		} });
		let member;
		let teamMember = null;
		let data = {
			userId: user.id,
			organizationId: organization.id,
			role: ctx.context.orgOptions.creatorRole || "owner"
		};
		if (options?.organizationHooks?.beforeAddMember) {
			const response = await options?.organizationHooks.beforeAddMember({
				member: {
					userId: user.id,
					organizationId: organization.id,
					role: ctx.context.orgOptions.creatorRole || "owner"
				},
				user,
				organization
			});
			if (response && typeof response === "object" && "data" in response) data = {
				...data,
				...response.data
			};
		}
		member = await adapter.createMember(data);
		if (options?.organizationHooks?.afterAddMember) await options?.organizationHooks.afterAddMember({
			member,
			user,
			organization
		});
		if (options?.teams?.enabled && options.teams.defaultTeam?.enabled !== false) {
			let teamData = {
				organizationId: organization.id,
				name: `${organization.name}`,
				createdAt: /* @__PURE__ */ new Date()
			};
			if (options?.organizationHooks?.beforeCreateTeam) {
				const response = await options?.organizationHooks.beforeCreateTeam({
					team: {
						organizationId: organization.id,
						name: `${organization.name}`
					},
					user,
					organization
				});
				if (response && typeof response === "object" && "data" in response) teamData = {
					...teamData,
					...response.data
				};
			}
			const defaultTeam = await options.teams.defaultTeam?.customCreateDefaultTeam?.(organization, ctx) || await adapter.createTeam(teamData);
			teamMember = await adapter.findOrCreateTeamMember({
				teamId: defaultTeam.id,
				userId: user.id
			});
			if (options?.organizationHooks?.afterCreateTeam) await options?.organizationHooks.afterCreateTeam({
				team: defaultTeam,
				user,
				organization
			});
		}
		if (options?.organizationHooks?.afterCreateOrganization) await options?.organizationHooks.afterCreateOrganization({
			organization,
			user,
			member
		});
		if (ctx.context.session && !ctx.body.keepCurrentActiveOrganization) await adapter.setActiveOrganization(ctx.context.session.session.token, organization.id, ctx);
		if (teamMember && ctx.context.session && !ctx.body.keepCurrentActiveOrganization) await adapter.setActiveTeam(ctx.context.session.session.token, teamMember.teamId, ctx);
		return ctx.json({
			...organization,
			metadata: organization.metadata && typeof organization.metadata === "string" ? JSON.parse(organization.metadata) : organization.metadata,
			members: [member]
		});
	});
};
var checkOrganizationSlugBodySchema = object({ slug: string().meta({ description: "The organization slug to check. Eg: \"my-org\"" }) });
var checkOrganizationSlug = (options) => createAuthEndpoint("/organization/check-slug", {
	method: "POST",
	body: checkOrganizationSlugBodySchema,
	use: [requestOnlySessionMiddleware, orgMiddleware]
}, async (ctx) => {
	if (!await getOrgAdapter(ctx.context, options).findOrganizationBySlug(ctx.body.slug)) return ctx.json({ status: true });
	throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_SLUG_ALREADY_TAKEN);
});
var baseUpdateOrganizationSchema = object({
	name: string().min(1).meta({ description: "The name of the organization" }).optional(),
	slug: string().min(1).meta({ description: "The slug of the organization" }).optional(),
	logo: string().meta({ description: "The logo of the organization" }).optional(),
	metadata: record(string(), any()).meta({ description: "The metadata of the organization" }).optional()
});
var updateOrganization = (options) => {
	return createAuthEndpoint("/organization/update", {
		method: "POST",
		body: object({
			data: object({
				...toZodSchema({
					fields: options?.schema?.organization?.additionalFields || {},
					isClientSide: true
				}).shape,
				...baseUpdateOrganizationSchema.shape
			}).partial(),
			organizationId: string().meta({ description: "The organization ID. Eg: \"org-id\"" }).optional()
		}),
		requireHeaders: true,
		use: [orgMiddleware],
		metadata: {
			$Infer: { body: {} },
			openapi: {
				description: "Update an organization",
				responses: { "200": {
					description: "Success",
					content: { "application/json": { schema: {
						type: "object",
						description: "The updated organization",
						$ref: "#/components/schemas/Organization"
					} } }
				} }
			}
		}
	}, async (ctx) => {
		const session = await ctx.context.getSession(ctx);
		if (!session) throw APIError.fromStatus("UNAUTHORIZED", { message: "User not found" });
		const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
		if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		const adapter = getOrgAdapter(ctx.context, options);
		const member = await adapter.findMemberByOrgId({
			userId: session.user.id,
			organizationId
		});
		if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
		if (!await hasPermission({
			permissions: { organization: ["update"] },
			role: member.role,
			options: ctx.context.orgOptions,
			organizationId
		}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_ORGANIZATION);
		if (typeof ctx.body.data.slug === "string") {
			const existingOrganization = await adapter.findOrganizationBySlug(ctx.body.data.slug);
			if (existingOrganization && existingOrganization.id !== organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_SLUG_ALREADY_TAKEN);
		}
		if (options?.organizationHooks?.beforeUpdateOrganization) {
			const response = await options.organizationHooks.beforeUpdateOrganization({
				organization: ctx.body.data,
				user: session.user,
				member
			});
			if (response && typeof response === "object" && "data" in response) ctx.body.data = {
				...ctx.body.data,
				...response.data
			};
		}
		const updatedOrg = await adapter.updateOrganization(organizationId, ctx.body.data);
		if (options?.organizationHooks?.afterUpdateOrganization) await options.organizationHooks.afterUpdateOrganization({
			organization: updatedOrg,
			user: session.user,
			member
		});
		return ctx.json(updatedOrg);
	});
};
var deleteOrganizationBodySchema = object({ organizationId: string().meta({ description: "The organization id to delete" }) });
var deleteOrganization = (options) => {
	return createAuthEndpoint("/organization/delete", {
		method: "POST",
		body: deleteOrganizationBodySchema,
		requireHeaders: true,
		use: [orgMiddleware],
		metadata: { openapi: {
			description: "Delete an organization",
			responses: { "200": {
				description: "Success",
				content: { "application/json": { schema: {
					type: "string",
					description: "The organization id that was deleted"
				} } }
			} }
		} }
	}, async (ctx) => {
		if (ctx.context.orgOptions.disableOrganizationDeletion) throw APIError.from("NOT_FOUND", {
			message: "Organization deletion is disabled",
			code: "ORGANIZATION_DELETION_DISABLED"
		});
		const session = await ctx.context.getSession(ctx);
		if (!session) throw APIError.fromStatus("UNAUTHORIZED");
		const organizationId = ctx.body.organizationId;
		if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		const adapter = getOrgAdapter(ctx.context, options);
		const member = await adapter.findMemberByOrgId({
			userId: session.user.id,
			organizationId
		});
		if (!member) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
		if (!await hasPermission({
			role: member.role,
			permissions: { organization: ["delete"] },
			organizationId,
			options: ctx.context.orgOptions
		}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_ORGANIZATION);
		if (organizationId === session.session.activeOrganizationId)
 /**
		* If the organization is deleted, we set the active organization to null
		*/
		await adapter.setActiveOrganization(session.session.token, null, ctx);
		const org = await adapter.findOrganizationById(organizationId);
		if (!org) throw APIError.fromStatus("BAD_REQUEST");
		if (options?.organizationHooks?.beforeDeleteOrganization) await options.organizationHooks.beforeDeleteOrganization({
			organization: org,
			user: session.user
		});
		await adapter.deleteOrganization(organizationId);
		if (options?.organizationHooks?.afterDeleteOrganization) await options.organizationHooks.afterDeleteOrganization({
			organization: org,
			user: session.user
		});
		return ctx.json(org);
	});
};
var getFullOrganizationQuerySchema = optional(object({
	organizationId: string().meta({ description: "The organization id to get" }).optional(),
	organizationSlug: string().meta({ description: "The organization slug to get" }).optional(),
	membersLimit: number().or(string().transform((val) => parseInt(val))).meta({ description: "The limit of members to get. By default, it uses the membershipLimit option." }).optional()
}));
var getFullOrganization = (options) => createAuthEndpoint("/organization/get-full-organization", {
	method: "GET",
	query: getFullOrganizationQuerySchema,
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware],
	metadata: { openapi: {
		operationId: "getOrganization",
		description: "Get the full organization",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				description: "The organization",
				$ref: "#/components/schemas/Organization"
			} } }
		} }
	} }
}, async (ctx) => {
	const session = ctx.context.session;
	const organizationId = ctx.query?.organizationSlug || ctx.query?.organizationId || session.session.activeOrganizationId;
	if (!organizationId) return ctx.json(null, { status: 200 });
	const adapter = getOrgAdapter(ctx.context, options);
	const organization = await adapter.findFullOrganization({
		organizationId,
		isSlug: !!ctx.query?.organizationSlug,
		includeTeams: ctx.context.orgOptions.teams?.enabled,
		membersLimit: ctx.query?.membersLimit
	});
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	if (!await adapter.checkMembership({
		userId: session.user.id,
		organizationId: organization.id
	})) {
		await adapter.setActiveOrganization(session.session.token, null, ctx);
		throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
	}
	return ctx.json(organization);
});
var setActiveOrganizationBodySchema = object({
	organizationId: string().meta({ description: "The organization id to set as active. It can be null to unset the active organization. Eg: \"org-id\"" }).nullable().optional(),
	organizationSlug: string().meta({ description: "The organization slug to set as active. It can be null to unset the active organization if organizationId is not provided. Eg: \"org-slug\"" }).optional()
});
var setActiveOrganization = (options) => {
	return createAuthEndpoint("/organization/set-active", {
		method: "POST",
		body: setActiveOrganizationBodySchema,
		use: [orgSessionMiddleware, orgMiddleware],
		requireHeaders: true,
		metadata: { openapi: {
			operationId: "setActiveOrganization",
			description: "Set the active organization",
			responses: { "200": {
				description: "Success",
				content: { "application/json": { schema: {
					type: "object",
					description: "The organization",
					$ref: "#/components/schemas/Organization"
				} } }
			} }
		} }
	}, async (ctx) => {
		const adapter = getOrgAdapter(ctx.context, options);
		const session = ctx.context.session;
		let organizationId = ctx.body.organizationId;
		const organizationSlug = ctx.body.organizationSlug;
		if (organizationId === null) {
			if (!session.session.activeOrganizationId) return ctx.json(null);
			await setSessionCookie(ctx, {
				session: await adapter.setActiveOrganization(session.session.token, null, ctx),
				user: session.user
			});
			return ctx.json(null);
		}
		if (!organizationId && !organizationSlug) {
			const sessionOrgId = session.session.activeOrganizationId;
			if (!sessionOrgId) return ctx.json(null);
			organizationId = sessionOrgId;
		}
		if (organizationSlug && !organizationId) {
			const organization = await adapter.findOrganizationBySlug(organizationSlug);
			if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
			organizationId = organization.id;
		}
		if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		if (!await adapter.checkMembership({
			userId: session.user.id,
			organizationId
		})) {
			await adapter.setActiveOrganization(session.session.token, null, ctx);
			throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
		}
		const organization = await adapter.findOrganizationById(organizationId);
		if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		await setSessionCookie(ctx, {
			session: await adapter.setActiveOrganization(session.session.token, organization.id, ctx),
			user: session.user
		});
		return ctx.json(organization);
	});
};
var listOrganizations = (options) => createAuthEndpoint("/organization/list", {
	method: "GET",
	use: [orgMiddleware, orgSessionMiddleware],
	requireHeaders: true,
	metadata: { openapi: {
		description: "List all organizations",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "array",
				items: { $ref: "#/components/schemas/Organization" }
			} } }
		} }
	} }
}, async (ctx) => {
	const organizations = await getOrgAdapter(ctx.context, options).listOrganizations(ctx.context.session.user.id);
	return ctx.json(organizations);
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/schema.mjs
var roleSchema = string();
var invitationStatus = _enum([
	"pending",
	"accepted",
	"rejected",
	"canceled"
]).default("pending");
object({
	id: string().default(generateId$1),
	name: string(),
	slug: string(),
	logo: string().nullish().optional(),
	metadata: record(string(), unknown()).or(string().transform((v) => JSON.parse(v))).optional(),
	createdAt: date()
});
object({
	id: string().default(generateId$1),
	organizationId: string(),
	userId: string$1(),
	role: roleSchema,
	createdAt: date().default(() => /* @__PURE__ */ new Date())
});
object({
	id: string().default(generateId$1),
	organizationId: string(),
	email: string(),
	role: roleSchema,
	status: invitationStatus,
	teamId: string().nullish(),
	inviterId: string(),
	expiresAt: date(),
	createdAt: date().default(() => /* @__PURE__ */ new Date())
});
var teamSchema = object({
	id: string().default(generateId$1),
	name: string().min(1),
	organizationId: string(),
	createdAt: date(),
	updatedAt: date().optional()
});
object({
	id: string().default(generateId$1),
	teamId: string(),
	userId: string(),
	createdAt: date().default(() => /* @__PURE__ */ new Date())
});
object({
	id: string().default(generateId$1),
	organizationId: string(),
	role: string(),
	permission: record(string(), array(string())),
	createdAt: date().default(() => /* @__PURE__ */ new Date()),
	updatedAt: date().optional()
});
var defaultRoles = [
	"admin",
	"member",
	"owner"
];
union([_enum(defaultRoles), array(_enum(defaultRoles))]);
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/routes/crud-team.mjs
var teamBaseSchema = object({
	name: string().meta({ description: "The name of the team. Eg: \"my-team\"" }),
	organizationId: string().meta({ description: "The organization ID which the team will be created in. Defaults to the active organization. Eg: \"organization-id\"" }).optional()
});
var createTeam = (options) => {
	const additionalFieldsSchema = toZodSchema({
		fields: options?.schema?.team?.additionalFields ?? {},
		isClientSide: true
	});
	return createAuthEndpoint("/organization/create-team", {
		method: "POST",
		body: object({
			...teamBaseSchema.shape,
			...additionalFieldsSchema.shape
		}),
		use: [orgMiddleware],
		metadata: {
			$Infer: { body: {} },
			openapi: {
				description: "Create a new team within an organization",
				responses: { "200": {
					description: "Team created successfully",
					content: { "application/json": { schema: {
						type: "object",
						properties: {
							id: {
								type: "string",
								description: "Unique identifier of the created team"
							},
							name: {
								type: "string",
								description: "Name of the team"
							},
							organizationId: {
								type: "string",
								description: "ID of the organization the team belongs to"
							},
							createdAt: {
								type: "string",
								format: "date-time",
								description: "Timestamp when the team was created"
							},
							updatedAt: {
								type: "string",
								format: "date-time",
								description: "Timestamp when the team was last updated"
							}
						},
						required: [
							"id",
							"name",
							"organizationId",
							"createdAt",
							"updatedAt"
						]
					} } }
				} }
			}
		}
	}, async (ctx) => {
		const session = await getSessionFromCtx(ctx);
		const organizationId = ctx.body.organizationId || session?.session.activeOrganizationId;
		if (!session && (ctx.request || ctx.headers)) throw APIError.fromStatus("UNAUTHORIZED");
		if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		const adapter = getOrgAdapter(ctx.context, options);
		if (session) {
			const member = await adapter.findMemberByOrgId({
				userId: session.user.id,
				organizationId
			});
			if (!member) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_INVITE_USERS_TO_THIS_ORGANIZATION);
			if (!await hasPermission({
				role: member.role,
				options: ctx.context.orgOptions,
				permissions: { team: ["create"] },
				organizationId
			}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CREATE_TEAMS_IN_THIS_ORGANIZATION);
		}
		const existingTeams = await adapter.listTeams(organizationId);
		const maximum = typeof ctx.context.orgOptions.teams?.maximumTeams === "function" ? await ctx.context.orgOptions.teams?.maximumTeams({
			organizationId,
			session
		}, ctx) : ctx.context.orgOptions.teams?.maximumTeams;
		if (maximum ? existingTeams.length >= maximum : false) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.YOU_HAVE_REACHED_THE_MAXIMUM_NUMBER_OF_TEAMS);
		const { name, organizationId: _, ...additionalFields } = ctx.body;
		const organization = await adapter.findOrganizationById(organizationId);
		if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		let teamData = {
			name,
			organizationId,
			createdAt: /* @__PURE__ */ new Date(),
			updatedAt: /* @__PURE__ */ new Date(),
			...additionalFields
		};
		if (options?.organizationHooks?.beforeCreateTeam) {
			const response = await options?.organizationHooks.beforeCreateTeam({
				team: {
					name,
					organizationId,
					...additionalFields
				},
				user: session?.user,
				organization
			});
			if (response && typeof response === "object" && "data" in response) teamData = {
				...teamData,
				...response.data
			};
		}
		const createdTeam = await adapter.createTeam(teamData);
		if (options?.organizationHooks?.afterCreateTeam) await options?.organizationHooks.afterCreateTeam({
			team: createdTeam,
			user: session?.user,
			organization
		});
		return ctx.json(createdTeam);
	});
};
var removeTeamBodySchema = object({
	teamId: string().meta({ description: `The team ID of the team to remove. Eg: "team-id"` }),
	organizationId: string().meta({ description: `The organization ID which the team falls under. If not provided, it will default to the user's active organization. Eg: "organization-id"` }).optional()
});
var removeTeam = (options) => createAuthEndpoint("/organization/remove-team", {
	method: "POST",
	body: removeTeamBodySchema,
	use: [orgMiddleware],
	metadata: { openapi: {
		description: "Remove a team from an organization",
		responses: { "200": {
			description: "Team removed successfully",
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: {
					type: "string",
					description: "Confirmation message indicating successful removal",
					enum: ["Team removed successfully."]
				} },
				required: ["message"]
			} } }
		} }
	} }
}, async (ctx) => {
	const session = await getSessionFromCtx(ctx);
	const organizationId = ctx.body.organizationId || session?.session.activeOrganizationId;
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	if (!session && (ctx.request || ctx.headers)) throw APIError.fromStatus("UNAUTHORIZED");
	const adapter = getOrgAdapter(ctx.context, options);
	if (session) {
		const member = await adapter.findMemberByOrgId({
			userId: session.user.id,
			organizationId
		});
		if (!member || session.session?.activeTeamId === ctx.body.teamId) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_THIS_TEAM);
		if (!await hasPermission({
			role: member.role,
			options: ctx.context.orgOptions,
			permissions: { team: ["delete"] },
			organizationId
		}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_DELETE_TEAMS_IN_THIS_ORGANIZATION);
	}
	const team = await adapter.findTeamById({
		teamId: ctx.body.teamId,
		organizationId
	});
	if (!team || team.organizationId !== organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TEAM_NOT_FOUND);
	if (!ctx.context.orgOptions.teams?.allowRemovingAllTeams) {
		if ((await adapter.listTeams(organizationId)).length <= 1) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.UNABLE_TO_REMOVE_LAST_TEAM);
	}
	const organization = await adapter.findOrganizationById(organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	if (options?.organizationHooks?.beforeDeleteTeam) await options?.organizationHooks.beforeDeleteTeam({
		team,
		user: session?.user,
		organization
	});
	await adapter.deleteTeam(team.id);
	if (options?.organizationHooks?.afterDeleteTeam) await options?.organizationHooks.afterDeleteTeam({
		team,
		user: session?.user,
		organization
	});
	return ctx.json({ message: "Team removed successfully." });
});
var updateTeam = (options) => {
	const additionalFieldsSchema = toZodSchema({
		fields: options?.schema?.team?.additionalFields ?? {},
		isClientSide: true
	});
	return createAuthEndpoint("/organization/update-team", {
		method: "POST",
		body: object({
			teamId: string().meta({ description: `The ID of the team to be updated. Eg: "team-id"` }),
			data: object({
				...teamSchema.shape,
				...additionalFieldsSchema.shape
			}).partial()
		}),
		requireHeaders: true,
		use: [orgMiddleware, orgSessionMiddleware],
		metadata: {
			$Infer: { body: {} },
			openapi: {
				description: "Update an existing team in an organization",
				responses: { "200": {
					description: "Team updated successfully",
					content: { "application/json": { schema: {
						type: "object",
						properties: {
							id: {
								type: "string",
								description: "Unique identifier of the updated team"
							},
							name: {
								type: "string",
								description: "Updated name of the team"
							},
							organizationId: {
								type: "string",
								description: "ID of the organization the team belongs to"
							},
							createdAt: {
								type: "string",
								format: "date-time",
								description: "Timestamp when the team was created"
							},
							updatedAt: {
								type: "string",
								format: "date-time",
								description: "Timestamp when the team was last updated"
							}
						},
						required: [
							"id",
							"name",
							"organizationId",
							"createdAt",
							"updatedAt"
						]
					} } }
				} }
			}
		}
	}, async (ctx) => {
		const session = ctx.context.session;
		const organizationId = ctx.body.data.organizationId || session.session.activeOrganizationId;
		if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		const adapter = getOrgAdapter(ctx.context, options);
		const member = await adapter.findMemberByOrgId({
			userId: session.user.id,
			organizationId
		});
		if (!member) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM);
		if (!await hasPermission({
			role: member.role,
			options: ctx.context.orgOptions,
			permissions: { team: ["update"] },
			organizationId
		}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_UPDATE_THIS_TEAM);
		const team = await adapter.findTeamById({
			teamId: ctx.body.teamId,
			organizationId
		});
		if (!team || team.organizationId !== organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TEAM_NOT_FOUND);
		const { name, organizationId: __, ...additionalFields } = ctx.body.data;
		const organization = await adapter.findOrganizationById(organizationId);
		if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
		const updates = {
			name,
			...additionalFields
		};
		if (options?.organizationHooks?.beforeUpdateTeam) {
			const response = await options?.organizationHooks.beforeUpdateTeam({
				team,
				updates,
				user: session.user,
				organization
			});
			if (response && typeof response === "object" && "data" in response) {
				const modifiedUpdates = response.data;
				const updatedTeam = await adapter.updateTeam(team.id, modifiedUpdates);
				if (options?.organizationHooks?.afterUpdateTeam) await options?.organizationHooks.afterUpdateTeam({
					team: updatedTeam,
					user: session.user,
					organization
				});
				return ctx.json(updatedTeam);
			}
		}
		const updatedTeam = await adapter.updateTeam(team.id, updates);
		if (options?.organizationHooks?.afterUpdateTeam) await options?.organizationHooks.afterUpdateTeam({
			team: updatedTeam,
			user: session.user,
			organization
		});
		return ctx.json(updatedTeam);
	});
};
var listOrganizationTeamsQuerySchema = optional(object({ organizationId: string().meta({ description: `The organization ID which the teams are under to list. Defaults to the users active organization. Eg: "organization-id"` }).optional() }));
var listOrganizationTeams = (options) => createAuthEndpoint("/organization/list-teams", {
	method: "GET",
	query: listOrganizationTeamsQuerySchema,
	metadata: { openapi: {
		description: "List all teams in an organization",
		responses: { "200": {
			description: "Teams retrieved successfully",
			content: { "application/json": { schema: {
				type: "array",
				items: {
					type: "object",
					properties: {
						id: {
							type: "string",
							description: "Unique identifier of the team"
						},
						name: {
							type: "string",
							description: "Name of the team"
						},
						organizationId: {
							type: "string",
							description: "ID of the organization the team belongs to"
						},
						createdAt: {
							type: "string",
							format: "date-time",
							description: "Timestamp when the team was created"
						},
						updatedAt: {
							type: "string",
							format: "date-time",
							description: "Timestamp when the team was last updated"
						}
					},
					required: [
						"id",
						"name",
						"organizationId",
						"createdAt",
						"updatedAt"
					]
				},
				description: "Array of team objects within the organization"
			} } }
		} }
	} },
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	const organizationId = ctx.query?.organizationId || session?.session.activeOrganizationId;
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const adapter = getOrgAdapter(ctx.context, options);
	if (!await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId: organizationId || ""
	})) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_ACCESS_THIS_ORGANIZATION);
	const teams = await adapter.listTeams(organizationId);
	return ctx.json(teams);
});
var setActiveTeamBodySchema = object({ teamId: string().meta({ description: "The team id to set as active. It can be null to unset the active team" }).nullable().optional() });
var setActiveTeam = (options) => createAuthEndpoint("/organization/set-active-team", {
	method: "POST",
	body: setActiveTeamBodySchema,
	requireHeaders: true,
	use: [orgSessionMiddleware, orgMiddleware],
	metadata: { openapi: {
		description: "Set the active team for the current active organization",
		responses: { "200": {
			description: "Success",
			content: { "application/json": { schema: {
				type: "object",
				description: "The team",
				$ref: "#/components/schemas/Team"
			} } }
		} }
	} }
}, async (ctx) => {
	const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
	const session = ctx.context.session;
	if (ctx.body.teamId === null) {
		if (!session.session.activeTeamId) return ctx.json(null);
		await setSessionCookie(ctx, {
			session: await adapter.setActiveTeam(session.session.token, null, ctx),
			user: session.user
		});
		return ctx.json(null);
	}
	let teamId;
	if (!ctx.body.teamId) {
		const sessionTeamId = session.session.activeTeamId;
		if (!sessionTeamId) return ctx.json(null);
		else teamId = sessionTeamId;
	} else teamId = ctx.body.teamId;
	const activeOrganizationId = session.session.activeOrganizationId;
	if (!activeOrganizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const team = await adapter.findTeamById({
		teamId,
		organizationId: activeOrganizationId
	});
	if (!team) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TEAM_NOT_FOUND);
	if (!await adapter.findTeamMember({
		teamId,
		userId: session.user.id
	})) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_TEAM);
	await setSessionCookie(ctx, {
		session: await adapter.setActiveTeam(session.session.token, team.id, ctx),
		user: session.user
	});
	return ctx.json(team);
});
var listUserTeams = (options) => createAuthEndpoint("/organization/list-user-teams", {
	method: "GET",
	metadata: { openapi: {
		description: "List all teams that the current user is a part of.",
		responses: { "200": {
			description: "Teams retrieved successfully",
			content: { "application/json": { schema: {
				type: "array",
				items: {
					type: "object",
					description: "The team",
					$ref: "#/components/schemas/Team"
				},
				description: "Array of team objects within the organization"
			} } }
		} }
	} },
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	const teams = await getOrgAdapter(ctx.context, ctx.context.orgOptions).listTeamsByUser({ userId: session.user.id });
	return ctx.json(teams);
});
var listTeamMembersQuerySchema = optional(object({ teamId: string().optional().meta({ description: "The team whose members we should return. If this is not provided the members of the current active team get returned." }) }));
var listTeamMembers = (options) => createAuthEndpoint("/organization/list-team-members", {
	method: "GET",
	query: listTeamMembersQuerySchema,
	metadata: { openapi: {
		description: "List the members of the given team.",
		responses: { "200": {
			description: "Teams retrieved successfully",
			content: { "application/json": { schema: {
				type: "array",
				items: {
					type: "object",
					description: "The team member",
					properties: {
						id: {
							type: "string",
							description: "Unique identifier of the team member"
						},
						userId: {
							type: "string",
							description: "The user ID of the team member"
						},
						teamId: {
							type: "string",
							description: "The team ID of the team the team member is in"
						},
						createdAt: {
							type: "string",
							format: "date-time",
							description: "Timestamp when the team member was created"
						}
					},
					required: [
						"id",
						"userId",
						"teamId",
						"createdAt"
					]
				},
				description: "Array of team member objects within the team"
			} } }
		} }
	} },
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
	const teamId = ctx.query?.teamId || session?.session.activeTeamId;
	if (!teamId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.YOU_DO_NOT_HAVE_AN_ACTIVE_TEAM);
	if (!await adapter.findTeamMember({
		userId: session.user.id,
		teamId
	})) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_TEAM);
	const members = await adapter.listTeamMembers({ teamId });
	return ctx.json(members);
});
var addTeamMemberBodySchema = object({
	teamId: string().meta({ description: "The team the user should be a member of." }),
	userId: string$1().meta({ description: "The user Id which represents the user to be added as a member." }),
	organizationId: string().meta({ description: "The organization ID which the team falls under. If not provided, it will default to the user's active organization." }).optional()
});
var addTeamMember = (options) => createAuthEndpoint("/organization/add-team-member", {
	method: "POST",
	body: addTeamMemberBodySchema,
	metadata: { openapi: {
		description: "The newly created member",
		responses: { "200": {
			description: "Team member created successfully",
			content: { "application/json": { schema: {
				type: "object",
				description: "The team member",
				properties: {
					id: {
						type: "string",
						description: "Unique identifier of the team member"
					},
					userId: {
						type: "string",
						description: "The user ID of the team member"
					},
					teamId: {
						type: "string",
						description: "The team ID of the team the team member is in"
					},
					createdAt: {
						type: "string",
						format: "date-time",
						description: "Timestamp when the team member was created"
					}
				},
				required: [
					"id",
					"userId",
					"teamId",
					"createdAt"
				]
			} } }
		} }
	} },
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
	const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const currentMember = await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId
	});
	if (!currentMember) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
	if (!await hasPermission({
		role: currentMember.role,
		options: ctx.context.orgOptions,
		permissions: { member: ["update"] },
		organizationId
	}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_CREATE_A_NEW_TEAM_MEMBER);
	if (!await adapter.findMemberByOrgId({
		userId: ctx.body.userId,
		organizationId
	})) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
	const team = await adapter.findTeamById({
		teamId: ctx.body.teamId,
		organizationId
	});
	if (!team) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TEAM_NOT_FOUND);
	const organization = await adapter.findOrganizationById(organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	const userBeingAdded = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
	if (!userBeingAdded) throw APIError.fromStatus("BAD_REQUEST", { message: "User not found" });
	if (options?.organizationHooks?.beforeAddTeamMember) {
		const response = await options?.organizationHooks.beforeAddTeamMember({
			teamMember: {
				teamId: ctx.body.teamId,
				userId: ctx.body.userId
			},
			team,
			user: userBeingAdded,
			organization
		});
		if (response && typeof response === "object" && "data" in response) {}
	}
	const teamMember = await adapter.findOrCreateTeamMember({
		teamId: ctx.body.teamId,
		userId: ctx.body.userId
	});
	if (options?.organizationHooks?.afterAddTeamMember) await options?.organizationHooks.afterAddTeamMember({
		teamMember,
		team,
		user: userBeingAdded,
		organization
	});
	return ctx.json(teamMember);
});
var removeTeamMemberBodySchema = object({
	teamId: string().meta({ description: "The team the user should be removed from." }),
	userId: string$1().meta({ description: "The user which should be removed from the team." }),
	organizationId: string().meta({ description: "The organization ID which the team falls under. If not provided, it will default to the user's active organization." }).optional()
});
var removeTeamMember = (options) => createAuthEndpoint("/organization/remove-team-member", {
	method: "POST",
	body: removeTeamMemberBodySchema,
	metadata: { openapi: {
		description: "Remove a member from a team",
		responses: { "200": {
			description: "Team member removed successfully",
			content: { "application/json": { schema: {
				type: "object",
				properties: { message: {
					type: "string",
					description: "Confirmation message indicating successful removal",
					enum: ["Team member removed successfully."]
				} },
				required: ["message"]
			} } }
		} }
	} },
	requireHeaders: true,
	use: [orgMiddleware, orgSessionMiddleware]
}, async (ctx) => {
	const session = ctx.context.session;
	const adapter = getOrgAdapter(ctx.context, ctx.context.orgOptions);
	const organizationId = ctx.body.organizationId || session.session.activeOrganizationId;
	if (!organizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
	const currentMember = await adapter.findMemberByOrgId({
		userId: session.user.id,
		organizationId
	});
	if (!currentMember) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
	if (!await hasPermission({
		role: currentMember.role,
		options: ctx.context.orgOptions,
		permissions: { member: ["delete"] },
		organizationId
	}, ctx)) throw APIError.from("FORBIDDEN", ORGANIZATION_ERROR_CODES.YOU_ARE_NOT_ALLOWED_TO_REMOVE_A_TEAM_MEMBER);
	if (!await adapter.findMemberByOrgId({
		userId: ctx.body.userId,
		organizationId
	})) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
	const team = await adapter.findTeamById({
		teamId: ctx.body.teamId,
		organizationId
	});
	if (!team) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.TEAM_NOT_FOUND);
	const organization = await adapter.findOrganizationById(organizationId);
	if (!organization) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.ORGANIZATION_NOT_FOUND);
	const userBeingRemoved = await ctx.context.internalAdapter.findUserById(ctx.body.userId);
	if (!userBeingRemoved) throw APIError.fromStatus("BAD_REQUEST", { message: "User not found" });
	const teamMember = await adapter.findTeamMember({
		teamId: ctx.body.teamId,
		userId: ctx.body.userId
	});
	if (!teamMember) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_TEAM);
	if (options?.organizationHooks?.beforeRemoveTeamMember) await options?.organizationHooks.beforeRemoveTeamMember({
		teamMember,
		team,
		user: userBeingRemoved,
		organization
	});
	await adapter.removeTeamMember({
		teamId: ctx.body.teamId,
		userId: ctx.body.userId
	});
	if (options?.organizationHooks?.afterRemoveTeamMember) await options?.organizationHooks.afterRemoveTeamMember({
		teamMember,
		team,
		user: userBeingRemoved,
		organization
	});
	return ctx.json({ message: "Team member removed successfully." });
});
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/organization/organization.mjs
function parseRoles(roles) {
	return Array.isArray(roles) ? roles.join(",") : roles;
}
var createHasPermissionBodySchema = object({ organizationId: string().optional() }).and(xor([object({ permission: record(string(), array(string())) }), object({ permissions: record(string(), array(string())) })]));
var createHasPermission = (options) => {
	return createAuthEndpoint("/organization/has-permission", {
		method: "POST",
		requireHeaders: true,
		body: createHasPermissionBodySchema,
		use: [orgSessionMiddleware],
		metadata: {
			$Infer: { body: {} },
			openapi: {
				description: "Check if the user has permission",
				requestBody: { content: { "application/json": { schema: {
					type: "object",
					properties: {
						permission: {
							type: "object",
							description: "The permission to check",
							deprecated: true
						},
						permissions: {
							type: "object",
							description: "The permission to check"
						}
					},
					required: ["permissions"]
				} } } },
				responses: { "200": {
					description: "Success",
					content: { "application/json": { schema: {
						type: "object",
						properties: {
							error: { type: "string" },
							success: { type: "boolean" }
						},
						required: ["success"]
					} } }
				} }
			}
		}
	}, async (ctx) => {
		const activeOrganizationId = ctx.body.organizationId || ctx.context.session.session.activeOrganizationId;
		if (!activeOrganizationId) throw APIError.from("BAD_REQUEST", ORGANIZATION_ERROR_CODES.NO_ACTIVE_ORGANIZATION);
		const member = await getOrgAdapter(ctx.context, options).findMemberByOrgId({
			userId: ctx.context.session.user.id,
			organizationId: activeOrganizationId
		});
		if (!member) throw APIError.from("UNAUTHORIZED", ORGANIZATION_ERROR_CODES.USER_IS_NOT_A_MEMBER_OF_THE_ORGANIZATION);
		const result = await hasPermission({
			role: member.role,
			options,
			permissions: ctx.body.permissions,
			organizationId: activeOrganizationId
		}, ctx);
		return ctx.json({
			error: null,
			success: result
		});
	});
};
function organization(options) {
	const opts = options || {};
	let endpoints = {
		createOrganization: createOrganization(opts),
		updateOrganization: updateOrganization(opts),
		deleteOrganization: deleteOrganization(opts),
		setActiveOrganization: setActiveOrganization(opts),
		getFullOrganization: getFullOrganization(opts),
		listOrganizations: listOrganizations(opts),
		createInvitation: createInvitation(opts),
		cancelInvitation: cancelInvitation(opts),
		acceptInvitation: acceptInvitation(opts),
		getInvitation: getInvitation(opts),
		rejectInvitation: rejectInvitation(opts),
		listInvitations: listInvitations(opts),
		getActiveMember: getActiveMember(opts),
		checkOrganizationSlug: checkOrganizationSlug(opts),
		addMember: addMember(opts),
		removeMember: removeMember(opts),
		updateMemberRole: updateMemberRole(opts),
		leaveOrganization: leaveOrganization(opts),
		listUserInvitations: listUserInvitations(opts),
		listMembers: listMembers(opts),
		getActiveMemberRole: getActiveMemberRole(opts)
	};
	const teamSupport = opts.teams?.enabled;
	const teamEndpoints = {
		createTeam: createTeam(opts),
		listOrganizationTeams: listOrganizationTeams(opts),
		removeTeam: removeTeam(opts),
		updateTeam: updateTeam(opts),
		setActiveTeam: setActiveTeam(opts),
		listUserTeams: listUserTeams(opts),
		listTeamMembers: listTeamMembers(opts),
		addTeamMember: addTeamMember(opts),
		removeTeamMember: removeTeamMember(opts)
	};
	if (teamSupport) endpoints = {
		...endpoints,
		...teamEndpoints
	};
	const dynamicAccessControlEndpoints = {
		createOrgRole: createOrgRole(opts),
		deleteOrgRole: deleteOrgRole(opts),
		listOrgRoles: listOrgRoles(opts),
		getOrgRole: getOrgRole(opts),
		updateOrgRole: updateOrgRole(opts)
	};
	if (opts.dynamicAccessControl?.enabled) endpoints = {
		...endpoints,
		...dynamicAccessControlEndpoints
	};
	const roles = {
		...defaultRoles$1,
		...opts.roles
	};
	const teamSchema = teamSupport ? {
		team: {
			modelName: opts.schema?.team?.modelName,
			fields: {
				name: {
					type: "string",
					required: true,
					fieldName: opts.schema?.team?.fields?.name
				},
				organizationId: {
					type: "string",
					required: true,
					references: {
						model: "organization",
						field: "id"
					},
					fieldName: opts.schema?.team?.fields?.organizationId,
					index: true
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.team?.fields?.createdAt
				},
				updatedAt: {
					type: "date",
					required: false,
					fieldName: opts.schema?.team?.fields?.updatedAt,
					onUpdate: () => /* @__PURE__ */ new Date()
				},
				...opts.schema?.team?.additionalFields || {}
			}
		},
		teamMember: {
			modelName: opts.schema?.teamMember?.modelName,
			fields: {
				teamId: {
					type: "string",
					required: true,
					references: {
						model: "team",
						field: "id"
					},
					fieldName: opts.schema?.teamMember?.fields?.teamId,
					index: true
				},
				userId: {
					type: "string",
					required: true,
					references: {
						model: "user",
						field: "id"
					},
					fieldName: opts.schema?.teamMember?.fields?.userId,
					index: true
				},
				createdAt: {
					type: "date",
					required: false,
					fieldName: opts.schema?.teamMember?.fields?.createdAt
				}
			}
		}
	} : {};
	const organizationRoleSchema = opts.dynamicAccessControl?.enabled ? { organizationRole: {
		fields: {
			organizationId: {
				type: "string",
				required: true,
				references: {
					model: "organization",
					field: "id"
				},
				fieldName: opts.schema?.organizationRole?.fields?.organizationId,
				index: true
			},
			role: {
				type: "string",
				required: true,
				fieldName: opts.schema?.organizationRole?.fields?.role,
				index: true
			},
			permission: {
				type: "string",
				required: true,
				fieldName: opts.schema?.organizationRole?.fields?.permission
			},
			createdAt: {
				type: "date",
				required: true,
				defaultValue: () => /* @__PURE__ */ new Date(),
				fieldName: opts.schema?.organizationRole?.fields?.createdAt
			},
			updatedAt: {
				type: "date",
				required: false,
				fieldName: opts.schema?.organizationRole?.fields?.updatedAt,
				onUpdate: () => /* @__PURE__ */ new Date()
			},
			...opts.schema?.organizationRole?.additionalFields || {}
		},
		modelName: opts.schema?.organizationRole?.modelName
	} } : {};
	const schema = {
		organization: {
			modelName: opts.schema?.organization?.modelName,
			fields: {
				name: {
					type: "string",
					required: true,
					sortable: true,
					fieldName: opts.schema?.organization?.fields?.name
				},
				slug: {
					type: "string",
					required: true,
					unique: true,
					sortable: true,
					fieldName: opts.schema?.organization?.fields?.slug,
					index: true
				},
				logo: {
					type: "string",
					required: false,
					fieldName: opts.schema?.organization?.fields?.logo
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.organization?.fields?.createdAt
				},
				metadata: {
					type: "string",
					required: false,
					fieldName: opts.schema?.organization?.fields?.metadata
				},
				...opts.schema?.organization?.additionalFields || {}
			}
		},
		...organizationRoleSchema,
		...teamSchema,
		member: {
			modelName: opts.schema?.member?.modelName,
			fields: {
				organizationId: {
					type: "string",
					required: true,
					references: {
						model: "organization",
						field: "id"
					},
					fieldName: opts.schema?.member?.fields?.organizationId,
					index: true
				},
				userId: {
					type: "string",
					required: true,
					fieldName: opts.schema?.member?.fields?.userId,
					references: {
						model: "user",
						field: "id"
					},
					index: true
				},
				role: {
					type: "string",
					required: true,
					sortable: true,
					defaultValue: "member",
					fieldName: opts.schema?.member?.fields?.role
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.member?.fields?.createdAt
				},
				...opts.schema?.member?.additionalFields || {}
			}
		},
		invitation: {
			modelName: opts.schema?.invitation?.modelName,
			fields: {
				organizationId: {
					type: "string",
					required: true,
					references: {
						model: "organization",
						field: "id"
					},
					fieldName: opts.schema?.invitation?.fields?.organizationId,
					index: true
				},
				email: {
					type: "string",
					required: true,
					sortable: true,
					fieldName: opts.schema?.invitation?.fields?.email,
					index: true
				},
				role: {
					type: "string",
					required: false,
					sortable: true,
					fieldName: opts.schema?.invitation?.fields?.role
				},
				...teamSupport ? { teamId: {
					type: "string",
					required: false,
					sortable: true,
					fieldName: opts.schema?.invitation?.fields?.teamId
				} } : {},
				status: {
					type: "string",
					required: true,
					sortable: true,
					defaultValue: "pending",
					fieldName: opts.schema?.invitation?.fields?.status
				},
				expiresAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.invitation?.fields?.expiresAt
				},
				createdAt: {
					type: "date",
					required: true,
					fieldName: opts.schema?.invitation?.fields?.createdAt,
					defaultValue: () => /* @__PURE__ */ new Date()
				},
				inviterId: {
					type: "string",
					references: {
						model: "user",
						field: "id"
					},
					fieldName: opts.schema?.invitation?.fields?.inviterId,
					required: true
				},
				...opts.schema?.invitation?.additionalFields || {}
			}
		}
	};
	return {
		id: "organization",
		version: PACKAGE_VERSION,
		endpoints: {
			...shimContext(endpoints, {
				orgOptions: opts,
				roles,
				getSession: async (context) => {
					return await getSessionFromCtx(context);
				}
			}),
			hasPermission: createHasPermission(opts)
		},
		schema: {
			...schema,
			session: { fields: {
				activeOrganizationId: {
					type: "string",
					required: false,
					fieldName: opts.schema?.session?.fields?.activeOrganizationId
				},
				...teamSupport ? { activeTeamId: {
					type: "string",
					required: false,
					fieldName: opts.schema?.session?.fields?.activeTeamId
				} } : {}
			} }
		},
		$Infer: {
			Organization: {},
			Invitation: {},
			Member: {},
			Team: teamSupport ? {} : {},
			TeamMember: teamSupport ? {} : {},
			ActiveOrganization: {}
		},
		$ERROR_CODES: ORGANIZATION_ERROR_CODES,
		options: opts
	};
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/jwt/adapter.mjs
var getJwksAdapter = (adapter, options) => {
	return {
		getAllKeys: async (ctx) => {
			if (options?.adapter?.getJwks) return await options.adapter.getJwks(ctx);
			return await adapter.findMany({ model: "jwks" });
		},
		getLatestKey: async (ctx) => {
			if (options?.adapter?.getJwks) return (await options.adapter.getJwks(ctx))?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
			return (await adapter.findMany({ model: "jwks" }))?.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())[0];
		},
		createJwk: async (ctx, webKey) => {
			if (options?.adapter?.createJwk) return await options.adapter.createJwk(webKey, ctx);
			return await adapter.create({
				model: "jwks",
				data: {
					...webKey,
					createdAt: /* @__PURE__ */ new Date()
				}
			});
		}
	};
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/jwt/schema.mjs
var schema = { jwks: { fields: {
	publicKey: {
		type: "string",
		required: true
	},
	privateKey: {
		type: "string",
		required: true
	},
	createdAt: {
		type: "date",
		required: true
	},
	expiresAt: {
		type: "date",
		required: false
	}
} } };
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/jwt/utils.mjs
/**
* Converts an expirationTime to ISO seconds expiration time (the format of JWT exp)
*
* See https://github.com/panva/jose/blob/main/src/lib/jwt_claims_set.ts#L245
*
* @param expirationTime - see options.jwt.expirationTime
* @param iat - the iat time to consolidate on
* @returns
*/
function toExpJWT(expirationTime, iat) {
	if (typeof expirationTime === "number") return expirationTime;
	else if (expirationTime instanceof Date) return Math.floor(expirationTime.getTime() / 1e3);
	else return iat + sec(expirationTime);
}
async function generateExportedKeyPair(options) {
	const { alg, ...cfg } = options?.jwks?.keyPairConfig ?? {
		alg: "EdDSA",
		crv: "Ed25519"
	};
	const { publicKey, privateKey } = await generateKeyPair(alg, {
		...cfg,
		extractable: true
	});
	return {
		publicWebKey: await exportJWK(publicKey),
		privateWebKey: await exportJWK(privateKey),
		alg,
		cfg
	};
}
/**
* Creates a Jwk on the database
*
* @param ctx
* @param options
* @returns
*/
async function createJwk(ctx, options) {
	const { publicWebKey, privateWebKey, alg, cfg } = await generateExportedKeyPair(options);
	const stringifiedPrivateWebKey = JSON.stringify(privateWebKey);
	const privateKeyEncryptionEnabled = !options?.jwks?.disablePrivateKeyEncryption;
	const jwk = {
		alg,
		...cfg && "crv" in cfg ? { crv: cfg.crv } : {},
		publicKey: JSON.stringify(publicWebKey),
		privateKey: privateKeyEncryptionEnabled ? JSON.stringify(await symmetricEncrypt({
			key: ctx.context.secretConfig,
			data: stringifiedPrivateWebKey
		})) : stringifiedPrivateWebKey,
		createdAt: /* @__PURE__ */ new Date(),
		...options?.jwks?.rotationInterval ? { expiresAt: new Date(Date.now() + options.jwks.rotationInterval * 1e3) } : {}
	};
	return await getJwksAdapter(ctx.context.adapter, options).createJwk(ctx, jwk);
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/jwt/sign.mjs
async function signJWT(ctx, config) {
	const { options } = config;
	const payload = config.payload;
	const nowSeconds = Math.floor(Date.now() / 1e3);
	const iat = payload.iat;
	let exp = payload.exp;
	const defaultExp = toExpJWT(options?.jwt?.expirationTime ?? "15m", iat ?? nowSeconds);
	exp = exp ?? defaultExp;
	const nbf = payload.nbf;
	const baseURLOrigin = typeof ctx.context.options.baseURL === "string" ? ctx.context.options.baseURL : "";
	const iss = payload.iss;
	const defaultIss = options?.jwt?.issuer ?? baseURLOrigin;
	const aud = payload.aud;
	const defaultAud = options?.jwt?.audience ?? baseURLOrigin;
	if (options?.jwt?.sign) {
		const jwtPayload = {
			...payload,
			iat,
			exp,
			nbf,
			iss: iss ?? defaultIss,
			aud: aud ?? defaultAud
		};
		return options.jwt.sign(jwtPayload);
	}
	let key = await getJwksAdapter(ctx.context.adapter, options).getLatestKey(ctx);
	if (!key || key.expiresAt && key.expiresAt < /* @__PURE__ */ new Date()) key = await createJwk(ctx, options);
	const privateWebKey = !options?.jwks?.disablePrivateKeyEncryption ? await symmetricDecrypt({
		key: ctx.context.secretConfig,
		data: JSON.parse(key.privateKey)
	}).catch(() => {
		throw new BetterAuthError("Failed to decrypt private key. Make sure the secret currently in use is the same as the one used to encrypt the private key. If you are using a different secret, either clean up your JWKS or disable private key encryption.");
	}) : key.privateKey;
	const alg = key.alg ?? options?.jwks?.keyPairConfig?.alg ?? "EdDSA";
	const privateKey = await importJWK(JSON.parse(privateWebKey), alg);
	const jwt = new SignJWT(payload).setProtectedHeader({
		alg,
		kid: key.id
	}).setExpirationTime(exp).setIssuer(iss ?? defaultIss).setAudience(aud ?? defaultAud);
	if (iat) jwt.setIssuedAt(iat);
	if (payload.sub) jwt.setSubject(payload.sub);
	if (payload.nbf) jwt.setNotBefore(payload.nbf);
	if (payload.jti) jwt.setJti(payload.jti);
	return await jwt.sign(privateKey);
}
async function getJwtToken(ctx, options) {
	const payload = !options?.jwt?.definePayload ? ctx.context.session.user : await options.jwt.definePayload(ctx.context.session);
	return await signJWT(ctx, {
		options,
		payload: {
			iat: Math.floor(Date.now() / 1e3),
			...payload,
			sub: await options?.jwt?.getSubject?.(ctx.context.session) ?? ctx.context.session.user.id
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/jwt/verify.mjs
/**
* Verify a JWT token using the JWKS public keys
* Returns the payload if valid, null otherwise
*/
async function verifyJWT(token, options) {
	const ctx = await getCurrentAuthContext();
	try {
		const parts = token.split(".");
		if (parts.length !== 3) return null;
		const headerStr = new TextDecoder().decode(base64.decode(parts[0]));
		const kid = JSON.parse(headerStr).kid;
		if (!kid) {
			ctx.context.logger.debug("JWT missing kid in header");
			return null;
		}
		const keys = await getJwksAdapter(ctx.context.adapter, options).getAllKeys(ctx);
		if (!keys || keys.length === 0) {
			ctx.context.logger.debug("No JWKS keys available");
			return null;
		}
		const key = keys.find((k) => k.id === kid);
		if (!key) {
			ctx.context.logger.debug(`No JWKS key found for kid: ${kid}`);
			return null;
		}
		const cryptoKey = await importJWK(JSON.parse(key.publicKey), key.alg ?? options?.jwks?.keyPairConfig?.alg ?? "EdDSA");
		const baseURLOrigin = typeof ctx.context.options.baseURL === "string" ? ctx.context.options.baseURL : void 0;
		const { payload } = await jwtVerify(token, cryptoKey, {
			issuer: options?.jwt?.issuer ?? baseURLOrigin,
			audience: options?.jwt?.audience ?? baseURLOrigin
		});
		if (!payload.sub || !payload.aud) return null;
		return payload;
	} catch (error) {
		ctx.context.logger.debug("JWT verification failed", error);
		return null;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/jwt/index.mjs
var signJWTBodySchema = object({
	payload: record(string(), any()),
	overrideOptions: record(string(), any()).optional()
});
var verifyJWTBodySchema = object({
	token: string(),
	issuer: string().optional()
});
var jwt = (options) => {
	if (options?.jwt?.sign && !options.jwks?.remoteUrl) throw new BetterAuthError("options.jwks.remoteUrl must be set when using options.jwt.sign");
	if (options?.jwks?.remoteUrl && !options.jwks?.keyPairConfig?.alg) throw new BetterAuthError("options.jwks.keyPairConfig.alg must be specified when using the oidc plugin with options.jwks.remoteUrl");
	const jwksPath = options?.jwks?.jwksPath ?? "/jwks";
	if (typeof jwksPath !== "string" || jwksPath.length === 0 || !jwksPath.startsWith("/") || jwksPath.includes("..")) throw new BetterAuthError("options.jwks.jwksPath must be a non-empty string starting with '/' and not contain '..'");
	return {
		id: "jwt",
		version: PACKAGE_VERSION,
		options,
		endpoints: {
			getJwks: createAuthEndpoint(jwksPath, {
				method: "GET",
				metadata: { openapi: {
					operationId: "getJSONWebKeySet",
					description: "Get the JSON Web Key Set",
					responses: { "200": {
						description: "JSON Web Key Set retrieved successfully",
						content: { "application/json": { schema: {
							type: "object",
							properties: { keys: {
								type: "array",
								description: "Array of public JSON Web Keys",
								items: {
									type: "object",
									properties: {
										kid: {
											type: "string",
											description: "Key ID uniquely identifying the key, corresponds to the 'id' from the stored Jwk"
										},
										kty: {
											type: "string",
											description: "Key type (e.g., 'RSA', 'EC', 'OKP')"
										},
										alg: {
											type: "string",
											description: "Algorithm intended for use with the key (e.g., 'EdDSA', 'RS256')"
										},
										use: {
											type: "string",
											description: "Intended use of the public key (e.g., 'sig' for signature)",
											enum: ["sig"],
											nullable: true
										},
										n: {
											type: "string",
											description: "Modulus for RSA keys (base64url-encoded)",
											nullable: true
										},
										e: {
											type: "string",
											description: "Exponent for RSA keys (base64url-encoded)",
											nullable: true
										},
										crv: {
											type: "string",
											description: "Curve name for elliptic curve keys (e.g., 'Ed25519', 'P-256')",
											nullable: true
										},
										x: {
											type: "string",
											description: "X coordinate for elliptic curve keys (base64url-encoded)",
											nullable: true
										},
										y: {
											type: "string",
											description: "Y coordinate for elliptic curve keys (base64url-encoded)",
											nullable: true
										}
									},
									required: [
										"kid",
										"kty",
										"alg"
									]
								}
							} },
							required: ["keys"]
						} } }
					} }
				} }
			}, async (ctx) => {
				if (options?.jwks?.remoteUrl) throw new APIError("NOT_FOUND");
				const adapter = getJwksAdapter(ctx.context.adapter, options);
				let keySets = await adapter.getAllKeys(ctx);
				if (!keySets || keySets?.length === 0) {
					await createJwk(ctx, options);
					keySets = await adapter.getAllKeys(ctx);
				}
				if (!keySets?.length) throw new BetterAuthError("No key sets found. Make sure you have a key in your database.");
				const now = Date.now();
				const gracePeriod = (options?.jwks?.gracePeriod ?? 3600 * 24 * 30) * 1e3;
				const keys = keySets.filter((key) => {
					if (!key.expiresAt) return true;
					return key.expiresAt.getTime() + gracePeriod > now;
				});
				const keyPairConfig = options?.jwks?.keyPairConfig;
				const defaultCrv = keyPairConfig ? "crv" in keyPairConfig ? keyPairConfig.crv : void 0 : void 0;
				return ctx.json({ keys: keys.map((keySet) => {
					return {
						alg: keySet.alg ?? options?.jwks?.keyPairConfig?.alg ?? "EdDSA",
						crv: keySet.crv ?? defaultCrv,
						...JSON.parse(keySet.publicKey),
						kid: keySet.id
					};
				}) });
			}),
			getToken: createAuthEndpoint("/token", {
				method: "GET",
				requireHeaders: true,
				use: [sessionMiddleware],
				metadata: { openapi: {
					operationId: "getJSONWebToken",
					description: "Get a JWT token",
					responses: { 200: {
						description: "Success",
						content: { "application/json": { schema: {
							type: "object",
							properties: { token: { type: "string" } }
						} } }
					} }
				} }
			}, async (ctx) => {
				const jwt = await getJwtToken(ctx, options);
				return ctx.json({ token: jwt });
			}),
			signJWT: createAuthEndpoint({
				method: "POST",
				metadata: { $Infer: { body: {} } },
				body: signJWTBodySchema
			}, async (c) => {
				const jwt = await signJWT(c, {
					options: {
						...options,
						...c.body.overrideOptions
					},
					payload: c.body.payload
				});
				return c.json({ token: jwt });
			}),
			verifyJWT: createAuthEndpoint({
				method: "POST",
				metadata: { $Infer: {
					body: {},
					response: {}
				} },
				body: verifyJWTBodySchema
			}, async (ctx) => {
				const overrideOptions = ctx.body.issuer ? {
					...options,
					jwt: {
						...options?.jwt,
						issuer: ctx.body.issuer
					}
				} : options;
				const payload = await verifyJWT(ctx.body.token, overrideOptions);
				return ctx.json({ payload });
			})
		},
		hooks: { after: [{
			matcher(context) {
				return context.path === "/get-session";
			},
			handler: createAuthMiddleware(async (ctx) => {
				if (options?.disableSettingJwtHeader) return;
				const session = ctx.context.session || ctx.context.newSession;
				if (session && session.session) {
					const jwt = await getJwtToken(ctx, options);
					const exposedHeaders = ctx.context.responseHeaders?.get("access-control-expose-headers") || "";
					const headersSet = new Set(exposedHeaders.split(",").map((header) => header.trim()).filter(Boolean));
					headersSet.add("set-auth-jwt");
					ctx.setHeader("set-auth-jwt", jwt);
					ctx.setHeader("Access-Control-Expose-Headers", Array.from(headersSet).join(", "));
				}
			})
		}] },
		schema: mergeSchema(schema, options?.schema)
	};
};
//#endregion
//#region ../../node_modules/.pnpm/better-auth@1.6.10_@opentelemetry+api@1.9.1_better-sqlite3@12.9.0_drizzle-kit@0.31.10_d_95637dd17a6b2d6f019606e651564593/node_modules/better-auth/dist/plugins/bearer/index.mjs
var BEARER_SCHEME = "bearer ";
function tryDecode(str) {
	try {
		return decodeURIComponent(str);
	} catch {
		return str;
	}
}
/**
* Converts bearer token to session cookie
*/
var bearer = (options) => {
	return {
		id: "bearer",
		version: PACKAGE_VERSION,
		hooks: {
			before: [{
				matcher(context) {
					return Boolean(context.request?.headers.get("authorization") || context.headers?.get("authorization"));
				},
				handler: createAuthMiddleware(async (c) => {
					const authHeader = c.request?.headers.get("authorization") || c.headers?.get("Authorization");
					if (!authHeader) return;
					if (authHeader.slice(0, 7).toLowerCase() !== BEARER_SCHEME) return;
					const token = authHeader.slice(7).trim();
					if (!token) return;
					let signedToken;
					let decodedToken;
					if (token.includes(".")) {
						const isEncoded = token.includes("%");
						signedToken = isEncoded ? token : encodeURIComponent(token);
						decodedToken = isEncoded ? tryDecode(token) : token;
					} else {
						if (options?.requireSignature) return;
						signedToken = (await serializeSignedCookie("", token, c.context.secret)).replace("=", "");
						decodedToken = tryDecode(signedToken);
					}
					try {
						if (!await createHMAC("SHA-256", "base64urlnopad").verify(c.context.secret, decodedToken.split(".")[0], decodedToken.split(".")[1])) return;
					} catch {
						return;
					}
					const existingHeaders = c.request?.headers || c.headers;
					const headers = new Headers({ ...Object.fromEntries(existingHeaders?.entries()) });
					setRequestCookie(headers, c.context.authCookies.sessionToken.name, signedToken);
					return { context: { headers } };
				})
			}],
			after: [{
				matcher(context) {
					return true;
				},
				handler: createAuthMiddleware(async (ctx) => {
					const setCookie = ctx.context.responseHeaders?.get("set-cookie");
					if (!setCookie) return;
					const parsedCookies = parseSetCookieHeader(setCookie);
					const cookieName = ctx.context.authCookies.sessionToken.name;
					const sessionCookie = parsedCookies.get(cookieName);
					if (!sessionCookie || !sessionCookie.value || sessionCookie["max-age"] === 0) return;
					const token = sessionCookie.value;
					const exposedHeaders = ctx.context.responseHeaders?.get("access-control-expose-headers") || "";
					const headersSet = new Set(exposedHeaders.split(",").map((header) => header.trim()).filter(Boolean));
					headersSet.add("set-auth-token");
					ctx.setHeader("set-auth-token", token);
					ctx.setHeader("Access-Control-Expose-Headers", Array.from(headersSet).join(", "));
				})
			}]
		},
		options
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/app-name.js
/**
* Resolve the user-facing name of this app — used in transactional emails,
* page titles, and anywhere the framework needs to refer to "this app" by
* name (e.g. "John invited you to Acme on Forms").
*
* Resolution order:
*   1. `APP_NAME` env var — explicit override (recommended for prod)
*   2. `displayName` from the app's package.json
*   3. Titlecased `name` from package.json (only if it matches a known
*      first-party template — on serverless runtimes `process.cwd()` may
*      point at a bundler-generated package.json with a bogus name)
*   4. First-party template label matched by package.json name
*   5. `undefined` — caller should degrade gracefully
*/
var cachedFromPkg = null;
function readPkg() {
	try {
		const pkgPath = nodePath.join(process.cwd(), "package.json");
		return JSON.parse(fs.readFileSync(pkgPath, "utf8"));
	} catch {
		return null;
	}
}
function titlecase(s) {
	return s.split(/[-_\s]+/).filter(Boolean).map((w) => w[0].toUpperCase() + w.slice(1)).join(" ");
}
function getAppName() {
	if (process.env.APP_NAME) return process.env.APP_NAME;
	if (cachedFromPkg !== null) return cachedFromPkg ?? void 0;
	const pkg = readPkg();
	let name;
	if (pkg?.displayName) name = pkg.displayName;
	else if (pkg?.name) {
		const tmpl = TEMPLATES.find((t) => t.name === pkg.name);
		name = tmpl ? tmpl.label || titlecase(tmpl.name) : void 0;
	}
	cachedFromPkg = name ?? void 0;
	return name;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/email-templates.js
/**
* Transactional email renderers for the framework's system emails.
*
* Each exported function returns `{ subject, html, text }` so callers can pass
* the result straight to `sendEmail({ to, ...rendered })`. All three share the
* same visual identity via the generic `renderEmail` helper in
* `email-template.ts` — dark card, Inter typography, prominent CTA button.
*
* If you need to add another system email (e.g. magic-link, change-email
* confirmation), add it here rather than inlining `renderEmail` at the call
* site — keeps the transactional look-and-feel consistent.
*/
/**
* Strip CRLF from any field that flows into the Subject line — a malicious
* org name, inviter, or app name could otherwise inject Bcc/Reply-To headers
* via "Name\r\nBcc: attacker@...".
*/
function stripCrlf(s) {
	return s.replace(/[\r\n]+/g, " ").trim();
}
function resolveAppName() {
	return stripCrlf(getAppName() || "Agent Native");
}
function renderInviteEmail(args) {
	const invitee = stripCrlf(args.invitee);
	const orgName = stripCrlf(args.orgName || "your team");
	const inviter = stripCrlf(args.inviter);
	const appName = resolveAppName();
	const onApp = appName ? ` on ${appName}` : "";
	const { html, text } = renderEmail({
		preheader: `${inviter} invited you to join ${orgName}${onApp}.`,
		heading: `You're invited to join ${orgName}`,
		paragraphs: [`${emailStrong(inviter)} invited you to join ${emailStrong(orgName)}${appName ? ` on ${emailStrong(appName)}` : ""}.`, `Sign in with ${emailStrong(invitee)} to accept the invitation.`],
		cta: {
			label: "Accept invitation",
			url: args.acceptUrl
		},
		footer: `If you weren't expecting this, you can safely ignore this email.`
	});
	return {
		subject: `${inviter} invited you to join ${orgName}${onApp}`,
		html,
		text
	};
}
function renderVerifySignupEmail(args) {
	const email = stripCrlf(args.email);
	const appName = resolveAppName();
	const { html, text } = renderEmail({
		preheader: `Confirm ${email} to finish setting up your ${appName} account.`,
		heading: `Verify your email for ${appName}`,
		paragraphs: [`Thanks for signing up for ${emailStrong(appName)}. To finish creating your account, confirm that ${emailStrong(email)} is your email address.`, `This link expires in 1 hour.`],
		cta: {
			label: "Verify email",
			url: args.verifyUrl
		},
		footer: `If you didn't sign up, you can safely ignore this email.`
	});
	return {
		subject: `Verify your email for ${appName}`,
		html,
		text
	};
}
function renderResetPasswordEmail(args) {
	const email = stripCrlf(args.email);
	const appName = resolveAppName();
	const { html, text } = renderEmail({
		preheader: `Reset the password for ${email}. This link expires in 1 hour.`,
		heading: `Reset your ${appName} password`,
		paragraphs: [`Someone requested a password reset for ${emailStrong(email)}. Click the button below to choose a new password.`, `This link expires in 1 hour.`],
		cta: {
			label: "Reset password",
			url: args.resetUrl
		},
		footer: `If you didn't request this, you can safely ignore this email — your password won't change.`
	});
	return {
		subject: `Reset your ${appName} password`,
		html,
		text
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/org/accept-pending.js
var nanoid$1 = () => globalThis.crypto?.randomUUID?.().replace(/-/g, "") ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
/**
* Accept every pending `org_invitations` row for this email:
*   - insert a matching `org_members` row (role 'member') when one doesn't exist
*   - flip the invitation's status to 'accepted'
*   - set the user's `active-org-id` to the most-recently-created invite
*
* Called from the Better Auth `user.create.after` hook so that a user who signs
* up with an email they were just invited to lands in the org immediately,
* rather than seeing a blank-slate app until they navigate to /team.
*
* Safe to call when the org tables don't exist (some templates don't use the
* org module) — it swallows the "no such table" error and returns empty.
*/
async function acceptPendingInvitationsForEmail(rawEmail) {
	const email = rawEmail.trim().toLowerCase();
	if (!email) return {
		accepted: [],
		activeOrgId: null
	};
	const db = getDbExec();
	let rows = [];
	try {
		rows = (await db.execute({
			sql: `SELECT id, org_id AS "orgId", role FROM org_invitations
            WHERE LOWER(email) = ? AND status = 'pending'
            ORDER BY created_at DESC`,
			args: [email]
		})).rows.map((r) => ({
			id: String(r.id),
			orgId: String(r.orgId ?? r.org_id),
			role: r.role == null ? null : String(r.role)
		}));
	} catch (err) {
		return {
			accepted: [],
			activeOrgId: null
		};
	}
	if (rows.length === 0) return {
		accepted: [],
		activeOrgId: null
	};
	const accepted = [];
	for (const inv of rows) {
		if ((await db.execute({
			sql: `SELECT 1 FROM org_members WHERE org_id = ? AND LOWER(email) = ? LIMIT 1`,
			args: [inv.orgId, email]
		})).rows.length === 0) {
			const role = inv.role === "admin" ? "admin" : "member";
			await db.execute({
				sql: `INSERT INTO org_members (id, org_id, email, role, joined_at) VALUES (?, ?, ?, ?, ?)`,
				args: [
					nanoid$1(),
					inv.orgId,
					email,
					role,
					Date.now()
				]
			});
		}
		await db.execute({
			sql: `UPDATE org_invitations SET status = 'accepted' WHERE id = ?`,
			args: [inv.id]
		});
		accepted.push({
			invitationId: inv.id,
			orgId: inv.orgId
		});
	}
	const activeOrgId = accepted[0]?.orgId ?? null;
	if (activeOrgId) try {
		await putUserSetting(email, "active-org-id", { orgId: activeOrgId });
	} catch {}
	return {
		accepted,
		activeOrgId
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/org/auto-join-domain.js
var nanoid = () => globalThis.crypto?.randomUUID?.().replace(/-/g, "") ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
/**
* Auto-join a newly-signed-up user into every org whose `allowed_domain`
* matches their email domain.
*
* Called from the Better Auth `user.create.after` hook so that e.g. a new
* `@builder.io` signup lands inside the existing Builder.io org on first
* page load instead of starting in Personal and having to find the join
* CTA. The org's owner opts into this by setting
* `organizations.allowed_domain` — the column already gated the manual
* "Join your team" UI in the picker; we use the same opt-in to drive
* automatic join.
*
* Idempotent — skips orgs the user is already a member of and never
* overwrites an existing `active-org-id` setting.
*
* Safe to call when the org tables don't exist (some templates don't use
* the org module): it swallows the "no such table" error and returns
* empty. Never throws — the caller is a signup hook and we don't want to
* block a user from creating their account because of an org-tier issue.
*/
async function autoJoinDomainMatchingOrgs(rawEmail) {
	const email = rawEmail.trim().toLowerCase();
	if (!email) return {
		joined: [],
		activeOrgId: null
	};
	const domain = email.split("@")[1]?.toLowerCase();
	if (!domain) return {
		joined: [],
		activeOrgId: null
	};
	const db = getDbExec();
	let matches = [];
	try {
		matches = (await db.execute({
			sql: `SELECT o.id AS "orgId"
            FROM organizations o
            WHERE LOWER(o.allowed_domain) = ?
              AND NOT EXISTS (
                SELECT 1
                FROM org_members m
                WHERE m.org_id = o.id
                  AND LOWER(m.email) = ?
              )
            ORDER BY o.created_at ASC`,
			args: [domain, email]
		})).rows.map((r) => ({ orgId: String(r.orgId ?? r.org_id) }));
	} catch {
		return {
			joined: [],
			activeOrgId: null
		};
	}
	if (matches.length === 0) return {
		joined: [],
		activeOrgId: null
	};
	const joined = [];
	for (const m of matches) try {
		await db.execute({
			sql: `INSERT INTO org_members (id, org_id, email, role, joined_at) VALUES (?, ?, ?, 'member', ?)`,
			args: [
				nanoid(),
				m.orgId,
				email,
				Date.now()
			]
		});
		joined.push({ orgId: m.orgId });
	} catch {}
	let activeOrgId = null;
	if (joined[0]) try {
		const existing = await getUserSetting(email, "active-org-id");
		if (!Boolean(existing?.orgId)) {
			activeOrgId = joined[0].orgId;
			await putUserSetting(email, "active-org-id", { orgId: activeOrgId });
		}
	} catch {}
	return {
		joined,
		activeOrgId
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/tracking/registry.js
var REGISTRY_KEY = Symbol.for("@agent-native/core/tracking.registry");
function getRegistry() {
	const g = globalThis;
	if (!g[REGISTRY_KEY]) g[REGISTRY_KEY] = /* @__PURE__ */ new Map();
	return g[REGISTRY_KEY];
}
function registerTrackingProvider(provider) {
	if (!provider?.name) throw new Error("registerTrackingProvider: provider.name is required");
	if (typeof provider.track !== "function") throw new Error("registerTrackingProvider: provider.track must be a function");
	getRegistry().set(provider.name, provider);
}
function track(name, properties, meta) {
	const event = {
		name,
		properties,
		timestamp: (/* @__PURE__ */ new Date()).toISOString(),
		userId: meta?.userId
	};
	for (const provider of getRegistry().values()) try {
		const result = provider.track(event);
		if (result && typeof result.catch === "function") result.catch((err) => {
			console.error(`[tracking] Provider "${provider.name}" rejected:`, err);
		});
	} catch (err) {
		console.error(`[tracking] Provider "${provider.name}" threw:`, err);
	}
}
function identify(userId, traits) {
	for (const provider of getRegistry().values()) {
		if (!provider.identify) continue;
		try {
			const result = provider.identify(userId, traits);
			if (result && typeof result.catch === "function") result.catch(() => {});
		} catch {}
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/better-auth-instance.js
/**
* Internal Better Auth instance — lazily created, not exported to templates.
*
* Templates interact with auth via the existing `getSession()`, `autoMountAuth()`,
* `createAuthPlugin()`, and `createGoogleAuthPlugin()` APIs. Better Auth is an
* implementation detail behind those interfaces.
*/
/**
* Resolve the Better Auth signing secret.
*
* Resolution order:
*   1. `BETTER_AUTH_SECRET` env var — explicit, recommended for prod.
*   2. `.env.local` in the template cwd — a per-workspace persistent secret
*      that the framework writes once on first boot when no secret is set.
*      Gitignored by convention (`.env*` in template .gitignore files), so
*      it's safe to persist credentials here.
*   3. Generate a new random 32-byte hex, write it to `.env.local`, and use
*      it. Subsequent restarts re-read the same file — so session cookies
*      signed by a previous boot remain valid across dev-server restarts.
*
* Why this matters: before this helper existed, missing `BETTER_AUTH_SECRET`
* fell through to `GOOGLE_CLIENT_SECRET` / `ACCESS_TOKEN` / a hardcoded
* string. If a template happened to have none of those, each dev-server
* boot would re-fall back to the hardcoded value (still stable) — but
* rotating Google credentials, toggling `ACCESS_TOKEN`, or churning the
* fallback chain would invalidate every signed cookie and force everyone
* to sign in again. Pinning the secret to `.env.local` on first boot
* removes that footgun.
*/
function resolveAuthSecret() {
	if (process.env.BETTER_AUTH_SECRET) return process.env.BETTER_AUTH_SECRET;
	if (process.env.NODE_ENV === "production") {
		const sample = crypto$1.randomBytes(32).toString("hex");
		throw new Error(`[agent-native] BETTER_AUTH_SECRET is not set. This is required in production so signed session cookies stay valid across deploys. Set it as a deploy environment variable (any 32-byte hex string), e.g.:

  BETTER_AUTH_SECRET=${sample}\n\nGenerate your own with \`openssl rand -hex 32\`. If you already have a running deploy on the legacy hardcoded fallback and need to preserve existing sessions, set BETTER_AUTH_SECRET=agent-native-local-dev-secret-k9x2m7q4w8 first, then rotate to a real value.`);
	}
	try {
		const envLocalPath = nodePath.resolve(process.cwd(), ".env.local");
		const existing = readEnvLocalSecret(envLocalPath);
		if (existing) {
			process.env.BETTER_AUTH_SECRET = existing;
			return existing;
		}
		const generated = crypto$1.randomBytes(32).toString("hex");
		appendEnvLocalSecret(envLocalPath, generated);
		process.env.BETTER_AUTH_SECRET = generated;
		console.log("[agent-native] Generated a persistent BETTER_AUTH_SECRET in .env.local. Sessions will now survive dev-server restarts. (Delete .env.local to rotate; set BETTER_AUTH_SECRET in .env to override.)");
		return generated;
	} catch {
		const ephemeral = crypto$1.randomBytes(32).toString("hex");
		console.warn("[agent-native] Could not persist BETTER_AUTH_SECRET to .env.local (filesystem unwritable). Using an ephemeral in-memory secret. Sessions will reset every time this process restarts. Set BETTER_AUTH_SECRET in your environment to keep sessions valid across restarts.");
		return ephemeral;
	}
}
function readEnvLocalSecret(envLocalPath) {
	try {
		return fs.readFileSync(envLocalPath, "utf8").match(/^(?:export\s+)?BETTER_AUTH_SECRET\s*=\s*"?([^"\r\n]+)"?\s*$/m)?.[1]?.trim() || void 0;
	} catch {
		return;
	}
}
function appendEnvLocalSecret(envLocalPath, secret) {
	const header = "# Auto-generated by agent-native on first boot. Gitignored.\n# Keeps signed session cookies valid across dev-server restarts.\n# Delete this file (or this line) to rotate the secret.\n";
	const line = `BETTER_AUTH_SECRET=${secret}\n`;
	if (fs.existsSync(envLocalPath)) {
		const existing = fs.readFileSync(envLocalPath, "utf8");
		const needsLeadingNewline = existing.length > 0 && !existing.endsWith("\n");
		fs.appendFileSync(envLocalPath, (needsLeadingNewline ? "\n" : "") + "\n# Auto-generated by agent-native on first boot. Gitignored.\n# Keeps signed session cookies valid across dev-server restarts.\n# Delete this file (or this line) to rotate the secret.\n" + line);
	} else fs.writeFileSync(envLocalPath, header + line, { mode: 384 });
}
function shouldSkipEmailVerification() {
	const value = process.env.AUTH_SKIP_EMAIL_VERIFICATION;
	if (value == null) return process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test";
	const normalized = value.trim().toLowerCase();
	return normalized !== "" && normalized !== "0" && normalized !== "false";
}
/** Read-only accessor for the resolved auth secret. */
function getAuthSecret() {
	return resolveAuthSecret();
}
var _auth;
var _initPromise;
var _neonAuthPool;
var pgAuthSchema = {
	user: pgTable("user", {
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		email: text("email").notNull().unique(),
		emailVerified: boolean$2("email_verified").notNull().default(false),
		image: text("image"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
	}),
	session: pgTable("session", {
		id: text("id").primaryKey(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		token: text("token").notNull().unique(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
		ipAddress: text("ip_address"),
		userAgent: text("user_agent"),
		userId: text("user_id").notNull(),
		activeOrganizationId: text("active_organization_id")
	}),
	account: pgTable("account", {
		id: text("id").primaryKey(),
		accountId: text("account_id").notNull(),
		providerId: text("provider_id").notNull(),
		userId: text("user_id").notNull(),
		accessToken: text("access_token"),
		refreshToken: text("refresh_token"),
		idToken: text("id_token"),
		accessTokenExpiresAt: timestamp("access_token_expires_at", { withTimezone: true }),
		refreshTokenExpiresAt: timestamp("refresh_token_expires_at", { withTimezone: true }),
		scope: text("scope"),
		password: text("password"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
	}),
	verification: pgTable("verification", {
		id: text("id").primaryKey(),
		identifier: text("identifier").notNull(),
		value: text("value").notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
	}),
	organization: pgTable("organization", {
		id: text("id").primaryKey(),
		name: text("name").notNull(),
		slug: text("slug").notNull().unique(),
		logo: text("logo"),
		metadata: text("metadata"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
	}),
	member: pgTable("member", {
		id: text("id").primaryKey(),
		organizationId: text("organization_id").notNull(),
		userId: text("user_id").notNull(),
		role: text("role").notNull().default("member"),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
	}),
	invitation: pgTable("invitation", {
		id: text("id").primaryKey(),
		organizationId: text("organization_id").notNull(),
		email: text("email").notNull(),
		role: text("role"),
		status: text("status").notNull().default("pending"),
		expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
		inviterId: text("inviter_id").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).notNull()
	}),
	jwks: pgTable("jwks", {
		id: text("id").primaryKey(),
		publicKey: text("public_key").notNull(),
		privateKey: text("private_key").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
		expiresAt: timestamp("expires_at", { withTimezone: true })
	})
};
var sqliteAuthSchema = {
	user: sqliteTable("user", {
		id: text$1("id").primaryKey(),
		name: text$1("name").notNull(),
		email: text$1("email").notNull().unique(),
		emailVerified: integer("email_verified", { mode: "boolean" }).notNull().default(false),
		image: text$1("image"),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
	}),
	session: sqliteTable("session", {
		id: text$1("id").primaryKey(),
		expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
		token: text$1("token").notNull().unique(),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
		ipAddress: text$1("ip_address"),
		userAgent: text$1("user_agent"),
		userId: text$1("user_id").notNull(),
		activeOrganizationId: text$1("active_organization_id")
	}),
	account: sqliteTable("account", {
		id: text$1("id").primaryKey(),
		accountId: text$1("account_id").notNull(),
		providerId: text$1("provider_id").notNull(),
		userId: text$1("user_id").notNull(),
		accessToken: text$1("access_token"),
		refreshToken: text$1("refresh_token"),
		idToken: text$1("id_token"),
		accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
		refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
		scope: text$1("scope"),
		password: text$1("password"),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
	}),
	verification: sqliteTable("verification", {
		id: text$1("id").primaryKey(),
		identifier: text$1("identifier").notNull(),
		value: text$1("value").notNull(),
		expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
	}),
	organization: sqliteTable("organization", {
		id: text$1("id").primaryKey(),
		name: text$1("name").notNull(),
		slug: text$1("slug").notNull().unique(),
		logo: text$1("logo"),
		metadata: text$1("metadata"),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
	}),
	member: sqliteTable("member", {
		id: text$1("id").primaryKey(),
		organizationId: text$1("organization_id").notNull(),
		userId: text$1("user_id").notNull(),
		role: text$1("role").notNull().default("member"),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
	}),
	invitation: sqliteTable("invitation", {
		id: text$1("id").primaryKey(),
		organizationId: text$1("organization_id").notNull(),
		email: text$1("email").notNull(),
		role: text$1("role"),
		status: text$1("status").notNull().default("pending"),
		expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
		inviterId: text$1("inviter_id").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull()
	}),
	jwks: sqliteTable("jwks", {
		id: text$1("id").primaryKey(),
		publicKey: text$1("public_key").notNull(),
		privateKey: text$1("private_key").notNull(),
		createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
		expiresAt: integer("expires_at", { mode: "timestamp_ms" })
	})
};
/**
* Mirror a Better Auth `account` row for Google into the `oauth_tokens`
* table that template code (mail's Gmail client, calendar's events fetcher)
* reads from. Called from the `databaseHooks.account.create.after` and
* `.update.after` hooks so tokens captured during the primary "Sign in
* with Google" flow flow straight to the apps that need them — no
* separate "Connect Google" page required.
*
* Resolves `account.userId` to the user's email by querying the `user`
* table (Better Auth always quotes "user" because it's a reserved word
* in Postgres; SQLite accepts the quotes too).
*
* The hook is fire-and-forget from the caller's perspective — every
* failure is caught upstream so a flake in `oauth_tokens` never blocks
* sign-in. We still no-op on missing fields here as a defense in depth.
*/
async function mirrorGoogleAccountToOAuthTokens(account) {
	if (!account || account.providerId !== "google") return;
	if (!account.userId) return;
	const accessToken = account.accessToken ?? void 0;
	if (!accessToken) return;
	const db = getDbExec();
	let email;
	try {
		const { rows } = await db.execute({
			sql: "SELECT email FROM \"user\" WHERE id = ?",
			args: [account.userId]
		});
		email = rows[0]?.email ?? void 0;
	} catch (err) {
		console.error("[auth] mirror Google tokens: failed to resolve user email from userId", err);
		return;
	}
	if (!email) return;
	let expiryDate;
	const raw = account.accessTokenExpiresAt;
	if (raw instanceof Date) expiryDate = raw.getTime();
	else if (typeof raw === "number") expiryDate = raw;
	else if (typeof raw === "string") {
		const ms = Date.parse(raw);
		expiryDate = Number.isFinite(ms) ? ms : void 0;
	}
	const tokens = {
		access_token: accessToken,
		token_type: "Bearer"
	};
	if (account.refreshToken) tokens.refresh_token = account.refreshToken;
	if (expiryDate) tokens.expiry_date = expiryDate;
	if (account.scope) tokens.scope = account.scope;
	if (account.idToken) tokens.id_token = account.idToken;
	await saveOAuthTokens("google", email, tokens, email);
}
async function ensureBetterAuthTables() {
	const db = getDbExec();
	const statements = isPostgres() ? [
		`CREATE TABLE IF NOT EXISTS "user" (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, email_verified BOOLEAN NOT NULL DEFAULT FALSE, image TEXT, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS "session" (id TEXT PRIMARY KEY, expires_at TIMESTAMPTZ NOT NULL, token TEXT NOT NULL UNIQUE, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL, ip_address TEXT, user_agent TEXT, user_id TEXT NOT NULL, active_organization_id TEXT)`,
		`CREATE TABLE IF NOT EXISTS "account" (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, provider_id TEXT NOT NULL, user_id TEXT NOT NULL, access_token TEXT, refresh_token TEXT, id_token TEXT, access_token_expires_at TIMESTAMPTZ, refresh_token_expires_at TIMESTAMPTZ, scope TEXT, password TEXT, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS "verification" (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expires_at TIMESTAMPTZ NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS "organization" (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, logo TEXT, metadata TEXT, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS "member" (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'member', created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS "invitation" (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, email TEXT NOT NULL, role TEXT, status TEXT NOT NULL DEFAULT 'pending', expires_at TIMESTAMPTZ NOT NULL, inviter_id TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, updated_at TIMESTAMPTZ NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS "jwks" (id TEXT PRIMARY KEY, public_key TEXT NOT NULL, private_key TEXT NOT NULL, created_at TIMESTAMPTZ NOT NULL, expires_at TIMESTAMPTZ)`
	] : [
		`CREATE TABLE IF NOT EXISTS user (id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT NOT NULL UNIQUE, email_verified INTEGER NOT NULL DEFAULT 0, image TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS session (id TEXT PRIMARY KEY, expires_at INTEGER NOT NULL, token TEXT NOT NULL UNIQUE, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL, ip_address TEXT, user_agent TEXT, user_id TEXT NOT NULL, active_organization_id TEXT)`,
		`CREATE TABLE IF NOT EXISTS account (id TEXT PRIMARY KEY, account_id TEXT NOT NULL, provider_id TEXT NOT NULL, user_id TEXT NOT NULL, access_token TEXT, refresh_token TEXT, id_token TEXT, access_token_expires_at INTEGER, refresh_token_expires_at INTEGER, scope TEXT, password TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS verification (id TEXT PRIMARY KEY, identifier TEXT NOT NULL, value TEXT NOT NULL, expires_at INTEGER NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS organization (id TEXT PRIMARY KEY, name TEXT NOT NULL, slug TEXT NOT NULL UNIQUE, logo TEXT, metadata TEXT, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS member (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, user_id TEXT NOT NULL, role TEXT NOT NULL DEFAULT 'member', created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS invitation (id TEXT PRIMARY KEY, organization_id TEXT NOT NULL, email TEXT NOT NULL, role TEXT, status TEXT NOT NULL DEFAULT 'pending', expires_at INTEGER NOT NULL, inviter_id TEXT NOT NULL, created_at INTEGER NOT NULL, updated_at INTEGER NOT NULL)`,
		`CREATE TABLE IF NOT EXISTS jwks (id TEXT PRIMARY KEY, public_key TEXT NOT NULL, private_key TEXT NOT NULL, created_at INTEGER NOT NULL, expires_at INTEGER)`
	];
	for (const sql of statements) await db.execute(sql);
}
/**
* Get or create the Better Auth instance.
* Lazily initialized on first call — the database must be reachable by then.
*/
async function getBetterAuth(config) {
	if (_auth) return _auth;
	if (_initPromise) return _initPromise;
	_initPromise = createBetterAuthInstance(config);
	_auth = await _initPromise;
	return _auth;
}
/**
* Synchronous getter — returns the instance if already initialized, else undefined.
* Use this in hot paths where you know init has already happened.
*/
function getBetterAuthSync() {
	return _auth;
}
async function createBetterAuthInstance(config) {
	const dialect = getDialect();
	const basePath = config?.basePath ?? "/_agent-native/auth/ba";
	await ensureBetterAuthTables();
	const socialProviders = { ...config?.socialProviders };
	if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
		const extraScopes = config?.googleScopes ?? [];
		const mergedScopes = Array.from(new Set([...[
			"openid",
			"email",
			"profile"
		], ...extraScopes]));
		socialProviders.google = {
			clientId: process.env.GOOGLE_CLIENT_ID,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET,
			...extraScopes.length > 0 ? {
				scope: mergedScopes,
				accessType: "offline",
				prompt: "consent"
			} : {}
		};
	}
	if (process.env.GITHUB_CLIENT_ID && process.env.GITHUB_CLIENT_SECRET) socialProviders.github = {
		clientId: process.env.GITHUB_CLIENT_ID,
		clientSecret: process.env.GITHUB_CLIENT_SECRET
	};
	const database = await buildDatabaseConfig(dialect);
	const secret = resolveAuthSecret();
	const appUrl = getAppProductionUrl();
	const requireEmailVerification = isEmailConfigured() && !shouldSkipEmailVerification();
	return betterAuth({
		basePath,
		baseURL: appUrl,
		database,
		secret,
		emailAndPassword: {
			enabled: true,
			minPasswordLength: 8,
			requireEmailVerification,
			sendResetPassword: async ({ user, token }) => {
				const resetUrl = `${appUrl}${(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH || "").replace(/\/$/, "")}/_agent-native/auth/reset?token=${encodeURIComponent(token)}`;
				const { subject, html, text } = renderResetPasswordEmail({
					email: user.email,
					resetUrl
				});
				await sendEmail({
					to: user.email,
					subject,
					html,
					text
				});
			}
		},
		emailVerification: {
			sendOnSignUp: requireEmailVerification,
			autoSignInAfterVerification: true,
			sendVerificationEmail: async ({ user, url }) => {
				const verifyBasePath = (process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH || "").replace(/\/$/, "");
				const verifyUrl = verifyBasePath ? url.replace(/(\/\/[^/]+)(\/)/, `$1${verifyBasePath}$2`) : url;
				const { subject, html, text } = renderVerifySignupEmail({
					email: user.email,
					verifyUrl
				});
				await sendEmail({
					to: user.email,
					subject,
					html,
					text
				});
			}
		},
		socialProviders,
		account: { accountLinking: {
			enabled: true,
			trustedProviders: ["google", "github"]
		} },
		databaseHooks: {
			user: { create: { after: async (user) => {
				const email = user?.email;
				if (!email) return;
				identify(email, {
					email,
					name: user.name ?? void 0,
					authUserId: user.id
				});
				track("signup", {
					auth_provider: "better-auth",
					auth_user_id: user.id
				}, { userId: email });
				try {
					await acceptPendingInvitationsForEmail(email);
				} catch (err) {
					console.error("[auth] failed to auto-accept pending invitations", err);
				}
				try {
					await autoJoinDomainMatchingOrgs(email);
				} catch (err) {
					console.error("[auth] failed to auto-join domain-matching orgs", err);
				}
			} } },
			account: {
				create: { after: async (account) => {
					await mirrorGoogleAccountToOAuthTokens(account).catch((err) => {
						console.error("[auth] failed to mirror Google account tokens to oauth_tokens (create)", err);
					});
				} },
				update: { after: async (account) => {
					await mirrorGoogleAccountToOAuthTokens(account).catch((err) => {
						console.error("[auth] failed to mirror Google account tokens to oauth_tokens (update)", err);
					});
				} }
			}
		},
		session: {
			expiresIn: 3600 * 24 * 30,
			updateAge: 3600 * 24,
			cookieCache: {
				enabled: true,
				maxAge: 300
			}
		},
		advanced: {
			cookiePrefix: "an",
			...appUrl.startsWith("https://") ? { defaultCookieAttributes: {
				sameSite: "none",
				secure: true,
				partitioned: true
			} } : {},
			...process.env.COOKIE_DOMAIN ? { crossSubDomainCookies: {
				enabled: true,
				domain: process.env.COOKIE_DOMAIN
			} } : {}
		},
		plugins: [
			organization(),
			jwt({ jwt: {
				issuer: appUrl,
				expirationTime: "15m"
			} }),
			bearer(),
			...config?.plugins ?? []
		]
	});
}
async function buildDatabaseConfig(dialect) {
	if (dialect === "postgres") {
		const url = getDatabaseUrl();
		const { isNeonUrl } = await import("./create-get-db-vUEx2Dku.js");
		if (isNeonUrl(url)) {
			const { Pool } = await import("./serverless-50pr2Kt1.js").then((n) => n.i);
			_neonAuthPool = new Pool({ connectionString: url });
			const { drizzle } = await import("./neon-serverless-CbaqDqeo.js");
			const db = drizzle(_neonAuthPool, { schema: pgAuthSchema });
			const { drizzleAdapter } = await import("./drizzle-adapter-i8810Mco.js");
			return drizzleAdapter(db, {
				provider: "pg",
				schema: pgAuthSchema
			});
		}
		const { default: postgres } = await import("./src-DU9OR977.js").then((n) => n.n);
		const sql = postgres(url, {
			onnotice: () => {},
			idle_timeout: 240,
			max_lifetime: 1800,
			connect_timeout: 10,
			...url.includes("supabase") ? { prepare: false } : {}
		});
		const { drizzle } = await import("./postgres-js-Makk47v8.js");
		const db = drizzle(sql, { schema: pgAuthSchema });
		const { drizzleAdapter } = await import("./drizzle-adapter-i8810Mco.js");
		return drizzleAdapter(db, {
			provider: "pg",
			schema: pgAuthSchema
		});
	}
	const url = getDatabaseUrl("file:./data/app.db");
	if (url.startsWith("file:") || !url.includes("://")) {
		const { default: Database } = await import("./lib-DwyTVYOd.js").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
		const sqlite = new Database(url.replace(/^file:/, ""));
		sqlite.pragma("journal_mode = WAL");
		const { drizzle } = await import("./better-sqlite3-BkKbVhGo.js");
		const db = drizzle(sqlite, { schema: sqliteAuthSchema });
		const { drizzleAdapter } = await import("./drizzle-adapter-i8810Mco.js");
		return drizzleAdapter(db, {
			provider: "sqlite",
			schema: sqliteAuthSchema
		});
	}
	const { createClient } = await import("./web-qjdAXe-X.js");
	const client = createClient({
		url,
		authToken: getDatabaseAuthToken()
	});
	const { drizzle } = await import("./web-C0PFfXlr.js");
	const db = drizzle(client, { schema: sqliteAuthSchema });
	const { drizzleAdapter } = await import("./drizzle-adapter-i8810Mco.js");
	return drizzleAdapter(db, {
		provider: "sqlite",
		schema: sqliteAuthSchema
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/oauth-public-origin.js
function normalizeOrigin$2(raw) {
	if (!raw) return "";
	try {
		return new URL(raw).origin;
	} catch {
		return "";
	}
}
function getPublicOAuthOrigin() {
	for (const raw of [
		process.env.WORKSPACE_OAUTH_ORIGIN,
		process.env.VITE_WORKSPACE_OAUTH_ORIGIN,
		process.env.APP_URL,
		process.env.VITE_APP_URL,
		process.env.BETTER_AUTH_URL,
		process.env.VITE_BETTER_AUTH_URL,
		process.env.WORKSPACE_GATEWAY_URL,
		process.env.VITE_WORKSPACE_GATEWAY_URL
	]) {
		const origin = normalizeOrigin$2(raw);
		if (origin) return origin;
	}
	return "";
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/google-auth-mode.js
var VALID = new Set([
	"auto",
	"popup",
	"redirect"
]);
function fromEnv() {
	const raw = (process.env.GOOGLE_AUTH_MODE || "").trim().toLowerCase();
	return VALID.has(raw) ? raw : void 0;
}
/**
* Resolve the effective sign-in flow.
*
* Priority: explicit option > `GOOGLE_AUTH_MODE` env var > `'auto'`.
*/
function resolveGoogleAuthMode(option) {
	if (option && VALID.has(option)) return option;
	return fromEnv() ?? "auto";
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/oauth-return-url.js
function normalizeOrigin$1(raw) {
	if (!raw) return "";
	try {
		return new URL(raw).origin;
	} catch {
		return "";
	}
}
function isLoopbackOrigin$1(origin) {
	try {
		const hostname = new URL(origin).hostname;
		return hostname === "localhost" || hostname === "127.0.0.1" || hostname === "::1" || hostname === "[::1]";
	} catch {
		return false;
	}
}
function isBuilderPreviewOrigin(origin) {
	try {
		const url = new URL(origin);
		const hostname = url.hostname.toLowerCase();
		return url.protocol === "https:" && (hostname === "builderio.xyz" || hostname.endsWith(".builderio.xyz") || hostname === "builderio.dev" || hostname.endsWith(".builderio.dev") || hostname === "builder.codes" || hostname.endsWith(".builder.codes") || hostname === "builder.my" || hostname.endsWith(".builder.my"));
	} catch {
		return false;
	}
}
function getWorkspaceGatewayReturnOrigin() {
	for (const raw of [process.env.WORKSPACE_GATEWAY_URL, process.env.VITE_WORKSPACE_GATEWAY_URL]) {
		const origin = normalizeOrigin$1(raw);
		if (origin && isLoopbackOrigin$1(origin)) return origin;
	}
	return "";
}
function allowedOAuthReturnOrigins(allowDefaultLoopback) {
	const out = /* @__PURE__ */ new Set();
	const configured = getWorkspaceGatewayReturnOrigin();
	if (configured) out.add(configured);
	if (allowDefaultLoopback) out.add("http://127.0.0.1:8080");
	return out;
}
function safeOAuthReturnUrl(raw, opts = {}) {
	if (!raw) return "/";
	if (/[\x00-\x1f]/.test(raw)) return "/";
	try {
		const parsed = new URL(raw, "http://safe-base.invalid");
		if (parsed.origin === "http://safe-base.invalid") return parsed.pathname + parsed.search + parsed.hash;
		const allowedOrigins = allowedOAuthReturnOrigins(opts.allowDefaultLoopback === true);
		for (const origin of opts.allowedOrigins ?? []) {
			const normalized = normalizeOrigin$1(origin);
			if (normalized) allowedOrigins.add(normalized);
		}
		if (allowedOrigins.has(parsed.origin)) return parsed.toString();
	} catch {
		return "/";
	}
	return "/";
}
function appendSessionToOAuthReturnUrl(raw, sessionToken) {
	let safe = safeOAuthReturnUrl(raw, { allowDefaultLoopback: true });
	if (safe === "/" && raw && !/[\x00-\x1f]/.test(raw)) try {
		const parsed = new URL(raw);
		if (isBuilderPreviewOrigin(parsed.origin)) safe = parsed.toString();
	} catch {}
	if (!sessionToken) return safe;
	try {
		const parsed = new URL(safe);
		if (!allowedOAuthReturnOrigins(true).has(parsed.origin) && !isBuilderPreviewOrigin(parsed.origin)) return safe;
		parsed.searchParams.set("_session", sessionToken);
		return parsed.toString();
	} catch {
		return safe;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/onboarding-html.js
/**
* First-run onboarding page for agent-native apps.
*
* Shown when Better Auth is active and the user isn't signed in.
* Provides a path to create or sign into an account from day one.
*
* After first account exists, this page acts as a normal login page.
*/
function hasGoogleOAuth() {
	return !!(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);
}
function getConnectionLabel() {
	const url = process.env.DATABASE_URL || "";
	if (!url) return "SQLite (local file)";
	if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
		if (url.includes("neon.tech")) return "Neon Postgres";
		if (url.includes("supabase")) return "Supabase Postgres";
		return "Postgres";
	}
	if (url.startsWith("file:")) return "SQLite (local file)";
	if (url.startsWith("libsql://") || url.includes("turso.io")) return "Turso";
	return "SQL database";
}
function normalizeAppBasePath$1(value) {
	if (!value || value === "/") return "";
	const trimmed = value.trim();
	if (!trimmed || trimmed === "/") return "";
	return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}
function withAppBasePath(path) {
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `${normalizeAppBasePath$1(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH)}${cleanPath}`;
}
function getOnboardingHtml(opts = {}) {
	const showGoogle = hasGoogleOAuth();
	const googleOnly = !!opts.googleOnly;
	const appBasePath = normalizeAppBasePath$1(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH);
	const publicOAuthOrigin = getPublicOAuthOrigin();
	const workspaceGatewayReturnOrigin = getWorkspaceGatewayReturnOrigin();
	const googleAuthMode = resolveGoogleAuthMode(opts.googleAuthMode);
	const marketing = opts.marketing;
	const hasMarketing = !!marketing;
	const runLocalCommand = marketing?.runLocalCommand?.trim();
	const brandMarkSrc = withAppBasePath("/agent-native-icon-dark.svg");
	const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
	const googleSignInNotice = opts.googleSignInNotice;
	const googleNoticeBodyHtml = googleSignInNotice ? (Array.isArray(googleSignInNotice.body) ? googleSignInNotice.body : [googleSignInNotice.body]).filter((body) => body.trim().length > 0).map((body, index) => `<p class="google-preflight-copy"${index === 0 ? " id=\"google-preflight-copy\"" : ""}>${esc(body)}</p>`).join("\n") : "";
	const googleNoticeHtml = showGoogle && googleSignInNotice ? `
  <div
    class="google-preflight"
    id="google-preflight"
    data-host="${esc(googleSignInNotice.host ?? "")}"
    role="dialog"
    aria-labelledby="google-preflight-title"
    aria-describedby="google-preflight-copy"
  >
    <p class="google-preflight-title" id="google-preflight-title">${esc(googleSignInNotice.title)}</p>
${googleNoticeBodyHtml}
    <div class="google-preflight-actions">
      <button type="button" class="btn-primary" id="google-preflight-continue" onclick="__anAcceptGoogleNotice()">${esc(googleSignInNotice.continueLabel ?? "Continue")}</button>
      <button type="button" class="btn-secondary" onclick="__anHideGoogleNotice()">${esc(googleSignInNotice.cancelLabel ?? "Cancel")}</button>
    </div>
  </div>` : "";
	const marketingStyles = hasMarketing ? `
  body.has-marketing { padding: 0; position: relative; overflow-x: hidden; }
  #starfield {
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }
  @media (prefers-reduced-motion: reduce) {
    #starfield { opacity: 0.18; }
  }
  .split {
    position: relative;
    z-index: 1;
    display: flex;
    min-height: 100vh;
    width: 100%;
    max-width: 1100px;
    margin: 0 auto;
  }
  .marketing-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 3rem 3.5rem;
  }
  .marketing-content { max-width: 480px; }
  .app-name {
    display: flex;
    align-items: center;
    gap: 0.625rem;
    font-size: 2rem;
    font-weight: 700;
    color: #fff;
    margin-bottom: 0.625rem;
    letter-spacing: -0.02em;
  }
  .app-name img.brand-mark {
    height: 2.21375rem;
    width: auto;
    display: block;
    flex-shrink: 0;
  }
  .app-tagline {
    font-size: 1.25rem;
    color: #a1a1aa;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  .app-desc {
    font-size: 1rem;
    color: #71717a;
    line-height: 1.6;
    margin-bottom: 2rem;
  }
  .feature-list {
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: 0.875rem;
  }
  .feature-list li {
    display: flex;
    align-items: flex-start;
    gap: 0.625rem;
    font-size: 1rem;
    color: #a1a1aa;
    line-height: 1.5;
  }
  .feature-list li::before {
    content: '';
    flex-shrink: 0;
    width: 8px;
    height: 8px;
    margin-top: 6px;
    border-radius: 50%;
    background: #3f3f46;
    border: 1px solid #52525b;
  }
  .oss-link {
    display: inline-flex;
    align-items: center;
    gap: 0.375rem;
    font-size: 0.8125rem;
    color: #71717a;
    text-decoration: none;
  }
  .oss-link:hover { color: #a1a1aa; }
  .oss-link svg { width: 15px; height: 15px; flex-shrink: 0; }
  .marketing-actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 0.75rem;
    margin-top: 2rem;
  }
  .run-local-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 2.25rem;
    padding: 0.5rem 0.875rem;
    background: rgba(255,255,255,0.08);
    color: #fff;
    border: 1px solid rgba(255,255,255,0.14);
    border-radius: 8px;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
  }
  .run-local-button:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(255,255,255,0.24);
  }
  .run-local-panel {
    max-width: 480px;
    margin-top: 0.75rem;
    padding: 0.75rem;
    background: rgba(20,20,20,0.86);
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 10px;
    box-shadow: 0 14px 36px rgba(0,0,0,0.28);
  }
  .run-local-panel[hidden] { display: none; }
  .run-local-panel code {
    display: block;
    overflow-x: auto;
    padding-bottom: 0.125rem;
    color: #e5e5e5;
    font-family: "SFMono-Regular", Consolas, "Liberation Mono", monospace;
    font-size: 0.75rem;
    line-height: 1.5;
    white-space: nowrap;
  }
  .copy-run-local {
    margin-top: 0.625rem;
    padding: 0.375rem 0.625rem;
    background: transparent;
    color: #a1a1aa;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    font-size: 0.75rem;
    cursor: pointer;
  }
  .copy-run-local:hover { color: #fff; border-color: rgba(255,255,255,0.22); }
  .form-panel {
    flex: 0 0 440px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
  }
  .form-panel .card { max-width: 400px; }
  .form-panel .local-note { max-width: 400px; }
  @media (max-width: 900px) {
    .split { flex-direction: column; min-height: auto; }
    .marketing-panel { padding: 2rem 1.5rem 1.5rem; }
    .app-name { font-size: 1.375rem; }
    .app-name img.brand-mark { height: 1.58125rem; }
    .app-tagline { font-size: 1rem; margin-bottom: 1rem; }
    .app-desc { margin-bottom: 1rem; }
    .feature-list { gap: 0.5rem; }
    .form-panel { flex: none; padding: 1.5rem 1rem; }
  }
` : "";
	const marketingPanelHtml = hasMarketing ? `<canvas id="starfield"></canvas>
<div class="split">
  <div class="marketing-panel">
    <div class="marketing-content">
      <h2 class="app-name">
        <img class="brand-mark" src="${esc(brandMarkSrc)}" alt="" aria-hidden="true" />
        <span>${esc(marketing.appName)}</span>
      </h2>
      <p class="app-tagline">${esc(marketing.tagline)}</p>
${marketing.description ? `      <p class="app-desc">${esc(marketing.description)}</p>\n` : ""}${marketing.features?.length ? `      <ul class="feature-list">\n${marketing.features.map((f) => `        <li>${esc(f)}</li>`).join("\n")}\n      </ul>\n` : ""}      <div class="marketing-actions">
${runLocalCommand ? `        <button type="button" class="run-local-button" id="run-local-button" aria-expanded="false" aria-controls="run-local-panel" onclick="__anToggleRunLocalCommand()">Run Locally</button>\n` : ""}        <a class="oss-link" href="https://github.com/BuilderIO/agent-native" target="_blank" rel="noreferrer">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 00-1.3-3.2 4.2 4.2 0 00-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 00-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 00-.1 3.2A4.6 4.6 0 004 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>
        Open source
      </a>
      </div>
${runLocalCommand ? `      <div class="run-local-panel" id="run-local-panel" hidden data-command="${esc(runLocalCommand)}">
        <code>${esc(runLocalCommand)}</code>
        <button type="button" class="copy-run-local" id="copy-run-local" onclick="__anCopyRunLocalCommand()">Copy command</button>
      </div>\n` : ""}
    </div>
  </div>
  <div class="form-panel">` : "";
	const marketingCloseHtml = hasMarketing ? `\n  </div>\n</div>` : "";
	const starfieldScript = hasMarketing ? `
  (function initStarfield() {
    var canvas = document.getElementById('starfield');
    if (!canvas) return;
    var gl = canvas.getContext('webgl', { alpha: false, antialias: false });
    if (!gl) return;

    var vs = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vs, 'attribute vec2 position;void main(){gl_Position=vec4(position,0.0,1.0);}');
    gl.compileShader(vs);

    var fs = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fs, [
      'precision highp float;',
      'uniform float iTime;uniform vec2 iResolution;',
      '#define S(a,b,t) smoothstep(a,b,t)',
      '#define NUM_LAYERS 4.',
      'float N21(vec2 p){vec3 a=fract(vec3(p.xyx)*vec3(213.897,653.453,253.098));a+=dot(a,a.yzx+79.76);return fract((a.x+a.y)*a.z);}',
      'vec2 GetPos(vec2 id,vec2 offs,float t){float n=N21(id+offs);float n1=fract(n*10.);float n2=fract(n*100.);float a=t+n;return offs+vec2(sin(a*n1),cos(a*n2))*.4;}',
      'float df_line(vec2 a,vec2 b,vec2 p){vec2 pa=p-a,ba=b-a;float h=clamp(dot(pa,ba)/dot(ba,ba),0.,1.);return length(pa-ba*h);}',
      'float line(vec2 a,vec2 b,vec2 uv){float r1=.025;float r2=.006;float d=df_line(a,b,uv);float d2=length(a-b);float fade=S(1.5,.5,d2);fade+=S(.05,.02,abs(d2-.75));return S(r1,r2,d)*fade;}',
      'float NetLayer(vec2 st,float n,float t){',
      '  vec2 id=floor(st)+n;st=fract(st)-.5;',
      '  vec2 p0=GetPos(id,vec2(-1,-1),t);vec2 p1=GetPos(id,vec2(0,-1),t);vec2 p2=GetPos(id,vec2(1,-1),t);',
      '  vec2 p3=GetPos(id,vec2(-1,0),t);vec2 p4=GetPos(id,vec2(0,0),t);vec2 p5=GetPos(id,vec2(1,0),t);',
      '  vec2 p6=GetPos(id,vec2(-1,1),t);vec2 p7=GetPos(id,vec2(0,1),t);vec2 p8=GetPos(id,vec2(1,1),t);',
      '  float m=0.;float sparkle=0.;float d;float s;float pulse;',
      '  m+=line(p4,p0,st);d=length(st-p0);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p0.x)+fract(p0.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p1,st);d=length(st-p1);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p1.x)+fract(p1.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p2,st);d=length(st-p2);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p2.x)+fract(p2.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p3,st);d=length(st-p3);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p3.x)+fract(p3.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p4,st);d=length(st-p4);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p4.x)+fract(p4.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p5,st);d=length(st-p5);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p5.x)+fract(p5.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p6,st);d=length(st-p6);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p6.x)+fract(p6.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p7,st);d=length(st-p7);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p7.x)+fract(p7.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p4,p8,st);d=length(st-p8);s=(.005/(d*d));s*=S(1.,.7,d);pulse=sin((fract(p8.x)+fract(p8.y)+t)*5.)*.4+.6;pulse=pow(pulse,20.);sparkle+=s*pulse;',
      '  m+=line(p1,p3,st);m+=line(p1,p5,st);m+=line(p7,p5,st);m+=line(p7,p3,st);',
      '  float sPhase=(sin(t+n)+sin(t*.1))*.25+.5;sPhase+=pow(sin(t*.1)*.5+.5,50.)*5.;m+=sparkle*sPhase;',
      '  return m;',
      '}',
      'void mainImage(out vec4 fragColor,in vec2 fragCoord){',
      '  vec2 uv=(fragCoord-iResolution.xy*.5)/iResolution.y;',
      '  float t=iTime*.03;float s=sin(t);float c=cos(t);mat2 rot=mat2(c,-s,s,c);vec2 st=uv*rot;',
      '  float m=0.;',
      '  for(float i=0.;i<1.;i+=1./NUM_LAYERS){float z=fract(t+i);float size=mix(15.,1.,z);float fade=S(0.,.6,z)*S(1.,.8,z);m+=fade*NetLayer(st*size,i,iTime*0.3);}',
      '  vec3 col=vec3(0.35)*m;col*=1.-dot(uv,uv);',
      '  float tt=min(iTime,5.0);col*=S(0.,20.,tt);',
      '  col=clamp(col,0.,1.);fragColor=vec4(col,1.);',
      '}',
      'void main(){mainImage(gl_FragColor,gl_FragCoord.xy);}'
    ].join('\\n'));
    gl.compileShader(fs);

    var prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);

    var buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1,1,-1,-1,1,-1,1,1,-1,1,1]), gl.STATIC_DRAW);
    var pos = gl.getAttribLocation(prog, 'position');
    gl.enableVertexAttribArray(pos);
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0);

    var uTime = gl.getUniformLocation(prog, 'iTime');
    var uRes = gl.getUniformLocation(prog, 'iResolution');
    var reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
    var reducedMotion = reducedMotionQuery ? reducedMotionQuery.matches : false;

    function resize() {
      var w = window.innerWidth, h = window.innerHeight;
      var dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = w * dpr; canvas.height = h * dpr;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
    resize();
    window.addEventListener('resize', resize);

    var start = performance.now(), last = 0, raf = 0, reducedMotionStaticTime = 20;
    function draw(timeSeconds) {
      gl.uniform1f(uTime, timeSeconds);
      gl.uniform2f(uRes, canvas.width, canvas.height);
      gl.drawArrays(gl.TRIANGLES, 0, 6);
    }
    function render(now) {
      if (reducedMotion) {
        raf = 0;
        return;
      }
      raf = requestAnimationFrame(render);
      if (now - last < 33) return;
      last = now;
      draw((now - start) * 0.001);
    }
    function startAnimation() {
      if (!raf) raf = requestAnimationFrame(render);
    }
    function stopAnimation() {
      if (raf) {
        cancelAnimationFrame(raf);
        raf = 0;
      }
    }
    function onReducedMotionChange() {
      reducedMotion = reducedMotionQuery ? reducedMotionQuery.matches : false;
      if (reducedMotion) {
        stopAnimation();
        last = 0;
        draw(reducedMotionStaticTime);
      } else {
        startAnimation();
      }
    }
    draw(reducedMotion ? reducedMotionStaticTime : 0);
    if (reducedMotionQuery) {
      if (reducedMotionQuery.addEventListener) {
        reducedMotionQuery.addEventListener('change', onReducedMotionChange);
      } else {
        reducedMotionQuery.addListener(onReducedMotionChange);
      }
    }
    if (!reducedMotion) startAnimation();
  })();` : "";
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>${hasMarketing ? esc(marketing.appName) + " — Sign in" : "Welcome"}</title>
${hasMarketing ? `<meta name="description" content="${esc(marketing.tagline)}">
<meta property="og:title" content="${esc(marketing.appName)}">
<meta property="og:description" content="${esc(marketing.tagline)}">` : ""}
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background: #0a0a0a;
    color: #e5e5e5;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
  }
  .card {
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background: #141414;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 12px;
  }
  h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem; color: #fff; }
  .subtitle { font-size: 0.8125rem; color: #888; margin-bottom: 1.5rem; }
  .tabs {
    display: inline-flex;
    width: 100%;
    padding: 4px;
    margin-bottom: 1.5rem;
    background: rgba(255,255,255,0.06);
    border-radius: 8px;
  }
  .tab {
    flex: 1;
    padding: 0.5rem 0.75rem;
    background: none;
    border: none;
    color: #888;
    font-size: 0.8125rem;
    font-weight: 500;
    cursor: pointer;
    border-radius: 6px;
  }
  .tab.active {
    background: #1e1e1e;
    color: #fff;
    box-shadow: 0 1px 2px rgba(0,0,0,0.3);
  }
  .tab:hover:not(.active) { color: #bbb; }
  .form { display: none; }
  .form.active { display: block; }
  .card.verifying .tabs,
  .card.verifying #google-btn,
  .card.verifying #google-err,
  .card.verifying #auth-divider,
  .card.verifying #upgrade-note {
    display: none;
  }
  label { display: block; font-size: 0.8125rem; color: #888; margin-bottom: 0.375rem; }
  input {
    width: 100%;
    padding: 0.5rem 0.75rem;
    background: transparent;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 6px;
    color: #e5e5e5;
    font-size: 0.875rem;
    outline: none;
    margin-bottom: 0.875rem;
  }
  input:focus { border-color: rgba(255,255,255,0.3); box-shadow: 0 0 0 1px rgba(255,255,255,0.1); }
  input::placeholder { color: #555; }
  button[type="submit"], .btn-primary {
    width: 100%;
    margin-top: 0.25rem;
    padding: 0.5rem;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  button[type="submit"]:hover, .btn-primary:hover { background: #e5e5e5; }
  button[type="submit"]:disabled { opacity: 0.5; cursor: not-allowed; }
  .btn-secondary {
    width: 100%;
    margin-top: 0.75rem;
    padding: 0.5rem;
    background: transparent;
    color: #888;
    border: 1px solid rgba(255,255,255,0.1);
    border-radius: 6px;
    font-size: 0.8125rem;
    cursor: pointer;
  }
  .btn-secondary:hover { color: #bbb; border-color: rgba(255,255,255,0.2); }
  .msg { margin-top: 0.75rem; font-size: 0.8125rem; display: none; }
  .msg.error { color: #f87171; }
  .msg.success { color: #4ade80; }
  .msg.show { display: block; }
  .step-progress {
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 0.5rem;
    margin-bottom: 1.25rem;
  }
  .progress-step {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.375rem;
    color: #666;
    font-size: 0.6875rem;
    line-height: 1.2;
    text-align: center;
  }
  .progress-step::before {
    content: '';
    position: absolute;
    top: 11px;
    left: calc(-50% + 16px);
    width: calc(100% - 32px);
    height: 1px;
    background: rgba(255,255,255,0.1);
  }
  .progress-step:first-child::before { display: none; }
  .progress-step span {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border-radius: 999px;
    border: 1px solid rgba(255,255,255,0.14);
    background: #151515;
    color: #777;
    font-size: 0.6875rem;
    font-weight: 600;
  }
  .progress-step strong { font-weight: 500; }
  .progress-step.complete,
  .progress-step.current { color: #e5e5e5; }
  .progress-step.complete span {
    background: #d9f99d;
    border-color: #d9f99d;
    color: #111;
  }
  .progress-step.current span {
    background: #fff;
    border-color: #fff;
    color: #000;
    box-shadow: 0 0 0 4px rgba(255,255,255,0.08);
  }
  .verification-panel {
    padding: 1rem;
    margin-bottom: 0.875rem;
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
  }
  .verification-kicker {
    margin-bottom: 0.5rem;
    color: #bef264;
    font-size: 0.75rem;
    font-weight: 500;
  }
  .verification-copy {
    color: #d4d4d8;
    font-size: 0.875rem;
    line-height: 1.55;
  }
  .verification-copy strong {
    color: #fff;
    font-weight: 600;
    word-break: break-word;
  }
  .verification-note {
    margin-top: 0.75rem;
    color: #71717a;
    font-size: 0.75rem;
    line-height: 1.45;
  }
  .inline-actions {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.75rem;
    margin-top: 0.75rem;
  }
  .link-button {
    padding: 0.25rem 0;
    background: none;
    border: none;
    color: #888;
    cursor: pointer;
    font-size: 0.75rem;
    text-decoration: underline;
    text-underline-offset: 2px;
  }
  .link-button:hover { color: #bbb; }
  .link-button:disabled { cursor: wait; opacity: 0.5; }
  .divider {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    margin: 1.25rem 0;
    font-size: 0.75rem;
    color: #555;
  }
  .divider::before, .divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: rgba(255,255,255,0.08);
  }
  .upgrade-note {
    margin-bottom: 1rem;
    padding: 0.75rem;
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 8px;
    background: rgba(255,255,255,0.03);
    font-size: 0.75rem;
    line-height: 1.5;
    color: #a1a1aa;
    display: none;
  }
  .upgrade-note.show { display: block; }
  .btn-google {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.625rem;
    padding: 0.5rem;
    background: #fff;
    color: #000;
    border: none;
    border-radius: 6px;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
  }
  .btn-google:hover { background: #e5e5e5; }
  .btn-google:disabled { opacity: 0.5; cursor: wait; }
  .btn-google svg { width: 18px; height: 18px; flex-shrink: 0; }
  .google-error { margin-top: 0.5rem; font-size: 0.8125rem; color: #f87171; display: none; }
  .google-error.show { display: block; }
  .google-debug {
    display: none;
    margin-top: 0.5rem;
    font-size: 0.6875rem;
    line-height: 1.45;
    color: #777;
    word-break: break-word;
  }
  .google-debug.show { display: block; }
  .google-preflight {
    display: none;
    margin-top: 0.75rem;
    padding: 0.875rem;
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 10px;
    background: rgba(255,255,255,0.05);
    box-shadow: 0 14px 36px rgba(0,0,0,0.28);
  }
  .google-preflight.show { display: block; }
  .google-preflight-title {
    margin-bottom: 0.375rem;
    color: #fff;
    font-size: 0.8125rem;
    font-weight: 600;
  }
  .google-preflight-copy {
    color: #b4b4b8;
    font-size: 0.75rem;
    line-height: 1.55;
  }
  .google-preflight-copy + .google-preflight-copy { margin-top: 0.5rem; }
  .google-preflight-actions {
    display: flex;
    gap: 0.5rem;
    margin-top: 0.875rem;
  }
  .google-preflight-actions .btn-primary,
  .google-preflight-actions .btn-secondary {
    flex: 1;
    width: auto;
    margin-top: 0;
  }
  .local-note {
    display: none;
    max-width: 400px;
    width: 100%;
    margin-top: 1rem;
    padding: 0.625rem 0.875rem;
    font-size: 0.6875rem;
    line-height: 1.5;
    color: #666;
    border: 1px dashed rgba(255,255,255,0.08);
    border-radius: 8px;
    text-align: center;
  }
  .local-note.show { display: block; }
  .local-note strong { color: #999; font-weight: 500; }
  .local-note a { color: #888; text-decoration: none; }
  .local-note a:hover { color: #bbb; }
${marketingStyles}
</style>
</head>
<body${hasMarketing ? " class=\"has-marketing\"" : ""}>
${marketingPanelHtml}
<div class="card">
  <h1 id="heading">${googleOnly ? "Sign in" : "Welcome"}</h1>
  <p class="subtitle" id="subtitle">${googleOnly ? "Use your workspace Google account to continue" : "Create an account to get started"}</p>
  <p
    class="upgrade-note"
    id="upgrade-note"
    data-upgrade-copy="Continue signing in to attach this app to your account and migrate local data."
  ></p>

${showGoogle ? `
  <button class="btn-google" id="google-btn" onclick="signInWithGoogle()">
    <svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
    Sign in with Google
  </button>
  <p class="google-error" id="google-err"></p>
  <p class="google-debug" id="google-debug"></p>
${googleNoticeHtml}
${googleOnly ? "" : `\n  <div class="divider" id="auth-divider">or</div>\n`}
` : googleOnly ? `
  <p style="color:#f87171;font-size:0.875rem;text-align:center;padding:1rem 0">
    Google sign-in is not configured. Set <code>GOOGLE_CLIENT_ID</code> and
    <code>GOOGLE_CLIENT_SECRET</code> environment variables to enable login.
  </p>
` : ""}
${googleOnly ? "" : `  <div class="tabs">
    <button class="tab" data-tab="signup">Create account</button>
    <button class="tab" data-tab="login">Sign in</button>
  </div>

    <form id="signup-form" class="form">
      <label for="s-email">Email</label>
      <input id="s-email" type="email" autocomplete="email" autofocus placeholder="you@example.com" required />
    <label for="s-pass">Password</label>
    <input id="s-pass" type="password" autocomplete="new-password" placeholder="At least 8 characters" required minlength="8" />
    <label for="s-pass2">Confirm password</label>
    <input id="s-pass2" type="password" autocomplete="new-password" placeholder="Confirm password" required minlength="8" />
      <button type="submit">Create account</button>
      <p class="msg" id="s-msg"></p>
    </form>

    <div id="verification-step" class="form verification-step" aria-live="polite">
      <div class="step-progress" aria-label="Signup progress">
        <div class="progress-step complete"><span>1</span><strong>Account</strong></div>
        <div class="progress-step current"><span>2</span><strong>Verify</strong></div>
        <div class="progress-step"><span>3</span><strong>Start</strong></div>
      </div>
      <div class="verification-panel">
        <p class="verification-kicker">Verification email sent</p>
        <p class="verification-copy">We sent a secure link to <strong id="verify-email"></strong>. Click it, return here, and this app will finish signing you in automatically.</p>
        <p class="verification-note">You can keep this tab open. If it has not refreshed after you come back, use Continue.</p>
      </div>
      <button type="button" class="btn-primary" id="verify-continue">Continue</button>
      <div class="inline-actions">
        <button type="button" class="link-button" id="resend-verification">Resend email</button>
        <button type="button" class="link-button" id="back-to-signup">Back</button>
      </div>
      <p class="msg" id="verify-msg"></p>
    </div>

    <form id="login-form" class="form">
    <label for="l-email">Email</label>
    <input id="l-email" type="email" autocomplete="email" placeholder="you@example.com" required />
    <label for="l-pass">Password</label>
    <input id="l-pass" type="password" autocomplete="current-password" placeholder="Enter password" required />
    <button type="submit">Sign in</button>
    <p class="msg error" id="l-msg"></p>
    <p style="margin-top:0.75rem;font-size:0.75rem;text-align:right">
      <a href="#" id="forgot-link" style="color:#888;text-decoration:underline;text-underline-offset:2px">Forgot password?</a>
    </p>
  </form>

  <form id="forgot-form" class="form">
    <label for="f-email">Email</label>
    <input id="f-email" type="email" autocomplete="email" placeholder="you@example.com" required />
    <button type="submit">Send reset link</button>
    <p class="msg" id="f-msg"></p>
    <p style="margin-top:0.75rem;font-size:0.75rem;text-align:center">
      <a href="#" id="back-to-login" style="color:#888;text-decoration:underline;text-underline-offset:2px">Back to sign in</a>
    </p>
  </form>`}
</div>
<p class="local-note" id="local-note">
  Your account is stored in this app's own DB (<strong>${getConnectionLabel()}</strong>), not a third-party service.
</p>${marketingCloseHtml}
<script>
  function __anBasePath() {
    var configured = ${JSON.stringify(appBasePath)};
    if (configured) return configured;
    var marker = '/_agent-native';
    var idx = window.location.pathname.indexOf(marker);
    return idx > 0 ? window.location.pathname.slice(0, idx) : '';
  }
    function __anPath(path) {
      return __anBasePath() + path;
    }
    var __AN_PUBLIC_OAUTH_ORIGIN = ${JSON.stringify(publicOAuthOrigin)};
    var __AN_WORKSPACE_GATEWAY_RETURN_ORIGIN = ${JSON.stringify(workspaceGatewayReturnOrigin)};
    var __AN_GOOGLE_AUTH_MODE = ${JSON.stringify(googleAuthMode)};
    function __anConfiguredOAuthOrigin() {
      if (!__AN_PUBLIC_OAUTH_ORIGIN) return '';
      try {
        var origin = new URL(__AN_PUBLIC_OAUTH_ORIGIN).origin;
        return origin && origin !== window.location.origin ? origin : '';
      } catch(e) {
        return '';
      }
    }
    function __anAuthPath(path) {
      var origin = __anIsBuilderPreview() ? __anConfiguredOAuthOrigin() : '';
      return origin ? origin + path : __anPath(path);
    }
    function __anBuilderPreviewReturnOrigin() {
      try {
        var url = new URL(window.location.href);
        var host = url.hostname.toLowerCase();
        var isPreviewHost =
          host === 'builderio.xyz' || host.slice(-14) === '.builderio.xyz' ||
          host === 'builderio.dev' || host.slice(-14) === '.builderio.dev' ||
          host === 'builder.codes' || host.slice(-14) === '.builder.codes' ||
          host === 'builder.my' || host.slice(-11) === '.builder.my';
        return url.protocol === 'https:' && isPreviewHost ? url.origin : '';
      } catch(e) {
        return '';
      }
    }
    function __anWorkspaceGatewayReturnOrigin() {
      var previewOrigin = __anBuilderPreviewReturnOrigin();
      if (previewOrigin) return previewOrigin;
      if (__AN_WORKSPACE_GATEWAY_RETURN_ORIGIN) return __AN_WORKSPACE_GATEWAY_RETURN_ORIGIN;
      return __anIsBuilderDesktop() ? 'http://127.0.0.1:8080' : '';
    }
    function __anNormalizeWorkspaceReturnPath(ret) {
      try {
        var url = new URL(ret || '/', window.location.origin);
        var path = url.pathname || '/';
        if (path === '/dispatch/dispatch') {
          path = '/dispatch';
        } else if (path.indexOf('/dispatch/') === 0) {
          var rest = path.slice('/dispatch/'.length);
          var first = rest.split('/')[0];
          var dispatchRoutes = {
            overview: true, apps: true, metrics: true, vault: true,
            integrations: true, messaging: true, workspace: true,
            agents: true, destinations: true, identities: true,
            approvals: true, audit: true, team: true, 'thread-debug': true,
            'new-app': true
          };
          if (first === 'dispatch') {
            path = '/dispatch' + rest.slice(first.length);
          } else if (first && !dispatchRoutes[first]) {
            path = '/' + rest;
          }
        }
        return path + url.search + url.hash;
      } catch(e) {
        return ret || '/';
      }
    }
    function __anOAuthReturnTarget(ret) {
      var path = __anNormalizeWorkspaceReturnPath(ret);
      var origin = __anWorkspaceGatewayReturnOrigin();
      return origin ? origin + path : path;
    }
    function __anGetReturnPath() {
      try {
        var inner = new URLSearchParams(window.location.search).get('return');
        if (inner) return inner;
      } catch(e) {}
      return window.location.pathname + window.location.search;
    }
    function __anIsBuilderPreview() {
      try {
        var params = new URLSearchParams(window.location.search);
        if (params.has('builder.preview') || params.has('builder.frameEditing') || params.has('__builder_editing__')) return true;
      } catch(e) {}
      try {
        var ref = document.referrer || '';
        return ref.indexOf('builder.io') !== -1 || ref.indexOf('builder.my') !== -1 || ref.indexOf('builderio.xyz') !== -1 || ref.indexOf('builderio.dev') !== -1 || ref.indexOf('builder.codes') !== -1;
      } catch(e) {
        return false;
      }
    }
    function __anIsBuilderDesktop() {
      try {
        var ua = navigator.userAgent || '';
        return ua.indexOf('Electron') !== -1 && ua.indexOf('AgentNativeDesktop') === -1;
      } catch(e) {
        return false;
      }
    }
    function __anIsElectron() {
      try {
        return (navigator.userAgent || '').indexOf('Electron') !== -1;
      } catch(e) {
        return false;
      }
    }
    function __anResolveAuthFlow() {
      // Per-session override for ad-hoc testing: append ?authMode=popup
      // or ?authMode=redirect to the sign-in URL. Wins over every other rule.
      try {
        var qp = new URLSearchParams(window.location.search).get('authMode');
        if (qp === 'popup' || qp === 'redirect') return qp;
      } catch(e) {}
      // Builder.io browser iframe must use popup — Google sets
      // X-Frame-Options: DENY so a redirect inside the iframe fails.
      if (__anIsBuilderPreview() && !__anIsBuilderDesktop()) return 'popup';
      var mode = __AN_GOOGLE_AUTH_MODE || 'auto';
      if (mode === 'popup') return 'popup';
      if (mode === 'redirect') return 'redirect';
      return __anIsElectron() ? 'redirect' : 'popup';
    }
    var __anOAuthPollTimer = null;
    var __anOAuthPollCount = 0;
    function __anNewOAuthFlowId() {
      try {
        if (window.crypto && typeof window.crypto.randomUUID === 'function') {
          return window.crypto.randomUUID();
        }
      } catch(e) {}
      return 'builder-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2);
    }
    function __anFlowDebugId(flowId) {
      return flowId ? String(flowId).slice(-10) : '';
    }
    function __anSetOAuthDebug(message, flowId) {
      var text = message + (flowId ? ' (flow ' + __anFlowDebugId(flowId) + ')' : '');
      try {
        console.info('[agent-native][google-oauth]', { message: message, flow: __anFlowDebugId(flowId) || undefined });
      } catch(e) {}
      var debug = document.getElementById('google-debug');
      if (debug) {
        debug.textContent = text;
        debug.classList.add('show');
      }
    }
    function __anShowOAuthError(err, btn, message) {
      if (__anOAuthPollTimer) {
        clearInterval(__anOAuthPollTimer);
        __anOAuthPollTimer = null;
      }
      err.textContent = message;
      err.classList.add('show');
      btn.disabled = false;
    }
    function __anWaitForOAuthExchange(flowId, ret, btn, err) {
      var started = Date.now();
      var timeoutMs = 5 * 60 * 1000;
      __anOAuthPollCount = 0;
      async function check() {
        __anOAuthPollCount++;
        try {
          var res = await fetch(__anPath('/_agent-native/auth/desktop-exchange') + '?flow_id=' + encodeURIComponent(flowId), { credentials: 'include' });
          var data = await res.json().catch(function() { return {}; });
          if (data && (data.email || data.token)) {
            if (__anOAuthPollTimer) clearInterval(__anOAuthPollTimer);
            __anOAuthPollTimer = null;
            __anSetOAuthDebug('OAuth exchange redeemed; returning to the app', flowId);
            window.location.href = ret || '/';
            return;
          }
          if (data && data.error) {
            __anSetOAuthDebug('OAuth exchange returned an error: ' + (data.message || data.error), flowId);
            __anShowOAuthError(err, btn, data.message || data.error);
            return;
          }
          if (data && data.pending && (__anOAuthPollCount === 1 || __anOAuthPollCount % 5 === 0)) {
            __anSetOAuthDebug('Waiting for the Google callback; polling attempt ' + __anOAuthPollCount, flowId);
          }
        } catch(e) {
          if (__anOAuthPollCount === 1 || __anOAuthPollCount % 5 === 0) {
            __anSetOAuthDebug('Could not reach the OAuth exchange endpoint: ' + (e && e.message ? e.message : 'network error'), flowId);
          }
        }
        if (Date.now() - started > timeoutMs) {
          __anShowOAuthError(err, btn, 'Google sign-in did not finish. Flow ' + __anFlowDebugId(flowId) + ' never redeemed; check server logs for [agent-native][google-oauth].');
        }
      }
      if (__anOAuthPollTimer) clearInterval(__anOAuthPollTimer);
      __anOAuthPollTimer = setInterval(check, 1000);
      setTimeout(check, 500);
    }
    function __anStartPopupOAuth(ret, btn, err) {
      var flowId = __anNewOAuthFlowId();
      var params = new URLSearchParams();
      if (ret) params.set('return', ret);
      params.set('desktop', '1');
      params.set('flow_id', flowId);
      params.set('redirect', '1');
      var url = __anPath('/_agent-native/google/auth-url') + '?' + params.toString();
      try { sessionStorage.setItem('__an_signin', '1'); } catch(e) {}
      __anSetOAuthDebug('Opening Google sign-in popup', flowId);
      try {
        var popup = window.open('', '_blank', 'width=640,height=760');
        if (!popup) {
          __anShowOAuthError(err, btn, 'Google popup was blocked. Allow popups for this site and try again (flow ' + __anFlowDebugId(flowId) + ').');
          return;
        }
        try { popup.opener = null; } catch(e) {}
        try {
          popup.location.href = url;
        } catch(e) {
          try { popup.close(); } catch(closeErr) {}
          __anShowOAuthError(err, btn, 'Could not navigate Google popup for flow ' + __anFlowDebugId(flowId) + ': ' + (e && e.message ? e.message : 'unknown error'));
          return;
        }
        __anSetOAuthDebug('Google popup opened; waiting for callback', flowId);
      } catch(e) {
        __anShowOAuthError(err, btn, 'Could not open Google popup for flow ' + __anFlowDebugId(flowId) + ': ' + (e && e.message ? e.message : 'unknown error'));
        return;
      }
      __anWaitForOAuthExchange(flowId, ret, btn, err);
    }
    function __anOpenOAuthUrl(url) {
      try { sessionStorage.setItem('__an_signin', '1'); } catch(e) {}
      window.location.href = url;
    }
    (function revealLocalNote() {
    var h = location.hostname;
    if (h === 'localhost' || h === '127.0.0.1' || h === '::1' || h.endsWith('.local')) {
      var n = document.getElementById('local-note');
      if (n) n.classList.add('show');
    }
  })();
  (function revealUpgradeNote() {
    var shouldShow = false;
    try {
      var params = new URLSearchParams(location.search);
      shouldShow = params.get('signin') === '1' || params.get('upgrade-from-local') === '1';
    } catch(e) {}
    if (!shouldShow) {
      try { shouldShow = localStorage.getItem('an_migrate_from_local') === '1'; } catch(e) {}
    }
    if (!shouldShow) return;
    var n = document.getElementById('upgrade-note');
    if (!n) return;
    n.textContent = n.getAttribute('data-upgrade-copy') || 'Continue signing in to migrate local data.';
    n.classList.add('show');
  })();
${googleOnly ? "" : `  var TAB_STORAGE_KEY = 'an.onboarding.tab';
    var tabs = document.querySelectorAll('.tab');
    var forms = document.querySelectorAll('.form');
    var subtitles = { signup: 'Create an account to get started', login: 'Sign in to your account' };
    var headings = { signup: 'Welcome', login: 'Welcome back' };
    var pendingSignupEmail = '';
    var pendingSignupPassword = '';
    var verificationCheckInFlight = false;
    function setActiveTab(name, opts) {
      if (name !== 'signup' && name !== 'login') return;
      var form = document.getElementById(name + '-form');
      if (!form) return;
      var card = document.querySelector('.card');
      if (card) card.classList.remove('verifying');
      tabs.forEach(function(x) { x.classList.remove('active'); });
      forms.forEach(function(x) { x.classList.remove('active'); });
    var btn = document.querySelector('.tab[data-tab="' + name + '"]');
    if (btn) btn.classList.add('active');
    form.classList.add('active');
    var sub = document.getElementById('subtitle');
    if (sub && subtitles[name]) sub.textContent = subtitles[name];
    var heading = document.getElementById('heading');
    if (heading && headings[name]) heading.textContent = headings[name];
      if (opts && opts.persist) {
        try { localStorage.setItem(TAB_STORAGE_KEY, name); } catch (e) {}
      }
    }
    function showVerificationStep(email, password) {
      pendingSignupEmail = email || '';
      pendingSignupPassword = password || '';
      tabs.forEach(function(x) { x.classList.remove('active'); });
      forms.forEach(function(x) { x.classList.remove('active'); });
      var card = document.querySelector('.card');
      if (card) card.classList.add('verifying');
      var step = document.getElementById('verification-step');
      if (step) step.classList.add('active');
      var emailNode = document.getElementById('verify-email');
      if (emailNode) emailNode.textContent = pendingSignupEmail;
      var heading = document.getElementById('heading');
      if (heading) heading.textContent = 'Check your email';
      var sub = document.getElementById('subtitle');
      if (sub) sub.textContent = 'Finish creating your account';
      var msg = document.getElementById('verify-msg');
      if (msg) {
        msg.classList.remove('show', 'error', 'success');
        msg.textContent = '';
      }
      try { localStorage.setItem(TAB_STORAGE_KEY, 'signup'); } catch (e) {}
    }
    function getVerificationMessageNode() {
      var verifyStep = document.getElementById('verification-step');
      if (verifyStep && verifyStep.classList.contains('active')) {
        return document.getElementById('verify-msg');
      }
      return document.getElementById('l-msg') || document.getElementById('verify-msg');
    }
    function isVerificationStepActive() {
      var verifyStep = document.getElementById('verification-step');
      return !!(verifyStep && verifyStep.classList.contains('active'));
    }
    function getPendingSignupEmail() {
      var signupEmail = document.getElementById('s-email');
      var loginEmail = document.getElementById('l-email');
      return (pendingSignupEmail || (signupEmail && signupEmail.value) || (loginEmail && loginEmail.value) || '').trim();
    }
    function getPendingSignupPassword() {
      var signupPassword = document.getElementById('s-pass');
      return pendingSignupPassword || (signupPassword && signupPassword.value) || '';
    }
    function movePendingSignupToLogin(message) {
      var email = getPendingSignupEmail();
      setActiveTab('login', { persist: true });
      var loginEmail = document.getElementById('l-email');
      var loginPassword = document.getElementById('l-pass');
      var msg = document.getElementById('l-msg');
      if (loginEmail && email) loginEmail.value = email;
      if (msg) {
        msg.textContent = message || 'Sign in to continue.';
        msg.classList.remove('error');
        msg.classList.add('show', 'success');
      }
      setTimeout(function() { if (loginPassword) loginPassword.focus(); }, 0);
    }
    async function signInWithPendingSignup() {
      var email = getPendingSignupEmail();
      var password = getPendingSignupPassword();
      if (!email || !password) {
        return { ok: false, needsManualSignIn: true };
      }
      var res = await fetch(__anPath('/_agent-native/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password }),
      });
      if (res.ok) {
        window.location.reload();
        return { ok: true };
      }
      var data = await res.json().catch(function() { return {}; });
      var error = (data && (data.error || data.message)) || 'Could not finish sign-in automatically.';
      return {
        ok: false,
        error: error,
        isWaitingForVerification: /not verified|verification/i.test(error),
      };
    }
    async function checkVerificationSession(fallbackText, opts) {
      opts = opts || {};
      if (verificationCheckInFlight) return;
      verificationCheckInFlight = true;
      var msg = getVerificationMessageNode();
      var continueBtn = document.getElementById('verify-continue');
      if (continueBtn && !opts.silent) {
        continueBtn.disabled = true;
        continueBtn.textContent = 'Checking...';
      }
      if (msg && !opts.silent) {
        msg.textContent = 'Checking your verification...';
        msg.classList.remove('error');
        msg.classList.add('show', 'success');
      }
      try {
        var res = await fetch(__anPath('/_agent-native/auth/session'), {
          headers: { 'Accept': 'application/json' },
        });
        var data = await res.json().catch(function() { return {}; });
        if (res.ok && data && data.email && !data.error) {
          window.location.reload();
          return;
        }
        var loginResult = await signInWithPendingSignup();
        if (loginResult.ok) return;
        if (loginResult.needsManualSignIn) {
          if (!opts.silent) {
            movePendingSignupToLogin(fallbackText || 'Enter your password after verifying your email.');
          }
          return;
        }
        if (loginResult.error && !loginResult.isWaitingForVerification) {
          if (!opts.silent) {
            movePendingSignupToLogin('We could not finish sign-in automatically. Sign in to continue.');
          }
          return;
        }
        if (msg && !opts.silent) {
          msg.textContent = fallbackText || 'Still waiting on verification. Click the link in your email, then try Continue again.';
          msg.classList.remove('success');
          msg.classList.add('show', 'error');
        }
      } catch (err) {
        if (msg && !opts.silent) {
          msg.textContent = 'Could not check verification. Please try again.';
          msg.classList.remove('success');
          msg.classList.add('show', 'error');
        }
      } finally {
        verificationCheckInFlight = false;
        if (continueBtn && !opts.silent) {
          continueBtn.disabled = false;
          continueBtn.textContent = 'Continue';
        }
      }
    }
    function maybeCompleteVerificationAfterReturn() {
      if (!isVerificationStepActive()) return;
      checkVerificationSession(null, { silent: true });
    }
    async function resendVerificationEmail() {
      var btn = document.getElementById('resend-verification');
      var msg = document.getElementById('verify-msg');
      var email = pendingSignupEmail || document.getElementById('s-email').value;
      if (!email) return;
      var original = btn ? btn.textContent : '';
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Sending...';
      }
      if (msg) msg.classList.remove('show', 'error', 'success');
      try {
        var res = await fetch(__anPath('/_agent-native/auth/ba/send-verification-email'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, callbackURL: __anGetReturnPath() }),
        });
        if (res.ok) {
          if (msg) {
            msg.textContent = 'Sent a fresh verification link.';
            msg.classList.add('show', 'success');
          }
          if (btn) btn.textContent = 'Sent';
          setTimeout(function() {
            if (btn) {
              btn.disabled = false;
              btn.textContent = original;
            }
          }, 1600);
          return;
        }
        var data = await res.json().catch(function() { return {}; });
        if (msg) {
          msg.textContent = (data && (data.message || data.error)) || 'Could not resend the verification email.';
          msg.classList.add('show', 'error');
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
      } catch (err) {
        if (msg) {
          msg.textContent = 'Network error. Please try again.';
          msg.classList.add('show', 'error');
        }
        if (btn) {
          btn.disabled = false;
          btn.textContent = original;
        }
      }
    }
    (function initActiveTab() {
    var initial = 'signup';
    try {
      var params = new URLSearchParams(location.search);
      var qp = params.get('tab');
      var path = location.pathname;
      while (path.length > 1 && path.charAt(path.length - 1) === '/') path = path.slice(0, -1);
      if (qp === 'login' || qp === 'signup') {
        initial = qp;
      } else if (params.has('verified')) {
        initial = 'login';
      } else if (path === '/login' || path.endsWith('/login')) {
        initial = 'login';
      } else if (path === '/signup' || path.endsWith('/signup')) {
        initial = 'signup';
      } else {
        var stored = localStorage.getItem(TAB_STORAGE_KEY);
        if (stored === 'login' || stored === 'signup') initial = stored;
      }
    } catch (e) {}
    setActiveTab(initial, { persist: false });
      try {
        if (new URLSearchParams(location.search).has('verified')) {
          var msg = document.getElementById('l-msg');
          if (msg) {
            msg.textContent = 'Email verified. Finishing sign-in...';
            msg.classList.remove('error');
            msg.classList.add('show', 'success');
          }
          checkVerificationSession('Email verified. Sign in to continue.');
        }
      } catch (e) {}
    })();
  tabs.forEach(function(t) { t.addEventListener('click', function() {
    setActiveTab(t.dataset.tab, { persist: true });
  }); });

  document.getElementById('signup-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var form = e.currentTarget;
    var btn = form.querySelector('button[type="submit"]');
    var msg = document.getElementById('s-msg');
    msg.classList.remove('show', 'error', 'success');
    var pass = document.getElementById('s-pass').value;
    var pass2 = document.getElementById('s-pass2').value;
    if (pass !== pass2) {
      msg.textContent = 'Passwords do not match';
      msg.classList.add('show', 'error');
      return;
    }
    var originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Creating account…';
    try {
      var email = document.getElementById('s-email').value;
      var res = await fetch(__anPath('/_agent-native/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: email,
            password: pass,
            callbackURL: __anGetReturnPath(),
          }),
        });
      var data = await res.json().catch(function() { return {}; });
      if (res.ok) {
        // If email verification is required, the server won't return a session.
        // Try logging in — if it fails (unverified), show a "check your email" message.
        var loginRes = await fetch(__anPath('/_agent-native/auth/login'), {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email, password: pass }),
        });
        if (loginRes.ok) {
          msg.textContent = 'Account created — signing you in…';
          msg.classList.add('show', 'success');
          window.location.reload();
          return;
        }
          btn.disabled = false;
          btn.textContent = originalLabel;
          showVerificationStep(email, pass);
          return;
        }
      msg.textContent = data.error || 'Registration failed';
      msg.classList.add('show', 'error');
      btn.disabled = false;
      btn.textContent = originalLabel;
    } catch (err) {
      msg.textContent = 'Network error — please try again';
      msg.classList.add('show', 'error');
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
    });

    var verifyContinue = document.getElementById('verify-continue');
    if (verifyContinue) verifyContinue.addEventListener('click', function(e) {
      e.preventDefault();
      checkVerificationSession();
    });
    window.addEventListener('focus', maybeCompleteVerificationAfterReturn);
    document.addEventListener('visibilitychange', function() {
      if (document.visibilityState === 'visible') maybeCompleteVerificationAfterReturn();
    });
    var resendBtn = document.getElementById('resend-verification');
    if (resendBtn) resendBtn.addEventListener('click', function(e) {
      e.preventDefault();
      resendVerificationEmail();
    });
    var backToSignup = document.getElementById('back-to-signup');
    if (backToSignup) backToSignup.addEventListener('click', function(e) {
      e.preventDefault();
      setActiveTab('signup', { persist: true });
      var email = document.getElementById('s-email');
      setTimeout(function() { if (email) email.focus(); }, 0);
    });

    var forgotLink = document.getElementById('forgot-link');
  var backToLogin = document.getElementById('back-to-login');
  if (forgotLink) forgotLink.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('login-form').classList.remove('active');
    document.getElementById('forgot-form').classList.add('active');
    var sub = document.getElementById('subtitle');
    if (sub) sub.textContent = 'Reset your password';
    var heading = document.getElementById('heading');
    if (heading) heading.textContent = 'Reset password';
    var fEmail = document.getElementById('f-email');
    var lEmail = document.getElementById('l-email');
    if (lEmail && lEmail.value) fEmail.value = lEmail.value;
    setTimeout(function() { fEmail.focus(); }, 0);
  });
  if (backToLogin) backToLogin.addEventListener('click', function(e) {
    e.preventDefault();
    document.getElementById('forgot-form').classList.remove('active');
    document.getElementById('login-form').classList.add('active');
    var sub = document.getElementById('subtitle');
    if (sub) sub.textContent = subtitles.login;
    var heading = document.getElementById('heading');
    if (heading) heading.textContent = headings.login;
  });

  var forgotForm = document.getElementById('forgot-form');
  if (forgotForm) forgotForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    var btn = e.currentTarget.querySelector('button[type="submit"]');
    var msg = document.getElementById('f-msg');
    msg.classList.remove('show', 'error', 'success');
    var original = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Sending…';
    try {
      var email = document.getElementById('f-email').value;
      var res = await fetch(__anPath('/_agent-native/auth/ba/request-password-reset'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email }),
      });
      if (res.ok) {
        msg.textContent = 'If that email exists, a reset link is on its way.';
        msg.classList.add('show', 'success');
        btn.textContent = 'Sent';
        return;
      }
      var data = await res.json().catch(function() { return {}; });
      msg.textContent = (data && (data.message || data.error)) || 'Could not send reset email.';
      msg.classList.add('show', 'error');
      btn.disabled = false;
      btn.textContent = original;
    } catch (err) {
      msg.textContent = 'Network error — please try again';
      msg.classList.add('show', 'error');
      btn.disabled = false;
      btn.textContent = original;
    }
  });

    document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    var form = e.currentTarget;
      var btn = form.querySelector('button[type="submit"]');
      var msg = document.getElementById('l-msg');
      msg.classList.remove('show', 'success');
      msg.classList.add('error');
    var originalLabel = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Signing in…';
    try {
      var res = await fetch(__anPath('/_agent-native/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: document.getElementById('l-email').value,
          password: document.getElementById('l-pass').value,
        }),
      });
      if (res.ok) {
        window.location.reload();
        return;
      }
      var data = await res.json().catch(function() { return {}; });
      msg.textContent = data.error || 'Invalid email or password';
      msg.classList.add('show');
      btn.disabled = false;
      btn.textContent = originalLabel;
    } catch (err) {
      msg.textContent = 'Network error — please try again';
      msg.classList.add('show');
      btn.disabled = false;
      btn.textContent = originalLabel;
    }
  });
`}
${showGoogle ? `
    async function signInWithGoogle() {
    if (__anShouldShowGoogleNotice()) {
      __anShowGoogleNotice();
      return;
    }
    return __anStartGoogleSignIn();
  }
    async function __anStartGoogleSignIn() {
    var btn = document.getElementById('google-btn');
    var err = document.getElementById('google-err');
    var ret = __anGetReturnPath();
    btn.disabled = true;
    err.classList.remove('show');
    if (__anResolveAuthFlow() === 'popup') {
      __anStartPopupOAuth(ret, btn, err);
      return;
    }
    if (__anIsBuilderPreview()) {
      var params = new URLSearchParams();
      if (ret) params.set('return', __anOAuthReturnTarget(ret));
      params.set('redirect', '1');
      __anSetOAuthDebug('Opening Google sign-in redirect');
      __anOpenOAuthUrl(__anAuthPath('/_agent-native/google/auth-url') + '?' + params.toString());
      return;
    }
    try {
      var authUrl = __anPath('/_agent-native/google/auth-url') + '?return=' + encodeURIComponent(ret);
      var res = await fetch(authUrl);
      var data = await res.json();
      if (data.url) {
        __anOpenOAuthUrl(data.url);
      } else {
        err.textContent = data.message || 'Google OAuth is not configured.';
        err.classList.add('show');
        btn.disabled = false;
      }
    } catch (e) {
      err.textContent = 'Failed to connect. Please try again.';
      err.classList.add('show');
      btn.disabled = false;
    }
  }` : ""}
${googleSignInNotice ? `
  window.__anGoogleNoticeAccepted = false;
  function __anShouldShowGoogleNotice() {
    var notice = document.getElementById('google-preflight');
    if (!notice || window.__anGoogleNoticeAccepted) return false;
    var host = notice.getAttribute('data-host');
    return !host || window.location.hostname === host;
  }
  function __anShowGoogleNotice() {
    var notice = document.getElementById('google-preflight');
    if (!notice) return;
    notice.classList.add('show');
    var continueBtn = document.getElementById('google-preflight-continue');
    if (continueBtn) continueBtn.focus();
  }
  function __anHideGoogleNotice() {
    var notice = document.getElementById('google-preflight');
    if (notice) notice.classList.remove('show');
  }
  function __anAcceptGoogleNotice() {
    window.__anGoogleNoticeAccepted = true;
    __anHideGoogleNotice();
    __anStartGoogleSignIn();
  }` : `
  function __anShouldShowGoogleNotice() { return false; }`}
${starfieldScript}
${runLocalCommand ? `
  function __anToggleRunLocalCommand() {
    var panel = document.getElementById('run-local-panel');
    var button = document.getElementById('run-local-button');
    if (!panel || !button) return;
    var nextOpen = panel.hasAttribute('hidden');
    if (nextOpen) {
      panel.removeAttribute('hidden');
    } else {
      panel.setAttribute('hidden', '');
    }
    button.setAttribute('aria-expanded', String(nextOpen));
  }
  function __anCopyRunLocalCommand() {
    var panel = document.getElementById('run-local-panel');
    var button = document.getElementById('copy-run-local');
    if (!panel || !button) return;
    var command = panel.getAttribute('data-command') || '';
    var original = button.textContent || 'Copy command';
    function markCopied() {
      button.textContent = 'Copied';
      setTimeout(function() { button.textContent = original; }, 1600);
    }
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(command).then(markCopied).catch(function() {});
    }
  }` : ""}
<\/script>
</body>
</html>`;
}
getOnboardingHtml();
/**
* HTML for the password reset page — shown when the user clicks the link in
* their reset email. Posts `{ newPassword, token }` to Better Auth's
* `/reset-password` endpoint, then redirects to the login page.
*/
function getResetPasswordHtml() {
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Reset password</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; background: #0a0a0a; color: #e5e5e5; display: flex; align-items: center; justify-content: center; min-height: 100vh; padding: 1rem; }
  .card { width: 100%; max-width: 400px; padding: 2rem; background: #141414; border: 1px solid rgba(255,255,255,0.08); border-radius: 12px; }
  h1 { font-size: 1.25rem; font-weight: 600; margin-bottom: 0.25rem; color: #fff; }
  .subtitle { font-size: 0.8125rem; color: #888; margin-bottom: 1.5rem; }
  label { display: block; font-size: 0.8125rem; color: #888; margin-bottom: 0.375rem; }
  input { width: 100%; padding: 0.5rem 0.75rem; background: transparent; border: 1px solid rgba(255,255,255,0.12); border-radius: 6px; color: #e5e5e5; font-size: 0.875rem; outline: none; margin-bottom: 0.875rem; }
  input:focus { border-color: rgba(255,255,255,0.3); box-shadow: 0 0 0 1px rgba(255,255,255,0.1); }
  input::placeholder { color: #555; }
  button[type="submit"] { width: 100%; margin-top: 0.25rem; padding: 0.5rem; background: #fff; color: #000; border: none; border-radius: 6px; font-size: 0.875rem; font-weight: 500; cursor: pointer; }
  button[type="submit"]:hover { background: #e5e5e5; }
  button[type="submit"]:disabled { opacity: 0.5; cursor: not-allowed; }
  .msg { margin-top: 0.75rem; font-size: 0.8125rem; display: none; }
  .msg.error { color: #f87171; }
  .msg.success { color: #4ade80; }
  .msg.show { display: block; }
  .back { display: inline-block; margin-top: 1rem; font-size: 0.75rem; color: #888; text-decoration: none; }
  .back:hover { color: #bbb; }
</style>
</head>
<body>
<div class="card">
  <h1>Choose a new password</h1>
  <p class="subtitle">Set a new password for your account.</p>
  <form id="reset-form">
    <label for="p1">New password</label>
    <input id="p1" type="password" autocomplete="new-password" autofocus placeholder="At least 8 characters" required minlength="8" />
    <label for="p2">Confirm password</label>
    <input id="p2" type="password" autocomplete="new-password" placeholder="Confirm password" required minlength="8" />
    <button type="submit">Save new password</button>
    <p class="msg" id="msg"></p>
  </form>
  <a class="back" id="back-link" href="/">Back to sign in</a>
</div>
<script>
  (function() {
    // Derive the app's base path so apps mounted under a prefix
    // (e.g. /mail, /calendar) get sent home instead of to the root domain.
    var RESET_PATH = '/_agent-native/auth/reset';
    var pathname = window.location.pathname;
    var idx = pathname.indexOf(RESET_PATH);
    var basePath = (idx >= 0 ? pathname.slice(0, idx) : '') || '';
    var homeHref = basePath + '/';
    var backLink = document.getElementById('back-link');
    if (backLink) backLink.setAttribute('href', homeHref);
    var params = new URLSearchParams(location.search);
    var token = params.get('token') || '';
    var msg = document.getElementById('msg');
    if (!token) {
      msg.textContent = 'Missing or invalid reset token. Request a new reset link.';
      msg.classList.add('show', 'error');
      document.getElementById('reset-form').style.display = 'none';
      return;
    }
    document.getElementById('reset-form').addEventListener('submit', async function(e) {
      e.preventDefault();
      var btn = e.currentTarget.querySelector('button[type="submit"]');
      var p1 = document.getElementById('p1').value;
      var p2 = document.getElementById('p2').value;
      msg.classList.remove('show', 'error', 'success');
      if (p1 !== p2) {
        msg.textContent = 'Passwords do not match';
        msg.classList.add('show', 'error');
        return;
      }
      var original = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Saving…';
      try {
        var res = await fetch(basePath + '/_agent-native/auth/ba/reset-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ newPassword: p1, token: token }),
        });
        if (res.ok) {
          msg.textContent = 'Password updated — redirecting to sign in…';
          msg.classList.add('show', 'success');
          setTimeout(function() { window.location.href = homeHref; }, 1200);
          return;
        }
        var data = await res.json().catch(function() { return {}; });
        msg.textContent = (data && (data.message || data.error)) || 'Reset failed. The link may have expired — request a new one.';
        msg.classList.add('show', 'error');
        btn.disabled = false;
        btn.textContent = original;
      } catch (err) {
        msg.textContent = 'Network error — please try again';
        msg.classList.add('show', 'error');
        btn.disabled = false;
        btn.textContent = original;
      }
    });
  })();
<\/script>
</body>
</html>`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/desktop-sso.js
/**
* Desktop SSO broker.
*
* In the Electron desktop app each template runs in its own persistent
* session partition with its own Nitro server and database. Cookies are
* isolated per partition, and session tokens don't federate across the
* per-template `session` tables — so signing into Mail leaves Calendar
* with a useless cookie (same value, but no matching row in Calendar's
* database), and Calendar reads as "logged out" on the next request.
*
* This module is a file-based broker that lives in the user's home
* directory. When a template creates a session, it writes the token +
* email here. When any template's `getSession` can't resolve its own
* cookie, it falls back to this record (but only for requests from
* Electron, so web deployments stay DB-backed).
*
* The file is user-owned (0600) and lives under the OS home directory,
* so the trust boundary is the local machine — same as the desktop app
* itself. It is intentionally not written or read outside of Electron
* requests; plain-web/serverless deployments never touch it.
*/
var _fs;
async function getFs() {
	if (!_fs) _fs = await import("node:fs");
	return _fs;
}
function getSsoPath() {
	return nodePath.join(os.homedir(), ".agent-native", "desktop-sso.json");
}
async function readDesktopSso() {
	try {
		const raw = (await getFs()).readFileSync(getSsoPath(), "utf-8");
		const rec = JSON.parse(raw);
		if (!rec || typeof rec.email !== "string" || typeof rec.token !== "string" || typeof rec.expiresAt !== "number" || rec.expiresAt <= 0 || rec.expiresAt < Date.now()) return null;
		return rec;
	} catch {
		return null;
	}
}
async function writeDesktopSso(rec) {
	try {
		const fs = await getFs();
		const p = getSsoPath();
		fs.mkdirSync(nodePath.dirname(p), {
			recursive: true,
			mode: 448
		});
		const tmp = `${p}.tmp`;
		fs.writeFileSync(tmp, JSON.stringify(rec), { mode: 384 });
		fs.renameSync(tmp, p);
	} catch {}
}
async function clearDesktopSso() {
	try {
		(await getFs()).unlinkSync(getSsoPath());
	} catch {}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/google-oauth.js
/**
* Shared Google OAuth utilities for all templates.
*
* Handles platform detection (desktop/mobile), state encoding,
* session token creation, and deep-link responses — the logic
* that was previously copy-pasted across every template's
* google-auth.ts handler.
*/
/** Return an HTML response with the correct Content-Type.
*  Uses a web-standard Response to ensure the header survives
*  Nitro dev mode's mock-node-response pipeline. */
function htmlResponse(html, status = 200) {
	return new Response(html, {
		status,
		headers: { "Content-Type": "text/html; charset=utf-8" }
	});
}
/** Shared markup for OAuth success "close this tab" pages. Renders a green
*  check icon above the message, with a little breathing room between the
*  headline and secondary line. Used by every template that goes through the
*  shared Google OAuth flow. */
function oauthDebugFlowId$1(flowId) {
	return flowId ? flowId.slice(-10) : void 0;
}
function oauthSuccessCloseTabHtml(headline, footnote, debugFlowId) {
	return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Connected</title></head><body style="background:#111;color:#ccc;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:14px" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M9 12l2 2l4 -4"/></svg><p style="font-size:16px;margin:0 0 12px 0">${headline}</p><p style="font-size:13px;color:#888;margin:0">${footnote}</p>${debugFlowId ? `<p style="font-size:11px;color:#555;margin:12px 0 0 0">Debug flow: ${escapeHtml(debugFlowId)}</p>` : ""}<script>console.info("[agent-native][google-oauth] success page loaded",{flow:${JSON.stringify(debugFlowId || null)}});setTimeout(function(){try{window.close()}catch(e){}},250)<\/script></body></html>`;
}
/**
* HTML escape — minimal but covers the cases that matter when interpolating
* user-controlled values into our OAuth callback HTML. Mirrors the helper in
* email-template.ts; kept inline here to avoid a circular import.
*/
function escapeHtml(s) {
	return String(s ?? "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
/**
* Detect requests from the Agent Native desktop app specifically.
*
* The desktop app appends `AgentNativeDesktop/<version>` to its user-agent
* (see `packages/desktop-app/src/main/index.ts`). We check for that marker
* rather than matching generic `Electron`, which would also match other
* Electron-based webviews like Builder.io's Fusion, Slack desktop, Discord,
* etc. Falsely treating those as "the desktop app" sends users to the
* `agentnative://oauth-complete` deep-link success page after Google sign-in,
* where the protocol handler can't fire and the "Open Agent Native" button
* does nothing.
*
* Kept exported as `isElectron` for backwards compatibility with consumers.
*/
function isElectron(event) {
	return /AgentNativeDesktop/i.test(getHeader(event, "user-agent") || "");
}
/** Detect requests from a mobile browser (iOS/Android). */
function isMobile(event) {
	return /iPhone|iPad|iPod|Android/i.test(getHeader(event, "user-agent") || "");
}
/**
* Build the static allowlist of origins we trust for `getOrigin`. Reads
* deployment-known public URLs (`APP_URL`, `BETTER_AUTH_URL`, and the
* workspace gateway). Each entry is normalised to `${proto}://${host}` (no
* path). Duplicates collapse, invalid entries are dropped silently.
*/
function normalizeOrigin(raw) {
	if (!raw) return void 0;
	try {
		const u = new URL(raw);
		return `${u.protocol}//${u.host}`;
	} catch {
		return;
	}
}
function getConfiguredOriginAllowlist() {
	const out = /* @__PURE__ */ new Set();
	for (const raw of [
		process.env.APP_URL,
		process.env.BETTER_AUTH_URL,
		process.env.WORKSPACE_GATEWAY_URL
	]) {
		const origin = normalizeOrigin(raw);
		if (origin) out.add(origin);
	}
	return out;
}
function firstConfiguredOrigin() {
	return [...getConfiguredOriginAllowlist()][0];
}
function getWorkspaceCallbackOrigin() {
	const publicAuthOrigin = normalizeOrigin(process.env.APP_URL) ?? normalizeOrigin(process.env.BETTER_AUTH_URL);
	if (publicAuthOrigin) return publicAuthOrigin;
	const gatewayOrigin = normalizeOrigin(process.env.WORKSPACE_GATEWAY_URL);
	if (gatewayOrigin && !isLoopbackOrigin(gatewayOrigin)) return gatewayOrigin;
	return firstConfiguredOrigin();
}
function isLoopbackHost(host) {
	if (!host) return false;
	try {
		const parsed = new URL(`http://${host}`);
		return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1" || parsed.hostname === "::1" || parsed.hostname === "[::1]";
	} catch {
		return false;
	}
}
function isLoopbackOrigin(origin) {
	if (!origin) return false;
	try {
		return isLoopbackHost(new URL(origin).host);
	} catch {
		return false;
	}
}
function isBuilderPreviewHost(host) {
	if (!host) return false;
	try {
		const hostname = new URL(`http://${host}`).hostname.toLowerCase();
		return hostname === "builderio.xyz" || hostname.endsWith(".builderio.xyz") || hostname === "builderio.dev" || hostname.endsWith(".builderio.dev") || hostname === "builder.codes" || hostname.endsWith(".builder.codes") || hostname === "builder.io" || hostname.endsWith(".builder.io") || hostname === "builder.my" || hostname.endsWith(".builder.my");
	} catch {
		return false;
	}
}
/**
* Get the origin from forwarded headers or Host.
*
* Defends against Host-header injection: in production we require the resolved
* origin to match `APP_URL` / `BETTER_AUTH_URL` / `WORKSPACE_GATEWAY_URL`,
* falling back to those values when inbound headers are missing or don't match.
* In dev we accept inbound `Host` so localhost / ngrok / preview hosts keep
* working without configuration, except workspace OAuth requests from loopback
* or Builder preview hosts use the configured gateway origin when one exists.
* The protocol defaults to `https` in production (so a TLS-terminating proxy
* that drops `x-forwarded-proto` doesn't downgrade us to plain HTTP).
*/
function getOrigin(event) {
	const headerHost = getHeader(event, "x-forwarded-host") || getHeader(event, "host");
	const isProd = process.env.NODE_ENV === "production";
	const headerProto = getHeader(event, "x-forwarded-proto") || (isProd ? "https" : "http");
	const workspaceCallbackOrigin = isWorkspaceOAuthCallbackRelayEnabled$1() ? getWorkspaceCallbackOrigin() : void 0;
	if (workspaceCallbackOrigin && (isLoopbackHost(headerHost) || isBuilderPreviewHost(headerHost))) return workspaceCallbackOrigin;
	if (isProd) {
		const allow = getConfiguredOriginAllowlist();
		if (allow.size > 0) {
			const inbound = headerHost ? `${headerProto}://${headerHost}` : "";
			if (inbound && allow.has(inbound)) return inbound;
			return [...allow][0];
		}
		return `${headerProto}://${headerHost ?? ""}`;
	}
	return `${headerProto}://${headerHost ?? "localhost"}`;
}
function normalizeAppBasePath(value) {
	if (!value || value === "/") return "";
	const trimmed = value.trim();
	if (!trimmed || trimmed === "/") return "";
	return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}
/** App mount prefix, if the template is served under APP_BASE_PATH. */
function getAppBasePath() {
	return normalizeAppBasePath(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH);
}
/** Build an absolute same-origin URL that preserves APP_BASE_PATH. */
function getAppUrl(event, path = "/") {
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	return `${getOrigin(event)}${getAppBasePath()}${cleanPath}`;
}
function isWorkspaceOAuthCallbackRelayEnabled$1() {
	return process.env.AGENT_NATIVE_WORKSPACE === "1" || process.env.VITE_AGENT_NATIVE_WORKSPACE === "1";
}
function isFrameworkOAuthCallbackPath$1(pathname) {
	return pathname.startsWith("/_agent-native/") && (pathname.endsWith("/callback") || pathname.includes("/callback/"));
}
function getOriginalRequestPath(event) {
	const mountedPathname = event.context?._mountedPathname;
	if (typeof mountedPathname === "string" && mountedPathname) return mountedPathname;
	const urlPathname = event.url?.pathname;
	if (typeof urlPathname === "string" && urlPathname) return urlPathname;
	const nodeUrl = event.node?.req?.url;
	if (typeof nodeUrl === "string" && nodeUrl) {
		const queryStart = nodeUrl.indexOf("?");
		return queryStart >= 0 ? nodeUrl.slice(0, queryStart) : nodeUrl;
	}
	const eventPath = event.path;
	if (typeof eventPath === "string" && eventPath) {
		const queryStart = eventPath.indexOf("?");
		return queryStart >= 0 ? eventPath.slice(0, queryStart) : eventPath;
	}
	return "/";
}
function isRequestUnderAppBasePath(event) {
	const basePath = getAppBasePath();
	if (!basePath) return false;
	const requestPath = getOriginalRequestPath(event);
	return requestPath === `${basePath}/_agent-native` || requestPath.startsWith(`${basePath}/_agent-native/`);
}
function getDefaultOAuthRedirectUrl(event, path) {
	const cleanPath = path.startsWith("/") ? path : `/${path}`;
	if (isWorkspaceOAuthCallbackRelayEnabled$1() && isFrameworkOAuthCallbackPath$1(cleanPath)) return `${getOrigin(event)}${cleanPath}`;
	const basePath = isRequestUnderAppBasePath(event) ? getAppBasePath() : "";
	return `${getOrigin(event)}${basePath}${cleanPath}`;
}
/**
* Validate a user-supplied `redirect_uri` for OAuth flows.
*
* Defends against authorization-code interception (RFC 6819 §4.4.1.7):
* even though the upstream provider (Google/Atlassian/Zoom) refuses
* unregistered redirect URIs, prefix-style registrations and side
* registrations on the same host let a malicious caller swap in an
* attacker-controlled URI that the provider still accepts. We reject any
* candidate that isn't on this server's own origin AND under the
* framework's `/_agent-native/` namespace. Returns the validated URI on
* success, or `undefined` on rejection — callers must treat `undefined`
* as a 400.
*
* The intentional shape is exact-prefix:
*   - Origin must equal `getOrigin(event)` — no Host-header injection
*     reusing somebody else's registered redirect URI.
*   - Path must start with `${appBasePath}/_agent-native/` so we never
*     hand auth codes to a public marketing or open-redirect endpoint
*     on the same registered host.
*
* For desktop / native flows that need ephemeral `http://127.0.0.1:<port>`
* loopback URIs, callers should validate those at the template level
* with a dedicated allowlist — this helper rejects them by design.
*/
function isAllowedOAuthRedirectUri(candidate, event) {
	if (typeof candidate !== "string" || candidate.length === 0) return false;
	let url;
	try {
		url = new URL(candidate);
	} catch {
		return false;
	}
	const expectedOrigin = getOrigin(event);
	let expectedUrl;
	try {
		expectedUrl = new URL(expectedOrigin);
	} catch {
		return false;
	}
	if (url.protocol !== expectedUrl.protocol) return false;
	if (url.host !== expectedUrl.host) return false;
	const basePath = getAppBasePath();
	if (!(basePath && isRequestUnderAppBasePath(event) ? [`${basePath}/_agent-native/`, ...isWorkspaceOAuthCallbackRelayEnabled$1() && isFrameworkOAuthCallbackPath$1(url.pathname) ? ["/_agent-native/"] : []] : ["/_agent-native/"]).some((prefix) => url.pathname.startsWith(prefix))) return false;
	return true;
}
/**
* Resolve the `redirect_uri` for an outbound OAuth `auth-url` request.
*
* Reads `?redirect_uri=` from the query and validates it via
* `isAllowedOAuthRedirectUri`. Returns:
*   - the validated URI when supplied and allowed, OR
*   - the framework default when no override was supplied, OR
*   - `null` when an override was supplied but rejected — callers must
*     respond with 400 in that case.
*
* Templates that need a non-default redirect path can pass it via
* `defaultPath` (e.g. `"/_agent-native/google/desktop-callback"` for
* desktop flows).
*/
function resolveOAuthRedirectUri(event, defaultPath = "/_agent-native/google/callback") {
	const supplied = getQuery(event).redirect_uri;
	if (typeof supplied === "string" && supplied.length > 0) return isAllowedOAuthRedirectUri(supplied, event) ? supplied : null;
	return getDefaultOAuthRedirectUrl(event, defaultPath);
}
/**
* Ephemeral in-memory state-signing key for development. Generated lazily
* on first read so dev sessions don't depend on filesystem writability or
* env-var configuration. Sessions reset on each restart, which is fine
* for dev — no real users / production data are involved.
*/
var _devStateSigningKey;
/**
* Derive a server-only signing key for HMAC verification of OAuth state.
*
* Uses a dedicated secret — never an OAuth client secret. Reusing a
* client_secret (which is shared with Google / GitHub / Atlassian) as our
* own HMAC key conflates two trust domains: rotating the client secret
* silently invalidates every in-flight OAuth state, and any leak of the
* client secret also lets an attacker forge our state envelopes.
*
* Resolution order:
*   1. OAUTH_STATE_SECRET (preferred — dedicated to this purpose)
*   2. BETTER_AUTH_SECRET (already used by Better Auth as a server secret)
*   3. In dev only, an ephemeral random key (per-process)
*
* In production, throws if neither secret is set.
*/
function getStateSigningKey() {
	const secret = process.env.OAUTH_STATE_SECRET || process.env.BETTER_AUTH_SECRET;
	if (secret) return secret;
	if (process.env.NODE_ENV === "production") throw new Error("OAuth state signing requires a server secret. Set OAUTH_STATE_SECRET or BETTER_AUTH_SECRET in production.");
	if (!_devStateSigningKey) _devStateSigningKey = crypto$1.randomBytes(32).toString("hex");
	return _devStateSigningKey;
}
function encodeOAuthState(redirectUriOrOpts, owner, desktop, addAccount, app, returnUrl, flowId) {
	const opts = typeof redirectUriOrOpts === "string" ? {
		redirectUri: redirectUriOrOpts,
		owner,
		desktop,
		addAccount,
		app,
		returnUrl,
		flowId
	} : redirectUriOrOpts;
	const payload = {
		n: crypto$1.randomBytes(8).toString("hex"),
		r: opts.redirectUri
	};
	if (opts.owner) payload.o = opts.owner;
	if (opts.desktop) payload.d = true;
	if (opts.addAccount) payload.a = true;
	if (opts.app) payload.app = opts.app;
	if (opts.returnUrl) payload.r2 = opts.returnUrl;
	if (opts.flowId) payload.f = opts.flowId;
	const data = Buffer.from(JSON.stringify(payload)).toString("base64url");
	return `${data}.${crypto$1.createHmac("sha256", getStateSigningKey()).update(data).digest("base64url")}`;
}
/**
* Decode and verify OAuth state from the callback's state query parameter.
* Rejects forged or tampered state by checking the HMAC signature.
* Falls back to the provided URI if decoding or verification fails.
*/
function decodeOAuthState(stateParam, fallbackUri) {
	if (stateParam) try {
		const dotIdx = stateParam.lastIndexOf(".");
		if (dotIdx === -1) return { redirectUri: fallbackUri };
		const data = stateParam.slice(0, dotIdx);
		const sig = stateParam.slice(dotIdx + 1);
		const expected = crypto$1.createHmac("sha256", getStateSigningKey()).update(data).digest("base64url");
		if (sig.length !== expected.length || !crypto$1.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return { redirectUri: fallbackUri };
		const parsed = JSON.parse(Buffer.from(data, "base64url").toString());
		return {
			redirectUri: parsed.r || fallbackUri,
			owner: parsed.o || void 0,
			desktop: !!parsed.d,
			addAccount: !!parsed.a,
			app: typeof parsed.app === "string" ? parsed.app : void 0,
			returnUrl: typeof parsed.r2 === "string" ? parsed.r2 : void 0,
			flowId: parsed.f || void 0
		};
	} catch {}
	return { redirectUri: fallbackUri };
}
/**
* Create a session token after a successful OAuth exchange.
*
* Desktop and mobile apps have separate cookie jars from the system
* browser, so they always get a fresh session token (even if the browser
* already has one). The token is then passed via deep link so the native
* app can inject it.
*/
async function createOAuthSession(event, email, opts) {
	const mobile = isMobile(event);
	const needsDeepLink = opts.desktop || mobile;
	const maxAge = getSessionMaxAge();
	let sessionToken;
	if (!opts.hasProductionSession || needsDeepLink) {
		sessionToken = crypto$1.randomBytes(32).toString("hex");
		await addSession(sessionToken, email);
		setFrameworkSessionCookie(event, sessionToken);
		if (opts.desktop && !opts.hasProductionSession) await writeDesktopSso({
			email,
			token: sessionToken,
			expiresAt: Date.now() + maxAge * 1e3
		});
	}
	return { sessionToken };
}
/**
* Return the appropriate response after a successful OAuth callback.
*
* Handles mobile deep links, desktop deep links, add-account close-tab
* pages, and plain web redirects — so templates don't have to.
*/
function oauthCallbackResponse(event, email, opts) {
	const mobile = isMobile(event);
	const query = getQuery(event);
	const callbackState = typeof query.state === "string" && query.state.length > 0 ? query.state : void 0;
	if (mobile) {
		const deepLink = buildOAuthCompleteDeepLink(opts.sessionToken, callbackState);
		return htmlResponse(`<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"><title>Connected</title></head><body style="background:#111;color:#aaa;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0"><p>Connected! Returning to app…</p><script>window.location.href=${JSON.stringify(deepLink)};setTimeout(function(){window.location.href="/"},1500)<\/script></body></html>`);
	}
	if (opts.desktop && opts.addAccount) {
		const safeEmail = email ? escapeHtml(email) : "";
		const safeAppName = escapeHtml(resolveOAuthAppName(opts.appName));
		return htmlResponse(oauthSuccessCloseTabHtml(safeEmail ? `Connected ${safeEmail}!` : "Connected!", `You can close this tab and return to ${safeAppName}.`, oauthDebugFlowId$1(opts.flowId)));
	}
	if (opts.desktop && opts.flowId && isElectron(event) && opts.sessionToken) return desktopSuccessPage(event, email, opts.sessionToken, callbackState);
	if (opts.desktop && opts.flowId) {
		const safeEmail = email ? escapeHtml(email) : "";
		const safeAppName = escapeHtml(resolveOAuthAppName(opts.appName));
		return htmlResponse(oauthSuccessCloseTabHtml(safeEmail ? `Signed in as ${safeEmail}!` : "Signed in!", `You can close this tab and return to ${safeAppName}.`, oauthDebugFlowId$1(opts.flowId)));
	}
	if (opts.desktop && isElectron(event)) return desktopSuccessPage(event, email, opts.sessionToken, callbackState);
	if (opts.addAccount) return htmlResponse(`<!DOCTYPE html><html><body><script>
        window.close();
        var p = document.createElement('p');
        p.style.cssText = 'font-family:system-ui;text-align:center;margin-top:40vh';
        p.textContent = 'Connected ' + ${JSON.stringify(typeof email === "string" ? email : "")} + '! You can close this tab.';
        document.body.appendChild(p);
      <\/script></body></html>`);
	setResponseStatus(event, 302);
	setResponseHeader(event, "Location", appendSessionToOAuthReturnUrl(opts.returnUrl, opts.sessionToken));
	setResponseHeader(event, "Referrer-Policy", "no-referrer");
	return "";
}
/** HTML error page for OAuth failures. The message is HTML-escaped — most
*  callers pass `error.message` from a token-exchange or userinfo failure,
*  which can echo upstream provider strings (and historically attacker-
*  controlled query params via the `error_description` field). */
function oauthErrorPage(message) {
	return htmlResponse(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Connection failed</title></head><body style="background:#111;color:#ccc;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;text-align:center"><svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#ef4444" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-bottom:14px" aria-hidden="true"><circle cx="12" cy="12" r="10"/><path d="M15 9l-6 6"/><path d="M9 9l6 6"/></svg><p style="font-size:16px;margin:0 0 12px 0;color:#ddd">${escapeHtml(message)}</p><p style="font-size:13px;color:#888;margin:0"><a href="/" style="color:#888;text-decoration:underline;text-underline-offset:3px">Back to login</a></p></body></html>`, 400);
}
function resolveOAuthAppName(explicit) {
	const raw = explicit || getAppName() || "Agent Native";
	if (!/^[a-z0-9_-]+$/.test(raw)) return raw;
	return raw.split(/[-_]+/).filter(Boolean).map((word) => word[0].toUpperCase() + word.slice(1)).join(" ");
}
function buildOAuthCompleteDeepLink(sessionToken, state) {
	const params = new URLSearchParams();
	if (sessionToken) params.set("token", sessionToken);
	if (state) params.set("state", state);
	const suffix = params.toString();
	return suffix ? `agentnative://oauth-complete?${suffix}` : "agentnative://oauth-complete";
}
function desktopSuccessPage(_event, email, sessionToken, state) {
	const safeEmail = email ? escapeHtml(email) : "";
	const msg = safeEmail ? `Connected ${safeEmail}!` : "Connected!";
	if (sessionToken) {
		const deepLink = buildOAuthCompleteDeepLink(sessionToken, state);
		const deepLinkJson = JSON.stringify(deepLink);
		return htmlResponse(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Connected</title><style>@keyframes spin{to{transform:rotate(360deg)}}@keyframes fadeIn{from{opacity:0;transform:translateY(4px)}to{opacity:1;transform:translateY(0)}}.spinner{width:28px;height:28px;border:2px solid #333;border-top-color:#fff;border-radius:50%;animation:spin .8s linear infinite}.fallback{display:none;flex-direction:column;align-items:center;gap:8px;animation:fadeIn .2s ease-out}.fallback.show{display:flex}</style></head><body style="background:#111;color:#ccc;font-family:system-ui;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;flex-direction:column;gap:16px"><p style="font-size:16px;margin:0">${msg}</p><div id="loading" class="spinner"></div><div id="fallback" class="fallback"><a href=${deepLinkJson} style="display:inline-block;padding:10px 24px;background:#fff;color:#000;border-radius:8px;text-decoration:none;font-size:14px;font-weight:500">Open Agent Native</a><p style="font-size:12px;color:#666;margin:0">If the app didn\u2019t open automatically, click the button above.</p></div><script>(function(){var ua=(navigator.userAgent||"");if(ua.indexOf("AgentNativeDesktop")===-1){window.location.replace("/");return}window.location.href=${deepLinkJson};setTimeout(function(){document.getElementById("loading").style.display="none";document.getElementById("fallback").classList.add("show")},3000)})()<\/script></body></html>`);
	}
	return htmlResponse(oauthSuccessCloseTabHtml(msg, "You can close this tab and return to Agent Native."));
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/shared/oauth-state.js
/**
* Extract the workspace app id from an agent-native OAuth state parameter
* without verifying the HMAC signature.
*
* This is only for routing a provider callback to the app that will verify
* and consume the state. The destination callback must still call
* decodeOAuthState before trusting anything inside the payload.
*/
function extractOAuthStateAppId(state) {
	if (!state) return void 0;
	try {
		const dotIdx = state.lastIndexOf(".");
		if (dotIdx === -1) return void 0;
		const data = state.slice(0, dotIdx);
		const parsed = JSON.parse(decodeBase64Url(data));
		return typeof parsed.app === "string" ? parsed.app : void 0;
	} catch {
		return;
	}
}
function decodeBase64Url(value) {
	const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
	const padded = normalized.padEnd(normalized.length + (4 - normalized.length % 4) % 4, "=");
	const maybeBuffer = globalThis.Buffer;
	if (maybeBuffer) return maybeBuffer.from(padded, "base64").toString();
	return atob(padded);
}
var RESERVED_WORKSPACE_APP_IDS = new Set([
	"_agent-native",
	"_workspace_static",
	"api",
	"auth",
	"dispatch",
	"netlify",
	"tools",
	...[
		["overview", "overview"],
		["login", "login"],
		["signup", "signup"],
		["apps", "apps"],
		["apps/new-app", "new-app"],
		["new-app", "new-app"],
		["vault", "vault"],
		["integrations", "integrations"],
		["agents", "agents"],
		["workspace", "workspace"],
		["messaging", "messaging"],
		["extensions", "extensions"],
		["destinations", "destinations"],
		["identities", "identities"],
		["approval", "approval"],
		["approvals", "approvals"],
		["audit", "audit"],
		["team", "team"]
	].map(([from]) => from)
]);
function isValidWorkspaceAppIdFormat(appId) {
	return /^[a-z][a-z0-9-]*$/.test(appId);
}
function getWorkspaceAppIdValidationError(appId) {
	if (RESERVED_WORKSPACE_APP_IDS.has(appId)) return `App name "${appId}" conflicts with a reserved workspace route. Choose a different name.`;
	if (!isValidWorkspaceAppIdFormat(appId)) return `Invalid app name "${appId}". Use lowercase letters, numbers, and hyphens.`;
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/auth.js
function toWebRequest(event) {
	const req = event.req;
	const ctx = event.context;
	if (ctx?._mountedPathname && ctx._mountPrefix) try {
		const url = new URL(req.url);
		const mountedPathname = stripAppBasePath(ctx._mountedPathname);
		if (url.pathname !== mountedPathname) {
			url.pathname = mountedPathname;
			const method = req.method.toUpperCase();
			const hasBody = method !== "GET" && method !== "HEAD";
			return new Request(url.href, {
				method: req.method,
				headers: req.headers,
				...hasBody ? {
					body: req.body,
					duplex: "half"
				} : {}
			});
		}
	} catch {}
	return req;
}
/**
* Get the configured session max age. Desktop SSO broker writes from
* OAuth flows read this so expiration stays consistent with the cookie.
*/
function getSessionMaxAge() {
	return sessionMaxAge;
}
/**
* Cookie name for the framework's session cookie.
*
* Browsers scope cookies by host (NOT host+port — RFC 6265), so two apps
* running on different localhost ports share one cookie jar. When multiple
* templates run side-by-side (`dev:all`, the desktop app, multi-template
* deploys on a shared domain), they would otherwise stomp on each other's
* `an_session` cookie and ping-pong each other into a logged-out state.
*
* When `APP_NAME` is set, suffix the cookie so each app gets its own slot.
*
* Workspace exception: in workspace mode (`AGENT_NATIVE_WORKSPACE=1`),
* every app shares the same origin AND the same DB, and cross-app SSO is
* the desired behavior — signing into Dispatch should mean you're signed
* in across the workspace's other apps too. Per-app suffixes break that.
* Use a single workspace-wide cookie so the legacy `an_session_*` token
* flow set by `setFrameworkSessionCookie` (which the Builder OAuth popup
* exchange relies on — see `desktop-exchange` and `oauthCallbackResponse`)
* is recognised by every app in the workspace.
*
* Cross-subdomain exception: when `COOKIE_DOMAIN` is set (e.g.
* `.agent-native.com` for first-party deploys where each app is its own
* subdomain — mail.agent-native.com, calendar.agent-native.com, …),
* use the unsuffixed `an_session` and emit `Domain=<COOKIE_DOMAIN>` so
* the cookie is shared across every subdomain. Signing into one app
* signs the user into all of them. Per-app suffixes would defeat the
* shared cookie since each subdomain reads a different name.
*/
var APP_NAME_SLUG = (process.env.APP_NAME || "").toLowerCase().replace(/[^a-z0-9]+/g, "_").replace(/^_+|_+$/g, "");
var IS_WORKSPACE_MODE = process.env.AGENT_NATIVE_WORKSPACE === "1";
/**
* When set, the framework session cookie is shared across every subdomain
* matching this domain (e.g. `.agent-native.com`). Reads `COOKIE_DOMAIN`.
* Returns undefined when unset so cookies stay scoped to the origin host.
*/
function getCookieDomain() {
	const raw = process.env.COOKIE_DOMAIN;
	if (!raw) return void 0;
	return raw.trim() || void 0;
}
var COOKIE_NAME = !!getCookieDomain() ? "an_session" : IS_WORKSPACE_MODE ? "an_session_workspace" : APP_NAME_SLUG ? `an_session_${APP_NAME_SLUG}` : "an_session";
/**
* Cookie domain attribute spread into every `setCookie`/`deleteCookie`.
* Empty when `COOKIE_DOMAIN` isn't set so the cookie stays scoped to the
* single origin (current production default for non-first-party apps).
*/
function cookieDomainAttrs() {
	const domain = getCookieDomain();
	return domain ? { domain } : {};
}
function getOAuthStateAppId() {
	const raw = process.env.APP_NAME || process.env.npm_package_name;
	if (!raw) return void 0;
	return raw.toLowerCase().replace(/[^a-z0-9-]+/g, "-").replace(/^-+|-+$/g, "") || void 0;
}
function oauthDebugFlowId(flowId) {
	return typeof flowId === "string" && flowId ? flowId.slice(-10) : void 0;
}
function oauthDebugUrlPath(value) {
	if (typeof value !== "string" || !value) return void 0;
	try {
		return new URL(value).pathname;
	} catch {
		return;
	}
}
function isBuilderOAuthRequest(event) {
	const userAgent = getHeader(event, "user-agent") || "";
	const referer = getHeader(event, "referer") || "";
	return /Electron/i.test(userAgent) || /builder\.(io|my)|builderio\.(xyz|dev)|builder\.codes/i.test(referer);
}
function builderPreviewReturnOrigin(event) {
	const referer = getHeader(event, "referer") || "";
	if (!referer) return void 0;
	try {
		const url = new URL(referer);
		const hostname = url.hostname.toLowerCase();
		if (url.protocol === "https:" && (hostname === "builderio.xyz" || hostname.endsWith(".builderio.xyz") || hostname === "builderio.dev" || hostname.endsWith(".builderio.dev") || hostname === "builder.codes" || hostname.endsWith(".builder.codes") || hostname === "builder.my" || hostname.endsWith(".builder.my"))) return url.origin;
	} catch {}
}
function logGoogleOAuthDebug(event, phase, details = {}) {
	const { flowId, ...rest } = details;
	const path = (event.node?.req?.url ?? event.path ?? "").split("?")[0] || void 0;
	const userAgent = getHeader(event, "user-agent") || "";
	const referer = getHeader(event, "referer") || "";
	console.info("[agent-native][google-oauth]", {
		phase,
		app: getOAuthStateAppId(),
		path,
		flow: oauthDebugFlowId(flowId),
		electron: /Electron/i.test(userAgent),
		agentNativeDesktop: /AgentNativeDesktop/i.test(userAgent),
		builderReferrer: /builder\.(io|my)|builderio\.(xyz|dev)|builder\.codes/i.test(referer),
		...rest
	});
}
var DEFAULT_MAX_AGE = 3600 * 24 * 30;
/**
* Check if we're in a development/test environment.
* Used for cookie security settings, not for auth bypass.
*/
function isDevEnvironment() {
	const env = process.env.NODE_ENV;
	return env === "development" || env === "test";
}
/**
* Validate a `?return=` URL for the /_agent-native/sign-in entrypoint.
*
* Parses the candidate against a sentinel base origin; any input that
* resolves to a different origin (network-path references, absolute URLs,
* `data:` / `javascript:` schemes, backslash-bypass tricks WHATWG normalises
* to `//`) gets rejected and falls back to "/". Control characters are
* stripped up front to defend against header-injection. Returns the
* normalised path the parser produced — never the raw input.
*
* Exported for unit tests.
*/
function safeReturnPath(raw) {
	if (!raw) return "/";
	if (/[\x00-\x1f]/.test(raw)) return "/";
	try {
		const parsed = new URL(raw, "http://safe-base.invalid");
		if (parsed.origin !== "http://safe-base.invalid") return "/";
		return parsed.pathname + parsed.search + parsed.hash;
	} catch {
		return "/";
	}
}
/**
* Read the desktop-SSO broker file, but only if the request is plausibly
* from the Electron desktop app *and* coming from the local machine.
*
* The broker file lives in the user's home directory and trusts the local
* trust boundary — a non-loopback request that pretends to be Electron
* via User-Agent must NEVER be allowed to read it. We additionally refuse
* any read in production builds: the desktop app launches with
* `NODE_ENV=development` (or unset), and any web-hosted production deploy
* has no business consulting a per-user file on the server's homedir
* even if one exists.
*
* Returns null when the safety checks fail or the file isn't present.
*/
async function readDesktopSsoSafely(event) {
	if (process.env.NODE_ENV === "production") return null;
	if (!isElectron(event)) return null;
	let ip;
	try {
		ip = getRequestIP(event) ?? void 0;
	} catch {
		ip = void 0;
	}
	const normalised = (ip ?? "").split("%")[0];
	if (!(normalised === "127.0.0.1" || normalised === "::1" || normalised === "::ffff:127.0.0.1" || normalised.startsWith("127."))) return null;
	return await readDesktopSso();
}
/**
* Extract the framework session token from a Better Auth response's
* Set-Cookie headers, if any. Used by the password-reset path to skip
* the freshly-minted session when revoking sibling sessions for the
* user. Returns undefined if no session cookie was minted (the common
* case — Better Auth's reset doesn't auto-sign-in by default).
*/
function extractSessionTokenFromSetCookies(response) {
	try {
		const headers = response.headers;
		const setCookies = typeof headers.getSetCookie === "function" ? headers.getSetCookie() : (headers.get("set-cookie") ?? "").split(/,(?=[^;]+=)/).map((s) => s.trim()).filter(Boolean);
		for (const sc of setCookies) {
			const match = sc.match(/(?:^|\s|;)(an_session|[\w.-]*session_token)=([^;]+)/i);
			if (match) return match[2];
		}
	} catch {}
}
function getAccessTokens() {
	const single = process.env.ACCESS_TOKEN;
	const multi = process.env.ACCESS_TOKENS;
	const tokens = [];
	if (single) tokens.push(single);
	if (multi) for (const t of multi.split(",")) {
		const trimmed = t.trim();
		if (trimmed && !tokens.includes(trimmed)) tokens.push(trimmed);
	}
	return tokens;
}
function safeTokenMatch(input, tokens) {
	const inputBuf = Buffer.from(input);
	for (const token of tokens) {
		const tokenBuf = Buffer.from(token);
		if (inputBuf.length === tokenBuf.length && crypto$1.timingSafeEqual(inputBuf, tokenBuf)) return true;
	}
	return false;
}
function getBearerSessionToken(event) {
	const auth = getHeader(event, "authorization");
	if (!auth) return void 0;
	return /^Bearer\s+(.+)$/i.exec(auth.trim())?.[1]?.trim() || void 0;
}
async function getBearerLegacySession(event) {
	const bearerToken = getBearerSessionToken(event);
	if (!bearerToken) return null;
	const email = await getSessionEmail(bearerToken);
	return email ? {
		email,
		token: bearerToken
	} : null;
}
function shouldExposeSessionTokenInBody(event) {
	const origin = getHeader(event, "origin");
	if (origin && DESKTOP_AUTH_TOKEN_BODY_ORIGINS.has(origin)) return true;
	return !origin && getHeader(event, "x-request-source") === "clips-desktop";
}
function authLoginResponse(event, token, email) {
	if (!shouldExposeSessionTokenInBody(event)) return { ok: true };
	return email ? {
		ok: true,
		token,
		email
	} : {
		ok: true,
		token
	};
}
/**
* Bad-credential / already-registered errors are normal user behavior, not
* bugs we want to investigate. Filtering them out keeps Sentry signal
* actionable — a real anomaly (DB error, Better Auth init crash, missing
* table) shows up clearly because it doesn't match any of these patterns.
*/
var EXPECTED_AUTH_FAILURE_PATTERNS = [
	/invalid\s+(email|password|credentials)/i,
	/password.*incorrect/i,
	/user\s+(not\s+found|already\s+exists)/i,
	/email\s+already/i,
	/already\s+(exists|registered|in\s+use)/i,
	/not\s+verified/i
];
function isExpectedAuthFailure(error) {
	const msg = error?.message;
	if (typeof msg !== "string") return false;
	return EXPECTED_AUTH_FAILURE_PATTERNS.some((re) => re.test(msg));
}
var _sessionInitPromise;
var sessionMaxAge = DEFAULT_MAX_AGE;
async function ensureSessionTable() {
	if (!_sessionInitPromise) _sessionInitPromise = (async () => {
		const client = getDbExec();
		await retryOnDdlRace(() => client.execute(`
          CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            email TEXT,
            created_at ${intType()} NOT NULL
          )
        `));
		try {
			await client.execute(`ALTER TABLE sessions ADD COLUMN email TEXT`);
		} catch {}
	})().catch((err) => {
		_sessionInitPromise = void 0;
		throw err;
	});
	return _sessionInitPromise;
}
/**
* Re-run any `sessions`-table op once if Postgres reports the relation is
* missing. Covers the case where a prior `ensureSessionTable()` resolved but
* the table wasn't actually present (e.g. a race where the CREATE was dropped
* on a reused pool connection, or a cached resolved promise from a prior
* DB URL). Forces a fresh init, then retries the caller's op.
*/
async function retryIfSessionsMissing(op) {
	try {
		return await op();
	} catch (e) {
		if (e?.code !== "42P01") throw e;
		if (!String(e?.message ?? "").includes("sessions")) throw e;
		_sessionInitPromise = void 0;
		await ensureSessionTable();
		return await op();
	}
}
/**
* Create a new session in the legacy sessions table.
* Used by google-oauth.ts for mobile deep linking.
*/
async function addSession(token, email) {
	await ensureSessionTable();
	const client = getDbExec();
	await retryIfSessionsMissing(() => client.execute({
		sql: isPostgres() ? `INSERT INTO sessions (token, email, created_at) VALUES (?, ?, ?) ON CONFLICT (token) DO UPDATE SET email=EXCLUDED.email, created_at=EXCLUDED.created_at` : `INSERT OR REPLACE INTO sessions (token, email, created_at) VALUES (?, ?, ?)`,
		args: [
			token,
			email ?? null,
			Date.now()
		]
	}));
}
/** Remove a session from the legacy sessions table. */
async function removeSession(token) {
	await ensureSessionTable();
	const client = getDbExec();
	await retryIfSessionsMissing(() => client.execute({
		sql: `DELETE FROM sessions WHERE token = ?`,
		args: [token]
	}));
}
/**
* Look up the email associated with a legacy session token.
* Returns null if the session doesn't exist, is expired, or has no email.
*/
async function getSessionEmail(token) {
	await ensureSessionTable();
	const client = getDbExec();
	const { rows } = await retryIfSessionsMissing(() => client.execute({
		sql: `SELECT email, created_at FROM sessions WHERE token = ?`,
		args: [token]
	}));
	if (rows.length === 0) return null;
	const createdAt = rows[0].created_at;
	if (Date.now() - createdAt > sessionMaxAge * 1e3) {
		await client.execute({
			sql: `DELETE FROM sessions WHERE token = ?`,
			args: [token]
		});
		return null;
	}
	return rows[0].email ?? null;
}
var customGetSession = null;
var _authGuardConfig = null;
var _genericGoogleOAuthRoutesEnabled = /* @__PURE__ */ new WeakMap();
function setGenericGoogleOAuthRoutesEnabled(app, enabled) {
	if (app && typeof app === "object") _genericGoogleOAuthRoutesEnabled.set(app, enabled);
}
function areGenericGoogleOAuthRoutesEnabled(app) {
	return _genericGoogleOAuthRoutesEnabled.get(app) !== false;
}
var _desktopExchanges = /* @__PURE__ */ new Map();
var DESKTOP_EXCHANGE_ERROR_PREFIX = "__error__::";
var DESKTOP_AUTH_TOKEN_BODY_ORIGINS = new Set(["tauri://localhost", "http://localhost:1420"]);
var DESKTOP_EXCHANGE_TTL_MS = 300 * 1e3;
/**
* Persist a desktop exchange entry to the sessions table so it survives
* cross-instance routing (e.g. Cloudflare Workers). Stored under a synthetic
* token key "dex:{flowId}"; the `email` column packs both the real session
* token and the user email so they can be recovered in one query.
* Non-fatal — if the DB isn't ready yet the in-memory Map still works for
* same-instance requests.
*/
async function persistDesktopExchangeToDB(flowId, token, email) {
	try {
		await addSession(`dex:${flowId}`, `${token}::${email}`);
	} catch {}
}
/**
* Retrieve and consume a desktop exchange entry from the DB fallback.
* Returns null if not found or already consumed.
*/
async function consumeDesktopExchangeFromDB(flowId) {
	try {
		const { rows } = await getDbExec().execute({
			sql: `DELETE FROM sessions WHERE token = ? AND created_at > ? RETURNING email`,
			args: [`dex:${flowId}`, Date.now() - DESKTOP_EXCHANGE_TTL_MS]
		});
		if (rows.length === 0) return null;
		const packed = rows[0].email ?? rows[0][0];
		if (!packed) return null;
		if (packed.startsWith(DESKTOP_EXCHANGE_ERROR_PREFIX)) {
			const raw = packed.slice(11);
			return { error: JSON.parse(Buffer.from(raw, "base64url").toString()) };
		}
		const sepIdx = packed.indexOf("::");
		if (sepIdx === -1) return null;
		return {
			token: packed.slice(0, sepIdx),
			email: packed.slice(sepIdx + 2)
		};
	} catch {
		return null;
	}
}
setInterval(() => {
	const now = Date.now();
	for (const [k, v] of _desktopExchanges) if (v.expiresAt < now) _desktopExchanges.delete(k);
}, 6e4).unref?.();
/**
* Module-level auth guard function. Set by autoMountAuth() when auth is active.
* Called by the server middleware to enforce auth on ALL requests (not just
* /_agent-native/* routes).
*/
var _authGuardFn = null;
/**
* The H3 app the auth routes + guard were last mounted on. Module-level
* state survives Vite HMR restarts, but each HMR cycle creates a fresh
* nitroApp/H3 instance whose middleware array is empty again. Tracking the
* app here lets autoMountAuth detect "same module state, new app" and
* re-mount routes instead of silently skipping them because `_authGuardFn`
* looks populated from a previous cycle.
*/
var _mountedApp = null;
/**
* Create an auth guard function that checks session and blocks
* unauthenticated requests. Returns the login HTML for page routes
* or a 401 JSON response for API routes.
*
* Reads loginHtml and publicPaths from _authGuardConfig on every request
* so that a custom plugin can update them after the default has already
* installed this middleware (the production race condition fix).
*/
function applyCorsHeaders(event) {
	const origin = getHeader(event, "origin");
	if (!origin) return {
		hasOrigin: false,
		allowed: true
	};
	const allowedOrigin = getAllowedCorsOrigin(origin, {
		allowedOrigins: readCorsAllowedOrigins(),
		allowLocalhostWhenNoAllowlist: true
	});
	if (!allowedOrigin) return {
		hasOrigin: true,
		allowed: false
	};
	setResponseHeader(event, "Access-Control-Allow-Origin", allowedOrigin);
	setResponseHeader(event, "Vary", "Origin");
	setResponseHeader(event, "Access-Control-Allow-Credentials", "true");
	setResponseHeader(event, "Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS");
	setResponseHeader(event, "Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,X-Request-Source,X-Agent-Native-CSRF");
	return {
		hasOrigin: true,
		allowed: true
	};
}
function createAuthCorsHandler() {
	return defineEventHandler((event) => {
		const cors = applyCorsHeaders(event);
		if (getMethod$1(event) !== "OPTIONS") return;
		if (cors.hasOrigin && !cors.allowed) {
			setResponseStatus(event, 403);
			return "";
		}
		setResponseStatus(event, 204);
		return "";
	});
}
function mountAuthCorsMiddleware(app) {
	const handler = createAuthCorsHandler();
	app.use("/_agent-native/auth", handler);
	app.use("/_agent-native/google", handler);
}
function isWorkspaceOAuthCallbackRelayEnabled() {
	return process.env.AGENT_NATIVE_WORKSPACE === "1" || process.env.VITE_AGENT_NATIVE_WORKSPACE === "1";
}
function isFrameworkOAuthCallbackPath(pathname) {
	return pathname.startsWith("/_agent-native/") && (pathname.endsWith("/callback") || pathname.includes("/callback/"));
}
function getRequestPathAndSearch(event) {
	const mountedPathname = event.context?._mountedPathname;
	if (typeof mountedPathname === "string" && mountedPathname) return {
		rawPath: mountedPathname,
		search: event.url?.search || ""
	};
	const url = event.node?.req?.url ?? event.path ?? "/";
	const queryStart = url.indexOf("?");
	return {
		rawPath: queryStart >= 0 ? url.slice(0, queryStart) : url,
		search: queryStart >= 0 ? url.slice(queryStart) : ""
	};
}
function workspaceOAuthCallbackRelayResponse(event) {
	const { rawPath, search } = getRequestPathAndSearch(event);
	const normalizedPath = stripAppBasePath(rawPath);
	const basePath = getAppBasePath();
	if (!basePath || !isWorkspaceOAuthCallbackRelayEnabled() || !isFrameworkOAuthCallbackPath(normalizedPath) || rawPath === `${basePath}/_agent-native` || rawPath.startsWith(`${basePath}/_agent-native/`)) return;
	const appId = extractOAuthStateAppId(new URLSearchParams(search.startsWith("?") ? search.slice(1) : search).get("state"));
	if (!appId || appId === getOAuthStateAppId() || !isValidWorkspaceAppIdFormat(appId)) return;
	return new Response("", {
		status: 302,
		headers: { Location: `/${appId}${normalizedPath}${search}` }
	});
}
function createAuthGuardFn() {
	return async (event) => {
		const config = _authGuardConfig;
		if (!config) return;
		const { publicPaths } = config;
		const url = event.node?.req?.url ?? event.path ?? "/";
		const queryStart = url.indexOf("?");
		const rawPath = queryStart >= 0 ? url.slice(0, queryStart) : url;
		const loginHtml = config.getLoginHtml?.(event, rawPath) ?? config.loginHtml;
		const p = stripAppBasePath(rawPath);
		const normalizedUrl = queryStart >= 0 ? `${p}${url.slice(queryStart)}` : p;
		const callbackRelay = workspaceOAuthCallbackRelayResponse(event);
		if (callbackRelay) return callbackRelay;
		const cors = applyCorsHeaders(event);
		if (getMethod$1(event) === "OPTIONS") {
			if (cors.hasOrigin && !cors.allowed) {
				setResponseStatus(event, 403);
				return "";
			}
			setResponseStatus(event, 204);
			return "";
		}
		if (p.startsWith("/_agent-native/auth/") || p === "/_agent-native/google/callback" || p === "/_agent-native/google/auth-url" || p === "/_agent-native/google/add-account/callback") return;
		if (/^\/_agent-native\/integrations\/[^/]+\/webhook$/.test(p)) return;
		if (p === "/_agent-native/integrations/process-task") return;
		if (p === "/_agent-native/integrations/process-a2a-continuation") return;
		if (p === "/_agent-native/a2a") return;
		if (p === "/_agent-native/a2a/_process-task") return;
		if (p === "/_agent-native/org/a2a-secret/receive") return;
		if (p === "/_agent-native/sign-in") {
			const queryStr = queryStart >= 0 ? url.slice(queryStart + 1) : "";
			const safeReturn = safeReturnPath(new URLSearchParams(queryStr).get("return"));
			if (await getSession(event)) return new Response("", {
				status: 302,
				headers: { Location: safeReturn }
			});
			return new Response(loginHtml, {
				status: 200,
				headers: { "Content-Type": "text/html; charset=utf-8" }
			});
		}
		if (p === "/login" || p === "/signup") {
			if (await getSession(event)) return new Response("", {
				status: 302,
				headers: { Location: getAppBasePath() || "/" }
			});
			return new Response(loginHtml, {
				status: 200,
				headers: { "Content-Type": "text/html; charset=utf-8" }
			});
		}
		if (p.startsWith("/assets/") || p.startsWith("/_build/") || p.endsWith(".js") || p.endsWith(".css") || p.endsWith(".map") || p.endsWith(".ico") || p.endsWith(".png") || p.endsWith(".svg") || p.endsWith(".woff2") || p.endsWith(".woff")) return;
		if (p === "/__manifest") return;
		if (isPublicPath(normalizedUrl, publicPaths)) return;
		if (await getSession(event)) return;
		if (p.startsWith("/api/") || p.startsWith("/_agent-native/")) {
			setResponseStatus(event, 401);
			return { error: "Unauthorized" };
		}
		return new Response(loginHtml, {
			status: 200,
			headers: { "Content-Type": "text/html; charset=utf-8" }
		});
	};
}
/**
* Map a Better Auth session to our AuthSession type.
*/
function mapBetterAuthSession(baSession) {
	return {
		email: baSession.user.email,
		userId: baSession.user.id,
		name: baSession.user.name,
		token: baSession.session?.token,
		orgId: baSession.session?.activeOrganizationId ?? void 0
	};
}
/**
* Get the current auth session for a request.
*
* Resolution chain:
* 1. ACCESS_TOKEN → check legacy cookie-based token sessions
* 2. BYOA custom getSession → delegate to template callback
* 3. Bearer legacy session → check Authorization: Bearer against sessions
* 4. Better Auth → check session via Better Auth API (cookie or Bearer)
* 5. Legacy cookie → check an_session cookie in legacy sessions table
* 6. Desktop SSO broker (Electron loopback only)
* 7. Mobile _session query param → promote to cookie
*
* Returns `null` for unauthenticated requests. There is no dev-mode bypass:
* local development uses the same Better Auth signup flow as production. The
* onboarding/sign-in page is served by `runAuthGuard` for any unauthenticated
* page load.
*/
async function getSession(event) {
	if (getAccessTokens().length > 0) {
		const cookie = getCookie(event, COOKIE_NAME);
		if (cookie) {
			const email = await getSessionEmail(cookie);
			if (email) return {
				email,
				token: cookie
			};
		}
	}
	if (customGetSession) {
		const session = await customGetSession(event);
		if (session) return session;
		const bearerSession = await getBearerLegacySession(event);
		if (bearerSession) return bearerSession;
		const sso = await readDesktopSsoSafely(event);
		if (sso?.email) return {
			email: sso.email,
			token: sso.token
		};
	} else {
		const bearerSession = await getBearerLegacySession(event);
		if (bearerSession) return bearerSession;
		try {
			const ba = getBetterAuthSync();
			if (ba) {
				const baSession = await ba.api.getSession({ headers: event.headers });
				if (baSession?.user?.email) return mapBetterAuthSession(baSession);
			}
		} catch (e) {
			console.error("[auth] ba.api.getSession error:", e);
		}
		const cookie = getCookie(event, COOKIE_NAME);
		if (cookie) {
			const email = await getSessionEmail(cookie);
			if (email) return {
				email,
				token: cookie
			};
		}
		const sso = await readDesktopSsoSafely(event);
		if (sso?.email) return {
			email: sso.email,
			token: sso.token
		};
	}
	const querySession = await promoteQuerySession(event);
	if (querySession) return querySession;
	return null;
}
async function promoteQuerySession(event) {
	const qToken = getQuery(event)?._session;
	if (!qToken) return null;
	const email = await getSessionEmail(qToken);
	if (!email) return null;
	setFrameworkSessionCookie(event, qToken);
	setResponseHeader(event, "Referrer-Policy", "no-referrer");
	return {
		email,
		token: qToken
	};
}
function isReadMethod(event) {
	const method = getMethod$1(event);
	return method === "GET" || method === "HEAD";
}
/**
* Cookie attributes that work in both same-site and third-party iframe
* contexts. Over HTTPS we emit `SameSite=None; Secure; Partitioned` —
* `None`+`Secure` is required by browsers to ship the cookie back inside a
* cross-origin iframe at all; `Partitioned` keeps the cookie working under
* Chrome's third-party-cookie deprecation by binding it to the embedding
* site's storage partition. (Better Auth already sets the same trio on its
* own session cookie; this matches so the framework's legacy cookie —
* which the Builder OAuth popup exchange writes via
* `setFrameworkSessionCookie` — survives iframe contexts too.) Plain-HTTP
* dev keeps the default `SameSite=Lax`; `None` requires Secure, and
* `Partitioned` only takes effect alongside `Secure`.
*/
function crossSiteCookieAttrs(event) {
	return isHttpsRequest(event) ? {
		sameSite: "none",
		secure: true,
		partitioned: true
	} : {
		sameSite: "lax",
		secure: false
	};
}
function setFrameworkSessionCookie(event, token) {
	setCookie(event, COOKIE_NAME, token, {
		httpOnly: true,
		...crossSiteCookieAttrs(event),
		...cookieDomainAttrs(),
		path: "/",
		maxAge: sessionMaxAge
	});
}
function isHttpsRequest(event) {
	try {
		const xfProto = getHeader(event, "x-forwarded-proto");
		if (xfProto && String(xfProto).split(",")[0].trim() === "https") return true;
		const url = (event.req ?? event.node?.req)?.url;
		if (typeof url === "string" && url.startsWith("https://")) return true;
		if ((process.env.APP_URL || process.env.BETTER_AUTH_URL || "").startsWith("https://")) return true;
	} catch {}
	return false;
}
function isPublicPath(url, publicPaths) {
	const p = url.split("?")[0];
	return publicPaths.some((pp) => p === pp || p.startsWith(pp + "/"));
}
function stripAppBasePath(pathname) {
	const basePath = getAppBasePath();
	if (!basePath) return pathname;
	if (pathname === basePath) return "/";
	if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || "/";
	return pathname;
}
function inferWorkspaceBasePathFromRequest(requestPath) {
	if (process.env.AGENT_NATIVE_WORKSPACE !== "1" && process.env.VITE_AGENT_NATIVE_WORKSPACE !== "1") return "";
	if (!requestPath || !requestPath.startsWith("/")) return "";
	const firstSegment = requestPath.split(/[/?#]/)[1];
	if (!firstSegment) return "";
	if (new Set([
		"_agent-native",
		".well-known",
		"api",
		"login",
		"signup",
		"apps",
		"new-app",
		"approval",
		"extensions"
	]).has(firstSegment)) return "";
	if (!isValidWorkspaceAppIdFormat(firstSegment)) return "";
	return `/${firstSegment}`;
}
function getTokenLoginHtml(options = {}) {
	const configuredBasePath = getAppBasePath() || inferWorkspaceBasePathFromRequest(options.requestPath);
	return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no">
<title>Private app</title>
<style>
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    color-scheme: dark;
    --bg: #09090b;
    --panel: #141417;
    --panel-soft: #1b1b20;
    --border: rgba(255,255,255,0.1);
    --border-strong: rgba(255,255,255,0.18);
    --text: #f4f4f5;
    --muted: #a1a1aa;
    --subtle: #71717a;
    --error: #fca5a5;
    --error-bg: rgba(127,29,29,0.18);
    --success: #86efac;
    --success-bg: rgba(20,83,45,0.2);
    --info: #c4b5fd;
    --info-bg: rgba(76,29,149,0.18);
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
    background:
      radial-gradient(circle at top left, rgba(63,63,70,0.24), transparent 32rem),
      linear-gradient(180deg, #111114 0%, var(--bg) 58%);
    color: var(--text);
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100vh;
    padding: 1rem;
  }
  .card {
    width: 100%;
    max-width: 420px;
    padding: 2rem;
    background: color-mix(in srgb, var(--panel) 94%, transparent);
    border: 1px solid var(--border);
    border-radius: 12px;
    box-shadow: 0 24px 80px rgba(0,0,0,0.35);
  }
  .eyebrow {
    display: inline-flex;
    align-items: center;
    min-height: 1.5rem;
    padding: 0 0.625rem;
    margin-bottom: 1rem;
    border: 1px solid var(--border);
    border-radius: 999px;
    color: var(--muted);
    background: rgba(255,255,255,0.04);
    font-size: 0.75rem;
    font-weight: 500;
  }
  h1 {
    font-size: 1.375rem;
    line-height: 1.2;
    font-weight: 650;
    margin-bottom: 0.5rem;
    color: var(--text);
    letter-spacing: 0;
  }
  .intro {
    margin-bottom: 1.5rem;
    color: var(--muted);
    font-size: 0.9375rem;
    line-height: 1.55;
  }
  label {
    display: flex;
    align-items: baseline;
    justify-content: space-between;
    gap: 0.75rem;
    font-size: 0.8125rem;
    color: var(--muted);
    margin-bottom: 0.375rem;
  }
  label span:last-child {
    color: var(--subtle);
    font-size: 0.75rem;
  }
  .input-wrap { position: relative; }
  input {
    width: 100%;
    min-height: 2.75rem;
    padding: 0.625rem 0.75rem;
    background: #0f0f12;
    border: 1px solid var(--border);
    border-radius: 8px;
    color: var(--text);
    font-size: 0.9375rem;
    outline: none;
  }
  input:focus {
    border-color: var(--border-strong);
    box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
  }
  input::placeholder { color: #52525b; }
  button {
    width: 100%;
    min-height: 2.75rem;
    margin-top: 1rem;
    padding: 0.625rem 0.875rem;
    background: var(--text);
    color: #000;
    border: none;
    border-radius: 8px;
    font-size: 0.9375rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 120ms ease, opacity 120ms ease, background 120ms ease;
  }
  button:hover:not(:disabled) { background: #e4e4e7; transform: translateY(-1px); }
  button:disabled { opacity: 0.55; cursor: wait; }
  .hint {
    margin-top: 0.75rem;
    color: var(--subtle);
    font-size: 0.8125rem;
    line-height: 1.45;
  }
  .msg {
    display: none;
    margin-top: 0.875rem;
    padding: 0.75rem;
    border-radius: 8px;
    font-size: 0.8125rem;
    line-height: 1.45;
  }
  .msg.show { display: block; }
  .msg.error {
    color: var(--error);
    background: var(--error-bg);
    border: 1px solid rgba(248,113,113,0.22);
  }
  .msg.success {
    color: var(--success);
    background: var(--success-bg);
    border: 1px solid rgba(74,222,128,0.18);
  }
  .msg.info {
    color: var(--info);
    background: var(--info-bg);
    border: 1px solid rgba(167,139,250,0.2);
  }
  details {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid var(--border);
  }
  summary {
    cursor: pointer;
    color: var(--muted);
    font-size: 0.8125rem;
    font-weight: 600;
  }
  details p {
    margin-top: 0.75rem;
    color: var(--subtle);
    font-size: 0.8125rem;
    line-height: 1.5;
  }
  code {
    color: #e4e4e7;
    background: var(--panel-soft);
    border: 1px solid var(--border);
    border-radius: 5px;
    padding: 0.075rem 0.25rem;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 0.78rem;
  }
  @media (max-width: 480px) {
    .card { padding: 1.5rem; }
    h1 { font-size: 1.25rem; }
  }
</style>
</head>
<body>
<div class="card">
  <div class="eyebrow">Private deployment</div>
  <h1>This app is private</h1>
  <p class="intro">Enter the shared app access token to continue. This is the value configured for this app, not your deploy provider account token.</p>
  <form id="form">
    <label for="token"><span>App ACCESS_TOKEN</span><span>Required</span></label>
    <div class="input-wrap">
      <input id="token" type="password" autocomplete="current-password" autofocus placeholder="Paste the shared app token" />
    </div>
    <button id="submit" type="submit">Continue</button>
    <p class="hint">If someone sent you this app, ask them for the shared app token. If you own the deploy, use the exact value saved as <code>ACCESS_TOKEN</code> or one of <code>ACCESS_TOKENS</code>.</p>
    <p class="msg error" id="msg" role="alert"></p>
  </form>
  <details>
    <summary>Where do I find this?</summary>
    <p>Create or copy the app's shared token from your deployment environment variables. The key should be <code>ACCESS_TOKEN</code> for one token or <code>ACCESS_TOKENS</code> for a comma-separated list. Redeploy after changing it.</p>
  </details>
</div>
<script>
  var configuredBasePath = ${JSON.stringify(configuredBasePath)};
  function __anBasePath() {
    if (
      configuredBasePath &&
      (window.location.pathname === configuredBasePath ||
        window.location.pathname.indexOf(configuredBasePath + '/') === 0)
    ) {
      return configuredBasePath;
    }
    var marker = '/_agent-native';
    var idx = window.location.pathname.indexOf(marker);
    return idx > 0 ? window.location.pathname.slice(0, idx) : '';
  }
  function __anPath(path) {
    return __anBasePath() + path;
  }
  function setMessage(kind, text) {
    var msg = document.getElementById('msg');
    msg.textContent = text;
    msg.className = 'msg ' + kind + ' show';
  }
  function clearMessage() {
    var msg = document.getElementById('msg');
    msg.textContent = '';
    msg.className = 'msg error';
  }
  function setBusy(isBusy) {
    var button = document.getElementById('submit');
    var input = document.getElementById('token');
    button.disabled = isBusy;
    input.disabled = isBusy;
    button.textContent = isBusy ? 'Checking...' : 'Continue';
  }
  async function readJsonSafely(res) {
    try {
      return await res.json();
    } catch (_err) {
      return null;
    }
  }
  async function verifySession() {
    var res = await fetch(__anPath('/_agent-native/auth/session'), {
      method: 'GET',
      credentials: 'same-origin',
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
    });
    if (!res.ok) return false;
    var data = await readJsonSafely(res);
    return !!data && !data.error;
  }
  document.getElementById('form').addEventListener('submit', async (e) => {
    e.preventDefault();
    var token = document.getElementById('token').value.trim();
    if (!token) {
      setMessage('error', 'Paste the shared app token to continue.');
      return;
    }
    clearMessage();
    setBusy(true);
    setMessage('info', 'Checking the app token...');
    try {
      var res = await fetch(__anPath('/_agent-native/auth/login'), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify({ token: token }),
      });
      if (!res.ok) {
        var badTokenMessage = 'That token was not accepted. Use this app\\'s shared ACCESS_TOKEN, not your deploy provider account token.';
        if (res.status === 404) {
          badTokenMessage = 'Could not reach this app\\'s auth endpoint. If this app is mounted under a path, confirm APP_BASE_PATH and VITE_APP_BASE_PATH match the deploy path.';
        }
        setMessage('error', badTokenMessage);
        setBusy(false);
        return;
      }
      var hasSession = await verifySession();
      if (!hasSession) {
        setMessage('error', 'The token was accepted, but the browser did not keep the session cookie. Try opening the app in a new tab, or check cookie restrictions for this domain.');
        setBusy(false);
        return;
      }
      setMessage('success', 'Signed in. Opening the app...');
      window.location.replace(window.location.href);
    } catch (_err) {
      setMessage('error', 'Could not contact the auth endpoint. Check the deploy status, then try again.');
      setBusy(false);
    }
  });
<\/script>
</body>
</html>`;
}
async function mountBetterAuthRoutes(app, options) {
	const publicPaths = [...options.publicPaths ?? []];
	for (const pp of [
		"/.well-known",
		"/favicon.ico",
		"/favicon.png"
	]) if (!publicPaths.includes(pp)) publicPaths.push(pp);
	if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET && options.mountGoogleOAuthRoutes !== false) {
		setGenericGoogleOAuthRoutesEnabled(app, true);
		for (const gp of ["/_agent-native/google/callback", "/_agent-native/google/auth-url"]) if (!publicPaths.includes(gp)) publicPaths.push(gp);
		const googleScopes = [
			"openid",
			"https://www.googleapis.com/auth/userinfo.email",
			"https://www.googleapis.com/auth/userinfo.profile"
		].join(" ");
		app.use("/_agent-native/google/auth-url", defineEventHandler((event) => {
			if (!areGenericGoogleOAuthRoutesEnabled(app)) return void 0;
			if (getMethod$1(event) !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const redirectUri = resolveOAuthRedirectUri(event);
			if (redirectUri === null) {
				setResponseStatus(event, 400);
				return { error: "Invalid redirect_uri" };
			}
			const q = getQuery(event);
			const desktop = isElectron(event) || q.desktop === "1" || q.desktop === "true";
			const flowId = desktop ? q.flow_id || void 0 : void 0;
			const returnQuery = q.return;
			const validated = typeof returnQuery === "string" ? safeOAuthReturnUrl(returnQuery, {
				allowDefaultLoopback: isBuilderOAuthRequest(event),
				allowedOrigins: [builderPreviewReturnOrigin(event)]
			}) : "/";
			const returnUrl = validated !== "/" ? validated : void 0;
			const state = encodeOAuthState({
				redirectUri,
				desktop,
				addAccount: false,
				app: getOAuthStateAppId(),
				returnUrl,
				flowId
			});
			logGoogleOAuthDebug(event, "auth-url", {
				flowId,
				desktop,
				redirectPath: oauthDebugUrlPath(redirectUri),
				returnUrl,
				redirect: q.redirect === "1",
				workspace: process.env.AGENT_NATIVE_WORKSPACE === "1" || process.env.VITE_AGENT_NATIVE_WORKSPACE === "1"
			});
			const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${new URLSearchParams({
				client_id: process.env.GOOGLE_CLIENT_ID,
				redirect_uri: redirectUri,
				response_type: "code",
				scope: googleScopes,
				access_type: "online",
				prompt: "select_account",
				state
			})}`;
			if (q.redirect === "1") return sendRedirect(event, authUrl, 302);
			return { url: authUrl };
		}));
		app.use("/_agent-native/google/callback", defineEventHandler(async (event) => {
			if (!areGenericGoogleOAuthRoutesEnabled(app)) return void 0;
			if (getMethod$1(event) !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const callbackRelay = workspaceOAuthCallbackRelayResponse(event);
			if (callbackRelay) return callbackRelay;
			let callbackFlowId;
			let callbackDesktop = false;
			try {
				const query = getQuery(event);
				const code = query.code;
				if (!code) {
					setResponseStatus(event, 400);
					return { error: "Missing authorization code" };
				}
				const { redirectUri, desktop, returnUrl, flowId } = decodeOAuthState(query.state, getAppUrl(event, "/_agent-native/google/callback"));
				callbackFlowId = flowId;
				callbackDesktop = desktop;
				logGoogleOAuthDebug(event, "callback-start", {
					flowId,
					desktop,
					redirectPath: oauthDebugUrlPath(redirectUri),
					hasCode: !!code,
					returnUrl
				});
				if (!isAllowedOAuthRedirectUri(redirectUri, event)) {
					setResponseStatus(event, 400);
					return { error: "Invalid redirect_uri in state" };
				}
				const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
					method: "POST",
					headers: { "Content-Type": "application/x-www-form-urlencoded" },
					body: new URLSearchParams({
						code,
						client_id: process.env.GOOGLE_CLIENT_ID,
						client_secret: process.env.GOOGLE_CLIENT_SECRET,
						redirect_uri: redirectUri,
						grant_type: "authorization_code"
					})
				});
				const tokens = await tokenRes.json();
				if (!tokenRes.ok) throw new Error(tokens.error_description || tokens.error || "Token exchange failed");
				const user = await (await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: `Bearer ${tokens.access_token}` } })).json();
				const email = user.email;
				if (!email) throw new Error("Could not get email from Google");
				if (user.verified_email !== true) throw new Error("Google account email is not verified. Please verify your email with Google and try again.");
				const { sessionToken } = await createOAuthSession(event, email, {
					hasProductionSession: false,
					desktop
				});
				logGoogleOAuthDebug(event, "callback-session-created", {
					flowId,
					desktop,
					hasSessionToken: !!sessionToken,
					emailDomain: email.split("@")[1] || ""
				});
				if (flowId && sessionToken) {
					_desktopExchanges.set(flowId, {
						token: sessionToken,
						email,
						expiresAt: Date.now() + DESKTOP_EXCHANGE_TTL_MS
					});
					persistDesktopExchangeToDB(flowId, sessionToken, email);
					logGoogleOAuthDebug(event, "callback-exchange-stored", {
						flowId,
						desktop
					});
				}
				return oauthCallbackResponse(event, email, {
					sessionToken,
					desktop,
					returnUrl,
					flowId
				});
			} catch (error) {
				const msg = error.message || "Unknown error";
				logGoogleOAuthDebug(event, "callback-error", {
					flowId: callbackFlowId,
					desktop: callbackDesktop,
					message: msg
				});
				return oauthErrorPage(`Connection failed: ${msg}`);
			}
		}));
	}
	app.use("/_agent-native/auth/desktop-exchange", defineEventHandler(async (event) => {
		if (getMethod$1(event) !== "GET") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const flowId = getQuery(event).flow_id;
		if (!flowId) {
			setResponseStatus(event, 400);
			return { error: "Missing flow_id" };
		}
		let entry = _desktopExchanges.get(flowId);
		if (!entry || entry.expiresAt < Date.now()) {
			const fromDb = await consumeDesktopExchangeFromDB(flowId);
			if (!fromDb) return {
				pending: true,
				flow: oauthDebugFlowId(flowId)
			};
			entry = "error" in fromDb ? {
				error: fromDb.error,
				expiresAt: Date.now() + 1
			} : {
				token: fromDb.token,
				email: fromDb.email,
				expiresAt: Date.now() + 1
			};
		}
		_desktopExchanges.delete(flowId);
		removeSession(`dex:${flowId}`);
		if ("error" in entry) {
			logGoogleOAuthDebug(event, "exchange-error", {
				flowId,
				message: entry.error.message,
				code: entry.error.code
			});
			return {
				error: entry.error.message,
				...entry.error
			};
		}
		setFrameworkSessionCookie(event, entry.token);
		setResponseHeader(event, "Referrer-Policy", "no-referrer");
		logGoogleOAuthDebug(event, "exchange-success", {
			flowId,
			emailDomain: entry.email.split("@")[1] || ""
		});
		return {
			token: entry.token,
			email: entry.email
		};
	}));
	const accessTokens = getAccessTokens();
	const auth = await getBetterAuth({
		...options.betterAuth ?? {},
		...options.googleScopes ? { googleScopes: options.googleScopes } : {}
	});
	app.use("/_agent-native/auth/ba", defineEventHandler(async (event) => {
		const reqPath = event.url?.pathname ?? event.path ?? "";
		const isResetPassword = reqPath.includes("reset-password") && getMethod$1(event) === "POST";
		let resetToken;
		let resetUserId;
		if (isResetPassword) {
			try {
				resetToken = (await event.req.clone().json().catch(() => void 0))?.token;
			} catch {}
			if (resetToken) try {
				const { getDbExec } = await import("./client-BpA2t7pN.js").then((n) => n.t);
				resetUserId = (await getDbExec().execute({
					sql: "SELECT value FROM verification WHERE identifier = ?",
					args: [`reset-password:${resetToken}`]
				})).rows[0]?.value;
			} catch {}
		}
		const response = await auth.handler(toWebRequest(event));
		const isResponse = response != null && typeof response.status === "number" && typeof response.headers?.get === "function";
		if (reqPath.includes("verify-email") && isResponse && response.status >= 300 && response.status < 400) {
			const loc = response.headers.get("location");
			if (loc && !/[?&]verified=/.test(loc)) {
				const sep = loc.includes("?") ? "&" : "?";
				response.headers.set("location", loc + sep + "verified=1");
			}
		}
		if (isResetPassword && resetUserId && isResponse && response.status >= 200 && response.status < 300) try {
			const { getDbExec } = await import("./client-BpA2t7pN.js").then((n) => n.t);
			const db = getDbExec();
			await db.execute({
				sql: "UPDATE \"user\" SET email_verified = TRUE WHERE id = ? AND (email_verified = FALSE OR email_verified IS NULL)",
				args: [resetUserId]
			});
			const newSessionToken = extractSessionTokenFromSetCookies(response);
			if (newSessionToken) await db.execute({
				sql: "DELETE FROM \"session\" WHERE user_id = ? AND token <> ?",
				args: [resetUserId, newSessionToken]
			});
			else await db.execute({
				sql: "DELETE FROM \"session\" WHERE user_id = ?",
				args: [resetUserId]
			});
			try {
				const { rows } = await db.execute({
					sql: "SELECT email FROM \"user\" WHERE id = ?",
					args: [resetUserId]
				});
				const userEmail = rows[0]?.email ?? rows[0]?.[0];
				if (userEmail) if (newSessionToken) await db.execute({
					sql: "DELETE FROM sessions WHERE email = ? AND token <> ?",
					args: [userEmail, newSessionToken]
				});
				else await db.execute({
					sql: "DELETE FROM sessions WHERE email = ?",
					args: [userEmail]
				});
			} catch {}
		} catch {}
		return response;
	}));
	app.use("/_agent-native/auth/login", defineEventHandler(async (event) => {
		if (getMethod$1(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const body = await readBody(event);
		if (body?.token && typeof body.token === "string" && accessTokens.length > 0) {
			if (!safeTokenMatch(body.token, accessTokens)) {
				setResponseStatus(event, 401);
				return { error: "Invalid token" };
			}
			const sessionToken = crypto$1.randomBytes(32).toString("hex");
			await addSession(sessionToken, "user");
			setCookie(event, COOKIE_NAME, sessionToken, {
				httpOnly: true,
				...crossSiteCookieAttrs(event),
				...cookieDomainAttrs(),
				path: "/",
				maxAge: sessionMaxAge
			});
			return authLoginResponse(event, sessionToken, "user");
		}
		const email = body?.email?.trim?.()?.toLowerCase?.();
		const password = body?.password;
		if (!email || !password) {
			setResponseStatus(event, 400);
			return { error: "Email and password are required" };
		}
		try {
			const result = await auth.api.signInEmail({ body: {
				email,
				password
			} });
			if (result?.token) {
				setCookie(event, COOKIE_NAME, result.token, {
					httpOnly: true,
					...crossSiteCookieAttrs(event),
					...cookieDomainAttrs(),
					path: "/",
					maxAge: sessionMaxAge
				});
				await addSession(result.token, email);
				if (isElectron(event)) await writeDesktopSso({
					email,
					token: result.token,
					expiresAt: Date.now() + sessionMaxAge * 1e3
				});
				return authLoginResponse(event, result.token, email);
			}
			setResponseStatus(event, 403);
			return { error: "Email not verified. Check your inbox for a verification link." };
		} catch (e) {
			if (!isExpectedAuthFailure(e)) captureAuthError(e, {
				route: "login",
				email
			});
			setResponseStatus(event, 401);
			return { error: e?.message || "Invalid email or password" };
		}
	}));
	app.use("/_agent-native/auth/register", defineEventHandler(async (event) => {
		if (getMethod$1(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const body = await readBody(event);
		const email = body?.email?.trim?.()?.toLowerCase?.();
		const password = body?.password;
		const callbackURL = typeof body?.callbackURL === "string" ? safeReturnPath(body.callbackURL) : "/";
		if (!email || typeof email !== "string" || !email.includes("@")) {
			setResponseStatus(event, 400);
			return { error: "Valid email is required" };
		}
		if (!password || typeof password !== "string" || password.length < 8) {
			setResponseStatus(event, 400);
			return { error: "Password must be at least 8 characters" };
		}
		try {
			await auth.api.signUpEmail({ body: {
				email,
				password,
				name: email.split("@")[0],
				callbackURL
			} });
			return { ok: true };
		} catch (e) {
			if (!isExpectedAuthFailure(e)) captureAuthError(e, {
				route: "signup",
				email
			});
			setResponseStatus(event, 409);
			return { error: e?.message || "Registration failed" };
		}
	}));
	app.use("/_agent-native/auth/logout", defineEventHandler(async (event) => {
		const cookie = getCookie(event, COOKIE_NAME);
		if (cookie) await removeSession(cookie);
		const bearerToken = getBearerSessionToken(event);
		if (bearerToken) await removeSession(bearerToken);
		deleteCookie(event, COOKIE_NAME, {
			path: "/",
			...cookieDomainAttrs()
		});
		try {
			await auth.api.signOut({ headers: event.headers });
		} catch {}
		if (isElectron(event)) await clearDesktopSso();
		return { ok: true };
	}));
	app.use("/_agent-native/auth/logout-all", defineEventHandler(async (event) => {
		if (getMethod$1(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const session = await getSession(event);
		if (!session?.email) {
			setResponseStatus(event, 401);
			return { error: "Not authenticated" };
		}
		try {
			const db = getDbExec();
			let userId;
			try {
				const { rows } = await db.execute({
					sql: "SELECT id FROM \"user\" WHERE email = ?",
					args: [session.email]
				});
				userId = rows[0]?.id ?? rows[0]?.[0];
			} catch {}
			if (userId) try {
				await db.execute({
					sql: "DELETE FROM \"session\" WHERE user_id = ?",
					args: [userId]
				});
			} catch {}
			try {
				await db.execute({
					sql: "DELETE FROM sessions WHERE email = ?",
					args: [session.email]
				});
			} catch {}
			deleteCookie(event, COOKIE_NAME, {
				path: "/",
				...cookieDomainAttrs()
			});
			try {
				await auth.api.signOut({ headers: event.headers });
			} catch {}
			if (isElectron(event)) await clearDesktopSso();
			return { ok: true };
		} catch (e) {
			setResponseStatus(event, 500);
			return { error: e?.message || "Failed to revoke sessions" };
		}
	}));
	app.use("/_agent-native/auth/session", defineEventHandler(async (event) => {
		if (!isReadMethod(event)) {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		return await getSession(event) ?? { error: "Not authenticated" };
	}));
	app.use("/_agent-native/auth/reset", defineEventHandler((event) => {
		if (!isReadMethod(event)) {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		return new Response(getResetPasswordHtml(), { headers: { "Content-Type": "text/html; charset=utf-8" } });
	}));
	_authGuardConfig = {
		loginHtml: options.loginHtml ?? getOnboardingHtml({
			googleOnly: options.googleOnly,
			marketing: options.marketing,
			googleSignInNotice: options.googleSignInNotice,
			googleAuthMode: options.googleAuthMode
		}),
		publicPaths
	};
	const guardFn = createAuthGuardFn();
	_authGuardFn = guardFn;
	app.use(defineEventHandler(guardFn));
}
function mountTokenOnlyRoutes(app, accessTokens, publicPaths = []) {
	app.use("/_agent-native/auth/login", defineEventHandler(async (event) => {
		if (getMethod$1(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const body = await readBody(event);
		if (!body?.token || typeof body.token !== "string" || !safeTokenMatch(body.token, accessTokens)) {
			setResponseStatus(event, 401);
			return { error: "Invalid token" };
		}
		const sessionToken = crypto$1.randomBytes(32).toString("hex");
		await addSession(sessionToken, "user");
		setCookie(event, COOKIE_NAME, sessionToken, {
			httpOnly: true,
			...crossSiteCookieAttrs(event),
			...cookieDomainAttrs(),
			path: "/",
			maxAge: sessionMaxAge
		});
		return authLoginResponse(event, sessionToken, "user");
	}));
	app.use("/_agent-native/auth/logout", defineEventHandler(async (event) => {
		const cookie = getCookie(event, COOKIE_NAME);
		if (cookie) await removeSession(cookie);
		const bearerToken = getBearerSessionToken(event);
		if (bearerToken) await removeSession(bearerToken);
		deleteCookie(event, COOKIE_NAME, {
			path: "/",
			...cookieDomainAttrs()
		});
		if (isElectron(event)) await clearDesktopSso();
		return { ok: true };
	}));
	app.use("/_agent-native/auth/session", defineEventHandler(async (event) => {
		if (!isReadMethod(event)) {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		return await getSession(event) ?? { error: "Not authenticated" };
	}));
	_authGuardConfig = {
		loginHtml: getTokenLoginHtml(),
		getLoginHtml: (_event, rawPath) => getTokenLoginHtml({ requestPath: rawPath }),
		publicPaths
	};
	const guardFn = createAuthGuardFn();
	_authGuardFn = guardFn;
	app.use(defineEventHandler(guardFn));
}
function mountAuthFallbackRoutes(app) {
	app.use("/_agent-native/auth/login", defineEventHandler(async (event) => {
		if (getMethod$1(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const body = await readBody(event);
		const email = body?.email?.trim?.()?.toLowerCase?.();
		const password = body?.password;
		if (!email || !password) {
			setResponseStatus(event, 400);
			return { error: "Email and password are required" };
		}
		try {
			const result = await (await getBetterAuth()).api.signInEmail({ body: {
				email,
				password
			} });
			if (result?.token) {
				setCookie(event, COOKIE_NAME, result.token, {
					httpOnly: true,
					...crossSiteCookieAttrs(event),
					...cookieDomainAttrs(),
					path: "/",
					maxAge: sessionMaxAge
				});
				await addSession(result.token, email);
				if (isElectron(event)) await writeDesktopSso({
					email,
					token: result.token,
					expiresAt: Date.now() + sessionMaxAge * 1e3
				});
				return authLoginResponse(event, result.token, email);
			}
			setResponseStatus(event, 403);
			return { error: "Email not verified. Check your inbox for a verification link." };
		} catch (e) {
			if (!isExpectedAuthFailure(e)) captureAuthError(e, {
				route: "login",
				email
			});
			setResponseStatus(event, 401);
			return { error: e?.message || "Invalid email or password" };
		}
	}));
	app.use("/_agent-native/auth/register", defineEventHandler(async (event) => {
		if (getMethod$1(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const body = await readBody(event);
		const email = body?.email?.trim?.()?.toLowerCase?.();
		const password = body?.password;
		if (!email || typeof email !== "string" || !email.includes("@")) {
			setResponseStatus(event, 400);
			return { error: "Valid email is required" };
		}
		if (!password || typeof password !== "string" || password.length < 8) {
			setResponseStatus(event, 400);
			return { error: "Password must be at least 8 characters" };
		}
		try {
			await (await getBetterAuth()).api.signUpEmail({ body: {
				email,
				password,
				name: email.split("@")[0]
			} });
			return { ok: true };
		} catch (e) {
			if (!isExpectedAuthFailure(e)) captureAuthError(e, {
				route: "signup",
				email
			});
			setResponseStatus(event, 409);
			return { error: e?.message || "Registration failed" };
		}
	}));
	app.use("/_agent-native/auth/logout", defineEventHandler(async (event) => {
		const cookie = getCookie(event, COOKIE_NAME);
		if (cookie) await removeSession(cookie);
		const bearerToken = getBearerSessionToken(event);
		if (bearerToken) await removeSession(bearerToken);
		deleteCookie(event, COOKIE_NAME, {
			path: "/",
			...cookieDomainAttrs()
		});
		try {
			await (await getBetterAuth()).api.signOut({ headers: event.headers });
		} catch {}
		if (isElectron(event)) await clearDesktopSso();
		return { ok: true };
	}));
	app.use("/_agent-native/auth/session", defineEventHandler(async (event) => {
		if (!isReadMethod(event)) {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		return await getSession(event) ?? { error: "Not authenticated" };
	}));
}
/**
* Automatically configure auth based on environment and configuration:
*
* - **BYOA (custom getSession)**: Template-provided auth callback handles everything.
* - **ACCESS_TOKEN/ACCESS_TOKENS**: Simple token-based auth.
* - **Default**: Better Auth with email/password, social providers, organizations, and JWT.
*   Users see an onboarding page to create an account on first visit.
*
* Local development uses the same Better Auth flow as production. Email
* verification is automatically skipped in dev/test environments and when
* no email provider is configured (see `shouldSkipEmailVerification`), so a
* fresh local clone only needs an email + password to get started.
*
* Returns true if auth was mounted, false if skipped.
*/
async function autoMountAuth(app, options = {}) {
	if (_authGuardFn && _mountedApp === app) {
		if (options.mountGoogleOAuthRoutes === false) setGenericGoogleOAuthRoutesEnabled(app, false);
		if (options.getSession) customGetSession = options.getSession;
		if (_authGuardConfig) {
			if (options.googleOnly || options.loginHtml || options.marketing || options.googleSignInNotice) _authGuardConfig.loginHtml = options.loginHtml ?? getOnboardingHtml({
				googleOnly: options.googleOnly,
				marketing: options.marketing,
				googleSignInNotice: options.googleSignInNotice,
				googleAuthMode: options.googleAuthMode
			});
			if (options.publicPaths) _authGuardConfig.publicPaths = [..._authGuardConfig.publicPaths ?? [], ...options.publicPaths];
		}
		return true;
	}
	_authGuardFn = null;
	_authGuardConfig = null;
	_mountedApp = app;
	if (!app) {
		if (isDevEnvironment()) {
			customGetSession = null;
			return false;
		}
		throw new Error("autoMountAuth: H3 app is required. In Nitro plugins, pass nitroApp.h3App.");
	}
	customGetSession = null;
	sessionMaxAge = options.maxAge ?? DEFAULT_MAX_AGE;
	const publicPaths = options.publicPaths ?? [];
	mountAuthCorsMiddleware(app);
	if (options.getSession) customGetSession = options.getSession;
	if (customGetSession) {
		app.use("/_agent-native/auth/session", defineEventHandler(async (event) => {
			if (!isReadMethod(event)) {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return await getSession(event) ?? { error: "Not authenticated" };
		}));
		app.use("/_agent-native/auth/login", defineEventHandler(() => ({ ok: true })));
		app.use("/_agent-native/auth/logout", defineEventHandler(async (event) => {
			const cookie = getCookie(event, COOKIE_NAME);
			if (cookie) await removeSession(cookie);
			const bearerToken = getBearerSessionToken(event);
			if (bearerToken) await removeSession(bearerToken);
			deleteCookie(event, COOKIE_NAME, {
				path: "/",
				...cookieDomainAttrs()
			});
			if (isElectron(event)) await clearDesktopSso();
			return { ok: true };
		}));
		_authGuardConfig = {
			loginHtml: options.loginHtml ?? getTokenLoginHtml(),
			...options.loginHtml ? {} : { getLoginHtml: (_event, rawPath) => getTokenLoginHtml({ requestPath: rawPath }) },
			publicPaths
		};
		const guardFn = createAuthGuardFn();
		_authGuardFn = guardFn;
		app.use(defineEventHandler(guardFn));
		if (process.env.DEBUG) console.log("[agent-native] Auth enabled — custom getSession provider.");
		return true;
	}
	const tokens = getAccessTokens();
	if (tokens.length > 0) {
		mountTokenOnlyRoutes(app, tokens, publicPaths);
		if (process.env.DEBUG) console.log(`[agent-native] Auth enabled — ${tokens.length} access token(s) configured.`);
		return true;
	}
	try {
		await mountBetterAuthRoutes(app, options);
		if (process.env.DEBUG) console.log("[agent-native] Auth enabled — Better Auth (accounts + organizations).");
	} catch (err) {
		console.error("[agent-native] Failed to initialize Better Auth:", err);
		mountAuthFallbackRoutes(app);
		_authGuardConfig = {
			loginHtml: options.loginHtml ?? getOnboardingHtml({
				googleOnly: options.googleOnly,
				marketing: options.marketing,
				googleSignInNotice: options.googleSignInNotice,
				googleAuthMode: options.googleAuthMode
			}),
			publicPaths
		};
		const guardFn = createAuthGuardFn();
		_authGuardFn = guardFn;
		app.use(defineEventHandler(guardFn));
		console.log("[agent-native] Auth guard registered despite init failure — app is locked.");
	}
	return true;
}
//#endregion
export { track as C, readCorsAllowedOrigins as E, registerTrackingProvider as S, getAllowedCorsOrigin as T, isMobile as _, isDevEnvironment as a, resolveOAuthRedirectUri as b, getWorkspaceAppIdValidationError as c, encodeOAuthState as d, getAppBasePath as f, isElectron as g, isAllowedOAuthRedirectUri as h, getSessionEmail as i, createOAuthSession as l, getOrigin as m, autoMountAuth as n, removeSession as o, getAppUrl as p, getSession as r, safeReturnPath as s, addSession as t, decodeOAuthState as u, oauthCallbackResponse as v, renderInviteEmail as w, getAuthSecret as x, oauthErrorPage as y };
