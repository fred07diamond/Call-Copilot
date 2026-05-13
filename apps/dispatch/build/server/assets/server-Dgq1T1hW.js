import { b as setResponseStatus, c as getMethod, i as defineEventHandler, u as getRequestHeader, y as setResponseHeader } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-CmxO0LxM.js";
import { r as decodeJwt, u as jwtVerify } from "./webapi-BRtoFKCk.js";
import { i as getH3App } from "./framework-request-handler-UFrmVPec.js";
import { n as signInternalToken, o as withConfiguredAppBasePath, r as verifyInternalToken, t as extractBearerToken } from "./internal-token-BJoZ0BAp.js";
import { a as getTask, c as touchQueuedA2ATaskDispatch, i as getA2ATaskDispatchState, l as updateTask, n as createTask, o as getTaskOwner, r as failStuckA2ATask, s as touchProcessingA2ATask, t as claimA2ATaskForProcessing } from "./task-store-CeqwF1mH.js";
import { t as agentChat } from "./agent-chat-Dn_C8OvU.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/a2a/auth-policy.js
/**
* A2A auth policy helpers shared by discovery, the JSON-RPC gate, and task
* handlers. Serverless providers do not always expose `NODE_ENV=production`
* consistently at runtime, so production-like A2A checks also look at the
* provider flags those platforms set in deployed functions.
*/
function isA2AProductionRuntime() {
	if (process.env.NODE_ENV === "production") return true;
	if (process.env.NETLIFY === "true" && process.env.NETLIFY_LOCAL !== "true") return true;
	if (process.env.AWS_LAMBDA_FUNCTION_NAME && process.env.NETLIFY_LOCAL !== "true") return true;
	if (process.env.CF_PAGES === "1") return true;
	if ("__cf_env" in globalThis) return true;
	if (process.env.VERCEL || process.env.VERCEL_ENV) return true;
	if (process.env.RENDER || process.env.FLY_APP_NAME || process.env.K_SERVICE) return true;
	return false;
}
function hasConfiguredA2ASecret() {
	return !!process.env.A2A_SECRET?.trim();
}
function shouldAdvertiseJwtA2AAuth() {
	return hasConfiguredA2ASecret() || isA2AProductionRuntime();
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/a2a/agent-card.js
function generateAgentCard(config, baseUrl, endpointPath = "/_agent-native/a2a") {
	const endpointUrl = withEndpointPath(withConfiguredAppBasePath(baseUrl), endpointPath);
	const card = {
		name: config.name,
		description: config.description,
		url: endpointUrl,
		version: config.version ?? "1.0.0",
		protocolVersion: "0.3",
		capabilities: {
			streaming: config.streaming ?? false,
			pushNotifications: false,
			stateTransitionHistory: true
		},
		skills: config.skills
	};
	const securitySchemes = {};
	const security = [];
	if (shouldAdvertiseJwtA2AAuth()) {
		securitySchemes.jwtBearer = {
			type: "http",
			scheme: "bearer",
			bearerFormat: "JWT"
		};
		security.push({ jwtBearer: [] });
	}
	if (config.apiKeyEnv) {
		securitySchemes.apiKey = {
			type: "http",
			scheme: "bearer"
		};
		security.push({ apiKey: [] });
	}
	if (security.length > 0) {
		card.securitySchemes = securitySchemes;
		card.security = security;
	}
	return card;
}
function normalizeEndpointPath(value) {
	const normalized = value.trim().split("/").filter(Boolean).join("/");
	return normalized ? `/${normalized}` : "";
}
function withEndpointPath(baseUrl, endpointPath) {
	const path = normalizeEndpointPath(endpointPath);
	const trimmed = baseUrl.replace(/\/$/, "");
	if (!path) return trimmed;
	try {
		const url = new URL(trimmed);
		const pathname = url.pathname.replace(/\/$/, "");
		if (pathname === path || pathname.endsWith(path)) return trimmed;
		url.pathname = `${pathname === "/" ? "" : pathname}${path}`;
		url.search = "";
		url.hash = "";
		return url.toString().replace(/\/$/, "");
	} catch {}
	if (trimmed.endsWith(path)) return trimmed;
	return `${trimmed}${path}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/a2a/handlers.js
var A2A_PROCESS_TASK_PATH = "/_agent-native/a2a/_process-task";
var A2A_QUEUED_DISPATCH_STUCK_AFTER_MS = 1e4;
var A2A_PROCESSING_STUCK_AFTER_MS = 300 * 1e3;
var A2A_PROCESSING_HEARTBEAT_MS = 3e4;
/**
* Resolve the base URL we should fire the A2A processor request to. Mirrors
* the integration-webhook resolveBaseUrl pattern — prefer explicit env vars
* (most reliable on serverless), fall back to inbound request headers.
*/
function resolveSelfBaseUrl(event) {
	const fromEnv = process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL || process.env.BETTER_AUTH_URL;
	if (fromEnv) return withConfiguredAppBasePath(String(fromEnv));
	try {
		const headers = event?.node?.req?.headers ?? event?.headers;
		const get = (name) => {
			if (!headers) return void 0;
			if (typeof headers.get === "function") return headers.get(name) ?? void 0;
			const map = headers;
			return map[name] ?? map[String(name).toLowerCase()];
		};
		return withConfiguredAppBasePath(`${get("x-forwarded-proto") || "http"}://${get("host") || `localhost:${process.env.PORT || 3e3}`}`);
	} catch {
		return withConfiguredAppBasePath(`http://localhost:${process.env.PORT || 3e3}`);
	}
}
/**
* Fire-and-forget POST to the A2A processor route on the same deployment.
* Used when an A2A send is requested in async mode — the processor runs the
* handler in a fresh function execution so it gets its own full timeout.
*/
async function fireProcessTaskDispatch(event, taskId) {
	const url = `${resolveSelfBaseUrl(event)}${A2A_PROCESS_TASK_PATH}`;
	const headers = { "Content-Type": "application/json" };
	try {
		headers["Authorization"] = `Bearer ${signInternalToken(taskId)}`;
	} catch {}
	const dispatchPromise = fetch(url, {
		method: "POST",
		headers,
		body: JSON.stringify({ taskId })
	}).catch((err) => {
		console.error("[a2a] Process-task dispatch fetch failed:", err);
	});
	await Promise.race([dispatchPromise, new Promise((resolve) => setTimeout(resolve, 250))]);
}
/**
* Process a previously-enqueued A2A task. Called by the `_process-task`
* route in `server.ts`, in a fresh function execution. Atomically claims the
* task, reconstructs the caller's request context from the task's metadata,
* runs the handler, and persists the outcome.
*
* Idempotent on duplicate dispatches: the atomic claim returns null if some
* other invocation already picked the task up, in which case we no-op.
*/
async function processA2ATaskFromQueue(taskId, config, event) {
	const claimed = await claimA2ATaskForProcessing(taskId);
	if (!claimed) return;
	const message = claimed.history?.[0];
	if (!message) {
		await updateTask(taskId, {
			state: "failed",
			message: {
				role: "agent",
				parts: [{
					type: "text",
					text: "Task is missing its inbound message"
				}]
			}
		});
		return;
	}
	const processorMeta = (claimed.metadata ?? {}).__a2a_processor ?? {};
	const verifiedEmail = processorMeta.verifiedEmail;
	const orgDomainHint = processorMeta.orgDomainHint;
	const contextId = processorMeta.contextId ?? void 0;
	const callerMetadata = processorMeta.callerMetadata ?? void 0;
	const resolvedOrgId = await resolveVerifiedA2AOrgId(verifiedEmail, orgDomainHint);
	const { runWithRequestContext } = await import("./request-context-Ci6C_Mch.js").then((n) => n.c);
	const heartbeat = setInterval(() => {
		touchProcessingA2ATask(taskId).catch((err) => console.error("[a2a] Failed to heartbeat async task:", err));
	}, A2A_PROCESSING_HEARTBEAT_MS);
	heartbeat.unref?.();
	try {
		await runWithRequestContext({
			userEmail: verifiedEmail,
			orgId: resolvedOrgId
		}, () => runHandlerAndPersist(taskId, message, config, contextId, callerMetadata, event));
	} catch (err) {
		try {
			await updateTask(taskId, {
				state: "failed",
				message: {
					role: "agent",
					parts: [{
						type: "text",
						text: err?.message ?? "Handler crashed"
					}]
				}
			});
		} catch {}
	} finally {
		clearInterval(heartbeat);
	}
}
/**
* Default A2A handler that delegates to agentChat.call().
* Used when no custom handler is provided in A2AConfig.
*/
var defaultHandler = async (message, context) => {
	const text = message.parts.filter((p) => p.type === "text").map((p) => p.text).join("\n");
	if (!text) return { message: {
		role: "agent",
		parts: [{
			type: "text",
			text: "No text content in message"
		}]
	} };
	const baseUrl = process.env.APP_URL || process.env.URL || "";
	const appBaseUrl = baseUrl ? withConfiguredAppBasePath(baseUrl) : "";
	const augmentedText = baseUrl ? `[Cross-app A2A request — the caller is on a different host (${appBaseUrl} is yours, theirs is different). Include the concrete result (URL, ID, value) explicitly in your reply text; the caller can't see your local UI state. Any URL MUST be fully-qualified, never a relative path.]\n\n${text}` : text;
	const result = await agentChat.call(augmentedText);
	const artifacts = [];
	if (result.filesChanged.length > 0) artifacts.push({
		name: "files-changed",
		description: "Files modified by the agent",
		parts: [{
			type: "data",
			data: { files: result.filesChanged }
		}]
	});
	return {
		message: {
			role: "agent",
			parts: [{
				type: "text",
				text: result.response
			}, ...result.warnings?.length ? [{
				type: "text",
				text: `\n\nWarnings:\n${result.warnings.join("\n")}`
			}] : []]
		},
		artifacts: artifacts.length > 0 ? artifacts : void 0
	};
};
function getHandler(config) {
	return config.handler ?? defaultHandler;
}
function jsonRpcError(id, code, message) {
	return {
		jsonrpc: "2.0",
		id,
		error: {
			code,
			message
		}
	};
}
function jsonRpcResult(id, result) {
	return {
		jsonrpc: "2.0",
		id,
		result
	};
}
function makeHandlerContext(taskId, contextId, metadata, event) {
	const artifacts = [];
	return {
		context: {
			taskId,
			contextId,
			metadata,
			event,
			writeArtifact(name, content, mimeType) {
				const artifact = {
					name,
					parts: mimeType ? [{
						type: "file",
						file: {
							name,
							mimeType,
							bytes: Buffer.from(content).toString("base64")
						}
					}] : [{
						type: "text",
						text: content
					}]
				};
				artifacts.push(artifact);
				return name;
			}
		},
		artifacts
	};
}
/**
* Resolve org context from A2A metadata / event context and wrap `fn`
* inside `runWithRequestContext` so downstream actions see the org.
*/
async function withA2ARequestContext(metadata, event, fn) {
	const { runWithRequestContext } = await import("./request-context-Ci6C_Mch.js").then((n) => n.c);
	const verifiedEmail = event?.context?.__a2aVerifiedEmail ?? void 0;
	return runWithRequestContext({
		userEmail: verifiedEmail,
		orgId: await resolveVerifiedA2AOrgId(verifiedEmail, event?.context?.__a2aOrgDomain ?? void 0)
	}, fn);
}
async function resolveVerifiedA2AOrgId(verifiedEmail, verifiedOrgDomain) {
	if (verifiedOrgDomain) try {
		const { resolveOrgByDomain } = await import("./context-CkdaPJE2.js");
		const org = await resolveOrgByDomain(verifiedOrgDomain);
		if (org) return org.orgId;
	} catch {}
	if (verifiedEmail) try {
		const { resolveOrgIdForEmail } = await import("./context-CkdaPJE2.js");
		return await resolveOrgIdForEmail(verifiedEmail) ?? void 0;
	} catch {}
}
/**
* Run the handler against the message and persist the outcome to the task store.
* Used in sync mode (awaited inline) and in async mode (called by the
* `_process-task` processor route in a fresh function execution).
*/
async function runHandlerAndPersist(taskId, message, config, contextId, metadata, event) {
	const { context, artifacts } = makeHandlerContext(taskId, contextId, metadata, event);
	try {
		const result = getHandler(config)(message, context);
		if (result && typeof result === "object" && Symbol.asyncIterator in result) {
			let lastMessage;
			for await (const msg of result) lastMessage = msg;
			await updateTask(taskId, {
				state: "completed",
				message: lastMessage,
				artifacts: artifacts.length > 0 ? artifacts : void 0
			});
			return;
		}
		const handlerResult = await result;
		const allArtifacts = [...artifacts, ...handlerResult.artifacts ?? []];
		await updateTask(taskId, {
			state: "completed",
			message: handlerResult.message,
			artifacts: allArtifacts.length > 0 ? allArtifacts : void 0
		});
	} catch (err) {
		await updateTask(taskId, {
			state: "failed",
			message: {
				role: "agent",
				parts: [{
					type: "text",
					text: err?.message ?? "Handler failed"
				}]
			}
		});
	}
}
async function handleSend(params, config, event) {
	const message = params.message;
	if (!message || !message.role || !Array.isArray(message.parts)) return {
		...jsonRpcError(0, -32602, "Invalid params: message with role and parts required"),
		_id: 0
	};
	const contextId = params.contextId;
	const metadata = params.metadata;
	const ownerEmailForTask = event?.context?.__a2aVerifiedEmail ?? null;
	if (params.async === true || event && event.context?.__a2aForceAsync === true) {
		const hasA2ASecret = hasConfiguredA2ASecret();
		const hasApiKey = !!(config.apiKeyEnv && process.env[config.apiKeyEnv]);
		if (isA2AProductionRuntime() && !hasA2ASecret && !hasApiKey) return {
			...jsonRpcError(0, -32001, "A2A async mode is not available — A2A_SECRET or apiKeyEnv must be configured."),
			_id: 0
		};
		const verifiedEmail = event?.context?.__a2aVerifiedEmail ?? void 0;
		const orgDomainHint = event?.context?.__a2aOrgDomain ?? void 0;
		const task = await createTask(message, contextId, {
			...metadata ?? {},
			__a2a_processor: {
				verifiedEmail,
				orgDomainHint,
				contextId: contextId ?? null,
				callerMetadata: metadata ?? null
			}
		}, ownerEmailForTask);
		const working = await updateTask(task.id, { state: "working" });
		fireProcessTaskDispatch(event, task.id).catch((err) => {
			console.error("[a2a] Failed to dispatch process-task:", err);
		});
		return {
			...jsonRpcResult(0, working ?? task),
			_id: 0
		};
	}
	return withA2ARequestContext(metadata, event, async () => {
		const task = await createTask(message, contextId, void 0, ownerEmailForTask);
		await updateTask(task.id, { state: "working" });
		const ctx = makeHandlerContext(task.id, contextId, metadata, event);
		try {
			const result = getHandler(config)(message, ctx.context);
			if (result && typeof result === "object" && Symbol.asyncIterator in result) {
				let lastMessage;
				for await (const msg of result) lastMessage = msg;
				return {
					...jsonRpcResult(0, await updateTask(task.id, {
						state: "completed",
						message: lastMessage,
						artifacts: ctx.artifacts.length > 0 ? ctx.artifacts : void 0
					})),
					_id: 0
				};
			}
			const handlerResult = await result;
			const allArtifacts = [...ctx.artifacts, ...handlerResult.artifacts ?? []];
			return {
				...jsonRpcResult(0, await updateTask(task.id, {
					state: "completed",
					message: handlerResult.message,
					artifacts: allArtifacts.length > 0 ? allArtifacts : void 0
				})),
				_id: 0
			};
		} catch (err) {
			await updateTask(task.id, {
				state: "failed",
				message: {
					role: "agent",
					parts: [{
						type: "text",
						text: err.message ?? "Handler failed"
					}]
				}
			});
			return {
				...jsonRpcError(0, -32e3, err.message ?? "Handler failed"),
				_id: 0
			};
		}
	});
}
async function handleStream(params, config, res, event) {
	const message = params.message;
	if (!message || !message.role || !Array.isArray(message.parts)) {
		res.write(`data: ${JSON.stringify(jsonRpcError(0, -32602, "Invalid params"))}\n\n`);
		res.end();
		return;
	}
	const contextId = params.contextId;
	const metadata = params.metadata;
	const ownerEmailForTask = event?.context?.__a2aVerifiedEmail ?? null;
	await withA2ARequestContext(metadata, event, async () => {
		const task = await createTask(message, contextId, void 0, ownerEmailForTask);
		await updateTask(task.id, { state: "working" });
		const { context, artifacts } = makeHandlerContext(task.id, contextId, metadata, event);
		try {
			const result = getHandler(config)(message, context);
			if (result && typeof result === "object" && Symbol.asyncIterator in result) for await (const msg of result) {
				const intermediate = await updateTask(task.id, {
					state: "working",
					message: msg
				});
				res.write(`data: ${JSON.stringify(jsonRpcResult(0, intermediate))}\n\n`);
			}
			else {
				const handlerResult = await result;
				const allArtifacts = [...artifacts, ...handlerResult.artifacts ?? []];
				const updated = await updateTask(task.id, {
					state: "completed",
					message: handlerResult.message,
					artifacts: allArtifacts.length > 0 ? allArtifacts : void 0
				});
				res.write(`data: ${JSON.stringify(jsonRpcResult(0, updated))}\n\n`);
				res.end();
				return;
			}
			const allArtifacts = [...artifacts];
			const final = await updateTask(task.id, {
				state: "completed",
				artifacts: allArtifacts.length > 0 ? allArtifacts : void 0
			});
			res.write(`data: ${JSON.stringify(jsonRpcResult(0, final))}\n\n`);
		} catch (err) {
			await updateTask(task.id, { state: "failed" });
			res.write(`data: ${JSON.stringify(jsonRpcError(0, -32e3, err.message ?? "Handler failed"))}\n\n`);
		}
		res.end();
	});
}
/**
* Caller-supplied metadata keys that may contain sensitive bearer / OAuth
* material. Always stripped from `tasks/get` responses so a leaked task id
* never discloses an OAuth token even when the original sender carelessly
* stuffed one into `metadata` (see `production-agent.ts:1144-1156` for the
* historical googleToken propagation pattern).
*/
var SENSITIVE_METADATA_KEYS = new Set([
	"googleToken",
	"userEmail",
	"orgDomain",
	"accessToken",
	"refreshToken",
	"apiKey",
	"Authorization",
	"authorization",
	"bearer"
]);
function sanitizeTaskForResponse(task) {
	if (!task || typeof task !== "object") return task;
	if (!task.metadata || typeof task.metadata !== "object") return task;
	const meta = task.metadata;
	const publicMeta = {};
	for (const [k, v] of Object.entries(meta)) {
		if (k === "__a2a_processor") continue;
		if (SENSITIVE_METADATA_KEYS.has(k)) continue;
		publicMeta[k] = v;
	}
	return {
		...task,
		metadata: publicMeta
	};
}
/**
* Reject access when the task has a recorded owner that doesn't match the
* verified caller. Returns a 404-shaped JSON-RPC error to avoid disclosing
* task existence to the wrong caller (enumeration via UUID lookup).
*
* - When the task has no recorded owner (legacy row from before the
*   owner_email migration) we allow access if some verifiable bearer token
*   was presented; otherwise we still reject so an unsigned caller can never
*   read or cancel arbitrary task ids.
* - When neither A2A_SECRET nor apiKeyEnv is configured AND we're in
*   production, we refuse `tasks/get` and `tasks/cancel` outright — there's
*   no way to authenticate the caller, so the only safe response is "not
*   found".
*/
function authorizeTaskAccess(taskOwnerEmail, event, config) {
	const verifiedEmail = event?.context?.__a2aVerifiedEmail ?? null;
	const hasA2ASecret = hasConfiguredA2ASecret();
	const hasApiKey = !!(config.apiKeyEnv && process.env[config.apiKeyEnv]);
	if (isA2AProductionRuntime() && !hasA2ASecret && !hasApiKey) return jsonRpcError(0, -32001, "Task not found");
	if (taskOwnerEmail) {
		if (!verifiedEmail) return jsonRpcError(0, -32001, "Task not found");
		if (verifiedEmail.toLowerCase() !== taskOwnerEmail.toLowerCase()) return jsonRpcError(0, -32001, "Task not found");
	}
	return null;
}
async function handleGet(params, event, config) {
	const id = params.id;
	if (!id) return jsonRpcError(0, -32602, "Invalid params: id required");
	const denied = authorizeTaskAccess(await getTaskOwner(id), event, config);
	if (denied) return denied;
	const task = await getTask(id);
	if (!task) return jsonRpcError(0, -32001, "Task not found");
	if (await refireStuckAsyncTaskIfNeeded(id, event).catch((err) => {
		console.error("[a2a] Failed to refire stuck async task:", err);
		return false;
	})) {
		const updated = await getTask(id);
		if (updated) return jsonRpcResult(0, sanitizeTaskForResponse(updated));
	}
	return jsonRpcResult(0, sanitizeTaskForResponse(task));
}
async function refireStuckAsyncTaskIfNeeded(taskId, event) {
	const state = await getA2ATaskDispatchState(taskId);
	if (!state) return false;
	if (!state.metadata?.__a2a_processor) return false;
	const now = Date.now();
	if ((state.statusState === "submitted" || state.statusState === "working") && state.updatedAt <= now - A2A_QUEUED_DISPATCH_STUCK_AFTER_MS) {
		if (await touchQueuedA2ATaskDispatch(taskId)) {
			await fireProcessTaskDispatch(event, taskId);
			return true;
		}
		return false;
	}
	if (state.statusState === "processing" && state.updatedAt <= now - A2A_PROCESSING_STUCK_AFTER_MS) return await failStuckA2ATask(taskId, now - A2A_PROCESSING_STUCK_AFTER_MS, "The async A2A processor timed out before completing. Please retry the request.");
	return false;
}
async function handleCancel(params, event, config) {
	const id = params.id;
	if (!id) return jsonRpcError(0, -32602, "Invalid params: id required");
	const denied = authorizeTaskAccess(await getTaskOwner(id), event, config);
	if (denied) return denied;
	const task = await updateTask(id, { state: "canceled" });
	if (!task) return jsonRpcError(0, -32001, "Task not found");
	return jsonRpcResult(0, sanitizeTaskForResponse(task));
}
/**
* H3-compatible JSON-RPC handler. Returns JSON directly (H3 serializes it).
* Streaming is handled via H3's node response when needed.
*/
async function handleJsonRpcH3(body, event, config) {
	if (!body || body.jsonrpc !== "2.0" || !body.method) {
		setResponseStatus(event, 400);
		return jsonRpcError(body?.id ?? null, -32600, "Invalid JSON-RPC request");
	}
	const params = body.params ?? {};
	const id = body.id;
	switch (body.method) {
		case "message/send": {
			const { _id, ...response } = await handleSend(params, config, event);
			return {
				...response,
				id
			};
		}
		case "message/stream": {
			if (!config.streaming) return jsonRpcError(id, -32601, "Streaming not supported");
			const res = event.node?.res;
			if (!res) return jsonRpcError(id, -32e3, "Streaming not available");
			setResponseHeader(event, "Content-Type", "text/event-stream");
			setResponseHeader(event, "Cache-Control", "no-cache");
			setResponseHeader(event, "Connection", "keep-alive");
			await handleStream(params, config, res, event);
			return;
		}
		case "tasks/get": return {
			...await handleGet(params, event, config),
			id
		};
		case "tasks/cancel": return {
			...await handleCancel(params, event, config),
			id
		};
		default: return jsonRpcError(id, -32601, `Method not found: ${body.method}`);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/a2a/server.js
/**
* One-time warning when A2A is running unauthenticated in development. We
* don't refuse the request (local templates need to work out of the box),
* but we log a single noisy line so operators notice if they accidentally
* deploy with no auth configured.
*/
var _warnedUnauthA2A = false;
function warnA2AUnauthOnce() {
	if (_warnedUnauthA2A) return;
	_warnedUnauthA2A = true;
	console.warn("[a2a] No A2A_SECRET or apiKeyEnv configured — A2A endpoint runs unauthenticated. This is allowed in development but blocked in production. Set A2A_SECRET before deploying.");
}
function addSecretCandidate(candidates, secret) {
	const trimmed = secret?.trim();
	if (!trimmed || candidates.includes(trimmed)) return;
	candidates.push(trimmed);
}
/**
* Resolve the audience (`aud`) value to expect in an inbound JWT. We use the
* receiver's app URL — it's the natural identifier of "who this token was
* minted for". Falls back to undefined when no app URL is configured, in
* which case the audience check is skipped (backward-compat with tokens
* minted before the audience claim shipped).
*/
function expectedJwtAudience(event) {
	const fromEnv = process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL || process.env.BETTER_AUTH_URL;
	if (fromEnv) return String(fromEnv);
	try {
		const proto = getRequestHeader(event, "x-forwarded-proto") || "https";
		const host = getRequestHeader(event, "host");
		if (host) return `${proto}://${host}`;
	} catch {}
}
async function verifyA2AToken(token, event) {
	let orgDomainHint;
	let unverifiedPayload;
	try {
		unverifiedPayload = decodeJwt(token);
		orgDomainHint = unverifiedPayload.org_domain;
	} catch {}
	const candidateSecrets = [];
	addSecretCandidate(candidateSecrets, process.env.A2A_SECRET);
	if (orgDomainHint) try {
		const { getA2ASecretByDomain } = await import("./context-CkdaPJE2.js");
		addSecretCandidate(candidateSecrets, await getA2ASecretByDomain(orgDomainHint));
	} catch {}
	if (candidateSecrets.length === 0) return {
		email: null,
		orgDomain: null
	};
	try {
		const verifyOptions = {};
		if (unverifiedPayload && typeof unverifiedPayload.aud !== "undefined") {
			const aud = expectedJwtAudience(event);
			if (aud) verifyOptions.audience = aud;
		}
		if (unverifiedPayload && typeof unverifiedPayload.iss === "string" && unverifiedPayload.iss.length > 0) verifyOptions.issuer = unverifiedPayload.iss;
		for (const secret of candidateSecrets) try {
			const { payload } = await jwtVerify(token, new TextEncoder().encode(secret), verifyOptions);
			return {
				email: payload.sub ?? null,
				orgDomain: payload.org_domain ?? null
			};
		} catch {}
	} catch {}
	return {
		email: null,
		orgDomain: null
	};
}
/**
* Mount A2A protocol endpoints on an H3/Nitro app.
*
* - GET /.well-known/agent-card.json — public agent card (no auth)
* - POST /_agent-native/a2a — JSON-RPC endpoint (with optional auth)
*
* When A2A_SECRET is set, inbound Bearer tokens are verified as JWTs
* and the caller's email is extracted from the `sub` claim. This provides
* cryptographic identity verification for cross-app A2A calls.
*/
function mountA2A(nitroApp, config, routePrefix = "/_agent-native") {
	getH3App(nitroApp).use("/.well-known/agent-card.json", defineEventHandler((event) => {
		if (getMethod(event) !== "GET") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const baseUrl = `${getRequestHeader(event, "x-forwarded-proto") || (event.url?.protocol?.replace(":", "") ?? "http")}://${getRequestHeader(event, "host") ?? "localhost"}`;
		const filteredSkills = (config.skills ?? []).filter((skill) => {
			const id = skill.id ?? skill.name ?? "";
			if (typeof id !== "string") return true;
			return !id.startsWith("mcp__user_") && !id.startsWith("mcp__org_");
		});
		return generateAgentCard({
			...config,
			skills: filteredSkills
		}, baseUrl, `${routePrefix}/a2a`);
	}));
	getH3App(nitroApp).use(`${routePrefix}/a2a/_process-task`, defineEventHandler(async (event) => {
		if (getMethod(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const body = await readBody(event);
		const taskId = body && typeof body.taskId === "string" ? body.taskId : "";
		if (!taskId) {
			setResponseStatus(event, 400);
			return { error: "taskId required" };
		}
		if (hasConfiguredA2ASecret()) {
			if (!verifyInternalToken(taskId, extractBearerToken(getRequestHeader(event, "authorization")))) {
				setResponseStatus(event, 401);
				return { error: "Invalid or expired processor token" };
			}
		} else if (isA2AProductionRuntime()) {
			setResponseStatus(event, 503);
			return { error: "A2A processor not configured — set A2A_SECRET on this deployment to enable async A2A." };
		} else warnA2AUnauthOnce();
		try {
			await processA2ATaskFromQueue(taskId, config, event);
			return { ok: true };
		} catch (err) {
			console.error("[a2a] process-task failed:", err);
			setResponseStatus(event, 500);
			return { error: err?.message ?? "process-task failed" };
		}
	}));
	getH3App(nitroApp).use(`${routePrefix}/a2a`, defineEventHandler(async (event) => {
		if (getMethod(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		if ((event.path || "/").split("?")[0].replace(/^\//, "").startsWith("_process-task")) return;
		const bearerToken = extractBearerToken(getRequestHeader(event, "authorization"));
		let verifiedCallerEmail = null;
		let verifiedOrgDomain = null;
		let legacyApiKeyAuthenticated = false;
		let bearerTokenRejectedByJwt = false;
		const hasA2ASecret = hasConfiguredA2ASecret();
		const hasApiKey = !!(config.apiKeyEnv && process.env[config.apiKeyEnv]);
		if (bearerToken) {
			const tokenPayload = await verifyA2AToken(bearerToken, event);
			verifiedCallerEmail = tokenPayload.email;
			verifiedOrgDomain = tokenPayload.orgDomain;
			bearerTokenRejectedByJwt = !verifiedCallerEmail;
		}
		if (!verifiedCallerEmail && config.apiKeyEnv) {
			const expectedKey = process.env[config.apiKeyEnv];
			if (expectedKey) {
				if (!bearerToken) {
					setResponseStatus(event, 401);
					return {
						jsonrpc: "2.0",
						id: null,
						error: {
							code: -32001,
							message: "Authentication required"
						}
					};
				}
				if (bearerToken !== expectedKey) {
					setResponseStatus(event, 401);
					return {
						jsonrpc: "2.0",
						id: null,
						error: {
							code: -32001,
							message: "Invalid API key"
						}
					};
				}
				legacyApiKeyAuthenticated = true;
			}
		}
		if (!verifiedCallerEmail && !legacyApiKeyAuthenticated) {
			if (bearerTokenRejectedByJwt) {
				setResponseStatus(event, 401);
				return {
					jsonrpc: "2.0",
					id: null,
					error: {
						code: -32001,
						message: "Invalid or expired A2A token"
					}
				};
			}
			if (!hasA2ASecret && !hasApiKey) {
				if (isA2AProductionRuntime()) {
					setResponseStatus(event, 503);
					return {
						jsonrpc: "2.0",
						id: null,
						error: {
							code: -32001,
							message: "A2A authentication not configured. Set A2A_SECRET (preferred) or configure apiKeyEnv to accept inbound A2A traffic."
						}
					};
				}
				warnA2AUnauthOnce();
			} else if (isA2AProductionRuntime()) {
				setResponseStatus(event, 401);
				return {
					jsonrpc: "2.0",
					id: null,
					error: {
						code: -32001,
						message: "Authentication required"
					}
				};
			}
		}
		if (verifiedCallerEmail) event.context.__a2aVerifiedEmail = verifiedCallerEmail;
		if (verifiedOrgDomain) event.context.__a2aOrgDomain = verifiedOrgDomain;
		return handleJsonRpcH3(await readBody(event), event, config);
	}));
}
//#endregion
export { mountA2A };
