import { defineEventHandler } from "h3";
import { listWatchKeywords } from "../../../lib/watch-keywords.js";
import type { WatchKeywordsResponse } from "@shared/call-copilot";

export default defineEventHandler(async () => {
  const keywords = await listWatchKeywords();
  return { keywords } satisfies WatchKeywordsResponse;
});
