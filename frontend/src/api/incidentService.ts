import api from "./authService";

export const incidentService = {
  async getIncidents(params?: { status?: string; categoryId?: number }) {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.categoryId) query.append("category_id", String(params.categoryId));
    const queryString = query.toString();

    const response = await api.get(
      `/api/v1/incidents${queryString ? `?${queryString}` : ""}`
    );

    return response.data.data;
  },

  async createIncident(data: {
    title: string;
    description: string;
    categoryId: number;
  }) {
    const response = await api.post(
      "/api/v1/incidents",
      data
    );

    return response.data;
  },

  async getIncidentById(id: string) {
    const response = await api.get(
      `/api/v1/incidents/${id}`
    );

    return response.data;
  },

  async updateIncidentStatus(
    id: string,
    status: string
  ) {
    const response = await api.patch(
      `/api/v1/incidents/${id}/status`,
      { status }
    );

    return response.data;
  },

  async updateIncident(
    id: string,
    data: {
      title: string;
      description: string;
      categoryId: number;
    }
  ) {
    const response = await api.patch(
      `/api/v1/incidents/${id}`,
      data
    );

    return response.data;
  },

  async cancelIncident(id: number) {
    const response = await api.patch(
      `/api/v1/incidents/${id}/cancel`
    );

    return response.data;
  },
};