import { createError, defineEventHandler, readBody } from "h3";
import { createSavedTranscript } from "../../../lib/transcripts.js";
import type { SavedTranscript, TranscriptSegment } from "@shared/transcript";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    sessionName?: string;
    segments?: TranscriptSegment[];
  };
  const segments = Array.isArray(body.segments) ? body.segments : [];
  if (segments.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: "At least one transcript segment is required.",
    });
  }

  const transcript = await createSavedTranscript({
    sessionName: body.sessionName?.trim() || "Call transcript",
    segments,
  });
  return { transcript } satisfies { transcript: SavedTranscript };
});
