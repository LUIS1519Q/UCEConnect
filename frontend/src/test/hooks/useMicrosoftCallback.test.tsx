import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { useMicrosoftCallback } from "../../hooks/useMicrosoftCallback";
import { authService } from "../../api/authService";
import { ROUTES } from "../../constants/routes";

const navigate = vi.fn();

const setTokens = vi.fn();
const setSession = vi.fn();
const logout = vi.fn();

const searchParams = new URLSearchParams({
  accessToken: "access-token",
  refreshToken: "refresh-token",
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<
    typeof import("react-router-dom")
  >("react-router-dom");

  return {
    ...actual,
    useNavigate: () => navigate,
    useSearchParams: () => [searchParams],
  };
});

vi.mock("../../api/authService", () => ({
  authService: {
    me: vi.fn(),
  },
}));

vi.mock("../../store/authStore", () => ({
  useAuthStore: Object.assign(
    (
      selector: (
        state: {
          setTokens: typeof setTokens;
          setSession: typeof setSession;
        }
      ) => unknown
    ) =>
      selector({
        setTokens,
        setSession,
      }),
    {
      getState: () => ({
        logout,
      }),
    }
  ),
}));

describe("useMicrosoftCallback", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("stores session and redirects to dashboard", async () => {
    vi.mocked(authService.me).mockResolvedValue({
      id: "1",
      firstName: "John",
      lastName: "Doe",
      email: "john@uce.edu.ec",
      role: "student",
    });

    renderHook(() => useMicrosoftCallback(), {
      wrapper: MemoryRouter,
    });

    await waitFor(() => {
      expect(authService.me).toHaveBeenCalled();
    });

    expect(setTokens).toHaveBeenCalledWith({
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(setSession).toHaveBeenCalledWith({
      user: {
        id: "1",
        firstName: "John",
        lastName: "Doe",
        email: "john@uce.edu.ec",
        role: "student",
      },
      accessToken: "access-token",
      refreshToken: "refresh-token",
    });

    expect(navigate).toHaveBeenCalledWith(
      ROUTES.dashboard.student
    );
  });
});