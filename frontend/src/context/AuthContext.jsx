import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwner = user?.role === "owner" && user?.phone === "7021157367";

  useEffect(() => {
    api.get("/api/auth/me").then((res) => setUser(res.data.user)).catch(() => localStorage.removeItem("sfo_token")).finally(() => setLoading(false));
  }, []);

  const loginPhone = async (phone) => {
    const res = await api.post("/api/auth/login-phone", { phone });
    localStorage.setItem("sfo_token", res.data.token);
    setUser(res.data.user);
    toast.success(res.data.user.role === "owner" ? "Owner dashboard unlocked" : "Logged in");
  };

  const logout = () => { localStorage.removeItem("sfo_token"); setUser(null); toast.success("Logged out"); };

  return <AuthContext.Provider value={useMemo(() => ({ user, isOwner, loading, loginPhone, logout }), [user, isOwner, loading])}>{children}</AuthContext.Provider>;
}
