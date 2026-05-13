import { defineAction } from "@agent-native/core";
import { z } from "zod";
import {
  normalizeKeywordEntries,
} from "../shared/call-copilot";
import {
  listWatchKeywords,
  replaceWatchKeywords,
} from "../server/lib/watch-keywords.js";

export default defineAction({
  description:
    "Read or update Call Copilot watch phrases and Builder.io product definitions used for transcript highlights.",
  schema: z.object({
    action: z.enum(["list", "set", "add", "remove"]).default("list"),
    keywords: z
      .array(
        z.object({
          phrase: z.string(),
          definition: z.string().optional(),
        }),
      )
      .optional(),
    phrase: z.string().optional(),
    definition: z.string().optional(),
  }),
  http: false,
  run: async ({ action, keywords, phrase, definition }) => {
    const current = await listWatchKeywords();

    if (action === "list") {
      return JSON.stringify({ keywords: current }, null, 2);
    }

    let next = current;
    if (action === "set") {
      next = normalizeKeywordEntries(
        (keywords ?? []).map((entry) => ({
          phrase: entry.phrase,
          definition: entry.definition ?? "",
        })),
      );
    } else if (action === "add") {
      next = normalizeKeywordEntries([
        ...current,
        {
          phrase: phrase ?? "",
          definition: definition ?? "",
        },
      ]);
    } else if (action === "remove") {
      const target = phrase?.trim().toLowerCase();
      next = current.filter((item) => item.phrase.toLowerCase() !== target);
    }

    const saved = await replaceWatchKeywords(next);
    return JSON.stringify({ keywords: saved }, null, 2);
  },
});
