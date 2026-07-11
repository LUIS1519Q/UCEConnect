import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { SimilarIncidentBanner } from "../../../components/ui/molecules/SimilarIncidentBanner";

describe("SimilarIncidentBanner", () => {
  it("renders title and description", () => {
    render(
      <SimilarIncidentBanner
        incident={{
            ticket: "INC-1",
            title: "Duplicate incident",
            status: "resolved",
        }}
      />
    );

    expect(
      screen.getByText("Duplicate incident")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Please review the existing report.")
    ).toBeInTheDocument();
  });

  it("calls onViewDetails", async () => {
    const user = userEvent.setup();
    const onViewDetails = vi.fn();

    render(
      <SimilarIncidentBanner
        incident={{
          ticket: "INC-001",
          title: "Duplicate incident",
          status: "resolved",
        }}
        onViewDetails={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /view details/i,
      })
    );

    expect(onViewDetails).toHaveBeenCalledOnce();
  });

  it("calls onDismiss", async () => {
    const user = userEvent.setup();
    const onDismiss = vi.fn();

    render(
      <SimilarIncidentBanner
        incident={{
          ticket: "INC-001",
          title: "Duplicate incident",
          status: "resolved",
        }}
        onDismiss={vi.fn()}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /close banner/i,
      })
    );

    expect(onDismiss).toHaveBeenCalledOnce();
  });
});