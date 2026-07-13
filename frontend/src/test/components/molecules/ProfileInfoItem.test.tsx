import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProfileInfoItem } from "../../../components/ui/molecules/ProfileInfoItem";

describe("ProfileInfoItem", () => {
  it("renders label", () => {
    render(
      <ProfileInfoItem
        label="Student ID"
        value="2023123456"
      />
    );

    expect(
      screen.getByText("Student ID")
    ).toBeInTheDocument();
  });

  it("renders value", () => {
    render(
      <ProfileInfoItem
        label="Student ID"
        value="2023123456"
      />
    );

    expect(
      screen.getByText("2023123456")
    ).toBeInTheDocument();
  });
});