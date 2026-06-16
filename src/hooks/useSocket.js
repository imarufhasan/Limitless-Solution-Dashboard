import { useEffect, useRef } from "react";
import { initSocket, getSocket } from "../socket/socket";

export function useSocket() {
  const token = localStorage.getItem("token");
  console.log("socket token: ", token);
  
  const socketRef = useRef(null);

  useEffect(() => {
    if (!token) return;

    // Init and store in ref — no re-renders
    socketRef.current = initSocket(token);

    // If disconnected for any reason, reconnect immediately
    if (!socketRef.current.connected) {
      socketRef.current.connect();
    }
  }, [token]);

  return getSocket;  // Return getter function, not value — avoids stale ref
}