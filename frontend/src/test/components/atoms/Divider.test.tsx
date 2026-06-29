import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { Divider } from "../../../components/ui/atoms/Divider";

describe("Divider", () => {
  it("renders default text", () => {
    render(<Divider />);

    expect(
      screen.getByText("OR")
    ).toBeInTheDocument();
  });

  it("renders custom text", () => {
    render(<Divider text="Continue with" />);

    expect(
      screen.getByText("Continue with")
    ).toBeInTheDocument();
  });
});