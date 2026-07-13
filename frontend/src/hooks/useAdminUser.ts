import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { userService } from "../api/userService";
import { mockAdminUsers } from "../mocks/adminUsers";
import type { Role } from "../types/user";

export function useAdminUsers() {
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<Role | "all">("all");
  const [search, setSearch] = useState("");

    const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["admin", "users", { page, role: roleFilter }],
    queryFn: () =>
        userService.getUsers({
        page,
        limit: 5,
        role: roleFilter === "all" ? undefined : roleFilter,
        }).catch(() => ({
        ...mockAdminUsers,
        data: roleFilter === "all"
            ? mockAdminUsers.data
            : mockAdminUsers.data.filter((u) => u.role === roleFilter),
        })),
    });

  return {
    users: data?.data ?? [],
    pagination: data?.pagination,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    roleFilter,
    setRoleFilter,
    search,
    setSearch,
  };
}