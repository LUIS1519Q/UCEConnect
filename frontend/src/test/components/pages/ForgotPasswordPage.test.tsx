import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ForgotPasswordPage from "../../../pages/auth/ForgotPasswordPage";

vi.mock("react-hook-form", () => ({
  useForm: () => ({
    register: vi.fn(),
    handleSubmit: vi.fn(() => vi.fn()),
    formState: {
      errors: {},
    },
  }),
}));

vi.mock("../../../hooks/useForgotPassword", () => ({
  useForgotPassword: () => ({
    forgotPassword: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

describe("ForgotPasswordPage", () => {
  it("renders the forgot password page", () => {
    render(
      <MemoryRouter>
        <ForgotPasswordPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Forgot Password")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Enter your institutional email.")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Send Verification Code",
      })
    ).toBeInTheDocument();
  });
});