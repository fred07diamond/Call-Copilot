import { C as Column, T as is, _ as Subquery, a as View, f as Table, h as ViewBaseConfig, l as sql, m as getTableUniqueName, r as SQL, w as entityKind } from "./sql-D8aUs1Ib.js";
import { t as PgTable } from "./table-C1uGOHxK.js";
import { _ as notExists, a as gt, b as notLike, c as inArray, d as like, f as lt, g as notBetween, h as not, i as exists, l as isNotNull, m as ne, n as between, o as gte, p as lte, r as eq, s as ilike, t as and, u as isNull, v as notIlike, x as or, y as notInArray } from "./conditions-BBjHIT-o.js";
import { n as desc, t as asc } from "./select-CPuWwTCH.js";
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/alias.js
var ColumnAliasProxyHandler = class {
	constructor(table) {
		this.table = table;
	}
	static [entityKind] = "ColumnAliasProxyHandler";
	get(columnObj, prop) {
		if (prop === "table") return this.table;
		return columnObj[prop];
	}
};
var TableAliasProxyHandler = class {
	constructor(alias, replaceOriginalName) {
		this.alias = alias;
		this.replaceOriginalName = replaceOriginalName;
	}
	static [entityKind] = "TableAliasProxyHandler";
	get(target, prop) {
		if (prop === Table.Symbol.IsAlias) return true;
		if (prop === Table.Symbol.Name) return this.alias;
		if (this.replaceOriginalName && prop === Table.Symbol.OriginalName) return this.alias;
		if (prop === ViewBaseConfig) return {
			...target[ViewBaseConfig],
			name: this.alias,
			isAlias: true
		};
		if (prop === Table.Symbol.Columns) {
			const columns = target[Table.Symbol.Columns];
			if (!columns) return columns;
			const proxiedColumns = {};
			Object.keys(columns).map((key) => {
				proxiedColumns[key] = new Proxy(columns[key], new ColumnAliasProxyHandler(new Proxy(target, this)));
			});
			return proxiedColumns;
		}
		const value = target[prop];
		if (is(value, Column)) return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(target, this)));
		return value;
	}
};
function aliasedTable(table, tableAlias) {
	return new Proxy(table, new TableAliasProxyHandler(tableAlias, false));
}
function aliasedTableColumn(column, tableAlias) {
	return new Proxy(column, new ColumnAliasProxyHandler(new Proxy(column.table, new TableAliasProxyHandler(tableAlias, false))));
}
function mapColumnsInAliasedSQLToAlias(query, alias) {
	return new SQL.Aliased(mapColumnsInSQLToAlias(query.sql, alias), query.fieldAlias);
}
function mapColumnsInSQLToAlias(query, alias) {
	return sql.join(query.queryChunks.map((c) => {
		if (is(c, Column)) return aliasedTableColumn(c, alias);
		if (is(c, SQL)) return mapColumnsInSQLToAlias(c, alias);
		if (is(c, SQL.Aliased)) return mapColumnsInAliasedSQLToAlias(c, alias);
		return c;
	}));
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/query-promise.js
var QueryPromise = class {
	static [entityKind] = "QueryPromise";
	[Symbol.toStringTag] = "QueryPromise";
	catch(onRejected) {
		return this.then(void 0, onRejected);
	}
	finally(onFinally) {
		return this.then((value) => {
			onFinally?.();
			return value;
		}, (reason) => {
			onFinally?.();
			throw reason;
		});
	}
	then(onFulfilled, onRejected) {
		return this.execute().then(onFulfilled, onRejected);
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/selection-proxy.js
var SelectionProxyHandler = class SelectionProxyHandler {
	static [entityKind] = "SelectionProxyHandler";
	config;
	constructor(config) {
		this.config = { ...config };
	}
	get(subquery, prop) {
		if (prop === "_") return {
			...subquery["_"],
			selectedFields: new Proxy(subquery._.selectedFields, this)
		};
		if (prop === ViewBaseConfig) return {
			...subquery[ViewBaseConfig],
			selectedFields: new Proxy(subquery[ViewBaseConfig].selectedFields, this)
		};
		if (typeof prop === "symbol") return subquery[prop];
		const value = (is(subquery, Subquery) ? subquery._.selectedFields : is(subquery, View) ? subquery[ViewBaseConfig].selectedFields : subquery)[prop];
		if (is(value, SQL.Aliased)) {
			if (this.config.sqlAliasedBehavior === "sql" && !value.isSelectionField) return value.sql;
			const newValue = value.clone();
			newValue.isSelectionField = true;
			return newValue;
		}
		if (is(value, SQL)) {
			if (this.config.sqlBehavior === "sql") return value;
			throw new Error(`You tried to reference "${prop}" field from a subquery, which is a raw SQL field, but it doesn't have an alias declared. Please add an alias to the field using ".as('alias')" method.`);
		}
		if (is(value, Column)) {
			if (this.config.alias) return new Proxy(value, new ColumnAliasProxyHandler(new Proxy(value.table, new TableAliasProxyHandler(this.config.alias, this.config.replaceOriginalName ?? false))));
			return value;
		}
		if (typeof value !== "object" || value === null) return value;
		return new Proxy(value, new SelectionProxyHandler(this.config));
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/pg-core/primary-keys.js
var PrimaryKeyBuilder = class {
	static [entityKind] = "PgPrimaryKeyBuilder";
	/** @internal */
	columns;
	/** @internal */
	name;
	constructor(columns, name) {
		this.columns = columns;
		this.name = name;
	}
	/** @internal */
	build(table) {
		return new PrimaryKey(table, this.columns, this.name);
	}
};
var PrimaryKey = class {
	constructor(table, columns, name) {
		this.table = table;
		this.columns = columns;
		this.name = name;
	}
	static [entityKind] = "PgPrimaryKey";
	columns;
	name;
	getName() {
		return this.name ?? `${this.table[PgTable.Symbol.Name]}_${this.columns.map((column) => column.name).join("_")}_pk`;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/casing.js
function toSnakeCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).map((word) => word.toLowerCase()).join("_");
}
function toCamelCase(input) {
	return (input.replace(/['\u2019]/g, "").match(/[\da-z]+|[A-Z]+(?![a-z])|[A-Z][\da-z]+/g) ?? []).reduce((acc, word, i) => {
		return acc + (i === 0 ? word.toLowerCase() : `${word[0].toUpperCase()}${word.slice(1)}`);
	}, "");
}
function noopCase(input) {
	return input;
}
var CasingCache = class {
	static [entityKind] = "CasingCache";
	/** @internal */
	cache = {};
	cachedTables = {};
	convert;
	constructor(casing) {
		this.convert = casing === "snake_case" ? toSnakeCase : casing === "camelCase" ? toCamelCase : noopCase;
	}
	getColumnCasing(column) {
		if (!column.keyAsName) return column.name;
		const key = `${column.table[Table.Symbol.Schema] ?? "public"}.${column.table[Table.Symbol.OriginalName]}.${column.name}`;
		if (!this.cache[key]) this.cacheTable(column.table);
		return this.cache[key];
	}
	cacheTable(table) {
		const tableKey = `${table[Table.Symbol.Schema] ?? "public"}.${table[Table.Symbol.OriginalName]}`;
		if (!this.cachedTables[tableKey]) {
			for (const column of Object.values(table[Table.Symbol.Columns])) {
				const columnKey = `${tableKey}.${column.name}`;
				this.cache[columnKey] = this.convert(column.name);
			}
			this.cachedTables[tableKey] = true;
		}
	}
	clearCache() {
		this.cache = {};
		this.cachedTables = {};
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/errors.js
var DrizzleError = class extends Error {
	static [entityKind] = "DrizzleError";
	constructor({ message, cause }) {
		super(message);
		this.name = "DrizzleError";
		this.cause = cause;
	}
};
var DrizzleQueryError = class DrizzleQueryError extends Error {
	constructor(query, params, cause) {
		super(`Failed query: ${query}
params: ${params}`);
		this.query = query;
		this.params = params;
		this.cause = cause;
		Error.captureStackTrace(this, DrizzleQueryError);
		if (cause) this.cause = cause;
	}
};
var TransactionRollbackError = class extends DrizzleError {
	static [entityKind] = "TransactionRollbackError";
	constructor() {
		super({ message: "Rollback" });
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/relations.js
var Relation = class {
	constructor(sourceTable, referencedTable, relationName) {
		this.sourceTable = sourceTable;
		this.referencedTable = referencedTable;
		this.relationName = relationName;
		this.referencedTableName = referencedTable[Table.Symbol.Name];
	}
	static [entityKind] = "Relation";
	referencedTableName;
	fieldName;
};
var Relations = class {
	constructor(table, config) {
		this.table = table;
		this.config = config;
	}
	static [entityKind] = "Relations";
};
var One = class One extends Relation {
	constructor(sourceTable, referencedTable, config, isNullable) {
		super(sourceTable, referencedTable, config?.relationName);
		this.config = config;
		this.isNullable = isNullable;
	}
	static [entityKind] = "One";
	withFieldName(fieldName) {
		const relation = new One(this.sourceTable, this.referencedTable, this.config, this.isNullable);
		relation.fieldName = fieldName;
		return relation;
	}
};
var Many = class Many extends Relation {
	constructor(sourceTable, referencedTable, config) {
		super(sourceTable, referencedTable, config?.relationName);
		this.config = config;
	}
	static [entityKind] = "Many";
	withFieldName(fieldName) {
		const relation = new Many(this.sourceTable, this.referencedTable, this.config);
		relation.fieldName = fieldName;
		return relation;
	}
};
function getOperators() {
	return {
		and,
		between,
		eq,
		exists,
		gt,
		gte,
		ilike,
		inArray,
		isNull,
		isNotNull,
		like,
		lt,
		lte,
		ne,
		not,
		notBetween,
		notExists,
		notLike,
		notIlike,
		notInArray,
		or,
		sql
	};
}
function getOrderByOperators() {
	return {
		sql,
		asc,
		desc
	};
}
function extractTablesRelationalConfig(schema, configHelpers) {
	if (Object.keys(schema).length === 1 && "default" in schema && !is(schema["default"], Table)) schema = schema["default"];
	const tableNamesMap = {};
	const relationsBuffer = {};
	const tablesConfig = {};
	for (const [key, value] of Object.entries(schema)) if (is(value, Table)) {
		const dbName = getTableUniqueName(value);
		const bufferedRelations = relationsBuffer[dbName];
		tableNamesMap[dbName] = key;
		tablesConfig[key] = {
			tsName: key,
			dbName: value[Table.Symbol.Name],
			schema: value[Table.Symbol.Schema],
			columns: value[Table.Symbol.Columns],
			relations: bufferedRelations?.relations ?? {},
			primaryKey: bufferedRelations?.primaryKey ?? []
		};
		for (const column of Object.values(value[Table.Symbol.Columns])) if (column.primary) tablesConfig[key].primaryKey.push(column);
		const extraConfig = value[Table.Symbol.ExtraConfigBuilder]?.(value[Table.Symbol.ExtraConfigColumns]);
		if (extraConfig) {
			for (const configEntry of Object.values(extraConfig)) if (is(configEntry, PrimaryKeyBuilder)) tablesConfig[key].primaryKey.push(...configEntry.columns);
		}
	} else if (is(value, Relations)) {
		const dbName = getTableUniqueName(value.table);
		const tableName = tableNamesMap[dbName];
		const relations2 = value.config(configHelpers(value.table));
		let primaryKey;
		for (const [relationName, relation] of Object.entries(relations2)) if (tableName) {
			const tableConfig = tablesConfig[tableName];
			tableConfig.relations[relationName] = relation;
		} else {
			if (!(dbName in relationsBuffer)) relationsBuffer[dbName] = {
				relations: {},
				primaryKey
			};
			relationsBuffer[dbName].relations[relationName] = relation;
		}
	}
	return {
		tables: tablesConfig,
		tableNamesMap
	};
}
function createOne(sourceTable) {
	return function one(table, config) {
		return new One(sourceTable, table, config, config?.fields.reduce((res, f) => res && f.notNull, true) ?? false);
	};
}
function createMany(sourceTable) {
	return function many(referencedTable, config) {
		return new Many(sourceTable, referencedTable, config);
	};
}
function normalizeRelation(schema, tableNamesMap, relation) {
	if (is(relation, One) && relation.config) return {
		fields: relation.config.fields,
		references: relation.config.references
	};
	const referencedTableTsName = tableNamesMap[getTableUniqueName(relation.referencedTable)];
	if (!referencedTableTsName) throw new Error(`Table "${relation.referencedTable[Table.Symbol.Name]}" not found in schema`);
	const referencedTableConfig = schema[referencedTableTsName];
	if (!referencedTableConfig) throw new Error(`Table "${referencedTableTsName}" not found in schema`);
	const sourceTable = relation.sourceTable;
	const sourceTableTsName = tableNamesMap[getTableUniqueName(sourceTable)];
	if (!sourceTableTsName) throw new Error(`Table "${sourceTable[Table.Symbol.Name]}" not found in schema`);
	const reverseRelations = [];
	for (const referencedTableRelation of Object.values(referencedTableConfig.relations)) if (relation.relationName && relation !== referencedTableRelation && referencedTableRelation.relationName === relation.relationName || !relation.relationName && referencedTableRelation.referencedTable === relation.sourceTable) reverseRelations.push(referencedTableRelation);
	if (reverseRelations.length > 1) throw relation.relationName ? /* @__PURE__ */ new Error(`There are multiple relations with name "${relation.relationName}" in table "${referencedTableTsName}"`) : /* @__PURE__ */ new Error(`There are multiple relations between "${referencedTableTsName}" and "${relation.sourceTable[Table.Symbol.Name]}". Please specify relation name`);
	if (reverseRelations[0] && is(reverseRelations[0], One) && reverseRelations[0].config) return {
		fields: reverseRelations[0].config.references,
		references: reverseRelations[0].config.fields
	};
	throw new Error(`There is not enough information to infer relation "${sourceTableTsName}.${relation.fieldName}"`);
}
function createTableRelationsHelpers(sourceTable) {
	return {
		one: createOne(sourceTable),
		many: createMany(sourceTable)
	};
}
function mapRelationalRow(tablesConfig, tableConfig, row, buildQueryResultSelection, mapColumnValue = (value) => value) {
	const result = {};
	for (const [selectionItemIndex, selectionItem] of buildQueryResultSelection.entries()) if (selectionItem.isJson) {
		const relation = tableConfig.relations[selectionItem.tsKey];
		const rawSubRows = row[selectionItemIndex];
		const subRows = typeof rawSubRows === "string" ? JSON.parse(rawSubRows) : rawSubRows;
		result[selectionItem.tsKey] = is(relation, One) ? subRows && mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRows, selectionItem.selection, mapColumnValue) : subRows.map((subRow) => mapRelationalRow(tablesConfig, tablesConfig[selectionItem.relationTableTsKey], subRow, selectionItem.selection, mapColumnValue));
	} else {
		const value = mapColumnValue(row[selectionItemIndex]);
		const field = selectionItem.field;
		let decoder;
		if (is(field, Column)) decoder = field;
		else if (is(field, SQL)) decoder = field.decoder;
		else decoder = field.sql.decoder;
		result[selectionItem.tsKey] = value === null ? null : decoder.mapFromDriverValue(value);
	}
	return result;
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/query-builders/query-builder.js
var TypedQueryBuilder = class {
	static [entityKind] = "TypedQueryBuilder";
	/** @internal */
	getSelectedFields() {
		return this._.selectedFields;
	}
};
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/cache/core/cache.js
var Cache = class {
	static [entityKind] = "Cache";
};
var NoopCache = class extends Cache {
	strategy() {
		return "all";
	}
	static [entityKind] = "NoopCache";
	async get(_key) {}
	async put(_hashedQuery, _response, _tables, _config) {}
	async onMutate(_params) {}
};
async function hashQuery(sql, params) {
	const dataToHash = `${sql}-${JSON.stringify(params)}`;
	const data = new TextEncoder().encode(dataToHash);
	const hashBuffer = await crypto.subtle.digest("SHA-256", data);
	return [...new Uint8Array(hashBuffer)].map((b) => b.toString(16).padStart(2, "0")).join("");
}
//#endregion
//#region ../../node_modules/.pnpm/drizzle-orm@0.45.2_@libsql+client@0.15.15_@neondatabase+serverless@1.1.0_@opentelemetry_5d20050e2d576b5b5c5d7d7762733e10/node_modules/drizzle-orm/logger.js
var ConsoleLogWriter = class {
	static [entityKind] = "ConsoleLogWriter";
	write(message) {
		console.log(message);
	}
};
var DefaultLogger = class {
	static [entityKind] = "DefaultLogger";
	writer;
	constructor(config) {
		this.writer = config?.writer ?? new ConsoleLogWriter();
	}
	logQuery(query, params) {
		const stringifiedParams = params.map((p) => {
			try {
				return JSON.stringify(p);
			} catch {
				return String(p);
			}
		});
		const paramsStr = stringifiedParams.length ? ` -- params: [${stringifiedParams.join(", ")}]` : "";
		this.writer.write(`Query: ${query}${paramsStr}`);
	}
};
var NoopLogger = class {
	static [entityKind] = "NoopLogger";
	logQuery() {}
};
//#endregion
export { mapColumnsInSQLToAlias as C, mapColumnsInAliasedSQLToAlias as S, CasingCache as _, TypedQueryBuilder as a, aliasedTable as b, createTableRelationsHelpers as c, getOrderByOperators as d, mapRelationalRow as f, TransactionRollbackError as g, DrizzleQueryError as h, hashQuery as i, extractTablesRelationalConfig as l, DrizzleError as m, NoopLogger as n, Many as o, normalizeRelation as p, NoopCache as r, One as s, DefaultLogger as t, getOperators as u, SelectionProxyHandler as v, aliasedTableColumn as x, QueryPromise as y };
