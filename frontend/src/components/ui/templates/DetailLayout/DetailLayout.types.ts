import type { ReactNode } from "react";

export interface DetailLayoutProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
  actions?: ReactNode;
}