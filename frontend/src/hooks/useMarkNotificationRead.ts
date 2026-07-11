import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

import { notificationService } from "../api/notificationService";
import { queryKeys } from "../constants/queryKeys";

export function useMarkNotificationRead() {
    const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) =>
      notificationService.markAsRead(id).catch(() => undefined),
    onSuccess: () => {
       queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all });
     },
  });

  return {
    markAsRead: mutation.mutate,
  };
}