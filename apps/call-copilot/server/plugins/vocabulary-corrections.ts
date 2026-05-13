import { defineNitroPlugin } from "@agent-native/core";
import { ensureBuiltinVocabularyCorrections } from "../lib/vocabulary-corrections.js";

export default defineNitroPlugin(async () => {
  await ensureBuiltinVocabularyCorrections();
});
