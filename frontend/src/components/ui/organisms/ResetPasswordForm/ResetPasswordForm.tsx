import {
  Button,
  TextInput,
} from "../../atoms";

import {
  FormField,
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
        <TextInput
          id="password"
          type="password"
          placeholder="Enter your new password"
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
      >
        <TextInput
          id="confirmPassword"
          type="password"
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