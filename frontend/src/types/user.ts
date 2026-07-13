export type Role = "student" | "manager" | "admin";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
}

export interface AdminUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
}

export interface GetUsersParams {
  role?: Role;
  isActive?: boolean;
  page?: number;
  limit?: number;
  search?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: Role;
}

export interface ManageUserRequest {
  isActive?: boolean;
  role?: Role;
}

export interface GetUsersResponse {
  data: AdminUser[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages?: number;
  };
}