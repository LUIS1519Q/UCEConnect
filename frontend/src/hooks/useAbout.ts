import { useQuery } from "@tanstack/react-query";

import { contentService } from "../api/contentService";
import { queryKeys } from "../constants/queryKeys";
import { mockAboutResponse } from "../mocks/content";

export function useAbout() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.content.about,
    queryFn: () =>
      contentService.getAbout().catch(() => mockAboutResponse),
  });

  return {
    about: data,
    isLoading,
    isError,
    refetch,
  };
}