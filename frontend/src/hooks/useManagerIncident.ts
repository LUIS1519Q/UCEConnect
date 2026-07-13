import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

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
    queryFn: async (): Promise<typeof mockManagerIncidents> => {
      try {
        const result = await incidentService.getIncidents({
          page,
          limit: 5,
          status: statusFilter === "all" ? undefined : statusFilter,
        });

        const isValid = result && Array.isArray((result as typeof mockManagerIncidents).data);
        return isValid ? (result as typeof mockManagerIncidents) : mockManagerIncidents;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return mockManagerIncidents;
      }
    },
  });

  const allIncidents = data?.data ?? [];

  const searchValue = search.trim().toLowerCase();

  const incidents = allIncidents.filter((incident) => {
    const matchesStatus =
      statusFilter === "all" ? true : incident.status === statusFilter;

    const matchesSearch = searchValue
      ? incident.ticket.toLowerCase().includes(searchValue) ||
        incident.title.toLowerCase().includes(searchValue)
      : true;

    return matchesStatus && matchesSearch;
  });

  return {
    incidents,
    pagination: data?.pagination,
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