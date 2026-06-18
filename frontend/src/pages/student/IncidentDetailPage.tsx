import DashboardLayout from "../../components/DashboardLayout";

function IncidentDetailPage() {
  return (
    <DashboardLayout title="Incident Details">
      <div className="space-y-6">

        <div className="rounded-xl bg-white p-6 shadow">
          <h2 className="text-2xl font-bold">
            INC-001
          </h2>

          <div className="mt-4 space-y-2">
            <p>
              <strong>Category:</strong> Administrative
            </p>

            <p>
              <strong>Status:</strong> Open
            </p>

            <p>
              <strong>Created:</strong> 2026-06-10
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-3 text-xl font-semibold">
            Description
          </h3>

          <p>
            There is a delay in my enrollment
            process and I need assistance.
          </p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-3 text-xl font-semibold">
            Evidence
          </h3>

          <p>enrollment-document.pdf</p>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">
          <h3 className="mb-3 text-xl font-semibold">
            Responses
          </h3>

          <div className="rounded-lg bg-gray-100 p-4">
            <p className="font-semibold">
              Manager
            </p>

            <p className="mt-2">
              We are reviewing your request.
            </p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h3 className="mb-3 text-xl font-semibold">
            Case Timeline
          </h3>

          <div className="space-y-4">

            <div className="border-l-4 border-blue-600 pl-4">
              <p className="font-semibold">
                Incident Created
              </p>

              <p className="text-sm text-gray-500">
                2026-06-10 08:30
              </p>
            </div>

            <div className="border-l-4 border-yellow-500 pl-4">
              <p className="font-semibold">
                Assigned to Manager
              </p>

              <p className="text-sm text-gray-500">
                2026-06-10 10:15
              </p>
            </div>

            <div className="border-l-4 border-green-500 pl-4">
              <p className="font-semibold">
                Under Review
              </p>

              <p className="text-sm text-gray-500">
                2026-06-10 11:00
              </p>
            </div>

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default IncidentDetailPage;