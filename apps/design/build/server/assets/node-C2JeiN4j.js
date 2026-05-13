import { i as __require, o as __toESM, t as __commonJSMin } from "./chunk-D3zDcpJC.js";
import { a as ResultSetImpl, c as LibsqlError, i as isInMemoryConfig, n as _createClient$2, o as supportedUrlLink, r as expandConfig, s as transactionModeToBegin, t as _createClient$3 } from "./http-BO8-wvkN.js";
import { Buffer } from "node:buffer";
//#region ../../node_modules/.pnpm/@neon-rs+load@0.0.4/node_modules/@neon-rs/load/dist/index.js
var require_dist = /* @__PURE__ */ __commonJSMin(((exports) => {
	var __createBinding = exports && exports.__createBinding || (Object.create ? (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		var desc = Object.getOwnPropertyDescriptor(m, k);
		if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) desc = {
			enumerable: true,
			get: function() {
				return m[k];
			}
		};
		Object.defineProperty(o, k2, desc);
	}) : (function(o, m, k, k2) {
		if (k2 === void 0) k2 = k;
		o[k2] = m[k];
	}));
	var __setModuleDefault = exports && exports.__setModuleDefault || (Object.create ? (function(o, v) {
		Object.defineProperty(o, "default", {
			enumerable: true,
			value: v
		});
	}) : function(o, v) {
		o["default"] = v;
	});
	var __importStar = exports && exports.__importStar || function(mod) {
		if (mod && mod.__esModule) return mod;
		var result = {};
		if (mod != null) {
			for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
		}
		__setModuleDefault(result, mod);
		return result;
	};
	Object.defineProperty(exports, "__esModule", { value: true });
	exports.load = exports.currentTarget = void 0;
	var path = __importStar(__require("path"));
	var fs$1 = __importStar(__require("fs"));
	function currentTarget() {
		let os = null;
		switch (process.platform) {
			case "android":
				switch (process.arch) {
					case "arm": return "android-arm-eabi";
					case "arm64": return "android-arm64";
				}
				os = "Android";
				break;
			case "win32":
				switch (process.arch) {
					case "x64": return "win32-x64-msvc";
					case "arm64": return "win32-arm64-msvc";
					case "ia32": return "win32-ia32-msvc";
				}
				os = "Windows";
				break;
			case "darwin":
				switch (process.arch) {
					case "x64": return "darwin-x64";
					case "arm64": return "darwin-arm64";
				}
				os = "macOS";
				break;
			case "linux":
				switch (process.arch) {
					case "x64":
					case "arm64": return isGlibc() ? `linux-${process.arch}-gnu` : `linux-${process.arch}-musl`;
					case "arm": return "linux-arm-gnueabihf";
				}
				os = "Linux";
				break;
			case "freebsd":
				if (process.arch === "x64") return "freebsd-x64";
				os = "FreeBSD";
				break;
		}
		if (os) throw new Error(`Neon: unsupported ${os} architecture: ${process.arch}`);
		throw new Error(`Neon: unsupported system: ${process.platform}`);
	}
	exports.currentTarget = currentTarget;
	function isGlibc() {
		const report = process.report?.getReport();
		if (typeof report !== "object" || !report || !("header" in report)) return false;
		const header = report.header;
		return typeof header === "object" && !!header && "glibcVersionRuntime" in header;
	}
	function load(dirname) {
		const m = path.join(dirname, "index.node");
		return fs$1.existsSync(m) ? __require(m) : null;
	}
	exports.load = load;
}));
//#endregion
//#region ../../node_modules/.pnpm/detect-libc@2.0.2/node_modules/detect-libc/lib/process.js
var require_process = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var isLinux = () => process.platform === "linux";
	var report = null;
	var getReport = () => {
		if (!report)
 /* istanbul ignore next */
		report = isLinux() && process.report ? process.report.getReport() : {};
		return report;
	};
	module.exports = {
		isLinux,
		getReport
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/detect-libc@2.0.2/node_modules/detect-libc/lib/filesystem.js
var require_filesystem = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var fs = __require("fs");
	/**
	* The path where we can find the ldd
	*/
	var LDD_PATH = "/usr/bin/ldd";
	/**
	* Read the content of a file synchronous
	*
	* @param {string} path
	* @returns {string}
	*/
	var readFileSync = (path) => fs.readFileSync(path, "utf-8");
	/**
	* Read the content of a file
	*
	* @param {string} path
	* @returns {Promise<string>}
	*/
	var readFile = (path) => new Promise((resolve, reject) => {
		fs.readFile(path, "utf-8", (err, data) => {
			if (err) reject(err);
			else resolve(data);
		});
	});
	module.exports = {
		LDD_PATH,
		readFileSync,
		readFile
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/detect-libc@2.0.2/node_modules/detect-libc/lib/detect-libc.js
var require_detect_libc = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var childProcess = __require("child_process");
	var { isLinux, getReport } = require_process();
	var { LDD_PATH, readFile, readFileSync } = require_filesystem();
	var cachedFamilyFilesystem;
	var cachedVersionFilesystem;
	var command = "getconf GNU_LIBC_VERSION 2>&1 || true; ldd --version 2>&1 || true";
	var commandOut = "";
	var safeCommand = () => {
		if (!commandOut) return new Promise((resolve) => {
			childProcess.exec(command, (err, out) => {
				commandOut = err ? " " : out;
				resolve(commandOut);
			});
		});
		return commandOut;
	};
	var safeCommandSync = () => {
		if (!commandOut) try {
			commandOut = childProcess.execSync(command, { encoding: "utf8" });
		} catch (_err) {
			commandOut = " ";
		}
		return commandOut;
	};
	/**
	* A String constant containing the value `glibc`.
	* @type {string}
	* @public
	*/
	var GLIBC = "glibc";
	/**
	* A Regexp constant to get the GLIBC Version.
	* @type {string}
	*/
	var RE_GLIBC_VERSION = /GLIBC\s(\d+\.\d+)/;
	/**
	* A String constant containing the value `musl`.
	* @type {string}
	* @public
	*/
	var MUSL = "musl";
	/**
	* This string is used to find if the {@link LDD_PATH} is GLIBC
	* @type {string}
	*/
	var GLIBC_ON_LDD = GLIBC.toUpperCase();
	/**
	* This string is used to find if the {@link LDD_PATH} is musl
	* @type {string}
	*/
	var MUSL_ON_LDD = MUSL.toLowerCase();
	var isFileMusl = (f) => f.includes("libc.musl-") || f.includes("ld-musl-");
	var familyFromReport = () => {
		const report = getReport();
		if (report.header && report.header.glibcVersionRuntime) return GLIBC;
		if (Array.isArray(report.sharedObjects)) {
			if (report.sharedObjects.some(isFileMusl)) return MUSL;
		}
		return null;
	};
	var familyFromCommand = (out) => {
		const [getconf, ldd1] = out.split(/[\r\n]+/);
		if (getconf && getconf.includes(GLIBC)) return GLIBC;
		if (ldd1 && ldd1.includes(MUSL)) return MUSL;
		return null;
	};
	var getFamilyFromLddContent = (content) => {
		if (content.includes(MUSL_ON_LDD)) return MUSL;
		if (content.includes(GLIBC_ON_LDD)) return GLIBC;
		return null;
	};
	var familyFromFilesystem = async () => {
		if (cachedFamilyFilesystem !== void 0) return cachedFamilyFilesystem;
		cachedFamilyFilesystem = null;
		try {
			cachedFamilyFilesystem = getFamilyFromLddContent(await readFile(LDD_PATH));
		} catch (e) {}
		return cachedFamilyFilesystem;
	};
	var familyFromFilesystemSync = () => {
		if (cachedFamilyFilesystem !== void 0) return cachedFamilyFilesystem;
		cachedFamilyFilesystem = null;
		try {
			cachedFamilyFilesystem = getFamilyFromLddContent(readFileSync(LDD_PATH));
		} catch (e) {}
		return cachedFamilyFilesystem;
	};
	/**
	* Resolves with the libc family when it can be determined, `null` otherwise.
	* @returns {Promise<?string>}
	*/
	var family = async () => {
		let family = null;
		if (isLinux()) {
			family = await familyFromFilesystem();
			if (!family) family = familyFromReport();
			if (!family) family = familyFromCommand(await safeCommand());
		}
		return family;
	};
	/**
	* Returns the libc family when it can be determined, `null` otherwise.
	* @returns {?string}
	*/
	var familySync = () => {
		let family = null;
		if (isLinux()) {
			family = familyFromFilesystemSync();
			if (!family) family = familyFromReport();
			if (!family) family = familyFromCommand(safeCommandSync());
		}
		return family;
	};
	/**
	* Resolves `true` only when the platform is Linux and the libc family is not `glibc`.
	* @returns {Promise<boolean>}
	*/
	var isNonGlibcLinux = async () => isLinux() && await family() !== GLIBC;
	/**
	* Returns `true` only when the platform is Linux and the libc family is not `glibc`.
	* @returns {boolean}
	*/
	var isNonGlibcLinuxSync = () => isLinux() && familySync() !== GLIBC;
	var versionFromFilesystem = async () => {
		if (cachedVersionFilesystem !== void 0) return cachedVersionFilesystem;
		cachedVersionFilesystem = null;
		try {
			const versionMatch = (await readFile(LDD_PATH)).match(RE_GLIBC_VERSION);
			if (versionMatch) cachedVersionFilesystem = versionMatch[1];
		} catch (e) {}
		return cachedVersionFilesystem;
	};
	var versionFromFilesystemSync = () => {
		if (cachedVersionFilesystem !== void 0) return cachedVersionFilesystem;
		cachedVersionFilesystem = null;
		try {
			const versionMatch = readFileSync(LDD_PATH).match(RE_GLIBC_VERSION);
			if (versionMatch) cachedVersionFilesystem = versionMatch[1];
		} catch (e) {}
		return cachedVersionFilesystem;
	};
	var versionFromReport = () => {
		const report = getReport();
		if (report.header && report.header.glibcVersionRuntime) return report.header.glibcVersionRuntime;
		return null;
	};
	var versionSuffix = (s) => s.trim().split(/\s+/)[1];
	var versionFromCommand = (out) => {
		const [getconf, ldd1, ldd2] = out.split(/[\r\n]+/);
		if (getconf && getconf.includes(GLIBC)) return versionSuffix(getconf);
		if (ldd1 && ldd2 && ldd1.includes(MUSL)) return versionSuffix(ldd2);
		return null;
	};
	/**
	* Resolves with the libc version when it can be determined, `null` otherwise.
	* @returns {Promise<?string>}
	*/
	var version = async () => {
		let version = null;
		if (isLinux()) {
			version = await versionFromFilesystem();
			if (!version) version = versionFromReport();
			if (!version) version = versionFromCommand(await safeCommand());
		}
		return version;
	};
	/**
	* Returns the libc version when it can be determined, `null` otherwise.
	* @returns {?string}
	*/
	var versionSync = () => {
		let version = null;
		if (isLinux()) {
			version = versionFromFilesystemSync();
			if (!version) version = versionFromReport();
			if (!version) version = versionFromCommand(safeCommandSync());
		}
		return version;
	};
	module.exports = {
		GLIBC,
		MUSL,
		family,
		familySync,
		isNonGlibcLinux,
		isNonGlibcLinuxSync,
		version,
		versionSync
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/libsql@0.5.29/node_modules/libsql/auth.js
var require_auth = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = {
		ALLOW: 0,
		DENY: 1
	};
}));
//#endregion
//#region ../../node_modules/.pnpm/libsql@0.5.29/node_modules/libsql/sqlite-error.js
var require_sqlite_error = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	var descriptor = {
		value: "SqliteError",
		writable: true,
		enumerable: false,
		configurable: true
	};
	function SqliteError(message, code, rawCode) {
		if (new.target !== SqliteError) return new SqliteError(message, code);
		if (typeof code !== "string") throw new TypeError("Expected second argument to be a string");
		Error.call(this, message);
		descriptor.value = "" + message;
		Object.defineProperty(this, "message", descriptor);
		Error.captureStackTrace(this, SqliteError);
		this.code = code;
		this.rawCode = rawCode;
	}
	Object.setPrototypeOf(SqliteError, Error);
	Object.setPrototypeOf(SqliteError.prototype, Error.prototype);
	Object.defineProperty(SqliteError.prototype, "name", descriptor);
	module.exports = SqliteError;
}));
//#endregion
//#region ../../node_modules/.pnpm/@libsql+client@0.15.15/node_modules/@libsql/client/lib-esm/sqlite3.js
var import_libsql = /* @__PURE__ */ __toESM((/* @__PURE__ */ __commonJSMin(((exports, module) => {
	var { load, currentTarget } = require_dist();
	var { familySync, GLIBC, MUSL } = require_detect_libc();
	function requireNative() {
		if (process.env.LIBSQL_JS_DEV) return load(__dirname);
		let target = currentTarget();
		if (familySync() == GLIBC) switch (target) {
			case "linux-x64-musl":
				target = "linux-x64-gnu";
				break;
			case "linux-arm64-musl":
				target = "linux-arm64-gnu";
				break;
		}
		if (target === "linux-arm-gnueabihf" && familySync() == MUSL) target = "linux-arm-musleabihf";
		return __require(`@libsql/${target}`);
	}
	var { databaseOpen, databaseOpenWithSync, databaseInTransaction, databaseInterrupt, databaseClose, databaseSyncSync, databaseSyncUntilSync, databaseExecSync, databasePrepareSync, databaseDefaultSafeIntegers, databaseAuthorizer, databaseLoadExtension, databaseMaxWriteReplicationIndex, statementRaw, statementIsReader, statementGet, statementRun, statementInterrupt, statementRowsSync, statementColumns, statementSafeIntegers, rowsNext } = requireNative();
	var Authorization = require_auth();
	var SqliteError = require_sqlite_error();
	function convertError(err) {
		if (err.libsqlError) return new SqliteError(err.message, err.code, err.rawCode);
		return err;
	}
	/**
	* Database represents a connection that can prepare and execute SQL statements.
	*/
	var Database = class {
		/**
		* Creates a new database connection. If the database file pointed to by `path` does not exists, it will be created.
		*
		* @constructor
		* @param {string} path - Path to the database file.
		*/
		constructor(path, opts) {
			const encryptionCipher = opts?.encryptionCipher ?? "aes256cbc";
			if (opts && opts.syncUrl) {
				var authToken = "";
				if (opts.syncAuth) {
					console.warn("Warning: The `syncAuth` option is deprecated, please use `authToken` option instead.");
					authToken = opts.syncAuth;
				} else if (opts.authToken) authToken = opts.authToken;
				const encryptionKey = opts?.encryptionKey ?? "";
				const syncPeriod = opts?.syncPeriod ?? 0;
				const readYourWrites = opts?.readYourWrites ?? true;
				const offline = opts?.offline ?? false;
				const remoteEncryptionKey = opts?.remoteEncryptionKey ?? "";
				this.db = databaseOpenWithSync(path, opts.syncUrl, authToken, encryptionCipher, encryptionKey, syncPeriod, readYourWrites, offline, remoteEncryptionKey);
			} else this.db = databaseOpen(path, opts?.authToken ?? "", encryptionCipher, opts?.encryptionKey ?? "", opts?.timeout ?? 0, opts?.remoteEncryptionKey ?? "");
			this.memory = path === ":memory:";
			this.readonly = false;
			this.name = "";
			this.open = true;
			const db = this.db;
			Object.defineProperties(this, { inTransaction: { get() {
				return databaseInTransaction(db);
			} } });
		}
		sync() {
			return databaseSyncSync.call(this.db);
		}
		syncUntil(replicationIndex) {
			return databaseSyncUntilSync.call(this.db, replicationIndex);
		}
		/**
		* Prepares a SQL statement for execution.
		*
		* @param {string} sql - The SQL statement string to prepare.
		*/
		prepare(sql) {
			try {
				return new Statement(databasePrepareSync.call(this.db, sql));
			} catch (err) {
				throw convertError(err);
			}
		}
		/**
		* Returns a function that executes the given function in a transaction.
		*
		* @param {function} fn - The function to wrap in a transaction.
		*/
		transaction(fn) {
			if (typeof fn !== "function") throw new TypeError("Expected first argument to be a function");
			const db = this;
			const wrapTxn = (mode) => {
				return (...bindParameters) => {
					db.exec("BEGIN " + mode);
					try {
						const result = fn(...bindParameters);
						db.exec("COMMIT");
						return result;
					} catch (err) {
						db.exec("ROLLBACK");
						throw err;
					}
				};
			};
			const properties = {
				default: { value: wrapTxn("") },
				deferred: { value: wrapTxn("DEFERRED") },
				immediate: { value: wrapTxn("IMMEDIATE") },
				exclusive: { value: wrapTxn("EXCLUSIVE") },
				database: {
					value: this,
					enumerable: true
				}
			};
			Object.defineProperties(properties.default.value, properties);
			Object.defineProperties(properties.deferred.value, properties);
			Object.defineProperties(properties.immediate.value, properties);
			Object.defineProperties(properties.exclusive.value, properties);
			return properties.default.value;
		}
		pragma(source, options) {
			if (options == null) options = {};
			if (typeof source !== "string") throw new TypeError("Expected first argument to be a string");
			if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
			const simple = options["simple"];
			const stmt = this.prepare(`PRAGMA ${source}`, this, true);
			return simple ? stmt.pluck().get() : stmt.all();
		}
		backup(filename, options) {
			throw new Error("not implemented");
		}
		serialize(options) {
			throw new Error("not implemented");
		}
		function(name, options, fn) {
			if (options == null) options = {};
			if (typeof options === "function") {
				fn = options;
				options = {};
			}
			if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
			if (typeof fn !== "function") throw new TypeError("Expected last argument to be a function");
			if (typeof options !== "object") throw new TypeError("Expected second argument to be an options object");
			if (!name) throw new TypeError("User-defined function name cannot be an empty string");
			throw new Error("not implemented");
		}
		aggregate(name, options) {
			if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
			if (typeof options !== "object" || options === null) throw new TypeError("Expected second argument to be an options object");
			if (!name) throw new TypeError("User-defined function name cannot be an empty string");
			throw new Error("not implemented");
		}
		table(name, factory) {
			if (typeof name !== "string") throw new TypeError("Expected first argument to be a string");
			if (!name) throw new TypeError("Virtual table module name cannot be an empty string");
			throw new Error("not implemented");
		}
		authorizer(rules) {
			databaseAuthorizer.call(this.db, rules);
		}
		loadExtension(...args) {
			databaseLoadExtension.call(this.db, ...args);
		}
		maxWriteReplicationIndex() {
			return databaseMaxWriteReplicationIndex.call(this.db);
		}
		/**
		* Executes a SQL statement.
		*
		* @param {string} sql - The SQL statement string to execute.
		*/
		exec(sql) {
			try {
				databaseExecSync.call(this.db, sql);
			} catch (err) {
				throw convertError(err);
			}
		}
		/**
		* Interrupts the database connection.
		*/
		interrupt() {
			databaseInterrupt.call(this.db);
		}
		/**
		* Closes the database connection.
		*/
		close() {
			databaseClose.call(this.db);
			this.open = false;
		}
		/**
		* Toggle 64-bit integer support.
		*/
		defaultSafeIntegers(toggle) {
			databaseDefaultSafeIntegers.call(this.db, toggle ?? true);
			return this;
		}
		unsafeMode(...args) {
			throw new Error("not implemented");
		}
	};
	/**
	* Statement represents a prepared SQL statement that can be executed.
	*/
	var Statement = class {
		constructor(stmt) {
			this.stmt = stmt;
			this.pluckMode = false;
		}
		/**
		* Toggle raw mode.
		*
		* @param raw Enable or disable raw mode. If you don't pass the parameter, raw mode is enabled.
		*/
		raw(raw) {
			statementRaw.call(this.stmt, raw ?? true);
			return this;
		}
		/**
		* Toggle pluck mode.
		*
		* @param pluckMode Enable or disable pluck mode. If you don't pass the parameter, pluck mode is enabled.
		*/
		pluck(pluckMode) {
			this.pluckMode = pluckMode ?? true;
			return this;
		}
		get reader() {
			return statementIsReader.call(this.stmt);
		}
		/**
		* Executes the SQL statement and returns an info object.
		*/
		run(...bindParameters) {
			try {
				if (bindParameters.length == 1 && typeof bindParameters[0] === "object") return statementRun.call(this.stmt, bindParameters[0]);
				else return statementRun.call(this.stmt, bindParameters.flat());
			} catch (err) {
				throw convertError(err);
			}
		}
		/**
		* Executes the SQL statement and returns the first row.
		*
		* @param bindParameters - The bind parameters for executing the statement.
		*/
		get(...bindParameters) {
			try {
				if (bindParameters.length == 1 && typeof bindParameters[0] === "object") return statementGet.call(this.stmt, bindParameters[0]);
				else return statementGet.call(this.stmt, bindParameters.flat());
			} catch (err) {
				throw convertError(err);
			}
		}
		/**
		* Executes the SQL statement and returns an iterator to the resulting rows.
		*
		* @param bindParameters - The bind parameters for executing the statement.
		*/
		iterate(...bindParameters) {
			var rows = void 0;
			if (bindParameters.length == 1 && typeof bindParameters[0] === "object") rows = statementRowsSync.call(this.stmt, bindParameters[0]);
			else rows = statementRowsSync.call(this.stmt, bindParameters.flat());
			return {
				nextRows: Array(100),
				nextRowIndex: 100,
				next() {
					try {
						if (this.nextRowIndex === 100) {
							rowsNext.call(rows, this.nextRows);
							this.nextRowIndex = 0;
						}
						const row = this.nextRows[this.nextRowIndex];
						this.nextRows[this.nextRowIndex] = void 0;
						if (!row) return { done: true };
						this.nextRowIndex++;
						return {
							value: row,
							done: false
						};
					} catch (err) {
						throw convertError(err);
					}
				},
				[Symbol.iterator]() {
					return this;
				}
			};
		}
		/**
		* Executes the SQL statement and returns an array of the resulting rows.
		*
		* @param bindParameters - The bind parameters for executing the statement.
		*/
		all(...bindParameters) {
			try {
				const result = [];
				for (const row of this.iterate(...bindParameters)) if (this.pluckMode) result.push(row[Object.keys(row)[0]]);
				else result.push(row);
				return result;
			} catch (err) {
				throw convertError(err);
			}
		}
		/**
		* Interrupts the statement.
		*/
		interrupt() {
			statementInterrupt.call(this.stmt);
		}
		/**
		* Returns the columns in the result set returned by this prepared statement.
		*/
		columns() {
			return statementColumns.call(this.stmt);
		}
		/**
		* Toggle 64-bit integer support.
		*/
		safeIntegers(toggle) {
			statementSafeIntegers.call(this.stmt, toggle ?? true);
			return this;
		}
	};
	module.exports = Database;
	module.exports.Authorization = Authorization;
	module.exports.SqliteError = SqliteError;
})))(), 1);
/** @private */
function _createClient$1(config) {
	if (config.scheme !== "file") throw new LibsqlError(`URL scheme ${JSON.stringify(config.scheme + ":")} is not supported by the local sqlite3 client. For more information, please read ${supportedUrlLink}`, "URL_SCHEME_NOT_SUPPORTED");
	const authority = config.authority;
	if (authority !== void 0) {
		const host = authority.host.toLowerCase();
		if (host !== "" && host !== "localhost") throw new LibsqlError(`Invalid host in file URL: ${JSON.stringify(authority.host)}. A "file:" URL with an absolute path should start with one slash ("file:/absolute/path.db") or with three slashes ("file:///absolute/path.db"). For more information, please read ${supportedUrlLink}`, "URL_INVALID");
		if (authority.port !== void 0) throw new LibsqlError("File URL cannot have a port", "URL_INVALID");
		if (authority.userinfo !== void 0) throw new LibsqlError("File URL cannot have username and password", "URL_INVALID");
	}
	let isInMemory = isInMemoryConfig(config);
	if (isInMemory && config.syncUrl) throw new LibsqlError(`Embedded replica must use file for local db but URI with in-memory mode were provided instead: ${config.path}`, "URL_INVALID");
	let path = config.path;
	if (isInMemory) path = `${config.scheme}:${config.path}`;
	const options = {
		authToken: config.authToken,
		encryptionKey: config.encryptionKey,
		syncUrl: config.syncUrl,
		syncPeriod: config.syncInterval,
		readYourWrites: config.readYourWrites,
		offline: config.offline
	};
	const db = new import_libsql.default(path, options);
	executeStmt(db, "SELECT 1 AS checkThatTheDatabaseCanBeOpened", config.intMode);
	return new Sqlite3Client(path, options, db, config.intMode);
}
var Sqlite3Client = class {
	#path;
	#options;
	#db;
	#intMode;
	closed;
	protocol;
	/** @private */
	constructor(path, options, db, intMode) {
		this.#path = path;
		this.#options = options;
		this.#db = db;
		this.#intMode = intMode;
		this.closed = false;
		this.protocol = "file";
	}
	async execute(stmtOrSql, args) {
		let stmt;
		if (typeof stmtOrSql === "string") stmt = {
			sql: stmtOrSql,
			args: args || []
		};
		else stmt = stmtOrSql;
		this.#checkNotClosed();
		return executeStmt(this.#getDb(), stmt, this.#intMode);
	}
	async batch(stmts, mode = "deferred") {
		this.#checkNotClosed();
		const db = this.#getDb();
		try {
			executeStmt(db, transactionModeToBegin(mode), this.#intMode);
			const resultSets = stmts.map((stmt) => {
				if (!db.inTransaction) throw new LibsqlError("The transaction has been rolled back", "TRANSACTION_CLOSED");
				return executeStmt(db, Array.isArray(stmt) ? {
					sql: stmt[0],
					args: stmt[1] || []
				} : stmt, this.#intMode);
			});
			executeStmt(db, "COMMIT", this.#intMode);
			return resultSets;
		} finally {
			if (db.inTransaction) executeStmt(db, "ROLLBACK", this.#intMode);
		}
	}
	async migrate(stmts) {
		this.#checkNotClosed();
		const db = this.#getDb();
		try {
			executeStmt(db, "PRAGMA foreign_keys=off", this.#intMode);
			executeStmt(db, transactionModeToBegin("deferred"), this.#intMode);
			const resultSets = stmts.map((stmt) => {
				if (!db.inTransaction) throw new LibsqlError("The transaction has been rolled back", "TRANSACTION_CLOSED");
				return executeStmt(db, stmt, this.#intMode);
			});
			executeStmt(db, "COMMIT", this.#intMode);
			return resultSets;
		} finally {
			if (db.inTransaction) executeStmt(db, "ROLLBACK", this.#intMode);
			executeStmt(db, "PRAGMA foreign_keys=on", this.#intMode);
		}
	}
	async transaction(mode = "write") {
		const db = this.#getDb();
		executeStmt(db, transactionModeToBegin(mode), this.#intMode);
		this.#db = null;
		return new Sqlite3Transaction(db, this.#intMode);
	}
	async executeMultiple(sql) {
		this.#checkNotClosed();
		const db = this.#getDb();
		try {
			return executeMultiple(db, sql);
		} finally {
			if (db.inTransaction) executeStmt(db, "ROLLBACK", this.#intMode);
		}
	}
	async sync() {
		this.#checkNotClosed();
		const rep = await this.#getDb().sync();
		return {
			frames_synced: rep.frames_synced,
			frame_no: rep.frame_no
		};
	}
	async reconnect() {
		try {
			if (!this.closed && this.#db !== null) this.#db.close();
		} finally {
			this.#db = new import_libsql.default(this.#path, this.#options);
			this.closed = false;
		}
	}
	close() {
		this.closed = true;
		if (this.#db !== null) {
			this.#db.close();
			this.#db = null;
		}
	}
	#checkNotClosed() {
		if (this.closed) throw new LibsqlError("The client is closed", "CLIENT_CLOSED");
	}
	#getDb() {
		if (this.#db === null) this.#db = new import_libsql.default(this.#path, this.#options);
		return this.#db;
	}
};
var Sqlite3Transaction = class {
	#database;
	#intMode;
	/** @private */
	constructor(database, intMode) {
		this.#database = database;
		this.#intMode = intMode;
	}
	async execute(stmtOrSql, args) {
		let stmt;
		if (typeof stmtOrSql === "string") stmt = {
			sql: stmtOrSql,
			args: args || []
		};
		else stmt = stmtOrSql;
		this.#checkNotClosed();
		return executeStmt(this.#database, stmt, this.#intMode);
	}
	async batch(stmts) {
		return stmts.map((stmt) => {
			this.#checkNotClosed();
			const normalizedStmt = Array.isArray(stmt) ? {
				sql: stmt[0],
				args: stmt[1] || []
			} : stmt;
			return executeStmt(this.#database, normalizedStmt, this.#intMode);
		});
	}
	async executeMultiple(sql) {
		this.#checkNotClosed();
		return executeMultiple(this.#database, sql);
	}
	async rollback() {
		if (!this.#database.open) return;
		this.#checkNotClosed();
		executeStmt(this.#database, "ROLLBACK", this.#intMode);
	}
	async commit() {
		this.#checkNotClosed();
		executeStmt(this.#database, "COMMIT", this.#intMode);
	}
	close() {
		if (this.#database.inTransaction) executeStmt(this.#database, "ROLLBACK", this.#intMode);
	}
	get closed() {
		return !this.#database.inTransaction;
	}
	#checkNotClosed() {
		if (this.closed) throw new LibsqlError("The transaction is closed", "TRANSACTION_CLOSED");
	}
};
function executeStmt(db, stmt, intMode) {
	let sql;
	let args;
	if (typeof stmt === "string") {
		sql = stmt;
		args = [];
	} else {
		sql = stmt.sql;
		if (Array.isArray(stmt.args)) args = stmt.args.map((value) => valueToSql(value, intMode));
		else {
			args = {};
			for (const name in stmt.args) {
				const argName = name[0] === "@" || name[0] === "$" || name[0] === ":" ? name.substring(1) : name;
				args[argName] = valueToSql(stmt.args[name], intMode);
			}
		}
	}
	try {
		const sqlStmt = db.prepare(sql);
		sqlStmt.safeIntegers(true);
		let returnsData = true;
		try {
			sqlStmt.raw(true);
		} catch {
			returnsData = false;
		}
		if (returnsData) {
			const columns = Array.from(sqlStmt.columns().map((col) => col.name));
			return new ResultSetImpl(columns, Array.from(sqlStmt.columns().map((col) => col.type ?? "")), sqlStmt.all(args).map((sqlRow) => {
				return rowFromSql(sqlRow, columns, intMode);
			}), 0, void 0);
		} else {
			const info = sqlStmt.run(args);
			const rowsAffected = info.changes;
			return new ResultSetImpl([], [], [], rowsAffected, BigInt(info.lastInsertRowid));
		}
	} catch (e) {
		throw mapSqliteError(e);
	}
}
function rowFromSql(sqlRow, columns, intMode) {
	const row = {};
	Object.defineProperty(row, "length", { value: sqlRow.length });
	for (let i = 0; i < sqlRow.length; ++i) {
		const value = valueFromSql(sqlRow[i], intMode);
		Object.defineProperty(row, i, { value });
		const column = columns[i];
		if (!Object.hasOwn(row, column)) Object.defineProperty(row, column, {
			value,
			enumerable: true,
			configurable: true,
			writable: true
		});
	}
	return row;
}
function valueFromSql(sqlValue, intMode) {
	if (typeof sqlValue === "bigint") if (intMode === "number") {
		if (sqlValue < minSafeBigint || sqlValue > maxSafeBigint) throw new RangeError("Received integer which cannot be safely represented as a JavaScript number");
		return Number(sqlValue);
	} else if (intMode === "bigint") return sqlValue;
	else if (intMode === "string") return "" + sqlValue;
	else throw new Error("Invalid value for IntMode");
	else if (sqlValue instanceof Buffer) return sqlValue.buffer;
	return sqlValue;
}
var minSafeBigint = -9007199254740991n;
var maxSafeBigint = 9007199254740991n;
function valueToSql(value, intMode) {
	if (typeof value === "number") {
		if (!Number.isFinite(value)) throw new RangeError("Only finite numbers (not Infinity or NaN) can be passed as arguments");
		return value;
	} else if (typeof value === "bigint") {
		if (value < minInteger || value > maxInteger) throw new RangeError("bigint is too large to be represented as a 64-bit integer and passed as argument");
		return value;
	} else if (typeof value === "boolean") switch (intMode) {
		case "bigint": return value ? 1n : 0n;
		case "string": return value ? "1" : "0";
		default: return value ? 1 : 0;
	}
	else if (value instanceof ArrayBuffer) return Buffer.from(value);
	else if (value instanceof Date) return value.valueOf();
	else if (value === void 0) throw new TypeError("undefined cannot be passed as argument to the database");
	else return value;
}
var minInteger = -9223372036854775808n;
var maxInteger = 9223372036854775807n;
function executeMultiple(db, sql) {
	try {
		db.exec(sql);
	} catch (e) {
		throw mapSqliteError(e);
	}
}
function mapSqliteError(e) {
	if (e instanceof import_libsql.default.SqliteError) return new LibsqlError(e.message, e.code, e.rawCode, e);
	return e;
}
//#endregion
//#region ../../node_modules/.pnpm/@libsql+client@0.15.15/node_modules/@libsql/client/lib-esm/node.js
/** Creates a {@link Client} object.
*
* You must pass at least an `url` in the {@link Config} object.
*/
function createClient(config) {
	return _createClient(expandConfig(config, true));
}
function _createClient(config) {
	if (config.scheme === "wss" || config.scheme === "ws") return _createClient$2(config);
	else if (config.scheme === "https" || config.scheme === "http") return _createClient$3(config);
	else return _createClient$1(config);
}
//#endregion
export { createClient as t };
