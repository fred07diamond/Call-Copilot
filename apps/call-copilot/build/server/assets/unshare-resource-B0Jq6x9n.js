import { Rn as string, Tn as object, yt as _enum } from "./schemas-DWUnC6a7.js";
import { r as eq, t as and } from "./conditions-BBjHIT-o.js";
import { t as defineAction } from "./action-BOsFWutU.js";
import { o as requireShareableResource, r as assertAccess } from "./access-CcISFufT.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/sharing/actions/unshare-resource.js
var unshare_resource_default = defineAction({
	description: "Revoke a previously granted share. Owner or admin role required.",
	toolCallable: false,
	schema: object({
		resourceType: string(),
		resourceId: string(),
		principalType: _enum(["user", "org"]),
		principalId: string()
	}),
	run: async (args) => {
		const reg = requireShareableResource(args.resourceType);
		await assertAccess(args.resourceType, args.resourceId, "admin");
		await reg.getDb().delete(reg.sharesTable).where(and(eq(reg.sharesTable.resourceId, args.resourceId), eq(reg.sharesTable.principalType, args.principalType), eq(reg.sharesTable.principalId, args.principalId)));
		return { ok: true };
	}
});
//#endregion
export { unshare_resource_default as default };
