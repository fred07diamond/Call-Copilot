import { defineEventHandler } from "h3";
import { getSpeakerRecognitionSettings } from "../../../../lib/speaker-profiles.js";
import type { SpeakerRecognitionSettingsResponse } from "@shared/speaker";

export default defineEventHandler(async () => {
  const settings = await getSpeakerRecognitionSettings();
  return { settings } satisfies SpeakerRecognitionSettingsResponse;
});
