import type { TextInputProps } from "./TextInput.types";

export default function TextInput({
  id,
  label,
  error,
  fullWidth = true,
  className = "",
  ...props
}: TextInputProps) {
  return (
    <div className={fullWidth ? "w-full" : ""}>
      {label && (
        <label
          htmlFor={id}
          className="mb-2 block text-sm font-medium text-textPrimary"
        >
          {label}
        </label>
      )}

      <input
        id={id}
        className={`
          h-12
          w-full
          rounded-xl
          border
          border-border
          bg-surface
          px-4
          text-sm
          text-textPrimary
          placeholder:text-textSecondary
          transition
          duration-150
          focus:border-primary
          focus:outline-none
          focus:ring-2
          focus:ring-primary/20
          disabled:cursor-not-allowed
          disabled:bg-gray-100
          disabled:text-textSecondary
          ${error ? "border-danger" : ""}
          ${className}
        `}
        aria-invalid={!!error}
        {...props}
      />

      {error && (
        <p
          className="mt-2 text-sm text-danger"
          id={`${id}-error`}
        >
          {error}
        </p>
      )}
    </div>
  );
}