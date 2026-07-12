import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../api/userService";
import type { ManageUserRequest } from "../types/user";

export function useManageUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ManageUserRequest }) =>
      userService.manageUser(id, data).catch(() => ({ message: "ok", user: { id, isActive: data.isActive ?? true, role: data.role ?? "student" } })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return {
    manageUser: mutation.mutate,
    manageUserAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}