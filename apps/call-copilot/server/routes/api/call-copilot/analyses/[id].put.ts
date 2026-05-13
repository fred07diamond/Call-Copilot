import { createError, defineEventHandler, getRouterParam, readBody } from "h3";
import { saveCallAnalysisResult } from "../../../../lib/analyses.js";
import type {
  CallAnalysisResult,
  SavedCallAnalysis,
} from "@shared/call-analysis";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing analysis id." });
  }

  const body = (await readBody(event)) as { result?: CallAnalysisResult };
  if (!body?.result) {
    throw createError({
      statusCode: 400,
      statusMessage: "Analysis result is required.",
    });
  }

  try {
    const analysis = await saveCallAnalysisResult({
      id,
      result: body.result,
    });
    return { analysis } satisfies { analysis: SavedCallAnalysis };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error instanceof Error ? error.message : "Analysis not found.",
    });
  }
});
