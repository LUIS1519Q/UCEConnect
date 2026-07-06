import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { EvidenceSection } from "../../../components/ui/organisms/EvidenceSection";

describe("EvidenceSection", () => {
  it("renders evidence files", () => {
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
});