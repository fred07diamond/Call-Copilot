import { useEffect, useMemo, useRef, useState } from "react";
import {
  IconArchive,
  IconBook,
  IconEdit,
  IconEye,
  IconFileText,
  IconMicrophone,
  IconRefresh,
  IconAdjustmentsHorizontal,
  IconTags,
  IconTrash,
  IconUpload,
  IconUsers,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { useKnowledgeBasePdfs } from "@/hooks/use-knowledge-base";
import { useWatchKeywords, useVoicePrefs } from "@/hooks/use-call-copilot-state";
import { useSavedTranscripts } from "@/hooks/use-saved-transcripts";
import { useTranscriptCorrections } from "@/hooks/use-transcript-corrections";
import { useSpeakerRecognition } from "@/hooks/use-speaker-recognition";
import type { WatchKeywordEntry } from "@shared/call-copilot";
import { formatSpokenTimestamp } from "@shared/transcript";
import { appApiPath } from "@agent-native/core/client";
import { usePlaybookDocuments } from "@/hooks/use-call-analysis";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { PdfTextPreviewSheet } from "@/components/call-copilot/PdfTextPreviewSheet";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import {
  PLAYBOOK_DOCUMENT_TYPES,
  PLAYBOOK_DOCUMENT_TYPE_LABELS,
  type PlaybookDocumentType,
} from "@shared/call-analysis";

function formatUploadedAt(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString();
}

export type SettingsCategory =
  | "playbooks"
  | "kb-pdfs"
  | "transcription"
  | "keywords"
  | "corrections"
  | "speaker"
  | "capture"
  | "transcripts";

const CATEGORY_NAV: { id: SettingsCategory; label: string; icon: typeof IconBook }[] = [
  { id: "playbooks", label: "Sales playbooks", icon: IconBook },
  { id: "kb-pdfs", label: "Knowledge PDFs", icon: IconFileText },
  { id: "transcription", label: "Transcription", icon: IconMicrophone },
  { id: "keywords", label: "Watch phrases", icon: IconTags },
  { id: "corrections", label: "Corrections", icon: IconEdit },
  { id: "speaker", label: "Speakers", icon: IconUsers },
  { id: "capture", label: "Capture & theme", icon: IconAdjustmentsHorizontal },
  { id: "transcripts", label: "Saved transcripts", icon: IconArchive },
];

interface SettingsCallCopilotPanelProps {
  initialCategory?: SettingsCategory;
  defaultCaptureMode: "mic-only" | "mic-and-system";
  onDefaultCaptureModeChange: (mode: "mic-only" | "mic-and-system") => void;
}

export function SettingsCallCopilotPanel({
  initialCategory = "playbooks",
  defaultCaptureMode,
  onDefaultCaptureModeChange,
}: SettingsCallCopilotPanelProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [expandedPdfId, setExpandedPdfId] = useState<string | null>(null);
  const [draftPhrase, setDraftPhrase] = useState("");
  const [draftDefinition, setDraftDefinition] = useState("");
  const [editingKeywordId, setEditingKeywordId] = useState<string | null>(null);
  const [editingTranscriptId, setEditingTranscriptId] = useState<string | null>(
    null,
  );
  const [transcriptNameDraft, setTranscriptNameDraft] = useState("");
  const [localManualKeywords, setLocalManualKeywords] = useState<
    WatchKeywordEntry[]
  >([]);
  const [manualCorrectionOriginal, setManualCorrectionOriginal] = useState("");
  const [manualCorrectionCorrected, setManualCorrectionCorrected] = useState("");

  const {
    pdfs,
    isLoading,
    uploadPdf,
    isUploading,
    deletePdf,
    isDeleting,
    reprocessPdf,
    isReprocessing,
  } = useKnowledgeBasePdfs();
  const { keywords, saveKeywords, isSaving, isSuccess } = useWatchKeywords();
  const {
    transcripts,
    isLoading: isLoadingTranscripts,
    renameTranscript,
    deleteTranscript,
  } = useSavedTranscripts();
  const {
    learned,
    vocabulary,
    deleteLearnedCorrection,
    saveManualVocabulary,
    isSavingVocabulary,
  } = useTranscriptCorrections();
  const {
    settings: speakerSettings,
    isLoading: isLoadingSpeakerSettings,
    saveSettings,
    profiles,
    deleteProfile,
  } = useSpeakerRecognition();
  const { provider, prefs, savePrefs, isSaving: isSavingPrefs } = useVoicePrefs();

  const [category, setCategory] = useState<SettingsCategory>(initialCategory);
  const [playbookDocType, setPlaybookDocType] =
    useState<PlaybookDocumentType>("general_playbook");
  const playbookFileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<
    | {
        mode: "inline";
        title: string;
        text: string;
        keywords: WatchKeywordEntry[];
      }
    | {
        mode: "fetch";
        title: string;
        url: string;
        keywords: WatchKeywordEntry[];
      }
    | null
  >(null);

  const {
    documents: playbookDocuments,
    isLoading: isLoadingPlaybooks,
    uploadDocument,
    isUploading: isUploadingPlaybook,
    deleteDocument,
    isDeleting: isDeletingPlaybook,
  } = usePlaybookDocuments();

  const manualKeywords = useMemo(
    () => keywords.filter((entry) => entry.sourceType === "manual"),
    [keywords],
  );
  const manualVocabulary = useMemo(
    () => vocabulary.filter((entry) => entry.source === "manual"),
    [vocabulary],
  );

  useEffect(() => {
    if (!isSuccess) return;
    setLocalManualKeywords(manualKeywords);
  }, [isSuccess, manualKeywords]);

  async function handleUpload(file: File | null) {
    if (!file) return;
    if (!file.name.toLowerCase().endsWith(".pdf")) return;
    await uploadPdf(file);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  }

  async function saveManualKeywords(next: WatchKeywordEntry[]) {
    setLocalManualKeywords(next);
    await saveKeywords(next);
  }

  async function addManualKeyword() {
    const phrase = draftPhrase.trim();
    if (!phrase) return;
    const next = [
      ...localManualKeywords,
      {
        phrase,
        definition: draftDefinition.trim(),
        sourceType: "manual" as const,
        sourceLabel: "Manual",
      },
    ];
    setDraftPhrase("");
    setDraftDefinition("");
    await saveManualKeywords(next);
  }

  async function saveEditedKeyword(entry: WatchKeywordEntry) {
    const next = localManualKeywords.map((keyword) =>
      (keyword.id ?? keyword.phrase) === (entry.id ?? entry.phrase)
        ? entry
        : keyword,
    );
    setEditingKeywordId(null);
    await saveManualKeywords(next);
  }

  async function removeManualKeyword(phrase: string) {
    const next = localManualKeywords.filter((entry) => entry.phrase !== phrase);
    await saveManualKeywords(next);
  }

  async function addManualCorrection() {
    const originalText = manualCorrectionOriginal.trim();
    const correctedText = manualCorrectionCorrected.trim();
    if (!originalText || !correctedText) return;
    await saveManualVocabulary([
      ...manualVocabulary.map((entry) => ({
        originalText: entry.originalText,
        correctedText: entry.correctedText,
      })),
      { originalText, correctedText },
    ]);
    setManualCorrectionOriginal("");
    setManualCorrectionCorrected("");
  }

  async function handleAutoLabelToggle(enabled: boolean) {
    try {
      await saveSettings({
        ...speakerSettings,
        autoLabelSpeakers: enabled,
      });
    } catch {
      toast.error("Could not update auto-label setting.");
    }
  }

  async function handleLabelingFrequencyChange(value: string) {
    const seconds = Number.parseInt(value, 10);
    if (seconds !== 15 && seconds !== 30 && seconds !== 60) return;
    try {
      await saveSettings({
        ...speakerSettings,
        labelingFrequencySeconds: seconds,
      });
    } catch {
      toast.error("Could not update labeling frequency.");
    }
  }

  async function handleCallContextHintBlur(value: string) {
    if (value === speakerSettings.callContextHint) return;
    try {
      await saveSettings({
        ...speakerSettings,
        callContextHint: value,
      });
    } catch {
      toast.error("Could not save call context hint.");
    }
  }

  async function handleFinalPassToggle(enabled: boolean) {
    try {
      await saveSettings({
        ...speakerSettings,
        runFinalPassOnSave: enabled,
      });
    } catch {
      toast.error("Could not update final pass setting.");
    }
  }

  async function handlePlaybookUpload(file: File) {
    try {
      await uploadDocument({ file, documentType: playbookDocType });
      toast.success("Playbook uploaded.");
    } catch {
      toast.error("Could not upload playbook PDF.");
    }
  }

  async function handleDeletePlaybookDoc(id: string) {
    try {
      await deleteDocument(id);
      toast.success("Playbook deleted.");
    } catch {
      toast.error("Could not delete playbook.");
    }
  }

  return (
    <div className="flex h-full min-h-0">
      <PdfTextPreviewSheet
        open={preview !== null}
        onOpenChange={(open) => {
          if (!open) setPreview(null);
        }}
        title={preview?.title ?? ""}
        keywords={preview?.keywords}
        fetchUrl={preview?.mode === "fetch" ? preview.url : null}
        inlineText={preview?.mode === "inline" ? preview.text : null}
      />
      <aside className="hidden w-52 shrink-0 flex-col border-r border-border/70 bg-muted/10 p-2 md:flex">
        <p className="mb-2 px-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Settings
        </p>
        <nav className="flex flex-col gap-0.5">
          {CATEGORY_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={cn(
                  "flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium transition-colors",
                  category === item.id
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-muted/50 hover:text-foreground",
                )}
              >
                <Icon className="h-4 w-4 shrink-0 opacity-90" />
                <span className="leading-snug">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </aside>
      <div className="flex min-h-0 min-w-0 flex-1 flex-col">
        <div className="flex gap-1 overflow-x-auto border-b border-border/70 bg-muted/15 p-2 md:hidden">
          {CATEGORY_NAV.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setCategory(item.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1 rounded-full px-2.5 py-1.5 text-[11px] font-medium",
                  category === item.id
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground",
                )}
              >
                <Icon className="h-3.5 w-3.5 shrink-0" />
                <span className="max-w-[5.5rem] truncate">{item.label}</span>
              </button>
            );
          })}
        </div>
        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-4 p-3 md:p-4">
            {category === "playbooks" ? (
              <section className="space-y-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
                    Sales playbooks
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Call analysis uses these documents automatically — no need to pick them per run.
                  </p>
                </div>
                <div className="grid gap-3 md:grid-cols-[minmax(0,1fr)_auto]">
                  <Select
                    value={playbookDocType}
                    onValueChange={(v) => setPlaybookDocType(v as PlaybookDocumentType)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Document type" />
                    </SelectTrigger>
                    <SelectContent>
                      {PLAYBOOK_DOCUMENT_TYPES.map((type) => (
                        <SelectItem key={type} value={type}>
                          {PLAYBOOK_DOCUMENT_TYPE_LABELS[type]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    onClick={() => playbookFileRef.current?.click()}
                    disabled={isUploadingPlaybook}
                  >
                    {isUploadingPlaybook ? (
                      <Spinner className="size-4" />
                    ) : (
                      <IconUpload className="h-4 w-4" />
                    )}
                    Upload PDF
                  </Button>
                  <input
                    ref={playbookFileRef}
                    type="file"
                    accept="application/pdf,.pdf"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      e.target.value = "";
                      if (f) void handlePlaybookUpload(f);
                    }}
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  {isLoadingPlaybooks ? (
                    <p className="text-sm text-muted-foreground">Loading…</p>
                  ) : playbookDocuments.length === 0 ? (
                    <p className="text-sm text-muted-foreground">No playbooks yet.</p>
                  ) : (
                    playbookDocuments.map((doc) => (
                      <Card key={doc.id} className="border-border/70 bg-card/50">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <CardTitle className="truncate text-base">{doc.filename}</CardTitle>
                              <CardDescription>
                                {PLAYBOOK_DOCUMENT_TYPE_LABELS[doc.documentType]}
                              </CardDescription>
                            </div>
                            <div className="flex shrink-0 gap-1">
                              <Button
                                type="button"
                                size="icon"
                                variant="ghost"
                                className="h-8 w-8"
                                title="View extracted text"
                                onClick={() =>
                                  setPreview({
                                    mode: "inline",
                                    title: doc.filename,
                                    text: doc.contentText,
                                    keywords: [],
                                  })
                                }
                              >
                                <IconEye className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button
                                    type="button"
                                    size="icon"
                                    variant="ghost"
                                    disabled={isDeletingPlaybook}
                                  >
                                    <IconTrash className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete playbook?</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Removes this playbook from analysis.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction
                                      onClick={() => void handleDeletePlaybookDoc(doc.id)}
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="text-xs text-muted-foreground">
                          Uploaded {formatUploadedAt(doc.uploadedAt)}
                        </CardContent>
                      </Card>
                    ))
                  )}
                </div>
              </section>
            ) : null}
            {category === "transcription" ? (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Transcription provider</CardTitle>
          <CardDescription>
            Select how live audio is transcribed. Deepgram enables real-time
            speaker detection.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="transcription-provider">Provider</Label>
            <Select
              value={provider}
              onValueChange={(value) =>
                void savePrefs({ ...prefs, provider: value as typeof provider })
              }
              disabled={isSavingPrefs}
            >
              <SelectTrigger id="transcription-provider">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Auto (Deepgram, then browser)</SelectItem>
                <SelectItem value="deepgram">
                  Deepgram — real-time + speaker diarization
                </SelectItem>
                <SelectItem value="google-realtime">Google Realtime</SelectItem>
                <SelectItem value="openai">OpenAI Whisper</SelectItem>
                <SelectItem value="groq">Groq Whisper</SelectItem>
                <SelectItem value="browser">Browser speech recognition</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {provider === "deepgram" && (
            <p className="rounded-lg border border-border/70 bg-card/40 px-3 py-2 text-xs text-muted-foreground">
              Using Deepgram nova-2 with speaker diarization. Voices are labeled
              Person 1, Person 2, and so on from the live audio stream. Set
              DEEPGRAM_API_KEY in apps/call-copilot/.env.local and restart the
              app after changing it.
            </p>
          )}
        </CardContent>
      </Card>
            ) : null}
            {category === "kb-pdfs" ? (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">PDF knowledge base</CardTitle>
          <CardDescription>
            Upload PDFs to extract glossary terms for transcript highlighting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <input
            ref={fileInputRef}
            type="file"
            accept="application/pdf,.pdf"
            className="hidden"
            onChange={(event) => void handleUpload(event.target.files?.[0] ?? null)}
          />
          <div
            className="rounded-xl border border-dashed border-border bg-muted/20 px-6 py-10 text-center"
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              void handleUpload(event.dataTransfer.files?.[0] ?? null);
            }}
          >
            <IconUpload className="mx-auto mb-3 h-8 w-8 text-muted-foreground" />
            <p className="text-sm font-medium text-foreground">
              Drag and drop a PDF here
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Or choose a file to extract keywords and definitions.
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              className="mt-4"
              disabled={isUploading}
              onClick={() => fileInputRef.current?.click()}
            >
              {isUploading ? <Spinner className="size-4" /> : null}
              Upload PDF
            </Button>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-foreground">Uploaded PDFs</p>
              {isLoading ? <Spinner className="size-3.5" /> : null}
            </div>
            {pdfs.length === 0 ? (
              <p className="text-sm text-muted-foreground">No PDFs uploaded yet.</p>
            ) : (
              <div className="grid gap-3">
                {pdfs.map((pdf) => (
                  <Card key={pdf.id} className="border-border/70 bg-card/40">
                    <CardContent className="flex items-start justify-between gap-4 p-4">
                      <div className="min-w-0">
                        <div className="mb-1 flex items-center gap-2">
                          <IconFileText className="h-4 w-4 text-muted-foreground" />
                          <p className="truncate text-sm font-medium text-foreground">
                            {pdf.filename}
                          </p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {formatUploadedAt(pdf.uploadedAt)} · {pdf.keywordCount}{" "}
                          keyword{pdf.keywordCount === 1 ? "" : "s"}
                        </p>
                        <Button
                          type="button"
                          variant="link"
                          className="mt-1 h-auto px-0 text-xs"
                          onClick={() =>
                            setExpandedPdfId(
                              expandedPdfId === pdf.id ? null : pdf.id,
                            )
                          }
                        >
                          {expandedPdfId === pdf.id
                            ? "Hide keywords"
                            : "View keywords"}
                        </Button>
                        {expandedPdfId === pdf.id ? (
                          <div className="mt-2 space-y-2 border-t border-border/60 pt-2">
                            {pdf.keywords.map((keyword) => (
                              <div
                                key={keyword.id ?? keyword.phrase}
                                className="rounded-md bg-muted/30 px-2 py-1.5"
                              >
                                <p className="text-xs font-medium text-foreground">
                                  {keyword.phrase}
                                </p>
                                <p className="text-xs leading-5 text-muted-foreground">
                                  {keyword.definition}
                                </p>
                              </div>
                            ))}
                          </div>
                        ) : null}
                      </div>
                      <div className="flex shrink-0 items-center gap-1">
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          title="View extracted text"
                          onClick={() =>
                            setPreview({
                              mode: "fetch",
                              title: pdf.filename,
                              url: appApiPath(
                                `/api/call-copilot/kb/pdfs/${encodeURIComponent(pdf.id)}/text`,
                              ),
                              keywords: pdf.keywords,
                            })
                          }
                        >
                          <IconEye className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8"
                          disabled={isReprocessing}
                          onClick={() => void reprocessPdf(pdf.id)}
                          title="Re-process PDF"
                        >
                          <IconRefresh className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive"
                          disabled={isDeleting}
                          onClick={() => void deletePdf(pdf.id)}
                          title="Delete PDF"
                        >
                          <IconTrash className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
            ) : null}
            {category === "keywords" ? (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Manual keywords</CardTitle>
          <CardDescription>
            Add custom phrases and definitions for transcript highlighting.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSaving ? <Spinner className="size-3.5" /> : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Phrase</TableHead>
                <TableHead>Definition</TableHead>
                <TableHead className="w-[120px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {localManualKeywords.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={3} className="text-muted-foreground">
                    No manual keywords yet.
                  </TableCell>
                </TableRow>
              ) : (
                localManualKeywords.map((keyword) => {
                  const key = keyword.id ?? keyword.phrase;
                  const editing = editingKeywordId === key;
                  return (
                    <TableRow key={key}>
                      <TableCell>
                        {editing ? (
                          <Input
                            defaultValue={keyword.phrase}
                            className="h-8"
                            onBlur={(event) =>
                              void saveEditedKeyword({
                                ...keyword,
                                phrase: event.target.value.trim(),
                              })
                            }
                          />
                        ) : (
                          keyword.phrase
                        )}
                      </TableCell>
                      <TableCell>
                        {editing ? (
                          <Textarea
                            defaultValue={keyword.definition}
                            className="min-h-[64px]"
                            onBlur={(event) =>
                              void saveEditedKeyword({
                                ...keyword,
                                definition: event.target.value.trim(),
                              })
                            }
                          />
                        ) : (
                          keyword.definition || "No definition yet."
                        )}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              setEditingKeywordId(editing ? null : key)
                            }
                          >
                            {editing ? "Done" : "Edit"}
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="text-destructive"
                            onClick={() => void removeManualKeyword(keyword.phrase)}
                          >
                            Delete
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>

          <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <Input
              value={draftPhrase}
              onChange={(event) => setDraftPhrase(event.target.value)}
              placeholder="Phrase"
              className="h-9"
            />
            <Input
              value={draftDefinition}
              onChange={(event) => setDraftDefinition(event.target.value)}
              placeholder="Definition"
              className="h-9"
            />
            <Button type="button" variant="outline" onClick={() => void addManualKeyword()}>
              Add keyword
            </Button>
          </div>
        </CardContent>
      </Card>
            ) : null}
            {category === "transcripts" ? (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Saved transcripts</CardTitle>
          <CardDescription>
            Review, rename, or delete transcripts saved from the live call view.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoadingTranscripts ? <Spinner className="size-3.5" /> : null}
          {transcripts.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No saved transcripts yet.
            </p>
          ) : (
            transcripts.map((transcript) => (
              <Card key={transcript.id} className="border-border/70 bg-card/40">
                <CardContent className="flex items-start justify-between gap-4 p-4">
                  <div className="min-w-0 flex-1">
                    {editingTranscriptId === transcript.id ? (
                      <Input
                        value={transcriptNameDraft}
                        onChange={(event) =>
                          setTranscriptNameDraft(event.target.value)
                        }
                        className="mb-2 h-8"
                      />
                    ) : (
                      <p className="truncate text-sm font-medium text-foreground">
                        {transcript.sessionName}
                      </p>
                    )}
                    <p className="text-xs text-muted-foreground">
                      Saved {formatUploadedAt(transcript.savedAt)} ·{" "}
                      {transcript.segments.length} segment
                      {transcript.segments.length === 1 ? "" : "s"}
                    </p>
                    <ScrollArea className="mt-2 max-h-32">
                      <div className="space-y-1 pr-2 text-xs text-muted-foreground">
                        {transcript.segments.map((segment) => (
                          <p key={segment.id}>
                            [{formatSpokenTimestamp(segment.spokenAt)}]{" "}
                            {segment.speakerLabel}: {segment.text}
                          </p>
                        ))}
                      </div>
                    </ScrollArea>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {editingTranscriptId === transcript.id ? (
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          void renameTranscript({
                            id: transcript.id,
                            sessionName: transcriptNameDraft.trim(),
                          });
                          setEditingTranscriptId(null);
                        }}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setEditingTranscriptId(transcript.id);
                          setTranscriptNameDraft(transcript.sessionName);
                        }}
                      >
                        Rename
                      </Button>
                    )}
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          className="text-destructive"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete transcript?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This removes the saved transcript permanently.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => void deleteTranscript(transcript.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>
            ) : null}
            {category === "corrections" ? (
        <>
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Learned corrections</CardTitle>
          <CardDescription>
            Corrections learned from transcript edits take priority during
            speech post-processing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original</TableHead>
                <TableHead>Corrected</TableHead>
                <TableHead>Times used</TableHead>
                <TableHead className="w-[80px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {learned.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-muted-foreground">
                    No learned corrections yet.
                  </TableCell>
                </TableRow>
              ) : (
                learned.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>{entry.originalText}</TableCell>
                    <TableCell>{entry.correctedText}</TableCell>
                    <TableCell>{entry.timesSeen}</TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        size="sm"
                        variant="ghost"
                        className="text-destructive"
                        onClick={() => void deleteLearnedCorrection(entry.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Vocabulary corrections</CardTitle>
          <CardDescription>
            Add custom misrecognition fixes for technical terms and product
            language.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {isSavingVocabulary ? <Spinner className="size-3.5" /> : null}
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Original</TableHead>
                <TableHead>Corrected</TableHead>
                <TableHead>Source</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {vocabulary.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.originalText}</TableCell>
                  <TableCell>{entry.correctedText}</TableCell>
                  <TableCell className="capitalize">{entry.source}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="grid gap-2 md:grid-cols-[1fr_1fr_auto]">
            <Input
              value={manualCorrectionOriginal}
              onChange={(event) => setManualCorrectionOriginal(event.target.value)}
              placeholder="Misrecognized text"
              className="h-9"
            />
            <Input
              value={manualCorrectionCorrected}
              onChange={(event) => setManualCorrectionCorrected(event.target.value)}
              placeholder="Correct term"
              className="h-9"
            />
            <Button type="button" variant="outline" onClick={() => void addManualCorrection()}>
              Add correction
            </Button>
          </div>
        </CardContent>
      </Card>
        </>
            ) : null}
            {category === "speaker" ? (
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Speaker recognition</CardTitle>
          <CardDescription>
            Configure AI retroactive speaker labeling for live transcripts.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-5">
          {isLoadingSpeakerSettings ? <Spinner className="size-3.5" /> : null}

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="speaker-auto-label">Auto-label speakers</Label>
              <p className="text-xs text-muted-foreground">
                Periodically assign speaker labels from transcript context.
              </p>
            </div>
            <Switch
              id="speaker-auto-label"
              checked={speakerSettings.autoLabelSpeakers}
              onCheckedChange={(checked) => void handleAutoLabelToggle(checked)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="speaker-label-frequency">Labeling frequency</Label>
            <Select
              value={String(speakerSettings.labelingFrequencySeconds)}
              onValueChange={(value) => void handleLabelingFrequencyChange(value)}
            >
              <SelectTrigger id="speaker-label-frequency">
                <SelectValue placeholder="Every 30 seconds" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="15">Every 15 seconds</SelectItem>
                <SelectItem value="30">Every 30 seconds</SelectItem>
                <SelectItem value="60">Every 60 seconds</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="speaker-call-context">Call context hint</Label>
            <Textarea
              id="speaker-call-context"
              defaultValue={speakerSettings.callContextHint}
              placeholder="This is a cold call to a VP of Engineering at a fintech company"
              onBlur={(event) => void handleCallContextHintBlur(event.target.value)}
            />
          </div>

          <div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 px-3 py-2">
            <div className="space-y-1">
              <Label htmlFor="speaker-final-pass">Run final pass on save</Label>
              <p className="text-xs text-muted-foreground">
                Reconcile speaker labels across the full transcript before saving.
              </p>
            </div>
            <Switch
              id="speaker-final-pass"
              checked={speakerSettings.runFinalPassOnSave}
              onCheckedChange={(checked) => void handleFinalPassToggle(checked)}
            />
          </div>

          <div className="space-y-2 rounded-lg border border-border/70 bg-muted/10 p-3">
            <Label>Saved speaker profiles</Label>
            {profiles.length === 0 ? (
              <p className="text-xs text-muted-foreground">No profiles yet.</p>
            ) : (
              <ul className="space-y-2">
                {profiles.map((p) => (
                  <li
                    key={p.id}
                    className="flex items-center justify-between gap-2 text-sm"
                  >
                    <span className="truncate">{p.label}</span>
                    <Button
                      type="button"
                      size="sm"
                      variant="ghost"
                      className="shrink-0 text-destructive"
                      onClick={() => void deleteProfile(p.id)}
                    >
                      Remove
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </CardContent>
      </Card>
            ) : null}
            {category === "capture" ? (
              <Card className="border-border/70 bg-card/50">
                <CardHeader>
                  <CardTitle className="text-base">Capture & appearance</CardTitle>
                  <CardDescription>
                    Default capture for new sessions and display theme.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Default capture mode</Label>
                    <ToggleGroup
                      type="single"
                      size="sm"
                      variant="outline"
                      value={defaultCaptureMode}
                      onValueChange={(value) => {
                        if (value === "mic-only" || value === "mic-and-system") {
                          onDefaultCaptureModeChange(value);
                        }
                      }}
                      className="justify-start"
                    >
                      <ToggleGroupItem value="mic-only">Mic only</ToggleGroupItem>
                      <ToggleGroupItem value="mic-and-system">
                        Mic + system
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </div>
                  <div className="flex items-center justify-between rounded-lg border border-border/70 px-3 py-2">
                    <div>
                      <p className="text-sm font-medium">Theme</p>
                      <p className="text-xs text-muted-foreground">Light or dark interface.</p>
                    </div>
                    <ThemeToggle />
                  </div>
                </CardContent>
              </Card>
            ) : null}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
