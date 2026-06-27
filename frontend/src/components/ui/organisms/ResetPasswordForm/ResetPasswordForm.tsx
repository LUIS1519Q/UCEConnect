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
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="password"
              placeholder="Enter your new password"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
      >
        <Controller
          name="confirmPassword"
          control={control}
          render={({ field }) => (
            <PasswordInput
              id="confirmPassword"
              placeholder="Confirm your new password"
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {errors.confirmPassword && (
          <p className="mt-1 text-sm text-red-500">
            {errors.confirmPassword.message}
          </p>
        )}
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
        <Link href="/login">
          Back to Login
        </Link>
      </div>
    </form>
  );
}