import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";
import { mockManagerIncidents } from "../mocks/managerIncident";
import type { IncidentStatus } from "../types/incident";

export function useManagerIncidents() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState<IncidentStatus | "all">("all");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.incidents.list({
      page,
      limit: 5,
      status: statusFilter === "all" ? undefined : statusFilter,
    }),
    queryFn: () =>
      incidentService
        .getIncidents({
          page,
          limit: 5,
          status: statusFilter === "all" ? undefined : statusFilter,
        })
        .catch(() => mockManagerIncidents),
  });

  return {
    incidents: (data as typeof mockManagerIncidents)?.data ?? [],
    pagination: (data as typeof mockManagerIncidents)?.pagination,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
  };
}