import { i as getDbExec, o as intType } from "./client-BpA2t7pN.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/checkpoints/store.js
var _initPromise;
async function ensureCheckpointTable() {
	if (!_initPromise) _initPromise = (async () => {
		await getDbExec().execute(`
        CREATE TABLE IF NOT EXISTS agent_checkpoints (
          id TEXT PRIMARY KEY,
          thread_id TEXT NOT NULL,
          run_id TEXT,
          commit_sha TEXT NOT NULL,
          message TEXT NOT NULL DEFAULT '',
          created_at ${intType()} NOT NULL
        )
      `);
	})();
	return _initPromise;
}
async function insertCheckpoint(id, threadId, runId, commitSha, message) {
	await ensureCheckpointTable();
	await getDbExec().execute({
		sql: `INSERT INTO agent_checkpoints (id, thread_id, run_id, commit_sha, message, created_at) VALUES (?, ?, ?, ?, ?, ?)`,
		args: [
			id,
			threadId,
			runId,
			commitSha,
			message,
			Date.now()
		]
	});
}
async function getCheckpointsByThread(threadId) {
	await ensureCheckpointTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT id, thread_id, run_id, commit_sha, message, created_at FROM agent_checkpoints WHERE thread_id = ? ORDER BY created_at DESC`,
		args: [threadId]
	});
	return rows.map((r) => ({
		id: r.id,
		threadId: r.thread_id,
		runId: r.run_id,
		commitSha: r.commit_sha,
		message: r.message,
		createdAt: r.created_at
	}));
}
async function getCheckpointById(id) {
	await ensureCheckpointTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT id, thread_id, run_id, commit_sha, message, created_at FROM agent_checkpoints WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return null;
	const r = rows[0];
	return {
		id: r.id,
		threadId: r.thread_id,
		runId: r.run_id,
		commitSha: r.commit_sha,
		message: r.message,
		createdAt: r.created_at
	};
}
//#endregion
export { getCheckpointById, getCheckpointsByThread, insertCheckpoint };
