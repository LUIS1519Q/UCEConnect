import {
  Button,
  Checkbox,
  Divider,
  Link,
  SocialButton,
  TextInput,
} from "../../atoms";

import {
  FormField,
  FormRow,
  PasswordInput,
} from "../../molecules";

import type { LoginFormProps } from "./LoginForm.types";

export default function LoginForm({
  onSubmit,
  register,
  errors,
  isPending,
  error,
}: LoginFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
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
          fullWidth
          {...register("email")}
        />

        {errors.email && (
          <p className="mt-1 text-sm text-red-500">
            {errors.email.message}
          </p>
        )}
      </FormField>

      <FormField
        id="password"
        label="Password"
        required
      >
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          fullWidth
          {...register("password")}
        />

        {errors.password && (
          <p className="mt-1 text-sm text-red-500">
            {errors.password.message}
          </p>
        )}
      </FormField>

      <FormRow>
        <Checkbox
          id="remember"
          label="Remember me"
        />

        <Link href="#">
          Forgot password?
        </Link>
      </FormRow>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending ? "Signing In..." : "Log in"}
      </Button>

      {error && (
        <p className="text-center text-sm text-red-500">
          {error}
        </p>
      )}

      <Divider />

      <SocialButton provider="microsoft">
        Continue with Microsoft
      </SocialButton>

      <p className="text-center text-sm text-textSecondary">
        Don't have an account?{" "}
        <Link href="#">
          Sign up
        </Link>
      </p>
    </form>
  );
}