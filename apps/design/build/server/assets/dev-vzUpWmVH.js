import "./utils-Dd6V9pzd.js";
import fs from "node:fs";
import path from "node:path";
import { execSync } from "node:child_process";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/dev/read-file.js
var MAX_OUTPUT$1 = 5e4;
var tool$4 = {
	description: "Read the contents of a file. Returns the file with line numbers. Use offset and limit to read specific sections of large files.",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description: "File path relative to the project root"
			},
			offset: {
				type: "string",
				description: "Line number to start reading from (1-based)"
			},
			limit: {
				type: "string",
				description: "Maximum number of lines to read"
			}
		},
		required: ["path"]
	}
};
async function run$4(args) {
	const filePath = args.path;
	if (!filePath) return "Error: path is required";
	const resolved = path.resolve(process.cwd(), filePath);
	try {
		if (fs.statSync(resolved).isDirectory()) return `Error: ${filePath} is a directory, not a file. Use list-files instead.`;
		const lines = fs.readFileSync(resolved, "utf-8").split("\n");
		const offset = args.offset ? Math.max(1, parseInt(args.offset, 10)) : 1;
		const limit = args.limit ? parseInt(args.limit, 10) : lines.length - offset + 1;
		let output = lines.slice(offset - 1, offset - 1 + limit).map((line, i) => `${String(offset + i).padStart(5)} │ ${line}`).join("\n");
		if (output.length > MAX_OUTPUT$1) output = output.slice(0, MAX_OUTPUT$1) + "\n... (truncated — use offset/limit to read specific sections)";
		return `${`${filePath} (${lines.length} lines)`}\n${output}`;
	} catch (err) {
		if (err?.code === "ENOENT") return `Error: File not found: ${filePath}`;
		return `Error: ${err?.message ?? String(err)}`;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/dev/write-file.js
var tool$3 = {
	description: "Write content to a file. Creates the file if it doesn't exist, or overwrites it. Creates parent directories automatically.",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description: "File path relative to the project root"
			},
			content: {
				type: "string",
				description: "The content to write to the file"
			}
		},
		required: ["path", "content"]
	}
};
async function run$3(args) {
	const filePath = args.path;
	const content = args.content;
	if (!filePath) return "Error: path is required";
	if (content === void 0) return "Error: content is required";
	const resolved = path.resolve(process.cwd(), filePath);
	try {
		const dir = path.dirname(resolved);
		fs.mkdirSync(dir, { recursive: true });
		const existed = fs.existsSync(resolved);
		fs.writeFileSync(resolved, content, "utf-8");
		const bytes = Buffer.byteLength(content, "utf-8");
		const lines = content.split("\n").length;
		return `${existed ? "Updated" : "Created"} ${filePath} (${lines} lines, ${bytes} bytes)`;
	} catch (err) {
		return `Error: ${err?.message ?? String(err)}`;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/dev/list-files.js
var MAX_DEPTH = 3;
var MAX_ENTRIES = 500;
var tool$2 = {
	description: "List files and directories. Returns a tree-style listing. Use recursive=true to show nested contents (up to 3 levels deep).",
	parameters: {
		type: "object",
		properties: {
			path: {
				type: "string",
				description: "Directory path relative to the project root (default: \".\")"
			},
			recursive: {
				type: "string",
				description: "Set to \"true\" to list recursively (max 3 levels)"
			}
		}
	}
};
function listDir(dirPath, prefix, depth, results) {
	if (depth > MAX_DEPTH || results.length >= MAX_ENTRIES) return;
	let entries;
	try {
		entries = fs.readdirSync(dirPath, { withFileTypes: true });
	} catch {
		return;
	}
	entries.sort((a, b) => {
		if (a.isDirectory() && !b.isDirectory()) return -1;
		if (!a.isDirectory() && b.isDirectory()) return 1;
		return a.name.localeCompare(b.name);
	});
	const skip = new Set([
		"node_modules",
		".git",
		".next",
		".output",
		"dist",
		".cache",
		".turbo"
	]);
	for (const entry of entries) {
		if (results.length >= MAX_ENTRIES) {
			results.push(`${prefix}... (truncated at ${MAX_ENTRIES} entries)`);
			return;
		}
		if (skip.has(entry.name)) continue;
		const isDir = entry.isDirectory();
		results.push(`${prefix}${isDir ? entry.name + "/" : entry.name}`);
		if (isDir && depth < MAX_DEPTH) listDir(path.join(dirPath, entry.name), prefix + "  ", depth + 1, results);
	}
}
async function run$2(args) {
	const dirPath = args.path || ".";
	const recursive = args.recursive === "true";
	const resolved = path.resolve(process.cwd(), dirPath);
	try {
		if (!fs.statSync(resolved).isDirectory()) return `Error: ${dirPath} is not a directory`;
	} catch (err) {
		if (err?.code === "ENOENT") return `Error: Directory not found: ${dirPath}`;
		return `Error: ${err?.message ?? String(err)}`;
	}
	const results = [];
	if (recursive) listDir(resolved, "", 0, results);
	else {
		const entries = fs.readdirSync(resolved, { withFileTypes: true });
		entries.sort((a, b) => {
			if (a.isDirectory() && !b.isDirectory()) return -1;
			if (!a.isDirectory() && b.isDirectory()) return 1;
			return a.name.localeCompare(b.name);
		});
		for (const entry of entries) results.push(entry.isDirectory() ? entry.name + "/" : entry.name);
	}
	return `${dirPath}/\n${results.join("\n")}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/dev/search-files.js
var MAX_RESULTS = 100;
var MAX_LINE_LEN = 200;
var tool$1 = {
	description: "Search file contents for a text pattern (case-insensitive). Returns matching lines with file paths and line numbers.",
	parameters: {
		type: "object",
		properties: {
			pattern: {
				type: "string",
				description: "Text pattern to search for"
			},
			path: {
				type: "string",
				description: "Directory to search in (default: \".\")"
			},
			glob: {
				type: "string",
				description: "File extension filter, e.g. \"ts\" or \"tsx\" (without dot)"
			}
		},
		required: ["pattern"]
	}
};
var SKIP_DIRS = new Set([
	"node_modules",
	".git",
	".next",
	".output",
	"dist",
	".cache",
	".turbo",
	".pnpm"
]);
var BINARY_EXTS = new Set([
	".png",
	".jpg",
	".jpeg",
	".gif",
	".ico",
	".woff",
	".woff2",
	".ttf",
	".eot",
	".mp4",
	".mp3",
	".zip",
	".gz",
	".tar",
	".db",
	".sqlite",
	".pdf"
]);
function walkFiles(dir, ext, files) {
	if (files.length >= MAX_RESULTS * 10) return;
	let entries;
	try {
		entries = fs.readdirSync(dir, { withFileTypes: true });
	} catch {
		return;
	}
	for (const entry of entries) {
		if (SKIP_DIRS.has(entry.name)) continue;
		const full = path.join(dir, entry.name);
		if (entry.isDirectory()) walkFiles(full, ext, files);
		else if (entry.isFile()) {
			const entryExt = path.extname(entry.name).toLowerCase();
			if (BINARY_EXTS.has(entryExt)) continue;
			if (ext && entryExt !== `.${ext}`) continue;
			files.push(full);
		}
	}
}
async function run$1(args) {
	const pattern = args.pattern;
	if (!pattern) return "Error: pattern is required";
	const searchDir = path.resolve(process.cwd(), args.path || ".");
	const ext = args.glob?.replace(/^\./, "");
	const cwd = process.cwd();
	const files = [];
	walkFiles(searchDir, ext, files);
	const results = [];
	const lowerPattern = pattern.toLowerCase();
	for (const file of files) {
		if (results.length >= MAX_RESULTS) break;
		let content;
		try {
			content = fs.readFileSync(file, "utf-8");
		} catch {
			continue;
		}
		const lines = content.split("\n");
		for (let i = 0; i < lines.length; i++) {
			if (results.length >= MAX_RESULTS) break;
			if (lines[i].toLowerCase().includes(lowerPattern)) {
				const relPath = path.relative(cwd, file);
				let line = lines[i];
				if (line.length > MAX_LINE_LEN) line = line.slice(0, MAX_LINE_LEN) + "...";
				results.push(`${relPath}:${i + 1}: ${line.trim()}`);
			}
		}
	}
	if (results.length === 0) return `No matches found for "${pattern}"`;
	return `${results.length >= MAX_RESULTS ? `Found ${MAX_RESULTS}+ matches for "${pattern}" (showing first ${MAX_RESULTS}):` : `Found ${results.length} match${results.length === 1 ? "" : "es"} for "${pattern}":`}\n${results.join("\n")}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/dev/shell.js
var MAX_OUTPUT = 5e4;
var TIMEOUT_MS = 3e4;
var tool = {
	description: "Run a shell command and return the output. Use for build commands, git operations, package management, or any CLI task. Has a 30-second timeout.",
	parameters: {
		type: "object",
		properties: {
			command: {
				type: "string",
				description: "The shell command to execute"
			},
			cwd: {
				type: "string",
				description: "Working directory for the command (default: project root)"
			}
		},
		required: ["command"]
	}
};
async function run(args) {
	const command = args.command;
	if (!command) return "Error: command is required";
	const cwd = args.cwd ? path.resolve(process.cwd(), args.cwd) : process.cwd();
	try {
		let result = execSync(command, {
			cwd,
			timeout: TIMEOUT_MS,
			encoding: "utf-8",
			maxBuffer: 1024 * 1024,
			stdio: [
				"pipe",
				"pipe",
				"pipe"
			],
			env: {
				...process.env,
				FORCE_COLOR: "0"
			}
		});
		if (result.length > MAX_OUTPUT) result = result.slice(0, MAX_OUTPUT) + "\n... (output truncated at 50KB)";
		return result || "(no output)";
	} catch (err) {
		let output = "";
		if (err?.stdout) output += err.stdout;
		if (err?.stderr) output += (output ? "\n" : "") + err.stderr;
		if (!output) output = err?.message ?? String(err);
		if (output.length > MAX_OUTPUT) output = output.slice(0, MAX_OUTPUT) + "\n... (output truncated)";
		throw new Error(`Command failed (exit ${err?.status ?? "?"})\n${output}`);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/dev/index.js
/**
* Dev-mode script registry.
*
* Provides file system, shell, and database tools for the agent
* when running in development mode. These tools should NEVER be
* registered in production.
*/
/**
* Wraps a core CLI script (that writes to console.log) as a ActionEntry
* by capturing stdout.
*/
function wrapCliScript(tool, cliDefault, opts) {
	return {
		tool,
		...opts?.readOnly ? { readOnly: true } : {},
		run: async (args) => {
			const cliArgs = [];
			for (const [k, v] of Object.entries(args)) {
				const raw = v;
				const value = raw != null && typeof raw === "object" ? JSON.stringify(raw) : String(raw);
				cliArgs.push(`--${k}`, value);
			}
			const logs = [];
			const origLog = console.log;
			console.log = (...a) => {
				logs.push(a.map(String).join(" "));
			};
			try {
				await cliDefault(cliArgs);
			} catch (err) {
				logs.push(`Error: ${err?.message ?? String(err)}`);
			} finally {
				console.log = origLog;
			}
			return logs.join("\n") || "(no output)";
		}
	};
}
/**
* Creates the dev-mode script registry with file system, shell,
* and database tools. Call this and merge with your app's registry
* when NODE_ENV !== "production".
*/
async function createDevScriptRegistry() {
	let dbEntries = {};
	try {
		const [dbSchema, dbQuery, dbExec, dbPatch, dbCheckScoping] = await Promise.all([
			import("./schema-DJXhJnsv.js"),
			import("./query-C48knjGV.js"),
			import("./exec-BxndUWgn.js"),
			import("./patch-CATnGLVA.js"),
			import("./check-scoping-DMXEKpQF.js")
		]);
		dbEntries = {
			"db-schema": wrapCliScript({
				description: "Show all database tables, columns, types, and foreign keys",
				parameters: {
					type: "object",
					properties: { format: {
						type: "string",
						description: "Output format: \"json\" or \"text\" (default: text)",
						enum: ["json", "text"]
					} }
				}
			}, dbSchema.default, { readOnly: true }),
			"db-query": wrapCliScript({
				description: "Run a read-only SQL query (SELECT, WITH, EXPLAIN, PRAGMA) against the app database",
				parameters: {
					type: "object",
					properties: {
						sql: {
							type: "string",
							description: "The SQL SELECT query to execute"
						},
						args: {
							type: "string",
							description: "Optional JSON array of positional bind args for parameterized placeholders. Example: '[\"draft\",\"form-123\"]'"
						},
						format: {
							type: "string",
							description: "Output format: \"json\" or \"table\" (default: table)",
							enum: ["json", "table"]
						}
					},
					required: ["sql"]
				}
			}, dbQuery.default, { readOnly: true }),
			"db-exec": wrapCliScript({
				description: "Execute app-database write SQL (INSERT, UPDATE, DELETE, REPLACE). For multiple related writes, pass `statements` so they run sequentially in one transaction instead of issuing several db-exec calls. Schema changes (CREATE/ALTER/DROP) are blocked.",
				parameters: {
					type: "object",
					properties: {
						sql: {
							type: "string",
							description: "Single INSERT / UPDATE / DELETE / REPLACE statement. Use parameterized placeholders (?) where possible."
						},
						args: {
							type: "string",
							description: "Optional JSON array of positional bind args for `sql`. Example: '[\"published\",\"form-123\"]'"
						},
						statements: {
							type: "string",
							description: "Optional JSON array of write statements to execute in one transaction. Prefer this over multiple db-exec calls. Example: '[{\"sql\":\"INSERT INTO notes (id,title) VALUES (?,?)\",\"args\":[\"n1\",\"One\"]},{\"sql\":\"UPDATE counters SET value = value + 1 WHERE key = ?\",\"args\":[\"notes\"]}]'"
						},
						format: {
							type: "string",
							description: "Output format: \"json\" or \"text\" (default: text)",
							enum: ["json", "text"]
						}
					}
				}
			}, dbExec.default),
			"db-patch": wrapCliScript({
				description: "Surgical search-and-replace on a text column in a SQL table. Prefer over `db-exec UPDATE` for large text fields (documents, slides, dashboards, JSON blobs) where you only need to change a small slice — avoids re-sending the full column value. Targets exactly one row at a time (narrow --where by primary key). If a template-specific action exists for the table (e.g. `edit-document`, `update-slide`), use that instead — it will also push live updates to open collaborative editors.",
				parameters: {
					type: "object",
					properties: {
						table: {
							type: "string",
							description: "Target table name (plain identifier, no quoting)"
						},
						column: {
							type: "string",
							description: "Target text column name (plain identifier, no quoting)"
						},
						where: {
							type: "string",
							description: "SQL WHERE clause that matches exactly one row, e.g. \"id = 'abc123'\". Must not contain semicolons or DDL keywords."
						},
						find: {
							type: "string",
							description: "Text to find (single-edit mode). Pair with --replace."
						},
						replace: {
							type: "string",
							description: "Replacement text (single-edit mode). Defaults to \"\" (delete the match)."
						},
						edits: {
							type: "string",
							description: "Batch mode: JSON array of {find, replace} objects. Example: '[{\"find\":\"Q3\",\"replace\":\"Q4\"},{\"find\":\"$1M\",\"replace\":\"$1.2M\"}]'"
						},
						all: {
							type: "string",
							description: "Set to \"true\" to replace every occurrence of each find (default: first occurrence only).",
							enum: ["true", "false"]
						},
						format: {
							type: "string",
							description: "Output format: \"json\" or \"text\" (default: text)",
							enum: ["json", "text"]
						}
					},
					required: [
						"table",
						"column",
						"where"
					]
				}
			}, dbPatch.default),
			"db-check-scoping": wrapCliScript({
				description: "Validate that all template tables have owner_email and org_id columns for data scoping",
				parameters: {
					type: "object",
					properties: {
						"require-org": {
							type: "string",
							description: "Set to \"true\" to also require org_id columns (for multi-org apps)",
							enum: ["true", "false"]
						},
						format: {
							type: "string",
							description: "Output format: \"json\" or \"text\" (default: text)",
							enum: ["json", "text"]
						}
					}
				}
			}, dbCheckScoping.default, { readOnly: true })
		};
	} catch {}
	return {
		"read-file": {
			tool: tool$4,
			run: run$4,
			readOnly: true
		},
		"write-file": {
			tool: tool$3,
			run: run$3
		},
		"list-files": {
			tool: tool$2,
			run: run$2,
			readOnly: true
		},
		"search-files": {
			tool: tool$1,
			run: run$1,
			readOnly: true
		},
		shell: {
			tool,
			run
		},
		...dbEntries
	};
}
//#endregion
export { createDevScriptRegistry as t };
