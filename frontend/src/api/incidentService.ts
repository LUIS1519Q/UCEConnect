import api from "./client";

import { API_ENDPOINTS } from "../constants/apiEndpoints";

import type {
  CreateIncidentRequest,
  CreateIncidentResponse,
  GetIncidentsParams,
  GetIncidentsResponse,
  SimilarIncidentRequest,
  SimilarIncidentResponse,
  GetSimilarIncidentResponse,
  IncidentAttachment,
  GetIncidentByIdResponse,
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


  async createIncident(
    data: CreateIncidentRequest
  ): Promise<CreateIncidentResponse> {
    const response =
      await api.post<CreateIncidentResponse>(
        API_ENDPOINTS.incidents.base,
        data
      );

    return response.data;
  },

  async findSimilarIncident(
    data: SimilarIncidentRequest
  ): Promise<SimilarIncidentResponse> {

    const response =
      await api.post<SimilarIncidentResponse>(
        `${API_ENDPOINTS.incidents.base}/similar`,
        data
      );

    return response.data;
  },

  async getSimilarIncident(
    incidentId: number
  ): Promise<GetSimilarIncidentResponse> {

    const response =
      await api.get<GetSimilarIncidentResponse>(
        `${API_ENDPOINTS.incidents.base}/${incidentId}/similar`
      );

    return response.data;
  },

  async uploadAttachments(
    incidentId: number,
    files: File[]
  ): Promise<IncidentAttachment[]> {

    const formData = new FormData();

    files.forEach((file) => {
      formData.append("files", file);
    });

    const response = await api.post<{
      message: string;
      attachments: IncidentAttachment[];
    }>(
      `${API_ENDPOINTS.incidents.base}/${incidentId}/attachments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return response.data.attachments;
  },

  async getIncidentById(id: string): Promise<GetIncidentByIdResponse> {
    const response = await api.get<GetIncidentByIdResponse>(
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
    data: { title?: string; description?: string }
  ) {
    const response = await api.patch(`/api/v1/incidents/${id}`, data);
    return response.data;
  },

    async cancelIncident(id: number) {
      const response = await api.patch(
        `/api/v1/incidents/${id}/cancel`
      );

      return response.data;
    },
};