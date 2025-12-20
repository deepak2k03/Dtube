import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import client from "../api/client.js";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH CURRENT USER ================= */
  const fetchCurrentUser = useCallback(async () => {
    try {
      const { data } = await client.get("/users/current-user");
      setUser(data.data);
    } catch (error) {
      setUser(null);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  /* ================= LOGIN ================= */
  const login = async (payload) => {
    setLoading(true);
    try {
      const { data } = await client.post("/users/login", payload);
      setUser(data.data.user);
      return { ok: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to log in right now.";
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  /* ================= REGISTER ================= */
  const register = async (formData) => {
    setLoading(true);
    try {
      const { data } = await client.post("/users/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return { ok: true, data: data.data };
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to register right now.";
      return { ok: false, message };
    } finally {
      setLoading(false);
    }
  };

  /* ================= LOGOUT ================= */
  const logout = async () => {
    try {
      await client.post("/users/logout");
    } catch (error) {
      console.error("Failed to logout", error);
    } finally {
      setUser(null);
    }
  };

  /* ================= UPDATE PROFILE ================= */
  const updateProfile = async (payload) => {
    try {
      const { data } = await client.patch("/users/update-account", payload);
      setUser(data.data);
      return { ok: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to update profile.";
      return { ok: false, message };
    }
  };

  /* ================= CHANGE PASSWORD ================= */
  const changePassword = async (payload) => {
    try {
      await client.post("/users/change-password", payload);
      return { ok: true };
    } catch (error) {
      const message =
        error.response?.data?.message || "Unable to change password.";
      return { ok: false, message };
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: Boolean(user),
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    changePassword,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
