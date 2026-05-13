import { o as __toESM, r as __exportAll } from "./chunk-D3zDcpJC.js";
import path from "path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/db/client.js
/**
* Central database client abstraction.
*
* Detects the database backend from the environment (D1, Postgres, or SQLite/libsql)
* and returns a unified `DbExec` interface that all core stores use.
*
* Imports for postgres, better-sqlite3, and @libsql/client/web are lazy
* (dynamic import) so this module can be loaded in any runtime (Node.js,
* Cloudflare Workers, edge) without failing on missing native deps.
*/
var client_exports = /* @__PURE__ */ __exportAll({
	getDatabaseAuthToken: () => getDatabaseAuthToken,
	getDatabaseUrl: () => getDatabaseUrl,
	getDbExec: () => getDbExec,
	getDialect: () => getDialect,
	intType: () => intType,
	isConnectionError: () => isConnectionError,
	isLocalDatabase: () => isLocalDatabase,
	isLocalSqliteUrl: () => isLocalSqliteUrl,
	isPostgres: () => isPostgres,
	isUniqueViolation: () => isUniqueViolation,
	prepareLocalSqliteUrl: () => prepareLocalSqliteUrl,
	retryOnConnectionError: () => retryOnConnectionError,
	retryOnDdlRace: () => retryOnDdlRace,
	retrySqliteBusy: () => retrySqliteBusy,
	safeJsonParse: () => safeJsonParse,
	sqliteFilenameFromUrl: () => sqliteFilenameFromUrl
});
/**
* Resolve the database URL for the current app.
*
* Checks for `<APP_NAME>_DATABASE_URL` first (e.g. `MAIL_DATABASE_URL`),
* then falls back to `DATABASE_URL`. This allows multiple apps to run in the
* same process group (e.g. `dev:all` or builder.io) with separate databases.
*
* Set `APP_NAME=mail` in the child process env and
* `MAIL_DATABASE_URL=postgres://...` in the shared env.
*/
function getDatabaseUrl(fallback = "") {
	const appName = process.env.APP_NAME?.toUpperCase().replace(/-/g, "_");
	if (appName) {
		const prefixed = process.env[`${appName}_DATABASE_URL`];
		if (prefixed) return prefixed;
	}
	return process.env.DATABASE_URL || fallback;
}
/** Same per-app resolution for DATABASE_AUTH_TOKEN (used by Turso/libsql). */
function getDatabaseAuthToken() {
	const appName = process.env.APP_NAME?.toUpperCase().replace(/-/g, "_");
	if (appName) {
		const prefixed = process.env[`${appName}_DATABASE_AUTH_TOKEN`];
		if (prefixed) return prefixed;
	}
	return process.env.DATABASE_AUTH_TOKEN;
}
function isLocalSqliteUrl(url) {
	return url === "" || url.startsWith("file:") || !url.includes("://");
}
async function prepareLocalSqliteUrl(url) {
	if (!url.startsWith("file:")) return url;
	const isServerless = !!process.env.NETLIFY || !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.LAMBDA_TASK_ROOT;
	try {
		const fs = await import("fs");
		if (isServerless && url === "file:./data/app.db") {
			fs.mkdirSync("/tmp/data", { recursive: true });
			return "file:///tmp/data/app.db";
		}
		fs.mkdirSync(path.join(process.cwd(), "data"), { recursive: true });
	} catch {}
	return url;
}
function sqliteFilenameFromUrl(url) {
	if (url.startsWith("file://")) return decodeURIComponent(new URL(url).pathname);
	if (url.startsWith("file:")) return url.slice(5) || ":memory:";
	return url || "./data/app.db";
}
/**
* Parse a JSON-serialized column value defensively. A malformed row — from a
* hand-edit, dirty migration, or a misbehaving agent that wrote raw SQL —
* must not break an entire list endpoint. Callers supply a fallback for the
* malformed path; null/undefined values also fall back.
*/
function safeJsonParse(value, fallback) {
	if (value == null) return fallback;
	try {
		return JSON.parse(String(value));
	} catch {
		return fallback;
	}
}
/**
* Retry an async operation when it fails with SQLITE_BUSY.
* Used during WAL initialization and migrations where a stale WAL from a
* previous crash or HMR restart can briefly lock the database.
*/
async function retrySqliteBusy(fn, opts = {}) {
	const { maxAttempts = 5, baseDelayMs = 500, rethrow = false } = opts;
	let last;
	for (let attempt = 0; attempt < maxAttempts; attempt++) try {
		return await fn();
	} catch (e) {
		last = e;
		if (String(e?.message || e).includes("SQLITE_BUSY") && attempt < maxAttempts - 1) await new Promise((r) => setTimeout(r, baseDelayMs * (attempt + 1)));
		else break;
	}
	if (rethrow) throw last;
}
/**
* Retry a DDL statement (CREATE TABLE, CREATE INDEX) once when it fails due
* to a Postgres pg_catalog race.
*
* Postgres's `IF NOT EXISTS` check is NOT atomic with the `pg_type` /
* `pg_class` catalog insert. When multiple processes boot concurrently and
* issue the same CREATE, both can pass the existence check and one fails
* with code 23505 on `pg_type_typname_nsp_index` or similar. The table does
* end up created by the winner, so rerunning the same `IF NOT EXISTS`
* statement is a safe no-op.
*/
async function retryOnDdlRace(fn) {
	try {
		return await fn();
	} catch (e) {
		if (!isPgCatalogRace(e)) throw e;
		return await fn();
	}
}
function isPgCatalogRace(e) {
	if (e?.code === "42P07") return true;
	if (e?.code !== "23505") return false;
	const constraint = String(e?.constraint_name ?? e?.constraint ?? "");
	const detail = String(e?.detail ?? "");
	const msg = String(e?.message ?? "");
	return constraint.startsWith("pg_type") || constraint.startsWith("pg_class") || detail.includes("pg_type") || detail.includes("pg_class") || /relation .* already exists/i.test(msg);
}
/**
* True when `e` is a UNIQUE / PRIMARY KEY constraint violation from any
* supported driver (Postgres 23505, SQLite SQLITE_CONSTRAINT_PRIMARYKEY /
* _UNIQUE, D1). Used by stores that accept caller-provided ids and want to
* surface a clean "already exists" error instead of the raw SQL text.
*/
function isUniqueViolation(e) {
	if (e?.code === "23505") return true;
	const code = String(e?.code ?? "");
	if (code === "SQLITE_CONSTRAINT_PRIMARYKEY" || code === "SQLITE_CONSTRAINT_UNIQUE") return true;
	const msg = String(e?.message ?? "").toLowerCase();
	return msg.includes("unique constraint") || msg.includes("primary key constraint") || msg.includes("duplicate key");
}
var _dialect;
function getDialect() {
	if (_dialect !== void 0) return _dialect;
	const url = getDatabaseUrl();
	if (url.startsWith("postgres://") || url.startsWith("postgresql://")) {
		_dialect = "postgres";
		return _dialect;
	}
	if (url && !url.startsWith("file:")) {
		_dialect = "sqlite";
		return _dialect;
	}
	if (globalThis.__cf_env?.DB) {
		_dialect = "d1";
		return _dialect;
	}
	return "sqlite";
}
function isPostgres() {
	return getDialect() === "postgres";
}
function dialectForConfig(config) {
	const url = config.url ?? "";
	if (url.startsWith("postgres://") || url.startsWith("postgresql://")) return "postgres";
	if (url && !url.startsWith("file:")) return "sqlite";
	if (config.d1Binding) return "d1";
	return "sqlite";
}
/**
* Returns true when the database is a local-only SQLite file (or unset, which
* defaults to a local SQLite file). Returns false for Postgres, remote libsql
* (Turso), and D1 — any backend that could be shared across developers.
*
* Used to gate local@localhost mode: that mode uses a single shared virtual
* user with no per-machine scoping, so on any shared database two developers
* would read and write each other's settings, oauth tokens, and app state.
*/
function isLocalDatabase() {
	if (getDialect() !== "sqlite") return false;
	const url = getDatabaseUrl();
	return url === "" || url.startsWith("file:");
}
/** Returns BIGINT for Postgres (64-bit), INTEGER for SQLite (already 64-bit). */
function intType() {
	return isPostgres() ? "BIGINT" : "INTEGER";
}
function sqliteToPostgresParams(sql) {
	let i = 0;
	return sql.replace(/\?/g, () => `$${++i}`);
}
/** Error codes that indicate a dead/stale connection we can safely retry. */
var CONNECTION_ERROR_CODES = new Set([
	"ECONNRESET",
	"ETIMEDOUT",
	"EPIPE",
	"ENOTFOUND",
	"CONNECTION_ENDED",
	"CONNECTION_DESTROYED",
	"CONNECTION_CLOSED"
]);
function isConnectionError(err) {
	if (!err) return false;
	const code = err.code || err.cause?.code;
	if (code && CONNECTION_ERROR_CODES.has(code)) return true;
	if ((err.name || err.cause?.name || "") === "ErrorEvent") return true;
	const stack = String(err.stack || err.cause?.stack || "");
	if (/WebSocket\.#onSocketClose|failWebsocketConnection|onSocketClose/.test(stack)) return true;
	const msg = String(err.message || err.cause?.message || "");
	return /ECONNRESET|ETIMEDOUT|EPIPE|connection.*(closed|ended|terminated)|socket hang up|websocket/i.test(msg);
}
async function retryOnConnectionError(fn, maxAttempts = 3) {
	let last;
	for (let attempt = 0; attempt < maxAttempts; attempt++) try {
		return await fn();
	} catch (e) {
		last = e;
		if (!isConnectionError(e) || attempt === maxAttempts - 1) throw e;
		await new Promise((r) => setTimeout(r, 100 * (attempt + 1)));
	}
	throw last;
}
var _exec;
var _initPromise;
async function createDbExecInternal(config = {}, trackSingletonResources = false) {
	const dialect = dialectForConfig(config);
	if (dialect === "d1") {
		const d1 = config.d1Binding;
		return { async execute(sql) {
			if (typeof sql === "string") {
				const r = await d1.prepare(sql).all();
				return {
					rows: r.results || [],
					rowsAffected: r.meta?.changes ?? 0
				};
			}
			const r = await d1.prepare(sql.sql).bind(...sql.args).all();
			return {
				rows: r.results || [],
				rowsAffected: r.meta?.changes ?? 0
			};
		} };
	}
	let url = config.url || "file:./data/app.db";
	if (dialect === "postgres") {
		const { isNeonUrl } = await import("./create-get-db-vUEx2Dku.js");
		if (isNeonUrl(url)) {
			const { Pool } = await import("./serverless-50pr2Kt1.js").then((n) => n.i);
			const pool = new Pool({ connectionString: url });
			pool.on("error", (err) => {
				console.warn("[db/neon] pool error (will reconnect on next query):", err instanceof Error ? err.message : err);
			});
			if (trackSingletonResources);
			return { async execute(sql) {
				const rawSql = typeof sql === "string" ? sql : sql.sql;
				const args = typeof sql === "string" ? [] : sql.args || [];
				const pgSql = sqliteToPostgresParams(rawSql);
				const result = await retryOnConnectionError(() => pool.query(pgSql, args));
				return {
					rows: result.rows,
					rowsAffected: result.rowCount ?? 0
				};
			} };
		}
		const { default: postgres } = await import("./src-DU9OR977.js").then((n) => n.n);
		if ("__cf_env" in globalThis || typeof navigator !== "undefined" && navigator.userAgent === "Cloudflare-Workers") return { async execute(sql) {
			const conn = postgres(url, {
				max: 1,
				idle_timeout: 0,
				onnotice: () => {}
			});
			try {
				const rawSql = typeof sql === "string" ? sql : sql.sql;
				const args = typeof sql === "string" ? [] : sql.args || [];
				const pgSql = sqliteToPostgresParams(rawSql);
				const result = await conn.unsafe(pgSql, args);
				return {
					rows: Array.from(result),
					rowsAffected: result.count ?? 0
				};
			} finally {
				await conn.end();
			}
		} };
		else {
			const pool = postgres(url, {
				onnotice: () => {},
				idle_timeout: 240,
				max_lifetime: 1800,
				connect_timeout: 10,
				...url.includes("supabase") ? { prepare: false } : {}
			});
			if (trackSingletonResources);
			return { async execute(sql) {
				const rawSql = typeof sql === "string" ? sql : sql.sql;
				const args = typeof sql === "string" ? [] : sql.args || [];
				const pgSql = sqliteToPostgresParams(rawSql);
				const result = await retryOnConnectionError(() => pool.unsafe(pgSql, args));
				return {
					rows: Array.from(result),
					rowsAffected: result.count ?? 0
				};
			} };
		}
	}
	if (isLocalSqliteUrl(url)) {
		url = await prepareLocalSqliteUrl(url.startsWith("file:") ? url : `file:${url}`);
		const { default: Database } = await import("./lib-DwyTVYOd.js").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
		const sqlite = new Database(sqliteFilenameFromUrl(url));
		sqlite.pragma("busy_timeout = 10000");
		sqlite.pragma("journal_mode = WAL");
		if (trackSingletonResources);
		return { async execute(sql) {
			const rawSql = typeof sql === "string" ? sql : sql.sql;
			const args = typeof sql === "string" ? [] : sql.args || [];
			const stmt = sqlite.prepare(rawSql);
			if (stmt.reader) return {
				rows: stmt.all(...args),
				rowsAffected: 0
			};
			return {
				rows: [],
				rowsAffected: stmt.run(...args).changes ?? 0
			};
		} };
	}
	const { createClient } = await import("./web-qjdAXe-X.js");
	const client = createClient({
		url,
		authToken: config.authToken
	});
	return { async execute(sql) {
		if (typeof sql === "string") {
			const r = await client.execute(sql);
			return {
				rows: r.rows,
				rowsAffected: r.rowsAffected
			};
		}
		const r = await client.execute({
			sql: sql.sql,
			args: sql.args
		});
		return {
			rows: r.rows,
			rowsAffected: r.rowsAffected
		};
	} };
}
async function initClient() {
	if (_exec) return;
	const dialect = getDialect();
	_exec = await createDbExecInternal({
		url: getDatabaseUrl("file:./data/app.db"),
		authToken: getDatabaseAuthToken(),
		d1Binding: dialect === "d1" ? globalThis.__cf_env?.DB : void 0
	}, true);
}
/**
* Get the singleton database client. Returns a `DbExec` whose first
* `execute()` call lazily initializes the underlying driver.
*/
function getDbExec() {
	if (_exec) return _exec;
	function sanitize(sql) {
		if (typeof sql === "object" && sql.args) return {
			...sql,
			args: sql.args.map((a) => a ?? null)
		};
		return sql;
	}
	const proxy = { async execute(sql) {
		if (!_initPromise) _initPromise = initClient();
		await _initPromise;
		Object.assign(proxy, { execute: (s) => _exec.execute(sanitize(s)) });
		return _exec.execute(sanitize(sql));
	} };
	return proxy;
}
//#endregion
export { getDialect as a, isLocalDatabase as c, isUniqueViolation as d, prepareLocalSqliteUrl as f, sqliteFilenameFromUrl as g, safeJsonParse as h, getDbExec as i, isLocalSqliteUrl as l, retrySqliteBusy as m, getDatabaseAuthToken as n, intType as o, retryOnDdlRace as p, getDatabaseUrl as r, isConnectionError as s, client_exports as t, isPostgres as u };
