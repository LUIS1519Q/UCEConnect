import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ProtectedRoute from "../../router/ProtectedRoute";
import { useAuthStore } from "../../store/authStore";

vi.mock("../../store/authStore", () => ({
  useAuthStore: vi.fn(),
}));

describe("ProtectedRoute", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children when the user is authenticated", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        user: {
          id: "1",
          firstName: "John",
          lastName: "Doe",
          email: "john@uce.edu.ec",
          role: "student",
        },
        accessToken: null,
        refreshToken: null,
        setSession: vi.fn(),
        logout: vi.fn(),
      })
    );

    render(
      <MemoryRouter>
        <ProtectedRoute>
          <h1>Protected Content</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.getByText("Protected Content")
    ).toBeInTheDocument();
  });

  it("redirects to login when the user is not authenticated", () => {
    vi.mocked(useAuthStore).mockImplementation((selector) =>
      selector({
        user: null,
        accessToken: null,
        refreshToken: null,
        setSession: vi.fn(),
        logout: vi.fn(),
      })
    );

    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <ProtectedRoute>
          <h1>Protected Content</h1>
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(screen.queryByText("Protected Content")).not.toBeInTheDocument();
  });
});