import type { ReactNode } from "react";

export interface ProfileLayoutProps {
  title: string;
  children: ReactNode;
  sidebar?: ReactNode;
}