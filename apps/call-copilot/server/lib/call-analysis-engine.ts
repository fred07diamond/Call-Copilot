import type {
  CallAnalysisResult,
  CallAnalysisSectionId,
  CallAnalysisStreamEvent,
  CallAnalysisTier,
  PlaybookDocument,
  TranscriptAnalysisSummary,
} from "@shared/call-analysis";
import {
  CALL_ANALYSIS_PROGRESS_STEPS,
  CALL_ANALYSIS_QUICK_PROGRESS_STEPS,
  CALL_ANALYSIS_QUICK_TOTAL_STEPS,
  CALL_ANALYSIS_SECTION_ORDER,
  CALL_ANALYSIS_TOTAL_STEPS,
} from "@shared/call-analysis";
import {
  selectQuickPlaybookDigest,
  selectRelevantPlaybookContext,
} from "./call-analysis-playbook.js";
import {
  buildQuickScoreTranscriptExcerpt,
  prepareTranscriptForLlm,
} from "./call-analysis-transcript.js";
import {
  BUILDER_DEFAULT_MODEL,
  runBuilderGatewayLlm,
} from "./builder-llm-gateway.js";

/** Same default model id as agent chat (Builder gateway). */
export const BUILDER_ANALYSIS_MODEL = BUILDER_DEFAULT_MODEL;
const ANALYZE_CALL_LOG_PREFIX = "[analyze-call]";
const LLM_TIMEOUT_MS = 60_000;
const QUICK_SCORE_LLM_TIMEOUT_MS = 30_000;
const MIDDLE_SUMMARY_TIMEOUT_MS = 22_000;

type StreamCallback = (event: CallAnalysisStreamEvent) => void;

function extractJsonObject(text: string): unknown {
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Model response did not include JSON.");
  }
  return JSON.parse(text.slice(start, end + 1));
}

async function chatCompletion(input: {
  messages: Array<{ role: string; content: string }>;
  max_tokens: number;
  stream: boolean;
  onDelta?: (text: string) => void;
  signal?: AbortSignal;
  /** Override default 60s cap (e.g. quick score). */
  timeoutMs?: number;
}): Promise<{ text: string; timedOut: boolean }> {
  const payloadChars = input.messages.reduce((n, m) => n + m.content.length, 0);
  console.error(
    `${ANALYZE_CALL_LOG_PREFIX} model:`,
    BUILDER_ANALYSIS_MODEL,
    "stream:",
    input.stream,
    "approx prompt chars:",
    payloadChars,
  );

  return runBuilderGatewayLlm({
    model: BUILDER_ANALYSIS_MODEL,
    messages: input.messages,
    maxOutputTokens: input.max_tokens,
    stream: input.stream,
    onDelta: input.onDelta,
    signal: input.signal,
    timeoutMs: input.timeoutMs ?? LLM_TIMEOUT_MS,
  });
}

async function summarizeMiddleForPrompt(
  middle: string,
  middleWordCount: number,
): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), MIDDLE_SUMMARY_TIMEOUT_MS);
  const excerpt = middle.slice(0, 14_000);
  try {
    const { text } = await chatCompletion({
      messages: [
        {
          role: "system",
          content:
            "You compress sales-call transcript middles. Output 4-7 short sentences of plain prose. No JSON, no bullets.",
        },
        {
          role: "user",
          content: `The following is the MIDDLE portion of a sales call (${middleWordCount} words). Summarize themes, objections, budget/timeline signals, and stakeholder dynamics.\n\n${excerpt}`,
        },
      ],
      max_tokens: 400,
      stream: false,
      signal: controller.signal,
    });
    const trimmed = text.trim();
    return trimmed.length > 0
      ? trimmed
      : `[Middle section (${middleWordCount} words) — summarization returned empty.]`;
  } catch {
    return `[Middle section (${middleWordCount} words) omitted; excerpt: ${excerpt.slice(0, 400)}…]`;
  } finally {
    clearTimeout(timeout);
  }
}

