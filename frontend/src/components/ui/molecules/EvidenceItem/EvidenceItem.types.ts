import type { FileType } from "../../atoms/FileChip/";

export interface EvidenceItemProps {
  fileName: string;
  fileType?: FileType;
  onClick?: () => void;
  onRemove?: () => void;
}