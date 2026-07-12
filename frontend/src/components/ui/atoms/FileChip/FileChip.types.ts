import type { HTMLAttributes } from "react";

export type FileType =
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "ppt"
  | "pptx"
  | "image"
  | "video"
  | "zip"
  | "other";

export interface FileChipProps
  extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
  fileType?: FileType;
}