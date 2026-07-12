import api from "./client";
import type { GetCategoriesResponse, CreateCategoryRequest, UpdateCategoryRequest, Category } from "../types/category";

export const categoryService = {
  async getCategories(params?: { page?: number; limit?: number }): Promise<GetCategoriesResponse> {
    const query = new URLSearchParams();
    if (params?.page) query.append("page", String(params.page));
    if (params?.limit) query.append("limit", String(params.limit));
    const response = await api.get<GetCategoriesResponse>(
      `/api/v1/categories${query.toString() ? `?${query.toString()}` : ""}`
    );
    return response.data;
  },

  async createCategory(data: CreateCategoryRequest): Promise<{ message: string; category: Category }> {
    const response = await api.post("/api/v1/categories", data);
    return response.data;
  },

  async updateCategory(id: number, data: UpdateCategoryRequest): Promise<{ message: string; category: Category }> {
    const response = await api.patch(`/api/v1/categories/${id}`, data);
    return response.data;
  },
};