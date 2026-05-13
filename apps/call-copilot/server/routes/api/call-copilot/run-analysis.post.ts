import { createError, defineEventHandler, readBody } from "h3";
import { executeFullCallAnalysis } from "../../../lib/background-call-analysis.js";

interface RunAnalysisBody {
  analysisId?: string;
}

export default defineEventHandler(async (event) => {
  const body = ((await readBody(event)) ?? {}) as RunAnalysisBody;
  const analysisId = typeof body.analysisId === "string" ? body.analysisId.trim() : "";
  if (!analysisId) {
    throw createError({
      statusCode: 400,
      statusMessage: "analysisId is required.",
    });
  }

  const work = executeFullCallAnalysis(analysisId);
  const waitUntil = (event as { waitUntil?: (p: Promise<unknown>) => void }).waitUntil;
  if (typeof waitUntil === "function") {
    waitUntil(work);
  } else {
    void work.catch((err) => {
      console.error("[run-analysis] background job failed", analysisId, err);
    });
  }

  return {
    ok: true,
    analysisId,
    message: "Analysis job accepted.",
  };
});
