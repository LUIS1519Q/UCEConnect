import type { ReactNode } from "react";

import type {
  SidebarItem,
} from "../../organisms/AppSidebar";

export interface AppLayoutProps {
  title: string;
  children: ReactNode;

  studentName: string;
  notificationCount?: number;

  primaryAction?: SidebarItem;

  sidebarItems: SidebarItem[];

  bottomItems?: SidebarItem[];

  onNotificationsClick?: () => void;
  onProfileClick?: () => void;

  isNotificationsActive?: boolean;
}