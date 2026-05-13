import pdfParse from "pdf-parse";
import type {
  PlaybookDocument,
  PlaybookDocumentType,
} from "@shared/call-analysis";
import { isPlaybookDocumentType } from "@shared/call-analysis";
import { getDb, schema } from "../db/index.js";

function toPlaybookDocument(
  row: typeof schema.playbookDocuments.$inferSelect,
): PlaybookDocument {
  return {
    id: row.id,
    filename: row.filename,
    contentText: row.contentText,
    documentType: isPlaybookDocumentType(row.documentType)
      ? row.documentType
      : "general_playbook",
    uploadedAt: row.uploadedAt,
  };
}

export async function listPlaybookDocuments(): Promise<PlaybookDocument[]> {
  const db = getDb();
  const rows = await db.select().from(schema.playbookDocuments);
  return rows
    .sort((left, right) => right.uploadedAt.localeCompare(left.uploadedAt))
    .map(toPlaybookDocument);
}

export async function getPlaybookDocumentsByIds(
  ids: string[],
): Promise<PlaybookDocument[]> {
  if (ids.length === 0) return [];
  const documents = await listPlaybookDocuments();
  const idSet = new Set(ids);
  return documents.filter((document) => idSet.has(document.id));
}

export async function uploadPlaybookDocument(input: {
  filename: string;
  fileBuffer: Buffer;
  documentType: PlaybookDocumentType;
}): Promise<PlaybookDocument> {
  const db = getDb();
  const id = crypto.randomUUID();
  const uploadedAt = new Date().toISOString();
  const contentText = await extractPdfText(input.fileBuffer);
  const row = {
    id,
    filename: input.filename.trim(),
    contentText,
    documentType: input.documentType,
    uploadedAt,
  };
  await db.insert(schema.playbookDocuments).values(row);
  return toPlaybookDocument(row);
}

export async function deletePlaybookDocument(id: string): Promise<void> {
  const db = getDb();
  const rows = await db.select().from(schema.playbookDocuments);
  const remaining = rows.filter((row) => row.id !== id);
  if (remaining.length === rows.length) {
    throw new Error("Playbook document not found.");
  }
  await db.delete(schema.playbookDocuments);
  if (remaining.length > 0) {
    await db.insert(schema.playbookDocuments).values(remaining);
  }
}

async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  const parsed = await pdfParse(fileBuffer);
  return parsed.text?.trim() ?? "";
}
