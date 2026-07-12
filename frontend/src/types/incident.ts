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