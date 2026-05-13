import type { CreateCallAnalysisInput } from "@shared/call-analysis";
import { createPendingCallAnalysis } from "./analyses.js";
import { listPlaybookDocuments } from "./playbooks.js";
import { triggerRunAnalysisWebhook } from "./run-analysis-trigger.js";

/**
 * Inserts a pending analysis row and triggers the HTTP worker. No LLM work here.
 */
export async function queuePendingCallAnalysis(
  input: Pick<CreateCallAnalysisInput, "transcriptText" | "prospectContext" | "transcriptId">,
): Promise<{ analysisId: string }> {
  const playbooks = await listPlaybookDocuments();
  if (playbooks.length === 0) {
    throw new Error(
      "No playbook PDFs have been uploaded yet. Ask the user to upload a sales playbook PDF in the Call Analysis tab first.",
    );
  }

  const analysis = await createPendingCallAnalysis({
    transcriptText: input.transcriptText.trim(),
    prospectContext: input.prospectContext?.trim() ?? "",
    transcriptId: input.transcriptId ?? null,
    playbookDocumentIds: playbooks.map((p) => p.id),
  });

  triggerRunAnalysisWebhook(analysis.id);
  return { analysisId: analysis.id };
}
