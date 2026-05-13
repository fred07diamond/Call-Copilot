import { i as getDbExec, o as intType } from "./client-BpA2t7pN.js";
import crypto from "crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/a2a/task-store.js
var _initPromise;
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		await client.execute(`
        CREATE TABLE IF NOT EXISTS a2a_tasks (
          id TEXT PRIMARY KEY,
          context_id TEXT,
          status_state TEXT NOT NULL DEFAULT 'submitted',
          status_message TEXT,
          status_timestamp TEXT NOT NULL,
          history TEXT NOT NULL DEFAULT '[]',
          artifacts TEXT NOT NULL DEFAULT '[]',
          metadata TEXT,
          created_at ${intType()} NOT NULL,
          updated_at ${intType()} NOT NULL
        )
      `);
		try {
			await client.execute(`ALTER TABLE a2a_tasks ADD COLUMN owner_email TEXT`);
		} catch {}
	})();
	return _initPromise;
}
function taskFromRow(row) {
	return {
		id: row.id,
		contextId: row.context_id || void 0,
		status: {
			state: row.status_state,
			message: row.status_message ? JSON.parse(row.status_message) : void 0,
			timestamp: row.status_timestamp
		},
		history: JSON.parse(row.history),
		artifacts: JSON.parse(row.artifacts),
		metadata: row.metadata ? JSON.parse(row.metadata) : void 0,
		ownerEmail: row.owner_email ?? null
	};
}
function getAffectedRowCount(result) {
	const resultRecord = result;
	return resultRecord?.rowsAffected ?? resultRecord?.rowCount ?? resultRecord?.count;
}
async function createTask(message, contextId, metadata, ownerEmail) {
	await ensureTable();
	const client = getDbExec();
	const id = crypto.randomUUID();
	const now = Date.now();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const task = {
		id,
		contextId,
		status: {
			state: "submitted",
			timestamp
		},
		history: [message],
		artifacts: [],
		metadata
	};
	await client.execute({
		sql: `INSERT INTO a2a_tasks (id, context_id, status_state, status_timestamp, history, artifacts, metadata, owner_email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			id,
			contextId ?? null,
			"submitted",
			timestamp,
			JSON.stringify([message]),
			"[]",
			metadata ? JSON.stringify(metadata) : null,
			ownerEmail ?? null,
			now,
			now
		]
	});
	return task;
}
/**
* Fetch the verified owner email recorded against a task at creation time.
* Returns null when the task has no owner (legacy rows or unauthenticated
* deployments) or when the task is missing.
*
* Used by `handleGet` / `handleCancel` to reject IDOR access — the JWT-
* verified caller's email must match `owner_email` to read or cancel.
*/
async function getTaskOwner(id) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT owner_email FROM a2a_tasks WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return null;
	const ownerEmail = rows[0].owner_email;
	return typeof ownerEmail === "string" && ownerEmail ? ownerEmail : null;
}
/**
* Atomically claim a task for processing. Only succeeds when the task is in
* state 'submitted' or 'working' — flipping it to 'processing' so concurrent
* processors can't pick it up twice. Returns the task if claimed, null if it
* was already claimed/completed/missing.
*
* Used by the cross-platform async processor (`_process-task` route) to avoid
* duplicate handler runs when retries fire.
*/
async function claimA2ATaskForProcessing(id) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	if (getAffectedRowCount(await client.execute({
		sql: `UPDATE a2a_tasks
            SET status_state = 'processing',
                status_timestamp = ?,
                updated_at = ?
          WHERE id = ?
            AND status_state IN ('submitted', 'working')`,
		args: [
			timestamp,
			now,
			id
		]
	})) === 0) return null;
	const { rows } = await client.execute({
		sql: `SELECT * FROM a2a_tasks WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return null;
	return taskFromRow(rows[0]);
}
async function getA2ATaskDispatchState(id) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT id, status_state, metadata, updated_at FROM a2a_tasks WHERE id = ?`,
		args: [id]
	});
	const row = rows[0];
	if (!row) return null;
	return {
		id: row.id,
		statusState: row.status_state,
		metadata: row.metadata ? JSON.parse(row.metadata) : void 0,
		updatedAt: Number(row.updated_at ?? 0)
	};
}
async function touchQueuedA2ATaskDispatch(id) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	return getAffectedRowCount(await client.execute({
		sql: `UPDATE a2a_tasks
            SET updated_at = ?
          WHERE id = ?
            AND status_state IN ('submitted', 'working')`,
		args: [now, id]
	})) !== 0;
}
async function touchProcessingA2ATask(id) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	return getAffectedRowCount(await client.execute({
		sql: `UPDATE a2a_tasks
            SET updated_at = ?
          WHERE id = ?
            AND status_state = 'processing'`,
		args: [now, id]
	})) !== 0;
}
async function failStuckA2ATask(id, processingCutoff, reason) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	const message = {
		role: "agent",
		parts: [{
			type: "text",
			text: reason
		}]
	};
	return getAffectedRowCount(await client.execute({
		sql: `UPDATE a2a_tasks
            SET status_state = 'failed',
                status_message = ?,
                status_timestamp = ?,
                updated_at = ?
          WHERE id = ?
            AND status_state = 'processing'
            AND updated_at <= ?`,
		args: [
			JSON.stringify(message),
			timestamp,
			now,
			id,
			processingCutoff
		]
	})) !== 0;
}
async function getTask(id) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT * FROM a2a_tasks WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return null;
	return taskFromRow(rows[0]);
}
async function updateTask(id, update) {
	await ensureTable();
	const client = getDbExec();
	const { rows } = await client.execute({
		sql: `SELECT * FROM a2a_tasks WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return null;
	const task = taskFromRow(rows[0]);
	const now = Date.now();
	if (update.state) task.status = {
		state: update.state,
		message: update.message ?? task.status.message,
		timestamp: (/* @__PURE__ */ new Date()).toISOString()
	};
	if (update.message && task.history) task.history.push(update.message);
	if (update.artifacts) task.artifacts = [...task.artifacts ?? [], ...update.artifacts];
	await client.execute({
		sql: `UPDATE a2a_tasks SET status_state = ?, status_message = ?, status_timestamp = ?, history = ?, artifacts = ?, updated_at = ? WHERE id = ?`,
		args: [
			task.status.state,
			task.status.message ? JSON.stringify(task.status.message) : null,
			task.status.timestamp,
			JSON.stringify(task.history),
			JSON.stringify(task.artifacts),
			now,
			id
		]
	});
	return task;
}
async function updateTaskStatusMessage(id, message) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const timestamp = (/* @__PURE__ */ new Date()).toISOString();
	await client.execute({
		sql: `UPDATE a2a_tasks
            SET status_message = ?,
                status_timestamp = ?,
                updated_at = ?
          WHERE id = ?
            AND status_state IN ('submitted', 'working', 'processing')`,
		args: [
			JSON.stringify(message),
			timestamp,
			now,
			id
		]
	});
}
//#endregion
export { getTask as a, touchQueuedA2ATaskDispatch as c, getA2ATaskDispatchState as i, updateTask as l, createTask as n, getTaskOwner as o, failStuckA2ATask as r, touchProcessingA2ATask as s, claimA2ATaskForProcessing as t, updateTaskStatusMessage as u };
