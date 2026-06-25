import type { ButtonProps } from "./Button.types";

const variantStyles = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500",

  secondary:
    "border border-blue-600 bg-white text-blue-600 hover:bg-blue-50 focus:ring-2 focus:ring-blue-500",

  danger:
    "bg-red-600 text-white hover:bg-red-700 focus:ring-2 focus:ring-red-500",

  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100",

  link:
    "bg-transparent text-blue-600 hover:underline p-0",
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