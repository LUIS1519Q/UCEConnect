import type { GetIncidentByIdResponse } from "../types/incident";

export const mockIncidentDetail: GetIncidentByIdResponse = {
  incident: {
    id: 1,
    ticket: "INC-2026-0001",
    title: "Enrollment issue",
    description: "Student was unable to complete enrollment due to a system error during course selection.",
    status: "in_progress",
    statusReason: null,
    priority: "high",
    aiSummary: "Student cannot complete enrollment due to system error.",
    createdAt: "2026-07-01T00:00:00Z",
    updatedAt: "2026-07-02T00:00:00Z",
  },
  attachments: [
    { id: 1, fileName: "screenshot.png", fileType: "image/png", url: "https://example.com/screenshot.png" },
  ],
  conversationCount: 3,
  timeline: [
    { id: 1, status: "open", changedBy: "Student", statusComment: "Incident created.", changedAt: "2026-07-01T00:00:00Z" },
    { id: 2, status: "in_progress", changedBy: "Manager", statusComment: "Reviewing.", changedAt: "2026-07-02T00:00:00Z" },
  ],
};