import { createError, defineEventHandler, readBody } from "h3";
import { upsertSavedSpeakerProfile } from "../../../lib/speaker-profiles.js";
import type { SavedSpeakerProfile } from "@shared/speaker";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as {
    id?: string;
    label?: string;
    fingerprintJson?: string;
  };
  if (!body.label?.trim() || !body.fingerprintJson?.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "label and fingerprintJson are required.",
    });
  }
  const profile = await upsertSavedSpeakerProfile({
    id: body.id,
    label: body.label,
    fingerprintJson: body.fingerprintJson,
  });
  return { profile } satisfies { profile: SavedSpeakerProfile };
});
