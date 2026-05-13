import { i as getStoredModelForEngine, l as resolveEngine } from "./registry-B0ticQi1.js";
import "./engine-DqVnItAv.js";
import { l as getRunEventsSince, s as getRunById } from "./run-store-DA-8ft5d.js";
import { getTraceSummary, insertEvalResult } from "./store-Db0lGCWt.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/observability/evals.js
var LATENCY_BASELINE_PER_TOOL_MS = 1e4;
var COST_BASELINE_PER_TOOL_CX100 = 50;
var LLM_JUDGE_TIMEOUT_MS = 3e4;
function makeEvalResult(opts) {
	return {
		id: crypto.randomUUID(),
		runId: opts.runId,
		threadId: opts.threadId,
		userId: opts.userId,
		evalType: opts.evalType,
		criteria: opts.criteria,
		score: Math.max(0, Math.min(1, opts.score)),
		reasoning: opts.reasoning ?? null,
		metadata: opts.metadata ?? null,
		createdAt: Date.now()
	};
}
/** Lift the (runId, threadId, userId) triple off a TraceSummary —
*  every automated scorer pulls these together. */
function fromSummary(summary) {
	return {
		runId: summary.runId,
		threadId: summary.threadId,
		userId: summary.userId
	};
}
function scoreToolSuccessRate(summary) {
	const total = summary.toolCalls;
	const score = total > 0 ? summary.successfulTools / total : 1;
	return makeEvalResult({
		...fromSummary(summary),
		evalType: "automated",
		criteria: "tool_success_rate",
		score,
		metadata: {
			totalTools: total,
			successfulTools: summary.successfulTools,
			failedTools: summary.failedTools
		}
	});
}
function scoreStepEfficiency(summary) {
	const score = summary.toolCalls === 0 ? 1 : summary.llmCalls > 0 ? Math.min(1, summary.toolCalls / summary.llmCalls) : 1;
	return makeEvalResult({
		...fromSummary(summary),
		evalType: "automated",
		criteria: "step_efficiency",
		score,
		metadata: {
			llmCalls: summary.llmCalls,
			toolCalls: summary.toolCalls
		}
	});
}
function scoreLatency(summary) {
	const expectedMs = Math.max(LATENCY_BASELINE_PER_TOOL_MS, summary.toolCalls * LATENCY_BASELINE_PER_TOOL_MS);
	const score = Math.max(0, 1 - summary.totalDurationMs / expectedMs);
	return makeEvalResult({
		...fromSummary(summary),
		evalType: "automated",
		criteria: "latency_score",
		score,
		metadata: {
			actualMs: summary.totalDurationMs,
			expectedMs
		}
	});
}
function scoreCostEfficiency(summary) {
	const expectedCx100 = Math.max(COST_BASELINE_PER_TOOL_CX100, summary.toolCalls * COST_BASELINE_PER_TOOL_CX100);
	const score = Math.max(0, 1 - summary.totalCostCentsX100 / expectedCx100);
	return makeEvalResult({
		...fromSummary(summary),
		evalType: "automated",
		criteria: "cost_efficiency",
		score,
		metadata: {
			actualCx100: summary.totalCostCentsX100,
			expectedCx100
		}
	});
}
function scoreErrorRecovery(summary, runStatus) {
	const hadErrors = summary.failedTools > 0;
	let score;
	if (!hadErrors) score = 1;
	else if (runStatus === "completed") score = 1;
	else score = 0;
	return makeEvalResult({
		...fromSummary(summary),
		evalType: "automated",
		criteria: "error_recovery",
		score,
		metadata: {
			hadErrors,
			runStatus
		}
	});
}
async function runAutomatedEvals(runId) {
	const [summary, run] = await Promise.all([getTraceSummary(runId), getRunById(runId)]);
	if (!summary) return [];
	const runStatus = run?.status ?? "unknown";
	const results = [
		scoreToolSuccessRate(summary),
		scoreStepEfficiency(summary),
		scoreLatency(summary),
		scoreCostEfficiency(summary),
		scoreErrorRecovery(summary, runStatus)
	];
	for (const result of results) insertEvalResult(result).catch(() => {});
	return results;
}
function buildConversationTranscript(events) {
	const lines = [];
	for (const { eventData } of events) try {
		const event = JSON.parse(eventData);
		if (event.type === "user-message") lines.push(`[User]: ${event.text ?? JSON.stringify(event.content)}`);
		else if (event.type === "text-delta" || event.type === "text") lines.push(`[Agent]: ${event.text}`);
		else if (event.type === "tool-call") lines.push(`[Tool Call: ${event.name}] ${JSON.stringify(event.input)}`);
		else if (event.type === "tool-result") {
			const snippet = typeof event.content === "string" ? event.content.slice(0, 500) : JSON.stringify(event.content).slice(0, 500);
			lines.push(`[Tool Result${event.isError ? " (ERROR)" : ""}]: ${snippet}`);
		}
	} catch {}
	return lines.join("\n");
}
function buildJudgePrompt(transcript, criteria) {
	let prompt = `You are an expert evaluator. Assess the following agent conversation against the given criteria.

## Criteria
Name: ${criteria.name}
Description: ${criteria.description}`;
	if (criteria.rubric) prompt += `\nRubric: ${criteria.rubric}`;
	const min = criteria.scoreRange?.min ?? 0;
	const max = criteria.scoreRange?.max ?? 1;
	prompt += `

## Conversation Transcript
${transcript}

## Instructions
Evaluate the conversation and respond with ONLY a JSON object (no markdown, no explanation outside the JSON):
{"score": <number between ${min} and ${max}>, "reasoning": "<brief explanation>"}`;
	return prompt;
}
async function runLlmJudgeEval(runId, criteria, opts) {
	try {
		const [events, run] = await Promise.all([getRunEventsSince(runId, 0), getRunById(runId)]);
		if (events.length === 0) return null;
		const transcript = buildConversationTranscript(events);
		if (!transcript.trim()) return null;
		const engine = opts?.engine ?? await resolveEngine({ engineOption: void 0 });
		const model = opts?.model ?? await getStoredModelForEngine(engine) ?? engine.defaultModel;
		const judgePrompt = buildJudgePrompt(transcript, criteria);
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), LLM_JUDGE_TIMEOUT_MS);
		let responseText = "";
		try {
			const stream = engine.stream({
				model,
				systemPrompt: "You are an evaluation judge. Respond only with valid JSON.",
				messages: [{
					role: "user",
					content: [{
						type: "text",
						text: judgePrompt
					}]
				}],
				tools: [],
				abortSignal: controller.signal,
				maxOutputTokens: 512,
				temperature: 0
			});
			for await (const event of stream) if (event.type === "text-delta") responseText += event.text;
		} finally {
			clearTimeout(timeout);
		}
		const jsonMatch = responseText.match(/\{[\s\S]*\}/);
		if (!jsonMatch) return null;
		const parsed = JSON.parse(jsonMatch[0]);
		const min = criteria.scoreRange?.min ?? 0;
		const max = criteria.scoreRange?.max ?? 1;
		const normalizedScore = max > min ? (parsed.score - min) / (max - min) : parsed.score;
		const result = makeEvalResult({
			runId,
			threadId: run?.threadId ?? null,
			userId: opts?.userId ?? null,
			evalType: "llm_judge",
			criteria: criteria.name,
			score: normalizedScore,
			reasoning: parsed.reasoning,
			metadata: {
				model,
				rawScore: parsed.score,
				scoreRange: {
					min,
					max
				}
			}
		});
		insertEvalResult(result).catch(() => {});
		return result;
	} catch {
		return null;
	}
}
async function evaluateRun(runId, opts) {
	const results = await runAutomatedEvals(runId);
	const userId = results[0]?.userId ?? null;
	const sampleRate = opts?.sampleRate ?? 0;
	if (sampleRate > 0 && Math.random() < sampleRate) {
		const judgeResults = await Promise.all([{
			name: "overall_quality",
			description: "Overall quality of the agent's response, considering helpfulness, accuracy, and appropriate tool usage."
		}, {
			name: "task_completion",
			description: "Whether the agent successfully completed the user's requested task."
		}].map((c) => runLlmJudgeEval(runId, c, { userId })));
		for (const r of judgeResults) if (r) results.push(r);
	}
	return results;
}
//#endregion
export { evaluateRun };
