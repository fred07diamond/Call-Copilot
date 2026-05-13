import { runBuilderGatewayLlm } from "./builder-llm-gateway.js";

/** Fast model on the Builder gateway (same credential path as agent chat). */
const SPEAKER_LABEL_MODEL = "claude-haiku-4-5";
const LABEL_TIMEOUT_MS = 60_000;

export interface SpeakerLabelSegment {
  id: string;
  text: string;
  speaker?: string | null;
}

export interface SpeakerLabelAssignment {
  id: string;
  speaker: string;
  confidence?: number;
}

export interface SpeakerLabelRequest {
  mode: "incremental" | "final";
  callContextHint?: string;
  contextSegments: SpeakerLabelSegment[];
  targetSegments: SpeakerLabelSegment[];
}

function warn(message: string, error?: unknown): void {
  const detail =
    error instanceof Error
      ? error.message
      : error != null
        ? String(error)
        : "";
  console.warn(
    detail
      ? `[speaker-labeler-engine] ${message}: ${detail}`
      : `[speaker-labeler-engine] ${message}`,
  );
}

function extractJsonArray(text: string): unknown {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response did not include a JSON array.");
  }
  return JSON.parse(text.slice(start, end + 1));
}

function buildIncrementalPrompt(input: SpeakerLabelRequest): string {
  const context = input.contextSegments
    .map(
      (segment) =>
        `${segment.id}: ${segment.speaker?.trim() || "Unknown"} — ${segment.text}`,
    )
    .join("\n");
  const targets = input.targetSegments
    .map((segment) => `${segment.id}: ${segment.text}`)
    .join("\n");

  return [
    "You are analyzing a live sales call transcript between a Builder.io sales rep and a prospect. Based on conversational context, label each segment with the correct speaker. Use these clues: the rep will be explaining Builder.io products, pitching value props, asking discovery questions, and handling objections. The prospect will be asking questions, describing their current setup, raising concerns, and responding to the pitch. Also use general conversational patterns: greetings, turn-taking, question-answer pairs, and topic shifts.",
    "If more than two speakers are present, label them Speaker 1, Speaker 2, Speaker 3, and so on instead of You/Guest.",
    "Return a JSON array of objects with keys id, speaker, and optional confidence (0-1).",
    input.callContextHint?.trim()
      ? `Call context hint: ${input.callContextHint.trim()}`
      : null,
    "Already labeled context:",
    context || "(none)",
    "Segments to label:",
    targets,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function buildFinalPrompt(input: SpeakerLabelRequest): string {
  const transcript = input.targetSegments
    .map(
      (segment) =>
        `${segment.id}: ${segment.speaker?.trim() || "Unlabeled"} — ${segment.text}`,
    )
    .join("\n");

  return [
    "Review this complete sales call transcript and ensure all speaker labels are correct and consistent. Fix any segments where the speaker assignment seems wrong based on the full conversation context. The call is between a Builder.io sales rep (labeled You) and a prospect (labeled Guest). If more than two speakers are present, use Speaker 1, Speaker 2, Speaker 3, and so on.",
    "Return the corrected labels as a JSON array of objects with keys id, speaker, and optional confidence (0-1).",
    input.callContextHint?.trim()
      ? `Call context hint: ${input.callContextHint.trim()}`
      : null,
    "Transcript:",
    transcript,
  ]
    .filter(Boolean)
    .join("\n\n");
}

function normalizeAssignments(value: unknown): SpeakerLabelAssignment[] {
  if (!Array.isArray(value)) {
    throw new Error("Model response was not a JSON array.");
  }

  const assignments: SpeakerLabelAssignment[] = [];
  for (const entry of value) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as Record<string, unknown>;
    const id = typeof record.id === "string" ? record.id.trim() : "";
    const speaker =
      typeof record.speaker === "string" ? record.speaker.trim() : "";
    if (!id || !speaker) continue;
    const confidence =
      typeof record.confidence === "number" ? record.confidence : undefined;
    assignments.push({ id, speaker, confidence });
  }

  if (assignments.length === 0) {
    throw new Error("Model response did not include speaker labels.");
  }

  return assignments;
}

export async function runSpeakerLabeling(
  input: SpeakerLabelRequest,
): Promise<SpeakerLabelAssignment[]> {
  try {
    const prompt =
      input.mode === "final"
        ? buildFinalPrompt(input)
        : buildIncrementalPrompt(input);

    const { text: content, timedOut } = await runBuilderGatewayLlm({
      model: SPEAKER_LABEL_MODEL,
      messages: [
        {
          role: "system",
          content:
            "You label speakers in sales call transcripts. Return JSON only, with no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
      maxOutputTokens: 1_200,
      stream: false,
      timeoutMs: LABEL_TIMEOUT_MS,
    });

    if (timedOut) {
      warn("Speaker labeling timed out.");
      return [];
    }

    if (!content?.trim()) {
      warn("Speaker labeling response did not include message content.");
      return [];
    }

    return normalizeAssignments(extractJsonArray(content));
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      warn("Speaker labeling timed out.");
      return [];
    }
    warn("Speaker labeling failed", error);
    return [];
  }
}
