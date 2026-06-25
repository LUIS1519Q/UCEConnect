import type { CheckboxProps } from "./Checkbox.types";

export default function Checkbox({
  id,
  label,
  className = "",
  ...props
}: CheckboxProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-center gap-3"
    >
      <input
        id={id}
        type="checkbox"
        className={`
          h-4
          w-4
          rounded
          border-border
          text-primary
          focus:ring-primary
          ${className}
        `}
        {...props}
      />

      {label && (
        <span className="text-sm text-textPrimary">
          {label}
        </span>
      )}
    </label>
  );
}