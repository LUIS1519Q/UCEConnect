import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { NotificationList } from "../../components/ui/organisms/NotificationList";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { EmptyState } from "../../components/ui/organisms/EmptyState";

import { useNotifications } from "../../hooks/useNotifications";
import { useMarkNotificationRead } from "../../hooks/useMarkNotificationRead";
import { useMarkAllNotificationsRead } from "../../hooks/useMarkAllNotificationsRead";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";

import { BarChart3, FileText, User, LogOut } from "../../components/ui/icons";
import { ROUTES } from "../../constants/routes";
import type { AppNotification, NotificationType } from "../../types/notification";

import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { Tabs } from "../../components/ui/molecules/Tabs";

const ACTION_LABEL: Record<NotificationType, string> = {
  incident_created: "New incident",
  student_reply: "New reply",
  manager_request: "New reply",
  status_updated: "New incident",
};

export default function ManagerNotificationsPage() {
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

  const handleAction = (id: number, incidentId: number, type: NotificationType) => {
    markAsRead(id);
    if (type === "student_reply") {
      navigate(`/manager/incidents/${incidentId}/conversation`);
    } else {
      navigate(`/manager/incidents/${incidentId}`);
    }
  };

  return (
    <AppLayout
      title="Notifications"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      isNotificationsActive={true}
      onProfileClick={() => navigate(ROUTES.manager.profile)}
      onNotificationsClick={() => navigate(ROUTES.manager.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: BarChart3, onClick: () => navigate(ROUTES.manager.dashboard) },
        { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.manager.incidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.manager.profile) },
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
            description="You'll see updates about your incidents here."
          />
        ) : (
          <>
            <NotificationList
              notifications={notifications.map((n: AppNotification) => ({
                title: n.title,
                message: `#${n.ticket}`,
                date: new Date(n.createdAt).toLocaleDateString(),
                unread: !n.read,
                actionLabel: ACTION_LABEL[n.type],
                onActionClick: () => handleAction(n.id, n.incidentId, n.type),
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