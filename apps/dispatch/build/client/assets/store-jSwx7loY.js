const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/agent-discovery-DdrwShBo.js","assets/agent-discovery-BawayXUB.js","assets/chunk-BzcdzF7H.js","assets/__vite-browser-external-BMWabDHZ.js"])))=>i.map(i=>d[i]);
import{i as e}from"./chunk-BzcdzF7H.js";import{t}from"./preload-helper-DL2DwvxV.js";import{t as n}from"./__vite-browser-external-BMWabDHZ.js";import{i as r,n as i,r as a,t as o}from"./client-BnbdMIkb.js";var s=e(n(),1);new s.EventEmitter;var c=`__shared__`,l,u=`# Learnings

User preferences, corrections, and patterns. The agent reads this at the start of every conversation.

Keep this file tidy — revise, consolidate, and remove outdated entries. Don't just append forever.

## Preferences

## Corrections

## Patterns
`,d=`---
name: learn-shared
description: >-
  Update the shared LEARNINGS.md with team-wide preferences, corrections, and
  patterns from this session.
user-invocable: true
---

# Learn (Shared)

Review the current conversation and update the shared \`LEARNINGS.md\` resource with anything the whole team should know.

## What to capture

- **Team conventions** — agreed-upon approaches, code style decisions
- **Technical learnings** — API quirks, library gotchas, surprising behavior
- **Architectural decisions** — why something is done a certain way
- **Corrections** — mistakes that any team member's agent should avoid

## What NOT to capture

- Personal preferences (use \`/learn\` for those)
- Things obvious from reading the code
- Standard language/framework behavior

## Steps

1. Read shared learnings: \`pnpm action resource-read --path LEARNINGS.md --scope shared\`
2. Review the conversation for team-relevant insights
3. Merge new learnings with existing ones — don't duplicate, refine existing entries
4. Write back: \`pnpm action resource-write --path LEARNINGS.md --scope shared --content "..."\`

Keep entries concise — one line per learning, grouped by category (Conventions, Technical, Patterns).
`,f=`# Agent Instructions

This file customizes how the AI agent behaves in this app. Edit it to add your own instructions, preferences, and context.

## What to put here

- **Preferences** — Tone, style, verbosity, response format
- **Context** — Domain knowledge, terminology, team conventions
- **Rules** — Things the agent should always/never do
- **Skills** — Reference skill files for specialized tasks (create them in the \`skills/\` folder)

## Skills

You can create skill files to give the agent specialized knowledge for specific tasks. Create resources under \`skills/<name>/SKILL.md\` (e.g., \`skills/data-analysis/SKILL.md\`, \`skills/code-review/SKILL.md\`) and reference them here:

| Skill | Path | Description |
|-------|------|-------------|
| *(add your skills here)* | \`skills/example/SKILL.md\` | What this skill teaches the agent |

The agent will read the relevant skill file when performing that type of task.

## Example

\`\`\`markdown
## Tone
Be concise. Lead with the answer. Skip filler.

## Code style
- Use TypeScript, never JavaScript
- Prefer named exports
- Use early returns

## Domain context
We sell B2B SaaS. Our customers are enterprise engineering teams.
\`\`\`
`;async function p({client:e,owner:t,fromPath:n,toPath:r,defaultContent:i}){try{let a=(await e.execute({sql:`SELECT id, content FROM resources WHERE owner = ? AND path = ?`,args:[t,n]})).rows?.[0];if(!a||a.content!==i||((await e.execute({sql:`SELECT id FROM resources WHERE owner = ? AND path = ?`,args:[t,r]})).rows?.length??0)>0)return;await e.execute({sql:`UPDATE resources SET path = ?, updated_at = ? WHERE id = ?`,args:[r,Date.now(),a.id]})}catch{}}async function m(){return l||=h().catch(e=>{throw l=void 0,e}),l}async function h(){let e=o();await r(()=>e.execute(`
      CREATE TABLE IF NOT EXISTS resources (
        id TEXT PRIMARY KEY,
        path TEXT NOT NULL,
        owner TEXT NOT NULL,
        content TEXT NOT NULL DEFAULT '',
        mime_type TEXT NOT NULL DEFAULT 'text/markdown',
        size ${i()} NOT NULL DEFAULT 0,
        created_at ${i()} NOT NULL,
        updated_at ${i()} NOT NULL,
        UNIQUE(path, owner)
      )
    `));let n=Date.now(),l=a()?`INSERT INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (path, owner) DO NOTHING`:`INSERT OR IGNORE INTO resources (id, path, owner, content, mime_type, size, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,m=Buffer.byteLength(f,`utf8`);await e.execute({sql:l,args:[s.default.randomUUID(),`AGENTS.md`,c,f,`text/markdown`,m,n,n]});let h=Buffer.byteLength(u,`utf8`);await e.execute({sql:l,args:[s.default.randomUUID(),`LEARNINGS.md`,c,u,`text/markdown`,h,n,n]}),await p({client:e,owner:c,fromPath:`skills/learn-shared.md`,toPath:`skills/learn-shared/SKILL.md`,defaultContent:d});let g=Buffer.byteLength(d,`utf8`);await e.execute({sql:l,args:[s.default.randomUUID(),`skills/learn-shared/SKILL.md`,c,d,`text/markdown`,g,n,n]});try{let{getBuiltinAgents:r,BUILTIN_AGENTS_FOR_SEEDING:i}=await t(async()=>{let{getBuiltinAgents:e,BUILTIN_AGENTS_FOR_SEEDING:t}=await import(`./agent-discovery-DdrwShBo.js`);return{getBuiltinAgents:e,BUILTIN_AGENTS_FOR_SEEDING:t}},__vite__mapDeps([0,1,2,3])),a=i;for(let t of a){let r=JSON.stringify({id:t.id,name:t.name,description:t.description,url:t.url,color:t.color},null,2),i=Buffer.byteLength(r,`utf8`);await e.execute({sql:l,args:[s.default.randomUUID(),`remote-agents/${t.id}.json`,c,r,`application/json`,i,n,n]})}}catch{}try{let t=(await e.execute({sql:`SELECT id, path FROM resources WHERE path LIKE ? AND path LIKE ?`,args:[`agents/%`,`%.json`]})).rows??[];for(let n of t){let t=n.path.replace(/^agents\//,`remote-agents/`);try{await e.execute({sql:`UPDATE resources SET path = ?, updated_at = ? WHERE id = ?`,args:[t,Date.now(),n.id]})}catch{}}}catch{}}function g(e){return{id:e.id,path:e.path,owner:e.owner,content:e.content,mimeType:e.mime_type,size:e.size,createdAt:e.created_at,updatedAt:e.updated_at}}function _(e){return{id:e.id,path:e.path,owner:e.owner,mimeType:e.mime_type,size:e.size,createdAt:e.created_at,updatedAt:e.updated_at}}async function v(e){await m();let{rows:t}=await o().execute({sql:`SELECT * FROM resources WHERE id = ?`,args:[e]});return t.length===0?null:g(t[0])}async function y(e,t){await m();let n=o();if(t){let{rows:r}=await n.execute({sql:`SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ? AND path LIKE ?`,args:[e,t+`%`]});return r.map(_)}let{rows:r}=await n.execute({sql:`SELECT id, path, owner, mime_type, size, created_at, updated_at FROM resources WHERE owner = ?`,args:[e]});return r.map(_)}export{c as SHARED_OWNER,v as resourceGet,y as resourceList};