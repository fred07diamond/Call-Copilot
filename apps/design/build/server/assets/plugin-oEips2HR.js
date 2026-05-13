import { i as __require } from "./chunk-D3zDcpJC.js";
import { b as setResponseStatus, c as getMethod, g as readRawBody$2, i as defineEventHandler, l as getQuery, n as createError, s as getHeader, u as getRequestHeader } from "./node-DxyfkX8_.js";
import { d as appendA2AArtifactLinks, i as FRAMEWORK_ROUTE_PREFIX, n as processA2AContinuationById, r as processDueA2AContinuations } from "./a2a-continuation-processor-y0FDNnms.js";
import { t as readBody } from "./h3-helpers-CmxO0LxM.js";
import { r as getSession } from "./auth-B6XASyqO.js";
import { c as isLocalDatabase, i as getDbExec, o as intType, p as retryOnDdlRace, u as isPostgres } from "./client-BnpqLOqs.js";
import { a as createRemoteJWKSet, u as jwtVerify } from "./webapi-BRtoFKCk.js";
import { a as getEmailProvider, o as isEmailConfigured, s as sendEmail } from "./app-url-CcL5-L2g.js";
import { l as runWithRequestContext } from "./request-context-Ci6C_Mch.js";
import { o as readDeployCredentialEnv } from "./credential-provider-F0RQZ9bx.js";
import { l as startRun } from "./run-manager-AJUEq7Np.js";
import { i as getStoredModelForEngine, l as resolveEngine } from "./registry-DlSn3U6q.js";
import { n as createAnthropicEngine } from "./builtin-CZUg4_3B.js";
import { i as PROVIDER_TO_ENV } from "./provider-env-vars-CWagFwVS.js";
import { i as isLlmCredentialError, r as formatLlmCredentialErrorMessage } from "./credential-errors-CadDFEFG.js";
import "./engine-DAHmAbqJ.js";
import { d as getOwnerApiKey, h as runAgentLoop, l as engineToProvider, r as actionsToEngineTools, u as getOwnerActiveApiKey } from "./production-agent-DnqiykSA.js";
import { a as markDefaultPluginProvided, i as getH3App } from "./framework-request-handler-B0C0aZhm.js";
import { o as resolveOrgIdForEmail, r as getOrgContext } from "./context-NRophGGu.js";
import { c as updateThreadData, f as extractThreadMeta, i as getThread, t as createThread, u as buildAssistantMessage } from "./store-BA-0NJdw.js";
import { o as resourceGetByPath, t as SHARED_OWNER } from "./store--irHLonY.js";
import { n as signInternalToken, o as withConfiguredAppBasePath, r as verifyInternalToken, t as extractBearerToken } from "./internal-token-BJoZ0BAp.js";
import { t as A2A_CONTINUATION_QUEUED_MARKER } from "./a2a-continuation-marker-C7Y6JwmH.js";
import { timingSafeEqual } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/a2a/response-text.js
function collectFinalResponseTextFromAgentEvents(events, options = {}) {
	const fallbackToPreToolText = options.fallbackToPreToolText ?? true;
	let lastToolIdx = -1;
	for (let i = events.length - 1; i >= 0; i--) {
		const type = events[i].type;
		if (type === "tool_start" || type === "tool_done") {
			lastToolIdx = i;
			break;
		}
	}
	let responseText = collectTextEvents(events, lastToolIdx >= 0 ? lastToolIdx + 1 : 0);
	if (!responseText.trim() && lastToolIdx >= 0 && fallbackToPreToolText) responseText = collectTextEvents(events, 0);
	return responseText;
}
function collectTextEvents(events, startIdx) {
	let text = "";
	for (let i = startIdx; i < events.length; i++) {
		const event = events[i];
		if (event.type === "text") text += event.text;
	}
	return text;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/agent/runtime-context.js
function isValidTimezone(timezone) {
	try {
		new Intl.DateTimeFormat("en-US", { timeZone: timezone }).format();
		return true;
	} catch {
		return false;
	}
}
function formatDateTime(date, timezone) {
	return new Intl.DateTimeFormat("en-US", {
		timeZone: timezone,
		weekday: "long",
		year: "numeric",
		month: "long",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit",
		timeZoneName: "short"
	}).format(date);
}
function formatDate(date, timezone) {
	const parts = new Intl.DateTimeFormat("en-CA", {
		timeZone: timezone,
		year: "numeric",
		month: "2-digit",
		day: "2-digit"
	}).formatToParts(date);
	return `${parts.find((part) => part.type === "year")?.value ?? "1970"}-${parts.find((part) => part.type === "month")?.value ?? "01"}-${parts.find((part) => part.type === "day")?.value ?? "01"}`;
}
function buildRuntimeContextPrompt(options = {}) {
	const now = options.now ?? /* @__PURE__ */ new Date();
	const timezone = typeof options.timezone === "string" && isValidTimezone(options.timezone) ? options.timezone : "UTC";
	return `

<runtime-context>
currentUtc: ${now.toISOString()}
currentDateUtc: ${formatDate(now, "UTC")}
currentTimezone: ${timezone}
currentDateInTimezone: ${formatDate(now, timezone)}
currentTimeInTimezone: ${formatDateTime(now, timezone)}
Use this runtime context as authoritative for relative dates such as today, yesterday, tomorrow, this week, and last month. Resolve relative dates to explicit calendar dates before querying data or creating artifacts, and include the exact date or date range in factual answers.
</runtime-context>`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/thread-mapping-store.js
var _initPromise$2;
async function ensureTable$2() {
	if (!_initPromise$2) _initPromise$2 = (async () => {
		await getDbExec().execute(`
        CREATE TABLE IF NOT EXISTS integration_thread_mappings (
          platform TEXT NOT NULL,
          external_thread_id TEXT NOT NULL,
          internal_thread_id TEXT NOT NULL,
          platform_context TEXT NOT NULL DEFAULT '{}',
          created_at ${intType()} NOT NULL,
          updated_at ${intType()} NOT NULL,
          PRIMARY KEY (platform, external_thread_id)
        )
      `);
	})();
	return _initPromise$2;
}
/**
* Look up the internal thread ID for an external platform thread.
*/
async function getThreadMapping(platform, externalThreadId) {
	await ensureTable$2();
	const { rows } = await getDbExec().execute({
		sql: `SELECT platform, external_thread_id, internal_thread_id, platform_context, created_at, updated_at FROM integration_thread_mappings WHERE platform = ? AND external_thread_id = ?`,
		args: [platform, externalThreadId]
	});
	if (rows.length === 0) return null;
	const row = rows[0];
	return {
		platform: row.platform,
		externalThreadId: row.external_thread_id,
		internalThreadId: row.internal_thread_id,
		platformContext: JSON.parse(row.platform_context),
		createdAt: row.created_at,
		updatedAt: row.updated_at
	};
}
/**
* Create or update a thread mapping.
*/
async function saveThreadMapping(platform, externalThreadId, internalThreadId, platformContext = {}) {
	await ensureTable$2();
	const client = getDbExec();
	const now = Date.now();
	await client.execute({
		sql: isPostgres() ? `INSERT INTO integration_thread_mappings (platform, external_thread_id, internal_thread_id, platform_context, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT (platform, external_thread_id) DO UPDATE SET internal_thread_id=EXCLUDED.internal_thread_id, platform_context=EXCLUDED.platform_context, updated_at=EXCLUDED.updated_at` : `INSERT OR REPLACE INTO integration_thread_mappings (platform, external_thread_id, internal_thread_id, platform_context, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)`,
		args: [
			platform,
			externalThreadId,
			internalThreadId,
			JSON.stringify(platformContext),
			now,
			now
		]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/pending-tasks-store.js
/**
* SQL-backed pending task queue for integration webhooks.
*
* Why this exists: serverless platforms (Netlify Lambda, Vercel, Cloudflare
* Workers) freeze the function execution as soon as the HTTP response is
* returned. Fire-and-forget background `Promise`s get killed mid-flight,
* meaning agent loops triggered from a Slack/Telegram webhook never finish.
*
* Solution: persist the inbound message to SQL inside the webhook handler,
* then dispatch a fresh HTTP POST to a separate processor endpoint. Each
* invocation gets its own fresh function timeout budget.
*/
var _initPromise$1;
async function ensureTable$1() {
	if (!_initPromise$1) _initPromise$1 = (async () => {
		const client = getDbExec();
		await client.execute(`
        CREATE TABLE IF NOT EXISTS integration_pending_tasks (
          id TEXT PRIMARY KEY,
          platform TEXT NOT NULL,
          external_thread_id TEXT NOT NULL,
          payload TEXT NOT NULL,
          owner_email TEXT NOT NULL,
          org_id TEXT,
          status TEXT NOT NULL,
          attempts ${intType()} NOT NULL DEFAULT 0,
          error_message TEXT,
          created_at ${intType()} NOT NULL,
          updated_at ${intType()} NOT NULL,
          completed_at ${intType()}
        )
      `);
		await client.execute(`CREATE INDEX IF NOT EXISTS idx_pending_tasks_status_created ON integration_pending_tasks(status, created_at)`);
		await ensureExternalEventKey(client);
		await client.execute(`CREATE UNIQUE INDEX IF NOT EXISTS idx_pending_tasks_event_key ON integration_pending_tasks(platform, external_event_key)`);
	})();
	return _initPromise$1;
}
async function ensureExternalEventKey(client) {
	if (isPostgres()) {
		await client.execute(`ALTER TABLE integration_pending_tasks ADD COLUMN IF NOT EXISTS external_event_key TEXT`);
		return;
	}
	try {
		await client.execute(`ALTER TABLE integration_pending_tasks ADD COLUMN external_event_key TEXT`);
	} catch (err) {
		if (!String(err?.message ?? err).toLowerCase().includes("duplicate")) throw err;
	}
}
function rowToTask(row) {
	return {
		id: row.id,
		platform: row.platform,
		externalThreadId: row.external_thread_id,
		payload: row.payload,
		ownerEmail: row.owner_email,
		orgId: row.org_id ?? null,
		status: row.status,
		attempts: Number(row.attempts ?? 0),
		errorMessage: row.error_message ?? null,
		createdAt: Number(row.created_at ?? 0),
		updatedAt: Number(row.updated_at ?? 0),
		completedAt: row.completed_at == null ? null : Number(row.completed_at)
	};
}
/**
* Insert a new pending task. Returns the generated task id.
*
* If `externalEventKey` is supplied, the unique index on
* `(platform, external_event_key)` will reject duplicates — callers should
* catch the resulting constraint-violation error and treat it as
* "already enqueued" instead of a hard failure (H3 in the webhook security
* audit). This is the SQL-backed replacement for the in-memory dedup map.
*/
async function insertPendingTask(input) {
	await ensureTable$1();
	const client = getDbExec();
	const now = Date.now();
	await client.execute({
		sql: `INSERT INTO integration_pending_tasks
      (id, platform, external_thread_id, payload, owner_email, org_id, status, attempts, created_at, updated_at, external_event_key)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			input.id,
			input.platform,
			input.externalThreadId,
			input.payload,
			input.ownerEmail,
			input.orgId ?? null,
			"pending",
			0,
			now,
			now,
			input.externalEventKey ?? null
		]
	});
}
/**
* Returns whether a duplicate-event error from `insertPendingTask` looks
* like a unique-constraint violation on `(platform, external_event_key)`.
*
* Postgres surfaces these as `error.code === "23505"`, while SQLite uses
* a substring match on the error text. Used by the webhook handler to
* distinguish "already enqueued" (silently OK) from genuine insert failures.
*/
function isDuplicateEventError(err) {
	const e = err;
	if (!e) return false;
	if (e.code === "23505") return true;
	const msg = String(e.message ?? "").toLowerCase();
	return msg.includes("unique") || msg.includes("duplicate entry") || msg.includes("duplicate key");
}
/** Fetch a pending task by id. */
async function getPendingTask(id) {
	await ensureTable$1();
	const { rows } = await getDbExec().execute({
		sql: `SELECT id, platform, external_thread_id, payload, owner_email, org_id, status, attempts, error_message, created_at, updated_at, completed_at
          FROM integration_pending_tasks WHERE id = ? LIMIT 1`,
		args: [id]
	});
	if (rows.length === 0) return null;
	return rowToTask(rows[0]);
}
/**
* Atomically claim a task: transition pending → processing and increment
* attempts. Returns the updated task if the transition succeeded, otherwise
* null (e.g. the task was already claimed by a concurrent worker).
*/
async function claimPendingTask(id) {
	await ensureTable$1();
	const client = getDbExec();
	const now = Date.now();
	const result = await client.execute({
		sql: isPostgres() ? `UPDATE integration_pending_tasks
         SET status = ?, attempts = attempts + 1, updated_at = ?
         WHERE id = ? AND status = 'pending'
         RETURNING id, platform, external_thread_id, payload, owner_email, org_id, status, attempts, error_message, created_at, updated_at, completed_at` : `UPDATE integration_pending_tasks
         SET status = ?, attempts = attempts + 1, updated_at = ?
         WHERE id = ? AND status = 'pending'`,
		args: [
			"processing",
			now,
			id
		]
	});
	const rows = result.rows ?? [];
	if (isPostgres()) {
		if (rows.length === 0) return null;
		return rowToTask(rows[0]);
	}
	if ((result.rowsAffected ?? result.rowCount) === 0) return null;
	const fetched = await getPendingTask(id);
	if (!fetched || fetched.status !== "processing") return null;
	return fetched;
}
/** Mark a task as completed. */
async function markTaskCompleted(id) {
	await ensureTable$1();
	const client = getDbExec();
	const now = Date.now();
	await client.execute({
		sql: `UPDATE integration_pending_tasks
          SET status = ?, updated_at = ?, completed_at = ?
          WHERE id = ?`,
		args: [
			"completed",
			now,
			now,
			id
		]
	});
}
/** Mark a task as failed and stash an error message. */
async function markTaskFailed(id, errorMessage) {
	await ensureTable$1();
	const client = getDbExec();
	const now = Date.now();
	await client.execute({
		sql: `UPDATE integration_pending_tasks
          SET status = ?, updated_at = ?, error_message = ?
          WHERE id = ?`,
		args: [
			"failed",
			now,
			errorMessage.slice(0, 2e3),
			id
		]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/webhook-handler.js
var PROCESSOR_DISPATCH_SETTLE_WAIT_MS = 1500;
/**
* Build a stable per-event dedup key from the incoming message. The same
* key is computed for every retry of the same event from the platform —
* Slack/Telegram retry on timeout (3s for Slack), so we MUST treat the
* second delivery as a duplicate and return 200 silently.
*
* The `(platform, external_event_key)` UNIQUE index in
* `integration_pending_tasks` enforces this at the SQL layer, replacing
* the previous in-memory Map (H3 in the webhook security audit) which
* couldn't survive serverless cold starts.
*/
function buildEventDedupKey(incoming) {
	return `${incoming.platform}:${incoming.externalThreadId}:${incoming.timestamp}`;
}
function explicitEngineName(engineOption) {
	if (!engineOption) return void 0;
	if (typeof engineOption === "string") return engineOption;
	if (typeof engineOption === "object" && !("stream" in engineOption) && typeof engineOption.name === "string") return engineOption.name;
}
function isMultiTenantDeploy() {
	if (process.env.NODE_ENV !== "production") return false;
	return !isLocalDatabase();
}
function collectToolResultSummaries(completedRun) {
	return completedRun.events.map((runEvent) => runEvent.event).filter((event) => event.type === "tool_done").map((event) => ({
		tool: event.tool,
		result: event.result
	}));
}
async function resolveIntegrationApiKey(engineOption, ownerEmail, fallbackApiKey) {
	const engineName = explicitEngineName(engineOption);
	if (engineName) {
		const provider = engineToProvider(engineName);
		const userApiKey = await getOwnerApiKey(provider, ownerEmail);
		if (userApiKey || isMultiTenantDeploy()) return userApiKey;
		const envVar = PROVIDER_TO_ENV[provider];
		return (envVar ? readDeployCredentialEnv(envVar) : void 0) || fallbackApiKey.trim() || void 0;
	}
	const userApiKey = await getOwnerActiveApiKey(ownerEmail);
	if (userApiKey || isMultiTenantDeploy()) return userApiKey;
	return fallbackApiKey.trim() || void 0;
}
/**
* Process an incoming webhook from a messaging platform.
*
* Flow:
* 1. Handle verification challenges (Slack url_verification, etc.)
* 2. Verify webhook signature
* 3. Parse incoming message (null = ignored event)
* 4. Persist task to SQL
* 5. Fire-and-forget POST to /_agent-native/integrations/process-task
*    (a fresh function execution with its own timeout budget)
* 6. Return HTTP 200 immediately (within Slack's 3s SLA)
*
* The processor endpoint runs the actual agent loop. This split is essential
* for serverless platforms (Netlify Lambda, Vercel, Cloudflare Workers) which
* freeze the function as soon as the response is returned, killing any
* lingering background promises.
*/
async function handleWebhook(event, options) {
	const { adapter, beforeProcess } = options;
	let incoming = options.incoming ?? null;
	if (!incoming) {
		const verification = await adapter.handleVerification(event);
		if (verification.handled) return {
			status: 200,
			body: verification.response ?? "ok"
		};
		if (!await adapter.verifyWebhook(event)) return {
			status: 401,
			body: { error: "Invalid webhook signature" }
		};
		incoming = await adapter.parseIncomingMessage(event);
		if (!incoming) return {
			status: 200,
			body: "ok"
		};
	}
	if (beforeProcess) {
		const result = await beforeProcess(incoming, adapter);
		if (result.handled) {
			if (result.responseText?.trim()) {
				const outgoing = adapter.formatAgentResponse(result.responseText);
				await adapter.sendResponse(outgoing, incoming);
			}
			return {
				status: 200,
				body: "ok"
			};
		}
	}
	try {
		await enqueueAndDispatch(event, incoming, options);
	} catch (err) {
		if (isDuplicateEventError(err)) return {
			status: 200,
			body: "ok"
		};
		console.error(`[integrations] Failed to enqueue/dispatch ${incoming.platform} message:`, err);
		return {
			status: 500,
			body: { error: "enqueue failed" }
		};
	}
	return {
		status: 200,
		body: "ok"
	};
}
/**
* Persist the task to SQL and dispatch a fresh HTTP request to the processor
* endpoint. The dispatch is fire-and-forget — we deliberately do NOT await
* the resulting fetch, so the current handler can return immediately.
*
* This pattern works on every supported host:
*   - Netlify Lambda: function returns; the dispatched request hits a fresh
*     Lambda with its own function budget.
*   - Vercel Functions: same.
*   - Cloudflare Workers: same (no waitUntil dependency).
*   - Self-hosted Node: a separate request comes back through the same
*     server, but each handler still runs to completion.
*/
async function enqueueAndDispatch(event, incoming, options) {
	const taskId = `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	let orgId = null;
	try {
		orgId = await resolveOrgIdForEmail(options.ownerEmail) ?? null;
	} catch {
		orgId = null;
	}
	let placeholderRef;
	try {
		if (options.adapter.postProcessingPlaceholder) {
			const placeholder = await options.adapter.postProcessingPlaceholder(incoming);
			if (placeholder?.placeholderRef) placeholderRef = placeholder.placeholderRef;
		}
	} catch (err) {
		console.error("[integrations] postProcessingPlaceholder failed:", err);
	}
	const payload = JSON.stringify({
		incoming,
		placeholderRef
	});
	await insertPendingTask({
		id: taskId,
		platform: incoming.platform,
		externalThreadId: incoming.externalThreadId,
		payload,
		ownerEmail: options.ownerEmail,
		orgId,
		externalEventKey: buildEventDedupKey(incoming)
	});
	const processUrl = `${resolveBaseUrl(event)}${FRAMEWORK_ROUTE_PREFIX}/integrations/process-task`;
	const headers = { "Content-Type": "application/json" };
	try {
		headers["Authorization"] = `Bearer ${signInternalToken(taskId)}`;
	} catch (err) {
		if (err instanceof Error && !/A2A_SECRET/i.test(err.message)) console.error(`[integrations] signInternalToken failed unexpectedly for ${taskId}:`, err);
	}
	const dispatchPromise = fetch(processUrl, {
		method: "POST",
		headers,
		body: JSON.stringify({ taskId })
	}).catch((err) => {
		console.error("[integrations] Failed to dispatch processor request:", err);
	});
	await Promise.race([dispatchPromise, new Promise((resolve) => setTimeout(resolve, PROCESSOR_DISPATCH_SETTLE_WAIT_MS))]);
}
/**
* Resolve the base URL we should dispatch the processor request to.
* Prefers explicit env vars (most reliable on serverless), falls back to the
* inbound request's headers.
*/
function resolveBaseUrl(event) {
	const fromEnv = process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL || process.env.BETTER_AUTH_URL;
	if (fromEnv) return withConfiguredAppBasePath(fromEnv);
	try {
		const headers = event.node?.req?.headers ?? event.headers;
		const get = (name) => {
			if (!headers) return void 0;
			if (typeof headers.get === "function") return headers.get(name) ?? void 0;
			const lower = String(name).toLowerCase();
			const map = headers;
			return map[name] ?? map[lower];
		};
		return withConfiguredAppBasePath(`${get("x-forwarded-proto") || "http"}://${get("host") || `localhost:${process.env.PORT || 3e3}`}`);
	} catch {
		return withConfiguredAppBasePath(`http://localhost:${process.env.PORT || 3e3}`);
	}
}
/**
* Run the actual agent loop for a previously-enqueued task. Called by the
* processor endpoint in `plugin.ts`. This is a fresh function execution, so
* it gets its own timeout budget independent of the inbound webhook handler.
*/
async function processIntegrationTask(task, options) {
	const parsed = JSON.parse(task.payload);
	await processIncomingMessage(parsed.incoming, options, {
		taskId: task.id,
		attempts: task.attempts,
		placeholderRef: parsed.placeholderRef
	});
}
/**
* Resolve thread, run agent loop, post response, persist thread data.
* Shared between the new processor endpoint and any direct callers.
*/
async function processIncomingMessage(incoming, options, opts = {}) {
	const { adapter, systemPrompt, actions, model, apiKey, ownerEmail, engine: engineOption } = options;
	const effectiveSystemPrompt = systemPrompt + buildRuntimeContextPrompt();
	let mapping = await getThreadMapping(incoming.platform, incoming.externalThreadId);
	if (!mapping) {
		const thread = await createThread(ownerEmail, { title: `${adapter.label}: ${incoming.senderName || incoming.senderId || "User"}` });
		await saveThreadMapping(incoming.platform, incoming.externalThreadId, thread.id, incoming.platformContext);
		mapping = {
			platform: incoming.platform,
			externalThreadId: incoming.externalThreadId,
			internalThreadId: thread.id,
			platformContext: incoming.platformContext,
			createdAt: Date.now(),
			updatedAt: Date.now()
		};
	}
	const threadId = mapping.internalThreadId;
	const thread = await getThread(threadId);
	const existingMessages = [];
	if (thread?.threadData) try {
		const data = JSON.parse(thread.threadData);
		if (Array.isArray(data.messages)) for (const msg of data.messages) {
			const m = msg.message ?? msg;
			const textContent = typeof m.content === "string" ? m.content : Array.isArray(m.content) ? m.content.filter((c) => c.type === "text").map((c) => c.text).join("\n") : "";
			if (m.role === "user") existingMessages.push({
				role: "user",
				content: [{
					type: "text",
					text: textContent
				}]
			});
			else if (m.role === "assistant") existingMessages.push({
				role: "assistant",
				content: [{
					type: "text",
					text: textContent
				}]
			});
		}
	} catch {}
	const identityLines = [
		`Platform: ${incoming.platform}`,
		incoming.senderName ? `Sender name: ${incoming.senderName}` : null,
		incoming.senderEmail ? `Sender email: ${incoming.senderEmail}` : null,
		incoming.senderId ? `Sender ID: ${incoming.senderId}` : null
	].filter(Boolean);
	const userText = identityLines.length > 1 ? `<integration-context>\n${identityLines.join("\n")}\n</integration-context>\n\n${incoming.text}` : incoming.text;
	const messages = [...existingMessages, {
		role: "user",
		content: [{
			type: "text",
			text: userText
		}]
	}];
	const orgId = await resolveOrgIdForEmail(ownerEmail);
	const tools = actionsToEngineTools(actions);
	const runId = `integration-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	await new Promise((resolve) => {
		startRun(runId, threadId, async (send, signal) => {
			await runWithRequestContext({
				userEmail: ownerEmail,
				orgId: orgId ?? void 0,
				isIntegrationCaller: true,
				integration: opts.taskId ? {
					taskId: opts.taskId,
					attempts: opts.attempts,
					incoming,
					placeholderRef: opts.placeholderRef
				} : void 0
			}, async () => {
				const engine = await resolveEngine({
					engineOption,
					apiKey: await resolveIntegrationApiKey(engineOption, ownerEmail, apiKey),
					model
				});
				return runAgentLoop({
					engine,
					model: await getStoredModelForEngine(engine) ?? model ?? engine.defaultModel,
					systemPrompt: effectiveSystemPrompt,
					tools,
					messages,
					actions,
					send,
					signal
				});
			});
		}, async (completedRun) => {
			try {
				const queuedA2AContinuation = hasQueuedA2AContinuation(completedRun);
				let responseText = collectFinalResponseTextFromAgentEvents(completedRun.events.map((runEvent) => runEvent.event), { fallbackToPreToolText: !queuedA2AContinuation });
				if (!queuedA2AContinuation && !responseText.trim()) {
					const recoverableA2AArtifactText = extractRecoverableA2AArtifactToolResult(completedRun);
					if (recoverableA2AArtifactText) responseText = recoverableA2AArtifactText;
				}
				const suppressPlatformReply = queuedA2AContinuation && isQueuedA2AContinuationDeferral(responseText);
				const runErrored = completedRun.status === "errored";
				const runErrorText = completedRun.events.map((runEvent) => runEvent.event.type === "error" ? runEvent.event.error : "").filter(Boolean).join("\n");
				if (isLlmCredentialError(responseText) || isLlmCredentialError(runErrorText)) responseText = formatLlmCredentialErrorMessage();
				else if (!suppressPlatformReply && (!responseText.trim() || runErrored)) if (runErrored) responseText = (responseText.trim() ? responseText + "\n\n" : "") + "I ran into a problem before I could finish that one. If it was a complex analytics question, opening the analytics app directly is the most reliable way to get an answer right now.";
				else responseText = "(No response)";
				const baseUrl = process.env.APP_URL || process.env.URL || "";
				const appBaseUrl = baseUrl ? withConfiguredAppBasePath(baseUrl) : "";
				if (!suppressPlatformReply) responseText = appendA2AArtifactLinks(responseText, collectToolResultSummaries(completedRun), { baseUrl: appBaseUrl || void 0 });
				const threadDeepLinkUrl = appBaseUrl && threadId ? `${appBaseUrl}/?thread=${threadId}` : void 0;
				if (!suppressPlatformReply) {
					const outgoing = adapter.formatAgentResponse(responseText, { threadDeepLinkUrl });
					await adapter.sendResponse(outgoing, incoming, { placeholderRef: opts.placeholderRef });
				}
				await persistThreadData$1(threadId, incoming.text, completedRun, thread);
			} catch (err) {
				console.error(`[integrations] Error sending response to ${incoming.platform}:`, err);
				try {
					const fallback = adapter.formatAgentResponse("Something went wrong on my end while replying. Please try again.");
					await adapter.sendResponse(fallback, incoming);
				} catch {}
			} finally {
				resolve();
			}
		});
	});
}
function hasQueuedA2AContinuation(completedRun) {
	return completedRun.events.some((runEvent) => {
		const event = runEvent.event;
		return event.type === "tool_done" && event.tool === "call-agent" && String(event.result ?? "").includes("[agent-native:a2a-continuation-queued]");
	});
}
function extractRecoverableA2AArtifactToolResult(completedRun) {
	for (let i = completedRun.events.length - 1; i >= 0; i--) {
		const event = completedRun.events[i].event;
		if (event.type !== "tool_done" || event.tool !== "call-agent") continue;
		const result = String(event.result ?? "").trim();
		if (result.includes("verified artifacts already exist") && result.includes("\nArtifacts:\n")) return result;
	}
	return null;
}
function isQueuedA2AContinuationDeferral(text) {
	const normalized = text.replace(/\s+/g, " ").trim();
	if (!normalized) return true;
	if (hasSubstantiveA2APartialAnswer(text)) return false;
	if (normalized.includes("[agent-native:a2a-continuation-queued]")) return true;
	return /\b(?:still (?:working|processing)|is working on|taking longer than expected|will (?:post|update|surface|show up)|(?:it'?ll|it will|the result will|the final result will) (?:post|be posted|update|be updated|surface|show up)|will be (?:posted|updated|sent|shared)|final result when it finishes|while you wait|as soon as (?:it|it'?s|it is|the result|the artifact) (?:comes back|is ready|ready)|hang tight|relay from the .* agent)\b/i.test(normalized);
}
function hasSubstantiveA2APartialAnswer(text) {
	const withoutMarker = text.replaceAll(A2A_CONTINUATION_QUEUED_MARKER, "").trim();
	if (!withoutMarker) return false;
	if (/https?:\/\//i.test(withoutMarker)) return true;
	if (/\|\s*[-:]+\s*\|/.test(withoutMarker)) return true;
	if (/\b(?:page\s*views?|unique\s+visitors?|dashboard|artifact id|document id|deck id|source|query|bigquery|created successfully)\b/i.test(withoutMarker)) return true;
	return false;
}
/**
* Persist the user message and agent response to the thread data,
* so the conversation history is available in the web UI too.
*/
async function persistThreadData$1(threadId, userText, completedRun, thread) {
	try {
		let repo;
		try {
			repo = JSON.parse(thread?.threadData || "{}");
		} catch {
			repo = {};
		}
		if (!Array.isArray(repo.messages)) repo.messages = [];
		const userMsg = {
			id: `msg-${Date.now()}-user`,
			role: "user",
			content: [{
				type: "text",
				text: userText
			}],
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		};
		const assistantMsg = buildAssistantMessage(completedRun.events ?? [], completedRun.runId);
		repo.messages.push(userMsg);
		if (assistantMsg) repo.messages.push(assistantMsg);
		const meta = extractThreadMeta(repo);
		await updateThreadData(threadId, JSON.stringify(repo), meta.title || thread?.title || "Integration Chat", meta.preview || thread?.preview || "", repo.messages.length);
	} catch {}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/config-store.js
var _initPromise;
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		const client = getDbExec();
		await retryOnDdlRace(() => client.execute(`
          CREATE TABLE IF NOT EXISTS integration_configs (
            platform TEXT NOT NULL,
            config_key TEXT NOT NULL,
            config_data TEXT NOT NULL,
            owner TEXT,
            updated_at ${intType()} NOT NULL,
            PRIMARY KEY (platform, config_key)
          )
        `));
	})().catch((err) => {
		_initPromise = void 0;
		throw err;
	});
	return _initPromise;
}
/**
* Get the config for a platform integration.
*/
async function getIntegrationConfig(platform, configKey = "default") {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT platform, config_key, config_data, owner, updated_at FROM integration_configs WHERE platform = ? AND config_key = ?`,
		args: [platform, configKey]
	});
	if (rows.length === 0) return null;
	const row = rows[0];
	return {
		platform: row.platform,
		configKey: row.config_key,
		configData: JSON.parse(row.config_data),
		owner: row.owner ?? null,
		updatedAt: row.updated_at
	};
}
/**
* Save or update a platform integration config.
*/
async function saveIntegrationConfig(platform, configData, configKey = "default", owner) {
	await ensureTable();
	await getDbExec().execute({
		sql: isPostgres() ? `INSERT INTO integration_configs (platform, config_key, config_data, owner, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT (platform, config_key) DO UPDATE SET config_data=EXCLUDED.config_data, owner=EXCLUDED.owner, updated_at=EXCLUDED.updated_at` : `INSERT OR REPLACE INTO integration_configs (platform, config_key, config_data, owner, updated_at) VALUES (?, ?, ?, ?, ?)`,
		args: [
			platform,
			configKey,
			JSON.stringify(configData),
			owner ?? null,
			Date.now()
		]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/adapters/slack.js
/** Slack's max message length */
var SLACK_MAX_LENGTH = 4e3;
var SLACK_SECTION_TEXT_MAX_LENGTH = 3e3;
var SLACK_API_TIMEOUT_MS = 1e4;
/**
* Create a Slack platform adapter.
*
* Required env vars:
* - SLACK_BOT_TOKEN — Bot user OAuth token (xoxb-...)
* - SLACK_SIGNING_SECRET — Used to verify webhook signatures
*
* Optional env vars:
* - SLACK_ALLOWED_TEAM_IDS — Comma-separated list of Slack workspace
*   `team_id` values (e.g. "T012ABCDEF,T034GHIJKL") that this deployment
*   accepts events from. Required in production and strongly recommended
*   to prevent cross-workspace event injection (H1 in the webhook audit):
*   the global `SLACK_SIGNING_SECRET` is the same key for every workspace
*   the app is installed to, so without an allowlist any installed
*   workspace can drive the agent. When unset the adapter accepts events
*   from any workspace in development, but rejects events in production.
* - SLACK_ALLOWED_API_APP_IDS — Comma-separated list of Slack app IDs
*   (`api_app_id`) to additionally pin events to. Useful when the same
*   signing secret rotation surfaces multiple app installs.
*/
function slackAdapter() {
	return {
		platform: "slack",
		label: "Slack",
		getRequiredEnvKeys() {
			return [{
				key: "SLACK_BOT_TOKEN",
				label: "Slack Bot Token",
				required: true,
				helpText: "In your Slack app's left nav: OAuth & Permissions → Bot User OAuth Token (starts with `xoxb-`)."
			}, {
				key: "SLACK_SIGNING_SECRET",
				label: "Slack Signing Secret",
				required: true,
				helpText: "In your Slack app's left nav: Basic Information → App Credentials → Signing Secret."
			}];
		},
		async handleVerification(event) {
			const body = await readRawBodyCached(event);
			try {
				const parsed = JSON.parse(body);
				if (parsed.type === "url_verification") return {
					handled: true,
					response: parsed.challenge
				};
			} catch {}
			return { handled: false };
		},
		async verifyWebhook(event) {
			const signingSecret = process.env.SLACK_SIGNING_SECRET;
			if (!signingSecret) return false;
			const signature = getHeader(event, "x-slack-signature");
			const timestamp = getHeader(event, "x-slack-request-timestamp");
			if (!signature || !timestamp) return false;
			const ts = parseInt(timestamp, 10);
			if (Math.abs(Date.now() / 1e3 - ts) > 300) return false;
			const body = await readRawBodyCached(event);
			const crypto = await import("node:crypto");
			const basestring = `v0:${timestamp}:${body}`;
			const expectedSignature = "v0=" + crypto.createHmac("sha256", signingSecret).update(basestring).digest("hex");
			try {
				return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
			} catch {
				return false;
			}
		},
		async parseIncomingMessage(event) {
			const raw = await readRawBodyCached(event);
			let payload;
			try {
				payload = JSON.parse(raw);
			} catch {
				return null;
			}
			enforceWorkspaceAllowlist(payload);
			if (payload.type === "event_callback") {
				const e = payload.event;
				if (!e) return null;
				if (e.bot_id || e.subtype === "bot_message") return null;
				if (e.subtype === "message_changed" || e.subtype === "message_deleted") return null;
				const text = e.text?.trim();
				if (!text) return null;
				const cleanText = text.replace(/<@[A-Z0-9]+>/g, "").trim();
				if (!cleanText) return null;
				const threadTs = e.thread_ts || e.ts;
				return {
					platform: "slack",
					externalThreadId: `${e.channel}:${threadTs}`,
					text: cleanText,
					senderName: e.user,
					senderId: e.user,
					platformContext: {
						channelId: e.channel,
						threadTs,
						messageTs: e.ts,
						teamId: payload.team_id,
						eventId: payload.event_id
					},
					timestamp: Math.floor(parseFloat(e.ts) * 1e3)
				};
			}
			return null;
		},
		async postProcessingPlaceholder(incoming) {
			const token = process.env.SLACK_BOT_TOKEN;
			if (!token) return null;
			const channelId = incoming.platformContext.channelId;
			const threadTs = incoming.platformContext.threadTs;
			if (!channelId || !threadTs) return null;
			setSlackAssistantStatus(token, channelId, threadTs, "is thinking…");
			return null;
		},
		async sendResponse(message, context, opts) {
			const token = process.env.SLACK_BOT_TOKEN;
			if (!token) {
				console.error("[slack] SLACK_BOT_TOKEN not configured");
				return;
			}
			const channelId = context.platformContext.channelId;
			const threadTs = context.platformContext.threadTs;
			const blocks = message.platformContext?.blocks;
			const placeholderRef = opts?.placeholderRef;
			const chunks = splitNonEmptyMessage(message.text, SLACK_MAX_LENGTH);
			const hasProvidedBlocks = Array.isArray(blocks) && blocks.length > 0;
			const firstChunk = chunks[0] ?? (hasProvidedBlocks ? "Response" : "");
			if (!firstChunk) {
				if (threadTs) setSlackAssistantStatus(token, channelId, threadTs, "");
				return;
			}
			const restChunks = chunks.slice(1);
			const baseBody = {
				channel: channelId,
				text: firstChunk,
				blocks: blocks ?? buildResponseBlocks(firstChunk, { threadDeepLinkUrl: message.platformContext?.threadDeepLinkUrl }),
				unfurl_links: false,
				unfurl_media: false,
				mrkdwn: true
			};
			try {
				if (placeholderRef) {
					const data = await (await slackApiFetch("https://slack.com/api/chat.update", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify({
							...baseBody,
							ts: placeholderRef
						})
					})).json();
					if (!data.ok) {
						console.error("[slack] chat.update error:", data.error);
						await postFresh(token, channelId, threadTs, baseBody);
					}
				} else await postFresh(token, channelId, threadTs, baseBody);
				if (threadTs) setSlackAssistantStatus(token, channelId, threadTs, "");
				for (const chunk of restChunks) await postFresh(token, channelId, threadTs, {
					channel: channelId,
					text: chunk,
					unfurl_links: false,
					unfurl_media: false,
					mrkdwn: true
				});
			} catch (err) {
				console.error("[slack] Failed to send message:", err);
				throw err;
			}
		},
		async sendMessageToTarget(message, target) {
			const token = process.env.SLACK_BOT_TOKEN;
			if (!token) {
				console.error("[slack] SLACK_BOT_TOKEN not configured");
				return;
			}
			const chunks = splitNonEmptyMessage(message.text, SLACK_MAX_LENGTH);
			if (chunks.length === 0) return;
			for (const chunk of chunks) {
				const body = {
					channel: target.destination,
					text: chunk
				};
				if (target.threadRef) body.thread_ts = target.threadRef;
				try {
					const data = await (await slackApiFetch("https://slack.com/api/chat.postMessage", {
						method: "POST",
						headers: {
							Authorization: `Bearer ${token}`,
							"Content-Type": "application/json"
						},
						body: JSON.stringify(body)
					})).json();
					if (!data.ok) throw new Error(data.error || "chat.postMessage failed");
				} catch (err) {
					console.error("[slack] Failed to send proactive message:", err);
					throw err;
				}
			}
		},
		formatAgentResponse(text, opts) {
			return {
				text: markdownToSlackMrkdwn(text),
				platformContext: opts?.threadDeepLinkUrl ? { threadDeepLinkUrl: opts.threadDeepLinkUrl } : {}
			};
		},
		async getStatus(baseUrl) {
			const hasToken = !!process.env.SLACK_BOT_TOKEN;
			const hasSecret = !!process.env.SLACK_SIGNING_SECRET;
			const configured = hasToken && hasSecret;
			return {
				platform: "slack",
				label: "Slack",
				enabled: false,
				configured,
				details: {
					hasToken,
					hasSecret
				},
				error: !configured ? "Set SLACK_BOT_TOKEN and SLACK_SIGNING_SECRET in your environment" : void 0
			};
		}
	};
}
/**
* Parse a comma-separated env var into a Set of trimmed, non-empty values.
* Returns null when the env var is unset or empty (so callers can
* distinguish "no allowlist configured" from "empty allowlist").
*/
function parseAllowlistEnv(name) {
	const raw = process.env[name];
	if (!raw) return null;
	const values = raw.split(",").map((v) => v.trim()).filter((v) => v.length > 0);
	if (values.length === 0) return null;
	return new Set(values);
}
var _missingAllowlistWarned = false;
/**
* Enforce that an incoming Slack event comes from an allowlisted workspace.
*
* H1 in the webhook audit: the framework uses a SINGLE global
* SLACK_SIGNING_SECRET for every workspace the Slack app is installed to,
* so a valid signature alone doesn't prove the request belongs to the
* tenant the deployment intends to serve. This helper layers a per-tenant
* allowlist on top of signature verification.
*
* Behavior:
* - If `SLACK_ALLOWED_TEAM_IDS` is set: reject any payload whose
*   `team_id` isn't in the list.
* - If `SLACK_ALLOWED_API_APP_IDS` is set: also reject payloads whose
*   `api_app_id` isn't in the list (bot apps can be installed under the
*   same Slack app id across multiple workspaces — pinning both keeps
*   the surface tight when team_id allows multiple workspaces).
* - If `SLACK_ALLOWED_TEAM_IDS` is unset/empty in production: reject the
*   event. Production must fail closed so any workspace with the shared
*   signing secret cannot drive the agent.
* - If `SLACK_ALLOWED_TEAM_IDS` is unset/empty in dev / single-tenant: log a
*   one-time warning and accept (current local setup behavior).
*
* Throws an h3 401 error when an allowlisted-but-mismatched payload is
* received, which the integrations plugin surfaces to the caller as
* "Unrecognized Slack workspace" without enqueuing the event.
*/
function enforceWorkspaceAllowlist(payload) {
	const teamId = typeof payload?.team_id === "string" ? payload.team_id : void 0;
	const apiAppId = typeof payload?.api_app_id === "string" ? payload.api_app_id : void 0;
	const allowedTeamIds = parseAllowlistEnv("SLACK_ALLOWED_TEAM_IDS");
	const allowedAppIds = parseAllowlistEnv("SLACK_ALLOWED_API_APP_IDS");
	if (!allowedTeamIds) {
		if (process.env.NODE_ENV === "production") throw createError({
			statusCode: 401,
			statusMessage: "Slack workspace allowlist is not configured"
		});
		if (!_missingAllowlistWarned) {
			_missingAllowlistWarned = true;
			console.warn("[slack] SLACK_ALLOWED_TEAM_IDS not set — accepting events from any workspace whose signature matches SLACK_SIGNING_SECRET. Set SLACK_ALLOWED_TEAM_IDS to a comma-separated list of allowed team_id values before deploying to production.");
		}
	}
	if (allowedTeamIds) {
		if (!teamId || !allowedTeamIds.has(teamId)) throw createError({
			statusCode: 401,
			statusMessage: "Unrecognized Slack workspace"
		});
	}
	if (allowedAppIds) {
		if (!apiAppId || !allowedAppIds.has(apiAppId)) throw createError({
			statusCode: 401,
			statusMessage: "Unrecognized Slack workspace"
		});
	}
}
/**
* Read the raw request body as a string and cache on the event context.
*
* This MUST read raw bytes from the request stream — never `JSON.stringify`
* a parsed body, because Slack's HMAC is computed over the exact bytes Slack
* sent. Re-stringifying a parsed object loses key ordering, whitespace, and
* Unicode-escape choices, so the signature check would silently fail for
* legitimate requests (M2 in the webhook security audit).
*
* h3 v2's body stream is consume-once, so we cache the raw string on the
* event context after the first read. All call sites (handleVerification,
* verifyWebhook, parseIncomingMessage) MUST go through this helper.
*/
async function readRawBodyCached(event) {
	const cached = event.context.__rawBody;
	if (typeof cached === "string") return cached;
	const raw = await readRawBody$2(event) ?? "";
	event.context.__rawBody = raw;
	return raw;
}
function utf8ByteLength(text) {
	return new TextEncoder().encode(text).length;
}
function prefixWithinUtf8ByteLimit(text, maxLength) {
	let bytes = 0;
	let end = 0;
	for (const char of text) {
		const nextBytes = utf8ByteLength(char);
		if (bytes + nextBytes > maxLength) break;
		bytes += nextBytes;
		end += char.length;
	}
	return text.slice(0, end || 1);
}
/** Split a message into chunks that fit within the platform's byte limit. */
function splitMessage$3(text, maxLength) {
	if (utf8ByteLength(text) <= maxLength) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > 0) {
		if (utf8ByteLength(remaining) <= maxLength) {
			chunks.push(remaining);
			break;
		}
		const prefix = prefixWithinUtf8ByteLimit(remaining, maxLength);
		let splitIdx = prefix.lastIndexOf("\n");
		if (splitIdx <= 0) splitIdx = prefix.lastIndexOf(" ");
		if (splitIdx <= 0) splitIdx = prefix.length;
		chunks.push(remaining.slice(0, splitIdx));
		remaining = remaining.slice(splitIdx).trimStart();
	}
	return chunks;
}
/** Split a message and drop chunks Slack would render as blank messages. */
function splitNonEmptyMessage(text, maxLength) {
	return splitMessage$3(text, maxLength).filter((chunk) => chunk.trim().length > 0);
}
/** Hard cap on input length we feed to the regex-based mrkdwn converter.
*  L2 in the webhook audit: `\*\*(.+?)\*\*` with the `s` flag on a long
*  string of asterisks can exhibit super-linear backtracking. Slack
*  itself caps message bodies at 4000 chars (SLACK_MAX_LENGTH); we cap
*  the input here at 10x that as a defensive bound for any caller that
*  passes a longer rendering source through this helper before chunking. */
var MRKDWN_MAX_LENGTH = 4e4;
/**
* Convert standard markdown to Slack's mrkdwn dialect.
* - `[text](url)` → `<url|text>`
* - `**bold**` → `*bold*` (Slack uses single asterisks for bold)
*
* Inputs longer than MRKDWN_MAX_LENGTH are truncated before the regex
* pass to bound worst-case backtracking on pathological input (L2 in the
* webhook audit).
*/
function markdownToSlackMrkdwn(text) {
	return (text.length > MRKDWN_MAX_LENGTH ? text.slice(0, MRKDWN_MAX_LENGTH) : text).replace(/\[([^\]]+)\]\(([^)]+)\)/g, "<$2|$1>").replace(/\*\*<?(https?:\/\/[^\s>*]+)>?\*\*/g, "<$1>").replace(/\*\*([^*]{1,5000})\*\*/g, "*$1*");
}
/**
* Optionally set Slack's native AI-assistant status indicator (the small
* "is thinking…" line under the message composer) for an app configured
* with the `assistant:write` scope. Pure best-effort — fails silently for
* apps that aren't set up as AI assistants.
*/
function setSlackAssistantStatus(token, channelId, threadTs, status) {
	slackApiFetch("https://slack.com/api/assistant.threads.setStatus", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			channel_id: channelId,
			thread_ts: threadTs,
			status
		})
	}).catch(() => {});
}
/**
* Block Kit payload for the final answer. We avoid auto-unfurl previews by
* separating the deep-link out into a button instead of inlining it as a
* `<url|text>` markdown link in the section body — that's what was producing
* the giant "Agent-Native Dispatch" card in every thread reply.
*/
function buildResponseBlocks(text, opts) {
	const blocks = splitMessage$3(text || "_(no response)_", SLACK_SECTION_TEXT_MAX_LENGTH).map((chunk) => ({
		type: "section",
		text: {
			type: "mrkdwn",
			text: chunk
		}
	}));
	if (opts.threadDeepLinkUrl) blocks.push({
		type: "actions",
		elements: [{
			type: "button",
			text: {
				type: "plain_text",
				text: "Open thread",
				emoji: true
			},
			url: opts.threadDeepLinkUrl,
			action_id: "open_dispatch_thread"
		}]
	});
	return blocks;
}
/**
* Post a fresh message to a thread. Used as the placeholder-fallback path
* (e.g. when chat.update fails) and for follow-up overflow chunks.
*/
async function postFresh(token, channelId, threadTs, body) {
	const hasBlocks = Array.isArray(body.blocks) && body.blocks.length > 0;
	if (typeof body.text === "string" && body.text.trim().length === 0 && !hasBlocks) return;
	const payload = {
		...body,
		channel: channelId
	};
	if (threadTs && !payload.thread_ts) payload.thread_ts = threadTs;
	const data = await (await slackApiFetch("https://slack.com/api/chat.postMessage", {
		method: "POST",
		headers: {
			Authorization: `Bearer ${token}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify(payload)
	})).json();
	if (!data.ok) {
		console.error("[slack] chat.postMessage error:", data.error);
		throw new Error(data.error || "chat.postMessage failed");
	}
}
async function slackApiFetch(url, init) {
	const controller = typeof AbortController !== "undefined" ? new AbortController() : void 0;
	const timer = controller ? setTimeout(() => controller.abort(), SLACK_API_TIMEOUT_MS) : void 0;
	try {
		return await fetch(url, {
			...init,
			signal: controller?.signal ?? init.signal
		});
	} finally {
		if (timer) clearTimeout(timer);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/adapters/telegram.js
/** Telegram's max message length */
var TELEGRAM_MAX_LENGTH = 4096;
/**
* One-shot warning flag — log once per process when accepting unverified
* webhooks (M6 in the webhook security audit).
*/
var _telegramUnverifiedWarned = false;
/**
* Returns true when the deployment is running in production mode and the
* operator has NOT explicitly opted into accepting unverified webhooks for
* local testing. In production we MUST refuse webhooks whose secret is
* unset — otherwise an attacker can drive the agent loop with arbitrary
* messages (C2 in the webhook security audit).
*/
function shouldRefuseWhenSecretMissing$2() {
	if (process.env.AGENT_NATIVE_ALLOW_UNVERIFIED_WEBHOOKS === "1") return false;
	return process.env.NODE_ENV === "production";
}
/**
* Create a Telegram platform adapter.
*
* Required env vars:
* - TELEGRAM_BOT_TOKEN — Bot token from @BotFather
*
* Optional env vars:
* - TELEGRAM_WEBHOOK_SECRET — Secret token for webhook verification
*/
function telegramAdapter() {
	return {
		platform: "telegram",
		label: "Telegram",
		getRequiredEnvKeys() {
			return [{
				key: "TELEGRAM_BOT_TOKEN",
				label: "Telegram Bot Token",
				required: true,
				helpText: "From @BotFather after `/newbot` — the long token Telegram gives you (looks like `123456:ABC-DEF...`)."
			}, {
				key: "TELEGRAM_WEBHOOK_SECRET",
				label: "Telegram Webhook Secret",
				required: false,
				helpText: "Optional. Any random string — Telegram will echo it on every webhook so dispatch can verify the request came from Telegram."
			}];
		},
		async handleVerification(event) {
			try {
				if (!event.context.__rawBody) {
					const body = await readBody(event);
					event.context.__rawBody = body;
				}
			} catch {}
			return { handled: false };
		},
		async verifyWebhook(event) {
			const secret = process.env.TELEGRAM_WEBHOOK_SECRET;
			if (!secret) {
				if (shouldRefuseWhenSecretMissing$2()) {
					if (!_telegramUnverifiedWarned) {
						_telegramUnverifiedWarned = true;
						console.error("[telegram] TELEGRAM_WEBHOOK_SECRET not set — refusing webhook in production. Set TELEGRAM_WEBHOOK_SECRET, or set AGENT_NATIVE_ALLOW_UNVERIFIED_WEBHOOKS=1 for local testing only.");
					}
					return false;
				}
				if (!_telegramUnverifiedWarned) {
					_telegramUnverifiedWarned = true;
					console.warn("[telegram] TELEGRAM_WEBHOOK_SECRET not set — accepting webhook without verification (dev mode)");
				}
				return !!process.env.TELEGRAM_BOT_TOKEN;
			}
			const headerSecret = getHeader(event, "x-telegram-bot-api-secret-token");
			if (!headerSecret) return false;
			try {
				return (await import("node:crypto")).timingSafeEqual(Buffer.from(secret), Buffer.from(headerSecret));
			} catch {
				return false;
			}
		},
		async parseIncomingMessage(event) {
			const body = event.context.__rawBody ?? await readBody(event);
			if (!body) return null;
			const message = body.message || body.edited_message;
			if (!message) return null;
			const text = message.text?.trim();
			if (!text) return null;
			const cleanText = text === "/start" ? "Hello! I'm ready to chat." : text.replace(/^\/\w+\s*/, "").trim() || text;
			const chat = message.chat;
			const from = message.from;
			return {
				platform: "telegram",
				externalThreadId: String(chat.id),
				text: cleanText,
				senderName: from?.first_name + (from?.last_name ? ` ${from.last_name}` : ""),
				senderId: String(from?.id),
				platformContext: {
					chatId: chat.id,
					chatType: chat.type,
					messageId: message.message_id,
					fromId: from?.id,
					fromUsername: from?.username
				},
				timestamp: message.date * 1e3
			};
		},
		async sendResponse(message, context) {
			const token = process.env.TELEGRAM_BOT_TOKEN;
			if (!token) {
				console.error("[telegram] TELEGRAM_BOT_TOKEN not configured");
				return;
			}
			const chatId = context.platformContext.chatId;
			const chunks = splitMessage$2(message.text, TELEGRAM_MAX_LENGTH);
			for (const chunk of chunks) try {
				const data = await (await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						chat_id: chatId,
						text: chunk,
						parse_mode: "Markdown"
					})
				})).json();
				if (!data.ok) if (data.description?.includes("parse")) await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						chat_id: chatId,
						text: chunk
					})
				});
				else console.error("[telegram] sendMessage error:", data.description);
			} catch (err) {
				console.error("[telegram] Failed to send message:", err);
			}
		},
		async sendMessageToTarget(message, target) {
			const token = process.env.TELEGRAM_BOT_TOKEN;
			if (!token) {
				console.error("[telegram] TELEGRAM_BOT_TOKEN not configured");
				return;
			}
			const chunks = splitMessage$2(message.text, TELEGRAM_MAX_LENGTH);
			for (const chunk of chunks) {
				const body = {
					chat_id: target.destination,
					text: chunk
				};
				if (target.threadRef) body.message_thread_id = target.threadRef;
				try {
					const data = await (await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
						method: "POST",
						headers: { "Content-Type": "application/json" },
						body: JSON.stringify(body)
					})).json();
					if (!data.ok) throw new Error(data.description || "sendMessage failed");
				} catch (err) {
					console.error("[telegram] Failed to send proactive message:", err);
					throw err;
				}
			}
		},
		formatAgentResponse(text) {
			return {
				text: text.replace(/\*\*(.+?)\*\*/gs, "*$1*"),
				platformContext: { parse_mode: "Markdown" }
			};
		},
		async getStatus(_baseUrl) {
			const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;
			let botName;
			if (hasToken) try {
				const data = await (await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/getMe`)).json();
				if (data.ok) botName = data.result?.username;
			} catch {}
			return {
				platform: "telegram",
				label: "Telegram",
				enabled: false,
				configured: hasToken,
				details: {
					hasToken,
					botUsername: botName
				},
				error: !hasToken ? "Set TELEGRAM_BOT_TOKEN in your environment" : void 0
			};
		}
	};
}
/** Split a message into chunks that fit within the platform's limit */
function splitMessage$2(text, maxLength) {
	if (text.length <= maxLength) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > 0) {
		if (remaining.length <= maxLength) {
			chunks.push(remaining);
			break;
		}
		let splitIdx = remaining.lastIndexOf("\n", maxLength);
		if (splitIdx <= 0) splitIdx = remaining.lastIndexOf(" ", maxLength);
		if (splitIdx <= 0) splitIdx = maxLength;
		chunks.push(remaining.slice(0, splitIdx));
		remaining = remaining.slice(splitIdx).trimStart();
	}
	return chunks;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/adapters/whatsapp.js
