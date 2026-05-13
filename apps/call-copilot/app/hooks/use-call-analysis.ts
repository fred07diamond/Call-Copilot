import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  CallAnalysisResult,
  CallAnalysisStatusPayload,
  CreateCallAnalysisInput,
  PlaybookDocument,
  PlaybookDocumentType,
  PlaybookDocumentsResponse,
  SavedCallAnalysis,
} from "@shared/call-analysis";

async function fetchPlaybooks(): Promise<PlaybookDocument[]> {
  const res = await fetch("/api/call-copilot/playbooks");
  if (!res.ok) {
    throw new Error("Could not load playbook documents.");
  }
  const data = (await res.json()) as PlaybookDocumentsResponse;
  return data.documents ?? [];
}

export function usePlaybookDocuments() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-copilot", "playbooks"],
    queryFn: fetchPlaybooks,
  });

  const uploadMutation = useMutation({
    mutationFn: async (input: { file: File; documentType: PlaybookDocumentType }) => {
      const formData = new FormData();
      formData.append("file", input.file);
      formData.append("documentType", input.documentType);
      const res = await fetch("/api/call-copilot/playbooks", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Could not upload playbook PDF.");
      }
      return (await res.json()) as { document: PlaybookDocument };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["call-copilot", "playbooks"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/call-copilot/playbooks/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete playbook document.");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["call-copilot", "playbooks"] });
    },
  });

  return {
    documents: query.data ?? [],
    isLoading: query.isLoading,
    uploadDocument: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deleteDocument: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  };
}

async function fetchAnalyses(): Promise<SavedCallAnalysis[]> {
  const res = await fetch("/api/call-copilot/analyses");
  if (!res.ok) {
    throw new Error("Could not load call analyses.");
  }
  const data = (await res.json()) as { analyses: SavedCallAnalysis[] };
  return data.analyses ?? [];
}

async function fetchAnalysis(id: string): Promise<SavedCallAnalysis> {
  const res = await fetch(`/api/call-copilot/analyses/${id}`);
  if (!res.ok) {
    throw new Error("Could not load call analysis.");
  }
  const data = (await res.json()) as { analysis: SavedCallAnalysis };
  return data.analysis;
}

async function fetchAnalysisStatus(id: string): Promise<{ status: CallAnalysisStatusPayload }> {
  const res = await fetch(
    `/api/call-copilot/analysis-status?id=${encodeURIComponent(id)}`,
  );
  if (!res.ok) {
    throw new Error("Could not load analysis status.");
  }
  return (await res.json()) as { status: CallAnalysisStatusPayload };
}

export function useCallAnalysisStatus(analysisId: string | null) {
  return useQuery({
    queryKey: ["call-copilot", "analysis-status", analysisId],
    queryFn: () => fetchAnalysisStatus(analysisId!),
    enabled: Boolean(analysisId),
    refetchInterval: (q) => {
      const status = q.state.data?.status?.status;
      return status === "pending" ? 5_000 : false;
    },
  });
}

export function useCallAnalyses() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-copilot", "analyses"],
    queryFn: fetchAnalyses,
  });

  const createMutation = useMutation({
    mutationFn: async (input: CreateCallAnalysisInput) => {
      const res = await fetch("/api/call-copilot/analyses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(input),
      });
      if (!res.ok) {
        throw new Error("Could not start call analysis.");
      }
      return (await res.json()) as { analysis: SavedCallAnalysis };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["call-copilot", "analyses"] });
    },
  });

  const saveMutation = useMutation({
    mutationFn: async (input: { id: string; result: CallAnalysisResult }) => {
      const res = await fetch(`/api/call-copilot/analyses/${input.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ result: input.result }),
      });
      if (!res.ok) {
        throw new Error("Could not save call analysis.");
      }
      return (await res.json()) as { analysis: SavedCallAnalysis };
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["call-copilot", "analyses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/call-copilot/analyses/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete call analysis.");
      }
    },
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["call-copilot", "analyses"] });
    },
  });

  return {
    analyses: query.data ?? [],
    isLoading: query.isLoading,
    refetchAnalyses: query.refetch,
    createAnalysis: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    saveAnalysis: saveMutation.mutateAsync,
    isSaving: saveMutation.isPending,
    deleteAnalysis: deleteMutation.mutateAsync,
    fetchAnalysis,
  };
}
