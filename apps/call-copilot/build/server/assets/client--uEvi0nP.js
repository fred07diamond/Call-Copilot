import { a as mergeCapabilities, c as safeParse, i as Protocol, n as assertToolsCallTaskCapability, o as getObjectShape, r as AjvJsonSchemaValidator, s as isZ4Schema, t as assertClientRequestTaskCapability } from "./helpers-BIGdv8qb.js";
import { A as ElicitResultSchema, C as CreateTaskResultSchema, I as ErrorCode, It as PromptListChangedNotificationSchema, O as ElicitRequestSchema, P as EmptyResultSchema, S as CreateMessageResultWithToolsSchema, Ut as ReadResourceResultSchema, Y as InitializeResultSchema, Yt as ResourceListChangedNotificationSchema, _ as CompleteResultSchema, b as CreateMessageRequestSchema, bt as McpError, c as CallToolResultSchema, ct as ListResourceTemplatesResultSchema, gt as ListToolsResultSchema, it as ListChangedOptionsBaseSchema, jn as ToolListChangedNotificationSchema, nt as LATEST_PROTOCOL_VERSION, on as SUPPORTED_PROTOCOL_VERSIONS, ot as ListPromptsResultSchema, ut as ListResourcesResultSchema, x as CreateMessageResultSchema, z as GetPromptResultSchema } from "./types-CaFGQHMp.js";
//#region ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.29.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/experimental/tasks/client.js
/**
* Experimental client task features for MCP SDK.
* WARNING: These APIs are experimental and may change without notice.
*
* @experimental
*/
/**
* Experimental task features for MCP clients.
*
* Access via `client.experimental.tasks`:
* ```typescript
* const stream = client.experimental.tasks.callToolStream({ name: 'tool', arguments: {} });
* const task = await client.experimental.tasks.getTask(taskId);
* ```
*
* @experimental
*/
var ExperimentalClientTasks = class {
	constructor(_client) {
		this._client = _client;
	}
	/**
	* Calls a tool and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* This method provides streaming access to tool execution, allowing you to
	* observe intermediate task status updates for long-running tool calls.
	* Automatically validates structured output if the tool has an outputSchema.
	*
	* @example
	* ```typescript
	* const stream = client.experimental.tasks.callToolStream({ name: 'myTool', arguments: {} });
	* for await (const message of stream) {
	*   switch (message.type) {
	*     case 'taskCreated':
	*       console.log('Tool execution started:', message.task.taskId);
	*       break;
	*     case 'taskStatus':
	*       console.log('Tool status:', message.task.status);
	*       break;
	*     case 'result':
	*       console.log('Tool result:', message.result);
	*       break;
	*     case 'error':
	*       console.error('Tool error:', message.error);
	*       break;
	*   }
	* }
	* ```
	*
	* @param params - Tool call parameters (name and arguments)
	* @param resultSchema - Zod schema for validating the result (defaults to CallToolResultSchema)
	* @param options - Optional request options (timeout, signal, task creation params, etc.)
	* @returns AsyncGenerator that yields ResponseMessage objects
	*
	* @experimental
	*/
	async *callToolStream(params, resultSchema = CallToolResultSchema, options) {
		const clientInternal = this._client;
		const optionsWithTask = {
			...options,
			task: options?.task ?? (clientInternal.isToolTask(params.name) ? {} : void 0)
		};
		const stream = clientInternal.requestStream({
			method: "tools/call",
			params
		}, resultSchema, optionsWithTask);
		const validator = clientInternal.getToolOutputValidator(params.name);
		for await (const message of stream) {
			if (message.type === "result" && validator) {
				const result = message.result;
				if (!result.structuredContent && !result.isError) {
					yield {
						type: "error",
						error: new McpError(ErrorCode.InvalidRequest, `Tool ${params.name} has an output schema but did not return structured content`)
					};
					return;
				}
				if (result.structuredContent) try {
					const validationResult = validator(result.structuredContent);
					if (!validationResult.valid) {
						yield {
							type: "error",
							error: new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validationResult.errorMessage}`)
						};
						return;
					}
				} catch (error) {
					if (error instanceof McpError) {
						yield {
							type: "error",
							error
						};
						return;
					}
					yield {
						type: "error",
						error: new McpError(ErrorCode.InvalidParams, `Failed to validate structured content: ${error instanceof Error ? error.message : String(error)}`)
					};
					return;
				}
			}
			yield message;
		}
	}
	/**
	* Gets the current status of a task.
	*
	* @param taskId - The task identifier
	* @param options - Optional request options
	* @returns The task status
	*
	* @experimental
	*/
	async getTask(taskId, options) {
		return this._client.getTask({ taskId }, options);
	}
	/**
	* Retrieves the result of a completed task.
	*
	* @param taskId - The task identifier
	* @param resultSchema - Zod schema for validating the result
	* @param options - Optional request options
	* @returns The task result
	*
	* @experimental
	*/
	async getTaskResult(taskId, resultSchema, options) {
		return this._client.getTaskResult({ taskId }, resultSchema, options);
	}
	/**
	* Lists tasks with optional pagination.
	*
	* @param cursor - Optional pagination cursor
	* @param options - Optional request options
	* @returns List of tasks with optional next cursor
	*
	* @experimental
	*/
	async listTasks(cursor, options) {
		return this._client.listTasks(cursor ? { cursor } : void 0, options);
	}
	/**
	* Cancels a running task.
	*
	* @param taskId - The task identifier
	* @param options - Optional request options
	*
	* @experimental
	*/
	async cancelTask(taskId, options) {
		return this._client.cancelTask({ taskId }, options);
	}
	/**
	* Sends a request and returns an AsyncGenerator that yields response messages.
	* The generator is guaranteed to end with either a 'result' or 'error' message.
	*
	* This method provides streaming access to request processing, allowing you to
	* observe intermediate task status updates for task-augmented requests.
	*
	* @param request - The request to send
	* @param resultSchema - Zod schema for validating the result
	* @param options - Optional request options (timeout, signal, task creation params, etc.)
	* @returns AsyncGenerator that yields ResponseMessage objects
	*
	* @experimental
	*/
	requestStream(request, resultSchema, options) {
		return this._client.requestStream(request, resultSchema, options);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.29.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/client/index.js
/**
* Elicitation default application helper. Applies defaults to the data based on the schema.
*
* @param schema - The schema to apply defaults to.
* @param data - The data to apply defaults to.
*/
function applyElicitationDefaults(schema, data) {
	if (!schema || data === null || typeof data !== "object") return;
	if (schema.type === "object" && schema.properties && typeof schema.properties === "object") {
		const obj = data;
		const props = schema.properties;
		for (const key of Object.keys(props)) {
			const propSchema = props[key];
			if (obj[key] === void 0 && Object.prototype.hasOwnProperty.call(propSchema, "default")) obj[key] = propSchema.default;
			if (obj[key] !== void 0) applyElicitationDefaults(propSchema, obj[key]);
		}
	}
	if (Array.isArray(schema.anyOf)) {
		for (const sub of schema.anyOf) if (typeof sub !== "boolean") applyElicitationDefaults(sub, data);
	}
	if (Array.isArray(schema.oneOf)) {
		for (const sub of schema.oneOf) if (typeof sub !== "boolean") applyElicitationDefaults(sub, data);
	}
}
/**
* Determines which elicitation modes are supported based on declared client capabilities.
*
* According to the spec:
* - An empty elicitation capability object defaults to form mode support (backwards compatibility)
* - URL mode is only supported if explicitly declared
*
* @param capabilities - The client's elicitation capabilities
* @returns An object indicating which modes are supported
*/
function getSupportedElicitationModes(capabilities) {
	if (!capabilities) return {
		supportsFormMode: false,
		supportsUrlMode: false
	};
	const hasFormCapability = capabilities.form !== void 0;
	const hasUrlCapability = capabilities.url !== void 0;
	return {
		supportsFormMode: hasFormCapability || !hasFormCapability && !hasUrlCapability,
		supportsUrlMode: hasUrlCapability
	};
}
/**
* An MCP client on top of a pluggable transport.
*
* The client will automatically begin the initialization flow with the server when connect() is called.
*
* To use with custom types, extend the base Request/Notification/Result types and pass them as type parameters:
*
* ```typescript
* // Custom schemas
* const CustomRequestSchema = RequestSchema.extend({...})
* const CustomNotificationSchema = NotificationSchema.extend({...})
* const CustomResultSchema = ResultSchema.extend({...})
*
* // Type aliases
* type CustomRequest = z.infer<typeof CustomRequestSchema>
* type CustomNotification = z.infer<typeof CustomNotificationSchema>
* type CustomResult = z.infer<typeof CustomResultSchema>
*
* // Create typed client
* const client = new Client<CustomRequest, CustomNotification, CustomResult>({
*   name: "CustomClient",
*   version: "1.0.0"
* })
* ```
*/
var Client = class extends Protocol {
	/**
	* Initializes this client with the given name and version information.
	*/
	constructor(_clientInfo, options) {
		super(options);
		this._clientInfo = _clientInfo;
		this._cachedToolOutputValidators = /* @__PURE__ */ new Map();
		this._cachedKnownTaskTools = /* @__PURE__ */ new Set();
		this._cachedRequiredTaskTools = /* @__PURE__ */ new Set();
		this._listChangedDebounceTimers = /* @__PURE__ */ new Map();
		this._capabilities = options?.capabilities ?? {};
		this._jsonSchemaValidator = options?.jsonSchemaValidator ?? new AjvJsonSchemaValidator();
		if (options?.listChanged) this._pendingListChangedConfig = options.listChanged;
	}
	/**
	* Set up handlers for list changed notifications based on config and server capabilities.
	* This should only be called after initialization when server capabilities are known.
	* Handlers are silently skipped if the server doesn't advertise the corresponding listChanged capability.
	* @internal
	*/
	_setupListChangedHandlers(config) {
		if (config.tools && this._serverCapabilities?.tools?.listChanged) this._setupListChangedHandler("tools", ToolListChangedNotificationSchema, config.tools, async () => {
			return (await this.listTools()).tools;
		});
		if (config.prompts && this._serverCapabilities?.prompts?.listChanged) this._setupListChangedHandler("prompts", PromptListChangedNotificationSchema, config.prompts, async () => {
			return (await this.listPrompts()).prompts;
		});
		if (config.resources && this._serverCapabilities?.resources?.listChanged) this._setupListChangedHandler("resources", ResourceListChangedNotificationSchema, config.resources, async () => {
			return (await this.listResources()).resources;
		});
	}
	/**
	* Access experimental features.
	*
	* WARNING: These APIs are experimental and may change without notice.
	*
	* @experimental
	*/
	get experimental() {
		if (!this._experimental) this._experimental = { tasks: new ExperimentalClientTasks(this) };
		return this._experimental;
	}
	/**
	* Registers new capabilities. This can only be called before connecting to a transport.
	*
	* The new capabilities will be merged with any existing capabilities previously given (e.g., at initialization).
	*/
	registerCapabilities(capabilities) {
		if (this.transport) throw new Error("Cannot register capabilities after connecting to transport");
		this._capabilities = mergeCapabilities(this._capabilities, capabilities);
	}
	/**
	* Override request handler registration to enforce client-side validation for elicitation.
	*/
	setRequestHandler(requestSchema, handler) {
		const methodSchema = getObjectShape(requestSchema)?.method;
		if (!methodSchema) throw new Error("Schema is missing a method literal");
		let methodValue;
		if (isZ4Schema(methodSchema)) {
			const v4Schema = methodSchema;
			methodValue = (v4Schema._zod?.def)?.value ?? v4Schema.value;
		} else {
			const v3Schema = methodSchema;
			methodValue = v3Schema._def?.value ?? v3Schema.value;
		}
		if (typeof methodValue !== "string") throw new Error("Schema method literal must be a string");
		const method = methodValue;
		if (method === "elicitation/create") {
			const wrappedHandler = async (request, extra) => {
				const validatedRequest = safeParse(ElicitRequestSchema, request);
				if (!validatedRequest.success) {
					const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid elicitation request: ${errorMessage}`);
				}
				const { params } = validatedRequest.data;
				params.mode = params.mode ?? "form";
				const { supportsFormMode, supportsUrlMode } = getSupportedElicitationModes(this._capabilities.elicitation);
				if (params.mode === "form" && !supportsFormMode) throw new McpError(ErrorCode.InvalidParams, "Client does not support form-mode elicitation requests");
				if (params.mode === "url" && !supportsUrlMode) throw new McpError(ErrorCode.InvalidParams, "Client does not support URL-mode elicitation requests");
				const result = await Promise.resolve(handler(request, extra));
				if (params.task) {
					const taskValidationResult = safeParse(CreateTaskResultSchema, result);
					if (!taskValidationResult.success) {
						const errorMessage = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
						throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
					}
					return taskValidationResult.data;
				}
				const validationResult = safeParse(ElicitResultSchema, result);
				if (!validationResult.success) {
					const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid elicitation result: ${errorMessage}`);
				}
				const validatedResult = validationResult.data;
				const requestedSchema = params.mode === "form" ? params.requestedSchema : void 0;
				if (params.mode === "form" && validatedResult.action === "accept" && validatedResult.content && requestedSchema) {
					if (this._capabilities.elicitation?.form?.applyDefaults) try {
						applyElicitationDefaults(requestedSchema, validatedResult.content);
					} catch {}
				}
				return validatedResult;
			};
			return super.setRequestHandler(requestSchema, wrappedHandler);
		}
		if (method === "sampling/createMessage") {
			const wrappedHandler = async (request, extra) => {
				const validatedRequest = safeParse(CreateMessageRequestSchema, request);
				if (!validatedRequest.success) {
					const errorMessage = validatedRequest.error instanceof Error ? validatedRequest.error.message : String(validatedRequest.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid sampling request: ${errorMessage}`);
				}
				const { params } = validatedRequest.data;
				const result = await Promise.resolve(handler(request, extra));
				if (params.task) {
					const taskValidationResult = safeParse(CreateTaskResultSchema, result);
					if (!taskValidationResult.success) {
						const errorMessage = taskValidationResult.error instanceof Error ? taskValidationResult.error.message : String(taskValidationResult.error);
						throw new McpError(ErrorCode.InvalidParams, `Invalid task creation result: ${errorMessage}`);
					}
					return taskValidationResult.data;
				}
				const validationResult = safeParse(params.tools || params.toolChoice ? CreateMessageResultWithToolsSchema : CreateMessageResultSchema, result);
				if (!validationResult.success) {
					const errorMessage = validationResult.error instanceof Error ? validationResult.error.message : String(validationResult.error);
					throw new McpError(ErrorCode.InvalidParams, `Invalid sampling result: ${errorMessage}`);
				}
				return validationResult.data;
			};
			return super.setRequestHandler(requestSchema, wrappedHandler);
		}
		return super.setRequestHandler(requestSchema, handler);
	}
	assertCapability(capability, method) {
		if (!this._serverCapabilities?.[capability]) throw new Error(`Server does not support ${capability} (required for ${method})`);
	}
	async connect(transport, options) {
		await super.connect(transport);
		if (transport.sessionId !== void 0) return;
		try {
			const result = await this.request({
				method: "initialize",
				params: {
					protocolVersion: LATEST_PROTOCOL_VERSION,
					capabilities: this._capabilities,
					clientInfo: this._clientInfo
				}
			}, InitializeResultSchema, options);
			if (result === void 0) throw new Error(`Server sent invalid initialize result: ${result}`);
			if (!SUPPORTED_PROTOCOL_VERSIONS.includes(result.protocolVersion)) throw new Error(`Server's protocol version is not supported: ${result.protocolVersion}`);
			this._serverCapabilities = result.capabilities;
			this._serverVersion = result.serverInfo;
			if (transport.setProtocolVersion) transport.setProtocolVersion(result.protocolVersion);
			this._instructions = result.instructions;
			await this.notification({ method: "notifications/initialized" });
			if (this._pendingListChangedConfig) {
				this._setupListChangedHandlers(this._pendingListChangedConfig);
				this._pendingListChangedConfig = void 0;
			}
		} catch (error) {
			this.close();
			throw error;
		}
	}
	/**
	* After initialization has completed, this will be populated with the server's reported capabilities.
	*/
	getServerCapabilities() {
		return this._serverCapabilities;
	}
	/**
	* After initialization has completed, this will be populated with information about the server's name and version.
	*/
	getServerVersion() {
		return this._serverVersion;
	}
	/**
	* After initialization has completed, this may be populated with information about the server's instructions.
	*/
	getInstructions() {
		return this._instructions;
	}
	assertCapabilityForMethod(method) {
		switch (method) {
			case "logging/setLevel":
				if (!this._serverCapabilities?.logging) throw new Error(`Server does not support logging (required for ${method})`);
				break;
			case "prompts/get":
			case "prompts/list":
				if (!this._serverCapabilities?.prompts) throw new Error(`Server does not support prompts (required for ${method})`);
				break;
			case "resources/list":
			case "resources/templates/list":
			case "resources/read":
			case "resources/subscribe":
			case "resources/unsubscribe":
				if (!this._serverCapabilities?.resources) throw new Error(`Server does not support resources (required for ${method})`);
				if (method === "resources/subscribe" && !this._serverCapabilities.resources.subscribe) throw new Error(`Server does not support resource subscriptions (required for ${method})`);
				break;
			case "tools/call":
			case "tools/list":
				if (!this._serverCapabilities?.tools) throw new Error(`Server does not support tools (required for ${method})`);
				break;
			case "completion/complete":
				if (!this._serverCapabilities?.completions) throw new Error(`Server does not support completions (required for ${method})`);
				break;
			case "initialize": break;
			case "ping": break;
		}
	}
	assertNotificationCapability(method) {
		switch (method) {
			case "notifications/roots/list_changed":
				if (!this._capabilities.roots?.listChanged) throw new Error(`Client does not support roots list changed notifications (required for ${method})`);
				break;
			case "notifications/initialized": break;
			case "notifications/cancelled": break;
			case "notifications/progress": break;
		}
	}
	assertRequestHandlerCapability(method) {
		if (!this._capabilities) return;
		switch (method) {
			case "sampling/createMessage":
				if (!this._capabilities.sampling) throw new Error(`Client does not support sampling capability (required for ${method})`);
				break;
			case "elicitation/create":
				if (!this._capabilities.elicitation) throw new Error(`Client does not support elicitation capability (required for ${method})`);
				break;
			case "roots/list":
				if (!this._capabilities.roots) throw new Error(`Client does not support roots capability (required for ${method})`);
				break;
			case "tasks/get":
			case "tasks/list":
			case "tasks/result":
			case "tasks/cancel":
				if (!this._capabilities.tasks) throw new Error(`Client does not support tasks capability (required for ${method})`);
				break;
			case "ping": break;
		}
	}
	assertTaskCapability(method) {
		assertToolsCallTaskCapability(this._serverCapabilities?.tasks?.requests, method, "Server");
	}
	assertTaskHandlerCapability(method) {
		if (!this._capabilities) return;
		assertClientRequestTaskCapability(this._capabilities.tasks?.requests, method, "Client");
	}
	async ping(options) {
		return this.request({ method: "ping" }, EmptyResultSchema, options);
	}
	async complete(params, options) {
		return this.request({
			method: "completion/complete",
			params
		}, CompleteResultSchema, options);
	}
	async setLoggingLevel(level, options) {
		return this.request({
			method: "logging/setLevel",
			params: { level }
		}, EmptyResultSchema, options);
	}
	async getPrompt(params, options) {
		return this.request({
			method: "prompts/get",
			params
		}, GetPromptResultSchema, options);
	}
	async listPrompts(params, options) {
		return this.request({
			method: "prompts/list",
			params
		}, ListPromptsResultSchema, options);
	}
	async listResources(params, options) {
		return this.request({
			method: "resources/list",
			params
		}, ListResourcesResultSchema, options);
	}
	async listResourceTemplates(params, options) {
		return this.request({
			method: "resources/templates/list",
			params
		}, ListResourceTemplatesResultSchema, options);
	}
	async readResource(params, options) {
		return this.request({
			method: "resources/read",
			params
		}, ReadResourceResultSchema, options);
	}
	async subscribeResource(params, options) {
		return this.request({
			method: "resources/subscribe",
			params
		}, EmptyResultSchema, options);
	}
	async unsubscribeResource(params, options) {
		return this.request({
			method: "resources/unsubscribe",
			params
		}, EmptyResultSchema, options);
	}
	/**
	* Calls a tool and waits for the result. Automatically validates structured output if the tool has an outputSchema.
	*
	* For task-based execution with streaming behavior, use client.experimental.tasks.callToolStream() instead.
	*/
	async callTool(params, resultSchema = CallToolResultSchema, options) {
		if (this.isToolTaskRequired(params.name)) throw new McpError(ErrorCode.InvalidRequest, `Tool "${params.name}" requires task-based execution. Use client.experimental.tasks.callToolStream() instead.`);
		const result = await this.request({
			method: "tools/call",
			params
		}, resultSchema, options);
		const validator = this.getToolOutputValidator(params.name);
		if (validator) {
			if (!result.structuredContent && !result.isError) throw new McpError(ErrorCode.InvalidRequest, `Tool ${params.name} has an output schema but did not return structured content`);
			if (result.structuredContent) try {
				const validationResult = validator(result.structuredContent);
				if (!validationResult.valid) throw new McpError(ErrorCode.InvalidParams, `Structured content does not match the tool's output schema: ${validationResult.errorMessage}`);
			} catch (error) {
				if (error instanceof McpError) throw error;
				throw new McpError(ErrorCode.InvalidParams, `Failed to validate structured content: ${error instanceof Error ? error.message : String(error)}`);
			}
		}
		return result;
	}
	isToolTask(toolName) {
		if (!this._serverCapabilities?.tasks?.requests?.tools?.call) return false;
		return this._cachedKnownTaskTools.has(toolName);
	}
	/**
	* Check if a tool requires task-based execution.
	* Unlike isToolTask which includes 'optional' tools, this only checks for 'required'.
	*/
	isToolTaskRequired(toolName) {
		return this._cachedRequiredTaskTools.has(toolName);
	}
	/**
	* Cache validators for tool output schemas.
	* Called after listTools() to pre-compile validators for better performance.
	*/
	cacheToolMetadata(tools) {
		this._cachedToolOutputValidators.clear();
		this._cachedKnownTaskTools.clear();
		this._cachedRequiredTaskTools.clear();
		for (const tool of tools) {
			if (tool.outputSchema) {
				const toolValidator = this._jsonSchemaValidator.getValidator(tool.outputSchema);
				this._cachedToolOutputValidators.set(tool.name, toolValidator);
			}
			const taskSupport = tool.execution?.taskSupport;
			if (taskSupport === "required" || taskSupport === "optional") this._cachedKnownTaskTools.add(tool.name);
			if (taskSupport === "required") this._cachedRequiredTaskTools.add(tool.name);
		}
	}
	/**
	* Get cached validator for a tool
	*/
	getToolOutputValidator(toolName) {
		return this._cachedToolOutputValidators.get(toolName);
	}
	async listTools(params, options) {
		const result = await this.request({
			method: "tools/list",
			params
		}, ListToolsResultSchema, options);
		this.cacheToolMetadata(result.tools);
		return result;
	}
	/**
	* Set up a single list changed handler.
	* @internal
	*/
	_setupListChangedHandler(listType, notificationSchema, options, fetcher) {
		const parseResult = ListChangedOptionsBaseSchema.safeParse(options);
		if (!parseResult.success) throw new Error(`Invalid ${listType} listChanged options: ${parseResult.error.message}`);
		if (typeof options.onChanged !== "function") throw new Error(`Invalid ${listType} listChanged options: onChanged must be a function`);
		const { autoRefresh, debounceMs } = parseResult.data;
		const { onChanged } = options;
		const refresh = async () => {
			if (!autoRefresh) {
				onChanged(null, null);
				return;
			}
			try {
				onChanged(null, await fetcher());
			} catch (e) {
				onChanged(e instanceof Error ? e : new Error(String(e)), null);
			}
		};
		const handler = () => {
			if (debounceMs) {
				const existingTimer = this._listChangedDebounceTimers.get(listType);
				if (existingTimer) clearTimeout(existingTimer);
				const timer = setTimeout(refresh, debounceMs);
				this._listChangedDebounceTimers.set(listType, timer);
			} else refresh();
		};
		this.setNotificationHandler(notificationSchema, handler);
	}
	async sendRootsListChanged() {
		return this.notification({ method: "notifications/roots/list_changed" });
	}
};
//#endregion
export { Client, getSupportedElicitationModes };
