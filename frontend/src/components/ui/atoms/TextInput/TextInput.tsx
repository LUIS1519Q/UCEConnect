import { cn } from "../../../../utils/cn";

import type { TextInputProps } from "./TextInput.types";

export default function TextInput({
  fullWidth = true,
  className = "",
  type = "text",
  ...props
}: TextInputProps) {
  return (
    <input
      type={type}
      className={cn(
        `
        h-12
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
        `,
        fullWidth && "w-full",
        className
      )}
      {...props}
    />
  );
}