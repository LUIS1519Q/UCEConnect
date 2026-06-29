import { ROUTES } from "../../../../constants/routes";

import {
  Button,
  Link,
} from "../../atoms";

import {
  FormField,
  PasswordInput,
} from "../../molecules";

import type { ResetPasswordFormProps } from "./ResetPasswordForm.types";
import { Controller } from "react-hook-form";

export default function ResetPasswordForm({
  onSubmit,
  control,
  errors,
  isPending,
  error,
}: ResetPasswordFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <FormField
          id="password"
          label="New Password"
          required
          error={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="password"
              placeholder="Enter your new password"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
        error={errors.confirmPassword?.message}
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={field.value ?? ""}
              onChange={field.onChange}
            />
          )}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending
          ? "Updating..."
          : "Reset Password"}
      </Button>
      {error && (
        <p className="text-center text-sm text-red-500">
          {error}
        </p>
      )}

      <div className="text-center">
      <Link to={ROUTES.auth.login}>
        Back to Login
      </Link>
    </div>
    </form>
  );
}