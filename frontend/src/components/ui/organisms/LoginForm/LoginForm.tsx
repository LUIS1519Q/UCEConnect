import { useMicrosoftLogin } from "../../../../hooks/useMicrosoftLogin"
import { ROUTES } from "../../../../constants/routes";
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

  const { login: microsoftLogin } = useMicrosoftLogin();

  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <FormField
        id="email"
        label="Institutional Email"
        required
        error={errors.email?.message}
      >
        <TextInput
          id="email"
          type="email"
          placeholder="Enter your institutional email"
          fullWidth
          {...register("email")}
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        required
        error={errors.password?.message}
      >
        <PasswordInput
          id="password"
          placeholder="Enter your password"
          fullWidth
          {...register("password")}
        />
      </FormField>

      <FormRow>
        <Checkbox
          id="remember"
          label="Remember me"
        />

        <Link to={ROUTES.auth.forgotPassword}>
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

      <SocialButton
        provider="microsoft"
        type="button"
        onClick={microsoftLogin}
      >
        Continue with Microsoft
      </SocialButton>

      <p className="text-center text-sm text-textSecondary">
        Don't have an account?{" "}
        <Link to={ROUTES.auth.register}>
          Sign up
        </Link>
      </p>
    </form>
  );
}