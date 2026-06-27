import type { FormEventHandler } from "react";

import type {
  Control,
  FieldErrors,
} from "react-hook-form";

import type {
  ResetPasswordFormData,
} from "../../../../pages/auth/resetPasswordSchema";

export interface ResetPasswordFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;

  control: Control<ResetPasswordFormData>;

  errors: FieldErrors<ResetPasswordFormData>;

  isPending?: boolean;

  error?: string;
}