import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ResetPasswordForm } from "../../../../src/components/ui/organisms/ResetPasswordForm";

import type {
  ResetPasswordFormData,
} from "../../../schemas/auth/resetPasswordSchema";

function renderForm(
  props: Partial<
    React.ComponentProps<typeof ResetPasswordForm>
  > = {}
) {
  function Wrapper() {
    const {
      control,
      formState: { errors },
    } = useForm<ResetPasswordFormData>();

    return (
      <MemoryRouter>
        <ResetPasswordForm
          control={control}
          errors={errors}
          onSubmit={vi.fn()}
          isPending={false}
          {...props}
        />
      </MemoryRouter>
    );
  }

  return render(<Wrapper />);
}

describe("ResetPasswordForm", () => {
  it("renders password fields", () => {
    renderForm();

    expect(
      screen.getByPlaceholderText(
        /enter your new password/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /confirm your new password/i
      )
    ).toBeInTheDocument();
  });

  it("shows api error", () => {
    renderForm({
      error: "Passwords do not match",
    });

    expect(
      screen.getByText("Passwords do not match")
    ).toBeInTheDocument();
  });

  it("disables submit button while pending", () => {
    renderForm({
      isPending: true,
    });

    expect(
      screen.getByRole("button", {
        name: /updating/i,
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
        name: /reset password/i,
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