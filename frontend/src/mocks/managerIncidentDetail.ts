import type { GetManagerIncidentByIdResponse } from "../types/incident";

export const mockManagerIncidentDetail: GetManagerIncidentByIdResponse = {
  incident: {
    id: 41,
    ticket: "INC-2026-0041",
    title: "Grade correction request",
    description: "Student reports that the grade registered for subject MAT-301 does not match the final exam result. Requesting review and correction by the academic department.",
    status: "open",
    statusReason: null,
    priority: "high",
    aiSummary: "Student claims a grade mismatch in MAT-301. No prior incidents on this topic. Suggested action: verify with professor and registrar.",
    createdAt: "2026-06-20T09:14:00Z",
    updatedAt: "2026-06-21T08:45:00Z",
  },
  attachments: [
    { id: 1, fileName: "exam_result.pdf", fileUrl: "https://example.com/exam_result.pdf" },
    { id: 2, fileName: "grade_screenshot.png", fileUrl: "https://example.com/grade_screenshot.png" },
  ],
  conversationCount: 3,
  timeline: [
    { id: 1, status: "open", changedBy: "Student", statusComment: "Incident submitted by student.", changedAt: "2026-06-20T09:14:00Z" },
    { id: 2, status: "in_progress", changedBy: "Manager", statusComment: "Status changed to In progress by Manager.", changedAt: "2026-06-20T11:02:00Z" },
    { id: 3, status: "in_progress", changedBy: "Manager", statusComment: "Response sent to student.", changedAt: "2026-06-21T08:45:00Z" },
  ],
  internalNotes: [
    { id: 1, note: "Contacted professor Martínez for grade verification.", author: "Manager Name", createdAt: "2026-06-20T11:10:00Z" },
  ],
};