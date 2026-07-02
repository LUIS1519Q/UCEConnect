import type { ReactNode } from "react";

export interface FormLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  actions?: ReactNode;
}