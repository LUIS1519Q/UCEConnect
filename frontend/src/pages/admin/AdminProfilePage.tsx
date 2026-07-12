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
import { useLogout } from "../../hooks/useLogout";
import { useAuthStore } from "../../store/authStore";
import { useUnreadNotificationsCount } from "../../hooks/useUnreadNotificationsCount";

import { editProfileSchema, type EditProfileForm } from "../../schemas/manager/editProfileSchema";

import {
  LayoutDashboard,
  FileText,
  Users,
  Tags,
  Settings,
  Bell,
  User,
  LogOut,
} from "../../components/ui/icons";

import { ROUTES } from "../../constants/routes";

export default function AdminProfilePage() {
  const navigate = useNavigate();
  const { logout } = useLogout();
  const user = useAuthStore((state) => state.user);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [isEditing, setIsEditing] = useState(false);

  const { profile, isLoading, isError, refetch } = useProfile();
  const { updateProfileAsync, isPending } = useUpdateProfile();
  const { updateAvatarAsync } = useUpdateAvatar();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<EditProfileForm>({
    resolver: zodResolver(editProfileSchema),
    values: {
      firstName: profile?.firstName ?? "",
      lastName: profile?.lastName ?? "",
      phone: profile?.phone ?? "",
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

    const { compressImage } = await import("../../utils/compressImage");
    const compressedFile = await compressImage(file, { maxWidth: 512, maxHeight: 512 });
    await updateAvatarAsync(compressedFile);
  };

  const unreadCount = useUnreadNotificationsCount();

  return (
    <AppLayout
      title="Profile"
      studentName={`${user?.firstName ?? ""} ${user?.lastName ?? ""}`}
      notificationCount={unreadCount}
      onProfileClick={() => navigate(ROUTES.admin.profile)}
      onNotificationsClick={() => navigate(ROUTES.admin.notifications)}
      sidebarItems={[
        { label: "Dashboard", icon: LayoutDashboard, onClick: () => navigate(ROUTES.admin.dashboard) },
        { label: "Incidents", icon: FileText, onClick: () => navigate(ROUTES.admin.incidents) },
        { label: "Users", icon: Users, onClick: () => navigate(ROUTES.admin.users) },
        { label: "Categories", icon: Tags, onClick: () => navigate(ROUTES.admin.categories) },
        { label: "Settings", icon: Settings, onClick: () => navigate(ROUTES.admin.settings) },
        { label: "Notifications", icon: Bell, onClick: () => navigate(ROUTES.admin.notifications) },
        { label: "Profile", icon: User, active: true, onClick: () => navigate(ROUTES.admin.profile) },
      ]}
      bottomItems={[{ label: "Logout", icon: LogOut, onClick: logout }]}
    >
      {isLoading ? (
        <LoadingState title="Loading profile..." />
      ) : isError ? (
        <ErrorState title="Failed to load profile" description="Please try again." onRetry={refetch} />
      ) : (
        <div className="mx-auto w-full max-w-2xl space-y-6">

          <div className="flex flex-col items-center gap-2">
            <Avatar src={profile?.avatarUrl} alt={profile?.firstName ?? ""} size="lg" />
            <button
              type="button"
              className="text-sm text-primary hover:underline"
              onClick={() => avatarInputRef.current?.click()}
            >
              Edit photo
            </button>
            <input
              hidden
              type="file"
              accept="image/*"
              ref={avatarInputRef}
              onChange={handleAvatarChange}
            />
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="rounded-xl bg-surface p-6 shadow-sm space-y-4">
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">Email</label>
                <TextInput value={profile?.email ?? ""} disabled className="bg-background" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">Phone</label>
                <TextInput {...register("phone")} disabled={!isEditing} />
                {errors.phone && <p className="mt-1 text-xs text-danger">{errors.phone.message}</p>}
              </div>
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