import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

if (!API_BASE) {
  console.warn(
    "VITE_API_URL is not set. Create frontend/.env with VITE_API_URL=http://localhost:8000/api/v1 (or your backend URL)."
  );
}

export const client = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

client.interceptors.request.use((config) => {
  const stored = localStorage.getItem("dtube_tokens");
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

