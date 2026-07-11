import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";
import { getMockIncidentDetail } from "../mocks/incidentDetail";

import type { GetIncidentByIdResponse } from "../types/incident";

export function useIncidentDetail(id: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.incidents.detail(String(id)),
    queryFn: async (): Promise<GetIncidentByIdResponse> => {
      try {
        const result = await incidentService.getIncidentById(id);
        const isValid = result && typeof result === "object" && "incident" in result;
        return isValid ? result : getMockIncidentDetail(id);
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return getMockIncidentDetail(id);
      }
    },
    enabled: !!id,
  });

  return {
    data,
    isLoading,
    isError,
    refetch,
  };
}