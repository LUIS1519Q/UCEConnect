import { cn } from "../../../../utils/cn";

import type { ChatBubbleProps } from "./ChatBubble.types";

export default function ChatBubble({
  sender,
  senderType,
  message,
  timestamp,
}: ChatBubbleProps) {
  const isStudent = senderType === "student";

  return (
    <div
      className={cn(
        "flex w-full",
        isStudent
          ? "justify-end"
          : "justify-start"
      )}
    >
      <div
        className={cn(
          `
          max-w-[80%]
          rounded-xl
          border
          p-4
          shadow-sm
          `,
          isStudent
            ? "border-primary bg-blue-50"
            : "border-border bg-surface"
        )}
      >
        <div className="mb-2 flex items-center justify-between gap-4">
          <span className="font-semibold text-textPrimary">
            {sender}
          </span>

          <span className="text-xs text-textSecondary">
            {timestamp}
          </span>
        </div>

        <p className="whitespace-pre-wrap text-sm text-textPrimary">
          {message}
        </p>
      </div>
    </div>
  );
}