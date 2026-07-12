import api from "./client";
import type { AppSettings, UpdateSettingsRequest, FAQItem, CreateFAQRequest, UpdateFAQRequest } from "../types/settings";

export const settingsService = {
  async getSettings(): Promise<AppSettings> {
    const response = await api.get<AppSettings>("/api/v1/settings");
    return response.data;
  },

  async updateSettings(data: UpdateSettingsRequest): Promise<{ message: string; settings: AppSettings }> {
    const response = await api.patch("/api/v1/settings", data);
    return response.data;
  },

  async uploadLogo(file: File): Promise<{ message: string; logoUrl: string }> {
    const formData = new FormData();
    formData.append("logo", file);
    const response = await api.post("/api/v1/settings/logo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  async getFAQItems(): Promise<{ items: FAQItem[] }> {
    const response = await api.get<{ items: FAQItem[] }>("/api/v1/help");
    return response.data;
  },

  async createFAQItem(data: CreateFAQRequest): Promise<{ message: string; item: FAQItem }> {
    const response = await api.post("/api/v1/faq", data);
    return response.data;
  },

  async updateFAQItem(id: number, data: UpdateFAQRequest): Promise<{ message: string; item: FAQItem }> {
    const response = await api.patch(`/api/v1/faq/${id}`, data);
    return response.data;
  },

  async deleteFAQItem(id: number): Promise<{ message: string }> {
    const response = await api.delete(`/api/v1/faq/${id}`);
    return response.data;
  },
};