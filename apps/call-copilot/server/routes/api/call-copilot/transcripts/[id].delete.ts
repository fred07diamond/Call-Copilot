import { createError, defineEventHandler, getRouterParam } from "h3";
import { deleteSavedTranscript } from "../../../../lib/transcripts.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transcript id is required.",
    });
  }

  try {
    await deleteSavedTranscript(id);
    return { ok: true };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "Transcript not found.",
    });
  }
});
