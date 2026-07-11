import { cn } from "../../../../utils/cn";

import { X,} from "../../icons";

import { Link } from "react-router-dom";
import { ROUTES } from "../../../../constants/routes";

import { Logo } from "../../atoms/Logo";

import type { AppSidebarProps } from "./AppSidebar.types";

export default function AppSidebar({
  primaryAction,
  items,
  bottomItems = [],
  mobile = false,
  onItemClick,
}: AppSidebarProps) {
  return (
    <aside
      className={cn(
        `
          bg-primary
          text-white
          flex
          flex-col
          w-64
          sm:w-72
        `,
        mobile
          ? `
              fixed
              left-0
              top-0
              h-screen
              z-50
            `
          : `
              hidden
              lg:flex
              min-h-screen
              shrink-0
            `
      )}
    >
      {/* Logo */}
      <div
        className="
          flex
          h-20
          items-center
          justify-between
          border-b
          border-white/10
          px-6
        "
      >
        <Link to={ROUTES.public.home}>
          <Logo
              variant="horizontal-white"
              className="w-40"
          />
        </Link>

        {mobile && (
            <button
                type="button"
                onClick={onItemClick}
                className="
                    rounded-lg
                    p-2
                    transition-colors
                    hover:bg-white/10
                    lg:hidden
                "
            >
                <X size={22} />
            </button>
        )}
      </div>

      {/* Primary Action */}
      {primaryAction && (
        <div className="p-4">
            <button
            type="button"
            onClick={() => {
              primaryAction.onClick?.();
              onItemClick?.();
            }}
            className={`
                flex
                w-full
                items-center
                justify-center
                gap-2
                rounded-xl
                px-4
                py-3
                font-semibold
                shadow-sm
                transition-colors

                ${
                primaryAction.active
                    ? "bg-gray-100 text-primary"
                    : "bg-white text-primary hover:bg-gray-100"
                }
            `}
            >
            <primaryAction.icon size={20} />

            <span>
                {primaryAction.label}
            </span>
            </button>
        </div>
        )}

      {/* Navigation */}
      <nav
        aria-label="Sidebar Navigation"
        className="
          flex
          flex-1
          flex-col
          gap-2
          px-4
        "
      >
        {items.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              type="button"
              onClick={() => {
                item.onClick?.();
                onItemClick?.();
              }}
              className={`
                flex
                w-full
                items-center
                gap-3
                rounded-xl
                px-4
                py-3
                text-left
                transition-colors
                duration-200

                ${
                  item.active
                    ? "bg-white/20 text-white"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                }
              `}
            >
              <Icon size={20} />

              <span className="font-medium">
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Bottom */}
      {bottomItems.length > 0 && (
        <div
          className="
            border-t
            border-white/10
            p-4
          "
        >
          {bottomItems.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  item.onClick?.();
                  onItemClick?.();
                }}
                className="
                  flex
                  w-full
                  items-center
                  gap-3
                  rounded-xl
                  px-4
                  py-3
                  text-left
                  text-white/80
                  transition-colors
                  duration-200
                  hover:bg-white/10
                  hover:text-white
                "
              >
                <Icon size={20} />

                <span className="font-medium">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </aside>
  );
}