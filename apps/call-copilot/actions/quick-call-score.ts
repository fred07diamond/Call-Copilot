import { defineAction } from "@agent-native/core";
import { z } from "zod";
import { getDb, schema } from "../server/db/index.js";
import { listPlaybookDocuments } from "../server/lib/playbooks.js";
import { triggerRunAnalysisWebhook } from "../server/lib/run-analysis-trigger.js";

const QUEUED_MESSAGE =
  "Analysis queued. Results will appear in the Call Analysis tab shortly.";

export default defineAction({
  description:
    "Queue call analysis: saves the transcript as pending and triggers the background worker. No LLM runs in this action — same pipeline as create-call-analysis.",
  schema: z.object({
    transcriptText: z.string().min(1).describe("Full call transcript to store and analyze"),
    prospectContext: z
      .string()
      .optional()
      .describe("Optional prospect context (name, title, company, etc.)"),
    transcriptId: z.string().optional().describe("Optional saved transcript id"),
  }),
  http: false,
  run: async ({ transcriptText, prospectContext, transcriptId }) => {
    const db = getDb();
    const playbooks = await listPlaybookDocuments();
    const id = crypto.randomUUID();
    const createdAt = new Date().toISOString();

    await db.insert(schema.analyses).values({
      id,
      transcriptId: transcriptId ?? null,
      transcriptText: transcriptText.trim(),
      prospectContext: prospectContext?.trim() ?? "",
      playbookDocumentIdsJson: JSON.stringify(playbooks.map((p) => p.id)),
      analysisResultJson: null,
      overallScore: null,
      status: "pending",
      errorMessage: null,
      createdAt,
    });

    triggerRunAnalysisWebhook(id);

    return JSON.stringify(
      {
        success: true,
        message: QUEUED_MESSAGE,
        analysisId: id,
      },
      null,
      2,
    );
  },
});
