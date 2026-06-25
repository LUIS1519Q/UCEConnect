import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { incidentService } from "../../api/incidentService";
import DashboardLayout from "../../components/DashboardLayout";

function IncidentDetailPage() {
  const { id } = useParams();

  const {
    data: incident,
    isLoading,
  } = useQuery({
    queryKey: ["incident", id],
    queryFn: () =>
      incidentService.getIncidentById(id!),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <DashboardLayout title="Incident Details">
        <p>Loading incident...</p>
      </DashboardLayout>
    );
  }

  if (!incident) {
    return (
      <DashboardLayout title="Incident Details">
        <p>Incident not found.</p>
      </DashboardLayout>
    );
  }
  return (
    <DashboardLayout title="Incident Details">
      <div className="space-y-6">

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">
            {incident.id}
          </h2>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Category:</strong> {incident.categoryName}
            </p>

            <p>
              <strong>Status:</strong> {incident.status}
            </p>

            <p>
              <strong>Created:</strong> {incident.createdAt}
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-3 text-xl font-semibold">
            Description
          </h3>

          <p>
            {incident.description}
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-3 text-xl font-semibold">
            Evidence
          </h3>

          <p>enrollment-document.pdf</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h3 className="mb-3 text-xl font-semibold">
            Case Timeline
          </h3>

          <div className="space-y-4">

            {incident.timeline?.map((event: any, index: number) => (
              <div
                key={index}
                className={
                  event.type === "status_change"
                    ? "border-l-4 border-blue-600 pl-4"
                    : "border-l-4 border-green-500 pl-4"
                }
              >
                <p className="font-semibold">
                  {event.type === "status_change"
                    ? `Status: ${event.content}`
                    : event.content}
                </p>

                <p className="text-sm text-gray-500">
                  {event.actor}
                  {event.actorRole ? ` (${event.actorRole})` : ""} —{" "}
                  {event.timestamp}
                </p>
              </div>
            ))}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default IncidentDetailPage;