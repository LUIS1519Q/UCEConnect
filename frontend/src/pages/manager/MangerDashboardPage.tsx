import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";

import { useDashboard } from "../../hooks/useDashboard";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import {
  BarChart3,
  FileText,
  User,
  LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

export default function ManagerDashboardPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const { metrics, recentIncidents, isLoading, isError, refetch } = useDashboard();

  const chartData = metrics
    ? [
        { name: "Open", value: metrics.open },
        { name: "In progress", value: metrics.in_progress },
        { name: "Resolved", value: metrics.resolved },
        { name: "Rejected", value: metrics.rejected },
      ]
    : [];

  return (
    <AppLayout
      title="Dashboard"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.manager.profile)}
      onNotificationsClick={() => navigate(ROUTES.manager.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: BarChart3, active: true, onClick: () => navigate(ROUTES.manager.dashboard) },
        { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.manager.incidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.manager.profile) },
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

              {/* Chart */}
              <div className="rounded-xl border border-border bg-surface p-6">
                <h2 className="mb-4 font-semibold text-textPrimary">
                  Incidents by status
                </h2>

                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Bar dataKey="value" fill="#2563EB" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
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
                      onClick={() => navigate(`/manager/incidents/${incident.id}`)}
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