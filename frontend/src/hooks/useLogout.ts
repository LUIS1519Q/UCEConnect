import { useNavigate } from "react-router-dom";

import { ROUTES } from "../constants/routes";
import { useAuthStore } from "../store/authStore";

export function useLogout() {
  const navigate = useNavigate();

  const logout = useAuthStore(
    (state) => state.logout
  );

  function handleLogout() {
    logout();

    navigate(
      ROUTES.auth.login,
      {
        replace: true,
      }
    );
  }

  return {
    logout: handleLogout,
  };
}