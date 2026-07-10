import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useResetPassword } from "../../hooks/useResetPassword";
import { authService } from "../../api/authService";
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

describe("useResetPassword", () => {
  beforeEach(() => {
    vi.clearAllMocks();
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

  it("calls resetPassword service", async () => {
    const resetSpy = vi
      .spyOn(authService, "resetPassword")
      .mockResolvedValue({
        message: "Success",
      });

    const { result } = renderHook(
      () =>
        useResetPassword({
          resetToken: "mock-reset-token",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onSubmit({
        password: "Password123!",
        confirmPassword: "Password123!",
      });
    });

    await waitFor(() => {
      expect(resetSpy).toHaveBeenCalledWith({
        resetToken: "mock-reset-token",
        newPassword: "Password123!",
      });
    });
  });

  it("navigates to login after success", async () => {
    vi.spyOn(authService, "resetPassword").mockResolvedValue({
      message: "Success",
    });

    const { result } = renderHook(
      () =>
        useResetPassword({
          resetToken: "mock-reset-token",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onSubmit({
        password: "Password123!",
        confirmPassword: "Password123!",
      });
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        ROUTES.auth.login
      );
    });
  });

  it("redirects if resetToken is missing", () => {
    renderHook(
      () =>
        useResetPassword({
          resetToken: "",
        }),
      { wrapper }
    );

    expect(navigate).toHaveBeenCalledWith(
      ROUTES.auth.forgotPassword
    );
  });
});