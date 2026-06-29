import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

import { VerifyCodeForm } from "../../../../src/components/ui/organisms/VerifyCodeForm";

import type {
  VerifyCodeFormData,
} from "../../../schemas/auth/verifyCodeSchema";

function renderForm(
  props: Partial<
    React.ComponentProps<typeof VerifyCodeForm>
  > = {}
) {
  function Wrapper() {
    const {
      control,
      formState: { errors },
    } = useForm<VerifyCodeFormData>();

    return (
      <MemoryRouter>
        <VerifyCodeForm
          control={control}
          errors={errors}
          onSubmit={vi.fn()}
          isPending={false}
          expiresIn="05:00"
          resendIn="00:30"
          canResend={false}
          {...props}
        />
      </MemoryRouter>
    );
  }

  return render(<Wrapper />);
}

describe("VerifyCodeForm", () => {
  it("renders OTP input", () => {
    renderForm();

    expect(
      screen.getByLabelText(/digit 1/i)
    ).toBeInTheDocument();
  });

  it("shows expiration timer", () => {
    renderForm();

    expect(
      screen.getByText("05:00")
    ).toBeInTheDocument();
  });

  it("shows resend timer when resend is disabled", () => {
    renderForm();

    expect(
      screen.getByText("00:30")
    ).toBeInTheDocument();
  });

  it("shows resend button when resend is enabled", () => {
    renderForm({
      canResend: true,
    });

    expect(
      screen.getByRole("button", {
        name: /resend code/i,
      })
    ).toBeInTheDocument();
  });

  it("calls onResend", () => {
    const onResend = vi.fn();

    renderForm({
      canResend: true,
      onResend,
    });

    fireEvent.click(
      screen.getByRole("button", {
        name: /resend code/i,
      })
    );

    expect(onResend).toHaveBeenCalled();
  });

  it("shows success message", () => {
    renderForm({
      success: "Code sent",
      canResend: true,
    });

    expect(
      screen.getByText("Code sent")
    ).toBeInTheDocument();
  });

  it("shows api error", () => {
    renderForm({
      error: "Invalid code",
    });

    expect(
      screen.getByText("Invalid code")
    ).toBeInTheDocument();
  });

  it("disables submit button while pending", () => {
    renderForm({
      isPending: true,
    });

    expect(
      screen.getByRole("button", {
        name: /verifying/i,
      })
    ).toBeDisabled();
  });

  it("calls onSubmit", () => {
    const onSubmit = vi.fn((e) =>
      e.preventDefault()
    );

    renderForm({
      onSubmit,
    });

    fireEvent.submit(
      screen.getByRole("button", {
        name: /verify code/i,
      })
    );

    expect(onSubmit).toHaveBeenCalled();
  });

  it("renders back to login link", () => {
    renderForm();

    expect(
      screen.getByRole("link", {
        name: /back to login/i,
      })
    ).toBeInTheDocument();
  });
});