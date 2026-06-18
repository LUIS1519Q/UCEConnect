import { useState } from "react";

import DashboardLayout from "../../components/DashboardLayout";

function CreateIncidentPage() {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    console.log({
      title,
      category,
      description,
    });

    alert(
      "Incident submitted successfully."
    );
  };

  return (
    <DashboardLayout title="Create Incident">
      <div className="max-w-2xl rounded-xl bg-white p-6 shadow">

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >

          <div>
            <label className="mb-1 block font-medium">
              Category
            </label>

            <select
              value={category}
              onChange={(e) =>
                setCategory(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="">
                Select a category
              </option>

              <option value="ACADEMIC">
                Academic
              </option>

              <option value="ADMINISTRATIVE">
                Administrative
              </option>

              <option value="INFRASTRUCTURE">
                Infrastructure
              </option>

              <option value="STUDENT_WELFARE">
                Student Welfare
              </option>

              <option value="PLATFORM_SUPPORT">
                Platform Support
              </option>
            </select>
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              placeholder="Incident title"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Description
            </label>

            <textarea
              rows={5}
              value={description}
              onChange={(e) =>
                setDescription(
                  e.target.value
                )
              }
              placeholder="Describe the issue"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Evidence (Optional)
            </label>

            <input
              type="file"
              className="w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-3 text-white"
          >
            Submit Incident
          </button>

        </form>

      </div>
    </DashboardLayout>
  );
}

export default CreateIncidentPage;