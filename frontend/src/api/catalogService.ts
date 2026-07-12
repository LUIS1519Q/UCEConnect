import api from "./client";
import type { Faculty, Career } from "../types/profile";

export const catalogService = {
  async getFaculties(): Promise<{ data: Faculty[] }> {
    const response = await api.get<{ data: Faculty[] }>("/api/v1/faculties");
    return response.data;
  },

  async getCareers(facultyId: number): Promise<{ data: Career[] }> {
    const response = await api.get<{ data: Career[] }>(`/api/v1/careers?facultyId=${facultyId}`);
    return response.data;
  },
};