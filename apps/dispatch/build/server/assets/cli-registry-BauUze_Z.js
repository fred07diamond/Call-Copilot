//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/terminal/cli-registry.js
/**
* CLI Registry — known AI coding CLIs and their metadata.
* Used by the embedded terminal in the agent panel.
*/
var CLI_REGISTRY = {
	claude: {
		label: "Claude Code",
		installPackage: "@anthropic-ai/claude-code",
		stripEnv: ["CLAUDECODE", "CLAUDE_CODE_SESSION"]
	},
	builder: {
		label: "Builder.io",
		installPackage: "",
		stripEnv: []
	},
	codex: {
		label: "Codex",
		installPackage: "@openai/codex",
		stripEnv: []
	},
	gemini: {
		label: "Gemini CLI",
		installPackage: "@google/gemini-cli",
		stripEnv: []
	},
	opencode: {
		label: "OpenCode",
		installPackage: "opencode-ai",
		stripEnv: []
	}
};
/** Check if a command name is in the CLI_REGISTRY allowlist */
function isAllowedCommand(cmd) {
	return Object.hasOwn(CLI_REGISTRY, cmd);
}
/** Check if a CLI command exists on PATH (safe — no shell interpolation) */
async function commandExists(cmd) {
	try {
		const { spawnSync } = await import("node:child_process");
		return spawnSync("which", [cmd], { stdio: "ignore" }).status === 0;
	} catch {
		return false;
	}
}
//#endregion
export { CLI_REGISTRY, commandExists, isAllowedCommand };
