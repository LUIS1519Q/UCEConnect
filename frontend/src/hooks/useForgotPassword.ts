import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { authService } from "../api/authService";
import type { ForgotPasswordFormData } from "../pages/auth/forgotPasswordSchema";
import type { ApiMessageResponse } from "../types/common";

export function useForgotPassword() {
  const navigate = useNavigate();

  const mutation = useMutation({
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

    onError: (error: AxiosError<ApiMessageResponse>) => {
      console.log(error?.response?.data?.message);
    },
  });

  return {
    forgotPassword: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}