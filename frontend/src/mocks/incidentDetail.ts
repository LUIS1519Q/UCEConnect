import type { GetIncidentByIdResponse } from "../types/incident";

export const mockIncidentDetails: Record<string, GetIncidentByIdResponse> = {
  "1": {
    incident: {
      id: 1,
      ticket: "INC-2026-0001",
      title: "Enrollment issue",
      description: "Student was unable to complete enrollment due to a system error during course selection.",
      status: "open",
      statusReason: null,
      priority: "high",
      aiSummary: "Student cannot complete enrollment due to system error.",
      createdAt: "2026-07-01T00:00:00Z",
      updatedAt: "2026-07-02T00:00:00Z",
    },
    attachments: [
      { id: 1, fileName: "screenshot.png", fileUrl: "https://example.com/screenshot.png" },
    ],
    conversationCount: 3,
    timeline: [
      { id: 1, status: "open", changedBy: "Student", statusComment: "Incident created.", changedAt: "2026-07-01T00:00:00Z" },
      { id: 2, status: "in_progress", changedBy: "Manager", statusComment: "Reviewing.", changedAt: "2026-07-02T00:00:00Z" },
    ],
  },

  "2": {
    incident: {
      id: 2,
      ticket: "INC-2026-0002",
      title: "Platform error",
      description: "The student portal crashed repeatedly while trying to submit an academic form.",
      status: "resolved",
      statusReason: "Issue fixed after platform update.",
      priority: "medium",
      aiSummary: "Platform crash affecting form submission, now resolved.",
      createdAt: "2026-06-15T09:00:00Z",
      updatedAt: "2026-06-18T09:00:00Z",
    },
    attachments: [],
    conversationCount: 0,
    timeline: [
      { id: 1, status: "open", changedBy: "Student", statusComment: "Incident created.", changedAt: "2026-06-15T09:00:00Z" },
      { id: 2, status: "resolved", changedBy: "Manager", statusComment: "Issue fixed after platform update.", changedAt: "2026-06-18T09:00:00Z" },
    ],
  },

  "3": {
    incident: {
      id: 3,
      ticket: "INC-2026-0003",
      title: "Library access",
      description: "Student was unable to access the digital library catalog with their credentials.",
      status: "in_progress",
      statusReason: null,
      priority: "low",
      aiSummary: "Login issue with digital library catalog.",
      createdAt: "2026-06-20T09:00:00Z",
      updatedAt: "2026-07-01T14:00:00Z",
    },
    attachments: [
      { id: 2, fileName: "receipt.pdf", fileUrl: "https://example.com/receipt.pdf" },
      { id: 3, fileName: "bank-statement.xlsx", fileUrl: "https://example.com/bank-statement.xlsx" },
    ],
    conversationCount: 5,
    timeline: [
      { id: 1, status: "open", changedBy: "Student", statusComment: "Incident created.", changedAt: "2026-06-20T09:00:00Z" },
      { id: 2, status: "in_progress", changedBy: "Manager", statusComment: "Reviewing the case.", changedAt: "2026-06-21T09:00:00Z" },
      { id: 3, status: "in_progress", changedBy: "Manager", statusComment: "Requested additional evidence.", changedAt: "2026-06-23T09:00:00Z" },
      { id: 4, status: "in_progress", changedBy: "Student", statusComment: "Uploaded new credentials.", changedAt: "2026-06-25T09:00:00Z" },
      { id: 5, status: "in_progress", changedBy: "Manager", statusComment: "Escalated to IT department.", changedAt: "2026-07-01T14:00:00Z" },
    ],
  },
};

export function getMockIncidentDetail(id: string): GetIncidentByIdResponse {
  return mockIncidentDetails[id] ?? mockIncidentDetails["1"];
}

export const mockIncidentDetail = mockIncidentDetails["1"];