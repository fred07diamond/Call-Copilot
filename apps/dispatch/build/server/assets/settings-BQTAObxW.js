import { o as __toESM, t as __commonJSMin } from "./chunk-D3zDcpJC.js";
import { a as require_react, i as require_jsx_runtime, t as agentNativePath } from "./api-path-Cj855NR1.js";
import { A as createSlot, C as useControllableState, D as VISUALLY_HIDDEN_STYLES, E as createContextScope, F as useComposedRefs, M as useCallbackRef, N as composeEventHandlers, O as Primitive, R as createReactComponent, _ as createPopperScope, b as DismissableLayer, g as Root2$1, h as Content, i as TooltipTrigger, m as Arrow, n as TooltipContent, p as Anchor, t as Tooltip, w as useLayoutEffect2, x as useId, y as Portal$1, z as require_react_dom } from "./tooltip-DemUFzHW.js";
import { $n as consoleSandbox, An as htmlTreeAsString, Bn as isString, Cn as extractExceptionKeysForMessage, D as captureException, E as captureEvent, En as markFunctionWrapped, F as resolvedSyncPromise, Fn as isEvent, Gn as maybeInstrument, H as stripDataUrlContent, Hn as addGlobalUnhandledRejectionInstrumentationHandler, In as isParameterizedString, Jn as getFramesFromEvent, Kn as triggerHandlers, L as safeSetSpanJSONAttributes, Ln as isPlainObject, M as setTag, Mn as isDOMException, N as setUser, Nn as isError, O as captureSession, On as getComponentName, P as startSession, Pn as isErrorEvent, Rn as isPrimitive, S as getSDKSource, Sn as addNonEnumerableProperty, T as getIntegrationsToSetup, Tn as getOriginalFunction, Un as addGlobalErrorInstrumentationHandler, V as parseUrl$1, Wn as addHandler, Xt as getCurrentScope, Yn as getFunctionName, Yt as getClient, Zn as stackParserFromStackParserOptions, Zt as getIsolationScope, a as applyAggregateErrorsToEvent, ar as DEBUG_BUILD$2, at as normalizeToSize, b as _INTERNAL_flushLogsBuffer, c as addBreadcrumb, dn as addExceptionTypeValue, er as debug, fn as getEventDescription, g as makePromiseBuffer, gn as safeJoin, h as createTransport$1, i as addConsoleInstrumentationHandler, ir as GLOBAL_OBJ, jn as isDOMError, kn as getLocationHref, l as applySdkMetadata, ln as timestampInSeconds, m as Client, mn as uuid4, n as conversationIdIntegration, o as inboundFiltersIntegration, qn as createStackParser, r as severityLevelFromString, s as functionToStringIntegration, t as getBreadcrumbLogLevelFromHttpStatusCode, tn as withScope, u as _enhanceErrorWithSentryInfo, un as addExceptionMechanism, v as _INTERNAL_flushMetricsBuffer, w as defineIntegration, wn as fill, zn as isRequest$1 } from "./breadcrumb-log-level-RxL3BGt6.js";
import { n as PROVIDER_ENV_PLACEHOLDERS } from "./provider-env-vars-CWagFwVS.js";
import { n as getRemoteAgentIdFromPath, o as isRemoteAgentPath, p as remoteAgentResourcePath } from "./metadata-CqP8m5xN.js";
import { $t as IconTrash, A as PopoverContent, Gt as __read$1, Ht as __awaiter, Jt as __values$1, Kt as __rest, Qt as IconUpload, Ut as __extends, Vt as __assign$1, Wt as __generator, Xt as IconX, _n as IconBolt, an as IconMicrophone, et as hideOthers, in as IconPencil, j as PopoverTrigger, k as Popover, nt as useFocusGuards, pn as IconClock, qt as __spreadArray, rn as IconPlugConnected, rt as FocusScope, sn as IconMail, t as PromptComposer, tt as ReactRemoveScroll } from "./PromptComposer-Cq1V1fZ5.js";
import { a as IconChevronDown, i as IconChevronRight, n as useBuilderStatus, o as sendToAgentChat, r as IconLoader2, t as useBuilderConnectFlow } from "./useBuilderStatus-BPOLq5tc.js";
import { n as IconCheck, t as IconExternalLink } from "./IconExternalLink-D_vVnOxy.js";
import { t as IconKey } from "./IconKey-kyub48wW.js";
import { n as IconPlus } from "./IconTerminal2-Uhi6ncTh.js";
//#region ../../node_modules/.pnpm/@sentry+core@10.52.0/node_modules/@sentry/core/build/esm/sdk.js
/** A class object that can instantiate Client objects. */
/**
* Internal function to create a new SDK client instance. The client is
* installed and then bound to the current scope.
*
* @param clientClass The client class to instantiate.
* @param options Options to pass to the client.
*/
function initAndBind(clientClass, options) {
	if (options.debug === true) if (DEBUG_BUILD$2) debug.enable();
	else consoleSandbox(() => {
		console.warn("[Sentry] Cannot initialize SDK with `debug` option using a non-debug bundle.");
	});
	getCurrentScope().update(options.initialScope);
	const client = new clientClass(options);
	setCurrentClient(client);
	client.init();
	return client;
}
/**
* Make the given client the current client.
*/
function setCurrentClient(client) {
	getCurrentScope().setClient(client);
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+core@10.52.0/node_modules/@sentry/core/build/esm/utils/ipAddress.js
/**
* @internal
*/
function addAutoIpAddressToSession(session) {
	if ("aggregates" in session) {
		if (session.attrs?.["ip_address"] === void 0) session.attrs = {
			...session.attrs,
			ip_address: "{{auto}}"
		};
	} else if (session.ipAddress === void 0) session.ipAddress = "{{auto}}";
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+core@10.52.0/node_modules/@sentry/core/build/esm/integrations/dedupe.js
var INTEGRATION_NAME$5 = "Dedupe";
var _dedupeIntegration = (() => {
	let previousEvent;
	return {
		name: INTEGRATION_NAME$5,
		processEvent(currentEvent) {
			if (currentEvent.type) return currentEvent;
			try {
				if (_shouldDropEvent(currentEvent, previousEvent)) {
					DEBUG_BUILD$2 && debug.warn("Event dropped due to being a duplicate of previously captured event.");
					return null;
				}
			} catch {}
			return previousEvent = currentEvent;
		}
	};
});
/**
* Deduplication filter.
*/
var dedupeIntegration = defineIntegration(_dedupeIntegration);
/** only exported for tests. */
function _shouldDropEvent(currentEvent, previousEvent) {
	if (!previousEvent) return false;
	if (_isSameMessageEvent(currentEvent, previousEvent)) return true;
	if (_isSameExceptionEvent(currentEvent, previousEvent)) return true;
	return false;
}
function _isSameMessageEvent(currentEvent, previousEvent) {
	const currentMessage = currentEvent.message;
	const previousMessage = previousEvent.message;
	if (!currentMessage && !previousMessage) return false;
	if (currentMessage && !previousMessage || !currentMessage && previousMessage) return false;
	if (currentMessage !== previousMessage) return false;
	if (!_isSameFingerprint(currentEvent, previousEvent)) return false;
	if (!_isSameStacktrace(currentEvent, previousEvent)) return false;
	return true;
}
function _isSameExceptionEvent(currentEvent, previousEvent) {
	const previousException = _getExceptionFromEvent(previousEvent);
	const currentException = _getExceptionFromEvent(currentEvent);
	if (!previousException || !currentException) return false;
	if (previousException.type !== currentException.type || previousException.value !== currentException.value) return false;
	if (!_isSameFingerprint(currentEvent, previousEvent)) return false;
	if (!_isSameStacktrace(currentEvent, previousEvent)) return false;
	return true;
}
function _isSameStacktrace(currentEvent, previousEvent) {
	let currentFrames = getFramesFromEvent(currentEvent);
	let previousFrames = getFramesFromEvent(previousEvent);
	if (!currentFrames && !previousFrames) return true;
	if (currentFrames && !previousFrames || !currentFrames && previousFrames) return false;
	currentFrames = currentFrames;
	previousFrames = previousFrames;
	if (previousFrames.length !== currentFrames.length) return false;
	for (let i = 0; i < previousFrames.length; i++) {
		const frameA = previousFrames[i];
		const frameB = currentFrames[i];
		if (frameA.filename !== frameB.filename || frameA.lineno !== frameB.lineno || frameA.colno !== frameB.colno || frameA.function !== frameB.function) return false;
	}
	return true;
}
function _isSameFingerprint(currentEvent, previousEvent) {
	let currentFingerprint = currentEvent.fingerprint;
	let previousFingerprint = previousEvent.fingerprint;
	if (!currentFingerprint && !previousFingerprint) return true;
	if (currentFingerprint && !previousFingerprint || !currentFingerprint && previousFingerprint) return false;
	currentFingerprint = currentFingerprint;
	previousFingerprint = previousFingerprint;
	try {
		return !!(currentFingerprint.join("") === previousFingerprint.join(""));
	} catch {
		return false;
	}
}
function _getExceptionFromEvent(event) {
	return event.exception?.values?.[0];
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+core@10.52.0/node_modules/@sentry/core/build/esm/utils/supports.js
var WINDOW$2 = GLOBAL_OBJ;
/**
* Tells whether current environment supports History API
* {@link supportsHistory}.
*
* @returns Answer to the given question.
*/
function supportsHistory() {
	return "history" in WINDOW$2 && !!WINDOW$2.history;
}
function _isFetchSupported() {
	if (!("fetch" in WINDOW$2)) return false;
	try {
		new Headers();
		new Request("data:,");
		new Response();
		return true;
	} catch {
		return false;
	}
}
/**
* isNative checks if the given function is a native implementation
*/
function isNativeFunction(func) {
	return func && /^function\s+\w+\(\)\s+\{\s+\[native code\]\s+\}$/.test(func.toString());
}
/**
* Tells whether current environment supports Fetch API natively
* {@link supportsNativeFetch}.
*
* @returns true if `window.fetch` is natively implemented, false otherwise
*/
function supportsNativeFetch() {
	if (typeof EdgeRuntime === "string") return true;
	if (!_isFetchSupported()) return false;
	if (isNativeFunction(WINDOW$2.fetch)) return true;
	let result = false;
	const doc = WINDOW$2.document;
	if (doc && typeof doc.createElement === "function") try {
		const sandbox = doc.createElement("iframe");
		sandbox.hidden = true;
		doc.head.appendChild(sandbox);
		if (sandbox.contentWindow?.fetch) result = isNativeFunction(sandbox.contentWindow.fetch);
		doc.head.removeChild(sandbox);
	} catch (err) {
		DEBUG_BUILD$2 && debug.warn("Could not create sandbox iframe for pure fetch check, bailing to window.fetch: ", err);
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+core@10.52.0/node_modules/@sentry/core/build/esm/instrument/fetch.js
/**
* Add an instrumentation handler for when a fetch request happens.
* The handler function is called once when the request starts and once when it ends,
* which can be identified by checking if it has an `endTimestamp`.
* Returns a function to remove the handler.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addFetchInstrumentationHandler(handler, skipNativeFetchCheck) {
	const type = "fetch";
	const removeHandler = addHandler(type, handler);
	maybeInstrument(type, () => instrumentFetch(void 0, skipNativeFetchCheck));
	return removeHandler;
}
function instrumentFetch(onFetchResolved, skipNativeFetchCheck = false) {
	if (skipNativeFetchCheck && !supportsNativeFetch()) return;
	fill(GLOBAL_OBJ, "fetch", function(originalFetch) {
		return function(...args) {
			const virtualError = /* @__PURE__ */ new Error();
			const { method, url } = parseFetchArgs(args);
			const handlerData = {
				args,
				fetchData: {
					method,
					url
				},
				startTimestamp: timestampInSeconds() * 1e3,
				virtualError,
				headers: getHeadersFromFetchArgs(args)
			};
			if (!onFetchResolved) triggerHandlers("fetch", { ...handlerData });
			return originalFetch.apply(GLOBAL_OBJ, args).then(async (response) => {
				if (onFetchResolved) onFetchResolved(response);
				else triggerHandlers("fetch", {
					...handlerData,
					endTimestamp: timestampInSeconds() * 1e3,
					response
				});
				return response;
			}, (error) => {
				triggerHandlers("fetch", {
					...handlerData,
					endTimestamp: timestampInSeconds() * 1e3,
					error
				});
				if (isError(error) && error.stack === void 0) {
					error.stack = virtualError.stack;
					addNonEnumerableProperty(error, "framesToPop", 1);
				}
				const enhanceOption = getClient()?.getOptions().enhanceFetchErrorMessages ?? "always";
				if (enhanceOption !== false && error instanceof TypeError && (error.message === "Failed to fetch" || error.message === "Load failed" || error.message === "NetworkError when attempting to fetch resource.")) try {
					const hostname = new URL(handlerData.fetchData.url).host;
					if (enhanceOption === "always") error.message = `${error.message} (${hostname})`;
					else addNonEnumerableProperty(error, "__sentry_fetch_url_host__", hostname);
				} catch {}
				throw error;
			});
		};
	});
}
function hasProp(obj, prop) {
	return !!obj && typeof obj === "object" && !!obj[prop];
}
function getUrlFromResource(resource) {
	if (typeof resource === "string") return resource;
	if (!resource) return "";
	if (hasProp(resource, "url")) return resource.url;
	if (resource.toString) return resource.toString();
	return "";
}
/**
* Parses the fetch arguments to find the used Http method and the url of the request.
* Exported for tests only.
*/
function parseFetchArgs(fetchArgs) {
	if (fetchArgs.length === 0) return {
		method: "GET",
		url: ""
	};
	if (fetchArgs.length === 2) {
		const [resource, options] = fetchArgs;
		return {
			url: getUrlFromResource(resource),
			method: hasProp(options, "method") ? String(options.method).toUpperCase() : isRequest$1(resource) && hasProp(resource, "method") ? String(resource.method).toUpperCase() : "GET"
		};
	}
	const arg = fetchArgs[0];
	return {
		url: getUrlFromResource(arg),
		method: hasProp(arg, "method") ? String(arg.method).toUpperCase() : "GET"
	};
}
function getHeadersFromFetchArgs(fetchArgs) {
	const [requestArgument, optionsArgument] = fetchArgs;
	try {
		if (typeof optionsArgument === "object" && optionsArgument !== null && "headers" in optionsArgument && optionsArgument.headers) return new Headers(optionsArgument.headers);
		if (isRequest$1(requestArgument)) return new Headers(requestArgument.headers);
	} catch {}
}
var IconAlertCircle = createReactComponent("outline", "alert-circle", "AlertCircle", [
	["path", {
		"d": "M3 12a9 9 0 1 0 18 0a9 9 0 0 0 -18 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M12 8v4",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 16h.01",
		"key": "svg-2"
	}]
]);
var IconBrain = createReactComponent("outline", "brain", "Brain", [
	["path", {
		"d": "M15.5 13a3.5 3.5 0 0 0 -3.5 3.5v1a3.5 3.5 0 0 0 7 0v-1.8",
		"key": "svg-0"
	}],
	["path", {
		"d": "M8.5 13a3.5 3.5 0 0 1 3.5 3.5v1a3.5 3.5 0 0 1 -7 0v-1.8",
		"key": "svg-1"
	}],
	["path", {
		"d": "M17.5 16a3.5 3.5 0 0 0 0 -7h-.5",
		"key": "svg-2"
	}],
	["path", {
		"d": "M19 9.3v-2.8a3.5 3.5 0 0 0 -7 0",
		"key": "svg-3"
	}],
	["path", {
		"d": "M6.5 16a3.5 3.5 0 0 1 0 -7h.5",
		"key": "svg-4"
	}],
	["path", {
		"d": "M5 9.3v-2.8a3.5 3.5 0 0 1 7 0v10",
		"key": "svg-5"
	}]
]);
var IconBrowser = createReactComponent("outline", "browser", "Browser", [
	["path", {
		"d": "M4 8h16",
		"key": "svg-0"
	}],
	["path", {
		"d": "M4 6a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2l0 -12",
		"key": "svg-1"
	}],
	["path", {
		"d": "M8 4v4",
		"key": "svg-2"
	}]
]);
var IconCloud = createReactComponent("outline", "cloud", "Cloud", [["path", {
	"d": "M6.657 18c-2.572 0 -4.657 -2.007 -4.657 -4.483c0 -2.475 2.085 -4.482 4.657 -4.482c.393 -1.762 1.794 -3.2 3.675 -3.773c1.88 -.572 3.956 -.193 5.444 1c1.488 1.19 2.162 3.007 1.77 4.769h.99c1.913 0 3.464 1.56 3.464 3.486c0 1.927 -1.551 3.487 -3.465 3.487h-11.878",
	"key": "svg-0"
}]]);
var IconCoin = createReactComponent("outline", "coin", "Coin", [
	["path", {
		"d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 7v10",
		"key": "svg-2"
	}]
]);
var IconDatabase = createReactComponent("outline", "database", "Database", [
	["path", {
		"d": "M4 6a8 3 0 1 0 16 0a8 3 0 1 0 -16 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M4 6v6a8 3 0 0 0 16 0v-6",
		"key": "svg-1"
	}],
	["path", {
		"d": "M4 12v6a8 3 0 0 0 16 0v-6",
		"key": "svg-2"
	}]
]);
var IconGauge = createReactComponent("outline", "gauge", "Gauge", [
	["path", {
		"d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M11 12a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M13.41 10.59l2.59 -2.59",
		"key": "svg-2"
	}],
	["path", {
		"d": "M7 12a5 5 0 0 1 5 -5",
		"key": "svg-3"
	}]
]);
var IconGitBranch = createReactComponent("outline", "git-branch", "GitBranch", [
	["path", {
		"d": "M5 18a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M5 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M15 6a2 2 0 1 0 4 0a2 2 0 1 0 -4 0",
		"key": "svg-2"
	}],
	["path", {
		"d": "M7 8l0 8",
		"key": "svg-3"
	}],
	["path", {
		"d": "M9 18h6a2 2 0 0 0 2 -2v-5",
		"key": "svg-4"
	}],
	["path", {
		"d": "M14 14l3 -3l3 3",
		"key": "svg-5"
	}]
]);
var IconLockOpen = createReactComponent("outline", "lock-open", "LockOpen", [
	["path", {
		"d": "M5 13a2 2 0 0 1 2 -2h10a2 2 0 0 1 2 2v6a2 2 0 0 1 -2 2h-10a2 2 0 0 1 -2 -2l0 -6",
		"key": "svg-0"
	}],
	["path", {
		"d": "M11 16a1 1 0 1 0 2 0a1 1 0 1 0 -2 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M8 11v-5a4 4 0 0 1 8 0",
		"key": "svg-2"
	}]
]);
var IconPlayerPlay = createReactComponent("outline", "player-play", "PlayerPlay", [["path", {
	"d": "M7 4v16l13 -8l-13 -8",
	"key": "svg-0"
}]]);
var IconRefresh = createReactComponent("outline", "refresh", "Refresh", [["path", {
	"d": "M20 11a8.1 8.1 0 0 0 -15.5 -2m-.5 -4v4h4",
	"key": "svg-0"
}], ["path", {
	"d": "M4 13a8.1 8.1 0 0 0 15.5 2m.5 4v-4h-4",
	"key": "svg-1"
}]]);
var IconShield = createReactComponent("outline", "shield", "Shield", [["path", {
	"d": "M12 3a12 12 0 0 0 8.5 3a12 12 0 0 1 -8.5 15a12 12 0 0 1 -8.5 -15a12 12 0 0 0 8.5 -3",
	"key": "svg-0"
}]]);
var IconTopologyRing2 = createReactComponent("outline", "topology-ring-2", "TopologyRing2", [
	["path", {
		"d": "M14 6a2 2 0 1 0 -4 0a2 2 0 0 0 4 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M7 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M21 18a2 2 0 1 0 -4 0a2 2 0 0 0 4 0",
		"key": "svg-2"
	}],
	["path", {
		"d": "M7 18h10",
		"key": "svg-3"
	}],
	["path", {
		"d": "M18 16l-5 -8",
		"key": "svg-4"
	}],
	["path", {
		"d": "M11 8l-5 8",
		"key": "svg-5"
	}]
]);
var IconUserCircle = createReactComponent("outline", "user-circle", "UserCircle", [
	["path", {
		"d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M9 10a3 3 0 1 0 6 0a3 3 0 1 0 -6 0",
		"key": "svg-1"
	}],
	["path", {
		"d": "M6.168 18.849a4 4 0 0 1 3.832 -2.849h4a4 4 0 0 1 3.834 2.855",
		"key": "svg-2"
	}]
]);
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/types/event/event.js
var IdentifyOperation$2;
(function(IdentifyOperation) {
	IdentifyOperation["SET"] = "$set";
	IdentifyOperation["SET_ONCE"] = "$setOnce";
	IdentifyOperation["ADD"] = "$add";
	IdentifyOperation["APPEND"] = "$append";
	IdentifyOperation["PREPEND"] = "$prepend";
	IdentifyOperation["REMOVE"] = "$remove";
	IdentifyOperation["PREINSERT"] = "$preInsert";
	IdentifyOperation["POSTINSERT"] = "$postInsert";
	IdentifyOperation["UNSET"] = "$unset";
	IdentifyOperation["CLEAR_ALL"] = "$clearAll";
})(IdentifyOperation$2 || (IdentifyOperation$2 = {}));
/**
* Strings that have special meaning when used as an event's type
* and have different specifications.
*/
var SpecialEventType$1;
(function(SpecialEventType) {
	SpecialEventType["IDENTIFY"] = "$identify";
	SpecialEventType["GROUP_IDENTIFY"] = "$groupidentify";
	SpecialEventType["REVENUE"] = "revenue_amount";
})(SpecialEventType$1 || (SpecialEventType$1 = {}));
var STORAGE_PREFIX$1 = "".concat("AMP", "_unsent");
var DEFAULT_INSTANCE_NAME = "$default_instance";
var AMPLITUDE_SERVER_URL = "https://api2.amplitude.com/2/httpapi";
var EU_AMPLITUDE_SERVER_URL = "https://api.eu.amplitude.com/2/httpapi";
var AMPLITUDE_BATCH_SERVER_URL = "https://api2.amplitude.com/batch";
var EU_AMPLITUDE_BATCH_SERVER_URL = "https://api.eu.amplitude.com/batch";
var UTM_CAMPAIGN$1 = "utm_campaign";
var UTM_CONTENT$1 = "utm_content";
var UTM_ID$1 = "utm_id";
var UTM_MEDIUM$1 = "utm_medium";
var UTM_SOURCE$1 = "utm_source";
var UTM_TERM$1 = "utm_term";
var DCLID$1 = "dclid";
var FBCLID$1 = "fbclid";
var GBRAID$1 = "gbraid";
var GCLID$1 = "gclid";
var KO_CLICK_ID$1 = "ko_click_id";
var LI_FAT_ID$1 = "li_fat_id";
var MSCLKID$1 = "msclkid";
var RDT_CID$1 = "rdt_cid";
var TTCLID$1 = "ttclid";
var TWCLID$1 = "twclid";
var WBRAID$1 = "wbraid";
var BASE_CAMPAIGN$1 = {
	utm_campaign: void 0,
	utm_content: void 0,
	utm_id: void 0,
	utm_medium: void 0,
	utm_source: void 0,
	utm_term: void 0,
	referrer: void 0,
	referring_domain: void 0,
	dclid: void 0,
	gbraid: void 0,
	gclid: void 0,
	fbclid: void 0,
	ko_click_id: void 0,
	li_fat_id: void 0,
	msclkid: void 0,
	rdt_cid: void 0,
	ttclid: void 0,
	twclid: void 0,
	wbraid: void 0
};
var SAFE_HEADERS$1 = [
	"access-control-allow-origin",
	"access-control-allow-credentials",
	"access-control-expose-headers",
	"access-control-max-age",
	"access-control-allow-methods",
	"access-control-allow-headers",
	"accept-patch",
	"accept-ranges",
	"age",
	"allow",
	"alt-svc",
	"cache-control",
	"connection",
	"content-disposition",
	"content-encoding",
	"content-language",
	"content-length",
	"content-location",
	"content-md5",
	"content-range",
	"content-type",
	"date",
	"delta-base",
	"etag",
	"expires",
	"im",
	"last-modified",
	"link",
	"location",
	"permanent",
	"p3p",
	"pragma",
	"proxy-authenticate",
	"public-key-pins",
	"retry-after",
	"server",
	"status",
	"strict-transport-security",
	"trailer",
	"transfer-encoding",
	"tk",
	"upgrade",
	"vary",
	"via",
	"warning",
	"www-authenticate",
	"x-b3-traceid",
	"x-frame-options"
];
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/valid-properties.js
var MAX_PROPERTY_KEYS = 1e3;
var isValidObject = function(properties) {
	if (Object.keys(properties).length > MAX_PROPERTY_KEYS) return false;
	for (var key in properties) {
		var value = properties[key];
		if (!isValidProperties(key, value)) return false;
	}
	return true;
};
var isValidProperties = function(property, value) {
	var e_1, _a;
	if (typeof property !== "string") return false;
	if (Array.isArray(value)) {
		var isValid = true;
		try {
			for (var value_1 = __values$1(value), value_1_1 = value_1.next(); !value_1_1.done; value_1_1 = value_1.next()) {
				var valueElement = value_1_1.value;
				if (Array.isArray(valueElement)) return false;
				else if (typeof valueElement === "object") isValid = isValid && isValidObject(valueElement);
				else if (!["number", "string"].includes(typeof valueElement)) return false;
				if (!isValid) return false;
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (value_1_1 && !value_1_1.done && (_a = value_1.return)) _a.call(value_1);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
	} else if (value === null || value === void 0) return false;
	else if (typeof value === "object") return isValidObject(value);
	else if (![
		"number",
		"string",
		"boolean"
	].includes(typeof value)) return false;
	return true;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/identify.js
var Identify = function() {
	function Identify() {
		this._propertySet = /* @__PURE__ */ new Set();
		this._properties = {};
	}
	Identify.prototype.getUserProperties = function() {
		return __assign$1({}, this._properties);
	};
	Identify.prototype.set = function(property, value) {
		this._safeSet(IdentifyOperation$1.SET, property, value);
		return this;
	};
	Identify.prototype.setOnce = function(property, value) {
		this._safeSet(IdentifyOperation$1.SET_ONCE, property, value);
		return this;
	};
	Identify.prototype.append = function(property, value) {
		this._safeSet(IdentifyOperation$1.APPEND, property, value);
		return this;
	};
	Identify.prototype.prepend = function(property, value) {
		this._safeSet(IdentifyOperation$1.PREPEND, property, value);
		return this;
	};
	Identify.prototype.postInsert = function(property, value) {
		this._safeSet(IdentifyOperation$1.POSTINSERT, property, value);
		return this;
	};
	Identify.prototype.preInsert = function(property, value) {
		this._safeSet(IdentifyOperation$1.PREINSERT, property, value);
		return this;
	};
	Identify.prototype.remove = function(property, value) {
		this._safeSet(IdentifyOperation$1.REMOVE, property, value);
		return this;
	};
	Identify.prototype.add = function(property, value) {
		this._safeSet(IdentifyOperation$1.ADD, property, value);
		return this;
	};
	Identify.prototype.unset = function(property) {
		this._safeSet(IdentifyOperation$1.UNSET, property, "-");
		return this;
	};
	Identify.prototype.clearAll = function() {
		this._properties = {};
		this._properties[IdentifyOperation$1.CLEAR_ALL] = "-";
		return this;
	};
	Identify.prototype._safeSet = function(operation, property, value) {
		if (this._validate(operation, property, value)) {
			var userPropertyMap = this._properties[operation];
			if (userPropertyMap === void 0) {
				userPropertyMap = {};
				this._properties[operation] = userPropertyMap;
			}
			userPropertyMap[property] = value;
			this._propertySet.add(property);
			return true;
		}
		return false;
	};
	Identify.prototype._validate = function(operation, property, value) {
		if (this._properties[IdentifyOperation$1.CLEAR_ALL] !== void 0) return false;
		if (this._propertySet.has(property)) return false;
		if (operation === IdentifyOperation$1.ADD) return typeof value === "number";
		if (operation !== IdentifyOperation$1.UNSET && operation !== IdentifyOperation$1.REMOVE) return isValidProperties(property, value);
		return true;
	};
	return Identify;
}();
var IdentifyOperation$1;
(function(IdentifyOperation) {
	IdentifyOperation["SET"] = "$set";
	IdentifyOperation["SET_ONCE"] = "$setOnce";
	IdentifyOperation["ADD"] = "$add";
	IdentifyOperation["APPEND"] = "$append";
	IdentifyOperation["PREPEND"] = "$prepend";
	IdentifyOperation["REMOVE"] = "$remove";
	IdentifyOperation["PREINSERT"] = "$preInsert";
	IdentifyOperation["POSTINSERT"] = "$postInsert";
	IdentifyOperation["UNSET"] = "$unset";
	IdentifyOperation["CLEAR_ALL"] = "$clearAll";
})(IdentifyOperation$1 || (IdentifyOperation$1 = {}));
/**
* Note that the order of operations should align with https://github.com/amplitude/nova/blob/7701b5986b565d4b2fb53b99a9f2175df055dea8/src/main/java/com/amplitude/ingestion/core/UserPropertyUtils.java#L210
*/
var OrderedIdentifyOperations = [
	IdentifyOperation$1.CLEAR_ALL,
	IdentifyOperation$1.UNSET,
	IdentifyOperation$1.SET,
	IdentifyOperation$1.SET_ONCE,
	IdentifyOperation$1.ADD,
	IdentifyOperation$1.APPEND,
	IdentifyOperation$1.PREPEND,
	IdentifyOperation$1.PREINSERT,
	IdentifyOperation$1.POSTINSERT,
	IdentifyOperation$1.REMOVE
];
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/types/messages.js
var SUCCESS_MESSAGE = "Event tracked successfully";
var UNEXPECTED_ERROR_MESSAGE = "Unexpected error occurred";
var MAX_RETRIES_EXCEEDED_MESSAGE = "Event rejected due to exceeded retry count";
var OPT_OUT_MESSAGE = "Event skipped due to optOut config";
var MISSING_API_KEY_MESSAGE = "Event rejected due to missing API key";
var CLIENT_NOT_INITIALIZED = "Client not initialized";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/types/status.js
/** The status of an event. */
var Status;
(function(Status) {
	/** The status could not be determined. */
	Status["Unknown"] = "unknown";
	/** The event was skipped due to configuration or callbacks. */
	Status["Skipped"] = "skipped";
	/** The event was sent successfully. */
	Status["Success"] = "success";
	/** A user or device in the payload is currently rate limited and should try again later. */
	Status["RateLimit"] = "rate_limit";
	/** The sent payload was too large to be processed. */
	Status["PayloadTooLarge"] = "payload_too_large";
	/** The event could not be processed. */
	Status["Invalid"] = "invalid";
	/** A server-side error ocurred during submission. */
	Status["Failed"] = "failed";
	/** a server or client side error occuring when a request takes too long and is cancelled */
	Status["Timeout"] = "Timeout";
	/** NodeJS runtime environment error.. E.g. disconnected from network */
	Status["SystemError"] = "SystemError";
})(Status || (Status = {}));
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/result-builder.js
var buildResult = function(event, code, message) {
	if (code === void 0) code = 0;
	if (message === void 0) message = Status.Unknown;
	return {
		event,
		code,
		message
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/global-scope.js
var getGlobalScope$1 = function() {
	var ampIntegrationContextName = "ampIntegrationContext";
	if (typeof globalThis !== "undefined" && typeof globalThis[ampIntegrationContextName] !== "undefined") return globalThis[ampIntegrationContextName];
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof window !== "undefined") return window;
	if (typeof self !== "undefined") return self;
	if (typeof global !== "undefined") return global;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/uuid.js
/**
* Source: [jed's gist's comment]{@link https://gist.github.com/jed/982883?permalink_comment_id=3223002#gistcomment-3223002}.
* Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
* where each x is replaced with a random hexadecimal digit from 0 to f, and
* y is replaced with a random hexadecimal digit from 8 to b.
* Used to generate UUIDs for deviceIds.
* @private
*/
var legacyUUID$1 = function(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : (String(1e7) + String(-1e3) + String(-4e3) + String(-8e3) + String(-1e11)).replace(/[018]/g, UUID$1);
};
var hex$1 = __spreadArray([], __read$1(Array(256).keys()), false).map(function(index) {
	return index.toString(16).padStart(2, "0");
});
var UUID$1 = function(a) {
	var _a;
	var globalScope = getGlobalScope$1();
	/* istanbul ignore next */
	if (!((_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.crypto) === null || _a === void 0 ? void 0 : _a.getRandomValues)) return legacyUUID$1(a);
	var r = globalScope.crypto.getRandomValues(new Uint8Array(16));
	r[6] = r[6] & 15 | 64;
	r[8] = r[8] & 63 | 128;
	return __spreadArray([], __read$1(r.entries()), false).map(function(_a) {
		var _b = __read$1(_a, 2), index = _b[0], int = _b[1];
		return [
			4,
			6,
			8,
			10
		].includes(index) ? "-".concat(hex$1[int]) : hex$1[int];
	}).join("");
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/timeline.js
var Timeline = function() {
	function Timeline(client) {
		this.client = client;
		this.queue = [];
		this.applying = false;
		this.plugins = [];
		this.pluginStatus = /* @__PURE__ */ new Map();
		this._optOutListeners = [];
	}
	Timeline.prototype.register = function(plugin, config) {
		var _a, _b;
		return __awaiter(this, void 0, void 0, function() {
			var name;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						if (plugin.name === void 0) {
							plugin.name = UUID$1();
							this.loggerProvider.warn("Plugin name is undefined.\n      Generating a random UUID for plugin name: ".concat(plugin.name, ".\n      Set a name for the plugin to prevent it from being added multiple times."));
						}
						name = plugin.name;
						if (this.pluginStatus.has(name)) {
							this.loggerProvider.warn("Plugin with name ".concat(name, " already exists, skipping registration"));
							return [2];
						}
						plugin.type = (_a = plugin.type) !== null && _a !== void 0 ? _a : "enrichment";
						this.pluginStatus.set(name, "locked");
						return [4, (_b = plugin.setup) === null || _b === void 0 ? void 0 : _b.call(plugin, config, this.client)];
					case 1:
						_c.sent();
						if (this.pluginStatus.get(name) !== "locked") return [2];
						this.plugins.push(plugin);
						this.pluginStatus.set(name, "installed");
						return [2];
				}
			});
		});
	};
	Timeline.prototype.deregister = function(pluginName, config) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			var index, plugin;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						this.pluginStatus.delete(pluginName);
						index = this.plugins.findIndex(function(plugin) {
							return plugin.name === pluginName;
						});
						if (index === -1) {
							config.loggerProvider.warn("Plugin with name ".concat(pluginName, " does not exist, skipping deregistration"));
							return [2];
						}
						plugin = this.plugins[index];
						this.plugins.splice(index, 1);
						return [4, (_a = plugin.teardown) === null || _a === void 0 ? void 0 : _a.call(plugin)];
					case 1:
						_b.sent();
						return [2];
				}
			});
		});
	};
	Timeline.prototype.reset = function(client) {
		this._clearOptOutListeners();
		this.applying = false;
		this.plugins.map(function(plugin) {
			var _a;
			return (_a = plugin.teardown) === null || _a === void 0 ? void 0 : _a.call(plugin);
		});
		this.plugins = [];
		this.pluginStatus.clear();
		this.client = client;
	};
	Timeline.prototype.push = function(event) {
		var _this = this;
		return new Promise(function(resolve) {
			_this.queue.push([event, resolve]);
			_this.scheduleApply(0);
		});
	};
	Timeline.prototype.scheduleApply = function(timeout) {
		var _this = this;
		if (this.applying) return;
		this.applying = true;
		setTimeout(function() {
			_this.apply(_this.queue.shift()).then(function() {
				_this.applying = false;
				if (_this.queue.length > 0) _this.scheduleApply(0);
			});
		}, timeout);
	};
	Timeline.prototype.apply = function(item) {
		return __awaiter(this, void 0, void 0, function() {
			var _a, event, _b, resolve, before, before_1, before_1_1, plugin, e, e_1_1, enrichment, enrichment_1, enrichment_1_1, plugin, e, e_2_1, destination, executeDestinations;
			var e_1, _c, e_2, _d;
			return __generator(this, function(_e) {
				switch (_e.label) {
					case 0:
						if (!item) return [2];
						_a = __read$1(item, 1), event = _a[0];
						_b = __read$1(item, 2), resolve = _b[1];
						this.loggerProvider.log("Timeline.apply: Initial event", event);
						before = this.plugins.filter(function(plugin) {
							return plugin.type === "before";
						});
						_e.label = 1;
					case 1:
						_e.trys.push([
							1,
							6,
							7,
							8
						]);
						before_1 = __values$1(before), before_1_1 = before_1.next();
						_e.label = 2;
					case 2:
						if (!!before_1_1.done) return [3, 5];
						plugin = before_1_1.value;
						/* istanbul ignore if */
						if (!plugin.execute) return [3, 4];
						return [4, plugin.execute(__assign$1({}, event))];
					case 3:
						e = _e.sent();
						if (e === null) {
							this.loggerProvider.log("Timeline.apply: Event filtered out by before plugin '".concat(String(plugin.name), "', event: ").concat(JSON.stringify(event)));
							resolve({
								event,
								code: 0,
								message: ""
							});
							return [2];
						} else {
							event = e;
							this.loggerProvider.log("Timeline.apply: Event after before plugin '".concat(String(plugin.name), "', event: ").concat(JSON.stringify(event)));
						}
						_e.label = 4;
					case 4:
						before_1_1 = before_1.next();
						return [3, 2];
					case 5: return [3, 8];
					case 6:
						e_1_1 = _e.sent();
						e_1 = { error: e_1_1 };
						return [3, 8];
					case 7:
						try {
							if (before_1_1 && !before_1_1.done && (_c = before_1.return)) _c.call(before_1);
						} finally {
							if (e_1) throw e_1.error;
						}
						return [7];
					case 8:
						enrichment = this.plugins.filter(function(plugin) {
							return plugin.type === "enrichment" || plugin.type === void 0;
						});
						_e.label = 9;
					case 9:
						_e.trys.push([
							9,
							14,
							15,
							16
						]);
						enrichment_1 = __values$1(enrichment), enrichment_1_1 = enrichment_1.next();
						_e.label = 10;
					case 10:
						if (!!enrichment_1_1.done) return [3, 13];
						plugin = enrichment_1_1.value;
						/* istanbul ignore if */
						if (!plugin.execute) return [3, 12];
						return [4, plugin.execute(__assign$1({}, event))];
					case 11:
						e = _e.sent();
						if (e === null) {
							this.loggerProvider.log("Timeline.apply: Event filtered out by enrichment plugin '".concat(String(plugin.name), "', event: ").concat(JSON.stringify(event)));
							resolve({
								event,
								code: 0,
								message: ""
							});
							return [2];
						} else {
							event = e;
							this.loggerProvider.log("Timeline.apply: Event after enrichment plugin '".concat(String(plugin.name), "', event: ").concat(JSON.stringify(event)));
						}
						_e.label = 12;
					case 12:
						enrichment_1_1 = enrichment_1.next();
						return [3, 10];
					case 13: return [3, 16];
					case 14:
						e_2_1 = _e.sent();
						e_2 = { error: e_2_1 };
						return [3, 16];
					case 15:
						try {
							if (enrichment_1_1 && !enrichment_1_1.done && (_d = enrichment_1.return)) _d.call(enrichment_1);
						} finally {
							if (e_2) throw e_2.error;
						}
						return [7];
					case 16:
						destination = this.plugins.filter(function(plugin) {
							return plugin.type === "destination";
						});
						this.loggerProvider.log("Timeline.apply: Final event before destinations, event: ".concat(JSON.stringify(event)));
						executeDestinations = destination.map(function(plugin) {
							var eventClone = __assign$1({}, event);
							return plugin.execute(eventClone).catch(function(e) {
								return buildResult(eventClone, 0, String(e));
							});
						});
						Promise.all(executeDestinations).then(function(_a) {
							var resolveResult = __read$1(_a, 1)[0] || buildResult(event, 100, "Event not tracked, no destination plugins on the instance");
							resolve(resolveResult);
						});
						return [2];
				}
			});
		});
	};
	Timeline.prototype.flush = function() {
		return __awaiter(this, void 0, void 0, function() {
			var queue, destination, executeDestinations;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						queue = this.queue;
						this.queue = [];
						return [4, Promise.all(queue.map(function(item) {
							return _this.apply(item);
						}))];
					case 1:
						_a.sent();
						destination = this.plugins.filter(function(plugin) {
							return plugin.type === "destination";
						});
						executeDestinations = destination.map(function(plugin) {
							return plugin.flush && plugin.flush();
						});
						return [4, Promise.all(executeDestinations)];
					case 2:
						_a.sent();
						return [2];
				}
			});
		});
	};
	Timeline.prototype.addOptOutListener = function(cb) {
		this._optOutListeners.push(cb);
	};
	Timeline.prototype._clearOptOutListeners = function() {
		this._optOutListeners = [];
	};
	Timeline.prototype.onIdentityChanged = function(identity) {
		this.plugins.forEach(function(plugin) {
			var _a;
			/* istanbul ignore next */
			(_a = plugin.onIdentityChanged) === null || _a === void 0 || _a.call(plugin, identity);
		});
	};
	Timeline.prototype.onSessionIdChanged = function(sessionId) {
		this.plugins.forEach(function(plugin) {
			var _a;
			/* istanbul ignore next */
			(_a = plugin.onSessionIdChanged) === null || _a === void 0 || _a.call(plugin, sessionId);
		});
	};
	Timeline.prototype.onOptOutChanged = function(optOut) {
		this.plugins.forEach(function(plugin) {
			var _a;
			/* istanbul ignore next */
			(_a = plugin.onOptOutChanged) === null || _a === void 0 || _a.call(plugin, optOut);
		});
		this._callOptOutListeners(optOut);
	};
	Timeline.prototype._callOptOutListeners = function(optOut) {
		return __awaiter(this, void 0, void 0, function() {
			var _a, _b, listener, e_3, e_4_1;
			var e_4, _c;
			return __generator(this, function(_d) {
				switch (_d.label) {
					case 0:
						_d.trys.push([
							0,
							7,
							8,
							9
						]);
						_a = __values$1(this._optOutListeners), _b = _a.next();
						_d.label = 1;
					case 1:
						if (!!_b.done) return [3, 6];
						listener = _b.value;
						_d.label = 2;
					case 2:
						_d.trys.push([
							2,
							4,
							,
							5
						]);
						return [4, listener(optOut)];
					case 3:
						_d.sent();
						return [3, 5];
					case 4:
						e_3 = _d.sent();
						/* istanbul ignore next */
						this.loggerProvider.error("Error calling optOut listener", e_3);
						return [3, 5];
					case 5:
						_b = _a.next();
						return [3, 1];
					case 6: return [3, 9];
					case 7:
						e_4_1 = _d.sent();
						e_4 = { error: e_4_1 };
						return [3, 9];
					case 8:
						try {
							if (_b && !_b.done && (_c = _a.return)) _c.call(_a);
						} finally {
							if (e_4) throw e_4.error;
						}
						return [7];
					case 9: return [2];
				}
			});
		});
	};
	Timeline.prototype.onReset = function() {
		this.plugins.forEach(function(plugin) {
			var _a;
			/* istanbul ignore next */
			(_a = plugin.onReset) === null || _a === void 0 || _a.call(plugin);
		});
	};
	return Timeline;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/event-builder.js
var createTrackEvent = function(eventInput, eventProperties, eventOptions) {
	return __assign$1(__assign$1(__assign$1({}, typeof eventInput === "string" ? { event_type: eventInput } : eventInput), eventOptions), eventProperties && { event_properties: eventProperties });
};
var createIdentifyEvent = function(identify, eventOptions) {
	return __assign$1(__assign$1({}, eventOptions), {
		event_type: SpecialEventType$1.IDENTIFY,
		user_properties: identify.getUserProperties()
	});
};
var createGroupIdentifyEvent = function(groupType, groupName, identify, eventOptions) {
	var _a;
	return __assign$1(__assign$1({}, eventOptions), {
		event_type: SpecialEventType$1.GROUP_IDENTIFY,
		group_properties: identify.getUserProperties(),
		groups: (_a = {}, _a[groupType] = groupName, _a)
	});
};
var createGroupEvent = function(groupType, groupName, eventOptions) {
	var _a;
	var identify = new Identify();
	identify.set(groupType, groupName);
	return __assign$1(__assign$1({}, eventOptions), {
		event_type: SpecialEventType$1.IDENTIFY,
		user_properties: identify.getUserProperties(),
		groups: (_a = {}, _a[groupType] = groupName, _a)
	});
};
var createRevenueEvent = function(revenue, eventOptions) {
	return __assign$1(__assign$1({}, eventOptions), {
		event_type: SpecialEventType$1.REVENUE,
		event_properties: revenue.getEventProperties()
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/return-wrapper.js
var returnWrapper = function(awaitable) {
	return { promise: awaitable || Promise.resolve() };
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/core-client.js
var AmplitudeCore = function() {
	function AmplitudeCore(name) {
		if (name === void 0) name = "$default";
		this.initializing = false;
		this.isReady = false;
		this.q = [];
		this.dispatchQ = [];
		this.logEvent = this.track.bind(this);
		this.timeline = new Timeline(this);
		this.name = name;
	}
	AmplitudeCore.prototype._init = function(config) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						this.config = config;
						this.timeline.reset(this);
						this.timeline.loggerProvider = this.config.loggerProvider;
						return [4, this.runQueuedFunctions("q")];
					case 1:
						_a.sent();
						this.isReady = true;
						return [2];
				}
			});
		});
	};
	AmplitudeCore.prototype.runQueuedFunctions = function(queueName) {
		return __awaiter(this, void 0, void 0, function() {
			var queuedFunctions, queuedFunctions_1, queuedFunctions_1_1, queuedFunction, val, e_1_1;
			var e_1, _a;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						queuedFunctions = this[queueName];
						this[queueName] = [];
						_b.label = 1;
					case 1:
						_b.trys.push([
							1,
							8,
							9,
							10
						]);
						queuedFunctions_1 = __values$1(queuedFunctions), queuedFunctions_1_1 = queuedFunctions_1.next();
						_b.label = 2;
					case 2:
						if (!!queuedFunctions_1_1.done) return [3, 7];
						queuedFunction = queuedFunctions_1_1.value;
						val = queuedFunction();
						if (!(val && "promise" in val)) return [3, 4];
						return [4, val.promise];
					case 3:
						_b.sent();
						return [3, 6];
					case 4: return [4, val];
					case 5:
						_b.sent();
						_b.label = 6;
					case 6:
						queuedFunctions_1_1 = queuedFunctions_1.next();
						return [3, 2];
					case 7: return [3, 10];
					case 8:
						e_1_1 = _b.sent();
						e_1 = { error: e_1_1 };
						return [3, 10];
					case 9:
						try {
							if (queuedFunctions_1_1 && !queuedFunctions_1_1.done && (_a = queuedFunctions_1.return)) _a.call(queuedFunctions_1);
						} finally {
							if (e_1) throw e_1.error;
						}
						return [7];
					case 10:
						if (!this[queueName].length) return [3, 12];
						return [4, this.runQueuedFunctions(queueName)];
					case 11:
						_b.sent();
						_b.label = 12;
					case 12: return [2];
				}
			});
		});
	};
	AmplitudeCore.prototype.track = function(eventInput, eventProperties, eventOptions) {
		var event = createTrackEvent(eventInput, eventProperties, eventOptions);
		this.userProperties = this.getOperationAppliedUserProperties(event.user_properties);
		return returnWrapper(this.dispatch(event));
	};
	AmplitudeCore.prototype.identify = function(identify, eventOptions) {
		var event = createIdentifyEvent(identify, eventOptions);
		this.userProperties = this.getOperationAppliedUserProperties(event.user_properties);
		return returnWrapper(this.dispatch(event));
	};
	AmplitudeCore.prototype.groupIdentify = function(groupType, groupName, identify, eventOptions) {
		var event = createGroupIdentifyEvent(groupType, groupName, identify, eventOptions);
		return returnWrapper(this.dispatch(event));
	};
	AmplitudeCore.prototype.setGroup = function(groupType, groupName, eventOptions) {
		var event = createGroupEvent(groupType, groupName, eventOptions);
		this.userProperties = this.getOperationAppliedUserProperties(event.user_properties);
		return returnWrapper(this.dispatch(event));
	};
	AmplitudeCore.prototype.revenue = function(revenue, eventOptions) {
		var event = createRevenueEvent(revenue, eventOptions);
		return returnWrapper(this.dispatch(event));
	};
	AmplitudeCore.prototype.add = function(plugin) {
		if (!this.isReady) {
			this.q.push(this._addPlugin.bind(this, plugin));
			return returnWrapper();
		}
		return this._addPlugin(plugin);
	};
	AmplitudeCore.prototype._addPlugin = function(plugin) {
		return returnWrapper(this.timeline.register(plugin, this.config));
	};
	AmplitudeCore.prototype.remove = function(pluginName) {
		if (!this.isReady) {
			this.q.push(this._removePlugin.bind(this, pluginName));
			return returnWrapper();
		}
		return this._removePlugin(pluginName);
	};
	AmplitudeCore.prototype._removePlugin = function(pluginName) {
		return returnWrapper(this.timeline.deregister(pluginName, this.config));
	};
	AmplitudeCore.prototype.dispatchWithCallback = function(event, callback) {
		if (!this.isReady) return callback(buildResult(event, 0, CLIENT_NOT_INITIALIZED));
		this.process(event).then(callback);
	};
	AmplitudeCore.prototype.dispatch = function(event) {
		return __awaiter(this, void 0, void 0, function() {
			var _this = this;
			return __generator(this, function(_a) {
				if (!this.isReady) return [2, new Promise(function(resolve) {
					_this.dispatchQ.push(_this.dispatchWithCallback.bind(_this, event, resolve));
				})];
				return [2, this.process(event)];
			});
		});
	};
	/**
	*
	* This method applies identify operations to user properties and
	* returns a single object representing the final user property state.
	*
	* This is a best-effort api that only supports $set, $clearAll, and $unset.
	* Other operations are not supported and are ignored.
	*
	* Operations are applied on top of current client state (this.userProperties).
	*
	* @param userProperties The new user properties object from identify() or setIdentity().
	* @returns A key-value object user properties without operations.
	*
	* @example
	* Input:
	* {
	*   $set: { plan: 'premium' },
	*   custom_flag: true
	* }
	*
	* Output:
	* {
	*   plan: 'premium',
	*   custom_flag: true
	* }
	*/
	AmplitudeCore.prototype.getOperationAppliedUserProperties = function(userProperties) {
		var _a;
		var updatedProperties = __assign$1({}, (_a = this.userProperties) !== null && _a !== void 0 ? _a : {});
		if (userProperties === void 0) return updatedProperties;
		var nonOpProperties = {};
		Object.keys(userProperties).forEach(function(key) {
			if (!Object.values(IdentifyOperation$2).includes(key)) nonOpProperties[key] = userProperties[key];
		});
		OrderedIdentifyOperations.forEach(function(operation) {
			if (!Object.keys(userProperties).includes(operation)) return;
			var opProperties = userProperties[operation];
			switch (operation) {
				case IdentifyOperation$2.CLEAR_ALL:
					/* istanbul ignore next */
					Object.keys(updatedProperties).forEach(function(prop) {
						delete updatedProperties[prop];
					});
					break;
				case IdentifyOperation$2.UNSET:
					Object.keys(opProperties).forEach(function(prop) {
						delete updatedProperties[prop];
					});
					break;
				case IdentifyOperation$2.SET:
					Object.assign(updatedProperties, opProperties);
					break;
			}
		});
		Object.assign(updatedProperties, nonOpProperties);
		return updatedProperties;
	};
	AmplitudeCore.prototype.process = function(event) {
		return __awaiter(this, void 0, void 0, function() {
			var result, e_2, message, result;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						if (this.config.optOut) return [2, buildResult(event, 0, OPT_OUT_MESSAGE)];
						if (event.event_type === SpecialEventType$1.IDENTIFY) this.timeline.onIdentityChanged({ userProperties: this.userProperties });
						return [4, this.timeline.push(event)];
					case 1:
						result = _a.sent();
						result.code === 200 ? this.config.loggerProvider.log(result.message) : result.code === 100 ? this.config.loggerProvider.warn(result.message) : this.config.loggerProvider.error(result.message);
						return [2, result];
					case 2:
						e_2 = _a.sent();
						message = String(e_2);
						this.config.loggerProvider.error(message);
						result = buildResult(event, 0, message);
						return [2, result];
					case 3: return [2];
				}
			});
		});
	};
	AmplitudeCore.prototype.setOptOut = function(optOut) {
		if (!this.isReady) {
			this.q.push(this._setOptOut.bind(this, Boolean(optOut)));
			return;
		}
		this._setOptOut(optOut);
	};
	AmplitudeCore.prototype._setOptOut = function(optOut) {
		if (this.config.optOut !== optOut) {
			this.config.optOut = Boolean(optOut);
			this.timeline.onOptOutChanged(optOut);
		}
	};
	AmplitudeCore.prototype.flush = function() {
		return returnWrapper(this.timeline.flush());
	};
	AmplitudeCore.prototype.plugin = function(name) {
		var plugin = this.timeline.plugins.find(function(plugin) {
			return plugin.name === name;
		});
		if (plugin === void 0) {
			this.config.loggerProvider.debug("Cannot find plugin with name ".concat(name));
			return;
		}
		return plugin;
	};
	AmplitudeCore.prototype.plugins = function(pluginClass) {
		return this.timeline.plugins.filter(function(plugin) {
			return plugin instanceof pluginClass;
		});
	};
	return AmplitudeCore;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/revenue.js
var Revenue = function() {
	function Revenue() {
		this.productId = "";
		this.quantity = 1;
		this.price = 0;
	}
	Revenue.prototype.setProductId = function(productId) {
		this.productId = productId;
		return this;
	};
	Revenue.prototype.setQuantity = function(quantity) {
		if (quantity > 0) this.quantity = quantity;
		return this;
	};
	Revenue.prototype.setPrice = function(price) {
		this.price = price;
		return this;
	};
	Revenue.prototype.setRevenueType = function(revenueType) {
		this.revenueType = revenueType;
		return this;
	};
	Revenue.prototype.setCurrency = function(currency) {
		this.currency = currency;
		return this;
	};
	Revenue.prototype.setRevenue = function(revenue) {
		this.revenue = revenue;
		return this;
	};
	Revenue.prototype.setReceipt = function(receipt) {
		this.receipt = receipt;
		return this;
	};
	Revenue.prototype.setReceiptSig = function(receiptSig) {
		this.receiptSig = receiptSig;
		return this;
	};
	Revenue.prototype.setEventProperties = function(properties) {
		try {
			var filtered = JSON.parse(JSON.stringify(properties));
			if (isValidObject(filtered)) this.properties = filtered;
		} catch (_a) {}
		return this;
	};
	Revenue.prototype.getEventProperties = function() {
		var eventProperties = this.properties ? __assign$1({}, this.properties) : {};
		eventProperties[RevenueProperty.REVENUE_PRODUCT_ID] = this.productId;
		eventProperties[RevenueProperty.REVENUE_QUANTITY] = this.quantity;
		eventProperties[RevenueProperty.REVENUE_PRICE] = this.price;
		eventProperties[RevenueProperty.REVENUE_TYPE] = this.revenueType;
		eventProperties[RevenueProperty.REVENUE_CURRENCY] = this.currency;
		eventProperties[RevenueProperty.REVENUE] = this.revenue;
		eventProperties[RevenueProperty.RECEIPT] = this.receipt;
		eventProperties[RevenueProperty.RECEIPT_SIG] = this.receiptSig;
		return eventProperties;
	};
	return Revenue;
}();
var RevenueProperty;
(function(RevenueProperty) {
	RevenueProperty["REVENUE_PRODUCT_ID"] = "$productId";
	RevenueProperty["REVENUE_QUANTITY"] = "$quantity";
	RevenueProperty["REVENUE_PRICE"] = "$price";
	RevenueProperty["REVENUE_TYPE"] = "$revenueType";
	RevenueProperty["REVENUE_CURRENCY"] = "$currency";
	RevenueProperty["REVENUE"] = "$revenue";
	RevenueProperty["RECEIPT"] = "$receipt";
	RevenueProperty["RECEIPT_SIG"] = "$receiptSig";
})(RevenueProperty || (RevenueProperty = {}));
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/chunk.js
var chunk = function(arr, size) {
	var chunkSize = Math.max(size, 1);
	return arr.reduce(function(chunks, element, index) {
		var chunkIndex = Math.floor(index / chunkSize);
		if (!chunks[chunkIndex]) chunks[chunkIndex] = [];
		chunks[chunkIndex].push(element);
		return chunks;
	}, []);
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/types/loglevel.js
var LogLevel;
(function(LogLevel) {
	LogLevel[LogLevel["None"] = 0] = "None";
	LogLevel[LogLevel["Error"] = 1] = "Error";
	LogLevel[LogLevel["Warn"] = 2] = "Warn";
	LogLevel[LogLevel["Verbose"] = 3] = "Verbose";
	LogLevel[LogLevel["Debug"] = 4] = "Debug";
})(LogLevel || (LogLevel = {}));
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/logger.js
var PREFIX = "Amplitude Logger ";
var Logger = function() {
	function Logger() {
		this.logLevel = LogLevel.None;
	}
	Logger.prototype.disable = function() {
		this.logLevel = LogLevel.None;
	};
	Logger.prototype.enable = function(logLevel) {
		if (logLevel === void 0) logLevel = LogLevel.Warn;
		this.logLevel = logLevel;
	};
	Logger.prototype.log = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		if (this.logLevel < LogLevel.Verbose) return;
		console.log("".concat(PREFIX, "[Log]: ").concat(args.join(" ")));
	};
	Logger.prototype.warn = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		if (this.logLevel < LogLevel.Warn) return;
		console.warn("".concat(PREFIX, "[Warn]: ").concat(args.join(" ")));
	};
	Logger.prototype.error = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		if (this.logLevel < LogLevel.Error) return;
		console.error("".concat(PREFIX, "[Error]: ").concat(args.join(" ")));
	};
	Logger.prototype.debug = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		if (this.logLevel < LogLevel.Debug) return;
		console.log("".concat(PREFIX, "[Debug]: ").concat(args.join(" ")));
	};
	return Logger;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/config.js
var getDefaultConfig = function() {
	return {
		flushMaxRetries: 12,
		flushQueueSize: 200,
		flushIntervalMillis: 1e4,
		instanceName: DEFAULT_INSTANCE_NAME,
		logLevel: LogLevel.Warn,
		loggerProvider: new Logger(),
		offline: false,
		optOut: false,
		serverUrl: AMPLITUDE_SERVER_URL,
		serverZone: "US",
		useBatch: false
	};
};
var Config = function() {
	function Config(options) {
		var _a, _b, _c, _d;
		this._optOut = false;
		var defaultConfig = getDefaultConfig();
		this.apiKey = options.apiKey;
		this.flushIntervalMillis = (_a = options.flushIntervalMillis) !== null && _a !== void 0 ? _a : defaultConfig.flushIntervalMillis;
		this.flushMaxRetries = options.flushMaxRetries || defaultConfig.flushMaxRetries;
		this.flushQueueSize = options.flushQueueSize || defaultConfig.flushQueueSize;
		this.instanceName = options.instanceName || defaultConfig.instanceName;
		this.loggerProvider = options.loggerProvider || defaultConfig.loggerProvider;
		this.logLevel = (_b = options.logLevel) !== null && _b !== void 0 ? _b : defaultConfig.logLevel;
		this.minIdLength = options.minIdLength;
		this.plan = options.plan;
		this.ingestionMetadata = options.ingestionMetadata;
		this.offline = options.offline !== void 0 ? options.offline : defaultConfig.offline;
		this.optOut = (_c = options.optOut) !== null && _c !== void 0 ? _c : defaultConfig.optOut;
		this.serverUrl = options.serverUrl;
		this.serverZone = options.serverZone || defaultConfig.serverZone;
		this.storageProvider = options.storageProvider;
		this.transportProvider = options.transportProvider;
		this.useBatch = (_d = options.useBatch) !== null && _d !== void 0 ? _d : defaultConfig.useBatch;
		this.loggerProvider.enable(this.logLevel);
		var serverConfig = createServerConfig(options.serverUrl, options.serverZone, options.useBatch);
		this.serverZone = serverConfig.serverZone;
		this.serverUrl = serverConfig.serverUrl;
	}
	Object.defineProperty(Config.prototype, "optOut", {
		get: function() {
			return this._optOut;
		},
		set: function(optOut) {
			this._optOut = optOut;
		},
		enumerable: false,
		configurable: true
	});
	return Config;
}();
var getServerUrl = function(serverZone, useBatch) {
	if (serverZone === "EU") return useBatch ? EU_AMPLITUDE_BATCH_SERVER_URL : EU_AMPLITUDE_SERVER_URL;
	return useBatch ? AMPLITUDE_BATCH_SERVER_URL : AMPLITUDE_SERVER_URL;
};
var createServerConfig = function(serverUrl, serverZone, useBatch) {
	if (serverUrl === void 0) serverUrl = "";
	if (serverZone === void 0) serverZone = getDefaultConfig().serverZone;
	if (useBatch === void 0) useBatch = getDefaultConfig().useBatch;
	if (serverUrl) return {
		serverUrl,
		serverZone: void 0
	};
	var _serverZone = ["US", "EU"].includes(serverZone) ? serverZone : getDefaultConfig().serverZone;
	return {
		serverZone: _serverZone,
		serverUrl: getServerUrl(_serverZone, useBatch)
	};
};
var RequestMetadata = function() {
	function RequestMetadata() {
		this.sdk = { metrics: { histogram: {} } };
	}
	RequestMetadata.prototype.recordHistogram = function(key, value) {
		this.sdk.metrics.histogram[key] = value;
	};
	return RequestMetadata;
}();
(function() {
	function HistogramOptions() {}
	return HistogramOptions;
})();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/status-code.js
/**
* Checks if an HTTP status code indicates success (2xx range)
* @param code - The HTTP status code to check
* @returns true if the status code is in the 2xx range, false otherwise
*/
function isSuccessStatusCode(code) {
	return code >= 200 && code < 300;
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/debug.js
var getStacktrace = function(ignoreDepth) {
	if (ignoreDepth === void 0) ignoreDepth = 0;
	return ((/* @__PURE__ */ new Error()).stack || "").split("\n").slice(2 + ignoreDepth).map(function(text) {
		return text.trim();
	});
};
var getClientLogConfig = function(client) {
	return function() {
		var _a = __assign$1({}, client.config);
		return {
			logger: _a.loggerProvider,
			logLevel: _a.logLevel
		};
	};
};
var getValueByStringPath = function(obj, path) {
	var e_1, _a;
	path = path.replace(/\[(\w+)\]/g, ".$1");
	path = path.replace(/^\./, "");
	try {
		for (var _b = __values$1(path.split(".")), _c = _b.next(); !_c.done; _c = _b.next()) {
			var attr = _c.value;
			if (attr in obj) obj = obj[attr];
			else return;
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	return obj;
};
var getClientStates = function(client, paths) {
	return function() {
		var e_2, _a;
		var res = {};
		try {
			for (var paths_1 = __values$1(paths), paths_1_1 = paths_1.next(); !paths_1_1.done; paths_1_1 = paths_1.next()) {
				var path = paths_1_1.value;
				res[path] = getValueByStringPath(client, path);
			}
		} catch (e_2_1) {
			e_2 = { error: e_2_1 };
		} finally {
			try {
				if (paths_1_1 && !paths_1_1.done && (_a = paths_1.return)) _a.call(paths_1);
			} finally {
				if (e_2) throw e_2.error;
			}
		}
		return res;
	};
};
var debugWrapper = function(fn, fnName, getLogConfig, getStates, fnContext) {
	if (fnContext === void 0) fnContext = null;
	return function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		var _a = getLogConfig(), logger = _a.logger, logLevel = _a.logLevel;
		if (logLevel && logLevel < LogLevel.Debug || !logLevel || !logger) return fn.apply(fnContext, args);
		var debugContext = {
			type: "invoke public method",
			name: fnName,
			args,
			stacktrace: getStacktrace(1),
			time: { start: (/* @__PURE__ */ new Date()).toISOString() },
			states: {}
		};
		if (getStates && debugContext.states) debugContext.states.before = getStates();
		var result = fn.apply(fnContext, args);
		if (result && result.promise) result.promise.then(function() {
			if (getStates && debugContext.states) debugContext.states.after = getStates();
			if (debugContext.time) debugContext.time.end = (/* @__PURE__ */ new Date()).toISOString();
			logger.debug(JSON.stringify(debugContext, null, 2));
		});
		else {
			if (getStates && debugContext.states) debugContext.states.after = getStates();
			if (debugContext.time) debugContext.time.end = (/* @__PURE__ */ new Date()).toISOString();
			logger.debug(JSON.stringify(debugContext, null, 2));
		}
		return result;
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/plugins/destination.js
var DEFAULT_AMPLITUDE_SERVER_URLS = new Set([
	AMPLITUDE_SERVER_URL,
	EU_AMPLITUDE_SERVER_URL,
	AMPLITUDE_BATCH_SERVER_URL,
	EU_AMPLITUDE_BATCH_SERVER_URL
]);
var shouldCompressUploadBodyForRequest = function(serverUrl, enableRequestBodyCompression) {
	if (enableRequestBodyCompression === void 0) enableRequestBodyCompression = false;
	if (DEFAULT_AMPLITUDE_SERVER_URLS.has(serverUrl)) return true;
	return enableRequestBodyCompression;
};
function getErrorMessage(error) {
	if (error instanceof Error) return error.message;
	return String(error);
}
function getResponseBodyString(res) {
	var responseBodyString = "";
	try {
		if ("body" in res) responseBodyString = JSON.stringify(res.body, null, 2);
	} catch (_a) {}
	return responseBodyString;
}
var Destination = function() {
	function Destination(context) {
		this.name = "amplitude";
		this.type = "destination";
		this.retryTimeout = 1e3;
		this.throttleTimeout = 3e4;
		this.storageKey = "";
		this.scheduleId = null;
		this.scheduledTimeout = 0;
		this.flushId = null;
		this.queue = [];
		this.diagnosticsClient = context === null || context === void 0 ? void 0 : context.diagnosticsClient;
	}
	Destination.prototype.setup = function(config) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			var unsent;
			var _this = this;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						this.config = config;
						this.storageKey = "".concat(STORAGE_PREFIX$1, "_").concat(this.config.apiKey.substring(0, 10));
						return [4, (_a = this.config.storageProvider) === null || _a === void 0 ? void 0 : _a.get(this.storageKey)];
					case 1:
						unsent = _b.sent();
						if (unsent && unsent.length > 0) Promise.all(unsent.map(function(event) {
							return _this.execute(event);
						})).catch();
						return [2, Promise.resolve(void 0)];
				}
			});
		});
	};
	Destination.prototype.execute = function(event) {
		var _this = this;
		if (!event.insert_id) event.insert_id = UUID$1();
		return new Promise(function(resolve) {
			var context = {
				event,
				attempts: 0,
				callback: function(result) {
					return resolve(result);
				},
				timeout: 0
			};
			_this.queue.push(context);
			_this.schedule(_this.config.flushIntervalMillis);
			_this.saveEvents();
		});
	};
	Destination.prototype.removeEventsExceedFlushMaxRetries = function(list) {
		var _this = this;
		return list.filter(function(context) {
			context.attempts += 1;
			if (context.attempts < _this.config.flushMaxRetries) return true;
			_this.fulfillRequest([context], 500, MAX_RETRIES_EXCEEDED_MESSAGE);
			return false;
		});
	};
	Destination.prototype.scheduleEvents = function(list) {
		var _this = this;
		list.forEach(function(context) {
			_this.schedule(context.timeout === 0 ? _this.config.flushIntervalMillis : context.timeout);
		});
	};
	Destination.prototype.schedule = function(timeout) {
		var _this = this;
		if (this.config.offline) return;
		if (this.scheduleId === null || this.scheduleId && timeout > this.scheduledTimeout) {
			if (this.scheduleId) clearTimeout(this.scheduleId);
			this.scheduledTimeout = timeout;
			this.scheduleId = setTimeout(function() {
				_this.queue = _this.queue.map(function(context) {
					context.timeout = 0;
					return context;
				});
				_this.flush(true);
			}, timeout);
			return;
		}
	};
	Destination.prototype.resetSchedule = function() {
		this.scheduleId = null;
		this.scheduledTimeout = 0;
	};
	Destination.prototype.flush = function(useRetry) {
		if (useRetry === void 0) useRetry = false;
		return __awaiter(this, void 0, void 0, function() {
			var list, later, batches;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (this.config.offline) {
							this.resetSchedule();
							this.config.loggerProvider.debug("Skipping flush while offline.");
							return [2];
						}
						if (this.flushId) {
							this.resetSchedule();
							this.config.loggerProvider.debug("Skipping flush because previous flush has not resolved.");
							return [2];
						}
						this.flushId = this.scheduleId;
						this.resetSchedule();
						list = [];
						later = [];
						this.queue.forEach(function(context) {
							return context.timeout === 0 ? list.push(context) : later.push(context);
						});
						batches = chunk(list, this.config.flushQueueSize);
						return [4, batches.reduce(function(promise, batch) {
							return __awaiter(_this, void 0, void 0, function() {
								return __generator(this, function(_a) {
									switch (_a.label) {
										case 0: return [4, promise];
										case 1:
											_a.sent();
											return [4, this.send(batch, useRetry)];
										case 2: return [2, _a.sent()];
									}
								});
							});
						}, Promise.resolve())];
					case 1:
						_a.sent();
						this.flushId = null;
						this.scheduleEvents(this.queue);
						return [2];
				}
			});
		});
	};
	Destination.prototype.send = function(list, useRetry) {
		var _a;
		if (useRetry === void 0) useRetry = true;
		return __awaiter(this, void 0, void 0, function() {
			var payload, serverUrl, shouldCompressUploadBody, res, e_1, errorMessage;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						if (!this.config.apiKey) return [2, this.fulfillRequest(list, 400, MISSING_API_KEY_MESSAGE)];
						payload = {
							api_key: this.config.apiKey,
							events: list.map(function(context) {
								var _a = context.event;
								_a.extra;
								return __rest(_a, ["extra"]);
							}),
							options: { min_id_length: this.config.minIdLength },
							client_upload_time: (/* @__PURE__ */ new Date()).toISOString(),
							request_metadata: this.config.requestMetadata
						};
						this.config.requestMetadata = new RequestMetadata();
						_b.label = 1;
					case 1:
						_b.trys.push([
							1,
							3,
							,
							4
						]);
						serverUrl = createServerConfig(this.config.serverUrl, this.config.serverZone, this.config.useBatch).serverUrl;
						shouldCompressUploadBody = shouldCompressUploadBodyForRequest(serverUrl, this.config.enableRequestBodyCompression);
						return [4, this.config.transportProvider.send(serverUrl, payload, shouldCompressUploadBody)];
					case 2:
						res = _b.sent();
						if (res === null) {
							this.fulfillRequest(list, 0, UNEXPECTED_ERROR_MESSAGE);
							return [2];
						}
						if (!useRetry) {
							if ("body" in res) this.fulfillRequest(list, res.statusCode, "".concat(res.status, ": ").concat(getResponseBodyString(res)));
							else this.fulfillRequest(list, res.statusCode, res.status);
							return [2];
						}
						this.handleResponse(res, list);
						return [3, 4];
					case 3:
						e_1 = _b.sent();
						errorMessage = getErrorMessage(e_1);
						this.config.loggerProvider.error(errorMessage);
						(_a = this.diagnosticsClient) === null || _a === void 0 || _a.recordEvent("analytics.events.unsuccessful.from.catch.error", {
							events: list.map(function(context) {
								return context.event.event_type;
							}),
							message: errorMessage,
							stack_trace: getStacktrace()
						});
						this.handleResponse({
							status: Status.Failed,
							statusCode: 0
						}, list);
						return [3, 4];
					case 4: return [2];
				}
			});
		});
	};
	Destination.prototype.handleResponse = function(res, list) {
		var _a;
		if (!isSuccessStatusCode(res.statusCode)) (_a = this.diagnosticsClient) === null || _a === void 0 || _a.recordEvent("analytics.events.unsuccessful", {
			events: list.map(function(context) {
				return context.event.event_type;
			}),
			code: res.statusCode,
			status: res.status,
			body: getResponseBodyString(res),
			stack_trace: getStacktrace()
		});
		var status = res.status;
		switch (status) {
			case Status.Success:
				this.handleSuccessResponse(res, list);
				break;
			case Status.Invalid:
				this.handleInvalidResponse(res, list);
				break;
			case Status.PayloadTooLarge:
				this.handlePayloadTooLargeResponse(res, list);
				break;
			case Status.RateLimit:
				this.handleRateLimitResponse(res, list);
				break;
			default:
				this.config.loggerProvider.warn("{code: 0, error: \"Status '".concat(status, "' provided for ").concat(list.length, " events\"}"));
				this.handleOtherResponse(list);
				break;
		}
	};
	Destination.prototype.handleSuccessResponse = function(res, list) {
		this.fulfillRequest(list, res.statusCode, SUCCESS_MESSAGE);
	};
	Destination.prototype.handleInvalidResponse = function(res, list) {
		var _this = this;
		if (res.body.missingField || res.body.error.startsWith("Invalid API key")) {
			this.fulfillRequest(list, res.statusCode, res.body.error);
			return;
		}
		var dropIndex = __spreadArray(__spreadArray(__spreadArray(__spreadArray([], __read$1(Object.values(res.body.eventsWithInvalidFields)), false), __read$1(Object.values(res.body.eventsWithMissingFields)), false), __read$1(Object.values(res.body.eventsWithInvalidIdLengths)), false), __read$1(res.body.silencedEvents), false).flat();
		var dropIndexSet = new Set(dropIndex);
		var retry = list.filter(function(context, index) {
			if (dropIndexSet.has(index)) {
				_this.fulfillRequest([context], res.statusCode, res.body.error);
				return;
			}
			return true;
		});
		if (retry.length > 0) this.config.loggerProvider.warn(getResponseBodyString(res));
		var tryable = this.removeEventsExceedFlushMaxRetries(retry);
		this.scheduleEvents(tryable);
	};
	Destination.prototype.handlePayloadTooLargeResponse = function(res, list) {
		if (list.length === 1) {
			this.fulfillRequest(list, res.statusCode, res.body.error);
			return;
		}
		this.config.loggerProvider.warn(getResponseBodyString(res));
		this.config.flushQueueSize /= 2;
		var tryable = this.removeEventsExceedFlushMaxRetries(list);
		this.scheduleEvents(tryable);
	};
	Destination.prototype.handleRateLimitResponse = function(res, list) {
		var _this = this;
		var dropUserIds = Object.keys(res.body.exceededDailyQuotaUsers);
		var dropDeviceIds = Object.keys(res.body.exceededDailyQuotaDevices);
		var throttledIndex = res.body.throttledEvents;
		var dropUserIdsSet = new Set(dropUserIds);
		var dropDeviceIdsSet = new Set(dropDeviceIds);
		var throttledIndexSet = new Set(throttledIndex);
		var retry = list.filter(function(context, index) {
			if (context.event.user_id && dropUserIdsSet.has(context.event.user_id) || context.event.device_id && dropDeviceIdsSet.has(context.event.device_id)) {
				_this.fulfillRequest([context], res.statusCode, res.body.error);
				return;
			}
			if (throttledIndexSet.has(index)) context.timeout = _this.throttleTimeout;
			return true;
		});
		if (retry.length > 0) this.config.loggerProvider.warn(getResponseBodyString(res));
		var tryable = this.removeEventsExceedFlushMaxRetries(retry);
		this.scheduleEvents(tryable);
	};
	Destination.prototype.handleOtherResponse = function(list) {
		var _this = this;
		var later = list.map(function(context) {
			context.timeout = context.attempts * _this.retryTimeout;
			return context;
		});
		var tryable = this.removeEventsExceedFlushMaxRetries(later);
		this.scheduleEvents(tryable);
	};
	Destination.prototype.fulfillRequest = function(list, code, message) {
		var _a, _b, _c;
		if (!isSuccessStatusCode(code)) {
			(_a = this.diagnosticsClient) === null || _a === void 0 || _a.increment("analytics.events.dropped", list.length);
			(_b = this.diagnosticsClient) === null || _b === void 0 || _b.recordEvent("analytics.events.dropped", {
				events: list.map(function(context) {
					return context.event.event_type;
				}),
				code,
				message,
				stack_trace: getStacktrace()
			});
		} else (_c = this.diagnosticsClient) === null || _c === void 0 || _c.increment("analytics.events.sent", list.length);
		this.removeEvents(list);
		list.forEach(function(context) {
			return context.callback(buildResult(context.event, code, message));
		});
	};
	/**
	* This is called on
	* 1) new events are added to queue; or
	* 2) response comes back for a request
	*
	* Update the event storage based on the queue
	*/
	Destination.prototype.saveEvents = function() {
		if (!this.config.storageProvider) return;
		var updatedEvents = this.queue.map(function(context) {
			return context.event;
		});
		this.config.storageProvider.set(this.storageKey, updatedEvents);
	};
	/**
	* This is called on response comes back for a request
	*/
	Destination.prototype.removeEvents = function(eventsToRemove) {
		this.queue = this.queue.filter(function(queuedContext) {
			return !eventsToRemove.some(function(context) {
				return context.event.insert_id === queuedContext.event.insert_id;
			});
		});
		this.saveEvents();
	};
	return Destination;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-connector@1.6.4/node_modules/@amplitude/analytics-connector/dist/analytics-connector.esm.js
var ApplicationContextProviderImpl = function() {
	function ApplicationContextProviderImpl() {}
	ApplicationContextProviderImpl.prototype.getApplicationContext = function() {
		return {
			versionName: this.versionName,
			language: getLanguage$1(),
			platform: "Web",
			os: void 0,
			deviceModel: void 0
		};
	};
	return ApplicationContextProviderImpl;
}();
var getLanguage$1 = function() {
	return typeof navigator !== "undefined" && (navigator.languages && navigator.languages[0] || navigator.language) || "";
};
var EventBridgeImpl = function() {
	function EventBridgeImpl() {
		this.queue = [];
	}
	EventBridgeImpl.prototype.logEvent = function(event) {
		if (!this.receiver) {
			if (this.queue.length < 512) this.queue.push(event);
		} else this.receiver(event);
	};
	EventBridgeImpl.prototype.setEventReceiver = function(receiver) {
		this.receiver = receiver;
		if (this.queue.length > 0) {
			this.queue.forEach(function(event) {
				receiver(event);
			});
			this.queue = [];
		}
	};
	return EventBridgeImpl;
}();
/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
var __assign = function() {
	__assign = Object.assign || function __assign(t) {
		for (var s, i = 1, n = arguments.length; i < n; i++) {
			s = arguments[i];
			for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
		}
		return t;
	};
	return __assign.apply(this, arguments);
};
function __values(o) {
	var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
	if (m) return m.call(o);
	if (o && typeof o.length === "number") return { next: function() {
		if (o && i >= o.length) o = void 0;
		return {
			value: o && o[i++],
			done: !o
		};
	} };
	throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
}
function __read(o, n) {
	var m = typeof Symbol === "function" && o[Symbol.iterator];
	if (!m) return o;
	var i = m.call(o), r, ar = [], e;
	try {
		while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
	} catch (error) {
		e = { error };
	} finally {
		try {
			if (r && !r.done && (m = i["return"])) m.call(i);
		} finally {
			if (e) throw e.error;
		}
	}
	return ar;
}
var isEqual = function(obj1, obj2) {
	var e_1, _a;
	var primitive = [
		"string",
		"number",
		"boolean",
		"undefined"
	];
	var typeA = typeof obj1;
	if (typeA !== typeof obj2) return false;
	try {
		for (var primitive_1 = __values(primitive), primitive_1_1 = primitive_1.next(); !primitive_1_1.done; primitive_1_1 = primitive_1.next()) if (primitive_1_1.value === typeA) return obj1 === obj2;
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (primitive_1_1 && !primitive_1_1.done && (_a = primitive_1.return)) _a.call(primitive_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	if (obj1 == null && obj2 == null) return true;
	else if (obj1 == null || obj2 == null) return false;
	if (obj1.length !== obj2.length) return false;
	var isArrayA = Array.isArray(obj1);
	var isArrayB = Array.isArray(obj2);
	if (isArrayA !== isArrayB) return false;
	if (isArrayA && isArrayB) {
		for (var i = 0; i < obj1.length; i++) if (!isEqual(obj1[i], obj2[i])) return false;
	} else {
		if (!isEqual(Object.keys(obj1).sort(), Object.keys(obj2).sort())) return false;
		var result_1 = true;
		Object.keys(obj1).forEach(function(key) {
			if (!isEqual(obj1[key], obj2[key])) result_1 = false;
		});
		return result_1;
	}
	return true;
};
var ID_OP_SET = "$set";
var ID_OP_UNSET = "$unset";
var ID_OP_CLEAR_ALL = "$clearAll";
if (!Object.entries) Object.entries = function(obj) {
	var ownProps = Object.keys(obj);
	var i = ownProps.length;
	var resArray = new Array(i);
	while (i--) resArray[i] = [ownProps[i], obj[ownProps[i]]];
	return resArray;
};
var IdentityStoreImpl = function() {
	function IdentityStoreImpl() {
		this.identity = { userProperties: {} };
		this.listeners = /* @__PURE__ */ new Set();
	}
	IdentityStoreImpl.prototype.editIdentity = function() {
		var self = this;
		var actingUserProperties = __assign({}, this.identity.userProperties);
		var actingIdentity = __assign(__assign({}, this.identity), { userProperties: actingUserProperties });
		return {
			setUserId: function(userId) {
				actingIdentity.userId = userId;
				return this;
			},
			setDeviceId: function(deviceId) {
				actingIdentity.deviceId = deviceId;
				return this;
			},
			setUserProperties: function(userProperties) {
				actingIdentity.userProperties = userProperties;
				return this;
			},
			setOptOut: function(optOut) {
				actingIdentity.optOut = optOut;
				return this;
			},
			updateUserProperties: function(actions) {
				var e_1, _a, e_2, _b, e_3, _c;
				var actingProperties = actingIdentity.userProperties || {};
				try {
					for (var _d = __values(Object.entries(actions)), _e = _d.next(); !_e.done; _e = _d.next()) {
						var _f = __read(_e.value, 2), action = _f[0], properties = _f[1];
						switch (action) {
							case ID_OP_SET:
								try {
									for (var _g = (e_2 = void 0, __values(Object.entries(properties))), _h = _g.next(); !_h.done; _h = _g.next()) {
										var _j = __read(_h.value, 2), key = _j[0], value = _j[1];
										actingProperties[key] = value;
									}
								} catch (e_2_1) {
									e_2 = { error: e_2_1 };
								} finally {
									try {
										if (_h && !_h.done && (_b = _g.return)) _b.call(_g);
									} finally {
										if (e_2) throw e_2.error;
									}
								}
								break;
							case ID_OP_UNSET:
								try {
									for (var _k = (e_3 = void 0, __values(Object.keys(properties))), _l = _k.next(); !_l.done; _l = _k.next()) {
										var key = _l.value;
										delete actingProperties[key];
									}
								} catch (e_3_1) {
									e_3 = { error: e_3_1 };
								} finally {
									try {
										if (_l && !_l.done && (_c = _k.return)) _c.call(_k);
									} finally {
										if (e_3) throw e_3.error;
									}
								}
								break;
							case ID_OP_CLEAR_ALL:
								actingProperties = {};
								break;
						}
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				actingIdentity.userProperties = actingProperties;
				return this;
			},
			commit: function() {
				self.setIdentity(actingIdentity);
				return this;
			}
		};
	};
	IdentityStoreImpl.prototype.getIdentity = function() {
		return __assign({}, this.identity);
	};
	IdentityStoreImpl.prototype.setIdentity = function(identity) {
		var originalIdentity = __assign({}, this.identity);
		this.identity = __assign({}, identity);
		if (!isEqual(originalIdentity, this.identity)) this.listeners.forEach(function(listener) {
			listener(identity);
		});
	};
	IdentityStoreImpl.prototype.addIdentityListener = function(listener) {
		this.listeners.add(listener);
	};
	IdentityStoreImpl.prototype.removeIdentityListener = function(listener) {
		this.listeners.delete(listener);
	};
	return IdentityStoreImpl;
}();
var safeGlobal = typeof globalThis !== "undefined" ? globalThis : typeof global !== "undefined" ? global : self;
var AnalyticsConnector = function() {
	function AnalyticsConnector() {
		this.identityStore = new IdentityStoreImpl();
		this.eventBridge = new EventBridgeImpl();
		this.applicationContextProvider = new ApplicationContextProviderImpl();
	}
	AnalyticsConnector.getInstance = function(instanceName) {
		if (!safeGlobal["analyticsConnectorInstances"]) safeGlobal["analyticsConnectorInstances"] = {};
		if (!safeGlobal["analyticsConnectorInstances"][instanceName]) safeGlobal["analyticsConnectorInstances"][instanceName] = new AnalyticsConnector();
		return safeGlobal["analyticsConnectorInstances"][instanceName];
	};
	return AnalyticsConnector;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/analytics-connector.js
var getAnalyticsConnector = function(instanceName) {
	if (instanceName === void 0) instanceName = DEFAULT_INSTANCE_NAME;
	return AnalyticsConnector.getInstance(instanceName);
};
var setConnectorUserId = function(userId, instanceName) {
	getAnalyticsConnector(instanceName).identityStore.editIdentity().setUserId(userId).commit();
};
var setConnectorDeviceId = function(deviceId, instanceName) {
	getAnalyticsConnector(instanceName).identityStore.editIdentity().setDeviceId(deviceId).commit();
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/plugins/identity.js
var IdentityEventSender = function() {
	function IdentityEventSender() {
		this.name = "identity";
		this.type = "before";
		this.identityStore = getAnalyticsConnector().identityStore;
	}
	IdentityEventSender.prototype.execute = function(context) {
		return __awaiter(this, void 0, void 0, function() {
			var userProperties;
			return __generator(this, function(_a) {
				userProperties = context.user_properties;
				if (userProperties) this.identityStore.editIdentity().updateUserProperties(userProperties).commit();
				return [2, context];
			});
		});
	};
	IdentityEventSender.prototype.setup = function(config) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				if (config.instanceName) this.identityStore = getAnalyticsConnector(config.instanceName).identityStore;
				return [2];
			});
		});
	};
	return IdentityEventSender;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/session.js
var isNewSession = function(sessionTimeout, lastEventTime) {
	if (lastEventTime === void 0) lastEventTime = Date.now();
	return Date.now() - lastEventTime > sessionTimeout;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/cookie-name.js
var getCookieName = function(apiKey, postKey, limit) {
	if (postKey === void 0) postKey = "";
	if (limit === void 0) limit = 10;
	return [
		"AMP",
		postKey,
		apiKey.substring(0, limit)
	].filter(Boolean).join("_");
};
var getOldCookieName = function(apiKey) {
	return "".concat("AMP".toLowerCase(), "_").concat(apiKey.substring(0, 6));
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/language.js
var getLanguage = function() {
	var _a, _b, _c, _d;
	if (typeof navigator === "undefined") return "";
	var userLanguage = navigator.userLanguage;
	return (_d = (_c = (_b = (_a = navigator.languages) === null || _a === void 0 ? void 0 : _a[0]) !== null && _b !== void 0 ? _b : navigator.language) !== null && _c !== void 0 ? _c : userLanguage) !== null && _d !== void 0 ? _d : "";
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/query-params.js
var getQueryParams$1 = function() {
	var _a;
	var globalScope = getGlobalScope$1();
	/* istanbul ignore if */
	if (!((_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.location) === null || _a === void 0 ? void 0 : _a.search)) return {};
	return globalScope.location.search.substring(1).split("&").filter(Boolean).reduce(function(acc, curr) {
		var query = curr.split("=", 2);
		var key = tryDecodeURIComponent$1(query[0]);
		var value = tryDecodeURIComponent$1(query[1]);
		if (!value) return acc;
		acc[key] = value;
		return acc;
	}, {});
};
var tryDecodeURIComponent$1 = function(value) {
	if (value === void 0) value = "";
	try {
		return decodeURIComponent(value);
	} catch (_a) {
		return "";
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/url-utils.js
/**
* Checks if a given URL matches any pattern in an allowlist of URLs or regex patterns.
* @param url - The URL to check
* @param allowlist - Array of allowed URLs (strings) or regex patterns
* @returns true if the URL matches any pattern in the allowlist, false otherwise
*/
var isUrlMatchAllowlist$1 = function(url, allowlist) {
	if (!allowlist || !allowlist.length) return true;
	return allowlist.some(function(allowedUrl) {
		if (typeof allowedUrl === "string") return url === allowedUrl;
		return url.match(allowedUrl);
	});
};
var getDecodeURI$1 = function(locationStr, loggerProvider) {
	var decodedLocationStr = locationStr;
	try {
		decodedLocationStr = decodeURI(locationStr);
	} catch (e) {
		/* istanbul ignore next */
		loggerProvider === null || loggerProvider === void 0 || loggerProvider.error("Malformed URI sequence: ", e);
	}
	return decodedLocationStr;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/sampling.js
var generateHashCode = function(str) {
	var hash = 0;
	if (str.length === 0) return hash;
	for (var i = 0; i < str.length; i++) {
		var chr = str.charCodeAt(i);
		hash = (hash << 5) - hash + chr;
		hash |= 0;
	}
	return hash;
};
// istanbul ignore next
var isTimestampInSampleTemp = function(timestamp, sampleRate) {
	var hashNumber = generateHashCode(timestamp.toString());
	return Math.abs(hashNumber) * 31 % 1e5 / 1e5 < sampleRate;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/storage/memory.js
var MemoryStorage = function() {
	function MemoryStorage() {
		this.memoryStorage = /* @__PURE__ */ new Map();
	}
	MemoryStorage.prototype.isEnabled = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, true];
			});
		});
	};
	MemoryStorage.prototype.get = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, this.memoryStorage.get(key)];
			});
		});
	};
	MemoryStorage.prototype.getRaw = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			var value;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, this.get(key)];
					case 1:
						value = _a.sent();
						return [2, value ? JSON.stringify(value) : void 0];
				}
			});
		});
	};
	MemoryStorage.prototype.set = function(key, value) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				this.memoryStorage.set(key, value);
				return [2];
			});
		});
	};
	MemoryStorage.prototype.remove = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				this.memoryStorage.delete(key);
				return [2];
			});
		});
	};
	MemoryStorage.prototype.reset = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				this.memoryStorage.clear();
				return [2];
			});
		});
	};
	return MemoryStorage;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/storage/cookie.js
/* istanbul ignore next */
var getLocks = function() {
	var _a;
	var globalScope = getGlobalScope$1();
	return (_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.navigator) === null || _a === void 0 ? void 0 : _a.locks;
};
var CookieStorage = function() {
	function CookieStorage(options, config) {
		if (config === void 0) config = {};
		this.options = __assign$1({}, options);
		this.config = config;
	}
	CookieStorage.prototype.isEnabled = function() {
		return __awaiter(this, void 0, void 0, function() {
			var testKey, testCookieOptions, testStorage, testValue;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						testKey = "AMP_TEST";
						testCookieOptions = __assign$1({}, this.options);
						testStorage = new CookieStorage(testCookieOptions);
						testValue = String(Date.now());
						return [4, testStorage.transaction(testKey, function(storage) {
							var _a, _b;
							try {
								storage.set(testValue);
								var result = storage.get() === testValue;
								/* istanbul ignore next */
								if (!result && _this.config.diagnosticsClient) (_a = _this.config.diagnosticsClient) === null || _a === void 0 || _a.recordEvent("cookies.isEnabled.failure", {
									reason: "Test Value mismatch",
									testKey,
									testValue,
									sync: true
								});
								return result;
							} catch (e) {
								/* istanbul ignore next */
								if (_this.config.diagnosticsClient) {
									var errMessage = e instanceof Error ? e.message : String(e);
									(_b = _this.config.diagnosticsClient) === null || _b === void 0 || _b.recordEvent("cookies.isEnabled.failure", {
										reason: "Cookie getter/setter failed",
										testKey,
										testValue,
										error: errMessage,
										sync: true
									});
								}
								return false;
							} finally {
								storage.set(null);
							}
						})];
					case 1: return [2, _a.sent()];
				}
			});
		});
	};
	CookieStorage.prototype.get = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			var value;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, this.getRaw(key)];
					case 1:
						value = _a.sent();
						return [2, this.decodeCookieValue(key, value)];
				}
			});
		});
	};
	CookieStorage.prototype.decodeCookieValue = function(key, value) {
		if (!value) return;
		try {
			var decodedValue = decodeCookieValue(value);
			if (decodedValue === void 0) {
				console.error("Amplitude Logger [Error]: Failed to decode cookie value for key: ".concat(key, ", value: ").concat(value));
				return;
			}
			return JSON.parse(decodedValue);
		} catch (_a) {
			console.error("Amplitude Logger [Error]: Failed to parse cookie value for key: ".concat(key, ", value: ").concat(value));
			return;
		}
	};
	CookieStorage.prototype.getSync = function(key) {
		var value = this.getRawSync(key);
		return this.decodeCookieValue(key, value);
	};
	CookieStorage.prototype.getRaw = function(key) {
		var _a, _b;
		return __awaiter(this, void 0, void 0, function() {
			var globalScope, globalScopeWithCookiesStore, cookieStore, cookies, cookies_1, cookies_1_1, cookie;
			var e_1, _c;
			return __generator(this, function(_d) {
				switch (_d.label) {
					case 0:
						globalScope = getGlobalScope$1();
						globalScopeWithCookiesStore = globalScope;
						_d.label = 1;
					case 1:
						_d.trys.push([
							1,
							4,
							,
							5
						]);
						cookieStore = globalScopeWithCookiesStore === null || globalScopeWithCookiesStore === void 0 ? void 0 : globalScopeWithCookiesStore.cookieStore;
						if (!cookieStore) return [3, 3];
						return [4, cookieStore.getAll(key)];
					case 2:
						cookies = _d.sent();
						if (cookies) {
							/* istanbul ignore if */
							if (cookies.length > 1) {
								(_a = this.config.diagnosticsClient) === null || _a === void 0 || _a.recordEvent("cookies.duplicate", { cookies: cookies.map(function(cookie) {
									return cookie.domain;
								}) });
								(_b = this.config.diagnosticsClient) === null || _b === void 0 || _b.increment("cookies.duplicate.occurrence.cookieStore");
							}
							try {
								for (cookies_1 = __values$1(cookies), cookies_1_1 = cookies_1.next(); !cookies_1_1.done; cookies_1_1 = cookies_1.next()) {
									cookie = cookies_1_1.value;
									if (isDomainEqual(cookie.domain, this.options.domain)) return [2, cookie.value];
								}
							} catch (e_1_1) {
								e_1 = { error: e_1_1 };
							} finally {
								try {
									if (cookies_1_1 && !cookies_1_1.done && (_c = cookies_1.return)) _c.call(cookies_1);
								} finally {
									if (e_1) throw e_1.error;
								}
							}
						}
						_d.label = 3;
					case 3: return [3, 5];
					case 4:
						_d.sent();
						return [3, 5];
					case 5: return [2, this.getRawSync(key)];
				}
			});
		});
	};
	CookieStorage.prototype.getRawSync = function(key) {
		var _this = this;
		var _a, _b;
		var globalScope = getGlobalScope$1();
		var cookies = ((_b = (_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.document) === null || _a === void 0 ? void 0 : _a.cookie.split("; ")) !== null && _b !== void 0 ? _b : []).filter(function(c) {
			return c.indexOf(key + "=") === 0;
		});
		var match = void 0;
		/* istanbul ignore if */
		var duplicateResolverFn = this.config.duplicateResolverFn;
		if (typeof duplicateResolverFn === "function" && cookies.length > 1) match = cookies.find(function(c) {
			var _a;
			try {
				var res = duplicateResolverFn(c.substring(key.length + 1));
				if (!res) (_a = _this.config.diagnosticsClient) === null || _a === void 0 || _a.increment("cookies.duplicate.occurrence.document.cookie");
				return res;
			} catch (ignoreError) {
				/* istanbul ignore next */
				return false;
			}
		});
		if (!match) match = cookies[0];
		if (!match) return;
		return match.substring(key.length + 1);
	};
	CookieStorage.prototype.set = function(key, value) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				this.setSync(key, value);
				return [2];
			});
		});
	};
	CookieStorage.prototype.setSync = function(key, value) {
		var _a;
		try {
			var expirationDays = (_a = this.options.expirationDays) !== null && _a !== void 0 ? _a : 0;
			var expires = value !== null ? expirationDays : -1;
			var expireDate = void 0;
			if (expires) {
				var date = /* @__PURE__ */ new Date();
				date.setTime(date.getTime() + expires * 24 * 60 * 60 * 1e3);
				expireDate = date;
			}
			var str = "".concat(key, "=").concat(btoa(encodeURIComponent(JSON.stringify(value))));
			if (expireDate) str += "; expires=".concat(expireDate.toUTCString());
			str += "; path=/";
			if (this.options.domain) str += "; domain=".concat(this.options.domain);
			if (this.options.secure) str += "; Secure";
			if (this.options.sameSite) str += "; SameSite=".concat(this.options.sameSite);
			var globalScope = getGlobalScope$1();
			if (globalScope === null || globalScope === void 0 ? void 0 : globalScope.document) globalScope.document.cookie = str;
		} catch (error) {
			var errorMessage = error instanceof Error ? error.message : String(error);
			console.error("Amplitude Logger [Error]: Failed to set cookie for key: ".concat(key, ". Error: ").concat(errorMessage));
		}
	};
	CookieStorage.prototype.remove = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, this.set(key, null)];
					case 1:
						_a.sent();
						return [2];
				}
			});
		});
	};
	CookieStorage.prototype.reset = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2];
			});
		});
	};
	CookieStorage.isDomainWritable = function(domain) {
		return __awaiter(this, void 0, void 0, function() {
			var options, storageKey, storage, res;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (CookieStorage.cachedTlds[domain]) return [2, true];
						options = { domain: "." + domain };
						storageKey = "AMP_TLDTEST";
						storage = new CookieStorage(options);
						_a.label = 1;
					case 1:
						_a.trys.push([
							1,
							3,
							,
							4
						]);
						return [4, storage.transaction(storageKey, function(storageSync) {
							if (CookieStorage.cachedTlds[domain]) return true;
							try {
								storageSync.set(1);
								var result = !!storageSync.get();
								if (result) CookieStorage.cachedTlds[domain] = true;
								return result;
							} finally {
								storageSync.set(null);
							}
						})];
					case 2:
						res = _a.sent();
						return [2, !!res];
					case 3:
						_a.sent();
						return [2, false];
					case 4: return [2];
				}
			});
		});
	};
	CookieStorage.prototype.transaction = function(key, callback) {
		return __awaiter(this, void 0, void 0, function() {
			var locks, callbackWrapper;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						locks = getLocks();
						callbackWrapper = function() {
							return callback({
								get: function() {
									return _this.getSync(key);
								},
								set: function(value) {
									return _this.setSync(key, value);
								}
							});
						};
						if (!locks) return [2, callbackWrapper()];
						_a.label = 1;
					case 1:
						_a.trys.push([
							1,
							3,
							,
							4
						]);
						return [4, locks.request("com.amplitude:cookie-lock:".concat(key), callbackWrapper)];
					case 2: return [2, _a.sent()];
					case 3:
						_a.sent();
						return [2, callbackWrapper()];
					case 4: return [2];
				}
			});
		});
	};
	CookieStorage.cachedTlds = {};
	return CookieStorage;
}();
var decodeCookiesAsDefault = function(value) {
	try {
		return decodeURIComponent(atob(value));
	} catch (_a) {
		return;
	}
};
var decodeCookiesWithDoubleUrlEncoding = function(value) {
	try {
		return decodeURIComponent(atob(decodeURIComponent(value)));
	} catch (_a) {
		return;
	}
};
/**
* Decodes a cookie value that was encoded with btoa(encodeURIComponent(...)).
* Handles both standard encoding and double URL encoding (used by Ruby Rails v7+).
*/
var decodeCookieValue = function(value) {
	var _a;
	return (_a = decodeCookiesAsDefault(value)) !== null && _a !== void 0 ? _a : decodeCookiesWithDoubleUrlEncoding(value);
};
/**
* Compares two domain strings for equality, ignoring leading dots.
* This is useful for comparing cookie domains since ".example.com" and "example.com"
* are effectively equivalent for cookie scoping.
*/
var isDomainEqual = function(domain1, domain2) {
	if (domain1 === "" && domain2 === "") return true;
	if (!domain1 || !domain2) return false;
	var normalized1 = domain1.startsWith(".") ? domain1.substring(1) : domain1;
	var normalized2 = domain2.startsWith(".") ? domain2.substring(1) : domain2;
	return normalized1.toLowerCase() === normalized2.toLowerCase();
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/storage/helpers.js
var getStorageKey = function(apiKey, postKey, limit) {
	if (postKey === void 0) postKey = "";
	if (limit === void 0) limit = 10;
	return [
		"AMP",
		postKey,
		apiKey.substring(0, limit)
	].filter(Boolean).join("_");
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/storage/browser-storage.js
var BrowserStorage$1 = function() {
	function BrowserStorage(storage) {
		this.storage = storage;
	}
	BrowserStorage.prototype.isEnabled = function() {
		return __awaiter(this, void 0, void 0, function() {
			var random, testStorage, testKey, value;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						/* istanbul ignore if */
						if (!this.storage) return [2, false];
						random = String(Date.now());
						testStorage = new BrowserStorage(this.storage);
						testKey = "AMP_TEST";
						_b.label = 1;
					case 1:
						_b.trys.push([
							1,
							4,
							5,
							7
						]);
						return [4, testStorage.set(testKey, random)];
					case 2:
						_b.sent();
						return [4, testStorage.get(testKey)];
					case 3:
						value = _b.sent();
						return [2, value === random];
					case 4:
						_b.sent();
						/* istanbul ignore next */
						return [2, false];
					case 5: return [4, testStorage.remove(testKey)];
					case 6:
						_b.sent();
						return [7];
					case 7: return [2];
				}
			});
		});
	};
	BrowserStorage.prototype.get = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			var value;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						_b.trys.push([
							0,
							2,
							,
							3
						]);
						return [4, this.getRaw(key)];
					case 1:
						value = _b.sent();
						if (!value) return [2, void 0];
						return [2, JSON.parse(value)];
					case 2:
						_b.sent();
						console.error("[Amplitude] Error: Could not get value from storage");
						return [2, void 0];
					case 3: return [2];
				}
			});
		});
	};
	BrowserStorage.prototype.getRaw = function(key) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				return [2, ((_a = this.storage) === null || _a === void 0 ? void 0 : _a.getItem(key)) || void 0];
			});
		});
	};
	BrowserStorage.prototype.set = function(key, value) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				try {
					(_a = this.storage) === null || _a === void 0 || _a.setItem(key, JSON.stringify(value));
				} catch (_c) {}
				return [2];
			});
		});
	};
	BrowserStorage.prototype.remove = function(key) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				try {
					(_a = this.storage) === null || _a === void 0 || _a.removeItem(key);
				} catch (_c) {}
				return [2];
			});
		});
	};
	BrowserStorage.prototype.reset = function() {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				try {
					(_a = this.storage) === null || _a === void 0 || _a.clear();
				} catch (_c) {}
				return [2];
			});
		});
	};
	return BrowserStorage;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/diagnostics/diagnostics-storage.js
var MAX_PERSISTENT_STORAGE_EVENTS_COUNT = 10;
var DB_VERSION = 1;
var TABLE_NAMES = {
	TAGS: "tags",
	COUNTERS: "counters",
	HISTOGRAMS: "histograms",
	EVENTS: "events",
	INTERNAL: "internal"
};
var INTERNAL_KEYS = { LAST_FLUSH_TIMESTAMP: "last_flush_timestamp" };
/**
* Purpose-specific IndexedDB storage for diagnostics data
* Provides optimized methods for each type of diagnostics data
*/
var DiagnosticsStorage = function() {
	function DiagnosticsStorage(apiKey, logger) {
		this.dbPromise = null;
		this.logger = logger;
		this.dbName = "AMP_diagnostics_".concat(apiKey.substring(0, 10));
	}
	/**
	* Check if IndexedDB is supported in the current environment
	* @returns true if IndexedDB is available, false otherwise
	*/
	DiagnosticsStorage.isSupported = function() {
		var _a;
		return ((_a = getGlobalScope$1()) === null || _a === void 0 ? void 0 : _a.indexedDB) !== void 0;
	};
	DiagnosticsStorage.prototype.getDB = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				if (!this.dbPromise) this.dbPromise = this.openDB();
				return [2, this.dbPromise];
			});
		});
	};
	DiagnosticsStorage.prototype.openDB = function() {
		var _this = this;
		return new Promise(function(resolve, reject) {
			var request = indexedDB.open(_this.dbName, DB_VERSION);
			request.onerror = function() {
				_this.dbPromise = null;
				reject(/* @__PURE__ */ new Error("Failed to open IndexedDB"));
			};
			request.onsuccess = function() {
				var db = request.result;
				db.onclose = function() {
					_this.dbPromise = null;
					_this.logger.debug("DiagnosticsStorage: DB connection closed.");
				};
				db.onerror = function(event) {
					_this.logger.debug("DiagnosticsStorage: A global database error occurred.", event);
					db.close();
				};
				resolve(db);
			};
			request.onupgradeneeded = function(event) {
				var db = event.target.result;
				_this.createTables(db);
			};
		});
	};
	DiagnosticsStorage.prototype.createTables = function(db) {
		if (!db.objectStoreNames.contains(TABLE_NAMES.TAGS)) db.createObjectStore(TABLE_NAMES.TAGS, { keyPath: "key" });
		if (!db.objectStoreNames.contains(TABLE_NAMES.COUNTERS)) db.createObjectStore(TABLE_NAMES.COUNTERS, { keyPath: "key" });
		if (!db.objectStoreNames.contains(TABLE_NAMES.HISTOGRAMS)) db.createObjectStore(TABLE_NAMES.HISTOGRAMS, { keyPath: "key" });
		if (!db.objectStoreNames.contains(TABLE_NAMES.EVENTS)) db.createObjectStore(TABLE_NAMES.EVENTS, {
			keyPath: "id",
			autoIncrement: true
		}).createIndex("time_idx", "time", { unique: false });
		if (!db.objectStoreNames.contains(TABLE_NAMES.INTERNAL)) db.createObjectStore(TABLE_NAMES.INTERNAL, { keyPath: "key" });
	};
	DiagnosticsStorage.prototype.setTags = function(tags) {
		return __awaiter(this, void 0, void 0, function() {
			var db, transaction_1, store_1, error_1;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						if (Object.entries(tags).length === 0) return [2];
						return [4, this.getDB()];
					case 1:
						db = _a.sent();
						transaction_1 = db.transaction([TABLE_NAMES.TAGS], "readwrite");
						store_1 = transaction_1.objectStore(TABLE_NAMES.TAGS);
						return [2, new Promise(function(resolve) {
							var entries = Object.entries(tags);
							transaction_1.oncomplete = function() {
								resolve();
							};
							transaction_1.onabort = function(event) {
								_this.logger.debug("DiagnosticsStorage: Failed to set tags", event);
								resolve();
							};
							entries.forEach(function(_a) {
								var _b = __read$1(_a, 2), key = _b[0], value = _b[1];
								var putRequest = store_1.put({
									key,
									value
								});
								putRequest.onerror = function(event) {
									_this.logger.debug("DiagnosticsStorage: Failed to set tag", key, value, event);
								};
							});
						})];
					case 2:
						error_1 = _a.sent();
						this.logger.debug("DiagnosticsStorage: Failed to set tags", error_1);
						return [3, 3];
					case 3: return [2];
				}
			});
		});
	};
	DiagnosticsStorage.prototype.incrementCounters = function(counters) {
		return __awaiter(this, void 0, void 0, function() {
			var db, transaction_2, store_2, error_2;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						if (Object.entries(counters).length === 0) return [2];
						return [4, this.getDB()];
					case 1:
						db = _a.sent();
						transaction_2 = db.transaction([TABLE_NAMES.COUNTERS], "readwrite");
						store_2 = transaction_2.objectStore(TABLE_NAMES.COUNTERS);
						return [2, new Promise(function(resolve) {
							var entries = Object.entries(counters);
							transaction_2.oncomplete = function() {
								resolve();
							};
							transaction_2.onabort = function(event) {
								_this.logger.debug("DiagnosticsStorage: Failed to increment counters", event);
								resolve();
							};
							entries.forEach(function(_a) {
								var _b = __read$1(_a, 2), key = _b[0], incrementValue = _b[1];
								var getRequest = store_2.get(key);
								getRequest.onsuccess = function() {
									var existingRecord = getRequest.result;
									/* istanbul ignore next */
									var existingValue = existingRecord ? existingRecord.value : 0;
									var putRequest = store_2.put({
										key,
										value: existingValue + incrementValue
									});
									putRequest.onerror = function(event) {
										_this.logger.debug("DiagnosticsStorage: Failed to update counter", key, event);
									};
								};
								getRequest.onerror = function(event) {
									_this.logger.debug("DiagnosticsStorage: Failed to read existing counter", key, event);
								};
							});
						})];
					case 2:
						error_2 = _a.sent();
						this.logger.debug("DiagnosticsStorage: Failed to increment counters", error_2);
						return [3, 3];
					case 3: return [2];
				}
			});
		});
	};
	DiagnosticsStorage.prototype.setHistogramStats = function(histogramStats) {
		return __awaiter(this, void 0, void 0, function() {
			var db, transaction_3, store_3, error_3;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						if (Object.entries(histogramStats).length === 0) return [2];
						return [4, this.getDB()];
					case 1:
						db = _a.sent();
						transaction_3 = db.transaction([TABLE_NAMES.HISTOGRAMS], "readwrite");
						store_3 = transaction_3.objectStore(TABLE_NAMES.HISTOGRAMS);
						return [2, new Promise(function(resolve) {
							var entries = Object.entries(histogramStats);
							transaction_3.oncomplete = function() {
								resolve();
							};
							transaction_3.onabort = function(event) {
								_this.logger.debug("DiagnosticsStorage: Failed to set histogram stats", event);
								resolve();
							};
							entries.forEach(function(_a) {
								var _b = __read$1(_a, 2), key = _b[0], newStats = _b[1];
								var getRequest = store_3.get(key);
								getRequest.onsuccess = function() {
									var existingRecord = getRequest.result;
									var updatedStats;
									/* istanbul ignore next */
									if (existingRecord) updatedStats = {
										key,
										count: existingRecord.count + newStats.count,
										min: Math.min(existingRecord.min, newStats.min),
										max: Math.max(existingRecord.max, newStats.max),
										sum: existingRecord.sum + newStats.sum
									};
									else updatedStats = {
										key,
										count: newStats.count,
										min: newStats.min,
										max: newStats.max,
										sum: newStats.sum
									};
									var putRequest = store_3.put(updatedStats);
									putRequest.onerror = function(event) {
										_this.logger.debug("DiagnosticsStorage: Failed to set histogram stats", key, event);
									};
								};
								getRequest.onerror = function(event) {
									_this.logger.debug("DiagnosticsStorage: Failed to read existing histogram stats", key, event);
								};
							});
						})];
					case 2:
						error_3 = _a.sent();
						this.logger.debug("DiagnosticsStorage: Failed to set histogram stats", error_3);
						return [3, 3];
					case 3: return [2];
				}
			});
		});
	};
	DiagnosticsStorage.prototype.addEventRecords = function(events) {
		return __awaiter(this, void 0, void 0, function() {
			var db, transaction_4, store_4, error_4;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						if (events.length === 0) return [2];
						return [4, this.getDB()];
					case 1:
						db = _a.sent();
						transaction_4 = db.transaction([TABLE_NAMES.EVENTS], "readwrite");
						store_4 = transaction_4.objectStore(TABLE_NAMES.EVENTS);
						return [2, new Promise(function(resolve) {
							transaction_4.oncomplete = function() {
								resolve();
							};
							/* istanbul ignore next */
							transaction_4.onabort = function(event) {
								_this.logger.debug("DiagnosticsStorage: Failed to add event records", event);
								resolve();
							};
							var countRequest = store_4.count();
							countRequest.onsuccess = function() {
								var currentCount = countRequest.result;
								var availableSlots = Math.max(0, MAX_PERSISTENT_STORAGE_EVENTS_COUNT - currentCount);
								if (availableSlots < events.length) _this.logger.debug("DiagnosticsStorage: Only added ".concat(availableSlots, " of ").concat(events.length, " events due to storage limit"));
								events.slice(0, availableSlots).forEach(function(event) {
									var request = store_4.add(event);
									request.onerror = function(event) {
										_this.logger.debug("DiagnosticsStorage: Failed to add event record", event);
									};
								});
							};
							countRequest.onerror = function(event) {
								_this.logger.debug("DiagnosticsStorage: Failed to count existing events", event);
							};
						})];
					case 2:
						error_4 = _a.sent();
						this.logger.debug("DiagnosticsStorage: Failed to add event records", error_4);
						return [3, 3];
					case 3: return [2];
				}
			});
		});
	};
	DiagnosticsStorage.prototype.setInternal = function(key, value) {
		return __awaiter(this, void 0, void 0, function() {
			var db, transaction_5, store_5, error_5;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						return [4, this.getDB()];
					case 1:
						db = _a.sent();
						transaction_5 = db.transaction([TABLE_NAMES.INTERNAL], "readwrite");
						store_5 = transaction_5.objectStore(TABLE_NAMES.INTERNAL);
						return [2, new Promise(function(resolve, reject) {
							/* istanbul ignore next */
							transaction_5.onabort = function() {
								return reject(/* @__PURE__ */ new Error("Failed to set internal value"));
							};
							var request = store_5.put({
								key,
								value
							});
							request.onsuccess = function() {
								return resolve();
							};
							/* istanbul ignore next */
							request.onerror = function() {
								return reject(/* @__PURE__ */ new Error("Failed to set internal value"));
							};
						})];
					case 2:
						error_5 = _a.sent();
						/* istanbul ignore next */
						this.logger.debug("DiagnosticsStorage: Failed to set internal value", error_5);
						return [3, 3];
					case 3: return [2];
				}
			});
		});
	};
	DiagnosticsStorage.prototype.getInternal = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			var db, transaction_6, store_6, error_6;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						return [4, this.getDB()];
					case 1:
						db = _a.sent();
						transaction_6 = db.transaction([TABLE_NAMES.INTERNAL], "readonly");
						store_6 = transaction_6.objectStore(TABLE_NAMES.INTERNAL);
						return [2, new Promise(function(resolve, reject) {
							/* istanbul ignore next */
							transaction_6.onabort = function() {
								return reject(/* @__PURE__ */ new Error("Failed to get internal value"));
							};
							var request = store_6.get(key);
							request.onsuccess = function() {
								return resolve(request.result);
							};
							/* istanbul ignore next */
							request.onerror = function() {
								return reject(/* @__PURE__ */ new Error("Failed to get internal value"));
							};
						})];
					case 2:
						error_6 = _a.sent();
						this.logger.debug("DiagnosticsStorage: Failed to get internal value", error_6);
						return [2, void 0];
					case 3: return [2];
				}
			});
		});
	};
	DiagnosticsStorage.prototype.getLastFlushTimestamp = function() {
		return __awaiter(this, void 0, void 0, function() {
			var record, error_7;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						return [4, this.getInternal(INTERNAL_KEYS.LAST_FLUSH_TIMESTAMP)];
					case 1:
						record = _a.sent();
						return [2, record ? parseInt(record.value, 10) : void 0];
					case 2:
						error_7 = _a.sent();
						/* istanbul ignore next */
						this.logger.debug("DiagnosticsStorage: Failed to get last flush timestamp", error_7);
						/* istanbul ignore next */
						return [2, void 0];
					case 3: return [2];
				}
			});
		});
	};
	DiagnosticsStorage.prototype.setLastFlushTimestamp = function(timestamp) {
		return __awaiter(this, void 0, void 0, function() {
			var error_8;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						return [4, this.setInternal(INTERNAL_KEYS.LAST_FLUSH_TIMESTAMP, timestamp.toString())];
					case 1:
						_a.sent();
						return [3, 3];
					case 2:
						error_8 = _a.sent();
						/* istanbul ignore next */
						this.logger.debug("DiagnosticsStorage: Failed to set last flush timestamp", error_8);
						return [3, 3];
					case 3: return [2];
				}
			});
		});
	};
	/* istanbul ignore next */
	DiagnosticsStorage.prototype.clearTable = function(transaction, tableName) {
		return new Promise(function(resolve, reject) {
			var request = transaction.objectStore(tableName).clear();
			request.onsuccess = function() {
				return resolve();
			};
			request.onerror = function() {
				return reject(new Error("Failed to clear table ".concat(tableName)));
			};
		});
	};
	/* istanbul ignore next */
	DiagnosticsStorage.prototype.getAllAndClear = function() {
		return __awaiter(this, void 0, void 0, function() {
			var db, transaction, _a, tags, counters, histogramStats, events, error_9;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						_b.trys.push([
							0,
							4,
							,
							5
						]);
						return [4, this.getDB()];
					case 1:
						db = _b.sent();
						transaction = db.transaction([
							TABLE_NAMES.TAGS,
							TABLE_NAMES.COUNTERS,
							TABLE_NAMES.HISTOGRAMS,
							TABLE_NAMES.EVENTS
						], "readwrite");
						return [4, Promise.all([
							this.getAllFromStore(transaction, TABLE_NAMES.TAGS),
							this.getAllFromStore(transaction, TABLE_NAMES.COUNTERS),
							this.getAllFromStore(transaction, TABLE_NAMES.HISTOGRAMS),
							this.getAllFromStore(transaction, TABLE_NAMES.EVENTS)
						])];
					case 2:
						_a = __read$1.apply(void 0, [_b.sent(), 4]), tags = _a[0], counters = _a[1], histogramStats = _a[2], events = _a[3];
						return [4, Promise.all([
							this.clearTable(transaction, TABLE_NAMES.COUNTERS),
							this.clearTable(transaction, TABLE_NAMES.HISTOGRAMS),
							this.clearTable(transaction, TABLE_NAMES.EVENTS)
						])];
					case 3:
						_b.sent();
						return [2, {
							tags,
							counters,
							histogramStats,
							events
						}];
					case 4:
						error_9 = _b.sent();
						this.logger.debug("DiagnosticsStorage: Failed to get all and clear data", error_9);
						return [2, {
							tags: [],
							counters: [],
							histogramStats: [],
							events: []
						}];
					case 5: return [2];
				}
			});
		});
	};
	/**
	* Helper method to get all records from a store within a transaction
	*/
	/* istanbul ignore next */
	DiagnosticsStorage.prototype.getAllFromStore = function(transaction, tableName) {
		return new Promise(function(resolve, reject) {
			var request = transaction.objectStore(tableName).getAll();
			request.onsuccess = function() {
				return resolve(request.result);
			};
			request.onerror = function() {
				return reject(new Error("Failed to get all from ".concat(tableName)));
			};
		});
	};
	return DiagnosticsStorage;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/diagnostics/uncaught-sdk-errors.js
var GLOBAL_KEY = "__AMPLITUDE_SCRIPT_URL__";
var EVENT_NAME_ERROR_UNCAUGHT = "sdk.error.uncaught";
var getNormalizedScriptUrls = function() {
	var scope = getGlobalScope$1();
	/* istanbul ignore next */
	if (!scope) return [];
	var value = scope[GLOBAL_KEY];
	if (Array.isArray(value)) return value;
	/* istanbul ignore next - legacy single URL stored as string */
	if (typeof value === "string") return [value];
	return [];
};
var enableSdkErrorListeners = function(client) {
	var scope = getGlobalScope$1();
	if (!scope || typeof scope.addEventListener !== "function") return;
	var handleError = function(event) {
		var error = event.error instanceof Error ? event.error : void 0;
		var stack = error === null || error === void 0 ? void 0 : error.stack;
		var match = detectSdkOrigin({
			filename: event.filename,
			stack
		});
		if (!match) return;
		capture({
			type: "error",
			message: event.message,
			stack,
			filename: event.filename,
			errorName: error === null || error === void 0 ? void 0 : error.name,
			metadata: {
				colno: event.colno,
				lineno: event.lineno,
				isTrusted: event.isTrusted,
				matchReason: match
			}
		});
	};
	var handleRejection = function(event) {
		var _a;
		var error = event.reason instanceof Error ? event.reason : void 0;
		var stack = error === null || error === void 0 ? void 0 : error.stack;
		var filename = extractFilenameFromStack(stack);
		var match = detectSdkOrigin({
			filename,
			stack
		});
		if (!match) return;
		/* istanbul ignore next */
		capture({
			type: "unhandledrejection",
			message: (_a = error === null || error === void 0 ? void 0 : error.message) !== null && _a !== void 0 ? _a : stringifyReason(event.reason),
			stack,
			filename,
			errorName: error === null || error === void 0 ? void 0 : error.name,
			metadata: {
				isTrusted: event.isTrusted,
				matchReason: match
			}
		});
	};
	var capture = function(context) {
		client.recordEvent(EVENT_NAME_ERROR_UNCAUGHT, __assign$1({
			type: context.type,
			message: context.message,
			filename: context.filename,
			error_name: context.errorName,
			stack: context.stack
		}, context.metadata));
	};
	scope.addEventListener("error", handleError, true);
	scope.addEventListener("unhandledrejection", handleRejection, true);
};
var detectSdkOrigin = function(payload) {
	var e_1, _a;
	var normalizedScriptUrls = getNormalizedScriptUrls();
	if (normalizedScriptUrls.length === 0) return;
	try {
		for (var normalizedScriptUrls_1 = __values$1(normalizedScriptUrls), normalizedScriptUrls_1_1 = normalizedScriptUrls_1.next(); !normalizedScriptUrls_1_1.done; normalizedScriptUrls_1_1 = normalizedScriptUrls_1.next()) {
			var normalizedScriptUrl = normalizedScriptUrls_1_1.value;
			if (payload.filename && payload.filename.includes(normalizedScriptUrl)) return "filename";
			if (payload.stack && payload.stack.includes(normalizedScriptUrl)) return "stack";
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (normalizedScriptUrls_1_1 && !normalizedScriptUrls_1_1.done && (_a = normalizedScriptUrls_1.return)) _a.call(normalizedScriptUrls_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
};
var extractFilenameFromStack = function(stack) {
	if (!stack) return;
	var match = stack.match(/(https?:\/\/\S+?)(?=[)\s]|$)/);
	/* istanbul ignore next */
	return match ? match[1] : void 0;
};
/* istanbul ignore next */
var stringifyReason = function(reason) {
	if (typeof reason === "string") return reason;
	try {
		return JSON.stringify(reason);
	} catch (_a) {
		return "[object Object]";
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/diagnostics/diagnostics-client.js
var SAVE_INTERVAL_MS = 1e3;
var FLUSH_INTERVAL_MS = 300 * 1e3;
var DIAGNOSTICS_US_SERVER_URL = "https://diagnostics.prod.us-west-2.amplitude.com/v1/capture";
var DIAGNOSTICS_EU_SERVER_URL = "https://diagnostics.prod.eu-central-1.amplitude.com/v1/capture";
var DiagnosticsClient = function() {
	function DiagnosticsClient(apiKey, logger, serverZone, options) {
		if (serverZone === void 0) serverZone = "US";
		this.inMemoryTags = {};
		this.inMemoryCounters = {};
		this.inMemoryHistograms = {};
		this.inMemoryEvents = [];
		this.saveTimer = null;
		this.flushTimer = null;
		this.apiKey = apiKey;
		this.logger = logger;
		this.serverUrl = serverZone === "US" ? DIAGNOSTICS_US_SERVER_URL : DIAGNOSTICS_EU_SERVER_URL;
		this.logger.debug("DiagnosticsClient: Initializing with options", JSON.stringify(options, null, 2));
		this.config = __assign$1({
			enabled: true,
			sampleRate: 0
		}, options);
		this.startTimestamp = Date.now();
		this.shouldTrack = isTimestampInSampleTemp(this.startTimestamp, this.config.sampleRate) && this.config.enabled;
		if (DiagnosticsStorage.isSupported()) this.storage = new DiagnosticsStorage(apiKey, logger);
		else this.logger.debug("DiagnosticsClient: IndexedDB is not supported");
		this.initializeFlushInterval();
		if (this.shouldTrack) {
			this.increment("sdk.diagnostics.sampled.in.and.enabled");
			enableSdkErrorListeners(this);
		}
	}
	/**
	* Check if storage is available and tracking is enabled
	*/
	DiagnosticsClient.prototype.isStorageAndTrackEnabled = function() {
		return Boolean(this.storage) && Boolean(this.shouldTrack);
	};
	DiagnosticsClient.prototype.setTag = function(name, value) {
		if (!this.isStorageAndTrackEnabled()) return;
		if (Object.keys(this.inMemoryTags).length >= 1e4) {
			this.logger.debug("DiagnosticsClient: Early return setTags as reaching memory limit");
			return;
		}
		this.inMemoryTags[name] = value;
		this.startTimersIfNeeded();
	};
	DiagnosticsClient.prototype.increment = function(name, size) {
		if (size === void 0) size = 1;
		if (!this.isStorageAndTrackEnabled()) return;
		if (Object.keys(this.inMemoryCounters).length >= 1e4) {
			this.logger.debug("DiagnosticsClient: Early return increment as reaching memory limit");
			return;
		}
		this.inMemoryCounters[name] = (this.inMemoryCounters[name] || 0) + size;
		this.startTimersIfNeeded();
	};
	DiagnosticsClient.prototype.recordHistogram = function(name, value) {
		if (!this.isStorageAndTrackEnabled()) return;
		if (Object.keys(this.inMemoryHistograms).length >= 1e4) {
			this.logger.debug("DiagnosticsClient: Early return recordHistogram as reaching memory limit");
			return;
		}
		var existing = this.inMemoryHistograms[name];
		if (existing) {
			existing.count += 1;
			existing.min = Math.min(existing.min, value);
			existing.max = Math.max(existing.max, value);
			existing.sum += value;
		} else this.inMemoryHistograms[name] = {
			count: 1,
			min: value,
			max: value,
			sum: value
		};
		this.startTimersIfNeeded();
	};
	DiagnosticsClient.prototype.recordEvent = function(name, properties) {
		if (!this.isStorageAndTrackEnabled()) return;
		if (this.inMemoryEvents.length >= 10) {
			this.logger.debug("DiagnosticsClient: Early return recordEvent as reaching memory limit");
			return;
		}
		this.inMemoryEvents.push({
			event_name: name,
			time: Date.now(),
			event_properties: properties
		});
		this.startTimersIfNeeded();
	};
	DiagnosticsClient.prototype.startTimersIfNeeded = function() {
		var _this = this;
		if (!this.saveTimer) this.saveTimer = setTimeout(function() {
			_this.saveAllDataToStorage().catch(function(error) {
				_this.logger.debug("DiagnosticsClient: Failed to save all data to storage", error);
			}).finally(function() {
				_this.saveTimer = null;
			});
		}, SAVE_INTERVAL_MS);
		if (!this.flushTimer) this.flushTimer = setTimeout(function() {
			_this._flush().catch(function(error) {
				_this.logger.debug("DiagnosticsClient: Failed to flush", error);
			}).finally(function() {
				_this.flushTimer = null;
			});
		}, FLUSH_INTERVAL_MS);
	};
	DiagnosticsClient.prototype.saveAllDataToStorage = function() {
		return __awaiter(this, void 0, void 0, function() {
			var tagsToSave, countersToSave, histogramsToSave, eventsToSave;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (!this.storage) return [2];
						tagsToSave = __assign$1({}, this.inMemoryTags);
						countersToSave = __assign$1({}, this.inMemoryCounters);
						histogramsToSave = __assign$1({}, this.inMemoryHistograms);
						eventsToSave = __spreadArray([], __read$1(this.inMemoryEvents), false);
						this.inMemoryEvents = [];
						this.inMemoryTags = {};
						this.inMemoryCounters = {};
						this.inMemoryHistograms = {};
						return [4, Promise.all([
							this.storage.setTags(tagsToSave),
							this.storage.incrementCounters(countersToSave),
							this.storage.setHistogramStats(histogramsToSave),
							this.storage.addEventRecords(eventsToSave)
						])];
					case 1:
						_a.sent();
						return [2];
				}
			});
		});
	};
	DiagnosticsClient.prototype._flush = function() {
		return __awaiter(this, void 0, void 0, function() {
			var _a, tagRecords, counterRecords, histogramStatsRecords, eventRecords, tags, counters, histogram, events, payload;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						if (!this.storage) return [2];
						return [4, this.saveAllDataToStorage()];
					case 1:
						_b.sent();
						this.saveTimer = null;
						this.flushTimer = null;
						return [4, this.storage.getAllAndClear()];
					case 2:
						_a = _b.sent(), tagRecords = _a.tags, counterRecords = _a.counters, histogramStatsRecords = _a.histogramStats, eventRecords = _a.events;
						this.storage.setLastFlushTimestamp(Date.now());
						tags = {};
						tagRecords.forEach(function(record) {
							tags[record.key] = record.value;
						});
						counters = {};
						counterRecords.forEach(function(record) {
							counters[record.key] = record.value;
						});
						histogram = {};
						histogramStatsRecords.forEach(function(stats) {
							histogram[stats.key] = {
								count: stats.count,
								min: stats.min,
								max: stats.max,
								avg: Math.round(stats.sum / stats.count * 100) / 100
							};
						});
						events = eventRecords.map(function(record) {
							return {
								event_name: record.event_name,
								time: record.time,
								event_properties: record.event_properties
							};
						});
						if (Object.keys(counters).length === 0 && Object.keys(histogram).length === 0 && events.length === 0) return [2];
						payload = {
							tags,
							histogram,
							counters,
							events
						};
						this.fetch(payload);
						return [2];
				}
			});
		});
	};
	/**
	* Send diagnostics data to the server
	*/
	DiagnosticsClient.prototype.fetch = function(payload) {
		return __awaiter(this, void 0, void 0, function() {
			var response, error_1;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						_a.trys.push([
							0,
							2,
							,
							3
						]);
						if (!getGlobalScope$1()) throw new Error("DiagnosticsClient: Fetch is not supported");
						return [4, fetch(this.serverUrl, {
							method: "POST",
							headers: {
								"X-ApiKey": this.apiKey,
								"Content-Type": "application/json"
							},
							body: JSON.stringify(payload)
						})];
					case 1:
						response = _a.sent();
						if (!response.ok) {
							this.logger.debug("DiagnosticsClient: Failed to send diagnostics data.");
							return [2];
						}
						this.logger.debug("DiagnosticsClient: Successfully sent diagnostics data");
						return [3, 3];
					case 2:
						error_1 = _a.sent();
						this.logger.debug("DiagnosticsClient: Failed to send diagnostics data. ", error_1);
						return [3, 3];
					case 3: return [2];
				}
			});
		});
	};
	/**
	* Initialize flush interval logic.
	* Check if 5 minutes has passed since last flush, if so flush immediately.
	* Otherwise set a timer to flush when the interval is reached.
	*/
	DiagnosticsClient.prototype.initializeFlushInterval = function() {
		return __awaiter(this, void 0, void 0, function() {
			var now, lastFlushTimestamp, timeSinceLastFlush;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (!this.storage) return [2];
						now = Date.now();
						return [4, this.storage.getLastFlushTimestamp()];
					case 1:
						lastFlushTimestamp = _a.sent() || -1;
						if (lastFlushTimestamp === -1) {
							this.storage.setLastFlushTimestamp(now);
							this._setFlushTimer(FLUSH_INTERVAL_MS);
							return [2];
						}
						timeSinceLastFlush = now - lastFlushTimestamp;
						if (timeSinceLastFlush >= 3e5) {
							this._flush();
							return [2];
						} else this._setFlushTimer(FLUSH_INTERVAL_MS - timeSinceLastFlush);
						return [2];
				}
			});
		});
	};
	/**
	* Helper method to set flush timer with consistent error handling
	*/
	DiagnosticsClient.prototype._setFlushTimer = function(delay) {
		var _this = this;
		this.flushTimer = setTimeout(function() {
			_this._flush().catch(function(error) {
				_this.logger.debug("DiagnosticsClient: Failed to flush", error);
			}).finally(function() {
				_this.flushTimer = null;
			});
		}, delay);
	};
	DiagnosticsClient.prototype._setSampleRate = function(sampleRate) {
		this.logger.debug("DiagnosticsClient: Setting sample rate to", sampleRate);
		this.config.sampleRate = sampleRate;
		this.shouldTrack = isTimestampInSampleTemp(this.startTimestamp, this.config.sampleRate) && this.config.enabled;
		this.logger.debug("DiagnosticsClient: Should track is", this.shouldTrack);
	};
	return DiagnosticsClient;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/transports/base.js
var BaseTransport = function() {
	function BaseTransport() {}
	BaseTransport.prototype.send = function(_serverUrl, _payload, _enableRequestBodyCompression) {
		return Promise.resolve(null);
	};
	BaseTransport.prototype.buildResponse = function(responseJSON) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x;
		if (typeof responseJSON !== "object") return null;
		var statusCode = responseJSON.code || 0;
		var status = this.buildStatus(statusCode);
		switch (status) {
			case Status.Success: return {
				status,
				statusCode,
				body: {
					eventsIngested: (_a = responseJSON.events_ingested) !== null && _a !== void 0 ? _a : 0,
					payloadSizeBytes: (_b = responseJSON.payload_size_bytes) !== null && _b !== void 0 ? _b : 0,
					serverUploadTime: (_c = responseJSON.server_upload_time) !== null && _c !== void 0 ? _c : 0
				}
			};
			case Status.Invalid: return {
				status,
				statusCode,
				body: {
					error: (_d = responseJSON.error) !== null && _d !== void 0 ? _d : "",
					missingField: (_e = responseJSON.missing_field) !== null && _e !== void 0 ? _e : "",
					eventsWithInvalidFields: (_f = responseJSON.events_with_invalid_fields) !== null && _f !== void 0 ? _f : {},
					eventsWithMissingFields: (_g = responseJSON.events_with_missing_fields) !== null && _g !== void 0 ? _g : {},
					eventsWithInvalidIdLengths: (_h = responseJSON.events_with_invalid_id_lengths) !== null && _h !== void 0 ? _h : {},
					epsThreshold: (_j = responseJSON.eps_threshold) !== null && _j !== void 0 ? _j : 0,
					exceededDailyQuotaDevices: (_k = responseJSON.exceeded_daily_quota_devices) !== null && _k !== void 0 ? _k : {},
					silencedDevices: (_l = responseJSON.silenced_devices) !== null && _l !== void 0 ? _l : [],
					silencedEvents: (_m = responseJSON.silenced_events) !== null && _m !== void 0 ? _m : [],
					throttledDevices: (_o = responseJSON.throttled_devices) !== null && _o !== void 0 ? _o : {},
					throttledEvents: (_p = responseJSON.throttled_events) !== null && _p !== void 0 ? _p : []
				}
			};
			case Status.PayloadTooLarge: return {
				status,
				statusCode,
				body: { error: (_q = responseJSON.error) !== null && _q !== void 0 ? _q : "" }
			};
			case Status.RateLimit: return {
				status,
				statusCode,
				body: {
					error: (_r = responseJSON.error) !== null && _r !== void 0 ? _r : "",
					epsThreshold: (_s = responseJSON.eps_threshold) !== null && _s !== void 0 ? _s : 0,
					throttledDevices: (_t = responseJSON.throttled_devices) !== null && _t !== void 0 ? _t : {},
					throttledUsers: (_u = responseJSON.throttled_users) !== null && _u !== void 0 ? _u : {},
					exceededDailyQuotaDevices: (_v = responseJSON.exceeded_daily_quota_devices) !== null && _v !== void 0 ? _v : {},
					exceededDailyQuotaUsers: (_w = responseJSON.exceeded_daily_quota_users) !== null && _w !== void 0 ? _w : {},
					throttledEvents: (_x = responseJSON.throttled_events) !== null && _x !== void 0 ? _x : []
				}
			};
			case Status.Timeout:
			default: return {
				status,
				statusCode
			};
		}
	};
	BaseTransport.prototype.buildStatus = function(code) {
		if (isSuccessStatusCode(code)) return Status.Success;
		if (code === 429) return Status.RateLimit;
		if (code === 413) return Status.PayloadTooLarge;
		if (code === 408) return Status.Timeout;
		if (code >= 400 && code < 500) return Status.Invalid;
		if (code >= 500) return Status.Failed;
		return Status.Unknown;
	};
	return BaseTransport;
}();
/**
* Returns true if CompressionStream is available (e.g. in supported browsers).
*/
function isCompressionStreamAvailable() {
	return typeof CompressionStream !== "undefined";
}
/**
* Compress a string to gzip and return the result as an ArrayBuffer.
* Best-effort: returns undefined if CompressionStream is unavailable or compression fails.
* Payload is small so buffering is fine. Used by Fetch and XHR transports.
*/
function compressToGzipArrayBuffer(data) {
	return __awaiter(this, void 0, void 0, function() {
		var CompressionStreamImpl, stream;
		return __generator(this, function(_b) {
			switch (_b.label) {
				case 0:
					CompressionStreamImpl = CompressionStream;
					if (typeof CompressionStreamImpl === "undefined") return [2, void 0];
					_b.label = 1;
				case 1:
					_b.trys.push([
						1,
						3,
						,
						4
					]);
					stream = new Blob([data]).stream().pipeThrough(new CompressionStreamImpl("gzip"));
					return [4, new Response(stream).arrayBuffer()];
				case 2: return [2, _b.sent()];
				case 3:
					_b.sent();
					return [2, void 0];
				case 4: return [2];
			}
		});
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/remote-config/remote-config-localstorage.js
var RemoteConfigLocalStorage = function() {
	function RemoteConfigLocalStorage(apiKey, logger) {
		this.key = "AMP_remote_config_".concat(apiKey.substring(0, 10));
		this.logger = logger;
	}
	RemoteConfigLocalStorage.prototype.fetchConfig = function() {
		var result = null;
		var failedRemoteConfigInfo = {
			remoteConfig: null,
			lastFetch: /* @__PURE__ */ new Date()
		};
		try {
			result = localStorage.getItem(this.key);
		} catch (error) {
			this.logger.debug("Remote config localstorage failed to access: ", error);
			return Promise.resolve(failedRemoteConfigInfo);
		}
		if (result === null) {
			this.logger.debug("Remote config localstorage gets null because the key does not exist");
			return Promise.resolve(failedRemoteConfigInfo);
		}
		try {
			var remoteConfigInfo = JSON.parse(result);
			this.logger.debug("Remote config localstorage parsed successfully: ".concat(JSON.stringify(remoteConfigInfo)));
			return Promise.resolve({
				remoteConfig: remoteConfigInfo.remoteConfig,
				lastFetch: new Date(remoteConfigInfo.lastFetch)
			});
		} catch (error) {
			this.logger.debug("Remote config localstorage failed to parse: ", error);
			localStorage.removeItem(this.key);
			return Promise.resolve(failedRemoteConfigInfo);
		}
	};
	RemoteConfigLocalStorage.prototype.setConfig = function(config) {
		try {
			localStorage.setItem(this.key, JSON.stringify(config));
			this.logger.debug("Remote config localstorage set successfully.");
			return Promise.resolve(true);
		} catch (error) {
			this.logger.debug("Remote config localstorage failed to set: ", error);
		}
		return Promise.resolve(false);
	};
	return RemoteConfigLocalStorage;
}();
var CODE_STATUS = {
	INVALID_API_KEY: 401,
	FORBIDDEN: 403,
	RATE_LIMIT: 429
};
/**
* The default timeout for fetch in milliseconds.
* Linear backoff policy: timeout / retry times is the interval between fetch retry.
*/
var DEFAULT_TIMEOUT = 1e3;
/**
* The minimum time between fetches in milliseconds.
* This prevents too many requests from being sent in a short period of time.
*/
var DEFAULT_MIN_TIME_BETWEEN_FETCHES = 300 * 1e3;
var RemoteConfigClient = function() {
	function RemoteConfigClient(apiKey, logger, serverZone, serverUrl) {
		if (serverZone === void 0) serverZone = "US";
		this.callbackInfos = [];
		this.lastSuccessfulFetch = null;
		this.fetchPromise = null;
		this.isLastFetchInvalidApiKey = false;
		this.apiKey = apiKey;
		this.serverUrl = serverUrl || (serverZone === "US" ? "https://sr-client-cfg.amplitude.com/config" : "https://sr-client-cfg.eu.amplitude.com/config");
		this.logger = logger;
		this.storage = new RemoteConfigLocalStorage(apiKey, logger);
	}
	RemoteConfigClient.prototype.subscribe = function(key, deliveryMode, callback) {
		var id = UUID$1();
		var callbackInfo = {
			id,
			key,
			deliveryMode,
			callback
		};
		this.callbackInfos.push(callbackInfo);
		if (deliveryMode === "all") this.subscribeAll(callbackInfo);
		else this.subscribeWaitForRemote(callbackInfo, deliveryMode.timeout);
		return id;
	};
	RemoteConfigClient.prototype.unsubscribe = function(id) {
		var index = this.callbackInfos.findIndex(function(callbackInfo) {
			return callbackInfo.id === id;
		});
		if (index === -1) {
			this.logger.debug("Remote config client unsubscribe failed because callback with id ".concat(id, " doesn't exist."));
			return false;
		}
		this.callbackInfos.splice(index, 1);
		this.logger.debug("Remote config client unsubscribe succeeded removing callback with id ".concat(id, "."));
		return true;
	};
	RemoteConfigClient.prototype.updateConfigs = function() {
		return __awaiter(this, void 0, void 0, function() {
			var timeSinceLastFetch, result;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (this.lastSuccessfulFetch) {
							timeSinceLastFetch = Date.now() - this.lastSuccessfulFetch;
							if (timeSinceLastFetch < DEFAULT_MIN_TIME_BETWEEN_FETCHES) {
								this.logger.debug("Remote config client skipping updateConfigs: Too recent");
								return [2];
							}
						}
						return [4, this.getOrCreateFetchPromise()];
					case 1:
						result = _a.sent();
						this.storage.setConfig(result);
						this.callbackInfos.forEach(function(callbackInfo) {
							_this.sendCallback(callbackInfo, result, "remote");
						});
						return [2];
				}
			});
		});
	};
	/**
	* Get the in-flight fetch promise or create a new one.
	* This ensures multiple subscribe calls share the same network request.
	*/
	RemoteConfigClient.prototype.getOrCreateFetchPromise = function() {
		var _this = this;
		if (this.fetchPromise) return this.fetchPromise;
		if (this.isLastFetchInvalidApiKey) {
			this.logger.debug("Remote config client skipping fetch: Invalid API key");
			this.fetchPromise = Promise.resolve({
				remoteConfig: null,
				lastFetch: /* @__PURE__ */ new Date()
			}).finally(function() {
				_this.fetchPromise = null;
			});
			return this.fetchPromise;
		}
		this.fetchPromise = this.fetch().then(function(result) {
			if (result.remoteConfig !== null) _this.lastSuccessfulFetch = Date.now();
			return result;
		}).finally(function() {
			_this.fetchPromise = null;
		});
		return this.fetchPromise;
	};
	/**
	* Send remote first. If it's already complete, we can skip the cached response.
	* - if remote is fetched first, no cache fetch.
	* - if cache is fetched first, still fetching remote.
	*/
	RemoteConfigClient.prototype.subscribeAll = function(callbackInfo) {
		return __awaiter(this, void 0, void 0, function() {
			var remotePromise, cachePromise, result;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						remotePromise = this.getOrCreateFetchPromise().then(function(result) {
							_this.logger.debug("Remote config client subscription all mode fetched from remote: ".concat(JSON.stringify(result)));
							_this.sendCallback(callbackInfo, result, "remote");
							_this.storage.setConfig(result);
						});
						cachePromise = this.storage.fetchConfig().then(function(result) {
							return result;
						});
						return [4, Promise.race([remotePromise, cachePromise])];
					case 1:
						result = _a.sent();
						if (result !== void 0) {
							this.logger.debug("Remote config client subscription all mode fetched from cache: ".concat(JSON.stringify(result)));
							if (result.remoteConfig !== null) this.sendCallback(callbackInfo, result, "cache");
							else this.logger.debug("Remote config client skips sending callback because cache is empty (first time user).");
						}
						return [4, remotePromise];
					case 2:
						_a.sent();
						return [2];
				}
			});
		});
	};
	/**
	* Waits for a remote response until the given timeout, then return a cached copy, if available.
	*/
	RemoteConfigClient.prototype.subscribeWaitForRemote = function(callbackInfo, timeout) {
		return __awaiter(this, void 0, void 0, function() {
			var timeoutPromise, result, result;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						timeoutPromise = new Promise(function(_, reject) {
							setTimeout(function() {
								reject("Timeout exceeded");
							}, timeout);
						});
						_a.label = 1;
					case 1:
						_a.trys.push([
							1,
							3,
							,
							5
						]);
						return [4, Promise.race([this.getOrCreateFetchPromise(), timeoutPromise])];
					case 2:
						result = _a.sent();
						this.logger.debug("Remote config client subscription wait for remote mode returns from remote.");
						this.sendCallback(callbackInfo, result, "remote");
						this.storage.setConfig(result);
						return [3, 5];
					case 3:
						_a.sent();
						this.logger.debug("Remote config client subscription wait for remote mode exceeded timeout. Try to fetch from cache.");
						return [4, this.storage.fetchConfig()];
					case 4:
						result = _a.sent();
						if (result.remoteConfig !== null) {
							this.logger.debug("Remote config client subscription wait for remote mode returns a cached copy.");
							this.sendCallback(callbackInfo, result, "cache");
						} else {
							this.logger.debug("Remote config client subscription wait for remote mode failed to fetch cache.");
							this.sendCallback(callbackInfo, result, "remote");
						}
						return [3, 5];
					case 5: return [2];
				}
			});
		});
	};
	/**
	* Call the callback with filtered remote config based on key.
	* @param remoteConfigInfo - the whole remote config object without filtering by key.
	*/
	RemoteConfigClient.prototype.sendCallback = function(callbackInfo, remoteConfigInfo, source) {
		callbackInfo.lastCallback = /* @__PURE__ */ new Date();
		var filteredConfig;
		if (callbackInfo.key) filteredConfig = callbackInfo.key.split(".").reduce(function(config, key) {
			if (config === null) return config;
			return key in config ? config[key] : null;
		}, remoteConfigInfo.remoteConfig);
		else filteredConfig = remoteConfigInfo.remoteConfig;
		callbackInfo.callback(filteredConfig, source, remoteConfigInfo.lastFetch);
	};
	/**
	* Fetch remote config from remote.
	* @param retries - the number of retries. default is 3.
	* @param timeout - the timeout in milliseconds. Default is 1000.
	* This timeout serves two purposes:
	* 1. It determines how long to wait for each remote config fetch request before aborting it.
	*    If the fetch does not complete within the specified timeout, the request is cancelled using AbortController,
	*    and the attempt is considered failed (and may be retried if retries remain).
	* 2. It is also used to calculate the interval between retries. The total timeout is divided by the number of retries,
	*    so each retry waits for (timeout / retries) milliseconds before the next attempt (linear backoff).
	* Retry behavior by status code:
	* - 401: invalid API key (stop retries and disable future updateConfigs calls).
	* - 429: retry up to max retries.
	* - other 4xx: no retry.
	* - 5xx and network failures: retry up to max retries.
	* @returns the remote config info. null if failed to fetch or the response is not valid JSON.
	*/
	RemoteConfigClient.prototype.fetch = function(retries, timeout) {
		if (retries === void 0) retries = 3;
		if (timeout === void 0) timeout = DEFAULT_TIMEOUT;
		return __awaiter(this, void 0, void 0, function() {
			var interval, failedRemoteConfigInfo, _loop_1, this_1, attempt, state_1;
			var _this = this;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						interval = timeout / retries;
						failedRemoteConfigInfo = {
							remoteConfig: null,
							lastFetch: /* @__PURE__ */ new Date()
						};
						_loop_1 = function(attempt) {
							var shouldRetry, abortController, timeoutId, res, body, remoteConfig, error_2;
							return __generator(this, function(_b) {
								switch (_b.label) {
									case 0:
										shouldRetry = true;
										abortController = new AbortController();
										timeoutId = setTimeout(function() {
											return abortController.abort();
										}, timeout);
										_b.label = 1;
									case 1:
										_b.trys.push([
											1,
											7,
											8,
											9
										]);
										return [4, fetch(this_1.getUrlParams(), {
											method: "GET",
											headers: { Accept: "*/*" },
											signal: abortController.signal
										})];
									case 2:
										res = _b.sent();
										if (!!res.ok) return [3, 4];
										return [4, res.text()];
									case 3:
										body = _b.sent();
										this_1.logger.debug("Remote config client fetch with retry time ".concat(retries, " failed with ").concat(res.status, ": ").concat(body));
										if (res.status === CODE_STATUS.INVALID_API_KEY || res.status === CODE_STATUS.FORBIDDEN) {
											this_1.logger.error("Remote config client fetch failed with ".concat(res.status, ". Invalid API key; future fetches will be skipped."));
											this_1.isLastFetchInvalidApiKey = true;
											shouldRetry = false;
										} else if (res.status >= 400 && res.status < 500 && res.status !== CODE_STATUS.RATE_LIMIT) shouldRetry = false;
										return [3, 6];
									case 4: return [4, res.json()];
									case 5:
										remoteConfig = _b.sent();
										return [2, { value: {
											remoteConfig,
											lastFetch: /* @__PURE__ */ new Date()
										} }];
									case 6: return [3, 9];
									case 7:
										error_2 = _b.sent();
										if (error_2 instanceof Error && error_2.name === "AbortError") this_1.logger.debug("Remote config client fetch with retry time ".concat(retries, " timed out after ").concat(timeout, "ms"));
										else this_1.logger.debug("Remote config client fetch with retry time ".concat(retries, " is rejected because: "), error_2);
										return [3, 9];
									case 8:
										clearTimeout(timeoutId);
										return [7];
									case 9:
										if (!shouldRetry) return [2, "break"];
										if (!(attempt < retries - 1)) return [3, 11];
										return [4, new Promise(function(resolve) {
											return setTimeout(resolve, _this.getJitterDelay(interval));
										})];
									case 10:
										_b.sent();
										_b.label = 11;
									case 11: return [2];
								}
							});
						};
						this_1 = this;
						attempt = 0;
						_a.label = 1;
					case 1:
						if (!(attempt < retries)) return [3, 4];
						return [5, _loop_1(attempt)];
					case 2:
						state_1 = _a.sent();
						if (typeof state_1 === "object") return [2, state_1.value];
						if (state_1 === "break") return [3, 4];
						_a.label = 3;
					case 3:
						attempt++;
						return [3, 1];
					case 4: return [2, failedRemoteConfigInfo];
				}
			});
		});
	};
	/**
	* Return jitter in the bound of [0,baseDelay) and then floor round.
	*/
	RemoteConfigClient.prototype.getJitterDelay = function(baseDelay) {
		return Math.floor(Math.random() * baseDelay);
	};
	RemoteConfigClient.prototype.getUrlParams = function() {
		var encodedApiKey = encodeURIComponent(this.apiKey);
		var urlParams = new URLSearchParams();
		urlParams.append("config_group", RemoteConfigClient.CONFIG_GROUP);
		return "".concat(this.serverUrl, "/").concat(encodedApiKey, "?").concat(urlParams.toString());
	};
	RemoteConfigClient.CONFIG_GROUP = "browser";
	return RemoteConfigClient;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/observers/console.js
var globalScope$1 = getGlobalScope$1();
/* istanbul ignore next */
var originalConsole = globalScope$1 === null || globalScope$1 === void 0 ? void 0 : globalScope$1.console;
var handlers = {};
var originalFn = {};
var inConsoleOverride = false;
function overrideConsole(logLevel) {
	/* istanbul ignore if */
	if (!originalConsole) return false;
	if (typeof originalConsole[logLevel] !== "function") return false;
	if (originalFn[logLevel]) return true;
	var handler = function() {
		var args = [];
		for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
		try {
			if (handlers[logLevel] && !inConsoleOverride) {
				inConsoleOverride = true;
				var callbacks = handlers[logLevel];
				if (callbacks) callbacks.forEach(function(callback) {
					try {
						callback(logLevel, args);
					} catch (_a) {}
				});
			}
		} catch (_a) {}
		inConsoleOverride = false;
		return originalFn[logLevel].apply(originalConsole, args);
	};
	originalFn[logLevel] = originalConsole[logLevel];
	originalConsole[logLevel] = handler;
	return true;
}
/**
* Observe a console log method (log, warn, error, etc.)
* @param level - The console log level to observe
* @param callback - The callback function to call when the console log level is observed
*/
function addListener(level, callback) {
	/* istanbul ignore if */
	if (!overrideConsole(level)) return /* @__PURE__ */ new Error("Console override failed");
	if (handlers[level]) handlers[level].push(callback);
	else handlers[level] = [callback];
}
/**
* Disconnect a callback function from a console log method
* @param callback - The callback function to disconnect
*/
function removeListener(callback) {
	var e_1, _a;
	try {
		for (var _b = __values$1(Object.values(handlers)), _c = _b.next(); !_c.done; _c = _b.next()) {
			var callbacks = _c.value;
			for (var i = callbacks.length - 1; i >= 0; i--) if (callbacks[i] === callback) {
				callbacks.splice(i, 1);
				break;
			}
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
}
function _restoreConsole() {
	var e_2, _a;
	try {
		for (var _b = __values$1(Object.entries(originalFn)), _c = _b.next(); !_c.done; _c = _b.next()) {
			var _d = __read$1(_c.value, 2), key = _d[0], originalHandler = _d[1];
			if (originalHandler) originalConsole[key] = originalHandler;
		}
	} catch (e_2_1) {
		e_2 = { error: e_2_1 };
	} finally {
		try {
			if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
		} finally {
			if (e_2) throw e_2.error;
		}
	}
	originalFn = {};
	handlers = {};
}
var consoleObserver = {
	addListener,
	removeListener,
	_restoreConsole
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/types/element-interactions.js
/**
* Default CSS selectors to define which elements on the page to track.
* Extend this list to include additional elements to track. For example:
* ```
* autocapturePlugin({
*    cssSelectorAllowlist: [...DEFAULT_CSS_SELECTOR_ALLOWLIST, ".my-class"],
* })
* ```
*/
var DEFAULT_CSS_SELECTOR_ALLOWLIST = [
	"a",
	"button",
	"input",
	"select",
	"textarea",
	"label",
	"video",
	"audio",
	"[contenteditable=\"true\" i]",
	"[data-amp-default-track]",
	".amp-default-track"
];
/**
* Default prefix to allow the plugin to capture data attributes as an event property.
*/
var DEFAULT_DATA_ATTRIBUTE_PREFIX = "data-amp-track-";
/**
* Default list of elements on the page should be tracked when the page changes.
*/
var DEFAULT_ACTION_CLICK_ALLOWLIST = [
	"div",
	"span",
	"h1",
	"h2",
	"h3",
	"h4",
	"h5",
	"h6"
];
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/types/frustration-interactions.js
var DEFAULT_ERROR_AND_DEAD_CLICK_ALLOWLIST = __spreadArray([
	"input[type=\"button\"]",
	"input[type=\"submit\"]",
	"input[type=\"reset\"]",
	"input[type=\"image\"]",
	"input[type=\"file\"]"
], __read$1([
	"a",
	"button",
	"[role=\"button\"]",
	"[role=\"link\"]",
	"[role=\"menuitem\"]",
	"[role=\"menuitemcheckbox\"]",
	"[role=\"menuitemradio\"]",
	"[role=\"option\"]",
	"[role=\"tab\"]",
	"[role=\"treeitem\"]",
	"[contenteditable=\"true\" i]"
]), false);
/**
* Default CSS selectors for dead clicks tracking
*/
var DEFAULT_DEAD_CLICK_ALLOWLIST = DEFAULT_ERROR_AND_DEAD_CLICK_ALLOWLIST;
/**
* Default CSS selectors for error tracking
*/
var DEFAULT_ERROR_CLICK_ALLOWLIST = DEFAULT_ERROR_AND_DEAD_CLICK_ALLOWLIST;
/**
* Default CSS selectors for rage clicks tracking
*/
var DEFAULT_RAGE_CLICK_ALLOWLIST = ["*"];
/**
* Default time window for rage clicks (1 second)
*/
var DEFAULT_RAGE_CLICK_WINDOW_MS = 1e3;
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/campaign/campaign-parser.js
var CampaignParser$1 = function() {
	function CampaignParser() {}
	CampaignParser.prototype.parse = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, __assign$1(__assign$1(__assign$1(__assign$1({}, BASE_CAMPAIGN$1), this.getUtmParam()), this.getReferrer()), this.getClickIds())];
			});
		});
	};
	CampaignParser.prototype.getUtmParam = function() {
		var params = getQueryParams$1();
		return {
			utm_campaign: params[UTM_CAMPAIGN$1],
			utm_content: params[UTM_CONTENT$1],
			utm_id: params[UTM_ID$1],
			utm_medium: params[UTM_MEDIUM$1],
			utm_source: params[UTM_SOURCE$1],
			utm_term: params[UTM_TERM$1]
		};
	};
	CampaignParser.prototype.getReferrer = function() {
		var _a, _b;
		var data = {
			referrer: void 0,
			referring_domain: void 0
		};
		try {
			data.referrer = document.referrer || void 0;
			data.referring_domain = (_b = (_a = data.referrer) === null || _a === void 0 ? void 0 : _a.split("/")[2]) !== null && _b !== void 0 ? _b : void 0;
		} catch (_c) {}
		return data;
	};
	CampaignParser.prototype.getClickIds = function() {
		var _a;
		var params = getQueryParams$1();
		return _a = {}, _a[DCLID$1] = params[DCLID$1], _a[FBCLID$1] = params[FBCLID$1], _a[GBRAID$1] = params[GBRAID$1], _a[GCLID$1] = params[GCLID$1], _a[KO_CLICK_ID$1] = params[KO_CLICK_ID$1], _a[LI_FAT_ID$1] = params[LI_FAT_ID$1], _a[MSCLKID$1] = params[MSCLKID$1], _a[RDT_CID$1] = params[RDT_CID$1], _a[TTCLID$1] = params[TTCLID$1], _a[TWCLID$1] = params[TWCLID$1], _a[WBRAID$1] = params[WBRAID$1], _a;
	};
	return CampaignParser;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/plugins/helpers.js
var TEXT_MASK_ATTRIBUTE$1 = "data-amp-mask";
var MASKED_TEXT_VALUE$1 = "*****";
var CC_REGEX$1 = /\b(?:\d[ -]*?){13,16}\b/;
var SSN_REGEX$1 = /(\d{3}-?\d{2}-?\d{4})/g;
var EMAIL_REGEX$1 = /[^\s@]+@[^\s@.]+\.[^\s@]+/g;
/**
* Replaces sensitive strings (credit cards, SSNs, emails) and custom patterns with masked text
* @param text - The text to search for sensitive data
* @param additionalMaskTextPatterns - Optional array of additional regex patterns to mask
* @returns The text with sensitive data replaced by masked text
*/
var replaceSensitiveString$1 = function(text, additionalMaskTextPatterns) {
	var e_1, _a;
	if (additionalMaskTextPatterns === void 0) additionalMaskTextPatterns = [];
	if (typeof text !== "string") return "";
	var result = text;
	result = result.replace(CC_REGEX$1, MASKED_TEXT_VALUE$1);
	result = result.replace(SSN_REGEX$1, MASKED_TEXT_VALUE$1);
	result = result.replace(EMAIL_REGEX$1, MASKED_TEXT_VALUE$1);
	try {
		for (var additionalMaskTextPatterns_1 = __values$1(additionalMaskTextPatterns), additionalMaskTextPatterns_1_1 = additionalMaskTextPatterns_1.next(); !additionalMaskTextPatterns_1_1.done; additionalMaskTextPatterns_1_1 = additionalMaskTextPatterns_1.next()) {
			var pattern = additionalMaskTextPatterns_1_1.value;
			try {
				result = result.replace(pattern, MASKED_TEXT_VALUE$1);
			} catch (_b) {}
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (additionalMaskTextPatterns_1_1 && !additionalMaskTextPatterns_1_1.done && (_a = additionalMaskTextPatterns_1.return)) _a.call(additionalMaskTextPatterns_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	return result;
};
/**
* Gets the page title, checking if the title element has data-amp-mask attribute
* @returns The page title, masked if the title element has data-amp-mask attribute
*/
var getPageTitle$1 = function(parseTitleFunction) {
	if (typeof document === "undefined" || !document.title) return "";
	var titleElement = document.querySelector("title");
	if (titleElement && titleElement.hasAttribute("data-amp-mask")) return MASKED_TEXT_VALUE$1;
	return parseTitleFunction ? parseTitleFunction(document.title) : document.title;
};
//#endregion
//#region ../../node_modules/.pnpm/zen-observable@0.10.0/node_modules/zen-observable/lib/Observable.js
var require_Observable = /* @__PURE__ */ __commonJSMin(((exports) => {
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.Observable = void 0;
	var hasSymbol = (name) => Boolean(Symbol[name]);
	var getSymbol = (name) => hasSymbol(name) ? Symbol[name] : "@@" + name;
	var SymbolIterator = getSymbol("iterator");
	var SymbolObservable = getSymbol("observable");
	var SymbolSpecies = getSymbol("species");
	function getMethod(obj, key) {
		let value = obj[key];
		if (value == null) return void 0;
		if (typeof value !== "function") throw new TypeError(value + " is not a function");
		return value;
	}
	function getSpecies(obj) {
		let ctor = obj.constructor;
		if (ctor !== void 0) {
			ctor = ctor[SymbolSpecies];
			if (ctor === null) ctor = void 0;
		}
		return ctor !== void 0 ? ctor : Observable;
	}
	function isObservable(x) {
		return x instanceof Observable;
	}
	function hostReportError(e) {
		if (hostReportError.log) hostReportError.log(e);
		else setTimeout(() => {
			throw e;
		});
	}
	function enqueue(fn) {
		Promise.resolve().then(() => {
			try {
				fn();
			} catch (e) {
				hostReportError(e);
			}
		});
	}
	function cleanupSubscription(subscription) {
		let cleanup = subscription._cleanup;
		if (cleanup === void 0) return;
		subscription._cleanup = void 0;
		if (!cleanup) return;
		try {
			if (typeof cleanup === "function") cleanup();
			else {
				let unsubscribe = getMethod(cleanup, "unsubscribe");
				if (unsubscribe) unsubscribe.call(cleanup);
			}
		} catch (e) {
			hostReportError(e);
		}
	}
	function closeSubscription(subscription) {
		subscription._observer = void 0;
		subscription._queue = void 0;
		subscription._state = "closed";
	}
	function flushSubscription(subscription) {
		let queue = subscription._queue;
		if (!queue) return;
		subscription._queue = void 0;
		subscription._state = "ready";
		for (let i = 0; i < queue.length; ++i) {
			notifySubscription(subscription, queue[i].type, queue[i].value);
			if (subscription._state === "closed") break;
		}
	}
	function notifySubscription(subscription, type, value) {
		subscription._state = "running";
		let observer = subscription._observer;
		try {
			let m = getMethod(observer, type);
			switch (type) {
				case "next":
					if (m) m.call(observer, value);
					break;
				case "error":
					closeSubscription(subscription);
					if (m) m.call(observer, value);
					else throw value;
					break;
				case "complete":
					closeSubscription(subscription);
					if (m) m.call(observer);
					break;
			}
		} catch (e) {
			hostReportError(e);
		}
		if (subscription._state === "closed") cleanupSubscription(subscription);
		else if (subscription._state === "running") subscription._state = "ready";
	}
	function onNotify(subscription, type, value) {
		if (subscription._state === "closed") return;
		if (subscription._state === "buffering") {
			subscription._queue.push({
				type,
				value
			});
			return;
		}
		if (subscription._state !== "ready") {
			subscription._state = "buffering";
			subscription._queue = [{
				type,
				value
			}];
			enqueue(() => flushSubscription(subscription));
			return;
		}
		notifySubscription(subscription, type, value);
	}
	var Subscription = class {
		constructor(observer, subscriber) {
			this._cleanup = void 0;
			this._observer = observer;
			this._queue = void 0;
			this._state = "initializing";
			let self = this;
			let subscriptionObserver = {
				get closed() {
					return self._state === "closed";
				},
				next(value) {
					onNotify(self, "next", value);
				},
				error(value) {
					onNotify(self, "error", value);
				},
				complete() {
					onNotify(self, "complete");
				}
			};
			try {
				this._cleanup = subscriber.call(void 0, subscriptionObserver);
			} catch (e) {
				subscriptionObserver.error(e);
			}
			if (this._state === "initializing") this._state = "ready";
		}
		get closed() {
			return this._state === "closed";
		}
		unsubscribe() {
			if (this._state !== "closed") {
				closeSubscription(this);
				cleanupSubscription(this);
			}
		}
	};
	var Observable = class Observable {
		constructor(subscriber) {
			if (!(this instanceof Observable)) throw new TypeError("Observable cannot be called as a function");
			if (typeof subscriber !== "function") throw new TypeError("Observable initializer must be a function");
			this._subscriber = subscriber;
		}
		subscribe(observer) {
			if (typeof observer !== "object" || observer === null) observer = {
				next: observer,
				error: arguments[1],
				complete: arguments[2]
			};
			return new Subscription(observer, this._subscriber);
		}
		forEach(fn) {
			return new Promise((resolve, reject) => {
				if (typeof fn !== "function") {
					reject(/* @__PURE__ */ new TypeError(fn + " is not a function"));
					return;
				}
				function done() {
					subscription.unsubscribe();
					resolve();
				}
				let subscription = this.subscribe({
					next(value) {
						try {
							fn(value, done);
						} catch (e) {
							reject(e);
							subscription.unsubscribe();
						}
					},
					error: reject,
					complete: resolve
				});
			});
		}
		map(fn) {
			if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
			return new (getSpecies(this))((observer) => this.subscribe({
				next(value) {
					try {
						value = fn(value);
					} catch (e) {
						return observer.error(e);
					}
					observer.next(value);
				},
				error(e) {
					observer.error(e);
				},
				complete() {
					observer.complete();
				}
			}));
		}
		filter(fn) {
			if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
			return new (getSpecies(this))((observer) => this.subscribe({
				next(value) {
					try {
						if (!fn(value)) return;
					} catch (e) {
						return observer.error(e);
					}
					observer.next(value);
				},
				error(e) {
					observer.error(e);
				},
				complete() {
					observer.complete();
				}
			}));
		}
		reduce(fn) {
			if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
			let C = getSpecies(this);
			let hasSeed = arguments.length > 1;
			let hasValue = false;
			let acc = arguments[1];
			return new C((observer) => this.subscribe({
				next(value) {
					let first = !hasValue;
					hasValue = true;
					if (!first || hasSeed) try {
						acc = fn(acc, value);
					} catch (e) {
						return observer.error(e);
					}
					else acc = value;
				},
				error(e) {
					observer.error(e);
				},
				complete() {
					if (!hasValue && !hasSeed) return observer.error(/* @__PURE__ */ new TypeError("Cannot reduce an empty sequence"));
					observer.next(acc);
					observer.complete();
				}
			}));
		}
		async all() {
			let values = [];
			await this.forEach((value) => values.push(value));
			return values;
		}
		concat(...sources) {
			let C = getSpecies(this);
			return new C((observer) => {
				let subscription;
				let index = 0;
				function startNext(next) {
					subscription = next.subscribe({
						next(v) {
							observer.next(v);
						},
						error(e) {
							observer.error(e);
						},
						complete() {
							if (index === sources.length) {
								subscription = void 0;
								observer.complete();
							} else startNext(C.from(sources[index++]));
						}
					});
				}
				startNext(this);
				return () => {
					if (subscription) {
						subscription.unsubscribe();
						subscription = void 0;
					}
				};
			});
		}
		flatMap(fn) {
			if (typeof fn !== "function") throw new TypeError(fn + " is not a function");
			let C = getSpecies(this);
			return new C((observer) => {
				let subscriptions = [];
				let outer = this.subscribe({
					next(value) {
						if (fn) try {
							value = fn(value);
						} catch (e) {
							return observer.error(e);
						}
						let inner = C.from(value).subscribe({
							next(value) {
								observer.next(value);
							},
							error(e) {
								observer.error(e);
							},
							complete() {
								let i = subscriptions.indexOf(inner);
								if (i >= 0) subscriptions.splice(i, 1);
								completeIfDone();
							}
						});
						subscriptions.push(inner);
					},
					error(e) {
						observer.error(e);
					},
					complete() {
						completeIfDone();
					}
				});
				function completeIfDone() {
					if (outer.closed && subscriptions.length === 0) observer.complete();
				}
				return () => {
					subscriptions.forEach((s) => s.unsubscribe());
					outer.unsubscribe();
				};
			});
		}
		[SymbolObservable]() {
			return this;
		}
		static from(x) {
			let C = typeof this === "function" ? this : Observable;
			if (x == null) throw new TypeError(x + " is not an object");
			let method = getMethod(x, SymbolObservable);
			if (method) {
				let observable = method.call(x);
				if (Object(observable) !== observable) throw new TypeError(observable + " is not an object");
				if (isObservable(observable) && observable.constructor === C) return observable;
				return new C((observer) => observable.subscribe(observer));
			}
			if (hasSymbol("iterator")) {
				method = getMethod(x, SymbolIterator);
				if (method) return new C((observer) => {
					enqueue(() => {
						if (observer.closed) return;
						for (let item of method.call(x)) {
							observer.next(item);
							if (observer.closed) return;
						}
						observer.complete();
					});
				});
			}
			if (Array.isArray(x)) return new C((observer) => {
				enqueue(() => {
					if (observer.closed) return;
					for (let i = 0; i < x.length; ++i) {
						observer.next(x[i]);
						if (observer.closed) return;
					}
					observer.complete();
				});
			});
			throw new TypeError(x + " is not observable");
		}
		static of(...items) {
			return new (typeof this === "function" ? this : Observable)((observer) => {
				enqueue(() => {
					if (observer.closed) return;
					for (let i = 0; i < items.length; ++i) {
						observer.next(items[i]);
						if (observer.closed) return;
					}
					observer.complete();
				});
			});
		}
		static get [SymbolSpecies]() {
			return this;
		}
	};
	exports.Observable = Observable;
	Object.defineProperty(Observable, Symbol("extensions"), {
		value: {
			symbol: SymbolObservable,
			hostReportError
		},
		configurable: true
	});
}));
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/observable.js
var import_zen_observable = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_Observable().Observable;
})))());
/**
* asyncMap operator for Zen Observable
*
* Maps each value emitted by the source Observable using an async function,
* emitting the resolved values in the same order they arrive.
*/
function asyncMap(observable, fn) {
	return new import_zen_observable.default(function(observer) {
		observable.subscribe({
			next: function(value) {
				fn(value).then(function(result) {
					return observer.next(result);
				}).catch(function(error) {
					return observer.error(error);
				});
			},
			error: function(error) {
				observer.error(error);
			},
			complete: function() {
				observer.complete();
			}
		});
	});
}
/**
* merge operator for Zen Observable
*
* Merges two observables into a single observable, emitting values from both sources in the order they arrive.
* @param sourceA Observable to merge
* @param sourceB Observable to merge
* @returns Unsubscribable cleanup function
*/
function merge(sourceA, sourceB) {
	return new import_zen_observable.default(function(observer) {
		var closed = false;
		var subscriptions = /* @__PURE__ */ new Set();
		var cleanup = function() {
			var e_1, _a;
			closed = true;
			try {
				for (var subscriptions_1 = __values$1(subscriptions), subscriptions_1_1 = subscriptions_1.next(); !subscriptions_1_1.done; subscriptions_1_1 = subscriptions_1.next()) {
					var sub = subscriptions_1_1.value;
					try {
						sub.unsubscribe();
					} catch (_b) {}
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (subscriptions_1_1 && !subscriptions_1_1.done && (_a = subscriptions_1.return)) _a.call(subscriptions_1);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
			subscriptions.clear();
		};
		var subscribeTo = function(source) {
			var sub = source.subscribe({
				next: function(value) {
					if (!closed) observer.next(value);
				},
				error: function(err) {
					if (!closed) {
						closed = true;
						observer.error(err);
						cleanup();
					}
				},
				complete: function() {
					subscriptions.delete(sub);
					if (!closed && subscriptions.size === 0) {
						observer.complete();
						cleanup();
						closed = true;
					}
				}
			});
			subscriptions.add(sub);
		};
		subscribeTo(sourceA);
		subscribeTo(sourceB);
		return cleanup;
	});
}
function multicast(source) {
	var observers = /* @__PURE__ */ new Set();
	var subscription = null;
	function cleanup() {
		/* istanbul ignore next */
		subscription === null || subscription === void 0 || subscription.unsubscribe();
		subscription = null;
		observers.clear();
	}
	return new import_zen_observable.default(function(observer) {
		observers.add(observer);
		if (subscription === null) subscription = source.subscribe({
			next: function(value) {
				var e_2, _a;
				var _b;
				try {
					for (var observers_1 = __values$1(observers), observers_1_1 = observers_1.next(); !observers_1_1.done; observers_1_1 = observers_1.next()) {
						var obs = observers_1_1.value;
						/* istanbul ignore next */
						(_b = obs.next) === null || _b === void 0 || _b.call(obs, value);
					}
				} catch (e_2_1) {
					e_2 = { error: e_2_1 };
				} finally {
					try {
						if (observers_1_1 && !observers_1_1.done && (_a = observers_1.return)) _a.call(observers_1);
					} finally {
						if (e_2) throw e_2.error;
					}
				}
			},
			error: function(err) {
				var e_3, _a;
				var _b;
				try {
					for (var observers_2 = __values$1(observers), observers_2_1 = observers_2.next(); !observers_2_1.done; observers_2_1 = observers_2.next()) {
						var obs = observers_2_1.value;
						/* istanbul ignore next */
						(_b = obs.error) === null || _b === void 0 || _b.call(obs, err);
					}
				} catch (e_3_1) {
					e_3 = { error: e_3_1 };
				} finally {
					try {
						if (observers_2_1 && !observers_2_1.done && (_a = observers_2.return)) _a.call(observers_2);
					} finally {
						if (e_3) throw e_3.error;
					}
				}
				cleanup();
			},
			complete: function() {
				var e_4, _a;
				var _b;
				try {
					for (var observers_3 = __values$1(observers), observers_3_1 = observers_3.next(); !observers_3_1.done; observers_3_1 = observers_3.next()) {
						var obs = observers_3_1.value;
						/* istanbul ignore next */
						(_b = obs.complete) === null || _b === void 0 || _b.call(obs);
					}
				} catch (e_4_1) {
					e_4 = { error: e_4_1 };
				} finally {
					try {
						if (observers_3_1 && !observers_3_1.done && (_a = observers_3.return)) _a.call(observers_3);
					} finally {
						if (e_4) throw e_4.error;
					}
				}
				cleanup();
			}
		});
		return function() {
			observers.delete(observer);
			if (observers.size === 0 && subscription) {
				subscription.unsubscribe();
				subscription = null;
			}
		};
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/safe-stringify.js
var import_safe_json_stringify = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var hasProp = Object.prototype.hasOwnProperty;
	function throwsMessage(err) {
		return "[Throws: " + (err ? err.message : "?") + "]";
	}
	function safeGetValueFromPropertyOnObject(obj, property) {
		if (hasProp.call(obj, property)) try {
			return obj[property];
		} catch (err) {
			return throwsMessage(err);
		}
		return obj[property];
	}
	function ensureProperties(obj) {
		var seen = [];
		function visit(obj) {
			if (obj === null || typeof obj !== "object") return obj;
			if (seen.indexOf(obj) !== -1) return "[Circular]";
			seen.push(obj);
			if (typeof obj.toJSON === "function") try {
				var fResult = visit(obj.toJSON());
				seen.pop();
				return fResult;
			} catch (err) {
				return throwsMessage(err);
			}
			if (Array.isArray(obj)) {
				var aResult = obj.map(visit);
				seen.pop();
				return aResult;
			}
			var result = Object.keys(obj).reduce(function(result, prop) {
				result[prop] = visit(safeGetValueFromPropertyOnObject(obj, prop));
				return result;
			}, {});
			seen.pop();
			return result;
		}
		return visit(obj);
	}
	module.exports = function(data, replacer, space) {
		return JSON.stringify(ensureProperties(data), replacer, space);
	};
	module.exports.ensureProperties = ensureProperties;
})))());
/* istanbul ignore next */
var safeJsonStringify = import_safe_json_stringify.default || import_safe_json_stringify;
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/messenger/constants.js
var AMPLITUDE_ORIGIN = "https://app.amplitude.com";
var AMPLITUDE_ORIGINS_MAP = {
	US: AMPLITUDE_ORIGIN,
	EU: "https://app.eu.amplitude.com",
	STAGING: "https://apps.stag2.amplitude.com"
};
var AMPLITUDE_BACKGROUND_CAPTURE_SCRIPT_URL = "https://cdn.amplitude.com/libs/background-capture-1.0.0-alpha.3.js.gz";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/messenger/utils.js
/**
* Dynamically loads an external script by appending a <script> tag to the document head.
* Deduplicates by checking if a script with the same src already exists.
*/
var asyncLoadScript = function(url) {
	if (document.querySelector("script[src=\"".concat(CSS.escape(url), "\"]"))) return Promise.resolve({ status: true });
	return new Promise(function(resolve, reject) {
		var _a;
		try {
			var scriptElement = document.createElement("script");
			scriptElement.type = "text/javascript";
			scriptElement.async = true;
			scriptElement.src = url;
			scriptElement.addEventListener("load", function() {
				resolve({ status: true });
			}, { once: true });
			scriptElement.addEventListener("error", function() {
				reject({
					status: false,
					message: "Failed to load the script ".concat(url)
				});
			});
			/* istanbul ignore next */
			(_a = document.head) === null || _a === void 0 || _a.appendChild(scriptElement);
		} catch (error) {
			/* istanbul ignore next */
			reject(error);
		}
	});
};
/**
* Generates a simple unique ID for message request/response correlation.
*/
function generateUniqueId() {
	return "".concat(Date.now(), "-").concat(Math.random().toString(36).substr(2, 9));
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/messenger/base-window-messenger.js
var _a;
/**
* Brand key used to identify BaseWindowMessenger instances across bundle boundaries.
*/
var MESSENGER_BRAND = "__AMPLITUDE_MESSENGER_INSTANCE__";
/** Global scope key where the singleton messenger is stored. */
var MESSENGER_GLOBAL_KEY = "__AMPLITUDE_MESSENGER__";
/**
* BaseWindowMessenger provides generic cross-window communication via postMessage.
* Singleton access via getOrCreateWindowMessenger() to prevent duplicate instances
*/
var BaseWindowMessenger = function() {
	function BaseWindowMessenger(_b) {
		var _d = (_b === void 0 ? {} : _b).origin, origin = _d === void 0 ? AMPLITUDE_ORIGIN : _d;
		/** Brand property for cross-bundle instanceof checks. */
		this[_a] = true;
		this.isSetup = false;
		this.messageHandler = null;
		this.requestCallbacks = {};
		this.actionHandlers = /* @__PURE__ */ new Map();
		/**
		* Messages received for actions that had no registered handler yet.
		* Drained automatically when the corresponding handler is registered via
		* registerActionHandler(), solving startup race conditions between
		* independently-initialized plugins.
		*/
		this.pendingMessages = /* @__PURE__ */ new Map();
		/**
		* Tracks in-flight and completed script loads by URL.
		* Using a map, this prevents duplicate loads before the first resolves.
		*/
		this.scriptLoadPromises = /* @__PURE__ */ new Map();
		this.endpoint = origin;
	}
	/**
	* Send a message to the parent window (window.opener).
	*/
	BaseWindowMessenger.prototype.notify = function(message) {
		var _b, _c, _d, _e;
		(_c = (_b = this.logger) === null || _b === void 0 ? void 0 : _b.debug) === null || _c === void 0 || _c.call(_b, "Message sent: ", JSON.stringify(message));
		(_e = (_d = window.opener) === null || _d === void 0 ? void 0 : _d.postMessage) === null || _e === void 0 || _e.call(_d, message, this.endpoint);
	};
	/**
	* Send an async request to the parent window with a unique ID.
	* Returns a Promise that resolves when the parent responds.
	*/
	BaseWindowMessenger.prototype.sendRequest = function(action, args, options) {
		var _this = this;
		if (options === void 0) options = { timeout: 15e3 };
		var id = generateUniqueId();
		var request = {
			id,
			action,
			args
		};
		return new Promise(function(resolve, reject) {
			_this.requestCallbacks[id] = {
				resolve,
				reject
			};
			_this.notify(request);
			if (options.timeout > 0) setTimeout(function() {
				reject(new Error("".concat(action, " timed out (id: ").concat(id, ")")));
				delete _this.requestCallbacks[id];
			}, options.timeout);
		});
	};
	/**
	* Handle a response to a previous request by resolving its Promise.
	*/
	BaseWindowMessenger.prototype.handleResponse = function(response) {
		var _b;
		if (!this.requestCallbacks[response.id]) {
			(_b = this.logger) === null || _b === void 0 || _b.warn("No callback found for request id: ".concat(response.id));
			return;
		}
		this.requestCallbacks[response.id].resolve(response.responseData);
		delete this.requestCallbacks[response.id];
	};
	/**
	* Register a handler for a specific action type.
	* Logs a warning if overwriting an existing handler.
	*/
	BaseWindowMessenger.prototype.registerActionHandler = function(action, handler) {
		var e_1, _b;
		var _c, _d;
		if (this.actionHandlers.has(action)) (_d = (_c = this.logger) === null || _c === void 0 ? void 0 : _c.warn) === null || _d === void 0 || _d.call(_c, "Overwriting existing action handler for: ".concat(action));
		this.actionHandlers.set(action, handler);
		var queued = this.pendingMessages.get(action);
		if (queued) {
			this.pendingMessages.delete(action);
			try {
				for (var queued_1 = __values$1(queued), queued_1_1 = queued_1.next(); !queued_1_1.done; queued_1_1 = queued_1.next()) {
					var data = queued_1_1.value;
					handler(data);
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (queued_1_1 && !queued_1_1.done && (_b = queued_1.return)) _b.call(queued_1);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
		}
	};
	/**
	* Load a script once, deduplicating by URL.
	* Safe against concurrent calls — the second call awaits the first's in-flight Promise
	* rather than triggering a duplicate load.
	*/
	BaseWindowMessenger.prototype.loadScriptOnce = function(url) {
		return __awaiter(this, void 0, void 0, function() {
			var existing, loadPromise, error_1;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						existing = this.scriptLoadPromises.get(url);
						if (existing) return [2, existing];
						loadPromise = asyncLoadScript(url).then(function() {});
						this.scriptLoadPromises.set(url, loadPromise);
						_b.label = 1;
					case 1:
						_b.trys.push([
							1,
							3,
							,
							4
						]);
						return [4, loadPromise];
					case 2:
						_b.sent();
						return [3, 4];
					case 3:
						error_1 = _b.sent();
						this.scriptLoadPromises.delete(url);
						throw error_1;
					case 4: return [2];
				}
			});
		});
	};
	/**
	* Set up the message listener. Idempotent — safe to call multiple times.
	* Subclasses should call super.setup() and then register their own action handlers.
	*/
	BaseWindowMessenger.prototype.setup = function(_b) {
		var _this = this;
		var _c, _d;
		var _e = _b === void 0 ? {} : _b, logger = _e.logger, endpoint = _e.endpoint;
		if (logger) this.logger = logger;
		if (endpoint && this.endpoint === "https://app.amplitude.com") this.endpoint = endpoint;
		if (this.isSetup) return;
		this.isSetup = true;
		(_d = (_c = this.logger) === null || _c === void 0 ? void 0 : _c.debug) === null || _d === void 0 || _d.call(_c, "Setting up messenger");
		this.messageHandler = function(event) {
			var _b, _c, _d, _e, _f;
			(_c = (_b = _this.logger) === null || _b === void 0 ? void 0 : _b.debug) === null || _c === void 0 || _c.call(_b, "Message received: ", JSON.stringify(event));
			if (_this.endpoint !== event.origin) return;
			var eventData = event.data;
			var action = eventData === null || eventData === void 0 ? void 0 : eventData.action;
			if (!action) return;
			if ("id" in eventData && eventData.id) {
				(_e = (_d = _this.logger) === null || _d === void 0 ? void 0 : _d.debug) === null || _e === void 0 || _e.call(_d, "Received Response to previous request: ", JSON.stringify(event));
				_this.handleResponse(eventData);
			} else {
				if (action === "ping") {
					_this.notify({ action: "pong" });
					return;
				}
				var handler = _this.actionHandlers.get(action);
				if (handler) handler(eventData.data);
				else {
					var queue = (_f = _this.pendingMessages.get(action)) !== null && _f !== void 0 ? _f : [];
					queue.push(eventData.data);
					_this.pendingMessages.set(action, queue);
				}
			}
		};
		window.addEventListener("message", this.messageHandler);
		this.notify({ action: "page-loaded" });
	};
	/**
	* Tear down the messenger: remove the message listener, clear all state.
	*/
	BaseWindowMessenger.prototype.destroy = function() {
		if (this.messageHandler) {
			window.removeEventListener("message", this.messageHandler);
			this.messageHandler = null;
		}
		this.isSetup = false;
		this.actionHandlers.clear();
		this.pendingMessages.clear();
		this.requestCallbacks = {};
		this.scriptLoadPromises.clear();
		var globalScope = getGlobalScope$1();
		if ((globalScope === null || globalScope === void 0 ? void 0 : globalScope[MESSENGER_GLOBAL_KEY]) === this) delete globalScope[MESSENGER_GLOBAL_KEY];
	};
	return BaseWindowMessenger;
}();
_a = MESSENGER_BRAND;
/**
* Type guard: checks whether a value is a BaseWindowMessenger instance.
*/
function isWindowMessenger(value) {
	return typeof value === "object" && value !== null && MESSENGER_BRAND in value && value[MESSENGER_BRAND] === true;
}
/**
* Get or create a singleton BaseWindowMessenger instance.
* Ensures only one messenger (and one message listener) exists per page,
* preventing duplicate script loads and double notifications.
*
* The singleton is stored on globalScope under the same MESSENGER_KEY.
* The branded property check verifies the stored value is actually a messenger.
*/
function getOrCreateWindowMessenger(options) {
	var globalScope = getGlobalScope$1();
	var existing = globalScope === null || globalScope === void 0 ? void 0 : globalScope[MESSENGER_GLOBAL_KEY];
	if (isWindowMessenger(existing)) return existing;
	var messenger = new BaseWindowMessenger(options);
	if (globalScope) globalScope[MESSENGER_GLOBAL_KEY] = messenger;
	return messenger;
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/messenger/background-capture.js
/**
* Brand key set on the messenger instance to track whether background capture
* has been enabled.
*/
var BG_CAPTURE_BRAND = "__AMPLITUDE_BACKGROUND_CAPTURE__";
/**
* Enable background capture on a messenger instance.
* Plugins can call this on a shared messenger instance.
* The first call registers the handlers; subsequent calls are no-ops.
*
* @param messenger - The messenger to enable background capture on
* @param options.scriptUrl - Override the background capture script URL (optional)
*/
function enableBackgroundCapture(messenger, options) {
	var _a;
	var branded = messenger;
	if (branded[BG_CAPTURE_BRAND] === true) return;
	branded[BG_CAPTURE_BRAND] = true;
	var scriptUrl = (_a = options === null || options === void 0 ? void 0 : options.scriptUrl) !== null && _a !== void 0 ? _a : AMPLITUDE_BACKGROUND_CAPTURE_SCRIPT_URL;
	var backgroundCaptureInstance = null;
	var onBackgroundCapture = function(type, backgroundCaptureData) {
		var _a, _b;
		if (type === "background-capture-complete") {
			(_b = (_a = messenger.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 || _b.call(_a, "Background capture complete");
			messenger.notify({
				action: "background-capture-complete",
				data: backgroundCaptureData
			});
		}
	};
	messenger.registerActionHandler("initialize-background-capture", function() {
		var _a, _b;
		(_b = (_a = messenger.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 || _b.call(_a, "Initializing background capture (external script)");
		var resolvedUrl = new URL(scriptUrl, messenger.endpoint).toString();
		messenger.loadScriptOnce(resolvedUrl).then(function() {
			var _a, _b, _c;
			(_b = (_a = messenger.logger) === null || _a === void 0 ? void 0 : _a.debug) === null || _b === void 0 || _b.call(_a, "Background capture script loaded (external)");
			backgroundCaptureInstance = (_c = window === null || window === void 0 ? void 0 : window.amplitudeBackgroundCapture) === null || _c === void 0 ? void 0 : _c.call(window, {
				messenger,
				onBackgroundCapture
			});
			messenger.notify({ action: "background-capture-loaded" });
		}).catch(function() {
			var _a;
			(_a = messenger.logger) === null || _a === void 0 || _a.warn("Failed to initialize background capture");
		});
	});
	messenger.registerActionHandler("close-background-capture", function() {
		var _a;
		(_a = backgroundCaptureInstance === null || backgroundCaptureInstance === void 0 ? void 0 : backgroundCaptureInstance.close) === null || _a === void 0 || _a.call(backgroundCaptureInstance);
		backgroundCaptureInstance = null;
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/types/config/browser-config.js
var EXCLUDE_INTERNAL_REFERRERS_CONDITIONS = {
	always: "always",
	ifEmptyCampaign: "ifEmptyCampaign"
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.1/node_modules/@amplitude/analytics-core/lib/esm/utils/environment.js
function isChromeExtension() {
	var _a, _b;
	var globalScope = getGlobalScope$1();
	return typeof ((_b = (_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.chrome) === null || _a === void 0 ? void 0 : _a.runtime) === null || _b === void 0 ? void 0 : _b.id) === "string";
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/default-tracking.js
/**
* Returns false if autocapture === false or if autocapture[event],
* otherwise returns true (even if "config.autocapture === undefined")
*/
var isTrackingEnabled = function(autocapture, event) {
	if (typeof autocapture === "boolean") return autocapture;
	if ((autocapture === null || autocapture === void 0 ? void 0 : autocapture[event]) === false) return false;
	if (isChromeExtension()) return !!(autocapture === null || autocapture === void 0 ? void 0 : autocapture[event]);
	return true;
};
var isAttributionTrackingEnabled = function(autocapture) {
	return isTrackingEnabled(autocapture, "attribution");
};
var isFileDownloadTrackingEnabled = function(autocapture) {
	return isTrackingEnabled(autocapture, "fileDownloads");
};
var isFormInteractionTrackingEnabled = function(autocapture) {
	return isTrackingEnabled(autocapture, "formInteractions");
};
var isPageViewTrackingEnabled = function(autocapture) {
	return isTrackingEnabled(autocapture, "pageViews");
};
var isSessionTrackingEnabled = function(autocapture) {
	return isTrackingEnabled(autocapture, "sessions");
};
var isPageUrlEnrichmentEnabled = function(autocapture) {
	return isTrackingEnabled(autocapture, "pageUrlEnrichment");
};
/**
* Returns true if
* 1. if autocapture.networkTracking === true
* 2. if autocapture.networkTracking === object
* otherwise returns false
*/
var isNetworkTrackingEnabled = function(autocapture) {
	if (typeof autocapture === "boolean") return autocapture;
	if (typeof autocapture === "object" && (autocapture.networkTracking === true || typeof autocapture.networkTracking === "object")) return true;
	return false;
};
/**
* Returns true if
* 1. autocapture === true
* 2. if autocapture.elementInteractions === true
* 3. if autocapture.elementInteractions === object
* otherwise returns false
*/
var isElementInteractionsEnabled = function(autocapture) {
	if (typeof autocapture === "boolean") return autocapture;
	if (typeof autocapture === "object" && (autocapture.elementInteractions === true || typeof autocapture.elementInteractions === "object")) return true;
	return false;
};
/**
* Returns true if
* 1. autocapture === true
* 2. if autocapture.webVitals === true
* otherwise returns false
*/
var isWebVitalsEnabled = function(autocapture) {
	if (typeof autocapture === "boolean") return autocapture;
	if (typeof autocapture === "object" && autocapture.webVitals === true) return true;
	return false;
};
var isFrustrationInteractionsEnabled = function(autocapture) {
	if (typeof autocapture === "boolean") return autocapture;
	if (typeof autocapture === "object" && (autocapture.frustrationInteractions === true || typeof autocapture.frustrationInteractions === "object")) return true;
	return false;
};
var isPerformanceTrackingEnabled = function(autocapture) {
	if (typeof autocapture === "object" && (autocapture.performanceTracking === true || typeof autocapture.performanceTracking === "object")) return true;
	return false;
};
var getPerformanceTrackingConfig = function(config) {
	if (typeof config.autocapture !== "object") return;
	var performanceTracking = config.autocapture.performanceTracking;
	if (performanceTracking === true) return { mainThreadBlock: true };
	if (typeof performanceTracking === "object" && performanceTracking !== null) return performanceTracking;
};
var isCustomEnrichmentEnabled = function(customEnrichment) {
	if (typeof customEnrichment === "boolean") return customEnrichment;
	if (typeof customEnrichment === "object" && customEnrichment !== null && customEnrichment.enabled !== false) return true;
	return false;
};
var getElementInteractionsConfig = function(config) {
	if (isElementInteractionsEnabled(config.autocapture) && typeof config.autocapture === "object" && typeof config.autocapture.elementInteractions === "object") return config.autocapture.elementInteractions;
};
var getFrustrationInteractionsConfig = function(config) {
	if (isFrustrationInteractionsEnabled(config.autocapture) && typeof config.autocapture === "object" && typeof config.autocapture.frustrationInteractions === "object") return config.autocapture.frustrationInteractions;
};
var getNetworkTrackingConfig = function(config) {
	var _a;
	if (isNetworkTrackingEnabled(config.autocapture)) {
		var networkTrackingConfig = void 0;
		if (typeof config.autocapture === "object" && typeof config.autocapture.networkTracking === "object") networkTrackingConfig = config.autocapture.networkTracking;
		else if (config.networkTrackingOptions) networkTrackingConfig = config.networkTrackingOptions;
		return __assign$1(__assign$1({}, networkTrackingConfig), { captureRules: (_a = networkTrackingConfig === null || networkTrackingConfig === void 0 ? void 0 : networkTrackingConfig.captureRules) === null || _a === void 0 ? void 0 : _a.map(function(rule) {
			var _a, _b, _c;
			if (((_a = rule.urls) === null || _a === void 0 ? void 0 : _a.length) && ((_b = rule.hosts) === null || _b === void 0 ? void 0 : _b.length)) {
				var hostsString = JSON.stringify(rule.hosts);
				var urlsString = JSON.stringify(rule.urls);
				/* istanbul ignore next */
				(_c = config.loggerProvider) === null || _c === void 0 || _c.warn("Found network capture rule with both urls='".concat(urlsString, "' and hosts='").concat(hostsString, "' set. ") + "Definition of urls takes precedence over hosts, so ignoring hosts.");
				return __assign$1(__assign$1({}, rule), { hosts: void 0 });
			}
			return rule;
		}) });
	}
};
var getPageViewTrackingConfig = function(config) {
	var trackOn = function() {
		return false;
	};
	var trackHistoryChanges = void 0;
	var eventType;
	var pageCounter = config.pageCounter;
	if (isPageViewTrackingEnabled(config.defaultTracking)) {
		trackOn = void 0;
		eventType = void 0;
		if (config.defaultTracking && typeof config.defaultTracking === "object" && config.defaultTracking.pageViews && typeof config.defaultTracking.pageViews === "object") {
			if ("trackOn" in config.defaultTracking.pageViews) trackOn = config.defaultTracking.pageViews.trackOn;
			if ("trackHistoryChanges" in config.defaultTracking.pageViews) trackHistoryChanges = config.defaultTracking.pageViews.trackHistoryChanges;
			if ("eventType" in config.defaultTracking.pageViews && config.defaultTracking.pageViews.eventType) eventType = config.defaultTracking.pageViews.eventType;
		}
	}
	return {
		trackOn,
		trackHistoryChanges,
		eventType,
		pageCounter
	};
};
var getAttributionTrackingConfig = function(config) {
	if (isAttributionTrackingEnabled(config.defaultTracking) && config.defaultTracking && typeof config.defaultTracking === "object" && config.defaultTracking.attribution && typeof config.defaultTracking.attribution === "object") return __assign$1({}, config.defaultTracking.attribution);
	return {};
};
var getFormInteractionsConfig = function(config) {
	if (isFormInteractionTrackingEnabled(config.defaultTracking) && config.defaultTracking && typeof config.defaultTracking === "object" && typeof config.defaultTracking.formInteractions === "object") return config.defaultTracking.formInteractions;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/utils/snippet-helper.js
/**
* Applies the proxied functions on the proxied object to an instance of the real object.
* Used to convert proxied Identify and Revenue objects.
*/
var convertProxyObjectToRealObject = function(instance, queue) {
	for (var i = 0; i < queue.length; i++) {
		var _a = queue[i], name_1 = _a.name, args = _a.args, resolve = _a.resolve;
		var fn = instance && instance[name_1];
		if (typeof fn === "function") {
			var result = fn.apply(instance, args);
			if (typeof resolve === "function") resolve(result === null || result === void 0 ? void 0 : result.promise);
		}
	}
	return instance;
};
/**
* Check if the param is snippet proxy
*/
var isInstanceProxy = function(instance) {
	var instanceProxy = instance;
	return instanceProxy && instanceProxy._q !== void 0;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/version.js
var VERSION$1 = "2.42.2";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/lib-prefix.js
var LIBPREFIX = "amplitude-ts";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/plugins/context.js
var BROWSER_PLATFORM = "Web";
var IP_ADDRESS = "$remote";
var Context = function() {
	function Context() {
		this.name = "@amplitude/plugin-context-browser";
		this.type = "before";
		this.library = "".concat(LIBPREFIX, "/").concat(VERSION$1);
		/* istanbul ignore else */
		if (typeof navigator !== "undefined") this.userAgent = navigator.userAgent;
	}
	Context.prototype.setup = function(config) {
		this.config = config;
		return Promise.resolve(void 0);
	};
	Context.prototype.execute = function(context) {
		var _a, _b;
		return __awaiter(this, void 0, void 0, function() {
			var time, lastEventId, nextEventId, event;
			return __generator(this, function(_c) {
				time = (/* @__PURE__ */ new Date()).getTime();
				lastEventId = (_a = this.config.lastEventId) !== null && _a !== void 0 ? _a : -1;
				nextEventId = (_b = context.event_id) !== null && _b !== void 0 ? _b : lastEventId + 1;
				this.config.lastEventId = nextEventId;
				if (!context.time) this.config.lastEventTime = time;
				event = __assign$1(__assign$1(__assign$1(__assign$1(__assign$1(__assign$1(__assign$1(__assign$1({
					user_id: this.config.userId,
					device_id: this.config.deviceId,
					session_id: this.config.sessionId,
					time
				}, this.config.appVersion && { app_version: this.config.appVersion }), this.config.trackingOptions.platform && { platform: BROWSER_PLATFORM }), this.config.trackingOptions.language && { language: getLanguage() }), this.config.trackingOptions.ipAddress && { ip: IP_ADDRESS }), {
					insert_id: UUID$1(),
					partner_id: this.config.partnerId,
					plan: this.config.plan
				}), this.config.ingestionMetadata && { ingestion_metadata: {
					source_name: this.config.ingestionMetadata.sourceName,
					source_version: this.config.ingestionMetadata.sourceVersion
				} }), context), {
					event_id: nextEventId,
					library: this.library,
					user_agent: this.userAgent
				});
				return [2, event];
			});
		});
	};
	return Context;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/storage/local-storage.js
var MAX_ARRAY_LENGTH = 1e3;
var LocalStorage = function(_super) {
	__extends(LocalStorage, _super);
	function LocalStorage(config) {
		var _this = this;
		var _a, _b;
		var localStorage;
		try {
			localStorage = (_a = getGlobalScope$1()) === null || _a === void 0 ? void 0 : _a.localStorage;
		} catch (e) {
			(_b = config === null || config === void 0 ? void 0 : config.loggerProvider) === null || _b === void 0 || _b.debug("Failed to access localStorage. error=".concat(JSON.stringify(e)));
			localStorage = void 0;
		}
		_this = _super.call(this, localStorage) || this;
		_this.loggerProvider = config === null || config === void 0 ? void 0 : config.loggerProvider;
		return _this;
	}
	LocalStorage.prototype.set = function(key, value) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			var droppedEventsCount;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						if (!(Array.isArray(value) && value.length > MAX_ARRAY_LENGTH)) return [3, 2];
						droppedEventsCount = value.length - MAX_ARRAY_LENGTH;
						return [4, _super.prototype.set.call(this, key, value.slice(0, MAX_ARRAY_LENGTH))];
					case 1:
						_b.sent();
						(_a = this.loggerProvider) === null || _a === void 0 || _a.error("Failed to save ".concat(droppedEventsCount, " events because the queue length exceeded ").concat(MAX_ARRAY_LENGTH, "."));
						return [3, 4];
					case 2: return [4, _super.prototype.set.call(this, key, value)];
					case 3:
						_b.sent();
						_b.label = 4;
					case 4: return [2];
				}
			});
		});
	};
	return LocalStorage;
}(BrowserStorage$1);
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/storage/session-storage.js
var SessionStorage = function(_super) {
	__extends(SessionStorage, _super);
	function SessionStorage() {
		var _a;
		return _super.call(this, (_a = getGlobalScope$1()) === null || _a === void 0 ? void 0 : _a.sessionStorage) || this;
	}
	return SessionStorage;
}(BrowserStorage$1);
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/transports/xhr.js
var XHRTransport = function(_super) {
	__extends(XHRTransport, _super);
	function XHRTransport(customHeaders) {
		if (customHeaders === void 0) customHeaders = {};
		var _this = _super.call(this) || this;
		_this.state = { done: 4 };
		_this.customHeaders = customHeaders;
		return _this;
	}
	XHRTransport.prototype.send = function(serverUrl, payload, shouldCompressUploadBody) {
		if (shouldCompressUploadBody === void 0) shouldCompressUploadBody = false;
		return __awaiter(this, void 0, void 0, function() {
			var _this = this;
			return __generator(this, function(_a) {
				return [2, new Promise(function(resolve, reject) {
					/* istanbul ignore if */
					if (typeof XMLHttpRequest === "undefined") reject(/* @__PURE__ */ new Error("XHRTransport is not supported."));
					var xhr = new XMLHttpRequest();
					xhr.open("POST", serverUrl, true);
					xhr.onreadystatechange = function() {
						if (xhr.readyState === _this.state.done) {
							var responseText = xhr.responseText;
							try {
								resolve(_this.buildResponse(JSON.parse(responseText)));
							} catch (_a) {
								resolve(_this.buildResponse({ code: xhr.status }));
							}
						}
					};
					var headers = {
						"Content-Type": "application/json",
						Accept: "*/*"
					};
					var bodyString = JSON.stringify(payload);
					var shouldCompressBody = shouldCompressUploadBody && bodyString.length >= 2048 && isCompressionStreamAvailable();
					var sendBody = function(body) {
						var e_1, _a;
						headers = __assign$1(__assign$1({}, _this.customHeaders), headers);
						try {
							for (var _b = __values$1(Object.entries(headers)), _c = _b.next(); !_c.done; _c = _b.next()) {
								var _d = __read$1(_c.value, 2), key = _d[0], value = _d[1];
								xhr.setRequestHeader(key, value);
							}
						} catch (e_1_1) {
							e_1 = { error: e_1_1 };
						} finally {
							try {
								if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
							} finally {
								if (e_1) throw e_1.error;
							}
						}
						xhr.send(body);
					};
					var doSend = function() {
						return __awaiter(_this, void 0, void 0, function() {
							var compressed;
							return __generator(this, function(_a) {
								switch (_a.label) {
									case 0:
										if (!shouldCompressBody) return [3, 2];
										return [4, compressToGzipArrayBuffer(bodyString)];
									case 1:
										compressed = _a.sent();
										if (compressed) {
											headers["Content-Encoding"] = "gzip";
											sendBody(compressed);
										} else sendBody(bodyString);
										return [3, 3];
									case 2:
										sendBody(bodyString);
										_a.label = 3;
									case 3: return [2];
								}
							});
						});
					};
					doSend().catch(reject);
				})];
			});
		});
	};
	return XHRTransport;
}(BaseTransport);
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/transports/fetch.js
var FetchTransport = function(_super) {
	__extends(FetchTransport, _super);
	function FetchTransport(customHeaders) {
		if (customHeaders === void 0) customHeaders = {};
		var _this = _super.call(this) || this;
		_this.customHeaders = customHeaders;
		return _this;
	}
	FetchTransport.prototype.send = function(serverUrl, payload, shouldCompressUploadBody) {
		if (shouldCompressUploadBody === void 0) shouldCompressUploadBody = false;
		return __awaiter(this, void 0, void 0, function() {
			var bodyString, shouldCompressBody, body, headers, compressed, options, response, responseText;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						/* istanbul ignore if */
						if (typeof fetch === "undefined") throw new Error("FetchTransport is not supported");
						bodyString = JSON.stringify(payload);
						shouldCompressBody = shouldCompressUploadBody && bodyString.length >= 2048 && isCompressionStreamAvailable();
						body = bodyString;
						headers = {
							"Content-Type": "application/json",
							Accept: "*/*"
						};
						if (!shouldCompressBody) return [3, 2];
						return [4, compressToGzipArrayBuffer(bodyString)];
					case 1:
						compressed = _a.sent();
						if (compressed) {
							headers["Content-Encoding"] = "gzip";
							body = compressed;
						}
						_a.label = 2;
					case 2:
						headers = __assign$1(__assign$1({}, this.customHeaders), headers);
						options = {
							headers,
							body,
							method: "POST"
						};
						return [4, fetch(serverUrl, options)];
					case 3:
						response = _a.sent();
						return [4, response.text()];
					case 4:
						responseText = _a.sent();
						try {
							return [2, this.buildResponse(JSON.parse(responseText))];
						} catch (_b) {
							return [2, this.buildResponse({ code: response.status })];
						}
						return [2];
				}
			});
		});
	};
	return FetchTransport;
}(BaseTransport);
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/transports/send-beacon.js
/**
* SendBeacon does not support custom headers (e.g. Content-Encoding: gzip),
* so request body compression is not applied even when enableRequestBodyCompression is true.
*/
var SendBeaconTransport = function(_super) {
	__extends(SendBeaconTransport, _super);
	function SendBeaconTransport() {
		return _super.call(this) || this;
	}
	SendBeaconTransport.prototype.send = function(serverUrl, payload, _enableRequestBodyCompression) {
		if (_enableRequestBodyCompression === void 0) _enableRequestBodyCompression = false;
		return __awaiter(this, void 0, void 0, function() {
			var _this = this;
			return __generator(this, function(_a) {
				return [2, new Promise(function(resolve, reject) {
					var globalScope = getGlobalScope$1();
					/* istanbul ignore if */
					if (!(globalScope === null || globalScope === void 0 ? void 0 : globalScope.navigator.sendBeacon)) throw new Error("SendBeaconTransport is not supported");
					try {
						var data = JSON.stringify(payload);
						if (globalScope.navigator.sendBeacon(serverUrl, data)) return resolve(_this.buildResponse({
							code: 200,
							events_ingested: payload.events.length,
							payload_size_bytes: data.length,
							server_upload_time: Date.now()
						}));
						return resolve(_this.buildResponse({ code: 500 }));
					} catch (e) {
						reject(e);
					}
				})];
			});
		});
	};
	return SendBeaconTransport;
}(BaseTransport);
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/cookie-migration/index.js
var parseLegacyCookies = function(apiKey, cookieStorage, deleteLegacyCookies) {
	if (deleteLegacyCookies === void 0) deleteLegacyCookies = true;
	return __awaiter(void 0, void 0, void 0, function() {
		var cookieName, cookies, _a, deviceId, userId, optOut, sessionId, lastEventTime, lastEventId;
		return __generator(this, function(_b) {
			switch (_b.label) {
				case 0:
					cookieName = getOldCookieName(apiKey);
					return [4, cookieStorage.getRaw(cookieName)];
				case 1:
					cookies = _b.sent();
					if (!cookies) return [2, { optOut: false }];
					if (!deleteLegacyCookies) return [3, 3];
					return [4, cookieStorage.remove(cookieName)];
				case 2:
					_b.sent();
					_b.label = 3;
				case 3:
					_a = __read$1(cookies.split("."), 6), deviceId = _a[0], userId = _a[1], optOut = _a[2], sessionId = _a[3], lastEventTime = _a[4], lastEventId = _a[5];
					return [2, {
						deviceId,
						userId: decode(userId),
						sessionId: parseTime(sessionId),
						lastEventId: parseTime(lastEventId),
						lastEventTime: parseTime(lastEventTime),
						optOut: Boolean(optOut)
					}];
			}
		});
	});
};
var parseTime = function(num) {
	var integer = parseInt(num, 32);
	if (isNaN(integer)) return;
	return integer;
};
var decode = function(value) {
	if (!atob || !escape || !value) return;
	try {
		return decodeURIComponent(escape(atob(value)));
	} catch (_a) {
		return;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/constants.js
var DEFAULT_EVENT_PREFIX = "[Amplitude]";
"".concat(DEFAULT_EVENT_PREFIX, " Page Viewed");
var DEFAULT_FORM_START_EVENT = "".concat(DEFAULT_EVENT_PREFIX, " Form Started");
var DEFAULT_FORM_SUBMIT_EVENT = "".concat(DEFAULT_EVENT_PREFIX, " Form Submitted");
var DEFAULT_FILE_DOWNLOAD_EVENT = "".concat(DEFAULT_EVENT_PREFIX, " File Downloaded");
var DEFAULT_SESSION_START_EVENT = "session_start";
var DEFAULT_SESSION_END_EVENT = "session_end";
var FILE_EXTENSION = "".concat(DEFAULT_EVENT_PREFIX, " File Extension");
var FILE_NAME = "".concat(DEFAULT_EVENT_PREFIX, " File Name");
var LINK_ID = "".concat(DEFAULT_EVENT_PREFIX, " Link ID");
var LINK_TEXT = "".concat(DEFAULT_EVENT_PREFIX, " Link Text");
var LINK_URL = "".concat(DEFAULT_EVENT_PREFIX, " Link URL");
var FORM_ID = "".concat(DEFAULT_EVENT_PREFIX, " Form ID");
var FORM_NAME = "".concat(DEFAULT_EVENT_PREFIX, " Form Name");
var FORM_DESTINATION = "".concat(DEFAULT_EVENT_PREFIX, " Form Destination");
var DEFAULT_IDENTITY_STORAGE = "cookie";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/attribution/helpers.js
var domainWithoutSubdomain = function(domain) {
	var parts = domain.split(".");
	if (parts.length <= 2) return domain;
	return parts.slice(parts.length - 2, parts.length).join(".");
};
var isDirectTraffic = function(current) {
	return Object.values(current).every(function(value) {
		return !value;
	});
};
var isEmptyCampaign = function(campaign) {
	var campaignWithoutReferrer = __assign$1(__assign$1({}, campaign), {
		referring_domain: void 0,
		referrer: void 0
	});
	return Object.values(campaignWithoutReferrer).every(function(value) {
		return !value;
	});
};
var isNewCampaign = function(current, previous, options, logger, isNewSession, topLevelDomain) {
	if (isNewSession === void 0) isNewSession = true;
	current.referrer;
	var referring_domain = current.referring_domain, currentCampaign = __rest(current, ["referrer", "referring_domain"]), _a = previous || {};
	_a.referrer;
	var prevReferringDomain = _a.referring_domain, previousCampaign = __rest(_a, ["referrer", "referring_domain"]);
	var excludeInternalReferrers = options.excludeInternalReferrers;
	if (excludeInternalReferrers) {
		var condition = getExcludeInternalReferrersCondition(excludeInternalReferrers, logger);
		if (!(condition instanceof TypeError) && current.referring_domain && isInternalReferrer(current.referring_domain, topLevelDomain)) {
			if (condition === "always") {
				debugLogInternalReferrerExclude(condition, current.referring_domain, logger);
				return false;
			} else if (condition === "ifEmptyCampaign" && isEmptyCampaign(current)) {
				debugLogInternalReferrerExclude(condition, current.referring_domain, logger);
				return false;
			}
		}
	}
	if (isExcludedReferrer(options.excludeReferrers, current.referring_domain)) {
		logger.debug("This is not a new campaign because ".concat(current.referring_domain, " is in the exclude referrer list."));
		return false;
	}
	if (!isNewSession && isDirectTraffic(current) && previous) {
		logger.debug("This is not a new campaign because this is a direct traffic in the same session.");
		return false;
	}
	var hasNewCampaign = JSON.stringify(currentCampaign) !== JSON.stringify(previousCampaign);
	var hasNewDomain = domainWithoutSubdomain(referring_domain || "") !== domainWithoutSubdomain(prevReferringDomain || "");
	var result = !previous || hasNewCampaign || hasNewDomain;
	if (!result) logger.debug("This is not a new campaign because it's the same as the previous one.");
	else logger.debug("This is a new campaign. An $identify event will be sent.");
	return result;
};
var isExcludedReferrer = function(excludeReferrers, referringDomain) {
	if (excludeReferrers === void 0) excludeReferrers = [];
	if (referringDomain === void 0) referringDomain = "";
	return excludeReferrers.some(function(value) {
		return value instanceof RegExp ? value.test(referringDomain) : value === referringDomain;
	});
};
var isSubdomainOf = function(subDomain, domain) {
	var cookieDomainWithLeadingDot = domain.startsWith(".") ? domain : ".".concat(domain);
	if ((subDomain.startsWith(".") ? subDomain : ".".concat(subDomain)).endsWith(cookieDomainWithLeadingDot)) return true;
	return false;
};
var createCampaignEvent = function(campaign, options) {
	var campaignParameters = __assign$1(__assign$1({}, BASE_CAMPAIGN$1), campaign);
	return createIdentifyEvent(Object.entries(campaignParameters).reduce(function(identify, _a) {
		var _b;
		var _c = __read$1(_a, 2), key = _c[0], value = _c[1];
		identify.setOnce("initial_".concat(key), (_b = value !== null && value !== void 0 ? value : options.initialEmptyValue) !== null && _b !== void 0 ? _b : "EMPTY");
		if (value) return identify.set(key, value);
		return identify.unset(key);
	}, new Identify()));
};
var getDefaultExcludedReferrers = function(cookieDomain) {
	var domain = cookieDomain;
	if (domain) {
		if (domain.startsWith(".")) domain = domain.substring(1);
		return [new RegExp("".concat(domain.replace(".", "\\."), "$"))];
	}
	return [];
};
/**
* Parses the excludeInternalReferrers configuration to determine the condition on which to
* exclude internal referrers for campaign attribution.
*
* If the config is invalid type, log and return a TypeError.
*
* (this does explicit type checking so don't have to rely on TS compiler to catch invalid types)
*
* @param excludeInternalReferrers - attribution.excludeInternalReferrers configuration
* @param logger - logger instance to log error when TypeError
* @returns The condition if the config is valid, TypeError if the config is invalid.
*/
var getExcludeInternalReferrersCondition = function(excludeInternalReferrers, logger) {
	if (excludeInternalReferrers === true) return EXCLUDE_INTERNAL_REFERRERS_CONDITIONS.always;
	if (typeof excludeInternalReferrers === "object") {
		var condition = excludeInternalReferrers.condition;
		if (typeof condition === "string" && Object.keys(EXCLUDE_INTERNAL_REFERRERS_CONDITIONS).includes(condition)) return condition;
		else if (typeof condition === "undefined") return EXCLUDE_INTERNAL_REFERRERS_CONDITIONS.always;
	}
	var errorMessage = "Invalid configuration provided for attribution.excludeInternalReferrers: ".concat(JSON.stringify(excludeInternalReferrers));
	logger.error(errorMessage);
	return new TypeError(errorMessage);
};
function debugLogInternalReferrerExclude(condition, referringDomain, logger) {
	var baseMessage = "This is not a new campaign because referring_domain=".concat(referringDomain, " is on the same domain as the current page and it is configured to exclude internal referrers");
	if (condition === "always") logger.debug(baseMessage);
	else if (condition === "ifEmptyCampaign") logger.debug("".concat(baseMessage, " with empty campaign parameters"));
}
var KNOWN_2LDS = [
	"ac.in",
	"ac.jp",
	"ac.kr",
	"ac.th",
	"ac.uk",
	"ac.za",
	"appspot.com",
	"asn.au",
	"azurewebsites.net",
	"cloudfront.net",
	"myshopify.com",
	"blogspot.com",
	"co.ca",
	"co.in",
	"co.jp",
	"co.kr",
	"co.nz",
	"co.th",
	"co.uk",
	"co.za",
	"com.ar",
	"com.au",
	"com.br",
	"com.cn",
	"com.hk",
	"com.in",
	"com.jp",
	"com.kr",
	"com.mx",
	"com.pl",
	"com.sg",
	"com.tr",
	"com.tw",
	"ed.jp",
	"edu.au",
	"edu.br",
	"edu.cn",
	"edu.hk",
	"edu.sg",
	"edu.th",
	"edu.tr",
	"edu.tw",
	"firebaseapp.com",
	"fly.dev",
	"gc.ca",
	"geek.nz",
	"github.io",
	"gitlab.io",
	"go.jp",
	"go.kr",
	"go.th",
	"gob.ar",
	"gob.mx",
	"gov.au",
	"gov.br",
	"gov.cn",
	"gov.hk",
	"gov.in",
	"gov.pl",
	"gov.sg",
	"gov.tr",
	"gov.tw",
	"gov.uk",
	"gov.za",
	"govt.nz",
	"gr.jp",
	"herokuapp.com",
	"id.au",
	"idv.hk",
	"iwi.nz",
	"lg.jp",
	"ltd.uk",
	"maori.nz",
	"me.uk",
	"mil.kr",
	"ne.jp",
	"ne.kr",
	"net.au",
	"net.br",
	"net.cn",
	"net.hk",
	"net.in",
	"net.nz",
	"net.pl",
	"net.sg",
	"net.tr",
	"net.tw",
	"net.za",
	"onrender.com",
	"or.jp",
	"or.kr",
	"or.th",
	"org.ar",
	"org.au",
	"org.br",
	"org.cn",
	"org.hk",
	"org.in",
	"org.mx",
	"org.nz",
	"org.pl",
	"org.sg",
	"org.tw",
	"org.uk",
	"org.za",
	"pages.dev",
	"pe.kr",
	"plc.uk",
	"re.kr",
	"res.in",
	"sch.uk",
	"vercel.app",
	"netlify.app",
	"workers.dev"
];
var getDomain = function(hostnameParam) {
	var _a, _b;
	/* istanbul ignore next */
	var hostname = hostnameParam || ((_b = (_a = getGlobalScope$1()) === null || _a === void 0 ? void 0 : _a.location) === null || _b === void 0 ? void 0 : _b.hostname);
	if (!hostname) return "";
	var parts = hostname.split(".");
	var tld = parts[parts.length - 1];
	var name = parts[parts.length - 2];
	if (KNOWN_2LDS.find(function(tld) {
		return hostname.endsWith(".".concat(tld));
	})) {
		tld = parts[parts.length - 2] + "." + parts[parts.length - 1];
		name = parts[parts.length - 3];
	}
	if (!name) return tld;
	return "".concat(name, ".").concat(tld);
};
var isInternalReferrer = function(referringDomain, topLevelDomain) {
	var globalScope = getGlobalScope$1();
	/* istanbul ignore if */
	if (!globalScope) return false;
	return isSubdomainOf(referringDomain, (topLevelDomain || "").trim() || getDomain(globalScope.location.hostname));
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/config.js
var BrowserConfig = function(_super) {
	__extends(BrowserConfig, _super);
	function BrowserConfig(apiKey, appVersion, cookieStorage, cookieOptions, defaultTracking, autocapture, deviceId, flushIntervalMillis, flushMaxRetries, flushQueueSize, identityStorage, ingestionMetadata, instanceName, lastEventId, lastEventTime, loggerProvider, logLevel, minIdLength, offline, optOut, partnerId, plan, serverUrl, serverZone, sessionId, deferredSessionId, sessionTimeout, storageProvider, trackingOptions, transport, useBatch, fetchRemoteConfig, userId, pageCounter, debugLogsEnabled, networkTrackingOptions, identify, enableDiagnostics, diagnosticsSampleRate, diagnosticsClient, remoteConfig, topLevelDomain, enableRequestBodyCompression, customEnrichment) {
		if (cookieStorage === void 0) cookieStorage = new MemoryStorage();
		if (cookieOptions === void 0) cookieOptions = {
			domain: "",
			expiration: 365,
			sameSite: "Lax",
			secure: false,
			upgrade: true
		};
		if (flushIntervalMillis === void 0) flushIntervalMillis = 1e3;
		if (flushMaxRetries === void 0) flushMaxRetries = 5;
		if (flushQueueSize === void 0) flushQueueSize = 30;
		if (identityStorage === void 0) identityStorage = DEFAULT_IDENTITY_STORAGE;
		if (loggerProvider === void 0) loggerProvider = new Logger();
		if (logLevel === void 0) logLevel = LogLevel.Warn;
		if (offline === void 0) offline = false;
		if (optOut === void 0) optOut = false;
		if (serverUrl === void 0) serverUrl = "";
		if (serverZone === void 0) serverZone = "US";
		if (sessionTimeout === void 0) sessionTimeout = 1800 * 1e3;
		if (storageProvider === void 0) storageProvider = new LocalStorage({ loggerProvider });
		if (trackingOptions === void 0) trackingOptions = {
			ipAddress: true,
			language: true,
			platform: true
		};
		if (transport === void 0) transport = "fetch";
		if (useBatch === void 0) useBatch = false;
		if (fetchRemoteConfig === void 0) fetchRemoteConfig = true;
		if (enableDiagnostics === void 0) enableDiagnostics = true;
		if (diagnosticsSampleRate === void 0) diagnosticsSampleRate = 0;
		if (enableRequestBodyCompression === void 0) enableRequestBodyCompression = false;
		var _this = this;
		var _a;
		_this = _super.call(this, {
			apiKey,
			storageProvider,
			transportProvider: createTransport(transport)
		}) || this;
		_this.apiKey = apiKey;
		_this.appVersion = appVersion;
		_this.cookieOptions = cookieOptions;
		_this.defaultTracking = defaultTracking;
		_this.autocapture = autocapture;
		_this.flushIntervalMillis = flushIntervalMillis;
		_this.flushMaxRetries = flushMaxRetries;
		_this.flushQueueSize = flushQueueSize;
		_this.identityStorage = identityStorage;
		_this.ingestionMetadata = ingestionMetadata;
		_this.instanceName = instanceName;
		_this.loggerProvider = loggerProvider;
		_this.logLevel = logLevel;
		_this.minIdLength = minIdLength;
		_this.offline = offline;
		_this.partnerId = partnerId;
		_this.plan = plan;
		_this.serverUrl = serverUrl;
		_this.serverZone = serverZone;
		_this.sessionTimeout = sessionTimeout;
		_this.storageProvider = storageProvider;
		_this.trackingOptions = trackingOptions;
		_this.transport = transport;
		_this.useBatch = useBatch;
		_this.fetchRemoteConfig = fetchRemoteConfig;
		_this.networkTrackingOptions = networkTrackingOptions;
		_this.identify = identify;
		_this.enableDiagnostics = enableDiagnostics;
		_this.diagnosticsSampleRate = diagnosticsSampleRate;
		_this.diagnosticsClient = diagnosticsClient;
		_this.remoteConfig = remoteConfig;
		_this.topLevelDomain = topLevelDomain;
		_this.enableRequestBodyCompression = enableRequestBodyCompression;
		_this.customEnrichment = customEnrichment;
		_this.version = VERSION$1;
		_this._optOut = false;
		_this._cookieStorage = cookieStorage;
		_this.deviceId = deviceId;
		_this.lastEventId = lastEventId;
		_this.lastEventTime = lastEventTime;
		_this.optOut = optOut;
		_this.deferredSessionId = deferredSessionId;
		_this.sessionId = sessionId;
		_this.pageCounter = pageCounter;
		_this.userId = userId;
		_this.debugLogsEnabled = debugLogsEnabled;
		_this.loggerProvider.enable(debugLogsEnabled ? LogLevel.Debug : _this.logLevel);
		_this.networkTrackingOptions = networkTrackingOptions;
		_this.identify = identify;
		_this.enableDiagnostics = enableDiagnostics;
		_this.diagnosticsSampleRate = diagnosticsSampleRate;
		_this.diagnosticsClient = diagnosticsClient;
		var _fetchRemoteConfig = (_a = remoteConfig === null || remoteConfig === void 0 ? void 0 : remoteConfig.fetchRemoteConfig) !== null && _a !== void 0 ? _a : fetchRemoteConfig;
		_this.remoteConfig = _this.remoteConfig || {};
		_this.remoteConfig.fetchRemoteConfig = _fetchRemoteConfig;
		_this.fetchRemoteConfig = _fetchRemoteConfig;
		_this.topLevelDomain = topLevelDomain || getDomain();
		return _this;
	}
	Object.defineProperty(BrowserConfig.prototype, "cookieStorage", {
		get: function() {
			return this._cookieStorage;
		},
		set: function(cookieStorage) {
			if (this._cookieStorage !== cookieStorage) {
				this._cookieStorage = cookieStorage;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "deviceId", {
		get: function() {
			return this._deviceId;
		},
		set: function(deviceId) {
			if (this._deviceId !== deviceId) {
				this._deviceId = deviceId;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "userId", {
		get: function() {
			return this._userId;
		},
		set: function(userId) {
			if (this._userId !== userId) {
				this._userId = userId;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "sessionId", {
		get: function() {
			return this._sessionId;
		},
		set: function(sessionId) {
			if (this._sessionId !== sessionId) {
				this._sessionId = sessionId;
				if (sessionId !== void 0 && this._deferredSessionId !== void 0) this._deferredSessionId = void 0;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "deferredSessionId", {
		get: function() {
			return this._deferredSessionId;
		},
		set: function(deferredSessionId) {
			if (this._deferredSessionId !== deferredSessionId && deferredSessionId !== this.sessionId) {
				this._deferredSessionId = deferredSessionId;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "optOut", {
		get: function() {
			return this._optOut;
		},
		set: function(optOut) {
			if (this._optOut !== optOut) {
				this._optOut = optOut;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "lastEventTime", {
		get: function() {
			return this._lastEventTime;
		},
		set: function(lastEventTime) {
			if (this._lastEventTime !== lastEventTime) {
				this._lastEventTime = lastEventTime;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "lastEventId", {
		get: function() {
			return this._lastEventId;
		},
		set: function(lastEventId) {
			if (this._lastEventId !== lastEventId) {
				this._lastEventId = lastEventId;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "pageCounter", {
		get: function() {
			return this._pageCounter;
		},
		set: function(pageCounter) {
			if (this._pageCounter !== pageCounter) {
				this._pageCounter = pageCounter;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(BrowserConfig.prototype, "debugLogsEnabled", {
		set: function(debugLogsEnabled) {
			if (this._debugLogsEnabled !== debugLogsEnabled) {
				this._debugLogsEnabled = debugLogsEnabled;
				this.updateStorage();
			}
		},
		enumerable: false,
		configurable: true
	});
	BrowserConfig.prototype.updateStorage = function() {
		var cache = {
			deviceId: this._deviceId,
			userId: this._userId,
			sessionId: this._sessionId,
			deferredSessionId: this._deferredSessionId,
			optOut: this._optOut,
			lastEventTime: this._lastEventTime,
			lastEventId: this._lastEventId,
			pageCounter: this._pageCounter,
			debugLogsEnabled: this._debugLogsEnabled,
			cookieDomain: void 0
		};
		if (this.cookieStorage instanceof CookieStorage) cache.cookieDomain = this.cookieStorage.options.domain;
		this.cookieStorage.set(getCookieName(this.apiKey), cache);
	};
	return BrowserConfig;
}(Config);
var useBrowserConfig = function(apiKey, options, amplitudeInstance, diagnosticsClient, earlyConfig) {
	if (options === void 0) options = {};
	return __awaiter(void 0, void 0, void 0, function() {
		var identityStorage, defaultCookieDomain, cookieOptions, cookieConfig, cookieStorage, legacyCookies, previousCookies, queryParams, ampTimestamp, isWithinTimeLimit, deviceId, lastEventId, lastEventTime, optOut, sessionId, deferredSessionId, userId, trackingOptions, pageCounter, debugLogsEnabled, browserConfig;
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5;
		return __generator(this, function(_6) {
			switch (_6.label) {
				case 0:
					identityStorage = options.identityStorage || "cookie";
					defaultCookieDomain = "";
					if (!(identityStorage === "cookie" && !((_a = options.cookieOptions) === null || _a === void 0 ? void 0 : _a.domain) && ((_b = options.cookieOptions) === null || _b === void 0 ? void 0 : _b.domain) !== "")) return [3, 2];
					return [4, getTopLevelDomain(void 0, diagnosticsClient)];
				case 1:
					defaultCookieDomain = _6.sent();
					_6.label = 2;
				case 2:
					cookieOptions = __assign$1({
						domain: (_d = (_c = options.cookieOptions) === null || _c === void 0 ? void 0 : _c.domain) !== null && _d !== void 0 ? _d : defaultCookieDomain,
						expiration: 365,
						sameSite: "Lax",
						secure: false,
						upgrade: true
					}, options.cookieOptions);
					cookieConfig = {
						duplicateResolverFn: function(value) {
							var decodedValue = decodeCookieValue(value);
							if (!decodedValue) return false;
							return isDomainEqual(JSON.parse(decodedValue).cookieDomain, cookieOptions.domain);
						},
						diagnosticsClient
					};
					cookieStorage = createCookieStorage(options.identityStorage, cookieOptions, cookieConfig);
					return [4, parseLegacyCookies(apiKey, cookieStorage, (_f = (_e = options.cookieOptions) === null || _e === void 0 ? void 0 : _e.upgrade) !== null && _f !== void 0 ? _f : true)];
				case 3:
					legacyCookies = _6.sent();
					return [4, cookieStorage.get(getCookieName(apiKey))];
				case 4:
					previousCookies = _6.sent();
					queryParams = getQueryParams$1();
					ampTimestamp = queryParams.ampTimestamp ? Number(queryParams.ampTimestamp) : void 0;
					isWithinTimeLimit = ampTimestamp ? Date.now() < ampTimestamp : true;
					deviceId = (_l = (_k = (_j = (_g = options.deviceId) !== null && _g !== void 0 ? _g : isWithinTimeLimit ? (_h = queryParams.ampDeviceId) !== null && _h !== void 0 ? _h : queryParams.deviceId : void 0) !== null && _j !== void 0 ? _j : previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.deviceId) !== null && _k !== void 0 ? _k : legacyCookies.deviceId) !== null && _l !== void 0 ? _l : UUID$1();
					lastEventId = (_m = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.lastEventId) !== null && _m !== void 0 ? _m : legacyCookies.lastEventId;
					lastEventTime = (_o = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.lastEventTime) !== null && _o !== void 0 ? _o : legacyCookies.lastEventTime;
					optOut = (_q = (_p = options.optOut) !== null && _p !== void 0 ? _p : previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.optOut) !== null && _q !== void 0 ? _q : legacyCookies.optOut;
					sessionId = (_r = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.sessionId) !== null && _r !== void 0 ? _r : legacyCookies.sessionId;
					deferredSessionId = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.deferredSessionId;
					userId = (_t = (_s = options.userId) !== null && _s !== void 0 ? _s : previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.userId) !== null && _t !== void 0 ? _t : legacyCookies.userId;
					amplitudeInstance.previousSessionDeviceId = (_u = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.deviceId) !== null && _u !== void 0 ? _u : legacyCookies.deviceId;
					amplitudeInstance.previousSessionUserId = (_v = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.userId) !== null && _v !== void 0 ? _v : legacyCookies.userId;
					trackingOptions = {
						ipAddress: (_x = (_w = options.trackingOptions) === null || _w === void 0 ? void 0 : _w.ipAddress) !== null && _x !== void 0 ? _x : true,
						language: (_z = (_y = options.trackingOptions) === null || _y === void 0 ? void 0 : _y.language) !== null && _z !== void 0 ? _z : true,
						platform: (_1 = (_0 = options.trackingOptions) === null || _0 === void 0 ? void 0 : _0.platform) !== null && _1 !== void 0 ? _1 : true
					};
					pageCounter = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.pageCounter;
					debugLogsEnabled = previousCookies === null || previousCookies === void 0 ? void 0 : previousCookies.debugLogsEnabled;
					if (options.autocapture !== void 0) options.defaultTracking = options.autocapture;
					browserConfig = new BrowserConfig(apiKey, options.appVersion, cookieStorage, cookieOptions, options.defaultTracking, options.autocapture, deviceId, options.flushIntervalMillis, options.flushMaxRetries, options.flushQueueSize, identityStorage, options.ingestionMetadata, options.instanceName, lastEventId, lastEventTime, (_2 = earlyConfig === null || earlyConfig === void 0 ? void 0 : earlyConfig.loggerProvider) !== null && _2 !== void 0 ? _2 : options.loggerProvider, options.logLevel, options.minIdLength, options.offline, optOut, options.partnerId, options.plan, options.serverUrl, (_3 = earlyConfig === null || earlyConfig === void 0 ? void 0 : earlyConfig.serverZone) !== null && _3 !== void 0 ? _3 : options.serverZone, sessionId, deferredSessionId, options.sessionTimeout, options.storageProvider, trackingOptions, options.transport, options.useBatch, options.fetchRemoteConfig, userId, pageCounter, debugLogsEnabled, options.networkTrackingOptions, options.identify, (_4 = earlyConfig === null || earlyConfig === void 0 ? void 0 : earlyConfig.enableDiagnostics) !== null && _4 !== void 0 ? _4 : options.enableDiagnostics, (_5 = earlyConfig === null || earlyConfig === void 0 ? void 0 : earlyConfig.diagnosticsSampleRate) !== null && _5 !== void 0 ? _5 : amplitudeInstance._diagnosticsSampleRate, diagnosticsClient, options.remoteConfig, defaultCookieDomain, options.enableRequestBodyCompression, options.customEnrichment);
					return [4, browserConfig.storageProvider.isEnabled()];
				case 5:
					if (!_6.sent()) {
						browserConfig.loggerProvider.warn("Storage provider ".concat(browserConfig.storageProvider.constructor.name, " is not enabled. Falling back to MemoryStorage."));
						browserConfig.storageProvider = new MemoryStorage();
					}
					return [2, browserConfig];
			}
		});
	});
};
var createCookieStorage = function(identityStorage, cookieOptions, cookieConfig) {
	if (identityStorage === void 0) identityStorage = DEFAULT_IDENTITY_STORAGE;
	if (cookieOptions === void 0) cookieOptions = {};
	switch (identityStorage) {
		case "localStorage": return new LocalStorage();
		case "sessionStorage": return new SessionStorage();
		case "none": return new MemoryStorage();
		default: return new CookieStorage(__assign$1(__assign$1({}, cookieOptions), { expirationDays: cookieOptions.expiration }), cookieConfig);
	}
};
/**
* Determines whether to fetch remote config based on options.
* Extracted to allow early determination before useBrowserConfig is called.
*/
var shouldFetchRemoteConfig = function(options) {
	var _a, _b;
	if (options === void 0) options = {};
	if (((_a = options.remoteConfig) === null || _a === void 0 ? void 0 : _a.fetchRemoteConfig) === true) return true;
	else if (((_b = options.remoteConfig) === null || _b === void 0 ? void 0 : _b.fetchRemoteConfig) === false || options.fetchRemoteConfig === false) return false;
	else return true;
};
var createTransport = function(transport) {
	var type = typeof transport === "object" ? transport.type : transport;
	var headers = typeof transport === "object" ? transport.headers : void 0;
	if (type === "xhr") return new XHRTransport(headers);
	if (type === "beacon") return new SendBeaconTransport();
	return new FetchTransport(headers);
};
var getTopLevelDomain = function(url, diagnosticsClient) {
	return __awaiter(void 0, void 0, void 0, function() {
		var host, parts, levels, skipLevel, i, i, domain, result, e_1;
		return __generator(this, function(_a) {
			switch (_a.label) {
				case 0: return [4, new CookieStorage(void 0, { diagnosticsClient }).isEnabled()];
				case 1:
					if (!_a.sent() || !url && (typeof location === "undefined" || !location.hostname)) return [2, ""];
					host = url !== null && url !== void 0 ? url : location.hostname;
					parts = host.split(".");
					if (parts.length === 1) return [2, ""];
					levels = [];
					skipLevel = 1;
					if (KNOWN_2LDS.find(function(tld) {
						return host.endsWith(".".concat(tld));
					})) skipLevel = 2;
					for (i = parts.length - skipLevel - 1; i >= 0; --i) levels.push(parts.slice(i).join("."));
					i = 0;
					_a.label = 2;
				case 2:
					if (!(i < levels.length)) return [3, 7];
					domain = levels[i];
					_a.label = 3;
				case 3:
					_a.trys.push([
						3,
						5,
						,
						6
					]);
					return [4, CookieStorage.isDomainWritable(domain)];
				case 4:
					result = _a.sent();
					if (result) return [2, "." + domain];
					return [3, 6];
				case 5:
					e_1 = _a.sent();
					/* istanbul ignore if */
					if (diagnosticsClient) diagnosticsClient.recordEvent("cookies.tld.failure", {
						reason: "Unexpected exception checking domain is writable: ".concat(domain),
						error: e_1 instanceof Error ? e_1.message : String(e_1)
					});
					return [3, 6];
				case 6:
					i++;
					return [3, 2];
				case 7:
					if (diagnosticsClient) diagnosticsClient.recordEvent("cookies.tld.failure", { reason: "Could not determine TLD for host ".concat(host) });
					return [2, ""];
			}
		});
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/types/event/event.js
var IdentifyOperation;
(function(IdentifyOperation) {
	IdentifyOperation["SET"] = "$set";
	IdentifyOperation["SET_ONCE"] = "$setOnce";
	IdentifyOperation["ADD"] = "$add";
	IdentifyOperation["APPEND"] = "$append";
	IdentifyOperation["PREPEND"] = "$prepend";
	IdentifyOperation["REMOVE"] = "$remove";
	IdentifyOperation["PREINSERT"] = "$preInsert";
	IdentifyOperation["POSTINSERT"] = "$postInsert";
	IdentifyOperation["UNSET"] = "$unset";
	IdentifyOperation["CLEAR_ALL"] = "$clearAll";
})(IdentifyOperation || (IdentifyOperation = {}));
/**
* Strings that have special meaning when used as an event's type
* and have different specifications.
*/
var SpecialEventType;
(function(SpecialEventType) {
	SpecialEventType["IDENTIFY"] = "$identify";
	SpecialEventType["GROUP_IDENTIFY"] = "$groupidentify";
	SpecialEventType["REVENUE"] = "revenue_amount";
})(SpecialEventType || (SpecialEventType = {}));
"".concat("AMP", "_unsent");
var UTM_CAMPAIGN = "utm_campaign";
var UTM_CONTENT = "utm_content";
var UTM_ID = "utm_id";
var UTM_MEDIUM = "utm_medium";
var UTM_SOURCE = "utm_source";
var UTM_TERM = "utm_term";
var DCLID = "dclid";
var FBCLID = "fbclid";
var GBRAID = "gbraid";
var GCLID = "gclid";
var KO_CLICK_ID = "ko_click_id";
var LI_FAT_ID = "li_fat_id";
var MSCLKID = "msclkid";
var RDT_CID = "rdt_cid";
var TTCLID = "ttclid";
var TWCLID = "twclid";
var WBRAID = "wbraid";
var BASE_CAMPAIGN = {
	utm_campaign: void 0,
	utm_content: void 0,
	utm_id: void 0,
	utm_medium: void 0,
	utm_source: void 0,
	utm_term: void 0,
	referrer: void 0,
	referring_domain: void 0,
	dclid: void 0,
	gbraid: void 0,
	gclid: void 0,
	fbclid: void 0,
	ko_click_id: void 0,
	li_fat_id: void 0,
	msclkid: void 0,
	rdt_cid: void 0,
	ttclid: void 0,
	twclid: void 0,
	wbraid: void 0
};
var SAFE_HEADERS = [
	"access-control-allow-origin",
	"access-control-allow-credentials",
	"access-control-expose-headers",
	"access-control-max-age",
	"access-control-allow-methods",
	"access-control-allow-headers",
	"accept-patch",
	"accept-ranges",
	"age",
	"allow",
	"alt-svc",
	"cache-control",
	"connection",
	"content-disposition",
	"content-encoding",
	"content-language",
	"content-length",
	"content-location",
	"content-md5",
	"content-range",
	"content-type",
	"date",
	"delta-base",
	"etag",
	"expires",
	"im",
	"last-modified",
	"link",
	"location",
	"permanent",
	"p3p",
	"pragma",
	"proxy-authenticate",
	"public-key-pins",
	"retry-after",
	"server",
	"status",
	"strict-transport-security",
	"trailer",
	"transfer-encoding",
	"tk",
	"upgrade",
	"vary",
	"via",
	"warning",
	"www-authenticate",
	"x-b3-traceid",
	"x-frame-options"
];
var FORBIDDEN_HEADERS = [
	"authorization",
	"cookie",
	"set-cookie"
];
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/global-scope.js
var getGlobalScope = function() {
	var ampIntegrationContextName = "ampIntegrationContext";
	if (typeof globalThis !== "undefined" && typeof globalThis[ampIntegrationContextName] !== "undefined") return globalThis[ampIntegrationContextName];
	if (typeof globalThis !== "undefined") return globalThis;
	if (typeof window !== "undefined") return window;
	if (typeof self !== "undefined") return self;
	if (typeof global !== "undefined") return global;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/utils/uuid.js
/**
* Source: [jed's gist's comment]{@link https://gist.github.com/jed/982883?permalink_comment_id=3223002#gistcomment-3223002}.
* Returns a random v4 UUID of the form xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx,
* where each x is replaced with a random hexadecimal digit from 0 to f, and
* y is replaced with a random hexadecimal digit from 8 to b.
* Used to generate UUIDs for deviceIds.
* @private
*/
var legacyUUID = function(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : (String(1e7) + String(-1e3) + String(-4e3) + String(-8e3) + String(-1e11)).replace(/[018]/g, UUID);
};
var hex = __spreadArray([], __read$1(Array(256).keys()), false).map(function(index) {
	return index.toString(16).padStart(2, "0");
});
var UUID = function(a) {
	var _a;
	var globalScope = getGlobalScope();
	/* istanbul ignore next */
	if (!((_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.crypto) === null || _a === void 0 ? void 0 : _a.getRandomValues)) return legacyUUID(a);
	var r = globalScope.crypto.getRandomValues(new Uint8Array(16));
	r[6] = r[6] & 15 | 64;
	r[8] = r[8] & 63 | 128;
	return __spreadArray([], __read$1(r.entries()), false).map(function(_a) {
		var _b = __read$1(_a, 2), index = _b[0], int = _b[1];
		return [
			4,
			6,
			8,
			10
		].includes(index) ? "-".concat(hex[int]) : hex[int];
	}).join("");
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/query-params.js
var getQueryParams = function() {
	var _a;
	var globalScope = getGlobalScope();
	/* istanbul ignore if */
	if (!((_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.location) === null || _a === void 0 ? void 0 : _a.search)) return {};
	return globalScope.location.search.substring(1).split("&").filter(Boolean).reduce(function(acc, curr) {
		var query = curr.split("=", 2);
		var key = tryDecodeURIComponent(query[0]);
		var value = tryDecodeURIComponent(query[1]);
		if (!value) return acc;
		acc[key] = value;
		return acc;
	}, {});
};
var tryDecodeURIComponent = function(value) {
	if (value === void 0) value = "";
	try {
		return decodeURIComponent(value);
	} catch (_a) {
		return "";
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/utils/url-utils.js
/**
* Checks if a given URL matches any pattern in an allowlist of URLs or regex patterns.
* @param url - The URL to check
* @param allowlist - Array of allowed URLs (strings) or regex patterns
* @returns true if the URL matches any pattern in the allowlist, false otherwise
*/
var isUrlMatchAllowlist = function(url, allowlist) {
	if (!allowlist || !allowlist.length) return true;
	return allowlist.some(function(allowedUrl) {
		if (typeof allowedUrl === "string") return url === allowedUrl;
		return url.match(allowedUrl);
	});
};
var getDecodeURI = function(locationStr, loggerProvider) {
	var decodedLocationStr = locationStr;
	try {
		decodedLocationStr = decodeURI(locationStr);
	} catch (e) {
		/* istanbul ignore next */
		loggerProvider === null || loggerProvider === void 0 || loggerProvider.error("Malformed URI sequence: ", e);
	}
	return decodedLocationStr;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/utils/omit-undefined.js
var omitUndefined = function(input) {
	var obj = {};
	for (var key in input) {
		var val = input[key];
		if (val) obj[key] = val;
	}
	return obj;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/storage/browser-storage.js
var BrowserStorage = function() {
	function BrowserStorage(storage) {
		this.storage = storage;
	}
	BrowserStorage.prototype.isEnabled = function() {
		return __awaiter(this, void 0, void 0, function() {
			var random, testStorage, testKey, value;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						/* istanbul ignore if */
						if (!this.storage) return [2, false];
						random = String(Date.now());
						testStorage = new BrowserStorage(this.storage);
						testKey = "AMP_TEST";
						_b.label = 1;
					case 1:
						_b.trys.push([
							1,
							4,
							5,
							7
						]);
						return [4, testStorage.set(testKey, random)];
					case 2:
						_b.sent();
						return [4, testStorage.get(testKey)];
					case 3:
						value = _b.sent();
						return [2, value === random];
					case 4:
						_b.sent();
						/* istanbul ignore next */
						return [2, false];
					case 5: return [4, testStorage.remove(testKey)];
					case 6:
						_b.sent();
						return [7];
					case 7: return [2];
				}
			});
		});
	};
	BrowserStorage.prototype.get = function(key) {
		return __awaiter(this, void 0, void 0, function() {
			var value;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						_b.trys.push([
							0,
							2,
							,
							3
						]);
						return [4, this.getRaw(key)];
					case 1:
						value = _b.sent();
						if (!value) return [2, void 0];
						return [2, JSON.parse(value)];
					case 2:
						_b.sent();
						console.error("[Amplitude] Error: Could not get value from storage");
						return [2, void 0];
					case 3: return [2];
				}
			});
		});
	};
	BrowserStorage.prototype.getRaw = function(key) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				return [2, ((_a = this.storage) === null || _a === void 0 ? void 0 : _a.getItem(key)) || void 0];
			});
		});
	};
	BrowserStorage.prototype.set = function(key, value) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				try {
					(_a = this.storage) === null || _a === void 0 || _a.setItem(key, JSON.stringify(value));
				} catch (_c) {}
				return [2];
			});
		});
	};
	BrowserStorage.prototype.remove = function(key) {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				try {
					(_a = this.storage) === null || _a === void 0 || _a.removeItem(key);
				} catch (_c) {}
				return [2];
			});
		});
	};
	BrowserStorage.prototype.reset = function() {
		var _a;
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_b) {
				try {
					(_a = this.storage) === null || _a === void 0 || _a.clear();
				} catch (_c) {}
				return [2];
			});
		});
	};
	return BrowserStorage;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/utils/json-query.js
function isJsonPrimitive(json) {
	return typeof json === "string" || typeof json === "number" || typeof json === "boolean" || json === null || json === void 0;
}
/**
* Prune a JSON object to only include the keys in the allowlist and excludes the keys
* in the exclude list.
*
* This function is a mutative function that will modify the original JSON object.
* This is done to avoid creating a new JSON object and copying the data.
*
* @param json - The JSON object to prune.
* @param allowlist - The keys to include in the pruned JSON object.
* @param excludelist - The keys to exclude from the pruned JSON object.
*/
function pruneJson(json, allowlist, excludelist) {
	if (!json) return;
	_pruneJson({
		json,
		allowlist: allowlist.map(tokenizeJsonPath),
		excludelist: excludelist.map(tokenizeJsonPath),
		ancestors: []
	});
}
function _pruneJson(_a) {
	var e_1, _b;
	var json = _a.json, targetObject = _a.targetObject, allowlist = _a.allowlist, excludelist = _a.excludelist, ancestors = _a.ancestors, parentObject = _a.parentObject, targetKey = _a.targetKey;
	if (!targetObject) targetObject = json;
	var keys = Object.keys(targetObject);
	try {
		for (var keys_1 = __values$1(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
			var key = keys_1_1.value;
			var path = __spreadArray(__spreadArray([], __read$1(ancestors), false), [key], false);
			if (isJsonPrimitive(targetObject[key])) {
				if (!hasPathMatchInList(path, allowlist) || hasPathMatchInList(path, excludelist)) delete targetObject[key];
			} else _pruneJson({
				json,
				targetObject: targetObject[key],
				allowlist,
				excludelist,
				ancestors: path,
				parentObject: targetObject,
				targetKey: key
			});
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (keys_1_1 && !keys_1_1.done && (_b = keys_1.return)) _b.call(keys_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	if (Object.keys(targetObject).length === 0 && parentObject && targetKey) delete parentObject[targetKey];
}
/**
* Tokenize a JSON path string into an array of strings.
* Escapes ~0 and ~1 to ~ and / respectively.
*
* e.g.) turns string "a/b/c" into ["a", "b", "c"]
*
* @param path - The JSON path to tokenize.
* @returns The tokenized JSON path.
*/
function tokenizeJsonPath(path) {
	if (path.startsWith("/")) path = path.slice(1);
	return path.split("/").map(function(token) {
		return token.replace(/~0/g, "~").replace(/~1/g, "/");
	});
}
/**
* Check if a JSON path matches a path matcher.
*
* Rules:
* 1. If a key in a path and a matcher are the same, then they match, move to the next
* 2. If the matcher is a *, then it matches the key, move to the next
* 3. If the matcher is a **, then it matches >=0 keys
*
* @param path - The path to check.
* @param pathMatcher - The path matcher to check against.
* @param i - The current index of the path.
* @param j - The current index of the path matcher.
* @returns True if the path matches the path matcher, false otherwise.
*/
function isPathMatch(path, pathMatcher, i, j) {
	if (i === void 0) i = 0;
	if (j === void 0) j = 0;
	if (j === pathMatcher.length) return i === path.length;
	if (i === path.length) {
		while (j < pathMatcher.length && pathMatcher[j] === "**") j++;
		return j === pathMatcher.length;
	}
	var currentMatcher = pathMatcher[j];
	if (currentMatcher === "**") {
		if (j + 1 === pathMatcher.length) return true;
		for (var k = i; k <= path.length; k++) if (isPathMatch(path, pathMatcher, k, j + 1)) return true;
		return false;
	} else if (currentMatcher === "*" || currentMatcher === path[i]) return isPathMatch(path, pathMatcher, i + 1, j + 1);
	else return false;
}
/**
* Check if a JSON path matches any of the path matchers in the allow or exclude list.
*
* @param path - The JSON path to check.
* @param allowOrExcludeList - The allow or exclude list to check against.
* @returns True if the path matches any of the path matchers in the allow or exclude list, false otherwise.
*/
function hasPathMatchInList(path, allowOrExcludeList) {
	return allowOrExcludeList.some(function(l) {
		return isPathMatch(path, l);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/network-request-event.js
var TEXT_READ_TIMEOUT = 500;
/**
* This class encapsulates the RequestInit (https://developer.mozilla.org/en-US/docs/Web/API/RequestInit)
* object so that the consumer can only get access to the headers, method and body size.
*
* This is to prevent consumers from directly accessing the Request object
* and mutating it or running costly operations on it.
*
* IMPORTANT:
*    * Do not make changes to this class without careful consideration
*      of performance implications, memory usage and potential to mutate the customer's
*      request.
*   * NEVER .clone() the RequestInit object. This will 2x's the memory overhead of the request
*   * NEVER: call .arrayBuffer(), text(), json() or any other method on the body that
*     consumes the body's stream. This will cause the response to be consumed
*     meaning the body will be empty when the customer tries to access it.
*     (ie: if the body is an instanceof https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
*      never call any of the methods on it)
*/
var RequestWrapperFetch = function() {
	function RequestWrapperFetch(request) {
		this.request = request;
	}
	RequestWrapperFetch.prototype.headers = function(allow) {
		var e_1, _a;
		if (allow === void 0) allow = [];
		var headersUnsafe = this.request.headers;
		var headersSafeCopy = {};
		if (Array.isArray(headersUnsafe)) headersUnsafe.forEach(function(_a) {
			var _b = __read$1(_a, 2), headerName = _b[0];
			headersSafeCopy[headerName] = _b[1];
		});
		else if (headersUnsafe instanceof Headers) headersUnsafe.forEach(function(value, key) {
			headersSafeCopy[key] = value;
		});
		else if (typeof headersUnsafe === "object" && headersUnsafe !== null) try {
			for (var _b = __values$1(Object.entries(headersUnsafe)), _c = _b.next(); !_c.done; _c = _b.next()) {
				var _d = __read$1(_c.value, 2), key = _d[0];
				headersSafeCopy[key] = _d[1];
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
		return pruneHeaders(headersSafeCopy, { allow });
	};
	Object.defineProperty(RequestWrapperFetch.prototype, "bodySize", {
		get: function() {
			if (typeof this._bodySize === "number") return this._bodySize;
			var global = getGlobalScope();
			/* istanbul ignore if */
			if (!(global === null || global === void 0 ? void 0 : global.TextEncoder)) return;
			var body = this.request.body;
			this._bodySize = getBodySize(body, 100);
			return this._bodySize;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(RequestWrapperFetch.prototype, "method", {
		get: function() {
			return this.request.method;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(RequestWrapperFetch.prototype, "body", {
		get: function() {
			if (typeof this.request.body === "string") return this.request.body;
			return null;
		},
		enumerable: false,
		configurable: true
	});
	RequestWrapperFetch.prototype.json = function(allow, exclude) {
		if (allow === void 0) allow = [];
		if (exclude === void 0) exclude = [];
		return __awaiter(this, void 0, void 0, function() {
			var text;
			return __generator(this, function(_a) {
				if (allow.length === 0) return [2, null];
				text = this.body;
				return [2, safeParseAndPruneBody(text, allow, exclude)];
			});
		});
	};
	return RequestWrapperFetch;
}();
var RequestWrapperXhr = function() {
	function RequestWrapperXhr(bodyRaw, requestHeaders) {
		this.bodyRaw = bodyRaw;
		this.requestHeaders = requestHeaders;
	}
	RequestWrapperXhr.prototype.headers = function(allow) {
		if (allow === void 0) allow = [];
		return pruneHeaders(this.requestHeaders, { allow });
	};
	Object.defineProperty(RequestWrapperXhr.prototype, "bodySize", {
		get: function() {
			return getBodySize(this.bodyRaw, 100);
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(RequestWrapperXhr.prototype, "body", {
		get: function() {
			if (typeof this.bodyRaw === "string") return this.bodyRaw;
			return null;
		},
		enumerable: false,
		configurable: true
	});
	RequestWrapperXhr.prototype.json = function(allow, exclude) {
		if (allow === void 0) allow = [];
		if (exclude === void 0) exclude = [];
		return __awaiter(this, void 0, void 0, function() {
			var text;
			return __generator(this, function(_a) {
				if (allow.length === 0) return [2, null];
				text = this.body;
				return [2, safeParseAndPruneBody(text, allow, exclude)];
			});
		});
	};
	return RequestWrapperXhr;
}();
function getBodySize(bodyUnsafe, maxEntries) {
	var e_2, _a;
	var bodySize;
	var global = getGlobalScope();
	/* istanbul ignore next */
	var TextEncoder = global === null || global === void 0 ? void 0 : global.TextEncoder;
	/* istanbul ignore next */
	if (!TextEncoder) return;
	var bodySafe;
	if (typeof bodyUnsafe === "string") {
		bodySafe = bodyUnsafe;
		bodySize = new TextEncoder().encode(bodySafe).length;
	} else if (bodyUnsafe instanceof Blob) {
		bodySafe = bodyUnsafe;
		bodySize = bodySafe.size;
	} else if (bodyUnsafe instanceof URLSearchParams) {
		bodySafe = bodyUnsafe;
		bodySize = new TextEncoder().encode(bodySafe.toString()).length;
	} else if (ArrayBuffer.isView(bodyUnsafe)) {
		bodySafe = bodyUnsafe;
		bodySize = bodySafe.byteLength;
	} else if (bodyUnsafe instanceof ArrayBuffer) {
		bodySafe = bodyUnsafe;
		bodySize = bodySafe.byteLength;
	} else if (bodyUnsafe instanceof FormData) {
		var formData = bodyUnsafe;
		var total = 0;
		var count = 0;
		try {
			for (var _b = __values$1(formData.entries()), _c = _b.next(); !_c.done; _c = _b.next()) {
				var _d = __read$1(_c.value, 2), key = _d[0], value = _d[1];
				total += key.length;
				if (typeof value === "string") total += new TextEncoder().encode(value).length;
				else if (value instanceof Blob) total += value.size;
				else return;
				if (++count >= maxEntries) return;
			}
		} catch (e_2_1) {
			e_2 = { error: e_2_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_2) throw e_2.error;
			}
		}
		bodySize = total;
	} else if (bodyUnsafe instanceof ReadableStream) {
		bodySafe = bodyUnsafe;
		return;
	}
	return bodySize;
}
/**
* This class encapsulates the Fetch API Response object
* (https://developer.mozilla.org/en-US/docs/Web/API/Response) so that the consumer can
* only get access to the headers and body size.
*
* This is to prevent consumers from directly accessing the Response object
* and mutating it or running costly operations on it.
*
* IMPORTANT:
*   * Do not make changes to this class without careful consideration
*     of performance implications, memory usage and potential to mutate the customer's
*     response.
*   * Do not .clone() the Response object unless you need to access the body.
*     Cloning will 2x the memory overhead of the response.
*   * NEVER consume the body's stream. This will cause the response to be consumed
*     meaning the body will be empty when the customer tries to access it.
*     (ie: if the body is an instanceof https://developer.mozilla.org/en-US/docs/Web/API/ReadableStream
*      never call any of the methods on it)
*/
var ResponseWrapperFetch = function() {
	function ResponseWrapperFetch(response) {
		this.response = response;
	}
	ResponseWrapperFetch.prototype.headers = function(allow) {
		var _a;
		if (allow === void 0) allow = [];
		if (this.response.headers instanceof Headers) {
			var headersSafe = this.response.headers;
			var headersOut_1 = {};
			/* istanbul ignore next */
			(_a = headersSafe === null || headersSafe === void 0 ? void 0 : headersSafe.forEach) === null || _a === void 0 || _a.call(headersSafe, function(value, key) {
				headersOut_1[key] = value;
			});
			return pruneHeaders(headersOut_1, { allow });
		}
	};
	Object.defineProperty(ResponseWrapperFetch.prototype, "bodySize", {
		get: function() {
			var _a, _b;
			if (this._bodySize !== void 0) return this._bodySize;
			/* istanbul ignore next */
			var contentLength = (_b = (_a = this.response.headers) === null || _a === void 0 ? void 0 : _a.get) === null || _b === void 0 ? void 0 : _b.call(_a, "content-length");
			var bodySize = contentLength ? parseInt(contentLength, 10) : void 0;
			this._bodySize = bodySize;
			return bodySize;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ResponseWrapperFetch.prototype, "status", {
		get: function() {
			return this.response.status;
		},
		enumerable: false,
		configurable: true
	});
	ResponseWrapperFetch.prototype.text = function() {
		return __awaiter(this, void 0, void 0, function() {
			var textPromise, timer, text;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (!this.clonedResponse) this.clonedResponse = this.response.clone();
						_a.label = 1;
					case 1:
						_a.trys.push([
							1,
							3,
							,
							4
						]);
						textPromise = this.clonedResponse.text();
						timer = new Promise(function(resolve) {
							return setTimeout(
								/* istanbul ignore next */
								function() {
									return resolve(null);
								},
								TEXT_READ_TIMEOUT
							);
						});
						return [4, Promise.race([textPromise, timer])];
					case 2:
						text = _a.sent();
						return [2, text];
					case 3:
						_a.sent();
						return [2, null];
					case 4: return [2];
				}
			});
		});
	};
	ResponseWrapperFetch.prototype.json = function(allow, exclude) {
		if (allow === void 0) allow = [];
		if (exclude === void 0) exclude = [];
		return __awaiter(this, void 0, void 0, function() {
			var text;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0:
						if (allow.length === 0) return [2, null];
						return [4, this.text()];
					case 1:
						text = _a.sent();
						return [2, safeParseAndPruneBody(text, allow, exclude)];
				}
			});
		});
	};
	return ResponseWrapperFetch;
}();
var ResponseWrapperXhr = function() {
	function ResponseWrapperXhr(statusCode, headersString, size, getJson) {
		this.statusCode = statusCode;
		this.headersString = headersString;
		this.size = size;
		this.getJson = getJson;
	}
	Object.defineProperty(ResponseWrapperXhr.prototype, "bodySize", {
		get: function() {
			return this.size;
		},
		enumerable: false,
		configurable: true
	});
	Object.defineProperty(ResponseWrapperXhr.prototype, "status", {
		get: function() {
			return this.statusCode;
		},
		enumerable: false,
		configurable: true
	});
	ResponseWrapperXhr.prototype.headers = function(allow) {
		var e_3, _a;
		if (allow === void 0) allow = [];
		if (!this.headersString) return {};
		var headers = {};
		var headerLines = this.headersString.split("\r\n");
		try {
			for (var headerLines_1 = __values$1(headerLines), headerLines_1_1 = headerLines_1.next(); !headerLines_1_1.done; headerLines_1_1 = headerLines_1.next()) {
				var line = headerLines_1_1.value;
				var _b = __read$1(line.split(": "), 2), key = _b[0], value = _b[1];
				if (key && value) headers[key] = value;
			}
		} catch (e_3_1) {
			e_3 = { error: e_3_1 };
		} finally {
			try {
				if (headerLines_1_1 && !headerLines_1_1.done && (_a = headerLines_1.return)) _a.call(headerLines_1);
			} finally {
				if (e_3) throw e_3.error;
			}
		}
		return pruneHeaders(headers, { allow });
	};
	ResponseWrapperXhr.prototype.json = function(allow, exclude) {
		if (allow === void 0) allow = [];
		if (exclude === void 0) exclude = [];
		return __awaiter(this, void 0, void 0, function() {
			var jsonBody;
			return __generator(this, function(_a) {
				if (allow.length === 0) return [2, null];
				jsonBody = this.getJson();
				if (jsonBody) {
					pruneJson(jsonBody, allow, exclude);
					return [2, jsonBody];
				}
				return [2, null];
			});
		});
	};
	return ResponseWrapperXhr;
}();
function safeParseAndPruneBody(text, allow, exclude) {
	if (!text) return null;
	try {
		var json = JSON.parse(text);
		pruneJson(json, allow, exclude);
		return json;
	} catch (error) {
		return null;
	}
}
var PRUNE_STRATEGY;
(function(PRUNE_STRATEGY) {
	PRUNE_STRATEGY["REDACT"] = "redact";
	PRUNE_STRATEGY["REMOVE"] = "remove";
})(PRUNE_STRATEGY || (PRUNE_STRATEGY = {}));
var REDACTED_VALUE = "[REDACTED]";
/**
* Prune headers from a headers record object.
* @param headers - The headers to prune.
* @param options - The options to prune the headers.
* @param options.exclude - List of headers to delete from headers
* @param options.include - List of headers to keep in headers, if not provided, all headers are kept by default
* @returns The pruned headers.
*/
var pruneHeaders = function(headers, options) {
	var e_4, _a;
	var _b = options.allow, allow = _b === void 0 ? [] : _b, _c = options.strategy, strategy = _c === void 0 ? PRUNE_STRATEGY.REMOVE : _c;
	var exclude = __spreadArray([], __read$1(FORBIDDEN_HEADERS), false);
	var headersPruned = {};
	var _loop_1 = function(key) {
		var lowerKey = key.toLowerCase();
		if (exclude.find(function(e) {
			return e.toLowerCase() === lowerKey;
		})) {
			if (strategy === PRUNE_STRATEGY.REDACT) headersPruned[key] = REDACTED_VALUE;
		} else if (!allow.find(function(i) {
			return i.toLowerCase() === lowerKey;
		})) {
			if (strategy === PRUNE_STRATEGY.REDACT) headersPruned[key] = REDACTED_VALUE;
		} else headersPruned[key] = headers[key];
	};
	try {
		for (var _d = __values$1(Object.keys(headers)), _e = _d.next(); !_e.done; _e = _d.next()) {
			var key = _e.value;
			_loop_1(key);
		}
	} catch (e_4_1) {
		e_4 = { error: e_4_1 };
	} finally {
		try {
			if (_e && !_e.done && (_a = _d.return)) _a.call(_d);
		} finally {
			if (e_4) throw e_4.error;
		}
	}
	return headersPruned;
};
var NetworkRequestEvent = function() {
	function NetworkRequestEvent(type, method, timestamp, startTime, url, requestWrapper, status, duration, responseWrapper, error, endTime) {
		if (status === void 0) status = 0;
		this.type = type;
		this.method = method;
		this.timestamp = timestamp;
		this.startTime = startTime;
		this.url = url;
		this.requestWrapper = requestWrapper;
		this.status = status;
		this.duration = duration;
		this.responseWrapper = responseWrapper;
		this.error = error;
		this.endTime = endTime;
	}
	NetworkRequestEvent.prototype.toSerializable = function() {
		var _a, _b, _c, _d;
		var serialized = {
			type: this.type,
			method: this.method,
			url: this.url,
			timestamp: this.timestamp,
			status: this.status,
			duration: this.duration,
			error: this.error,
			startTime: this.startTime,
			endTime: this.endTime,
			requestHeaders: (_a = this.requestWrapper) === null || _a === void 0 ? void 0 : _a.headers(__spreadArray([], __read$1(SAFE_HEADERS), false)),
			requestBodySize: (_b = this.requestWrapper) === null || _b === void 0 ? void 0 : _b.bodySize,
			responseHeaders: (_c = this.responseWrapper) === null || _c === void 0 ? void 0 : _c.headers(__spreadArray([], __read$1(SAFE_HEADERS), false)),
			responseBodySize: (_d = this.responseWrapper) === null || _d === void 0 ? void 0 : _d.bodySize
		};
		return Object.fromEntries(Object.entries(serialized).filter(function(_a) {
			var _b = __read$1(_a, 2);
			_b[0];
			return _b[1] !== void 0;
		}));
	};
	return NetworkRequestEvent;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/observers/network.js
/**
* Typeguard function checks if an input is a Request object.
*/
function isRequest(requestInfo) {
	return typeof requestInfo === "object" && requestInfo !== null && "url" in requestInfo && "method" in requestInfo;
}
var NetworkEventCallback = function() {
	function NetworkEventCallback(callback, id) {
		if (id === void 0) id = UUID();
		this.callback = callback;
		this.id = id;
	}
	return NetworkEventCallback;
}();
function safeInvoke(fn) {
	try {
		fn();
	} catch (err) {}
}
var networkObserver = new (function() {
	function NetworkObserver(logger) {
		this.eventCallbacks = /* @__PURE__ */ new Map();
		this.isObserving = false;
		this.logger = logger;
		var globalScope = getGlobalScope();
		if (!NetworkObserver.isSupported())
 /* istanbul ignore next */
		return;
		this.globalScope = globalScope;
	}
	NetworkObserver.isSupported = function() {
		var globalScope = getGlobalScope();
		return !!globalScope && !!globalScope.fetch;
	};
	NetworkObserver.prototype.subscribe = function(eventCallback, logger) {
		var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
		if (!this.logger) this.logger = logger;
		this.eventCallbacks.set(eventCallback.id, eventCallback);
		if (!this.isObserving) {
			/* istanbul ignore next */
			var originalXhrOpen = (_c = (_b = (_a = this.globalScope) === null || _a === void 0 ? void 0 : _a.XMLHttpRequest) === null || _b === void 0 ? void 0 : _b.prototype) === null || _c === void 0 ? void 0 : _c.open;
			/* istanbul ignore next */
			var originalXhrSend = (_f = (_e = (_d = this.globalScope) === null || _d === void 0 ? void 0 : _d.XMLHttpRequest) === null || _e === void 0 ? void 0 : _e.prototype) === null || _f === void 0 ? void 0 : _f.send;
			/* istanbul ignore next */
			var originalXhrSetRequestHeader = (_j = (_h = (_g = this.globalScope) === null || _g === void 0 ? void 0 : _g.XMLHttpRequest) === null || _h === void 0 ? void 0 : _h.prototype) === null || _j === void 0 ? void 0 : _j.setRequestHeader;
			if (originalXhrOpen && originalXhrSend && originalXhrSetRequestHeader) this.observeXhr(originalXhrOpen, originalXhrSend, originalXhrSetRequestHeader);
			/* istanbul ignore next */
			var originalFetch = (_k = this.globalScope) === null || _k === void 0 ? void 0 : _k.fetch;
			/* istanbul ignore next */
			if (originalFetch) this.observeFetch(originalFetch);
			/* istanbul ignore next */
			this.isObserving = true;
		}
	};
	NetworkObserver.prototype.unsubscribe = function(eventCallback) {
		this.eventCallbacks.delete(eventCallback.id);
	};
	NetworkObserver.prototype.triggerEventCallbacks = function(event) {
		var _this = this;
		this.eventCallbacks.forEach(function(callback) {
			try {
				callback.callback(event);
			} catch (err) {
				safeInvoke(function() {
					var _a;
					/* istanbul ignore next */
					(_a = _this.logger) === null || _a === void 0 || _a.debug("an unexpected error occurred while triggering event callbacks", err);
				});
			}
		});
	};
	NetworkObserver.prototype.handleNetworkRequestEvent = function(requestType, requestInfo, requestWrapper, responseWrapper, typedError, startTime, durationStart) {
		var _a;
		/* istanbul ignore next */
		if (startTime === void 0 || durationStart === void 0) return;
		var url;
		var method = "GET";
		if (isRequest(requestInfo)) {
			url = requestInfo["url"];
			method = requestInfo["method"];
		} else url = (_a = requestInfo === null || requestInfo === void 0 ? void 0 : requestInfo.toString) === null || _a === void 0 ? void 0 : _a.call(requestInfo);
		if (url) try {
			var parsedUrl = new URL(url);
			url = "".concat(parsedUrl.protocol, "//").concat(parsedUrl.host).concat(parsedUrl.pathname).concat(parsedUrl.search).concat(parsedUrl.hash);
		} catch (err) {}
		method = (requestWrapper === null || requestWrapper === void 0 ? void 0 : requestWrapper.method) || method;
		var status, error;
		if (responseWrapper) status = responseWrapper.status;
		if (typedError) {
			error = {
				name: typedError.name || "UnknownError",
				message: typedError.message || "An unknown error occurred"
			};
			status = 0;
		}
		var duration = Math.floor(performance.now() - durationStart);
		var endTime = Math.floor(startTime + duration);
		var requestEvent = new NetworkRequestEvent(requestType, method, startTime, startTime, url, requestWrapper, status, duration, responseWrapper, error, endTime);
		this.triggerEventCallbacks(requestEvent);
	};
	NetworkObserver.prototype.getTimestamps = function() {
		var _a, _b;
		/* istanbul ignore next */
		return {
			startTime: (_a = Date.now) === null || _a === void 0 ? void 0 : _a.call(Date),
			durationStart: (_b = performance === null || performance === void 0 ? void 0 : performance.now) === null || _b === void 0 ? void 0 : _b.call(performance)
		};
	};
	NetworkObserver.prototype.observeFetch = function(originalFetch) {
		var _this = this;
		/* istanbul ignore next */
		if (!this.globalScope || !originalFetch) return;
		/**
		* IMPORTANT: This overrides window.fetch in browsers.
		* You probably never need to make changes to this function.
		* If you do, please be careful to preserve the original functionality of fetch
		* and make sure another developer who is an expert reviews this change throughly
		*/
		this.globalScope.fetch = function(requestInfo, requestInit) {
			return __awaiter(_this, void 0, void 0, function() {
				var timestamps, originalResponse, originalError, err_1;
				var _this = this;
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0:
							try {
								timestamps = this.getTimestamps();
							} catch (error) {
								/* istanbul ignore next */
								safeInvoke(function() {
									var _a;
									return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.debug("an unexpected error occurred while retrieving timestamps", error);
								});
							}
							_a.label = 1;
						case 1:
							_a.trys.push([
								1,
								3,
								,
								4
							]);
							return [4, originalFetch(requestInfo, requestInit)];
						case 2:
							originalResponse = _a.sent();
							return [3, 4];
						case 3:
							err_1 = _a.sent();
							originalError = err_1;
							return [3, 4];
						case 4:
							try {
								this.handleNetworkRequestEvent(
									"fetch",
									requestInfo,
									requestInit ? new RequestWrapperFetch(requestInit) : void 0,
									originalResponse ? new ResponseWrapperFetch(originalResponse) : void 0,
									originalError,
									/* istanbul ignore next */
									timestamps === null || timestamps === void 0 ? void 0 : timestamps.startTime,
									/* istanbul ignore next */
									timestamps === null || timestamps === void 0 ? void 0 : timestamps.durationStart
								);
							} catch (err) {
								/* istanbul ignore next */
								safeInvoke(function() {
									var _a;
									return (_a = _this.logger) === null || _a === void 0 ? void 0 : _a.debug("an unexpected error occurred while handling fetch", err);
								});
							}
							if (originalResponse) return [2, originalResponse];
							else throw originalError;
							return [2];
					}
				});
			});
		};
	};
	/**
	* Creates a function that parses the response of an XMLHttpRequest as JSON.
	*
	* Returns function instead of JSON object to avoid unnecessary parsing if the
	* body is not being captured.
	*
	* @param xhrSafe - The XMLHttpRequest object.
	* @param context - The NetworkObserver instance.
	* @returns A function that parses the response of an XMLHttpRequest as JSON.
	*/
	NetworkObserver.createXhrJsonParser = function(xhrUnsafe, context) {
		return function() {
			var _a;
			try {
				if (xhrUnsafe.responseType === "json") {
					if ((_a = context.globalScope) === null || _a === void 0 ? void 0 : _a.structuredClone) return context.globalScope.structuredClone(xhrUnsafe.response);
				} else if (["text", ""].includes(xhrUnsafe.responseType)) return JSON.parse(xhrUnsafe.responseText);
			} catch (err) {
				/* istanbul ignore if */
				if (err instanceof Error && err.name === "InvalidStateError") safeInvoke(function() {
					var _a;
					return (_a = context.logger) === null || _a === void 0 ? void 0 : _a.debug("unexpected error when retrieving responseText. responseType='".concat(xhrUnsafe.responseType, "'"));
				});
				return null;
			}
			return null;
		};
	};
	NetworkObserver.prototype.observeXhr = function(originalXhrOpen, originalXhrSend, originalXhrSetRequestHeader) {
		/* istanbul ignore next */
		if (!this.globalScope || !originalXhrOpen || !originalXhrSend) return;
		var xhrProto = this.globalScope.XMLHttpRequest.prototype;
		var networkObserverContext = this;
		/**
		* IMPORTANT: This overrides window.XMLHttpRequest.prototype.open
		* You probably never need to make changes to this function.
		* If you do, please be careful to preserve the original functionality of xhr.open
		* and make sure another developer who is an expert reviews this change throughly
		*/
		xhrProto.open = function() {
			var _a;
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			var xhrSafe = this;
			var _b = __read$1(args, 2), method = _b[0], url = _b[1];
			try {
				/* istanbul ignore next */
				xhrSafe.$$AmplitudeAnalyticsEvent = __assign$1({
					method,
					url: (_a = url === null || url === void 0 ? void 0 : url.toString) === null || _a === void 0 ? void 0 : _a.call(url),
					headers: {}
				}, networkObserverContext.getTimestamps());
			} catch (err) {
				/* istanbul ignore next */
				safeInvoke(function() {
					var _a;
					return (_a = networkObserverContext.logger) === null || _a === void 0 ? void 0 : _a.debug("an unexpected error occurred while calling xhr open", err);
				});
			}
			return originalXhrOpen.apply(xhrSafe, args);
		};
		/**
		* IMPORTANT: This overrides window.XMLHttpRequest.prototype.send
		* You probably never need to make changes to this function.
		* If you do, please be careful to preserve the original functionality of xhr.send
		* and make sure another developer who is an expert reviews this change throughly
		*/
		xhrProto.send = function() {
			var args = [];
			for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
			var xhrUnsafe = this;
			var xhrSafe = xhrUnsafe;
			var getJson = NetworkObserver.createXhrJsonParser(xhrUnsafe, networkObserverContext);
			var body = args[0];
			var requestEvent = xhrSafe.$$AmplitudeAnalyticsEvent;
			if (xhrSafe.$$AmplitudeAnalyticsEvent) xhrSafe.addEventListener("loadend", function() {
				try {
					var responseHeaders = xhrSafe.getAllResponseHeaders();
					var responseBodySize = xhrSafe.getResponseHeader("content-length");
					var responseWrapper = new ResponseWrapperXhr(
						xhrSafe.status,
						responseHeaders,
						/* istanbul ignore next */
						responseBodySize ? parseInt(responseBodySize, 10) : void 0,
						getJson
					);
					var requestHeaders = xhrSafe.$$AmplitudeAnalyticsEvent.headers;
					var requestWrapper = new RequestWrapperXhr(body, requestHeaders);
					requestEvent.status = xhrSafe.status;
					networkObserverContext.handleNetworkRequestEvent("xhr", {
						url: requestEvent.url,
						method: requestEvent.method
					}, requestWrapper, responseWrapper, void 0, requestEvent.startTime, requestEvent.durationStart);
				} catch (err) {
					/* istanbul ignore next */
					safeInvoke(function() {
						var _a;
						return (_a = networkObserverContext.logger) === null || _a === void 0 ? void 0 : _a.debug("an unexpected error occurred while handling xhr send", err);
					});
				}
			});
			return originalXhrSend.apply(xhrSafe, args);
		};
		/**
		* IMPORTANT: This overrides window.XMLHttpRequest.prototype.setRequestHeader
		* You probably never need to make changes to this function.
		* If you do, please be careful to preserve the original functionality of xhr.setRequestHeader
		* and make sure another developer who is an expert reviews this change throughly
		*/
		xhrProto.setRequestHeader = function(headerName, headerValue) {
			var xhrSafe = this;
			try {
				var analyticsEvent = xhrSafe.$$AmplitudeAnalyticsEvent;
				if (analyticsEvent) analyticsEvent.headers[headerName] = headerValue;
			} catch (err) {
				/* istanbul ignore next */
				safeInvoke(function() {
					var _a;
					return (_a = networkObserverContext.logger) === null || _a === void 0 ? void 0 : _a.debug("an unexpected error occurred while calling xhr setRequestHeader", err);
				});
			}
			originalXhrSetRequestHeader.apply(xhrSafe, [headerName, headerValue]);
		};
	};
	return NetworkObserver;
}())();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-core@2.48.0/node_modules/@amplitude/analytics-core/lib/esm/campaign/campaign-parser.js
var CampaignParser = function() {
	function CampaignParser() {}
	CampaignParser.prototype.parse = function() {
		return __awaiter(this, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, __assign$1(__assign$1(__assign$1(__assign$1({}, BASE_CAMPAIGN), this.getUtmParam()), this.getReferrer()), this.getClickIds())];
			});
		});
	};
	CampaignParser.prototype.getUtmParam = function() {
		var params = getQueryParams();
		return {
			utm_campaign: params[UTM_CAMPAIGN],
			utm_content: params[UTM_CONTENT],
			utm_id: params[UTM_ID],
			utm_medium: params[UTM_MEDIUM],
			utm_source: params[UTM_SOURCE],
			utm_term: params[UTM_TERM]
		};
	};
	CampaignParser.prototype.getReferrer = function() {
		var _a, _b;
		var data = {
			referrer: void 0,
			referring_domain: void 0
		};
		try {
			data.referrer = document.referrer || void 0;
			data.referring_domain = (_b = (_a = data.referrer) === null || _a === void 0 ? void 0 : _a.split("/")[2]) !== null && _b !== void 0 ? _b : void 0;
		} catch (_c) {}
		return data;
	};
	CampaignParser.prototype.getClickIds = function() {
		var _a;
		var params = getQueryParams();
		return _a = {}, _a[DCLID] = params[DCLID], _a[FBCLID] = params[FBCLID], _a[GBRAID] = params[GBRAID], _a[GCLID] = params[GCLID], _a[KO_CLICK_ID] = params[KO_CLICK_ID], _a[LI_FAT_ID] = params[LI_FAT_ID], _a[MSCLKID] = params[MSCLKID], _a[RDT_CID] = params[RDT_CID], _a[TTCLID] = params[TTCLID], _a[TWCLID] = params[TWCLID], _a[WBRAID] = params[WBRAID], _a;
	};
	return CampaignParser;
}();
var MASKED_TEXT_VALUE = "*****";
var CC_REGEX = /\b(?:\d[ -]*?){13,16}\b/;
var SSN_REGEX = /(\d{3}-?\d{2}-?\d{4})/g;
var EMAIL_REGEX = /[^\s@]+@[^\s@.]+\.[^\s@]+/g;
/**
* Replaces sensitive strings (credit cards, SSNs, emails) and custom patterns with masked text
* @param text - The text to search for sensitive data
* @param additionalMaskTextPatterns - Optional array of additional regex patterns to mask
* @returns The text with sensitive data replaced by masked text
*/
var replaceSensitiveString = function(text, additionalMaskTextPatterns) {
	var e_1, _a;
	if (additionalMaskTextPatterns === void 0) additionalMaskTextPatterns = [];
	if (typeof text !== "string") return "";
	var result = text;
	result = result.replace(CC_REGEX, MASKED_TEXT_VALUE);
	result = result.replace(SSN_REGEX, MASKED_TEXT_VALUE);
	result = result.replace(EMAIL_REGEX, MASKED_TEXT_VALUE);
	try {
		for (var additionalMaskTextPatterns_1 = __values$1(additionalMaskTextPatterns), additionalMaskTextPatterns_1_1 = additionalMaskTextPatterns_1.next(); !additionalMaskTextPatterns_1_1.done; additionalMaskTextPatterns_1_1 = additionalMaskTextPatterns_1.next()) {
			var pattern = additionalMaskTextPatterns_1_1.value;
			try {
				result = result.replace(pattern, MASKED_TEXT_VALUE);
			} catch (_b) {}
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (additionalMaskTextPatterns_1_1 && !additionalMaskTextPatterns_1_1.done && (_a = additionalMaskTextPatterns_1.return)) _a.call(additionalMaskTextPatterns_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	return result;
};
/**
* Gets the page title, checking if the title element has data-amp-mask attribute
* @returns The page title, masked if the title element has data-amp-mask attribute
*/
var getPageTitle = function(parseTitleFunction) {
	if (typeof document === "undefined" || !document.title) return "";
	var titleElement = document.querySelector("title");
	if (titleElement && titleElement.hasAttribute("data-amp-mask")) return MASKED_TEXT_VALUE;
	return parseTitleFunction ? parseTitleFunction(document.title) : document.title;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-page-view-tracking-browser@2.11.0/node_modules/@amplitude/plugin-page-view-tracking-browser/lib/esm/page-view-tracking.js
var defaultPageViewEvent = "[Amplitude] Page Viewed";
var PAGE_VIEW_SESSION_STORAGE_KEY$1 = "AMP_PAGE_VIEW";
var pageViewTrackingPlugin = function(options) {
	if (options === void 0) options = {};
	var amplitude;
	var globalScope = getGlobalScope();
	var loggerProvider = void 0;
	var isTracking = false;
	var localConfig;
	var sessionStorage;
	var trackOn = options.trackOn, trackHistoryChanges = options.trackHistoryChanges, _a = options.eventType, eventType = _a === void 0 ? defaultPageViewEvent : _a;
	var getDecodeURI = function(locationStr) {
		var decodedLocationStr = locationStr;
		try {
			decodedLocationStr = decodeURI(locationStr);
		} catch (e) {
			/* istanbul ignore next */
			loggerProvider === null || loggerProvider === void 0 || loggerProvider.error("Malformed URI sequence: ", e);
		}
		return decodedLocationStr;
	};
	var createPageViewEvent = function(pageViewId) {
		return __awaiter(void 0, void 0, void 0, function() {
			var locationHREF, _a;
			var _b;
			return __generator(this, function(_c) {
				switch (_c.label) {
					case 0:
						locationHREF = getDecodeURI(typeof location !== "undefined" && location.href || "");
						_b = { event_type: eventType };
						_a = [{}];
						return [4, getCampaignParams()];
					case 1: return [2, (_b.event_properties = __assign$1.apply(void 0, [__assign$1.apply(void 0, _a.concat([_c.sent()])), {
						"[Amplitude] Page Domain": typeof location !== "undefined" && location.hostname || "",
						"[Amplitude] Page Location": locationHREF,
						"[Amplitude] Page Path": typeof location !== "undefined" && getDecodeURI(location.pathname) || "",
						"[Amplitude] Page Title": getPageTitle(replaceSensitiveString),
						"[Amplitude] Page URL": locationHREF.split("?")[0],
						"[Amplitude] Page View ID": pageViewId
					}]), _b)];
				}
			});
		});
	};
	var shouldTrackOnPageLoad = function() {
		return typeof trackOn === "undefined" || typeof trackOn === "function" && trackOn();
	};
	/* istanbul ignore next */
	var previousURL = typeof location !== "undefined" ? location.href : null;
	var trackHistoryPageView = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			var newURL, shouldTrackPageView, pageViewId, _b, _c;
			return __generator(this, function(_d) {
				switch (_d.label) {
					case 0:
						newURL = location.href;
						shouldTrackPageView = shouldTrackHistoryPageView(trackHistoryChanges, newURL, previousURL || "") && shouldTrackOnPageLoad();
						previousURL = newURL;
						if (!shouldTrackPageView) return [3, 4];
						pageViewId = void 0;
						if (sessionStorage) {
							pageViewId = UUID();
							sessionStorage.set(PAGE_VIEW_SESSION_STORAGE_KEY$1, { pageViewId });
						}
						/* istanbul ignore next */
						loggerProvider === null || loggerProvider === void 0 || loggerProvider.log("Tracking page view event");
						if (!(amplitude === null || amplitude === void 0)) return [3, 1];
						return [3, 3];
					case 1:
						_c = (_b = amplitude).track;
						return [4, createPageViewEvent(pageViewId)];
					case 2:
						_c.apply(_b, [_d.sent()]);
						_d.label = 3;
					case 3: _d.label = 4;
					case 4: return [2];
				}
			});
		});
	};
	/* istanbul ignore next */
	var handlePageChange = function() {
		trackHistoryPageView();
	};
	return {
		name: "@amplitude/plugin-page-view-tracking-browser",
		type: "enrichment",
		setup: function(config, client) {
			return __awaiter(void 0, void 0, void 0, function() {
				var pageViewId, _a, _b;
				return __generator(this, function(_c) {
					switch (_c.label) {
						case 0:
							amplitude = client;
							localConfig = config;
							loggerProvider = config.loggerProvider;
							loggerProvider.log("Installing @amplitude/plugin-page-view-tracking-browser");
							isTracking = true;
							if (globalScope) {
								try {
									sessionStorage = new BrowserStorage(globalScope.sessionStorage);
								} catch (error) {
									/* istanbul ignore next */
									loggerProvider === null || loggerProvider === void 0 || loggerProvider.debug("sessionStorage is not available in this environment.");
								}
								globalScope.addEventListener("popstate", handlePageChange);
								/* istanbul ignore next */
								globalScope.history.pushState = new Proxy(globalScope.history.pushState, { apply: function(target, thisArg, _a) {
									var _b = __read$1(_a, 3), state = _b[0], unused = _b[1], url = _b[2];
									target.apply(thisArg, [
										state,
										unused,
										url
									]);
									if (isTracking) handlePageChange();
								} });
							}
							if (!shouldTrackOnPageLoad()) return [3, 2];
							loggerProvider.log("Tracking page view event");
							pageViewId = void 0;
							if (sessionStorage) {
								pageViewId = UUID();
								sessionStorage.set(PAGE_VIEW_SESSION_STORAGE_KEY$1, { pageViewId });
							}
							_b = (_a = amplitude).track;
							return [4, createPageViewEvent(pageViewId)];
						case 1:
							_b.apply(_a, [_c.sent()]);
							_c.label = 2;
						case 2: return [2];
					}
				});
			});
		},
		execute: function(event) {
			return __awaiter(void 0, void 0, void 0, function() {
				var pageViewId, pageViewSession, pageViewEvent;
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0:
							if (!(trackOn === "attribution" && isCampaignEvent(event))) return [3, 4];
							/* istanbul ignore next */ loggerProvider === null || loggerProvider === void 0 || loggerProvider.log("Enriching campaign event to page view event with campaign parameters");
							pageViewId = void 0;
							if (!sessionStorage) return [3, 2];
							return [4, sessionStorage.get(PAGE_VIEW_SESSION_STORAGE_KEY$1)];
						case 1:
							pageViewSession = _a.sent();
							pageViewId = pageViewSession === null || pageViewSession === void 0 ? void 0 : pageViewSession.pageViewId;
							_a.label = 2;
						case 2: return [4, createPageViewEvent(pageViewId)];
						case 3:
							pageViewEvent = _a.sent();
							event.event_type = pageViewEvent.event_type;
							event.event_properties = __assign$1(__assign$1({}, event.event_properties), pageViewEvent.event_properties);
							_a.label = 4;
						case 4:
							if (localConfig && event.event_type === eventType) {
								localConfig.pageCounter = !localConfig.pageCounter ? 1 : localConfig.pageCounter + 1;
								event.event_properties = __assign$1(__assign$1({}, event.event_properties), { "[Amplitude] Page Counter": localConfig.pageCounter });
							}
							return [2, event];
					}
				});
			});
		},
		teardown: function() {
			return __awaiter(void 0, void 0, void 0, function() {
				return __generator(this, function(_a) {
					if (globalScope) {
						globalScope.removeEventListener("popstate", handlePageChange);
						isTracking = false;
					}
					return [2];
				});
			});
		}
	};
};
var getCampaignParams = function() {
	return __awaiter(void 0, void 0, void 0, function() {
		var _a;
		return __generator(this, function(_b) {
			switch (_b.label) {
				case 0:
					_a = omitUndefined;
					return [4, new CampaignParser().parse()];
				case 1: return [2, _a.apply(void 0, [_b.sent()])];
			}
		});
	});
};
var isCampaignEvent = function(event) {
	if (event.event_type === "$identify" && event.user_properties) {
		var properties = event.user_properties;
		var $set = properties[IdentifyOperation.SET] || {};
		var $unset = properties[IdentifyOperation.UNSET] || {};
		var userProperties_1 = __spreadArray(__spreadArray([], __read$1(Object.keys($set)), false), __read$1(Object.keys($unset)), false);
		return Object.keys(BASE_CAMPAIGN).every(function(value) {
			return userProperties_1.includes(value);
		});
	}
	return false;
};
var shouldTrackHistoryPageView = function(trackingOption, newURLStr, oldURLStr) {
	switch (trackingOption) {
		case "pathOnly":
			if (oldURLStr == "") return true;
			var newURL = new URL(newURLStr);
			var oldURL = new URL(oldURLStr);
			return newURL.origin + newURL.pathname !== oldURL.origin + oldURL.pathname;
		default: return newURLStr !== oldURLStr;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/plugins/form-interaction-tracking.js
var formInteractionTracking = function() {
	var observer;
	var eventListeners = [];
	var addEventListener = function(element, type, handler) {
		element.addEventListener(type, handler);
		eventListeners.push({
			element,
			type,
			handler
		});
	};
	var removeClickListeners = function() {
		eventListeners.forEach(function(_a) {
			var element = _a.element, type = _a.type, handler = _a.handler;
			/* istanbul ignore next */
			element === null || element === void 0 || element.removeEventListener(type, handler);
		});
		eventListeners = [];
	};
	var formInteractionsConfig;
	var name = "@amplitude/plugin-form-interaction-tracking-browser";
	var type = "enrichment";
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			var initializeFormTracking, window_1;
			return __generator(this, function(_a) {
				formInteractionsConfig = getFormInteractionsConfig(config);
				initializeFormTracking = function() {
					/* istanbul ignore if */
					if (!amplitude) {
						config.loggerProvider.warn("Form interaction tracking requires a later version of @amplitude/analytics-browser. Form interaction events are not tracked.");
						return;
					}
					/* istanbul ignore if */
					if (typeof document === "undefined") return;
					var addedFormNodes = /* @__PURE__ */ new WeakSet();
					var addFormInteractionListener = function(form) {
						if (addedFormNodes.has(form)) return;
						addedFormNodes.add(form);
						var hasFormChanged = false;
						addEventListener(form, "change", function() {
							var _a;
							var formDestination = extractFormAction(form);
							if (!hasFormChanged) amplitude.track(DEFAULT_FORM_START_EVENT, (_a = {}, _a[FORM_ID] = stringOrUndefined(form.id), _a[FORM_NAME] = stringOrUndefined(form.name), _a[FORM_DESTINATION] = formDestination, _a));
							hasFormChanged = true;
						});
						addEventListener(form, "submit", function(event) {
							var _a, _b;
							var formDestination = extractFormAction(form);
							if (!hasFormChanged) amplitude.track(DEFAULT_FORM_START_EVENT, (_a = {}, _a[FORM_ID] = stringOrUndefined(form.id), _a[FORM_NAME] = stringOrUndefined(form.name), _a[FORM_DESTINATION] = formDestination, _a));
							hasFormChanged = true;
							if ((formInteractionsConfig === null || formInteractionsConfig === void 0 ? void 0 : formInteractionsConfig.shouldTrackSubmit) !== void 0) if (typeof formInteractionsConfig.shouldTrackSubmit === "function" && typeof SubmitEvent !== "undefined" && event instanceof SubmitEvent) try {
								if (!formInteractionsConfig.shouldTrackSubmit(event)) return;
							} catch (e) {
								config.loggerProvider.warn("shouldTrackSubmit callback threw an error, proceeding with tracking.");
							}
							else config.loggerProvider.warn("shouldTrackSubmit is ignored because it is not a function or event is not a SubmitEvent.");
							amplitude.track(DEFAULT_FORM_SUBMIT_EVENT, (_b = {}, _b[FORM_ID] = stringOrUndefined(form.id), _b[FORM_NAME] = stringOrUndefined(form.name), _b[FORM_DESTINATION] = formDestination, _b));
							hasFormChanged = false;
						});
					};
					Array.from(document.getElementsByTagName("form")).forEach(addFormInteractionListener);
					/* istanbul ignore else */
					if (typeof MutationObserver !== "undefined") {
						observer = new MutationObserver(function(mutations) {
							mutations.forEach(function(mutation) {
								mutation.addedNodes.forEach(function(node) {
									if (node.nodeName === "FORM") addFormInteractionListener(node);
									if ("querySelectorAll" in node && typeof node.querySelectorAll === "function") Array.from(node.querySelectorAll("form")).map(addFormInteractionListener);
								});
							});
						});
						observer.observe(document.body, {
							subtree: true,
							childList: true
						});
					}
				};
				if (document.readyState === "complete") initializeFormTracking();
				else {
					window_1 = getGlobalScope$1();
					/* istanbul ignore else*/
					if (window_1) window_1.addEventListener("load", initializeFormTracking);
					else config.loggerProvider.debug("Form interaction tracking is not installed because global is undefined.");
				}
				return [2];
			});
		});
	};
	var execute = function(event) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, event];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				observer === null || observer === void 0 || observer.disconnect();
				removeClickListeners();
				return [2];
			});
		});
	};
	return {
		name,
		type,
		setup,
		execute,
		teardown
	};
};
var stringOrUndefined = function(name) {
	/* istanbul ignore if */
	if (typeof name !== "string") return;
	return name;
};
var extractFormAction = function(form) {
	var formDestination = form.getAttribute("action");
	try {
		formDestination = new URL(encodeURI(formDestination !== null && formDestination !== void 0 ? formDestination : ""), window.location.href).href;
	} catch (_a) {}
	return formDestination;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/plugins/file-download-tracking.js
var fileDownloadTracking = function() {
	var observer;
	var eventListeners = [];
	var addEventListener = function(element, type, handler) {
		element.addEventListener(type, handler);
		eventListeners.push({
			element,
			type,
			handler
		});
	};
	var removeClickListeners = function() {
		eventListeners.forEach(function(_a) {
			var element = _a.element, type = _a.type, handler = _a.handler;
			/* istanbul ignore next */
			element === null || element === void 0 || element.removeEventListener(type, handler);
		});
		eventListeners = [];
	};
	var name = "@amplitude/plugin-file-download-tracking-browser";
	var type = "enrichment";
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			var initializeFileDownloadTracking, window_1;
			return __generator(this, function(_a) {
				initializeFileDownloadTracking = function() {
					/* istanbul ignore if */
					if (!amplitude) {
						config.loggerProvider.warn("File download tracking requires a later version of @amplitude/analytics-browser. File download events are not tracked.");
						return;
					}
					/* istanbul ignore if */
					if (typeof document === "undefined") return;
					var addFileDownloadListener = function(a) {
						var url;
						try {
							url = new URL(a.href, window.location.href);
						} catch (_a) {
							/* istanbul ignore next */
							return;
						}
						var result = ext.exec(url.href);
						var fileExtension = result === null || result === void 0 ? void 0 : result[1];
						if (fileExtension) addEventListener(a, "click", function() {
							var _a;
							if (fileExtension) amplitude.track(DEFAULT_FILE_DOWNLOAD_EVENT, (_a = {}, _a[FILE_EXTENSION] = fileExtension, _a[FILE_NAME] = url.pathname, _a[LINK_ID] = a.id, _a[LINK_TEXT] = a.text, _a[LINK_URL] = a.href, _a));
						});
					};
					var ext = /\.(pdf|xlsx?|docx?|txt|rtf|csv|exe|key|pp(s|t|tx)|7z|pkg|rar|gz|zip|avi|mov|mp4|mpe?g|wmv|midi?|mp3|wav|wma)(\?.+)?$/;
					Array.from(document.getElementsByTagName("a")).forEach(addFileDownloadListener);
					/* istanbul ignore else */
					if (typeof MutationObserver !== "undefined") {
						observer = new MutationObserver(function(mutations) {
							mutations.forEach(function(mutation) {
								mutation.addedNodes.forEach(function(node) {
									if (node.nodeName === "A") addFileDownloadListener(node);
									if ("querySelectorAll" in node && typeof node.querySelectorAll === "function") Array.from(node.querySelectorAll("a")).map(addFileDownloadListener);
								});
							});
						});
						observer.observe(document.body, {
							subtree: true,
							childList: true
						});
					}
				};
				/* istanbul ignore else*/
				if (document.readyState === "complete") initializeFileDownloadTracking();
				else {
					window_1 = getGlobalScope$1();
					/* istanbul ignore else*/
					if (window_1) window_1.addEventListener("load", initializeFileDownloadTracking);
					else config.loggerProvider.debug("File download tracking is not installed because global is undefined.");
				}
				return [2];
			});
		});
	};
	var execute = function(event) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, event];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				observer === null || observer === void 0 || observer.disconnect();
				removeClickListeners();
				return [2];
			});
		});
	};
	return {
		name,
		type,
		setup,
		execute,
		teardown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/det-notification.js
var notified = false;
var detNotify = function(config) {
	if (notified || config.defaultTracking !== void 0) return;
	config.loggerProvider.warn("`options.defaultTracking` is set to undefined. This implicitly configures your Amplitude instance to track Page Views, Sessions, File Downloads, and Form Interactions. You can suppress this warning by explicitly setting a value to `options.defaultTracking`. The value must either be a boolean, to enable and disable all default events, or an object, for advanced configuration. For example:\n\namplitude.init(<YOUR_API_KEY>, {\n  defaultTracking: true,\n});\n\nVisit https://www.docs.developers.amplitude.com/data/sdks/browser-2/#tracking-default-events for more details.");
	notified = true;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/plugins/network-connectivity-checker.js
var networkConnectivityCheckerPlugin = function() {
	var name = "@amplitude/plugin-network-checker-browser";
	var type = "before";
	var globalScope = getGlobalScope$1();
	var eventListeners = [];
	var addNetworkListener = function(type, handler) {
		/* istanbul ignore next */
		if (globalScope === null || globalScope === void 0 ? void 0 : globalScope.addEventListener) {
			globalScope === null || globalScope === void 0 || globalScope.addEventListener(type, handler);
			eventListeners.push({
				type,
				handler
			});
		}
	};
	var removeNetworkListeners = function() {
		eventListeners.forEach(function(_a) {
			var type = _a.type, handler = _a.handler;
			/* istanbul ignore next */
			globalScope === null || globalScope === void 0 || globalScope.removeEventListener(type, handler);
		});
		eventListeners = [];
	};
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				if (typeof navigator === "undefined") {
					config.loggerProvider.debug("Network connectivity checker plugin is disabled because navigator is not available.");
					config.offline = false;
					return [2];
				}
				config.offline = !navigator.onLine;
				addNetworkListener("online", function() {
					config.loggerProvider.debug("Network connectivity changed to online.");
					config.offline = false;
					setTimeout(function() {
						amplitude.flush();
					}, config.flushIntervalMillis);
				});
				addNetworkListener("offline", function() {
					config.loggerProvider.debug("Network connectivity changed to offline.");
					config.offline = true;
				});
				return [2];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				removeNetworkListeners();
				return [2];
			});
		});
	};
	return {
		name,
		type,
		setup,
		teardown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/config/joined-config.js
/**
* Performs a deep transformation of a remote config object so that
* it matches the expected schema of the local config.
*
* Specifically, it normalizes nested `enabled` flags into concise union types.
*
* ### Transformation Rules:
* - If an object has `enabled: true`, it is replaced by the same object without the `enabled` field.
* - If it has only `enabled: true`, it is replaced with `true`.
* - If it has `enabled: false`, it is replaced with `false` regardless of other fields.
*
* ### Examples:
* Input:  { prop: { enabled: true, hello: 'world' }}
* Output: { prop: { hello: 'world' } }
*
* Input:  { prop: { enabled: true }}
* Output: { prop: true }
*
* Input:  { prop: { enabled: false, hello: 'world' }}
* Output: { prop: false }
*
* Input:  { prop: { hello: 'world' }}
* Output: { prop: { hello: 'world' } } // No change
*
* @param config Remote config object to be transformed
* @returns Transformed config object compatible with local schema
*/
function translateRemoteConfigToLocal(config) {
	var e_1, _a, e_2, _b, e_3, _c;
	var _d, _e, _f, _g, _h, _j;
	if (typeof config !== "object" || config === null) return;
	if (Array.isArray(config)) return;
	var propertyNames = Object.keys(config);
	try {
		for (var propertyNames_1 = __values$1(propertyNames), propertyNames_1_1 = propertyNames_1.next(); !propertyNames_1_1.done; propertyNames_1_1 = propertyNames_1.next()) {
			var propertyName = propertyNames_1_1.value;
			try {
				var value = config[propertyName];
				if (typeof (value === null || value === void 0 ? void 0 : value.enabled) === "boolean") if (value.enabled) {
					delete value.enabled;
					if (Object.keys(value).length === 0) config[propertyName] = true;
				} else config[propertyName] = false;
				translateRemoteConfigToLocal(value);
			} catch (e) {}
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (propertyNames_1_1 && !propertyNames_1_1.done && (_a = propertyNames_1.return)) _a.call(propertyNames_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	try {
		if ((_f = (_e = (_d = config.autocapture) === null || _d === void 0 ? void 0 : _d.networkTracking) === null || _e === void 0 ? void 0 : _e.captureRules) === null || _f === void 0 ? void 0 : _f.length) try {
			for (var _k = __values$1(config.autocapture.networkTracking.captureRules), _l = _k.next(); !_l.done; _l = _k.next()) {
				var rule = _l.value;
				try {
					for (var _m = (e_3 = void 0, __values$1(["responseHeaders", "requestHeaders"])), _o = _m.next(); !_o.done; _o = _m.next()) {
						var header = _o.value;
						var _p = (_g = rule[header]) !== null && _g !== void 0 ? _g : {}, captureSafeHeaders = _p.captureSafeHeaders, allowlist = _p.allowlist;
						if (!captureSafeHeaders && !allowlist) continue;
						if (allowlist !== void 0 && !Array.isArray(allowlist)) {
							delete rule[header];
							continue;
						}
						rule[header] = __spreadArray(__spreadArray([], __read$1(captureSafeHeaders ? SAFE_HEADERS$1 : []), false), __read$1(allowlist !== null && allowlist !== void 0 ? allowlist : []), false);
					}
				} catch (e_3_1) {
					e_3 = { error: e_3_1 };
				} finally {
					try {
						if (_o && !_o.done && (_c = _m.return)) _c.call(_m);
					} finally {
						if (e_3) throw e_3.error;
					}
				}
			}
		} catch (e_2_1) {
			e_2 = { error: e_2_1 };
		} finally {
			try {
				if (_l && !_l.done && (_b = _k.return)) _b.call(_k);
			} finally {
				if (e_2) throw e_2.error;
			}
		}
	} catch (e) {}
	var frustrationInteractions = (_h = config.autocapture) === null || _h === void 0 ? void 0 : _h.frustrationInteractions;
	if (frustrationInteractions) {
		if (frustrationInteractions.rageClick) {
			frustrationInteractions.rageClicks = frustrationInteractions.rageClick;
			delete frustrationInteractions.rageClick;
		}
		if (frustrationInteractions.deadClick) {
			frustrationInteractions.deadClicks = frustrationInteractions.deadClick;
			delete frustrationInteractions.deadClick;
		}
	}
	try {
		var elementInteractions = (_j = config.autocapture) === null || _j === void 0 ? void 0 : _j.elementInteractions;
		if (elementInteractions && typeof elementInteractions === "object") {
			if (elementInteractions.viewportContentUpdated === true) elementInteractions.viewportContentUpdated = {};
			if (elementInteractions.viewportContentUpdated === false) elementInteractions.viewportContentUpdated = { enabled: false };
			if (elementInteractions.exposureDuration !== void 0) {
				var viewportContentUpdated = elementInteractions.viewportContentUpdated;
				if (viewportContentUpdated === void 0) elementInteractions.viewportContentUpdated = { exposureDuration: elementInteractions.exposureDuration };
				else if (typeof viewportContentUpdated === "object" && viewportContentUpdated.exposureDuration === void 0 && viewportContentUpdated.enabled !== false) viewportContentUpdated.exposureDuration = elementInteractions.exposureDuration;
				delete elementInteractions.exposureDuration;
			}
		}
	} catch (e) {}
}
function mergeUrls(urlsExact, urlsRegex, browserConfig) {
	var e_4, _a;
	var regexList = [];
	try {
		for (var _b = __values$1(urlsRegex !== null && urlsRegex !== void 0 ? urlsRegex : []), _c = _b.next(); !_c.done; _c = _b.next()) {
			var pattern = _c.value;
			try {
				regexList.push(new RegExp(pattern));
			} catch (regexError) {
				browserConfig.loggerProvider.warn("Invalid regex pattern: ".concat(pattern), regexError);
			}
		}
	} catch (e_4_1) {
		e_4 = { error: e_4_1 };
	} finally {
		try {
			if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
		} finally {
			if (e_4) throw e_4.error;
		}
	}
	return urlsExact.concat(regexList);
}
/**
* Updates the browser config in place by applying remote configuration settings.
* Primarily merges autocapture settings from the remote config into the browser config.
*
* @param remoteConfig - The remote configuration to apply, or null if none available
* @param browserConfig - The browser config object to update (modified in place)
*/
function updateBrowserConfigWithRemoteConfig(remoteConfig, browserConfig) {
	var e_5, _a;
	var _b, _c, _d, _e, _f;
	if (!remoteConfig) return;
	translateRemoteConfigToLocal(remoteConfig);
	try {
		browserConfig.loggerProvider.debug("Update browser config with remote configuration:", JSON.stringify(remoteConfig));
		var typedRemoteConfig = remoteConfig;
		if (typedRemoteConfig && "autocapture" in typedRemoteConfig) {
			if (typeof typedRemoteConfig.autocapture === "boolean") browserConfig.autocapture = typedRemoteConfig.autocapture;
			if (typeof typedRemoteConfig.autocapture === "object" && typedRemoteConfig.autocapture !== null) {
				var transformedAutocaptureRemoteConfig = __assign$1({}, typedRemoteConfig.autocapture);
				if (browserConfig.autocapture === void 0) browserConfig.autocapture = typedRemoteConfig.autocapture;
				if (typeof typedRemoteConfig.autocapture.elementInteractions === "object" && typedRemoteConfig.autocapture.elementInteractions !== null && ((_b = typedRemoteConfig.autocapture.elementInteractions.pageUrlAllowlistRegex) === null || _b === void 0 ? void 0 : _b.length)) {
					transformedAutocaptureRemoteConfig.elementInteractions = __assign$1({}, typedRemoteConfig.autocapture.elementInteractions);
					var transformedRcElementInteractions = transformedAutocaptureRemoteConfig.elementInteractions;
					var exactAllowList = (_c = transformedRcElementInteractions.pageUrlAllowlist) !== null && _c !== void 0 ? _c : [];
					var urlsRegex = typedRemoteConfig.autocapture.elementInteractions.pageUrlAllowlistRegex;
					transformedRcElementInteractions.pageUrlAllowlist = mergeUrls(exactAllowList, urlsRegex, browserConfig);
					delete transformedRcElementInteractions.pageUrlAllowlistRegex;
				}
				if (typeof typedRemoteConfig.autocapture.networkTracking === "object" && typedRemoteConfig.autocapture.networkTracking !== null && ((_d = typedRemoteConfig.autocapture.networkTracking.captureRules) === null || _d === void 0 ? void 0 : _d.length)) {
					transformedAutocaptureRemoteConfig.networkTracking = __assign$1({}, typedRemoteConfig.autocapture.networkTracking);
					/* istanbul ignore next */
					var captureRules = (_e = transformedAutocaptureRemoteConfig.networkTracking.captureRules) !== null && _e !== void 0 ? _e : [];
					try {
						for (var captureRules_1 = __values$1(captureRules), captureRules_1_1 = captureRules_1.next(); !captureRules_1_1.done; captureRules_1_1 = captureRules_1.next()) {
							var rule = captureRules_1_1.value;
							rule.urls = mergeUrls((_f = rule.urls) !== null && _f !== void 0 ? _f : [], rule.urlsRegex, browserConfig);
							delete rule.urlsRegex;
						}
					} catch (e_5_1) {
						e_5 = { error: e_5_1 };
					} finally {
						try {
							if (captureRules_1_1 && !captureRules_1_1.done && (_a = captureRules_1.return)) _a.call(captureRules_1);
						} finally {
							if (e_5) throw e_5.error;
						}
					}
				}
				if (typeof browserConfig.autocapture === "boolean") browserConfig.autocapture = __assign$1({
					attribution: browserConfig.autocapture,
					fileDownloads: browserConfig.autocapture,
					formInteractions: browserConfig.autocapture,
					pageViews: browserConfig.autocapture,
					sessions: browserConfig.autocapture,
					elementInteractions: browserConfig.autocapture,
					webVitals: browserConfig.autocapture,
					frustrationInteractions: browserConfig.autocapture
				}, transformedAutocaptureRemoteConfig);
				if (typeof browserConfig.autocapture === "object") browserConfig.autocapture = __assign$1(__assign$1({}, browserConfig.autocapture), transformedAutocaptureRemoteConfig);
			}
			browserConfig.defaultTracking = browserConfig.autocapture;
		}
		if ("customEnrichment" in typedRemoteConfig && typedRemoteConfig.customEnrichment !== null) {
			if (browserConfig.customEnrichment !== false) browserConfig.customEnrichment = typedRemoteConfig.customEnrichment;
		}
		browserConfig.loggerProvider.debug("Browser config after remote config update:", JSON.stringify(browserConfig));
	} catch (e) {
		browserConfig.loggerProvider.error("Failed to apply remote configuration because of error: ", e);
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/version.js
var VERSION = "1.27.1";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/constants.js
var PLUGIN_NAME$2 = "@amplitude/plugin-autocapture-browser";
var FRUSTRATION_PLUGIN_NAME = "@amplitude/plugin-frustration-browser";
var PERFORMANCE_PLUGIN_NAME = "@amplitude/plugin-performance-browser";
var AMPLITUDE_ELEMENT_DEAD_CLICKED_EVENT = "[Amplitude] Dead Click";
var AMPLITUDE_ELEMENT_RAGE_CLICKED_EVENT = "[Amplitude] Rage Click";
var AMPLITUDE_ELEMENT_ERROR_CLICKED_EVENT = "[Amplitude] Error Click";
var AMPLITUDE_THRASHED_CURSOR_EVENT = "[Amplitude] Thrashed Cursor";
var AMPLITUDE_MAIN_THREAD_BLOCK_EVENT = "[Amplitude] Main Thread Block";
var AMPLITUDE_EVENT_PROP_ELEMENT_ID = "[Amplitude] Element ID";
var AMPLITUDE_EVENT_PROP_ELEMENT_CLASS = "[Amplitude] Element Class";
var AMPLITUDE_EVENT_PROP_ELEMENT_TAG = "[Amplitude] Element Tag";
var AMPLITUDE_EVENT_PROP_ELEMENT_TEXT = "[Amplitude] Element Text";
var AMPLITUDE_EVENT_PROP_ELEMENT_HIERARCHY = "[Amplitude] Element Hierarchy";
var AMPLITUDE_EVENT_PROP_ELEMENT_HREF = "[Amplitude] Element Href";
var AMPLITUDE_EVENT_PROP_ELEMENT_POSITION_LEFT = "[Amplitude] Element Position Left";
var AMPLITUDE_EVENT_PROP_ELEMENT_POSITION_TOP = "[Amplitude] Element Position Top";
var AMPLITUDE_EVENT_PROP_ELEMENT_ARIA_LABEL = "[Amplitude] Element Aria Label";
var AMPLITUDE_EVENT_PROP_ELEMENT_ATTRIBUTES = "[Amplitude] Element Attributes";
var AMPLITUDE_EVENT_PROP_ELEMENT_PATH = "[Amplitude] Element Path";
var AMPLITUDE_EVENT_PROP_ELEMENT_PARENT_LABEL = "[Amplitude] Element Parent Label";
var AMPLITUDE_EVENT_PROP_PAGE_URL = "[Amplitude] Page URL";
var AMPLITUDE_EVENT_PROP_PAGE_TITLE = "[Amplitude] Page Title";
var AMPLITUDE_EVENT_PROP_VIEWPORT_HEIGHT = "[Amplitude] Viewport Height";
var AMPLITUDE_EVENT_PROP_VIEWPORT_WIDTH = "[Amplitude] Viewport Width";
var AMPLITUDE_EVENT_PROP_MAX_PAGE_X = "[Amplitude] Max Page X";
var AMPLITUDE_EVENT_PROP_MAX_PAGE_Y = "[Amplitude] Max Page Y";
var AMPLITUDE_EVENT_PROP_PAGE_VIEW_ID = "[Amplitude] Page View ID";
var AMPLITUDE_VISUAL_TAGGING_SELECTOR_SCRIPT_URL = "https://cdn.amplitude.com/libs/visual-tagging-selector-1.0.0-alpha.js.gz";
var AMPLITUDE_VISUAL_TAGGING_HIGHLIGHT_CLASS = "amp-visual-tagging-selector-highlight";
var DATA_AMP_MASK_ATTRIBUTES = "data-amp-mask-attributes";
var PAGE_VIEW_SESSION_STORAGE_KEY = "AMP_PAGE_VIEW";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/helpers.js
var SENSITIVE_TAGS = [
	"input",
	"select",
	"textarea"
];
var isElementPointerCursor = function(element, actionType) {
	var _a;
	/* istanbul ignore next */
	var computedStyle = (_a = window === null || window === void 0 ? void 0 : window.getComputedStyle) === null || _a === void 0 ? void 0 : _a.call(window, element);
	/* istanbul ignore next */
	return (computedStyle === null || computedStyle === void 0 ? void 0 : computedStyle.getPropertyValue("cursor")) === "pointer" && actionType === "click";
};
var isUrlAllowed = function(autocaptureOptions) {
	var pageUrlAllowlist = autocaptureOptions.pageUrlAllowlist, pageUrlExcludelist = autocaptureOptions.pageUrlExcludelist;
	if (pageUrlExcludelist && pageUrlExcludelist.length > 0 && isUrlMatchAllowlist$1(window.location.href, pageUrlExcludelist)) return false;
	if (!isUrlMatchAllowlist$1(window.location.href, pageUrlAllowlist)) return false;
	return true;
};
var createShouldTrackEvent = function(autocaptureOptions, allowlist, isAlwaysCaptureCursorPointer) {
	if (isAlwaysCaptureCursorPointer === void 0) isAlwaysCaptureCursorPointer = false;
	return function(actionType, element) {
		var _a, _b;
		var shouldTrackEventResolver = autocaptureOptions.shouldTrackEventResolver;
		/* istanbul ignore next */
		var tag = (_b = (_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a);
		if (!tag) return false;
		if (shouldTrackEventResolver) return shouldTrackEventResolver(actionType, element);
		if (!isUrlAllowed(autocaptureOptions)) return false;
		/* istanbul ignore next */
		var elementType = String(element === null || element === void 0 ? void 0 : element.getAttribute("type")) || "";
		if (typeof elementType === "string") switch (elementType.toLowerCase()) {
			case "hidden": return false;
			case "password": return false;
		}
		var isCursorPointer = isElementPointerCursor(element, actionType);
		if (isAlwaysCaptureCursorPointer && isCursorPointer) return true;
		/* istanbul ignore if */
		if (allowlist) {
			if (!allowlist.some(function(selector) {
				var _a;
				return !!((_a = element === null || element === void 0 ? void 0 : element.matches) === null || _a === void 0 ? void 0 : _a.call(element, selector));
			})) return false;
		}
		switch (tag) {
			case "input":
			case "select":
			case "textarea": return actionType === "change" || actionType === "click";
			default:
				/* istanbul ignore next */
				/* istanbul ignore next */
				if (isCursorPointer) return true;
				return actionType === "click";
		}
	};
};
var isNonSensitiveElement = function(element) {
	var _a, _b, _c;
	/* istanbul ignore next */
	var tag = (_b = (_a = element === null || element === void 0 ? void 0 : element.tagName) === null || _a === void 0 ? void 0 : _a.toLowerCase) === null || _b === void 0 ? void 0 : _b.call(_a);
	var isContentEditable = element instanceof HTMLElement ? ((_c = element.getAttribute("contenteditable")) === null || _c === void 0 ? void 0 : _c.toLowerCase()) === "true" : false;
	return !SENSITIVE_TAGS.includes(tag) && !isContentEditable;
};
/**
* Collects redacted attribute names from element and ancestor elements with data-amp-mask-attributes
* The 'id' and 'class' attributes cannot be redacted as they're critical for element identification
* @param element - The target element to check for redaction attributes
* @returns Set of attribute names that should be redacted
*/
/**
* Parses a comma-separated string of attribute names and filters out protected attributes
* @param attributeString - Comma-separated string of attribute names
* @returns Array of valid attribute names, excluding 'id' and 'class'
*/
var parseAttributesToMask = function(attributeString) {
	return attributeString ? attributeString.split(",").map(function(attr) {
		return attr.trim();
	}).filter(function(attr) {
		return attr.length > 0 && attr !== "id" && attr !== "class";
	}) : [];
};
var extractPrefixedAttributes = function(attrs, prefix) {
	return Object.entries(attrs).reduce(function(attributes, _a) {
		var _b = __read$1(_a, 2), attributeName = _b[0], attributeValue = _b[1];
		if (attributeName.startsWith(prefix)) {
			var attributeKey = attributeName.replace(prefix, "");
			if (attributeKey) attributes[attributeKey] = attributeValue || "";
		}
		return attributes;
	}, {});
};
var isEmpty = function(value) {
	return value === void 0 || value === null || typeof value === "object" && Object.keys(value).length === 0 || typeof value === "string" && value.trim().length === 0;
};
var removeEmptyProperties = function(properties) {
	return Object.keys(properties).reduce(function(filteredProperties, key) {
		var value = properties[key];
		if (!isEmpty(value)) filteredProperties[key] = value;
		return filteredProperties;
	}, {});
};
var getCurrentPageViewId = function() {
	var _a;
	try {
		var globalScope = getGlobalScope$1();
		/* istanbul ignore next */
		var raw = (_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.sessionStorage) === null || _a === void 0 ? void 0 : _a.getItem(PAGE_VIEW_SESSION_STORAGE_KEY);
		if (!raw) return;
		var parsed = JSON.parse(raw);
		if (typeof parsed.pageViewId === "string") return parsed.pageViewId;
	} catch (_b) {}
};
var getClosestElement = function(element, selectors) {
	if (!element) return null;
	/* istanbul ignore next */
	if (selectors.some(function(selector) {
		var _a;
		return (_a = element === null || element === void 0 ? void 0 : element.matches) === null || _a === void 0 ? void 0 : _a.call(element, selector);
	})) return element;
	/* istanbul ignore next */
	return getClosestElement(element === null || element === void 0 ? void 0 : element.parentElement, selectors);
};
var filterOutNonTrackableEvents = function(event) {
	if (event.event.target === null || !event.closestTrackedAncestor) return false;
	return true;
};
function isElementBasedEvent(event) {
	return event.type === "click" || event.type === "change";
}
var MouseButton;
(function(MouseButton) {
	MouseButton[MouseButton["LEFT_OR_TOUCH_CONTACT"] = 0] = "LEFT_OR_TOUCH_CONTACT";
	MouseButton[MouseButton["MIDDLE"] = 1] = "MIDDLE";
	MouseButton[MouseButton["RIGHT"] = 2] = "RIGHT";
})(MouseButton || (MouseButton = {}));
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/libs/messenger.js
/* istanbul ignore file */
/**
* Brand key to track whether visual tagging has been enabled on a messenger.
*/
var VISUAL_TAGGING_BRAND = "__AMPLITUDE_VISUAL_TAGGING__";
/**
* Enable visual tagging on a messenger instance.
* The first call registers the handlers; subsequent calls are no-ops.
*
* @param messenger - The messenger to enable visual tagging on
* @param options - Visual tagging configuration
*/
function enableVisualTagging(messenger, options) {
	var branded = messenger;
	if (branded[VISUAL_TAGGING_BRAND] === true) return;
	branded[VISUAL_TAGGING_BRAND] = true;
	var dataExtractor = options.dataExtractor, isElementSelectable = options.isElementSelectable, cssSelectorAllowlist = options.cssSelectorAllowlist, actionClickAllowlist = options.actionClickAllowlist;
	var amplitudeVisualTaggingSelectorInstance = null;
	var onSelect = function(data) {
		messenger.notify({
			action: "element-selected",
			data
		});
	};
	var onTrack = function(type, properties) {
		if (type === "selector-mode-changed") messenger.notify({
			action: "track-selector-mode-changed",
			data: properties
		});
		else if (type === "selector-moved") messenger.notify({
			action: "track-selector-moved",
			data: properties
		});
	};
	messenger.registerActionHandler("initialize-visual-tagging-selector", function(actionData) {
		messenger.loadScriptOnce(AMPLITUDE_VISUAL_TAGGING_SELECTOR_SCRIPT_URL).then(function() {
			var _a;
			amplitudeVisualTaggingSelectorInstance = (_a = window === null || window === void 0 ? void 0 : window.amplitudeVisualTaggingSelector) === null || _a === void 0 ? void 0 : _a.call(window, {
				getEventTagProps: dataExtractor.getEventTagProps,
				isElementSelectable: function(element) {
					if (isElementSelectable) return isElementSelectable((actionData === null || actionData === void 0 ? void 0 : actionData.actionType) || "click", element);
					return true;
				},
				onTrack,
				onSelect,
				visualHighlightClass: AMPLITUDE_VISUAL_TAGGING_HIGHLIGHT_CLASS,
				messenger,
				cssSelectorAllowlist,
				actionClickAllowlist,
				extractDataFromDataSource: dataExtractor.extractDataFromDataSource,
				dataExtractor,
				diagnostics: { autocapture: { version: VERSION } }
			});
			messenger.notify({ action: "selector-loaded" });
		}).catch(function() {
			var _a;
			(_a = messenger.logger) === null || _a === void 0 || _a.warn("Failed to initialize visual tagging selector");
		});
	});
	messenger.registerActionHandler("close-visual-tagging-selector", function() {
		var _a;
		(_a = amplitudeVisualTaggingSelectorInstance === null || amplitudeVisualTaggingSelectorInstance === void 0 ? void 0 : amplitudeVisualTaggingSelectorInstance.close) === null || _a === void 0 || _a.call(amplitudeVisualTaggingSelectorInstance);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-click.js
function trackClicks(_a) {
	var amplitude = _a.amplitude, allObservables = _a.allObservables, shouldTrackEvent = _a.shouldTrackEvent, evaluateTriggers = _a.evaluateTriggers;
	return allObservables.clickObservable.filter(filterOutNonTrackableEvents).filter(function(click) {
		return shouldTrackEvent("click", click.closestTrackedAncestor);
	}).map(function(click) {
		return evaluateTriggers(click);
	}).subscribe(function(click) {
		/* istanbul ignore next */
		amplitude === null || amplitude === void 0 || amplitude.track("[Amplitude] Element Clicked", click.targetElementProperties);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-change.js
function trackChange(_a) {
	var amplitude = _a.amplitude, allObservables = _a.allObservables, getEventProperties = _a.getEventProperties, shouldTrackEvent = _a.shouldTrackEvent, evaluateTriggers = _a.evaluateTriggers;
	return allObservables.changeObservable.filter(filterOutNonTrackableEvents).filter(function(changeEvent) {
		return shouldTrackEvent("change", changeEvent.closestTrackedAncestor);
	}).map(function(changeEvent) {
		return evaluateTriggers(changeEvent);
	}).subscribe(function(changeEvent) {
		/* istanbul ignore next */
		amplitude === null || amplitude === void 0 || amplitude.track("[Amplitude] Element Changed", getEventProperties("change", changeEvent.closestTrackedAncestor));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-action-click.js
function trackActionClick(_a) {
	var amplitude = _a.amplitude, allObservables = _a.allObservables, options = _a.options, getEventProperties = _a.getEventProperties, shouldTrackEvent = _a.shouldTrackEvent, shouldTrackActionClick = _a.shouldTrackActionClick;
	var clickObservable = allObservables.clickObservable, mutationObservable = allObservables.mutationObservable, navigateObservable = allObservables.navigateObservable;
	var clickMutationNavigateObservable = merge(clickObservable.filter(function(click) {
		return !shouldTrackEvent("click", click.closestTrackedAncestor);
	}).map(function(click) {
		click.closestTrackedAncestor = getClosestElement(click.event.target, options.actionClickAllowlist);
		if (click.closestTrackedAncestor !== null) click.targetElementProperties = getEventProperties(click.type, click.closestTrackedAncestor);
		return click;
	}).filter(filterOutNonTrackableEvents).filter(function(clickEvent) {
		return shouldTrackActionClick("click", clickEvent.closestTrackedAncestor);
	}), navigateObservable ? merge(mutationObservable, navigateObservable) : mutationObservable);
	var actionClickTimer = null;
	var lastClickEvent = null;
	return asyncMap(clickMutationNavigateObservable, function(event) {
		if (actionClickTimer) {
			clearTimeout(actionClickTimer);
			actionClickTimer = null;
		}
		if (event.type === "click") {
			lastClickEvent = event;
			actionClickTimer = setTimeout(function() {
				actionClickTimer = null;
				lastClickEvent = null;
			}, 500);
			return Promise.resolve(null);
		} else if (lastClickEvent) {
			var event_1 = lastClickEvent;
			lastClickEvent = null;
			return Promise.resolve(event_1);
		}
		return Promise.resolve(null);
	}).subscribe(function(actionClick) {
		if (!actionClick) return;
		/* istanbul ignore next */
		amplitude === null || amplitude === void 0 || amplitude.track("[Amplitude] Element Clicked", getEventProperties("click", actionClick.closestTrackedAncestor));
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-scroll.js
function trackScroll(_a) {
	_a.amplitude;
	var scrollObservable = _a.allObservables.scrollObservable;
	var state = {
		maxX: 0,
		maxY: 0
	};
	var scrollSubscription = scrollObservable.subscribe(function() {
		var _a, _b, _c, _d;
		var globalScope = getGlobalScope$1();
		/* istanbul ignore next */
		var currentX = Math.floor((_b = (_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.scrollX) !== null && _a !== void 0 ? _a : globalScope === null || globalScope === void 0 ? void 0 : globalScope.pageXOffset) !== null && _b !== void 0 ? _b : 0);
		/* istanbul ignore next */
		var currentY = Math.floor((_d = (_c = globalScope === null || globalScope === void 0 ? void 0 : globalScope.scrollY) !== null && _c !== void 0 ? _c : globalScope === null || globalScope === void 0 ? void 0 : globalScope.pageYOffset) !== null && _d !== void 0 ? _d : 0);
		state.maxX = Math.max(state.maxX, currentX);
		state.maxY = Math.max(state.maxY, currentY);
	});
	return {
		unsubscribe: function() {
			scrollSubscription.unsubscribe();
		},
		getState: function() {
			return state;
		},
		reset: function() {
			state.maxX = 0;
			state.maxY = 0;
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/observables.js
var globalScope = getGlobalScope$1();
var createMutationObservable = function() {
	return new import_zen_observable.default(function(observer) {
		var mutationObserver = new MutationObserver(function(mutations) {
			observer.next(mutations);
		});
		if (document.body) mutationObserver.observe(document.body, {
			childList: true,
			attributes: true,
			characterData: true,
			subtree: true
		});
		return function() {
			return mutationObserver.disconnect();
		};
	});
};
/**
* Creates an observable that tracks click events on the document.
* @param clickType - The type of click event to track (click or pointerdown)
*/
var createClickObservable = function(clickType) {
	if (clickType === void 0) clickType = "click";
	return new import_zen_observable.default(function(observer) {
		var _a;
		var handler = function(event) {
			observer.next(event);
		};
		(_a = getGlobalScope$1()) === null || _a === void 0 || _a.document.addEventListener(clickType, handler, { capture: true });
		return function() {
			var _a;
			(_a = getGlobalScope$1()) === null || _a === void 0 || _a.document.removeEventListener(clickType, handler, { capture: true });
		};
	});
};
var createScrollObservable = function() {
	return new import_zen_observable.default(function(observer) {
		var _a;
		var handler = function(event) {
			observer.next(event);
		};
		(_a = getGlobalScope$1()) === null || _a === void 0 || _a.addEventListener("scroll", handler);
		return function() {
			var _a;
			(_a = getGlobalScope$1()) === null || _a === void 0 || _a.removeEventListener("scroll", handler);
		};
	});
};
var createConsoleErrorObservable = function() {
	return new import_zen_observable.default(function(observer) {
		var handler = function(_) {
			var args = [];
			for (var _i = 1; _i < arguments.length; _i++) args[_i - 1] = arguments[_i];
			/* istanbul ignore next */
			var message = void 0;
			if (Array.isArray(args[0]) && typeof args[0][0] === "string") message = args[0][0];
			observer.next({
				kind: "console",
				message
			});
		};
		consoleObserver.addListener("error", handler);
		return function() {
			consoleObserver.removeListener(handler);
		};
	});
};
var createExposureObservable = function(mutationObservable, selectorAllowlist) {
	return new import_zen_observable.default(function(observer) {
		var _a;
		var globalScope = getGlobalScope$1();
		if (!(globalScope === null || globalScope === void 0 ? void 0 : globalScope.IntersectionObserver)) return function() {};
		var intersectionObserver = new IntersectionObserver(function(entries) {
			entries.forEach(function(entry) {
				observer.next(entry);
			});
		}, {
			root: null,
			rootMargin: "0px",
			threshold: 1
		});
		var selectorString = selectorAllowlist.join(",");
		((_a = globalScope === null || globalScope === void 0 ? void 0 : globalScope.document.querySelectorAll(selectorString)) !== null && _a !== void 0 ? _a : []).forEach(function(element) {
			intersectionObserver.observe(element);
		});
		var mutationSubscription = mutationObservable.subscribe(function(_a) {
			return _a.event.forEach(function(_a) {
				return _a.addedNodes.forEach(function(node) {
					if (!(node instanceof Element)) return;
					if (node.matches(selectorString)) intersectionObserver.observe(node);
					node.querySelectorAll(selectorString).forEach(function(child) {
						intersectionObserver.observe(child);
					});
				});
			});
		});
		return function() {
			mutationSubscription.unsubscribe();
			intersectionObserver.disconnect();
		};
	});
};
var createUnhandledErrorObservable = function() {
	return new import_zen_observable.default(function(observer) {
		var handler = function(event) {
			if (!(event instanceof ErrorEvent)) return;
			var output = { kind: "error" };
			if (event.error instanceof Error || event.error instanceof DOMException) output = __assign$1(__assign$1({}, output), {
				message: event.error.message,
				stack: event.error.stack,
				filename: event.filename,
				lineNumber: event.lineno,
				columnNumber: event.colno
			});
			else if (typeof event.error === "string") output.message = event.error;
			observer.next(output);
		};
		globalScope.addEventListener("error", handler);
		return function() {
			globalScope.removeEventListener("error", handler);
		};
	});
};
var createUnhandledRejectionObservable = function() {
	return new import_zen_observable.default(function(observer) {
		var handler = function(event) {
			var output = { kind: "unhandledrejection" };
			if (event.reason instanceof Error || event.reason instanceof DOMException) {
				output.message = event.reason.message;
				output.stack = event.reason.stack;
			} else if (typeof event.reason === "string") output.message = event.reason;
			observer.next(output);
		};
		globalScope.addEventListener("unhandledrejection", handler);
		return function() {
			globalScope.removeEventListener("unhandledrejection", handler);
		};
	});
};
var createErrorObservable = function() {
	return merge(merge(createUnhandledErrorObservable(), createUnhandledRejectionObservable()), createConsoleErrorObservable());
};
var createMouseMoveObservable = function() {
	return new import_zen_observable.default(function(observer) {
		var handler = function(event) {
			observer.next(event);
		};
		var args = { capture: true };
		globalScope.document.addEventListener("mousemove", handler, args);
		return function() {
			globalScope.document.removeEventListener("mousemove", handler, args);
		};
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/pageActions/matchEventToFilter.js
/**
* Matches an event to a single filter
* @param event - The event to match
* @param filter - The filter to match against
* @returns boolean indicating if the event matches the filter
*/
var matchEventToFilter = function(event, filter) {
	try {
		if (filter.subprop_key === "[Amplitude] Element Text") return filter.subprop_op === "is" && filter.subprop_value.includes(event.targetElementProperties["[Amplitude] Element Text"]);
		else if (filter.subprop_key === "[Amplitude] Element Hierarchy") return filter.subprop_op === "autotrack css match" && !!event.closestTrackedAncestor.closest(filter.subprop_value.toString());
	} catch (error) {
		console.error("Error matching event to filter", error);
		return false;
	}
	return false;
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/pageActions/actions.js
/**
* Gets the DOM element specified by the data source configuration
* @param dataSource - Configuration for finding the target element
* @param contextElement - The element to start searching from
* @returns The matching DOM element or undefined if not found
*/
var getDataSource = function(dataSource, contextElement) {
	try {
		if (dataSource.sourceType === "DOM_ELEMENT") {
			var scopingElement = document.documentElement;
			if (dataSource.scope && contextElement) scopingElement = contextElement.closest(dataSource.scope);
			if (scopingElement && dataSource.selector) return scopingElement.querySelector(dataSource.selector);
			return scopingElement;
		}
	} catch (error) {
		return;
	}
};
var executeActions = function(actions, ev, dataExtractor) {
	actions.forEach(function(action) {
		if (typeof action === "string") return;
		if (action.actionType === "ATTACH_EVENT_PROPERTY") {
			var data = dataExtractor.extractDataFromDataSource(action.dataSource, ev.closestTrackedAncestor);
			ev.targetElementProperties[action.destinationKey] = data;
		}
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/pageActions/triggers.js
var eventTypeToBrowserEventMap = {
	"[Amplitude] Element Clicked": "click",
	"[Amplitude] Element Changed": "change"
};
var groupLabeledEventIdsByEventType = function(labeledEvents) {
	var e_1, _a, e_2, _b;
	var groupedLabeledEvents = Object.values(eventTypeToBrowserEventMap).reduce(function(acc, browserEvent) {
		acc[browserEvent] = /* @__PURE__ */ new Set();
		return acc;
	}, {});
	if (!labeledEvents) return groupedLabeledEvents;
	try {
		for (var labeledEvents_1 = __values$1(labeledEvents), labeledEvents_1_1 = labeledEvents_1.next(); !labeledEvents_1_1.done; labeledEvents_1_1 = labeledEvents_1.next()) {
			var le = labeledEvents_1_1.value;
			try {
				try {
					for (var _c = (e_2 = void 0, __values$1(le.definition)), _d = _c.next(); !_d.done; _d = _c.next()) {
						var browserEvent = eventTypeToBrowserEventMap[_d.value.event_type];
						if (browserEvent) groupedLabeledEvents[browserEvent].add(le.id);
					}
				} catch (e_2_1) {
					e_2 = { error: e_2_1 };
				} finally {
					try {
						if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
					} finally {
						if (e_2) throw e_2.error;
					}
				}
			} catch (e) {
				console.warn("Skipping Labeled Event due to malformed definition", le === null || le === void 0 ? void 0 : le.id, e);
			}
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (labeledEvents_1_1 && !labeledEvents_1_1.done && (_a = labeledEvents_1.return)) _a.call(labeledEvents_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	return groupedLabeledEvents;
};
var createLabeledEventToTriggerMap = function(triggers) {
	var e_3, _a, e_4, _b;
	var labeledEventToTriggerMap = /* @__PURE__ */ new Map();
	try {
		for (var triggers_1 = __values$1(triggers), triggers_1_1 = triggers_1.next(); !triggers_1_1.done; triggers_1_1 = triggers_1.next()) {
			var trigger = triggers_1_1.value;
			try {
				for (var _c = (e_4 = void 0, __values$1(trigger.conditions)), _d = _c.next(); !_d.done; _d = _c.next()) {
					var condition = _d.value;
					if (condition.type === "LABELED_EVENT") {
						var eventId = condition.match.eventId;
						var existingTriggers = labeledEventToTriggerMap.get(eventId);
						if (!existingTriggers) {
							existingTriggers = [];
							labeledEventToTriggerMap.set(eventId, existingTriggers);
						}
						existingTriggers.push(trigger);
					}
				}
			} catch (e_4_1) {
				e_4 = { error: e_4_1 };
			} finally {
				try {
					if (_d && !_d.done && (_b = _c.return)) _b.call(_c);
				} finally {
					if (e_4) throw e_4.error;
				}
			}
		}
	} catch (e_3_1) {
		e_3 = { error: e_3_1 };
	} finally {
		try {
			if (triggers_1_1 && !triggers_1_1.done && (_a = triggers_1.return)) _a.call(triggers_1);
		} finally {
			if (e_3) throw e_3.error;
		}
	}
	return labeledEventToTriggerMap;
};
/**
* Matches an event to labeled events based on the event's properties.
* The logic matches exactly what is supported by the query backend.
* TODO: later pre-filter the labeled events based on URL first
*
* @param event - The event to match against labeled events
* @param labeledEvents - Array of labeled events to match against
* @returns Array of matching labeled events
*/
var matchEventToLabeledEvents = function(event, labeledEvents) {
	return labeledEvents.filter(function(le) {
		return le.definition.some(function(def) {
			return eventTypeToBrowserEventMap[def.event_type] === event.type && def.filters.every(function(filter) {
				return matchEventToFilter(event, filter);
			});
		});
	});
};
var matchLabeledEventsToTriggers = function(labeledEvents, leToTriggerMap) {
	var e_5, _a, e_6, _b;
	var matchingTriggers = /* @__PURE__ */ new Set();
	try {
		for (var labeledEvents_2 = __values$1(labeledEvents), labeledEvents_2_1 = labeledEvents_2.next(); !labeledEvents_2_1.done; labeledEvents_2_1 = labeledEvents_2.next()) {
			var le = labeledEvents_2_1.value;
			var triggers = leToTriggerMap.get(le.id);
			if (triggers) try {
				for (var triggers_2 = (e_6 = void 0, __values$1(triggers)), triggers_2_1 = triggers_2.next(); !triggers_2_1.done; triggers_2_1 = triggers_2.next()) {
					var trigger = triggers_2_1.value;
					matchingTriggers.add(trigger);
				}
			} catch (e_6_1) {
				e_6 = { error: e_6_1 };
			} finally {
				try {
					if (triggers_2_1 && !triggers_2_1.done && (_b = triggers_2.return)) _b.call(triggers_2);
				} finally {
					if (e_6) throw e_6.error;
				}
			}
		}
	} catch (e_5_1) {
		e_5 = { error: e_5_1 };
	} finally {
		try {
			if (labeledEvents_2_1 && !labeledEvents_2_1.done && (_a = labeledEvents_2.return)) _a.call(labeledEvents_2);
		} finally {
			if (e_5) throw e_5.error;
		}
	}
	return Array.from(matchingTriggers);
};
var TriggerEvaluator = function() {
	function TriggerEvaluator(groupedLabeledEvents, labeledEventToTriggerMap, dataExtractor, options) {
		this.groupedLabeledEvents = groupedLabeledEvents;
		this.labeledEventToTriggerMap = labeledEventToTriggerMap;
		this.dataExtractor = dataExtractor;
		this.options = options;
	}
	TriggerEvaluator.prototype.evaluate = function(event) {
		var e_7, _a;
		var pageActions = this.options.pageActions;
		if (!pageActions) return event;
		var matchingTriggers = matchLabeledEventsToTriggers(matchEventToLabeledEvents(event, Array.from(this.groupedLabeledEvents[event.type]).map(function(id) {
			return pageActions.labeledEvents[id];
		})), this.labeledEventToTriggerMap);
		try {
			for (var matchingTriggers_1 = __values$1(matchingTriggers), matchingTriggers_1_1 = matchingTriggers_1.next(); !matchingTriggers_1_1.done; matchingTriggers_1_1 = matchingTriggers_1.next()) {
				var trigger = matchingTriggers_1_1.value;
				executeActions(trigger.actions, event, this.dataExtractor);
			}
		} catch (e_7_1) {
			e_7 = { error: e_7_1 };
		} finally {
			try {
				if (matchingTriggers_1_1 && !matchingTriggers_1_1.done && (_a = matchingTriggers_1.return)) _a.call(matchingTriggers_1);
			} finally {
				if (e_7) throw e_7.error;
			}
		}
		return event;
	};
	TriggerEvaluator.prototype.update = function(groupedLabeledEvents, labeledEventToTriggerMap, options) {
		this.groupedLabeledEvents = groupedLabeledEvents;
		this.labeledEventToTriggerMap = labeledEventToTriggerMap;
		this.options = options;
	};
	return TriggerEvaluator;
}();
var createTriggerEvaluator = function(groupedLabeledEvents, labeledEventToTriggerMap, dataExtractor, options) {
	return new TriggerEvaluator(groupedLabeledEvents, labeledEventToTriggerMap, dataExtractor, options);
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/hierarchy.js
var BLOCKED_ATTRIBUTES = new Set([
	"id",
	"class",
	"style",
	"value",
	"onclick",
	"onchange",
	"oninput",
	"onblur",
	"onsubmit",
	"onfocus",
	"onkeydown",
	"onkeyup",
	"onkeypress",
	"data-reactid",
	"data-react-checksum",
	"data-reactroot",
	DATA_AMP_MASK_ATTRIBUTES,
	TEXT_MASK_ATTRIBUTE$1
]);
var SENSITIVE_ELEMENT_ATTRIBUTE_ALLOWLIST = ["type"];
var SVG_TAGS = [
	"svg",
	"path",
	"g"
];
var HIGHLY_SENSITIVE_INPUT_TYPES = ["password", "hidden"];
function getElementProperties(element, userMaskedAttributeNames) {
	var e_1, _a;
	var _b, _c, _d, _e;
	if (element === null) return null;
	var tagName = String(element.tagName).toLowerCase();
	var properties = { tag: tagName };
	var siblings = Array.from((_c = (_b = element.parentElement) === null || _b === void 0 ? void 0 : _b.children) !== null && _c !== void 0 ? _c : []);
	if (siblings.length) {
		properties.index = siblings.indexOf(element);
		properties.indexOfType = siblings.filter(function(el) {
			return el.tagName === element.tagName;
		}).indexOf(element);
	}
	var prevSiblingTag = (_e = (_d = element.previousElementSibling) === null || _d === void 0 ? void 0 : _d.tagName) === null || _e === void 0 ? void 0 : _e.toLowerCase();
	if (prevSiblingTag) properties.prevSib = String(prevSiblingTag);
	var id = element.getAttribute("id");
	if (id) properties.id = String(id);
	var classes = Array.from(element.classList);
	if (classes.length) properties.classes = classes;
	var attributes = {};
	var filteredAttributes = Array.from(element.attributes).filter(function(attr) {
		return !BLOCKED_ATTRIBUTES.has(attr.name);
	});
	var isSensitiveElement = !isNonSensitiveElement(element);
	if (!HIGHLY_SENSITIVE_INPUT_TYPES.includes(String(element.getAttribute("type"))) && !SVG_TAGS.includes(tagName)) try {
		for (var filteredAttributes_1 = __values$1(filteredAttributes), filteredAttributes_1_1 = filteredAttributes_1.next(); !filteredAttributes_1_1.done; filteredAttributes_1_1 = filteredAttributes_1.next()) {
			var attr = filteredAttributes_1_1.value;
			if (isSensitiveElement && !SENSITIVE_ELEMENT_ATTRIBUTE_ALLOWLIST.includes(attr.name)) continue;
			if (userMaskedAttributeNames.has(attr.name)) {
				attributes[attr.name] = MASKED_TEXT_VALUE$1;
				continue;
			}
			attributes[attr.name] = String(attr.value).substring(0, 128);
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (filteredAttributes_1_1 && !filteredAttributes_1_1.done && (_a = filteredAttributes_1.return)) _a.call(filteredAttributes_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	if (Object.keys(attributes).length) properties.attrs = attributes;
	return properties;
}
function getAncestors(targetEl) {
	var ancestors = [];
	if (!targetEl) return ancestors;
	ancestors.push(targetEl);
	var current = targetEl.parentElement;
	while (current && current.tagName !== "HTML") {
		ancestors.push(current);
		current = current.parentElement;
	}
	return ancestors;
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/libs/element-path.js
/* istanbul ignore file */
var Step = function() {
	function Step(value, optimized) {
		this.value = value;
		this.optimized = optimized;
	}
	Step.prototype.toString = function() {
		return this.value;
	};
	return Step;
}();
var cssPath = function(node, optimized) {
	if (node.nodeType !== Node.ELEMENT_NODE) return "";
	var steps = [];
	var contextNode = node;
	while (contextNode) {
		var step = cssPathStep(contextNode, Boolean(optimized), contextNode === node);
		if (!step) break;
		steps.push(step);
		if (step.optimized) break;
		contextNode = contextNode.parentElement;
	}
	steps.reverse();
	return steps.join(" > ");
};
var cssPathStep = function(node, optimized, isTargetNode) {
	var e_1, _a;
	if (node.nodeType !== Node.ELEMENT_NODE) return null;
	var id = node.getAttribute("id");
	if (optimized) {
		if (id) return new Step(idSelector(id), true);
		var nodeNameLower = node.tagName.toLowerCase();
		if (nodeNameLower === "body" || nodeNameLower === "head" || nodeNameLower === "html") return new Step(nodeNameLower, true);
	}
	var nodeName = node.tagName.toLowerCase();
	if (id) return new Step(nodeName + idSelector(id), true);
	var parent = node.parentNode;
	if (!parent || parent.nodeType === Node.DOCUMENT_NODE) return new Step(nodeName, true);
	function prefixedElementClassNames(el) {
		var classAttribute = el.getAttribute("class");
		if (!classAttribute) return [];
		return classAttribute.split(/\s+/g).filter(Boolean).map(function(name) {
			return "$" + name;
		});
	}
	function idSelector(id) {
		return "#" + CSS.escape(id);
	}
	var prefixedOwnClassNamesArray = prefixedElementClassNames(node);
	var needsClassNames = false;
	var needsNthChild = false;
	var ownIndex = -1;
	var elementIndex = -1;
	var siblings = parent.children;
	for (var i = 0; siblings && (ownIndex === -1 || !needsNthChild) && i < siblings.length; ++i) {
		var sibling = siblings[i];
		if (sibling.nodeType !== Node.ELEMENT_NODE) continue;
		elementIndex += 1;
		if (sibling === node) {
			ownIndex = elementIndex;
			continue;
		}
		if (needsNthChild) continue;
		if (sibling.tagName.toLowerCase() !== nodeName) continue;
		needsClassNames = true;
		var ownClassNames = new Set(prefixedOwnClassNamesArray);
		if (!ownClassNames.size) {
			needsNthChild = true;
			continue;
		}
		var siblingClassNamesArray = prefixedElementClassNames(sibling);
		for (var j = 0; j < siblingClassNamesArray.length; ++j) {
			var siblingClass = siblingClassNamesArray[j];
			if (!ownClassNames.has(siblingClass)) continue;
			ownClassNames.delete(siblingClass);
			if (!ownClassNames.size) {
				needsNthChild = true;
				break;
			}
		}
	}
	var result = nodeName;
	if (isTargetNode && nodeName.toLowerCase() === "input" && node.getAttribute("type") && !node.getAttribute("id") && !node.getAttribute("class")) result += "[type=" + CSS.escape(node.getAttribute("type") || "") + "]";
	if (needsNthChild) result += ":nth-child(" + String(ownIndex + 1) + ")";
	else if (needsClassNames) try {
		for (var prefixedOwnClassNamesArray_1 = __values$1(prefixedOwnClassNamesArray), prefixedOwnClassNamesArray_1_1 = prefixedOwnClassNamesArray_1.next(); !prefixedOwnClassNamesArray_1_1.done; prefixedOwnClassNamesArray_1_1 = prefixedOwnClassNamesArray_1.next()) {
			var prefixedName = prefixedOwnClassNamesArray_1_1.value;
			result += "." + CSS.escape(prefixedName.slice(1));
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (prefixedOwnClassNamesArray_1_1 && !prefixedOwnClassNamesArray_1_1.done && (_a = prefixedOwnClassNamesArray_1.return)) _a.call(prefixedOwnClassNamesArray_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	return new Step(result, false);
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/data-extractor.js
var DataExtractor = function() {
	function DataExtractor(options, context) {
		var e_1, _a;
		var _this = this;
		var _b;
		/**
		* Wrapper method to replace sensitive strings using the helper function
		* @param text - The text to search for sensitive data
		* @returns The text with sensitive data replaced by masked text
		*/
		this.replaceSensitiveString = function(text) {
			return replaceSensitiveString$1(text, _this.additionalMaskTextPatterns);
		};
		this.getHierarchy = function(element) {
			var e_2, _a;
			var _b, _c;
			var startTime = performance.now();
			var hierarchy = [];
			if (!element) return [];
			var ancestors = getAncestors(element);
			var elementToAttributesToMaskMap = /* @__PURE__ */ new Map();
			for (var i = ancestors.length - 1; i >= 0; i--) {
				var node = ancestors[i];
				if (node) {
					var attributesToMask = parseAttributesToMask(node.getAttribute(DATA_AMP_MASK_ATTRIBUTES));
					var ancestorAttributesToMask = i === ancestors.length - 1 ? [] : (_b = elementToAttributesToMaskMap.get(ancestors[i + 1])) !== null && _b !== void 0 ? _b : /* @__PURE__ */ new Set();
					var combinedAttributesToMask = new Set(__spreadArray(__spreadArray([], __read$1(ancestorAttributesToMask), false), __read$1(attributesToMask), false));
					elementToAttributesToMaskMap.set(node, combinedAttributesToMask);
				}
			}
			hierarchy = ancestors.map(function(el) {
				var _a;
				return getElementProperties(el, (_a = elementToAttributesToMaskMap.get(el)) !== null && _a !== void 0 ? _a : /* @__PURE__ */ new Set());
			});
			var _loop_1 = function(hierarchyNode) {
				if (hierarchyNode === null || hierarchyNode === void 0 ? void 0 : hierarchyNode.attrs) Object.entries(hierarchyNode.attrs).forEach(function(_a) {
					var _b = __read$1(_a, 2), key = _b[0], value = _b[1];
					if (hierarchyNode.attrs) hierarchyNode.attrs[key] = _this.replaceSensitiveString(value);
				});
			};
			try {
				for (var hierarchy_1 = __values$1(hierarchy), hierarchy_1_1 = hierarchy_1.next(); !hierarchy_1_1.done; hierarchy_1_1 = hierarchy_1.next()) {
					var hierarchyNode = hierarchy_1_1.value;
					_loop_1(hierarchyNode);
				}
			} catch (e_2_1) {
				e_2 = { error: e_2_1 };
			} finally {
				try {
					if (hierarchy_1_1 && !hierarchy_1_1.done && (_a = hierarchy_1.return)) _a.call(hierarchy_1);
				} finally {
					if (e_2) throw e_2.error;
				}
			}
			var endTime = performance.now();
			(_c = _this.diagnosticsClient) === null || _c === void 0 || _c.recordHistogram("autocapturePlugin.getHierarchy", endTime - startTime);
			return hierarchy;
		};
		this.getNearestLabel = function(element) {
			var parent = element.parentElement;
			if (!parent) return "";
			var labelElement;
			try {
				labelElement = parent.querySelector(":scope>span,h1,h2,h3,h4,h5,h6");
			} catch (_a) {
				/* istanbul ignore next */
				labelElement = null;
			}
			if (labelElement)
 /* istanbul ignore next */
			return _this.getText(labelElement);
			return _this.getNearestLabel(parent);
		};
		this.getElementPath = function(element) {
			var _a;
			if (!element) return "";
			var startTime = performance.now();
			var elementPath = cssPath(element);
			var endTime = performance.now();
			(_a = _this.diagnosticsClient) === null || _a === void 0 || _a.recordHistogram("autocapturePlugin.getElementPath", endTime - startTime);
			return elementPath;
		};
		this.getEventProperties = function(actionType, element, dataAttributePrefix) {
			var _a;
			var _b, _c, _d;
			/* istanbul ignore next */
			var tag = (_c = (_b = element === null || element === void 0 ? void 0 : element.tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase) === null || _c === void 0 ? void 0 : _c.call(_b);
			/* istanbul ignore next */
			var rect = typeof element.getBoundingClientRect === "function" ? element.getBoundingClientRect() : {
				left: null,
				top: null
			};
			var hierarchy = _this.getHierarchy(element);
			var currentElementAttributes = (_d = hierarchy[0]) === null || _d === void 0 ? void 0 : _d.attrs;
			var nearestLabel = _this.getNearestLabel(element);
			var attributes = extractPrefixedAttributes(currentElementAttributes !== null && currentElementAttributes !== void 0 ? currentElementAttributes : {}, dataAttributePrefix);
			/* istanbul ignore next */
			var properties = (_a = {}, _a[AMPLITUDE_EVENT_PROP_ELEMENT_HIERARCHY] = hierarchy, _a[AMPLITUDE_EVENT_PROP_ELEMENT_TAG] = tag, _a[AMPLITUDE_EVENT_PROP_ELEMENT_TEXT] = _this.getText(element), _a[AMPLITUDE_EVENT_PROP_ELEMENT_POSITION_LEFT] = rect.left == null ? null : Math.round(rect.left), _a[AMPLITUDE_EVENT_PROP_ELEMENT_POSITION_TOP] = rect.top == null ? null : Math.round(rect.top), _a[AMPLITUDE_EVENT_PROP_ELEMENT_ATTRIBUTES] = attributes, _a[AMPLITUDE_EVENT_PROP_ELEMENT_PATH] = _this.getElementPath(element), _a[AMPLITUDE_EVENT_PROP_ELEMENT_PARENT_LABEL] = nearestLabel, _a[AMPLITUDE_EVENT_PROP_PAGE_URL] = getDecodeURI$1(window.location.href.split("?")[0]), _a[AMPLITUDE_EVENT_PROP_PAGE_TITLE] = getPageTitle$1(_this.replaceSensitiveString), _a[AMPLITUDE_EVENT_PROP_VIEWPORT_HEIGHT] = window.innerHeight, _a[AMPLITUDE_EVENT_PROP_VIEWPORT_WIDTH] = window.innerWidth, _a);
			var pageViewId = getCurrentPageViewId();
			/* istanbul ignore next */
			if (pageViewId)
 /* istanbul ignore next */
			properties[AMPLITUDE_EVENT_PROP_PAGE_VIEW_ID] = pageViewId;
			properties[AMPLITUDE_EVENT_PROP_ELEMENT_ID] = element.getAttribute("id") || "";
			properties[AMPLITUDE_EVENT_PROP_ELEMENT_CLASS] = element.getAttribute("class");
			properties[AMPLITUDE_EVENT_PROP_ELEMENT_ARIA_LABEL] = currentElementAttributes === null || currentElementAttributes === void 0 ? void 0 : currentElementAttributes["aria-label"];
			if (tag === "a" && actionType === "click" && element instanceof HTMLAnchorElement) {
				var href = element.href.substring(0, 128);
				properties[AMPLITUDE_EVENT_PROP_ELEMENT_HREF] = _this.replaceSensitiveString(href);
			}
			return removeEmptyProperties(properties);
		};
		this.addTypeAndTimestamp = function(event, type) {
			return {
				event,
				timestamp: Date.now(),
				type
			};
		};
		this.addAdditionalEventProperties = function(event, type, selectorAllowlist, dataAttributePrefix, isCapturingCursorPointer) {
			if (isCapturingCursorPointer === void 0) isCapturingCursorPointer = false;
			var baseEvent = _this.addTypeAndTimestamp(event, type);
			if (isElementBasedEvent(baseEvent) && baseEvent.event.target !== null) {
				if (isCapturingCursorPointer) {
					if (isElementPointerCursor(baseEvent.event.target, baseEvent.type)) {
						baseEvent.closestTrackedAncestor = baseEvent.event.target;
						baseEvent.targetElementProperties = _this.getEventProperties(baseEvent.type, baseEvent.closestTrackedAncestor, dataAttributePrefix);
						return baseEvent;
					}
				}
				var closestTrackedAncestor = getClosestElement(baseEvent.event.target, selectorAllowlist);
				if (closestTrackedAncestor) {
					baseEvent.closestTrackedAncestor = closestTrackedAncestor;
					baseEvent.targetElementProperties = _this.getEventProperties(baseEvent.type, closestTrackedAncestor, dataAttributePrefix);
				}
				return baseEvent;
			}
			return baseEvent;
		};
		this.extractDataFromDataSource = function(dataSource, contextElement) {
			if (dataSource.sourceType === "DOM_ELEMENT") {
				var sourceElement = getDataSource(dataSource, contextElement);
				if (!sourceElement) return;
				if (dataSource.elementExtractType === "TEXT") return _this.getText(sourceElement);
				else if (dataSource.elementExtractType === "ATTRIBUTE" && dataSource.attribute) return sourceElement.getAttribute(dataSource.attribute);
				return;
			}
		};
		this.getTextWithMaskedDescendants = function(element) {
			var e_3, _a;
			var maskedSelector = "[".concat(TEXT_MASK_ATTRIBUTE$1, "], [contenteditable]");
			if (!element.querySelector(maskedSelector)) return element.innerText;
			var output = "";
			var childNodes = Array.from(element.childNodes);
			try {
				for (var childNodes_1 = __values$1(childNodes), childNodes_1_1 = childNodes_1.next(); !childNodes_1_1.done; childNodes_1_1 = childNodes_1.next()) {
					var childNode = childNodes_1_1.value;
					if (childNode.nodeType === Node.TEXT_NODE) {
						output += childNode.textContent || "";
						continue;
					}
					if (!(childNode instanceof Element)) continue;
					if (childNode.hasAttribute("data-amp-mask") || childNode.hasAttribute("contenteditable")) {
						output += MASKED_TEXT_VALUE$1;
						continue;
					}
					output += _this.getTextWithMaskedDescendants(childNode);
				}
			} catch (e_3_1) {
				e_3 = { error: e_3_1 };
			} finally {
				try {
					if (childNodes_1_1 && !childNodes_1_1.done && (_a = childNodes_1.return)) _a.call(childNodes_1);
				} finally {
					if (e_3) throw e_3.error;
				}
			}
			return output;
		};
		this.getText = function(element) {
			if (element.closest("[".concat("data-amp-mask", "]")) !== null) return MASKED_TEXT_VALUE$1;
			var output = "";
			if (!element.querySelector("[".concat("data-amp-mask", "], [contenteditable]"))) output = element.innerText || "";
			else output = _this.getTextWithMaskedDescendants(element);
			return _this.replaceSensitiveString(output.substring(0, 255)).replace(/\s+/g, " ").trim();
		};
		this.getEventTagProps = function(element) {
			var _a;
			var _b, _c;
			if (!element) return {};
			/* istanbul ignore next */
			var tag = (_c = (_b = element === null || element === void 0 ? void 0 : element.tagName) === null || _b === void 0 ? void 0 : _b.toLowerCase) === null || _c === void 0 ? void 0 : _c.call(_b);
			return removeEmptyProperties((_a = {}, _a[AMPLITUDE_EVENT_PROP_ELEMENT_TAG] = tag, _a[AMPLITUDE_EVENT_PROP_ELEMENT_TEXT] = _this.getText(element), _a[AMPLITUDE_EVENT_PROP_PAGE_URL] = window.location.href.split("?")[0], _a));
		};
		this.diagnosticsClient = context === null || context === void 0 ? void 0 : context.diagnosticsClient;
		var rawPatterns = (_b = options.maskTextRegex) !== null && _b !== void 0 ? _b : [];
		var compiled = [];
		try {
			for (var rawPatterns_1 = __values$1(rawPatterns), rawPatterns_1_1 = rawPatterns_1.next(); !rawPatterns_1_1.done; rawPatterns_1_1 = rawPatterns_1.next()) {
				var entry = rawPatterns_1_1.value;
				if (compiled.length >= 25) break;
				if (entry instanceof RegExp) compiled.push(entry);
				else if ("pattern" in entry && typeof entry.pattern === "string") try {
					compiled.push(new RegExp(entry.pattern, "i"));
				} catch (_c) {}
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (rawPatterns_1_1 && !rawPatterns_1_1.done && (_a = rawPatterns_1.return)) _a.call(rawPatterns_1);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
		this.additionalMaskTextPatterns = compiled;
	}
	return DataExtractor;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-exposure.js
function trackExposure(_a) {
	var allObservables = _a.allObservables, onExposure = _a.onExposure, dataExtractor = _a.dataExtractor, _b = _a.exposureDuration, exposureDuration = _b === void 0 ? 150 : _b;
	var exposureMap = /* @__PURE__ */ new Map();
	var exposureTimerMap = /* @__PURE__ */ new Map();
	var exposureSubscription = allObservables.exposureObservable.subscribe(function(event) {
		var entry = event;
		var element = entry.target;
		if (entry.isIntersecting) {
			if (!exposureMap.get(element)) {
				var timer = setTimeout(function() {
					exposureMap.set(element, true);
					onExposure(dataExtractor.getElementPath(element));
					exposureTimerMap.set(element, null);
				}, exposureDuration);
				exposureTimerMap.set(element, timer);
			}
		} else if (!entry.isIntersecting && entry.intersectionRatio < 1) {
			var timer = exposureTimerMap.get(element);
			if (timer) {
				clearTimeout(timer);
				exposureTimerMap.set(element, null);
			}
		}
	});
	return {
		unsubscribe: function() {
			exposureSubscription.unsubscribe();
		},
		reset: function() {
			exposureTimerMap.forEach(function(timer) {
				if (timer) clearTimeout(timer);
			});
			exposureTimerMap.clear();
			exposureMap.clear();
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-viewport-content-updated.js
function fireViewportContentUpdated(_a) {
	var _b;
	var _c, _d, _e, _f, _g;
	var amplitude = _a.amplitude, scrollTracker = _a.scrollTracker, currentElementExposed = _a.currentElementExposed, elementExposedForPage = _a.elementExposedForPage, exposureTracker = _a.exposureTracker, isPageEnd = _a.isPageEnd, lastScroll = _a.lastScroll;
	var pageScrollMaxState = scrollTracker.getState();
	var globalScope = getGlobalScope$1();
	/* istanbul ignore next */
	var viewportWidth = (_c = globalScope === null || globalScope === void 0 ? void 0 : globalScope.innerWidth) !== null && _c !== void 0 ? _c : 0;
	/* istanbul ignore next */
	var viewportHeight = (_d = globalScope === null || globalScope === void 0 ? void 0 : globalScope.innerHeight) !== null && _d !== void 0 ? _d : 0;
	var eventProperties = (_b = {}, _b[AMPLITUDE_EVENT_PROP_PAGE_URL] = getDecodeURI$1(
		/* istanbul ignore next */
		(_g = (_f = (_e = globalScope === null || globalScope === void 0 ? void 0 : globalScope.location) === null || _e === void 0 ? void 0 : _e.href) === null || _f === void 0 ? void 0 : _f.split("?")[0]) !== null && _g !== void 0 ? _g : ""
	), _b[AMPLITUDE_EVENT_PROP_MAX_PAGE_X] = pageScrollMaxState.maxX + viewportWidth, _b[AMPLITUDE_EVENT_PROP_MAX_PAGE_Y] = pageScrollMaxState.maxY + viewportHeight, _b[AMPLITUDE_EVENT_PROP_VIEWPORT_HEIGHT] = viewportHeight, _b[AMPLITUDE_EVENT_PROP_VIEWPORT_WIDTH] = viewportWidth, _b["[Amplitude] Element Exposed"] = Array.from(currentElementExposed), _b);
	var pageViewId = getCurrentPageViewId();
	if (pageViewId) eventProperties[AMPLITUDE_EVENT_PROP_PAGE_VIEW_ID] = pageViewId;
	if (currentElementExposed.size === 0 && pageScrollMaxState.maxX === lastScroll.maxX && pageScrollMaxState.maxY === lastScroll.maxY) {
		if (isPageEnd) {
			scrollTracker.reset();
			elementExposedForPage.clear();
			exposureTracker === null || exposureTracker === void 0 || exposureTracker.reset();
		}
		return;
	}
	/* istanbul ignore next */
	amplitude === null || amplitude === void 0 || amplitude.track("[Amplitude] Viewport Content Updated", eventProperties);
	lastScroll.maxX = pageScrollMaxState.maxX;
	lastScroll.maxY = pageScrollMaxState.maxY;
	currentElementExposed.clear();
	if (isPageEnd) {
		scrollTracker.reset();
		elementExposedForPage.clear();
		exposureTracker === null || exposureTracker === void 0 || exposureTracker.reset();
	}
}
function onExposure(elementPath, elementExposedForPage, currentElementExposed, fireViewportContentUpdatedCallback) {
	if (elementExposedForPage.has(elementPath)) return;
	elementExposedForPage.add(elementPath);
	currentElementExposed.add(elementPath);
	var exposedArray = Array.from(currentElementExposed);
	if (JSON.stringify(exposedArray).length >= 18e3) fireViewportContentUpdatedCallback(false);
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture-plugin.js
var ObservablesEnum$1;
(function(ObservablesEnum) {
	ObservablesEnum["ClickObservable"] = "clickObservable";
	ObservablesEnum["ChangeObservable"] = "changeObservable";
	ObservablesEnum["NavigateObservable"] = "navigateObservable";
	ObservablesEnum["MutationObservable"] = "mutationObservable";
	ObservablesEnum["ScrollObservable"] = "scrollObservable";
	ObservablesEnum["ExposureObservable"] = "exposureObservable";
	ObservablesEnum["BrowserErrorObservable"] = "browserErrorObservable";
	ObservablesEnum["SelectionObservable"] = "selectionObservable";
	ObservablesEnum["MouseMoveObservable"] = "mouseMoveObservable";
})(ObservablesEnum$1 || (ObservablesEnum$1 = {}));
var autocapturePlugin = function(options, context) {
	var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
	if (options === void 0) options = {};
	context === null || context === void 0 || context.diagnosticsClient.setTag("plugin.autocapture.version", "1.27.1");
	var _o = options.dataAttributePrefix, dataAttributePrefix = _o === void 0 ? DEFAULT_DATA_ATTRIBUTE_PREFIX : _o, _p = options.visualTaggingOptions, visualTaggingOptions = _p === void 0 ? { enabled: true } : _p;
	options.cssSelectorAllowlist = (_a = options.cssSelectorAllowlist) !== null && _a !== void 0 ? _a : DEFAULT_CSS_SELECTOR_ALLOWLIST;
	options.actionClickAllowlist = (_b = options.actionClickAllowlist) !== null && _b !== void 0 ? _b : DEFAULT_ACTION_CLICK_ALLOWLIST;
	options.debounceTime = (_c = options.debounceTime) !== null && _c !== void 0 ? _c : 0;
	var isViewportContentUpdatedEnabled = ((_d = options.viewportContentUpdated) === null || _d === void 0 ? void 0 : _d.enabled) !== false;
	var resolvedExposureDuration = (_g = (_f = (_e = options.viewportContentUpdated) === null || _e === void 0 ? void 0 : _e.exposureDuration) !== null && _f !== void 0 ? _f : options.exposureDuration) !== null && _g !== void 0 ? _g : 150;
	options.viewportContentUpdated = __assign$1(__assign$1({}, options.viewportContentUpdated), { exposureDuration: resolvedExposureDuration });
	options.pageUrlExcludelist = (_h = options.pageUrlExcludelist) === null || _h === void 0 ? void 0 : _h.reduce(function(acc, excludePattern) {
		if (typeof excludePattern === "string") acc.push(excludePattern);
		if (excludePattern instanceof RegExp) acc.push(excludePattern);
		if (typeof excludePattern === "object" && excludePattern !== null && "pattern" in excludePattern) try {
			acc.push(new RegExp(excludePattern.pattern));
		} catch (regexError) {
			console.warn("Invalid regex pattern: ".concat(excludePattern.pattern), regexError);
			return acc;
		}
		return acc;
	}, []);
	var name = PLUGIN_NAME$2;
	var type = "enrichment";
	var subscriptions = [];
	var dataExtractor = new DataExtractor(options, context);
	var elementExposedForPage = /* @__PURE__ */ new Set();
	var currentElementExposed = /* @__PURE__ */ new Set();
	var beforeUnloadCleanup;
	var createObservables = function() {
		var _a;
		var clickObservable = multicast(createClickObservable().map(function(click) {
			return dataExtractor.addAdditionalEventProperties(click, "click", options.cssSelectorAllowlist, dataAttributePrefix);
		}));
		var changeObservable = multicast(new import_zen_observable.default(function(observer) {
			var _a;
			var handler = function(changeEvent) {
				var enrichedChangeEvent = dataExtractor.addAdditionalEventProperties(changeEvent, "change", options.cssSelectorAllowlist, dataAttributePrefix);
				observer.next(enrichedChangeEvent);
			};
			/* istanbul ignore next */
			(_a = getGlobalScope$1()) === null || _a === void 0 || _a.document.addEventListener("change", handler, { capture: true });
			/* istanbul ignore next */
			return function() {
				var _a;
				return (_a = getGlobalScope$1()) === null || _a === void 0 ? void 0 : _a.document.removeEventListener("change", handler);
			};
		}));
		var navigateObservable;
		/* istanbul ignore next */
		if (window.navigation) navigateObservable = multicast(new import_zen_observable.default(function(observer) {
			var handler = function(navigateEvent) {
				var enrichedNavigateEvent = dataExtractor.addAdditionalEventProperties(navigateEvent, "navigate", options.cssSelectorAllowlist, dataAttributePrefix);
				observer.next(enrichedNavigateEvent);
			};
			window.navigation.addEventListener("navigate", handler);
			return function() {
				window.navigation.removeEventListener("navigate", handler);
			};
		}));
		var mutationObservable = multicast(createMutationObservable().map(function(mutation) {
			return dataExtractor.addAdditionalEventProperties(mutation, "mutation", options.cssSelectorAllowlist, dataAttributePrefix);
		}));
		var scrollObservable = createScrollObservable();
		var exposureObservable = createExposureObservable(mutationObservable, options.cssSelectorAllowlist);
		return _a = {}, _a[ObservablesEnum$1.ChangeObservable] = changeObservable, _a[ObservablesEnum$1.ClickObservable] = clickObservable, _a[ObservablesEnum$1.MutationObservable] = mutationObservable, _a[ObservablesEnum$1.NavigateObservable] = navigateObservable, _a[ObservablesEnum$1.ScrollObservable] = scrollObservable, _a[ObservablesEnum$1.ExposureObservable] = exposureObservable, _a;
	};
	var groupedLabeledEvents = groupLabeledEventIdsByEventType(Object.values((_k = (_j = options.pageActions) === null || _j === void 0 ? void 0 : _j.labeledEvents) !== null && _k !== void 0 ? _k : {}));
	var labeledEventToTriggerMap = createLabeledEventToTriggerMap((_m = (_l = options.pageActions) === null || _l === void 0 ? void 0 : _l.triggers) !== null && _m !== void 0 ? _m : []);
	var evaluateTriggers = createTriggerEvaluator(groupedLabeledEvents, labeledEventToTriggerMap, dataExtractor, options);
	var recomputePageActionsData = function(remotePageActions) {
		var _a, _b;
		if (remotePageActions) {
			options.pageActions = __assign$1(__assign$1({}, options.pageActions), remotePageActions);
			groupedLabeledEvents = groupLabeledEventIdsByEventType(Object.values((_a = options.pageActions.labeledEvents) !== null && _a !== void 0 ? _a : {}));
			labeledEventToTriggerMap = createLabeledEventToTriggerMap((_b = options.pageActions.triggers) !== null && _b !== void 0 ? _b : []);
			evaluateTriggers.update(groupedLabeledEvents, labeledEventToTriggerMap, options);
		}
	};
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			var pageViewEndFired, lastScroll, shouldTrackEvent, shouldTrackActionClick, allObservables, clickTrackingSubscription, changeSubscription, actionClickSubscription, scrollTracker, trackers, globalScope, handleViewportContentUpdated, handleExposure, beforeUnloadHandler_1, navigateObservable, popstateHandler_1, originalPushState_1, allowlist, actionClickAllowlist, messenger;
			var _a;
			return __generator(this, function(_b) {
				/* istanbul ignore if */
				if (typeof document === "undefined") return [2];
				pageViewEndFired = false;
				lastScroll = {
					maxX: void 0,
					maxY: void 0
				};
				if (config.fetchRemoteConfig) if (!config.remoteConfigClient) config.loggerProvider.debug("Remote config client is not provided, skipping remote config fetch");
				else config.remoteConfigClient.subscribe("configs.analyticsSDK.pageActions", "all", function(remoteConfig) {
					recomputePageActionsData(remoteConfig);
				});
				shouldTrackEvent = createShouldTrackEvent(options, options.cssSelectorAllowlist);
				shouldTrackActionClick = createShouldTrackEvent(options, options.actionClickAllowlist);
				allObservables = createObservables();
				clickTrackingSubscription = trackClicks({
					allObservables,
					amplitude,
					shouldTrackEvent,
					evaluateTriggers: evaluateTriggers.evaluate.bind(evaluateTriggers)
				});
				subscriptions.push(clickTrackingSubscription);
				changeSubscription = trackChange({
					allObservables,
					getEventProperties: function() {
						var args = [];
						for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
						return dataExtractor.getEventProperties.apply(dataExtractor, __spreadArray(__spreadArray([], __read$1(args), false), [dataAttributePrefix], false));
					},
					amplitude,
					shouldTrackEvent,
					evaluateTriggers: evaluateTriggers.evaluate.bind(evaluateTriggers)
				});
				subscriptions.push(changeSubscription);
				actionClickSubscription = trackActionClick({
					allObservables,
					options,
					getEventProperties: function() {
						var args = [];
						for (var _i = 0; _i < arguments.length; _i++) args[_i] = arguments[_i];
						return dataExtractor.getEventProperties.apply(dataExtractor, __spreadArray(__spreadArray([], __read$1(args), false), [dataAttributePrefix], false));
					},
					amplitude,
					shouldTrackEvent,
					shouldTrackActionClick
				});
				if (actionClickSubscription) subscriptions.push(actionClickSubscription);
				scrollTracker = trackScroll({
					allObservables,
					amplitude
				});
				subscriptions.push(scrollTracker);
				trackers = {};
				globalScope = getGlobalScope$1();
				handleViewportContentUpdated = function(isPageEnd) {
					if (isPageEnd && pageViewEndFired) return;
					setTimeout(function() {
						pageViewEndFired = false;
					}, 100);
					pageViewEndFired = true;
					fireViewportContentUpdated({
						amplitude,
						scrollTracker,
						currentElementExposed,
						elementExposedForPage,
						exposureTracker: trackers.exposure,
						isPageEnd,
						lastScroll
					});
				};
				handleExposure = function(elementPath) {
					onExposure(elementPath, elementExposedForPage, currentElementExposed, handleViewportContentUpdated);
				};
				if (isViewportContentUpdatedEnabled) {
					trackers.exposure = trackExposure({
						allObservables,
						onExposure: handleExposure,
						dataExtractor,
						exposureDuration: resolvedExposureDuration
					});
					if (trackers.exposure) subscriptions.push(trackers.exposure);
					beforeUnloadHandler_1 = function() {
						handleViewportContentUpdated(true);
					};
					/* istanbul ignore next */
					globalScope === null || globalScope === void 0 || globalScope.addEventListener("beforeunload", beforeUnloadHandler_1);
					beforeUnloadCleanup = function() {
						/* istanbul ignore next */
						globalScope === null || globalScope === void 0 || globalScope.removeEventListener("beforeunload", beforeUnloadHandler_1);
					};
					subscriptions.push({ unsubscribe: function() {
						return beforeUnloadCleanup();
					} });
					navigateObservable = allObservables[ObservablesEnum$1.NavigateObservable];
					if (navigateObservable) subscriptions.push(navigateObservable.subscribe(function() {
						handleViewportContentUpdated(true);
					}));
					else if (globalScope) {
						popstateHandler_1 = function() {
							handleViewportContentUpdated(true);
						};
						/* istanbul ignore next */
						globalScope.addEventListener("popstate", popstateHandler_1);
						originalPushState_1 = globalScope.history.pushState;
						if (globalScope.history && originalPushState_1) globalScope.history.pushState = new Proxy(originalPushState_1, { apply: function(target, thisArg, _a) {
							var _b = __read$1(_a, 3), state = _b[0], unused = _b[1], url = _b[2];
							target.apply(thisArg, [
								state,
								unused,
								url
							]);
							handleViewportContentUpdated(true);
						} });
						subscriptions.push({ unsubscribe: function() {
							/* istanbul ignore next */
							globalScope.removeEventListener("popstate", popstateHandler_1);
							/* istanbul ignore next */
							if (globalScope.history && originalPushState_1) globalScope.history.pushState = originalPushState_1;
						} });
					}
				}
				/* istanbul ignore next */
				(_a = config === null || config === void 0 ? void 0 : config.loggerProvider) === null || _a === void 0 || _a.log("".concat(name, " has been successfully added."));
				if (window.opener && visualTaggingOptions.enabled) {
					allowlist = options.cssSelectorAllowlist;
					actionClickAllowlist = options.actionClickAllowlist;
					messenger = getOrCreateWindowMessenger();
					enableVisualTagging(messenger, {
						dataExtractor,
						isElementSelectable: createShouldTrackEvent(options, __spreadArray(__spreadArray([], __read$1(allowlist), false), __read$1(actionClickAllowlist), false)),
						cssSelectorAllowlist: allowlist,
						actionClickAllowlist
					});
					enableBackgroundCapture(messenger);
					/* istanbul ignore next */
					messenger.setup(__assign$1({ logger: config === null || config === void 0 ? void 0 : config.loggerProvider }, (config === null || config === void 0 ? void 0 : config.serverZone) && { endpoint: AMPLITUDE_ORIGINS_MAP[config.serverZone] }));
				}
				return [2];
			});
		});
	};
	var execute = function(event) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, event];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			var subscriptions_1, subscriptions_1_1, subscription;
			var e_1, _a;
			return __generator(this, function(_b) {
				try {
					for (subscriptions_1 = __values$1(subscriptions), subscriptions_1_1 = subscriptions_1.next(); !subscriptions_1_1.done; subscriptions_1_1 = subscriptions_1.next()) {
						subscription = subscriptions_1_1.value;
						subscription.unsubscribe();
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (subscriptions_1_1 && !subscriptions_1_1.done && (_a = subscriptions_1.return)) _a.call(subscriptions_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				return [2];
			});
		});
	};
	return {
		name,
		type,
		setup,
		execute,
		teardown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-dead-click.js
var DEAD_CLICK_TIMEOUT = 3e3;
var CHANGE_EVENTS = ["mutation", "navigate"];
function trackDeadClick(_a) {
	var amplitude = _a.amplitude, allObservables = _a.allObservables, getEventProperties = _a.getEventProperties, shouldTrackDeadClick = _a.shouldTrackDeadClick;
	var clickObservable = allObservables.clickObservable, mutationObservable = allObservables.mutationObservable, navigateObservable = allObservables.navigateObservable;
	var clicksAndChangeObservable = merge(clickObservable.filter(function(click) {
		return filterOutNonTrackableEvents(click) && shouldTrackDeadClick("click", click.closestTrackedAncestor) && click.event.target instanceof Element && click.event.target.closest("a[target=\"_blank\"]") === null && click.event.button === MouseButton.LEFT_OR_TOUCH_CONTACT;
	}), navigateObservable ? merge(mutationObservable, navigateObservable) : mutationObservable);
	var deadClickTimer = null;
	return asyncMap(clicksAndChangeObservable, function(event) {
		if (deadClickTimer && CHANGE_EVENTS.includes(event.type)) {
			clearTimeout(deadClickTimer);
			deadClickTimer = null;
			return Promise.resolve(null);
		} else if (event.type === "click") {
			if (deadClickTimer) return Promise.resolve(null);
			return new Promise(function(resolve) {
				deadClickTimer = setTimeout(function() {
					resolve(event);
					deadClickTimer = null;
				}, DEAD_CLICK_TIMEOUT);
			});
		}
		return Promise.resolve(null);
	}).subscribe(function(actionClick) {
		if (!actionClick) return;
		var deadClickEvent = {
			"[Amplitude] X": actionClick.event.clientX,
			"[Amplitude] Y": actionClick.event.clientY
		};
		amplitude.track(AMPLITUDE_ELEMENT_DEAD_CLICKED_EVENT, __assign$1(__assign$1({}, getEventProperties("click", actionClick.closestTrackedAncestor)), deadClickEvent), { time: actionClick.timestamp });
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-rage-click.js
var RAGE_CLICK_THRESHOLD = 4;
var RAGE_CLICK_WINDOW_MS = DEFAULT_RAGE_CLICK_WINDOW_MS;
var RAGE_CLICK_OUT_OF_BOUNDS_THRESHOLD = 50;
function addCoordinates(regionBox, click) {
	var _a, _b, _c, _d;
	var _e = click.event, pageX = _e.pageX, pageY = _e.pageY;
	regionBox.yMin = Math.min((_a = regionBox.yMin) !== null && _a !== void 0 ? _a : pageY, pageY);
	regionBox.yMax = Math.max((_b = regionBox.yMax) !== null && _b !== void 0 ? _b : pageY, pageY);
	regionBox.xMin = Math.min((_c = regionBox.xMin) !== null && _c !== void 0 ? _c : pageX, pageX);
	regionBox.xMax = Math.max((_d = regionBox.xMax) !== null && _d !== void 0 ? _d : pageX, pageX);
	regionBox.isOutOfBounds = regionBox.yMax - regionBox.yMin > RAGE_CLICK_OUT_OF_BOUNDS_THRESHOLD || regionBox.xMax - regionBox.xMin > RAGE_CLICK_OUT_OF_BOUNDS_THRESHOLD;
}
function getRageClickAnalyticsEvent(clickWindow) {
	/* istanbul ignore if */
	if (clickWindow.length === 0) return null;
	var firstClick = clickWindow[0];
	var lastClick = clickWindow[clickWindow.length - 1];
	return {
		rageClickEvent: __assign$1({
			"[Amplitude] Begin Time": new Date(firstClick.timestamp).toISOString(),
			"[Amplitude] End Time": new Date(lastClick.timestamp).toISOString(),
			"[Amplitude] Duration": lastClick.timestamp - firstClick.timestamp,
			"[Amplitude] Clicks": clickWindow.map(function(click) {
				return {
					X: click.event.pageX,
					Y: click.event.pageY,
					Time: click.timestamp
				};
			}),
			"[Amplitude] Click Count": clickWindow.length
		}, firstClick.targetElementProperties),
		time: firstClick.timestamp
	};
}
function isClickOutsideRageClickWindow(clickWindow, click) {
	var firstClick = clickWindow[Math.max(0, clickWindow.length - RAGE_CLICK_THRESHOLD + 1)];
	return click.timestamp - firstClick.timestamp >= RAGE_CLICK_WINDOW_MS;
}
function isNewElement(clickWindow, click) {
	return clickWindow.length > 0 && clickWindow[clickWindow.length - 1].closestTrackedAncestor !== click.closestTrackedAncestor;
}
function trackRageClicks(_a) {
	var _this = this;
	var amplitude = _a.amplitude, allObservables = _a.allObservables, shouldTrackRageClick = _a.shouldTrackRageClick;
	var clickObservable = allObservables.clickObservable, selectionObservable = allObservables.selectionObservable;
	var clickWindow = [];
	var clickBoundingBox = {};
	var pendingRageClick = null;
	function resetClickWindow(click) {
		clickWindow = [];
		clickBoundingBox = {};
		if (click) {
			addCoordinates(clickBoundingBox, click);
			clickWindow.push(click);
		}
	}
	var rageClickObservable = asyncMap(clickObservable.filter(function(click) {
		return shouldTrackRageClick("click", click.closestTrackedAncestor);
	}), function(click) {
		return __awaiter(_this, void 0, void 0, function() {
			var resolutionValue;
			return __generator(this, function(_a) {
				addCoordinates(clickBoundingBox, click);
				resolutionValue = null;
				if (clickWindow.length === 0 || isNewElement(clickWindow, click) || isClickOutsideRageClickWindow(clickWindow, click) || clickBoundingBox.isOutOfBounds) {
					if (pendingRageClick) resolutionValue = getRageClickAnalyticsEvent(clickWindow);
					resetClickWindow(click);
				} else clickWindow.push(click);
				if (pendingRageClick) {
					clearTimeout(pendingRageClick.timerId);
					pendingRageClick.resolve(resolutionValue);
					pendingRageClick = null;
				}
				if (clickWindow.length >= RAGE_CLICK_THRESHOLD) return [2, new Promise(function(resolve) {
					pendingRageClick = {
						resolve,
						timerId: setTimeout(function() {
							resolve(getRageClickAnalyticsEvent(clickWindow));
						}, RAGE_CLICK_WINDOW_MS)
					};
				})];
				return [2, null];
			});
		});
	});
	/* istanbul ignore next */
	var selectionSubscription = selectionObservable === null || selectionObservable === void 0 ? void 0 : selectionObservable.subscribe(function() {
		resetClickWindow();
	});
	var rageClickSubscription = rageClickObservable.subscribe(function(data) {
		/* istanbul ignore if */
		if (data === null) return;
		amplitude.track(AMPLITUDE_ELEMENT_RAGE_CLICKED_EVENT, data.rageClickEvent, { time: data.time });
	});
	return { unsubscribe: function() {
		rageClickSubscription.unsubscribe();
		/* istanbul ignore next */
		selectionSubscription === null || selectionSubscription === void 0 || selectionSubscription.unsubscribe();
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-error-click.js
var ERROR_CLICK_TIMEOUT = 2e3;
function trackErrorClicks(_a) {
	var amplitude = _a.amplitude, allObservables = _a.allObservables, shouldTrackErrorClick = _a.shouldTrackErrorClick;
	var clickObservable = allObservables.clickObservable, browserErrorObservable = allObservables.browserErrorObservable;
	var filteredClickObservable = clickObservable.filter(function(click) {
		return filterOutNonTrackableEvents(click) && shouldTrackErrorClick("click", click.closestTrackedAncestor) && click.event.target instanceof Element && click.event.target.closest("a[target=\"_blank\"]") === null && click.event.button === MouseButton.LEFT_OR_TOUCH_CONTACT;
	});
	var errorClickTimer = null;
	var latestClickEvent = null;
	var clearClickTimer = function() {
		if (errorClickTimer !== null) {
			clearTimeout(errorClickTimer);
			errorClickTimer = null;
		}
		latestClickEvent = null;
	};
	return merge(filteredClickObservable, browserErrorObservable).subscribe(function(event) {
		var _a;
		if (event.type === "click") {
			clearClickTimer();
			latestClickEvent = event;
			errorClickTimer = setTimeout(clearClickTimer, ERROR_CLICK_TIMEOUT);
			return;
		}
		if (event.type === "error" && latestClickEvent) {
			amplitude.track(AMPLITUDE_ELEMENT_ERROR_CLICKED_EVENT, __assign$1((_a = {}, _a["[Amplitude] Kind"] = event.event.kind, _a["[Amplitude] Message"] = event.event.message, _a["[Amplitude] Stack"] = event.event.stack, _a["[Amplitude] Filename"] = event.event.filename, _a["[Amplitude] Line Number"] = event.event.lineNumber, _a["[Amplitude] Column Number"] = event.event.columnNumber, _a), latestClickEvent.targetElementProperties));
			clearClickTimer();
		}
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-thrashed-cursor.js
var Direction;
(function(Direction) {
	Direction["INCREASING"] = "increasing";
	Direction["DECREASING"] = "decreasing";
})(Direction || (Direction = {}));
var Axis;
(function(Axis) {
	Axis["X"] = "x";
	Axis["Y"] = "y";
})(Axis || (Axis = {}));
var createMouseDirectionChangeObservable = function(_a) {
	var mouseMoveObservable = _a.allWindowObservables.mouseMoveObservable;
	return new import_zen_observable.default(function(observer) {
		var lastPosition = null;
		var xDirection = null;
		var yDirection = null;
		return mouseMoveObservable.subscribe(function(event) {
			var currentPosition = {
				x: event.clientX,
				y: event.clientY
			};
			if (lastPosition === null) {
				lastPosition = currentPosition;
				return;
			}
			if (currentPosition.x > lastPosition.x) {
				if (xDirection === Direction.DECREASING) observer.next(Axis.X);
				xDirection = Direction.INCREASING;
			} else if (currentPosition.x < lastPosition.x) {
				if (xDirection === Direction.INCREASING) observer.next(Axis.X);
				xDirection = Direction.DECREASING;
			}
			if (currentPosition.y > lastPosition.y) {
				if (yDirection === Direction.DECREASING) observer.next(Axis.Y);
				yDirection = Direction.INCREASING;
			} else if (currentPosition.y < lastPosition.y) {
				if (yDirection === Direction.INCREASING) observer.next(Axis.Y);
				yDirection = Direction.DECREASING;
			}
			lastPosition = currentPosition;
		});
	});
};
function addDirectionChange(directionChangeSeries) {
	var now = +Date.now();
	directionChangeSeries.startTime = directionChangeSeries.startTime || now;
	var changes = directionChangeSeries.changes, changesThreshold = directionChangeSeries.changesThreshold;
	changes.push(now);
	if (changes.length > changesThreshold) changes.shift();
}
function isThrashedCursor(directionChanges) {
	var changes = directionChanges.changes, changesThreshold = directionChanges.changesThreshold, thresholdMs = directionChanges.thresholdMs;
	if (changes.length < changesThreshold) return false;
	return changes[changes.length - 1] - changes[0] < thresholdMs;
}
function resetDirectionChangeSeries(directionChangeSeries) {
	directionChangeSeries.changes = [];
	directionChangeSeries.startTime = void 0;
}
function adjustWindow(directionChanges) {
	var changes = directionChanges.changes, thresholdMs = directionChanges.thresholdMs;
	var leftPtr = 0;
	var lastChange = changes[changes.length - 1];
	for (; leftPtr < changes.length; leftPtr++) if (lastChange - changes[leftPtr] < thresholdMs) break;
	if (leftPtr === 0) return;
	directionChanges.startTime = changes[leftPtr];
	directionChanges.changes.splice(0, leftPtr);
}
function getPendingThrashedCursor(directionChangesX, directionChangesY) {
	var startTime = void 0;
	if (isThrashedCursor(directionChangesX)) startTime = directionChangesX.startTime;
	if (isThrashedCursor(directionChangesY)) {
		var startTimeY = directionChangesY.startTime;
		if (startTimeY && (!startTime || startTimeY < startTime)) startTime = startTimeY;
	}
	return startTime;
}
var DEFAULT_THRESHOLD = 20;
var DEFAULT_WINDOW_MS = 2e3;
var createThrashedCursorObservable = function(_a) {
	var mouseDirectionChangeObservable = _a.mouseDirectionChangeObservable, _b = _a.directionChanges, directionChanges = _b === void 0 ? DEFAULT_THRESHOLD : _b, _c = _a.thresholdMs, thresholdMs = _c === void 0 ? DEFAULT_WINDOW_MS : _c;
	return new import_zen_observable.default(function(observer) {
		var xDirectionChanges = {
			changes: [],
			changesThreshold: directionChanges,
			thresholdMs
		};
		var yDirectionChanges = {
			changes: [],
			changesThreshold: directionChanges,
			thresholdMs
		};
		var pendingThrashedCursor = void 0;
		var timer = null;
		function emitPendingThrashedCursor() {
			if (pendingThrashedCursor !== void 0) {
				observer.next(pendingThrashedCursor);
				pendingThrashedCursor = void 0;
				if (timer !== null) clearTimeout(timer);
				resetDirectionChangeSeries(xDirectionChanges);
				resetDirectionChangeSeries(yDirectionChanges);
			}
		}
		return mouseDirectionChangeObservable.subscribe(function(axis) {
			if (timer !== null) clearTimeout(timer);
			addDirectionChange(axis === Axis.X ? xDirectionChanges : yDirectionChanges);
			var nextPendingThrashedCursor = getPendingThrashedCursor(xDirectionChanges, yDirectionChanges);
			if (nextPendingThrashedCursor) {
				pendingThrashedCursor = pendingThrashedCursor || nextPendingThrashedCursor;
				timer = setTimeout(function() {
					emitPendingThrashedCursor();
					timer = null;
				}, thresholdMs);
			} else emitPendingThrashedCursor();
			adjustWindow(xDirectionChanges);
			adjustWindow(yDirectionChanges);
			/* istanbul ignore next */
			return function() {
				/* istanbul ignore if */
				if (timer !== null) {
					clearTimeout(timer);
					timer = null;
				}
			};
		});
	});
};
var trackThrashedCursor = function(_a) {
	var amplitude = _a.amplitude, options = _a.options, allObservables = _a.allObservables, _b = _a.directionChanges, directionChanges = _b === void 0 ? DEFAULT_THRESHOLD : _b, _c = _a.thresholdMs, thresholdMs = _c === void 0 ? DEFAULT_WINDOW_MS : _c;
	return createThrashedCursorObservable({
		mouseDirectionChangeObservable: createMouseDirectionChangeObservable({ allWindowObservables: allObservables }),
		directionChanges,
		thresholdMs
	}).subscribe(function(time) {
		if (!isUrlAllowed(options)) return;
		amplitude.track(AMPLITUDE_THRASHED_CURSOR_EVENT, void 0, { time });
	});
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/frustration-plugin.js
/**
* Helper function to extract the css selector allowlist
* from the frustration interactions options for a specific
* autocapture feature.
*/
function getCssSelectorAllowlist(options, attribute, defaultAllowlist, enabled) {
	if (!enabled) return [];
	var config = options[attribute];
	if (typeof config === "object" && config !== null && "cssSelectorAllowlist" in config && Array.isArray(config.cssSelectorAllowlist)) return config.cssSelectorAllowlist;
	return defaultAllowlist;
}
var MINIMUM_THRASHED_CURSOR_DIRECTION_CHANGES = 5;
var MAXIMUM_THRASHED_CURSOR_THRESHOLD = 4e3;
var frustrationPlugin = function(options) {
	var _a;
	if (options === void 0) options = {};
	var name = FRUSTRATION_PLUGIN_NAME;
	var type = "enrichment";
	var subscriptions = [];
	var isErrorClicksEnabled = options.errorClicks !== false;
	if (!options.errorClicks) isErrorClicksEnabled = false;
	var deadClicksEnabled = options.deadClicks !== false && options.deadClicks !== null;
	var rageClicksEnabled = options.rageClicks !== false && options.rageClicks !== null;
	var thrashedCursorEnabled = options.thrashedCursor !== false && options.thrashedCursor !== null;
	if (!options.thrashedCursor) thrashedCursorEnabled = false;
	var rageCssSelectors = getCssSelectorAllowlist(options, "rageClicks", DEFAULT_RAGE_CLICK_ALLOWLIST, rageClicksEnabled);
	var deadCssSelectors = getCssSelectorAllowlist(options, "deadClicks", DEFAULT_DEAD_CLICK_ALLOWLIST, deadClicksEnabled);
	var errorCssSelectors = getCssSelectorAllowlist(options, "errorClicks", DEFAULT_ERROR_CLICK_ALLOWLIST, isErrorClicksEnabled);
	var dataAttributePrefix = (_a = options.dataAttributePrefix) !== null && _a !== void 0 ? _a : DEFAULT_DATA_ATTRIBUTE_PREFIX;
	var dataExtractor = new DataExtractor(options);
	var combinedCssSelectors = __spreadArray([], __read$1(new Set(__spreadArray(__spreadArray(__spreadArray([], __read$1(rageCssSelectors), false), __read$1(deadCssSelectors), false), __read$1(errorCssSelectors), false))), false);
	var createObservables = function() {
		var _a;
		var clickObservable = multicast(createClickObservable("pointerdown").map(function(click) {
			return dataExtractor.addAdditionalEventProperties(click, "click", combinedCssSelectors, dataAttributePrefix, true);
		}));
		var browserErrorObservables = multicast(createErrorObservable().map(function(error) {
			return dataExtractor.addTypeAndTimestamp(error, "error");
		}));
		var enrichedMutationObservable = multicast(createMutationObservable().map(function(mutation) {
			return dataExtractor.addAdditionalEventProperties(mutation, "mutation", combinedCssSelectors, dataAttributePrefix);
		}));
		var enrichedNavigateObservable;
		if (window.navigation) enrichedNavigateObservable = multicast(new import_zen_observable.default(function(observer) {
			var handler = function(event) {
				observer.next(__assign$1(__assign$1({}, event), { type: "navigate" }));
			};
			window.navigation.addEventListener("navigate", handler);
			return function() {
				window.navigation.removeEventListener("navigate", handler);
			};
		}).map(function(navigate) {
			return dataExtractor.addAdditionalEventProperties(navigate, "navigate", combinedCssSelectors, dataAttributePrefix);
		}));
		var selectionObservable = multicast(new import_zen_observable.default(function(observer) {
			var handler = function() {
				var el = document.activeElement;
				if (el && (el.tagName === "TEXTAREA" || el.tagName === "INPUT")) {
					var start = void 0;
					var end = void 0;
					try {
						start = el.selectionStart;
						end = el.selectionEnd;
						if (start === end) return;
					} catch (error) {
						return;
					}
					return observer.next();
				}
				var selection = window.getSelection();
				if (!selection || selection.isCollapsed) return;
				return observer.next();
			};
			window.document.addEventListener("selectionchange", handler);
			return function() {
				window.document.removeEventListener("selectionchange", handler);
			};
		}));
		var mouseMoveObservable = multicast(createMouseMoveObservable());
		return _a = {}, _a[ObservablesEnum$1.ClickObservable] = clickObservable, _a[ObservablesEnum$1.MutationObservable] = enrichedMutationObservable, _a[ObservablesEnum$1.NavigateObservable] = enrichedNavigateObservable, _a[ObservablesEnum$1.BrowserErrorObservable] = browserErrorObservables, _a[ObservablesEnum$1.SelectionObservable] = selectionObservable, _a[ObservablesEnum$1.MouseMoveObservable] = mouseMoveObservable, _a;
	};
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			var allObservables, shouldTrackRageClick, rageClickSubscription, shouldTrackDeadClick, deadClickSubscription, shouldTrackErrorClick, errorClickSubscription, directionChanges, thresholdMs, thrashedCursorSubscription;
			var _a;
			return __generator(this, function(_b) {
				/* istanbul ignore if */
				if (typeof document === "undefined") return [2];
				allObservables = createObservables();
				if (rageClicksEnabled) {
					shouldTrackRageClick = createShouldTrackEvent(options, rageCssSelectors);
					rageClickSubscription = trackRageClicks({
						allObservables,
						amplitude,
						shouldTrackRageClick
					});
					subscriptions.push(rageClickSubscription);
				}
				if (deadClicksEnabled) {
					shouldTrackDeadClick = createShouldTrackEvent(options, deadCssSelectors);
					deadClickSubscription = trackDeadClick({
						amplitude,
						allObservables,
						getEventProperties: function(actionType, element) {
							return dataExtractor.getEventProperties(actionType, element, dataAttributePrefix);
						},
						shouldTrackDeadClick
					});
					subscriptions.push(deadClickSubscription);
				}
				if (isErrorClicksEnabled) {
					shouldTrackErrorClick = createShouldTrackEvent(options, errorCssSelectors);
					errorClickSubscription = trackErrorClicks({
						amplitude,
						allObservables,
						shouldTrackErrorClick
					});
					subscriptions.push(errorClickSubscription);
				}
				if (thrashedCursorEnabled) {
					directionChanges = void 0, thresholdMs = void 0;
					if (typeof options.thrashedCursor === "object") {
						directionChanges = options.thrashedCursor.directionChanges;
						thresholdMs = options.thrashedCursor.threshold;
						if (directionChanges && directionChanges < MINIMUM_THRASHED_CURSOR_DIRECTION_CHANGES) {
							config.loggerProvider.warn("'thrashedCursor.directionChanges' of ".concat(directionChanges, " is below the minimum of ").concat(MINIMUM_THRASHED_CURSOR_DIRECTION_CHANGES, ", setting to ").concat(MINIMUM_THRASHED_CURSOR_DIRECTION_CHANGES));
							directionChanges = MINIMUM_THRASHED_CURSOR_DIRECTION_CHANGES;
						}
						if (thresholdMs && thresholdMs > MAXIMUM_THRASHED_CURSOR_THRESHOLD) {
							config.loggerProvider.warn("'thrashedCursor.threshold' of ".concat(thresholdMs, " is above the maximum of ").concat(MAXIMUM_THRASHED_CURSOR_THRESHOLD, ", setting to ").concat(MAXIMUM_THRASHED_CURSOR_THRESHOLD));
							thresholdMs = MAXIMUM_THRASHED_CURSOR_THRESHOLD;
						}
					}
					thrashedCursorSubscription = trackThrashedCursor({
						amplitude,
						options,
						allObservables,
						directionChanges,
						thresholdMs
					});
					subscriptions.push(thrashedCursorSubscription);
				}
				/* istanbul ignore next */
				(_a = config === null || config === void 0 ? void 0 : config.loggerProvider) === null || _a === void 0 || _a.log("".concat(name, " has been successfully added."));
				return [2];
			});
		});
	};
	var execute = function(event) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, event];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			var subscriptions_1, subscriptions_1_1, subscription;
			var e_1, _a;
			return __generator(this, function(_b) {
				try {
					for (subscriptions_1 = __values$1(subscriptions), subscriptions_1_1 = subscriptions_1.next(); !subscriptions_1_1.done; subscriptions_1_1 = subscriptions_1.next()) {
						subscription = subscriptions_1_1.value;
						subscription.unsubscribe();
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (subscriptions_1_1 && !subscriptions_1_1.done && (_a = subscriptions_1.return)) _a.call(subscriptions_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				return [2];
			});
		});
	};
	return {
		name,
		type,
		setup,
		execute,
		teardown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/autocapture/track-long-task.js
var DEFAULT_DURATION_THRESHOLD$1 = 100;
var MEASURE_BUFFER_WINDOW_MS = 1e4;
function getOverlappingMeasures(entry, measures) {
	var taskEnd = entry.startTime + entry.duration;
	return measures.filter(function(measure) {
		return measure.startTime < taskEnd && measure.startTime + measure.duration > entry.startTime;
	}).map(function(measure) {
		return measure.name;
	});
}
function buildLoAFProperties(entry, measures) {
	var _a;
	var overlappingMeasures = getOverlappingMeasures(entry, measures);
	var scripts = (_a = entry.scripts) !== null && _a !== void 0 ? _a : [];
	var scriptURLs = scripts.map(function(s) {
		return s.sourceURL;
	}).filter(Boolean);
	var scriptFunctions = scripts.map(function(s) {
		return s.sourceFunctionName;
	}).filter(Boolean);
	var scriptPositions = scripts.map(function(s) {
		return s.sourceCharPosition;
	}).filter(function(p) {
		return typeof p === "number" && p >= 0;
	});
	var invokerTypes = scripts.map(function(s) {
		return s.invokerType;
	}).filter(Boolean);
	var invokers = scripts.map(function(s) {
		return s.invoker;
	}).filter(Boolean);
	return __assign$1(__assign$1(__assign$1(__assign$1(__assign$1(__assign$1(__assign$1({
		"[Amplitude] Main Thread Block Source": "long-animation-frame",
		"[Amplitude] Main Thread Block Duration": entry.duration,
		"[Amplitude] Main Thread Block Blocking Duration": entry.blockingDuration,
		"[Amplitude] Main Thread Block Start Time": entry.startTime
	}, overlappingMeasures.length > 0 && { "[Amplitude] Main Thread Block Measures": overlappingMeasures }), {
		"[Amplitude] Main Thread Block Render Start": entry.renderStart,
		"[Amplitude] Main Thread Block Style And Layout Start": entry.styleAndLayoutStart,
		"[Amplitude] Main Thread Block Script Count": scripts.length
	}), scriptURLs.length > 0 && { "[Amplitude] Main Thread Block Script URLs": scriptURLs }), scriptFunctions.length > 0 && { "[Amplitude] Main Thread Block Script Functions": scriptFunctions }), scriptPositions.length > 0 && { "[Amplitude] Main Thread Block Script Positions": scriptPositions }), invokerTypes.length > 0 && { "[Amplitude] Main Thread Block Invoker Types": invokerTypes }), invokers.length > 0 && { "[Amplitude] Main Thread Block Invokers": invokers });
}
function buildLongTaskProperties(entry, measures) {
	var _a;
	var overlappingMeasures = getOverlappingMeasures(entry, measures);
	var attribution = (_a = entry.attribution) !== null && _a !== void 0 ? _a : [];
	return __assign$1(__assign$1({
		"[Amplitude] Main Thread Block Source": "long-task",
		"[Amplitude] Main Thread Block Duration": entry.duration,
		"[Amplitude] Main Thread Block Blocking Duration": entry.duration,
		"[Amplitude] Main Thread Block Start Time": entry.startTime
	}, overlappingMeasures.length > 0 && { "[Amplitude] Main Thread Block Measures": overlappingMeasures }), attribution.length > 0 && { "[Amplitude] Main Thread Block Attribution": attribution.map(function(a) {
		return a.name;
	}) });
}
function getSupportedEntryType() {
	/* istanbul ignore next */
	if (typeof PerformanceObserver === "undefined") return null;
	try {
		var supported = PerformanceObserver.supportedEntryTypes;
		if (supported.includes("long-animation-frame")) return "long-animation-frame";
		if (supported.includes("longtask")) return "longtask";
	} catch (_a) {}
	return null;
}
function trackMainThreadBlock(_a) {
	var amplitude = _a.amplitude, options = _a.options, _b = _a.durationThreshold, durationThreshold = _b === void 0 ? DEFAULT_DURATION_THRESHOLD$1 : _b;
	var entryType = getSupportedEntryType();
	/* istanbul ignore next */
	if (!entryType) return { unsubscribe: function() {} };
	var measures = [];
	var measureObserver = new PerformanceObserver(function(list) {
		var e_1, _a;
		var now = performance.now();
		try {
			for (var _b = __values$1(list.getEntries()), _c = _b.next(); !_c.done; _c = _b.next()) {
				var entry = _c.value;
				measures.push(entry);
			}
		} catch (e_1_1) {
			e_1 = { error: e_1_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_1) throw e_1.error;
			}
		}
		var cutoff = now - MEASURE_BUFFER_WINDOW_MS;
		while (measures.length > 0 && measures[0].startTime < cutoff) measures.shift();
	});
	try {
		measureObserver.observe({ entryTypes: ["measure"] });
	} catch (_c) {}
	var blockObserver = new PerformanceObserver(function(list) {
		var e_2, _a;
		try {
			for (var _b = __values$1(list.getEntries()), _c = _b.next(); !_c.done; _c = _b.next()) {
				var entry = _c.value;
				if (!isUrlAllowed(options)) return;
				if (entry.duration < durationThreshold) continue;
				var properties = entryType === "long-animation-frame" ? buildLoAFProperties(entry, measures) : buildLongTaskProperties(entry, measures);
				amplitude.track(AMPLITUDE_MAIN_THREAD_BLOCK_EVENT, properties);
			}
		} catch (e_2_1) {
			e_2 = { error: e_2_1 };
		} finally {
			try {
				if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
			} finally {
				if (e_2) throw e_2.error;
			}
		}
	});
	try {
		blockObserver.observe({ entryTypes: [entryType] });
	} catch (_d) {
		measureObserver.disconnect();
		return { unsubscribe: function() {} };
	}
	return { unsubscribe: function() {
		blockObserver.disconnect();
		measureObserver.disconnect();
	} };
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-autocapture-browser@1.27.1/node_modules/@amplitude/plugin-autocapture-browser/lib/esm/performance-plugin.js
var DEFAULT_DURATION_THRESHOLD = 100;
var performancePlugin = function(options) {
	if (options === void 0) options = {};
	var name = PERFORMANCE_PLUGIN_NAME;
	var type = "enrichment";
	var subscriptions = [];
	var mainThreadBlockEnabled = options.mainThreadBlock === true || typeof options.mainThreadBlock === "object" && options.mainThreadBlock !== null;
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			var durationThreshold, subscription;
			var _a;
			return __generator(this, function(_b) {
				/* istanbul ignore if */
				if (typeof document === "undefined") return [2];
				if (mainThreadBlockEnabled) {
					durationThreshold = DEFAULT_DURATION_THRESHOLD;
					if (typeof options.mainThreadBlock === "object" && options.mainThreadBlock.durationThreshold !== void 0) durationThreshold = options.mainThreadBlock.durationThreshold;
					subscription = trackMainThreadBlock({
						amplitude,
						options,
						durationThreshold
					});
					subscriptions.push(subscription);
				}
				/* istanbul ignore next */
				(_a = config === null || config === void 0 ? void 0 : config.loggerProvider) === null || _a === void 0 || _a.log("".concat(name, " performance tracking has been successfully added."));
				return [2];
			});
		});
	};
	var execute = function(event) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, event];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			var subscriptions_1, subscriptions_1_1, subscription;
			var e_1, _a;
			return __generator(this, function(_b) {
				try {
					for (subscriptions_1 = __values$1(subscriptions), subscriptions_1_1 = subscriptions_1.next(); !subscriptions_1_1.done; subscriptions_1_1 = subscriptions_1.next()) {
						subscription = subscriptions_1_1.value;
						subscription.unsubscribe();
					}
				} catch (e_1_1) {
					e_1 = { error: e_1_1 };
				} finally {
					try {
						if (subscriptions_1_1 && !subscriptions_1_1.done && (_a = subscriptions_1.return)) _a.call(subscriptions_1);
					} finally {
						if (e_1) throw e_1.error;
					}
				}
				return [2];
			});
		});
	};
	return {
		name,
		type,
		setup,
		execute,
		teardown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-network-capture-browser@1.10.0/node_modules/@amplitude/plugin-network-capture-browser/lib/esm/constants.js
var PLUGIN_NAME$1 = "@amplitude/plugin-network-capture-browser";
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-network-capture-browser@1.10.0/node_modules/@amplitude/plugin-network-capture-browser/lib/esm/track-network-event.js
var DEFAULT_STATUS_CODE_RANGE = "500-599";
function wildcardMatch(str, pattern) {
	var regexPattern = "^" + pattern.replace(/[-[\]{}()+?.,\\^$|#\s]/g, "\\$&").replace(/\*/g, ".*") + "$";
	return new RegExp(regexPattern).test(str);
}
function isStatusCodeInRange(statusCode, range) {
	var e_1, _a;
	var ranges = range.split(",");
	try {
		for (var ranges_1 = __values$1(ranges), ranges_1_1 = ranges_1.next(); !ranges_1_1.done; ranges_1_1 = ranges_1.next()) {
			var r = ranges_1_1.value;
			var _b = __read$1(r.split("-").map(Number), 2), start = _b[0], end = _b[1];
			if (statusCode === start && end === void 0) return true;
			if (statusCode >= start && statusCode <= end) return true;
		}
	} catch (e_1_1) {
		e_1 = { error: e_1_1 };
	} finally {
		try {
			if (ranges_1_1 && !ranges_1_1.done && (_a = ranges_1.return)) _a.call(ranges_1);
		} finally {
			if (e_1) throw e_1.error;
		}
	}
	return false;
}
function isCaptureRuleMatch(rule, hostname, status, url, method) {
	if (rule.hosts && !rule.hosts.find(function(host) {
		return wildcardMatch(hostname, host);
	})) return;
	if (url && rule.urls && !isUrlMatchAllowlist(url, rule.urls)) return;
	if (method && rule.methods && !rule.methods.find(function(allowedMethod) {
		return method.toLowerCase() === allowedMethod.toLowerCase() || allowedMethod === "*";
	})) return;
	if (status || status === 0) {
		if (!isStatusCodeInRange(status, rule.statusCodeRange || DEFAULT_STATUS_CODE_RANGE)) return false;
	}
	return true;
}
function parseUrl(url) {
	var _a;
	if (!url) return;
	try {
		/* istanbul ignore next */
		var currentHref = (_a = getGlobalScope()) === null || _a === void 0 ? void 0 : _a.location.href;
		var urlObj = new URL(url, currentHref);
		var query = urlObj.searchParams.toString();
		var fragment = urlObj.hash.replace("#", "");
		var href = urlObj.href;
		var host = urlObj.host;
		urlObj.hash = "";
		urlObj.search = "";
		return {
			query,
			fragment,
			href,
			hrefWithoutQueryOrHash: urlObj.href,
			host
		};
	} catch (e) {
		/* istanbul ignore next */
		return;
	}
}
function isAmplitudeNetworkRequestEvent(host, requestWrapper) {
	if (host.includes("amplitude.com")) try {
		var body = requestWrapper.body;
		if (typeof body !== "string") return false;
		if (JSON.parse(body).events.find(function(event) {
			return event.event_type === "[Amplitude] Network Request";
		})) return true;
	} catch (e) {}
	return false;
}
/**
* Takes a user provided header capture rule and returns a
* HeaderCaptureRule object that sets proper default values.
*
* @param rule - The header capture rule to parse.
* @returns A HeaderCaptureRule object.
*/
function parseHeaderCaptureRule(rule) {
	if (typeof rule !== "object" || rule === null) {
		if (rule) return __spreadArray([], __read$1(SAFE_HEADERS), false);
		else if (rule === void 0) return void 0;
		return;
	}
	if (rule.length === 0) return;
	return rule;
}
function isBodyCaptureRuleEmpty(rule) {
	var _a, _b, _c;
	/* istanbul ignore next */
	return !((_a = rule === null || rule === void 0 ? void 0 : rule.allowlist) === null || _a === void 0 ? void 0 : _a.length) && !((_b = rule === null || rule === void 0 ? void 0 : rule.blocklist) === null || _b === void 0 ? void 0 : _b.length) && !((_c = rule === null || rule === void 0 ? void 0 : rule.excludelist) === null || _c === void 0 ? void 0 : _c.length);
}
function shouldTrackNetworkEvent(networkEvent, options) {
	var _a;
	if (options === void 0) options = {};
	var urlObj = parseUrl(networkEvent.url);
	/* istanbul ignore if */
	if (!urlObj)
 /* istanbul ignore next */
	return false;
	var host = urlObj.host;
	if (options.ignoreAmplitudeRequests !== false && (wildcardMatch(host, "*.amplitude.com") || wildcardMatch(host, "amplitude.com"))) return false;
	if ((_a = options.ignoreHosts) === null || _a === void 0 ? void 0 : _a.find(function(ignoreHost) {
		return wildcardMatch(host, ignoreHost);
	})) return false;
	if (!options.captureRules && networkEvent.status !== void 0 && !isStatusCodeInRange(networkEvent.status, DEFAULT_STATUS_CODE_RANGE)) return false;
	if (options.captureRules) {
		var isMatch_1;
		__spreadArray([], __read$1(options.captureRules), false).reverse().find(function(rule) {
			isMatch_1 = isCaptureRuleMatch(rule, host, networkEvent.status, networkEvent.url, networkEvent.method);
			if (isMatch_1) {
				var responseHeadersRule = parseHeaderCaptureRule(rule.responseHeaders);
				if (networkEvent.responseWrapper && responseHeadersRule) {
					var responseHeaders = networkEvent.responseWrapper.headers(responseHeadersRule);
					if (responseHeaders) networkEvent.responseHeaders = responseHeaders;
				}
				var requestHeadersRule = parseHeaderCaptureRule(rule.requestHeaders);
				if (networkEvent.requestWrapper && requestHeadersRule) {
					var requestHeaders = networkEvent.requestWrapper.headers(requestHeadersRule);
					if (requestHeaders) networkEvent.requestHeaders = requestHeaders;
				}
				if (networkEvent.responseWrapper && rule.responseBody && !isBodyCaptureRuleEmpty(rule.responseBody)) {
					var excludelist = rule.responseBody.excludelist || rule.responseBody.blocklist;
					networkEvent.responseBodyJson = networkEvent.responseWrapper.json(rule.responseBody.allowlist, excludelist);
				}
				if (networkEvent.requestWrapper && rule.requestBody && !isBodyCaptureRuleEmpty(rule.requestBody)) {
					var excludelist = rule.requestBody.excludelist || rule.requestBody.blocklist;
					networkEvent.requestBodyJson = networkEvent.requestWrapper.json(rule.requestBody.allowlist, excludelist);
				}
			}
			return isMatch_1 !== void 0;
		});
		if (!isMatch_1) return false;
	}
	if (networkEvent.requestWrapper && isAmplitudeNetworkRequestEvent(host, networkEvent.requestWrapper)) return false;
	return true;
}
function logNetworkAnalyticsEvent(networkAnalyticsEvent, request, amplitude, loggerProvider) {
	return __awaiter(this, void 0, void 0, function() {
		var _a, requestBody, responseBody;
		return __generator(this, function(_b) {
			switch (_b.label) {
				case 0:
					if (!(request.requestBodyJson || request.responseBodyJson)) return [3, 2];
					return [4, Promise.all([request.requestBodyJson, request.responseBodyJson])];
				case 1:
					_a = __read$1.apply(void 0, [_b.sent(), 2]), requestBody = _a[0], responseBody = _a[1];
					if (requestBody) try {
						networkAnalyticsEvent["[Amplitude] Request Body"] = JSON.stringify(requestBody);
					} catch (e) {
						/* istanbul ignore next */
						loggerProvider === null || loggerProvider === void 0 || loggerProvider.debug("Failed to stringify request body", e);
					}
					if (responseBody) try {
						networkAnalyticsEvent["[Amplitude] Response Body"] = JSON.stringify(responseBody);
					} catch (e) {
						/* istanbul ignore next */
						loggerProvider === null || loggerProvider === void 0 || loggerProvider.debug("Failed to stringify response body");
					}
					_b.label = 2;
				case 2:
					/* istanbul ignore next */
					amplitude === null || amplitude === void 0 || amplitude.track("[Amplitude] Network Request", networkAnalyticsEvent);
					return [2];
			}
		});
	});
}
function trackNetworkEvents(_a) {
	var allObservables = _a.allObservables, networkTrackingOptions = _a.networkTrackingOptions, amplitude = _a.amplitude, loggerProvider = _a.loggerProvider;
	return allObservables.networkObservable.filter(function(event) {
		return shouldTrackNetworkEvent(event.event, networkTrackingOptions);
	}).subscribe(function(networkEvent) {
		var _a;
		var _b, _c;
		var request = networkEvent.event;
		var urlObj = parseUrl(request.url);
		/* istanbul ignore if */
		if (!urlObj)
 /* istanbul ignore next */
		return;
		var responseBodySize = (_b = request.responseWrapper) === null || _b === void 0 ? void 0 : _b.bodySize;
		/* istanbul ignore next */
		var requestBodySize = (_c = request.requestWrapper) === null || _c === void 0 ? void 0 : _c.bodySize;
		logNetworkAnalyticsEvent((_a = {}, _a["[Amplitude] URL"] = urlObj.hrefWithoutQueryOrHash, _a["[Amplitude] URL Query"] = urlObj.query, _a["[Amplitude] URL Fragment"] = urlObj.fragment, _a["[Amplitude] Request Method"] = request.method, _a["[Amplitude] Status Code"] = request.status, _a["[Amplitude] Start Time"] = request.startTime, _a["[Amplitude] Completion Time"] = request.endTime, _a["[Amplitude] Duration"] = request.duration, _a["[Amplitude] Request Body Size"] = requestBodySize, _a["[Amplitude] Response Body Size"] = responseBodySize, _a["[Amplitude] Request Type"] = request.type, _a["[Amplitude] Request Headers"] = request.requestHeaders, _a["[Amplitude] Response Headers"] = request.responseHeaders, _a), request, amplitude, loggerProvider);
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-network-capture-browser@1.10.0/node_modules/@amplitude/plugin-network-capture-browser/lib/esm/network-capture-plugin.js
var ObservablesEnum;
(function(ObservablesEnum) {
	ObservablesEnum["NetworkObservable"] = "networkObservable";
})(ObservablesEnum || (ObservablesEnum = {}));
var subscription;
var networkCapturePlugin = function(options) {
	if (options === void 0) options = {};
	var name = PLUGIN_NAME$1;
	var type = "enrichment";
	var logger;
	var addAdditionalEventProperties = function(event, type) {
		return {
			event,
			timestamp: Date.now(),
			type
		};
	};
	var createObservables = function() {
		var _a;
		var networkObservable = new import_zen_observable.default(function(observer) {
			var callback = new NetworkEventCallback(function(event) {
				var eventWithProperties = addAdditionalEventProperties(event, "network");
				observer.next(eventWithProperties);
			});
			networkObserver.subscribe(callback, logger);
			return function() {
				networkObserver.unsubscribe(callback);
			};
		});
		return _a = {}, _a[ObservablesEnum.NetworkObservable] = networkObservable, _a;
	};
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			var allObservables;
			return __generator(this, function(_a) {
				/* istanbul ignore if */
				if (typeof document === "undefined") return [2];
				allObservables = createObservables();
				/* istanbul ignore next */
				logger = config === null || config === void 0 ? void 0 : config.loggerProvider;
				subscription = trackNetworkEvents({
					allObservables,
					networkTrackingOptions: options,
					amplitude,
					loggerProvider: logger
				});
				/* istanbul ignore next */
				logger === null || logger === void 0 || logger.log("".concat(name, " has been successfully added."));
				return [2];
			});
		});
	};
	/* istanbul ignore next */
	var execute = function(event) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, event];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				subscription.unsubscribe();
				return [2];
			});
		});
	};
	return {
		name,
		type,
		setup,
		execute,
		teardown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-web-vitals-browser@1.1.32/node_modules/@amplitude/plugin-web-vitals-browser/lib/esm/constants.js
var PLUGIN_NAME = "web-vitals-browser";
var WEB_VITALS_EVENT_NAME = "[Amplitude] Web Vitals";
//#endregion
//#region ../../node_modules/.pnpm/web-vitals@5.1.0/node_modules/web-vitals/dist/web-vitals.js
var e = -1;
var t = (t) => {
	addEventListener("pageshow", ((n) => {
		n.persisted && (e = n.timeStamp, t(n));
	}), !0);
}, n = (e, t, n, i) => {
	let s, o;
	return (r) => {
		t.value >= 0 && (r || i) && (o = t.value - (s ?? 0), (o || void 0 === s) && (s = t.value, t.delta = o, t.rating = ((e, t) => e > t[1] ? "poor" : e > t[0] ? "needs-improvement" : "good")(t.value, n), e(t)));
	};
}, i = (e) => {
	requestAnimationFrame((() => requestAnimationFrame((() => e()))));
}, s = () => {
	const e = performance.getEntriesByType("navigation")[0];
	if (e && e.responseStart > 0 && e.responseStart < performance.now()) return e;
}, o = () => {
	return s()?.activationStart ?? 0;
}, r = (t, n = -1) => {
	const i = s();
	let r = "navigate";
	e >= 0 ? r = "back-forward-cache" : i && (document.prerendering || o() > 0 ? r = "prerender" : document.wasDiscarded ? r = "restore" : i.type && (r = i.type.replace(/_/g, "-")));
	return {
		name: t,
		value: n,
		rating: "good",
		delta: 0,
		entries: [],
		id: `v5-${Date.now()}-${Math.floor(8999999999999 * Math.random()) + 0xe8d4a51000}`,
		navigationType: r
	};
}, c = /* @__PURE__ */ new WeakMap();
function a(e, t) {
	return c.get(e) || c.set(e, new t()), c.get(e);
}
var d = class {
	t;
	i = 0;
	o = [];
	h(e) {
		if (e.hadRecentInput) return;
		const t = this.o[0], n = this.o.at(-1);
		this.i && t && n && e.startTime - n.startTime < 1e3 && e.startTime - t.startTime < 5e3 ? (this.i += e.value, this.o.push(e)) : (this.i = e.value, this.o = [e]), this.t?.(e);
	}
};
var h = (e, t, n = {}) => {
	try {
		if (PerformanceObserver.supportedEntryTypes.includes(e)) {
			const i = new PerformanceObserver(((e) => {
				Promise.resolve().then((() => {
					t(e.getEntries());
				}));
			}));
			return i.observe({
				type: e,
				buffered: !0,
				...n
			}), i;
		}
	} catch {}
}, f = (e) => {
	let t = !1;
	return () => {
		t || (e(), t = !0);
	};
};
var u = -1;
var l = /* @__PURE__ */ new Set(), m = () => "hidden" !== document.visibilityState || document.prerendering ? Infinity : 0, p = (e) => {
	if ("hidden" === document.visibilityState) {
		if ("visibilitychange" === e.type) for (const e of l) e();
		isFinite(u) || (u = "visibilitychange" === e.type ? e.timeStamp : 0, removeEventListener("prerenderingchange", p, !0));
	}
}, v = () => {
	if (u < 0) {
		const e = o();
		u = (document.prerendering ? void 0 : globalThis.performance.getEntriesByType("visibility-state").filter(((t) => "hidden" === t.name && t.startTime > e))[0]?.startTime) ?? m(), addEventListener("visibilitychange", p, !0), addEventListener("prerenderingchange", p, !0), t((() => {
			setTimeout((() => {
				u = m();
			}));
		}));
	}
	return {
		get firstHiddenTime() {
			return u;
		},
		onHidden(e) {
			l.add(e);
		}
	};
}, g = (e) => {
	document.prerendering ? addEventListener("prerenderingchange", (() => e()), !0) : e();
}, y = [1800, 3e3], E = (e, s = {}) => {
	g((() => {
		const c = v();
		let a, d = r("FCP");
		const f = h("paint", ((e) => {
			for (const t of e) "first-contentful-paint" === t.name && (f.disconnect(), t.startTime < c.firstHiddenTime && (d.value = Math.max(t.startTime - o(), 0), d.entries.push(t), a(!0)));
		}));
		f && (a = n(e, d, y, s.reportAllChanges), t(((t) => {
			d = r("FCP"), a = n(e, d, y, s.reportAllChanges), i((() => {
				d.value = performance.now() - t.timeStamp, a(!0);
			}));
		})));
	}));
}, b = [.1, .25], L = (e, s = {}) => {
	const o = v();
	E(f((() => {
		let c, f = r("CLS", 0);
		const u = a(s, d), l = (e) => {
			for (const t of e) u.h(t);
			u.i > f.value && (f.value = u.i, f.entries = u.o, c());
		}, m = h("layout-shift", l);
		m && (c = n(e, f, b, s.reportAllChanges), o.onHidden((() => {
			l(m.takeRecords()), c(!0);
		})), t((() => {
			u.i = 0, f = r("CLS", 0), c = n(e, f, b, s.reportAllChanges), i((() => c()));
		})), setTimeout(c));
	})));
};
var P = 0, T = Infinity, _ = 0;
var M = (e) => {
	for (const t of e) t.interactionId && (T = Math.min(T, t.interactionId), _ = Math.max(_, t.interactionId), P = _ ? (_ - T) / 7 + 1 : 0);
};
var w;
var C = () => w ? P : performance.interactionCount ?? 0, I = () => {
	"interactionCount" in performance || w || (w = h("event", M, {
		type: "event",
		buffered: !0,
		durationThreshold: 0
	}));
};
var F = 0;
var k = class {
	u = [];
	l = /* @__PURE__ */ new Map();
	m;
	p;
	v() {
		F = C(), this.u.length = 0, this.l.clear();
	}
	L() {
		const e = Math.min(this.u.length - 1, Math.floor((C() - F) / 50));
		return this.u[e];
	}
	h(e) {
		if (this.m?.(e), !e.interactionId && "first-input" !== e.entryType) return;
		const t = this.u.at(-1);
		let n = this.l.get(e.interactionId);
		if (n || this.u.length < 10 || e.duration > t.P) {
			if (n ? e.duration > n.P ? (n.entries = [e], n.P = e.duration) : e.duration === n.P && e.startTime === n.entries[0].startTime && n.entries.push(e) : (n = {
				id: e.interactionId,
				entries: [e],
				P: e.duration
			}, this.l.set(n.id, n), this.u.push(n)), this.u.sort(((e, t) => t.P - e.P)), this.u.length > 10) {
				const e = this.u.splice(10);
				for (const t of e) this.l.delete(t.id);
			}
			this.p?.(n);
		}
	}
};
var A = (e) => {
	const t = globalThis.requestIdleCallback || setTimeout;
	"hidden" === document.visibilityState ? e() : (e = f(e), addEventListener("visibilitychange", e, {
		once: !0,
		capture: !0
	}), t((() => {
		e(), removeEventListener("visibilitychange", e, { capture: !0 });
	})));
}, B = [200, 500], S = (e, i = {}) => {
	if (!globalThis.PerformanceEventTiming || !("interactionId" in PerformanceEventTiming.prototype)) return;
	const s = v();
	g((() => {
		I();
		let o, c = r("INP");
		const d = a(i, k), f = (e) => {
			A((() => {
				for (const t of e) d.h(t);
				const t = d.L();
				t && t.P !== c.value && (c.value = t.P, c.entries = t.entries, o());
			}));
		}, u = h("event", f, { durationThreshold: i.durationThreshold ?? 40 });
		o = n(e, c, B, i.reportAllChanges), u && (u.observe({
			type: "first-input",
			buffered: !0
		}), s.onHidden((() => {
			f(u.takeRecords()), o(!0);
		})), t((() => {
			d.v(), c = r("INP"), o = n(e, c, B, i.reportAllChanges);
		})));
	}));
};
var N = class {
	m;
	h(e) {
		this.m?.(e);
	}
};
var q = [2500, 4e3], x = (e, s = {}) => {
	g((() => {
		const c = v();
		let d, u = r("LCP");
		const l = a(s, N), m = (e) => {
			s.reportAllChanges || (e = e.slice(-1));
			for (const t of e) l.h(t), t.startTime < c.firstHiddenTime && (u.value = Math.max(t.startTime - o(), 0), u.entries = [t], d());
		}, p = h("largest-contentful-paint", m);
		if (p) {
			d = n(e, u, q, s.reportAllChanges);
			const o = f((() => {
				m(p.takeRecords()), p.disconnect(), d(!0);
			})), c = (e) => {
				e.isTrusted && (A(o), removeEventListener(e.type, c, { capture: !0 }));
			};
			for (const e of [
				"keydown",
				"click",
				"visibilitychange"
			]) addEventListener(e, c, { capture: !0 });
			t(((t) => {
				u = r("LCP"), d = n(e, u, q, s.reportAllChanges), i((() => {
					u.value = performance.now() - t.timeStamp, d(!0);
				}));
			}));
		}
	}));
}, H = [800, 1800], O = (e) => {
	document.prerendering ? g((() => O(e))) : "complete" !== document.readyState ? addEventListener("load", (() => O(e)), !0) : setTimeout(e);
}, $ = (e, i = {}) => {
	let c = r("TTFB"), a = n(e, c, H, i.reportAllChanges);
	O((() => {
		const d = s();
		d && (c.value = Math.max(d.responseStart - o(), 0), c.entries = [d], a(!0), t((() => {
			c = r("TTFB", 0), a = n(e, c, H, i.reportAllChanges), a(!0);
		})));
	}));
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-web-vitals-browser@1.1.32/node_modules/@amplitude/plugin-web-vitals-browser/lib/esm/web-vitals-plugin.js
function getMetricStartTime(metric) {
	var _a;
	/* istanbul ignore next */
	var startTime = ((_a = metric.entries[0]) === null || _a === void 0 ? void 0 : _a.startTime) || 0;
	return performance.timeOrigin + startTime;
}
function processMetric(metric) {
	return {
		value: metric.value,
		rating: metric.rating,
		delta: metric.delta,
		navigationType: metric.navigationType,
		id: metric.id,
		timestamp: Math.floor(getMetricStartTime(metric)),
		navigationStart: Math.floor(performance.timeOrigin)
	};
}
var webVitalsPlugin = function() {
	var visibilityListener = null;
	var globalScope = getGlobalScope();
	var doc = globalScope === null || globalScope === void 0 ? void 0 : globalScope.document;
	var location = globalScope === null || globalScope === void 0 ? void 0 : globalScope.location;
	var setup = function(config, amplitude) {
		return __awaiter(void 0, void 0, void 0, function() {
			var locationHref, webVitalsPayload;
			return __generator(this, function(_a) {
				if (doc === void 0) return [2];
				locationHref = getDecodeURI(
					/* istanbul ignore next */
					(location === null || location === void 0 ? void 0 : location.href) || "",
					config.loggerProvider
				);
				webVitalsPayload = {
					"[Amplitude] Page Domain": (location === null || location === void 0 ? void 0 : location.hostname) || "",
					"[Amplitude] Page Location": locationHref,
					"[Amplitude] Page Path": getDecodeURI(
						/* istanbul ignore next */
						(location === null || location === void 0 ? void 0 : location.pathname) || "",
						config.loggerProvider
					),
					"[Amplitude] Page Title": typeof document !== "undefined" && document.title || "",
					"[Amplitude] Page URL": getDecodeURI(locationHref.split("?")[0], config.loggerProvider)
				};
				x(function(metric) {
					webVitalsPayload["[Amplitude] LCP"] = processMetric(metric);
				});
				E(function(metric) {
					webVitalsPayload["[Amplitude] FCP"] = processMetric(metric);
				});
				S(function(metric) {
					webVitalsPayload["[Amplitude] INP"] = processMetric(metric);
				});
				L(function(metric) {
					webVitalsPayload["[Amplitude] CLS"] = processMetric(metric);
				});
				$(function(metric) {
					webVitalsPayload["[Amplitude] TTFB"] = processMetric(metric);
				});
				visibilityListener = function() {
					if (doc.visibilityState === "hidden" && visibilityListener) {
						amplitude.track(WEB_VITALS_EVENT_NAME, webVitalsPayload);
						doc.removeEventListener("visibilitychange", visibilityListener);
						visibilityListener = null;
					}
				};
				doc.addEventListener("visibilitychange", visibilityListener);
				return [2];
			});
		});
	};
	var execute = function(event) {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				return [2, event];
			});
		});
	};
	var teardown = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			return __generator(this, function(_a) {
				if (visibilityListener)
 /* istanbul ignore next */
				doc === null || doc === void 0 || doc.removeEventListener("visibilitychange", visibilityListener);
				return [2];
			});
		});
	};
	return {
		name: PLUGIN_NAME,
		type: "enrichment",
		setup,
		execute,
		teardown
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/attribution/web-attribution.js
var WebAttribution = function() {
	function WebAttribution(options, config) {
		var _a;
		this.shouldTrackNewCampaign = false;
		this.options = __assign$1({
			initialEmptyValue: "EMPTY",
			resetSessionOnNewCampaign: false,
			excludeReferrers: getDefaultExcludedReferrers(((_a = config.cookieOptions) === null || _a === void 0 ? void 0 : _a.domain) || config.topLevelDomain),
			optOut: config.optOut
		}, options);
		this.storage = config.cookieStorage;
		this.storageKey = getStorageKey(config.apiKey, "MKTG");
		this.webExpStorageKey = getStorageKey(config.apiKey, "MKTG_ORIGINAL");
		this.currentCampaign = BASE_CAMPAIGN$1;
		this.sessionTimeout = config.sessionTimeout;
		this.lastEventTime = config.lastEventTime;
		this.logger = config.loggerProvider;
		this.topLevelDomain = config.topLevelDomain;
		config.loggerProvider.log("Installing web attribution tracking.");
	}
	WebAttribution.prototype.init = function() {
		return __awaiter(this, void 0, void 0, function() {
			var isEventInNewSession;
			var _a;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						if (this.options.optOut) return [2];
						return [4, this.fetchCampaign()];
					case 1:
						_a = __read$1.apply(void 0, [_b.sent(), 2]), this.currentCampaign = _a[0], this.previousCampaign = _a[1];
						isEventInNewSession = !this.lastEventTime ? true : isNewSession(this.sessionTimeout, this.lastEventTime);
						if (!isNewCampaign(this.currentCampaign, this.previousCampaign, this.options, this.logger, isEventInNewSession, this.topLevelDomain)) return [3, 3];
						this.shouldTrackNewCampaign = true;
						return [4, this.storage.set(this.storageKey, this.currentCampaign)];
					case 2:
						_b.sent();
						_b.label = 3;
					case 3: return [2];
				}
			});
		});
	};
	WebAttribution.prototype.fetchCampaign = function() {
		return __awaiter(this, void 0, void 0, function() {
			var originalCampaign;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, this.storage.get(this.webExpStorageKey)];
					case 1:
						originalCampaign = _a.sent();
						if (!originalCampaign) return [3, 3];
						return [4, this.storage.remove(this.webExpStorageKey)];
					case 2:
						_a.sent();
						_a.label = 3;
					case 3: return [4, Promise.all([originalCampaign || new CampaignParser$1().parse(), this.storage.get(this.storageKey)])];
					case 4: return [2, _a.sent()];
				}
			});
		});
	};
	/**
	* This can be called when enable web attribution and either
	* 1. set a new session
	* 2. has new campaign and enable resetSessionOnNewCampaign
	*/
	WebAttribution.prototype.generateCampaignEvent = function(event_id) {
		this.shouldTrackNewCampaign = false;
		var campaignEvent = createCampaignEvent(this.currentCampaign, this.options);
		if (event_id) campaignEvent.event_id = event_id;
		return campaignEvent;
	};
	WebAttribution.prototype.shouldSetSessionIdOnNewCampaign = function() {
		return this.shouldTrackNewCampaign && !!this.options.resetSessionOnNewCampaign;
	};
	return WebAttribution;
}();
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-event-property-attribution-browser@0.2.0/node_modules/@amplitude/plugin-event-property-attribution-browser/lib/esm/event-property-tracking.js
var ATTRIBUTION_EVENT_TYPE = "[Amplitude] Attribution";
var EVENT_PROPERTY_EXCLUDED_EVENT_TYPES = new Set([SpecialEventType.IDENTIFY, SpecialEventType.GROUP_IDENTIFY]);
var toEventPropertyCampaign = function(campaign) {
	return omitUndefined(campaign);
};
var eventPropertyTrackingPlugin = function(options) {
	var _a;
	if (options === void 0) options = {};
	var fallbackAttributionEvent = (_a = options.fallbackAttributionEvent) !== null && _a !== void 0 ? _a : false;
	var globalScope = getGlobalScope();
	var amplitude;
	var loggerProvider;
	var eventPropertyCampaign = {};
	var isTracking = false;
	var isProxied = false;
	var originalPushState;
	var originalReplaceState;
	var installedPushState;
	var installedReplaceState;
	var updateCampaignState = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			var currentCampaign;
			return __generator(this, function(_a) {
				switch (_a.label) {
					case 0: return [4, new CampaignParser().parse()];
					case 1:
						currentCampaign = _a.sent();
						eventPropertyCampaign = toEventPropertyCampaign(currentCampaign);
						if (fallbackAttributionEvent) {
							/* istanbul ignore next */
							loggerProvider === null || loggerProvider === void 0 || loggerProvider.log("Tracking attribution fallback event.");
							/* istanbul ignore next */
							amplitude === null || amplitude === void 0 || amplitude.track(ATTRIBUTION_EVENT_TYPE, eventPropertyCampaign);
						}
						return [2];
				}
			});
		});
	};
	var onHistoryChange = function() {
		updateCampaignState();
	};
	var createHistoryStateProxy = function(method) {
		return new Proxy(method, { apply: function(target, thisArg, args) {
			Reflect.apply(target, thisArg, args);
			if (isTracking) onHistoryChange();
		} });
	};
	return {
		name: "@amplitude/plugin-event-property-attribution-browser",
		type: "enrichment",
		setup: function(config, client) {
			return __awaiter(void 0, void 0, void 0, function() {
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0:
							amplitude = client;
							loggerProvider = config.loggerProvider;
							isTracking = true;
							loggerProvider.log("Installing event property attribution tracking.");
							return [4, updateCampaignState()];
						case 1:
							_a.sent();
							if (!globalScope) return [2];
							globalScope.addEventListener("popstate", onHistoryChange);
							if (!isProxied) {
								originalPushState = Reflect.get(globalScope.history, "pushState");
								originalReplaceState = Reflect.get(globalScope.history, "replaceState");
								/* istanbul ignore next */
								if (!originalPushState || !originalReplaceState) return [2];
								installedPushState = createHistoryStateProxy(originalPushState);
								globalScope.history.pushState = installedPushState;
								installedReplaceState = createHistoryStateProxy(originalReplaceState);
								globalScope.history.replaceState = installedReplaceState;
								isProxied = true;
							}
							return [2];
					}
				});
			});
		},
		execute: function(event) {
			return __awaiter(void 0, void 0, void 0, function() {
				return __generator(this, function(_a) {
					if (EVENT_PROPERTY_EXCLUDED_EVENT_TYPES.has(event.event_type)) return [2, event];
					event.event_properties = __assign$1(__assign$1({}, eventPropertyCampaign), event.event_properties);
					return [2, event];
				});
			});
		},
		teardown: function() {
			return __awaiter(void 0, void 0, void 0, function() {
				var currentPushState, currentReplaceState;
				return __generator(this, function(_a) {
					if (globalScope) {
						globalScope.removeEventListener("popstate", onHistoryChange);
						currentPushState = Reflect.get(globalScope.history, "pushState");
						currentReplaceState = Reflect.get(globalScope.history, "replaceState");
						if (isProxied && currentPushState === installedPushState && originalPushState) globalScope.history.pushState = originalPushState;
						if (isProxied && currentReplaceState === installedReplaceState && originalReplaceState) globalScope.history.replaceState = originalReplaceState;
					}
					isTracking = false;
					isProxied = false;
					originalPushState = void 0;
					originalReplaceState = void 0;
					installedPushState = void 0;
					installedReplaceState = void 0;
					eventPropertyCampaign = {};
					return [2];
				});
			});
		}
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-page-url-enrichment-browser@0.7.9/node_modules/@amplitude/plugin-page-url-enrichment-browser/lib/esm/page-url-enrichment.js
var CURRENT_PAGE_STORAGE_KEY = "AMP_CURRENT_PAGE";
var PREVIOUS_PAGE_STORAGE_KEY = "AMP_PREVIOUS_PAGE";
var URL_INFO_STORAGE_KEY = "AMP_URL_INFO";
var PreviousPageType;
(function(PreviousPageType) {
	PreviousPageType["Direct"] = "direct";
	PreviousPageType["Internal"] = "internal";
	PreviousPageType["External"] = "external";
})(PreviousPageType || (PreviousPageType = {}));
var EXCLUDED_DEFAULT_EVENT_TYPES = new Set([
	SpecialEventType.IDENTIFY,
	SpecialEventType.GROUP_IDENTIFY,
	SpecialEventType.REVENUE
]);
var pageUrlEnrichmentPlugin = function(_a) {
	var _c = (_a === void 0 ? {} : _a).internalDomains, internalDomains = _c === void 0 ? [] : _c;
	var globalScope = getGlobalScope();
	var sessionStorage = void 0;
	var isStorageEnabled = false;
	var loggerProvider = void 0;
	var isProxied = false;
	var isTracking = false;
	var getHostname = function(url) {
		var hostname;
		try {
			var decodedUrl = getDecodeURI(url, loggerProvider);
			hostname = new URL(decodedUrl).hostname;
		} catch (e) {
			/* istanbul ignore next */
			loggerProvider === null || loggerProvider === void 0 || loggerProvider.error("Could not parse URL: ", e);
		}
		return hostname;
	};
	var getPrevPageType = function(previousPage) {
		var currentDomain = typeof location !== "undefined" && location.hostname || "";
		var previousPageDomain = previousPage ? getHostname(previousPage) : void 0;
		if (!previousPageDomain) return PreviousPageType.Direct;
		var isCurrentInternal = internalDomains.some(function(domain) {
			return currentDomain.indexOf(domain) !== -1;
		});
		var isPrevInternal = internalDomains.some(function(domain) {
			return previousPageDomain.indexOf(domain) !== -1;
		});
		if (currentDomain === previousPageDomain || isPrevInternal && isCurrentInternal) return PreviousPageType.Internal;
		return PreviousPageType.External;
	};
	var saveURLInfo = function() {
		return __awaiter(void 0, void 0, void 0, function() {
			var URLInfo, currentURL, storedCurrentURL, previousURL;
			var _a;
			return __generator(this, function(_b) {
				switch (_b.label) {
					case 0:
						if (!(sessionStorage && isStorageEnabled)) return [3, 3];
						return [4, sessionStorage.get(URL_INFO_STORAGE_KEY)];
					case 1:
						URLInfo = _b.sent();
						currentURL = getDecodeURI(typeof location !== "undefined" && location.href || "");
						storedCurrentURL = (URLInfo === null || URLInfo === void 0 ? void 0 : URLInfo["AMP_CURRENT_PAGE"]) || "";
						previousURL = void 0;
						if (currentURL === storedCurrentURL) previousURL = (URLInfo === null || URLInfo === void 0 ? void 0 : URLInfo["AMP_PREVIOUS_PAGE"]) || "";
						else if (storedCurrentURL) previousURL = storedCurrentURL;
						else previousURL = document.referrer || "";
						return [4, sessionStorage.set(URL_INFO_STORAGE_KEY, (_a = {}, _a[CURRENT_PAGE_STORAGE_KEY] = currentURL, _a[PREVIOUS_PAGE_STORAGE_KEY] = previousURL, _a))];
					case 2:
						_b.sent();
						_b.label = 3;
					case 3: return [2];
				}
			});
		});
	};
	var saveUrlInfoWrapper = function() {
		saveURLInfo();
	};
	return {
		name: "@amplitude/plugin-page-url-enrichment-browser",
		type: "enrichment",
		setup: function(config, _) {
			return __awaiter(void 0, void 0, void 0, function() {
				var _a;
				return __generator(this, function(_b) {
					switch (_b.label) {
						case 0:
							loggerProvider = config.loggerProvider;
							loggerProvider.log("Installing @amplitude/plugin-page-url-enrichment-browser");
							isTracking = true;
							if (!globalScope) return [3, 2];
							try {
								sessionStorage = new BrowserStorage(globalScope.sessionStorage);
							} catch (error) {
								/* istanbul ignore next */
								loggerProvider === null || loggerProvider === void 0 || loggerProvider.debug("sessionStorage is not available in this environment.");
							}
							return [4, sessionStorage === null || sessionStorage === void 0 ? void 0 : sessionStorage.isEnabled()];
						case 1:
							isStorageEnabled = (_a = _b.sent()) !== null && _a !== void 0 ? _a : false;
							globalScope.addEventListener("popstate", saveUrlInfoWrapper);
							if (!isProxied) {
								/* istanbul ignore next */
								globalScope.history.pushState = new Proxy(globalScope.history.pushState, { apply: function(target, thisArg, _a) {
									var _b = __read$1(_a, 3), state = _b[0], unused = _b[1], url = _b[2];
									target.apply(thisArg, [
										state,
										unused,
										url
									]);
									if (isTracking) saveUrlInfoWrapper();
								} });
								globalScope.history.replaceState = new Proxy(globalScope.history.replaceState, { apply: function(target, thisArg, _a) {
									var _b = __read$1(_a, 3), state = _b[0], unused = _b[1], url = _b[2];
									target.apply(thisArg, [
										state,
										unused,
										url
									]);
									if (isTracking) saveUrlInfoWrapper();
								} });
								isProxied = true;
							}
							_b.label = 2;
						case 2: return [2];
					}
				});
			});
		},
		execute: function(event) {
			return __awaiter(void 0, void 0, void 0, function() {
				var locationHREF, URLInfo, updatedURLInfo, previousPage;
				var _a;
				return __generator(this, function(_b) {
					switch (_b.label) {
						case 0:
							locationHREF = getDecodeURI(typeof location !== "undefined" && location.href || "");
							if (!(sessionStorage && isStorageEnabled)) return [3, 5];
							return [4, sessionStorage.get(URL_INFO_STORAGE_KEY)];
						case 1:
							URLInfo = _b.sent();
							if (!!(URLInfo === null || URLInfo === void 0 ? void 0 : URLInfo["AMP_CURRENT_PAGE"])) return [3, 3];
							return [4, sessionStorage.set(URL_INFO_STORAGE_KEY, (_a = {}, _a[CURRENT_PAGE_STORAGE_KEY] = locationHREF, _a[PREVIOUS_PAGE_STORAGE_KEY] = document.referrer || "", _a))];
						case 2:
							_b.sent();
							_b.label = 3;
						case 3: return [4, sessionStorage.get(URL_INFO_STORAGE_KEY)];
						case 4:
							updatedURLInfo = _b.sent();
							previousPage = "";
							if (updatedURLInfo) previousPage = updatedURLInfo["AMP_PREVIOUS_PAGE"] || "";
							if (EXCLUDED_DEFAULT_EVENT_TYPES.has(event.event_type)) return [2, event];
							event.event_properties = __assign$1(__assign$1({}, event.event_properties || {}), {
								"[Amplitude] Page Domain": addIfNotExist(event, "[Amplitude] Page Domain", typeof location !== "undefined" && location.hostname || ""),
								"[Amplitude] Page Location": addIfNotExist(event, "[Amplitude] Page Location", locationHREF),
								"[Amplitude] Page Path": addIfNotExist(event, "[Amplitude] Page Path", typeof location !== "undefined" && getDecodeURI(location.pathname) || ""),
								"[Amplitude] Page Title": addIfNotExist(event, "[Amplitude] Page Title", getPageTitle(replaceSensitiveString)),
								"[Amplitude] Page URL": addIfNotExist(event, "[Amplitude] Page URL", locationHREF.split("?")[0]),
								"[Amplitude] Previous Page Location": previousPage,
								"[Amplitude] Previous Page Type": getPrevPageType(previousPage)
							});
							_b.label = 5;
						case 5: return [2, event];
					}
				});
			});
		},
		teardown: function() {
			return __awaiter(void 0, void 0, void 0, function() {
				return __generator(this, function(_a) {
					switch (_a.label) {
						case 0:
							if (globalScope) {
								globalScope.removeEventListener("popstate", saveUrlInfoWrapper);
								isTracking = false;
							}
							if (!(sessionStorage && isStorageEnabled)) return [3, 2];
							return [4, sessionStorage.set(URL_INFO_STORAGE_KEY, {})];
						case 1:
							_a.sent();
							_a.label = 2;
						case 2: return [2];
					}
				});
			});
		}
	};
};
function addIfNotExist(event, key, value) {
	if (!event.event_properties) event.event_properties = {};
	if (event.event_properties[key] === void 0) return value;
	return event.event_properties[key];
}
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+plugin-custom-enrichment-browser@0.1.8/node_modules/@amplitude/plugin-custom-enrichment-browser/lib/esm/custom-enrichment.js
var customEnrichmentPlugin = function() {
	var loggerProvider;
	var unsubscribe;
	var enrichEvent;
	function isCustomEnrichmentConfig(config) {
		if (typeof config !== "object" || config === null) return false;
		return "body" in config && typeof config.body === "string";
	}
	function createEnrichEvent(body) {
		if (body) try {
			var fn = new Function("return " + body)();
			if (typeof fn === "function") return fn;
			loggerProvider === null || loggerProvider === void 0 || loggerProvider.error("Custom enrichment body did not evaluate to a function");
		} catch (error) {
			loggerProvider === null || loggerProvider === void 0 || loggerProvider.error("Could not create custom enrichment function", error);
		}
		return function(event) {
			return event;
		};
	}
	return {
		name: "@amplitude/plugin-custom-enrichment-browser",
		type: "enrichment",
		setup: function(config, _) {
			return __awaiter(void 0, void 0, void 0, function() {
				var subscriptionId_1;
				var _a;
				return __generator(this, function(_b) {
					loggerProvider = config.loggerProvider;
					loggerProvider === null || loggerProvider === void 0 || loggerProvider.log("Installing @amplitude/plugin-custom-enrichment-browser");
					if ((_a = config.remoteConfig) === null || _a === void 0 ? void 0 : _a.fetchRemoteConfig) if (!config.remoteConfigClient) loggerProvider === null || loggerProvider === void 0 || loggerProvider.debug("Remote config client is not provided, skipping remote config fetch");
					else {
						subscriptionId_1 = config.remoteConfigClient.subscribe("configs.analyticsSDK.browserSDK.customEnrichment", "all", function(remoteConfig) {
							if (remoteConfig && isCustomEnrichmentConfig(remoteConfig)) enrichEvent = createEnrichEvent(remoteConfig.body || "");
							else enrichEvent = createEnrichEvent("");
						});
						unsubscribe = function() {
							var _a;
							return (_a = config.remoteConfigClient) === null || _a === void 0 ? void 0 : _a.unsubscribe(subscriptionId_1);
						};
					}
					return [2];
				});
			});
		},
		execute: function(event) {
			return __awaiter(void 0, void 0, void 0, function() {
				var _a;
				return __generator(this, function(_b) {
					if (enrichEvent) try {
						return [2, (_a = enrichEvent(event)) !== null && _a !== void 0 ? _a : null];
					} catch (error) {
						loggerProvider === null || loggerProvider === void 0 || loggerProvider.error("Could not execute custom enrichment function", error);
						return [2, event];
					}
					return [2, event];
				});
			});
		},
		teardown: function() {
			return __awaiter(void 0, void 0, void 0, function() {
				return __generator(this, function(_a) {
					if (unsubscribe) unsubscribe();
					return [2];
				});
			});
		}
	};
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/attribution/tracking-methods.js
var USER_PROPERTY_TRACKING_METHOD = "userProperty";
var EVENT_PROPERTY_TRACKING_METHOD = "eventProperty";
var isTrackingMethod = function(value) {
	return value === "userProperty" || value === "eventProperty";
};
/**
* Normalizes attribution tracking methods from runtime config, drops unsupported values,
* and falls back to the legacy default when nothing valid is provided.
*/
var normalizeTrackingMethod = function(trackingMethod) {
	var normalized = __spreadArray([], __read$1(new Set((Array.isArray(trackingMethod) ? trackingMethod : [trackingMethod]).filter(isTrackingMethod))), false);
	return normalized.length > 0 ? normalized : [USER_PROPERTY_TRACKING_METHOD];
};
var hasTrackingMethod = function(options, trackingMethod) {
	return normalizeTrackingMethod(options.trackingMethod).includes(trackingMethod);
};
var isUserPropertyAttributionEnabled = function(options) {
	return hasTrackingMethod(options, USER_PROPERTY_TRACKING_METHOD);
};
var isEventPropertyAttributionEnabled = function(options) {
	return hasTrackingMethod(options, EVENT_PROPERTY_TRACKING_METHOD);
};
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/browser-client.js
var UNSPECIFIED_SESSION_ID = -1;
/**
* Exported for `@amplitude/unified` or integration with blade plugins.
* If you only use `@amplitude/analytics-browser`, use `amplitude.init()` or `amplitude.createInstance()` instead.
*/
var AmplitudeBrowser = function(_super) {
	__extends(AmplitudeBrowser, _super);
	function AmplitudeBrowser() {
		var _this = _super !== null && _super.apply(this, arguments) || this;
		_this._diagnosticsSampleRate = 0;
		return _this;
	}
	AmplitudeBrowser.prototype.init = function(apiKey, userIdOrOptions, maybeOptions) {
		if (apiKey === void 0) apiKey = "";
		var userId;
		var options;
		if (arguments.length > 2) {
			userId = userIdOrOptions;
			options = maybeOptions;
		} else if (typeof userIdOrOptions === "string") {
			userId = userIdOrOptions;
			options = void 0;
		} else {
			userId = userIdOrOptions === null || userIdOrOptions === void 0 ? void 0 : userIdOrOptions.userId;
			options = userIdOrOptions;
		}
		return returnWrapper(this._init(__assign$1(__assign$1({}, options), {
			userId,
			apiKey
		})));
	};
	AmplitudeBrowser.prototype._init = function(options) {
		var _a, _b, _c, _d, _e, _f, _g, _h;
		return __awaiter(this, void 0, void 0, function() {
			var fetchRemoteConfig, loggerProvider, serverZone, remoteConfigClient, diagnosticsSampleRate, enableDiagnostics, diagnosticsClient, browserOptions, attributionTrackingOptions, queryParams, ampTimestamp, isWithinTimeLimit, querySessionId, deferredSessionId, connector;
			var _this = this;
			return __generator(this, function(_j) {
				switch (_j.label) {
					case 0:
						if (this.initializing) return [2];
						this.initializing = true;
						fetchRemoteConfig = shouldFetchRemoteConfig(options);
						loggerProvider = (_a = options.loggerProvider) !== null && _a !== void 0 ? _a : new Logger();
						if (!options.loggerProvider) loggerProvider.enable((_b = options.logLevel) !== null && _b !== void 0 ? _b : LogLevel.Warn);
						serverZone = (_c = options.serverZone) !== null && _c !== void 0 ? _c : "US";
						diagnosticsSampleRate = this._diagnosticsSampleRate;
						enableDiagnostics = (_d = options.enableDiagnostics) !== null && _d !== void 0 ? _d : true;
						if (!fetchRemoteConfig) return [3, 2];
						remoteConfigClient = new RemoteConfigClient(
							options.apiKey,
							loggerProvider,
							serverZone,
							/* istanbul ignore next */
							(_e = options.remoteConfig) === null || _e === void 0 ? void 0 : _e.serverUrl
						);
						return [4, new Promise(function(resolve) {
							// istanbul ignore next
							remoteConfigClient === null || remoteConfigClient === void 0 || remoteConfigClient.subscribe("configs.diagnostics.browserSDK", "all", function(remoteConfig, source, lastFetch) {
								loggerProvider.debug("Diagnostics remote configuration received:", JSON.stringify({
									remoteConfig,
									source,
									lastFetch
								}, null, 2));
								if (remoteConfig) {
									var sampleRate = remoteConfig.sampleRate;
									if (typeof sampleRate === "number" && !isNaN(sampleRate)) diagnosticsSampleRate = sampleRate;
									var enabled = remoteConfig.enabled;
									if (typeof enabled === "boolean") enableDiagnostics = enabled;
								}
								resolve();
							});
						})];
					case 1:
						_j.sent();
						_j.label = 2;
					case 2:
						diagnosticsClient = new DiagnosticsClient(options.apiKey, loggerProvider, serverZone, {
							enabled: enableDiagnostics,
							sampleRate: diagnosticsSampleRate
						});
						diagnosticsClient.setTag("library", "".concat(LIBPREFIX, "/").concat(VERSION$1));
						if (typeof navigator !== "undefined") diagnosticsClient.setTag("user_agent", navigator.userAgent);
						return [4, useBrowserConfig(options.apiKey, options, this, diagnosticsClient, {
							loggerProvider,
							serverZone,
							enableDiagnostics,
							diagnosticsSampleRate
						})];
					case 3:
						browserOptions = _j.sent();
						if (!(fetchRemoteConfig && remoteConfigClient)) return [3, 5];
						return [4, new Promise(function(resolve) {
							// istanbul ignore next
							remoteConfigClient === null || remoteConfigClient === void 0 || remoteConfigClient.subscribe("configs.analyticsSDK.browserSDK", "all", function(remoteConfig, source, lastFetch) {
								browserOptions.loggerProvider.debug("Remote configuration received:", JSON.stringify({
									remoteConfig,
									source,
									lastFetch
								}, null, 2));
								if (remoteConfig) updateBrowserConfigWithRemoteConfig(remoteConfig, browserOptions);
								resolve();
							});
						})];
					case 4:
						_j.sent();
						_j.label = 5;
					case 5: return [4, _super.prototype._init.call(this, browserOptions)];
					case 6:
						_j.sent();
						this.logBrowserOptions(browserOptions);
						this.config.remoteConfigClient = remoteConfigClient;
						attributionTrackingOptions = getAttributionTrackingConfig(this.config);
						if (!(isAttributionTrackingEnabled(this.config.defaultTracking) && isUserPropertyAttributionEnabled(attributionTrackingOptions))) return [3, 8];
						if (this.config.optOut) this.timeline.addOptOutListener(function(optOut) {
							return __awaiter(_this, void 0, void 0, function() {
								return __generator(this, function(_a) {
									switch (_a.label) {
										case 0:
											if (!!optOut) return [3, 2];
											this.webAttribution = new WebAttribution(attributionTrackingOptions, this.config);
											return [4, this.webAttribution.init()];
										case 1:
											_a.sent();
											_a.label = 2;
										case 2: return [2];
									}
								});
							});
						});
						this.webAttribution = new WebAttribution(attributionTrackingOptions, this.config);
						return [4, this.webAttribution.init()];
					case 7:
						_j.sent();
						_j.label = 8;
					case 8:
						queryParams = getQueryParams$1();
						ampTimestamp = queryParams.ampTimestamp ? Number(queryParams.ampTimestamp) : void 0;
						isWithinTimeLimit = ampTimestamp ? Date.now() < ampTimestamp : true;
						querySessionId = isWithinTimeLimit && !Number.isNaN(Number(queryParams.ampSessionId)) ? Number(queryParams.ampSessionId) : void 0;
						deferredSessionId = this.config.deferredSessionId;
						if (deferredSessionId === UNSPECIFIED_SESSION_ID && !this.config.optOut) deferredSessionId = Date.now();
						this.setSessionId((_h = (_g = (_f = options.sessionId) !== null && _f !== void 0 ? _f : querySessionId) !== null && _g !== void 0 ? _g : deferredSessionId) !== null && _h !== void 0 ? _h : this.config.sessionId);
						if (this.config.optOut) this.timeline.addOptOutListener(function(optOut) {
							return __awaiter(_this, void 0, void 0, function() {
								return __generator(this, function(_a) {
									if (!optOut && this.config.deferredSessionId) if (this.config.deferredSessionId === UNSPECIFIED_SESSION_ID) this.setSessionId(void 0);
									else this.setSessionId(this.config.deferredSessionId);
									return [2];
								});
							});
						});
						connector = getAnalyticsConnector(options.instanceName);
						connector.identityStore.setIdentity({
							userId: this.config.userId,
							deviceId: this.config.deviceId
						});
						if (!(this.config.offline !== null)) return [3, 10];
						return [4, this.add(networkConnectivityCheckerPlugin()).promise];
					case 9:
						_j.sent();
						_j.label = 10;
					case 10: return [4, this.add(new Destination({ diagnosticsClient })).promise];
					case 11:
						_j.sent();
						return [4, this.add(new Context()).promise];
					case 12:
						_j.sent();
						return [4, this.add(new IdentityEventSender()).promise];
					case 13:
						_j.sent();
						detNotify(this.config);
						if (!isFileDownloadTrackingEnabled(this.config.defaultTracking)) return [3, 15];
						this.config.loggerProvider.debug("Adding file download tracking plugin");
						return [4, this.add(fileDownloadTracking()).promise];
					case 14:
						_j.sent();
						_j.label = 15;
					case 15:
						if (!isFormInteractionTrackingEnabled(this.config.defaultTracking)) return [3, 17];
						this.config.loggerProvider.debug("Adding form interaction plugin");
						return [4, this.add(formInteractionTracking()).promise];
					case 16:
						_j.sent();
						_j.label = 17;
					case 17:
						if (!isPageViewTrackingEnabled(this.config.defaultTracking)) return [3, 20];
						if (!!this.config.optOut) return [3, 19];
						this.config.loggerProvider.debug("Adding page view tracking plugin");
						return [4, this.add(pageViewTrackingPlugin(getPageViewTrackingConfig(this.config))).promise];
					case 18:
						_j.sent();
						return [3, 20];
					case 19:
						this.timeline.addOptOutListener(function(optOut) {
							return __awaiter(_this, void 0, void 0, function() {
								return __generator(this, function(_a) {
									switch (_a.label) {
										case 0:
											/* istanbul ignore if */
											if (optOut) return [2];
											this.config.loggerProvider.debug("Adding page view tracking plugin");
											return [4, this.add(pageViewTrackingPlugin(getPageViewTrackingConfig(this.config))).promise];
										case 1:
											_a.sent();
											return [2];
									}
								});
							});
						});
						_j.label = 20;
					case 20:
						if (!(isAttributionTrackingEnabled(this.config.defaultTracking) && isEventPropertyAttributionEnabled(attributionTrackingOptions))) return [3, 22];
						this.config.loggerProvider.debug("Adding event property attribution plugin");
						return [4, this.add(eventPropertyTrackingPlugin(attributionTrackingOptions)).promise];
					case 21:
						_j.sent();
						_j.label = 22;
					case 22:
						if (!isElementInteractionsEnabled(this.config.autocapture)) return [3, 24];
						this.config.loggerProvider.debug("Adding user interactions plugin (autocapture plugin)");
						return [4, this.add(autocapturePlugin(getElementInteractionsConfig(this.config), { diagnosticsClient })).promise];
					case 23:
						_j.sent();
						_j.label = 24;
					case 24:
						if (!isFrustrationInteractionsEnabled(this.config.autocapture)) return [3, 26];
						this.config.loggerProvider.debug("Adding frustration interactions plugin");
						return [4, this.add(frustrationPlugin(getFrustrationInteractionsConfig(this.config))).promise];
					case 25:
						_j.sent();
						_j.label = 26;
					case 26:
						if (!isNetworkTrackingEnabled(this.config.autocapture)) return [3, 28];
						this.config.loggerProvider.debug("Adding network tracking plugin");
						return [4, this.add(networkCapturePlugin(getNetworkTrackingConfig(this.config))).promise];
					case 27:
						_j.sent();
						_j.label = 28;
					case 28:
						if (!isWebVitalsEnabled(this.config.autocapture)) return [3, 30];
						this.config.loggerProvider.debug("Adding web vitals plugin");
						return [4, this.add(webVitalsPlugin()).promise];
					case 29:
						_j.sent();
						_j.label = 30;
					case 30:
						if (!isPerformanceTrackingEnabled(this.config.autocapture)) return [3, 32];
						this.config.loggerProvider.debug("Adding performance tracking plugin");
						return [4, this.add(performancePlugin(getPerformanceTrackingConfig(this.config))).promise];
					case 31:
						_j.sent();
						_j.label = 32;
					case 32:
						if (!isPageUrlEnrichmentEnabled(this.config.autocapture)) return [3, 34];
						this.config.loggerProvider.debug("Adding referrer page url plugin");
						return [4, this.add(pageUrlEnrichmentPlugin()).promise];
					case 33:
						_j.sent();
						_j.label = 34;
					case 34:
						if (!isCustomEnrichmentEnabled(this.config.customEnrichment)) return [3, 36];
						this.config.loggerProvider.debug("Adding custom enrichment plugin");
						return [4, this.add(customEnrichmentPlugin()).promise];
					case 35:
						_j.sent();
						_j.label = 36;
					case 36:
						this.initializing = false;
						return [4, this.runQueuedFunctions("dispatchQ")];
					case 37:
						_j.sent();
						connector.eventBridge.setEventReceiver(function(event) {
							var _a = event.eventProperties || {}, time = _a.time, cleanEventProperties = __rest(_a, ["time"]);
							var eventOptions = typeof time === "number" ? { time } : void 0;
							_this.track(event.eventType, cleanEventProperties, eventOptions);
						});
						return [2];
				}
			});
		});
	};
	AmplitudeBrowser.prototype.getUserId = function() {
		var _a;
		return (_a = this.config) === null || _a === void 0 ? void 0 : _a.userId;
	};
	AmplitudeBrowser.prototype.setUserId = function(userId) {
		if (!this.config) {
			this.q.push(this.setUserId.bind(this, userId));
			return;
		}
		this.config.loggerProvider.debug("function setUserId: ", userId);
		if (userId !== this.config.userId || userId === void 0) {
			this.config.userId = userId;
			this.timeline.onIdentityChanged({ userId });
			setConnectorUserId(userId, this.config.instanceName);
		}
	};
	AmplitudeBrowser.prototype.getDeviceId = function() {
		var _a;
		return (_a = this.config) === null || _a === void 0 ? void 0 : _a.deviceId;
	};
	AmplitudeBrowser.prototype.setDeviceId = function(deviceId) {
		if (!this.config) {
			this.q.push(this.setDeviceId.bind(this, deviceId));
			return;
		}
		this.config.loggerProvider.debug("function setDeviceId: ", deviceId);
		if (deviceId !== this.config.deviceId) {
			this.config.deviceId = deviceId;
			this.timeline.onIdentityChanged({ deviceId });
			setConnectorDeviceId(deviceId, this.config.instanceName);
		}
	};
	AmplitudeBrowser.prototype.reset = function() {
		this.setDeviceId(UUID$1());
		this.setUserId(void 0);
		this.timeline.onReset();
	};
	AmplitudeBrowser.prototype.getIdentity = function() {
		var _a, _b;
		return {
			deviceId: (_a = this.config) === null || _a === void 0 ? void 0 : _a.deviceId,
			userId: (_b = this.config) === null || _b === void 0 ? void 0 : _b.userId,
			userProperties: this.userProperties
		};
	};
	AmplitudeBrowser.prototype.setIdentity = function(identity) {
		var e_1, _a;
		var _b;
		if ("userId" in identity) this.setUserId(identity.userId);
		if ("deviceId" in identity && identity.deviceId) this.setDeviceId(identity.deviceId);
		if ("userProperties" in identity) {
			this.userProperties = identity.userProperties;
			var identifyObj = new Identify();
			// istanbul ignore next
			var userProperties = (_b = identity.userProperties) !== null && _b !== void 0 ? _b : {};
			try {
				for (var _c = __values$1(Object.entries(userProperties)), _d = _c.next(); !_d.done; _d = _c.next()) {
					var _e = __read$1(_d.value, 2), key = _e[0], value = _e[1];
					identifyObj.set(key, value);
				}
			} catch (e_1_1) {
				e_1 = { error: e_1_1 };
			} finally {
				try {
					if (_d && !_d.done && (_a = _c.return)) _a.call(_c);
				} finally {
					if (e_1) throw e_1.error;
				}
			}
			this.identify(identifyObj);
		}
	};
	AmplitudeBrowser.prototype.getOptOut = function() {
		var _a;
		return (_a = this.config) === null || _a === void 0 ? void 0 : _a.optOut;
	};
	AmplitudeBrowser.prototype.getSessionId = function() {
		var _a;
		return (_a = this.config) === null || _a === void 0 ? void 0 : _a.sessionId;
	};
	AmplitudeBrowser.prototype.setSessionId = function(sessionId) {
		var _a;
		var promises = [];
		if (!this.config) {
			this.q.push(this.setSessionId.bind(this, sessionId));
			return returnWrapper(Promise.resolve());
		}
		if (this.config.optOut) {
			this.config.deferredSessionId = sessionId !== null && sessionId !== void 0 ? sessionId : UNSPECIFIED_SESSION_ID;
			return returnWrapper(Promise.resolve());
		}
		if (sessionId === void 0) sessionId = Date.now();
		if (sessionId === this.config.sessionId) return returnWrapper(Promise.resolve());
		this.config.loggerProvider.debug("function setSessionId: ", sessionId);
		var previousSessionId = this.getSessionId();
		if (previousSessionId !== sessionId) this.timeline.onSessionIdChanged(sessionId);
		var lastEventTime = this.config.lastEventTime;
		var lastEventId = (_a = this.config.lastEventId) !== null && _a !== void 0 ? _a : -1;
		this.config.sessionId = sessionId;
		this.config.lastEventTime = void 0;
		this.config.pageCounter = 0;
		if (isSessionTrackingEnabled(this.config.defaultTracking)) {
			if (previousSessionId && lastEventTime) promises.push(this.track(DEFAULT_SESSION_END_EVENT, void 0, {
				device_id: this.previousSessionDeviceId,
				event_id: ++lastEventId,
				session_id: previousSessionId,
				time: lastEventTime + 1,
				user_id: this.previousSessionUserId
			}).promise);
			this.config.lastEventTime = this.config.sessionId;
		}
		var isCampaignEventTracked = this.trackCampaignEventIfNeeded(++lastEventId, promises);
		if (this.config.identify) promises.push(this.track(createIdentifyEvent(this.config.identify)).promise);
		if (isSessionTrackingEnabled(this.config.defaultTracking)) promises.push(this.track(DEFAULT_SESSION_START_EVENT, void 0, {
			event_id: isCampaignEventTracked ? ++lastEventId : lastEventId,
			session_id: this.config.sessionId,
			time: this.config.lastEventTime
		}).promise);
		this.previousSessionDeviceId = this.config.deviceId;
		this.previousSessionUserId = this.config.userId;
		return returnWrapper(Promise.all(promises));
	};
	AmplitudeBrowser.prototype.extendSession = function() {
		if (!this.config) {
			this.q.push(this.extendSession.bind(this));
			return;
		}
		this.config.lastEventTime = Date.now();
	};
	AmplitudeBrowser.prototype.setTransport = function(transport) {
		if (!this.config) {
			this.q.push(this.setTransport.bind(this, transport));
			return;
		}
		this.config.transportProvider = createTransport(transport);
	};
	AmplitudeBrowser.prototype.identify = function(identify, eventOptions) {
		if (isInstanceProxy(identify)) {
			var queue = identify._q;
			identify._q = [];
			identify = convertProxyObjectToRealObject(new Identify(), queue);
		}
		if (eventOptions === null || eventOptions === void 0 ? void 0 : eventOptions.user_id) this.setUserId(eventOptions.user_id);
		if (eventOptions === null || eventOptions === void 0 ? void 0 : eventOptions.device_id) this.setDeviceId(eventOptions.device_id);
		return _super.prototype.identify.call(this, identify, eventOptions);
	};
	AmplitudeBrowser.prototype.groupIdentify = function(groupType, groupName, identify, eventOptions) {
		if (isInstanceProxy(identify)) {
			var queue = identify._q;
			identify._q = [];
			identify = convertProxyObjectToRealObject(new Identify(), queue);
		}
		return _super.prototype.groupIdentify.call(this, groupType, groupName, identify, eventOptions);
	};
	AmplitudeBrowser.prototype.revenue = function(revenue, eventOptions) {
		if (isInstanceProxy(revenue)) {
			var queue = revenue._q;
			revenue._q = [];
			revenue = convertProxyObjectToRealObject(new Revenue(), queue);
		}
		return _super.prototype.revenue.call(this, revenue, eventOptions);
	};
	AmplitudeBrowser.prototype.trackCampaignEventIfNeeded = function(lastEventId, promises) {
		if (!this.webAttribution || !this.webAttribution.shouldTrackNewCampaign || !isUserPropertyAttributionEnabled(this.webAttribution.options)) return false;
		var campaignEvent = this.webAttribution.generateCampaignEvent(lastEventId);
		if (promises) promises.push(this.track(campaignEvent).promise);
		else this.track(campaignEvent);
		this.config.loggerProvider.log("Tracking attribution.");
		return true;
	};
	AmplitudeBrowser.prototype.process = function(event) {
		return __awaiter(this, void 0, void 0, function() {
			var currentTime, isEventInNewSession, shouldSetSessionIdOnNewCampaign;
			return __generator(this, function(_a) {
				currentTime = Date.now();
				isEventInNewSession = isNewSession(this.config.sessionTimeout, this.config.lastEventTime);
				shouldSetSessionIdOnNewCampaign = this.webAttribution && this.webAttribution.shouldSetSessionIdOnNewCampaign();
				if (event.event_type !== "session_start" && event.event_type !== "session_end" && (!event.session_id || event.session_id === this.getSessionId())) {
					if (isEventInNewSession || shouldSetSessionIdOnNewCampaign) {
						this.setSessionId(currentTime);
						if (shouldSetSessionIdOnNewCampaign) this.config.loggerProvider.log("Created a new session for new campaign.");
					} else if (!isEventInNewSession) this.trackCampaignEventIfNeeded();
				}
				return [2, _super.prototype.process.call(this, event)];
			});
		});
	};
	AmplitudeBrowser.prototype.logBrowserOptions = function(browserConfig) {
		try {
			var browserConfigCopy = __assign$1(__assign$1({}, browserConfig), { apiKey: browserConfig.apiKey.substring(0, 10) + "********" });
			this.config.loggerProvider.debug("Initialized Amplitude with BrowserConfig:", safeJsonStringify(browserConfigCopy));
		} catch (e) {
			/* istanbul ignore next */
			this.config.loggerProvider.error("Error logging browser config", e);
		}
	};
	/**
	* @experimental
	* WARNING: This method is for internal testing only and is not part of the public API.
	* It may be changed or removed at any time without notice.
	*
	* Sets the diagnostics sample rate before amplitude.init()
	* @param sampleRate - The sample rate to set
	*/
	AmplitudeBrowser.prototype._setDiagnosticsSampleRate = function(sampleRate) {
		if (sampleRate > 1 || sampleRate < 0) return;
		if (!this.config) {
			this._diagnosticsSampleRate = sampleRate;
			return;
		}
	};
	return AmplitudeBrowser;
}(AmplitudeCore);
//#endregion
//#region ../../node_modules/.pnpm/@amplitude+analytics-browser@2.42.2/node_modules/@amplitude/analytics-browser/lib/esm/browser-client-factory.js
var createInstance = function() {
	var client = new AmplitudeBrowser();
	return {
		init: debugWrapper(client.init.bind(client), "init", getClientLogConfig(client), getClientStates(client, ["config"])),
		add: debugWrapper(client.add.bind(client), "add", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.plugins"])),
		remove: debugWrapper(client.remove.bind(client), "remove", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.plugins"])),
		track: debugWrapper(client.track.bind(client), "track", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.queue.length"])),
		logEvent: debugWrapper(client.logEvent.bind(client), "logEvent", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.queue.length"])),
		identify: debugWrapper(client.identify.bind(client), "identify", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.queue.length"])),
		groupIdentify: debugWrapper(client.groupIdentify.bind(client), "groupIdentify", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.queue.length"])),
		setGroup: debugWrapper(client.setGroup.bind(client), "setGroup", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.queue.length"])),
		revenue: debugWrapper(client.revenue.bind(client), "revenue", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.queue.length"])),
		flush: debugWrapper(client.flush.bind(client), "flush", getClientLogConfig(client), getClientStates(client, ["config.apiKey", "timeline.queue.length"])),
		getUserId: debugWrapper(client.getUserId.bind(client), "getUserId", getClientLogConfig(client), getClientStates(client, ["config", "config.userId"])),
		setUserId: debugWrapper(client.setUserId.bind(client), "setUserId", getClientLogConfig(client), getClientStates(client, ["config", "config.userId"])),
		getDeviceId: debugWrapper(client.getDeviceId.bind(client), "getDeviceId", getClientLogConfig(client), getClientStates(client, ["config", "config.deviceId"])),
		setDeviceId: debugWrapper(client.setDeviceId.bind(client), "setDeviceId", getClientLogConfig(client), getClientStates(client, ["config", "config.deviceId"])),
		reset: debugWrapper(client.reset.bind(client), "reset", getClientLogConfig(client), getClientStates(client, [
			"config",
			"config.userId",
			"config.deviceId"
		])),
		getSessionId: debugWrapper(client.getSessionId.bind(client), "getSessionId", getClientLogConfig(client), getClientStates(client, ["config"])),
		setSessionId: debugWrapper(client.setSessionId.bind(client), "setSessionId", getClientLogConfig(client), getClientStates(client, ["config"])),
		extendSession: debugWrapper(client.extendSession.bind(client), "extendSession", getClientLogConfig(client), getClientStates(client, ["config"])),
		setOptOut: debugWrapper(client.setOptOut.bind(client), "setOptOut", getClientLogConfig(client), getClientStates(client, ["config"])),
		setTransport: debugWrapper(client.setTransport.bind(client), "setTransport", getClientLogConfig(client), getClientStates(client, ["config"])),
		getIdentity: debugWrapper(client.getIdentity.bind(client), "getIdentity", getClientLogConfig(client), getClientStates(client, ["config"])),
		setIdentity: debugWrapper(client.setIdentity.bind(client), "setIdentity", getClientLogConfig(client), getClientStates(client, [
			"config",
			"config.userId",
			"config.deviceId"
		])),
		getOptOut: debugWrapper(client.getOptOut.bind(client), "getOptOut", getClientLogConfig(client), getClientStates(client, ["config"])),
		_setDiagnosticsSampleRate: debugWrapper(client._setDiagnosticsSampleRate.bind(client), "_setDiagnosticsSampleRate", getClientLogConfig(client), getClientStates(client, ["config"]))
	};
};
var browser_client_factory_default = createInstance();
browser_client_factory_default.add;
browser_client_factory_default.extendSession;
browser_client_factory_default.flush;
browser_client_factory_default.getDeviceId;
browser_client_factory_default.getIdentity;
browser_client_factory_default.getOptOut;
browser_client_factory_default.getSessionId;
browser_client_factory_default.getUserId;
browser_client_factory_default.groupIdentify;
browser_client_factory_default.identify;
browser_client_factory_default.init;
browser_client_factory_default.logEvent;
browser_client_factory_default.remove;
browser_client_factory_default.reset;
browser_client_factory_default.revenue;
browser_client_factory_default.setDeviceId;
browser_client_factory_default.setGroup;
browser_client_factory_default.setIdentity;
browser_client_factory_default.setOptOut;
browser_client_factory_default.setSessionId;
browser_client_factory_default.setTransport;
browser_client_factory_default.setUserId;
var track = browser_client_factory_default.track;
browser_client_factory_default._setDiagnosticsSampleRate;
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/helpers.js
var WINDOW$1 = GLOBAL_OBJ;
var ignoreOnError = 0;
/**
* @hidden
*/
function shouldIgnoreOnError() {
	return ignoreOnError > 0;
}
/**
* @hidden
*/
function ignoreNextOnError() {
	ignoreOnError++;
	setTimeout(() => {
		ignoreOnError--;
	});
}
/**
* Instruments the given function and sends an event to Sentry every time the
* function throws an exception.
*
* @param fn A function to wrap. It is generally safe to pass an unbound function, because the returned wrapper always
* has a correct `this` context.
* @returns The wrapped function.
* @hidden
*/
function wrap(fn, options = {}) {
	function isFunction(fn) {
		return typeof fn === "function";
	}
	if (!isFunction(fn)) return fn;
	try {
		const wrapper = fn.__sentry_wrapped__;
		if (wrapper) if (typeof wrapper === "function") return wrapper;
		else return fn;
		if (getOriginalFunction(fn)) return fn;
	} catch {
		return fn;
	}
	const sentryWrapped = function(...args) {
		try {
			const wrappedArguments = args.map((arg) => wrap(arg, options));
			return fn.apply(this, wrappedArguments);
		} catch (ex) {
			ignoreNextOnError();
			withScope((scope) => {
				scope.addEventProcessor((event) => {
					if (options.mechanism) {
						addExceptionTypeValue(event, void 0, void 0);
						addExceptionMechanism(event, options.mechanism);
					}
					event.extra = {
						...event.extra,
						arguments: args
					};
					return event;
				});
				captureException(ex);
			});
			throw ex;
		}
	};
	try {
		for (const property in fn) if (Object.prototype.hasOwnProperty.call(fn, property)) sentryWrapped[property] = fn[property];
	} catch {}
	markFunctionWrapped(sentryWrapped, fn);
	addNonEnumerableProperty(fn, "__sentry_wrapped__", sentryWrapped);
	try {
		if (Object.getOwnPropertyDescriptor(sentryWrapped, "name").configurable) Object.defineProperty(sentryWrapped, "name", { get() {
			return fn.name;
		} });
	} catch {}
	return sentryWrapped;
}
/**
* Get HTTP request data from the current page.
*/
function getHttpRequestData() {
	const url = getLocationHref();
	const { referrer } = WINDOW$1.document || {};
	const { userAgent } = WINDOW$1.navigator || {};
	return {
		url,
		headers: {
			...referrer && { Referer: referrer },
			...userAgent && { "User-Agent": userAgent }
		}
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/eventbuilder.js
/**
* This function creates an exception from a JavaScript Error
*/
function exceptionFromError(stackParser, ex) {
	const frames = parseStackFrames(stackParser, ex);
	const exception = {
		type: extractType(ex),
		value: extractMessage(ex)
	};
	if (frames.length) exception.stacktrace = { frames };
	if (exception.type === void 0 && exception.value === "") exception.value = "Unrecoverable error caught";
	return exception;
}
function eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection) {
	const normalizeDepth = getClient()?.getOptions().normalizeDepth;
	const errorFromProp = getErrorPropertyFromObject(exception);
	const extra = { __serialized__: normalizeToSize(exception, normalizeDepth) };
	if (errorFromProp) return {
		exception: { values: [exceptionFromError(stackParser, errorFromProp)] },
		extra
	};
	const event = {
		exception: { values: [{
			type: isEvent(exception) ? exception.constructor.name : isUnhandledRejection ? "UnhandledRejection" : "Error",
			value: getNonErrorObjectExceptionValue(exception, { isUnhandledRejection })
		}] },
		extra
	};
	if (syntheticException) {
		const frames = parseStackFrames(stackParser, syntheticException);
		if (frames.length) event.exception.values[0].stacktrace = { frames };
	}
	return event;
}
function eventFromError(stackParser, ex) {
	return { exception: { values: [exceptionFromError(stackParser, ex)] } };
}
/** Parses stack frames from an error */
function parseStackFrames(stackParser, ex) {
	const stacktrace = ex.stacktrace || ex.stack || "";
	const skipLines = getSkipFirstStackStringLines(ex);
	const framesToPop = getPopFirstTopFrames(ex);
	try {
		return stackParser(stacktrace, skipLines, framesToPop);
	} catch {}
	return [];
}
var reactMinifiedRegexp = /Minified React error #\d+;/i;
/**
* Certain known React errors contain links that would be falsely
* parsed as frames. This function check for these errors and
* returns number of the stack string lines to skip.
*/
function getSkipFirstStackStringLines(ex) {
	if (ex && reactMinifiedRegexp.test(ex.message)) return 1;
	return 0;
}
/**
* If error has `framesToPop` property, it means that the
* creator tells us the first x frames will be useless
* and should be discarded. Typically error from wrapper function
* which don't point to the actual location in the developer's code.
*
* Example: https://github.com/zertosh/invariant/blob/master/invariant.js#L46
*/
function getPopFirstTopFrames(ex) {
	if (typeof ex.framesToPop === "number") return ex.framesToPop;
	return 0;
}
function isWebAssemblyException(exception) {
	if (typeof WebAssembly !== "undefined" && typeof WebAssembly.Exception !== "undefined") return exception instanceof WebAssembly.Exception;
	else return false;
}
/**
* Extracts from errors what we use as the exception `type` in error events.
*
* Usually, this is the `name` property on Error objects but WASM errors need to be treated differently.
*/
function extractType(ex) {
	const name = ex?.name;
	if (!name && isWebAssemblyException(ex)) return ex.message && Array.isArray(ex.message) && ex.message.length == 2 ? ex.message[0] : "WebAssembly.Exception";
	return name;
}
/**
* There are cases where stacktrace.message is an Event object
* https://github.com/getsentry/sentry-javascript/issues/1949
* In this specific case we try to extract stacktrace.message.error.message
*/
function extractMessage(ex) {
	const message = ex?.message;
	if (isWebAssemblyException(ex)) {
		if (Array.isArray(ex.message) && ex.message.length == 2) return ex.message[1];
		return "wasm exception";
	}
	if (!message) return "No error message";
	if (message.error && typeof message.error.message === "string") return _enhanceErrorWithSentryInfo(message.error);
	return _enhanceErrorWithSentryInfo(ex);
}
/**
* Creates an {@link Event} from all inputs to `captureException` and non-primitive inputs to `captureMessage`.
* @hidden
*/
function eventFromException(stackParser, exception, hint, attachStacktrace) {
	const event = eventFromUnknownInput(stackParser, exception, hint?.syntheticException || void 0, attachStacktrace);
	addExceptionMechanism(event);
	event.level = "error";
	if (hint?.event_id) event.event_id = hint.event_id;
	return resolvedSyncPromise(event);
}
/**
* Builds and Event from a Message
* @hidden
*/
function eventFromMessage(stackParser, message, level = "info", hint, attachStacktrace) {
	const event = eventFromString(stackParser, message, hint?.syntheticException || void 0, attachStacktrace);
	event.level = level;
	if (hint?.event_id) event.event_id = hint.event_id;
	return resolvedSyncPromise(event);
}
/**
* @hidden
*/
function eventFromUnknownInput(stackParser, exception, syntheticException, attachStacktrace, isUnhandledRejection) {
	let event;
	if (isErrorEvent(exception) && exception.error) return eventFromError(stackParser, exception.error);
	if (isDOMError(exception) || isDOMException(exception)) {
		const domException = exception;
		if ("stack" in exception) event = eventFromError(stackParser, exception);
		else {
			const name = domException.name || (isDOMError(domException) ? "DOMError" : "DOMException");
			const message = domException.message ? `${name}: ${domException.message}` : name;
			event = eventFromString(stackParser, message, syntheticException, attachStacktrace);
			addExceptionTypeValue(event, message);
		}
		if ("code" in domException) event.tags = {
			...event.tags,
			"DOMException.code": `${domException.code}`
		};
		return event;
	}
	if (isError(exception)) return eventFromError(stackParser, exception);
	if (isPlainObject(exception) || isEvent(exception)) {
		event = eventFromPlainObject(stackParser, exception, syntheticException, isUnhandledRejection);
		addExceptionMechanism(event, { synthetic: true });
		return event;
	}
	event = eventFromString(stackParser, exception, syntheticException, attachStacktrace);
	addExceptionTypeValue(event, `${exception}`, void 0);
	addExceptionMechanism(event, { synthetic: true });
	return event;
}
function eventFromString(stackParser, message, syntheticException, attachStacktrace) {
	const event = {};
	if (attachStacktrace && syntheticException) {
		const frames = parseStackFrames(stackParser, syntheticException);
		if (frames.length) event.exception = { values: [{
			value: message,
			stacktrace: { frames }
		}] };
		addExceptionMechanism(event, { synthetic: true });
	}
	if (isParameterizedString(message)) {
		const { __sentry_template_string__, __sentry_template_values__ } = message;
		event.logentry = {
			message: __sentry_template_string__,
			params: __sentry_template_values__
		};
		return event;
	}
	event.message = message;
	return event;
}
function getNonErrorObjectExceptionValue(exception, { isUnhandledRejection }) {
	const keys = extractExceptionKeysForMessage(exception);
	const captureType = isUnhandledRejection ? "promise rejection" : "exception";
	if (isErrorEvent(exception)) return `Event \`ErrorEvent\` captured as ${captureType} with message \`${exception.message}\``;
	if (isEvent(exception)) return `Event \`${getObjectClassName(exception)}\` (type=${exception.type}) captured as ${captureType}`;
	return `Object captured as ${captureType} with keys: ${keys}`;
}
function getObjectClassName(obj) {
	try {
		const prototype = Object.getPrototypeOf(obj);
		return prototype ? prototype.constructor.name : void 0;
	} catch {}
}
/** If a plain object has a property that is an `Error`, return this error. */
function getErrorPropertyFromObject(obj) {
	return Object.values(obj).find((v) => v instanceof Error);
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/client.js
/**
* A magic string that build tooling can leverage in order to inject a release value into the SDK.
*/
/**
* The Sentry Browser SDK Client.
*
* @see BrowserOptions for documentation on configuration options.
* @see SentryClient for usage documentation.
*/
var BrowserClient = class extends Client {
	/**
	* Creates a new Browser SDK instance.
	*
	* @param options Configuration options for this SDK.
	*/
	constructor(options) {
		const opts = applyDefaultOptions(options);
		applySdkMetadata(opts, "browser", ["browser"], WINDOW$1.SENTRY_SDK_SOURCE || getSDKSource());
		if (opts._metadata?.sdk) opts._metadata.sdk.settings = {
			infer_ip: opts.sendDefaultPii ? "auto" : "never",
			...opts._metadata.sdk.settings
		};
		super(opts);
		const { sendDefaultPii, sendClientReports, enableLogs, _experiments, enableMetrics: enableMetricsOption } = this._options;
		const enableMetrics = enableMetricsOption ?? _experiments?.enableMetrics ?? true;
		if (WINDOW$1.document && (sendClientReports || enableLogs || enableMetrics)) WINDOW$1.document.addEventListener("visibilitychange", () => {
			if (WINDOW$1.document.visibilityState === "hidden") {
				if (sendClientReports) this._flushOutcomes();
				if (enableLogs) _INTERNAL_flushLogsBuffer(this);
				if (enableMetrics) _INTERNAL_flushMetricsBuffer(this);
			}
		});
		if (sendDefaultPii) this.on("beforeSendSession", addAutoIpAddressToSession);
	}
	/**
	* @inheritDoc
	*/
	eventFromException(exception, hint) {
		return eventFromException(this._options.stackParser, exception, hint, this._options.attachStacktrace);
	}
	/**
	* @inheritDoc
	*/
	eventFromMessage(message, level = "info", hint) {
		return eventFromMessage(this._options.stackParser, message, level, hint, this._options.attachStacktrace);
	}
	/**
	* @inheritDoc
	*/
	_prepareEvent(event, hint, currentScope, isolationScope) {
		event.platform = event.platform || "javascript";
		return super._prepareEvent(event, hint, currentScope, isolationScope);
	}
};
/** Exported only for tests. */
function applyDefaultOptions(optionsArg) {
	return {
		release: typeof __SENTRY_RELEASE__ === "string" ? __SENTRY_RELEASE__ : WINDOW$1.SENTRY_RELEASE?.id,
		sendClientReports: true,
		parentSpanIsAlwaysRootSpan: true,
		...optionsArg
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry-internal+browser-utils@10.52.0/node_modules/@sentry-internal/browser-utils/build/esm/debug-build.js
/**
* This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
*
* ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
*/
var DEBUG_BUILD$1 = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
//#endregion
//#region ../../node_modules/.pnpm/@sentry-internal+browser-utils@10.52.0/node_modules/@sentry-internal/browser-utils/build/esm/types.js
var WINDOW = GLOBAL_OBJ;
//#endregion
//#region ../../node_modules/.pnpm/@sentry-internal+browser-utils@10.52.0/node_modules/@sentry-internal/browser-utils/build/esm/instrument/dom.js
var DEBOUNCE_DURATION = 1e3;
var debounceTimerID;
var lastCapturedEventType;
var lastCapturedEventTargetId;
/**
* Add an instrumentation handler for when a click or a keypress happens.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addClickKeypressInstrumentationHandler(handler) {
	const type = "dom";
	addHandler(type, handler);
	maybeInstrument(type, instrumentDOM);
}
/** Exported for tests only. */
function instrumentDOM() {
	if (!WINDOW.document) return;
	const triggerDOMHandler = triggerHandlers.bind(null, "dom");
	const globalDOMEventHandler = makeDOMEventHandler(triggerDOMHandler, true);
	WINDOW.document.addEventListener("click", globalDOMEventHandler, false);
	WINDOW.document.addEventListener("keypress", globalDOMEventHandler, false);
	["EventTarget", "Node"].forEach((target) => {
		const proto = WINDOW[target]?.prototype;
		if (!proto?.hasOwnProperty?.("addEventListener")) return;
		fill(proto, "addEventListener", function(originalAddEventListener) {
			return function(type, listener, options) {
				if (type === "click" || type == "keypress") try {
					const handlers = this.__sentry_instrumentation_handlers__ = this.__sentry_instrumentation_handlers__ || {};
					const handlerForType = handlers[type] = handlers[type] || { refCount: 0 };
					if (!handlerForType.handler) {
						const handler = makeDOMEventHandler(triggerDOMHandler);
						handlerForType.handler = handler;
						originalAddEventListener.call(this, type, handler, options);
					}
					handlerForType.refCount++;
				} catch {}
				return originalAddEventListener.call(this, type, listener, options);
			};
		});
		fill(proto, "removeEventListener", function(originalRemoveEventListener) {
			return function(type, listener, options) {
				if (type === "click" || type == "keypress") try {
					const handlers = this.__sentry_instrumentation_handlers__ || {};
					const handlerForType = handlers[type];
					if (handlerForType) {
						handlerForType.refCount--;
						if (handlerForType.refCount <= 0) {
							originalRemoveEventListener.call(this, type, handlerForType.handler, options);
							handlerForType.handler = void 0;
							delete handlers[type];
						}
						if (Object.keys(handlers).length === 0) delete this.__sentry_instrumentation_handlers__;
					}
				} catch {}
				return originalRemoveEventListener.call(this, type, listener, options);
			};
		});
	});
}
/**
* Check whether the event is similar to the last captured one. For example, two click events on the same button.
*/
function isSimilarToLastCapturedEvent(event) {
	if (event.type !== lastCapturedEventType) return false;
	try {
		if (!event.target || event.target._sentryId !== lastCapturedEventTargetId) return false;
	} catch {}
	return true;
}
/**
* Decide whether an event should be captured.
* @param event event to be captured
*/
function shouldSkipDOMEvent(eventType, target) {
	if (eventType !== "keypress") return false;
	if (!target?.tagName) return true;
	if (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable) return false;
	return true;
}
/**
* Wraps addEventListener to capture UI breadcrumbs
*/
function makeDOMEventHandler(handler, globalListener = false) {
	return (event) => {
		if (!event || event["_sentryCaptured"]) return;
		const target = getEventTarget(event);
		if (shouldSkipDOMEvent(event.type, target)) return;
		addNonEnumerableProperty(event, "_sentryCaptured", true);
		if (target && !target._sentryId) addNonEnumerableProperty(target, "_sentryId", uuid4());
		const name = event.type === "keypress" ? "input" : event.type;
		if (!isSimilarToLastCapturedEvent(event)) {
			handler({
				event,
				name,
				global: globalListener
			});
			lastCapturedEventType = event.type;
			lastCapturedEventTargetId = target ? target._sentryId : void 0;
		}
		clearTimeout(debounceTimerID);
		debounceTimerID = WINDOW.setTimeout(() => {
			lastCapturedEventTargetId = void 0;
			lastCapturedEventType = void 0;
		}, DEBOUNCE_DURATION);
	};
}
function getEventTarget(event) {
	try {
		return event.target;
	} catch {
		return null;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry-internal+browser-utils@10.52.0/node_modules/@sentry-internal/browser-utils/build/esm/instrument/history.js
var lastHref;
/**
* Add an instrumentation handler for when a fetch request happens.
* The handler function is called once when the request starts and once when it ends,
* which can be identified by checking if it has an `endTimestamp`.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addHistoryInstrumentationHandler(handler) {
	const type = "history";
	addHandler(type, handler);
	maybeInstrument(type, instrumentHistory);
}
/**
* Exported just for testing
*/
function instrumentHistory() {
	WINDOW.addEventListener("popstate", () => {
		const to = WINDOW.location.href;
		const from = lastHref;
		lastHref = to;
		if (from === to) return;
		triggerHandlers("history", {
			from,
			to
		});
	});
	if (!supportsHistory()) return;
	function historyReplacementFunction(originalHistoryFunction) {
		return function(...args) {
			const url = args.length > 2 ? args[2] : void 0;
			if (url) {
				const from = lastHref;
				const to = getAbsoluteUrl(String(url));
				lastHref = to;
				if (from === to) return originalHistoryFunction.apply(this, args);
				triggerHandlers("history", {
					from,
					to
				});
			}
			return originalHistoryFunction.apply(this, args);
		};
	}
	fill(WINDOW.history, "pushState", historyReplacementFunction);
	fill(WINDOW.history, "replaceState", historyReplacementFunction);
}
function getAbsoluteUrl(urlOrPath) {
	try {
		return new URL(urlOrPath, WINDOW.location.origin).toString();
	} catch {
		return urlOrPath;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry-internal+browser-utils@10.52.0/node_modules/@sentry-internal/browser-utils/build/esm/getNativeImplementation.js
/**
* We generally want to use window.fetch / window.setTimeout.
* However, in some cases this may be wrapped (e.g. by Zone.js for Angular),
* so we try to get an unpatched version of this from a sandboxed iframe.
*/
var cachedImplementations = {};
/**
* Get the native implementation of a browser function.
*
* This can be used to ensure we get an unwrapped version of a function, in cases where a wrapped function can lead to problems.
*
* The following methods can be retrieved:
* - `setTimeout`: This can be wrapped by e.g. Angular, causing change detection to be triggered.
* - `fetch`: This can be wrapped by e.g. ad-blockers, causing an infinite loop when a request is blocked.
*/
function getNativeImplementation(name) {
	const cached = cachedImplementations[name];
	if (cached) return cached;
	let impl = WINDOW[name];
	if (isNativeFunction(impl)) return cachedImplementations[name] = impl.bind(WINDOW);
	const document = WINDOW.document;
	if (document && typeof document.createElement === "function") try {
		const sandbox = document.createElement("iframe");
		sandbox.hidden = true;
		document.head.appendChild(sandbox);
		const contentWindow = sandbox.contentWindow;
		if (contentWindow?.[name]) impl = contentWindow[name];
		document.head.removeChild(sandbox);
	} catch (e) {
		DEBUG_BUILD$1 && debug.warn(`Could not create sandbox iframe for ${name} check, bailing to window.${name}: `, e);
	}
	if (!impl) return impl;
	return cachedImplementations[name] = impl.bind(WINDOW);
}
/** Clear a cached implementation. */
function clearCachedImplementation(name) {
	cachedImplementations[name] = void 0;
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry-internal+browser-utils@10.52.0/node_modules/@sentry-internal/browser-utils/build/esm/instrument/xhr.js
var SENTRY_XHR_DATA_KEY = "__sentry_xhr_v3__";
/**
* Add an instrumentation handler for when an XHR request happens.
* The handler function is called once when the request starts and once when it ends,
* which can be identified by checking if it has an `endTimestamp`.
*
* Use at your own risk, this might break without changelog notice, only used internally.
* @hidden
*/
function addXhrInstrumentationHandler(handler) {
	const type = "xhr";
	addHandler(type, handler);
	maybeInstrument(type, instrumentXHR);
}
/** Exported only for tests. */
function instrumentXHR() {
	if (!WINDOW.XMLHttpRequest) return;
	const xhrproto = XMLHttpRequest.prototype;
	xhrproto.open = new Proxy(xhrproto.open, { apply(originalOpen, xhrOpenThisArg, xhrOpenArgArray) {
		const virtualError = /* @__PURE__ */ new Error();
		const startTimestamp = timestampInSeconds() * 1e3;
		const method = isString(xhrOpenArgArray[0]) ? xhrOpenArgArray[0].toUpperCase() : void 0;
		const url = parseXhrUrlArg(xhrOpenArgArray[1]);
		if (!method || !url) return originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray);
		xhrOpenThisArg[SENTRY_XHR_DATA_KEY] = {
			method,
			url,
			request_headers: {}
		};
		if (method === "POST" && url.match(/sentry_key/)) xhrOpenThisArg.__sentry_own_request__ = true;
		const onreadystatechangeHandler = () => {
			const xhrInfo = xhrOpenThisArg[SENTRY_XHR_DATA_KEY];
			if (!xhrInfo) return;
			if (xhrOpenThisArg.readyState === 4) {
				try {
					xhrInfo.status_code = xhrOpenThisArg.status;
				} catch {}
				triggerHandlers("xhr", {
					endTimestamp: timestampInSeconds() * 1e3,
					startTimestamp,
					xhr: xhrOpenThisArg,
					virtualError
				});
			}
		};
		if ("onreadystatechange" in xhrOpenThisArg && typeof xhrOpenThisArg.onreadystatechange === "function") xhrOpenThisArg.onreadystatechange = new Proxy(xhrOpenThisArg.onreadystatechange, { apply(originalOnreadystatechange, onreadystatechangeThisArg, onreadystatechangeArgArray) {
			onreadystatechangeHandler();
			return originalOnreadystatechange.apply(onreadystatechangeThisArg, onreadystatechangeArgArray);
		} });
		else xhrOpenThisArg.addEventListener("readystatechange", onreadystatechangeHandler);
		xhrOpenThisArg.setRequestHeader = new Proxy(xhrOpenThisArg.setRequestHeader, { apply(originalSetRequestHeader, setRequestHeaderThisArg, setRequestHeaderArgArray) {
			const [header, value] = setRequestHeaderArgArray;
			const xhrInfo = setRequestHeaderThisArg[SENTRY_XHR_DATA_KEY];
			if (xhrInfo && isString(header) && isString(value)) xhrInfo.request_headers[header.toLowerCase()] = value;
			return originalSetRequestHeader.apply(setRequestHeaderThisArg, setRequestHeaderArgArray);
		} });
		return originalOpen.apply(xhrOpenThisArg, xhrOpenArgArray);
	} });
	xhrproto.send = new Proxy(xhrproto.send, { apply(originalSend, sendThisArg, sendArgArray) {
		const sentryXhrData = sendThisArg[SENTRY_XHR_DATA_KEY];
		if (!sentryXhrData) return originalSend.apply(sendThisArg, sendArgArray);
		if (sendArgArray[0] !== void 0) sentryXhrData.body = sendArgArray[0];
		triggerHandlers("xhr", {
			startTimestamp: timestampInSeconds() * 1e3,
			xhr: sendThisArg
		});
		return originalSend.apply(sendThisArg, sendArgArray);
	} });
}
/**
* Parses the URL argument of a XHR method to a string.
*
* See: https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest/open#url
* url: A string or any other object with a stringifier — including a URL object — that provides the URL of the resource to send the request to.
*
* @param url - The URL argument of an XHR method
* @returns The parsed URL string or undefined if the URL is invalid
*/
function parseXhrUrlArg(url) {
	if (isString(url)) return url;
	try {
		return url.toString();
	} catch {}
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/transports/fetch.js
var DEFAULT_BROWSER_TRANSPORT_BUFFER_SIZE = 40;
/**
* Creates a Transport that uses the Fetch API to send events to Sentry.
*/
function makeFetchTransport(options, nativeFetch = getNativeImplementation("fetch")) {
	let pendingBodySize = 0;
	let pendingCount = 0;
	async function makeRequest(request) {
		const requestSize = request.body.length;
		pendingBodySize += requestSize;
		pendingCount++;
		const requestOptions = {
			body: request.body,
			method: "POST",
			referrerPolicy: "strict-origin",
			headers: options.headers,
			keepalive: pendingBodySize <= 6e4 && pendingCount < 15,
			...options.fetchOptions
		};
		try {
			const response = await nativeFetch(options.url, requestOptions);
			return {
				statusCode: response.status,
				headers: {
					"x-sentry-rate-limits": response.headers.get("X-Sentry-Rate-Limits"),
					"retry-after": response.headers.get("Retry-After")
				}
			};
		} catch (e) {
			clearCachedImplementation("fetch");
			throw e;
		} finally {
			pendingBodySize -= requestSize;
			pendingCount--;
		}
	}
	return createTransport$1(options, makeRequest, makePromiseBuffer(options.bufferSize || DEFAULT_BROWSER_TRANSPORT_BUFFER_SIZE));
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/debug-build.js
/**
* This serves as a build time flag that will be true by default, but false in non-debug builds or if users replace `__SENTRY_DEBUG__` in their generated code.
*
* ATTENTION: This constant must never cross package boundaries (i.e. be exported) to guarantee that it can be used for tree shaking.
*/
var DEBUG_BUILD = typeof __SENTRY_DEBUG__ === "undefined" || __SENTRY_DEBUG__;
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/stack-parsers.js
var CHROME_PRIORITY = 30;
var GECKO_PRIORITY = 50;
function createFrame(filename, func, lineno, colno) {
	const frame = {
		filename,
		function: func === "<anonymous>" ? "?" : func,
		in_app: true
	};
	if (lineno !== void 0) frame.lineno = lineno;
	if (colno !== void 0) frame.colno = colno;
	return frame;
}
var chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
var chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
var chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
var chromeDataUriRegex = /at (.+?) ?\(data:(.+?),/;
var chromeStackParserFn = (line) => {
	const dataUriMatch = line.match(chromeDataUriRegex);
	if (dataUriMatch) return {
		filename: `<data:${dataUriMatch[2]}>`,
		function: dataUriMatch[1]
	};
	const noFnParts = chromeRegexNoFnName.exec(line);
	if (noFnParts) {
		const [, filename, line, col] = noFnParts;
		return createFrame(filename, "?", +line, +col);
	}
	const parts = chromeRegex.exec(line);
	if (parts) {
		if (parts[2]?.indexOf("eval") === 0) {
			const subMatch = chromeEvalRegex.exec(parts[2]);
			if (subMatch) {
				parts[2] = subMatch[1];
				parts[3] = subMatch[2];
				parts[4] = subMatch[3];
			}
		}
		const [func, filename] = extractSafariExtensionDetails(parts[1] || "?", parts[2]);
		return createFrame(filename, func, parts[3] ? +parts[3] : void 0, parts[4] ? +parts[4] : void 0);
	}
};
var chromeStackLineParser = [CHROME_PRIORITY, chromeStackParserFn];
var geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
var geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
var gecko = (line) => {
	const parts = geckoREgex.exec(line);
	if (parts) {
		if (parts[3] && parts[3].indexOf(" > eval") > -1) {
			const subMatch = geckoEvalRegex.exec(parts[3]);
			if (subMatch) {
				parts[1] = parts[1] || "eval";
				parts[3] = subMatch[1];
				parts[4] = subMatch[2];
				parts[5] = "";
			}
		}
		let filename = parts[3];
		let func = parts[1] || "?";
		[func, filename] = extractSafariExtensionDetails(func, filename);
		return createFrame(filename, func, parts[4] ? +parts[4] : void 0, parts[5] ? +parts[5] : void 0);
	}
};
var defaultStackParser = createStackParser(...[chromeStackLineParser, [GECKO_PRIORITY, gecko]]);
/**
* Safari web extensions, starting version unknown, can produce "frames-only" stacktraces.
* What it means, is that instead of format like:
*
* Error: wat
*   at function@url:row:col
*   at function@url:row:col
*   at function@url:row:col
*
* it produces something like:
*
*   function@url:row:col
*   function@url:row:col
*   function@url:row:col
*
* Because of that, it won't be captured by `chrome` RegExp and will fall into `Gecko` branch.
* This function is extracted so that we can use it in both places without duplicating the logic.
* Unfortunately "just" changing RegExp is too complicated now and making it pass all tests
* and fix this case seems like an impossible, or at least way too time-consuming task.
*/
var extractSafariExtensionDetails = (func, filename) => {
	const isSafariExtension = func.indexOf("safari-extension") !== -1;
	const isSafariWebExtension = func.indexOf("safari-web-extension") !== -1;
	return isSafariExtension || isSafariWebExtension ? [func.indexOf("@") !== -1 ? func.split("@")[0] : "?", isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`] : [func, filename];
};
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/integrations/breadcrumbs.js
/** maxStringLength gets capped to prevent 100 breadcrumbs exceeding 1MB event payload size */
var MAX_ALLOWED_STRING_LENGTH = 1024;
var INTEGRATION_NAME$4 = "Breadcrumbs";
var _breadcrumbsIntegration = ((options = {}) => {
	const _options = {
		console: true,
		dom: true,
		fetch: true,
		history: true,
		sentry: true,
		xhr: true,
		...options
	};
	return {
		name: INTEGRATION_NAME$4,
		setup(client) {
			if (_options.console) addConsoleInstrumentationHandler(_getConsoleBreadcrumbHandler(client));
			if (_options.dom) addClickKeypressInstrumentationHandler(_getDomBreadcrumbHandler(client, _options.dom));
			if (_options.xhr) addXhrInstrumentationHandler(_getXhrBreadcrumbHandler(client));
			if (_options.fetch) addFetchInstrumentationHandler(_getFetchBreadcrumbHandler(client));
			if (_options.history) addHistoryInstrumentationHandler(_getHistoryBreadcrumbHandler(client));
			if (_options.sentry) client.on("beforeSendEvent", _getSentryBreadcrumbHandler(client));
		}
	};
});
var breadcrumbsIntegration = defineIntegration(_breadcrumbsIntegration);
/**
* Adds a breadcrumb for Sentry events or transactions if this option is enabled.
*/
function _getSentryBreadcrumbHandler(client) {
	return function addSentryBreadcrumb(event) {
		if (getClient() !== client) return;
		addBreadcrumb({
			category: `sentry.${event.type === "transaction" ? "transaction" : "event"}`,
			event_id: event.event_id,
			level: event.level,
			message: getEventDescription(event)
		}, { event });
	};
}
/**
* A HOC that creates a function that creates breadcrumbs from DOM API calls.
* This is a HOC so that we get access to dom options in the closure.
*/
function _getDomBreadcrumbHandler(client, dom) {
	return function _innerDomBreadcrumb(handlerData) {
		if (getClient() !== client) return;
		let target;
		let componentName;
		let keyAttrs = typeof dom === "object" ? dom.serializeAttribute : void 0;
		let maxStringLength = typeof dom === "object" && typeof dom.maxStringLength === "number" ? dom.maxStringLength : void 0;
		if (maxStringLength && maxStringLength > MAX_ALLOWED_STRING_LENGTH) {
			DEBUG_BUILD && debug.warn(`\`dom.maxStringLength\` cannot exceed ${MAX_ALLOWED_STRING_LENGTH}, but a value of ${maxStringLength} was configured. Sentry will use ${MAX_ALLOWED_STRING_LENGTH} instead.`);
			maxStringLength = MAX_ALLOWED_STRING_LENGTH;
		}
		if (typeof keyAttrs === "string") keyAttrs = [keyAttrs];
		try {
			const event = handlerData.event;
			const element = _isEvent(event) ? event.target : event;
			target = htmlTreeAsString(element, {
				keyAttrs,
				maxStringLength
			});
			componentName = getComponentName(element);
		} catch {
			target = "<unknown>";
		}
		if (target.length === 0) return;
		const breadcrumb = {
			category: `ui.${handlerData.name}`,
			message: target
		};
		if (componentName) breadcrumb.data = { "ui.component_name": componentName };
		addBreadcrumb(breadcrumb, {
			event: handlerData.event,
			name: handlerData.name,
			global: handlerData.global
		});
	};
}
/**
* Creates breadcrumbs from console API calls
*/
function _getConsoleBreadcrumbHandler(client) {
	return function _consoleBreadcrumb(handlerData) {
		if (getClient() !== client) return;
		const breadcrumb = {
			category: "console",
			data: {
				arguments: handlerData.args,
				logger: "console"
			},
			level: severityLevelFromString(handlerData.level),
			message: safeJoin(handlerData.args, " ")
		};
		if (handlerData.level === "assert") if (handlerData.args[0] === false) {
			breadcrumb.message = `Assertion failed: ${safeJoin(handlerData.args.slice(1), " ") || "console.assert"}`;
			breadcrumb.data.arguments = handlerData.args.slice(1);
		} else return;
		addBreadcrumb(breadcrumb, {
			input: handlerData.args,
			level: handlerData.level
		});
	};
}
/**
* Creates breadcrumbs from XHR API calls
*/
function _getXhrBreadcrumbHandler(client) {
	return function _xhrBreadcrumb(handlerData) {
		if (getClient() !== client) return;
		const { startTimestamp, endTimestamp } = handlerData;
		const sentryXhrData = handlerData.xhr[SENTRY_XHR_DATA_KEY];
		if (!startTimestamp || !endTimestamp || !sentryXhrData) return;
		const { method, url, status_code, body } = sentryXhrData;
		const data = {
			method,
			url,
			status_code
		};
		const hint = {
			xhr: handlerData.xhr,
			input: body,
			startTimestamp,
			endTimestamp
		};
		const breadcrumb = {
			category: "xhr",
			data,
			type: "http",
			level: getBreadcrumbLogLevelFromHttpStatusCode(status_code)
		};
		client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint);
		addBreadcrumb(breadcrumb, hint);
	};
}
/**
* Creates breadcrumbs from fetch API calls
*/
function _getFetchBreadcrumbHandler(client) {
	return function _fetchBreadcrumb(handlerData) {
		if (getClient() !== client) return;
		const { startTimestamp, endTimestamp } = handlerData;
		if (!endTimestamp) return;
		if (handlerData.fetchData.url.match(/sentry_key/) && handlerData.fetchData.method === "POST") return;
		if (handlerData.error) {
			const hint = {
				data: handlerData.error,
				input: handlerData.args,
				startTimestamp,
				endTimestamp
			};
			const breadcrumb = {
				category: "fetch",
				data: handlerData.fetchData,
				level: "error",
				type: "http"
			};
			client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint);
			addBreadcrumb(breadcrumb, hint);
		} else {
			const response = handlerData.response;
			const data = {
				...handlerData.fetchData,
				status_code: response?.status
			};
			const hint = {
				input: handlerData.args,
				response,
				startTimestamp,
				endTimestamp
			};
			const breadcrumb = {
				category: "fetch",
				data,
				type: "http",
				level: getBreadcrumbLogLevelFromHttpStatusCode(data.status_code)
			};
			client.emit("beforeOutgoingRequestBreadcrumb", breadcrumb, hint);
			addBreadcrumb(breadcrumb, hint);
		}
	};
}
/**
* Creates breadcrumbs from history API calls
*/
function _getHistoryBreadcrumbHandler(client) {
	return function _historyBreadcrumb(handlerData) {
		if (getClient() !== client) return;
		let from = handlerData.from;
		let to = handlerData.to;
		const parsedLoc = parseUrl$1(WINDOW$1.location.href);
		let parsedFrom = from ? parseUrl$1(from) : void 0;
		const parsedTo = parseUrl$1(to);
		if (!parsedFrom?.path) parsedFrom = parsedLoc;
		if (parsedLoc.protocol === parsedTo.protocol && parsedLoc.host === parsedTo.host) to = parsedTo.relative;
		if (parsedLoc.protocol === parsedFrom.protocol && parsedLoc.host === parsedFrom.host) from = parsedFrom.relative;
		addBreadcrumb({
			category: "navigation",
			data: {
				from,
				to
			}
		});
	};
}
function _isEvent(event) {
	return !!event && !!event.target;
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/integrations/browserapierrors.js
var DEFAULT_EVENT_TARGET = "EventTarget,Window,Node,ApplicationCache,AudioTrackList,BroadcastChannel,ChannelMergerNode,CryptoOperation,EventSource,FileReader,HTMLUnknownElement,IDBDatabase,IDBRequest,IDBTransaction,KeyOperation,MediaController,MessagePort,ModalWindow,Notification,SVGElementInstance,Screen,SharedWorker,TextTrack,TextTrackCue,TextTrackList,WebSocket,WebSocketWorker,Worker,XMLHttpRequest,XMLHttpRequestEventTarget,XMLHttpRequestUpload".split(",");
var INTEGRATION_NAME$3 = "BrowserApiErrors";
var _browserApiErrorsIntegration = ((options = {}) => {
	const _options = {
		XMLHttpRequest: true,
		eventTarget: true,
		requestAnimationFrame: true,
		setInterval: true,
		setTimeout: true,
		unregisterOriginalCallbacks: false,
		...options
	};
	return {
		name: INTEGRATION_NAME$3,
		setupOnce() {
			if (_options.setTimeout) fill(WINDOW$1, "setTimeout", _wrapTimeFunction);
			if (_options.setInterval) fill(WINDOW$1, "setInterval", _wrapTimeFunction);
			if (_options.requestAnimationFrame) fill(WINDOW$1, "requestAnimationFrame", _wrapRAF);
			if (_options.XMLHttpRequest && "XMLHttpRequest" in WINDOW$1) fill(XMLHttpRequest.prototype, "send", _wrapXHR);
			const eventTargetOption = _options.eventTarget;
			if (eventTargetOption) (Array.isArray(eventTargetOption) ? eventTargetOption : DEFAULT_EVENT_TARGET).forEach((target) => _wrapEventTarget(target, _options));
		}
	};
});
/**
* Wrap timer functions and event targets to catch errors and provide better meta data.
*/
var browserApiErrorsIntegration = defineIntegration(_browserApiErrorsIntegration);
function _wrapTimeFunction(original) {
	return function(...args) {
		const originalCallback = args[0];
		args[0] = wrap(originalCallback, { mechanism: {
			handled: false,
			type: `auto.browser.browserapierrors.${getFunctionName(original)}`
		} });
		return original.apply(this, args);
	};
}
function _wrapRAF(original) {
	return function(callback) {
		return original.apply(this, [wrap(callback, { mechanism: {
			data: { handler: getFunctionName(original) },
			handled: false,
			type: "auto.browser.browserapierrors.requestAnimationFrame"
		} })]);
	};
}
function _wrapXHR(originalSend) {
	return function(...args) {
		const xhr = this;
		[
			"onload",
			"onerror",
			"onprogress",
			"onreadystatechange"
		].forEach((prop) => {
			if (prop in xhr && typeof xhr[prop] === "function") fill(xhr, prop, function(original) {
				const wrapOptions = { mechanism: {
					data: { handler: getFunctionName(original) },
					handled: false,
					type: `auto.browser.browserapierrors.xhr.${prop}`
				} };
				const originalFunction = getOriginalFunction(original);
				if (originalFunction) wrapOptions.mechanism.data.handler = getFunctionName(originalFunction);
				return wrap(original, wrapOptions);
			});
		});
		return originalSend.apply(this, args);
	};
}
function _wrapEventTarget(target, integrationOptions) {
	const proto = WINDOW$1[target]?.prototype;
	if (!proto?.hasOwnProperty?.("addEventListener")) return;
	fill(proto, "addEventListener", function(original) {
		return function(eventName, fn, options) {
			try {
				if (isEventListenerObject(fn)) fn.handleEvent = wrap(fn.handleEvent, { mechanism: {
					data: {
						handler: getFunctionName(fn),
						target
					},
					handled: false,
					type: "auto.browser.browserapierrors.handleEvent"
				} });
			} catch {}
			if (integrationOptions.unregisterOriginalCallbacks) unregisterOriginalCallback(this, eventName, fn);
			return original.apply(this, [
				eventName,
				wrap(fn, { mechanism: {
					data: {
						handler: getFunctionName(fn),
						target
					},
					handled: false,
					type: "auto.browser.browserapierrors.addEventListener"
				} }),
				options
			]);
		};
	});
	fill(proto, "removeEventListener", function(originalRemoveEventListener) {
		return function(eventName, fn, options) {
			/**
			* There are 2 possible scenarios here:
			*
			* 1. Someone passes a callback, which was attached prior to Sentry initialization, or by using unmodified
			* method, eg. `document.addEventListener.call(el, name, handler). In this case, we treat this function
			* as a pass-through, and call original `removeEventListener` with it.
			*
			* 2. Someone passes a callback, which was attached after Sentry was initialized, which means that it was using
			* our wrapped version of `addEventListener`, which internally calls `wrap` helper.
			* This helper "wraps" whole callback inside a try/catch statement, and attached appropriate metadata to it,
			* in order for us to make a distinction between wrapped/non-wrapped functions possible.
			* If a function was wrapped, it has additional property of `__sentry_wrapped__`, holding the handler.
			*
			* When someone adds a handler prior to initialization, and then do it again, but after,
			* then we have to detach both of them. Otherwise, if we'd detach only wrapped one, it'd be impossible
			* to get rid of the initial handler and it'd stick there forever.
			*/
			try {
				const originalEventHandler = fn.__sentry_wrapped__;
				if (originalEventHandler) originalRemoveEventListener.call(this, eventName, originalEventHandler, options);
			} catch {}
			return originalRemoveEventListener.call(this, eventName, fn, options);
		};
	});
}
function isEventListenerObject(obj) {
	return typeof obj.handleEvent === "function";
}
function unregisterOriginalCallback(target, eventName, fn) {
	if (target && typeof target === "object" && "removeEventListener" in target && typeof target.removeEventListener === "function") target.removeEventListener(eventName, fn);
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/integrations/browsersession.js
/**
* When added, automatically creates sessions which allow you to track adoption and crashes (crash free rate) in your Releases in Sentry.
* More information: https://docs.sentry.io/product/releases/health/
*
* Note: In order for session tracking to work, you need to set up Releases: https://docs.sentry.io/product/releases/
*/
var browserSessionIntegration = defineIntegration((options = {}) => {
	const lifecycle = options.lifecycle ?? "route";
	return {
		name: "BrowserSession",
		setupOnce() {
			if (typeof WINDOW$1.document === "undefined") {
				DEBUG_BUILD && debug.warn("Using the `browserSessionIntegration` in non-browser environments is not supported.");
				return;
			}
			startSession({ ignoreDuration: true });
			captureSession();
			const isolationScope = getIsolationScope();
			let previousUser = isolationScope.getUser();
			isolationScope.addScopeListener((scope) => {
				const maybeNewUser = scope.getUser();
				if (previousUser?.id !== maybeNewUser?.id || previousUser?.ip_address !== maybeNewUser?.ip_address) {
					captureSession();
					previousUser = maybeNewUser;
				}
			});
			if (lifecycle === "route") addHistoryInstrumentationHandler(({ from, to }) => {
				if (from !== to) {
					startSession({ ignoreDuration: true });
					captureSession();
				}
			});
		}
	};
});
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/integrations/culturecontext.js
var INTEGRATION_NAME$2 = "CultureContext";
var _cultureContextIntegration = (() => {
	return {
		name: INTEGRATION_NAME$2,
		preprocessEvent(event) {
			const culture = getCultureContext();
			if (culture) event.contexts = {
				...event.contexts,
				culture: {
					...culture,
					...event.contexts?.culture
				}
			};
		},
		processSegmentSpan(span) {
			const culture = getCultureContext();
			if (culture) safeSetSpanJSONAttributes(span, {
				"culture.locale": culture.locale,
				"culture.timezone": culture.timezone,
				"culture.calendar": culture.calendar
			});
		}
	};
});
/**
* Captures culture context from the browser.
*
* Enabled by default.
*
* @example
* ```js
* import * as Sentry from '@sentry/browser';
*
* Sentry.init({
*   integrations: [Sentry.cultureContextIntegration()],
* });
* ```
*/
var cultureContextIntegration = defineIntegration(_cultureContextIntegration);
/**
* Returns the culture context from the browser's Intl API.
*/
function getCultureContext() {
	try {
		const intl = WINDOW$1.Intl;
		if (!intl) return;
		const options = intl.DateTimeFormat().resolvedOptions();
		return {
			locale: options.locale,
			timezone: options.timeZone,
			calendar: options.calendar
		};
	} catch {
		return;
	}
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/integrations/globalhandlers.js
var INTEGRATION_NAME$1 = "GlobalHandlers";
var _globalHandlersIntegration = ((options = {}) => {
	const _options = {
		onerror: true,
		onunhandledrejection: true,
		...options
	};
	return {
		name: INTEGRATION_NAME$1,
		setupOnce() {
			Error.stackTraceLimit = 50;
		},
		setup(client) {
			if (_options.onerror) {
				_installGlobalOnErrorHandler(client);
				globalHandlerLog("onerror");
			}
			if (_options.onunhandledrejection) {
				_installGlobalOnUnhandledRejectionHandler(client);
				globalHandlerLog("onunhandledrejection");
			}
		}
	};
});
var globalHandlersIntegration = defineIntegration(_globalHandlersIntegration);
function _installGlobalOnErrorHandler(client) {
	addGlobalErrorInstrumentationHandler((data) => {
		const { stackParser, attachStacktrace } = getOptions();
		if (getClient() !== client || shouldIgnoreOnError()) return;
		const { msg, url, line, column, error } = data;
		const event = _enhanceEventWithInitialFrame(eventFromUnknownInput(stackParser, error || msg, void 0, attachStacktrace, false), url, line, column);
		event.level = "error";
		captureEvent(event, {
			originalException: error,
			mechanism: {
				handled: false,
				type: "auto.browser.global_handlers.onerror"
			}
		});
	});
}
function _installGlobalOnUnhandledRejectionHandler(client) {
	addGlobalUnhandledRejectionInstrumentationHandler((e) => {
		const { stackParser, attachStacktrace } = getOptions();
		if (getClient() !== client || shouldIgnoreOnError()) return;
		const error = _getUnhandledRejectionError(e);
		const event = isPrimitive(error) ? _eventFromRejectionWithPrimitive(error) : eventFromUnknownInput(stackParser, error, void 0, attachStacktrace, true);
		event.level = "error";
		captureEvent(event, {
			originalException: error,
			mechanism: {
				handled: false,
				type: "auto.browser.global_handlers.onunhandledrejection"
			}
		});
	});
}
/**
*
*/
function _getUnhandledRejectionError(error) {
	if (isPrimitive(error)) return error;
	try {
		if ("reason" in error) return error.reason;
		if ("detail" in error && "reason" in error.detail) return error.detail.reason;
	} catch {}
	return error;
}
/**
* Create an event from a promise rejection where the `reason` is a primitive.
*
* @param reason: The `reason` property of the promise rejection
* @returns An Event object with an appropriate `exception` value
*/
function _eventFromRejectionWithPrimitive(reason) {
	return { exception: { values: [{
		type: "UnhandledRejection",
		value: `Non-Error promise rejection captured with value: ${String(reason)}`
	}] } };
}
function _enhanceEventWithInitialFrame(event, url, lineno, colno) {
	const e = event.exception = event.exception || {};
	const ev = e.values = e.values || [];
	const ev0 = ev[0] = ev[0] || {};
	const ev0s = ev0.stacktrace = ev0.stacktrace || {};
	const ev0sf = ev0s.frames = ev0s.frames || [];
	if (ev0sf.length === 0) ev0sf.push({
		colno,
		lineno,
		filename: getFilenameFromUrl(url) ?? getLocationHref(),
		function: "?",
		in_app: true
	});
	return event;
}
function globalHandlerLog(type) {
	DEBUG_BUILD && debug.log(`Global Handler attached: ${type}`);
}
function getOptions() {
	return getClient()?.getOptions() || {
		stackParser: () => [],
		attachStacktrace: false
	};
}
function getFilenameFromUrl(url) {
	if (!isString(url) || url.length === 0) return;
	if (url.startsWith("data:")) return `<${stripDataUrlContent(url, false)}>`;
	return url;
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/integrations/httpcontext.js
/**
* Collects information about HTTP request headers and
* attaches them to the event.
*/
var httpContextIntegration = defineIntegration(() => {
	return {
		name: "HttpContext",
		preprocessEvent(event) {
			if (!WINDOW$1.navigator && !WINDOW$1.location && !WINDOW$1.document) return;
			const reqData = getHttpRequestData();
			const headers = {
				...reqData.headers,
				...event.request?.headers
			};
			event.request = {
				...reqData,
				...event.request,
				headers
			};
		},
		processSegmentSpan(span) {
			if (!WINDOW$1.navigator && !WINDOW$1.location && !WINDOW$1.document) return;
			const reqData = getHttpRequestData();
			safeSetSpanJSONAttributes(span, {
				"url.full": reqData.url || void 0,
				"http.request.header.user_agent": reqData.headers["User-Agent"],
				"http.request.header.referer": reqData.headers["Referer"]
			});
		}
	};
});
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/integrations/linkederrors.js
var DEFAULT_KEY = "cause";
var DEFAULT_LIMIT = 5;
var INTEGRATION_NAME = "LinkedErrors";
var _linkedErrorsIntegration = ((options = {}) => {
	const limit = options.limit || DEFAULT_LIMIT;
	const key = options.key || DEFAULT_KEY;
	return {
		name: INTEGRATION_NAME,
		preprocessEvent(event, hint, client) {
			applyAggregateErrorsToEvent(exceptionFromError, client.getOptions().stackParser, key, limit, event, hint);
		}
	};
});
/**
* Aggregrate linked errors in an event.
*/
var linkedErrorsIntegration = defineIntegration(_linkedErrorsIntegration);
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/utils/detectBrowserExtension.js
/**
* Returns true if the SDK is running in an embedded browser extension.
* Stand-alone browser extensions (which do not share the same data as the main browser page) are fine.
*/
function checkAndWarnIfIsEmbeddedBrowserExtension() {
	if (_isEmbeddedBrowserExtension()) {
		if (DEBUG_BUILD) consoleSandbox(() => {
			console.error("[Sentry] You cannot use Sentry.init() in a browser extension, see: https://docs.sentry.io/platforms/javascript/best-practices/browser-extensions/");
		});
		return true;
	}
	return false;
}
function _isEmbeddedBrowserExtension() {
	if (typeof WINDOW$1.window === "undefined") return false;
	const _window = WINDOW$1;
	if (_window.nw) return false;
	if (!(_window["chrome"] || _window["browser"])?.runtime?.id) return false;
	const href = getLocationHref();
	return !(WINDOW$1 === WINDOW$1.top && /^(?:chrome-extension|moz-extension|ms-browser-extension|safari-web-extension):\/\//.test(href));
}
//#endregion
//#region ../../node_modules/.pnpm/@sentry+browser@10.52.0/node_modules/@sentry/browser/build/npm/esm/prod/sdk.js
/** Get the default integrations for the browser SDK. */
function getDefaultIntegrations(_options) {
	/**
	* Note: Please make sure this stays in sync with Angular SDK, which re-exports
	* `getDefaultIntegrations` but with an adjusted set of integrations.
	*/
	return [
		inboundFiltersIntegration(),
		functionToStringIntegration(),
		conversationIdIntegration(),
		browserApiErrorsIntegration(),
		breadcrumbsIntegration(),
		globalHandlersIntegration(),
		linkedErrorsIntegration(),
		dedupeIntegration(),
		httpContextIntegration(),
		cultureContextIntegration(),
		browserSessionIntegration()
	];
}
/**
* The Sentry Browser SDK Client.
*
* To use this SDK, call the {@link init} function as early as possible when
* loading the web page. To set context information or send manual events, use
* the provided methods.
*
* @example
*
* ```
*
* import { init } from '@sentry/browser';
*
* init({
*   dsn: '__DSN__',
*   // ...
* });
* ```
*
* @example
* ```
*
* import { addBreadcrumb } from '@sentry/browser';
* addBreadcrumb({
*   message: 'My Breadcrumb',
*   // ...
* });
* ```
*
* @example
*
* ```
*
* import * as Sentry from '@sentry/browser';
* Sentry.captureMessage('Hello, world!');
* Sentry.captureException(new Error('Good bye'));
* Sentry.captureEvent({
*   message: 'Manual',
*   stacktrace: [
*     // ...
*   ],
* });
* ```
*
* @see {@link BrowserOptions} for documentation on configuration options.
*/
function init(options = {}) {
	const shouldDisableBecauseIsBrowserExtenstion = !options.skipBrowserExtensionCheck && checkAndWarnIfIsEmbeddedBrowserExtension();
	let defaultIntegrations = options.defaultIntegrations == null ? getDefaultIntegrations() : options.defaultIntegrations;
	return initAndBind(BrowserClient, {
		...options,
		enabled: shouldDisableBecauseIsBrowserExtenstion ? false : options.enabled,
		stackParser: stackParserFromStackParserOptions(options.stackParser || defaultStackParser),
		integrations: getIntegrationsToSetup({
			integrations: options.integrations,
			defaultIntegrations
		}),
		transport: options.transport || makeFetchTransport
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/analytics.js
var _getDefaultProps = null;
var _sentryInitialized = false;
var _pendingSentryUser = void 0;
var _pendingSentryOrgId = void 0;
var PAGEVIEW_TRACKING_STATE_KEY = Symbol.for("agent-native.client.pageviewTracking");
function isLocalAnalyticsHostname(hostname) {
	const h = (hostname || "").toLowerCase();
	return h === "localhost" || h === "127.0.0.1" || h === "::1" || h === "[::1]" || h.endsWith(".localhost") || h.endsWith(".local");
}
function ensureAmplitude() {
	return false;
}
/**
* Query parameters that may carry sensitive values in the URL bar. Browser
* Sentry collects `event.request.url` automatically; without scrubbing,
* share tokens, password params (F-07), email-confirm tokens, etc. land in
* Sentry events and become a recon vector for anyone with project access.
*/
var SENSITIVE_QUERY_PARAMS = new Set([
	"password",
	"p",
	"token",
	"state",
	"code",
	"share",
	"share_token"
]);
function scrubUrl(url) {
	if (!url || typeof url !== "string") return url;
	try {
		const u = new URL(url, "http://placeholder.local");
		let mutated = false;
		for (const key of Array.from(u.searchParams.keys())) if (SENSITIVE_QUERY_PARAMS.has(key.toLowerCase())) {
			u.searchParams.set(key, "<redacted>");
			mutated = true;
		}
		if (!mutated) return url;
		if (u.origin === "http://placeholder.local") return `${u.pathname}${u.search}${u.hash}`;
		return u.toString();
	} catch {
		return url;
	}
}
function shouldDropBrowserSentryNoise(event) {
	const exceptionValues = event.exception?.values ?? [];
	if (exceptionValues.some((value) => value.type === "AgentAutoContinueSignal")) return true;
	const combined = `${exceptionValues.map((value) => `${value.type ?? ""} ${value.value ?? ""}`).join(" ").toLowerCase()} ${event.request?.url?.toLowerCase() ?? ""} ${(event.breadcrumbs ?? []).map((crumb) => {
		const data = crumb.data;
		return [
			crumb.category,
			crumb.message,
			typeof data?.url === "string" ? data.url : ""
		].join(" ");
	}).join(" ").toLowerCase()}`;
	return combined.includes("api2.amplitude.com") && (combined.includes("failed to fetch") || combined.includes("networkerror") || combined.includes("load failed"));
}
function getClientSentryDsn() {
	const env = {
		"BASE_URL": "/",
		"DEV": false,
		"MODE": "production",
		"PROD": true,
		"SSR": true
	};
	return env.VITE_SENTRY_CLIENT_DSN || env.VITE_SENTRY_DSN || window.__AGENT_NATIVE_CONFIG__?.sentryDsn;
}
function ensureSentry() {
	if (_sentryInitialized) return;
	const dsn = getClientSentryDsn();
	if (!dsn) return;
	init({
		dsn,
		environment: window.__AGENT_NATIVE_CONFIG__?.sentryEnvironment || "production",
		beforeSend(event) {
			if (shouldDropBrowserSentryNoise(event)) return null;
			if (event.request?.url) event.request.url = scrubUrl(event.request.url);
			if (Array.isArray(event.breadcrumbs)) {
				for (const crumb of event.breadcrumbs) if (crumb && typeof crumb === "object" && "data" in crumb) {
					const data = crumb.data;
					if (data && typeof data.url === "string") data.url = scrubUrl(data.url);
					if (data && typeof data.from === "string") data.from = scrubUrl(data.from);
					if (data && typeof data.to === "string") data.to = scrubUrl(data.to);
				}
			}
			return event;
		}
	});
	setTag("runtime", "browser");
	_sentryInitialized = true;
	if (_pendingSentryUser !== void 0) {
		setUser(_pendingSentryUser);
		_pendingSentryUser = void 0;
	}
	if (_pendingSentryOrgId !== void 0) {
		setTag("orgId", _pendingSentryOrgId);
		_pendingSentryOrgId = void 0;
	}
}
/**
* Attach the current user to Sentry events from the browser. Pass `null` to
* clear (e.g. on logout). If Sentry isn't initialized yet, the value is
* buffered and applied once `ensureSentry()` runs.
*
* Pass `orgId` to also tag events with the active organization ID — useful
* for filtering Sentry by tenant.
*/
function setSentryUser(user, orgId) {
	if (_sentryInitialized) {
		setUser(user);
		if (orgId !== void 0) setTag("orgId", orgId ?? null);
		return;
	}
	_pendingSentryUser = user;
	if (orgId !== void 0) _pendingSentryOrgId = orgId ?? null;
}
/**
* Capture an exception to Sentry from browser code without forcing the
* caller to depend on `@sentry/browser` directly.
*
* Templates can route a thrown Error through here on a known failure path
* (chunk-upload 500, thumbnail upload, etc.) to attach searchable tags and
* structured extra context. No-ops gracefully when Sentry isn't
* initialized — never throws back into the caller, so a Sentry hiccup
* can't mask the original error.
*/
function captureClientException(error, context = {}) {
	if (typeof window === "undefined") return void 0;
	try {
		ensureSentry();
		return withScope((scope) => {
			if (context.tags) {
				for (const [k, v] of Object.entries(context.tags)) if (typeof v === "string") scope.setTag(k, v);
			}
			if (context.extra) {
				for (const [k, v] of Object.entries(context.extra)) if (v !== void 0) scope.setExtra(k, v);
			}
			if (context.contexts) for (const [k, v] of Object.entries(context.contexts)) scope.setContext(k, v);
			return captureException(error);
		});
	} catch {
		return;
	}
}
/**
* Public browser-side error capture utility, mirroring `trackEvent()`:
* templates can call `captureError(err, { tags, extra, contexts })` without
* depending on Sentry directly. Sentry receives the event when a browser DSN
* is configured; otherwise this is a quiet no-op.
*/
function captureError(error, context = {}) {
	return captureClientException(error, context);
}
function getPageviewTrackingState() {
	const g = globalThis;
	if (!g[PAGEVIEW_TRACKING_STATE_KEY]) g[PAGEVIEW_TRACKING_STATE_KEY] = {
		installed: false,
		lastPageviewKey: null
	};
	return g[PAGEVIEW_TRACKING_STATE_KEY];
}
function configureTracking(options) {
	if (options.getDefaultProps) _getDefaultProps = options.getDefaultProps;
	if (typeof window !== "undefined") {
		ensureSentry();
		ensureAmplitude();
		installPageviewTracking();
	}
}
function inferTemplateName(properties) {
	const app = typeof properties.app === "string" ? properties.app.trim() : "";
	if (!app || app === "localhost") return null;
	if (app.startsWith("agent-native-")) return app.slice(13);
	return app;
}
function resolveProps(name, params) {
	if (typeof window === "undefined") return { ...params };
	const base = {
		url: window.location.origin + window.location.pathname,
		app: window.location.hostname.split(".")[0] || "localhost",
		...params
	};
	const props = _getDefaultProps ? _getDefaultProps(name, base) : base;
	if (props.template === void 0) {
		const template = inferTemplateName(props);
		if (template) return {
			...props,
			template
		};
	}
	return props;
}
function pageviewKey() {
	return window.location.href;
}
function pageviewProperties(reason) {
	const properties = {
		url: scrubUrl(window.location.href),
		path: window.location.pathname,
		hostname: window.location.hostname,
		navigation_type: reason
	};
	if (window.location.search) properties.search = scrubUrl(window.location.search);
	if (typeof document !== "undefined") {
		if (document.referrer) properties.referrer = scrubUrl(document.referrer);
		if (document.title) properties.title = document.title;
	}
	return properties;
}
function emitPageview(reason) {
	if (isLocalAnalyticsHostname(window.location.hostname)) return;
	const state = getPageviewTrackingState();
	const key = pageviewKey();
	if (state.lastPageviewKey === key) return;
	state.lastPageviewKey = key;
	trackEvent("pageview", pageviewProperties(reason));
}
function schedulePageview(reason) {
	const run = () => emitPageview(reason);
	if (typeof queueMicrotask === "function") {
		queueMicrotask(run);
		return;
	}
	window.setTimeout(run, 0);
}
function installPageviewTracking() {
	const state = getPageviewTrackingState();
	if (state.installed) return;
	state.installed = true;
	schedulePageview("load");
	const originalPushState = window.history.pushState;
	const originalReplaceState = window.history.replaceState;
	window.history.pushState = function pushState(...args) {
		const result = originalPushState.apply(this, args);
		schedulePageview("pushState");
		return result;
	};
	window.history.replaceState = function replaceState(...args) {
		const result = originalReplaceState.apply(this, args);
		schedulePageview("replaceState");
		return result;
	};
	window.addEventListener("popstate", () => schedulePageview("popstate"));
}
function sendAgentNativeAnalytics(name, properties) {
	if (isLocalAnalyticsHostname(window.location.hostname)) return;
}
function trackEvent(name, params) {
	if (typeof window === "undefined") return;
	ensureSentry();
	const props = resolveProps(name, params);
	window.gtag?.("event", name.replace(/\s+/g, "_"), props);
	if (ensureAmplitude()) track(name, props);
	sendAgentNativeAnalytics(name, props);
}
function trackSessionStatus(signedIn) {
	trackEvent("session status", { signed_in: signedIn });
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/use-session.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
/**
* Client-side hook to get the current auth session.
*
* - In dev mode: immediately returns { email: "local@localhost" }
* - In production: fetches /_agent-native/auth/session and returns the result
*
* Templates should use this instead of building their own auth context.
*/
function useSession() {
	const [session, setSession] = (0, import_react.useState)(null);
	const [isLoading, setIsLoading] = (0, import_react.useState)(true);
	const trackedRef = (0, import_react.useRef)(false);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		async function fetchSession() {
			let signedIn = false;
			let resolved = null;
			try {
				const res = await fetch(agentNativePath("/_agent-native/auth/session"));
				if (!res.ok) {
					setSession(null);
					return;
				}
				const data = await res.json();
				if (!cancelled) if (data.error) setSession(null);
				else {
					resolved = data;
					setSession(resolved);
					signedIn = true;
				}
			} catch {
				if (!cancelled) setSession(null);
			} finally {
				if (!cancelled) {
					setIsLoading(false);
					if (resolved) setSentryUser({
						id: resolved.userId,
						email: resolved.email,
						username: resolved.name
					}, resolved.orgId ?? null);
					else setSentryUser(null, null);
					if (!trackedRef.current) {
						trackedRef.current = true;
						trackSessionStatus(signedIn);
					}
				}
			}
		}
		fetchSession();
		return () => {
			cancelled = true;
		};
	}, []);
	return {
		session,
		isLoading
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-collection@1.1.7_@types+react-dom@19.2.3_@types+react@19.2.14__@types+r_b94f5365b88697a700662930c56ccffc/node_modules/@radix-ui/react-collection/dist/index.mjs
var import_jsx_runtime = require_jsx_runtime();
function createCollection(name) {
	const PROVIDER_NAME = name + "CollectionProvider";
	const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
	const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(PROVIDER_NAME, {
		collectionRef: { current: null },
		itemMap: /* @__PURE__ */ new Map()
	});
	const CollectionProvider = (props) => {
		const { scope, children } = props;
		const ref = import_react.useRef(null);
		const itemMap = import_react.useRef(/* @__PURE__ */ new Map()).current;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionProviderImpl, {
			scope,
			itemMap,
			collectionRef: ref,
			children
		});
	};
	CollectionProvider.displayName = PROVIDER_NAME;
	const COLLECTION_SLOT_NAME = name + "CollectionSlot";
	const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
	const CollectionSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children } = props;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionSlotImpl, {
			ref: useComposedRefs(forwardedRef, useCollectionContext(COLLECTION_SLOT_NAME, scope).collectionRef),
			children
		});
	});
	CollectionSlot.displayName = COLLECTION_SLOT_NAME;
	const ITEM_SLOT_NAME = name + "CollectionItemSlot";
	const ITEM_DATA_ATTR = "data-radix-collection-item";
	const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
	const CollectionItemSlot = import_react.forwardRef((props, forwardedRef) => {
		const { scope, children, ...itemData } = props;
		const ref = import_react.useRef(null);
		const composedRefs = useComposedRefs(forwardedRef, ref);
		const context = useCollectionContext(ITEM_SLOT_NAME, scope);
		import_react.useEffect(() => {
			context.itemMap.set(ref, {
				ref,
				...itemData
			});
			return () => void context.itemMap.delete(ref);
		});
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CollectionItemSlotImpl, {
			[ITEM_DATA_ATTR]: "",
			ref: composedRefs,
			children
		});
	});
	CollectionItemSlot.displayName = ITEM_SLOT_NAME;
	function useCollection(scope) {
		const context = useCollectionContext(name + "CollectionConsumer", scope);
		return import_react.useCallback(() => {
			const collectionNode = context.collectionRef.current;
			if (!collectionNode) return [];
			const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
			return Array.from(context.itemMap.values()).sort((a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current));
		}, [context.collectionRef, context.itemMap]);
	}
	return [
		{
			Provider: CollectionProvider,
			Slot: CollectionSlot,
			ItemSlot: CollectionItemSlot
		},
		useCollection,
		createCollectionScope
	];
}
//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-direction@1.1.1_@types+react@19.2.14_react@19.2.6/node_modules/@radix-ui/react-direction/dist/index.mjs
var DirectionContext = import_react.createContext(void 0);
function useDirection(localDir) {
	const globalDir = import_react.useContext(DirectionContext);
	return localDir || globalDir || "ltr";
}
//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-use-previous@1.1.1_@types+react@19.2.14_react@19.2.6/node_modules/@radix-ui/react-use-previous/dist/index.mjs
function usePrevious(value) {
	const ref = import_react.useRef({
		value,
		previous: value
	});
	return import_react.useMemo(() => {
		if (ref.current.value !== value) {
			ref.current.previous = ref.current.value;
			ref.current.value = value;
		}
		return ref.current.previous;
	}, [value]);
}
//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+number@1.1.1/node_modules/@radix-ui/number/dist/index.mjs
function clamp(value, [min, max]) {
	return Math.min(max, Math.max(min, value));
}
//#endregion
//#region ../../node_modules/.pnpm/@radix-ui+react-select@2.2.6_@types+react-dom@19.2.3_@types+react@19.2.14__@types+react_682a989a3617012ce093f43297729adf/node_modules/@radix-ui/react-select/dist/index.mjs
var import_react_dom = /* @__PURE__ */ __toESM(require_react_dom(), 1);
var OPEN_KEYS = [
	" ",
	"Enter",
	"ArrowUp",
	"ArrowDown"
];
var SELECTION_KEYS = [" ", "Enter"];
var SELECT_NAME = "Select";
var [Collection, useCollection, createCollectionScope] = createCollection(SELECT_NAME);
var [createSelectContext, createSelectScope] = createContextScope(SELECT_NAME, [createCollectionScope, createPopperScope]);
var usePopperScope = createPopperScope();
var [SelectProvider, useSelectContext] = createSelectContext(SELECT_NAME);
var [SelectNativeOptionsProvider, useSelectNativeOptionsContext] = createSelectContext(SELECT_NAME);
var Select = (props) => {
	const { __scopeSelect, children, open: openProp, defaultOpen, onOpenChange, value: valueProp, defaultValue, onValueChange, dir, name, autoComplete, disabled, required, form } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const [trigger, setTrigger] = import_react.useState(null);
	const [valueNode, setValueNode] = import_react.useState(null);
	const [valueNodeHasChildren, setValueNodeHasChildren] = import_react.useState(false);
	const direction = useDirection(dir);
	const [open, setOpen] = useControllableState({
		prop: openProp,
		defaultProp: defaultOpen ?? false,
		onChange: onOpenChange,
		caller: SELECT_NAME
	});
	const [value, setValue] = useControllableState({
		prop: valueProp,
		defaultProp: defaultValue,
		onChange: onValueChange,
		caller: SELECT_NAME
	});
	const triggerPointerDownPosRef = import_react.useRef(null);
	const isFormControl = trigger ? form || !!trigger.closest("form") : true;
	const [nativeOptionsSet, setNativeOptionsSet] = import_react.useState(/* @__PURE__ */ new Set());
	const nativeSelectKey = Array.from(nativeOptionsSet).map((option) => option.props.value).join(";");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Root2$1, {
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectProvider, {
			required,
			scope: __scopeSelect,
			trigger,
			onTriggerChange: setTrigger,
			valueNode,
			onValueNodeChange: setValueNode,
			valueNodeHasChildren,
			onValueNodeHasChildrenChange: setValueNodeHasChildren,
			contentId: useId(),
			value,
			onValueChange: setValue,
			open,
			onOpenChange: setOpen,
			dir: direction,
			triggerPointerDownPosRef,
			disabled,
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Provider, {
				scope: __scopeSelect,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectNativeOptionsProvider, {
					scope: props.__scopeSelect,
					onNativeOptionAdd: import_react.useCallback((option) => {
						setNativeOptionsSet((prev) => new Set(prev).add(option));
					}, []),
					onNativeOptionRemove: import_react.useCallback((option) => {
						setNativeOptionsSet((prev) => {
							const optionsSet = new Set(prev);
							optionsSet.delete(option);
							return optionsSet;
						});
					}, []),
					children
				})
			}), isFormControl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectBubbleInput, {
				"aria-hidden": true,
				required,
				tabIndex: -1,
				name,
				autoComplete,
				value,
				onChange: (event) => setValue(event.target.value),
				disabled,
				form,
				children: [value === void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { value: "" }) : null, Array.from(nativeOptionsSet)]
			}, nativeSelectKey) : null]
		})
	});
};
Select.displayName = SELECT_NAME;
var TRIGGER_NAME = "SelectTrigger";
var SelectTrigger = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, disabled = false, ...triggerProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const context = useSelectContext(TRIGGER_NAME, __scopeSelect);
	const isDisabled = context.disabled || disabled;
	const composedRefs = useComposedRefs(forwardedRef, context.onTriggerChange);
	const getItems = useCollection(__scopeSelect);
	const pointerTypeRef = import_react.useRef("touch");
	const [searchRef, handleTypeaheadSearch, resetTypeahead] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.value === context.value));
		if (nextItem !== void 0) context.onValueChange(nextItem.value);
	});
	const handleOpen = (pointerEvent) => {
		if (!isDisabled) {
			context.onOpenChange(true);
			resetTypeahead();
		}
		if (pointerEvent) context.triggerPointerDownPosRef.current = {
			x: Math.round(pointerEvent.pageX),
			y: Math.round(pointerEvent.pageY)
		};
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Anchor, {
		asChild: true,
		...popperScope,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.button, {
			type: "button",
			role: "combobox",
			"aria-controls": context.contentId,
			"aria-expanded": context.open,
			"aria-required": context.required,
			"aria-autocomplete": "none",
			dir: context.dir,
			"data-state": context.open ? "open" : "closed",
			disabled: isDisabled,
			"data-disabled": isDisabled ? "" : void 0,
			"data-placeholder": shouldShowPlaceholder(context.value) ? "" : void 0,
			...triggerProps,
			ref: composedRefs,
			onClick: composeEventHandlers(triggerProps.onClick, (event) => {
				event.currentTarget.focus();
				if (pointerTypeRef.current !== "mouse") handleOpen(event);
			}),
			onPointerDown: composeEventHandlers(triggerProps.onPointerDown, (event) => {
				pointerTypeRef.current = event.pointerType;
				const target = event.target;
				if (target.hasPointerCapture(event.pointerId)) target.releasePointerCapture(event.pointerId);
				if (event.button === 0 && event.ctrlKey === false && event.pointerType === "mouse") {
					handleOpen(event);
					event.preventDefault();
				}
			}),
			onKeyDown: composeEventHandlers(triggerProps.onKeyDown, (event) => {
				const isTypingAhead = searchRef.current !== "";
				if (!(event.ctrlKey || event.altKey || event.metaKey) && event.key.length === 1) handleTypeaheadSearch(event.key);
				if (isTypingAhead && event.key === " ") return;
				if (OPEN_KEYS.includes(event.key)) {
					handleOpen();
					event.preventDefault();
				}
			})
		})
	});
});
SelectTrigger.displayName = TRIGGER_NAME;
var VALUE_NAME = "SelectValue";
var SelectValue = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, className, style, children, placeholder = "", ...valueProps } = props;
	const context = useSelectContext(VALUE_NAME, __scopeSelect);
	const { onValueNodeHasChildrenChange } = context;
	const hasChildren = children !== void 0;
	const composedRefs = useComposedRefs(forwardedRef, context.onValueNodeChange);
	useLayoutEffect2(() => {
		onValueNodeHasChildrenChange(hasChildren);
	}, [onValueNodeHasChildrenChange, hasChildren]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		...valueProps,
		ref: composedRefs,
		style: { pointerEvents: "none" },
		children: shouldShowPlaceholder(context.value) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children: placeholder }) : children
	});
});
SelectValue.displayName = VALUE_NAME;
var ICON_NAME = "SelectIcon";
var SelectIcon = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, children, ...iconProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		"aria-hidden": true,
		...iconProps,
		ref: forwardedRef,
		children: children || "▼"
	});
});
SelectIcon.displayName = ICON_NAME;
var PORTAL_NAME = "SelectPortal";
var SelectPortal = (props) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal$1, {
		asChild: true,
		...props
	});
};
SelectPortal.displayName = PORTAL_NAME;
var CONTENT_NAME = "SelectContent";
var SelectContent = import_react.forwardRef((props, forwardedRef) => {
	const context = useSelectContext(CONTENT_NAME, props.__scopeSelect);
	const [fragment, setFragment] = import_react.useState();
	useLayoutEffect2(() => {
		setFragment(new DocumentFragment());
	}, []);
	if (!context.open) {
		const frag = fragment;
		return frag ? import_react_dom.createPortal(/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentProvider, {
			scope: props.__scopeSelect,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, {
				scope: props.__scopeSelect,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: props.children })
			})
		}), frag) : null;
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentImpl, {
		...props,
		ref: forwardedRef
	});
});
SelectContent.displayName = CONTENT_NAME;
var CONTENT_MARGIN = 10;
var [SelectContentProvider, useSelectContentContext] = createSelectContext(CONTENT_NAME);
var CONTENT_IMPL_NAME = "SelectContentImpl";
var Slot = createSlot("SelectContent.RemoveScroll");
var SelectContentImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, position = "item-aligned", onCloseAutoFocus, onEscapeKeyDown, onPointerDownOutside, side, sideOffset, align, alignOffset, arrowPadding, collisionBoundary, collisionPadding, sticky, hideWhenDetached, avoidCollisions, ...contentProps } = props;
	const context = useSelectContext(CONTENT_NAME, __scopeSelect);
	const [content, setContent] = import_react.useState(null);
	const [viewport, setViewport] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const [selectedItem, setSelectedItem] = import_react.useState(null);
	const [selectedItemText, setSelectedItemText] = import_react.useState(null);
	const getItems = useCollection(__scopeSelect);
	const [isPositioned, setIsPositioned] = import_react.useState(false);
	const firstValidItemFoundRef = import_react.useRef(false);
	import_react.useEffect(() => {
		if (content) return hideOthers(content);
	}, [content]);
	useFocusGuards();
	const focusFirst = import_react.useCallback((candidates) => {
		const [firstItem, ...restItems] = getItems().map((item) => item.ref.current);
		const [lastItem] = restItems.slice(-1);
		const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
		for (const candidate of candidates) {
			if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
			candidate?.scrollIntoView({ block: "nearest" });
			if (candidate === firstItem && viewport) viewport.scrollTop = 0;
			if (candidate === lastItem && viewport) viewport.scrollTop = viewport.scrollHeight;
			candidate?.focus();
			if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
		}
	}, [getItems, viewport]);
	const focusSelectedItem = import_react.useCallback(() => focusFirst([selectedItem, content]), [
		focusFirst,
		selectedItem,
		content
	]);
	import_react.useEffect(() => {
		if (isPositioned) focusSelectedItem();
	}, [isPositioned, focusSelectedItem]);
	const { onOpenChange, triggerPointerDownPosRef } = context;
	import_react.useEffect(() => {
		if (content) {
			let pointerMoveDelta = {
				x: 0,
				y: 0
			};
			const handlePointerMove = (event) => {
				pointerMoveDelta = {
					x: Math.abs(Math.round(event.pageX) - (triggerPointerDownPosRef.current?.x ?? 0)),
					y: Math.abs(Math.round(event.pageY) - (triggerPointerDownPosRef.current?.y ?? 0))
				};
			};
			const handlePointerUp = (event) => {
				if (pointerMoveDelta.x <= 10 && pointerMoveDelta.y <= 10) event.preventDefault();
				else if (!content.contains(event.target)) onOpenChange(false);
				document.removeEventListener("pointermove", handlePointerMove);
				triggerPointerDownPosRef.current = null;
			};
			if (triggerPointerDownPosRef.current !== null) {
				document.addEventListener("pointermove", handlePointerMove);
				document.addEventListener("pointerup", handlePointerUp, {
					capture: true,
					once: true
				});
			}
			return () => {
				document.removeEventListener("pointermove", handlePointerMove);
				document.removeEventListener("pointerup", handlePointerUp, { capture: true });
			};
		}
	}, [
		content,
		onOpenChange,
		triggerPointerDownPosRef
	]);
	import_react.useEffect(() => {
		const close = () => onOpenChange(false);
		window.addEventListener("blur", close);
		window.addEventListener("resize", close);
		return () => {
			window.removeEventListener("blur", close);
			window.removeEventListener("resize", close);
		};
	}, [onOpenChange]);
	const [searchRef, handleTypeaheadSearch] = useTypeaheadSearch((search) => {
		const enabledItems = getItems().filter((item) => !item.disabled);
		const nextItem = findNextItem(enabledItems, search, enabledItems.find((item) => item.ref.current === document.activeElement));
		if (nextItem) setTimeout(() => nextItem.ref.current.focus());
	});
	const itemRefCallback = import_react.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) {
			setSelectedItem(node);
			if (isFirstValidItem) firstValidItemFoundRef.current = true;
		}
	}, [context.value]);
	const handleItemLeave = import_react.useCallback(() => content?.focus(), [content]);
	const itemTextRefCallback = import_react.useCallback((node, value, disabled) => {
		const isFirstValidItem = !firstValidItemFoundRef.current && !disabled;
		if (context.value !== void 0 && context.value === value || isFirstValidItem) setSelectedItemText(node);
	}, [context.value]);
	const SelectPosition = position === "popper" ? SelectPopperPosition : SelectItemAlignedPosition;
	const popperContentProps = SelectPosition === SelectPopperPosition ? {
		side,
		sideOffset,
		align,
		alignOffset,
		arrowPadding,
		collisionBoundary,
		collisionPadding,
		sticky,
		hideWhenDetached,
		avoidCollisions
	} : {};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectContentProvider, {
		scope: __scopeSelect,
		content,
		viewport,
		onViewportChange: setViewport,
		itemRefCallback,
		selectedItem,
		onItemLeave: handleItemLeave,
		itemTextRefCallback,
		focusSelectedItem,
		selectedItemText,
		position,
		isPositioned,
		searchRef,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReactRemoveScroll, {
			as: Slot,
			allowPinchZoom: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FocusScope, {
				asChild: true,
				trapped: context.open,
				onMountAutoFocus: (event) => {
					event.preventDefault();
				},
				onUnmountAutoFocus: composeEventHandlers(onCloseAutoFocus, (event) => {
					context.trigger?.focus({ preventScroll: true });
					event.preventDefault();
				}),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DismissableLayer, {
					asChild: true,
					disableOutsidePointerEvents: true,
					onEscapeKeyDown,
					onPointerDownOutside,
					onFocusOutside: (event) => event.preventDefault(),
					onDismiss: () => context.onOpenChange(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectPosition, {
						role: "listbox",
						id: context.contentId,
						"data-state": context.open ? "open" : "closed",
						dir: context.dir,
						onContextMenu: (event) => event.preventDefault(),
						...contentProps,
						...popperContentProps,
						onPlaced: () => setIsPositioned(true),
						ref: composedRefs,
						style: {
							display: "flex",
							flexDirection: "column",
							outline: "none",
							...contentProps.style
						},
						onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
							const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
							if (event.key === "Tab") event.preventDefault();
							if (!isModifierKey && event.key.length === 1) handleTypeaheadSearch(event.key);
							if ([
								"ArrowUp",
								"ArrowDown",
								"Home",
								"End"
							].includes(event.key)) {
								let candidateNodes = getItems().filter((item) => !item.disabled).map((item) => item.ref.current);
								if (["ArrowUp", "End"].includes(event.key)) candidateNodes = candidateNodes.slice().reverse();
								if (["ArrowUp", "ArrowDown"].includes(event.key)) {
									const currentElement = event.target;
									const currentIndex = candidateNodes.indexOf(currentElement);
									candidateNodes = candidateNodes.slice(currentIndex + 1);
								}
								setTimeout(() => focusFirst(candidateNodes));
								event.preventDefault();
							}
						})
					})
				})
			})
		})
	});
});
SelectContentImpl.displayName = CONTENT_IMPL_NAME;
var ITEM_ALIGNED_POSITION_NAME = "SelectItemAlignedPosition";
var SelectItemAlignedPosition = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, onPlaced, ...popperProps } = props;
	const context = useSelectContext(CONTENT_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(CONTENT_NAME, __scopeSelect);
	const [contentWrapper, setContentWrapper] = import_react.useState(null);
	const [content, setContent] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setContent(node));
	const getItems = useCollection(__scopeSelect);
	const shouldExpandOnScrollRef = import_react.useRef(false);
	const shouldRepositionRef = import_react.useRef(true);
	const { viewport, selectedItem, selectedItemText, focusSelectedItem } = contentContext;
	const position = import_react.useCallback(() => {
		if (context.trigger && context.valueNode && contentWrapper && content && viewport && selectedItem && selectedItemText) {
			const triggerRect = context.trigger.getBoundingClientRect();
			const contentRect = content.getBoundingClientRect();
			const valueNodeRect = context.valueNode.getBoundingClientRect();
			const itemTextRect = selectedItemText.getBoundingClientRect();
			if (context.dir !== "rtl") {
				const itemTextOffset = itemTextRect.left - contentRect.left;
				const left = valueNodeRect.left - itemTextOffset;
				const leftDelta = triggerRect.left - left;
				const minContentWidth = triggerRect.width + leftDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const rightEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedLeft = clamp(left, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, rightEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.left = clampedLeft + "px";
			} else {
				const itemTextOffset = contentRect.right - itemTextRect.right;
				const right = window.innerWidth - valueNodeRect.right - itemTextOffset;
				const rightDelta = window.innerWidth - triggerRect.right - right;
				const minContentWidth = triggerRect.width + rightDelta;
				const contentWidth = Math.max(minContentWidth, contentRect.width);
				const leftEdge = window.innerWidth - CONTENT_MARGIN;
				const clampedRight = clamp(right, [CONTENT_MARGIN, Math.max(CONTENT_MARGIN, leftEdge - contentWidth)]);
				contentWrapper.style.minWidth = minContentWidth + "px";
				contentWrapper.style.right = clampedRight + "px";
			}
			const items = getItems();
			const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
			const itemsHeight = viewport.scrollHeight;
			const contentStyles = window.getComputedStyle(content);
			const contentBorderTopWidth = parseInt(contentStyles.borderTopWidth, 10);
			const contentPaddingTop = parseInt(contentStyles.paddingTop, 10);
			const contentBorderBottomWidth = parseInt(contentStyles.borderBottomWidth, 10);
			const contentPaddingBottom = parseInt(contentStyles.paddingBottom, 10);
			const fullContentHeight = contentBorderTopWidth + contentPaddingTop + itemsHeight + contentPaddingBottom + contentBorderBottomWidth;
			const minContentHeight = Math.min(selectedItem.offsetHeight * 5, fullContentHeight);
			const viewportStyles = window.getComputedStyle(viewport);
			const viewportPaddingTop = parseInt(viewportStyles.paddingTop, 10);
			const viewportPaddingBottom = parseInt(viewportStyles.paddingBottom, 10);
			const topEdgeToTriggerMiddle = triggerRect.top + triggerRect.height / 2 - CONTENT_MARGIN;
			const triggerMiddleToBottomEdge = availableHeight - topEdgeToTriggerMiddle;
			const selectedItemHalfHeight = selectedItem.offsetHeight / 2;
			const itemOffsetMiddle = selectedItem.offsetTop + selectedItemHalfHeight;
			const contentTopToItemMiddle = contentBorderTopWidth + contentPaddingTop + itemOffsetMiddle;
			const itemMiddleToContentBottom = fullContentHeight - contentTopToItemMiddle;
			if (contentTopToItemMiddle <= topEdgeToTriggerMiddle) {
				const isLastItem = items.length > 0 && selectedItem === items[items.length - 1].ref.current;
				contentWrapper.style.bottom = "0px";
				const viewportOffsetBottom = content.clientHeight - viewport.offsetTop - viewport.offsetHeight;
				const height = contentTopToItemMiddle + Math.max(triggerMiddleToBottomEdge, selectedItemHalfHeight + (isLastItem ? viewportPaddingBottom : 0) + viewportOffsetBottom + contentBorderBottomWidth);
				contentWrapper.style.height = height + "px";
			} else {
				const isFirstItem = items.length > 0 && selectedItem === items[0].ref.current;
				contentWrapper.style.top = "0px";
				const height = Math.max(topEdgeToTriggerMiddle, contentBorderTopWidth + viewport.offsetTop + (isFirstItem ? viewportPaddingTop : 0) + selectedItemHalfHeight) + itemMiddleToContentBottom;
				contentWrapper.style.height = height + "px";
				viewport.scrollTop = contentTopToItemMiddle - topEdgeToTriggerMiddle + viewport.offsetTop;
			}
			contentWrapper.style.margin = `${CONTENT_MARGIN}px 0`;
			contentWrapper.style.minHeight = minContentHeight + "px";
			contentWrapper.style.maxHeight = availableHeight + "px";
			onPlaced?.();
			requestAnimationFrame(() => shouldExpandOnScrollRef.current = true);
		}
	}, [
		getItems,
		context.trigger,
		context.valueNode,
		contentWrapper,
		content,
		viewport,
		selectedItem,
		selectedItemText,
		context.dir,
		onPlaced
	]);
	useLayoutEffect2(() => position(), [position]);
	const [contentZIndex, setContentZIndex] = import_react.useState();
	useLayoutEffect2(() => {
		if (content) setContentZIndex(window.getComputedStyle(content).zIndex);
	}, [content]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectViewportProvider, {
		scope: __scopeSelect,
		contentWrapper,
		shouldExpandOnScrollRef,
		onScrollButtonChange: import_react.useCallback((node) => {
			if (node && shouldRepositionRef.current === true) {
				position();
				focusSelectedItem?.();
				shouldRepositionRef.current = false;
			}
		}, [position, focusSelectedItem]),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			ref: setContentWrapper,
			style: {
				display: "flex",
				flexDirection: "column",
				position: "fixed",
				zIndex: contentZIndex
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				...popperProps,
				ref: composedRefs,
				style: {
					boxSizing: "border-box",
					maxHeight: "100%",
					...popperProps.style
				}
			})
		})
	});
});
SelectItemAlignedPosition.displayName = ITEM_ALIGNED_POSITION_NAME;
var POPPER_POSITION_NAME = "SelectPopperPosition";
var SelectPopperPosition = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, align = "start", collisionPadding = CONTENT_MARGIN, ...popperProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
		...popperScope,
		...popperProps,
		ref: forwardedRef,
		align,
		collisionPadding,
		style: {
			boxSizing: "border-box",
			...popperProps.style,
			"--radix-select-content-transform-origin": "var(--radix-popper-transform-origin)",
			"--radix-select-content-available-width": "var(--radix-popper-available-width)",
			"--radix-select-content-available-height": "var(--radix-popper-available-height)",
			"--radix-select-trigger-width": "var(--radix-popper-anchor-width)",
			"--radix-select-trigger-height": "var(--radix-popper-anchor-height)"
		}
	});
});
SelectPopperPosition.displayName = POPPER_POSITION_NAME;
var [SelectViewportProvider, useSelectViewportContext] = createSelectContext(CONTENT_NAME, {});
var VIEWPORT_NAME = "SelectViewport";
var SelectViewport = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, nonce, ...viewportProps } = props;
	const contentContext = useSelectContentContext(VIEWPORT_NAME, __scopeSelect);
	const viewportContext = useSelectViewportContext(VIEWPORT_NAME, __scopeSelect);
	const composedRefs = useComposedRefs(forwardedRef, contentContext.onViewportChange);
	const prevScrollTopRef = import_react.useRef(0);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("style", {
		dangerouslySetInnerHTML: { __html: `[data-radix-select-viewport]{scrollbar-width:none;-ms-overflow-style:none;-webkit-overflow-scrolling:touch;}[data-radix-select-viewport]::-webkit-scrollbar{display:none}` },
		nonce
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.Slot, {
		scope: __scopeSelect,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			"data-radix-select-viewport": "",
			role: "presentation",
			...viewportProps,
			ref: composedRefs,
			style: {
				position: "relative",
				flex: 1,
				overflow: "hidden auto",
				...viewportProps.style
			},
			onScroll: composeEventHandlers(viewportProps.onScroll, (event) => {
				const viewport = event.currentTarget;
				const { contentWrapper, shouldExpandOnScrollRef } = viewportContext;
				if (shouldExpandOnScrollRef?.current && contentWrapper) {
					const scrolledBy = Math.abs(prevScrollTopRef.current - viewport.scrollTop);
					if (scrolledBy > 0) {
						const availableHeight = window.innerHeight - CONTENT_MARGIN * 2;
						const cssMinHeight = parseFloat(contentWrapper.style.minHeight);
						const cssHeight = parseFloat(contentWrapper.style.height);
						const prevHeight = Math.max(cssMinHeight, cssHeight);
						if (prevHeight < availableHeight) {
							const nextHeight = prevHeight + scrolledBy;
							const clampedNextHeight = Math.min(availableHeight, nextHeight);
							const heightDiff = nextHeight - clampedNextHeight;
							contentWrapper.style.height = clampedNextHeight + "px";
							if (contentWrapper.style.bottom === "0px") {
								viewport.scrollTop = heightDiff > 0 ? heightDiff : 0;
								contentWrapper.style.justifyContent = "flex-end";
							}
						}
					}
				}
				prevScrollTopRef.current = viewport.scrollTop;
			})
		})
	})] });
});
SelectViewport.displayName = VIEWPORT_NAME;
var GROUP_NAME = "SelectGroup";
var [SelectGroupContextProvider, useSelectGroupContext] = createSelectContext(GROUP_NAME);
var SelectGroup = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...groupProps } = props;
	const groupId = useId();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectGroupContextProvider, {
		scope: __scopeSelect,
		id: groupId,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
			role: "group",
			"aria-labelledby": groupId,
			...groupProps,
			ref: forwardedRef
		})
	});
});
SelectGroup.displayName = GROUP_NAME;
var LABEL_NAME = "SelectLabel";
var SelectLabel = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...labelProps } = props;
	const groupContext = useSelectGroupContext(LABEL_NAME, __scopeSelect);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		id: groupContext.id,
		...labelProps,
		ref: forwardedRef
	});
});
SelectLabel.displayName = LABEL_NAME;
var ITEM_NAME = "SelectItem";
var [SelectItemContextProvider, useSelectItemContext] = createSelectContext(ITEM_NAME);
var SelectItem = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, value, disabled = false, textValue: textValueProp, ...itemProps } = props;
	const context = useSelectContext(ITEM_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_NAME, __scopeSelect);
	const isSelected = context.value === value;
	const [textValue, setTextValue] = import_react.useState(textValueProp ?? "");
	const [isFocused, setIsFocused] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, (node) => contentContext.itemRefCallback?.(node, value, disabled));
	const textId = useId();
	const pointerTypeRef = import_react.useRef("touch");
	const handleSelect = () => {
		if (!disabled) {
			context.onValueChange(value);
			context.onOpenChange(false);
		}
	};
	if (value === "") throw new Error("A <Select.Item /> must have a value prop that is not an empty string. This is because the Select value can be set to an empty string to clear the selection and show the placeholder.");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItemContextProvider, {
		scope: __scopeSelect,
		value,
		disabled,
		textId,
		isSelected,
		onItemTextChange: import_react.useCallback((node) => {
			setTextValue((prevTextValue) => prevTextValue || (node?.textContent ?? "").trim());
		}, []),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Collection.ItemSlot, {
			scope: __scopeSelect,
			value,
			disabled,
			textValue,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
				role: "option",
				"aria-labelledby": textId,
				"data-highlighted": isFocused ? "" : void 0,
				"aria-selected": isSelected && isFocused,
				"data-state": isSelected ? "checked" : "unchecked",
				"aria-disabled": disabled || void 0,
				"data-disabled": disabled ? "" : void 0,
				tabIndex: disabled ? void 0 : -1,
				...itemProps,
				ref: composedRefs,
				onFocus: composeEventHandlers(itemProps.onFocus, () => setIsFocused(true)),
				onBlur: composeEventHandlers(itemProps.onBlur, () => setIsFocused(false)),
				onClick: composeEventHandlers(itemProps.onClick, () => {
					if (pointerTypeRef.current !== "mouse") handleSelect();
				}),
				onPointerUp: composeEventHandlers(itemProps.onPointerUp, () => {
					if (pointerTypeRef.current === "mouse") handleSelect();
				}),
				onPointerDown: composeEventHandlers(itemProps.onPointerDown, (event) => {
					pointerTypeRef.current = event.pointerType;
				}),
				onPointerMove: composeEventHandlers(itemProps.onPointerMove, (event) => {
					pointerTypeRef.current = event.pointerType;
					if (disabled) contentContext.onItemLeave?.();
					else if (pointerTypeRef.current === "mouse") event.currentTarget.focus({ preventScroll: true });
				}),
				onPointerLeave: composeEventHandlers(itemProps.onPointerLeave, (event) => {
					if (event.currentTarget === document.activeElement) contentContext.onItemLeave?.();
				}),
				onKeyDown: composeEventHandlers(itemProps.onKeyDown, (event) => {
					if (contentContext.searchRef?.current !== "" && event.key === " ") return;
					if (SELECTION_KEYS.includes(event.key)) handleSelect();
					if (event.key === " ") event.preventDefault();
				})
			})
		})
	});
});
SelectItem.displayName = ITEM_NAME;
var ITEM_TEXT_NAME = "SelectItemText";
var SelectItemText = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, className, style, ...itemTextProps } = props;
	const context = useSelectContext(ITEM_TEXT_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ITEM_TEXT_NAME, __scopeSelect);
	const itemContext = useSelectItemContext(ITEM_TEXT_NAME, __scopeSelect);
	const nativeOptionsContext = useSelectNativeOptionsContext(ITEM_TEXT_NAME, __scopeSelect);
	const [itemTextNode, setItemTextNode] = import_react.useState(null);
	const composedRefs = useComposedRefs(forwardedRef, (node) => setItemTextNode(node), itemContext.onItemTextChange, (node) => contentContext.itemTextRefCallback?.(node, itemContext.value, itemContext.disabled));
	const textContent = itemTextNode?.textContent;
	const nativeOption = import_react.useMemo(() => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
		value: itemContext.value,
		disabled: itemContext.disabled,
		children: textContent
	}, itemContext.value), [
		itemContext.disabled,
		itemContext.value,
		textContent
	]);
	const { onNativeOptionAdd, onNativeOptionRemove } = nativeOptionsContext;
	useLayoutEffect2(() => {
		onNativeOptionAdd(nativeOption);
		return () => onNativeOptionRemove(nativeOption);
	}, [
		onNativeOptionAdd,
		onNativeOptionRemove,
		nativeOption
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		id: itemContext.textId,
		...itemTextProps,
		ref: composedRefs
	}), itemContext.isSelected && context.valueNode && !context.valueNodeHasChildren ? import_react_dom.createPortal(itemTextProps.children, context.valueNode) : null] });
});
SelectItemText.displayName = ITEM_TEXT_NAME;
var ITEM_INDICATOR_NAME = "SelectItemIndicator";
var SelectItemIndicator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...itemIndicatorProps } = props;
	return useSelectItemContext(ITEM_INDICATOR_NAME, __scopeSelect).isSelected ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.span, {
		"aria-hidden": true,
		...itemIndicatorProps,
		ref: forwardedRef
	}) : null;
});
SelectItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SCROLL_UP_BUTTON_NAME = "SelectScrollUpButton";
var SelectScrollUpButton = import_react.forwardRef((props, forwardedRef) => {
	const contentContext = useSelectContentContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_UP_BUTTON_NAME, props.__scopeSelect);
	const [canScrollUp, setCanScrollUp] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				setCanScrollUp(viewport.scrollTop > 0);
			};
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop - selectedItem.offsetHeight;
		}
	}) : null;
});
SelectScrollUpButton.displayName = SCROLL_UP_BUTTON_NAME;
var SCROLL_DOWN_BUTTON_NAME = "SelectScrollDownButton";
var SelectScrollDownButton = import_react.forwardRef((props, forwardedRef) => {
	const contentContext = useSelectContentContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const viewportContext = useSelectViewportContext(SCROLL_DOWN_BUTTON_NAME, props.__scopeSelect);
	const [canScrollDown, setCanScrollDown] = import_react.useState(false);
	const composedRefs = useComposedRefs(forwardedRef, viewportContext.onScrollButtonChange);
	useLayoutEffect2(() => {
		if (contentContext.viewport && contentContext.isPositioned) {
			let handleScroll2 = function() {
				const maxScroll = viewport.scrollHeight - viewport.clientHeight;
				setCanScrollDown(Math.ceil(viewport.scrollTop) < maxScroll);
			};
			const viewport = contentContext.viewport;
			handleScroll2();
			viewport.addEventListener("scroll", handleScroll2);
			return () => viewport.removeEventListener("scroll", handleScroll2);
		}
	}, [contentContext.viewport, contentContext.isPositioned]);
	return canScrollDown ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectScrollButtonImpl, {
		...props,
		ref: composedRefs,
		onAutoScroll: () => {
			const { viewport, selectedItem } = contentContext;
			if (viewport && selectedItem) viewport.scrollTop = viewport.scrollTop + selectedItem.offsetHeight;
		}
	}) : null;
});
SelectScrollDownButton.displayName = SCROLL_DOWN_BUTTON_NAME;
var SelectScrollButtonImpl = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, onAutoScroll, ...scrollIndicatorProps } = props;
	const contentContext = useSelectContentContext("SelectScrollButton", __scopeSelect);
	const autoScrollTimerRef = import_react.useRef(null);
	const getItems = useCollection(__scopeSelect);
	const clearAutoScrollTimer = import_react.useCallback(() => {
		if (autoScrollTimerRef.current !== null) {
			window.clearInterval(autoScrollTimerRef.current);
			autoScrollTimerRef.current = null;
		}
	}, []);
	import_react.useEffect(() => {
		return () => clearAutoScrollTimer();
	}, [clearAutoScrollTimer]);
	useLayoutEffect2(() => {
		getItems().find((item) => item.ref.current === document.activeElement)?.ref.current?.scrollIntoView({ block: "nearest" });
	}, [getItems]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"aria-hidden": true,
		...scrollIndicatorProps,
		ref: forwardedRef,
		style: {
			flexShrink: 0,
			...scrollIndicatorProps.style
		},
		onPointerDown: composeEventHandlers(scrollIndicatorProps.onPointerDown, () => {
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerMove: composeEventHandlers(scrollIndicatorProps.onPointerMove, () => {
			contentContext.onItemLeave?.();
			if (autoScrollTimerRef.current === null) autoScrollTimerRef.current = window.setInterval(onAutoScroll, 50);
		}),
		onPointerLeave: composeEventHandlers(scrollIndicatorProps.onPointerLeave, () => {
			clearAutoScrollTimer();
		})
	});
});
var SEPARATOR_NAME = "SelectSeparator";
var SelectSeparator = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...separatorProps } = props;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.div, {
		"aria-hidden": true,
		...separatorProps,
		ref: forwardedRef
	});
});
SelectSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "SelectArrow";
var SelectArrow = import_react.forwardRef((props, forwardedRef) => {
	const { __scopeSelect, ...arrowProps } = props;
	const popperScope = usePopperScope(__scopeSelect);
	const context = useSelectContext(ARROW_NAME, __scopeSelect);
	const contentContext = useSelectContentContext(ARROW_NAME, __scopeSelect);
	return context.open && contentContext.position === "popper" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Arrow, {
		...popperScope,
		...arrowProps,
		ref: forwardedRef
	}) : null;
});
SelectArrow.displayName = ARROW_NAME;
var BUBBLE_INPUT_NAME = "SelectBubbleInput";
var SelectBubbleInput = import_react.forwardRef(({ __scopeSelect, value, ...props }, forwardedRef) => {
	const ref = import_react.useRef(null);
	const composedRefs = useComposedRefs(forwardedRef, ref);
	const prevValue = usePrevious(value);
	import_react.useEffect(() => {
		const select = ref.current;
		if (!select) return;
		const selectProto = window.HTMLSelectElement.prototype;
		const setValue = Object.getOwnPropertyDescriptor(selectProto, "value").set;
		if (prevValue !== value && setValue) {
			const event = new Event("change", { bubbles: true });
			setValue.call(select, value);
			select.dispatchEvent(event);
		}
	}, [prevValue, value]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Primitive.select, {
		...props,
		style: {
			...VISUALLY_HIDDEN_STYLES,
			...props.style
		},
		ref: composedRefs,
		defaultValue: value
	});
});
SelectBubbleInput.displayName = BUBBLE_INPUT_NAME;
function shouldShowPlaceholder(value) {
	return value === "" || value === void 0;
}
function useTypeaheadSearch(onSearchChange) {
	const handleSearchChange = useCallbackRef(onSearchChange);
	const searchRef = import_react.useRef("");
	const timerRef = import_react.useRef(0);
	const handleTypeaheadSearch = import_react.useCallback((key) => {
		const search = searchRef.current + key;
		handleSearchChange(search);
		(function updateSearch(value) {
			searchRef.current = value;
			window.clearTimeout(timerRef.current);
			if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
		})(search);
	}, [handleSearchChange]);
	const resetTypeahead = import_react.useCallback(() => {
		searchRef.current = "";
		window.clearTimeout(timerRef.current);
	}, []);
	import_react.useEffect(() => {
		return () => window.clearTimeout(timerRef.current);
	}, []);
	return [
		searchRef,
		handleTypeaheadSearch,
		resetTypeahead
	];
}
function findNextItem(items, search, currentItem) {
	const normalizedSearch = search.length > 1 && Array.from(search).every((char) => char === search[0]) ? search[0] : search;
	const currentItemIndex = currentItem ? items.indexOf(currentItem) : -1;
	let wrappedItems = wrapArray(items, Math.max(currentItemIndex, 0));
	if (normalizedSearch.length === 1) wrappedItems = wrappedItems.filter((v) => v !== currentItem);
	const nextItem = wrappedItems.find((item) => item.textValue.toLowerCase().startsWith(normalizedSearch.toLowerCase()));
	return nextItem !== currentItem ? nextItem : void 0;
}
function wrapArray(array, startIndex) {
	return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root2 = Select;
var Trigger = SelectTrigger;
var Value = SelectValue;
var Icon = SelectIcon;
var Portal = SelectPortal;
var Content2 = SelectContent;
var Viewport = SelectViewport;
var Group = SelectGroup;
var Label = SelectLabel;
var Item = SelectItem;
var ItemText = SelectItemText;
var ItemIndicator = SelectItemIndicator;
var ScrollUpButton = SelectScrollUpButton;
var ScrollDownButton = SelectScrollDownButton;
var Separator = SelectSeparator;
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/builder-mark.js
/**
* Builder.io monogram — simple B letterform on a rounded tile.
* Shared by ConnectBuilderCard (chat) and UseBuilderCard (settings) so the
* brand mark stays in lockstep across Builder-connect surfaces.
*/
function BuilderBMark({ className }) {
	return (0, import_jsx_runtime.jsx)("svg", {
		viewBox: "0 0 116 130",
		fill: "none",
		xmlns: "http://www.w3.org/2000/svg",
		className,
		"aria-hidden": true,
		children: (0, import_jsx_runtime.jsx)("path", {
			d: "M115.14 39C115.14 17.36 97.58 0 76.14 0H10.27C4.58002 0 0 4.62002 0 10.27C0 20.79 22.2899 28.78 22.2899 65C22.2899 101.22 0 109.21 0 119.73C0 125.38 4.58002 130 10.27 130H76.14C97.58 130 115.14 112.64 115.14 91C115.14 75.1 105.59 65.41 105.21 65C105.58 64.59 115.14 54.9 115.14 39ZM13.58 11.1504H76.14C83.58 11.1504 90.58 14.0501 95.84 19.3101C101.1 24.5701 104 31.5703 104 39.0103C104 46.4503 101.26 53.0102 96.38 58.1602L13.59 11.1504H13.58ZM95.83 110.7C90.57 115.96 83.57 118.86 76.13 118.86H13.5699L96.36 71.8501C101.24 77.0001 103.98 83.8 103.98 91C103.98 98.2 101.08 105.44 95.8199 110.7H95.83ZM25.7 99.1602C26.36 97.7802 33.4199 84.08 33.4199 65C33.4199 45.92 26.36 32.2203 25.7 30.8403L85.86 65L25.7 99.1602Z",
			fill: "currentColor"
		})
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/SettingsSection.js
/**
* Collapsible settings section card with icon, title, status dot, and optional badge.
* Controlled via `open` / `onToggle` for accordion behaviour.
*/
function SettingsSection({ id, icon, title, subtitle, badge, required, connected, open = false, onToggle, children }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		id,
		className: "rounded-lg border border-border bg-background/50",
		children: [(0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: onToggle,
			className: "flex w-full cursor-pointer items-center justify-between px-3 py-2.5 text-left rounded-lg hover:bg-accent/40 transition-colors",
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 min-w-0",
				children: [
					(0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 text-muted-foreground",
						children: icon
					}),
					(0, import_jsx_runtime.jsx)("span", {
						className: "text-[12px] font-medium text-foreground truncate",
						children: title
					}),
					connected && (0, import_jsx_runtime.jsx)("span", {
						className: "flex items-center justify-center shrink-0 rounded-full bg-green-500/15 text-green-500 w-4 h-4",
						children: (0, import_jsx_runtime.jsx)(IconCheck, {
							size: 10,
							stroke: 3
						})
					}),
					required && !connected && (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-full bg-accent/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: "Required"
					}),
					badge && (0, import_jsx_runtime.jsx)("span", {
						className: "shrink-0 rounded-full bg-accent/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground",
						children: badge
					})
				]
			}), (0, import_jsx_runtime.jsx)(IconChevronDown, {
				size: 12,
				className: `shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`
			})]
		}), open && (0, import_jsx_runtime.jsxs)("div", {
			className: "border-t border-border px-3 pb-3 pt-2.5",
			children: [subtitle && (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground mb-2.5",
				children: subtitle
			}), children]
		})]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/AgentsSection.js
function AgentEditPopover({ agent, onSave, onDelete, onClose }) {
	const [name, setName] = (0, import_react.useState)(agent.name);
	const [url, setUrl] = (0, import_react.useState)(agent.url);
	const [description, setDescription] = (0, import_react.useState)(agent.description ?? "");
	const popoverRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		function handleClick(e) {
			if (popoverRef.current && !popoverRef.current.contains(e.target)) onClose();
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [onClose]);
	const handleSave = () => {
		if (!name.trim() || !url.trim()) return;
		onSave({
			...agent,
			name: name.trim(),
			url: url.trim(),
			description: description.trim() || void 0
		});
	};
	return (0, import_jsx_runtime.jsx)("div", {
		ref: popoverRef,
		className: "absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-border bg-popover p-2.5 shadow-lg",
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1.5",
			children: [
				(0, import_jsx_runtime.jsx)("input", {
					value: name,
					onChange: (e) => setName(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") handleSave();
						if (e.key === "Escape") onClose();
					},
					className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
					placeholder: "Name"
				}),
				(0, import_jsx_runtime.jsx)("input", {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") handleSave();
						if (e.key === "Escape") onClose();
					},
					className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
					placeholder: "URL (e.g. http://localhost:8085)"
				}),
				(0, import_jsx_runtime.jsx)("input", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") handleSave();
						if (e.key === "Escape") onClose();
					},
					className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
					placeholder: "Description (optional)"
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between pt-0.5",
					children: [(0, import_jsx_runtime.jsxs)("button", {
						onClick: () => onDelete(agent.id),
						className: "flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] text-red-400 hover:bg-red-900/20",
						children: [(0, import_jsx_runtime.jsx)(IconTrash, { size: 10 }), "Remove"]
					}), (0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1",
						children: [(0, import_jsx_runtime.jsx)("button", {
							onClick: onClose,
							className: "rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground",
							children: "Cancel"
						}), (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSave,
							disabled: !name.trim() || !url.trim(),
							className: "rounded bg-accent px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
							children: "Save"
						})]
					})]
				})
			]
		})
	});
}
function AgentAddPopover({ onAdd, onClose }) {
	const [name, setName] = (0, import_react.useState)("");
	const [url, setUrl] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const nameRef = (0, import_react.useRef)(null);
	const popoverRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		const t = setTimeout(() => nameRef.current?.focus(), 50);
		return () => clearTimeout(t);
	}, []);
	(0, import_react.useEffect)(() => {
		function handleClick(e) {
			if (popoverRef.current && !popoverRef.current.contains(e.target)) onClose();
		}
		document.addEventListener("mousedown", handleClick);
		return () => document.removeEventListener("mousedown", handleClick);
	}, [onClose]);
	const handleAdd = () => {
		if (!name.trim() || !url.trim()) return;
		onAdd(name.trim(), url.trim(), description.trim());
	};
	return (0, import_jsx_runtime.jsx)("div", {
		ref: popoverRef,
		className: "absolute right-0 top-full z-50 mt-1 w-64 rounded-lg border border-border bg-popover p-2.5 shadow-lg",
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-1.5",
			children: [
				(0, import_jsx_runtime.jsx)("input", {
					ref: nameRef,
					value: name,
					onChange: (e) => setName(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") handleAdd();
						if (e.key === "Escape") onClose();
					},
					className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
					placeholder: "Name"
				}),
				(0, import_jsx_runtime.jsx)("input", {
					value: url,
					onChange: (e) => setUrl(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") handleAdd();
						if (e.key === "Escape") onClose();
					},
					className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
					placeholder: "URL (e.g. http://localhost:8085)"
				}),
				(0, import_jsx_runtime.jsx)("input", {
					value: description,
					onChange: (e) => setDescription(e.target.value),
					onKeyDown: (e) => {
						if (e.key === "Enter") handleAdd();
						if (e.key === "Escape") onClose();
					},
					className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
					placeholder: "Description (optional)"
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "flex justify-end gap-1 pt-0.5",
					children: [(0, import_jsx_runtime.jsx)("button", {
						onClick: onClose,
						className: "rounded px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground",
						children: "Cancel"
					}), (0, import_jsx_runtime.jsx)("button", {
						onClick: handleAdd,
						disabled: !name.trim() || !url.trim(),
						className: "rounded bg-accent px-2 py-0.5 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
						children: "Add"
					})]
				})
			]
		})
	});
}
function AgentsSection() {
	const [agents, setAgents] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [editingAgent, setEditingAgent] = (0, import_react.useState)(null);
	const [showAdd, setShowAdd] = (0, import_react.useState)(false);
	const fetchAgents = (0, import_react.useCallback)(async () => {
		try {
			const res = await fetch(agentNativePath("/_agent-native/resources?scope=all"));
			if (!res.ok) return;
			const agentResources = ((await res.json()).resources ?? []).filter((r) => isRemoteAgentPath(r.path));
			setAgents((await Promise.all(agentResources.map(async (r) => {
				try {
					const detail = await fetch(agentNativePath(`/_agent-native/resources/${r.id}`));
					if (!detail.ok) return null;
					const d = await detail.json();
					const config = JSON.parse(d.content);
					return {
						id: r.id,
						path: r.path,
						name: config.name,
						url: config.url,
						description: config.description
					};
				} catch {
					return null;
				}
			}))).filter(Boolean));
		} finally {
			setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		fetchAgents();
	}, [fetchAgents]);
	const handleAdd = async (name, url, description) => {
		const id = name.toLowerCase().replace(/[^a-z0-9-]/g, "-");
		const agentJson = JSON.stringify({
			id,
			name,
			description: description || void 0,
			url,
			color: "#6B7280"
		}, null, 2);
		try {
			if ((await fetch(agentNativePath("/_agent-native/resources"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					path: remoteAgentResourcePath(id),
					content: agentJson,
					shared: true
				})
			})).ok) {
				setShowAdd(false);
				fetchAgents();
			}
		} catch {}
	};
	const handleSave = async (agent) => {
		const agentJson = JSON.stringify({
			id: getRemoteAgentIdFromPath(agent.path),
			name: agent.name,
			description: agent.description || void 0,
			url: agent.url,
			color: "#6B7280"
		}, null, 2);
		try {
			if ((await fetch(agentNativePath(`/_agent-native/resources/${agent.id}`), {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: agentJson })
			})).ok) {
				setEditingAgent(null);
				fetchAgents();
			}
		} catch {}
	};
	const handleDelete = async (agentId) => {
		try {
			if ((await fetch(agentNativePath(`/_agent-native/resources/${agentId}`), {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			})).ok) {
				setEditingAgent(null);
				fetchAgents();
			}
		} catch {}
	};
	return (0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-2",
		children: [(0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] text-muted-foreground",
			children: "@-mention agents in chat to delegate tasks via A2A."
		}), (0, import_jsx_runtime.jsxs)("div", {
			className: "relative",
			children: [(0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
				asChild: true,
				children: (0, import_jsx_runtime.jsx)("button", {
					onClick: () => {
						setShowAdd(!showAdd);
						setEditingAgent(null);
					},
					className: "flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent/50",
					children: showAdd ? (0, import_jsx_runtime.jsx)(IconX, { size: 12 }) : (0, import_jsx_runtime.jsx)(IconPlus, { size: 12 })
				})
			}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Add agent" })] }), showAdd && (0, import_jsx_runtime.jsx)(AgentAddPopover, {
				onAdd: handleAdd,
				onClose: () => setShowAdd(false)
			})]
		})]
	}), loading ? (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [(0, import_jsx_runtime.jsx)("div", { className: "h-6 w-full rounded bg-muted/50 animate-pulse" }), (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-3/4 rounded bg-muted/50 animate-pulse" })]
	}) : agents.length === 0 ? (0, import_jsx_runtime.jsxs)("button", {
		onClick: () => setShowAdd(true),
		className: "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/30",
		children: [(0, import_jsx_runtime.jsx)(IconPlus, {
			size: 12,
			className: "shrink-0"
		}), "Add agent"]
	}) : (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-0.5",
		children: [agents.map((agent) => (0, import_jsx_runtime.jsxs)("div", {
			className: "group relative",
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 hover:bg-accent/30",
				children: [
					(0, import_jsx_runtime.jsx)("span", {
						className: "text-[11px] font-medium text-foreground truncate shrink-0",
						children: agent.name
					}),
					(0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-[10px] text-muted-foreground/60 truncate text-right",
						children: agent.url
					}),
					(0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
						asChild: true,
						children: (0, import_jsx_runtime.jsx)("button", {
							onClick: () => {
								setEditingAgent(editingAgent === agent.id ? null : agent.id);
								setShowAdd(false);
							},
							className: "shrink-0 rounded p-0.5 text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-foreground hover:bg-accent/50",
							children: (0, import_jsx_runtime.jsx)(IconPencil, { size: 11 })
						})
					}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Edit agent" })] })
				]
			}), editingAgent === agent.id && (0, import_jsx_runtime.jsx)(AgentEditPopover, {
				agent,
				onSave: handleSave,
				onDelete: handleDelete,
				onClose: () => setEditingAgent(null)
			})]
		}, agent.id)), (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => {
				setShowAdd(true);
				setEditingAgent(null);
			},
			className: "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/30",
			children: [(0, import_jsx_runtime.jsx)(IconPlus, {
				size: 12,
				className: "shrink-0"
			}), "Add agent"]
		})]
	})] });
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/UsageSection.js
var RANGES = [
	{
		value: 1,
		label: "24h"
	},
	{
		value: 7,
		label: "7d"
	},
	{
		value: 30,
		label: "30d"
	},
	{
		value: 90,
		label: "90d"
	}
];
var USD_BILLING = {
	unit: "usd",
	label: "Estimated spend",
	shortLabel: "Cost",
	source: "estimated-provider-cost"
};
function displayAmountFromCostCents(cents, billing) {
	if (billing.unit !== "builder-credits") return cents;
	const margin = billing.hardCostMarginMultiplier ?? 1.25;
	const creditsPerUsd = billing.creditsPerUsd ?? 20;
	const credits = cents / 100 * margin * creditsPerUsd;
	return credits <= 0 ? 0 : Math.ceil(credits * 1e3) / 1e3;
}
function formatCredits(credits) {
	if (!Number.isFinite(credits) || credits === 0) return "0 credits";
	const maximumFractionDigits = credits < 1 ? 3 : credits < 10 ? 2 : 1;
	return `${credits.toLocaleString(void 0, { maximumFractionDigits })} ${credits === 1 ? "credit" : "credits"}`;
}
function formatSpend(cents, billing) {
	if (billing.unit === "builder-credits") return formatCredits(displayAmountFromCostCents(cents, billing));
	if (cents < 1) return `${cents.toFixed(3)}¢`;
	if (cents < 100) return `${cents.toFixed(2)}¢`;
	return `$${(cents / 100).toFixed(2)}`;
}
function formatTokens(n) {
	if (n >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
	if (n >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
	return String(n);
}
function BucketBars({ buckets, emptyMessage, billing }) {
	if (buckets.length === 0) return (0, import_jsx_runtime.jsx)("p", {
		className: "text-[10px] text-muted-foreground py-1.5",
		children: emptyMessage
	});
	const max = Math.max(...buckets.map((b) => displayAmountFromCostCents(b.cents, billing)), 1e-4);
	return (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children: buckets.map((b) => (0, import_jsx_runtime.jsxs)("div", {
			className: "text-[10px]",
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2 mb-0.5",
				children: [(0, import_jsx_runtime.jsx)("span", {
					className: "truncate text-foreground",
					title: b.key || "(none)",
					children: b.key || "(none)"
				}), (0, import_jsx_runtime.jsxs)("span", {
					className: "shrink-0 text-muted-foreground tabular-nums",
					children: [formatSpend(b.cents, billing), (0, import_jsx_runtime.jsxs)("span", {
						className: "ml-1 opacity-60",
						children: [
							"· ",
							formatTokens(b.inputTokens + b.outputTokens),
							" tok"
						]
					})]
				})]
			}), (0, import_jsx_runtime.jsx)("div", {
				className: "h-1 rounded-full bg-accent/40 overflow-hidden",
				children: (0, import_jsx_runtime.jsx)("div", {
					className: "h-full bg-foreground/70",
					style: { width: `${displayAmountFromCostCents(b.cents, billing) / max * 100}%` }
				})
			})]
		}, b.key))
	});
}
function DailySparkline({ days, billing }) {
	if (days.length === 0) return null;
	const max = Math.max(...days.map((d) => displayAmountFromCostCents(d.cents, billing)), 1e-4);
	return (0, import_jsx_runtime.jsx)("div", {
		className: "flex items-end gap-[2px] h-8 pt-2",
		children: days.map((d) => (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 bg-foreground/60 rounded-sm min-h-[1px]",
			style: { height: `${Math.max(2, displayAmountFromCostCents(d.cents, billing) / max * 100)}%` },
			title: `${d.date}: ${formatSpend(d.cents, billing)} (${d.calls} calls)`
		}, d.date))
	});
}
function UsageSection() {
	const [days, setDays] = (0, import_react.useState)(30);
	const [data, setData] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const billing = data?.billing ?? USD_BILLING;
	const load = async (rangeDays) => {
		setLoading(true);
		setError(null);
		try {
			const res = await fetch(agentNativePath(`/_agent-native/usage?sinceDays=${rangeDays}`));
			if (!res.ok) throw new Error(`Failed (${res.status})`);
			setData(await res.json());
		} catch (err) {
			setError(err?.message || "Failed to load usage");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		load(days);
	}, [days]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-3",
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [(0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 rounded-md border border-border p-0.5",
					children: RANGES.map((r) => (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDays(r.value),
						className: `px-2 py-0.5 text-[10px] rounded ${days === r.value ? "bg-accent text-foreground" : "text-muted-foreground hover:text-foreground"}`,
						children: r.label
					}, r.value))
				}), (0, import_jsx_runtime.jsx)("button", {
					onClick: () => load(days),
					className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground",
					disabled: loading,
					children: loading ? (0, import_jsx_runtime.jsx)(IconLoader2, {
						size: 11,
						className: "animate-spin"
					}) : (0, import_jsx_runtime.jsx)(IconRefresh, { size: 11 })
				})]
			}),
			error && (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-red-500",
				children: error
			}),
			data && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				(0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border border-border px-2.5 py-2",
					children: [(0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-baseline justify-between",
						children: [(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("div", {
							className: "text-[10px] text-muted-foreground",
							children: billing.unit === "builder-credits" ? "Builder.io credit spend" : "Total spend"
						}), (0, import_jsx_runtime.jsx)("div", {
							className: "text-[18px] font-semibold tabular-nums",
							children: formatSpend(data.totalCents, billing)
						})] }), (0, import_jsx_runtime.jsxs)("div", {
							className: "text-right",
							children: [
								(0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground",
									children: [data.totalCalls, " calls"]
								}),
								(0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-muted-foreground",
									children: [
										formatTokens(data.totalInputTokens),
										" in ·",
										" ",
										formatTokens(data.totalOutputTokens),
										" out"
									]
								}),
								data.totalCacheReadTokens > 0 && (0, import_jsx_runtime.jsxs)("div", {
									className: "text-[10px] text-green-500/80",
									children: [formatTokens(data.totalCacheReadTokens), " cached"]
								})
							]
						})]
					}), (0, import_jsx_runtime.jsx)(DailySparkline, {
						days: data.byDay,
						billing
					})]
				}),
				(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium text-foreground mb-1",
					children: "By label"
				}), (0, import_jsx_runtime.jsx)(BucketBars, {
					buckets: data.byLabel,
					emptyMessage: "No labeled calls yet.",
					billing
				})] }),
				(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium text-foreground mb-1",
					children: "By model"
				}), (0, import_jsx_runtime.jsx)(BucketBars, {
					buckets: data.byModel,
					emptyMessage: "No calls recorded.",
					billing
				})] }),
				data.byApp.filter((b) => b.key).length > 1 && (0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium text-foreground mb-1",
					children: "By app"
				}), (0, import_jsx_runtime.jsx)(BucketBars, {
					buckets: data.byApp,
					emptyMessage: "",
					billing
				})] }),
				data.recent.length > 0 && (0, import_jsx_runtime.jsxs)("details", { children: [(0, import_jsx_runtime.jsxs)("summary", {
					className: "text-[10px] font-medium text-foreground cursor-pointer select-none hover:text-foreground/80",
					children: [
						"Recent calls (",
						data.recent.length,
						")"
					]
				}), (0, import_jsx_runtime.jsx)("div", {
					className: "mt-1.5 max-h-48 overflow-y-auto space-y-0.5 rounded border border-border",
					children: data.recent.map((r) => (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2 px-2 py-1 text-[10px] border-b border-border last:border-b-0",
						children: [(0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [(0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-foreground",
								title: r.label,
								children: [r.label, r.app ? (0, import_jsx_runtime.jsxs)("span", {
									className: "text-muted-foreground",
									children: [
										" ",
										"· ",
										r.app
									]
								}) : null]
							}), (0, import_jsx_runtime.jsxs)("div", {
								className: "truncate text-muted-foreground",
								children: [
									new Date(r.createdAt).toLocaleString(),
									" · ",
									r.model
								]
							})]
						}), (0, import_jsx_runtime.jsx)("div", {
							className: "shrink-0 text-right tabular-nums text-muted-foreground",
							children: formatSpend(r.cents, billing)
						})]
					}, r.id))
				})] }),
				billing.unit === "builder-credits" ? (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] text-muted-foreground",
					children: [
						"Builder.io credits are estimated from hard token cost, a",
						" ",
						billing.hardCostMarginMultiplier ?? 1.25,
						"x margin, and",
						" ",
						billing.creditsPerUsd ?? 20,
						" credits per dollar."
					]
				}) : (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-muted-foreground",
					children: "Spend is estimated from published Anthropic pricing and your own recorded token counts. Cached input is priced at ~10% of regular input."
				})
			] })
		]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/SecretsSection.js
/**
* <SecretsSection /> — renders the registered secrets from the framework
* secrets registry. Fetches `/_agent-native/secrets` on mount and shows a
* card per secret with a masked input + Save / Rotate / Delete / Test
* buttons (api-key kind) or a Connect / Disconnect button (oauth kind).
*/
var ENDPOINT = agentNativePath("/_agent-native/secrets");
function notifySecretsChanged() {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent("agent-engine:configured-changed", { detail: { source: "secrets" } }));
}
function SecretsSection({ focusKey }) {
	const [secrets, setSecrets] = (0, import_react.useState)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [reloadToken, setReloadToken] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		fetch(ENDPOINT).then(async (r) => {
			if (!r.ok) throw new Error(`Failed to load secrets (${r.status})`);
			return await r.json();
		}).then((data) => {
			if (!cancelled) setSecrets(data);
		}).catch((err) => {
			if (!cancelled) setError(err?.message ?? "Failed to load");
		});
		return () => {
			cancelled = true;
		};
	}, [reloadToken]);
	const reload = (0, import_react.useCallback)(() => setReloadToken((t) => t + 1), []);
	if (error) return (0, import_jsx_runtime.jsxs)("p", {
		className: "text-[10px] text-red-500",
		children: ["Failed to load secrets: ", error]
	});
	if (secrets === null) return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 text-[10px] text-muted-foreground",
		children: [(0, import_jsx_runtime.jsx)(IconLoader2, {
			size: 10,
			className: "animate-spin"
		}), "Loading…"]
	});
	if (secrets.length === 0) return (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [(0, import_jsx_runtime.jsxs)("p", {
			className: "text-[10px] text-muted-foreground",
			children: [
				"No secrets registered yet. Templates register API keys and connections via ",
				(0, import_jsx_runtime.jsx)("code", { children: "registerRequiredSecret()" }),
				"."
			]
		}), (0, import_jsx_runtime.jsx)(AdHocKeysSection, {})]
	});
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [secrets.map((secret) => (0, import_jsx_runtime.jsx)(SecretCard, {
			secret,
			onChanged: reload,
			focusInput: focusKey === secret.key
		}, secret.key)), (0, import_jsx_runtime.jsx)(AdHocKeysSection, {})]
	});
}
function SecretCard({ secret, onChanged, focusInput }) {
	const [value, setValue] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(null);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(false);
	const [toast, setToast] = (0, import_react.useState)(null);
	const inputRef = import_react.useRef(null);
	(0, import_react.useEffect)(() => {
		if (focusInput && inputRef.current) inputRef.current.focus();
	}, [focusInput]);
	const setToastAndClear = (kind, text, ms = 2500) => {
		setToast({
			kind,
			text
		});
		setTimeout(() => setToast(null), ms);
	};
	const handleSave = async () => {
		if (!value.trim() || busy) return;
		setBusy("save");
		try {
			const res = await fetch(`${ENDPOINT}/${encodeURIComponent(secret.key)}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ value: value.trim() })
			});
			if (!res.ok) {
				setToastAndClear("err", await res.json().then((j) => j.error).catch(() => null) ?? `Save failed (${res.status})`);
				return;
			}
			setValue("");
			setConfirmDelete(false);
			setToastAndClear("ok", "Saved");
			notifySecretsChanged();
			onChanged();
		} finally {
			setBusy(null);
		}
	};
	const handleDelete = async () => {
		if (busy) return;
		setBusy("delete");
		try {
			const res = await fetch(`${ENDPOINT}/${encodeURIComponent(secret.key)}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			});
			if (!res.ok) {
				setToastAndClear("err", await res.json().then((j) => j.error).catch(() => null) ?? `Delete failed (${res.status})`);
				return;
			}
			setToastAndClear("ok", "Removed");
			setConfirmDelete(false);
			notifySecretsChanged();
			onChanged();
		} finally {
			setBusy(null);
		}
	};
	const handleTest = async () => {
		if (busy) return;
		setBusy("test");
		try {
			const res = await fetch(`${ENDPOINT}/${encodeURIComponent(secret.key)}/test`, { method: "POST" });
			const body = await res.json().catch(() => ({}));
			if (res.ok && body.ok) setToastAndClear("ok", "Working");
			else setToastAndClear("err", body.error ?? (body.ok === false ? "Invalid" : `Test failed`));
		} finally {
			setBusy(null);
		}
	};
	const pill = (0, import_react.useMemo)(() => {
		if (secret.status === "set") return (0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1 text-[10px] text-green-500",
			children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Set"]
		});
		if (secret.required) return (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-full bg-red-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-red-500",
			children: "Required"
		});
		return (0, import_jsx_runtime.jsx)("span", {
			className: "rounded-full bg-accent/60 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-muted-foreground",
			children: "Optional"
		});
	}, [secret.status, secret.required]);
	const isOAuth = secret.kind === "oauth";
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border px-2.5 py-2 bg-accent/30",
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [(0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium text-foreground truncate",
						children: secret.label
					}), secret.description && (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: secret.description
					})]
				}), (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0",
					children: pill
				})]
			}),
			isOAuth ? (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-center gap-1.5",
				children: [secret.oauthConnectUrl && (0, import_jsx_runtime.jsxs)("a", {
					href: secret.oauthConnectUrl,
					className: "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium no-underline",
					style: {
						backgroundColor: "#00B5FF",
						color: "white"
					},
					children: [(0, import_jsx_runtime.jsx)(IconPlugConnected, { size: 10 }), secret.status === "set" ? "Reconnect" : "Connect"]
				}), secret.docsUrl && (0, import_jsx_runtime.jsxs)("a", {
					href: secret.docsUrl,
					target: "_blank",
					rel: "noopener noreferrer",
					className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] no-underline text-muted-foreground hover:text-foreground",
					children: ["Docs", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
				})]
			}) : (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 space-y-1.5",
				children: [
					secret.status === "set" && (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2 text-[10px] text-muted-foreground",
						children: [(0, import_jsx_runtime.jsx)("span", { children: "Stored value ending in" }), (0, import_jsx_runtime.jsx)("code", {
							className: "rounded bg-background px-1 py-0.5 text-foreground",
							children: secret.last4
						})]
					}),
					(0, import_jsx_runtime.jsxs)("div", {
						className: "flex gap-1.5",
						children: [(0, import_jsx_runtime.jsx)("input", {
							ref: inputRef,
							type: "password",
							value,
							onChange: (e) => setValue(e.target.value),
							onKeyDown: (e) => {
								if (e.key === "Enter") handleSave();
							},
							placeholder: secret.status === "set" ? "Enter new value to rotate" : "Paste key",
							className: "flex-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent"
						}), (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleSave,
							disabled: !value.trim() || busy !== null,
							className: "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium disabled:opacity-40",
							style: {
								backgroundColor: "#00B5FF",
								color: "white"
							},
							children: busy === "save" ? (0, import_jsx_runtime.jsx)(IconLoader2, {
								size: 10,
								className: "animate-spin"
							}) : secret.status === "set" ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(IconRefresh, { size: 10 }), "Rotate"] }) : "Save"
						})]
					}),
					(0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5",
						children: [secret.status === "set" && (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: handleTest,
							disabled: busy !== null,
							className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-foreground disabled:opacity-40",
							children: busy === "test" ? (0, import_jsx_runtime.jsx)(IconLoader2, {
								size: 10,
								className: "animate-spin"
							}) : "Test"
						}), (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => setConfirmDelete(true),
							disabled: busy !== null,
							className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] text-muted-foreground hover:text-red-500 disabled:opacity-40",
							children: [(0, import_jsx_runtime.jsx)(IconTrash, { size: 10 }), "Remove"]
						})] }), secret.docsUrl && (0, import_jsx_runtime.jsxs)("a", {
							href: secret.docsUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] no-underline text-muted-foreground hover:text-foreground ml-auto",
							children: ["Get key", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
						})]
					}),
					confirmDelete && (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 rounded border border-red-500/30 bg-red-500/10 px-2 py-1.5 text-[10px] text-red-500",
						children: [
							(0, import_jsx_runtime.jsx)("span", {
								className: "min-w-0 flex-1",
								children: "Remove this saved value?"
							}),
							(0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleDelete,
								disabled: busy !== null,
								className: "inline-flex items-center gap-1 rounded border border-red-500/40 px-1.5 py-0.5 font-medium disabled:opacity-40",
								children: busy === "delete" ? (0, import_jsx_runtime.jsx)(IconLoader2, {
									size: 10,
									className: "animate-spin"
								}) : "Confirm"
							}),
							(0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirmDelete(false),
								disabled: busy !== null,
								className: "rounded border border-border px-1.5 py-0.5 text-muted-foreground hover:text-foreground disabled:opacity-40",
								children: "Cancel"
							})
						]
					})
				]
			}),
			toast && (0, import_jsx_runtime.jsx)("p", {
				className: `mt-1.5 text-[10px] ${toast.kind === "ok" ? "text-green-500" : "text-red-500"}`,
				children: toast.text
			})
		]
	});
}
var ADHOC_ENDPOINT = agentNativePath("/_agent-native/secrets/adhoc");
function AdHocKeysSection() {
	const [keys, setKeys] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [reloadToken, setReloadToken] = (0, import_react.useState)(0);
	const [showForm, setShowForm] = (0, import_react.useState)(false);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formValue, setFormValue] = (0, import_react.useState)("");
	const [formDescription, setFormDescription] = (0, import_react.useState)("");
	const [formScope, setFormScope] = (0, import_react.useState)("user");
	const [formBusy, setFormBusy] = (0, import_react.useState)(false);
	const [formError, setFormError] = (0, import_react.useState)(null);
	const [confirmDeleteName, setConfirmDeleteName] = (0, import_react.useState)(null);
	const [deletingName, setDeletingName] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const showToast = (0, import_react.useCallback)((kind, text, ms = 2500) => {
		setToast({
			kind,
			text
		});
		setTimeout(() => setToast(null), ms);
	}, []);
	const reload = (0, import_react.useCallback)(() => setReloadToken((t) => t + 1), []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		fetch(ADHOC_ENDPOINT).then(async (r) => {
			if (!r.ok) throw new Error(`Failed to load (${r.status})`);
			return await r.json();
		}).then((data) => {
			if (!cancelled) {
				setKeys(data);
				setLoading(false);
			}
		}).catch(() => {
			if (!cancelled) {
				setKeys([]);
				setLoading(false);
			}
		});
		return () => {
			cancelled = true;
		};
	}, [reloadToken]);
	const resetForm = (0, import_react.useCallback)(() => {
		setShowForm(false);
		setFormName("");
		setFormValue("");
		setFormDescription("");
		setFormScope("user");
		setFormError(null);
	}, []);
	const handleAdd = (0, import_react.useCallback)(async () => {
		const name = formName.trim();
		const value = formValue.trim();
		if (!name || !value || formBusy) return;
		setFormBusy(true);
		setFormError(null);
		try {
			const res = await fetch(ADHOC_ENDPOINT, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name,
					value,
					description: formDescription.trim() || void 0,
					scope: formScope
				})
			});
			if (!res.ok) {
				setFormError(await res.json().then((j) => j.error).catch(() => null) ?? `Save failed (${res.status})`);
				return;
			}
			resetForm();
			showToast("ok", "Key saved");
			reload();
		} catch (err) {
			setFormError(err?.message ?? "Failed to save");
		} finally {
			setFormBusy(false);
		}
	}, [
		formName,
		formValue,
		formDescription,
		formScope,
		formBusy,
		resetForm,
		showToast,
		reload
	]);
	const handleDelete = (0, import_react.useCallback)(async (name) => {
		setDeletingName(name);
		try {
			if (!(await fetch(`${ADHOC_ENDPOINT}/${encodeURIComponent(name)}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			})).ok) {
				showToast("err", "Failed to delete key");
				return;
			}
			showToast("ok", "Key deleted");
			setConfirmDeleteName(null);
			reload();
		} finally {
			setDeletingName(null);
		}
	}, [showToast, reload]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "mt-3 space-y-2",
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [(0, import_jsx_runtime.jsx)("p", {
					className: "text-[11px] font-medium text-foreground",
					children: "Additional Keys"
				}), !showForm && (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowForm(true),
					className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40",
					children: [(0, import_jsx_runtime.jsx)(IconPlus, { size: 10 }), "Add Key"]
				})]
			}),
			(0, import_jsx_runtime.jsxs)("p", {
				className: "text-[10px] text-muted-foreground/60 leading-relaxed",
				children: [
					"Keys are referenced in automations as",
					" ",
					(0, import_jsx_runtime.jsx)("code", {
						className: "rounded bg-background px-1 py-0.5 text-[9px]",
						children: "${keys.KEY_NAME}"
					}),
					". Values are encrypted and never shown to the AI agent."
				]
			}),
			showForm && (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border px-2.5 py-2 bg-accent/30 space-y-1.5",
				children: [
					(0, import_jsx_runtime.jsx)("input", {
						value: formName,
						onChange: (e) => setFormName(e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, "")),
						className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
						placeholder: "KEY_NAME (e.g. SLACK_WEBHOOK)"
					}),
					(0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: formValue,
						onChange: (e) => setFormValue(e.target.value),
						className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
						placeholder: "Secret value"
					}),
					(0, import_jsx_runtime.jsx)("input", {
						value: formDescription,
						onChange: (e) => setFormDescription(e.target.value),
						className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent",
						placeholder: "Description (optional)"
					}),
					(0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-2",
						children: [(0, import_jsx_runtime.jsxs)("select", {
							value: formScope,
							onChange: (e) => setFormScope(e.target.value),
							className: "rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:ring-1 focus:ring-accent",
							children: [(0, import_jsx_runtime.jsx)("option", {
								value: "user",
								children: "Personal"
							}), (0, import_jsx_runtime.jsx)("option", {
								value: "workspace",
								children: "Workspace"
							})]
						}), (0, import_jsx_runtime.jsxs)("div", {
							className: "ml-auto flex items-center gap-1.5",
							children: [(0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: resetForm,
								className: "rounded border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground",
								children: "Cancel"
							}), (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: handleAdd,
								disabled: !formName.trim() || !formValue.trim() || formBusy,
								className: "inline-flex items-center gap-1 rounded px-2 py-1 text-[10px] font-medium disabled:opacity-40",
								style: {
									backgroundColor: "#00B5FF",
									color: "white"
								},
								children: formBusy ? (0, import_jsx_runtime.jsx)(IconLoader2, {
									size: 10,
									className: "animate-spin"
								}) : "Save"
							})]
						})]
					}),
					formError && (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-red-500",
						children: formError
					})
				]
			}),
			loading ? (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5 text-[10px] text-muted-foreground",
				children: [(0, import_jsx_runtime.jsx)(IconLoader2, {
					size: 10,
					className: "animate-spin"
				}), "Loading..."]
			}) : keys.length === 0 && !showForm ? (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground",
				children: "No additional keys yet."
			}) : keys.map((key) => (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-md border border-border px-2.5 py-2 bg-accent/30",
				children: (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [(0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							(0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [(0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium text-foreground font-mono truncate",
									children: key.name
								}), (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${key.scope === "workspace" ? "bg-blue-500/15 text-blue-500" : "bg-accent/60 text-muted-foreground"}`,
									children: key.scope === "workspace" ? "workspace" : "personal"
								})]
							}),
							key.description && (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground mt-0.5",
								children: key.description
							}),
							(0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-2 text-[10px] text-muted-foreground mt-0.5",
								children: (0, import_jsx_runtime.jsxs)("span", { children: [
									"Ending in",
									" ",
									(0, import_jsx_runtime.jsx)("code", {
										className: "rounded bg-background px-1 py-0.5 text-foreground",
										children: key.last4
									})
								] })
							})
						]
					}), (0, import_jsx_runtime.jsx)("div", {
						className: "shrink-0",
						children: confirmDeleteName === key.name ? (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1",
							children: [(0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => handleDelete(key.name),
								disabled: deletingName === key.name,
								className: "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-red-500/15 text-red-500 hover:bg-red-500/25 disabled:opacity-40",
								children: deletingName === key.name ? (0, import_jsx_runtime.jsx)(IconLoader2, {
									size: 10,
									className: "animate-spin"
								}) : "Confirm"
							}), (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirmDeleteName(null),
								className: "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-accent/60 text-muted-foreground hover:text-foreground",
								children: "Cancel"
							})]
						}) : (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
							asChild: true,
							children: (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: () => setConfirmDeleteName(key.name),
								className: "text-muted-foreground hover:text-red-500",
								children: (0, import_jsx_runtime.jsx)(IconTrash, { size: 12 })
							})
						}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Delete" })] })
					})]
				})
			}, `${key.scope}-${key.name}`)),
			toast && (0, import_jsx_runtime.jsx)("p", {
				className: `text-[10px] ${toast.kind === "ok" ? "text-green-500" : "text-red-500"}`,
				children: toast.text
			})
		]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/VoiceTranscriptionSection.js
/**
* <VoiceTranscriptionSection /> — source + cleanup settings for voice input.
*
* Writes the selection to application_state under `voice-transcription-prefs`
* so the composer's `useVoiceDictation` hook picks it up on next record. The
* legacy `provider` field is still written alongside `transcriptionMode` so
* older clients continue to normalize safely.
*
* Provider status comes from `/_agent-native/voice-providers/status`, which
* mirrors the server transcription route's key/env resolution.
*/
var PREFS_URL = agentNativePath("/_agent-native/application-state/voice-transcription-prefs");
var CLEANUP_PREFS_URL = agentNativePath("/_agent-native/application-state/voice-cleanup-prefs");
var SECRETS_URL = agentNativePath("/_agent-native/secrets");
var PROVIDER_STATUS_URL = agentNativePath("/_agent-native/voice-providers/status");
var DEFAULT_TRANSCRIPTION_MODE = "batch";
var DEFAULT_BATCH_PROVIDER = "auto";
function isProvider(value) {
	return value === "auto" || value === "openai" || value === "builder-gemini" || value === "builder" || value === "browser" || value === "gemini" || value === "groq";
}
function isTranscriptionMode(value) {
	return value === "mac-native" || value === "google-realtime" || value === "batch";
}
function normalizeProvider(value) {
	if (!isProvider(value)) return null;
	return value === "builder" ? "builder-gemini" : value;
}
function legacyModeFromProvider(provider) {
	if (provider === "browser") return "mac-native";
	return "batch";
}
function providerForMode(mode, currentProvider) {
	if (mode === "mac-native") return "browser";
	if (mode === "google-realtime") return "auto";
	if (!currentProvider || currentProvider === "browser") return DEFAULT_BATCH_PROVIDER;
	return currentProvider;
}
function batchProvider(provider) {
	if (!provider || provider === "browser") return DEFAULT_BATCH_PROVIDER;
	return provider;
}
function VoiceTranscriptionSection() {
	const [transcriptionMode, setTranscriptionMode] = (0, import_react.useState)(null);
	const [provider, setProvider] = (0, import_react.useState)(DEFAULT_BATCH_PROVIDER);
	const [instructions, setInstructions] = (0, import_react.useState)("");
	const [openAiConfigured, setOpenAiConfigured] = (0, import_react.useState)(null);
	const [geminiConfigured, setGeminiConfigured] = (0, import_react.useState)(null);
	const [groqConfigured, setGroqConfigured] = (0, import_react.useState)(null);
	const [googleRealtimeConfigured, setGoogleRealtimeConfigured] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saveError, setSaveError] = (0, import_react.useState)(null);
	const [showAdvanced, setShowAdvanced] = (0, import_react.useState)(false);
	const [cleanupEnabled, setCleanupEnabled] = (0, import_react.useState)(null);
	const { status: builderStatus } = useBuilderStatus();
	const builderRealtimeReady = !!builderStatus?.privateKeyConfigured && !!builderStatus?.publicKeyConfigured;
	const googleRealtimeReady = !!googleRealtimeConfigured && builderRealtimeReady;
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		fetch(CLEANUP_PREFS_URL).then((r) => r.ok ? r.json() : null).then((body) => {
			if (cancelled) return;
			const stored = body?.enabled ?? body?.value?.enabled;
			if (typeof stored === "boolean") setCleanupEnabled(stored);
			else setCleanupEnabled(null);
		}).catch(() => !cancelled && setCleanupEnabled(null));
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		if (cleanupEnabled !== null) return;
		if (builderStatus?.configured !== void 0) setCleanupEnabled(!!builderStatus.configured);
	}, [builderStatus?.configured, cleanupEnabled]);
	const toggleCleanup = async (next) => {
		const previous = cleanupEnabled;
		setCleanupEnabled(next);
		try {
			const res = await fetch(CLEANUP_PREFS_URL, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ enabled: next })
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} catch {
			setCleanupEnabled(previous);
		}
	};
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		fetch(PREFS_URL).then((r) => r.ok ? r.json() : null).then((body) => {
			if (cancelled) return;
			const value = body?.value ?? body;
			const p = normalizeProvider(body?.provider ?? body?.value?.provider);
			const mode = (isTranscriptionMode(value?.transcriptionMode) ? value.transcriptionMode : null) ?? (p ? legacyModeFromProvider(p) : DEFAULT_TRANSCRIPTION_MODE);
			const savedInstructions = body?.instructions ?? body?.value?.instructions;
			setTranscriptionMode(mode);
			setProvider(providerForMode(mode, p));
			if (typeof savedInstructions === "string") setInstructions(savedInstructions);
		}).catch(() => {
			if (!cancelled) {
				setTranscriptionMode(DEFAULT_TRANSCRIPTION_MODE);
				setProvider(DEFAULT_BATCH_PROVIDER);
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		fetch(PROVIDER_STATUS_URL).then((r) => r.ok ? r.json() : null).then((status) => {
			if (cancelled) return;
			if (status) {
				setOpenAiConfigured(status.openai);
				setGeminiConfigured(status.gemini);
				setGroqConfigured(status.groq);
				setGoogleRealtimeConfigured(!!status.googleRealtime);
				return;
			}
			return fetch(SECRETS_URL).then((r) => r.ok ? r.json() : []).then((list) => {
				if (cancelled) return;
				const find = (key) => Array.isArray(list) ? list.find((s) => s.key === key) : null;
				setOpenAiConfigured(find("OPENAI_API_KEY")?.status === "set");
				setGeminiConfigured(find("GEMINI_API_KEY")?.status === "set");
				setGroqConfigured(find("GROQ_API_KEY")?.status === "set");
				setGoogleRealtimeConfigured(find("GOOGLE_APPLICATION_CREDENTIALS")?.status === "set");
			});
		}).catch(() => {
			if (!cancelled) {
				setOpenAiConfigured(false);
				setGeminiConfigured(false);
				setGroqConfigured(false);
				setGoogleRealtimeConfigured(false);
			}
		});
		return () => {
			cancelled = true;
		};
	}, []);
	const persist = (0, import_react.useCallback)(async (nextMode, nextProvider, nextInstructions, previous) => {
		setSaving(true);
		setSaveError(null);
		try {
			const res = await fetch(PREFS_URL, {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					transcriptionMode: nextMode,
					provider: nextProvider,
					instructions: nextInstructions.trim()
				})
			});
			if (!res.ok) throw new Error(`HTTP ${res.status}`);
		} catch (err) {
			setTranscriptionMode(previous.transcriptionMode);
			setProvider(previous.provider);
			setInstructions(previous.instructions);
			setSaveError(`Couldn't save: ${err?.message ?? "network error"}. Try again.`);
		} finally {
			setSaving(false);
		}
	}, []);
	const focusKey = (key) => {
		if (typeof window === "undefined") return;
		window.location.hash = `#secrets:${key}`;
	};
	const chooseSource = (next) => {
		if (next === transcriptionMode) return;
		if (next === "google-realtime" && !googleRealtimeReady) {
			setShowAdvanced(true);
			if (!googleRealtimeConfigured) focusKey("GOOGLE_APPLICATION_CREDENTIALS");
			else if (!builderRealtimeReady) openBuilderConnect();
			return;
		}
		const previous = {
			transcriptionMode,
			provider,
			instructions
		};
		const nextProvider = providerForMode(next, provider);
		setTranscriptionMode(next);
		setProvider(nextProvider);
		persist(next, nextProvider, instructions, previous);
	};
	const openBuilderConnect = () => {
		if (typeof window === "undefined") return;
		const url = new URL(agentNativePath("/_agent-native/builder/connect"), window.location.origin).href;
		window.open(url, "_blank", "noopener,noreferrer,width=600,height=700");
	};
	const chooseBatchProvider = (next) => {
		const nextProvider = batchProvider(normalizeProvider(next));
		if (transcriptionMode === "batch" && nextProvider === provider) return;
		const previous = {
			transcriptionMode,
			provider,
			instructions
		};
		setTranscriptionMode("batch");
		setProvider(nextProvider);
		persist("batch", nextProvider, instructions, previous);
	};
	const updateInstructions = (next) => {
		const previous = {
			transcriptionMode,
			provider,
			instructions
		};
		setInstructions(next);
		if (transcriptionMode) persist(transcriptionMode, provider, next, previous);
	};
	if (transcriptionMode === null) return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 text-[10px] text-muted-foreground",
		children: [(0, import_jsx_runtime.jsx)(IconLoader2, {
			size: 10,
			className: "animate-spin"
		}), "Loading…"]
	});
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border bg-background p-2",
				children: [(0, import_jsx_runtime.jsx)("div", {
					className: "mb-2 flex items-start justify-between gap-3 px-0.5",
					children: (0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium text-foreground",
						children: "Live transcription"
					}), (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-[10px] text-muted-foreground",
						children: "Choose where real-time words come from. Batch still runs after recording stops."
					})] })
				}), (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "mac-native",
							selected: transcriptionMode === "mac-native",
							onSelect: () => chooseSource("mac-native"),
							title: "Mac Native",
							subtitle: "Free and fast in the macOS Tauri app. Web clients use the existing browser-native path when available.",
							rightSlot: (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: "Tauri default"
							})
						}),
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "google-realtime",
							selected: transcriptionMode === "google-realtime",
							onSelect: () => chooseSource("google-realtime"),
							disabled: !googleRealtimeReady,
							title: "Google Realtime",
							subtitle: googleRealtimeReady ? "BYOK only for v1. Streams live partials and finals through Google Speech-to-Text." : googleRealtimeConfigured ? "Google credentials are set. Connect Builder completely to mint the managed realtime session." : "BYOK only for v1. Configure Google service account before selecting this source.",
							rightSlot: googleRealtimeReady ? (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] text-green-500",
								children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Ready"]
							}) : googleRealtimeConfigured ? (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									openBuilderConnect();
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-accent/40 hover:text-foreground",
								children: ["Connect Builder.io", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							}) : (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									setShowAdvanced(true);
									focusKey("GOOGLE_APPLICATION_CREDENTIALS");
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:bg-accent/40 hover:text-foreground",
								children: ["Configure", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							})
						}),
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "batch",
							selected: transcriptionMode === "batch",
							onSelect: () => chooseSource("batch"),
							title: "Batch",
							subtitle: "Universal fallback. Sends audio after recording stops through Builder Gemini, Gemini, Groq, then OpenAI."
						}),
						(0, import_jsx_runtime.jsx)(SystemAudioStatus, {})
					]
				})]
			}),
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3 rounded-md border border-border bg-accent/30 px-2.5 py-2",
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [(0, import_jsx_runtime.jsx)("div", {
						className: "text-[11px] font-medium text-foreground",
						children: "AI cleanup"
					}), (0, import_jsx_runtime.jsx)("p", {
						className: "text-[10px] text-muted-foreground mt-0.5",
						children: "Polish punctuation, casing, filler words, titles, and summaries after capture. Builder Gemini is tried first; BYOK Gemini is the fallback."
					})]
				}), (0, import_jsx_runtime.jsxs)("div", {
					className: "flex shrink-0 flex-col items-end gap-1",
					children: [(0, import_jsx_runtime.jsx)("button", {
						type: "button",
						role: "switch",
						"aria-checked": !!cleanupEnabled,
						onClick: () => toggleCleanup(!cleanupEnabled),
						className: `relative inline-flex h-4 w-7 shrink-0 cursor-pointer items-center rounded-full transition-colors ${cleanupEnabled ? "bg-primary" : "bg-muted-foreground/30 hover:bg-muted-foreground/50"}`,
						children: (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-3 w-3 transform rounded-full bg-background transition-transform ${cleanupEnabled ? "translate-x-3.5" : "translate-x-0.5"}` })
					}), cleanupEnabled && (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground",
						children: builderStatus?.configured ? "Builder ready" : geminiConfigured ? "Gemini key set" : "Needs key"
					})]
				})]
			}),
			(0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border bg-background",
				children: [(0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowAdvanced((v) => !v),
					className: "w-full flex items-center justify-between gap-2 px-2.5 py-2 cursor-pointer",
					children: [(0, import_jsx_runtime.jsxs)("span", {
						className: "text-[11px] font-medium text-foreground inline-flex items-center gap-1",
						children: [showAdvanced ? (0, import_jsx_runtime.jsx)(IconChevronDown, { size: 12 }) : (0, import_jsx_runtime.jsx)(IconChevronRight, { size: 12 }), "Add API keys"]
					}), (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] text-muted-foreground",
						children: "Google STT · Gemini · Groq · OpenAI"
					})]
				}), showAdvanced && (0, import_jsx_runtime.jsxs)("div", {
					className: "px-2 pb-2 space-y-2",
					children: [
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "google-service-account",
							selected: transcriptionMode === "google-realtime",
							onSelect: () => chooseSource("google-realtime"),
							disabled: !googleRealtimeReady,
							title: "Google Speech-to-Text service account",
							subtitle: googleRealtimeConfigured ? "Service-account JSON is set. Connect Builder to mint the managed realtime WebSocket session." : "Service-account JSON for the dedicated realtime WebSocket to Google StreamingRecognize.",
							rightSlot: googleRealtimeConfigured === null ? null : googleRealtimeReady ? (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] text-green-500",
								children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Ready"]
							}) : googleRealtimeConfigured ? (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									openBuilderConnect();
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40",
								children: ["Connect Builder.io", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							}) : (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									focusKey("GOOGLE_APPLICATION_CREDENTIALS");
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40",
								children: ["Configure", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							})
						}),
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "auto",
							selected: transcriptionMode === "batch" && provider === "auto",
							onSelect: () => chooseBatchProvider("auto"),
							title: "Automatic batch fallback",
							subtitle: "Keep the current Clips fallback chain: Builder Gemini, Gemini, Groq, then OpenAI."
						}),
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "builder-gemini",
							selected: transcriptionMode === "batch" && provider === "builder-gemini",
							onSelect: () => chooseBatchProvider("builder-gemini"),
							disabled: !builderStatus?.configured,
							title: "Builder.io Connect",
							subtitle: builderStatus?.configured ? "Use Builder-hosted Gemini Flash-Lite for batch transcription and cleanup." : "One-click connect for Gemini Flash-Lite cleanup and batch transcription. No Google key needed.",
							rightSlot: builderStatus?.configured ? (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] text-green-500",
								children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Connected"]
							}) : (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									openBuilderConnect();
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40",
								children: ["Connect Builder.io", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							})
						}),
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "gemini",
							selected: transcriptionMode === "batch" && provider === "gemini",
							onSelect: () => chooseBatchProvider("gemini"),
							title: "Google Gemini",
							subtitle: "BYOK Gemini for AI cleanup and optional strict batch transcription.",
							rightSlot: geminiConfigured === null ? null : geminiConfigured ? (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] text-green-500",
								children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Key set"]
							}) : (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									focusKey("GEMINI_API_KEY");
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40",
								children: ["Add key", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							})
						}),
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "openai",
							selected: transcriptionMode === "batch" && provider === "openai",
							onSelect: () => chooseBatchProvider("openai"),
							title: "OpenAI Whisper",
							subtitle: "Batch Whisper provider. Requires an OpenAI API key.",
							rightSlot: openAiConfigured === null ? null : openAiConfigured ? (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] text-green-500",
								children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Key set"]
							}) : (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									focusKey("OPENAI_API_KEY");
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40",
								children: ["Add key", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							})
						}),
						(0, import_jsx_runtime.jsx)(ProviderOption, {
							id: "groq",
							selected: transcriptionMode === "batch" && provider === "groq",
							onSelect: () => chooseBatchProvider("groq"),
							title: "Groq Whisper",
							subtitle: "Fast Whisper batch provider. Requires a Groq API key.",
							rightSlot: groqConfigured === null ? null : groqConfigured ? (0, import_jsx_runtime.jsxs)("span", {
								className: "flex items-center gap-1 text-[10px] text-green-500",
								children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Key set"]
							}) : (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								onClick: (e) => {
									e.stopPropagation();
									focusKey("GROQ_API_KEY");
								},
								className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40",
								children: ["Add key", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
							})
						})
					]
				})]
			}),
			(cleanupEnabled || transcriptionMode === "batch") && (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border bg-accent/20 px-2.5 py-2",
				children: [
					(0, import_jsx_runtime.jsx)("label", {
						htmlFor: "voice-transcription-instructions",
						className: "block text-[10px] font-medium text-foreground",
						children: "Custom instructions"
					}),
					(0, import_jsx_runtime.jsx)("textarea", {
						id: "voice-transcription-instructions",
						value: instructions,
						onChange: (event) => updateInstructions(event.target.value),
						placeholder: "Names, casing, punctuation, style, or terms to preserve.",
						className: "mt-1 min-h-16 w-full resize-y rounded border border-border bg-background px-2 py-1.5 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent"
					}),
					(0, import_jsx_runtime.jsx)("p", {
						className: "mt-1 text-[10px] text-muted-foreground",
						children: "Included with batch transcription and AI cleanup."
					})
				]
			}),
			saving && (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground",
				children: "Saving…"
			}),
			saveError && !saving && (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-red-500",
				role: "alert",
				children: saveError
			})
		]
	});
}
function ProviderOption({ id, selected, disabled, onSelect, title, subtitle, rightSlot }) {
	const select = () => {
		if (!disabled) onSelect();
	};
	const onKeyDown = (event) => {
		if (disabled) return;
		if (event.key === "Enter" || event.key === " ") {
			event.preventDefault();
			onSelect();
		}
	};
	return (0, import_jsx_runtime.jsxs)("div", {
		role: "button",
		tabIndex: disabled ? -1 : 0,
		onClick: select,
		onKeyDown,
		"aria-pressed": selected,
		"aria-disabled": disabled || void 0,
		className: `w-full text-left rounded-md border px-2.5 py-2 flex items-start gap-2 ${selected ? "border-primary bg-primary/10" : "border-border bg-accent/30 hover:bg-accent/50"} ${disabled ? "opacity-60 cursor-not-allowed" : ""}`,
		children: [(0, import_jsx_runtime.jsx)("span", {
			className: `mt-[2px] shrink-0 flex h-3.5 w-3.5 items-center justify-center rounded-full border ${selected ? "border-primary bg-primary" : "border-muted-foreground/40 bg-background"}`,
			children: selected && (0, import_jsx_runtime.jsx)("span", { className: "h-1.5 w-1.5 rounded-full bg-primary-foreground" })
		}), (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [(0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium text-foreground",
					children: title
				}), rightSlot && (0, import_jsx_runtime.jsx)("div", {
					className: "shrink-0",
					children: rightSlot
				})]
			}), subtitle && (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground mt-0.5",
				children: subtitle
			})]
		})]
	});
}
function getTauriInvoke() {
	if (typeof window === "undefined") return null;
	return window.__TAURI_INTERNALS__?.invoke ?? null;
}
function SystemAudioStatus() {
	const [state, setState] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		const invoke = getTauriInvoke();
		if (!invoke) return;
		setState({ kind: "loading" });
		(async () => {
			try {
				const status = await invoke("system_audio_version_status");
				if (cancelled) return;
				if (status && !status.supported) {
					setState({
						kind: "unsupported",
						reason: status.reason ?? `ScreenCaptureKit is unavailable on ${status.os_version}.`
					});
					return;
				}
				try {
					const granted = await invoke("system_audio_request_permission");
					if (cancelled) return;
					setState(granted ? { kind: "available" } : { kind: "denied" });
				} catch (err) {
					if (cancelled) return;
					const msg = String(err ?? "");
					if (/macOS\s*1[0-2]|requires macOS 13/i.test(msg)) setState({
						kind: "unsupported",
						reason: msg
					});
					else setState({ kind: "denied" });
				}
			} catch {
				if (cancelled) return;
				try {
					const granted = await invoke("system_audio_request_permission");
					if (cancelled) return;
					setState(granted ? { kind: "available" } : { kind: "denied" });
				} catch (err) {
					if (cancelled) return;
					const msg = String(err ?? "");
					if (/macOS|ScreenCaptureKit/i.test(msg)) setState({
						kind: "unsupported",
						reason: msg
					});
					else setState({ kind: "denied" });
				}
			}
		})();
		return () => {
			cancelled = true;
		};
	}, []);
	const openPrivacy = (0, import_react.useCallback)(() => {
		const invoke = getTauriInvoke();
		if (!invoke) return;
		invoke("system_audio_open_privacy_settings").catch(() => {});
	}, []);
	if (!state || state.kind === "loading") return null;
	if (state.kind === "available") return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 px-0.5 pt-1 text-[10px] text-muted-foreground",
		children: [(0, import_jsx_runtime.jsx)(IconCheck, {
			size: 11,
			className: "text-green-500"
		}), (0, import_jsx_runtime.jsx)("span", { children: "System audio capture available." })]
	});
	if (state.kind === "unsupported") return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 px-0.5 pt-1 text-[10px] text-muted-foreground",
		children: [(0, import_jsx_runtime.jsx)("span", {
			className: "inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-red-500",
			"aria-hidden": true
		}), (0, import_jsx_runtime.jsx)("span", { children: "System audio requires macOS 13 or later — meetings will use mic-only." })]
	});
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-start gap-1.5 px-0.5 pt-1 text-[10px] text-muted-foreground",
		children: [(0, import_jsx_runtime.jsx)(IconAlertCircle, {
			size: 11,
			className: "mt-[1px] shrink-0 text-amber-500"
		}), (0, import_jsx_runtime.jsxs)("div", {
			className: "flex-1",
			children: [(0, import_jsx_runtime.jsx)("span", { children: "Grant Screen Recording permission in System Settings -> Privacy." }), (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: openPrivacy,
				className: "ml-1 inline-flex items-center gap-1 rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground hover:bg-accent/40 hover:text-foreground",
				children: [(0, import_jsx_runtime.jsx)(IconLockOpen, { size: 10 }), "Open System Settings"]
			})]
		})]
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/AutomationsSection.js
function flattenJobs(nodes) {
	const items = [];
	for (const node of nodes) {
		if (node.type === "folder" && node.children) items.push(...flattenJobs(node.children));
		if (node.type === "file" && node.kind === "job" && node.resource && node.jobMeta) {
			const name = node.name.replace(/\.md$/, "").replace(/-/g, " ");
			items.push({
				id: node.resource.id,
				name,
				path: node.resource.path,
				schedule: node.jobMeta.schedule,
				scheduleDescription: node.jobMeta.scheduleDescription,
				enabled: node.jobMeta.enabled ?? false,
				lastStatus: node.jobMeta.lastStatus,
				lastRun: node.jobMeta.lastRun,
				nextRun: node.jobMeta.nextRun
			});
		}
	}
	return items;
}
function AutomationsSection() {
	const [automations, setAutomations] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [togglingId, setTogglingId] = (0, import_react.useState)(null);
	const [deletingId, setDeletingId] = (0, import_react.useState)(null);
	const [confirmDeleteId, setConfirmDeleteId] = (0, import_react.useState)(null);
	const [toast, setToast] = (0, import_react.useState)(null);
	const [reloadToken, setReloadToken] = (0, import_react.useState)(0);
	const showToast = (0, import_react.useCallback)((kind, text, ms = 2500) => {
		setToast({
			kind,
			text
		});
		setTimeout(() => setToast(null), ms);
	}, []);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		fetch(agentNativePath("/_agent-native/resources/tree")).then(async (r) => {
			if (!r.ok) throw new Error(`Failed to load (${r.status})`);
			return await r.json();
		}).then(({ tree }) => {
			if (cancelled) return;
			const jobsFolder = tree.find((n) => n.name === "jobs" && n.type === "folder");
			setAutomations(jobsFolder?.children ? flattenJobs(jobsFolder.children) : []);
			setLoading(false);
		}).catch((err) => {
			if (cancelled) return;
			setError(err?.message ?? "Failed to load");
			setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [reloadToken]);
	const reload = (0, import_react.useCallback)(() => setReloadToken((t) => t + 1), []);
	const handleToggle = (0, import_react.useCallback)(async (item) => {
		setTogglingId(item.id);
		try {
			const res = await fetch(agentNativePath(`/_agent-native/resources/${encodeURIComponent(item.id)}`));
			if (!res.ok) {
				showToast("err", "Failed to read automation");
				return;
			}
			const content = (await res.json()).content ?? "";
			const newEnabled = !item.enabled;
			const updated = content.replace(/^(enabled:\s*)(true|false)/m, `$1${newEnabled}`);
			if (!(await fetch(agentNativePath(`/_agent-native/resources/${encodeURIComponent(item.id)}`), {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ content: updated })
			})).ok) {
				showToast("err", "Failed to update automation");
				return;
			}
			showToast("ok", newEnabled ? "Enabled" : "Disabled");
			reload();
		} finally {
			setTogglingId(null);
		}
	}, [reload, showToast]);
	const handleDelete = (0, import_react.useCallback)(async (item) => {
		setDeletingId(item.id);
		try {
			if (!(await fetch(agentNativePath(`/_agent-native/resources/${encodeURIComponent(item.id)}`), {
				method: "DELETE",
				headers: { "Content-Type": "application/json" }
			})).ok) {
				showToast("err", "Failed to delete automation");
				return;
			}
			showToast("ok", "Deleted");
			setConfirmDeleteId(null);
			reload();
		} finally {
			setDeletingId(null);
		}
	}, [reload, showToast]);
	const handleFireTestEvent = (0, import_react.useCallback)(async () => {
		showToast("ok", "Firing test event...");
		try {
			const res = await fetch(agentNativePath("/_agent-native/automations/fire-test"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ data: {} })
			});
			if (!res.ok) {
				showToast("err", `Failed to fire event (${res.status})`);
				return;
			}
			showToast("ok", "Event fired");
		} catch (err) {
			showToast("err", err?.message ?? "Failed to fire event");
		}
	}, [showToast]);
	const [newOpen, setNewOpen] = (0, import_react.useState)(false);
	const [newScope, setNewScope] = (0, import_react.useState)("personal");
	const handleNewSubmit = (0, import_react.useCallback)((text) => {
		const trimmed = text.trim();
		if (!trimmed) return;
		window.dispatchEvent(new CustomEvent("agent-panel:set-mode", { detail: { mode: "chat" } }));
		sendToAgentChat({
			message: trimmed,
			context: `The user wants to create a new automation. Scope: ${newScope}. Use manage-automations with action=define to create it. Ask clarifying questions if needed about what event to trigger on, conditions, and what actions to take.`,
			submit: true,
			newTab: true
		});
		setNewOpen(false);
	}, [newScope]);
	if (error) return (0, import_jsx_runtime.jsxs)("p", {
		className: "text-[10px] text-red-500",
		children: ["Failed to load automations: ", error]
	});
	if (loading) return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-1.5 text-[10px] text-muted-foreground",
		children: [(0, import_jsx_runtime.jsx)(IconLoader2, {
			size: 10,
			className: "animate-spin"
		}), "Loading..."]
	});
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1.5",
				children: [(0, import_jsx_runtime.jsxs)(Popover, {
					open: newOpen,
					onOpenChange: setNewOpen,
					children: [(0, import_jsx_runtime.jsx)(PopoverTrigger, {
						asChild: true,
						children: (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40",
							children: [(0, import_jsx_runtime.jsx)(IconPlus, { size: 10 }), "New Automation"]
						})
					}), (0, import_jsx_runtime.jsxs)(PopoverContent, {
						align: "start",
						sideOffset: 6,
						collisionPadding: 8,
						className: "z-[260] w-[calc(100vw-24px)] max-w-[380px] p-3",
						children: [
							(0, import_jsx_runtime.jsx)("p", {
								className: "px-1 pb-2 text-sm font-semibold text-foreground",
								children: "New automation"
							}),
							(0, import_jsx_runtime.jsx)(PromptComposer, {
								autoFocus: true,
								placeholder: "Describe what you want to automate...",
								draftScope: "automations:create",
								onSubmit: handleNewSubmit
							}),
							(0, import_jsx_runtime.jsx)("div", {
								className: "mt-2",
								children: (0, import_jsx_runtime.jsxs)("select", {
									value: newScope,
									onChange: (e) => setNewScope(e.target.value),
									className: "w-full cursor-pointer rounded-md border border-input bg-background px-3 py-1.5 text-[12px] text-foreground",
									children: [(0, import_jsx_runtime.jsx)("option", {
										value: "personal",
										children: "Personal"
									}), (0, import_jsx_runtime.jsx)("option", {
										value: "organization",
										children: "Organization"
									})]
								})
							})
						]
					})]
				}), automations.length > 0 && (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: handleFireTestEvent,
					className: "inline-flex items-center gap-1 rounded border border-border px-2 py-1 text-[10px] font-medium text-muted-foreground hover:text-foreground hover:bg-accent/40",
					children: [(0, import_jsx_runtime.jsx)(IconPlayerPlay, { size: 10 }), "Fire Test Event"]
				})]
			}),
			automations.length === 0 ? (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground",
				children: "No automations yet. Click \"New Automation\" to create one, or ask the agent to set up a scheduled or event-triggered task."
			}) : automations.map((item) => (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border px-2.5 py-2 bg-accent/30",
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-2",
					children: [(0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [
							(0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1.5",
								children: [(0, import_jsx_runtime.jsx)("span", {
									className: "text-muted-foreground shrink-0",
									children: item.schedule ? (0, import_jsx_runtime.jsx)(IconClock, { size: 11 }) : (0, import_jsx_runtime.jsx)(IconBolt, { size: 11 })
								}), (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-medium text-foreground truncate capitalize",
									children: item.name
								})]
							}),
							item.scheduleDescription && (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground mt-0.5 ml-[17px]",
								children: item.scheduleDescription
							}),
							item.schedule && !item.scheduleDescription && (0, import_jsx_runtime.jsx)("p", {
								className: "text-[10px] text-muted-foreground mt-0.5 ml-[17px] font-mono",
								children: item.schedule
							})
						]
					}), (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1.5 shrink-0",
						children: [
							(0, import_jsx_runtime.jsx)(StatusBadge, { status: item.lastStatus }),
							(0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
								asChild: true,
								children: (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleToggle(item),
									disabled: togglingId === item.id,
									className: `rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${item.enabled ? "bg-green-500/15 text-green-500" : "bg-accent/60 text-muted-foreground"} hover:opacity-80 disabled:opacity-40`,
									children: togglingId === item.id ? (0, import_jsx_runtime.jsx)(IconLoader2, {
										size: 10,
										className: "animate-spin"
									}) : item.enabled ? "On" : "Off"
								})
							}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: item.enabled ? "Disable" : "Enable" })] }),
							confirmDeleteId === item.id ? (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-1",
								children: [(0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => handleDelete(item),
									disabled: deletingId === item.id,
									className: "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-red-500/15 text-red-500 hover:bg-red-500/25 disabled:opacity-40",
									children: deletingId === item.id ? (0, import_jsx_runtime.jsx)(IconLoader2, {
										size: 10,
										className: "animate-spin"
									}) : "Confirm"
								}), (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setConfirmDeleteId(null),
									className: "rounded px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide bg-accent/60 text-muted-foreground hover:text-foreground",
									children: "Cancel"
								})]
							}) : (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
								asChild: true,
								children: (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setConfirmDeleteId(item.id),
									className: "text-muted-foreground hover:text-red-500 disabled:opacity-40",
									children: (0, import_jsx_runtime.jsx)(IconTrash, { size: 12 })
								})
							}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Delete" })] })
						]
					})]
				}), item.lastRun && (0, import_jsx_runtime.jsxs)("p", {
					className: "text-[10px] text-muted-foreground mt-1 ml-[17px]",
					children: [
						"Last run:",
						" ",
						new Date(item.lastRun).toLocaleString(void 0, {
							month: "short",
							day: "numeric",
							hour: "numeric",
							minute: "2-digit"
						})
					]
				})]
			}, item.id)),
			toast && (0, import_jsx_runtime.jsx)("p", {
				className: `text-[10px] ${toast.kind === "ok" ? "text-green-500" : "text-red-500"}`,
				children: toast.text
			})
		]
	});
}
function StatusBadge({ status }) {
	if (!status) return null;
	const styles = {
		success: "bg-green-500/15 text-green-500",
		error: "bg-red-500/15 text-red-500",
		running: "bg-blue-500/15 text-blue-500",
		skipped: "bg-accent/60 text-muted-foreground"
	};
	return (0, import_jsx_runtime.jsx)("span", {
		className: `rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide ${styles[status] ?? styles.skipped}`,
		children: status
	});
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/use-avatar.js
/**
* Avatar hooks for fetching and uploading user avatars.
*
* Avatars are stored as compressed base64 JPEG data URLs (64×64, ~2-4 KB)
* in the settings table under the key `avatar:<email>`.
*
* Avatars are semi-public — any client can read any user's avatar by email.
*/
var _cache = /* @__PURE__ */ new Map();
var _inFlight = /* @__PURE__ */ new Map();
var _listeners = /* @__PURE__ */ new Map();
function notifyListeners(email, url) {
	_listeners.get(email)?.forEach((fn) => fn(url));
}
async function fetchAvatar(email) {
	if (_cache.has(email)) return _cache.get(email);
	if (_inFlight.has(email)) return _inFlight.get(email);
	const p = fetch(agentNativePath(`/_agent-native/avatar/${encodeURIComponent(email)}`)).then((r) => r.ok ? r.json() : null).then((d) => {
		const url = d?.image ?? null;
		if (!_cache.has(email)) _cache.set(email, url);
		_inFlight.delete(email);
		return _cache.get(email) ?? null;
	}).catch(() => {
		if (!_cache.has(email)) _cache.set(email, null);
		_inFlight.delete(email);
		return null;
	});
	_inFlight.set(email, p);
	return p;
}
/** Returns the avatar data URL for a given email, or null if none is set. */
function useAvatarUrl(email) {
	const [url, setUrl] = (0, import_react.useState)(email ? _cache.get(email) ?? null : null);
	(0, import_react.useEffect)(() => {
		if (!email) return;
		let cancelled = false;
		fetchAvatar(email).then((u) => {
			if (!cancelled) setUrl(u);
		});
		if (!_listeners.has(email)) _listeners.set(email, /* @__PURE__ */ new Set());
		const listener = (u) => setUrl(u);
		_listeners.get(email).add(listener);
		return () => {
			cancelled = true;
			const set = _listeners.get(email);
			if (set) {
				set.delete(listener);
				if (set.size === 0) _listeners.delete(email);
			}
		};
	}, [email]);
	return url;
}
/** Compress a File to a 64×64 JPEG data URL (~2-4 KB) using Canvas API. */
async function compressAvatar(file) {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const objectUrl = URL.createObjectURL(file);
		img.onload = () => {
			URL.revokeObjectURL(objectUrl);
			const canvas = document.createElement("canvas");
			canvas.width = 64;
			canvas.height = 64;
			const ctx = canvas.getContext("2d");
			const size = Math.min(img.width, img.height);
			const sx = (img.width - size) / 2;
			const sy = (img.height - size) / 2;
			ctx.drawImage(img, sx, sy, size, size, 0, 0, 64, 64);
			resolve(canvas.toDataURL("image/jpeg", .75));
		};
		img.onerror = reject;
		img.src = objectUrl;
	});
}
/** Compress and upload an avatar image for the given user. */
async function uploadAvatar(file, email) {
	const image = await compressAvatar(file);
	const res = await fetch(agentNativePath("/_agent-native/avatar"), {
		method: "PUT",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({ image })
	});
	if (!res.ok) throw new Error(`Avatar upload failed: ${res.status}`);
	_cache.set(email, image);
	_inFlight.delete(email);
	notifyListeners(email, image);
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/settings/SettingsPanel.js
var IntegrationsPanel = (0, import_react.lazy)(() => import("./IntegrationsPanel-CzbtEElh.js").then((m) => ({ default: m.IntegrationsPanel })));
function SettingsSkeleton({ lines = 3 }) {
	return (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-3 animate-pulse",
		children: Array.from({ length: lines }, (_, i) => (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [(0, import_jsx_runtime.jsx)("div", {
				className: "h-3 rounded bg-muted-foreground/10",
				style: { width: i === 0 ? "30%" : i === 1 ? "100%" : "60%" }
			}), i < 2 && (0, import_jsx_runtime.jsx)("div", { className: "h-9 rounded-md border border-border bg-muted-foreground/5" })]
		}, i))
	});
}
var CONTROL_STYLE = {
	fontSize: 12,
	lineHeight: 1
};
function SettingsSelect({ label, labelAdornment, value, options, onValueChange }) {
	const selected = options.find((option) => option.value === value);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [(0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-between",
			children: [(0, import_jsx_runtime.jsx)("p", {
				className: "text-[12px] font-medium text-foreground",
				children: label
			}), labelAdornment]
		}), (0, import_jsx_runtime.jsxs)(Root2, {
			value,
			onValueChange,
			children: [(0, import_jsx_runtime.jsxs)(Trigger, {
				className: "flex h-9 w-full items-center justify-between rounded-md border border-border bg-background px-3 text-left text-[12px] text-foreground outline-none transition-colors hover:bg-accent/40 data-[placeholder]:text-muted-foreground",
				"aria-label": label,
				style: CONTROL_STYLE,
				children: [(0, import_jsx_runtime.jsx)(Value, { children: selected?.label ?? value }), (0, import_jsx_runtime.jsx)(Icon, {
					asChild: true,
					children: (0, import_jsx_runtime.jsx)(IconChevronDown, {
						size: 14,
						className: "text-muted-foreground"
					})
				})]
			}), (0, import_jsx_runtime.jsx)(Portal, { children: (0, import_jsx_runtime.jsx)(Content2, {
				position: "popper",
				sideOffset: 6,
				className: "z-[9999] w-[var(--radix-select-trigger-width)] overflow-hidden rounded-lg border border-border bg-popover shadow-lg",
				children: (0, import_jsx_runtime.jsx)(Viewport, {
					className: "p-1",
					children: options.map((option) => (0, import_jsx_runtime.jsxs)(Item, {
						value: option.value,
						className: "relative flex w-full cursor-pointer select-none items-start gap-2 rounded-md px-8 py-2.5 text-[12px] outline-none data-[highlighted]:bg-accent/60 data-[state=checked]:bg-accent/40",
						style: CONTROL_STYLE,
						children: [(0, import_jsx_runtime.jsx)("span", {
							className: "absolute left-2 top-2.5 flex h-4 w-4 items-center justify-center text-muted-foreground",
							children: (0, import_jsx_runtime.jsx)(ItemIndicator, { children: (0, import_jsx_runtime.jsx)(IconCheck, { size: 14 }) })
						}), (0, import_jsx_runtime.jsxs)("div", {
							className: "flex min-w-0 flex-col",
							children: [(0, import_jsx_runtime.jsx)(ItemText, { children: (0, import_jsx_runtime.jsx)("span", {
								className: "text-foreground",
								children: option.label
							}) }), option.description ? (0, import_jsx_runtime.jsx)("span", {
								className: "mt-0.5 text-[11px] leading-relaxed text-muted-foreground",
								children: option.description
							}) : null]
						})]
					}, option.value))
				})
			}) })]
		})]
	});
}
function DisconnectBuilderButton() {
	const { status } = useBuilderStatus();
	const [phase, setPhase] = (0, import_react.useState)("idle");
	const [err, setErr] = (0, import_react.useState)(null);
	const armedTimerRef = (0, import_react.useRef)(null);
	const clearArmedTimer = (0, import_react.useCallback)(() => {
		if (armedTimerRef.current) {
			clearTimeout(armedTimerRef.current);
			armedTimerRef.current = null;
		}
	}, []);
	(0, import_react.useEffect)(() => {
		return () => clearArmedTimer();
	}, [clearArmedTimer]);
	const performDisconnect = (0, import_react.useCallback)(async () => {
		setPhase("busy");
		setErr(null);
		clearArmedTimer();
		try {
			const res = await fetch(agentNativePath("/_agent-native/builder/disconnect"), {
				method: "POST",
				headers: { "Content-Type": "application/json" }
			});
			const text = await res.text();
			let body = {};
			if (text) try {
				body = JSON.parse(text);
			} catch {}
			if (!res.ok) throw new Error(body.error || `Failed (${res.status}). Is dev:all up to date?`);
			if (body.ok !== true) throw new Error(body.error || "Disconnect didn't confirm ok");
			if (body.warnings && Object.keys(body.warnings).length > 0) console.warn("[builder-disconnect] completed with warnings:", body.warnings);
			window.dispatchEvent(new CustomEvent("agent-engine:configured-changed"));
			setPhase("idle");
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Disconnect failed");
			setPhase("idle");
		}
	}, [clearArmedTimer]);
	const handleDisconnectClick = (0, import_react.useCallback)(() => {
		if (phase === "busy") return;
		if (phase === "idle") {
			setPhase("armed");
			setErr(null);
			clearArmedTimer();
			armedTimerRef.current = setTimeout(() => {
				setPhase("idle");
				armedTimerRef.current = null;
			}, 4e3);
			return;
		}
		performDisconnect();
	}, [
		phase,
		performDisconnect,
		clearArmedTimer
	]);
	const handleCancel = (0, import_react.useCallback)(() => {
		clearArmedTimer();
		setPhase("idle");
	}, [clearArmedTimer]);
	if (status?.credentialSource === "env") return null;
	if (phase === "armed") return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: handleDisconnectClick,
		className: "inline-flex items-center gap-1 rounded border border-destructive/40 bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive hover:bg-destructive/20",
		children: "Confirm disconnect"
	}), (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: handleCancel,
		className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40",
		children: "Cancel"
	})] });
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: handleDisconnectClick,
		disabled: phase === "busy",
		className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground hover:bg-accent/40 disabled:opacity-60 disabled:cursor-wait",
		"aria-busy": phase === "busy",
		children: phase === "busy" ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(IconLoader2, {
			size: 10,
			className: "animate-spin"
		}), "Disconnecting…"] }) : "Disconnect"
	}), err && (0, import_jsx_runtime.jsx)("span", {
		className: "text-[10px] text-destructive",
		children: err
	})] });
}
function UseBuilderCard({ builderFlow, connectUrl, connected, orgName, envManaged, credentialSource, label = "Connect Builder.io", subtitle = "Free credits to start — no API key needed.", dim }) {
	const effectiveConnected = connected || builderFlow.configured;
	const effectiveOrgName = builderFlow.orgName ?? orgName;
	const bgClass = dim ? "" : "bg-accent/30";
	if (effectiveConnected) return (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-md border border-border px-2.5 py-2 ${bgClass}`,
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [(0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium text-foreground",
					children: "Builder.io"
				}), (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 text-[10px] text-green-500",
					children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "Connected"]
				})]
			}),
			effectiveOrgName && (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground mt-0.5",
				children: effectiveOrgName
			}),
			envManaged ? (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground mt-1",
				children: credentialSource === "env" ? "Deployment fallback is available. Connect your own account to override it." : "Using your connected Builder account. Deployment fallback is still available."
			}) : null,
			connectUrl || credentialSource !== "env" ? (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2 mt-2.5",
				children: [connectUrl && (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: builderFlow.start,
					disabled: builderFlow.connecting,
					className: "inline-flex items-center gap-1 rounded border border-border px-2 py-0.5 text-[10px] no-underline text-muted-foreground hover:text-foreground hover:bg-accent/40 disabled:opacity-60",
					children: [builderFlow.connecting ? "Connecting..." : credentialSource === "env" ? "Connect account" : "Reconnect", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
				}), credentialSource !== "env" ? (0, import_jsx_runtime.jsx)(DisconnectBuilderButton, {}) : null]
			}) : null
		]
	});
	if (!connectUrl) return null;
	return (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: builderFlow.start,
		disabled: builderFlow.connecting,
		className: `block w-full rounded-md border border-border px-3 py-3 text-left no-underline bg-gradient-to-br from-teal-500/10 via-transparent to-transparent hover:border-foreground/30 transition-colors disabled:cursor-wait disabled:opacity-70`,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-start gap-2.5",
			children: [
				(0, import_jsx_runtime.jsx)("div", {
					className: "flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground text-background",
					children: (0, import_jsx_runtime.jsx)(BuilderBMark, { className: "h-3.5 w-3.5" })
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 min-w-0",
					children: [
						(0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 flex-wrap",
							children: [(0, import_jsx_runtime.jsx)("span", {
								className: "text-[12px] font-semibold text-foreground",
								children: builderFlow.connecting ? "Connecting Builder.io..." : label
							}), builderFlow.connecting && (0, import_jsx_runtime.jsx)(IconLoader2, {
								size: 12,
								className: "shrink-0 animate-spin text-muted-foreground"
							})]
						}),
						(0, import_jsx_runtime.jsx)("p", {
							className: "text-[10.5px] text-muted-foreground mt-0.5 leading-snug",
							children: subtitle
						}),
						builderFlow.error && (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[10px] text-destructive",
							children: builderFlow.error
						})
					]
				}),
				(0, import_jsx_runtime.jsx)(IconExternalLink, {
					size: 12,
					className: "shrink-0 text-muted-foreground mt-0.5"
				})
			]
		})
	});
}
function ManualSetupCard({ hint, docsUrl, docsLabel = "Read the docs", children, dim, sourceBadge }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		className: `rounded-md border border-border px-2.5 py-2 ${dim ? "" : "bg-accent/30"}`,
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between mb-1",
				children: [(0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium text-foreground",
					children: "Set up manually"
				}), sourceBadge ? (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1 text-[10px] text-green-500",
					children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), sourceBadge]
				}) : null]
			}),
			hint && (0, import_jsx_runtime.jsx)("p", {
				className: "text-[10px] text-muted-foreground mb-1.5",
				children: hint
			}),
			children,
			docsUrl && (0, import_jsx_runtime.jsxs)("a", {
				href: docsUrl,
				target: "_blank",
				rel: "noopener noreferrer",
				className: "inline-flex items-center gap-1 mt-1.5 rounded border border-border px-2.5 py-1 text-[10px] font-medium no-underline text-muted-foreground hover:text-foreground hover:bg-accent/40",
				children: [docsLabel, (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
			})
		]
	});
}
function friendlyModelName(model) {
	const claude = model.match(/^claude-(opus|sonnet|haiku)-(\d+)-(\d+)(?:-\d{8,})?$/);
	if (claude) return `${claude[1][0].toUpperCase() + claude[1].slice(1)} ${claude[2]}.${claude[3]}`;
	if (model.startsWith("gpt-")) return `GPT-${model.slice(4)}`;
	if (/^o\d/.test(model)) return model;
	const gemini = model.match(/^gemini-(.+?)(?:-preview)?$/);
	if (gemini) return `Gemini ${gemini[1].split("-").map((s) => s[0].toUpperCase() + s.slice(1)).join(" ")}${model.endsWith("-preview") ? " (preview)" : ""}`;
	return model;
}
function computeSourceBadge(args) {
	const { settingsConfigured, settingsStatus } = args;
	if (settingsConfigured) {
		if (settingsStatus?.source === "env") return `Connected via ${settingsStatus.envVar ?? args.envVar ?? "env"}`;
		return "Connected via template (server-side)";
	}
	if (args.envConfigured) return `Connected via ${args.envVar ?? "env"}`;
	if (args.builderConnected) return "Connected via Builder";
}
function latestModelsOnly(models) {
	const seen = /* @__PURE__ */ new Set();
	return models.filter((m) => {
		const claude = m.match(/^claude-(opus|sonnet|haiku)-/);
		if (claude) {
			if (seen.has(claude[1])) return false;
			seen.add(claude[1]);
			return true;
		}
		const gemini = m.match(/^gemini-(\d+(?:\.\d+)?)-(.+?)(?:-preview)?$/);
		if (gemini) {
			const family = gemini[2];
			if (seen.has(`gemini-${family}`)) return false;
			seen.add(`gemini-${family}`);
			return true;
		}
		return true;
	});
}
var PROVIDER_DOCS = {
	anthropic: "https://console.anthropic.com/settings/keys",
	"ai-sdk:anthropic": "https://console.anthropic.com/settings/keys",
	"ai-sdk:openai": "https://platform.openai.com/api-keys",
	"ai-sdk:google": "https://aistudio.google.com/apikey",
	"ai-sdk:openrouter": "https://openrouter.ai/keys",
	"ai-sdk:groq": "https://console.groq.com/keys",
	"ai-sdk:mistral": "https://console.mistral.ai/api-keys/",
	"ai-sdk:cohere": "https://dashboard.cohere.com/api-keys"
};
function LLMSectionInner({ builderFlow, builderLoading, connectUrl, connected, orgName, envManaged, credentialSource, open, onToggle }) {
	const [envKeys, setEnvKeys] = (0, import_react.useState)([]);
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [engines, setEngines] = (0, import_react.useState)([]);
	const [currentEngine, setCurrentEngine] = (0, import_react.useState)("anthropic");
	const [currentModel, setCurrentModel] = (0, import_react.useState)("");
	const [selectedEngine, setSelectedEngine] = (0, import_react.useState)("anthropic");
	const [selectedModel, setSelectedModel] = (0, import_react.useState)("");
	const [applyNote, setApplyNote] = (0, import_react.useState)(false);
	const [testing, setTesting] = (0, import_react.useState)(false);
	const [testResult, setTestResult] = (0, import_react.useState)(null);
	const [settingsStatus, setSettingsStatus] = (0, import_react.useState)(null);
	const [disconnectError, setDisconnectError] = (0, import_react.useState)(null);
	const [envLoaded, setEnvLoaded] = (0, import_react.useState)(false);
	const [enginesLoaded, setEnginesLoaded] = (0, import_react.useState)(false);
	const [statusLoaded, setStatusLoaded] = (0, import_react.useState)(false);
	const initialLoading = !envLoaded || !enginesLoaded || !statusLoaded || !!builderLoading;
	(0, import_react.useEffect)(() => {
		fetch(agentNativePath("/_agent-native/env-status")).then((r) => r.ok ? r.json() : []).then(setEnvKeys).catch(() => {}).finally(() => setEnvLoaded(true));
	}, [saved]);
	const notifyConfigChanged = (0, import_react.useCallback)(() => {
		window.dispatchEvent(new CustomEvent("agent-engine:configured-changed"));
	}, []);
	const refreshSettingsStatus = (0, import_react.useCallback)(() => {
		fetch(agentNativePath("/_agent-native/agent-engine/status")).then((r) => r.ok ? r.json() : null).then((data) => {
			if (data?.configured && typeof data.engine === "string" && (data.source === "env" || data.source === "settings")) setSettingsStatus({
				engine: data.engine,
				source: data.source,
				envVar: typeof data.envVar === "string" ? data.envVar : null
			});
			else setSettingsStatus(null);
		}).catch(() => {}).finally(() => setStatusLoaded(true));
	}, []);
	(0, import_react.useEffect)(() => {
		refreshSettingsStatus();
	}, [refreshSettingsStatus]);
	(0, import_react.useEffect)(() => {
		fetch(agentNativePath("/_agent-native/actions/manage-agent-engine"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ action: "list" })
		}).then((r) => r.ok ? r.json() : null).then((data) => {
			if (!data) return;
			setEngines(data.engines ?? []);
			const cur = data.current ?? {};
			setCurrentEngine(cur.engine ?? "anthropic");
			setCurrentModel(cur.model ?? "");
			setSelectedEngine(cur.engine ?? "anthropic");
			setSelectedModel(cur.model ?? "");
		}).catch(() => {}).finally(() => setEnginesLoaded(true));
	}, []);
	const selectedEngineInfo = engines.find((e) => e.name === selectedEngine);
	const envVar = selectedEngineInfo?.requiredEnvVars?.[0];
	const envConfigured = envVar ? envKeys.find((k) => k.key === envVar)?.configured ?? false : false;
	const settingsConfigured = settingsStatus != null && settingsStatus.engine === currentEngine;
	const anyKeyConfigured = envConfigured || connected || settingsConfigured;
	const sourceBadge = computeSourceBadge({
		settingsConfigured,
		settingsStatus,
		envConfigured,
		envVar,
		builderConnected: connected
	});
	const engineChanged = selectedEngine !== currentEngine || selectedModel !== currentModel;
	const providerOptions = engines.filter((e) => e.name === selectedEngine || e.name !== "ai-sdk:anthropic" && e.name !== "ai-sdk:ollama").map((e) => ({
		value: e.name,
		label: e.label
	}));
	const modelOptions = latestModelsOnly(selectedEngineInfo?.supportedModels ?? []).map((m) => ({
		value: m,
		label: friendlyModelName(m)
	}));
	const handleSave = async () => {
		if (!apiKey.trim() || !envVar) return;
		setSaving(true);
		try {
			if ((await fetch(agentNativePath("/_agent-native/env-vars"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ vars: [{
					key: envVar,
					value: apiKey.trim()
				}] })
			})).ok) {
				setSaved(true);
				setApiKey("");
				refreshSettingsStatus();
				notifyConfigChanged();
				setTimeout(() => setSaved(false), 2e3);
			}
		} finally {
			setSaving(false);
		}
	};
	const handleDisconnect = async () => {
		setDisconnectError(null);
		try {
			const res = await fetch(agentNativePath("/_agent-native/agent-engine/disconnect"), { method: "POST" });
			if (res.ok) {
				setTestResult(null);
				setApplyNote(false);
				refreshSettingsStatus();
				notifyConfigChanged();
				return;
			}
			setDisconnectError((await res.json().catch(() => null))?.error ?? (res.status === 401 ? "You must be signed in to disconnect." : `Disconnect failed (HTTP ${res.status})`));
		} catch (err) {
			setDisconnectError(err instanceof Error ? err.message : String(err));
		}
	};
	const handleTest = async () => {
		setTesting(true);
		setTestResult(null);
		try {
			const data = await (await fetch(agentNativePath("/_agent-native/actions/manage-agent-engine"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "test",
					engine: selectedEngine,
					model: selectedModel || selectedEngineInfo?.defaultModel
				})
			})).json();
			const parsed = typeof data === "string" ? JSON.parse(data) : typeof data?.result === "string" ? JSON.parse(data.result) : data;
			if (parsed?.ok) setTestResult({
				ok: true,
				latencyMs: parsed.latencyMs ?? 0,
				model: parsed.model ?? selectedModel
			});
			else setTestResult({
				ok: false,
				error: parsed?.error ?? "Test failed (no error message)"
			});
		} catch (err) {
			setTestResult({
				ok: false,
				error: err instanceof Error ? err.message : String(err)
			});
		} finally {
			setTesting(false);
		}
	};
	const handleApply = async () => {
		try {
			if ((await fetch(agentNativePath("/_agent-native/actions/manage-agent-engine"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					action: "set",
					engine: selectedEngine,
					model: selectedModel
				})
			})).ok) {
				setCurrentEngine(selectedEngine);
				setCurrentModel(selectedModel);
				setApplyNote(true);
				refreshSettingsStatus();
				notifyConfigChanged();
				setTimeout(() => setApplyNote(false), 4e3);
			}
		} catch {}
	};
	return (0, import_jsx_runtime.jsx)(SettingsSection, {
		icon: (0, import_jsx_runtime.jsx)(IconBrain, { size: 14 }),
		title: "LLM",
		subtitle: "Connect any major LLM — Claude, GPT, Gemini, and more.",
		required: true,
		connected: initialLoading ? void 0 : anyKeyConfigured,
		open,
		onToggle,
		children: initialLoading ? (0, import_jsx_runtime.jsx)(SettingsSkeleton, { lines: 3 }) : (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [(0, import_jsx_runtime.jsx)(UseBuilderCard, {
				builderFlow,
				connectUrl,
				connected,
				orgName,
				envManaged,
				credentialSource,
				label: "Connect Builder.io"
			}), !connected && (0, import_jsx_runtime.jsx)(ManualSetupCard, {
				hint: "Choose your AI provider and model.",
				docsUrl: PROVIDER_DOCS[selectedEngine],
				sourceBadge,
				docsLabel: "Get an API key",
				children: (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2 mb-1",
					children: [
						(0, import_jsx_runtime.jsx)(SettingsSelect, {
							label: "Provider",
							value: selectedEngine,
							options: providerOptions,
							onValueChange: (val) => {
								setSelectedEngine(val);
								setSelectedModel(engines.find((e) => e.name === val)?.defaultModel ?? "");
								setApiKey("");
							}
						}),
						(0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [
								(0, import_jsx_runtime.jsx)("p", {
									className: "text-[12px] font-medium text-foreground",
									children: "Model"
								}),
								(0, import_jsx_runtime.jsx)("input", {
									type: "text",
									list: `model-suggestions-${selectedEngine}`,
									value: selectedModel,
									onChange: (e) => setSelectedModel(e.target.value),
									placeholder: selectedEngineInfo?.defaultModel ?? "e.g. model-id",
									spellCheck: false,
									autoComplete: "off",
									className: "flex h-9 w-full rounded-md border border-border bg-background px-3 text-[12px] text-foreground outline-none transition-colors hover:bg-accent/40 focus:ring-1 focus:ring-accent placeholder:text-muted-foreground/50",
									style: CONTROL_STYLE
								}),
								modelOptions.length > 0 && (0, import_jsx_runtime.jsx)("datalist", {
									id: `model-suggestions-${selectedEngine}`,
									children: modelOptions.map((opt) => (0, import_jsx_runtime.jsx)("option", {
										value: opt.value,
										label: opt.label
									}, opt.value))
								})
							]
						}),
						envVar && envConfigured ? (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-1.5 text-[10px] text-green-500",
							children: [
								(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }),
								envVar,
								" configured"
							]
						}) : envVar ? (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-1.5",
							children: [(0, import_jsx_runtime.jsx)("input", {
								type: "password",
								value: apiKey,
								onChange: (e) => setApiKey(e.target.value),
								onKeyDown: (e) => {
									if (e.key === "Enter") handleSave();
								},
								placeholder: PROVIDER_ENV_PLACEHOLDERS[envVar] ?? "...",
								className: "flex-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent"
							}), (0, import_jsx_runtime.jsx)("button", {
								onClick: handleSave,
								disabled: !apiKey.trim() || saving,
								className: "rounded bg-accent px-2 py-1 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
								children: saving ? (0, import_jsx_runtime.jsx)(IconLoader2, {
									size: 10,
									className: "animate-spin"
								}) : saved ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }) : "Save"
							})]
						}) : null,
						(0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-2",
							children: [
								(0, import_jsx_runtime.jsx)("button", {
									onClick: handleTest,
									disabled: testing,
									className: "rounded border border-border px-2.5 py-1 text-[10px] font-medium text-foreground hover:bg-accent/40 disabled:opacity-40",
									children: testing ? (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1",
										children: [(0, import_jsx_runtime.jsx)(IconLoader2, {
											size: 10,
											className: "animate-spin"
										}), "Testing…"]
									}) : "Test"
								}),
								engineChanged && (0, import_jsx_runtime.jsx)("button", {
									onClick: handleApply,
									className: "rounded bg-accent px-2.5 py-1 text-[10px] font-medium text-foreground hover:bg-accent/80",
									children: "Apply"
								}),
								settingsStatus != null && (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
									asChild: true,
									children: (0, import_jsx_runtime.jsx)("button", {
										onClick: handleDisconnect,
										className: "ml-auto rounded border border-border px-2.5 py-1 text-[10px] font-medium text-muted-foreground hover:bg-destructive/10 hover:text-destructive hover:border-destructive/40",
										children: "Disconnect"
									})
								}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Clear the saved engine — the app will fall back to the default until you re-apply." })] })
							]
						}),
						testResult && testResult.ok && (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-1 text-[10px] text-green-500",
							children: [
								(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }),
								"Test passed — ",
								testResult.latencyMs,
								"ms"
							]
						}),
						testResult && testResult.ok === false && (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-destructive",
							children: ["Test failed: ", testResult.error]
						}),
						disconnectError && (0, import_jsx_runtime.jsxs)("p", {
							className: "text-[10px] text-destructive",
							children: ["Disconnect failed: ", disconnectError]
						}),
						applyNote && (0, import_jsx_runtime.jsx)("p", {
							className: "text-[10px] text-muted-foreground",
							children: "Changes take effect on next conversation"
						})
					]
				})
			})]
		})
	});
}
function EmailSectionInner({ open, onToggle }) {
	const [envKeys, setEnvKeys] = (0, import_react.useState)([]);
	const [resendKey, setResendKey] = (0, import_react.useState)("");
	const [sendgridKey, setSendgridKey] = (0, import_react.useState)("");
	const [fromAddr, setFromAddr] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [emailProvider, setEmailProvider] = (0, import_react.useState)("resend");
	const [envLoaded, setEnvLoaded] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		fetch(agentNativePath("/_agent-native/env-status")).then((r) => r.ok ? r.json() : []).then(setEnvKeys).catch(() => {}).finally(() => setEnvLoaded(true));
	}, [saved]);
	const resendConfigured = envKeys.find((k) => k.key === "RESEND_API_KEY")?.configured ?? false;
	const sendgridConfigured = envKeys.find((k) => k.key === "SENDGRID_API_KEY")?.configured ?? false;
	const fromConfigured = envKeys.find((k) => k.key === "EMAIL_FROM")?.configured ?? false;
	const anyConfigured = resendConfigured || sendgridConfigured;
	(0, import_react.useEffect)(() => {
		if (sendgridConfigured && !resendConfigured) setEmailProvider("sendgrid");
	}, [resendConfigured, sendgridConfigured]);
	const save = async (vars) => {
		setSaving(true);
		try {
			if ((await fetch(agentNativePath("/_agent-native/env-vars"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ vars })
			})).ok) {
				setSaved(true);
				setResendKey("");
				setSendgridKey("");
				setFromAddr("");
				setTimeout(() => setSaved(false), 2e3);
			}
		} finally {
			setSaving(false);
		}
	};
	const saveResend = () => {
		const vars = [];
		if (resendKey.trim()) vars.push({
			key: "RESEND_API_KEY",
			value: resendKey.trim()
		});
		if (fromAddr.trim()) vars.push({
			key: "EMAIL_FROM",
			value: fromAddr.trim()
		});
		if (vars.length) save(vars);
	};
	const saveSendgrid = () => {
		const vars = [];
		if (sendgridKey.trim()) vars.push({
			key: "SENDGRID_API_KEY",
			value: sendgridKey.trim()
		});
		if (fromAddr.trim()) vars.push({
			key: "EMAIL_FROM",
			value: fromAddr.trim()
		});
		if (vars.length) save(vars);
	};
	return (0, import_jsx_runtime.jsx)(SettingsSection, {
		icon: (0, import_jsx_runtime.jsx)(IconMail, { size: 14 }),
		title: "Email",
		subtitle: "Needed before deploy for password resets, team invitations, and share notifications. Local development can run without it.",
		connected: !envLoaded ? void 0 : anyConfigured,
		open,
		onToggle,
		children: !envLoaded ? (0, import_jsx_runtime.jsx)(SettingsSkeleton, { lines: 2 }) : (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-2",
			children: [(0, import_jsx_runtime.jsxs)("label", {
				className: "block space-y-1",
				children: [(0, import_jsx_runtime.jsx)("span", {
					className: "text-[10px] uppercase tracking-wide text-muted-foreground",
					children: "Provider"
				}), (0, import_jsx_runtime.jsxs)("select", {
					value: emailProvider,
					onChange: (e) => setEmailProvider(e.target.value),
					className: "w-full rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none focus:ring-1 focus:ring-accent",
					children: [(0, import_jsx_runtime.jsx)("option", {
						value: "resend",
						children: "Resend"
					}), (0, import_jsx_runtime.jsx)("option", {
						value: "sendgrid",
						children: "SendGrid"
					})]
				})]
			}), emailProvider === "resend" ? (0, import_jsx_runtime.jsxs)(ManualSetupCard, {
				hint: "Use Resend for transactional email.",
				docsUrl: "https://resend.com/api-keys",
				docsLabel: "Get a Resend key",
				children: [resendConfigured ? (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center gap-1.5 text-[10px] text-green-500",
					children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "RESEND_API_KEY configured"]
				}) : (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex gap-1.5",
					children: [(0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: resendKey,
						onChange: (e) => setResendKey(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") saveResend();
						},
						placeholder: "re_...",
						className: "flex-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent"
					}), (0, import_jsx_runtime.jsx)("button", {
						onClick: saveResend,
						disabled: !resendKey.trim() || saving,
						className: "rounded bg-accent px-2 py-1 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
						children: saving ? (0, import_jsx_runtime.jsx)(IconLoader2, {
							size: 10,
							className: "animate-spin"
						}) : saved ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }) : "Save"
					})]
				}), fromConfigured ? (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-[10px] text-green-500",
					children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "EMAIL_FROM configured"]
				}) : (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [(0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: fromAddr,
						onChange: (e) => setFromAddr(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") saveResend();
						},
						placeholder: "From address - e.g. Acme <hi@acme.com>",
						className: "flex-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent"
					}), !resendConfigured ? null : (0, import_jsx_runtime.jsx)("button", {
						onClick: saveResend,
						disabled: !fromAddr.trim() || saving,
						className: "rounded bg-accent px-2 py-1 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
						children: saving ? (0, import_jsx_runtime.jsx)(IconLoader2, {
							size: 10,
							className: "animate-spin"
						}) : saved ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }) : "Save"
					})]
				})]
			}) : (0, import_jsx_runtime.jsxs)(ManualSetupCard, {
				hint: "Use SendGrid for transactional email. SendGrid requires a verified from address.",
				docsUrl: "https://app.sendgrid.com/settings/api_keys",
				docsLabel: "Get a SendGrid key",
				children: [sendgridConfigured ? (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex items-center gap-1.5 text-[10px] text-green-500",
					children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "SENDGRID_API_KEY configured"]
				}) : (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-1 flex gap-1.5",
					children: [(0, import_jsx_runtime.jsx)("input", {
						type: "password",
						value: sendgridKey,
						onChange: (e) => setSendgridKey(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") saveSendgrid();
						},
						placeholder: "SG....",
						className: "flex-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent"
					}), (0, import_jsx_runtime.jsx)("button", {
						onClick: saveSendgrid,
						disabled: !sendgridKey.trim() || saving,
						className: "rounded bg-accent px-2 py-1 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
						children: saving ? (0, import_jsx_runtime.jsx)(IconLoader2, {
							size: 10,
							className: "animate-spin"
						}) : saved ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }) : "Save"
					})]
				}), fromConfigured ? (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-1.5 text-[10px] text-green-500",
					children: [(0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }), "EMAIL_FROM configured"]
				}) : (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-1.5",
					children: [(0, import_jsx_runtime.jsx)("input", {
						type: "text",
						value: fromAddr,
						onChange: (e) => setFromAddr(e.target.value),
						onKeyDown: (e) => {
							if (e.key === "Enter") saveSendgrid();
						},
						placeholder: "From address - e.g. Acme <hi@acme.com>",
						className: "flex-1 rounded border border-border bg-background px-2 py-1 text-[11px] text-foreground outline-none placeholder:text-muted-foreground/50 focus:ring-1 focus:ring-accent"
					}), !sendgridConfigured ? null : (0, import_jsx_runtime.jsx)("button", {
						onClick: saveSendgrid,
						disabled: !fromAddr.trim() || saving,
						className: "rounded bg-accent px-2 py-1 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
						children: saving ? (0, import_jsx_runtime.jsx)(IconLoader2, {
							size: 10,
							className: "animate-spin"
						}) : saved ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }) : "Save"
					})]
				})]
			})]
		})
	});
}
function AgentLimitsSectionInner({ open, onToggle }) {
	const [settings, setSettings] = (0, import_react.useState)(null);
	const [value, setValue] = (0, import_react.useState)("");
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [saved, setSaved] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const load = (0, import_react.useCallback)(() => {
		let cancelled = false;
		setLoading(true);
		fetch(agentNativePath("/_agent-native/agent-loop-settings")).then((r) => r.ok ? r.json() : null).then((data) => {
			if (cancelled || !data) return;
			setSettings(data);
			setValue(String(data.maxIterations));
		}).catch(() => {}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, []);
	(0, import_react.useEffect)(() => load(), [load]);
	(0, import_react.useEffect)(() => {
		const handler = (event) => {
			const detail = event.detail;
			if (!detail?.maxIterations) return;
			setSettings(detail);
			setValue(String(detail.maxIterations));
		};
		window.addEventListener("agent-loop-settings:changed", handler);
		return () => window.removeEventListener("agent-loop-settings:changed", handler);
	}, []);
	const numericValue = Number(value);
	const hasPendingChange = !!settings && settings.canUpdate && Number.isInteger(numericValue) && numericValue !== settings.maxIterations;
	const scopeLabel = settings?.scope === "org" ? settings.orgName ? `${settings.orgName} organization` : "organization" : "your account";
	const save = async () => {
		if (!settings?.canUpdate) return;
		setSaving(true);
		setSaved(false);
		setError(null);
		try {
			const res = await fetch(agentNativePath("/_agent-native/agent-loop-settings"), {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ maxIterations: numericValue })
			});
			const body = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body?.error ?? `Save failed (${res.status})`);
			setSettings(body);
			setValue(String(body.maxIterations));
			setSaved(true);
			window.dispatchEvent(new CustomEvent("agent-loop-settings:changed", { detail: body }));
			setTimeout(() => setSaved(false), 2e3);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Save failed");
		} finally {
			setSaving(false);
		}
	};
	const reset = async () => {
		if (!settings?.canUpdate) return;
		setSaving(true);
		setSaved(false);
		setError(null);
		try {
			const res = await fetch(agentNativePath("/_agent-native/agent-loop-settings"), { method: "DELETE" });
			const body = await res.json().catch(() => ({}));
			if (!res.ok) throw new Error(body?.error ?? `Reset failed (${res.status})`);
			setSettings(body);
			setValue(String(body.maxIterations));
			window.dispatchEvent(new CustomEvent("agent-loop-settings:changed", { detail: body }));
		} catch (err) {
			setError(err instanceof Error ? err.message : "Reset failed");
		} finally {
			setSaving(false);
		}
	};
	return (0, import_jsx_runtime.jsx)(SettingsSection, {
		icon: (0, import_jsx_runtime.jsx)(IconGauge, { size: 14 }),
		title: "Agent Limits",
		subtitle: "Control how long a single agent response can work before pausing.",
		connected: loading ? void 0 : settings ? settings.maxIterations !== settings.defaultMaxIterations : false,
		open,
		onToggle,
		children: loading ? (0, import_jsx_runtime.jsx)(SettingsSkeleton, { lines: 2 }) : settings ? (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-2",
			children: (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-border px-2.5 py-2 bg-accent/20",
				children: [
					(0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between gap-2",
						children: [(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-medium text-foreground",
							children: "Max iterations"
						}), (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-0.5 text-[10px] text-muted-foreground",
							children: [
								"Applies to ",
								scopeLabel,
								". Default is",
								" ",
								settings.defaultMaxIterations.toLocaleString(),
								"."
							]
						})] }), (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full bg-background px-2 py-0.5 text-[10px] font-medium text-muted-foreground",
							children: settings.source
						})]
					}),
					(0, import_jsx_runtime.jsxs)("div", {
						className: "mt-2 flex items-center gap-1.5",
						children: [
							(0, import_jsx_runtime.jsx)("input", {
								type: "number",
								min: settings.minMaxIterations,
								max: settings.maxMaxIterations,
								value,
								disabled: !settings.canUpdate || saving,
								onChange: (e) => {
									setValue(e.target.value);
									setError(null);
								},
								onKeyDown: (e) => {
									if (e.key === "Enter" && hasPendingChange) save();
								},
								className: "h-8 min-w-0 flex-1 rounded border border-border bg-background px-2 text-[11px] text-foreground outline-none focus:ring-1 focus:ring-accent disabled:opacity-60"
							}),
							(0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: save,
								disabled: !hasPendingChange || saving,
								className: "inline-flex h-8 items-center gap-1 rounded bg-accent px-2.5 text-[10px] font-medium text-foreground hover:bg-accent/80 disabled:opacity-40",
								children: saving ? (0, import_jsx_runtime.jsx)(IconLoader2, {
									size: 10,
									className: "animate-spin"
								}) : saved ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 10 }) : "Save"
							}),
							(0, import_jsx_runtime.jsx)("button", {
								type: "button",
								onClick: reset,
								disabled: !settings.canUpdate || saving || settings.maxIterations === settings.defaultMaxIterations,
								className: "h-8 rounded border border-border px-2.5 text-[10px] font-medium text-muted-foreground hover:bg-accent/40 hover:text-foreground disabled:opacity-40",
								children: "Reset"
							})
						]
					}),
					!settings.canUpdate && (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[10px] text-muted-foreground",
						children: "Only organization owners and admins can change this limit."
					}),
					error && (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-[10px] text-destructive",
						children: error
					})
				]
			})
		}) : (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] text-muted-foreground",
			children: "Agent limit settings are unavailable."
		})
	});
}
var SETTINGS_SECTION_IDS = new Set([
	"account",
	"llm",
	"limits",
	"voice",
	"automations",
	"secrets",
	"hosting",
	"database",
	"uploads",
	"auth",
	"email",
	"browser",
	"background",
	"integrations",
	"usage",
	"a2a"
]);
function normalizeSettingsSection(value) {
	const normalized = value?.replace(/^#/, "").toLowerCase() ?? "";
	if (!normalized) return null;
	if (normalized.startsWith("secrets")) return "secrets";
	if (normalized === "workspace" || normalized === "workspace-settings" || normalized === "organization" || normalized === "org") return "secrets";
	if (normalized === "agent-engine") return "llm";
	if (normalized === "agent-limits" || normalized === "loop-settings") return "limits";
	return SETTINGS_SECTION_IDS.has(normalized) ? normalized : null;
}
function settingsSectionDomId(section) {
	return `agent-settings-section-${section}`;
}
function initialOpenSection() {
	if (typeof window === "undefined") return "llm";
	return normalizeSettingsSection(window.location.hash) ?? "llm";
}
var environmentOptions = [{
	value: "production",
	label: "Production",
	description: "App tools only; code, shell, and files require Builder or a local clone."
}, {
	value: "development",
	label: "Development",
	description: "Full access to code editing, shell, and files."
}];
function CapabilityStatusRow({ label, value, active }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between gap-2 text-[10px]",
		children: [(0, import_jsx_runtime.jsxs)("span", {
			className: "flex items-center gap-1.5 text-muted-foreground",
			children: [(0, import_jsx_runtime.jsx)("span", {
				className: `h-1.5 w-1.5 rounded-full ${active ? "bg-green-500" : "bg-muted-foreground/30"}`,
				"aria-hidden": "true"
			}), label]
		}), (0, import_jsx_runtime.jsx)("span", {
			className: "min-w-0 truncate text-right text-foreground",
			children: value
		})]
	});
}
function CapabilityStatusStrip({ isDevMode, builderConnected, builderLoading, builderBranchesAvailable, onOpenLlm }) {
	const codeAvailable = isDevMode || builderConnected && builderBranchesAvailable;
	const codeLabel = isDevMode ? "Local tools" : builderConnected && builderBranchesAvailable ? "Builder branches" : "Desktop/local";
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-md border border-border bg-muted/20 px-2.5 py-2",
		children: [(0, import_jsx_runtime.jsx)("div", {
			className: "mb-1.5 text-[10px] font-medium text-muted-foreground",
			children: "Available now"
		}), (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-1.5",
			children: [
				(0, import_jsx_runtime.jsx)(CapabilityStatusRow, {
					label: "App",
					value: "Chat + actions",
					active: true
				}),
				(0, import_jsx_runtime.jsx)(CapabilityStatusRow, {
					label: "Code",
					value: codeLabel,
					active: codeAvailable
				}),
				(0, import_jsx_runtime.jsx)(CapabilityStatusRow, {
					label: "Builder",
					active: builderConnected,
					value: builderLoading ? "Checking..." : builderConnected ? "Connected" : (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: onOpenLlm,
						className: "rounded border border-border px-1.5 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground",
						children: "Connect"
					})
				})
			]
		})]
	});
}
function AccountSectionInner({ open, onToggle }) {
	const { session, isLoading } = useSession();
	const email = session?.email;
	const avatarUrl = useAvatarUrl(email);
	const fileInputRef = (0, import_react.useRef)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [status, setStatus] = (0, import_react.useState)("idle");
	const displayName = session?.name || email || "Signed out";
	const initials = (session?.name || email || "?").split(/[ @._-]+/).filter(Boolean).slice(0, 2).map((part) => part[0]?.toUpperCase()).join("");
	const handleAvatarChange = async (event) => {
		const file = event.target.files?.[0];
		event.target.value = "";
		if (!file || !email) return;
		setUploading(true);
		setStatus("idle");
		try {
			await uploadAvatar(file, email);
			setStatus("saved");
		} catch {
			setStatus("error");
		} finally {
			setUploading(false);
		}
	};
	return (0, import_jsx_runtime.jsx)(SettingsSection, {
		icon: (0, import_jsx_runtime.jsx)(IconUserCircle, { size: 14 }),
		title: "Account",
		subtitle: "Your profile photo and signed-in identity.",
		open,
		onToggle,
		children: (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [
				(0, import_jsx_runtime.jsx)("div", {
					className: "flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-border bg-accent text-[13px] font-semibold text-muted-foreground",
					children: avatarUrl ? (0, import_jsx_runtime.jsx)("img", {
						src: avatarUrl,
						alt: "",
						className: "h-full w-full object-cover"
					}) : initials
				}),
				(0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0 flex-1",
					children: [
						(0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[12px] font-medium text-foreground",
							children: isLoading ? "Loading..." : displayName
						}),
						email && (0, import_jsx_runtime.jsx)("p", {
							className: "truncate text-[11px] text-muted-foreground",
							children: email
						}),
						status === "saved" && (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-green-600 dark:text-green-400",
							children: "Photo updated"
						}),
						status === "error" && (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-[11px] text-destructive",
							children: "Could not update photo"
						})
					]
				}),
				(0, import_jsx_runtime.jsx)("input", {
					ref: fileInputRef,
					type: "file",
					accept: "image/*",
					className: "hidden",
					onChange: handleAvatarChange
				}),
				(0, import_jsx_runtime.jsx)("button", {
					type: "button",
					disabled: !email || uploading,
					onClick: () => fileInputRef.current?.click(),
					className: "inline-flex h-8 shrink-0 items-center justify-center rounded-md border border-border bg-background px-3 text-[12px] font-medium text-foreground transition-colors hover:bg-accent/50 disabled:cursor-not-allowed disabled:opacity-50",
					children: uploading ? "Uploading..." : "Change photo"
				})
			]
		})
	});
}
function SettingsPanel({ isDevMode, onToggleDevMode, showDevToggle, devAppUrl, initialSection, sectionRequestKey }) {
	const { status: builder, loading: builderLoading } = useBuilderStatus();
	const connected = builder?.configured ?? false;
	const connectUrl = builder?.connectUrl;
	const orgName = builder?.orgName;
	const envManaged = !!builder?.envManaged;
	const credentialSource = builder?.credentialSource;
	const builderBranchesAvailable = !!builder?.builderEnabled;
	const builderFlow = useBuilderConnectFlow({ popupUrl: connectUrl });
	const [focusSecretKey, setFocusSecretKey] = (0, import_react.useState)(void 0);
	const [openSection, setOpenSection] = (0, import_react.useState)(initialOpenSection);
	const toggle = (id) => setOpenSection((prev) => prev === id ? null : id);
	const scrollSectionIntoView = (0, import_react.useCallback)((section) => {
		window.requestAnimationFrame(() => {
			document.getElementById(settingsSectionDomId(section))?.scrollIntoView({
				block: "start",
				behavior: "smooth"
			});
		});
	}, []);
	const openSettingsSection = (0, import_react.useCallback)((section, scroll = false) => {
		setOpenSection(section);
		if (scroll) scrollSectionIntoView(section);
	}, [scrollSectionIntoView]);
	(0, import_react.useEffect)(() => {
		const section = normalizeSettingsSection(initialSection);
		if (!section) return;
		if (section !== "secrets") setFocusSecretKey(void 0);
		openSettingsSection(section, true);
	}, [
		initialSection,
		sectionRequestKey,
		openSettingsSection
	]);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const handleHash = () => {
			const hash = window.location.hash?.replace(/^#/, "") ?? "";
			const section = normalizeSettingsSection(hash);
			if (!section) return;
			if (hash.startsWith("secrets:") || hash === "secrets") setFocusSecretKey(hash.slice(8) || void 0);
			else setFocusSecretKey(void 0);
			openSettingsSection(section, true);
		};
		handleHash();
		window.addEventListener("hashchange", handleHash);
		return () => window.removeEventListener("hashchange", handleHash);
	}, [openSettingsSection]);
	return (0, import_jsx_runtime.jsxs)("div", {
		className: "flex-1 min-h-0 overflow-y-auto p-3 space-y-2",
		style: { overflowY: "auto" },
		children: [
			(showDevToggle || devAppUrl) && (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 pb-2 border-b border-border mb-2",
				children: showDevToggle && (0, import_jsx_runtime.jsx)(SettingsSelect, {
					label: "Environment",
					labelAdornment: devAppUrl ? (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
						asChild: true,
						children: (0, import_jsx_runtime.jsx)("a", {
							href: devAppUrl,
							target: "_blank",
							rel: "noopener noreferrer",
							"aria-label": "Open app in new tab",
							className: "flex items-center text-muted-foreground hover:text-foreground",
							children: (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 14 })
						})
					}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Open app in new tab" })] }) : void 0,
					value: isDevMode ? "development" : "production",
					options: environmentOptions,
					onValueChange: (next) => {
						if (next === "development" !== isDevMode) onToggleDevMode();
					}
				})
			}),
			(0, import_jsx_runtime.jsx)(CapabilityStatusStrip, {
				isDevMode,
				builderConnected: connected,
				builderLoading,
				builderBranchesAvailable,
				onOpenLlm: () => openSettingsSection("llm", true)
			}),
			(0, import_jsx_runtime.jsx)(AccountSectionInner, {
				open: openSection === "account",
				onToggle: () => toggle("account")
			}),
			(0, import_jsx_runtime.jsx)(LLMSectionInner, {
				builderFlow,
				builderLoading,
				connectUrl,
				connected,
				orgName,
				envManaged,
				credentialSource,
				open: openSection === "llm",
				onToggle: () => toggle("llm")
			}),
			(0, import_jsx_runtime.jsx)(AgentLimitsSectionInner, {
				open: openSection === "limits",
				onToggle: () => toggle("limits")
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconMicrophone, { size: 14 }),
				title: "Voice Transcription",
				subtitle: "How the composer microphone turns your voice into text.",
				open: openSection === "voice",
				onToggle: () => toggle("voice"),
				children: (0, import_jsx_runtime.jsx)(VoiceTranscriptionSection, {})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconBolt, { size: 14 }),
				title: "Automations",
				subtitle: "Event-triggered and scheduled automations.",
				open: openSection === "automations",
				onToggle: () => toggle("automations"),
				children: (0, import_jsx_runtime.jsx)(AutomationsSection, {})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				id: settingsSectionDomId("secrets"),
				icon: (0, import_jsx_runtime.jsx)(IconKey, { size: 14 }),
				title: "API Keys & Connections",
				subtitle: "Service credentials and automation keys.",
				open: openSection === "secrets",
				onToggle: () => toggle("secrets"),
				children: (0, import_jsx_runtime.jsx)(SecretsSection, { focusKey: focusSecretKey })
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconCloud, { size: 14 }),
				title: "Hosting",
				subtitle: "Deploy your app to the cloud.",
				connected,
				open: openSection === "hosting",
				onToggle: () => toggle("hosting"),
				children: (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [(0, import_jsx_runtime.jsx)(UseBuilderCard, {
						builderFlow,
						connectUrl,
						connected,
						orgName,
						envManaged,
						credentialSource
					}), (0, import_jsx_runtime.jsx)(ManualSetupCard, {
						hint: "Deploy manually to Netlify, Vercel, Cloudflare, or any Nitro-supported target.",
						docsUrl: "https://www.builder.io/c/docs/agent-native-deployment",
						dim: connected
					})]
				})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconDatabase, { size: 14 }),
				title: "Database",
				subtitle: "Connect a cloud database for persistent storage.",
				connected,
				open: openSection === "database",
				onToggle: () => toggle("database"),
				children: (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [(0, import_jsx_runtime.jsx)(UseBuilderCard, {
						builderFlow,
						connectUrl,
						connected,
						orgName,
						envManaged,
						credentialSource
					}), (0, import_jsx_runtime.jsx)(ManualSetupCard, {
						hint: "Set DATABASE_URL in your .env to connect Neon, Supabase, Turso, or any Postgres/SQLite database.",
						docsUrl: "https://www.builder.io/c/docs/agent-native-database",
						dim: connected
					})]
				})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconUpload, { size: 14 }),
				title: "File uploads",
				subtitle: "Where user-uploaded files (avatars, chat attachments) are stored.",
				connected,
				open: openSection === "uploads",
				onToggle: () => toggle("uploads"),
				children: (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [(0, import_jsx_runtime.jsx)(UseBuilderCard, {
						builderFlow,
						connectUrl,
						connected,
						orgName,
						envManaged,
						credentialSource
					}), (0, import_jsx_runtime.jsx)(ManualSetupCard, {
						hint: "Without a provider, files are stored as base64 in your database. Fine for dev, not recommended for production.",
						docsUrl: "https://www.builder.io/c/docs/agent-native-file-uploads",
						dim: connected
					})]
				})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconShield, { size: 14 }),
				title: "Authentication",
				subtitle: "Set up user authentication and access control.",
				connected,
				open: openSection === "auth",
				onToggle: () => toggle("auth"),
				children: (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-2",
					children: [(0, import_jsx_runtime.jsx)(UseBuilderCard, {
						builderFlow,
						connectUrl,
						connected,
						orgName,
						envManaged,
						credentialSource
					}), (0, import_jsx_runtime.jsx)(ManualSetupCard, {
						hint: "Configure Better Auth with BETTER_AUTH_SECRET and optional Google/GitHub OAuth providers.",
						docsUrl: "https://www.builder.io/c/docs/agent-native-authentication",
						dim: connected
					})]
				})
			}),
			(0, import_jsx_runtime.jsx)(EmailSectionInner, {
				open: openSection === "email",
				onToggle: () => toggle("email")
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconBrowser, { size: 14 }),
				title: "Browser Automation",
				subtitle: "Let agents control a real browser for web tasks.",
				connected,
				open: openSection === "browser",
				onToggle: () => toggle("browser"),
				children: (0, import_jsx_runtime.jsx)(UseBuilderCard, {
					builderFlow,
					connectUrl,
					connected,
					orgName,
					envManaged,
					credentialSource
				})
			}),
			builderBranchesAvailable && (0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconGitBranch, { size: 14 }),
				title: "Background Agent",
				subtitle: "Make code changes from production mode via Builder.",
				connected,
				open: openSection === "background",
				onToggle: () => toggle("background"),
				children: (0, import_jsx_runtime.jsx)(UseBuilderCard, {
					builderFlow,
					connectUrl,
					connected,
					orgName,
					envManaged,
					credentialSource
				})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconPlugConnected, { size: 14 }),
				title: "Integrations",
				subtitle: "Connect messaging platforms and external services.",
				open: openSection === "integrations",
				onToggle: () => toggle("integrations"),
				children: (0, import_jsx_runtime.jsx)(import_react.Suspense, {
					fallback: null,
					children: (0, import_jsx_runtime.jsx)(IntegrationsPanel, {})
				})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconCoin, { size: 14 }),
				title: "Usage",
				subtitle: "Track token consumption and estimated cost — broken down by chat, automations, and background jobs.",
				open: openSection === "usage",
				onToggle: () => toggle("usage"),
				children: (0, import_jsx_runtime.jsx)(UsageSection, {})
			}),
			(0, import_jsx_runtime.jsx)(SettingsSection, {
				icon: (0, import_jsx_runtime.jsx)(IconTopologyRing2, { size: 14 }),
				title: "Connected Agents (A2A)",
				subtitle: "Manage remote agents connected via the A2A protocol.",
				open: openSection === "a2a",
				onToggle: () => toggle("a2a"),
				children: (0, import_jsx_runtime.jsx)(AgentsSection, {})
			})
		]
	});
}
//#endregion
export { IconCoin as A, captureError as C, IconPlayerPlay as D, IconRefresh as E, IconGauge as O, useSession as S, trackEvent as T, Value as _, Group as a, useDirection as b, ItemIndicator as c, Portal as d, Root2 as f, Trigger as g, Separator as h, Content2 as i, IconAlertCircle as j, IconDatabase as k, ItemText as l, ScrollUpButton as m, SecretsSection as n, Icon as o, ScrollDownButton as p, BuilderBMark as r, Item as s, SettingsPanel as t, Label as u, Viewport as v, configureTracking as w, createCollection as x, usePrevious as y };
