import { useNavigate, useLocation, } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/authService";
import { useEffect } from "react";

import { AuthCenteredLayout } from "../../components/ui/templates";
import { ResetPasswordForm } from "../../components/ui/organisms";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "./resetPasswordSchema";

export default function ResetPasswordPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const {
    email = "",
    code = "",
  } = (location.state as {
    email?: string;
    code?: string;
  }) ?? {};

  useEffect(() => {
    if (!email || !code) {
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authService.resetPassword({
        email,
        code,
        newPassword: data.password,
      }),

    onSuccess: () => {
      navigate("/login");
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutate(data);
  };

  const errorMessage =
    error instanceof Error
      ? error.message
      : "";

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