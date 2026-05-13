//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/observability/types.js
/**
* Shared types for the agent observability system.
*
* Covers traces, feedback, evals, experiments, and satisfaction scoring.
* Each domain module imports from here so the data model is consistent
* across the entire observability stack.
*/
var DEFAULT_OBSERVABILITY_CONFIG = {
	enabled: true,
	capturePrompts: false,
	captureToolArgs: false,
	captureToolResults: false,
	evalSampleRate: 0,
	exporters: []
};
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/observability/traces.js
function spanId() {
	return `span-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
/** Keys whose values are stripped from persisted tool inputs when
*  `captureToolArgs` is enabled. Matched case-insensitively and tolerant
*  of `_` / `-` separators. M14 in the MCP/A2A audit: tool calls
*  routinely receive credentials verbatim (db-exec INSERTs, fetchTool
*  Authorization headers, ad-hoc bearer tokens) — keeping those values
*  out of agent_trace_spans.metadata avoids long-term storage of
*  short-lived secrets. */
var SENSITIVE_FIELD_PATTERN = /^(authorization|cookie|api[_-]?key|password|secret|token|access[_-]?token|refresh[_-]?token|bearer)$/i;
/** Recursively walk a structured value and replace sensitive field
*  values with the literal string "[REDACTED]". Pure (returns a copy);
*  the original input is never mutated. Cycles are tolerated via a
*  small WeakSet seen-tracker that returns "[Circular]" for repeats. */
function redactSensitiveFields(value) {
	return redactWalk(value, /* @__PURE__ */ new WeakSet());
}
function redactWalk(value, seen) {
	if (value === null || typeof value !== "object") return value;
	if (seen.has(value)) return "[Circular]";
	seen.add(value);
	if (Array.isArray(value)) return value.map((v) => redactWalk(v, seen));
	const out = {};
	for (const [k, v] of Object.entries(value)) if (SENSITIVE_FIELD_PATTERN.test(k)) out[k] = "[REDACTED]";
	else out[k] = redactWalk(v, seen);
	return out;
}
async function getObservabilityConfig() {
	try {
		const { getSetting } = await import("./store-BTTw68Ec.js");
		const stored = await getSetting("observability-config");
		if (stored) return {
			...DEFAULT_OBSERVABILITY_CONFIG,
			...stored
		};
	} catch {}
	return DEFAULT_OBSERVABILITY_CONFIG;
}
async function instrumentAgentLoop(opts) {
	const { runAgentLoop, loopOpts, runId, threadId, userId, config } = opts;
	const runStart = Date.now();
	const parentSpanId = spanId();
	const spans = [];
	let toolInvocationCounter = 0;
	const pendingTools = /* @__PURE__ */ new Map();
	const toolNameToCounter = /* @__PURE__ */ new Map();
	let toolCallCount = 0;
	let successfulTools = 0;
	let failedTools = 0;
	const instrumentedSend = (event) => {
		try {
			if (event.type === "tool_start") {
				const counter = toolInvocationCounter++;
				const sid = spanId();
				pendingTools.set(counter, {
					spanId: sid,
					startMs: Date.now(),
					toolName: event.tool,
					input: event.input
				});
				toolNameToCounter.set(event.tool, counter);
			} else if (event.type === "tool_done") {
				const counter = toolNameToCounter.get(event.tool);
				const pending = counter !== void 0 ? pendingTools.get(counter) : void 0;
				if (counter !== void 0) {
					pendingTools.delete(counter);
					toolNameToCounter.delete(event.tool);
				}
				toolCallCount++;
				const isError = typeof event.result === "string" && (event.result.startsWith("Error") || event.result.startsWith("Error running "));
				if (isError) failedTools++;
				else successfulTools++;
				const span = {
					id: pending?.spanId ?? spanId(),
					runId,
					threadId,
					userId,
					parentSpanId,
					spanType: "tool_call",
					name: event.tool,
					inputTokens: 0,
					outputTokens: 0,
					cacheReadTokens: 0,
					cacheWriteTokens: 0,
					costCentsX100: 0,
					durationMs: pending ? Date.now() - pending.startMs : 0,
					status: isError ? "error" : "success",
					errorMessage: isError ? event.result : null,
					metadata: config.captureToolArgs && pending ? { input: redactSensitiveFields(pending.input) } : null,
					createdAt: Date.now()
				};
				spans.push(span);
			}
		} catch {}
		loopOpts.send(event);
	};
	let usage;
	let runStatus = "success";
	let errorMessage = null;
	try {
		usage = await runAgentLoop({
			...loopOpts,
			send: instrumentedSend
		});
	} catch (err) {
		runStatus = "error";
		errorMessage = err?.message ?? String(err);
		throw err;
	} finally {
		const totalDurationMs = Date.now() - runStart;
		let costCentsX100 = 0;
		try {
			const { calculateCost } = await import("./store-DLJtZzM5.js");
			if (usage) costCentsX100 = calculateCost(usage.inputTokens, usage.outputTokens, usage.model, usage.cacheReadTokens, usage.cacheWriteTokens);
		} catch {}
		let llmCallCount = 0;
		if (usage) {
			llmCallCount = 1;
			const llmSpan = {
				id: spanId(),
				runId,
				threadId,
				userId,
				parentSpanId,
				spanType: "llm_call",
				name: usage.model,
				inputTokens: usage.inputTokens,
				outputTokens: usage.outputTokens,
				cacheReadTokens: usage.cacheReadTokens,
				cacheWriteTokens: usage.cacheWriteTokens,
				costCentsX100,
				durationMs: totalDurationMs,
				status: runStatus,
				errorMessage,
				metadata: null,
				createdAt: runStart
			};
			spans.push(llmSpan);
		}
		const parentSpan = {
			id: parentSpanId,
			runId,
			threadId,
			userId,
			parentSpanId: null,
			spanType: "agent_run",
			name: "agent_run",
			inputTokens: usage?.inputTokens ?? 0,
			outputTokens: usage?.outputTokens ?? 0,
			cacheReadTokens: usage?.cacheReadTokens ?? 0,
			cacheWriteTokens: usage?.cacheWriteTokens ?? 0,
			costCentsX100,
			durationMs: totalDurationMs,
			status: runStatus,
			errorMessage,
			metadata: null,
			createdAt: runStart
		};
		spans.push(parentSpan);
		writeTraceData(spans, {
			runId,
			threadId,
			userId,
			totalSpans: spans.length,
			llmCalls: llmCallCount,
			toolCalls: toolCallCount,
			successfulTools,
			failedTools,
			totalDurationMs,
			totalCostCentsX100: costCentsX100,
			totalInputTokens: usage?.inputTokens ?? 0,
			totalOutputTokens: usage?.outputTokens ?? 0,
			model: usage?.model ?? loopOpts.model,
			createdAt: runStart
		}, runId, config).catch(() => {});
	}
	return usage;
}
async function writeTraceData(spans, summary, runId, config) {
	const { insertTraceSpan, upsertTraceSummary } = await import("./store-Be0u8_dU.js");
	await Promise.all(spans.map((s) => insertTraceSpan(s).catch(() => {})));
	await upsertTraceSummary(summary).catch(() => {});
	try {
		const { evaluateRun } = await import("./evals-wmPyx2Qf.js");
		await evaluateRun(runId, { sampleRate: config.evalSampleRate });
	} catch {}
}
//#endregion
export { getObservabilityConfig, instrumentAgentLoop };
