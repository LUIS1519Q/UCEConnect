import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";

import { queryKeys } from "../constants/queryKeys";

import type {
  IncidentStatus,
} from "../types/incident";
import { mockIncidents } from "../mocks/incidents";

const DEFAULT_PAGE_SIZE = 5;

export function useMyIncidents() {
  const [statusFilter, setStatusFilterState] = useState<
    IncidentStatus | "all"
  >("all");

  const [search, setSearchState] =
    useState("");

  const [page, setPage] = useState(1);

  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: queryKeys.incidents.list({
      limit: 50,
    }),

    queryFn: () =>
      incidentService.getIncidents({
        limit: 50,
      }),
  });

  const filteredIncidents = useMemo(() => {
    const list = Array.isArray(data?.data)
      ? data.data
      :mockIncidents;
      //: [];

    const value = search
      .trim()
      .toLowerCase();

    return list.filter((incident) => {
      const matchesStatus =
        statusFilter === "all"
          ? true
          : incident.status ===
            statusFilter;

      const matchesSearch =
        incident.ticket
          .toLowerCase()
          .includes(value) ||
        incident.title
          .toLowerCase()
          .includes(value) ||
        incident.category
          .toLowerCase()
          .includes(value);

      return (
        matchesStatus &&
        matchesSearch
      );
    });
  }, [data, statusFilter, search]);

  const incidents = useMemo(() => {
    const start =
      (page - 1) *
      DEFAULT_PAGE_SIZE;

    return filteredIncidents.slice(
      start,
      start + DEFAULT_PAGE_SIZE
    );
  }, [filteredIncidents, page]);

  const totalPages = useMemo(() => {
    return Math.max(
      1,
      Math.ceil(
        filteredIncidents.length /
          DEFAULT_PAGE_SIZE
      )
    );
  }, [filteredIncidents]);

  function setStatusFilter(
    status: IncidentStatus | "all"
  ) {
    setStatusFilterState(status);
    setPage(1);
  }

  function setSearch(
    value: string
  ) {
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