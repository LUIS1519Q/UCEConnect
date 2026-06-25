import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { incidentService } from "../../api/incidentService";
import DashboardLayout from "../../components/DashboardLayout";

type Incident = {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  priority: string;
  status: string;
  createdBy: number;
  assignedTo: number | null;
  createdAt: string;
  updatedAt: string;
};

const STATUS_OPTIONS: { label: string; value: string | undefined }[] = [
  { label: "All", value: undefined },
  { label: "Open", value: "open" },
  { label: "In Progress", value: "in_progress" },
  { label: "Resolved", value: "resolved" },
  { label: "Rejected", value: "rejected" },
];

function ManagerIncidentsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);

  const {
    data: incidents = [],
    isLoading,
    isError,
  } = useQuery<Incident[]>({
    queryKey: ["incidents", statusFilter],
    queryFn: () => incidentService.getIncidents({ status: statusFilter }),
  });

  return (
    <DashboardLayout title="Manage Incidents">

      <div className="space-y-6">

        <input
          type="text"
          placeholder="Search incident..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full rounded-lg border p-3"
        />

        <div className="flex gap-3">

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

        {isLoading && <p>Loading incidents...</p>}

        {isError && <p>Failed to load incidents.</p>}

        {!isLoading && !isError && (
          <div className="space-y-4">

            {incidents.map((incident) => (

              <div
                key={incident.id}
                className="rounded-xl bg-white p-5 shadow"
              >
                <h3 className="font-semibold">
                  {incident.title}
                </h3>

                <p>
                  Category #{incident.categoryId}
                </p>

                <p>
                  {incident.status}
                </p>
              </div>

            ))}

          </div>
        )}

      </div>

    </DashboardLayout>
  );
}

export default ManagerIncidentsPage;
