import { useQuery } from "@tanstack/react-query";

import { notificationService } from "../api/notificationService";
import { queryKeys } from "../constants/queryKeys";
import { mockNotifications } from "../mocks/notifications";

export function useUnreadNotificationsCount() {
  const { data } = useQuery({
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
    refetchInterval: 30000,
  });

  return data?.pagination.total ?? 0;
}