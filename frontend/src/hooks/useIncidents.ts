import { useMemo, useState } from "react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

import type { GetIncidentsResponse, IncidentStatus } from "../types/incident";
import { mockIncidents } from "../mocks/incidents";

const DEFAULT_PAGE_SIZE = 5;

const FALLBACK_PAGINATION = {
  page: 1,
  limit: 50,
  total: mockIncidents.length,
};

export function useMyIncidents() {
  const [statusFilter, setStatusFilterState] = useState<IncidentStatus | "all">("all");
  const [search, setSearchState] = useState("");
  const [page, setPage] = useState(1);

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.incidents.list({ limit: 50 }),
    queryFn: async (): Promise<GetIncidentsResponse> => {
      try {
        const result = await incidentService.getIncidents({ limit: 50 });
        const isValid = result && Array.isArray(result.data);
        return isValid
          ? result
          : { data: mockIncidents, pagination: FALLBACK_PAGINATION };
      } catch (err) {
        if (axios.isAxiosError(err) && err.response) {
          throw err;
        }
        return { data: mockIncidents, pagination: FALLBACK_PAGINATION };
      }
    },
  });

  const filteredIncidents = useMemo(() => {
    const list = data?.data ?? mockIncidents;
    const value = search.trim().toLowerCase();

    return list.filter((incident) => {
      const matchesStatus =
        statusFilter === "all" ? true : incident.status === statusFilter;

      const matchesSearch =
        incident.ticket.toLowerCase().includes(value) ||
        incident.title.toLowerCase().includes(value);

      return matchesStatus && matchesSearch;
    });
  }, [data, statusFilter, search]);

  const incidents = useMemo(() => {
    const start = (page - 1) * DEFAULT_PAGE_SIZE;
    return filteredIncidents.slice(start, start + DEFAULT_PAGE_SIZE);
  }, [filteredIncidents, page]);

  const totalPages = useMemo(() => {
    return Math.max(1, Math.ceil(filteredIncidents.length / DEFAULT_PAGE_SIZE));
  }, [filteredIncidents]);

  function setStatusFilter(status: IncidentStatus | "all") {
    setStatusFilterState(status);
    setPage(1);
  }

  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
  }

  return {
    incidents,
    currentPage: page,
    totalPages,
    setCurrentPage: setPage,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    isLoading,
    isError,
    refetch,
  };
}