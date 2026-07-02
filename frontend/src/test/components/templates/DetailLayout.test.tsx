import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DetailLayout } from "../../../components/ui/templates/DetailLayout";

describe("DetailLayout", () => {
  it("renders title and children", () => {
    render(
      <DetailLayout title="Incident Detail">
        <p>Incident Information</p>
      </DetailLayout>
    );

    expect(screen.getByText("Incident Detail")).toBeInTheDocument();
    expect(screen.getByText("Incident Information")).toBeInTheDocument();
  });

  it("renders subtitle", () => {
    render(
      <DetailLayout
        title="Incident Detail"
        subtitle="View all information."
      >
        <p>Content</p>
      </DetailLayout>
    );

    expect(screen.getByText("View all information.")).toBeInTheDocument();
  });
});