import type { FormEventHandler } from "react";

import type {
  Control,
  FieldErrors,
} from "react-hook-form";

import type {
  VerifyCodeFormData,
} from "../../../../schemas/auth/verifyCodeSchema";

export interface VerifyCodeFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
  control: Control<VerifyCodeFormData>;
  errors: FieldErrors<VerifyCodeFormData>;
  isPending?: boolean;
  error?: string;

  expiresIn?: string;
  resendIn?: string;
  canResend?: boolean;
  onResend?: () => void;
  success?: string;
}