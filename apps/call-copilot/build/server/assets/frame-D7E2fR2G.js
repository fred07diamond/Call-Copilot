//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/client/frame.js
var _frameOrigin = null;
function normalizeOrigin(value) {
	if (typeof value !== "string") return null;
	try {
		return new URL(value).origin;
	} catch {
		return null;
	}
}
function isTrustedFrameMessage(event) {
	if (typeof window === "undefined") return false;
	const ownOrigin = window.location.origin;
	if (event.origin === ownOrigin) return true;
	const frameOrigin = getFrameOrigin();
	if (!frameOrigin || event.origin !== frameOrigin) return false;
	return event.source === window.parent || event.source === window;
}
if (typeof window !== "undefined") window.addEventListener("message", (event) => {
	const origin = normalizeOrigin(event.data?.origin);
	if (event.data?.type === "agentNative.frameOrigin" && origin && origin === event.origin && !_frameOrigin && event.source === window.parent) _frameOrigin = origin;
});
/**
* Get the frame origin (e.g. "http://localhost:3334").
* Returns null if not running inside a frame iframe.
*/
function getFrameOrigin() {
	return _frameOrigin;
}
/**
* Returns true if the app is running inside a frame iframe
* (local dev frame, Builder.io, or any compatible frame).
*/
function isInFrame() {
	return _frameOrigin !== null;
}
/**
* Get the origin for OAuth callbacks.
* Always uses the app's own origin (window.location.origin), NOT the frame
* origin. The redirect URI registered in Google Cloud Console (or any OAuth
* provider) must match the template app's direct URL, not the dev frame's
* proxy URL, so this must be consistent regardless of how the app is accessed.
*/
function getCallbackOrigin() {
	return typeof window !== "undefined" ? window.location.origin : "";
}
//#endregion
export { isTrustedFrameMessage as i, getFrameOrigin as n, isInFrame as r, getCallbackOrigin as t };
