import { defineEventHandler, readBody } from "h3";
import { replaceManualWatchKeywords } from "../../../lib/watch-keywords.js";
import {
  normalizeKeywordEntries,
  type WatchKeywordEntry,
  type WatchKeywordsResponse,
} from "@shared/call-copilot";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as { keywords?: WatchKeywordEntry[] };
  const keywords = await replaceManualWatchKeywords(
    normalizeKeywordEntries(Array.isArray(body.keywords) ? body.keywords : []),
  );
  return { keywords } satisfies WatchKeywordsResponse;
});
