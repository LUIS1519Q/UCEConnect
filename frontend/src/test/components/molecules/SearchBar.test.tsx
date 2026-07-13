import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { SearchBar } from "../../../components/ui/molecules/SearchBar";

describe("SearchBar", () => {
  it("renders correctly", () => {
    render(
      <SearchBar placeholder="Search incidents..." />
    );

    expect(
      screen.getByPlaceholderText("Search incidents...")
    ).toBeInTheDocument();
  });

  it("renders a textbox", () => {
    render(<SearchBar />);

    expect(
      screen.getByRole("textbox")
    ).toBeInTheDocument();
  });

  it("renders the default placeholder", () => {
    render(<SearchBar />);

    expect(
      screen.getByPlaceholderText("Search...")
    ).toBeInTheDocument();
  });
});