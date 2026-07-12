import { NotificationItem } from "../../molecules/NotificationItem";

import type { NotificationListProps } from "./NotificationList.types";

export default function NotificationList({
  notifications,
}: NotificationListProps) {
  return (
    <div className="space-y-4">
      {notifications.map((notification, index) => (
        <NotificationItem
          key={`${notification.title}-${index}`}
          {...notification}
        />
      ))}
    </div>
  );
}