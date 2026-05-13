import { i as getDbExec, o as intType, u as isPostgres } from "./client-BpA2t7pN.js";
import { EventEmitter } from "events";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/settings/store.js
var _initPromise;
var _emitter = new EventEmitter();
function getSettingsEmitter() {
	return _emitter;
}
function settingsTable() {
	return isPostgres() ? "public.settings" : "settings";
}
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		const table = settingsTable();
		await client.execute(`
        CREATE TABLE IF NOT EXISTS ${table} (
          key TEXT PRIMARY KEY,
          value TEXT NOT NULL,
          updated_at ${intType()} NOT NULL
        )
      `);
	})();
	return _initPromise;
}
async function getSetting(key) {
	await ensureTable();
	const client = getDbExec();
	const table = settingsTable();
	const { rows } = await client.execute({
		sql: `SELECT value FROM ${table} WHERE key = ?`,
		args: [key]
	});
	if (rows.length === 0) return null;
	return JSON.parse(rows[0].value);
}
async function putSetting(key, value, options) {
	await ensureTable();
	const client = getDbExec();
	const table = settingsTable();
	await client.execute({
		sql: isPostgres() ? `INSERT INTO ${table} (key, value, updated_at) VALUES (?, ?, ?) ON CONFLICT (key) DO UPDATE SET value=EXCLUDED.value, updated_at=EXCLUDED.updated_at` : `INSERT OR REPLACE INTO ${table} (key, value, updated_at) VALUES (?, ?, ?)`,
		args: [
			key,
			JSON.stringify(value),
			Date.now()
		]
	});
	_emitter.emit("settings", {
		source: "settings",
		type: "change",
		key,
		...options?.requestSource && { requestSource: options.requestSource }
	});
}
async function deleteSetting(key, options) {
	await ensureTable();
	const client = getDbExec();
	const table = settingsTable();
	if ((await client.execute({
		sql: `DELETE FROM ${table} WHERE key = ?`,
		args: [key]
	})).rowsAffected > 0) {
		_emitter.emit("settings", {
			source: "settings",
			type: "delete",
			key,
			...options?.requestSource && { requestSource: options.requestSource }
		});
		return true;
	}
	return false;
}
async function getAllSettings() {
	await ensureTable();
	const client = getDbExec();
	const table = settingsTable();
	const { rows } = await client.execute(`SELECT key, value FROM ${table}`);
	const result = {};
	for (const row of rows) result[row.key] = JSON.parse(row.value);
	return result;
}
//#endregion
export { putSetting as a, getSettingsEmitter as i, getAllSettings as n, getSetting as r, deleteSetting as t };
