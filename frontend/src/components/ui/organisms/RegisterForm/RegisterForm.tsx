import { ROUTES } from "../../../../constants/routes";

import {
  Button,
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

import type { RegisterFormProps } from "./RegisterForm.types";

export default function RegisterForm({
  onSubmit,
  register,
  errors,
  isPending,
  error,
}: RegisterFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-4"
    >
      <FormRow>

        <div className="flex-1">
          <FormField
            id="firstName"
            label="First Name"
            required
            error={errors.firstName?.message}
          >
            <TextInput
              id="firstName"
              placeholder="Enter your first name"
              {...register("firstName")}
            />
          </FormField>
        </div>

        <div className="flex-1">
          <FormField
            id="lastName"
            label="Last Name"
            required
            error={errors.lastName?.message}
          >
            <TextInput
              id="lastName"
              placeholder="Enter your last name"
              {...register("lastName")}
            />
          </FormField>
        </div>

      </FormRow>

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
          placeholder="Create a password"
          {...register("password")}
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
        error={errors.confirmPassword?.message}
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm your password"
          {...register("confirmPassword")}
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
        disabled={isPending}
      >
        {isPending
          ? "Creating Account..."
          : "Create Account"}
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
        Already have an account?{" "}
        <Link to={ROUTES.auth.login}>
          Log in
        </Link>
      </p>
    </form>
  );
}