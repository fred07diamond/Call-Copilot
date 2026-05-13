import { b as setResponseStatus, c as getMethod, i as defineEventHandler } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-CmxO0LxM.js";
import { r as getSession } from "./auth-CvO2kpTD.js";
import { l as runWithRequestContext } from "./request-context-Ci6C_Mch.js";
import { o as recordChange } from "./poll-dJyKUlJH.js";
import { r as getOrgContext } from "./context-DeNWRFE0.js";
import { addExtensionSlotTarget, installExtensionSlot, listExtensionsForSlot, listSlotInstallsForUser, listSlotsForExtension, removeExtensionSlotTarget, uninstallExtensionSlot } from "./store-DY_iEKRW.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/slots/routes.js
/**
* HTTP handler for extension extension-point slots.
*
* Mounted at `/_agent-native/slots`. Routes:
*
*   GET    /:slotId/installs    — current user's installed widgets for a slot
*   GET    /:slotId/available   — extensions that declare this slot, scoped to user access
*   POST   /:slotId/install     — install a extension into a slot (body: { extensionId, position?, config? })
*   DELETE /:slotId/install/:extensionId — uninstall
*   GET    /extension/:extensionId        — list slot declarations for a specific extension
*   POST   /extension/:extensionId        — declare a slot target (body: { slotId, config? })
*   DELETE /extension/:extensionId/:slotId — remove a slot declaration
*/
function createSlotsHandler() {
	return defineEventHandler(async (event) => {
		const method = getMethod(event);
		const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
		const parts = pathname ? pathname.split("/") : [];
		const session = await getSession(event).catch(() => null);
		if (!session?.email) {
			setResponseStatus(event, 401);
			return { error: "Authentication required" };
		}
		const orgCtx = await getOrgContext(event).catch(() => null);
		const userEmail = session.email;
		return runWithRequestContext({
			userEmail,
			orgId: orgCtx?.orgId ?? void 0
		}, () => dispatch(event, method, parts));
	});
}
async function dispatch(event, method, parts) {
	if (method === "GET" && parts.length === 2 && parts[0] === "extension") return listSlotsForExtension(parts[1]);
	if (method === "POST" && parts.length === 2 && parts[0] === "extension") {
		const body = await readBody(event);
		const slotId = String(body?.slotId ?? "").trim();
		if (!slotId) {
			setResponseStatus(event, 400);
			return { error: "slotId is required" };
		}
		const row = await addExtensionSlotTarget(parts[1], slotId, body?.config);
		recordChange({
			source: "action",
			type: "change"
		});
		return row;
	}
	if (method === "DELETE" && parts.length === 3 && parts[0] === "extension") {
		await removeExtensionSlotTarget(parts[1], parts[2]);
		recordChange({
			source: "action",
			type: "change"
		});
		return { ok: true };
	}
	if (method === "GET" && parts.length === 2 && parts[1] === "installs") return listSlotInstallsForUser(parts[0]);
	if (method === "GET" && parts.length === 2 && parts[1] === "available") return listExtensionsForSlot(parts[0]);
	if (method === "POST" && parts.length === 2 && parts[1] === "install") {
		const body = await readBody(event);
		const extensionId = String(body?.extensionId ?? "").trim();
		if (!extensionId) {
			setResponseStatus(event, 400);
			return { error: "extensionId is required" };
		}
		const row = await installExtensionSlot(extensionId, parts[0], {
			position: body?.position,
			config: body?.config
		});
		recordChange({
			source: "action",
			type: "change"
		});
		return row;
	}
	if (method === "DELETE" && parts.length === 3 && parts[1] === "install") {
		await uninstallExtensionSlot(parts[2], parts[0]);
		recordChange({
			source: "action",
			type: "change"
		});
		return { ok: true };
	}
	setResponseStatus(event, 404);
	return { error: "Not found" };
}
//#endregion
export { createSlotsHandler };
