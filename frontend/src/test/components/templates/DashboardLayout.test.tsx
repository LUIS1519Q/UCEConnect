import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { DashboardLayout } from "../../../components/ui/templates/DashboardLayout";

describe("DashboardLayout", () => {
  it("renders header and children", () => {
    render(
      <DashboardLayout
        header={<div>Header</div>}
      >
        <p>Main Content</p>
      </DashboardLayout>
    );

    expect(screen.getByText("Header")).toBeInTheDocument();
    expect(screen.getByText("Main Content")).toBeInTheDocument();
  });

  it("renders sidebar when provided", () => {
    render(
      <DashboardLayout
        header={<div>Header</div>}
        sidebar={<div>Sidebar</div>}
      >
        <p>Main Content</p>
      </DashboardLayout>
    );

    expect(screen.getByText("Sidebar")).toBeInTheDocument();
  });
});
