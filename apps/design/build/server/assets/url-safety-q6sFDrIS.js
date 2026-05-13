//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/proxy-security.js
var HEADER_NAME_RE = /^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/;
var BLOCKED_OUTBOUND_HEADERS = new Set([
	"connection",
	"content-length",
	"cookie",
	"forwarded",
	"host",
	"keep-alive",
	"origin",
	"proxy-authenticate",
	"proxy-authorization",
	"referer",
	"set-cookie",
	"te",
	"trailer",
	"transfer-encoding",
	"upgrade",
	"x-forwarded-for",
	"x-forwarded-host",
	"x-forwarded-proto"
]);
var MAX_EXTENSION_PROXY_RESPONSE_SIZE = 1024 * 1024;
var ALLOWED_METHODS = new Set([
	"GET",
	"POST",
	"PUT",
	"PATCH",
	"DELETE",
	"HEAD"
]);
function normalizeExtensionProxyMethod(value) {
	const method = String(value || "GET").toUpperCase();
	return ALLOWED_METHODS.has(method) ? method : null;
}
function sanitizeOutboundHeaders(value) {
	if (!value || typeof value !== "object" || Array.isArray(value)) return {};
	const headers = {};
	for (const [name, rawValue] of Object.entries(value)) {
		const lower = name.toLowerCase();
		if (!HEADER_NAME_RE.test(name) || BLOCKED_OUTBOUND_HEADERS.has(lower)) continue;
		if (rawValue === void 0 || rawValue === null) continue;
		const headerValue = String(rawValue);
		if (/[\r\n]/.test(headerValue)) continue;
		headers[name] = headerValue;
	}
	return headers;
}
function collectSecretValues(...groups) {
	const values = /* @__PURE__ */ new Set();
	for (const group of groups) for (const value of group ?? []) if (value) values.add(value);
	return [...values].sort((a, b) => b.length - a.length);
}
function redactSecrets(value, secretValues) {
	if (secretValues.length === 0) return value;
	if (typeof value === "string") return redactString(value, secretValues);
	if (Array.isArray(value)) return value.map((item) => redactSecrets(item, secretValues));
	if (value && typeof value === "object") return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, redactSecrets(entry, secretValues)]));
	return value;
}
function redactString(text, secretValues) {
	let out = text;
	for (const secret of secretValues) for (const candidate of redactionCandidates(secret)) if (candidate) out = out.split(candidate).join("[redacted]");
	return out;
}
function redactionCandidates(secret) {
	const candidates = new Set([secret]);
	try {
		candidates.add(encodeURIComponent(secret));
	} catch {}
	try {
		candidates.add(encodeURI(secret));
	} catch {}
	return [...candidates].sort((a, b) => b.length - a.length);
}
async function readResponseTextWithLimit(response, maxBytes = MAX_EXTENSION_PROXY_RESPONSE_SIZE) {
	const contentLength = response.headers.get("content-length");
	if (contentLength && Number(contentLength) > maxBytes) return {
		text: `(response too large - ${contentLength} bytes, max ${maxBytes})`,
		truncated: true,
		size: Number(contentLength)
	};
	const reader = response.body?.getReader?.();
	if (!reader) {
		const buffer = await response.arrayBuffer();
		if (buffer.byteLength > maxBytes) return {
			text: `(response truncated - ${buffer.byteLength} bytes, max ${maxBytes})`,
			truncated: true,
			size: buffer.byteLength
		};
		return {
			text: new TextDecoder().decode(buffer),
			truncated: false,
			size: buffer.byteLength
		};
	}
	const chunks = [];
	let total = 0;
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		if (!value) continue;
		total += value.byteLength;
		if (total > maxBytes) {
			await reader.cancel().catch(() => {});
			return {
				text: `(response truncated - ${total} bytes, max ${maxBytes})`,
				truncated: true,
				size: total
			};
		}
		chunks.push(value);
	}
	const buffer = new Uint8Array(total);
	let offset = 0;
	for (const chunk of chunks) {
		buffer.set(chunk, offset);
		offset += chunk.byteLength;
	}
	return {
		text: new TextDecoder().decode(buffer),
		truncated: false,
		size: total
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/url-safety.js
var METADATA_HOSTS = ["metadata.google.internal", "metadata.google.internal."];
var DNS_REBIND_SUFFIXES = [
	".nip.io",
	".sslip.io",
	".xip.io",
	".localtest.me",
	".lvh.me"
];
function isPrivateIpv4(a, b, c = 0, d = 0) {
	if (![
		a,
		b,
		c,
		d
	].every((part) => part >= 0 && part <= 255)) return true;
	if (a === 127) return true;
	if (a === 10) return true;
	if (a === 172 && b >= 16 && b <= 31) return true;
	if (a === 192 && b === 168) return true;
	if (a === 169 && b === 254) return true;
	if (a === 0) return true;
	if (a === 100 && b >= 64 && b <= 127) return true;
	if (a === 192 && b === 0) return true;
	if (a === 198 && (b === 18 || b === 19)) return true;
	if (a === 192 && b === 0 && c === 2) return true;
	if (a === 198 && b === 51 && c === 100) return true;
	if (a === 203 && b === 0 && c === 113) return true;
	if (a >= 224) return true;
	return false;
}
function isPrivateIpv4MappedHex(host) {
	const mapped = host.match(/^::ffff:([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i);
	if (!mapped) return false;
	const high = Number.parseInt(mapped[1], 16);
	const low = Number.parseInt(mapped[2], 16);
	if (high < 0 || high > 65535 || low < 0 || low > 65535) return false;
	return isPrivateIpv4(high >> 8 & 255, high & 255, low >> 8 & 255, low & 255);
}
function isPrivateHost(hostname) {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
	if (host === "localhost" || host === "::1" || host === "::0" || host === "::") return true;
	if (METADATA_HOSTS.includes(host)) return true;
	if (/^f[cd]/.test(host) || /^fe[89ab]/.test(host)) return true;
	if (/^ff/i.test(host)) return true;
	const v4mappedDotted = host.match(/^::ffff:(\d+\.\d+\.\d+\.\d+)$/);
	if (v4mappedDotted) {
		const [a, b, c, d] = v4mappedDotted[1].split(".").map(Number);
		if (isPrivateIpv4(a, b, c, d)) return true;
	}
	if (isPrivateIpv4MappedHex(host)) return true;
	const parts = host.split(".");
	if (parts.length === 4 && parts.every((p) => /^\d+$/.test(p))) {
		const [a, b, c, d] = parts.map(Number);
		if (isPrivateIpv4(a, b, c, d)) return true;
	}
	if (/^\d+$/.test(host)) {
		const num = Number(host);
		if (num >= 0 && num <= 4294967295) {
			if (isPrivateIpv4(num >>> 24 & 255, num >>> 16 & 255, num >>> 8 & 255, num & 255)) return true;
		}
	}
	return false;
}
function isBlockedExtensionUrl(url) {
	try {
		const parsed = new URL(url);
		if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return true;
		const host = parsed.hostname.toLowerCase();
		if (isPrivateHost(host)) return true;
		if (DNS_REBIND_SUFFIXES.some((suffix) => {
			return host === suffix.slice(1) || host.endsWith(suffix);
		})) return true;
	} catch {
		return true;
	}
	return false;
}
function isIpLiteralHost(hostname) {
	const host = hostname.toLowerCase().replace(/^\[|\]$/g, "");
	if (host.includes(":")) return true;
	const parts = host.split(".");
	return parts.length === 4 && parts.every((p) => /^\d+$/.test(p));
}
/**
* Async SSRF guard for environments that can resolve DNS. The synchronous
* guard catches literals and known rebinding domains; this closes the common
* "public hostname resolves to a private address" gap before dispatch.
*/
async function isBlockedExtensionUrlWithDns(url) {
	if (isBlockedExtensionUrl(url)) return true;
	let hostname;
	try {
		hostname = new URL(url).hostname.toLowerCase();
	} catch {
		return true;
	}
	if (!hostname || isIpLiteralHost(hostname)) return false;
	try {
		const { lookup } = await import("node:dns/promises");
		return (await lookup(hostname, {
			all: true,
			verbatim: true
		})).some((record) => isPrivateHost(record.address));
	} catch {
		return false;
	}
}
/**
* Build an undici Dispatcher whose connect-time DNS lookup runs through a
* private-IP guard. This closes the TOCTOU gap where:
*   1. We resolve hostname → public IP and pass.
*   2. Between that lookup and the actual connect, DNS rebinding flips the
*      record to a private IP.
*   3. fetch() resolves again and connects to the private IP.
*
* With a custom dispatcher, the same lookup that produces the IP also gates
* the connect: if the IP is in the private set, the connect throws.
*
* Returns `null` if undici / node:dns are not available (e.g. some edge
* runtimes); the caller should fall back to the regular `fetch` path —
* `isBlockedExtensionUrlWithDns` will still have caught most rebinding cases.
*/
async function createSsrfSafeDispatcher() {
	let undici;
	let dnsModule;
	try {
		undici = await import("undici");
		dnsModule = await import("node:dns");
	} catch {
		return null;
	}
	const { Agent } = undici;
	const { lookup } = dnsModule;
	if (!Agent || !lookup) return null;
	return new Agent({ connect: { lookup: (hostname, options, callback) => {
		lookup(hostname, {
			all: true,
			verbatim: true
		}, (err, addresses) => {
			if (err) return callback(err);
			const list = Array.isArray(addresses) ? addresses : [{
				address: addresses,
				family: 4
			}];
			for (const record of list) if (isPrivateHost(record.address)) {
				const e = /* @__PURE__ */ new Error(`Connect blocked: ${hostname} resolved to private address ${record.address}`);
				e.code = "EAI_BLOCKED";
				return callback(e);
			}
			if (options && options.all) return callback(null, list);
			const first = list[0];
			return callback(null, first.address, first.family);
		});
	} } });
}
//#endregion
export { normalizeExtensionProxyMethod as a, redactString as c, collectSecretValues as i, sanitizeOutboundHeaders as l, isBlockedExtensionUrlWithDns as n, readResponseTextWithLimit as o, MAX_EXTENSION_PROXY_RESPONSE_SIZE as r, redactSecrets as s, createSsrfSafeDispatcher as t };
