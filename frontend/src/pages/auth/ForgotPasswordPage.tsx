import { AuthCenteredLayout } from "../../components/ui/templates";
import { ForgotPasswordForm } from "../../components/ui/organisms";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForgotPassword } from "../../hooks/useForgotPassword";

import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "./forgotPasswordSchema";

export default function ForgotPasswordPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const { forgotPassword, isPending, error } =
    useForgotPassword();

  const errorMessage =
    error instanceof Error ? error.message : "";

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPassword(data);
  };

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