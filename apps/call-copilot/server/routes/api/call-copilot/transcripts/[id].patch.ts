import { createError, defineEventHandler, getRouterParam, readBody } from "h3";
import { renameSavedTranscript } from "../../../../lib/transcripts.js";
import type { SavedTranscript } from "@shared/transcript";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transcript id is required.",
    });
  }

  const body = (await readBody(event)) as { sessionName?: string };
  const sessionName = body.sessionName?.trim();
  if (!sessionName) {
    throw createError({
      statusCode: 400,
      statusMessage: "sessionName is required.",
    });
  }

  try {
    const transcript = await renameSavedTranscript(id, sessionName);
    return { transcript } satisfies { transcript: SavedTranscript };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "Transcript not found.",
    });
  }
});
