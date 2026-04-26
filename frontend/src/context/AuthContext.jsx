import { createContext, useContext, useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import api from "../api/axios";
import { clearLocalUser, getLocalUser, makeLocalUser, saveLocalUser } from "../utils/localStore";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const isOwner = user?.role === "owner" && user?.phone === "7021157367";

  useEffect(() => {
    const local = getLocalUser();
    if (local) setUser(local);
    api.get("/api/auth/me").then((res) => { setUser(res.data.user); saveLocalUser(res.data.user); }).catch(() => {
      if (!local) localStorage.removeItem("sfo_token");
    }).finally(() => setLoading(false));
  }, []);

  const loginPhone = async (phone) => {
    try {
      const res = await api.post("/api/auth/login-phone", { phone });
      localStorage.setItem("sfo_token", res.data.token);
      saveLocalUser(res.data.user);
      setUser(res.data.user);
      toast.success(res.data.user.role === "owner" ? "Owner dashboard unlocked" : "Logged in");
      return res.data.user;
    } catch {
      const localUser = makeLocalUser(phone);
      saveLocalUser(localUser);
      setUser(localUser);
      toast.success(localUser.role === "owner" ? "Owner dashboard unlocked" : "Logged in");
      return localUser;
    }
  };

  const logout = () => { clearLocalUser(); setUser(null); toast.success("Logged out"); };

  return <AuthContext.Provider value={useMemo(() => ({ user, isOwner, loading, loginPhone, logout }), [user, isOwner, loading])}>{children}</AuthContext.Provider>;
}
