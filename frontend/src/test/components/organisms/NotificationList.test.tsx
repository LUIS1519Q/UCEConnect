import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { NotificationList } from "../../../components/ui/organisms/NotificationList";

describe("NotificationList", () => {
  it("renders notifications", () => {
    render(
      <NotificationList
        notifications={[
          {
            title: "Updated",
            message: "Status changed",
            date: "Today",
          },
        ]}
      />
    );

    expect(screen.getByText("Updated")).toBeInTheDocument();
    expect(screen.getByText("Status changed")).toBeInTheDocument();
  });
});