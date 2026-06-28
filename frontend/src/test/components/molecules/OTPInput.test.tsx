import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { OTPInput } from "../../../components/ui/molecules/OTPInput";

describe("OTPInput", () => {
  it("renders six inputs by default", () => {
    render(<OTPInput />);

    expect(screen.getAllByRole("textbox")).toHaveLength(6);
  });

  it("renders custom length", () => {
    render(<OTPInput length={4} />);

    expect(screen.getAllByRole("textbox")).toHaveLength(4);
  });

  it("accepts numeric input", async () => {
    const user = userEvent.setup();

    render(<OTPInput />);

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "5");

    expect(inputs[0]).toHaveValue("5");
  });

  it("ignores non numeric input", async () => {
    const user = userEvent.setup();

    render(<OTPInput />);

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "a");

    expect(inputs[0]).toHaveValue("");
  });

  it("calls onChange", async () => {
    const user = userEvent.setup();

    const onChange = vi.fn();

    render(<OTPInput onChange={onChange} />);

    const inputs = screen.getAllByRole("textbox");

    await user.type(inputs[0], "8");

    expect(onChange).toHaveBeenCalled();
  });
});