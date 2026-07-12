import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { Textarea } from "../../components/ui/atoms/Textarea";
import { ConversationThread } from "../../components/ui/organisms/ConversationThread";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";
import { LoadingState } from "../../components/ui/organisms/LoadingState";

import { useManagerIncidentDetail } from "../../hooks/useManagerIncidentDetail";
import { useIncidentChat } from "../../hooks/useIncidentChat";
import { useLogout } from "../../hooks/useLogout";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import { useAuthStore } from "../../store/authStore";

import { BarChart3, FileText, User, LogOut } from "../../components/ui/icons";
import { ROUTES } from "../../constants/routes";
import type { ChatBubbleProps } from "../../components/ui/molecules/ChatBubble";

export default function ManagerFeedbackPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();

  const [draft, setDraft] = useState("");
  const [attachedFile, setAttachedFile] = useState<File | null>(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  const { data } = useManagerIncidentDetail(id!);
  const incident = data?.incident;

  const {
    messages,
    conversationEnabled,
    locked,
    lockedMessage,
    isLoading,
    sendMessage,
  } = useIncidentChat(incident?.id, incident?.status);

  const chatMessages: ChatBubbleProps[] = messages.map((obs) => ({
    sender: obs.authorName,
    senderType: obs.authorRole,
    message: obs.message,
    timestamp: new Date(obs.createdAt).toLocaleString(),
  }));

  const hasOlderMessages = chatMessages.length > visibleCount;
  const visibleMessages = chatMessages.slice(-visibleCount);
  const canSend = conversationEnabled && !locked;

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
    setAttachedFile(null);
  };

  useEffect(() => {
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  return (
    <AppLayout
      title="Feedback & response"
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
      <div className="mx-auto w-full max-w-3xl space-y-6">

        <button
          onClick={() => navigate(`/manager/incidents/${id}`)}
          className="text-sm text-primary hover:underline"
        >
          ← Back
        </button>

        {incident && (
          <p className="flex items-center gap-2 text-sm text-textSecondary">
            #{incident.ticket} · {incident.title}
            <StatusBadge status={incident.status} />
          </p>
        )}

        {isLoading ? (
          <div className="rounded-xl bg-surface p-6 shadow-sm">
            <LoadingState title="Connecting to conversation..." />
          </div>
        ) : (
          <>
            <div className="rounded-xl bg-surface p-6 shadow-sm">
              <h2 className="mb-4 font-semibold text-textPrimary">Conversation</h2>
              <div className="max-h-[420px] space-y-4 overflow-y-auto pr-1">
                {hasOlderMessages && (
                  <button
                    onClick={() => setVisibleCount((prev) => prev + 10)}
                    className="mx-auto block text-sm text-primary hover:underline"
                  >
                    Load older messages
                  </button>
                )}
                {visibleMessages.length === 0 ? (
                  <p className="text-sm text-textSecondary">No messages yet.</p>
                ) : (
                  <>
                    <ConversationThread messages={visibleMessages} />
                    <div ref={bottomRef} />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-surface p-6 shadow-sm space-y-3">
              <h2 className="font-semibold text-textPrimary">Your response</h2>

              {!canSend ? (
                <p className="rounded-lg bg-background p-4 text-sm text-textSecondary">
                  {!conversationEnabled
                    ? "This conversation isn't available yet."
                    : lockedMessage ?? "This conversation is now read-only."}
                </p>
              ) : (
                <>
                  <Textarea
                    rows={4}
                    placeholder="Write your response to the student..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={1000}
                  />

                  {/* File attachment */}
                  <div className="flex items-center gap-3">
                    <input
                      hidden
                      type="file"
                      ref={fileInputRef}
                      onChange={(e) => setAttachedFile(e.target.files?.[0] ?? null)}
                    />
                    <button
                      type="button"
                      className="text-sm text-textSecondary hover:text-primary"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      📎
                    </button>
                    {attachedFile && (
                      <span className="flex items-center gap-1 rounded-full border border-border bg-background px-3 py-1 text-xs">
                        {attachedFile.name}
                        <button onClick={() => setAttachedFile(null)} className="ml-1 text-textSecondary hover:text-danger">×</button>
                      </span>
                    )}
                  </div>

                  <Button className="w-full" onClick={handleSend} disabled={!draft.trim()}>
                    Send response
                  </Button>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}