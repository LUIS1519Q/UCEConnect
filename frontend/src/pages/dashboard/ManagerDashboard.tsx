import DashboardLayout from "../../components/DashboardLayout";

function ManagerDashboard() {
  return (
    <DashboardLayout title="Manager Dashboard">

      <div className="grid gap-4 md:grid-cols-4">

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold">
            Open
          </h3>

          <p className="mt-2 text-3xl font-bold">
            12
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold">
            In Progress
          </h3>

          <p className="mt-2 text-3xl font-bold">
            8
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold">
            Resolved
          </h3>

          <p className="mt-2 text-3xl font-bold">
            5
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="text-lg font-semibold">
            Rejected
          </h3>

          <p className="mt-2 text-3xl font-bold">
            2
          </p>
        </div>

      </div>

      <div className="mt-6">
        <a
          href="/manager/incidents"
          className="rounded-lg bg-blue-600 px-5 py-3 text-white"
        >
          Manage Incidents
        </a>
      </div>

    </DashboardLayout>
  );
}

export default ManagerDashboard;