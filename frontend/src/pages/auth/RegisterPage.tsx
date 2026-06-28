import { AuthCenteredLayout } from "../../components/ui/templates";
import { RegisterForm } from "../../components/ui/organisms";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { registerSchema, type RegisterFormData } from "./registerSchema";
import { authService } from "../../api/authService";

export default function RegisterPage() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { mutate, isPending, error } = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: "student",
      }),
    onSuccess: (_, variables) => {
      navigate("/verify-code", {
        state: {
          email: variables.email,
          flow: "register",
        },
      });
    },
  });

  const errorMessage =
  error instanceof Error
    ? error.message
    : "";

  const onSubmit = (data: RegisterFormData) => mutate(data);

  return (
    <AuthCenteredLayout
      title="Create Account"
      description="Create your institutional account to continue."
    >
      <RegisterForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isPending={isPending}
        error={errorMessage}
      />
    </AuthCenteredLayout>
  );

}