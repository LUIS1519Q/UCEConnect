import {
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
} from "../../icons";

import { cn } from "../../../../utils/cn";

import type { FileChipProps } from "./FileChip.types";

export default function FileChip({
  fileName,
  fileType = "other",
  className = "",
  ...props
}: FileChipProps) {

  const renderIcon = () => {
    switch (fileType) {
      case "image":
        return (
          <FileImage
            size={18}
            className="text-primary"
          />
        );

      case "pdf":
      case "doc":
      case "docx":
        return (
          <FileText
            size={18}
            className="text-danger"
          />
        );

      case "xls":
      case "xlsx":
        return (
          <FileSpreadsheet
            size={18}
            className="text-success"
          />
        );

      default:
        return (
          <File
            size={18}
            className="text-textSecondary"
          />
        );
    }
  };

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
      {renderIcon()}

      <span className="truncate">
        {fileName}
      </span>
    </div>
  );
}