function progressEvent(
  sectionId: CallAnalysisSectionId | "summary" | "quick",
): CallAnalysisStreamEvent {
  if (sectionId === "quick") {
    return {
      type: "progress",
      progress: {
        step: 1,
        total: CALL_ANALYSIS_QUICK_TOTAL_STEPS,
        label: CALL_ANALYSIS_QUICK_PROGRESS_STEPS[0]?.label ?? "Quick analysis",
        sectionId: "quick",
      },
    };
  }
  const index = CALL_ANALYSIS_PROGRESS_STEPS.findIndex(
    (step) => step.id === sectionId,
  );
  const step = index >= 0 ? index + 1 : 1;
  const label = CALL_ANALYSIS_PROGRESS_STEPS[index]?.label ?? sectionId;
  return {
    type: "progress",
    progress: {
      step,
      total: CALL_ANALYSIS_TOTAL_STEPS,
      label,
      sectionId,
    },
  };
}

function summaryText(summary: TranscriptAnalysisSummary): string {
  return JSON.stringify(summary, null, 2);
}

function sectionPrompt(input: {
  sectionId: CallAnalysisSectionId;
  transcriptSummary: TranscriptAnalysisSummary;
  prospectContext: string;
  playbookContext: string;
}): string {
  const shared = [
    input.prospectContext
      ? `Prospect context: ${input.prospectContext}`
      : "Prospect context: not provided",
    "Transcript summary:",
    summaryText(input.transcriptSummary),
    "Relevant playbook excerpts:",
    input.playbookContext,
  ].join("\n\n");

  switch (input.sectionId) {
    case "overallScore":
      return `${shared}\n\nReturn JSON: { "score": number 1-10, "summary": string }`;
    case "keyStrengths":
      return `${shared}\n\nReturn JSON: { "summary": string, "items": [{ "title": string, "detail": string, "quote"?: string }] }`;
    case "areasToImprove":
      return `${shared}\n\nReturn JSON: { "summary": string, "items": [{ "title": string, "detail": string, "quote"?: string }] }`;
    case "missedOpportunities":
      return `${shared}\n\nReturn JSON: { "summary": string, "items": [{ "opportunity": string, "playbookReference": string }] }`;
    case "topActionItems":
      return `${shared}\n\nReturn JSON: { "items": [{ "priority": number, "action": string, "playbookSection": string }] } with exactly 3 items.`;
    default:
      return shared;
  }
}

async function summarizeTranscript(input: {
  transcriptPromptText: string;
  prospectContext: string;
  emit: StreamCallback;
  onDelta: (text: string) => void;
}): Promise<{ summary: TranscriptAnalysisSummary; timedOut: boolean; partial: string }> {
  input.emit(progressEvent("summary"));
  input.emit({ type: "section-start", sectionId: "summary" });

  const prompt = [
    "Summarize this sales call transcript for downstream coaching analysis.",
    "Return JSON with keys: keyMoments (string[]), questionsAsked (string[]), objectionsRaised (string[]), valuePropsMentioned (string[]), talkRatio { repPercent, prospectPercent, assessment }.",
    input.prospectContext
      ? `Prospect context: ${input.prospectContext}`
      : "Prospect context: not provided",
    "Transcript:",
    input.transcriptPromptText,
  ].join("\n\n");

  let streamed = "";
  const { text, timedOut: llmTimedOut } = await chatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are a sales call coach for Builder.io. Return concise JSON only, with no markdown fences.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 900,
    stream: true,
    onDelta: (delta) => {
      streamed += delta;
      input.onDelta(delta);
    },
  });

  const raw = text || streamed;
  let parsed: TranscriptAnalysisSummary;
  try {
    parsed = extractJsonObject(raw || streamed) as TranscriptAnalysisSummary;
  } catch {
    parsed = {
      keyMoments: [],
      questionsAsked: [],
      objectionsRaised: [],
      valuePropsMentioned: [],
      talkRatio: { repPercent: 50, prospectPercent: 50, assessment: "Unavailable" },
    };
  }
  input.emit({ type: "section-complete", sectionId: "summary", data: parsed });
  return { summary: parsed, timedOut: llmTimedOut, partial: raw || streamed };
}

