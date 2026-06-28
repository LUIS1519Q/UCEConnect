import { ROUTES } from "../constants/routes";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import type { AxiosError } from "axios";

import { authService } from "../api/authService";
import { useAuthStore } from "../store/authStore";

import type { LoginPayload } from "../types/auth";
import type { ApiMessageResponse } from "../types/common";

const DASHBOARD_ROUTES = {
  student: ROUTES.dashboard.student,
  manager: ROUTES.dashboard.manager,
  admin: ROUTES.dashboard.admin,
} as const;

export function useLogin() {
  const navigate = useNavigate();

  const setSession = useAuthStore((state) => state.setSession);

  const loginMutation = useMutation({
    mutationFn: (data: LoginPayload) => authService.login(data),

    onSuccess: (response) => {
      setSession({
        user: response.user,
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
      });

      navigate(DASHBOARD_ROUTES[response.user.role]);
    },

    onError: (error: AxiosError<ApiMessageResponse>, variables) => {
      const message = error?.response?.data?.message || "";

      if (message.includes("Debes verificar tu correo")) {
        navigate(ROUTES.auth.verifyCode, {
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