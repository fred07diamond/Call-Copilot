import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  KnowledgeBasePdf,
  KnowledgeBasePdfsResponse,
} from "@shared/call-copilot";

async function fetchPdfs(): Promise<KnowledgeBasePdf[]> {
  const res = await fetch("/api/call-copilot/kb/pdfs");
  if (!res.ok) {
    throw new Error("Could not load knowledge base PDFs.");
  }
  const data = (await res.json()) as KnowledgeBasePdfsResponse;
  return data.pdfs ?? [];
}

export function useKnowledgeBasePdfs() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["call-copilot", "kb-pdfs"],
    queryFn: fetchPdfs,
  });

  const invalidate = async () => {
    await queryClient.invalidateQueries({ queryKey: ["call-copilot", "kb-pdfs"] });
    await queryClient.invalidateQueries({
      queryKey: ["call-copilot", "watch-keywords"],
    });
  };

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/call-copilot/kb/pdfs", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        throw new Error("Could not upload PDF.");
      }
      return (await res.json()) as { pdf: KnowledgeBasePdf };
    },
    onSuccess: () => {
      void invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/call-copilot/kb/pdfs/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Could not delete PDF.");
      }
    },
    onSuccess: () => {
      void invalidate();
    },
  });

  const reprocessMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/call-copilot/kb/pdfs/${id}/reprocess`, {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error("Could not reprocess PDF.");
      }
      return (await res.json()) as { pdf: KnowledgeBasePdf };
    },
    onSuccess: () => {
      void invalidate();
    },
  });

  return {
    pdfs: query.data ?? [],
    isLoading: query.isLoading,
    error: query.error,
    uploadPdf: uploadMutation.mutateAsync,
    isUploading: uploadMutation.isPending,
    deletePdf: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
    reprocessPdf: reprocessMutation.mutateAsync,
    isReprocessing: reprocessMutation.isPending,
  };
}
