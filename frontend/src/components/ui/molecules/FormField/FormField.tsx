import type { FormFieldProps } from "./FormField.types";

export default function FormField({
  label,
  error,
  required = false,
  children,
}: FormFieldProps) {
  return (
    <div className="space-y-2">

      <label className="text-sm font-medium text-textPrimary">
        {label}

        {required && (
          <span className="ml-1 text-danger">*</span>
        )}
      </label>

      {children}

      {error && (
        <p className="text-sm text-danger">
          {error}
        </p>
      )}

    </div>
  );
}