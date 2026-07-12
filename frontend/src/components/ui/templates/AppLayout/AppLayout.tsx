import { useState } from "react";

import { AppHeader } from "../../organisms/AppHeader";
import { AppSidebar } from "../../organisms/AppSidebar";
import { MobileBottomNav } from "../../organisms/MobileBottomNav";
import { MobileMoreMenu } from "../../organisms/MobileMoreMenu";

import { isMobileApp } from "../../../../utils/plataform";

import type { AppLayoutProps } from "./AppLayout.types";

export default function AppLayout({
  title,
  children,
  studentName,
  notificationCount,
  primaryAction,
  sidebarItems,
  bottomItems,
  mobileTabItems,
  mobileMoreMenuItems,
  onNotificationsClick,
  onProfileClick,
  isNotificationsActive,
}: AppLayoutProps) {

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [moreMenuOpen, setMoreMenuOpen] = useState(false);

  if (isMobileApp()) {
    return (
      <div className="flex h-screen flex-col overflow-hidden bg-background">
        <AppHeader
          variant="mobile"
          studentName={studentName}
          notificationCount={notificationCount}
          onNotificationsClick={onNotificationsClick}
          onMoreClick={() => setMoreMenuOpen((prev) => !prev)}
          isNotificationsActive={isNotificationsActive}
        />

        {moreMenuOpen && (
          <MobileMoreMenu
            items={mobileMoreMenuItems ?? []}
            onClose={() => setMoreMenuOpen(false)}
          />
        )}

        <main className="flex min-h-0 flex-1 flex-col overflow-y-auto bg-background p-4">
          <h1 className="mb-4 text-xl font-semibold text-textPrimary">
            {title}
          </h1>
          {children}
        </main>

        <MobileBottomNav
          items={mobileTabItems ?? []}
          primaryAction={primaryAction}
        />
      </div>
    );
  }

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

    {sidebarOpen && (
        <>
          <div
            className="
              fixed
              inset-0
              z-40
              bg-black/40
              lg:hidden
            "
            onClick={() => setSidebarOpen(false)}
          />

          <AppSidebar
            mobile
            primaryAction={primaryAction}
            items={sidebarItems}
            bottomItems={bottomItems}
            onItemClick={() => setSidebarOpen(false)}
          />
        </>
      )}

      <AppSidebar
        primaryAction={primaryAction}
        items={sidebarItems}
        bottomItems={bottomItems}
      />

      <div
        className="
          flex
          min-w-0
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
          onMenuClick={() => setSidebarOpen(true)}
          isNotificationsActive={isNotificationsActive}
        />

        <main
          className="
            flex
            min-h-0
            flex-1
            flex-col
            overflow-y-auto
            bg-background
            p-4
            sm:p-5
            lg:p-6
            xl:p-8
          "
        >
          <div
            className="
              mx-auto
              flex
              min-h-0
              w-full
              max-w-6xl
              flex-1
              flex-col
            "
          >

            <h1
              className="
                mb-5
                text-2xl
                font-semibold
                text-textPrimary
                sm:text-3xl
              "
            >
              {title}
            </h1>

            {children}

          </div>
        </main>

      </div>

    </div>
  );
}