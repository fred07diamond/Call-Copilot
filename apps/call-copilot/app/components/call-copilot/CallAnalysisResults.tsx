import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { IconDownload, IconDeviceFloppy, IconRefresh } from "@tabler/icons-react";
import type {
  CallAnalysisResult,
  CallAnalysisSectionId,
  CallAnalysisSectionState,
  SavedCallAnalysis,
} from "@shared/call-analysis";
import { scoreIndicatorClass } from "@shared/call-analysis";
import { exportCallAnalysisPdf } from "@/lib/export-call-analysis-pdf";
import { cn } from "@/lib/utils";

function QuoteBlock({ quote }: { quote: string }) {
  return (
    <blockquote className="rounded-lg border border-border/70 bg-muted/30 px-3 py-2 text-sm italic text-foreground">
      “{quote}”
    </blockquote>
  );
}

function SectionShell({
  title,
  state,
  onRetry,
  children,
}: {
  title: string;
  state: CallAnalysisSectionState;
  onRetry?: () => void;
  children: React.ReactNode;
}) {
  return (
    <Card className="border-border/70 bg-card/40">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm leading-6 text-foreground">
        {state.status === "pending" ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-16 w-full" />
          </div>
        ) : null}
        {state.status === "loading" ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-1/3" />
            <pre className="max-h-40 overflow-auto rounded-lg border border-border/70 bg-muted/20 p-3 text-xs whitespace-pre-wrap">
              {state.streamedText || "Generating..."}
            </pre>
          </div>
        ) : null}
        {state.status === "error" ? (
          <div className="space-y-3 rounded-lg border border-destructive/30 bg-destructive/5 p-3">
            <p className="text-destructive">{state.message}</p>
            {onRetry ? (
              <Button type="button" size="sm" variant="outline" onClick={onRetry}>
                <IconRefresh className="h-4 w-4" />
                Retry
              </Button>
            ) : null}
          </div>
        ) : null}
        {state.status === "complete" ? children : null}
      </CardContent>
    </Card>
  );
}

interface CallAnalysisResultsProps {
  analysis: SavedCallAnalysis;
  liveResult?: CallAnalysisResult | null;
  sectionStates?: Partial<
    Record<CallAnalysisSectionId | "summary" | "quick", CallAnalysisSectionState>
  >;
  onRetrySection?: (sectionId: CallAnalysisSectionId) => void;
  onSave?: () => void;
  isSaving?: boolean;
  canSave?: boolean;
}

export function CallAnalysisResults({
  analysis,
  liveResult,
  sectionStates,
  onRetrySection,
  onSave,
  isSaving,
  canSave = false,
}: CallAnalysisResultsProps) {
  const result = liveResult ?? analysis.analysisResult;
  if (!result && !sectionStates) return null;

  const overallState =
    sectionStates?.overallScore ?? ({ status: "complete", data: null } as const);
  const strengthsState =
    sectionStates?.keyStrengths ?? ({ status: "complete", data: null } as const);
  const improveState =
    sectionStates?.areasToImprove ?? ({ status: "complete", data: null } as const);
  const missedState =
    sectionStates?.missedOpportunities ?? ({ status: "complete", data: null } as const);
  const actionsState =
    sectionStates?.topActionItems ?? ({ status: "complete", data: null } as const);

  const showMissedSection =
    (result?.missedOpportunities?.items?.length ?? 0) > 0 ||
    (result?.analysisTier === "deep" &&
      Boolean(result?.missedOpportunities?.summary?.trim()));

  return (
    <div className="space-y-4">
      {result?.incompleteNote ? (
        <div className="rounded-lg border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-sm text-amber-100/90">
          {result.incompleteNote}
        </div>
      ) : null}
      <SectionShell
        title="Overall score"
        state={overallState}
        onRetry={
          onRetrySection ? () => onRetrySection("overallScore") : undefined
        }
      >
        {result ? (
          <div className="space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p
                className={cn(
                  "text-4xl font-semibold",
                  scoreIndicatorClass(result.overallScore.score),
                )}
              >
                {result.overallScore.score}/10
              </p>
              <div className="flex items-center gap-2">
                {canSave && onSave ? (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={onSave}
                    disabled={isSaving}
                  >
                    <IconDeviceFloppy className="h-4 w-4" />
                    Save analysis
                  </Button>
                ) : null}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    exportCallAnalysisPdf({ ...analysis, analysisResult: result })
                  }
                >
                  <IconDownload className="h-4 w-4" />
                  Export PDF
                </Button>
              </div>
            </div>
            <p>{result.overallScore.summary}</p>
          </div>
        ) : null}
      </SectionShell>

      <SectionShell
        title="Key strengths"
        state={strengthsState}
        onRetry={onRetrySection ? () => onRetrySection("keyStrengths") : undefined}
      >
        {result ? (
          <div className="space-y-3">
            <p>{result.keyStrengths.summary}</p>
            {result.keyStrengths.items.map((item) => (
              <div key={`${item.title}-${item.detail}`} className="space-y-2">
                <p className="font-medium">{item.title}</p>
                {item.quote ? <QuoteBlock quote={item.quote} /> : null}
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        ) : null}
      </SectionShell>

      <SectionShell
        title="Areas to improve"
        state={improveState}
        onRetry={
          onRetrySection ? () => onRetrySection("areasToImprove") : undefined
        }
      >
        {result ? (
          <div className="space-y-3">
            <p>{result.areasToImprove.summary}</p>
            {result.areasToImprove.items.map((item) => (
              <div key={`${item.title}-${item.detail}`} className="space-y-2">
                <p className="font-medium">{item.title}</p>
                {item.quote ? <QuoteBlock quote={item.quote} /> : null}
                <p>{item.detail}</p>
              </div>
            ))}
          </div>
        ) : null}
      </SectionShell>

      {showMissedSection ? (
        <SectionShell
          title="Missed opportunities"
          state={missedState}
          onRetry={
            onRetrySection ? () => onRetrySection("missedOpportunities") : undefined
          }
        >
          {result ? (
            <div className="space-y-3">
              <p>{result.missedOpportunities.summary}</p>
              <ul className="list-disc space-y-2 pl-5">
                {result.missedOpportunities.items.map((item) => (
                  <li key={`${item.opportunity}-${item.playbookReference}`}>
                    {item.opportunity}{" "}
                    <span className="text-muted-foreground">
                      ({item.playbookReference})
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </SectionShell>
      ) : null}

      <SectionShell
        title="Top 3 action items"
        state={actionsState}
        onRetry={
          onRetrySection ? () => onRetrySection("topActionItems") : undefined
        }
      >
        {result ? (
          <ol className="list-decimal space-y-2 pl-5">
            {result.topActionItems.items
              .slice()
              .sort((left, right) => left.priority - right.priority)
              .map((item) => (
                <li key={`${item.priority}-${item.action}`}>
                  <span className="font-medium">{item.playbookSection}:</span>{" "}
                  {item.action}
                </li>
              ))}
          </ol>
        ) : null}
      </SectionShell>
    </div>
  );
}

export function CallAnalysisProgress({
  label,
  step,
  total,
}: {
  label: string;
  step: number;
  total: number;
}) {
  const value = total > 0 ? Math.round((step / total) * 100) : 0;
  return (
    <div className="space-y-2 rounded-xl border border-border/70 bg-card/30 p-4">
      <div className="flex items-center justify-between gap-3 text-sm">
        <p className="text-foreground">{label}</p>
        <p className="text-muted-foreground">
          {step}/{total}
        </p>
      </div>
      <Progress value={value} />
    </div>
  );
}
