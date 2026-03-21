import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const publicApi = axios.create({
  baseURL
});

export const adminApi = axios.create({
  baseURL
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("portfolio_admin_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

adminApi.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("portfolio_admin_token");
      localStorage.removeItem("portfolio_admin_user");
      if (!window.location.pathname.includes("/admin/login")) {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(error);
  }
);
