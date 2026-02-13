import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_URL;

const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  API_BASE_URL?.replace("/api", "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🖼 Image helper
export const getImageUrl = (path) =>
  path?.startsWith("http")
    ? path
    : `${BACKEND_BASE_URL}${path}`;

// 🔐 Attach token automatically
api.interceptors.request.use(
  (config) => {
    try {
      const userInfo = localStorage.getItem("userInfo");

      if (userInfo) {
        const parsed = JSON.parse(userInfo);
        if (parsed?.token) {
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      }
    } catch (error) {
      console.error("Token parse error");
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 Global response handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Auto logout on invalid token
      localStorage.removeItem("userInfo");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
