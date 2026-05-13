import { createError, defineEventHandler, getRouterParam } from "h3";
import { reprocessKnowledgeBasePdf } from "../../../../../../lib/knowledge-base.js";
import type { KnowledgeBasePdf } from "@shared/call-copilot";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "PDF id is required.",
    });
  }

  try {
    const pdf = await reprocessKnowledgeBasePdf(id);
    return { pdf } satisfies { pdf: KnowledgeBasePdf };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "PDF could not be reprocessed.",
    });
  }
});