async function generateSection(input: {
  sectionId: CallAnalysisSectionId;
  transcriptText: string;
  transcriptSummary: TranscriptAnalysisSummary;
  prospectContext: string;
  playbooks: PlaybookDocument[];
  emit: StreamCallback;
}): Promise<{ data: unknown; timedOut: boolean }> {
  input.emit(progressEvent(input.sectionId));
  input.emit({ type: "section-start", sectionId: input.sectionId });

  const playbookContext = selectRelevantPlaybookContext({
    transcriptText: input.transcriptText,
    summaryText: summaryText(input.transcriptSummary),
    playbooks: input.playbooks,
    sectionId: input.sectionId,
  });

  const prompt = sectionPrompt({
    sectionId: input.sectionId,
    transcriptSummary: input.transcriptSummary,
    prospectContext: input.prospectContext,
    playbookContext,
  });

  let streamed = "";
  const { text, timedOut: llmTimedOut } = await chatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are a sales call coach for Builder.io. Return concise JSON only, with no markdown fences.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 1_200,
    stream: true,
    onDelta: (delta) => {
      streamed += delta;
      input.emit({ type: "section-delta", sectionId: input.sectionId, text: delta });
    },
  });

  const raw = text || streamed;
  let parsed: unknown;
  try {
    parsed = extractJsonObject(raw || streamed);
  } catch {
    parsed = {};
  }
  input.emit({
    type: "section-complete",
    sectionId: input.sectionId,
    data: parsed,
  });
  return { data: parsed, timedOut: llmTimedOut };
}

function buildResult(
  transcriptSummary: TranscriptAnalysisSummary,
  sections: Partial<Record<CallAnalysisSectionId, unknown>>,
): CallAnalysisResult {
  const overall = sections.overallScore as CallAnalysisResult["overallScore"];
  const strengths = sections.keyStrengths as CallAnalysisResult["keyStrengths"];
  const improvements = sections.areasToImprove as CallAnalysisResult["areasToImprove"];
  const missed = sections.missedOpportunities as CallAnalysisResult["missedOpportunities"];
  const actions = sections.topActionItems as CallAnalysisResult["topActionItems"];

  return {
    analysisTier: "deep",
    incompleteNote: null,
    transcriptSummary,
    overallScore: overall ?? { score: 0, summary: "" },
    keyStrengths: strengths ?? { summary: "", items: [] },
    areasToImprove: improvements ?? { summary: "", items: [] },
    missedOpportunities: missed ?? { summary: "", items: [] },
    topActionItems: actions ?? { items: [] },
  };
}

function normalizeQuickJson(parsed: Record<string, unknown>): CallAnalysisResult {
  const overall = parsed.overallScore as CallAnalysisResult["overallScore"] | undefined;
  const strengths = parsed.keyStrengths as CallAnalysisResult["keyStrengths"] | undefined;
  const improvements = parsed.areasToImprove as CallAnalysisResult["areasToImprove"] | undefined;
  const actions = parsed.topActionItems as CallAnalysisResult["topActionItems"] | undefined;

  const padStrengths = (strengths?.items ?? []).slice(0, 3);
  const padImprove = (improvements?.items ?? []).slice(0, 3);
  const padActions = (actions?.items ?? []).slice(0, 3);

  const score =
    typeof overall?.score === "number" && Number.isFinite(overall.score)
      ? Math.min(10, Math.max(1, overall.score))
      : 5;
  const summary =
    typeof overall?.summary === "string" && overall.summary.trim()
      ? overall.summary.trim()
      : "See strengths, improvements, and action items below.";

  return {
    analysisTier: "quick",
    incompleteNote: null,
    overallScore: { score, summary },
    keyStrengths: {
      summary: strengths?.summary ?? "",
      items: padStrengths,
    },
    areasToImprove: {
      summary: improvements?.summary ?? "",
      items: padImprove,
    },
    missedOpportunities: {
      summary:
        "This is a quick pass. Run the deep-call-analysis action for missed opportunities and a full playbook-aligned review.",
      items: [],
    },
    topActionItems: {
      items: padActions.map((item, index) => ({
        priority: item.priority ?? index + 1,
        action: item.action ?? "",
        playbookSection: item.playbookSection ?? "Playbook",
      })),
    },
  };
}

