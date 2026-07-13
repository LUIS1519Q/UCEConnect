import { useQuery } from "@tanstack/react-query";
import { settingsService } from "../api/settingsService";
import { mockSettings } from "../mocks/settings";

export function useSettings() {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "settings"],
    queryFn: () => settingsService.getSettings().catch(() => mockSettings),
  });

  return { settings: data, isLoading, isError, refetch };
}