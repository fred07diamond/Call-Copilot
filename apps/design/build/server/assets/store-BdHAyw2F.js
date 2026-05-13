import { d as isUniqueViolation, h as safeJsonParse, i as getDbExec, o as intType, p as retryOnDdlRace } from "./client-BnpqLOqs.js";
import { o as recordChange } from "./poll-DRDmfDG6.js";
import { randomUUID } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/progress/store.js
function bumpPoll(owner) {
	recordChange({
		source: "runs",
		type: "change",
		key: owner
	});
}
var _initPromise;
var DEFAULT_PROGRESS_RUN_STALE_MS = 300 * 1e3;
function normalizeLimit(value, fallback = 50) {
	if (!Number.isFinite(value) || value == null || value <= 0) return fallback;
	return Math.min(Math.floor(value), 200);
}
function resolveProgressRunStaleMs() {
	const raw = process.env.AGENT_PROGRESS_RUN_STALE_MS;
	if (raw !== void 0) {
		const value = Number(raw);
		if (Number.isFinite(value) && value >= 0) return value;
	}
	return DEFAULT_PROGRESS_RUN_STALE_MS;
}
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		await retryOnDdlRace(() => client.execute(`
          CREATE TABLE IF NOT EXISTS progress_runs (
            id TEXT PRIMARY KEY,
            owner TEXT NOT NULL,
            title TEXT NOT NULL,
            step TEXT,
            percent ${intType()},
            status TEXT NOT NULL DEFAULT 'running',
            metadata TEXT,
            started_at ${intType()} NOT NULL,
            updated_at ${intType()} NOT NULL,
            completed_at ${intType()}
          )
        `));
		await retryOnDdlRace(() => client.execute(`CREATE INDEX IF NOT EXISTS idx_progress_runs_owner_status ON progress_runs (owner, status, started_at)`));
	})().catch((err) => {
		_initPromise = void 0;
		throw err;
	});
	return _initPromise;
}
function parseRow(row) {
	const percent = row.percent;
	return {
		id: String(row.id),
		owner: String(row.owner),
		title: String(row.title),
		step: row.step == null ? void 0 : String(row.step),
		percent: percent == null ? null : Number(percent),
		status: String(row.status),
		metadata: row.metadata ? safeJsonParse(row.metadata, void 0) : void 0,
		startedAt: new Date(Number(row.started_at)).toISOString(),
		updatedAt: new Date(Number(row.updated_at)).toISOString(),
		completedAt: row.completed_at == null ? null : new Date(Number(row.completed_at)).toISOString()
	};
}
async function insertRun(input) {
	await ensureTable();
	const client = getDbExec();
	const id = input.id ?? randomUUID();
	const now = Date.now();
	try {
		await client.execute({
			sql: `INSERT INTO progress_runs
        (id, owner, title, step, percent, status, metadata, started_at, updated_at, completed_at)
        VALUES (?, ?, ?, ?, NULL, 'running', ?, ?, ?, NULL)`,
			args: [
				id,
				input.owner,
				input.title,
				input.step ?? null,
				input.metadata ? JSON.stringify(input.metadata) : null,
				now,
				now
			]
		});
	} catch (err) {
		if (input.id && isUniqueViolation(err)) throw new Error(`insertRun: run id "${input.id}" already exists for this owner`);
		throw err;
	}
	bumpPoll(input.owner);
	return {
		id,
		owner: input.owner,
		title: input.title,
		step: input.step,
		percent: null,
		status: "running",
		metadata: input.metadata,
		startedAt: new Date(now).toISOString(),
		updatedAt: new Date(now).toISOString(),
		completedAt: null
	};
}
async function getRun(id, owner) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT * FROM progress_runs WHERE id = ? AND owner = ?`,
		args: [id, owner]
	});
	if (rows.length === 0) return null;
	return parseRow(rows[0]);
}
async function updateRun(id, owner, input) {
	await ensureTable();
	const client = getDbExec();
	const current = await getRun(id, owner);
	if (!current) return null;
	const now = Date.now();
	const sets = ["updated_at = ?"];
	const args = [now];
	const next = {
		...current,
		updatedAt: new Date(now).toISOString()
	};
	if (Object.prototype.hasOwnProperty.call(input, "percent")) {
		const percent = input.percent == null ? null : clampPercent(input.percent);
		sets.push("percent = ?");
		args.push(percent);
		next.percent = percent;
	}
	if (input.step !== void 0) {
		sets.push("step = ?");
		args.push(input.step);
		next.step = input.step;
	}
	if (input.metadata !== void 0) {
		sets.push("metadata = ?");
		args.push(JSON.stringify(input.metadata));
		next.metadata = input.metadata;
	}
	if (input.status !== void 0) {
		sets.push("status = ?");
		args.push(input.status);
		next.status = input.status;
		if (input.status !== "running") {
			sets.push("completed_at = ?");
			args.push(now);
			next.completedAt = new Date(now).toISOString();
		}
	}
	args.push(id, owner);
	await client.execute({
		sql: `UPDATE progress_runs SET ${sets.join(", ")} WHERE id = ? AND owner = ?`,
		args
	});
	bumpPoll(owner);
	return next;
}
function clampPercent(n) {
	if (Number.isNaN(n)) return 0;
	return Math.max(0, Math.min(100, Math.round(n)));
}
async function cancelStaleRunsForOwner(owner, staleMs = resolveProgressRunStaleMs()) {
	if (!Number.isFinite(staleMs) || staleMs <= 0) return 0;
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const cutoff = now - staleMs;
	const minutes = Math.max(1, Math.round(staleMs / 6e4));
	const rowsAffected = (await client.execute({
		sql: `UPDATE progress_runs
          SET status = 'cancelled',
              step = ?,
              updated_at = ?,
              completed_at = ?
          WHERE owner = ?
            AND status = 'running'
            AND updated_at < ?`,
		args: [
			`Stopped after ${minutes} minutes without progress.`,
			now,
			now,
			owner,
			cutoff
		]
	})).rowsAffected;
	if (typeof rowsAffected === "number" && rowsAffected > 0) {
		bumpPoll(owner);
		return rowsAffected;
	}
	return 0;
}
async function listRuns(owner, options = {}) {
	await ensureTable();
	await cancelStaleRunsForOwner(owner);
	const client = getDbExec();
	const limit = normalizeLimit(options.limit);
	let where = `owner = ?`;
	const args = [owner];
	if (options.activeOnly) where += ` AND status = 'running'`;
	args.push(limit);
	const { rows } = await client.execute({
		sql: `SELECT * FROM progress_runs WHERE ${where} ORDER BY started_at DESC LIMIT ?`,
		args
	});
	return rows.map((r) => parseRow(r));
}
async function deleteRun(id, owner) {
	await ensureTable();
	const deleted = (await getDbExec().execute({
		sql: `DELETE FROM progress_runs WHERE id = ? AND owner = ?`,
		args: [id, owner]
	})).rowsAffected !== 0;
	if (deleted) bumpPoll(owner);
	return deleted;
}
//#endregion
export { updateRun as a, listRuns as i, getRun as n, insertRun as r, deleteRun as t };
