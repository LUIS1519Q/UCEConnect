import { useQuery } from "@tanstack/react-query";

import { contentService } from "../api/contentService";
import { queryKeys } from "../constants/queryKeys";
import { mockHelpResponse } from "../mocks/content";

export function useHelp() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.content.help,
    queryFn: () =>
      contentService.getHelp().catch(() => mockHelpResponse),
  });

  return {
    faqs: data?.faqs ?? [],
    supportEmail: data?.supportEmail,
    isLoading,
    isError,
    refetch,
  };
}