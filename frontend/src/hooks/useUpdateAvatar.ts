import { useMutation, useQueryClient } from "@tanstack/react-query";

import { profileService } from "../api/profileService";
import { queryKeys } from "../constants/queryKeys";

export function useUpdateAvatar() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => profileService.updateAvatar(file),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });

  return {
    updateAvatar: mutation.mutate,
    updateAvatarAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}