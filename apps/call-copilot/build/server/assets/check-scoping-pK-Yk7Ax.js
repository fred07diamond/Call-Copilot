import { n as getDatabaseAuthToken, r as getDatabaseUrl } from "./client-BpA2t7pN.js";
import { i as parseArgs } from "./utils-DGqsMmdl.js";
import { t as createClient } from "./node-Dy3v_4q6.js";
import path from "path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/db/check-scoping.js
/**
* Core script: db-check-scoping
*
* Validates that all template tables have the required ownership columns
* (owner_email, org_id) for per-user and per-org data scoping.
*
* Tables without these columns are denied to raw db-* tools by default. If a
* table should be queryable/writable through raw DB tools, add explicit
* owner_email/org_id scoping columns and an additive migration.
*
* Usage:
*   pnpm action db-check-scoping [--db path] [--require-org] [--format json]
*/
function isPostgresUrl(url) {
	return url.startsWith("postgres://") || url.startsWith("postgresql://");
}
var CORE_TABLES = new Set([
	"settings",
	"application_state",
	"oauth_tokens",
	"sessions",
	"resources",
	"chat_threads",
	"chat_messages",
	"chat_tasks",
	"recurring_jobs",
	"__drizzle_migrations",
	"_litestream_lock",
	"_litestream_seq"
]);
function validate(allColumns, requireOrg) {
	const columnsByTable = /* @__PURE__ */ new Map();
	for (const { table, column } of allColumns) {
		const cols = columnsByTable.get(table) || [];
		cols.push(column);
		columnsByTable.set(table, cols);
	}
	const results = [];
	for (const [table, columns] of columnsByTable) {
		if (CORE_TABLES.has(table)) continue;
		if (table.startsWith("_")) continue;
		const hasOwnerEmail = columns.includes("owner_email");
		const hasOrgId = columns.includes("org_id");
		const issues = [];
		if (!hasOwnerEmail) issues.push("missing owner_email column — not scoped per-user");
		if (requireOrg && !hasOrgId) issues.push("missing org_id column — not scoped per-org");
		results.push({
			table,
			hasOwnerEmail,
			hasOrgId,
			issues
		});
	}
	return results;
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
async function dbCheckScoping(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action db-check-scoping [options]

Options:
  --db <path>       Path to SQLite database (default: data/app.db)
  --require-org     Also check for org_id column (for multi-org apps)
  --format json     Output as JSON
  --help            Show this help message`);
		return;
	}
	const requireOrg = parsed["require-org"] === "true";
	const format = parsed.format;
	let url;
	if (parsed.db) url = "file:" + path.resolve(parsed.db);
	else if (getDatabaseUrl()) url = getDatabaseUrl();
	else url = "file:" + path.resolve(process.cwd(), "data", "app.db");
	let allColumns;
	if (isPostgresUrl(url)) {
		const { default: pg } = await import("./src-DU9OR977.js").then((n) => n.n);
		const pgSql = pg(url);
		try {
			allColumns = await discoverColumnsPostgres(pgSql);
		} finally {
			await pgSql.end();
		}
	} else {
		const client = createClient({
			url,
			authToken: getDatabaseAuthToken()
		});
		try {
			allColumns = await discoverColumnsSqlite(client);
		} finally {
			client.close();
		}
	}
	const results = validate(allColumns, requireOrg);
	if (format === "json") {
		console.log(JSON.stringify({ tables: results }, null, 2));
		return;
	}
	const withIssues = results.filter((r) => r.issues.length > 0);
	const ok = results.filter((r) => r.issues.length === 0);
	if (ok.length > 0) {
		console.log("Scoped tables:");
		for (const r of ok) {
			const scopes = [r.hasOwnerEmail ? "owner_email" : null, r.hasOrgId ? "org_id" : null].filter(Boolean).join(", ");
			console.log(`  ✓ ${r.table} (${scopes})`);
		}
		console.log();
	}
	if (withIssues.length > 0) {
		console.log("Tables denied to raw DB tools:");
		for (const r of withIssues) for (const issue of r.issues) console.log(`  ✗ ${r.table} — ${issue}`);
		console.log();
		console.log(`${withIssues.length} table(s) lack scoping columns. Raw db-* tools will fail closed for these tables; use scoped actions or add owner_email/org_id when raw DB access is intended.`);
		process.exitCode = 1;
	} else console.log("All template tables have proper scoping columns.");
}
//#endregion
export { dbCheckScoping as default };
