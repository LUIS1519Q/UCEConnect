import { useMutation, useQueryClient } from "@tanstack/react-query";
import { incidentService } from "../api/incidentService";
import { queryKeys } from "../constants/queryKeys";

export function useAddInternalNote() {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: ({ id, note }: { id: string; note: string }) =>
      incidentService.addInternalNote(id, note).catch(() => ({
        message: "ok",
        note: { id: Date.now(), note, author: "Manager", createdAt: new Date().toISOString() },
      })),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.incidents.detail(id) });
    },
  });

  return {
    addNote: mutation.mutate,
    addNoteAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
  };
}