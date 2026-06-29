import { describe, expect, it, vi } from "vitest";
import {
  fireEvent,
  render,
  screen,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

import { RegisterForm } from "../../../../src/components/ui/organisms/RegisterForm";

import type { RegisterFormData } from "../../../schemas/auth/registerSchema";

function renderForm(
  props: Partial<
    React.ComponentProps<typeof RegisterForm>
  > = {}
) {
  function Wrapper() {
    const {
      register,
      formState: { errors },
    } = useForm<RegisterFormData>();

    return (
      <MemoryRouter>
        <RegisterForm
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

describe("RegisterForm", () => {
  it("renders all input fields", () => {
    renderForm();

    expect(
      screen.getByPlaceholderText(
        /enter your first name/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /enter your last name/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /enter your institutional email/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /create a password/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /confirm your password/i
      )
    ).toBeInTheDocument();
  });

  it("renders microsoft button", () => {
    renderForm();

    expect(
      screen.getByRole("button", {
        name: /continue with microsoft/i,
      })
    ).toBeInTheDocument();
  });

  it("shows api error", () => {
    renderForm({
      error: "Email already exists",
    });

    expect(
      screen.getByText("Email already exists")
    ).toBeInTheDocument();
  });

  it("disables submit button while pending", () => {
    renderForm({
      isPending: true,
    });

    expect(
      screen.getByRole("button", {
        name: /creating account/i,
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
        name: /create account/i,
      })
    );

    expect(onSubmit).toHaveBeenCalled();
  });
});