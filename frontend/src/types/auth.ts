import type { User } from "./user";

export type RegisterRole =
  | "STUDENT"
  | "MANAGER"
  | "ADMIN";

export interface MeResponse {
  user: User;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: User;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: RegisterRole;
}

export interface VerifyCodePayload {
  email: string;
  code: string;
}

export interface VerifyResetCodePayload {
  email: string;
  code: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  resetToken: string;
  newPassword: string;
}

export interface VerifyResetCodeResponse {
  message: string;
  resetToken: string;
}