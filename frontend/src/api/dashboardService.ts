import api from "./client";

import type { GetDashboardResponse } from "../types/dashboard";

export const dashboardService = {
  async getDashboard(): Promise<GetDashboardResponse> {
    const response = await api.get<GetDashboardResponse>("/api/v1/dashboard");
    return response.data;
  },
};