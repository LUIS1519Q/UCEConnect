import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import AuthSplitLayout from "../../../components/ui/templates/AuthSplitLayout/AuthSplitLayout";

describe("AuthSplitLayout", () => {
  it("renders title, description and children", () => {
    render(
      <AuthSplitLayout
        title="Sign In"
        description="Access your account"
      >
        <button>Login Button</button>
      </AuthSplitLayout>
    );

    expect(
      screen.getByText("Sign In")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Access your account")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: "Login Button",
      })
    ).toBeInTheDocument();

    expect(
        screen.getAllByAltText("Institutional Logo")
    ).toHaveLength(2);
  });
});