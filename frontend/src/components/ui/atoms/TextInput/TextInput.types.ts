import type { InputHTMLAttributes } from "react";

export interface TextInputProps
  extends InputHTMLAttributes<HTMLInputElement> {
  fullWidth?: boolean;
}