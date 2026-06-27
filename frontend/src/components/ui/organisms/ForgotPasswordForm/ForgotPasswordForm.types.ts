import type { FormEventHandler } from "react";
import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import type { ForgotPasswordFormData } from "../../../../pages/auth/forgotPasswordSchema";

export interface ForgotPasswordFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<ForgotPasswordFormData>;
  errors: FieldErrors<ForgotPasswordFormData>;
  isPending?: boolean;
  error?: string;
}