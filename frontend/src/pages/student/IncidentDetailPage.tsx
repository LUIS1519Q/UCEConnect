import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import {
  FilePlus2,
  FileText,
  User,
  CircleHelp,
  Info,
  LogOut,
} from "../../components/ui/icons";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";
import { Modal } from "../../components/ui/organisms/Modal";
import { Timeline } from "../../components/ui/organisms/Timeline";
import { EvidenceSection } from "../../components/ui/organisms/EvidenceSection";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";

import { useIncidentDetail } from "../../hooks/useIncidentDetail";
import { useCancelIncident } from "../../hooks/useCancelIncident";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";

import { ROUTES } from "../../constants/routes";

export default function IncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);

  const [cancelModalOpen, setCancelModalOpen] = useState(false);

  const [cancelError, setCancelError] = useState<string | null>(null);

  const { data, isLoading, isError, refetch } = useIncidentDetail(id!);
  const { cancelIncidentAsync, isPending: isCancelling } = useCancelIncident();

  const incident = data?.incident;
  const isOpen = incident?.status === "open";

  const handleCancel = async () => {
    if (!incident) return;

    setCancelError(null);

    try {
      await cancelIncidentAsync(incident.id);
      setCancelModalOpen(false);
      navigate(ROUTES.student.myIncidents);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Something went wrong. Please try again."
        : "Something went wrong. Please try again.";

      setCancelError(message);
    }
  };

  const TIMELINE_PREVIEW_COUNT = 3;

  const [showFullTimeline, setShowFullTimeline] = useState(false);

  const timelineItems =
    data?.timeline?.map((t) => ({
      id: String(t.id),
      title: t.statusComment ?? `Status: ${t.status}`,
      description: t.changedBy,
      timestamp: new Date(t.changedAt).toLocaleDateString(),
    })) ?? [];

  const hasMoreTimeline = timelineItems.length > TIMELINE_PREVIEW_COUNT;
  const visibleTimeline = showFullTimeline
    ? timelineItems
    : timelineItems.slice(0, TIMELINE_PREVIEW_COUNT);

  return (
    <AppLayout
      title="Incident detail"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={0}
      onProfileClick={() => navigate(ROUTES.student.profile)}
      onNotificationsClick={() => navigate(ROUTES.student.notifications)}
      primaryAction={{
        label: "New Incident",
        icon: FilePlus2,
        onClick: () => navigate(ROUTES.student.createIncident),
      }}
      sidebarItems={[
        { label: "My Incidents", icon: FileText, active: true, onClick: () => navigate(ROUTES.student.myIncidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.student.profile) },
        { label: "Help", icon: CircleHelp, onClick: () => navigate(ROUTES.student.help) },
        { label: "About", icon: Info, onClick: () => navigate(ROUTES.student.about) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      <Modal
        open={cancelModalOpen}
        title="Cancel incident"
        onClose={() => {
          setCancelModalOpen(false);
          setCancelError(null);
        }}
        footer={
          <div className="flex flex-col gap-3">
            <Button variant="secondary" onClick={() => setCancelModalOpen(false)}>
              Keep incident
            </Button>
            <Button variant="danger" disabled={isCancelling} onClick={handleCancel}>
              {isCancelling ? "Cancelling..." : "Yes, cancel incident"}
            </Button>
          </div>
        }
      >
        <p className="text-center text-textSecondary">
          Are you sure you want to cancel this incident?
        </p>
        <p className="mt-1 text-center text-sm text-textSecondary">
          This action cannot be undone.
        </p>

        {cancelError && (
          <p className="mt-3 text-center text-sm text-danger">
            {cancelError}
          </p>
        )}
      </Modal>

      {isLoading ? (
        <LoadingState title="Loading incident..." />
      ) : isError ? (
        <ErrorState title="Failed to load incident" description="Please try again." onRetry={refetch} />
      ) : (
        <div className="mx-auto w-full max-w-4xl space-y-6">
          <button
            onClick={() => navigate(ROUTES.student.myIncidents)}
            className="text-sm text-primary hover:underline"
          >
            ← Back to my incidents
          </button>

          <div className="rounded-xl bg-surface p-6 shadow-sm space-y-6">
            <table className="w-full text-sm">
              <tbody className="divide-y divide-border">
                <tr>
                  <td className="py-3 pr-4 text-textSecondary w-32">ID</td>
                  <td className="py-3 font-medium">#{incident?.ticket}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-textSecondary">Status</td>
                  <td className="py-3">{incident && <StatusBadge status={incident.status} />}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-textSecondary">Date created</td>
                  <td className="py-3">
                    {incident?.createdAt ? new Date(incident.createdAt).toLocaleDateString() : "—"}
                  </td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-textSecondary">Priority</td>
                  <td className="py-3 capitalize">{incident?.priority}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4 text-textSecondary">Title</td>
                  <td className="py-3">{incident?.title}</td>
                </tr>
              </tbody>
            </table>

            <div>
              <h3 className="mb-2 text-base font-medium text-textPrimary">
                Description
              </h3>
              <div className="rounded-lg bg-background p-4 text-sm text-textSecondary">
                {incident?.description}
              </div>
            </div>

            {data?.attachments && data.attachments.length > 0 && (
              <EvidenceSection
                files={data.attachments.map((att) => ({
                  fileName: att.fileName,
                  onClick: () => {
                    window.open(att.fileUrl, "_blank", "noopener,noreferrer");
                  },
                }))}
              />
            )}
            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              {isOpen && (
                <>
                  <Button className="flex-1" onClick={() => setCancelModalOpen(true)}>
                    Cancel incident
                  </Button>
                  <Button className="flex-1" onClick={() => navigate(`/incidents/${incident?.id}/edit`)}>
                    Edit incident
                  </Button>
                </>
              )}
            </div>

            {data?.conversationCount !== undefined && (
              <Button
                variant="secondary"
                className="w-full"
                onClick={() => navigate(`/incidents/${incident?.id}/conversation`)}
              >
                Conversation ({data.conversationCount})
              </Button>
            )}
          </div>

          {timelineItems.length > 0 && (
            <div className="rounded-xl bg-surface p-6 shadow-sm">
              <h3 className="mb-4 font-semibold">History</h3>
              <Timeline items={visibleTimeline} />
              {hasMoreTimeline && (
                <button
                  onClick={() => setShowFullTimeline((prev) => !prev)}
                  className="mt-4 text-sm text-primary hover:underline"
                >
                  {showFullTimeline ? "← Show less" : "View full timeline →"}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </AppLayout>
  );
}