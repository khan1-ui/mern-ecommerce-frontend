import axios from "axios";

// ✅ API base from ENV
const API_BASE_URL =
  import.meta.env.VITE_API_URL;

// ✅ Backend root (for images)
const BACKEND_BASE_URL =
  import.meta.env.VITE_BACKEND_URL ||
  API_BASE_URL.replace("/api", "");

const api = axios.create({
  baseURL: API_BASE_URL,
});

// 🖼️ Image helper
export const getImageUrl = (path) =>
  `${BACKEND_BASE_URL}${path}`;

// 🔐 attach token automatically
api.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem("userInfo");

  if (userInfo) {
    const token = JSON.parse(userInfo).token;
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
