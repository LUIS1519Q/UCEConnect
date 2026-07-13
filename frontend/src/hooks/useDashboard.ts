import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { dashboardService } from "../api/dashboardService";
import { queryKeys } from "../constants/queryKeys";
import { mockDashboardResponse } from "../mocks/dashboard";

export function useDashboard() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.dashboard.metrics,
    queryFn: async () => {
      try {
        const result = await dashboardService.getDashboard();
        const isValid = result && typeof result === "object" && "metrics" in result;
        return isValid ? result : mockDashboardResponse;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return mockDashboardResponse;
      }
    },
  });

  return {
    metrics: data?.metrics,
    recentIncidents: data?.recentIncidents ?? [],
    isLoading,
    isError,
    refetch,
  };
}