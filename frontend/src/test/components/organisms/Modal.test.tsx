import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { Modal } from "../../../components/ui/organisms";

describe("Modal", () => {
  it("renders title and content when open", () => {
    render(
      <Modal open title="Test Modal">
        <p>Modal content</p>
      </Modal>
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Test Modal")).toBeInTheDocument();
    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <Modal open={false} title="Hidden">
        <p>Hidden content</p>
      </Modal>
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("renders footer when provided", () => {
    render(
      <Modal
        open
        title="Footer"
        footer={<button>Close</button>}
      >
        Content
      </Modal>
    );

    expect(
      screen.getByRole("button", { name: "Close" })
    ).toBeInTheDocument();
  });

  it("calls onClose when clicking the overlay", () => {
    const onClose = vi.fn();

    render(
      <Modal
        open
        title="Overlay"
        onClose={onClose}
      >
        Content
      </Modal>
    );

    fireEvent.click(screen.getByTestId("modal-overlay"));

    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it("does not call onClose when clicking inside the modal", () => {
    const onClose = vi.fn();

    render(
      <Modal
        open
        title="Content"
        onClose={onClose}
      >
        <p>Body</p>
      </Modal>
    );

    fireEvent.click(screen.getByRole("dialog"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("does not close on overlay click when closeOnOverlayClick is false", () => {
    const onClose = vi.fn();

    render(
      <Modal
        open
        title="No Close"
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        Content
      </Modal>
    );

    fireEvent.click(screen.getByTestId("modal-overlay"));

    expect(onClose).not.toHaveBeenCalled();
  });
});