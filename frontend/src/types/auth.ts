export type Role = 'student' | 'manager' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
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
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
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
  email: string;
  code: string;
  newPassword: string;
}