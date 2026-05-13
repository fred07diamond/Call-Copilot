import { r as getSession } from "./auth-B6XASyqO.js";
import { i as getDbExec } from "./client-BnpqLOqs.js";
import { r as getSetting } from "./store-BMQUS1KJ.js";
import { n as getUserSetting, r as putUserSetting } from "./user-settings-DJMyxAPN.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/org/context.js
var EMPTY_CONTEXT = {
	email: "",
	orgId: null,
	orgName: null,
	role: null
};
var nanoid = () => globalThis.crypto?.randomUUID?.().replace(/-/g, "") ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
/**
* Resolve the current user's organization context from their session.
*
* - For users in multiple orgs, honors their `active-org-id` user setting.
* - Falls back to the user's first membership.
* - When `AUTO_CREATE_DEFAULT_ORG` is set and the authenticated user has
*   zero memberships, provisions a default org named after the user
*   ({name}'s workspace, falling back to the email local-part). Opt-in
*   per deployment so templates that don't use orgs don't accrue phantom
*   default orgs in their DB. The <RequireActiveOrg> client guard remains
*   the safety net for pre-existing accounts or provisioning failures.
*/
async function getOrgContext(event) {
	const session = await getSession(event);
	const email = session?.email;
	if (!email) return EMPTY_CONTEXT;
	const exec = getDbExec();
	let memberships = [];
	try {
		const { rows } = await exec.execute({
			sql: `SELECT m.org_id AS "orgId", m.role AS role, o.name AS "orgName"
            FROM org_members m
            INNER JOIN organizations o ON m.org_id = o.id
            WHERE LOWER(m.email) = ?`,
			args: [email.toLowerCase()]
		});
		memberships = rows.map((r) => ({
			orgId: String(r.orgId ?? r.org_id),
			role: String(r.role),
			orgName: String(r.orgName ?? r.org_name)
		}));
	} catch {
		return {
			email,
			orgId: null,
			orgName: null,
			role: null
		};
	}
	if (memberships.length === 0 && process.env.AUTO_CREATE_DEFAULT_ORG) {
		const created = await tryCreateDefaultOrg(exec, email, session);
		if (created) return created;
	}
	if (memberships.length === 0) return {
		email,
		orgId: null,
		orgName: null,
		role: null
	};
	if (memberships.length > 1) {
		const activeOrgSetting = await getUserSetting(email, "active-org-id");
		if (activeOrgSetting?.orgId) {
			const active = memberships.find((m) => m.orgId === activeOrgSetting.orgId);
			if (active) return {
				email,
				orgId: active.orgId,
				orgName: active.orgName,
				role: active.role
			};
		}
	}
	return {
		email,
		orgId: memberships[0].orgId,
		orgName: memberships[0].orgName,
		role: memberships[0].role
	};
}
/**
* Resolve the active org ID for a given email — for non-HTTP contexts like
* the integration webhook handler where we have an email but no event/session.
* Picks the user's active-org-id setting if set, otherwise the first membership.
* Returns null if the user has no memberships.
*/
async function resolveOrgIdForEmail(email) {
	const exec = getDbExec();
	if (!exec) return null;
	try {
		const { rows } = await exec.execute({
			sql: `SELECT org_id FROM org_members WHERE LOWER(email) = ?`,
			args: [email.toLowerCase()]
		});
		if (rows.length === 0) return null;
		const ids = rows.map((r) => String(r.org_id));
		if (ids.length === 1) return ids[0];
		const activeOrgSetting = await getUserSetting(email, "active-org-id");
		if (activeOrgSetting?.orgId && ids.includes(activeOrgSetting.orgId)) return activeOrgSetting.orgId;
		return ids[0];
	} catch {
		return null;
	}
}
function defaultOrgName(email, session) {
	const full = session?.name?.trim();
	if (full) return `${full}'s workspace`;
	return `${(email.split("@")[0] ?? email).replace(/[._-]+/g, " ").trim().split(" ").filter(Boolean).map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(" ") || "My"}'s workspace`;
}
/**
* Check whether the user has a pending invitation. If so, auto-create
* MUST be skipped — otherwise we'd provision a personal org for them
* before they ever see the inviter's org in the RequireActiveOrg
* accept-invite pane, and they'd never join the team that invited them.
*/
async function hasPendingInvitation(exec, email) {
	try {
		const { rows } = await exec.execute({
			sql: `SELECT 1 FROM org_invitations WHERE LOWER(email) = ? AND status = 'pending' LIMIT 1`,
			args: [email.toLowerCase()]
		});
		return rows.length > 0;
	} catch {
		return true;
	}
}
async function hasDomainMatch(exec, email) {
	try {
		const domain = email.split("@")[1]?.toLowerCase();
		if (!domain) return false;
		const { rows } = await exec.execute({
			sql: `SELECT 1 FROM organizations WHERE LOWER(allowed_domain) = ? LIMIT 1`,
			args: [domain]
		});
		return rows.length > 0;
	} catch {
		return false;
	}
}
/** Stale-claim threshold. A claim row this old is treated as abandoned
*  (process crashed, DELETE failed, etc.) and a new caller may take it
*  over. Long enough that two genuine concurrent first-loads don't
*  trample each other (those settle in milliseconds), short enough that
*  a stuck user recovers on their next navigation. */
var CLAIM_TTL_MS = 300 * 1e3;
/**
* Attempt to provision a default org + owner membership for a user with
* zero memberships.
*
* Race protection: claims the user's auto-create slot via an atomic
* INSERT into the framework `settings` table (PRIMARY KEY (key) — so
* concurrent inserts for the same key throw uniqueness violations on
* both SQLite and Postgres). Only the request that wins the claim
* proceeds to create the org; losers bail. By the time a losing
* request retries on a subsequent navigation, the winner's org is in
* `org_members` and the auto-create branch is skipped entirely.
*
* Stuck-state recovery: a stale claim (held longer than CLAIM_TTL_MS)
* is reclaimed automatically. So even if the DELETE on the failure
* path fails (network blip, DB error), the user isn't stranded — the
* next request after the TTL elapses retries cleanly.
*
* Returns null on any failure so the caller can fall back to the
* empty-context / client-guard path.
*/
async function tryCreateDefaultOrg(exec, email, session) {
	await getSetting("__init").catch(() => null);
	const claimKey = `u:${email.toLowerCase()}:auto-create-claim`;
	if (!await acquireClaim(exec, claimKey)) return null;
	if (await hasPendingInvitation(exec, email)) {
		await releaseClaim(exec, claimKey);
		return null;
	}
	if (await hasDomainMatch(exec, email)) {
		await releaseClaim(exec, claimKey);
		return null;
	}
	try {
		const orgId = nanoid();
		const orgName = defaultOrgName(email, session);
		const now = Date.now();
		await exec.execute({
			sql: `INSERT INTO organizations (id, name, created_by, created_at) VALUES (?, ?, ?, ?)`,
			args: [
				orgId,
				orgName,
				email,
				now
			]
		});
		await exec.execute({
			sql: `INSERT INTO org_members (id, org_id, email, role, joined_at) VALUES (?, ?, ?, ?, ?)`,
			args: [
				nanoid(),
				orgId,
				email,
				"owner",
				now
			]
		});
		await putUserSetting(email, "active-org-id", { orgId });
		return {
			email,
			orgId,
			orgName,
			role: "owner"
		};
	} catch {
		await releaseClaim(exec, claimKey);
		return null;
	}
}
async function acquireClaim(exec, claimKey) {
	const now = Date.now();
	try {
		await exec.execute({
			sql: `INSERT INTO settings (key, value, updated_at) VALUES (?, ?, ?)`,
			args: [
				claimKey,
				JSON.stringify({ at: now }),
				now
			]
		});
		return true;
	} catch {
		const staleThreshold = now - CLAIM_TTL_MS;
		return ((await exec.execute({
			sql: `UPDATE settings SET value = ?, updated_at = ? WHERE key = ? AND updated_at <= ?`,
			args: [
				JSON.stringify({ at: now }),
				now,
				claimKey,
				staleThreshold
			]
		})).rowsAffected ?? 0) > 0;
	}
}
async function releaseClaim(exec, claimKey) {
	await exec.execute({
		sql: `DELETE FROM settings WHERE key = ?`,
		args: [claimKey]
	}).catch(() => {});
}
/**
* Look up the `allowed_domain` for an org by its ID.
* Used when making outbound A2A calls so the JWT includes the
* caller's org domain for cross-app org resolution.
*/
async function getOrgDomain(orgId) {
	try {
		const { rows } = await getDbExec().execute({
			sql: `SELECT allowed_domain FROM organizations WHERE id = ? LIMIT 1`,
			args: [orgId]
		});
		if (!rows[0]) return null;
		return String(rows[0].allowed_domain || "") || null;
	} catch {
		return null;
	}
}
/**
* Look up the org's A2A secret by org ID.
* Used when making outbound A2A calls so the JWT is signed with the
* org-specific secret rather than the global A2A_SECRET env var.
*/
async function getOrgA2ASecret(orgId) {
	try {
		const { rows } = await getDbExec().execute({
			sql: `SELECT a2a_secret FROM organizations WHERE id = ? LIMIT 1`,
			args: [orgId]
		});
		if (!rows[0]) return null;
		return String(rows[0].a2a_secret || "") || null;
	} catch {
		return null;
	}
}
/**
* Look up an org's A2A secret by its `allowed_domain`.
* Used on the A2A receiving side: the caller's JWT includes `org_domain`,
* and the receiver looks up which local org matches that domain to find
* the secret used to verify the JWT signature.
*/
async function getA2ASecretByDomain(domain) {
	try {
		const { rows } = await getDbExec().execute({
			sql: `SELECT a2a_secret FROM organizations WHERE LOWER(allowed_domain) = ? LIMIT 1`,
			args: [domain.toLowerCase()]
		});
		if (!rows[0]) return null;
		return String(rows[0].a2a_secret || "") || null;
	} catch {
		return null;
	}
}
/**
* Resolve a local org by its `allowed_domain`.
* Used on the A2A receiving side: the caller sends `org_domain` in the JWT,
* and the receiver looks up which local org matches that domain.
*/
async function resolveOrgByDomain(domain) {
	try {
		const { rows } = await getDbExec().execute({
			sql: `SELECT id, name FROM organizations WHERE LOWER(allowed_domain) = ? LIMIT 1`,
			args: [domain.toLowerCase()]
		});
		if (!rows[0]) return null;
		return {
			orgId: String(rows[0].id),
			orgName: String(rows[0].name)
		};
	} catch {
		return null;
	}
}
//#endregion
export { resolveOrgByDomain as a, getOrgDomain as i, getOrgA2ASecret as n, resolveOrgIdForEmail as o, getOrgContext as r, getA2ASecretByDomain as t };
