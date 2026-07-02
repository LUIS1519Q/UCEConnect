import type { ReactNode } from "react";

export interface DashboardLayoutProps {
  header: ReactNode;
  sidebar?: ReactNode;
  children: ReactNode;
}