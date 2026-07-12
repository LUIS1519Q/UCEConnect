export interface SimilarIncidentModalProps {
  open: boolean;

  incident: {
    ticket: string;
    title: string;
    date: string;
    status: string;
    resolution: string;
  } | null;

  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;

  onClose: () => void;
}