import { r as __exportAll } from "./chunk-D3zDcpJC.js";
import { t as TEMPLATES } from "./templates-meta-Dggq7O3f.js";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/agent-discovery.js
var agent_discovery_exports = /* @__PURE__ */ __exportAll({
	BUILTIN_AGENTS_FOR_SEEDING: () => BUILTIN_AGENTS_FOR_SEEDING,
	discoverAgents: () => discoverAgents,
	findAgent: () => findAgent,
	getBuiltinAgents: () => getBuiltinAgents,
	loadWorkspaceAppsManifest: () => loadWorkspaceAppsManifest,
	shouldIncludeRemoteAgentManifest: () => shouldIncludeRemoteAgentManifest
});
/**
* Built-in agent registry. Derive this from the published CLI metadata so
* connected-agent discovery stays aligned with first-party template metadata
* without depending on @agent-native/shared-app-config at runtime.
*/
var BUILTIN_AGENTS = TEMPLATES.filter((template) => (!template.hidden || template.defaultAgent) && !!template.prodUrl).map((template) => ({
	id: template.name,
	name: template.label,
	description: template.description ?? template.hint,
	url: template.prodUrl,
	devUrl: `http://localhost:${template.devPort}`,
	devPort: template.devPort,
	color: template.color
}));
var HIDDEN_FIRST_PARTY_AGENT_IDS = new Set(TEMPLATES.filter((template) => template.hidden && !template.defaultAgent && template.prodUrl).map((template) => template.name));
var WORKSPACE_APPS_ENV_KEY = "AGENT_NATIVE_WORKSPACE_APPS_JSON";
var WORKSPACE_APPS_MANIFEST_FILE = "workspace-apps.json";
/**
* Resolve the workspace app manifest from the same fallback chain that
* `discoverWorkspaceAgents` uses: `AGENT_NATIVE_WORKSPACE_APPS_JSON` env →
* `.agent-native/workspace-apps.json` (or sibling) on disk → live filesystem
* scan of `apps/<id>/package.json` under the workspace root.
*
* Callers (e.g. the dispatch `/dispatch/<appId>` catch-all loader) need this
* to behave the same in production deploys (which write the manifest file)
* and during local dev (where new apps appear under `apps/` without an env
* restart). Reading only the env var would silently downgrade the behavior
* in both cases.
*/
function loadWorkspaceAppsManifest() {
	return readWorkspaceAppsFromEnv() ?? readWorkspaceAppsFromManifestFile() ?? readWorkspaceAppsFromFilesystem();
}
function shouldIncludeRemoteAgentManifest(manifest, selfAppId) {
	const id = manifest.id?.trim();
	if (!id) return false;
	const normalizedId = id.toLowerCase();
	const normalizedSelfAppId = selfAppId?.trim().toLowerCase();
	if (normalizedSelfAppId && normalizedId === normalizedSelfAppId) return false;
	return !HIDDEN_FIRST_PARTY_AGENT_IDS.has(normalizedId);
}
/**
* Get built-in agents (static, no DB). Used as fallback and for seeding.
*/
function getBuiltinAgents(selfAppId) {
	return BUILTIN_AGENTS.filter((app) => app.id !== selfAppId && app.url).map((app) => ({
		id: app.id,
		name: app.name,
		description: app.description,
		url: resolveAgentUrl(app),
		color: app.color
	}));
}
/**
* Discover all agents: built-in + custom agents stored as resources.
* Custom agents override built-in agents with the same ID.
*/
async function discoverAgents(selfAppId) {
	const builtins = getBuiltinAgents(selfAppId);
	const agentsById = /* @__PURE__ */ new Map();
	for (const agent of builtins) agentsById.set(agent.id, agent);
	try {
		const { resourceList, resourceGet, SHARED_OWNER } = await import("./store-C4t59_TO.js");
		const { parseRemoteAgentManifest, REMOTE_AGENT_RESOURCE_PREFIXES } = await import("./metadata-CqP8m5xN.js").then((n) => n.c);
		const resources = [];
		for (const prefix of [...REMOTE_AGENT_RESOURCE_PREFIXES].reverse()) resources.push(...await resourceList(SHARED_OWNER, prefix));
		for (const r of resources) {
			if (!r.path.endsWith(".json")) continue;
			try {
				const full = await resourceGet(r.id);
				if (!full) continue;
				const manifest = parseRemoteAgentManifest(full.content, r.path);
				if (!manifest || !shouldIncludeRemoteAgentManifest(manifest, selfAppId)) continue;
				let url = manifest.url;
				if (typeof process !== "undefined" && process.env.NODE_ENV === "production" && typeof url === "string" && /^https?:\/\/(localhost|127\.0\.0\.1|0\.0\.0\.0)(:|\/|$)/.test(url)) {
					const builtin = agentsById.get(manifest.id);
					if (builtin?.url) url = builtin.url;
				}
				agentsById.set(manifest.id, {
					id: manifest.id,
					name: manifest.name,
					description: manifest.description || "",
					url,
					color: manifest.color || "#6B7280"
				});
			} catch {}
		}
	} catch {}
	for (const agent of discoverWorkspaceAgents(selfAppId)) agentsById.set(agent.id, agent);
	return Array.from(agentsById.values());
}
/**
* Look up a single agent by ID or name (case-insensitive).
*/
async function findAgent(idOrName, selfAppId) {
	const lower = idOrName.toLowerCase();
	return (await discoverAgents(selfAppId)).find((a) => a.id === lower || a.name.toLowerCase() === lower);
}
function isDevEnvironment() {
	return typeof process !== "undefined" && process.env.NODE_ENV !== "production";
}
function resolveAgentUrl(app) {
	if (isDevEnvironment()) return app.devUrl || `http://localhost:${app.devPort}`;
	return app.url;
}
function readJson(file) {
	try {
		return JSON.parse(fs.readFileSync(file, "utf8"));
	} catch {
		return null;
	}
}
function findWorkspaceRoot(startDir = process.cwd()) {
	let dir = path.resolve(startDir);
	for (let i = 0; i < 20; i++) {
		if (typeof readJson(path.join(dir, "package.json"))?.["agent-native"]?.workspaceCore === "string") return dir;
		const parent = path.dirname(dir);
		if (parent === dir) break;
		dir = parent;
	}
	return null;
}
function titleCase(value) {
	return value.split(/[-_\s]+/).filter(Boolean).map((part) => part.charAt(0).toUpperCase() + part.slice(1)).join(" ");
}
function parseWorkspaceAppsManifest(parsed) {
	const rawApps = Array.isArray(parsed?.apps) ? parsed.apps : Array.isArray(parsed) ? parsed : null;
	if (!rawApps) return null;
	const apps = rawApps.map((entry) => {
		if (!entry || typeof entry !== "object") return null;
		const id = typeof entry.id === "string" ? entry.id.trim() : "";
		const pathValue = typeof entry.path === "string" ? entry.path.trim() : "";
		if (!id || !pathValue.startsWith("/")) return null;
		return {
			id,
			name: typeof entry.name === "string" && entry.name.trim() ? entry.name.trim() : titleCase(id),
			description: typeof entry.description === "string" ? entry.description : "",
			path: pathValue,
			url: typeof entry.url === "string" && entry.url.trim() ? entry.url.trim() : null,
			isDispatch: typeof entry.isDispatch === "boolean" ? entry.isDispatch : id === "dispatch"
		};
	}).filter((app) => !!app).sort((a, b) => {
		if (a.id === "dispatch") return -1;
		if (b.id === "dispatch") return 1;
		return a.name.localeCompare(b.name);
	});
	return apps.length ? apps : null;
}
function readWorkspaceAppsFromEnv() {
	const raw = process.env[WORKSPACE_APPS_ENV_KEY];
	if (!raw) return null;
	try {
		return parseWorkspaceAppsManifest(JSON.parse(raw));
	} catch {
		return null;
	}
}
function workspaceAppsManifestCandidates() {
	const candidates = [];
	try {
		candidates.push(path.join(process.cwd(), ".agent-native", WORKSPACE_APPS_MANIFEST_FILE), path.join(process.cwd(), WORKSPACE_APPS_MANIFEST_FILE));
	} catch {}
	try {
		const moduleDir = path.dirname(fileURLToPath(import.meta.url));
		candidates.push(path.join(moduleDir, ".agent-native", WORKSPACE_APPS_MANIFEST_FILE), path.join(moduleDir, WORKSPACE_APPS_MANIFEST_FILE));
	} catch {}
	return candidates;
}
function readWorkspaceAppsFromManifestFile() {
	for (const file of workspaceAppsManifestCandidates()) {
		if (!fs.existsSync(file)) continue;
		const apps = parseWorkspaceAppsManifest(readJson(file));
		if (apps) return apps;
	}
	return null;
}
function readWorkspaceAppsFromFilesystem() {
	const workspaceRoot = findWorkspaceRoot();
	if (!workspaceRoot) return null;
	const appsDir = path.join(workspaceRoot, "apps");
	if (!fs.existsSync(appsDir)) return null;
	const apps = fs.readdirSync(appsDir, { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => {
		const appDir = path.join(appsDir, entry.name);
		const pkg = readJson(path.join(appDir, "package.json"));
		if (!pkg) return null;
		return {
			id: entry.name,
			name: pkg.displayName || titleCase(entry.name),
			description: pkg.description || "",
			path: `/${entry.name}`,
			isDispatch: entry.name === "dispatch"
		};
	}).filter((app) => !!app).sort((a, b) => {
		if (a.id === "dispatch") return -1;
		if (b.id === "dispatch") return 1;
		return a.name.localeCompare(b.name);
	});
	return apps.length ? apps : null;
}
function workspaceBaseUrl() {
	return process.env.WORKSPACE_GATEWAY_URL || process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL || process.env.BETTER_AUTH_URL || null;
}
function workspaceAppUrl(app) {
	if (app.url) return app.url;
	const base = workspaceBaseUrl();
	if (!base) return null;
	try {
		return new URL(app.path, `${base.replace(/\/$/, "")}/`).toString();
	} catch {
		return null;
	}
}
function discoverWorkspaceAgents(selfAppId) {
	const workspaceApps = loadWorkspaceAppsManifest();
	if (!workspaceApps) return [];
	return workspaceApps.filter((app) => app.id !== selfAppId).map((app) => {
		const url = workspaceAppUrl(app);
		if (!url) return null;
		const builtin = BUILTIN_AGENTS.find((agent) => agent.id === app.id);
		return {
			id: app.id,
			name: app.name,
			description: app.description || builtin?.description || `Workspace app mounted at ${app.path}`,
			url,
			color: builtin?.color || "#6B7280"
		};
	}).filter((agent) => !!agent);
}
/**
* Like `getBuiltinAgents`, but always returns the production URL — never the
* env-resolved devUrl. Used by the resource seeder so that a one-time seed
* (`ON CONFLICT DO NOTHING`) can't permanently bake a localhost URL into the
* DB, which would override the built-in's prod URL for every later
* production deploy.
*/
var BUILTIN_AGENTS_FOR_SEEDING = BUILTIN_AGENTS.filter((app) => app.url).map((app) => ({
	id: app.id,
	name: app.name,
	description: app.description,
	url: app.url,
	color: app.color
}));
//#endregion
export { discoverAgents as n, findAgent as r, agent_discovery_exports as t };
