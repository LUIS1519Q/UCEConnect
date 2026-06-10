import DashboardLayout from "../../components/DashboardLayout";

function CreateIncidentPage() {
  return (
    <DashboardLayout title="Create Incident">

      <div className="rounded-lg bg-white p-6 shadow">

        <form className="space-y-4">

          <div>

            <label className="mb-1 block">
              Title
            </label>

            <input
              type="text"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-1 block">
              Category
            </label>

            <select
              className="w-full rounded-lg border p-3"
            >
              <option>
                Academic
              </option>

              <option>
                Administrative
              </option>

              <option>
                Technology
              </option>

              <option>
                Infrastructure
              </option>
            </select>

          </div>

          <div>

            <label className="mb-1 block">
              Description
            </label>

            <textarea
              rows={5}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Submit Incident
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default CreateIncidentPage;