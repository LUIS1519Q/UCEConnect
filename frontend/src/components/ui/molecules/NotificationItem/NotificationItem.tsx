import { Bell } from "../../icons";

import { cn } from "../../../../utils/cn";

import type { NotificationItemProps } from "./NotificationItem.types";

export default function NotificationItem({
  title,
  message,
  date,
  unread = false,
}: NotificationItemProps) {
  return (
    <div
      className={cn(
        "flex gap-4 rounded-xl border border-border bg-surface p-4 shadow-sm",
        unread && "border-primary"
      )}
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
        <Bell
          size={20}
          className="text-primary"
        />
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
    </div>
  );
}