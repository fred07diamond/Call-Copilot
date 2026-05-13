import {
  analysisIsPublishable,
  runDeepCallAnalysisPipeline,
} from "./call-analysis-engine.js";
import { getCallAnalysis, markCallAnalysisError, publishCallAnalysisResult } from "./analyses.js";
import { getPlaybookDocumentsByIds } from "./playbooks.js";

export async function executeFullCallAnalysis(analysisId: string): Promise<void> {
  try {
    const analysis = await getCallAnalysis(analysisId);
    const playbooks = await getPlaybookDocumentsByIds(analysis.playbookDocumentIds);
    if (playbooks.length === 0) {
      await markCallAnalysisError({
        id: analysisId,
        errorMessage:
          "No playbook documents are linked to this analysis. Upload at least one playbook in the Call Analysis tab.",
      });
      return;
    }

    const result = await runDeepCallAnalysisPipeline({
      transcriptText: analysis.transcriptText,
      prospectContext: analysis.prospectContext,
      playbooks,
      emit: () => {},
    });

    if (analysisIsPublishable(result)) {
      await publishCallAnalysisResult({ id: analysisId, result });
    } else {
      await markCallAnalysisError({
        id: analysisId,
        errorMessage: "Full analysis did not produce a publishable result.",
      });
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Full call analysis failed.";
    try {
      await markCallAnalysisError({ id: analysisId, errorMessage: message });
    } catch {
      /* ignore secondary failures */
    }
  }
}
