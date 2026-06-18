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
            Responses
          </h3>

          <div className="rounded-lg bg-gray-100 p-4">
            <p className="font-semibold">
              Manager
            </p>

            <p className="mt-2">
              We are reviewing your request.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h3 className="mb-3 text-xl font-semibold">
            Case Timeline
          </h3>

          <div className="space-y-4">

            <div className="border-l-4 border-blue-600 pl-4">
              <p className="font-semibold">
                Incident Created
              </p>

              <p className="text-sm text-gray-500">
                2026-06-10 08:30
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-semibold">
                Assigned to Manager
              </p>

              <p className="text-sm text-gray-500">
                2026-06-10 10:15
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">
                Under Review
              </p>

              <p className="text-sm text-gray-500">
                2026-06-10 11:00
              </p>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default IncidentDetailPage;