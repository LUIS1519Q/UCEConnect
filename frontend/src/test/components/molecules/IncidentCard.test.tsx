import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IncidentCard } from "../../../components/ui/molecules/IncidentCard";

describe("IncidentCard", () => {
  it("renders incident information", () => {
    render(
      <IncidentCard
        title="Internet Issue"
        location="Building A"
        status="open"
        createdAt="Jun 29, 2026"
      />
    );

    expect(
      screen.getByText("Internet Issue")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Building A")
    ).toBeInTheDocument();
  });

  it("renders the status badge", () => {
    render(
      <IncidentCard
        title="Internet Issue"
        location="Building A"
        status="resolved"
        createdAt="Jun 29, 2026"
      />
    );

    expect(
      screen.getByText("Resolved")
    ).toBeInTheDocument();
  });

  it("calls onClick when button is pressed", async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <IncidentCard
        title="Internet Issue"
        location="Building A"
        status="open"
        createdAt="Jun 29, 2026"
        onClick={onClick}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /view details/i,
      })
    );

    expect(onClick).toHaveBeenCalledOnce();
  });
});