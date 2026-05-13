/**
 * Queues full LLM analysis on the HTTP worker without blocking the caller.
 * Used by agent actions (quick-call-score, create-call-analysis, deep-call-analysis).
 *
 * Override with `RUN_ANALYSIS_WEBHOOK_URL` when the worker is not at the default URL.
 */
const DEFAULT_RUN_ANALYSIS_URL =
  "http://127.0.0.1:8101/api/call-copilot/run-analysis";

export function triggerRunAnalysisWebhook(analysisId: string): void {
  const url = process.env.RUN_ANALYSIS_WEBHOOK_URL?.trim() || DEFAULT_RUN_ANALYSIS_URL;

  void fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ analysisId }),
  }).catch(() => {});
}
