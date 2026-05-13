import { r as getSetting } from "./store-Cfa2yBtr.js";
import { m as resolveSecret, o as readDeployCredentialEnv, t as canUseDeployCredentialFallbackForRequest } from "./credential-provider-DYZUZb4W.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/agent/engine/registry.js
/**
* Agent Engine Registry.
*
* Mirrors the CLI_REGISTRY pattern (packages/core/src/terminal/cli-registry.ts)
* but is open — anyone can register a custom engine via registerAgentEngine()
* from a server plugin at startup.
*
* Built-in engines (anthropic, ai-sdk) are auto-registered by builtin.ts.
*/
var _registry = /* @__PURE__ */ new Map();
/**
* Register a custom agent engine. Called at server startup (e.g., from a
* server plugin or builtin.ts). Throws if name is already registered.
*/
function registerAgentEngine(entry) {
	if (_registry.has(entry.name)) {
		if (process.env.NODE_ENV === "test") {
			_registry.set(entry.name, entry);
			return;
		}
		console.warn(`[agent-engine] Engine "${entry.name}" is already registered. Skipping.`);
		return;
	}
	_registry.set(entry.name, entry);
}
/** Get a registered engine entry by name, or undefined if not found */
function getAgentEngineEntry(name) {
	return _registry.get(name);
}
/** List all registered engine entries */
function listAgentEngines() {
	return Array.from(_registry.values());
}
/**
* First registered engine whose requiredEnvVars are all set. Registration
* order controls priority — the Builder gateway is registered first so it
* wins when the Builder private key is present.
*
* Escape hatch: AGENT_ENGINE_PREFER_BYO_KEY=true skips the Builder engine
* on the first pass, so an explicit provider key (ANTHROPIC_API_KEY etc.)
* is picked instead. Builder is still used as the fallback when no other
* provider key is set.
*/
function detectEngineFromEnv() {
	if (/^(1|true)$/i.test(process.env.AGENT_ENGINE_PREFER_BYO_KEY ?? "")) for (const entry of _registry.values()) {
		if (entry.name === "builder") continue;
		if (entry.requiredEnvVars.length === 0) continue;
		if (entry.requiredEnvVars.every((v) => !!readDeployCredentialEnv(v))) return entry;
	}
	for (const entry of _registry.values()) {
		if (entry.requiredEnvVars.length === 0) continue;
		if (entry.requiredEnvVars.every((v) => !!readDeployCredentialEnv(v))) return entry;
	}
	return null;
}
/**
* Detect a usable engine from the current request user's accessible
* `app_secrets` rows. Mirrors `detectEngineFromEnv` but consults the
* encrypted secret store instead of `process.env`, including org-scoped
* credentials shared with the active organization.
*
* Required because the Builder OAuth callback (and the settings UI's
* "paste your own key" flow) writes credentials to app_secrets, not env.
* Without this check, a user who connected Builder would see status
* "configured" but the next chat turn would fall through to the default
* Anthropic engine and hit `missing_api_key` — exactly Brent's symptom
* on the docs site (Loom 2026-04-28: "It doesn't seem to realize I'm
* connected once I do a chat").
*
* Includes the local dev session (`local@localhost`): the Builder
* OAuth flow writes credentials scoped to that email when run from
* `pnpm dev`, so detection has to consult those rows or the dev user
* sees the same "Connect your AI" card after they've already connected
* (Sami, 2026-04-30). Org-scoped Builder credentials must also count here:
* `/builder/status` resolves them via the same request org context, and the
* chat engine picker must not disagree with that card.
*/
async function detectEngineFromUserSecrets() {
	let email;
	try {
		const { getRequestUserEmail } = await import("./request-context-BQ-cTIMw.js").then((n) => n.c);
		email = getRequestUserEmail();
	} catch {
		return null;
	}
	if (!email) return null;
	const hasAllKeys = async (entry) => {
		if (entry.requiredEnvVars.length === 0) return false;
		for (const key of entry.requiredEnvVars) try {
			if (!await resolveSecret(key)) return false;
		} catch {
			return false;
		}
		return true;
	};
	if (/^(1|true)$/i.test(process.env.AGENT_ENGINE_PREFER_BYO_KEY ?? "")) for (const entry of _registry.values()) {
		if (entry.name === "builder") continue;
		if (await hasAllKeys(entry)) return entry;
	}
	for (const entry of _registry.values()) if (await hasAllKeys(entry)) return entry;
	return null;
}
/**
* Legacy inline API keys on the global `agent-engine` settings row are
* intentionally ignored. That row is deployment-wide, so treating
* `{ apiKey }` or `{ config: { apiKey } }` as configured would let one
* user's pasted key power every other user. Per-user keys live in
* `app_secrets` and are resolved separately.
*/
function isAgentEngineSettingConfigured(stored) {
	if (!stored || typeof stored !== "object") return false;
	const s = stored;
	if (typeof s.engine !== "string" || !s.engine) return false;
	return false;
}
function stripInlineApiKeyConfig(config) {
	if (!config) return {};
	const { apiKey: _discardedApiKey, ...safeConfig } = config;
	return safeConfig;
}
function engineCreateConfig(apiKey, extra) {
	return {
		apiKey,
		allowEnvFallback: canUseDeployCredentialFallbackForRequest(),
		...extra ?? {}
	};
}
/**
* Request-aware version of `isStoredEngineUsable`.
*
* The settings row stores the selected engine/model, while credentials may
* live in per-user/org `app_secrets`. The sync helper intentionally only sees
* deploy env vars; this async helper is what request-time routes should use
* when deciding whether a stored engine can actually run for the current user.
*/
async function isStoredEngineUsableForRequest(stored, entry) {
	if (isAgentEngineSettingConfigured(stored)) return true;
	if (entry.requiredEnvVars.length === 0) return true;
	for (const key of entry.requiredEnvVars) {
		try {
			if (await resolveSecret(key)) continue;
		} catch {}
		if (!canUseDeployCredentialFallbackForRequest() || !readDeployCredentialEnv(key)) return false;
	}
	return true;
}
/**
* Resolve an AgentEngine from options → explicit env → request credentials →
* settings → env → default.
*
* Resolution order:
* 1. Explicit `engineOption` from plugin options (string name, instance, or {name, config})
* 2. Env var AGENT_ENGINE
* 3. Current request's app_secrets; Builder wins by default when connected
* 4. Settings store key "agent-engine" → { engine: string }, when usable
* 5. Auto-detect deployment env credentials
* 6. Default "anthropic" (requires ANTHROPIC_API_KEY)
*/
async function resolveEngine(config) {
	const { engineOption, apiKey, model: _model } = config;
	if (engineOption && typeof engineOption === "object" && "stream" in engineOption) return engineOption;
	if (engineOption && typeof engineOption === "object" && "name" in engineOption) {
		const { name, config: engineConfig } = engineOption;
		const entry = _registry.get(name);
		if (!entry) throw new Error(`[agent-engine] Unknown engine: "${name}". Registered: ${[..._registry.keys()].join(", ")}`);
		return entry.create(engineCreateConfig(apiKey, engineConfig));
	}
	if (typeof engineOption === "string") {
		const entry = _registry.get(engineOption);
		if (!entry) throw new Error(`[agent-engine] Unknown engine: "${engineOption}". Registered: ${[..._registry.keys()].join(", ")}`);
		return entry.create(engineCreateConfig(apiKey));
	}
	const envEngine = process.env.AGENT_ENGINE;
	if (envEngine) {
		const entry = _registry.get(envEngine);
		if (entry) return entry.create(engineCreateConfig(apiKey));
	}
	let stored = null;
	try {
		stored = await getSetting("agent-engine");
	} catch {}
	const detectedFromUser = await detectEngineFromUserSecrets();
	if (detectedFromUser?.name === "builder") return detectedFromUser.create(engineCreateConfig(apiKey));
	if (stored && typeof stored.engine === "string") {
		const entry = _registry.get(stored.engine);
		if (entry && await isStoredEngineUsableForRequest(stored, entry)) return entry.create({ ...engineCreateConfig(apiKey, stripInlineApiKeyConfig(stored.config)) });
	}
	if (detectedFromUser) return detectedFromUser.create(engineCreateConfig(apiKey));
	const detected = canUseDeployCredentialFallbackForRequest() ? detectEngineFromEnv() : null;
	if (detected) return detected.create(engineCreateConfig(apiKey));
	const anthropicEntry = _registry.get("anthropic");
	if (!anthropicEntry) throw new Error("[agent-engine] Default Anthropic engine is not registered. Did builtin.ts fail to load?");
	return anthropicEntry.create(engineCreateConfig(apiKey));
}
/**
* Read the user-selected model for an engine from the `agent-engine` setting.
*
* The settings UI writes `{engine, model}` via the `manage-agent-engine` action="set",
* but `resolveEngine` only uses the stored engine (the model is a separate
* per-request concern). Call this helper alongside `resolveEngine` to honor
* the user's model choice without requiring a process restart.
*
* Returns the stored model only when the stored engine name matches `engine`
* — otherwise returns `undefined` to avoid applying an Anthropic model string
* to, say, an OpenRouter engine.
*/
async function getStoredModelForEngine(engine) {
	const engineName = typeof engine === "string" ? engine : engine.name;
	try {
		const stored = await getSetting("agent-engine");
		if (stored && typeof stored.engine === "string" && stored.engine === engineName && typeof stored.model === "string" && stored.model.length > 0) return stored.model;
	} catch {}
}
//#endregion
export { isAgentEngineSettingConfigured as a, registerAgentEngine as c, getStoredModelForEngine as i, resolveEngine as l, detectEngineFromUserSecrets as n, isStoredEngineUsableForRequest as o, getAgentEngineEntry as r, listAgentEngines as s, detectEngineFromEnv as t };
