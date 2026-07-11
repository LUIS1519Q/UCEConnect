import type {
  SimilarIncidentResponse,
  GetSimilarIncidentResponse,
} from "../types/incident";

export const mockSimilarIncidentResponse: SimilarIncidentResponse = {
  similarIncidents: [
    { id: 1, title: "Enrollment issue" },
    { id: 6, title: "WiFi unavailable" },
    { id: 9, title: "Student ID" },
  ],
};

export const mockSimilarIncidentDetail: GetSimilarIncidentResponse = {
  incident: {
    id: 1,
    title: "Enrollment issue",
    description: "Student was unable to complete enrollment due to a system error during course selection.",
    status: "resolved",
    statusReason: "The enrollment system was restarted and the student was able to complete the process.",
    updatedAt: "2026-07-01T00:00:00Z",
  },
};