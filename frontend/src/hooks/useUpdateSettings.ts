import { useMutation, useQueryClient } from "@tanstack/react-query";

import { settingsService } from "../api/settingsService";
import { queryKeys } from "../constants/queryKeys";

import type { UpdateSettingsRequest } from "../types/settings";

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: UpdateSettingsRequest) => settingsService.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings.all });
    },
  });

  return {
    updateSettings: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}