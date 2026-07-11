import type {
  CreateIncidentResponse,
  CreatedIncident,
} from "../types/incident";
import type { CreateIncidentForm } from "../schemas/student/createIncidentSchema";

export function mockCreateIncidentResponse(
  data: CreateIncidentForm
): CreateIncidentResponse {

  const incident: CreatedIncident = {
    id: Math.floor(Math.random() * 10000),
    title: data.title,
    description: data.description,
    status: "open",
    priority: "medium",
    aiSummary: `Auto-generated summary for: ${data.title}`,
    duplicateWarning: false,
    similarIncidents: [],
    attachments: [],
    createdAt: new Date().toISOString(),
  };

  return {
    message: "Incident created successfully (mock)",
    incident,
  };
}