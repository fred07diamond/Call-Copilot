import { createError, defineEventHandler } from "h3";

export default defineEventHandler(() => {
  const key = process.env.DEEPGRAM_API_KEY?.trim();
  if (!key) {
    throw createError({
      statusCode: 500,
      message: "DEEPGRAM_API_KEY not configured",
    });
  }
  return { key };
});
