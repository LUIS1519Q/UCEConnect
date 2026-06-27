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
          >
          <>
            <TextInput
              id="firstName"
              placeholder="Enter your first name"
              {...register("firstName")}
            />

            {errors.firstName && (
              <p className="mt-1 text-sm text-red-500">
                {errors.firstName.message}
              </p>
            )}
          </>
          </FormField>
        </div>

        <div className="flex-1">
          <FormField
            id="lastName"
            label="Last Name"
            required
          >
            <>
              <TextInput
                id="lastName"
                placeholder="Enter your last name"
                {...register("lastName")}
              />

              {errors.lastName && (
                <p className="mt-1 text-sm text-red-500">
                  {errors.lastName.message}
                </p>
              )}
            </>
          </FormField>
        </div>

      </FormRow>

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

      <FormField
        id="password"
        label="Password"
        required
      >
        <>
          <PasswordInput
            id="password"
            placeholder="Create a password"
            {...register("password")}
          />

          {errors.password && (
            <p className="mt-1 text-sm text-red-500">
              {errors.password.message}
            </p>
          )}
        </>
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
      >
        <>
          <PasswordInput
            id="confirmPassword"
            placeholder="Confirm your password"
            {...register("confirmPassword")}
          />

          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-500">
              {errors.confirmPassword.message}
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
        <Link href="#">
          Log in
        </Link>
      </p>
    </form>
  );
}