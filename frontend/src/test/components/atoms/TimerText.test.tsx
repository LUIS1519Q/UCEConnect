import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { TimerText } from "../../../components/ui/atoms/TimerText";
import { AUTH_TEXT } from "../../../constants/authText";

describe("TimerText", () => {
  it("renders default label", () => {
    render(<TimerText time="00:30" />);

    expect(
      screen.getByText(AUTH_TEXT.resendCodeIn)
    ).toBeInTheDocument();

    expect(
      screen.getByText("00:30")
    ).toBeInTheDocument();
  });

  it("renders custom label", () => {
    render(
      <TimerText
        label="Code expires in"
        time="05:00"
      />
    );

    expect(
      screen.getByText("Code expires in")
    ).toBeInTheDocument();

    expect(
      screen.getByText("05:00")
    ).toBeInTheDocument();
  });
});