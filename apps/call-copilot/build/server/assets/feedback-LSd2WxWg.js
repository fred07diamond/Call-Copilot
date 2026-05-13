import { i as getDbExec } from "./client-BpA2t7pN.js";
import { ensureObservabilityTables, upsertSatisfactionScore } from "./store-Db0lGCWt.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/observability/feedback.js
async function getThreadMessages(threadId) {
	await ensureObservabilityTables();
	const { rows } = await getDbExec().execute({
		sql: `SELECT thread_data FROM chat_threads WHERE id = ?`,
		args: [threadId]
	});
	if (rows.length === 0) return [];
	const raw = rows[0].thread_data;
	if (!raw) return [];
	try {
		const data = JSON.parse(String(raw));
		const messages = data.messages ?? data;
		if (!Array.isArray(messages)) return [];
		return messages.filter((m) => m && typeof m.role === "string" && (typeof m.content === "string" || Array.isArray(m.content) && m.content.some((p) => p.type === "text"))).map((m) => ({
			role: m.role,
			content: typeof m.content === "string" ? m.content : m.content.filter((p) => p.type === "text").map((p) => p.text ?? "").join(""),
			createdAt: m.createdAt ? Number(m.createdAt) : void 0
		}));
	} catch {
		return [];
	}
}
function tokenize(text) {
	return new Set(text.toLowerCase().replace(/[^a-z0-9\s]/g, "").split(/\s+/).filter((w) => w.length > 1));
}
function jaccardSimilarity(a, b) {
	if (a.size === 0 && b.size === 0) return 0;
	let intersection = 0;
	for (const word of a) if (b.has(word)) intersection++;
	const union = a.size + b.size - intersection;
	return union === 0 ? 0 : intersection / union;
}
function computeRephrasingScore(userMessages) {
	if (userMessages.length < 2) return 0;
	const tokenSets = userMessages.map(tokenize);
	let maxConsecutiveSimilarity = 0;
	let highSimilarityCount = 0;
	for (let i = 1; i < tokenSets.length; i++) {
		const sim = jaccardSimilarity(tokenSets[i - 1], tokenSets[i]);
		if (sim > maxConsecutiveSimilarity) maxConsecutiveSimilarity = sim;
		if (sim >= .4) highSimilarityCount++;
	}
	const pairCount = tokenSets.length - 1;
	const rephrasingRatio = pairCount > 0 ? highSimilarityCount / pairCount : 0;
	return Math.min(100, (maxConsecutiveSimilarity * 60 + rephrasingRatio * 40) * 100 / 100);
}
function computeAbandonmentScore(messages) {
	if (messages.length === 0) return 0;
	if (messages[messages.length - 1].role === "user") return 80;
	if (messages.length >= 3) {
		const secondToLast = messages[messages.length - 2];
		if (secondToLast.role === "user") {
			if (secondToLast.content.trim().length < 15) return 40;
		}
	}
	return 0;
}
var NEGATIVE_PATTERNS = [
	/\bno\b/i,
	/\bwrong\b/i,
	/\bnot what i/i,
	/\btry again\b/i,
	/\bnever mind\b/i,
	/\bnevermind\b/i,
	/\bthat's not\b/i,
	/\bthats not\b/i,
	/\bincorrect\b/i,
	/\bdoesn't work\b/i,
	/\bdoesnt work\b/i,
	/\bstill wrong\b/i,
	/\bnope\b/i,
	/\bstop\b/i,
	/\bforget it\b/i,
	/\buseless\b/i,
	/\bbroken\b/i
];
function computeSentimentScore(userMessages) {
	if (userMessages.length === 0) return 0;
	let negativeCount = 0;
	let terseCount = 0;
	for (const msg of userMessages) {
		const trimmed = msg.trim();
		if (trimmed.split(/\s+/).length <= 2 && trimmed.length < 20) terseCount++;
		for (const pattern of NEGATIVE_PATTERNS) if (pattern.test(trimmed)) {
			negativeCount++;
			break;
		}
	}
	const negativeRatio = negativeCount / userMessages.length;
	const terseRatio = terseCount / userMessages.length;
	return Math.min(100, (negativeRatio * 70 + terseRatio * 30) * 100);
}
function computeLengthTrendScore(userMessages) {
	if (userMessages.length < 3) return 0;
	const lengths = userMessages.map((m) => m.trim().length);
	const n = lengths.length;
	const xMean = (n - 1) / 2;
	const yMean = lengths.reduce((a, b) => a + b, 0) / n;
	let numerator = 0;
	let denominator = 0;
	for (let i = 0; i < n; i++) {
		const xDiff = i - xMean;
		numerator += xDiff * (lengths[i] - yMean);
		denominator += xDiff * xDiff;
	}
	if (denominator === 0) return 0;
	const slope = numerator / denominator;
	if (yMean === 0) return 0;
	const normalizedSlope = slope / yMean;
	if (normalizedSlope >= 0) return 0;
	return Math.min(100, Math.abs(normalizedSlope) * 100);
}
var RETRY_PATTERNS = [
	/\btry again\b/i,
	/\bthat's wrong\b/i,
	/\bthats wrong\b/i,
	/\bno,?\s*(that's|thats|it's|its)\b/i,
	/\bredo\b/i,
	/\bdo it again\b/i,
	/\bone more time\b/i,
	/\bregenerate\b/i,
	/\bfix (it|this|that)\b/i,
	/\btry (this|that) instead\b/i,
	/\bi (said|meant|asked)\b/i,
	/\bstill (not|wrong|broken|doesn't|doesnt)\b/i
];
function computeRetryScore(userMessages) {
	if (userMessages.length === 0) return 0;
	let retryCount = 0;
	for (const msg of userMessages) for (const pattern of RETRY_PATTERNS) if (pattern.test(msg)) {
		retryCount++;
		break;
	}
	const retryRatio = retryCount / userMessages.length;
	return Math.min(100, retryRatio * 150);
}
async function computeSatisfactionScore(threadId, opts = {}) {
	const messages = await getThreadMessages(threadId);
	const userMessages = messages.filter((m) => m.role === "user").map((m) => m.content);
	const rephrasingScore = computeRephrasingScore(userMessages);
	const abandonmentScore = computeAbandonmentScore(messages);
	const sentimentScore = computeSentimentScore(userMessages);
	const lengthTrendScore = computeLengthTrendScore(userMessages);
	const retryScore = computeRetryScore(userMessages);
	const frustrationScore = Math.min(100, rephrasingScore * .3 + abandonmentScore * .2 + sentimentScore * .15 + lengthTrendScore * .15 + retryScore * .2);
	const score = {
		id: `sat-${threadId}`,
		threadId,
		userId: opts.userId ?? null,
		frustrationScore: Math.round(frustrationScore * 100) / 100,
		rephrasingScore: Math.round(rephrasingScore * 100) / 100,
		abandonmentScore: Math.round(abandonmentScore * 100) / 100,
		sentimentScore: Math.round(sentimentScore * 100) / 100,
		lengthTrendScore: Math.round(lengthTrendScore * 100) / 100,
		computedAt: Date.now()
	};
	await upsertSatisfactionScore(score);
	return score;
}
//#endregion
export { computeSatisfactionScore };
