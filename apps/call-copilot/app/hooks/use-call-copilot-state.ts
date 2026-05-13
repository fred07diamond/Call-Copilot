import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { agentNativePath } from "@agent-native/core/client";
import {
  SESSION_STATE_KEY,
  type CallSessionState,
  type WatchKeywordEntry,
  type WatchKeywordsResponse,
} from "@shared/call-copilot";

const EMPTY_KEYWORDS: WatchKeywordEntry[] = [];

async function writeAppState<T>(key: string, value: T): Promise<void> {
  await fetch(agentNativePath(`/_agent-native/application-state/${key}`), {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(value),
  });
}

export function useWatchKeywords() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-copilot", "watch-keywords"],
    queryFn: async () => {
      const res = await fetch("/api/call-copilot/keywords");
      if (!res.ok) {
        throw new Error("Could not load watch keywords.");
      }
      const data = (await res.json()) as WatchKeywordsResponse;
      return data.keywords ?? [];
    },
  });

  const mutation = useMutation({
    mutationFn: async (keywords: WatchKeywordEntry[]) => {
      const res = await fetch("/api/call-copilot/keywords", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keywords }),
      });
      if (!res.ok) {
        throw new Error("Could not save watch keywords.");
      }
      return (await res.json()) as WatchKeywordsResponse;
    },
    onSuccess: (data) => {
      queryClient.setQueryData(
        ["call-copilot", "watch-keywords"],
        data.keywords ?? [],
      );
    },
  });

  return {
    keywords: query.data ?? EMPTY_KEYWORDS,
    isLoading: query.isLoading,
    isSuccess: query.isSuccess,
    error: query.error,
    saveKeywords: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}

export function useSessionStateWriter() {
  return useCallback(async (state: CallSessionState) => {
    await writeAppState(SESSION_STATE_KEY, state);
  }, []);
}

const VOICE_PREFS_KEY = "voice-transcription-prefs";

export type VoiceProviderOption =
  | "auto"
  | "deepgram"
  | "google-realtime"
  | "openai"
  | "groq"
  | "browser";

interface VoicePrefs {
  provider?: VoiceProviderOption;
  instructions?: string;
}

export function useVoicePrefs() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-copilot", "voice-prefs"],
    queryFn: async (): Promise<VoicePrefs> => {
      const res = await fetch(
        agentNativePath(`/_agent-native/application-state/${VOICE_PREFS_KEY}`),
      );
      if (!res.ok) return {};
      return (await res.json()) as VoicePrefs;
    },
  });

  const mutation = useMutation({
    mutationFn: async (prefs: VoicePrefs) => {
      await writeAppState(VOICE_PREFS_KEY, prefs);
      return prefs;
    },
    onSuccess: (prefs) => {
      queryClient.setQueryData(["call-copilot", "voice-prefs"], prefs);
    },
  });

  return {
    prefs: query.data ?? {},
    provider: query.data?.provider ?? "deepgram",
    isLoading: query.isLoading,
    savePrefs: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}

export { SESSION_STATE_KEY };
