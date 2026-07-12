import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";

import { compressImages } from "../../utils/compressImage";

import {
  FilePlus2,
  FileText,
  User,
  CircleHelp,
  Info,
  LogOut,
} from "../../components/ui/icons";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Button } from "../../components/ui/atoms/Button";
import { TextInput } from "../../components/ui/atoms/TextInput";
import { Textarea } from "../../components/ui/atoms/Textarea";
import { EvidenceSection } from "../../components/ui/organisms/EvidenceSection";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";

import { useIncidentDetail } from "../../hooks/useIncidentDetail";
import { useUpdateIncident } from "../../hooks/useUpdateIncident";
import { useUploadAttachments } from "../../hooks/useUploadAttachments";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";

import {
  editIncidentSchema,
  type EditIncidentForm,
} from "../../schemas/student/editIncidentSchema";

import { ROUTES } from "../../constants/routes";

export default function EditIncidentPage() {
  const { id } = useParams<{ id: string }>();
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

  const handleFiles = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newFiles = Array.from(event.target.files ?? []);
    const compressedFiles = await compressImages(newFiles);
    setSelectedFiles((prev) => [...prev, ...compressedFiles]);
    event.target.value = "";
  };

  const handleDrop = async (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const newFiles = Array.from(event.dataTransfer.files);
    const compressedFiles = await compressImages(newFiles);
    setSelectedFiles((prev) => [...prev, ...compressedFiles]);
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

  const unreadCount = useUnreadNotificationsCount();

  return (
    <AppLayout
      title="Edit incident"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.student.profile)}
      onNotificationsClick={() => navigate(ROUTES.student.notifications)}
      primaryAction={{
        label: "New Incident",
        icon: FilePlus2,
        onClick: () => navigate(ROUTES.student.createIncident),
      }}
      sidebarItems={[
        { label: "My Incidents", icon: FileText, onClick: () => navigate(ROUTES.student.myIncidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.student.profile) },
        { label: "Help", icon: CircleHelp, onClick: () => navigate(ROUTES.student.help) },
        { label: "About", icon: Info, onClick: () => navigate(ROUTES.student.about) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
      mobileTabItems={[
        { label: "My Incidents", icon: FileText, active: true, onClick: () => navigate(ROUTES.student.myIncidents) },
        { label: "Profile", icon: User, onClick: () => navigate(ROUTES.student.profile) },
      ]}
      mobileMoreMenuItems={[
        { label: "Help & FAQ", icon: CircleHelp, onClick: () => navigate(ROUTES.student.help) },
        { label: "About UCEConnect", icon: Info, onClick: () => navigate(ROUTES.student.about) },
        { label: "Logout", icon: LogOut, onClick: logout },
      ]}
    >
      {isLoading ? (
        <LoadingState title="Loading incident..." />
      ) : isError ? (
        <ErrorState title="Failed to load incident" description="Please try again." onRetry={refetch} />
      ) : !isOpen ? (
        <div className="mx-auto w-full max-w-2xl space-y-4 text-center">
          <p className="text-textSecondary">
            This incident can no longer be edited because its status is not Open.
          </p>
          <Button variant="secondary" onClick={() => navigate(`/incidents/${id}`)}>
            ← Back to incident detail
          </Button>
        </div>
      ) : (
        <div className="mx-auto w-full max-w-4xl space-y-4">
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
