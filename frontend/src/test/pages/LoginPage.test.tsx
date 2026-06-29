import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import LoginPage from "../../pages/auth/LoginPage";

vi.mock("react-hook-form", () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn(() => vi.fn()),
    formState: {
      errors: {},
    },
  }),
}));

vi.mock("../../hooks/useLogin", () => ({
  useLogin: () => ({
    login: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

describe("LoginPage", () => {
  it("renders the login page", () => {
    render(
      <MemoryRouter>
        <LoginPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Welcome")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Sign in to continue")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Log in",
      })
    ).toBeInTheDocument();
  });
});