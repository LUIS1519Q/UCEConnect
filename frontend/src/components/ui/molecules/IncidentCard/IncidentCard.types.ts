export interface IncidentCardProps {
  id: string;
  title: string;
  location: string;
  status: "open" | "inProgress" | "resolved" | "rejected";
  createdAt: string;
  onClick?: () => void;
}