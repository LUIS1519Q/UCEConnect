import { authService } from "../api/authService";

export function useMicrosoftLogin() {
  const login = () => {
    authService.microsoftLogin();
  };

  return {
    login,
  };
}