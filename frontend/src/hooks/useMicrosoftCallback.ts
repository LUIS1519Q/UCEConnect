import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

import { authService } from "../api/authService";
import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

const DASHBOARD_ROUTES = {
  student: ROUTES.student.myIncidents,
  manager: ROUTES.manager.incidents,
  admin: ROUTES.admin.incidents,
} as const;

export function useMicrosoftCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const setTokens = useAuthStore(
    (state) => state.setTokens
  );

  const setSession = useAuthStore(
    (state) => state.setSession
  );

  useEffect(() => {
    async function handleCallback() {
      const accessToken =
        searchParams.get("accessToken");

      const refreshToken =
        searchParams.get("refreshToken");

      if (!accessToken || !refreshToken) {
        navigate(ROUTES.auth.login);
        return;
      }

      try {
        setTokens({
          accessToken,
          refreshToken,
        });

        const user = await authService.me();

        setSession({
          user,
          accessToken,
          refreshToken,
        });

        navigate(
          DASHBOARD_ROUTES[user.role]
        );
      } catch {
        useAuthStore.getState().logout();

        navigate(ROUTES.auth.login);
      }
    }

    void handleCallback();
  }, [
    navigate,
    searchParams,
    setSession,
    setTokens,
  ]);
}