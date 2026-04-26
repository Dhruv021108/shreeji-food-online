import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";

const SocketContext = createContext(null);
export const useSocket = () => useContext(SocketContext);

export function SocketProvider({ children }) {
  const { user, isOwner } = useAuth();
  const [socket, setSocket] = useState(null);
  useEffect(() => {
    const s = io(import.meta.env.VITE_API_URL || "http://localhost:5000");
    setSocket(s);
    s.on("connect_error", () => {});
    return () => s.disconnect();
  }, []);
  useEffect(() => {
    if (!socket) return;
    socket.emit("join:user", user?._id);
    socket.emit("join:owner", isOwner);
    const menuToast = () => toast("Menu updated live");
    const paidToast = () => isOwner && toast.success("Payment received");
    socket.on("menu:updated", menuToast);
    socket.on("payment:success", paidToast);
    return () => { socket.off("menu:updated", menuToast); socket.off("payment:success", paidToast); };
  }, [socket, user?._id, isOwner]);
  return <SocketContext.Provider value={useMemo(() => ({ socket }), [socket])}>{children}</SocketContext.Provider>;
}
