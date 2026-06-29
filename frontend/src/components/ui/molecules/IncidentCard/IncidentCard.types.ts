export interface IncidentCardProps {
  title: string;
  location: string;
  status: "open" | "inProgress" | "resolved" | "rejected";
  createdAt: string;
  onClick?: () => void;
}