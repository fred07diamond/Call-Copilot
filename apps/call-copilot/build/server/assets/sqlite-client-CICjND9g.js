import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { f as prepareLocalSqliteUrl, g as sqliteFilenameFromUrl, l as isLocalSqliteUrl, n as getDatabaseAuthToken } from "./client-BpA2t7pN.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/db/sqlite-client.js
function sqliteRowsToLibsqlShape(rows) {
	const records = rows;
	const columns = records.length > 0 ? Object.keys(records[0]) : [];
	return {
		rows: records.map((row) => {
			const values = columns.map((column) => row[column]);
			return Object.assign(values, row);
		}),
		columns
	};
}
async function createSqliteScriptClient(url) {
	if (isLocalSqliteUrl(url)) {
		const sqliteUrl = await prepareLocalSqliteUrl(url.startsWith("file:") ? url : `file:${url}`);
		const { default: Database } = await import("./lib-DwyTVYOd.js").then((n) => /* @__PURE__ */ __toESM(n.t(), 1));
		const sqlite = new Database(sqliteFilenameFromUrl(sqliteUrl));
		sqlite.pragma("busy_timeout = 10000");
		sqlite.pragma("journal_mode = WAL");
		return {
			async execute(stmtOrSql) {
				const sql = typeof stmtOrSql === "string" ? stmtOrSql : stmtOrSql.sql;
				const args = typeof stmtOrSql === "string" ? [] : stmtOrSql.args ?? [];
				const stmt = sqlite.prepare(sql);
				if (stmt.reader) return {
					...sqliteRowsToLibsqlShape(stmt.all(...args)),
					rowsAffected: 0
				};
				const result = stmt.run(...args);
				return {
					rows: [],
					columns: [],
					rowsAffected: result.changes ?? 0,
					lastInsertRowid: result.lastInsertRowid
				};
			},
			close() {
				sqlite.close();
			}
		};
	}
	const { createClient } = await import("./web-qjdAXe-X.js");
	return createClient({
		url,
		authToken: getDatabaseAuthToken()
	});
}
//#endregion
export { createSqliteScriptClient as t };
