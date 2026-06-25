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

  const [errors, setErrors] = useState<{
    title?: string;
    description?: string;
  }>({});

  const [mutationError, setMutationError] = useState("");

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
    mutationFn: (data: {
      title: string;
      description: string;
      categoryId: number;
    }) => incidentService.createIncident(data),

    onSuccess: () => {
      alert("Incident created successfully.");
    },

    onError: (error: any) => {
      setMutationError(
        error?.response?.data?.message ?? "Failed to create incident."
      );
    },
  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    const newErrors: { title?: string; description?: string } = {};

    if (!title || title.trim().length < 5) {
      newErrors.title = "El título debe tener al menos 5 caracteres";
    }
    if (!description || description.trim().length < 10) {
      newErrors.description = "La descripción debe tener al menos 10 caracteres";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});

    mutate({
      title,
      description,
      categoryId: Number(categoryId),
    });
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
              onChange={(e) => {
                setTitle(e.target.value);
                if (errors.title)
                  setErrors((prev) => ({ ...prev, title: undefined }));
              }}
              className="w-full rounded-lg border p-3"
            />

            {errors.title && (
              <p className="text-red-500 text-sm mt-1">{errors.title}</p>
            )}

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
              onChange={(e) => {
                setDescription(e.target.value);
                if (errors.description)
                  setErrors((prev) => ({ ...prev, description: undefined }));
              }}
              className="w-full rounded-lg border p-3"
            />

            {errors.description && (
              <p className="text-red-500 text-sm mt-1">{errors.description}</p>
            )}

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

        {mutationError && (
          <p className="text-red-500 text-sm">{mutationError}</p>
        )}

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