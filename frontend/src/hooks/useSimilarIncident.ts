import { useMutation } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";

import type { SimilarIncidentRequest } from "../types/incident";

export function useSimilarIncident() {
  const mutation = useMutation({
    mutationFn: (data: SimilarIncidentRequest) =>
      incidentService.findSimilarIncident(data),
  });

  return {
    findSimilar: mutation.mutate,
    findSimilarAsync: mutation.mutateAsync,
    data: mutation.data,
    isPending: mutation.isPending,
    isSuccess: mutation.isSuccess,
    isError: mutation.isError,
    error: mutation.error,
    reset: mutation.reset,
  };
}