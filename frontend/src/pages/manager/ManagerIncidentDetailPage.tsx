import { useParams } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { incidentService } from "../../api/incidentService";
import DashboardLayout from "../../components/DashboardLayout";

function ManagerIncidentDetailPage() {

  const { id } = useParams();

  const { mutate: updateStatus } = useMutation({
    mutationFn: (status: string) =>
      incidentService.updateIncidentStatus(
        id!,
        status
      ),

    onSuccess: () => {
      alert("Status updated successfully.");
    },
  });

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

          <div className="mt-4 flex gap-3">

            <button
              onClick={() =>
                updateStatus("in_progress")
              }
              className="rounded-lg bg-yellow-500 px-4 py-2 text-white"
            >
              In Progress
            </button>

            <button
              onClick={() =>
                updateStatus("resolved")
              }
              className="rounded-lg bg-green-600 px-4 py-2 text-white"
            >
              Resolve
            </button>

            <button
              onClick={() =>
                updateStatus("rejected")
              }
              className="rounded-lg bg-red-600 px-4 py-2 text-white"
            >
              Reject
            </button>

          </div>

        </div>
        
        {/* Internal Notes */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-bold">
            Internal Notes
          </h2>

          <textarea
            rows={4}
            placeholder="Write internal notes..."
            className="mt-4 w-full rounded-lg border p-3"
          />

          <button
            className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white"
          >
            Save Note
          </button>

        </div>

        {/* Feedback Request */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-bold">
            Feedback Request
          </h2>

          <textarea
            rows={4}
            placeholder="Request additional information..."
            className="mt-4 w-full rounded-lg border p-3"
          />

          <button
            className="mt-4 rounded-lg bg-green-600 px-4 py-2 text-white"
          >
            Send Request
          </button>

        </div>

        {/* Student Response */}
        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-xl font-bold">
            Student Response
          </h2>

          <p className="mt-3 text-gray-600">
            I have attached the requested enrollment document.
          </p>

        </div>
      </div>

    </DashboardLayout>
  );
}

export default ManagerIncidentDetailPage;