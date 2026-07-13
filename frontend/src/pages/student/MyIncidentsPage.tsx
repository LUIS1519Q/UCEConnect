import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

import {
  FilePlus2,
  FileText,
  User,
  CircleHelp,
  Info,
  LogOut,
} from "../../components/ui/icons";

import { useLogout } from "../../hooks/useLogout";

import { ROUTES } from "../../constants/routes";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { Tabs } from "../../components/ui/molecules/Tabs";
import { IncidentList } from "../../components/ui/organisms/IncidentList";
import { Pagination } from "../../components/ui/molecules/Pagination";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { EmptyState } from "../../components/ui/organisms/EmptyState";

import { useMyIncidents } from "../../hooks/useIncidents";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

export default function MyIncidentsPage() {
  const navigate = useNavigate();

  const { logout } = useLogout();

  const user = useAuthStore((state) => state.user);

  const {
    incidents,
    currentPage,
    totalPages,
    setCurrentPage,
    statusFilter,
    setStatusFilter,
    search,
    setSearch,
    isLoading,
    isError,
    refetch,
  } = useMyIncidents();
  
  const unreadCount = useUnreadNotificationsCount();

  return (
    <AppLayout
      title="My Incidents"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate("/profile")}
      onNotificationsClick={() => navigate("/notifications")}
      primaryAction={{
        label: "New Incident",
        icon: FilePlus2,
        onClick: () => navigate(ROUTES.student.createIncident),
      }}
      sidebarItems={[
        {
          label: "My Incidents",
          icon: FileText,
          active: true,
          onClick: () => navigate(ROUTES.student.myIncidents),
        },
        {
          label: "Profile",
          icon: User,
          onClick: () => navigate(ROUTES.student.profile),
        },
        {
          label: "Help",
          icon: CircleHelp,
          onClick: () => navigate(ROUTES.student.help),
        },
        {
          label: "About",
          icon: Info,
          onClick: () => navigate(ROUTES.student.about),
        },
      ]}
      bottomItems={[
        {
          label: "Logout",
          icon: LogOut,
          onClick: logout,
        },
      ]}
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
      <div
        className="
          flex
          min-h-0
          flex-1
          flex-col
        "
      >

        {isLoading ? (

          <LoadingState
            title="Loading incidents..."
          />

        ) : isError ? (

          <ErrorState
            title="Failed to load incidents"
            description="Please try again."
            onRetry={refetch}
          />

        ) : (

          <>
            <SearchBar
              placeholder="Search incidents..."
              value={search}
              onChange={(e) => setSearch(e.target.value)
              }
            />
            
            <Tabs
              value={statusFilter}
              onChange={(value) =>
                setStatusFilter(
                  value as typeof statusFilter
                )
              }
              tabs={[
                {
                  label: "All",
                  value: "all",
                },
                {
                  label: "Open",
                  value: "open",
                },
                {
                  label: "In Progress",
                  value: "in_progress",
                },
                {
                  label: "Resolved",
                  value: "resolved",
                },
                {
                  label: "Rejected",
                  value: "rejected",
                },
                {
                  label: "Cancelled",
                  value: "cancelled",
                },
              ]}
            />
            
            {incidents.length === 0 ? (

              <EmptyState
                title="No incidents found"
                description="Create your first incident."
              />

            ) : (

              <div
                className="
                  mt-6
                  min-h-0
                  flex-1
                  overflow-y-auto
                "
              >
                <IncidentList
                  incidents={incidents.map((incident) => ({
                    ...incident,
                    onClick: () => navigate(`/incidents/${incident.id}`),
                  }))}
                />
              </div>

            )}

            <div className="pt-6">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
            
          </>

        )}

      </div>
    </AppLayout>
  );
}
