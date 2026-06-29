import { describe, expect, it, vi } from "vitest";
import {
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { useForm } from "react-hook-form";

import { LoginForm } from "../../../../src/components/ui/organisms/LoginForm";

import type { LoginPayload } from "../../../../src/types/auth";

function renderForm(
  props: Partial<
    React.ComponentProps<typeof LoginForm>
  > = {}
) {
  function Wrapper() {
    const {
      register,
      formState: { errors },
    } = useForm<LoginPayload>();

    return (
      <MemoryRouter>
        <LoginForm
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

describe("LoginForm", () => {
  it("renders email and password fields", () => {
    renderForm();

    expect(
      screen.getByPlaceholderText(
        /enter your institutional email/i
      )
    ).toBeInTheDocument();

    expect(
      screen.getByPlaceholderText(
        /enter your password/i
      )
    ).toBeInTheDocument();
  });

  it("renders remember me checkbox", () => {
    renderForm();

    expect(
      screen.getByLabelText(/remember me/i)
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
      error: "Invalid credentials",
    });

    expect(
      screen.getByText("Invalid credentials")
    ).toBeInTheDocument();
  });

  it("disables submit button while pending", () => {
    renderForm({
      isPending: true,
    });

    expect(
      screen.getByRole("button", {
        name: /signing in/i,
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
        name: /log in/i,
      })
    );

    expect(onSubmit).toHaveBeenCalled();
  });
});