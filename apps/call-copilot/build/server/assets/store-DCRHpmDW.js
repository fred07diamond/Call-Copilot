import { i as getDbExec, o as intType } from "./client-BpA2t7pN.js";
import { EventEmitter } from "events";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/agent/thread-data-builder.js
var MAX_STORED_ATTACHMENT_CHARS = 6e4;
function isInternalContinuationError(event) {
	const code = String(event.errorCode ?? "").toLowerCase();
	const msg = event.error.toLowerCase();
	if (code === "builder_gateway_error") return false;
	return event.recoverable === true || code === "builder_gateway_timeout" || code === "stale_run" || code === "timeout" || code === "timeout_error" || code === "http_408" || code === "http_429" || code === "http_500" || code === "http_502" || code === "http_503" || code === "http_504" || code === "rate_limited" || code === "too_many_concurrent_requests" || code === "overloaded_error" || msg.includes("timeout") || msg.includes("gateway timeout") || msg.includes("inactivity timeout") || msg.includes("stream ended") || msg.includes("stream closed") || msg.includes("temporarily unavailable") || msg.includes("502") || msg.includes("503") || msg.includes("504") || msg.includes("529");
}
/**
* Reconstruct an assistant-ui message from raw agent run events.
* Mirrors the client-side processEvent logic so the server can persist
* the assistant's response even if the frontend is disconnected.
*/
function buildAssistantMessage(events, runId, options = {}) {
	const content = [];
	let toolCallCounter = 0;
	let runError = null;
	let endedAtInternalContinuationBoundary = false;
	const appendText = (text) => {
		const last = content[content.length - 1];
		if (last && last.type === "text") last.text = (last.text ?? "") + text;
		else content.push({
			type: "text",
			text
		});
	};
	for (const { event } of events) {
		if (event.type === "clear") {
			content.length = 0;
			toolCallCounter = 0;
			continue;
		}
		if (event.type === "text") {
			appendText(event.text ?? "");
			continue;
		}
		if (event.type === "tool_start") {
			const toolCallId = `tc_${++toolCallCounter}`;
			const args = event.input ?? {};
			content.push({
				type: "tool-call",
				toolCallId,
				toolName: event.tool ?? "unknown",
				argsText: JSON.stringify(args),
				args
			});
			continue;
		}
		if (event.type === "tool_done") {
			for (let i = content.length - 1; i >= 0; i--) {
				const part = content[i];
				if (part.type === "tool-call" && part.toolName === event.tool && part.result === void 0) {
					part.result = event.result ?? "";
					break;
				}
			}
			continue;
		}
		if (event.type === "loop_limit") {
			if (options.suppressInternalContinuation) endedAtInternalContinuationBoundary = true;
			continue;
		}
		if (event.type === "auto_continue") {
			if (options.suppressInternalContinuation) endedAtInternalContinuationBoundary = true;
			continue;
		}
		if (event.type === "error") {
			if (options.suppressInternalContinuation && isInternalContinuationError(event)) {
				endedAtInternalContinuationBoundary = true;
				continue;
			}
			if (event.errorCode === "run_timeout" && event.recoverable) continue;
			runError = {
				message: event.error,
				...event.errorCode ? { errorCode: event.errorCode } : {},
				...event.details ? { details: event.details } : {},
				...event.recoverable ? { recoverable: event.recoverable } : {}
			};
			appendText(`${content.length > 0 ? "\n\n" : ""}Error: ${event.error}`);
			continue;
		}
	}
	if (content.length === 0 || endedAtInternalContinuationBoundary) return null;
	const metadata = {};
	if (runId) metadata.runId = runId;
	if (runError) metadata.custom = { runError: {
		...runError,
		...runId ? { runId } : {}
	} };
	return {
		id: `server-${runId ?? Date.now()}`,
		createdAt: /* @__PURE__ */ new Date(),
		role: "assistant",
		content,
		status: runError ? {
			type: "incomplete",
			reason: "error"
		} : {
			type: "complete",
			reason: "stop"
		},
		metadata
	};
}
function getStoredMessage(entry) {
	return entry?.message ?? entry;
}
function getStoredParentId(entry) {
	return typeof entry?.parentId === "string" || entry?.parentId === null ? entry.parentId : void 0;
}
function getStoredRunConfig(entry) {
	return entry && typeof entry === "object" && "runConfig" in entry ? entry.runConfig : void 0;
}
function messageId(message) {
	return typeof message?.id === "string" && message.id ? message.id : void 0;
}
function getMessageRunId(message) {
	const meta = message?.metadata;
	const direct = meta?.runId;
	const custom = meta?.custom?.runId;
	const errorRun = meta?.custom?.runError?.runId ?? meta?.runError?.runId;
	if (typeof direct === "string") return direct;
	if (typeof custom === "string") return custom;
	if (typeof errorRun === "string") return errorRun;
}
function messageContentIsEmpty(content) {
	if (Array.isArray(content)) return content.length === 0;
	return content == null || content === "";
}
function messageText(content) {
	if (typeof content === "string") return content;
	if (!Array.isArray(content)) return "";
	return content.filter((part) => part?.type === "text" && typeof part.text === "string").map((part) => part.text).join("");
}
function isTerminalAssistantStatus(status) {
	const type = status?.type;
	return type === "complete" || type === "incomplete";
}
function normalizeAttachmentIdentity(attachments) {
	if (!Array.isArray(attachments) || attachments.length === 0) return void 0;
	return attachments.map((att) => ({
		type: att?.type,
		name: att?.name,
		contentType: att?.contentType
	}));
}
function messageIdentityKeys(message) {
	const keys = [];
	if (typeof message?.id === "string" && message.id) keys.push(`id:${message.id}`);
	const runId = getMessageRunId(message);
	if (runId) keys.push(`run:${runId}`);
	try {
		keys.push(`fingerprint:${JSON.stringify({
			role: message?.role,
			content: message?.content,
			attachments: normalizeAttachmentIdentity(message?.attachments)
		})}`);
	} catch {}
	if (message?.role === "user") try {
		keys.push(`user-fingerprint:${JSON.stringify({
			role: message.role,
			content: message.content,
			attachments: normalizeAttachmentIdentity(message.attachments)
		})}`);
	} catch {}
	return keys;
}
function messagesMatch(a, b) {
	const bKeys = new Set(messageIdentityKeys(b));
	return messageIdentityKeys(a).some((key) => bKeys.has(key));
}
function chooseMergedMessageEntry(existingEntry, incomingEntry) {
	const existing = getStoredMessage(existingEntry);
	const incoming = getStoredMessage(incomingEntry);
	if (existing?.role === "assistant" && incoming?.role === "assistant" && isTerminalAssistantStatus(existing?.status) && !isTerminalAssistantStatus(incoming?.status)) return existingEntry;
	return incomingEntry;
}
function normalizeMessageEntry(entry, parentId) {
	const message = getStoredMessage(entry);
	if (!messageId(message)) return null;
	const runConfig = getStoredRunConfig(entry);
	return {
		message,
		parentId,
		...runConfig !== void 0 ? { runConfig } : {}
	};
}
/**
* Convert legacy/partially merged thread data into assistant-ui's exported
* repository shape and repair parent links so `threadRuntime.import()` cannot
* fail with "Parent message not found".
*/
function normalizeThreadRepository(repo) {
	const normalized = repo && typeof repo === "object" ? { ...repo } : {};
	const sourceMessages = Array.isArray(repo?.messages) ? repo.messages : [];
	const messages = [];
	const seenIds = /* @__PURE__ */ new Set();
	let previousId = null;
	for (const entry of sourceMessages) {
		const id = messageId(getStoredMessage(entry));
		if (!id) continue;
		const requestedParentId = getStoredParentId(entry);
		const normalizedEntry = normalizeMessageEntry(entry, requestedParentId === null ? null : requestedParentId && seenIds.has(requestedParentId) ? requestedParentId : previousId);
		if (!normalizedEntry) continue;
		messages.push(normalizedEntry);
		seenIds.add(id);
		previousId = id;
	}
	normalized.messages = messages;
	const headId = typeof repo?.headId === "string" ? repo.headId : void 0;
	normalized.headId = headId && seenIds.has(headId) ? headId : previousId ?? null;
	return normalized;
}
function rewriteEntryParentId(entry, idRewrites) {
	const parentId = getStoredParentId(entry);
	if (!parentId) return entry;
	const rewritten = idRewrites.get(parentId);
	if (!rewritten) return entry;
	return {
		...entry,
		parentId: rewritten
	};
}
function mergeThreadDataForClientSave(existingRepo, incomingRepo, options = {}) {
	const preserveExistingQueuedMessages = options.preserveExistingQueuedMessages ?? true;
	const preserveExistingTopLevelKeys = options.preserveExistingTopLevelKeys ?? true;
	const existingNormalized = normalizeThreadRepository(existingRepo);
	const incomingNormalized = normalizeThreadRepository(incomingRepo);
	const merged = incomingNormalized && typeof incomingNormalized === "object" ? { ...incomingNormalized } : {};
	if (preserveExistingTopLevelKeys && existingNormalized && typeof existingNormalized === "object") for (const [key, value] of Object.entries(existingNormalized)) {
		if (key === "messages" || key === "headId") continue;
		if (key === "queuedMessages" && !preserveExistingQueuedMessages) continue;
		if (!(key in merged)) merged[key] = value;
	}
	else if (preserveExistingQueuedMessages && existingNormalized && typeof existingNormalized === "object" && existingNormalized.queuedMessages !== void 0 && merged.queuedMessages === void 0) merged.queuedMessages = existingNormalized.queuedMessages;
	const existingMessages = Array.isArray(existingNormalized?.messages) ? existingNormalized.messages : null;
	const incomingMessages = Array.isArray(merged.messages) ? merged.messages : null;
	if (!existingMessages || !incomingMessages) return merged;
	const incomingKeySets = incomingMessages.map((entry) => new Set(messageIdentityKeys(getStoredMessage(entry))));
	const usedIncoming = /* @__PURE__ */ new Set();
	const nextMessages = [];
	const idRewrites = /* @__PURE__ */ new Map();
	for (const existingEntry of existingMessages) {
		const existingKeys = messageIdentityKeys(getStoredMessage(existingEntry));
		const incomingIndex = incomingKeySets.findIndex((keys, index) => !usedIncoming.has(index) && existingKeys.some((key) => keys.has(key)));
		if (incomingIndex === -1) {
			nextMessages.push(existingEntry);
			continue;
		}
		usedIncoming.add(incomingIndex);
		const incomingEntry = incomingMessages[incomingIndex];
		const chosen = chooseMergedMessageEntry(existingEntry, incomingEntry);
		const existingId = messageId(getStoredMessage(existingEntry));
		const chosenId = messageId(getStoredMessage(chosen));
		if (existingId && chosenId && existingId !== chosenId) idRewrites.set(existingId, chosenId);
		nextMessages.push(chosen);
	}
	for (let index = 0; index < incomingMessages.length; index++) if (!usedIncoming.has(index)) nextMessages.push(incomingMessages[index]);
	merged.messages = nextMessages.map((entry) => rewriteEntryParentId(entry, idRewrites));
	return normalizeThreadRepository(merged);
}
function escapeAttachmentAttribute(value) {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;");
}
function unwrapTextAttachmentEnvelope(text) {
	const match = text.match(/^<attachment\b[^>]*>\n?([\s\S]*?)\n?<\/attachment>$/);
	return match ? match[1] : text;
}
function truncateStoredAttachment(text) {
	const unwrapped = unwrapTextAttachmentEnvelope(text);
	if (unwrapped.length <= MAX_STORED_ATTACHMENT_CHARS) return unwrapped;
	const omitted = unwrapped.length - MAX_STORED_ATTACHMENT_CHARS;
	return `${unwrapped.slice(0, MAX_STORED_ATTACHMENT_CHARS)}\n\n[Attachment truncated after ${MAX_STORED_ATTACHMENT_CHARS.toLocaleString()} characters; ${omitted.toLocaleString()} characters omitted from persisted chat history.]`;
}
function textAttachmentEnvelope(att, text) {
	return `<attachment ${[
		`name="${escapeAttachmentAttribute(att.name || "attachment")}"`,
		att.contentType ? `contentType="${escapeAttachmentAttribute(att.contentType)}"` : null,
		att.type ? `type="${escapeAttachmentAttribute(att.type)}"` : null
	].filter(Boolean).join(" ")}>\n${truncateStoredAttachment(text)}\n</attachment>`;
}
function buildStoredAttachments(attachments, runId) {
	return (attachments ?? []).map((att, index) => {
		const id = `server-${runId ?? Date.now()}-attachment-${index}`;
		if (att.type === "image" && att.data) return {
			id,
			type: "image",
			name: att.name,
			contentType: att.contentType,
			status: { type: "complete" },
			content: [{
				type: "image",
				image: att.data
			}]
		};
		if (att.data) return {
			id,
			type: "file",
			name: att.name,
			contentType: att.contentType,
			status: { type: "complete" },
			content: [{
				type: "file",
				data: att.data,
				mimeType: att.contentType,
				filename: att.name
			}]
		};
		if (typeof att.text === "string" && att.text.length > 0) return {
			id,
			type: "file",
			name: att.name,
			contentType: att.contentType,
			status: { type: "complete" },
			content: [{
				type: "text",
				text: textAttachmentEnvelope(att, att.text)
			}]
		};
		return null;
	}).filter(Boolean);
}
function buildUserMessage(opts) {
	const attachments = buildStoredAttachments(opts.attachments, opts.runId);
	return {
		id: `server-user-${opts.runId ?? Date.now()}`,
		createdAt: opts.createdAt ?? /* @__PURE__ */ new Date(),
		role: "user",
		content: [{
			type: "text",
			text: opts.text
		}],
		...attachments.length > 0 ? { attachments } : {},
		metadata: { custom: { submittedRunId: opts.runId } }
	};
}
function upsertUserMessage(repo, userMsg) {
	const nextRepo = normalizeThreadRepository(repo);
	const lastIndex = nextRepo.messages.length - 1;
	const lastEntry = lastIndex >= 0 ? nextRepo.messages[lastIndex] : void 0;
	const lastMsg = getStoredMessage(lastEntry);
	if (lastMsg?.role === "user" && messagesMatch(lastMsg, userMsg)) return nextRepo;
	const parentId = lastIndex >= 0 ? messageId(getStoredMessage(lastEntry)) ?? null : null;
	nextRepo.messages.push({
		message: userMsg,
		parentId
	});
	nextRepo.headId = userMsg.id;
	return nextRepo;
}
function shouldReplaceLastAssistant(lastMessage, assistantMsg) {
	const lastContent = lastMessage?.content;
	if (messageContentIsEmpty(lastContent)) return true;
	const lastRunId = getMessageRunId(lastMessage);
	const nextRunId = getMessageRunId(assistantMsg);
	if (lastRunId && nextRunId && lastRunId === nextRunId) return true;
	if (lastRunId && nextRunId && lastRunId !== nextRunId) return false;
	const lastStatus = lastMessage?.status;
	if (lastStatus && !isTerminalAssistantStatus(lastStatus)) return true;
	try {
		if (JSON.stringify(lastContent) === JSON.stringify(assistantMsg.content)) return true;
	} catch {}
	const lastText = messageText(lastContent).trim();
	const nextText = messageText(assistantMsg.content).trim();
	if (isTerminalAssistantStatus(lastStatus)) return false;
	return Boolean(lastText && nextText && nextText.startsWith(lastText));
}
/**
* Merge the server-reconstructed assistant message into persisted
* assistant-ui thread data.
*
* The browser periodically saves thread data while a run is still streaming.
* That can leave the last assistant message non-empty but partial/pending.
* Completion must replace that same-run partial message instead of treating
* any assistant content as proof that the frontend already saved the final
* turn.
*/
function upsertAssistantMessage(repo, assistantMsg) {
	const nextRepo = normalizeThreadRepository(repo);
	const lastIndex = nextRepo.messages.length - 1;
	const lastEntry = lastIndex >= 0 ? nextRepo.messages[lastIndex] : void 0;
	const lastMsg = getStoredMessage(lastEntry);
	if (lastMsg?.role === "assistant" && shouldReplaceLastAssistant(lastMsg, assistantMsg)) {
		nextRepo.messages[lastIndex] = {
			...lastEntry,
			message: assistantMsg
		};
		nextRepo.headId = assistantMsg.id;
		return nextRepo;
	}
	const parentId = nextRepo.messages.length > 0 ? messageId(getStoredMessage(nextRepo.messages[nextRepo.messages.length - 1])) ?? null : null;
	nextRepo.messages.push({
		message: assistantMsg,
		parentId
	});
	nextRepo.headId = assistantMsg.id;
	return nextRepo;
}
/**
* Extract title and preview from a thread runtime export.
* Isomorphic — works on both server and client.
*/
function extractThreadMeta(repo) {
	const msgs = repo?.messages;
	if (!Array.isArray(msgs) || msgs.length === 0) return {
		title: "",
		preview: ""
	};
	let title = "";
	let preview = "";
	for (const entry of msgs) {
		const msg = entry?.message ?? entry;
		if (msg.role !== "user") continue;
		const textParts = Array.isArray(msg.content) ? msg.content.filter((p) => p.type === "text").map((p) => p.text).join(" ") : typeof msg.content === "string" ? msg.content : "";
		if (textParts.trim()) {
			if (!title) title = textParts.trim().slice(0, 80);
			preview = textParts.trim().slice(0, 120);
		}
	}
	return {
		title,
		preview
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/chat-threads/emitter.js
var _emitter = new EventEmitter();
function emitChatThreadChange(threadId) {
	const event = {
		source: "chat-threads",
		type: "change",
		key: threadId
	};
	_emitter.emit("chat-threads", event);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/chat-threads/store.js
var _initPromise;
/**
* Per-thread async mutex. Read-modify-write on the `thread_data` JSON blob
* is not atomic at the DB level — two concurrent callers (e.g. the UI
* persisting queued messages while `onRunComplete` appends agent output)
* would both read the same row, each mutate it independently, and the
* second write clobbers the first. Serializing on thread id inside this
* process eliminates the race for the usual single-process deployment
* while leaving straight reads and other thread-data-unrelated updates
* untouched.
*
* Cross-process races are handled by `updateThreadData`, which performs a
* compare-and-swap on `updated_at`, rereads the latest row on conflict, and
* remerges message history before retrying.
*/
var _threadDataLocks = /* @__PURE__ */ new Map();
function withThreadDataLock(threadId, fn) {
	const next = (_threadDataLocks.get(threadId) ?? Promise.resolve()).then(fn, fn);
	_threadDataLocks.set(threadId, next);
	const cleanup = () => {
		if (_threadDataLocks.get(threadId) === next) _threadDataLocks.delete(threadId);
	};
	next.then(cleanup, cleanup);
	return next;
}
async function ensureTable() {
	if (!_initPromise) _initPromise = (async () => {
		await getDbExec().execute(`
        CREATE TABLE IF NOT EXISTS chat_threads (
          id TEXT PRIMARY KEY,
          owner_email TEXT NOT NULL,
          title TEXT NOT NULL DEFAULT '',
          preview TEXT NOT NULL DEFAULT '',
          thread_data TEXT NOT NULL DEFAULT '{}',
          message_count ${intType()} NOT NULL DEFAULT 0,
          created_at ${intType()} NOT NULL,
          updated_at ${intType()} NOT NULL
        )
      `);
	})();
	return _initPromise;
}
function generateId() {
	return `thread-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
function deriveMessageCount(threadData, fallback) {
	if (typeof threadData !== "string" || !threadData.trim()) return fallback;
	try {
		const repo = normalizeThreadRepository(JSON.parse(threadData));
		if (Array.isArray(repo.messages)) return repo.messages.length;
	} catch {}
	return fallback;
}
function rowToThread(r) {
	const threadData = r.thread_data ?? "{}";
	const storedCount = Number(r.message_count);
	return {
		id: r.id,
		ownerEmail: r.owner_email,
		title: r.title,
		preview: r.preview,
		threadData,
		messageCount: deriveMessageCount(threadData, storedCount),
		createdAt: Number(r.created_at),
		updatedAt: Number(r.updated_at)
	};
}
function rowToSummary(r) {
	const threadData = r.thread_data;
	const messageCount = deriveMessageCount(threadData, Number(r.message_count));
	if (messageCount <= 0) return null;
	return {
		id: r.id,
		title: r.title,
		preview: r.preview,
		messageCount,
		createdAt: Number(r.created_at),
		updatedAt: Number(r.updated_at)
	};
}
async function createThread(ownerEmail, opts) {
	await ensureTable();
	const client = getDbExec();
	const id = opts?.id ?? generateId();
	const now = Date.now();
	const title = opts?.title ?? "";
	await client.execute({
		sql: `INSERT INTO chat_threads (id, owner_email, title, preview, thread_data, message_count, created_at, updated_at) VALUES (?, ?, ?, '', '{}', 0, ?, ?)`,
		args: [
			id,
			ownerEmail,
			title,
			now,
			now
		]
	});
	return {
		id,
		ownerEmail,
		title,
		preview: "",
		threadData: "{}",
		messageCount: 0,
		createdAt: now,
		updatedAt: now
	};
}
async function getThread(id) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT id, owner_email, title, preview, thread_data, message_count, created_at, updated_at FROM chat_threads WHERE id = ?`,
		args: [id]
	});
	if (rows.length === 0) return null;
	return rowToThread(rows[0]);
}
async function forkThread(sourceId, ownerEmail, opts) {
	const source = await getThread(sourceId);
	if (!source || source.ownerEmail !== ownerEmail) return null;
	const id = opts?.id ?? generateId();
	const now = Date.now();
	const title = source.title ? `${source.title} (fork)` : "";
	await getDbExec().execute({
		sql: `INSERT INTO chat_threads (id, owner_email, title, preview, thread_data, message_count, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
		args: [
			id,
			ownerEmail,
			title,
			source.preview,
			source.threadData,
			source.messageCount,
			now,
			now
		]
	});
	return {
		id,
		ownerEmail,
		title,
		preview: source.preview,
		threadData: source.threadData,
		messageCount: source.messageCount,
		createdAt: now,
		updatedAt: now
	};
}
async function listThreads(ownerEmail, limit = 50, offset = 0) {
	await ensureTable();
	const { rows } = await getDbExec().execute({
		sql: `SELECT id, title, preview, thread_data, message_count, created_at, updated_at FROM chat_threads WHERE owner_email = ? AND (message_count > 0 OR thread_data LIKE '%"messages"%') ORDER BY updated_at DESC LIMIT ? OFFSET ?`,
		args: [
			ownerEmail,
			limit,
			offset
		]
	});
	return rows.map((r) => rowToSummary(r)).filter((r) => r !== null);
}
function escapeLike(s) {
	return s.replace(/([\\%_])/g, "\\$1");
}
async function searchThreads(ownerEmail, query, limit = 50) {
	await ensureTable();
	const client = getDbExec();
	const pattern = `%${escapeLike(query)}%`;
	const { rows } = await client.execute({
		sql: `SELECT id, title, preview, thread_data, message_count, created_at, updated_at FROM chat_threads WHERE owner_email = ? AND (message_count > 0 OR thread_data LIKE '%"messages"%') AND (title LIKE ? OR preview LIKE ? OR thread_data LIKE ?) ORDER BY updated_at DESC LIMIT ?`,
		args: [
			ownerEmail,
			pattern,
			pattern,
			pattern,
			limit
		]
	});
	return rows.map((r) => rowToSummary(r)).filter((r) => r !== null);
}
function parseThreadData(value) {
	try {
		return JSON.parse(value || "{}");
	} catch {
		return {};
	}
}
async function updateThreadData(id, threadData, title, preview, messageCount, options = {}) {
	await ensureTable();
	const client = getDbExec();
	const maxAttempts = options.maxAttempts ?? 5;
	let lastConflict = false;
	for (let attempt = 0; attempt < maxAttempts; attempt++) {
		const current = await getThread(id);
		if (!current) return;
		let nextThreadData = threadData;
		let nextMessageCount = messageCount;
		try {
			const merged = mergeThreadDataForClientSave(parseThreadData(current.threadData), parseThreadData(threadData), {
				preserveExistingQueuedMessages: options.preserveExistingQueuedMessages ?? true,
				preserveExistingTopLevelKeys: options.preserveExistingTopLevelKeys ?? true
			});
			nextThreadData = JSON.stringify(merged);
			if (Array.isArray(merged.messages)) nextMessageCount = merged.messages.length;
		} catch {}
		const nextUpdatedAt = Math.max(Date.now(), current.updatedAt + 1);
		if ((await client.execute({
			sql: `UPDATE chat_threads SET thread_data = ?, title = ?, preview = ?, message_count = ?, updated_at = ? WHERE id = ? AND updated_at = ?`,
			args: [
				nextThreadData,
				title,
				preview,
				nextMessageCount,
				nextUpdatedAt,
				id,
				current.updatedAt
			]
		})).rowsAffected > 0) {
			emitChatThreadChange(id);
			return;
		}
		lastConflict = true;
		await new Promise((resolve) => setTimeout(resolve, 10 * (attempt + 1)));
	}
	if (lastConflict) throw new Error(`Failed to update chat thread ${id} after concurrent write conflicts.`);
}
/**
* Persist the user's queued (not-yet-sent) messages onto the thread.
* Stored in thread_data JSON so it survives reloads without a schema
* change. Safe to call often — the frontend debounces writes.
*/
async function setThreadQueuedMessages(threadId, queuedMessages) {
	return withThreadDataLock(threadId, async () => {
		const thread = await getThread(threadId);
		if (!thread) return;
		let data = {};
		try {
			data = JSON.parse(thread.threadData);
		} catch {}
		if (queuedMessages.length === 0) delete data.queuedMessages;
		else data.queuedMessages = queuedMessages;
		await updateThreadData(threadId, JSON.stringify(data), thread.title, thread.preview, thread.messageCount, { preserveExistingQueuedMessages: false });
	});
}
async function deleteThread(id) {
	await ensureTable();
	if ((await getDbExec().execute({
		sql: `DELETE FROM chat_threads WHERE id = ?`,
		args: [id]
	})).rowsAffected > 0) {
		emitChatThreadChange(id);
		return true;
	}
	return false;
}
//#endregion
export { listThreads as a, updateThreadData as c, buildUserMessage as d, extractThreadMeta as f, upsertUserMessage as g, upsertAssistantMessage as h, getThread as i, withThreadDataLock as l, normalizeThreadRepository as m, deleteThread as n, searchThreads as o, mergeThreadDataForClientSave as p, forkThread as r, setThreadQueuedMessages as s, createThread as t, buildAssistantMessage as u };
