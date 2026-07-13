export interface SimilarIncidentSectionProps {
  hasSearched: boolean;
  isLoading: boolean;

  incident?: {
    id: number;
    ticket: string;
    title: string;
    status: string;
  };

  onViewDetails?: () => void;
  onDismiss?: () => void;
}