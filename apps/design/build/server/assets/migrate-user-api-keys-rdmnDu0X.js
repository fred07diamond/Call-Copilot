import { n as getDatabaseAuthToken, r as getDatabaseUrl } from "./client-BnpqLOqs.js";
import { i as PROVIDER_TO_ENV } from "./provider-env-vars-CWagFwVS.js";
import { i as parseArgs } from "./utils-Dd6V9pzd.js";
import { t as createClient } from "./node-C2JeiN4j.js";
import path from "path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/db/migrate-user-api-keys.js
/**
* Core script: db-migrate-user-api-keys
*
* One-shot migration: copy legacy `user-api-key:<provider>:<email>` and
* `user-anthropic-api-key:<email>` rows from the unscoped `settings` table
* into `app_secrets` (encrypted, scope=user, scopeId=email), then delete
* the legacy rows.
*
* Background. The pre-secrets-migration `agent-chat-plugin` save-key endpoint
* persisted user-pasted LLM API keys to `settings` under email-prefixed
* keys. The `app_secrets` system (encrypted, properly scoped) now owns
* user-pasted credentials. `getOwnerApiKey()` reads `app_secrets` first
* and falls back to the legacy settings rows for compat. This script
* clears that compat tail so the legacy rows don't sit around indefinitely.
*
* Idempotent — re-running on an already-migrated DB is a no-op.
*
* Usage:
*   DATABASE_URL=postgres://... pnpm action db-migrate-user-api-keys
*   pnpm action db-migrate-user-api-keys --db ./data/app.db
*   pnpm action db-migrate-user-api-keys --dry-run
*/
function isPostgresUrl(url) {
	return url.startsWith("postgres://") || url.startsWith("postgresql://");
}
function parseLegacyKey(settingsKey) {
	if (settingsKey.startsWith("user-api-key:")) {
		const rest = settingsKey.slice(13);
		const colonIdx = rest.indexOf(":");
		if (colonIdx <= 0) return null;
		const provider = rest.slice(0, colonIdx);
		const email = rest.slice(colonIdx + 1);
		if (!provider || !email) return null;
		return {
			provider,
			email
		};
	}
	if (settingsKey.startsWith("user-anthropic-api-key:")) {
		const email = settingsKey.slice(23);
		if (!email) return null;
		return {
			provider: "anthropic",
			email
		};
	}
	return null;
}
function secretKeyForProvider(provider) {
	return PROVIDER_TO_ENV[provider] ?? `${provider.toUpperCase()}_API_KEY`;
}
function maskApiKey(value) {
	if (!value) return "(empty)";
	if (value.length <= 8) return "***";
	return `${value.slice(0, 4)}…${value.slice(-4)} (len=${value.length})`;
}
async function dbMigrateUserApiKeys(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action db-migrate-user-api-keys [options]

Copies legacy user-api-key:* + user-anthropic-api-key:* settings rows
into app_secrets (encrypted, scope=user) and deletes the originals.

Options:
  --db <path>   Path to SQLite database (default: data/app.db)
  --dry-run     Print what would be migrated without writing
  --help        Show this help message`);
		return;
	}
	const dryRun = parsed["dry-run"] === "true";
	let url;
	if (parsed.db) url = "file:" + path.resolve(parsed.db);
	else if (getDatabaseUrl()) url = getDatabaseUrl();
	else url = "file:" + path.resolve(process.cwd(), "data", "app.db");
	const dbLabel = url.startsWith("file:") ? url.slice(5) : new URL(url).host || url;
	console.log(`[migrate-user-api-keys] target: ${dbLabel}${dryRun ? "  (dry-run)" : ""}`);
	const legacy = await fetchLegacyRows(url);
	if (legacy.length === 0) {
		console.log("[migrate-user-api-keys] nothing to migrate.");
		return;
	}
	console.log(`[migrate-user-api-keys] found ${legacy.length} legacy row(s):`);
	for (const row of legacy) {
		const target = secretKeyForProvider(row.provider);
		console.log(`  - ${row.email}  ${row.provider} → app_secrets[${target}]  ${maskApiKey(row.apiKey)}`);
	}
	if (dryRun) return;
	if (parsed.db) process.env.DATABASE_URL = url;
	const { writeAppSecret } = await import("./storage-U0EZYB9K.js");
	let migrated = 0;
	let skipped = 0;
	for (const row of legacy) try {
		await writeAppSecret({
			key: secretKeyForProvider(row.provider),
			value: row.apiKey,
			scope: "user",
			scopeId: row.email
		});
		await deleteLegacyRow(url, row.settingsKey);
		migrated++;
	} catch (err) {
		console.error(`  ! failed to migrate ${row.settingsKey}:`, err instanceof Error ? err.message : err);
		skipped++;
	}
	console.log(`[migrate-user-api-keys] done. migrated=${migrated} skipped=${skipped}`);
}
async function fetchLegacyRows(url) {
	const out = [];
	if (isPostgresUrl(url)) {
		const { default: pg } = await import("./src-DU9OR977.js").then((n) => n.n);
		const sql = pg(url);
		try {
			const rows = await sql.unsafe(`SELECT key, value FROM settings WHERE key LIKE 'user-api-key:%' OR key LIKE 'user-anthropic-api-key:%'`);
			for (const row of rows) {
				const parsed = parseLegacyKey(row.key);
				if (!parsed) continue;
				const apiKey = extractKeyFromValue(row.value);
				if (!apiKey) continue;
				out.push({
					settingsKey: row.key,
					provider: parsed.provider,
					email: parsed.email,
					apiKey
				});
			}
		} finally {
			await sql.end();
		}
		return out;
	}
	const client = createClient({
		url,
		authToken: getDatabaseAuthToken()
	});
	try {
		const result = await client.execute({
			sql: `SELECT key, value FROM settings WHERE key LIKE 'user-api-key:%' OR key LIKE 'user-anthropic-api-key:%'`,
			args: []
		});
		for (const row of result.rows) {
			const settingsKey = row.key;
			const value = row.value;
			const parsed = parseLegacyKey(settingsKey);
			if (!parsed) continue;
			const apiKey = extractKeyFromValue(value);
			if (!apiKey) continue;
			out.push({
				settingsKey,
				provider: parsed.provider,
				email: parsed.email,
				apiKey
			});
		}
	} finally {
		client.close();
	}
	return out;
}
function extractKeyFromValue(value) {
	if (!value) return null;
	try {
		const parsed = JSON.parse(value);
		if (typeof parsed === "string" && parsed.trim()) return parsed.trim();
		if (parsed && typeof parsed.key === "string" && parsed.key.trim()) return parsed.key.trim();
		return null;
	} catch {
		return value.trim() || null;
	}
}
async function deleteLegacyRow(url, key) {
	if (isPostgresUrl(url)) {
		const { default: pg } = await import("./src-DU9OR977.js").then((n) => n.n);
		const sql = pg(url);
		try {
			await sql.unsafe(`DELETE FROM settings WHERE key = $1`, [key]);
		} finally {
			await sql.end();
		}
		return;
	}
	const client = createClient({
		url,
		authToken: getDatabaseAuthToken()
	});
	try {
		await client.execute({
			sql: `DELETE FROM settings WHERE key = ?`,
			args: [key]
		});
	} finally {
		client.close();
	}
}
//#endregion
export { dbMigrateUserApiKeys as default };
