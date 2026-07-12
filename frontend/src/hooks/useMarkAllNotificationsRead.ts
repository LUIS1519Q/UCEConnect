import { useMutation, useQueryClient } from "@tanstack/react-query";
import { notificationService } from "../api/notificationService";
import { queryKeys } from "../constants/queryKeys";
import type { AppNotification } from "../types/notification";

export function useMarkAllNotificationsRead() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (notifications: AppNotification[]) => {
      const unread = notifications.filter((n) => !n.read);
      await Promise.allSettled(
        unread.map((n) => notificationService.markAsRead(n.id))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
    },
  });

  return {
    markAllAsRead: mutation.mutate,
    isPending: mutation.isPending,
  };
}