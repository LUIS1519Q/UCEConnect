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
}: RegisterFormProps) {
  return (
    <form
      onSubmit={onSubmit}
      className="space-y-6"
    >
      <FormRow>
        <FormField
          id="firstName"
          label="First Name"
          required
        >
          <TextInput
            id="firstName"
            placeholder="Enter your first name"
          />
        </FormField>

        <FormField
          id="lastName"
          label="Last Name"
          required
        >
          <TextInput
            id="lastName"
            placeholder="Enter your last name"
          />
        </FormField>
      </FormRow>

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

      <FormField
        id="password"
        label="Password"
        required
      >
        <PasswordInput
          id="password"
          placeholder="Create a password"
        />
      </FormField>

      <FormField
        id="confirmPassword"
        label="Confirm Password"
        required
      >
        <PasswordInput
          id="confirmPassword"
          placeholder="Confirm your password"
        />
      </FormField>

      <Button
        type="submit"
        className="w-full"
      >
        Create Account
      </Button>

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