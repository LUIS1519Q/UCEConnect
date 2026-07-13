import { io, type Socket } from "socket.io-client";

import { useAuthStore } from "../store/authStore";

let socket: Socket | null = null;

export function getSocket(): Socket {
  if (!socket) {
    const { accessToken } = useAuthStore.getState();

    socket = io(
      import.meta.env.VITE_SOCKET_URL ?? "http://localhost:3000",
      {
        autoConnect: false,
        query: { token: accessToken ?? "" },
        reconnectionAttempts: 2,
        reconnectionDelay: 1000,
      }
    );
  }

  return socket;
}