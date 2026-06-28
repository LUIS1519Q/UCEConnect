import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authService } from "../api/authService";
import type { RegisterFormData } from "../shemas/auth/registerSchema";

export function useRegister() {
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: (data: RegisterFormData) =>
      authService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        role: "student",
      }),

    onSuccess: (_, variables) => {
      navigate("/verify-email", {
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