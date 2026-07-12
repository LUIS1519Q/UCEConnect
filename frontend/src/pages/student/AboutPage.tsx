import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { Logo } from "../../components/ui/atoms/Logo";

import { useAbout } from "../../hooks/useAbout";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import {
  FilePlus2,
  FileText,
  User,
  CircleHelp,
  Info,
  LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

export default function AboutPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const { about, isLoading, isError, refetch } = useAbout();

  return (
    <AppLayout
      title="About"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
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
        { label: "About", icon: Info, active: true, onClick: () => navigate(ROUTES.student.about) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      <div className="mx-auto w-full max-w-2xl">

        {isLoading ? (
          <LoadingState title="Loading..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load"
            description="Please try again."
            onRetry={refetch}
          />
        ) : (
          about && (
            <div className="rounded-xl bg-surface p-8 text-center shadow-sm">
              <Logo variant="vertical-color" className="mx-auto h-40 w-40" />

              <h1 className="mt-4 text-xl font-semibold text-textPrimary">
                {about.appName}
              </h1>

              <p className="mt-3 text-sm text-textSecondary">
                Version {about.version}
              </p>

              <hr className="my-6 border-border" />

              <div className="space-y-5 text-left">
                <div>
                  <h3 className="font-medium text-textPrimary">Description</h3>
                  <p className="mt-1 text-sm text-textSecondary">
                    {about.description}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-textPrimary">Institution</h3>
                  <p className="mt-1 text-sm text-textSecondary">
                    {about.institution}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-textPrimary">Contact</h3>
                  <p className="mt-1 text-sm text-textSecondary">
                    {about.contactEmail}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium text-textPrimary">Developed by</h3>
                  <p className="mt-1 text-sm text-textSecondary">
                    {about.developedBy}
                  </p>
                </div>
              </div>
            </div>
          )
        )}

      </div>
    </AppLayout>
  );
}