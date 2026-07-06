import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Pagination } from "../../../components/ui/molecules/Pagination";

describe("Pagination", () => {
  it("renders page numbers", () => {
    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={() => {}}
      />
    );

    expect(
      screen.getByText("1")
    ).toBeInTheDocument();

    expect(
      screen.getByText("2")
    ).toBeInTheDocument();

    expect(
      screen.getByText("3")
    ).toBeInTheDocument();
  });

  it("calls onPageChange", async () => {
    const user = userEvent.setup();
    const onPageChange = vi.fn();

    render(
      <Pagination
        currentPage={1}
        totalPages={3}
        onPageChange={onPageChange}
      />
    );

    await user.click(
      screen.getByText("2")
    );

    expect(onPageChange).toHaveBeenCalledWith(2);
  });
});