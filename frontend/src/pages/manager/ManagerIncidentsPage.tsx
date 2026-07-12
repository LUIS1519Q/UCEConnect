import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { EmptyState } from "../../components/ui/organisms/EmptyState";
import { Pagination } from "../../components/ui/molecules/Pagination";
import { SearchBar } from "../../components/ui/molecules/SearchBar";

import { useManagerIncidents } from "../../hooks/useManagerIncident";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import type { IncidentStatus, ManagerIncidentSummary } from "../../types/incident";

import {
  BarChart3,
  FileText,
  User,
  LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

const STATUS_OPTIONS: { label: string; value: IncidentStatus | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Open", value: "open" },
  { label: "In progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
  { label: "Cancelled", value: "cancelled" },
];

export default function ManagerIncidentsPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const {
    incidents,
    pagination,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
  } = useManagerIncidents();

  return (
    <AppLayout
      title="Incidents"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.manager.profile)}
      onNotificationsClick={() => navigate(ROUTES.manager.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: BarChart3, onClick: () => navigate(ROUTES.manager.dashboard) },
        { label: "Incidents", icon: FileText, active: true, onClick: () => navigate(ROUTES.manager.incidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.manager.profile) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      <div className="mx-auto w-full max-w-6xl space-y-4">

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <div className="flex-1 min-w-48">
            <SearchBar
              placeholder="Search by ID or title..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="rounded-lg border border-border bg-surface px-3 py-2 text-sm"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as IncidentStatus | "all");
              setPage(1);
            }}
          >
            {STATUS_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Table */}
        {isLoading ? (
          <LoadingState title="Loading incidents..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load incidents"
            description="Please try again."
            onRetry={refetch}
          />
        ) : incidents.length === 0 ? (
          <EmptyState
            title="No incidents found"
            description="Try adjusting your filters."
          />
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border bg-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-background">
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">ID</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Student</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Category</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Status</th>
                  <th className="px-4 py-3 text-left font-medium text-textSecondary">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {incidents.map((incident) => (
                  <tr
                    key={incident.id}
                    onClick={() => navigate(`/manager/incidents/${incident.id}`)}
                    className="cursor-pointer transition-colors hover:bg-background"
                  >
                    <td className="px-4 py-3 font-medium text-primary">
                      #{incident.ticket}
                    </td>
                    <td className="px-4 py-3 text-textPrimary">
                      {incident.title}
                    </td>
                    <td className="px-4 py-3 text-textSecondary">
                      {(incident as ManagerIncidentSummary).student ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-textSecondary">
                      {(incident as ManagerIncidentSummary).category ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={incident.status} />
                    </td>
                    <td className="px-4 py-3 text-textSecondary">
                      {new Date(incident.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination && (
          <div className="flex items-center justify-between text-sm text-textSecondary">
            <span>
              {((page - 1) * 5) + 1}–{Math.min(page * 5, pagination.total)} of {pagination.total}
            </span>
            <Pagination
              currentPage={page}
              totalPages={pagination.totalPages ?? Math.ceil(pagination.total / 5)}
              onPageChange={setPage}
            />
          </div>
        )}

      </div>
    </AppLayout>
  );
}