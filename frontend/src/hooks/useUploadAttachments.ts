import { useMutation, useQueryClient } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

export function useUploadAttachments(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (files: File[]) =>
      incidentService.uploadAttachments(Number(id), files),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.detail(id),
      });
    },
  });

  return {
    uploadAttachmentsAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}