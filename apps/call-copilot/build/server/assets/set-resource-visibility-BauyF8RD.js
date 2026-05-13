import { Rn as string, Tn as object, yt as _enum } from "./schemas-DWUnC6a7.js";
import { r as eq } from "./conditions-BBjHIT-o.js";
import { t as defineAction } from "./action-BOsFWutU.js";
import { o as requireShareableResource, r as assertAccess } from "./access-CcISFufT.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/sharing/actions/set-resource-visibility.js
var set_resource_visibility_default = defineAction({
	description: "Change the coarse visibility of a shareable resource: 'private' | 'org' | 'public'. Owner or admin role required.",
	toolCallable: false,
	schema: object({
		resourceType: string(),
		resourceId: string(),
		visibility: _enum([
			"private",
			"org",
			"public"
		])
	}),
	run: async (args) => {
		const reg = requireShareableResource(args.resourceType);
		await assertAccess(args.resourceType, args.resourceId, "admin");
		await reg.getDb().update(reg.resourceTable).set({ visibility: args.visibility }).where(eq(reg.resourceTable.id, args.resourceId));
		return {
			ok: true,
			visibility: args.visibility
		};
	}
});
//#endregion
export { set_resource_visibility_default as default };
