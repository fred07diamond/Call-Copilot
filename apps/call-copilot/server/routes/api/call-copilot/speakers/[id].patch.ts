import { createError, defineEventHandler, getRouterParam, readBody } from "h3";
import { renameSavedSpeakerProfile } from "../../../../lib/speaker-profiles.js";
import type { SavedSpeakerProfile } from "@shared/speaker";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Speaker id is required.",
    });
  }
  const body = (await readBody(event)) as { label?: string };
  if (!body.label?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "label is required.",
    });
  }
  try {
    const profile = await renameSavedSpeakerProfile(id, body.label);
    return { profile } satisfies { profile: SavedSpeakerProfile };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "Speaker profile not found.",
    });
  }
});
