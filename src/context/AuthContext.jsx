import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = async (email, password) => {
    const { data } = await api.post("/auth/login", {
      email,
      password,
    });
    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);
    return data;
  };

  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
  };

  // 🔥 LOAD USER FROM BACKEND
  useEffect(() => {
    const loadUser = async () => {
      const stored = localStorage.getItem("userInfo");
      if (!stored) {
        setLoading(false);
        return;
      }

      try {
        const { data } = await api.get("/auth/me");
        setUser(data);
      } catch {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
