import { a as resourceGet, c as resourceListAccessible, o as resourceGetByPath, t as SHARED_OWNER } from "./store--irHLonY.js";
import { l as parseCustomAgentProfile } from "./metadata-CqP8m5xN.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/resources/agents.js
async function listAccessibleCustomAgents(owner) {
	const resources = await resourceListAccessible(owner, "agents/");
	return (await Promise.all(resources.filter((resource) => resource.path.endsWith(".md")).map(async (resource) => {
		const full = await resourceGet(resource.id);
		if (!full) return null;
		return parseCustomAgentProfile(full.content, resource.path);
	}))).filter((profile) => !!profile);
}
async function findAccessibleCustomAgent(owner, identifier) {
	const trimmed = identifier.trim();
	if (!trimmed) return null;
	const byPathCandidates = [
		trimmed,
		trimmed.endsWith(".md") ? trimmed : `agents/${trimmed}.md`,
		trimmed.startsWith("agents/") ? trimmed : `agents/${trimmed}`
	];
	for (const path of byPathCandidates) {
		const personal = await resourceGetByPath(owner, path);
		if (personal) {
			const profile = parseCustomAgentProfile(personal.content, personal.path);
			if (profile) return profile;
		}
		const shared = await resourceGetByPath(SHARED_OWNER, path);
		if (shared) {
			const profile = parseCustomAgentProfile(shared.content, shared.path);
			if (profile) return profile;
		}
	}
	const lower = trimmed.toLowerCase();
	return (await listAccessibleCustomAgents(owner)).find((agent) => agent.id.toLowerCase() === lower || agent.name.toLowerCase() === lower || agent.path.toLowerCase() === lower) ?? null;
}
//#endregion
export { findAccessibleCustomAgent, listAccessibleCustomAgents };
