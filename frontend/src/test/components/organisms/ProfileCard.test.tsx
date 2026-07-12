import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProfileCard } from "../../../components/ui/organisms/ProfileCard";

describe("ProfileCard", () => {
  it("renders profile information", () => {
    render(
      <ProfileCard
        name="John Doe"
        email="john@uce.edu.ec"
        studentId="2023123456"
        career="Software Engineering"
      />
    );

    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("john@uce.edu.ec")).toBeInTheDocument();
    expect(screen.getByText("2023123456")).toBeInTheDocument();
    expect(screen.getByText("Software Engineering")).toBeInTheDocument();
  });

  it("renders edit button", () => {
    render(
      <ProfileCard
        name="John Doe"
        email="john@uce.edu.ec"
        studentId="2023123456"
        career="Software Engineering"
      />
    );

    expect(
      screen.getByRole("button", { name: /edit profile/i })
    ).toBeInTheDocument();
  });
});