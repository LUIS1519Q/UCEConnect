import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useVerifyCode } from "../../../hooks/useVerifyCode";
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

vi.mock("../../../hooks/useCountdown", () => ({
  useCountdown: () => ({
    formattedTime: "5:00",
    seconds: 0,
    reset: vi.fn(),
  }),
}));

vi.mock("../../../api/authService", () => ({
  authService: {
    verifyCode: vi.fn().mockResolvedValue({
      message: "Success",
    }),
    verifyResetCode: vi.fn().mockResolvedValue({
      message: "Success",
    }),
    resendCode: vi.fn().mockResolvedValue({
      message: "Success",
    }),
    resendResetCode: vi.fn().mockResolvedValue({
      message: "Success",
    }),
  },
}));

describe("useVerifyCode", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const wrapper = ({
    children,
  }: {
    children: React.ReactNode;
  }) => {
    const queryClient = new QueryClient();

    return (
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    );
  };

  it("calls verifyCode for register flow", async () => {
    const { authService } = await import("../../../api/authService");

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
      expect(authService.verifyCode).toHaveBeenCalledWith({
        email: "test@uce.edu.ec",
        code: "123456",
      });
    });
  });

  it("navigates to login after register verification", async () => {
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
    const { authService } = await import("../../../api/authService");

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
      expect(authService.verifyResetCode).toHaveBeenCalledWith({
        email: "test@uce.edu.ec",
        code: "123456",
      });
    });
  });

  it("navigates to reset password after forgot-password verification", async () => {
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
            email: "test@uce.edu.ec",
            code: "123456",
          },
        }
      );
    });
  });

  it("calls resendCode for register flow", async () => {
    const { authService } = await import("../../../api/authService");

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
      expect(authService.resendCode).toHaveBeenCalledWith(
        "test@uce.edu.ec"
      );
    });
  });

  it("calls resendResetCode for forgot-password flow", async () => {
    const { authService } = await import("../../../api/authService");

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
      expect(authService.resendResetCode).toHaveBeenCalledWith(
        "test@uce.edu.ec"
      );
    });
  });
});