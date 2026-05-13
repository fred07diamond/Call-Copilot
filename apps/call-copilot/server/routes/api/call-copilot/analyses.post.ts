import { createError, defineEventHandler, readBody } from "h3";
import { createPendingCallAnalysis } from "../../../lib/analyses.js";
import type {
  CreateCallAnalysisInput,
  SavedCallAnalysis,
} from "@shared/call-analysis";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as CreateCallAnalysisInput;
  const transcriptText = body?.transcriptText?.trim() ?? "";
  if (!transcriptText) {
    throw createError({
      statusCode: 400,
      statusMessage: "Transcript text is required.",
    });
  }

  const analysis = await createPendingCallAnalysis({
    transcriptId: body.transcriptId ?? null,
    transcriptText,
    prospectContext: body.prospectContext ?? "",
    playbookDocumentIds: Array.isArray(body.playbookDocumentIds)
      ? body.playbookDocumentIds
      : [],
  });

  return { analysis } satisfies { analysis: SavedCallAnalysis };
});
