import { createError, defineEventHandler, getRouterParam, readBody } from "h3";
import type {
  CallAnalysisStreamEvent,
  RunCallAnalysisInput,
} from "@shared/call-analysis";
import { isCallAnalysisSectionId } from "@shared/call-analysis";
import { getCallAnalysis, publishCallAnalysisResult } from "../../../../../lib/analyses.js";
import { getPlaybookDocumentsByIds } from "../../../../../lib/playbooks.js";
import {
  analysisIsPublishable,
  runCallAnalysisPipeline,
} from "../../../../../lib/call-analysis-engine.js";

function encodeSse(event: CallAnalysisStreamEvent): string {
  return `data: ${JSON.stringify(event)}\n\n`;
}

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing analysis id." });
  }

  const body = ((await readBody(event)) ?? {}) as RunCallAnalysisInput;
  const retrySection =
    body.retrySection && isCallAnalysisSectionId(body.retrySection)
      ? body.retrySection
      : undefined;
  const mode = body.mode === "deep" ? "deep" : "quick";

  let analysis;
  try {
    analysis = await getCallAnalysis(id);
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error instanceof Error ? error.message : "Analysis not found.",
    });
  }

  const playbooks = await getPlaybookDocumentsByIds(analysis.playbookDocumentIds);
  if (playbooks.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "Upload at least one sales playbook before analyzing.",
    });
  }

  const stream = new ReadableStream<Uint8Array>({
    start(controller) {
      const encoder = new TextEncoder();
      const emit = (payload: CallAnalysisStreamEvent) => {
        controller.enqueue(encoder.encode(encodeSse(payload)));
      };

      void runCallAnalysisPipeline({
        transcriptText: analysis.transcriptText,
        prospectContext: analysis.prospectContext,
        playbooks,
        emit,
        mode,
        retrySection,
        partialResult: body.partialResult ?? analysis.analysisResult ?? undefined,
      })
        .then(async (result) => {
          if (analysisIsPublishable(result)) {
            await publishCallAnalysisResult({ id, result });
          }
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

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
    },
  });
});
