import { i as getDbExec, u as isPostgres } from "./client-BnpqLOqs.js";
import { i as text, r as table, t as integer } from "./schema-BP4LmlFG.js";
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomUUID } from "node:crypto";
table("app_secrets", {
	id: text("id").primaryKey(),
	scope: text("scope").notNull(),
	scopeId: text("scope_id").notNull(),
	key: text("key").notNull(),
	encryptedValue: text("encrypted_value").notNull(),
	description: text("description"),
	urlAllowlist: text("url_allowlist"),
	createdAt: integer("created_at").notNull(),
	updatedAt: integer("updated_at").notNull()
});
/**
* Raw SQL for creating the app_secrets table. Used by the on-demand
* `ensureTable()` path in `storage.ts` and by any template-level migration
* that wants to create the table up-front.
*/
var APP_SECRETS_CREATE_SQL = `CREATE TABLE IF NOT EXISTS app_secrets (
  id TEXT PRIMARY KEY,
  scope TEXT NOT NULL,
  scope_id TEXT NOT NULL,
  key TEXT NOT NULL,
  encrypted_value TEXT NOT NULL,
  description TEXT,
  url_allowlist TEXT,
  created_at INTEGER NOT NULL,
  updated_at INTEGER NOT NULL,
  UNIQUE(scope, scope_id, key)
)`;
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/secrets/storage.js
/**
* Storage layer for the framework secrets registry.
*
* Values are encrypted at rest with AES-256-GCM. The encryption key is
* derived from `SECRETS_ENCRYPTION_KEY` (preferred) or the existing
* `BETTER_AUTH_SECRET` env var (fallback so templates don't need a second
* secret during development). If neither is set in production we fall back
* to a machine-local key derived from the cwd — the secret is still only
* readable on this machine, but consider setting `SECRETS_ENCRYPTION_KEY`
* for a stable, rotatable key.
*
* Secret values are NEVER logged and NEVER returned from any route handler.
*/
var _initPromise;
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		const sql = isPostgres() ? APP_SECRETS_CREATE_SQL.replace(/\bINTEGER\b/g, "BIGINT") : APP_SECRETS_CREATE_SQL;
		await client.execute(sql);
		try {
			await client.execute(`ALTER TABLE app_secrets ADD COLUMN description TEXT`);
		} catch {}
		try {
			await client.execute(`ALTER TABLE app_secrets ADD COLUMN url_allowlist TEXT`);
		} catch {}
	})();
	return _initPromise;
}
/**
* Derive a 32-byte AES key from the configured secret material via SHA-256.
* Re-derived per-request (cheap, stateless, and makes rotation easy).
*
* In production we refuse to start with the CWD-derived fallback. Same
* posture `resolveAuthSecret` takes for `BETTER_AUTH_SECRET` — fail loud
* rather than encrypt every secret with a key that's effectively static
* across the whole deployment (Lambda CWD is `/var/task`, etc.). Anyone
* with read access to the DB (forgotten backup, pg_dump, downgraded env)
* could otherwise decrypt every user's secrets with trivial work.
*/
function getEncryptionKey() {
	const explicit = process.env.SECRETS_ENCRYPTION_KEY || process.env.BETTER_AUTH_SECRET;
	if (!explicit) {
		if (process.env.NODE_ENV === "production") throw new Error("[agent-native/secrets] Refusing to start in production without an encryption key. Set SECRETS_ENCRYPTION_KEY (preferred) or BETTER_AUTH_SECRET in the deploy environment. The previous CWD-derived fallback was effectively static (e.g. `/var/task` on Lambda), which means anyone with read access to the secrets table could decrypt every user's secrets.");
		if (!_warnedFallback) {
			_warnedFallback = true;
			console.warn("[agent-native/secrets] SECRETS_ENCRYPTION_KEY not set — using a machine-local fallback. Set SECRETS_ENCRYPTION_KEY (or BETTER_AUTH_SECRET) for production. Production deploys without one of these env vars now hard-fail.");
		}
	}
	const material = explicit || `agent-native-secrets:${process.cwd()}`;
	return createHash("sha256").update(material).digest();
}
var _warnedFallback = false;
/** Encrypt a plain-text value. Returns `v1:<iv-hex>:<ct-hex>:<tag-hex>`. */
function encryptValue(plaintext) {
	const key = getEncryptionKey();
	const iv = randomBytes(12);
	const cipher = createCipheriv("aes-256-gcm", key, iv);
	const ct = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
	const tag = cipher.getAuthTag();
	return `v1:${iv.toString("hex")}:${ct.toString("hex")}:${tag.toString("hex")}`;
}
/** Decrypt a value produced by `encryptValue`. Throws on tampering. */
function decryptValue(encrypted) {
	if (!encrypted.startsWith("v1:")) throw new Error("Unrecognised secret encoding");
	const [, ivHex, ctHex, tagHex] = encrypted.split(":");
	if (!ivHex || !ctHex || !tagHex) throw new Error("Corrupt secret payload");
	const decipher = createDecipheriv("aes-256-gcm", getEncryptionKey(), Buffer.from(ivHex, "hex"));
	decipher.setAuthTag(Buffer.from(tagHex, "hex"));
	return Buffer.concat([decipher.update(Buffer.from(ctHex, "hex")), decipher.final()]).toString("utf8");
}
/**
* Return the last 4 characters of a secret, with any leading characters
* masked. Used to show a preview without leaking the value.
*/
function last4(value) {
	if (!value) return "";
	if (value.length <= 4) return "••••";
	return "••••" + value.slice(-4);
}
/**
* Write (insert or update) a secret. The value is encrypted before being
* stored — the caller's plaintext is never persisted. Returns the new
* record's id.
*/
async function writeAppSecret(args) {
	await ensureTable();
	const { key, value, scope, scopeId, description, urlAllowlist } = args;
	if (!key || !value || !scope || !scopeId) throw new Error("writeAppSecret: key, value, scope, and scopeId are all required");
	const client = getDbExec();
	const now = Date.now();
	const encrypted = encryptValue(value);
	const { rows } = await client.execute({
		sql: `SELECT id FROM app_secrets WHERE scope = ? AND scope_id = ? AND key = ?`,
		args: [
			scope,
			scopeId,
			key
		]
	});
	if (rows.length > 0) {
		const id = rows[0].id;
		await client.execute({
			sql: `UPDATE app_secrets SET encrypted_value = ?, description = ?, url_allowlist = ?, updated_at = ? WHERE id = ?`,
			args: [
				encrypted,
				description ?? null,
				urlAllowlist ?? null,
				now,
				id
			]
		});
		return id;
	}
	const id = randomUUID();
	await client.execute({
		sql: `INSERT INTO app_secrets (id, scope, scope_id, key, encrypted_value, description, url_allowlist, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			id,
			scope,
			scopeId,
			key,
			encrypted,
			description ?? null,
			urlAllowlist ?? null,
			now,
			now
		]
	});
	return id;
}
/**
* Read a secret's plaintext value. Returns null when not found. The caller
* is responsible for never logging the returned value.
*/
async function readAppSecret(ref) {
	await ensureTable();
	const { key, scope, scopeId } = ref;
	const { rows } = await getDbExec().execute({
		sql: `SELECT encrypted_value, updated_at FROM app_secrets WHERE scope = ? AND scope_id = ? AND key = ? LIMIT 1`,
		args: [
			scope,
			scopeId,
			key
		]
	});
	if (rows.length === 0) return null;
	try {
		const value = decryptValue(rows[0].encrypted_value);
		return {
			value,
			last4: last4(value),
			updatedAt: Number(rows[0].updated_at ?? 0)
		};
	} catch {
		return null;
	}
}
/**
* Return just the metadata for a secret (no value). Used by the list route so
* the UI can show the "Set" pill and last-4 without the decrypted value going
* over the wire.
*/
async function getAppSecretMeta(ref) {
	const result = await readAppSecret(ref);
	if (!result) return null;
	return {
		last4: result.last4,
		updatedAt: result.updatedAt
	};
}
/**
* Read a secret's metadata, including ad-hoc fields (description, allowlist),
* without ever decrypting or returning the plaintext value. Used by the
* ad-hoc list route and any UI that wants to render a key tile.
*/
async function readAppSecretMeta(ref) {
	await ensureTable();
	const { key, scope, scopeId } = ref;
	const { rows } = await getDbExec().execute({
		sql: `SELECT encrypted_value, description, url_allowlist, created_at, updated_at FROM app_secrets WHERE scope = ? AND scope_id = ? AND key = ? LIMIT 1`,
		args: [
			scope,
			scopeId,
			key
		]
	});
	if (rows.length === 0) return null;
	const row = rows[0];
	let last4Value = "";
	try {
		last4Value = last4(decryptValue(row.encrypted_value));
	} catch {
		last4Value = "";
	}
	return {
		key,
		scope,
		scopeId,
		last4: last4Value,
		description: row.description ?? null,
		urlAllowlist: parseAllowlist(row.url_allowlist),
		createdAt: Number(row.created_at ?? 0),
		updatedAt: Number(row.updated_at ?? 0)
	};
}
/**
* List all secrets for a given scope. Returns metadata only — values are
* never decrypted or returned. Used by the ad-hoc list route to surface
* user-created keys.
*/
async function listAppSecretsForScope(scope, scopeId) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT key, encrypted_value, description, url_allowlist, created_at, updated_at FROM app_secrets WHERE scope = ? AND scope_id = ? ORDER BY updated_at DESC`,
		args: [scope, scopeId]
	});
	return rows.map((row) => {
		let last4Value = "";
		try {
			last4Value = last4(decryptValue(row.encrypted_value));
		} catch {
			last4Value = "";
		}
		return {
			key: row.key,
			scope,
			scopeId,
			last4: last4Value,
			description: row.description ?? null,
			urlAllowlist: parseAllowlist(row.url_allowlist),
			createdAt: Number(row.created_at ?? 0),
			updatedAt: Number(row.updated_at ?? 0)
		};
	});
}
function parseAllowlist(raw) {
	if (!raw) return null;
	try {
		const parsed = JSON.parse(raw);
		if (Array.isArray(parsed) && parsed.every((v) => typeof v === "string")) return parsed;
		return null;
	} catch {
		return null;
	}
}
async function deleteAppSecret(ref) {
	await ensureTable();
	const { key, scope, scopeId } = ref;
	const { rowsAffected } = await getDbExec().execute({
		sql: `DELETE FROM app_secrets WHERE scope = ? AND scope_id = ? AND key = ?`,
		args: [
			scope,
			scopeId,
			key
		]
	});
	return rowsAffected > 0;
}
//#endregion
export { readAppSecret as a, listAppSecretsForScope as i, getAppSecretMeta as n, readAppSecretMeta as o, last4 as r, writeAppSecret as s, deleteAppSecret as t };
