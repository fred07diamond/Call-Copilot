import { r as writeAppState } from "./script-helpers-yPv9toTc.js";
import { i as parseArgs, t as fail } from "./utils-Dd6V9pzd.js";
import { i as getThread } from "./store-BA-0NJdw.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/chat/open-chat.js
/**
* Core script: open-chat
*
* Open a chat thread in the UI as a new tab and focus it.
* Writes a one-shot command to application-state that the UI picks up.
*
* Usage:
*   pnpm action open-chat --id <thread-id>
*/
async function openChat(args) {
	const parsed = parseArgs(args);
	if (parsed.help === "true") {
		console.log(`Usage: pnpm action open-chat --id <thread-id>

Opens a chat thread in the UI as a new tab and focuses it.
Use search-chats to find the thread ID first.

Options:
  --id <thread-id>   The chat thread ID to open (required)
  --help             Show this help message

Examples:
  pnpm action open-chat --id thread-1712100000000-abc123`);
		return;
	}
	const threadId = parsed.id;
	if (!threadId) fail("--id is required. Use \"pnpm action search-chats\" to find thread IDs.");
	const thread = await getThread(threadId);
	if (!thread) fail(`Chat thread "${threadId}" not found.`);
	await writeAppState("chat-command", {
		command: "open-thread",
		threadId,
		timestamp: Date.now()
	});
	const title = thread.title || thread.preview || "(untitled)";
	console.log(`Opening chat: ${title}`);
	console.log(`Thread ID: ${threadId}`);
}
//#endregion
export { openChat as default };
