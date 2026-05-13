import { r as PROVIDER_ENV_VARS } from "./provider-env-vars-DITfSWnb.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/agent/engine/credential-errors.js
var LLM_MISSING_CREDENTIALS_ERROR_CODE = "missing_credentials";
var LLM_MISSING_CREDENTIALS_MESSAGE = "No LLM provider is connected. Open this app's Agent settings > LLM, then connect Builder.io or add a provider key.";
var LLM_CREDENTIAL_KEYS = new Set([
	...PROVIDER_ENV_VARS,
	"BUILDER_PRIVATE_KEY",
	"BUILDER_PUBLIC_KEY"
]);
var MISSING_CREDENTIAL_PATTERNS = [
	/\b(?:llm|model provider|ai engine)\b.*\b(?:missing|not set|not configured|required|connected)\b/i,
	/\b(?:missing|not set|not configured|required|connected)\b.*\b(?:llm|model provider|ai engine)\b/i,
	/\b(?:llm|model provider|ai engine)\b.*\b(?:api\s*key|credential|credentials|provider key)\b/i,
	/\b(?:api\s*key|credential|credentials|provider key)\b.*\b(?:llm|model provider|ai engine)\b/i
];
function isLlmCredentialError(error, errorCode) {
	if ((errorCode ?? (typeof error === "object" && error && "errorCode" in error ? String(error.errorCode ?? "") : "")) === "missing_credentials") return true;
	const message = getErrorMessage(error);
	if (!message) return false;
	if ([...LLM_CREDENTIAL_KEYS].some((key) => message.includes(key))) return true;
	return MISSING_CREDENTIAL_PATTERNS.some((pattern) => pattern.test(message));
}
function formatLlmCredentialErrorMessage(options) {
	const agentName = options?.agentName?.trim();
	if (agentName) return `The ${agentName} agent could not finish this request because that app needs an LLM connection. Open ${agentName}'s Agent settings > LLM, then connect Builder.io or add a provider key.`;
	return LLM_MISSING_CREDENTIALS_MESSAGE;
}
function userFacingLlmCredentialError(error, options) {
	return isLlmCredentialError(error) ? formatLlmCredentialErrorMessage(options) : null;
}
function getErrorMessage(error) {
	if (typeof error === "string") return error;
	if (error instanceof Error) return error.message;
	if (typeof error === "object" && error && "message" in error) return String(error.message ?? "");
	return "";
}
//#endregion
export { userFacingLlmCredentialError as a, isLlmCredentialError as i, LLM_MISSING_CREDENTIALS_MESSAGE as n, formatLlmCredentialErrorMessage as r, LLM_MISSING_CREDENTIALS_ERROR_CODE as t };
