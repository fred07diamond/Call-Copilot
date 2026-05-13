import { i as getDbExec, o as intType, u as isPostgres } from "./client-BpA2t7pN.js";
import { t as captureError } from "./capture-error-CDwqxszK.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/agent/run-store.js
/**
* SQL persistence for agent runs and events.
* Enables cross-isolate access on Cloudflare Workers and
* reliable reconnection after page refreshes.
*/
var _initPromise;
/**
* Max time without a heartbeat before a "running" run is considered dead.
* The run-manager heartbeats every 1.5s, so 6s tolerates 3 missed writes.
* Short window is what makes reload recovery feel instant instead of
* stranding the user on "Thinking..." for up to 90s after a process death.
*/
var RUN_STALE_MS = 6e3;
var STALE_RUN_ERROR_EVENT = {
	type: "error",
	error: "The agent stopped before it could finish. It may have hit a server timeout or the worker may have been interrupted.",
	errorCode: "stale_run",
	recoverable: true,
	details: "The run heartbeat stopped while the run was still marked running. Partial output and tool calls were preserved when available."
};
async function ensureRunTables() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		await client.execute(`
        CREATE TABLE IF NOT EXISTS agent_runs (
          id TEXT PRIMARY KEY,
          thread_id TEXT NOT NULL,
          status TEXT NOT NULL DEFAULT 'running',
          abort_reason TEXT,
          started_at ${intType()} NOT NULL,
          completed_at ${intType()},
          heartbeat_at ${intType()},
          last_progress_at ${intType()}
        )
      `);
		try {
			if (isPostgres()) {
				await client.execute(`ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS heartbeat_at ${intType()}`);
				await client.execute(`ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS abort_reason TEXT`);
			} else await client.execute(`ALTER TABLE agent_runs ADD COLUMN heartbeat_at ${intType()}`);
		} catch {}
		try {
			if (!isPostgres()) await client.execute(`ALTER TABLE agent_runs ADD COLUMN abort_reason TEXT`);
		} catch {}
		try {
			if (isPostgres()) await client.execute(`ALTER TABLE agent_runs ADD COLUMN IF NOT EXISTS last_progress_at ${intType()}`);
			else await client.execute(`ALTER TABLE agent_runs ADD COLUMN last_progress_at ${intType()}`);
		} catch {}
		await client.execute(`
        CREATE TABLE IF NOT EXISTS agent_run_events (
          run_id TEXT NOT NULL,
          seq ${intType()} NOT NULL,
          event_data TEXT NOT NULL,
          PRIMARY KEY (run_id, seq)
        )
      `);
	})();
	return _initPromise;
}
async function insertRun(id, threadId) {
	await ensureRunTables();
	const client = getDbExec();
	const now = Date.now();
	await client.execute({
		sql: `INSERT INTO agent_runs (id, thread_id, status, started_at, heartbeat_at, last_progress_at) VALUES (?, ?, 'running', ?, ?, ?)`,
		args: [
			id,
			threadId,
			now,
			now,
			now
		]
	});
}
/** Update the run's liveness heartbeat. Called periodically by run-manager. */
async function updateRunHeartbeat(runId) {
	await ensureRunTables();
	await getDbExec().execute({
		sql: `UPDATE agent_runs SET heartbeat_at = ? WHERE id = ?`,
		args: [Date.now(), runId]
	});
}
/**
* Bump `last_progress_at` — call this whenever the agent actually emits an
* event (token, tool call, message). Distinct from `heartbeat_at` so the
* stuck-detector can tell "process alive but nothing happening" from
* "process dead." Callers should throttle (run-manager debounces to ~1/s).
*/
async function bumpRunProgress(runId) {
	await ensureRunTables();
	await getDbExec().execute({
		sql: `UPDATE agent_runs SET last_progress_at = ? WHERE id = ?`,
		args: [Date.now(), runId]
	});
}
/**
* If the given run is marked "running" in SQL but its heartbeat is stale
* (producer likely crashed), flip it to "errored" so watchers stop waiting.
* Returns true if the row was reaped.
*/
async function reapIfStale(runId, maxStaleMs = RUN_STALE_MS) {
	await ensureRunTables();
	const client = getDbExec();
	const cutoff = Date.now() - maxStaleMs;
	const { rowsAffected } = await client.execute({
		sql: `UPDATE agent_runs
          SET status = 'errored', completed_at = ?
          WHERE id = ?
            AND status = 'running'
            AND COALESCE(heartbeat_at, started_at) < ?`,
		args: [
			Date.now(),
			runId,
			cutoff
		]
	});
	const reaped = (rowsAffected ?? 0) > 0;
	if (reaped) await safeAppendTerminalRunEvent(runId, STALE_RUN_ERROR_EVENT, "reap-if-stale");
	return reaped;
}
async function updateRunStatus(runId, status) {
	await ensureRunTables();
	await getDbExec().execute({
		sql: `UPDATE agent_runs SET status = ?, completed_at = ? WHERE id = ?`,
		args: [
			status,
			Date.now(),
			runId
		]
	});
}
async function markRunAborted(runId, reason) {
	await ensureRunTables();
	await getDbExec().execute({
		sql: `UPDATE agent_runs SET status = 'aborted', abort_reason = ?, completed_at = ? WHERE id = ?`,
		args: [
			reason ?? "user",
			Date.now(),
			runId
		]
	});
	await safeAppendTerminalRunEvent(runId, { type: "done" }, "mark-aborted");
}
async function getRunAbortState(runId) {
	await ensureRunTables();
	const { rows } = await getDbExec().execute({
		sql: `SELECT status, abort_reason FROM agent_runs WHERE id = ?`,
		args: [runId]
	});
	if (rows.length === 0) return { aborted: false };
	const row = rows[0];
	if (row.status !== "aborted") return { aborted: false };
	return {
		aborted: true,
		...row.abort_reason ? { reason: row.abort_reason } : {}
	};
}
async function insertRunEvent(runId, seq, eventData) {
	await ensureRunTables();
	await getDbExec().execute({
		sql: `INSERT INTO agent_run_events (run_id, seq, event_data) VALUES (?, ?, ?) ON CONFLICT (run_id, seq) DO NOTHING`,
		args: [
			runId,
			seq,
			eventData
		]
	});
}
async function getRunEventsSince(runId, fromSeq) {
	await ensureRunTables();
	const { rows } = await getDbExec().execute({
		sql: `SELECT seq, event_data FROM agent_run_events WHERE run_id = ? AND seq >= ? ORDER BY seq ASC`,
		args: [runId, fromSeq]
	});
	return rows.map((r) => {
		const row = r;
		return {
			seq: Number(row.seq),
			eventData: row.event_data
		};
	});
}
async function getRunById(runId) {
	await ensureRunTables();
	const { rows } = await getDbExec().execute({
		sql: `SELECT id, thread_id, status, started_at FROM agent_runs WHERE id = ?`,
		args: [runId]
	});
	if (rows.length === 0) return null;
	const r = rows[0];
	return {
		id: r.id,
		threadId: r.thread_id,
		status: r.status,
		startedAt: Number(r.started_at)
	};
}
async function getRunByThread(threadId, options) {
	await ensureRunTables();
	const client = getDbExec();
	const sql = options?.includeTerminal ? `SELECT id, thread_id, status, started_at, heartbeat_at, completed_at, last_progress_at FROM agent_runs WHERE thread_id = ? ORDER BY started_at DESC LIMIT 1` : `SELECT id, thread_id, status, started_at, heartbeat_at, completed_at, last_progress_at FROM agent_runs WHERE thread_id = ? AND status = 'running' ORDER BY started_at DESC LIMIT 1`;
	const { rows } = await client.execute({
		sql,
		args: [threadId]
	});
	if (rows.length === 0) return null;
	const r = rows[0];
	return {
		id: r.id,
		threadId: r.thread_id,
		status: r.status,
		startedAt: Number(r.started_at),
		heartbeatAt: r.heartbeat_at == null ? null : Number(r.heartbeat_at),
		completedAt: r.completed_at == null ? null : Number(r.completed_at),
		lastProgressAt: r.last_progress_at == null ? null : Number(r.last_progress_at)
	};
}
/**
* Expire any "running" rows whose heartbeat is stale — producer died.
* Safe to call at server startup on multi-isolate deployments: only rows
* without a fresh heartbeat get reaped, so runs owned by OTHER live
* isolates (which keep heartbeating) are left alone.
*/
async function reapAllStaleRuns() {
	await ensureRunTables();
	const client = getDbExec();
	const heartbeatCutoff = Date.now() - RUN_STALE_MS;
	const stale = await client.execute({
		sql: `SELECT id FROM agent_runs
          WHERE status = 'running'
            AND COALESCE(heartbeat_at, started_at) < ?`,
		args: [heartbeatCutoff]
	});
	const { rowsAffected } = await client.execute({
		sql: `UPDATE agent_runs
          SET status = 'errored', completed_at = ?
          WHERE status = 'running'
            AND COALESCE(heartbeat_at, started_at) < ?`,
		args: [Date.now(), heartbeatCutoff]
	});
	for (const row of stale.rows) {
		const id = row.id;
		if (typeof id === "string") await safeAppendTerminalRunEvent(id, STALE_RUN_ERROR_EVENT, "reap-all-stale");
	}
	return rowsAffected ?? 0;
}
/** Delete completed/errored runs older than the given threshold,
*  and expire stale "running" rows that haven't had activity
*  (e.g. worker crashed before updating status). */
async function cleanupOldRuns(olderThanMs) {
	await ensureRunTables();
	const client = getDbExec();
	const cutoff = Date.now() - olderThanMs;
	const heartbeatCutoff = Date.now() - RUN_STALE_MS;
	const stale = await client.execute({
		sql: `SELECT id FROM agent_runs
          WHERE status = 'running'
            AND (
              COALESCE(heartbeat_at, started_at) < ?
              OR started_at < ?
            )`,
		args: [heartbeatCutoff, cutoff]
	});
	await client.execute({
		sql: `UPDATE agent_runs SET status = 'errored', completed_at = ? WHERE status = 'running' AND started_at < ?`,
		args: [Date.now(), cutoff]
	});
	await client.execute({
		sql: `UPDATE agent_runs
          SET status = 'errored', completed_at = ?
          WHERE status = 'running'
            AND COALESCE(heartbeat_at, started_at) < ?`,
		args: [Date.now(), heartbeatCutoff]
	});
	for (const row of stale.rows) {
		const id = row.id;
		if (typeof id === "string") await safeAppendTerminalRunEvent(id, STALE_RUN_ERROR_EVENT, "cleanup-old-runs");
	}
	await client.execute({
		sql: `DELETE FROM agent_run_events WHERE run_id IN (
      SELECT id FROM agent_runs WHERE status != 'running' AND completed_at < ?
    )`,
		args: [cutoff]
	});
	await client.execute({
		sql: `DELETE FROM agent_runs WHERE status != 'running' AND completed_at < ?`,
		args: [cutoff]
	});
}
/**
* Idempotently append a terminal event to a run's event stream. No-op if the
* stream already ends in a terminal event. Used by reapers AND by SSE
* reconnect paths that discover an `errored` run row with no terminal event
* (e.g. an earlier reaper's silent `.catch(() => {})` swallowed the append).
*
* Persisting from the reconnect path is what keeps the system self-healing:
* subsequent reconnects replay the proper terminal event from SQL instead of
* synthesizing a fresh one each time.
*/
async function ensureTerminalRunEvent(runId, event) {
	return appendTerminalRunEvent(runId, event);
}
/**
* Append a terminal run event, retrying once on failure and reporting to
* Sentry if both attempts fail. Background reaper paths can't surface errors
* to a user, but they MUST eventually persist a terminal event — losing it
* leaves reconnecting clients staring at a bare `status='errored'` row with
* no payload to render. The previous `.catch(() => {})` callsites silently
* dropped transient SQL blips and produced exactly that bug. Never throws.
*/
async function safeAppendTerminalRunEvent(runId, event, source) {
	let firstError;
	try {
		await appendTerminalRunEvent(runId, event);
		return;
	} catch (err) {
		firstError = err;
	}
	await new Promise((resolve) => setTimeout(resolve, 100));
	try {
		await appendTerminalRunEvent(runId, event);
	} catch (retryErr) {
		captureError(retryErr, {
			tags: {
				component: "agent-run-store",
				operation: "append-terminal-event",
				source
			},
			extra: {
				runId,
				eventType: typeof event.type === "string" ? event.type : "(unknown)",
				firstError: firstError instanceof Error ? firstError.message : String(firstError)
			}
		});
	}
}
async function appendTerminalRunEvent(runId, event) {
	await ensureRunTables();
	const client = getDbExec();
	const { rows } = await client.execute({
		sql: `SELECT seq, event_data FROM agent_run_events WHERE run_id = ? ORDER BY seq DESC LIMIT 1`,
		args: [runId]
	});
	const last = rows[0];
	if (last?.event_data) try {
		const parsed = JSON.parse(last.event_data);
		if (parsed?.type === "done" || parsed?.type === "error" || parsed?.type === "missing_api_key" || parsed?.type === "loop_limit" || parsed?.type === "auto_continue") return;
	} catch {}
	const nextSeq = last ? Number(last.seq ?? -1) + 1 : 0;
	await client.execute({
		sql: `INSERT INTO agent_run_events (run_id, seq, event_data) VALUES (?, ?, ?) ON CONFLICT (run_id, seq) DO NOTHING`,
		args: [
			runId,
			nextSeq,
			JSON.stringify(event)
		]
	});
}
//#endregion
export { ensureTerminalRunEvent as a, getRunByThread as c, insertRunEvent as d, markRunAborted as f, updateRunStatus as g, updateRunHeartbeat as h, cleanupOldRuns as i, getRunEventsSince as l, reapIfStale as m, STALE_RUN_ERROR_EVENT as n, getRunAbortState as o, reapAllStaleRuns as p, bumpRunProgress as r, getRunById as s, RUN_STALE_MS as t, insertRun as u };
