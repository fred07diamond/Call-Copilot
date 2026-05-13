import { r as __exportAll } from "./chunk-D3zDcpJC.js";
import { $ as ZodString, Ar as _coercedBoolean, H as ZodNumber, Mr as _coercedNumber, Nr as _coercedString, Ti as config, a as ZodBigInt, g as ZodDate, jr as _coercedDate, kr as _coercedBigint, s as ZodBoolean } from "./schemas-DWUnC6a7.js";
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/compat.js
/** @deprecated Use the raw string literal codes instead, e.g. "invalid_type". */
var ZodIssueCode = {
	invalid_type: "invalid_type",
	too_big: "too_big",
	too_small: "too_small",
	invalid_format: "invalid_format",
	not_multiple_of: "not_multiple_of",
	unrecognized_keys: "unrecognized_keys",
	invalid_union: "invalid_union",
	invalid_key: "invalid_key",
	invalid_element: "invalid_element",
	invalid_value: "invalid_value",
	custom: "custom"
};
/** @deprecated Use `z.config(params)` instead. */
function setErrorMap(map) {
	config({ customError: map });
}
/** @deprecated Use `z.config()` instead. */
function getErrorMap() {
	return config().customError;
}
/** @deprecated Do not use. Stub definition, only included for zod-to-json-schema compatibility. */
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind) {})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
//#endregion
//#region ../../node_modules/.pnpm/zod@4.4.3/node_modules/zod/v4/classic/coerce.js
var coerce_exports = /* @__PURE__ */ __exportAll({
	bigint: () => bigint,
	boolean: () => boolean,
	date: () => date,
	number: () => number,
	string: () => string
});
function string(params) {
	return _coercedString(ZodString, params);
}
function number(params) {
	return _coercedNumber(ZodNumber, params);
}
function boolean(params) {
	return _coercedBoolean(ZodBoolean, params);
}
function bigint(params) {
	return _coercedBigint(ZodBigInt, params);
}
function date(params) {
	return _coercedDate(ZodDate, params);
}
//#endregion
export { ZodFirstPartyTypeKind as a, setErrorMap as c, string as i, coerce_exports as n, ZodIssueCode as o, number as r, getErrorMap as s, boolean as t };
