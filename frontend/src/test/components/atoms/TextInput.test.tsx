
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { TextInput } from "../../../components/ui/atoms/TextInput";

describe("TextInput", () => {
  it("renders correctly", () => {
    render(<TextInput placeholder="Email" />);

    expect(
      screen.getByPlaceholderText("Email")
    ).toBeInTheDocument();
  });

  it("renders the correct input type", () => {
    render(<TextInput type="email" />);

    expect(
      screen.getByRole("textbox")
    ).toHaveAttribute("type", "email");
  });

  it("applies full width by default", () => {
    render(<TextInput />);

    expect(
      screen.getByRole("textbox")
    ).toHaveClass("w-full");
  });
});