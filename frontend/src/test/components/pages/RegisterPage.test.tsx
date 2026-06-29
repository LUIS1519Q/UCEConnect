import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import RegisterPage from "../../../pages/auth/RegisterPage";

vi.mock("../../../hooks/useRegister", () => ({
  useRegister: () => ({
    register: vi.fn(),
    isPending: false,
    error: null,
  }),
}));

describe("RegisterPage", () => {
  it("renders the register page", () => {
    render(
      <MemoryRouter>
        <RegisterPage />
      </MemoryRouter>
    );

    expect(
      screen.getByRole("heading", {
        name: "Create Account",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText(
        "Create your institutional account to continue."
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Create Account",
      })
    ).toBeInTheDocument();
  });
});