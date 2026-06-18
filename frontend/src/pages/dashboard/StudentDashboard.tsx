import { Link } from "react-router-dom";
import DashboardLayout from "../../components/DashboardLayout";

function StudentDashboard() {
  return (
    <DashboardLayout title="Student Dashboard">

      <div className="rounded-lg bg-white p-6 shadow">

        <h3 className="text-xl font-semibold">
          Welcome Student
        </h3>

        <p className="mt-2 text-gray-600">
          Manage your incidents and track their status.
        </p>

        <Link
          to="/incidents"
          className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          My Incidents
        </Link>

        <Link
          to="/profile"
          className="rounded-lg bg-green-600 px-5 py-3 text-white"
        >
          My Profile
        </Link>

      </div>

    </DashboardLayout>
  );
}

export default StudentDashboard;