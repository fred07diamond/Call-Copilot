import type { TranscriptSegment } from "./transcript.js";

export const SESSION_STATE_KEY = "call-copilot.session";

/** @deprecated Legacy settings key; keywords now live in SQL. */
export const WATCH_KEYWORDS_SETTING = "call-copilot.watch-keywords";

export type WatchKeywordSourceType = "manual" | "pdf" | "seed";

export interface WatchKeywordEntry {
  id?: string;
  phrase: string;
  definition: string;
  sourceType?: WatchKeywordSourceType;
  pdfId?: string | null;
  sourceLabel?: string | null;
}

export interface WatchKeywordsResponse {
  keywords: WatchKeywordEntry[];
}


export interface KnowledgeBasePdf {
  id: string;
  filename: string;
  uploadedAt: string;
  keywordCount: number;
  keywords: WatchKeywordEntry[];
}

export interface KnowledgeBasePdfsResponse {
  pdfs: KnowledgeBasePdf[];
}


export interface CallSessionState {
  listening: boolean;
  transcript: string;
  interim: string;
  segments: TranscriptSegment[];
  matchedKeywords: string[];
  updatedAt: string;
}

export function normalizeKeywordEntries(
  entries: WatchKeywordEntry[],
): WatchKeywordEntry[] {
  const seen = new Set<string>();
  const normalized: WatchKeywordEntry[] = [];

  for (const entry of entries) {
    const phrase = entry.phrase.trim();
    if (!phrase) continue;
    const key = phrase.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push({
      id: entry.id,
      phrase,
      definition: entry.definition.trim(),
      sourceType: entry.sourceType,
      pdfId: entry.pdfId ?? null,
      sourceLabel: entry.sourceLabel?.trim() || null,
    });
  }

  return normalized;
}

export function keywordPhrases(entries: WatchKeywordEntry[]): string[] {
  return normalizeKeywordEntries(entries).map((entry) => entry.phrase);
}

export function findMatchedKeywords(
  transcript: string,
  keywords: string[],
): string[] {
  const haystack = transcript.toLowerCase();
  const matches: string[] = [];
  for (const keyword of keywords) {
    const needle = keyword.trim().toLowerCase();
    if (!needle) continue;
    if (haystack.includes(needle)) {
      matches.push(keyword);
    }
  }
  return matches;
}
