import { useState } from "react";

import {
  ChevronDown,
  ChevronRight,
} from "../../icons";

import type { FAQItemProps } from "./FAQItem.types";

export default function FAQItem({
  question,
  answer,
}: FAQItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="rounded-xl border border-border bg-surface shadow-sm">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between p-4 text-left"
      >
        <span className="font-medium text-textPrimary">
          {question}
        </span>

        {isOpen ? (
          <ChevronDown
            size={20}
            className="text-textSecondary"
          />
        ) : (
          <ChevronRight
            size={20}
            className="text-textSecondary"
          />
        )}
      </button>

      {isOpen && (
        <div className="border-t border-border px-4 py-3">
          <p className="text-sm text-textSecondary">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
}