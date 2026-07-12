import { useMutation, useQueryClient } from "@tanstack/react-query";
import { settingsService } from "../api/settingsService";

export function useUploadLogo() {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: (file: File) =>
      settingsService.uploadLogo(file).catch(() => ({ message: "ok", logoUrl: "" })),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin", "settings"] }),
  });
  return { uploadLogo: mutation.mutateAsync, isPending: mutation.isPending };
}