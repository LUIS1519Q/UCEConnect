import { useState } from "react";

import DashboardLayout from "../../components/DashboardLayout";

const incidents = [
  {
    id: "INC-001",
    category: "Administrative",
    status: "Open",
  },
  {
    id: "INC-002",
    category: "Technology",
    status: "In Progress",
  },
  {
    id: "INC-003",
    category: "Academic",
    status: "Resolved",
  },
];

function ManagerIncidentsPage() {
  const [search, setSearch] = useState("");

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

        </div>

        <div className="space-y-4">

          {incidents.map((incident) => (

            <div
              key={incident.id}
              className="rounded-xl bg-white p-5 shadow"
            >
              <h3 className="font-semibold">
                {incident.id}
              </h3>

              <p>
                {incident.category}
              </p>

              <p>
                {incident.status}
              </p>
            </div>

          ))}

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ManagerIncidentsPage;