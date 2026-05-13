import type { WatchKeywordEntry } from "@shared/call-copilot";

function cleanPhrase(value: string): string {
  return value.replace(/\*\*/g, "").replace(/\s+/g, " ").trim();
}

function isLikelyHeading(line: string): boolean {
  if (line.length < 2 || line.length > 80) return false;
  if (/[.!?]$/.test(line)) return false;
  if (/^\d+(\.\d+)*\s/.test(line)) return false;
  return /^[A-Z0-9]/.test(line);
}

export function extractKeywordsFromText(text: string): WatchKeywordEntry[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const results: WatchKeywordEntry[] = [];

  for (const line of lines) {
    const colonMatch = line.match(/^(.{2,80}?):\s+(.{10,})$/);
    if (!colonMatch) continue;

    const phrase = cleanPhrase(colonMatch[1]);
    const definition = colonMatch[2].trim();
    if (!phrase || !definition) continue;

    results.push({ phrase, definition });
  }

  for (let index = 0; index < lines.length - 1; index += 1) {
    const heading = cleanPhrase(lines[index]);
    const body = lines[index + 1].trim();
    if (!isLikelyHeading(heading) || body.length < 20) continue;
    if (heading.includes(":")) continue;

    results.push({
      phrase: heading,
      definition: body,
    });
  }

  return normalizeExtractedKeywords(results);
}

function normalizeExtractedKeywords(entries: WatchKeywordEntry[]): WatchKeywordEntry[] {
  const seen = new Set<string>();
  const normalized: WatchKeywordEntry[] = [];

  for (const entry of entries) {
    const phrase = entry.phrase.trim();
    const definition = entry.definition.trim();
    if (!phrase || !definition) continue;

    const key = phrase.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    normalized.push({ phrase, definition });
  }

  return normalized;
}
