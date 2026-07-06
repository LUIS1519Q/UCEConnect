import type { LucideIcon } from "../../icons";

export interface SidebarItem {
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}

export interface AppSidebarProps {
  primaryAction?: SidebarItem;
  items: SidebarItem[];
  bottomItems?: SidebarItem[];
}