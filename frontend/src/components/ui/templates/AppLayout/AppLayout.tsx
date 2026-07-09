import { AppHeader } from "../../organisms/AppHeader";
import { AppSidebar } from "../../organisms/AppSidebar";

import type { AppLayoutProps } from "./AppLayout.types";

export default function AppLayout({
  title,
  children,
  studentName,
  notificationCount,
  primaryAction,
  sidebarItems,
  bottomItems,
  onNotificationsClick,
  onProfileClick,
}: AppLayoutProps) {
  return (
    <div
      className="
        flex
        h-screen
        overflow-hidden
        flex-col
        bg-background
        lg:flex-row
      "
    >

      <AppSidebar
        primaryAction={primaryAction}
        items={sidebarItems}
        bottomItems={bottomItems}
      />

      <div
        className="
          flex
          min-h-0
          flex-1
          flex-col
        "
      >

        <AppHeader
          studentName={studentName}
          notificationCount={notificationCount}
          onNotificationsClick={onNotificationsClick}
          onProfileClick={onProfileClick}
        />

        <main
          className="
            flex
            min-h-0
            flex-1
            flex-col
            bg-background
            p-8
          "
        >
          <div
            className="
              mx-auto
              flex
              min-h-0
              w-full
              max-w-7xl
              flex-1
              flex-col
            "
          >

            <h1 className="mb-6 text-3xl font-bold text-textPrimary">
              {title}
            </h1>

            {children}

          </div>
        </main>

      </div>

    </div>
  );
}