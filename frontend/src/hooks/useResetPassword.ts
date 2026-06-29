import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { ROUTES } from "../constants/routes";

import { authService } from "../api/authService";
import type { ResetPasswordFormData } from "../schemas/auth/resetPasswordSchema";

interface Params {
  resetToken: string;
}

export function useResetPassword({ resetToken}: Params) {
  const navigate = useNavigate();

  // ---------------- VALIDATION GUARD ----------------
  useEffect(() => {
    if (!resetToken) {
      navigate(ROUTES.auth.forgotPassword);
    }
  }, [resetToken, navigate]);

  // ---------------- MUTATION ----------------
  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authService.resetPassword({
        resetToken,
        newPassword: data.password,
      }),

    onSuccess: () => {
      navigate(ROUTES.auth.login);
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    mutation.mutate(data);
  };

  return {
    onSubmit,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}