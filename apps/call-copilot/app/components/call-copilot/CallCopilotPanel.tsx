import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  IconBook,
  IconDeviceFloppy,
  IconMicrophone,
  IconMicrophoneOff,
  IconTrash,
  IconArrowsExchange,
} from "@tabler/icons-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  CallCopilotFloatingNav,
  type CallCopilotMainSection,
} from "@/components/call-copilot/CallCopilotFloatingNav";
import { CallAnalysisPanel, type CallAnalysisPrefill } from "@/components/call-copilot/CallAnalysisPanel";
import { SettingsCallCopilotPanel } from "@/components/call-copilot/SettingsCallCopilotPanel";
import { TranscriptLog } from "@/components/call-copilot/TranscriptLog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useCallTranscription, type TranscriptionCaptureMode } from "@/hooks/use-call-transcription";
import {
  useSessionStateWriter,
  useWatchKeywords,
} from "@/hooks/use-call-copilot-state";
import { useSavedTranscripts } from "@/hooks/use-saved-transcripts";
import { useTranscriptCorrections } from "@/hooks/use-transcript-corrections";
import { useSpeakerRecognition } from "@/hooks/use-speaker-recognition";
import {
  createSpeakerLabelingScheduler,
  labelTranscriptSegments,
} from "@/lib/analysis/SpeakerLabeler";
import {
  colorForSpeakerLabel,
  speakerFromLabel,
  speakerFromManualLabel,
  toggleManualSpeakerLabel,
  type ManualSpeakerLabel,
} from "@/lib/speaker-display";
import {
  appendTranscriptChunk,
  applySpeakerLabelAssignments,
  segmentsToPlainText,
  type SpeakerLabelAssignment,
  updateTranscriptSegment,
  updateTranscriptSpeakerLabel,
} from "@/lib/transcript-segments";
import {
  keywordPhrases,
  type CallSessionState,
} from "@shared/call-copilot";
import {
  applyTranscriptCorrections,
  defaultSessionName,
  extractWordReplacements,
  findMatchedKeywordsInSegments,
  type TranscriptSegment,
} from "@shared/transcript";
import { toast } from "sonner";

function readDefaultCaptureMode(): TranscriptionCaptureMode {
  if (typeof window === "undefined") return "mic-only";
  try {
    const v = window.localStorage.getItem("call-copilot-default-capture");
    return v === "mic-and-system" ? "mic-and-system" : "mic-only";
  } catch {
    return "mic-only";
  }
}

