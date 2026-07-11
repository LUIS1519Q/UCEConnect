export interface AppHeaderProps {
  studentName: string;
  avatarUrl?: string;
  notificationCount?: number;
  onNotificationsClick?: () => void;
  onProfileClick?: () => void;
  onMenuClick?: () => void;
  isNotificationsActive?: boolean;
}