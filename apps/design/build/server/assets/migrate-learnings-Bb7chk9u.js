import { o as getRequestUserEmail } from "./request-context-Ci6C_Mch.js";
import { t as fail } from "./utils-Dd6V9pzd.js";
import { d as resourcePut } from "./store--irHLonY.js";
import path from "path";
import fs from "fs";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/scripts/resources/migrate-learnings.js
/**
* Core script: migrate-learnings
*
* Migrate a learnings.md file from the project root into the SQL resource store.
*
* Usage:
*   pnpm action migrate-learnings
*/
async function migrateLearningsScript(args) {
	const filePath = path.resolve(process.cwd(), "learnings.md");
	if (!fs.existsSync(filePath)) {
		console.log("No learnings.md found");
		return;
	}
	const content = fs.readFileSync(filePath, "utf-8");
	const owner = getRequestUserEmail() ?? process.env.AGENT_USER_EMAIL;
	if (!owner) fail("migrate-learnings requires an authenticated user (request context or AGENT_USER_EMAIL env var).");
	const resource = await resourcePut(owner, "learnings.md", content, "text/markdown");
	console.log(`Migrated learnings.md to resource store (${resource.size} bytes)`);
}
//#endregion
export { migrateLearningsScript as default };
