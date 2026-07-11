import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  useForm,
  useWatch,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppLayout } from "../../components/ui/templates/AppLayout";

import { Button } from "../../components/ui/atoms/Button";
import { TextInput } from "../../components/ui/atoms/TextInput";
import { Textarea } from "../../components/ui/atoms/Textarea";

import { EvidenceSection } from "../../components/ui/organisms/EvidenceSection";

import { SimilarIncidentSection } from "../../components/ui/organisms/SimilarIncidentSection";

import { SimilarIncidentModal } from "../../components/ui/organisms/SimilarIncidentModal";

import {
  createIncidentSchema,
  type CreateIncidentForm,
} from "../../schemas/student/createIncidentSchema";

import { useCreateIncident } from "../../hooks/useCreateIncident";
import { useSimilarIncident } from "../../hooks/useSimilarIncident";
import { useSimilarIncidentDetail } from "../../hooks/useSimilarIncidentDetail";

import { ROUTES } from "../../constants/routes";

import {
  FilePlus2,
  FileText,
  User,
  CircleHelp,
  Info,
  LogOut,
} from "../../components/ui/icons";

import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";

export default function CreateIncidentPage() {

  const navigate = useNavigate();

  const { logout } = useLogout();

  const user = useAuthStore(
    (state) => state.user
  );

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const [selectedFiles, setSelectedFiles] =
    useState<File[]>([]);

  const [selectedIncidentId, setSelectedIncidentId] =
    useState<number>();

  const [isModalOpen, setModalOpen] =
    useState(false);

  const [dismissedIncidentId, setDismissedIncidentId] =
    useState<number | null>(null);

  const {
    createIncidentAsync,
    isPending,
  } = useCreateIncident();

  const {
    findSimilarAsync,
    data: similarIncidents,
    isPending: isSearching,
  } = useSimilarIncident();

  const {
    data: incidentDetail,
    isLoading: isLoadingDetail,
    isError: isErrorDetail,
    refetch: refetchDetail,
  } = useSimilarIncidentDetail(
    selectedIncidentId
  );
console.log("incidentDetail:", incidentDetail);
  const {
    register,
    handleSubmit,
    setValue,
    control,
    formState: { errors },
  } = useForm<CreateIncidentForm>({
    resolver: zodResolver(createIncidentSchema) as never,
    defaultValues: {
      title: "",
      description: "",
      files: [],
    },
  });

  const title = useWatch({
    control,
    name: "title",
  });

  const description = useWatch({
    control,
    name: "description",
  });

  useEffect(() => {
    const trimmedTitle = title?.trim() ?? "";
    const trimmedDescription =
      description?.trim() ?? "";

    if (
      trimmedTitle.length < 5 ||
      trimmedDescription.length < 10
    ) {
      return;
    }

    const timeout = setTimeout(() => {
      findSimilarAsync({
        title: trimmedTitle,
        description: trimmedDescription,
      });
    }, 500);

    return () => clearTimeout(timeout);

  }, [
    title,
    description,
    findSimilarAsync,
  ]);

  const handleFiles = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {

    const newFiles =
      Array.from(event.target.files ?? []);

    const updatedFiles = [
      ...selectedFiles,
      ...newFiles,
    ];

    setSelectedFiles(updatedFiles);

    setValue("files", updatedFiles, {
      shouldValidate: true,
    });

    event.target.value = "";
  };

  const handleDrop = (
  event: React.DragEvent<HTMLDivElement>
) => {

  event.preventDefault();

  const newFiles = Array.from(
    event.dataTransfer.files
  );

  const updatedFiles = [
    ...selectedFiles,
    ...newFiles,
  ];

  setSelectedFiles(updatedFiles);

  setValue("files", updatedFiles, {
    shouldValidate: true,
  });

  };

  const handleDragOver = (
    event: React.DragEvent<HTMLDivElement>
  ) => {
    event.preventDefault();
  };

  const removeFile = (
    fileToRemove: File
  ) => {

    const updated =
      selectedFiles.filter(
        (file) => file !== fileToRemove
      );

    setSelectedFiles(updated);

    setValue("files", updated, {
      shouldValidate: true,
    });
  };

  const onSubmit = async (
    data: CreateIncidentForm
  ) => {
    await createIncidentAsync(data);

    navigate(ROUTES.student.myIncidents);
  };

  const firstSimilar =
    similarIncidents?.data[0];

  return (

    <AppLayout
      title="Create Incident"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={0}
      onProfileClick={() => navigate(ROUTES.student.profile)}
      onNotificationsClick={() => navigate(ROUTES.student.notifications)}
      primaryAction={{
        label: "New Incident",
        icon: FilePlus2,
        active: true,
      }}
      sidebarItems={[
        {
          label: "My Incidents",
          icon: FileText,
          onClick: () => navigate(ROUTES.student.myIncidents),
        },
        {
          label: "Profile",
          icon: User,
          onClick: () => navigate(ROUTES.student.profile),
        },
        {
          label: "Help",
          icon: CircleHelp,
          onClick: () => navigate(ROUTES.student.help),
        },
        {
          label: "About",
          icon: Info,
          onClick: () => navigate(ROUTES.student.about),
        },
      ]}
      bottomItems={[
        {
          label: "Logout",
          icon: LogOut,
          onClick: logout,
        },
      ]}
    >
      <div className="mx-auto w-full max-w-4xl">
      <SimilarIncidentModal
        open={isModalOpen}
        isLoading={isLoadingDetail}
        isError={isErrorDetail}
        onRetry={refetchDetail}
        incident={
          incidentDetail?.incident
            ? {
                ticket: incidentDetail.incident.ticket,
                title: incidentDetail.incident.title,
                date: incidentDetail.incident.createdAt,
                status: incidentDetail.incident.status,
                resolution:
                  incidentDetail.incident.resolution ?? "No resolution yet.",
              }
            : null
        }
        onClose={() => setModalOpen(false)}
      />

      <div className="mx-auto w-full max-w-4xl">

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="
            space-y-5
            rounded-xl
            bg-surface
            p-5
            shadow-sm
            sm:p-6
            lg:p-7
            "
        >

          <div>
            <label className="mb-2 block font-medium">
              Title
            </label>

            <TextInput
              placeholder="Incident title"
              {...register("title")}
            />

            {errors.title && (
              <p className="mt-1 text-sm text-danger">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="mb-2 block font-medium">
              Description
            </label>

            <Textarea
              rows={5}
              placeholder="Describe the incident..."
              {...register("description")}
            />

            {errors.description && (
              <p className="mt-1 text-sm text-danger">
                {errors.description.message}
              </p>
            )}
          </div>

          <SimilarIncidentSection
            hasSearched={
              title.trim().length >= 5 &&
              description.trim().length >= 10
            }
            isLoading={isSearching}
            incident={
              firstSimilar &&
              firstSimilar.id !== dismissedIncidentId
                ? {
                    id: firstSimilar.id,
                    ticket: "Possible duplicate",
                    title: firstSimilar.title,
                    status: "Open",
                  }
                : undefined
            }
            onViewDetails={() => {
              setSelectedIncidentId(firstSimilar!.id);
              setModalOpen(true);
            }}
            onDismiss={() =>
              setDismissedIncidentId(firstSimilar!.id)
            }
          />

          <input
            hidden
            multiple
            type="file"
            ref={fileInputRef}
            onChange={handleFiles}
          />

          <EvidenceSection
            files={selectedFiles.map((file) => ({
              fileName: file.name,
              fileSize: `${(file.size / 1024 / 1024).toFixed(2)} MB`,
              onRemove: () => removeFile(file),
            }))}
            onAddFile={() => fileInputRef.current?.click()}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />

          <div className="flex justify-end gap-4 pt-2">
            <Button
              variant="secondary"
              onClick={() =>
                navigate(ROUTES.student.myIncidents)
              }
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={isPending}
            >
              {isPending
                ? "Creating..."
                : "Create Incident"}
            </Button>
          </div>

        </form>

      </div>
      </div>
    </AppLayout>
  );
}
