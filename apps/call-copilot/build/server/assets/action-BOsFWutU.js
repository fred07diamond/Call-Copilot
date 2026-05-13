//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/action.js
/**
* Throw from an action when the agent should stop the current turn instead of
* feeding the failure back to the model for another retry.
*/
var AgentActionStopError = class extends Error {
	agentNativeStop = true;
	errorCode;
	toolResult;
	constructor(message, options = {}) {
		super(message);
		this.name = "AgentActionStopError";
		this.errorCode = options.errorCode;
		this.toolResult = options.toolResult;
	}
};
function isAgentActionStopError(err) {
	return err instanceof AgentActionStopError || Boolean(err && typeof err === "object" && "agentNativeStop" in err && err.agentNativeStop === true);
}
function defineAction(options) {
	const hasSchema = options.schema && "~standard" in options.schema;
	let toolParameters;
	if (hasSchema) toolParameters = schemaToJsonSchema(options.schema, options.description);
	else if (options.parameters) toolParameters = {
		type: "object",
		properties: options.parameters
	};
	const run = hasSchema ? wrapWithValidation(options.schema, options.run, toolParameters) : options.run;
	const httpConfig = options.http;
	const inferredReadOnly = httpConfig !== false && httpConfig !== void 0 && httpConfig.method === "GET";
	const readOnly = typeof options.readOnly === "boolean" ? options.readOnly : inferredReadOnly ? true : void 0;
	const toolCallable = typeof options.toolCallable === "boolean" ? options.toolCallable : void 0;
	const parallelSafe = typeof options.parallelSafe === "boolean" ? options.parallelSafe : void 0;
	return {
		tool: {
			description: options.description,
			parameters: toolParameters
		},
		run,
		...hasSchema ? { schema: options.schema } : {},
		...options.http !== void 0 ? { http: options.http } : {},
		...typeof readOnly === "boolean" ? { readOnly } : {},
		...typeof parallelSafe === "boolean" ? { parallelSafe } : {},
		...typeof toolCallable === "boolean" ? { toolCallable } : {}
	};
}
/**
* Convert a Standard Schema to JSON Schema for the Claude API.
* Tries vendor-specific toJSONSchema first (Zod v4), then falls back
* to a basic introspection of the schema shape.
*/
function schemaToJsonSchema(schema, _description) {
	const s = schema;
	if (s["~standard"]?.jsonSchema?.input) try {
		const result = s["~standard"].jsonSchema.input({ target: "draft-07" });
		if (result && typeof result === "object") delete result.$schema;
		return result;
	} catch {}
	if (s._zod?.def) return zodDefToJsonSchema(s._zod.def);
	return {
		type: "object",
		properties: {}
	};
}
/**
* Convert a Zod v4 internal def to JSON Schema.
* Handles the common types used in action parameters.
*/
function zodDefToJsonSchema(def) {
	const type = def.type;
	if (type === "object") {
		const properties = {};
		const required = [];
		const shape = def.shape;
		if (shape) for (const [key, fieldSchema] of Object.entries(shape)) {
			const fieldDef = fieldSchema?._zod?.def;
			if (fieldDef) {
				const prop = zodDefToJsonSchema(fieldDef);
				const desc = fieldSchema?.description;
				if (desc && !prop.description) prop.description = desc;
				properties[key] = prop;
				if (fieldDef.type !== "optional" && fieldDef.type !== "default") required.push(key);
			}
		}
		const result = {
			type: "object",
			properties
		};
		if (required.length > 0) result.required = required;
		return result;
	}
	if (type === "string") {
		const result = { type: "string" };
		if (def.description) result.description = def.description;
		return result;
	}
	if (type === "number" || type === "float" || type === "int") {
		const result = { type: type === "int" ? "integer" : "number" };
		if (def.description) result.description = def.description;
		return result;
	}
	if (type === "boolean") {
		const result = { type: "boolean" };
		if (def.description) result.description = def.description;
		return result;
	}
	if (type === "enum") {
		const entries = def.entries;
		const result = {
			type: "string",
			enum: Array.isArray(entries) ? entries : typeof entries === "object" && entries !== null ? Object.values(entries) : entries
		};
		if (def.description) result.description = def.description;
		return result;
	}
	if (type === "literal") return {
		type: typeof def.value,
		enum: [def.value]
	};
	if (type === "array") {
		const result = { type: "array" };
		if (def.element?._zod?.def) result.items = zodDefToJsonSchema(def.element._zod.def);
		if (def.description) result.description = def.description;
		return result;
	}
	if (type === "optional") {
		if (def.innerType?._zod?.def) return zodDefToJsonSchema(def.innerType._zod.def);
	}
	if (type === "default") {
		if (def.innerType?._zod?.def) {
			const inner = zodDefToJsonSchema(def.innerType._zod.def);
			inner.default = typeof def.defaultValue === "function" ? def.defaultValue() : def.defaultValue;
			return inner;
		}
	}
	if (type === "nullable") {
		if (def.innerType?._zod?.def) return zodDefToJsonSchema(def.innerType._zod.def);
	}
	if (type === "union") {
		if (def.options?.length) {
			if (def.options.every((o) => o?._zod?.def?.type === "literal")) return {
				type: "string",
				enum: def.options.map((o) => o._zod.def.value)
			};
			return { anyOf: def.options.map((o) => zodDefToJsonSchema(o._zod?.def ?? {})) };
		}
	}
	return { type: "string" };
}
/**
* Wrap an action's run function with schema validation.
* Invalid inputs get a clear error message (including what was actually passed)
* so the agent can see its own mistake and correct it on the next turn.
*/
function wrapWithValidation(schema, run, toolParameters) {
	return async (args) => {
		const result = await schema["~standard"].validate(args);
		if (result.issues) {
			const missing = [];
			const other = [];
			for (const issue of result.issues) {
				const pathStr = issue.path ? issue.path.map((p) => typeof p === "object" ? p.key : p).join(".") : "";
				const msg = String(issue.message ?? "");
				if (pathStr && (msg === "Required" || /invalid.*undefined/i.test(msg) || /expected.*received undefined/i.test(msg))) missing.push(pathStr);
				else other.push(pathStr ? `${pathStr}: ${msg}` : msg);
			}
			const parts = [];
			if (missing.length > 0) parts.push(`Missing required parameter${missing.length === 1 ? "" : "s"}: ${missing.join(", ")}`);
			if (other.length > 0) parts.push(other.join("; "));
			let received;
			try {
				received = JSON.stringify(args);
				if (received.length > 500) received = received.slice(0, 500) + "…";
			} catch {
				received = String(args);
			}
			let expected = "";
			if (toolParameters?.properties) {
				const required = new Set(toolParameters.required ?? []);
				const sig = Object.entries(toolParameters.properties).map(([k, v]) => {
					return `${k}${required.has(k) ? "*" : "?"}: ${v.type ?? "any"}`;
				}).join(", ");
				if (sig) expected = ` Expected: { ${sig} } (where * = required, ? = optional).`;
			}
			throw new Error(`Invalid action parameters — ${parts.join(". ")}. Received: ${received}.${expected}`);
		}
		return run(result.value);
	};
}
//#endregion
export { isAgentActionStopError as n, defineAction as t };
