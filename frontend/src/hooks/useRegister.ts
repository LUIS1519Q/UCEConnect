import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { authService } from "../api/authService";
import type { RegisterFormData } from "../pages/auth/registerSchema";
import type { ApiMessageResponse } from "../types/common";

export function useRegister() {
  const navigate = useNavigate();

  const registerMutation = useMutation({
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

    onError: (error: AxiosError<ApiMessageResponse>) => {
      console.log(error?.response?.data?.message);
    },
  });

  return {
    register: registerMutation.mutate,
    isPending: registerMutation.isPending,
    error: registerMutation.error,
  };
}