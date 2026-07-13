import { useMutation, useQueryClient } from "@tanstack/react-query";

import { settingsService } from "../api/settingsService";
import { queryKeys } from "../constants/queryKeys";

export function useUploadLogo() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (file: File) => settingsService.uploadLogo(file),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.settings.all }),
  });

  return {
    uploadLogo: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}