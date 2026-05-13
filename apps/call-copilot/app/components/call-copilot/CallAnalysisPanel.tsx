import { useEffect, useMemo, useRef, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { IconChartBar, IconTrash, IconUpload } from "@tabler/icons-react";
import { sendToAgentChat } from "@agent-native/core/client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { Textarea } from "@/components/ui/textarea";
import { useCallAnalyses, useCallAnalysisStatus } from "@/hooks/use-call-analysis";
import { useCallAnalysisRun } from "@/hooks/use-call-analysis-run";
import { useSavedTranscripts } from "@/hooks/use-saved-transcripts";
import { parseTranscriptUploadText } from "@/lib/transcript-import";
import {
  CallAnalysisProgress,
  CallAnalysisResults,
} from "@/components/call-copilot/CallAnalysisResults";
import {
  scoreIndicatorClass,
  type CallAnalysisSectionId,
  type SavedCallAnalysis,
} from "@shared/call-analysis";
import { transcriptPlainText } from "@shared/transcript";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

function formatTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export interface CallAnalysisPrefill {
  transcriptText: string;
  focusProspect?: boolean;
}

export interface CallAnalysisPanelProps {
  prefill?: CallAnalysisPrefill | null;
  onPrefillConsumed?: () => void;
}

export function CallAnalysisPanel({
  prefill = null,
  onPrefillConsumed,
}: CallAnalysisPanelProps = {}) {
  const queryClient = useQueryClient();
  const transcriptFileInputRef = useRef<HTMLInputElement>(null);
  const prospectContextRef = useRef<HTMLInputElement>(null);
  const onPrefillConsumedRef = useRef(onPrefillConsumed);
  onPrefillConsumedRef.current = onPrefillConsumed;

  const [selectedTranscriptId, setSelectedTranscriptId] = useState<string>("none");
  const [transcriptText, setTranscriptText] = useState("");
  const [prospectContext, setProspectContext] = useState("");
  const [activeAnalysis, setActiveAnalysis] = useState<SavedCallAnalysis | null>(
    null,
  );
  const [viewingAnalysisId, setViewingAnalysisId] = useState<string | null>(null);

  const { transcripts, isLoading: isLoadingTranscripts } = useSavedTranscripts();
  const {
    analyses,
    isLoading: isLoadingAnalyses,
    createAnalysis,
    isCreating,
    saveAnalysis,
    isSaving,
    deleteAnalysis,
    fetchAnalysis,
    refetchAnalyses,
  } = useCallAnalyses();
  const {
    isRunning,
    progress,
    sectionStates,
    liveResult,
    runError,
    retrySection,
    resetRun,
  } = useCallAnalysisRun();

  const selectedTranscript = useMemo(
    () => transcripts.find((transcript) => transcript.id === selectedTranscriptId),
    [selectedTranscriptId, transcripts],
  );

  useEffect(() => {
    if (!selectedTranscript) return;
    setTranscriptText(transcriptPlainText(selectedTranscript.segments));
  }, [selectedTranscript]);

  useEffect(() => {
    if (!prefill) return;
    setSelectedTranscriptId("none");
    setTranscriptText(prefill.transcriptText);
    if (prefill.focusProspect) {
      window.requestAnimationFrame(() => {
        prospectContextRef.current?.focus();
      });
    }
    onPrefillConsumedRef.current?.();
  }, [prefill]);

  const displayedAnalysis = useMemo(() => {
    if (viewingAnalysisId) {
      return analyses.find((analysis) => analysis.id === viewingAnalysisId) ?? activeAnalysis;
    }
    return activeAnalysis;
  }, [activeAnalysis, analyses, viewingAnalysisId]);

  const pendingAnalysisId =
    displayedAnalysis?.status === "pending" ? displayedAnalysis.id : null;
  const analysisStatusQuery = useCallAnalysisStatus(pendingAnalysisId);
  const handledStatusRef = useRef<string | null>(null);

  useEffect(() => {
    handledStatusRef.current = null;
  }, [pendingAnalysisId]);

  useEffect(() => {
    const row = analysisStatusQuery.data?.status;
    if (!pendingAnalysisId || !row || row.id !== pendingAnalysisId) return;
    if (row.status === "pending") return;
    const token = `${row.id}:${row.status}`;
    if (handledStatusRef.current === token) return;
    handledStatusRef.current = token;
    void refetchAnalyses();
    void queryClient.invalidateQueries({ queryKey: ["call-copilot", "analysis-status"] });
    if (row.status === "complete") {
      void fetchAnalysis(row.id).then((full) => {
        setActiveAnalysis(full);
      });
    }
  }, [
    analysisStatusQuery.data,
    fetchAnalysis,
    pendingAnalysisId,
    queryClient,
    refetchAnalyses,
  ]);

  async function handleTranscriptFileUpload(file: File) {
    try {
      const content = await file.text();
      const parsed = parseTranscriptUploadText(file.name, content);
      if (!parsed) {
        toast.error("That transcript file was empty.");
        return;
      }
      setSelectedTranscriptId("none");
      setTranscriptText(parsed);
      toast.success("Transcript file loaded.");
    } catch {
      toast.error("Could not read transcript file.");
    }
  }

  function handleAnalyzeCall() {
    const trimmedTranscript = transcriptText.trim();
    if (!trimmedTranscript) {
      toast.error("Add a transcript before analyzing.");
      return;
    }

    const ctx = prospectContext.trim();
    sendToAgentChat({
      message: `Analyze this call transcript against the sales playbook. Prospect context: ${ctx || "(none provided)"}. Here is the transcript:\n\n${trimmedTranscript}\n\nGive me a score 1-10, three strengths, three areas to improve, and three action items.`,
      submit: true,
    });
  }

  function handleRetrySection(sectionId: CallAnalysisSectionId) {
    if (!displayedAnalysis) return;
    const contextLine = displayedAnalysis.prospectContext
      ? `\nProspect context: ${displayedAnalysis.prospectContext}`
      : "";
    sendToAgentChat({
      message: `Please re-analyze the ${sectionId} section of analysis ${displayedAnalysis.id}.${contextLine}\n\nTranscript:\n${displayedAnalysis.transcriptText}`,
      submit: true,
    });
  }

  async function handleSaveAnalysis() {
    const result = liveResult ?? displayedAnalysis?.analysisResult;
    if (!displayedAnalysis || !result) return;
    try {
      const { analysis } = await saveAnalysis({
        id: displayedAnalysis.id,
        result,
      });
      setActiveAnalysis(analysis);
      setViewingAnalysisId(analysis.id);
      toast.success("Analysis saved.");
    } catch {
      toast.error("Could not save analysis.");
    }
  }

  async function handleDeleteAnalysis(id: string) {
    try {
      await deleteAnalysis(id);
      if (viewingAnalysisId === id) {
        setViewingAnalysisId(null);
      }
      if (activeAnalysis?.id === id) {
        setActiveAnalysis(null);
      }
      toast.success("Analysis deleted.");
    } catch {
      toast.error("Could not delete analysis.");
    }
  }

  const isAnalyzing = isRunning;
  const showResults =
    Boolean(liveResult) ||
    Boolean(displayedAnalysis?.analysisResult) ||
    isRunning ||
    Object.values(sectionStates).some((state) => state.status !== "pending");

  return (
    <ScrollArea className="h-full min-h-0">
      <div className="space-y-6 p-3 pb-20 md:p-4 md:pb-6">
        <form
          className="space-y-3"
          onSubmit={(event) => {
            event.preventDefault();
            handleAnalyzeCall();
          }}
        >
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Transcript to analyze
            </p>
            <p className="text-sm text-muted-foreground">
              Choose a saved transcript, paste text, or upload a .txt or .vtt file. Playbooks
              from Settings are used automatically.
            </p>
          </div>

          <div className="grid gap-3">
            <div className="grid gap-2">
              <Label htmlFor="saved-transcript">Saved transcript</Label>
              <Select
                value={selectedTranscriptId}
                onValueChange={setSelectedTranscriptId}
              >
                <SelectTrigger id="saved-transcript">
                  <SelectValue placeholder="Select a saved transcript" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No saved transcript</SelectItem>
                  {transcripts.map((transcript) => (
                    <SelectItem key={transcript.id} value={transcript.id}>
                      {transcript.sessionName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {isLoadingTranscripts ? (
                <p className="text-xs text-muted-foreground">Loading saved transcripts...</p>
              ) : null}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="prospect-context">Prospect context</Label>
              <Input
                ref={prospectContextRef}
                id="prospect-context"
                value={prospectContext}
                onChange={(event) => setProspectContext(event.target.value)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" && !event.shiftKey) {
                    event.preventDefault();
                    handleAnalyzeCall();
                  }
                }}
                placeholder="Prospect: John Smith, VP Engineering at Acme Corp, Series B fintech startup"
              />
            </div>

            <div className="grid gap-2">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <Label htmlFor="transcript-text">Transcript</Label>
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => transcriptFileInputRef.current?.click()}
                >
                  <IconUpload className="h-4 w-4" />
                  Upload .txt or .vtt
                </Button>
                <input
                  ref={transcriptFileInputRef}
                  type="file"
                  accept=".txt,.vtt,text/plain,text/vtt"
                  className="hidden"
                  onChange={(event) => {
                    const file = event.target.files?.[0];
                    event.target.value = "";
                    if (file) void handleTranscriptFileUpload(file);
                  }}
                />
              </div>
              <Textarea
                id="transcript-text"
                value={transcriptText}
                onChange={(event) => setTranscriptText(event.target.value)}
                className="min-h-56"
                placeholder="Paste a transcript from Nooks, Gong, Chorus, or another call recording platform."
              />
            </div>

            <Button type="submit" disabled={isAnalyzing}>
              <IconChartBar className="h-4 w-4" />
              Analyze Call
            </Button>
          </div>
        </form>

        {runError ? (
          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="text-base text-destructive">Analysis failed</CardTitle>
              <CardDescription className="text-destructive/90">
                {runError}
              </CardDescription>
            </CardHeader>
          </Card>
        ) : null}

        {displayedAnalysis?.status === "pending" && !isRunning ? (
          <Card className="border-border/70 bg-card/40">
            <CardHeader className="flex flex-row items-center gap-3 space-y-0 pb-2">
              <Spinner className="size-5 shrink-0 text-muted-foreground" />
              <div className="min-w-0 space-y-1">
                <CardTitle className="text-base">Analysis in progress…</CardTitle>
                <CardDescription>
                  Checking every 5 seconds. Results appear here when ready.
                </CardDescription>
              </div>
            </CardHeader>
            {analysisStatusQuery.isError ? (
              <CardContent className="pt-0 text-sm text-destructive">
                Could not refresh status. Try switching away and back to this analysis.
              </CardContent>
            ) : null}
          </Card>
        ) : null}

        {isRunning && progress ? (
          <CallAnalysisProgress
            label={progress.label}
            step={progress.step}
            total={progress.total}
          />
        ) : null}

        {showResults && displayedAnalysis ? (
          <section className="space-y-3">
            <div>
              <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                Analysis results
              </p>
            </div>
            <CallAnalysisResults
              analysis={displayedAnalysis}
              liveResult={liveResult}
              sectionStates={sectionStates}
              onRetrySection={(sectionId) => void handleRetrySection(sectionId)}
              onSave={() => void handleSaveAnalysis()}
              isSaving={isSaving}
              canSave={Boolean(liveResult ?? displayedAnalysis.analysisResult)}
            />
          </section>
        ) : null}

        <section className="space-y-3">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Past analyses
            </p>
            <p className="text-sm text-muted-foreground">
              Review saved analyses and track improvement over time.
            </p>
          </div>

          {isLoadingAnalyses ? (
            <p className="text-sm text-muted-foreground">Loading analyses...</p>
          ) : analyses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No saved analyses yet.</p>
          ) : (
            <div className="grid gap-3">
              {analyses.map((analysis) => (
                <Card key={analysis.id} className="border-border/70 bg-card/30">
                  <CardHeader className="pb-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <CardTitle className="text-base">
                          {analysis.prospectContext || "No prospect context"}
                        </CardTitle>
                        <CardDescription>
                          {formatTimestamp(analysis.createdAt)}
                          {analysis.overallScore != null ? (
                            <span
                              className={cn(
                                "ml-2 font-medium",
                                scoreIndicatorClass(analysis.overallScore),
                              )}
                            >
                              {analysis.overallScore}/10
                            </span>
                          ) : null}
                        </CardDescription>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            resetRun();
                            setViewingAnalysisId(analysis.id);
                            setActiveAnalysis(analysis);
                          }}
                        >
                          View
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button type="button" size="sm" variant="ghost">
                              <IconTrash className="h-4 w-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete analysis?</AlertDialogTitle>
                              <AlertDialogDescription>
                                This removes the saved analysis from your history.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => void handleDeleteAnalysis(analysis.id)}
                              >
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </ScrollArea>
  );
}
