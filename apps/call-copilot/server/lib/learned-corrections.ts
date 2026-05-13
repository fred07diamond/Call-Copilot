import type { LearnedCorrection } from "@shared/transcript";
import { getDb, schema } from "../db/index.js";

function toLearnedCorrection(
  row: typeof schema.learnedCorrections.$inferSelect,
): LearnedCorrection {
  return {
    id: row.id,
    originalText: row.originalText,
    correctedText: row.correctedText,
    timesSeen: row.timesSeen,
    createdAt: row.createdAt,
  };
}

function pairKey(originalText: string, correctedText: string): string {
  return `${originalText.trim().toLowerCase()}::${correctedText.trim().toLowerCase()}`;
}

export async function listLearnedCorrections(): Promise<LearnedCorrection[]> {
  const db = getDb();
  const rows = await db.select().from(schema.learnedCorrections);
  return rows
    .sort((left, right) => right.timesSeen - left.timesSeen)
    .map(toLearnedCorrection);
}

export async function recordLearnedCorrection(input: {
  originalText: string;
  correctedText: string;
}): Promise<LearnedCorrection> {
  const originalText = input.originalText.trim();
  const correctedText = input.correctedText.trim();
  if (!originalText || !correctedText) {
    throw new Error("Both original and corrected text are required.");
  }
  if (originalText.toLowerCase() === correctedText.toLowerCase()) {
    throw new Error("Original and corrected text must differ.");
  }

  const db = getDb();
  const rows = await db.select().from(schema.learnedCorrections);
  const key = pairKey(originalText, correctedText);
  const existing = rows.find(
    (row) => pairKey(row.originalText, row.correctedText) === key,
  );

  const nextRows = existing
    ? rows.map((row) =>
        row.id === existing.id
          ? { ...row, timesSeen: row.timesSeen + 1 }
          : row,
      )
    : [
        ...rows,
        {
          id: crypto.randomUUID(),
          originalText,
          correctedText,
          timesSeen: 1,
          createdAt: new Date().toISOString(),
        },
      ];

  await db.delete(schema.learnedCorrections);
  if (nextRows.length > 0) {
    await db.insert(schema.learnedCorrections).values(nextRows);
  }

  const saved = nextRows.find(
    (row) => pairKey(row.originalText, row.correctedText) === key,
  );
  if (!saved) {
    throw new Error("Could not save learned correction.");
  }
  return toLearnedCorrection(saved);
}

export async function deleteLearnedCorrection(id: string): Promise<void> {
  const db = getDb();
  const rows = await db.select().from(schema.learnedCorrections);
  const remaining = rows.filter((row) => row.id !== id);
  if (remaining.length === rows.length) {
    throw new Error("Learned correction not found.");
  }
  await db.delete(schema.learnedCorrections);
  if (remaining.length > 0) {
    await db.insert(schema.learnedCorrections).values(remaining);
  }
}
