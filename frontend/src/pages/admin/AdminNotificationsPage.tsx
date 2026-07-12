import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { NotificationList } from "../../components/ui/organisms/NotificationList";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { EmptyState } from "../../components/ui/organisms/EmptyState";
import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { Tabs } from "../../components/ui/molecules/Tabs";

import { useNotifications } from "../../hooks/useNotifications";
import { useMarkNotificationRead } from "../../hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../../hooks/useMarkAllNotificationsRead";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";

import {
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  Settings,
  User,
  LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";
import type { AppNotification, NotificationType } from "../../types/notification";

const ACTION_LABEL: Record<NotificationType, string> = {
  incident_created: "New incident",
  student_reply: "New reply",
  manager_request: "New reply",
  status_updated: "Resolved",
  user_registered: "New user",
  category_updated: "Category",
  settings_changed: "Settings",
};

const NON_INCIDENT_TYPES: NotificationType[] = [
  "user_registered",
  "category_updated",
  "settings_changed",
];

export default function AdminNotificationsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const {
    notifications,
    hasMore,
    isLoading,
    isError,
    refetch,
    loadMore,
    search,
    setSearch,
    filter,
    setFilter,
  } = useNotifications();

  const { markAsRead } = useMarkNotificationRead();
  const { markAllAsRead, isPending: isMarkingAll } = useMarkAllNotificationsRead();

  const handleAction = (notification: AppNotification) => {
    markAsRead(notification.id);

    if (NON_INCIDENT_TYPES.includes(notification.type)) {
      if (notification.type === "user_registered") {
        navigate(ROUTES.admin.users);
      } else if (notification.type === "category_updated") {
        navigate(ROUTES.admin.categories);
      } else {
        navigate(ROUTES.admin.settings);
      }
      return;
    }

    navigate(`/admin/incidents/${notification.incidentId}`);
  };

  return (
    <AppLayout
      title="Notifications"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      isNotificationsActive={true}
      onProfileClick={() => navigate(ROUTES.admin.profile)}
      onNotificationsClick={() => navigate(ROUTES.admin.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: LayoutDashboard, onClick: () => navigate(ROUTES.admin.dashboard) },
        { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.admin.incidents) },
        { label: "Users", icon: Users, onClick: () => navigate(ROUTES.admin.users) },
        { label: "Categories", icon: Tags, onClick: () => navigate(ROUTES.admin.categories) },
        { label: "Settings", icon: Settings, onClick: () => navigate(ROUTES.admin.settings) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.admin.profile) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      <div className="mx-auto w-full max-w-3xl space-y-4">

        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div className="flex-1">
              <SearchBar
                placeholder="Search notifications..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button
              variant="secondary"
              size="sm"
              disabled={isMarkingAll || notifications.every((n) => n.read)}
              onClick={() => markAllAsRead(notifications)}
            >
              {isMarkingAll ? "Marking..." : "Mark all as read"}
            </Button>
          </div>

          <Tabs
            value={filter}
            onChange={(value) => setFilter(value as "all" | "unread")}
            tabs={[
              { label: "All", value: "all" },
              { label: "Unread", value: "unread" },
            ]}
          />
        </div>

        {isLoading ? (
          <LoadingState title="Loading notifications..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load notifications"
            description="Please try again."
            onRetry={refetch}
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            description="You'll see system updates here."
          />
        ) : (
          <>
            <NotificationList
              notifications={notifications.map((n: AppNotification) => ({
                title: n.title,
                message: n.ticket ? `#${n.ticket}` : "",
                date: new Date(n.createdAt).toLocaleDateString(),
                unread: !n.read,
                actionLabel: ACTION_LABEL[n.type],
                onActionClick: () => handleAction(n),
              }))}
            />

            {hasMore && (
              <Button variant="secondary" className="w-full" onClick={loadMore}>
                Load more
              </Button>
            )}
          </>
        )}

      </div>
    </AppLayout>
  );
}