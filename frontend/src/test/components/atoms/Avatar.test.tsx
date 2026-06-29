import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Avatar } from "../../../components/ui/atoms/Avatar";

describe("Avatar", () => {
  it("renders an image when src is provided", () => {
    render(
      <Avatar
        src="/avatar.png"
        alt="Student avatar"
      />
    );

    expect(
      screen.getByAltText("Student avatar")
    ).toBeInTheDocument();
  });

  it("renders the fallback when src is not provided", () => {
    render(<Avatar alt="Student avatar" />);

    expect(
      screen.getByTestId("avatar-fallback")
    ).toBeInTheDocument();
  });

  it("applies the correct size", () => {
    render(
      <Avatar
        alt="Student avatar"
        size="lg"
      />
    );

    expect(
      screen.getByTestId("avatar-fallback")
    ).toHaveClass("h-16", "w-16");
  });
});