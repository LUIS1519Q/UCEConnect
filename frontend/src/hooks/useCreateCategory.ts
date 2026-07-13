import { useMutation, useQueryClient } from "@tanstack/react-query";

import { categoryService } from "../api/categoryService";
import { queryKeys } from "../constants/queryKeys";

import type { CreateCategoryRequest } from "../types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) => categoryService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories.all });
    },
  });

  return {
    createCategory: mutation.mutate,
    createCategoryAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}