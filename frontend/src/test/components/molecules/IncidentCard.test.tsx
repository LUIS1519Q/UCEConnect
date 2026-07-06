import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { IncidentCard } from "../../../components/ui/molecules/IncidentCard";

describe("IncidentCard", () => {
  it("renders incident information", () => {
    render(
      <IncidentCard
        id="INC-0001"
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
        id="INC-0001"
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
        id="INC-0001"
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

  it("renders incident id", () => {
    render(
      <IncidentCard
        id="INC-0001"
        title="Projector not working"
        location="Building A"
        status="open"
        createdAt="05 Jul 2026"
      />
    );

    expect(
      screen.getByText("INC-0001")
    ).toBeInTheDocument();
  });
});