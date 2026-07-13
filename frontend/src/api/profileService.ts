import api from "./client";
import type { Profile, UpdateProfileRequest } from "../types/profile";

export const profileService = {
  async getProfile(): Promise<{ user: Profile }> {
    const response = await api.get<{ user: Profile }>("/api/v1/auth/me");
    return response.data;
  },

  async updateProfile(data: UpdateProfileRequest): Promise<{ message: string; user: Profile }> {
    const response = await api.patch<{ message: string; user: Profile }>("/api/v1/auth/me", data);
    return response.data;
  },

  async updateAvatar(file: File): Promise<{ message: string; avatarUrl: string }> {
    const formData = new FormData();
    formData.append("avatar", file);
    const response = await api.patch<{ message: string; avatarUrl: string }>(
      "/api/v1/auth/me/avatar",
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return response.data;
  },
};