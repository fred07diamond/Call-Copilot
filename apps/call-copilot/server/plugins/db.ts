import { runMigrations } from "@agent-native/core/db";

export default runMigrations(
  [
    {
      version: 1,
      sql: `CREATE TABLE IF NOT EXISTS call_copilot_watch_keywords (
    id TEXT PRIMARY KEY,
    phrase TEXT NOT NULL UNIQUE,
    definition TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  )`,
    },
    {
      version: 2,
      sql: `CREATE TABLE IF NOT EXISTS call_copilot_kb_pdfs (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    uploaded_at TEXT NOT NULL,
    keyword_count INTEGER NOT NULL DEFAULT 0
  );
  ALTER TABLE call_copilot_watch_keywords ADD COLUMN IF NOT EXISTS source_type TEXT NOT NULL DEFAULT 'manual';
  ALTER TABLE call_copilot_watch_keywords ADD COLUMN IF NOT EXISTS pdf_id TEXT;
  ALTER TABLE call_copilot_watch_keywords ADD COLUMN IF NOT EXISTS source_label TEXT`,
    },
    {
      version: 3,
      sql: `CREATE TABLE IF NOT EXISTS call_copilot_transcripts (
    id TEXT PRIMARY KEY,
    session_name TEXT NOT NULL,
    saved_at TEXT NOT NULL,
    segments_json TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS call_copilot_learned_corrections (
    id TEXT PRIMARY KEY,
    original_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    times_seen INTEGER NOT NULL DEFAULT 1,
    created_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS call_copilot_vocabulary_corrections (
    id TEXT PRIMARY KEY,
    original_text TEXT NOT NULL,
    corrected_text TEXT NOT NULL,
    source TEXT NOT NULL,
    created_at TEXT NOT NULL
  )`,
    },
    {
      version: 4,
      sql: `CREATE TABLE IF NOT EXISTS call_copilot_speaker_profiles (
    id TEXT PRIMARY KEY,
    label TEXT NOT NULL,
    fingerprint_json TEXT NOT NULL,
    call_count INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS call_copilot_speaker_settings (
    id TEXT PRIMARY KEY,
    sensitivity INTEGER NOT NULL DEFAULT 55,
    calibration_enabled INTEGER NOT NULL DEFAULT 1,
    updated_at TEXT NOT NULL
  )`,
    },
    {
      version: 5,
      sql: `CREATE TABLE IF NOT EXISTS call_copilot_playbook_documents (
    id TEXT PRIMARY KEY,
    filename TEXT NOT NULL,
    content_text TEXT NOT NULL,
    document_type TEXT NOT NULL,
    uploaded_at TEXT NOT NULL
  );
  CREATE TABLE IF NOT EXISTS call_copilot_analyses (
    id TEXT PRIMARY KEY,
    transcript_id TEXT,
    transcript_text TEXT NOT NULL,
    prospect_context TEXT NOT NULL,
    playbook_document_ids_json TEXT NOT NULL,
    analysis_result_json TEXT,
    overall_score INTEGER,
    status TEXT NOT NULL,
    error_message TEXT,
    created_at TEXT NOT NULL
  )`,
    },
    {
      version: 6,
      sql: `ALTER TABLE call_copilot_speaker_settings ADD COLUMN IF NOT EXISTS auto_label_enabled INTEGER NOT NULL DEFAULT 1;
  ALTER TABLE call_copilot_speaker_settings ADD COLUMN IF NOT EXISTS labeling_frequency_seconds INTEGER NOT NULL DEFAULT 30;
  ALTER TABLE call_copilot_speaker_settings ADD COLUMN IF NOT EXISTS call_context_hint TEXT NOT NULL DEFAULT '';
  ALTER TABLE call_copilot_speaker_settings ADD COLUMN IF NOT EXISTS run_final_pass_on_save INTEGER NOT NULL DEFAULT 1`,
    },
  ],
  { table: "call_copilot_migrations" },
);
