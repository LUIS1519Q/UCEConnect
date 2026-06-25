import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";

import { incidentService } from "../../api/incidentService";
import DashboardLayout from "../../components/DashboardLayout";

function EditIncidentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const [categoryId, setCategoryId] = useState("1");
  const [description, setDescription] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const { data: incident, isLoading } = useQuery({
    queryKey: ["incident", id],
    queryFn: () => incidentService.getIncidentById(id!),
    enabled: !!id,
  });

  useEffect(() => {
    if (incident) {
      setTitle(incident.title);
      setDescription(incident.description);
      setCategoryId(String(incident.categoryId));
    }
  }, [incident]);

  const { mutate, isPending } = useMutation({
    mutationFn: (data: {
      title: string;
      description: string;
      categoryId: number;
    }) => incidentService.updateIncident(id!, data),

    onSuccess: () => {
      navigate("/incidents");
    },

    onError: (error: any) => {
      setErrorMessage(
        error?.response?.data?.message ?? "Failed to update incident."
      );
    },
  });

  const handleSubmit = (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    mutate({
      title,
      description,
      categoryId: Number(categoryId),
    });
  };

  if (isLoading) {
    return (
      <DashboardLayout title="Edit Incident">
        <p>Loading incident...</p>
      </DashboardLayout>
    );
  }

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-lg border p-3"
            />

          </div>

          <div>

            <label className="mb-1 block">
              Category
            </label>

            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
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
              onChange={(e) => setDescription(e.target.value)}
              className="w-full rounded-lg border p-3"
            />

          </div>

          {errorMessage && (
            <p className="text-red-500 text-sm">{errorMessage}</p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-blue-600 px-5 py-3 text-white disabled:opacity-70"
          >
            {isPending ? "Saving..." : "Save Changes"}
          </button>

        </form>

      </div>

    </DashboardLayout>
  );
}

export default EditIncidentPage;
