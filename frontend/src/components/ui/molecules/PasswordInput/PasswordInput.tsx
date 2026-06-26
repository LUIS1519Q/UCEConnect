import { useState } from "react";

import { TextInput } from "../../atoms";
import { Eye, EyeOff } from "../../icons";

import type { PasswordInputProps } from "./PasswordInput.types";

export default function PasswordInput({
  className = "",
  ...props
}: PasswordInputProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <TextInput
        {...props}
        type={showPassword ? "text" : "password"}
        className={`pr-12 ${className}`}
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="
          absolute
          inset-y-0
          right-3
          flex
          items-center
          text-textSecondary
          transition
          hover:text-textPrimary
        "
      >
        {showPassword ? (
          <EyeOff size={18} />
        ) : (
          <Eye size={18} />
        )}
      </button>
    </div>
  );
}