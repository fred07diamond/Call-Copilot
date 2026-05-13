import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { SavedTranscript, TranscriptSegment } from "@shared/transcript";

async function fetchTranscripts(): Promise<SavedTranscript[]> {
  const res = await fetch("/api/call-copilot/transcripts");
  if (!res.ok) {
    throw new Error("Could not load saved transcripts.");
  }
  const data = (await res.json()) as { transcripts: SavedTranscript[] };
  return data.transcripts ?? [];
}

export function useSavedTranscripts() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-copilot", "saved-transcripts"],
    queryFn: fetchTranscripts,
  });

  const saveMutation = useMutation({
    mutationFn: async (input: {
      sessionName: string;
      segments: TranscriptSegment[];
    }) => {
      const res = await fetch("/api/call-copilot/transcripts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("Could not save transcript.");
      }
      return (await res.json()) as { transcript: SavedTranscript };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "saved-transcripts"],
      });
    },
  });

  const renameMutation = useMutation({
    mutationFn: async (input: { id: string; sessionName: string }) => {
      const res = await fetch(`/api/call-copilot/transcripts/${input.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionName: input.sessionName }),
      });
      if (!res.ok) {
        throw new Error("Could not rename transcript.");
      }
      return (await res.json()) as { transcript: SavedTranscript };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "saved-transcripts"],
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/call-copilot/transcripts/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete transcript.");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "saved-transcripts"],
      });
    },
  });

  return {
    transcripts: query.data ?? [],
    isLoading: query.isLoading,
    saveTranscript: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    renameTranscript: renameMutation.mutateAsync,
    deleteTranscript: deleteMutation.mutateAsync,
  };
}
