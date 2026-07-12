import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";

import { StatusBadge } from "../../../components/ui/atoms/StatusBadge";

describe("StatusBadge", () => {
  it("renders open status", () => {
    render(<StatusBadge status="open" />);

    expect(
      screen.getByText("Open")
    ).toBeInTheDocument();
  });

  it("renders in progress status", () => {
    render(<StatusBadge status="in_progress" />);

    expect(
      screen.getByText("In Progress")
    ).toBeInTheDocument();
  });

  it("renders resolved status", () => {
    render(<StatusBadge status="resolved" />);

    expect(
      screen.getByText("Resolved")
    ).toBeInTheDocument();
  });

  it("renders rejected status", () => {
    render(<StatusBadge status="rejected" />);

    expect(
      screen.getByText("Rejected")
    ).toBeInTheDocument();
  });

  it("renders cancelled status", () => {
    render(<StatusBadge status="cancelled" />);

    expect(
      screen.getByText("Cancelled")
    ).toBeInTheDocument();
  });
});