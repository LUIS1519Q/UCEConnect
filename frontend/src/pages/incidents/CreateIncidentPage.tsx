import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { incidentService } from "../../api/incidentService";
import DashboardLayout from "../../components/DashboardLayout";

function CreateIncidentPage() {

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [description, setDescription] =
    useState("");

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

  const { mutate, isPending } = useMutation({
    mutationFn: (data: FormData) =>
      incidentService.createIncident(data),

    onSuccess: () => {
      alert("Incident created successfully.");
    },
  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const formData = new FormData();

    formData.append("title", title);
    formData.append(
      "description",
      description
    );
    formData.append(
      "categoryId",
      categoryId
    );

    mutate(formData);
  };

  return (
    <DashboardLayout title="Create Incident">

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
              value={title}
              onChange={(e) =>
                setTitle(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-1 block">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) =>
                setCategoryId(e.target.value)
              }
              className="w-full rounded-lg border p-3"
            >
              <option value="1">
                Academic
              </option>

              <option value="2">
                Administrative
              </option>

              <option value="3">
                Technology
              </option>

              <option value="4">
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
              value={description}
              onChange={(e) =>
                setDescription(e.target.value)
              }
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

        <div className="flex gap-3">

          <button
            type="button"
            onClick={() =>
              window.location.href =
                "/incidents/ai-suggestion"
            }
            className="rounded-lg bg-purple-600 px-5 py-3 text-white"
          >
            Analyze with AI
          </button>

          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-5 py-3 text-white"
          >
            {isPending
              ? "Submitting..."
              : "Submit Incident"}
          </button>

        </div>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default CreateIncidentPage;