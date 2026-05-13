import { createError, defineEventHandler, getRouterParam } from "h3";
import { deleteKnowledgeBasePdf } from "../../../../../lib/knowledge-base.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: "PDF id is required.",
    });
  }

  try {
    await deleteKnowledgeBasePdf(id);
    return { ok: true };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "PDF could not be deleted.",
    });
  }
});
