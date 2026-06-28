import { ROUTES } from "../constants/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authService } from "../api/authService";
import type { ForgotPasswordFormData } from "../shemas/auth/forgotPasswordSchema";

export function useForgotPassword() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: ForgotPasswordFormData) =>
      authService.forgotPassword(data),

    onSuccess: (_, variables) => {
      navigate(ROUTES.auth.verifyCode, {
        state: {
          email: variables.email,
          flow: "forgot-password",
        },
      });
    },
  });

  return {
    forgotPassword: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}