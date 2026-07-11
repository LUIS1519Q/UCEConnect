import type {
  SimilarIncidentResponse,
  GetSimilarIncidentResponse,
} from "../types/incident";

export const mockSimilarIncidentResponse: SimilarIncidentResponse = {
  data: [
    { id: 1, title: "Enrollment issue" },
    { id: 6, title: "WiFi unavailable" },
    { id: 9, title: "Student ID" },
  ],
};

export const mockSimilarIncidentDetail: GetSimilarIncidentResponse = {
  incident: {
    id: 1,
    ticket: "INC-2026-0001",
    title: "Enrollment issue",
    description:
      "Student was unable to complete enrollment due to a system error during course selection.",
    status: "resolved",
    createdAt: "2026-07-01",
    resolution:
      "The enrollment system was restarted and the student was able to complete the process.",
  },
};