export function CallCopilotPanel() {
  const [listening, setListening] = useState(false);
  const [segments, setSegments] = useState<TranscriptSegment[]>([]);
  const [interim, setInterim] = useState("");
  const [interimSpeaker, setInterimSpeaker] = useState("");
  const [interimSpokenAt, setInterimSpokenAt] = useState<string>(
    new Date().toISOString(),
  );
  const [manualSpeakerLabel, setManualSpeakerLabel] =
    useState<ManualSpeakerLabel>("You");
  const [manualLabelingActive, setManualLabelingActive] = useState(false);
  const [recentlyLabeledIds, setRecentlyLabeledIds] = useState<string[]>([]);
  const [section, setSection] = useState<CallCopilotMainSection>("transcript");
  const [callEndDialogOpen, setCallEndDialogOpen] = useState(false);
  const [analysisPrefill, setAnalysisPrefill] = useState<CallAnalysisPrefill | null>(
    null,
  );
  const [defaultCaptureMode, setDefaultCaptureMode] =
    useState<TranscriptionCaptureMode>(readDefaultCaptureMode);
  const [captureMode, setCaptureMode] =
    useState<TranscriptionCaptureMode>(readDefaultCaptureMode);

  const manualSpeaker = useMemo(
    () => speakerFromManualLabel(manualSpeakerLabel),
    [manualSpeakerLabel],
  );
  const manualSpeakerRef = useRef(manualSpeaker);
  const manualLabelingActiveRef = useRef(manualLabelingActive);
  const interimSpokenAtRef = useRef(interimSpokenAt);
  const segmentsRef = useRef(segments);

  manualSpeakerRef.current = manualSpeaker;
  manualLabelingActiveRef.current = manualLabelingActive;
  interimSpokenAtRef.current = interimSpokenAt;
  segmentsRef.current = segments;

  const { keywords, isSuccess } = useWatchKeywords();
  const { rules, learnCorrection } = useTranscriptCorrections();
  const rulesRef = useRef(rules);
  rulesRef.current = rules;
  const { saveTranscript, isSaving } = useSavedTranscripts();
  const { settings: speakerSettings, renameProfile } = useSpeakerRecognition();
  const writeSessionState = useSessionStateWriter();

  const applyAssignments = useCallback((assignments: SpeakerLabelAssignment[]) => {
    if (assignments.length === 0) return;
    setSegments((current) =>
      applySpeakerLabelAssignments(
        current,
        assignments,
        colorForSpeakerLabel,
      ),
    );
    setRecentlyLabeledIds(assignments.map((entry) => entry.id));
    window.setTimeout(() => {
      setRecentlyLabeledIds((current) =>
        current.filter((id) => !assignments.some((entry) => entry.id === id)),
      );
    }, 1_200);
  }, []);

  const handleFinalChunk = useCallback(
    (
      chunk: string,
      diarizedSpeaker?: string,
      options?: { labelConfidence?: number | null },
    ) => {
      const corrected = applyTranscriptCorrections(chunk, rulesRef.current);
      const spokenAt = interimSpokenAtRef.current || new Date().toISOString();
      const effectiveSpeaker =
        diarizedSpeaker
          ? {
              ...speakerFromLabel(diarizedSpeaker),
              labelConfidence: options?.labelConfidence ?? null,
            }
          : manualLabelingActiveRef.current
            ? manualSpeakerRef.current
            : null;
      setSegments((current) =>
        appendTranscriptChunk(current, corrected, spokenAt, effectiveSpeaker),
      );
      setInterim("");
      setInterimSpeaker("");
      setInterimSpokenAt(spokenAt);
    },
    [],
  );

  const handleLiveUpdate = useCallback(
    (_finalText: string, interimText: string, interimSpeakerLabel?: string) => {
      const corrected = applyTranscriptCorrections(interimText, rulesRef.current);
      const trimmed = corrected.trim();
      setInterim(trimmed);
      setInterimSpeaker(interimSpeakerLabel?.trim() ?? "");
      if (trimmed) {
        const spokenAt = new Date().toISOString();
        setInterimSpokenAt(spokenAt);
        interimSpokenAtRef.current = spokenAt;
      }
    },
    [],
  );

  const handleTranscriptionError = useCallback((message?: string) => {
    setListening(false);
    if (message) {
      toast.error(message);
    }
  }, []);

  const transcriptionRef = useRef<ReturnType<typeof useCallTranscription> | null>(
    null,
  );

  const transcription = useCallTranscription({
    enabled: listening,
    audioEnabled: listening,
    captureMode,
    onFinalChunk: handleFinalChunk,
    onLiveUpdate: handleLiveUpdate,
    onError: handleTranscriptionError,
  });

  transcriptionRef.current = transcription;

  useEffect(() => {
    if (!listening || !speakerSettings.autoLabelSpeakers) {
      return;
    }

    const scheduler = createSpeakerLabelingScheduler({
      enabled: true,
      intervalMs: speakerSettings.labelingFrequencySeconds * 1_000,
      callContextHint: speakerSettings.callContextHint,
      getSegments: () => segmentsRef.current,
      onAssignments: applyAssignments,
    });

    return () => {
      scheduler.stop();
    };
  }, [
    applyAssignments,
    listening,
    speakerSettings.autoLabelSpeakers,
    speakerSettings.callContextHint,
    speakerSettings.labelingFrequencySeconds,
  ]);

  const watchPhrases = useMemo(
    () => (isSuccess ? keywordPhrases(keywords) : []),
    [isSuccess, keywords],
  );

  const matchedKeywords = useMemo(
    () => findMatchedKeywordsInSegments(segments, watchPhrases),
    [segments, watchPhrases],
  );

  const highlightedEntries = useMemo(
    () =>
      keywords.filter((entry) =>
        matchedKeywords.some(
          (phrase) => phrase.toLowerCase() === entry.phrase.toLowerCase(),
        ),
      ),
    [keywords, matchedKeywords],
  );

  const transcript = useMemo(() => segmentsToPlainText(segments), [segments]);
  const matchedKeywordsKey = matchedKeywords.join("\u0000");

  useEffect(() => {
    const payload: CallSessionState = {
      listening,
      transcript,
      interim,
      segments,
      matchedKeywords,
      updatedAt: new Date().toISOString(),
    };
    void writeSessionState(payload);
  }, [
    interim,
    listening,
    matchedKeywordsKey,
    segments,
    transcript,
    writeSessionState,
  ]);

  async function handleSaveTranscript(): Promise<string | null> {
    if (segments.length === 0) {
      toast.error("There is no transcript to save yet.");
      return null;
    }

    let nextSegments = segments;
    if (speakerSettings.runFinalPassOnSave) {
      try {
        const assignments = await labelTranscriptSegments({
          segments,
          mode: "final",
          callContextHint: speakerSettings.callContextHint,
        });
        if (assignments.length > 0) {
          nextSegments = applySpeakerLabelAssignments(
            segments,
            assignments,
            colorForSpeakerLabel,
          );
          setSegments(nextSegments);
        }
      } catch {
        /* save with the best available labels */
      }
    }

    await saveTranscript({
      sessionName: defaultSessionName(),
      segments: nextSegments,
    });
    toast.success("Transcript saved.");
    return segmentsToPlainText(nextSegments);
  }

  function handleClearTranscript() {
    setSegments([]);
    setInterim("");
    setInterimSpeaker("");
    setManualLabelingActive(false);
  }

  async function handleSaveSegment(
    segmentId: string,
    nextText: string,
    originalText: string,
  ) {
    setSegments((current) =>
      updateTranscriptSegment(current, segmentId, nextText),
    );
    const replacements = extractWordReplacements(originalText, nextText);
    for (const replacement of replacements) {
      try {
        await learnCorrection(replacement);
      } catch {
        /* ignore duplicate or invalid pairs */
      }
    }
  }

  async function handleRenameSpeaker(speakerId: string, label: string) {
    const trimmed = label.trim();
    if (!trimmed) return;

    setSegments((current) =>
      updateTranscriptSpeakerLabel(current, speakerId, trimmed),
    );

    try {
      await renameProfile({ id: speakerId, label: trimmed });
    } catch {
      /* speaker rename is local-first */
    }
  }

  function handleSwapSpeaker() {
    const next = toggleManualSpeakerLabel(manualSpeakerLabel);
    const speaker = speakerFromManualLabel(next);
    manualSpeakerRef.current = speaker;
    setManualSpeakerLabel(next);
    setManualLabelingActive(true);
    manualLabelingActiveRef.current = true;

    if (listening) {
      transcriptionRef.current?.breakRecognitionForSpeakerTurn();
    } else if (interim.trim()) {
      const corrected = applyTranscriptCorrections(interim, rulesRef.current);
      const spokenAt = interimSpokenAtRef.current || new Date().toISOString();
      setSegments((current) =>
        appendTranscriptChunk(current, corrected, spokenAt, speaker),
      );
      setInterim("");
    }

    const nextSpokenAt = new Date().toISOString();
    setInterimSpokenAt(nextSpokenAt);
    interimSpokenAtRef.current = nextSpokenAt;
  }

  function handleListenToggle() {
    if (!listening) {
      setListening(true);
      return;
    }
    setListening(false);
    const hasContent = segments.length > 0 || interim.trim();
    if (hasContent) {
      setCallEndDialogOpen(true);
    }
  }

  const clearAnalysisPrefill = useCallback(() => {
    setAnalysisPrefill(null);
  }, []);

  async function handleCallEndAnalyzeNow() {
    setCallEndDialogOpen(false);
    const text = await handleSaveTranscript();
    if (!text?.trim()) return;
    setSection("analysis");
    setAnalysisPrefill({ transcriptText: text, focusProspect: true });
  }

  return (
    <div className="relative flex h-full min-h-0 flex-col">
      <CallCopilotFloatingNav section={section} onSectionChange={setSection} />
      <AlertDialog open={callEndDialogOpen} onOpenChange={setCallEndDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Analyze this call?</AlertDialogTitle>
            <AlertDialogDescription>
              Call ended. Would you like to analyze this call?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Skip</AlertDialogCancel>
            <AlertDialogAction onClick={() => void handleCallEndAnalyzeNow()}>
              Analyze Now
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex h-full min-h-0 flex-1 flex-col pb-20 md:pb-0 md:pl-[4.25rem]">
        {section === "transcript" ? (
          <div className="flex h-full min-h-0 flex-col gap-3 p-3 md:p-4">
          <div className="flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Live transcript
              </p>
              <p className="truncate text-sm text-muted-foreground">
                {listening
                  ? "Listening with timestamps, AI speaker labels, and learned corrections."
                  : "Start listening when the call begins."}
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap items-center justify-end gap-2">
              <ToggleGroup
                type="single"
                size="sm"
                variant="outline"
                value={captureMode}
                disabled={listening}
                onValueChange={(value) => {
                  if (value === "mic-only" || value === "mic-and-system") {
                    setCaptureMode(value);
                  }
                }}
                aria-label="Capture mode"
              >
                <ToggleGroupItem value="mic-only" className="px-3 text-xs">
                  Mic Only
                </ToggleGroupItem>
                <ToggleGroupItem value="mic-and-system" className="px-3 text-xs">
                  Mic + System Audio
                </ToggleGroupItem>
              </ToggleGroup>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={segments.length === 0 && !interim.trim()}
                onClick={handleClearTranscript}
              >
                <IconTrash className="h-4 w-4" />
                Clear
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                disabled={isSaving || segments.length === 0}
                onClick={() => void handleSaveTranscript()}
              >
                {isSaving ? (
                  <Spinner className="size-4" />
                ) : (
                  <IconDeviceFloppy className="h-4 w-4" />
                )}
                Save Transcript
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={handleSwapSpeaker}
              >
                <IconArrowsExchange className="h-4 w-4" />
                Swap Speaker
              </Button>
              <Button
                type="button"
                size="sm"
                variant={listening ? "secondary" : "default"}
                disabled={!transcription.supported}
                onClick={handleListenToggle}
              >
                {listening ? (
                  <IconMicrophoneOff className="h-4 w-4" />
                ) : (
                  <IconMicrophone className="h-4 w-4" />
                )}
                {listening ? "Pause" : "Listen"}
              </Button>
            </div>
          </div>

          {manualLabelingActive ? (
            <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border/70 bg-card/40 px-3 py-2">
              <span className="inline-flex items-center gap-2 text-xs text-muted-foreground">
                <span
                  className="h-2 w-2 rounded-full"
                  style={{ backgroundColor: manualSpeaker.speakerColor }}
                />
                Manual speaker: {manualSpeakerLabel}
              </span>
            </div>
          ) : null}

          <div className="flex items-center gap-2 rounded-lg border border-border/70 bg-card/40 px-3 py-2">
            <span
              className={`h-2 w-2 rounded-full ${
                listening
                  ? transcription.amplitude > 0.08
                    ? "bg-emerald-500"
                    : "bg-emerald-500/50"
                  : "bg-muted-foreground/40"
              }`}
            />
            <p className="text-xs text-muted-foreground">
              {transcription.error
                ? transcription.error
                : listening
                  ? captureMode === "mic-and-system"
                    ? "Mic + system audio live"
                    : "Mic live"
                  : captureMode === "mic-and-system"
                    ? "Mic + system audio idle"
                    : "Mic idle"}
            </p>
          </div>

          <ScrollArea className="min-h-[220px] flex-1 rounded-xl border border-border/70 bg-card/30 p-4">
            <TranscriptLog
              segments={segments}
              interimText={interim}
              interimSpeaker={interimSpeaker}
              interimSpokenAt={interimSpokenAt}
              connectionNotice={transcription.connectionNotice}
              highlightedEntries={highlightedEntries}
              recentlyLabeledIds={recentlyLabeledIds}
              onSaveSegment={handleSaveSegment}
              onRenameSpeaker={handleRenameSpeaker}
            />
          </ScrollArea>

          <div className="rounded-xl border border-border/70 bg-card/30 p-3">
            <div className="flex items-center gap-2">
              <IconBook className="h-4 w-4 text-muted-foreground" />
              <p className="text-xs text-muted-foreground">
                Keyword highlights and correction rules are in{" "}
                <span className="font-medium text-foreground">Settings</span>.
              </p>
            </div>
          </div>
        </div>
        ) : null}

        {section === "analysis" ? (
          <div className="h-full min-h-0 flex-1">
            <CallAnalysisPanel
              prefill={analysisPrefill}
              onPrefillConsumed={clearAnalysisPrefill}
            />
          </div>
        ) : null}

        {section === "settings" ? (
          <div className="h-full min-h-0 flex-1 overflow-hidden">
            <SettingsCallCopilotPanel
              defaultCaptureMode={defaultCaptureMode}
              onDefaultCaptureModeChange={(mode) => {
                setDefaultCaptureMode(mode);
                try {
                  window.localStorage.setItem("call-copilot-default-capture", mode);
                } catch {
                  /* ignore */
                }
                if (!listening) {
                  setCaptureMode(mode);
                }
              }}
            />
          </div>
        ) : null}
      </div>
    </div>
  );
}
