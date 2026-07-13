import { useMutation, useQueryClient } from "@tanstack/react-query";

import { userService } from "../api/userService";
import { queryKeys } from "../constants/queryKeys";

import type { ManageUserRequest } from "../types/user";

export function useManageUser() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: ManageUserRequest }) =>
      userService.manageUser(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.users.all });
    },
  });

  return {
    manageUser: mutation.mutate,
    manageUserAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}