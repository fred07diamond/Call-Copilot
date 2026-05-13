import { l as runWithRequestContext } from "./request-context-BQ-cTIMw.js";
import { n as createAnthropicEngine } from "./builtin-BXE1_lKc.js";
import "./engine-DqVnItAv.js";
import { h as runAgentLoop, r as actionsToEngineTools, u as getOwnerActiveApiKey } from "./production-agent-CCgoSLGI.js";
import { t as createThread } from "./store-DCRHpmDW.js";
import { d as resourcePut, l as resourceListAllOwners } from "./store-BptwquUa.js";
import { describeCron, isValidCron, nextOccurrence } from "./cron-QgSKqCYm.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/jobs/scheduler.js
var FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
function parseJobFrontmatter(content) {
	const match = content.match(FRONTMATTER_RE);
	if (!match) return {
		meta: {
			schedule: "",
			enabled: false
		},
		body: content
	};
	const yamlBlock = match[1];
	const body = match[2].trim();
	const meta = {
		schedule: "",
		enabled: true
	};
	for (const line of yamlBlock.split("\n")) {
		const colonIdx = line.indexOf(":");
		if (colonIdx === -1) continue;
		const key = line.slice(0, colonIdx).trim();
		let value = line.slice(colonIdx + 1).trim();
		if (value.startsWith("\"") && value.endsWith("\"") || value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);
		switch (key) {
			case "schedule":
				meta.schedule = value;
				break;
			case "enabled":
				meta.enabled = value !== "false";
				break;
			case "createdBy":
				meta.createdBy = value;
				break;
			case "orgId":
				meta.orgId = value;
				break;
			case "runAs":
				meta.runAs = value === "shared" || value === "creator" ? value : void 0;
				break;
			case "lastRun":
				meta.lastRun = value;
				break;
			case "lastStatus":
				meta.lastStatus = value;
				break;
			case "lastError":
				meta.lastError = value;
				break;
			case "nextRun":
				meta.nextRun = value;
				break;
		}
	}
	return {
		meta,
		body
	};
}
function buildJobContent(meta, body) {
	const lines = [`---`];
	lines.push(`schedule: "${meta.schedule}"`);
	lines.push(`enabled: ${meta.enabled}`);
	if (meta.createdBy) lines.push(`createdBy: ${meta.createdBy}`);
	if (meta.orgId) lines.push(`orgId: ${meta.orgId}`);
	if (meta.runAs) lines.push(`runAs: ${meta.runAs}`);
	if (meta.lastRun) lines.push(`lastRun: ${meta.lastRun}`);
	if (meta.lastStatus) lines.push(`lastStatus: ${meta.lastStatus}`);
	if (meta.lastError) lines.push(`lastError: "${meta.lastError.replace(/"/g, "\\\"")}"`);
	if (meta.nextRun) lines.push(`nextRun: ${meta.nextRun}`);
	lines.push(`---`);
	lines.push("");
	lines.push(body);
	return lines.join("\n");
}
var _isRunning = false;
var _hasJobsCache;
var _lastJobsCheck = 0;
var JOBS_CHECK_INTERVAL_MS = 5 * 6e4;
var _emitterSubscribed = false;
function subscribeToJobsResourceEvents() {
	if (_emitterSubscribed) return;
	_emitterSubscribed = true;
	import("./emitter-D25146y5.js").then((n) => n.r).then(({ getResourcesEmitter }) => {
		getResourcesEmitter().on("resources", (event) => {
			if (typeof event?.path === "string" && event.path.startsWith("jobs/")) _hasJobsCache = void 0;
		});
	});
}
/**
* Process all due recurring jobs. Called every 60 seconds.
* Sequential execution with 5-minute timeout per job.
*/
async function processRecurringJobs(deps) {
	if (_isRunning) return;
	subscribeToJobsResourceEvents();
	const nowMs = Date.now();
	if (_hasJobsCache === false && nowMs - _lastJobsCheck < JOBS_CHECK_INTERVAL_MS) return;
	_isRunning = true;
	try {
		const jobResources = await resourceListAllOwners("jobs/");
		_hasJobsCache = jobResources.some((r) => r.path.endsWith(".md") && !r.path.endsWith(".keep"));
		_lastJobsCheck = nowMs;
		if (!_hasJobsCache) return;
		const now = /* @__PURE__ */ new Date();
		for (const resource of jobResources) {
			if (!resource.path.endsWith(".md")) continue;
			if (resource.path.endsWith(".keep")) continue;
			const { meta, body } = parseJobFrontmatter(resource.content);
			if (!meta.enabled || !meta.schedule) continue;
			if (!isValidCron(meta.schedule)) continue;
			if (meta.lastStatus === "running") {
				if (meta.lastRun && now.getTime() - new Date(meta.lastRun).getTime() < 600 * 1e3) continue;
				meta.lastStatus = "error";
				meta.lastError = "Job timed out or server crashed mid-run";
				meta.nextRun = nextOccurrence(meta.schedule, now).toISOString();
				await updateResource(resource, meta, body);
				continue;
			}
			if (meta.nextRun) {
				if (new Date(meta.nextRun) > now) continue;
			} else {
				const next = nextOccurrence(meta.schedule, /* @__PURE__ */ new Date(0));
				if (next > now) {
					meta.nextRun = next.toISOString();
					await updateResource(resource, meta, body);
					continue;
				}
			}
			if (!body.trim()) continue;
			await executeJob(resource, meta, body, deps, now);
		}
	} catch (err) {
		const { isConnectionError } = await import("./client-BpA2t7pN.js").then((n) => n.t);
		if (isConnectionError(err)) {
			_hasJobsCache = void 0;
			_lastJobsCheck = 0;
			return;
		}
		const detail = err instanceof Error ? err : err?.error ?? err?.message ?? err;
		console.error("[recurring-jobs] Error processing jobs:", detail);
	} finally {
		_isRunning = false;
	}
}
/**
* Validate that the run-as user still exists and (if scoped to an org) is
* still a member of that org. Skips the check for the dev-mode bypass
* identity and the shared-owner sentinel, neither of which map to a real
* user row.
*
* SECURITY: without this check the scheduler keeps running jobs as
* `meta.createdBy` indefinitely — even after the user has been deleted,
* removed from the org, or had their account disabled. The cron entry
* itself is left intact so an admin can purge it manually after the
* underlying user-state issue is investigated. See audit 12 #10.
*/
async function isJobRunAsStillValid(jobUserEmail, jobOrgId) {
	if (jobUserEmail === "__shared__") return { ok: true };
	try {
		const { getDbExec } = await import("./client-BpA2t7pN.js").then((n) => n.t);
		const db = getDbExec();
		const userResult = await db.execute({
			sql: `SELECT 1 FROM "user" WHERE email = ? LIMIT 1`,
			args: [jobUserEmail]
		});
		if (!userResult.rows || userResult.rows.length === 0) return {
			ok: false,
			reason: `user "${jobUserEmail}" no longer exists`
		};
		if (jobOrgId) {
			const memberResult = await db.execute({
				sql: `SELECT 1 FROM org_members WHERE org_id = ? AND LOWER(email) = LOWER(?) LIMIT 1`,
				args: [jobOrgId, jobUserEmail]
			});
			if (!memberResult.rows || memberResult.rows.length === 0) return {
				ok: false,
				reason: `user "${jobUserEmail}" is no longer a member of org "${jobOrgId}"`
			};
		}
		return { ok: true };
	} catch (err) {
		const msg = err?.message?.toLowerCase() ?? "";
		if (msg.includes("does not exist") || msg.includes("no such table") || msg.includes("undefined table")) return { ok: true };
		console.warn(`[recurring-jobs] User/membership validation failed for "${jobUserEmail}":`, err?.message);
		return { ok: true };
	}
}
async function executeJob(resource, meta, body, deps, now) {
	const jobName = resource.path.replace(/^jobs\//, "").replace(/\.md$/, "");
	const jobUserEmail = (meta.runAs ?? "creator") === "creator" ? meta.createdBy || resource.owner : resource.owner;
	const jobOrgId = meta.orgId ?? void 0;
	const validity = await isJobRunAsStillValid(jobUserEmail, jobOrgId);
	if (!validity.ok) {
		console.warn(`[recurring-jobs] Skipping job "${jobName}": ${validity.reason}. User/membership no longer valid — leaving cron entry for admin review.`);
		meta.lastRun = now.toISOString();
		meta.lastStatus = "skipped";
		meta.lastError = validity.reason;
		await updateResource(resource, meta, body);
		return;
	}
	meta.lastRun = now.toISOString();
	meta.lastStatus = "running";
	meta.lastError = void 0;
	await updateResource(resource, meta, body);
	await runWithRequestContext({
		userEmail: jobUserEmail,
		orgId: jobOrgId
	}, async () => {
		try {
			const actions = deps.getActions();
			const systemPrompt = await deps.getSystemPrompt(jobUserEmail);
			const tools = actionsToEngineTools(actions);
			const userApiKey = await getOwnerActiveApiKey(jobUserEmail);
			const engine = deps.engine ?? createAnthropicEngine({ apiKey: userApiKey ?? deps.apiKey });
			await createThread(jobUserEmail, { title: `Job: ${jobName} — ${now.toLocaleDateString()}` });
			const messages = [{
				role: "user",
				content: [{
					type: "text",
					text: `[Recurring Job: ${jobName}]\nSchedule: ${describeCron(meta.schedule)}\n\nExecute the following job instructions:\n\n${body}`
				}]
			}];
			const controller = new AbortController();
			const timeout = setTimeout(() => controller.abort(), 300 * 1e3);
			const events = [];
			const send = (event) => {
				events.push(event);
			};
			try {
				await runAgentLoop({
					engine,
					model: deps.model,
					systemPrompt,
					tools,
					messages,
					actions,
					send,
					signal: controller.signal
				});
			} finally {
				clearTimeout(timeout);
			}
			const next = nextOccurrence(meta.schedule, now);
			meta.lastStatus = "success";
			meta.nextRun = next.toISOString();
			await updateResource(resource, meta, body);
			console.log(`[recurring-jobs] Job "${jobName}" completed. Next run: ${meta.nextRun}`);
		} catch (err) {
			const next = nextOccurrence(meta.schedule, now);
			meta.lastStatus = "error";
			meta.lastError = err?.message?.slice(0, 200) || "Unknown error";
			meta.nextRun = next.toISOString();
			await updateResource(resource, meta, body);
			console.error(`[recurring-jobs] Job "${jobName}" failed:`, err?.message);
		}
	});
}
async function updateResource(resource, meta, body) {
	const content = buildJobContent(meta, body);
	await resourcePut(resource.owner, resource.path, content);
}
//#endregion
export { buildJobContent, parseJobFrontmatter, processRecurringJobs };
