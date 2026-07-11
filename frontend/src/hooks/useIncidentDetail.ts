import { useQuery } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";
import { mockIncidentDetail } from "../mocks/incidentDetail";

export function useIncidentDetail(id: string) {
  const query = useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: () =>
      incidentService
        .getIncidentById(id)
        .catch(() => mockIncidentDetail),
    enabled: !!id,
  });

  return {
    data: query.data as typeof mockIncidentDetail | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}