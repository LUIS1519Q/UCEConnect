import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { AuthCenteredLayout } from "../../components/ui/templates";
import { ResetPasswordForm } from "../../components/ui/organisms";

import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "./resetPasswordSchema";

export default function ResetPasswordPage() {
  const navigate = useNavigate();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    console.log(data);

    alert("Password updated successfully.");

    navigate("/login");
  };

  return (
    <AuthCenteredLayout
      title="Reset Password"
      description="Create a new password for your account."
    >
      <ResetPasswordForm
        onSubmit={handleSubmit(onSubmit)}
        control={control}
        errors={errors}
      />
    </AuthCenteredLayout>
  );
}