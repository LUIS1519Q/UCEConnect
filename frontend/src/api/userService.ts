import api from "./client";
import type { GetUsersParams, GetUsersResponse, CreateUserRequest, ManageUserRequest } from "../types/user";

export const userService = {
  async getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
    const query = new URLSearchParams();
    if (params?.role) query.append("role", params.role);
    if (params?.isActive !== undefined) query.append("isActive", String(params.isActive));
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    const response = await api.get<GetUsersResponse>(
      `/api/v1/users${query.toString() ? `?${query.toString()}` : ""}`
    );
    return response.data;
  },

  async createUser(data: CreateUserRequest): Promise<{ message: string; user: { id: number; firstName: string; role: string } }> {
    const response = await api.post("/api/v1/users", data);
    return response.data;
  },

  async manageUser(id: number, data: ManageUserRequest): Promise<{ message: string; user: { id: number; isActive: boolean; role: string } }> {
    const response = await api.patch(`/api/v1/users/${id}/manage`, data);
    return response.data;
  },
};