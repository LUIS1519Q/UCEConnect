import { Bell, Menu } from "../../icons";

import { Avatar } from "../../atoms/Avatar";
import { Button } from "../../atoms/Button";

import type { AppHeaderProps } from "./AppHeader.types";

export default function AppHeader({
  studentName,
  avatarUrl,
  notificationCount = 0,
  onNotificationsClick,
  onProfileClick,
  onMenuClick,
  isNotificationsActive,
}: AppHeaderProps) {
  console.log("isNotificationsActive:", isNotificationsActive);
  return (
    
    <header
      className="
        flex
        h-16
        items-center
        justify-between
        border-b
        border-border
        bg-surface
        px-6
        shadow-sm
      "
    >
      <div className="lg:hidden">

        <Button
          variant="ghost"
          size="sm"
          aria-label="Open menu"
          onClick={onMenuClick}
        >
          <Menu size={22} />
        </Button>

      </div>

      <div className="ml-auto flex items-center gap-4">

        <div className="relative">
          <button
            type="button"
            aria-label="Notifications"
            onClick={onNotificationsClick}
            className={`
              rounded-lg p-2 transition-colors
              ${isNotificationsActive 
                ? "bg-blue-100 [&>svg]:stroke-primary" 
                : "hover:bg-background"}
            `}
          >
            <Bell size={20} />
          </button>

          {notificationCount > 0 && (
            <span
              className="
                absolute
                -right-1
                -top-1
                flex
                h-5
                w-5
                items-center
                justify-center
                rounded-full
                bg-danger
                text-xs
                font-semibold
                text-white
              "
            >
              {notificationCount}
            </span>
          )}
        </div>

        <button
            type="button"
            aria-label="Profile"
            onClick={onProfileClick}
            className="
                flex
                items-center
                gap-3
                rounded-lg
                px-2
                py-1
                transition-colors
                hover:bg-background
            "
        >
          <span
            className="
              hidden
              text-sm
              font-medium
              text-textPrimary
              sm:block
            "
          >
            {studentName}
          </span>

          <Avatar
            src={avatarUrl}
            alt={studentName}
          />
        </button>

      </div>
    </header>
  );
}