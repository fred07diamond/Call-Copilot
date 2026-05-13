import { defineEventHandler, readBody } from "h3";
import { saveSpeakerRecognitionSettings } from "../../../../lib/speaker-profiles.js";
import type {
  SpeakerRecognitionSettings,
  SpeakerRecognitionSettingsResponse,
} from "@shared/speaker";
import { DEFAULT_SPEAKER_RECOGNITION_SETTINGS } from "@shared/speaker";

export default defineEventHandler(async (event) => {
  const body = (await readBody(event)) as Partial<SpeakerRecognitionSettings>;
  const settings = await saveSpeakerRecognitionSettings({
    autoLabelSpeakers:
      typeof body.autoLabelSpeakers === "boolean"
        ? body.autoLabelSpeakers
        : DEFAULT_SPEAKER_RECOGNITION_SETTINGS.autoLabelSpeakers,
    labelingFrequencySeconds:
      body.labelingFrequencySeconds === 15 ||
      body.labelingFrequencySeconds === 30 ||
      body.labelingFrequencySeconds === 60
        ? body.labelingFrequencySeconds
        : DEFAULT_SPEAKER_RECOGNITION_SETTINGS.labelingFrequencySeconds,
    callContextHint:
      typeof body.callContextHint === "string"
        ? body.callContextHint
        : DEFAULT_SPEAKER_RECOGNITION_SETTINGS.callContextHint,
    runFinalPassOnSave:
      typeof body.runFinalPassOnSave === "boolean"
        ? body.runFinalPassOnSave
        : DEFAULT_SPEAKER_RECOGNITION_SETTINGS.runFinalPassOnSave,
  });
  return { settings } satisfies SpeakerRecognitionSettingsResponse;
});
