import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ProfileLayout } from "../../../components/ui/templates/ProfileLayout";

describe("ProfileLayout", () => {
  it("renders title and children", () => {
    render(
      <ProfileLayout title="My Profile">
        <p>Profile Content</p>
      </ProfileLayout>
    );

    expect(screen.getByText("My Profile")).toBeInTheDocument();
    expect(screen.getByText("Profile Content")).toBeInTheDocument();
  });

  it("renders sidebar", () => {
    render(
      <ProfileLayout
        title="My Profile"
        sidebar={<p>Menu</p>}
      >
        <p>Content</p>
      </ProfileLayout>
    );

    expect(screen.getByText("Menu")).toBeInTheDocument();
  });
});