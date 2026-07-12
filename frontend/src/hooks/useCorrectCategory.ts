import { useMutation, useQueryClient } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

export function useCorrectCategory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, categoryId }: { id: string; categoryId: number }) =>
      incidentService.correctCategory(id, categoryId),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(id) });
    },
  });

  return {
    correctCategory: mutation.mutate,
    correctCategoryAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}