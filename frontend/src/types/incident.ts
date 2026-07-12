import type { PaginatedResponse } from "./common";

export type IncidentStatus =
  | "open"
  | "in_progress"
  | "resolved"
  | "rejected"
  | "cancelled";

export type IncidentPriority = "low" | "medium" | "high";

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

export interface Incident {
  id: number;
  ticket: string;
  title: string;
  description: string;
  status: IncidentStatus;
  statusReason: string | null;
  priority: IncidentPriority;
  aiSummary: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface IncidentAttachment {
  id: number;
  fileName: string;
  fileUrl: string;
}

export interface IncidentTimelineEntry {
  id: number;
  status: IncidentStatus;
  changedBy: string;
  statusComment: string;
  changedAt: string;
}

export interface GetIncidentByIdResponse {
  incident: Incident;
  attachments: IncidentAttachment[];
  conversationCount: number;
  timeline: IncidentTimelineEntry[];
}

export interface ManagerIncidentSummary {
  id: number;
  ticket: string;
  title: string;
  student: string;
  category: string;
  status: IncidentStatus;
  createdAt: string;
}

export interface GetManagerIncidentsParams {
  status?: IncidentStatus;
  categoryId?: number;
  page?: number;
  limit?: number;
  search?: string;
}

export type GetManagerIncidentsResponse = PaginatedResponse<ManagerIncidentSummary>;

export interface InternalNote {
  id: number;
  note: string;
  author: string;
  createdAt: string;
}

export interface Observation {
  id: number;
  authorId: number;
  authorName: string;
  authorRole: string;
  message: string;
  createdAt: string;
}

export interface GetManagerIncidentByIdResponse {
  incident: Incident;
  attachments: IncidentAttachment[];
  conversationCount: number;
  timeline: IncidentTimelineEntry[];
  internalNotes?: InternalNote[];
}