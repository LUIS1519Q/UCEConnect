import type { InputHTMLAttributes } from "react";

export interface OTPInputProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> {
  length?: number;
  value?: string[];
  onChange?: (value: string[]) => void;
}