import { useEffect, useRef, useState } from "react";
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
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);

  const { data, isLoading, isError, refetch } = useIncidentDetail(id!);
  const { updateIncidentAsync, isPending: isSaving } = useUpdateIncident(id!);
  const { uploadAttachmentsAsync, isPending: isUploading } = useUploadAttachments(id!);

  const incident = data?.incident;
  const isOpen = incident?.status === "open";

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm<EditIncidentForm>({
    resolver: zodResolver(editIncidentSchema),
    defaultValues: { title: "", description: "" },
  });

  useEffect(() => {
    if (incident) {
      reset({
        title: incident.title,
        description: incident.description,
      });
    }
  }, [incident, reset]);

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

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeSelectedFile = (fileToRemove: File) => {
    setSelectedFiles((prev) => prev.filter((file) => file !== fileToRemove));
  };

  const isPending = isSaving || isUploading;

  const onSubmit = async (formData: EditIncidentForm) => {
    try {
      await updateIncidentAsync(formData);

      if (selectedFiles.length > 0) {
        await uploadAttachmentsAsync(selectedFiles);
      }

      navigate(`/incidents/${id}`);
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? err.response?.data?.message ?? "Something went wrong. Please try again."
        : "Something went wrong. Please try again.";

      setError("root", { message });
    }
  };

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
            onClick={() => navigate(`/incidents/${id}`)}
            className="text-sm text-primary hover:underline"
          >
            ← Back to incident detail
          </button>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-5 rounded-xl bg-surface p-5 shadow-sm sm:p-6 lg:p-7"
          >
            <div>
              <h2 className="text-xl font-semibold">Edit incident</h2>
              <p className="text-sm text-textSecondary">
                Only available while status is Open
              </p>
            </div>

            <div>
              <label className="mb-2 block font-medium">Title</label>
              <TextInput placeholder="Incident title" {...register("title")} />
              {errors.title && (
                <p className="mt-1 text-sm text-danger">{errors.title.message}</p>
              )}
            </div>

            <div>
              <label className="mb-2 block font-medium">Description</label>
              <Textarea rows={5} placeholder="Describe the incident..." {...register("description")} />
              {errors.description && (
                <p className="mt-1 text-sm text-danger">{errors.description.message}</p>
              )}
            </div>

            {data?.attachments && data.attachments.length > 0 && (
              <div>
                <h3 className="mb-2 text-base font-medium text-textPrimary">
                  Attached evidence
                </h3>
                <EvidenceSection
                  title=""
                  files={data.attachments.map((att) => ({
                    fileName: att.fileName,
                    onClick: () => {
                      window.open(att.fileUrl, "_blank", "noopener,noreferrer");
                    },
                  }))}
                />
              </div>
            )}

            <input
              hidden
              multiple
              type="file"
              ref={fileInputRef}
              onChange={handleFiles}
            />

            <EvidenceSection
              title="Add more evidence"
              emptyMessage="Drag & drop files here"
              files={selectedFiles.map((file) => ({
                fileName: file.name,
                onRemove: () => removeSelectedFile(file),
              }))}
              onAddFile={() => fileInputRef.current?.click()}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
            />

            {errors.root && (
              <p className="text-center text-sm text-danger">{errors.root.message}</p>
            )}

            <div className="flex justify-end gap-4 pt-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate(`/incidents/${id}`)}
              >
                Cancel changes
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Saving..." : "Save changes"}
              </Button>
            </div>
          </form>
        </div>
      )}
    </AppLayout>
  );
}