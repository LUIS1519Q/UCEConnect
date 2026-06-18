import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { incidentService } from "../../api/incidentService";
import DashboardLayout from "../../components/DashboardLayout";

type Incident = {
  id: number;
  title: string;
  category?: string;
  categoryName?: string;
  status: string;
  createdAt?: string;
  date?: string;
};

const STATUS_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

function MyIncidentsPage() {

  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const {
    data: incidents = [],
    isLoading,
  } = useQuery<Incident[]>({
    queryKey: ["incidents", statusFilter],
    queryFn: () =>
      incidentService.getIncidents({ status: statusFilter }),
  });

  const { mutate: cancelIncident } = useMutation({
    mutationFn: (incidentId: number) =>
      incidentService.cancelIncident(incidentId),

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["incidents"] });
      alert("Incident cancelled successfully.");
    },

    onError: (error: any) => {
      alert(
        error?.response?.data?.message ?? "Failed to cancel incident."
      );
    },
  });

  if (isLoading) {
    return (
      <DashboardLayout title="My Incidents">
        <p>Loading incidents...</p>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="My Incidents">
      <div className="space-y-6">

        <div className="flex justify-end">
        <Link
            to="/incidents/create"
            className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
            Create Incident
        </Link>
        </div>

        <div className="flex flex-wrap gap-3">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.label}
              onClick={() => setStatusFilter(opt.value)}
              className={
                statusFilter === opt.value
                  ? "rounded-full bg-blue-600 px-4 py-2 text-white"
                  : "rounded-full border px-4 py-2"
              }
            >
              {opt.label}
            </button>
          ))}
        </div>

        <div className="space-y-4">

          {incidents.map((incident) => (
            <div
              key={incident.id}
              onClick={() => navigate(`/incidents/${incident.id}`)}
              className="block rounded-xl bg-white p-5 shadow hover:shadow-md cursor-pointer"
            >
              <h3 className="text-xl font-semibold">
                {incident.title}
              </h3>

              <p className="mt-1 text-gray-500">
                {incident.categoryName ?? incident.category}
              </p>

        <div className="mt-4 flex items-center justify-between">

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
            {incident.status}
          </span>

          <div className="flex items-center gap-3">

            <span className="text-sm text-gray-500">
              {incident.createdAt ?? incident.date}
            </span>

          {incident.status === "open" && (
            <Link
              to={`/incidents/${incident.id}/edit`}
              className="rounded-lg bg-yellow-500 px-3 py-2 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Link>
          )}

          {incident.status === "open" && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();

                const confirmed = window.confirm(
                  "Are you sure you want to cancel this incident?"
                );

                if (confirmed) {
                  cancelIncident(incident.id);
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-white"
            >
              Cancel
            </button>
          )}

          </div>

        </div>
            </div>
          ))}

        </div>

      </div>
    </DashboardLayout>
  );
}

export default MyIncidentsPage;