export const SPEAKER_COLORS = [
  "#60a5fa",
  "#4ade80",
  "#fb923c",
  "#c084fc",
  "#f472b6",
  "#22d3ee",
] as const;

export interface SegmentSpeaker {
  speakerId: string;
  speakerLabel: string;
  speakerColor: string;
  labelConfidence?: number | null;
}

export type ManualSpeakerLabel = "You" | "Guest";

const MANUAL_SPEAKER_COLORS: Record<ManualSpeakerLabel, string> = {
  You: "#60a5fa",
  Guest: "#4ade80",
};

export function speakerFromManualLabel(label: ManualSpeakerLabel): SegmentSpeaker {
  return {
    speakerId: label.toLowerCase(),
    speakerLabel: label,
    speakerColor: MANUAL_SPEAKER_COLORS[label],
  };
}

export function toggleManualSpeakerLabel(
  label: ManualSpeakerLabel,
): ManualSpeakerLabel {
  return label === "You" ? "Guest" : "You";
}

export function speakerFromLabel(label: string): SegmentSpeaker {
  const trimmed = label.trim();
  const normalized = trimmed.toLowerCase();
  if (normalized === "you") {
    return speakerFromManualLabel("You");
  }
  if (normalized === "guest") {
    return speakerFromManualLabel("Guest");
  }

  const speakerMatch = trimmed.match(/^(?:speaker|person)\s+(\d+)$/i);
  const colorIndex = speakerMatch
    ? Number.parseInt(speakerMatch[1], 10) - 1
    : Math.abs(hashLabel(trimmed)) % SPEAKER_COLORS.length;

  return {
    speakerId: trimmed.toLowerCase().replace(/\s+/g, "-"),
    speakerLabel: trimmed,
    speakerColor: SPEAKER_COLORS[colorIndex % SPEAKER_COLORS.length],
  };
}

export function colorForSpeakerLabel(label: string): string {
  return speakerFromLabel(label).speakerColor;
}

function hashLabel(value: string): number {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) | 0;
  }
  return hash;
}
