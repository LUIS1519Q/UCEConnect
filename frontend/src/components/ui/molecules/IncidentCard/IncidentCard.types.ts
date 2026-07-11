import type { IncidentStatus } from "../../../../types/incident";

export interface IncidentCardProps {
  id: number;
  ticket: string;
  title: string;
  category?: string;
  status: IncidentStatus;
  createdAt: string;
  onClick?: () => void;
}