import { createError, defineEventHandler } from "h3";
import { listKnowledgeBasePdfs } from "../../../../lib/knowledge-base.js";
import type { KnowledgeBasePdfsResponse } from "@shared/call-copilot";

export default defineEventHandler(async () => {
  const pdfs = await listKnowledgeBasePdfs();
  return { pdfs } satisfies KnowledgeBasePdfsResponse;
});
