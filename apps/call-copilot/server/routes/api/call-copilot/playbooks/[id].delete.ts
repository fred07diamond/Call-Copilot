import { createError, defineEventHandler, getRouterParam } from "h3";
import { deletePlaybookDocument } from "../../../../lib/playbooks.js";

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, "id");
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: "Missing document id." });
  }

  try {
    await deletePlaybookDocument(id);
    return { ok: true };
  } catch (error) {
    throw createError({
      statusCode: 404,
      statusMessage:
        error instanceof Error ? error.message : "Playbook document not found.",
    });
  }
});
