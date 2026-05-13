import { b as setResponseStatus, c as getMethod, i as defineEventHandler, u as getRequestHeader } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-CmxO0LxM.js";
import { u as jwtVerify } from "./webapi-BRtoFKCk.js";
import { l as runWithRequestContext } from "./request-context-Ci6C_Mch.js";
import { i as getH3App } from "./framework-request-handler-B0C0aZhm.js";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/mcp/server.js
function getAccessTokens() {
	const single = process.env.ACCESS_TOKEN;
	const multi = process.env.ACCESS_TOKENS;
	const tokens = [];
	if (single) tokens.push(single);
	if (multi) tokens.push(...multi.split(",").map((t) => t.trim()).filter(Boolean));
	return tokens;
}
/**
* Verify the inbound auth header. Returns:
*   - { authed: true, identity } when verified — `identity` may be empty
*     when authed via a static ACCESS_TOKEN (no caller email available).
*   - { authed: false } on rejection.
*
* When A2A_SECRET is set we extract the JWT's `sub` (caller email) and
* `org_domain` claims so the MCP endpoint can wrap tool runs in
* `runWithRequestContext({ userEmail, orgId })`. Without that wrap, the
* MCP endpoint loses tenant identity and downstream `accessFilter` /
* `resolveCredential` calls fall back to platform-wide defaults.
*/
async function verifyAuth(authHeader) {
	const accessTokens = getAccessTokens();
	const hasA2ASecret = !!process.env.A2A_SECRET;
	if (accessTokens.length === 0 && !hasA2ASecret) return { authed: true };
	if (!authHeader?.startsWith("Bearer ")) return { authed: false };
	const token = authHeader.slice(7);
	if (hasA2ASecret) try {
		const { payload } = await jwtVerify(token, new TextEncoder().encode(process.env.A2A_SECRET));
		return {
			authed: true,
			identity: {
				userEmail: typeof payload.sub === "string" ? payload.sub : void 0,
				orgDomain: typeof payload.org_domain === "string" ? payload.org_domain : void 0
			}
		};
	} catch {}
	if (accessTokens.length > 0 && accessTokens.includes(token)) return { authed: true };
	return { authed: false };
}
async function resolveOrgIdFromDomain(orgDomain) {
	if (!orgDomain) return void 0;
	try {
		const { resolveOrgByDomain } = await import("./context-Bh-mBHiO.js");
		return (await resolveOrgByDomain(orgDomain))?.orgId ?? void 0;
	} catch {
		return;
	}
}
async function createMCPServerForRequest(config, identity) {
	const { Server } = await import("./server-Zhs6Q196.js");
	const { ListToolsRequestSchema, CallToolRequestSchema } = await import("./types-BPNTp39b.js");
	const server = new Server({
		name: config.name,
		version: config.version ?? "1.0.0"
	}, { capabilities: { tools: {} } });
	const orgIdPromise = resolveOrgIdFromDomain(identity?.orgDomain);
	/**
	* Wrap a callback in `runWithRequestContext({ userEmail, orgId }, fn)`.
	* Both the tools/list and tools/call handlers go through this so
	* downstream `accessFilter`, `resolveCredential`, and per-user MCP
	* visibility checks see the verified caller's identity.
	*/
	async function withCallerContext(fn) {
		const orgId = await orgIdPromise;
		return runWithRequestContext({
			userEmail: identity?.userEmail,
			orgId
		}, fn);
	}
	server.setRequestHandler(ListToolsRequestSchema, async () => {
		return withCallerContext(async () => {
			const tools = Object.entries(config.actions).map(([name, entry]) => ({
				name,
				description: entry.tool.description ?? name,
				inputSchema: entry.tool.parameters ?? {
					type: "object",
					properties: {}
				}
			}));
			if (config.askAgent) tools.push({
				name: "ask-agent",
				description: "Send a natural-language message to the app's AI agent and get a response. Use this for complex, multi-step tasks that require the agent's reasoning and full context about the app.",
				inputSchema: {
					type: "object",
					properties: { message: {
						type: "string",
						description: "The message to send to the agent"
					} },
					required: ["message"]
				}
			});
			return { tools };
		});
	});
	server.setRequestHandler(CallToolRequestSchema, async (request) => {
		return withCallerContext(async () => {
			const { name, arguments: args } = request.params;
			if (name === "ask-agent" && config.askAgent) {
				const message = args?.message ?? "";
				try {
					return { content: [{
						type: "text",
						text: await config.askAgent(message)
					}] };
				} catch (err) {
					return {
						content: [{
							type: "text",
							text: `Error: ${err.message}`
						}],
						isError: true
					};
				}
			}
			const entry = config.actions[name];
			if (!entry) return {
				content: [{
					type: "text",
					text: `Unknown tool: ${name}`
				}],
				isError: true
			};
			try {
				return { content: [{
					type: "text",
					text: await entry.run(args ?? {})
				}] };
			} catch (err) {
				return {
					content: [{
						type: "text",
						text: `Error: ${err.message}`
					}],
					isError: true
				};
			}
		});
	});
	return server;
}
/**
* Mount an MCP remote server on an H3/Nitro app.
*
* Endpoint: `{routePrefix}/mcp` (default `/_agent-native/mcp`)
*
* Uses stateless Streamable HTTP transport — no in-memory sessions,
* compatible with serverless deployments.
*
* Auth: Bearer token matching ACCESS_TOKEN/ACCESS_TOKENS or JWT via A2A_SECRET.
* No auth required when neither is configured (dev mode).
*/
function mountMCP(nitroApp, config, routePrefix = "/_agent-native") {
	getH3App(nitroApp).use(`${routePrefix}/mcp`, defineEventHandler(async (event) => {
		if ((event.url?.pathname || "/").replace(/^\/+/, "").replace(/\/+$/, "")) return;
		const method = getMethod(event);
		const authResult = await verifyAuth(getRequestHeader(event, "authorization"));
		if (!authResult.authed) {
			setResponseStatus(event, 401);
			return { error: "Unauthorized" };
		}
		if (method === "DELETE") {
			setResponseStatus(event, 204);
			return "";
		}
		if (method === "GET") {}
		if (method !== "POST" && method !== "GET") {
			setResponseStatus(event, 405);
			return { error: "Method not allowed" };
		}
		const body = method === "POST" ? await readBody(event) : void 0;
		const { StreamableHTTPServerTransport } = await import("./streamableHttp-BMPxAc84.js");
		const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: void 0 });
		await (await createMCPServerForRequest(config, authResult.identity)).connect(transport);
		const nodeReq = event.node?.req ?? event.req?.runtime?.node?.req;
		const nodeRes = event.node?.res ?? event.req?.runtime?.node?.res;
		if (!nodeReq || !nodeRes) {
			setResponseStatus(event, 501);
			return { error: "MCP requires Node runtime" };
		}
		await transport.handleRequest(nodeReq, nodeRes, body);
		event._handled = true;
	}));
	if (process.env.DEBUG) console.log(`[mcp] Mounted MCP server at ${routePrefix}/mcp (${Object.keys(config.actions).length} tools${config.askAgent ? " + ask-agent" : ""})`);
}
//#endregion
export { mountMCP };
