import { X } from "../../icons";

import { Button } from "../../atoms/Button";
import { FileChip } from "../../atoms/FileChip";

import type { EvidenceItemProps } from "./EvidenceItem.types";

export default function EvidenceItem({
  fileName,
  fileType = "other",
  onClick,
  onRemove,
}: EvidenceItemProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-2
        rounded-full
        border
        border-border
        bg-background
        px-2.5
        py-1.5
      "
    >
      <div
        className="cursor-pointer"
        onClick={onClick}
      >
        <FileChip
          fileName={fileName}
          fileType={fileType}
        />
      </div>

      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          aria-label="Remove file"
        >
          <X size={14} />
        </Button>
      )}

    </div>
  );
}