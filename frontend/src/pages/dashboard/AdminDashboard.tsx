import DashboardLayout from "../../components/DashboardLayout";

function AdminDashboard() {
  return (
    <DashboardLayout title="Admin Dashboard">
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-xl font-semibold">
          Welcome Admin
        </h3>

        <p className="mt-2 text-gray-600">
          This is your dashboard.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default AdminDashboard;