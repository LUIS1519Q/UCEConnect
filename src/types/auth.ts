export type Role = 'STUDENT' | 'MANAGER' | 'ADMIN';

export interface User {
  id: string;
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