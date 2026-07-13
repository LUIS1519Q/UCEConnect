import { useQuery } from "@tanstack/react-query";
import { profileService } from "../api/profileService";
import { queryKeys } from "../constants/queryKeys";
import { mockProfile } from "../mocks/profile";

export function useProfile() {
  const query = useQuery({
    queryKey: queryKeys.profile.me,
    queryFn: () =>
      profileService.getProfile().catch(() => ({ user: mockProfile })),
  });

  return {
    profile: query.data?.user,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}