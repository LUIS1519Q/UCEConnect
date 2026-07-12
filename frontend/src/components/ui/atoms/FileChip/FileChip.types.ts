import type { HTMLAttributes } from "react";

export interface FileChipProps
  extends HTMLAttributes<HTMLDivElement> {
  fileName: string;
}