import type { FormEventHandler } from "react";

export interface RegisterFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
}