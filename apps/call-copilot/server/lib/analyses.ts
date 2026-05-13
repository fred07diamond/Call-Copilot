import type {
  CallAnalysisResult,
  CallAnalysisStatus,
  CallAnalysisStatusPayload,
  CreateCallAnalysisInput,
  SavedCallAnalysis,
} from "@shared/call-analysis";
import { getDb, schema } from "../db/index.js";

function parsePlaybookDocumentIds(value: string): string[] {
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed)
      ? parsed.filter((entry): entry is string => typeof entry === "string")
      : [];
  } catch {
    return [];
  }
}

function parseAnalysisResult(value: string | null): CallAnalysisResult | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as CallAnalysisResult;
  } catch {
    return null;
  }
}

function toSavedCallAnalysis(
  row: typeof schema.analyses.$inferSelect,
): SavedCallAnalysis {
  return {
    id: row.id,
    transcriptId: row.transcriptId,
    transcriptText: row.transcriptText,
    prospectContext: row.prospectContext,
    playbookDocumentIds: parsePlaybookDocumentIds(row.playbookDocumentIdsJson),
    analysisResult: parseAnalysisResult(row.analysisResultJson),
    overallScore: row.overallScore,
    status: row.status as CallAnalysisStatus,
    errorMessage: row.errorMessage,
    createdAt: row.createdAt,
  };
}

export async function listCallAnalyses(): Promise<SavedCallAnalysis[]> {
  const db = getDb();
  const rows = await db.select().from(schema.analyses);
  return rows
    .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    .map(toSavedCallAnalysis);
}

export async function getCallAnalysis(id: string): Promise<SavedCallAnalysis> {
  const db = getDb();
  const rows = await db.select().from(schema.analyses);
  const row = rows.find((entry) => entry.id === id);
  if (!row) {
    throw new Error("Analysis not found.");
  }
  return toSavedCallAnalysis(row);
}

export async function getCallAnalysisStatusPayload(
  id: string,
): Promise<CallAnalysisStatusPayload> {
  const full = await getCallAnalysis(id);
  return {
    id: full.id,
    status: full.status,
    analysisResult: full.analysisResult,
    errorMessage: full.errorMessage,
    overallScore: full.overallScore,
  };
}

export async function resetCallAnalysisToPending(id: string): Promise<SavedCallAnalysis> {
  const db = getDb();
  const rows = await db.select().from(schema.analyses);
  const current = rows.find((entry) => entry.id === id);
  if (!current) {
    throw new Error("Analysis not found.");
  }

  const next = rows.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          status: "pending",
          analysisResultJson: null,
          overallScore: null,
          errorMessage: null,
        }
      : entry,
  );

  await db.delete(schema.analyses);
  if (next.length > 0) {
    await db.insert(schema.analyses).values(next);
  }

  const updated = next.find((entry) => entry.id === id);
  if (!updated) {
    throw new Error("Analysis not found after reset.");
  }
  return toSavedCallAnalysis(updated);
}

export async function createPendingCallAnalysis(
  input: CreateCallAnalysisInput,
): Promise<SavedCallAnalysis> {
  const db = getDb();
  const id = crypto.randomUUID();
  const createdAt = new Date().toISOString();
  const row = {
    id,
    transcriptId: input.transcriptId ?? null,
    transcriptText: input.transcriptText.trim(),
    prospectContext: input.prospectContext?.trim() ?? "",
    playbookDocumentIdsJson: JSON.stringify(input.playbookDocumentIds ?? []),
    analysisResultJson: null,
    overallScore: null,
    status: "pending",
    errorMessage: null,
    createdAt,
  };
  await db.insert(schema.analyses).values(row);
  return toSavedCallAnalysis(row);
}

export async function publishCallAnalysisResult(input: {
  id: string;
  result: CallAnalysisResult;
}): Promise<SavedCallAnalysis> {
  const db = getDb();
  const rows = await db.select().from(schema.analyses);
  const current = rows.find((entry) => entry.id === input.id);
  if (!current) {
    throw new Error("Analysis not found.");
  }

  const next = rows.map((entry) =>
    entry.id === input.id
      ? {
          ...entry,
          analysisResultJson: JSON.stringify(input.result),
          overallScore: Math.round(input.result.overallScore.score),
          status: "complete",
          errorMessage: null,
        }
      : entry,
  );

  await db.delete(schema.analyses);
  if (next.length > 0) {
    await db.insert(schema.analyses).values(next);
  }

  const updated = next.find((entry) => entry.id === input.id);
  if (!updated) {
    throw new Error("Analysis not found after publish.");
  }
  return toSavedCallAnalysis(updated);
}

export async function markCallAnalysisError(input: {
  id: string;
  errorMessage: string;
}): Promise<SavedCallAnalysis> {
  const db = getDb();
  const rows = await db.select().from(schema.analyses);
  const current = rows.find((entry) => entry.id === input.id);
  if (!current) {
    throw new Error("Analysis not found.");
  }

  const next = rows.map((entry) =>
    entry.id === input.id
      ? {
          ...entry,
          status: "error",
          errorMessage: input.errorMessage.trim(),
        }
      : entry,
  );

  await db.delete(schema.analyses);
  if (next.length > 0) {
    await db.insert(schema.analyses).values(next);
  }

  const updated = next.find((entry) => entry.id === input.id);
  if (!updated) {
    throw new Error("Analysis not found after error update.");
  }
  return toSavedCallAnalysis(updated);
}

export async function saveCallAnalysisResult(input: {
  id: string;
  result: CallAnalysisResult;
}): Promise<SavedCallAnalysis> {
  return publishCallAnalysisResult(input);
}

export async function deleteCallAnalysis(id: string): Promise<void> {
  const db = getDb();
  const rows = await db.select().from(schema.analyses);
  const remaining = rows.filter((row) => row.id !== id);
  if (remaining.length === rows.length) {
    throw new Error("Analysis not found.");
  }
  await db.delete(schema.analyses);
  if (remaining.length > 0) {
    await db.insert(schema.analyses).values(remaining);
  }
}
