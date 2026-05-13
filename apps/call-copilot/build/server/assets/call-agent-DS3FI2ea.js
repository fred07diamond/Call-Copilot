import { i as getRequestOrgId, o as getRequestUserEmail, r as getIntegrationRequestContext, s as isIntegrationCallerRequest } from "./request-context-BQ-cTIMw.js";
import { i as isLlmCredentialError, r as formatLlmCredentialErrorMessage } from "./credential-errors-4qhli1oh.js";
import { i as getOrgDomain, n as getOrgA2ASecret } from "./context-B8kKxauG.js";
import { n as discoverAgents, r as findAgent } from "./agent-discovery-1twg3iI7.js";
import { t as A2A_CONTINUATION_QUEUED_MARKER } from "./a2a-continuation-marker-DRyRhgjm.js";
import { a as signA2AToken, n as A2ATaskTimeoutError, r as callAgent, t as A2AClient } from "./client-DoIFGiWA.js";
import { createHash } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/scripts/call-agent.js
var DEFAULT_SERVERLESS_INTEGRATION_A2A_TIMEOUT_MS = 18e3;
var NETLIFY_INTEGRATION_A2A_TIMEOUT_MS = 2e3;
var INTEGRATION_A2A_TOKEN_TTL = "30m";
function parseTimeoutMs(value) {
	if (!value) return void 0;
	const parsed = Number(value);
	if (!Number.isFinite(parsed) || parsed <= 0) return void 0;
	return Math.floor(parsed);
}
function isServerlessHost() {
	return !!process.env.NETLIFY || !!process.env.AWS_LAMBDA_FUNCTION_NAME || !!process.env.VERCEL || "__cf_env" in globalThis;
}
function getIntegrationCallTimeoutMs() {
	if (!isServerlessHost() || !isIntegrationCallerRequest()) return void 0;
	const configured = parseTimeoutMs(process.env.AGENT_NATIVE_INTEGRATION_A2A_TIMEOUT_MS);
	if (configured !== void 0) return configured;
	if (process.env.NETLIFY) return NETLIFY_INTEGRATION_A2A_TIMEOUT_MS;
	return DEFAULT_SERVERLESS_INTEGRATION_A2A_TIMEOUT_MS;
}
function formatDownstreamLlmCredentialFailure(agentName, value) {
	return isLlmCredentialError(value) ? formatLlmCredentialErrorMessage({ agentName }) : null;
}
var tool = {
	description: "Call a DIFFERENT, separately-deployed agent app to ask a question or delegate a task. This is strictly for cross-app A2A communication — for example, asking the mail agent to send an email while you are the calendar agent. NEVER use this to call your own app or perform actions you can do with your own tools. Using call-agent on yourself will fail and waste time. For brand-consistent raster image generation, the first-party Images agent is available as agent=\"images\"; use it when another app needs generated heroes, diagrams, product shots, thumbnails, or design imagery, unless the current app has its own image-generation action that already delegates there. IMPORTANT — handling the response: (a) If it contains a URL or ID, copy it VERBATIM into your reply. Do not 'correct' or pluralize the path (e.g. /deck/ → /decks/), normalize casing, or change the slug — any edit breaks the link. (b) If it does NOT contain a URL/ID and the user asked for one, say so explicitly (e.g. \"the agent created the deck/image but didn't return a link — open the app directly to view it\"). NEVER invent a URL, slug, or path — guessing produces broken links that look real. (c) If the downstream response reports missing credentials, never repeat raw env var names, Vault key names, token names, secret names, or other credential identifiers. Tell the user the target app needs its LLM/provider connection configured.",
	parameters: {
		type: "object",
		properties: {
			agent: {
				type: "string",
				description: "Name or URL of a DIFFERENT deployed agent app (e.g. 'mail', 'calendar', 'analytics'). Must not be the current app's own name."
			},
			message: {
				type: "string",
				description: "The message/question to send to the other agent"
			}
		},
		required: ["agent", "message"]
	}
};
async function run(args, context, selfAppId) {
	const { agent: agentIdOrName, message } = args;
	if (!agentIdOrName) return "Error: --agent is required";
	if (!message) return "Error: --message is required";
	if (selfAppId && agentIdOrName.toLowerCase() === selfAppId.toLowerCase()) return `Error: You cannot use call-agent to call yourself (${selfAppId}). Use your own registered actions/tools instead. call-agent is only for communicating with OTHER separately-deployed apps.`;
	const agent = await findAgent(agentIdOrName, selfAppId);
	if (!agent) return `Error: Agent "${agentIdOrName}" not found. Available agents: ${(await discoverAgents(selfAppId)).map((a) => a.name).join(", ") || "(none)"}`;
	const messageWithHint = `${message}\n\n[Note: this request comes from another app via A2A. The caller cannot see your local UI, deck list, or navigation — only the literal text you put in your reply. If you create or reference a deck/document/design/dashboard, include its FULLY-QUALIFIED URL (e.g. ${agent.url}/deck/<id>) in your reply, not a relative path. Use only artifact IDs and URL paths returned by successful actions — never invent slugs, IDs, or hosts.]`;
	try {
		if (context?.send) {
			const callerEmail = getRequestUserEmail();
			const a2aMetadata = {};
			if (callerEmail) a2aMetadata.userEmail = callerEmail;
			let callerOrgDomain;
			let callerOrgSecret;
			const orgId = getRequestOrgId();
			if (orgId) {
				try {
					const domain = await getOrgDomain(orgId);
					if (domain) {
						callerOrgDomain = domain;
						a2aMetadata.orgDomain = domain;
					}
				} catch {}
				try {
					const secret = await getOrgA2ASecret(orgId);
					if (secret) callerOrgSecret = secret;
				} catch {}
			}
			let apiKey;
			if (callerEmail && (callerOrgSecret || process.env.A2A_SECRET)) try {
				apiKey = await signA2AToken(callerEmail, callerOrgDomain, callerOrgSecret, {
					expiresIn: INTEGRATION_A2A_TOKEN_TTL,
					preferGlobalSecret: !callerOrgSecret
				});
			} catch {}
			new A2AClient(agent.url, apiKey);
			if (process.env.NODE_ENV === "production" && callerEmail) try {
				const { listOAuthAccountsByOwner } = await import("./store-DFIQjDM8.js");
				const tokens = (await listOAuthAccountsByOwner("google", callerEmail))[0]?.tokens;
				if (tokens?.access_token) a2aMetadata.googleToken = tokens.access_token;
			} catch {}
			let responseText = "";
			let lastSentLength = 0;
			const existingContinuationText = await formatExistingIntegrationContinuationIfRetry(agent, message);
			if (existingContinuationText) return existingContinuationText;
			context.send({
				type: "agent_call",
				agent: agent.name,
				status: "start"
			});
			const emitNewText = (newText) => {
				if (newText.length > lastSentLength) {
					context.send({
						type: "agent_call_text",
						agent: agent.name,
						text: newText.slice(lastSentLength)
					});
					lastSentLength = newText.length;
				}
				responseText = newText;
			};
			try {
				const callTimeoutMs = getIntegrationCallTimeoutMs();
				responseText = await callAgent(agent.url, messageWithHint, {
					apiKey,
					userEmail: callerEmail,
					orgDomain: callerOrgDomain,
					orgSecret: callerOrgSecret,
					...callTimeoutMs ? { timeoutMs: callTimeoutMs } : {}
				});
				responseText = formatDownstreamLlmCredentialFailure(agent.name, responseText) ?? responseText;
				responseText = expandRelativeUrls(responseText, agent.url);
				if (responseText) emitNewText(responseText);
			} catch (pollErr) {
				const timeoutTaskId = getA2ATaskTimeoutTaskId(pollErr);
				if (timeoutTaskId) if (await enqueueIntegrationContinuationIfPossible(timeoutTaskId, agent, message, callerEmail)) responseText = `${A2A_CONTINUATION_QUEUED_MARKER}\nThe ${agent.name} agent accepted this delegated subtask and will post its own final result to the originating integration thread automatically. Do not call ${agent.name} again for this same subtask. Continue any other requested work, then answer with the completed results you have; if needed, mention that ${agent.name} is posting its result separately.`;
				else {
					const reason = pollErr?.message ?? "unknown error";
					responseText = `The ${agent.name} agent is taking longer than expected and didn't reply in time. (${reason})`;
				}
				else {
					const reason = pollErr?.message ?? "unknown error";
					responseText = formatDownstreamLlmCredentialFailure(agent.name, pollErr) ?? `The ${agent.name} agent is taking longer than expected and didn't reply in time. (${reason})`;
				}
			}
			context.send({
				type: "agent_call",
				agent: agent.name,
				status: "done"
			});
			return responseText || "(empty response)";
		}
		const email = getRequestUserEmail();
		let domain;
		let orgSecret;
		const currentOrgId = getRequestOrgId();
		if (currentOrgId) {
			try {
				domain = await getOrgDomain(currentOrgId) ?? void 0;
			} catch {}
			try {
				orgSecret = await getOrgA2ASecret(currentOrgId) ?? void 0;
			} catch {}
		}
		const response = await callAgent(agent.url, messageWithHint, {
			userEmail: email,
			orgDomain: domain,
			orgSecret
		});
		return expandRelativeUrls(formatDownstreamLlmCredentialFailure(agent.name, response) ?? response, agent.url) || "(empty response)";
	} catch (err) {
		const msg = err?.message ?? String(err);
		const credentialMessage = formatDownstreamLlmCredentialFailure(agent.name, err);
		if (credentialMessage) return credentialMessage;
		if (/timeout|did not complete|Inactivity|504/i.test(msg)) return `The ${agent.name} agent is taking longer than expected. Please try again, ask a simpler question, or open the ${agent.name} app directly.`;
		return `Error calling ${agent.name}: ${msg}`;
	}
}
async function enqueueIntegrationContinuationIfPossible(taskId, agent, message, ownerEmail) {
	const integration = getIntegrationRequestContext();
	if (!integration || !ownerEmail) return false;
	try {
		const [{ insertA2AContinuation }, { dispatchA2AContinuation }] = await Promise.all([import("./a2a-continuations-store-B43uJNSE.js"), import("./a2a-continuation-processor-BwTSJpSW.js")]);
		const continuation = await insertA2AContinuation({
			integrationTaskId: integration.taskId,
			platform: integration.incoming.platform,
			externalThreadId: integration.incoming.externalThreadId,
			incoming: integration.incoming,
			placeholderRef: integration.placeholderRef,
			ownerEmail,
			orgId: getRequestOrgId() ?? null,
			agentName: agent.name,
			agentUrl: agent.url,
			dedupeKey: getIntegrationContinuationDedupeKey(message),
			a2aTaskId: taskId,
			a2aAuthToken: null
		});
		await dispatchA2AContinuation(continuation.id).catch((err) => {
			console.error(`[call-agent] Failed to dispatch A2A continuation ${continuation.id}:`, err);
		});
		return true;
	} catch (err) {
		console.error("[call-agent] Failed to enqueue A2A continuation:", err);
		return false;
	}
}
function getA2ATaskTimeoutTaskId(err) {
	if (err instanceof A2ATaskTimeoutError) return err.taskId;
	const candidate = err;
	const message = String(candidate?.message ?? "");
	if (candidate?.name === "A2ATaskTimeoutError" && typeof candidate.taskId === "string") return candidate.taskId;
	return message.match(/^A2A task ([^\s]+) did not complete\b/)?.[1] ?? null;
}
async function formatExistingIntegrationContinuationIfRetry(agent, message) {
	const integration = getIntegrationRequestContext();
	if (!integration || (integration.attempts ?? 1) <= 1) return null;
	try {
		const { getA2AContinuationsForIntegrationTaskAgent } = await import("./a2a-continuations-store-B43uJNSE.js");
		const active = (await getA2AContinuationsForIntegrationTaskAgent(integration.taskId, agent.url, getIntegrationContinuationDedupeKey(message))).find((continuation) => [
			"pending",
			"processing",
			"delivering",
			"completed"
		].includes(continuation.status));
		if (!active) return null;
		const state = active.status === "completed" ? "already completed this delegated subtask and posted its result to the originating integration thread" : "already accepted this delegated subtask and is still working on it for the originating integration thread";
		return `${A2A_CONTINUATION_QUEUED_MARKER}\nThe ${agent.name} agent ${state}. Do not call ${agent.name} again for this same subtask. Continue any other requested work, then answer with the completed results you have; if needed, mention that ${agent.name} is posting or has posted its result separately.`;
	} catch (err) {
		console.error("[call-agent] Failed to inspect existing continuation:", err);
		return null;
	}
}
function getIntegrationContinuationDedupeKey(message) {
	const normalized = message.trim().replace(/\s+/g, " ");
	return createHash("sha256").update(normalized).digest("hex");
}
function expandRelativeUrls(text, agentUrl) {
	if (!text || !agentUrl) return text;
	const base = agentUrl.replace(/\/$/, "");
	return text.replace(/(^|[\s(\[<"'`])(\/[a-z0-9_-][a-z0-9_/?&=%#.,:-]*)/gi, (_match, lead, path) => `${lead}${base}${path}`);
}
//#endregion
export { run, tool };