/** WhatsApp's max message length */
var WHATSAPP_MAX_LENGTH = 4096;
/**
* One-shot warning flag — log once per process when accepting unverified
* webhooks (M6 in the webhook security audit).
*/
var _whatsappUnverifiedWarned = false;
/**
* Returns true when the deployment is running in production mode and the
* operator has NOT explicitly opted into accepting unverified webhooks for
* local testing. In production we MUST refuse webhooks whose signature can't
* be verified (C2 in the webhook security audit).
*/
function shouldRefuseWhenSecretMissing$1() {
	if (process.env.AGENT_NATIVE_ALLOW_UNVERIFIED_WEBHOOKS === "1") return false;
	return process.env.NODE_ENV === "production";
}
/**
* Create a WhatsApp Cloud API platform adapter.
*
* Required env vars:
* - WHATSAPP_ACCESS_TOKEN — Permanent access token from Meta
* - WHATSAPP_VERIFY_TOKEN — Custom token for webhook verification
* - WHATSAPP_PHONE_NUMBER_ID — Phone number ID from Meta dashboard
*
* Optional env vars:
* - WHATSAPP_APP_SECRET — App secret for signature verification
*/
function whatsappAdapter() {
	return {
		platform: "whatsapp",
		label: "WhatsApp",
		getRequiredEnvKeys() {
			return [
				{
					key: "WHATSAPP_ACCESS_TOKEN",
					label: "WhatsApp Access Token",
					required: true,
					helpText: "From your Meta app → WhatsApp → API Setup → Permanent access token. Generate one under System Users for production use."
				},
				{
					key: "WHATSAPP_VERIFY_TOKEN",
					label: "WhatsApp Verify Token",
					required: true,
					helpText: "Any random string you choose. You'll paste the same value into Meta's webhook configuration so Meta can confirm dispatch owns the URL."
				},
				{
					key: "WHATSAPP_PHONE_NUMBER_ID",
					label: "WhatsApp Phone Number ID",
					required: true,
					helpText: "From your Meta app → WhatsApp → API Setup. The numeric Phone number ID (not the actual phone number)."
				},
				{
					key: "WHATSAPP_APP_SECRET",
					label: "WhatsApp App Secret",
					required: false,
					helpText: "Optional. From Meta App Dashboard → Basic Settings → App Secret. Enables HMAC signature verification on inbound webhooks."
				}
			];
		},
		async handleVerification(event) {
			if ((event.node?.req?.method || "POST") === "POST") {
				try {
					await readRawBody$1(event);
				} catch {}
				return { handled: false };
			}
			const query = getQuery(event);
			const mode = query["hub.mode"];
			const token = query["hub.verify_token"];
			const challenge = query["hub.challenge"];
			const expected = process.env.WHATSAPP_VERIFY_TOKEN;
			if (mode === "subscribe" && expected && typeof token === "string") {
				const a = Buffer.from(String(token));
				const b = Buffer.from(String(expected));
				if (a.length === b.length) try {
					if ((await import("node:crypto")).timingSafeEqual(a, b)) return {
						handled: true,
						response: challenge
					};
				} catch {}
			}
			return { handled: false };
		},
		async verifyWebhook(event) {
			const appSecret = process.env.WHATSAPP_APP_SECRET;
			if (!appSecret) {
				if (shouldRefuseWhenSecretMissing$1()) {
					if (!_whatsappUnverifiedWarned) {
						_whatsappUnverifiedWarned = true;
						console.error("[whatsapp] WHATSAPP_APP_SECRET not set — refusing webhook in production. Set WHATSAPP_APP_SECRET, or set AGENT_NATIVE_ALLOW_UNVERIFIED_WEBHOOKS=1 for local testing only.");
					}
					return false;
				}
				if (!_whatsappUnverifiedWarned) {
					_whatsappUnverifiedWarned = true;
					console.warn("[whatsapp] WHATSAPP_APP_SECRET not set — accepting webhook without verification (dev mode)");
				}
				return !!process.env.WHATSAPP_ACCESS_TOKEN;
			}
			const signature = getHeader(event, "x-hub-signature-256");
			if (!signature) return false;
			const body = await readRawBody$1(event);
			const crypto = await import("node:crypto");
			const expectedSignature = "sha256=" + crypto.createHmac("sha256", appSecret).update(body).digest("hex");
			try {
				return crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expectedSignature));
			} catch {
				return false;
			}
		},
		async parseIncomingMessage(event) {
			const raw = await readRawBody$1(event);
			if (!raw) return null;
			let body;
			try {
				body = JSON.parse(raw);
			} catch {
				return null;
			}
			if (!body) return null;
			const entry = body.entry?.[0];
			if (!entry) return null;
			const changes = entry.changes?.[0];
			if (!changes || changes.field !== "messages") return null;
			const value = changes.value;
			const message = value?.messages?.[0];
			if (!message) return null;
			if (message.type !== "text") return null;
			const text = message.text?.body?.trim();
			if (!text) return null;
			const contact = value.contacts?.[0];
			const from = message.from;
			return {
				platform: "whatsapp",
				externalThreadId: from,
				text,
				senderName: contact?.profile?.name,
				senderId: from,
				platformContext: {
					phoneNumberId: value.metadata?.phone_number_id,
					displayPhoneNumber: value.metadata?.display_phone_number,
					messageId: message.id,
					from,
					timestamp: message.timestamp
				},
				timestamp: parseInt(message.timestamp, 10) * 1e3
			};
		},
		async sendResponse(message, context) {
			const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;
			const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
			if (!accessToken || !phoneNumberId) {
				console.error("[whatsapp] WHATSAPP_ACCESS_TOKEN or WHATSAPP_PHONE_NUMBER_ID not configured");
				return;
			}
			const to = context.senderId;
			const chunks = splitMessage$1(message.text, WHATSAPP_MAX_LENGTH);
			for (const chunk of chunks) try {
				const res = await fetch(`https://graph.facebook.com/v21.0/${phoneNumberId}/messages`, {
					method: "POST",
					headers: {
						Authorization: `Bearer ${accessToken}`,
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						messaging_product: "whatsapp",
						recipient_type: "individual",
						to,
						type: "text",
						text: { body: chunk }
					})
				});
				if (!res.ok) {
					const data = await res.json().catch(() => ({}));
					console.error("[whatsapp] sendMessage error:", data);
				}
			} catch (err) {
				console.error("[whatsapp] Failed to send message:", err);
			}
		},
		formatAgentResponse(text) {
			return {
				text,
				platformContext: {}
			};
		},
		async getStatus(_baseUrl) {
			const hasAccessToken = !!process.env.WHATSAPP_ACCESS_TOKEN;
			const hasVerifyToken = !!process.env.WHATSAPP_VERIFY_TOKEN;
			const hasPhoneNumberId = !!process.env.WHATSAPP_PHONE_NUMBER_ID;
			const configured = hasAccessToken && hasVerifyToken && hasPhoneNumberId;
			return {
				platform: "whatsapp",
				label: "WhatsApp",
				enabled: false,
				configured,
				details: {
					hasAccessToken,
					hasVerifyToken,
					hasPhoneNumberId
				},
				error: !configured ? "Set WHATSAPP_ACCESS_TOKEN, WHATSAPP_VERIFY_TOKEN, and WHATSAPP_PHONE_NUMBER_ID" : void 0
			};
		}
	};
}
/**
* Read the raw request body as a string and cache it on the event context.
*
* Reads raw bytes from the request stream, NEVER `JSON.stringify`s a parsed
* body — Meta's signature is computed over the exact bytes Meta sent
* (M2/M3 in the webhook security audit). h3 v2's body stream is consume-once
* so we cache the raw string after the first read.
*/
async function readRawBody$1(event) {
	const cached = event.context.__rawBody;
	if (typeof cached === "string") return cached;
	const raw = await readRawBody$2(event) ?? "";
	event.context.__rawBody = raw;
	return raw;
}
function splitMessage$1(text, maxLength) {
	if (text.length <= maxLength) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > 0) {
		if (remaining.length <= maxLength) {
			chunks.push(remaining);
			break;
		}
		let splitIdx = remaining.lastIndexOf("\n", maxLength);
		if (splitIdx <= 0) splitIdx = remaining.lastIndexOf(" ", maxLength);
		if (splitIdx <= 0) splitIdx = maxLength;
		chunks.push(remaining.slice(0, splitIdx));
		remaining = remaining.slice(splitIdx).trimStart();
	}
	return chunks;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/adapters/google-docs.js
