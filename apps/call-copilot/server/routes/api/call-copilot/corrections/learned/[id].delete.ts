import { createError, defineEventHandler, getRouterParam } from "h3";
import { deleteLearnedCorrection } from "../../../../../lib/learned-corrections.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Correction id is required.",
    });
  }

  try {
    await deleteLearnedCorrection(id);
    return { ok: true };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "Correction not found.",
    });
  }
});
