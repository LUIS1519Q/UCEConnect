import type { AnchorHTMLAttributes } from "react";

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement> {
  underline?: boolean;
}