import {
  File,
  FileImage,
  FileSpreadsheet,
  FileText,
  FileVideo,
} from "../../icons";

import { cn } from "../../../../utils/cn";

import type {
  FileChipProps,
  FileType,
} from "./FileChip.types";

export default function FileChip({
  fileName,
  fileType = "other",
  className = "",
  ...props
}: FileChipProps) {

  const extension =
    fileName.split(".").pop()?.toLowerCase();

  const detectedType: FileType =
    fileType !== "other"
      ? fileType
      : extension === "pdf"
      ? "pdf"
      : extension === "doc"
      ? "doc"
      : extension === "docx"
      ? "docx"
      : extension === "xls"
      ? "xls"
      : extension === "xlsx"
      ? "xlsx"
      : extension === "ppt"
      ? "ppt"
      : extension === "pptx"
      ? "pptx"
      : ["jpg", "jpeg", "png", "gif", "webp"].includes(
          extension ?? ""
        )
      ? "image"
      : ["mp4", "mov", "avi", "mkv", "webm"].includes(
          extension ?? ""
        )
      ? "video"
      : ["zip", "rar", "7z"].includes(
          extension ?? ""
        )
      ? "zip"
      : "other";

  const renderIcon = () => {
    switch (detectedType) {

      case "image":
        return (
          <FileImage
            size={16}
            className="shrink-0 text-primary"
          />
        );

      case "video":
        return (
          <FileVideo
            size={16}
            className="shrink-0 text-violet-500"
          />
        );

      case "pdf":
        return (
          <FileText
            size={16}
            className="shrink-0 text-danger"
          />
        );

      case "doc":
      case "docx":
        return (
          <FileText
            size={16}
            className="shrink-0 text-blue-600"
          />
        );

      case "xls":
      case "xlsx":
        return (
          <FileSpreadsheet
            size={16}
            className="shrink-0 text-success"
          />
        );

      case "ppt":
      case "pptx":
        return (
          <FileText
            size={16}
            className="shrink-0 text-orange-500"
          />
        );

      case "zip":
        return (
          <File
            size={16}
            className="shrink-0 text-amber-500"
          />
        );

      default:
        return (
          <File
            size={16}
            className="shrink-0 text-textSecondary"
          />
        );
    }
  };

  const shortenFileName = (name: string) => {

    if (name.length <= 18) {
      return name;
    }

    const dotIndex = name.lastIndexOf(".");

    if (dotIndex === -1) {
      return `${name.slice(0, 12)}...`;
    }

    const baseName = name.slice(0, dotIndex);
    const ext = name.slice(dotIndex);

    return `${baseName.slice(0, 10)}...${ext}`;
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

      <span
        className="
          max-w-[120px]
          truncate
          whitespace-nowrap
          sm:max-w-[150px]
          lg:max-w-[170px]
        "
        title={fileName}
      >
        {shortenFileName(fileName)}
      </span>
    </div>
  );
}