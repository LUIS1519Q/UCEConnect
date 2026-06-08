import axios from "axios";
import type { AuthResponse, LoginPayload, User } from "../types/auth";

// Backend URL
const API_URL = import.meta.env.VITE_API_URL;

console.log(import.meta.env.VITE_API_URL);

// Axios instance used throughout the application
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically if the user is authenticated
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Authentication requests
export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/auth/login",
      payload
    );

    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>("/auth/me");

    return response.data;
  },
};

export default api;