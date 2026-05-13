import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { a as require_react, t as agentNativePath } from "./api-path-Cj855NR1.js";
import { R as createReactComponent } from "./tooltip-DemUFzHW.js";
var IconChecklist = createReactComponent("outline", "checklist", "Checklist", [
	["path", {
		"d": "M9.615 20h-2.615a2 2 0 0 1 -2 -2v-12a2 2 0 0 1 2 -2h8a2 2 0 0 1 2 2v8",
		"key": "svg-0"
	}],
	["path", {
		"d": "M14 19l2 2l4 -4",
		"key": "svg-1"
	}],
	["path", {
		"d": "M9 8h4",
		"key": "svg-2"
	}],
	["path", {
		"d": "M9 12h2",
		"key": "svg-3"
	}]
]);
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/onboarding/use-onboarding.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useOnboarding(options = {}) {
	const preview = options.preview === true;
	const [steps, setSteps] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [dismissed, setDismissed] = (0, import_react.useState)(false);
	const mountedRef = (0, import_react.useRef)(true);
	const fetchAll = (0, import_react.useCallback)(async () => {
		try {
			const stepsUrl = agentNativePath(preview ? "/_agent-native/onboarding/steps?preview=1" : "/_agent-native/onboarding/steps");
			const [stepsRes, dismissRes] = await Promise.all([fetch(stepsUrl), fetch(agentNativePath("/_agent-native/onboarding/dismissed"))]);
			if (!mountedRef.current) return;
			if (!stepsRes.ok) throw new Error(`steps: ${stepsRes.status}`);
			setSteps(await stepsRes.json());
			if (dismissRes.ok) setDismissed(!!(await dismissRes.json()).dismissed);
			setError(null);
		} catch (e) {
			if (!mountedRef.current) return;
			setError(e instanceof Error ? e.message : "Failed to load onboarding");
		} finally {
			if (mountedRef.current) setLoading(false);
		}
	}, [preview]);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		fetchAll();
		const onVisibility = () => {
			if (document.visibilityState === "visible") fetchAll();
		};
		const onFocus = () => fetchAll();
		document.addEventListener("visibilitychange", onVisibility);
		window.addEventListener("focus", onFocus);
		return () => {
			mountedRef.current = false;
			document.removeEventListener("visibilitychange", onVisibility);
			window.removeEventListener("focus", onFocus);
		};
	}, [fetchAll]);
	const complete = (0, import_react.useCallback)(async (id) => {
		await fetch(agentNativePath(`/_agent-native/onboarding/steps/${encodeURIComponent(id)}/complete`), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}"
		});
		await fetchAll();
	}, [fetchAll]);
	const dismiss = (0, import_react.useCallback)(async () => {
		setDismissed(true);
		await fetch(agentNativePath("/_agent-native/onboarding/dismiss"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}"
		});
		await fetchAll();
	}, [fetchAll]);
	const reopen = (0, import_react.useCallback)(async () => {
		setDismissed(false);
		await fetch(agentNativePath("/_agent-native/onboarding/reopen"), {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: "{}"
		});
		await fetchAll();
	}, [fetchAll]);
	const totalCount = steps.length;
	const completeCount = steps.filter((s) => s.complete).length;
	const allComplete = steps.filter((s) => s.required).every((s) => s.complete);
	return {
		steps,
		loading,
		error,
		currentStepId: steps.find((s) => s.required && !s.complete)?.id ?? steps.find((s) => !s.complete)?.id ?? null,
		completeCount,
		totalCount,
		allComplete,
		dismissed,
		refresh: fetchAll,
		complete,
		dismiss,
		reopen
	};
}
//#endregion
export { IconChecklist as n, useOnboarding as t };
