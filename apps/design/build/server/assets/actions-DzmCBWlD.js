import { d as resourcePut, l as resourceListAllOwners, o as resourceGetByPath, r as resourceDelete } from "./store--irHLonY.js";
import { i as listEvents } from "./bus-D30OLllk.js";
import "./event-bus-Du1ggHZK.js";
import { buildTriggerContent, parseTriggerFrontmatter, refreshEventSubscriptions } from "./dispatcher-iKeI7U6s.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/triggers/actions.js
/**
* Framework-level agent actions for the automations system.
*
* These are registered as native tools (not template actions) so they're
* available in every template. The agent uses them to create, list, and
* manage automations from chat.
*
* All six operations are consolidated into a single `manage-automations` tool
* with an `action` discriminator to keep the tool registry compact.
*/
async function handleListEvents() {
	const events = listEvents();
	if (events.length === 0) return "No events registered yet. Events are registered by integrations (mail, calendar, clips, etc.).";
	return events.map((e) => {
		let schemaStr = "";
		try {
			const s = e.payloadSchema;
			if (s?._zod?.def?.shape) schemaStr = ` Fields: ${Object.keys(s._zod.def.shape).join(", ")}`;
		} catch {}
		const example = e.example ? `\n  Example: ${JSON.stringify(e.example)}` : "";
		return `- **${e.name}**: ${e.description}${schemaStr}${example}`;
	}).join("\n");
}
async function handleList(args, getCurrentUser) {
	const owner = getCurrentUser();
	const triggers = (await resourceListAllOwners("jobs/")).filter((r) => r.owner === owner || r.owner === "__shared__").filter((r) => r.path.endsWith(".md")).map((r) => {
		const { meta, body } = parseTriggerFrontmatter(r.content);
		return {
			name: r.path.replace(/^jobs\//, "").replace(/\.md$/, ""),
			meta,
			body,
			owner: r.owner,
			id: r.id
		};
	}).filter((t) => {
		if (args.domain && t.meta.domain !== args.domain) return false;
		if (args.enabled_only === "true" && !t.meta.enabled) return false;
		return true;
	});
	if (triggers.length === 0) return "No automations found.";
	return triggers.map((t) => {
		const type = t.meta.triggerType === "event" ? `on ${t.meta.event || "?"}` : `cron: ${t.meta.schedule}`;
		const status = t.meta.enabled ? "enabled" : "disabled";
		const lastStatus = t.meta.lastStatus ? ` (last: ${t.meta.lastStatus})` : "";
		const condition = t.meta.condition ? `\n  Condition: "${t.meta.condition}"` : "";
		const domain = t.meta.domain ? ` [${t.meta.domain}]` : "";
		return `- **${t.name}**${domain}: ${type} → ${t.meta.mode} (${status}${lastStatus})${condition}\n  Body: ${t.body.slice(0, 100)}${t.body.length > 100 ? "..." : ""}`;
	}).join("\n\n");
}
async function handleDefine(args, getCurrentUser) {
	const owner = getCurrentUser();
	const name = (args.name || "").replace(/[^a-z0-9-]/g, "-");
	if (!name) return "Error: name is required (lowercase, hyphens).";
	const path = `jobs/${name}.md`;
	if (await resourceGetByPath(owner, path)) return `Error: An automation named "${name}" already exists. Use a different name or delete the existing one first.`;
	const triggerType = args.trigger_type === "schedule" ? "schedule" : "event";
	const meta = {
		schedule: args.schedule || "",
		enabled: true,
		triggerType,
		event: args.event || void 0,
		condition: args.condition || void 0,
		mode: args.mode === "deterministic" ? "deterministic" : "agentic",
		domain: args.domain || void 0,
		createdBy: owner,
		runAs: "creator"
	};
	await resourcePut(owner, path, buildTriggerContent(meta, args.body || ""));
	await refreshEventSubscriptions();
	return `Automation "${name}" created. Fires ${triggerType === "event" ? `on ${meta.event || "?"}${meta.condition ? ` when "${meta.condition}"` : ""}` : `on schedule "${meta.schedule}"`} in ${meta.mode} mode.`;
}
async function handleUpdate(args, getCurrentUser) {
	const owner = getCurrentUser();
	const name = args.name;
	const resource = await resourceGetByPath(owner, `jobs/${name}.md`);
	if (!resource) return `Automation "${name}" not found (or you don't own it).`;
	const { meta, body } = parseTriggerFrontmatter(resource.content);
	if (args.enabled !== void 0) meta.enabled = args.enabled !== "false";
	if (args.condition !== void 0) meta.condition = args.condition || void 0;
	const newBody = args.body ?? body;
	await resourcePut(resource.owner, resource.path, buildTriggerContent(meta, newBody));
	await refreshEventSubscriptions();
	return `Automation "${name}" updated.`;
}
async function handleDelete(args, getCurrentUser) {
	const resource = await resourceGetByPath(getCurrentUser(), `jobs/${args.name}.md`);
	if (!resource) return `Automation "${args.name}" not found.`;
	await resourceDelete(resource.id);
	return `Automation "${args.name}" deleted.`;
}
async function handleFireTest(args, getCurrentUser) {
	const { emit } = await import("./event-bus-Du1ggHZK.js");
	let data = {};
	if (args.data) try {
		data = JSON.parse(args.data);
	} catch {
		return "Error: invalid JSON in data parameter.";
	}
	const owner = getCurrentUser();
	emit("test.event.fired", { data }, { owner });
	return `Test event fired with payload: ${JSON.stringify({ data })}. Any automations subscribed to "test.event.fired" will be evaluated.`;
}
var VALID_ACTIONS = [
	"list-events",
	"list",
	"define",
	"update",
	"delete",
	"fire-test"
];
function createAutomationToolEntries(getCurrentUser) {
	return { "manage-automations": {
		tool: {
			description: `Manage automations (event-triggered and scheduled tasks). Use the "action" parameter to choose an operation:

- **list-events**: List all registered event types that automations can subscribe to. Returns event names, descriptions, and payload schemas. Call this BEFORE defining an automation to discover available events.
- **list**: List all automations (triggers). Shows name, event, condition, mode, status, and domain. Optional params: domain, enabled_only.
- **define**: Create a new automation. IMPORTANT: Always confirm with the user before calling — show them a summary of what will be created. Required params: name, trigger_type, body. Optional: event, schedule, condition, mode, domain.
- **update**: Update an existing automation's settings (enabled, condition, body, etc.). Required param: name. Optional: enabled, condition, body.
- **delete**: Delete an automation. Always confirm with the user first. Required param: name.
- **fire-test**: Fire a test event to validate automations. Emits a test.event.fired event. Optional param: data (JSON string).`,
			parameters: {
				type: "object",
				properties: {
					action: {
						type: "string",
						description: "The operation to perform: list-events, list, define, update, delete, or fire-test.",
						enum: [...VALID_ACTIONS]
					},
					name: {
						type: "string",
						description: "Slug name for the automation (lowercase, hyphens). Used by define, update, and delete."
					},
					trigger_type: {
						type: "string",
						description: "\"event\" or \"schedule\". Required for define.",
						enum: ["event", "schedule"]
					},
					event: {
						type: "string",
						description: "For event triggers: the event name to subscribe to. Call with action=list-events first to see available events."
					},
					schedule: {
						type: "string",
						description: "For schedule triggers: cron expression. Example: \"0 9 * * 1-5\" (9am weekdays)."
					},
					condition: {
						type: "string",
						description: "Natural-language condition. Example: \"attendee email ends with @builder.io\". Leave empty for unconditional. Used by define and update."
					},
					mode: {
						type: "string",
						description: "\"agentic\" (full agent loop, can use tools) or \"deterministic\" (fixed actions only). Used by define.",
						enum: ["agentic", "deterministic"]
					},
					domain: {
						type: "string",
						description: "Domain tag for grouping (mail, calendar, clips, etc.). Used by define and list."
					},
					body: {
						type: "string",
						description: "The natural-language instructions for what to do when the automation fires. This becomes the agent's prompt in agentic mode. Used by define and update."
					},
					enabled: {
						type: "string",
						description: "\"true\" or \"false\" to enable/disable. Used by update."
					},
					enabled_only: {
						type: "string",
						description: "\"true\" to show only enabled automations. Used by list."
					},
					data: {
						type: "string",
						description: "JSON data to include as the test event payload. Used by fire-test. Example: '{\"email\": \"test@example.com\"}'."
					}
				},
				required: ["action"]
			}
		},
		run: async (args) => {
			const action = args.action;
			switch (action) {
				case "list-events": return handleListEvents();
				case "list": return handleList(args, getCurrentUser);
				case "define": return handleDefine(args, getCurrentUser);
				case "update": return handleUpdate(args, getCurrentUser);
				case "delete": return handleDelete(args, getCurrentUser);
				case "fire-test": return handleFireTest(args, getCurrentUser);
				default: return `Error: unknown action "${action}". Valid actions: ${VALID_ACTIONS.join(", ")}.`;
			}
		}
	} };
}
//#endregion
export { createAutomationToolEntries };
