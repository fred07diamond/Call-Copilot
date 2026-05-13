import { i as getDbExec } from "./client-BpA2t7pN.js";
import { n as getUserSetting, r as putUserSetting, t as deleteUserSetting } from "./user-settings-DsisKP7R.js";
import { n as getOrgSetting, r as putOrgSetting, t as deleteOrgSetting } from "./settings-CYkHNmre.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/agent/loop-settings.js
var AGENT_LOOP_SETTINGS_KEY = "agent-loop";
var MAX_AGENT_MAX_ITERATIONS = 1e3;
function parseInteger(value) {
	if (typeof value === "string" && value.trim() === "") return null;
	const n = typeof value === "number" ? value : typeof value === "string" ? Number(value) : null;
	if (n == null || !Number.isFinite(n)) return null;
	if (!Number.isInteger(n)) return null;
	return n;
}
function normalizeMaxIterations(value, fallback = 100) {
	const parsed = parseInteger(value);
	if (parsed == null) return fallback;
	return Math.min(MAX_AGENT_MAX_ITERATIONS, Math.max(1, parsed));
}
function validateMaxIterationsInput(value) {
	const parsed = parseInteger(value);
	if (parsed == null) return {
		ok: false,
		error: "maxIterations must be an integer."
	};
	if (parsed < 1) return {
		ok: false,
		error: `maxIterations must be at least 1.`
	};
	if (parsed > 1e3) return {
		ok: false,
		error: `maxIterations must be at most ${MAX_AGENT_MAX_ITERATIONS}.`
	};
	return {
		ok: true,
		value: parsed
	};
}
function envDefaultSource() {
	return parseInteger(process.env.AGENT_MAX_ITERATIONS) == null ? "default" : "env";
}
function getDefaultMaxIterations() {
	return normalizeMaxIterations(process.env.AGENT_MAX_ITERATIONS, 100);
}
function fromStored(stored, source, scope) {
	const defaultMaxIterations = getDefaultMaxIterations();
	const hasStoredValue = stored && Object.prototype.hasOwnProperty.call(stored, "maxIterations");
	return {
		maxIterations: hasStoredValue ? normalizeMaxIterations(stored.maxIterations, defaultMaxIterations) : defaultMaxIterations,
		defaultMaxIterations,
		minMaxIterations: 1,
		maxMaxIterations: MAX_AGENT_MAX_ITERATIONS,
		scope,
		source: hasStoredValue ? source : envDefaultSource()
	};
}
async function readAgentLoopSettings(ctx) {
	if (ctx.orgId) return fromStored(await getOrgSetting(ctx.orgId, AGENT_LOOP_SETTINGS_KEY), "org", "org");
	if (ctx.userEmail) return fromStored(await getUserSetting(ctx.userEmail, AGENT_LOOP_SETTINGS_KEY), "user", "user");
	return fromStored(null, "default", "default");
}
async function writeAgentLoopSettings(ctx, maxIterations) {
	const validation = validateMaxIterationsInput(maxIterations);
	if (validation.ok === false) throw new Error(validation.error);
	if (ctx.orgId) {
		await putOrgSetting(ctx.orgId, AGENT_LOOP_SETTINGS_KEY, { maxIterations: validation.value });
		return readAgentLoopSettings(ctx);
	}
	if (!ctx.userEmail) throw new Error("Authentication required to update agent loop settings.");
	await putUserSetting(ctx.userEmail, AGENT_LOOP_SETTINGS_KEY, { maxIterations: validation.value });
	return readAgentLoopSettings(ctx);
}
async function resetAgentLoopSettings(ctx) {
	if (ctx.orgId) {
		await deleteOrgSetting(ctx.orgId, AGENT_LOOP_SETTINGS_KEY);
		return readAgentLoopSettings(ctx);
	}
	if (!ctx.userEmail) throw new Error("Authentication required to update agent loop settings.");
	await deleteUserSetting(ctx.userEmail, AGENT_LOOP_SETTINGS_KEY);
	return readAgentLoopSettings(ctx);
}
async function canUpdateAgentLoopSettings(userEmail, orgId) {
	if (!userEmail) return false;
	if (!orgId) return true;
	try {
		const { rows } = await getDbExec().execute({
			sql: `SELECT role FROM org_members WHERE org_id = ? AND LOWER(email) = ? LIMIT 1`,
			args: [orgId, userEmail.toLowerCase()]
		});
		const role = String(rows[0]?.role ?? "");
		return role === "owner" || role === "admin";
	} catch {
		return false;
	}
}
//#endregion
export { resetAgentLoopSettings as a, readAgentLoopSettings as i, getDefaultMaxIterations as n, validateMaxIterationsInput as o, normalizeMaxIterations as r, writeAgentLoopSettings as s, canUpdateAgentLoopSettings as t };
