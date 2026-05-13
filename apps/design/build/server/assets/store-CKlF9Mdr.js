import { i as getDbExec, p as retryOnDdlRace, u as isPostgres } from "./client-BnpqLOqs.js";
import { r as eq } from "./conditions-BBjHIT-o.js";
import { i as getRequestOrgId, o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { a as registerShareableResource, i as resolveAccess, n as accessFilter, r as assertAccess } from "./access-CZSYnBcR.js";
import { t as createGetDb } from "./create-get-db-DQI3Fuow.js";
import { C as extensions, S as extensionShares, _ as EXTENSION_HIDES_UNIQUE_INDEX_SQL, a as EXTENSION_CONSENTS_CREATE_SQL, b as EXTENSION_SHARES_RESOURCE_INDEX_SQL, c as EXTENSION_DATA_CREATE_SQL, d as EXTENSION_DATA_DROP_OLD_INDEX_SQL_PG, f as EXTENSION_DATA_ITEM_INDEX_SQL, g as EXTENSION_HIDES_OWNER_INDEX_SQL, h as EXTENSION_HIDES_CREATE_SQL_PG, i as EXTENSIONS_OWNER_INDEX_SQL, l as EXTENSION_DATA_CREATE_SQL_PG, m as EXTENSION_HIDES_CREATE_SQL, n as EXTENSIONS_CREATE_SQL_PG, o as EXTENSION_CONSENTS_CREATE_SQL_PG, p as EXTENSION_DATA_ITEM_INDEX_SQL_PG, r as EXTENSIONS_ORG_INDEX_SQL, s as EXTENSION_CONSENTS_VIEWER_INDEX_SQL, t as EXTENSIONS_CREATE_SQL, u as EXTENSION_DATA_DROP_OLD_INDEX_SQL, v as EXTENSION_SHARES_CREATE_SQL, x as extensionHides, y as EXTENSION_SHARES_CREATE_SQL_PG } from "./schema-BIFXAGvK.js";
import { randomUUID } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/store.js
var getDb = createGetDb({
	extensions,
	extensionShares,
	extensionHides
});
var _initPromise;
async function ensureExtensionsTables() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		const pg = isPostgres();
		await retryOnDdlRace(() => client.execute(pg ? EXTENSIONS_CREATE_SQL_PG : EXTENSIONS_CREATE_SQL));
		await migrateMisnamedExtensionsTable(client, pg);
		await retryOnDdlRace(() => client.execute(pg ? EXTENSION_SHARES_CREATE_SQL_PG : EXTENSION_SHARES_CREATE_SQL));
		await retryOnDdlRace(() => client.execute(pg ? EXTENSION_DATA_CREATE_SQL_PG : EXTENSION_DATA_CREATE_SQL));
		await ensureExtensionDataItemId(client, pg);
		await ensureExtensionDataScope(client, pg);
		await client.execute(pg ? EXTENSION_DATA_DROP_OLD_INDEX_SQL_PG : EXTENSION_DATA_DROP_OLD_INDEX_SQL);
		await retryOnDdlRace(() => client.execute(pg ? EXTENSION_DATA_ITEM_INDEX_SQL_PG : EXTENSION_DATA_ITEM_INDEX_SQL));
		await retryOnDdlRace(() => client.execute(EXTENSIONS_OWNER_INDEX_SQL));
		await retryOnDdlRace(() => client.execute(EXTENSIONS_ORG_INDEX_SQL));
		await retryOnDdlRace(() => client.execute(EXTENSION_SHARES_RESOURCE_INDEX_SQL));
		await retryOnDdlRace(() => client.execute(pg ? EXTENSION_HIDES_CREATE_SQL_PG : EXTENSION_HIDES_CREATE_SQL));
		await retryOnDdlRace(() => client.execute(EXTENSION_HIDES_UNIQUE_INDEX_SQL));
		await retryOnDdlRace(() => client.execute(EXTENSION_HIDES_OWNER_INDEX_SQL));
		await retryOnDdlRace(() => client.execute(pg ? EXTENSION_CONSENTS_CREATE_SQL_PG : EXTENSION_CONSENTS_CREATE_SQL));
		await retryOnDdlRace(() => client.execute(EXTENSION_CONSENTS_VIEWER_INDEX_SQL));
	})();
	try {
		await _initPromise;
	} catch (err) {
		_initPromise = void 0;
		throw err;
	}
}
async function migrateMisnamedExtensionsTable(client, pg) {
	const sql = pg ? `INSERT INTO tools (id, name, description, content, icon, created_at, updated_at, owner_email, org_id, visibility)
       SELECT id, name, description, content, icon, created_at, updated_at, owner_email, org_id, visibility
       FROM extensions
       ON CONFLICT (id) DO NOTHING` : `INSERT OR IGNORE INTO tools (id, name, description, content, icon, created_at, updated_at, owner_email, org_id, visibility)
       SELECT id, name, description, content, icon, created_at, updated_at, owner_email, org_id, visibility
       FROM extensions`;
	try {
		await client.execute(sql);
	} catch (err) {
		const message = String(err?.message ?? err).toLowerCase();
		if (message.includes("no such table: extensions") || message.includes("relation \"extensions\" does not exist") || message.includes("relation extensions does not exist")) return;
		throw err;
	}
}
async function ensureExtensionDataItemId(client, pg) {
	if (pg) {
		await client.execute(`ALTER TABLE tool_data ADD COLUMN IF NOT EXISTS item_id TEXT`);
		return;
	}
	try {
		await client.execute(`ALTER TABLE tool_data ADD COLUMN item_id TEXT`);
	} catch (err) {
		if (!String(err?.message ?? err).toLowerCase().includes("duplicate")) throw err;
	}
}
async function ensureExtensionDataScope(client, pg) {
	const addCol = (name, def) => {
		if (pg) return client.execute(`ALTER TABLE tool_data ADD COLUMN IF NOT EXISTS ${name} ${def}`);
		return client.execute(`ALTER TABLE tool_data ADD COLUMN ${name} ${def}`).catch((err) => {
			if (!String(err?.message ?? err).toLowerCase().includes("duplicate")) throw err;
		});
	};
	await addCol("scope", "TEXT NOT NULL DEFAULT 'user'");
	await addCol("org_id", "TEXT");
	await addCol("scope_key", "TEXT NOT NULL DEFAULT 'local@localhost'");
	await client.execute(`UPDATE tool_data SET scope_key = owner_email WHERE scope_key = 'local@localhost' AND owner_email != 'local@localhost'`);
}
function registerExtensionsShareable() {
	registerShareableResource({
		type: "extension",
		resourceTable: extensions,
		sharesTable: extensionShares,
		displayName: "Extension",
		titleColumn: "name",
		getDb: () => getDb()
	});
}
async function listExtensions(options = {}) {
	await ensureExtensionsTables();
	const rows = await getDb().select().from(extensions).where(accessFilter(extensions, extensionShares));
	if (options.includeHidden) return rows;
	const hiddenIds = await getHiddenExtensionIdsForCurrentUser();
	if (hiddenIds.size === 0) return rows;
	return rows.filter((row) => !hiddenIds.has(row.id));
}
async function getExtension(id) {
	await ensureExtensionsTables();
	return (await resolveAccess("extension", id))?.resource ?? null;
}
async function createExtension(data) {
	await ensureExtensionsTables();
	const db = getDb();
	const userEmail = getRequestUserEmail();
	if (!userEmail) throw new Error("no authenticated user");
	const orgId = getRequestOrgId();
	const id = randomUUID();
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const row = {
		id,
		name: data.name,
		description: data.description ?? "",
		content: data.content ?? "",
		icon: data.icon ?? null,
		createdAt: now,
		updatedAt: now,
		ownerEmail: userEmail,
		orgId: orgId ?? null,
		visibility: "private"
	};
	await db.insert(extensions).values(row);
	return row;
}
async function updateExtension(id, data) {
	await ensureExtensionsTables();
	await assertAccess("extension", id, "editor");
	const db = getDb();
	const updates = { updatedAt: (/* @__PURE__ */ new Date()).toISOString() };
	if (data.name !== void 0) updates.name = data.name;
	if (data.description !== void 0) updates.description = data.description;
	if (data.icon !== void 0) updates.icon = data.icon;
	if (data.visibility !== void 0) updates.visibility = data.visibility;
	await db.update(extensions).set(updates).where(eq(extensions.id, id));
	return (await db.select().from(extensions).where(eq(extensions.id, id)))[0] ?? null;
}
async function updateExtensionContent(id, opts) {
	await ensureExtensionsTables();
	await assertAccess("extension", id, "editor");
	const db = getDb();
	let newContent;
	if (opts.content !== void 0) newContent = opts.content;
	else if (opts.patches) {
		const rows = await db.select().from(extensions).where(eq(extensions.id, id));
		if (!rows[0]) return null;
		newContent = rows[0].content;
		for (const patch of opts.patches) newContent = newContent.replace(patch.find, patch.replace);
	} else return null;
	await db.update(extensions).set({
		content: newContent,
		updatedAt: (/* @__PURE__ */ new Date()).toISOString()
	}).where(eq(extensions.id, id));
	return (await db.select().from(extensions).where(eq(extensions.id, id)))[0] ?? null;
}
async function deleteExtension(id) {
	await ensureExtensionsTables();
	await assertAccess("extension", id, "admin");
	const db = getDb();
	if (!(await db.select().from(extensions).where(eq(extensions.id, id)))[0]) return false;
	await db.delete(extensionShares).where(eq(extensionShares.resourceId, id));
	await db.delete(extensionHides).where(eq(extensionHides.extensionId, id));
	await getDbExec().execute({
		sql: `DELETE FROM tool_data WHERE tool_id = ?`,
		args: [id]
	});
	const { cascadeDeleteExtensionSlots } = await import("./store-DY_iEKRW.js");
	await cascadeDeleteExtensionSlots(id);
	await db.delete(extensions).where(eq(extensions.id, id));
	return true;
}
async function getHiddenExtensionIdsForCurrentUser() {
	await ensureExtensionsTables();
	const userEmail = getRequestUserEmail();
	if (!userEmail) return /* @__PURE__ */ new Set();
	const rows = await getDb().select({ extensionId: extensionHides.extensionId }).from(extensionHides).where(eq(extensionHides.ownerEmail, userEmail));
	return new Set(rows.map((row) => row.extensionId));
}
async function hideExtension(id) {
	await ensureExtensionsTables();
	await assertAccess("extension", id, "viewer");
	const userEmail = getRequestUserEmail();
	if (!userEmail) throw new Error("no authenticated user");
	const now = (/* @__PURE__ */ new Date()).toISOString();
	await getDbExec().execute({
		sql: `INSERT INTO tool_hidden_extensions (id, tool_id, owner_email, created_at)
      VALUES (?, ?, ?, ?)
      ON CONFLICT (owner_email, tool_id) DO NOTHING`,
		args: [
			randomUUID(),
			id,
			userEmail,
			now
		]
	});
	return true;
}
async function unhideExtension(id) {
	await ensureExtensionsTables();
	const userEmail = getRequestUserEmail();
	if (!userEmail) throw new Error("no authenticated user");
	await getDbExec().execute({
		sql: `DELETE FROM tool_hidden_extensions WHERE tool_id = ? AND owner_email = ?`,
		args: [id, userEmail]
	});
	return true;
}
//#endregion
export { createExtension, deleteExtension, ensureExtensionsTables, getExtension, getHiddenExtensionIdsForCurrentUser, hideExtension, listExtensions, registerExtensionsShareable, unhideExtension, updateExtension, updateExtensionContent };
