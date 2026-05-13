export type TranscriptSpeakerId = string;
export type TranscriptSegmentStatus = "live" | "pending" | "labeled";
export type TranscriptLabelSource = "ai" | "manual";

export interface TranscriptSegment {
  id: string;
  text: string;
  spokenAt: string;
  speaker: string | null;
  labelSource: TranscriptLabelSource | null;
  labelConfidence: number | null;
  status: TranscriptSegmentStatus;
  speakerId: TranscriptSpeakerId;
  speakerLabel: string;
  speakerColor?: string;
  startTime?: number;
  endTime?: number;
}

export function normalizeTranscriptSegment(
  segment: Partial<TranscriptSegment> & Pick<TranscriptSegment, "id" | "text">,
): TranscriptSegment {
  const speaker =
    segment.speaker ??
    (segment.speakerLabel?.trim() ? segment.speakerLabel.trim() : null);
  const status =
    segment.status ??
    (speaker ? "labeled" : ("pending" as TranscriptSegmentStatus));
  const speakerLabel = segment.speakerLabel?.trim() || speaker || "";
  const speakerId =
    segment.speakerId?.trim() ||
    (speakerLabel ? speakerLabel.toLowerCase().replace(/\s+/g, "-") : "unknown");

  return {
    id: segment.id,
    text: segment.text,
    spokenAt: segment.spokenAt?.trim() || new Date().toISOString(),
    speaker,
    labelSource: segment.labelSource ?? (speaker ? "manual" : null),
    labelConfidence: segment.labelConfidence ?? null,
    status,
    speakerId,
    speakerLabel,
    speakerColor: segment.speakerColor,
    startTime: segment.startTime,
    endTime: segment.endTime,
  };
}

export interface SavedTranscript {
  id: string;
  sessionName: string;
  savedAt: string;
  segments: TranscriptSegment[];
}

export interface SavedTranscriptsResponse {
  transcripts: SavedTranscript[];
}

export interface LearnedCorrection {
  id: string;
  originalText: string;
  correctedText: string;
  timesSeen: number;
  createdAt: string;
}

export interface LearnedCorrectionsResponse {
  corrections: LearnedCorrection[];
}

export interface VocabularyCorrection {
  id: string;
  originalText: string;
  correctedText: string;
  source: "builtin" | "manual";
  createdAt: string;
}

export interface VocabularyCorrectionsResponse {
  corrections: VocabularyCorrection[];
}

export interface CorrectionBundle {
  learned: LearnedCorrection[];
  vocabulary: VocabularyCorrection[];
}

export function formatSpokenTimestamp(value: string | Date): string {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
}

export function defaultSessionName(date = new Date()): string {
  const formatted = date.toLocaleString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
  return `Call - ${formatted}`;
}

export function transcriptPlainText(segments: TranscriptSegment[]): string {
  return segments
    .map((segment) => {
      const label =
        segment.speaker?.trim() ||
        segment.speakerLabel?.trim() ||
        "Unlabeled";
      return `[${formatSpokenTimestamp(segment.spokenAt)}] ${label}: ${segment.text}`;
    })
    .join("\n");
}

export function findMatchedKeywordsInSegments(
  segments: TranscriptSegment[],
  keywords: string[],
): string[] {
  const haystack = segments.map((segment) => segment.text).join(" ").toLowerCase();
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

export function extractWordReplacements(
  original: string,
  corrected: string,
): Array<{ originalText: string; correctedText: string }> {
  const originalWords = original.trim().split(/\s+/).filter(Boolean);
  const correctedWords = corrected.trim().split(/\s+/).filter(Boolean);
  if (originalWords.length === 0 || correctedWords.length === 0) return [];

  const replacements: Array<{ originalText: string; correctedText: string }> =
    [];
  const maxLength = Math.max(originalWords.length, correctedWords.length);

  for (let index = 0; index < maxLength; index += 1) {
    const from = originalWords[index];
    const to = correctedWords[index];
    if (!from || !to) continue;
    if (from.toLowerCase() === to.toLowerCase()) continue;
    replacements.push({ originalText: from, correctedText: to });
  }

  return replacements;
}

export interface CorrectionRule {
  originalText: string;
  correctedText: string;
}

export function applyTranscriptCorrections(
  text: string,
  rules: CorrectionRule[],
): string {
  let next = text;
  const sorted = [...rules].sort(
    (left, right) => right.originalText.length - left.originalText.length,
  );

  for (const rule of sorted) {
    const original = rule.originalText.trim();
    const corrected = rule.correctedText.trim();
    if (!original || !corrected) continue;
    const pattern = new RegExp(
      `\\b${escapeRegExp(original)}\\b`,
      "gi",
    );
    next = next.replace(pattern, corrected);
  }

  return normalizeSpokenPunctuation(next);
}

export function normalizeSpokenPunctuation(text: string): string {
  let next = text
    .replace(/\bquestion mark\b/gi, "?")
    .replace(/\bexclamation point\b/gi, "!")
    .replace(/\bperiod\b/gi, ".")
    .replace(/\bcomma\b/gi, ",");

  next = next.replace(/\s+([.,!?])/g, "$1");
  next = next.replace(/([.,!?])(?=\S)/g, "$1 ");

  return next;
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export const TECHNICAL_VOCABULARY = [
  "React",
  "Vue",
  "Angular",
  "Svelte",
  "Next.js",
  "Nuxt",
  "Figma",
  "Builder.io",
  "headless CMS",
  "Tailwind",
  "TypeScript",
  "JavaScript",
  "Node.js",
  "GraphQL",
  "REST API",
  "SDK",
  "CLI",
  "SSO",
  "SOC 2",
  "Drizzle",
  "Vite",
  "Nitro",
  "pnpm",
  "npm",
  "Vercel",
  "Netlify",
  "Contentful",
  "Contentstack",
  "Adobe AEM",
  "Sitecore",
  "WordPress",
  "Drupal",
  "design system",
  "design tokens",
  "component mapping",
  "A2A protocol",
  "MCP",
  "LLM",
] as const;

export const BUILTIN_CORRECTION_RULES: CorrectionRule[] = [
  { originalText: "reacting", correctedText: "React" },
  { originalText: "next day yes", correctedText: "Next.js" },
  { originalText: "next js", correctedText: "Next.js" },
  { originalText: "builder io", correctedText: "Builder.io" },
  { originalText: "node js", correctedText: "Node.js" },
  { originalText: "type script", correctedText: "TypeScript" },
  { originalText: "java script", correctedText: "JavaScript" },
  { originalText: "graph ql", correctedText: "GraphQL" },
  { originalText: "rest api", correctedText: "REST API" },
  { originalText: "headless cms", correctedText: "headless CMS" },
  { originalText: "design system", correctedText: "design system" },
  { originalText: "soc 2", correctedText: "SOC 2" },
  { originalText: "a2a protocol", correctedText: "A2A protocol" },
  { originalText: "component mapping", correctedText: "component mapping" },
  { originalText: "design tokens", correctedText: "design tokens" },
];
