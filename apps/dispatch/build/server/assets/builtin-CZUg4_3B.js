import { c as resolveBuilderCredential, o as readDeployCredentialEnv, r as getBuilderGatewayBaseUrl, s as resolveBuilderAuthHeader } from "./credential-provider-F0RQZ9bx.js";
import { c as registerAgentEngine } from "./registry-DlSn3U6q.js";
import { c as normalizeReasoningEffortForModel, n as ANTHROPIC_MODEL_CONFIG, r as BUILDER_MODEL_CONFIG, t as AI_SDK_MODEL_CONFIG } from "./model-config-DXbH96gG.js";
import { n as LLM_MISSING_CREDENTIALS_MESSAGE, t as LLM_MISSING_CREDENTIALS_ERROR_CODE } from "./credential-errors-CadDFEFG.js";
import { t as captureError } from "./capture-error-DCWFpJbk.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/engine/translate-anthropic.js
/**
* Translation helpers between the AgentEngine normalized types and
* @anthropic-ai/sdk's wire types.
*
* AnthropicEngine does very little translation because the framework's
* EngineMessage / EngineTool shapes were modeled on Anthropic's types.
* The main differences are: camelCase vs snake_case, and that
* Anthropic uses `input_schema` while we use `inputSchema`.
*/
function engineToolToAnthropic(tool) {
	return {
		name: tool.name,
		description: tool.description,
		input_schema: tool.inputSchema
	};
}
function engineToolsToAnthropic(tools) {
	return tools.map(engineToolToAnthropic);
}
function engineMessageToAnthropic(msg) {
	return {
		role: msg.role,
		content: msg.content.map(enginePartToAnthropic)
	};
}
function engineMessagesToAnthropic(messages) {
	return messages.map(engineMessageToAnthropic);
}
function enginePartToAnthropic(part) {
	switch (part.type) {
		case "text": return {
			type: "text",
			text: part.text
		};
		case "image": return {
			type: "image",
			source: {
				type: "base64",
				media_type: part.mediaType,
				data: part.data
			}
		};
		case "file":
			if (part.mediaType === "application/pdf") return {
				type: "document",
				source: {
					type: "base64",
					media_type: "application/pdf",
					data: part.data
				},
				...part.filename ? { title: part.filename } : {}
			};
			return {
				type: "text",
				text: `[Attached file: ${part.filename ?? "attachment"} (${part.mediaType})]`
			};
		case "tool-call": return {
			type: "tool_use",
			id: part.id,
			name: part.name,
			input: part.input
		};
		case "tool-result": return {
			type: "tool_result",
			tool_use_id: part.toolCallId,
			content: part.content,
			...part.isError ? { is_error: true } : {}
		};
		case "thinking": return {
			type: "thinking",
			thinking: part.text,
			signature: part.signature ?? ""
		};
	}
}
function anthropicContentToEngine(content) {
	return content.map((block) => {
		if (block.type === "text") return {
			type: "text",
			text: block.text
		};
		if (block.type === "tool_use") return {
			type: "tool-call",
			id: block.id,
			name: block.name,
			input: block.input
		};
		if (block.type === "thinking") {
			const b = block;
			return {
				type: "thinking",
				text: b.thinking ?? "",
				signature: b.signature
			};
		}
		return {
			type: "text",
			text: ""
		};
	}).filter((p) => !(p.type === "text" && p.text === ""));
}
/**
* Translate an Anthropic stream chunk into zero or more EngineEvents.
* Called in a loop as chunks arrive from client.messages.stream().
*/
function anthropicChunkToEngineEvents(chunk) {
	const events = [];
	if (chunk.type === "content_block_delta") {
		if (chunk.delta?.type === "text_delta") events.push({
			type: "text-delta",
			text: chunk.delta.text
		});
		else if (chunk.delta?.type === "thinking_delta") events.push({
			type: "thinking-delta",
			text: chunk.delta.thinking ?? ""
		});
		else if (chunk.delta?.type === "signature_delta") events.push({
			type: "thinking-delta",
			text: "",
			signature: chunk.delta.signature
		});
	}
	return events;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/engine/builder-engine.js
/**
* BuilderEngine — HTTP client for the Builder.io managed LLM gateway.
*
* The gateway accepts an Anthropic-shaped request body and streams events as
* JSONL. This engine translates the framework's EngineStreamOptions into the
* gateway request, parses the streamed events into EngineEvent items, and
* maps gateway error responses (402 quota, 403 disabled, 401 auth, 429
* concurrency) into structured stop events that carry an upgrade URL when
* the chat UI needs to prompt the user to upgrade.
*
* Credentials come from BUILDER_PRIVATE_KEY + BUILDER_PUBLIC_KEY (set via the
* Builder CLI-auth onboarding flow). Base URL is overridable via
* BUILDER_GATEWAY_BASE_URL.
*/
var BUILDER_CAPABILITIES = {
	thinking: true,
	promptCaching: false,
	vision: true,
	computerUse: false,
	parallelToolCalls: true
};
var BUILDER_SUPPORTED_MODELS = BUILDER_MODEL_CONFIG.supportedModels;
var DEFAULT_BUILDER_GATEWAY_TIMEOUT_MS = 55e3;
var MAX_BUILDER_GATEWAY_TIMEOUT_MS = 55e3;
var BUILDER_GATEWAY_NETWORK_ERROR_CODE = "builder_gateway_network_error";
var BUILDER_DEFAULT_MODEL = BUILDER_MODEL_CONFIG.defaultModel;
/**
* Bucket an Anthropic `thinking.budgetTokens` value into the gateway's
* legacy three-level `reasoning_effort` enum.
*
* The thresholds are chosen to align with typical Anthropic extended-thinking
* budgets we see in the wild:
*   • < 2000  → short one-step reasoning ("low")
*   • 2000–8000 → multi-step thinking ("medium")
*   • ≥ 8000  → deep planning / long chains ("high")
*
* 8000 is Anthropic's documented default in our framework (see
* engine/types.ts:195), so callers that don't explicitly set
* `budgetTokens` map to "high" via the default. If the gateway later
* exposes more granular knobs or different thresholds, revisit this map.
*/
function mapReasoningEffort(budgetTokens) {
	if (budgetTokens < 2e3) return "low";
	if (budgetTokens < 8e3) return "medium";
	return "high";
}
/**
* Build the URL the chat UI should link to when a user hits a quota error.
* Deep-links to the connected org's billing page when BUILDER_ORG_NAME is
* known, else falls back to the generic account billing page.
*/
async function buildUpgradeUrl() {
	const orgName = await resolveBuilderCredential("BUILDER_ORG_NAME");
	if (orgName) return `https://builder.io/app/organizations/${encodeURIComponent(orgName)}/billing`;
	return "https://builder.io/account/billing";
}
var BuilderEngine = class {
	name = "builder";
	label = "Builder.io Gateway";
	defaultModel = BUILDER_DEFAULT_MODEL;
	supportedModels = BUILDER_SUPPORTED_MODELS;
	capabilities = BUILDER_CAPABILITIES;
	async *stream(opts) {
		const [authHeader, spaceId, builderUserId] = await Promise.all([
			resolveBuilderAuthHeader(),
			resolveBuilderCredential("BUILDER_PUBLIC_KEY"),
			resolveBuilderCredential("BUILDER_USER_ID")
		]);
		if (!authHeader || !spaceId) {
			yield {
				type: "stop",
				reason: "error",
				error: LLM_MISSING_CREDENTIALS_MESSAGE,
				errorCode: LLM_MISSING_CREDENTIALS_ERROR_CODE
			};
			return;
		}
		const messages = engineMessagesToAnthropic(opts.messages);
		const tools = engineToolsToAnthropic(opts.tools);
		const thinkingBudget = opts.providerOptions?.anthropic?.thinking?.budgetTokens;
		const reasoningEffort = normalizeReasoningEffortForModel(opts.model, opts.reasoningEffort) ?? (typeof thinkingBudget === "number" ? mapReasoningEffort(thinkingBudget) : void 0);
		const body = {
			model: opts.model,
			messages,
			...opts.systemPrompt ? { system: opts.systemPrompt } : {},
			...tools.length > 0 ? { tools } : {},
			...opts.maxOutputTokens !== void 0 ? { max_tokens: opts.maxOutputTokens } : {},
			...reasoningEffort ? { reasoning_effort: reasoningEffort } : {}
		};
		const gatewayBaseUrl = getBuilderGatewayBaseUrl();
		const gatewayUrl = new URL("messages", gatewayBaseUrl.endsWith("/") ? gatewayBaseUrl : `${gatewayBaseUrl}/`);
		gatewayUrl.searchParams.set("apiKey", spaceId);
		const orgLabel = await resolveBuilderCredential("BUILDER_ORG_NAME") || "unknown-org";
		const tStart = Date.now();
		console.log(`[builder-engine] → POST ${gatewayUrl.origin}${gatewayUrl.pathname} model=${opts.model} tools=${tools.length} org=${orgLabel}`);
		const gatewayTimeoutMs = getBuilderGatewayTimeoutMs();
		const gatewayAbort = createGatewayAbortSignal(opts.abortSignal, gatewayTimeoutMs);
		try {
			let response;
			try {
				response = await fetch(gatewayUrl.toString(), {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: authHeader,
						"x-builder-api-key": spaceId,
						...builderUserId ? { "x-builder-user-id": builderUserId } : {}
					},
					body: JSON.stringify(body),
					signal: gatewayAbort.signal
				});
			} catch (err) {
				const timedOut = gatewayAbort.didTimeout();
				if (gatewayAbort.didTimeout()) console.warn(`[builder-engine] gateway timed out after ${Date.now() - tStart}ms`);
				if (timedOut || isBuilderGatewayNetworkError(err)) captureBuilderGatewayTransportError(err, {
					phase: "request",
					model: opts.model,
					gatewayUrl,
					timeoutMs: gatewayTimeoutMs,
					timedOut,
					elapsedMs: Date.now() - tStart
				});
				yield createBuilderGatewayTimeoutStop(err, timedOut, gatewayTimeoutMs);
				return;
			}
			console.log(`[builder-engine] ← ${response.status} ${response.statusText} in ${Date.now() - tStart}ms`);
			if (!response.ok) {
				yield* emitHttpError(response);
				return;
			}
			if ((response.headers.get("content-type") ?? "").includes("text/html")) {
				yield {
					type: "stop",
					reason: "error",
					error: normalizeGatewayErrorText(await response.text().catch(() => ""), response.status || 502),
					errorCode: `http_${response.status || 502}`
				};
				return;
			}
			const reader = response.body?.getReader();
			if (!reader) {
				yield {
					type: "stop",
					reason: "error",
					error: "Builder gateway response has no body"
				};
				return;
			}
			yield* parseJsonlStream(reader, opts.model, {
				didGatewayTimeout: gatewayAbort.didTimeout,
				gatewayTimeoutMs,
				gatewayUrl,
				requestStartedAt: tStart
			});
		} finally {
			gatewayAbort.cleanup();
		}
	}
};
async function* emitHttpError(response) {
	const status = response.status;
	let errBody = {};
	const rawText = await response.text().catch(() => "");
	if (rawText) try {
		errBody = JSON.parse(rawText);
	} catch {
		errBody.message = normalizeGatewayErrorText(rawText, status);
	}
	const code = errBody.code ?? `http_${status}`;
	const message = errBody.message ?? `Builder gateway returned ${status}`;
	if (code.startsWith("credits-limit") || status === 402) {
		yield {
			type: "stop",
			reason: "error",
			error: message,
			errorCode: code,
			upgradeUrl: await buildUpgradeUrl()
		};
		return;
	}
	if (code === "gateway_not_enabled") {
		yield {
			type: "stop",
			reason: "error",
			error: message,
			errorCode: code
		};
		return;
	}
	if (status === 401 || code === "unauthorized") {
		yield {
			type: "stop",
			reason: "error",
			error: "Builder authentication failed. Reconnect Builder via Settings.",
			errorCode: "builder_auth_error"
		};
		return;
	}
	const lowerMessage = message.toLowerCase();
	if (status === 403 && (lowerMessage.includes("unauthorized") || lowerMessage.includes("private key") || lowerMessage.includes("invalid token") || lowerMessage.includes("invalid_token") || lowerMessage.includes("token invalid"))) {
		yield {
			type: "stop",
			reason: "error",
			error: "Builder authentication failed. Reconnect Builder via Settings.",
			errorCode: "builder_auth_error"
		};
		return;
	}
	if (status === 403) {
		yield {
			type: "stop",
			reason: "error",
			error: message,
			errorCode: code
		};
		return;
	}
	if (status === 429 || code === "too_many_concurrent_requests") {
		yield {
			type: "stop",
			reason: "error",
			error: `${message} (too many requests)`,
			errorCode: code
		};
		return;
	}
	yield {
		type: "stop",
		reason: "error",
		error: message,
		errorCode: code
	};
}
async function* readJsonlLines(reader) {
	const decoder = new TextDecoder();
	let buffer = "";
	while (true) {
		const { done, value } = await reader.read();
		if (done) break;
		buffer += decoder.decode(value, { stream: true });
		let newlineIdx = buffer.indexOf("\n");
		while (newlineIdx !== -1) {
			const line = buffer.slice(0, newlineIdx).trim();
			buffer = buffer.slice(newlineIdx + 1);
			newlineIdx = buffer.indexOf("\n");
			if (line) yield line;
		}
	}
	const tail = buffer.trim();
	if (tail) yield tail;
}
async function* parseJsonlStream(reader, model, captureContext = {}) {
	const gatewayTimeoutMs = captureContext.gatewayTimeoutMs ?? DEFAULT_BUILDER_GATEWAY_TIMEOUT_MS;
	const parts = [];
	let pendingText = "";
	let pendingThinking = null;
	const flushPending = () => {
		if (pendingText) {
			parts.push({
				type: "text",
				text: pendingText
			});
			pendingText = "";
		}
		if (pendingThinking) {
			parts.push({
				type: "thinking",
				text: pendingThinking.text,
				...pendingThinking.signature !== void 0 ? { signature: pendingThinking.signature } : {}
			});
			pendingThinking = null;
		}
	};
	try {
		for await (const line of readJsonlLines(reader)) {
			let event;
			try {
				event = JSON.parse(line);
			} catch {
				yield {
					type: "stop",
					reason: "error",
					error: `Builder gateway returned invalid JSONL: ${normalizeGatewayErrorText(line, 502).slice(0, 240)}`,
					errorCode: "http_502"
				};
				return;
			}
			switch (event.type) {
				case "text-delta": {
					const text = event.text ?? "";
					pendingText += text;
					yield {
						type: "text-delta",
						text
					};
					break;
				}
				case "thinking-delta": {
					const text = event.text ?? "";
					if (!pendingThinking) pendingThinking = { text: "" };
					pendingThinking.text += text;
					if (event.signature) pendingThinking.signature = event.signature;
					yield {
						type: "thinking-delta",
						text,
						...event.signature ? { signature: event.signature } : {}
					};
					break;
				}
				case "tool-call-delta":
					yield {
						type: "tool-input-delta",
						id: event.id,
						name: event.name,
						text: typeof event.argsTextDelta === "string" ? event.argsTextDelta : typeof event.delta === "string" ? event.delta : ""
					};
					break;
				case "tool-call":
					flushPending();
					parts.push({
						type: "tool-call",
						id: event.id,
						name: event.name,
						input: event.input
					});
					yield {
						type: "tool-call",
						id: event.id,
						name: event.name,
						input: event.input
					};
					break;
				case "usage": {
					const cacheWrite = (event.cacheCreatedTokens ?? 0) + (event.cacheCreated1hTokens ?? 0);
					yield {
						type: "usage",
						inputTokens: event.inputTokens ?? 0,
						outputTokens: event.outputTokens ?? 0,
						...event.cacheInputTokens !== void 0 ? { cacheReadTokens: event.cacheInputTokens } : {},
						...cacheWrite > 0 ? { cacheWriteTokens: cacheWrite } : {}
					};
					break;
				}
				case "stop": {
					flushPending();
					yield {
						type: "assistant-content",
						parts
					};
					const reason = event.reason ?? "end_turn";
					if (reason === "rate_limited") yield {
						type: "stop",
						reason: "error",
						error: `rate_limit exceeded: ${event.error ?? "upstream provider rate limited"}`,
						errorCode: "rate_limited"
					};
					else if (reason === "error") {
						const explicitErrMsg = event.error || event.message || event.detail;
						const errMsg = explicitErrMsg ?? `Gateway error (no detail; raw event: ${JSON.stringify(event)})`;
						const errCode = event.errorCode ?? event.code ?? (!explicitErrMsg ? "builder_gateway_error" : void 0);
						console.error(`[builder-engine] stop reason=error model=${model} code=${errCode ?? "(none)"} error=${errMsg}`);
						if (!explicitErrMsg) captureBuilderGatewayNoDetailError({
							requestId: typeof event.requestId === "string" ? event.requestId : void 0,
							model,
							gatewayUrl: captureContext.gatewayUrl,
							rawEvent: event
						});
						yield {
							type: "stop",
							reason: "error",
							error: errMsg,
							...errCode ? { errorCode: errCode } : {}
						};
					} else if (reason === "end_turn" || reason === "tool_use" || reason === "max_tokens" || reason === "stop_sequence") yield {
						type: "stop",
						reason
					};
					else yield {
						type: "stop",
						reason: "error",
						error: `Unknown stop reason: ${reason}`
					};
					return;
				}
				default: break;
			}
		}
		flushPending();
		yield {
			type: "assistant-content",
			parts
		};
		yield {
			type: "stop",
			reason: "error",
			error: "Builder gateway stream ended without a stop event"
		};
	} catch (err) {
		const timedOut = captureContext.didGatewayTimeout?.() ?? false;
		if (timedOut || isBuilderGatewayNetworkError(err)) captureBuilderGatewayTransportError(err, {
			phase: "stream",
			model,
			gatewayUrl: captureContext.gatewayUrl,
			timeoutMs: gatewayTimeoutMs,
			timedOut,
			elapsedMs: typeof captureContext.requestStartedAt === "number" ? Date.now() - captureContext.requestStartedAt : void 0
		});
		yield createBuilderGatewayTimeoutStop(err, timedOut, gatewayTimeoutMs);
	} finally {
		try {
			await reader.cancel();
		} catch {}
	}
}
function normalizeGatewayErrorText(raw, status) {
	const text = raw.trim();
	const looksHtml = /<html[\s>]|<body[\s>]|<head[\s>]/i.test(text);
	const readable = looksHtml ? htmlToText(text) : text;
	if (/inactivity timeout/i.test(readable)) return `Builder gateway returned ${status}: Inactivity Timeout. The upstream connection was idle too long before sending data.`;
	if (looksHtml) return `Builder gateway returned ${status}: ${readable.slice(0, 240)}`;
	return readable;
}
function htmlToText(html) {
	return html.replace(/<script[\s\S]*?<\/script>/gi, " ").replace(/<style[\s\S]*?<\/style>/gi, " ").replace(/<br\s*\/?>/gi, "\n").replace(/<\/(p|div|h1|h2|h3|li|tr)>/gi, "\n").replace(/<[^>]+>/g, " ").replace(/&nbsp;/gi, " ").replace(/&lt;/gi, "<").replace(/&gt;/gi, ">").replace(/&amp;/gi, "&").replace(/&quot;/gi, "\"").replace(/&#39;/gi, "'").replace(/[ \t]+/g, " ").replace(/\n\s+/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}
function createBuilderEngine(_config = {}) {
	return new BuilderEngine();
}
function getBuilderGatewayTimeoutMs() {
	const raw = process.env.AGENT_NATIVE_BUILDER_GATEWAY_TIMEOUT_MS;
	if (!raw) return DEFAULT_BUILDER_GATEWAY_TIMEOUT_MS;
	const parsed = Number(raw);
	if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_BUILDER_GATEWAY_TIMEOUT_MS;
	return Math.min(parsed, MAX_BUILDER_GATEWAY_TIMEOUT_MS);
}
function createGatewayAbortSignal(parentSignal, timeoutMs) {
	const controller = new AbortController();
	let timedOut = false;
	const abortFromParent = () => {
		if (!controller.signal.aborted) controller.abort(parentSignal.reason);
	};
	const timeout = setTimeout(() => {
		timedOut = true;
		if (!controller.signal.aborted) controller.abort(/* @__PURE__ */ new Error("Builder gateway request timed out"));
	}, timeoutMs);
	if (parentSignal.aborted) abortFromParent();
	parentSignal.addEventListener("abort", abortFromParent, { once: true });
	return {
		signal: controller.signal,
		didTimeout: () => timedOut,
		cleanup: () => {
			clearTimeout(timeout);
			parentSignal.removeEventListener("abort", abortFromParent);
		}
	};
}
function normalizeBuilderGatewayFetchError(err, timedOut, timeoutMs) {
	if (timedOut) return `Builder gateway timed out after ${formatTimeoutMs(timeoutMs)} before the hosting function limit. Please retry; if this keeps happening, reduce the prompt size or try again when the gateway is less busy.`;
	const message = errorMessage(err);
	if (isBuilderGatewayNetworkError(err)) return `Builder gateway network error: ${message}`;
	return message;
}
function createBuilderGatewayTimeoutStop(err, timedOut, timeoutMs) {
	const networkError = !timedOut && isBuilderGatewayNetworkError(err);
	return {
		type: "stop",
		reason: "error",
		error: normalizeBuilderGatewayFetchError(err, timedOut, timeoutMs),
		...timedOut ? { errorCode: "builder_gateway_timeout" } : networkError ? { errorCode: BUILDER_GATEWAY_NETWORK_ERROR_CODE } : {}
	};
}
function formatTimeoutMs(timeoutMs) {
	if (timeoutMs < 1e3) return `${timeoutMs}ms`;
	return `${Math.round(timeoutMs / 1e3)}s`;
}
function errorMessage(err) {
	if (err instanceof Error) return err.message;
	return String(err);
}
function errorSearchText(err) {
	const parts = [];
	if (err instanceof Error) {
		parts.push(err.name, err.message);
		const maybe = err;
		if (typeof maybe.code === "string") parts.push(maybe.code);
		if (maybe.cause) parts.push(errorSearchText(maybe.cause));
	} else parts.push(String(err));
	return parts.join(" ").toLowerCase();
}
function isBuilderGatewayNetworkError(err) {
	const text = errorSearchText(err);
	return text.includes("socket hang up") || text.includes("econnreset") || text.includes("enetreset") || text.includes("econnaborted") || text.includes("fetch failed") || text.includes("network error") || text.includes("connection reset") || text.includes("connection closed") || text.includes("stream closed") || text.includes("terminated");
}
function captureBuilderGatewayTransportError(err, context) {
	captureError(err, {
		route: "/_agent-native/agent-chat",
		tags: {
			source: "builder-engine",
			phase: context.phase,
			model: context.model,
			timedOut: context.timedOut ? "true" : "false",
			errorCode: context.timedOut ? "builder_gateway_timeout" : BUILDER_GATEWAY_NETWORK_ERROR_CODE
		},
		extra: {
			gatewayOrigin: context.gatewayUrl?.origin,
			gatewayPath: context.gatewayUrl?.pathname,
			timeoutMs: context.timeoutMs,
			elapsedMs: context.elapsedMs
		},
		contexts: { builderGateway: {
			phase: context.phase,
			model: context.model,
			gatewayOrigin: context.gatewayUrl?.origin,
			gatewayPath: context.gatewayUrl?.pathname,
			timeoutMs: context.timeoutMs,
			timedOut: context.timedOut,
			elapsedMs: context.elapsedMs
		} }
	});
}
/**
* Capture a Builder-gateway no-detail stop event to Sentry with the request
* context the run-manager doesn't have. The gateway emits
* `{type:"stop",reason:"error",requestId:"..."}` with no diagnostic — the
* only way to debug it is from the gateway side, so we surface model,
* gatewayOrigin, and requestId as searchable tags.
*/
function captureBuilderGatewayNoDetailError(context) {
	const err = /* @__PURE__ */ new Error(context.requestId ? `Builder gateway stop reason=error with no detail (requestId=${context.requestId})` : "Builder gateway stop reason=error with no detail");
	err.name = "BuilderGatewayNoDetailError";
	captureError(err, {
		route: "/_agent-native/agent-chat",
		tags: {
			source: "builder-engine",
			phase: "stream",
			model: context.model,
			errorCode: "builder_gateway_error",
			...context.requestId ? { gatewayRequestId: context.requestId } : {}
		},
		extra: {
			gatewayOrigin: context.gatewayUrl?.origin,
			gatewayPath: context.gatewayUrl?.pathname,
			rawEvent: context.rawEvent
		},
		contexts: { builderGateway: {
			phase: "stream",
			model: context.model,
			gatewayOrigin: context.gatewayUrl?.origin,
			gatewayPath: context.gatewayUrl?.pathname,
			requestId: context.requestId,
			errorCode: "builder_gateway_error"
		} }
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/engine/anthropic-engine.js
/**
* AnthropicEngine — wraps @anthropic-ai/sdk for use as an AgentEngine.
*
* This is the default, best-in-class engine. It supports all Anthropic-native
* features: extended thinking, prompt caching, vision, computer use, and
* parallel tool calls.
*
* All providerOptions.anthropic fields are forwarded directly to the SDK.
*/
var ANTHROPIC_CAPABILITIES = {
	thinking: true,
	promptCaching: true,
	vision: true,
	computerUse: true,
	parallelToolCalls: true
};
var ANTHROPIC_SUPPORTED_MODELS = ANTHROPIC_MODEL_CONFIG.supportedModels;
var ANTHROPIC_DEFAULT_MODEL = ANTHROPIC_MODEL_CONFIG.defaultModel;
var AnthropicEngine = class {
	name = "anthropic";
	label = "Claude (Anthropic SDK)";
	defaultModel = ANTHROPIC_DEFAULT_MODEL;
	supportedModels = ANTHROPIC_SUPPORTED_MODELS;
	capabilities = ANTHROPIC_CAPABILITIES;
	apiKey;
	constructor(apiKey) {
		this.apiKey = apiKey;
	}
	async *stream(opts) {
		const Anthropic = (await import("./sdk-DoIJZQXA.js")).default;
		const client = new Anthropic({ apiKey: this.apiKey });
		const tools = engineToolsToAnthropic(opts.tools);
		const messages = engineMessagesToAnthropic(opts.messages);
		const anthropicOpts = opts.providerOptions?.anthropic;
		const extra = {};
		if (anthropicOpts?.thinking) extra.thinking = {
			type: anthropicOpts.thinking.type,
			budget_tokens: anthropicOpts.thinking.budgetTokens
		};
		if (anthropicOpts?.topK !== void 0) extra.top_k = anthropicOpts.topK;
		const reasoningEffort = normalizeReasoningEffortForModel(opts.model, opts.reasoningEffort);
		if (reasoningEffort) {
			if (!extra.thinking) extra.thinking = { type: "adaptive" };
			extra.output_config = { effort: reasoningEffort };
		}
		const cacheEnabled = anthropicOpts?.cacheControl !== false;
		const systemBlocks = [{
			type: "text",
			text: opts.systemPrompt
		}];
		if (cacheEnabled) systemBlocks[0].cache_control = { type: "ephemeral" };
		let cachedTools = tools;
		if (cacheEnabled && tools.length > 0) {
			cachedTools = [...tools];
			const last = { ...cachedTools[cachedTools.length - 1] };
			last.cache_control = { type: "ephemeral" };
			cachedTools[cachedTools.length - 1] = last;
		}
		const requestParams = {
			model: opts.model,
			max_tokens: opts.maxOutputTokens ?? 32768,
			system: systemBlocks,
			tools: cachedTools.length > 0 ? cachedTools : void 0,
			messages,
			...opts.temperature !== void 0 ? { temperature: opts.temperature } : {},
			...extra
		};
		if (!requestParams.tools) delete requestParams.tools;
		const apiStream = client.messages.stream(requestParams, { signal: opts.abortSignal });
		let thinkingText = "";
		try {
			for await (const chunk of apiStream) {
				const events = anthropicChunkToEngineEvents(chunk);
				for (const event of events) {
					if (event.type === "thinking-delta") {
						thinkingText += event.text;
						if (event.signature) event.signature;
					}
					yield event;
				}
			}
			const finalMessage = await apiStream.finalMessage();
			const assistantContent = anthropicContentToEngine(finalMessage.content);
			if (finalMessage.usage) yield {
				type: "usage",
				inputTokens: finalMessage.usage.input_tokens ?? 0,
				outputTokens: finalMessage.usage.output_tokens ?? 0,
				cacheReadTokens: finalMessage.usage.cache_read_input_tokens ?? 0,
				cacheWriteTokens: finalMessage.usage.cache_creation_input_tokens ?? 0
			};
			yield {
				type: "assistant-content",
				parts: assistantContent
			};
			const stopReason = finalMessage.stop_reason ?? "end_turn";
			yield {
				type: "stop",
				reason: stopReason === "tool_use" ? "tool_use" : stopReason === "max_tokens" ? "max_tokens" : "end_turn"
			};
		} catch (err) {
			yield {
				type: "stop",
				reason: "error",
				error: err?.message ?? String(err)
			};
			throw err;
		}
	}
};
/**
* Create an AnthropicEngine instance.
* Falls back to the deployment Anthropic key if no key is provided.
*/
function createAnthropicEngine(config = {}) {
	const allowEnvFallback = config.allowEnvFallback !== false;
	const apiKey = config.apiKey ?? (allowEnvFallback ? readDeployCredentialEnv("ANTHROPIC_API_KEY") : "") ?? "";
	if (!apiKey) return {
		name: "anthropic",
		label: "Claude (Anthropic SDK)",
		defaultModel: ANTHROPIC_DEFAULT_MODEL,
		supportedModels: ANTHROPIC_SUPPORTED_MODELS,
		capabilities: ANTHROPIC_CAPABILITIES,
		async *stream() {
			yield {
				type: "stop",
				reason: "error",
				error: LLM_MISSING_CREDENTIALS_MESSAGE,
				errorCode: LLM_MISSING_CREDENTIALS_ERROR_CODE
			};
		}
	};
	return new AnthropicEngine(apiKey);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/engine/translate-ai-sdk.js
/**
* Translation helpers between AgentEngine normalized types and
* Vercel AI SDK (`ai` package, v6+) types.
*
* The framework keeps a provider-neutral content/event model (see ./types.ts).
* These helpers convert in both directions against the v6 `TextStreamPart` and
* `ModelMessage` shapes.
*/
/**
* Convert EngineTool[] into the record shape that AI SDK's `streamText` expects
* under the `tools` option.
*
* Pass the `jsonSchema` helper from the `ai` package when available so the
* schema is wrapped in the SDK's runtime validator; fall back to the raw JSON
* Schema object otherwise (mostly for unit tests that don't import `ai`).
*/
function engineToolsToAISDK(tools, jsonSchema) {
	const result = {};
	for (const tool of tools) {
		const rawSchema = {
			type: "object",
			properties: tool.inputSchema.properties ?? {},
			required: tool.inputSchema.required ?? []
		};
		result[tool.name] = {
			description: tool.description,
			inputSchema: jsonSchema ? jsonSchema(rawSchema) : rawSchema
		};
	}
	return result;
}
/**
* Convert a single EngineMessage into **one or more** AI SDK ModelMessages.
*
* v6 puts tool-results in a dedicated `role: "tool"` message rather than
* embedding them in user content. When an EngineMessage's user content mixes
* text/images with tool-results, we emit the tool-result parts first as a
* `{role: "tool"}` message, followed by the remaining text/image parts as a
* `{role: "user"}` message.
*/
function engineMessageToAISDK(msg) {
	if (msg.role === "user") {
		const userParts = [];
		const toolResultParts = [];
		for (const part of msg.content) if (part.type === "text") userParts.push({
			type: "text",
			text: part.text
		});
		else if (part.type === "image") userParts.push({
			type: "image",
			image: `data:${part.mediaType};base64,${part.data}`,
			mediaType: part.mediaType
		});
		else if (part.type === "file") userParts.push({
			type: "file",
			data: part.data,
			mediaType: part.mediaType,
			filename: part.filename
		});
		else if (part.type === "tool-result") toolResultParts.push({
			type: "tool-result",
			toolCallId: part.toolCallId,
			toolName: part.toolName ?? "",
			output: part.isError ? {
				type: "error-text",
				value: part.content
			} : {
				type: "text",
				value: part.content
			}
		});
		const out = [];
		if (toolResultParts.length > 0) out.push({
			role: "tool",
			content: toolResultParts
		});
		if (userParts.length > 0) out.push({
			role: "user",
			content: userParts.length === 1 && userParts[0].type === "text" ? userParts[0].text : userParts
		});
		return out;
	}
	if (msg.role === "assistant") {
		const content = [];
		for (const part of msg.content) if (part.type === "text") content.push({
			type: "text",
			text: part.text
		});
		else if (part.type === "tool-call") content.push({
			type: "tool-call",
			toolCallId: part.id,
			toolName: part.name,
			input: part.input
		});
		else if (part.type === "thinking") {
			const reasoning = {
				type: "reasoning",
				text: part.text
			};
			if (part.signature) reasoning.providerOptions = { anthropic: { signature: part.signature } };
			content.push(reasoning);
		}
		return [{
			role: "assistant",
			content: content.length === 1 && content[0].type === "text" ? content[0].text : content
		}];
	}
	throw new Error(`unknown EngineMessage role: ${msg.role}`);
}
function engineMessagesToAISDK(messages) {
	return messages.flatMap(engineMessageToAISDK);
}
/**
* Translate a single part from AI SDK's `result.fullStream` into the flat
* sequence of EngineEvent items the framework works with.
*
* v6 emits lifecycle events (`text-start` / `text-delta` / `text-end`,
* `reasoning-start` / `reasoning-delta` / `reasoning-end`, `tool-input-*`).
* We absorb text/reasoning boundaries, forward text/reasoning/tool-input
* deltas, and keep the terminal `tool-call`, `finish-step`, and `finish` parts.
*/
function aiSdkPartToEngineEvents(part) {
	const events = [];
	switch (part?.type) {
		case "text-delta":
			if (part.text) events.push({
				type: "text-delta",
				text: part.text
			});
			break;
		case "text-start":
		case "text-end": break;
		case "reasoning-delta":
			if (part.text) events.push({
				type: "thinking-delta",
				text: part.text
			});
			break;
		case "reasoning-start":
		case "reasoning-end": break;
		case "tool-input-start":
			events.push({
				type: "tool-input-start",
				id: part.id ?? part.toolCallId,
				name: part.toolName
			});
			break;
		case "tool-input-delta":
			events.push({
				type: "tool-input-delta",
				id: part.id ?? part.toolCallId,
				name: part.toolName,
				text: typeof part.delta === "string" ? part.delta : typeof part.text === "string" ? part.text : ""
			});
			break;
		case "tool-input-end": break;
		case "tool-call":
			events.push({
				type: "tool-call",
				id: part.toolCallId,
				name: part.toolName,
				input: part.input ?? {}
			});
			break;
		case "tool-input-error":
		case "tool-error":
			events.push({
				type: "tool-call-error",
				id: part.toolCallId,
				name: part.toolName,
				input: part.input ?? {},
				error: part.errorText ?? (part.error instanceof Error ? part.error.message : typeof part.error === "string" ? part.error : JSON.stringify(part.error ?? "Invalid tool input"))
			});
			break;
		case "tool-result": break;
		case "error": {
			const errMsg = part.error instanceof Error ? part.error.message : typeof part.error === "string" ? part.error : JSON.stringify(part.error);
			events.push({
				type: "stop",
				reason: "error",
				error: errMsg
			});
			break;
		}
		case "finish-step":
			if (part.usage) events.push(usageEventFromLanguageModelUsage(part.usage));
			break;
		case "finish":
			if (part.totalUsage) events.push(usageEventFromLanguageModelUsage(part.totalUsage));
			events.push({
				type: "stop",
				reason: finishReasonToStopReason(part.finishReason)
			});
			break;
		default: break;
	}
	return events;
}
function finishReasonToStopReason(reason) {
	switch (reason) {
		case "tool-calls": return "tool_use";
		case "length": return "max_tokens";
		case "content-filter":
		case "error": return "error";
		default: return "end_turn";
	}
}
function usageEventFromLanguageModelUsage(usage) {
	return {
		type: "usage",
		inputTokens: usage.inputTokens ?? 0,
		outputTokens: usage.outputTokens ?? 0,
		totalTokens: usage.totalTokens,
		cacheReadTokens: usage.inputTokenDetails?.cacheReadTokens ?? usage.cachedInputTokens ?? 0,
		cacheWriteTokens: usage.inputTokenDetails?.cacheWriteTokens ?? 0,
		reasoningTokens: usage.outputTokenDetails?.reasoningTokens ?? usage.reasoningTokens
	};
}
/**
* Reconstruct the assistant message content from an AI SDK v6 `StepResult`.
* `step.content` is the canonical structured form — iterate it.
*/
function aiSdkStepToAssistantContent(step) {
	const parts = [];
	for (const part of step?.content ?? []) if (part.type === "text" && part.text) parts.push({
		type: "text",
		text: part.text
	});
	else if (part.type === "reasoning") {
		const signature = part.providerMetadata?.anthropic?.signature;
		const thinking = {
			type: "thinking",
			text: part.text ?? ""
		};
		if (typeof signature === "string") thinking.signature = signature;
		parts.push(thinking);
	} else if (part.type === "tool-call") parts.push({
		type: "tool-call",
		id: part.toolCallId,
		name: part.toolName,
		input: part.input
	});
	else if (part.type === "tool-input-error" || part.type === "tool-error") parts.push({
		type: "tool-call",
		id: part.toolCallId,
		name: part.toolName,
		input: part.input ?? {}
	});
	return parts;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/engine/ai-sdk-engine.js
/**
* AISDKEngine — wraps the Vercel AI SDK (ai package) for multi-provider support.
*
* Supports Anthropic, OpenAI, Google Gemini, Groq, and any provider with an
* @ai-sdk/* package. Provider is selected via the `provider` config option.
*
* When provider is "anthropic", Anthropic-native features (thinking, cacheControl)
* are forwarded through the AI SDK's providerOptions mechanism — no fidelity loss
* compared to the native AnthropicEngine.
*
* The ai package is an OPTIONAL peer dependency. This engine uses dynamic import()
* so the core package remains installable without the AI SDK.
*/
var PROVIDER_CAPABILITIES = {
	anthropic: {
		thinking: true,
		promptCaching: true,
		vision: true,
		computerUse: false,
		parallelToolCalls: true
	},
	openai: {
		thinking: true,
		promptCaching: false,
		vision: true,
		computerUse: false,
		parallelToolCalls: true
	},
	openrouter: {
		thinking: true,
		promptCaching: true,
		vision: true,
		computerUse: false,
		parallelToolCalls: true
	},
	google: {
		thinking: true,
		promptCaching: false,
		vision: true,
		computerUse: false,
		parallelToolCalls: true
	},
	groq: {
		thinking: false,
		promptCaching: false,
		vision: false,
		computerUse: false,
		parallelToolCalls: true
	},
	mistral: {
		thinking: false,
		promptCaching: false,
		vision: false,
		computerUse: false,
		parallelToolCalls: true
	},
	cohere: {
		thinking: false,
		promptCaching: false,
		vision: false,
		computerUse: false,
		parallelToolCalls: true
	},
	ollama: {
		thinking: false,
		promptCaching: false,
		vision: false,
		computerUse: false,
		parallelToolCalls: false
	}
};
var providerModelEntries = Object.entries(AI_SDK_MODEL_CONFIG);
var PROVIDER_DEFAULT_MODELS = Object.fromEntries(providerModelEntries.map(([provider, config]) => [provider, config.defaultModel]));
var PROVIDER_SUPPORTED_MODELS = Object.fromEntries(providerModelEntries.map(([provider, config]) => [provider, config.supportedModels]));
var PROVIDER_ENV_VARS = {
	anthropic: ["ANTHROPIC_API_KEY"],
	openai: ["OPENAI_API_KEY"],
	openrouter: ["OPENROUTER_API_KEY"],
	google: ["GOOGLE_GENERATIVE_AI_API_KEY"],
	groq: ["GROQ_API_KEY"],
	mistral: ["MISTRAL_API_KEY"],
	cohere: ["COHERE_API_KEY"],
	ollama: []
};
var PROVIDER_PACKAGES = {
	anthropic: "@ai-sdk/anthropic",
	openai: "@ai-sdk/openai",
	openrouter: "@openrouter/ai-sdk-provider",
	google: "@ai-sdk/google",
	groq: "@ai-sdk/groq",
	mistral: "@ai-sdk/mistral",
	cohere: "@ai-sdk/cohere",
	ollama: "ai-sdk-ollama"
};
/** Factory export name per provider (not all follow `create<Provider>`). */
var PROVIDER_FACTORIES = {
	anthropic: "createAnthropic",
	openai: "createOpenAI",
	openrouter: "createOpenRouter",
	google: "createGoogleGenerativeAI",
	groq: "createGroq",
	mistral: "createMistral",
	cohere: "createCohere",
	ollama: "createOllama"
};
function googleThinkingBudget(effort) {
	if (effort === "low") return 1024;
	if (effort === "high") return 8e3;
	if (effort === "xhigh") return 16e3;
	if (effort === "max") return 32e3;
	return -1;
}
var AISDKEngine = class {
	name;
	label;
	defaultModel;
	supportedModels;
	capabilities;
	provider;
	apiKey;
	baseUrl;
	appName;
	appUrl;
	constructor(provider, config) {
		this.provider = provider;
		this.name = `ai-sdk:${provider}`;
		this.label = `${capitalize(provider)} (AI SDK)`;
		this.defaultModel = config.model ?? PROVIDER_DEFAULT_MODELS[provider];
		this.supportedModels = PROVIDER_SUPPORTED_MODELS[provider];
		this.capabilities = PROVIDER_CAPABILITIES[provider];
		this.apiKey = config.apiKey ?? (config.allowEnvFallback === false ? "" : getProviderApiKey(provider));
		this.baseUrl = config.baseUrl;
		this.appName = config.appName;
		this.appUrl = config.appUrl;
	}
	async *stream(opts) {
		let aiModule;
		try {
			aiModule = await import("./core-De7M3tYY.js");
		} catch {
			yield {
				type: "stop",
				reason: "error",
				error: `The "ai" package is not installed. Run: pnpm add ai ${PROVIDER_PACKAGES[this.provider]}`
			};
			return;
		}
		const { streamText, jsonSchema } = aiModule;
		let providerModel;
		try {
			providerModel = await this.createProviderModel(opts.model);
		} catch (err) {
			yield {
				type: "stop",
				reason: "error",
				error: err?.message ?? String(err)
			};
			return;
		}
		const aiSdkTools = opts.tools.length > 0 ? engineToolsToAISDK(opts.tools, jsonSchema) : void 0;
		const messages = engineMessagesToAISDK(opts.messages);
		const providerOpts = {};
		if (this.provider === "anthropic" && opts.providerOptions?.anthropic) {
			const anthropicOpts = opts.providerOptions.anthropic;
			if (anthropicOpts.thinking) providerOpts.anthropic = {
				...providerOpts.anthropic ?? {},
				thinking: {
					type: "enabled",
					budgetTokens: anthropicOpts.thinking.budgetTokens
				}
			};
			if (anthropicOpts.cacheControl) providerOpts.anthropic = {
				...providerOpts.anthropic ?? {},
				cacheControl: anthropicOpts.cacheControl
			};
		}
		const reasoningEffort = normalizeReasoningEffortForModel(opts.model, opts.reasoningEffort);
		if (reasoningEffort) {
			if (this.provider === "anthropic") providerOpts.anthropic = {
				...providerOpts.anthropic ?? {},
				thinking: providerOpts.anthropic?.thinking ?? { type: "adaptive" },
				outputConfig: { effort: reasoningEffort }
			};
			else if (this.provider === "openai") providerOpts.openai = {
				...providerOpts.openai ?? {},
				reasoningEffort
			};
			else if (this.provider === "openrouter") providerOpts.openrouter = {
				...providerOpts.openrouter ?? {},
				reasoning: { effort: reasoningEffort }
			};
			else if (this.provider === "google") providerOpts.google = {
				...providerOpts.google ?? {},
				thinkingConfig: { thinkingBudget: googleThinkingBudget(reasoningEffort) }
			};
		}
		let assistantContent = [];
		try {
			const result = streamText({
				model: providerModel,
				system: opts.systemPrompt,
				messages,
				tools: aiSdkTools,
				maxOutputTokens: opts.maxOutputTokens ?? 32768,
				...opts.temperature !== void 0 ? { temperature: opts.temperature } : {},
				abortSignal: opts.abortSignal,
				onStepFinish: (step) => {
					assistantContent = aiSdkStepToAssistantContent(step);
				},
				...Object.keys(providerOpts).length > 0 ? { providerOptions: providerOpts } : {}
			});
			let bufferedStop;
			for await (const part of result.fullStream) for (const event of aiSdkPartToEngineEvents(part)) if (event.type === "stop") bufferedStop = event;
			else yield event;
			yield {
				type: "assistant-content",
				parts: assistantContent
			};
			yield bufferedStop ?? {
				type: "stop",
				reason: "end_turn"
			};
		} catch (err) {
			yield {
				type: "stop",
				reason: "error",
				error: err?.message ?? String(err)
			};
			throw err;
		}
	}
	async createProviderModel(model) {
		const pkg = PROVIDER_PACKAGES[this.provider];
		let providerModule;
		try {
			providerModule = await importProviderPackage(this.provider);
		} catch {
			throw new Error(`Provider package "${pkg}" is not installed. Run: pnpm add ai ${pkg}`);
		}
		const fnName = PROVIDER_FACTORIES[this.provider];
		const createFn = providerModule[fnName] ?? providerModule.default;
		if (typeof createFn !== "function") throw new Error(`"${pkg}" does not export ${fnName} or default`);
		const config = {};
		if (this.apiKey !== void 0) config.apiKey = this.apiKey;
		if (this.baseUrl) config.baseURL = this.baseUrl;
		if (this.provider === "openrouter") {
			if (this.appName) config.appName = this.appName;
			if (this.appUrl) config.appUrl = this.appUrl;
		}
		const provider = createFn(config);
		return this.provider === "openai" && this.baseUrl ? provider.chat(model) : provider(model);
	}
};
function createAISDKEngine(provider, config = {}) {
	return new AISDKEngine(provider, config);
}
async function importProviderPackage(provider) {
	switch (provider) {
		case "anthropic": return import("./core-zutVfUv7.js");
		case "openai": return import("./core-D2hxRUsY.js");
		case "openrouter": return import("./core-C4QcU5lZ.js");
		case "google": return import("./core-DI3p6AJh.js");
		case "groq": return import("./core-BKNcrEKk.js");
		case "mistral": return import("./core-CKVru_Y0.js");
		case "cohere": return import("./core-nD75GgNq.js");
		case "ollama": return import("./core-BaUanxIo.js");
	}
}
function capitalize(s) {
	return s.charAt(0).toUpperCase() + s.slice(1);
}
function getProviderApiKey(provider) {
	const envVars = PROVIDER_ENV_VARS[provider];
	for (const v of envVars) {
		const value = readDeployCredentialEnv(v);
		if (value) return value;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/engine/builtin.js
/**
* Registers built-in agent engines (anthropic, ai-sdk:*) into the global registry.
*
* This module is imported once at server startup via the agent-chat plugin.
* Additional engines can be registered by calling registerAgentEngine() from
* any server plugin after startup.
*/
var _registered = false;
/**
* Register all built-in engines. Safe to call multiple times (idempotent).
*/
function registerBuiltinEngines() {
	if (_registered) return;
	_registered = true;
	registerAgentEngine({
		name: "builder",
		label: "Builder.io Gateway",
		description: "Managed LLM access via Builder.io — Claude, GPT, Gemini, and more through a single connection.",
		capabilities: BUILDER_CAPABILITIES,
		defaultModel: BUILDER_DEFAULT_MODEL,
		supportedModels: BUILDER_SUPPORTED_MODELS,
		requiredEnvVars: ["BUILDER_PRIVATE_KEY", "BUILDER_PUBLIC_KEY"],
		create: (config) => createBuilderEngine(config)
	});
	registerAgentEngine({
		name: "anthropic",
		label: "Claude",
		description: "Anthropic's SDK — best-in-class Claude models with full feature support (thinking, prompt caching, vision, computer use).",
		capabilities: ANTHROPIC_CAPABILITIES,
		defaultModel: ANTHROPIC_DEFAULT_MODEL,
		supportedModels: ANTHROPIC_SUPPORTED_MODELS,
		requiredEnvVars: ["ANTHROPIC_API_KEY"],
		create: (config) => createAnthropicEngine(config)
	});
	const aiSdkProviders = [
		"anthropic",
		"openai",
		"openrouter",
		"google",
		"groq",
		"mistral",
		"cohere",
		"ollama"
	];
	const providerLabels = {
		anthropic: "Claude",
		openai: "OpenAI",
		openrouter: "OpenRouter",
		google: "Gemini",
		groq: "Groq",
		mistral: "Mistral",
		cohere: "Cohere",
		ollama: "Ollama"
	};
	const providerDescriptions = {
		anthropic: "Claude models through the Vercel AI SDK. Supports thinking and caching via AI SDK providerOptions.",
		openai: "OpenAI GPT models via the Vercel AI SDK. Requires OPENAI_API_KEY.",
		openrouter: "300+ models from Anthropic, OpenAI, Google, Meta, and more routed through a single endpoint. Use model IDs like 'anthropic/claude-sonnet-4.5' or 'openai/gpt-4o'. Requires OPENROUTER_API_KEY.",
		google: "Google Gemini models via the Vercel AI SDK. Requires GOOGLE_GENERATIVE_AI_API_KEY.",
		groq: "Groq LPU inference via the Vercel AI SDK. Requires GROQ_API_KEY.",
		mistral: "Mistral models via the Vercel AI SDK. Requires MISTRAL_API_KEY.",
		cohere: "Cohere Command models via the Vercel AI SDK. Requires COHERE_API_KEY.",
		ollama: "Local Ollama models via the Vercel AI SDK. No API key required."
	};
	for (const provider of aiSdkProviders) registerAgentEngine({
		name: `ai-sdk:${provider}`,
		label: providerLabels[provider],
		description: providerDescriptions[provider],
		installPackage: `ai ${PROVIDER_PACKAGES[provider]}`,
		capabilities: PROVIDER_CAPABILITIES[provider],
		defaultModel: PROVIDER_DEFAULT_MODELS[provider],
		supportedModels: PROVIDER_SUPPORTED_MODELS[provider],
		requiredEnvVars: PROVIDER_ENV_VARS[provider],
		create: (config) => createAISDKEngine(provider, config)
	});
}
//#endregion
export { createAnthropicEngine as n, createBuilderEngine as r, registerBuiltinEngines as t };
