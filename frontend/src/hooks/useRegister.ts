import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/routes";

import { authService } from "../api/authService";
import type { RegisterFormData } from "../schemas/auth/registerSchema";

export function useRegister() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
        role: "student",
      }),

    onSuccess: (_, variables) => {
      navigate(ROUTES.auth.verifyCode, {
        state: {
          email: variables.email,
          flow: "register",
        },
      });
    },
  });

  return {
    register: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
  };
}