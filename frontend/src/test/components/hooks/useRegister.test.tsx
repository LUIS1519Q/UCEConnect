import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { useRegister } from "../../../hooks/useRegister";
import { ROUTES } from "../../../constants/routes";
import { authService } from "../../../api/authService";

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

vi.mock("../../../api/authService", () => ({
  authService: {
    register: vi.fn(),
  },
}));

describe("useRegister", () => {
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

  it("calls register service", async () => {
    vi.mocked(authService.register).mockResolvedValue({
      message: "Success",
    });

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
    vi.mocked(authService.register).mockResolvedValue({
      message: "Success",
    });

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