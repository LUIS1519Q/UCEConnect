import { useLocation } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCenteredLayout } from "../../components/ui/templates";
import { ResetPasswordForm } from "../../components/ui/organisms";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "../../schemas/auth/resetPasswordSchema";

import { useResetPassword } from "../../hooks/useResetPassword";

export default function ResetPasswordPage() {
  const location = useLocation();

  const { resetToken } =
    (location.state as {
      resetToken?: string
    }) ?? {};

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { onSubmit, isPending, error } =
    useResetPassword({ resetToken: resetToken ?? "" });

  const errorMessage =
    error instanceof Error ? error.message : "";

  return (
    <AuthCenteredLayout
      title="Reset Password"
      description="Create a new password for your account."
    >
      <ResetPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
        isPending={isPending}
        error={errorMessage}
      />
    </AuthCenteredLayout>
  );
}