import { defineEventHandler } from "h3";
import { listLearnedCorrections } from "../../../lib/learned-corrections.js";
import { listVocabularyCorrections } from "../../../lib/vocabulary-corrections.js";

export default defineEventHandler(async () => {
  const [learned, vocabulary] = await Promise.all([
    listLearnedCorrections(),
    listVocabularyCorrections(),
  ]);
  return { learned, vocabulary };
});
