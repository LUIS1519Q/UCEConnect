import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useMutation } from "@tanstack/react-query";
import { settingsService } from "../api/settingsService";
import { mockFAQItems } from "../mocks/settings";
import type { CreateFAQRequest, UpdateFAQRequest } from "../types/settings";

export function useAdminFAQ() {
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["admin", "faq"],
    queryFn: () =>
      settingsService.getFAQItems().catch(() => ({ items: mockFAQItems })),
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateFAQRequest) =>
      settingsService.createFAQItem(data).catch(() => ({ message: "ok", item: { id: Date.now(), ...data } })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "faq"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFAQRequest }) =>
      settingsService.updateFAQItem(id, data).catch(() => ({ message: "ok", item: { id, question: "", answer: "", order: 0, ...data } })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "faq"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) =>
      settingsService.deleteFAQItem(id).catch(() => ({ message: "ok" })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "faq"] }),
  });

  return {
    faqItems: data?.items ?? [],
    isLoading,
    refetch,
    createFAQ: createMutation.mutateAsync,
    updateFAQ: updateMutation.mutateAsync,
    deleteFAQ: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}