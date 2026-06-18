import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
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

function MyIncidentsPage() {
  
  const {
    data: incidents = [],
    isLoading,
  } = useQuery<Incident[]>({
    queryKey: ["incidents"],
    queryFn: () =>
      incidentService.getIncidents(),
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
          <button className="rounded-full bg-blue-600 px-4 py-2 text-white">
            All
          </button>

          <button className="rounded-full border px-4 py-2">
            Open
          </button>

          <button className="rounded-full border px-4 py-2">
            In Progress
          </button>

          <button className="rounded-full border px-4 py-2">
            Resolved
          </button>

          <button className="rounded-full border px-4 py-2">
            Rejected
          </button>
        </div>

        <div className="space-y-4">

          {incidents.map((incident) => (
            <Link
              key={incident.id}
              to={`/incidents/${incident.id}`}
              className="block rounded-xl bg-white p-5 shadow hover:shadow-md"
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

          {incident.status === "Open" && (
            <Link
              to="/incidents/edit"
              className="rounded-lg bg-yellow-500 px-3 py-2 text-white"
              onClick={(e) => e.stopPropagation()}
            >
              Edit
            </Link>
          )}

          {incident.status === "Open" && (
            <button
              onClick={(e) => {
                e.preventDefault();

                const confirmed = window.confirm(
                  "Are you sure you want to cancel this incident?"
                );

                if (confirmed) {
                  alert(
                    "Incident cancelled successfully."
                  );
                }
              }}
              className="rounded-lg bg-red-600 px-3 py-2 text-white"
            >
              Cancel
            </button>
          )}

          </div>

        </div>
            </Link>
          ))}

        </div>

      </div>
    </DashboardLayout>
  );
}

export default MyIncidentsPage;