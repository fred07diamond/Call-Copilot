import { i as getDbExec } from "./client-BpA2t7pN.js";
import { ensureObservabilityTables, getAssignment, getExperiment, insertExperimentResult, listExperiments, upsertAssignment } from "./store-Db0lGCWt.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/observability/experiments.js
function simpleHash(str) {
	let hash = 0;
	for (let i = 0; i < str.length; i++) hash = (hash << 5) - hash + str.charCodeAt(i) | 0;
	return Math.abs(hash);
}
function generateId(prefix) {
	return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
var _cachedActive = null;
var _cachedActiveAt = 0;
var CACHE_TTL_MS = 5e3;
async function getActiveExperiments() {
	const now = Date.now();
	if (_cachedActive && now - _cachedActiveAt < CACHE_TTL_MS) return _cachedActive;
	_cachedActive = (await listExperiments()).filter((e) => e.status === "running");
	_cachedActiveAt = now;
	return _cachedActive;
}
async function resolveVariant(experimentId, userId) {
	const existing = await getAssignment(experimentId, userId);
	if (existing) {
		const experiment = await getExperiment(experimentId);
		if (!experiment) throw new Error(`Experiment ${experimentId} not found`);
		const variant = experiment.variants.find((v) => v.id === existing.variantId);
		if (!variant) throw new Error(`Variant ${existing.variantId} not found in experiment ${experimentId}`);
		return variant;
	}
	const experiment = await getExperiment(experimentId);
	if (!experiment) throw new Error(`Experiment ${experimentId} not found`);
	if (experiment.variants.length === 0) throw new Error("Experiment has no variants");
	const totalWeight = experiment.variants.reduce((sum, v) => sum + v.weight, 0);
	if (totalWeight <= 0) throw new Error("Experiment has no valid variant weights");
	const hashValue = simpleHash(experimentId + userId) % totalWeight;
	let cumulative = 0;
	let chosen;
	for (const variant of experiment.variants) {
		cumulative += variant.weight;
		if (hashValue < cumulative) {
			chosen = variant;
			break;
		}
	}
	if (!chosen) chosen = experiment.variants[experiment.variants.length - 1];
	upsertAssignment({
		experimentId,
		userId,
		variantId: chosen.id,
		assignedAt: Date.now()
	}).catch(() => {});
	return chosen;
}
async function resolveActiveExperimentConfig(userId) {
	const active = await getActiveExperiments();
	if (active.length === 0) return null;
	const assignments = [];
	const merged = {};
	const variants = await Promise.all(active.map((exp) => resolveVariant(exp.id, userId)));
	for (let i = 0; i < active.length; i++) {
		const exp = active[i];
		const variant = variants[i];
		assignments.push({
			experimentId: exp.id,
			variantId: variant.id
		});
		Object.assign(merged, variant.config);
	}
	return {
		configs: merged,
		assignments
	};
}
async function computeExperimentResults(experimentId) {
	const experiment = await getExperiment(experimentId);
	if (!experiment) throw new Error(`Experiment ${experimentId} not found`);
	await ensureObservabilityTables();
	const client = getDbExec();
	const results = [];
	const now = Date.now();
	for (const variant of experiment.variants) {
		const { rows: assignmentRows } = await client.execute({
			sql: `SELECT user_id FROM agent_experiment_assignments WHERE experiment_id = ? AND variant_id = ?`,
			args: [experimentId, variant.id]
		});
		if (assignmentRows.length === 0) {
			for (const metric of [
				"avg_cost",
				"avg_latency",
				"avg_eval_score",
				"tool_success_rate",
				"satisfaction",
				"sample_size"
			]) {
				const result = {
					id: generateId("expres"),
					experimentId,
					variantId: variant.id,
					metric,
					value: 0,
					sampleSize: 0,
					confidenceLow: 0,
					confidenceHigh: 0,
					computedAt: now
				};
				results.push(result);
				insertExperimentResult(result).catch(() => {});
			}
			continue;
		}
		const userIds = assignmentRows.map((r) => String(r.user_id));
		const placeholders = userIds.map(() => "?").join(", ");
		const { rows: userTraceRows } = await client.execute({
			sql: `SELECT s.total_cost_cents_x100, s.total_duration_ms, s.successful_tools, s.tool_calls, s.run_id
            FROM agent_trace_summaries s
            WHERE s.user_id IN (${placeholders})
            ${experiment.startedAt ? "AND s.created_at >= ?" : ""}`,
			args: experiment.startedAt ? [...userIds, experiment.startedAt] : userIds
		});
		const costs = [];
		const latencies = [];
		const toolRates = [];
		for (const row of userTraceRows) {
			costs.push(Number(row.total_cost_cents_x100) / 100);
			latencies.push(Number(row.total_duration_ms));
			const totalTools = Number(row.tool_calls);
			const successTools = Number(row.successful_tools);
			toolRates.push(totalTools > 0 ? successTools / totalTools : 1);
		}
		const runIds = userTraceRows.map((r) => String(r.run_id));
		let evalScores = [];
		if (runIds.length > 0) {
			const runPlaceholders = runIds.map(() => "?").join(", ");
			const { rows: evalRows } = await client.execute({
				sql: `SELECT score FROM agent_evals WHERE run_id IN (${runPlaceholders})`,
				args: runIds
			});
			evalScores = evalRows.map((r) => Number(r.score));
		}
		const { rows: satRows } = await client.execute({
			sql: `SELECT frustration_score FROM agent_satisfaction_scores
            WHERE thread_id IN (
              SELECT DISTINCT f.thread_id FROM agent_feedback f
              WHERE f.user_id IN (${placeholders}) AND f.thread_id IS NOT NULL
            )
            ${experiment.startedAt ? "AND computed_at >= ?" : ""}`,
			args: experiment.startedAt ? [...userIds, experiment.startedAt] : userIds
		});
		const satisfactionScores = satRows.map((r) => 1 - Number(r.frustration_score) / 100);
		const sampleSize = userTraceRows.length;
		const metricEntries = [
			{
				metric: "avg_cost",
				value: mean(costs),
				std: stddev(costs),
				n: costs.length
			},
			{
				metric: "avg_latency",
				value: mean(latencies),
				std: stddev(latencies),
				n: latencies.length
			},
			{
				metric: "avg_eval_score",
				value: mean(evalScores),
				std: stddev(evalScores),
				n: evalScores.length
			},
			{
				metric: "tool_success_rate",
				value: mean(toolRates),
				std: stddev(toolRates),
				n: toolRates.length
			},
			{
				metric: "satisfaction",
				value: mean(satisfactionScores),
				std: stddev(satisfactionScores),
				n: satisfactionScores.length
			},
			{
				metric: "sample_size",
				value: sampleSize,
				std: 0,
				n: sampleSize
			}
		];
		for (const entry of metricEntries) {
			const [low, high] = confidenceInterval(entry.value, entry.std, entry.n);
			const result = {
				id: generateId("expres"),
				experimentId,
				variantId: variant.id,
				metric: entry.metric,
				value: entry.value,
				sampleSize,
				confidenceLow: low,
				confidenceHigh: high,
				computedAt: now
			};
			results.push(result);
			insertExperimentResult(result).catch(() => {});
		}
	}
	return results;
}
function mean(values) {
	if (values.length === 0) return 0;
	return values.reduce((a, b) => a + b, 0) / values.length;
}
function stddev(values) {
	if (values.length < 2) return 0;
	const avg = mean(values);
	const squaredDiffs = values.map((v) => (v - avg) ** 2);
	return Math.sqrt(squaredDiffs.reduce((a, b) => a + b, 0) / (values.length - 1));
}
function confidenceInterval(avg, std, n) {
	if (n < 2) return [avg, avg];
	const margin = 1.96 * (std / Math.sqrt(n));
	return [avg - margin, avg + margin];
}
//#endregion
export { computeExperimentResults, resolveActiveExperimentConfig };
