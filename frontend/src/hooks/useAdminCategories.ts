import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { categoryService } from "../api/categoryService";
import { mockAdminCategories } from "../mocks/adminCategories";

export function useAdminCategories() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "categories", { page }],
    queryFn: () =>
      categoryService.getCategories({ page, limit: 5 })
        .catch(() => mockAdminCategories),
  });

  const filtered = (data?.data ?? []).filter((c) =>
    search ? c.name.toLowerCase().includes(search.toLowerCase()) : true
  );

  return {
    categories: filtered,
    pagination: data?.pagination,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    search,
    setSearch,
  };
}