import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";

import { ChatBubble } from "../../../components/ui/molecules/ChatBubble";

describe("ChatBubble", () => {
  it("renders sender", () => {
    render(
      <ChatBubble
        sender="Case Manager"
        senderType="manager"
        message="Hello"
        timestamp="10:00 AM"
      />
    );

    expect(
      screen.getByText("Case Manager")
    ).toBeInTheDocument();
  });

  it("renders message", () => {
    render(
      <ChatBubble
        sender="Case Manager"
        senderType="manager"
        message="Hello"
        timestamp="10:00 AM"
      />
    );

    expect(
      screen.getByText("Hello")
    ).toBeInTheDocument();
  });

  it("renders timestamp", () => {
    render(
      <ChatBubble
        sender="Case Manager"
        senderType="manager"
        message="Hello"
        timestamp="10:00 AM"
      />
    );

    expect(
      screen.getByText("10:00 AM")
    ).toBeInTheDocument();
  });

  it("renders student message", () => {
    render(
      <ChatBubble
        sender="Student"
        senderType="student"
        message="Thanks!"
        timestamp="11:00 AM"
      />
    );

    expect(
      screen.getByText("Student")
    ).toBeInTheDocument();

    expect(
      screen.getByText("Thanks!")
    ).toBeInTheDocument();
  });
});