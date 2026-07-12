import { FileText } from "lucide-react";

import { cn } from "../../../../utils/cn";

import type { FileChipProps } from "./FileChip.types";

export default function FileChip({
  fileName,
  className = "",
  ...props
}: FileChipProps) {
  return (
    <div
      className={cn(
        `
        inline-flex
        items-center
        gap-2
        rounded-xl
        border
        border-border
        bg-surface
        px-3
        py-2
        text-sm
        text-textPrimary
        shadow-sm
        `,
        className
      )}
      {...props}
    >
      <FileText
        size={18}
        className="text-primary"
      />

      <span className="truncate">
        {fileName}
      </span>
    </div>
  );
}