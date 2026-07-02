import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { FAQSection } from "../../../components/ui/organisms/FAQSection";

describe("FAQSection", () => {
  it("renders faq items", () => {
    render(
      <FAQSection
        faqs={[
          {
            question: "How?",
            answer: "Like this.",
          },
        ]}
      />
    );

    expect(screen.getByText("How?")).toBeInTheDocument();
  });

  it("renders search bar", () => {
    render(<FAQSection faqs={[]} />);

    expect(
      screen.getByPlaceholderText("Search help topics...")
    ).toBeInTheDocument();
  });
});