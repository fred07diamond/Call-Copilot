export const PLAYBOOK_DOCUMENT_TYPES = [
  "cold_call_script",
  "objection_handling",
  "discovery_framework",
  "closing_framework",
  "general_playbook",
] as const;

export type PlaybookDocumentType = (typeof PLAYBOOK_DOCUMENT_TYPES)[number];

export const PLAYBOOK_DOCUMENT_TYPE_LABELS: Record<PlaybookDocumentType, string> =
  {
    cold_call_script: "Cold call script",
    objection_handling: "Objection handling",
    discovery_framework: "Discovery framework",
    closing_framework: "Closing framework",
    general_playbook: "General playbook",
  };

export interface PlaybookDocument {
  id: string;
  filename: string;
  contentText: string;
  documentType: PlaybookDocumentType;
  uploadedAt: string;
}

export interface PlaybookDocumentsResponse {
  documents: PlaybookDocument[];
}

export type CallAnalysisStatus = "pending" | "complete" | "error";

export type CallAnalysisTier = "quick" | "deep";

export const CALL_ANALYSIS_SECTION_ORDER = [
  "overallScore",
  "keyStrengths",
  "areasToImprove",
  "missedOpportunities",
  "topActionItems",
] as const;

export type CallAnalysisSectionId = (typeof CALL_ANALYSIS_SECTION_ORDER)[number];

export const CALL_ANALYSIS_PROGRESS_STEPS = [
  { id: "summary", label: "Summarizing transcript" },
  { id: "overallScore", label: "Scoring overall performance" },
  { id: "keyStrengths", label: "Identifying key strengths" },
  { id: "areasToImprove", label: "Finding areas to improve" },
  { id: "missedOpportunities", label: "Spotting missed opportunities" },
  { id: "topActionItems", label: "Drafting top action items" },
] as const;

export const CALL_ANALYSIS_QUICK_PROGRESS_STEPS = [
  { id: "quick", label: "Generating quick analysis" },
] as const;

export const CALL_ANALYSIS_TOTAL_STEPS = CALL_ANALYSIS_PROGRESS_STEPS.length;

export const CALL_ANALYSIS_QUICK_TOTAL_STEPS = CALL_ANALYSIS_QUICK_PROGRESS_STEPS.length;

export interface TranscriptAnalysisSummary {
  keyMoments: string[];
  questionsAsked: string[];
  objectionsRaised: string[];
  valuePropsMentioned: string[];
  talkRatio: {
    repPercent: number;
    prospectPercent: number;
    assessment: string;
  };
}

export interface CallAnalysisStrengthItem {
  title: string;
  detail: string;
  quote?: string;
}

export interface CallAnalysisImprovementItem {
  title: string;
  detail: string;
  quote?: string;
}

export interface CallAnalysisMissedOpportunity {
  opportunity: string;
  playbookReference: string;
}

export interface CallAnalysisActionItem {
  priority: number;
  action: string;
  playbookSection: string;
}

export interface CallAnalysisResult {
  /** quick = single-pass score + strengths + improvements + actions; deep = full playbook-aligned breakdown. */
  analysisTier?: CallAnalysisTier;
  /** Set when the LLM hit the time limit or returned partial JSON. */
  incompleteNote?: string | null;
  transcriptSummary?: TranscriptAnalysisSummary;
  overallScore: {
    score: number;
    summary: string;
  };
  keyStrengths: {
    summary: string;
    items: CallAnalysisStrengthItem[];
  };
  areasToImprove: {
    summary: string;
    items: CallAnalysisImprovementItem[];
  };
  missedOpportunities: {
    summary: string;
    items: CallAnalysisMissedOpportunity[];
  };
  topActionItems: {
    items: CallAnalysisActionItem[];
  };
}

export type CallAnalysisSectionState =
  | { status: "pending" }
  | { status: "loading"; streamedText?: string }
  | { status: "complete"; data: unknown }
  | { status: "error"; message: string };

export type CallAnalysisRunProgress = {
  step: number;
  total: number;
  label: string;
  sectionId?: CallAnalysisSectionId | "summary" | "quick";
};

export type CallAnalysisStreamEvent =
  | { type: "progress"; progress: CallAnalysisRunProgress }
  | {
      type: "section-start";
      sectionId: CallAnalysisSectionId | "summary" | "quick";
    }
  | {
      type: "section-delta";
      sectionId: CallAnalysisSectionId | "summary" | "quick";
      text: string;
    }
  | {
      type: "section-complete";
      sectionId: CallAnalysisSectionId | "summary" | "quick";
      data: unknown;
    }
  | {
      type: "section-error";
      sectionId: CallAnalysisSectionId | "summary" | "quick";
      message: string;
    }
  | { type: "complete"; result: CallAnalysisResult }
  | { type: "error"; message: string };

export interface SavedCallAnalysis {
  id: string;
  transcriptId: string | null;
  transcriptText: string;
  prospectContext: string;
  playbookDocumentIds: string[];
  analysisResult: CallAnalysisResult | null;
  overallScore: number | null;
  status: CallAnalysisStatus;
  errorMessage: string | null;
  createdAt: string;
}

/** Lightweight payload for GET /api/call-copilot/analysis-status (no transcript). */
export interface CallAnalysisStatusPayload {
  id: string;
  status: CallAnalysisStatus;
  analysisResult: CallAnalysisResult | null;
  errorMessage: string | null;
  overallScore: number | null;
}

export interface CallAnalysesResponse {
  analyses: SavedCallAnalysis[];
}

export interface CreateCallAnalysisInput {
  transcriptId?: string | null;
  transcriptText: string;
  prospectContext?: string;
  playbookDocumentIds: string[];
}

export interface RunCallAnalysisInput {
  /** Default quick: one fast structured pass. deep = original multi-section pipeline. */
  mode?: CallAnalysisTier;
  retrySection?: CallAnalysisSectionId;
  partialResult?: CallAnalysisResult;
  transcriptSummary?: TranscriptAnalysisSummary;
}

export function isPlaybookDocumentType(
  value: string,
): value is PlaybookDocumentType {
  return (PLAYBOOK_DOCUMENT_TYPES as readonly string[]).includes(value);
}

export function scoreIndicatorClass(score: number | null | undefined): string {
  if (score == null || Number.isNaN(score)) {
    return "text-muted-foreground";
  }
  if (score >= 8) return "text-emerald-500";
  if (score >= 5) return "text-amber-500";
  return "text-red-500";
}

export function sectionLabel(
  sectionId: CallAnalysisSectionId | "summary" | "quick",
): string {
  if (sectionId === "quick") {
    return CALL_ANALYSIS_QUICK_PROGRESS_STEPS[0]?.label ?? "Quick analysis";
  }
  const match = CALL_ANALYSIS_PROGRESS_STEPS.find((step) => step.id === sectionId);
  return match?.label ?? sectionId;
}

export function isCallAnalysisSectionId(
  value: string,
): value is CallAnalysisSectionId {
  return (CALL_ANALYSIS_SECTION_ORDER as readonly string[]).includes(value);
}
