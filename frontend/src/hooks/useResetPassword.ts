import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

import { authService } from "../api/authService";
import type { ResetPasswordFormData } from "../shemas/auth/resetPasswordSchema";

interface Params {
  email: string;
  code: string;
}

export function useResetPassword({ email, code }: Params) {
  const navigate = useNavigate();

  // ---------------- VALIDATION GUARD ----------------
  useEffect(() => {
    if (!email || !code) {
      navigate("/forgot-password");
    }
  }, [email, code, navigate]);

  // ---------------- MUTATION ----------------
  const mutation = useMutation({
    mutationFn: (data: ResetPasswordFormData) =>
      authService.resetPassword({
        email,
        code,
        newPassword: data.password,
      }),

    onSuccess: () => {
      navigate("/login");
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