export function analysisIsComplete(result: CallAnalysisResult): boolean {
  if (result.analysisTier === "quick") {
    return Boolean(
      result.overallScore?.score &&
        result.keyStrengths?.items?.length > 0 &&
        result.areasToImprove?.items?.length > 0 &&
        result.topActionItems?.items?.length > 0,
    );
  }
  return Boolean(
    result.overallScore?.score &&
      result.keyStrengths?.summary &&
      result.areasToImprove?.summary &&
      result.missedOpportunities?.summary &&
      result.topActionItems?.items?.length,
  );
}

export function analysisIsPublishable(result: CallAnalysisResult): boolean {
  if (analysisIsComplete(result)) return true;
  return Boolean(
    result.overallScore?.score &&
      result.incompleteNote?.trim() &&
      (result.analysisTier === "quick" || result.analysisTier === "deep"),
  );
}

export function analysisIsDeepComplete(result: CallAnalysisResult): boolean {
  return Boolean(
    result.transcriptSummary &&
      result.overallScore?.score &&
      result.keyStrengths?.summary &&
      result.areasToImprove?.summary &&
      result.missedOpportunities?.summary &&
      result.topActionItems?.items?.length,
  );
}

/**
 * Tiny LLM pass for agent chat: opener + closer word windows only, plain-text reply.
 */
export async function runQuickCallScore(input: {
  transcriptText: string;
}): Promise<{
  coachReply: string;
  timedOut: boolean;
  totalWords: number;
  usedFullTranscript: boolean;
}> {
  const { excerpt, totalWords, usedFullTranscript } = buildQuickScoreTranscriptExcerpt(
    input.transcriptText,
  );
  const userContent = [
    "Here are excerpts from a sales call transcript (opening and closing only; middle omitted for speed):",
    excerpt,
    "",
    "Rate this sales call 1-10 and give 3 bullet point action items. Be concise; respond in under 200 words total. Plain text only (no JSON).",
  ].join("\n");

  const { text, timedOut } = await chatCompletion({
    messages: [
      {
        role: "system",
        content:
          "You are a concise sales coach. Answer in plain text only. No markdown code fences.",
      },
      { role: "user", content: userContent },
    ],
    max_tokens: 400,
    stream: false,
    timeoutMs: QUICK_SCORE_LLM_TIMEOUT_MS,
  });

  return {
    coachReply: text.trim(),
    timedOut,
    totalWords,
    usedFullTranscript,
  };
}

export async function runQuickCallAnalysisPipeline(input: {
  transcriptText: string;
  prospectContext: string;
  playbooks: PlaybookDocument[];
  emit: StreamCallback;
}): Promise<CallAnalysisResult> {
  const prepared = await prepareTranscriptForLlm(
    input.transcriptText,
    summarizeMiddleForPrompt,
  );

  input.emit(progressEvent("quick"));
  input.emit({ type: "section-start", sectionId: "quick" });

  const playbookDigest = selectQuickPlaybookDigest(input.playbooks);
  const prompt = [
    "You are a sales call coach for Builder.io.",
    "Return ONE JSON object only (no markdown). Keys:",
    '- overallScore: { "score": number 1-10, "summary": string }',
    '- keyStrengths: { "summary": string, "items": array of EXACTLY 3 { "title", "detail", "quote?" } }',
    '- areasToImprove: { "summary": string, "items": array of EXACTLY 3 { "title", "detail", "quote?" } }',
    '- topActionItems: { "items": array of EXACTLY 3 { "priority": 1-3, "action", "playbookSection" } }',
    input.prospectContext
      ? `Prospect context: ${input.prospectContext}`
      : "Prospect context: not provided",
    "Playbook excerpts (follow these norms):",
    playbookDigest,
    "Transcript:",
    prepared.promptText,
  ].join("\n\n");

  let streamed = "";
  const { text, timedOut: llmTimedOut } = await chatCompletion({
    messages: [
      {
        role: "system",
        content:
          "Return valid JSON only. Be concise so the response finishes quickly.",
      },
      { role: "user", content: prompt },
    ],
    max_tokens: 2_000,
    stream: true,
    onDelta: (delta) => {
      streamed += delta;
      input.emit({ type: "section-delta", sectionId: "quick", text: delta });
    },
  });

  const raw = text || streamed;
  let result: CallAnalysisResult;
  let incompleteNote: string | null = null;
  try {
    const parsed = extractJsonObject(raw || streamed) as Record<string, unknown>;
    result = normalizeQuickJson(parsed);
  } catch {
    result = normalizeQuickJson({});
    incompleteNote =
      llmTimedOut || !raw.trim()
        ? "Analysis was incomplete: the model hit the 60 second limit or returned invalid JSON. This is the best-effort partial output."
        : "Analysis was incomplete: could not parse model JSON.";
  }

  if (llmTimedOut && raw.trim().length > 0) {
    incompleteNote =
      "Analysis was incomplete: the 60 second limit was reached. Showing the best-effort parse of streamed output.";
    try {
      result = normalizeQuickJson(extractJsonObject(raw) as Record<string, unknown>);
    } catch {
      /* keep fallback result */
    }
  }

  result.incompleteNote = incompleteNote;
  input.emit({ type: "section-complete", sectionId: "quick", data: result });
  input.emit({ type: "complete", result });
  return result;
}

