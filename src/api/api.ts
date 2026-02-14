import axios from "axios";

const API_URL = import.meta.env.VITE_API_BASE_URL ?? "/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (data: { email: string; password: string; name?: string }) =>
    api.post("/auth/register", data),
  login: (data: { email: string; password: string }) =>
    api.post("/auth/login", data),
  getProfile: () => api.get("/auth/profile"),
};

// Secret API
export const secretAPI = {
  create: (data: {
    title: string;
    content: string;
    password: string;
    hints?: { text: string; order: number }[];
    theme?: string;
  }) => api.post("/secrets", data),
  getMySecrets: () => api.get("/secrets/my-secrets"),
  getById: (secretId: string) => api.get(`/secrets/${secretId}`),
  decrypt: (secretId: string, password: string) =>
    api.post(`/secrets/${secretId}/decrypt`, { password }),
  delete: (secretId: string) => api.delete(`/secrets/${secretId}`),
};

export default api;
