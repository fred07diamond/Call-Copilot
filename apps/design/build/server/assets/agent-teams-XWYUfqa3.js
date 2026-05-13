import { o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { l as startRun } from "./run-manager-AJUEq7Np.js";
import { n as createAnthropicEngine } from "./builtin-CZUg4_3B.js";
import { n as readAppState, r as writeAppState, t as listAppState } from "./script-helpers-yPv9toTc.js";
import { h as runAgentLoop, r as actionsToEngineTools } from "./production-agent-DnqiykSA.js";
import { t as createThread, u as buildAssistantMessage } from "./store-BA-0NJdw.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/agent-teams.js
/**
* Agent Teams — sub-agent orchestration for agent-native.
*
* The main agent chat acts as an orchestrator. It spawns sub-agents
* for individual tasks, which run in their own threads. Sub-agents
* appear as rich preview cards (chips) inline in the main chat.
*
* This module provides the server-side infrastructure:
* - Creating sub-agent threads and running them in background
* - Tracking task status and results
* - Emitting SSE events for live preview cards
* - Bidirectional messaging between main agent and sub-agents
*
* Task state is persisted in application_state (SQL) so it survives
* serverless cold starts and works across multiple processes.
*/
/** Key prefix for task records: agent-task:{taskId} */
var TASK_PREFIX = "agent-task:";
/** Key prefix for thread→task reverse lookup: agent-task-thread:{threadId} */
var THREAD_PREFIX = "agent-task-thread:";
async function saveTask(task) {
	await writeAppState(`${TASK_PREFIX}${task.taskId}`, task);
	await writeAppState(`${THREAD_PREFIX}${task.threadId}`, { taskId: task.taskId });
}
async function loadTask(taskId) {
	const data = await readAppState(`${TASK_PREFIX}${taskId}`);
	return data ? data : null;
}
function generateTaskId() {
	return `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
/**
* Spawn a sub-agent task. Creates a thread, starts a background agent run,
* and emits agent_task events to the parent chat stream.
*/
async function spawnTask(opts) {
	const taskId = generateTaskId();
	const thread = await createThread(opts.ownerEmail, { title: opts.description.slice(0, 100) });
	const userMsgId = `msg-${taskId}-user`;
	try {
		const { updateThreadData } = await import("./store-BTUk7r09.js");
		const threadData = JSON.stringify({
			headId: userMsgId,
			messages: [{
				message: {
					id: userMsgId,
					role: "user",
					content: [{
						type: "text",
						text: opts.description
					}],
					metadata: {}
				},
				parentId: null
			}]
		});
		await updateThreadData(thread.id, threadData, opts.description.slice(0, 100), opts.description.slice(0, 200), 1);
	} catch {}
	const task = {
		taskId,
		threadId: thread.id,
		description: opts.description,
		status: "running",
		preview: "",
		summary: "",
		currentStep: "",
		createdAt: Date.now()
	};
	await saveTask(task);
	opts.parentSend({
		type: "agent_task",
		taskId,
		threadId: thread.id,
		description: opts.description,
		status: "running"
	});
	let systemPrompt = `## You Are a Sub-Agent

You are a focused sub-agent with a specific task. You have been given a curated set of actions that connect directly to the app's database and services.

**Start immediately with your task. Do NOT:**
- Run \`db-schema\` to explore the database structure
- Run \`search-files\` or \`list-files\` to find code
- Try to \`curl\` or access external URLs to find the app
- Use \`shell\` for exploration — only for running \`pnpm action\` commands when no direct action exists

**Your available actions (${Object.keys(opts.actions).join(", ")}) work directly. Use them.**

` + opts.systemPrompt;
	if (opts.instructions) systemPrompt += `\n\n## Task-Specific Instructions\n\n${opts.instructions}`;
	const engine = opts.engine ?? createAnthropicEngine({ apiKey: opts.apiKey });
	const model = opts.model ?? engine.defaultModel;
	const tools = actionsToEngineTools(opts.actions);
	const messages = [{
		role: "user",
		content: [{
			type: "text",
			text: opts.description
		}]
	}];
	const runId = `run-task-${taskId}`;
	let accumulatedText = "";
	let lastPreviewSent = 0;
	const PREVIEW_INTERVAL_MS = 300;
	let runFinished = false;
	startRun(runId, thread.id, async (send, signal) => {
		const sendPreviewUpdate = async (force = false) => {
			if (runFinished) return;
			const now = Date.now();
			if (!force && now - lastPreviewSent < PREVIEW_INTERVAL_MS) return;
			lastPreviewSent = now;
			task.preview = accumulatedText.slice(-800);
			await saveTask(task);
			opts.parentSend({
				type: "agent_task_update",
				taskId,
				preview: task.preview,
				currentStep: task.currentStep
			});
		};
		const wrappedSend = (event) => {
			send(event);
			if (event.type === "text") {
				accumulatedText += event.text;
				sendPreviewUpdate();
			} else if (event.type === "tool_start") {
				task.currentStep = `Running ${event.tool}...`;
				sendPreviewUpdate(true);
			} else if (event.type === "tool_done") {
				task.currentStep = "";
				sendPreviewUpdate(true);
			}
		};
		await runAgentLoop({
			engine,
			model,
			systemPrompt,
			tools,
			messages,
			actions: opts.actions,
			send: wrappedSend,
			signal
		});
	}, async (run) => {
		runFinished = true;
		if (run.status === "errored") {
			task.status = "errored";
			task.summary = accumulatedText.slice(-500) || "Task failed.";
			await saveTask(task);
			opts.parentSend({
				type: "agent_task",
				taskId,
				threadId: thread.id,
				description: task.description,
				status: "errored"
			});
		} else {
			task.status = "completed";
			task.summary = accumulatedText.slice(-1e3) || "Task completed successfully.";
			await saveTask(task);
			opts.parentSend({
				type: "agent_task_complete",
				taskId,
				summary: task.summary
			});
		}
		try {
			const { updateThreadData } = await import("./store-BTUk7r09.js");
			const userMsg = {
				id: `msg-${taskId}-user`,
				role: "user",
				content: [{
					type: "text",
					text: opts.description
				}],
				metadata: {}
			};
			const assistantMsg = buildAssistantMessage(run.events ?? [], `task-${taskId}`);
			const messages = [{
				message: userMsg,
				parentId: null
			}];
			if (assistantMsg) messages.push({
				message: {
					...assistantMsg,
					status: {
						type: "complete",
						reason: "stop"
					}
				},
				parentId: userMsg.id
			});
			const repo = {
				headId: assistantMsg?.id ?? userMsg.id,
				messages
			};
			const title = opts.description.slice(0, 100);
			const preview = accumulatedText.slice(0, 200);
			await updateThreadData(thread.id, JSON.stringify(repo), title, preview, repo.messages.length);
		} catch {}
		if (opts.parentThreadId) try {
			const { getActiveRunForThread } = await import("./run-manager-C-goD6I0.js");
			const activeRun = getActiveRunForThread(opts.parentThreadId);
			if (!activeRun || activeRun.status !== "running") {
				const followUpEngine = opts.engine ?? createAnthropicEngine({ apiKey: opts.apiKey });
				const followUpModel = opts.model ?? followUpEngine.defaultModel;
				const notification = `[Sub-agent ${task.status === "errored" ? "!" : "done"}] The sub-agent task "${task.description}" has ${task.status === "errored" ? "failed" : "completed"}.\n\nSummary of what it did:\n${task.summary}\n\nBriefly let the user know the sub-agent finished and highlight any key results. Be concise — 1-2 sentences.`;
				startRun(`run-followup-${taskId}`, opts.parentThreadId, async (send, signal) => {
					await runAgentLoop({
						engine: followUpEngine,
						model: followUpModel,
						systemPrompt: opts.systemPrompt,
						tools: [],
						messages: [{
							role: "user",
							content: [{
								type: "text",
								text: notification
							}]
						}],
						actions: {},
						send,
						signal
					});
				});
			}
		} catch {}
	});
	return task;
}
/** Get task by ID */
async function getTask(taskId) {
	return await loadTask(taskId) ?? void 0;
}
/** List all tasks (most recent first) */
async function listTasks() {
	return (await listAppState(TASK_PREFIX)).map((e) => e.value).sort((a, b) => b.createdAt - a.createdAt);
}
/** Send a message/update to a running sub-agent via application state */
async function sendToTask(taskId, message) {
	const task = await loadTask(taskId);
	if (!task) return {
		ok: false,
		error: "Task not found"
	};
	if (task.status !== "running") return {
		ok: false,
		error: "Task is not running"
	};
	try {
		const { appStatePut } = await import("./store-CDQf-k5x2.js");
		const sessionId = getRequestUserEmail();
		if (!sessionId) return {
			ok: false,
			error: "no authenticated user"
		};
		await appStatePut(sessionId, `task-message:${taskId}`, {
			from: "orchestrator",
			message,
			timestamp: Date.now()
		});
	} catch {}
	return { ok: true };
}
//#endregion
export { spawnTask as i, listTasks as n, sendToTask as r, getTask as t };
