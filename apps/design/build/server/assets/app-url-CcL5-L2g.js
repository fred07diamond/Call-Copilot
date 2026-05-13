import { f as getRequestURL } from "./node-DxyfkX8_.js";
import { c as isLocalDatabase } from "./client-BnpqLOqs.js";
import { t as TEMPLATES } from "./templates-meta-Dggq7O3f.js";
import fs from "node:fs";
import path from "node:path";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/email.js
/**
* Email transport for system emails (password resets, invitations, notifications).
*
* Providers are selected by env var:
*   RESEND_API_KEY    — https://resend.com
*   SENDGRID_API_KEY  — https://sendgrid.com
*   EMAIL_FROM        — "Name <addr@domain>" (optional; defaults to Resend's sandbox)
*
* With neither provider configured, `sendEmail` logs the message to the console
* so the reset-password flow still works end-to-end for local development.
*/
function isEmailConfigured() {
	return !!(process.env.RESEND_API_KEY || process.env.SENDGRID_API_KEY);
}
function getEmailProvider() {
	if (process.env.RESEND_API_KEY) return "resend";
	if (process.env.SENDGRID_API_KEY) return "sendgrid";
	return "dev";
}
function getFromAddress(override, provider) {
	const explicit = override || process.env.EMAIL_FROM;
	if (explicit) return explicit;
	if (provider === "sendgrid") throw new Error("EMAIL_FROM is required when using SendGrid — set it to a verified sender address.");
	return "Agent Native <onboarding@resend.dev>";
}
async function sendEmail(args) {
	const provider = getEmailProvider();
	const from = getFromAddress(args.from, provider);
	if (provider === "resend") {
		const payload = {
			from,
			to: args.to,
			subject: args.subject,
			html: args.html,
			text: args.text
		};
		if (args.cc) payload.cc = Array.isArray(args.cc) ? args.cc : [args.cc];
		if (args.replyTo) payload.reply_to = args.replyTo;
		if (args.attachments?.length) payload.attachments = args.attachments.map((a) => ({
			filename: a.filename,
			content: typeof a.content === "string" ? a.content : a.content.toString("base64"),
			content_type: a.contentType
		}));
		const headers = {};
		if (args.inReplyTo) headers["In-Reply-To"] = args.inReplyTo;
		if (args.references) headers["References"] = args.references;
		if (Object.keys(headers).length) payload.headers = headers;
		const res = await fetch("https://api.resend.com/emails", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(payload)
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			throw new Error(`Resend error ${res.status}: ${body}`);
		}
		return;
	}
	if (provider === "sendgrid") {
		const personalization = { to: [{ email: args.to }] };
		if (args.cc) personalization.cc = (Array.isArray(args.cc) ? args.cc : [args.cc]).map((email) => ({ email }));
		const sgPayload = {
			personalizations: [personalization],
			from: parseSendGridFrom(from),
			subject: args.subject,
			content: [...args.text ? [{
				type: "text/plain",
				value: args.text
			}] : [], {
				type: "text/html",
				value: args.html
			}]
		};
		if (args.replyTo) sgPayload.reply_to = parseSendGridFrom(args.replyTo);
		const sgHeaders = {};
		if (args.inReplyTo) sgHeaders["In-Reply-To"] = args.inReplyTo;
		if (args.references) sgHeaders["References"] = args.references;
		if (Object.keys(sgHeaders).length) sgPayload.headers = sgHeaders;
		if (args.attachments?.length) sgPayload.attachments = args.attachments.map((a) => ({
			filename: a.filename,
			content: typeof a.content === "string" ? Buffer.from(a.content).toString("base64") : a.content.toString("base64"),
			type: a.contentType
		}));
		const res = await fetch("https://api.sendgrid.com/v3/mail/send", {
			method: "POST",
			headers: {
				Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
				"Content-Type": "application/json"
			},
			body: JSON.stringify(sgPayload)
		});
		if (!res.ok) {
			const body = await res.text().catch(() => "");
			throw new Error(`SendGrid error ${res.status}: ${body}`);
		}
		return;
	}
	if (process.env.NODE_ENV === "production") throw new Error("No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY.");
	console.log(`
[agent-native:email] No email provider configured. Set RESEND_API_KEY or SENDGRID_API_KEY to send real emails.
---\nTo: ${args.to}\nFrom: ${from}\nSubject: ${args.subject}\n\n${args.text || stripHtml(args.html)}\n---\n`);
}
function parseSendGridFrom(from) {
	const m = from.match(/^\s*(.*?)\s*<(.+)>\s*$/);
	if (m && m[2]) return {
		name: m[1] || void 0,
		email: m[2]
	};
	return { email: from.trim() };
}
function stripHtml(html) {
	return html.replace(/<br\s*\/?>/gi, "\n").replace(/<\/p>/gi, "\n\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/email-template.js
/**
* Reusable dark-themed HTML email template.
*
* Email clients have limited CSS support, so everything is inlined and layout
* uses tables for Outlook compatibility. The design mirrors the app's dark UI:
* near-black card on neutral background, Inter typography with safe fallbacks.
*
* Default is monochrome (white CTA on dark). Pass `brandColor` to tint the
* CTA button and inline links — Clips, for example, passes its purple.
*
* Usage:
*   const { html, text } = renderEmail({
*     preheader: "…",
*     heading: "You're invited to join Acme",
*     paragraphs: ["Alice invited you to join…"],
*     cta: { label: "Accept invite", url: "https://…" },
*     footer: "If you weren't expecting this, ignore this email.",
*   });
*/
function escapeHtml(s) {
	return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}
function escapeAttr(s) {
	return escapeHtml(s);
}
/**
* Only accept a strict `#rrggbb` hex color for `brandColor`. Anything else
* could inject CSS into the inline `style` attribute (`red; background:url(…)`).
*/
function sanitizeHexColor(input) {
	if (!input) return void 0;
	return /^#[0-9a-fA-F]{6}$/.test(input) ? input : void 0;
}
function renderEmail(args) {
	const preheader = args.preheader || "";
	const brand = sanitizeHexColor(args.brandColor);
	const ctaBg = brand ?? "#fafafa";
	const ctaFg = brand ? "#ffffff" : "#0a0a0c";
	const linkColor = brand ?? "#a1a1aa";
	const paragraphsHtml = args.paragraphs.map((p) => `<p style="margin:0 0 16px 0; font-size:16px; line-height:1.6; color:#d4d4d8;">${p}</p>`).join("");
	const ctaHtml = args.cta ? `
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:24px 0 0 0;">
        <tr>
          <td style="border-radius:10px; background:${ctaBg};">
            <a href="${escapeAttr(args.cta.url)}"
               style="display:inline-block; padding:14px 26px; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size:15px; font-weight:600; color:${ctaFg}; text-decoration:none; border-radius:10px;">
              ${escapeHtml(args.cta.label)}
            </a>
          </td>
        </tr>
      </table>
    ` : "";
	const footerHtml = args.footer ? `<p style="margin:28px 0 0 0; font-size:13px; line-height:1.5; color:#71717a;">${escapeHtml(args.footer)}</p>` : "";
	const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="color-scheme" content="dark light" />
    <meta name="supported-color-schemes" content="dark light" />
    <title>${escapeHtml(args.heading)}</title>
    <style>
      @media (prefers-color-scheme: light) {
        .bg-outer { background-color: #0a0a0c !important; }
      }
      a { color: ${linkColor}; }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#0a0a0c; font-family:'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; -webkit-font-smoothing:antialiased;">
    <div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">
      ${escapeHtml(preheader)}
    </div>
    <table role="presentation" class="bg-outer" cellpadding="0" cellspacing="0" border="0" width="100%" style="background-color:#0a0a0c; padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:560px;">
            <tr>
              <td style="background-color:#141417; border:1px solid #27272a; border-radius:16px; padding:36px 36px 32px 36px;">
                <h1 style="margin:0 0 20px 0; font-size:24px; line-height:1.3; font-weight:600; color:#fafafa; letter-spacing:-0.02em;">
                  ${escapeHtml(args.heading)}
                </h1>
                ${paragraphsHtml}
                ${ctaHtml}
                ${footerHtml}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`;
	const textLines = [];
	textLines.push(args.heading);
	textLines.push("");
	for (const p of args.paragraphs) {
		textLines.push(stripTags(p));
		textLines.push("");
	}
	if (args.cta) {
		textLines.push(`${args.cta.label}: ${args.cta.url}`);
		textLines.push("");
	}
	if (args.footer) textLines.push(args.footer);
	return {
		html,
		text: textLines.join("\n").trim()
	};
}
function stripTags(s) {
	return s.replace(/<br\s*\/?>/gi, "\n").replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, "\"").replace(/&#39;/g, "'").trim();
}
/**
* Build an inline `<strong>` tag with consistent styling for use inside
* paragraph strings passed to `renderEmail`. Escapes the content.
*/
function emailStrong(text) {
	return `<strong style="color:#fafafa; font-weight:600;">${escapeHtml(text)}</strong>`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/app-url.js
/**
* Resolve the canonical URL of this app — used in transactional emails,
* invite links, and anywhere we need an absolute URL that remains valid
* outside the current request context.
*
* Resolution order:
*   1. `APP_URL` env var — explicit override
*   2. `BETTER_AUTH_URL` env var — Better Auth's canonical URL
*   3. `WORKSPACE_GATEWAY_URL` — local multi-app workspace gateway
*   4. First-party template `prodUrl` from the registry (matched by
*      package.json name) — lets deployed first-party apps (mail,
*      calendar, analytics, …) use e.g. `analytics.agent-native.com`
*      instead of their Netlify preview hostname.
*   5. Incoming request's origin (when an H3Event is available)
*   6. Platform-injected URL (Netlify `URL`, Vercel `VERCEL_URL`) —
*      automatically set by the hosting platform, so user-deployed apps
*      get a real hostname in emails without needing to set `APP_URL`.
*   7. `http://localhost:3000`
*/
var cachedPkgName = null;
/**
* Read the app's package name, validated against the first-party template
* registry. On serverless runtimes (Netlify Functions, Cloudflare Workers),
* `process.cwd()` may point at a bundler-generated package.json with a
* bogus name (e.g. Nitro's "traced-node-modules"). Only trust the name if
* it matches a known template.
*/
function readPackageName() {
	if (cachedPkgName !== null) return cachedPkgName ?? void 0;
	try {
		const pkgPath = path.join(process.cwd(), "package.json");
		const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
		const name = typeof pkg?.name === "string" ? pkg.name : void 0;
		cachedPkgName = name && TEMPLATES.some((t) => t.name === name) ? name : void 0;
	} catch {
		cachedPkgName = void 0;
	}
	return cachedPkgName ?? void 0;
}
/** Strip trailing slashes for consistent URL concatenation. */
function stripTrailingSlash(u) {
	return u.replace(/\/+$/, "");
}
/**
* Look up the first-party template `prodUrl` for the current app based on
* its `package.json` name. Returns undefined if the app isn't a known
* first-party template or the template has no `prodUrl`.
*/
function getFirstPartyProdUrl() {
	const name = readPackageName();
	if (!name) return void 0;
	return TEMPLATES.find((t) => t.name === name)?.prodUrl;
}
function getAppProductionUrl(event) {
	const envUrl = process.env.APP_URL || process.env.BETTER_AUTH_URL;
	if (envUrl) return stripTrailingSlash(envUrl);
	if (process.env.WORKSPACE_GATEWAY_URL) return stripTrailingSlash(process.env.WORKSPACE_GATEWAY_URL);
	if (event) try {
		const url = getRequestURL(event);
		return `${url.protocol}//${url.host}`;
	} catch {}
	if (process.env.NODE_ENV === "production" || !isLocalDatabase()) {
		const firstParty = getFirstPartyProdUrl();
		if (firstParty) return stripTrailingSlash(firstParty);
		const netlifyUrl = process.env.URL || process.env.DEPLOY_URL;
		if (netlifyUrl) return stripTrailingSlash(netlifyUrl);
		const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;
		if (vercelUrl) return `https://${stripTrailingSlash(vercelUrl)}`;
	}
	return "http://localhost:3000";
}
//#endregion
export { getEmailProvider as a, renderEmail as i, getFirstPartyProdUrl as n, isEmailConfigured as o, emailStrong as r, sendEmail as s, getAppProductionUrl as t };
