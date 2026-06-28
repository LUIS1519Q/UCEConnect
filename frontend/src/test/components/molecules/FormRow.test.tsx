import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormRow } from "../../../components/ui/molecules/FormRow";

describe("FormRow", () => {
  it("renders children", () => {
    render(
      <FormRow>
        <button>Button 1</button>
        <button>Button 2</button>
      </FormRow>
    );

    expect(
      screen.getByRole("button", {
        name: "Button 1",
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Button 2",
      })
    ).toBeInTheDocument();
  });

  it("applies default classes", () => {
    const { container } = render(
      <FormRow>
        <span>Child</span>
      </FormRow>
    );

    expect(container.firstChild).toHaveClass(
      "flex",
      "flex-col",
      "gap-4"
    );
  });

  it("applies custom className", () => {
    const { container } = render(
      <FormRow className="bg-red-500">
        <span>Child</span>
      </FormRow>
    );

    expect(container.firstChild).toHaveClass("bg-red-500");
  });
});