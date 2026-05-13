import { i as getDbExec, o as intType, p as retryOnDdlRace, u as isPostgres } from "./client-BpA2t7pN.js";
import { n as emitResourceDelete, t as emitResourceChange } from "./emitter-D25146y5.js";
import crypto from "crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/resources/store.js
var SHARED_OWNER = "__shared__";
var _initPromise;
var DEFAULT_LEARNINGS_SHARED_MD = `# Learnings

User preferences, corrections, and patterns. The agent reads this at the start of every conversation.

Keep this file tidy — revise, consolidate, and remove outdated entries. Don't just append forever.

## Preferences

## Corrections

## Patterns
`;
var DEFAULT_LEARNINGS_PERSONAL_MD = `# My Learnings

Personal preferences, corrections, and patterns — only visible to you.

## Preferences

## Corrections

## Patterns
`;
var DEFAULT_SKILL_LEARN_MD = `---
name: learn
description: >-
  Review the conversation and save structured memories for future sessions.
user-invocable: true
---

# Learn

Review the current conversation and save anything worth remembering using the structured memory system.

## Memory types

- **user** — Preferences, role, personal context, contacts
- **feedback** — Corrections ("don't do X, do Y instead"), confirmed approaches
- **project** — Ongoing work context, decisions, status
- **reference** — Pointers to external systems, URLs, API details

## Steps

1. Review the conversation for new insights
2. Check your memory index: \`resource-read --path memory/MEMORY.md\`
3. For each new insight, use \`save-memory\` with a descriptive name, type, and content
4. If updating an existing memory, read it first with \`resource-read --path memory/<name>.md\`, then save with merged content

## What NOT to capture

- Things obvious from reading the code
- Standard language/framework behavior
- Temporary debugging notes
- Anything already in AGENTS.md or other skills

Keep one memory per logical topic. Descriptions should be concise — the index is loaded every conversation.
`;
var DEFAULT_SKILL_LEARN_SHARED_MD = `---
name: learn-shared
description: >-
  Update the shared LEARNINGS.md with team-wide preferences, corrections, and
  patterns from this session.
user-invocable: true
---

# Learn (Shared)

Review the current conversation and update the shared \`LEARNINGS.md\` resource with anything the whole team should know.

## What to capture

- **Team conventions** — agreed-upon approaches, code style decisions
- **Technical learnings** — API quirks, library gotchas, surprising behavior
- **Architectural decisions** — why something is done a certain way
- **Corrections** — mistakes that any team member's agent should avoid

## What NOT to capture

- Personal preferences (use \`/learn\` for those)
- Things obvious from reading the code
- Standard language/framework behavior

## Steps

1. Read shared learnings: \`pnpm action resource-read --path LEARNINGS.md --scope shared\`
2. Review the conversation for team-relevant insights
3. Merge new learnings with existing ones — don't duplicate, refine existing entries
4. Write back: \`pnpm action resource-write --path LEARNINGS.md --scope shared --content "..."\`

Keep entries concise — one line per learning, grouped by category (Conventions, Technical, Patterns).
`;
var DEFAULT_AGENTS_SHARED_MD = `# Agent Instructions

This file customizes how the AI agent behaves in this app. Edit it to add your own instructions, preferences, and context.

## What to put here

- **Preferences** — Tone, style, verbosity, response format
- **Context** — Domain knowledge, terminology, team conventions
- **Rules** — Things the agent should always/never do
- **Skills** — Reference skill files for specialized tasks (create them in the \`skills/\` folder)

## Skills

You can create skill files to give the agent specialized knowledge for specific tasks. Create resources under \`skills/<name>/SKILL.md\` (e.g., \`skills/data-analysis/SKILL.md\`, \`skills/code-review/SKILL.md\`) and reference them here:

| Skill | Path | Description |
|-------|------|-------------|
| *(add your skills here)* | \`skills/example/SKILL.md\` | What this skill teaches the agent |

The agent will read the relevant skill file when performing that type of task.

## Example

\`\`\`markdown
## Tone
Be concise. Lead with the answer. Skip filler.

## Code style
- Use TypeScript, never JavaScript
- Prefer named exports
- Use early returns

## Domain context
We sell B2B SaaS. Our customers are enterprise engineering teams.
\`\`\`
`;
var DEFAULT_AGENTS_PERSONAL_MD = `# My Agent Instructions

Personal agent instructions — only visible to you. Use this for your own contacts, preferences, and context.

## Contacts

Add people you frequently interact with so the agent can resolve names like "email my wife" or "message John":

| Name | Email | Notes |
|------|-------|-------|
| *(add your contacts here)* | | |

## Preferences

## Context
`;
async function migrateDefaultResourcePath({ client, owner, fromPath, toPath, defaultContent }) {
	try {
		const row = (await client.execute({
			sql: `SELECT id, content FROM resources WHERE owner = ? AND path = ?`,
			args: [owner, fromPath]
		})).rows?.[0];
		if (!row || row.content !== defaultContent) return;
		if (((await client.execute({
			sql: `SELECT id FROM resources WHERE owner = ? AND path = ?`,
			args: [owner, toPath]
		})).rows?.length ?? 0) > 0) return;
		await client.execute({
			sql: `UPDATE resources SET path = ?, updated_at = ? WHERE id = ?`,
			args: [
				toPath,
				Date.now(),
				row.id
			]
		});
	} catch {}
}
async function ensureTable() {
	if (!_initPromise) _initPromise = _doEnsureTable().catch((err) => {
		_initPromise = void 0;
		throw err;
	});
	return _initPromise;
}
async function _doEnsureTable() {
	const client = getDbExec();
	await retryOnDdlRace(() => client.execute(`
      CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        path TEXT NOT NULL,
        owner TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        mime_type TEXT NOT NULL DEFAULT 'text/markdown',
        size ${intType()} NOT NULL DEFAULT 0,
        created_at ${intType()} NOT NULL,
        updated_at ${intType()} NOT NULL,
        UNIQUE(path, owner)
      )
    `));
	const now = Date.now();
	const seedSql = isPostgres() ? `INSERT INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (path, owner) DO NOTHING` : `INSERT OR IGNORE INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
	const agentsSize = Buffer.byteLength(DEFAULT_AGENTS_SHARED_MD, "utf8");
	await client.execute({
		sql: seedSql,
		args: [
			crypto.randomUUID(),
			"AGENTS.md",
			SHARED_OWNER,
			DEFAULT_AGENTS_SHARED_MD,
			"text/markdown",
			agentsSize,
			now,
			now
		]
	});
	const learningsSize = Buffer.byteLength(DEFAULT_LEARNINGS_SHARED_MD, "utf8");
	await client.execute({
		sql: seedSql,
		args: [
			crypto.randomUUID(),
			"LEARNINGS.md",
			SHARED_OWNER,
			DEFAULT_LEARNINGS_SHARED_MD,
			"text/markdown",
			learningsSize,
			now,
			now
		]
	});
	await migrateDefaultResourcePath({
		client,
		owner: SHARED_OWNER,
		fromPath: "skills/learn-shared.md",
		toPath: "skills/learn-shared/SKILL.md",
		defaultContent: DEFAULT_SKILL_LEARN_SHARED_MD
	});
	const learnSharedSize = Buffer.byteLength(DEFAULT_SKILL_LEARN_SHARED_MD, "utf8");
	await client.execute({
		sql: seedSql,
		args: [
			crypto.randomUUID(),
			"skills/learn-shared/SKILL.md",
			SHARED_OWNER,
			DEFAULT_SKILL_LEARN_SHARED_MD,
			"text/markdown",
			learnSharedSize,
			now,
			now
		]
	});
	try {
		const { getBuiltinAgents, BUILTIN_AGENTS_FOR_SEEDING } = await import("./agent-discovery-1twg3iI7.js").then((n) => n.t);
		const builtins = BUILTIN_AGENTS_FOR_SEEDING;
		for (const agent of builtins) {
			const agentJson = JSON.stringify({
				id: agent.id,
				name: agent.name,
				description: agent.description,
				url: agent.url,
				color: agent.color
			}, null, 2);
			const agentSize = Buffer.byteLength(agentJson, "utf8");
			await client.execute({
				sql: seedSql,
				args: [
					crypto.randomUUID(),
					`remote-agents/${agent.id}.json`,
					SHARED_OWNER,
					agentJson,
					"application/json",
					agentSize,
					now,
					now
				]
			});
		}
	} catch {}
	try {
		const rows = (await client.execute({
			sql: `SELECT id, path FROM resources WHERE path LIKE ? AND path LIKE ?`,
			args: ["agents/%", "%.json"]
		})).rows ?? [];
		for (const row of rows) {
			const newPath = row.path.replace(/^agents\//, "remote-agents/");
			try {
				await client.execute({
					sql: `UPDATE resources SET path = ?, updated_at = ? WHERE id = ?`,
					args: [
						newPath,
						Date.now(),
						row.id
					]
				});
			} catch {}
		}
	} catch {}
}
var _personalSeeded = /* @__PURE__ */ new Set();
/**
* Seed personal AGENTS.md and LEARNINGS.md for a user if they don't exist.
* Called when listing resources or from the agent chat plugin.
*/
async function ensurePersonalDefaults(owner) {
	if (owner === "__shared__" || _personalSeeded.has(owner)) return;
	_personalSeeded.add(owner);
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const seedSql = isPostgres() ? `INSERT INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (path, owner) DO NOTHING` : `INSERT OR IGNORE INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
	const agentsSize = Buffer.byteLength(DEFAULT_AGENTS_PERSONAL_MD, "utf8");
	await client.execute({
		sql: seedSql,
		args: [
			crypto.randomUUID(),
			"AGENTS.md",
			owner,
			DEFAULT_AGENTS_PERSONAL_MD,
			"text/markdown",
			agentsSize,
			now,
			now
		]
	});
	const learningsSize = Buffer.byteLength(DEFAULT_LEARNINGS_PERSONAL_MD, "utf8");
	await client.execute({
		sql: seedSql,
		args: [
			crypto.randomUUID(),
			"LEARNINGS.md",
			owner,
			DEFAULT_LEARNINGS_PERSONAL_MD,
			"text/markdown",
			learningsSize,
			now,
			now
		]
	});
	const memoryIndexContent = "# Memory Index\n";
	const memoryIndexSize = Buffer.byteLength(memoryIndexContent, "utf8");
	await client.execute({
		sql: seedSql,
		args: [
			crypto.randomUUID(),
			"memory/MEMORY.md",
			owner,
			memoryIndexContent,
			"text/markdown",
			memoryIndexSize,
			now,
			now
		]
	});
	await migrateDefaultResourcePath({
		client,
		owner,
		fromPath: "skills/learn.md",
		toPath: "skills/learn/SKILL.md",
		defaultContent: DEFAULT_SKILL_LEARN_MD
	});
	const learnSize = Buffer.byteLength(DEFAULT_SKILL_LEARN_MD, "utf8");
	await client.execute({
		sql: seedSql,
		args: [
			crypto.randomUUID(),
			"skills/learn/SKILL.md",
			owner,
			DEFAULT_SKILL_LEARN_MD,
			"text/markdown",
			learnSize,
			now,
			now
		]
	});
}
function rowToResource(row) {
	return {
		id: row.id,
		path: row.path,
		owner: row.owner,
		content: row.content,
		mimeType: row.mime_type,
		size: row.size,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
function rowToMeta(row) {
	return {
		id: row.id,
		path: row.path,
		owner: row.owner,
		mimeType: row.mime_type,
		size: row.size,
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
async function resourceGet(id) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT * FROM resources WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return null;
	return rowToResource(rows[0]);
}
async function resourceGetByPath(owner, path) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT * FROM resources WHERE owner = ? AND path = ?`,
		args: [owner, path]
	});
	if (rows.length === 0) return null;
	return rowToResource(rows[0]);
}
async function resourcePut(owner, path, content, mimeType, options) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const size = Buffer.byteLength(content, "utf8");
	const mime = mimeType || "text/markdown";
	const { rows: existing } = await client.execute({
		sql: `SELECT id, created_at FROM resources WHERE owner = ? AND path = ?`,
		args: [owner, path]
	});
	const id = existing.length > 0 ? existing[0].id : crypto.randomUUID();
	const createdAt = existing.length > 0 ? existing[0].created_at : now;
	await client.execute({
		sql: isPostgres() ? `INSERT INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (path, owner) DO UPDATE SET id=EXCLUDED.id, content=EXCLUDED.content, mime_type=EXCLUDED.mime_type, size=EXCLUDED.size, updated_at=EXCLUDED.updated_at` : `INSERT OR REPLACE INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			id,
			path,
			owner,
			content,
			mime,
			size,
			createdAt,
			now
		]
	});
	emitResourceChange(id, path, owner, options?.requestSource);
	return {
		id,
		path,
		owner,
		content,
		mimeType: mime,
		size,
		createdAt,
		updatedAt: now
	};
}
async function resourceDelete(id) {
	await ensureTable();
	const client = getDbExec();
	const { rows } = await client.execute({
		sql: `SELECT path, owner FROM resources WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return false;
	const deleted = (await client.execute({
		sql: `DELETE FROM resources WHERE id = ?`,
		args: [id]
	})).rowsAffected > 0;
	if (deleted) emitResourceDelete(id, rows[0].path, rows[0].owner);
	return deleted;
}
async function resourceDeleteByPath(owner, path) {
	await ensureTable();
	const client = getDbExec();
	const { rows } = await client.execute({
		sql: `SELECT id FROM resources WHERE owner = ? AND path = ?`,
		args: [owner, path]
	});
	if (rows.length === 0) return false;
	const deleted = (await client.execute({
		sql: `DELETE FROM resources WHERE owner = ? AND path = ?`,
		args: [owner, path]
	})).rowsAffected > 0;
	if (deleted) emitResourceDelete(rows[0].id, path, owner);
	return deleted;
}
async function resourceList(owner, pathPrefix) {
	await ensureTable();
	const client = getDbExec();
	if (pathPrefix) {
		const { rows } = await client.execute({
			sql: `SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ? AND path LIKE ?`,
			args: [owner, pathPrefix + "%"]
		});
		return rows.map(rowToMeta);
	}
	const { rows } = await client.execute({
		sql: `SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ?`,
		args: [owner]
	});
	return rows.map(rowToMeta);
}
async function resourceListAccessible(userEmail, pathPrefix) {
	await ensureTable();
	const client = getDbExec();
	if (pathPrefix) {
		const { rows } = await client.execute({
			sql: `SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ? AND path LIKE ?
            UNION
            SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ? AND path LIKE ?`,
			args: [
				userEmail,
				pathPrefix + "%",
				SHARED_OWNER,
				pathPrefix + "%"
			]
		});
		return rows.map(rowToMeta);
	}
	const { rows } = await client.execute({
		sql: `SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ?
          UNION
          SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ?`,
		args: [userEmail, SHARED_OWNER]
	});
	return rows.map(rowToMeta);
}
/**
* List all resources matching a path prefix across ALL owners.
* Used by the recurring jobs scheduler to find all job resources.
*/
async function resourceListAllOwners(pathPrefix) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT * FROM resources WHERE path LIKE ?`,
		args: [pathPrefix + "%"]
	});
	return rows.map(rowToResource);
}
async function resourceMove(id, newPath) {
	await ensureTable();
	const client = getDbExec();
	const now = Date.now();
	const { rows } = await client.execute({
		sql: `SELECT path, owner FROM resources WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return false;
	const moved = (await client.execute({
		sql: `UPDATE resources SET path = ?, updated_at = ? WHERE id = ?`,
		args: [
			newPath,
			now,
			id
		]
	})).rowsAffected > 0;
	if (moved) emitResourceChange(id, newPath, rows[0].owner);
	return moved;
}
//#endregion
export { resourceGet as a, resourceListAccessible as c, resourcePut as d, resourceDeleteByPath as i, resourceListAllOwners as l, ensurePersonalDefaults as n, resourceGetByPath as o, resourceDelete as r, resourceList as s, SHARED_OWNER as t, resourceMove as u };
