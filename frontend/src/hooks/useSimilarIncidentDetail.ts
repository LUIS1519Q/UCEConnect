import { useQuery } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

import { mockSimilarIncidentDetail } from "../mocks/similarIncident";

export function useSimilarIncidentDetail(
  incidentId?: number
) {
  const query = useQuery({
    queryKey: queryKeys.incidents.similarDetail(
      incidentId ?? 0
    ),

    queryFn: () =>
      incidentService
        .getSimilarIncident(incidentId!)
        .catch(() => mockSimilarIncidentDetail),

    enabled: !!incidentId,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    refetch: query.refetch,
  };
}