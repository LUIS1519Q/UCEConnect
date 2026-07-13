import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { contentService } from "../api/contentService";
import { queryKeys } from "../constants/queryKeys";
import { mockAboutResponse } from "../mocks/content";

export function useAbout() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.content.about,
    queryFn: async () => {
      try {
        const result = await contentService.getAbout();
        const isValid = result && typeof result === "object" && "applicationName" in result;
        return isValid ? result : mockAboutResponse;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return mockAboutResponse;
      }
    },
  });

  return {
    about: data,
    isLoading,
    isError,
    refetch,
  };
}