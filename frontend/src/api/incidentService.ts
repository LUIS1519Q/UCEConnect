import api from "./authService";

export const incidentService = {
  async getIncidents() {
    const response = await api.get("/api/v1/incidents");
    return response.data;
  },

  async createIncident(data: FormData) {
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
};