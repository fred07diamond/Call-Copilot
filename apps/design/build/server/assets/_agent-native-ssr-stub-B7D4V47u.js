//#region \0agent-native-ssr-stub
var handler = { get(_, p) {
	if (p === Symbol.toPrimitive) return () => "";
	if (p === "then") return void 0;
	return new Proxy(() => {}, handler);
} };
var stub = new Proxy(() => {}, handler);
//#endregion
export { stub as default };
