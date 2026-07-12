import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { SearchBar } from "../../components/ui/molecules/SearchBar";
import { FAQSection } from "../../components/ui/organisms/FAQSection";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";
import { EmptyState } from "../../components/ui/organisms/EmptyState";

import { useHelp } from "../../hooks/useHelp";
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

export default function HelpPage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const [search, setSearch] = useState("");

  const { faqs, supportEmail, isLoading, isError, refetch } = useHelp();

  const filteredFaqs = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return faqs;

    return faqs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(value) ||
        faq.answer.toLowerCase().includes(value)
    );
  }, [faqs, search]);

  return (
    <AppLayout
      title="Help & FAQ"
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
        { label: "Help", icon: CircleHelp, active: true, onClick: () => navigate(ROUTES.student.help) },
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
      <div className="mx-auto w-full max-w-3xl space-y-6">

        <p className="text-sm text-textSecondary">
          Frequently asked questions about UCEConnect
        </p>

        <SearchBar
          placeholder="Search questions..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {isLoading ? (
          <LoadingState title="Loading FAQs..." />
        ) : isError ? (
          <ErrorState
            title="Failed to load FAQs"
            description="Please try again."
            onRetry={refetch}
          />
        ) : filteredFaqs.length === 0 ? (
          <EmptyState
            title="No results found"
            description="Try a different search term."
          />
        ) : (
          <FAQSection faqs={filteredFaqs} />
        )}

        <div className="rounded-xl border border-border bg-surface p-4 text-sm">
          <p className="font-medium text-textPrimary">Still need help?</p>
          <p className="mt-1 text-textSecondary">
            Contact support: {supportEmail ?? "support@uceconnect.edu.ec"}
          </p>
        </div>

      </div>
    </AppLayout>
  );
}