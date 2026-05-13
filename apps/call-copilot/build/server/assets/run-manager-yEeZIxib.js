import { t as captureError } from "./capture-error-CDwqxszK.js";
import { a as ensureTerminalRunEvent, c as getRunByThread, d as insertRunEvent, f as markRunAborted, g as updateRunStatus, h as updateRunHeartbeat, i as cleanupOldRuns, l as getRunEventsSince, m as reapIfStale, n as STALE_RUN_ERROR_EVENT, o as getRunAbortState, r as bumpRunProgress, s as getRunById, u as insertRun } from "./run-store-DA-8ft5d.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/agent/engine/types.js
/**
* Pluggable Agent Engine abstraction.
*
* AgentEngine is the thin LLM adapter that sits beneath runAgentLoop.
* Every caller (HTTP handler, A2A, MCP, sub-agents, webhooks, jobs) uses
* an AgentEngine instead of a raw @anthropic-ai/sdk client.
*
* The framework's tool dispatch loop, sub-agents, SSE event stream, and all
* other harness features live above this layer and are unaffected by engine
* selection.
*/
/**
* Thrown when an engine emits a terminal stop-error event. Carries optional
* structured fields (errorCode / upgradeUrl) that propagate up to the SSE
* "error" event so the chat UI can render a structured CTA — e.g. an
* Upgrade button for Builder gateway 402 quota errors.
*
* Lives in the engine types module (not production-agent) so run-manager and
* other consumers can `instanceof` it without an import cycle.
*/
var EngineError = class extends Error {
	errorCode;
	upgradeUrl;
	constructor(message, opts) {
		super(message);
		this.name = "EngineError";
		this.errorCode = opts?.errorCode;
		this.upgradeUrl = opts?.upgradeUrl;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/agent/run-manager.js
var activeRuns = /* @__PURE__ */ new Map();
var threadToRun = /* @__PURE__ */ new Map();
/** How long to keep completed runs in memory before cleanup (5 min) */
var CLEANUP_DELAY_MS = 300 * 1e3;
/** Default run chunk budget for hosted/serverless deploys. */
var DEFAULT_HOSTED_RUN_SOFT_TIMEOUT_MS = 55e3;
/** Default SQL retention for completed/errored run event logs (24 hours). */
var DEFAULT_COMPLETED_RUN_RETENTION_MS = 1440 * 60 * 1e3;
/**
* How recently a terminal run must have started for `/runs/active` to surface
* it. Reconnect after this window won't replay the run — typical real-world
* disconnects resolve in seconds, so 10 minutes is generous while keeping us
* from resurrecting ancient turns when the user reopens an old thread.
*/
var TERMINAL_RUN_RECONNECT_WINDOW_MS = 600 * 1e3;
function isHostedRuntime() {
	if (process.env.NETLIFY && process.env.NETLIFY !== "false" && process.env.NETLIFY_LOCAL !== "true") return true;
	if (process.env.AWS_LAMBDA_FUNCTION_NAME && process.env.NETLIFY_LOCAL !== "true") return true;
	return Boolean(process.env.CF_PAGES || process.env.VERCEL || process.env.VERCEL_ENV || process.env.RENDER || process.env.FLY_APP_NAME || process.env.K_SERVICE);
}
function resolveRunSoftTimeoutMs(overrideMs, options) {
	if (typeof overrideMs === "number" && Number.isFinite(overrideMs)) return Math.max(0, overrideMs);
	const envValue = process.env.AGENT_RUN_SOFT_TIMEOUT_MS;
	if (envValue !== void 0) {
		const raw = Number(envValue);
		if (Number.isFinite(raw) && raw >= 0) return raw;
	}
	return options?.useHostedDefault && isHostedRuntime() ? DEFAULT_HOSTED_RUN_SOFT_TIMEOUT_MS : 0;
}
function resolveCompletedRunRetentionMs() {
	const envValue = process.env.AGENT_RUN_RETENTION_MS;
	if (envValue !== void 0) {
		const raw = Number(envValue);
		if (Number.isFinite(raw) && raw >= 0) return raw;
	}
	return DEFAULT_COMPLETED_RUN_RETENTION_MS;
}
function isTerminalRunEvent(event) {
	return event.type === "done" || event.type === "error" || event.type === "missing_api_key" || event.type === "loop_limit" || event.type === "auto_continue";
}
function abortInMemoryRun(run, reason = "user") {
	run.abortReason = reason;
	run.status = "aborted";
	if (threadToRun.get(run.threadId) === run.runId) threadToRun.delete(run.threadId);
	run.abort.abort(reason);
	for (const subscriber of run.subscribers) try {
		subscriber({
			seq: run.events.length,
			event: { type: "done" }
		});
	} catch {}
	run.subscribers.clear();
}
/**
* Start a new agent run in the background.
* `runFn` receives a `send` callback and an `AbortSignal`.
* The run continues even if all SSE subscribers disconnect.
*
* Events are persisted to SQL for cross-isolate access (Cloudflare Workers).
*/
function startRun(runId, threadId, runFn, onComplete, options) {
	const existingRunId = threadToRun.get(threadId);
	if (existingRunId) abortRun(existingRunId);
	const abort = new AbortController();
	let softTimedOut = false;
	const run = {
		runId,
		threadId,
		events: [],
		status: "running",
		subscribers: /* @__PURE__ */ new Set(),
		abort,
		startedAt: Date.now()
	};
	activeRuns.set(runId, run);
	threadToRun.set(threadId, runId);
	const insertRunPromise = insertRun(runId, threadId).catch(() => {});
	let lastProgressBumpAt = 0;
	const bumpProgressIfDue = () => {
		const now = Date.now();
		if (now - lastProgressBumpAt < 1e3) return;
		lastProgressBumpAt = now;
		bumpRunProgress(runId).catch(() => {});
	};
	let lastAbortCheck = Date.now() - 3e3;
	const checkSqlAbort = () => {
		const now = Date.now();
		if (now - lastAbortCheck < 3e3) return;
		lastAbortCheck = now;
		getRunAbortState(runId).then((state) => {
			if (state.aborted && !abort.signal.aborted) abortInMemoryRun(run, state.reason ?? "user");
		}).catch(() => {});
	};
	const heartbeatTimer = setInterval(() => {
		updateRunHeartbeat(runId).catch(() => {});
		checkSqlAbort();
	}, 1500);
	const softTimeoutMs = resolveRunSoftTimeoutMs(options?.softTimeoutMs, { useHostedDefault: options?.useHostedSoftTimeoutDefault === true });
	const softTimeoutTimer = softTimeoutMs > 0 ? setTimeout(() => {
		if (run.status !== "running" || abort.signal.aborted) return;
		softTimedOut = true;
		send({
			type: "auto_continue",
			reason: "run_timeout"
		});
		abort.abort();
	}, softTimeoutMs) : null;
	let pendingTerminalEvent = null;
	const captureRunError = (error, phase) => {
		captureError(error, {
			route: "/_agent-native/agent-chat",
			tags: {
				source: "agent-run-manager",
				phase,
				runStatus: run.status,
				softTimedOut: softTimedOut ? "true" : "false",
				abortReason: run.abortReason,
				errorCode: error instanceof EngineError ? error.errorCode : void 0
			},
			extra: {
				runId,
				threadId,
				eventCount: run.events.length,
				startedAt: run.startedAt,
				softTimeoutMs
			},
			contexts: { agentRun: {
				runId,
				threadId,
				status: run.status,
				phase,
				eventCount: run.events.length,
				startedAt: run.startedAt,
				softTimeoutMs,
				softTimedOut,
				abortReason: run.abortReason
			} }
		});
	};
	const emitRunEvent = (runEvent, options) => {
		run.events.push(runEvent);
		for (const subscriber of run.subscribers) try {
			subscriber(runEvent);
		} catch {
			run.subscribers.delete(subscriber);
		}
		bumpProgressIfDue();
		const persistence = insertRunEvent(runId, runEvent.seq, JSON.stringify(runEvent.event));
		if (!options?.surfacePersistenceError) persistence.catch(() => {});
		checkSqlAbort();
		return persistence;
	};
	const send = (event) => {
		if (run.status === "aborted" && abort.signal.aborted) return;
		const runEvent = {
			seq: run.events.length,
			event
		};
		if (isTerminalRunEvent(event)) {
			pendingTerminalEvent = runEvent;
			return;
		}
		emitRunEvent(runEvent);
	};
	const runPromise = runFn(send, abort.signal).then(() => {
		if (abort.signal.aborted) {
			run.status = softTimedOut ? "completed" : "aborted";
			return;
		}
		run.status = "completed";
	}).catch((err) => {
		if (abort.signal.aborted) {
			run.status = softTimedOut ? "completed" : "aborted";
			return;
		}
		run.status = "errored";
		captureRunError(err, "run");
		send({
			type: "error",
			error: err?.message ?? "Unknown error",
			...err instanceof EngineError && err.errorCode ? { errorCode: err.errorCode } : {},
			...err instanceof EngineError && err.upgradeUrl ? { upgradeUrl: err.upgradeUrl } : {}
		});
	}).finally(async () => {
		let completionError = null;
		let terminalPersistenceError = null;
		if (onComplete && !(run.status === "aborted" && run.abortReason === "no_progress")) try {
			await onComplete(pendingTerminalEvent ? {
				...run,
				events: [...run.events, pendingTerminalEvent]
			} : run);
		} catch (err) {
			completionError = err;
			captureRunError(err, "completion");
			console.error("[run-manager] onComplete callback error:", err instanceof Error ? err.message : err);
		}
		const finalStatus = run.status === "aborted" ? "aborted" : run.status === "errored" || completionError ? "errored" : "completed";
		if (finalStatus === "completed" || finalStatus === "errored") {
			const terminal = finalStatus === "completed" ? pendingTerminalEvent ?? {
				seq: run.events.length,
				event: { type: "done" }
			} : pendingTerminalEvent?.event.type === "error" ? pendingTerminalEvent : {
				seq: pendingTerminalEvent?.seq ?? run.events.length,
				event: {
					type: "error",
					error: completionError ? "Agent response could not be saved." : "Agent run ended unexpectedly"
				}
			};
			const last = run.events[run.events.length - 1];
			if (!last || !isTerminalRunEvent(last.event)) try {
				await emitRunEvent(terminal, { surfacePersistenceError: true });
			} catch (err) {
				terminalPersistenceError = err;
				captureRunError(err, "completion");
				console.error("[run-manager] terminal event persistence error:", err instanceof Error ? err.message : err);
			}
		}
		for (const subscriber of run.subscribers) run.subscribers.delete(subscriber);
		clearInterval(heartbeatTimer);
		if (softTimeoutTimer) clearTimeout(softTimeoutTimer);
		try {
			await insertRunPromise;
			if (!terminalPersistenceError) await updateRunStatus(runId, finalStatus);
		} catch {}
		setTimeout(() => {
			activeRuns.delete(runId);
			if (threadToRun.get(threadId) === runId) threadToRun.delete(threadId);
		}, CLEANUP_DELAY_MS);
		cleanupOldRuns(resolveCompletedRunRetentionMs()).catch(() => {});
	});
	try {
		const cfCtx = globalThis.__cf_ctx;
		if (cfCtx?.waitUntil) cfCtx.waitUntil(runPromise);
	} catch {}
	return run;
}
/**
* Subscribe to a run's events starting from `fromSeq`.
* Returns a ReadableStream that replays buffered events then live-tails.
* Cancelling the stream only unsubscribes — does NOT abort the agent.
*
* Falls back to SQL polling when the run is not in local memory
* (cross-isolate reconnection on Workers).
*/
function subscribeToRun(runId, fromSeq) {
	const run = activeRuns.get(runId);
	if (run) return subscribeInMemory(run, fromSeq);
	return subscribeFromSQL(runId, fromSeq);
}
/** In-memory subscription (same isolate, fast path) */
function subscribeInMemory(run, fromSeq) {
	const encoder = new TextEncoder();
	let subscriberRef = null;
	let pingTimer = null;
	return new ReadableStream({
		start(controller) {
			const ping = () => {
				try {
					controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
				} catch {
					if (subscriberRef) run.subscribers.delete(subscriberRef);
					if (pingTimer) clearInterval(pingTimer);
				}
			};
			ping();
			pingTimer = setInterval(ping, 1e4);
			for (let i = fromSeq; i < run.events.length; i++) try {
				controller.enqueue(encoder.encode(`data: ${JSON.stringify({
					...run.events[i].event,
					seq: run.events[i].seq
				})}\n\n`));
			} catch {
				return;
			}
			if (run.status !== "running") {
				if (pingTimer) clearInterval(pingTimer);
				controller.close();
				return;
			}
			subscriberRef = (event) => {
				try {
					controller.enqueue(encoder.encode(`data: ${JSON.stringify({
						...event.event,
						seq: event.seq
					})}\n\n`));
					if (isTerminalRunEvent(event.event)) {
						run.subscribers.delete(subscriberRef);
						if (pingTimer) clearInterval(pingTimer);
						controller.close();
					}
				} catch {
					run.subscribers.delete(subscriberRef);
				}
			};
			run.subscribers.add(subscriberRef);
		},
		cancel() {
			if (subscriberRef) run.subscribers.delete(subscriberRef);
			if (pingTimer) clearInterval(pingTimer);
		}
	});
}
/** SQL-based subscription (cross-isolate, polling) */
function subscribeFromSQL(runId, fromSeq) {
	const encoder = new TextEncoder();
	let cancelled = false;
	let pollTimer = null;
	let pingTimer = null;
	return new ReadableStream({
		async start(controller) {
			let lastSeq = fromSeq;
			const ping = () => {
				try {
					controller.enqueue(encoder.encode(`: ping ${Date.now()}\n\n`));
				} catch {
					cancelled = true;
					if (pingTimer) clearInterval(pingTimer);
				}
			};
			ping();
			pingTimer = setInterval(ping, 1e4);
			const poll = async () => {
				if (cancelled) return;
				try {
					const events = await getRunEventsSince(runId, lastSeq);
					for (const { seq, eventData } of events) {
						let parsed;
						try {
							parsed = JSON.parse(eventData);
						} catch {
							continue;
						}
						try {
							controller.enqueue(encoder.encode(`data: ${JSON.stringify({
								...parsed,
								seq
							})}\n\n`));
						} catch {
							cancelled = true;
							return;
						}
						lastSeq = seq + 1;
						if (isTerminalRunEvent(parsed)) {
							if (pingTimer) clearInterval(pingTimer);
							controller.close();
							return;
						}
					}
					if (events.length === 0) {
						await reapIfStale(runId).catch(() => {});
						const run = await getRunById(runId);
						if (!run || run.status !== "running") {
							const finalEvents = await getRunEventsSince(runId, lastSeq);
							for (const { seq, eventData } of finalEvents) {
								let parsed;
								try {
									parsed = JSON.parse(eventData);
								} catch {
									continue;
								}
								try {
									controller.enqueue(encoder.encode(`data: ${JSON.stringify({
										...parsed,
										seq
									})}\n\n`));
								} catch {
									cancelled = true;
									return;
								}
								lastSeq = seq + 1;
								if (isTerminalRunEvent(parsed)) {
									if (pingTimer) clearInterval(pingTimer);
									controller.close();
									return;
								}
							}
							if (run?.status === "aborted") try {
								controller.enqueue(encoder.encode(`data: ${JSON.stringify({
									type: "done",
									seq: lastSeq
								})}\n\n`));
							} catch {
								cancelled = true;
								return;
							}
							else if (run?.status === "completed") try {
								controller.enqueue(encoder.encode(`data: ${JSON.stringify({
									type: "done",
									seq: lastSeq
								})}\n\n`));
							} catch {
								cancelled = true;
								return;
							}
							else if (run?.status === "errored") {
								await ensureTerminalRunEvent(runId, STALE_RUN_ERROR_EVENT).catch(() => {});
								try {
									controller.enqueue(encoder.encode(`data: ${JSON.stringify({
										...STALE_RUN_ERROR_EVENT,
										seq: lastSeq
									})}\n\n`));
								} catch {
									cancelled = true;
									return;
								}
							}
							if (pingTimer) clearInterval(pingTimer);
							controller.close();
							return;
						}
					}
					if (!cancelled) pollTimer = setTimeout(poll, 500);
				} catch {
					try {
						if (pingTimer) clearInterval(pingTimer);
						controller.close();
					} catch {}
				}
			};
			try {
				if (!await getRunById(runId)) {
					if (pingTimer) clearInterval(pingTimer);
					controller.close();
					return;
				}
			} catch {
				controller.close();
				return;
			}
			await poll();
		},
		cancel() {
			cancelled = true;
			if (pollTimer) clearTimeout(pollTimer);
			if (pingTimer) clearInterval(pingTimer);
		}
	});
}
/** Get the active run for a thread (if any) — checks memory then SQL */
function getActiveRunForThread(threadId) {
	const runId = threadToRun.get(threadId);
	if (runId) {
		const run = activeRuns.get(runId);
		if (run) return run;
	}
	return null;
}
/**
* Async version that also checks SQL — for cross-isolate access.
* Used by the /runs/active endpoint.
*
* Returns `heartbeatAt` so the client can independently decide a run is
* dead even before the server-side stale reap has fired. Returns
* `lastProgressAt` so the client-side stuck-detector can show a
* user-visible "this chat looks stuck" affordance when a run is alive
* (heartbeating) but not actually emitting events.
*/
async function getActiveRunForThreadAsync(threadId) {
	const memRun = getActiveRunForThread(threadId);
	if (memRun && (memRun.status === "running" || memRun.events.length > 0)) return {
		runId: memRun.runId,
		threadId: memRun.threadId,
		status: memRun.status,
		heartbeatAt: Date.now(),
		lastProgressAt: await fetchLastProgressAt(memRun.runId)
	};
	try {
		const sqlRun = await getRunByThread(threadId, { includeTerminal: true });
		if (!sqlRun) return null;
		if (sqlRun.status === "running") {
			if (await reapIfStale(sqlRun.id).catch(() => false)) return null;
			return {
				runId: sqlRun.id,
				threadId: sqlRun.threadId,
				status: sqlRun.status,
				heartbeatAt: sqlRun.heartbeatAt ?? sqlRun.startedAt,
				lastProgressAt: sqlRun.lastProgressAt
			};
		}
		if (sqlRun.status === "completed" || sqlRun.status === "errored") {
			const referenceAt = sqlRun.completedAt ?? sqlRun.heartbeatAt ?? sqlRun.startedAt;
			if (Date.now() - referenceAt > 6e5) return null;
			return {
				runId: sqlRun.id,
				threadId: sqlRun.threadId,
				status: sqlRun.status,
				heartbeatAt: sqlRun.heartbeatAt ?? sqlRun.startedAt,
				lastProgressAt: sqlRun.lastProgressAt
			};
		}
	} catch {}
	return null;
}
async function fetchLastProgressAt(runId) {
	try {
		const run = await getRunById(runId);
		if (!run) return null;
		const byThread = await getRunByThread(run.threadId, { includeTerminal: true });
		if (byThread && byThread.id === runId) return byThread.lastProgressAt;
		return null;
	} catch {
		return null;
	}
}
/** Explicitly abort a run (e.g. Stop button) */
function abortRun(runId, reason = "user") {
	const run = activeRuns.get(runId);
	if (run) abortInMemoryRun(run, reason);
	markRunAborted(runId, reason).catch(() => {});
	return !!run;
}
//#endregion
export { getActiveRunForThread as a, resolveRunSoftTimeoutMs as c, EngineError as d, abortRun as i, startRun as l, DEFAULT_HOSTED_RUN_SOFT_TIMEOUT_MS as n, getActiveRunForThreadAsync as o, TERMINAL_RUN_RECONNECT_WINDOW_MS as r, resolveCompletedRunRetentionMs as s, DEFAULT_COMPLETED_RUN_RETENTION_MS as t, subscribeToRun as u };
