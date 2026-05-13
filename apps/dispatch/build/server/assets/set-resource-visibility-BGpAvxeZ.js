import { Rn as string, Tn as object, yt as _enum } from "./schemas-DWUnC6a7.js";
import { r as eq } from "./conditions-BBjHIT-o.js";
import { t as defineAction } from "./action-Bo4eZeRf.js";
import { o as requireShareableResource, r as assertAccess } from "./access-CZSYnBcR.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/sharing/actions/set-resource-visibility.js
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
