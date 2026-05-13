import { defineAction } from "@agent-native/core";
import { readAppState } from "@agent-native/core/application-state";
import { z } from "zod";
import {
  SESSION_STATE_KEY,
} from "../shared/call-copilot";
import { listWatchKeywords } from "../server/lib/watch-keywords.js";

export default defineAction({
  description:
    "See what the user is currently looking at on screen. Returns navigation, live transcript state, and watch phrases.",
  schema: z.object({}),
  http: false,
  run: async () => {
    const navigation = await readAppState("navigation");
    const session = await readAppState(SESSION_STATE_KEY);
    const keywords = await listWatchKeywords();

    const screen: Record<string, unknown> = {};
    if (navigation) screen.navigation = navigation;
    if (session) screen.session = session;
    if (keywords.length > 0) screen.watchKeywords = keywords;

    if (Object.keys(screen).length === 0) {
      return "No application state found. Is the app running?";
    }

    return JSON.stringify(screen, null, 2);
  },
});
