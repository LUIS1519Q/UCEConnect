import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";

import { useRegister } from "../../hooks/useRegister";
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

vi.mock("../../api/authService", () => ({
  authService: {
    register: vi.fn().mockResolvedValue({
      message: "Success",
    }),
  },
}));

describe("useRegister", () => {
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

  it("calls register service", async () => {
    const { authService } = await import("../../api/authService");

    const { result } = renderHook(
      () => useRegister(),
      { wrapper }
    );

    act(() => {
      result.current.register({
        firstName: "John",
        lastName: "Doe",
        email: "john@uce.edu.ec",
        password: "Password123!",
        confirmPassword: "Password123!",
      });
    });

    await waitFor(() => {
      expect(authService.register).toHaveBeenCalledWith({
        firstName: "John",
        lastName: "Doe",
        email: "john@uce.edu.ec",
        password: "Password123!",
        role: "student",
      });
    });
  });

  it("navigates after success", async () => {
    const { result } = renderHook(
      () => useRegister(),
      { wrapper }
    );

    act(() => {
      result.current.register({
        firstName: "John",
        lastName: "Doe",
        email: "john@uce.edu.ec",
        password: "Password123!",
        confirmPassword: "Password123!",
      });
    });

    await waitFor(() => {
      expect(navigate).toHaveBeenCalledWith(
        ROUTES.auth.verifyCode,
        {
          state: {
            email: "john@uce.edu.ec",
            flow: "register",
          },
        }
      );
    });
  });
});