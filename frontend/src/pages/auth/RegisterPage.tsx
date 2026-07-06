gitlates";
import { RegisterForm } from "../../components/ui/organisms";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useRegister } from "../../hooks/useRegister";
import { registerSchema, type RegisterFormData } from "../../schemas/auth/registerSchema";

export default function RegisterPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const { register: registerUser, isPending, error } = useRegister();

  const errorMessage =
    error instanceof Error ? error.message : "";

  const onSubmit = (data: RegisterFormData) => {
    registerUser(data);
  };

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