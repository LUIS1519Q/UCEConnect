import { useQuery } from "@tanstack/react-query";
import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";
import { mockManagerIncidentDetail } from "../mocks/managerIncidentDetail";

export function useManagerIncidentDetail(id: string) {
  const query = useQuery({
    queryKey: queryKeys.incidents.detail(id),
    queryFn: () =>
      incidentService
        .getIncidentById(id)
        .catch(() => mockManagerIncidentDetail),
    enabled: !!id,
  });

  return {
    data: query.data as typeof mockManagerIncidentDetail | undefined,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}