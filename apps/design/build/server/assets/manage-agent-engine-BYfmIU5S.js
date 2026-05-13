import { a as putSetting, r as getSetting } from "./store-BMQUS1KJ.js";
import { n as detectEngineFromUserSecrets, o as isStoredEngineUsableForRequest, r as getAgentEngineEntry, s as listAgentEngines, t as detectEngineFromEnv } from "./registry-DlSn3U6q.js";
import { t as registerBuiltinEngines } from "./builtin-CZUg4_3B.js";
import { a as DEFAULT_MODEL } from "./model-config-DXbH96gG.js";
import "./engine-DAHmAbqJ.js";
import "./settings-GlD3rlOS.js";
import "./default-model-dfA_DjVf.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/agent-engines/list-agent-engines.js
/**
* list-agent-engines — returns the registered engine registry and current selection.
*/
async function run$3() {
	registerBuiltinEngines();
	const engines = listAgentEngines();
	const currentSetting = await getSetting("agent-engine");
	const current = currentSetting ? currentSetting : null;
	const storedEntry = typeof current?.engine === "string" ? getAgentEngineEntry(current.engine) : void 0;
	const storedUsable = !!storedEntry && await isStoredEngineUsableForRequest(current, storedEntry);
	const detectedFromUser = await detectEngineFromUserSecrets();
	const currentEntry = (process.env.AGENT_ENGINE ? getAgentEngineEntry(process.env.AGENT_ENGINE) : void 0) ?? (detectedFromUser?.name === "builder" ? detectedFromUser : void 0) ?? (storedUsable ? storedEntry : void 0) ?? detectedFromUser ?? detectEngineFromEnv() ?? void 0;
	const currentModel = storedUsable && currentEntry?.name === current?.engine ? current?.model : void 0;
	const currentEngineName = currentEntry?.name ?? "anthropic";
	const result = {
		engines: engines.map((e) => ({
			name: e.name,
			label: e.label,
			description: e.description,
			defaultModel: e.defaultModel,
			supportedModels: e.supportedModels,
			capabilities: e.capabilities,
			requiredEnvVars: e.requiredEnvVars,
			installPackage: e.installPackage
		})),
		current: {
			engine: currentEngineName,
			model: currentModel ?? currentEntry?.defaultModel ?? DEFAULT_MODEL
		}
	};
	return JSON.stringify(result, null, 2);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/agent-engines/set-agent-engine.js
/**
* set-agent-engine — validates and writes agent engine selection to settings.
*/
async function run$2(args) {
	registerBuiltinEngines();
	const { engine: engineName, model } = args;
	if (!engineName) return "Error: --engine is required";
	const entry = getAgentEngineEntry(engineName);
	if (!entry) return `Error: Engine "${engineName}" not found. Available engines: ${listAgentEngines().map((e) => e.name).join(", ")}`;
	const resolvedModel = model ?? entry.defaultModel;
	const modelIsCurated = entry.supportedModels.length === 0 || entry.supportedModels.includes(resolvedModel);
	const missingEnvVars = entry.requiredEnvVars.filter((v) => !process.env[v]);
	if (missingEnvVars.length > 0) return `Warning: Engine "${engineName}" requires the following environment variables which are not set: ${missingEnvVars.join(", ")}. The engine will fail at runtime without them.`;
	await putSetting("agent-engine", {
		engine: engineName,
		model: resolvedModel
	});
	const customNote = modelIsCurated ? "" : ` (model "${resolvedModel}" isn't in the curated list for ${entry.label}; saved as a custom model — verify it's a real ID for this provider)`;
	return JSON.stringify({
		ok: true,
		engine: engineName,
		model: resolvedModel,
		message: `Agent engine set to ${entry.label} with model ${resolvedModel}. Takes effect on the next conversation.${customNote}`
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/agent-engines/test-agent-engine.js
/**
* test-agent-engine — sends a trivial prompt to verify the engine is working.
*/
async function run$1(args) {
	registerBuiltinEngines();
	const engineName = args.engine ?? "anthropic";
	const entry = getAgentEngineEntry(engineName);
	if (!entry) return JSON.stringify({
		ok: false,
		error: `Engine "${engineName}" not found`
	});
	const model = args.model ?? entry.defaultModel;
	try {
		const engine = entry.create({ apiKey: entry.requiredEnvVars.length > 0 ? process.env[entry.requiredEnvVars[0]] : void 0 });
		const start = Date.now();
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), 3e4);
		let responseText = "";
		let stopReason = "";
		let streamError;
		try {
			for await (const event of engine.stream({
				model,
				systemPrompt: "You are a test agent. Reply concisely.",
				messages: [{
					role: "user",
					content: [{
						type: "text",
						text: "Reply with exactly: OK"
					}]
				}],
				tools: [],
				abortSignal: controller.signal
			})) if (event.type === "text-delta") responseText += event.text;
			else if (event.type === "stop") {
				stopReason = event.reason;
				if (event.reason === "error") streamError = event.error ?? "Unknown error";
			}
		} finally {
			clearTimeout(timeout);
		}
		const latencyMs = Date.now() - start;
		if (streamError) return JSON.stringify({
			ok: false,
			engine: engineName,
			model,
			error: streamError,
			capabilities: entry.capabilities
		});
		return JSON.stringify({
			ok: true,
			engine: engineName,
			model,
			latencyMs,
			response: responseText.slice(0, 100),
			stopReason,
			capabilities: entry.capabilities
		});
	} catch (err) {
		return JSON.stringify({
			ok: false,
			engine: engineName,
			model,
			error: err?.message ?? String(err),
			capabilities: entry.capabilities
		});
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/agent-engines/manage-agent-engine.js
/**
* manage-agent-engine — unified tool for listing, setting, and testing agent engines.
*
* Consolidates the former list-agent-engines, set-agent-engine, and test-agent-engine
* tools into a single tool with an `action` discriminator.
*/
var tool = {
	description: "Manage AI agent engines: list available engines, set the active engine/model, or test an engine. Pass action=\"list\" to see options, action=\"set\" to change, action=\"test\" to verify connectivity.",
	parameters: {
		type: "object",
		properties: {
			action: {
				type: "string",
				enum: [
					"list",
					"set",
					"test"
				],
				description: "\"list\" — show available engines and current selection. \"set\" — change the active engine/model. \"test\" — send a trivial prompt to verify connectivity."
			},
			engine: {
				type: "string",
				description: "Engine name (e.g. \"anthropic\", \"ai-sdk:openai\", \"ai-sdk:google\"). Required for \"set\", optional for \"test\" (defaults to \"anthropic\")."
			},
			model: {
				type: "string",
				description: "Model ID (e.g. 'gpt-5.5', 'claude-sonnet-4-6'). Optional for \"set\" and \"test\"; defaults to the engine's default model."
			}
		},
		required: ["action"]
	}
};
async function run(args) {
	const { action } = args;
	switch (action) {
		case "list": return run$3();
		case "set": return run$2(args);
		case "test": return run$1(args);
		default: return JSON.stringify({ error: `Unknown action "${action}". Must be one of: list, set, test.` });
	}
}
//#endregion
export { run, tool };
