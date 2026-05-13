import { i as getRequestOrgId, o as getRequestUserEmail } from "./request-context-BQ-cTIMw.js";
import { a as signA2AToken } from "./client-DoIFGiWA.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/a2a/caller-auth.js
var DEFAULT_A2A_CALLER_TOKEN_TTL = "30m";
async function resolveA2ACallerAuth(options) {
	const userEmail = getRequestUserEmail();
	const metadata = {};
	if (userEmail) metadata.userEmail = userEmail;
	let orgDomain;
	let orgSecret;
	const orgId = getRequestOrgId();
	if (orgId) {
		try {
			const { getOrgDomain } = await import("./context-BMW-f2V6.js");
			orgDomain = await getOrgDomain(orgId) ?? void 0;
			if (orgDomain) metadata.orgDomain = orgDomain;
		} catch {}
		try {
			const { getOrgA2ASecret } = await import("./context-BMW-f2V6.js");
			orgSecret = await getOrgA2ASecret(orgId) ?? void 0;
		} catch {}
	}
	let apiKey;
	if (userEmail && (orgSecret || process.env.A2A_SECRET)) try {
		apiKey = await signA2AToken(userEmail, orgDomain, orgSecret, {
			expiresIn: options?.expiresIn ?? DEFAULT_A2A_CALLER_TOKEN_TTL,
			preferGlobalSecret: !orgSecret
		});
	} catch {}
	if (options?.includeGoogleToken) await attachGoogleTokenMetadata(metadata, userEmail);
	return {
		apiKey,
		userEmail,
		orgDomain,
		orgSecret,
		metadata
	};
}
async function attachGoogleTokenMetadata(metadata, userEmail) {
	if (process.env.NODE_ENV !== "production" || !userEmail) return;
	try {
		const { listOAuthAccountsByOwner } = await import("./store-DFIQjDM8.js");
		const tokens = (await listOAuthAccountsByOwner("google", userEmail))[0]?.tokens;
		if (tokens?.access_token) metadata.googleToken = tokens.access_token;
	} catch {}
}
//#endregion
export { resolveA2ACallerAuth };
