/** Max words before we compress the middle (opener + closer stay verbatim). */
export const CALL_ANALYSIS_MAX_WORDS_FULL = 3000;

/** Words to keep at start and end when compressing. */
const HEAD_WORDS = 800;
const TAIL_WORDS = 800;

function normalizeWhitespace(text: string): string {
  return text
    .replace(/\r\n/g, "\n")
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}

/**
 * Collapse repeated line-leading timestamps (e.g. duplicate [HH:MM:SS] or ISO prefixes).
 */
function dedupeLineTimestamps(text: string): string {
  const lines = text.split("\n");
  const timestampLine =
    /^\s*(?:\[(?:\d{1,2}:){1,2}\d{2}(?::\d{2})?\]|\d{1,2}:\d{2}(?::\d{2})?\s+|(?:\d{4}-\d{2}-\d{2}T[\d:.]+Z?)\s*)/;
  let lastStamp: string | null = null;
  const out: string[] = [];
  for (const line of lines) {
    const match = line.match(timestampLine);
    if (match) {
      const stamp = match[0].trim();
      if (stamp === lastStamp) {
        out.push(line.slice(match[0].length).trimStart());
        continue;
      }
      lastStamp = stamp;
    } else if (line.trim().length > 0) {
      lastStamp = null;
    }
    out.push(line);
  }
  return out.join("\n");
}

export function countWords(text: string): number {
  const parts = text.trim().split(/\s+/);
  return parts[0] === "" ? 0 : parts.length;
}

/** Words to send to the agent-only quick score (opener + closer). */
export const QUICK_SCORE_WORDS_EACH_SIDE = 500;

/**
 * First/last word windows for a tiny LLM prompt (same normalization as full analysis).
 */
export function buildQuickScoreTranscriptExcerpt(
  rawTranscript: string,
  wordsEachSide: number = QUICK_SCORE_WORDS_EACH_SIDE,
): { excerpt: string; totalWords: number; usedFullTranscript: boolean } {
  let text = normalizeWhitespace(rawTranscript);
  text = dedupeLineTimestamps(text);
  const words = text.split(/\s+/).filter(Boolean);
  const totalWords = words.length;
  if (totalWords <= wordsEachSide * 2) {
    return { excerpt: text, totalWords, usedFullTranscript: true };
  }
  const opener = words.slice(0, wordsEachSide).join(" ");
  const closer = words.slice(-wordsEachSide).join(" ");
  return {
    excerpt: `--- First ${wordsEachSide} words ---\n${opener}\n\n--- Last ${wordsEachSide} words ---\n${closer}`,
    totalWords,
    usedFullTranscript: false,
  };
}

export interface PreparedTranscriptForLlm {
  /** Text actually embedded in LLM prompts (may include middle summary). */
  promptText: string;
  /** Original normalized full transcript (for storage / deep pipeline source of truth). */
  fullNormalized: string;
  wordCount: number;
  middleSummarized: boolean;
  middleWordCount: number;
}

/**
 * Trim noise for LLM prompts: whitespace cleanup, duplicate timestamps, and
 * opener+closer preservation with an optional middle summary when over the word budget.
 */
export async function prepareTranscriptForLlm(
  rawTranscript: string,
  summarizeMiddle: (middle: string, wordCount: number) => Promise<string>,
): Promise<PreparedTranscriptForLlm> {
  let text = normalizeWhitespace(rawTranscript);
  text = dedupeLineTimestamps(text);
  const wordCount = countWords(text);
  if (wordCount <= CALL_ANALYSIS_MAX_WORDS_FULL) {
    return {
      promptText: text,
      fullNormalized: text,
      wordCount,
      middleSummarized: false,
      middleWordCount: 0,
    };
  }

  const words = text.split(/\s+/).filter((w) => w.length > 0);
  const head = words.slice(0, HEAD_WORDS).join(" ");
  const tail = words.slice(-TAIL_WORDS).join(" ");
  const middleWords = words.slice(HEAD_WORDS, Math.max(HEAD_WORDS, words.length - TAIL_WORDS));
  const middleText = middleWords.join(" ");
  const middleSummary = await summarizeMiddle(middleText, middleWords.length);

  const promptText = [
    "=== CALL TRANSCRIPT (OPENING — verbatim) ===",
    head,
    "",
    `=== MIDDLE SECTION (compressed from ${middleWords.length} words) ===`,
    middleSummary,
    "",
    "=== CALL TRANSCRIPT (CLOSING — verbatim) ===",
    tail,
  ].join("\n");

  return {
    promptText,
    fullNormalized: text,
    wordCount,
    middleSummarized: true,
    middleWordCount: middleWords.length,
  };
}
