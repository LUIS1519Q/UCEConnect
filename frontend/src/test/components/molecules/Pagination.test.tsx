import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "../../../components/ui/molecules/Pagination";

describe("Pagination", () => {
  it("renders current page", () => {
    render(
      <Pagination
        currentPage={2}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: "2",
      })
    ).toHaveAttribute(
      "aria-current",
      "page"
    );
  });

  it("calls onPageChange", async () => {
    const user = userEvent.setup();

    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={onPageChange}
      />
    );

    await user.click(
      screen.getByRole("button", {
        name: "2",
      })
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });

  it("renders at most five page buttons", () => {
    render(
      <Pagination
        currentPage={10}
        totalPages={30}
        onPageChange={() => {}}
      />
    );

    const pageButtons = screen
      .getAllByRole("button")
      .filter((button) =>
        /^\d+$/.test(button.textContent ?? "")
      );

    expect(pageButtons).toHaveLength(5);
  });

  it("disables previous button on first page", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /previous/i,
      })
    ).toBeDisabled();
  });

  it("disables next button on last page", () => {
    render(
      <Pagination
        currentPage={5}
        totalPages={5}
        onPageChange={() => {}}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /next/i,
      })
    ).toBeDisabled();
  });
});