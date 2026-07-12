import { Bell } from "../../icons";

import { cn } from "../../../../utils/cn";

import type { NotificationItemProps } from "./NotificationItem.types";

export default function NotificationItem({
  title,
  message,
  date,
  unread = false,
  actionLabel,
  onActionClick,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm",
        unread && "border-primary"
      )}
    >
      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
        <Bell
          size={20}
          className="text-primary"
        />

        {unread && (
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-primary" />
        )}
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-textPrimary">
          {title}
        </h3>

        <p className="mt-1 text-sm text-textSecondary">
          {message}
        </p>

        <span className="mt-2 block text-xs text-textSecondary">
          {date}
        </span>
      </div>

      {actionLabel && (
        <button
          onClick={onActionClick}
          className="flex-shrink-0 rounded-lg border border-border px-4 py-2 text-sm font-medium text-textPrimary transition-colors hover:bg-background"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}