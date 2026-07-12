import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";

import { useDashboard } from "../../hooks/useDashboard";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import {
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  Settings,
  Bell,
  User,
  LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const { metrics, recentIncidents, isLoading, isError, refetch } = useDashboard();

  const total = metrics?.total ?? 0;

  const statusBreakdown = metrics
    ? ([
        { key: "open", label: "Open" },
        { key: "in_progress", label: "In progress" },
        { key: "resolved", label: "Resolved" },
        { key: "rejected", label: "Rejected" },
        { key: "cancelled", label: "Cancelled" },
      ] as const).map(({ key, label }) => ({
        label,
        count: metrics[key],
        percentage: total > 0 ? Math.round((metrics[key] / total) * 100) : 0,
      }))
    : [];

  return (
    <AppLayout
      title="Dashboard"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.admin.profile)}
      onNotificationsClick={() => navigate(ROUTES.admin.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: LayoutDashboard, active: true, onClick: () => navigate(ROUTES.admin.dashboard) },
        { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.admin.incidents) },
        { label: "Users", icon: Users, onClick: () => navigate(ROUTES.admin.users) },
        { label: "Categories", icon: Tags, onClick: () => navigate(ROUTES.admin.categories) },
        { label: "Settings", icon: Settings, onClick: () => navigate(ROUTES.admin.settings) },
        { label: "Notifications", icon: Bell, onClick: () => navigate(ROUTES.admin.notifications) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.admin.profile) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      <div className="mx-auto w-full max-w-6xl space-y-6">

        {isLoading ? (
          <LoadingState title="Loading dashboard..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load dashboard"
            description="Please try again."
            onRetry={refetch}
          />
        ) : (
          <>
            {/* Quick actions — solo admin */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => navigate(ROUTES.admin.users)}
                className="rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-background"
              >
                <Users size={20} className="mb-2 text-primary" />
                <p className="font-medium text-textPrimary">Manage users</p>
                <p className="text-sm text-textSecondary">Create, edit and manage roles</p>
              </button>

              <button
                onClick={() => navigate(ROUTES.admin.categories)}
                className="rounded-xl border border-border bg-surface p-4 text-left transition-colors hover:bg-background"
              >
                <Tags size={20} className="mb-2 text-primary" />
                <p className="font-medium text-textPrimary">Manage categories</p>
                <p className="text-sm text-textSecondary">Organize incident categories</p>
              </button>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
              {[
                { label: "Total", value: metrics?.total },
                { label: "Open", value: metrics?.open },
                { label: "In progress", value: metrics?.in_progress },
                { label: "Resolved", value: metrics?.resolved },
                { label: "Rejected", value: metrics?.rejected },
              ].map((kpi) => (
                <div key={kpi.label} className="rounded-xl border border-border bg-surface p-4">
                  <p className="text-xs text-textSecondary">{kpi.label}</p>
                  <p className="mt-1 text-2xl font-semibold text-textPrimary">
                    {kpi.value ?? "—"}
                  </p>
                </div>
              ))}
            </div>

            <div className="grid gap-6 lg:grid-cols-2">

              {/* Status breakdown — barras horizontales */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-4 font-semibold text-textPrimary">
                  Incidents by status
                </h2>

                <div className="space-y-4">
                  {statusBreakdown.map((item) => (
                    <div key={item.label}>
                      <div className="mb-1 flex items-center justify-between text-sm">
                        <span className="text-textPrimary">{item.label}</span>
                        <span className="text-textSecondary">
                          {item.count} ({item.percentage}%)
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-background">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${item.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent incidents */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-4 font-semibold text-textPrimary">
                  Recent incidents
                </h2>

                <div className="space-y-3">
                  {recentIncidents.map((incident) => (
                    <button
                      key={incident.id}
                      onClick={() => navigate(`/admin/incidents/${incident.id}`)}
                      className="flex w-full items-center justify-between rounded-lg border border-border p-3 text-left transition-colors hover:bg-background"
                    >
                      <div>
                        <p className="text-sm font-medium text-textPrimary">
                          #{incident.ticket}
                        </p>
                        <p className="text-sm text-textSecondary">
                          {incident.title}
                        </p>
                      </div>

                      <StatusBadge status={incident.status} />
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </>
        )}

      </div>
    </AppLayout>
  );
}