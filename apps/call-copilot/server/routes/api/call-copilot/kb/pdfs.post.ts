import { createError, defineEventHandler, readMultipartFormData } from "h3";
import { uploadKnowledgeBasePdf } from "../../../../lib/knowledge-base.js";
import type { KnowledgeBasePdf } from "@shared/call-copilot";

export default defineEventHandler(async (event) => {
  const parts = await readMultipartFormData(event);
  const filePart = parts?.find((part) => part.name === "file");

  if (!filePart?.data?.length) {
    throw createError({
      statusCode: 400,
      statusMessage: "A PDF file is required.",
    });
  }

  const filename = filePart.filename?.trim() || "upload.pdf";
  if (!filename.toLowerCase().endsWith(".pdf")) {
    throw createError({
      statusCode: 400,
      statusMessage: "Only PDF files are supported.",
    });
  }

  const pdf = await uploadKnowledgeBasePdf(
    filename,
    Buffer.from(filePart.data),
  );
  return { pdf } satisfies { pdf: KnowledgeBasePdf };
});
