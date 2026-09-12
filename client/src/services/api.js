import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== "false";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("mindguard_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error?.response?.status === 401) {
      localStorage.removeItem("mindguard_token");
    }
    return Promise.reject(error);
  }
);

// Small helper so every service can simulate realistic latency in mock mode.
export const delay = (ms = 500) => new Promise((resolve) => setTimeout(resolve, ms));

export default api;
