import { defineEventHandler } from "h3";
import { listSavedTranscripts } from "../../../lib/transcripts.js";
import type { SavedTranscriptsResponse } from "@shared/transcript";

export default defineEventHandler(async () => {
  const transcripts = await listSavedTranscripts();
  return { transcripts } satisfies SavedTranscriptsResponse;
});
