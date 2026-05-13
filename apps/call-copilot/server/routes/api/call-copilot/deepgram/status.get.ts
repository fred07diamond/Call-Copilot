import { defineEventHandler } from "h3";

export default defineEventHandler(() => ({
  configured: Boolean(process.env.DEEPGRAM_API_KEY?.trim()),
}));
