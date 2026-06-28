import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";

    import { PasswordInput } from "../../../components/ui/molecules/PasswordInput";

describe("PasswordInput", () => {
  it("renders password input by default", () => {
    render(<PasswordInput />);

    const input = screen.getByLabelText(/show password/i);

    expect(input).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("")
    ).toHaveAttribute("type", "password");
  });

  it("shows password when toggle is clicked", async () => {
    const user = userEvent.setup();

    render(<PasswordInput />);

    const button = screen.getByRole("button", {
      name: /show password/i,
    });

    await user.click(button);

    expect(
      screen.getByDisplayValue("")
    ).toHaveAttribute("type", "text");
  });

  it("hides password when toggle is clicked twice", async () => {
    const user = userEvent.setup();

    render(<PasswordInput />);

    const button = screen.getByRole("button");

    await user.click(button);
    await user.click(button);

    expect(
      screen.getByDisplayValue("")
    ).toHaveAttribute("type", "password");
  });

  it("accepts user input", async () => {
    const user = userEvent.setup();

    render(<PasswordInput />);

    const input = screen.getByDisplayValue("");

    await user.type(input, "Password123");

    expect(input).toHaveValue("Password123");
  });
});