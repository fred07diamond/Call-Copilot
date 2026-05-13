import { l as sql } from "./sql-D8aUs1Ib.js";
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/sql/expressions/select.js
function asc(column) {
	return sql`${column} asc`;
}
function desc(column) {
	return sql`${column} desc`;
}
//#endregion
export { desc as n, asc as t };
