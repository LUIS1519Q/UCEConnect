import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { EvidenceSection } from "../../../components/ui/organisms/EvidenceSection";

describe("EvidenceSection", () => {
  it("renders a single evidence item", () => {
    render(
      <EvidenceSection
        files={[
          {
            fileName: "report.pdf",
          },
        ]}
      />
    );

    expect(
      screen.getByText("report.pdf")
    ).toBeInTheDocument();
  });

  it("renders multiple evidence items", () => {
    render(
      <EvidenceSection
        files={[
          {
            fileName: "report.pdf",
          },
          {
            fileName: "photo.png",
          },
          {
            fileName: "grades.xlsx",
          },
        ]}
      />
    );

    expect(
      screen.getByText("report.pdf")
    ).toBeInTheDocument();

    expect(
      screen.getByText("photo.png")
    ).toBeInTheDocument();

    expect(
      screen.getByText("grades.xlsx")
    ).toBeInTheDocument();
  });

  it("renders no evidence items when files is empty", () => {
    const { container } = render(
      <EvidenceSection files={[]} />
    );

    expect(container.firstChild).toBeInTheDocument();
    expect(
      screen.queryByRole("button")
    ).not.toBeInTheDocument();
  });
});