import type { SidebarItem } from "../AppSidebar";

export interface MobileBottomNavProps {
  items: SidebarItem[];
  primaryAction?: SidebarItem;
}