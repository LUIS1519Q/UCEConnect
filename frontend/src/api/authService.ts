import axios from "axios";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyCodePayload,
  User,
} from "../types/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export const authService = {
  async login(payload: LoginPayload): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      "/api/v1/auth/login",
      payload
    );

    return response.data;
  },

  async register(
    payload: RegisterPayload
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/api/v1/auth/register",
      payload
    );

    return response.data;
  },

  async verifyCode(
    payload: VerifyCodePayload
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/api/v1/auth/verify-code",
      payload
    );

    return response.data;
  },

  async resendCode(
    email: string
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/api/v1/auth/resend-code",
      { email }
    );

    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>(
      "/api/v1/auth/me"
    );

    return response.data;
  },
};

export default api;