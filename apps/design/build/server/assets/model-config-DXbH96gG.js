//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/shared/reasoning-effort.js
var REASONING_EFFORTS = [
	"auto",
	"none",
	"minimal",
	"low",
	"medium",
	"high",
	"xhigh",
	"max"
];
var REASONING_EFFORT_LABELS = {
	auto: "Auto",
	none: "None",
	minimal: "Minimal",
	low: "Low",
	medium: "Medium",
	high: "High",
	xhigh: "Extra High",
	max: "Max"
};
var VISIBLE_STANDARD_EFFORTS = [
	"auto",
	"low",
	"medium",
	"high"
];
var VISIBLE_GPT_EFFORTS = [...VISIBLE_STANDARD_EFFORTS, "xhigh"];
var VISIBLE_CLAUDE_BUILT_IN_EFFORTS = [
	...VISIBLE_STANDARD_EFFORTS,
	"xhigh",
	"max"
];
var VISIBLE_CLAUDE_EFFORTS = [...VISIBLE_STANDARD_EFFORTS, "max"];
var effortSet = new Set(REASONING_EFFORTS);
function isReasoningEffort(value) {
	return typeof value === "string" && effortSet.has(value);
}
function getReasoningEffortOptionsForModel(model) {
	if (!model) return [];
	if (isGPTReasoningModel(model)) return VISIBLE_GPT_EFFORTS;
	if (isClaudeReasoningModel(model)) return supportsClaudeXHigh(model) ? VISIBLE_CLAUDE_BUILT_IN_EFFORTS : VISIBLE_CLAUDE_EFFORTS;
	if (isGeminiReasoningModel(model)) return VISIBLE_STANDARD_EFFORTS;
	return [];
}
function normalizeReasoningEffortForModel(model, effort) {
	if (!model || !effort || effort === "auto") return;
	let normalized = effort;
	if (normalized === "xhigh" && isClaudeReasoningModel(model) && !supportsClaudeXHigh(model)) normalized = "high";
	if (normalized === "max" && isGPTReasoningModel(model)) normalized = "xhigh";
	const options = getReasoningEffortOptionsForModel(model);
	if (!options.length || !options.includes(normalized)) return;
	return normalized;
}
function reasoningEffortLabel(effort) {
	return REASONING_EFFORT_LABELS[effort ?? "auto"];
}
function isGPTReasoningModel(model) {
	return /^gpt-5/.test(model) || /^o\d/.test(model);
}
function isClaudeReasoningModel(model) {
	return /^claude-/.test(model);
}
function supportsClaudeXHigh(model) {
	return model.includes("opus-4-7");
}
function isGeminiReasoningModel(model) {
	return /^gemini-/.test(model);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/model-config.js
/**
* Central model catalog for built-in agent engines.
*
* To bump the framework's managed default, update
* FRAMEWORK_DEFAULT_OPENAI_MODEL. Builder gateway and OpenRouter IDs are
* derived from that provider-native OpenAI ID so the usual default bump stays
* in this one file.
*/
var ANTHROPIC_DEFAULT_MODEL_ID = "claude-sonnet-4-6";
function builderGatewayModelId(model) {
	return model.replace(/\./g, "-");
}
function openRouterModelId(provider, model) {
	return `${provider}/${model}`;
}
var FRAMEWORK_DEFAULT_OPENAI_MODEL = "gpt-5.5";
var FRAMEWORK_DEFAULT_BUILDER_MODEL = ANTHROPIC_DEFAULT_MODEL_ID;
var FRAMEWORK_DEFAULT_BUILDER_OPENAI_MODEL = builderGatewayModelId(FRAMEWORK_DEFAULT_OPENAI_MODEL);
var FRAMEWORK_DEFAULT_OPENROUTER_MODEL = openRouterModelId("openai", FRAMEWORK_DEFAULT_OPENAI_MODEL);
var AGENT_MODEL_CONFIG = {
	builder: {
		defaultModel: FRAMEWORK_DEFAULT_BUILDER_MODEL,
		supportedModels: [
			"claude-opus-4-7",
			FRAMEWORK_DEFAULT_BUILDER_MODEL,
			"claude-haiku-4-5",
			FRAMEWORK_DEFAULT_BUILDER_OPENAI_MODEL,
			"gpt-5-4",
			"gpt-5-4-mini",
			"gpt-5-1-codex-mini",
			"gemini-3-1-pro",
			"gemini-3-0-flash",
			"gemini-3-1-flash-lite",
			"grok-code-fast",
			"qwen3-coder",
			"kimi-k2-5",
			"deepseek-v3-1",
			"z-ai-glm-4-5",
			"z-ai-glm-5-1"
		]
	},
	anthropic: {
		defaultModel: ANTHROPIC_DEFAULT_MODEL_ID,
		supportedModels: [
			"claude-opus-4-7",
			ANTHROPIC_DEFAULT_MODEL_ID,
			"claude-haiku-4-5-20251001"
		]
	},
	aiSdk: {
		anthropic: {
			defaultModel: ANTHROPIC_DEFAULT_MODEL_ID,
			supportedModels: [
				"claude-opus-4-7",
				ANTHROPIC_DEFAULT_MODEL_ID,
				"claude-haiku-4-5-20251001"
			]
		},
		openai: {
			defaultModel: FRAMEWORK_DEFAULT_OPENAI_MODEL,
			supportedModels: [
				FRAMEWORK_DEFAULT_OPENAI_MODEL,
				"gpt-5.4",
				"gpt-5.4-mini"
			]
		},
		openrouter: {
			defaultModel: FRAMEWORK_DEFAULT_OPENROUTER_MODEL,
			supportedModels: [
				"anthropic/claude-opus-4.7",
				"anthropic/claude-sonnet-4.6",
				FRAMEWORK_DEFAULT_OPENROUTER_MODEL,
				"openai/gpt-5.4",
				"google/gemini-2.5-flash"
			]
		},
		google: {
			defaultModel: "gemini-3-flash-preview",
			supportedModels: ["gemini-3-flash-preview", "gemini-3.1-pro-preview"]
		},
		groq: {
			defaultModel: "llama-3.3-70b-versatile",
			supportedModels: [
				"llama-3.3-70b-versatile",
				"llama-3.1-70b-versatile",
				"mixtral-8x7b-32768"
			]
		},
		mistral: {
			defaultModel: "mistral-large-latest",
			supportedModels: [
				"mistral-large-latest",
				"mistral-medium-latest",
				"mistral-small-latest"
			]
		},
		cohere: {
			defaultModel: "command-r-plus",
			supportedModels: ["command-r-plus", "command-r"]
		},
		ollama: {
			defaultModel: "llama3.1",
			supportedModels: [
				"llama3.1",
				"llama3.2",
				"mistral",
				"codestral"
			]
		}
	}
};
var BUILDER_MODEL_CONFIG = AGENT_MODEL_CONFIG.builder;
var ANTHROPIC_MODEL_CONFIG = AGENT_MODEL_CONFIG.anthropic;
var AI_SDK_MODEL_CONFIG = AGENT_MODEL_CONFIG.aiSdk;
var DEFAULT_MODEL = BUILDER_MODEL_CONFIG.defaultModel;
AI_SDK_MODEL_CONFIG.openai.defaultModel;
var DEFAULT_ANTHROPIC_MODEL = ANTHROPIC_MODEL_CONFIG.defaultModel;
//#endregion
export { DEFAULT_MODEL as a, normalizeReasoningEffortForModel as c, DEFAULT_ANTHROPIC_MODEL as i, reasoningEffortLabel as l, ANTHROPIC_MODEL_CONFIG as n, getReasoningEffortOptionsForModel as o, BUILDER_MODEL_CONFIG as r, isReasoningEffort as s, AI_SDK_MODEL_CONFIG as t };
