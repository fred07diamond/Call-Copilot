import { Rn as string, Tn as object, wn as number, yt as _enum } from "./schemas-DWUnC6a7.js";
import { a as registerEvent, t as emit } from "./bus-D30OLllk.js";
import { t as truncate } from "./truncate-DmpYIBKr.js";
import { a as updateRun, i as listRuns, r as insertRun } from "./store-BdHAyw2F.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/progress/types.js
var PROGRESS_STATUSES = [
	"running",
	"succeeded",
	"failed",
	"cancelled"
];
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/progress/registry.js
registerEvent({
	name: "run.progress.started",
	description: "Fires when a long-running agent task begins. Pair with run.progress.updated to build watchdogs for stuck work.",
	payloadSchema: object({
		runId: string(),
		title: string(),
		step: string().optional()
	}),
	example: {
		runId: "run_abc",
		title: "Triage 128 unread emails",
		step: "Fetching inbox"
	}
});
registerEvent({
	name: "run.progress.updated",
	description: "Fires on every progress update or terminal transition. Subscribe to watch for slow runs (status=running and elapsed > N) or fan terminal status to a notification.",
	payloadSchema: object({
		runId: string(),
		percent: number().nullable(),
		step: string().optional(),
		status: _enum(PROGRESS_STATUSES)
	}),
	example: {
		runId: "run_abc",
		percent: 45,
		step: "Classifying 56/128",
		status: "running"
	}
});
var MAX_TITLE_LEN = 100;
var MAX_STEP_LEN = 200;
/**
* Start a new run. Emits `run.progress.started` on the event bus so
* automations can react (e.g. pinning the row in a UI tray).
*/
async function startRun(input) {
	const run = await insertRun({
		...input,
		title: truncate(input.title, MAX_TITLE_LEN),
		step: truncate(input.step, MAX_STEP_LEN)
	});
	try {
		emit("run.progress.started", {
			runId: run.id,
			title: run.title,
			step: run.step
		}, { owner: run.owner });
	} catch {}
	return run;
}
/**
* Update a run in-flight. Emits `run.progress.updated`. Caller supplies
* partial fields — any omitted field stays unchanged.
*/
async function updateRunProgress(id, owner, input) {
	const run = await updateRun(id, owner, {
		...input,
		step: truncate(input.step, MAX_STEP_LEN)
	});
	if (!run) return null;
	try {
		emit("run.progress.updated", {
			runId: run.id,
			percent: run.percent,
			step: run.step,
			status: run.status
		}, { owner: run.owner });
	} catch {}
	return run;
}
/**
* Finalize a run with a terminal status. Convenience wrapper around
* `updateRunProgress` that ensures `completed_at` is set.
*/
async function completeRun(id, owner, status, extras) {
	return updateRunProgress(id, owner, {
		status,
		percent: status === "succeeded" ? 100 : void 0,
		step: extras?.step,
		metadata: extras?.metadata
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/progress/actions.js
/**
* Framework-level agent tools for the progress primitive. Registered as
* native tools so every template exposes them. Use from long agent loops
* to communicate status to the user while work is still in-flight.
*
* All operations are consolidated into a single `manage-progress` tool
* with an `action` discriminator.
*/
function parseLimit(value, fallback = 20) {
	const n = Number(value ?? fallback);
	if (!Number.isFinite(n) || n <= 0) return fallback;
	return Math.min(Math.floor(n), 200);
}
function createProgressToolEntries(getCurrentUser) {
	return { "manage-progress": {
		tool: {
			description: `Manage long-running task progress visible to the user. Use this whenever a task will take more than a few seconds so the user can watch status in the runs tray.

Actions:
• "start" — Begin tracking a new task. Returns a runId to pass to subsequent calls. Params: title (required), step (optional initial step text), metadataJson (optional JSON string with link/thread/artifact info).
• "update" — Report progress on a running task. Call frequently during long loops. Params: runId (required), percent (optional 0–100), step (optional current step text). Omitted fields stay unchanged.
• "complete" — Mark a task as finished. Params: runId (required), status (required: "succeeded" | "failed" | "cancelled"), step (optional final step text). Pairs well with \`notify\` to tell the user the outcome.
• "list" — List the user's recent runs. Use when the user asks "what is still running" or "what did you do earlier". Params: active (optional boolean, filter to in-progress only), limit (optional number, default 20, max 200).`,
			parameters: {
				type: "object",
				properties: {
					action: {
						type: "string",
						enum: [
							"start",
							"update",
							"complete",
							"list"
						],
						description: "The operation to perform: \"start\" a new run, \"update\" progress, \"complete\" a run, or \"list\" recent runs."
					},
					title: {
						type: "string",
						description: "[start] Short human-readable title, e.g. \"Triage 128 unread emails\"."
					},
					step: {
						type: "string",
						description: "[start/update/complete] Step description, e.g. \"Fetching inbox\" or \"Drafting reply 23/100\"."
					},
					metadataJson: {
						type: "string",
						description: "[start] Optional JSON metadata: link, thread id, artifact path, etc."
					},
					runId: {
						type: "string",
						description: "[update/complete] The id returned by a \"start\" action."
					},
					percent: {
						type: "number",
						description: "[update] Progress 0–100. Omit if the task has no known upper bound."
					},
					status: {
						type: "string",
						enum: [
							"succeeded",
							"failed",
							"cancelled"
						],
						description: "[complete] Terminal status for the run."
					},
					active: {
						type: "boolean",
						description: "[list] When true, only return runs still in progress."
					},
					limit: {
						type: "number",
						description: "[list] Max rows (default 20, max 200)."
					}
				},
				required: ["action"]
			}
		},
		run: async (args) => {
			const owner = getCurrentUser();
			const action = String(args.action ?? "");
			switch (action) {
				case "start": {
					const title = args.title ? String(args.title) : "";
					if (!title) return "Error: title is required for the start action.";
					let metadata;
					if (args.metadataJson) try {
						metadata = JSON.parse(String(args.metadataJson));
					} catch {
						return "Error: metadataJson must be valid JSON.";
					}
					return `Run started. runId=${(await startRun({
						owner,
						title,
						step: args.step ? String(args.step) : void 0,
						metadata
					})).id}`;
				}
				case "update": {
					const runId = String(args.runId ?? "");
					if (!runId) return "Error: runId is required for the update action.";
					const run = await updateRunProgress(runId, owner, {
						percent: args.percent == null ? void 0 : Number(args.percent),
						step: args.step ? String(args.step) : void 0
					});
					if (!run) return `Error: run ${runId} not found.`;
					return `Run updated (percent=${run.percent ?? "?"}, step=${run.step ?? ""}).`;
				}
				case "complete": {
					const runId = String(args.runId ?? "");
					const status = String(args.status ?? "");
					if (!runId || !status) return "Error: runId and status are required for the complete action.";
					if (![
						"succeeded",
						"failed",
						"cancelled"
					].includes(status)) return "Error: status must be \"succeeded\", \"failed\", or \"cancelled\".";
					const run = await completeRun(runId, owner, status, args.step ? { step: String(args.step) } : void 0);
					if (!run) return `Error: run ${runId} not found.`;
					return `Run ${run.id} completed with status=${run.status}.`;
				}
				case "list": {
					const rows = await listRuns(owner, {
						activeOnly: args.active === true || args.active === "true",
						limit: parseLimit(args.limit)
					});
					if (rows.length === 0) return args.active ? "No active runs." : "No runs.";
					return rows.map((r) => `[${r.status}] ${r.title}${r.percent != null ? ` · ${r.percent}%` : ""}${r.step ? ` — ${r.step}` : ""} · ${r.startedAt}`).join("\n");
				}
				default: return `Error: unknown action "${action}". Use one of: start, update, complete, list.`;
			}
		}
	} };
}
//#endregion
export { createProgressToolEntries };
