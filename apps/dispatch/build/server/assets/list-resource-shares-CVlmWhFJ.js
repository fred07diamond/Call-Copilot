import { Rn as string, Tn as object } from "./schemas-DWUnC6a7.js";
import { r as eq } from "./conditions-BBjHIT-o.js";
import { t as defineAction } from "./action-Bo4eZeRf.js";
import { i as resolveAccess, o as requireShareableResource } from "./access-CZSYnBcR.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/sharing/actions/list-resource-shares.js
var list_resource_shares_default = defineAction({
	description: "List the current visibility and share grants on a shareable resource. Any read access is sufficient.",
	schema: object({
		resourceType: string(),
		resourceId: string()
	}),
	http: { method: "GET" },
	run: async (args) => {
		const reg = requireShareableResource(args.resourceType);
		const access = await resolveAccess(args.resourceType, args.resourceId);
		if (!access) return {
			ownerEmail: null,
			visibility: null,
			shares: []
		};
		const shares = await reg.getDb().select().from(reg.sharesTable).where(eq(reg.sharesTable.resourceId, args.resourceId));
		return {
			ownerEmail: access.resource.ownerEmail ?? null,
			orgId: access.resource.orgId ?? null,
			visibility: access.resource.visibility ?? "private",
			role: access.role,
			shares: shares.map((s) => ({
				id: s.id,
				principalType: s.principalType,
				principalId: s.principalId,
				role: s.role,
				createdAt: s.createdAt
			}))
		};
	}
});
//#endregion
export { list_resource_shares_default as default };
