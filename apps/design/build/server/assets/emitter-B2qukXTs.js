import { EventEmitter } from "events";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/application-state/emitter.js
/**
* Singleton EventEmitter for application-state DB changes.
* The SSE handler subscribes to this via extraEmitters.
*/
var _emitter = new EventEmitter();
function getAppStateEmitter() {
	return _emitter;
}
function emitAppStateChange(key, requestSource, owner) {
	const event = {
		source: "app-state",
		type: "change",
		key,
		...owner && { owner },
		...requestSource && { requestSource }
	};
	_emitter.emit("app-state", event);
}
function emitAppStateDelete(key, requestSource, owner) {
	const event = {
		source: "app-state",
		type: "delete",
		key,
		...owner && { owner },
		...requestSource && { requestSource }
	};
	_emitter.emit("app-state", event);
}
//#endregion
export { emitAppStateDelete as n, getAppStateEmitter as r, emitAppStateChange as t };