export async function runDeepCallAnalysisPipeline(input: {
  transcriptText: string;
  prospectContext: string;
  playbooks: PlaybookDocument[];
  emit: StreamCallback;
  retrySection?: CallAnalysisSectionId;
  partialResult?: CallAnalysisResult;
}): Promise<CallAnalysisResult> {
  const prepared = await prepareTranscriptForLlm(
    input.transcriptText,
    summarizeMiddleForPrompt,
  );

  let timedOutAny = false;
  let transcriptSummary: TranscriptAnalysisSummary;
  if (input.partialResult?.transcriptSummary) {
    transcriptSummary = input.partialResult.transcriptSummary;
  } else {
    const sum = await summarizeTranscript({
      transcriptPromptText: prepared.promptText,
      prospectContext: input.prospectContext,
      emit: input.emit,
      onDelta: (delta) =>
        input.emit({ type: "section-delta", sectionId: "summary", text: delta }),
    });
    transcriptSummary = sum.summary;
    if (sum.timedOut) timedOutAny = true;
  }
  const sectionData: Partial<Record<CallAnalysisSectionId, unknown>> = {
    overallScore: input.partialResult?.overallScore,
    keyStrengths: input.partialResult?.keyStrengths,
    areasToImprove: input.partialResult?.areasToImprove,
    missedOpportunities: input.partialResult?.missedOpportunities,
    topActionItems: input.partialResult?.topActionItems,
  };

  const sectionsToRun = input.retrySection
    ? [input.retrySection]
    : CALL_ANALYSIS_SECTION_ORDER.filter((sectionId) => !sectionData[sectionId]);

  for (const sectionId of sectionsToRun) {
    try {
      const { data, timedOut } = await generateSection({
        sectionId,
        transcriptText: prepared.fullNormalized,
        transcriptSummary,
        prospectContext: input.prospectContext,
        playbooks: input.playbooks,
        emit: input.emit,
      });
      sectionData[sectionId] = data;
      if (timedOut) timedOutAny = true;
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Section generation failed.";
      input.emit({
        type: "section-error",
        sectionId,
        message,
      });
    }
  }

  const result = buildResult(transcriptSummary, sectionData);
  result.analysisTier = "deep";
  if (timedOutAny || !analysisIsDeepComplete(result)) {
    result.incompleteNote =
      "Analysis may be incomplete: at least one LLM step hit the time limit or returned partial data.";
  }
  input.emit({ type: "complete", result });
  return result;
}

export async function runCallAnalysisPipeline(input: {
  transcriptText: string;
  prospectContext: string;
  playbooks: PlaybookDocument[];
  emit: StreamCallback;
  mode?: CallAnalysisTier;
  retrySection?: CallAnalysisSectionId;
  partialResult?: CallAnalysisResult;
}): Promise<CallAnalysisResult> {
  const mode = input.mode ?? "quick";
  if (mode === "deep") {
    return runDeepCallAnalysisPipeline({
      transcriptText: input.transcriptText,
      prospectContext: input.prospectContext,
      playbooks: input.playbooks,
      emit: input.emit,
      retrySection: input.retrySection,
      partialResult: input.partialResult,
    });
  }
  return runQuickCallAnalysisPipeline({
    transcriptText: input.transcriptText,
    prospectContext: input.prospectContext,
    playbooks: input.playbooks,
    emit: input.emit,
  });
}
