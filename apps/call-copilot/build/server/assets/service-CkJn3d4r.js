import fs from "node:fs";
import nodePath from "node:path";
import { execFileSync } from "node:child_process";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/checkpoints/service.js
var TIMEOUT = 1e4;
var CHECKPOINT_ENV = {
	...process.env,
	GIT_AUTHOR_NAME: "agent-native",
	GIT_AUTHOR_EMAIL: "noreply@agent-native.com",
	GIT_COMMITTER_NAME: "agent-native",
	GIT_COMMITTER_EMAIL: "noreply@agent-native.com"
};
function isGitRepo(cwd) {
	try {
		execFileSync("git", ["rev-parse", "--is-inside-work-tree"], {
			cwd,
			stdio: "pipe",
			timeout: TIMEOUT
		});
		return true;
	} catch {
		return false;
	}
}
function hasUncommittedChanges(cwd) {
	const output = getUncommittedStatus(cwd);
	return output !== null && output.trim().length > 0;
}
function getUncommittedStatus(cwd) {
	try {
		return execFileSync("git", ["status", "--porcelain"], {
			cwd,
			stdio: "pipe",
			timeout: TIMEOUT,
			encoding: "utf-8"
		});
	} catch {
		return null;
	}
}
function createCheckpoint(cwd, message) {
	try {
		execFileSync("git", ["add", "-A"], {
			cwd,
			stdio: "pipe",
			timeout: TIMEOUT
		});
		execFileSync("git", [
			"commit",
			"-m",
			message
		], {
			cwd,
			stdio: "pipe",
			timeout: TIMEOUT,
			env: CHECKPOINT_ENV
		});
		return execFileSync("git", ["rev-parse", "HEAD"], {
			cwd,
			stdio: "pipe",
			timeout: TIMEOUT,
			encoding: "utf-8"
		}).trim() || null;
	} catch {
		return null;
	}
}
function restoreToCheckpoint(cwd, sha) {
	try {
		execFileSync("git", [
			"checkout",
			sha,
			"--",
			"."
		], {
			cwd,
			stdio: "pipe",
			timeout: TIMEOUT
		});
		try {
			const added = execFileSync("git", [
				"diff",
				"--name-only",
				"--diff-filter=A",
				sha,
				"HEAD"
			], {
				cwd,
				stdio: "pipe",
				timeout: TIMEOUT,
				encoding: "utf-8"
			}).trim();
			if (added) for (const file of added.split("\n")) {
				const filePath = nodePath.join(cwd, file);
				if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
			}
		} catch {}
		return true;
	} catch {
		return false;
	}
}
function getChangedFileNames(cwd) {
	try {
		const all = [
			execFileSync("git", [
				"diff",
				"--cached",
				"--name-only"
			], {
				cwd,
				stdio: "pipe",
				timeout: TIMEOUT,
				encoding: "utf-8"
			}).trim(),
			execFileSync("git", ["diff", "--name-only"], {
				cwd,
				stdio: "pipe",
				timeout: TIMEOUT,
				encoding: "utf-8"
			}).trim(),
			execFileSync("git", [
				"ls-files",
				"--others",
				"--exclude-standard"
			], {
				cwd,
				stdio: "pipe",
				timeout: TIMEOUT,
				encoding: "utf-8"
			}).trim()
		].filter(Boolean).join("\n");
		if (!all) return [];
		return [...new Set(all.split("\n").map((f) => f.split("/").pop()))];
	} catch {
		return [];
	}
}
//#endregion
export { createCheckpoint, getChangedFileNames, getUncommittedStatus, hasUncommittedChanges, isGitRepo, restoreToCheckpoint };
