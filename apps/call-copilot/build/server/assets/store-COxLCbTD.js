import { i as getDbExec, o as intType, s as isConnectionError, u as isPostgres } from "./client-BpA2t7pN.js";
import { n as emitAppStateDelete, t as emitAppStateChange } from "./emitter-CxJAOR4f.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/application-state/store.js
var _initPromise;
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		await getDbExec().execute(`
        CREATE TABLE IF NOT EXISTS application_state (
          session_id TEXT NOT NULL,
          key TEXT NOT NULL,
          value TEXT NOT NULL,
          updated_at ${intType()} NOT NULL,
          PRIMARY KEY (session_id, key)
        )
      `);
	})();
	return _initPromise;
}
async function appStateGet(sessionId, key) {
	try {
		await ensureTable();
		const { rows } = await getDbExec().execute({
			sql: `SELECT value FROM application_state WHERE session_id = ? AND key = ?`,
			args: [sessionId, key]
		});
		if (rows.length === 0) return null;
		return JSON.parse(rows[0].value);
	} catch (err) {
		if (isConnectionError(err)) return null;
		throw err;
	}
}
async function appStatePut(sessionId, key, value, options) {
	await ensureTable();
	await getDbExec().execute({
		sql: isPostgres() ? `INSERT INTO application_state (session_id, key, value, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT (session_id, key) DO UPDATE SET value=EXCLUDED.value, updated_at=EXCLUDED.updated_at` : `INSERT OR REPLACE INTO application_state (session_id, key, value, updated_at) VALUES (?, ?, ?, ?)`,
		args: [
			sessionId,
			key,
			JSON.stringify(value),
			Date.now()
		]
	});
	emitAppStateChange(key, options?.requestSource, sessionId);
}
async function appStateDelete(sessionId, key, options) {
	await ensureTable();
	const deleted = (await getDbExec().execute({
		sql: `DELETE FROM application_state WHERE session_id = ? AND key = ?`,
		args: [sessionId, key]
	})).rowsAffected > 0;
	if (deleted) emitAppStateDelete(key, options?.requestSource, sessionId);
	return deleted;
}
async function appStateList(sessionId, keyPrefix) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT key, value FROM application_state WHERE session_id = ? AND key LIKE ?`,
		args: [sessionId, keyPrefix + "%"]
	});
	return rows.map((row) => ({
		key: row.key,
		value: JSON.parse(row.value)
	}));
}
async function appStateDeleteByPrefix(sessionId, keyPrefix, options) {
	await ensureTable();
	const client = getDbExec();
	const { rows } = await client.execute({
		sql: `SELECT key FROM application_state WHERE session_id = ? AND key LIKE ?`,
		args: [sessionId, keyPrefix + "%"]
	});
	if (rows.length === 0) return 0;
	const result = await client.execute({
		sql: `DELETE FROM application_state WHERE session_id = ? AND key LIKE ?`,
		args: [sessionId, keyPrefix + "%"]
	});
	for (const row of rows) emitAppStateDelete(row.key, options?.requestSource, sessionId);
	return result.rowsAffected;
}
//#endregion
export { appStatePut as a, appStateList as i, appStateDeleteByPrefix as n, appStateGet as r, appStateDelete as t };
