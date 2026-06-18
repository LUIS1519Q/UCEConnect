import DashboardLayout from "../../components/DashboardLayout";

function ManagerIncidentDetailPage() {
  return (
    <DashboardLayout title="Incident Detail (Manager)">

      <div className="space-y-6">

        {/* AI Summary */}
        <div className="rounded-xl bg-purple-50 p-6 shadow">

          <h2 className="text-xl font-bold">
            AI Summary
          </h2>

          <p className="mt-3 text-gray-700">
            The student is experiencing an enrollment delay due to pending administrative approval.
            Priority: Medium.
          </p>

        </div>

        {/* Incident Info */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-2xl font-bold">
            INC-001
          </h2>

          <p className="mt-2">
            Category: Administrative
          </p>

          <p>
            Status: Open
          </p>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default ManagerIncidentDetailPage;