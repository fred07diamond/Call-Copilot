import { c as isLocalDatabase } from "./client-BpA2t7pN.js";
import { i as getRequestOrgId, o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/credential-provider.js
/**
* Credential provider abstraction.
*
* Every feature that needs an external credential (Anthropic API key,
* Google OAuth tokens, OpenAI key, Slack bot token, etc.) should go through
* one of the resolve*() helpers here instead of reading `process.env`
* directly. That way the same feature can work in three modes:
*
*   1. User set their own key in .env              → use it directly
*   2. User connected Builder via `/cli-auth`      → route through Builder proxy
*   3. Neither                                      → throw FeatureNotConfigured
*
* Templates catch FeatureNotConfigured and show a "Connect Builder (1 click) /
* set up your own key (guide)" card.
*
* Today these helpers are used by the Builder-hosted LLM gateway, and the
* shape is meant to grow to cover future managed credential integrations
* (e.g. additional Builder-hosted services) without rewrites.
*/
/**
* Decide which `app_secrets` scope a Builder/credential write should use.
*
* Org scope ("everyone in this org sees these credentials") wins when the
* connecting user is an owner or admin of an active org — the write
* privileges shared infra. A plain member or a user without an active
* org falls through to per-user scope so a teammate can't silently
* overwrite the org-shared connection.
*/
function resolveCredentialWriteScope(email, orgId, role) {
	if (orgId && (role === "owner" || role === "admin")) return {
		scope: "org",
		scopeId: orgId
	};
	return {
		scope: "user",
		scopeId: email
	};
}
/**
* Deployment-level credential fallback for single-tenant/local operation.
* Multi-tenant call sites must gate this explicitly before calling.
*/
function readDeployCredentialEnv(key) {
	return process.env[key] || void 0;
}
/**
* Deployment-level credentials are safe as a runtime fallback only in local /
* single-tenant contexts. In hosted production with a shared database, every
* signed-in user needs their own user/org/workspace credential so one deploy
* key does not silently power another tenant's chat.
*/
function isDeployCredentialFallbackAllowed() {
	if (process.env.NODE_ENV !== "production") return true;
	return isLocalDatabase();
}
function canUseDeployCredentialFallbackForRequest() {
	if (!getRequestUserEmail()) return true;
	return isDeployCredentialFallbackAllowed();
}
async function resolveScopedBuilderCredential(key) {
	const email = getRequestUserEmail();
	if (!email) return null;
	try {
		const { readAppSecret } = await import("./storage-Bj3xJEHv.js");
		const userSecret = await readAppSecret({
			key,
			scope: "user",
			scopeId: email
		});
		if (userSecret) return {
			value: userSecret.value,
			source: "user"
		};
		const orgId = getRequestOrgId();
		if (orgId) {
			const orgSecret = await readAppSecret({
				key,
				scope: "org",
				scopeId: orgId
			});
			if (orgSecret) return {
				value: orgSecret.value,
				source: "org"
			};
			const workspaceSecret = await readAppSecret({
				key,
				scope: "workspace",
				scopeId: orgId
			});
			if (workspaceSecret) return {
				value: workspaceSecret.value,
				source: "workspace"
			};
		} else {
			const soloWorkspaceSecret = await readAppSecret({
				key,
				scope: "workspace",
				scopeId: `solo:${email}`
			});
			if (soloWorkspaceSecret) return {
				value: soloWorkspaceSecret.value,
				source: "workspace"
			};
		}
	} catch {}
	return null;
}
/**
* Resolve a Builder credential for the current request. User/org credentials
* win; deployment env is only a fallback. This lets local/root .env keys keep
* a template working while still allowing users to connect their own Builder
* account from Settings or onboarding.
*/
async function resolveBuilderCredential(key) {
	const scoped = await resolveScopedBuilderCredential(key);
	if (scoped) return scoped.value;
	if (!canUseDeployCredentialFallbackForRequest()) return null;
	return readDeployCredentialEnv(key) ?? null;
}
/**
* Resolve the Builder private key for the current request. User/org OAuth
* credentials win; deploy-level `BUILDER_PRIVATE_KEY` is the fallback.
*/
async function resolveBuilderPrivateKey() {
	return resolveBuilderCredential("BUILDER_PRIVATE_KEY");
}
/**
* Resolve the current user's Builder auth header.
* Returns `"Bearer <key>"` or null.
*/
async function resolveBuilderAuthHeader() {
	const key = await resolveBuilderPrivateKey();
	return key ? `Bearer ${key}` : null;
}
/**
* Check whether the current user has a Builder private key configured
* (per-user or deployment-level).
*/
async function resolveHasBuilderPrivateKey() {
	return !!await resolveBuilderPrivateKey();
}
/**
* Resolve where the effective Builder private key came from. Used by status
* UIs so they can distinguish a deploy fallback from a user/org connection.
*/
async function resolveBuilderCredentialSource() {
	const scoped = await resolveScopedBuilderCredential("BUILDER_PRIVATE_KEY");
	if (scoped) return scoped.source;
	return canUseDeployCredentialFallbackForRequest() && process.env.BUILDER_PRIVATE_KEY ? "env" : null;
}
/**
* Resolve all per-user Builder credentials. Used by the status endpoint
* and agent-chat-plugin to get orgName, userId, etc.
*/
async function resolveBuilderCredentials() {
	const [privateKey, publicKey, userId, orgName, orgKind] = await Promise.all([
		resolveBuilderCredential("BUILDER_PRIVATE_KEY"),
		resolveBuilderCredential("BUILDER_PUBLIC_KEY"),
		resolveBuilderCredential("BUILDER_USER_ID"),
		resolveBuilderCredential("BUILDER_ORG_NAME"),
		resolveBuilderCredential("BUILDER_ORG_KIND")
	]);
	return {
		privateKey,
		publicKey,
		userId,
		orgName,
		orgKind
	};
}
var BUILDER_CREDENTIAL_KEYS = [
	"BUILDER_PRIVATE_KEY",
	"BUILDER_PUBLIC_KEY",
	"BUILDER_USER_ID",
	"BUILDER_ORG_NAME",
	"BUILDER_ORG_KIND"
];
/**
* Write Builder credentials to `app_secrets`.
*
* Scope decision (see `resolveCredentialWriteScope`): when the connecting
* user is owner/admin of an active org we write at `scope: "org"` so every
* member of that org auto-resolves the credentials via
* `resolveBuilderCredential`'s org fallback — no per-user re-connect
* needed. A plain member or a user with no active org writes at
* `scope: "user"` (the safe default that doesn't trample the org's shared
* connection).
*
* Returns the actual scope/scopeId used so the caller can show "Connected
* for Builder.io" vs "Connected (personal)" in the UI.
*/
async function writeBuilderCredentials(email, creds, options) {
	const { writeAppSecret } = await import("./storage-Bj3xJEHv.js");
	const target = resolveCredentialWriteScope(email, options?.orgId ?? null, options?.role ?? null);
	const entries = [{
		key: "BUILDER_PRIVATE_KEY",
		value: creds.privateKey
	}, {
		key: "BUILDER_PUBLIC_KEY",
		value: creds.publicKey
	}];
	if (creds.userId) entries.push({
		key: "BUILDER_USER_ID",
		value: creds.userId
	});
	if (creds.orgName) entries.push({
		key: "BUILDER_ORG_NAME",
		value: creds.orgName
	});
	if (creds.orgKind) entries.push({
		key: "BUILDER_ORG_KIND",
		value: creds.orgKind
	});
	await Promise.all(entries.map(({ key, value }) => writeAppSecret({
		key,
		value,
		scope: target.scope,
		scopeId: target.scopeId
	})));
	return target;
}
/**
* Delete Builder credentials.
*
* Default behaviour: clears only this user's per-user override (so a
* member can disconnect their personal Builder identity without
* collapsing the org-wide connection for every teammate). To revoke the
* org's shared connection, pass `{ orgId, role }` for an owner/admin —
* matching the same authority gate `writeBuilderCredentials` uses on
* write. Plain members can never reach the org-scoped row.
*/
async function deleteBuilderCredentials(email, options) {
	const { deleteAppSecret } = await import("./storage-Bj3xJEHv.js");
	const target = resolveCredentialWriteScope(email, options?.orgId ?? null, options?.role ?? null);
	await Promise.all(BUILDER_CREDENTIAL_KEYS.map((key) => deleteAppSecret({
		key,
		scope: target.scope,
		scopeId: target.scopeId
	}).catch(() => {})));
	return target;
}
/**
* Resolve a request-scoped secret. Reads from `app_secrets` first (current
* user override, active org, then workspace row); falls back to `process.env`
* only when the deploy fallback policy allows it.
*/
async function resolveSecret(key) {
	const email = getRequestUserEmail();
	if (email) {
		try {
			const { readAppSecret } = await import("./storage-Bj3xJEHv.js");
			const userSecret = await readAppSecret({
				key,
				scope: "user",
				scopeId: email
			});
			if (userSecret?.value) return userSecret.value;
			const orgId = getRequestOrgId();
			if (orgId) {
				const orgSecret = await readAppSecret({
					key,
					scope: "org",
					scopeId: orgId
				});
				if (orgSecret?.value) return orgSecret.value;
				const workspaceSecret = await readAppSecret({
					key,
					scope: "workspace",
					scopeId: orgId
				});
				if (workspaceSecret?.value) return workspaceSecret.value;
			} else {
				const soloWorkspaceSecret = await readAppSecret({
					key,
					scope: "workspace",
					scopeId: `solo:${email}`
				});
				if (soloWorkspaceSecret?.value) return soloWorkspaceSecret.value;
			}
		} catch {}
		return canUseDeployCredentialFallbackForRequest() ? process.env[key] || null : null;
	}
	return process.env[key] || null;
}
/** The origin for Builder-proxied API calls. Overridable for testing. */
function getBuilderProxyOrigin() {
	return process.env.BUILDER_PROXY_ORIGIN || process.env.AIR_HOST || process.env.BUILDER_API_HOST || "https://ai-services.builder.io";
}
/**
* Base URL for the public Builder LLM gateway (distinct from the internal
* proxy origin above — the public gateway lives at
* api.builder.io/agent-native/gateway, while the internal origin is
* ai-services.builder.io).
* Override via BUILDER_GATEWAY_BASE_URL for staging / testing.
*/
function getBuilderGatewayBaseUrl() {
	return process.env.BUILDER_GATEWAY_BASE_URL || "https://api.builder.io/agent-native/gateway/v1";
}
//#endregion
export { isDeployCredentialFallbackAllowed as a, resolveBuilderCredential as c, resolveBuilderPrivateKey as d, resolveCredentialWriteScope as f, writeBuilderCredentials as h, getBuilderProxyOrigin as i, resolveBuilderCredentialSource as l, resolveSecret as m, deleteBuilderCredentials as n, readDeployCredentialEnv as o, resolveHasBuilderPrivateKey as p, getBuilderGatewayBaseUrl as r, resolveBuilderAuthHeader as s, canUseDeployCredentialFallbackForRequest as t, resolveBuilderCredentials as u };
