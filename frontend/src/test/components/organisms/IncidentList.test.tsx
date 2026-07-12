import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { IncidentList } from "../../../components/ui/organisms/IncidentList";

describe("IncidentList", () => {
  it("renders incidents", () => {
    render(
      <IncidentList
        incidents={[
          {
            title: "Internet Issue",
            location: "Building A",
            status: "open",
            createdAt: "Today",
          },
          {
            title: "Projector",
            location: "Building B",
            status: "resolved",
            createdAt: "Yesterday",
          },
        ]}
      />
    );

    expect(screen.getByText("Internet Issue")).toBeInTheDocument();
    expect(screen.getByText("Projector")).toBeInTheDocument();
  });

  it("renders search bar", () => {
    render(<IncidentList incidents={[]} />);

    expect(
      screen.getByPlaceholderText("Search incidents...")
    ).toBeInTheDocument();
  });
});