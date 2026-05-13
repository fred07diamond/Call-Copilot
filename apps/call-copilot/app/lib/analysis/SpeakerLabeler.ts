import type { TranscriptSegment } from "@shared/transcript";
import {
  applySpeakerLabelAssignments,
  collectLabeledContextSegments,
  collectUnlabeledSegments,
  type SpeakerLabelAssignment,
} from "@/lib/transcript-segments";

const LABEL_SPEAKERS_URL = "/api/label-speakers";

export interface SpeakerLabelingRequest {
  mode: "incremental" | "final";
  callContextHint?: string;
  contextSegments: Array<{ id: string; text: string; speaker: string | null }>;
  targetSegments: Array<{ id: string; text: string; speaker: string | null }>;
}

async function requestSpeakerLabels(
  input: SpeakerLabelingRequest,
): Promise<SpeakerLabelAssignment[]> {
  const res = await fetch(LABEL_SPEAKERS_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    return [];
  }
  const data = (await res.json()) as { labels?: SpeakerLabelAssignment[] };
  return data.labels ?? [];
}

export async function labelTranscriptSegments(input: {
  segments: TranscriptSegment[];
  mode: "incremental" | "final";
  callContextHint?: string;
}): Promise<SpeakerLabelAssignment[]> {
  const contextSegments =
    input.mode === "incremental"
      ? collectLabeledContextSegments(input.segments, 5)
      : [];
  const targetSegments =
    input.mode === "incremental"
      ? collectUnlabeledSegments(input.segments)
      : input.segments.filter((segment) => segment.labelSource !== "manual");

  if (targetSegments.length === 0) {
    return [];
  }

  return requestSpeakerLabels({
    mode: input.mode,
    callContextHint: input.callContextHint,
    contextSegments: contextSegments.map((segment) => ({
      id: segment.id,
      text: segment.text,
      speaker: segment.speaker,
    })),
    targetSegments: targetSegments.map((segment) => ({
      id: segment.id,
      text: segment.text,
      speaker: segment.speaker,
    })),
  });
}

export function createSpeakerLabelingScheduler(input: {
  enabled: boolean;
  intervalMs: number;
  callContextHint: string;
  getSegments: () => TranscriptSegment[];
  onAssignments: (assignments: SpeakerLabelAssignment[]) => void;
}): { stop: () => void; runNow: () => Promise<void> } {
  let timer: number | null = null;
  let running = false;

  const runNow = async () => {
    if (!input.enabled || running) return;
    running = true;
    try {
      const assignments = await labelTranscriptSegments({
        segments: input.getSegments(),
        mode: "incremental",
        callContextHint: input.callContextHint,
      });
      if (assignments.length > 0) {
        input.onAssignments(assignments);
      }
    } catch {
      /* background labeling failures are retried silently */
    } finally {
      running = false;
    }
  };

  const stop = () => {
    if (timer !== null) {
      window.clearInterval(timer);
      timer = null;
    }
  };

  if (input.enabled) {
    void runNow();
    timer = window.setInterval(() => {
      void runNow();
    }, input.intervalMs);
  }

  return { stop, runNow };
}
