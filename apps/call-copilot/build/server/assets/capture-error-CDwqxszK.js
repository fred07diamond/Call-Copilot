//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/server/capture-error.js
var providers = /* @__PURE__ */ new Map();
/**
* Register a backend for the framework-level `captureError()` utility.
*
* The default Sentry plugin registers itself here when a DSN is configured.
* Keeping this registry Sentry-agnostic lets core runtime code report errors
* without importing a Node-only SDK in edge/client-adjacent modules.
*/
function registerErrorCaptureProvider(name, provider) {
	providers.set(name, provider);
	return () => {
		if (providers.get(name) === provider) providers.delete(name);
	};
}
/**
* Capture an error through every configured provider. No-ops when no provider
* is installed and never throws back into the application path.
*/
function captureError(error, context = {}) {
	let eventId;
	for (const provider of providers.values()) try {
		const result = provider(error, context);
		if (eventId === void 0 && typeof result === "string") eventId = result;
	} catch {}
	return eventId;
}
//#endregion
export { registerErrorCaptureProvider as n, captureError as t };
