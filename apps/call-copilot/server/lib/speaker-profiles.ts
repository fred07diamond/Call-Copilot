import type { SavedSpeakerProfile, SpeakerRecognitionSettings } from "@shared/speaker";
import { DEFAULT_SPEAKER_RECOGNITION_SETTINGS } from "@shared/speaker";
import { getDb, schema } from "../db/index.js";

const SETTINGS_ID = "default";
const LABELING_FREQUENCY_SECONDS = new Set([15, 30, 60]);

function toSavedProfile(
  row: typeof schema.speakerProfiles.$inferSelect,
): SavedSpeakerProfile {
  return {
    id: row.id,
    label: row.label,
    fingerprintJson: row.fingerprintJson,
    callCount: row.callCount,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

function normalizeLabelingFrequencySeconds(
  value: number | null | undefined,
): SpeakerRecognitionSettings["labelingFrequencySeconds"] {
  if (value === 15 || value === 30 || value === 60) {
    return value;
  }
  return DEFAULT_SPEAKER_RECOGNITION_SETTINGS.labelingFrequencySeconds;
}

function toSpeakerSettings(
  row: typeof schema.speakerSettings.$inferSelect | undefined,
): SpeakerRecognitionSettings {
  if (!row) {
    return DEFAULT_SPEAKER_RECOGNITION_SETTINGS;
  }

  return {
    autoLabelSpeakers:
      row.autoLabelEnabled === undefined
        ? DEFAULT_SPEAKER_RECOGNITION_SETTINGS.autoLabelSpeakers
        : row.autoLabelEnabled === 1,
    labelingFrequencySeconds: normalizeLabelingFrequencySeconds(
      row.labelingFrequencySeconds,
    ),
    callContextHint: row.callContextHint ?? "",
    runFinalPassOnSave:
      row.runFinalPassOnSave === undefined
        ? DEFAULT_SPEAKER_RECOGNITION_SETTINGS.runFinalPassOnSave
        : row.runFinalPassOnSave === 1,
  };
}

export async function listSavedSpeakerProfiles(): Promise<SavedSpeakerProfile[]> {
  const db = getDb();
  const rows = await db.select().from(schema.speakerProfiles);
  return rows
    .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))
    .map(toSavedProfile);
}

export async function upsertSavedSpeakerProfile(input: {
  id?: string;
  label: string;
  fingerprintJson: string;
}): Promise<SavedSpeakerProfile> {
  const db = getDb();
  const rows = await db.select().from(schema.speakerProfiles);
  const now = new Date().toISOString();
  const existing = input.id ? rows.find((row) => row.id === input.id) : null;
  const row = {
    id: existing?.id ?? input.id ?? crypto.randomUUID(),
    label: input.label.trim(),
    fingerprintJson: input.fingerprintJson,
    callCount: existing ? existing.callCount + 1 : 1,
    createdAt: existing?.createdAt ?? now,
    updatedAt: now,
  };

  const next = existing
    ? rows.map((entry) => (entry.id === row.id ? row : entry))
    : [...rows, row];
  await db.delete(schema.speakerProfiles);
  if (next.length > 0) {
    await db.insert(schema.speakerProfiles).values(next);
  }
  return toSavedProfile(row);
}

export async function renameSavedSpeakerProfile(
  id: string,
  label: string,
): Promise<SavedSpeakerProfile> {
  const db = getDb();
  const rows = await db.select().from(schema.speakerProfiles);
  const current = rows.find((row) => row.id === id);
  if (!current) {
    throw new Error("Speaker profile not found.");
  }
  const next = rows.map((row) =>
    row.id === id
      ? { ...row, label: label.trim(), updatedAt: new Date().toISOString() }
      : row,
  );
  await db.delete(schema.speakerProfiles);
  await db.insert(schema.speakerProfiles).values(next);
  const updated = next.find((row) => row.id === id);
  if (!updated) {
    throw new Error("Speaker profile not found after rename.");
  }
  return toSavedProfile(updated);
}

export async function deleteSavedSpeakerProfile(id: string): Promise<void> {
  const db = getDb();
  const rows = await db.select().from(schema.speakerProfiles);
  const remaining = rows.filter((row) => row.id !== id);
  if (remaining.length === rows.length) {
    throw new Error("Speaker profile not found.");
  }
  await db.delete(schema.speakerProfiles);
  if (remaining.length > 0) {
    await db.insert(schema.speakerProfiles).values(remaining);
  }
}

export async function getSpeakerRecognitionSettings(): Promise<SpeakerRecognitionSettings> {
  const db = getDb();
  const rows = await db.select().from(schema.speakerSettings);
  return toSpeakerSettings(rows.find((entry) => entry.id === SETTINGS_ID));
}

export async function saveSpeakerRecognitionSettings(
  settings: SpeakerRecognitionSettings,
): Promise<SpeakerRecognitionSettings> {
  const db = getDb();
  const rows = await db.select().from(schema.speakerSettings);
  const existing = rows.find((entry) => entry.id === SETTINGS_ID);
  const now = new Date().toISOString();
  const frequency = LABELING_FREQUENCY_SECONDS.has(settings.labelingFrequencySeconds)
    ? settings.labelingFrequencySeconds
    : DEFAULT_SPEAKER_RECOGNITION_SETTINGS.labelingFrequencySeconds;
  const row = {
    id: SETTINGS_ID,
    sensitivity: existing?.sensitivity ?? 55,
    calibrationEnabled: existing?.calibrationEnabled ?? 0,
    autoLabelEnabled: settings.autoLabelSpeakers ? 1 : 0,
    labelingFrequencySeconds: frequency,
    callContextHint: settings.callContextHint.trim(),
    runFinalPassOnSave: settings.runFinalPassOnSave ? 1 : 0,
    updatedAt: now,
  };
  const next = rows.some((entry) => entry.id === SETTINGS_ID)
    ? rows.map((entry) => (entry.id === SETTINGS_ID ? row : entry))
    : [...rows, row];
  await db.delete(schema.speakerSettings);
  await db.insert(schema.speakerSettings).values(next);
  return getSpeakerRecognitionSettings();
}
