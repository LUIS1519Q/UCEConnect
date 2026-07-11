export interface SimilarIncidentBannerProps {
  incident: {
    ticket: string;
    title: string;
    status: string;
  };

  onViewDetails?: () => void;
  onDismiss?: () => void;
}