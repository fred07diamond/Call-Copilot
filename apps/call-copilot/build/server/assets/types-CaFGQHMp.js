import { An as preprocess, At as boolean, Bt as discriminatedUnion, Cr as datetime, En as optional, Et as array, Lt as custom, Nn as record, Rn as string, St as _null, Tn as object, Xn as union, Zn as unknown, dn as literal, fn as looseObject, nn as intersection, wn as number, yt as _enum } from "./schemas-DWUnC6a7.js";
//#region ../../node_modules/.pnpm/@modelcontextprotocol+sdk@1.29.0_zod@4.4.3/node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
var LATEST_PROTOCOL_VERSION = "2025-11-25";
var DEFAULT_NEGOTIATED_PROTOCOL_VERSION = "2025-03-26";
var SUPPORTED_PROTOCOL_VERSIONS = [
	LATEST_PROTOCOL_VERSION,
	"2025-06-18",
	"2025-03-26",
	"2024-11-05",
	"2024-10-07"
];
var RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
/**
* Assert 'object' type schema.
*
* @internal
*/
var AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function"));
/**
* A progress token, used to associate progress notifications with the original request.
*/
var ProgressTokenSchema = union([string(), number().int()]);
/**
* An opaque token used to represent a cursor for pagination.
*/
var CursorSchema = string();
looseObject({
	ttl: number().optional(),
	pollInterval: number().optional()
});
var TaskMetadataSchema = object({ ttl: number().optional() });
/**
* Metadata for associating messages with a task.
* Include this in the `_meta` field under the key `io.modelcontextprotocol/related-task`.
*/
var RelatedTaskMetadataSchema = object({ taskId: string() });
var RequestMetaSchema = looseObject({
	progressToken: ProgressTokenSchema.optional(),
	[RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
});
/**
* Common params for any request.
*/
var BaseRequestParamsSchema = object({ _meta: RequestMetaSchema.optional() });
/**
* Common params for any task-augmented request.
*/
var TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({ task: TaskMetadataSchema.optional() });
/**
* Checks if a value is a valid TaskAugmentedRequestParams.
* @param value - The value to check.
*
* @returns True if the value is a valid TaskAugmentedRequestParams, false otherwise.
*/
var isTaskAugmentedRequestParams = (value) => TaskAugmentedRequestParamsSchema.safeParse(value).success;
var RequestSchema = object({
	method: string(),
	params: BaseRequestParamsSchema.loose().optional()
});
var NotificationsParamsSchema = object({ _meta: RequestMetaSchema.optional() });
var NotificationSchema = object({
	method: string(),
	params: NotificationsParamsSchema.loose().optional()
});
var ResultSchema = looseObject({ _meta: RequestMetaSchema.optional() });
/**
* A uniquely identifying ID for a request in JSON-RPC.
*/
var RequestIdSchema = union([string(), number().int()]);
/**
* A request that expects a response.
*/
var JSONRPCRequestSchema = object({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema,
	...RequestSchema.shape
}).strict();
var isJSONRPCRequest = (value) => JSONRPCRequestSchema.safeParse(value).success;
/**
* A notification which does not expect a response.
*/
var JSONRPCNotificationSchema = object({
	jsonrpc: literal("2.0"),
	...NotificationSchema.shape
}).strict();
var isJSONRPCNotification = (value) => JSONRPCNotificationSchema.safeParse(value).success;
/**
* A successful (non-error) response to a request.
*/
var JSONRPCResultResponseSchema = object({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema,
	result: ResultSchema
}).strict();
/**
* Checks if a value is a valid JSONRPCResultResponse.
* @param value - The value to check.
*
* @returns True if the value is a valid JSONRPCResultResponse, false otherwise.
*/
var isJSONRPCResultResponse = (value) => JSONRPCResultResponseSchema.safeParse(value).success;
/**
* Error codes defined by the JSON-RPC specification.
*/
var ErrorCode;
(function(ErrorCode) {
	ErrorCode[ErrorCode["ConnectionClosed"] = -32e3] = "ConnectionClosed";
	ErrorCode[ErrorCode["RequestTimeout"] = -32001] = "RequestTimeout";
	ErrorCode[ErrorCode["ParseError"] = -32700] = "ParseError";
	ErrorCode[ErrorCode["InvalidRequest"] = -32600] = "InvalidRequest";
	ErrorCode[ErrorCode["MethodNotFound"] = -32601] = "MethodNotFound";
	ErrorCode[ErrorCode["InvalidParams"] = -32602] = "InvalidParams";
	ErrorCode[ErrorCode["InternalError"] = -32603] = "InternalError";
	ErrorCode[ErrorCode["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
})(ErrorCode || (ErrorCode = {}));
/**
* A response to a request that indicates an error occurred.
*/
var JSONRPCErrorResponseSchema = object({
	jsonrpc: literal("2.0"),
	id: RequestIdSchema.optional(),
	error: object({
		code: number().int(),
		message: string(),
		data: unknown().optional()
	})
}).strict();
/**
* Checks if a value is a valid JSONRPCErrorResponse.
* @param value - The value to check.
*
* @returns True if the value is a valid JSONRPCErrorResponse, false otherwise.
*/
var isJSONRPCErrorResponse = (value) => JSONRPCErrorResponseSchema.safeParse(value).success;
var JSONRPCMessageSchema = union([
	JSONRPCRequestSchema,
	JSONRPCNotificationSchema,
	JSONRPCResultResponseSchema,
	JSONRPCErrorResponseSchema
]);
union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
/**
* A response that indicates success but carries no data.
*/
var EmptyResultSchema = ResultSchema.strict();
var CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
	requestId: RequestIdSchema.optional(),
	reason: string().optional()
});
/**
* This notification can be sent by either side to indicate that it is cancelling a previously-issued request.
*
* The request SHOULD still be in-flight, but due to communication latency, it is always possible that this notification MAY arrive after the request has already finished.
*
* This notification indicates that the result will be unused, so any associated processing SHOULD cease.
*
* A client MUST NOT attempt to cancel its `initialize` request.
*/
var CancelledNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/cancelled"),
	params: CancelledNotificationParamsSchema
});
/**
* Icon schema for use in tools, prompts, resources, and implementations.
*/
var IconSchema = object({
	src: string(),
	mimeType: string().optional(),
	sizes: array(string()).optional(),
	theme: _enum(["light", "dark"]).optional()
});
/**
* Base schema to add `icons` property.
*
*/
var IconsSchema = object({ icons: array(IconSchema).optional() });
/**
* Base metadata interface for common properties across resources, tools, prompts, and implementations.
*/
var BaseMetadataSchema = object({
	name: string(),
	title: string().optional()
});
/**
* Describes the name and version of an MCP implementation.
*/
var ImplementationSchema = BaseMetadataSchema.extend({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	version: string(),
	websiteUrl: string().optional(),
	description: string().optional()
});
var ElicitationCapabilitySchema = preprocess((value) => {
	if (value && typeof value === "object" && !Array.isArray(value)) {
		if (Object.keys(value).length === 0) return { form: {} };
	}
	return value;
}, intersection(object({
	form: intersection(object({ applyDefaults: boolean().optional() }), record(string(), unknown())).optional(),
	url: AssertObjectSchema.optional()
}), record(string(), unknown()).optional()));
/**
* Task capabilities for clients, indicating which request types support task creation.
*/
var ClientTasksCapabilitySchema = looseObject({
	list: AssertObjectSchema.optional(),
	cancel: AssertObjectSchema.optional(),
	requests: looseObject({
		sampling: looseObject({ createMessage: AssertObjectSchema.optional() }).optional(),
		elicitation: looseObject({ create: AssertObjectSchema.optional() }).optional()
	}).optional()
});
/**
* Task capabilities for servers, indicating which request types support task creation.
*/
var ServerTasksCapabilitySchema = looseObject({
	list: AssertObjectSchema.optional(),
	cancel: AssertObjectSchema.optional(),
	requests: looseObject({ tools: looseObject({ call: AssertObjectSchema.optional() }).optional() }).optional()
});
/**
* Capabilities a client may support. Known capabilities are defined here, in this schema, but this is not a closed set: any client can define its own, additional capabilities.
*/
var ClientCapabilitiesSchema = object({
	experimental: record(string(), AssertObjectSchema).optional(),
	sampling: object({
		context: AssertObjectSchema.optional(),
		tools: AssertObjectSchema.optional()
	}).optional(),
	elicitation: ElicitationCapabilitySchema.optional(),
	roots: object({ listChanged: boolean().optional() }).optional(),
	tasks: ClientTasksCapabilitySchema.optional(),
	extensions: record(string(), AssertObjectSchema).optional()
});
var InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
	protocolVersion: string(),
	capabilities: ClientCapabilitiesSchema,
	clientInfo: ImplementationSchema
});
/**
* This request is sent from the client to the server when it first connects, asking it to begin initialization.
*/
var InitializeRequestSchema = RequestSchema.extend({
	method: literal("initialize"),
	params: InitializeRequestParamsSchema
});
var isInitializeRequest = (value) => InitializeRequestSchema.safeParse(value).success;
/**
* Capabilities that a server may support. Known capabilities are defined here, in this schema, but this is not a closed set: any server can define its own, additional capabilities.
*/
var ServerCapabilitiesSchema = object({
	experimental: record(string(), AssertObjectSchema).optional(),
	logging: AssertObjectSchema.optional(),
	completions: AssertObjectSchema.optional(),
	prompts: object({ listChanged: boolean().optional() }).optional(),
	resources: object({
		subscribe: boolean().optional(),
		listChanged: boolean().optional()
	}).optional(),
	tools: object({ listChanged: boolean().optional() }).optional(),
	tasks: ServerTasksCapabilitySchema.optional(),
	extensions: record(string(), AssertObjectSchema).optional()
});
/**
* After receiving an initialize request from the client, the server sends this response.
*/
var InitializeResultSchema = ResultSchema.extend({
	protocolVersion: string(),
	capabilities: ServerCapabilitiesSchema,
	serverInfo: ImplementationSchema,
	instructions: string().optional()
});
/**
* This notification is sent from the client to the server after initialization has finished.
*/
var InitializedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/initialized"),
	params: NotificationsParamsSchema.optional()
});
var isInitializedNotification = (value) => InitializedNotificationSchema.safeParse(value).success;
/**
* A ping, issued by either the server or the client, to check that the other party is still alive. The receiver must promptly respond, or else may be disconnected.
*/
var PingRequestSchema = RequestSchema.extend({
	method: literal("ping"),
	params: BaseRequestParamsSchema.optional()
});
var ProgressSchema = object({
	progress: number(),
	total: optional(number()),
	message: optional(string())
});
var ProgressNotificationParamsSchema = object({
	...NotificationsParamsSchema.shape,
	...ProgressSchema.shape,
	progressToken: ProgressTokenSchema
});
/**
* An out-of-band notification used to inform the receiver of a progress update for a long-running request.
*
* @category notifications/progress
*/
var ProgressNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/progress"),
	params: ProgressNotificationParamsSchema
});
var PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({ cursor: CursorSchema.optional() });
var PaginatedRequestSchema = RequestSchema.extend({ params: PaginatedRequestParamsSchema.optional() });
var PaginatedResultSchema = ResultSchema.extend({ nextCursor: CursorSchema.optional() });
/**
* The status of a task.
* */
var TaskStatusSchema = _enum([
	"working",
	"input_required",
	"completed",
	"failed",
	"cancelled"
]);
/**
* A pollable state object associated with a request.
*/
var TaskSchema = object({
	taskId: string(),
	status: TaskStatusSchema,
	ttl: union([number(), _null()]),
	createdAt: string(),
	lastUpdatedAt: string(),
	pollInterval: optional(number()),
	statusMessage: optional(string())
});
/**
* Result returned when a task is created, containing the task data wrapped in a task field.
*/
var CreateTaskResultSchema = ResultSchema.extend({ task: TaskSchema });
/**
* Parameters for task status notification.
*/
var TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
/**
* A notification sent when a task's status changes.
*/
var TaskStatusNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/tasks/status"),
	params: TaskStatusNotificationParamsSchema
});
/**
* A request to get the state of a specific task.
*/
var GetTaskRequestSchema = RequestSchema.extend({
	method: literal("tasks/get"),
	params: BaseRequestParamsSchema.extend({ taskId: string() })
});
/**
* The response to a tasks/get request.
*/
var GetTaskResultSchema = ResultSchema.merge(TaskSchema);
/**
* A request to get the result of a specific task.
*/
var GetTaskPayloadRequestSchema = RequestSchema.extend({
	method: literal("tasks/result"),
	params: BaseRequestParamsSchema.extend({ taskId: string() })
});
ResultSchema.loose();
/**
* A request to list tasks.
*/
var ListTasksRequestSchema = PaginatedRequestSchema.extend({ method: literal("tasks/list") });
/**
* The response to a tasks/list request.
*/
var ListTasksResultSchema = PaginatedResultSchema.extend({ tasks: array(TaskSchema) });
/**
* A request to cancel a specific task.
*/
var CancelTaskRequestSchema = RequestSchema.extend({
	method: literal("tasks/cancel"),
	params: BaseRequestParamsSchema.extend({ taskId: string() })
});
/**
* The response to a tasks/cancel request.
*/
var CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
/**
* The contents of a specific resource or sub-resource.
*/
var ResourceContentsSchema = object({
	uri: string(),
	mimeType: optional(string()),
	_meta: record(string(), unknown()).optional()
});
var TextResourceContentsSchema = ResourceContentsSchema.extend({ text: string() });
/**
* A Zod schema for validating Base64 strings that is more performant and
* robust for very large inputs than the default regex-based check. It avoids
* stack overflows by using the native `atob` function for validation.
*/
var Base64Schema = string().refine((val) => {
	try {
		atob(val);
		return true;
	} catch {
		return false;
	}
}, { message: "Invalid Base64 string" });
var BlobResourceContentsSchema = ResourceContentsSchema.extend({ blob: Base64Schema });
/**
* The sender or recipient of messages and data in a conversation.
*/
var RoleSchema = _enum(["user", "assistant"]);
/**
* Optional annotations providing clients additional context about a resource.
*/
var AnnotationsSchema = object({
	audience: array(RoleSchema).optional(),
	priority: number().min(0).max(1).optional(),
	lastModified: datetime({ offset: true }).optional()
});
/**
* A known resource that the server is capable of reading.
*/
var ResourceSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	uri: string(),
	description: optional(string()),
	mimeType: optional(string()),
	size: optional(number()),
	annotations: AnnotationsSchema.optional(),
	_meta: optional(looseObject({}))
});
/**
* A template description for resources available on the server.
*/
var ResourceTemplateSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	uriTemplate: string(),
	description: optional(string()),
	mimeType: optional(string()),
	annotations: AnnotationsSchema.optional(),
	_meta: optional(looseObject({}))
});
/**
* Sent from the client to request a list of resources the server has.
*/
var ListResourcesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/list") });
/**
* The server's response to a resources/list request from the client.
*/
var ListResourcesResultSchema = PaginatedResultSchema.extend({ resources: array(ResourceSchema) });
/**
* Sent from the client to request a list of resource templates the server has.
*/
var ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({ method: literal("resources/templates/list") });
/**
* The server's response to a resources/templates/list request from the client.
*/
var ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({ resourceTemplates: array(ResourceTemplateSchema) });
var ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({ uri: string() });
/**
* Parameters for a `resources/read` request.
*/
var ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to the server, to read a specific resource URI.
*/
var ReadResourceRequestSchema = RequestSchema.extend({
	method: literal("resources/read"),
	params: ReadResourceRequestParamsSchema
});
/**
* The server's response to a resources/read request from the client.
*/
var ReadResourceResultSchema = ResultSchema.extend({ contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema])) });
/**
* An optional notification from the server to the client, informing it that the list of resources it can read from has changed. This may be issued by servers without any previous subscription from the client.
*/
var ResourceListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/resources/list_changed"),
	params: NotificationsParamsSchema.optional()
});
var SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to request resources/updated notifications from the server whenever a particular resource changes.
*/
var SubscribeRequestSchema = RequestSchema.extend({
	method: literal("resources/subscribe"),
	params: SubscribeRequestParamsSchema
});
var UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
/**
* Sent from the client to request cancellation of resources/updated notifications from the server. This should follow a previous resources/subscribe request.
*/
var UnsubscribeRequestSchema = RequestSchema.extend({
	method: literal("resources/unsubscribe"),
	params: UnsubscribeRequestParamsSchema
});
/**
* Parameters for a `notifications/resources/updated` notification.
*/
var ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({ uri: string() });
/**
* A notification from the server to the client, informing it that a resource has changed and may need to be read again. This should only be sent if the client previously sent a resources/subscribe request.
*/
var ResourceUpdatedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/resources/updated"),
	params: ResourceUpdatedNotificationParamsSchema
});
/**
* Describes an argument that a prompt can accept.
*/
var PromptArgumentSchema = object({
	name: string(),
	description: optional(string()),
	required: optional(boolean())
});
/**
* A prompt or prompt template that the server offers.
*/
var PromptSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	description: optional(string()),
	arguments: optional(array(PromptArgumentSchema)),
	_meta: optional(looseObject({}))
});
/**
* Sent from the client to request a list of prompts and prompt templates the server has.
*/
var ListPromptsRequestSchema = PaginatedRequestSchema.extend({ method: literal("prompts/list") });
/**
* The server's response to a prompts/list request from the client.
*/
var ListPromptsResultSchema = PaginatedResultSchema.extend({ prompts: array(PromptSchema) });
/**
* Parameters for a `prompts/get` request.
*/
var GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
	name: string(),
	arguments: record(string(), string()).optional()
});
/**
* Used by the client to get a prompt provided by the server.
*/
var GetPromptRequestSchema = RequestSchema.extend({
	method: literal("prompts/get"),
	params: GetPromptRequestParamsSchema
});
/**
* Text provided to or from an LLM.
*/
var TextContentSchema = object({
	type: literal("text"),
	text: string(),
	annotations: AnnotationsSchema.optional(),
	_meta: record(string(), unknown()).optional()
});
/**
* An image provided to or from an LLM.
*/
var ImageContentSchema = object({
	type: literal("image"),
	data: Base64Schema,
	mimeType: string(),
	annotations: AnnotationsSchema.optional(),
	_meta: record(string(), unknown()).optional()
});
/**
* An Audio provided to or from an LLM.
*/
var AudioContentSchema = object({
	type: literal("audio"),
	data: Base64Schema,
	mimeType: string(),
	annotations: AnnotationsSchema.optional(),
	_meta: record(string(), unknown()).optional()
});
/**
* A tool call request from an assistant (LLM).
* Represents the assistant's request to use a tool.
*/
var ToolUseContentSchema = object({
	type: literal("tool_use"),
	name: string(),
	id: string(),
	input: record(string(), unknown()),
	_meta: record(string(), unknown()).optional()
});
/**
* The contents of a resource, embedded into a prompt or tool call result.
*/
var EmbeddedResourceSchema = object({
	type: literal("resource"),
	resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
	annotations: AnnotationsSchema.optional(),
	_meta: record(string(), unknown()).optional()
});
/**
* A resource that the server is capable of reading, included in a prompt or tool call result.
*
* Note: resource links returned by tools are not guaranteed to appear in the results of `resources/list` requests.
*/
var ResourceLinkSchema = ResourceSchema.extend({ type: literal("resource_link") });
/**
* A content block that can be used in prompts and tool results.
*/
var ContentBlockSchema = union([
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema,
	ResourceLinkSchema,
	EmbeddedResourceSchema
]);
/**
* Describes a message returned as part of a prompt.
*/
var PromptMessageSchema = object({
	role: RoleSchema,
	content: ContentBlockSchema
});
/**
* The server's response to a prompts/get request from the client.
*/
var GetPromptResultSchema = ResultSchema.extend({
	description: string().optional(),
	messages: array(PromptMessageSchema)
});
/**
* An optional notification from the server to the client, informing it that the list of prompts it offers has changed. This may be issued by servers without any previous subscription from the client.
*/
var PromptListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/prompts/list_changed"),
	params: NotificationsParamsSchema.optional()
});
/**
* Additional properties describing a Tool to clients.
*
* NOTE: all properties in ToolAnnotations are **hints**.
* They are not guaranteed to provide a faithful description of
* tool behavior (including descriptive properties like `title`).
*
* Clients should never make tool use decisions based on ToolAnnotations
* received from untrusted servers.
*/
var ToolAnnotationsSchema = object({
	title: string().optional(),
	readOnlyHint: boolean().optional(),
	destructiveHint: boolean().optional(),
	idempotentHint: boolean().optional(),
	openWorldHint: boolean().optional()
});
/**
* Execution-related properties for a tool.
*/
var ToolExecutionSchema = object({ taskSupport: _enum([
	"required",
	"optional",
	"forbidden"
]).optional() });
/**
* Definition for a tool the client can call.
*/
var ToolSchema = object({
	...BaseMetadataSchema.shape,
	...IconsSchema.shape,
	description: string().optional(),
	inputSchema: object({
		type: literal("object"),
		properties: record(string(), AssertObjectSchema).optional(),
		required: array(string()).optional()
	}).catchall(unknown()),
	outputSchema: object({
		type: literal("object"),
		properties: record(string(), AssertObjectSchema).optional(),
		required: array(string()).optional()
	}).catchall(unknown()).optional(),
	annotations: ToolAnnotationsSchema.optional(),
	execution: ToolExecutionSchema.optional(),
	_meta: record(string(), unknown()).optional()
});
/**
* Sent from the client to request a list of tools the server has.
*/
var ListToolsRequestSchema = PaginatedRequestSchema.extend({ method: literal("tools/list") });
/**
* The server's response to a tools/list request from the client.
*/
var ListToolsResultSchema = PaginatedResultSchema.extend({ tools: array(ToolSchema) });
/**
* The server's response to a tool call.
*/
var CallToolResultSchema = ResultSchema.extend({
	content: array(ContentBlockSchema).default([]),
	structuredContent: record(string(), unknown()).optional(),
	isError: boolean().optional()
});
CallToolResultSchema.or(ResultSchema.extend({ toolResult: unknown() }));
/**
* Parameters for a `tools/call` request.
*/
var CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	name: string(),
	arguments: record(string(), unknown()).optional()
});
/**
* Used by the client to invoke a tool provided by the server.
*/
var CallToolRequestSchema = RequestSchema.extend({
	method: literal("tools/call"),
	params: CallToolRequestParamsSchema
});
/**
* An optional notification from the server to the client, informing it that the list of tools it offers has changed. This may be issued by servers without any previous subscription from the client.
*/
var ToolListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/tools/list_changed"),
	params: NotificationsParamsSchema.optional()
});
/**
* Base schema for list changed subscription options (without callback).
* Used internally for Zod validation of autoRefresh and debounceMs.
*/
var ListChangedOptionsBaseSchema = object({
	autoRefresh: boolean().default(true),
	debounceMs: number().int().nonnegative().default(300)
});
/**
* The severity of a log message.
*/
var LoggingLevelSchema = _enum([
	"debug",
	"info",
	"notice",
	"warning",
	"error",
	"critical",
	"alert",
	"emergency"
]);
/**
* Parameters for a `logging/setLevel` request.
*/
var SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({ level: LoggingLevelSchema });
/**
* A request from the client to the server, to enable or adjust logging.
*/
var SetLevelRequestSchema = RequestSchema.extend({
	method: literal("logging/setLevel"),
	params: SetLevelRequestParamsSchema
});
/**
* Parameters for a `notifications/message` notification.
*/
var LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
	level: LoggingLevelSchema,
	logger: string().optional(),
	data: unknown()
});
/**
* Notification of a log message passed from server to client. If no logging/setLevel request has been sent from the client, the server MAY decide which messages to send automatically.
*/
var LoggingMessageNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/message"),
	params: LoggingMessageNotificationParamsSchema
});
/**
* Hints to use for model selection.
*/
var ModelHintSchema = object({ name: string().optional() });
/**
* The server's preferences for model selection, requested of the client during sampling.
*/
var ModelPreferencesSchema = object({
	hints: array(ModelHintSchema).optional(),
	costPriority: number().min(0).max(1).optional(),
	speedPriority: number().min(0).max(1).optional(),
	intelligencePriority: number().min(0).max(1).optional()
});
/**
* Controls tool usage behavior in sampling requests.
*/
var ToolChoiceSchema = object({ mode: _enum([
	"auto",
	"required",
	"none"
]).optional() });
/**
* The result of a tool execution, provided by the user (server).
* Represents the outcome of invoking a tool requested via ToolUseContent.
*/
var ToolResultContentSchema = object({
	type: literal("tool_result"),
	toolUseId: string().describe("The unique identifier for the corresponding tool call."),
	content: array(ContentBlockSchema).default([]),
	structuredContent: object({}).loose().optional(),
	isError: boolean().optional(),
	_meta: record(string(), unknown()).optional()
});
/**
* Basic content types for sampling responses (without tool use).
* Used for backwards-compatible CreateMessageResult when tools are not used.
*/
var SamplingContentSchema = discriminatedUnion("type", [
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema
]);
/**
* Content block types allowed in sampling messages.
* This includes text, image, audio, tool use requests, and tool results.
*/
var SamplingMessageContentBlockSchema = discriminatedUnion("type", [
	TextContentSchema,
	ImageContentSchema,
	AudioContentSchema,
	ToolUseContentSchema,
	ToolResultContentSchema
]);
/**
* Describes a message issued to or received from an LLM API.
*/
var SamplingMessageSchema = object({
	role: RoleSchema,
	content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
	_meta: record(string(), unknown()).optional()
});
/**
* Parameters for a `sampling/createMessage` request.
*/
var CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	messages: array(SamplingMessageSchema),
	modelPreferences: ModelPreferencesSchema.optional(),
	systemPrompt: string().optional(),
	includeContext: _enum([
		"none",
		"thisServer",
		"allServers"
	]).optional(),
	temperature: number().optional(),
	maxTokens: number().int(),
	stopSequences: array(string()).optional(),
	metadata: AssertObjectSchema.optional(),
	tools: array(ToolSchema).optional(),
	toolChoice: ToolChoiceSchema.optional()
});
/**
* A request from the server to sample an LLM via the client. The client has full discretion over which model to select. The client should also inform the user before beginning sampling, to allow them to inspect the request (human in the loop) and decide whether to approve it.
*/
var CreateMessageRequestSchema = RequestSchema.extend({
	method: literal("sampling/createMessage"),
	params: CreateMessageRequestParamsSchema
});
/**
* The client's response to a sampling/create_message request from the server.
* This is the backwards-compatible version that returns single content (no arrays).
* Used when the request does not include tools.
*/
var CreateMessageResultSchema = ResultSchema.extend({
	model: string(),
	stopReason: optional(_enum([
		"endTurn",
		"stopSequence",
		"maxTokens"
	]).or(string())),
	role: RoleSchema,
	content: SamplingContentSchema
});
/**
* The client's response to a sampling/create_message request when tools were provided.
* This version supports array content for tool use flows.
*/
var CreateMessageResultWithToolsSchema = ResultSchema.extend({
	model: string(),
	stopReason: optional(_enum([
		"endTurn",
		"stopSequence",
		"maxTokens",
		"toolUse"
	]).or(string())),
	role: RoleSchema,
	content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
});
/**
* Primitive schema definition for boolean fields.
*/
var BooleanSchemaSchema = object({
	type: literal("boolean"),
	title: string().optional(),
	description: string().optional(),
	default: boolean().optional()
});
/**
* Primitive schema definition for string fields.
*/
var StringSchemaSchema = object({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	minLength: number().optional(),
	maxLength: number().optional(),
	format: _enum([
		"email",
		"uri",
		"date",
		"date-time"
	]).optional(),
	default: string().optional()
});
/**
* Primitive schema definition for number fields.
*/
var NumberSchemaSchema = object({
	type: _enum(["number", "integer"]),
	title: string().optional(),
	description: string().optional(),
	minimum: number().optional(),
	maximum: number().optional(),
	default: number().optional()
});
/**
* Schema for single-selection enumeration without display titles for options.
*/
var UntitledSingleSelectEnumSchemaSchema = object({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	enum: array(string()),
	default: string().optional()
});
/**
* Schema for single-selection enumeration with display titles for each option.
*/
var TitledSingleSelectEnumSchemaSchema = object({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	oneOf: array(object({
		const: string(),
		title: string()
	})),
	default: string().optional()
});
/**
* Use TitledSingleSelectEnumSchema instead.
* This interface will be removed in a future version.
*/
var LegacyTitledEnumSchemaSchema = object({
	type: literal("string"),
	title: string().optional(),
	description: string().optional(),
	enum: array(string()),
	enumNames: array(string()).optional(),
	default: string().optional()
});
var SingleSelectEnumSchemaSchema = union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]);
/**
* Schema for multiple-selection enumeration without display titles for options.
*/
var UntitledMultiSelectEnumSchemaSchema = object({
	type: literal("array"),
	title: string().optional(),
	description: string().optional(),
	minItems: number().optional(),
	maxItems: number().optional(),
	items: object({
		type: literal("string"),
		enum: array(string())
	}),
	default: array(string()).optional()
});
/**
* Schema for multiple-selection enumeration with display titles for each option.
*/
var TitledMultiSelectEnumSchemaSchema = object({
	type: literal("array"),
	title: string().optional(),
	description: string().optional(),
	minItems: number().optional(),
	maxItems: number().optional(),
	items: object({ anyOf: array(object({
		const: string(),
		title: string()
	})) }),
	default: array(string()).optional()
});
/**
* Combined schema for multiple-selection enumeration
*/
var MultiSelectEnumSchemaSchema = union([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema]);
/**
* Primitive schema definition for enum fields.
*/
var EnumSchemaSchema = union([
	LegacyTitledEnumSchemaSchema,
	SingleSelectEnumSchemaSchema,
	MultiSelectEnumSchemaSchema
]);
/**
* Union of all primitive schema definitions.
*/
var PrimitiveSchemaDefinitionSchema = union([
	EnumSchemaSchema,
	BooleanSchemaSchema,
	StringSchemaSchema,
	NumberSchemaSchema
]);
/**
* Parameters for an `elicitation/create` request for form-based elicitation.
*/
var ElicitRequestFormParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	mode: literal("form").optional(),
	message: string(),
	requestedSchema: object({
		type: literal("object"),
		properties: record(string(), PrimitiveSchemaDefinitionSchema),
		required: array(string()).optional()
	})
});
/**
* Parameters for an `elicitation/create` request for URL-based elicitation.
*/
var ElicitRequestURLParamsSchema = TaskAugmentedRequestParamsSchema.extend({
	mode: literal("url"),
	message: string(),
	elicitationId: string(),
	url: string().url()
});
/**
* The parameters for a request to elicit additional information from the user via the client.
*/
var ElicitRequestParamsSchema = union([ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema]);
/**
* A request from the server to elicit user input via the client.
* The client should present the message and form fields to the user (form mode)
* or navigate to a URL (URL mode).
*/
var ElicitRequestSchema = RequestSchema.extend({
	method: literal("elicitation/create"),
	params: ElicitRequestParamsSchema
});
/**
* Parameters for a `notifications/elicitation/complete` notification.
*
* @category notifications/elicitation/complete
*/
var ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({ elicitationId: string() });
/**
* A notification from the server to the client, informing it of a completion of an out-of-band elicitation request.
*
* @category notifications/elicitation/complete
*/
var ElicitationCompleteNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/elicitation/complete"),
	params: ElicitationCompleteNotificationParamsSchema
});
/**
* The client's response to an elicitation/create request from the server.
*/
var ElicitResultSchema = ResultSchema.extend({
	action: _enum([
		"accept",
		"decline",
		"cancel"
	]),
	content: preprocess((val) => val === null ? void 0 : val, record(string(), union([
		string(),
		number(),
		boolean(),
		array(string())
	])).optional())
});
/**
* A reference to a resource or resource template definition.
*/
var ResourceTemplateReferenceSchema = object({
	type: literal("ref/resource"),
	uri: string()
});
/**
* Identifies a prompt.
*/
var PromptReferenceSchema = object({
	type: literal("ref/prompt"),
	name: string()
});
/**
* Parameters for a `completion/complete` request.
*/
var CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
	ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
	argument: object({
		name: string(),
		value: string()
	}),
	context: object({ arguments: record(string(), string()).optional() }).optional()
});
/**
* A request from the client to the server, to ask for completion options.
*/
var CompleteRequestSchema = RequestSchema.extend({
	method: literal("completion/complete"),
	params: CompleteRequestParamsSchema
});
/**
* The server's response to a completion/complete request
*/
var CompleteResultSchema = ResultSchema.extend({ completion: looseObject({
	values: array(string()).max(100),
	total: optional(number().int()),
	hasMore: optional(boolean())
}) });
/**
* Represents a root directory or file that the server can operate on.
*/
var RootSchema = object({
	uri: string().startsWith("file://"),
	name: string().optional(),
	_meta: record(string(), unknown()).optional()
});
/**
* Sent from the server to request a list of root URIs from the client.
*/
var ListRootsRequestSchema = RequestSchema.extend({
	method: literal("roots/list"),
	params: BaseRequestParamsSchema.optional()
});
/**
* The client's response to a roots/list request from the server.
*/
var ListRootsResultSchema = ResultSchema.extend({ roots: array(RootSchema) });
/**
* A notification from the client to the server, informing it that the list of roots has changed.
*/
var RootsListChangedNotificationSchema = NotificationSchema.extend({
	method: literal("notifications/roots/list_changed"),
	params: NotificationsParamsSchema.optional()
});
union([
	PingRequestSchema,
	InitializeRequestSchema,
	CompleteRequestSchema,
	SetLevelRequestSchema,
	GetPromptRequestSchema,
	ListPromptsRequestSchema,
	ListResourcesRequestSchema,
	ListResourceTemplatesRequestSchema,
	ReadResourceRequestSchema,
	SubscribeRequestSchema,
	UnsubscribeRequestSchema,
	CallToolRequestSchema,
	ListToolsRequestSchema,
	GetTaskRequestSchema,
	GetTaskPayloadRequestSchema,
	ListTasksRequestSchema,
	CancelTaskRequestSchema
]);
union([
	CancelledNotificationSchema,
	ProgressNotificationSchema,
	InitializedNotificationSchema,
	RootsListChangedNotificationSchema,
	TaskStatusNotificationSchema
]);
union([
	EmptyResultSchema,
	CreateMessageResultSchema,
	CreateMessageResultWithToolsSchema,
	ElicitResultSchema,
	ListRootsResultSchema,
	GetTaskResultSchema,
	ListTasksResultSchema,
	CreateTaskResultSchema
]);
union([
	PingRequestSchema,
	CreateMessageRequestSchema,
	ElicitRequestSchema,
	ListRootsRequestSchema,
	GetTaskRequestSchema,
	GetTaskPayloadRequestSchema,
	ListTasksRequestSchema,
	CancelTaskRequestSchema
]);
union([
	CancelledNotificationSchema,
	ProgressNotificationSchema,
	LoggingMessageNotificationSchema,
	ResourceUpdatedNotificationSchema,
	ResourceListChangedNotificationSchema,
	ToolListChangedNotificationSchema,
	PromptListChangedNotificationSchema,
	TaskStatusNotificationSchema,
	ElicitationCompleteNotificationSchema
]);
union([
	EmptyResultSchema,
	InitializeResultSchema,
	CompleteResultSchema,
	GetPromptResultSchema,
	ListPromptsResultSchema,
	ListResourcesResultSchema,
	ListResourceTemplatesResultSchema,
	ReadResourceResultSchema,
	CallToolResultSchema,
	ListToolsResultSchema,
	GetTaskResultSchema,
	ListTasksResultSchema,
	CreateTaskResultSchema
]);
var McpError = class McpError extends Error {
	constructor(code, message, data) {
		super(`MCP error ${code}: ${message}`);
		this.code = code;
		this.data = data;
		this.name = "McpError";
	}
	/**
	* Factory method to create the appropriate error type based on the error code and data
	*/
	static fromError(code, message, data) {
		if (code === ErrorCode.UrlElicitationRequired && data) {
			const errorData = data;
			if (errorData.elicitations) return new UrlElicitationRequiredError(errorData.elicitations, message);
		}
		return new McpError(code, message, data);
	}
};
/**
* Specialized error type when a tool requires a URL mode elicitation.
* This makes it nicer for the client to handle since there is specific data to work with instead of just a code to check against.
*/
var UrlElicitationRequiredError = class extends McpError {
	constructor(elicitations, message = `URL elicitation${elicitations.length > 1 ? "s" : ""} required`) {
		super(ErrorCode.UrlElicitationRequired, message, { elicitations });
	}
	get elicitations() {
		return this.data?.elicitations ?? [];
	}
};
//#endregion
export { JSONRPCNotificationSchema as $, ResourceTemplateSchema as $t, ElicitResultSchema as A, ToolExecutionSchema as An, PrimitiveSchemaDefinitionSchema as At, GetTaskPayloadRequestSchema as B, isInitializeRequest as Bn, RELATED_TASK_META_KEY as Bt, CreateTaskResultSchema as C, TaskStatusSchema as Cn, MultiSelectEnumSchemaSchema as Ct, ElicitRequestParamsSchema as D, TitledSingleSelectEnumSchemaSchema as Dn, PaginatedRequestSchema as Dt, ElicitRequestFormParamsSchema as E, TitledMultiSelectEnumSchemaSchema as En, PaginatedRequestParamsSchema as Et, EnumSchemaSchema as F, UnsubscribeRequestParamsSchema as Fn, PromptArgumentSchema as Ft, ImageContentSchema as G, isJSONRPCResultResponse as Gn, RequestIdSchema as Gt, GetTaskResultSchema as H, isJSONRPCErrorResponse as Hn, ReadResourceRequestSchema as Ht, ErrorCode as I, UnsubscribeRequestSchema as In, PromptListChangedNotificationSchema as It, InitializeRequestSchema as J, ResourceLinkSchema as Jt, ImplementationSchema as K, isTaskAugmentedRequestParams as Kn, RequestSchema as Kt, GetPromptRequestParamsSchema as L, UntitledMultiSelectEnumSchemaSchema as Ln, PromptMessageSchema as Lt, ElicitationCompleteNotificationSchema as M, ToolResultContentSchema as Mn, ProgressNotificationSchema as Mt, EmbeddedResourceSchema as N, ToolSchema as Nn, ProgressSchema as Nt, ElicitRequestSchema as O, ToolAnnotationsSchema as On, PaginatedResultSchema as Ot, EmptyResultSchema as P, ToolUseContentSchema as Pn, ProgressTokenSchema as Pt, JSONRPCMessageSchema as Q, ResourceTemplateReferenceSchema as Qt, GetPromptRequestSchema as R, UntitledSingleSelectEnumSchemaSchema as Rn, PromptReferenceSchema as Rt, CreateMessageResultWithToolsSchema as S, TaskStatusNotificationSchema as Sn, ModelPreferencesSchema as St, DEFAULT_NEGOTIATED_PROTOCOL_VERSION as T, TextResourceContentsSchema as Tn, NumberSchemaSchema as Tt, IconSchema as U, isJSONRPCNotification as Un, ReadResourceResultSchema as Ut, GetTaskRequestSchema as V, isInitializedNotification as Vn, ReadResourceRequestParamsSchema as Vt, IconsSchema as W, isJSONRPCRequest as Wn, RelatedTaskMetadataSchema as Wt, InitializedNotificationSchema as X, ResourceRequestParamsSchema as Xt, InitializeResultSchema as Y, ResourceListChangedNotificationSchema as Yt, JSONRPCErrorResponseSchema as Z, ResourceSchema as Zt, CompleteResultSchema as _, SubscribeRequestSchema as _n, LoggingLevelSchema as _t, BooleanSchemaSchema as a, RootsListChangedNotificationSchema as an, ListPromptsRequestSchema as at, CreateMessageRequestSchema as b, TaskSchema as bn, McpError as bt, CallToolResultSchema as c, SamplingMessageContentBlockSchema as cn, ListResourceTemplatesResultSchema as ct, CancelledNotificationParamsSchema as d, ServerTasksCapabilitySchema as dn, ListRootsRequestSchema as dt, ResourceUpdatedNotificationParamsSchema as en, JSONRPCRequestSchema as et, CancelledNotificationSchema as f, SetLevelRequestParamsSchema as fn, ListRootsResultSchema as ft, CompleteRequestSchema as g, SubscribeRequestParamsSchema as gn, ListToolsResultSchema as gt, CompleteRequestParamsSchema as h, StringSchemaSchema as hn, ListToolsRequestSchema as ht, BlobResourceContentsSchema as i, RootSchema as in, ListChangedOptionsBaseSchema as it, ElicitationCompleteNotificationParamsSchema as j, ToolListChangedNotificationSchema as jn, ProgressNotificationParamsSchema as jt, ElicitRequestURLParamsSchema as k, ToolChoiceSchema as kn, PingRequestSchema as kt, CancelTaskRequestSchema as l, SamplingMessageSchema as ln, ListResourcesRequestSchema as lt, ClientTasksCapabilitySchema as m, SingleSelectEnumSchemaSchema as mn, ListTasksResultSchema as mt, AudioContentSchema as n, ResultSchema as nn, LATEST_PROTOCOL_VERSION as nt, CallToolRequestParamsSchema as o, SUPPORTED_PROTOCOL_VERSIONS as on, ListPromptsResultSchema as ot, ClientCapabilitiesSchema as p, SetLevelRequestSchema as pn, ListTasksRequestSchema as pt, InitializeRequestParamsSchema as q, ResourceContentsSchema as qt, BaseMetadataSchema as r, RoleSchema as rn, LegacyTitledEnumSchemaSchema as rt, CallToolRequestSchema as s, SamplingContentSchema as sn, ListResourceTemplatesRequestSchema as st, AnnotationsSchema as t, ResourceUpdatedNotificationSchema as tn, JSONRPCResultResponseSchema as tt, CancelTaskResultSchema as u, ServerCapabilitiesSchema as un, ListResourcesResultSchema as ut, ContentBlockSchema as v, TaskAugmentedRequestParamsSchema as vn, LoggingMessageNotificationParamsSchema as vt, CursorSchema as w, TextContentSchema as wn, NotificationSchema as wt, CreateMessageResultSchema as x, TaskStatusNotificationParamsSchema as xn, ModelHintSchema as xt, CreateMessageRequestParamsSchema as y, TaskMetadataSchema as yn, LoggingMessageNotificationSchema as yt, GetPromptResultSchema as z, UrlElicitationRequiredError as zn, PromptSchema as zt };
