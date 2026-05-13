import { existsSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineEventHandler } from "h3";
import { BUILDER_ANALYSIS_MODEL } from "../../lib/call-analysis-engine.js";
import { runBuilderGatewayLlm } from "../../lib/builder-llm-gateway.js";
import { getDb, schema } from "../../db/index.js";

const __dirname = dirname(fileURLToPath(import.meta.url));

function keyPreview(value: string | undefined): { found: boolean; prefix: string } {
  const trimmed = value?.trim();
  if (!trimmed) {
    return { found: false, prefix: "missing" };
  }
  return { found: true, prefix: `${trimmed.slice(0, 8)}...` };
}

export default defineEventHandler(async () => {
  const results: Record<string, unknown> = {};

  const deepgramKey = process.env.DEEPGRAM_API_KEY?.trim();
  results.deepgramKey = keyPreview(deepgramKey);

  const builderKey = process.env.BUILDER_PRIVATE_KEY?.trim();
  results.builderKey = keyPreview(builderKey);

  try {
    const db = getDb();
    const rows = await db.select().from(schema.analyses).limit(1);
    results.database = {
      status: "connected",
      sampleRowCount: rows.length,
    };
  } catch (error) {
    results.database = {
      status: "error",
      message: error instanceof Error ? error.message : String(error),
    };
  }

  const runAnalysisPath = join(__dirname, "call-copilot", "run-analysis.post.ts");
  results.runAnalysisRoute = {
    exists: existsSync(runAnalysisPath),
    path: runAnalysisPath,
  };

  try {
    const actionsDir = join(__dirname, "..", "..", "..", "actions");
    const files = readdirSync(actionsDir).filter((f) => f.endsWith(".ts"));
    results.actions = { directory: actionsDir, files };
  } catch (error) {
    results.actions = {
      error: error instanceof Error ? error.message : String(error),
    };
  }

  if (builderKey) {
    try {
      const { text, timedOut } = await runBuilderGatewayLlm({
        model: BUILDER_ANALYSIS_MODEL,
        messages: [{ role: "user", content: "Reply with OK only." }],
        maxOutputTokens: 20,
        stream: false,
        timeoutMs: 20_000,
      });
      results.builderGateway = {
        status: "ok",
        timedOut,
        model: BUILDER_ANALYSIS_MODEL,
        responsePreview: String(text).slice(0, 200),
      };
    } catch (error) {
      results.builderGateway = {
        status: "error",
        message: error instanceof Error ? error.message : String(error),
      };
    }
  } else {
    results.builderGateway = { status: "skipped", reason: "no BUILDER_PRIVATE_KEY" };
  }

  return results;
});
