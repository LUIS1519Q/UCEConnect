import { Link } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

function AISuggestionPage() {
  return (
    <DashboardLayout title="AI Analysis">

      <div className="space-y-6">

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-2xl font-bold">
            Suggested Category
          </h2>

          <p className="mt-4 text-lg">
            Administrative
          </p>

        </div>

        <div className="rounded-xl bg-white p-6 shadow">

          <h2 className="text-2xl font-bold">
            Possible Duplicates
          </h2>

          <ul className="mt-4 list-disc pl-6">

            <li>
              Enrollment Delay
            </li>

            <li>
              Registration Issue
            </li>

          </ul>

        </div>

        <div className="flex gap-4">

          <Link
            to="/incidents"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Confirm
          </Link>

          <Link
            to="/incidents/create"
            className="rounded-lg border px-5 py-3"
          >
            Back
          </Link>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default AISuggestionPage;