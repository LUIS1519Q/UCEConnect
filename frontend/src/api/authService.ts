import axios from "axios";
import { useAuthStore } from "../store/authStore";
import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyCodePayload,
  VerifyResetCodePayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  User,
} from "../types/auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      useAuthStore.getState().logout();
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

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

  async verifyResetCode(
    payload: VerifyResetCodePayload
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/api/v1/auth/verify-reset-code",
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

  async resendResetCode(
    email: string
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/api/v1/auth/resend-reset-code",
      { email }
    );

    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/api/v1/auth/forgot-password",
      payload
    );

    return response.data;
  },

  async me(): Promise<User> {
    const response = await api.get<User>(
      "/api/v1/auth/me"
    );

    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<{ message: string }> {
    const response = await api.post<{ message: string }>(
      "/api/v1/auth/reset-password",
      payload
    );

    return response.data;
  },

};

export default api;