/** Google Docs comment replies have no formal length limit but keep it reasonable */
var GDOCS_MAX_LENGTH = 4e3;
var cachedToken = null;
/**
* Parse the service account key from env.
* Supports both a JSON string and a file path.
*/
function getServiceAccountKey() {
	const raw = process.env.GOOGLE_SERVICE_ACCOUNT_KEY;
	if (!raw) return null;
	try {
		return JSON.parse(raw);
	} catch {
		try {
			const content = __require("node:fs").readFileSync(raw, "utf-8");
			return JSON.parse(content);
		} catch {
			return null;
		}
	}
}
/**
* Get the service account email for display (users share docs with this).
*/
function getServiceAccountEmail() {
	return getServiceAccountKey()?.client_email ?? null;
}
/**
* Create a signed JWT and exchange it for an access token.
*/
async function getServiceAccountAccessToken() {
	if (cachedToken && Date.now() < cachedToken.expiresAt - 6e4) return cachedToken.token;
	const key = getServiceAccountKey();
	if (!key) return null;
	try {
		const crypto = await import("node:crypto");
		const now = Math.floor(Date.now() / 1e3);
		const header = {
			alg: "RS256",
			typ: "JWT"
		};
		const payload = {
			iss: key.client_email,
			scope: "https://www.googleapis.com/auth/drive",
			aud: key.token_uri || "https://oauth2.googleapis.com/token",
			iat: now,
			exp: now + 3600
		};
		const encode = (obj) => Buffer.from(JSON.stringify(obj)).toString("base64url");
		const unsigned = `${encode(header)}.${encode(payload)}`;
		const signer = crypto.createSign("RSA-SHA256");
		signer.update(unsigned);
		const jwt = `${unsigned}.${signer.sign(key.private_key, "base64url")}`;
		const res = await fetch("https://oauth2.googleapis.com/token", {
			method: "POST",
			headers: { "Content-Type": "application/x-www-form-urlencoded" },
			body: new URLSearchParams({
				grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
				assertion: jwt
			})
		});
		if (!res.ok) {
			const err = await res.text();
			console.error("[google-docs] Token exchange failed:", err);
			return null;
		}
		const data = await res.json();
		cachedToken = {
			token: data.access_token,
			expiresAt: Date.now() + data.expires_in * 1e3
		};
		return data.access_token;
	} catch (err) {
		console.error("[google-docs] Failed to get service account token:", err);
		return null;
	}
}
/**
* List comments on a Google Doc, optionally filtering by modified time.
*/
async function listDocComments(fileId, accessToken, startModifiedTime) {
	const params = new URLSearchParams({
		fields: "comments(id,content,author,createdTime,modifiedTime,resolved,quotedFileContent,replies(id,content,author,createdTime))",
		pageSize: "100"
	});
	if (startModifiedTime) params.set("startModifiedTime", startModifiedTime);
	const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/comments?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } });
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Failed to list comments: ${err}`);
	}
	return (await res.json()).comments ?? [];
}
/**
* Reply to a comment on a Google Doc.
*/
async function replyToComment(fileId, commentId, content, accessToken) {
	const res = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}/comments/${commentId}/replies`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${accessToken}`,
			"Content-Type": "application/json"
		},
		body: JSON.stringify({
			content,
			fields: "id"
		})
	});
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Failed to reply to comment: ${err}`);
	}
}
/**
* Get the start page token for changes.list (initial sync point).
*/
async function getStartPageToken(accessToken) {
	const res = await fetch("https://www.googleapis.com/drive/v3/changes/startPageToken", { headers: { Authorization: `Bearer ${accessToken}` } });
	if (!res.ok) throw new Error("Failed to get start page token");
	return (await res.json()).startPageToken;
}
/**
* List changes since a page token. Returns changed file IDs and the next token.
*/
async function listChanges(pageToken, accessToken) {
	const params = new URLSearchParams({
		pageToken,
		fields: "nextPageToken,newStartPageToken,changes(fileId,removed,file(id,name,mimeType))",
		pageSize: "100",
		includeRemoved: "false"
	});
	const res = await fetch(`https://www.googleapis.com/drive/v3/changes?${params}`, { headers: { Authorization: `Bearer ${accessToken}` } });
	if (!res.ok) {
		const err = await res.text();
		throw new Error(`Failed to list changes: ${err}`);
	}
	const data = await res.json();
	return {
		changes: data.changes ?? [],
		nextPageToken: data.nextPageToken || data.newStartPageToken || pageToken
	};
}
/**
* Create a Google Docs platform adapter.
*
* Unlike Slack/Telegram, this adapter is poll-driven — the poller
* constructs IncomingMessage objects and feeds them through the
* webhook handler. The adapter handles formatting and sending replies.
*
* Setup:
* - Set GOOGLE_SERVICE_ACCOUNT_KEY (JSON string or file path) in env
* - Users share their Google Docs with the service account email
* - Comments containing the trigger keyword (default: "@agent") are processed
*/
function googleDocsAdapter() {
	return {
		platform: "google-docs",
		label: "Google Docs",
		getRequiredEnvKeys() {
			return [{
				key: "GOOGLE_SERVICE_ACCOUNT_KEY",
				label: "Google Service Account Key (JSON)",
				required: true
			}];
		},
		async handleVerification(_event) {
			return { handled: false };
		},
		async verifyWebhook(_event) {
			return true;
		},
		async parseIncomingMessage(_event) {
			return null;
		},
		async sendResponse(message, context) {
			const fileId = context.platformContext.fileId;
			const commentId = context.platformContext.commentId;
			const accessToken = await getServiceAccountAccessToken();
			if (!accessToken) {
				console.error("[google-docs] No access token available to send reply");
				return;
			}
			const chunks = splitMessage(message.text, GDOCS_MAX_LENGTH);
			for (const chunk of chunks) try {
				await replyToComment(fileId, commentId, chunk, accessToken);
			} catch (err) {
				console.error("[google-docs] Failed to send reply:", err);
			}
		},
		formatAgentResponse(text) {
			return {
				text,
				platformContext: {}
			};
		},
		async getStatus(_baseUrl) {
			const key = getServiceAccountKey();
			const configured = !!key;
			return {
				platform: "google-docs",
				label: "Google Docs",
				enabled: false,
				configured,
				details: { serviceAccountEmail: key?.client_email },
				error: !configured ? "Set GOOGLE_SERVICE_ACCOUNT_KEY in your environment (JSON string or file path to the key file)" : void 0
			};
		}
	};
}
/** Split a message into chunks that fit within the platform's limit */
function splitMessage(text, maxLength) {
	if (text.length <= maxLength) return [text];
	const chunks = [];
	let remaining = text;
	while (remaining.length > 0) {
		if (remaining.length <= maxLength) {
			chunks.push(remaining);
			break;
		}
		let splitIdx = remaining.lastIndexOf("\n", maxLength);
		if (splitIdx <= 0) splitIdx = remaining.lastIndexOf(" ", maxLength);
		if (splitIdx <= 0) splitIdx = maxLength;
		chunks.push(remaining.slice(0, splitIdx));
		remaining = remaining.slice(splitIdx).trimStart();
	}
	return chunks;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/adapters/email.js
/** Max body length before truncation */
var EMAIL_MAX_BODY_LENGTH = 15e3;
/** Rate limit: max emails per sender within the window */
var RATE_LIMIT_MAX = 20;
/** Rate limit window in ms (1 hour) */
var RATE_LIMIT_WINDOW_MS = 3600 * 1e3;
/**
* One-shot warning flags so we don't spam logs on every webhook.
* Cleared per process — one warning per cold start is enough to surface
* a misconfiguration without leaking config status to anyone with log access
* (M6 in the webhook security audit).
*/
var _resendUnverifiedWarned = false;
var _sendgridUnverifiedWarned = false;
/**
* Returns true when the deployment is running in production mode and the
* operator has NOT explicitly opted into accepting unverified webhooks for
* local testing. In production we MUST refuse webhooks whose signature can't
* be verified — accepting them with attacker-controlled `from:` addresses
* lets the dispatch owner-resolution path run as the victim (C1 in the
* webhook security audit).
*/
function shouldRefuseWhenSecretMissing() {
	if (process.env.AGENT_NATIVE_ALLOW_UNVERIFIED_WEBHOOKS === "1") return false;
	return process.env.NODE_ENV === "production";
}
/**
* Create an Email platform adapter for inbound/outbound email via
* Resend or SendGrid webhooks.
*
* Required env vars:
* - EMAIL_AGENT_ADDRESS — The email address the agent receives mail at
*
* One of these must also be set (checked via isEmailConfigured()):
* - RESEND_API_KEY — For sending/receiving via Resend
* - SENDGRID_API_KEY — For sending/receiving via SendGrid
*
* Optional:
* - EMAIL_INBOUND_WEBHOOK_SECRET — Webhook signature verification secret
*/
function emailAdapter() {
	return {
		platform: "email",
		label: "Email",
		getRequiredEnvKeys() {
			return [
				{
					key: "EMAIL_AGENT_ADDRESS",
					label: "Agent Email Address",
					required: true,
					helpText: "The email address people will use to message your agent (e.g. `agent@yourcompany.com`, or pick from your `<slug>.resend.app` sandbox)."
				},
				{
					key: "RESEND_API_KEY",
					label: "Resend API Key",
					required: false,
					helpText: "From resend.com → API keys (starts with `re_`). Either Resend or SendGrid is required for sending and receiving mail."
				},
				{
					key: "SENDGRID_API_KEY",
					label: "SendGrid API Key",
					required: false,
					helpText: "From sendgrid.com → Settings → API Keys (starts with `SG.`). Either Resend or SendGrid is required."
				},
				{
					key: "EMAIL_INBOUND_WEBHOOK_SECRET",
					label: "Inbound Webhook Secret",
					required: false,
					helpText: "Optional. From Resend (Webhooks → Signing Secret, starts with `whsec_`) or your SendGrid Inbound Parse basic-auth password. Used to verify inbound webhooks are real."
				}
			];
		},
		async handleVerification(_event) {
			return { handled: false };
		},
		async verifyWebhook(event) {
			const secret = process.env.EMAIL_INBOUND_WEBHOOK_SECRET;
			const provider = getEmailProvider();
			if (provider === "resend") return verifyResendWebhook(event, secret);
			if (provider === "sendgrid") return verifySendGridWebhook(event, secret);
			console.warn("[email] No email provider configured, rejecting webhook");
			return false;
		},
		async parseIncomingMessage(event) {
			const provider = getEmailProvider();
			const agentAddress = process.env.EMAIL_AGENT_ADDRESS?.toLowerCase();
			if (!agentAddress) {
				console.warn("[email] EMAIL_AGENT_ADDRESS not configured");
				return null;
			}
			let parsed = null;
			if (provider === "resend") parsed = await parseResendWebhook(event);
			else if (provider === "sendgrid") parsed = await parseSendGridWebhook(event);
			if (!parsed) return null;
			const senderEmail = parsed.from.email.toLowerCase();
			if (await isRateLimited(senderEmail)) {
				console.warn(`[email] Rate limited sender: ${senderEmail} (>${RATE_LIMIT_MAX}/hr)`);
				return null;
			}
			const config = await getIntegrationConfig("email");
			if (config?.configData?.allowedDomains) {
				const allowed = config.configData.allowedDomains;
				if (allowed.length > 0) {
					const senderDomain = senderEmail.split("@")[1];
					if (!senderDomain || !allowed.includes(senderDomain)) {
						console.warn(`[email] Rejected email from ${senderEmail}: domain not in allowedDomains`);
						return null;
					}
				}
			}
			const toAddresses = parsed.to.map((a) => a.toLowerCase());
			const ccAddresses = (parsed.cc ?? []).map((a) => a.toLowerCase());
			const isCC = !toAddresses.includes(agentAddress) && ccAddresses.includes(agentAddress);
			const threadRootId = scopeThreadIdToSender(getThreadRootId(parsed.messageId, parsed.references), senderEmail);
			let bodyText = parsed.text || stripHtmlForPlainText(parsed.html || "");
			if (bodyText.length > EMAIL_MAX_BODY_LENGTH) bodyText = bodyText.slice(0, EMAIL_MAX_BODY_LENGTH) + "\n[Message truncated]";
			if (isCC) bodyText = `[CC'd on email between ${senderEmail} and ${toAddresses.filter((a) => a !== agentAddress).join(", ") || "others"}]\nSubject: ${parsed.subject}\n\n` + bodyText;
			return {
				platform: "email",
				externalThreadId: threadRootId,
				text: bodyText,
				senderName: parsed.from.name,
				senderId: senderEmail,
				platformContext: {
					messageId: parsed.messageId,
					subject: parsed.subject,
					from: senderEmail,
					to: parsed.to,
					cc: parsed.cc,
					inReplyTo: parsed.inReplyTo,
					references: parsed.references,
					isCC
				},
				timestamp: parsed.date ? new Date(parsed.date).getTime() : Date.now()
			};
		},
		async sendResponse(message, context) {
			const agentAddress = process.env.EMAIL_AGENT_ADDRESS;
			if (!agentAddress) {
				console.error("[email] EMAIL_AGENT_ADDRESS not configured");
				return;
			}
			const displayName = (await getIntegrationConfig("email"))?.configData?.displayName || "Dispatch Agent";
			const fromAddress = process.env.EMAIL_FROM ? process.env.EMAIL_FROM : `${displayName} <${agentAddress}>`;
			const subject = context.platformContext.subject;
			const reSubject = subject.startsWith("Re: ") ? subject : `Re: ${subject}`;
			try {
				await sendEmail({
					to: context.senderId,
					from: fromAddress,
					subject: reSubject,
					html: message.text,
					text: stripHtmlForPlainText(message.text),
					inReplyTo: context.platformContext.messageId,
					references: buildReferencesHeader(context.platformContext),
					cc: context.platformContext.isCC ? buildReplyAllCc(context) : void 0
				});
			} catch (err) {
				console.error("[email] Failed to send response:", err);
			}
		},
		async sendMessageToTarget(message, target) {
			const agentAddress = process.env.EMAIL_AGENT_ADDRESS;
			if (!agentAddress) {
				console.error("[email] EMAIL_AGENT_ADDRESS not configured");
				return;
			}
			const displayName = (await getIntegrationConfig("email"))?.configData?.displayName || "Dispatch Agent";
			try {
				await sendEmail({
					to: target.destination,
					from: `${displayName} <${agentAddress}>`,
					subject: target.label || "Message from Dispatch Agent",
					html: message.text,
					text: stripHtmlForPlainText(message.text),
					...target.threadRef ? {
						inReplyTo: target.threadRef,
						references: target.threadRef
					} : {}
				});
			} catch (err) {
				console.error("[email] Failed to send proactive message:", err);
				throw err;
			}
		},
		formatAgentResponse(text) {
			return {
				text: wrapInEmailTemplate(markdownToHtml(text)),
				platformContext: {}
			};
		},
		async getStatus(_baseUrl) {
			const hasAgentAddress = !!process.env.EMAIL_AGENT_ADDRESS;
			const hasEmailProvider = isEmailConfigured();
			const hasWebhookSecret = !!process.env.EMAIL_INBOUND_WEBHOOK_SECRET;
			const configured = hasAgentAddress && hasEmailProvider;
			return {
				platform: "email",
				label: "Email",
				enabled: false,
				configured,
				details: {
					hasAgentAddress,
					hasEmailProvider,
					hasWebhookSecret,
					provider: getEmailProvider()
				},
				error: !configured ? "Set EMAIL_AGENT_ADDRESS and either RESEND_API_KEY or SENDGRID_API_KEY" : void 0
			};
		}
	};
}
async function verifyResendWebhook(event, secret) {
	if (!secret) {
		if (shouldRefuseWhenSecretMissing()) {
			if (!_resendUnverifiedWarned) {
				_resendUnverifiedWarned = true;
				console.error("[email] EMAIL_INBOUND_WEBHOOK_SECRET not set — refusing Resend webhook in production. Set EMAIL_INBOUND_WEBHOOK_SECRET, or set AGENT_NATIVE_ALLOW_UNVERIFIED_WEBHOOKS=1 for local testing only.");
			}
			return false;
		}
		if (!_resendUnverifiedWarned) {
			_resendUnverifiedWarned = true;
			console.warn("[email] EMAIL_INBOUND_WEBHOOK_SECRET not set — accepting Resend webhook without verification (dev mode)");
		}
		return true;
	}
	const svixId = getHeader(event, "svix-id");
	const svixTimestamp = getHeader(event, "svix-timestamp");
	const svixSignature = getHeader(event, "svix-signature");
	if (!svixId || !svixTimestamp || !svixSignature) {
		console.warn("[email] Missing Svix signature headers");
		return false;
	}
	const ts = parseInt(svixTimestamp, 10);
	if (Math.abs(Date.now() / 1e3 - ts) > 300) {
		console.warn("[email] Svix timestamp too old, rejecting");
		return false;
	}
	const body = await readRawBody(event);
	const crypto = await import("node:crypto");
	const rawSecret = secret.startsWith("whsec_") ? secret.slice(6) : secret;
	const secretBytes = Buffer.from(rawSecret, "base64");
	const signedContent = `${svixId}.${svixTimestamp}.${body}`;
	const expectedSignature = crypto.createHmac("sha256", secretBytes).update(signedContent).digest("base64");
	const signatures = svixSignature.split(" ");
	for (const sig of signatures) {
		const sigValue = sig.startsWith("v1,") ? sig.slice(3) : sig;
		try {
			if (crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(sigValue))) return true;
		} catch {}
	}
	console.warn("[email] Svix signature verification failed");
	return false;
}
function safeEq(a, b) {
	const aBuf = Buffer.from(a);
	const bBuf = Buffer.from(b);
	if (aBuf.length !== bBuf.length) return false;
	return timingSafeEqual(aBuf, bBuf);
}
async function verifySendGridWebhook(event, secret) {
	if (!secret) {
		if (shouldRefuseWhenSecretMissing()) {
			if (!_sendgridUnverifiedWarned) {
				_sendgridUnverifiedWarned = true;
				console.error("[email] EMAIL_INBOUND_WEBHOOK_SECRET not set — refusing SendGrid webhook in production. Set EMAIL_INBOUND_WEBHOOK_SECRET, or set AGENT_NATIVE_ALLOW_UNVERIFIED_WEBHOOKS=1 for local testing only.");
			}
			return false;
		}
		if (!_sendgridUnverifiedWarned) {
			_sendgridUnverifiedWarned = true;
			console.warn("[email] EMAIL_INBOUND_WEBHOOK_SECRET not set — accepting SendGrid webhook without verification (dev mode)");
		}
		return true;
	}
	const authHeader = getHeader(event, "authorization");
	if (authHeader) {
		if (authHeader.startsWith("Basic ")) {
			const password = Buffer.from(authHeader.slice(6), "base64").toString().split(":")[1];
			if (password !== void 0 && safeEq(password, secret)) return true;
		}
	}
	const customSecret = getHeader(event, "x-webhook-secret");
	if (customSecret !== void 0 && safeEq(customSecret, secret)) return true;
	console.warn("[email] SendGrid webhook secret verification failed");
	return false;
}
async function parseResendWebhook(event) {
	const raw = await readRawBody(event);
	const body = JSON.parse(raw);
	if (!body || body.type !== "email.received") return null;
	const data = body.data;
	if (!data) return null;
	const fromRaw = data.from;
	const from = fromRaw ? parseEmailAddress(fromRaw) : null;
	if (!from) return null;
	const toRaw = data.to;
	const to = normalizeAddressList(toRaw);
	const ccRaw = data.cc;
	const cc = normalizeAddressList(ccRaw);
	const headers = parseHeadersObject(data.headers);
	return {
		messageId: headers["message-id"] || data.email_id || `resend-${Date.now()}`,
		subject: data.subject || "(no subject)",
		from,
		to,
		cc: cc.length > 0 ? cc : void 0,
		text: data.text,
		html: data.html,
		inReplyTo: headers["in-reply-to"] || void 0,
		references: parseReferencesHeader(headers["references"]),
		date: data.created_at || void 0
	};
}
async function parseSendGridWebhook(event) {
	const raw = await readRawBody(event);
	const body = JSON.parse(raw);
	if (!body) return null;
	const fromRaw = body.from;
	const from = fromRaw ? parseEmailAddress(fromRaw) : null;
	if (!from) return null;
	const toRaw = body.to;
	const to = toRaw ? toRaw.split(",").map((a) => a.trim()) : [];
	const ccRaw = body.cc;
	const cc = ccRaw ? ccRaw.split(",").map((a) => a.trim()) : [];
	const headersStr = body.headers;
	const headers = parseHeadersString(headersStr);
	return {
		messageId: headers["message-id"] || `sendgrid-${Date.now()}`,
		subject: body.subject || "(no subject)",
		from,
		to,
		cc: cc.length > 0 ? cc : void 0,
		text: body.text,
		html: body.html,
		inReplyTo: headers["in-reply-to"] || void 0,
		references: parseReferencesHeader(headers["references"]),
		date: headers["date"] || void 0
	};
}
/**
* Rate-limit heuristic backed by the `integration_pending_tasks` queue.
*
* Counts how many tasks this sender has produced in the last hour. The count
* INCLUDES tasks already processed (status = completed/failed) because the
* rows aren't deleted on completion — that's enough signal to throttle a
* single noisy/abusive sender without needing a dedicated counter table.
*
* Two trade-offs worth knowing:
*   - This is a coarse heuristic, not exact metering. Within one hour the
*     count is correct; rows produced more than an hour ago naturally drop
*     off. We don't try to be precise, only to raise the bar past the
*     "send 10K emails through one Lambda burst" failure mode.
*   - The query relies on the `idx_pending_tasks_status_created` index plus
*     a sender substring match. A targeted attacker could amortise the cost
*     by reusing one sender address — that's fine, the goal here is to bound
*     the attack within a single attacker identity, not to detect spoofing.
*
* If the table doesn't yet exist on this deployment (no inbound webhook has
* been processed before), we silently allow the message — the schema is
* provisioned on first task insert. See H4 in the webhook security audit.
*/
async function isRateLimited(senderEmail) {
	const cutoff = Date.now() - RATE_LIMIT_WINDOW_MS;
	try {
		const { rows } = await getDbExec().execute({
			sql: `
        SELECT COUNT(*) AS c
          FROM integration_pending_tasks
         WHERE platform = ?
           AND created_at >= ?
           AND payload LIKE ?
      `,
			args: [
				"email",
				cutoff,
				`%"senderId":"${senderEmail}"%`
			]
		});
		return Number(rows[0]?.c ?? 0) >= RATE_LIMIT_MAX;
	} catch {
		return false;
	}
}
/** Parse "Name <addr@example.com>" or plain "addr@example.com" */
function parseEmailAddress(raw) {
	const match = raw.match(/^\s*(.*?)\s*<([^>]+)>\s*$/);
	if (match && match[2]) return {
		name: match[1].replace(/^["']|["']$/g, "").trim() || void 0,
		email: match[2].trim()
	};
	return { email: raw.trim() };
}
/** Normalize a to/cc field that may be a string, array, or undefined into a string[] of addresses */
function normalizeAddressList(raw) {
	if (!raw) return [];
	if (Array.isArray(raw)) return raw.map((a) => a.trim());
	return raw.split(",").map((a) => a.trim());
}
/** Parse a headers object (Resend format: array of {name, value} or Record) */
function parseHeadersObject(headers) {
	const result = {};
	if (!headers) return result;
	if (Array.isArray(headers)) {
		for (const h of headers) if (h && typeof h === "object" && "name" in h && "value" in h) result[h.name.toLowerCase()] = h.value;
	} else if (typeof headers === "object") for (const [key, value] of Object.entries(headers)) result[key.toLowerCase()] = String(value);
	return result;
}
/** Parse a raw headers string (SendGrid format: "Key: Value\nKey: Value\n...") */
function parseHeadersString(raw) {
	const result = {};
	if (!raw) return result;
	const lines = raw.split(/\r?\n/);
	let currentKey = "";
	let currentValue = "";
	for (const line of lines) {
		if (/^\s/.test(line) && currentKey) {
			currentValue += " " + line.trim();
			continue;
		}
		if (currentKey) result[currentKey.toLowerCase()] = currentValue;
		const colonIdx = line.indexOf(":");
		if (colonIdx > 0) {
			currentKey = line.slice(0, colonIdx).trim();
			currentValue = line.slice(colonIdx + 1).trim();
		} else {
			currentKey = "";
			currentValue = "";
		}
	}
	if (currentKey) result[currentKey.toLowerCase()] = currentValue;
	return result;
}
/** Parse a References header value into an array of Message-IDs */
function parseReferencesHeader(references) {
	if (!references) return void 0;
	const ids = references.match(/<[^>]+>/g);
	return ids && ids.length > 0 ? ids : void 0;
}
/**
* Get the thread root ID using a Gmail-style approach:
* the oldest Message-ID from the References chain is the thread root.
* If no References, use the current Message-ID.
*/
function getThreadRootId(messageId, references) {
	if (references && references.length > 0) return references[0];
	return messageId;
}
/**
* Scope a raw thread root id by the sender's email address. Two different
* senders crafting the same `References:` header value should NOT collide
* onto the same internal thread mapping — that's the email-side fix for the
* thread-injection finding (M1 in the webhook security audit).
*
* The returned id is opaque to callers and stays stable across messages
* from the same sender on the same conversation thread, so reply behaviour
* is unchanged.
*/
function scopeThreadIdToSender(rawThreadId, senderEmail) {
	return `${senderEmail.toLowerCase()}::${rawThreadId}`;
}
/** Build a References header from the platform context */
function buildReferencesHeader(ctx) {
	const parts = [];
	const refs = ctx.references;
	if (refs) parts.push(...refs);
	const messageId = ctx.messageId;
	if (messageId) {
		if (!parts.includes(messageId)) parts.push(messageId);
	}
	return parts.join(" ");
}
/**
* Build CC list for reply-all when agent was CC'd.
* Include original To addresses and other CC addresses, excluding the agent and the original sender.
*/
function buildReplyAllCc(context) {
	const agentAddress = process.env.EMAIL_AGENT_ADDRESS?.toLowerCase();
	const senderEmail = context.senderId?.toLowerCase();
	const toAddresses = context.platformContext.to || [];
	const ccAddresses = context.platformContext.cc || [];
	const allRecipients = /* @__PURE__ */ new Set();
	for (const addr of [...toAddresses, ...ccAddresses]) {
		const normalized = addr.toLowerCase().trim();
		if (normalized !== agentAddress && normalized !== senderEmail) allRecipients.add(normalized);
	}
	return allRecipients.size > 0 ? Array.from(allRecipients) : void 0;
}
/** Strip HTML tags for a plain-text version of the email */
function stripHtmlForPlainText(html) {
	return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<\/div>/gi, "\n").replace(/<\/li>/gi, "\n").replace(/<li[^>]*>/gi, "- ").replace(/<\/h[1-6]>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").replace(/\n{3,}/g, "\n\n").trim();
}
function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function decodeBasicHtmlEntities(s) {
	return s.replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'");
}
function splitTrailingUrlPunctuation(raw) {
	let url = raw;
	let trailing = "";
	const trailingEntities = ["&quot;", "&#39;"];
	for (;;) {
		const entity = trailingEntities.find((candidate) => url.endsWith(candidate));
		if (!entity) break;
		url = url.slice(0, -entity.length);
		trailing = entity + trailing;
	}
	while (/[.,!?;:]$/.test(url)) {
		trailing = url.slice(-1) + trailing;
		url = url.slice(0, -1);
	}
	while (url.endsWith(")") && !url.includes("(")) {
		trailing = ")" + trailing;
		url = url.slice(0, -1);
	}
	return {
		url,
		trailing
	};
}
function labelForUrl(rawUrl) {
	try {
		const host = new URL(decodeBasicHtmlEntities(rawUrl)).hostname.replace(/^www\./, "");
		return host ? `Open ${host}` : "Open link";
	} catch {
		return "Open link";
	}
}
function linkifyTextSegment(segment) {
	return segment.replace(/\bhttps?:\/\/[^\s<>"']+/gi, (raw) => {
		const { url, trailing } = splitTrailingUrlPunctuation(raw);
		return `<a href="${escapeHtml(decodeBasicHtmlEntities(url))}" style="color:#2563eb;text-decoration:underline;">${escapeHtml(labelForUrl(url))}</a>${trailing}`;
	});
}
function linkifyBareUrlsInHtml(html) {
	const parts = html.split(/(<\/?[^>]+>)/g);
	let skipDepth = 0;
	return parts.map((part) => {
		if (part.startsWith("<") && part.endsWith(">")) {
			if (/^<\/\s*(a|code)\b/i.test(part)) skipDepth = Math.max(0, skipDepth - 1);
			else if (/^<\s*(a|code)\b/i.test(part)) skipDepth += 1;
			return part;
		}
		return skipDepth > 0 ? part : linkifyTextSegment(part);
	}).join("");
}
/** Convert basic markdown to HTML for email rendering */
function markdownToHtml(md) {
	let html = md;
	html = escapeHtml(html);
	html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
	html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
	html = html.replace(/(?<!\w)\*([^*]+?)\*(?!\w)/g, "<em>$1</em>");
	html = html.replace(/(?<!\w)_([^_]+?)_(?!\w)/g, "<em>$1</em>");
	html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_match, label, url) => {
		const visibleLabel = /^https?:\/\//i.test(decodeBasicHtmlEntities(label)) ? escapeHtml(labelForUrl(label)) : label;
		return `<a href="${escapeHtml(decodeBasicHtmlEntities(url))}" style="color:#2563eb;text-decoration:underline;">${visibleLabel}</a>`;
	});
	html = html.replace(/`([^`]+)`/g, "<code style=\"background:#f1f5f9;padding:1px 4px;border-radius:3px;font-size:0.9em;\">$1</code>");
	html = linkifyBareUrlsInHtml(html);
	html = html.replace(/^([*-]) (.+)$/gm, "<li>$2</li>");
	html = html.replace(/(<li>.*?<\/li>\n?)+/g, "<ul style=\"margin:8px 0;padding-left:20px;\">$&</ul>");
	html = html.replace(/^\d+\. (.+)$/gm, "<li>$1</li>");
	html = html.replace(/(?<!<\/ul>)(<li>.*?<\/li>\n?)+/g, (match) => {
		if (match.includes("<ul")) return match;
		return `<ol style="margin:8px 0;padding-left:20px;">${match}</ol>`;
	});
	html = html.replace(/^### (.+)$/gm, "<h3 style=\"margin:16px 0 8px;font-size:1.1em;\">$1</h3>");
	html = html.replace(/^## (.+)$/gm, "<h2 style=\"margin:16px 0 8px;font-size:1.25em;\">$1</h2>");
	html = html.replace(/^# (.+)$/gm, "<h1 style=\"margin:16px 0 8px;font-size:1.4em;\">$1</h1>");
	html = html.replace(/^(-{3,}|\*{3,})$/gm, "<hr style=\"border:none;border-top:1px solid #e2e8f0;margin:16px 0;\">");
	html = html.replace(/\n\n/g, "</p><p>");
	html = html.replace(/\n/g, "<br>");
	html = `<p>${html}</p>`;
	html = html.replace(/<p>\s*<\/p>/g, "");
	return html;
}
/** Wrap body HTML in a minimal email template with inline styles */
function wrapInEmailTemplate(bodyHtml) {
	return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;">
<div style="max-width:600px;margin:0 auto;padding:20px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;font-size:14px;line-height:1.6;color:#1a1a1a;">
${bodyHtml}
</div>
</body>
</html>`;
}
/**
* Read the raw request body as a string and cache on the event context.
* Reads raw bytes from the request stream — never re-stringifies a parsed
* body, since the Resend / Svix HMAC is computed over the exact bytes sent
* (M2 in the webhook security audit).
*/
async function readRawBody(event) {
	const cached = event.context.__rawBody;
	if (typeof cached === "string") return cached;
	const raw = await readRawBody$2(event) ?? "";
	event.context.__rawBody = raw;
	return raw;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/google-docs-poller.js
var PLATFORM = "google-docs";
var DEFAULT_TRIGGER = "@agent";
/** Track processed comment IDs to avoid reprocessing */
var processedComments = /* @__PURE__ */ new Set();
/** Track last-checked time per document for comment filtering */
var lastCheckedTimes = /* @__PURE__ */ new Map();
var pollerInterval = null;
var activeOptions = null;
/** How long a watch channel lasts (Google max is ~24h, we use 23h to renew early) */
var WATCH_CHANNEL_TTL_MS = 1380 * 60 * 1e3;
var watchRenewalTimer = null;
/**
* Register a Google Drive changes.watch channel so Google pushes
* notifications to our webhook instead of us polling.
*
* Returns true if the watch was registered successfully.
*/
async function registerWatch(webhookUrl) {
	const accessToken = await getServiceAccountAccessToken();
	if (!accessToken) return false;
	let pageToken = await getPageToken();
	if (!pageToken) {
		pageToken = await getStartPageToken(accessToken);
		await setPageToken(pageToken);
	}
	const channelId = `gdocs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	const expiration = Date.now() + WATCH_CHANNEL_TTL_MS;
	try {
		const res = await fetch("https://www.googleapis.com/drive/v3/changes/watch", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: channelId,
				type: "web_hook",
				address: webhookUrl,
				expiration,
				payload: true
			})
		});
		if (!res.ok) {
			const err = await res.text();
			console.error("[google-docs] Failed to register watch:", err);
			return false;
		}
		const data = await res.json();
		await saveIntegrationConfig(PLATFORM, {
			channelId: data.id,
			resourceId: data.resourceId,
			expiration: data.expiration,
			webhookUrl
		}, "watch-channel");
		console.log(`[google-docs] Watch registered (channel: ${data.id}, expires: ${new Date(parseInt(data.expiration)).toISOString()})`);
		scheduleWatchRenewal(webhookUrl);
		return true;
	} catch (err) {
		console.error("[google-docs] Watch registration error:", err);
		return false;
	}
}
/**
* Stop an existing watch channel.
*/
async function stopWatch() {
	const config = await getIntegrationConfig(PLATFORM, "watch-channel");
	if (!config?.configData?.channelId) return;
	const accessToken = await getServiceAccountAccessToken();
	if (!accessToken) return;
	try {
		await fetch("https://www.googleapis.com/drive/v3/channels/stop", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${accessToken}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				id: config.configData.channelId,
				resourceId: config.configData.resourceId
			})
		});
	} catch {}
	await saveIntegrationConfig(PLATFORM, {}, "watch-channel");
}
/**
* Schedule automatic watch renewal before the channel expires.
*/
function scheduleWatchRenewal(webhookUrl) {
	if (watchRenewalTimer) clearTimeout(watchRenewalTimer);
	const renewIn = WATCH_CHANNEL_TTL_MS - 3600 * 1e3;
	watchRenewalTimer = setTimeout(async () => {
		console.log("[google-docs] Renewing watch channel...");
		await stopWatch();
		await registerWatch(webhookUrl);
	}, renewIn);
}
async function getPageToken() {
	return (await getIntegrationConfig(PLATFORM, "page-token"))?.configData?.pageToken ?? null;
}
async function setPageToken(token) {
	await saveIntegrationConfig(PLATFORM, { pageToken: token }, "page-token");
}
function isAgentMention(commentText, triggerKeyword) {
	return commentText.toLowerCase().includes(triggerKeyword.toLowerCase());
}
function commentKey(fileId, commentId) {
	return `${fileId}:${commentId}`;
}
/**
* Check a single document for new agent-directed comments.
*/
async function checkDocumentComments(fileId, accessToken, options) {
	const triggerKeyword = options.triggerKeyword ?? DEFAULT_TRIGGER;
	const serviceEmail = getServiceAccountEmail();
	const comments = await listDocComments(fileId, accessToken, lastCheckedTimes.get(fileId));
	const now = (/* @__PURE__ */ new Date()).toISOString();
	for (const comment of comments) {
		if (comment.resolved) continue;
		const key = commentKey(fileId, comment.id);
		if (serviceEmail && comment.author.emailAddress?.toLowerCase() === serviceEmail.toLowerCase()) continue;
		const existingMapping = await getThreadMapping(PLATFORM, key);
		if (existingMapping) {
			const newUserReplies = (comment.replies ?? []).filter((r) => {
				if (serviceEmail && r.author.emailAddress?.toLowerCase() === serviceEmail.toLowerCase()) return false;
				const replyKey = `${key}:reply:${r.id}`;
				if (processedComments.has(replyKey)) return false;
				if (!isAgentMention(r.content, triggerKeyword)) return false;
				return true;
			});
			for (const reply of newUserReplies) {
				const replyKey = `${key}:reply:${reply.id}`;
				processedComments.add(replyKey);
				const text = reply.content.replace(new RegExp(triggerKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "").trim();
				await processComment(fileId, comment.id, text, reply.author.displayName, options, existingMapping.internalThreadId);
			}
			continue;
		}
		if (!isAgentMention(comment.content, triggerKeyword)) continue;
		processedComments.add(key);
		let text = comment.content;
		if (comment.quotedFileContent?.value) text = `[Highlighted text: "${comment.quotedFileContent.value}"]\n\n${text}`;
		text = text.replace(new RegExp(triggerKeyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi"), "").trim();
		await processComment(fileId, comment.id, text, comment.author.displayName, options);
	}
	lastCheckedTimes.set(fileId, now);
}
/**
* Process pending Drive changes — called by both push notifications and polling.
* Fetches changes since the last page token, finds Google Docs that changed,
* and checks their comments for agent mentions.
*/
async function processChanges(options) {
	const accessToken = await getServiceAccountAccessToken();
	if (!accessToken) return;
	let pageToken = await getPageToken();
	if (!pageToken) {
		pageToken = await getStartPageToken(accessToken);
		await setPageToken(pageToken);
		return;
	}
	const { changes, nextPageToken } = await listChanges(pageToken, accessToken);
	await setPageToken(nextPageToken);
	if (changes.length === 0) return;
	const docFileIds = /* @__PURE__ */ new Set();
	for (const change of changes) {
		if (change.removed) continue;
		if (change.file?.mimeType === "application/vnd.google-apps.document" || !change.file?.mimeType) docFileIds.add(change.fileId);
	}
	for (const fileId of docFileIds) try {
		await checkDocumentComments(fileId, accessToken, options);
	} catch (err) {
		console.error(`[google-docs] Error checking comments on ${fileId}:`, err);
	}
}
/**
* Handle a push notification from Google Drive changes.watch.
* Called from the integration webhook route.
*/
async function handlePushNotification() {
	if (!activeOptions) {
		console.warn("[google-docs] Push notification received but poller not configured");
		return;
	}
	try {
		await processChanges(activeOptions);
	} catch (err) {
		console.error("[google-docs] Error processing push notification:", err);
	}
}
async function processComment(fileId, commentId, text, senderName, options, existingThreadId) {
	const adapter = googleDocsAdapter();
	const key = commentKey(fileId, commentId);
	const incoming = {
		platform: PLATFORM,
		externalThreadId: key,
		text,
		senderName,
		platformContext: {
			fileId,
			commentId
		},
		timestamp: Date.now()
	};
	let threadId = existingThreadId;
	if (!threadId) {
		const thread = await createThread(options.ownerEmail, { title: `Google Doc: ${senderName}` });
		await saveThreadMapping(PLATFORM, key, thread.id, {
			fileId,
			commentId
		});
		threadId = thread.id;
	}
	const thread = await getThread(threadId);
	const existingMessages = [];
	if (thread?.threadData) try {
		const data = JSON.parse(thread.threadData);
		if (Array.isArray(data.messages)) for (const msg of data.messages) {
			const m = msg.message ?? msg;
			const textContent = typeof m.content === "string" ? m.content : Array.isArray(m.content) ? m.content.filter((c) => c.type === "text").map((c) => c.text).join("\n") : "";
			if (m.role === "user") existingMessages.push({
				role: "user",
				content: [{
					type: "text",
					text: textContent
				}]
			});
			else if (m.role === "assistant") existingMessages.push({
				role: "assistant",
				content: [{
					type: "text",
					text: textContent
				}]
			});
		}
	} catch {}
	const messages = [...existingMessages, {
		role: "user",
		content: [{
			type: "text",
			text
		}]
	}];
	const engine = createAnthropicEngine({ apiKey: options.apiKey });
	const tools = actionsToEngineTools(options.actions);
	const runId = `gdocs-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
	const capturedThreadId = threadId;
	const orgId = await resolveOrgIdForEmail(options.ownerEmail) ?? void 0;
	startRun(runId, capturedThreadId, async (send, signal) => {
		await runWithRequestContext({
			userEmail: options.ownerEmail,
			orgId,
			isIntegrationCaller: true
		}, () => runAgentLoop({
			engine,
			model: options.model,
			systemPrompt: options.systemPrompt,
			tools,
			messages,
			actions: options.actions,
			send,
			signal
		}));
	}, async (completedRun) => {
		try {
			let responseText = "";
			for (const runEvent of completedRun.events) if (runEvent.event.type === "text") responseText += runEvent.event.text;
			if (!responseText.trim()) responseText = "(No response)";
			const outgoing = adapter.formatAgentResponse(responseText);
			await adapter.sendResponse(outgoing, incoming);
			await persistThreadData(capturedThreadId, text, completedRun, thread);
		} catch (err) {
			console.error("[google-docs] Error sending response:", err);
		}
	});
}
async function persistThreadData(threadId, userText, completedRun, thread) {
	try {
		let repo;
		try {
			repo = JSON.parse(thread?.threadData || "{}");
		} catch {
			repo = {};
		}
		if (!Array.isArray(repo.messages)) repo.messages = [];
		repo.messages.push({
			id: `msg-${Date.now()}-user`,
			role: "user",
			content: [{
				type: "text",
				text: userText
			}],
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		const assistantMsg = buildAssistantMessage(completedRun.events ?? [], completedRun.runId);
		if (assistantMsg) repo.messages.push(assistantMsg);
		const meta = extractThreadMeta(repo);
		await updateThreadData(threadId, JSON.stringify(repo), meta.title || thread?.title || "Google Doc Comment", meta.preview || thread?.preview || "", repo.messages.length);
	} catch {}
}
/**
* Start the Google Docs integration.
*
* Hybrid approach:
* 1. Attempts to register a Google Drive changes.watch webhook for
*    near-instant push notifications (~seconds latency)
* 2. Falls back to polling if the watch registration fails
*    (e.g. domain not verified, local dev)
* 3. Even in push mode, polls at a slow interval (5min) as a safety net
*    in case a push notification is missed
*/
async function startGoogleDocsPoller(options) {
	if (pollerInterval) {
		console.warn("[google-docs] Already running");
		return;
	}
	activeOptions = options;
	if (!(await getIntegrationConfig(PLATFORM))?.configData?.enabled) {
		startPollLoop(options, options.intervalMs ?? 3e4);
		return;
	}
	const webhookUrl = options.webhookUrl;
	let pushMode = false;
	if (webhookUrl) {
		pushMode = await registerWatch(webhookUrl);
		if (pushMode) {
			console.log("[google-docs] Push mode active — using Drive webhooks");
			startPollLoop(options, 300 * 1e3);
		}
	}
	if (!pushMode) {
		console.log("[google-docs] Polling mode — push registration failed or no webhook URL");
		startPollLoop(options, options.intervalMs ?? 3e4);
	}
}
function startPollLoop(options, intervalMs) {
	async function poll() {
		try {
			if (!(await getIntegrationConfig(PLATFORM))?.configData?.enabled) return;
			await processChanges(options);
		} catch (err) {
			const detail = err instanceof Error ? err : err?.error ?? err?.message ?? err;
			console.error("[google-docs] Poller error:", detail);
		}
	}
	setTimeout(poll, 5e3);
	pollerInterval = setInterval(poll, intervalMs);
	const email = getServiceAccountEmail();
	if (process.env.DEBUG) console.log(`[google-docs] Poll loop started (interval: ${intervalMs / 1e3}s, service account: ${email ?? "not configured"})`);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/pending-tasks-retry-job.js
/**
* Retries stuck integration webhook tasks.
*
* The integration webhook flow enqueues work into `integration_pending_tasks`
* (see `pending-tasks-store.ts`) and then fires a self-webhook to the
* `/_agent-native/integrations/process-task` endpoint to drain the queue.
* If that fire-and-forget dispatch fails (e.g. transient network blip), the
* row stays in `pending` forever. Likewise, if the processor is killed mid-
* processing (function timeout, container shutdown), a row can remain in
* `processing` forever.
*
* This job runs every 60s and re-fires the processor endpoint for tasks that
* look stuck:
*   - status='pending' AND created_at older than 90s (initial dispatch lost)
*   - status='processing' AND updated_at older than the host-specific
*     function budget (75s on serverless, 5min elsewhere)
*
* Retries are capped at MAX_ATTEMPTS attempts; after that the row is marked
* `failed` permanently so it stops being retried.
*
* If the `integration_pending_tasks` table does not yet exist (e.g. older
* deploy that hasn't run the new webhook flow), this job no-ops silently
* rather than spamming logs.
*/
var RETRY_INTERVAL_MS = 6e4;
/** Tasks pending longer than this are considered stuck on initial dispatch */
var PENDING_STUCK_AFTER_MS = 9e4;
/** Tasks "processing" longer than this are considered killed mid-flight. */
var DEFAULT_PROCESSING_STUCK_AFTER_MS = 300 * 1e3;
var SERVERLESS_PROCESSING_STUCK_AFTER_MS = 75e3;
/** After this many attempts we give up and mark the task failed */
var MAX_ATTEMPTS = 3;
var PROCESSOR_PATH = `${FRAMEWORK_ROUTE_PREFIX}/integrations/process-task`;
var retryInterval = null;
var activeWebhookBaseUrl;
/**
* Whether the table exists. Cached after first probe so we don't log every
* minute when the queue isn't in use yet on a given deployment.
*/
var tableExists = null;
/**
* One pass: find stuck tasks and re-fire the processor for each.
* Exported for tests and for manual triggers.
*/
async function retryStuckPendingTasks(webhookBaseUrl) {
	const baseUrl = webhookBaseUrl ?? activeWebhookBaseUrl;
	const client = getDbExec();
	const now = Date.now();
	const pendingCutoff = now - PENDING_STUCK_AFTER_MS;
	const processingCutoff = now - getProcessingStuckAfterMs();
	let stuckRows;
	try {
		const { rows } = await client.execute({
			sql: `
        SELECT id, status, attempts
          FROM integration_pending_tasks
         WHERE (status = 'pending' AND created_at <= ?)
            OR (status = 'processing' AND updated_at <= ?)
      `,
			args: [pendingCutoff, processingCutoff]
		});
		stuckRows = rows.map((r) => ({
			id: r.id,
			status: r.status,
			attempts: Number(r.attempts ?? 0)
		}));
		tableExists = true;
	} catch (err) {
		if (tableExists !== false) {
			tableExists = false;
			if (process.env.DEBUG) console.log("[integrations] pending-tasks retry job: table not present yet, skipping");
		}
		return;
	}
	if (stuckRows.length === 0) return;
	for (const row of stuckRows) try {
		if (row.attempts >= MAX_ATTEMPTS) {
			await client.execute({
				sql: `
            UPDATE integration_pending_tasks
               SET status = 'failed',
                   updated_at = ?,
                   error_message = COALESCE(error_message, ?)
             WHERE id = ?
               AND status = ?
          `,
				args: [
					Date.now(),
					`Retry job: exceeded ${MAX_ATTEMPTS} attempts`,
					row.id,
					row.status
				]
			});
			console.warn(`[integrations] Pending task ${row.id} exceeded ${MAX_ATTEMPTS} attempts — marking failed`);
			continue;
		}
		const newStatus = row.status === "processing" ? "pending" : row.status;
		await client.execute({
			sql: `
          UPDATE integration_pending_tasks
             SET status = ?, updated_at = ?
           WHERE id = ?
             AND status = ?
        `,
			args: [
				newStatus,
				Date.now(),
				row.id,
				row.status
			]
		});
		await refireProcessor(row.id, baseUrl);
	} catch (err) {
		console.error(`[integrations] Failed to retry pending task ${row.id}:`, err);
	}
}
function getProcessingStuckAfterMs() {
	if (process.env.NETLIFY || process.env.AWS_LAMBDA_FUNCTION_NAME || process.env.VERCEL || "__cf_env" in globalThis) return SERVERLESS_PROCESSING_STUCK_AFTER_MS;
	return DEFAULT_PROCESSING_STUCK_AFTER_MS;
}
/**
* Fire-and-forget POST to the processor endpoint for a single task id.
* Mirrors the original dispatch from the webhook handler, including the
* short-lived HMAC bearer token bound to this taskId.
*/
async function refireProcessor(taskId, webhookBaseUrl) {
	const url = `${withConfiguredAppBasePath(webhookBaseUrl || process.env.WEBHOOK_BASE_URL || process.env.APP_URL || process.env.URL || process.env.DEPLOY_URL || `http://localhost:${process.env.PORT || 3e3}`)}${PROCESSOR_PATH}`;
	const headers = { "Content-Type": "application/json" };
	try {
		headers["Authorization"] = `Bearer ${signInternalToken(taskId)}`;
	} catch (err) {
		if (process.env.NODE_ENV === "production") {
			console.error(`[integrations] Refusing to dispatch task ${taskId} — A2A_SECRET not configured. Set A2A_SECRET to enable signed retry dispatches.`);
			return;
		}
		if (err instanceof Error && !/A2A_SECRET/i.test(err.message)) console.error(`[integrations] signInternalToken failed unexpectedly for ${taskId}:`, err);
	}
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), 5e3);
	try {
		await fetch(url, {
			method: "POST",
			headers,
			body: JSON.stringify({ taskId }),
			signal: controller.signal
		});
	} finally {
		clearTimeout(timer);
	}
}
/**
* Start the periodic retry loop. Safe to call multiple times — second call
* is a no-op.
*/
function startPendingTasksRetryJob(options) {
	if (retryInterval) return;
	activeWebhookBaseUrl = options?.webhookBaseUrl;
	setTimeout(() => {
		retryStuckPendingTasks().catch((err) => {
			console.error("[integrations] Pending-tasks retry job error:", err);
		});
	}, 1e4);
	retryInterval = setInterval(() => {
		retryStuckPendingTasks().catch((err) => {
			console.error("[integrations] Pending-tasks retry job error:", err);
		});
	}, RETRY_INTERVAL_MS);
	if (process.env.DEBUG) console.log(`[integrations] Pending-tasks retry job started (every ${RETRY_INTERVAL_MS / 1e3}s)`);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/task-queue-stats.js
/**
* Read-only observability helpers for the integration task queue.
*
* Lives in its own file so it stays out of `pending-tasks-store.ts`, which is
* actively being edited by the agent that owns the queue itself. These
* helpers only SELECT — they never write — and they degrade gracefully if
* the `integration_pending_tasks` table doesn't exist yet (returning zeroed
* stats instead of throwing).
*/
var ZERO_STATS = {
	pending: 0,
	processing: 0,
	completed_last_hour: 0,
	failed_last_hour: 0,
	oldest_pending_age_seconds: 0,
	recent_failures: []
};
function isMissingTableError(err) {
	const msg = err instanceof Error ? err.message : String(err ?? "");
	return /no such table|does not exist|relation .* does not exist|undefined_table/i.test(msg);
}
/**
* Get a snapshot of the integration task queue health.
*
* Returns zeros if the table doesn't exist yet — safe to call before the
* pending-tasks store has initialised the schema.
*/
async function getTaskQueueStats() {
	const client = getDbExec();
	const now = Date.now();
	const oneHourAgo = now - 3600 * 1e3;
	try {
		const liveCounts = await client.execute({
			sql: `SELECT status, COUNT(*) AS c FROM integration_pending_tasks
            WHERE status IN ('pending', 'processing')
            GROUP BY status`,
			args: []
		});
		let pending = 0;
		let processing = 0;
		for (const row of liveCounts.rows) {
			const status = row.status;
			const count = Number(row.c ?? 0);
			if (status === "pending") pending = count;
			else if (status === "processing") processing = count;
		}
		const lastHourCounts = await client.execute({
			sql: `SELECT status, COUNT(*) AS c FROM integration_pending_tasks
            WHERE status IN ('completed', 'failed') AND updated_at >= ?
            GROUP BY status`,
			args: [oneHourAgo]
		});
		let completedLastHour = 0;
		let failedLastHour = 0;
		for (const row of lastHourCounts.rows) {
			const status = row.status;
			const count = Number(row.c ?? 0);
			if (status === "completed") completedLastHour = count;
			else if (status === "failed") failedLastHour = count;
		}
		let oldestPendingAgeSeconds = 0;
		if (pending > 0) {
			const oldestRow = (await client.execute({
				sql: `SELECT created_at FROM integration_pending_tasks
              WHERE status = 'pending'
              ORDER BY created_at ASC
              LIMIT 1`,
				args: []
			})).rows[0];
			if (oldestRow) {
				const createdAt = Number(oldestRow.created_at ?? now);
				oldestPendingAgeSeconds = Math.max(0, Math.floor((now - createdAt) / 1e3));
			}
		}
		const recentFailures = (await client.execute({
			sql: `SELECT id, platform, error_message, attempts FROM integration_pending_tasks
            WHERE status = 'failed' AND updated_at >= ?
            ORDER BY updated_at DESC
            LIMIT 5`,
			args: [oneHourAgo]
		})).rows.map((row) => ({
			id: String(row.id ?? ""),
			platform: String(row.platform ?? ""),
			error: String(row.error_message ?? ""),
			attempts: Number(row.attempts ?? 0)
		}));
		return {
			pending,
			processing,
			completed_last_hour: completedLastHour,
			failed_last_hour: failedLastHour,
			oldest_pending_age_seconds: oldestPendingAgeSeconds,
			recent_failures: recentFailures
		};
	} catch (err) {
		if (isMissingTableError(err)) return {
			...ZERO_STATS,
			recent_failures: []
		};
		throw err;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/integrations/plugin.js
var a2aContinuationRetryInterval = null;
function startA2AContinuationRetryJob(adapters) {
	if (a2aContinuationRetryInterval) return;
	setTimeout(() => {
		processDueA2AContinuations({ adapters }).catch((err) => {
			console.error("[integrations] A2A continuation retry job failed:", err);
		});
	}, 1e4);
	a2aContinuationRetryInterval = setInterval(() => {
		processDueA2AContinuations({ adapters }).catch((err) => {
			console.error("[integrations] A2A continuation retry job failed:", err);
		});
	}, 6e4);
}
var GOOGLE_JWKS = createRemoteJWKSet(new URL("https://www.googleapis.com/oauth2/v3/certs"));
var GOOGLE_ISSUERS = ["https://accounts.google.com", "accounts.google.com"];
/**
* Verify a Pub/Sub OIDC bearer token. Throws on any verification failure.
* Requires GOOGLE_DOCS_PUSH_AUDIENCE and GOOGLE_DOCS_PUSH_SIGNER_EMAIL to be
* set; if either is missing in production, the webhook handler refuses the
* request entirely (so a misconfigured deployment fails closed, surfacing in
* Pub/Sub's delivery metrics).
*/
async function verifyGoogleDocsPushToken(authHeader) {
	if (!authHeader.startsWith("Bearer ")) throw new Error("missing bearer token");
	const token = authHeader.slice(7);
	const audience = process.env.GOOGLE_DOCS_PUSH_AUDIENCE;
	if (!audience) throw new Error("GOOGLE_DOCS_PUSH_AUDIENCE not configured");
	const { payload } = await jwtVerify(token, GOOGLE_JWKS, {
		issuer: GOOGLE_ISSUERS,
		audience
	});
	if (payload.email_verified !== true) throw new Error("email_verified claim is not true");
	const expectedSigner = process.env.GOOGLE_DOCS_PUSH_SIGNER_EMAIL;
	if (!expectedSigner) throw new Error("GOOGLE_DOCS_PUSH_SIGNER_EMAIL not configured");
	if (payload.email !== expectedSigner) throw new Error(`unexpected signer: ${String(payload.email)}`);
}
/** Built-in adapters, instantiated lazily */
function getDefaultAdapters() {
	return [
		slackAdapter(),
		telegramAdapter(),
		whatsappAdapter(),
		googleDocsAdapter(),
		emailAdapter()
	];
}
/**
* Load resources for the integration agent's system prompt.
* Mirrors the pattern from agent-chat-plugin.ts.
*/
async function loadResourcesForPrompt(owner) {
	const resourceNames = ["AGENTS.md", "LEARNINGS.md"];
	const sections = [];
	for (const name of resourceNames) {
		try {
			const shared = await resourceGetByPath(SHARED_OWNER, name);
			if (shared?.content?.trim()) sections.push(`<resource name="${name}" scope="shared">\n${shared.content.trim()}\n</resource>`);
		} catch {}
		if (owner !== "__shared__") try {
			const personal = await resourceGetByPath(owner, name);
			if (personal?.content?.trim()) sections.push(`<resource name="${name}" scope="personal">\n${personal.content.trim()}\n</resource>`);
		} catch {}
	}
	if (sections.length === 0) return "";
	return "\n\nThe following resources contain template-specific instructions and user context.\n\n" + sections.join("\n\n");
}
var INTEGRATION_SYSTEM_PROMPT = `You are an AI agent responding via a messaging platform integration (Slack, Telegram, WhatsApp, etc.).

You have the same capabilities as the web chat agent. Use your tools to help the user.

Keep responses concise — messaging platforms have character limits and users expect shorter replies than in a web interface. Use markdown sparingly (bold and lists are fine, but avoid complex formatting that may not render well on all platforms).

If a task requires many steps, summarize what you did rather than streaming every detail.`;
/**
* Creates a Nitro plugin that mounts messaging platform integration webhook routes.
*
* Routes:
*   POST   /_agent-native/integrations/:platform/webhook  — receive platform webhooks
*   GET    /_agent-native/integrations/status              — all integrations status
*   GET    /_agent-native/integrations/:platform/status    — single platform status
*   POST   /_agent-native/integrations/:platform/enable    — enable integration
*   POST   /_agent-native/integrations/:platform/disable   — disable integration
*   POST   /_agent-native/integrations/:platform/setup     — platform-specific setup
*/
function createIntegrationsPlugin(options) {
	return async (nitroApp) => {
		markDefaultPluginProvided(nitroApp, "integrations");
		const adapters = options?.adapters ?? getDefaultAdapters();
		const adapterMap = /* @__PURE__ */ new Map();
		for (const adapter of adapters) adapterMap.set(adapter.platform, adapter);
		const model = options?.model;
		const getApiKey = () => options?.apiKey ?? process.env.ANTHROPIC_API_KEY ?? "";
		const baseSystemPrompt = options?.systemPrompt ?? INTEGRATION_SYSTEM_PROMPT;
		const localActions = options?.actions ?? {};
		let callAgentEntry = {};
		try {
			const mod = await import("./call-agent-D72axh19.js");
			callAgentEntry = { "call-agent": {
				tool: mod.tool,
				run: (args, context) => mod.run(args, context, options?.appId)
			} };
		} catch {}
		const actions = {
			...localActions,
			...callAgentEntry
		};
		const h3 = getH3App(nitroApp);
		const P = `${FRAMEWORK_ROUTE_PREFIX}/integrations`;
		async function requireSession(event) {
			if ((await getSession(event).catch(() => null))?.email) return true;
			setResponseStatus(event, 401);
			return false;
		}
		/**
		* Gate destructive integration writes (enable/disable, setup,
		* setIntegrationConfig…) behind an org-owner/admin check.
		*
		* `integration_configs` is keyed `(platform, config_key)` with no
		* owner column in the PRIMARY KEY — so this row is effectively
		* deployment-wide. Any signed-in user toggling /enable or /disable
		* would otherwise affect every other user (a regular org member could
		* disable Slack/email org-wide, write a malicious allowlist for
		* inbound email, etc.). This check enforces that only owners and
		* admins of the user's active org may mutate integration config.
		*
		* Solo / no-org sessions (i.e. ctx.orgId == null) are allowed — that's
		* the local-dev / single-user case where there's no privilege gradient
		* to enforce. The deployment is single-tenant by definition there.
		*
		* Returns an `{ ok: true }` on pass, or `{ ok: false, error }` with the
		* status already set on the event. The error string lines up with the
		* status code (401 → "unauthorized"; 403 → admin-required message).
		*/
		async function checkOrgAdmin(event) {
			if (!(await getSession(event).catch(() => null))?.email) {
				setResponseStatus(event, 401);
				return {
					ok: false,
					error: "unauthorized"
				};
			}
			const ctx = await getOrgContext(event).catch(() => null);
			if (!ctx?.orgId) return { ok: true };
			if (ctx.role === "owner" || ctx.role === "admin") return { ok: true };
			setResponseStatus(event, 403);
			return {
				ok: false,
				error: "Only organization owners and admins can mutate integration config"
			};
		}
		h3.use(`${P}/status`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			if (!await requireSession(event)) return { error: "unauthorized" };
			const baseUrl = getBaseUrl(event);
			const statuses = [];
			for (const adapter of adapters) {
				const status = await adapter.getStatus(baseUrl);
				status.enabled = !!(await getIntegrationConfig(adapter.platform))?.configData?.enabled;
				status.webhookUrl = `${baseUrl}${P}/${adapter.platform}/webhook`;
				if (!status.requiredEnvKeys) try {
					status.requiredEnvKeys = adapter.getRequiredEnvKeys();
				} catch {
					status.requiredEnvKeys = [];
				}
				statuses.push(status);
			}
			return statuses;
		}));
		h3.use(`${P}/task-queue/status`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			if (!await requireSession(event)) return { error: "unauthorized" };
			try {
				return await getTaskQueueStats();
			} catch (err) {
				setResponseStatus(event, 500);
				return { error: err?.message ?? String(err) };
			}
		}));
		h3.use(`${P}/process-task`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const taskId = (await readBody(event))?.taskId;
			if (!taskId) {
				setResponseStatus(event, 400);
				return { error: "taskId required" };
			}
			if (!process.env.A2A_SECRET) {
				if (process.env.NODE_ENV === "production") {
					setResponseStatus(event, 503);
					return { error: "A2A_SECRET not configured — internal token signing is required to process integration tasks in production." };
				}
			} else {
				const tok = extractBearerToken(getRequestHeader(event, "authorization"));
				if (!tok || !verifyInternalToken(taskId, tok)) {
					setResponseStatus(event, 401);
					return { error: "Invalid or expired internal token" };
				}
			}
			const task = await claimPendingTask(taskId);
			if (!task) {
				setResponseStatus(event, 200);
				return {
					ok: true,
					skipped: "already-claimed-or-missing"
				};
			}
			try {
				const adapter = adapterMap.get(task.platform);
				if (!adapter) {
					await markTaskFailed(taskId, `Unknown platform: ${task.platform}`);
					setResponseStatus(event, 404);
					return { error: "Unknown platform" };
				}
				await processIntegrationTask(task, {
					adapter,
					systemPrompt: baseSystemPrompt + await loadResourcesForPrompt(task.ownerEmail),
					actions,
					model,
					apiKey: getApiKey(),
					engine: options?.engine,
					ownerEmail: task.ownerEmail
				});
				await markTaskCompleted(taskId);
				await processDueA2AContinuations({
					adapters: adapterMap,
					limit: 2
				}).catch((err) => {
					console.error("[integrations] A2A continuation opportunistic sweep failed:", err);
				});
				return {
					ok: true,
					taskId
				};
			} catch (err) {
				await markTaskFailed(taskId, err?.message ? String(err.message).slice(0, 1e3) : "processor failed");
				console.error("[integrations] process-task failure:", err);
				setResponseStatus(event, 500);
				return { error: "Internal task failed" };
			}
		}));
		h3.use(`${P}/process-a2a-continuation`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const continuationId = (await readBody(event))?.continuationId;
			if (!continuationId) {
				setResponseStatus(event, 400);
				return { error: "continuationId required" };
			}
			if (!process.env.A2A_SECRET) {
				if (process.env.NODE_ENV === "production") {
					setResponseStatus(event, 503);
					return { error: "A2A_SECRET not configured — internal token signing is required to process A2A continuations in production." };
				}
			} else {
				const tok = extractBearerToken(getRequestHeader(event, "authorization"));
				if (!tok || !verifyInternalToken(continuationId, tok)) {
					setResponseStatus(event, 401);
					return { error: "Invalid or expired internal token" };
				}
			}
			await processA2AContinuationById(continuationId, { adapters: adapterMap });
			return {
				ok: true,
				continuationId
			};
		}));
		h3.use(`${P}`, defineEventHandler(async (event) => {
			const method = getMethod(event);
			const parts = (event.path || "/").split("?")[0].replace(/^\//, "").split("/").filter(Boolean);
			if (parts[0] === "status" && parts.length === 1) return;
			if (parts[0] === "task-queue") return;
			if (parts[0] === "process-task") return;
			if (parts[0] === "process-a2a-continuation") return;
			const platform = parts[0];
			const action = parts[1];
			if (!platform) {
				setResponseStatus(event, 404);
				return { error: "Platform required" };
			}
			const adapter = adapterMap.get(platform);
			if (!adapter) {
				setResponseStatus(event, 404);
				return { error: `Unknown platform: ${platform}` };
			}
			if (event.context) event.context.params = {
				...event.context.params,
				platform
			};
			if (action === "status" && method === "GET") {
				if (!await requireSession(event)) return { error: "unauthorized" };
				const baseUrl = getBaseUrl(event);
				const status = await adapter.getStatus(baseUrl);
				status.enabled = !!(await getIntegrationConfig(platform))?.configData?.enabled;
				status.webhookUrl = `${baseUrl}${P}/${platform}/webhook`;
				if (!status.requiredEnvKeys) try {
					status.requiredEnvKeys = adapter.getRequiredEnvKeys();
				} catch {
					status.requiredEnvKeys = [];
				}
				return status;
			}
			if (action === "webhook" && method === "POST") {
				if (platform === "google-docs") {
					if (!process.env.GOOGLE_DOCS_PUSH_AUDIENCE) {
						if (process.env.NODE_ENV === "production") {
							setResponseStatus(event, 503);
							return {
								ok: false,
								error: "google-docs push endpoint disabled (audience not configured)"
							};
						}
						handlePushNotification().catch((err) => {
							console.error("[google-docs] Push handler error:", err);
						});
						return "ok";
					}
					const authHeader = getRequestHeader(event, "authorization") || "";
					try {
						await verifyGoogleDocsPushToken(authHeader);
					} catch (err) {
						console.warn(`[google-docs] OIDC verify failed: ${err?.message ?? String(err)}`);
						setResponseStatus(event, 401);
						return {
							ok: false,
							error: "unauthorized"
						};
					}
					handlePushNotification().catch((err) => {
						console.error("[google-docs] Push handler error:", err);
					});
					return "ok";
				}
				const verification = await adapter.handleVerification(event);
				if (verification.handled) return verification.response ?? "ok";
				if (!(await getIntegrationConfig(platform))?.configData?.enabled) {
					setResponseStatus(event, 404);
					return { error: `Integration ${platform} is not enabled` };
				}
				if (!await adapter.verifyWebhook(event)) {
					setResponseStatus(event, 401);
					return { error: "Invalid webhook signature" };
				}
				const incoming = await adapter.parseIncomingMessage(event);
				if (!incoming) {
					setResponseStatus(event, 200);
					return "ok";
				}
				let owner = `integration@${platform}`;
				if (options?.resolveOwner) try {
					owner = await options.resolveOwner(incoming);
				} catch (err) {
					console.error(`[integrations] resolveOwner failed, using default:`, err);
				}
				const result = await handleWebhook(event, {
					adapter,
					systemPrompt: baseSystemPrompt + await loadResourcesForPrompt(owner),
					actions,
					model,
					apiKey: getApiKey(),
					engine: options?.engine,
					ownerEmail: owner,
					beforeProcess: options?.beforeProcess,
					incoming
				});
				setResponseStatus(event, result.status);
				return result.body;
			}
			if (action === "enable" && method === "POST") {
				const adminCheck = await checkOrgAdmin(event);
				if (adminCheck.ok === false) return { error: adminCheck.error };
				await saveIntegrationConfig(platform, { enabled: true }, "default", (await getSession(event).catch(() => null))?.email);
				return {
					ok: true,
					platform,
					enabled: true
				};
			}
			if (action === "disable" && method === "POST") {
				const adminCheck = await checkOrgAdmin(event);
				if (adminCheck.ok === false) return { error: adminCheck.error };
				await saveIntegrationConfig(platform, { enabled: false }, "default", (await getSession(event).catch(() => null))?.email);
				return {
					ok: true,
					platform,
					enabled: false
				};
			}
			if (action === "setup" && method === "POST") {
				const adminCheck = await checkOrgAdmin(event);
				if (adminCheck.ok === false) return { error: adminCheck.error };
				if (platform === "telegram") {
					const webhookUrl = `${getBaseUrl(event)}${P}/telegram/webhook`;
					const token = process.env.TELEGRAM_BOT_TOKEN;
					if (!token) {
						setResponseStatus(event, 400);
						return { error: "TELEGRAM_BOT_TOKEN not configured" };
					}
					try {
						return {
							ok: true,
							platform,
							webhookUrl,
							result: await (await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
								method: "POST",
								headers: { "Content-Type": "application/json" },
								body: JSON.stringify({ url: webhookUrl })
							})).json()
						};
					} catch (err) {
						setResponseStatus(event, 500);
						return { error: err.message };
					}
				}
				return {
					ok: true,
					platform,
					message: "No setup required"
				};
			}
			setResponseStatus(event, 404);
			return { error: "Not found" };
		}));
		startPendingTasksRetryJob({ webhookBaseUrl: process.env.WEBHOOK_BASE_URL });
		startA2AContinuationRetryJob(adapterMap);
		if (adapterMap.has("google-docs")) setTimeout(() => {
			const baseUrl = process.env.WEBHOOK_BASE_URL;
			const webhookUrl = baseUrl ? `${withConfiguredAppBasePath(baseUrl)}${P}/google-docs/webhook` : void 0;
			startGoogleDocsPoller({
				systemPrompt: baseSystemPrompt,
				actions,
				model,
				apiKey: getApiKey(),
				ownerEmail: "integration@google-docs",
				webhookUrl
			});
		}, 2e3);
		if (process.env.DEBUG) console.log(`[integrations] Mounted integration routes for: ${adapters.map((a) => a.platform).join(", ")}`);
	};
}
/**
* Default integrations plugin — auto-mounts all adapters.
*/
var defaultIntegrationsPlugin = createIntegrationsPlugin();
/** Extract base URL from the request */
function getBaseUrl(event) {
	try {
		const headers = event.node?.req?.headers || event.headers || {};
		const getHeader = (name) => typeof headers.get === "function" ? headers.get(name) : headers[name];
		return withConfiguredAppBasePath(`${getHeader("x-forwarded-proto") || "http"}://${getHeader("host") || "localhost:3000"}`);
	} catch {
		return withConfiguredAppBasePath("http://localhost:3000");
	}
}
//#endregion
export { telegramAdapter as a, collectFinalResponseTextFromAgentEvents as c, whatsappAdapter as i, defaultIntegrationsPlugin as n, slackAdapter as o, emailAdapter as r, buildRuntimeContextPrompt as s, createIntegrationsPlugin as t };
