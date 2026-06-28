import api from "./axios";
import type { ApiMessageResponse } from "../types/common";

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyCodePayload,
  VerifyResetCodePayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
} from "../types/auth";

import type { User } from "../types/user";

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
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      "/api/v1/auth/register",
      payload
    );

    return response.data;
  },

  async verifyCode(
    payload: VerifyCodePayload
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      "/api/v1/auth/verify-code",
      payload
    );

    return response.data;
  },

  async verifyResetCode(
    payload: VerifyResetCodePayload
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      "/api/v1/auth/verify-reset-code",
      payload
    );

    return response.data;
  },

  async resendCode(
    email: string
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      "/api/v1/auth/resend-code",
      { email }
    );

    return response.data;
  },

  async resendResetCode(
    email: string
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      "/api/v1/auth/resend-reset-code",
      { email }
    );

    return response.data;
  },

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
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
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      "/api/v1/auth/reset-password",
      payload
    );

    return response.data;
  },

  microsoftLogin(): void {
    window.location.href = `${import.meta.env.VITE_API_URL}/api/v1/auth/microsoft`;
  },
  
};

export default api;