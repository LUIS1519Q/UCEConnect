import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { Timeline } from "../../../components/ui/organisms/Timeline";

describe("Timeline", () => {
  const items = [
    {
      id: "1",
      title: "Incident created",
      description: "The incident was submitted.",
      timestamp: "10:30 AM",
    },
    {
      id: "2",
      title: "Resolved",
      timestamp: "11:00 AM",
    },
  ];

  it("renders all timeline items", () => {
    render(
      <Timeline items={items} />
    );

    expect(
      screen.getByText("Incident created")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Resolved")
    ).toBeInTheDocument();
  });

  it("renders descriptions when provided", () => {
    render(
      <Timeline items={items} />
    );

    expect(
      screen.getByText("The incident was submitted.")
    ).toBeInTheDocument();
  });

  it("renders timestamps", () => {
    render(
      <Timeline items={items} />
    );

    expect(
      screen.getByText("10:30 AM")
    ).toBeInTheDocument();

    expect(
      screen.getByText("11:00 AM")
    ).toBeInTheDocument();
  });
});