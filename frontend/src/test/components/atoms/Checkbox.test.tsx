import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { Checkbox } from "../../../components/ui/atoms/Checkbox";

describe("Checkbox", () => {
  it("renders the label", () => {
    render(
      <Checkbox
        id="remember"
        label="Remember me"
      />
    );

    expect(
      screen.getByLabelText("Remember me")
    ).toBeInTheDocument();
  });

  it("can be checked", async () => {
    const user = userEvent.setup();

    render(
      <Checkbox
        id="remember"
        label="Remember me"
      />
    );

    const checkbox = screen.getByRole("checkbox");

    await user.click(checkbox);

    expect(checkbox).toBeChecked();
  });
});