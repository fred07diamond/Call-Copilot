import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { a as getDialect, f as prepareLocalSqliteUrl, g as sqliteFilenameFromUrl, l as isLocalSqliteUrl, n as getDatabaseAuthToken, r as getDatabaseUrl } from "./client-BnpqLOqs.js";
import { l as sql, o as fillPlaceholders, w as entityKind } from "./sql-D8aUs1Ib.js";
import { c as createTableRelationsHelpers, l as extractTablesRelationalConfig, n as NoopLogger, r as NoopCache, t as DefaultLogger } from "./logger-yx1C2mqD.js";
import { S as mapResultRow } from "./table-C1uGOHxK.js";
import { a as SQLiteAsyncDialect, i as BaseSQLiteDatabase, n as SQLiteSession, r as SQLiteTransaction, t as SQLitePreparedQuery } from "./session-PWByxfNY.js";
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/d1/session.js
var SQLiteD1Session = class extends SQLiteSession {
	constructor(client, dialect, schema, options = {}) {
		super(dialect);
		this.client = client;
		this.schema = schema;
		this.options = options;
		this.logger = options.logger ?? new NoopLogger();
		this.cache = options.cache ?? new NoopCache();
	}
	static [entityKind] = "SQLiteD1Session";
	logger;
	cache;
	prepareQuery(query, fields, executeMethod, isResponseInArrayMode, customResultMapper, queryMetadata, cacheConfig) {
		return new D1PreparedQuery(this.client.prepare(query.sql), query, this.logger, this.cache, queryMetadata, cacheConfig, fields, executeMethod, isResponseInArrayMode, customResultMapper);
	}
	async batch(queries) {
		const preparedQueries = [];
		const builtQueries = [];
		for (const query of queries) {
			const preparedQuery = query._prepare();
			const builtQuery = preparedQuery.getQuery();
			preparedQueries.push(preparedQuery);
			if (builtQuery.params.length > 0) builtQueries.push(preparedQuery.stmt.bind(...builtQuery.params));
			else {
				const builtQuery2 = preparedQuery.getQuery();
				builtQueries.push(this.client.prepare(builtQuery2.sql).bind(...builtQuery2.params));
			}
		}
		return (await this.client.batch(builtQueries)).map((result, i) => preparedQueries[i].mapResult(result, true));
	}
	extractRawAllValueFromBatchResult(result) {
		return result.results;
	}
	extractRawGetValueFromBatchResult(result) {
		return result.results[0];
	}
	extractRawValuesValueFromBatchResult(result) {
		return d1ToRawMapping(result.results);
	}
	async transaction(transaction, config) {
		const tx = new D1Transaction("async", this.dialect, this, this.schema);
		await this.run(sql.raw(`begin${config?.behavior ? " " + config.behavior : ""}`));
		try {
			const result = await transaction(tx);
			await this.run(sql`commit`);
			return result;
		} catch (err) {
			await this.run(sql`rollback`);
			throw err;
		}
	}
};
var D1Transaction = class D1Transaction extends SQLiteTransaction {
	static [entityKind] = "D1Transaction";
	async transaction(transaction) {
		const savepointName = `sp${this.nestedIndex}`;
		const tx = new D1Transaction("async", this.dialect, this.session, this.schema, this.nestedIndex + 1);
		await this.session.run(sql.raw(`savepoint ${savepointName}`));
		try {
			const result = await transaction(tx);
			await this.session.run(sql.raw(`release savepoint ${savepointName}`));
			return result;
		} catch (err) {
			await this.session.run(sql.raw(`rollback to savepoint ${savepointName}`));
			throw err;
		}
	}
};
function d1ToRawMapping(results) {
	const rows = [];
	for (const row of results) {
		const entry = Object.keys(row).map((k) => row[k]);
		rows.push(entry);
	}
	return rows;
}
var D1PreparedQuery = class extends SQLitePreparedQuery {
	constructor(stmt, query, logger, cache, queryMetadata, cacheConfig, fields, executeMethod, _isResponseInArrayMode, customResultMapper) {
		super("async", executeMethod, query, cache, queryMetadata, cacheConfig);
		this.logger = logger;
		this._isResponseInArrayMode = _isResponseInArrayMode;
		this.customResultMapper = customResultMapper;
		this.fields = fields;
		this.stmt = stmt;
	}
	static [entityKind] = "D1PreparedQuery";
	/** @internal */
	customResultMapper;
	/** @internal */
	fields;
	/** @internal */
	stmt;
	async run(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return this.stmt.bind(...params).run();
		});
	}
	async all(placeholderValues) {
		const { fields, query, logger, stmt, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return stmt.bind(...params).all().then(({ results }) => this.mapAllResult(results));
			});
		}
		const rows = await this.values(placeholderValues);
		return this.mapAllResult(rows);
	}
	mapAllResult(rows, isFromBatch) {
		if (isFromBatch) rows = d1ToRawMapping(rows.results);
		if (!this.fields && !this.customResultMapper) return rows;
		if (this.customResultMapper) return this.customResultMapper(rows);
		return rows.map((row) => mapResultRow(this.fields, row, this.joinsNotNullableMap));
	}
	async get(placeholderValues) {
		const { fields, joinsNotNullableMap, query, logger, stmt, customResultMapper } = this;
		if (!fields && !customResultMapper) {
			const params = fillPlaceholders(query.params, placeholderValues ?? {});
			logger.logQuery(query.sql, params);
			return await this.queryWithCache(query.sql, params, async () => {
				return stmt.bind(...params).all().then(({ results }) => results[0]);
			});
		}
		const rows = await this.values(placeholderValues);
		if (!rows[0]) return;
		if (customResultMapper) return customResultMapper(rows);
		return mapResultRow(fields, rows[0], joinsNotNullableMap);
	}
	mapGetResult(result, isFromBatch) {
		if (isFromBatch) result = d1ToRawMapping(result.results)[0];
		if (!this.fields && !this.customResultMapper) return result;
		if (this.customResultMapper) return this.customResultMapper([result]);
		return mapResultRow(this.fields, result, this.joinsNotNullableMap);
	}
	async values(placeholderValues) {
		const params = fillPlaceholders(this.query.params, placeholderValues ?? {});
		this.logger.logQuery(this.query.sql, params);
		return await this.queryWithCache(this.query.sql, params, async () => {
			return this.stmt.bind(...params).raw();
		});
	}
	/** @internal */
	isResponseInArrayMode() {
		return this._isResponseInArrayMode;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/d1/driver.js
var DrizzleD1Database = class extends BaseSQLiteDatabase {
	static [entityKind] = "D1Database";
	async batch(batch) {
		return this.session.batch(batch);
	}
};
function drizzle(client, config = {}) {
	const dialect = new SQLiteAsyncDialect({ casing: config.casing });
	let logger;
	if (config.logger === true) logger = new DefaultLogger();
	else if (config.logger !== false) logger = config.logger;
	let schema;
	if (config.schema) {
		const tablesConfig = extractTablesRelationalConfig(config.schema, createTableRelationsHelpers);
		schema = {
			fullSchema: config.schema,
			schema: tablesConfig.tables,
			tableNamesMap: tablesConfig.tableNamesMap
		};
	}
	const db = new DrizzleD1Database("async", dialect, new SQLiteD1Session(client, dialect, schema, {
		logger,
		cache: config.cache
	}), schema);
	db.$client = client;
	db.$cache = config.cache;
	if (db.$cache) db.$cache["invalidate"] = config.cache?.onMutate;
	return db;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/db/create-get-db.js
var _pgDrizzle;
function getPgDrizzle() {
	if (!_pgDrizzle) _pgDrizzle = Promise.all([import("./postgres-js-Makk47v8.js"), import("./src-DU9OR977.js").then((n) => n.n)]).then(([drizzleMod, pgMod]) => ({
		drizzle: drizzleMod.drizzle,
		postgres: pgMod.default
	}));
	return _pgDrizzle;
}
var _neonServerlessDrizzle;
function getNeonServerlessDrizzle() {
	if (!_neonServerlessDrizzle) _neonServerlessDrizzle = Promise.all([import("./neon-serverless-CbaqDqeo.js"), import("./serverless-50pr2Kt1.js").then((n) => n.i)]).then(([drizzleMod, neonMod]) => ({
		drizzle: drizzleMod.drizzle,
		Pool: neonMod.Pool
	}));
	return _neonServerlessDrizzle;
}
/**
* Neon's pooler endpoints cold-start in 5–10s. Serverless environments
* (Netlify Functions, Vercel Edge, CF Workers) have short cold-start
* budgets of their own, and `postgres-js` opens a raw TCP connection on
* port 5432 that can't negotiate around Neon's wake-up window — every
* request after an idle period 502s. `@neondatabase/serverless` rides
* over WebSockets (HTTP/443 upgrade) and handles Neon wake-up
* transparently, supports transactions, and works in every serverless
* runtime we deploy to, so we prefer it whenever the URL points at Neon.
*/
function isNeonUrl(url) {
	return /\.neon\.tech([:/?]|$)/.test(url);
}
var _libsqlWebDrizzle;
function getLibsqlWebDrizzle() {
	if (!_libsqlWebDrizzle) _libsqlWebDrizzle = import("./web-DkmbpgiR.js").then((mod) => ({ drizzle: mod.drizzle }));
	return _libsqlWebDrizzle;
}
var _betterSqliteDrizzle;
function getBetterSqliteDrizzle() {
	if (!_betterSqliteDrizzle) _betterSqliteDrizzle = Promise.all([import("./better-sqlite3-BkKbVhGo.js"), import("./lib-DwyTVYOd.js").then((n) => /* @__PURE__ */ __toESM(n.t(), 1))]).then(([drizzleMod, sqliteMod]) => ({
		drizzle: drizzleMod.drizzle,
		Database: sqliteMod.default
	}));
	return _betterSqliteDrizzle;
}
function createGetDb(schema) {
	let _db;
	let _dbReady;
	function startInit() {
		if (_dbReady) return _dbReady;
		const url = getDatabaseUrl("file:./data/app.db");
		const dialect = getDialect();
		if (dialect === "d1") {
			const d1 = globalThis.__cf_env?.DB;
			if (d1) {
				_db = drizzle(d1, { schema });
				_dbReady = Promise.resolve(_db);
				return _dbReady;
			}
		}
		if (dialect === "postgres") if (isNeonUrl(url)) _dbReady = getNeonServerlessDrizzle().then(({ drizzle, Pool }) => {
			const pool = new Pool({ connectionString: url });
			pool.on("error", (err) => {
				console.warn("[db/neon] pool error (will reconnect on next query):", err instanceof Error ? err.message : err);
			});
			_db = drizzle(pool, { schema });
		});
		else _dbReady = getPgDrizzle().then(({ drizzle, postgres }) => {
			_db = drizzle(postgres(url, {
				onnotice: () => {},
				idle_timeout: 240,
				max_lifetime: 1800,
				connect_timeout: 10,
				...url.includes("supabase") ? { prepare: false } : {}
			}), { schema });
		});
		else if (isLocalSqliteUrl(url)) _dbReady = Promise.all([prepareLocalSqliteUrl(url.startsWith("file:") ? url : `file:${url}`), getBetterSqliteDrizzle()]).then(([sqliteUrl, { drizzle, Database }]) => {
			const sqlite = new Database(sqliteFilenameFromUrl(sqliteUrl));
			sqlite.pragma("journal_mode = WAL");
			_db = drizzle(sqlite, { schema });
		});
		else _dbReady = getLibsqlWebDrizzle().then(({ drizzle }) => {
			_db = drizzle({
				connection: {
					url,
					authToken: getDatabaseAuthToken()
				},
				schema
			});
		});
		return _dbReady;
	}
	/**
	* Create a lazy proxy that records property accesses and method calls,
	* then replays them on the real DB once init completes. Supports
	* Drizzle's chained API: db.select().from(table).where(...).
	*
	* When `.then()` is called (i.e. the chain is awaited), the proxy
	* awaits _dbReady and replays the recorded chain on the real _db.
	*/
	function createLazyProxy(ready, chain) {
		return new Proxy(function() {}, {
			get(_target, prop) {
				if (prop === "then" || prop === "catch" || prop === "finally") {
					const promise = ready.then(() => {
						let result = _db;
						for (const step of chain) {
							const val = result[step.prop];
							result = typeof val === "function" ? val.apply(result, step.args) : val;
						}
						return result;
					});
					return promise[prop].bind(promise);
				}
				return createLazyProxy(ready, [...chain, { prop }]);
			},
			apply(_target, _thisArg, args) {
				if (chain.length === 0) return createLazyProxy(ready, []);
				const last = chain[chain.length - 1];
				const newChain = chain.slice(0, -1);
				newChain.push({
					prop: last.prop,
					args
				});
				return createLazyProxy(ready, newChain);
			}
		});
	}
	/**
	* Get the Drizzle DB instance. Kicks off lazy init on first call.
	* If the async init hasn't completed yet, returns a lazy Proxy that
	* records the Drizzle chain (select/from/where/etc.) and replays it
	* once the DB driver finishes loading. Since callers always `await`
	* the final result, the proxy is transparent.
	*/
	function getDb() {
		if (_db) return _db;
		startInit();
		if (_db) return _db;
		return createLazyProxy(_dbReady, []);
	}
	return getDb;
}
//#endregion
export { isNeonUrl as n, createGetDb as t };
