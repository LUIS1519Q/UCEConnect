import type { IncidentSummary } from "../types/incident";

export const mockIncidents: IncidentSummary[] = [
  { id: 1, ticket: "INC-2026-0001", title: "Enrollment issue", status: "open", createdAt: "2026-07-01" },
  { id: 2, ticket: "INC-2026-0002", title: "Platform error", status: "resolved", createdAt: "2026-07-02" },
  { id: 3, ticket: "INC-2026-0003", title: "Library access", status: "in_progress", createdAt: "2026-07-03" },
  { id: 4, ticket: "INC-2026-0004", title: "Scholarship", status: "rejected", createdAt: "2026-07-04" },
  { id: 5, ticket: "INC-2026-0005", title: "Parking", status: "cancelled", createdAt: "2026-07-05" },
  { id: 6, ticket: "INC-2026-0006", title: "WiFi unavailable", status: "open", createdAt: "2026-07-06" },
  { id: 7, ticket: "INC-2026-0007", title: "Classroom projector", status: "resolved", createdAt: "2026-07-07" },
  { id: 8, ticket: "INC-2026-0008", title: "Incorrect grades", status: "in_progress", createdAt: "2026-07-08" },
  { id: 9, ticket: "INC-2026-0009", title: "Student ID", status: "open", createdAt: "2026-07-09" },
  { id: 10, ticket: "INC-2026-0010", title: "Laboratory equipment", status: "resolved", createdAt: "2026-07-10" },
  { id: 11, ticket: "INC-2026-0011", title: "Transcript request", status: "cancelled", createdAt: "2026-07-11" },
  { id: 12, ticket: "INC-2026-0012", title: "Financial aid", status: "rejected", createdAt: "2026-07-12" },
  { id: 13, ticket: "INC-2026-0013", title: "Campus security", status: "open", createdAt: "2026-07-13" },
  { id: 14, ticket: "INC-2026-0014", title: "Email account", status: "resolved", createdAt: "2026-07-14" },
  { id: 15, ticket: "INC-2026-0015", title: "Course registration", status: "in_progress", createdAt: "2026-07-15" },
];