import { b as setResponseStatus, c as getMethod, f as getRequestURL, i as defineEventHandler, n as createError, p as getRouterParam } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-Ccy2ZQ_2.js";
import { r as getSession, w as renderInviteEmail } from "./auth-CFPsfhIY.js";
import { i as getDbExec } from "./client-BpA2t7pN.js";
import { o as isEmailConfigured, s as sendEmail, t as getAppProductionUrl } from "./app-url-Dc-f-V03.js";
import { r as putUserSetting } from "./user-settings-DsisKP7R.js";
import { a as markDefaultPluginProvided, i as getH3App, n as awaitBootstrap, t as FRAMEWORK_PREFIX } from "./framework-request-handler-DiyxDN2M.js";
import { n as runMigrations } from "./migrations-BqB5fcVL.js";
import { r as getOrgContext } from "./context-B8kKxauG.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/org/migrations.js
/**
* Migration definitions for the org module. Versions are namespaced into a high
* range (1000+) so they don't collide with template-owned migrations sharing
* the same `_migrations` table.
*/
var ORG_MIGRATIONS = [
	{
		version: 1001,
		sql: `CREATE TABLE IF NOT EXISTS organizations (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      created_by TEXT NOT NULL,
      created_at INTEGER NOT NULL
    )`
	},
	{
		version: 1002,
		sql: `CREATE TABLE IF NOT EXISTS org_members (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      email TEXT NOT NULL,
      role TEXT NOT NULL,
      joined_at INTEGER NOT NULL,
      UNIQUE(org_id, email)
    )`
	},
	{
		version: 1003,
		sql: `CREATE TABLE IF NOT EXISTS org_invitations (
      id TEXT PRIMARY KEY,
      org_id TEXT NOT NULL,
      email TEXT NOT NULL,
      invited_by TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      status TEXT NOT NULL
    )`
	},
	{
		version: 1004,
		sql: `ALTER TABLE organizations ADD COLUMN IF NOT EXISTS allowed_domain TEXT`
	},
	{
		version: 1005,
		sql: `ALTER TABLE organizations ADD COLUMN IF NOT EXISTS a2a_secret TEXT`
	},
	{
		version: 1006,
		sql: `ALTER TABLE org_invitations ADD COLUMN IF NOT EXISTS role TEXT`
	}
];
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/org/free-email-providers.js
/**
* Free / public mailbox providers that should NOT be allowed as an
* organization's auto-join domain.
*
* Why: the auto-join feature lets anyone who signs up with an email at the
* org's `allowed_domain` join the org without an invitation. That is safe
* for company-owned domains (`acme.com`) — the company controls who gets
* an `@acme.com` address. It is catastrophic for shared mailbox providers
* (`gmail.com`, `outlook.com`, etc.) — anyone in the world can create a
* matching address and would be auto-added to the org.
*
* The list intentionally errs on the side of well-known providers; if a
* future provider isn't here we'll learn from a bug report rather than
* pretend we have an exhaustive registry.
*/
var FREE_EMAIL_PROVIDER_DOMAINS = new Set([
	"gmail.com",
	"googlemail.com",
	"outlook.com",
	"hotmail.com",
	"live.com",
	"msn.com",
	"outlook.co.uk",
	"hotmail.co.uk",
	"live.co.uk",
	"outlook.de",
	"hotmail.de",
	"live.de",
	"outlook.fr",
	"hotmail.fr",
	"live.fr",
	"yahoo.com",
	"yahoo.co.uk",
	"yahoo.co.jp",
	"yahoo.fr",
	"yahoo.de",
	"yahoo.it",
	"yahoo.es",
	"yahoo.ca",
	"yahoo.com.au",
	"yahoo.com.br",
	"ymail.com",
	"rocketmail.com",
	"icloud.com",
	"me.com",
	"mac.com",
	"aol.com",
	"aim.com",
	"proton.me",
	"protonmail.com",
	"pm.me",
	"tutanota.com",
	"tutanota.de",
	"tuta.io",
	"fastmail.com",
	"fastmail.fm",
	"duck.com",
	"hey.com",
	"yandex.com",
	"yandex.ru",
	"mail.ru",
	"list.ru",
	"bk.ru",
	"inbox.ru",
	"qq.com",
	"163.com",
	"126.com",
	"sina.com",
	"sina.cn",
	"sohu.com",
	"gmx.com",
	"gmx.de",
	"gmx.net",
	"web.de",
	"t-online.de",
	"freenet.de",
	"zoho.com",
	"zohomail.com",
	"rediffmail.com",
	"mail.com",
	"att.net",
	"comcast.net",
	"verizon.net",
	"sbcglobal.net",
	"bellsouth.net",
	"cox.net",
	"earthlink.net",
	"btinternet.com",
	"btopenworld.com",
	"talktalk.net",
	"sky.com",
	"ntlworld.com",
	"virginmedia.com",
	"free.fr",
	"orange.fr",
	"wanadoo.fr",
	"laposte.net",
	"libero.it",
	"tiscali.it",
	"uol.com.br",
	"bol.com.br",
	"terra.com.br",
	"mailinator.com",
	"guerrillamail.com",
	"10minutemail.com",
	"trashmail.com",
	"yopmail.com",
	"tempmail.com",
	"throwawaymail.com",
	"sharklasers.com"
]);
function isFreeEmailProvider(domain) {
	return FREE_EMAIL_PROVIDER_DOMAINS.has(domain.trim().toLowerCase());
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/org/handlers.js
/**
* Extract the :id from invitation-accept paths. The framework request handler
* strips the mount prefix before calling the handler, so `event.url.pathname`
* is the relative tail — e.g. `/some-id/accept`. Falls back to matching the
* full path for contexts that don't strip, and to the h3 router param.
*/
function extractInvitationId(event) {
	const fromRouter = getRouterParam(event, "id");
	if (fromRouter) return fromRouter;
	const path = getRequestURL(event).pathname;
	const match = path.match(/^\/([^\/]+)\/accept\/?$/) ?? path.match(/\/org\/invitations\/([^\/]+)\/accept\/?$/);
	return match?.[1] ? decodeURIComponent(match[1]) : void 0;
}
/** Extract the :email from member-delete and member-role paths. Same prefix-stripping caveat. */
function extractMemberEmail(event) {
	const fromRouter = getRouterParam(event, "email");
	if (fromRouter) return fromRouter;
	const path = getRequestURL(event).pathname;
	const match = path.match(/^\/([^\/]+)\/role\/?$/) ?? path.match(/^\/([^\/]+)\/?$/) ?? path.match(/\/org\/members\/([^\/]+)(?:\/role)?\/?$/);
	return match?.[1] ? decodeURIComponent(match[1]) : void 0;
}
var nanoid = () => globalThis.crypto?.randomUUID?.().replace(/-/g, "") ?? Math.random().toString(36).slice(2) + Date.now().toString(36);
function getInviteAppUrl(event) {
	return getAppProductionUrl(event);
}
async function exec() {
	return getDbExec();
}
function requireAuthEmail(session) {
	const email = session?.email;
	if (!email) throw createError({
		statusCode: 401,
		message: "Authentication required"
	});
	return email;
}
/** GET /_agent-native/org/me — current user's active org, all orgs, pending invitations */
var getMyOrgHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	const e = await exec();
	const orgs = (await e.execute({
		sql: `SELECT m.org_id AS "orgId", m.role AS role, o.name AS "orgName"
          FROM org_members m
          INNER JOIN organizations o ON m.org_id = o.id
          WHERE LOWER(m.email) = ?`,
		args: [ctx.email.toLowerCase()]
	})).rows.map((r) => ({
		orgId: String(r.orgId ?? r.org_id),
		role: String(r.role),
		orgName: String(r.orgName ?? r.org_name)
	}));
	let domainMatches = [];
	const domain = ctx.email.split("@")[1]?.toLowerCase();
	if (domain) try {
		domainMatches = (await e.execute({
			sql: `SELECT o.id, o.name
              FROM organizations o
              WHERE LOWER(o.allowed_domain) = ?
                AND NOT EXISTS (
                  SELECT 1
                  FROM org_members m
                  WHERE m.org_id = o.id
                    AND LOWER(m.email) = ?
                )`,
			args: [domain, ctx.email.toLowerCase()]
		})).rows.map((r) => ({
			orgId: String(r.id),
			orgName: String(r.name)
		}));
	} catch {}
	let allowedDomain = null;
	let a2aSecret = null;
	if (ctx.orgId) try {
		const adRes = await e.execute({
			sql: `SELECT allowed_domain, a2a_secret FROM organizations WHERE id = ? LIMIT 1`,
			args: [ctx.orgId]
		});
		if (adRes.rows[0]) {
			allowedDomain = String(adRes.rows[0].allowed_domain ?? "") || null;
			a2aSecret = String(adRes.rows[0].a2a_secret ?? "") || null;
		}
	} catch {}
	const isOwnerOrAdmin = ctx.role === "owner" || ctx.role === "admin";
	const pendingInvitations = (await e.execute({
		sql: `SELECT i.id AS id, i.org_id AS "orgId", o.name AS "orgName", i.invited_by AS "invitedBy"
          FROM org_invitations i
          INNER JOIN organizations o ON i.org_id = o.id
          WHERE LOWER(i.email) = ? AND i.status = 'pending'`,
		args: [ctx.email.toLowerCase()]
	})).rows.map((r) => ({
		id: String(r.id),
		orgId: String(r.orgId ?? r.org_id),
		orgName: String(r.orgName ?? r.org_name),
		invitedBy: String(r.invitedBy ?? r.invited_by)
	}));
	return {
		email: ctx.email,
		orgId: ctx.orgId,
		orgName: ctx.orgName,
		role: ctx.role,
		orgs,
		pendingInvitations,
		domainMatches,
		allowedDomain,
		a2aSecret: isOwnerOrAdmin ? a2aSecret : void 0
	};
});
/** POST /_agent-native/org — create a new organization */
var createOrgHandler = defineEventHandler(async (event) => {
	const email = requireAuthEmail(await getSession(event));
	const name = (await readBody(event))?.name?.trim();
	if (!name) throw createError({
		statusCode: 400,
		message: "Organization name is required"
	});
	const orgId = nanoid();
	const now = Date.now();
	const e = await exec();
	const { randomBytes } = await import("node:crypto");
	const a2aSecret = randomBytes(32).toString("base64url");
	await e.execute({
		sql: `INSERT INTO organizations (id, name, created_by, created_at, a2a_secret) VALUES (?, ?, ?, ?, ?)`,
		args: [
			orgId,
			name,
			email,
			now,
			a2aSecret
		]
	});
	await e.execute({
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
		id: orgId,
		name,
		role: "owner"
	};
});
/** GET /_agent-native/org/members — list org members */
var listMembersHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) return { members: [] };
	const { rows } = await (await exec()).execute({
		sql: `SELECT email, role, joined_at AS "joinedAt" FROM org_members WHERE org_id = ?`,
		args: [ctx.orgId]
	});
	return { members: rows.map((r) => ({
		email: String(r.email),
		role: String(r.role),
		joinedAt: Number(r.joinedAt ?? r.joined_at)
	})) };
});
function normalizeInviteRole(input) {
	return input === "admin" ? "admin" : "member";
}
async function inviteOne(ctx, rawEmail, role, event) {
	const email = rawEmail.trim().toLowerCase();
	if (!email) throw createError({
		statusCode: 400,
		message: "Email is required"
	});
	if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw createError({
		statusCode: 400,
		message: `Invalid email: ${rawEmail}`
	});
	const e = await exec();
	if ((await e.execute({
		sql: `SELECT 1 FROM org_members WHERE org_id = ? AND LOWER(email) = ? LIMIT 1`,
		args: [ctx.orgId, email]
	})).rows.length > 0) throw createError({
		statusCode: 409,
		message: `${email} is already a member`
	});
	if ((await e.execute({
		sql: `SELECT 1 FROM org_invitations WHERE org_id = ? AND LOWER(email) = ? AND status = 'pending' LIMIT 1`,
		args: [ctx.orgId, email]
	})).rows.length > 0) throw createError({
		statusCode: 409,
		message: `An invitation is already pending for ${email}`
	});
	const id = nanoid();
	await e.execute({
		sql: `INSERT INTO org_invitations (id, org_id, email, invited_by, created_at, status, role) VALUES (?, ?, ?, ?, ?, 'pending', ?)`,
		args: [
			id,
			ctx.orgId,
			email,
			ctx.email,
			Date.now(),
			role
		]
	});
	let emailSent = false;
	let emailError;
	if (isEmailConfigured()) try {
		const { subject, html, text } = renderInviteEmail({
			invitee: email,
			orgName: ctx.orgName || "your team",
			acceptUrl: getInviteAppUrl(event),
			inviter: ctx.email
		});
		await sendEmail({
			to: email,
			subject,
			html,
			text
		});
		emailSent = true;
	} catch (err) {
		emailError = err instanceof Error ? err.message : String(err);
		console.error("[org/invitations] failed to send invite email", err);
	}
	return {
		id,
		email,
		role,
		status: "pending",
		emailSent,
		emailError
	};
}
/** POST /_agent-native/org/invitations — invite one or many users by email */
var createInvitationHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) throw createError({
		statusCode: 400,
		message: "You must belong to an organization to invite members"
	});
	if (ctx.role !== "owner" && ctx.role !== "admin") throw createError({
		statusCode: 403,
		message: "Only owners and admins can invite members"
	});
	const body = await readBody(event);
	const invitesInput = Array.isArray(body?.invites) ? body.invites.map((inv) => ({
		email: String(inv?.email ?? ""),
		role: inv?.role
	})) : null;
	if (invitesInput) {
		const succeeded = [];
		const failed = [];
		const seen = /* @__PURE__ */ new Set();
		for (const inv of invitesInput) {
			const lower = inv.email.trim().toLowerCase();
			if (!lower) continue;
			if (seen.has(lower)) continue;
			seen.add(lower);
			try {
				const result = await inviteOne({
					orgId: ctx.orgId,
					orgName: ctx.orgName,
					email: ctx.email
				}, inv.email, normalizeInviteRole(inv.role), event);
				succeeded.push(result);
			} catch (err) {
				const message = err instanceof Error ? err.message : String(err);
				failed.push({
					email: lower,
					error: message
				});
			}
		}
		return {
			succeeded,
			failed,
			total: succeeded.length + failed.length
		};
	}
	const role = normalizeInviteRole(body?.role);
	return await inviteOne({
		orgId: ctx.orgId,
		orgName: ctx.orgName,
		email: ctx.email
	}, body?.email ?? "", role, event);
});
/** GET /_agent-native/org/invitations — list pending invitations for the org */
var listInvitationsHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) return { invitations: [] };
	const { rows } = await (await exec()).execute({
		sql: `SELECT id, email, invited_by AS "invitedBy", created_at AS "createdAt", status, role
            FROM org_invitations
            WHERE org_id = ? AND status = 'pending'`,
		args: [ctx.orgId]
	});
	return { invitations: rows.map((r) => ({
		id: String(r.id),
		email: String(r.email),
		invitedBy: String(r.invitedBy ?? r.invited_by),
		createdAt: Number(r.createdAt ?? r.created_at),
		status: String(r.status),
		role: String(r.role ?? "member") === "admin" ? "admin" : "member"
	})) };
});
/** POST /_agent-native/org/invitations/:id/accept — accept an invitation */
var acceptInvitationHandler = defineEventHandler(async (event) => {
	const email = requireAuthEmail(await getSession(event));
	const invitationId = extractInvitationId(event);
	if (!invitationId) throw createError({
		statusCode: 400,
		message: "Invitation ID required"
	});
	const e = await exec();
	const invRes = await e.execute({
		sql: `SELECT id, org_id AS "orgId", role FROM org_invitations
            WHERE id = ? AND LOWER(email) = ? AND status = 'pending' LIMIT 1`,
		args: [invitationId, email.toLowerCase()]
	});
	if (invRes.rows.length === 0) throw createError({
		statusCode: 404,
		message: "Invitation not found or already used"
	});
	const inv = invRes.rows[0];
	const invOrgId = String(inv.orgId ?? inv.org_id);
	const inviteRole = inv.role === "admin" ? "admin" : "member";
	const existingMembership = await e.execute({
		sql: `SELECT role FROM org_members WHERE org_id = ? AND LOWER(email) = ? LIMIT 1`,
		args: [invOrgId, email.toLowerCase()]
	});
	const orgRes = await e.execute({
		sql: `SELECT name FROM organizations WHERE id = ? LIMIT 1`,
		args: [invOrgId]
	});
	const orgName = String(orgRes.rows[0]?.name ?? "");
	if (existingMembership.rows.length > 0) {
		await e.execute({
			sql: `UPDATE org_invitations SET status = 'accepted' WHERE id = ?`,
			args: [invitationId]
		});
		await putUserSetting(email, "active-org-id", { orgId: invOrgId });
		return {
			orgId: invOrgId,
			orgName,
			role: String(existingMembership.rows[0].role)
		};
	}
	await e.execute({
		sql: `INSERT INTO org_members (id, org_id, email, role, joined_at) VALUES (?, ?, ?, ?, ?)`,
		args: [
			nanoid(),
			invOrgId,
			email,
			inviteRole,
			Date.now()
		]
	});
	await e.execute({
		sql: `UPDATE org_invitations SET status = 'accepted' WHERE id = ?`,
		args: [invitationId]
	});
	await putUserSetting(email, "active-org-id", { orgId: invOrgId });
	return {
		orgId: invOrgId,
		orgName,
		role: inviteRole
	};
});
/** DELETE /_agent-native/org/members/:email — remove a member (owner/admin only) */
var removeMemberHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) throw createError({
		statusCode: 400,
		message: "No organization found"
	});
	if (ctx.role !== "owner" && ctx.role !== "admin") throw createError({
		statusCode: 403,
		message: "Only owners and admins can remove members"
	});
	const memberEmail = extractMemberEmail(event);
	if (!memberEmail) throw createError({
		statusCode: 400,
		message: "Email is required"
	});
	const memberEmailLower = memberEmail.toLowerCase();
	if (memberEmailLower === ctx.email.toLowerCase() && ctx.role === "owner") throw createError({
		statusCode: 400,
		message: "Organization owner cannot remove themselves"
	});
	const e = await exec();
	if ((await e.execute({
		sql: `SELECT 1 FROM org_members WHERE org_id = ? AND LOWER(email) = ? AND role = 'owner' LIMIT 1`,
		args: [ctx.orgId, memberEmailLower]
	})).rows.length > 0) throw createError({
		statusCode: 403,
		message: "Cannot remove the organization owner"
	});
	await e.execute({
		sql: `DELETE FROM org_members WHERE org_id = ? AND LOWER(email) = ?`,
		args: [ctx.orgId, memberEmailLower]
	});
	return { success: true };
});
/**
* PUT /_agent-native/org/members/:email/role — change a member's role
* (owner/admin only). Body: { role: "admin" | "member" }.
*
* Only owners can promote/demote admins. (Admins can manage members but
* not other admins — otherwise an admin could escalate themselves to
* owner-equivalent control by promoting a confederate.)
*/
var changeMemberRoleHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) throw createError({
		statusCode: 400,
		message: "No organization found"
	});
	if (ctx.role !== "owner" && ctx.role !== "admin") throw createError({
		statusCode: 403,
		message: "Only owners and admins can change member roles"
	});
	const memberEmail = extractMemberEmail(event);
	if (!memberEmail) throw createError({
		statusCode: 400,
		message: "Email is required"
	});
	const memberEmailLower = memberEmail.toLowerCase();
	const role = (await readBody(event))?.role === "admin" ? "admin" : "member";
	const e = await exec();
	const current = await e.execute({
		sql: `SELECT role FROM org_members WHERE org_id = ? AND LOWER(email) = ? LIMIT 1`,
		args: [ctx.orgId, memberEmailLower]
	});
	if (current.rows.length === 0) throw createError({
		statusCode: 404,
		message: "Member not found"
	});
	const currentRole = String(current.rows[0].role);
	if (currentRole === "owner") throw createError({
		statusCode: 400,
		message: "Cannot change the organization owner's role"
	});
	if (ctx.role === "admin" && (currentRole === "admin" || role === "admin")) throw createError({
		statusCode: 403,
		message: "Only the organization owner can manage admins"
	});
	if (memberEmailLower === ctx.email.toLowerCase() && ctx.role === "admin") throw createError({
		statusCode: 400,
		message: "Use the owner account to change your own admin role"
	});
	await e.execute({
		sql: `UPDATE org_members SET role = ? WHERE org_id = ? AND LOWER(email) = ?`,
		args: [
			role,
			ctx.orgId,
			memberEmailLower
		]
	});
	return {
		email: memberEmailLower,
		role
	};
});
/** PATCH /_agent-native/org — rename the current organization (owner/admin only) */
var updateOrgHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) throw createError({
		statusCode: 400,
		message: "No organization found"
	});
	if (ctx.role !== "owner" && ctx.role !== "admin") throw createError({
		statusCode: 403,
		message: "Only owners and admins can update the organization"
	});
	const name = (await readBody(event))?.name?.trim();
	if (!name) throw createError({
		statusCode: 400,
		message: "Organization name is required"
	});
	await (await exec()).execute({
		sql: `UPDATE organizations SET name = ? WHERE id = ?`,
		args: [name, ctx.orgId]
	});
	return {
		orgId: ctx.orgId,
		name
	};
});
/** PUT /_agent-native/org/switch — switch the user's active organization */
var switchOrgHandler = defineEventHandler(async (event) => {
	const email = requireAuthEmail(await getSession(event));
	const orgId = (await readBody(event))?.orgId;
	if (!orgId) {
		await putUserSetting(email, "active-org-id", { orgId: null });
		return {
			orgId: null,
			orgName: null,
			role: null
		};
	}
	const membership = await (await exec()).execute({
		sql: `SELECT m.role AS role, o.name AS "orgName"
          FROM org_members m
          INNER JOIN organizations o ON m.org_id = o.id
          WHERE m.org_id = ? AND LOWER(m.email) = ? LIMIT 1`,
		args: [orgId, email.toLowerCase()]
	});
	if (membership.rows.length === 0) throw createError({
		statusCode: 403,
		message: "You are not a member of that organization"
	});
	await putUserSetting(email, "active-org-id", { orgId });
	const row = membership.rows[0];
	return {
		orgId,
		orgName: String(row.orgName ?? row.org_name),
		role: String(row.role)
	};
});
/** POST /_agent-native/org/join-by-domain — join an org whose allowed_domain matches your email */
var joinByDomainHandler = defineEventHandler(async (event) => {
	const email = requireAuthEmail(await getSession(event));
	const orgId = (await readBody(event))?.orgId;
	if (!orgId) throw createError({
		statusCode: 400,
		message: "orgId is required"
	});
	const e = await exec();
	const orgRes = await e.execute({
		sql: `SELECT id, name, allowed_domain FROM organizations WHERE id = ? LIMIT 1`,
		args: [orgId]
	});
	if (orgRes.rows.length === 0) throw createError({
		statusCode: 404,
		message: "Organization not found"
	});
	const org = orgRes.rows[0];
	const allowedDomain = String(org.allowed_domain || "").toLowerCase();
	const userDomain = email.split("@")[1]?.toLowerCase();
	if (!allowedDomain || allowedDomain !== userDomain) throw createError({
		statusCode: 403,
		message: "Your email domain does not match this organization's allowed domain"
	});
	if ((await e.execute({
		sql: `SELECT 1 FROM org_members WHERE org_id = ? AND LOWER(email) = ? LIMIT 1`,
		args: [orgId, email.toLowerCase()]
	})).rows.length > 0) throw createError({
		statusCode: 409,
		message: "Already a member of this organization"
	});
	await e.execute({
		sql: `INSERT INTO org_members (id, org_id, email, role, joined_at) VALUES (?, ?, ?, 'member', ?)`,
		args: [
			nanoid(),
			orgId,
			email,
			Date.now()
		]
	});
	await putUserSetting(email, "active-org-id", { orgId });
	return {
		orgId,
		orgName: String(org.name),
		role: "member"
	};
});
/** PUT /_agent-native/org/domain — set or clear the allowed email domain (owner/admin only) */
var setDomainHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) throw createError({
		statusCode: 400,
		message: "No active organization"
	});
	if (ctx.role !== "owner" && ctx.role !== "admin") throw createError({
		statusCode: 403,
		message: "Only owners and admins can set the allowed domain"
	});
	const raw = (await readBody(event))?.domain?.trim()?.toLowerCase() || null;
	if (raw && !/^([a-z0-9]([a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}$/.test(raw)) throw createError({
		statusCode: 400,
		message: "Invalid domain format"
	});
	if (raw) {
		if (isFreeEmailProvider(raw)) throw createError({
			statusCode: 400,
			message: "Free email providers (gmail.com, outlook.com, etc.) cannot be used as an auto-join domain. Use your company's own domain."
		});
		const ownDomain = ctx.email.split("@")[1]?.toLowerCase() ?? "";
		if (raw !== ownDomain) throw createError({
			statusCode: 400,
			message: `You can only auto-join your own email domain (${ownDomain}).`
		});
	}
	const e = await exec();
	if (raw) {
		if ((await e.execute({
			sql: `SELECT id FROM organizations WHERE LOWER(allowed_domain) = ? AND id != ? LIMIT 1`,
			args: [raw, ctx.orgId]
		})).rows.length > 0) throw createError({
			statusCode: 409,
			message: "Another organization already uses this domain"
		});
	}
	await e.execute({
		sql: `UPDATE organizations SET allowed_domain = ? WHERE id = ?`,
		args: [raw, ctx.orgId]
	});
	return { domain: raw };
});
/** PUT /_agent-native/org/a2a-secret — regenerate or set the org's A2A secret (owner/admin only) */
var setA2ASecretHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) throw createError({
		statusCode: 400,
		message: "No active organization"
	});
	if (ctx.role !== "owner" && ctx.role !== "admin") throw createError({
		statusCode: 403,
		message: "Only owners and admins can manage the A2A secret"
	});
	let secret = (await readBody(event))?.secret?.trim() || null;
	if (!secret) {
		const { randomBytes } = await import("node:crypto");
		secret = randomBytes(32).toString("base64url");
	}
	const e = await exec();
	const prevRes = await e.execute({
		sql: `SELECT a2a_secret FROM organizations WHERE id = ? LIMIT 1`,
		args: [ctx.orgId]
	});
	const previousSecret = String(prevRes.rows[0]?.a2a_secret ?? "") || null;
	await e.execute({
		sql: `UPDATE organizations SET a2a_secret = ? WHERE id = ?`,
		args: [secret, ctx.orgId]
	});
	return {
		a2aSecret: secret,
		previousSecret
	};
});
/**
* POST /_agent-native/org/a2a-secret/sync — push the org's A2A secret to all
* connected apps so cross-app delegation works without manual copy/paste.
*
* Auth: standard session — owner/admin only.
*
* For each discovered agent, signs a JWT with the org's CURRENT a2a_secret
* and POSTs to `<app>/_agent-native/org/a2a-secret/receive` with the same
* secret + the org's domain. The receiving app verifies the JWT using its
* own copy of the secret (peers must already share a secret to be trusted)
* — for the first-ever sync this means at least one peer must already hold
* the secret, which is the bootstrap. For ongoing rotation, regenerate
* locally and call sync immediately; sync signs with the secret that's
* currently in DB, which the peers still have.
*
* Body (optional): { signSecret?: string } — sign the outbound JWTs with
* this secret instead of the org's current secret. Used by the regenerate-
* then-sync flow: regenerate stores the NEW secret, but sync needs to
* authenticate using the OLD one that peers still hold. Owner/admin only,
* gated by the session.
*/
var syncA2ASecretHandler = defineEventHandler(async (event) => {
	const ctx = await getOrgContext(event);
	if (!ctx.orgId) throw createError({
		statusCode: 400,
		message: "No active organization"
	});
	if (ctx.role !== "owner" && ctx.role !== "admin") throw createError({
		statusCode: 403,
		message: "Only owners and admins can sync the A2A secret"
	});
	const body = await readBody(event).catch(() => null);
	const overrideSignSecret = typeof body?.signSecret === "string" && body.signSecret.trim() ? body.signSecret.trim() : null;
	const orgRes = await (await exec()).execute({
		sql: `SELECT a2a_secret, allowed_domain FROM organizations WHERE id = ? LIMIT 1`,
		args: [ctx.orgId]
	});
	if (orgRes.rows.length === 0) throw createError({
		statusCode: 404,
		message: "Organization not found"
	});
	const orgRow = orgRes.rows[0];
	const secret = String(orgRow.a2a_secret ?? "") || null;
	const orgDomain = String(orgRow.allowed_domain ?? "") || null;
	if (!secret) throw createError({
		statusCode: 400,
		message: "Org has no A2A secret. Generate one first before syncing."
	});
	if (!orgDomain) throw createError({
		statusCode: 400,
		message: "Org has no allowed domain set. Set the email domain first so connected apps can identify which org to update."
	});
	const signSecret = overrideSignSecret || secret;
	const { discoverAgents } = await import("./agent-discovery-1twg3iI7.js").then((n) => n.t);
	const { signA2AToken } = await import("./client-DoIFGiWA.js").then((n) => n.i);
	const agents = await discoverAgents();
	const results = [];
	await Promise.all(agents.map(async (agent) => {
		try {
			const token = await signA2AToken(ctx.email, orgDomain, signSecret);
			const target = `${agent.url.replace(/\/$/, "")}/_agent-native/org/a2a-secret/receive`;
			const res = await fetch(target, {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${token}`
				},
				body: JSON.stringify({
					secret,
					orgDomain
				})
			});
			if (!res.ok) {
				const text = await res.text().catch(() => "");
				results.push({
					id: agent.id,
					name: agent.name,
					url: agent.url,
					ok: false,
					status: res.status,
					error: text || res.statusText
				});
				return;
			}
			results.push({
				id: agent.id,
				name: agent.name,
				url: agent.url,
				ok: true,
				status: res.status
			});
		} catch (err) {
			results.push({
				id: agent.id,
				name: agent.name,
				url: agent.url,
				ok: false,
				error: err instanceof Error ? err.message : String(err)
			});
		}
	}));
	const succeeded = results.filter((r) => r.ok).length;
	return {
		total: results.length,
		succeeded,
		failed: results.length - succeeded,
		results
	};
});
/**
* POST /_agent-native/org/a2a-secret/receive — accept a secret push from a
* connected agent-native app. Auth-exempt at the route guard; we verify a
* JWT signed by the calling app using OUR copy of the org's a2a_secret. If
* verification succeeds the calling app is a trusted peer and we overwrite
* our local org's secret with the supplied value.
*
* Body: { secret: string, orgDomain: string }
*
* Header: Authorization: Bearer <JWT signed with the existing shared
* a2a_secret, with `org_domain` matching the body's orgDomain>.
*/
var receiveA2ASecretHandler = defineEventHandler(async (event) => {
	const { getRequestHeader } = await import("./node-DxyfkX8_.js").then((n) => n.t);
	const jose = await import("./webapi-BRtoFKCk.js").then((n) => n.t);
	const authHeader = getRequestHeader(event, "authorization");
	if (!authHeader || !authHeader.startsWith("Bearer ")) throw createError({
		statusCode: 401,
		message: "Bearer token required"
	});
	const token = authHeader.slice(7);
	const body = await readBody(event);
	const newSecret = typeof body?.secret === "string" ? body.secret.trim() : "";
	const orgDomain = typeof body?.orgDomain === "string" ? body.orgDomain.trim().toLowerCase() : "";
	if (!newSecret || !orgDomain) throw createError({
		statusCode: 400,
		message: "secret and orgDomain are required"
	});
	let claimedDomain;
	try {
		claimedDomain = jose.decodeJwt(token).org_domain || void 0;
	} catch {
		throw createError({
			statusCode: 401,
			message: "Malformed JWT"
		});
	}
	if (!claimedDomain || claimedDomain.toLowerCase() !== orgDomain.toLowerCase()) throw createError({
		statusCode: 401,
		message: "JWT org_domain does not match request body"
	});
	const e = await exec();
	const orgRes = await e.execute({
		sql: `SELECT id, a2a_secret FROM organizations WHERE LOWER(allowed_domain) = ? LIMIT 1`,
		args: [orgDomain]
	});
	if (orgRes.rows.length === 0) throw createError({
		statusCode: 404,
		message: "No local org matches that domain"
	});
	const row = orgRes.rows[0];
	const localOrgId = String(row.id);
	const existingSecret = String(row.a2a_secret ?? "") || null;
	if (!existingSecret) throw createError({
		statusCode: 401,
		message: "Local org has no A2A secret yet — cannot verify caller. Set the secret manually for the first time."
	});
	try {
		await jose.jwtVerify(token, new TextEncoder().encode(existingSecret));
	} catch {
		throw createError({
			statusCode: 401,
			message: "Invalid or expired JWT signature"
		});
	}
	await e.execute({
		sql: `UPDATE organizations SET a2a_secret = ? WHERE id = ?`,
		args: [newSecret, localOrgId]
	});
	return {
		ok: true,
		orgId: localOrgId
	};
});
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/org/plugin.js
var ORG_PREFIX = `${FRAMEWORK_PREFIX}/org`;
/**
* Mounts the org REST routes under `/_agent-native/org/*` and runs the org
* module's migrations.
*
* Routes:
*   GET    /_agent-native/org/me                          — current user's active org + invites
*   POST   /_agent-native/org                             — create organization
*   PATCH  /_agent-native/org                             — rename organization (owner/admin)
*   PUT    /_agent-native/org/switch                      — switch active org
*   GET    /_agent-native/org/members                     — list members of active org
*   DELETE /_agent-native/org/members/:email              — remove member (owner/admin only)
*   GET    /_agent-native/org/invitations                 — list pending invites
*   POST   /_agent-native/org/invitations                 — invite by email
*   POST   /_agent-native/org/invitations/:id/accept      — accept an invitation
*   POST   /_agent-native/org/join-by-domain              — join org via email domain match
*   PUT    /_agent-native/org/domain                      — set/clear allowed email domain (owner/admin)
*   PUT    /_agent-native/org/a2a-secret                  — regenerate or set A2A secret (owner/admin)
*   POST   /_agent-native/org/a2a-secret/sync             — push secret to all connected apps (owner/admin)
*   POST   /_agent-native/org/a2a-secret/receive          — accept a peer's secret push (JWT-auth, no session)
*/
function createOrgPlugin() {
	const migrate = runMigrations(ORG_MIGRATIONS, { table: "_org_migrations" });
	return async (nitroApp) => {
		markDefaultPluginProvided(nitroApp, "org");
		await awaitBootstrap(nitroApp);
		await migrate(nitroApp);
		const app = getH3App(nitroApp);
		app.use(`${ORG_PREFIX}/me`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return getMyOrgHandler(event);
		}));
		app.use(`${ORG_PREFIX}/members`, defineEventHandler(async (event) => {
			const tail = getRequestURL(event).pathname || "/";
			const method = getMethod(event);
			if (tail === "" || tail === "/") {
				if (method !== "GET") {
					setResponseStatus(event, 405);
					return { error: "Method not allowed" };
				}
				return listMembersHandler(event);
			}
			if (/^\/[^\/]+\/role\/?$/.test(tail)) {
				if (method !== "PUT") {
					setResponseStatus(event, 405);
					return { error: "Method not allowed" };
				}
				return changeMemberRoleHandler(event);
			}
			if (method !== "DELETE") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return removeMemberHandler(event);
		}));
		app.use(`${ORG_PREFIX}/invitations`, defineEventHandler(async (event) => {
			const tail = getRequestURL(event).pathname || "/";
			const method = getMethod(event);
			if (tail === "" || tail === "/") {
				if (method === "GET") return listInvitationsHandler(event);
				if (method === "POST") return createInvitationHandler(event);
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			if (/^\/[^\/]+\/accept\/?$/.test(tail)) {
				if (method !== "POST") {
					setResponseStatus(event, 405);
					return { error: "Method not allowed" };
				}
				return acceptInvitationHandler(event);
			}
			setResponseStatus(event, 404);
			return { error: "Not found" };
		}));
		app.use(`${ORG_PREFIX}/join-by-domain`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return joinByDomainHandler(event);
		}));
		app.use(`${ORG_PREFIX}/a2a-secret/sync`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return syncA2ASecretHandler(event);
		}));
		app.use(`${ORG_PREFIX}/a2a-secret/receive`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return receiveA2ASecretHandler(event);
		}));
		app.use(`${ORG_PREFIX}/a2a-secret`, defineEventHandler(async (event) => {
			const tail = getRequestURL(event).pathname || "/";
			if (tail === "/sync" || tail === "/sync/" || tail === "/receive" || tail === "/receive/") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			if (getMethod(event) !== "PUT") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return setA2ASecretHandler(event);
		}));
		app.use(`${ORG_PREFIX}/domain`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "PUT") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return setDomainHandler(event);
		}));
		app.use(`${ORG_PREFIX}/switch`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "PUT") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			return switchOrgHandler(event);
		}));
		app.use(ORG_PREFIX, defineEventHandler(async (event) => {
			const method = getMethod(event);
			if (method === "POST") return createOrgHandler(event);
			if (method === "PATCH") return updateOrgHandler(event);
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}));
	};
}
/**
* Default org plugin — mount with no configuration needed.
*
* Auto-mounted by the framework when a template doesn't ship `server/plugins/org.ts`.
* To override, create your own plugin file using `createOrgPlugin()` or a
* completely custom implementation.
*/
var defaultOrgPlugin = createOrgPlugin();
//#endregion
export { defaultOrgPlugin as n, createOrgPlugin as t };
