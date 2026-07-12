import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import axios from "axios";

import { settingsService } from "../api/settingsService";
import { queryKeys } from "../constants/queryKeys";
import { mockFAQItems } from "../mocks/settings";

import type { CreateFAQRequest, UpdateFAQRequest } from "../types/settings";

export function useAdminFAQ() {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.faq.all,
    queryFn: async () => {
      try {
        const result = await settingsService.getFAQItems();
        const isValid = result && Array.isArray(result.items);
        return isValid ? result : { items: mockFAQItems };
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return { items: mockFAQItems };
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: CreateFAQRequest) => settingsService.createFAQItem(data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.faq.all }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateFAQRequest }) =>
      settingsService.updateFAQItem(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.faq.all }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => settingsService.deleteFAQItem(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.faq.all }),
  });

  return {
    faqItems: data?.items ?? [],
    isLoading,
    isError,
    refetch,
    createFAQ: createMutation.mutateAsync,
    updateFAQ: updateMutation.mutateAsync,
    deleteFAQ: deleteMutation.mutateAsync,
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}