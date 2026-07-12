import { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { notificationService } from "../api/notificationService";
import { queryKeys } from "../constants/queryKeys";
import { mockNotifications } from "../mocks/notifications";
import type { AppNotification } from "../types/notification";

const PAGE_SIZE = 5;

export function useNotifications() {
  const [page, setPage] = useState(1);
  const [accumulated, setAccumulated] = useState<AppNotification[]>([]);
  const [search, setSearchState] = useState("");
  const [filter, setFilterState] = useState<"all" | "unread">("all");

  const isUnread = filter === "unread";

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: queryKeys.notifications.list({
      page,
      limit: PAGE_SIZE,
      unread: isUnread ? true : undefined,
    }),
    queryFn: () =>
      notificationService
        .getNotifications({
          page,
          limit: PAGE_SIZE,
          unread: isUnread ? true : undefined,
        })
        .catch(() => {
          const filtered = isUnread
            ? mockNotifications.filter((n) => !n.read)
            : mockNotifications;
          return {
            data: filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
            pagination: { page, limit: PAGE_SIZE, total: filtered.length },
          };
        }),
  });

  const { data: unreadData } = useQuery({
    queryKey: queryKeys.notifications.list({ page: 1, limit: 1, unread: true }),
    queryFn: () =>
      notificationService
        .getNotifications({ page: 1, limit: 1, unread: true })
        .catch(() => ({
          data: [],
          pagination: {
            page: 1,
            limit: 1,
            total: mockNotifications.filter((n) => !n.read).length,
          },
        })),
  });

  const unreadCount = unreadData?.pagination.total ?? 0;

  const allNotifications = useMemo(
    (): AppNotification[] =>
      page === 1
        ? data?.data ?? []
        : [...accumulated, ...(data?.data ?? [])],
    [page, data, accumulated]
  );

  const notifications = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return allNotifications;
    return allNotifications.filter(
      (n) =>
        n.title.toLowerCase().includes(value) ||
        n.ticket.toLowerCase().includes(value)
    );
  }, [allNotifications, search]);

  const hasMore = data
    ? allNotifications.length < data.pagination.total
    : false;

  const loadMore = useCallback(() => {
    if (data) {
      setAccumulated((prev) => [...prev, ...data.data]);
    }
    setPage((prev) => prev + 1);
  }, [data]);

  function setFilter(value: "all" | "unread") {
    setFilterState(value);
    setPage(1);
    setAccumulated([]);
  }

  function setSearch(value: string) {
    setSearchState(value);
    setPage(1);
    setAccumulated([]);
  }

  return {
    notifications,
    hasMore,
    isLoading,
    isError,
    refetch,
    loadMore,
    search,
    setSearch,
    filter,
    setFilter,
    unreadCount,
  };
}