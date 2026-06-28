import { useRef, useState } from "react";

import { cn } from "../../../../utils/cn";

import type { OTPInputProps } from "./OTPInput.types";

export default function OTPInput({
  length = 6,
  value,
  onChange,
}: OTPInputProps) {
  const [internalValue, setInternalValue] = useState<string[]>(
    value ?? Array(length).fill("")
  );

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const updateValue = (updated: string[]) => {
    setInternalValue(updated);
    onChange?.(updated);
  };

  const handleChange = (
    index: number,
    input: string
  ) => {
    if (!/^\d*$/.test(input)) return;

    const updated = [...internalValue];
    updated[index] = input.slice(-1);

    updateValue(updated);

    if (input && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (
      e.key === "Backspace" &&
      !internalValue[index] &&
      index > 0
    ) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (
    e: React.ClipboardEvent<HTMLInputElement>
  ) => {
    e.preventDefault();

    const pasted = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, length)
      .split("");

    if (!pasted.length) return;

    const updated = Array(length).fill("");

    pasted.forEach((digit, index) => {
      updated[index] = digit;
    });

    updateValue(updated);

    const lastIndex = Math.min(
      pasted.length,
      length
    ) - 1;

    inputRefs.current[lastIndex]?.focus();
  };

  return (
    <div className="flex justify-center gap-2 sm:gap-3">
      {internalValue.map((digit, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          autoComplete="one-time-code"
          maxLength={1}
          value={digit}
          aria-label={`Digit ${index + 1}`}
          onPaste={handlePaste}
          onKeyDown={(e) =>
            handleKeyDown(index, e)
          }
          onChange={(e) =>
            handleChange(index, e.target.value)
          }
          className={cn(
            "h-12 w-12 rounded-xl border border-border bg-surface text-center text-lg font-semibold text-textPrimary transition focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:h-14 sm:w-14"
          )}
        />
      ))}
    </div>
  );
}