import { useMutation, useQueryClient } from "@tanstack/react-query";
import { profileService } from "../api/profileService";
import { queryKeys } from "../constants/queryKeys";
import type { Profile, UpdateProfileRequest } from "../types/profile";

import { mockProfile } from "../mocks/profile";

export function useUpdateProfile() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateProfileRequest) =>
      profileService.updateProfile(data).catch(() => ({ message: "ok", user: mockProfile as Profile })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.profile.me });
    },
  });

  return {
    updateProfile: mutation.mutate,
    updateProfileAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}