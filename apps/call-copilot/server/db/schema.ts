import { integer, table, text } from "@agent-native/core/db/schema";

export const watchKeywords = table("call_copilot_watch_keywords", {
  id: text("id").primaryKey(),
  phrase: text("phrase").notNull().unique(),
  definition: text("definition").notNull(),
  sourceType: text("source_type").notNull(),
  pdfId: text("pdf_id"),
  sourceLabel: text("source_label"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const kbPdfs = table("call_copilot_kb_pdfs", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  storagePath: text("storage_path").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
  keywordCount: integer("keyword_count").notNull(),
});

export const transcripts = table("call_copilot_transcripts", {
  id: text("id").primaryKey(),
  sessionName: text("session_name").notNull(),
  savedAt: text("saved_at").notNull(),
  segmentsJson: text("segments_json").notNull(),
});

export const learnedCorrections = table("call_copilot_learned_corrections", {
  id: text("id").primaryKey(),
  originalText: text("original_text").notNull(),
  correctedText: text("corrected_text").notNull(),
  timesSeen: integer("times_seen").notNull(),
  createdAt: text("created_at").notNull(),
});

export const vocabularyCorrections = table("call_copilot_vocabulary_corrections", {
  id: text("id").primaryKey(),
  originalText: text("original_text").notNull(),
  correctedText: text("corrected_text").notNull(),
  source: text("source").notNull(),
  createdAt: text("created_at").notNull(),
});

export const speakerProfiles = table("call_copilot_speaker_profiles", {
  id: text("id").primaryKey(),
  label: text("label").notNull(),
  fingerprintJson: text("fingerprint_json").notNull(),
  callCount: integer("call_count").notNull(),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const speakerSettings = table("call_copilot_speaker_settings", {
  id: text("id").primaryKey(),
  sensitivity: integer("sensitivity").notNull(),
  calibrationEnabled: integer("calibration_enabled").notNull(),
  autoLabelEnabled: integer("auto_label_enabled").notNull(),
  labelingFrequencySeconds: integer("labeling_frequency_seconds").notNull(),
  callContextHint: text("call_context_hint").notNull(),
  runFinalPassOnSave: integer("run_final_pass_on_save").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const playbookDocuments = table("call_copilot_playbook_documents", {
  id: text("id").primaryKey(),
  filename: text("filename").notNull(),
  contentText: text("content_text").notNull(),
  documentType: text("document_type").notNull(),
  uploadedAt: text("uploaded_at").notNull(),
});

export const analyses = table("call_copilot_analyses", {
  id: text("id").primaryKey(),
  transcriptId: text("transcript_id"),
  transcriptText: text("transcript_text").notNull(),
  prospectContext: text("prospect_context").notNull(),
  playbookDocumentIdsJson: text("playbook_document_ids_json").notNull(),
  analysisResultJson: text("analysis_result_json"),
  overallScore: integer("overall_score"),
  status: text("status").notNull(),
  errorMessage: text("error_message"),
  createdAt: text("created_at").notNull(),
});
