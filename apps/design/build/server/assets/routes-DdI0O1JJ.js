import { b as setResponseStatus, c as getMethod, i as defineEventHandler, y as setResponseHeader } from "./node-DxyfkX8_.js";
import { t as readBody } from "./h3-helpers-CmxO0LxM.js";
import { r as getSession } from "./auth-B6XASyqO.js";
import { i as getDbExec, u as isPostgres } from "./client-BnpqLOqs.js";
import { i as getRequestOrgId, l as runWithRequestContext } from "./request-context-Ci6C_Mch.js";
import { o as recordChange } from "./poll-DRDmfDG6.js";
import { r as getOrgContext } from "./context-NRophGGu.js";
import { n as resolveKeyReferences, r as validateUrlAllowlist, t as getKeyAllowlist } from "./substitution-Bjzwit72.js";
import { i as resolveAccess, t as ForbiddenError } from "./access-CZSYnBcR.js";
import { createExtension, deleteExtension, ensureExtensionsTables, getExtension, hideExtension, listExtensions, unhideExtension, updateExtension, updateExtensionContent } from "./store-CKlF9Mdr.js";
import { a as normalizeExtensionProxyMethod, c as redactString, i as collectSecretValues, l as sanitizeOutboundHeaders, n as isBlockedExtensionUrlWithDns, o as readResponseTextWithLimit, s as redactSecrets, t as createSsrfSafeDispatcher } from "./url-safety-q6sFDrIS.js";
import { randomUUID } from "node:crypto";
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/html-shell.js
var EXTENSION_IFRAME_CSP = "default-src 'none'; script-src 'self' https://cdn.jsdelivr.net 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net https://fonts.googleapis.com; font-src https://fonts.gstatic.com; connect-src 'self'; img-src 'self' data: blob:; media-src 'self' data: blob:; frame-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'self';";
var EXTENSION_IFRAME_META_CSP = EXTENSION_IFRAME_CSP.replace(/\s*frame-ancestors 'self';?$/, "");
function buildExtensionHtml(content, themeVars, isDark, extensionId, binding) {
	const extensionIdJson = JSON.stringify(extensionId ?? "");
	const extensionIdAttr = escapeHtmlAttribute(extensionId ?? "");
	const bindingJson = JSON.stringify(binding ?? {
		authorEmail: "",
		viewerEmail: "",
		isAuthor: true,
		role: "owner"
	});
	return `<!DOCTYPE html>
<html lang="en"${isDark ? " class=\"dark\"" : ""}>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="${EXTENSION_IFRAME_META_CSP}" />
  ${binding && !binding.isAuthor ? `<meta name="agent-native-extension-author" content="${escapeHtmlAttribute(binding.authorEmail)}" />` : ""}
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300..700&display=swap" rel="stylesheet" />
  <script>
    var _extensionErrors = [];
    var _extensionErrorDetails = [];
    var _consoleLogs = [];
    var _networkLogs = [];

    var _origConsole = { log: console.log, warn: console.warn, error: console.error, info: console.info };
    function _wrapConsole(level, orig) {
      return function() {
        var args = Array.prototype.slice.call(arguments);
        var msg = args.map(function(a) {
          try { return typeof a === 'object' ? JSON.stringify(a) : String(a); }
          catch(e) { return String(a); }
        }).join(' ');
        if (_consoleLogs.length >= 50) _consoleLogs.shift();
        _consoleLogs.push({ level: level, message: msg });
        orig.apply(console, arguments);
      };
    }
    console.log = _wrapConsole('log', _origConsole.log);
    console.warn = _wrapConsole('warn', _origConsole.warn);
    console.error = _wrapConsole('error', _origConsole.error);
    console.info = _wrapConsole('info', _origConsole.info);

    function _collectError(message, stack) {
      if (!message) return;
      if (message === 'Script error.' || message === 'Script error') message = 'Runtime error';
      if (_extensionErrors.indexOf(message) !== -1) return;
      _extensionErrors.push(message);
      _extensionErrorDetails.push({ message: message, stack: stack || '' });
      var toast = document.getElementById('__extension-error-toast');
      if (!toast) return;
      var msg = document.getElementById('__extension-error-msg');
      if (_extensionErrors.length === 1) {
        msg.textContent = _extensionErrors[0];
      } else {
        msg.textContent = _extensionErrors.length + ' errors — ' + _extensionErrors[_extensionErrors.length - 1];
      }
      toast.style.display = 'block';
    }

    window.addEventListener('error', function(event) {
      var msg = event.message || '';
      if (msg.indexOf('Alpine Expression Error') === 0) return;
      var stack = event.error && event.error.stack ? event.error.stack : '';
      _collectError(msg, stack);
    });

    window.addEventListener('unhandledrejection', function(event) {
      var msg = event.reason && event.reason.message ? event.reason.message : String(event.reason);
      var stack = event.reason && event.reason.stack ? event.reason.stack : '';
      _collectError(msg, stack);
    });
  <\/script>
  <!--
    SECURITY: pinned to exact patch versions + SRI integrity hashes. A
    malicious republish of @tailwindcss/browser@4.x or alpinejs@3.x would
    otherwise inject code into every extension. To bump these versions:
      1. npm view @tailwindcss/browser version  (or alpinejs)
      2. curl -sL https://cdn.jsdelivr.net/npm/@tailwindcss/browser@<v> \\
         | openssl dgst -sha384 -binary | openssl base64 -A
      3. Update the URL + integrity hash below in lockstep.
  -->
  <script
    src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4.2.4"
    integrity="sha384-yNSZBFvuOWcmww494a9+1zNuvgUGEXoWkein7cxP8wHUTi3iXCU4vJ7hr3tzBCml"
    crossorigin="anonymous"
  ><\/script>
  <script
    defer
    src="https://cdn.jsdelivr.net/npm/alpinejs@3.15.11/dist/cdn.min.js"
    integrity="sha384-WPtu0YHhJ3arcykfnv1JgUffWDSKRnqnDeTpJUbOc2os2moEmLkIdaeR0trPN4be"
    crossorigin="anonymous"
  ><\/script>
  <style>${themeVars}</style>
  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
    @theme {
      --color-border: hsl(var(--border));
      --color-input: hsl(var(--input));
      --color-ring: hsl(var(--ring));
      --color-background: hsl(var(--background));
      --color-foreground: hsl(var(--foreground));
      --color-primary: hsl(var(--primary));
      --color-primary-foreground: hsl(var(--primary-foreground));
      --color-secondary: hsl(var(--secondary));
      --color-secondary-foreground: hsl(var(--secondary-foreground));
      --color-destructive: hsl(var(--destructive));
      --color-destructive-foreground: hsl(var(--destructive-foreground));
      --color-muted: hsl(var(--muted));
      --color-muted-foreground: hsl(var(--muted-foreground));
      --color-accent: hsl(var(--accent));
      --color-accent-foreground: hsl(var(--accent-foreground));
      --color-popover: hsl(var(--popover));
      --color-popover-foreground: hsl(var(--popover-foreground));
      --color-card: hsl(var(--card));
      --color-card-foreground: hsl(var(--card-foreground));
      --color-sidebar: hsl(var(--sidebar-background));
      --color-sidebar-foreground: hsl(var(--sidebar-foreground));
      --color-sidebar-primary: hsl(var(--sidebar-primary));
      --color-sidebar-primary-foreground: hsl(var(--sidebar-primary-foreground));
      --color-sidebar-accent: hsl(var(--sidebar-accent));
      --color-sidebar-accent-foreground: hsl(var(--sidebar-accent-foreground));
      --color-sidebar-border: hsl(var(--sidebar-border));
      --color-sidebar-ring: hsl(var(--sidebar-ring));
      --radius-lg: var(--radius);
      --radius-md: calc(var(--radius) - 2px);
      --radius-sm: calc(var(--radius) - 4px);
    }
  </style>
	  <style>
	    *, *::before, *::after { border-color: hsl(var(--border)); }
	    body {
	      --agent-native-extension-padding: clamp(16px, 2vw, 24px);
	      /* Legacy alias for pre-rename extension content (do not remove). */
	      --agent-native-tool-padding: var(--agent-native-extension-padding);
	      box-sizing: border-box;
	      font-family: 'Inter', sans-serif;
	      margin: 0;
	      min-height: 100vh;
	      padding: var(--agent-native-extension-padding);
	    }
	    body:has(> [data-extension-layout="full-bleed"]),
	    body:has(> [data-extension-padding="none"]),
	    body:has(> .agent-native-extension-bleed),
	    /* Legacy aliases (do not remove). */
	    body:has(> [data-tool-layout="full-bleed"]),
	    body:has(> [data-tool-padding="none"]),
	    body:has(> .agent-native-tool-bleed) {
	      padding: 0;
	    }
	  </style>
	  <script>
	    var _extensionRequestSeq = 0;
	    var _extensionPendingRequests = {};

	    window.addEventListener('message', function(event) {
	      if (event.source !== window.parent) return;
	      var message = event.data || {};
	      if (
	        message.type !== 'agent-native-extension-response' &&
	        message.type !== 'agent-native-tool-response'
	      ) return;
	      var pending = _extensionPendingRequests[message.requestId];
	      if (!pending) return;
	      delete _extensionPendingRequests[message.requestId];
	      if (message.error) {
	        pending.reject(new Error(message.error));
	      } else {
	        pending.resolve(message.response);
	      }
	    });

	    function hostRequest(path, options) {
	      options = options || {};
	      return new Promise(function(resolve, reject) {
	        var requestId = 'extension-req-' + (++_extensionRequestSeq);
	        _extensionPendingRequests[requestId] = { resolve: resolve, reject: reject };
	        window.parent.postMessage({
	          type: 'agent-native-extension-request',
	          requestId: requestId,
	          path: path,
	          options: {
	            method: options.method || 'GET',
	            headers: options.headers || {},
	            body: options.body,
	          },
	        }, '*');
	        setTimeout(function() {
	          var pending = _extensionPendingRequests[requestId];
	          if (!pending) return;
	          delete _extensionPendingRequests[requestId];
	          pending.reject(new Error('Extension host request timed out'));
	        }, 30000);
	      });
	    }

	    var _origHostRequest = hostRequest;
	    hostRequest = function(path, options) {
	      var entry = { path: path, method: (options && options.method) || 'GET' };
	      return _origHostRequest(path, options).then(function(res) {
	        entry.ok = res.ok;
	        entry.status = res.status;
	        if (!res.ok && res.body) {
	          try { entry.error = typeof res.body === 'string' ? res.body.slice(0, 200) : JSON.stringify(res.body).slice(0, 200); } catch(e) {}
	        }
	        if (_networkLogs.length >= 20) _networkLogs.shift();
	        _networkLogs.push(entry);
	        return res;
	      }, function(err) {
	        entry.ok = false;
	        entry.error = err.message;
	        if (_networkLogs.length >= 20) _networkLogs.shift();
	        _networkLogs.push(entry);
	        throw err;
	      });
	    };

	    function extensionFetch(url, options) {
	      var opts = options || {};
	      return hostRequest('/_agent-native/extensions/proxy', {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify({
	          url: url,
          method: opts.method || 'GET',
          headers: opts.headers,
          body: opts.body,
        }),
	      }).then(function(res) {
	        var data = res.body;
	          if (data.error && data.status === undefined) {
	            throw new Error(data.error);
	          }
          return {
            ok: data.status >= 200 && data.status < 300,
            status: data.status,
	            json: function() { return Promise.resolve(data.body); },
	            text: function() { return Promise.resolve(typeof data.body === 'string' ? data.body : JSON.stringify(data.body)); },
	          };
	      });
	    }

	    function _appendActionQuery(path, params) {
	      var search = new URLSearchParams();
	      params = params || {};
	      Object.keys(params).forEach(function(key) {
	        var value = params[key];
	        if (value === undefined || value === null) return;
	        if (Array.isArray(value)) {
	          value.forEach(function(item) {
	            if (item !== undefined && item !== null) {
	              search.append(key, String(item));
	            }
	          });
	          return;
	        }
	        search.set(key, String(value));
	      });
	      var qs = search.toString();
	      return qs ? path + '?' + qs : path;
	    }

	    function _methodHintFromActionResponse(res) {
	      if (!res || res.status !== 405) return null;
	      var body = res.body || {};
	      var message = typeof body === 'string' ? body : body.error;
	      if (!message) return null;
	      var match = String(message).match(/Use (GET|POST|PUT|PATCH|DELETE|HEAD)\\.?/i);
	      return match ? match[1].toUpperCase() : null;
	    }

	    async function appAction(name, params) {
	      params = params || {};
	      if (name === 'navigate') {
	        var navRes = await hostRequest('/_agent-native/application-state/navigate', {
	          method: 'PUT',
	          headers: { 'Content-Type': 'application/json' },
	          body: JSON.stringify(params),
	        });
	        if (!navRes.ok) {
	          var navErr = navRes.body || { error: navRes.statusText };
	          throw new Error(navErr.error || 'Navigation failed: ' + navRes.status);
	        }
	        return navRes.body;
	      }
	      var path = '/_agent-native/actions/' + encodeURIComponent(name);
	      var res = await hostRequest(path, {
	        method: 'POST',
	        headers: { 'Content-Type': 'application/json' },
	        body: JSON.stringify(params),
	      });

	      var retryMethod = _methodHintFromActionResponse(res);
	      if (!res.ok && retryMethod && retryMethod !== 'POST') {
	        var retryPath = path;
	        var retryOptions = {
	          method: retryMethod,
	          headers: { 'Content-Type': 'application/json' },
	        };
	        if (retryMethod === 'GET' || retryMethod === 'HEAD') {
	          retryPath = _appendActionQuery(path, params);
	        } else {
	          retryOptions.body = JSON.stringify(params);
	        }
	        res = await hostRequest(retryPath, retryOptions);
	      }

	      if (!res.ok) {
	        var err = res.body || { error: res.statusText };
	        throw new Error(err.error || 'Action failed: ' + res.status);
	      }
	      return res.body;
	    }

	    async function appFetch(path, options) {
	      options = options || {};
	      var res = await hostRequest(path, {
	        ...options,
	        headers: {
	          'Content-Type': 'application/json',
	          ...(options.headers || {}),
	        },
	      });
	      if (!res.ok) {
	        var err = typeof res.body === 'object' && res.body ? res.body : { error: res.statusText };
	        throw new Error(err.error || 'Request failed: ' + res.status);
	      }
	      return res.body;
	    }

    async function dbQuery(sql, args) {
      var body = { sql: sql };
      if (args) body.args = args;
      return appFetch('/_agent-native/extensions/sql/query', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    }

    async function dbExec(sql, args) {
      var body = { sql: sql };
      if (args) body.args = args;
      return appFetch('/_agent-native/extensions/sql/exec', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    }

    var _extensionId = ${extensionIdJson};
    var _extensionBinding = ${bindingJson};
    window.extensionBinding = _extensionBinding;
    // Legacy alias for extension bodies authored before the rename.
    window.toolBinding = _extensionBinding;
    // SECURITY (audit H4): announce the resolved binding to the parent so the
    // host bridge can gate dangerous helpers based on viewer role. Sent
    // BEFORE the user-authored content has a chance to run, so a malicious
    // extension body cannot suppress or rewrite the announcement. The parent
    // ignores subsequent announcements for the same iframe; see
    // ExtensionViewer.tsx / EmbeddedExtension.tsx.
    try {
      window.parent.postMessage(
        {
          type: 'agent-native-extension-binding',
          extensionId: _extensionId,
          binding: _extensionBinding,
        },
        '*',
      );
    } catch (_) {}
    // SECURITY: when the viewer is not the author of this extension, emit a
    // clear console warning. The bridge currently runs every helper with the
    // viewer's session — a malicious shared extension can call any action,
    // read any owned table row in scope, and resolve any user-scope secret.
    // A full consent step is tracked as TODO C1 in audit 05-tools-sandbox.md.
    if (_extensionBinding && !_extensionBinding.isAuthor) {
      try {
        console.warn(
          '[agent-native] Shared extension — running with viewer\\'s session. ' +
            'Author: ' + (_extensionBinding.authorEmail || '<unknown>') + '. ' +
            'Bridge calls (appAction, dbExec, extensionFetch) execute under ' +
            'your account; they are gated by your permissions, not the ' +
            'author\\'s. Do not run untrusted shared extensions.',
        );
      } catch (_) {}
    }

    var extensionData = {
	      async list(collection, opts) {
	        var limit = (opts && opts.limit) || 100;
	        var scope = (opts && opts.scope) || 'user';
	        var res = await hostRequest('/_agent-native/extensions/data/' + _extensionId + '/' + encodeURIComponent(collection) + '?limit=' + limit + '&scope=' + scope);
	        if (!res.ok) throw new Error('Failed to list extension data');
	        return res.body;
	      },
      async get(collection, id, opts) {
        var scope = (opts && opts.scope) || 'user';
        var items = await this.list(collection, { scope: scope });
        return (items || []).find(function(item) { return item.id === id; }) || null;
      },
      async set(collection, id, data, opts) {
	        var scope = (opts && opts.scope) || 'user';
	        var res = await hostRequest('/_agent-native/extensions/data/' + _extensionId + '/' + encodeURIComponent(collection), {
	          method: 'POST',
	          headers: { 'Content-Type': 'application/json' },
	          body: JSON.stringify({ id: id, data: data, scope: scope }),
	        });
	        if (!res.ok) throw new Error('Failed to save extension data');
	        return res.body;
	      },
	      async remove(collection, id, opts) {
	        var scope = (opts && opts.scope) || 'user';
	        var res = await hostRequest('/_agent-native/extensions/data/' + _extensionId + '/' + encodeURIComponent(collection) + '/' + encodeURIComponent(id) + '?scope=' + scope, {
	          method: 'DELETE',
	        });
	        if (!res.ok) throw new Error('Failed to delete extension data');
	        return res.body;
	      },
	    };

	    // Legacy aliases — extension bodies authored before the rename use
	    // toolFetch, toolData, toolId. Keep these working forever.
	    var toolFetch = extensionFetch;
	    var toolData = extensionData;
	    var _toolId = _extensionId;
	  <\/script>
	  <style>
	    #__extension-error-toast {
	      display: none;
	      position: fixed;
	      bottom: 16px;
	      right: 16px;
	      max-width: 420px;
	      background: hsl(var(--destructive));
	      color: hsl(var(--destructive-foreground));
	      border: 1px solid hsl(var(--destructive) / .6);
	      border-radius: calc(var(--radius, .5rem) + 2px);
	      padding: 12px 16px;
	      font-size: 13px;
	      line-height: 1.4;
	      font-family: 'Inter', sans-serif;
	      z-index: 9999;
	      box-shadow: 0 4px 12px rgba(0,0,0,.15), 0 1px 3px rgba(0,0,0,.1);
	      animation: __toast-in 0.2s ease-out;
	    }
	    @keyframes __toast-in {
	      from { opacity: 0; transform: translateY(8px); }
	      to { opacity: 1; transform: translateY(0); }
	    }
	  </style>
	  <script>
	    // Extension-point slot context: when an extension is rendered embedded
	    // inside an ExtensionSlot, the host pushes a context object via
	    // postMessage. Extensions read it synchronously via window.slotContext
	    // or subscribe to changes via window.onSlotContext(fn). When rendered
	    // full-page (no ?slot= param), slotContext stays null and extensions
	    // branch on that.
	    window.slotContext = null;
	    var _slotContextSubscribers = [];
	    window.onSlotContext = function(fn) {
	      _slotContextSubscribers.push(fn);
	      if (window.slotContext !== null) {
	        try { fn(window.slotContext); } catch(_) {}
	      }
	      return function() {
	        _slotContextSubscribers = _slotContextSubscribers.filter(function(f) { return f !== fn; });
	      };
	    };
	    window.addEventListener('message', function(event) {
	      if (event.source !== window.parent) return;
	      var msg = event.data;
	      if (!msg || msg.type !== 'agent-native-slot-context') return;
	      window.slotContext = msg.context || {};
	      _slotContextSubscribers.forEach(function(fn) {
	        try { fn(window.slotContext); } catch(_) {}
	      });
	    });

	    // Auto-resize the iframe to its content when running in slot mode. The
	    // host listens for agent-native-extension-resize and adjusts the iframe height.
	    if (new URLSearchParams(location.search).get('slot')) {
	      var _lastH = 0;
	      var _reportHeight = function() {
	        var h = Math.max(
	          document.documentElement.scrollHeight,
	          document.body ? document.body.scrollHeight : 0,
	        );
	        if (h !== _lastH) {
	          _lastH = h;
	          window.parent.postMessage({ type: 'agent-native-extension-resize', height: h }, '*');
	        }
	      };
	      if (typeof ResizeObserver !== 'undefined') {
	        var _ro = new ResizeObserver(_reportHeight);
	        document.addEventListener('DOMContentLoaded', function() {
	          _ro.observe(document.documentElement);
	          if (document.body) _ro.observe(document.body);
	        });
	      }
	      // Initial reports — Alpine takes a tick to render after DOMContentLoaded.
	      setTimeout(_reportHeight, 50);
	      setTimeout(_reportHeight, 250);
	    }

	    window.addEventListener('message', function(event) {
	      if (event.source !== window.parent) return;
	      var msg = event.data;
	      if (!msg || msg.type !== 'agent-native-theme-update') return;
	      var root = document.documentElement;
	      if (msg.isDark !== undefined) {
	        if (msg.isDark) root.classList.add('dark');
	        else root.classList.remove('dark');
	      }
	      var vars = msg.vars || {};
	      for (var key in vars) {
	        if (vars.hasOwnProperty(key)) {
	          root.style.setProperty(key, vars[key]);
	        }
	      }
	    });

	    document.addEventListener('keydown', function(e) {
	      if ((e.metaKey || e.ctrlKey) && !e.altKey) {
	        var key = e.key.toLowerCase();
	        if (key === 'c' || key === 'v' || key === 'x' || key === 'a' || key === 'z' || key === 'y') return;
	        e.preventDefault();
	        e.stopPropagation();
	        window.parent.postMessage({
	          type: 'agent-native-extension-keydown',
	          key: e.key, code: e.code,
	          metaKey: e.metaKey, ctrlKey: e.ctrlKey,
	          shiftKey: e.shiftKey, altKey: e.altKey,
	        }, '*');
	        return;
	      }
	      if (e.key === 'Escape') {
	        window.parent.postMessage({
	          type: 'agent-native-extension-keydown',
	          key: e.key, code: e.code,
	          metaKey: false, ctrlKey: false,
	          shiftKey: false, altKey: false,
	        }, '*');
	      }
	    });

	    document.addEventListener('DOMContentLoaded', function() {
	      var fixBtn = document.getElementById('__extension-error-fix');
	      if (fixBtn) {
	        fixBtn.addEventListener('click', function() {
	          window.parent.postMessage({
	            type: 'agent-native-extension-error-fix',
	            errors: _extensionErrors,
	            errorDetails: _extensionErrorDetails,
	            consoleLogs: _consoleLogs.slice(-30),
	            networkLogs: _networkLogs.slice(-15)
	          }, '*');
	          document.getElementById('__extension-error-toast').style.display = 'none';
	        });
	      }
	      var dismissBtn = document.getElementById('__extension-error-dismiss');
	      if (dismissBtn) {
	        dismissBtn.addEventListener('click', function() {
	          document.getElementById('__extension-error-toast').style.display = 'none';
	        });
	      }
	    });
	  <\/script>
	</head>
	<body${extensionId ? ` data-extension-id="${extensionIdAttr}" data-tool-id="${extensionIdAttr}"` : ""} class="bg-background text-foreground">
	${content}
	<div id="__extension-error-toast">
	  <div style="display:flex;align-items:flex-start;gap:8px;">
	    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0;margin-top:1px;"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
	    <span id="__extension-error-msg" style="flex:1;overflow:hidden;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;"></span>
	    <button id="__extension-error-fix" style="cursor:pointer;border:none;background:rgba(255,255,255,.9);color:hsl(0 84.2% 40%);font-size:12px;font-weight:500;padding:4px 12px;border-radius:4px;flex-shrink:0;">Fix</button>
	    <button id="__extension-error-dismiss" style="cursor:pointer;border:none;background:transparent;color:inherit;font-size:16px;padding:2px 6px;opacity:0.7;flex-shrink:0;">&#215;</button>
	  </div>
	</div>
	</body>
	</html>`;
}
function escapeHtmlAttribute(value) {
	return value.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/theme.js
/**
* CSS variables baked into every extension iframe. Both light and dark are
* always emitted — the `.dark` class on the iframe's `<html>` toggles between
* them. This means a parent theme toggle becomes a single class toggle inside
* the iframe (cheap, atomic, no full reload), and there is no race where the
* iframe is briefly half-themed while postMessage values arrive.
*/
function getThemeVars(_isDark) {
	return `
:root {
  --background: 0 0% 100%;
  --foreground: 240 10% 3.9%;
  --card: 0 0% 100%;
  --card-foreground: 240 10% 3.9%;
  --popover: 0 0% 100%;
  --popover-foreground: 240 10% 3.9%;
  --primary: 240 5.9% 10%;
  --primary-foreground: 0 0% 98%;
  --secondary: 240 4.8% 95.9%;
  --secondary-foreground: 240 5.9% 10%;
  --muted: 240 4.8% 95.9%;
  --muted-foreground: 240 3.8% 46.1%;
  --accent: 240 4.8% 95.9%;
  --accent-foreground: 240 5.9% 10%;
  --destructive: 0 84.2% 60.2%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 5.9% 90%;
  --input: 240 5.9% 90%;
  --ring: 240 5.9% 10%;
  --radius: 0.5rem;
  --sidebar-background: 0 0% 98%;
  --sidebar-foreground: 240 5.3% 26.1%;
  --sidebar-primary: 240 5.9% 10%;
  --sidebar-primary-foreground: 0 0% 98%;
  --sidebar-accent: 240 4.8% 95.9%;
  --sidebar-accent-foreground: 240 5.9% 10%;
  --sidebar-border: 220 13% 91%;
  --sidebar-ring: 240 5.9% 10%;
  color-scheme: light;
}
.dark {
  --background: 240 10% 3.9%;
  --foreground: 0 0% 98%;
  --card: 240 10% 3.9%;
  --card-foreground: 0 0% 98%;
  --popover: 240 10% 3.9%;
  --popover-foreground: 0 0% 98%;
  --primary: 0 0% 98%;
  --primary-foreground: 240 5.9% 10%;
  --secondary: 240 3.7% 15.9%;
  --secondary-foreground: 0 0% 98%;
  --muted: 240 3.7% 15.9%;
  --muted-foreground: 240 5% 64.9%;
  --accent: 240 3.7% 15.9%;
  --accent-foreground: 0 0% 98%;
  --destructive: 0 62.8% 30.6%;
  --destructive-foreground: 0 0% 98%;
  --border: 240 3.7% 15.9%;
  --input: 240 3.7% 15.9%;
  --ring: 240 4.9% 83.9%;
  --sidebar-background: 240 5.9% 10%;
  --sidebar-foreground: 240 4.8% 95.9%;
  --sidebar-primary: 224.3 76.3% 48%;
  --sidebar-primary-foreground: 0 0% 100%;
  --sidebar-accent: 240 3.7% 15.9%;
  --sidebar-accent-foreground: 240 4.8% 95.9%;
  --sidebar-border: 240 3.7% 15.9%;
  --sidebar-ring: 240 4.9% 83.9%;
  color-scheme: dark;
}
body {
  background-color: hsl(var(--background));
  color: hsl(var(--foreground));
}`;
}
//#endregion
//#region ../../node_modules/.pnpm/@agent-native+core@0.14.8_bd141c93c3ba8c1834a821745ffc16c2/node_modules/@agent-native/core/dist/extensions/routes.js
function createExtensionsHandler() {
	return defineEventHandler(async (event) => {
		const method = getMethod(event);
		const pathname = (event.url?.pathname || "").replace(/^\/+/, "").replace(/\/+$/, "");
		const parts = pathname ? pathname.split("/").map((part) => {
			try {
				return decodeURIComponent(part);
			} catch {
				return part;
			}
		}) : [];
		const session = await getSession(event).catch(() => null);
		if (!session?.email) {
			setResponseStatus(event, 401);
			return { error: "Authentication required" };
		}
		const orgCtx = await getOrgContext(event).catch(() => null);
		const userEmail = session.email;
		const orgId = orgCtx?.orgId ?? void 0;
		try {
			return await runWithRequestContext({
				userEmail,
				orgId
			}, async () => {
				await ensureExtensionsTables();
				return dispatch(event, method, parts, userEmail);
			});
		} catch (err) {
			if (err instanceof ForbiddenError) {
				setResponseStatus(event, 403);
				return { error: err.message };
			}
			throw err;
		}
	});
}
async function dispatch(event, method, parts, userEmail) {
	if (method === "POST" && parts.length === 2 && parts[0] === "sql" && parts[1] === "query") return handleSqlQuery(event);
	if (method === "POST" && parts.length === 2 && parts[0] === "sql" && parts[1] === "exec") return handleSqlExec(event);
	if (method === "GET" && parts.length === 3 && parts[0] === "data") return handleExtensionDataList(event, parts[1], parts[2], userEmail);
	if (method === "POST" && parts.length === 3 && parts[0] === "data") return handleExtensionDataUpsert(event, parts[1], parts[2], userEmail);
	if (method === "DELETE" && parts.length === 4 && parts[0] === "data") return handleExtensionDataDelete(event, parts[1], parts[2], parts[3], userEmail);
	if (method === "POST" && parts.length === 1 && parts[0] === "proxy") return handleProxy(event, userEmail);
	if (method === "GET" && parts.length === 0) {
		const rows = await listExtensions();
		return Promise.all(rows.map((row) => extensionResponse(row)));
	}
	if (method === "POST" && parts.length === 0) {
		const body = await readBody(event);
		if (!body.name) {
			setResponseStatus(event, 400);
			return { error: "name is required" };
		}
		const extension = await createExtension(body);
		recordChange({
			source: "action",
			type: "change"
		});
		setResponseStatus(event, 201);
		return extension;
	}
	if (method === "GET" && parts.length === 2 && parts[1] === "render") {
		const access = await resolveAccess("extension", parts[0]);
		const extension = access?.resource;
		if (!extension) {
			setResponseStatus(event, 404);
			return { error: "Extension not found" };
		}
		const search = event.url?.search || "";
		const isDark = search.includes("dark=1") || search.includes("dark=true");
		const themeVars = getThemeVars(isDark);
		const isAuthor = extension.ownerEmail === userEmail;
		const html = buildExtensionHtml(extension.content, themeVars, isDark, parts[0], {
			authorEmail: extension.ownerEmail,
			viewerEmail: userEmail,
			isAuthor,
			role: access.role
		});
		setResponseHeader(event, "Content-Type", "text/html; charset=utf-8");
		setResponseHeader(event, "Content-Security-Policy", EXTENSION_IFRAME_CSP);
		setResponseHeader(event, "X-Frame-Options", "SAMEORIGIN");
		setResponseHeader(event, "X-Content-Type-Options", "nosniff");
		setResponseHeader(event, "Referrer-Policy", "no-referrer");
		return html;
	}
	if (method === "GET" && parts.length === 1) {
		const access = await resolveAccess("extension", parts[0]);
		if (!access) {
			setResponseStatus(event, 404);
			return { error: "Extension not found" };
		}
		return extensionResponse(access.resource, access.role);
	}
	if (method === "POST" && parts.length === 2 && parts[1] === "hide") {
		if (!await hideExtension(parts[0])) {
			setResponseStatus(event, 404);
			return { error: "Extension not found" };
		}
		recordChange({
			source: "action",
			type: "change"
		});
		return {
			ok: true,
			hidden: true
		};
	}
	if (method === "POST" && parts.length === 2 && parts[1] === "unhide") {
		if (!await unhideExtension(parts[0])) {
			setResponseStatus(event, 404);
			return { error: "Extension not found" };
		}
		recordChange({
			source: "action",
			type: "change"
		});
		return {
			ok: true,
			hidden: false
		};
	}
	if (method === "PUT" && parts.length === 1) {
		const body = await readBody(event);
		const hasContentUpdate = body.content !== void 0 || body.patches !== void 0;
		const hasMetaUpdate = body.name !== void 0 || body.description !== void 0 || body.icon !== void 0 || body.visibility !== void 0;
		let result = null;
		if (hasContentUpdate) result = await updateExtensionContent(parts[0], {
			content: body.content,
			patches: body.patches
		});
		if (hasMetaUpdate) result = await updateExtension(parts[0], body);
		if (!hasContentUpdate && !hasMetaUpdate) result = await getExtension(parts[0]);
		if (!result) {
			setResponseStatus(event, 404);
			return { error: "Extension not found" };
		}
		recordChange({
			source: "action",
			type: "change"
		});
		return result;
	}
	if (method === "DELETE" && parts.length === 1) {
		if (!await deleteExtension(parts[0])) {
			setResponseStatus(event, 404);
			return { error: "Extension not found" };
		}
		recordChange({
			source: "action",
			type: "change"
		});
		return { ok: true };
	}
	setResponseStatus(event, 404);
	return { error: "Not found" };
}
async function extensionResponse(row, role) {
	const resolvedRole = role ?? await resolveAccess("extension", row.id).then((access) => access?.role ?? null).catch(() => null);
	return {
		...row,
		role: resolvedRole,
		canEdit: resolvedRole ? [
			"owner",
			"admin",
			"editor"
		].includes(resolvedRole) : false,
		canDelete: resolvedRole ? ["owner", "admin"].includes(resolvedRole) : false
	};
}
async function handleExtensionDataList(event, extensionId, collection, userEmail) {
	await ensureExtensionsTables();
	if (!await getExtension(extensionId)) {
		setResponseStatus(event, 404);
		return { error: "Extension not found" };
	}
	const client = getDbExec();
	const url = event.url;
	const limitParam = url?.searchParams?.get("limit");
	const limit = limitParam ? Math.min(Math.max(1, Number(limitParam)), 1e3) : 100;
	const scope = url?.searchParams?.get("scope") || "user";
	const orgId = getRequestOrgId();
	if (scope === "org") {
		if (!orgId) {
			setResponseStatus(event, 400);
			return { error: "Org context required for scope=org" };
		}
		return (await client.execute({
			sql: `SELECT COALESCE(item_id, id) AS id, tool_id, collection, data, owner_email, scope, org_id, created_at, updated_at
        FROM tool_data
        WHERE tool_id = ? AND collection = ? AND scope = 'org' AND org_id = ?
        ORDER BY created_at DESC
        LIMIT ?`,
			args: [
				extensionId,
				collection,
				orgId,
				limit
			]
		})).rows ?? [];
	}
	if (scope === "all") return (await client.execute({
		sql: `SELECT COALESCE(item_id, id) AS id, tool_id, collection, data, owner_email, scope, org_id, created_at, updated_at
        FROM tool_data
        WHERE tool_id = ? AND collection = ?
          AND ((scope = 'user' AND owner_email = ?) OR (scope = 'org' AND org_id = ?))
        ORDER BY created_at DESC
        LIMIT ?`,
		args: [
			extensionId,
			collection,
			userEmail,
			orgId ?? "",
			limit
		]
	})).rows ?? [];
	return (await client.execute({
		sql: `SELECT COALESCE(item_id, id) AS id, tool_id, collection, data, owner_email, scope, org_id, created_at, updated_at
      FROM tool_data
      WHERE tool_id = ? AND collection = ? AND scope = 'user' AND owner_email = ?
      ORDER BY updated_at DESC
      LIMIT ?`,
		args: [
			extensionId,
			collection,
			userEmail,
			limit
		]
	})).rows ?? [];
}
async function handleExtensionDataUpsert(event, extensionId, collection, userEmail) {
	await ensureExtensionsTables();
	if (!await getExtension(extensionId)) {
		setResponseStatus(event, 404);
		return { error: "Extension not found" };
	}
	const body = await readBody(event);
	if (body.data === void 0) {
		setResponseStatus(event, 400);
		return { error: "data is required" };
	}
	const itemId = String(body.id || randomUUID());
	const data = typeof body.data === "string" ? body.data : JSON.stringify(body.data);
	const now = (/* @__PURE__ */ new Date()).toISOString();
	const scope = body.scope === "org" ? "org" : "user";
	const orgId = getRequestOrgId();
	if (scope === "org" && !orgId) {
		setResponseStatus(event, 400);
		return { error: "Org context required for scope=org" };
	}
	const scopeKey = scope === "org" ? `org:${orgId}` : userEmail;
	const client = getDbExec();
	const conflictClause = isPostgres() ? `ON CONFLICT (tool_id, collection, scope_key, item_id)
       DO UPDATE SET data = EXCLUDED.data, updated_at = EXCLUDED.updated_at` : `ON CONFLICT (tool_id, collection, scope_key, item_id)
       DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at`;
	await client.execute({
		sql: `INSERT INTO tool_data (id, tool_id, collection, item_id, data, owner_email, scope, org_id, scope_key, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
     ${conflictClause}`,
		args: [
			randomUUID(),
			extensionId,
			collection,
			itemId,
			data,
			userEmail,
			scope,
			scope === "org" ? orgId : null,
			scopeKey,
			now,
			now
		]
	});
	return {
		id: itemId,
		extensionId,
		collection,
		data,
		ownerEmail: userEmail,
		scope,
		orgId: scope === "org" ? orgId : null,
		createdAt: now,
		updatedAt: now
	};
}
async function handleExtensionDataDelete(event, extensionId, collection, itemId, userEmail) {
	await ensureExtensionsTables();
	if (!await getExtension(extensionId)) {
		setResponseStatus(event, 404);
		return { error: "Extension not found" };
	}
	const scope = event.url?.searchParams?.get("scope") || "user";
	const orgId = getRequestOrgId();
	const client = getDbExec();
	if (scope === "org") {
		if (!orgId) {
			setResponseStatus(event, 400);
			return { error: "Org context required for scope=org" };
		}
		await client.execute({
			sql: `DELETE FROM tool_data WHERE COALESCE(item_id, id) = ? AND tool_id = ? AND collection = ? AND scope = 'org' AND org_id = ?`,
			args: [
				itemId,
				extensionId,
				collection,
				orgId
			]
		});
		return { ok: true };
	}
	await client.execute({
		sql: `DELETE FROM tool_data WHERE COALESCE(item_id, id) = ? AND tool_id = ? AND collection = ? AND scope = 'user' AND owner_email = ?`,
		args: [
			itemId,
			extensionId,
			collection,
			userEmail
		]
	});
	return { ok: true };
}
async function handleProxy(event, userEmail) {
	const body = await readBody(event);
	const rawUrl = body.url;
	if (!rawUrl || typeof rawUrl !== "string") {
		setResponseStatus(event, 400);
		return { error: "url is required" };
	}
	const method = normalizeExtensionProxyMethod(body.method || "GET");
	if (!method) {
		setResponseStatus(event, 405);
		return { error: "Unsupported HTTP method. Allowed methods: GET, POST, PUT, PATCH, DELETE, HEAD." };
	}
	const rawHeaders = body.headers || {};
	const rawBody = body.body;
	let resolvedUrl = rawUrl;
	let resolvedHeaders = JSON.stringify(rawHeaders);
	let resolvedBody = rawBody;
	const allUsedKeys = [];
	const allSecretValues = [];
	try {
		const urlResult = await resolveKeyReferences(rawUrl, "user", userEmail);
		resolvedUrl = urlResult.resolved;
		allUsedKeys.push(...urlResult.usedKeys);
		allSecretValues.push(...urlResult.secretValues);
		const headerResult = await resolveKeyReferences(resolvedHeaders, "user", userEmail);
		resolvedHeaders = headerResult.resolved;
		allUsedKeys.push(...headerResult.usedKeys);
		allSecretValues.push(...headerResult.secretValues);
		if (rawBody) {
			const bodyResult = await resolveKeyReferences(typeof rawBody === "string" ? rawBody : JSON.stringify(rawBody), "user", userEmail);
			resolvedBody = bodyResult.resolved;
			allUsedKeys.push(...bodyResult.usedKeys);
			allSecretValues.push(...bodyResult.secretValues);
		}
	} catch (err) {
		setResponseStatus(event, 400);
		return { error: `Key resolution failed: ${err?.message ?? err}` };
	}
	const secretValues = collectSecretValues(allSecretValues);
	if (await isBlockedExtensionUrlWithDns(resolvedUrl)) {
		setResponseStatus(event, 403);
		return { error: "Requests to private/internal addresses are not allowed" };
	}
	for (const keyName of new Set(allUsedKeys)) {
		const allowlist = await getKeyAllowlist(keyName, "user", userEmail);
		if (!validateUrlAllowlist(resolvedUrl, allowlist)) {
			setResponseStatus(event, 403);
			return { error: `Key "${keyName}" is not allowed for this URL origin` };
		}
	}
	let headers;
	try {
		headers = sanitizeOutboundHeaders(JSON.parse(resolvedHeaders));
	} catch {
		headers = sanitizeOutboundHeaders(rawHeaders);
	}
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 15e3);
	const dispatcher = await createSsrfSafeDispatcher() ?? void 0;
	try {
		const fetchOpts = {
			method,
			headers,
			signal: controller.signal,
			redirect: "manual"
		};
		if (dispatcher) fetchOpts.dispatcher = dispatcher;
		if (resolvedBody && [
			"POST",
			"PUT",
			"PATCH"
		].includes(method)) {
			const isStringBody = typeof resolvedBody === "string";
			fetchOpts.body = isStringBody ? resolvedBody : JSON.stringify(resolvedBody);
			if (!Object.keys(headers).some((k) => k.toLowerCase() === "content-type")) {
				if (!isStringBody || typeof resolvedBody === "string" && /^\s*[{[]/.test(resolvedBody) && isLikelyJson(resolvedBody)) headers["Content-Type"] = "application/json";
			}
		}
		const response = await fetch(resolvedUrl, fetchOpts);
		if (response.status >= 300 && response.status < 400) {
			const location = response.headers.get("location");
			const redirectUrl = location ? new URL(location, resolvedUrl).href : null;
			if (redirectUrl && await isBlockedExtensionUrlWithDns(redirectUrl)) {
				setResponseStatus(event, 403);
				return { error: "Redirect to private/internal address blocked" };
			}
			if (redirectUrl) {
				for (const keyName of new Set(allUsedKeys)) if (!validateUrlAllowlist(redirectUrl, await getKeyAllowlist(keyName, "user", userEmail))) {
					setResponseStatus(event, 403);
					return { error: `Redirect URL is not allowed for key "${keyName}"` };
				}
			}
			return {
				status: response.status,
				body: { redirect: redirectUrl ? redactString(redirectUrl, secretValues) : location }
			};
		}
		const { text } = await readResponseTextWithLimit(response);
		let responseBody;
		try {
			responseBody = JSON.parse(text);
		} catch {
			responseBody = text;
		}
		return {
			status: response.status,
			body: redactSecrets(responseBody, secretValues)
		};
	} catch (err) {
		if (err?.name === "AbortError") {
			setResponseStatus(event, 504);
			return { error: "Upstream request timed out" };
		}
		setResponseStatus(event, 502);
		return { error: `Proxy request failed: ${redactSecrets(err?.message ?? String(err), secretValues)}` };
	} finally {
		clearTimeout(timeout);
	}
}
/**
* Capture console output from a CLI script that uses console.log for results.
* Same technique as wrapCliScript in agent-chat-plugin.ts.
*/
var captureCliOutputQueue = Promise.resolve();
async function captureCliOutput(fn, args) {
	const previousCapture = captureCliOutputQueue;
	let releaseCapture;
	captureCliOutputQueue = new Promise((resolve) => {
		releaseCapture = resolve;
	});
	await previousCapture;
	const logs = [];
	const origLog = console.log;
	const origError = console.error;
	const origStdoutWrite = process.stdout.write;
	console.log = (...a) => {
		logs.push(a.map(String).join(" "));
	};
	console.error = (...a) => {
		logs.push(a.map(String).join(" "));
	};
	process.stdout.write = ((chunk) => {
		if (typeof chunk === "string") logs.push(chunk);
		else if (Buffer.isBuffer(chunk)) logs.push(chunk.toString());
		return true;
	});
	try {
		await fn(args);
	} catch (err) {
		logs.push(`Error: ${err?.message ?? String(err)}`);
	} finally {
		console.log = origLog;
		console.error = origError;
		process.stdout.write = origStdoutWrite;
		releaseCapture();
	}
	return logs.join("\n") || "(no output)";
}
async function handleSqlQuery(event) {
	const body = await readBody(event);
	const sql = body.sql;
	if (!sql || typeof sql !== "string") {
		setResponseStatus(event, 400);
		return { error: "sql is required" };
	}
	const cleanSql = stripSqlComments(sql);
	if (!/^\s*(SELECT|WITH)\b/i.test(cleanSql)) {
		setResponseStatus(event, 403);
		return { error: "Only SELECT queries are allowed from extensions" };
	}
	if (SENSITIVE_SQL_RE.test(cleanSql)) {
		setResponseStatus(event, 403);
		return { error: "Sensitive framework tables are not readable from extensions" };
	}
	try {
		const mod = await import("./query-C48knjGV.js");
		const args = [
			"--sql",
			sql,
			"--format",
			"json"
		];
		if (body.limit) args.push("--limit", String(body.limit));
		if (body.args !== void 0) {
			if (!Array.isArray(body.args)) {
				setResponseStatus(event, 400);
				return { error: "args must be an array" };
			}
			args.push("--args", JSON.stringify(body.args));
		}
		const output = await captureCliOutput(mod.default, args);
		try {
			return JSON.parse(output);
		} catch {
			return { output };
		}
	} catch (err) {
		setResponseStatus(event, 500);
		return { error: err?.message ?? "Query failed" };
	}
}
var DESTRUCTIVE_SQL_RE = /\b(CREATE\s+(?:(?:LOCAL|GLOBAL)\s+)?(?:TEMPORARY|TEMP)?\s*(TABLE|INDEX|VIEW|SCHEMA|DATABASE|TRIGGER|FUNCTION|EXTENSION|ROLE|TABLESPACE|PUBLICATION|SUBSCRIPTION)|DROP\s+(TABLE|INDEX|VIEW|SCHEMA|DATABASE|TRIGGER|FUNCTION|EXTENSION|ROLE)|TRUNCATE|DELETE\s+FROM\s+(?!tool_data\b)|ALTER\s+(TABLE|VIEW|SCHEMA|DATABASE|FUNCTION|ROLE|EXTENSION|PUBLICATION)\s+(?!tool_data\b)|ATTACH|DETACH|VACUUM|REINDEX|PRAGMA|GRANT|REVOKE|SET\s+ROLE|RESET\s+ROLE|COPY)\b/i;
var SENSITIVE_SQL_RE = /\b(app_secrets|user|users|session|sessions|account|accounts|verification|oauth_tokens|tools|extensions|tool_shares|tool_slots|tool_slot_installs|tool_hidden_extensions|member|organization|invitation|jwks|agent_trace_spans|agent_trace_summaries|agent_feedback|agent_satisfaction_scores|agent_evals|agent_runs|agent_run_events|notifications|progress_runs|integration_configs|integration_pending_tasks|integration_thread_mappings|resources|org_members|org_invitations|bigquery_cache|dashboard_views|pg_catalog|information_schema|pg_class|pg_proc|pg_namespace|pg_user|pg_roles|pg_authid|pg_shadow)\b/i;
var POSITIONAL_INSERT_RE = /\bINSERT\s+INTO\s+["'`]?\w+["'`]?\s+VALUES\b/i;
function stripSqlComments(sql) {
	return sql.replace(/\/\*[\s\S]*?\*\//g, " ").replace(/--[^\n]*/g, " ");
}
function isLikelyJson(text) {
	try {
		const parsed = JSON.parse(text);
		return parsed !== null && typeof parsed === "object";
	} catch {
		return false;
	}
}
async function handleSqlExec(event) {
	const body = await readBody(event);
	const sql = body.sql;
	if (!sql || typeof sql !== "string") {
		setResponseStatus(event, 400);
		return { error: "sql is required" };
	}
	const cleanSql = stripSqlComments(sql);
	if (DESTRUCTIVE_SQL_RE.test(cleanSql)) {
		setResponseStatus(event, 403);
		return { error: "Schema changes and destructive SQL are not allowed from extensions" };
	}
	if (SENSITIVE_SQL_RE.test(cleanSql)) {
		setResponseStatus(event, 403);
		return { error: "Sensitive framework tables are not writable from extensions" };
	}
	if (POSITIONAL_INSERT_RE.test(cleanSql)) {
		setResponseStatus(event, 400);
		return { error: "INSERT must specify an explicit column list (e.g. INSERT INTO t (col1, col2) VALUES (?, ?)) so ownership can be injected." };
	}
	try {
		const mod = await import("./exec-BxndUWgn.js");
		const args = [
			"--sql",
			sql,
			"--format",
			"json"
		];
		if (body.args !== void 0) {
			if (!Array.isArray(body.args)) {
				setResponseStatus(event, 400);
				return { error: "args must be an array" };
			}
			args.push("--args", JSON.stringify(body.args));
		}
		const output = await captureCliOutput(mod.default, args);
		try {
			return JSON.parse(output);
		} catch {
			return { output };
		}
	} catch (err) {
		setResponseStatus(event, 500);
		return { error: err?.message ?? "Exec failed" };
	}
}
//#endregion
export { createExtensionsHandler };
