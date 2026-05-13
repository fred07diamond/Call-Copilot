import { createError, defineEventHandler, readBody } from "h3";
import { recordLearnedCorrection } from "../../../../lib/learned-corrections.js";
import type { LearnedCorrection } from "@shared/transcript";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    originalText?: string;
    correctedText?: string;
  };

  try {
    const correction = await recordLearnedCorrection({
      originalText: body.originalText ?? "",
      correctedText: body.correctedText ?? "",
    });
    return { correction } satisfies { correction: LearnedCorrection };
  } catch (error) {
    throw createError({
      statusCode: 400,
      statusMessage:
        error instanceof Error ? error.message : "Could not save correction.",
    });
  }
});
