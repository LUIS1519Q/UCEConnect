import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { EvidenceItem } from "../../../components/ui/molecules/EvidenceItem";

describe("EvidenceItem", () => {
  it("renders the file name", () => {
    render(
      <EvidenceItem fileName="report.pdf" />
    );

    expect(
      screen.getByText("report.pdf")
    ).toBeInTheDocument();
  });

  it("renders remove button when onRemove is provided", () => {
    render(
      <EvidenceItem
        fileName="report.pdf"
        onRemove={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /remove file/i,
      })
    ).toBeInTheDocument();
  });

  it("does not render remove button when onRemove is not provided", () => {
    render(
      <EvidenceItem fileName="report.pdf" />
    );

    expect(
      screen.queryByRole("button", {
        name: /remove file/i,
      })
    ).not.toBeInTheDocument();
  });

  it("calls onRemove when remove button is clicked", async () => {
    const user = userEvent.setup();
    const onRemove = vi.fn();

    render(
      <EvidenceItem
        fileName="report.pdf"
        onRemove={onRemove}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: /remove file/i,
      })
    );

    expect(onRemove).toHaveBeenCalledOnce();
  });
});