import { createError, defineEventHandler, readBody } from "h3";
import type {
  CallAnalysisStreamEvent,
  CallAnalysisTier,
  PlaybookDocument,
  PlaybookDocumentType,
} from "@shared/call-analysis";
import { isPlaybookDocumentType } from "@shared/call-analysis";
import {
  analysisIsPublishable,
  BUILDER_ANALYSIS_MODEL,
  runCallAnalysisPipeline,
} from "../../lib/call-analysis-engine.js";

const ANALYZE_CALL_LOG_PREFIX = "[analyze-call]";

interface AnalyzeCallBody {
  transcriptText?: string;
  transcript?: string;
  prospectContext?: string;
  stream?: boolean;
  mode?: CallAnalysisTier;
  playbookContent?: Array<{
    id?: string;
    filename?: string;
    contentText?: string;
    documentType?: string;
    uploadedAt?: string;
  }>;
}

function normalizePlaybookDocuments(
  value: AnalyzeCallBody["playbookContent"],
): PlaybookDocument[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const now = new Date().toISOString();
  return value
    .filter((entry) => typeof entry?.contentText === "string")
    .map((entry, index) => {
      const documentType =
        entry.documentType && isPlaybookDocumentType(entry.documentType)
          ? entry.documentType
          : ("general_playbook" as PlaybookDocumentType);
      return {
        id: entry.id?.trim() || `playbook-${index + 1}`,
        filename: entry.filename?.trim() || `Playbook ${index + 1}`,
        contentText: entry.contentText!.trim(),
        documentType,
        uploadedAt: entry.uploadedAt?.trim() || now,
      };
    })
    .filter((entry) => entry.contentText.length > 0);
}

function encodeSse(event: CallAnalysisStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export default defineEventHandler(async (event) => {
  const builderPrivateKeySet = Boolean(process.env.BUILDER_PRIVATE_KEY?.trim());

  try {
    const body = ((await readBody(event)) ?? {}) as AnalyzeCallBody;
    const transcriptText = (body.transcriptText ?? body.transcript ?? "").trim();
    const prospectContext =
      typeof body.prospectContext === "string" ? body.prospectContext.trim() : "";
    const playbooks = normalizePlaybookDocuments(body.playbookContent);
    const mode = body.mode === "deep" ? "deep" : "quick";
    const stream = body.stream === true;
    const requestPayloadSize = JSON.stringify({
      transcriptText,
      prospectContext,
      playbookContent: body.playbookContent ?? [],
    }).length;

    console.error(
      `${ANALYZE_CALL_LOG_PREFIX} BUILDER_PRIVATE_KEY set:`,
      builderPrivateKeySet,
    );
    console.error(
      `${ANALYZE_CALL_LOG_PREFIX} model:`,
      BUILDER_ANALYSIS_MODEL,
      "transcript chars:",
      transcriptText.length,
      "transcript words:",
      transcriptText.split(/\s+/).filter(Boolean).length,
      "request payload size:",
      requestPayloadSize,
      "stream:",
      stream,
      "mode:",
      mode,
    );

    if (!transcriptText) {
      throw createError({
        statusCode: 400,
        statusMessage: "Transcript text is required.",
      });
    }

    if (playbooks.length === 0) {
      throw createError({
        statusCode: 400,
        statusMessage: "Playbook content is required.",
      });
    }

    if (stream) {
      const readable = new ReadableStream<Uint8Array>({
        start(controller) {
          const encoder = new TextEncoder();
          const emit = (payload: CallAnalysisStreamEvent) => {
            controller.enqueue(encoder.encode(encodeSse(payload)));
          };

          void runCallAnalysisPipeline({
            transcriptText,
            prospectContext,
            playbooks,
            emit,
            mode,
          })
            .catch((error) => {
              const message =
                error instanceof Error ? error.message : "Call analysis failed.";
              controller.enqueue(
                encoder.encode(encodeSse({ type: "error", message })),
              );
            })
            .finally(() => {
              controller.close();
            });
        },
      });

      return new Response(readable, {
        headers: {
          "Content-Type": "text/event-stream; charset=utf-8",
          "Cache-Control": "no-cache, no-transform",
          Connection: "keep-alive",
        },
      });
    }

    let result: import("@shared/call-analysis").CallAnalysisResult | null = null;
    let errorMessage: string | null = null;

    await runCallAnalysisPipeline({
      transcriptText,
      prospectContext,
      playbooks,
      mode,
      emit: (streamEvent) => {
        if (streamEvent.type === "complete") {
          result = streamEvent.result;
        }
        if (streamEvent.type === "error") {
          errorMessage = streamEvent.message;
        }
      },
    });

    if (errorMessage) {
      console.error(`${ANALYZE_CALL_LOG_PREFIX} Analysis pipeline error`, {
        model: BUILDER_ANALYSIS_MODEL,
        requestPayloadSize,
        builderPrivateKeySet,
        errorMessage,
      });
      throw createError({
        statusCode: 500,
        statusMessage: errorMessage,
      });
    }

    if (!result || !analysisIsPublishable(result)) {
      console.error(`${ANALYZE_CALL_LOG_PREFIX} Incomplete analysis result`, {
        model: BUILDER_ANALYSIS_MODEL,
        requestPayloadSize,
        builderPrivateKeySet,
        hasResult: Boolean(result),
      });
      throw createError({
        statusCode: 500,
        statusMessage: "Call analysis did not return a publishable result.",
      });
    }

    return { result };
  } catch (error) {
    if (error && typeof error === "object" && "statusCode" in error) {
      throw error;
    }

    console.error(`${ANALYZE_CALL_LOG_PREFIX} Request failed`, {
      model: BUILDER_ANALYSIS_MODEL,
      builderPrivateKeySet,
      errorName: error instanceof Error ? error.name : typeof error,
      errorMessage: error instanceof Error ? error.message : String(error),
    });

    throw createError({
      statusCode: 500,
      statusMessage:
        error instanceof Error ? error.message : "Call analysis failed.",
    });
  }
});
