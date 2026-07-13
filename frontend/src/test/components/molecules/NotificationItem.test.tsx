import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { NotificationItem } from "../../../components/ui/molecules/NotificationItem";

describe("NotificationItem", () => {
  it("renders correctly", () => {
    render(
      <NotificationItem
        title="Incident Updated"
        message="Status changed."
        date="Today"
      />
    );

    expect(
      screen.getByText("Incident Updated")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Status changed.")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Today")
    ).toBeInTheDocument();
  });

  it("renders unread notification", () => {
    render(
      <NotificationItem
        title="Incident Updated"
        message="Status changed."
        date="Today"
        unread
      />
    );

    expect(
      screen.getByText("Incident Updated")
    ).toBeInTheDocument();
  });
});