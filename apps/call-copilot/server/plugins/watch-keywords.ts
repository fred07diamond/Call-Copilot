import { defineNitroPlugin } from "@agent-native/core";
import { ensureWatchKeywordSeeds } from "../lib/watch-keywords.js";

export default defineNitroPlugin(async () => {
  await ensureWatchKeywordSeeds();
});
