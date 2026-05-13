import { getSetting } from "@agent-native/core/settings";
import {
  WATCH_KEYWORDS_SETTING,
  normalizeKeywordEntries,
  type WatchKeywordEntry,
  type WatchKeywordSourceType,
} from "@shared/call-copilot";
import { getDb, schema } from "../db/index.js";

const SEED_KEYWORDS: WatchKeywordEntry[] = [
  {
    phrase: "Headless CMS",
    definition:
      "Builder.io provides a visual headless CMS that lets marketing teams edit content without developer involvement, unlike traditional headless CMS solutions that require developers for every change.",
    sourceType: "seed",
    sourceLabel: "Seeded examples",
  },
  {
    phrase: "Figma-to-code",
    definition:
      "Builder.io converts Figma designs directly into production-ready code (React, Vue, Angular, etc.), eliminating the manual handoff between design and engineering teams.",
    sourceType: "seed",
    sourceLabel: "Seeded examples",
  },
  {
    phrase: "Design system",
    definition:
      "Builder.io enables governance of design systems at scale, ensuring components stay consistent across teams and frameworks.",
    sourceType: "seed",
    sourceLabel: "Seeded examples",
  },
  {
    phrase: "Visual development",
    definition:
      "Builder.io's core platform that lets teams build and edit web experiences visually while outputting clean, framework-native code.",
    sourceType: "seed",
    sourceLabel: "Seeded examples",
  },
  {
    phrase: "Fusion",
    definition:
      "Builder.io's product that combines the visual CMS with code generation, allowing developers and marketers to collaborate in one workflow.",
    sourceType: "seed",
    sourceLabel: "Seeded examples",
  },
];

function keywordId(phrase: string): string {
  const slug = phrase
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || crypto.randomUUID();
}

function toEntry(row: typeof schema.watchKeywords.$inferSelect): WatchKeywordEntry {
  return {
    id: row.id,
    phrase: row.phrase,
    definition: row.definition,
    sourceType: row.sourceType as WatchKeywordSourceType,
    pdfId: row.pdfId,
    sourceLabel: row.sourceLabel,
  };
}

function toRow(entry: WatchKeywordEntry, timestamp: string) {
  return {
    id: entry.id ?? keywordId(entry.phrase),
    phrase: entry.phrase,
    definition: entry.definition,
    sourceType: entry.sourceType ?? "manual",
    pdfId: entry.pdfId ?? null,
    sourceLabel: entry.sourceLabel ?? null,
    createdAt: timestamp,
    updatedAt: timestamp,
  };
}

async function replaceAllKeywords(entries: WatchKeywordEntry[]): Promise<void> {
  const db = getDb();
  const normalized = normalizeKeywordEntries(entries);
  const now = new Date().toISOString();

  await db.delete(schema.watchKeywords);
  if (normalized.length === 0) return;

  await db.insert(schema.watchKeywords).values(
    normalized.map((entry) => toRow(entry, now)),
  );
}

export async function listWatchKeywords(): Promise<WatchKeywordEntry[]> {
  const db = getDb();
  const rows = await db.select().from(schema.watchKeywords);
  return rows
    .sort((left, right) => left.phrase.localeCompare(right.phrase))
    .map(toEntry);
}

export async function listManualWatchKeywords(): Promise<WatchKeywordEntry[]> {
  const keywords = await listWatchKeywords();
  return keywords.filter((entry) => entry.sourceType === "manual");
}

export async function listKeywordsForPdf(pdfId: string): Promise<WatchKeywordEntry[]> {
  const keywords = await listWatchKeywords();
  return keywords.filter((entry) => entry.pdfId === pdfId);
}

export async function replaceManualWatchKeywords(
  entries: WatchKeywordEntry[],
): Promise<WatchKeywordEntry[]> {
  const manual = normalizeKeywordEntries(entries).map((entry) => ({
    ...entry,
    sourceType: "manual" as const,
    pdfId: null,
    sourceLabel: entry.sourceLabel ?? "Manual",
  }));
  const preserved = (await listWatchKeywords()).filter(
    (entry) => entry.sourceType !== "manual",
  );
  await replaceAllKeywords([...preserved, ...manual]);
  return listWatchKeywords();
}

export async function replacePdfKeywords(
  pdfId: string,
  filename: string,
  entries: WatchKeywordEntry[],
): Promise<WatchKeywordEntry[]> {
  const pdfKeywords = normalizeKeywordEntries(entries).map((entry) => ({
    ...entry,
    sourceType: "pdf" as const,
    pdfId,
    sourceLabel: filename,
  }));
  const preserved = (await listWatchKeywords()).filter(
    (entry) => entry.pdfId !== pdfId,
  );
  await replaceAllKeywords([...preserved, ...pdfKeywords]);
  return listKeywordsForPdf(pdfId);
}

export async function deleteKeywordsForPdf(pdfId: string): Promise<void> {
  const preserved = (await listWatchKeywords()).filter(
    (entry) => entry.pdfId !== pdfId,
  );
  await replaceAllKeywords(preserved);
}

async function migrateLegacySettingsIfEmpty(): Promise<void> {
  const existing = await listWatchKeywords();
  if (existing.length > 0) return;

  const stored = (await getSetting(WATCH_KEYWORDS_SETTING)) as
    | { phrases?: string[] }
    | null;
  const phrases = Array.isArray(stored?.phrases) ? stored.phrases : [];
  if (phrases.length === 0) return;

  await replaceManualWatchKeywords(
    phrases.map((phrase) => ({
      phrase,
      definition: "",
      sourceLabel: "Manual",
    })),
  );
}

export async function ensureWatchKeywordSeeds(): Promise<void> {
  await migrateLegacySettingsIfEmpty();

  const existing = await listWatchKeywords();
  const existingByPhrase = new Map(
    existing.map((entry) => [entry.phrase.toLowerCase(), entry]),
  );

  let next = existing.slice();
  let changed = false;

  for (const seed of SEED_KEYWORDS) {
    const key = seed.phrase.toLowerCase();
    const current = existingByPhrase.get(key);
    if (!current) {
      next.push(seed);
      changed = true;
      continue;
    }

    if (!current.definition.trim() && current.sourceType !== "pdf") {
      next = next.map((entry) =>
        entry.phrase.toLowerCase() === key
          ? {
              ...entry,
              definition: seed.definition,
              sourceType: "seed",
              sourceLabel: seed.sourceLabel,
            }
          : entry,
      );
      changed = true;
    }
  }

  if (changed) {
    await replaceAllKeywords(next);
  }
}

/** @deprecated Use replaceManualWatchKeywords for manual edits. */
export async function replaceWatchKeywords(
  entries: WatchKeywordEntry[],
): Promise<WatchKeywordEntry[]> {
  return replaceManualWatchKeywords(entries);
}
