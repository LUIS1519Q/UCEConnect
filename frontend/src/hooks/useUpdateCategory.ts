import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryService } from "../api/categoryService";
import { queryKeys } from "../constants/queryKeys";

import type { UpdateCategoryRequest } from "../types/category";

export function useUpdateCategory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoryService.updateCategory(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  return {
    updateCategory: mutation.mutate,
    updateCategoryAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}