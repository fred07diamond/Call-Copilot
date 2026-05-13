import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { a as require_jsx_runtime, o as require_react, t as agentNativePath } from "./api-path-duCTki3J.js";
import { i as TooltipTrigger, n as TooltipContent, t as Tooltip } from "./tooltip-C8DYthhz.js";
import { a as IconChevronDown, i as IconChevronRight, o as sendToAgentChat, r as IconLoader2, t as useBuilderConnectFlow } from "./useBuilderStatus--MvPXeNS.js";
import { t as useDevMode } from "./use-dev-mode-DnXmth2t.js";
import { n as IconCheck, t as IconExternalLink } from "./IconExternalLink-_sQ4sHvq.js";
import { n as IconChecklist, t as useOnboarding } from "./use-onboarding-DM0LKcxY.js";
import { t as IconChevronUp } from "./IconChevronUp-DjPFK_HS.js";
import { t as IconKey } from "./IconKey-DG-Ua36m.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/client/onboarding/use-preview-mode.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function readPreview() {
	if (typeof window === "undefined") return false;
	try {
		return JSON.parse(window.localStorage.getItem("agent-native-dev-overlay-option-framework-onboarding-show-as-new-user") || "false") === true;
	} catch {
		return false;
	}
}
function useOnboardingPreviewMode() {
	const [val, setVal] = (0, import_react.useState)(readPreview);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		const onChange = () => setVal(readPreview());
		window.addEventListener("storage", onChange);
		window.addEventListener("agent-native-dev-overlay:changed", onChange);
		return () => {
			window.removeEventListener("storage", onChange);
			window.removeEventListener("agent-native-dev-overlay:changed", onChange);
		};
	}, []);
	return val;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/client/onboarding/OnboardingPanel.js
