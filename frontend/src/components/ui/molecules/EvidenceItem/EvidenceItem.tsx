import { Trash2 } from "../../icons";

import { Button } from "../../atoms/Button";
import { FileChip } from "../../atoms/FileChip";

import type { EvidenceItemProps } from "./EvidenceItem.types";

export default function EvidenceItem({
  fileName,
  onRemove,
}: EvidenceItemProps) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-border bg-surface p-3">
      <FileChip fileName={fileName} />

      {onRemove && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRemove}
          aria-label="Remove file"
        >
          <Trash2 size={18} />
        </Button>
      )}
    </div>
  );
}