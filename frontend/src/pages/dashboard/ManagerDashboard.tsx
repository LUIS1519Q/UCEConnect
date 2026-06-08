import DashboardLayout from "../../components/DashboardLayout";

function ManagerDashboard() {
  return (
    <DashboardLayout title="Manager Dashboard">
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="text-xl font-semibold">
          Welcome Manager
        </h3>

        <p className="mt-2 text-gray-600">
          This is your dashboard.
        </p>
      </div>
    </DashboardLayout>
  );
}

export default ManagerDashboard;