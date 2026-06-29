import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useForgotPassword } from "../../../hooks/useForgotPassword";
import { authService } from "../../../api/authService";
import { ROUTES } from "../../../constants/routes";

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

describe("useForgotPassword", () => {
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

  it("calls forgotPassword service", async () => {
    const forgotPasswordSpy = vi
      .spyOn(authService, "forgotPassword")
      .mockResolvedValue({
        message: "Success",
      });

    const { result } = renderHook(
      () => useForgotPassword(),
      { wrapper }
    );

    act(() => {
      result.current.forgotPassword({
        email: "test@uce.edu.ec",
      });
    });

    await waitFor(() => {
      expect(forgotPasswordSpy).toHaveBeenCalledWith({
        email: "test@uce.edu.ec",
      });
    });
  });

  it("navigates after success", async () => {
    vi.spyOn(authService, "forgotPassword").mockResolvedValue({
      message: "Success",
    });

    const { result } = renderHook(
      () => useForgotPassword(),
      { wrapper }
    );

    act(() => {
      result.current.forgotPassword({
        email: "test@uce.edu.ec",
      });
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        ROUTES.auth.verifyCode,
        {
          state: {
            email: "test@uce.edu.ec",
            flow: "forgot-password",
          },
        }
      );
    });
  });
});