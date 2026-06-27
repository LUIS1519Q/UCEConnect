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
  register,
  errors,
  isPending,
  error,
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
        <>
          <TextInput
            id="email"
            type="email"
            placeholder="Enter your institutional email"
            {...register("email")}
          />

          {errors.email && (
            <p className="mt-1 text-sm text-red-500">
              {errors.email.message}
            </p>
          )}
        </>
      </FormField>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending
          ? "Sending..."
          : "Send Verification Code"}
      </Button>

      {error && (
        <p className="text-center text-sm text-red-500">
          {error}
        </p>
      )}

      <p className="text-center text-sm text-textSecondary">
        Remember your password?{" "}
        <Link href="#">
          Log in
        </Link>
      </p>
    </form>
  );
}