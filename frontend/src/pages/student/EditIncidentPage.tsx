import { useNavigate } from "react-router-dom";

import DashboardLayout from "../../components/DashboardLayout";

function EditIncidentPage() {
  const navigate = useNavigate();

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    alert(
      "Incident updated successfully."
    );

    navigate("/incidents");
  };

  return (
    <DashboardLayout title="Edit Incident">

      <div className="rounded-lg bg-white p-6 shadow">

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>

            <label className="mb-1 block">
              Title
            </label>

            <input
              type="text"
              defaultValue="Enrollment Delay"
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-1 block">
              Category
            </label>

            <select
              defaultValue="Administrative"
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
              defaultValue="Delay in enrollment process."
              className="w-full rounded-lg border p-3"
            />

          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            Save Changes
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default EditIncidentPage;