import type { IncidentStatus } from "./incident";

export interface DashboardMetrics {
  total: number;
  open: number;
  in_progress: number;
  resolved: number;
  rejected: number;
  cancelled: number;
}

export interface RecentIncident {
  id: number;
  ticket: string;
  title: string;
  status: IncidentStatus;
  createdAt: string;
}

export interface GetDashboardResponse {
  metrics: DashboardMetrics;
  recentIncidents: RecentIncident[];
}