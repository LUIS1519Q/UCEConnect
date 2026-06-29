import type { TextInputProps } from "../../atoms";

export type PasswordInputProps = Omit<
  TextInputProps,
  "type"
>;