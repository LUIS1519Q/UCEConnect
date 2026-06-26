import {
  Button,
  Checkbox,
  Link,
  TextInput,
} from "../../atoms";

import {
  FormField,
  FormRow,
} from "../../molecules";

import type { LoginFormProps } from "./LoginForm.types";

export default function LoginForm({
  onSubmit,
}: LoginFormProps) {
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
          fullWidth
        />
      </FormField>

      <FormField
        id="password"
        label="Password"
        required
      >
        <TextInput
          id="password"
          type="password"
          placeholder="Enter your password"
          fullWidth
        />
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
        >
        Log in

      </Button>
    </form>
  );
}