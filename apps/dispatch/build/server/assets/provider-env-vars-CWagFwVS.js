//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/engine/provider-env-vars.js
/**
* Single source of truth for every built-in LLM provider's env var name and
* UI metadata. Imported by both server and client code — keep it free of
* runtime imports so it stays tree-shakeable into the browser bundle.
*
* Add a new provider here when adding it to builtin.ts; all three UI gates
* (AssistantChat composer, settings env-var list, settings key form) pick
* it up automatically.
*/
var PROVIDER_ENV_META = {
	anthropic: {
		envVar: "ANTHROPIC_API_KEY",
		label: "Anthropic API Key",
		placeholder: "sk-ant-..."
	},
	openai: {
		envVar: "OPENAI_API_KEY",
		label: "OpenAI API Key",
		placeholder: "sk-..."
	},
	google: {
		envVar: "GOOGLE_GENERATIVE_AI_API_KEY",
		label: "Google Gemini API Key",
		placeholder: "AI..."
	},
	openrouter: {
		envVar: "OPENROUTER_API_KEY",
		label: "OpenRouter API Key",
		placeholder: "sk-or-..."
	},
	groq: {
		envVar: "GROQ_API_KEY",
		label: "Groq API Key",
		placeholder: "gsk_..."
	},
	mistral: {
		envVar: "MISTRAL_API_KEY",
		label: "Mistral API Key",
		placeholder: "..."
	},
	cohere: {
		envVar: "COHERE_API_KEY",
		label: "Cohere API Key",
		placeholder: "..."
	}
};
var PROVIDER_TO_ENV = Object.fromEntries(Object.entries(PROVIDER_ENV_META).map(([k, v]) => [k, v.envVar]));
var PROVIDER_ENV_VARS = Object.values(PROVIDER_TO_ENV);
var PROVIDER_ENV_PLACEHOLDERS = Object.fromEntries(Object.values(PROVIDER_ENV_META).map((m) => [m.envVar, m.placeholder]));
//#endregion
export { PROVIDER_TO_ENV as i, PROVIDER_ENV_PLACEHOLDERS as n, PROVIDER_ENV_VARS as r, PROVIDER_ENV_META as t };
