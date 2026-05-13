import { b as setResponseStatus, i as defineEventHandler, l as getQuery } from "./node-DxyfkX8_.js";
import { r as getSession } from "./auth-CvO2kpTD.js";
import { i as getDbExec } from "./client-BnpqLOqs.js";
import { i as getSettingsEmitter } from "./store-BMQUS1KJ.js";
import { r as getAppStateEmitter } from "./emitter-B2qukXTs.js";
import { EventEmitter } from "node:events";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/server/poll.js
/**
* Polling-based change notification.
*
* Replaces SSE with a simple version counter. Each DB mutation (app-state,
* settings, resources) increments the version. Clients poll `/_agent-native/poll?since=N`
* and receive any events that occurred after version N.
*
* Works in all deployment environments (serverless, edge, long-lived).
*
* Also detects cross-process DB writes by periodically checking the
* application_state and settings tables' updated_at timestamps. This ensures
* that changes made by external processes (e.g., CLI actions, cron jobs)
* are picked up even though they don't call recordChange() in this process.
*/
var MAX_BUFFER = 200;
var _version = 0;
var _buffer = [];
var POLL_CHANGE_EVENT = "poll-change";
var _pollEmitter = new EventEmitter();
_pollEmitter.setMaxListeners(0);
/**
* Whether we've seeded _version from the DB. In serverless (Netlify,
* Vercel, etc.) each invocation starts fresh — without seeding, _version
* resets to 0 and polling clients see the version jump backwards, causing
* duplicate events and stuck UI.
*/
var _versionSeeded = false;
/** Tracks the latest updated_at we've seen from the DB, per table. */
var _lastDbCheck = 0;
var _lastAppStateTs = 0;
var _lastSettingsTs = 0;
/**
* Tracks the latest updated_at seen on the `__screen_refresh__` key in
* application_state. Bumped when the agent calls the `refresh-screen` tool,
* and surfaced as a distinct `screen-refresh` event so clients can remount
* the main content subtree via React key.
*
* `_screenRefreshInitialized` guards against spurious emits on the first
* poll after a restart (where an existing row would look like a fresh bump).
* Once we've taken a baseline reading, any subsequent increase emits.
*/
var _lastScreenRefreshTs = 0;
var _screenRefreshInitialized = false;
var SCREEN_REFRESH_KEY = "__screen_refresh__";
var _localEmittersWired = false;
function wireLocalEmitters() {
	if (_localEmittersWired) return;
	_localEmittersWired = true;
	getAppStateEmitter().on("app-state", (event) => {
		recordChange(event);
	});
	getSettingsEmitter().on("settings", (event) => {
		recordChange(event);
	});
}
function getPollEmitter() {
	return _pollEmitter;
}
function canSeeChangeForUser(event, userEmail, orgId) {
	if (!event.owner && !event.orgId) return true;
	if (event.owner && event.owner === userEmail) return true;
	if (event.orgId && orgId && event.orgId === orgId) return true;
	return false;
}
/** Record a change event. Called by emitter listeners. */
function recordChange(event) {
	_version = Math.max(_version + 1, Date.now());
	const entry = {
		...event,
		version: _version
	};
	_buffer.push(entry);
	if (_buffer.length > MAX_BUFFER) _buffer.splice(0, _buffer.length - MAX_BUFFER);
	_pollEmitter.emit(POLL_CHANGE_EVENT, entry);
}
/**
* Get changes after a given version, filtered to events the caller is
* allowed to see.
*
* Filtering rules:
*   - Events without an `owner` are deployment-global (table-level pings,
*     screen-refresh, etc.) and visible to every authenticated user.
*   - Events with `owner === userEmail` go to that user.
*   - Events with `orgId === orgId` go to anyone in that org.
*   - All other owned events are filtered out.
*/
function getChangesSinceForUser(since, userEmail, orgId) {
	if (since >= _version) return {
		version: _version,
		events: []
	};
	const events = _buffer.filter((e) => e.version > since && canSeeChangeForUser(e, userEmail, orgId));
	return {
		version: _version,
		events
	};
}
/**
* Seed _version from DB timestamps on the first call so serverless
* cold starts don't return version 0 and confuse polling clients.
*/
async function seedVersionFromDb() {
	if (_versionSeeded) return;
	_versionSeeded = true;
	try {
		const db = getDbExec();
		const [appResult, settingsResult, refreshResult] = await Promise.all([
			db.execute("SELECT MAX(updated_at) as max_ts FROM application_state"),
			db.execute("SELECT MAX(updated_at) as max_ts FROM settings"),
			db.execute({
				sql: "SELECT updated_at FROM application_state WHERE key = ?",
				args: [SCREEN_REFRESH_KEY]
			})
		]);
		const appTs = Number(appResult.rows[0]?.max_ts) || 0;
		const settingsTs = Number(settingsResult.rows[0]?.max_ts) || 0;
		const refreshTs = Number(refreshResult.rows[0]?.updated_at) || 0;
		_version = Math.max(_version, appTs, settingsTs);
		_lastAppStateTs = appTs;
		_lastSettingsTs = settingsTs;
		_lastScreenRefreshTs = refreshTs;
		_screenRefreshInitialized = true;
	} catch {}
}
/**
* Check for cross-process DB writes by comparing updated_at timestamps.
* Runs at most once per second to avoid excessive queries.
*/
async function checkExternalDbChanges() {
	const now = Date.now();
	if (now - _lastDbCheck < 1e3) return;
	_lastDbCheck = now;
	try {
		const db = getDbExec();
		const appResult = await db.execute("SELECT MAX(updated_at) as max_ts FROM application_state");
		const appTs = Number(appResult.rows[0]?.max_ts) || 0;
		if (appTs > _lastAppStateTs) {
			if (_lastAppStateTs > 0) recordChange({
				source: "app-state",
				type: "change",
				key: "*"
			});
			_lastAppStateTs = appTs;
		}
		const refreshResult = await db.execute({
			sql: "SELECT updated_at, value FROM application_state WHERE key = ?",
			args: [SCREEN_REFRESH_KEY]
		});
		const refreshTs = Number(refreshResult.rows[0]?.updated_at) || 0;
		if (!_screenRefreshInitialized) {
			_lastScreenRefreshTs = refreshTs;
			_screenRefreshInitialized = true;
		} else if (refreshTs > _lastScreenRefreshTs) {
			let scope;
			try {
				const raw = refreshResult.rows[0]?.value;
				if (typeof raw === "string") {
					const parsed = JSON.parse(raw);
					if (typeof parsed?.scope === "string") scope = parsed.scope;
				}
			} catch {}
			recordChange({
				source: "screen-refresh",
				type: "change",
				key: SCREEN_REFRESH_KEY,
				...scope ? { scope } : {}
			});
			_lastScreenRefreshTs = refreshTs;
		}
		const settingsResult = await db.execute("SELECT MAX(updated_at) as max_ts FROM settings");
		const settingsTs = Number(settingsResult.rows[0]?.max_ts) || 0;
		if (settingsTs > _lastSettingsTs) {
			if (_lastSettingsTs > 0) recordChange({
				source: "settings",
				type: "change",
				key: "*"
			});
			_lastSettingsTs = settingsTs;
		}
	} catch {}
}
/**
* Create an H3 handler for the poll endpoint.
*
* GET /_agent-native/poll?since=N → { version, events[] }
*
* Requires an authenticated session. Events are filtered to the caller's
* tenant — global events (owner-less, table-level pings) reach every
* authenticated caller; owned events reach only the matching user/org.
* Without auth + filtering, an anonymous attacker could poll the deployment
* and infer cross-tenant activity from the global event stream.
*/
function createPollHandler() {
	wireLocalEmitters();
	return defineEventHandler(async (event) => {
		const session = await getSession(event).catch(() => null);
		if (!session?.email) {
			setResponseStatus(event, 401);
			return { error: "Unauthenticated" };
		}
		await seedVersionFromDb();
		await checkExternalDbChanges();
		const query = getQuery(event);
		return getChangesSinceForUser(parseInt(String(query.since ?? "0"), 10) || 0, session.email, session.orgId);
	});
}
//#endregion
export { getPollEmitter as a, getChangesSinceForUser as i, canSeeChangeForUser as n, recordChange as o, createPollHandler as r, POLL_CHANGE_EVENT as t };
