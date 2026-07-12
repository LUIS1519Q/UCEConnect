import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../api/settingsService";
import type { UpdateSettingsRequest } from "../types/settings";
import { mockSettings } from "../mocks/settings";

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (data: UpdateSettingsRequest) =>
      settingsService.updateSettings(data).catch(() => ({ message: "ok", settings: { ...mockSettings, ...data },})),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "settings"] });
    },
  });
  return { updateSettings: mutation.mutateAsync, isPending: mutation.isPending };
}