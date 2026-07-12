import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";

import { ErrorState } from "../../../components/ui/organisms";

describe("ErrorState", () => {
  it("renders title and description", () => {
    render(
      <ErrorState
        title="Network Error"
        description="Unable to load incidents."
      />
    );

    expect(
      screen.getByText("Network Error")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Unable to load incidents.")
    ).toBeInTheDocument();
  });

  it("does not render retry button when onRetry is not provided", () => {
    render(<ErrorState />);

    expect(
      screen.queryByRole("button")
    ).not.toBeInTheDocument();
  });

  it("renders retry button when onRetry is provided", () => {
    render(
      <ErrorState
        onRetry={vi.fn()}
      />
    );

    expect(
      screen.getByRole("button", {
        name: /try again/i,
      })
    ).toBeInTheDocument();
  });

  it("calls onRetry when retry button is clicked", () => {
    const onRetry = vi.fn();

    render(
      <ErrorState
        onRetry={onRetry}
      />
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /try again/i,
      })
    );

    expect(onRetry).toHaveBeenCalledTimes(1);
  });
});