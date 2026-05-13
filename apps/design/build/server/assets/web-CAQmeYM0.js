import { c as LibsqlError, n as _createClient$1, o as supportedUrlLink, r as expandConfig, t as _createClient$2 } from "./http-BO8-wvkN.js";
//#region ../../node_modules/.pnpm/@libsql+client@0.15.15/node_modules/@libsql/client/lib-esm/web.js
function createClient(config) {
	return _createClient(expandConfig(config, true));
}
/** @private */
function _createClient(config) {
	if (config.scheme === "ws" || config.scheme === "wss") return _createClient$1(config);
	else if (config.scheme === "http" || config.scheme === "https") return _createClient$2(config);
	else throw new LibsqlError(`The client that uses Web standard APIs supports only "libsql:", "wss:", "ws:", "https:" and "http:" URLs, got ${JSON.stringify(config.scheme + ":")}. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
}
//#endregion
export { createClient };
