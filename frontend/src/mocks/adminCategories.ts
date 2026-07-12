import type { GetCategoriesResponse } from "../types/category";

export const mockAdminCategories: GetCategoriesResponse = {
  data: [
    { id: 1, name: "Academic", description: "Issues related to academic processes", isActive: true },
    { id: 2, name: "Infrastructure", description: "Campus facilities and maintenance", isActive: true },
    { id: 3, name: "Technology", description: "IT systems and digital platforms", isActive: true },
    { id: 4, name: "Administrative", description: "Administrative and documentation issues", isActive: false },
    { id: 5, name: "Welfare", description: "Student wellbeing and support services", isActive: true },
  ],
  pagination: { page: 1, limit: 5, total: 12, totalPages: 3 },
};