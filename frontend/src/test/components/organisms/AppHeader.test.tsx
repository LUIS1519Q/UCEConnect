import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { AppHeader } from "../../../components/ui/organisms/AppHeader";

describe("AppHeader", () => {
  it("renders student name", () => {
    render(
      <AppHeader
        studentName="John Doe"
      />
    );

    expect(
      screen.getByText("John Doe")
    ).toBeInTheDocument();
  });

  it("renders notification badge", () => {
    render(
      <AppHeader
        studentName="John Doe"
        notificationCount={5}
      />
    );

    expect(
      screen.getByText("5")
    ).toBeInTheDocument();
  });

  it("calls notification click", async () => {
    const user = userEvent.setup();
    const onNotificationsClick = vi.fn();

    render(
      <AppHeader
        studentName="John Doe"
        onNotificationsClick={onNotificationsClick}
      />
    );

    await user.click(
      screen.getByLabelText(/notifications/i)
    );

    expect(onNotificationsClick).toHaveBeenCalledOnce();
  });

  it("calls profile click", async () => {
    const user = userEvent.setup();
    const onProfileClick = vi.fn();

    render(
        <AppHeader
        studentName="John Doe"
        onProfileClick={onProfileClick}
        />
    );

    await user.click(
        screen.getByLabelText(/profile/i)
    );

    expect(onProfileClick).toHaveBeenCalledOnce();
    });
});