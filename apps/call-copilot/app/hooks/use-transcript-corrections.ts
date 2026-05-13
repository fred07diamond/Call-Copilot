import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useMemo } from "react";
import type {
  CorrectionRule,
  LearnedCorrection,
  VocabularyCorrection,
} from "@shared/transcript";

interface CorrectionsPayload {
  learned: LearnedCorrection[];
  vocabulary: VocabularyCorrection[];
}

const EMPTY_LEARNED: LearnedCorrection[] = [];
const EMPTY_VOCABULARY: VocabularyCorrection[] = [];
const EMPTY_RULES: CorrectionRule[] = [];

async function fetchCorrections(): Promise<CorrectionsPayload> {
  const res = await fetch("/api/call-copilot/corrections");
  if (!res.ok) {
    throw new Error("Could not load transcript corrections.");
  }
  return (await res.json()) as CorrectionsPayload;
}

export function useTranscriptCorrections() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-copilot", "corrections"],
    queryFn: fetchCorrections,
  });

  const rules = useMemo<CorrectionRule[]>(() => {
    if (!query.data) return EMPTY_RULES;
    return [
      ...query.data.learned.map((entry) => ({
        originalText: entry.originalText,
        correctedText: entry.correctedText,
      })),
      ...query.data.vocabulary.map((entry) => ({
        originalText: entry.originalText,
        correctedText: entry.correctedText,
      })),
    ];
  }, [query.data]);

  const learnMutation = useMutation({
    mutationFn: async (input: { originalText: string; correctedText: string }) => {
      const res = await fetch("/api/call-copilot/corrections/learn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("Could not save learned correction.");
      }
      return (await res.json()) as { correction: LearnedCorrection };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "corrections"],
      });
    },
  });

  const deleteLearnedMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/call-copilot/corrections/learned/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete learned correction.");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "corrections"],
      });
    },
  });

  const saveVocabularyMutation = useMutation({
    mutationFn: async (
      corrections: Array<{ originalText: string; correctedText: string }>,
    ) => {
      const res = await fetch("/api/call-copilot/corrections/vocabulary", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ corrections }),
      });
      if (!res.ok) {
        throw new Error("Could not save vocabulary corrections.");
      }
      return (await res.json()) as { corrections: VocabularyCorrection[] };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["call-copilot", "corrections"],
      });
    },
  });

  return {
    learned: query.data?.learned ?? EMPTY_LEARNED,
    vocabulary: query.data?.vocabulary ?? EMPTY_VOCABULARY,
    rules,
    isLoading: query.isLoading,
    learnCorrection: learnMutation.mutateAsync,
    deleteLearnedCorrection: deleteLearnedMutation.mutateAsync,
    saveManualVocabulary: saveVocabularyMutation.mutateAsync,
    isSavingVocabulary: saveVocabularyMutation.isPending,
  };
}
