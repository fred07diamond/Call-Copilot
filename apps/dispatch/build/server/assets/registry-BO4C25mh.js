import { h as safeJsonParse, i as getDbExec, o as intType, p as retryOnDdlRace } from "./client-BnpqLOqs.js";
import { Et as array, Rn as string, Tn as object, yt as _enum } from "./schemas-DWUnC6a7.js";
import { o as recordChange } from "./poll-dJyKUlJH.js";
import { a as registerEvent, t as emit } from "./bus-D30OLllk.js";
import { t as truncate } from "./truncate-DmpYIBKr.js";
import { randomUUID } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/notifications/types.js
var NOTIFICATION_SEVERITIES = [
	"info",
	"warning",
	"critical"
];
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/notifications/store.js
function bumpPoll(owner) {
	recordChange({
		source: "notifications",
		type: "change",
		key: owner
	});
}
var _initPromise;
function normalizeLimit(value, fallback = 50) {
	if (!Number.isFinite(value) || value == null || value <= 0) return fallback;
	return Math.min(Math.floor(value), 200);
}
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		await retryOnDdlRace(() => client.execute(`
          CREATE TABLE IF NOT EXISTS notifications (
            id TEXT PRIMARY KEY,
            owner TEXT NOT NULL,
            severity TEXT NOT NULL,
            title TEXT NOT NULL,
            body TEXT,
            metadata TEXT,
            delivered_channels TEXT NOT NULL DEFAULT '[]',
            created_at ${intType()} NOT NULL,
            read_at ${intType()}
          )
        `));
		await retryOnDdlRace(() => client.execute(`CREATE INDEX IF NOT EXISTS idx_notifications_owner_unread ON notifications (owner, read_at)`));
	})().catch((err) => {
		_initPromise = void 0;
		throw err;
	});
	return _initPromise;
}
function parseRow(row) {
	return {
		id: String(row.id),
		owner: String(row.owner),
		severity: String(row.severity),
		title: String(row.title),
		body: row.body == null ? void 0 : String(row.body),
		metadata: row.metadata ? safeJsonParse(row.metadata, void 0) : void 0,
		deliveredChannels: safeJsonParse(row.delivered_channels, []),
		createdAt: new Date(Number(row.created_at)).toISOString(),
		readAt: row.read_at == null ? null : new Date(Number(row.read_at)).toISOString()
	};
}
async function insertNotification(input) {
	await ensureTable();
	const client = getDbExec();
	const id = randomUUID();
	const createdAt = Date.now();
	await client.execute({
		sql: `INSERT INTO notifications
      (id, owner, severity, title, body, metadata, delivered_channels, created_at, read_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
		args: [
			id,
			input.owner,
			input.severity,
			input.title,
			input.body ?? null,
			input.metadata ? JSON.stringify(input.metadata) : null,
			JSON.stringify(input.deliveredChannels ?? []),
			createdAt
		]
	});
	bumpPoll(input.owner);
	return {
		id,
		owner: input.owner,
		severity: input.severity,
		title: input.title,
		body: input.body,
		metadata: input.metadata,
		deliveredChannels: input.deliveredChannels ?? [],
		createdAt: new Date(createdAt).toISOString(),
		readAt: null
	};
}
async function updateDeliveredChannels(id, channels) {
	await ensureTable();
	await getDbExec().execute({
		sql: `UPDATE notifications SET delivered_channels = ? WHERE id = ?`,
		args: [JSON.stringify(channels), id]
	});
}
async function listNotifications(owner, options = {}) {
	await ensureTable();
	const client = getDbExec();
	const limit = normalizeLimit(options.limit);
	const args = [owner];
	let where = `owner = ?`;
	if (options.unreadOnly) where += ` AND read_at IS NULL`;
	if (options.before) {
		where += ` AND created_at < ?`;
		args.push(new Date(options.before).getTime());
	}
	args.push(limit);
	const { rows } = await client.execute({
		sql: `SELECT * FROM notifications WHERE ${where} ORDER BY created_at DESC LIMIT ?`,
		args
	});
	return rows.map((r) => parseRow(r));
}
async function countUnread(owner) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT COUNT(*) as c FROM notifications WHERE owner = ? AND read_at IS NULL`,
		args: [owner]
	});
	return Number(rows[0]?.c ?? 0);
}
async function markNotificationRead(id, owner) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const updated = (await client.execute({
		sql: `UPDATE notifications SET read_at = ? WHERE id = ? AND owner = ? AND read_at IS NULL`,
		args: [
			now,
			id,
			owner
		]
	})).rowsAffected !== 0;
	if (updated) bumpPoll(owner);
	return updated;
}
async function markAllNotificationsRead(owner) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const count = (await client.execute({
		sql: `UPDATE notifications SET read_at = ? WHERE owner = ? AND read_at IS NULL`,
		args: [now, owner]
	})).rowsAffected ?? 0;
	if (count > 0) bumpPoll(owner);
	return count;
}
async function deleteNotification(id, owner) {
	await ensureTable();
	const deleted = (await getDbExec().execute({
		sql: `DELETE FROM notifications WHERE id = ? AND owner = ?`,
		args: [id, owner]
	})).rowsAffected !== 0;
	if (deleted) bumpPoll(owner);
	return deleted;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/notifications/registry.js
registerEvent({
	name: "notification.sent",
	description: "Fires after notify() delivers to at least one channel. Automations can chain off this — e.g. fan critical notifications to Slack.",
	payloadSchema: object({
		notificationId: string().optional(),
		severity: _enum(NOTIFICATION_SEVERITIES),
		title: string(),
		body: string().optional(),
		deliveredChannels: array(string())
	}),
	example: {
		notificationId: "ntf_abc",
		severity: "critical",
		title: "Payment failed",
		body: "Card ending 4242 declined",
		deliveredChannels: ["inbox", "webhook"]
	}
});
var REGISTRY_KEY = Symbol.for("@agent-native/core/notifications.registry");
function getRegistry() {
	const g = globalThis;
	if (!g[REGISTRY_KEY]) g[REGISTRY_KEY] = /* @__PURE__ */ new Map();
	return g[REGISTRY_KEY];
}
function registerNotificationChannel(channel) {
	if (!channel?.name) throw new Error("registerNotificationChannel: channel.name is required");
	if (typeof channel.deliver !== "function") throw new Error("registerNotificationChannel: channel.deliver must be a function");
	getRegistry().set(channel.name, channel);
}
/**
* Deliver a notification.
*
* The `inbox` channel always persists a row that drives the in-app UI
* (bell + toast). Additional channels (webhook, custom) run in parallel,
* best-effort. Returns the stored Notification when `inbox` ran, otherwise
* `undefined`.
*
* Also emits `notification.sent` on the event bus so automations can react
* to notifications (e.g. "when a critical notification fires, also page me").
*/
var MAX_TITLE_LEN = 100;
var MAX_BODY_LEN = 2e3;
async function notify(input, meta) {
	if (!meta?.owner) throw new Error("notify: meta.owner is required");
	input = {
		...input,
		title: truncate(input.title, MAX_TITLE_LEN),
		body: truncate(input.body, MAX_BODY_LEN)
	};
	const channels = selectChannels(input.channels);
	const runInbox = !input.channels || input.channels.includes("inbox");
	const delivered = [];
	let stored;
	if (runInbox) try {
		stored = await insertNotification({
			owner: meta.owner,
			severity: input.severity,
			title: input.title,
			body: input.body,
			metadata: input.metadata,
			deliveredChannels: ["inbox"]
		});
		delivered.push("inbox");
	} catch (err) {
		console.error("[notifications] inbox persist failed:", err);
	}
	(await Promise.allSettled(channels.map(async (channel) => {
		await channel.deliver(input, meta);
		return channel.name;
	}))).forEach((r, i) => {
		if (r.status === "fulfilled") delivered.push(r.value);
		else console.error(`[notifications] channel "${channels[i].name}" failed:`, r.reason);
	});
	const hasExtraChannel = delivered.some((c) => c !== "inbox");
	if (stored && hasExtraChannel) try {
		await updateDeliveredChannels(stored.id, delivered);
		stored = {
			...stored,
			deliveredChannels: delivered
		};
	} catch (err) {
		console.error("[notifications] delivered-channel update failed:", err);
	}
	if (delivered.length > 0) try {
		emit("notification.sent", {
			notificationId: stored?.id,
			severity: input.severity,
			title: input.title,
			body: input.body,
			deliveredChannels: delivered
		}, { owner: meta.owner });
	} catch {}
	return stored;
}
function selectChannels(allowlist) {
	const registry = getRegistry();
	const all = Array.from(registry.values());
	if (!allowlist) return all;
	return all.filter((c) => allowlist.includes(c.name));
}
//#endregion
export { listNotifications as a, deleteNotification as i, registerNotificationChannel as n, markAllNotificationsRead as o, countUnread as r, markNotificationRead as s, notify as t };
