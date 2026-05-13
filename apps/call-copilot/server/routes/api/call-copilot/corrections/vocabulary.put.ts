import { defineEventHandler, readBody } from "h3";
import { replaceManualVocabularyCorrections } from "../../../../lib/vocabulary-corrections.js";
import type { VocabularyCorrectionsResponse } from "@shared/transcript";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    corrections?: Array<{ originalText: string; correctedText: string }>;
  };
  const corrections = await replaceManualVocabularyCorrections(
    Array.isArray(body.corrections) ? body.corrections : [],
  );
  return { corrections } satisfies VocabularyCorrectionsResponse;
});
