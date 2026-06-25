import DashboardLayout from "../../components/DashboardLayout";
import { Link } from "react-router-dom";

function StudentIncidentsPage() {
  return (
    <DashboardLayout title="My Incidents">

      <div className="mb-6 flex justify-end">
        <Link
          to="/incidents/create"
          className="rounded-lg bg-blue-600 px-4 py-2 text-white"
        >
          Create Incident
        </Link>
      </div>

      <div className="rounded-lg bg-white p-6 shadow">

        <table className="w-full">

          <thead>
            <tr className="border-b">

              <th className="p-3 text-left">
                Ticket
              </th>

              <th className="p-3 text-left">
                Category
              </th>

              <th className="p-3 text-left">
                Status
              </th>

            </tr>
          </thead>

          <tbody>

            <tr>

              <td className="p-3">
                INC-001
              </td>

              <td className="p-3">
                Academic
              </td>

              <td className="p-3">
                Open
              </td>

            </tr>

          </tbody>

        </table>

      </div>

    </DashboardLayout>
  );
}

export default StudentIncidentsPage;