import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { FAQItem } from "../../../components/ui/molecules/FAQItem";

describe("FAQItem", () => {
  it("renders question", () => {
    render(
      <FAQItem
        question="How do I create an incident?"
        answer="Fill out the form."
      />
    );

    expect(
      screen.getByText("How do I create an incident?")
    ).toBeInTheDocument();
  });

  it("shows the answer when clicked", async () => {
    const user = userEvent.setup();

    render(
      <FAQItem
        question="How do I create an incident?"
        answer="Fill out the form."
      />
    );

    await user.click(
      screen.getByRole("button")
    );

    expect(
      screen.getByText("Fill out the form.")
    ).toBeInTheDocument();
  });
});