import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";
import { mockManagerIncidentDetail } from "../mocks/managerIncidentDetail";

export function useAdminIncidentDetail(id: string) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: async (): Promise<typeof mockManagerIncidentDetail> => {
      try {
        const result = await incidentService.getIncidentById(id);
        const isValid = result && typeof result === "object" && "incident" in result;
        return isValid ? (result as typeof mockManagerIncidentDetail) : mockManagerIncidentDetail;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return mockManagerIncidentDetail;
      }
    },
    enabled: !!id,
  });

  return { data, isLoading, isError, refetch };
}