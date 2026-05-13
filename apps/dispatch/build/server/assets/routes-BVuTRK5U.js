import { b as setResponseStatus, c as getMethod, i as defineEventHandler, l as getQuery } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-CmxO0LxM.js";
import { r as getSession } from "./auth-CvO2kpTD.js";
import { getEvalStats, getEvalsForRun, getExperiment, getExperimentResults, getFeedback, getFeedbackStats, getObservabilityOverview, getSatisfactionScores, getTraceSpansForRun, getTraceSummaries, getTraceSummary, insertExperiment, insertFeedback, listExperiments, updateExperiment } from "./store-Be0u8_dU.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/observability/routes.js
/**
* H3 event handlers for the agent observability system.
*
* Mounted under `/_agent-native/observability/*` by the observability plugin.
*
*   GET    /                           — overview stats
*   GET    /traces?since=N&limit=N     — list trace summaries
*   GET    /traces/:runId              — get trace detail (spans + summary)
*   GET    /traces/:runId/evals        — get evals for a run
*   POST   /feedback                   — submit feedback
*   GET    /feedback?since=N&limit=N   — list feedback entries
*   GET    /feedback/stats?since=N     — feedback aggregation stats
*   GET    /satisfaction?since=N       — satisfaction scores
*   GET    /evals/stats?since=N        — eval stats
*   GET    /experiments                — list experiments
*   POST   /experiments                — create experiment
*   GET    /experiments/:id            — get experiment detail
*   PUT    /experiments/:id            — update experiment
*   POST   /experiments/:id/results    — compute experiment results
*   GET    /experiments/:id/results    — get experiment results
*/
function nanoid(size = 21) {
	const alphabet = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	let id = "";
	const bytes = crypto.getRandomValues(new Uint8Array(size));
	for (let i = 0; i < size; i++) id += alphabet[bytes[i] % 62];
	return id;
}
async function resolveOwner(event) {
	const session = await getSession(event).catch(() => null);
	if (!session?.email) {
		const { createError } = await import("./node-DxyfkX8_.js").then((n) => n.t);
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthenticated"
		});
	}
	return session.email;
}
function parseSince(q) {
	const raw = q.since;
	if (typeof raw === "string" && raw.length > 0) {
		const n = Number(raw);
		if (!isNaN(n) && n >= 0) return n;
	}
	return Date.now() - 7 * 864e5;
}
function parseLimit(q, fallback = 100) {
	const raw = q.limit;
	if (typeof raw === "string") {
		const n = Number(raw);
		if (!isNaN(n) && n > 0) return Math.min(n, 500);
	}
	return fallback;
}
function createObservabilityHandler() {
	return defineEventHandler(async (event) => {
		const rawMethod = getMethod(event);
		const method = rawMethod === "HEAD" ? "GET" : rawMethod;
		const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
		const parts = pathname ? pathname.split("/") : [];
		const owner = await resolveOwner(event);
		if (method === "GET" && parts.length === 0) return getObservabilityOverview(parseSince(getQuery(event)), { userId: owner });
		if (method === "GET" && parts.length === 1 && parts[0] === "traces") {
			const q = getQuery(event);
			return getTraceSummaries({
				sinceMs: parseSince(q),
				limit: parseLimit(q),
				userId: owner
			});
		}
		if (method === "GET" && parts.length === 3 && parts[0] === "traces" && parts[2] === "evals") return getEvalsForRun(decodeURIComponent(parts[1]), { userId: owner });
		if (method === "GET" && parts.length === 2 && parts[0] === "traces") {
			const runId = decodeURIComponent(parts[1]);
			const [summary, spans] = await Promise.all([getTraceSummary(runId, { userId: owner }), getTraceSpansForRun(runId, { userId: owner })]);
			if (!summary) {
				setResponseStatus(event, 404);
				return { error: "Trace not found" };
			}
			return {
				summary,
				spans
			};
		}
		if (method === "GET" && parts.length === 2 && parts[0] === "feedback" && parts[1] === "stats") return getFeedbackStats(parseSince(getQuery(event)), { userId: owner });
		if (method === "POST" && parts.length === 1 && parts[0] === "feedback") {
			let body;
			try {
				body = await readBody(event);
			} catch {
				setResponseStatus(event, 400);
				return { error: "Invalid JSON body" };
			}
			const feedbackType = body?.feedbackType;
			if (!feedbackType || ![
				"thumbs_up",
				"thumbs_down",
				"category",
				"text"
			].includes(feedbackType)) {
				setResponseStatus(event, 400);
				return { error: "feedbackType is required" };
			}
			const rawValue = body.value;
			const value = rawValue == null ? "" : typeof rawValue === "object" ? JSON.stringify(rawValue) : String(rawValue);
			const id = nanoid();
			await insertFeedback({
				id,
				runId: body.runId ? String(body.runId) : null,
				threadId: body.threadId ? String(body.threadId) : null,
				messageSeq: typeof body.messageSeq === "number" ? body.messageSeq : null,
				feedbackType,
				value,
				userId: owner,
				createdAt: Date.now()
			});
			if (body.threadId) import("./feedback-BhEBTBAF.js").then(({ computeSatisfactionScore }) => computeSatisfactionScore(String(body.threadId), { userId: owner }).catch(() => {})).catch(() => {});
			return { id };
		}
		if (method === "GET" && parts.length === 1 && parts[0] === "feedback") {
			const q = getQuery(event);
			return getFeedback({
				sinceMs: parseSince(q),
				limit: parseLimit(q),
				userId: owner
			});
		}
		if (method === "GET" && parts.length === 1 && parts[0] === "satisfaction") return getSatisfactionScores({
			sinceMs: parseSince(getQuery(event)),
			userId: owner
		});
		if (method === "GET" && parts.length === 2 && parts[0] === "evals" && parts[1] === "stats") return getEvalStats(parseSince(getQuery(event)), { userId: owner });
		if (method === "POST" && parts.length === 1 && parts[0] === "experiments") {
			let body;
			try {
				body = await readBody(event);
			} catch {
				setResponseStatus(event, 400);
				return { error: "Invalid JSON body" };
			}
			if (!body?.name) {
				setResponseStatus(event, 400);
				return { error: "name is required" };
			}
			if (body.variants !== void 0 && !Array.isArray(body.variants)) {
				setResponseStatus(event, 400);
				return { error: "variants must be an array" };
			}
			const id = nanoid();
			await insertExperiment({
				id,
				name: String(body.name),
				status: "draft",
				variants: Array.isArray(body.variants) ? body.variants : [],
				metrics: Array.isArray(body.metrics) ? body.metrics : [],
				assignmentLevel: body.assignmentLevel === "session" ? "session" : "user",
				startedAt: null,
				endedAt: null,
				createdAt: Date.now(),
				ownerEmail: owner
			});
			return { id };
		}
		if (method === "GET" && parts.length === 1 && parts[0] === "experiments") return listExperiments();
		if (method === "POST" && parts.length === 3 && parts[0] === "experiments" && parts[2] === "results") {
			const id = decodeURIComponent(parts[1]);
			const existing = await getExperiment(id);
			if (!existing) {
				setResponseStatus(event, 404);
				return { error: "Experiment not found" };
			}
			if (existing.ownerEmail && existing.ownerEmail !== owner) {
				setResponseStatus(event, 404);
				return { error: "Experiment not found" };
			}
			try {
				const { computeExperimentResults } = await import("./experiments-DmsQzrOI.js");
				return await computeExperimentResults(id);
			} catch (err) {
				setResponseStatus(event, 500);
				return { error: err?.message ?? "Failed to compute results" };
			}
		}
		if (method === "GET" && parts.length === 3 && parts[0] === "experiments" && parts[2] === "results") return getExperimentResults(decodeURIComponent(parts[1]));
		if (method === "PUT" && parts.length === 2 && parts[0] === "experiments") {
			const id = decodeURIComponent(parts[1]);
			const existing = await getExperiment(id);
			if (!existing) {
				setResponseStatus(event, 404);
				return { error: "Experiment not found" };
			}
			if (existing.ownerEmail && existing.ownerEmail !== owner) {
				setResponseStatus(event, 404);
				return { error: "Experiment not found" };
			}
			let body;
			try {
				body = await readBody(event);
			} catch {
				setResponseStatus(event, 400);
				return { error: "Invalid JSON body" };
			}
			const updates = {};
			if (typeof body.name === "string") updates.name = body.name;
			if (typeof body.status === "string") {
				const s = body.status;
				if (![
					"draft",
					"running",
					"paused",
					"completed"
				].includes(s)) {
					setResponseStatus(event, 400);
					return { error: "Invalid status" };
				}
				updates.status = s;
				if (s === "completed") updates.endedAt = Date.now();
			}
			if (Array.isArray(body.variants)) updates.variants = body.variants;
			if (Array.isArray(body.metrics)) updates.metrics = body.metrics;
			await updateExperiment(id, updates);
			return { ok: true };
		}
		if (method === "GET" && parts.length === 2 && parts[0] === "experiments") {
			const exp = await getExperiment(decodeURIComponent(parts[1]));
			if (!exp) {
				setResponseStatus(event, 404);
				return { error: "Experiment not found" };
			}
			return exp;
		}
		setResponseStatus(event, 404);
		return { error: "Not found" };
	});
}
//#endregion
export { createObservabilityHandler };
