import { o as __toESM } from "./chunk-D3zDcpJC.js";
import { CLI_REGISTRY, commandExists, isAllowedCommand } from "./cli-registry-BauUze_Z.js";
import path from "path";
import os from "os";
import { createServer } from "http";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/terminal/pty-server.js
/**
* PTY WebSocket Server
*
* Creates an HTTP server with WebSocket support that spawns PTY processes
* for AI CLI tools. Each WebSocket connection gets its own PTY.
*
* Used by both the embedded AgentTerminal component and the CLI frame.
*/
var _cp;
async function getChildProcess() {
	if (!_cp) _cp = await import("node:child_process");
	return _cp;
}
var _fs;
async function getFs() {
	if (!_fs) _fs = await import("node:fs");
	return _fs;
}
/**
* Kill a process and all its descendants.
* node-pty's kill() only sends a signal to the shell, but child processes
* (like `builder`) may be in their own process group and survive as orphans.
*/
async function killProcessTree(pid, logPrefix) {
	const cp = await getChildProcess();
	if (os.platform() === "win32") {
		try {
			cp.execSync(`taskkill /pid ${pid} /T /F`, { stdio: "ignore" });
		} catch {}
		return;
	}
	const descendants = [];
	function findDescendants(parentPid) {
		try {
			const output = cp.execSync(`pgrep -P ${parentPid}`, {
				encoding: "utf-8",
				stdio: [
					"pipe",
					"pipe",
					"ignore"
				]
			}).trim();
			if (output) for (const line of output.split("\n")) {
				const childPid = parseInt(line, 10);
				if (childPid && !isNaN(childPid)) {
					descendants.push(childPid);
					findDescendants(childPid);
				}
			}
		} catch {}
	}
	findDescendants(pid);
	for (const childPid of descendants.reverse()) try {
		process.kill(childPid, "SIGTERM");
	} catch {}
	try {
		process.kill(pid, "SIGTERM");
	} catch {}
	setTimeout(() => {
		for (const childPid of descendants) try {
			process.kill(childPid, "SIGKILL");
		} catch {}
		try {
			process.kill(pid, "SIGKILL");
		} catch {}
	}, 500);
}
async function createPtyWebSocketServer(options = {}) {
	const { appDir = process.cwd(), command: defaultCommand = "claude", port = 0, authCheck, logPrefix = "[terminal]" } = options;
	const { WebSocketServer, WebSocket } = await import("./wrapper-DUzEl0ot.js").then((n) => n.n);
	const pty = await import("./lib-B-ZRqfoN.js").then((m) => /* @__PURE__ */ __toESM(m.default, 1));
	const resolvedAppDir = path.resolve(appDir);
	const shell = os.platform() === "win32" ? "cmd.exe" : process.env.SHELL || "/bin/zsh";
	const server = createServer((req, res) => {
		res.setHeader("Access-Control-Allow-Origin", "*");
		res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
		res.setHeader("Access-Control-Allow-Headers", "Content-Type");
		if (req.method === "OPTIONS") {
			res.writeHead(204);
			res.end();
			return;
		}
		res.writeHead(404);
		res.end();
	});
	const wss = new WebSocketServer({ noServer: true });
	server.on("upgrade", async (req, socket, head) => {
		if (new URL(req.url || "/", `http://${req.headers.host}`).pathname !== "/ws") {
			socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
			socket.destroy();
			return;
		}
		if (authCheck) try {
			if (!await authCheck(req)) {
				socket.write("HTTP/1.1 401 Unauthorized\r\n\r\n");
				socket.destroy();
				return;
			}
		} catch {
			socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
			socket.destroy();
			return;
		}
		wss.handleUpgrade(req, socket, head, (ws) => {
			wss.emit("connection", ws, req);
		});
	});
	const activePtys = /* @__PURE__ */ new Set();
	wss.on("connection", async (ws, req) => {
		const url = new URL(req.url || "", `http://${req.headers.host}`);
		const command = url.searchParams.get("command") || defaultCommand;
		const extraFlags = url.searchParams.get("flags") || "";
		console.log(`${logPrefix} WebSocket connected for command: ${command}`);
		const sendStatus = (status, message) => {
			if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({
				type: "setup-status",
				status,
				message
			}));
		};
		if (!isAllowedCommand(command)) {
			sendStatus("not-found", `"${command}" is not a recognized CLI. Allowed: ${Object.keys(CLI_REGISTRY).join(", ")}`);
			if (ws.readyState === WebSocket.OPEN) ws.close();
			return;
		}
		if (extraFlags && /[;&|`$(){}\n\r<>]/.test(extraFlags)) {
			sendStatus("failed", "Invalid flags: shell metacharacters not allowed");
			if (ws.readyState === WebSocket.OPEN) ws.close();
			return;
		}
		let useNpx = false;
		if (!await commandExists(command)) if (CLI_REGISTRY[command]?.installPackage) {
			console.log(`${logPrefix} ${command} CLI not found, will use npx`);
			useNpx = true;
		} else {
			sendStatus("not-found", `"${command}" not found on PATH. Please install it manually.`);
			if (ws.readyState === WebSocket.OPEN) ws.close();
			return;
		}
		const baseCommand = useNpx ? `npx --yes ${CLI_REGISTRY[command].installPackage}` : command;
		const fullCommand = extraFlags ? `${baseCommand} ${extraFlags}` : baseCommand;
		console.log(`${logPrefix} Spawning PTY: ${fullCommand}`);
		const registry = CLI_REGISTRY[command];
		const env = {
			...process.env,
			TERM: "xterm-256color"
		};
		if (registry) for (const v of registry.stripEnv) delete env[v];
		let ptyProcess;
		try {
			ptyProcess = pty.spawn(shell, [
				"-l",
				"-c",
				fullCommand
			], {
				name: "xterm-256color",
				cols: 120,
				rows: 40,
				cwd: resolvedAppDir,
				env
			});
		} catch (err) {
			console.error(`${logPrefix} Failed to spawn PTY:`, err);
			if (ws.readyState === WebSocket.OPEN) {
				ws.send(`\r\n\x1b[31m${logPrefix} Failed to spawn PTY: ${err}\x1b[0m\r\n`);
				ws.close();
			}
			return;
		}
		activePtys.add(ptyProcess);
		console.log(`${logPrefix} PTY spawned (pid: ${ptyProcess.pid})`);
		ptyProcess.onData((data) => {
			if (ws.readyState === WebSocket.OPEN) ws.send(data);
		});
		ptyProcess.onExit(({ exitCode }) => {
			console.log(`${logPrefix} PTY exited with code ${exitCode}`);
			activePtys.delete(ptyProcess);
			if (exitCode === 127 && ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({
				type: "setup-status",
				status: "not-found",
				message: `Command "${command}" not found. Please install it first.`
			}));
			if (ws.readyState === WebSocket.OPEN) ws.close();
		});
		ws.on("message", async (data) => {
			const str = typeof data === "string" ? data : data.toString();
			try {
				const msg = JSON.parse(str);
				if (msg.type === "agentNative.setEnvVars" && Array.isArray(msg.data?.vars)) {
					const envPath = path.join(resolvedAppDir, ".env");
					const vars = msg.data.vars;
					const validKeyPattern = /^[A-Za-z_][A-Za-z0-9_]*$/;
					const sanitizedVars = vars.filter(({ key }) => {
						if (!validKeyPattern.test(key)) {
							console.warn(`${logPrefix} Rejected invalid env var key: ${key}`);
							return false;
						}
						return true;
					});
					const fs = await getFs();
					let lines = [];
					try {
						lines = fs.readFileSync(envPath, "utf-8").split("\n");
					} catch {}
					for (const { key, value } of sanitizedVars) {
						const safeValue = value.replace(/[\r\n\0]/g, "");
						const quotedValue = /[# "']/.test(safeValue) ? `"${safeValue.replace(/"/g, "\\\"")}"` : safeValue;
						const idx = lines.findIndex((l) => l.startsWith(`${key}=`));
						const entry = `${key}=${quotedValue}`;
						if (idx !== -1) lines[idx] = entry;
						else lines.push(entry);
					}
					while (lines.length > 0 && lines[lines.length - 1] === "") lines.pop();
					fs.writeFileSync(envPath, lines.join("\n") + "\n", "utf-8");
					if (ws.readyState === WebSocket.OPEN) ws.send(JSON.stringify({
						type: "env-vars-saved",
						keys: sanitizedVars.map((v) => v.key)
					}));
					return;
				}
				if (msg.type === "resize" && msg.cols != null && msg.rows != null) {
					const cols = Math.max(1, Math.min(65535, Math.trunc(Number(msg.cols))));
					const rows = Math.max(1, Math.min(65535, Math.trunc(Number(msg.rows))));
					if (!Number.isFinite(cols) || !Number.isFinite(rows)) return;
					ptyProcess.resize(cols, rows);
					return;
				}
			} catch {}
			ptyProcess.write(str);
		});
		ws.on("close", () => {
			console.log(`${logPrefix} WebSocket closed, killing PTY tree (pid: ${ptyProcess.pid})`);
			activePtys.delete(ptyProcess);
			killProcessTree(ptyProcess.pid, logPrefix);
		});
	});
	return new Promise((resolve, reject) => {
		server.once("error", (err) => {
			reject(err);
		});
		server.listen(port, "127.0.0.1", () => {
			const addr = server.address();
			const actualPort = typeof addr === "object" && addr ? addr.port : port;
			if (process.env.DEBUG) console.log(`${logPrefix} PTY WebSocket server on ws://localhost:${actualPort}/ws`);
			resolve({
				server,
				port: actualPort,
				close: () => {
					for (const p of activePtys) killProcessTree(p.pid, logPrefix);
					activePtys.clear();
					wss.close();
					server.close();
				}
			});
		});
	});
}
//#endregion
export { createPtyWebSocketServer };
