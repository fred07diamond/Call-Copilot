import { Nn as record, Rn as string, Tn as object, Zn as unknown, wn as number } from "./schemas-DWUnC6a7.js";
import { randomUUID } from "node:crypto";
import { EventEmitter } from "node:events";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/event-bus/registry.js
/**
* In-process registry of event definitions.
*
* Integrations and templates call `registerEvent()` at module load to declare
* the event types they emit. The bus uses these definitions to validate
* payloads, and the Automations UI lists them so users can build triggers.
*/
var REGISTRY_KEY = Symbol.for("@agent-native/core/event-bus.registry");
var registry = globalThis[REGISTRY_KEY] ??= /* @__PURE__ */ new Map();
/**
* Register (or replace) an event definition.
*
* Subsequent registrations with the same `name` replace the previous
* definition — later plugins can override built-in defaults.
*/
function registerEvent(def) {
	if (!def || typeof def.name !== "string" || !def.name) throw new Error("registerEvent: def.name is required");
	if (typeof def.description !== "string" || !def.description) throw new Error("registerEvent: def.description is required");
	if (!def.payloadSchema) throw new Error("registerEvent: def.payloadSchema is required");
	registry.set(def.name, def);
}
/** Return all registered events in registration order. */
function listEvents() {
	return Array.from(registry.values());
}
/** Look up a single registered event by name. */
function getEvent(name) {
	return registry.get(name);
}
function registerBuiltInEvents() {
	registerEvent({
		name: "test.event.fired",
		description: "Developer test event — fired manually from the Automations UI or via the test-event action.",
		payloadSchema: object({ data: record(string(), unknown()).optional() }).optional()
	});
	registerEvent({
		name: "agent.turn.completed",
		description: "Fires after the agent completes a conversational turn.",
		payloadSchema: object({
			threadId: string().optional(),
			turnIndex: number().optional(),
			model: string().optional()
		})
	});
}
registerBuiltInEvents();
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_d8cd0b9ea502c97d2f2b6c28b2fc9a81/node_modules/@agent-native/core/dist/event-bus/bus.js
/**
* Typed pub/sub bus for framework events.
*
* Wraps Node's EventEmitter with payload validation against the registered
* Standard Schema for each event. Handler errors are caught and logged so a
* misbehaving subscriber can never crash the emitter.
*/
var BUS_KEY = Symbol.for("@agent-native/core/event-bus.bus");
function getBus() {
	const g = globalThis;
	if (!g[BUS_KEY]) {
		const emitter = new EventEmitter();
		emitter.setMaxListeners(0);
		g[BUS_KEY] = {
			emitter,
			subscriptions: /* @__PURE__ */ new Map()
		};
	}
	return g[BUS_KEY];
}
function subscribe(event, handler) {
	if (typeof event !== "string" || !event) throw new Error("subscribe: event name is required");
	if (typeof handler !== "function") throw new Error("subscribe: handler must be a function");
	const bus = getBus();
	const id = randomUUID();
	bus.subscriptions.set(id, {
		event,
		handler
	});
	bus.emitter.on(event, handler);
	return id;
}
function emit(event, payload, meta) {
	if (typeof event !== "string" || !event) throw new Error("emit: event name is required");
	const bus = getBus();
	const def = getEvent(event);
	let validated = payload;
	if (def) {
		const result = def.payloadSchema["~standard"].validate(payload);
		if (result instanceof Promise) console.warn(`[event-bus] Payload schema for "${event}" returned a Promise — async validation is not supported. Dispatching unvalidated payload.`);
		else if (result.issues) {
			console.warn(`[event-bus] Payload validation failed for "${event}":`, result.issues);
			return;
		} else validated = result.value;
	} else console.warn(`[event-bus] Emitting unregistered event "${event}". Call registerEvent() to declare it.`);
	const fullMeta = {
		eventId: meta?.eventId ?? randomUUID(),
		emittedAt: meta?.emittedAt ?? (/* @__PURE__ */ new Date()).toISOString(),
		owner: meta?.owner
	};
	const listeners = bus.emitter.listeners(event);
	for (const listener of listeners) try {
		const r = listener(validated, fullMeta);
		if (r && typeof r.catch === "function") r.catch((err) => {
			console.error(`[event-bus] Async handler for "${event}" rejected:`, err);
		});
	} catch (err) {
		console.error(`[event-bus] Handler for "${event}" threw:`, err);
	}
}
//#endregion
export { registerEvent as a, listEvents as i, subscribe as n, getEvent as r, emit as t };
