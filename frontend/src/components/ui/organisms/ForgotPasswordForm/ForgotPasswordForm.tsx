import {
  Button,
  Link,
  TextInput,
} from "../../atoms";

import {
  FormField,
} from "../../molecules";

import type { ForgotPasswordFormProps } from "./ForgotPasswordForm.types";

export default function ForgotPasswordForm({
  onSubmit,
}: ForgotPasswordFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <FormField
        id="email"
        label="Institutional Email"
        required
      >
        <TextInput
          id="email"
          type="email"
          placeholder="Enter your institutional email"
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
      >
        Send Verification Code
      </Button>

      <p className="text-center text-sm text-textSecondary">
        Remember your password?{" "}
        <Link href="#">
          Log in
        </Link>
      </p>
    </form>
  );
}