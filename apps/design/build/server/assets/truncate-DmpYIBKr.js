//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/shared/truncate.js
/**
* Truncate `s` to at most `max` characters, appending an ellipsis when a
* cut is made. Returns the original reference unchanged when no truncation
* is needed so identity-sensitive callers (React props, memo keys) don't
* see a new allocation on every call.
*/
function truncate(s, max) {
	if (s == null) return s;
	return s.length > max ? s.slice(0, max - 1) + "…" : s;
}
//#endregion
export { truncate as t };
