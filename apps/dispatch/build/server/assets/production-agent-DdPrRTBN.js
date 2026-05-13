import { b as setResponseStatus, c as getMethod, i as defineEventHandler, y as setResponseHeader } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-CmxO0LxM.js";
import { n as getUserSetting, r as putUserSetting, t as deleteUserSetting } from "./user-settings-DJMyxAPN.js";
import { a as getRequestRunContext, i as getRequestOrgId, o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { a as isDeployCredentialFallbackAllowed, o as readDeployCredentialEnv } from "./credential-provider-F0RQZ9bx.js";
import { d as EngineError, l as startRun, o as getActiveRunForThreadAsync, u as subscribeToRun } from "./run-manager-AJUEq7Np.js";
import { i as getStoredModelForEngine, l as resolveEngine } from "./registry-DlSn3U6q.js";
import { t as registerBuiltinEngines } from "./builtin-CZUg4_3B.js";
import { c as normalizeReasoningEffortForModel, s as isReasoningEffort } from "./model-config-DXbH96gG.js";
import { i as PROVIDER_TO_ENV } from "./provider-env-vars-CWagFwVS.js";
import { a as userFacingLlmCredentialError } from "./credential-errors-CadDFEFG.js";
import "./engine-DAHmAbqJ.js";
import { n as readAppState } from "./script-helpers-yPv9toTc.js";
import { n as getOrgSetting, r as putOrgSetting, t as deleteOrgSetting } from "./settings-GlD3rlOS.js";
import { a as readAppSecret, s as writeAppSecret, t as deleteAppSecret } from "./storage-DLlUi77Z.js";
import { i as readAgentLoopSettings, n as getDefaultMaxIterations, r as normalizeMaxIterations } from "./loop-settings-DPFSndVN.js";
import { n as isAgentActionStopError } from "./action-Bo4eZeRf.js";
import { createHash } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/mcp-client/remote-store.js
/**
* Persistent store for user-added remote MCP servers.
*
* Servers added through the settings UI live in the framework's `settings`
* table, keyed by scope:
*   - User scope: `u:<email>:mcp-servers-remote`
*   - Org scope:  `o:<orgId>:mcp-servers-remote`
*
* Both scopes store the same shape — a list of `StoredRemoteMcpServer`
* records. The running MCP manager merges this list with the file-based
* `mcp.config.json` on startup and after every mutation.
*
* SECURITY: HTTP MCP servers commonly require a bearer token in the
* `Authorization` header. Those values are written to the encrypted
* `app_secrets` table (AES-256-GCM via writeAppSecret). The settings row
* stores only the secret-key reference (`headerSecretKey`), not the raw
* value. Callers retrieving headers must call `materializeHeaders` to
* fetch the cleartext at request time. Legacy rows that wrote headers
* cleartext into `headers` continue to work read-only — they should be
* re-saved to migrate.
*/
var SETTINGS_KEY = "mcp-servers-remote";
function toSecretScope(scope) {
	return scope === "user" ? "user" : "workspace";
}
/**
* Header names that are routed through the encrypted-at-rest secrets store
* instead of being written to the plaintext `settings` row. Match is
* case-insensitive and substring-based to catch one-off names like
* `x-zapier-api-key`.
*/
var SECRET_HEADER_NAME_PATTERNS = [
	/authorization/i,
	/api[-_]?key/i,
	/token/i,
	/secret/i,
	/bearer/i,
	/x-.*-key/i
];
function isSecretHeaderName(name) {
	return SECRET_HEADER_NAME_PATTERNS.some((re) => re.test(name));
}
/** Split a headers map into (cleartext, secret) buckets. */
function partitionHeaders(headers) {
	if (!headers) return {
		cleartext: void 0,
		secret: void 0
	};
	const cleartext = {};
	const secret = {};
	for (const [k, v] of Object.entries(headers)) {
		if (typeof v !== "string") continue;
		if (isSecretHeaderName(k)) secret[k] = v;
		else cleartext[k] = v;
	}
	return {
		cleartext: Object.keys(cleartext).length > 0 ? cleartext : void 0,
		secret: Object.keys(secret).length > 0 ? secret : void 0
	};
}
/** Tiny nanoid — matches the inline helper used elsewhere in this package. */
function shortId() {
	return (globalThis.crypto?.randomUUID?.().replace(/-/g, "") ?? Math.random().toString(36).slice(2) + Date.now().toString(36)).slice(0, 16);
}
/**
* Validate a candidate MCP server name — used as a key in the merged config
* and as part of the prefixed tool name (`mcp__<merged-key>__<tool>`).
*
* Allowed: letters, digits, hyphen; 1–40 chars. Lowercased. Underscores are
* excluded on purpose — the merged-key format uses `_` as a separator between
* `<scope>`, `<owner>`, and `<name>`, so allowing `_` in names would make the
* parse ambiguous.
*/
function normalizeServerName(input) {
	return input.trim().toLowerCase().replace(/[^a-z0-9-]/g, "-").slice(0, 40);
}
/**
* Short, deterministic, URL-safe hash of an email. Used as the owner
* discriminator in user-scope merged keys so two users with the same server
* name don't collide in the global MCP manager.
*/
function hashEmail(email) {
	return createHash("sha256").update(email.toLowerCase().trim()).digest("hex").slice(0, 10);
}
/**
* Sanitise an org id to the character set allowed in merged keys.
* Org ids are already nanoid-style alphanumeric, but we normalise defensively.
*/
function sanitiseOrgId(orgId) {
	return orgId.toLowerCase().replace(/[^a-z0-9-]/g, "-");
}
/**
* Hostname patterns that are always rejected to prevent SSRF via DNS rebinding
* or well-known internal service names.
*/
var BLOCKED_HOSTNAME_PATTERNS = [
	/^localhost$/i,
	/\.localhost$/i,
	/\.local$/i,
	/\.internal$/i,
	/\.nip\.io$/i,
	/\.sslip\.io$/i,
	/\.xip\.io$/i,
	/\.localtest\.me$/i,
	/\.lvh\.me$/i,
	/^metadata\.google\.internal$/i,
	/^instance-data$/i
];
/** Literal IPs that are always rejected (cloud metadata endpoints). */
var BLOCKED_IPS = new Set([
	"169.254.169.254",
	"100.100.100.200",
	"::1"
]);
/** Parse a dotted-decimal IPv4 string to a 32-bit integer for range checks. */
function ipv4ToInt(ip) {
	const parts = ip.split(".");
	if (parts.length !== 4) return null;
	let n = 0;
	for (const part of parts) {
		const byte = parseInt(part, 10);
		if (isNaN(byte) || byte < 0 || byte > 255) return null;
		n = n << 8 | byte;
	}
	return n >>> 0;
}
function isPrivateIpv4(hostname) {
	const n = ipv4ToInt(hostname);
	if (n === null) return false;
	if ((n & 4278190080) >>> 0 === 167772160) return true;
	if ((n & 4293918720) >>> 0 === 2886729728) return true;
	if ((n & 4294901760) >>> 0 === 3232235520) return true;
	if ((n & 4294901760) >>> 0 === 2851995648) return true;
	if ((n & 4278190080) >>> 0 === 2130706432) return true;
	return false;
}
function isBlockedHostname(hostname) {
	const normalized = hostname.toLowerCase().replace(/^\[|\]$/g, "");
	if (BLOCKED_IPS.has(normalized)) return true;
	if (isPrivateIpv4(normalized)) return true;
	if (normalized === "::1") return true;
	if (normalized.startsWith("fc") || normalized.startsWith("fd")) return true;
	if (normalized.startsWith("fe80")) return true;
	if (normalized.startsWith("::ffff:")) {
		const mapped = normalized.slice(7);
		if (isPrivateIpv4(mapped)) return true;
		const hexMatch = /^([0-9a-f]{1,4}):([0-9a-f]{1,4})$/i.exec(mapped);
		if (hexMatch) {
			const value = parseInt(hexMatch[1], 16) << 16 | parseInt(hexMatch[2], 16);
			if (isPrivateIpv4([
				value >>> 24 & 255,
				value >>> 16 & 255,
				value >>> 8 & 255,
				value & 255
			].join("."))) return true;
		}
	}
	for (const pattern of BLOCKED_HOSTNAME_PATTERNS) if (pattern.test(normalized)) return true;
	return false;
}
/** Reject obviously-wrong URLs. Allows http only for localhost. */
function validateRemoteUrl(raw) {
	let url;
	try {
		url = new URL(raw);
	} catch {
		return {
			ok: false,
			error: "Not a valid URL"
		};
	}
	if (url.protocol === "https:") {
		if (isBlockedHostname(url.hostname)) return {
			ok: false,
			error: `Host "${url.hostname}" is not allowed (private/internal address)`
		};
		return {
			ok: true,
			url
		};
	}
	if (url.protocol === "http:") {
		const host = url.hostname;
		if (host === "localhost" || host === "127.0.0.1") return {
			ok: true,
			url
		};
		return {
			ok: false,
			error: "Plain http is only allowed for localhost"
		};
	}
	return {
		ok: false,
		error: `Unsupported protocol: ${url.protocol}`
	};
}
async function readList(scope, scopeId) {
	const raw = scope === "user" ? await getUserSetting(scopeId, SETTINGS_KEY) : await getOrgSetting(scopeId, SETTINGS_KEY);
	if (!raw || !Array.isArray(raw.servers)) return [];
	return raw.servers.filter((s) => s && typeof s.id === "string" && typeof s.url === "string");
}
async function writeList(scope, scopeId, servers) {
	if (scope === "user") await putUserSetting(scopeId, SETTINGS_KEY, { servers });
	else await putOrgSetting(scopeId, SETTINGS_KEY, { servers });
}
async function listRemoteServers(scope, scopeId) {
	return readList(scope, scopeId);
}
async function addRemoteServer(scope, scopeId, input) {
	const name = normalizeServerName(input.name);
	if (!name) return {
		ok: false,
		error: "Name is required"
	};
	const urlCheck = validateRemoteUrl(input.url);
	if (!urlCheck.ok) return {
		ok: false,
		error: urlCheck.error ?? "Bad URL"
	};
	const existing = await readList(scope, scopeId);
	if (existing.some((s) => s.name === name)) return {
		ok: false,
		error: `A server named "${name}" already exists`
	};
	const id = `mcps_${shortId()}`;
	const { cleartext, secret } = partitionHeaders(input.headers);
	let headerSecretKey;
	if (secret) {
		headerSecretKey = `mcp_headers:${id}`;
		try {
			await writeAppSecret({
				key: headerSecretKey,
				value: JSON.stringify(secret),
				scope: toSecretScope(scope),
				scopeId,
				description: `Encrypted MCP headers for ${name}`
			});
		} catch (err) {
			return {
				ok: false,
				error: `Failed to encrypt MCP headers: ${err?.message ?? err}`
			};
		}
	}
	const server = {
		id,
		name,
		url: urlCheck.url.toString(),
		headers: cleartext,
		headerSecretKey,
		description: input.description?.trim() || void 0,
		createdAt: Date.now()
	};
	await writeList(scope, scopeId, [...existing, server]);
	return {
		ok: true,
		server
	};
}
async function removeRemoteServer(scope, scopeId, id) {
	const existing = await readList(scope, scopeId);
	const removed = existing.find((s) => s.id === id);
	const next = existing.filter((s) => s.id !== id);
	if (next.length === existing.length) return false;
	if (next.length === 0) if (scope === "user") await deleteUserSetting(scopeId, SETTINGS_KEY);
	else await deleteOrgSetting(scopeId, SETTINGS_KEY);
	else await writeList(scope, scopeId, next);
	if (removed?.headerSecretKey) try {
		await deleteAppSecret({
			key: removed.headerSecretKey,
			scope: toSecretScope(scope),
			scopeId
		});
	} catch (err) {
		console.warn(`[mcp-client] Failed to delete MCP header secret ${removed.headerSecretKey}: ${err?.message ?? err}`);
	}
	return true;
}
/**
* Resolve the full headers map (cleartext + decrypted secret headers) for a
* stored MCP server. Used when projecting the stored record into the
* runtime `McpHttpServerConfig` shape that `McpClientManager` consumes.
*
* For legacy rows that wrote secrets cleartext into `headers`, this
* returns those cleartext values unchanged — they should be re-saved
* through `addRemoteServer` to migrate to encrypted storage.
*/
async function materializeHeaders(scope, scopeId, stored) {
	const merged = { ...stored.headers ?? {} };
	if (stored.headerSecretKey) try {
		const secret = await readAppSecret({
			key: stored.headerSecretKey,
			scope: toSecretScope(scope),
			scopeId
		});
		if (secret) {
			const parsed = JSON.parse(secret.value);
			for (const [k, v] of Object.entries(parsed)) if (typeof v === "string") merged[k] = v;
		}
	} catch (err) {
		console.warn(`[mcp-client] Failed to decrypt MCP headers for ${stored.name}: ${err?.message ?? err}`);
	}
	return Object.keys(merged).length > 0 ? merged : void 0;
}
/**
* Async variant of `toHttpServerConfig` that resolves any encrypted
* `headerSecretKey` reference from `app_secrets` and returns the full
* cleartext headers map for use at runtime. Use this when actually
* configuring an MCP client; use the sync variant only when serializing
* stored data (e.g. for read-only listings that shouldn't disclose
* secrets).
*/
async function toHttpServerConfigAsync(scope, scopeId, stored) {
	return {
		type: "http",
		url: stored.url,
		headers: await materializeHeaders(scope, scopeId, stored),
		description: stored.description
	};
}
/**
* Build the merged-config key for a stored server.
*
* The key encodes the owning scope + owner identity so two users adding a
* server called `zapier` produce distinct ids (`user_ab12cd34ef_zapier` vs
* `user_99aa88bb77_zapier`) and Alice's tool calls never route through Bob's
* credentials in a shared-process deployment.
*
* - User scope: `user_<emailhash>_<name>`
* - Org scope:  `org_<orgId>_<name>`
*
* `ownerId` is the raw email for user scope, and the org id for org scope.
*/
function mergedConfigKey(scope, stored, ownerId) {
	return `${scope}_${scope === "user" ? hashEmail(ownerId) : sanitiseOrgId(ownerId)}_${stored.name}`;
}
/**
* Parse a merged key (or a full prefixed tool name like
* `mcp__user_abcd1234ef_zapier__run-task`) back into its scope + owner + name
* components. Returns null for non-merged keys (e.g. stdio file-config servers
* like `claude-in-chrome`) so callers can treat them as always-visible.
*
* `hub_<orgId>_<name>` entries (pulled from a remote hub via
* `hub-client.ts`) project to `scope: "org"` so they pass through the same
* per-request visibility gate as locally-stored org servers — the tool is
* only visible to requests whose active org matches the hub entry's org.
*/
function parseMergedKey(keyOrToolName) {
	let key = keyOrToolName;
	if (key.startsWith("mcp__")) {
		const rest = key.slice(5);
		const idx = rest.indexOf("__");
		key = idx >= 0 ? rest.slice(0, idx) : rest;
	}
	const m = /^(user|org|hub)_([^_]+)_(.+)$/.exec(key);
	if (!m) return null;
	return {
		scope: m[1] === "user" ? "user" : "org",
		owner: m[2],
		name: m[3]
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/mcp-client/visibility.js
/**
* Per-request visibility gate for MCP tools.
*
* In a shared-process deployment (one Nitro server handling multiple users)
* every user's personal MCP servers are registered in the same manager. We
* want the LLM and the tool-call path to behave as if each user only has
* their own — no cross-user credential use, no tools from other orgs.
*
* Separated from `./index.ts` (which imports `ActionEntry` from
* `production-agent.js`) so `production-agent.js` can pull in this filter
* without a circular import.
*/
/**
* Guard MCP tools against cross-user access in shared-process deployments.
*
* - Tools with no merged-key prefix (e.g. `mcp__claude-in-chrome__navigate`
*   from a file-based stdio config) are visible to everyone — those are
*   process-wide by design.
* - User-scope tools are only visible to the user whose email hashes to the
*   tool's owner component.
* - Org-scope tools are only visible to requests whose active org matches.
*
* SECURITY: when there is no request context (CLI scripts, MCP server
* endpoint without `runWithRequestContext`, etc.) we DENY by default in
* production — the runtime gate elsewhere is not a safe substitute when
* the gate runs without a context either. In development we still allow
* for ergonomics (tool enumeration at startup, ad-hoc CLI runs).
*
* See finding #5 in /tmp/security-audit/12-mcp-a2a-agent.md.
*/
function isMcpToolAllowedForRequest(toolName) {
	const parsed = parseMergedKey(toolName);
	if (!parsed) return true;
	const email = getRequestUserEmail();
	const orgId = getRequestOrgId();
	const inProduction = process.env.NODE_ENV === "production";
	if (parsed.scope === "user") {
		if (!email) return !inProduction;
		return hashEmail(email) === parsed.owner;
	}
	if (!orgId) return !inProduction;
	return orgId.toLowerCase().replace(/[^a-z0-9-]/g, "-") === parsed.owner;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/mcp-client/errors.js
function stringifyError(error) {
	if (typeof error === "string") return error;
	if (error instanceof Error) return error.message;
	if (error && typeof error === "object") {
		const record = error;
		const message = record.message;
		if (typeof message === "string" && message.trim()) return message;
		const type = record.type;
		if (typeof type === "string" && type.trim()) return type;
	}
	return String(error ?? "");
}
function formatMcpConnectError(error) {
	const text = stringifyError(error).trim();
	if (!text) return "Could not connect to that MCP server.";
	if (/<!doctype|<html[\s>]|<\/html>|unexpected token '<'|is not valid json/i.test(text)) return "That URL returned a web page instead of an MCP response. Check that you pasted the Streamable HTTP endpoint, often ending in /mcp.";
	if (/invalid_union|unrecognized_keys|invalid_type|invalid_value/i.test(text) && /jsonrpc|method|unrecognized keys|args|origin|url/i.test(text)) return "That URL returned JSON, but not an MCP JSON-RPC response. Check that you pasted the Streamable HTTP endpoint, often ending in /mcp.";
	if (/streamable http/i.test(text) && /error|failed|non-200|status/i.test(text)) return "The server did not complete the Streamable HTTP MCP handshake. Check the URL and any required authorization headers.";
	if (/failed to fetch|fetch failed|networkerror|econnrefused|enotfound|timed out/i.test(text)) return "Could not reach that MCP server. Check the URL and make sure it is publicly reachable from this app.";
	if (/401|403|unauthorized|forbidden/i.test(text)) return "The MCP server rejected the request. Add or update the required Authorization header.";
	if (/404|not found|405|method not allowed/i.test(text)) return "That URL is reachable, but it does not look like the MCP endpoint. Check the server's Streamable HTTP path.";
	if (text === "[object ErrorEvent]" || text === "error") return "The MCP server connection failed while opening its event stream. Check the URL and any required authorization headers.";
	return text.length > 240 ? `${text.slice(0, 237).trimEnd()}...` : text;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/mcp-client/manager.js
/**
* McpClientManager — connects to configured MCP servers (stdio or remote
* Streamable HTTP), enumerates their tools, and exposes a flat tool registry
* prefixed with `mcp__<server-id>__` so the agent's tool-use loop can call them.
*
* Stdio servers are a strict no-op in non-Node runtimes (Cloudflare Workers,
* browsers). HTTP servers work in any runtime with `fetch`; `reconfigure()`
* lets callers add or remove servers at runtime without restarting the process.
*/
var MCP_TOOL_PREFIX = "mcp__";
function isNode() {
	return typeof process !== "undefined" && !!process.versions?.node && typeof process.versions.node === "string";
}
function buildPrefixedName(serverId, toolName) {
	return `${MCP_TOOL_PREFIX}${serverId}__${toolName}`;
}
/**
* Parse a prefixed tool name back into its server id and original tool name.
* Returns `null` if the name doesn't match the MCP prefix convention.
*/
function parseMcpToolName(prefixedName) {
	if (!prefixedName.startsWith("mcp__")) return null;
	const rest = prefixedName.slice(5);
	const idx = rest.indexOf("__");
	if (idx < 0) return null;
	return {
		serverId: rest.slice(0, idx),
		toolName: rest.slice(idx + 2)
	};
}
function sameServerConfig(a, b) {
	const typeA = a.type ?? "stdio";
	if (typeA !== (b.type ?? "stdio")) return false;
	if (typeA === "http" && b.type === "http" && a.type === "http") return a.url === b.url && JSON.stringify(a.headers ?? {}) === JSON.stringify(b.headers ?? {});
	if (a.type !== "http" && b.type !== "http") return a.command === b.command && JSON.stringify(a.args ?? []) === JSON.stringify(b.args ?? []) && JSON.stringify(a.env ?? {}) === JSON.stringify(b.env ?? {}) && (a.cwd ?? "") === (b.cwd ?? "");
	return false;
}
async function safelyClose(value, recordError) {
	try {
		if (value?.close) await value.close();
	} catch (err) {
		recordError?.(err);
	}
}
function guardClose(value, recordError) {
	if (!value || typeof value.close !== "function") return void 0;
	const originalClose = value.close.bind(value);
	value.close = async (...args) => {
		try {
			return await originalClose(...args);
		} catch (err) {
			recordError(err);
			return;
		}
	};
	return () => {
		value.close = originalClose;
	};
}
var McpClientManager = class {
	servers = /* @__PURE__ */ new Map();
	debug;
	started = false;
	config;
	sdk = null;
	listeners = /* @__PURE__ */ new Set();
	/** Serialises reconfigure()/start() — two concurrent callers would
	* otherwise race on `this.config` and on connect/disconnect ordering. */
	reconfigureQueue = Promise.resolve();
	constructor(config, options = {}) {
		this.config = config;
		this.debug = !!options.debug;
	}
	/** True when the manager has any configured servers. */
	get enabled() {
		return !!this.config && Object.keys(this.config.servers).length > 0;
	}
	/** Return the current config (read-only snapshot for callers that need to
	*  merge new servers into the existing set before calling reconfigure). */
	getConfig() {
		return this.config;
	}
	/** List of configured server ids (whether or not they're connected). */
	get configuredServers() {
		if (!this.config) return [];
		return Object.keys(this.config.servers);
	}
	/** List of server ids that successfully connected and enumerated tools. */
	get connectedServers() {
		return Array.from(this.servers.values()).filter((s) => s.client && !s.error).map((s) => s.id);
	}
	/**
	* Load MCP SDK modules lazily so non-Node bundles don't pull them in.
	* Stdio transport is only loaded when a stdio server is actually configured.
	*/
	async loadSdk(needStdio) {
		if (this.sdk) {
			if (needStdio && !this.sdk.StdioClientTransport && isNode()) try {
				const stdioMod = await import("./stdio-DT8-aYVI.js");
				this.sdk.StdioClientTransport = stdioMod.StdioClientTransport;
			} catch (err) {
				console.warn(`[mcp-client] Failed to load stdio transport: ${err?.message ?? err}.`);
			}
			return this.sdk;
		}
		try {
			const clientMod = await import("./client--uEvi0nP.js");
			const httpMod = await import("./streamableHttp-CuMVS6Av.js");
			let StdioClientTransport = null;
			if (needStdio && isNode()) try {
				StdioClientTransport = (await import("./stdio-DT8-aYVI.js")).StdioClientTransport;
			} catch (err) {
				console.warn(`[mcp-client] Failed to load stdio transport: ${err?.message ?? err}.`);
			}
			this.sdk = {
				Client: clientMod.Client,
				StdioClientTransport,
				StreamableHTTPClientTransport: httpMod.StreamableHTTPClientTransport
			};
			return this.sdk;
		} catch (err) {
			console.warn(`[mcp-client] Failed to load MCP SDK: ${err?.message ?? err}. MCP tools disabled.`);
			return null;
		}
	}
	/**
	* Subscribe to tool-set changes (e.g. after `reconfigure()` adds/removes
	* servers). The listener is called *after* connect/disconnect completes.
	* Returns an unsubscribe function.
	*/
	onChange(listener) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
	emitChange() {
		for (const l of this.listeners) try {
			l();
		} catch (err) {
			console.warn(`[mcp-client] onChange listener threw: ${err?.message ?? err}`);
		}
	}
	/**
	* Connect to each configured MCP server (stdio or http) and enumerate tools.
	* Individual server failures are logged and skipped — the manager stays
	* usable with whichever servers did come up.
	*
	* Queued against `reconfigure()` so a `reconfigure` that lands before
	* `start()` finishes can't race on `this.started` / `this.servers`.
	*/
	async start() {
		const task = this.reconfigureQueue.then(() => this.startInternal());
		this.reconfigureQueue = task.catch(() => {});
		return task;
	}
	async startInternal() {
		if (this.started) return;
		this.started = true;
		if (!this.enabled) return;
		const needStdio = Object.values(this.config.servers).some((cfg) => (cfg.type ?? "stdio") === "stdio");
		const sdk = await this.loadSdk(needStdio);
		if (!sdk) return;
		const entries = Object.entries(this.config.servers);
		await Promise.all(entries.map(async ([id, cfg]) => this.addServer(id, cfg, sdk)));
		this.emitChange();
	}
	/**
	* Create a new ServerEntry and attempt to connect. Logs and records errors
	* on the entry rather than throwing — callers iterate many servers.
	*/
	async addServer(id, cfg, sdk) {
		if (this.servers.has(id)) console.warn(`[mcp-client] Duplicate server ID '${id}' — overwriting previous registration`);
		const entry = {
			id,
			config: cfg,
			client: null,
			transport: null,
			tools: []
		};
		this.servers.set(id, entry);
		try {
			await this.connectServer(entry, sdk);
			console.log(`[mcp-client] connected to ${id}: ${entry.tools.length} tools`);
		} catch (err) {
			entry.error = formatMcpConnectError(err);
			console.warn(`[mcp-client] failed to connect to ${id}: ${entry.error}`);
		}
	}
	async connectServer(entry, sdk) {
		const cfg = entry.config;
		const { Client } = sdk;
		let transport;
		if (cfg.type === "http") {
			if (!sdk.StreamableHTTPClientTransport) throw new Error("HTTP transport not available");
			const requestInit = {};
			if (cfg.headers && Object.keys(cfg.headers).length > 0) requestInit.headers = cfg.headers;
			transport = new sdk.StreamableHTTPClientTransport(new URL(cfg.url), { requestInit });
		} else {
			if (!sdk.StdioClientTransport) throw new Error("Stdio transport not available (needs Node runtime with MCP SDK)");
			const { command, args = [], env, cwd } = cfg;
			const ENV_ALLOWLIST = [
				"PATH",
				"HOME",
				"TMPDIR",
				"LANG",
				"LC_ALL",
				"USER",
				"SHELL"
			];
			const baseline = {};
			for (const k of ENV_ALLOWLIST) {
				const v = process.env[k];
				if (typeof v === "string") baseline[k] = v;
			}
			const mergedEnv = env ? {
				...baseline,
				...env
			} : baseline;
			transport = new sdk.StdioClientTransport({
				command,
				args,
				env: mergedEnv,
				cwd
			});
		}
		const client = new Client({
			name: "agent-native-mcp-client",
			version: "1.0.0"
		}, { capabilities: {} });
		const recordConnectionError = () => {};
		const restoreClientClose = guardClose(client, recordConnectionError);
		const restoreTransportClose = guardClose(transport, recordConnectionError);
		client.onerror = recordConnectionError;
		transport.onerror = recordConnectionError;
		try {
			await client.connect(transport);
			const rawTools = (await client.listTools())?.tools ?? [];
			entry.client = client;
			entry.transport = transport;
			entry.tools = rawTools.map((t) => ({
				source: entry.id,
				name: buildPrefixedName(entry.id, t.name),
				originalName: t.name,
				description: t.description ?? t.name,
				inputSchema: t.inputSchema ?? {
					type: "object",
					properties: {}
				}
			}));
			client.onerror = (error) => {
				entry.error = formatMcpConnectError(error);
				if (this.debug) console.warn(`[mcp-client] runtime error from ${entry.id}: ${entry.error}`);
			};
		} catch (err) {
			await safelyClose(client, recordConnectionError);
			await safelyClose(transport, recordConnectionError);
			throw err;
		} finally {
			restoreClientClose?.();
			restoreTransportClose?.();
		}
	}
	/**
	* Replace the configured server set. Servers that appear in the new config
	* under a different shape are reconnected; unchanged entries stay live;
	* removed entries are disconnected. Safe to call while `start()` is in
	* flight or after it has completed.
	*
	* Serialised against `start()` and any other `reconfigure()` call via the
	* internal queue — two concurrent mutations would otherwise interleave on
	* `this.config` and on connect/disconnect ordering.
	*
	* Returns a summary describing what happened for logging / UI feedback.
	*/
	async reconfigure(newConfig) {
		const task = this.reconfigureQueue.then(() => this.reconfigureInternal(newConfig));
		this.reconfigureQueue = task.catch(() => {});
		return task;
	}
	async reconfigureInternal(newConfig) {
		const prev = this.config;
		this.config = newConfig;
		const prevServers = prev?.servers ?? {};
		const nextServers = newConfig?.servers ?? {};
		const added = [];
		const removed = [];
		const unchanged = [];
		const reconnected = [];
		for (const id of Object.keys(prevServers)) if (!(id in nextServers)) removed.push(id);
		else if (!sameServerConfig(prevServers[id], nextServers[id])) reconnected.push(id);
		else unchanged.push(id);
		for (const id of Object.keys(nextServers)) if (!(id in prevServers)) added.push(id);
		const toDisconnect = [...removed, ...reconnected];
		await Promise.all(toDisconnect.map(async (id) => {
			const entry = this.servers.get(id);
			if (!entry) return;
			this.servers.delete(id);
			try {
				if (entry.client?.close) await entry.client.close();
			} catch {}
			try {
				if (entry.transport?.close) await entry.transport.close();
			} catch {}
		}));
		const toConnect = [...added, ...reconnected];
		if (toConnect.length > 0) {
			const needStdio = toConnect.some((id) => (nextServers[id].type ?? "stdio") === "stdio");
			const sdk = await this.loadSdk(needStdio);
			if (sdk) await Promise.all(toConnect.map((id) => this.addServer(id, nextServers[id], sdk)));
		}
		if (!this.started && Object.keys(nextServers).length > 0) this.started = true;
		this.emitChange();
		return {
			added,
			removed,
			unchanged,
			reconnected
		};
	}
	/** Flattened tool list across all connected servers. */
	getTools() {
		if (!this.enabled) return [];
		const out = [];
		for (const entry of this.servers.values()) for (const tool of entry.tools) out.push(tool);
		return out;
	}
	/**
	* Invoke an MCP tool by prefixed name. Routes to the owning server based on
	* the `mcp__<serverId>__` prefix.
	*/
	async callTool(prefixedName, args) {
		const parsed = parseMcpToolName(prefixedName);
		if (!parsed) throw new Error(`Tool name "${prefixedName}" does not look like an MCP tool (expected mcp__<server>__<tool>)`);
		const entry = this.servers.get(parsed.serverId);
		if (!entry || !entry.client) throw new Error(`MCP server "${parsed.serverId}" is not connected${entry?.error ? `: ${entry.error}` : ""}`);
		if (!entry.tools.find((t) => t.name === prefixedName)) throw new Error(`MCP server "${parsed.serverId}" does not expose tool "${parsed.toolName}"`);
		return await entry.client.callTool({
			name: parsed.toolName,
			arguments: args && typeof args === "object" ? args : {}
		});
	}
	/** Cleanly close all MCP clients and child processes. */
	async stop() {
		const entries = Array.from(this.servers.values());
		this.servers.clear();
		this.started = false;
		await Promise.all(entries.map(async (entry) => {
			try {
				if (entry.client?.close) await entry.client.close();
			} catch {}
			try {
				if (entry.transport?.close) await entry.transport.close();
			} catch {}
		}));
	}
	/** Diagnostic snapshot used by `/_agent-native/mcp/status`. */
	getStatus() {
		const tools = this.getTools().map((t) => ({
			source: t.source,
			name: t.name,
			description: t.description
		}));
		const errors = {};
		for (const entry of this.servers.values()) if (entry.error) errors[entry.id] = entry.error;
		return {
			configuredServers: this.configuredServers,
			connectedServers: this.connectedServers,
			totalTools: tools.length,
			tools,
			errors
		};
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/tool-search.js
var TOOL_SEARCH_ACTION_NAME = "tool-search";
var DEFAULT_LIMIT = 8;
var MAX_LIMIT = 25;
function createToolSearchEntry(getRegistry, options = {}) {
	return {
		tool: {
			description: "Search the live registry of callable tools/actions, including connected MCP server tools named `mcp__<server>__<tool>`. Use this when you need a capability but are not sure which tool to call, especially after users connect new MCP servers. Returns exact tool names and parameter summaries so you can call the matching tool directly.",
			parameters: {
				type: "object",
				properties: {
					query: {
						type: "string",
						description: "What capability to find, e.g. `send slack message`, `create calendar event`, `zapier gmail`, or `browser screenshot`."
					},
					limit: {
						type: "number",
						description: `Maximum results to return. Defaults to ${options.defaultLimit ?? DEFAULT_LIMIT}.`
					},
					includeSchemas: {
						type: "boolean",
						description: "When true, include each matching tool's full input schema. Default false."
					}
				},
				required: ["query"]
			}
		},
		http: false,
		readOnly: true,
		run: async (args) => searchToolRegistry(getRegistry(), args, options)
	};
}
function attachToolSearch(registry, options = {}) {
	registry[TOOL_SEARCH_ACTION_NAME] = createToolSearchEntry(() => registry, options);
	return registry;
}
function searchToolRegistry(registry, args = {}, options = {}) {
	const query = String(args.query ?? "").trim();
	const includeSchemas = parseBoolean(args.includeSchemas);
	const limit = parseLimit(args.limit, options.defaultLimit ?? DEFAULT_LIMIT, options.maxLimit ?? MAX_LIMIT);
	const queryTokens = tokenize(query);
	const candidates = [];
	let totalTools = 0;
	for (const [name, entry] of Object.entries(registry)) {
		if (!entry?.tool || name === "tool-search") continue;
		if (name.startsWith("mcp__") && !isMcpToolAllowedForRequest(name)) continue;
		totalTools++;
		const description = normalizeWhitespace(entry.tool.description ?? "");
		const parameters = summarizeParameters(entry.tool.parameters);
		const parsedMcp = parseMcpToolName(name);
		const kind = parsedMcp ? "mcp" : "action";
		const source = parsedMcp?.serverId;
		const score = scoreTool({
			query,
			queryTokens,
			name,
			source,
			description,
			parameters,
			kind
		});
		if (queryTokens.length > 0 && score <= 0) continue;
		candidates.push({
			name,
			kind,
			...source ? { source } : {},
			description,
			score,
			parameters,
			...includeSchemas ? { inputSchema: entry.tool.parameters ?? {} } : {}
		});
	}
	candidates.sort((a, b) => {
		if (b.score !== a.score) return b.score - a.score;
		return a.name.localeCompare(b.name);
	});
	return {
		query,
		totalTools,
		count: Math.min(candidates.length, limit),
		results: candidates.slice(0, limit)
	};
}
function parseLimit(value, fallback, max) {
	const n = typeof value === "number" ? value : typeof value === "string" && value.trim() ? Number(value) : fallback;
	if (!Number.isFinite(n) || n <= 0) return fallback;
	return Math.max(1, Math.min(max, Math.floor(n)));
}
function parseBoolean(value) {
	if (typeof value === "boolean") return value;
	if (typeof value !== "string") return false;
	const normalized = value.trim().toLowerCase();
	return normalized === "true" || normalized === "1" || normalized === "yes";
}
function summarizeParameters(schema) {
	if (!schema || typeof schema !== "object") return [];
	const obj = schema;
	const properties = obj.properties;
	if (!properties || typeof properties !== "object") return [];
	const required = new Set(Array.isArray(obj.required) ? obj.required.filter((value) => typeof value === "string") : []);
	return Object.entries(properties).map(([name, raw]) => {
		const prop = raw && typeof raw === "object" ? raw : {};
		const enumValues = Array.isArray(prop.enum) ? prop.enum.map((value) => String(value)).slice(0, 20) : void 0;
		return {
			name,
			type: summarizeType(prop.type),
			required: required.has(name),
			description: typeof prop.description === "string" ? normalizeWhitespace(prop.description) : void 0,
			...enumValues && enumValues.length > 0 ? { enum: enumValues } : {}
		};
	});
}
function summarizeType(value) {
	if (typeof value === "string") return value;
	if (Array.isArray(value)) {
		const parts = value.filter((v) => typeof v === "string");
		return parts.length > 0 ? parts.join(" | ") : void 0;
	}
}
function scoreTool(input) {
	if (input.queryTokens.length === 0) return 1;
	const name = searchableText(input.name);
	const source = searchableText(input.source ?? "");
	const description = searchableText(input.description);
	const params = searchableText(input.parameters.map((p) => `${p.name} ${p.type ?? ""} ${p.description ?? ""}`).join(" "));
	const all = `${name} ${source} ${description} ${params} ${input.kind}`;
	const phrase = searchableText(input.query);
	let score = 0;
	if (name.includes(phrase)) score += 14;
	if (source && source.includes(phrase)) score += 10;
	if (description.includes(phrase)) score += 8;
	if (params.includes(phrase)) score += 5;
	for (const token of input.queryTokens) {
		if (name.split(" ").includes(token)) score += 9;
		else if (name.includes(token)) score += 6;
		if (source) {
			if (source.split(" ").includes(token)) score += 6;
			else if (source.includes(token)) score += 3;
		}
		if (description.includes(token)) score += 3;
		if (params.includes(token)) score += 2;
		if (all.includes(token)) score += 1;
	}
	return score;
}
function tokenize(value) {
	const seen = /* @__PURE__ */ new Set();
	for (const token of searchableText(value).split(" ")) if (token.length > 0) seen.add(token);
	return Array.from(seen);
}
function searchableText(value) {
	return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}
function normalizeWhitespace(value) {
	return value.replace(/\s+/g, " ").trim();
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/production-agent.js
registerBuiltinEngines();
/**
* Look up a user's persisted API key for the given provider. Returns
* `undefined` for unauthenticated callers.
*
* Read order:
*   1. `app_secrets` — encrypted user override, then active org/workspace.
*   2. Legacy `user-api-key:<provider>:<email>` settings row — pre-migration
*      data that hasn't been backfilled yet. Surfaced for compat only;
*      writes always go to app_secrets now.
*/
async function getOwnerApiKey(provider, ownerEmail) {
	if (!ownerEmail) return void 0;
	const secretKey = PROVIDER_TO_ENV[provider] ?? `${provider.toUpperCase()}_API_KEY`;
	try {
		const { readAppSecret } = await import("./storage-U0EZYB9K.js");
		const refs = [{
			scope: "user",
			scopeId: ownerEmail
		}];
		const orgId = getRequestOrgId();
		if (orgId) refs.push({
			scope: "org",
			scopeId: orgId
		}, {
			scope: "workspace",
			scopeId: orgId
		});
		else refs.push({
			scope: "workspace",
			scopeId: `solo:${ownerEmail}`
		});
		for (const ref of refs) {
			const fromSecrets = await readAppSecret({
				key: secretKey,
				scope: ref.scope,
				scopeId: ref.scopeId
			});
			if (fromSecrets?.value) return fromSecrets.value;
		}
	} catch {}
	try {
		const { getSetting } = await import("./store-BTTw68Ec.js");
		const stored = await getSetting(`user-api-key:${provider}:${ownerEmail}`);
		const key = stored && typeof stored.key === "string" ? stored.key.trim() : "";
		if (key) return key;
		if (provider === "anthropic") {
			const legacy = await getSetting(`user-anthropic-api-key:${ownerEmail}`);
			return (legacy && typeof legacy.key === "string" ? legacy.key.trim() : "") || void 0;
		}
		return;
	} catch {
		return;
	}
}
/**
* Derive the provider name from the active engine setting.
* "ai-sdk:openai" → "openai", "anthropic" → "anthropic"
*/
function engineToProvider(engineName) {
	return engineName.startsWith("ai-sdk:") ? engineName.slice(7) : engineName;
}
/**
* Returns true when this process should block generic deploy-level provider
* credentials for signed-in chat requests.
*
* Self-hosted single-tenant deployments keep the env-var fallback so the
* original BYO-server UX continues to work without a per-user key.
*/
function shouldBlockDeployCredentialFallback() {
	return !isDeployCredentialFallbackAllowed();
}
/**
* Resolve the active engine's provider and look up the user's API key for it.
*
* In shared hosted deploys we deliberately refuse the deploy-level fallback
* for authenticated users. Without that gate any
* signed-in user who hasn't configured their own provider key would silently
* inherit the deployment's key (uncapped billing on the owner's account,
* prompt logging tied to the deployment owner) — exactly the prior-incident
* pattern we hit on 2026-04-29.
*
* Single-tenant (local-dev, self-hosted SQLite) keeps the env fallback.
*
* Callers in `agent-chat-plugin.ts`, `triggers/dispatcher.ts`,
* `jobs/scheduler.ts`, and `integrations/plugin.ts` historically layer
* another deployment-key fallback after this must keep the same gate.
*/
async function getOwnerActiveApiKey(ownerEmail) {
	try {
		const { getSetting } = await import("./store-BTTw68Ec.js");
		const provider = engineToProvider((await getSetting("agent-engine"))?.engine ?? "anthropic");
		const userKey = await getOwnerApiKey(provider, ownerEmail);
		if (userKey) return userKey;
		if (shouldBlockDeployCredentialFallback()) return;
		const envVar = PROVIDER_TO_ENV[provider];
		return envVar ? readDeployCredentialEnv(envVar) : void 0;
	} catch {
		return;
	}
}
var PLAN_MODE_SYSTEM_PROMPT = `## Plan Mode Active

You are in Plan mode. This turn is for research, clarification, and a proposed approach only.

Hard rules:
- Use only read-only tools. Do not edit files, write resources, run shell commands, mutate SQL rows, navigate the UI, send notifications, create jobs, create tools, call external agents, or change external systems.
- If a needed detail is unclear, ask a concise clarifying question before proposing a plan.
- When ready, present a concrete plan with the files/tools you expect to touch, the intended changes, validation steps, and notable risks.
- Do not treat approval as implicit while Plan mode is still active. Tell the user to switch to Act mode with the mode selector or /act before implementation.`;
var PLAN_MODE_BLOCKED_READONLY_TOOLS = new Set([
	"refresh-screen",
	"set-search-params",
	"set-url-path"
]);
var PLAN_MODE_ALLOWED_ACTIONS = {
	resources: ["list", "read"],
	"chat-history": ["search"],
	"agent-teams": [
		"status",
		"read-result",
		"list"
	],
	"manage-jobs": ["list"],
	"manage-automations": ["list-events", "list"],
	"manage-notifications": ["list"],
	"manage-progress": ["list"],
	"manage-agent-engine": ["list"]
};
var PLAN_MODE_WEB_REQUEST_METHODS = new Set(["GET", "HEAD"]);
function getToolAction(name, args) {
	const raw = args && typeof args === "object" && "action" in args ? args.action : void 0;
	if (raw == null && name === "chat-history") return "search";
	return String(raw ?? "").toLowerCase();
}
function getWebRequestMethod(args) {
	const raw = args && typeof args === "object" && "method" in args ? args.method : void 0;
	return String(raw ?? "GET").toUpperCase();
}
function restrictActionEnum(parameters, allowedActions) {
	if (!parameters) return parameters;
	const actionParam = parameters.properties.action;
	if (!actionParam) return parameters;
	return {
		...parameters,
		properties: {
			...parameters.properties,
			action: {
				...actionParam,
				enum: [...allowedActions]
			}
		}
	};
}
function restrictWebRequestMethods(parameters) {
	if (!parameters) return parameters;
	const methodParam = parameters.properties.method;
	if (!methodParam) return parameters;
	return {
		...parameters,
		properties: {
			...parameters.properties,
			method: {
				...methodParam,
				enum: [...PLAN_MODE_WEB_REQUEST_METHODS]
			}
		}
	};
}
function planModeBlockedMessage(toolName, reason) {
	return `Plan mode blocked \`${toolName}\`` + (reason ? ` (${reason})` : "") + ". Switch to Act mode after the user approves the plan, then retry the action.";
}
function isPlanModeToolCallAllowed(name, input, entry) {
	if (PLAN_MODE_BLOCKED_READONLY_TOOLS.has(name)) return false;
	if (name === "web-request") return PLAN_MODE_WEB_REQUEST_METHODS.has(getWebRequestMethod(input));
	const allowedActions = PLAN_MODE_ALLOWED_ACTIONS[name];
	if (allowedActions) return allowedActions.includes(getToolAction(name, input));
	return entry.readOnly === true;
}
function createPlanModeGuardedAction(name, entry, allowedActions) {
	return {
		...entry,
		readOnly: true,
		tool: {
			...entry.tool,
			description: `${entry.tool.description}\n\nPlan mode: only these read-only actions are available: ` + allowedActions.map((action) => `"${action}"`).join(", ") + ".",
			parameters: restrictActionEnum(entry.tool.parameters, allowedActions)
		},
		run: async (args, context) => {
			const action = getToolAction(name, args);
			if (!allowedActions.includes(action)) return planModeBlockedMessage(name, `action="${action || "(missing)"}"`);
			return entry.run(args, context);
		}
	};
}
function createPlanModeWebRequestAction(entry) {
	return {
		...entry,
		readOnly: true,
		tool: {
			...entry.tool,
			description: `${entry.tool.description}\n\nPlan mode: only GET and HEAD requests are allowed.`,
			parameters: restrictWebRequestMethods(entry.tool.parameters)
		},
		run: async (args, context) => {
			const method = getWebRequestMethod(args);
			if (!PLAN_MODE_WEB_REQUEST_METHODS.has(method)) return planModeBlockedMessage("web-request", `method="${method}"`);
			return entry.run(args, context);
		}
	};
}
function createPlanModeActionRegistry(actions) {
	const filtered = {};
	for (const [name, entry] of Object.entries(actions)) {
		if (name === "tool-search") continue;
		if (PLAN_MODE_BLOCKED_READONLY_TOOLS.has(name)) continue;
		const allowedActions = PLAN_MODE_ALLOWED_ACTIONS[name];
		if (allowedActions) {
			filtered[name] = createPlanModeGuardedAction(name, entry, allowedActions);
			continue;
		}
		if (name === "web-request") {
			filtered[name] = createPlanModeWebRequestAction(entry);
			continue;
		}
		if (entry.readOnly === true) filtered[name] = entry;
	}
	if (actions["tool-search"]) filtered[TOOL_SEARCH_ACTION_NAME] = createToolSearchEntry(() => filtered);
	return filtered;
}
async function resolveAgentOwnerEmail(options, event) {
	let ownerEmail = null;
	if (options.resolveOwnerEmail) try {
		ownerEmail = await options.resolveOwnerEmail(event);
	} catch {
		ownerEmail = null;
	}
	return ownerEmail ?? getRequestUserEmail() ?? null;
}
var MAX_RETRIES = 3;
/**
* Retry budget override for `builder_gateway_error` — the no-detail Builder
* gateway fallback. Production data shows this code is almost never
* transient: it's the gateway emitting `{type:"stop",reason:"error"}` with
* no explanation, which usually means the upstream provider rejected the
* call (model quota, account misconfiguration). Retrying the same request
* synchronously rarely recovers, and each retry emits a `clear` event that
* wipes the user's visible content and re-streams from scratch — three
* cycles of "regenerate, clear, regenerate" inside a single run for a
* failure mode where retrying doesn't help. Keep the budget at 1 so we
* cover genuinely transient cases without the visible flicker storm.
*/
var BUILDER_GATEWAY_ERROR_MAX_RETRIES = 1;
var RETRY_BASE_DELAY_MS = 2e3;
function maxRetriesForError(err) {
	if (err instanceof EngineError) {
		if ((err.errorCode ?? "").toLowerCase() === "builder_gateway_error") return BUILDER_GATEWAY_ERROR_MAX_RETRIES;
	}
	return MAX_RETRIES;
}
var TOOL_INPUT_ACTIVITY_INTERVAL_MS = 1500;
var MAX_TEXT_ATTACHMENT_CHARS = 6e4;
function generateRunId() {
	return `run-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function toolInputActivityLabel(toolName) {
	return toolName ? `Preparing ${toolName} action` : "Preparing action input";
}
/** Check if an error is transient and should be retried */
function isContextTooLongError(err) {
	if (!(err instanceof Error)) return false;
	const msg = err.message.toLowerCase();
	if (msg.includes("context_length_exceeded") || msg.includes("input_too_long") || msg.includes("too many tokens") || msg.includes("prompt is too long") || msg.includes("reduce the length")) return true;
	if (err instanceof EngineError) {
		const code = (err.errorCode ?? "").toLowerCase();
		if (code.includes("context_length") || code.includes("input_too_long")) return true;
	}
	return false;
}
function isRetryableError(err) {
	if (!(err instanceof Error)) return false;
	const msg = err.message.toLowerCase();
	const code = err instanceof EngineError ? (err.errorCode ?? "").toLowerCase() : "";
	if (code === "builder_gateway_timeout") return false;
	return code === "builder_gateway_error" || code === "builder_gateway_network_error" || code === "http_502" || code === "http_503" || code === "http_504" || code === "timeout" || msg.includes("overloaded") || msg.includes("rate_limit") || msg.includes("529") || msg.includes("502") || msg.includes("503") || msg.includes("504") || msg.includes("gateway error") || msg.includes("socket hang up") || msg.includes("connection reset") || msg.includes("too many requests") || msg.includes("timeout") || msg.includes("gateway timeout") || msg.includes("inactivity timeout") || msg.includes("too much time has passed without sending any data");
}
/** Wait with exponential backoff, respecting abort signal */
function retryDelay(attempt, signal) {
	const baseMs = RETRY_BASE_DELAY_MS * Math.pow(2, attempt);
	const jitter = baseMs * .1;
	const ms = Math.max(0, baseMs + (Math.random() * 2 - 1) * jitter);
	return new Promise((resolve, reject) => {
		if (signal.aborted) return reject(/* @__PURE__ */ new Error("aborted"));
		const timer = setTimeout(resolve, ms);
		signal.addEventListener("abort", () => {
			clearTimeout(timer);
			reject(/* @__PURE__ */ new Error("aborted"));
		}, { once: true });
	});
}
function isSupportedImageMediaType(mediaType) {
	return mediaType === "image/jpeg" || mediaType === "image/png" || mediaType === "image/gif" || mediaType === "image/webp";
}
function escapeAttachmentAttribute(value) {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
function unwrapTextAttachmentEnvelope(text) {
	const match = text.match(/^<attachment\b[^>]*>\n([\s\S]*)\n<\/attachment>$/);
	return match ? match[1] : text;
}
function truncateTextAttachment(text) {
	if (text.length <= MAX_TEXT_ATTACHMENT_CHARS) return text;
	const omitted = text.length - MAX_TEXT_ATTACHMENT_CHARS;
	return `${text.slice(0, MAX_TEXT_ATTACHMENT_CHARS)}\n\n[Attachment truncated after ${MAX_TEXT_ATTACHMENT_CHARS.toLocaleString()} characters; ${omitted.toLocaleString()} characters omitted to keep the agent request within model context limits.]`;
}
function formatTextAttachment(att) {
	if (typeof att.text !== "string" || att.text.length === 0) return null;
	const text = truncateTextAttachment(unwrapTextAttachmentEnvelope(att.text));
	return `<attachment ${[
		`name="${escapeAttachmentAttribute(att.name || "attachment")}"`,
		att.contentType ? `contentType="${escapeAttachmentAttribute(att.contentType)}"` : null,
		att.type ? `type="${escapeAttachmentAttribute(att.type)}"` : null
	].filter(Boolean).join(" ")}>\n${text}\n</attachment>`;
}
function dataUrlToFilePart(att) {
	if (att.type !== "file" || typeof att.data !== "string") return null;
	const match = att.data.match(/^data:([^;]+);base64,(.+)$/);
	if (!match) return null;
	return {
		type: "file",
		data: match[2],
		mediaType: att.contentType || match[1],
		filename: att.name || void 0
	};
}
function buildUserContentWithAttachments(opts) {
	const userContent = [];
	const textAttachments = [];
	for (const att of opts.attachments ?? []) {
		if (att.type === "image" && att.data) {
			const match = att.data.match(/^data:(image\/[^;]+);base64,(.+)$/);
			if (match && isSupportedImageMediaType(match[1])) userContent.push({
				type: "image",
				data: match[2],
				mediaType: match[1]
			});
			continue;
		}
		const filePart = dataUrlToFilePart(att);
		if (filePart) {
			userContent.push(filePart);
			continue;
		}
		const textAttachment = formatTextAttachment(att);
		if (textAttachment) textAttachments.push(textAttachment);
	}
	userContent.push({
		type: "text",
		text: textAttachments.length > 0 ? `${textAttachments.join("\n\n")}\n\n${opts.text}` : opts.text
	});
	return userContent;
}
function structuredHistoryToEngineMessages(history) {
	if (!Array.isArray(history)) return null;
	const messages = [];
	for (const message of history) {
		if (!message || message.role !== "user" && message.role !== "assistant" || !Array.isArray(message.content)) continue;
		const content = [];
		for (const part of message.content) {
			if (!part || typeof part !== "object") continue;
			if (part.type === "text" && typeof part.text === "string") {
				if (part.text.length > 0) content.push({
					type: "text",
					text: part.text
				});
				continue;
			}
			if (part.type === "tool-call" && message.role === "assistant") {
				const id = typeof part.id === "string" ? part.id : typeof part.toolCallId === "string" ? part.toolCallId : "";
				const name = typeof part.name === "string" ? part.name : typeof part.toolName === "string" ? part.toolName : "";
				if (!id || !name) continue;
				content.push({
					type: "tool-call",
					id,
					name,
					input: part.input ?? part.args ?? {}
				});
				continue;
			}
			if (part.type === "tool-result" && message.role === "user") {
				if (typeof part.toolCallId !== "string" || typeof part.content !== "string") continue;
				content.push({
					type: "tool-result",
					toolCallId: part.toolCallId,
					...typeof part.toolName === "string" ? { toolName: part.toolName } : {},
					content: part.content,
					...part.isError ? { isError: true } : {}
				});
			}
		}
		if (content.length > 0) messages.push({
			role: message.role,
			content
		});
	}
	return messages.length > 0 ? messages : null;
}
/** Build enriched message with file/skill/mention references */
function enrichMessage(message, references) {
	if (references.length === 0) return message;
	const fileRefs = references.filter((r) => r.type === "file");
	const skillRefs = references.filter((r) => r.type === "skill");
	const customAgentRefs = references.filter((r) => r.type === "custom-agent");
	const mentionRefs = references.filter((r) => r.type === "mention");
	const parts = [];
	if (fileRefs.length > 0) parts.push("Referenced files:\n" + fileRefs.map((r) => `- ${r.path}${r.source === "resource" ? " (resource)" : ""}`).join("\n"));
	if (skillRefs.length > 0) parts.push("Applied skills:\n" + skillRefs.map((r) => `- ${r.name} (${r.path})${r.source === "resource" ? " — read with resource-read" : " — read with read-file"}`).join("\n"));
	if (customAgentRefs.length > 0) parts.push("Requested custom agents:\n" + customAgentRefs.map((r) => `- ${r.name}${r.refId ? ` (id: ${r.refId})` : ""}${r.path ? ` (path: ${r.path})` : ""}`).join("\n"));
	if (mentionRefs.length > 0) parts.push("Referenced items:\n" + mentionRefs.map((r) => `- [${r.refType || "item"}] ${r.name}${r.refId ? ` (id: ${r.refId})` : ""}${r.path ? ` (path: ${r.path})` : ""}`).join("\n"));
	return `${parts.join("\n\n")}\n\n${message}`;
}
function collectTextParts(parts) {
	return parts.filter((part) => part.type === "text").map((part) => part.text).join("");
}
var AGENT_INTERNAL_CONTINUE_PROMPT = "Continue from where you left off and finish the user's original request. Do not repeat completed work, do not mention internal reconnects, time limits, or step limits, and continue as if this is the same uninterrupted run.";
function appendAgentLoopContinuation(messages, reason) {
	const note = reason === "loop_limit" ? "The previous run reached an internal step budget." : reason === "stream_ended" ? "The previous stream ended before the agent sent a final completion signal." : reason === "gateway_timeout" ? "The previous LLM call hit an upstream gateway timeout before the response finished streaming." : reason === "network_interrupted" ? "The previous LLM call was cut off by a transport-level interruption (socket dropped, connection reset, or stream closed unexpectedly)." : "The previous run reached an internal execution budget.";
	messages.push({
		role: "user",
		content: [{
			type: "text",
			text: `${AGENT_INTERNAL_CONTINUE_PROMPT}\n\nInternal note: ${note}`
		}]
	});
}
/**
* True when an error thrown by `runAgentLoop` is a recoverable transport- or
* gateway-level interruption that the agent can resume from rather than a
* terminal failure. The continuation pattern works because the LLM call's
* conversation prefix is preserved on the next attempt — Anthropic's prompt
* cache rescues the latency, and the agent gets a "you got cut off, continue"
* nudge so it doesn't redo work it already finished.
*
* Distinct from `isRetryableError` which guides per-engine quick retries:
* `isResumableEngineError` is checked AFTER engine retries are exhausted, at
* the run level. It catches both gateway-reported timeouts (where engine
* retries don't apply because the gateway already gave up) and transport
* errors that survived engine retry budgets.
*/
function isResumableEngineError(err) {
	if (!(err instanceof Error)) return false;
	const code = err instanceof EngineError ? (err.errorCode ?? "").toLowerCase() : "";
	if (code === "builder_gateway_timeout" || code === "builder_gateway_network_error") return true;
	if (code === "http_502" || code === "http_503" || code === "http_504" || code === "timeout") return true;
	const text = errorSearchText(err);
	return text.includes("socket hang up") || text.includes("econnreset") || text.includes("enetreset") || text.includes("econnaborted") || text.includes("fetch failed") || text.includes("network error") || text.includes("connection reset") || text.includes("connection closed") || text.includes("stream closed") || text.includes("inactivity timeout") || text.includes("gateway timeout") || text.includes("upstream timeout") || text.includes("function timeout") || text.includes("too much time has passed without sending any data") || text.includes("terminated");
}
/**
* Map a resumable error to the most descriptive continuation reason. Used
* when surfacing the resume to the agent and to clients via the
* `auto_continue` event.
*/
function continuationReasonForResumableError(err) {
	if ((err instanceof EngineError ? (err.errorCode ?? "").toLowerCase() : "") === "builder_gateway_timeout") return "gateway_timeout";
	const text = err instanceof Error ? err.message.toLowerCase() : "";
	if (text.includes("gateway timeout") || text.includes("upstream timeout") || text.includes("function timeout")) return "gateway_timeout";
	return "network_interrupted";
}
function errorSearchText(err) {
	const parts = [];
	if (err instanceof Error) {
		parts.push(err.name, err.message);
		const maybe = err;
		if (typeof maybe.code === "string") parts.push(maybe.code);
		if (maybe.cause) parts.push(errorSearchText(maybe.cause));
	} else parts.push(String(err));
	return parts.join(" ").toLowerCase();
}
function textFromEngineMessage(message) {
	return message.content.filter((part) => part.type === "text").map((part) => part.text).join("\n");
}
function isInternalContinuationTurn(messages) {
	for (let i = messages.length - 1; i >= 0; i--) {
		const message = messages[i];
		if (message.role !== "user") continue;
		return textFromEngineMessage(message).startsWith(AGENT_INTERNAL_CONTINUE_PROMPT);
	}
	return false;
}
function seedReadOnlyToolResultsFromHistory(messages, actions) {
	const cache = /* @__PURE__ */ new Map();
	if (!isInternalContinuationTurn(messages)) return cache;
	const pendingToolCalls = /* @__PURE__ */ new Map();
	for (const message of messages) {
		if (message.role === "assistant") {
			for (const part of message.content) {
				if (part.type !== "tool-call") continue;
				if (actions[part.name]?.readOnly !== true) continue;
				pendingToolCalls.set(part.id, {
					name: part.name,
					input: part.input
				});
			}
			continue;
		}
		for (const part of message.content) {
			if (part.type !== "tool-result") continue;
			const call = pendingToolCalls.get(part.toolCallId);
			if (!call) continue;
			cache.set(toolCallCacheKey(call.name, call.input), part.content);
		}
	}
	return cache;
}
/**
* Convert ActionEntry registry to EngineTool array.
*/
function actionsToEngineTools(actions) {
	const tools = [];
	for (const [name, entry] of Object.entries(actions)) {
		const inputSchema = normalizeToolInputSchema(entry.tool.parameters);
		if (!inputSchema) {
			console.warn(`[agent] Skipping tool "${name}" because its input schema is not an object.`);
			continue;
		}
		tools.push({
			name,
			description: entry.tool.description,
			inputSchema
		});
	}
	return tools;
}
function normalizeToolInputSchema(schema) {
	if (!schema) return {
		type: "object",
		properties: {}
	};
	if (schema.type !== "object") return null;
	return {
		...schema,
		type: "object",
		properties: schema.properties && typeof schema.properties === "object" ? schema.properties : {},
		required: Array.isArray(schema.required) ? schema.required : []
	};
}
function stringifyToolInput(input) {
	try {
		const str = JSON.stringify(input);
		if (!str) return String(input);
		return str.length > 500 ? `${str.slice(0, 500)}…` : str;
	} catch {
		return String(input);
	}
}
function stableStringify(value) {
	if (value === null || typeof value !== "object") return JSON.stringify(value);
	if (Array.isArray(value)) return `[${value.map((item) => stableStringify(item)).join(",")}]`;
	const obj = value;
	return `{${Object.keys(obj).sort().map((key) => `${JSON.stringify(key)}:${stableStringify(obj[key])}`).join(",")}}`;
}
function toolCallCacheKey(toolName, input) {
	return `${toolName}:${stableStringify(normalizeToolCallInputForHistory(input))}`;
}
function normalizeToolCallInputForHistory(input) {
	if (input && typeof input === "object" && !Array.isArray(input)) return input;
	return { rawInput: input };
}
function toolInputSchemaErrorResult(toolName, input, error) {
	return `Invalid action parameters for ${toolName}: ${error}. Received: ${stringifyToolInput(input)}. The tool was not executed; retry with arguments that match the tool schema.`;
}
/**
* The core agent loop — calls the engine iteratively until no more tool calls.
* Decoupled from HTTP transport so it can run in the background.
* Returns accumulated token usage for cost tracking.
*/
async function runAgentLoop(opts) {
	const { engine, model, systemPrompt, tools, messages, actions, send, signal } = opts;
	const usage = {
		inputTokens: 0,
		outputTokens: 0,
		cacheReadTokens: 0,
		cacheWriteTokens: 0,
		model
	};
	const maxIterations = normalizeMaxIterations(opts.maxIterations, getDefaultMaxIterations());
	const toolCallHistory = [];
	const toolResultHistory = [];
	const runCtx = getRequestRunContext();
	if (runCtx) {
		runCtx.toolCalls = toolCallHistory;
		runCtx.toolResults = toolResultHistory;
	}
	const readOnlyToolResultCache = seedReadOnlyToolResultsFromHistory(messages, actions);
	const duplicateReadOnlyToolCalls = /* @__PURE__ */ new Map();
	const bufferTextUntilFinalGuard = Boolean(opts.finalResponseGuard);
	let finalGuardRetries = 0;
	let iterations = 0;
	while (true) {
		if (signal.aborted) break;
		if (++iterations > maxIterations) {
			appendAgentLoopContinuation(messages, "loop_limit");
			iterations = 1;
		}
		let assistantContent;
		let bufferedAssistantText = "";
		const toolCallErrors = /* @__PURE__ */ new Map();
		for (let retry = 0;; retry++) {
			assistantContent = void 0;
			bufferedAssistantText = "";
			toolCallErrors.clear();
			try {
				const streamOpts = {
					model,
					systemPrompt,
					messages,
					tools,
					abortSignal: signal,
					reasoningEffort: opts.reasoningEffort,
					providerOptions: opts.providerOptions
				};
				const eventStream = engine.stream(streamOpts);
				let thinkingBuffer = "";
				const toolInputNames = /* @__PURE__ */ new Map();
				let lastToolInputActivityAt = 0;
				const sendToolInputActivity = (toolName, force = false) => {
					const now = Date.now();
					if (!force && now - lastToolInputActivityAt < TOOL_INPUT_ACTIVITY_INTERVAL_MS) return;
					lastToolInputActivityAt = now;
					send({
						type: "activity",
						label: toolInputActivityLabel(toolName),
						...toolName ? { tool: toolName } : {}
					});
				};
				for await (const event of eventStream) if (event.type === "text-delta") if (bufferTextUntilFinalGuard) bufferedAssistantText += event.text;
				else send({
					type: "text",
					text: event.text
				});
				else if (event.type === "thinking-delta") thinkingBuffer += event.text;
				else if (event.type === "tool-input-start") {
					if (event.id && event.name) toolInputNames.set(event.id, event.name);
					sendToolInputActivity(event.name, true);
				} else if (event.type === "tool-input-delta") sendToolInputActivity(event.name ?? (event.id ? toolInputNames.get(event.id) : void 0));
				else if (event.type === "tool-call") {} else if (event.type === "tool-call-error") toolCallErrors.set(event.id, {
					name: event.name,
					input: event.input,
					error: event.error
				});
				else if (event.type === "assistant-content") assistantContent = event.parts;
				else if (event.type === "usage") {
					usage.inputTokens += event.inputTokens;
					usage.outputTokens += event.outputTokens;
					usage.cacheReadTokens += event.cacheReadTokens ?? 0;
					usage.cacheWriteTokens += event.cacheWriteTokens ?? 0;
				} else if (event.type === "stop" && event.reason === "error") throw new EngineError(event.error ?? "Engine stream error", {
					errorCode: event.errorCode,
					upgradeUrl: event.upgradeUrl
				});
				break;
			} catch (err) {
				if (signal.aborted) throw err;
				if (isContextTooLongError(err)) throw new EngineError("Conversation has grown too long. Start a new conversation to continue.", { errorCode: "context_length_exceeded" });
				if (retry < maxRetriesForError(err) && isRetryableError(err)) {
					send({ type: "clear" });
					await retryDelay(retry, signal);
					continue;
				}
				throw err;
			}
		}
		if (!assistantContent && toolCallErrors.size > 0) assistantContent = [];
		if (!assistantContent) break;
		if (toolCallErrors.size > 0) {
			const existingToolCallIds = new Set(assistantContent.filter((part) => part.type === "tool-call").map((part) => part.id));
			for (const [id, info] of toolCallErrors) if (!existingToolCallIds.has(id)) assistantContent.push({
				type: "tool-call",
				id,
				name: info.name,
				input: info.input
			});
		}
		const assistantContentForHistory = assistantContent.map((part) => part.type === "tool-call" ? {
			...part,
			input: normalizeToolCallInputForHistory(part.input)
		} : part);
		messages.push({
			role: "assistant",
			content: assistantContentForHistory
		});
		const toolCallParts = assistantContent.filter((p) => p.type === "tool-call");
		const flushBufferedAssistantText = () => {
			if (!bufferTextUntilFinalGuard) return;
			const text = bufferedAssistantText || collectTextParts(assistantContentForHistory);
			if (text) send({
				type: "text",
				text
			});
		};
		if (toolCallParts.length === 0) {
			const guard = opts.finalResponseGuard ? await opts.finalResponseGuard({
				messages,
				assistantContent: assistantContentForHistory,
				text: collectTextParts(assistantContentForHistory),
				toolCalls: [...toolCallHistory],
				toolResults: [...toolResultHistory],
				retryCount: finalGuardRetries
			}) : null;
			let guardEmittedFallback = false;
			if (guard) {
				const retryMessage = typeof guard === "string" ? guard : guard.retryMessage;
				const fallbackMessage = typeof guard === "string" ? guard : guard.fallbackMessage;
				if (finalGuardRetries < 1) {
					finalGuardRetries += 1;
					messages.push({
						role: "user",
						content: [{
							type: "text",
							text: retryMessage
						}]
					});
					continue;
				}
				send({
					type: "text",
					text: fallbackMessage ?? retryMessage
				});
				guardEmittedFallback = true;
			} else flushBufferedAssistantText();
			if (!guardEmittedFallback && collectTextParts(assistantContentForHistory).trim().length === 0 && bufferedAssistantText.trim().length === 0) send({
				type: "text",
				text: "The model returned an empty response. This usually means reasoning used the full output-token budget. Try again, or pick a different model from the model menu."
			});
			break;
		}
		flushBufferedAssistantText();
		let requestedActionStop = null;
		const runToolCall = async (toolCall) => {
			toolCallHistory.push({
				name: toolCall.name,
				input: normalizeToolCallInputForHistory(toolCall.input)
			});
			const recordToolResult = (content, isError) => {
				toolResultHistory.push({
					name: toolCall.name,
					content,
					isError
				});
			};
			const actionEntry = actions[toolCall.name];
			if (!actionEntry) {
				const result = `Error: Unknown tool "${toolCall.name}"`;
				send({
					type: "tool_start",
					tool: toolCall.name,
					input: toolCall.input
				});
				send({
					type: "tool_done",
					tool: toolCall.name,
					result
				});
				recordToolResult(result, true);
				return {
					type: "tool-result",
					toolCallId: toolCall.id,
					toolName: toolCall.name,
					content: result,
					isError: true
				};
			}
			const cacheKey = actionEntry.readOnly === true ? toolCallCacheKey(toolCall.name, toolCall.input) : null;
			if (cacheKey && readOnlyToolResultCache.has(cacheKey)) {
				const repeats = (duplicateReadOnlyToolCalls.get(cacheKey) ?? 0) + 1;
				duplicateReadOnlyToolCalls.set(cacheKey, repeats);
				const previousResult = readOnlyToolResultCache.get(cacheKey) ?? "";
				const result = `Skipped duplicate read-only call to ${toolCall.name}: identical input already ran in this turn. Use the previous result already in the conversation instead of calling this tool again.\n\nPrevious result:\n${previousResult}`;
				send({
					type: "tool_start",
					tool: toolCall.name,
					input: toolCall.input
				});
				send({
					type: "tool_done",
					tool: toolCall.name,
					result
				});
				recordToolResult(result, false);
				if (repeats >= 3) requestedActionStop ??= {
					message: "I stopped because the agent kept asking for the same read-only context it already had. Please send the request again if you want me to retry from a fresh turn.",
					errorCode: "duplicate_read_only_tool"
				};
				return {
					type: "tool-result",
					toolCallId: toolCall.id,
					toolName: toolCall.name,
					content: result
				};
			}
			send({
				type: "tool_start",
				tool: toolCall.name,
				input: toolCall.input
			});
			const toolCallSchemaError = toolCallErrors.get(toolCall.id);
			if (toolCallSchemaError) {
				const result = toolInputSchemaErrorResult(toolCall.name, toolCallSchemaError.input, toolCallSchemaError.error);
				send({
					type: "tool_done",
					tool: toolCall.name,
					result
				});
				recordToolResult(result, true);
				return {
					type: "tool-result",
					toolCallId: toolCall.id,
					toolName: toolCall.name,
					content: result,
					isError: true
				};
			}
			if (opts.executionMode === "plan" && !isPlanModeToolCallAllowed(toolCall.name, toolCall.input, actionEntry)) {
				const result = planModeBlockedMessage(toolCall.name);
				send({
					type: "tool_done",
					tool: toolCall.name,
					result
				});
				recordToolResult(result, true);
				return {
					type: "tool-result",
					toolCallId: toolCall.id,
					toolName: toolCall.name,
					content: result,
					isError: true
				};
			}
			const MAX_TOOL_RESULT_CHARS = 5e4;
			const TOOL_TIMEOUT_MS = 6e4;
			let result;
			let isError = false;
			try {
				const timeoutSignal = AbortSignal.timeout(TOOL_TIMEOUT_MS);
				const raw = await Promise.race([actionEntry.run(toolCall.input, { send }), new Promise((_, reject) => {
					timeoutSignal.addEventListener("abort", () => reject(/* @__PURE__ */ new Error("Tool call timed out after 60 seconds")));
				})]);
				let resultStr = typeof raw === "string" ? raw : JSON.stringify(raw, null, 2);
				if (resultStr.length > MAX_TOOL_RESULT_CHARS) resultStr = `${resultStr.slice(0, MAX_TOOL_RESULT_CHARS)}\n\n...[truncated — full result was ${resultStr.length.toLocaleString()} chars; only first ${MAX_TOOL_RESULT_CHARS.toLocaleString()} shown]`;
				result = resultStr;
			} catch (err) {
				if (isAgentActionStopError(err)) {
					const message = err.message || `Stopped after ${toolCall.name} failed.`;
					result = err.toolResult || message;
					requestedActionStop ??= {
						message,
						...err.errorCode ? { errorCode: err.errorCode } : {}
					};
				} else result = `Error running ${toolCall.name}: ${err?.message ?? String(err)}`;
				isError = true;
			}
			if (!isError && actionEntry.readOnly !== true) try {
				const { recordChange } = await import("./poll-YP4nzOxy.js");
				const owner = opts.ownerEmail ?? getRequestUserEmail() ?? void 0;
				const orgId = opts.orgId ?? getRequestOrgId() ?? void 0;
				recordChange({
					source: "action",
					type: "change",
					key: toolCall.name,
					...owner ? { owner } : {},
					...orgId ? { orgId } : {}
				});
			} catch {}
			send({
				type: "tool_done",
				tool: toolCall.name,
				result
			});
			recordToolResult(result, isError);
			if (!isError) if (cacheKey) readOnlyToolResultCache.set(cacheKey, result);
			else {
				readOnlyToolResultCache.clear();
				duplicateReadOnlyToolCalls.clear();
			}
			return {
				type: "tool-result",
				toolCallId: toolCall.id,
				toolName: toolCall.name,
				content: result,
				...isError ? { isError } : {}
			};
		};
		const getParallelBatchKind = (toolCall) => {
			const entry = actions[toolCall.name];
			if (!entry || entry.readOnly === true) return "read";
			if (entry.parallelSafe === true) return "parallel-write";
			return null;
		};
		const toolResultParts = [];
		let parallelBatch = [];
		let parallelBatchKind = null;
		const flushParallelBatch = async () => {
			if (parallelBatch.length === 0) return;
			const batch = parallelBatch;
			parallelBatch = [];
			parallelBatchKind = null;
			toolResultParts.push(...await Promise.all(batch.map(runToolCall)));
		};
		for (const toolCall of toolCallParts) {
			const batchKind = getParallelBatchKind(toolCall);
			if (batchKind) {
				if (parallelBatchKind && parallelBatchKind !== batchKind) await flushParallelBatch();
				parallelBatchKind = batchKind;
				parallelBatch.push(toolCall);
			} else {
				await flushParallelBatch();
				toolResultParts.push(await runToolCall(toolCall));
			}
		}
		await flushParallelBatch();
		messages.push({
			role: "user",
			content: toolResultParts
		});
		if (requestedActionStop) {
			send({
				type: "text",
				text: requestedActionStop.message
			});
			break;
		}
	}
	if (!signal.aborted) send({ type: "done" });
	return usage;
}
function createProductionAgentHandler(options) {
	const configuredModel = options.model;
	const resolvedActions = options.actions ?? options.scripts ?? {};
	const getEngineTools = (actions = resolvedActions) => {
		const filtered = {};
		for (const [name, entry] of Object.entries(actions)) {
			if (name.startsWith("mcp__") && !isMcpToolAllowedForRequest(name)) continue;
			filtered[name] = entry;
		}
		return actionsToEngineTools(filtered);
	};
	return defineEventHandler(async (event) => {
		if (getMethod(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		let body;
		try {
			body = await readBody(event);
		} catch {
			setResponseStatus(event, 400);
			return { error: "Invalid request body" };
		}
		const { message, history = [], structuredHistory, references = [], threadId, attachments, displayMessage, internalContinuation, model: requestModel, engine: requestEngine, effort: requestEffort } = body;
		const requestMode = body.mode === "plan" ? "plan" : "act";
		const hasMessageText = typeof message === "string" && message.trim().length > 0;
		const hasAttachments = Array.isArray(attachments) && attachments.length > 0;
		if (!hasMessageText && !hasAttachments) {
			setResponseStatus(event, 400);
			return { error: "message is required" };
		}
		let requestMessage = hasMessageText ? message : "Use the attached context.";
		let requestAttachments = Array.isArray(attachments) ? attachments : [];
		let requestDisplayMessage = displayMessage;
		const ownerEmail = await resolveAgentOwnerEmail(options, event);
		const preparedRequest = await options.prepareRequest?.({
			event,
			ownerEmail,
			message: requestMessage,
			displayMessage: requestDisplayMessage,
			attachments: requestAttachments,
			references,
			threadId,
			internalContinuation: Boolean(internalContinuation),
			mode: requestMode
		});
		if (preparedRequest) {
			if (typeof preparedRequest.message === "string" && preparedRequest.message.trim().length > 0) requestMessage = preparedRequest.message;
			if (typeof preparedRequest.displayMessage === "string") requestDisplayMessage = preparedRequest.displayMessage;
			if (Array.isArray(preparedRequest.attachments)) requestAttachments = preparedRequest.attachments;
		}
		let userApiKey;
		if (requestEngine) {
			const provider = engineToProvider(requestEngine);
			userApiKey = await getOwnerApiKey(provider, ownerEmail);
			if (!userApiKey && !shouldBlockDeployCredentialFallback()) {
				const envVar = PROVIDER_TO_ENV[provider];
				userApiKey = envVar ? readDeployCredentialEnv(envVar) : void 0;
			}
		} else userApiKey = await getOwnerActiveApiKey(ownerEmail);
		const effectiveApiKey = shouldBlockDeployCredentialFallback() ? userApiKey : userApiKey ?? options.apiKey ?? readDeployCredentialEnv("ANTHROPIC_API_KEY");
		let engine;
		try {
			engine = await resolveEngine({
				engineOption: requestEngine ?? options.engine,
				apiKey: effectiveApiKey,
				model: configuredModel
			});
		} catch {
			engine = await resolveEngine({ apiKey: effectiveApiKey });
		}
		const model = requestModel ?? configuredModel ?? await getStoredModelForEngine(engine) ?? engine.defaultModel;
		const reasoningEffort = normalizeReasoningEffortForModel(model, isReasoningEffort(requestEffort) ? requestEffort : options.reasoningEffort);
		options.onEngineResolved?.(engine, model);
		console.log(`[agent-chat] resolved engine=${engine.name} model=${model} requestEngine=${requestEngine ?? "(none)"}`);
		if (engine.name === "anthropic" && !effectiveApiKey) {
			setResponseHeader(event, "Content-Type", "text/event-stream");
			setResponseHeader(event, "Cache-Control", "no-cache");
			setResponseHeader(event, "Connection", "keep-alive");
			const encoder = new TextEncoder();
			return new ReadableStream({ start(controller) {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "missing_api_key" })}\n\n`));
				controller.close();
			} });
		}
		const enrichedMessage = enrichMessage(requestMessage, references);
		const loopSettingsPromise = readAgentLoopSettings({
			userEmail: ownerEmail ?? getRequestUserEmail() ?? null,
			orgId: getRequestOrgId() ?? null
		}).catch(() => readAgentLoopSettings({}));
		let systemPromptError = null;
		const systemPromptPromise = (async () => {
			try {
				return typeof options.systemPrompt === "function" ? await options.systemPrompt(event) : options.systemPrompt;
			} catch (error) {
				systemPromptError = error;
				return "";
			}
		})();
		const screenContextPromise = (async () => {
			try {
				const viewScreenAction = resolvedActions["view-screen"];
				if (viewScreenAction) {
					const result = await viewScreenAction.run({});
					if (result && result !== "(no output)") return `\n\n<current-screen>\n${typeof result === "string" ? result : JSON.stringify(result, null, 2)}\n</current-screen>`;
				} else {
					const navigation = await readAppState("navigation");
					if (navigation) return `\n\n<current-screen>\n${JSON.stringify(navigation, null, 2)}\n</current-screen>`;
				}
			} catch {}
			return "";
		})();
		const urlContextPromise = (async () => {
			try {
				const url = await readAppState("__url__");
				if (url && (url.pathname || url.search || url.hash)) {
					const lines = [];
					if (url.pathname) lines.push(`pathname: ${url.pathname}`);
					if (url.search) lines.push(`search: ${url.search}`);
					if (url.hash) lines.push(`hash: ${url.hash}`);
					if (url.searchParams && Object.keys(url.searchParams).length > 0) {
						lines.push("searchParams:");
						for (const [k, v] of Object.entries(url.searchParams)) lines.push(`  ${k}: ${v}`);
					}
					return `\n\n<current-url>\n${lines.join("\n")}\n</current-url>`;
				}
			} catch {}
			return "";
		})();
		const SELECTION_TTL_MS = 300 * 1e3;
		const selectionContextPromise = (async () => {
			try {
				const sel = await readAppState("pending-selection-context");
				if (!sel?.text) return "";
				const capturedAt = typeof sel.capturedAt === "number" ? sel.capturedAt : 0;
				if (Date.now() - capturedAt > SELECTION_TTL_MS) return "";
				return `

The user has selected the following text and pressed Cmd+I to focus the agent. Treat this as the immediate context to act on:
<selection>\n${sel.text}\n</selection>`;
			} catch {}
			return "";
		})();
		const filesContextPromise = (async () => {
			let filesContext = "";
			if (options.skipFilesContext) return filesContext;
			if (history.length === 0) try {
				const { resourceListAccessible, SHARED_OWNER, resourceGet } = await import("./store-BokCrGTV.js");
				const { getResourceKind, parseCustomAgentProfile, parseRemoteAgentManifest, parseSkillMetadata } = await import("./metadata-CqP8m5xN.js").then((n) => n.c);
				const ownerEmail = getRequestUserEmail();
				if (!ownerEmail) throw new Error("no authenticated user");
				const allResources = await resourceListAccessible(ownerEmail);
				if (allResources.length > 0) {
					const fileLines = [];
					const skillLines = [];
					const agentLines = [];
					const jobLines = [];
					for (const r of allResources) {
						const scope = r.owner === SHARED_OWNER ? "shared" : "personal";
						const kind = getResourceKind(r.path);
						if (kind === "file") {
							fileLines.push(`  ${r.path} (${scope})`);
							continue;
						}
						if (kind === "job") {
							jobLines.push(`  ${r.path} (${scope})`);
							continue;
						}
						if (kind === "skill" || kind === "agent" || kind === "remote-agent") {
							const full = await resourceGet(r.id);
							if (!full) continue;
							if (kind === "skill") {
								const skill = parseSkillMetadata(full.content, r.path);
								skillLines.push(`  ${skill?.name || r.path} — ${skill?.description || r.path} (${scope}, ${r.path})`);
							} else if (kind === "agent") {
								const agent = parseCustomAgentProfile(full.content, r.path);
								agentLines.push(`  ${agent?.name || r.path} — ${agent?.description || "Custom workspace agent"} (${scope}, ${r.path}${agent?.model ? `, model: ${agent.model}` : ""})`);
							} else {
								const agent = parseRemoteAgentManifest(full.content, r.path);
								agentLines.push(`  ${agent?.name || r.path} — ${agent?.description || "Connected A2A agent"} (${scope}, remote via ${r.path})`);
							}
						}
					}
					const blocks = [];
					if (fileLines.length > 0) blocks.push(`<available-files>\nFiles in the workspace:\n${fileLines.join("\n")}\n\nTo read a file's contents, use the resource-read action with the file path.\n</available-files>`);
					if (skillLines.length > 0) blocks.push(`<available-skills>\nSkills in the workspace:\n${skillLines.join("\n")}\n</available-skills>`);
					if (agentLines.length > 0) blocks.push(`<available-agents>\nCustom and connected agents in the workspace:\n${agentLines.join("\n")}\n\nCustom agents under agents/*.md can be mentioned or used via agent-teams (action: "spawn") with the agent parameter.\n</available-agents>`);
					if (jobLines.length > 0) blocks.push(`<available-jobs>\nScheduled tasks in the workspace:\n${jobLines.join("\n")}\n</available-jobs>`);
					filesContext = blocks.length > 0 ? `\n\n${blocks.join("\n\n")}` : "";
				}
			} catch {}
			return filesContext;
		})();
		const [systemPrompt, screenBlock, urlBlock, selectionBlock, filesContext, loopSettings] = await Promise.all([
			systemPromptPromise,
			screenContextPromise,
			urlContextPromise,
			selectionContextPromise,
			filesContextPromise,
			loopSettingsPromise
		]);
		if (systemPromptError) {
			setResponseHeader(event, "Content-Type", "text/event-stream");
			setResponseHeader(event, "Cache-Control", "no-cache");
			const encoder = new TextEncoder();
			const err = systemPromptError;
			return new ReadableStream({ start(controller) {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({
					type: "error",
					error: `Failed to load system prompt: ${err?.message ?? String(err)}`
				})}\n\n`));
				controller.close();
			} });
		}
		const screenContext = screenBlock + urlBlock + selectionBlock;
		const requestActions = requestMode === "plan" ? createPlanModeActionRegistry(resolvedActions) : resolvedActions;
		const requestTools = getEngineTools(requestActions);
		const requestSystemPrompt = requestMode === "plan" ? `${systemPrompt}\n\n${PLAN_MODE_SYSTEM_PROMPT}` : systemPrompt;
		const agentRefs = references.filter((r) => r.type === "agent");
		const customAgentRefs = references.filter((r) => r.type === "custom-agent");
		const planModeAgentNote = requestMode === "plan" && agentRefs.length > 0 ? "\n\n<plan-mode-note>Connected external agent mentions were not called because Plan mode is read-only. Mention that they can be called after the user switches to Act mode if the plan needs them.</plan-mode-note>" : "";
		const userContent = buildUserContentWithAttachments({
			text: enrichedMessage + screenContext + filesContext + planModeAgentNote,
			attachments: requestAttachments
		});
		const messages = [...structuredHistoryToEngineMessages(structuredHistory) ?? history.filter((m) => m.content.trim()).map((m) => ({
			role: m.role,
			content: [{
				type: "text",
				text: m.content
			}]
		})), {
			role: "user",
			content: userContent
		}];
		if (threadId) {
			const existingRun = await getActiveRunForThreadAsync(threadId);
			if (existingRun?.status === "running") {
				setResponseStatus(event, 409);
				return {
					error: "Run already in progress for this thread",
					activeRunId: existingRun.runId
				};
			}
		}
		const runId = generateRunId();
		if (options.onRunPrepared && !internalContinuation) {
			const messageToPersist = typeof requestDisplayMessage === "string" && requestDisplayMessage.trim().length > 0 ? requestDisplayMessage : requestMessage;
			await options.onRunPrepared({
				runId,
				threadId,
				message: messageToPersist,
				attachments: requestAttachments
			});
		}
		startRun(runId, threadId ?? runId, async (send, signal) => {
			if (options.onRunStart) await options.onRunStart(send, threadId ?? runId);
			if (customAgentRefs.length > 0) {
				const ownerEmail = getRequestUserEmail();
				if (!ownerEmail) throw new Error("no authenticated user");
				const { findAccessibleCustomAgent } = await import("./agents-DIN3qWsZ.js");
				const customResponses = (await Promise.allSettled(customAgentRefs.map(async (ref) => {
					send({
						type: "agent_call",
						agent: ref.name,
						status: "start"
					});
					try {
						const profile = await findAccessibleCustomAgent(ownerEmail, ref.refId || ref.path || ref.name);
						if (!profile) throw new Error("Profile not found");
						const profilePrompt = `${requestSystemPrompt}\n\n<custom-agent-profile name="${profile.name}" path="${profile.path}">\n` + (profile.description ? `${profile.description}\n\n` : "") + `${profile.instructions}\n</custom-agent-profile>`;
						let responseText = "";
						const subUsage = await runAgentLoop({
							engine,
							model: profile.model ?? model,
							systemPrompt: profilePrompt,
							tools: requestTools,
							messages: [{
								role: "user",
								content: [{
									type: "text",
									text: enrichedMessage + screenContext
								}]
							}],
							actions: requestActions,
							send: (event) => {
								if (event.type === "text") {
									responseText += event.text;
									send({
										type: "agent_call_text",
										agent: ref.name,
										text: event.text
									});
								}
							},
							signal,
							reasoningEffort,
							providerOptions: options.providerOptions,
							executionMode: requestMode,
							maxIterations: loopSettings.maxIterations
						});
						try {
							const ownerEmail = options.resolveOwnerEmail ? await options.resolveOwnerEmail(event) : getRequestUserEmail();
							if (!ownerEmail) return;
							const { recordUsage } = await import("./store-DLJtZzM5.js");
							await recordUsage({
								ownerEmail,
								inputTokens: subUsage.inputTokens,
								outputTokens: subUsage.outputTokens,
								cacheReadTokens: subUsage.cacheReadTokens,
								cacheWriteTokens: subUsage.cacheWriteTokens,
								model: subUsage.model,
								label: `custom-agent:${ref.name}`
							});
						} catch {}
						send({
							type: "agent_call",
							agent: ref.name,
							status: "done"
						});
						return `<agent-response name="${ref.name}" id="${ref.refId}" type="custom-agent">\n${responseText}\n</agent-response>`;
					} catch (err) {
						send({
							type: "agent_call",
							agent: ref.name,
							status: "error"
						});
						const message = userFacingLlmCredentialError(err, { agentName: ref.name }) ?? `Failed to run ${ref.name}: ${err?.message}`;
						return `<agent-response name="${ref.name}" id="${ref.refId}" type="custom-agent" error="true">\n${message}\n</agent-response>`;
					}
				}))).filter((result) => result.status === "fulfilled").map((result) => result.value);
				if (customResponses.length > 0) {
					const agentContext = "Responses from custom workspace agents:\n\n" + customResponses.join("\n\n");
					const lastMsg = messages[messages.length - 1];
					if (lastMsg?.role === "user" && Array.isArray(lastMsg.content)) {
						const textPart = lastMsg.content.find((p) => p.type === "text");
						if (textPart) textPart.text = agentContext + "\n\n" + textPart.text;
					}
				}
			}
			if (agentRefs.length > 0 && requestMode !== "plan") {
				const [{ A2AClient, callAgent }, { resolveA2ACallerAuth }] = await Promise.all([import("./client-1j91N6-z.js").then((n) => n.i), import("./caller-auth-Qx2LcIiK.js")]);
				const results = await Promise.allSettled(agentRefs.map(async (ref) => {
					send({
						type: "agent_call",
						agent: ref.name,
						status: "start"
					});
					try {
						const callerAuth = await resolveA2ACallerAuth({ includeGoogleToken: true });
						const a2aClient = new A2AClient(ref.path, callerAuth.apiKey);
						const a2aMetadata = callerAuth.metadata;
						let responseText = "";
						let lastSentLength = 0;
						try {
							for await (const task of a2aClient.stream({
								role: "user",
								parts: [{
									type: "text",
									text: enrichedMessage + screenContext
								}]
							}, Object.keys(a2aMetadata).length > 0 ? { metadata: a2aMetadata } : void 0)) {
								const newText = task.status?.message?.parts?.filter((p) => p.type === "text")?.map((p) => p.text)?.join("") ?? "";
								if (newText.length > lastSentLength) {
									send({
										type: "agent_call_text",
										agent: ref.name,
										text: newText.slice(lastSentLength)
									});
									lastSentLength = newText.length;
								}
								responseText = newText;
							}
						} catch {
							if (!responseText) responseText = await callAgent(ref.path, enrichedMessage + screenContext, {
								apiKey: callerAuth.apiKey,
								userEmail: callerAuth.userEmail,
								orgDomain: callerAuth.orgDomain,
								orgSecret: callerAuth.orgSecret
							});
						}
						responseText = userFacingLlmCredentialError(responseText, { agentName: ref.name }) ?? responseText;
						send({
							type: "agent_call",
							agent: ref.name,
							status: "done"
						});
						return `<agent-response name="${ref.name}" id="${ref.refId}">\n${responseText}\n</agent-response>`;
					} catch (err) {
						send({
							type: "agent_call",
							agent: ref.name,
							status: "error"
						});
						const message = userFacingLlmCredentialError(err, { agentName: ref.name }) ?? `Failed to reach ${ref.name}: ${err?.message}`;
						return `<agent-response name="${ref.name}" id="${ref.refId}" error="true">\n${message}\n</agent-response>`;
					}
				}));
				const agentResponses_local = [];
				for (const result of results) if (result.status === "fulfilled") agentResponses_local.push(result.value);
				if (agentResponses_local.length > 0) {
					const agentContext = "Responses from other agents:\n\n" + agentResponses_local.join("\n\n");
					const lastMsg = messages[messages.length - 1];
					if (lastMsg?.role === "user" && Array.isArray(lastMsg.content)) {
						const textPart = lastMsg.content.find((p) => p.type === "text");
						if (textPart) textPart.text = agentContext + "\n\n" + textPart.text;
					}
				}
			}
			let effectiveModel = model;
			try {
				const { resolveActiveExperimentConfig } = await import("./experiments-DmsQzrOI.js");
				if (!ownerEmail) throw new Error("no authenticated user");
				const expConfig = await resolveActiveExperimentConfig(ownerEmail);
				if (expConfig) {
					if (typeof expConfig.configs.model === "string") effectiveModel = expConfig.configs.model;
				}
			} catch {}
			const agentLoopOpts = {
				engine,
				model: effectiveModel,
				systemPrompt: requestSystemPrompt,
				tools: requestTools,
				messages,
				actions: requestActions,
				send,
				signal,
				ownerEmail,
				orgId: getRequestOrgId() ?? null,
				reasoningEffort,
				providerOptions: options.providerOptions,
				executionMode: requestMode,
				maxIterations: loopSettings.maxIterations,
				finalResponseGuard: options.finalResponseGuard
			};
			let loopUsage;
			let instrumented = false;
			try {
				const { getObservabilityConfig, instrumentAgentLoop } = await import("./traces-uKJDpzEH.js");
				const obsConfig = await getObservabilityConfig();
				if (obsConfig.enabled) {
					instrumented = true;
					loopUsage = await instrumentAgentLoop({
						runAgentLoop,
						loopOpts: agentLoopOpts,
						runId,
						threadId: threadId ?? null,
						userId: ownerEmail,
						config: obsConfig
					});
				}
			} catch (err) {
				if (instrumented) throw err;
			}
			if (!instrumented) loopUsage = await runAgentLoop(agentLoopOpts);
			try {
				const ownerEmail = options.resolveOwnerEmail ? await options.resolveOwnerEmail(event) : getRequestUserEmail();
				if (ownerEmail && (loopUsage.inputTokens > 0 || loopUsage.outputTokens > 0 || loopUsage.cacheReadTokens > 0 || loopUsage.cacheWriteTokens > 0)) {
					const { recordUsage } = await import("./store-DLJtZzM5.js");
					await recordUsage({
						ownerEmail,
						inputTokens: loopUsage.inputTokens,
						outputTokens: loopUsage.outputTokens,
						cacheReadTokens: loopUsage.cacheReadTokens,
						cacheWriteTokens: loopUsage.cacheWriteTokens,
						model: loopUsage.model,
						label: body.usageLabel || "chat"
					});
				}
			} catch {}
		}, options.onRunComplete ? (run) => options.onRunComplete(run, threadId) : void 0, {
			softTimeoutMs: options.runSoftTimeoutMs,
			useHostedSoftTimeoutDefault: true
		});
		const stream = subscribeToRun(runId, 0);
		if (!stream) {
			setResponseStatus(event, 500);
			return { error: "Failed to start agent run" };
		}
		setResponseHeader(event, "Content-Type", "text/event-stream");
		setResponseHeader(event, "Cache-Control", "no-cache");
		setResponseHeader(event, "Connection", "keep-alive");
		setResponseHeader(event, "X-Run-Id", runId);
		return stream;
	});
}
//#endregion
export { mergedConfigKey as C, validateRemoteUrl as E, listRemoteServers as S, toHttpServerConfigAsync as T, attachToolSearch as _, buildUserContentWithAttachments as a, isMcpToolAllowedForRequest as b, createProductionAgentHandler as c, getOwnerApiKey as d, isPlanModeToolCallAllowed as f, structuredHistoryToEngineMessages as g, runAgentLoop as h, appendAgentLoopContinuation as i, engineToProvider as l, resolveAgentOwnerEmail as m, PLAN_MODE_SYSTEM_PROMPT as n, continuationReasonForResumableError as o, isResumableEngineError as p, actionsToEngineTools as r, createPlanModeActionRegistry as s, AGENT_INTERNAL_CONTINUE_PROMPT as t, getOwnerActiveApiKey as u, McpClientManager as v, removeRemoteServer as w, addRemoteServer as x, formatMcpConnectError as y };
