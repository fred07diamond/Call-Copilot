import { m as readBody$1 } from "./node-DxyfkX8_.js";
import "node:stream";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/h3-helpers.js
/**
* Small helpers around h3 v2 that polish ergonomics for templates.
*
* `readBody` — wraps h3's `readBody` so the result is typed `any` by default
* (h3 v2 infers `unknown`, which forces `as` casts at every call site).
*
* `streamFile` — converts a Node `ReadStream` to a web `ReadableStream` so
* route handlers can return file content without importing `node:stream`
* inline. h3 v2 expects web streams everywhere.
*/
/**
* Parse a JSON request body. Returns `{}` if the body is empty or absent
* so callers don't have to null-check before destructuring.
*
* Defaults T to `any` for ergonomic field access. Pass an explicit type
* argument when you want a typed result:
*
*   const { email, password } = await readBody<LoginRequest>(event);
*/
async function readBody(event) {
	return await readBody$1(event) ?? {};
}
//#endregion
export { readBody as t };
