import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import MicrosoftCallbackPage from "../../pages/auth/MicrosoftCallbackPage";

vi.mock("../../hooks/useMicrosoftCallback", () => ({
  useMicrosoftCallback: vi.fn(),
}));

describe("MicrosoftCallbackPage", () => {
  it("renders loading message", () => {
    render(
      <MemoryRouter>
        <MicrosoftCallbackPage />
      </MemoryRouter>
    );

    expect(
      screen.getByText("Signing in with Microsoft...")
    ).toBeInTheDocument();
  });
});