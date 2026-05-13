import { defineEventHandler } from "h3";
import { listCallAnalyses } from "../../../lib/analyses.js";
import type { CallAnalysesResponse } from "@shared/call-analysis";

export default defineEventHandler(async () => {
  const analyses = await listCallAnalyses();
  return { analyses } satisfies CallAnalysesResponse;
});
