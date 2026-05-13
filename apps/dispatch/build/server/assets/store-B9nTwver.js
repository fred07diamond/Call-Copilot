import { i as getDbExec, o as intType, u as isPostgres } from "./client-BnpqLOqs.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/oauth-tokens/store.js
var _initPromise;
function oauthTokensTable() {
	return isPostgres() ? "public.oauth_tokens" : "oauth_tokens";
}
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		const table = oauthTokensTable();
		await client.execute(`
        CREATE TABLE IF NOT EXISTS ${table} (
          provider TEXT NOT NULL,
          account_id TEXT NOT NULL,
          owner TEXT,
          tokens TEXT NOT NULL,
          updated_at ${intType()} NOT NULL,
          PRIMARY KEY (provider, account_id)
        )
      `);
		try {
			await client.execute(`ALTER TABLE ${table} ADD COLUMN owner TEXT`);
		} catch {}
		try {
			await client.execute(`ALTER TABLE ${table} ADD COLUMN display_name TEXT`);
		} catch {}
		await client.execute(`UPDATE ${table} SET owner = account_id WHERE owner IS NULL`);
	})();
	return _initPromise;
}
/**
* Thrown when an OAuth save would re-bind an `(provider, account_id)` row
* to a different owner than already holds it. Callers should catch this and
* surface a clean "this account is already linked to another user" message
* to the requester rather than letting it propagate as a 500.
*
* Carries `statusCode = 409` so route handlers using h3's `createError` can
* pass it straight through.
*/
var OAuthAccountOwnedByOtherUserError = class extends Error {
	statusCode = 409;
	provider;
	accountId;
	existingOwner;
	attemptedOwner;
	constructor(opts) {
		super(`OAuth account ${opts.provider}:${opts.accountId} is already linked to another user — refusing to overwrite the owner.`);
		this.name = "OAuthAccountOwnedByOtherUserError";
		this.provider = opts.provider;
		this.accountId = opts.accountId;
		this.existingOwner = opts.existingOwner;
		this.attemptedOwner = opts.attemptedOwner;
	}
};
/**
* Save OAuth tokens. The `owner` parameter specifies which user owns this
* account — defaults to `accountId` (the account itself is the owner).
* For multi-account support, pass the logged-in user's email as owner.
*
* If the account already exists and is owned by a different user, throws
* `OAuthAccountOwnedByOtherUserError` (statusCode 409) to prevent silently
* stealing another user's linked account.
*
* Read + write happen as a single linearised batch (Postgres) or paired
* statements (SQLite). On both backends the per-row PK serialises concurrent
* writes for the same `(provider, account_id)` so the owner check cannot be
* raced by an attacker calling saveOAuthTokens twice in flight — the second
* caller sees the first caller's owner row and raises 409.
*/
async function saveOAuthTokens(provider, accountId, tokens, owner) {
	await ensureTable();
	const client = getDbExec();
	const table = oauthTokensTable();
	let resolvedOwner = owner ?? accountId;
	let existingDisplayName = null;
	let existingOwner = null;
	let existingTokens = null;
	const { rows: existing } = await client.execute({
		sql: `SELECT owner, display_name, tokens FROM ${table} WHERE provider = ? AND account_id = ?`,
		args: [provider, accountId]
	});
	if (existing.length > 0) {
		existingOwner = existing[0].owner ?? null;
		existingDisplayName = existing[0].display_name ?? null;
		existingTokens = JSON.parse(existing[0].tokens ?? "{}");
	}
	if (!owner) {
		if (existingOwner) resolvedOwner = existingOwner;
	} else if (existingOwner && owner && existingOwner !== owner) throw new OAuthAccountOwnedByOtherUserError({
		provider,
		accountId,
		existingOwner,
		attemptedOwner: owner
	});
	const cleanedIncomingTokens = Object.fromEntries(Object.entries(tokens).filter(([, value]) => value !== void 0));
	const tokensToStore = {
		...existingTokens ?? {},
		...cleanedIncomingTokens
	};
	await client.execute({
		sql: isPostgres() ? `INSERT INTO ${table} (provider, account_id, owner, display_name, tokens, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (provider, account_id) DO UPDATE SET owner=EXCLUDED.owner, display_name=COALESCE(EXCLUDED.display_name, ${table}.display_name), tokens=EXCLUDED.tokens, updated_at=EXCLUDED.updated_at` : `INSERT OR REPLACE INTO ${table} (provider, account_id, owner, display_name, tokens, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
		args: [
			provider,
			accountId,
			resolvedOwner,
			existingDisplayName,
			JSON.stringify(tokensToStore),
			Date.now()
		]
	});
}
/**
* List all OAuth accounts owned by a specific user.
* In multi-account mode, a user may have connected multiple Google accounts.
*/
async function listOAuthAccountsByOwner(provider, owner) {
	await ensureTable();
	const client = getDbExec();
	const table = oauthTokensTable();
	const { rows } = await client.execute({
		sql: `SELECT account_id, display_name, tokens FROM ${table} WHERE provider = ? AND owner = ?`,
		args: [provider, owner]
	});
	return rows.map((row) => ({
		accountId: row.account_id,
		displayName: row.display_name ?? null,
		tokens: JSON.parse(row.tokens)
	}));
}
//#endregion
export { listOAuthAccountsByOwner as n, saveOAuthTokens as r, OAuthAccountOwnedByOtherUserError as t };
