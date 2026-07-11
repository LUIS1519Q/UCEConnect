import { useMutation, useQueryClient } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

import type { EditIncidentForm } from "../schemas/student/editIncidentSchema";

export function useUpdateIncident(id: string) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data: EditIncidentForm) =>
      incidentService.updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.detail(id),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.incidents.all,
      });
    },
  });

  return {
    updateIncident: mutation.mutate,
    updateIncidentAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}