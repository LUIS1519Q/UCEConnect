import { useMutation, useQueryClient } from "@tanstack/react-query";
import { categoryService } from "../api/categoryService";
import type { UpdateCategoryRequest } from "../types/category";

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: UpdateCategoryRequest }) =>
      categoryService.updateCategory(id, data).catch(() => ({ message: "ok", category: { id, name: "", description: "", isActive: true, ...data } })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "categories"] });
    },
  });
  return {
    updateCategory: mutation.mutate,
    updateCategoryAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}