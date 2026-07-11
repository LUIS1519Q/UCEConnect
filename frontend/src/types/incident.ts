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
  description: string;
}

export interface SimilarIncidentResponse {
  similarIncidents: SimilarIncident[];
}

export interface SimilarIncidentDetail {
  id: number;
  title: string;
  description: string;
  status: IncidentStatus;
  statusReason: string | null; 
  updatedAt: string;           
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
  ticket: string;
  aiClassified: boolean;
}

export interface IncidentTimeline {
  id: number;
  status: IncidentStatus;
  changedBy: string;
  statusComment: string;
  changedAt: string;
}

export interface IncidentDetail {
  id: number;
  ticket: string;
  title: string;
  description: string;
  status: IncidentStatus;
  statusReason: string | null;
  priority: string;
  aiSummary: string;
  createdAt: string;
  updatedAt: string;
}

export interface GetIncidentByIdResponse {
  incident: IncidentDetail;
  attachments: IncidentAttachment[];
  conversationCount: number;
  timeline: IncidentTimeline[];
}