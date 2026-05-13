import { createError, defineEventHandler, getRouterParam } from "h3";
import { deleteSavedSpeakerProfile } from "../../../../lib/speaker-profiles.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Speaker id is required.",
    });
  }
  try {
    await deleteSavedSpeakerProfile(id);
    return { ok: true };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "Speaker profile not found.",
    });
  }
});
