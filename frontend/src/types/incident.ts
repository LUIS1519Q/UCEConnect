import type { PaginatedResponse } from "./common";

export type IncidentStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "cancelled";

export interface IncidentSummary {
  id: number;
  ticket: string;
  title: string;
  category: string;
  status: IncidentStatus;
  createdAt: string;
}

export interface GetIncidentsParams {
  status?: IncidentStatus;
  categoryId?: number;
  page?: number;
  limit?: number;
}

export type GetIncidentsResponse =
  PaginatedResponse<IncidentSummary>;

export interface CreateIncidentRequest {
  title: string;
  description: string;
}

export interface SimilarIncident {
  id: number;
  title: string;
}

export interface SimilarIncidentRequest {
  title: string;
  description?: string;
}

export interface SimilarIncidentResponse {
  data: SimilarIncident[];
}

export interface SimilarIncidentDetail {
  id: number;
  ticket: string;
  title: string;
  description: string;
  status: IncidentStatus;
  createdAt: string;
  resolution?: string;
}

export interface GetSimilarIncidentResponse {
  incident: SimilarIncidentDetail;
}

export interface IncidentAttachment {
  id: number;
  fileName: string;
  fileType: string;
  url: string;
}

export interface CreatedIncident {
  id: number;
  title: string;
  description: string;
  status: IncidentStatus;
  priority: string;
  aiSummary: string;
  duplicateWarning: boolean;
  similarIncidents: SimilarIncident[];
  attachments: IncidentAttachment[];
  createdAt: string;
}

export interface CreateIncidentResponse {
  message: string;
  incident: CreatedIncident;
}