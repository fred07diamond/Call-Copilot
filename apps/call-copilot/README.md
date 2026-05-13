# Call Copilot

A production-oriented **agent-native** workspace app for **live sales call assistance** and **post-call analysis**. It runs beside Zoom or similar tools: real-time transcription, watch-phrase highlights, speaker labeling, a knowledge base from PDFs, and structured call scoring against uploaded sales playbooks—with the AI agent and UI sharing state through the same database.

**Target users:** sales reps and revenue teams on live calls who want a lightweight transcript, keyword cues, and optional deep analysis without leaving their workflow.

---

## Table of contents

- [Project overview](#project-overview)
- [Features](#features)
- [Architecture](#architecture)
- [API routes](#api-routes)
- [Agent actions](#agent-actions)
- [Database schema](#database-schema)
- [Environment variables](#environment-variables)
- [Setup and installation](#setup-and-installation)
- [Usage guide](#usage-guide)
- [Tech stack](#tech-stack)
- [Known issues and limitations](#known-issues-and-limitations)
- [Future improvements](#future-improvements)

---

## Project overview

Call Copilot helps reps **capture what was said**, **surface important phrases**, and **reflect on call quality** using:

1. **Live transcription** — Deepgram real-time speech-to-text (default) or the browser’s Web Speech API, with optional **microphone-only** or **microphone + system audio** capture for remote meetings.
2. **Speaker awareness** — Deepgram diarization on single-channel audio; **two-channel** (mic vs system) routing for clearer separation when using multichannel mode; optional **LLM-assisted speaker labeling** and manual swap/rename.
3. **Knowledge base** — Upload PDFs, extract text and keywords, merge with **manual watch phrases**, and apply **learned** and **manual vocabulary** transcript corrections.
4. **Call analysis** — Sales **playbooks** (PDFs parsed to text) inform scoring, strengths, gaps, and action items. Analyses can be **queued as database rows** and completed by a **background worker** (Builder LLM gateway), and the UI can also **send analysis instructions to the sidebar agent** (conversational flow).

The app follows **@agent-native/core** conventions: React Router UI, Nitro API routes, Drizzle/SQLite (or remote SQL via `DATABASE_URL`), static **actions** for the agent CLI, and **`.agents/skills/`** for agent guidance.

---

## Features

### Live transcription

- **Deepgram** (`@deepgram/sdk`) live listen: `nova-2`, **linear16** PCM streamed from the browser after fetching a short-lived API key from `GET /api/call-copilot/deepgram-token`.
- **Mic-only** — Single channel; **diarization** and utterance metadata from Deepgram.
- **Mic + system audio** — User grants mic + **display/tab capture** for audio; Web Audio **merges two channels** (mic → ch0, system → ch1) and enables Deepgram **`multichannel: true`** for per-channel recognition (treated as distinct speakers in the pipeline).
- **Browser fallback** — `Web SpeechRecognition` when the voice preference provider is `browser` or `auto` and the browser supports it (`use-call-transcription`).
- **Voice preferences** — Stored via app state / API (e.g. provider: `deepgram` | `browser` | `auto`) through `useVoicePrefs` / `use-call-copilot-state`.
- **Interim vs final** chunks, connection notices, and amplitude metering for UI feedback.

### Speaker detection and labeling

- **Diarization** — Deepgram-driven speaker labels on final/interim paths where applicable.
- **Multichannel** — Separate channels for rep vs meeting audio when using mic + system mode.
- **Manual swap** — “Swap speaker” forces the next finalized chunk to a chosen side (`CallCopilotPanel` + `speaker-display` helpers).
- **Rename speakers** — Updates segment labels and persists **speaker profiles** (`call_copilot_speaker_profiles`) where applicable.
- **Auto-labeling** — Periodic **LLM speaker labeling** via `POST /api/call-copilot/label-speakers` (and legacy `POST /api/label-speakers`) using `SpeakerLabeler` + `speaker-labeler-engine` (Builder gateway).
- **Settings** — Sensitivity, calibration, auto-label frequency, call context hint, final pass on save, **saved profiles** list (in **Settings** panel).

### Knowledge base

- **PDF upload** — `POST /api/call-copilot/kb/pdfs`; files stored on disk with metadata in **`call_copilot_kb_pdfs`**.
- **Keyword extraction** — Server-side PDF text extraction (`pdf-parse` / `pdf-extract`) seeds **`call_copilot_watch_keywords`** with `sourceType` / `pdfId` linkage.
- **Manual keywords** — CRUD via `GET`/`PUT /api/call-copilot/keywords` and agent `manage-keywords`.
- **Learned corrections** — User edits in the transcript create word-pair suggestions; **`call_copilot_learned_corrections`** with `POST` learn + `DELETE` by id.
- **Vocabulary / correction rules** — **`call_copilot_vocabulary_corrections`**; manual technical term fixes (`PUT /api/call-copilot/corrections/vocabulary`).
- **Technical term recognition** — Implemented as part of vocabulary + keyword highlighting in transcript rendering (`highlight-keywords`, `TranscriptLog`).

### Call analysis

- **Playbooks** — Upload typed PDFs (`POST /api/call-copilot/playbooks`); stored in **`call_copilot_playbook_documents`** with `documentType` (cold call, objections, discovery, closing, general). **Managed in Settings** in the current UI; analysis jobs snapshot playbook ids at queue time.
- **Transcript sources** — Saved transcripts, paste, or `.txt` / `.vtt` import (`parseTranscriptImport`).
- **Scoring and structure** — Shared types in `shared/call-analysis.ts` (overall score, strengths, improvements, missed opportunities, action items, talk ratio, etc.).
- **Past analyses** — Listed from **`call_copilot_analyses`**; status **pending** / **complete** / **error**; UI polls **`GET /api/call-copilot/analysis-status`** while pending.
- **Dual execution paths**
  - **Agent / queue path** — Actions `quick-call-score` / `create-call-analysis` insert a **pending** row and `POST` to **`/api/call-copilot/run-analysis`** (see `run-analysis-trigger.ts`); worker runs `executeFullCallAnalysis` → Builder LLM (`builder-llm-gateway` + `call-analysis-engine`).
  - **UI “Analyze Call” (current default)** — Sends a structured natural-language request via **`sendToAgentChat`** (`submit: true`) so the **sidebar agent** performs the analysis in chat (aligned with `server/plugins/agent-chat.ts` instructions).
- **SSE quick pipeline** — `POST /api/analyze-call` with `stream: true` returns **Server-Sent Events** for progressive sections (`use-call-analysis-run.ts`); useful for tooling and optional UI wiring.

### UI features

- **Dark (and light) theme** — `next-themes` + `ThemeToggle` (theme control lives under **Settings → Capture & appearance** on the main copilot screen; header no longer duplicates it on that flow).
- **Vertical floating nav** — Mic (live transcript), search (call analysis), gear (settings); tooltips; fixed pill on desktop, bottom bar on small screens (`CallCopilotFloatingNav.tsx`).
- **Settings hub** — Sidebar categories: playbooks, knowledge PDFs, transcription (voice provider), watch phrases, corrections, speakers, capture & theme, saved transcripts (`SettingsCallCopilotPanel.tsx`).
- **PDF quick view** — Sheet with extracted text, search, keyword badges, chunked “load more” for large bodies (`PdfTextPreviewSheet.tsx` + `GET .../kb/pdfs/:id/text`).
- **Call-end prompt** — On **Pause** with content, optional **Analyze Now** saves transcript and jumps to analysis with prefilled text and prospect focus (`CallCopilotPanel.tsx`).

### Framework routes (not call-domain specific)

- **`/`** — Main Call Copilot (`CallCopilotPanel`).
- **`/new-app`**, **`/extensions/*`**, **`/observability`** — Agent-native workspace scaffolding / extensions / observability (see `app/routes/`).

---

## Architecture

### Frontend (`app/`)

| Area | Role |
|------|------|
| **`app/routes/`** | React Router file-based routes (`flatRoutes()` via `app/routes.ts`). |
| **`app/root.tsx`**, **`entry.client.tsx`** | Shell, providers, hydration. |
| **`app/components/call-copilot/`** | `CallCopilotPanel`, `CallCopilotFloatingNav`, `TranscriptLog`, `CallAnalysisPanel`, `CallAnalysisResults`, `SettingsCallCopilotPanel`, `PdfTextPreviewSheet`, legacy `KnowledgeBasePanel` (superseded by Settings for main UX). |
| **`app/components/layout/`** | `Layout`, `Header`, `Sidebar`, `ThemeToggle`. |
| **`app/components/ui/`** | shadcn/Radix primitives. |
| **`app/hooks/`** | `use-call-transcription`, `use-call-copilot-state`, `use-call-analysis`, `use-call-analysis-run`, `use-knowledge-base`, `use-saved-transcripts`, `use-transcript-corrections`, `use-speaker-recognition`, `use-navigation-state`, etc. |
| **`app/lib/`** | Transcript segments, speaker display, SpeakerLabeler scheduler, keyword highlighting, transcript import, PDF export for analysis. |

Client data fetching uses **`@tanstack/react-query`** and **`fetch`** to `/api/*` (use **`appApiPath()`** from `@agent-native/core/client` when the app is mounted under a workspace prefix).

### Backend (`server/`)

| Area | Role |
|------|------|
| **`server/routes/api/`** | Nitro file-based handlers (`defineEventHandler` from `h3`). |
| **`server/routes/[...page].get.ts`** | SSR catch-all for the React shell. |
| **`server/lib/`** | Domain logic: `knowledge-base`, `pdf-extract`, `watch-keywords`, `learned-corrections`, `vocabulary-corrections`, `transcripts`, `playbooks`, `analyses`, `call-analysis-engine`, `background-call-analysis`, `builder-llm-gateway`, `speaker-labeler-engine`, `speaker-profiles`, `queue-call-analysis`, `run-analysis-trigger`, etc. |
| **`server/plugins/`** | **`db.ts`** — migrations for `call_copilot_*` tables; **`auth.ts`** — workspace or framework auth; **`agent-chat.ts`** — registers actions + Call Copilot system prompt; **`load-app-env.ts`** — loads `.env` / `.env.local`; **`watch-keywords`**, **`vocabulary-corrections`**. |

### Database

- **Migrations** — `server/plugins/db.ts` (`runMigrations` from `@agent-native/core/db`) with versioned SQL and bookkeeping table **`call_copilot_migrations`**.
- **ORM schema** — `server/db/schema.ts` (Drizzle-style `table()` helpers from `@agent-native/core/db/schema`).
- **Default file** — SQLite file under app data (see [Setup](#setup-and-installation)); override with **`DATABASE_URL`** for Turso/Postgres/etc.

**Framework tables** (not defined in this app’s `schema.ts` but used via `@agent-native/core/application-state`): e.g. **`application_state`** for `navigation`, `navigate`, **`call-copilot.session`**, and other agent-native keys.

### Agent system

| Piece | Location |
|-------|----------|
| **Actions** | `actions/*.ts` — registered through generated `actions-registry` (see `@agent-native/core` build). |
| **Agent chat plugin** | `server/plugins/agent-chat.ts` — `appId: "call-copilot"`, `loadActionsFromStaticRegistry`, Call Copilot **system prompt** (keywords, analysis queue flow). |
| **Skills** | `.agents/skills/*/SKILL.md` — `actions`, `capture-learnings`, `create-skill`, `delegate-to-agent`, `frontend-design`, `security`, `self-modifying-code`. |
| **Operator docs** | `AGENTS.md` (resources, state keys, action table), `DEVELOPING.md` (framework conventions). |

### External integrations

| Service | Usage |
|---------|--------|
| **Deepgram** | Live transcription; API key on server; browser uses SDK listen client with token/key from `deepgram-token` route. |
| **Builder.io agent-native gateway** | `createBuilderEngine` — LLM streaming/completions for **call analysis** and **speaker labeling** (`BUILDER_PRIVATE_KEY` or framework-provided credentials). |
| **Better Auth** | Via `@agent-native/core` + workspace `shared/server` plugin when present (`server/plugins/auth.ts`). |

---

## API routes

All paths are **app-local** (`/api/...`). When the app is mounted at `/call-copilot`, use **`appApiPath("/api/...")`** from the client.

| Method | Path | Purpose |
|--------|------|---------|
| GET | `/api/hello` | Health/example JSON. |
| GET | `/api/test-deepgram` | **Dev/diagnostic** — validates `DEEPGRAM_API_KEY` against Deepgram projects API (do not expose in production). |
| GET | `/api/test-analysis-pipeline` | **Dev/diagnostic** — DB connectivity, actions dir, optional Builder gateway ping, Deepgram key presence. |
| POST | `/api/label-speakers` | LLM speaker labeling (incremental or final); body: `contextSegments`, `targetSegments`, `mode`, optional hints. Returns `{ labels }`. |
| POST | `/api/call-copilot/label-speakers` | Re-export of `/api/label-speakers`. |
| GET | `/api/call-copilot/deepgram-token` | Returns `{ key }` — Deepgram API key for client SDK (protected by auth in normal deploys). |
| GET | `/api/call-copilot/deepgram/status` | `{ configured: boolean }` — whether `DEEPGRAM_API_KEY` is set. |
| GET | `/api/call-copilot/keywords` | `{ keywords }` — watch keyword entries. |
| PUT | `/api/call-copilot/keywords` | Body `{ keywords }` — replace **manual** watch keywords (normalized). Returns `{ keywords }`. |
| GET | `/api/call-copilot/kb/pdfs` | `{ pdfs }` — knowledge PDF metadata + attached keywords. |
| POST | `/api/call-copilot/kb/pdfs` | Multipart upload of a PDF; processes text + keywords. |
| DELETE | `/api/call-copilot/kb/pdfs/:id` | Deletes PDF + related storage. |
| POST | `/api/call-copilot/kb/pdfs/:id/reprocess` | Re-runs extraction/keyword pipeline. |
| GET | `/api/call-copilot/kb/pdfs/:id/text` | `{ text }` — plain text for PDF preview (on-demand parse). |
| GET | `/api/call-copilot/transcripts` | List saved transcripts. |
| POST | `/api/call-copilot/transcripts` | Save transcript (`sessionName`, `segments`). |
| PATCH | `/api/call-copilot/transcripts/:id` | Rename session. |
| DELETE | `/api/call-copilot/transcripts/:id` | Delete saved transcript. |
| GET | `/api/call-copilot/corrections` | Learned + vocabulary correction payloads for the UI. |
| POST | `/api/call-copilot/corrections/learn` | Record a learned correction from user edit. |
| DELETE | `/api/call-copilot/corrections/learned/:id` | Remove a learned correction. |
| PUT | `/api/call-copilot/corrections/vocabulary` | Replace manual vocabulary rows. |
| GET | `/api/call-copilot/speakers` | List speaker profiles. |
| POST | `/api/call-copilot/speakers` | Create/register profile. |
| PATCH | `/api/call-copilot/speakers/:id` | Update profile label/metadata. |
| DELETE | `/api/call-copilot/speakers/:id` | Delete profile. |
| GET | `/api/call-copilot/speakers/settings` | Speaker settings row. |
| PUT | `/api/call-copilot/speakers/settings` | Update sensitivity, auto-label, frequency, hints, final pass, etc. |
| GET | `/api/call-copilot/playbooks` | `{ documents }` — sales playbook PDFs with `contentText`. |
| POST | `/api/call-copilot/playbooks` | Multipart upload (`file`, `documentType`). |
| DELETE | `/api/call-copilot/playbooks/:id` | Delete playbook document. |
| GET | `/api/call-copilot/analyses` | `{ analyses }` — saved analyses metadata. |
| POST | `/api/call-copilot/analyses` | Body: `transcriptText`, optional `prospectContext`, `transcriptId`, `playbookDocumentIds[]` — creates a **pending** analysis via `createPendingCallAnalysis` (does **not** automatically invoke `run-analysis`; callers queue separately if needed). Returns `{ analysis }`. |
| GET | `/api/call-copilot/analyses/:id` | Fetch one analysis including `analysisResultJson`. |
| PUT | `/api/call-copilot/analyses/:id` | Update row (e.g. attach result). |
| DELETE | `/api/call-copilot/analyses/:id` | Delete analysis. |
| POST | `/api/call-copilot/analyses/:id/run` | **SSE** — runs `runCallAnalysisPipeline` for an existing row (optional `retrySection`, `mode`, `partialResult`); may `publishCallAnalysisResult` on success. Requires playbooks linked on the row. |
| GET | `/api/call-copilot/analysis-status` | Query `?id=` — lightweight status payload for polling. |
| POST | `/api/call-copilot/run-analysis` | Body `{ analysisId }` — accepts background job (`executeFullCallAnalysis`); uses `waitUntil` when available. |
| POST | `/api/analyze-call` | Body: transcript, prospect context, optional `playbookContent`, `stream`, `mode` — runs **`runCallAnalysisPipeline`** / SSE stream for quick analysis. |

---

## Agent actions

Scripts are run from the app directory:

```bash
cd apps/call-copilot && pnpm action <name> [--flags]
```

| Action | Description | Inputs (summary) | Behavior |
|--------|-------------|------------------|----------|
| **`hello`** | Example script | `name`, optional `send-chat` | Logs greeting; may `agentChat.submit` for demo. |
| **`run`** | Dispatcher | (internal) | `runScript()` entry. |
| **`navigate`** | UI navigation command | `--view`, `--path` | Writes **`navigate`** key to `application_state`. |
| **`view-screen`** | Snapshot for agent | (none) | Reads `navigation`, **`call-copilot.session`**, watch keywords JSON. |
| **`manage-keywords`** | Watch phrases CRUD | `action`: `list` \| `set` \| `add` \| `remove`; `keywords[]` or `phrase` / `definition` | Backed by `listWatchKeywords` / `replaceWatchKeywords`. |
| **`quick-call-score`** | Queue analysis | `transcriptText`, optional `prospectContext`, `transcriptId` | Inserts **pending** `analyses` row with current playbook ids; **`triggerRunAnalysisWebhook`**. |
| **`create-call-analysis`** | Same as quick-call-score | Same | Identical queue semantics; duplicate naming for agent ergonomics. |
| **`publish-call-analysis`** | Publish or error out | `id`, `status` (`complete`\|`error`), `error?`, structured `result?` | Validates Zod schema; updates DB via `publishCallAnalysisResult` / `markCallAnalysisError`. |
| **`deep-call-analysis`** | Re-run | `--id` | Resets row to pending, re-triggers webhook. |

> **Note:** Framework-level actions such as **`db-schema`**, **`db-query`**, **`db-exec`**, and **resource-** scripts may also be available depending on `@agent-native/core` workspace wiring—see root `AGENTS.md` / package docs.

---

## Database schema

App-owned tables (prefix **`call_copilot_`**). Types in code use camelCase mapping to snake_case columns.

### `call_copilot_watch_keywords`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | UUID |
| `phrase` | text unique | Matched phrase |
| `definition` | text | Tooltip / agent context |
| `source_type` | text | `manual` \| `pdf` \| `seed` |
| `pdf_id` | text nullable | Originating KB PDF |
| `source_label` | text nullable | Human-readable source |
| `created_at` / `updated_at` | text | ISO timestamps |

### `call_copilot_kb_pdfs`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | UUID |
| `filename` | text | Original filename |
| `storage_path` | text | On-disk relative path |
| `uploaded_at` | text | ISO timestamp |
| `keyword_count` | integer | Extracted keyword tally |

### `call_copilot_transcripts`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | UUID |
| `session_name` | text | User-visible name |
| `saved_at` | text | ISO timestamp |
| `segments_json` | text | JSON array of transcript segments |

### `call_copilot_learned_corrections`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | UUID |
| `original_text` / `corrected_text` | text | Learned pair |
| `times_seen` | integer | Frequency |
| `created_at` | text | ISO timestamp |

### `call_copilot_vocabulary_corrections`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | UUID |
| `original_text` / `corrected_text` | text | Manual glossary pair |
| `source` | text | e.g. `manual` |
| `created_at` | text | ISO timestamp |

### `call_copilot_speaker_profiles`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | Stable speaker id |
| `label` | text | Display name |
| `fingerprint_json` | text | Embedding / fingerprint JSON |
| `call_count` | integer | Usage counter |
| `created_at` / `updated_at` | text | ISO timestamps |

### `call_copilot_speaker_settings`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | Singleton-style row |
| `sensitivity` | integer | Detection sensitivity |
| `calibration_enabled` | integer | 0/1 flag |
| `auto_label_enabled` | integer | Periodic LLM labeling |
| `labeling_frequency_seconds` | integer | Poll interval |
| `call_context_hint` | text | Prompt hint for labeler |
| `run_final_pass_on_save` | integer | Final LLM pass when saving transcript |
| `updated_at` | text | ISO timestamp |

### `call_copilot_playbook_documents`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | UUID |
| `filename` | text | Original filename |
| `content_text` | text | Extracted plain text for LLM |
| `document_type` | text | Playbook taxonomy enum |
| `uploaded_at` | text | ISO timestamp |

### `call_copilot_analyses`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | text PK | UUID |
| `transcript_id` | text nullable | Link to saved transcript |
| `transcript_text` | text | Full text analyzed |
| `prospect_context` | text | Free-form prospect notes |
| `playbook_document_ids_json` | text | JSON array of playbook ids at enqueue time |
| `analysis_result_json` | text nullable | Structured JSON result |
| `overall_score` | integer nullable | Denormalized 1–10 |
| `status` | text | `pending` \| `complete` \| `error` |
| `error_message` | text nullable | Failure reason |
| `created_at` | text | ISO timestamp |

---

## Environment variables

**Never commit real secrets.** Copy patterns from `.env.example` and workspace docs; use vault or CI secrets in production.

| Variable | Required | Description |
|----------|----------|-------------|
| **`DEEPGRAM_API_KEY`** | Yes (for Deepgram transcription) | Server-side key; exposed to browser only via the token route for SDK usage. [Deepgram Console](https://console.deepgram.com). |
| **`BUILDER_PRIVATE_KEY`** | Yes (for server LLM analysis / labeling) | Authenticates **Builder.io agent-native gateway** for `createBuilderEngine` (`builder-llm-gateway.ts`, `call-analysis-engine.ts`, `speaker-labeler-engine.ts`). Obtained from Builder / org agent-native setup. |
| **`DATABASE_URL`** | Optional locally | Default SQLite file; set for Turso/Neon/Postgres/LibSQL remote. |
| **`DATABASE_AUTH_TOKEN`** | If remote LibSQL/Turso requires it | Auth token for remote driver. |
| **`RUN_ANALYSIS_WEBHOOK_URL`** | Optional | Override for `POST` target when queueing analysis (default `http://127.0.0.1:8101/api/call-copilot/run-analysis` in `run-analysis-trigger.ts`). |
| **`BETTER_AUTH_SECRET`** | Production auth | Session/crypto signing for Better Auth (auto-generated in some dev setups—see `.agents/skills/security/SKILL.md`). |
| **`AUTH_MODE`**, **`ACCESS_TOKEN`**, **`AUTH_DISABLED`** | Deploy-dependent | Auth mode matrix per security skill / framework docs. |
| **`PING_MESSAGE`** | Optional | Example custom message in `.env.example` (health/demo). |
| **`VITE_APP_BASE_PATH`** / **`APP_BASE_PATH`** / **`BASE_URL`** | When mounted under a subpath | Vite / agent-native base path resolution (`AGENTS.md`). |

**Not used directly as `ANTHROPIC_API_KEY` in this app’s server code** — completions go through the **Builder gateway** (`@agent-native/core/agent/engine`).

---

## Setup and installation

### Prerequisites

- **Node.js** — **v24** recommended (repo uses `@types/node` ^24); LTS **v22+** generally works with `pnpm` and Vite 6.
- **pnpm** — **10.x** (`packageManager` in monorepo `package.json`).

### Clone and install

From the **workspace root** (`my-platform`):

```bash
git clone <repository-url> my-platform
cd my-platform
pnpm install
```

### Environment files

1. Copy or create **`apps/call-copilot/.env.local`** (loaded by `server/plugins/load-app-env.ts` from cwd or `apps/call-copilot/`).
2. At minimum for full functionality:

```bash
# apps/call-copilot/.env.local (example — no real values)
DEEPGRAM_API_KEY=<your-deepgram-key>
BUILDER_PRIVATE_KEY=<your-builder-agent-native-key>
```

3. For remote DB:

```bash
DATABASE_URL=<libsql|postgres|...>
DATABASE_AUTH_TOKEN=<if-required>
```

See **`apps/call-copilot/.env.example`** for the starter template included in this repo.

### Run development server

```bash
cd apps/call-copilot
pnpm dev
```

This runs **`agent-native dev --open`** (see `package.json`): Vite + React Router + Nitro with HMR.

### Production build

```bash
cd apps/call-copilot
pnpm build
pnpm start
```

Artifacts follow **@agent-native/core** output layout (see framework docs).

### Access

- Local dev: URL printed by CLI (often `http://localhost:5173` or similar).
- Workspace deploy: app is commonly mounted at **`/call-copilot`**; use the workspace gateway URL your org provides.

---

## Usage guide

### Live transcript

1. Open the home route (`/`).
2. Choose **Mic only** or **Mic + system audio** (system mode requires **screen/tab sharing** with audio checked).
3. Click **Listen**. Grant microphone (and display) permissions.
4. Watch interim text and finalized segments in the transcript panel; **Swap speaker** when sides invert.
5. **Pause** stops capture; if there was content, you may get **Analyze Now / Skip**.
6. **Save** persists segments to **`call_copilot_transcripts`** (optional final speaker pass per settings).

### Keywords and corrections

1. Open **Settings** (gear) → **Watch phrases** or **Corrections**.
2. Add manual phrases or vocabulary rows; upload **Knowledge PDFs** to auto-seed keywords.
3. Edit a transcript line to teach a **learned correction** (pairs feed the learn API).

### Playbooks

1. **Settings → Sales playbooks** — upload PDF, pick **document type**, delete when obsolete.
2. **View** (eye) opens extracted text preview.

### Call analysis

1. **Analysis** (search icon) — select a **saved transcript**, paste text, or upload `.txt`/`.vtt`.
2. Fill **Prospect context** (focused automatically after **Analyze Now** from pause flow).
3. **Analyze Call** — sends the instruction bundle to the **sidebar agent** (`sendToAgentChat` with `submit: true`). The agent should use **`quick-call-score`** / **`create-call-analysis`** when a queued DB result is desired.
4. **Past analyses** — open prior rows; delete as needed.

### Agent from terminal

```bash
cd apps/call-copilot
pnpm action view-screen
pnpm action manage-keywords --action list
pnpm action quick-call-score --transcriptText "..." --prospectContext "..."
```

---

## Tech stack

| Package / tool | Role |
|----------------|------|
| **@agent-native/core** | App shell, auth, DB helpers, `defineAction`, Vite/Nitro presets, `sendToAgentChat`, migrations. |
| **React 19 + React Router 7** | UI + file routes (`@react-router/dev`, `flatRoutes`). |
| **Vite** | Bundler (`@agent-native/core/vite`). |
| **Nitro** | SSR + API (`nitro.config.ts` enables **websocket** feature flag). |
| **Tailwind CSS v4** (`catalog`) | Styling. |
| **shadcn/ui + Radix** | Accessible components (`components.json`, `app/components/ui`). |
| **@tabler/icons-react** | Icons (project convention). |
| **@tanstack/react-query** | Server state caching. |
| **@deepgram/sdk** | Live transcription websocket client. |
| **pdf-parse** | PDF text extraction. |
| **drizzle-style schema** | `@agent-native/core/db/schema` table builders. |
| **@libsql/client / postgres** | Drivers available for remote SQL targets. |
| **zod** | Action / API validation. |
| **sonner** | Toasts. |
| **next-themes** | Dark/light mode. |
| **ws / crossws** | WebSocket support where used by stack. |

---

## Known issues and limitations

1. **Analysis trigger URL** — `triggerRunAnalysisWebhook` defaults to **`http://127.0.0.1:8101/...`** and **swallows fetch errors**. If your dev server port differs, set **`RUN_ANALYSIS_WEBHOOK_URL`** or analyses may stay **pending** forever.
2. **Stale user-facing copy** — Some server messages still say upload playbooks in the **“Call Analysis tab”**; playbooks now live under **Settings** (`background-call-analysis.ts` error string).
3. **Dual analysis UX** — The primary **Analyze Call** button uses **agent chat**, not the local **SSE** `useCallAnalysisRun` pipeline; streaming progress UI may appear idle unless other code paths invoke `runAnalysis`.
4. **LLM timeouts** — `call-analysis-engine.ts` uses **60s** default completion, **30s** quick score path, and shorter middle-summary windows; very long transcripts may hit **`timedOut`** or truncated middle summaries.
5. **Browser / OS constraints** — **System audio capture** depends on OS and browser (Chrome-style paths most reliable); some environments cannot share “tab audio.”
6. **Deepgram from browser** — Audio streams from the client to Deepgram; strict corporate proxies or DLP may block WebSockets or streaming.
7. **Test routes** — `GET /api/test-deepgram` and `GET /api/test-analysis-pipeline` expose diagnostics and should be **disabled or protected** in production.
8. **`createAnalysis` / `isCreating` / hook `retrySection`** — Currently **unused** in `CallAnalysisPanel.tsx` (minor dead surface area / tree-shaking noise).

---

## Future improvements

- **CRM integrations** — HubSpot / Salesforce to attach transcripts and scores to deals and contacts.
- **Slack / Teams notifications** — Post summary or action items to a channel after call end.
- **First-class WebSocket proxy** — Route Deepgram (or other STT) through the Nitro server for enterprises that block third-party sockets.
- **Richer diarization** — Speaker embeddings across calls, confidence UI, merge/split speakers.
- **Unify analysis UX** — Wire **Analyze Call** to **`POST /api/analyze-call`** streaming optionally, or always queue `run-analysis` with visible progress from one path.
- **Playbook versioning** — Diff uploads, effective dates, per-team playbooks.
- **Mobile layout polish** — Bottom nav overlap tuning per device safe areas.
- **Observability** — Tie transcript errors and analysis failures to `/observability` dashboards.

---

## Related documentation

- [`AGENTS.md`](./AGENTS.md) — Agent resources, application state keys, action cheat sheet.
- [`DEVELOPING.md`](./DEVELOPING.md) — Framework patterns (routes, APIs, plugins, scripts).
- [Workspace `AGENTS.md`](../AGENTS.md) (repo root) — Monorepo orchestration and org repair.
