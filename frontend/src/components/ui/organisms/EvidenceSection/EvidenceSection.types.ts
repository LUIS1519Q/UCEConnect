import type { EvidenceItemProps } from "../../molecules/EvidenceItem";

export interface EvidenceSectionProps {
  title?: string;
  files: EvidenceItemProps[];
  emptyMessage?: string;
  onAddFile?: () => void;

  onDrop?: (
    event: React.DragEvent<HTMLDivElement>
  ) => void;

  onDragOver?: (
    event: React.DragEvent<HTMLDivElement>
  ) => void;
}