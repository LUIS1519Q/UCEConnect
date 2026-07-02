import type { EvidenceItemProps } from "../../molecules/EvidenceItem";

export interface EvidenceSectionProps {
  files: EvidenceItemProps[];
  onAddFile?: () => void;
}