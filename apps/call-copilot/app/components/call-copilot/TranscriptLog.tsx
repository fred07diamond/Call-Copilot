import { useState } from "react";
import { IconMicrophone, IconPencil } from "@tabler/icons-react";
import { Input } from "@/components/ui/input";
import { highlightKeywords } from "@/lib/highlight-keywords";
import { colorForSpeakerLabel } from "@/lib/speaker-display";
import type { WatchKeywordEntry } from "@shared/call-copilot";
import {
  extractWordReplacements,
  formatSpokenTimestamp,
  type TranscriptSegment,
} from "@shared/transcript";
import { toast } from "sonner";

interface TranscriptLogProps {
  segments: TranscriptSegment[];
  interimText?: string;
  interimSpeaker?: string;
  interimSpokenAt?: string;
  connectionNotice?: string | null;
  highlightedEntries: WatchKeywordEntry[];
  recentlyLabeledIds?: string[];
  onSaveSegment: (
    segmentId: string,
    nextText: string,
    originalText: string,
  ) => Promise<void>;
  onRenameSpeaker?: (speakerId: string, label: string) => void;
}

function segmentStatus(segment: TranscriptSegment): "live" | "pending" | "labeled" {
  if (segment.status) return segment.status;
  return segment.speaker?.trim() || segment.speakerLabel?.trim()
    ? "labeled"
    : "pending";
}

export function TranscriptLog({
  segments,
  interimText,
  interimSpeaker,
  interimSpokenAt,
  connectionNotice,
  highlightedEntries,
  recentlyLabeledIds = [],
  onSaveSegment,
  onRenameSpeaker,
}: TranscriptLogProps) {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingSpeakerId, setEditingSpeakerId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const [speakerDraft, setSpeakerDraft] = useState("");

  if (segments.length === 0 && !interimText && !connectionNotice) {
    return (
      <p className="text-sm text-muted-foreground">
        Transcript will appear here as people speak.
      </p>
    );
  }

  const interimSpeakerLabel = interimSpeaker?.trim() ?? "";
  const interimSpeakerColor = interimSpeakerLabel
    ? colorForSpeakerLabel(interimSpeakerLabel)
    : "#38bdf8";

  async function saveEdit(segment: TranscriptSegment) {
    const nextText = draft.trim();
    if (!nextText || nextText === segment.text) {
      setEditingId(null);
      return;
    }

    await onSaveSegment(segment.id, nextText, segment.text);
    const replacements = extractWordReplacements(segment.text, nextText);
    for (const replacement of replacements) {
      toast.success(
        `Learned: ${replacement.originalText} will now be recognized as ${replacement.correctedText}.`,
      );
    }
    setEditingId(null);
  }

  return (
    <div className="space-y-3">
      {connectionNotice ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
          {connectionNotice}
        </div>
      ) : null}
      {segments.map((segment) => {
        const editing = editingId === segment.id;
        const editingSpeaker = editingSpeakerId === segment.speakerId;
        const status = segmentStatus(segment);
        const spokenAt = segment.spokenAt?.trim() || new Date().toISOString();
        const speakerLabel =
          segment.speaker?.trim() || segment.speakerLabel?.trim() || "";
        const likelyGuest =
          speakerLabel.toLowerCase() === "guest" &&
          segment.labelConfidence !== null &&
          segment.labelConfidence < 0.75;
        const color =
          segment.speakerColor?.trim() ||
          (speakerLabel ? colorForSpeakerLabel(speakerLabel) : "#94a3b8");
        const justLabeled = recentlyLabeledIds.includes(segment.id);

        return (
          <div
            key={segment.id}
            className={`group rounded-lg border px-3 py-2 transition-colors duration-500 ${
              status === "pending"
                ? "border-dashed border-border/70 bg-muted/10 text-muted-foreground"
                : "border-border/60 bg-background/40"
            } ${justLabeled ? "bg-primary/10 ring-1 ring-primary/20" : ""}`}
          >
            <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {status === "pending" ? (
                <span className="h-2.5 w-2.5 rounded-full bg-muted-foreground/50" />
              ) : (
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{ backgroundColor: color }}
                />
              )}
              <span>[{formatSpokenTimestamp(spokenAt)}]</span>
              {status === "labeled" ? (
                editingSpeaker ? (
                  <Input
                    value={speakerDraft}
                    onChange={(event) => setSpeakerDraft(event.target.value)}
                    className="h-7 max-w-[220px] text-xs normal-case"
                    onBlur={() => {
                      onRenameSpeaker?.(segment.speakerId, speakerDraft);
                      setEditingSpeakerId(null);
                    }}
                  />
                ) : (
                  <button
                    type="button"
                    className="font-medium normal-case"
                    style={{ color }}
                    onClick={() => {
                      setEditingSpeakerId(segment.speakerId);
                      setSpeakerDraft(speakerLabel);
                    }}
                  >
                    {speakerLabel}
                    {likelyGuest ? (
                      <span className="ml-1 text-[10px] font-normal normal-case text-muted-foreground">
                        likely
                      </span>
                    ) : null}
                  </button>
                )
              ) : null}
              {!editing ? (
                <button
                  type="button"
                  className="ml-auto inline-flex opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => {
                    setEditingId(segment.id);
                    setDraft(segment.text);
                  }}
                  aria-label="Edit transcript segment"
                >
                  <IconPencil className="h-3.5 w-3.5" />
                </button>
              ) : null}
            </div>

            {editing ? (
              <div className="space-y-2">
                <Input
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  className="h-8 text-sm"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    className="text-xs font-medium text-foreground"
                    onClick={() => void saveEdit(segment)}
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    className="text-xs text-muted-foreground"
                    onClick={() => setEditingId(null)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <p
                className={`text-sm leading-7 ${
                  status === "pending" ? "text-muted-foreground" : "text-foreground/90"
                }`}
              >
                {highlightKeywords(segment.text, highlightedEntries)}
              </p>
            )}
          </div>
        );
      })}

      {interimText ? (
        <div className="rounded-lg border border-dashed border-border/70 bg-muted/10 px-3 py-2">
          <div className="mb-1 flex items-center gap-2 text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
            <span
              className="h-2.5 w-2.5 rounded-full"
              style={{ backgroundColor: interimSpeakerColor }}
            />
            <span>
              [{formatSpokenTimestamp(interimSpokenAt ?? new Date().toISOString())}]
            </span>
            {interimSpeakerLabel ? (
              <span className="font-medium normal-case" style={{ color: interimSpeakerColor }}>
                {interimSpeakerLabel}
              </span>
            ) : (
              <IconMicrophone className="h-3.5 w-3.5 animate-pulse text-sky-400" />
            )}
          </div>
          <p className="text-sm leading-7 text-muted-foreground">
            {highlightKeywords(interimText, highlightedEntries)}
          </p>
        </div>
      ) : null}
    </div>
  );
}
