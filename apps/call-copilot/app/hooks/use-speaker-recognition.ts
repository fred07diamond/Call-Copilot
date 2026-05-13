import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  SavedSpeakerProfile,
  SpeakerRecognitionSettings,
} from "@shared/speaker";
import { DEFAULT_SPEAKER_RECOGNITION_SETTINGS } from "@shared/speaker";

const EMPTY_SPEAKER_PROFILES: SavedSpeakerProfile[] = [];

async function fetchSpeakerProfiles(): Promise<SavedSpeakerProfile[]> {
  const res = await fetch("/api/call-copilot/speakers");
  if (!res.ok) {
    throw new Error("Could not load speaker profiles.");
  }
  const data = (await res.json()) as { profiles: SavedSpeakerProfile[] };
  return data.profiles ?? [];
}

async function fetchSpeakerSettings(): Promise<SpeakerRecognitionSettings> {
  const res = await fetch("/api/call-copilot/speakers/settings");
  if (!res.ok) {
    throw new Error("Could not load speaker settings.");
  }
  const data = (await res.json()) as { settings: SpeakerRecognitionSettings };
  return data.settings;
}

export function useSpeakerRecognition() {
  const queryClient = useQueryClient();

  const profilesQuery = useQuery({
    queryKey: ["call-copilot", "speaker-profiles"],
    queryFn: fetchSpeakerProfiles,
  });

  const settingsQuery = useQuery({
    queryKey: ["call-copilot", "speaker-settings"],
    queryFn: fetchSpeakerSettings,
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (settings: SpeakerRecognitionSettings) => {
      const res = await fetch("/api/call-copilot/speakers/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) {
        throw new Error("Could not save speaker settings.");
      }
      return (await res.json()) as { settings: SpeakerRecognitionSettings };
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["call-copilot", "speaker-settings"],
        data.settings,
      );
    },
  });

  const renameMutation = useMutation({
    mutationFn: async (input: { id: string; label: string }) => {
      const res = await fetch(`/api/call-copilot/speakers/${input.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ label: input.label }),
      });
      if (!res.ok) {
        throw new Error("Could not rename speaker profile.");
      }
      return (await res.json()) as { profile: SavedSpeakerProfile };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "speaker-profiles"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/call-copilot/speakers/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete speaker profile.");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "speaker-profiles"],
      });
    },
  });

  const upsertMutation = useMutation({
    mutationFn: async (input: {
      id?: string;
      label: string;
      fingerprintJson: string;
    }) => {
      const res = await fetch("/api/call-copilot/speakers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("Could not save speaker profile.");
      }
      return (await res.json()) as { profile: SavedSpeakerProfile };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "speaker-profiles"],
      });
    },
  });

  return {
    profiles: profilesQuery.data ?? EMPTY_SPEAKER_PROFILES,
    settings: settingsQuery.data ?? DEFAULT_SPEAKER_RECOGNITION_SETTINGS,
    isLoading: profilesQuery.isLoading || settingsQuery.isLoading,
    saveSettings: saveSettingsMutation.mutateAsync,
    renameProfile: renameMutation.mutateAsync,
    deleteProfile: deleteMutation.mutateAsync,
    upsertProfile: upsertMutation.mutateAsync,
  };
}
