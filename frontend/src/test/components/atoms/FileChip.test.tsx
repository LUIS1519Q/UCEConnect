import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FileChip } from "../../../components/ui/atoms/FileChip";

describe("FileChip", () => {
  it("renders the file name", () => {
    render(
      <FileChip fileName="incident-report.pdf" />
    );

    expect(
      screen.getByText("incident-report.pdf")
    ).toBeInTheDocument();
  });

  it("renders the component container", () => {
    const { container } = render(
      <FileChip fileName="incident-report.pdf" />
    );

    expect(container.firstChild).toBeInTheDocument();
  });
});