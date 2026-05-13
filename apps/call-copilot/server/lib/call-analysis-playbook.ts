import type { PlaybookDocument, PlaybookDocumentType } from "@shared/call-analysis";

const STOP_WORDS = new Set([
  "about",
  "after",
  "also",
  "been",
  "before",
  "being",
  "call",
  "could",
  "from",
  "have",
  "just",
  "like",
  "more",
  "that",
  "their",
  "there",
  "they",
  "this",
  "with",
  "would",
  "your",
]);

const SECTION_DOCUMENT_TYPES: Record<string, PlaybookDocumentType[]> = {
  overallScore: ["general_playbook", "cold_call_script"],
  keyStrengths: ["cold_call_script", "discovery_framework", "general_playbook"],
  areasToImprove: [
    "objection_handling",
    "discovery_framework",
    "closing_framework",
  ],
  missedOpportunities: [
    "discovery_framework",
    "closing_framework",
    "objection_handling",
  ],
  topActionItems: [
    "general_playbook",
    "closing_framework",
    "objection_handling",
  ],
};

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 4 && !STOP_WORDS.has(token));
}

function splitPlaybookSections(content: string): string[] {
  return content
    .split(/\n{2,}/)
    .map((section) => section.trim())
    .filter((section) => section.length >= 40);
}

function scoreSection(section: string, keywords: Set<string>): number {
  const tokens = new Set(tokenize(section));
  let score = 0;
  for (const keyword of keywords) {
    if (tokens.has(keyword)) score += 1;
  }
  return score;
}

export function selectRelevantPlaybookContext(input: {
  transcriptText: string;
  summaryText?: string;
  playbooks: PlaybookDocument[];
  sectionId: string;
  maxChars?: number;
}): string {
  const maxChars = input.maxChars ?? 2200;
  const keywords = new Set([
    ...tokenize(input.transcriptText),
    ...tokenize(input.summaryText ?? ""),
  ]);
  const preferredTypes = SECTION_DOCUMENT_TYPES[input.sectionId] ?? [];

  const candidates: Array<{ score: number; text: string }> = [];
  for (const playbook of input.playbooks) {
    const typeBoost = preferredTypes.includes(playbook.documentType) ? 2 : 0;
    for (const section of splitPlaybookSections(playbook.contentText)) {
      const score = scoreSection(section, keywords) + typeBoost;
      if (score === 0) continue;
      candidates.push({
        score,
        text: `[${playbook.filename} · ${playbook.documentType}]\n${section}`,
      });
    }
  }

  candidates.sort((left, right) => right.score - left.score);

  const selected: string[] = [];
  let usedChars = 0;
  for (const candidate of candidates) {
    if (usedChars + candidate.text.length > maxChars) continue;
    selected.push(candidate.text);
    usedChars += candidate.text.length;
    if (selected.length >= 6) break;
  }

  if (selected.length === 0) {
    return input.playbooks
      .slice(0, 2)
      .map(
        (playbook) =>
          `[${playbook.filename} · ${playbook.documentType}]\n${playbook.contentText.slice(0, 900)}`,
      )
      .join("\n\n");
  }

  return selected.join("\n\n");
}

/** Concatenate playbook excerpts for a single fast analysis pass. */
export function selectQuickPlaybookDigest(
  playbooks: PlaybookDocument[],
  maxChars = 6000,
): string {
  const chunks: string[] = [];
  let used = 0;
  for (const playbook of playbooks) {
    const header = `[${playbook.filename} · ${playbook.documentType}]\n`;
    const budget = maxChars - used - header.length;
    if (budget < 200) break;
    const slice = playbook.contentText.slice(0, Math.min(budget, 2800));
    chunks.push(`${header}${slice}`);
    used += header.length + slice.length;
  }
  if (chunks.length === 0) {
    return playbooks
      .slice(0, 2)
      .map(
        (playbook) =>
          `[${playbook.filename} · ${playbook.documentType}]\n${playbook.contentText.slice(0, 1200)}`,
      )
      .join("\n\n");
  }
  return chunks.join("\n\n");
}
