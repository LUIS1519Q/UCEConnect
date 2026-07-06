import type { HTMLAttributes } from "react";

export type FileType =
  | "pdf"
  | "doc"
  | "docx"
  | "xls"
  | "xlsx"
  | "image"
  | "other";

export interface FileChipProps
  extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
  fileType?: FileType;
}