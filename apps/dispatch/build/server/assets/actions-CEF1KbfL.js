import { a as listNotifications, r as countUnread, t as notify } from "./registry-BO4C25mh.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/notifications/actions.js
/**
* Framework-level agent actions for the notifications primitive.
*
* Registered as native tools (not template actions) so they're available in
* every template. Consolidated into a single `manage-notifications` tool with
* an `action` parameter that dispatches to the correct implementation.
*/
function parseLimit(value, fallback = 20) {
	const n = Number(value ?? fallback);
	if (!Number.isFinite(n) || n <= 0) return fallback;
	return Math.min(Math.floor(n), 200);
}
function createNotificationToolEntries(getCurrentUser) {
	return { "manage-notifications": {
		tool: {
			description: [
				"Manage user notifications. Available actions:",
				"",
				"• action=\"send\" — Send a notification to the user. Persisted to the in-app inbox so the bell + toast surface shows it. Registered channels (webhook, Slack, etc.) also run.",
				"  Required: severity, title. Optional: body, metadataJson, channels.",
				"",
				"• action=\"list\" — List recent notifications for the current user. Useful when the user asks about prior alerts.",
				"  Optional: unreadOnly (boolean), limit (number, default 20, max 200)."
			].join("\n"),
			parameters: {
				type: "object",
				properties: {
					action: {
						type: "string",
						enum: ["send", "list"],
						description: "The notification action to perform."
					},
					severity: {
						type: "string",
						enum: [
							"info",
							"warning",
							"critical"
						],
						description: "(send) Severity level — drives styling and per-severity channel routing. Use \"info\" for FYI, \"warning\" for things the user should look at, \"critical\" for things that need immediate attention."
					},
					title: {
						type: "string",
						description: "(send) Short, human-readable headline (≤100 chars)."
					},
					body: {
						type: "string",
						description: "(send) Optional longer description."
					},
					metadataJson: {
						type: "string",
						description: "(send) Optional JSON metadata (URLs, entity ids, etc.). Example: '{\"threadId\":\"abc\",\"link\":\"/inbox/abc\"}'."
					},
					channels: {
						type: "string",
						description: "(send) Optional comma-separated channel allowlist (e.g. \"inbox,webhook\"). Omit to run all registered channels."
					},
					unreadOnly: {
						type: "boolean",
						description: "(list) When true, only include unread notifications."
					},
					limit: {
						type: "number",
						description: "(list) Max rows to return (default 20, max 200)."
					}
				},
				required: ["action"]
			}
		},
		run: async (args) => {
			const owner = getCurrentUser();
			const action = args.action;
			switch (action) {
				case "send": {
					if (!args.severity || !args.title) return "Error: severity and title are required for action=send.";
					const severity = args.severity;
					if (![
						"info",
						"warning",
						"critical"
					].includes(severity)) return `Error: severity must be info, warning, or critical (got "${severity}").`;
					let metadata;
					if (args.metadataJson) try {
						metadata = JSON.parse(args.metadataJson);
					} catch {
						return "Error: metadataJson must be valid JSON.";
					}
					const channels = typeof args.channels === "string" ? args.channels.split(",").map((s) => s.trim()).filter(Boolean) : void 0;
					const stored = await notify({
						severity,
						title: args.title,
						body: args.body || void 0,
						metadata,
						channels
					}, { owner });
					return stored ? `Notification sent (id: ${stored.id})` : "Notification dispatched to channels (not persisted).";
				}
				case "list": {
					const rows = await listNotifications(owner, {
						unreadOnly: args.unreadOnly === true || args.unreadOnly === "true",
						limit: parseLimit(args.limit)
					});
					if (rows.length === 0) return args.unreadOnly ? "No unread notifications." : "No notifications.";
					return `${await countUnread(owner)} unread\n\n${rows.map((n) => `[${n.readAt ? " " : "•"}] (${n.severity}) ${n.title}${n.body ? ` — ${n.body}` : ""} · ${n.createdAt}`).join("\n")}`;
				}
				default: return `Error: unknown action "${action}". Must be one of: send, list.`;
			}
		}
	} };
}
//#endregion
export { createNotificationToolEntries };
