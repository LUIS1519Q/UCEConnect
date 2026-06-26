import { useState } from "react";

import { Eye, EyeOff } from "../../icons";

import type { TextInputProps } from "./TextInput.types";

export default function TextInput({
  fullWidth = true,
  className = "",
  type = "text",
  ...props
}: TextInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";

  return (
    <div className={`relative ${fullWidth ? "w-full" : ""}`}>
      <input
        type={
          isPassword
            ? showPassword
              ? "text"
              : "password"
            : type
        }
        className={`
          h-12
          ${fullWidth ? "w-full" : ""}
          rounded-xl
          border
          border-border
          bg-surface
          px-4
          ${isPassword ? "pr-12" : ""}
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
          ${className}
        `}
        {...props}
      />

      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-3 flex items-center text-textSecondary hover:text-textPrimary"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      )}
    </div>
  );
}