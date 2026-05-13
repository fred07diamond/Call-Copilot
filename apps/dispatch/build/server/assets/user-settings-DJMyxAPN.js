import { a as putSetting, r as getSetting, t as deleteSetting } from "./store-BMQUS1KJ.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/settings/user-settings.js
/**
* User-scoped settings helpers.
*
* Wraps the global settings store with per-user key prefixing.
* Keys are stored as `u:<email>:<key>` in the settings table.
*
* No global fallback — each user starts with a clean slate. This
* prevents one user's private data from leaking to other users.
*/
function userKey(email, key) {
	return `u:${email}:${key}`;
}
/** Read a user-scoped setting. Returns null if not set for this user. */
async function getUserSetting(email, key) {
	return getSetting(userKey(email, key));
}
/** Write a user-scoped setting. Always writes to the prefixed key. */
async function putUserSetting(email, key, value, options) {
	return putSetting(userKey(email, key), value, options);
}
/** Delete a user-scoped setting. */
async function deleteUserSetting(email, key, options) {
	return deleteSetting(userKey(email, key), options);
}
//#endregion
export { getUserSetting as n, putUserSetting as r, deleteUserSetting as t };
