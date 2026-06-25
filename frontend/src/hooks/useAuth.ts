import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import { authService } from "../api/authService";
import { useAuthStore } from "../store/authStore";
import type { LoginPayload } from "../types/auth";

export function useAuth() {
  const navigate = useNavigate();

  const setAuth = useAuthStore((state) => state.setAuth);

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),

    onSuccess: (response) => {
      setAuth(
        response.user,
        response.accessToken,
        response.refreshToken
      );

      switch (response.user.role) {
        case "student":
          navigate("/dashboard/estudiante");
          break;

        case "manager":
          navigate("/dashboard/gestor");
          break;

        case "admin":
          navigate("/dashboard/admin");
          break;
      }
    },

    onError: (error: any, variables) => {
      const message =
        error?.response?.data?.message || "";

      if (
        message.includes(
          "Debes verificar tu correo"
        )
      ) {
        navigate("/verify-email", {
          state: {
            email: variables.email,
          },
        });
      }
    },
  });

  return {
    login: loginMutation.mutate,
    isPending: loginMutation.isPending,
    error: loginMutation.error,
  };
}