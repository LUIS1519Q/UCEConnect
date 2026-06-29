import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { FormField } from "../../../components/ui/molecules/FormField";

describe("FormField", () => {
  it("renders label and children", () => {
    render(
      <FormField
        id="email"
        label="Email"
      >
        <input id="email" />
      </FormField>
    );

    expect(
      screen.getByText("Email")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox")
    ).toBeInTheDocument();
  });

  it("renders required indicator", () => {
    render(
      <FormField
        id="email"
        label="Email"
        required
      >
        <input id="email" />
      </FormField>
    );

    expect(
      screen.getByText("*")
    ).toBeInTheDocument();
  });

  it("renders error message", () => {
    render(
      <FormField
        id="email"
        label="Email"
        error="Email is required"
      >
        <input id="email" />
      </FormField>
    );

    expect(
      screen.getByText("Email is required")
    ).toBeInTheDocument();
  });

  it("does not render error when none is provided", () => {
    render(
      <FormField
        id="email"
        label="Email"
      >
        <input id="email" />
      </FormField>
    );

    expect(
      screen.queryByText("Email is required")
    ).not.toBeInTheDocument();
  });
});