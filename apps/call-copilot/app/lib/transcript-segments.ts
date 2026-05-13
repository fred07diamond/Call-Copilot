import type { TranscriptSegment } from "@shared/transcript";
import type { SegmentSpeaker } from "@/lib/speaker-display";

const SEGMENT_PAUSE_MS = 2_000;

function appendSegmentText(existing: string, chunk: string): string {
  const text = chunk.trim();
  if (!text) return existing;
  if (!existing) return text;
  if (/^[.,!?;:)]/.test(text)) {
    return `${existing}${text}`;
  }
  return `${existing} ${text}`;
}

function createPendingSegment(
  text: string,
  spokenAt: string,
  now: number,
): TranscriptSegment {
  return {
    id: crypto.randomUUID(),
    text,
    spokenAt,
    speaker: null,
    labelSource: null,
    labelConfidence: null,
    status: "pending",
    speakerId: "unlabeled",
    speakerLabel: "",
    startTime: now,
    endTime: now,
  };
}

function createManualSegment(
  speaker: SegmentSpeaker,
  text: string,
  spokenAt: string,
  now: number,
): TranscriptSegment {
  return {
    id: crypto.randomUUID(),
    text,
    spokenAt,
    speaker: speaker.speakerLabel,
    labelSource: "manual",
    labelConfidence: speaker.labelConfidence ?? null,
    status: "labeled",
    speakerId: speaker.speakerId,
    speakerLabel: speaker.speakerLabel,
    speakerColor: speaker.speakerColor,
    startTime: now,
    endTime: now,
  };
}

export function appendTranscriptChunk(
  segments: TranscriptSegment[],
  chunk: string,
  spokenAt: string,
  manualSpeaker?: SegmentSpeaker | null,
): TranscriptSegment[] {
  const text = chunk.trim();
  if (!text) return segments;

  const now = Date.now();
  const last = segments[segments.length - 1];
  const lastEndedAt = last?.endTime ?? last?.startTime;
  const pauseMs =
    lastEndedAt === undefined ? Number.POSITIVE_INFINITY : now - lastEndedAt;
  const samePending =
    !manualSpeaker &&
    last?.status === "pending" &&
    !last.speaker &&
    last.labelSource !== "manual";
  const sameManual =
    !!manualSpeaker &&
    last?.status === "labeled" &&
    last.labelSource === "manual" &&
    last.speakerId === manualSpeaker.speakerId;

  if (last && (samePending || sameManual) && pauseMs < SEGMENT_PAUSE_MS) {
    return [
      ...segments.slice(0, -1),
      {
        ...last,
        text: appendSegmentText(last.text, text),
        endTime: now,
      },
    ];
  }

  if (manualSpeaker) {
    return [
      ...segments,
      createManualSegment(manualSpeaker, text, spokenAt, now),
    ];
  }

  return [...segments, createPendingSegment(text, spokenAt, now)];
}

export function updateTranscriptSegment(
  segments: TranscriptSegment[],
  segmentId: string,
  text: string,
): TranscriptSegment[] {
  return segments.map((segment) =>
    segment.id === segmentId ? { ...segment, text: text.trim() } : segment,
  );
}

export function updateTranscriptSpeakerLabel(
  segments: TranscriptSegment[],
  speakerId: string,
  label: string,
): TranscriptSegment[] {
  const trimmed = label.trim();
  if (!trimmed) return segments;

  return segments.map((segment) =>
    segment.speakerId === speakerId
      ? {
          ...segment,
          speaker: trimmed,
          speakerLabel: trimmed,
          status: "labeled",
          labelSource: segment.labelSource ?? "manual",
        }
      : segment,
  );
}

export interface SpeakerLabelAssignment {
  id: string;
  speaker: string;
  confidence?: number;
}

export function applySpeakerLabelAssignments(
  segments: TranscriptSegment[],
  assignments: SpeakerLabelAssignment[],
  colorForSpeaker: (speaker: string) => string,
): TranscriptSegment[] {
  if (assignments.length === 0) return segments;

  const byId = new Map(assignments.map((entry) => [entry.id, entry]));
  return segments.map((segment) => {
    if (segment.labelSource === "manual") {
      return segment;
    }

    const assignment = byId.get(segment.id);
    if (!assignment) {
      return segment;
    }

    const speaker = assignment.speaker.trim();
    if (!speaker) {
      return segment;
    }

    return {
      ...segment,
      speaker,
      speakerLabel: speaker,
      speakerId: speaker.toLowerCase().replace(/\s+/g, "-"),
      speakerColor: colorForSpeaker(speaker),
      labelSource: "ai",
      labelConfidence:
        typeof assignment.confidence === "number" ? assignment.confidence : null,
      status: "labeled",
    };
  });
}

export function segmentsToPlainText(segments: TranscriptSegment[]): string {
  return segments.map((segment) => segment.text).join(" ").trim();
}

export function collectLabeledContextSegments(
  segments: TranscriptSegment[],
  limit = 5,
): TranscriptSegment[] {
  return segments
    .filter(
      (segment) =>
        segment.status === "labeled" &&
        !!segment.speaker?.trim() &&
        segment.labelSource !== null,
    )
    .slice(-limit);
}

export function collectUnlabeledSegments(
  segments: TranscriptSegment[],
): TranscriptSegment[] {
  return segments.filter(
    (segment) =>
      segment.labelSource !== "manual" &&
      (segment.status === "pending" || !segment.speaker?.trim()),
  );
}
