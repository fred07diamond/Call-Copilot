//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/shared/agent-chat.js
/**
* Isomorphic Agent Chat Utility
*
* Works in both browser and Node.js contexts:
* - Browser: sends via postMessage to the parent window
* - Node.js (scripts): sends via BUILDER_PARENT_MESSAGE stdout format,
*   which the Electron host translates to postMessage
*/
var AGENT_CHAT_MESSAGE_TYPE = "agentNative.submitChat";
var isBrowser = typeof window !== "undefined" && typeof window.postMessage === "function";
/**
* Send a structured message to the agent chat.
* Automatically detects environment (browser vs Node.js) and uses the right transport.
*/
function send(data) {
	const payload = {
		type: AGENT_CHAT_MESSAGE_TYPE,
		data
	};
	if (isBrowser) {
		const target = window.parent !== window ? window.parent : window;
		try {
			target.postMessage(payload, "*");
		} catch (err) {
			console.error("[agentChat] postMessage failed:", err);
		}
	} else console.log("BUILDER_PARENT_MESSAGE:" + JSON.stringify({
		message: payload,
		targetOrigin: "*"
	}));
}
/**
* Submit a message to the agent chat (auto-submits by default).
*/
function submit(message, context) {
	send({
		message,
		context,
		submit: true
	});
}
/**
* Prefill the agent chat input without submitting (user reviews first).
*/
function prefill(message, context) {
	send({
		message,
		context,
		submit: false
	});
}
/**
* Request/response call to the frame agent.
* Sends a message to the frame CLI endpoint and awaits a response.
* Node.js only — requires the frame server to be running.
*/
async function call(message, options) {
	if (isBrowser) throw new Error("agentChat.call() is only available in Node.js");
	const port = options?.framePort ?? (typeof process !== "undefined" && process.env.FRAME_PORT ? parseInt(process.env.FRAME_PORT, 10) : 3333);
	const timeout = options?.timeout ?? 3e5;
	const controller = new AbortController();
	const timer = setTimeout(() => controller.abort(), timeout);
	try {
		const res = await fetch(`http://localhost:${port}/api/chat`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				message,
				context: options?.context
			}),
			signal: controller.signal
		});
		if (!res.ok) {
			const text = await res.text();
			throw new Error(`Frame chat failed (${res.status}): ${text}`);
		}
		return await res.json();
	} finally {
		clearTimeout(timer);
	}
}
var agentChat = {
	send,
	submit,
	prefill,
	call
};
//#endregion
export { agentChat as t };