/**
* <OnboardingPanel /> — the setup checklist that sits above the agent chat.
*
* The active step is expanded; completed steps collapse with a green check;
* remaining steps sit dimmed below. Each method renders differently based on
* its `kind` (link / form / builder-cli-auth / agent-task).
*/
function OnboardingPanel({ className, title = "Setup" }) {
	const previewMode = useOnboardingPreviewMode();
	const onboarding = useOnboarding({ preview: previewMode });
	const { isDevMode } = useDevMode();
	const { steps: rawSteps, currentStepId: rawCurrentStepId, dismissed, loading, refresh, complete, dismiss } = onboarding;
	const DEV_ONLY_STEP_IDS = new Set(["database", "auth"]);
	const steps = isDevMode ? rawSteps : rawSteps.filter((s) => !DEV_ONLY_STEP_IDS.has(s.id));
	const totalCount = steps.length;
	const completeCount = steps.filter((s) => s.complete).length;
	const allComplete = steps.filter((s) => s.required).every((s) => s.complete);
	const currentStepId = steps.some((s) => s.id === rawCurrentStepId) ? rawCurrentStepId : steps.find((s) => s.required && !s.complete)?.id ?? steps.find((s) => !s.complete)?.id ?? null;
	const [expanded, setExpanded] = (0, import_react.useState)(true);
	if (loading || totalCount === 0) return null;
	if (!previewMode) {
		if (dismissed) return null;
		if (allComplete) return null;
	}
	if (!expanded) return (0, import_jsx_runtime.jsx)("div", {
		className,
		style: styles.compactBanner,
		children: (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
			asChild: true,
			children: (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				onClick: () => setExpanded(true),
				style: styles.compactBannerBtn,
				"aria-label": "Expand setup",
				children: [
					(0, import_jsx_runtime.jsx)("span", {
						style: allComplete ? styles.checkDone : styles.checkTodo,
						children: allComplete ? (0, import_jsx_runtime.jsx)(IconCheck, {
							size: 12,
							strokeWidth: 3
						}) : null
					}),
					(0, import_jsx_runtime.jsx)("span", {
						style: styles.headerTitle,
						children: title
					}),
					(0, import_jsx_runtime.jsxs)("span", {
						style: styles.headerCounter,
						children: [
							completeCount,
							" of ",
							totalCount
						]
					}),
					(0, import_jsx_runtime.jsx)("span", {
						style: {
							marginLeft: "auto",
							opacity: .5,
							display: "flex"
						},
						children: (0, import_jsx_runtime.jsx)(IconChevronDown, { size: 14 })
					})
				]
			})
		}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Expand setup" })] })
	});
	return (0, import_jsx_runtime.jsxs)("div", {
		className,
		style: styles.root,
		children: [
			(0, import_jsx_runtime.jsxs)("div", {
				style: styles.header,
				children: [(0, import_jsx_runtime.jsxs)("div", {
					style: styles.headerLeft,
					children: [
						allComplete ? (0, import_jsx_runtime.jsx)("span", {
							style: styles.checkDone,
							children: (0, import_jsx_runtime.jsx)(IconCheck, {
								size: 12,
								strokeWidth: 3
							})
						}) : (0, import_jsx_runtime.jsx)(IconChecklist, {
							size: 14,
							style: styles.headerIcon,
							"aria-hidden": true
						}),
						(0, import_jsx_runtime.jsx)("span", {
							style: styles.headerTitle,
							children: title
						}),
						(0, import_jsx_runtime.jsxs)("span", {
							style: styles.headerCounter,
							children: [
								completeCount,
								" of ",
								totalCount
							]
						})
					]
				}), (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setExpanded(false),
						"aria-label": "Collapse onboarding",
						style: styles.dismissBtn,
						children: (0, import_jsx_runtime.jsx)(IconChevronUp, { size: 14 })
					})
				}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Collapse" })] })]
			}),
			(0, import_jsx_runtime.jsx)("div", {
				style: styles.list,
				children: steps.map((step) => (0, import_jsx_runtime.jsx)(StepCard, {
					step,
					expanded: step.id === currentStepId,
					onMarkComplete: () => complete(step.id),
					onRefresh: refresh
				}, step.id))
			}),
			(0, import_jsx_runtime.jsx)("div", {
				style: styles.footer,
				children: (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: dismiss,
					style: styles.hideLink,
					children: "Hide setup"
				})
			})
		]
	});
}
function StepCard({ step, expanded: expandedProp, onMarkComplete, onRefresh }) {
	const [expanded, setExpanded] = (0, import_react.useState)(expandedProp);
	(0, import_react.useEffect)(() => setExpanded(expandedProp), [expandedProp]);
	const isDone = step.complete;
	const sortedMethods = [...step.methods].sort((a, b) => {
		if (!!a.primary === !!b.primary) return 0;
		return a.primary ? -1 : 1;
	});
	const handleCompleted = async () => {
		await onRefresh();
	};
	return (0, import_jsx_runtime.jsxs)("div", {
		style: {
			...styles.card,
			...isDone ? styles.cardDone : null
		},
		children: [(0, import_jsx_runtime.jsxs)("button", {
			type: "button",
			style: styles.cardHeader,
			onClick: () => setExpanded((e) => !e),
			"aria-expanded": expanded,
			children: [(0, import_jsx_runtime.jsxs)("span", {
				style: styles.cardHeaderLeft,
				children: [(0, import_jsx_runtime.jsx)("span", {
					style: isDone ? styles.checkDone : styles.checkTodo,
					children: isDone ? (0, import_jsx_runtime.jsx)(IconCheck, {
						size: 12,
						strokeWidth: 3
					}) : null
				}), (0, import_jsx_runtime.jsxs)("span", {
					style: styles.cardTitle,
					children: [step.title, step.required && !isDone && (0, import_jsx_runtime.jsx)("span", {
						style: styles.requiredPill,
						children: "required"
					})]
				})]
			}), (0, import_jsx_runtime.jsx)("span", {
				style: styles.chevron,
				children: expanded ? (0, import_jsx_runtime.jsx)(IconChevronDown, { size: 14 }) : (0, import_jsx_runtime.jsx)(IconChevronRight, { size: 14 })
			})]
		}), expanded && (0, import_jsx_runtime.jsxs)("div", {
			style: styles.cardBody,
			children: [(0, import_jsx_runtime.jsx)("p", {
				style: styles.cardDesc,
				children: step.description
			}), (0, import_jsx_runtime.jsx)(StepMethods, {
				step,
				methods: sortedMethods,
				onCompleted: handleCompleted,
				onMarkManualComplete: onMarkComplete
			})]
		})]
	});
}
function isFormMethod(method) {
	return method.kind === "form";
}
function StepMethods({ step, methods, onCompleted, onMarkManualComplete }) {
	const formMethods = methods.filter(isFormMethod);
	if (step.id === "llm" || step.id === "image-generation") return (0, import_jsx_runtime.jsx)(ManagedProviderMethodGroup, {
		methods,
		formMethods,
		stepId: step.id,
		secondaryLabel: step.id === "image-generation" ? "Add a Gemini API key" : "Add your own provider key",
		onCompleted,
		onMarkManualComplete
	});
	if (methods.length > 1 && formMethods.length === methods.length) {
		const pickerLabel = step.id === "auth" ? "Sign-in path" : "Provider";
		return (0, import_jsx_runtime.jsx)("div", {
			style: styles.methods,
			children: (0, import_jsx_runtime.jsx)(FormMethodPicker, {
				methods: formMethods,
				label: pickerLabel,
				onCompleted
			})
		});
	}
	return (0, import_jsx_runtime.jsx)("div", {
		style: styles.methods,
		children: methods.map((method) => (0, import_jsx_runtime.jsx)(MethodBlock, {
			method,
			stepId: step.id,
			onCompleted,
			onMarkManualComplete
		}, method.id))
	});
}
function ManagedProviderMethodGroup({ methods, formMethods, stepId, secondaryLabel, onCompleted, onMarkManualComplete }) {
	const [showKeyForm, setShowKeyForm] = (0, import_react.useState)(false);
	const primaryMethod = methods.find((method) => method.kind === "builder-cli-auth") ?? methods.find((method) => method.primary);
	const otherMethods = methods.filter((method) => method !== primaryMethod && !isFormMethod(method));
	return (0, import_jsx_runtime.jsxs)("div", {
		style: styles.methods,
		children: [
			primaryMethod && (0, import_jsx_runtime.jsx)(MethodBlock, {
				method: primaryMethod,
				stepId,
				onCompleted,
				onMarkManualComplete
			}),
			formMethods.length > 0 && (0, import_jsx_runtime.jsxs)("div", {
				style: styles.secondaryPanel,
				children: [(0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setShowKeyForm((value) => !value),
					style: styles.secondaryToggle,
					"aria-expanded": showKeyForm,
					children: [(0, import_jsx_runtime.jsxs)("span", {
						style: styles.secondaryToggleLeft,
						children: [(0, import_jsx_runtime.jsx)(IconKey, {
							size: 13,
							"aria-hidden": true
						}), (0, import_jsx_runtime.jsx)("span", { children: secondaryLabel })]
					}), (0, import_jsx_runtime.jsx)("span", {
						style: styles.chevron,
						children: showKeyForm ? (0, import_jsx_runtime.jsx)(IconChevronDown, { size: 14 }) : (0, import_jsx_runtime.jsx)(IconChevronRight, { size: 14 })
					})]
				}), showKeyForm && (0, import_jsx_runtime.jsx)(FormMethodPicker, {
					methods: formMethods,
					label: "Provider",
					onCompleted,
					embedded: true
				})]
			}),
			otherMethods.map((method) => (0, import_jsx_runtime.jsx)(MethodBlock, {
				method,
				stepId,
				onCompleted,
				onMarkManualComplete
			}, method.id))
		]
	});
}
function FormMethodPicker({ methods, label, onCompleted, embedded }) {
	const [selectedId, setSelectedId] = (0, import_react.useState)(methods[0]?.id ?? "");
	(0, import_react.useEffect)(() => {
		if (!methods.some((method) => method.id === selectedId)) setSelectedId(methods[0]?.id ?? "");
	}, [methods, selectedId]);
	const selectedMethod = methods.find((method) => method.id === selectedId) ?? methods[0];
	if (!selectedMethod) return null;
	return (0, import_jsx_runtime.jsxs)("div", {
		style: embedded ? styles.methodPickerEmbedded : styles.method,
		children: [
			(0, import_jsx_runtime.jsxs)("label", {
				style: styles.pickerLabel,
				children: [(0, import_jsx_runtime.jsx)("span", {
					style: styles.formLabelText,
					children: label
				}), (0, import_jsx_runtime.jsx)("select", {
					value: selectedMethod.id,
					onChange: (event) => setSelectedId(event.target.value),
					style: styles.select,
					children: methods.map((method) => (0, import_jsx_runtime.jsx)("option", {
						value: method.id,
						children: method.label
					}, method.id))
				})]
			}),
			selectedMethod.description && (0, import_jsx_runtime.jsx)("p", {
				style: styles.methodDesc,
				children: selectedMethod.description
			}),
			(0, import_jsx_runtime.jsx)(FormMethod, {
				method: selectedMethod,
				onCompleted
			}, selectedMethod.id)
		]
	});
}
function MethodBlock({ method, stepId, onCompleted, onMarkManualComplete }) {
	return (0, import_jsx_runtime.jsxs)("div", {
		style: method.primary ? styles.methodPrimary : styles.method,
		children: [
			(0, import_jsx_runtime.jsx)("div", {
				style: styles.methodHeader,
				children: (0, import_jsx_runtime.jsxs)("span", {
					style: styles.methodLabel,
					children: [method.label, method.badge && (0, import_jsx_runtime.jsx)("span", {
						style: badgeStyle(method.badge),
						children: method.badge
					})]
				})
			}),
			method.description && (0, import_jsx_runtime.jsx)("p", {
				style: styles.methodDesc,
				children: method.description
			}),
			(0, import_jsx_runtime.jsx)(MethodBody, {
				method,
				stepId,
				onCompleted,
				onMarkManualComplete
			})
		]
	});
}
function MethodBody({ method, stepId, onCompleted, onMarkManualComplete }) {
	if (method.disabled) return (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		disabled: true,
		style: buttonDisabled(method.primary),
		"aria-disabled": "true",
		children: method.disabledLabel ?? "Coming soon"
	});
	switch (method.kind) {
		case "link": return (0, import_jsx_runtime.jsx)(LinkMethod, {
			method,
			onMarkComplete: onMarkManualComplete
		});
		case "form": return (0, import_jsx_runtime.jsx)(FormMethod, {
			method,
			onCompleted
		});
		case "builder-cli-auth": return (0, import_jsx_runtime.jsx)(BuilderCliAuthMethod, {
			onCompleted,
			primary: method.primary
		});
		case "agent-task": return (0, import_jsx_runtime.jsx)(AgentTaskMethod, {
			method,
			stepId
		});
	}
}
function LinkMethod({ method, onMarkComplete }) {
	const { url, external } = method.payload;
	if (!url || url === "#") return (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		style: buttonPrimary(method.primary),
		onClick: onMarkComplete,
		children: "Use this option"
	});
	return (0, import_jsx_runtime.jsxs)("a", {
		href: url,
		target: external ? "_blank" : void 0,
		rel: external ? "noopener noreferrer" : void 0,
		style: {
			...buttonPrimary(method.primary),
			textDecoration: "none"
		},
		children: ["Continue", external && (0, import_jsx_runtime.jsx)(IconExternalLink, {
			size: 12,
			style: { marginLeft: 4 }
		})]
	});
}
function FormMethod({ method, onCompleted }) {
	const { fields, writeScope } = method.payload;
	const [values, setValues] = (0, import_react.useState)({});
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [err, setErr] = (0, import_react.useState)(null);
	const handleSubmit = async (e) => {
		e.preventDefault();
		setSaving(true);
		setErr(null);
		try {
			const vars = fields.map((f) => ({
				key: f.key,
				value: (values[f.key] ?? "").trim()
			})).filter((v) => v.value !== "");
			if (vars.length === 0) {
				setErr("Enter a value first.");
				return;
			}
			const res = await fetch(agentNativePath("/_agent-native/env-vars"), {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					vars,
					scope: writeScope ?? "workspace"
				})
			});
			if (!res.ok) {
				const data = await res.json().catch(() => ({}));
				throw new Error(data.error ?? `Save failed: ${res.status}`);
			}
			setValues({});
			await onCompleted();
		} catch (e) {
			setErr(e instanceof Error ? e.message : "Save failed");
		} finally {
			setSaving(false);
		}
	};
	return (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: handleSubmit,
		style: styles.form,
		children: [
			fields.map((f) => (0, import_jsx_runtime.jsxs)("label", {
				style: styles.formLabel,
				children: [(0, import_jsx_runtime.jsx)("span", {
					style: styles.formLabelText,
					children: f.label
				}), (0, import_jsx_runtime.jsx)("input", {
					type: f.secret ? "password" : "text",
					value: values[f.key] ?? "",
					placeholder: f.placeholder,
					onChange: (e) => setValues((v) => ({
						...v,
						[f.key]: e.target.value
					})),
					style: styles.input,
					autoComplete: "off",
					spellCheck: false
				})]
			}, f.key)),
			err && (0, import_jsx_runtime.jsx)("p", {
				style: styles.errText,
				children: err
			}),
			(0, import_jsx_runtime.jsx)("button", {
				type: "submit",
				disabled: saving,
				style: {
					...buttonPrimary(method.primary),
					opacity: saving ? .6 : 1
				},
				children: saving ? "Saving..." : "Save"
			})
		]
	});
}
function BuilderCliAuthMethod({ onCompleted, primary }) {
	const { connecting, error, start } = useBuilderConnectFlow({ onConnected: onCompleted });
	return (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		(0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: start,
			disabled: connecting,
			style: {
				...buttonPrimary(primary),
				opacity: connecting ? .7 : 1
			},
			children: connecting ? (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [(0, import_jsx_runtime.jsx)(IconLoader2, {
				size: 12,
				style: { marginRight: 4 },
				className: "animate-spin"
			}), "Waiting for Builder..."] }) : "Connect Builder"
		}),
		connecting && (0, import_jsx_runtime.jsx)("p", {
			style: styles.methodHint,
			children: "A Builder tab opened. Choose your team or app space there; setup will continue here automatically."
		}),
		error && (0, import_jsx_runtime.jsx)("p", {
			style: styles.errText,
			children: error
		})
	] });
}
function AgentTaskMethod({ method, stepId: _stepId }) {
	const handleClick = () => {
		sendToAgentChat({
			message: method.payload.prompt,
			submit: true
		});
	};
	return (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick: handleClick,
		style: buttonPrimary(method.primary),
		children: "Ask the agent"
	});
}
function buttonPrimary(primary) {
	return {
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		padding: "6px 12px",
		borderRadius: 6,
		border: primary ? "1px solid transparent" : "1px solid rgba(255,255,255,0.15)",
		background: primary ? "#3b82f6" : "rgba(255,255,255,0.04)",
		color: primary ? "#fff" : "inherit",
		fontSize: 12,
		fontWeight: 500,
		cursor: "pointer"
	};
}
function buttonDisabled(primary) {
	return {
		...buttonPrimary(primary),
		border: "1px solid rgba(255,255,255,0.12)",
		background: primary ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.04)",
		color: "rgba(255,255,255,0.5)",
		cursor: "not-allowed"
	};
}
function badgeStyle(kind) {
	const palette = {
		recommended: {
			bg: "rgba(59,130,246,0.15)",
			fg: "#60a5fa"
		},
		beta: {
			bg: "rgba(6,182,212,0.15)",
			fg: "#22d3ee"
		},
		free: {
			bg: "rgba(34,197,94,0.15)",
			fg: "#4ade80"
		},
		soon: {
			bg: "rgba(148,163,184,0.15)",
			fg: "#cbd5e1"
		}
	}[kind];
	return {
		marginLeft: 6,
		fontSize: 10,
		padding: "1px 6px",
		borderRadius: 4,
		background: palette.bg,
		color: palette.fg,
		fontWeight: 500,
		textTransform: "uppercase",
		letterSpacing: .3
	};
}
var styles = {
	root: {
		borderBottom: "1px solid rgba(255,255,255,0.06)",
		background: "rgba(255,255,255,0.02)",
		fontSize: 12,
		display: "flex",
		flexDirection: "column",
		maxHeight: "60vh",
		minHeight: 0
	},
	compactBanner: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		borderBottom: "1px solid rgba(255,255,255,0.06)",
		background: "rgba(34,197,94,0.04)",
		fontSize: 12
	},
	compactBannerBtn: {
		display: "flex",
		alignItems: "center",
		gap: 6,
		background: "transparent",
		border: "none",
		color: "inherit",
		cursor: "pointer",
		padding: "6px 12px",
		flex: 1,
		minWidth: 0
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		padding: "8px 12px"
	},
	headerLeft: {
		display: "flex",
		alignItems: "center",
		gap: 6
	},
	headerIcon: { color: "#60a5fa" },
	headerTitle: {
		fontWeight: 600,
		fontSize: 12
	},
	headerCounter: {
		opacity: .5,
		fontSize: 11,
		marginLeft: 4
	},
	dismissBtn: {
		background: "transparent",
		border: "none",
		color: "inherit",
		opacity: .5,
		cursor: "pointer",
		padding: 2,
		display: "flex"
	},
	list: {
		display: "flex",
		flexDirection: "column",
		gap: 4,
		padding: "4px 8px 10px",
		overflowY: "auto",
		minHeight: 0,
		flex: "1 1 auto"
	},
	card: {
		border: "1px solid hsl(var(--border, 0 0% 100%) / 0.06)",
		borderRadius: 6,
		background: "hsl(var(--muted, 0 0% 0%) / 0.12)"
	},
	cardDone: {
		borderColor: "rgba(34,197,94,0.12)",
		background: "rgba(34,197,94,0.025)"
	},
	cardHeader: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		background: "transparent",
		border: "none",
		color: "inherit",
		padding: "7px 9px",
		cursor: "pointer",
		textAlign: "left"
	},
	cardHeaderLeft: {
		display: "flex",
		alignItems: "center",
		gap: 8,
		minWidth: 0
	},
	cardTitle: {
		fontSize: 12,
		fontWeight: 500,
		display: "flex",
		alignItems: "center",
		gap: 6,
		minWidth: 0,
		flexWrap: "wrap"
	},
	requiredPill: {
		fontSize: 10,
		padding: "1px 5px",
		borderRadius: 4,
		background: "rgba(239,68,68,0.12)",
		color: "#f87171",
		fontWeight: 500
	},
	chevron: { opacity: .5 },
	checkDone: {
		width: 16,
		height: 16,
		borderRadius: "50%",
		background: "#22c55e",
		color: "#fff",
		display: "flex",
		alignItems: "center",
		justifyContent: "center"
	},
	checkTodo: {
		width: 16,
		height: 16,
		borderRadius: "50%",
		border: "1px solid rgba(255,255,255,0.2)"
	},
	cardBody: {
		padding: "0 10px 10px 34px",
		display: "flex",
		flexDirection: "column",
		gap: 8
	},
	cardDesc: {
		margin: 0,
		opacity: .65,
		fontSize: 12,
		lineHeight: 1.4
	},
	methods: {
		display: "flex",
		flexDirection: "column",
		gap: 6
	},
	method: {
		padding: "8px 10px",
		border: "1px solid rgba(255,255,255,0.06)",
		borderRadius: 6,
		background: "rgba(255,255,255,0.02)",
		display: "flex",
		flexDirection: "column",
		gap: 6
	},
	methodPrimary: {
		padding: "10px",
		border: "1px solid rgba(59,130,246,0.25)",
		borderRadius: 6,
		background: "rgba(59,130,246,0.06)",
		display: "flex",
		flexDirection: "column",
		gap: 6
	},
	methodHeader: {
		display: "flex",
		alignItems: "center"
	},
	methodLabel: {
		fontSize: 12,
		fontWeight: 500
	},
	methodDesc: {
		margin: 0,
		opacity: .6,
		fontSize: 11,
		lineHeight: 1.4
	},
	secondaryPanel: { paddingTop: 2 },
	secondaryToggle: {
		width: "100%",
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		gap: 8,
		padding: "7px 8px",
		borderRadius: 6,
		border: "1px solid rgba(255,255,255,0.08)",
		background: "rgba(255,255,255,0.025)",
		color: "inherit",
		cursor: "pointer",
		fontSize: 11,
		fontWeight: 500,
		textAlign: "left"
	},
	secondaryToggleLeft: {
		display: "flex",
		alignItems: "center",
		gap: 6,
		minWidth: 0
	},
	methodPickerEmbedded: {
		paddingTop: 8,
		display: "flex",
		flexDirection: "column",
		gap: 6
	},
	pickerLabel: {
		display: "flex",
		flexDirection: "column",
		gap: 3
	},
	form: {
		display: "flex",
		flexDirection: "column",
		gap: 6
	},
	formLabel: {
		display: "flex",
		flexDirection: "column",
		gap: 2
	},
	formLabelText: {
		fontSize: 11,
		opacity: .6
	},
	select: {
		width: "100%",
		padding: "6px 8px",
		fontSize: 12,
		borderRadius: 5,
		border: "1px solid rgba(255,255,255,0.1)",
		background: "rgba(0,0,0,0.25)",
		color: "inherit",
		outline: "none",
		boxSizing: "border-box"
	},
	input: {
		width: "100%",
		padding: "6px 8px",
		fontSize: 12,
		borderRadius: 5,
		border: "1px solid rgba(255,255,255,0.1)",
		background: "rgba(0,0,0,0.25)",
		color: "inherit",
		outline: "none",
		boxSizing: "border-box"
	},
	methodHint: {
		margin: 0,
		fontSize: 11,
		color: "rgba(255,255,255,0.62)"
	},
	errText: {
		margin: 0,
		fontSize: 11,
		color: "#f87171"
	},
	footer: {
		padding: "0 12px 10px",
		display: "flex",
		justifyContent: "flex-end"
	},
	hideLink: {
		background: "transparent",
		border: "none",
		color: "inherit",
		opacity: .5,
		cursor: "pointer",
		fontSize: 11,
		padding: "2px 4px"
	}
};
//#endregion
export { OnboardingPanel };
