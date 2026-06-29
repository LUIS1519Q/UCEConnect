import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useVerifyCode } from "../../hooks/useVerifyCode";
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

vi.mock("../../hooks/useCountdown", () => ({
  useCountdown: () => ({
    formattedTime: "5:00",
    seconds: 0,
    reset: vi.fn(),
  }),
}));

describe("useVerifyCode", () => {
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

  it("calls verifyCode for register flow", async () => {
    const verifySpy = vi
      .spyOn(authService, "verifyCode")
      .mockResolvedValue({
        message: "Success",
      });

    const { result } = renderHook(
      () =>
        useVerifyCode({
          email: "test@uce.edu.ec",
          flow: "register",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onSubmit({
        code: "123456",
      });
    });

    await waitFor(() => {
      expect(verifySpy).toHaveBeenCalledWith({
        email: "test@uce.edu.ec",
        code: "123456",
      });
    });
  });

  it("navigates to login after register verification", async () => {
    vi.spyOn(authService, "verifyCode").mockResolvedValue({
      message: "Success",
    });

    const { result } = renderHook(
      () =>
        useVerifyCode({
          email: "test@uce.edu.ec",
          flow: "register",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onSubmit({
        code: "123456",
      });
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        ROUTES.auth.login
      );
    });
  });

  it("calls verifyResetCode for forgot-password flow", async () => {
    const verifyResetSpy = vi
      .spyOn(authService, "verifyResetCode")
      .mockResolvedValue({
        message: "Success",
        resetToken: "fake-reset-token",
      });

    const { result } = renderHook(
      () =>
        useVerifyCode({
          email: "test@uce.edu.ec",
          flow: "forgot-password",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onSubmit({
        code: "123456",
      });
    });

    await waitFor(() => {
      expect(verifyResetSpy).toHaveBeenCalledWith({
        email: "test@uce.edu.ec",
        code: "123456",
      });
    });
  });

  it("navigates to reset password after forgot-password verification", async () => {
    vi.spyOn(authService, "verifyResetCode").mockResolvedValue({
      message: "Success",
      resetToken: "fake-reset-token",
    });

    const { result } = renderHook(
      () =>
        useVerifyCode({
          email: "test@uce.edu.ec",
          flow: "forgot-password",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onSubmit({
        code: "123456",
      });
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        ROUTES.auth.resetPassword,
        {
          state: {
            resetToken: "fake-reset-token",
          },
        }
      );
    });
  });

  it("calls resendCode for register flow", async () => {
    const resendSpy = vi
      .spyOn(authService, "resendCode")
      .mockResolvedValue({
        message: "Success",
      });

    const { result } = renderHook(
      () =>
        useVerifyCode({
          email: "test@uce.edu.ec",
          flow: "register",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onResend();
    });

    await waitFor(() => {
      expect(resendSpy).toHaveBeenCalledWith(
        "test@uce.edu.ec"
      );
    });
  });

  it("calls resendResetCode for forgot-password flow", async () => {
    const resendResetSpy = vi
      .spyOn(authService, "resendResetCode")
      .mockResolvedValue({
        message: "Success",
      });

    const { result } = renderHook(
      () =>
        useVerifyCode({
          email: "test@uce.edu.ec",
          flow: "forgot-password",
        }),
      { wrapper }
    );

    act(() => {
      result.current.onResend();
    });

    await waitFor(() => {
      expect(resendResetSpy).toHaveBeenCalledWith(
        "test@uce.edu.ec"
      );
    });
  });
});