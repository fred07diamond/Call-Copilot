import { i as getDbExec } from "./client-BnpqLOqs.js";
import { i as getRequestOrgId, o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { d as resourcePut, o as resourceGetByPath, r as resourceDelete, s as resourceList, t as SHARED_OWNER } from "./store--irHLonY.js";
import { describeCron, isValidCron, nextOccurrence } from "./cron-CQybFSTw.js";
import { buildJobContent, parseJobFrontmatter } from "./scheduler-zWZnGxlA.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/jobs/tools.js
function getOwner() {
	const email = getRequestUserEmail();
	if (!email) throw new Error("no authenticated user");
	return email;
}
/**
* Determine if the current request's user is an org owner/admin in the
* given org. Used to allow privileged users to update or delete shared
* jobs created by other org members. Returns false when there is no org,
* no user, no membership, or any error querying — fail closed.
*/
async function isCurrentUserOrgAdmin(orgId) {
	if (!orgId) return false;
	const email = getRequestUserEmail();
	if (!email) return false;
	try {
		const { rows } = await getDbExec().execute({
			sql: `SELECT role FROM org_members WHERE org_id = ? AND LOWER(email) = ? LIMIT 1`,
			args: [orgId, email.toLowerCase()]
		});
		if (rows.length === 0) return false;
		const role = String(rows[0].role ?? "").toLowerCase();
		return role === "owner" || role === "admin";
	} catch {
		return false;
	}
}
/**
* Authorise a mutation (update / delete) against a job resource. When the
* job is in the SHARED scope the caller must either be the original
* `createdBy` user or an org owner/admin — otherwise any user could rewrite
* another user's shared job and have it run as that user on the next cron
* tick (the privilege-escalation chain documented in audit
* `/tmp/security-audit/12-mcp-a2a-agent.md`, finding #3).
*
* Returns null when the mutation is allowed, or an error string suitable
* for returning to the caller when not.
*/
async function authorizeJobMutation(resourceOwner, meta) {
	if (resourceOwner !== "__shared__") return null;
	const caller = getOwner();
	const createdBy = meta.createdBy?.toLowerCase();
	if (createdBy && createdBy === caller.toLowerCase()) return null;
	if (await isCurrentUserOrgAdmin(meta.orgId ?? getRequestOrgId() ?? void 0)) return null;
	return "Only the job's creator (or an org admin) can update or delete it.";
}
async function runCreate(args) {
	const { name, schedule, instructions, scope, runAs } = args;
	if (!name || !schedule || !instructions) return JSON.stringify({ error: "name, schedule, and instructions are required" });
	if (!isValidCron(schedule)) return JSON.stringify({ error: `Invalid cron expression: "${schedule}". Use 5 fields: minute hour day-of-month month day-of-week.` });
	const owner = scope === "personal" ? getOwner() : SHARED_OWNER;
	const path = `jobs/${name}.md`;
	const next = nextOccurrence(schedule, /* @__PURE__ */ new Date());
	await resourcePut(owner, path, buildJobContent({
		schedule,
		enabled: true,
		createdBy: getOwner(),
		orgId: getRequestOrgId() || void 0,
		runAs: runAs === "shared" ? "shared" : "creator",
		nextRun: next.toISOString()
	}, instructions));
	return JSON.stringify({
		created: true,
		name,
		path,
		schedule,
		scheduleDescription: describeCron(schedule),
		nextRun: next.toISOString(),
		scope: scope || "shared"
	});
}
async function runList(args) {
	const owner = getOwner();
	const [personal, shared] = await Promise.all([resourceList(owner, "jobs/"), resourceList(SHARED_OWNER, "jobs/")]);
	let resources = [...personal, ...shared];
	if (args.scope === "personal") resources = personal;
	else if (args.scope === "shared") resources = shared;
	const metas = resources.filter((r) => r.path.endsWith(".md") && !r.path.endsWith(".keep"));
	const jobs = await Promise.all(metas.map(async (r) => {
		const { meta } = parseJobFrontmatter((await resourceGetByPath(r.owner, r.path))?.content || "");
		return {
			name: r.path.replace(/^jobs\//, "").replace(/\.md$/, ""),
			path: r.path,
			scope: r.owner === "__shared__" ? "shared" : "personal",
			schedule: meta.schedule,
			scheduleDescription: meta.schedule ? describeCron(meta.schedule) : "",
			enabled: meta.enabled,
			lastRun: meta.lastRun || null,
			lastStatus: meta.lastStatus || null,
			lastError: meta.lastError || null,
			nextRun: meta.nextRun || null
		};
	}));
	if (jobs.length === 0) return "No recurring jobs configured. Use manage-jobs with action 'create' to create one.";
	return JSON.stringify(jobs, null, 2);
}
async function runUpdate(args) {
	const { name, schedule, instructions, enabled, scope, runAs } = args;
	const path = `jobs/${name}.md`;
	let resource = await resourceGetByPath(SHARED_OWNER, path);
	if (!resource && scope !== "shared") resource = await resourceGetByPath(getOwner(), path);
	if (!resource) return JSON.stringify({ error: `Job "${name}" not found` });
	const { meta, body } = parseJobFrontmatter(resource.content);
	const denied = await authorizeJobMutation(resource.owner, meta);
	if (denied) return JSON.stringify({ error: denied });
	if (schedule) {
		if (!isValidCron(schedule)) return JSON.stringify({ error: `Invalid cron expression: "${schedule}"` });
		meta.schedule = schedule;
		meta.nextRun = nextOccurrence(schedule).toISOString();
	}
	if (enabled !== void 0) meta.enabled = enabled === "true";
	if (runAs === "creator" || runAs === "shared") meta.runAs = runAs;
	const content = buildJobContent(meta, instructions || body);
	await resourcePut(resource.owner, resource.path, content);
	return JSON.stringify({
		updated: true,
		name,
		schedule: meta.schedule,
		scheduleDescription: describeCron(meta.schedule),
		enabled: meta.enabled,
		nextRun: meta.nextRun
	});
}
async function runDelete(args) {
	const { name, scope } = args;
	const path = `jobs/${name}.md`;
	let resource = await resourceGetByPath(SHARED_OWNER, path);
	if (!resource && scope !== "shared") resource = await resourceGetByPath(getOwner(), path);
	if (!resource) return JSON.stringify({ error: `Job "${name}" not found` });
	const { meta } = parseJobFrontmatter(resource.content);
	const denied = await authorizeJobMutation(resource.owner, meta);
	if (denied) return JSON.stringify({ error: denied });
	await resourceDelete(resource.id);
	return JSON.stringify({
		deleted: true,
		name
	});
}
function createJobTools() {
	return { "manage-jobs": {
		tool: {
			description: `Manage recurring jobs that run on a cron schedule.

Actions:
- "create": Create a new recurring job. Requires name, schedule, and instructions.
- "list": List all recurring jobs and their status (schedule, enabled, last run, next run).
- "update": Update a job's schedule, instructions, or enabled state. Requires name.
- "delete": Delete a recurring job. Requires name. Always confirm with the user first.

Cron format is 5 fields: minute hour day-of-month month day-of-week. Common patterns: '0 9 * * *' (daily 9am), '0 9 * * 1-5' (weekdays 9am), '0 * * * *' (every hour), '0 9 * * 1' (Mondays 9am), '*/30 * * * *' (every 30 min).`,
			parameters: {
				type: "object",
				properties: {
					action: {
						type: "string",
						description: "The action to perform.",
						enum: [
							"create",
							"list",
							"update",
							"delete"
						]
					},
					name: {
						type: "string",
						description: "Job name (hyphen-case, e.g. 'daily-scorecard-check'). Required for create and update."
					},
					schedule: {
						type: "string",
						description: "Cron expression (5 fields: minute hour day-of-month month day-of-week). Required for create, optional for update."
					},
					instructions: {
						type: "string",
						description: "What the agent should do when this job runs. Be specific — include which actions to call and what to do with the results. Required for create, optional for update."
					},
					enabled: {
						type: "string",
						description: "Enable or disable a job: 'true' or 'false'. Only used with update.",
						enum: ["true", "false"]
					},
					scope: {
						type: "string",
						description: "For create: personal or shared (default: shared). For list: personal, shared, or all (default: all). For update: which scope to search (default: all).",
						enum: [
							"personal",
							"shared",
							"all"
						]
					},
					runAs: {
						type: "string",
						description: "Who shared jobs execute as: creator or shared. Default: creator. Used with create and update.",
						enum: ["creator", "shared"]
					}
				},
				required: ["action"]
			}
		},
		run: async (args) => {
			switch (args.action) {
				case "create": return runCreate(args);
				case "list": return runList(args);
				case "update": return runUpdate(args);
				case "delete": return runDelete(args);
				default: return JSON.stringify({ error: `Unknown action "${args.action}". Use "create", "list", or "update".` });
			}
		}
	} };
}
//#endregion
export { createJobTools };
