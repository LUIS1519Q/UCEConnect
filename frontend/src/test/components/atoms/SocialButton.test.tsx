import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SocialButton } from "../../../components/ui/atoms/SocialButton";

describe("SocialButton", () => {
  it("renders button text", () => {
    render(
      <SocialButton provider="microsoft">
        Continue with Microsoft
      </SocialButton>
    );

    expect(
      screen.getByRole("button", {
        name: /continue with microsoft/i,
      })
    ).toBeInTheDocument();
  });

  it("renders microsoft logo", () => {
    render(
      <SocialButton provider="microsoft">
        Microsoft
      </SocialButton>
    );

    expect(
      screen.getByAltText("microsoft logo")
    ).toBeInTheDocument();
  });

  it("calls onClick when pressed", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <SocialButton
        provider="microsoft"
        onClick={handleClick}
      >
        Microsoft
      </SocialButton>
    );

    await user.click(
      screen.getByRole("button")
    );

    expect(handleClick).toHaveBeenCalledOnce();
  });
});