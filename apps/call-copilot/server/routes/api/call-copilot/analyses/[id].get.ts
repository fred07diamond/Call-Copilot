import { createError, defineEventHandler, getRouterParam } from "h3";
import { getCallAnalysis } from "../../../../lib/analyses.js";
import type { SavedCallAnalysis } from "@shared/call-analysis";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing analysis id." });
  }

  try {
    const analysis = await getCallAnalysis(id);
    return { analysis } satisfies { analysis: SavedCallAnalysis };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error instanceof Error ? error.message : "Analysis not found.",
    });
  }
});
