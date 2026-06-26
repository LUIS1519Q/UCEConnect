import type { ButtonHTMLAttributes } from "react";

export interface SocialButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  provider: "microsoft";
}