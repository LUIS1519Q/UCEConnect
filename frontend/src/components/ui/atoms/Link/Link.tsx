import type { LinkProps } from "./Link.types";

export default function Link({
  children,
  underline = false,
  className = "",
  ...props
}: LinkProps) {
  return (
    <a
      className={`
        text-sm
        font-medium
        text-primary
        transition-colors
        hover:text-blue-700
        ${underline ? "underline" : "no-underline"}
        ${className}
      `}
      {...props}
    >
      {children}
    </a>
  );
}