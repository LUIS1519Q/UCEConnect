import type { GetUsersResponse } from "../types/user";

export const mockAdminUsers: GetUsersResponse = {
  data: [
    { id: 1, firstName: "María José", lastName: "Pérez", email: "mjperez2@uce.edu.ec", role: "student", isActive: true, createdAt: "2025-03-12T00:00:00Z" },
    { id: 2, firstName: "Carlos", lastName: "Andrade", email: "candrade@uce.edu.ec", role: "manager", isActive: true, createdAt: "2024-11-02T00:00:00Z" },
    { id: 3, firstName: "Ana Lucia", lastName: "Torres", email: "altorres@uce.edu.ec", role: "admin", isActive: true, createdAt: "2024-08-19T00:00:00Z" },
    { id: 4, firstName: "Luis Fernando", lastName: "Vega", email: "lfvega@uce.edu.ec", role: "student", isActive: false, createdAt: "2025-01-07T00:00:00Z" },
    { id: 5, firstName: "Daniela", lastName: "Cruz", email: "dcruz@uce.edu.ec", role: "manager", isActive: true, createdAt: "2024-09-30T00:00:00Z" },
  ],
  pagination: { page: 1, limit: 5, total: 64, totalPages: 13 },
};