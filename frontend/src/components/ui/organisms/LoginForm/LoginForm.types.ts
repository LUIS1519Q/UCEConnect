import type { FormEventHandler } from "react";

export interface LoginFormProps {
  onSubmit?: FormEventHandler<HTMLFormElement>;
}