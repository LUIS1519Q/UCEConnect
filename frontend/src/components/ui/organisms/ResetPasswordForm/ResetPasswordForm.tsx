import {
  Button,
} from "../../atoms";

import {
  FormField,
  PasswordInput,
} from "../../molecules";

import type { ResetPasswordFormProps } from "./ResetPasswordForm.types";

export default function ResetPasswordForm({
  onSubmit,
}: ResetPasswordFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <FormField
        id="password"
        label="New Password"
        required
      >
        <PasswordInput
          id="password"
          placeholder="Enter your new password"
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm your new password"
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
      >
        Reset Password
      </Button>
    </form>
  );
}