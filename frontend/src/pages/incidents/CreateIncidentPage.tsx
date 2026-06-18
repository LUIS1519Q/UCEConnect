import { useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";

function CreateIncidentPage() {

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "image/png",
      "image/jpeg",
    ];

    if (!allowedTypes.includes(file.type)) {
      alert(
        "Only PDF, JPG and PNG files are allowed."
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "File size must be less than 5 MB."
      );
      return;
    }

    setSelectedFile(file);
  };

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

          <div>

            <label className="mb-1 block">
              Evidence Attachment
            </label>

            <input
              type="file"
              accept=".pdf,.png,.jpg,.jpeg"
              onChange={handleFileChange}
              className="w-full rounded-lg border p-3"
            />

            {selectedFile && (

              <div className="mt-3 rounded-lg bg-gray-100 p-3">

                <p>
                  Selected File:
                  {" "}
                  {selectedFile.name}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setSelectedFile(null)
                  }
                  className="mt-2 rounded-lg bg-red-500 px-3 py-1 text-white"
                >
                  Remove File
                </button>

              </div>

            )}

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