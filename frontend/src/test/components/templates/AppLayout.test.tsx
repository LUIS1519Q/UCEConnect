import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {
  FilePlus2,
  FileText,
  User,
  CircleHelp,
  Info,
  LogOut,
} from "lucide-react";

import { AppLayout } from "../../../components/ui/templates/AppLayout";

describe("AppLayout", () => {
  it("renders layout title and children", () => {
    render(
      <AppLayout
        title="My Incidents"
        studentName="John Doe"
        sidebarItems={[]}
      >
        <div>Content</div>
      </AppLayout>
    );

    expect(
      screen.getByRole("heading", {
        name: /my incidents/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByText("Content")
    ).toBeInTheDocument();
  });

  it("renders sidebar items", () => {
    render(
      <AppLayout
        title="My Incidents"
        studentName="John Doe"
        primaryAction={{
          label: "New Incident",
          icon: FilePlus2,
        }}
        sidebarItems={[
          {
            label: "My Incidents",
            icon: FileText,
            active: true,
          },
          {
            label: "Profile",
            icon: User,
          },
          {
            label: "Help",
            icon: CircleHelp,
          },
          {
            label: "About",
            icon: Info,
          },
        ]}
        bottomItems={[
          {
            label: "Logout",
            icon: LogOut,
          },
        ]}
      >
        <div>Content</div>
      </AppLayout>
    );

    const navigation = screen.getByRole("navigation", {
      name: /sidebar navigation/i,
    });

    expect(
      screen.getByRole("button", {
        name: /new incident/i,
      })
    ).toBeInTheDocument();

    expect(
      within(navigation).getByRole("button", {
        name: /my incidents/i,
      })
    ).toBeInTheDocument();

    expect(
      within(navigation).getByRole("button", {
        name: /profile/i,
      })
    ).toBeInTheDocument();

    expect(
      within(navigation).getByRole("button", {
        name: /help/i,
      })
    ).toBeInTheDocument();

    expect(
      within(navigation).getByRole("button", {
        name: /about/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /logout/i,
      })
    ).toBeInTheDocument();
  });

  it("calls notification handler", async () => {
    const user = userEvent.setup();

    const onNotificationsClick = vi.fn();

    render(
      <AppLayout
        title="My Incidents"
        studentName="John Doe"
        sidebarItems={[]}
        onNotificationsClick={onNotificationsClick}
      >
        <div>Content</div>
      </AppLayout>
    );

    await user.click(
      screen.getByLabelText(/notifications/i)
    );

    expect(
      onNotificationsClick
    ).toHaveBeenCalledOnce();
  });
});