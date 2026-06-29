import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { Link } from "../../../components/ui/atoms/Link";

describe("Link", () => {
  it("renders the link text and href", () => {
    render(
      <MemoryRouter>
        <Link to="/login">Log in</Link>
      </MemoryRouter>
    );

    const link = screen.getByRole("link", {
      name: /log in/i,
    });

    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/login");
  });

  it("applies underline class", () => {
    render(
      <MemoryRouter>
        <Link to="/login" underline>
          Log in
        </Link>
      </MemoryRouter>
    );

    expect(
      screen.getByRole("link")
    ).toHaveClass("underline");
  });
});