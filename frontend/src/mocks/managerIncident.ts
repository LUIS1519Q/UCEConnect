import type { GetManagerIncidentsResponse } from "../types/incident";

export const mockManagerIncidents: GetManagerIncidentsResponse = {
  data: [
    { id: 41, ticket: "INC-2026-0041", title: "Grade correction request", student: "J. Pérez", category: "Academic", status: "open", createdAt: "2026-06-20T00:00:00Z" },
    { id: 40, ticket: "INC-2026-0040", title: "Scholarship not applied", student: "M. Torres", category: "Financial", status: "in_progress", createdAt: "2026-06-19T00:00:00Z" },
    { id: 39, ticket: "INC-2026-0039", title: "Portal login error", student: "A. Ruiz", category: "Systems", status: "resolved", createdAt: "2026-06-18T00:00:00Z" },
    { id: 38, ticket: "INC-2026-0038", title: "Missing enrollment record", student: "L. Gómez", category: "Academic", status: "open", createdAt: "2026-06-17T00:00:00Z" },
    { id: 37, ticket: "INC-2026-0037", title: "Certificate not generated", student: "K. Mora", category: "Other", status: "rejected", createdAt: "2026-06-16T00:00:00Z" },
    { id: 36, ticket: "INC-2026-0036", title: "Tuition payment not reflected", student: "R. Vega", category: "Financial", status: "in_progress", createdAt: "2026-06-15T00:00:00Z" },
  ],
  pagination: {
    page: 1,
    limit: 5,
    total: 128,
    totalPages: 26,
    hasNext: true,
    hasPrev: false,
  },
};