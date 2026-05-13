import { b as setResponseStatus, c as getMethod, h as readMultipartFormData, i as defineEventHandler, l as getQuery, m as readBody, n as createError, p as getRouterParam, r as createEventStream, s as getHeader, u as getRequestHeader, y as setResponseHeader } from "./node-DxyfkX8_.js";
import { t as readBody$1 } from "./h3-helpers-CmxO0LxM.js";
import { C as track, E as readCorsAllowedOrigins, S as registerTrackingProvider, T as getAllowedCorsOrigin, a as isDevEnvironment, m as getOrigin, r as getSession } from "./auth-CvO2kpTD.js";
import { c as isLocalDatabase } from "./client-BnpqLOqs.js";
import { a as putSetting, r as getSetting, t as deleteSetting } from "./store-BMQUS1KJ.js";
import { n as getUserSetting, r as putUserSetting, t as deleteUserSetting } from "./user-settings-DJMyxAPN.js";
import { n as listOAuthAccountsByOwner } from "./store-B9nTwver.js";
import { l as runWithRequestContext } from "./request-context-Ci6C_Mch.js";
import { i as getBuilderProxyOrigin, m as resolveSecret, p as resolveHasBuilderPrivateKey, s as resolveBuilderAuthHeader, t as canUseDeployCredentialFallbackForRequest, u as resolveBuilderCredentials } from "./credential-provider-F0RQZ9bx.js";
import { a as isAgentEngineSettingConfigured, n as detectEngineFromUserSecrets, o as isStoredEngineUsableForRequest, r as getAgentEngineEntry, t as detectEngineFromEnv } from "./registry-DlSn3U6q.js";
import { r as createBuilderEngine, t as registerBuiltinEngines } from "./builtin-CZUg4_3B.js";
import { t as PROVIDER_ENV_META } from "./provider-env-vars-CWagFwVS.js";
import { i as isLlmCredentialError, r as formatLlmCredentialErrorMessage } from "./credential-errors-CadDFEFG.js";
import { a as appStatePut, i as appStateList, n as appStateDeleteByPrefix, r as appStateGet, t as appStateDelete } from "./store-IJ4u-2_H.js";
import { a as readAppSecret, i as listAppSecretsForScope, n as getAppSecretMeta, s as writeAppSecret, t as deleteAppSecret } from "./storage-DLlUi77Z.js";
import { a as resetAgentLoopSettings, i as readAgentLoopSettings, o as validateMaxIterationsInput, s as writeAgentLoopSettings, t as canUpdateAgentLoopSettings } from "./loop-settings-DPFSndVN.js";
import { n as findWorkspaceRoot } from "./utils-Dd6V9pzd.js";
import { a as getPollEmitter, n as canSeeChangeForUser, r as createPollHandler, t as POLL_CHANGE_EVENT } from "./poll-dJyKUlJH.js";
import { a as markDefaultPluginProvided, i as getH3App, n as awaitBootstrap } from "./framework-request-handler-UFrmVPec.js";
import { r as getOrgContext } from "./context-DeNWRFE0.js";
import { _ as resolveSafePreviewUrl, a as appendBuilderConnectToken, b as verifyBuilderConnectToken, c as createBuilderBrowserCallbackPage, g as resolveBuilderBranchProjectId, n as BUILDER_CONNECT_PARAM, o as buildBuilderCliAuthUrl, p as getBuilderBrowserStatusForEvent, r as BUILDER_ENV_KEYS, s as createBuilderBrowserCallbackErrorPage, v as runBuilderAgent } from "./builder-browser-D8LMt4Ed.js";
import { n as signInternalToken, o as withConfiguredAppBasePath } from "./internal-token-BJoZ0BAp.js";
import { t as listOnboardingSteps } from "./registry-D0-2_VH2.js";
import { a as listNotifications, i as deleteNotification, n as registerNotificationChannel, o as markAllNotificationsRead, r as countUnread, s as markNotificationRead } from "./registry-BO4C25mh.js";
import { n as resolveKeyReferences, r as validateUrlAllowlist, t as getKeyAllowlist } from "./substitution-Bjzwit72.js";
import { i as listRuns, n as getRun, t as deleteRun } from "./store-BaLajFhx.js";
import { a as signA2AToken, t as A2AClient } from "./client-1j91N6-z.js";
import { a as failA2AContinuation, i as completeA2AContinuation, n as claimA2AContinuationDelivery, o as getA2AContinuation, r as claimDueA2AContinuations, t as claimA2AContinuation, u as rescheduleA2AContinuation } from "./a2a-continuations-store-Bn7W19XH.js";
import path from "path";
import path$1 from "node:path";
import { readFile } from "node:fs/promises";
typeof window !== "undefined" && window.postMessage;
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/tracking/providers.js
/**
* Built-in tracking providers that auto-register from env vars.
*
* No SDK dependencies — uses raw HTTP to keep core lightweight.
* Set the env var and tracking starts automatically.
*
* POSTHOG_API_KEY + POSTHOG_HOST  → PostHog
* MIXPANEL_TOKEN                  → Mixpanel
* AMPLITUDE_API_KEY               → Amplitude
* AGENT_NATIVE_ANALYTICS_PUBLIC_KEY → Agent Native Analytics
*
* Call `registerBuiltinProviders()` at server startup (done
* automatically by the core-routes plugin).
*/
var POSTHOG_DEFAULT_HOST = "https://us.i.posthog.com";
var AGENT_NATIVE_ANALYTICS_DEFAULT_ENDPOINT = "https://analytics.agent-native.com/track";
var BATCH_INTERVAL_MS = 1e4;
var MAX_BATCH_SIZE = 50;
var QUEUE_KEY = Symbol.for("@agent-native/core/tracking.queue");
var TIMER_KEY = Symbol.for("@agent-native/core/tracking.timer");
function getQueue() {
	const g = globalThis;
	if (!g[QUEUE_KEY]) g[QUEUE_KEY] = [];
	return g[QUEUE_KEY];
}
function getTimer() {
	return globalThis[TIMER_KEY] ?? null;
}
function setTimer(t) {
	globalThis[TIMER_KEY] = t;
}
function enqueue(url, body, headers) {
	const queue = getQueue();
	queue.push({
		url,
		body,
		headers
	});
	if (queue.length >= MAX_BATCH_SIZE) drainQueue();
	else if (!getTimer()) setTimer(setTimeout(drainQueue, BATCH_INTERVAL_MS));
}
function drainQueue() {
	const t = getTimer();
	if (t) {
		clearTimeout(t);
		setTimer(null);
	}
	const queue = getQueue();
	const batch = queue.splice(0, queue.length);
	for (const item of batch) fetch(item.url, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			...item.headers
		},
		body: item.body
	}).catch(() => {});
}
function isLocalhostUrl(value) {
	if (!value || !value.trim()) return false;
	const raw = value.trim();
	const withProtocol = /^[a-z][a-z0-9+.-]*:\/\//i.test(raw) ? raw : `https://${raw}`;
	try {
		const { hostname } = new URL(withProtocol);
		const h = hostname.toLowerCase();
		return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]" || h.endsWith(".localhost") || h.endsWith(".local");
	} catch {
		return false;
	}
}
function shouldSkipAgentNativeAnalyticsForLocalhost() {
	if (process.env.AGENT_NATIVE_ANALYTICS_ALLOW_LOCALHOST === "true") return false;
	if (process.env.NODE_ENV === "development") return true;
	return [
		process.env.APP_URL,
		process.env.BETTER_AUTH_URL,
		process.env.URL,
		process.env.DEPLOY_URL,
		process.env.VERCEL_PROJECT_PRODUCTION_URL,
		process.env.VERCEL_URL
	].some(isLocalhostUrl);
}
function createPostHogProvider(apiKey, host) {
	return {
		name: "posthog",
		track(event) {
			enqueue(`${host}/capture/`, JSON.stringify({
				api_key: apiKey,
				event: event.name,
				distinct_id: event.userId || "anonymous",
				properties: {
					...event.properties,
					timestamp: event.timestamp
				}
			}));
		},
		identify(userId, traits) {
			enqueue(`${host}/capture/`, JSON.stringify({
				api_key: apiKey,
				event: "$identify",
				distinct_id: userId,
				properties: { $set: traits }
			}));
		},
		flush: () => {
			drainQueue();
			return Promise.resolve();
		}
	};
}
function createMixpanelProvider(token) {
	return {
		name: "mixpanel",
		track(event) {
			const data = {
				event: event.name,
				properties: {
					token,
					distinct_id: event.userId || "anonymous",
					time: event.timestamp ? new Date(event.timestamp).getTime() / 1e3 : void 0,
					...event.properties
				}
			};
			enqueue("https://api.mixpanel.com/track", JSON.stringify([data]));
		},
		identify(userId, traits) {
			enqueue("https://api.mixpanel.com/engage", JSON.stringify([{
				$token: token,
				$distinct_id: userId,
				$set: traits
			}]));
		},
		flush: () => {
			drainQueue();
			return Promise.resolve();
		}
	};
}
function createAmplitudeProvider(apiKey) {
	return {
		name: "amplitude",
		track(event) {
			const data = {
				api_key: apiKey,
				events: [{
					event_type: event.name,
					user_id: event.userId || "anonymous",
					event_properties: event.properties,
					time: event.timestamp ? new Date(event.timestamp).getTime() : void 0
				}]
			};
			enqueue("https://api2.amplitude.com/2/httpapi", JSON.stringify(data));
		},
		identify(userId, traits) {
			enqueue("https://api2.amplitude.com/2/httpapi", JSON.stringify({
				api_key: apiKey,
				events: [{
					event_type: "$identify",
					user_id: userId,
					user_properties: { $set: traits }
				}]
			}));
		},
		flush: () => {
			drainQueue();
			return Promise.resolve();
		}
	};
}
function createWebhookProvider(url, authHeader) {
	const extra = authHeader ? { Authorization: authHeader } : void 0;
	return {
		name: "webhook",
		track(event) {
			enqueue(url, JSON.stringify({
				event: event.name,
				properties: event.properties,
				userId: event.userId,
				timestamp: event.timestamp
			}), extra);
		},
		identify(userId, traits) {
			enqueue(url, JSON.stringify({
				event: "$identify",
				userId,
				traits,
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}), extra);
		},
		flush: () => {
			drainQueue();
			return Promise.resolve();
		}
	};
}
function createAgentNativeAnalyticsProvider(publicKey, endpoint) {
	return {
		name: "agent-native-analytics",
		track(event) {
			enqueue(endpoint, JSON.stringify({
				publicKey,
				event: event.name,
				properties: event.properties ?? {},
				userId: event.userId,
				timestamp: event.timestamp
			}));
		},
		identify(userId, traits) {
			enqueue(endpoint, JSON.stringify({
				publicKey,
				event: "$identify",
				userId,
				properties: traits ?? {},
				timestamp: (/* @__PURE__ */ new Date()).toISOString()
			}));
		},
		flush: () => {
			drainQueue();
			return Promise.resolve();
		}
	};
}
var _registered$1 = false;
function registerBuiltinProviders() {
	if (_registered$1) return;
	_registered$1 = true;
	const posthogKey = process.env.POSTHOG_API_KEY;
	if (posthogKey) registerTrackingProvider(createPostHogProvider(posthogKey, (process.env.POSTHOG_HOST || POSTHOG_DEFAULT_HOST).replace(/\/+$/, "")));
	const mixpanelToken = process.env.MIXPANEL_TOKEN;
	if (mixpanelToken) registerTrackingProvider(createMixpanelProvider(mixpanelToken));
	const amplitudeKey = process.env.AMPLITUDE_API_KEY;
	if (amplitudeKey) registerTrackingProvider(createAmplitudeProvider(amplitudeKey));
	const agentNativeAnalyticsKey = process.env.AGENT_NATIVE_ANALYTICS_PUBLIC_KEY;
	if (agentNativeAnalyticsKey && !shouldSkipAgentNativeAnalyticsForLocalhost()) registerTrackingProvider(createAgentNativeAnalyticsProvider(agentNativeAnalyticsKey, (process.env.AGENT_NATIVE_ANALYTICS_ENDPOINT || AGENT_NATIVE_ANALYTICS_DEFAULT_ENDPOINT).replace(/\/+$/, "")));
	const webhookUrl = process.env.TRACKING_WEBHOOK_URL;
	if (webhookUrl) registerTrackingProvider(createWebhookProvider(webhookUrl, process.env.TRACKING_WEBHOOK_AUTH));
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/env-var-writes.js
/**
* Whether deployment-wide `process.env` writes (and .env file writes) are safe.
*
* Production never allows request-time env writes, even with the escape hatch.
* Env vars are deployment-wide globals and one tenant could otherwise
* overwrite shared keys for every other tenant. Per-user/org credentials
* should use `app_secrets` instead.
*/
function isEnvVarWriteAllowed() {
	if (process.env.NODE_ENV === "production") return false;
	if (process.env.AGENT_NATIVE_ALLOW_ENV_VAR_WRITES === "1") return true;
	return isDevEnvironment() && isLocalDatabase();
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/create-server.js
/**
* Upsert vars into a .env file, preserving existing structure.
*/
async function upsertEnvFile(envPath, vars) {
	for (const { key, value } of vars) if (/[\n\r\0]/.test(value)) throw new Error(`Invalid env var value for ${key}: must not contain newlines or control characters`);
	const fs = await import("fs");
	let content = "";
	try {
		content = fs.readFileSync(envPath, "utf-8");
	} catch {}
	const lines = content.split("\n");
	const remaining = new Map(vars.map((v) => [v.key, v.value]));
	const updated = lines.map((line) => {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) return line;
		const eqIndex = trimmed.indexOf("=");
		if (eqIndex === -1) return line;
		const key = trimmed.slice(0, eqIndex).trim();
		if (remaining.has(key)) {
			const value = remaining.get(key);
			remaining.delete(key);
			return `${key}=${value}`;
		}
		return line;
	});
	for (const [key, value] of remaining) updated.push(`${key}=${value}`);
	let result = updated.join("\n");
	if (!result.endsWith("\n")) result += "\n";
	try {
		fs.mkdirSync(path.dirname(envPath), { recursive: true });
		fs.writeFileSync(envPath, result);
	} catch {}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/poll-events.js
/**
* Stream in-process poll events over SSE.
*
* This is the fast path for agent/tool/action writes that happen in the same
* server process. The regular /poll endpoint remains the cross-process and
* serverless cold-start fallback because it can detect DB timestamp changes
* even when the write happened somewhere this EventEmitter could not see.
*/
function createPollEventsHandler() {
	return defineEventHandler(async (event) => {
		const session = await getSession(event).catch(() => null);
		if (!session?.email) {
			setResponseStatus(event, 401);
			return { error: "Unauthenticated" };
		}
		const stream = createEventStream(event);
		let closed = false;
		const push = (change) => {
			if (closed) return;
			if (!canSeeChangeForUser(change, session.email, session.orgId)) return;
			try {
				stream.push(JSON.stringify(change));
			} catch {}
		};
		getPollEmitter().on(POLL_CHANGE_EVENT, push);
		stream.onClosed(() => {
			closed = true;
			getPollEmitter().off(POLL_CHANGE_EVENT, push);
		});
		return stream.send();
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/a2a/artifact-response.js
function asRecord(value) {
	return value && typeof value === "object" && !Array.isArray(value) ? value : null;
}
function stringValue(value) {
	return typeof value === "string" && value.trim() ? value.trim() : void 0;
}
function parseToolResultJson(result) {
	const trimmed = result.trim();
	if (!trimmed || /^Error(?:\s|:)/i.test(trimmed)) return null;
	try {
		return asRecord(JSON.parse(trimmed));
	} catch {
		const firstBrace = trimmed.indexOf("{");
		const lastBrace = trimmed.lastIndexOf("}");
		if (firstBrace < 0 || lastBrace <= firstBrace) return null;
		try {
			return asRecord(JSON.parse(trimmed.slice(firstBrace, lastBrace + 1)));
		} catch {
			return null;
		}
	}
}
function normalizeBaseUrl(baseUrl) {
	const trimmed = baseUrl?.trim();
	return trimmed ? trimmed.replace(/\/+$/, "") : void 0;
}
function artifactUrl(baseUrl, path) {
	const base = normalizeBaseUrl(baseUrl);
	return base ? `${base}${path}` : path;
}
function artifactUrlFromResult(parsed, fallbackPath, baseUrl) {
	const explicitUrl = stringValue(parsed.url) ?? stringValue(parsed.urlPath);
	if (!explicitUrl) return artifactUrl(baseUrl, fallbackPath);
	if (explicitUrl.startsWith("/")) return artifactUrl(baseUrl, explicitUrl);
	try {
		return new URL(explicitUrl).toString();
	} catch {
		return artifactUrl(baseUrl, fallbackPath);
	}
}
function responseAlreadyMentionsPath(text, path) {
	return text.includes(path);
}
function responseMentionsDesignShell(text, shell) {
	if (!text.trim()) return true;
	return text.includes(shell.id) || text.includes(`/design/${shell.id}`);
}
function responseAlreadyWarnsIncompleteDesign(text) {
	return /(?:not ready|still working|processing|no renderable|no files|failed|could not|cannot|can't)/i.test(text);
}
function isRenderableDesignFile(value) {
	const file = asRecord(value);
	if (!file) return false;
	const filename = stringValue(file.filename);
	const fileType = stringValue(file.fileType);
	if (!(fileType === "html" || fileType === "jsx" || filename?.endsWith(".html") || filename?.endsWith(".jsx"))) return false;
	return typeof file.content !== "string" || file.content.trim().length > 0;
}
function countRenderableDesignFiles(files) {
	if (!Array.isArray(files)) return 0;
	return files.filter(isRenderableDesignFile).length;
}
function numberValue(value) {
	return typeof value === "number" && Number.isFinite(value) ? value : void 0;
}
function deckIdValue(parsed) {
	return stringValue(parsed.id) ?? stringValue(parsed.deckId);
}
function dashboardIdValue(parsed) {
	return stringValue(parsed.id) ?? stringValue(parsed.dashboardId);
}
function analysisIdValue(parsed) {
	return stringValue(parsed.id) ?? stringValue(parsed.analysisId);
}
function imageIdValue(parsed) {
	return stringValue(parsed.assetId) ?? stringValue(parsed.imageId) ?? stringValue(parsed.id);
}
function addImageArtifact(images, parsed) {
	const id = imageIdValue(parsed);
	if (!id) return;
	images.set(id, {
		id,
		runId: stringValue(parsed.runId) ?? stringValue(parsed.generationRunId),
		title: stringValue(parsed.title),
		url: stringValue(parsed.pageUrl) ?? stringValue(parsed.detailUrl) ?? stringValue(parsed.url) ?? stringValue(parsed.urlPath)
	});
}
function isReadyDeckArtifact(parsed) {
	const slideCount = numberValue(parsed.slideCount);
	if (slideCount !== void 0) return slideCount > 0;
	if (Array.isArray(parsed.slides)) return parsed.slides.length > 0;
	return true;
}
function addDeckArtifact(decks, parsed, options) {
	const id = deckIdValue(parsed);
	if (!id) return;
	if (options.requireReady && !isReadyDeckArtifact(parsed)) return;
	decks.set(id, {
		id,
		url: stringValue(parsed.url) ?? stringValue(parsed.urlPath)
	});
}
function addListedDeckArtifacts(decks, parsed) {
	const items = parsed.decks;
	if (!Array.isArray(items)) return;
	for (const item of items) {
		const deck = asRecord(item);
		if (!deck) continue;
		addDeckArtifact(decks, deck, { requireReady: false });
	}
}
function collectArtifacts(results) {
	const documents = /* @__PURE__ */ new Map();
	const decks = /* @__PURE__ */ new Map();
	const dashboards = /* @__PURE__ */ new Map();
	const analyses = /* @__PURE__ */ new Map();
	const images = /* @__PURE__ */ new Map();
	const designShells = /* @__PURE__ */ new Map();
	const generatedDesigns = /* @__PURE__ */ new Map();
	for (const toolResult of results) {
		if (toolResult.tool === "call-agent") {
			for (const artifact of parseDownstreamArtifactBlock(toolResult.result)) if (artifact.kind === "deck") decks.set(artifact.id, {
				id: artifact.id,
				url: artifact.url
			});
			else if (artifact.kind === "document") documents.set(artifact.id, {
				id: artifact.id,
				title: artifact.title,
				url: artifact.url
			});
			else if (artifact.kind === "dashboard") dashboards.set(artifact.id, {
				id: artifact.id,
				title: artifact.title,
				url: artifact.url
			});
			else if (artifact.kind === "analysis") analyses.set(artifact.id, {
				id: artifact.id,
				title: artifact.title,
				url: artifact.url
			});
			else if (artifact.kind === "image") images.set(artifact.id, {
				id: artifact.id,
				title: artifact.title,
				url: artifact.url,
				runId: artifact.runId
			});
			else if (artifact.kind === "design" && artifact.fileCount > 0) generatedDesigns.set(artifact.id, {
				id: artifact.id,
				fileCount: artifact.fileCount,
				url: artifact.url
			});
			continue;
		}
		const parsed = parseToolResultJson(toolResult.result);
		if (!parsed) continue;
		if (toolResult.tool === "create-document" || toolResult.tool === "get-document" || toolResult.tool === "update-document") {
			const id = stringValue(parsed.id);
			if (id) documents.set(id, {
				id,
				title: stringValue(parsed.title),
				url: stringValue(parsed.url) ?? stringValue(parsed.urlPath)
			});
			continue;
		}
		if (toolResult.tool === "create-deck" || toolResult.tool === "duplicate-deck") {
			addDeckArtifact(decks, parsed, { requireReady: true });
			continue;
		}
		if (toolResult.tool === "get-deck") {
			addDeckArtifact(decks, parsed, { requireReady: false });
			continue;
		}
		if (toolResult.tool === "list-decks") {
			addListedDeckArtifacts(decks, parsed);
			continue;
		}
		if (toolResult.tool === "add-slide") {
			const id = stringValue(parsed.deckId);
			const slideCount = numberValue(parsed.slideCount);
			if (id && slideCount !== void 0 && slideCount > 0) decks.set(id, {
				id,
				url: stringValue(parsed.url) ?? stringValue(parsed.urlPath)
			});
			continue;
		}
		if (toolResult.tool === "update-dashboard" || toolResult.tool === "rename-dashboard" || toolResult.tool === "get-dashboard") {
			const id = dashboardIdValue(parsed);
			if (id) dashboards.set(id, {
				id,
				title: stringValue(parsed.name) ?? stringValue(parsed.title),
				url: stringValue(parsed.url) ?? stringValue(parsed.urlPath)
			});
			continue;
		}
		if (toolResult.tool === "save-analysis" || toolResult.tool === "get-analysis") {
			const id = analysisIdValue(parsed);
			if (id) analyses.set(id, {
				id,
				title: stringValue(parsed.name) ?? stringValue(parsed.title),
				url: stringValue(parsed.url) ?? stringValue(parsed.urlPath)
			});
			continue;
		}
		if (toolResult.tool === "generate-image" || toolResult.tool === "refine-image" || toolResult.tool === "get-asset" || toolResult.tool === "save-generated-image" || toolResult.tool === "export-image") {
			addImageArtifact(images, parsed);
			continue;
		}
		if (toolResult.tool === "generate-image-batch") {
			if (Array.isArray(parsed.images)) for (const item of parsed.images) {
				const image = asRecord(item);
				if (!image || image.ok === false) continue;
				addImageArtifact(images, image);
			}
			continue;
		}
		if (toolResult.tool === "create-design") {
			const id = stringValue(parsed.id);
			if (id) designShells.set(id, {
				id,
				title: stringValue(parsed.title)
			});
			continue;
		}
		if (toolResult.tool === "get-design") {
			const id = stringValue(parsed.id);
			if (!id) continue;
			const renderableFileCount = countRenderableDesignFiles(parsed.files);
			if (renderableFileCount > 0) generatedDesigns.set(id, {
				id,
				url: stringValue(parsed.url) ?? stringValue(parsed.urlPath),
				fileCount: Array.isArray(parsed.files) ? parsed.files.length : renderableFileCount
			});
			else designShells.set(id, {
				id,
				title: stringValue(parsed.title)
			});
			continue;
		}
		if (toolResult.tool === "generate-design") {
			const id = stringValue(parsed.designId);
			if (!id) continue;
			const savedFiles = Array.isArray(parsed.savedFiles) ? parsed.savedFiles : [];
			const fileCount = numberValue(parsed.fileCount) ?? savedFiles.length;
			if (fileCount > 0) generatedDesigns.set(id, {
				id,
				fileCount,
				url: stringValue(parsed.url) ?? stringValue(parsed.urlPath)
			});
			continue;
		}
		if (toolResult.tool === "create-file") {
			const id = stringValue(parsed.designId);
			if (!id) continue;
			if (parsed.renderable === true || stringValue(parsed.fileType) === "html" || stringValue(parsed.fileType) === "jsx") {
				const previous = generatedDesigns.get(id);
				generatedDesigns.set(id, {
					id,
					url: stringValue(parsed.url) ?? stringValue(parsed.urlPath) ?? previous?.url,
					fileCount: (previous?.fileCount ?? 0) + 1
				});
			}
		}
		if (toolResult.tool === "duplicate-design") {
			const id = stringValue(parsed.id);
			const fileCount = numberValue(parsed.fileCount);
			if (id && fileCount && fileCount > 0) generatedDesigns.set(id, {
				id,
				fileCount,
				url: stringValue(parsed.url) ?? stringValue(parsed.urlPath)
			});
		}
	}
	return {
		documents: [...documents.values()],
		decks: [...decks.values()],
		dashboards: [...dashboards.values()],
		analyses: [...analyses.values()],
		images: [...images.values()],
		designShells: [...designShells.values()],
		generatedDesigns: [...generatedDesigns.values()]
	};
}
function parseDownstreamArtifactBlock(result) {
	const artifacts = [];
	for (const line of downstreamArtifactLines(result)) {
		const deck = line.match(/^- Deck(?:\s+"[^"]+")?(?:\s+\([^)]*\))?:\s+(\S+)\s+\(ID:\s*([A-Za-z0-9_-]+)\)$/);
		if (deck) {
			const id = deck[2];
			if (!artifactUrlReferencesId(deck[1], "deck", id)) continue;
			artifacts.push({
				kind: "deck",
				url: deck[1],
				id
			});
			continue;
		}
		const document = line.match(/^- Document(?:\s+"([^"]+)")?:\s+(\S+)\s+\(ID:\s*([A-Za-z0-9_-]+)\)$/);
		if (document) {
			const id = document[3];
			if (!artifactUrlReferencesId(document[2], "document", id)) continue;
			artifacts.push({
				kind: "document",
				title: document[1],
				url: document[2],
				id
			});
			continue;
		}
		const dashboard = line.match(/^- Dashboard(?:\s+"([^"]+)")?:\s+(\S+)\s+\(ID:\s*([A-Za-z0-9_-]+)\)$/);
		if (dashboard) {
			const id = dashboard[3];
			if (!artifactUrlReferencesId(dashboard[2], "dashboard", id)) continue;
			artifacts.push({
				kind: "dashboard",
				title: dashboard[1],
				url: dashboard[2],
				id
			});
			continue;
		}
		const analysis = line.match(/^- (?:Analysis|Report)(?:\s+"([^"]+)")?:\s+(\S+)\s+\(ID:\s*([A-Za-z0-9_-]+)\)$/);
		if (analysis) {
			const id = analysis[3];
			if (!artifactUrlReferencesId(analysis[2], "analysis", id)) continue;
			artifacts.push({
				kind: "analysis",
				title: analysis[1],
				url: analysis[2],
				id
			});
			continue;
		}
		const image = line.match(/^- Image(?:\s+"([^"]+)")?:\s+(\S+)\s+\(ID:\s*([A-Za-z0-9_-]+)(?:,\s*Run:\s*([A-Za-z0-9_-]+))?\)$/);
		if (image) {
			const id = image[3];
			if (!artifactUrlReferencesId(image[2], "image", id)) continue;
			artifacts.push({
				kind: "image",
				title: image[1],
				url: image[2],
				id,
				runId: image[4]
			});
			continue;
		}
		const design = line.match(/^- Design:\s+(\S+)\s+\(ID:\s*([A-Za-z0-9_-]+),\s*(\d+)\s+files?\)$/);
		if (design) {
			const id = design[2];
			if (!artifactUrlReferencesId(design[1], "design", id)) continue;
			artifacts.push({
				kind: "design",
				url: design[1],
				id,
				fileCount: Number(design[3])
			});
		}
	}
	return artifacts;
}
function downstreamArtifactLines(result) {
	const lines = result.split(/\r?\n/);
	const artifactLines = [];
	for (let i = 0; i < lines.length; i += 1) {
		if (lines[i].trim() !== "Artifacts:") continue;
		let sawBlockLine = false;
		for (let j = i + 1; j < lines.length; j += 1) {
			const trimmed = lines[j].trim();
			if (!trimmed) {
				if (!sawBlockLine) continue;
				break;
			}
			if (!trimmed.startsWith("- ")) break;
			sawBlockLine = true;
			artifactLines.push(trimmed);
		}
	}
	return artifactLines;
}
function artifactUrlReferencesId(rawUrl, kind, id) {
	const reference = parseArtifactReferenceUrl(rawUrl);
	return reference?.kind === kind && reference.id === id;
}
function parseArtifactReferenceUrl(rawUrl) {
	let url;
	try {
		url = new URL(rawUrl, "https://agent-native-artifact.invalid");
	} catch {
		return null;
	}
	if (url.protocol !== "http:" && url.protocol !== "https:") return null;
	const path = url.pathname.replace(/\/+$/, "");
	const deck = path.match(/(?:^|\/)deck\/([A-Za-z0-9_-]+)(?:\/present)?$/);
	if (deck) return {
		kind: "deck",
		id: deck[1]
	};
	const design = path.match(/(?:^|\/)design\/([A-Za-z0-9_-]+)$/);
	if (design) return {
		kind: "design",
		id: design[1]
	};
	const document = path.match(/(?:^|\/)page\/([A-Za-z0-9_-]+)$/);
	if (document) return {
		kind: "document",
		id: document[1]
	};
	const dashboard = path.match(/(?:^|\/)adhoc\/([A-Za-z0-9_-]+)$/);
	if (dashboard) return {
		kind: "dashboard",
		id: dashboard[1]
	};
	const analysis = path.match(/(?:^|\/)analyses\/([A-Za-z0-9_-]+)$/);
	if (analysis) return {
		kind: "analysis",
		id: analysis[1]
	};
	const image = path.match(/(?:^|\/)image\/([A-Za-z0-9_-]+)$/);
	if (image) return {
		kind: "image",
		id: image[1]
	};
	const imageEmbed = path.match(/(?:^|\/)asset\/([A-Za-z0-9_-]+)\/embed$/);
	if (imageEmbed) return {
		kind: "image",
		id: imageEmbed[1]
	};
	const imageContent = path.match(/(?:^|\/)api\/assets\/([A-Za-z0-9_-]+)\/content$/);
	if (imageContent) return {
		kind: "image",
		id: imageContent[1]
	};
	return null;
}
function formatDocumentLine(document, baseUrl) {
	return `- ${document.title ? `Document "${document.title}"` : "Document"}: ${artifactUrlFromResult({ url: document.url }, `/page/${document.id}`, baseUrl)} (ID: ${document.id})`;
}
function formatDeckLine(deck, baseUrl) {
	return `- Deck: ${artifactUrlFromResult({ url: deck.url }, `/deck/${deck.id}`, baseUrl)} (ID: ${deck.id})`;
}
function formatDashboardLine(dashboard, baseUrl) {
	return `- ${dashboard.title ? `Dashboard "${dashboard.title}"` : "Dashboard"}: ${artifactUrlFromResult({ url: dashboard.url }, `/adhoc/${dashboard.id}`, baseUrl)} (ID: ${dashboard.id})`;
}
function formatAnalysisLine(analysis, baseUrl) {
	return `- ${analysis.title ? `Report "${analysis.title}"` : "Report"}: ${artifactUrlFromResult({ url: analysis.url }, `/analyses/${analysis.id}`, baseUrl)} (ID: ${analysis.id})`;
}
function formatImageLine(image, baseUrl) {
	const label = image.title ? `Image "${image.title}"` : "Image";
	const run = image.runId ? `, Run: ${image.runId}` : "";
	return `- ${label}: ${artifactUrlFromResult({ url: image.url }, `/image/${image.id}`, baseUrl)} (ID: ${image.id}${run})`;
}
function formatDesignLine(design, baseUrl) {
	const fileLabel = design.fileCount === 1 ? "1 file" : `${design.fileCount} files`;
	return `- Design: ${artifactUrlFromResult({ url: design.url }, `/design/${design.id}`, baseUrl)} (ID: ${design.id}, ${fileLabel})`;
}
function formatIncompleteDesignMessage(shells) {
	const ids = shells.map((shell) => shell.id).join(", ");
	return `The design is not ready yet. Design ${shells.length === 1 ? "project shell" : "project shells"} ${ids} exists, but no renderable files were saved, so I cannot return it as a completed artifact.`;
}
function collectReferencedArtifacts(text, baseUrl) {
	const refs = /* @__PURE__ */ new Map();
	const baseOrigin = safeOrigin(baseUrl);
	for (const match of text.matchAll(/(?:(https?:\/\/[^/\s<>()]+))?(?:\/[^\s<>()]*)?\/(deck|design|page|adhoc|analyses|image|asset|assets)\/([A-Za-z0-9_-]+)/g)) {
		const origin = safeOrigin(match[1]);
		const route = match[2];
		const id = match[3];
		const kind = route === "deck" ? "deck" : route === "design" ? "design" : route === "page" ? "document" : route === "adhoc" ? "dashboard" : route === "analyses" ? "analysis" : "image";
		if (!shouldValidateArtifactReference(origin, baseOrigin, kind)) continue;
		refs.set(`${kind}:${id}`, {
			kind,
			id
		});
	}
	return [...refs.values()];
}
function safeOrigin(url) {
	if (!url) return void 0;
	try {
		return new URL(url).origin;
	} catch {
		return;
	}
}
var KNOWN_AGENT_NATIVE_ARTIFACT_HOSTS = {
	deck: new Set(["slides.agent-native.com"]),
	design: new Set(["design.agent-native.com"]),
	document: new Set(["content.agent-native.com"]),
	dashboard: new Set(["analytics.agent-native.com"]),
	analysis: new Set(["analytics.agent-native.com"]),
	image: new Set(["images.agent-native.com"])
};
function safeHostnameFromOrigin(origin) {
	if (!origin) return void 0;
	try {
		return new URL(origin).hostname.toLowerCase();
	} catch {
		return;
	}
}
function shouldValidateArtifactReference(origin, baseOrigin, kind) {
	if (!origin || !baseOrigin || origin === baseOrigin) return true;
	const hostname = safeHostnameFromOrigin(origin);
	return !!hostname && KNOWN_AGENT_NATIVE_ARTIFACT_HOSTS[kind].has(hostname);
}
function findUnverifiedArtifactReferences(text, baseUrl, documents, decks, dashboards, analyses, images, generatedDesigns) {
	const documentIds = new Set(documents.map((document) => document.id));
	const deckIds = new Set(decks.map((deck) => deck.id));
	const dashboardIds = new Set(dashboards.map((dashboard) => dashboard.id));
	const analysisIds = new Set(analyses.map((analysis) => analysis.id));
	const imageIds = new Set(images.map((image) => image.id));
	const designIds = new Set(generatedDesigns.map((design) => design.id));
	return collectReferencedArtifacts(text, baseUrl).filter((ref) => {
		if (ref.kind === "document") return !documentIds.has(ref.id);
		if (ref.kind === "deck") return !deckIds.has(ref.id);
		if (ref.kind === "dashboard") return !dashboardIds.has(ref.id);
		if (ref.kind === "analysis") return !analysisIds.has(ref.id);
		if (ref.kind === "image") return !imageIds.has(ref.id);
		return !designIds.has(ref.id);
	});
}
function formatUnverifiedArtifactMessage(refs, documents, decks, dashboards, analyses, images, generatedDesigns, baseUrl) {
	const hasOnlyDesigns = refs.every((ref) => ref.kind === "design");
	const hasOnlyDocuments = refs.every((ref) => ref.kind === "document");
	const hasOnlyDecks = refs.every((ref) => ref.kind === "deck");
	const hasOnlyDashboards = refs.every((ref) => ref.kind === "dashboard");
	const hasOnlyAnalyses = refs.every((ref) => ref.kind === "analysis");
	const hasOnlyImages = refs.every((ref) => ref.kind === "image");
	const label = hasOnlyDesigns ? "design URL" : hasOnlyDocuments ? "document URL" : hasOnlyDecks ? "deck URL" : hasOnlyDashboards ? "dashboard URL" : hasOnlyAnalyses ? "report URL" : hasOnlyImages ? "image URL" : "artifact URL";
	const message = `I could not verify the ${refs.length === 1 ? label : `${label}s`} in the final answer against a successful artifact action that saved app data, so I cannot return it.`;
	const verifiedLines = [
		...documents.map((document) => formatDocumentLine(document, baseUrl)),
		...decks.map((deck) => formatDeckLine(deck, baseUrl)),
		...dashboards.map((dashboard) => formatDashboardLine(dashboard, baseUrl)),
		...analyses.map((analysis) => formatAnalysisLine(analysis, baseUrl)),
		...images.map((image) => formatImageLine(image, baseUrl)),
		...generatedDesigns.map((design) => formatDesignLine(design, baseUrl))
	];
	return verifiedLines.length > 0 ? `${message}\n\nArtifacts:\n${verifiedLines.join("\n")}` : message;
}
function appendA2AArtifactLinks(responseText, toolResults, options = {}) {
	const baseUrl = normalizeBaseUrl(options.baseUrl);
	const includeReferencedArtifacts = options.includeReferencedArtifacts ?? false;
	const { documents, decks, dashboards, analyses, images, designShells, generatedDesigns } = collectArtifacts(toolResults);
	const generatedDesignIds = new Set(generatedDesigns.map((design) => design.id));
	const incompleteShells = designShells.filter((shell) => !generatedDesignIds.has(shell.id));
	let text = responseText.trim() === "(no response)" ? "" : responseText.trim();
	if (generatedDesigns.length === 0 && incompleteShells.length > 0 && !responseAlreadyWarnsIncompleteDesign(text) && (incompleteShells.some((shell) => responseMentionsDesignShell(text, shell)) || /\b(?:done|created|ready|here(?:'s| is)|complete|finished)\b/i.test(text))) return formatIncompleteDesignMessage(incompleteShells);
	const unverifiedRefs = findUnverifiedArtifactReferences(text, baseUrl, documents, decks, dashboards, analyses, images, generatedDesigns);
	if (unverifiedRefs.length > 0) return formatUnverifiedArtifactMessage(unverifiedRefs, documents, decks, dashboards, analyses, images, generatedDesigns, baseUrl);
	const missingLines = [];
	for (const document of documents) {
		const path = `/page/${document.id}`;
		if (includeReferencedArtifacts || !responseAlreadyMentionsPath(text, path)) missingLines.push(formatDocumentLine(document, baseUrl));
	}
	for (const deck of decks) {
		const path = `/deck/${deck.id}`;
		if (includeReferencedArtifacts || !responseAlreadyMentionsPath(text, path)) missingLines.push(formatDeckLine(deck, baseUrl));
	}
	for (const dashboard of dashboards) {
		const path = `/adhoc/${dashboard.id}`;
		if (includeReferencedArtifacts || !responseAlreadyMentionsPath(text, path)) missingLines.push(formatDashboardLine(dashboard, baseUrl));
	}
	for (const analysis of analyses) {
		const path = `/analyses/${analysis.id}`;
		if (includeReferencedArtifacts || !responseAlreadyMentionsPath(text, path)) missingLines.push(formatAnalysisLine(analysis, baseUrl));
	}
	for (const image of images) {
		const path = `/image/${image.id}`;
		if (includeReferencedArtifacts || !responseAlreadyMentionsPath(text, path)) missingLines.push(formatImageLine(image, baseUrl));
	}
	for (const design of generatedDesigns) {
		const path = `/design/${design.id}`;
		if (includeReferencedArtifacts || !responseAlreadyMentionsPath(text, path)) missingLines.push(formatDesignLine(design, baseUrl));
	}
	if (missingLines.length === 0) return text;
	const artifactBlock = `Artifacts:\n${missingLines.join("\n")}`;
	return text ? `${text}\n\n${artifactBlock}` : artifactBlock;
}
function buildA2ARecoverableArtifactMessage(toolResults, options = {}) {
	const baseUrl = normalizeBaseUrl(options.baseUrl);
	const { documents, decks, dashboards, analyses, images, generatedDesigns } = collectArtifacts(toolResults);
	const lines = [
		...documents.map((document) => formatDocumentLine(document, baseUrl)),
		...decks.map((deck) => formatDeckLine(deck, baseUrl)),
		...dashboards.map((dashboard) => formatDashboardLine(dashboard, baseUrl)),
		...analyses.map((analysis) => formatAnalysisLine(analysis, baseUrl)),
		...images.map((image) => formatImageLine(image, baseUrl)),
		...generatedDesigns.map((design) => formatDesignLine(design, baseUrl))
	];
	if (lines.length === 0) return null;
	return [
		"The agent is still working on the full response, but these verified artifacts already exist:",
		"",
		"Artifacts:",
		...lines
	].join("\n");
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/file-upload/builder.js
var DEFAULT_BUILDER_APP_HOST = "https://builder.io";
function builderUploadHost() {
	return process.env.BUILDER_APP_HOST || process.env.BUILDER_PUBLIC_APP_HOST || DEFAULT_BUILDER_APP_HOST;
}
/**
* Built-in Builder.io file upload provider.
* Uses the same BUILDER_PRIVATE_KEY as the browser/background-agent flows,
* so connecting Builder once (via the sidebar "Connect Builder" action)
* automatically enables file uploads.
*
* Upload API: https://www.builder.io/c/docs/upload-api
*/
var builderFileUploadProvider = {
	id: "builder",
	name: "Builder.io",
	isConfigured: () => !!process.env.BUILDER_PRIVATE_KEY,
	upload: async ({ data, filename, mimeType }) => {
		const { resolveBuilderPrivateKey } = await import("./credential-provider-CKFlFM2V.js");
		const privateKey = await resolveBuilderPrivateKey();
		if (!privateKey) throw new Error("BUILDER_PRIVATE_KEY is not set");
		const url = new URL("/api/v1/upload", builderUploadHost());
		if (filename) url.searchParams.set("name", filename);
		const bareMimeType = (mimeType || "application/octet-stream").split(";")[0].trim();
		const buffer = data instanceof Uint8Array ? data : new Uint8Array(data);
		const bytes = new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength);
		const body = typeof Blob !== "undefined" ? new Blob([bytes], { type: bareMimeType }) : bytes;
		const response = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${privateKey}`,
				"Content-Type": bareMimeType
			},
			body
		});
		if (!response.ok) {
			const text = await response.text().catch(() => "");
			throw new Error(`Builder.io upload failed (${response.status}): ${text || response.statusText}`);
		}
		const json = await response.json().catch(() => ({}));
		if (!json.url) throw new Error("Builder.io upload returned no URL");
		return {
			url: json.url,
			id: json.id,
			provider: "builder"
		};
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/file-upload/registry.js
var providers = /* @__PURE__ */ new Map();
var warnedFallback = false;
function listFileUploadProviders() {
	return [...providers.values()];
}
/**
* Returns the first configured provider, checking user-registered ones first
* and falling back to the built-in Builder.io provider when its env is set.
* Returns `null` when nothing is configured — callers should then use the
* SQL fallback.
*/
function getActiveFileUploadProvider() {
	for (const provider of providers.values()) if (provider.isConfigured()) return provider;
	if (builderFileUploadProvider.isConfigured()) return builderFileUploadProvider;
	return null;
}
/**
* Upload a file via the active provider, or `null` if no provider is
* configured. Callers use `null` as the signal to fall back to SQL
* storage. On the first fallback we log a one-time warning because
* storing files in SQL is not optimal for production.
*/
async function uploadFile(input) {
	const provider = getActiveFileUploadProvider();
	if (provider && provider !== builderFileUploadProvider) return provider.upload(input);
	let builderKey = null;
	try {
		const { resolveBuilderPrivateKey } = await import("./credential-provider-CKFlFM2V.js");
		builderKey = await resolveBuilderPrivateKey();
	} catch (err) {
		console.warn("[agent-native] Builder credential check failed:", err instanceof Error ? err.message : String(err));
	}
	if (builderKey) return await builderFileUploadProvider.upload(input);
	if (!warnedFallback) {
		warnedFallback = true;
		console.warn("[agent-native] No file upload provider configured — storing files in SQL. Connect Builder.io in Settings → File uploads, or register a provider, for production-grade file storage.");
	}
	return null;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/application-state/handlers.js
/**
* Resolve the session ID for app state scoping. Returns the authenticated
* user's email; throws 401 when the request has no session.
*/
async function getSessionId(event) {
	const session = await getSession(event);
	if (!session?.email) throw createError({
		statusCode: 401,
		statusMessage: "Unauthenticated"
	});
	return session.email;
}
function safeKey(key) {
	return key.replace(/[^a-zA-Z0-9_:\-]/g, "");
}
var getState = defineEventHandler(async (event) => {
	return await appStateGet(await getSessionId(event), safeKey(String(getRouterParam(event, "key")))) ?? null;
});
var putState = defineEventHandler(async (event) => {
	const sessionId = await getSessionId(event);
	const key = safeKey(String(getRouterParam(event, "key")));
	const body = await readBody$1(event);
	await appStatePut(sessionId, key, body, { requestSource: getHeader(event, "x-request-source") || void 0 });
	return body;
});
var deleteState = defineEventHandler(async (event) => {
	await appStateDelete(await getSessionId(event), safeKey(String(getRouterParam(event, "key"))), { requestSource: getHeader(event, "x-request-source") || void 0 });
	return { ok: true };
});
function composeDraftKey(id) {
	return `compose-${safeKey(id)}`;
}
/** List all compose drafts */
var listComposeDrafts = defineEventHandler(async (event) => {
	return (await appStateList(await getSessionId(event), "compose-")).map((item) => item.value);
});
/** Get a single compose draft */
var getComposeDraft = defineEventHandler(async (event) => {
	return await appStateGet(await getSessionId(event), composeDraftKey(getRouterParam(event, "id"))) ?? null;
});
/** Create or update a compose draft */
var putComposeDraft = defineEventHandler(async (event) => {
	const sessionId = await getSessionId(event);
	const id = getRouterParam(event, "id");
	const body = await readBody$1(event);
	const { subject, body: bodyText } = body;
	if (typeof subject !== "string" || typeof bodyText !== "string") {
		setResponseStatus(event, 400);
		return { error: "subject and body are required strings" };
	}
	const state = {
		...body,
		id
	};
	const requestSource = getHeader(event, "x-request-source") || void 0;
	await appStatePut(sessionId, composeDraftKey(id), state, { requestSource });
	return state;
});
/** Delete a single compose draft */
var deleteComposeDraft = defineEventHandler(async (event) => {
	const sessionId = await getSessionId(event);
	const id = getRouterParam(event, "id");
	const requestSource = getHeader(event, "x-request-source") || void 0;
	await appStateDelete(sessionId, composeDraftKey(id), { requestSource });
	return { ok: true };
});
/** Delete all compose drafts */
var deleteAllComposeDrafts = defineEventHandler(async (event) => {
	await appStateDeleteByPrefix(await getSessionId(event), "compose-", { requestSource: getHeader(event, "x-request-source") || void 0 });
	return { ok: true };
});
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/secrets/register.js
/**
* In-process registry of required / optional secrets.
*
* Templates call `registerRequiredSecret()` at module load time — typically
* from a server plugin. The secrets HTTP routes and the sidebar settings UI
* read from this registry on every request so overrides and late-registered
* secrets are picked up without a restart.
*/
var REGISTRY_KEY = Symbol.for("@agent-native/core/secrets.registry");
var registry = globalThis[REGISTRY_KEY] ??= /* @__PURE__ */ new Map();
/** Return all registered secrets in registration order. */
function listRequiredSecrets() {
	return Array.from(registry.values());
}
/** Look up a single registered secret by key. */
function getRequiredSecret(key) {
	return registry.get(key);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/secrets/routes.js
/**
* H3 event handlers for the framework secrets registry.
*
* Mounted under `/_agent-native/secrets/*` by `core-routes-plugin`.
*
* NEVER return a secret's plain-text value from any of these handlers.
*/
/**
* Workspace-scoped secret writes/deletes are deployment-wide for every
* org member who shares the resolved scopeId — a curious or malicious
* member could otherwise overwrite `OPENAI_API_KEY` (or any unregistered
* key) with their own value, redirecting every other member's automations
* through their key for skimming, billing abuse, or DoS by deletion.
*
* Allow workspace-scope writes only for org owners/admins. The "solo"
* fallback scopeId (`solo:<email>`) is single-user, so it bypasses the
* check. A normal session with no active org also passes — there's no
* privilege gradient to enforce in that case.
*
* Returns true if the request is allowed to write/delete this scope.
*/
async function canMutateWorkspaceScope(event, scopeId) {
	if (scopeId.startsWith("solo:")) return true;
	const ctx = await getOrgContext(event).catch(() => null);
	if (!ctx?.orgId) return true;
	return ctx.role === "owner" || ctx.role === "admin";
}
/**
* Org-scoped secrets (`scope: "org"`) live alongside `workspace` scope but
* are stricter: they always require an active org and an owner/admin role.
* No solo fallback — if the caller has no org, an org-scoped write makes no
* sense and we refuse rather than write to an ambiguous row.
*/
async function canMutateOrgScope(event, scopeId) {
	const ctx = await getOrgContext(event).catch(() => null);
	if (!ctx?.orgId || ctx.orgId !== scopeId) return false;
	return ctx.role === "owner" || ctx.role === "admin";
}
function redactSecretFromMessage(message, secretValue) {
	if (!message || !secretValue) return message;
	return message.split(secretValue).join("[redacted]");
}
async function hasOAuthSecretForEvent(event, secret) {
	if (!secret.oauthProvider) return false;
	const session = await getSession(event).catch(() => null);
	if (!session?.email) return false;
	return (await listOAuthAccountsByOwner(secret.oauthProvider, session.email)).length > 0;
}
/** Resolve the scopeId for a given scope, given the current session. */
async function resolveScopeId(event, scope) {
	if (scope === "user") {
		const session = await getSession(event).catch(() => null);
		if (!session?.email) return {
			scopeId: null,
			reason: "Authentication required"
		};
		return { scopeId: session.email };
	}
	if (scope === "org") {
		const ctx = await getOrgContext(event).catch(() => null);
		if (ctx?.orgId) return { scopeId: ctx.orgId };
		return {
			scopeId: null,
			reason: "No active organization"
		};
	}
	const ctx = await getOrgContext(event).catch(() => null);
	if (ctx?.orgId) return { scopeId: ctx.orgId };
	const session = await getSession(event).catch(() => null);
	if (session?.email) return { scopeId: `solo:${session.email}` };
	return {
		scopeId: null,
		reason: "No workspace or session context"
	};
}
/** GET /_agent-native/secrets — list registered secrets with status. */
function createListSecretsHandler() {
	return defineEventHandler(async (event) => {
		if (getMethod(event) !== "GET") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const secrets = listRequiredSecrets();
		const payload = [];
		for (const secret of secrets) {
			const base = {
				key: secret.key,
				label: secret.label,
				description: secret.description,
				docsUrl: secret.docsUrl,
				scope: secret.scope,
				kind: secret.kind,
				required: !!secret.required,
				status: "unset"
			};
			if (secret.kind === "oauth") {
				base.oauthProvider = secret.oauthProvider;
				base.oauthConnectUrl = secret.oauthConnectUrl;
				if (secret.oauthProvider) try {
					base.status = await hasOAuthSecretForEvent(event, secret) ? "set" : "unset";
				} catch {
					base.status = "unset";
				}
				payload.push(base);
				continue;
			}
			const { scopeId } = await resolveScopeId(event, secret.scope);
			if (!scopeId) {
				payload.push(base);
				continue;
			}
			const meta = await getAppSecretMeta({
				key: secret.key,
				scope: secret.scope,
				scopeId
			}).catch(() => null);
			if (meta) {
				base.status = "set";
				base.last4 = meta.last4;
				base.updatedAt = meta.updatedAt;
			}
			payload.push(base);
		}
		return payload;
	});
}
/** POST /_agent-native/secrets/:key — write a secret. */
function createWriteSecretHandler() {
	return defineEventHandler(async (event) => {
		const method = getMethod(event);
		const key = extractKeyFromEvent(event);
		if (!key) {
			setResponseStatus(event, 400);
			return { error: "Secret key required" };
		}
		const secret = getRequiredSecret(key);
		if (!secret) {
			setResponseStatus(event, 404);
			return { error: `Secret "${key}" is not registered` };
		}
		if (method === "POST" || method === "PUT") return handleWrite(event, secret);
		if (method === "DELETE") return handleDelete(event, secret);
		setResponseStatus(event, 405);
		return { error: "Method not allowed" };
	});
}
async function handleWrite(event, secret) {
	if (secret.kind === "oauth") {
		setResponseStatus(event, 400);
		return { error: `"${secret.key}" is an OAuth-kind secret — connect via ${secret.oauthConnectUrl ?? "the OAuth flow"} instead` };
	}
	const body = await readBody$1(event).catch(() => ({}));
	const value = typeof body.value === "string" ? body.value.trim() : "";
	if (!value) {
		setResponseStatus(event, 400);
		return { error: "value is required" };
	}
	const { scopeId, reason } = await resolveScopeId(event, secret.scope);
	if (!scopeId) {
		setResponseStatus(event, 401);
		return { error: reason ?? "Unable to resolve scope" };
	}
	if (secret.scope === "workspace" && !await canMutateWorkspaceScope(event, scopeId)) {
		setResponseStatus(event, 403);
		return { error: "Only organization owners and admins can set workspace-scoped secrets" };
	}
	if (secret.scope === "org" && !await canMutateOrgScope(event, scopeId)) {
		setResponseStatus(event, 403);
		return { error: "Only organization owners and admins can set org-scoped secrets" };
	}
	if (secret.validator) try {
		const result = await secret.validator(value);
		if (!(typeof result === "boolean" ? result : result?.ok === true)) {
			setResponseStatus(event, 400);
			return { error: redactSecretFromMessage(typeof result === "object" && result && result.error ? String(result.error) : "Validator rejected the value", value) };
		}
	} catch (err) {
		setResponseStatus(event, 400);
		return { error: redactSecretFromMessage(err instanceof Error ? `Validator threw: ${err.message}` : "Validator threw", value) };
	}
	try {
		await writeAppSecret({
			key: secret.key,
			value,
			scope: secret.scope,
			scopeId
		});
	} catch (err) {
		setResponseStatus(event, 500);
		return { error: redactSecretFromMessage(err instanceof Error ? `Failed to save secret: ${err.message}` : "Failed to save secret", value) };
	}
	return {
		ok: true,
		status: "set"
	};
}
async function handleDelete(event, secret) {
	if (secret.kind === "oauth") {
		setResponseStatus(event, 400);
		return { error: `"${secret.key}" is an OAuth-kind secret — disconnect via the OAuth flow instead` };
	}
	const { scopeId, reason } = await resolveScopeId(event, secret.scope);
	if (!scopeId) {
		setResponseStatus(event, 401);
		return { error: reason ?? "Unable to resolve scope" };
	}
	if (secret.scope === "workspace" && !await canMutateWorkspaceScope(event, scopeId)) {
		setResponseStatus(event, 403);
		return { error: "Only organization owners and admins can delete workspace-scoped secrets" };
	}
	if (secret.scope === "org" && !await canMutateOrgScope(event, scopeId)) {
		setResponseStatus(event, 403);
		return { error: "Only organization owners and admins can delete org-scoped secrets" };
	}
	return {
		ok: true,
		removed: await deleteAppSecret({
			key: secret.key,
			scope: secret.scope,
			scopeId
		})
	};
}
/**
* POST /_agent-native/secrets/:key/test — re-run the validator against the
* current stored value without changing anything. Useful for the "Test" button.
*/
function createTestSecretHandler() {
	return defineEventHandler(async (event) => {
		if (getMethod(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const key = extractKeyFromEvent(event, { suffix: "/test" });
		if (!key) {
			setResponseStatus(event, 400);
			return { error: "Secret key required" };
		}
		const secret = getRequiredSecret(key);
		if (!secret) {
			setResponseStatus(event, 404);
			return { error: `Secret "${key}" is not registered` };
		}
		if (secret.kind === "oauth") return { ok: await hasOAuthSecretForEvent(event, secret).catch(() => false) };
		if (!secret.validator) return {
			ok: true,
			note: "No validator registered"
		};
		const { scopeId } = await resolveScopeId(event, secret.scope);
		if (!scopeId) {
			setResponseStatus(event, 401);
			return { error: "Unable to resolve scope" };
		}
		const stored = await readAppSecret({
			key: secret.key,
			scope: secret.scope,
			scopeId
		});
		if (!stored) {
			setResponseStatus(event, 404);
			return { error: "No value stored" };
		}
		try {
			const result = await secret.validator(stored.value);
			if (!(typeof result === "boolean" ? result : result?.ok === true)) return {
				ok: false,
				error: redactSecretFromMessage(typeof result === "object" && result && result.error ? String(result.error) : "Validator rejected the value", stored.value)
			};
			return { ok: true };
		} catch (err) {
			return {
				ok: false,
				error: redactSecretFromMessage(err instanceof Error ? `Validator threw: ${err.message}` : "Validator threw", stored.value)
			};
		}
	});
}
var AD_HOC_NAME_REGEX = /^[A-Za-z0-9_-]+$/;
function metaToPayload(meta) {
	return {
		name: meta.key,
		scope: meta.scope,
		scopeId: meta.scopeId,
		description: meta.description,
		last4: meta.last4,
		urlAllowlist: meta.urlAllowlist,
		createdAt: meta.createdAt,
		updatedAt: meta.updatedAt
	};
}
/**
* Handler for `/_agent-native/secrets/adhoc[/:name]`.
*
* - GET (no name) — list all ad-hoc keys for the user's scope
* - POST (no name) — create or update an ad-hoc key
* - DELETE (with name) — delete an ad-hoc key
*
* Ad-hoc keys are arbitrary named secrets users or the agent create at
* runtime for automation use (e.g. "SLACK_WEBHOOK", "HUBSPOT_API_KEY").
* They differ from registered secrets (`registerRequiredSecret`) in that
* they have no template-defined metadata, validator, or onboarding step.
*/
function createAdHocSecretHandler() {
	return defineEventHandler(async (event) => {
		const method = getMethod(event);
		const name = extractAdHocName(event);
		if (method === "GET" && !name) return handleAdHocList(event);
		if (method === "POST" && !name) return handleAdHocWrite(event);
		if (method === "DELETE" && name) return handleAdHocDelete(event, name);
		setResponseStatus(event, 405);
		return { error: "Method not allowed" };
	});
}
async function handleAdHocList(event) {
	const { scopeId, reason } = await resolveScopeId(event, "user");
	if (!scopeId) {
		setResponseStatus(event, 401);
		return { error: reason ?? "Unable to resolve scope" };
	}
	const registered = new Set(listRequiredSecrets().map((s) => s.key));
	const userRows = await listAppSecretsForScope("user", scopeId);
	const workspaceContext = await resolveScopeId(event, "workspace");
	const workspaceRows = workspaceContext.scopeId ? await listAppSecretsForScope("workspace", workspaceContext.scopeId) : [];
	const payload = [];
	for (const row of [...userRows, ...workspaceRows]) {
		if (registered.has(row.key)) continue;
		payload.push(metaToPayload(row));
	}
	return payload;
}
async function handleAdHocWrite(event) {
	const body = await readBody$1(event).catch(() => ({}));
	const name = typeof body.name === "string" ? body.name.trim() : "";
	if (!name || !AD_HOC_NAME_REGEX.test(name)) {
		setResponseStatus(event, 400);
		return { error: "name is required and may only contain letters, digits, underscores, and dashes" };
	}
	if (getRequiredSecret(name)) {
		setResponseStatus(event, 400);
		return { error: `"${name}" is a registered secret — use POST /_agent-native/secrets/${name} instead` };
	}
	const value = typeof body.value === "string" ? body.value.trim() : "";
	if (!value) {
		setResponseStatus(event, 400);
		return { error: "value is required" };
	}
	const scope = body.scope === "workspace" ? "workspace" : "user";
	const description = typeof body.description === "string" && body.description.trim() ? body.description.trim() : void 0;
	let urlAllowlistJson;
	if (body.urlAllowlist !== void 0 && body.urlAllowlist !== null) {
		const normalized = normalizeUrlAllowlist(body.urlAllowlist);
		if (normalized.ok === false) {
			setResponseStatus(event, 400);
			return { error: normalized.error };
		}
		urlAllowlistJson = JSON.stringify(normalized.origins);
	}
	const { scopeId, reason } = await resolveScopeId(event, scope);
	if (!scopeId) {
		setResponseStatus(event, 401);
		return { error: reason ?? "Unable to resolve scope" };
	}
	if (scope === "workspace" && !await canMutateWorkspaceScope(event, scopeId)) {
		setResponseStatus(event, 403);
		return { error: "Only organization owners and admins can set workspace-scoped secrets" };
	}
	try {
		await writeAppSecret({
			key: name,
			value,
			scope,
			scopeId,
			description,
			urlAllowlist: urlAllowlistJson
		});
	} catch (err) {
		setResponseStatus(event, 500);
		return { error: redactSecretFromMessage(err instanceof Error ? `Failed to save secret: ${err.message}` : "Failed to save secret", value) };
	}
	return {
		ok: true,
		key: name
	};
}
async function handleAdHocDelete(event, name) {
	if (getRequiredSecret(name)) {
		setResponseStatus(event, 400);
		return { error: `"${name}" is a registered secret — delete via the registered route instead` };
	}
	const scope = "user";
	const { scopeId, reason } = await resolveScopeId(event, scope);
	if (!scopeId) {
		setResponseStatus(event, 401);
		return { error: reason ?? "Unable to resolve scope" };
	}
	const removed = await deleteAppSecret({
		key: name,
		scope,
		scopeId
	});
	if (!removed) {
		const workspaceContext = await resolveScopeId(event, "workspace");
		if (workspaceContext.scopeId) {
			if (!await canMutateWorkspaceScope(event, workspaceContext.scopeId)) return {
				ok: true,
				removed: false
			};
			return {
				ok: true,
				removed: await deleteAppSecret({
					key: name,
					scope: "workspace",
					scopeId: workspaceContext.scopeId
				})
			};
		}
	}
	return {
		ok: true,
		removed
	};
}
function extractAdHocName(event) {
	const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
	if (!pathname) return null;
	const candidate = pathname.split("/")[0];
	if (!candidate) return null;
	return AD_HOC_NAME_REGEX.test(candidate) ? candidate : null;
}
function normalizeUrlAllowlist(input) {
	if (!Array.isArray(input) || !input.every((v) => typeof v === "string")) return {
		ok: false,
		error: "urlAllowlist must be an array of strings"
	};
	const origins = [];
	for (const raw of input) {
		const value = raw.trim();
		if (!value) continue;
		let url;
		try {
			url = new URL(value);
		} catch {
			return {
				ok: false,
				error: `urlAllowlist entry "${value}" is not a valid URL`
			};
		}
		if (url.protocol !== "https:" && url.protocol !== "http:") return {
			ok: false,
			error: `urlAllowlist entry "${value}" must use http or https`
		};
		if (!origins.includes(url.origin)) origins.push(url.origin);
	}
	return {
		ok: true,
		origins
	};
}
/** Extract the key from `/:key` or `/:key/test` after the `/secrets` prefix strip. */
function extractKeyFromEvent(event, opts = {}) {
	const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
	if (!pathname) return null;
	const parts = pathname.split("/");
	if (opts.suffix === "/test") {
		if (parts.length < 2 || parts[parts.length - 1] !== "test") return null;
		return parts[0];
	}
	return parts[0];
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/notifications/channels.js
/**
* Built-in notification channels.
*
* Set environment variables to auto-register the webhook channel at startup.
* Extra channels can be registered at any time via
* `registerNotificationChannel()` from a server plugin.
*
* NOTIFICATIONS_WEBHOOK_URL  → POST notifications as JSON to this URL.
*                              Supports `${keys.NAME}` substitution — the raw
*                              value never enters the agent context.
* NOTIFICATIONS_WEBHOOK_AUTH → optional `Authorization` header value (also
*                              supports `${keys.NAME}`).
*/
var _registered = false;
function registerBuiltinNotificationChannels() {
	if (_registered) return;
	_registered = true;
	const url = process.env.NOTIFICATIONS_WEBHOOK_URL;
	if (url) registerNotificationChannel(createWebhookChannel(url));
}
function createWebhookChannel(urlTemplate) {
	const authTemplate = process.env.NOTIFICATIONS_WEBHOOK_AUTH;
	return {
		name: "webhook",
		async deliver(input, meta) {
			const { resolved: url } = await resolveKeyReferences(urlTemplate, "user", meta.owner);
			const headers = { "Content-Type": "application/json" };
			if (authTemplate) {
				const { resolved: auth } = await resolveKeyReferences(authTemplate, "user", meta.owner);
				headers.Authorization = auth;
			}
			const keyNames = Array.from(new Set(Array.from(urlTemplate.matchAll(/\$\{keys\.([A-Za-z0-9_-]+)\}/g), (m) => m[1])));
			const allowlists = await Promise.all(keyNames.map((name) => getKeyAllowlist(name, "user", meta.owner)));
			keyNames.forEach((name, i) => {
				if (!validateUrlAllowlist(url, allowlists[i])) throw new Error(`[notifications] webhook URL ${new URL(url).origin} is not in the allowlist for key "${name}"`);
			});
			const res = await fetch(url, {
				method: "POST",
				headers,
				body: JSON.stringify({
					severity: input.severity,
					title: input.title,
					body: input.body,
					metadata: input.metadata,
					owner: meta.owner,
					emittedAt: (/* @__PURE__ */ new Date()).toISOString()
				})
			});
			if (!res.ok) throw new Error(`[notifications] webhook ${new URL(url).origin} returned ${res.status}${await readErrorSnippet(res) || ""}`);
		}
	};
}
/**
* Read up to ~1 KB from the body for error context. Streams chunks so a
* misbehaving endpoint returning a large error page doesn't pin that whole
* payload in memory per failed webhook.
*/
async function readErrorSnippet(res) {
	const reader = res.body?.getReader();
	if (!reader) return "";
	const decoder = new TextDecoder();
	const MAX = 1024;
	let buf = "";
	try {
		while (buf.length < MAX) {
			const { value, done } = await reader.read();
			if (done) break;
			buf += decoder.decode(value, { stream: true });
		}
		reader.cancel().catch(() => {});
	} catch {
		return "";
	}
	if (!buf) return "";
	return `: ${buf.slice(0, 200)}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/notifications/routes.js
/**
* H3 event handlers for the notifications inbox.
*
* Mounted under `/_agent-native/notifications/*` by `core-routes-plugin`.
*
*   GET  /_agent-native/notifications?unread=true&limit=50&before=ISO
*                                                   — list for the session owner
*   GET  /_agent-native/notifications/count         — unread count
*   POST /_agent-native/notifications/:id/read      — mark as read
*   POST /_agent-native/notifications/read-all      — mark all read
*   DELETE /_agent-native/notifications/:id         — delete
*/
function parseLimit$1(value, fallback = 50) {
	if (typeof value !== "string" || value.length === 0) return fallback;
	const n = Number(value);
	if (!Number.isFinite(n) || n <= 0) return fallback;
	return Math.min(Math.floor(n), 200);
}
async function resolveOwner$1(event) {
	const session = await getSession(event).catch(() => null);
	if (!session?.email) {
		const { createError } = await import("./node-DxyfkX8_.js").then((n) => n.t);
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthenticated"
		});
	}
	return session.email;
}
function createNotificationsHandler() {
	return defineEventHandler(async (event) => {
		const rawMethod = getMethod(event);
		const method = rawMethod === "HEAD" ? "GET" : rawMethod;
		if (rawMethod === "OPTIONS") {
			setResponseStatus(event, 204);
			return "";
		}
		const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
		const parts = pathname ? pathname.split("/") : [];
		const owner = await resolveOwner$1(event);
		if (method === "GET" && parts.length === 0) {
			const q = getQuery(event);
			return listNotifications(owner, {
				unreadOnly: q.unread === "true" || q.unread === "1",
				limit: parseLimit$1(q.limit),
				before: typeof q.before === "string" ? q.before : void 0
			});
		}
		if (method === "GET" && parts.length === 1 && parts[0] === "count") return { count: await countUnread(owner) };
		if (method === "POST" && parts.length === 1 && parts[0] === "read-all") return { updated: await markAllNotificationsRead(owner) };
		if (method === "POST" && parts.length === 2 && parts[1] === "read") {
			if (!await markNotificationRead(parts[0], owner)) {
				setResponseStatus(event, 404);
				return { error: "Not found or already read" };
			}
			return { ok: true };
		}
		if (method === "DELETE" && parts.length === 1) {
			if (!await deleteNotification(parts[0], owner)) {
				setResponseStatus(event, 404);
				return { error: "Not found" };
			}
			return { ok: true };
		}
		setResponseStatus(event, 404);
		return { error: "Not found" };
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/progress/routes.js
/**
* H3 event handlers for the agent-runs progress primitive.
*
* Mounted under `/_agent-native/runs/*` by `core-routes-plugin`.
*
*   GET    /_agent-native/runs?active=true&limit=50
*   GET    /_agent-native/runs/:id
*   DELETE /_agent-native/runs/:id
*
* Writes happen through the `manage-progress` agent tool, not HTTP —
* the agent is the canonical writer, the UI only reads. (We can add write
* routes later if a non-agent producer needs them.)
*/
function parseLimit(value, fallback = 50) {
	if (typeof value !== "string" || value.length === 0) return fallback;
	const n = Number(value);
	if (!Number.isFinite(n) || n <= 0) return fallback;
	return Math.min(Math.floor(n), 200);
}
async function resolveOwner(event) {
	const session = await getSession(event).catch(() => null);
	if (!session?.email) {
		const { createError } = await import("./node-DxyfkX8_.js").then((n) => n.t);
		throw createError({
			statusCode: 401,
			statusMessage: "Unauthenticated"
		});
	}
	return session.email;
}
function createProgressHandler() {
	return defineEventHandler(async (event) => {
		const rawMethod = getMethod(event);
		const method = rawMethod === "HEAD" ? "GET" : rawMethod;
		if (rawMethod === "OPTIONS") {
			setResponseStatus(event, 204);
			return "";
		}
		const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
		const parts = pathname ? pathname.split("/") : [];
		const owner = await resolveOwner(event);
		if (method === "GET" && parts.length === 0) {
			const q = getQuery(event);
			return listRuns(owner, {
				activeOnly: q.active === "true" || q.active === "1",
				limit: parseLimit(q.limit)
			});
		}
		if (method === "GET" && parts.length === 1) {
			const row = await getRun(parts[0], owner);
			if (!row) {
				setResponseStatus(event, 404);
				return { error: "Not found" };
			}
			return row;
		}
		if (method === "DELETE" && parts.length === 1) {
			if (!await deleteRun(parts[0], owner)) {
				setResponseStatus(event, 404);
				return { error: "Not found" };
			}
			return { ok: true };
		}
		setResponseStatus(event, 404);
		return { error: "Not found" };
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/credentials/index.js
var SETTING_PREFIX = "credential:";
/**
* Resolve a credential, scoped to the caller's user (and falling back to
* the active org's shared credential, if any).
*
* SECURITY: NEVER reads from process.env. Env vars are global to the
* deployment and would leak across users in a multi-tenant app. The only
* sources are per-user / per-org rows in the SQL `settings` table.
*
* Storage keys (priority order):
*   1. u:<email>:credential:<KEY>   — per-user override
*   2. o:<orgId>:credential:<KEY>   — per-org shared credential (if orgId given)
*/
async function resolveCredential(key, ctx) {
	if (!ctx?.userEmail) return void 0;
	const userSetting = await getSetting(`u:${ctx.userEmail.toLowerCase()}:${SETTING_PREFIX}${key}`);
	if (userSetting && typeof userSetting.value === "string") return userSetting.value;
	if (ctx.orgId) {
		const orgSetting = await getSetting(`o:${ctx.orgId}:${SETTING_PREFIX}${key}`);
		if (orgSetting && typeof orgSetting.value === "string") return orgSetting.value;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/google-realtime-session.js
function isSameOriginRequest$1(event) {
	const host = getRequestHeader(event, "host");
	const origin = getRequestHeader(event, "origin");
	if (origin && host) try {
		const parsed = new URL(origin);
		if (parsed.host === host) return true;
		if (parsed.protocol === "tauri:" && parsed.hostname === "localhost") return true;
		if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname === "tauri.localhost" && (host.startsWith("localhost:") || host.startsWith("127.0.0.1:"))) return true;
		if (parsed.protocol === "http:" && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") && parsed.port === "1420" && (host.startsWith("localhost:") || host.startsWith("127.0.0.1:"))) return true;
		return false;
	} catch {
		return false;
	}
	const fetchSite = getRequestHeader(event, "sec-fetch-site");
	if (fetchSite) return fetchSite === "same-origin" || fetchSite === "none";
	return true;
}
async function resolveGoogleRealtimeCredentials(opts) {
	const secretRefs = [];
	if (opts.userEmail) {
		secretRefs.push({
			scope: "user",
			scopeId: opts.userEmail
		});
		if (opts.orgId) secretRefs.push({
			scope: "org",
			scopeId: opts.orgId
		}, {
			scope: "workspace",
			scopeId: opts.orgId
		});
		else secretRefs.push({
			scope: "workspace",
			scopeId: `solo:${opts.userEmail}`
		});
	}
	for (const ref of secretRefs) {
		const fromSecret = (await readAppSecret({
			key: "GOOGLE_APPLICATION_CREDENTIALS",
			scope: ref.scope,
			scopeId: ref.scopeId
		}).catch(() => null))?.value?.trim();
		if (fromSecret) return fromSecret;
	}
	const fromSettings = (await resolveCredential("GOOGLE_APPLICATION_CREDENTIALS", {
		userEmail: opts.userEmail ?? void 0,
		orgId: opts.orgId ?? void 0
	}).catch(() => void 0))?.trim();
	if (fromSettings) return fromSettings;
	const envValue = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
	if (!envValue) return null;
	if (envValue.startsWith("{")) return envValue;
	try {
		return (await readFile(envValue, "utf8")).trim() || null;
	} catch {
		throw new Error("GOOGLE_APPLICATION_CREDENTIALS points to a file path the framework server could not read");
	}
}
function createGoogleRealtimeSessionHandler() {
	return defineEventHandler(async (event) => {
		if (getMethod(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		if (!isSameOriginRequest$1(event)) {
			setResponseStatus(event, 403);
			return { error: "Cross-origin request rejected" };
		}
		const session = await getSession(event).catch(() => null);
		if (!session?.email) {
			setResponseStatus(event, 401);
			return { error: "Authentication required" };
		}
		const orgCtx = await getOrgContext(event).catch(() => null);
		return runWithRequestContext({
			userEmail: session.email,
			orgId: orgCtx?.orgId ?? void 0
		}, async () => {
			const googleApplicationCredentials = await resolveGoogleRealtimeCredentials({
				userEmail: session.email,
				orgId: orgCtx?.orgId ?? void 0
			});
			if (!googleApplicationCredentials) {
				setResponseStatus(event, 400);
				return { error: "Configure GOOGLE_APPLICATION_CREDENTIALS in Settings to use Google realtime transcription." };
			}
			const builderCreds = await resolveBuilderCredentials();
			if (!builderCreds.privateKey || !builderCreds.publicKey) {
				setResponseStatus(event, 400);
				return { error: "Builder must be connected to mint a managed realtime transcription session." };
			}
			const apiHost = process.env.BUILDER_API_HOST || "https://ai-services.builder.io";
			const body = await readBody(event).catch(() => ({})) || {};
			const res = await fetch(`${apiHost}/agent-native/transcribe-stream/session`, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${builderCreds.privateKey}`,
					"x-builder-api-key": builderCreds.publicKey,
					...builderCreds.userId ? { "x-builder-user-id": builderCreds.userId } : {}
				},
				body: JSON.stringify({
					googleApplicationCredentials,
					language: typeof body?.language === "string" ? body.language.trim() : void 0
				})
			}).catch((err) => {
				throw new Error(err?.message || "Failed to reach realtime transcription service");
			});
			if (!res.ok) {
				const errorBody = await res.json().catch(() => ({ error: `HTTP ${res.status}` }));
				setResponseStatus(event, res.status);
				return { error: typeof errorBody?.error === "string" ? errorBody.error : `Realtime session failed (${res.status})` };
			}
			const payload = await res.json();
			if (!payload?.websocketUrl) {
				setResponseStatus(event, 502);
				return { error: "Realtime transcription service did not return a websocket URL." };
			}
			return payload;
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/transcription/builder-transcription.js
function describeError(err) {
	if (!(err instanceof Error)) return String(err);
	const cause = err.cause;
	const causeText = cause ? `; cause: ${describeError(cause)}` : "";
	return `${err.name}: ${err.message}${causeText}`;
}
async function transcribeWithBuilder(opts) {
	const authHeader = await resolveBuilderAuthHeader();
	if (!authHeader) throw new Error("Builder private key not configured. Connect your Builder.io account in Settings.");
	const params = new URLSearchParams();
	params.set("mimeType", opts.mimeType);
	if (opts.model) params.set("model", opts.model);
	if (opts.diarize != null) params.set("diarize", String(opts.diarize));
	if (opts.minSpeakers != null) params.set("minSpeakers", String(opts.minSpeakers));
	if (opts.maxSpeakers != null) params.set("maxSpeakers", String(opts.maxSpeakers));
	if (opts.language) params.set("language", opts.language);
	if (opts.instructions) params.set("instructions", opts.instructions);
	const url = `${getBuilderProxyOrigin()}/agent-native/transcribe-audio?${params.toString()}`;
	const body = opts.audioBytes.buffer.slice(opts.audioBytes.byteOffset, opts.audioBytes.byteOffset + opts.audioBytes.byteLength);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 45e3);
	let res;
	try {
		res = await fetch(url, {
			method: "POST",
			headers: {
				Authorization: authHeader,
				"Content-Type": "application/octet-stream"
			},
			body,
			signal: controller.signal
		});
	} catch (err) {
		if (err?.name === "AbortError") throw new Error("Builder transcription timed out after 45 seconds.");
		throw new Error(`Builder transcription request failed before response: ${describeError(err)}`, { cause: err });
	} finally {
		clearTimeout(timeout);
	}
	if (res.status === 402) throw new Error("Builder transcription credits exhausted. Upgrade your Builder.io plan or configure another supported fallback.");
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(`Builder transcription failed (${res.status} ${res.statusText}): ${text}`);
	}
	return await res.json();
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/transcribe-voice.js
/**
* POST /_agent-native/transcribe-voice
*
* Receives an audio blob from the agent sidebar composer and forwards it to
* the configured transcription provider. Returns `{ text }` on success,
* `{ error }` on failure.
*
* Key resolution order for BYOK providers:
*   1. Request-scoped encrypted secret (`app_secrets`: user, org, workspace).
*   2. Env var fallback only outside authenticated request contexts.
*
* If no server provider is configured, returns 400 with an error the
* composer UI can surface (the client falls back to Web Speech when possible).
*
* This is a framework route rather than a `defineAction` because multipart
* audio bodies aren't a clean fit for the action contract (actions are
* typed JSON-in / JSON-out).
*/
var WHISPER_URL = "https://api.openai.com/v1/audio/transcriptions";
var GROQ_URL = "https://api.groq.com/openai/v1/audio/transcriptions";
var GROQ_CHAT_URL = "https://api.groq.com/openai/v1/chat/completions";
var GROQ_MODEL = "whisper-large-v3-turbo";
var GROQ_CLEANUP_MODEL = "llama-3.3-70b-versatile";
var OPENAI_MODEL = "whisper-1";
var OPENAI_CHAT_URL = "https://api.openai.com/v1/chat/completions";
var OPENAI_CLEANUP_MODEL = "gpt-5.4-mini";
var MAX_AUDIO_BYTES = 25 * 1024 * 1024;
var MAX_TRANSCRIPT_CHARS = 4e4;
var BUILDER_GEMINI_TRANSCRIPTION_MODEL = "gemini-3-1-flash-lite";
var GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent`;
/**
* Reject cross-site POSTs. Cookies are `SameSite=None; Secure` over HTTPS so
* the browser would otherwise attach the session to a forged form submission
* from evil.com, causing us to spend OpenAI credits on the user's behalf.
* Same-origin browsers always send `Origin` on POST; if it's missing we fall
* back to `Sec-Fetch-Site` so Safari's fetch-spec behavior still works.
*/
function isSameOriginRequest(event) {
	const host = getRequestHeader(event, "host");
	const origin = getRequestHeader(event, "origin");
	if (origin && host) try {
		const parsed = new URL(origin);
		if (parsed.host === host) return true;
		if (parsed.protocol === "tauri:" && parsed.hostname === "localhost") return true;
		if ((parsed.protocol === "http:" || parsed.protocol === "https:") && parsed.hostname === "tauri.localhost" && (host.startsWith("localhost:") || host.startsWith("127.0.0.1:"))) return true;
		if (parsed.protocol === "http:" && (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1") && parsed.port === "1420" && (host.startsWith("localhost:") || host.startsWith("127.0.0.1:"))) return true;
		return false;
	} catch {
		return false;
	}
	const fetchSite = getRequestHeader(event, "sec-fetch-site");
	if (fetchSite) return fetchSite === "same-origin" || fetchSite === "none";
	return true;
}
function createTranscribeVoiceHandler() {
	return defineEventHandler(async (event) => {
		if (getMethod(event) !== "POST") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		if (!isSameOriginRequest(event)) {
			setResponseStatus(event, 403);
			return { error: "Cross-origin request rejected" };
		}
		const parts = await readMultipartFormData(event).catch(() => null);
		const audio = parts?.find((p) => p.name === "audio");
		const textPart = parts?.find((p) => p.name === "text");
		const transcriptText = textPart?.data ? sanitizeTranscriptText(textPart.data.toString("utf8")) : void 0;
		if (!audio?.data?.length && !transcriptText) {
			setResponseStatus(event, 400);
			return { error: "Missing audio or transcript payload" };
		}
		if (audio?.data?.length && audio.data.length > MAX_AUDIO_BYTES) {
			setResponseStatus(event, 413);
			return { error: "Audio too large (max 25 MB)" };
		}
		const languagePart = parts?.find((p) => p.name === "language");
		const language = languagePart?.data ? languagePart.data.toString("utf8").trim().slice(0, 8) : void 0;
		const instructionsPart = parts?.find((p) => p.name === "instructions");
		const instructions = instructionsPart?.data ? sanitizeInstructions(instructionsPart.data.toString("utf8")) : void 0;
		const session = await getSession(event).catch(() => null);
		if (!session?.email && process.env.NODE_ENV === "production") {
			setResponseStatus(event, 401);
			return { error: "Authentication required" };
		}
		const orgCtx = session?.email ? await getOrgContext(event).catch(() => null) : null;
		const requestContext = {
			userEmail: session?.email,
			orgId: orgCtx?.orgId ?? void 0
		};
		const withRequestContext = async (fn) => requestContext.userEmail ? runWithRequestContext(requestContext, fn) : fn();
		const hasBuilderPrivateKey = async () => withRequestContext(() => resolveHasBuilderPrivateKey());
		const transcribeWithBuilderForRequest = (opts) => withRequestContext(() => transcribeWithBuilder(opts));
		const sessionId = session?.email ?? "local";
		let providerPref;
		const providerPart = parts?.find((p) => p.name === "provider");
		let providerExplicit = false;
		if (providerPart?.data) {
			const v = providerPart.data.toString("utf8").trim().toLowerCase();
			if (v === "auto" || v === "browser" || v === "builder" || v === "builder-gemini" || v === "gemini" || v === "openai" || v === "groq") {
				providerExplicit = true;
				providerPref = v === "auto" ? void 0 : v;
			}
		}
		if (!providerExplicit) try {
			const prefs = await appStateGet(sessionId, "voice-transcription-prefs");
			providerPref = prefs?.provider;
			providerPref ??= prefs?.value?.provider;
		} catch {}
		if (providerPref === "browser") {
			setResponseStatus(event, 400);
			return { error: "Voice provider is set to \"browser\" (Web Speech API only). Change the preference in Settings → Voice Transcription to use a server-side provider." };
		}
		async function resolveApiKey(key) {
			return await withRequestContext(() => resolveSecret(key)) ?? void 0;
		}
		if (transcriptText) return await cleanupTranscriptText({
			event,
			text: transcriptText,
			instructions,
			providerPref,
			hasBuilderPrivateKey,
			withRequestContext,
			resolveApiKey
		});
		if (!audio?.data?.length) {
			setResponseStatus(event, 400);
			return { error: "Missing audio payload" };
		}
		const mime = audio.type || "audio/webm";
		const audioBytes = new Uint8Array(audio.data.buffer, audio.data.byteOffset, audio.data.byteLength);
		let builderError = null;
		if (providerPref === "gemini") {
			const geminiKey = await resolveApiKey("GEMINI_API_KEY");
			if (!geminiKey) {
				setResponseStatus(event, 400);
				return { error: "Gemini is selected but GEMINI_API_KEY is not configured. Add it in Settings → API Keys, or change the provider preference." };
			}
			try {
				const trimmed = (await transcribeWithGemini({
					audioBytes,
					mimeType: mime,
					apiKey: geminiKey,
					language: language || void 0,
					instructions
				})).trim();
				if (!trimmed) {
					setResponseStatus(event, 502);
					return { error: "Gemini returned an empty transcript." };
				}
				return { text: trimmed };
			} catch (err) {
				setResponseStatus(event, 502);
				return { error: `Gemini transcription failed: ${err?.message ?? String(err)}` };
			}
		}
		if (providerPref === "builder" || providerPref === "builder-gemini") {
			const label = providerPref === "builder-gemini" ? "Builder Gemini Flash-Lite" : "Builder";
			if (!await hasBuilderPrivateKey()) {
				setResponseStatus(event, 400);
				return { error: `${label} is selected but Builder.io is not connected. Connect Builder.io in Settings, or change the provider preference.` };
			}
			try {
				return { text: ((await transcribeWithBuilderForRequest({
					audioBytes,
					mimeType: mime,
					model: providerPref === "builder-gemini" ? BUILDER_GEMINI_TRANSCRIPTION_MODEL : void 0,
					language: language || void 0,
					instructions
				})).text ?? "").trim() };
			} catch (err) {
				const message = err?.message ?? String(err);
				if (message.includes("credits exhausted")) {
					setResponseStatus(event, 402);
					return { error: message };
				}
				setResponseStatus(event, 502);
				return { error: `${label} transcription failed: ${message}` };
			}
		}
		if (providerPref === "groq") {
			const groqKey = await resolveApiKey("GROQ_API_KEY");
			if (!groqKey) {
				setResponseStatus(event, 400);
				return { error: "Groq is selected but GROQ_API_KEY is not configured. Add it in Settings → API Keys, or change the provider preference." };
			}
			return await callWhisperCompat({
				event,
				provider: {
					name: "groq",
					endpoint: GROQ_URL,
					model: GROQ_MODEL,
					apiKey: groqKey
				},
				audioBytes,
				mime,
				language,
				instructions
			});
		}
		if (providerPref !== "openai" && await hasBuilderPrivateKey()) try {
			return { text: ((await transcribeWithBuilderForRequest({
				audioBytes,
				mimeType: mime,
				model: BUILDER_GEMINI_TRANSCRIPTION_MODEL,
				language: language || void 0,
				instructions
			})).text ?? "").trim() };
		} catch (err) {
			const message = err?.message ?? String(err);
			if (message.includes("credits exhausted")) {
				setResponseStatus(event, 402);
				return { error: message };
			}
			builderError = message;
		}
		if (providerPref !== "openai") {
			const geminiKey = await resolveApiKey("GEMINI_API_KEY");
			if (geminiKey) try {
				const trimmed = (await transcribeWithGemini({
					audioBytes,
					mimeType: mime,
					apiKey: geminiKey,
					language: language || void 0,
					instructions
				})).trim();
				if (trimmed) {
					console.log(`[transcribe-voice] Gemini → ${trimmed.length} chars`);
					return { text: trimmed };
				}
				console.warn("[transcribe-voice] Gemini returned empty text — falling through to next provider");
			} catch (err) {
				console.warn("[transcribe-voice] Gemini path failed, falling through:", err?.message ?? err);
			}
		}
		let provider = null;
		if (providerPref !== "openai") {
			const groqKey = await resolveApiKey("GROQ_API_KEY");
			if (groqKey) provider = {
				name: "groq",
				endpoint: GROQ_URL,
				model: GROQ_MODEL,
				apiKey: groqKey
			};
		}
		if (!provider) {
			const openaiKey = await resolveApiKey("OPENAI_API_KEY");
			if (openaiKey) provider = {
				name: "openai",
				endpoint: WHISPER_URL,
				model: OPENAI_MODEL,
				apiKey: openaiKey
			};
		}
		if (!provider) {
			setResponseStatus(event, builderError ? 502 : 400);
			return { error: builderError ? `Builder transcription failed: ${builderError}. Add GEMINI_API_KEY, GROQ_API_KEY, or OPENAI_API_KEY in Settings → API Keys to enable a fallback provider.` : "No voice transcription provider configured. Connect Builder.io or add GEMINI_API_KEY / GROQ_API_KEY / OPENAI_API_KEY in Settings → API Keys." };
		}
		return await callWhisperCompat({
			event,
			provider,
			audioBytes,
			mime,
			language,
			instructions
		});
	});
}
/**
* Posts the audio to a Whisper-compatible OpenAI-style endpoint (Groq or
* OpenAI itself) and returns `{ text }` / `{ error }` shaped like the
* other branches in `createTranscribeVoiceHandler`. Hoisted so the
* strict-Groq preference path and the auto fallback chain share one
* implementation.
*/
async function callWhisperCompat({ event, provider, audioBytes, mime, language, instructions }) {
	const filename = `composer-voice.${pickExtension(mime)}`;
	const form = new FormData();
	form.append("file", new Blob([audioBytes], { type: mime }), filename);
	form.append("model", provider.model);
	form.append("response_format", "json");
	if (language) form.append("language", language);
	if (instructions) form.append("prompt", instructions);
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 45e3);
	try {
		const res = await fetch(provider.endpoint, {
			method: "POST",
			headers: { Authorization: `Bearer ${provider.apiKey}` },
			body: form,
			signal: controller.signal
		});
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			setResponseStatus(event, res.status === 401 ? 401 : 502);
			return { error: res.status === 401 ? `${provider.name} rejected the API key. Update it in Settings → API Keys.` : `${provider.name} transcription error ${res.status}: ${text.slice(0, 300)}` };
		}
		return { text: ((await res.json()).text ?? "").trim() };
	} catch (err) {
		setResponseStatus(event, 502);
		return { error: err?.name === "AbortError" ? `${provider.name} transcription timed out after 45 seconds.` : `Could not reach ${provider.name}: ${err?.message ?? err}` };
	} finally {
		clearTimeout(timeout);
	}
}
async function cleanupTranscriptText({ event, text, instructions, providerPref, hasBuilderPrivateKey, withRequestContext, resolveApiKey }) {
	const original = text.trim();
	if (!original) return { text: "" };
	if (providerPref === "browser") return { text: original };
	if (providerPref === "builder" || providerPref === "builder-gemini") {
		if (!await hasBuilderPrivateKey()) {
			setResponseStatus(event, 400);
			return { error: "Builder.io cleanup is selected but Builder.io is not connected. Connect Builder.io in Settings, or change the provider preference." };
		}
		try {
			return { text: await withRequestContext(() => cleanupWithBuilder({
				text: original,
				instructions
			})) || original };
		} catch (err) {
			setResponseStatus(event, 502);
			return { error: `Builder.io cleanup failed: ${err?.message ?? String(err)}` };
		}
	}
	if (providerPref === "gemini") {
		const geminiKey = await resolveApiKey("GEMINI_API_KEY");
		if (!geminiKey) {
			setResponseStatus(event, 400);
			return { error: "Gemini cleanup is selected but GEMINI_API_KEY is not configured." };
		}
		try {
			return { text: await cleanupWithGemini({
				text: original,
				apiKey: geminiKey,
				instructions
			}) || original };
		} catch (err) {
			setResponseStatus(event, 502);
			return { error: `Gemini cleanup failed: ${err?.message ?? String(err)}` };
		}
	}
	if (providerPref === "openai" || providerPref === "groq") {
		const keyName = providerPref === "openai" ? "OPENAI_API_KEY" : "GROQ_API_KEY";
		const apiKey = await resolveApiKey(keyName);
		if (!apiKey) {
			setResponseStatus(event, 400);
			return { error: `${providerPref} cleanup is selected but ${keyName} is not configured.` };
		}
		try {
			return { text: await cleanupWithChatProvider({
				provider: providerPref,
				text: original,
				apiKey,
				instructions
			}) || original };
		} catch (err) {
			setResponseStatus(event, 502);
			return { error: `${providerPref} cleanup failed: ${err?.message ?? String(err)}` };
		}
	}
	if (await hasBuilderPrivateKey()) try {
		const cleaned = await withRequestContext(() => cleanupWithBuilder({
			text: original,
			instructions
		}));
		if (cleaned) return { text: cleaned };
	} catch {}
	const geminiKey = await resolveApiKey("GEMINI_API_KEY");
	if (geminiKey) try {
		const cleaned = await cleanupWithGemini({
			text: original,
			apiKey: geminiKey,
			instructions
		});
		if (cleaned) return { text: cleaned };
	} catch {}
	const groqKey = await resolveApiKey("GROQ_API_KEY");
	if (groqKey) try {
		const cleaned = await cleanupWithChatProvider({
			provider: "groq",
			text: original,
			apiKey: groqKey,
			instructions
		});
		if (cleaned) return { text: cleaned };
	} catch {}
	const openaiKey = await resolveApiKey("OPENAI_API_KEY");
	if (openaiKey) try {
		const cleaned = await cleanupWithChatProvider({
			provider: "openai",
			text: original,
			apiKey: openaiKey,
			instructions
		});
		if (cleaned) return { text: cleaned };
	} catch {}
	return { text: original };
}
async function cleanupWithBuilder({ text, instructions }) {
	const engine = createBuilderEngine();
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8e3);
	let streamedText = "";
	let finalText = "";
	let terminalError;
	try {
		for await (const event of engine.stream({
			model: BUILDER_GEMINI_TRANSCRIPTION_MODEL,
			systemPrompt: buildCleanupSystemPrompt(instructions),
			messages: [{
				role: "user",
				content: [{
					type: "text",
					text: buildCleanupUserPrompt(text)
				}]
			}],
			tools: [],
			abortSignal: controller.signal,
			maxOutputTokens: Math.min(4096, Math.max(512, text.length * 2)),
			temperature: 0
		})) {
			if (event.type === "text-delta") streamedText += event.text;
			if (event.type === "assistant-content") finalText = event.parts.filter((part) => part.type === "text").map((part) => part.text).join("").trim();
			if (event.type === "stop" && event.reason === "error") terminalError = event.error ?? "Builder gateway returned an error";
		}
	} finally {
		clearTimeout(timeout);
	}
	if (terminalError) throw new Error(terminalError);
	return stripTranscriptEnvelope(finalText || streamedText);
}
async function cleanupWithGemini({ text, apiKey, instructions }) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8e3);
	try {
		const res = await fetch(GEMINI_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey
			},
			body: JSON.stringify({
				contents: [{ parts: [{ text: buildCleanupSystemPrompt(instructions) }, { text: buildCleanupUserPrompt(text) }] }],
				generationConfig: { temperature: 0 }
			}),
			signal: controller.signal
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			throw new Error(`Gemini ${res.status}: ${body.slice(0, 300)}`);
		}
		const cleaned = (await res.json()).candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim();
		return stripTranscriptEnvelope(cleaned ?? "");
	} finally {
		clearTimeout(timeout);
	}
}
async function cleanupWithChatProvider({ provider, text, apiKey, instructions }) {
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 8e3);
	const endpoint = provider === "openai" ? OPENAI_CHAT_URL : GROQ_CHAT_URL;
	const model = provider === "openai" ? OPENAI_CLEANUP_MODEL : GROQ_CLEANUP_MODEL;
	try {
		const res = await fetch(endpoint, {
			method: "POST",
			headers: {
				Authorization: `Bearer ${apiKey}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				model,
				messages: [{
					role: "system",
					content: buildCleanupSystemPrompt(instructions)
				}, {
					role: "user",
					content: buildCleanupUserPrompt(text)
				}],
				temperature: 0
			}),
			signal: controller.signal
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			throw new Error(`${provider} ${res.status}: ${body.slice(0, 300)}`);
		}
		return stripTranscriptEnvelope((await res.json()).choices?.[0]?.message?.content?.trim() ?? "");
	} finally {
		clearTimeout(timeout);
	}
}
function pickExtension(mime) {
	const lower = mime.toLowerCase();
	if (lower.includes("mp4") || lower.includes("m4a")) return "mp4";
	if (lower.includes("mpeg") || lower.includes("mp3")) return "mp3";
	if (lower.includes("ogg")) return "ogg";
	if (lower.includes("wav")) return "wav";
	return "webm";
}
function sanitizeInstructions(value) {
	const trimmed = value.replace(/\0/g, "").trim();
	if (!trimmed) return void 0;
	return trimmed.slice(0, 3e3);
}
function sanitizeTranscriptText(value) {
	const trimmed = value.replace(/\0/g, "").trim();
	if (!trimmed) return void 0;
	return trimmed.slice(0, MAX_TRANSCRIPT_CHARS);
}
function buildCleanupSystemPrompt(instructions) {
	return `You clean up live speech-recognition transcripts before paste.

Rules:
- Preserve the speaker's meaning and voice.
- Fix obvious recognition mistakes, punctuation, capitalization, spacing, and casing.
- Remove false starts and filler only when they are clearly not intentional.
- Do not add facts, explanations, headings, bullets, quotes, or markdown.
- Output only the cleaned transcript text.${instructions ? `\n\nUser's custom cleanup instructions:\n${instructions}` : ""}`;
}
function buildCleanupUserPrompt(text) {
	return `Clean up this transcript and return only the final text:\n\n<transcript>\n${text}\n</transcript>`;
}
function stripTranscriptEnvelope(value) {
	return value.trim().replace(/^```(?:text)?\s*/i, "").replace(/\s*```$/i, "").replace(/^["“](.*)["”]$/s, "$1").trim();
}
function buildGeminiTranscriptionPrompt({ language, instructions }) {
	return `${language ? `Transcribe the speech in this audio (language: ${language}).` : "Transcribe the speech in this audio."} Output only the transcript text — no preamble, no quotes, no formatting.${instructions ? `\n\nAdditional user instructions for transcription cleanup:\n${instructions}\n\nApply these only to formatting, casing, punctuation, vocabulary, and cleanup. Do not add content that is not present in the audio.` : ""}`;
}
/**
* Transcribe audio via Gemini Flash Lite.
*
* Gemini accepts the audio inline as base64 alongside a text prompt; we
* ask for just the transcript with no preamble. 30s timeout — Gemini is
* fast and we'd rather fall through to Whisper than wait longer.
*
* Gemini's documented audio formats are WAV / MP3 / AIFF / AAC / OGG /
* FLAC — webm/opus is not officially supported but in practice it
* accepts webm too. If Gemini rejects it the caller falls through.
*/
async function transcribeWithGemini({ audioBytes, mimeType, apiKey, language, instructions }) {
	const base64 = uint8ArrayToBase64(audioBytes);
	const prompt = buildGeminiTranscriptionPrompt({
		language,
		instructions
	});
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 3e4);
	try {
		const res = await fetch(GEMINI_URL, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"x-goog-api-key": apiKey
			},
			body: JSON.stringify({
				contents: [{ parts: [{ text: prompt }, { inlineData: {
					mimeType: normalizeAudioMimeForGemini(mimeType),
					data: base64
				} }] }],
				generationConfig: { temperature: 0 }
			}),
			signal: controller.signal
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			throw new Error(`Gemini ${res.status}: ${body.slice(0, 300)}`);
		}
		return (await res.json()).candidates?.[0]?.content?.parts?.map((p) => p.text ?? "").join("").trim() ?? "";
	} finally {
		clearTimeout(timeout);
	}
}
function normalizeAudioMimeForGemini(mime) {
	const lower = mime.toLowerCase().split(";")[0].trim();
	if (!lower) return "audio/webm";
	return lower;
}
function uint8ArrayToBase64(bytes) {
	if (typeof Buffer !== "undefined") return Buffer.from(bytes).toString("base64");
	let binary = "";
	const chunk = 32768;
	for (let i = 0; i < bytes.length; i += chunk) binary += String.fromCharCode(...bytes.subarray(i, Math.min(i + chunk, bytes.length)));
	return btoa(binary);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/voice-providers-status.js
/**
* GET /_agent-native/voice-providers/status
*
* Reports which voice transcription providers are configured for the
* current user. The desktop Settings UI uses this to show "Connect" vs
* "Connected" status pills next to each provider option.
*
* Resolution mirrors `transcribe-voice.ts`: we read request-scoped encrypted
* secrets (user, org, workspace), with env fallback only outside authenticated
* request contexts. Each lookup is wrapped in try/catch — one provider's
* failure must never break the whole response.
*
* Returns booleans only — never the actual key material.
*/
function createVoiceProvidersStatusHandler() {
	return defineEventHandler(async (event) => {
		if (getMethod(event) !== "GET") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const session = await getSession(event).catch(() => null);
		const orgCtx = session?.email ? await getOrgContext(event).catch(() => null) : null;
		const requestContext = {
			userEmail: session?.email,
			orgId: orgCtx?.orgId ?? void 0
		};
		const withRequestContext = async (fn) => requestContext.userEmail ? runWithRequestContext(requestContext, fn) : fn();
		async function hasKey(key) {
			try {
				if (key === "GOOGLE_APPLICATION_CREDENTIALS") {
					const resolved = await resolveGoogleRealtimeCredentials({
						userEmail: session?.email,
						orgId: orgCtx?.orgId ?? void 0
					});
					return typeof resolved === "string" && resolved.length > 0;
				}
				const resolved = await withRequestContext(() => resolveSecret(key));
				return typeof resolved === "string" && resolved.length > 0;
			} catch {
				return false;
			}
		}
		let builder = false;
		try {
			builder = await withRequestContext(() => resolveHasBuilderPrivateKey()) === true;
		} catch {
			builder = false;
		}
		const [gemini, openai, groq, googleRealtime] = await Promise.all([
			hasKey("GEMINI_API_KEY"),
			hasKey("OPENAI_API_KEY"),
			hasKey("GROQ_API_KEY"),
			hasKey("GOOGLE_APPLICATION_CREDENTIALS")
		]);
		return {
			builder,
			gemini,
			openai,
			groq,
			googleRealtime,
			browser: true,
			native: true
		};
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/core-routes-plugin.js
/**
* The base path prefix for all framework-level routes.
* All agent-native core routes live under this namespace to avoid
* collisions with template-specific `/api/*` routes.
*/
var FRAMEWORK_ROUTE_PREFIX = "/_agent-native";
registerBuiltinEngines();
var PROVIDER_ENV_VAR_KEYS = new Set(Object.values(PROVIDER_ENV_META).map(({ envVar }) => envVar));
async function detectUsageEngineName(event, userEmail) {
	try {
		const stored = await getSetting("agent-engine");
		if (isAgentEngineSettingConfigured(stored)) return stored.engine;
		let orgId;
		if (userEmail) try {
			orgId = (await getOrgContext(event)).orgId ?? void 0;
		} catch {}
		const detectedFromUser = await runWithRequestContext({
			userEmail,
			orgId
		}, () => detectEngineFromUserSecrets());
		if (detectedFromUser?.name === "builder") return detectedFromUser.name;
		if (stored && typeof stored.engine === "string") {
			const entry = getAgentEngineEntry(stored.engine);
			if (entry && await runWithRequestContext({
				userEmail,
				orgId
			}, () => isStoredEngineUsableForRequest(stored, entry))) return stored.engine;
		}
		if (detectedFromUser) return detectedFromUser.name;
		return await runWithRequestContext({
			userEmail,
			orgId
		}, () => canUseDeployCredentialFallbackForRequest()) ? detectEngineFromEnv()?.name ?? null : null;
	} catch {
		return null;
	}
}
function trackBuilderLifecycle(name, userEmail, properties = {}) {
	if (!userEmail) return;
	track(name, {
		feature: "builder",
		...properties
	}, { userId: userEmail });
}
function normalizeAppBasePath(value) {
	if (!value || value === "/") return "";
	const trimmed = value.trim();
	if (!trimmed || trimmed === "/") return "";
	return `/${trimmed.replace(/^\/+/, "").replace(/\/+$/, "")}`;
}
function stripAppBasePath(pathname) {
	const basePath = normalizeAppBasePath(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH);
	if (!basePath) return pathname;
	if (pathname === basePath) return "/";
	if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || "/";
	return pathname;
}
/**
* Resolves the page-level legacy `/tools` → `/extensions` redirect target.
*
* Returns the absolute path (with optional query string) to redirect to,
* or `null` if the request should fall through to the SPA / next handler.
*
* Skips:
*   - Framework API namespace (`/_agent-native/tools/*` is handled separately
*     as a legacy alias and intentionally stays mounted as `tools`).
*   - Anything that isn't `/tools` or a `/tools/...` page navigation, after
*     the configured app base path is stripped off.
*
* Exported for tests; the runtime middleware below is a thin wrapper.
*/
function resolveLegacyToolsRedirect(rawPath, search) {
	if (rawPath === "/_agent-native" || rawPath.startsWith("/_agent-native/")) return null;
	const pathname = stripAppBasePath(rawPath);
	if (pathname !== "/tools" && !pathname.startsWith("/tools/")) return null;
	const suffix = pathname === "/tools" ? "" : pathname.slice(6);
	return `${normalizeAppBasePath(process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH)}/extensions${suffix}${search}`;
}
function redactValues(text, values) {
	let out = text;
	for (const value of values) if (value) out = out.split(value).join("[redacted]");
	return out;
}
/**
* Creates a Nitro plugin that mounts all standard agent-native framework routes.
*
* All routes are mounted under `/_agent-native/` to avoid collisions
* with template-specific routes.
*
* Routes:
*   GET    /_agent-native/poll                          — polling endpoint for change detection
*   GET    /_agent-native/events (or custom)            — SSE endpoint for real-time sync
*   GET    /_agent-native/ping                          — health check
*   GET    /_agent-native/env-status                    — env key configuration status (when envKeys provided)
*   POST   /_agent-native/env-vars                      — save env vars to .env (when envKeys provided)
*   GET    /_agent-native/application-state/:key        — read application state
*   PUT    /_agent-native/application-state/:key        — write application state
*   DELETE /_agent-native/application-state/:key        — delete application state
*   GET    /_agent-native/application-state/compose     — list compose drafts
*   DELETE /_agent-native/application-state/compose     — delete all compose drafts
*   GET    /_agent-native/application-state/compose/:id — get compose draft
*   PUT    /_agent-native/application-state/compose/:id — upsert compose draft
*   DELETE /_agent-native/application-state/compose/:id — delete compose draft
*/
function createCoreRoutesPlugin(options = {}) {
	return async (nitroApp) => {
		markDefaultPluginProvided(nitroApp, "core-routes");
		await awaitBootstrap(nitroApp);
		try {
			const persisted = await getSetting("persisted-env-vars");
			if (persisted) {
				const builderKeys = new Set(BUILDER_ENV_KEYS);
				const writesAllowed = isEnvVarWriteAllowed();
				let scrubbed = 0;
				for (const [k, v] of Object.entries(persisted)) {
					if (builderKeys.has(k)) {
						scrubbed++;
						continue;
					}
					if (writesAllowed && typeof v === "string" && !process.env[k]) process.env[k] = v;
				}
				if (scrubbed > 0) try {
					const cleaned = {};
					for (const [k, v] of Object.entries(persisted)) if (!builderKeys.has(k)) cleaned[k] = v;
					await putSetting("persisted-env-vars", cleaned);
					console.warn(`[core] Removed ${scrubbed} legacy BUILDER_* key(s) from persisted-env-vars (cross-tenant leak fix).`);
				} catch {}
			}
		} catch {}
		try {
			if (await getSetting("builder-disconnected")) for (const key of BUILDER_ENV_KEYS) delete process.env[key];
		} catch {}
		registerBuiltinProviders();
		registerBuiltinNotificationChannels();
		try {
			const { createObservabilityHandler } = await import("./routes-BVuTRK5U.js");
			const { ensureObservabilityTables } = await import("./store-Be0u8_dU.js");
			ensureObservabilityTables().catch(() => {});
			getH3App(nitroApp).use(`${FRAMEWORK_ROUTE_PREFIX}/observability`, createObservabilityHandler());
		} catch {}
		const P = FRAMEWORK_ROUTE_PREFIX;
		const { createSecurityHeadersMiddleware } = await import("./security-headers-CJoP551E.js");
		getH3App(nitroApp).use(createSecurityHeadersMiddleware());
		const allowlist = readCorsAllowedOrigins();
		getH3App(nitroApp).use(defineEventHandler((event) => {
			const pathname = stripAppBasePath(event.url?.pathname ?? String(event.node?.req?.url ?? event.path ?? "/").split("?")[0]);
			if (!pathname.startsWith(P) && !pathname.startsWith("/api/")) return;
			const origin = getHeader(event, "origin");
			const method = getMethod(event);
			const allowedOrigin = getAllowedCorsOrigin(origin, {
				allowedOrigins: allowlist,
				allowAnyOriginWhenNoAllowlist: false,
				allowLocalhostWhenNoAllowlist: true
			});
			if (method === "OPTIONS") {
				if (origin && !allowedOrigin) {
					setResponseStatus(event, 403);
					return "";
				}
				if (allowedOrigin) {
					setResponseHeader(event, "Access-Control-Allow-Origin", allowedOrigin);
					setResponseHeader(event, "Vary", "Origin");
					setResponseHeader(event, "Access-Control-Allow-Credentials", "true");
					setResponseHeader(event, "Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS");
					setResponseHeader(event, "Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,X-Request-Source,X-Agent-Native-CSRF");
				}
				setResponseStatus(event, 204);
				return "";
			}
			if (!allowedOrigin) return;
			setResponseHeader(event, "Access-Control-Allow-Origin", allowedOrigin);
			setResponseHeader(event, "Vary", "Origin");
			setResponseHeader(event, "Access-Control-Allow-Credentials", "true");
			setResponseHeader(event, "Access-Control-Allow-Methods", "GET,HEAD,POST,PUT,PATCH,DELETE,OPTIONS");
			setResponseHeader(event, "Access-Control-Allow-Headers", "Content-Type,Authorization,X-Requested-With,X-Request-Source,X-Agent-Native-CSRF");
		}));
		const { createCsrfMiddleware } = await import("./csrf-C7lHpPlR.js");
		getH3App(nitroApp).use(createCsrfMiddleware(P));
		getH3App(nitroApp).use(`${P}/poll`, createPollHandler());
		if (!options.disableSSE) {
			const sseRoute = options.sseRoute ?? `${P}/events`;
			getH3App(nitroApp).use(sseRoute, createPollEventsHandler());
		}
		if (!options.disablePing) getH3App(nitroApp).use(`${P}/ping`, defineEventHandler(() => ({ message: process.env.PING_MESSAGE ?? "pong" })));
		const resolveBuilderOwnerContext = async (event) => {
			const session = await getSession(event).catch(() => null);
			if (session?.email) return {
				email: session.email,
				session,
				anonymous: false
			};
			const anonymousOwner = await options.anonymousOwner?.(event);
			if (anonymousOwner) return {
				email: anonymousOwner,
				session: null,
				anonymous: true
			};
			return {
				email: void 0,
				session: null,
				anonymous: false
			};
		};
		getH3App(nitroApp).use(`${P}/builder/status`, defineEventHandler(async (event) => {
			const envStatus = getBuilderBrowserStatusForEvent(event);
			const ownerContext = await resolveBuilderOwnerContext(event);
			const userEmail = ownerContext.email;
			const withConnectToken = (status) => {
				if (!userEmail) return status;
				return {
					...status,
					connectUrl: appendBuilderConnectToken(status.connectUrl, userEmail)
				};
			};
			let orgId = null;
			if (!ownerContext.anonymous) try {
				const { getOrgContext } = await import("./context-CkdaPJE2.js");
				orgId = (await getOrgContext(event)).orgId ?? null;
			} catch {}
			return runWithRequestContext({
				userEmail,
				orgId
			}, async () => {
				const projectId = await resolveBuilderBranchProjectId();
				const requestStatus = {
					...envStatus,
					builderEnabled: !!projectId,
					branchProjectIdConfigured: !!projectId,
					branchProjectId: projectId || void 0
				};
				try {
					if (userEmail) {
						const errKey = `builder-connect-error:${userEmail}`;
						const errRow = await getSetting(errKey);
						if (errRow && typeof errRow.message === "string") {
							await deleteSetting(errKey).catch(() => {});
							return withConnectToken({
								...requestStatus,
								configured: false,
								privateKeyConfigured: false,
								publicKeyConfigured: false,
								userId: void 0,
								orgName: void 0,
								orgKind: void 0,
								connectError: {
									message: errRow.message,
									at: typeof errRow.at === "number" ? errRow.at : Date.now()
								}
							});
						}
					}
				} catch {}
				try {
					const { resolveBuilderCredentials, resolveBuilderCredentialSource } = await import("./credential-provider-CKFlFM2V.js");
					const [creds, credentialSource] = await Promise.all([resolveBuilderCredentials(), resolveBuilderCredentialSource()]);
					if (creds.privateKey) return withConnectToken({
						...requestStatus,
						configured: true,
						privateKeyConfigured: true,
						publicKeyConfigured: !!creds.publicKey,
						userId: creds.userId || envStatus.userId,
						orgName: creds.orgName || envStatus.orgName,
						orgKind: creds.orgKind || envStatus.orgKind,
						credentialSource: credentialSource ?? void 0
					});
				} catch {}
				try {
					if (await getSetting("builder-disconnected")) return withConnectToken({
						...requestStatus,
						configured: false,
						privateKeyConfigured: false,
						publicKeyConfigured: false,
						userId: void 0,
						orgName: void 0,
						orgKind: void 0
					});
				} catch {}
				return withConnectToken({
					...requestStatus,
					configured: false,
					privateKeyConfigured: false,
					publicKeyConfigured: false,
					userId: void 0,
					orgName: void 0,
					orgKind: void 0
				});
			});
		}));
		const BUILDER_CONNECT_PENDING_TTL_MS = 600 * 1e3;
		function isSameOriginConnect(event) {
			const fetchSite = getHeader(event, "sec-fetch-site");
			if (fetchSite === "same-origin" || fetchSite === "none") return true;
			if (fetchSite) return false;
			const expected = getOrigin(event).replace(/\/+$/, "");
			const origin = getHeader(event, "origin");
			if (origin) return origin.replace(/\/+$/, "") === expected;
			const referer = getHeader(event, "referer");
			if (referer) try {
				return new URL(referer).origin === expected;
			} catch {
				return false;
			}
			return true;
		}
		getH3App(nitroApp).use(`${P}/builder/connect`, defineEventHandler(async (event) => {
			const ownerEmail = (await resolveBuilderOwnerContext(event)).email;
			if (!ownerEmail) {
				setResponseStatus(event, 401);
				return { error: "Authentication required" };
			}
			const connectToken = new URL(`${event.url?.pathname || "/"}${event.url?.search || ""}`, getOrigin(event)).searchParams.get(BUILDER_CONNECT_PARAM);
			const hasValidConnectToken = verifyBuilderConnectToken(connectToken, ownerEmail);
			if (!isSameOriginConnect(event) && !hasValidConnectToken) {
				trackBuilderLifecycle("builder connect failed", ownerEmail, {
					reason: "cross_origin",
					stage: "connect",
					has_connect_token: Boolean(connectToken)
				});
				setResponseStatus(event, 403);
				return { error: "Cross-origin connect requests are not allowed" };
			}
			try {
				await deleteSetting(`builder-connect-error:${ownerEmail}`);
			} catch {}
			try {
				await putSetting(`builder-pending-connect:${ownerEmail}`, { expiresAt: Date.now() + BUILDER_CONNECT_PENDING_TTL_MS });
			} catch (err) {
				trackBuilderLifecycle("builder connect failed", ownerEmail, {
					reason: "pending_storage_unavailable",
					stage: "connect"
				});
				const msg = "Could not initiate Builder connect — storage unavailable. Try again.";
				console.error("[builder] Could not store pending-connect state:", err?.message ?? err);
				await putSetting(`builder-connect-error:${ownerEmail}`, {
					message: msg,
					at: Date.now()
				}).catch(() => {});
				setResponseStatus(event, 503);
				setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
				return createBuilderBrowserCallbackErrorPage(msg);
			}
			trackBuilderLifecycle("builder connect started", ownerEmail, { stage: "connect" });
			const cliAuthUrl = buildBuilderCliAuthUrl(getOrigin(event), null);
			setResponseStatus(event, 302);
			setResponseHeader(event, "Location", cliAuthUrl);
			return "";
		}));
		getH3App(nitroApp).use(`${P}/builder/run`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const body = await readBody$1(event).catch(() => ({}));
			const prompt = typeof body?.prompt === "string" ? body.prompt : "";
			if (!prompt.trim()) {
				setResponseStatus(event, 400);
				return { error: "prompt is required" };
			}
			const session = await getSession(event).catch(() => null);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "Authentication required" };
			}
			const userEmail = session.email;
			let orgId = null;
			try {
				orgId = (await getOrgContext(event)).orgId ?? null;
			} catch {}
			return runWithRequestContext({
				userEmail,
				orgId
			}, async () => {
				const projectId = await resolveBuilderBranchProjectId();
				if (!projectId) {
					setResponseStatus(event, 403);
					return { error: "Builder branch creation is not available for this organization yet." };
				}
				const { resolveBuilderCredential: resolveBuilderCred } = await import("./credential-provider-CKFlFM2V.js");
				const builderUserId = await resolveBuilderCred("BUILDER_USER_ID") || void 0;
				try {
					return await runBuilderAgent({
						prompt,
						projectId,
						branchName: typeof body?.branchName === "string" ? body.branchName : void 0,
						userEmail,
						userId: builderUserId
					});
				} catch (e) {
					setResponseStatus(event, 500);
					return { error: e instanceof Error ? e.message : "Builder run failed" };
				}
			});
		}));
		getH3App(nitroApp).use(`${P}/builder/branch-waitlist`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const session = await getSession(event).catch(() => null);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "Authentication required" };
			}
			trackBuilderLifecycle("builder branch waitlist joined", session.email, { stage: "waitlist" });
			return { ok: true };
		}));
		getH3App(nitroApp).use(`${P}/builder/callback`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const ownerContext = await resolveBuilderOwnerContext(event);
			const ownerEmail = ownerContext.email;
			if (!ownerEmail) {
				setResponseStatus(event, 401);
				return { error: "Authentication required" };
			}
			const requestUrl = new URL(`${event.url?.pathname || "/"}${event.url?.search || ""}`, getOrigin(event));
			let pendingValid = false;
			let pendingError = null;
			try {
				const pending = await getSetting(`builder-pending-connect:${ownerEmail}`);
				if (pending && typeof pending.expiresAt === "number" && Date.now() < pending.expiresAt) try {
					await deleteSetting(`builder-pending-connect:${ownerEmail}`);
					pendingValid = true;
				} catch (err) {
					pendingError = "Could not consume pending-connect token (storage error). Please retry.";
					console.error("[builder] deleteSetting failed for pending-connect — refusing to proceed (replay risk):", err?.message ?? err);
				}
			} catch {}
			if (pendingError) {
				trackBuilderLifecycle("builder connect failed", ownerEmail, {
					reason: "pending_consume_storage_error",
					stage: "callback"
				});
				await putSetting(`builder-connect-error:${ownerEmail}`, {
					message: pendingError,
					at: Date.now()
				}).catch(() => {});
				setResponseStatus(event, 503);
				setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
				return createBuilderBrowserCallbackErrorPage(pendingError);
			}
			if (!pendingValid) {
				trackBuilderLifecycle("builder connect failed", ownerEmail, {
					reason: "missing_pending_connect",
					stage: "callback"
				});
				const msg = "No active connect flow found. Restart the Builder connect flow from Settings.";
				try {
					await putSetting(`builder-connect-error:${ownerEmail}`, {
						message: msg,
						at: Date.now()
					});
				} catch {}
				setResponseStatus(event, 403);
				setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
				return createBuilderBrowserCallbackErrorPage(msg);
			}
			const privateKey = requestUrl.searchParams.get("p-key");
			const publicKey = requestUrl.searchParams.get("api-key");
			if (!privateKey || !publicKey) {
				trackBuilderLifecycle("builder connect failed", ownerEmail, {
					reason: "missing_credentials",
					stage: "callback"
				});
				const msg = "Builder didn't return credentials. Restart the connect flow from settings.";
				await putSetting(`builder-connect-error:${ownerEmail}`, {
					message: msg,
					at: Date.now()
				}).catch(() => {});
				setResponseStatus(event, 400);
				setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
				return createBuilderBrowserCallbackErrorPage(msg);
			}
			const userId = requestUrl.searchParams.get("user-id");
			const orgName = requestUrl.searchParams.get("org-name");
			const orgKind = requestUrl.searchParams.get("kind");
			let writeError = null;
			try {
				const { writeBuilderCredentials } = await import("./credential-provider-CKFlFM2V.js");
				let orgId = null;
				let role = null;
				if (!ownerContext.anonymous) try {
					const { getOrgContext } = await import("./context-CkdaPJE2.js");
					const orgCtx = await getOrgContext(event);
					orgId = orgCtx.orgId ?? null;
					role = orgCtx.role ?? null;
				} catch {}
				await writeBuilderCredentials(ownerEmail, {
					privateKey,
					publicKey,
					userId,
					orgName,
					orgKind
				}, {
					orgId,
					role
				});
			} catch (err) {
				writeError = err?.message ?? String(err);
				console.error("[builder] Failed to persist Builder credentials:", writeError);
			}
			if (writeError) {
				trackBuilderLifecycle("builder connect failed", ownerEmail, {
					reason: "credential_write_failed",
					stage: "callback"
				});
				try {
					await putSetting(`builder-connect-error:${ownerEmail}`, {
						message: writeError,
						at: Date.now()
					});
				} catch (settingsErr) {
					console.error("[builder] Couldn't even record connect-error to settings:", settingsErr?.message ?? settingsErr);
				}
				setResponseStatus(event, 500);
				setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
				return createBuilderBrowserCallbackErrorPage(writeError);
			}
			try {
				await deleteSetting("builder-disconnected");
			} catch {}
			try {
				await deleteSetting(`builder-connect-error:${ownerEmail}`);
			} catch {}
			const previewUrl = resolveSafePreviewUrl(requestUrl.searchParams.get("preview-url"), event);
			trackBuilderLifecycle("builder connect succeeded", ownerEmail, {
				stage: "callback",
				has_preview_url: Boolean(previewUrl),
				org_kind: orgKind || void 0
			});
			setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
			return createBuilderBrowserCallbackPage(previewUrl);
		}));
		getH3App(nitroApp).use(`${P}/builder/disconnect`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const session = await getSession(event).catch(() => null);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "unauthorized" };
			}
			const { deleteBuilderCredentials } = await import("./credential-provider-CKFlFM2V.js");
			let orgId = null;
			let role = null;
			try {
				const { getOrgContext } = await import("./context-CkdaPJE2.js");
				const orgCtx = await getOrgContext(event);
				orgId = orgCtx.orgId ?? null;
				role = orgCtx.role ?? null;
			} catch {}
			try {
				await deleteBuilderCredentials(session.email, {
					orgId,
					role
				});
			} catch (err) {
				trackBuilderLifecycle("builder disconnect failed", session.email, { reason: "credential_delete_failed" });
				setResponseStatus(event, 500);
				return {
					ok: false,
					error: "Could not remove Builder credentials — your connection is unchanged. Please retry.",
					cause: err instanceof Error ? err.message : String(err)
				};
			}
			trackBuilderLifecycle("builder disconnect succeeded", session.email);
			return { ok: true };
		}));
		getH3App(nitroApp).use(`${P}/builder/agents-run`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const session = await getSession(event).catch(() => null);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "unauthorized" };
			}
			return runWithRequestContext({
				userEmail: session.email,
				orgId: session.orgId ?? void 0
			}, async () => {
				const { resolveBuilderCredentials: resolveCreds } = await import("./credential-provider-CKFlFM2V.js");
				const creds = await resolveCreds();
				if (!creds.privateKey || !creds.publicKey) {
					setResponseStatus(event, 400);
					return { error: "Builder not connected. Connect Builder in Setup to use background agent." };
				}
				const body = await readBody$1(event);
				if (!body?.userMessage) {
					setResponseStatus(event, 400);
					return { error: "userMessage is required" };
				}
				const apiHost = process.env.BUILDER_API_HOST || "https://ai-services.builder.io";
				try {
					const res = await fetch(`${apiHost}/agents/run?apiKey=${encodeURIComponent(creds.publicKey)}`, {
						method: "POST",
						headers: {
							"Content-Type": "application/json",
							Authorization: `Bearer ${creds.privateKey}`
						},
						body: JSON.stringify({
							userMessage: { userPrompt: body.userMessage },
							branchName: body.branchName
						})
					});
					if (!res.ok) {
						const err = await res.text().catch(() => "Unknown error");
						setResponseStatus(event, res.status);
						return { error: redactValues(err, [creds.privateKey, creds.publicKey]) };
					}
					return await res.json();
				} catch (err) {
					setResponseStatus(event, 500);
					return { error: redactValues(err?.message || "Failed to reach Builder agents-run API", [creds.privateKey, creds.publicKey]) };
				}
			});
		}));
		const frameworkEnvKeys = [
			{
				key: "ENABLE_BUILDER",
				label: "Enable Builder.io features"
			},
			{
				key: "AGENT_ENGINE_PREFER_BYO_KEY",
				label: "Prefer BYO LLM key over Builder gateway (default: false — gateway wins)"
			},
			...Object.values(PROVIDER_ENV_META).map(({ envVar, label }) => ({
				key: envVar,
				label
			}))
		];
		{
			const envKeys = [...frameworkEnvKeys, ...options.envKeys ?? []];
			const collectOnboardingKeys = () => {
				const keys = /* @__PURE__ */ new Set();
				for (const step of listOnboardingSteps()) for (const method of step.methods) {
					if (method.kind === "form") {
						for (const field of method.payload.fields) if (field?.key) keys.add(field.key);
					}
					if (method.kind === "builder-cli-auth") {
						keys.add("BUILDER_PRIVATE_KEY");
						keys.add("BUILDER_PUBLIC_KEY");
					}
				}
				return keys;
			};
			getH3App(nitroApp).use(`${P}/env-status`, defineEventHandler(async (event) => {
				const userEmail = (await getSession(event).catch(() => null))?.email;
				let orgId;
				if (userEmail) try {
					orgId = (await getOrgContext(event)).orgId ?? void 0;
				} catch {}
				const canUseDeployEnv = await runWithRequestContext({
					userEmail,
					orgId
				}, () => canUseDeployCredentialFallbackForRequest());
				return envKeys.map((cfg) => {
					const isProviderKey = PROVIDER_ENV_VAR_KEYS.has(cfg.key);
					return {
						key: cfg.key,
						label: cfg.label,
						required: cfg.required ?? false,
						configured: !!process.env[cfg.key] && (!isProviderKey || canUseDeployEnv),
						...cfg.helpText ? { helpText: cfg.helpText } : {}
					};
				});
			}));
			getH3App(nitroApp).use(`${P}/env-vars`, defineEventHandler(async (event) => {
				if (getMethod(event) !== "POST") {
					setResponseStatus(event, 405);
					return { error: "Method not allowed" };
				}
				if (!isEnvVarWriteAllowed()) {
					setResponseStatus(event, 403);
					return { error: "env-vars endpoint disabled on multi-tenant deployments. Use saveCredential(key, value, { userEmail, orgId, scope: 'org' }) to store per-org credentials." };
				}
				const body = await readBody$1(event);
				const { vars } = body;
				if (!Array.isArray(vars) || vars.length === 0) {
					setResponseStatus(event, 400);
					return { error: "vars array required" };
				}
				const allowedKeys = new Set([...envKeys.map((k) => k.key), ...collectOnboardingKeys()]);
				const filtered = vars.filter((v) => typeof v.key === "string" && allowedKeys.has(v.key) && typeof v.value === "string" && v.value.trim().length > 0);
				if (filtered.length === 0) {
					setResponseStatus(event, 400);
					return { error: vars.some((v) => typeof v.key === "string" && allowedKeys.has(v.key) && (typeof v.value !== "string" || v.value.trim().length === 0)) ? "Env values must be non-empty — refusing to clear a saved key" : "No recognized env keys in request" };
				}
				try {
					const scope = body?.scope ?? "auto";
					const workspaceRoot = findWorkspaceRoot(process.cwd());
					await upsertEnvFile(scope === "app" ? path$1.join(process.cwd(), ".env") : workspaceRoot ? path$1.join(workspaceRoot, ".env") : path$1.join(process.cwd(), ".env"), filtered);
				} catch {}
				for (const { key, value } of filtered) process.env[key] = value;
				try {
					const envMap = {};
					for (const { key, value } of filtered) envMap[key] = value;
					await putSetting("persisted-env-vars", {
						...await getSetting("persisted-env-vars") ?? {},
						...envMap
					});
				} catch {}
				return { saved: filtered.map((v) => v.key) };
			}));
		}
		getH3App(nitroApp).use(`${P}/agent-engine/status`, defineEventHandler(async (event) => {
			try {
				const userEmail = (await getSession(event).catch(() => null))?.email;
				let orgId;
				if (userEmail) try {
					orgId = (await getOrgContext(event)).orgId ?? void 0;
				} catch {}
				const stored = await getSetting("agent-engine");
				if (isAgentEngineSettingConfigured(stored)) return {
					configured: true,
					engine: stored.engine,
					source: "settings"
				};
				const detectedFromUser = await runWithRequestContext({
					userEmail,
					orgId
				}, () => detectEngineFromUserSecrets());
				if (detectedFromUser?.name === "builder") return {
					configured: true,
					engine: detectedFromUser.name,
					source: "app_secrets",
					envVar: detectedFromUser.requiredEnvVars[0]
				};
				if (stored && typeof stored.engine === "string") {
					const entry = getAgentEngineEntry(stored.engine);
					if (entry && await runWithRequestContext({
						userEmail,
						orgId
					}, () => isStoredEngineUsableForRequest(stored, entry))) return {
						configured: true,
						engine: stored.engine,
						source: "env",
						envVar: entry.requiredEnvVars[0]
					};
				}
				if (detectedFromUser) return {
					configured: true,
					engine: detectedFromUser.name,
					source: "app_secrets",
					envVar: detectedFromUser.requiredEnvVars[0]
				};
				const detected = await runWithRequestContext({
					userEmail,
					orgId
				}, () => canUseDeployCredentialFallbackForRequest()) ? detectEngineFromEnv() : null;
				if (detected) return {
					configured: true,
					engine: detected.name,
					source: "env",
					envVar: detected.requiredEnvVars[0]
				};
			} catch {}
			return { configured: false };
		}));
		getH3App(nitroApp).use(`${P}/agent-engine/disconnect`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			if (!(await getSession(event).catch(() => null))?.email) {
				setResponseStatus(event, 401);
				return { error: "unauthorized" };
			}
			try {
				await deleteSetting("agent-engine");
				return { ok: true };
			} catch (err) {
				setResponseStatus(event, 500);
				return {
					ok: false,
					error: err instanceof Error ? err.message : String(err)
				};
			}
		}));
		getH3App(nitroApp).use(`${P}/agent-loop-settings`, defineEventHandler(async (event) => {
			const session = await getSession(event).catch(() => null);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "unauthorized" };
			}
			const orgCtx = await getOrgContext(event).catch(() => null);
			const orgId = orgCtx?.orgId ?? session.orgId ?? null;
			const ctx = {
				userEmail: session.email,
				orgId
			};
			const canUpdate = await canUpdateAgentLoopSettings(session.email, orgId);
			const withContext = async () => ({
				...await readAgentLoopSettings(ctx),
				canUpdate,
				orgId,
				orgName: orgCtx?.orgName ?? null,
				role: orgCtx?.role ?? null
			});
			const method = getMethod(event);
			if (method === "GET") return withContext();
			if (method === "PUT") {
				if (!canUpdate) {
					setResponseStatus(event, 403);
					return { error: orgId ? "Only organization owners and admins can change the agent step limit." : "You cannot change the agent step limit." };
				}
				const validation = validateMaxIterationsInput((await readBody$1(event).catch(() => ({})))?.maxIterations);
				if (validation.ok === false) {
					setResponseStatus(event, 400);
					return { error: validation.error };
				}
				return {
					...await writeAgentLoopSettings(ctx, validation.value),
					canUpdate,
					orgId,
					orgName: orgCtx?.orgName ?? null,
					role: orgCtx?.role ?? null
				};
			}
			if (method === "DELETE") {
				if (!canUpdate) {
					setResponseStatus(event, 403);
					return { error: orgId ? "Only organization owners and admins can reset the agent step limit." : "You cannot reset the agent step limit." };
				}
				return {
					...await resetAgentLoopSettings(ctx),
					canUpdate,
					orgId,
					orgName: orgCtx?.orgName ?? null,
					role: orgCtx?.role ?? null
				};
			}
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}));
		getH3App(nitroApp).use(`${P}/usage`, defineEventHandler(async (event) => {
			const session = await getSession(event).catch(() => null);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "unauthorized" };
			}
			const sinceDaysParam = new URL(`${event.url?.pathname || "/"}${event.url?.search || ""}`, "http://x").searchParams.get("sinceDays");
			const sinceDays = Math.max(1, Math.min(365, Number(sinceDaysParam) || 30));
			const { getUsageSummary, usageBillingForEngine } = await import("./store-DLJtZzM5.js");
			const [summary, engineName] = await Promise.all([getUsageSummary({
				ownerEmail: session.email,
				sinceMs: Date.now() - sinceDays * 864e5
			}), detectUsageEngineName(event, session.email)]);
			return {
				...summary,
				billing: usageBillingForEngine(engineName)
			};
		}));
		getH3App(nitroApp).use(`${P}/file-upload/status`, defineEventHandler(async (event) => {
			const active = getActiveFileUploadProvider();
			const userEmail = (await getSession(event).catch(() => null))?.email;
			let builderConfigured = !!process.env.BUILDER_PRIVATE_KEY;
			try {
				const { resolveBuilderPrivateKey } = await import("./credential-provider-CKFlFM2V.js");
				const resolve = () => resolveBuilderPrivateKey().then((k) => !!k);
				builderConfigured = userEmail ? await runWithRequestContext({ userEmail }, resolve) : await resolve();
			} catch {}
			const isBuilderEnvActive = active?.id === "builder";
			return {
				configured: isBuilderEnvActive ? builderConfigured : !!active || builderConfigured,
				activeProvider: isBuilderEnvActive ? builderConfigured ? {
					id: "builder",
					name: "Builder.io"
				} : null : active ? {
					id: active.id,
					name: active.name
				} : builderConfigured ? {
					id: "builder",
					name: "Builder.io"
				} : null,
				providers: listFileUploadProviders().map((p) => ({
					id: p.id,
					name: p.name,
					configured: p.isConfigured()
				})),
				builderConfigured
			};
		}));
		getH3App(nitroApp).use(`${P}/file-upload`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const filePart = (await readMultipartFormData(event))?.find((p) => p.name === "file");
			if (!filePart?.data) {
				setResponseStatus(event, 400);
				return { error: "No file uploaded" };
			}
			const session = await getSession(event);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "Unauthorized" };
			}
			const userEmail = session.email;
			const result = await runWithRequestContext({ userEmail }, () => uploadFile({
				data: filePart.data,
				filename: filePart.filename,
				mimeType: filePart.type,
				ownerEmail: userEmail
			}));
			if (result) {
				setResponseStatus(event, 201);
				return result;
			}
			setResponseStatus(event, 503);
			return { error: "No file upload provider configured. Connect Builder.io in Settings → File uploads, or register a provider." };
		}));
		getH3App(nitroApp).use(`${P}/transcribe-voice`, createTranscribeVoiceHandler());
		getH3App(nitroApp).use(`${P}/transcribe-stream/session`, createGoogleRealtimeSessionHandler());
		getH3App(nitroApp).use(`${P}/voice-providers/status`, createVoiceProvidersStatusHandler());
		const adHocSecretHandler = createAdHocSecretHandler();
		getH3App(nitroApp).use(`${P}/secrets/adhoc`, adHocSecretHandler);
		const listSecretsHandler = createListSecretsHandler();
		const writeSecretHandler = createWriteSecretHandler();
		const testSecretHandler = createTestSecretHandler();
		getH3App(nitroApp).use(`${P}/secrets`, defineEventHandler(async (event) => {
			const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
			const parts = pathname ? pathname.split("/") : [];
			if (parts.length === 0) return listSecretsHandler(event);
			if (parts.length === 2 && parts[1] === "test") return testSecretHandler(event);
			if (parts.length === 1) return writeSecretHandler(event);
			setResponseStatus(event, 404);
			return { error: "Not found" };
		}));
		getH3App(nitroApp).use(`${P}/notifications`, createNotificationsHandler());
		try {
			const { ensureExtensionsTables, registerExtensionsShareable } = await import("./store-CKlF9Mdr.js");
			const { createExtensionsHandler } = await import("./routes-D65fdWcn.js");
			ensureExtensionsTables().catch(() => {});
			registerExtensionsShareable();
			const extensionsHandler = createExtensionsHandler();
			getH3App(nitroApp).use(`${P}/extensions`, extensionsHandler);
			getH3App(nitroApp).use(`${P}/tools`, extensionsHandler);
			const { ensureSlotTables } = await import("./store-DY_iEKRW.js");
			const { createSlotsHandler } = await import("./routes-C8AlqnsT.js");
			ensureSlotTables().catch(() => {});
			getH3App(nitroApp).use(`${P}/slots`, createSlotsHandler());
		} catch {}
		getH3App(nitroApp).use(defineEventHandler((event) => {
			const method = getMethod(event);
			if (method !== "GET" && method !== "HEAD") return;
			const target = resolveLegacyToolsRedirect(event.url?.pathname ?? String(event.node?.req?.url ?? event.path ?? "/").split("?")[0], event.url?.search ?? "");
			if (!target) return;
			setResponseStatus(event, 302);
			setResponseHeader(event, "Location", target);
			return "";
		}));
		getH3App(nitroApp).use(`${P}/runs`, createProgressHandler());
		getH3App(nitroApp).use(`${P}/automations`, defineEventHandler(async (event) => {
			const method = getMethod(event);
			const pathname = (event.path || event.url?.pathname || "").split("?")[0].replace(/^\/+/, "").replace(/\/+$/, "");
			const session = await getSession(event).catch(() => null);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "Unauthenticated" };
			}
			if ((pathname === "fire-test" || pathname.endsWith("/fire-test")) && method === "POST") try {
				const { emit } = await import("./event-bus-Du1ggHZK.js");
				emit("test.event.fired", { data: (await readBody$1(event).catch(() => ({}))).data ?? {} }, { owner: session.email });
				return { ok: true };
			} catch (err) {
				setResponseStatus(event, 500);
				return { error: err?.message ?? "Failed to emit test event" };
			}
			if (method !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			try {
				const owner = session.email;
				const { resourceListAllOwners, SHARED_OWNER } = await import("./store-BokCrGTV.js");
				const resources = (await resourceListAllOwners("jobs/")).filter((r) => r.owner === owner || r.owner === SHARED_OWNER);
				const FRONT_RE = /^---\n([\s\S]*?)\n---\n?([\s\S]*)$/;
				return resources.filter((r) => r.path.endsWith(".md") && !r.path.endsWith(".keep")).map((r) => {
					const match = r.content.match(FRONT_RE);
					if (!match) return {
						id: r.id,
						name: r.path.replace(/^jobs\//, "").replace(/\.md$/, ""),
						path: r.path,
						owner: r.owner,
						triggerType: "schedule",
						enabled: false,
						mode: "agentic",
						body: r.content
					};
					const yaml = match[1];
					const body = match[2].trim();
					const meta = {};
					for (const line of yaml.split("\n")) {
						const ci = line.indexOf(":");
						if (ci === -1) continue;
						const k = line.slice(0, ci).trim();
						let v = line.slice(ci + 1).trim();
						if (v.startsWith("\"") && v.endsWith("\"") || v.startsWith("'") && v.endsWith("'")) v = v.slice(1, -1);
						meta[k] = v;
					}
					return {
						id: r.id,
						name: r.path.replace(/^jobs\//, "").replace(/\.md$/, ""),
						path: r.path,
						owner: r.owner,
						triggerType: meta.triggerType || "schedule",
						event: meta.event,
						schedule: meta.schedule,
						condition: meta.condition,
						mode: meta.mode || "agentic",
						domain: meta.domain,
						enabled: meta.enabled !== "false",
						lastStatus: meta.lastStatus,
						lastRun: meta.lastRun,
						lastError: meta.lastError,
						createdBy: meta.createdBy,
						body
					};
				});
			} catch (err) {
				setResponseStatus(event, 500);
				return { error: err?.message ?? "Failed to list automations" };
			}
		}));
		getH3App(nitroApp).use(`${P}/settings`, defineEventHandler(async (event) => {
			const key = ((event.url?.pathname || "").replace(/^\/+/, "").split("/")[0] || "").replace(/[^a-zA-Z0-9_-]/g, "");
			if (!key) {
				setResponseStatus(event, 404);
				return { error: "Settings key required" };
			}
			const session = await getSession(event);
			if (!session?.email) {
				setResponseStatus(event, 401);
				return { error: "unauthorized" };
			}
			const method = getMethod(event);
			const requestSource = event.node?.req?.headers?.["x-request-source"] || void 0;
			if (method === "GET") {
				const value = await getUserSetting(session.email, key);
				if (!value) {
					setResponseStatus(event, 404);
					return { error: `No setting for ${key}` };
				}
				return value;
			}
			if (method === "PUT") {
				const body = await readBody$1(event);
				await putUserSetting(session.email, key, body, { requestSource });
				return body;
			}
			if (method === "DELETE") {
				await deleteUserSetting(session.email, key, { requestSource });
				return { ok: true };
			}
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}));
		getH3App(nitroApp).use(`${P}/avatar`, defineEventHandler(async (event) => {
			const method = getMethod(event);
			const emailParam = (event.url?.pathname || "").replace(/^\/+/, "").split("/")[0];
			if (method === "GET") {
				if (!emailParam) {
					setResponseStatus(event, 400);
					return { error: "email required" };
				}
				return { image: (await getSetting(`avatar:${decodeURIComponent(emailParam)}`))?.image ?? null };
			}
			if (method === "PUT") {
				const session = await getSession(event);
				if (!session?.email) {
					setResponseStatus(event, 401);
					return { error: "unauthorized" };
				}
				const { image } = await readBody$1(event);
				if (!image || !image.startsWith("data:image/")) {
					setResponseStatus(event, 400);
					return { error: "image (data URL) required" };
				}
				await putSetting(`avatar:${session.email}`, { image });
				return { ok: true };
			}
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}));
		if (!options.disableAppState) {
			getH3App(nitroApp).use(`${P}/application-state/compose`, defineEventHandler(async (event) => {
				const id = (event.url?.pathname || "").replace(/^\/+/, "").split("/")[0] || "";
				if (event.context) event.context.params = {
					...event.context.params,
					id
				};
				const method = getMethod(event);
				if (!id) {
					if (method === "GET") return listComposeDrafts(event);
					if (method === "DELETE") return deleteAllComposeDrafts(event);
				} else {
					if (method === "GET") return getComposeDraft(event);
					if (method === "PUT") return putComposeDraft(event);
					if (method === "DELETE") return deleteComposeDraft(event);
				}
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}));
			getH3App(nitroApp).use(`${P}/application-state`, defineEventHandler(async (event) => {
				const key = (event.url?.pathname || "").replace(/^\/+/, "").split("/")[0] || "";
				if (key === "compose" || key === "") return;
				if (event.context) event.context.params = {
					...event.context.params,
					key
				};
				const method = getMethod(event);
				if (method === "GET") return getState(event);
				if (method === "PUT") return putState(event);
				if (method === "DELETE") return deleteState(event);
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}));
		}
	};
}
/**
* Default core routes plugin — mount with no configuration needed.
*
* Usage in templates:
* ```ts
* // server/plugins/core-routes.ts
* export { defaultCoreRoutesPlugin as default } from "@agent-native/core/server";
* ```
*/
var defaultCoreRoutesPlugin = createCoreRoutesPlugin();
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/a2a-continuation-processor.js
var PROCESSOR_PATH = `${FRAMEWORK_ROUTE_PREFIX}/integrations/process-a2a-continuation`;
var TERMINAL_STATES = new Set([
	"completed",
	"failed",
	"canceled"
]);
var MAX_ATTEMPTS = 30;
var MAX_REMOTE_WORK_MS = 20 * 6e4;
var RESCHEDULE_DELAY_MS = 2e4;
var MAX_PRE_CLAIM_WAIT_MS = 25e3;
var POLL_INTERVAL_MS = 2e3;
var PROCESSOR_WAIT_MS = 1e4;
var POLL_REQUEST_TIMEOUT_MS = 8e3;
var PLATFORM_SEND_TIMEOUT_MS = 12e3;
var DISPATCH_SETTLE_WAIT_MS = 2e3;
var COMPLETE_AFTER_DELIVERY_ATTEMPTS = 3;
async function dispatchA2AContinuation(continuationId, webhookBaseUrl) {
	const url = `${withConfiguredAppBasePath(webhookBaseUrl || process.env.WEBHOOK_BASE_URL || process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL || `http://localhost:${process.env.PORT || 3e3}`)}${PROCESSOR_PATH}`;
	const headers = { "Content-Type": "application/json" };
	try {
		headers["Authorization"] = `Bearer ${signInternalToken(continuationId)}`;
	} catch (err) {
		if (process.env.NODE_ENV === "production") {
			console.error(`[integrations] Refusing to dispatch A2A continuation ${continuationId} — A2A_SECRET not configured.`);
			return;
		}
		if (err instanceof Error && !/A2A_SECRET/i.test(err.message)) console.error(`[integrations] signInternalToken failed unexpectedly for ${continuationId}:`, err);
	}
	const dispatchPromise = fetch(url, {
		method: "POST",
		headers,
		body: JSON.stringify({ continuationId })
	}).then(async (response) => {
		if (!response.ok) await logFailedDispatchResponse(continuationId, response);
	}).catch((err) => {
		console.error(`[integrations] Failed to dispatch A2A continuation ${continuationId}:`, err);
	});
	await Promise.race([dispatchPromise, new Promise((resolve) => setTimeout(resolve, DISPATCH_SETTLE_WAIT_MS))]);
}
async function logFailedDispatchResponse(continuationId, response) {
	let body = "";
	try {
		body = await response.text();
	} catch {}
	const trimmedBody = body.trim();
	console.error(`[integrations] A2A continuation ${continuationId} processor dispatch returned HTTP ${response.status}${response.statusText ? ` ${response.statusText}` : ""}${trimmedBody ? `: ${trimmedBody.slice(0, 500)}` : ""}`);
}
async function processA2AContinuationById(continuationId, options) {
	if (!await waitForContinuationDue(continuationId)) return;
	const continuation = await claimA2AContinuation(continuationId);
	if (!continuation) return;
	await processClaimedContinuation(continuation, options);
}
async function processDueA2AContinuations(options) {
	const continuations = await claimDueA2AContinuations(options.limit ?? 5);
	for (const continuation of continuations) await processClaimedContinuation(continuation, options).catch((err) => console.error(`[integrations] A2A continuation ${continuation.id} failed:`, err));
}
async function processClaimedContinuation(continuation, options) {
	const adapter = options.adapters.get(continuation.platform);
	if (!adapter) {
		await failA2AContinuation(continuation.id, `Unknown platform: ${continuation.platform}`);
		return;
	}
	const client = new A2AClient(continuation.agentUrl, await signContinuationToken(continuation), { requestTimeoutMs: POLL_REQUEST_TIMEOUT_MS });
	const deadline = Date.now() + PROCESSOR_WAIT_MS;
	let task = null;
	try {
		while (Date.now() < deadline) {
			task = await client.getTask(continuation.a2aTaskId);
			if (TERMINAL_STATES.has(task.status.state)) break;
			await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
		}
	} catch (err) {
		if (isTransientA2APollError(err)) {
			if (shouldStopPollingRemoteTask(continuation)) {
				await notifyAndFailA2AContinuation(continuation, adapter, remotePollFailureReason(continuation));
				return;
			}
			await rescheduleAndRedispatchA2AContinuation(continuation.id);
			return;
		}
		if (continuation.attempts >= MAX_ATTEMPTS) {
			await notifyAndFailA2AContinuation(continuation, adapter, err instanceof Error ? err.message : String(err));
			return;
		}
		await rescheduleAndRedispatchA2AContinuation(continuation.id);
		return;
	}
	if (!task || !TERMINAL_STATES.has(task.status.state)) {
		const recoverableArtifactText = extractRecoverableArtifactText(task);
		if (recoverableArtifactText) {
			await deliverAndCompleteA2AContinuation(continuation, adapter, formatContinuationArtifactText(recoverableArtifactText, continuation.agentUrl));
			return;
		}
		if (shouldStopPollingRemoteTask(continuation)) {
			await notifyAndFailA2AContinuation(continuation, adapter, remotePollFailureReason(continuation));
			return;
		}
		await rescheduleAndRedispatchA2AContinuation(continuation.id);
		return;
	}
	if (task.status.state !== "completed") {
		await notifyAndFailA2AContinuation(continuation, adapter, extractTaskText(task) || `Remote A2A task ${continuation.a2aTaskId} ended with state ${task.status.state}`);
		return;
	}
	const text = formatContinuationArtifactText(extractTaskText(task), continuation.agentUrl);
	if (!text.trim()) {
		await notifyAndFailA2AContinuation(continuation, adapter, `Remote A2A task ${continuation.a2aTaskId} completed without text`);
		return;
	}
	await deliverAndCompleteA2AContinuation(continuation, adapter, text);
}
async function waitForContinuationDue(continuationId) {
	const continuation = await getA2AContinuation(continuationId);
	if (!continuation) return false;
	if (continuation.status === "completed" || continuation.status === "failed") return false;
	if (continuation.status !== "pending") return true;
	const waitMs = continuation.nextCheckAt - Date.now();
	if (waitMs <= 0) return true;
	if (waitMs > MAX_PRE_CLAIM_WAIT_MS) return false;
	await sleep(waitMs);
	return true;
}
async function notifyAndFailA2AContinuation(continuation, adapter, reason) {
	const deliveryContinuation = await claimA2AContinuationDelivery(continuation.id);
	if (!deliveryContinuation) return;
	const message = formatContinuationFailureMessage(deliveryContinuation, reason);
	try {
		await withTimeout(adapter.sendResponse(adapter.formatAgentResponse(message), deliveryContinuation.incoming, { placeholderRef: deliveryContinuation.placeholderRef ?? void 0 }), PLATFORM_SEND_TIMEOUT_MS, `${deliveryContinuation.platform} failure notification timed out`);
	} catch (err) {
		console.error(`[integrations] Failed to notify ${deliveryContinuation.platform} about failed A2A continuation ${deliveryContinuation.id}:`, err);
	}
	await failA2AContinuation(deliveryContinuation.id, reason);
}
async function deliverAndCompleteA2AContinuation(continuation, adapter, text) {
	const deliveryContinuation = await claimA2AContinuationDelivery(continuation.id);
	if (!deliveryContinuation) return;
	try {
		await withTimeout(adapter.sendResponse(adapter.formatAgentResponse(text), deliveryContinuation.incoming, { placeholderRef: deliveryContinuation.placeholderRef ?? void 0 }), PLATFORM_SEND_TIMEOUT_MS, `${deliveryContinuation.platform} response delivery timed out`);
	} catch (err) {
		if (deliveryContinuation.attempts >= MAX_ATTEMPTS) {
			await failA2AContinuation(deliveryContinuation.id, err instanceof Error ? err.message : String(err));
			return;
		}
		await rescheduleAndRedispatchA2AContinuation(deliveryContinuation.id);
		return;
	}
	await completeAfterSuccessfulDelivery(deliveryContinuation);
}
async function rescheduleAndRedispatchA2AContinuation(continuationId) {
	await rescheduleA2AContinuation(continuationId, RESCHEDULE_DELAY_MS);
	await dispatchA2AContinuation(continuationId).catch((err) => {
		console.error(`[integrations] Failed to redispatch A2A continuation ${continuationId}:`, err);
	});
}
async function completeAfterSuccessfulDelivery(continuation) {
	let lastError;
	for (let attempt = 0; attempt < COMPLETE_AFTER_DELIVERY_ATTEMPTS; attempt++) try {
		await completeA2AContinuation(continuation.id);
		return;
	} catch (err) {
		lastError = err;
	}
	console.error(`[integrations] ${continuation.platform} accepted A2A continuation ${continuation.id}, but marking it completed failed. Leaving it in delivering for stale-delivery recovery.`, lastError);
}
function formatContinuationFailureMessage(continuation, reason) {
	if (isLlmCredentialError(reason)) return formatLlmCredentialErrorMessage({ agentName: continuation.agentName });
	return `The ${continuation.agentName} agent could not finish this request: ${sanitizeFailureReason(reason)}`;
}
function isRemoteWorkExpired(continuation) {
	return Date.now() - continuation.createdAt >= MAX_REMOTE_WORK_MS;
}
function shouldStopPollingRemoteTask(continuation) {
	return continuation.attempts >= MAX_ATTEMPTS || isRemoteWorkExpired(continuation);
}
function isTransientA2APollError(err) {
	if (!(err instanceof Error)) return false;
	if (err.name === "AbortError") return true;
	return /operation was aborted|aborted|timed out|timeout|Invalid or expired A2A token|A2A request failed \((?:401|508)\)/i.test(err.message);
}
function remotePollFailureReason(continuation) {
	if (isRemoteWorkExpired(continuation)) return `Timed out polling the ${continuation.agentName} A2A task ${continuation.a2aTaskId} after ${Math.round(MAX_REMOTE_WORK_MS / 6e4)} minutes. The downstream agent did not return a final result.`;
	return `Timed out polling the ${continuation.agentName} A2A task ${continuation.a2aTaskId} after ${MAX_ATTEMPTS} attempts. The downstream agent did not return a final result.`;
}
function sleep(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
async function withTimeout(promise, timeoutMs, message) {
	let timer;
	try {
		return await Promise.race([promise, new Promise((_, reject) => {
			timer = setTimeout(() => reject(new Error(message)), timeoutMs);
		})]);
	} finally {
		if (timer) clearTimeout(timer);
	}
}
function sanitizeFailureReason(reason) {
	return reason.replace(/\s+/g, " ").trim().replace(/\b[A-Z][A-Z0-9_]*(?:API_KEY|PRIVATE_KEY|SECRET|TOKEN)\b/g, "a required credential").slice(0, 500) || "the downstream agent returned an empty error";
}
async function signContinuationToken(continuation) {
	if (continuation.a2aAuthToken === "") return;
	const storedToken = continuation.a2aAuthToken;
	if (storedToken && !isLikelyJwt(storedToken)) return storedToken;
	const freshToken = await signFreshContinuationToken(continuation);
	if (freshToken) return freshToken;
	if (!storedToken) return void 0;
	if (isLikelyJwt(storedToken)) return void 0;
	return storedToken;
}
async function signFreshContinuationToken(continuation) {
	let orgDomain;
	let orgSecret;
	if (continuation.orgId) try {
		const { getOrgDomain, getOrgA2ASecret } = await import("./context-CkdaPJE2.js");
		orgDomain = await getOrgDomain(continuation.orgId) ?? void 0;
		orgSecret = await getOrgA2ASecret(continuation.orgId) ?? void 0;
	} catch {}
	if (!continuation.ownerEmail || !(orgSecret || process.env.A2A_SECRET)) return;
	try {
		return await signA2AToken(continuation.ownerEmail, orgDomain, orgSecret, {
			expiresIn: "30m",
			preferGlobalSecret: !orgSecret
		});
	} catch {
		return;
	}
}
function isLikelyJwt(token) {
	return token.split(".").length === 3;
}
function extractTaskText(task) {
	return (task.status.message?.parts ?? []).filter((part) => {
		return part.type === "text" && typeof part.text === "string";
	}).map((part) => part.text).join("\n");
}
function extractRecoverableArtifactText(task) {
	if (!task?.status.message?.metadata?.agentNativeRecoverableArtifacts) return "";
	return extractTaskText(task);
}
function formatContinuationArtifactText(text, agentUrl) {
	const expandedText = expandRelativeUrls(text, agentUrl);
	return appendA2AArtifactLinks(expandedText, [{
		tool: "call-agent",
		result: expandedText
	}], { baseUrl: resolveArtifactBaseUrl() });
}
function resolveArtifactBaseUrl() {
	const baseUrl = process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL;
	return baseUrl ? withConfiguredAppBasePath(baseUrl) : void 0;
}
function expandRelativeUrls(text, agentUrl) {
	if (!text || !agentUrl) return text;
	const base = publicAgentBaseUrl(agentUrl);
	return text.replace(/(^|[\s(\[<"'`])(\/[a-z0-9_-][a-z0-9_/?&=%#.,:-]*)/gi, (_match, lead, path) => `${lead}${base}${path}`);
}
function publicAgentBaseUrl(agentUrl) {
	try {
		const url = new URL(agentUrl);
		const routeIndex = url.pathname.indexOf(FRAMEWORK_ROUTE_PREFIX);
		url.pathname = routeIndex >= 0 ? url.pathname.slice(0, routeIndex) || "/" : url.pathname.replace(/\/+$/, "") || "/";
		url.search = "";
		url.hash = "";
		return url.toString().replace(/\/$/, "");
	} catch {
		return agentUrl.replace(/\/$/, "");
	}
}
//#endregion
export { createCoreRoutesPlugin as a, listFileUploadProviders as c, appendA2AArtifactLinks as d, buildA2ARecoverableArtifactMessage as f, FRAMEWORK_ROUTE_PREFIX as i, uploadFile as l, upsertEnvFile as m, processA2AContinuationById as n, defaultCoreRoutesPlugin as o, createPollEventsHandler as p, processDueA2AContinuations as r, getActiveFileUploadProvider as s, dispatchA2AContinuation as t, builderFileUploadProvider as u };
