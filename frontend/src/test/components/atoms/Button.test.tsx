import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { Button } from "../../../components/ui/atoms/Button";

describe("Button", () => {
  it("renders the button text", () => {
    render(<Button>Log in</Button>);

    expect(
      screen.getByRole("button", { name: /log in/i })
    ).toBeInTheDocument();
  });

  it("uses button as the default type", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button")
    ).toHaveAttribute("type", "button");
  });

  it("allows overriding the button type", () => {
    render(
      <Button type="submit">
        Submit
      </Button>
    );

    expect(
      screen.getByRole("button")
    ).toHaveAttribute("type", "submit");
  });

});