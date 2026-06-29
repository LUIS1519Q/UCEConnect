import type { FormEventHandler } from "react";

import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import type { LoginPayload } from "../../../../types/auth";

export interface LoginFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;

  register: UseFormRegister<LoginPayload>;

  errors: FieldErrors<LoginPayload>;

  isPending?: boolean;

  error?: string;
}