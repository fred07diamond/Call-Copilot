import type { SavedTranscript, TranscriptSegment } from "@shared/transcript";
import { normalizeTranscriptSegment } from "@shared/transcript";
import { getDb, schema } from "../db/index.js";

function toSavedTranscript(
  row: typeof schema.transcripts.$inferSelect,
): SavedTranscript {
  let segments: TranscriptSegment[] = [];
  try {
    const parsed = JSON.parse(row.segmentsJson) as TranscriptSegment[];
    segments = Array.isArray(parsed) ? parsed.map(normalizeTranscriptSegment) : [];
  } catch {
    segments = [];
  }

  return {
    id: row.id,
    sessionName: row.sessionName,
    savedAt: row.savedAt,
    segments,
  };
}

export async function listSavedTranscripts(): Promise<SavedTranscript[]> {
  const db = getDb();
  const rows = await db.select().from(schema.transcripts);
  return rows
    .sort((left, right) => right.savedAt.localeCompare(left.savedAt))
    .map(toSavedTranscript);
}

export async function createSavedTranscript(input: {
  sessionName: string;
  segments: TranscriptSegment[];
}): Promise<SavedTranscript> {
  const db = getDb();
  const id = crypto.randomUUID();
  const savedAt = new Date().toISOString();
  const row = {
    id,
    sessionName: input.sessionName.trim(),
    savedAt,
    segmentsJson: JSON.stringify(input.segments),
  };
  await db.insert(schema.transcripts).values(row);
  return toSavedTranscript(row);
}

export async function renameSavedTranscript(
  id: string,
  sessionName: string,
): Promise<SavedTranscript> {
  const db = getDb();
  const rows = await db.select().from(schema.transcripts);
  const current = rows.find((row) => row.id === id);
  if (!current) {
    throw new Error("Transcript not found.");
  }

  const next = rows.map((row) =>
    row.id === id ? { ...row, sessionName: sessionName.trim() } : row,
  );
  await db.delete(schema.transcripts);
  if (next.length > 0) {
    await db.insert(schema.transcripts).values(next);
  }

  const updated = next.find((row) => row.id === id);
  if (!updated) {
    throw new Error("Transcript not found after rename.");
  }
  return toSavedTranscript(updated);
}

export async function deleteSavedTranscript(id: string): Promise<void> {
  const db = getDb();
  const rows = await db.select().from(schema.transcripts);
  const remaining = rows.filter((row) => row.id !== id);
  if (remaining.length === rows.length) {
    throw new Error("Transcript not found.");
  }
  await db.delete(schema.transcripts);
  if (remaining.length > 0) {
    await db.insert(schema.transcripts).values(remaining);
  }
}
