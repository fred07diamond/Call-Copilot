import { useCallback, useRef, useState } from "react";
import type {
  CallAnalysisResult,
  CallAnalysisRunProgress,
  CallAnalysisSectionId,
  CallAnalysisSectionState,
  CallAnalysisStreamEvent,
  PlaybookDocument,
  TranscriptAnalysisSummary,
} from "@shared/call-analysis";
import {
  CALL_ANALYSIS_QUICK_TOTAL_STEPS,
  CALL_ANALYSIS_SECTION_ORDER,
  CALL_ANALYSIS_TOTAL_STEPS,
} from "@shared/call-analysis";

function initialSectionState(): Record<
  CallAnalysisSectionId | "summary" | "quick",
  CallAnalysisSectionState
> {
  return {
    quick: { status: "pending" },
    summary: { status: "pending" },
    overallScore: { status: "pending" },
    keyStrengths: { status: "pending" },
    areasToImprove: { status: "pending" },
    missedOpportunities: { status: "pending" },
    topActionItems: { status: "pending" },
  };
}

function completeSectionStates(
  result: CallAnalysisResult,
): Record<CallAnalysisSectionId | "summary" | "quick", CallAnalysisSectionState> {
  return {
    quick: {
      status: "complete",
      data: result.analysisTier === "quick" ? result : null,
    },
    summary: {
      status: "complete",
      data: result.transcriptSummary,
    },
    overallScore: {
      status: "complete",
      data: result.overallScore,
    },
    keyStrengths: {
      status: "complete",
      data: result.keyStrengths,
    },
    areasToImprove: {
      status: "complete",
      data: result.areasToImprove,
    },
    missedOpportunities: {
      status: "complete",
      data: result.missedOpportunities,
    },
    topActionItems: {
      status: "complete",
      data: result.topActionItems,
    },
  };
}

function applyStreamEvent(
  states: Record<CallAnalysisSectionId | "summary" | "quick", CallAnalysisSectionState>,
  event: CallAnalysisStreamEvent,
): Record<CallAnalysisSectionId | "summary" | "quick", CallAnalysisSectionState> {
  const next = { ...states };
  if (event.type === "section-start") {
    next[event.sectionId] = { status: "loading", streamedText: "" };
    return next;
  }
  if (event.type === "section-delta") {
    const current = next[event.sectionId];
    if (current?.status === "loading") {
      next[event.sectionId] = {
        status: "loading",
        streamedText: (current.streamedText ?? "") + event.text,
      };
    }
    return next;
  }
  if (event.type === "section-complete") {
    next[event.sectionId] = { status: "complete", data: event.data };
    return next;
  }
  if (event.type === "section-error") {
    next[event.sectionId] = { status: "error", message: event.message };
    return next;
  }
  return next;
}

async function requestCallAnalysisStreaming(input: {
  transcriptText: string;
  prospectContext: string;
  playbookContent: PlaybookDocument[];
  signal: AbortSignal;
  onEvent: (event: CallAnalysisStreamEvent) => void;
}): Promise<CallAnalysisResult> {
  const response = await fetch("/api/analyze-call", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "text/event-stream",
    },
    body: JSON.stringify({
      transcriptText: input.transcriptText,
      prospectContext: input.prospectContext,
      playbookContent: input.playbookContent,
      stream: true,
      mode: "quick",
    }),
    signal: input.signal,
  });

  if (!response.ok) {
    const message = await response.text().catch(() => "");
    throw new Error(message || "Could not analyze call.");
  }

  if (!response.body) {
    throw new Error("Streaming analysis response had no body.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let carry = "";
  let finalResult: CallAnalysisResult | null = null;

  const dispatchSsePart = (part: string) => {
    const line = part.trim();
    if (!line.startsWith("data:")) return;
    const payload = line.slice(5).trim();
    if (!payload) return;
    let parsed: CallAnalysisStreamEvent;
    try {
      parsed = JSON.parse(payload) as CallAnalysisStreamEvent;
    } catch {
      return;
    }
    input.onEvent(parsed);
    if (parsed.type === "complete") {
      finalResult = parsed.result;
    }
    if (parsed.type === "error") {
      throw new Error(parsed.message);
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (value?.byteLength) {
      carry += decoder.decode(value, { stream: true });
    }
    const parts = carry.split("\n\n");
    carry = parts.pop() ?? "";
    for (const part of parts) {
      dispatchSsePart(part);
    }
    if (done) {
      carry += decoder.decode();
      const tailParts = carry.split("\n\n");
      carry = tailParts.pop() ?? "";
      for (const part of tailParts) {
        dispatchSsePart(part);
      }
      if (carry.trim()) {
        dispatchSsePart(carry);
      }
      break;
    }
  }

  if (!finalResult) {
    throw new Error("Call analysis stream ended without a result.");
  }
  return finalResult;
}

export function useCallAnalysisRun() {
  const abortRef = useRef<AbortController | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState<CallAnalysisRunProgress | null>(null);
  const [sectionStates, setSectionStates] = useState(initialSectionState);
  const [liveResult, setLiveResult] = useState<CallAnalysisResult | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const resetRun = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
    setIsRunning(false);
    setProgress(null);
    setSectionStates(initialSectionState());
    setLiveResult(null);
    setRunError(null);
  }, []);

  const runAnalysis = useCallback(
    async (input: {
      transcriptText: string;
      prospectContext: string;
      playbookContent: PlaybookDocument[];
    }) => {
      abortRef.current?.abort();
      const controller = new AbortController();
      abortRef.current = controller;
      setIsRunning(true);
      setRunError(null);
      setSectionStates(initialSectionState());
      setLiveResult(null);
      setProgress({
        step: 1,
        total: CALL_ANALYSIS_QUICK_TOTAL_STEPS,
        label: "Analyzing call",
        sectionId: "quick",
      });

      try {
        const result = await requestCallAnalysisStreaming({
          ...input,
          signal: controller.signal,
          onEvent: (event) => {
            if (event.type === "progress") {
              setProgress(event.progress);
            }
            if (
              event.type === "section-start" ||
              event.type === "section-delta" ||
              event.type === "section-complete" ||
              event.type === "section-error"
            ) {
              setSectionStates((current) => applyStreamEvent(current, event));
            }
            if (event.type === "complete") {
              setLiveResult(event.result);
              setSectionStates(completeSectionStates(event.result));
            }
          },
        });
        setLiveResult(result);
        setSectionStates(completeSectionStates(result));
        return result;
      } catch (error) {
        if (controller.signal.aborted) {
          return null;
        }
        const message =
          error instanceof Error ? error.message : "Call analysis failed.";
        setRunError(message);
        throw error;
      } finally {
        setIsRunning(false);
        setProgress(null);
      }
    },
    [],
  );

  const retrySection = useCallback(
    async (
      input: {
        transcriptText: string;
        prospectContext: string;
        playbookContent: PlaybookDocument[];
      },
      _sectionId: CallAnalysisSectionId,
      _partialResult?: CallAnalysisResult | null,
      _transcriptSummary?: TranscriptAnalysisSummary,
    ) => runAnalysis(input),
    [runAnalysis],
  );

  return {
    isRunning,
    progress,
    sectionStates,
    liveResult,
    runError,
    totalSteps: CALL_ANALYSIS_TOTAL_STEPS,
    quickTotalSteps: CALL_ANALYSIS_QUICK_TOTAL_STEPS,
    sectionOrder: CALL_ANALYSIS_SECTION_ORDER,
    runAnalysis,
    retrySection,
    resetRun,
  };
}
