export type LogoVariant =
  | "horizontal-color"
  | "horizontal-white"
  | "horizontal-dark"
  | "vertical-color"
  | "vertical-white"
  | "vertical-dark"
  | "isotype-color"
  | "isotype-white"
  | "isotype-dark"
  | "horizontal-slogan-color"
  | "horizontal-slogan-white";

export interface LogoProps {
  variant?: LogoVariant;
  className?: string;
}