import {
  BUILTIN_CORRECTION_RULES,
  type CorrectionRule,
  type VocabularyCorrection,
} from "@shared/transcript";
import { getDb, schema } from "../db/index.js";

function toVocabularyCorrection(
  row: typeof schema.vocabularyCorrections.$inferSelect,
): VocabularyCorrection {
  return {
    id: row.id,
    originalText: row.originalText,
    correctedText: row.correctedText,
    source: row.source as VocabularyCorrection["source"],
    createdAt: row.createdAt,
  };
}

function pairKey(originalText: string, correctedText: string): string {
  return `${originalText.trim().toLowerCase()}::${correctedText.trim().toLowerCase()}`;
}

export async function listVocabularyCorrections(): Promise<VocabularyCorrection[]> {
  const db = getDb();
  const rows = await db.select().from(schema.vocabularyCorrections);
  return rows
    .sort((left, right) => left.originalText.localeCompare(right.originalText))
    .map(toVocabularyCorrection);
}

export async function replaceManualVocabularyCorrections(
  entries: Array<{ originalText: string; correctedText: string }>,
): Promise<VocabularyCorrection[]> {
  const db = getDb();
  const rows = await db.select().from(schema.vocabularyCorrections);
  const preserved = rows.filter((row) => row.source === "builtin");
  const now = new Date().toISOString();
  const manual = entries
    .map((entry) => ({
      id: crypto.randomUUID(),
      originalText: entry.originalText.trim(),
      correctedText: entry.correctedText.trim(),
      source: "manual",
      createdAt: now,
    }))
    .filter((entry) => entry.originalText && entry.correctedText);

  const next = [...preserved, ...manual];
  await db.delete(schema.vocabularyCorrections);
  if (next.length > 0) {
    await db.insert(schema.vocabularyCorrections).values(next);
  }
  return listVocabularyCorrections();
}

export async function ensureBuiltinVocabularyCorrections(): Promise<void> {
  const existing = await listVocabularyCorrections();
  const existingKeys = new Set(
    existing.map((entry) => pairKey(entry.originalText, entry.correctedText)),
  );

  const missing = BUILTIN_CORRECTION_RULES.filter(
    (rule) => !existingKeys.has(pairKey(rule.originalText, rule.correctedText)),
  );
  if (missing.length === 0) return;

  const db = getDb();
  const now = new Date().toISOString();
  const rows = [
    ...existing.map((entry) => ({
      id: entry.id,
      originalText: entry.originalText,
      correctedText: entry.correctedText,
      source: entry.source,
      createdAt: entry.createdAt,
    })),
    ...missing.map((rule) => ({
      id: crypto.randomUUID(),
      originalText: rule.originalText,
      correctedText: rule.correctedText,
      source: "builtin",
      createdAt: now,
    })),
  ];

  await db.delete(schema.vocabularyCorrections);
  await db.insert(schema.vocabularyCorrections).values(rows);
}

export async function listActiveCorrectionRules(): Promise<CorrectionRule[]> {
  const { listLearnedCorrections } = await import("./learned-corrections.js");
  const learned = await listLearnedCorrections();
  const vocabulary = await listVocabularyCorrections();

  const learnedRules = learned.map((entry) => ({
    originalText: entry.originalText,
    correctedText: entry.correctedText,
  }));
  const vocabularyRules = vocabulary.map((entry) => ({
    originalText: entry.originalText,
    correctedText: entry.correctedText,
  }));

  return [...learnedRules, ...vocabularyRules];
}
