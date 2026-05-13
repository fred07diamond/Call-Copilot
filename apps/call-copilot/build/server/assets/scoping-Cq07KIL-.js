import { i as getRequestOrgId, o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
import { t as fail } from "./utils-DGqsMmdl.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/db/safety.js
var SENSITIVE_FRAMEWORK_TABLE_RE = /\b(app_secrets|oauth_tokens|user|users|session|sessions|account|accounts|verification|jwks|organization|member|invitation|org_members|org_invitations|pg_catalog|information_schema|pg_class|pg_proc|pg_namespace|pg_user|pg_roles|pg_authid|pg_shadow)\b/i;
function stripSqlNonIdentifiers(sql) {
	let out = "";
	let state = "normal";
	for (let i = 0; i < sql.length; i++) {
		const ch = sql[i];
		const next = sql[i + 1];
		if (state === "line-comment") {
			if (ch === "\n") {
				out += " ";
				state = "normal";
			}
			continue;
		}
		if (state === "block-comment") {
			if (ch === "*" && next === "/") {
				i++;
				out += " ";
				state = "normal";
			}
			continue;
		}
		if (state === "single") {
			if (ch === "'" && next === "'") i++;
			else if (ch === "'") {
				out += " ";
				state = "normal";
			}
			continue;
		}
		if (ch === "-" && next === "-") {
			i++;
			state = "line-comment";
			continue;
		}
		if (ch === "/" && next === "*") {
			i++;
			state = "block-comment";
			continue;
		}
		if (ch === "'") {
			state = "single";
			continue;
		}
		out += ch;
	}
	return out;
}
function assertNoSensitiveFrameworkTables(sql, operation) {
	const match = stripSqlNonIdentifiers(sql).match(SENSITIVE_FRAMEWORK_TABLE_RE);
	if (!match) return;
	const verb = operation === "read" ? "readable" : operation === "write" ? "writable" : "patchable";
	fail(`Sensitive framework table "${match[1]}" is not ${verb} through raw DB tools. Use the framework auth, secrets, or OAuth APIs instead.`);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/db/scoping.js
/**
* Per-user and per-org data scoping for db-query / db-exec.
*
* In production mode, creates temporary views that shadow real tables so
* that raw SQL only sees the current user's (and org's) data.
*
* Convention:
*   - Template tables use an `owner_email` column for user scoping.
*   - Template tables use an `org_id` column for org scoping.
*   - Core tables have their own scoping patterns (key prefix, session_id, etc.).
*   - When both columns are present, owner_email is always required; org_id
*     narrows to the current org while preserving legacy/personal NULL rows.
*
* Temp views take precedence over real tables in both SQLite and Postgres,
* so the user's SQL runs unmodified against the filtered views.
*/
var CORE_TABLE_SCOPING = {
	settings: {
		column: "key",
		mode: "prefix"
	},
	application_state: {
		column: "session_id",
		mode: "exact"
	},
	oauth_tokens: {
		column: "owner",
		mode: "exact"
	},
	resources: {
		column: "owner",
		mode: "exact"
	},
	sessions: {
		column: "email",
		mode: "exact"
	}
};
var OWNER_COLUMN = "owner_email";
var ORG_COLUMN = "org_id";
var DEV_FALLBACK_EMAIL = "local@localhost";
function getUserEmail() {
	const userEmail = getRequestUserEmail() || null;
	if (!userEmail || userEmail === DEV_FALLBACK_EMAIL) throw new Error("db-exec / db-query / db-patch require an authenticated user identity. Easiest fix: open the app at http://localhost:3000 and sign in — the CLI then auto-loads your session. Otherwise set AGENT_USER_EMAIL=<email> in the env, or invoke through an HTTP action that runs under runWithRequestContext. Refusing to run unscoped — an unscoped UPDATE/DELETE would touch every user's rows, and an unscoped INSERT would land with the dev sentinel owner and be invisible to the UI.");
	return userEmail;
}
function getOrgId() {
	return getRequestOrgId() || null;
}
async function discoverColumnsPostgres(pgSql) {
	return (await pgSql`
    SELECT table_name, column_name
    FROM information_schema.columns
    WHERE table_schema = 'public'
    ORDER BY table_name, ordinal_position
  `).map((r) => ({
		table: r.table_name,
		column: r.column_name
	}));
}
async function discoverColumnsSqlite(client) {
	const tables = (await client.execute(`SELECT name FROM sqlite_master WHERE type='table' AND name NOT LIKE 'sqlite_%'`)).rows.map((r) => r.name ?? r[0]);
	const result = [];
	for (const table of tables) {
		const escaped = table.replace(/"/g, "\"\"");
		const colsResult = await client.execute(`PRAGMA table_info("${escaped}")`);
		for (const row of colsResult.rows) result.push({
			table,
			column: row.name ?? row[1]
		});
	}
	return result;
}
/** Escape a string for safe inclusion in a SQL single-quoted literal. */
function escapeSqlString(value) {
	return value.replace(/'/g, "''");
}
function escapeIdentifier(value) {
	return value.replace(/"/g, "\"\"");
}
function buildScopedTables(allColumns, userEmail, orgId, isPostgres) {
	const columnsByTable = /* @__PURE__ */ new Map();
	for (const { table, column } of allColumns) {
		const cols = columnsByTable.get(table) || [];
		cols.push(column);
		columnsByTable.set(table, cols);
	}
	const scoped = [];
	const qualifiedPrefix = isPostgres ? "public." : "main.";
	const safeEmail = escapeSqlString(userEmail);
	const safeOrgId = orgId ? escapeSqlString(orgId) : null;
	const checkOption = isPostgres ? " WITH LOCAL CHECK OPTION" : "";
	const viewFor = (table, whereSql) => {
		const escapedTable = escapeIdentifier(table);
		const realTable = `${qualifiedPrefix}"${escapedTable}"`;
		return {
			name: table,
			predicate: whereSql,
			viewSql: `${isPostgres ? "CREATE OR REPLACE TEMPORARY" : "CREATE TEMPORARY"} VIEW "${escapedTable}" AS SELECT * FROM ${realTable} WHERE ${whereSql}${checkOption}`
		};
	};
	for (const [table, columns] of columnsByTable) {
		const coreScoping = CORE_TABLE_SCOPING[table];
		if (coreScoping) {
			let whereSql;
			if (coreScoping.mode === "prefix") {
				const prefix = `u:${safeEmail.replace(/\\/g, "\\\\").replace(/%/g, "\\%").replace(/_/g, "\\_")}:`;
				whereSql = `"${coreScoping.column}" LIKE '${prefix}%' ESCAPE '\\'`;
			} else whereSql = `"${coreScoping.column}" = '${safeEmail}'`;
			scoped.push(viewFor(table, whereSql));
			continue;
		}
		if (table === "tool_data" && columns.includes("scope") && columns.includes(OWNER_COLUMN) && columns.includes(ORG_COLUMN)) {
			const orgClause = safeOrgId ? ` OR ("scope" = 'org' AND "${ORG_COLUMN}" = '${safeOrgId}')` : "";
			scoped.push(viewFor(table, `(("scope" = 'user' AND "${OWNER_COLUMN}" = '${safeEmail}')${orgClause})`));
			continue;
		}
		const hasOwner = columns.includes(OWNER_COLUMN);
		const hasOrg = columns.includes(ORG_COLUMN);
		if (hasOwner) {
			const orgClause = hasOrg && safeOrgId ? ` AND ("${ORG_COLUMN}" = '${safeOrgId}' OR "${ORG_COLUMN}" IS NULL)` : "";
			scoped.push(viewFor(table, `"${OWNER_COLUMN}" = '${safeEmail}'${orgClause}`));
			continue;
		}
		if (hasOrg) {
			scoped.push(viewFor(table, safeOrgId ? `"${ORG_COLUMN}" = '${safeOrgId}'` : "1 = 0"));
			continue;
		}
		scoped.push(viewFor(table, "1 = 0"));
	}
	return scoped;
}
/**
* Build scoping context for a Postgres connection.
* Returns setup/teardown SQL to run before/after the user's query.
*/
async function buildScopingPostgres(pgSql) {
	const userEmail = getUserEmail();
	const orgId = getOrgId();
	const allColumns = await discoverColumnsPostgres(pgSql);
	const scoped = buildScopedTables(allColumns, userEmail, orgId, true);
	const columnsByTable = /* @__PURE__ */ new Map();
	for (const { table, column } of allColumns) {
		const cols = columnsByTable.get(table) || [];
		cols.push(column);
		columnsByTable.set(table, cols);
	}
	const ownerEmailTables = /* @__PURE__ */ new Set();
	const orgIdTables = /* @__PURE__ */ new Set();
	for (const [table, columns] of columnsByTable) {
		if (columns.includes(OWNER_COLUMN)) ownerEmailTables.add(table);
		if (columns.includes(ORG_COLUMN)) orgIdTables.add(table);
	}
	return {
		setup: scoped.map((s) => s.viewSql),
		teardown: scoped.map((s) => `DROP VIEW IF EXISTS pg_temp."${escapeIdentifier(s.name)}"`),
		active: scoped.length > 0,
		userEmail,
		orgId,
		ownerEmailTables,
		orgIdTables,
		tablePredicates: new Map(scoped.map((s) => [s.name, s.predicate]))
	};
}
/**
* Build scoping context for a SQLite/libsql connection.
* Returns setup/teardown SQL to run before/after the user's query.
*/
async function buildScopingSqlite(client) {
	const userEmail = getUserEmail();
	const orgId = getOrgId();
	const allColumns = await discoverColumnsSqlite(client);
	const scoped = buildScopedTables(allColumns, userEmail, orgId, false);
	const columnsByTable = /* @__PURE__ */ new Map();
	for (const { table, column } of allColumns) {
		const cols = columnsByTable.get(table) || [];
		cols.push(column);
		columnsByTable.set(table, cols);
	}
	const ownerEmailTables = /* @__PURE__ */ new Set();
	const orgIdTables = /* @__PURE__ */ new Set();
	for (const [table, columns] of columnsByTable) {
		if (columns.includes(OWNER_COLUMN)) ownerEmailTables.add(table);
		if (columns.includes(ORG_COLUMN)) orgIdTables.add(table);
	}
	return {
		setup: scoped.map((s) => s.viewSql),
		teardown: scoped.map((s) => `DROP VIEW IF EXISTS "${escapeIdentifier(s.name)}"`),
		active: scoped.length > 0,
		userEmail,
		orgId,
		ownerEmailTables,
		orgIdTables,
		tablePredicates: new Map(scoped.map((s) => [s.name, s.predicate]))
	};
}
//#endregion
export { buildScopingSqlite as n, assertNoSensitiveFrameworkTables as r, buildScopingPostgres as t };
