import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

const incidents = [
  {
    id: 1,
    title: "Enrollment Delay",
    category: "Administrative",
    status: "Open",
    date: "2026-06-10",
  },
  {
    id: 2,
    title: "FEUE Platform Failure",
    category: "Platform Support",
    status: "In Progress",
    date: "2026-06-08",
  },
  {
    id: 3,
    title: "Scholarship Issue",
    category: "Student Welfare",
    status: "Resolved",
    date: "2026-06-05",
  },
];

function MyIncidentsPage() {
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
                {incident.category}
              </p>

              <div className="mt-4 flex items-center justify-between">

                <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">
                  {incident.status}
                </span>

                <span className="text-sm text-gray-500">
                  {incident.date}
                </span>

              </div>
            </Link>
          ))}

        </div>

      </div>
    </DashboardLayout>
  );
}

export default MyIncidentsPage;