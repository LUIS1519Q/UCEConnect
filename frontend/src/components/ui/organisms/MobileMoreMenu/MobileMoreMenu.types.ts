import type { SidebarItem } from "../AppSidebar";

export interface MobileMoreMenuProps {
  items: SidebarItem[];
  onClose: () => void;
}