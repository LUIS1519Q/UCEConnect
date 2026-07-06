import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { IncidentList } from "../../../components/ui/organisms/IncidentList";

describe("IncidentList", () => {
  it("renders incidents", () => {
    render(
      <IncidentList
        incidents={[
          {
            id: "INC-0001",
            title: "Internet Issue",
            location: "Building A",
            status: "open",
            createdAt: "Today",
          },
          {
            id: "INC-0002",
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

});