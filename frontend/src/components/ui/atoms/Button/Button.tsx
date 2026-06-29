import type { ButtonProps } from "./Button.types";

const variantStyles = {
  primary:
    "bg-primary text-white hover:opacity-90",

  secondary:
    "border border-primary bg-surface text-primary hover:bg-blue-50",

  danger:
    "bg-danger text-white hover:opacity-90",

  ghost:
    "bg-transparent text-textPrimary hover:bg-gray-100",

  link:
    "bg-transparent p-0 text-primary hover:underline",
};

const sizeStyles = {
  sm: "px-3 py-2 text-sm",
  md: "px-4 py-2 text-base",
  lg: "px-6 py-3 text-lg",
};

export function Button({
  variant = "primary",
  size = "md",
  className = "",
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={`
        inline-flex
        items-center
        justify-center
        rounded-lg
        font-medium
        transition-all
        duration-200
        disabled:cursor-not-allowed
        disabled:opacity-50
        focus:outline-none
        ${variantStyles[variant]}
        ${sizeStyles[size]}
        ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
}