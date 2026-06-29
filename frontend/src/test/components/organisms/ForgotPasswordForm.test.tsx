import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

import { ForgotPasswordForm } from "../../../../src/components/ui/organisms/ForgotPasswordForm";

import type { ForgotPasswordFormData } from "../../../../src/shemas/auth/forgotPasswordSchema";

function renderForm(
  props: Partial<
    React.ComponentProps<typeof ForgotPasswordForm>
  > = {}
) {
  function Wrapper() {
    const {
      register,
      formState: { errors },
    } = useForm<ForgotPasswordFormData>();

    return (
      <MemoryRouter>
        <ForgotPasswordForm
          register={register}
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

describe("ForgotPasswordForm", () => {
  it("renders email field and submit button", () => {
    renderForm();

    expect(
      screen.getByPlaceholderText(
        /enter your institutional email/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /send verification code/i,
      })
    ).toBeInTheDocument();
  });

  it("shows api error", () => {
    renderForm({
      error: "User not found",
    });

    expect(
      screen.getByText("User not found")
    ).toBeInTheDocument();
  });

  it("disables button while pending", () => {
    renderForm({
      isPending: true,
    });

    expect(
      screen.getByRole("button")
    ).toBeDisabled();

    expect(
      screen.getByText(/sending/i)
    ).toBeInTheDocument();
  });

  it("calls onSubmit", () => {
    const onSubmit = vi.fn((e) => e.preventDefault());

    renderForm({
      onSubmit,
    });

    fireEvent.submit(
      screen.getByRole("button")
    );

    expect(onSubmit).toHaveBeenCalled();
  });
});