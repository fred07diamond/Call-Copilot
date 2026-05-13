import{i as e}from"./chunk-BzcdzF7H.js";import{a as t,n,t as r}from"./jsx-runtime-M4lD1_vD.js";import{t as i}from"./preload-helper-DL2DwvxV.js";import{i as a,n as o}from"./frame-D81DE16G.js";var s=r(),c=e(t(),1),l=!1;function u(){if(l||typeof document>`u`)return;l=!0;let e=document.createElement(`style`);e.textContent=`
    .xterm { position: relative; user-select: none; }
    .xterm.focus, .xterm:focus { outline: none; }
    .xterm .xterm-helpers { position: absolute; top: 0; z-index: 5; }
    .xterm .xterm-helper-textarea {
      padding: 0; border: 0; margin: 0;
      position: absolute; opacity: 0; left: -9999em; top: 0;
      width: 0; height: 0; z-index: -5;
      white-space: nowrap; overflow: hidden; resize: none;
    }
    .xterm .composition-view { display: none; position: absolute; white-space: nowrap; z-index: 1; }
    .xterm .composition-view.active { display: block; }
    .xterm .xterm-viewport {
      background-color: #000; overflow-y: scroll;
      cursor: default; position: absolute; right: 0; left: 0; top: 0; bottom: 0;
    }
    .xterm .xterm-screen { position: relative; }
    .xterm .xterm-screen canvas { position: absolute; left: 0; top: 0; }
    .xterm .xterm-scroll-area { visibility: hidden; }
    .xterm-char-measure-element {
      display: inline-block; visibility: hidden; position: absolute; top: 0; left: -9999em;
      line-height: normal;
    }
    .xterm.enable-mouse-events { cursor: default; }
    .xterm.xterm-cursor-pointer, .xterm .xterm-cursor-pointer { cursor: pointer; }
    .xterm.column-select.focus { cursor: crosshair; }
    .xterm .xterm-accessibility:not(.debug),
    .xterm .xterm-message { position: absolute; left: 0; top: 0; bottom: 0; right: 0; z-index: 10; color: transparent; pointer-events: none; }
    .xterm .xterm-accessibility-tree:not(.debug) *::selection { color: transparent; }
    .xterm .xterm-accessibility-tree { user-select: text; white-space: pre; }
    .xterm .live-region { position: absolute; left: -9999px; width: 1px; height: 1px; overflow: hidden; }
    .xterm .xterm-dim { opacity: 0.5; }
    .xterm .xterm-underline-1 { text-decoration: underline; }
    .xterm .xterm-underline-2 { text-decoration: double underline; }
    .xterm .xterm-underline-3 { text-decoration: wavy underline; }
    .xterm .xterm-underline-4 { text-decoration: dotted underline; }
    .xterm .xterm-underline-5 { text-decoration: dashed underline; }
    .xterm .xterm-overline { text-decoration: overline; }
    .xterm .xterm-strikethrough { text-decoration: line-through; }
    .xterm .xterm-screen .xterm-decoration-container .xterm-decoration { z-index: 6; position: absolute; }
    .xterm .xterm-screen .xterm-decoration-container .xterm-decoration.xterm-decoration-top-layer { z-index: 7; }
    .xterm .xterm-decoration-overview-ruler { z-index: 8; position: absolute; top: 0; right: 0; pointer-events: none; }
    .xterm .xterm-decoration-top { z-index: 2; position: relative; }
  `,document.head.appendChild(e)}var d={background:`#111`,foreground:`#e0e0e0`,cursor:`#58a6ff`,selectionBackground:`#264f78`,black:`#484f58`,red:`#ff7b72`,green:`#3fb950`,yellow:`#d29922`,blue:`#58a6ff`,magenta:`#bc8cff`,cyan:`#39d353`,white:`#b1bac4`};function f(e){return e.includes(`:`)&&!e.startsWith(`[`)?`[${e}]`:e}function p({command:e,flags:t,wsUrl:r,hideInFrame:l=!0,theme:p,fontSize:m=12,className:h,style:g,onConnectionChange:_,onAgentRunningChange:v}){let y=(0,c.useRef)(null),[b,x]=(0,c.useState)(!1),[S,C]=(0,c.useState)(null),[w,T]=(0,c.useState)(!1);if((0,c.useEffect)(()=>{if(!l)return;let e=()=>{o()&&T(!0)};e();let t=setTimeout(e,500);return()=>clearTimeout(t)},[l]),(0,c.useEffect)(()=>{_?.(b)},[b,_]),(0,c.useEffect)(()=>{if(typeof window>`u`||l&&w)return;let o=y.current;if(!o)return;let s=!1,c=null,h=null;async function g(){let[{Terminal:l},{FitAddon:g},{WebLinksAddon:_}]=await Promise.all([i(()=>import(`./xterm-CQRqpa2e.js`),[]),i(()=>import(`./addon-fit-DZKSnxdv.js`),[]),i(()=>import(`./addon-web-links-DrOVNrtC.js`),[])]);if(s||!o)return;u();let y=new l({cursorBlink:!0,fontSize:m,fontFamily:`'SF Mono', 'Fira Code', 'Cascadia Code', Menlo, monospace`,theme:{...d,...p}}),b=new g,S=new _((e,t)=>{window.open(t,`_blank`,`noopener`)});y.loadAddon(b),y.loadAddon(S),y.open(o);let w=!1;function T(){w||(w=!0,requestAnimationFrame(()=>{if(w=!1,!(s||!o.isConnected||o.clientWidth<=0||o.clientHeight<=0))try{b.fit(),z()}catch{}}))}T();let E=[setTimeout(T,50),setTimeout(T,250)],D=()=>T();window.addEventListener(`focus`,D),document.addEventListener(`visibilitychange`,D);let O=new ResizeObserver(()=>{T()});O.observe(o);let k=!1;function A(){k||(k=!0,E.forEach(clearTimeout),window.removeEventListener(`focus`,D),document.removeEventListener(`visibilitychange`,D),O.disconnect(),y.dispose())}let j=r,M=e;if(!j)try{let e=await(await fetch(n(`/_agent-native/agent-terminal-info`))).json();if(!e.available){C(e.error||`Agent terminal not available`),A();return}j=`${location.protocol===`https:`?`wss:`:`ws:`}//${f(location.hostname)}:${e.wsPort}/ws`,!M&&e.command&&(M=e.command)}catch{C(`Failed to discover terminal server`),A();return}let N=new URLSearchParams;M&&N.set(`command`,M),t&&N.set(`flags`,t);let P=N.toString(),F=P?`${j}?${P}`:j;y.write(`\x1b[2m[terminal] Starting ${M||`CLI`}...\x1b[0m\r\n`);let I=!1,L=null,R=0;function z(){c&&c.readyState===WebSocket.OPEN&&y&&c.send(JSON.stringify({type:`resize`,cols:y.cols,rows:y.rows}))}function B(e){v?.(e),window.dispatchEvent(new CustomEvent(`agentNative.chatRunning`,{detail:{isRunning:e}}))}function V(e){let t=++R;c&&=(c.close(),null);let n=new WebSocket(e);n.binaryType=`arraybuffer`,c=n,n.onopen=()=>{x(!0),C(null),n.send(JSON.stringify({type:`resize`,cols:y.cols,rows:y.rows}))},n.onmessage=e=>{let t=e.data instanceof ArrayBuffer?new TextDecoder().decode(e.data):e.data;try{let e=JSON.parse(t);if(e.type===`setup-status`){(e.status===`not-found`||e.status===`failed`)&&(C(e.message),R++);return}}catch{}C(null),y.write(t),t.includes(`❯`)||t.includes(`\x1B[?25h`)?(L&&clearTimeout(L),L=setTimeout(()=>{I&&(I=!1,B(!1))},600)):I&&L&&clearTimeout(L)},n.onclose=()=>{x(!1),R===t&&!s&&(y.write(`\r
\x1B[31m[terminal] Connection closed. Reconnecting in 3s...\x1B[0m\r
`),setTimeout(()=>{R===t&&!s&&V(e)},3e3))},n.onerror=()=>n.close()}y.onData(e=>{c&&c.readyState===WebSocket.OPEN&&c.send(e)});let H=e=>{if(a(e)&&e.data?.type===`agentNative.submitChat`){let t=e.data.data?.message;t&&c&&c.readyState===WebSocket.OPEN&&(c.send(t+`\r`),I=!0,B(!0))}};return window.addEventListener(`message`,H),h=()=>window.removeEventListener(`message`,H),V(F),()=>{s=!0,R++,L&&clearTimeout(L),A(),c&&=(c.close(),null)}}let _;return g().then(e=>{_=e}),()=>{s=!0,_?.(),h?.()}},[l,w,e,t,r]),l&&w)return null;let E=p?.background??d.background;return(0,s.jsx)(`div`,{ref:y,className:h,style:{width:`100%`,height:`100%`,padding:`4px 12px`,position:`relative`,...g,background:E,backgroundColor:E},children:S&&(0,s.jsx)(`div`,{style:{position:`absolute`,inset:0,display:`flex`,alignItems:`center`,justifyContent:`center`,backgroundColor:`#111`,color:`#ff7b72`,fontSize:`13px`,fontFamily:`monospace`,padding:`20px`,textAlign:`center`,zIndex:1},children:S})})}export{p as t};