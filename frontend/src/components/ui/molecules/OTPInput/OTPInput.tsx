import { useState } from "react";
import type { OTPInputProps } from "./OTPInput.types";

export default function OTPInput({
  length = 6,
  value,
  onChange,
}: OTPInputProps) {
  const [internalValue, setInternalValue] = useState<string[]>(
    value ?? Array(length).fill("")
  );

  const handleChange = (index: number, input: string) => {
    const updated = [...internalValue];
    updated[index] = input.slice(-1);

    setInternalValue(updated);

    onChange?.(updated);
  };

  return (
    <div className="flex gap-3">
      {internalValue.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) =>
            handleChange(index, e.target.value)
          }
          className="
            h-14
            w-14
            rounded-xl
            border
            border-border
            bg-surface
            text-center
            text-lg
            font-semibold
            text-textPrimary
            transition
            focus:border-primary
            focus:outline-none
            focus:ring-2
            focus:ring-primary/20
          "
        />
      ))}
    </div>
  );
}