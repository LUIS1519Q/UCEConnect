import { useMutation, useQueryClient } from "@tanstack/react-query";

import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

export function useAddInternalNote() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      incidentService.addInternalNote(id, note),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(id) });
    },
  });

  return {
    addNote: mutation.mutate,
    addNoteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    isError: mutation.isError,
    error: mutation.error,
  };
}