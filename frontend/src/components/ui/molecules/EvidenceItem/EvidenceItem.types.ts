import type { FileType } from "../../atoms/FileChip/";

export interface EvidenceItemProps {
  fileName: string;
  fileType?: FileType;
  fileSize?: string;
  onClick?: () => void;
  onRemove?: () => void;
}