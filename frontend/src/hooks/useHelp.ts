import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { contentService } from "../api/contentService";
import { queryKeys } from "../constants/queryKeys";
import { mockHelpResponse } from "../mocks/content";

export function useHelp() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.content.help,
    queryFn: async () => {
      try {
        const result = await contentService.getHelp();
        const isValid = result && Array.isArray(result.items);
        return isValid ? result : mockHelpResponse;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return mockHelpResponse;
      }
    },
  });

  return {
    items: data?.items ?? [],
    supportEmail: data?.supportEmail,
    isLoading,
    isError,
    refetch,
  };
}