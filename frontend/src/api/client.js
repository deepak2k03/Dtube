import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api/v1";

if (!import.meta.env.VITE_API_BASE_URL) {
  console.warn(
    "Using default API base http://localhost:8000/api/v1. Set VITE_API_BASE_URL in frontend/.env for production/deployment."
  );
}

export const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const stored = localStorage.getItem("Vidget_tokens");
  if (stored) {
    try {
      const { accessToken } = JSON.parse(stored);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    } catch {
      // ignore parse issues
    }
  }
  return config;
});

export default client;

