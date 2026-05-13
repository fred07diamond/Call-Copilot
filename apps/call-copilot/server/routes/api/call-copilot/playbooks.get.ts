import { defineEventHandler } from "h3";
import { listPlaybookDocuments } from "../../../lib/playbooks.js";
import type { PlaybookDocumentsResponse } from "@shared/call-analysis";

export default defineEventHandler(async () => {
  const documents = await listPlaybookDocuments();
  return { documents } satisfies PlaybookDocumentsResponse;
});
