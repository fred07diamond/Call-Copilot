import { createError, defineEventHandler, getRouterParam } from "h3";
import { deleteCallAnalysis } from "../../../../lib/analyses.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing analysis id." });
  }

  try {
    await deleteCallAnalysis(id);
    return { ok: true };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage: error instanceof Error ? error.message : "Analysis not found.",
    });
  }
});
