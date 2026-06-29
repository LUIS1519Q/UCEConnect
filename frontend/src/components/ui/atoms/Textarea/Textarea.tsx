import { cn } from "../../../../utils/cn";

import type { TextareaProps } from "./Textarea.types";

export default function Textarea({
  fullWidth = true,
  className = "",
  rows = 5,
  ...props
}: TextareaProps) {
  return (
    <textarea
      rows={rows}
      className={cn(
        `
        rounded-xl
        border
        border-border
        bg-surface
        px-4
        py-3
        text-sm
        text-textPrimary
        placeholder:text-textSecondary
        transition
        duration-150
        resize-none
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