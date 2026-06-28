import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Logo } from "../../../components/ui/atoms/Logo";

describe("Logo", () => {
  it("renders with default alt text", () => {
    render(<Logo />);

    expect(
      screen.getByAltText("UCEConnect")
    ).toBeInTheDocument();
  });

  it("renders custom alt text", () => {
    render(<Logo alt="Institutional Logo" />);

    expect(
      screen.getByAltText("Institutional Logo")
    ).toBeInTheDocument();
  });
});