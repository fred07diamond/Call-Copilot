import { At as boolean, Rn as string, Tn as object, yt as _enum } from "./schemas-DWUnC6a7.js";
import { i as renderEmail, o as isEmailConfigured, r as emailStrong, s as sendEmail, t as getAppProductionUrl } from "./app-url-Dc-f-V03.js";
import { r as eq, t as and } from "./conditions-BBjHIT-o.js";
import { o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
import { t as defineAction } from "./action-BOsFWutU.js";
import { o as requireShareableResource, r as assertAccess, t as ForbiddenError } from "./access-CcISFufT.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/sharing/actions/share-resource.js
function isSyntheticQaEmail(email) {
	const trimmed = email.trim().toLowerCase();
	const at = trimmed.lastIndexOf("@");
	if (at <= 0) return false;
	const local = trimmed.slice(0, at);
	const domain = trimmed.slice(at + 1);
	return local.includes("+qa") && (domain === "example.test" || domain.endsWith(".test") || domain === "example.invalid" || domain.endsWith(".invalid"));
}
function appPath(path) {
	if (!path.startsWith("/")) return path;
	const base = (process.env.VITE_APP_BASE_PATH || process.env.APP_BASE_PATH || "").trim().replace(/^\/+/, "").replace(/\/+$/, "");
	if (!base) return path;
	const normalizedBase = `/${base}`;
	if (path === normalizedBase || path.startsWith(`${normalizedBase}/`)) return path;
	return `${normalizedBase}${path}`;
}
function safeNotificationUrl(value, appUrl) {
	const trimmed = value.trim();
	if (!trimmed) return null;
	try {
		const base = new URL(appUrl);
		if (trimmed.startsWith("/")) {
			const path = appPath(trimmed);
			const basePath = base.pathname.replace(/\/+$/, "");
			const joined = basePath && basePath !== "/" && path.startsWith(`${basePath}/`) ? `${base.origin}${path}` : `${appUrl.replace(/\/+$/, "")}${path}`;
			return new URL(joined).toString();
		}
		const url = new URL(trimmed);
		if (!["http:", "https:"].includes(url.protocol)) return null;
		if (url.origin !== base.origin) return null;
		return url.toString();
	} catch {
		return null;
	}
}
function resolveShareNotificationUrl(explicitUrl, fallbackPath, appUrl = getAppProductionUrl()) {
	for (const candidate of [explicitUrl, fallbackPath]) {
		if (!candidate) continue;
		const url = safeNotificationUrl(candidate, appUrl);
		if (url) return url;
	}
	return appUrl;
}
function nanoid(size = 12) {
	const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	let id = "";
	const bytes = crypto.getRandomValues(new Uint8Array(size));
	for (const byte of bytes) id += chars[byte % 62];
	return id;
}
var share_resource_default = defineAction({
	description: "Grant a user or org access to a shareable resource. Owner or admin role required.",
	toolCallable: false,
	schema: object({
		resourceType: string().describe("Registered resource type, e.g. 'document', 'form'."),
		resourceId: string().describe("Id of the resource to share."),
		principalType: _enum(["user", "org"]).describe("'user' for an individual, 'org' for a whole organization."),
		principalId: string().describe("Email (user) or org id (org) of the principal."),
		role: _enum([
			"viewer",
			"editor",
			"admin"
		]).default("viewer").describe("Role to grant."),
		notify: boolean().default(true).describe("Whether to email the user about a new individual share. Defaults to true."),
		resourceUrl: string().optional().describe("Optional app-relative or same-origin URL recipients should open. External origins are ignored.")
	}),
	run: async (args) => {
		const reg = requireShareableResource(args.resourceType);
		await assertAccess(args.resourceType, args.resourceId, "admin");
		const actor = getRequestUserEmail();
		if (!actor) throw new ForbiddenError("Not signed in");
		const db = reg.getDb();
		const [existing] = await db.select().from(reg.sharesTable).where(and(eq(reg.sharesTable.resourceId, args.resourceId), eq(reg.sharesTable.principalType, args.principalType), eq(reg.sharesTable.principalId, args.principalId)));
		if (existing) {
			await db.update(reg.sharesTable).set({ role: args.role }).where(eq(reg.sharesTable.id, existing.id));
			return {
				id: existing.id,
				updated: true
			};
		}
		const id = nanoid();
		await db.insert(reg.sharesTable).values({
			id,
			resourceId: args.resourceId,
			principalType: args.principalType,
			principalId: args.principalId,
			role: args.role,
			createdBy: actor,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		});
		if (args.notify !== false && args.principalType === "user" && isEmailConfigured() && !isSyntheticQaEmail(args.principalId)) try {
			const titleCol = reg.titleColumn ?? "title";
			const [resource] = await db.select().from(reg.resourceTable).where(eq(reg.resourceTable.id, args.resourceId));
			const resourceTitle = resource?.[titleCol] ?? args.resourceType;
			const appUrl = getAppProductionUrl();
			const resourcePath = resource && reg.getResourcePath ? reg.getResourcePath(resource) : void 0;
			const notificationUrl = resolveShareNotificationUrl(args.resourceUrl, resourcePath, appUrl);
			const subject = `${actor} shared "${resourceTitle}" with you on ${process.env.APP_NAME || process.env.VITE_APP_NAME || "Agent Native"}`;
			const { html, text } = renderEmail({
				preheader: subject,
				heading: "You've been given access",
				paragraphs: [`${emailStrong(actor)} has shared the ${reg.displayName} ${emailStrong(resourceTitle)} with you as a ${emailStrong(args.role)}.`, `Use the button below to open it. If prompted, sign in with ${emailStrong(args.principalId)}.`],
				cta: {
					label: `Open ${reg.displayName}`,
					url: notificationUrl
				},
				footer: `You received this because ${actor} granted you ${args.role} access.`
			});
			await sendEmail({
				to: args.principalId,
				subject,
				html,
				text
			});
		} catch (err) {
			console.error("[share-resource] failed to send share notification:", err);
		}
		return {
			id,
			updated: false
		};
	}
});
//#endregion
export { share_resource_default as default, isSyntheticQaEmail, resolveShareNotificationUrl };
