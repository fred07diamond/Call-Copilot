import { r as __exportAll } from "./chunk-D3zDcpJC.js";
import { EventEmitter } from "events";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/resources/emitter.js
var emitter_exports = /* @__PURE__ */ __exportAll({
	emitResourceChange: () => emitResourceChange,
	emitResourceDelete: () => emitResourceDelete,
	getResourcesEmitter: () => getResourcesEmitter
});
/**
* Singleton EventEmitter for resources DB changes.
* The SSE handler subscribes to this via extraEmitters.
*/
var _emitter = new EventEmitter();
function getResourcesEmitter() {
	return _emitter;
}
function emitResourceChange(id, path, owner, requestSource) {
	const event = {
		source: "resources",
		type: "change",
		id,
		path,
		owner,
		...requestSource && { requestSource }
	};
	_emitter.emit("resources", event);
}
function emitResourceDelete(id, path, owner, requestSource) {
	const event = {
		source: "resources",
		type: "delete",
		id,
		path,
		owner,
		...requestSource && { requestSource }
	};
	_emitter.emit("resources", event);
}
//#endregion
export { emitResourceDelete as n, emitter_exports as r, emitResourceChange as t };
