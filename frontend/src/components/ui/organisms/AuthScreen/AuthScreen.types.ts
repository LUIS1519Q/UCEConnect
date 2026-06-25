import type { ReactNode } from "react";
import type { LogoVariant } from "../../atoms/Logo";

export interface AuthScreenProps {
  title: string;
  subtitle: string;
  logoVariant?: LogoVariant;
  children: ReactNode;
}