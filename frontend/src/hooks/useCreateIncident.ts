import { useMutation } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";

import type { CreateIncidentForm } from "../schemas/student/createIncidentSchema";

import { mockCreateIncidentResponse } from "../mocks/createIncident";

export function useCreateIncident() {
  const mutation = useMutation({
    mutationFn: async (
        data: CreateIncidentForm
    ) => {

    const response =
        await incidentService.createIncident({
            title: data.title,
            description: data.description,
        })
        .catch(() => mockCreateIncidentResponse(data));

    if (
        data.files.length > 0
    ) {
        await incidentService.uploadAttachments(
            response.incident.id,
            data.files
        )
        .catch(() => undefined);
    }

    return response;
    },
  });

  return {
    createIncident: mutation.mutate,

    createIncidentAsync:
      mutation.mutateAsync,

    incident: mutation.data,

    isPending: mutation.isPending,

    isSuccess: mutation.isSuccess,

    isError: mutation.isError,

    error: mutation.error,

    reset: mutation.reset,
  };
}