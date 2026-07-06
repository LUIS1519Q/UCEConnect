import { EvidenceItem } from "../../molecules/EvidenceItem";

import type { EvidenceSectionProps } from "./EvidenceSection.types";

export default function EvidenceSection({
  files,
}: EvidenceSectionProps) {
  return (
    <div className="space-y-3">
      {files.map((file, index) => (
        <EvidenceItem
          key={`${file.fileName}-${index}`}
          {...file}
        />
      ))}
    </div>
  );
}