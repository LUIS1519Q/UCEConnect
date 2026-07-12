import { useEffect, useRef, useState, useCallback } from "react";

import { getSocket } from "../lib/socket";
import { mockObservations } from "../mocks/conversation";

import type {
  Observation,
  ConversationLoadedPayload,
  NewMessagePayload,
  ConversationLockedPayload,
  ChatErrorPayload,
} from "../types/chat";

const MOCK_FALLBACK_TIMEOUT_MS = 2500;

export function useIncidentChat(incidentId?: number, incidentStatus?: string) {
  const [messages, setMessages] = useState<Observation[]>([]);
  const [conversationEnabled, setConversationEnabled] = useState(false);
  const [locked, setLocked] = useState(false);
  const [lockedMessage, setLockedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isMockMode, setIsMockMode] = useState(false);
  const [loadedForId, setLoadedForId] = useState<number | undefined>(undefined);

  const isLoading = incidentId !== undefined && loadedForId !== incidentId;

  const mockNextId = useRef(mockObservations.length + 1);

  useEffect(() => {
    if (!incidentId) return;

    const socket = getSocket();

    function enterMockMode() {
      // TODO: quitar modo mock cuando el backend de Socket.io esté disponible
      setIsMockMode(true);  
      setLoadedForId(incidentId);
        if (incidentStatus === "open") {
            setMessages([]);
            setConversationEnabled(false);
            setLocked(false);
            return;
            }

            setMessages(mockObservations);
            setConversationEnabled(true);
            setLocked(incidentStatus !== "in_progress");
    }

    function onConversationLoaded(payload: ConversationLoadedPayload) {
      clearTimeout(fallbackTimer);
      setIsMockMode(false);
      setLoadedForId(incidentId);
      setMessages(payload.messages);
      setConversationEnabled(payload.conversationEnabled);
      setLocked(payload.locked ?? false);
    }

    function onNewMessage(payload: NewMessagePayload) {
      setMessages((prev) => [...prev, payload]);
    }

    function onConversationLocked(payload: ConversationLockedPayload) {
      setLocked(true);
      setLockedMessage(payload.message);
    }

    function onChatError(payload: ChatErrorPayload) {
      setError(payload.message);
    }

    function onConnectError() {
      clearTimeout(fallbackTimer);
      enterMockMode();
    }

    function onConnect() {
      socket.emit("join_incident", { incidentId });
    }

    socket.on("conversationLoaded", onConversationLoaded);
    socket.on("new_message", onNewMessage);
    socket.on("conversationLocked", onConversationLocked);
    socket.on("error", onChatError);
    socket.on("connect_error", onConnectError);
    socket.on("connect", onConnect);

    const fallbackTimer = setTimeout(enterMockMode, MOCK_FALLBACK_TIMEOUT_MS);

    socket.connect();

    return () => {
      clearTimeout(fallbackTimer);
      socket.off("conversationLoaded", onConversationLoaded);
      socket.off("new_message", onNewMessage);
      socket.off("conversationLocked", onConversationLocked);
      socket.off("error", onChatError);
      socket.off("connect_error", onConnectError);
      socket.off("connect", onConnect);
      socket.disconnect();
    };
  }, [incidentId, incidentStatus]);

  const sendMessage = useCallback(
    (text: string) => {
      if (!incidentId || !text.trim()) return;

      if (isMockMode) {
        const newMessage: Observation = {
          id: mockNextId.current++,
          authorId: 1,
          authorName: "Student",
          authorRole: "student",
          message: text.trim(),
          createdAt: new Date().toISOString(),
        };

        setMessages((prev) => [...prev, newMessage]);
        return;
      }

      const socket = getSocket();
      socket.emit("send_message", { incidentId, message: text.trim() });
    },
    [incidentId, isMockMode]
  );

  return {
    messages,
    conversationEnabled,
    locked,
    lockedMessage,
    isLoading,
    error,
    isMockMode,
    sendMessage,
  };
}