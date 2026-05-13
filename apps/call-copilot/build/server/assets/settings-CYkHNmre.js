import { b as setResponseStatus, i as defineEventHandler, p as getRouterParam, s as getHeader } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-Ccy2ZQ_2.js";
import { a as putSetting, r as getSetting, t as deleteSetting } from "./store-Cfa2yBtr.js";
import "./user-settings-DsisKP7R.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/settings/org-settings.js
/**
* Org-scoped settings helpers.
*
* Wraps the global settings store with per-org key prefixing.
* Keys are stored as `o:<orgId>:<key>` in the settings table.
*
* No global fallback — each org starts with a clean slate. This
* prevents one org's data from leaking to another.
*/
function orgKey(orgId, key) {
	return `o:${orgId}:${key}`;
}
/** Read an org-scoped setting. Returns null if not set for this org. */
async function getOrgSetting(orgId, key) {
	return getSetting(orgKey(orgId, key));
}
/** Write an org-scoped setting. Always writes to the prefixed key. */
async function putOrgSetting(orgId, key, value, options) {
	return putSetting(orgKey(orgId, key), value, options);
}
/** Delete an org-scoped setting. */
async function deleteOrgSetting(orgId, key, options) {
	return deleteSetting(orgKey(orgId, key), options);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/settings/handlers.js
function safeKey(key) {
	return key.replace(/[^a-zA-Z0-9_-]/g, "");
}
defineEventHandler(async (event) => {
	const key = safeKey(String(getRouterParam(event, "key")));
	const value = await getSetting(key);
	if (!value) {
		setResponseStatus(event, 404);
		return { error: `No setting for ${key}` };
	}
	return value;
});
defineEventHandler(async (event) => {
	const key = safeKey(String(getRouterParam(event, "key")));
	const body = await readBody(event);
	await putSetting(key, body, { requestSource: getHeader(event, "x-request-source") || void 0 });
	return body;
});
defineEventHandler(async (event) => {
	await deleteSetting(safeKey(String(getRouterParam(event, "key"))), { requestSource: getHeader(event, "x-request-source") || void 0 });
	return { ok: true };
});
//#endregion
export { getOrgSetting as n, putOrgSetting as r, deleteOrgSetting as t };
