import { AuthCenteredLayout } from "../../components/ui/templates";
import { ForgotPasswordForm } from "../../components/ui/organisms";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { authService } from "../../api/authService";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "./forgotPasswordSchema";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      authService.forgotPassword(data),

    onSuccess: (_, variables) => {
      navigate("/verify-email", {
        state: {
          email: variables.email,
          flow: "forgot-password",
        },
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    mutate(data);
  };
  
  const errorMessage =
    error instanceof Error
      ? error.message
      : "";

  return (
    <AuthCenteredLayout
      title="Forgot Password"
      description="Enter your institutional email."
    >
      <ForgotPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isPending={isPending}
        error={errorMessage}
      />
    </AuthCenteredLayout>
  );
}