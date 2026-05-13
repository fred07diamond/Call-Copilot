export interface SavedSpeakerProfile {
  id: string;
  label: string;
  fingerprintJson: string;
  callCount: number;
  createdAt: string;
  updatedAt: string;
}

export type SpeakerLabelingFrequencySeconds = 15 | 30 | 60;

export interface SpeakerRecognitionSettings {
  autoLabelSpeakers: boolean;
  labelingFrequencySeconds: SpeakerLabelingFrequencySeconds;
  callContextHint: string;
  runFinalPassOnSave: boolean;
}

export interface SavedSpeakerProfilesResponse {
  profiles: SavedSpeakerProfile[];
}

export interface SpeakerRecognitionSettingsResponse {
  settings: SpeakerRecognitionSettings;
}

export const DEFAULT_SPEAKER_RECOGNITION_SETTINGS: SpeakerRecognitionSettings = {
  autoLabelSpeakers: true,
  labelingFrequencySeconds: 30,
  callContextHint: "",
  runFinalPassOnSave: true,
};
