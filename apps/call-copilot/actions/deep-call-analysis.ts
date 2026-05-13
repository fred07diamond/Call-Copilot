import { defineAction } from "@agent-native/core";
import { z } from "zod";
import {
  getCallAnalysis,
  resetCallAnalysisToPending,
} from "../server/lib/analyses.js";
import { triggerRunAnalysisWebhook } from "../server/lib/run-analysis-trigger.js";

const QUEUED_MESSAGE =
  "Analysis queued. Results will appear in the Call Analysis tab shortly.";

export default defineAction({
  description:
    "Re-queue deep analysis for an existing row: resets status to pending, clears the previous result, and triggers the background worker. No LLM runs in this action.",
  schema: z.object({
    id: z.string().min(1).describe("The analysis id to re-run"),
  }),
  http: false,
  run: async ({ id }) => {
    await getCallAnalysis(id);
    await resetCallAnalysisToPending(id);
    triggerRunAnalysisWebhook(id);

    return JSON.stringify(
      {
        message: QUEUED_MESSAGE,
        analysisId: id,
      },
      null,
      2,
    );
  },
});
