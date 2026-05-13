import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { a as require_react, i as require_jsx_runtime, t as agentNativePath } from "./api-path-Cj855NR1.js";
import { L as createReactComponent, i as TooltipTrigger, n as TooltipContent, t as Tooltip } from "./tooltip-Cpb41AAh.js";
import { n as IconCheck, t as IconExternalLink } from "./IconExternalLink-DP6nNCRs.js";
import { t as IconCopy } from "./IconCopy-C-gyOd7Y.js";
import { n as IconPlus, t as IconTerminal2 } from "./IconTerminal2-B8caiWT6.js";
var IconBrandGoogleDrive = createReactComponent("outline", "brand-google-drive", "BrandGoogleDrive", [
	["path", {
		"d": "M12 10l-6 10l-3 -5l6 -10l3 5",
		"key": "svg-0"
	}],
	["path", {
		"d": "M9 15h12l-3 5h-12",
		"key": "svg-1"
	}],
	["path", {
		"d": "M15 15l-6 -10h6l6 10l-6 0",
		"key": "svg-2"
	}]
]);
var IconBrandSlack = createReactComponent("outline", "brand-slack", "BrandSlack", [
	["path", {
		"d": "M12 12v-6a2 2 0 0 1 4 0v6m0 -2a2 2 0 1 1 2 2h-6",
		"key": "svg-0"
	}],
	["path", {
		"d": "M12 12h6a2 2 0 0 1 0 4h-6m2 0a2 2 0 1 1 -2 2v-6",
		"key": "svg-1"
	}],
	["path", {
		"d": "M12 12v6a2 2 0 0 1 -4 0v-6m0 2a2 2 0 1 1 -2 -2h6",
		"key": "svg-2"
	}],
	["path", {
		"d": "M12 12h-6a2 2 0 0 1 0 -4h6m-2 0a2 2 0 1 1 2 -2v6",
		"key": "svg-3"
	}]
]);
var IconBrandTelegram = createReactComponent("outline", "brand-telegram", "BrandTelegram", [["path", {
	"d": "M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4",
	"key": "svg-0"
}]]);
var IconBrandWhatsapp = createReactComponent("outline", "brand-whatsapp", "BrandWhatsapp", [["path", {
	"d": "M3 21l1.65 -3.8a9 9 0 1 1 3.4 2.9l-5.05 .9",
	"key": "svg-0"
}], ["path", {
	"d": "M9 10a.5 .5 0 0 0 1 0v-1a.5 .5 0 0 0 -1 0v1a5 5 0 0 0 5 5h1a.5 .5 0 0 0 0 -1h-1a.5 .5 0 0 0 0 1",
	"key": "svg-1"
}]]);
var IconBuildingSkyscraper = createReactComponent("outline", "building-skyscraper", "BuildingSkyscraper", [
	["path", {
		"d": "M3 21l18 0",
		"key": "svg-0"
	}],
	["path", {
		"d": "M5 21v-14l8 -4v18",
		"key": "svg-1"
	}],
	["path", {
		"d": "M19 21v-10l-6 -4",
		"key": "svg-2"
	}],
	["path", {
		"d": "M9 9l0 .01",
		"key": "svg-3"
	}],
	["path", {
		"d": "M9 12l0 .01",
		"key": "svg-4"
	}],
	["path", {
		"d": "M9 15l0 .01",
		"key": "svg-5"
	}],
	["path", {
		"d": "M9 18l0 .01",
		"key": "svg-6"
	}]
]);
var IconChevronLeft = createReactComponent("outline", "chevron-left", "ChevronLeft", [["path", {
	"d": "M15 6l-6 6l6 6",
	"key": "svg-0"
}]]);
var IconCircleCheck = createReactComponent("outline", "circle-check", "CircleCheck", [["path", {
	"d": "M3 12a9 9 0 1 0 18 0a9 9 0 1 0 -18 0",
	"key": "svg-0"
}], ["path", {
	"d": "M9 12l2 2l4 -4",
	"key": "svg-1"
}]]);
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/integrations/useIntegrationStatus.js
var import_jsx_runtime = require_jsx_runtime();
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
function useIntegrationStatus() {
	const [statuses, setStatuses] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const mountedRef = (0, import_react.useRef)(true);
	const fetchStatuses = (0, import_react.useCallback)(async () => {
		try {
			const res = await fetch(agentNativePath("/_agent-native/integrations/status"));
			if (!res.ok) {
				if (mountedRef.current) setLoading(false);
				return;
			}
			const data = await res.json();
			if (mountedRef.current) {
				setStatuses(Array.isArray(data) ? data : []);
				setLoading(false);
			}
		} catch {
			if (mountedRef.current) setLoading(false);
		}
	}, []);
	(0, import_react.useEffect)(() => {
		mountedRef.current = true;
		fetchStatuses();
		const interval = setInterval(fetchStatuses, 3e4);
		return () => {
			mountedRef.current = false;
			clearInterval(interval);
		};
	}, [fetchStatuses]);
	return {
		statuses,
		loading,
		refetch: fetchStatuses
	};
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/client/integrations/IntegrationsPanel.js
var PLATFORMS = [
	{
		id: "slack",
		label: "Slack",
		icon: IconBrandSlack,
		description: "Message your agent from any Slack channel or DM.",
		envVars: ["SLACK_BOT_TOKEN", "SLACK_SIGNING_SECRET"],
		setupSteps: [
			"Create a Slack app at api.slack.com/apps",
			"Enable \"Event Subscriptions\" and point to your webhook URL",
			"Subscribe to message.im and app_mention events",
			"Install the app to your workspace",
			"Copy the Bot Token and Signing Secret into your environment"
		],
		docsUrl: "https://api.slack.com/apps"
	},
	{
		id: "telegram",
		label: "Telegram",
		icon: IconBrandTelegram,
		description: "Chat with your agent via a Telegram bot.",
		envVars: ["TELEGRAM_BOT_TOKEN"],
		setupSteps: [
			"Message @BotFather on Telegram to create a new bot",
			"Copy the bot token into your environment",
			"Click \"Setup webhook\" below to register automatically"
		]
	},
	{
		id: "whatsapp",
		label: "WhatsApp",
		icon: IconBrandWhatsapp,
		description: "Connect your agent to WhatsApp Business.",
		envVars: ["WHATSAPP_TOKEN", "WHATSAPP_VERIFY_TOKEN"],
		setupSteps: [
			"Create a Meta Business app at developers.facebook.com",
			"Set up WhatsApp Business API",
			"Configure the webhook URL and verify token",
			"Copy the access token into your environment"
		],
		docsUrl: "https://developers.facebook.com/docs/whatsapp"
	},
	{
		id: "google-docs",
		label: "Google Docs",
		icon: IconBrandGoogleDrive,
		description: "Tag the agent in Google Doc comments to get responses.",
		envVars: ["GOOGLE_SERVICE_ACCOUNT_KEY"],
		setupSteps: [
			"Create a Google Cloud service account and download the JSON key",
			"Set GOOGLE_SERVICE_ACCOUNT_KEY in your environment (JSON string or file path)",
			"Share your Google Docs with the service account email",
			"Write a comment containing \"@Agent\" to trigger the agent"
		]
	},
	{
		id: "openclaw",
		label: "OpenClaw",
		icon: IconTerminal2,
		description: "Access this agent from OpenClaw's unified agent interface.",
		envVars: [],
		isClient: true,
		setupSteps: [
			"Install OpenClaw: npm install -g openclaw",
			"Add this agent's URL as a provider in your OpenClaw config",
			"OpenClaw discovers your agent's capabilities via the A2A protocol"
		]
	},
	{
		id: "claude-code",
		label: "Claude Code",
		icon: IconTerminal2,
		description: "Let Claude Code call this agent via A2A for data and actions.",
		envVars: [],
		isClient: true,
		setupSteps: [
			"Your agent exposes an A2A endpoint at /.well-known/agent-card.json",
			"In Claude Code, reference your agent's URL when asking for data",
			"Claude Code will discover and call your agent's skills automatically"
		]
	},
	{
		id: "builder",
		label: "Builder.io",
		icon: IconBuildingSkyscraper,
		description: "One chat interface that orchestrates all your agents together.",
		envVars: [],
		isClient: true,
		setupSteps: [
			"Connect your agent-native apps in your Builder.io workspace",
			"Builder.io discovers each agent's skills via A2A",
			"Chat with one agent that can trigger actions across all your apps"
		],
		docsUrl: "https://www.builder.io"
	}
];
function useAgentEngineConfigured() {
	const [configured, setConfigured] = (0, import_react.useState)(void 0);
	const refresh = (0, import_react.useCallback)(() => {
		fetch(agentNativePath("/_agent-native/agent-engine/status")).then((r) => r.ok ? r.json() : null).then((data) => {
			if (typeof data?.configured === "boolean") setConfigured(data.configured);
		}).catch(() => {});
	}, []);
	(0, import_react.useEffect)(() => {
		refresh();
		window.addEventListener("agent-engine:configured-changed", refresh);
		return () => window.removeEventListener("agent-engine:configured-changed", refresh);
	}, [refresh]);
	return configured;
}
function IntegrationDetail({ platform, serverStatus, onBack, onRefresh }) {
	const [toggling, setToggling] = (0, import_react.useState)(false);
	const [copied, setCopied] = (0, import_react.useState)(false);
	const [toggleError, setToggleError] = (0, import_react.useState)(null);
	const agentEngineConfigured = useAgentEngineConfigured();
	const handleToggle = (0, import_react.useCallback)(async () => {
		setToggling(true);
		setToggleError(null);
		try {
			const action = serverStatus?.enabled ? "disable" : "enable";
			const res = await fetch(agentNativePath(`/_agent-native/integrations/${platform.id}/${action}`), { method: "POST" });
			if (res.ok) {
				onRefresh();
				return;
			}
			setToggleError((await res.json().catch(() => null))?.error || res.statusText || `Couldn't ${action} ${platform.label} (HTTP ${res.status})`);
		} catch (err) {
			setToggleError(err instanceof Error ? err.message : "Network error reaching the server");
		} finally {
			setToggling(false);
		}
	}, [
		platform.id,
		platform.label,
		serverStatus?.enabled,
		onRefresh
	]);
	const handleCopy = (0, import_react.useCallback)(async (text) => {
		await navigator.clipboard.writeText(text);
		setCopied(true);
		setTimeout(() => setCopied(false), 2e3);
	}, []);
	const handleOpenLlmSettings = (0, import_react.useCallback)(() => {
		window.dispatchEvent(new CustomEvent("agent-panel:open-settings", { detail: { section: "llm" } }));
	}, []);
	const isConfigured = serverStatus?.configured ?? false;
	const isEnabled = serverStatus?.enabled ?? false;
	const showAgentEnginePrereq = !platform.isClient && agentEngineConfigured === false;
	const serviceAccountEmail = typeof serverStatus?.details?.serviceAccountEmail === "string" ? serverStatus.details.serviceAccountEmail : null;
	return (0, import_jsx_runtime.jsxs)("div", { children: [
		(0, import_jsx_runtime.jsxs)("button", {
			onClick: onBack,
			className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground mb-2",
			children: [(0, import_jsx_runtime.jsx)(IconChevronLeft, { size: 12 }), "Back"]
		}),
		(0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2 mb-2",
			children: [(0, import_jsx_runtime.jsx)(platform.icon, {
				size: 18,
				className: "text-foreground shrink-0"
			}), (0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("div", {
				className: "text-xs font-medium text-foreground",
				children: platform.label
			}), (0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] text-muted-foreground",
				children: platform.description
			})] })]
		}),
		showAgentEnginePrereq && (0, import_jsx_runtime.jsx)("div", {
			className: "mb-3 rounded-md border border-amber-500/30 bg-amber-500/10 px-2.5 py-2",
			children: (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-2",
				children: [(0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [(0, import_jsx_runtime.jsx)("div", {
						className: "text-[10px] font-medium text-foreground",
						children: "Agent engine required"
					}), (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-0.5 text-[10px] leading-relaxed text-muted-foreground",
						children: [
							"Connect Builder.io or an LLM key before ",
							platform.label,
							" can answer."
						]
					})]
				}), (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: handleOpenLlmSettings,
					className: "shrink-0 rounded border border-border bg-background px-2 py-1 text-[10px] font-medium text-muted-foreground transition-colors hover:bg-accent/40 hover:text-foreground",
					children: "Open LLM"
				})]
			})
		}),
		(0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3",
			children: [(0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-medium text-muted-foreground mb-1.5",
				children: "Setup"
			}), (0, import_jsx_runtime.jsx)("ol", {
				className: "space-y-1",
				children: platform.setupSteps.map((step, i) => (0, import_jsx_runtime.jsxs)("li", {
					className: "flex gap-1.5 text-[10px] text-muted-foreground leading-relaxed",
					children: [(0, import_jsx_runtime.jsxs)("span", {
						className: "shrink-0 text-muted-foreground/50",
						children: [i + 1, "."]
					}), step]
				}, i))
			})]
		}),
		serviceAccountEmail && (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3",
			children: [(0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-medium text-muted-foreground mb-1",
				children: "Share documents with"
			}), (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [(0, import_jsx_runtime.jsx)("code", {
					className: "flex-1 truncate rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground",
					children: serviceAccountEmail
				}), (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleCopy(serviceAccountEmail),
						className: "shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent/50",
						children: copied ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 12 }) : (0, import_jsx_runtime.jsx)(IconCopy, { size: 12 })
					})
				}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Copy service account email" })] })]
			})]
		}),
		platform.envVars.length > 0 && (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3",
			children: [
				(0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] font-medium text-muted-foreground mb-1",
					children: "Required secrets"
				}),
				(0, import_jsx_runtime.jsx)("div", {
					className: "space-y-0.5",
					children: platform.envVars.map((v) => (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-1",
						children: [(0, import_jsx_runtime.jsx)("code", {
							className: "text-[10px] text-foreground bg-muted px-1 py-0.5 rounded",
							children: v
						}), isConfigured && (0, import_jsx_runtime.jsx)(IconCircleCheck, {
							size: 11,
							className: "text-green-500 shrink-0"
						})]
					}, v))
				}),
				!isConfigured && (0, import_jsx_runtime.jsx)("p", {
					className: "text-[10px] text-amber-500 mt-1",
					children: "Set these in your .env file or environment to connect."
				})
			]
		}),
		serverStatus?.webhookUrl && !platform.isClient && (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-3",
			children: [(0, import_jsx_runtime.jsx)("div", {
				className: "text-[10px] font-medium text-muted-foreground mb-1",
				children: "Webhook URL"
			}), (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [(0, import_jsx_runtime.jsx)("code", {
					className: "flex-1 truncate rounded bg-muted px-1.5 py-0.5 text-[10px] text-foreground",
					children: serverStatus.webhookUrl
				}), (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
					asChild: true,
					children: (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleCopy(serverStatus.webhookUrl),
						className: "shrink-0 rounded p-0.5 text-muted-foreground hover:text-foreground hover:bg-accent/50",
						children: copied ? (0, import_jsx_runtime.jsx)(IconCheck, { size: 12 }) : (0, import_jsx_runtime.jsx)(IconCopy, { size: 12 })
					})
				}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Copy" })] })]
			})]
		}),
		platform.docsUrl && (0, import_jsx_runtime.jsxs)("a", {
			href: platform.docsUrl,
			target: "_blank",
			rel: "noopener noreferrer",
			className: "flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300 mb-3",
			children: ["Documentation", (0, import_jsx_runtime.jsx)(IconExternalLink, { size: 10 })]
		}),
		serverStatus && !platform.isClient && isConfigured && (0, import_jsx_runtime.jsx)("button", {
			onClick: handleToggle,
			disabled: toggling,
			className: `w-full rounded-md border px-2 py-1.5 text-[11px] font-medium disabled:opacity-50 ${isEnabled ? "border-border text-foreground hover:bg-accent/50" : "border-green-600/50 text-green-400 hover:bg-green-900/20"}`,
			children: toggling ? "..." : isEnabled ? "Disable" : "Enable"
		}),
		platform.isClient && (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-md border border-border bg-muted/30 px-2.5 py-2 text-[10px] text-muted-foreground",
			children: "This agent's A2A endpoint is automatically available. No configuration needed."
		}),
		serverStatus?.error && (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] text-destructive mt-2",
			children: serverStatus.error
		}),
		toggleError && (0, import_jsx_runtime.jsx)("p", {
			className: "text-[10px] text-destructive mt-2",
			children: toggleError
		})
	] });
}
function AddIntegrationPicker({ connectedIds, onSelect }) {
	return (0, import_jsx_runtime.jsx)("div", {
		className: "space-y-1",
		children: PLATFORMS.filter((p) => !connectedIds.has(p.id)).map((platform) => (0, import_jsx_runtime.jsxs)("button", {
			onClick: () => onSelect(platform),
			className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent/50",
			children: [(0, import_jsx_runtime.jsx)(platform.icon, {
				size: 14,
				className: "shrink-0 text-muted-foreground"
			}), (0, import_jsx_runtime.jsxs)("div", {
				className: "flex-1 min-w-0",
				children: [(0, import_jsx_runtime.jsx)("div", {
					className: "text-[11px] font-medium text-foreground",
					children: platform.label
				}), (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] text-muted-foreground truncate",
					children: platform.description
				})]
			})]
		}, platform.id))
	});
}
function IntegrationsPanel() {
	const { statuses, loading, refetch } = useIntegrationStatus();
	const [selectedPlatform, setSelectedPlatform] = (0, import_react.useState)(null);
	const [showPicker, setShowPicker] = (0, import_react.useState)(false);
	const statusMap = new Map(statuses.map((s) => [s.platform, s]));
	const connectedPlatforms = PLATFORMS.filter((p) => {
		const s = statusMap.get(p.id);
		return s?.configured || s?.enabled;
	});
	const connectedIds = new Set(connectedPlatforms.map((p) => p.id));
	if (selectedPlatform) return (0, import_jsx_runtime.jsx)(IntegrationDetail, {
		platform: selectedPlatform,
		serverStatus: statusMap.get(selectedPlatform.id),
		onBack: () => setSelectedPlatform(null),
		onRefresh: refetch
	});
	if (showPicker) return (0, import_jsx_runtime.jsxs)("div", { children: [
		(0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setShowPicker(false),
			className: "flex items-center gap-1 text-[10px] text-muted-foreground hover:text-foreground mb-2",
			children: [(0, import_jsx_runtime.jsx)(IconChevronLeft, { size: 12 }), "Back"]
		}),
		(0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] font-medium text-muted-foreground mb-1.5",
			children: "Add a chat integration"
		}),
		(0, import_jsx_runtime.jsx)(AddIntegrationPicker, {
			connectedIds,
			onSelect: (p) => {
				setSelectedPlatform(p);
				setShowPicker(false);
			}
		})
	] });
	return (0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center justify-between mb-1.5",
		children: [(0, import_jsx_runtime.jsxs)("div", { children: [(0, import_jsx_runtime.jsx)("div", {
			className: "text-xs font-medium text-foreground",
			children: "Chat Integrations"
		}), (0, import_jsx_runtime.jsx)("div", {
			className: "text-[10px] text-muted-foreground",
			children: "Talk to this agent from other platforms"
		})] }), (0, import_jsx_runtime.jsxs)(Tooltip, { children: [(0, import_jsx_runtime.jsx)(TooltipTrigger, {
			asChild: true,
			children: (0, import_jsx_runtime.jsx)("button", {
				onClick: () => setShowPicker(true),
				className: "flex h-5 w-5 items-center justify-center rounded text-muted-foreground hover:text-foreground hover:bg-accent/50",
				children: (0, import_jsx_runtime.jsx)(IconPlus, { size: 12 })
			})
		}), (0, import_jsx_runtime.jsx)(TooltipContent, { children: "Add integration" })] })]
	}), loading ? (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1.5",
		children: [(0, import_jsx_runtime.jsx)("div", { className: "h-6 w-full rounded bg-muted/50 animate-pulse" }), (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-3/4 rounded bg-muted/50 animate-pulse" })]
	}) : connectedPlatforms.length === 0 ? (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [(0, import_jsx_runtime.jsxs)("button", {
			onClick: () => setShowPicker(true),
			className: "flex w-full items-center gap-1.5 rounded-md px-2 py-1.5 text-[11px] text-muted-foreground hover:text-foreground hover:bg-accent/30",
			children: [(0, import_jsx_runtime.jsx)(IconPlus, {
				size: 12,
				className: "shrink-0"
			}), "Add integration"]
		}), (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-md border border-border bg-muted/30 px-2.5 py-2 text-[10px] text-muted-foreground",
			children: [
				"For a central Slack or Telegram entrypoint that can route work across multiple apps, use the",
				" ",
				(0, import_jsx_runtime.jsx)("a", {
					href: "https://dispatch.agent-native.com",
					target: "_blank",
					rel: "noopener noreferrer",
					className: "no-underline font-medium text-foreground hover:text-foreground/80",
					children: "dispatch template"
				}),
				"."
			]
		})]
	}) : (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-2",
		children: [connectedPlatforms.map((platform) => {
			const s = statusMap.get(platform.id);
			return (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => setSelectedPlatform(platform),
				className: "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-accent/50",
				children: [
					(0, import_jsx_runtime.jsx)(platform.icon, {
						size: 14,
						className: "shrink-0 text-muted-foreground"
					}),
					(0, import_jsx_runtime.jsx)("span", {
						className: "flex-1 text-[11px] font-medium text-foreground truncate",
						children: platform.label
					}),
					s && (0, import_jsx_runtime.jsx)("span", { className: `inline-block h-1.5 w-1.5 rounded-full shrink-0 ${s.enabled && s.configured ? "bg-green-500" : s.configured ? "bg-yellow-500" : "bg-gray-400"}` })
				]
			}, platform.id);
		}), (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-md border border-border bg-muted/30 px-2.5 py-2 text-[10px] text-muted-foreground",
			children: "Need one shared messaging surface for your workspace? Connect Slack or Telegram to a dispatch app and let it delegate to other agents over A2A."
		})]
	})] });
}
//#endregion
export { IntegrationsPanel };
