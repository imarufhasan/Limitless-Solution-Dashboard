import { io } from "socket.io-client";
import baseUrl from "../redux/constants/data/baseUrl";

let socket = null;

export function getSocket() {
  return socket;
}

export function initSocket(token) {
  // Return existing connected socket
  if (socket?.connected) return socket;

  // If socket exists but disconnected, reconnect it
  if (socket) {
    socket.connect();
    return socket;
  }

  // Create fresh socket
  socket = io(baseUrl, {
    query: { token },
    transports: ["websocket"],
    reconnectionAttempts: 5,
    reconnectionDelay: 2000,
    autoConnect: true,
  });

  socket.on("connect", () => console.log("[Socket] ✅ connected:", socket.id));
  socket.on("disconnect", (r) => console.warn("[Socket] ❌ disconnected:", r));
  socket.on("connect_error", (e) => console.error("[Socket] error:", e.message));

  return socket;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}