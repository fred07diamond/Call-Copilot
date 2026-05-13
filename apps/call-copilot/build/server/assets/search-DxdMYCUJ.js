import { i as parseArgs } from "./utils-DGqsMmdl.js";
import fs from "node:fs";
import nodePath from "node:path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/docs/search.js
/**
* Core script: docs-search
*
* Search and read agent-native framework documentation.
* Docs are bundled in @agent-native/core so they're always the right version.
*
* Usage:
*   pnpm action docs-search --query "actions"
*   pnpm action docs-search --slug authentication
*   pnpm action docs-search --list
*/
function getDocsDir() {
	return nodePath.resolve(nodePath.dirname(new URL(import.meta.url).pathname), "../../../docs/content");
}
function parseFrontmatter(raw) {
	const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
	if (!match) return {
		data: {},
		body: raw
	};
	const data = {};
	for (const line of match[1].split("\n")) {
		const m = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
		if (m) data[m[1]] = m[2];
	}
	return {
		data,
		body: match[2]
	};
}
function loadAllDocs() {
	const docsDir = getDocsDir();
	if (!fs.existsSync(docsDir)) return [];
	return fs.readdirSync(docsDir).filter((f) => f.endsWith(".md")).map((file) => {
		const raw = fs.readFileSync(nodePath.join(docsDir, file), "utf-8");
		const slug = file.replace(/\.md$/, "");
		const { data, body } = parseFrontmatter(raw);
		return {
			slug,
			title: data.title || slug,
			description: data.description || "",
			body
		};
	});
}
function searchDocs(query) {
	const docs = loadAllDocs();
	const terms = query.toLowerCase().split(/\s+/);
	return docs.map((doc) => {
		const searchText = `${doc.title} ${doc.description} ${doc.body}`.toLowerCase();
		let score = 0;
		for (const term of terms) {
			if (doc.title.toLowerCase().includes(term)) score += 10;
			if (doc.description.toLowerCase().includes(term)) score += 5;
			if (doc.slug.includes(term)) score += 8;
			const bodyMatches = searchText.split(term).length - 1;
			score += Math.min(bodyMatches, 5);
		}
		return {
			doc,
			score
		};
	}).filter((item) => item.score > 0).sort((a, b) => b.score - a.score).map(({ doc }) => ({
		slug: doc.slug,
		title: doc.title,
		description: doc.description
	}));
}
async function docsSearchScript(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action docs-search [options]

Options:
  --query <text>    Search docs by keyword (returns matching pages)
  --slug <slug>     Read a specific doc page by slug
  --list            List all available doc pages
  --help            Show this help message`);
		return;
	}
	if (parsed.list === "true") {
		const listing = loadAllDocs().map((d) => ({
			slug: d.slug,
			title: d.title,
			description: d.description
		}));
		console.log(JSON.stringify(listing, null, 2));
		return;
	}
	if (parsed.slug) {
		const docs = loadAllDocs();
		const doc = docs.find((d) => d.slug === parsed.slug);
		if (!doc) {
			console.log(`Doc not found: ${parsed.slug}`);
			console.log(`Available: ${docs.map((d) => d.slug).join(", ")}`);
			return;
		}
		console.log(`# ${doc.title}\n`);
		if (doc.description) console.log(`${doc.description}\n`);
		console.log(doc.body);
		return;
	}
	if (parsed.query) {
		const results = searchDocs(parsed.query);
		if (results.length === 0) {
			console.log(`No docs found matching "${parsed.query}".`);
			return;
		}
		console.log(`Found ${results.length} doc(s) matching "${parsed.query}":\n`);
		for (const result of results.slice(0, 8)) {
			console.log(`  ${result.slug} — ${result.title}`);
			if (result.description) console.log(`    ${result.description}`);
		}
		console.log(`\nUse --slug <slug> to read the full doc.`);
		return;
	}
	console.log("Provide --query, --slug, or --list. Use --help for details.");
}
//#endregion
export { docsSearchScript as default };
