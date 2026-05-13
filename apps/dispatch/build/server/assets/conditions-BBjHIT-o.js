import { C as Column, T as is, a as View, c as isSQLWrapper, f as Table, i as StringChunk, l as sql, n as Placeholder, r as SQL, s as isDriverValueEncoder, t as Param } from "./sql-D8aUs1Ib.js";
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/sql/expressions/conditions.js
function bindIfParam(value, column) {
	if (isDriverValueEncoder(column) && !isSQLWrapper(value) && !is(value, Param) && !is(value, Placeholder) && !is(value, Column) && !is(value, Table) && !is(value, View)) return new Param(value, column);
	return value;
}
var eq = (left, right) => {
	return sql`${left} = ${bindIfParam(right, left)}`;
};
var ne = (left, right) => {
	return sql`${left} <> ${bindIfParam(right, left)}`;
};
function and(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions, new StringChunk(" and ")),
		new StringChunk(")")
	]);
}
function or(...unfilteredConditions) {
	const conditions = unfilteredConditions.filter((c) => c !== void 0);
	if (conditions.length === 0) return;
	if (conditions.length === 1) return new SQL(conditions);
	return new SQL([
		new StringChunk("("),
		sql.join(conditions, new StringChunk(" or ")),
		new StringChunk(")")
	]);
}
function not(condition) {
	return sql`not ${condition}`;
}
var gt = (left, right) => {
	return sql`${left} > ${bindIfParam(right, left)}`;
};
var gte = (left, right) => {
	return sql`${left} >= ${bindIfParam(right, left)}`;
};
var lt = (left, right) => {
	return sql`${left} < ${bindIfParam(right, left)}`;
};
var lte = (left, right) => {
	return sql`${left} <= ${bindIfParam(right, left)}`;
};
function inArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`false`;
		return sql`${column} in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} in ${bindIfParam(values, column)}`;
}
function notInArray(column, values) {
	if (Array.isArray(values)) {
		if (values.length === 0) return sql`true`;
		return sql`${column} not in ${values.map((v) => bindIfParam(v, column))}`;
	}
	return sql`${column} not in ${bindIfParam(values, column)}`;
}
function isNull(value) {
	return sql`${value} is null`;
}
function isNotNull(value) {
	return sql`${value} is not null`;
}
function exists(subquery) {
	return sql`exists ${subquery}`;
}
function notExists(subquery) {
	return sql`not exists ${subquery}`;
}
function between(column, min, max) {
	return sql`${column} between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function notBetween(column, min, max) {
	return sql`${column} not between ${bindIfParam(min, column)} and ${bindIfParam(max, column)}`;
}
function like(column, value) {
	return sql`${column} like ${value}`;
}
function notLike(column, value) {
	return sql`${column} not like ${value}`;
}
function ilike(column, value) {
	return sql`${column} ilike ${value}`;
}
function notIlike(column, value) {
	return sql`${column} not ilike ${value}`;
}
//#endregion
export { notExists as _, gt as a, notLike as b, inArray as c, like as d, lt as f, notBetween as g, not as h, exists as i, isNotNull as l, ne as m, between as n, gte as o, lte as p, eq as r, ilike as s, and as t, isNull as u, notIlike as v, or as x, notInArray as y };
