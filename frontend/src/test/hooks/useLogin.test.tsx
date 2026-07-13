import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import type { AxiosError } from "axios";

import { useLogin } from "../../hooks/useLogin";
import { authService } from "../../api/authService";
import { useAuthStore } from "../../store/authStore";
import { ROUTES } from "../../constants/routes";

const navigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<
    typeof import("react-router-dom")
  >("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigate,
  };
});

describe("useLogin", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    useAuthStore.getState().logout();
  });

  const wrapper = ({
    children,
  }: {
    children: ReactNode;
  }) => {
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it("calls login service", async () => {
    const loginSpy = vi
      .spyOn(authService, "login")
      .mockResolvedValue({
        accessToken: "access-token",
        refreshToken: "refresh-token",
        user: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@uce.edu.ec",
          role: "student",
        },
      });

    const { result } = renderHook(
      () => useLogin(),
      { wrapper }
    );

    act(() => {
      result.current.login({
        email: "john@uce.edu.ec",
        password: "Password123!",
      });
    });

    await waitFor(() => {
      expect(loginSpy).toHaveBeenCalledWith({
        email: "john@uce.edu.ec",
        password: "Password123!",
      });
    });
  });

  it("saves session and navigates after success", async () => {
    vi.spyOn(authService, "login").mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@uce.edu.ec",
        role: "student",
      },
    });

    const { result } = renderHook(
      () => useLogin(),
      { wrapper }
    );

    act(() => {
      result.current.login({
        email: "john@uce.edu.ec",
        password: "Password123!",
      });
    });

    await waitFor(() => {
      const state = useAuthStore.getState();

      expect(state.user).toEqual({
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@uce.edu.ec",
        role: "student",
      });

      expect(state.accessToken).toBe("access-token");
      expect(state.refreshToken).toBe("refresh-token");

      expect(navigate).toHaveBeenCalledWith(
        ROUTES.student.myIncidents
      );
    });
  });

  it("redirects to verify code when email is not verified", async () => {
    const error = {
      response: {
        data: {
          message: "Debes verificar tu correo",
        },
      },
    } as AxiosError<{
      message: string;
    }>;

    vi.spyOn(authService, "login").mockRejectedValue(error);

    const { result } = renderHook(
      () => useLogin(),
      { wrapper }
    );

    act(() => {
      result.current.login({
        email: "john@uce.edu.ec",
        password: "Password123!",
      });
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        ROUTES.auth.verifyCode,
        {
          state: {
            email: "john@uce.edu.ec",
          },
        }
      );
    });
  });
});