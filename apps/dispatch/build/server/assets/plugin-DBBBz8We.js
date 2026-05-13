import { b as setResponseStatus, c as getMethod, i as defineEventHandler, l as getQuery } from "./node-DxyfkX8_.js";
import { r as getSession } from "./auth-CvO2kpTD.js";
import { r as getSetting } from "./store-BMQUS1KJ.js";
import { l as runWithRequestContext } from "./request-context-Ci6C_Mch.js";
import { a as isAgentEngineSettingConfigured, n as detectEngineFromUserSecrets } from "./registry-DlSn3U6q.js";
import { r as PROVIDER_ENV_VARS, t as PROVIDER_ENV_META } from "./provider-env-vars-CWagFwVS.js";
import { a as appStatePut, r as appStateGet } from "./store-IJ4u-2_H.js";
import { a as markDefaultPluginProvided, i as getH3App, n as awaitBootstrap } from "./framework-request-handler-UFrmVPec.js";
import { n as registerOnboardingStep, t as listOnboardingSteps } from "./registry-D0-2_VH2.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/onboarding/default-steps.js
/**
* Default framework-level onboarding steps.
*
* Registered when `createOnboardingPlugin()` mounts (auto-mount or explicit).
* Templates can override any step by registering another step with the same
* `id` after these have been registered.
*/
var llmStep = {
	id: "llm",
	order: 10,
	required: true,
	title: "Connect an AI engine",
	description: "Use Builder's managed gateway, or bring your own provider key.",
	methods: [{
		id: "builder",
		kind: "builder-cli-auth",
		label: "Connect Builder",
		description: "Connect the Builder space where this app should run. This unlocks managed LLM credits, browser automation, and file uploads. Cloud code changes appear when Builder Cloud Agents are enabled for the workspace.",
		primary: true,
		payload: { scope: "llm" }
	}, ...[
		{
			provider: "anthropic",
			id: "anthropic-key",
			label: "Anthropic",
			description: "Claude models with your own Anthropic key."
		},
		{
			provider: "openai",
			id: "openai-key",
			label: "OpenAI",
			description: "GPT models with your own OpenAI key."
		},
		{
			provider: "google",
			id: "google-key",
			label: "Google Gemini",
			description: "Gemini models with your own Google AI key."
		},
		{
			provider: "openrouter",
			id: "openrouter-key",
			label: "OpenRouter",
			description: "OpenRouter models with your own OpenRouter key."
		},
		{
			provider: "groq",
			id: "groq-key",
			label: "Groq",
			description: "Groq-hosted models with your own Groq key."
		},
		{
			provider: "mistral",
			id: "mistral-key",
			label: "Mistral",
			description: "Mistral models with your own Mistral key."
		},
		{
			provider: "cohere",
			id: "cohere-key",
			label: "Cohere",
			description: "Cohere models with your own Cohere key."
		}
	].map(({ provider, id, label, description, primary }) => {
		const meta = PROVIDER_ENV_META[provider];
		return {
			id,
			kind: "form",
			label,
			description,
			...primary ? { primary: true } : {},
			payload: {
				writeScope: "workspace",
				fields: [{
					key: meta.envVar,
					label: meta.envVar,
					placeholder: meta.placeholder,
					secret: true
				}]
			}
		};
	})],
	isComplete: async () => {
		try {
			const { resolveHasBuilderPrivateKey } = await import("./credential-provider-CKFlFM2V.js");
			if (await resolveHasBuilderPrivateKey()) return true;
		} catch {
			if (process.env.BUILDER_PRIVATE_KEY) return true;
		}
		try {
			if (await detectEngineFromUserSecrets()) return true;
		} catch {}
		if (PROVIDER_ENV_VARS.some((k) => !!process.env[k])) return true;
		try {
			return isAgentEngineSettingConfigured(await getSetting("agent-engine"));
		} catch {
			return false;
		}
	}
};
/** Step 2 — where application data lives. The default DB is non-blocking. */
var databaseStep = {
	id: "database",
	order: 20,
	required: false,
	title: "Database",
	description: "Agent-native stores app data in SQL. Set DATABASE_URL when you want to point this app at a specific database.",
	methods: [{
		id: "database-url",
		kind: "form",
		label: "Set DATABASE_URL",
		description: "Paste the SQL connection string this app should use.",
		payload: {
			writeScope: "workspace",
			fields: [{
				key: "DATABASE_URL",
				label: "DATABASE_URL",
				placeholder: "postgres://..., libsql://..., file:./data/app.db"
			}, {
				key: "DATABASE_AUTH_TOKEN",
				label: "DATABASE_AUTH_TOKEN (if needed)",
				placeholder: "Token for providers such as Turso/libSQL",
				secret: true
			}]
		}
	}],
	isComplete: () => true
};
/** Step 3 — how users sign in. Built-in account auth is non-blocking. */
var authStep = {
	id: "auth",
	order: 30,
	required: false,
	title: "Authentication",
	description: "Built-in email/password accounts work by default. Add OAuth or access tokens only if you want another sign-in path.",
	methods: [
		{
			id: "google-oauth",
			kind: "form",
			label: "Google OAuth",
			description: "Add Google as an optional sign-in provider.",
			payload: {
				writeScope: "workspace",
				fields: [{
					key: "GOOGLE_CLIENT_ID",
					label: "GOOGLE_CLIENT_ID"
				}, {
					key: "GOOGLE_CLIENT_SECRET",
					label: "GOOGLE_CLIENT_SECRET",
					secret: true
				}]
			}
		},
		{
			id: "github-oauth",
			kind: "form",
			label: "GitHub OAuth",
			description: "Add GitHub as an optional sign-in provider.",
			payload: {
				writeScope: "workspace",
				fields: [{
					key: "GITHUB_CLIENT_ID",
					label: "GITHUB_CLIENT_ID"
				}, {
					key: "GITHUB_CLIENT_SECRET",
					label: "GITHUB_CLIENT_SECRET",
					secret: true
				}]
			}
		},
		{
			id: "access-token",
			kind: "form",
			label: "Shared access token",
			description: "Use a simple token gate for private deployments.",
			payload: {
				writeScope: "workspace",
				fields: [{
					key: "ACCESS_TOKEN",
					label: "ACCESS_TOKEN",
					placeholder: "Paste a strong shared token",
					secret: true
				}]
			}
		}
	],
	isComplete: () => true
};
/** Step 4 — transactional email (password resets, invitations). Optional. */
var emailStep = {
	id: "email",
	order: 40,
	required: false,
	title: "Email delivery",
	description: "Optional for local work. Before deploying with password resets, invitations, or share notifications, connect an email provider.",
	methods: [{
		id: "resend",
		kind: "form",
		label: "Resend",
		description: "Use Resend for transactional email.",
		payload: {
			writeScope: "workspace",
			fields: [
				{
					key: "RESEND_API_KEY",
					label: "RESEND_API_KEY",
					placeholder: "re_...",
					secret: true
				},
				{
					key: "EMAIL_FROM",
					label: "EMAIL_FROM (from address)",
					placeholder: "Agent Native <noreply@yourdomain.com>"
				},
				{
					key: "APP_NAME",
					label: "APP_NAME (shown in invite emails)",
					placeholder: "Acme Forms"
				}
			]
		}
	}, {
		id: "sendgrid",
		kind: "form",
		label: "SendGrid",
		description: "Use SendGrid for transactional email.",
		payload: {
			writeScope: "workspace",
			fields: [{
				key: "SENDGRID_API_KEY",
				label: "SENDGRID_API_KEY",
				placeholder: "SG....",
				secret: true
			}, {
				key: "EMAIL_FROM",
				label: "EMAIL_FROM (from address)",
				placeholder: "Agent Native <noreply@yourdomain.com>"
			}]
		}
	}],
	isComplete: () => {
		if (process.env.RESEND_API_KEY) return true;
		if (process.env.SENDGRID_API_KEY) return !!process.env.EMAIL_FROM;
		return false;
	}
};
var registered = false;
/** Idempotent. Safe to call from every plugin-mount call. */
function registerDefaultOnboardingSteps() {
	if (registered) return;
	registered = true;
	registerOnboardingStep(llmStep);
	registerOnboardingStep(databaseStep);
	registerOnboardingStep(authStep);
	registerOnboardingStep(emailStep);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/onboarding/plugin.js
/**
* Onboarding plugin — auto-mounts the `/_agent-native/onboarding/*` routes.
*
* Routes:
*   GET  /_agent-native/onboarding/steps              — list steps + completion
*   POST /_agent-native/onboarding/steps/:id/complete — manual override (marks complete)
*   POST /_agent-native/onboarding/dismiss            — dismiss the banner
*   GET  /_agent-native/onboarding/dismissed          — dismissed flag + allComplete
*/
var ONBOARDING_PREFIX = "/_agent-native/onboarding";
var OVERRIDE_KEY_PREFIX = "onboarding:override:";
var DISMISSED_KEY = "onboarding:dismissed";
/** Resolve the caller context used for onboarding and application-state scoping. */
async function resolveOnboardingContext(event) {
	const session = await getSession(event);
	if (!session) return { sessionId: "local" };
	return {
		sessionId: session.email,
		userEmail: session.email,
		orgId: session.orgId ?? null
	};
}
async function hasOverride(sessionId, stepId) {
	try {
		const val = await appStateGet(sessionId, `${OVERRIDE_KEY_PREFIX}${stepId}`);
		return !!(val && val.complete);
	} catch {
		return false;
	}
}
/**
* Serialise every registered onboarding step (awaiting `isComplete()`).
* Honours the per-session "manual override" flag in application-state.
*
* `preview` short-circuits both the resolver and the override lookup so the
* dev overlay can render the new-user flow without touching real state.
*/
async function serializeSteps(context, options = {}) {
	const steps = listOnboardingSteps();
	const out = [];
	for (const step of steps) {
		let complete = false;
		if (!options.preview) {
			try {
				complete = await step.isComplete(context) === true;
			} catch {
				complete = false;
			}
			if (!complete) complete = await hasOverride(context.sessionId, step.id);
		}
		out.push({
			id: step.id,
			title: step.title,
			description: step.description,
			order: step.order,
			required: step.required ?? false,
			complete,
			methods: step.methods
		});
	}
	return out;
}
function withOnboardingRequestContext(context, fn) {
	return runWithRequestContext({
		userEmail: context.userEmail,
		orgId: context.orgId ?? void 0
	}, fn);
}
function allRequiredComplete(statuses) {
	return statuses.filter((s) => s.required).every((s) => s.complete);
}
function createOnboardingPlugin(options = {}) {
	return async (nitroApp) => {
		markDefaultPluginProvided(nitroApp, "onboarding");
		await awaitBootstrap(nitroApp);
		if (!options.skipDefaultSteps) registerDefaultOnboardingSteps();
		getH3App(nitroApp).use(`${ONBOARDING_PREFIX}/steps`, defineEventHandler(async (event) => {
			const method = getMethod(event);
			const trimmed = (event.url?.pathname || "/").replace(/^\/+/, "").replace(/\/+$/, "");
			if (trimmed === "") {
				if (method !== "GET") {
					setResponseStatus(event, 405);
					return { error: "Method not allowed" };
				}
				const context = await resolveOnboardingContext(event);
				const query = getQuery(event);
				const preview = query.preview === "1" || query.preview === 1;
				return withOnboardingRequestContext(context, () => serializeSteps(context, { preview }));
			}
			const [id, action] = trimmed.split("/");
			if (action === "complete") {
				if (method !== "POST") {
					setResponseStatus(event, 405);
					return { error: "Method not allowed" };
				}
				if (!id) {
					setResponseStatus(event, 400);
					return { error: "id required" };
				}
				const { sessionId } = await resolveOnboardingContext(event);
				await appStatePut(sessionId, `${OVERRIDE_KEY_PREFIX}${id}`, { complete: true }, { requestSource: "agent" });
				return {
					ok: true,
					id
				};
			}
		}));
		getH3App(nitroApp).use(`${ONBOARDING_PREFIX}/dismiss`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const { sessionId } = await resolveOnboardingContext(event);
			await appStatePut(sessionId, DISMISSED_KEY, {
				dismissed: true,
				at: (/* @__PURE__ */ new Date()).toISOString()
			}, { requestSource: "agent" });
			return { ok: true };
		}));
		getH3App(nitroApp).use(`${ONBOARDING_PREFIX}/reopen`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "POST") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const { sessionId } = await resolveOnboardingContext(event);
			await appStatePut(sessionId, DISMISSED_KEY, {
				dismissed: false,
				at: (/* @__PURE__ */ new Date()).toISOString()
			}, { requestSource: "agent" });
			return { ok: true };
		}));
		getH3App(nitroApp).use(`${ONBOARDING_PREFIX}/dismissed`, defineEventHandler(async (event) => {
			if (getMethod(event) !== "GET") {
				setResponseStatus(event, 405);
				return { error: "Method not allowed" };
			}
			const context = await resolveOnboardingContext(event);
			try {
				return await withOnboardingRequestContext(context, async () => {
					const value = await appStateGet(context.sessionId, DISMISSED_KEY);
					return {
						dismissed: !!(value && value.dismissed),
						allComplete: allRequiredComplete(await serializeSteps(context))
					};
				});
			} catch {
				return {
					dismissed: false,
					allComplete: false
				};
			}
		}));
	};
}
/** Default plugin instance — mounted automatically when a template doesn't override. */
var defaultOnboardingPlugin = createOnboardingPlugin();
//#endregion
export { defaultOnboardingPlugin as n, createOnboardingPlugin as t };
