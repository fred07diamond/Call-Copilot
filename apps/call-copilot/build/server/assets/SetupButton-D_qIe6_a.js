import { a as require_jsx_runtime } from "./api-path-duCTki3J.js";
import { i as TooltipTrigger, n as TooltipContent, t as Tooltip } from "./tooltip-C8DYthhz.js";
import { t as useDevMode } from "./use-dev-mode-DnXmth2t.js";
import { n as IconChecklist, t as useOnboarding } from "./use-onboarding-DM0LKcxY.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/client/onboarding/SetupButton.js
var import_jsx_runtime = require_jsx_runtime();
var DEV_ONLY_STEP_IDS = new Set(["database", "auth"]);
function SetupButton({ className }) {
	const { dismissed, loading, steps, reopen } = useOnboarding();
	const { isDevMode } = useDevMode();
	const visibleSteps = isDevMode ? steps : steps.filter((s) => !DEV_ONLY_STEP_IDS.has(s.id));
	const totalCount = visibleSteps.length;
	const allComplete = visibleSteps.filter((s) => s.required).every((s) => s.complete);
	if (loading || totalCount === 0) return null;
	if (!dismissed) return null;
	if (allComplete) return null;
	return (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
		asChild: true,
		children: (0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			onClick: reopen,
			"aria-label": "Re-open setup",
			className,
			style: {
				display: "inline-flex",
				alignItems: "center",
				gap: 4,
				padding: "2px 8px",
				borderRadius: 5,
				border: "1px solid rgba(96,165,250,0.3)",
				background: "rgba(59,130,246,0.08)",
				color: "#60a5fa",
				fontSize: 11,
				fontWeight: 500,
				cursor: "pointer"
			},
			children: [(0, import_jsx_runtime.jsx)(IconChecklist, { size: 12 }), "Setup"]
		})
	}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Re-open setup" })] });
}
//#endregion
export { SetupButton };
