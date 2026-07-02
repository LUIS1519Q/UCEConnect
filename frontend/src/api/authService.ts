import api from "./client";

import type { ApiMessageResponse } from "../types/common";
import type { User, Role } from "../types/user";

import type {
  AuthResponse,
  LoginPayload,
  RegisterPayload,
  VerifyCodePayload,
  VerifyResetCodePayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  VerifyResetCodeResponse,
  MeResponse,
} from "../types/auth";

const AUTH_BASE = "/api/v1/auth";

export const authService = {
  // ---------------- LOGIN ----------------

  async login(
    payload: LoginPayload
  ): Promise<AuthResponse> {
    const response = await api.post<AuthResponse>(
      `${AUTH_BASE}/login`,
      payload
    );

    return response.data;
  },

  // ---------------- REGISTER ----------------

  async register(
    payload: RegisterPayload
  ): Promise<ApiMessageResponse> {
    const registerPayload: RegisterPayload = {
      ...payload,
      role: payload.role as Role,
    };

    const response = await api.post<ApiMessageResponse>(
      `${AUTH_BASE}/register`,
      registerPayload
    );

    return response.data;
  },

  // ---------------- CURRENT USER ----------------

  async me(): Promise<User> {
    const response = await api.get<MeResponse>(
      `${AUTH_BASE}/me`
    );

    return response.data.user;
  },

  // ---------------- FORGOT PASSWORD ----------------

  async forgotPassword(
    payload: ForgotPasswordPayload
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      `${AUTH_BASE}/forgot-password`,
      payload
    );

    return response.data;
  },

  async resetPassword(
    payload: ResetPasswordPayload
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      `${AUTH_BASE}/reset-password`,
      payload
    );

    return response.data;
  },

  // ---------------- VERIFY CODE ----------------

  async verifyCode(
    payload: VerifyCodePayload
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      `${AUTH_BASE}/verify-code`,
      payload
    );

    return response.data;
  },

  async verifyResetCode(
    payload: VerifyResetCodePayload
  ): Promise<VerifyResetCodeResponse> {
    const response =
      await api.post<VerifyResetCodeResponse>(
        `${AUTH_BASE}/verify-reset-code`,
        payload
      );

    return response.data;
  },

  // ---------------- RESEND CODE ----------------

  async resendCode(
    email: string
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      `${AUTH_BASE}/resend-code`,
      { email }
    );

    return response.data;
  },

  async resendResetCode(
    email: string
  ): Promise<ApiMessageResponse> {
    const response = await api.post<ApiMessageResponse>(
      `${AUTH_BASE}/resend-reset-code`,
      { email }
    );

    return response.data;
  },

  // ---------------- MICROSOFT LOGIN ----------------

  microsoftLogin(): void {
    window.location.href = `${import.meta.env.VITE_API_URL}${AUTH_BASE}/microsoft`;
  },
};