import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "../api/dashboardService";
import { queryKeys } from "../constants/queryKeys";
import { mockDashboardResponse } from "../mocks/dashboard";

export function useDashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: () =>
      dashboardService.getDashboard().catch(() => mockDashboardResponse),
  });

  return {
    metrics: data?.metrics,
    recentIncidents: data?.recentIncidents ?? [],
    isLoading,
    isError,
    refetch,
  };
}