import { i as text, n as now, o as createSharesTable, r as table, s as ownableColumns } from "./schema-SN1ZPfo8.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/extensions/schema.js
/**
* Drizzle schema for the framework extensions system.
*
* Extensions are mini Alpine.js apps that run inside sandboxed iframes. They
* can call external APIs via a server-side proxy that resolves `${keys.NAME}`
* secret references. Extensions use the standard sharing model (private by
* default, shareable with org/others).
*
* The tables are auto-created at server boot via `ensureTable()` in store.ts,
* following the same pattern as `app_secrets`.
*
* NOTE: physical SQL table/column names stay as `tools`, `tool_data`,
* `tool_shares`, `tool_consents`, `tool_id`, etc. — additive-only schema
* policy means we never rename DB-level identifiers. The JS/TS surface is
* renamed to `extensions`/`extension*`; the DB-side names stay so existing
* deployed rows remain readable.
*/
var extensions = table("tools", {
	id: text("id").primaryKey(),
	name: text("name").notNull(),
	description: text("description").notNull().default(""),
	content: text("content").notNull().default(""),
	icon: text("icon"),
	createdAt: text("created_at").notNull().default(now()),
	updatedAt: text("updated_at").notNull().default(now()),
	...ownableColumns()
});
var extensionShares = createSharesTable("tool_shares");
var extensionHides = table("tool_hidden_extensions", {
	id: text("id").primaryKey(),
	extensionId: text("tool_id").notNull(),
	ownerEmail: text("owner_email").notNull(),
	createdAt: text("created_at").notNull().default(now())
});
var EXTENSIONS_CREATE_SQL = `CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  icon TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now')),
  owner_email TEXT NOT NULL DEFAULT 'local@localhost',
  org_id TEXT,
  visibility TEXT NOT NULL DEFAULT 'private'
)`;
var EXTENSIONS_CREATE_SQL_PG = `CREATE TABLE IF NOT EXISTS tools (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  icon TEXT,
  created_at TEXT NOT NULL DEFAULT now(),
  updated_at TEXT NOT NULL DEFAULT now(),
  owner_email TEXT NOT NULL DEFAULT 'local@localhost',
  org_id TEXT,
  visibility TEXT NOT NULL DEFAULT 'private'
)`;
var EXTENSION_SHARES_CREATE_SQL = `CREATE TABLE IF NOT EXISTS tool_shares (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL,
  principal_type TEXT NOT NULL,
  principal_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;
var EXTENSION_SHARES_CREATE_SQL_PG = `CREATE TABLE IF NOT EXISTS tool_shares (
  id TEXT PRIMARY KEY,
  resource_id TEXT NOT NULL,
  principal_type TEXT NOT NULL,
  principal_id TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'viewer',
  created_by TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT now()
)`;
table("tool_data", {
	id: text("id").primaryKey(),
	extensionId: text("tool_id").notNull(),
	collection: text("collection").notNull(),
	itemId: text("item_id"),
	data: text("data").notNull(),
	ownerEmail: text("owner_email").notNull().default("local@localhost"),
	scope: text("scope").notNull().default("user"),
	orgId: text("org_id"),
	scopeKey: text("scope_key").notNull().default("local@localhost"),
	createdAt: text("created_at").notNull().default(now()),
	updatedAt: text("updated_at").notNull().default(now())
});
var EXTENSION_DATA_CREATE_SQL = `CREATE TABLE IF NOT EXISTS tool_data (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  collection TEXT NOT NULL,
  item_id TEXT,
  data TEXT NOT NULL,
  owner_email TEXT NOT NULL DEFAULT 'local@localhost',
  scope TEXT NOT NULL DEFAULT 'user',
  org_id TEXT,
  scope_key TEXT NOT NULL DEFAULT 'local@localhost',
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;
var EXTENSION_DATA_CREATE_SQL_PG = `CREATE TABLE IF NOT EXISTS tool_data (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  collection TEXT NOT NULL,
  item_id TEXT,
  data TEXT NOT NULL,
  owner_email TEXT NOT NULL DEFAULT 'local@localhost',
  scope TEXT NOT NULL DEFAULT 'user',
  org_id TEXT,
  scope_key TEXT NOT NULL DEFAULT 'local@localhost',
  created_at TEXT NOT NULL DEFAULT now(),
  updated_at TEXT NOT NULL DEFAULT now()
)`;
var EXTENSION_DATA_ITEM_INDEX_SQL = `CREATE UNIQUE INDEX IF NOT EXISTS tool_data_scoped_item_idx
  ON tool_data (tool_id, collection, scope_key, item_id)`;
var EXTENSION_DATA_ITEM_INDEX_SQL_PG = `CREATE UNIQUE INDEX IF NOT EXISTS tool_data_scoped_item_idx
  ON tool_data (tool_id, collection, scope_key, item_id)`;
var EXTENSION_DATA_DROP_OLD_INDEX_SQL = `DROP INDEX IF EXISTS tool_data_scope_item_idx`;
var EXTENSION_DATA_DROP_OLD_INDEX_SQL_PG = `DROP INDEX IF EXISTS tool_data_scope_item_idx`;
var EXTENSIONS_OWNER_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tools_owner_idx ON tools (owner_email)`;
var EXTENSIONS_ORG_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tools_org_idx ON tools (org_id)`;
var EXTENSION_SHARES_RESOURCE_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tool_shares_resource_idx ON tool_shares (resource_id)`;
var EXTENSION_HIDES_CREATE_SQL = `CREATE TABLE IF NOT EXISTS tool_hidden_extensions (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
)`;
var EXTENSION_HIDES_CREATE_SQL_PG = `CREATE TABLE IF NOT EXISTS tool_hidden_extensions (
  id TEXT PRIMARY KEY,
  tool_id TEXT NOT NULL,
  owner_email TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT now()
)`;
var EXTENSION_HIDES_UNIQUE_INDEX_SQL = `CREATE UNIQUE INDEX IF NOT EXISTS tool_hidden_extensions_user_tool_idx
  ON tool_hidden_extensions (owner_email, tool_id)`;
var EXTENSION_HIDES_OWNER_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tool_hidden_extensions_owner_idx
  ON tool_hidden_extensions (owner_email)`;
table("tool_consents", {
	viewerEmail: text("viewer_email").notNull(),
	extensionId: text("tool_id").notNull(),
	contentHash: text("content_hash").notNull(),
	grantedAt: text("granted_at").notNull().default(now())
});
var EXTENSION_CONSENTS_CREATE_SQL = `CREATE TABLE IF NOT EXISTS tool_consents (
  viewer_email TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  granted_at TEXT NOT NULL DEFAULT (datetime('now')),
  PRIMARY KEY (viewer_email, tool_id, content_hash)
)`;
var EXTENSION_CONSENTS_CREATE_SQL_PG = `CREATE TABLE IF NOT EXISTS tool_consents (
  viewer_email TEXT NOT NULL,
  tool_id TEXT NOT NULL,
  content_hash TEXT NOT NULL,
  granted_at TEXT NOT NULL DEFAULT now(),
  PRIMARY KEY (viewer_email, tool_id, content_hash)
)`;
var EXTENSION_CONSENTS_VIEWER_INDEX_SQL = `CREATE INDEX IF NOT EXISTS tool_consents_viewer_idx ON tool_consents (viewer_email, tool_id)`;
//#endregion
export { extensions as C, extensionShares as S, EXTENSION_HIDES_UNIQUE_INDEX_SQL as _, EXTENSION_CONSENTS_CREATE_SQL as a, EXTENSION_SHARES_RESOURCE_INDEX_SQL as b, EXTENSION_DATA_CREATE_SQL as c, EXTENSION_DATA_DROP_OLD_INDEX_SQL_PG as d, EXTENSION_DATA_ITEM_INDEX_SQL as f, EXTENSION_HIDES_OWNER_INDEX_SQL as g, EXTENSION_HIDES_CREATE_SQL_PG as h, EXTENSIONS_OWNER_INDEX_SQL as i, EXTENSION_DATA_CREATE_SQL_PG as l, EXTENSION_HIDES_CREATE_SQL as m, EXTENSIONS_CREATE_SQL_PG as n, EXTENSION_CONSENTS_CREATE_SQL_PG as o, EXTENSION_DATA_ITEM_INDEX_SQL_PG as p, EXTENSIONS_ORG_INDEX_SQL as r, EXTENSION_CONSENTS_VIEWER_INDEX_SQL as s, EXTENSIONS_CREATE_SQL as t, EXTENSION_DATA_DROP_OLD_INDEX_SQL as u, EXTENSION_SHARES_CREATE_SQL as v, extensionHides as x, EXTENSION_SHARES_CREATE_SQL_PG as y };
