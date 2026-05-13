//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/onboarding/registry.js
/**
* In-process registry of onboarding steps.
*
* Templates (or the framework itself) call `registerOnboardingStep` at module
* load time — typically from a server plugin. The onboarding HTTP routes read
* from this registry on every request so overrides and late-registered steps
* are picked up without a restart.
*/
var steps = /* @__PURE__ */ new Map();
/**
* Register (or override) an onboarding step.
*
* Subsequent registrations with the same `id` replace the previous definition
* — templates can override framework defaults this way.
*/
function registerOnboardingStep(step) {
	if (!step || typeof step.id !== "string" || !step.id) throw new Error("registerOnboardingStep: step.id is required");
	if (steps.has(step.id)) {
		if (process.env.DEBUG) console.log(`[agent-native] Overriding onboarding step "${step.id}" with new registration.`);
	}
	steps.set(step.id, step);
}
/**
* Return all registered onboarding steps, sorted by `order` ascending.
* Ties are broken by registration order (insertion order).
*/
function listOnboardingSteps() {
	return Array.from(steps.values()).sort((a, b) => a.order - b.order);
}
//#endregion
export { registerOnboardingStep as n, listOnboardingSteps as t };
