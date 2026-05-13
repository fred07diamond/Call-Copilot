import { i as getDbExec, u as isPostgres } from "./client-BnpqLOqs.js";
import { l as sql } from "./sql-D8aUs1Ib.js";
import { c as inArray, r as eq, t as and } from "./conditions-BBjHIT-o.js";
import { i as getRequestOrgId, o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { i as text, n as now, r as table, t as integer } from "./schema-BP4LmlFG.js";
import { n as accessFilter, r as assertAccess } from "./access-CZSYnBcR.js";
import { t as createGetDb } from "./create-get-db-DQI3Fuow.js";
import { C as extensions, S as extensionShares } from "./schema-BIFXAGvK.js";
import { randomUUID } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/slots/schema.js
/**
* Drizzle schema for the extension-points slot system.
*
* Two tables:
*
* - `extension_slots`     — declarations: "extension X can render in slot Y".
*                           Authored once per extension, regardless of installer.
*                           Physical SQL name stays `tool_slots` (additive-only).
* - `extension_slot_installs` — per-user installs: "user U wants extension X in
*                               slot Y at position N". Always scoped by
*                               owner_email. Physical SQL name stays
*                               `tool_slot_installs`.
*
* Neither table spreads `ownableColumns()` — they're not first-class shareable
* resources. Access to the underlying extension flows through the existing
* `extensions` table sharing model; install rows are personal preferences
* scoped to the installing user.
*/
var extensionSlots = table("tool_slots", {
	id: text("id").primaryKey(),
	extensionId: text("tool_id").notNull(),
	slotId: text("slot_id").notNull(),
	config: text("config"),
	createdAt: text("created_at").notNull().default(now())
});
var extensionSlotInstalls = table("tool_slot_installs", {
	id: text("id").primaryKey(),
	extensionId: text("tool_id").notNull(),
	slotId: text("slot_id").notNull(),
	ownerEmail: text("owner_email").notNull(),
	orgId: text("org_id"),
	position: integer("position").notNull().default(0),
	config: text("config"),
	createdAt: text("created_at").notNull().default(now()),
	updatedAt: text("updated_at").notNull().default(now())
});
var EXTENSION_SLOTS_CREATE_SQL = `CREATE TABLE IF NOT EXISTS tool_slots (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  config TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;
var EXTENSION_SLOTS_CREATE_SQL_PG = `CREATE TABLE IF NOT EXISTS tool_slots (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  config TEXT,
  created_at TEXT NOT NULL DEFAULT now()
)`;
var EXTENSION_SLOTS_BY_SLOT_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tool_slots_by_slot_idx ON tool_slots (slot_id)`;
var EXTENSION_SLOTS_BY_EXTENSION_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tool_slots_by_tool_idx ON tool_slots (tool_id)`;
var EXTENSION_SLOTS_UNIQUE_INDEX_SQL = `CREATE UNIQUE INDEX IF NOT EXISTS tool_slots_unique_idx ON tool_slots (tool_id, slot_id)`;
var EXTENSION_SLOT_INSTALLS_CREATE_SQL = `CREATE TABLE IF NOT EXISTS tool_slot_installs (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  org_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  config TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;
var EXTENSION_SLOT_INSTALLS_CREATE_SQL_PG = `CREATE TABLE IF NOT EXISTS tool_slot_installs (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  slot_id TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  org_id TEXT,
  position INTEGER NOT NULL DEFAULT 0,
  config TEXT,
  created_at TEXT NOT NULL DEFAULT now(),
  updated_at TEXT NOT NULL DEFAULT now()
)`;
var EXTENSION_SLOT_INSTALLS_BY_USER_SLOT_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tool_slot_installs_by_user_slot_idx ON tool_slot_installs (owner_email, slot_id)`;
var EXTENSION_SLOT_INSTALLS_UNIQUE_INDEX_SQL = `CREATE UNIQUE INDEX IF NOT EXISTS tool_slot_installs_unique_idx ON tool_slot_installs (owner_email, tool_id, slot_id)`;
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/slots/store.js
var getDb = createGetDb({
	extensions,
	extensionShares,
	extensionSlots,
	extensionSlotInstalls
});
var _initPromise;
async function ensureSlotTables() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		const pg = isPostgres();
		await client.execute(pg ? EXTENSION_SLOTS_CREATE_SQL_PG : EXTENSION_SLOTS_CREATE_SQL);
		await client.execute(EXTENSION_SLOTS_BY_SLOT_INDEX_SQL);
		await client.execute(EXTENSION_SLOTS_BY_EXTENSION_INDEX_SQL);
		await client.execute(EXTENSION_SLOTS_UNIQUE_INDEX_SQL);
		await client.execute(pg ? EXTENSION_SLOT_INSTALLS_CREATE_SQL_PG : EXTENSION_SLOT_INSTALLS_CREATE_SQL);
		await client.execute(EXTENSION_SLOT_INSTALLS_BY_USER_SLOT_INDEX_SQL);
		await client.execute(EXTENSION_SLOT_INSTALLS_UNIQUE_INDEX_SQL);
	})();
	return _initPromise;
}
/**
* Declare that a extension can render in a slot. Caller must have editor access on
* the extension (only people who can edit a extension can change its slot targets).
*/
async function addExtensionSlotTarget(extensionId, slotId, config) {
	await ensureSlotTables();
	await assertAccess("extension", extensionId, "editor");
	const db = getDb();
	const id = randomUUID();
	const createdAt = (/* @__PURE__ */ new Date()).toISOString();
	const row = {
		id,
		extensionId,
		slotId,
		config: config ?? null,
		createdAt
	};
	try {
		await db.insert(extensionSlots).values(row);
	} catch (err) {
		if (String(err?.message ?? err).toLowerCase().includes("unique")) {
			const existing = await db.select().from(extensionSlots).where(and(eq(extensionSlots.extensionId, extensionId), eq(extensionSlots.slotId, slotId)));
			if (existing[0]) return existing[0];
		}
		throw err;
	}
	return row;
}
async function removeExtensionSlotTarget(extensionId, slotId) {
	await ensureSlotTables();
	await assertAccess("extension", extensionId, "editor");
	await getDb().delete(extensionSlots).where(and(eq(extensionSlots.extensionId, extensionId), eq(extensionSlots.slotId, slotId)));
	return true;
}
async function listSlotsForExtension(extensionId) {
	await ensureSlotTables();
	await assertAccess("extension", extensionId, "viewer");
	return await getDb().select().from(extensionSlots).where(eq(extensionSlots.extensionId, extensionId));
}
/**
* List extensions that declare a slot — but only extensions the current user has access
* to. Joins through the extensions access filter.
*/
async function listExtensionsForSlot(slotId) {
	await ensureSlotTables();
	const db = getDb();
	const accessible = await db.select({
		id: extensions.id,
		name: extensions.name,
		description: extensions.description,
		icon: extensions.icon
	}).from(extensions).where(accessFilter(extensions, extensionShares));
	if (accessible.length === 0) return [];
	const ids = accessible.map((t) => t.id);
	const declarations = await db.select().from(extensionSlots).where(and(eq(extensionSlots.slotId, slotId), inArray(extensionSlots.extensionId, ids)));
	const byId = new Map(accessible.map((t) => [t.id, t]));
	return declarations.map((d) => {
		const t = byId.get(d.extensionId);
		return {
			extensionId: d.extensionId,
			name: t.name,
			description: t.description,
			icon: t.icon,
			config: d.config
		};
	});
}
/**
* Install a extension into a slot for the current user. Verifies the user has at
* least viewer access to the extension. Idempotent — re-installing returns the
* existing row.
*/
async function installExtensionSlot(extensionId, slotId, opts) {
	await ensureSlotTables();
	await assertAccess("extension", extensionId, "viewer");
	const userEmail = requireUserEmail();
	const orgId = getRequestOrgId();
	const db = getDb();
	const existing = await db.select().from(extensionSlotInstalls).where(and(eq(extensionSlotInstalls.ownerEmail, userEmail), eq(extensionSlotInstalls.extensionId, extensionId), eq(extensionSlotInstalls.slotId, slotId)));
	if (existing[0]) return existing[0];
	const id = randomUUID();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	let position = opts?.position;
	if (position === void 0) {
		const rows = await db.select({ pos: sql`MAX(${extensionSlotInstalls.position})` }).from(extensionSlotInstalls).where(and(eq(extensionSlotInstalls.ownerEmail, userEmail), eq(extensionSlotInstalls.slotId, slotId)));
		const maxPos = Number(rows[0]?.pos ?? -1);
		position = Number.isFinite(maxPos) ? maxPos + 1 : 0;
	}
	const row = {
		id,
		extensionId,
		slotId,
		ownerEmail: userEmail,
		orgId: orgId ?? null,
		position,
		config: opts?.config ?? null,
		createdAt: now,
		updatedAt: now
	};
	await db.insert(extensionSlotInstalls).values(row);
	return row;
}
async function uninstallExtensionSlot(extensionId, slotId) {
	await ensureSlotTables();
	const userEmail = requireUserEmail();
	await getDb().delete(extensionSlotInstalls).where(and(eq(extensionSlotInstalls.ownerEmail, userEmail), eq(extensionSlotInstalls.extensionId, extensionId), eq(extensionSlotInstalls.slotId, slotId)));
	return true;
}
/**
* List the current user's installs for a slot. Joins with `extensions` so the
* caller gets extension name/description/icon/updatedAt without a second query.
* Extensions the user has lost access to are silently skipped (lazy garbage
* collection).
*/
async function listSlotInstallsForUser(slotId) {
	await ensureSlotTables();
	const userEmail = requireUserEmail();
	const db = getDb();
	const installs = await db.select().from(extensionSlotInstalls).where(and(eq(extensionSlotInstalls.ownerEmail, userEmail), eq(extensionSlotInstalls.slotId, slotId)));
	if (installs.length === 0) return [];
	const accessible = await db.select({
		id: extensions.id,
		name: extensions.name,
		description: extensions.description,
		icon: extensions.icon,
		updatedAt: extensions.updatedAt
	}).from(extensions).where(accessFilter(extensions, extensionShares));
	const byId = new Map(accessible.map((t) => [t.id, t]));
	return installs.filter((i) => byId.has(i.extensionId)).sort((a, b) => a.position - b.position).map((i) => {
		const t = byId.get(i.extensionId);
		return {
			installId: i.id,
			extensionId: i.extensionId,
			name: t.name,
			description: t.description,
			icon: t.icon,
			updatedAt: t.updatedAt,
			position: i.position,
			config: i.config
		};
	});
}
/** Delete every slot/install row referencing a extension. Called from deleteExtension. */
async function cascadeDeleteExtensionSlots(extensionId) {
	await ensureSlotTables();
	const db = getDb();
	await db.delete(extensionSlots).where(eq(extensionSlots.extensionId, extensionId));
	await db.delete(extensionSlotInstalls).where(eq(extensionSlotInstalls.extensionId, extensionId));
}
function requireUserEmail() {
	const email = getRequestUserEmail();
	if (!email) throw new Error("Slot operations require an authenticated user.");
	return email;
}
//#endregion
export { addExtensionSlotTarget, cascadeDeleteExtensionSlots, ensureSlotTables, installExtensionSlot, listExtensionsForSlot, listSlotInstallsForUser, listSlotsForExtension, removeExtensionSlotTarget, uninstallExtensionSlot };
