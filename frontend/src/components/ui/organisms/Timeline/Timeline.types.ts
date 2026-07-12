export interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
}

export interface TimelineProps {
  items: TimelineItem[];
}