import type {
  FieldErrors,
  UseFormRegister,
} from "react-hook-form";

import type { RegisterFormData } from "../../../../schemas/auth/registerSchema";

export interface RegisterFormProps {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  register: UseFormRegister<RegisterFormData>;
  errors: FieldErrors<RegisterFormData>;
  isPending: boolean;
  error?: string;
}