import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FormLayout } from "../../../components/ui/templates/FormLayout";

describe("FormLayout", () => {
  it("renders title and children", () => {
    render(
      <FormLayout title="Create Incident">
        <p>Form Content</p>
      </FormLayout>
    );

    expect(screen.getByText("Create Incident")).toBeInTheDocument();
    expect(screen.getByText("Form Content")).toBeInTheDocument();
  });

  it("renders description", () => {
    render(
      <FormLayout
        title="Create Incident"
        description="Complete the form."
      >
        <p>Content</p>
      </FormLayout>
    );

    expect(screen.getByText("Complete the form.")).toBeInTheDocument();
  });
});