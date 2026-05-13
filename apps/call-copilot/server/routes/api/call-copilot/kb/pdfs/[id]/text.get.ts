import { createError, defineEventHandler, getRouterParam } from "h3";
import { getKnowledgeBasePdfPlainText } from "../../../../../../lib/knowledge-base.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id")?.trim();
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing PDF id." });
  }
  try {
    const text = await getKnowledgeBasePdfPlainText(id);
    return { text } satisfies { text: string };
  } catch {
    throw createError({ statusCode: 404, statusMessage: "PDF not found." });
  }
});
