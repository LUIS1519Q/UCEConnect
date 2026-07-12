import { Button } from "../../atoms/Button";

import { EvidenceItem } from "../../molecules/EvidenceItem";

import type { EvidenceSectionProps } from "./EvidenceSection.types";

export default function EvidenceSection({
  title = "Evidence",
  files,
  emptyMessage = "No evidence attached.",
  onAddFile,
}: EvidenceSectionProps) {
  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-textPrimary">
          {title}
        </h3>

        {onAddFile && (
          <Button
            variant="link"
            size="sm"
            onClick={onAddFile}
          >
           + Add evidence
          </Button>
        )}
      </div>

      {files.length === 0 ? (
        <p className="text-sm text-textSecondary">
          {emptyMessage}
        </p>
      ) : (
        <div className="space-y-3">
          {files.map((file, index) => (
            <EvidenceItem
              key={`${file.fileName}-${index}`}
              {...file}
            />
          ))}
        </div>
      )}
    </section>
  );
}