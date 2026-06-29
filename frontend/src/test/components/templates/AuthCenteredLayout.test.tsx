import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { AuthCenteredLayout } from "../../../components/ui/templates/AuthCenteredLayout";

describe("AuthCenteredLayout", () => {
  it("renders title, description and children", () => {
    render(
      <AuthCenteredLayout
        title="Login"
        description="Welcome back"
      >
        <button>Child Button</button>
      </AuthCenteredLayout>
    );

    expect(
      screen.getByText("Login")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Welcome back")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Child Button",
      })
    ).toBeInTheDocument();
  });
});