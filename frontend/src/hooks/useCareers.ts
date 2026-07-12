import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../api/catalogService";
import { mockCareers } from "../mocks/catalogs";

export function useCareers(facultyId?: number) {
  const query = useQuery({
    queryKey: ["catalogs", "careers", facultyId],
    queryFn: () =>
      catalogService.getCareers(facultyId!).catch(() => ({ data: mockCareers })),
    enabled: !!facultyId,
  });

  return {
    careers: query.data?.data ?? [],
    isLoading: query.isLoading,
  };
}