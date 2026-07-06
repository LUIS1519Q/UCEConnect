import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { Tabs } from "../../../components/ui/molecules/Tabs";

describe("Tabs", () => {
  it("renders all tabs", () => {
    render(
      <Tabs
        tabs={[
          { label: "Open", value: "open" },
          { label: "Resolved", value: "resolved" },
        ]}
        value="open"
        onChange={vi.fn()}
      />
    );

    expect(screen.getByText("Open")).toBeInTheDocument();
    expect(screen.getByText("Resolved")).toBeInTheDocument();
  });

  it("calls onChange when clicking another tab", () => {
    const onChange = vi.fn();

    render(
      <Tabs
        tabs={[
          { label: "Open", value: "open" },
          { label: "Resolved", value: "resolved" },
        ]}
        value="open"
        onChange={onChange}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /resolved/i,
      })
    );

    expect(onChange).toHaveBeenCalledWith("resolved");
  });
});