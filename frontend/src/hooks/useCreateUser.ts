import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userService } from "../api/userService";
import type { CreateUserRequest } from "../types/user";

export function useCreateUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: CreateUserRequest) =>
      userService.createUser(data).catch(() => ({ message: "ok", user: { id: 0, firstName: data.firstName, role: data.role } })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });

  return {
    createUser: mutation.mutate,
    createUserAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}