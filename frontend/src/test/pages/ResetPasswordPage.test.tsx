import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import ResetPasswordPage from "../../pages/auth/ResetPasswordPage";

vi.mock("../../../hooks/useResetPassword", () => ({
  useResetPassword: () => ({
    onSubmit: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

describe("ResetPasswordPage", () => {
  it("renders the reset password page", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/reset-password",
            state: {
              email: "test@uce.edu.ec",
              code: "123456",
            },
          },
        ]}
      >
        <ResetPasswordPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: "Reset Password",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create a new password for your account."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Reset Password",
      })
    ).toBeInTheDocument();
  });
});