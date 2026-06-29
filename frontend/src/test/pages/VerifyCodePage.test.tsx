import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import VerifyCodePage from "../../pages/auth/VerifyCodePage";

vi.mock("../../hooks/useVerifyCode", () => ({
  useVerifyCode: () => ({
    onSubmit: vi.fn(),
    isPending: false,
    error: null,
    expiresIn: "05:00",
    resendIn: "00:30",
    canResend: false,
    onResend: vi.fn(),
    success: "",
  }),
}));

describe("VerifyCodePage", () => {
  it("renders the verify code page", () => {
    render(
      <MemoryRouter
        initialEntries={[
          {
            pathname: "/verify-code",
            state: {
              email: "test@uce.edu.ec",
              flow: "register",
            },
          },
        ]}
      >
        <VerifyCodePage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: "Verify Email",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Enter the verification code sent to test@uce.edu.ec."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Verify Code",
      })
    ).toBeInTheDocument();
  });
});