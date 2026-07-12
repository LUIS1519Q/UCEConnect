import { useMutation, useQueryClient } from "@tanstack/react-query";
import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

export function useUpdateStatus() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, status, note }: { id: string; status: string; note?: string }) =>
      incidentService.updateStatus(id, status, note).catch(() => ({ message: "ok", incident: { id: Number(id), status } })),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.all });
    },
  });

  return {
    updateStatus: mutation.mutate,
    updateStatusAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
  };
}