import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import {
  FileText,
  FilePlus2,
  LogOut,
} from "../../../components/ui/icons";

import { AppSidebar } from "../../../components/ui/organisms/AppSidebar";

describe("AppSidebar", () => {
  it("renders primary action", () => {
    render(
      <AppSidebar
        primaryAction={{
          label: "New Incident",
          icon: FilePlus2,
        }}
        items={[]}
      />
    );

    expect(
      screen.getByText("New Incident")
    ).toBeInTheDocument();
  });

  it("renders navigation items", () => {
    render(
      <AppSidebar
        items={[
          {
            label: "My Incidents",
            icon: FileText,
          },
        ]}
      />
    );

    expect(
      screen.getByText("My Incidents")
    ).toBeInTheDocument();
  });

  it("renders logo", () => {
    render(
      <AppSidebar
        items={[]}
      />
    );

    expect(
      screen.getByAltText("UCEConnect")
    ).toBeInTheDocument();
  });

  it("renders bottom items", () => {
    render(
      <AppSidebar
        items={[]}
        bottomItems={[
          {
            label: "Logout",
            icon: LogOut,
          },
        ]}
      />
    );

    expect(
      screen.getByText("Logout")
    ).toBeInTheDocument();
  });

  it("renders active primary action", () => {
    render(
      <AppSidebar
        primaryAction={{
          label: "New Incident",
          icon: FilePlus2,
          active: true,
        }}
        items={[]}
      />
    );

    expect(
      screen.getByText("New Incident")
    ).toBeInTheDocument();
  });
});