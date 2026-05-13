import { createError, defineEventHandler, readMultipartFormData } from "h3";
import { uploadPlaybookDocument } from "../../../lib/playbooks.js";
import {
  isPlaybookDocumentType,
  type PlaybookDocument,
} from "@shared/call-analysis";

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const filePart = parts?.find((part) => part.name === "file");
  const documentTypePart = parts?.find((part) => part.name === "documentType");

  if (!filePart?.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "A PDF file is required.",
    });
  }

  const filename = filePart.filename?.trim() || "playbook.pdf";
  if (!filename.toLowerCase().endsWith(".pdf")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Only PDF files are supported.",
    });
  }

  const documentType = documentTypePart?.data
    ? new TextDecoder().decode(documentTypePart.data).trim()
    : "";
  if (!isPlaybookDocumentType(documentType)) {
    throw createError({
      statusCode: 400,
      statusMessage: "A valid playbook document type is required.",
    });
  }

  const document = await uploadPlaybookDocument({
    filename,
    fileBuffer: Buffer.from(filePart.data),
    documentType,
  });

  return { document } satisfies { document: PlaybookDocument };
});
