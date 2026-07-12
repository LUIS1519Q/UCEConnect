import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { NotificationList } from "../../components/ui/organisms/NotificationList";
import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { Tabs } from "../../components/ui/molecules/Tabs";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { EmptyState } from "../../components/ui/organisms/EmptyState";

import { useNotifications } from "../../hooks/useNotifications";
import { useMarkNotificationRead } from "../../hooks/useMarkNotificationRead";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";

import {
  FilePlus2,
  FileText,
  User,
  CircleHelp,
  Info,
  LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

import type { AppNotification, NotificationType } from "../../types/notification";

const ACTION_LABEL: Record<NotificationType, string> = {
  manager_request: "Request",
  incident_created: "Status update",
  status_updated: "Status update",
  student_reply: "View reply",
};

export default function NotificationPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);

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

  const handleAction = (id: number, incidentId: number, type: NotificationType) => {
    markAsRead(id);

    if (type === "manager_request") {
      navigate(`/incidents/${incidentId}/conversation`);
    } else {
      navigate(`/incidents/${incidentId}`);
    }
  };

  const unreadCount = useUnreadNotificationsCount();

  return (
    <AppLayout
      title="Notifications"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      isNotificationsActive={true}
      onProfileClick={() => navigate(ROUTES.student.profile)}
      onNotificationsClick={() => navigate(ROUTES.student.notifications)}
      primaryAction={{
        label: "New Incident",
        icon: FilePlus2,
        onClick: () => navigate(ROUTES.student.createIncident),
      }}
      sidebarItems={[
        { label: "My Incidents", icon: FileText, onClick: () => navigate(ROUTES.student.myIncidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.student.profile) },
        { label: "Help", icon: CircleHelp, onClick: () => navigate(ROUTES.student.help) },
        { label: "About", icon: Info, onClick: () => navigate(ROUTES.student.about) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
      mobileTabItems={[
        { label: "My Incidents", icon: FileText, active: true, onClick: () => navigate(ROUTES.student.myIncidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.student.profile) },
      ]}
      mobileMoreMenuItems={[
        { label: "Help & FAQ", icon: CircleHelp, onClick: () => navigate(ROUTES.student.help) },
        { label: "About UCEConnect", icon: Info, onClick: () => navigate(ROUTES.student.about) },
        { label: "Logout", icon: LogOut, onClick: logout },
      ]}
    >
      <div className="mx-auto w-full max-w-3xl space-y-4">

        <SearchBar
          placeholder="Search notifications..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <Tabs
          value={filter}
          onChange={(value) => setFilter(value as "all" | "unread")}
          tabs={[
            { label: "All", value: "all" },
            { label: "Unread", value: "unread" },
          ]}
        />
        
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
              notifications={notifications.map((notification: AppNotification) => ({
                title: notification.title,
                message: `#${notification.ticket}`,
                date: new Date(notification.createdAt).toLocaleDateString(),
                unread: !notification.read,
                actionLabel: ACTION_LABEL[notification.type],
                onActionClick: () =>
                  handleAction(notification.id, notification.incidentId, notification.type),
              }))}
            />

            {hasMore && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={loadMore}
              >
                Load more
              </Button>
            )}
          </>
        )}

      </div>
    </AppLayout>
  );
}