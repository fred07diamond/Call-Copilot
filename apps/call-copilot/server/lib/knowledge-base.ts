import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import pdfParse from "pdf-parse";
import type { KnowledgeBasePdf, WatchKeywordEntry } from "@shared/call-copilot";
import { getDb, schema } from "../db/index.js";
import {
  deleteKeywordsForPdf,
  listKeywordsForPdf,
  replacePdfKeywords,
} from "./watch-keywords.js";
import { extractKeywordsFromText } from "./pdf-extract.js";

const appRoot = join(dirname(fileURLToPath(import.meta.url)), "..", "..");
const pdfStorageDir = join(appRoot, "data", "kb-pdfs");

async function ensurePdfStorageDir(): Promise<void> {
  await mkdir(pdfStorageDir, { recursive: true });
}

function pdfStoragePath(id: string): string {
  return join(pdfStorageDir, `${id}.pdf`);
}

function toPdfRecord(
  row: typeof schema.kbPdfs.$inferSelect,
  keywords: WatchKeywordEntry[],
): KnowledgeBasePdf {
  return {
    id: row.id,
    filename: row.filename,
    uploadedAt: row.uploadedAt,
    keywordCount: row.keywordCount,
    keywords,
  };
}

export async function listKnowledgeBasePdfs(): Promise<KnowledgeBasePdf[]> {
  const db = getDb();
  const rows = await db.select().from(schema.kbPdfs);
  const sorted = rows.sort((left, right) =>
    right.uploadedAt.localeCompare(left.uploadedAt),
  );

  const pdfs: KnowledgeBasePdf[] = [];
  for (const row of sorted) {
    const keywords = await listKeywordsForPdf(row.id);
    pdfs.push(toPdfRecord(row, keywords));
  }
  return pdfs;
}

export async function uploadKnowledgeBasePdf(
  filename: string,
  fileBuffer: Buffer,
): Promise<KnowledgeBasePdf> {
  await ensurePdfStorageDir();

  const id = crypto.randomUUID();
  const uploadedAt = new Date().toISOString();
  const storagePath = pdfStoragePath(id);
  await writeFile(storagePath, fileBuffer);

  const text = await extractPdfText(fileBuffer);
  const extracted = extractKeywordsFromText(text);
  const keywords = await replacePdfKeywords(id, filename, extracted);

  const db = getDb();
  await db.insert(schema.kbPdfs).values({
    id,
    filename,
    storagePath,
    uploadedAt,
    keywordCount: keywords.length,
  });

  return {
    id,
    filename,
    uploadedAt,
    keywordCount: keywords.length,
    keywords,
  };
}

export async function reprocessKnowledgeBasePdf(id: string): Promise<KnowledgeBasePdf> {
  const db = getDb();
  const rows = await db.select().from(schema.kbPdfs);
  const row = rows.find((entry) => entry.id === id);
  if (!row) {
    throw new Error("PDF not found.");
  }

  const fileBuffer = await readFile(row.storagePath);
  const text = await extractPdfText(fileBuffer);
  const extracted = extractKeywordsFromText(text);
  const keywords = await replacePdfKeywords(id, row.filename, extracted);

  const allPdfs = await db.select().from(schema.kbPdfs);
  const nextPdfs = allPdfs.map((entry) =>
    entry.id === id
      ? {
          ...entry,
          keywordCount: keywords.length,
        }
      : entry,
  );
  await db.delete(schema.kbPdfs);
  if (nextPdfs.length > 0) {
    await db.insert(schema.kbPdfs).values(nextPdfs);
  }

  return {
    id: row.id,
    filename: row.filename,
    uploadedAt: row.uploadedAt,
    keywordCount: keywords.length,
    keywords,
  };
}

export async function deleteKnowledgeBasePdf(id: string): Promise<void> {
  const db = getDb();
  const rows = await db.select().from(schema.kbPdfs);
  const row = rows.find((entry) => entry.id === id);
  if (!row) {
    throw new Error("PDF not found.");
  }

  await deleteKeywordsForPdf(id);

  const remaining = rows.filter((entry) => entry.id !== id);
  await db.delete(schema.kbPdfs);
  if (remaining.length > 0) {
    await db.insert(schema.kbPdfs).values(remaining);
  }

  try {
    await unlink(row.storagePath);
  } catch {
    // Ignore missing files on disk.
  }
}

async function extractPdfText(fileBuffer: Buffer): Promise<string> {
  const parsed = await pdfParse(fileBuffer);
  return parsed.text ?? "";
}

/** Plain extracted text for preview (reads from stored PDF file). */
export async function getKnowledgeBasePdfPlainText(id: string): Promise<string> {
  const db = getDb();
  const rows = await db.select().from(schema.kbPdfs);
  const row = rows.find((entry) => entry.id === id);
  if (!row) {
    throw new Error("PDF not found.");
  }
  const fileBuffer = await readFile(row.storagePath);
  return extractPdfText(fileBuffer);
}
