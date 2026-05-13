import{i as e}from"./chunk-BzcdzF7H.js";import{a as t,n,r,t as i}from"./jsx-runtime-M4lD1_vD.js";import{I as a,R as o,z as s}from"./tooltip-yVTX--9K.js";import{B as c,bt as l,mt as u,q as d,wt as f,z as p}from"./NotificationsBell-C2zJZtZ6.js";import"./frame-D81DE16G.js";import{a as m,o as h,s as g}from"./useBuilderStatus-CAf7KHBQ.js";import{t as _}from"./use-dev-mode-BR1CRuSx.js";import"./provider-env-vars-DnVIJtpW.js";import{Pn as v,t as y}from"./PromptComposer-piCG5UGr.js";import"./settings-BWPH6Bbs.js";import{n as b}from"./IconExternalLink-PXVFqEV4.js";import"./ResourcesPanel-nQWUJLAh.js";import{t as ee}from"./IconKey-CbHSjySR.js";import"./terminal-CrZL61nR.js";var x=`__agentNativeRouteChunkRecoveryInstalled`,S=15e3;function C(){return{intendedHref:null,intendedAt:0,routeModuleFailureAt:0,recoveryHref:null,recovering:!1}}function w(e){return typeof e==`string`&&/Error loading route module `[^`]+`, reloading page\.\.\./.test(e)}function T(e){return typeof e==`string`?e.includes(`Failed to fetch dynamically imported module`)||e.includes(`error loading dynamically imported module`)||e.includes(`Importing a module script failed`):!1}function E(e,t,n=Date.now()){e.intendedHref=t,e.intendedAt=n}function D(e,t,n=Date.now()){return!e.intendedHref||n-e.intendedAt>S||e.intendedHref===t?null:e.intendedHref}function O(e){let t=e;for(;t;){if(t.tagName?.toUpperCase()===`A`&&typeof t.href==`string`)return t;t=t.parentElement}return null}function k(e,t){try{let n=new URL(t,e.location.href);return n.origin===e.location.origin?n.href:null}catch{return null}}function A(e,t){if(t.defaultPrevented||t.button!==0||t.metaKey||t.ctrlKey||t.shiftKey||t.altKey)return null;let n=O(t.target);if(!n||n.hasAttribute(`download`))return null;let r=n.getAttribute(`target`);return r&&r!==`_self`?null:k(e,n.href)}function j(e,t){try{e.location.assign(t)}catch{e.location.href=t}}function M(e){return/AgentNativeDesktop/i.test(e.navigator?.userAgent||``)}function N(e,t){let n=D(t,e.location.href);if(!n)return!1;if(t.recovering=!0,t.recoveryHref=n,M(e))return!0;try{e.history.replaceState(e.history.state,``,n)}catch{}return j(e,n),!0}function P(e,t,n){let r=e.history[n];e.history[n]=function(...n){if(typeof n[2]==`string`||n[2]instanceof URL){let r=k(e,String(n[2]));r&&E(t,r)}return r.apply(this,n)}}function F(e,t){let n=e.location.reload.bind(e.location),r=function(){if(!(M(e)&&Date.now()-t.routeModuleFailureAt<=1e3)){if(t.recoveryHref&&Date.now()-t.routeModuleFailureAt<=1e3){j(e,t.recoveryHref);return}Date.now()-t.routeModuleFailureAt<=1e3&&N(e,t)||n()}};try{Object.defineProperty(e.location,`reload`,{configurable:!0,value:r})}catch{try{e.location.reload=r}catch{}}}function I(e=typeof window>`u`?void 0:window){let t=e?.console;if(!e?.document||!e.location||!e.history||typeof e.addEventListener!=`function`||!t)return;let n=e;if(n[x])return;n[x]=!0;let r=C();e.document.addEventListener(`click`,t=>{let n=A(e,t);n&&E(r,n)},!0),P(e,r,`pushState`),P(e,r,`replaceState`),F(e,r),e.addEventListener(`unhandledrejection`,t=>{let n=t.reason;T(String(n?.message||n||``))&&(r.routeModuleFailureAt=Date.now(),N(e,r)&&t.preventDefault())});let i=t.error.bind(t);try{t.error=(...t)=>{t.some(w)&&(r.routeModuleFailureAt=Date.now(),N(e,r)),i(...t)}}catch{}}var L=e(t(),1),te=o(`outline`,`arrow-up-right`,`ArrowUpRight`,[[`path`,{d:`M17 7l-10 10`,key:`svg-0`}],[`path`,{d:`M8 7l9 0l0 9`,key:`svg-1`}]]),ne=o(`outline`,`book`,`Book`,[[`path`,{d:`M3 19a9 9 0 0 1 9 0a9 9 0 0 1 9 0`,key:`svg-0`}],[`path`,{d:`M3 6a9 9 0 0 1 9 0a9 9 0 0 1 9 0`,key:`svg-1`}],[`path`,{d:`M3 6l0 13`,key:`svg-2`}],[`path`,{d:`M12 6l0 13`,key:`svg-3`}],[`path`,{d:`M21 6l0 13`,key:`svg-4`}]]),R=i();s();var re=new Set([`_agent-native`,`_workspace_static`,`api`,`auth`,`dispatch`,`netlify`,`tools`,...[[`overview`,`overview`],[`login`,`login`],[`signup`,`signup`],[`apps`,`apps`],[`apps/new-app`,`new-app`],[`new-app`,`new-app`],[`vault`,`vault`],[`integrations`,`integrations`],[`agents`,`agents`],[`workspace`,`workspace`],[`messaging`,`messaging`],[`extensions`,`extensions`],[`destinations`,`destinations`],[`identities`,`identities`],[`approval`,`approval`],[`approvals`,`approvals`],[`audit`,`audit`],[`team`,`team`]].map(([e])=>e)]);function ie(e){return/^[a-z][a-z0-9-]*$/.test(e)}function z(e){return re.has(e)?`App name "${e}" conflicts with a reserved workspace route. Choose a different name.`:ie(e)?null:`Invalid app name "${e}". Use lowercase letters, numbers, and hyphens.`}function ae(e){return e.toLowerCase().replace(/[^a-z0-9]+/g,`-`).replace(/^-+|-+$/g,``).replace(/^[^a-z]+/,``).slice(0,48)}function oe(e){return ae(e.replace(/\b(build|create|make|an?|the|app|tool|dashboard)\b/gi,` `).replace(/\s+/g,` `).trim()||`new-app`)||`new-app`}function B(e,t){let r=`/_agent-native/actions/${t}`;return e===null?n(r):`${e.replace(/\/+$/,``)}${r}`}function se(e){return e===`dispatch`||r()===`/dispatch`?null:`/dispatch`}async function V(e,t){let n=await fetch(e,t),r=await n.json().catch(()=>null);if(!n.ok)throw Error(r?.error||r?.message||`Request failed ${n.status}`);return r}function ce(e){let t=e.selectedKeys.join(`, `),n=t?`Requested Dispatch vault key grants for this app: ${t}`:`Requested Dispatch vault key grants for this app: none`,r=e.selectedResources.length?e.selectedResources.map(e=>`- ${e.name} (${e.kind}, ${e.path})`).join(`
`):`none`;return[`Create a new agent-native app in this workspace.`,`This is a new workspace app request, not a feature request for the current app.`,``,`Suggested app name: ${e.appId} (you may adjust the slug if it conflicts)`,`User prompt: ${e.prompt.trim()}`,`If the user mentions a product or company such as Granola, Loom, Superhuman, Linear, or Notion, treat it as product inspiration unless they explicitly ask to connect to that service. Do not invent or require third-party API keys like GRANOLA_API_KEY just because a product is named.`,n,`Requested Dispatch workspace resources for this app:\n${r}`,``,`Pick a starter template that fits the user's prompt — analytics, calendar, content, design, dispatch, forms, mail, slides, clips, or starter when none of the others fit.`,`Use the workspace app layout: create it under apps/${e.appId}, mount it at /${e.appId}, keep it on the shared workspace database/hosting model, and avoid table-name collisions by namespacing any new domain tables to the app.`,`Important routing rule: from outside the app, link to /${e.appId}; inside apps/${e.appId}, React Router routes are app-local. Use <Link to="/review"> and navigate("/review"), not "/${e.appId}/review"; APP_BASE_PATH supplies the mounted prefix, and hardcoding it causes doubled URLs like /${e.appId}/${e.appId}/review.`,`Prefer useActionQuery/useActionMutation for actions. If you must raw-fetch framework endpoints, wrap them with agentNativePath("/_agent-native/actions/<name>") so mounted apps call the right URL.`,`If the user's prompt mentions sibling apps like Mail, Calendar, Dispatch, or other templates, treat them as existing workspace neighbors or integrations. Do not scaffold those sibling apps inside apps/${e.appId} unless the user explicitly asks to create them too.`,`Do not satisfy this by adding a route, page, component, or file inside apps/starter or another existing app unless the user explicitly asks to modify that existing app.`,`Use relative workspace links like /${e.appId}. Do not hardcode localhost, 127.0.0.1, 8080, 8100, or any dev port; the active workspace gateway/browser origin owns the port.`,`Use the framework/template UI stack: shadcn/ui components and @tabler/icons-react. Do not add lucide-react or another icon library for standard UI.`,`Ensure the React Router client entry preserves APP_BASE_PATH/VITE_APP_BASE_PATH via appBasePath().`,t?`After the app exists, grant the selected Dispatch vault keys to appId "${e.appId}" and sync them once the app server is available. Treat these as requested grants, not active grants before creation succeeds.`:`Do not grant any Dispatch vault keys unless the user asks later.`,e.selectedResources.length?`After the app exists, grant the selected Dispatch workspace resources to appId "${e.appId}" and sync them once the app server is available. Add a short note to apps/${e.appId}/AGENTS.md telling the app agent to read relevant shared resources under context/ or the selected resource paths before doing GTM/domain work.`:`Do not grant any Dispatch workspace resources unless the user asks later.`,``,`App readiness requirements before handing off:`,`- Ensure apps/${e.appId}/package.json exists with displayName/name metadata so Dispatch and the workspace gateway discover it from the filesystem. There is no separate workspace app registry to edit.`,`- Update the app manifest/package/deploy metadata needed by the existing workspace deployment model; do not leave the app relying only on local discovery.`,`- Verify the app's agent card/A2A metadata is ready so Dispatch can discover and delegate to the app after deployment.`,`- Include a final verification note covering filesystem discovery, manifest/deploy metadata, relative same-origin routing, and agent-card readiness.`,`When it is ready, start or update the workspace dev server and navigate the user to /${e.appId}.`].join(`
`)}function le({sourceApp:e=`starter`,className:t=``,dispatchBasePath:n}){let[r,i]=(0,L.useState)([]),[a,o]=(0,L.useState)([]),[s,c]=(0,L.useState)([]),[l,u]=(0,L.useState)([]),[d,f]=(0,L.useState)(null),[p,x]=(0,L.useState)(null),[S,C]=(0,L.useState)(null),[w,T]=(0,L.useState)(null),[E,D]=(0,L.useState)(!1),{isDevMode:O}=_(),k=n===void 0?se(e):n;(0,L.useEffect)(()=>{let e=!1,t=B(k,`list-vault-secret-options`),n=B(k,`list-workspace-resource-options`);return V(t).then(t=>{e||(c(Array.isArray(t)?t:[]),f(null))}).catch(t=>{e||(c([]),f(t?.message||`Could not load Dispatch keys`))}),V(n).then(t=>{e||(u(Array.isArray(t)?t:[]),x(null))}).catch(t=>{e||(u([]),x(t?.message||`Could not load Dispatch resources`))}),()=>{e=!0}},[k]);let A=(0,L.useMemo)(()=>s.filter(e=>r.includes(e.id)),[s,r]),j=(0,L.useMemo)(()=>l.filter(e=>a.includes(e.id)),[l,a]),M=r.length===0?`No keys selected`:`${r.length} key${r.length===1?``:`s`} selected`,N=a.length===0?`No resources selected`:`${a.length} resource${a.length===1?``:`s`} selected`;async function P(e){let t=e.trim();if(!t||E)return;let n=oe(t),i=z(n);if(i){C(i);return}let o=ce({appId:n,prompt:t,selectedKeys:A.map(e=>e.credentialKey),selectedResources:j});D(!0),C(null),T(null);try{if(g())h({message:o,submit:!0,type:`code`}),C(`Sent to Builder chat.`);else if(O)h({message:o,submit:!0,type:`code`,newTab:!0}),C(`Sent to the local agent.`);else{let e=await V(B(k,`start-workspace-app-creation`),{method:`POST`,headers:{"Content-Type":`application/json`},body:JSON.stringify({prompt:t,appId:n,secretIds:r,resourceIds:a})});e?.mode===`builder`?(T(e?.url||null),C(`Builder branch created.`)):C(e?.message||`Builder app creation is coming soon here. Open this workspace in Builder to create an app from this prompt.`)}}catch(e){C(e?.message||`Could not start the new app flow.`)}finally{D(!1)}}function F(e){i(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])}function I(e){o(t=>t.includes(e)?t.filter(t=>t!==e):[...t,e])}return(0,R.jsx)(`section`,{className:`mx-auto flex w-full max-w-5xl flex-col gap-5 px-4 py-6 ${t}`,children:(0,R.jsxs)(`div`,{className:`grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]`,children:[(0,R.jsxs)(`div`,{className:`flex flex-col gap-3`,children:[(0,R.jsx)(y,{autoFocus:!0,disabled:E,placeholder:`Describe the app your teammate should be able to use...`,draftScope:`dispatch:new-app`,preserveDraftOnSubmit:!0,onSubmit:e=>P(e)}),S?(0,R.jsxs)(`div`,{className:`rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground`,children:[S,w?(0,R.jsxs)(`a`,{href:w,target:`_blank`,rel:`noreferrer`,className:`ml-2 inline-flex items-center gap-1 font-medium text-foreground underline`,children:[`Open branch `,(0,R.jsx)(te,{className:`h-3 w-3`})]}):null]}):null]}),(0,R.jsxs)(`aside`,{className:`overflow-hidden rounded-lg border border-border bg-card`,children:[(0,R.jsx)(`div`,{className:`border-b border-border px-4 py-3`,children:(0,R.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,R.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,R.jsx)(ee,{className:`h-4 w-4`}),`Dispatch keys`]}),(0,R.jsx)(`span`,{className:`shrink-0 rounded border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground`,children:M})]})}),(0,R.jsx)(`div`,{className:`max-h-[220px] space-y-2 overflow-y-auto p-3`,children:d?(0,R.jsx)(`p`,{className:`rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground`,children:d}):s.length===0?(0,R.jsx)(`p`,{className:`rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground`,children:`No Dispatch vault keys found yet.`}):s.map(e=>{let t=r.includes(e.id);return(0,R.jsxs)(`div`,{className:`group rounded-md border text-sm transition ${t?`border-primary/45 bg-primary/5 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.08)]`:`border-border bg-background/25 text-foreground hover:border-muted-foreground/40 hover:bg-accent/35`}`,children:[(0,R.jsxs)(`button`,{type:`button`,"aria-pressed":t,onClick:()=>F(e.id),className:`flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30`,children:[(0,R.jsx)(`span`,{className:`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${t?`border-primary/60 bg-primary/10 text-primary`:`border-muted-foreground/35 text-transparent group-hover:border-muted-foreground/60`}`,children:t?(0,R.jsx)(b,{className:`h-3 w-3`}):null}),(0,R.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,R.jsx)(`span`,{className:`block truncate font-medium`,children:e.credentialKey}),(0,R.jsx)(`span`,{className:`block truncate text-xs text-muted-foreground/70`,children:t?`Will be requested for this app`:`Click to request`})]})]}),(0,R.jsxs)(`details`,{className:`group/details border-t border-border/60 px-3 py-1.5 text-xs text-muted-foreground/75 open:bg-background/10`,children:[(0,R.jsxs)(`summary`,{className:`flex cursor-pointer list-none items-center gap-1.5 text-[11px] hover:text-muted-foreground [&::-webkit-details-marker]:hidden`,children:[(0,R.jsx)(m,{className:`h-3 w-3 transition-transform group-open/details:rotate-180`}),`Details`]}),(0,R.jsxs)(`div`,{className:`mt-1.5 space-y-1 pb-0.5 pl-4`,children:[(0,R.jsxs)(`div`,{className:`truncate`,children:[`Provider: `,e.provider||`Not specified`]}),(0,R.jsxs)(`div`,{className:`truncate`,children:[`Name: `,e.name]})]})]})]},e.id)})}),(0,R.jsx)(`div`,{className:`border-y border-border px-4 py-3`,children:(0,R.jsxs)(`div`,{className:`flex items-center justify-between gap-3`,children:[(0,R.jsxs)(`div`,{className:`flex items-center gap-2 text-sm font-medium`,children:[(0,R.jsx)(ne,{className:`h-4 w-4`}),`Resource packs`]}),(0,R.jsx)(`span`,{className:`shrink-0 rounded border border-border bg-background/40 px-2 py-0.5 text-[11px] text-muted-foreground`,children:N})]})}),(0,R.jsx)(`div`,{className:`max-h-[220px] space-y-2 overflow-y-auto p-3`,children:p?(0,R.jsx)(`p`,{className:`rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground`,children:p}):l.length===0?(0,R.jsx)(`p`,{className:`rounded-md border border-dashed border-border px-3 py-3 text-xs text-muted-foreground`,children:`No Dispatch resource packs found yet.`}):l.map(e=>{let t=a.includes(e.id);return(0,R.jsxs)(`div`,{className:`group rounded-md border text-sm transition ${t?`border-primary/45 bg-primary/5 text-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.08)]`:`border-border bg-background/25 text-foreground hover:border-muted-foreground/40 hover:bg-accent/35`}`,children:[(0,R.jsxs)(`button`,{type:`button`,"aria-pressed":t,onClick:()=>I(e.id),className:`flex w-full cursor-pointer items-start gap-3 rounded-md px-3 py-2 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30`,children:[(0,R.jsx)(`span`,{className:`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded border transition ${t?`border-primary/60 bg-primary/10 text-primary`:`border-muted-foreground/35 text-transparent group-hover:border-muted-foreground/60`}`,children:t?(0,R.jsx)(b,{className:`h-3 w-3`}):null}),(0,R.jsxs)(`span`,{className:`min-w-0 flex-1`,children:[(0,R.jsxs)(`span`,{className:`flex min-w-0 items-center gap-1.5`,children:[(0,R.jsx)(v,{className:`h-3.5 w-3.5 shrink-0 text-muted-foreground/70`}),(0,R.jsx)(`span`,{className:`block truncate font-medium`,children:e.name})]}),(0,R.jsxs)(`span`,{className:`block truncate text-xs text-muted-foreground/70`,children:[e.kind,` · `,e.path]})]})]}),(0,R.jsxs)(`details`,{className:`group/details border-t border-border/60 px-3 py-1.5 text-xs text-muted-foreground/75 open:bg-background/10`,children:[(0,R.jsxs)(`summary`,{className:`flex cursor-pointer list-none items-center gap-1.5 text-[11px] hover:text-muted-foreground [&::-webkit-details-marker]:hidden`,children:[(0,R.jsx)(m,{className:`h-3 w-3 transition-transform group-open/details:rotate-180`}),`Details`]}),(0,R.jsxs)(`div`,{className:`mt-1.5 space-y-1 pb-0.5 pl-4`,children:[(0,R.jsxs)(`div`,{className:`truncate`,children:[`Scope:`,` `,e.scope===`all`?`All apps`:`Selected apps`]}),e.description?(0,R.jsx)(`div`,{className:`line-clamp-2`,children:e.description}):null]})]})]},e.id)})})]})]})})}var H=`mt-6 inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow-sm hover:bg-primary/90 cursor-pointer`;function ue(){(0,L.useEffect)(()=>{let e=document.documentElement;if(!(e.classList.contains(`dark`)||e.classList.contains(`light`)))try{let t=localStorage.getItem(`theme`);t===`dark`?e.classList.add(`dark`):t===`light`?e.classList.add(`light`):window.matchMedia(`(prefers-color-scheme: dark)`).matches&&e.classList.add(`dark`)}catch{}},[])}function U({error:e,canUseRouterLink:t}){let n=null,r=`Something went wrong`,i=`An unexpected error occurred.`;return u(e)?(n=e.status,e.status===404?(r=`Page not found`,i=`The app does not define a route for ${typeof window<`u`?window.location.pathname:`this path`}. If this should be a workspace app, make sure it is added and enabled in Dispatch; if it is a new screen, it may need to be shipped first.`):(r=`${e.status} Error`,i=e.statusText||i)):e instanceof Error?e.message&&(i=e.message):typeof e==`string`&&e&&(i=e),typeof console<`u`&&e&&console.error(`[ErrorBoundary]`,e),(0,R.jsx)(`main`,{className:`flex items-center justify-center min-h-screen p-4 bg-background text-foreground`,children:(0,R.jsxs)(`div`,{className:`flex flex-col items-center text-center max-w-md`,children:[n&&(0,R.jsx)(`span`,{className:`text-7xl font-bold tracking-tight text-muted-foreground/40`,children:n}),(0,R.jsx)(`h1`,{className:`mt-3 text-2xl font-semibold`,children:r}),(0,R.jsx)(`p`,{className:`mt-2 text-muted-foreground text-sm`,children:i}),t?(0,R.jsx)(d,{to:`/`,className:H,children:`Go home`}):(0,R.jsx)(`a`,{href:`/`,className:H,children:`Go home`}),(0,R.jsx)(`button`,{type:`button`,onClick:()=>window.location.reload(),className:`mt-3 inline-flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-accent`,children:`Reload`}),void 0]})})}function de(){return(0,R.jsx)(U,{error:f(),canUseRouterLink:!0})}function fe(){return ue(),l()?(0,R.jsx)(de,{}):(0,R.jsx)(U,{error:void 0,canUseRouterLink:!1})}function pe({children:e,fallback:t}){let[n,r]=(0,L.useState)(!1);return(0,L.useEffect)(()=>r(!0),[]),n?e:t??null}function me(){return(0,R.jsxs)(`div`,{style:{display:`flex`,alignItems:`center`,justifyContent:`center`,height:`100vh`,width:`100%`},children:[(0,R.jsx)(`svg`,{role:`status`,"aria-label":`Loading`,width:24,height:24,viewBox:`0 0 24 24`,fill:`none`,stroke:`currentColor`,strokeWidth:2,strokeLinecap:`round`,strokeLinejoin:`round`,style:{animation:`an-spin 1s linear infinite`,opacity:.7},children:(0,R.jsx)(`path`,{d:`M21 12a9 9 0 1 1-6.219-8.56`})}),(0,R.jsx)(`style`,{children:`
        @keyframes an-spin { to { transform: rotate(360deg) } }
        @media (prefers-color-scheme: dark) {
          html { background: #09090b; color: #fafafa }
        }
      `})]})}function he(){return`
(function() {
  var RELOAD_KEY = "__an_optimize_reload";
  var MAX_RELOADS = 3;
  var RESET_AFTER_MS = 8000;

  var reloadTimer = null;
  var overlayShown = false;

  // Track recent reloads in sessionStorage. If we reload too many times
  // in a short window, stop and show a manual-refresh message instead of
  // looping forever.
  function readReloadHistory() {
    try {
      var raw = sessionStorage.getItem(RELOAD_KEY);
      if (!raw) return [];
      var arr = JSON.parse(raw);
      var cutoff = Date.now() - 30000;
      return Array.isArray(arr) ? arr.filter(function(t) { return t > cutoff; }) : [];
    } catch (e) { return []; }
  }
  function recordReload() {
    try {
      var history = readReloadHistory();
      history.push(Date.now());
      sessionStorage.setItem(RELOAD_KEY, JSON.stringify(history));
    } catch (e) {}
  }
  // Reset the counter after a stable period (page didn't fail again).
  setTimeout(function() {
    try { sessionStorage.removeItem(RELOAD_KEY); } catch (e) {}
  }, RESET_AFTER_MS);

  function showOverlay(title, subtitle) {
    if (overlayShown) return;
    overlayShown = true;
    var mount = function() {
      if (!document.body) { setTimeout(mount, 16); return; }
      var el = document.createElement("div");
      el.id = "__an-reload-overlay";
      el.style.cssText = [
        "position:fixed","inset:0","z-index:2147483647",
        "display:flex","align-items:center","justify-content:center",
        "background:rgba(0,0,0,0.6)","backdrop-filter:blur(8px)",
        "-webkit-backdrop-filter:blur(8px)",
        "font-family:-apple-system,BlinkMacSystemFont,system-ui,sans-serif",
        "color:#fff","font-size:14px"
      ].join(";");
      el.innerHTML =
        '<div style="background:#171717;padding:20px 24px;border-radius:12px;' +
        'border:1px solid rgba(255,255,255,0.1);max-width:340px;text-align:center;' +
        'box-shadow:0 20px 60px rgba(0,0,0,0.5)">' +
        '<div style="font-weight:600;margin-bottom:6px">' + title + '</div>' +
        '<div style="font-size:12px;opacity:0.7">' + subtitle + '</div>' +
        '</div>';
      document.body.appendChild(el);
    };
    mount();
  }

  function scheduleReload(reason) {
    if (reloadTimer) return;
    var history = readReloadHistory();
    if (history.length >= MAX_RELOADS) {
      console.warn("[agent-native] Dev server keeps re-bundling. Manual refresh needed.", reason);
      showOverlay(
        "Dev server out of sync",
        "Auto-reload gave up after " + MAX_RELOADS + " tries. Refresh the page (\\u2318R / Ctrl+R)."
      );
      return;
    }
    console.log("[agent-native] Vite re-bundled deps (" + reason + "), reloading\\u2026");
    recordReload();
    // First reload is silent. One refresh almost always fixes it and the
    // overlay flash is more disruptive than the reload itself. Only show
    // the overlay starting on the second attempt, when something is clearly
    // taking longer than expected.
    if (history.length >= 1) {
      showOverlay("Updating dev server\\u2026", "Reloading the page");
    }
    reloadTimer = setTimeout(function() { window.location.reload(); }, 300);
  }

  function looksLikeViteFailureMessage(message) {
    if (!message) return false;
    return message.indexOf("Failed to fetch dynamically imported module") !== -1
        || message.indexOf("error loading dynamically imported module") !== -1
        || message.indexOf("Importing a module script failed") !== -1
        || message.indexOf("Outdated Optimize Dep") !== -1
        || message.indexOf("Optimize Deps Processing Error") !== -1
        || (message.indexOf("504") !== -1 && (
          message.indexOf(".vite/deps") !== -1 ||
          message.indexOf("/node_modules/.vite/deps/") !== -1
        ));
  }

  function looksLikeViteDep(url) {
    if (!url) return false;
    // Only treat same-origin URLs as Vite deps. Do not reload the page
    // because some third-party CDN script 404'd.
    try {
      var u = new URL(url, window.location.href);
      if (u.origin !== window.location.origin) return false;
    } catch (e) { return false; }
    return url.indexOf("/node_modules/.vite/deps/") !== -1
        || url.indexOf("/@fs/") !== -1
        || url.indexOf("/@id/") !== -1
        || url.indexOf("?v=") !== -1
        || url.indexOf("?import") !== -1
        || /\\.(m?js|ts|tsx|jsx)(\\?|$)/.test(url);
  }

  // 1) <script type="module"> / <link> 504. These fire on the element, not
  //    window, so use capture phase to catch resource load errors.
  window.addEventListener("error", function(e) {
    var t = e.target;
    if (!t || t === window) {
      var message = String(e.message || "");
      if (looksLikeViteFailureMessage(message)) {
        scheduleReload("window error");
      }
      return;
    }
    var tag = t.tagName;
    if (tag !== "SCRIPT" && tag !== "LINK") return;
    var url = t.src || t.href || "";
    if (looksLikeViteDep(url)) {
      var name = url.split("/").pop();
      scheduleReload("script 504: " + name);
    }
  }, true);

  // Vite's documented hook for failed dynamic-import preloads. This mostly
  // targets production chunk skew, but it also fires for some dev optimizer
  // races, so wire it into the same guarded reload path.
  window.addEventListener("vite:preloadError", function(e) {
    var payload = e && e.payload;
    var msg = String((payload && (payload.message || payload)) || "");
    if (!msg || looksLikeViteFailureMessage(msg)) {
      if (e.preventDefault) e.preventDefault();
      scheduleReload("preload error");
    }
  });

  // 2) Dynamic import failures (React Router code splitting, lazy components).
  window.addEventListener("unhandledrejection", function(e) {
    var msg = String((e.reason && (e.reason.message || e.reason)) || "");
    if (looksLikeViteFailureMessage(msg)) {
      scheduleReload("dynamic import");
    }
  });

  // Static module-graph fetch failures for child imports don't always surface
  // as element errors or rejections. Chrome exposes the HTTP status via
  // Resource Timing; when available, use it as a final safety net.
  var seenResources = {};
  function checkResourceEntry(entry) {
    var url = entry && entry.name;
    if (!url || seenResources[url]) return;
    seenResources[url] = true;
    if (!looksLikeViteDep(url)) return;
    if (entry.responseStatus === 504) {
      var name = url.split("/").pop();
      scheduleReload("resource 504: " + name);
    }
  }
  function checkExistingResources() {
    try {
      var entries = performance.getEntriesByType("resource") || [];
      for (var i = 0; i < entries.length; i++) checkResourceEntry(entries[i]);
    } catch (e) {}
  }
  if (window.PerformanceObserver) {
    try {
      var observer = new PerformanceObserver(function(list) {
        var entries = list.getEntries();
        for (var i = 0; i < entries.length; i++) checkResourceEntry(entries[i]);
      });
      observer.observe({ type: "resource", buffered: true });
    } catch (e) {
      setTimeout(checkExistingResources, 0);
    }
  } else {
    setTimeout(checkExistingResources, 0);
  }
})();`}function ge(){let e={BASE_URL:`/`,DEV:!1,MODE:`production`,PROD:!0,SSR:!1};return typeof process<`u`||e?.PROD===!0?!1:(e?.DEV,!0)}function _e(e){return e===`light`||e===`dark`||e===`system`?e:`system`}function ve(e=`system`,t=!0){let n=_e(e),r=t?`true`:`false`,i=`(function(){try{var defaultTheme=${JSON.stringify(n)};var enableSystem=${r};var stored=window.localStorage.getItem('theme');var valid=stored==='light'||stored==='dark'||stored==='system'||stored==='auto';var mode=valid?stored:defaultTheme;if(mode==='auto')mode='system';if(!enableSystem&&mode==='system')mode=defaultTheme==='system'?'light':defaultTheme;if(!valid){window.localStorage.removeItem('theme')}else if(stored!==mode){window.localStorage.setItem('theme',mode)}var prefersDark=enableSystem&&mode==='system'&&window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;var resolved=mode==='system'?(prefersDark?'dark':'light'):mode;var root=document.documentElement;root.classList.remove('light','dark');root.classList.add(resolved);if(mode==='system'){root.removeAttribute('data-theme')}else{root.setAttribute('data-theme',mode)}root.style.colorScheme=resolved;}catch(e){}})();`;return ge()?`${i}\n${he()}`:i}ve();var W=(0,L.createContext)(null);function ye(){let e=(0,L.useContext)(W);if(!e)throw Error(`CommandMenu.* must be used inside <CommandMenu>`);return e}function be(){window.dispatchEvent(new Event(`agent-panel:open`))}function G(){window.dispatchEvent(new CustomEvent(`agent-panel:set-mode`,{detail:{mode:`chat`}})),be()}function xe(e){G(),h({message:e,submit:!0})}function K({heading:e,children:t}){return(0,R.jsxs)(`div`,{className:`overflow-hidden p-1 text-foreground`,children:[e&&(0,R.jsx)(`div`,{className:`px-2 py-1.5 text-xs font-medium text-muted-foreground`,children:e}),t]})}function q({onSelect:e,children:t,keywords:n,className:r}){let{onOpenChange:i,containerRef:o,setSelectedIndex:s}=ye(),c=(0,L.useRef)(null);return(0,R.jsx)(`div`,{ref:c,className:a(`relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none`,r),onClick:()=>{i(!1),setTimeout(e,50)},onMouseEnter:()=>{if(!o.current||!c.current)return;let e=o.current.querySelectorAll(`[role="option"]`),t=Array.from(e).indexOf(c.current);t>=0&&s(t)},role:`option`,children:t})}function Se({children:e,className:t}){return(0,R.jsx)(`span`,{className:a(`ml-auto text-xs tracking-widest text-muted-foreground`,t),children:e})}function J({className:e}){return(0,R.jsx)(`div`,{className:a(`-mx-1 my-1 h-px bg-border`,e)})}function Y({open:e,onOpenChange:t,children:n,placeholder:r=`Type a command or ask AI...`,emptyText:i=`No commands found.`,showAgentFallback:o=!0,className:s}){let[l,u]=(0,L.useState)(``),[d,f]=(0,L.useState)(0),m=(0,L.useRef)(null),h=(0,L.useRef)(null);(0,L.useEffect)(()=>{e&&(u(``),f(0),requestAnimationFrame(()=>{m.current?.focus()}))},[e]),(0,L.useEffect)(()=>{f(0)},[l]),(0,L.useEffect)(()=>{let e=h.current?.querySelectorAll(`[role="option"]`);e&&e[d]&&e[d].scrollIntoView({block:`nearest`})},[d]),(0,L.useEffect)(()=>{let e=h.current?.querySelectorAll(`[role="option"]`);e&&e.forEach((e,t)=>{let n=e;t===d?(n.style.backgroundColor=`hsl(var(--accent))`,n.style.color=`hsl(var(--accent-foreground))`):(n.style.backgroundColor=``,n.style.color=``)})}),(0,L.useEffect)(()=>{if(!e)return;let n=e=>{e.key===`Escape`&&(e.preventDefault(),t(!1))};return document.addEventListener(`keydown`,n),()=>document.removeEventListener(`keydown`,n)},[e,t]),(0,L.useEffect)(()=>{if(!e)return;let n=e=>{h.current&&!h.current.contains(e.target)&&t(!1)};return document.addEventListener(`mousedown`,n,!0),()=>document.removeEventListener(`mousedown`,n,!0)},[e,t]);let g=(0,L.useCallback)(()=>{if(t(!1),!l.trim()){G();return}xe(l.trim())},[l,t]),_=e=>{let t=h.current?.querySelectorAll(`[role="option"]`),n=t?.length??0;e.key===`ArrowDown`?(e.preventDefault(),f(e=>(e+1)%n||0)):e.key===`ArrowUp`?(e.preventDefault(),f(e=>(e-1+n)%n||0)):e.key===`Enter`&&(e.preventDefault(),t&&t[d]&&t[d].click())};if(!e)return null;let v=e=>L.Children.map(e,e=>{if(!L.isValidElement(e))return e;let t=e.props;if(e.type===K){let n=v(t.children);return L.Children.count(n)>0?L.cloneElement(e,{...t,children:n}):null}if(e.type===q){if(!l)return e;let n=X(t.children).toLowerCase(),r=(t.keywords||[]).join(` `).toLowerCase(),i=l.toLowerCase();return n.includes(i)||r.includes(i)?e:null}return e.type===J&&l?null:e}),y=v(n),b=L.Children.toArray(y).some(e=>L.isValidElement(e)&&e.type===K);return(0,R.jsx)(`div`,{className:`fixed inset-0 z-50 bg-black/50`,children:(0,R.jsx)(`div`,{ref:h,className:a(`fixed left-1/2 top-[15vh] -translate-x-1/2 w-full max-w-lg`,`rounded-lg border border-border bg-popover text-popover-foreground shadow-lg`,s),children:(0,R.jsxs)(W.Provider,{value:{search:l,onOpenChange:t,containerRef:h,setSelectedIndex:f},children:[(0,R.jsxs)(`div`,{className:`flex items-center border-b px-3`,children:[(0,R.jsx)(p,{className:`mr-2 h-4 w-4 shrink-0 opacity-50`}),(0,R.jsx)(`input`,{ref:m,value:l,onChange:e=>u(e.target.value),onKeyDown:_,placeholder:r,className:`flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50`})]}),(0,R.jsxs)(`div`,{className:`max-h-[300px] overflow-y-auto overflow-x-hidden`,children:[b&&y,o&&(0,R.jsxs)(R.Fragment,{children:[b&&(0,R.jsx)(J,{}),(0,R.jsx)(`div`,{className:`p-1`,children:(0,R.jsxs)(`div`,{className:`relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-2 text-sm outline-none`,onClick:g,onMouseEnter:e=>{let t=h.current?.querySelectorAll(`[role="option"]`);if(!t)return;let n=Array.from(t).indexOf(e.currentTarget);n>=0&&f(n)},role:`option`,children:[(0,R.jsx)(c,{className:`h-4 w-4 text-muted-foreground`}),(0,R.jsx)(`span`,{children:l.trim()?(0,R.jsxs)(R.Fragment,{children:[`Ask AI:`,` `,(0,R.jsxs)(`span`,{className:`text-muted-foreground`,children:[`"`,l,`"`]})]}):(0,R.jsx)(`span`,{className:`text-muted-foreground`,children:`Ask AI anything...`})}),l.trim()&&(0,R.jsx)(`span`,{className:`ml-auto text-xs text-muted-foreground`,children:`↵`})]})})]})]})]})})})}function X(e){return typeof e==`string`?e:typeof e==`number`?String(e):e?Array.isArray(e)?e.map(X).join(` `):L.isValidElement(e)&&e.props.children?X(e.props.children):``:``}Y.Group=K,Y.Item=q,Y.Shortcut=Se,Y.Separator=J;function Ce(e){(0,L.useEffect)(()=>{let t=t=>{if((t.metaKey||t.ctrlKey)&&t.key===`k`){let n=t.target;if(n.tagName===`INPUT`||n.tagName===`TEXTAREA`||n.isContentEditable)return;t.preventDefault(),e()}};return document.addEventListener(`keydown`,t),()=>document.removeEventListener(`keydown`,t)},[e])}var Z=new Map,we=new Set;function Te(){for(let e of we)try{e()}catch{}}function Ee(e){if(!e||typeof e.id!=`string`||!e.id)throw Error(`registerDevPanel: panel.id is required`);return Z.set(e.id,e),Te(),()=>{Z.get(e.id)===e&&(Z.delete(e.id),Te())}}var De=`agent-native-dev-overlay-`,Q=!1;function Oe(){Q||(Q=!0,Ee({id:`framework-onboarding`,label:`Onboarding`,description:`Preview the new-user onboarding flow without resetting your own setup.`,order:10,options:[{id:`show-as-new-user`,label:`Show onboarding as new user`,description:`Renders the real onboarding panel with all steps incomplete.`,type:`boolean`,default:!1,onChange:e=>{e&&typeof window<`u`&&window.dispatchEvent(new Event(`agent-panel:open`))}}]}))}if(Oe(),`${De}`,`${De}`,typeof document<`u`&&!document.getElementById(`agent-native-dev-overlay-keyframes`)){let e=document.createElement(`style`);e.id=`agent-native-dev-overlay-keyframes`,e.textContent=`@keyframes spin { to { transform: rotate(360deg); } }`,document.head.appendChild(e)}var $=`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0`;a($,`h-9 px-3 border border-input bg-background hover:bg-accent hover:text-accent-foreground`),a($,`h-9 px-4 bg-primary text-primary-foreground hover:bg-primary/90`),a($,`h-8 w-8 p-0 text-muted-foreground hover:bg-accent hover:text-accent-foreground`),n(`/_agent-native/observability`),I();export{pe as a,z as c,me as i,ne as l,Ce as n,fe as o,ve as r,le as s,Y as t,te as u};