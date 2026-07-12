import { useState, useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { Textarea } from "../../components/ui/atoms/Textarea";
import { ConversationThread } from "../../components/ui/organisms/ConversationThread";
import { StatusBadge } from "../../components/ui/atoms/StatusBadge";
import { LoadingState } from "../../components/ui/organisms/LoadingState";

import { useIncidentDetail } from "../../hooks/useIncidentDetail";
import { useIncidentChat } from "../../hooks/useIncidentChat";
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

import type { ChatBubbleProps } from "../../components/ui/molecules/ChatBubble";

export default function RespondToManagerRequestPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);

  const [draft, setDraft] = useState("");
  const [visibleCount, setVisibleCount] = useState(10);

  const { data } = useIncidentDetail(id!);
  const incident = data?.incident;

  const {
    messages,
    conversationEnabled,
    locked,
    lockedMessage,
    isLoading,
    sendMessage,
  } = useIncidentChat(incident?.id, incident?.status);

  const chatMessages: ChatBubbleProps[] = messages.map((observation) => ({
    sender: observation.authorName,
    senderType: observation.authorRole,
    message: observation.message,
    timestamp: new Date(observation.createdAt).toLocaleString(),
  }));

  const hasOlderMessages = chatMessages.length > visibleCount;
  const visibleMessages = chatMessages.slice(-visibleCount);

  const canSend = conversationEnabled && !locked;

  const handleSend = () => {
    if (!draft.trim()) return;
    sendMessage(draft);
    setDraft("");
  };

  const bottomRef = useRef<HTMLDivElement>(null);
  const isFirstLoad = useRef(true);

  useEffect(() => {
    if (isFirstLoad.current) {
        isFirstLoad.current = false;
            return;
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages.length]);

  return (
    <AppLayout
      title="Respond to manager request"
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
      <div className="mx-auto w-full max-w-3xl space-y-6">
        <button
          onClick={() => navigate(`/incidents/${id}`)}
          className="text-sm text-primary hover:underline"
        >
          ← Back to incident detail
        </button>

        {incident && (
          <p className="mt-1 flex items-center gap-2 text-sm text-textSecondary">
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
              <h2 className="mb-4 font-semibold text-textPrimary">
                Conversation
              </h2>

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
                  <p className="text-sm text-textSecondary">
                    No messages yet.
                  </p>
                ) : (
                  <>
                    <ConversationThread messages={visibleMessages} />
                    <div ref={bottomRef} />
                  </>
                )}
              </div>
            </div>

            <div className="rounded-xl bg-surface p-6 shadow-sm">
              <h2 className="mb-3 font-semibold text-textPrimary">
                Your response
              </h2>

              {!canSend ? (
                <p className="rounded-lg bg-background p-4 text-sm text-textSecondary">
                  {!conversationEnabled
                    ? "This conversation isn't available yet. The manager needs to start it."
                    : lockedMessage ?? "This conversation is now read-only."}
                </p>
              ) : (
                <>
                  <Textarea
                    rows={4}
                    placeholder="Write your response here..."
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    maxLength={1000}
                  />

                  <div className="mt-4 flex justify-end">
                    <Button onClick={handleSend} disabled={!draft.trim()}>
                      Send response
                    </Button>
                  </div>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}