export type Role = "student" | "manager" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}