import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AppLayout } from "../../components/ui/templates/AppLayout";
import { Avatar } from "../../components/ui/atoms/Avatar";
import { Button } from "../../components/ui/atoms/Button";
import { TextInput } from "../../components/ui/atoms/TextInput";
import { LoadingState } from "../../components/ui/organisms/LoadingState";
import { ErrorState } from "../../components/ui/organisms/ErrorState";

import { useProfile } from "../../hooks/useProfile";
import { useUpdateProfile } from "../../hooks/useUpdateProfile";
import { useUpdateAvatar } from "../../hooks/useUpdateAvatar";
import { useFaculties } from "../../hooks/useFaculties";
import { useCareers } from "../../hooks/useCareers";
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import { editProfileSchema, type EditProfileForm } from "../../schemas/student/editProfileSchema";

import {
  FilePlus2, FileText, User, CircleHelp, Info, LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

export default function ProfilePage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const unreadCount = useUnreadNotificationsCount();
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const { profile, isLoading, isError, refetch } = useProfile();
  const { updateProfileAsync, isPending } = useUpdateProfile();
  const { updateAvatarAsync } = useUpdateAvatar();
  const { faculties } = useFaculties();

  const [selectedFacultyId, setSelectedFacultyId] = useState<number | undefined>(
    profile?.faculty?.id
  );
  const { careers } = useCareers(selectedFacultyId);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema) as never,
    values: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? "",
      facultyId: profile?.faculty?.id,
      careerId: profile?.career?.id,
    },
  });

  const onSubmit = async (data: EditProfileForm) => {
    await updateProfileAsync({
      ...data,
      phone: data.phone || undefined,
    });
    setIsEditing(false);
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await updateAvatarAsync(file);
  };

  return (
    <AppLayout
      title="Profile"
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
        { label: "Profile", icon: User, active: true, onClick: () => navigate(ROUTES.student.profile) },
        { label: "Help", icon: CircleHelp, onClick: () => navigate(ROUTES.student.help) },
        { label: "About", icon: Info, onClick: () => navigate(ROUTES.student.about) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      {isLoading ? (
        <LoadingState title="Loading profile..." />
      ) : isError ? (
        <ErrorState title="Failed to load profile" description="Please try again." onRetry={refetch} />
      ) : (
        <div className="mx-auto w-full max-w-2xl space-y-6">

          {/* Avatar */}
          <div className="flex flex-col items-center gap-2">
            <Avatar src={profile?.avatarUrl} alt={profile?.firstName ?? ""} size="lg" />
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => avatarInputRef.current?.click()}
            >
              Change photo
            </button>
            <input
              hidden
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
            />
            <p className="text-lg font-semibold">{profile?.firstName} {profile?.lastName}</p>
            <p className="text-sm text-textSecondary">{profile?.email}</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
            <h3 className="font-semibold text-lg">Personal information</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">First name</label>
                <TextInput {...register("firstName")} disabled={!isEditing} />
                {errors.firstName && <p className="mt-1 text-xs text-danger">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Last name</label>
                <TextInput {...register("lastName")} disabled={!isEditing} />
                {errors.lastName && <p className="mt-1 text-xs text-danger">{errors.lastName.message}</p>}
              </div>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Institutional email</label>
              <TextInput value={profile?.email ?? ""} disabled className="bg-background" />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Faculty</label>
              <select
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm disabled:bg-background disabled:text-textSecondary"
                disabled={!isEditing}
                value={selectedFacultyId ?? ""}
                onChange={(e) => {
                  const id = Number(e.target.value);
                  setSelectedFacultyId(id);
                }}
              >
                <option value="">Select faculty</option>
                {faculties.map((f) => (
                  <option key={f.id} value={f.id}>{f.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Career</label>
              <select
                className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm disabled:bg-background disabled:text-textSecondary"
                disabled={!isEditing || !selectedFacultyId}
                {...register("careerId", { valueAsNumber: true })}
              >
                <option value="">Select career</option>
                {careers.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>

            <div className="pt-2">
              {!isEditing ? (
                <Button className="w-full" onClick={() => setIsEditing(true)}>
                  Edit profile
                </Button>
              ) : (
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    className="flex-1"
                    onClick={() => { setIsEditing(false); reset(); }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="flex-1" disabled={isPending}>
                    {isPending ? "Saving..." : "Save changes"}
                  </Button>
                </div>
              )}
            </div>
          </form>

        </div>
      )}
    </AppLayout>
  );
}