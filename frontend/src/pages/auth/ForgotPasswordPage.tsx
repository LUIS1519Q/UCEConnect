import { AuthCenteredLayout } from "../../components/ui/templates";
import { ForgotPasswordForm } from "../../components/ui/organisms";

import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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

  const onSubmit = (
    data: ForgotPasswordFormData
  ) => {
    console.log(data);

    alert("Recovery email sent successfully.");

    navigate("/reset-password");
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
      />
    </AuthCenteredLayout>
  );
}