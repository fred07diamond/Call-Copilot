import { createError, defineEventHandler, getQuery } from "h3";
import { getCallAnalysisStatusPayload } from "../../../lib/analyses.js";

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const id = typeof query.id === "string" ? query.id.trim() : "";
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Query parameter id is required.",
    });
  }

  try {
    const status = await getCallAnalysisStatusPayload(id);
    return { status };
  } catch {
    throw createError({
      statusCode: 404,
      statusMessage: "Analysis not found.",
    });
  }
});
