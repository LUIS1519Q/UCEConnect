import { useQuery } from "@tanstack/react-query";
import { catalogService } from "../api/catalogService";
import { mockFaculties } from "../mocks/catalogs";

export function useFaculties() {
  const query = useQuery({
    queryKey: ["catalogs", "faculties"],
    queryFn: () =>
      catalogService.getFaculties().catch(() => ({ data: mockFaculties })),
  });

  return {
    faculties: query.data?.data ?? [],
    isLoading: query.isLoading,
  };
}
