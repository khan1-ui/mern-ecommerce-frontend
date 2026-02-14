import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import api from "../services/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ================= LOGIN =================
const login = async (emailOrData, password) => {
  try {
    let data;

    // 🔥 If first param is object → direct set (register case)
    if (typeof emailOrData === "object") {
      data = emailOrData;
    } else {
      // 🔥 Normal login case
      const response = await api.post("/api/auth/login", {
        email: emailOrData,
        password,
      });
      data = response.data;
    }

    localStorage.setItem("userInfo", JSON.stringify(data));
    setUser(data);

    return data;

  } catch (error) {
    throw error;
  }
};


  // ================= LOGOUT =================
  const logout = () => {
    localStorage.removeItem("userInfo");
    setUser(null);
    window.location.href = "/login";
  };

  // ================= LOAD USER =================
  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = localStorage.getItem("userInfo");

        if (!stored) {
          setLoading(false);
          return;
        }

        const parsed = JSON.parse(stored);

        // fallback to stored info immediately
        setUser(parsed);

        // validate token with backend
        const { data } = await api.get("/auth/me");

        // merge role + store from stored login if needed
        setUser((prev) => ({
          ...prev,
          ...data,
        }));

      } catch (error) {
        logout();
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        isAuthenticated: !!user,
        role: user?.role || null,
        storeSlug: user?.store || null,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
