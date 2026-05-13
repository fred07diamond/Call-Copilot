import { defineEventHandler } from "h3";
import { listSavedSpeakerProfiles } from "../../../lib/speaker-profiles.js";
import type { SavedSpeakerProfilesResponse } from "@shared/speaker";

export default defineEventHandler(async () => {
  const profiles = await listSavedSpeakerProfiles();
  return { profiles } satisfies SavedSpeakerProfilesResponse;
});
