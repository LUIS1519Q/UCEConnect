import { Plus } from "../../icons";

import { Button } from "../../atoms/Button";
import { EvidenceItem } from "../../molecules/EvidenceItem";

import type { EvidenceSectionProps } from "./EvidenceSection.types";

export default function EvidenceSection({
  files,
  onAddFile,
}: EvidenceSectionProps) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-textPrimary">
          Evidence
        </h2>

        <Button
          variant="primary"
          size="sm"
          onClick={onAddFile}
        >
          <Plus size={18} className="mr-2" />
          Add File
        </Button>
      </div>

      <div className="space-y-3">
        {files.map((file, index) => (
          <EvidenceItem
            key={`${file.fileName}-${index}`}
            {...file}
          />
        ))}
      </div>
    </div>
  );
}