import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ConversationThread } from "../../../components/ui/organisms/ConversationThread";

describe("ConversationThread", () => {
  const messages = [
    {
      sender: "Case Manager",
      senderType: "manager" as const,
      message: "Hello",
      timestamp: "10:00 AM",
    },
    {
      sender: "Student",
      senderType: "student" as const,
      message: "Hi!",
      timestamp: "10:05 AM",
    },
  ];

  it("renders all chat messages", () => {
    render(
      <ConversationThread
        messages={messages}
      />
    );

    expect(
      screen.getByText("Hello")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Hi!")
    ).toBeInTheDocument();
  });

  it("renders all senders", () => {
    render(
      <ConversationThread
        messages={messages}
      />
    );

    expect(
      screen.getByText("Case Manager")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Student")
    ).toBeInTheDocument();
  });

  it("renders all timestamps", () => {
    render(
      <ConversationThread
        messages={messages}
      />
    );

    expect(
      screen.getByText("10:00 AM")
    ).toBeInTheDocument();

    expect(
      screen.getByText("10:05 AM")
    ).toBeInTheDocument();
  });
});