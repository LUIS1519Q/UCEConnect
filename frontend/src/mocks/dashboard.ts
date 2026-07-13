import type { GetDashboardResponse } from "../types/dashboard";

export const mockDashboardResponse: GetDashboardResponse = {
  metrics: {
    total: 128,
    open: 34,
    in_progress: 21,
    resolved: 61,
    rejected: 12,
    cancelled: 0,
  },
  recentIncidents: [
    { id: 41, ticket: "INC-2026-0041", title: "Grade correction request", status: "open", createdAt: "2026-06-20T00:00:00Z" },
    { id: 40, ticket: "INC-2026-0040", title: "Scholarship not applied", status: "in_progress", createdAt: "2026-06-19T00:00:00Z" },
    { id: 39, ticket: "INC-2026-0039", title: "Portal login error", status: "resolved", createdAt: "2026-06-18T00:00:00Z" },
    { id: 38, ticket: "INC-2026-0038", title: "Missing enrollment record", status: "open", createdAt: "2026-06-17T00:00:00Z" },
    { id: 37, ticket: "INC-2026-0037", title: "Certificate not generated", status: "rejected", createdAt: "2026-06-16T00:00:00Z" },
  ],
};
