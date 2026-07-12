import { useMutation } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";

import { mockSimilarIncidentResponse } from "../mocks/similarIncident";

import type { SimilarIncidentRequest } from "../types/incident";

export function useSimilarIncident() {
  const mutation = useMutation({
  //mutationFn: incidentService.findSimilarIncident,
  mutationFn: (data: SimilarIncidentRequest) => incidentService.findSimilarIncident(data).catch(() => mockSimilarIncidentResponse),
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