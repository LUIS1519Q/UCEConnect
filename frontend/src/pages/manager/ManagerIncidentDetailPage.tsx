import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";
import { Modal } from "../../components/ui/organisms/Modal";
import { Timeline } from "../../components/ui/organisms/Timeline";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";

import { useManagerIncidentDetail } from "../../hooks/useManagerIncidentDetail";
import { useUpdateStatus } from "../../hooks/useUpdateStatus";
import { useCorrectCategory } from "../../hooks/useCorrectCategory";
import { useAddInternalNote } from "../../hooks/useAddInternalNote";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import { BarChart3, FileText, User, LogOut } from "../../components/ui/icons";
import { ROUTES } from "../../constants/routes";
import type { IncidentStatus } from "../../types/incident";

const VALID_TRANSITIONS: Record<IncidentStatus, IncidentStatus[]> = {
  open: ["in_progress", "rejected"],
  in_progress: ["resolved", "rejected"],
  resolved: [],
  rejected: [],
  cancelled: [],
};

const CATEGORY_OPTIONS = [
  { id: 1, name: "Academic" },
  { id: 2, name: "Financial" },
  { id: 3, name: "Systems" },
  { id: 4, name: "Other" },
];

export default function ManagerIncidentDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const [statusModalOpen, setStatusModalOpen] = useState(false);
  const [categoryModalOpen, setCategoryModalOpen] = useState(false);
  const [newStatus, setNewStatus] = useState<IncidentStatus | "">("");
  const [justification, setJustification] = useState("");
  const [newCategoryId, setNewCategoryId] = useState<number | "">("");
  const [noteText, setNoteText] = useState("");

  const { data, isLoading, isError, refetch } = useManagerIncidentDetail(id!);
  const { updateStatusAsync, isPending: isUpdatingStatus } = useUpdateStatus();
  const { correctCategoryAsync, isPending: isCorrectingCategory } = useCorrectCategory();
  const { addNoteAsync, isPending: isAddingNote } = useAddInternalNote();

  const incident = data?.incident;
  const validNextStatuses = incident ? VALID_TRANSITIONS[incident.status] : [];

  const handleStatusConfirm = async () => {
    if (!newStatus || !justification) return;
    await updateStatusAsync({ id: id!, status: newStatus, note: justification });
    setStatusModalOpen(false);
    setNewStatus("");
    setJustification("");
  };

  const handleCategoryConfirm = async () => {
    if (!newCategoryId) return;
    await correctCategoryAsync({ id: id!, categoryId: Number(newCategoryId) });
    setCategoryModalOpen(false);
    setNewCategoryId("");
  };

  const handleAddNote = async () => {
    if (!noteText.trim()) return;
    await addNoteAsync({ id: id!, note: noteText });
    setNoteText("");
  };

  return (
    <AppLayout
      title={incident?.title ?? "Incident detail"}
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
      {/* Change Status Modal */}
      <Modal
        open={statusModalOpen}
        title="Change status"
        onClose={() => setStatusModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setStatusModalOpen(false)}>Cancel</Button>
            <Button disabled={!newStatus || !justification || isUpdatingStatus} onClick={handleStatusConfirm}>
              {isUpdatingStatus ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-textSecondary">#{incident?.ticket} · {incident?.title}</p>
          <div>
            <label className="mb-1 block text-sm font-medium">Current status</label>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-textSecondary">
              {incident?.status}
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">New status</label>
            <select
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value as IncidentStatus)}
            >
              <option value="">Select status...</option>
              {validNextStatuses.map((s) => (
                <option key={s} value={s}>{s.replace("_", " ")}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Justification <span className="text-danger">*</span></label>
            <textarea
              rows={4}
              placeholder="Enter justification for this status change..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={justification}
              onChange={(e) => setJustification(e.target.value)}
            />
            <p className="mt-1 text-xs text-textSecondary">* Required field</p>
          </div>
        </div>
      </Modal>

      {/* Correct Category Modal */}
      <Modal
        open={categoryModalOpen}
        title="Correct category"
        onClose={() => setCategoryModalOpen(false)}
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setCategoryModalOpen(false)}>Cancel</Button>
            <Button disabled={!newCategoryId || isCorrectingCategory} onClick={handleCategoryConfirm}>
              {isCorrectingCategory ? "Confirming..." : "Confirm"}
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <p className="text-sm text-textSecondary">#{incident?.ticket} · {incident?.title}</p>
          <div>
            <label className="mb-1 block text-sm font-medium">Current category</label>
            <div className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-textSecondary">
              Academic
            </div>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">New category</label>
            <select
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={newCategoryId}
              onChange={(e) => setNewCategoryId(Number(e.target.value))}
            >
              <option value="">Select category...</option>
              {CATEGORY_OPTIONS.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </div>
      </Modal>

      {isLoading ? (
        <LoadingState title="Loading incident..." />
      ) : isError ? (
        <ErrorState title="Failed to load incident" description="Please try again." onRetry={refetch} />
      ) : (
        <div className="mx-auto w-full max-w-4xl space-y-6">

          {/* Back */}
          <button onClick={() => navigate(ROUTES.manager.incidents)} className="text-sm text-primary hover:underline">
            ← Back
          </button>

          {/* Header */}
          <div className="flex flex-wrap items-center gap-2 text-sm text-textSecondary">
            {incident && <StatusBadge status={incident.status} />}
            <span>#{incident?.ticket}</span>
            <span>·</span>
            <span>Submitted: {incident?.createdAt ? new Date(incident.createdAt).toLocaleDateString() : "—"}</span>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={() => setCategoryModalOpen(true)}>
              Correct category
            </Button>
            <Button variant="secondary" onClick={() => setStatusModalOpen(true)} disabled={validNextStatuses.length === 0}>
              Change status
            </Button>
            <Button onClick={() => navigate(`/manager/incidents/${id}/conversation`)}>
              Feedback & response
            </Button>
          </div>

          {/* Description */}
          <div className="rounded-xl bg-surface p-6 shadow-sm space-y-2">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-textSecondary">Description</h3>
            <p className="text-sm text-textPrimary">{incident?.description}</p>
          </div>

          {/* Evidence */}
          {data?.attachments && data.attachments.length > 0 && (
            <div className="rounded-xl bg-surface p-6 shadow-sm space-y-3">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-textSecondary">Evidence (submitted by student)</h3>
              <div className="flex flex-wrap gap-3">
                {data.attachments.map((att) => (
                  <a  
                    key={att.id}
                    href={att.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 rounded-lg border border-border bg-background px-3 py-2 text-sm hover:bg-surface"
                  >
                    {att.fileName}
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* AI Summary */}
          {incident?.aiSummary && (
            <div className="rounded-xl border border-dashed border-border bg-surface p-6 space-y-2">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-textSecondary">AI Summary</h3>
              <p className="text-xs text-textSecondary italic">Generated by AI</p>
              <p className="text-sm text-textPrimary">{incident.aiSummary}</p>
            </div>
          )}

          {/* Internal Notes */}
          <div className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-semibold uppercase tracking-wide text-textSecondary">
              Internal Notes <span className="normal-case font-normal">(only visible to manager)</span>
            </h3>
            <div className="space-y-3">
              {data?.internalNotes?.map((note) => (
                <div key={note.id} className="rounded-lg border border-border bg-background p-3 text-sm">
                  <p className="text-textPrimary">{note.note}</p>
                  <p className="mt-1 text-xs text-textSecondary">{note.author} · {new Date(note.createdAt).toLocaleString()}</p>
                </div>
              ))}
            </div>
            <textarea
              rows={3}
              placeholder="Add internal note..."
              className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm"
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
            />
            <Button variant="secondary" disabled={!noteText.trim() || isAddingNote} onClick={handleAddNote}>
              {isAddingNote ? "Saving..." : "Save note"}
            </Button>
          </div>

          {/* Timeline */}
          {data?.timeline && data.timeline.length > 0 && (
            <div className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-textSecondary">History</h3>
              <Timeline
                items={data.timeline.map((t) => ({
                  id: String(t.id),
                  title: t.statusComment,
                  description: t.changedBy,
                  timestamp: new Date(t.changedAt).toLocaleString(),
                }))}
              />
            </div>
          )}

        </div>
      )}
    </AppLayout>
  );
}