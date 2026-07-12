import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { IncidentList } from "../../../components/ui/organisms/IncidentList";

describe("IncidentList", () => {
  it("renders incidents", () => {
    render(
      <IncidentList
        incidents={[
          {
            id: 1,
            ticket: "INC-0001",
            title: "Internet Issue",
            category: "Technology",
            status: "open",
            createdAt: "Today",
          },
          {
            id: 2,
            ticket: "INC-0002",
            title: "Projector",
            category: "Academic",
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