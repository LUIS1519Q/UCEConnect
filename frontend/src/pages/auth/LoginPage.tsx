import { AuthSplitLayout } from "../../components/ui/templates";
import { LoginForm } from "../../components/ui/organisms";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useLogin } from "../../hooks/useLogin";
import { loginSchema, type LoginFormData } from "../../shemas/auth/loginSchema";

function LoginPage() {

  const { login, isPending, error } = useLogin();

  const errorMessage =
    error instanceof Error
      ? error.message
      : "";

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    login(data);
  };

  return (
    <AuthSplitLayout
      title="Welcome"
      description="Sign in to continue"
    >
      <LoginForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        isPending={isPending}
        error={errorMessage}
      />
    </AuthSplitLayout>
  );
}

export default LoginPage;