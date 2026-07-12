import api from "./client";

import { API_ENDPOINTS } from "../constants/apiEndpoints";

import type {
  GetIncidentsParams,
  GetIncidentsResponse,
} from "../types/incident";

export const incidentService = {
  async getIncidents(
    params?: GetIncidentsParams
  ): Promise<GetIncidentsResponse> {

    const query = new URLSearchParams();

    if (params?.status) {
      query.append("status", params.status);
    }

    if (params?.categoryId) {
      query.append(
        "category_id",
        String(params.categoryId)
      );
    }

    if (params?.page) {
      query.append("page", String(params.page));
    }

    if (params?.limit) {
      query.append("limit", String(params.limit));
    }

    const response =
      await api.get<GetIncidentsResponse>(
        `${API_ENDPOINTS.incidents.base}${
          query.toString()
            ? `?${query.toString()}`
            : ""
        }`
      );

    return response.data;
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