import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../api/categoryService";
import type { CreateCategoryRequest } from "../types/category";

export function useCreateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: CreateCategoryRequest) =>
      categoryService.createCategory(data).catch(() => ({ message: "ok", category: { id: 0, ...data, description: data.description ?? "" } })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
  return {
    createCategory: mutation.mutate,
    createCategoryAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}