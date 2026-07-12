import type { MobileBottomNavProps } from "./MobileBottomNav.types";

export default function MobileBottomNav({
  items,
  primaryAction,
}: MobileBottomNavProps) {
  const [firstItem, secondItem] = items;

  return (
    <nav
      aria-label="Bottom Navigation"
      className="
        relative
        flex
        h-16
        items-center
        justify-between
        border-t
        border-border
        bg-surface
        px-8
      "
    >
      {firstItem && (
        <button
          type="button"
          onClick={firstItem.onClick}
          className={`
            flex
            flex-col
            items-center
            gap-1
            text-xs
            ${firstItem.active ? "text-primary" : "text-textSecondary"}
          `}
        >
          <firstItem.icon size={22} />
          <span>{firstItem.label}</span>
        </button>
      )}

      {primaryAction && (
        <button
          type="button"
          onClick={primaryAction.onClick}
          aria-label={primaryAction.label}
          className="
            absolute
            left-1/2
            top-0
            flex
            h-14
            w-14
            -translate-x-1/2
            -translate-y-1/2
            items-center
            justify-center
            rounded-full
            bg-primary
            text-white
            shadow-lg
          "
        >
          <primaryAction.icon size={26} />
        </button>
      )}

      {secondItem && (
        <button
          type="button"
          onClick={secondItem.onClick}
          className={`
            flex
            flex-col
            items-center
            gap-1
            text-xs
            ${secondItem.active ? "text-primary" : "text-textSecondary"}
          `}
        >
          <secondItem.icon size={22} />
          <span>{secondItem.label}</span>
        </button>
      )}
    </nav>
  );
}