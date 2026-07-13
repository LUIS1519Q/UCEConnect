import { useMutation, useQueryClient } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

export function useCancelIncident() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) =>
      incidentService.cancelIncident(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.all,
      });
    },
  });

  return {
    cancelIncident: mutation.mutate,
    cancelIncidentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}