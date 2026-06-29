import { cn } from "../../../../utils/cn";
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
      className={cn(
        "flex items-center gap-3 cursor-pointer",
        className
      )}
    >
      <input
        id={id}
        type="checkbox"
        className="
          h-4
          w-4
          rounded
          border-border
          text-primary
          focus:ring-primary
        "
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